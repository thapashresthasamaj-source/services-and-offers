'use strict';

(() => {
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));

  const grid = $('#grid');
  const chips = $('#chips');
  const search = $('#search');
  const dialog = $('#offer-dialog');
  const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
  const state = { cat: 'all', q: '' };

  // ── Hero stats ──────────────────────────────────────────────
  $('#stat-offers').textContent = OFFERS.length;
  $('#stat-cats').textContent = new Set(OFFERS.map((o) => o.category)).size;
  $('#stat-max').textContent = Math.max(0, ...OFFERS.map((o) => o.percent || 0)) + '%';
  $('#year').textContent = new Date().getFullYear();
  $('#sample-notice').hidden = !SAMAJ.showSampleNotice;

  // ── Optional card number from QR link: ?card=TSS-0001 ───────
  const card = new URLSearchParams(location.search).get('card');
  if (card && /^[\w-]{1,32}$/.test(card)) {
    $('#member-line').textContent = 'Club Card No. ' + card;
  }

  // ── Live clock (shows partners the page is live, not a screenshot) ──
  const fmt = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const tick = () => { $('#clock').textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 1000);

  // ── Footer contact ──────────────────────────────────────────
  const contact = [
    SAMAJ.address && `<p>📍 ${esc(SAMAJ.address)}</p>`,
    SAMAJ.phone && `<p>📞 <a href="tel:${esc(SAMAJ.phone.replace(/[^\d+]/g, ''))}">${esc(SAMAJ.phone)}</a></p>`,
    SAMAJ.email && `<p>✉️ <a href="mailto:${esc(SAMAJ.email)}">${esc(SAMAJ.email)}</a></p>`,
    SAMAJ.facebook && `<p>👍 <a href="${esc(SAMAJ.facebook)}" target="_blank" rel="noopener">Facebook page</a></p>`,
  ].filter(Boolean);
  $('#contact-list').innerHTML = contact.join('') || '<p>Visit the Samaj office for enquiries.</p>';

  // ── Category chips ──────────────────────────────────────────
  function renderChips() {
    const counts = {};
    OFFERS.forEach((o) => { counts[o.category] = (counts[o.category] || 0) + 1; });
    const items = [
      { id: 'all', label: 'All', icon: '✨', n: OFFERS.length },
      ...CATEGORIES.filter((c) => counts[c.id]).map((c) => ({ ...c, n: counts[c.id] })),
    ];
    chips.innerHTML = items.map((c) => `
      <button type="button" class="chip" data-cat="${esc(c.id)}" aria-pressed="${c.id === state.cat}">
        <span aria-hidden="true">${c.icon}</span>${esc(c.label)}<em>${c.n}</em>
      </button>`).join('');
  }

  // ── Offer grid ──────────────────────────────────────────────
  const cardHTML = (o) => {
    const c = catById[o.category] || CATEGORIES[0];
    return `
      <article class="offer" data-id="${esc(o.id)}" style="--accent:${c.color}">
        <div class="offer-top">
          <span class="offer-icon" aria-hidden="true">${c.icon}</span>
          <span class="offer-badge">${esc(o.badge)}</span>
        </div>
        <div class="offer-body">
          <p class="offer-cat">${esc(c.label)}${o.featured ? ' <b>★ Featured</b>' : ''}</p>
          <h3>${esc(o.title)}</h3>
          <p class="offer-desc">${esc(o.description)}</p>
        </div>
        <div class="offer-foot">
          <div class="offer-meta">
            <strong>${esc(o.partner)}</strong>
            <span>${esc(o.location)}</span>
          </div>
          <button type="button" class="btn-details" data-id="${esc(o.id)}" aria-label="Details: ${esc(o.title)}">Details</button>
        </div>
      </article>`;
  };

  function render() {
    const q = state.q.trim().toLowerCase();
    const list = OFFERS
      .filter((o) => state.cat === 'all' || o.category === state.cat)
      .filter((o) => !q || [o.title, o.partner, o.location, o.description, o.badge, catById[o.category]?.label]
        .join(' ').toLowerCase().includes(q))
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

    grid.innerHTML = list.map(cardHTML).join('');
    $('#empty').hidden = list.length > 0;
    $('#result-count').textContent = list.length
      ? `Showing ${list.length} ${list.length === 1 ? 'offer' : 'offers'}`
      : '';
  }

  // ── Details dialog ──────────────────────────────────────────
  function openOffer(id) {
    const o = OFFERS.find((x) => x.id === id);
    if (!o) return;
    const c = catById[o.category] || CATEGORIES[0];
    const phone = (o.phone || '').replace(/[^\d+]/g, '');

    dialog.style.setProperty('--accent', c.color);
    $('#dlg-content').innerHTML = `
      <div class="dlg-head">
        <button type="button" class="dlg-close" data-close aria-label="Close">×</button>
        <span class="dlg-badge">${esc(o.badge)}</span>
        <h3 id="dlg-title">${esc(o.title)}</h3>
        <p>${c.icon} ${esc(c.label)}</p>
      </div>
      <div class="dlg-body">
        <p class="dlg-desc">${esc(o.description)}</p>
        <ul class="dlg-facts">
          <li><span aria-hidden="true">🏪</span><span><b>Partner:</b> ${esc(o.partner)}</span></li>
          <li><span aria-hidden="true">📍</span><span><b>Location:</b> ${esc(o.location)}</span></li>
          <li><span aria-hidden="true">📅</span><span><b>Validity:</b> ${esc(o.valid)}</span></li>
        </ul>
        ${o.terms?.length ? `<h4>Terms &amp; conditions</h4><ul class="terms">${o.terms.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        <p class="redeem-note">🪪 <b>To redeem:</b> show your Thapa Shrestha Samaj Club Card to the partner before billing.</p>
        <div class="dlg-actions">
          ${phone ? `<a class="btn-primary" href="tel:${esc(phone)}">📞 Call partner</a>` : ''}
          <button type="button" class="btn-outline" data-close>Close</button>
        </div>
      </div>`;
    dialog.showModal();
  }

  // ── Events ──────────────────────────────────────────────────
  chips.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    state.cat = btn.dataset.cat;
    chips.querySelectorAll('.chip').forEach((b) => b.setAttribute('aria-pressed', b === btn));
    render();
  });

  search.addEventListener('input', () => { state.q = search.value; render(); });

  grid.addEventListener('click', (e) => {
    const el = e.target.closest('[data-id]');
    if (el) openOffer(el.dataset.id);
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  });

  $('#reset').addEventListener('click', () => {
    state.cat = 'all';
    state.q = '';
    search.value = '';
    renderChips();
    render();
  });

  renderChips();
  render();
})();
