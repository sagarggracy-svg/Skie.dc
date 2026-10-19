// Skie Web Dashboard Client App
// Responsive, Lightweight Vanilla JS with Discohook Message Builder

let currentGuildId = null;
let currentGuildMeta = null;

// DOM Elements
const serverSelect = document.getElementById('serverSelect');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const tabPanes = document.querySelectorAll('.tab-pane');
const toastEl = document.getElementById('toast');

// Welcome Elements
const welcomeEnabled = document.getElementById('welcomeEnabled');
const welcomeChannelSelect = document.getElementById('welcomeChannelSelect');
const welcomePlainText = document.getElementById('welcomePlainText');
const welcomeEmbedTitle = document.getElementById('welcomeEmbedTitle');
const welcomeEmbedDesc = document.getElementById('welcomeEmbedDesc');
const welcomeColorPicker = document.getElementById('welcomeColorPicker');
const welcomeColorText = document.getElementById('welcomeColorText');
const btnSaveWelcome = document.getElementById('btnSaveWelcome');
const btnTestWelcome = document.getElementById('btnTestWelcome');

// AutoMod Elements
const amAntiSpam = document.getElementById('amAntiSpam');
const amAntiInvite = document.getElementById('amAntiInvite');
const amRaidMode = document.getElementById('amRaidMode');
const amBadWords = document.getElementById('amBadWords');
const btnSaveAutoMod = document.getElementById('btnSaveAutoMod');

// Discohook Message Builder Elements (Screenshots 2 & 3)
const discoChannelSelect = document.getElementById('discoChannelSelect');
const discoContent = document.getElementById('discoContent');
const discoCharCount = document.getElementById('discoCharCount');
const btnDiscoAddMenu = document.getElementById('btnDiscoAddMenu');
const discoAddDropdown = document.getElementById('discoAddDropdown');
const btnAddEmbed = document.getElementById('btnAddEmbed');
const btnAddComponents = document.getElementById('btnAddComponents');
const discoEmbedSection = document.getElementById('discoEmbedSection');
const btnRemoveEmbed = document.getElementById('btnRemoveEmbed');
const discoComponentsSection = document.getElementById('discoComponentsSection');
const btnRemoveComponents = document.getElementById('btnRemoveComponents');
const btnDiscoSendMessage = document.getElementById('btnDiscoSendMessage');
const btnClearMsg = document.getElementById('btnClearMsg');
const btnCopyMsg = document.getElementById('btnCopyMsg');

// Discohook Form Fields
const discoProfileName = document.getElementById('discoProfileName');
const discoProfileAvatar = document.getElementById('discoProfileAvatar');
const discoEmbedTitle = document.getElementById('discoEmbedTitle');
const discoEmbedDesc = document.getElementById('discoEmbedDesc');
const discoColorPicker = document.getElementById('discoColorPicker');
const discoColorText = document.getElementById('discoColorText');
const discoEmbedUrl = document.getElementById('discoEmbedUrl');
const discoEmbedImage = document.getElementById('discoEmbedImage');
const discoEmbedThumbnail = document.getElementById('discoEmbedThumbnail');
const discoEmbedFooter = document.getElementById('discoEmbedFooter');
const discoEmbedFooterIcon = document.getElementById('discoEmbedFooterIcon');
const discoButtonsList = document.getElementById('discoButtonsList');
const btnAddButtonRow = document.getElementById('btnAddButtonRow');

// Discord Live Preview Elements
const prevBotName = document.getElementById('prevBotName');
const prevContentText = document.getElementById('prevContentText');
const prevEmbedCard = document.getElementById('prevEmbedCard');
const prevEmbedTitle = document.getElementById('prevEmbedTitle');
const prevEmbedDesc = document.getElementById('prevEmbedDesc');
const prevEmbedImage = document.getElementById('prevEmbedImage');
const prevEmbedThumbnail = document.getElementById('prevEmbedThumbnail');
const prevEmbedFooter = document.getElementById('prevEmbedFooter');
const prevButtonsRow = document.getElementById('prevButtonsRow');

// State
let discoButtons = [
  { label: '📜 Rules', style: 'primary', emoji: '📜', response: 'Server Rules: 1. Be respectful. 2. No spamming.' },
  { label: '👑 Owner Info', style: 'secondary', emoji: '👑', response: 'Community created & managed with Skie Bot!' }
];

// Toast Helper
function showToast(message, isError = false) {
  toastEl.textContent = message;
  toastEl.style.borderColor = isError ? '#ef4444' : '#8b5cf6';
  toastEl.style.display = 'block';
  setTimeout(() => {
    toastEl.style.display = 'none';
  }, 3500);
}

// Tab Switching
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    sidebarLinks.forEach(l => l.classList.remove('active'));
    tabPanes.forEach(p => (p.style.display = 'none'));

    link.classList.add('active');
    const tabId = link.getAttribute('data-tab');
    const targetPane = document.getElementById(tabId);
    if (targetPane) targetPane.style.display = 'block';

    if (tabId === 'tab-builder') updateDiscoPreview();
  });
});

// Variable Chips insertion helper
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const varText = chip.getAttribute('data-var');
    welcomePlainText.value += ' ' + varText;
  });
});

// Sync Color Picker with Text Input for Welcome
welcomeColorPicker?.addEventListener('input', (e) => {
  welcomeColorText.value = e.target.value;
});

// Sync Color Picker with Text Input for Discohook Builder
discoColorPicker?.addEventListener('input', (e) => {
  discoColorText.value = e.target.value;
  updateDiscoPreview();
});
discoColorText?.addEventListener('input', (e) => {
  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
    discoColorPicker.value = e.target.value;
  }
  updateDiscoPreview();
});

// Palette color dots click
document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const col = dot.getAttribute('data-color');
    discoColorPicker.value = col;
    discoColorText.value = col;
    updateDiscoPreview();
  });
});

// Live Character Counter on Content (Screenshot 2: Content 0/2000)
discoContent?.addEventListener('input', (e) => {
  const len = e.target.value.length;
  discoCharCount.textContent = `${len}/2000`;
  updateDiscoPreview();
});

// Dropdown Add Menu Toggle (Screenshot 2 & 3: Add ⌵)
btnDiscoAddMenu?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isShown = discoAddDropdown.style.display === 'block';
  discoAddDropdown.style.display = isShown ? 'none' : 'block';
});

document.addEventListener('click', () => {
  if (discoAddDropdown) discoAddDropdown.style.display = 'none';
});

// Add Embed clicked
btnAddEmbed?.addEventListener('click', () => {
  discoEmbedSection.style.display = 'block';
  discoAddDropdown.style.display = 'none';
  if (!discoEmbedTitle.value) discoEmbedTitle.value = '📢 Server Announcement';
  if (!discoEmbedDesc.value) discoEmbedDesc.value = 'Welcome everyone! Check out the new community updates and features.';
  updateDiscoPreview();
});

// Remove Embed clicked
btnRemoveEmbed?.addEventListener('click', () => {
  discoEmbedSection.style.display = 'none';
  discoEmbedTitle.value = '';
  discoEmbedDesc.value = '';
  discoEmbedImage.value = '';
  updateDiscoPreview();
});

// Add Components clicked
btnAddComponents?.addEventListener('click', () => {
  discoComponentsSection.style.display = 'block';
  discoAddDropdown.style.display = 'none';
  renderButtonsList();
  updateDiscoPreview();
});

// Remove Components clicked
btnRemoveComponents?.addEventListener('click', () => {
  discoComponentsSection.style.display = 'none';
  discoButtons = [];
  renderButtonsList();
  updateDiscoPreview();
});

// Clear Message button
btnClearMsg?.addEventListener('click', () => {
  discoContent.value = '';
  discoCharCount.textContent = '0/2000';
  discoEmbedTitle.value = '';
  discoEmbedDesc.value = '';
  discoEmbedImage.value = '';
  discoEmbedThumbnail.value = '';
  discoEmbedFooter.value = '';
  discoEmbedSection.style.display = 'none';
  discoComponentsSection.style.display = 'none';
  discoButtons = [];
  updateDiscoPreview();
  showToast('Message draft cleared.');
});

// Duplicate / Copy Message
btnCopyMsg?.addEventListener('click', () => {
  const draft = {
    content: discoContent.value,
    embed: discoEmbedSection.style.display !== 'none' ? {
      title: discoEmbedTitle.value,
      description: discoEmbedDesc.value,
      color: discoColorText.value,
    } : null
  };
  navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
  showToast('📋 Message configuration copied to clipboard!');
});

// Render Interactive Buttons List in Subcard
function renderButtonsList() {
  if (!discoButtonsList) return;
  if (discoButtons.length === 0) {
    discoButtonsList.innerHTML = '<p style="font-size: 0.8rem; color: #949ba4;">No buttons added yet. Click "+ Add Button" below.</p>';
    return;
  }

  discoButtonsList.innerHTML = discoButtons.map((b, idx) => `
    <div style="background: #232428; border: 1px solid #383a40; border-radius: 6px; padding: 10px; margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-weight: 700; font-size: 0.85rem; color: #f2f3f5;">Button #${idx + 1}</span>
        <button type="button" class="icon-btn" onclick="removeButton(${idx})" style="color: #ef4444;">✕</button>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 6px;">
        <input type="text" class="form-input" style="padding: 6px 10px; font-size: 0.8rem;" value="${b.label}" placeholder="Label" oninput="updateButtonLabel(${idx}, this.value)">
        <select class="form-select" style="padding: 6px 10px; font-size: 0.8rem;" onchange="updateButtonStyle(${idx}, this.value)">
          <option value="primary" ${b.style === 'primary' ? 'selected' : ''}>Primary (Blurple)</option>
          <option value="secondary" ${b.style === 'secondary' ? 'selected' : ''}>Secondary (Gray)</option>
          <option value="success" ${b.style === 'success' ? 'selected' : ''}>Success (Green)</option>
          <option value="danger" ${b.style === 'danger' ? 'selected' : ''}>Danger (Red)</option>
        </select>
      </div>
      <input type="text" class="form-input" style="padding: 6px 10px; font-size: 0.8rem;" value="${b.response}" placeholder="Ephemeral Response (Only visible to clicker)" oninput="updateButtonResponse(${idx}, this.value)">
    </div>
  `).join('');
}

window.removeButton = (idx) => {
  discoButtons.splice(idx, 1);
  renderButtonsList();
  updateDiscoPreview();
};

window.updateButtonLabel = (idx, val) => {
  if (discoButtons[idx]) discoButtons[idx].label = val;
  updateDiscoPreview();
};

window.updateButtonStyle = (idx, val) => {
  if (discoButtons[idx]) discoButtons[idx].style = val;
  updateDiscoPreview();
};

window.updateButtonResponse = (idx, val) => {
  if (discoButtons[idx]) discoButtons[idx].response = val;
};

btnAddButtonRow?.addEventListener('click', () => {
  if (discoButtons.length >= 5) {
    return showToast('Maximum 5 buttons per action row.', true);
  }
  discoButtons.push({
    label: `Button ${discoButtons.length + 1}`,
    style: 'primary',
    emoji: '⭐',
    response: 'Action completed!'
  });
  renderButtonsList();
  updateDiscoPreview();
});

// Live Discord Chat Preview Updates
[discoProfileName, discoProfileAvatar, discoEmbedTitle, discoEmbedDesc, discoEmbedUrl, discoEmbedImage, discoEmbedThumbnail, discoEmbedFooter].forEach(el => {
  el?.addEventListener('input', updateDiscoPreview);
});

function updateDiscoPreview() {
  if (!prevContentText) return;

  // Bot Profile
  prevBotName.textContent = discoProfileName?.value.trim() || 'Skie';

  // Content Text
  const text = discoContent?.value.trim();
  prevContentText.textContent = text || 'Welcome to the server! Use the interactive buttons below.';
  prevContentText.style.display = text || (discoEmbedSection.style.display === 'none') ? 'block' : 'none';

  // Embed Preview
  const isEmbedActive = discoEmbedSection && discoEmbedSection.style.display !== 'none';
  if (isEmbedActive && (discoEmbedTitle.value || discoEmbedDesc.value)) {
    prevEmbedCard.style.display = 'flex';
    prevEmbedCard.style.borderLeftColor = discoColorText.value || '#3b82f6';

    prevEmbedTitle.textContent = discoEmbedTitle.value || '';
    prevEmbedTitle.style.display = discoEmbedTitle.value ? 'block' : 'none';

    prevEmbedDesc.textContent = discoEmbedDesc.value || '';
    prevEmbedDesc.style.display = discoEmbedDesc.value ? 'block' : 'none';

    if (discoEmbedImage.value) {
      prevEmbedImage.src = discoEmbedImage.value;
      prevEmbedImage.style.display = 'block';
    } else {
      prevEmbedImage.style.display = 'none';
    }

    if (discoEmbedThumbnail.value) {
      prevEmbedThumbnail.src = discoEmbedThumbnail.value;
      prevEmbedThumbnail.style.display = 'block';
    } else {
      prevEmbedThumbnail.style.display = 'none';
    }

    if (discoEmbedFooter.value) {
      prevEmbedFooter.textContent = discoEmbedFooter.value;
      prevEmbedFooter.style.display = 'block';
    } else {
      prevEmbedFooter.style.display = 'none';
    }
  } else {
    prevEmbedCard.style.display = 'none';
  }

  // Buttons Preview
  const isCompActive = discoComponentsSection && discoComponentsSection.style.display !== 'none';
  if (isCompActive && discoButtons.length > 0) {
    prevButtonsRow.style.display = 'flex';
    prevButtonsRow.innerHTML = discoButtons.map(b => `
      <button class="discord-btn discord-btn-${b.style}">
        ${b.label}
      </button>
    `).join('');
  } else {
    prevButtonsRow.style.display = 'none';
  }
}

// Send Message to Discord via Backend API
btnDiscoSendMessage?.addEventListener('click', async () => {
  const channelId = discoChannelSelect?.value;
  if (!channelId) {
    return showToast('Please select a target channel first!', true);
  }

  const content = discoContent.value.trim();
  const isEmbedActive = discoEmbedSection.style.display !== 'none';
  const hasEmbed = isEmbedActive && (discoEmbedTitle.value || discoEmbedDesc.value);

  if (!content && !hasEmbed) {
    return showToast('Cannot send empty message. Add text or an embed!', true);
  }

  const payload = {
    guild_id: currentGuildId,
    channel_id: channelId,
    content: content,
    embed: hasEmbed ? {
      title: discoEmbedTitle.value.trim(),
      description: discoEmbedDesc.value.trim(),
      color: discoColorText.value.trim() || '#3b82f6',
      image: discoEmbedImage.value.trim() || null,
      thumbnail: discoEmbedThumbnail.value.trim() || null,
      footer: discoEmbedFooter.value.trim() || null
    } : null,
    buttons: (discoComponentsSection.style.display !== 'none') ? discoButtons : []
  };

  try {
    showToast('Sending message to Discord...');
    const res = await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message || '✅ Message successfully dispatched to Discord!');
    } else {
      showToast(data.error || 'Failed to send message', true);
    }
  } catch (err) {
    showToast('Error communicating with backend', true);
  }
});

// Load Overview Live Stats (Matching Screenshot 1)
async function loadLiveStats() {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) return;
    const s = await res.json();

    document.getElementById('liveDashServers').textContent = s.servers ?? '--';
    document.getElementById('liveDashUsers').textContent = (s.users ?? 0).toLocaleString();
    document.getElementById('liveDashChannels').textContent = (s.channels ?? 0).toLocaleString();
    document.getElementById('liveDashPing').textContent = `${s.latency ?? 15} ms`;
    document.getElementById('liveDashUptime').textContent = s.uptime ?? '--';
    document.getElementById('liveDashTickets').textContent = s.tickets ?? '0';

    document.getElementById('liveEnvPing').textContent = `${s.latency ?? 15} ms`;
    document.getElementById('liveEnvPy').textContent = `v${s.python ?? '3.13'}`;
    document.getElementById('liveEnvDpy').textContent = `v${s.discord_py ?? '2.7.1'}`;
    document.getElementById('liveEnvTickets').textContent = `${s.tickets ?? 0}`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('liveDashFooter').textContent = `⏱️ Last Updated • Today at ${timeStr}`;

    // Update Overview stat boxes
    document.getElementById('statMembers').textContent = (s.users ?? 0).toLocaleString();
    document.getElementById('statTickets').textContent = s.tickets ?? 0;
  } catch (e) {
    console.warn('Stats fetch notice:', e);
  }
}

// Load Channels for Selected Guild
async function loadGuildChannels(guildId) {
  try {
    const res = await fetch(`/api/channels?guild_id=${guildId}`);
    if (!res.ok) return;
    const data = await res.json();
    const channels = data.channels || [];

    const optionsHtml = '<option value="" disabled selected>Select channel...</option>' +
      channels.map(c => `<option value="${c.id}">#${c.name}</option>`).join('');

    if (discoChannelSelect) discoChannelSelect.innerHTML = optionsHtml;
    if (welcomeChannelSelect) welcomeChannelSelect.innerHTML = optionsHtml;
  } catch (err) {
    console.warn('Channels load notice:', err);
  }
}

// Main Boot Initialization
async function init() {
  try {
    const res = await fetch('/api/guilds');
    const data = await res.json();

    if (!data.guilds || data.guilds.length === 0) {
      serverSelect.innerHTML = '<option>No servers found</option>';
      return;
    }

    serverSelect.innerHTML = data.guilds.map(g => `<option value="${g.id}">${g.name} (${g.memberCount} members)</option>`).join('');
    currentGuildId = data.guilds[0].id;

    serverSelect.addEventListener('change', (e) => {
      currentGuildId = e.target.value;
      loadGuildChannels(currentGuildId);
    });

    await loadGuildChannels(currentGuildId);
    await loadLiveStats();

    // Auto-refresh stats every 30s
    setInterval(loadLiveStats, 30000);

    // Initial Discohook Preview setup
    renderButtonsList();
    updateDiscoPreview();
  } catch (err) {
    console.error('Failed to init dashboard:', err);
  }
}

document.getElementById('btnRefreshStats')?.addEventListener('click', () => {
  loadLiveStats();
  showToast('Stats refreshed!');
});

// Boot Dashboard App
init();
