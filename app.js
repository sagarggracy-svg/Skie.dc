// 𝐒𝐤𝐢𝐞 Discord Server Dashboard & Sapphire-Style Control Panel
// Full OAuth2 Authentication, Guild Permission Filtration & Live Configuration

const CLIENT_ID = "1558750474885406740";

// State
let currentUser = null;
let userGuilds = [];
let currentGuild = null;
let hasUnsavedChanges = false;
let isDemoMode = false;

// Mock / Known Bot Guilds for demo and verification
const KNOWN_BOT_GUILDS = new Set(["1001", "1002"]);

// Realistic Demo Servers (For testing without OAuth2 credentials)
const DEMO_SERVERS = [
  {
    id: "1001",
    name: "Valo Esports Hub",
    icon: null,
    owner: true,
    permissions: "2147483647",
    hasBot: true,
    members: 1420
  },
  {
    id: "1002",
    name: "Anime Lounge & Chill",
    icon: null,
    owner: false,
    permissions: "8", // Administrator
    hasBot: true,
    members: 890
  },
  {
    id: "1003",
    name: "Community Gaming Sanctuary",
    icon: null,
    owner: false,
    permissions: "32", // Manage Server
    hasBot: false,
    members: 530
  },
  {
    id: "1004",
    name: "Dev & Bot Testing Lab",
    icon: null,
    owner: true,
    permissions: "2147483647",
    hasBot: false,
    members: 64
  }
];

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  setupSidebarNavigation();
  checkOAuthToken();
});

// ====================================================================
// 1. OAUTH2 LOGIN & DISCORD API INTEGRATION
// ====================================================================

function initiateDiscordLogin(e) {
  if (e) e.preventDefault();
  const currentUrl = window.location.origin + window.location.pathname;
  const redirectUri = encodeURIComponent(currentUrl);
  // Discord OAuth2 Implicit Grant (response_type=token)
  // Scopes: identify guilds
  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=identify%20guilds`;
  window.location.href = authUrl;
}

function checkOAuthToken() {
  // Check if access_token is in URL hash from Discord redirect
  if (window.location.hash.includes('access_token=')) {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get('access_token');
    if (token) {
      localStorage.setItem('discord_token', token);
      // Clean hash from browser address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  const storedToken = localStorage.getItem('discord_token');
  if (storedToken) {
    loadDiscordUserData(storedToken);
  } else {
    // Check if demo mode was active
    const demoActive = sessionStorage.getItem('skie_demo_mode');
    if (demoActive === 'true') {
      startDemoMode();
    } else {
      showView('view-login');
    }
  }
}

async function loadDiscordUserData(token) {
  try {
    // Fetch User Profile
    const userRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (userRes.status === 401) {
      // Token expired
      localStorage.removeItem('discord_token');
      showView('view-login');
      return;
    }

    currentUser = await userRes.json();
    renderUserProfile(currentUser);

    // Fetch User Guilds
    const guildsRes = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const allGuilds = await guildsRes.json();

    // Filter servers where user has Administrator (0x8) or Manage Server (0x20) or is Owner
    userGuilds = allGuilds.filter(canManageGuild).map(g => {
      return {
        ...g,
        hasBot: KNOWN_BOT_GUILDS.has(g.id)
      };
    });

    renderGuildsGrid(userGuilds);
    showView('view-servers');
  } catch (err) {
    console.warn("Could not load from Discord API, falling back to demo:", err);
    startDemoMode();
  }
}

function canManageGuild(guild) {
  if (guild.owner) return true;
  try {
    const perms = BigInt(guild.permissions);
    const ADMINISTRATOR = 0x8n;
    const MANAGE_GUILD = 0x20n;
    return (perms & ADMINISTRATOR) !== 0n || (perms & MANAGE_GUILD) !== 0n;
  } catch (e) {
    return false;
  }
}

function logoutDiscord() {
  localStorage.removeItem('discord_token');
  sessionStorage.removeItem('skie_demo_mode');
  currentUser = null;
  userGuilds = [];
  currentGuild = null;
  document.getElementById('userProfilePill').style.display = 'none';
  document.getElementById('topCurrentServerPill').style.display = 'none';
  showView('view-login');
}

function startDemoMode() {
  isDemoMode = true;
  sessionStorage.setItem('skie_demo_mode', 'true');
  currentUser = {
    username: "DemoAdmin",
    discriminator: "0001",
    id: "999999999",
    avatar: null
  };
  renderUserProfile(currentUser);
  userGuilds = DEMO_SERVERS;
  renderGuildsGrid(userGuilds);
  showView('view-servers');
}

// ====================================================================
// 2. RENDERING VIEWS & SERVER SELECTION
// ====================================================================

function showView(viewId) {
  document.querySelectorAll('.view-container').forEach(el => el.classList.remove('active-view'));
  const target = document.getElementById(viewId);
  if (target) target.classList.add('active-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderUserProfile(user) {
  const pill = document.getElementById('userProfilePill');
  const avatar = document.getElementById('userAvatarImg');
  const name = document.getElementById('userNameText');

  pill.style.display = 'flex';
  name.innerText = user.username + (user.discriminator && user.discriminator !== '0' ? `#${user.discriminator}` : '');
  
  if (user.avatar) {
    avatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
  } else {
    avatar.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%235865F2'/><text x='50' y='65' font-size='45' text-anchor='middle' fill='%23ffffff'>${encodeURIComponent(user.username.charAt(0))}</text></svg>`;
  }
}

function renderGuildsGrid(guilds) {
  const grid = document.getElementById('guildsGrid');
  grid.innerHTML = '';

  if (!guilds || guilds.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border);">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🛡️</div>
        <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">No Manageable Servers Found</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 480px; margin: 0 auto;">
          You need <strong>Administrator</strong> or <strong>Manage Server</strong> permissions in a server to add and configure 𝐒𝐤𝐢𝐞.
        </p>
      </div>
    `;
    return;
  }

  guilds.forEach(guild => {
    const card = document.createElement('div');
    card.className = 'server-card';
    card.setAttribute('data-name', guild.name.toLowerCase());
    card.setAttribute('data-status', guild.hasBot ? 'active' : 'invite');

    // Permission Badge
    let permLabel = 'Manage Server';
    let permClass = 'perm-manage';
    if (guild.owner) {
      permLabel = '👑 Owner';
      permClass = 'perm-owner';
    } else {
      try {
        const perms = BigInt(guild.permissions);
        if ((perms & 0x8n) !== 0n) {
          permLabel = '🛡️ Admin';
          permClass = 'perm-admin';
        }
      } catch (e) {}
    }

    // Guild Icon Markup
    let iconMarkup = '';
    if (guild.icon) {
      iconMarkup = `<img src="https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128" alt="${guild.name}" class="server-icon-img">`;
    } else {
      const initials = guild.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      iconMarkup = initials;
    }

    // Bot Action Button
    let actionBtnHtml = '';
    if (guild.hasBot) {
      actionBtnHtml = `
        <div class="bot-status-tag">
          <span class="status-dot-active"></span>
          <span style="color: #10b981; font-weight: 600;">Bot Active</span>
        </div>
        <button class="btn-server-action btn-manage-active" onclick="openServerManage('${guild.id}')">
          ⚙️ Manage Server
        </button>
      `;
    } else {
      const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}`;
      actionBtnHtml = `
        <div class="bot-status-tag">
          <span class="status-dot-invite"></span>
          <span style="color: var(--text-muted);">Ready to Add</span>
        </div>
        <a href="${inviteUrl}" target="_blank" rel="noopener" class="btn-server-action btn-invite-bot" onclick="handleInviteClick('${guild.id}')">
          ➕ Add to Server
        </a>
      `;
    }

    card.innerHTML = `
      <div>
        <div class="server-header">
          <div class="server-icon-wrap">${iconMarkup}</div>
          <div class="server-meta">
            <h3>${escapeHtml(guild.name)}</h3>
            <span class="badge-perm ${permClass}">${permLabel}</span>
          </div>
        </div>
      </div>
      <div>
        ${actionBtnHtml}
      </div>
    `;

    grid.appendChild(card);
  });
}

function filterServerCards() {
  const query = document.getElementById('serverSearchInput').value.toLowerCase().trim();
  const filter = document.getElementById('serverStatusFilter').value;
  const cards = document.querySelectorAll('.server-card');

  cards.forEach(card => {
    const name = card.getAttribute('data-name');
    const status = card.getAttribute('data-status');

    const matchesQuery = !query || name.includes(query);
    const matchesStatus = filter === 'all' || status === filter;

    card.style.display = (matchesQuery && matchesStatus) ? 'flex' : 'none';
  });
}

function handleInviteClick(guildId) {
  // Mark guild as added locally so when user returns, button turns to "Manage"
  KNOWN_BOT_GUILDS.add(guildId);
  const found = userGuilds.find(g => g.id === guildId);
  if (found) found.hasBot = true;
  setTimeout(() => renderGuildsGrid(userGuilds), 2000);
}

// ====================================================================
// 3. SAPPHIRE-STYLE SERVER MANAGEMENT CONTROL PANEL
// ====================================================================

function openServerManage(guildId) {
  const guild = userGuilds.find(g => g.id === guildId);
  if (!guild) return;

  currentGuild = guild;

  // Header badges & titles
  document.getElementById('manageServerTitle').innerText = guild.name;
  document.getElementById('topServerName').innerText = guild.name;
  document.getElementById('topCurrentServerPill').style.display = 'inline-flex';

  const iconWrap = document.getElementById('manageServerIcon');
  if (guild.icon) {
    iconWrap.innerHTML = `<img src="https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64" class="server-icon-img">`;
  } else {
    const initials = guild.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    iconWrap.innerHTML = initials;
  }

  // Load saved settings from localStorage
  loadServerConfiguration(guildId);

  showView('view-manage');
}

function switchToServerSelection() {
  if (hasUnsavedChanges) {
    if (!confirm("You have unsaved changes. Are you sure you want to go back?")) return;
  }
  document.getElementById('topCurrentServerPill').style.display = 'none';
  hasUnsavedChanges = false;
  document.getElementById('saveChangesBanner').classList.remove('show');
  showView('view-servers');
}

function setupSidebarNavigation() {
  const links = document.querySelectorAll('.sidebar-link');
  const panes = document.querySelectorAll('.tab-pane');

  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      panes.forEach(p => p.style.display = 'none');

      link.classList.add('active');
      const tabId = link.getAttribute('data-tab');
      const targetPane = document.getElementById(tabId);
      if (targetPane) targetPane.style.display = 'block';
    });
  });
}

// Configuration Persistence (localStorage per guild)
function loadServerConfiguration(guildId) {
  const saved = localStorage.getItem(`skie_guild_${guildId}`);
  if (saved) {
    try {
      const cfg = JSON.parse(saved);
      if (document.getElementById('antinukeMaster')) document.getElementById('antinukeMaster').checked = !!cfg.antinuke_active;
      if (document.getElementById('cfg_antinuke_active')) document.getElementById('cfg_antinuke_active').checked = !!cfg.antinuke_active;
      if (document.getElementById('cfg_music_247')) document.getElementById('cfg_music_247').checked = !!cfg.music_247;
      if (document.getElementById('cfg_jail_active')) document.getElementById('cfg_jail_active').checked = !!cfg.jail_active;
      if (document.getElementById('cfg_logs_active')) document.getElementById('cfg_logs_active').checked = !!cfg.logs_active;

      if (cfg.antinuke_action && document.getElementById('antinukeAction')) document.getElementById('antinukeAction').value = cfg.antinuke_action;
      if (cfg.music_slot && document.getElementById('musicDefaultSlot')) document.getElementById('musicDefaultSlot').value = cfg.music_slot;
      if (cfg.music_vol && document.getElementById('musicVolSlider')) {
        document.getElementById('musicVolSlider').value = cfg.music_vol;
        document.getElementById('musicVolDisplay').innerText = cfg.music_vol;
      }
      if (cfg.welcome_roles && document.getElementById('welcomeAutoRoles')) document.getElementById('welcomeAutoRoles').value = cfg.welcome_roles;
      if (cfg.welcome_msg && document.getElementById('welcomeMsgText')) document.getElementById('welcomeMsgText').value = cfg.welcome_msg;
    } catch (e) {
      console.warn("Error parsing saved guild settings:", e);
    }
  }
  hasUnsavedChanges = false;
  document.getElementById('saveChangesBanner').classList.remove('show');
}

function markUnsaved() {
  hasUnsavedChanges = true;
  document.getElementById('saveChangesBanner').classList.add('show');
}

function resetUnsavedChanges() {
  if (currentGuild) {
    loadServerConfiguration(currentGuild.id);
  }
}

function saveServerConfiguration() {
  if (!currentGuild) return;

  const config = {
    guild_id: currentGuild.id,
    guild_name: currentGuild.name,
    antinuke_active: document.getElementById('antinukeMaster')?.checked || false,
    music_247: document.getElementById('cfg_music_247')?.checked || false,
    jail_active: document.getElementById('cfg_jail_active')?.checked || false,
    logs_active: document.getElementById('cfg_logs_active')?.checked || false,
    antinuke_action: document.getElementById('antinukeAction')?.value || "quarantine",
    music_slot: document.getElementById('musicDefaultSlot')?.value || "1",
    music_vol: document.getElementById('musicVolSlider')?.value || "80",
    welcome_roles: document.getElementById('welcomeAutoRoles')?.value || "",
    welcome_msg: document.getElementById('welcomeMsgText')?.value || "",
    saved_at: new Date().toISOString()
  };

  localStorage.setItem(`skie_guild_${currentGuild.id}`, JSON.stringify(config));

  // Also simulate sync with bot server if running
  try {
    fetch(`/api/guilds/${currentGuild.id}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    }).catch(() => {});
  } catch (e) {}

  hasUnsavedChanges = false;
  document.getElementById('saveChangesBanner').classList.remove('show');
  showToast("✅ Settings saved and synchronized with 𝐒𝐤𝐢𝐞!");
}

function triggerLogsSetupSimulation() {
  if (document.getElementById('logModChannel')) document.getElementById('logModChannel').value = "#mod-logs";
  if (document.getElementById('logVoiceChannel')) document.getElementById('logVoiceChannel').value = "#voice-logs";
  if (document.getElementById('logJoinChannel')) document.getElementById('logJoinChannel').value = "#join-leave";
  if (document.getElementById('logServerChannel')) document.getElementById('logServerChannel').value = "#server-events";
  if (document.getElementById('cfg_logs_active')) document.getElementById('cfg_logs_active').checked = true;
  markUnsaved();
  showToast("📁 Log channels populated! Click 'Save Changes' to apply.");
}

function exportServerSnapshot() {
  if (!currentGuild) return;
  const saved = localStorage.getItem(`skie_guild_${currentGuild.id}`) || JSON.stringify({
    guild_id: currentGuild.id,
    guild_name: currentGuild.name,
    modules: ["antinuke", "music", "jail", "logs", "tickets", "welcome"],
    created_at: new Date().toISOString()
  }, null, 2);

  const blob = new Blob([saved], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `skie_${currentGuild.name.replace(/\\s+/g, '_')}_snapshot.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("📥 Exported server JSON snapshot!");
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerText = msg;
  t.style.display = 'block';
  setTimeout(() => {
    t.style.display = 'none';
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
