# A World Away — iPhone / PWA Gift Edition

A single, original **five-chapter** game. The story, hidden artifact and finale are unchanged.

## Publish it with GitHub Pages (no build command needed)

1. Create a new GitHub repository (e.g., `a-world-away`).
2. Unzip **`a-world-away-ios-pwa.zip`**. Upload **the contents of the `a-world-away-ios-pwa/` directory** to the repository root. The root must contain `index.html`, `sw.js`, `mobile.css`, `manifest.webmanifest`, and the `icons/` and `art/` folders.
3. On GitHub, open **Settings → Pages → Build and deployment → Deploy from a branch → `main` → `/(root)` → Save**.
4. Once the HTTPS address is published (often `https://YOUR-USERNAME.github.io/a-world-away/`), open it on an iPhone in Safari. **Do not use the `file://` URL** for PWA testing.
5. Safari **Share → Add to Home Screen**, enable **Open as Web App** if asked, and tap Add. Start the game from the new icon, then rotate your phone to landscape orientation.
6. Open the game once while connected to the internet so its service-worker cache is filled. Test airplane mode afterward.

**Do not upload the creator testing file** to the public gift website; it has access to spoilers.

## Controls

- iPhone landscape: left virtual joystick; right sword, dash, interact; Pip's Sense appears in Chapter 5 as appropriate.
- Tap dialogue text to continue.
- Menu button → pause, journal, music/volume, restart, home.
- Desktop: WASD/Arrows, E, Space, Shift, J, Esc, and Q for Pip.

## Offline and saves

The service worker pre-caches the static game assets. For offline use, the first visit must complete while online. Progress uses the browser's `localStorage` under the same keys as the previous gift builds; **the Home Screen app may have different storage from Safari**. Start and continue the adventure inside the installed app. Updates should leave those keys intact. Back up the repository and avoid changing its URL.

Offline caches or locally saved data may be removed by the device or user; no cloud sync is implemented. This build does not upload progress or personal data.

## Updating the game

If any cached file changes, update `CACHE_NAME` in `sw.js` (for example, increment `v1` to `v2`) before publishing. A connected game installation will retrieve the update on subsequent launch. This prevents mixing newer game code with older assets. Reinstalling or clearing the app's site data can erase saves; avoid doing that for a normal update.

## Deployment notes

- Website must be served over HTTPS for service workers and reliable install behavior (localhost works during development).
- Standalone app supports touch, **landscape-only gameplay on phones**, and safe-area insets. In portrait, a full-screen rotate-your-phone prompt appears instead of the game. If rotated during play, the game pauses; tap Resume when landscape again. **iPhone PWAs cannot reliably force device orientation**, so users must turn the phone and disable Portrait Orientation Lock if needed.
- Audio starts only after pressing Play, due to mobile browser restrictions; backgrounding the page pauses play.
- The gift version hides later chapters and the ending viewer until the final ending is completed.
- The spoiler-free icon is an original golden compass; the Brazil–USA emblem is kept exclusively for the final cinematic.

## Local testing

From this directory run `python3 -m http.server 8080`, then open `http://localhost:8080` on your computer. An iPhone on your network cannot use your computer's `localhost`; for iPhone use a deployed HTTPS URL.

## Landscape-first update

- Portrait phone screens show a non-spoiler “Turn your phone sideways” screen, including an iPhone orientation-lock tip.
- The complete title menu, game, dialogue and cinematic are playable in landscape; on desktop the game behaves normally.
- Turning the phone upright during gameplay pauses safely. After rotating back, select Resume Adventure.
- Updated service-worker cache name to `v2-landscape`; uploading this build over the previous GitHub Pages files does not reset saves.
- iPhone Safari cannot be compelled to change physical orientation. The manifest already requests `landscape` for supporting devices, but the CSS prompt is the dependable iOS behavior.


## iPhone audio and dialogue fix (2026-11-21)

- Portraits now have a wider guaranteed safe region in landscape dialogue; no text should be obscured by either portrait.
- The soundtrack no longer creates the AudioContext before a tap. Music initialization occurs on Play, Resume, or the new **Enable / Test Sound** button. This follows the iOS Web Audio gesture requirement.
- The game reattempts audio resume after iOS suspends/interrupts it; music timing skips elapsed background time.
- A chime test is available both on the title screen and in Pause. If the test is silent, raise volume and check iOS Silent Mode / device audio settings. This does not guarantee a fix for every Safari hardware/audio-session bug.
- The cache is versioned to `v3-audio-dialogue`; replacing files on GitHub Pages will not clear progress. If an old version is still displayed, close/reopen the Home Screen app after Pages finishes deploying.


## Mobile control sizing update
- Enlarged the virtual joystick and action buttons for easier thumb taps during gameplay.
- Increased the reserved side margins in landscape so the bigger controls do not crowd the game canvas.
- Added a little extra touch forgiveness around the buttons.


## New: automatic first-visit iPhone installation instructions

On a **first visit to the public website in iPhone Safari (portrait)**, the orientation gate instead shows a four-step **Add to Home Screen** guide. Users can choose **Continue in Safari Instead** to dismiss the guide (the choice is remembered locally), then rotate to play in the browser. The rotate screen includes **How to Install on iPhone** to re-open the guide, and the title menu still has its installation-help control.

When the game is launched from the **installed Home Screen app**, only the rotate prompt is shown in portrait—no installation guide. iPhone other-browser visitors get the rotate prompt and can access help through the title menu. Installation requires a user action via Safari; this guide cannot trigger installation automatically.

Cache v4 refreshes the CSS, HTML and JavaScript without resetting game saves. Upload the contents of the ZIP to the **root** of your GitHub repository, replacing existing files; do not upload the creator version.


## Installation guide fix v2 (November 2026)
- iPhone portrait browser visits show **Your adventure awaits** with Add to Home Screen instructions by default. No strict Safari user-agent test.
- The guide shows a **SETUP V2** marker to make it easy to tell whether the latest files were deployed.
- After **Continue in Safari Instead**, the rotation gate appears; users can reopen the guide.
- Launched from the iPhone Home Screen, the app skips installation instructions and goes straight to the rotation gate.
- `mobile.css` and `mobile.js` now have versioned asset URLs and are pre-cached by service worker v5, which helps prevent an older installed worker from serving them.
- No save data or chapters are reset by this change.

**When uploading to GitHub:** You must replace `index.html`, `mobile.js`, `mobile.css`, and `sw.js` together. Upload all files in this ZIP to the repository ROOT. If your public `index.html` still starts its `landscape-gate` without `data-mode="install"`, GitHub is still serving an old version. GitHub Pages may need a short deployment delay.
