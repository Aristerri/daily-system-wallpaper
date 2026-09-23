# DAILY SYSTEM — dynamic iPhone lock-screen wallpaper

A small Next.js project that generates a daily PNG wallpaper from a permanent URL.

## Included in this MVP

- monochrome black/white website UI
- live wallpaper preview
- iPhone presets starting at iPhone 11
- custom `BACKGROUND` HEX
- custom `PRIMARY` HEX
- RU / EN interface language
- year progress ON/OFF
- year progress as `%` or `day / 365`
- birthday countdown ("days left")
- daily object ON/OFF
- 60 procedural pixel flowers
- 60 procedural pixel animals
- 60 procedural pixel geometry objects
- S / M / L pixel-object size
- 60 RU/EN motivation pairs
- minimal technical UI details ON/OFF
- preview randomizer
- URL-based settings, so no account/database is required
- PNG endpoint made for iOS Shortcuts

## 1. Run locally

Install Node.js 20+.

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The wallpaper PNG endpoint is:

```text
http://localhost:3000/api/wallpaper
```

## 2. Deploy with GitHub + Vercel

1. Create a new empty GitHub repository.
2. Upload the **contents** of this project folder (not the ZIP itself).
3. In Vercel choose **Add New → Project**.
4. Import the GitHub repository.
5. Vercel should detect Next.js automatically.
6. Click **Deploy**.
7. Open the Vercel URL.
8. Configure your wallpaper and press **COPY URL**.

No environment variables and no database are needed for this MVP.

## 3. iPhone Shortcut

Create a Shortcut that:

1. gets the contents of the permanent `/api/wallpaper?...` URL;
2. passes the returned image to **Set Wallpaper**;
3. targets the Lock Screen.

Then create a personal Automation to run that Shortcut every day.

A suggested time is shortly after midnight, e.g. 00:05.

The endpoint changes the daily object and daily motivation automatically. The permanent URL itself does not change.

### Important

The automatic wallpaper actions available in Shortcuts can vary by iOS version and language. If your iPhone asks for confirmation when changing the wallpaper, configure the automation permissions allowed by your version of iOS.

## 4. How the permanent URL works

All user settings are encoded in query parameters, for example:

```text
/api/wallpaper?device=iphone11&bg=000000&fg=FFFFFF&lang=ru&year=1&yearMode=percent&birthday=10-24&object=flowers&objectSize=m&motivation=1&details=1&tz=Europe%2FAmsterdam
```

There is no saved profile. The URL *is* the profile.

## 5. Daily logic

The current day is calculated in the user's browser timezone and stored in the URL as `tz`.

The same calendar day always produces the same:
- object index;
- motivation word.

The website's **RANDOMIZE OBJECT + WORD** button adds a temporary preview seed only. It does not modify the permanent URL.

## 6. Pixel objects

The sprites are generated from code in:

```text
lib/sprites.ts
```

There are 60 entries per category:
- flowers
- animals
- geometry

They are 24×24 monochrome matrices and are rendered in the selected PRIMARY color.

This means there are no PNG assets to manage.

## 7. Motivation

The 60 RU/EN pairs are in:

```text
lib/motivation.ts
```

You can edit the words without touching the rest of the generator.

## 8. Device presets

Presets are in:

```text
lib/devices.ts
```

The first and primary test target is:

```text
iPhone 11 — 828 × 1792
```

New presets can be added as one line in the `DEVICES` array.

## 9. Safe zone

The upper part of the generated image is deliberately left mostly empty for iOS Lock Screen clock/widgets.

The exact visual position of Apple's clock/widgets can vary with Lock Screen customization, so test your preferred iOS setup on the device and adjust `safeTop` in:

```text
app/api/wallpaper/route.tsx
```

## Project structure

```text
daily-system-wallpaper/
├─ app/
│  ├─ api/wallpaper/route.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ lib/
│  ├─ date.ts
│  ├─ devices.ts
│  ├─ motivation.ts
│  └─ sprites.ts
├─ .gitignore
├─ next-env.d.ts
├─ next.config.ts
├─ package.json
├─ tsconfig.json
└─ README.md
```

## First thing to test

Deploy the project unchanged and open:

```text
https://YOUR-PROJECT.vercel.app/api/wallpaper?device=iphone11&bg=000000&fg=FFFFFF&lang=ru&year=1&yearMode=percent&birthday=10-24&object=flowers&objectSize=m&motivation=1&details=1&tz=Europe%2FAmsterdam
```

If you see a PNG wallpaper, the generator side is working.
