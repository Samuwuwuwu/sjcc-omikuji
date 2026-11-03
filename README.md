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

Production URL: [SJCC Omikuji](https://sjcc-omikuji.pages.dev/). Deploy the updated static build to Cloudflare Pages to publish local changes.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js | 22.12 or newer |
| Environment variables | None |

`public/_headers` supplies security headers and immutable caching for hashed assets. All paths are same-origin; no runtime APIs, external fonts, analytics, storage, or database are required.

## Experience

- Tap the box three times. Each tap adds a stronger shake, an expanding ink ring, and a lit seal. The third tap triggers a short suspended beat, a burst of rays and paper flecks, and a spring-driven three-panel reveal. No separate draw button is needed.
- Six local grades retain their original weights: 大吉 15, 中吉 20, 小吉 20, 吉 20, 末吉 15, 凶 10. An immediate redraw still excludes the previous grade and uses the remaining relative weights.
- Each draw chooses the grade first, one of that grade's three overall messages second, then one independent prediction for each of Wishes (願事), Studies (学問), Romance (恋愛), Lost items (失せ物), and Travel (旅行). There are 18 overall messages and 90 category predictions. The complete result appears on one paper slip.
- Good fortunes end with “Keep your blessing” and save/share controls. 凶 shows one short cultural note and a “Tie away your bad luck” action. The same paper refolds, moves to a simple rack, and knots around its wire. Share/save controls appear after the knot finishes; the shared image retains the complete fortune and adds a tied rack.
- Share sends a polished 1080 × 1920 PNG through the native Web Share API. The full fortune, small SJCC branding, and `@sjccnyp` are inside the image; nothing depends on captions or links surviving in Instagram. Great blessing has a gold treatment; misfortune uses smoky ink and includes the tied rack. Save Image remains available, and unsupported or failed file sharing downloads the PNG. Cancelling does nothing.
- One quiet `@sjccnyp` link in the header opens the club's Instagram profile. No social SDK, forced follows, analytics, accounts, or rewards are involved.
- Image files are prepared during the reveal so native sharing starts directly from the user's tap, preserving browser user activation.
- The complete paper fits the viewport without an internal scrollbar. The reveal and reading stages share the same dimensions and scale, avoiding a resize or reposition when the paper finishes opening.
- The opened slip follows mouse movement or a single-finger drag with a gentle, spring-smoothed 3D tilt. It settles on release, cancellation, or pointer exit; reduced-motion mode keeps it still. Two-finger pinch zoom remains available.
- Reduced-motion users keep the three-tap interaction, seal feedback, and both endings, with brief fades instead of spatial motion.
- Keyboard focus, screen-reader announcements, and touch targets are included. No sound plays.
- The small book seal in the top-right corner opens an optional cultural guide with Ritual, Grades, and Keep or tie sections. It links to JNTO, supports keyboard navigation and Escape, and returns you to the same point in your draw.

The short cultural note follows [JNTO's explanation of omikuji](https://faq.japan-travel.jnto.go.jp/en/japan-magazine/2007_omikuji/). The Spectrum predictions are original, playful writing, not translations of shrine-issued fortunes.

## Link previews

`index.html` contains static Open Graph and Twitter large-image metadata with the production canonical URL. `public/og-image.png` is a 1200 × 630 PNG using the existing box artwork and local typefaces. It ships with the static build; there is no runtime image service. Deploy the updated build to publish both metadata and image. Social platforms may cache an earlier preview.

The native share behavior follows the [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share); preview tags follow the [Open Graph protocol](https://ogp.me/).

## Fonts

DM Sans, Cormorant Garamond, and Shippori Mincho are included as small local WOFF2 subsets under the SIL Open Font License. Their licenses are in `public/fonts/`. The supplied Sakuran Japanese Culture Club logo is preserved in `public/sakuran-logo.png`.

After adding Japanese characters or changing font assets, run `node scripts/fetch-fonts.mjs` with internet access, then rebuild. This development helper regenerates the Japanese subset from source; the website never contacts Google Fonts.
