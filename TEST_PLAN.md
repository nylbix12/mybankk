# OPTP — One Page Test Plan — MyBank

## Projet : MyBank | Version : 1.1 | Date : 2026-04-28

---

| # | Fonctionnalité | Type | Action | Résultat attendu | Niveau | Outil | Statut |
|---|----------------|------|--------|-----------------|--------|-------|--------|
| 1 | Lister les dépenses | Nominal | `GET /api/expenses` | 200 + tableau JSON | Intégration | PHPUnit (CI) | À tester |
| 2 | Lister les dépenses | Nominal | `GET /api/expenses` (liste vide) | 200 + `[]` | Intégration | PHPUnit (CI) | À tester |
| 3 | Ajouter une dépense | Nominal | `POST /api/expenses` `{label, amount, date, category}` | 201 + objet créé avec `id` | Intégration | PHPUnit (CI) | À tester |
| 4 | Ajouter une dépense | Erreur | `POST /api/expenses` sans `label` | 422 Unprocessable Entity | Intégration | PHPUnit (CI) | À tester |
| 5 | Ajouter une dépense | Erreur | `POST /api/expenses` sans `amount` | 422 Unprocessable Entity | Intégration | PHPUnit (CI) | À tester |
| 6 | Ajouter une dépense | Limite | `POST /api/expenses` montant négatif | 422 ou 400 | Intégration | PHPUnit (CI) | À tester |
| 7 | Modifier une dépense | Nominal | `PUT /api/expenses/{id}` | 200 + objet modifié | Intégration | PHPUnit (CI) | À tester |
| 8 | Modifier une dépense | Erreur | `PUT /api/expenses/999` (inexistant) | 404 Not Found | Intégration | PHPUnit (CI) | À tester |
| 9 | Supprimer une dépense | Nominal | `DELETE /api/expenses/{id}` | 204 No Content | Intégration | PHPUnit (CI) | À tester |
| 10 | Supprimer une dépense | Erreur | `DELETE /api/expenses/999` (inexistant) | 404 Not Found | Intégration | PHPUnit (CI) | À tester |
| 11 | Sécurité | Sécurité | `POST` label = `<script>alert(1)</script>` | Données sanitisées en BDD, pas d'exécution JS | Intégration | PHPUnit (CI) | À tester |
| 12 | Affichage frontend | Nominal | Render `<ExpenseList expenses={[...]} />` | Labels visibles dans le DOM | Intégration | Vitest (CI) | À tester |
| 13 | Affichage frontend | Nominal | Render `<ExpenseList expenses={[]} />` | Message "Aucune dépense à afficher" | Intégration | Vitest (CI) | À tester |
| 14 | Formulaire frontend | Nominal | Render `<ExpenseForm />` | Champ amount et bouton Add présents | Intégration | Vitest (CI) | À tester |
| 15 | Parcours complet | Système | `docker compose up` → ajouter une dépense via l'interface → recharger la page | La dépense apparaît dans la liste après rechargement | Système | Manuel | À tester |
| 16 | Parcours complet | Système | `docker compose up` → soumettre le formulaire sans montant | Le formulaire ne se soumet pas, aucune dépense créée | Système | Manuel | À tester |
| 17 | Besoin métier — ajout dépense | Acceptation | **Given** un utilisateur sur la page principale, **When** il saisit label="Loyer", amount=900, category="Housing" et valide, **Then** la dépense apparaît dans sa liste avec le bon montant | Dépense visible avec label et montant corrects | Acceptation | Manuel (Given-When-Then) | À tester |
| 18 | Besoin métier — liste vide | Acceptation | **Given** un utilisateur sans aucune dépense, **When** il ouvre l'application, **Then** il voit le message "Aucune dépense à afficher" | Message d'état vide affiché | Acceptation | Manuel (Given-When-Then) | À tester |
| 19 | Besoin métier — saisie invalide | Acceptation | **Given** un utilisateur sur le formulaire, **When** il tente de valider sans saisir de montant, **Then** aucune dépense n'est créée et le formulaire reste visible | Pas de création, formulaire intact | Acceptation | Manuel (Given-When-Then) | À tester |

---

## Niveaux de tests (C10)

| Niveau | Ce qui est testé | Outil | Exécution |
|--------|-----------------|-------|-----------|
| **Intégration** | Briques techniques ensemble (API ↔ BDD, composants React) | PHPUnit + Vitest | Automatique en CI |
| **Système** | Application complète sur scénario réel du frontend à la base | Procédure manuelle | Après chaque déploiement |
| **Acceptation** | Besoin métier exprimé en langage client (Given-When-Then) | Procédure manuelle | Avant mise en production |

---

## Environnement de test

- **Dev** : poste local — `docker compose up`
- **Pré-prod / CI** : runners GitHub Actions (Ubuntu standardisé) — jobs `ci` et `backend-tests` en parallèle
- **Production** : VPS — accessible sur URL publique

## Critères de passage

- Tous les cas nominaux retournent le bon code HTTP et la bonne structure JSON
- Tous les cas d'erreur sont rejetés avec le bon code HTTP
- Les données XSS ne sont pas exécutées côté client ni stockées brutes
- 0 test en échec dans le pipeline CI
- Les scénarios système et acceptation sont validés manuellement avant chaque merge sur `main`
