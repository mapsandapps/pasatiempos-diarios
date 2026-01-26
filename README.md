# Pasatiempos Diarios

Daily puzzle games in Spanish

`npm run dev` for development

## Objeto Oscuro

Go to [http://localhost:5174/objeto-oculto?generate=true](http://localhost:5174/objeto-oculto?generate=true) to generate a new Objeto Oculto puzzle & play it.

You can go to a specific date via query param, e.g. [http://localhost:5174/objeto-oculto?date=2026-09-23](http://localhost:5174/objeto-oculto?date=2026-09-23).

## Sílabas

Go to [http://localhost:5174/silabas-generator](http://localhost:5174/silabas-generator) to generate a new Sílabas puzzle.

You can go to a specific date via query param, e.g. [http://localhost:5174/silabas?date=2026-01-21](http://localhost:5174/silabas?date=2026-01-21).

## Memoria

Go to [http://localhost:5174/memoria-generator](http://localhost:5174/memoria-generator) to generate a new Memoria puzzle.

You can go to a specific date via query param, e.g. [http://localhost:5174/memoria?date=2026-01-25](http://localhost:5174/memoria?date=2026-01-25).

## Daily Games

Currently, Objeto Oscuro, Sílabas, and Memoria have at least a month's worth of puzzles. If there is no puzzle for this specific date, they will select another one based on the date, e.g. by choosing one from the same date of a different month.

## Settings

There is a secret setting page (i.e. not linked from anywhere currenlty) at [http://localhost:5174/settings](http://localhost:5174/settings).

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
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
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
