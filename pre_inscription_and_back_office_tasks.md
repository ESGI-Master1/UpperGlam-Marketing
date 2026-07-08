# Plan de livraison - pré-inscription, PostHog et back-office

Principe : chaque lot est terminé, vérifié, puis livré par **commit → pull request → merge dans `main`** avant de commencer le suivant.

## État initial déjà livré

- [x] Regrouper les pré-inscriptions particulier et professionnel sur une page dynamique.
- [x] Aligner les formulaires sur le contrat API documenté dans `ressources`.
- [x] Réinitialiser le formulaire et afficher un succès après un `201 Created`.
- [x] Rediriger les anciennes routes vers `/pre-inscription`.
- [x] Créer la connexion, la protection de routes et la gestion des pré-inscriptions du back-office.
- [x] Exclure les routes `/admin` du tracking PostHog.
- [x] Mettre en place les protections de `main`, les conventions de commit et la CI.

## Lot 1 — Fiabiliser le socle analytics et la feuille de route

Objectif : garantir un tracking exploitable, respectueux du consentement et sans données du back-office.

- [x] Auditer le projet PostHog connecté via MCP.
- [x] Comparer les événements du code, le schéma reçu, les actions et les dashboards PostHog.
- [x] Bloquer tous les événements PostHog dont l'URL commence par `/admin`, y compris l'autocapture et les événements techniques.
- [x] Désactiver explicitement les enregistrements de session.
- [x] Tracer les tentatives, succès et erreurs de pré-inscription sans donnée personnelle.
- [x] Vérifier les tests, le lint, le formatage des fichiers modifiés et le build du lot.
- [ ] Vérifier dans l'environnement déployé que `VITE_PUBLIC_POSTHOG_KEY` cible bien le projet PostHog `130601`.
- [ ] Faire un test réel avec consentement accepté et confirmer la réception des événements dans PostHog.
- [ ] Confirmer qu'aucun événement `/admin` n'est reçu.

Constat MCP du 8 juillet 2026 : le projet est accessible et a reçu des événements historiques, mais aucun événement depuis mai 2026. Les nouveaux événements de pré-inscription ne sont donc pas encore observables côté PostHog.

## Lot 2 — Couvrir le funnel de pré-inscription dans PostHog

Prérequis : le lot 1 est mergé et les événements sont visibles dans PostHog.

- [x] Documenter la taxonomie des événements et propriétés non sensibles.
- [x] Ajouter ou mettre à jour les actions PostHog pour : CTA, choix du profil, tentative, succès et erreur.
- [x] Remplacer l'ancien funnel `pageview → CTA → contact` par les funnels :
  - [x] `pageview → CTA pré-inscription → choix du profil → tentative → succès` pour les particuliers ;
  - [x] le même funnel pour les professionnels.
- [x] Ajouter les taux d'erreur par profil et type d'erreur.
- [x] Ajouter la conversion par page d'entrée, CTA, source UTM, appareil et navigateur.
- [x] Ajouter un suivi du consentement accepté sans tenter de mesurer les refus avant consentement.
- [x] Mettre à jour les dashboards `UG - Marketing Conversion` et `UG - Engagement & Trust`.
- [ ] Vérifier que chaque insight retourne des données cohérentes après réception de trafic réel.

Constat MCP du 8 juillet 2026 : les actions PostHog et les insights du funnel sont créés, mais les nouveaux événements/propriétés ne sont pas encore présents dans la taxonomie ingérée. Les requêtes sont valides et se rempliront après déploiement et trafic avec consentement accepté.

## Lot 3 — Valider la pré-inscription de bout en bout

- [ ] Tester une pré-inscription particulier contre l'API réelle.
- [ ] Tester une pré-inscription professionnel contre l'API réelle.
- [ ] Vérifier le succès après `201 Created` et la remise à zéro du formulaire.
- [ ] Vérifier les erreurs de validation, API et réseau.
- [ ] Vérifier les doublons et les soumissions répétées.
- [ ] Vérifier le comportement mobile et l'accessibilité clavier.
- [ ] Vérifier que les anciennes routes ne sont plus référencées.
- [ ] Ajouter les tests manquants sur les erreurs et doubles soumissions.

## Lot 4 — Valider et durcir le back-office

- [ ] Tester la connexion avec un admin et le refus d'un compte non-admin.
- [ ] Vérifier la persistance, l'expiration et la déconnexion de session.
- [ ] Tester la liste et toutes les actions de gestion des pré-inscriptions.
- [ ] Vérifier les états vide, chargement et erreur.
- [ ] Ajouter une confirmation avant toute action sensible.
- [ ] Ajouter des notifications de succès et d'échec.
- [ ] Vérifier le responsive et l'accessibilité du back-office.
- [ ] Ajouter les tests manquants sur les parcours critiques.

## Lot 5 — Améliorer la gestion des pré-inscriptions

- [ ] Ajouter une pagination lorsque le volume le justifie.
- [ ] Ajouter une recherche par email, nom et type de profil.
- [ ] Ajouter des filtres par statut.
- [ ] Ajouter une page de détail si les informations ne tiennent plus dans la liste.
- [ ] Améliorer la gestion des erreurs d'authentification.

## Lot 6 — Maintenance du dépôt

- [ ] Corriger les fichiers historiques signalés par `npm run format:check`.
- [ ] Vérifier `npm run workflow:check` localement.
- [ ] Vérifier les checks GitHub Actions sur une pull request.
- [ ] Vérifier que les protections de branche restent compatibles avec un mainteneur unique.
- [ ] Ajouter un template de pull request et des templates d'issues.
- [ ] Ajouter `CONTRIBUTING.md` et documenter les conventions de commit.
- [ ] Ajouter Dependabot et un audit de sécurité npm.
- [ ] Ajouter un badge CI au `README.md`.
- [ ] Ajouter `CODEOWNERS` seulement lorsque plusieurs contributeurs réguliers rejoignent le projet.
