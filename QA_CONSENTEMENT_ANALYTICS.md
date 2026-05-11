# QA Consentement Analytics

Mise a jour: 10 mai 2026
Scope: Groupe 3 - QA Consentement

## Scenarios cibles

1. Aucun evenement analytics sans consentement.
2. Evenements envoyes apres acceptation.
3. Arret des evenements apres retrait du consentement.

## Automatisation

Tests implementes dans:

- `src/lib/analytics.consent.test.ts`

Commande de test cible:

- `npm run test:consent`

Commande de test complete:

- `npm run test`

## Resultats observes

- Scenario 1: OK
- Scenario 2: OK
- Scenario 3: OK

## Notes

- Les tests valident la logique de blocage/envoi dans la couche `src/lib/analytics.ts`.
- La synchro UI (banniere/preferences) reste couverte par verification manuelle applicative.
