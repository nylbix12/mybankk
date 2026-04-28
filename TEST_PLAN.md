# OPTP — One Page Test Plan — MyBank

## Projet : MyBank | Version : 1.0 | Date : 2026-04-28

---

| # | Fonctionnalité | Type | Action | Résultat attendu | Statut |
|---|----------------|------|--------|-----------------|--------|
| 1 | Lister les dépenses | Nominal | `GET /api/expenses` | 200 + tableau JSON | À tester |
| 2 | Lister les dépenses | Nominal | `GET /api/expenses` (liste vide) | 200 + `[]` | À tester |
| 3 | Ajouter une dépense | Nominal | `POST /api/expenses` `{label, amount, date, category}` | 201 + objet créé avec `id` | À tester |
| 4 | Ajouter une dépense | Erreur | `POST /api/expenses` sans `label` | 422 Unprocessable Entity | À tester |
| 5 | Ajouter une dépense | Erreur | `POST /api/expenses` sans `amount` | 422 Unprocessable Entity | À tester |
| 6 | Ajouter une dépense | Limite | `POST /api/expenses` montant négatif | 422 ou 400 | À tester |
| 7 | Modifier une dépense | Nominal | `PUT /api/expenses/{id}` | 200 + objet modifié | À tester |
| 8 | Modifier une dépense | Erreur | `PUT /api/expenses/999` (inexistant) | 404 Not Found | À tester |
| 9 | Supprimer une dépense | Nominal | `DELETE /api/expenses/{id}` | 204 No Content | À tester |
| 10 | Supprimer une dépense | Erreur | `DELETE /api/expenses/999` (inexistant) | 404 Not Found | À tester |
| 11 | Sécurité | Sécurité | `POST` label = `<script>alert(1)</script>` | Données sanitisées en BDD, pas d'exécution JS | À tester |
| 12 | Affichage frontend | Nominal | Render `<ExpenseList expenses={[...]} />` | Labels visibles dans le DOM | À tester |
| 13 | Affichage frontend | Nominal | Render `<ExpenseList expenses={[]} />` | Message "Aucune dépense à afficher" | À tester |
| 14 | Formulaire frontend | Nominal | Render `<ExpenseForm />` | Champ amount et bouton Add présents | À tester |

---

## Environnement de test

- **Backend** : Symfony 8.0 + PHPUnit 10 — base `mybank_test` (MySQL 8.0 séparée de la dev)
- **Frontend** : React + Vitest + Testing Library
- **CI** : GitHub Actions — jobs `ci` (frontend) et `backend-tests` en parallèle

## Critères de passage

- Tous les cas nominaux retournent le bon code HTTP et la bonne structure JSON
- Tous les cas d'erreur sont rejetés avec le bon code HTTP
- Les données XSS ne sont pas exécutées côté client ni stockées brutes
- 0 test en échec dans le pipeline CI
