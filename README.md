# SJCC Omikuji

A small Japanese fortune-drawing experience for SJCC Spectrum 2026. React, TypeScript, Vite, Tailwind CSS, and Motion for React. Entirely static.

## Run locally

```powershell
npm ci
npm run dev
```

Open the local URL printed by Vite. This starts the frontend; no backend or environment variables are needed.

```powershell
npm run build
npm run preview
```

The production website is generated in `dist/`. The `runner` config loader avoids a Windows sandbox limitation with Vite's bundled config loader.

## Cloudflare Pages

Prepared for Pages, **not deployed**.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js | 22.12 or newer |
| Environment variables | None |

`public/_headers` supplies security headers and immutable caching for hashed assets. All paths are same-origin; no runtime APIs, external fonts, analytics, storage, or database are required.

## Experience

- Tap the box three times. Each tap adds a stronger shake, an expanding ink ring, and a lit seal. The third tap triggers a short suspended beat, a burst of rays and paper flecks, and a spring-driven three-panel reveal. No separate draw button is needed.
- Six local, weighted fortunes live in `src/data/fortunes.ts`. An immediate redraw avoids repeating the previous result.
- Save produces a 1080 × 1440 poster with oversized Japanese lettering and the same local typefaces. Great blessing has a gold treatment; misfortune uses smoky ink. Downloads follow the browser's usual save behavior.
- Share passes the PNG and a caption containing `@sjccnyp` to the native Web Share API. The PNG also includes the handle. Unsupported or failed file sharing falls back to downloading; cancelling the share sheet does nothing. Instagram availability depends on the device and installed apps. Captions and real Instagram mention tags remain under the receiving app's control.
- Image files are prepared during the reveal so native sharing starts directly from the user's tap, preserving browser user activation.
- The viewport and animation stage contain transformed artwork; the paper scales to fit the available space without page scroll.
- Reduced-motion users keep the three-tap interaction and seal feedback, with a brief fade instead of the shake, particles, and unfolding sequence.
- Keyboard focus, screen-reader announcements, and touch targets are included. No sound plays.

## Fonts

DM Sans, Cormorant Garamond, and Shippori Mincho are included as small local WOFF2 subsets under the SIL Open Font License. Their licenses are in `public/fonts/`. The supplied Sakuran Japanese Culture Club logo is preserved in `public/sakuran-logo.png`.

After adding Japanese characters or changing font assets, run `node scripts/fetch-fonts.mjs` with internet access, then rebuild. This development helper regenerates the Japanese subset from source; the website never contacts Google Fonts.
