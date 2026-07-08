# Taxonomie PostHog - funnel de pré-inscription

Objectif : suivre le funnel de pré-inscription sans envoyer de donnée personnelle.

## Règles générales

- Les événements sont envoyés uniquement après consentement analytics.
- Les routes `/admin` sont exclues par `before_send`.
- Les enregistrements de session sont désactivés côté frontend.
- Ne jamais envoyer : email, téléphone, nom, prénom, ville, code postal, message libre, mot de passe.
- Tous les événements frontend sont enrichis automatiquement avec :
  - `current_path`, `current_search`, `current_url` ;
  - `entry_path`, `entry_search`, `initial_referrer` ;
  - `referrer` ;
  - `traffic_source` ;
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` lorsqu'ils existent.

## Événements du funnel

| Étape                | Event PostHog              | Propriétés clés                                                                                                                                   | Notes                                                                                       |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Vue de page          | `$pageview` et `page_view` | `pathname`, `search`, `url`                                                                                                                       | `page_view` sert aux dashboards custom ; `$pageview` garde la compatibilité PostHog native. |
| CTA pré-inscription  | `cta_click`                | `funnel_name=pre_signup`, `funnel_step=cta_click`, `cta`, `location`, `to`, `target_role` si connu                                                | Inclut les CTA client, pro et header.                                                       |
| Choix du profil      | `pre_signup_role_selected` | `funnel_name=pre_signup`, `funnel_step=role_selected`, `role`, `form_name`                                                                        | `role=user` pour particulier, `role=provider` pour professionnel.                           |
| Tentative formulaire | `form_submit_attempt`      | `funnel_name=pre_signup`, `funnel_step=submit_attempt`, `role`, `form_name`, `source=marketing_website`                                           | Déclenché avant validation JS métier, hors validation HTML native.                          |
| Succès formulaire    | `form_submit`              | `funnel_name=pre_signup`, `funnel_step=submit_success`, `role`, `form_name`, `source=marketing_website`, `marketing_opt_in`                       | Ne contient aucune donnée d'identité.                                                       |
| Erreur formulaire    | `form_submit_error`        | `funnel_name=pre_signup`, `funnel_step=submit_error`, `role`, `form_name`, `source=marketing_website`, `error_type`, `field` si validation client | `error_type=client_validation` ou `api_or_network`.                                         |
| Consentement accepté | `cookie_consent_updated`   | `status=accepted`                                                                                                                                 | Les refus ne sont pas trackés avant consentement.                                           |

## Actions PostHog créées

- `UG - Pre-signup CTA Click`
- `UG - Pre-signup Role Selected`
- `UG - Pre-signup Submit Attempt`
- `UG - Pre-signup Submit Success`
- `UG - Pre-signup Submit Error`
- `UG - Analytics Consent Accepted`

## Funnels à maintenir

- Particulier : `page_view` marketing → CTA pré-inscription → choix `role=user` → tentative `role=user` → succès `role=user`.
- Professionnel : `page_view` marketing → CTA pré-inscription → choix `role=provider` → tentative `role=provider` → succès `role=provider`.

La première étape n'est pas limitée à `/pre-inscription`, car les CTA de conversion partent principalement de `/client`, `/pro` et du header. Les pages d'entrée se lisent via `entry_path`, `current_path` et les propriétés UTM.

Segments prioritaires :

- `role`
- `form_name`
- `cta`
- `location`
- `entry_path`
- `current_path`
- `traffic_source`
- `utm_source`, `utm_medium`, `utm_campaign`
- navigateur, appareil et OS via propriétés automatiques PostHog.
