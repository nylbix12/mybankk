# MyBank

Application de gestion de dépenses personnelles — React + Symfony + MySQL.

---

## CI/CD — Pipeline de déploiement

### Vue d'ensemble

À chaque pull request vers `develop`, le workflow `ci.yml` exécute en parallèle deux jobs : frontend (Vitest + lint + build) et backend (PHPUnit + MySQL). Les branch protection rules empêchent le merge tant que la CI n'est pas verte.

Quand un merge se produit sur `main`, `ci.yml` se relance. S'il passe au vert, `cd.yml` se déclenche et enchaîne deux jobs séquentiels :
1. **build-and-push** : construit les images Docker backend et frontend, les tague avec le SHA court et `latest`, et les publie sur GHCR
2. **deploy** : se connecte en SSH au VPS de production, tire les nouvelles images et redémarre les conteneurs avec `docker compose`

Aucune intervention humaine entre le commit et l'utilisateur final.

### Environnements

| Environnement | Rôle | Infrastructure |
|---------------|------|---------------|
| **Dev** | Développement local | `docker compose up` sur le poste |
| **Pré-prod / CI** | Validation automatisée | Runners GitHub Actions (Ubuntu) |
| **Production** | Servir les utilisateurs | VPS — `http://<ip-publique>` |

### Procédure de déploiement

Entièrement automatisée via `cd.yml`. Prérequis : commit poussé sur `main` + CI verte.

```
push main → CI verte → build images → push GHCR → SSH VPS → docker compose up
```

### Procédure de rollback

Les images sont taguées avec le SHA du commit — chaque version est retrouvable immédiatement.

```bash
# 1. Identifier le SHA du dernier commit stable
git log --oneline -10

# 2. Récupérer l'image stable depuis GHCR
docker pull ghcr.io/nylbix12/mybank-backend:<sha-stable>

# 3. La retagger comme latest et la pousser
docker tag ghcr.io/nylbix12/mybank-backend:<sha-stable> ghcr.io/nylbix12/mybank-backend:latest
docker push ghcr.io/nylbix12/mybank-backend:latest
# (répéter pour le frontend)

# 4. Sur le VPS, tirer et redémarrer
ssh deploy@<ip-vps>
cd /home/deploy/mybank
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Durée estimée : ~3 minutes.

### Tests — trois niveaux (C10)

| Niveau | Ce qui est testé | Outil | Déclenchement |
|--------|-----------------|-------|---------------|
| **Intégration** | API ↔ BDD, composants React | PHPUnit + Vitest | Automatique en CI |
| **Système** | Parcours complet frontend → base | Procédure manuelle (OPTP) | Après chaque déploiement |
| **Acceptation** | Besoin métier en Given-When-Then | Procédure manuelle (OPTP) | Avant merge sur `main` |

Voir [TEST_PLAN.md](TEST_PLAN.md) pour le détail des cas de tests.

### Secrets GitHub requis

| Secret | Rôle |
|--------|------|
| `GITHUB_TOKEN` | Authentification GHCR (automatique) |
| `SERVER_HOST` | IP publique du VPS |
| `SERVER_USER` | Utilisateur SSH (`deploy`) |
| `SSH_PRIVATE_KEY` | Clé privée SSH dédiée au déploiement |
