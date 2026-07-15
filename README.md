# UpperGlam Marketing

[![CI](https://github.com/ESGI-Master1/UpperGlam-Marketing/actions/workflows/ci.yml/badge.svg)](https://github.com/ESGI-Master1/UpperGlam-Marketing/actions/workflows/ci.yml)

Site public, funnel de pre-inscription et back-office UpperGlam, construits avec React, TypeScript et Vite.

## Lancement local

```bash
cp .env.example .env
npm ci
npm run dev
```

Le site est servi par defaut sur `http://localhost:5173` et utilise `VITE_PUBLIC_BACKEND_URL` pour joindre l'API. Les variables `VITE_PUBLIC_*` sont publiques : aucun secret ne doit y etre place.

## Validation et build

```bash
npm run workflow:check
npm run preview
```

Le guide commun local/preview/production, incluant Apache et les sauvegardes, se trouve dans `UpperGlam-Backend/docs/infrastructure.md` lorsque les trois repos sont clones cote a cote.

## Variables

- `VITE_PUBLIC_BACKEND_URL` : URL de l'API.
- `VITE_PUBLIC_LOGIN_URL` : destination de connexion client.
- `VITE_PUBLIC_POSTHOG_KEY` et `VITE_PUBLIC_POSTHOG_HOST` : projet analytics public soumis au consentement.

## Structure

Le code applicatif est dans `src/`, les tests Vitest sont colocalises et la sortie de production est generee dans `dist/`.

<!-- Historical Vite notes retained below for framework maintenance. -->

## Notes Vite

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
