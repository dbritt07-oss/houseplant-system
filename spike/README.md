# T0.4 — Drive backup spike (throwaway)

**Goal:** prove Google Drive OAuth + app-data-folder read/write works from an **installed iOS PWA**, with **no secret in the client**. Pass → the P0 backup epic uses this path. Fail → we use a serverless proxy (Plan B). Delete `spike/` after we record the result.

## What you set up in Google Cloud (~15 min, one time)

1. **console.cloud.google.com** → create a project, e.g. *Plant Daddy HQ*.
2. **APIs & Services → Library** → search **Google Drive API** → **Enable**.
3. **APIs & Services → OAuth consent screen**:
   - User type: **External** → Create.
   - App name *Plant Daddy HQ*, your email for support + developer contact → Save.
   - **Audience / Test users** → add **your own Google account** as a test user. Leave the app in **Testing** (no Google verification needed while you're a test user).
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized JavaScript origins** → add your Pages origin **with no path**, e.g. `https://YOURNAME.github.io`.
   - Create → **copy the Client ID** (looks like `1234-abc.apps.googleusercontent.com`). This is **public**, not a secret.

## What you do on the phone (~5 min)

1. Push the repo so the spike deploys, then open on iPhone Safari:
   `https://YOURNAME.github.io/houseplant-system/spike/drive-backup.html`
2. Paste the **Client ID** into the field.
3. Tap **Connect** → approve the Google screen → expect `✅ Got access token`.
4. Tap **Back up** → expect `✅ Backup created … fileId=…`.
5. Tap **Restore** → expect `✅ Restored contents: {…}` (matching nonce).
6. **Now the real test:** Safari **Share → Add to Home Screen**, open the icon (top says **STANDALONE ✅**), and repeat Connect → Back up → Restore.

## Decision

- **PASS** = the standalone (installed) run completes Connect + Back up + Restore. → Build T4.1–T4.3 on Google Identity Services token flow, client-side, no backend.
- **FAIL** (popup won't open / never returns a token in standalone) = → Plan B: a tiny serverless OAuth proxy (Cloudflare/Netlify/Vercel). Adds ~a week (per the execution plan).

## Findings (fill in during the test)

- Browser-tab run: __
- Standalone (installed PWA) run: __
- Errors seen: __
- Decision: __
