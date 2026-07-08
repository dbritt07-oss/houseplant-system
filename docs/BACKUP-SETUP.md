# Plant Daddy HQ — Google Drive backup setup (one-time, ~15 min)

Automatic backup sends your data to **your own** Google Drive. Nothing goes to any other server. To turn it on you create a free Google "OAuth Client ID" once and paste it into Settings. The Client ID is **public** — it is *not* a secret and is safe to keep in the app.

## 1. Create the Google project (once)

1. Go to **console.cloud.google.com** → create a project, e.g. *Plant Daddy HQ*.
2. **APIs & Services → Library** → search **Google Drive API** → **Enable**.
3. **APIs & Services → OAuth consent screen**:
   - User type: **External** → Create.
   - App name *Plant Daddy HQ*; your email for support + developer contact → Save.
   - **Audience / Test users** → add **your own Google account** as a test user. Leave the app in **Testing** — no Google verification is needed while you're a test user.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized JavaScript origins** → add your app's origin with **no path**, e.g. `https://YOURNAME.github.io`.
   - Create → **copy the Client ID** (looks like `1234-abc.apps.googleusercontent.com`).

## 2. Turn it on in the app

1. Open Plant Daddy HQ → **Settings** (gear) → **Your data → Back up to Google Drive**.
2. Paste the **Client ID** into the field → tap **Connect Google Drive**.
3. Approve the Google screen. The app makes a first backup immediately; you'll see **"last backup just now."**

## 3. What happens after

- The app keeps a single file, `plant-daddy-hq-backup.json`, in a private **app-data folder** in your Drive (you won't see it browsing Drive; it's managed via *Drive → Settings → Manage apps*).
- Backups run automatically on meaningful changes and when you open the app; you can also tap **Back up now**.
- On a new or reset phone: install the app → Settings → **Connect Google Drive** → **Restore from Drive**. Everything returns — plants, logs, photos.
- **Disconnect** any time; the app keeps working fully local, and your manual export/import file remains the offline fallback.

## Notes

- The Client ID is stored **only on your device** (never in the app's code or the repo) and is not part of your backup file.
- The access token is held in memory only and is never saved.
- Keep the consent screen in **Testing** for personal use. Publishing/verification is only needed if you ever share the app more widely.
- If a backup ever fails (offline, expired sign-in), Settings shows **"last attempt failed"** and the app simply tries again next time — no data is lost in the meantime.
