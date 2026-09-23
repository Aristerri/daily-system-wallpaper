# DAILY SYSTEM v0.2

Dynamic iPhone Lock Screen wallpaper generator.

## What's new in v0.2

- bilingual website UI: RU / EN
- bold hero typography
- favicon
- device-aware iPhone preview with notch / Dynamic Island
- HSL sliders + HEX input for background and primary colors
- removed decorative counters from hero
- detailed How It Works section
- 8-step iPhone Shortcuts setup guide
- fixed `ImageResponse` rendering for Vercel / next-og

## Deploy

Upload the project contents to the root of the GitHub repository. Vercel will redeploy automatically after the commit.

No environment variables are required.

## Test after deploy

Open:

`/api/wallpaper`

You should see a generated PNG.

Then open the homepage and confirm that the preview inside the phone is visible.
