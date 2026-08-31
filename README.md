# Oumar Habits

An Android habit tracker built as an offline-first web app wrapped in a Kotlin/Compose WebView shell, with an AI coach that degrades to a local rule-based analyzer when no API key is present.

The app tracks habits, focus sessions, mood, schoolwork, chores and prayer times, and turns that data into a daily productivity score and a weekly review.

## Architecture

```
MainActivity (Compose)
  └── AndroidView { WebView }            loads file:///android_asset/www/index.html
        └── AndroidBridge  @JavascriptInterface
              ├── showLocalNotification(title, message)   → NotificationChannel + Toast
              ├── callGeminiAPI(prompt, callbackName)     → OkHttp → Gemini REST
              └── callWeeklyReviewAPI(prompt, callbackName)
```

The entire UI lives in `app/src/main/assets/www/` (~8.9k lines of HTML, CSS and vanilla JS — no framework). The Kotlin side is deliberately thin: it hosts the WebView, wires the hardware back button to WebView history, and exposes three native capabilities the web layer can't reach on its own.

Native calls are asynchronous by callback name rather than by promise: JS passes the name of a global function, Kotlin runs the HTTP call on `Dispatchers.IO`, then calls back into the page with `evaluateJavascript("javascript:$callbackName('$escaped')")`. Responses are escaped before injection.

State is a single JSON blob in `localStorage` under `oumar_habits_state`, so the app works fully offline. A service worker (`sw.js`, cache-first, `oumar-habits-cache-v1`) caches the app shell and the two Google Fonts stylesheets, and `manifest.json` makes the same code installable as a standalone PWA outside the Android wrapper.

## What it actually computes

- **Productivity score** — blends 7-day habit compliance against each habit's schedule (`daily` / `weekdays` / `weekends` / `custom` day sets) with deep-focus minutes against a 350-minute weekly target, rather than just counting checkmarks.
- **Mood/habit correlation** — for each habit, compares average journal mood on days it was completed against days it was missed, and surfaces a habit only when there are at least 2 completed days and a mood delta above 0.3 (labelled *Moderate Positive Impact* above 0.3, *Very Strong Correlation* above 0.8). It's a deliberately conservative heuristic so a single good day can't manufacture an insight.
- **Streaks and a calendar heatmap** — per-habit streaks plus an overall daily streak, rendered as a contribution-style heatmap.
- **Prayer times** — computed locally from solar geometry (equation of time, solar declination, solar transit, latitude 40.8448 / longitude −73.8648) with the timezone offset read at runtime so DST is handled. No API call.
- **Focus timer** — Pomodoro-style modes with a completion chime and a native Android notification through the bridge.
- **School planner and chores** — assignments with a subject datalist, chores, and a generated weekend timeline.
- **Challenges and badges** — evaluated from logged data.
- **Triple daily mood checks** and a weekly reflection journal with per-week selection.

## AI coach, and what happens without a key

`makeGeminiApiCall` reads `BuildConfig.GEMINI_API_KEY` (injected by the Secrets Gradle plugin from `.env`, defaulting to `.env.example`). If the key is missing or still the placeholder, the app does **not** show an error — the web layer falls back to `generateOfflineAIReview()`, which analyzes the last 15 days per habit, separates strengths from weaknesses, and writes the review locally. The AI is an enhancement, not a dependency.

## Setup

```bash
cp .env.example .env      # then set GEMINI_API_KEY=... (optional; app works without it)
./gradlew assembleDebug
```

- `minSdk` 24, `targetSdk` 36, Compose + Material 3, Room, Firebase BOM.
- Debug builds expect a `debug.keystore` at the project root (gitignored, standard `android`/`androiddebugkey` credentials); release signing reads `KEYSTORE_PATH`, `STORE_PASSWORD` and `KEY_PASSWORD` from the environment, so no secrets live in the repo.
- `.env` is gitignored; only `.env.example` with a placeholder is committed.

Tests: `./gradlew test` — includes Robolectric tests and a Roborazzi screenshot test (`app/src/test/screenshots/`).

The web app can also be run on its own, without Android:

```bash
cd app/src/main/assets/www && python3 -m http.server 8000
```

Native features (notifications, Gemini) are no-ops there — `isAndroidNative()` gates them.

## Layout

| Path | Purpose |
| --- | --- |
| `app/src/main/assets/www/app.js` | All app logic — scoring, streaks, prayer times, timer, AI, rendering |
| `app/src/main/assets/www/index.html` | Tab shell and views |
| `app/src/main/assets/www/style.css` | Dark-first design system |
| `app/src/main/assets/www/sw.js` | Cache-first service worker |
| `app/src/main/java/com/example/MainActivity.kt` | WebView host and `AndroidBridge` |
| `app/build.gradle.kts` | Android config, signing, Secrets plugin wiring |

## Status

Working and usable end to end. Known rough edges: the Kotlin package is still `com.example`, prayer-time coordinates are hard-coded to one location instead of using device location, and several Gradle dependencies are commented out rather than removed.
