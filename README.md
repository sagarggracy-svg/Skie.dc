<p align="center">
  <img src="assets/logo.png" width="120" height="120" alt="Skie Logo" style="border-radius: 50%; box-shadow: 0 0 25px rgba(6, 182, 212, 0.4);" />
</p>

<h1 align="center">🌐 SKIE — Official Web Portal & Dashboard</h1>

<p align="center">
  <strong>The fast, modern, responsive website and server dashboard for Skie Discord Bot.</strong>
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/your-username/skie-website"><img src="https://vercel.com/button" alt="Deploy with Vercel" /></a>
  <img src="https://img.shields.io/badge/Hosting-Vercel%20Ready-black?style=for-the-badge&logo=vercel" alt="Vercel Ready" />
  <img src="https://img.shields.io/badge/SSL-Free%20HTTPS-emerald?style=for-the-badge" alt="Free SSL" />
  <img src="https://img.shields.io/badge/Responsive-Mobile%20Optimized-8b5cf6?style=for-the-badge" alt="Mobile Ready" />
</p>

---

## 🚀 1-Minute Vercel Deployment (From Android Mobile)

This repository is pre-configured with `vercel.json` for 100% automatic zero-config deployment.

### Step 1: Create GitHub Repo
1. Open Chrome on your phone and go to **[github.com/new](https://github.com/new)**.
2. Name the repository: `skie-website`.
3. Upload all files from this folder (or push via git).

### Step 2: Import into Vercel
1. Open **[vercel.com](https://vercel.com)** in your mobile browser.
2. Sign in with GitHub (100% Free).
3. Tap **"Add New..."** ➔ **"Project"**.
4. Select your **`skie-website`** repository from the list.
5. Tap **Deploy** (No build settings need to be modified—it detects static HTML automatically).

### Step 3: Your Live Website & Custom Domain
Your website will be live in **15 seconds** with a clean HTTPS URL:
```text
https://skie-website.vercel.app
```

---

## 📂 Web Pages Included

| Page | URL Route | Description |
|---|---|---|
| **Landing Page** | `/` (`index.html`) | Modern homepage featuring live bot card simulator, statistics counter, 22 feature highlights, searchable slash commands, and FAQ. |
| **Server Dashboard** | `/dashboard` (`dashboard.html`) | Web control panel for managing server settings, moderation logs, welcome greetings, and anti-nuke thresholds. |
| **Visual Studio** | `/editor` (`editor.html`) | In-browser drag-and-drop website editor allowing you to customize layout, colors, and text directly on mobile. |
| **Assets** | `/assets/*` | Pre-optimized neon-blue hexagonal Skie logo and favicons. |

---

## ⚙️ Configuration (`vercel.json`)

Pre-configured with:
- **Clean URLs:** Access `/dashboard` instead of `/dashboard.html`.
- **Global Edge Caching:** Static assets and logos cached worldwide with `max-age=31536000`.
- **Security Headers:** Strict origin headers, X-Frame-Options, XSS protection, and Content-Type sniffing prevention.

---

## 📄 License

Licensed under the **MIT License**.
