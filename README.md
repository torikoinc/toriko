# TORIKO

```
studio/   Sanity Studio (schémas, desk en japonais)
web/      Astro statique → Netlify
```

## Lancer en local

```bash
cd web && npm i && npm run dev      # tourne sur les données de démo tant que .env est vide
cd studio && npm i && npm run dev
```

## Brancher Sanity

1. `npx sanity init` dans studio/ (ou créer le projet sur sanity.io) → remplacer `YOUR_PROJECT_ID`
   dans `studio/sanity.config.ts` et `studio/sanity.cli.ts`
2. `web/.env` : `SANITY_PROJECT_ID=xxx`
3. `npm run deploy` dans studio/ → Studio sur toriko.sanity.studio pour le client
4. Créer le document サイト設定 + les 店舗

## Mise à jour auto

- Netlify → Site settings → Build hooks → créer un hook
- Sanity → API → Webhooks → coller l'URL du hook, filtre `_type in ["restaurant","siteSettings"]`, trigger sur create/update/delete
- Netlify (monorepo) : base directory = `web`

## Routing (hash)

| URL | État |
|---|---|
| `/` | home |
| `/#cotorico` | fiche resto |
| `/#cotorico/menu` | + menu |
| `/#cotorico/recruitment` | + recrutement du resto |
| `/#cotorico/about` | ABOUT aux couleurs du resto |
| `/#about` `/#recruitment` `/#contact` | panneaux globaux |

Échap ferme le panneau du dessus.

## Où toucher

- Layout / animations : `web/src/styles/global.css` (haut du fichier = logique 3 colonnes)
- Routing : `web/src/scripts/panels.ts`
- Aperçu image menu au survol : `web/src/scripts/menuHover.ts`
- Requête : `web/src/lib/queries.ts`
