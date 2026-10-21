<p align="center">
  <img src="assets/logo.png" width="130" height="130" alt="Skie Logo" style="border-radius: 50%; box-shadow: 0 0 25px rgba(6, 182, 212, 0.4);" />
</p>

<h1 align="center">⚡ 𝐒𝐤𝐢𝐞 — The Ultimate All-In-One Discord Bot</h1>

<p align="center">
  <strong>"One bot. Every community."</strong>
</p>

<p align="center">
  <a href="https://discord.com/oauth2/authorize?client_id=1558750474885406740&permissions=8&scope=bot%20applications.commands"><img src="https://img.shields.io/badge/Discord-Invite%20Skie-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Invite 𝐒𝐤𝐢𝐞" /></a>
  <img src="https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.13" />
  <img src="https://img.shields.io/badge/discord.py-2.7+-blue?style=for-the-badge&logo=discord" alt="discord.py" />
  <img src="https://img.shields.io/badge/Architecture-33%20Suites%20%7C%20230%20Cmds-ef4444?style=for-the-badge" alt="Architecture" />
  <img src="https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge" alt="MIT License" />
</p>

---

## 📖 Overview

**𝐒𝐤𝐢𝐞** is an enterprise-grade, all-in-one Discord bot engineered to replace the clutter of 10+ separate bots in a community server. It brings real-time **Anti-Nuke defense**, **24/7 multi-VC music streaming**, **disciplinary jail containment**, **automated audit logging**, **join-to-create temporary voice channels**, and an **in-Discord interactive configuration engine** into a single, unified, high-performance architecture.

Designed for maximum reliability, Skie operates with zero heavy native compilation requirements, persistent SQLite Write-Ahead Logging (WAL mode), role-hierarchy protection, and full mobile management support.

---

## 🌟 Core Feature Highlights

| Module | What It Does | Key Commands |
|---|---|---|
| 🛡️ **Anti-Nuke Defense Shield** | Real-time sliding-window surveillance blocks rogue admins and mass-destruction attacks. Automatically quarantines or bans perpetrators. | `/antinuke enable`<br>`/antinuke settings`<br>`/antinuke whitelist` |
| 🎶 **24/7 Multi-VC Music Engine** | Streams 24/7 YouTube and radio audio across 3 concurrent voice channels with real-time DSP filters (Bassboost, Nightcore, 8D audio). | `/music play`<br>`/music 247`<br>`/music filter` |
| ⚖️ **Disciplinary Jail System** | Automatically strips administrative roles, confines problem members to an isolated `#jail` channel, and auto-restores their roles upon release. | `/jail setup`<br>`/jail user`<br>`/jail unjail` |
| 📜 **Automated Audit Logging** | One-click automatic setup creates an Admin-Only category with 5 dedicated logging channels for Mod, Server, Voice, Economy, and Join/Leave events. | `/logs setup`<br>`/logs view` |
| 🔊 **Join-to-Create Temp VC** | Dynamic voice lounges automatically generated when members connect to a hub channel, complete with interactive control panels. | `/tempvc setup`<br>`/tempvc panel` |
| 🔘 **Interactive Button Roles** | Self-assignable role panels with up to 5 colored buttons per embed message. | `/buttonrole quick`<br>`/buttonrole add` |
| 📩 **Support Ticket Desk** | Multi-category support desks with staff claiming, closing timers, and downloadable chat transcripts. | `/ticket panel`<br>`/ticket transcript` |
| ✅ **Legit ID Verification** | Isolates all server channels until members pass verification. If a member is kicked, their verification is revoked automatically. | `/verify setup`<br>`/verify lockdown` |
| 🌐 **Showcase Website & Studio** | Fast static showcase website listing all 233 commands, plus visual Discohook-style message studio (`editor.html`). | Vercel / Static |

---

## 🗂️ Repository Structure

```text
├── assets/
│   ├── logo.png             # Official high-resolution 512x512 Skie logo
│   └── logo_128.png         # Optimized web badge logo
├── data/                    # Persistent SQLite database storage (WAL mode)
├── app.py                   # Master all-in-one bot engine (Anti-Nuke, 24/7 Music, Tickets)
├── bot.py                   # Synchronized runtime bot implementation
├── main.py                  # Standard container execution entrypoint
├── index.html               # Showcase website with search across all 233 commands
├── editor.html              # Discohook-style embed & message visual studio
├── style.css                # Crimson red theme design system
├── vercel.json              # Vercel deployment configuration
├── requirements.txt         # Production Python dependencies
├── .env.example             # Environment variable configuration template
├── .gitignore               # Strict security ignore rules (ignores .env, *.db)
├── LICENSE                  # MIT Open Source License
└── README.md                # Project documentation
```

---

## ⚡ Quickstart & Installation

### Option 1: 24/7 Server Hosting Panel (Pterodactyl / Container)
1. Fork or clone this repository:
   ```bash
   git clone https://github.com/your-username/skie-bot.git
   cd skie-bot
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
4. Start the bot:
   ```bash
   python3 app.py
   ```

### Option 2: Deploy Showcase Website to Vercel / Netlify (100% Free)
1. In your browser, open **`index.html`** or use **`editor.html`** to build messages.
2. Deploy directly to Vercel or Netlify via GitHub or direct folder upload.
3. Your bot showcase site is live worldwide with free HTTPS, listing all 233 slash commands!

---


---

## ⚙️ Seamless In-Discord Setup & Command Discovery

* **100% In-Discord Setup:** 𝐒𝐤𝐢𝐞 is configured directly inside your Discord server using intuitive automated commands (e.g. `/jail setup`, `/logs setup`, `/antinuke settings`, `/tempvc setup`). No external manual setup or terminal required.
* **Understand All Commands Easily:**
  1. **Directly in Discord:** Type `/help` to browse full syntax, required permissions, and feature guides interactively.
  2. **Via the `/help` Command:** Type `/help` directly in any Discord server channel to access the complete 22-category directory.

## 📋 Slash Command Architecture (33 Suites | 230 Commands)

Skie uses Discord's official **Command Group Architecture**, keeping global top-level items at **92 / 100** so your bot will never crash from the Discord 100 global command limit.

* **`/mod` (17 subcommands):** `/mod ban`, `/mod unban`, `/mod kick`, `/mod timeout`, `/mod untimeout`, `/mod warn`, `/mod warns`, `/mod lock`, `/mod unlock`, `/mod hide`, `/mod unhide`, `/mod slowmode`, `/mod nuke`, `/mod nick`, `/mod role`, `/mod clear`, `/mod purge`
* **`/music` (22 subcommands):** `/music play`, `/music search`, `/music pause`, `/music resume`, `/music skip`, `/music stop`, `/music nowplaying`, `/music queue`, `/music clearqueue`, `/music loop`, `/music shuffle`, `/music autoplay`, `/music seek`, `/music replay`, `/music volume`, `/music join`, `/music leave`, `/music 247`, `/music filter`, `/music lofi`, `/music phonk`, `/music bhojpuri`
* **`/antinuke` (7 subcommands):** `/antinuke enable`, `/antinuke disable`, `/antinuke settings`, `/antinuke status`, `/antinuke whitelist add`, `/antinuke whitelist remove`, `/antinuke whitelist list`
* **`/jail` (7 subcommands):** `/jail setup`, `/jail user`, `/jail unjail`, `/jail info`, `/jail extend`, `/jail reduce`, `/jail prisoners`
* **`/tempvc` (11 subcommands):** `/tempvc setup`, `/tempvc panel`, `/tempvc lock`, `/tempvc unlock`, `/tempvc hide`, `/tempvc unhide`, `/tempvc limit`, `/tempvc rename`, `/tempvc kick`, `/tempvc status`, `/tempvc disable`
* **`/ticket` (10 subcommands):** `/ticket panel`, `/ticket edit`, `/ticket claim`, `/ticket close`, `/ticket delete`, `/ticket unlock`, `/ticket transcript`, `/ticket add`, `/ticket remove`, `/ticket rename`
* **`/logs` (4 subcommands):** `/logs setup`, `/logs set`, `/logs view`, `/logs disable`
* **`/buttonrole` (4 subcommands):** `/buttonrole quick`, `/buttonrole add`, `/buttonrole remove`, `/buttonrole list`
* **`/welcome` (9 subcommands):** `/welcome setup`, `/welcome channel`, `/welcome edit`, `/welcome color`, `/welcome preview`, `/welcome test`, `/welcome toggle`, `/welcome variables`, `/welcome button add`
* **`/social` (14 subcommands):** `/social hug`, `/social cuddle`, `/social pat`, `/social poke`, `/social slap`, `/social stare`, `/social highfive`, `/social bite`, `/social greet`, `/social tickle`, `/social snuggle`, `/social boop`, `/social handhold`, `/social emote`
* **Standalone Shortcuts (59 commands):** `/clear`, `/builder`, `/help`, `/afk`, `/afk-leaderboard`, `/poll`, `/cash`, `/daily`, `/weekly`, `/give`, `/shop`, `/buy`, `/sell`, `/hunt`, `/zoo`, `/dex`, `/battle`, `/inventory`, `/crate`, `/upgrade`, `/equip`, `/slots`, `/blackjack`, `/coinflip`, `/gamble`, `/profile`, `/avatar`, `/stats`, `/ping`, and more.

---

## 🔒 Security & Permission Segregation

To protect community servers from command abuse:
1. All administration and moderation commands enforce strict **Discord permissions validation** (`Administrator`, `Manage Channels`, `Ban Members`, etc.).
2. Normal server members attempting to execute restricted administrative commands receive an ephemeral **"Access Denied"** notification.
3. The Server Owner is permanently hardcoded with master immunity against false-positive anti-nuke triggers.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
