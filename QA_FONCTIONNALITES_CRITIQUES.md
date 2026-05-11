# QA Fonctionnalites Critiques

Mise a jour: 11 mai 2026

## Perimetre couvert (automatisation)

- Consentement analytics (opt-in / opt-out): `src/lib/analytics.consent.test.ts`
- Session admin locale (token/email): `src/lib/adminSession.test.ts`
- Guard d'acces admin (redirect + autorisation): `src/components/admin/AdminRequireAuth.test.tsx`
- Flux API admin critiques:
  - login admin
  - listing pre-inscriptions avec filtres + header auth
  - gestion d'erreur metier mappee (`VALIDATION_ERROR`)
  - fichier: `src/lib/adminApi.test.ts`
- Flux UI critiques:
  - pre-inscription client/pro + validation minimum: `src/components/pre-signup/PreSignupForm.test.tsx`
  - contact + etat de confirmation: `src/pages/Contact.test.tsx`
  - actions admin approve/reject: `src/pages/admin/AdminPreRegistrations.test.tsx`

## Commandes

- Tous les tests: `npm run test`
- Consentement uniquement: `npm run test:consent`

## Resultat actuel

- Tests: OK
- Lint: OK
- Build: OK
