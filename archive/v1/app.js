/* Halo — Directory + Invite to Verify ID prototype (21081 / 21082).
   No build step. Hash routes:
     #/directory            Directory (replaces Clients in the side nav)
     #/matters              Matters list
     #/matter/<id>/<tab>    a matter; <tab> = summary | clients | parties | details | …
*/
(function () {
  'use strict';

  /* ------------------------------------------------------------------ store */
  const KEY = 'halo-voi-prototype-v1';
  const clone = (o) => JSON.parse(JSON.stringify(o));

  function seed() {
    const contacts = {};
    SEED_CONTACTS.forEach((c) => { contacts[c.key] = clone(c); });
    return { contacts, matters: clone(SEED_MATTERS), seq: 1 };
  }
  function load() {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ db, failNext: ui.failNext })); } catch (e) { /* private window */ }
  }

  const stored = load();
  let db = stored && stored.db ? stored.db : seed();
  const ui = {
    failNext: !!(stored && stored.failNext),
    dir: { filter: 'all', q: '', page: 1, sel: new Set() },
    tab: { q: '', sel: new Set(), scope: '' },
    compact: false,
    menu: null,
    popover: null,
    modal: null,
    snack: null,
    toast: null,
    flash: new Set(),
  };

  /* ---------------------------------------------------------------- helpers */
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const C = (k) => db.contacts[k];
  const isPerson = (c) => c && c.type === 'Person';
  const matterById = (id) => db.matters.find((m) => m.id === id);

  function fullName(c) {
    if (!c) return '';
    if (!isPerson(c)) return c.company;
    return [c.title, c.first, c.middle, c.last].filter(Boolean).join(' ');
  }
  function listName(c) {
    if (!isPerson(c)) return c.company;
    return `${c.last}, ${[c.first, c.middle].filter(Boolean).join(' ')}`;
  }
  function givenName(c) { return [c.first, c.middle].filter(Boolean).join(' '); }
  function initials(c) {
    if (!isPerson(c)) return c.company.slice(0, 2).toUpperCase();
    const f = (c.first || '').split(' ')[0];
    return ((f[0] || '') + (c.middle ? c.middle[0] : '') + (c.last[0] || '')).toUpperCase();
  }
  function companyOf(c) { return c && c.companyId ? C(c.companyId) : null; }
  function linkedPeople(companyKey) { return Object.values(db.contacts).filter((p) => p.companyId === companyKey); }

  function rolesOf(key) {
    const r = new Set((C(key).roles || []));
    db.matters.forEach((m) => {
      if (m.clients.includes(key)) r.add('Client');
      if (m.parties.some((p) => p[0] === key)) r.add('Party');
    });
    return ['Client', 'Party'].filter((x) => r.has(x));
  }
  function mattersOf(key) {
    const out = [];
    db.matters.forEach((m) => {
      if (m.clients.includes(key)) out.push({ m, as: m.clients[0] === key ? 'Client (Primary)' : 'Client', tab: 'clients' });
      const p = m.parties.find((x) => x[0] === key);
      if (p) out.push({ m, as: `Party · ${p[1]}`, tab: 'parties' });
      const c = C(key);
      if (c.companyId && m.clients.includes(c.companyId)) out.push({ m, as: 'Contact for client', tab: 'clients' });
    });
    return out;
  }

  /* --------------------------------------------------------------- statuses */
  const SVG = {
    verified: '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M15.33 7.99 13.7 6.13l.23-2.46-2.4-.55L10.26 1 8 1.97 5.73 1 4.47 3.13l-2.4.54.22 2.46L.66 7.99l1.63 1.86-.22 2.47 2.4.55L5.73 15 8 14.02l2.26.97 1.26-2.13 2.4-.55-.22-2.46 1.63-1.86ZM6.72 11.14 4.19 8.6l.99-.99 1.54 1.56 3.9-3.91.99.99-4.89 4.89Z"/></svg>',
    invited: '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M7.69 7.68 2.6 4.51v6.35h5.72v1.27H2.6c-.35 0-.65-.12-.9-.37a1.22 1.22 0 0 1-.37-.9V3.24c0-.35.12-.65.37-.9s.55-.37.9-.37h10.16c.35 0 .65.12.9.37s.37.55.37.9v4.44h-1.27V4.51L7.69 7.68Zm0-1.27 5.07-3.17H2.6l5.08 3.17Zm4.44 7.62-.89-.89 1-1.02H9.59v-1.27h2.65l-1.02-1.02.9-.88 2.55 2.54-2.54 2.54Z"/></svg>',
    progress: '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M8 1.34a6.67 6.67 0 1 0 0 13.33A6.67 6.67 0 0 0 8 1.34Zm0 12A5.34 5.34 0 1 1 8 2.67a5.34 5.34 0 0 1 0 10.67Zm.34-8.67h-1v4l3.5 2.1.5-.82-3-1.78v-3.5Z"/></svg>',
    review: '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M8 4a6.4 6.4 0 0 1 5.88 3.66A6.4 6.4 0 0 1 8 11.33a6.4 6.4 0 0 1-5.88-3.67A6.4 6.4 0 0 1 8 4Zm0-1.34A7.88 7.88 0 0 0 .66 7.66 7.88 7.88 0 0 0 8 12.66a7.88 7.88 0 0 0 7.33-5 7.88 7.88 0 0 0-7.33-5ZM8 6c.92 0 1.66.74 1.66 1.66S8.92 9.33 8 9.33 6.33 8.58 6.33 7.66 7.08 6 8 6Zm0-1.34a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>',
    failed: '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M8 1.34a6.67 6.67 0 1 0 0 13.33A6.67 6.67 0 0 0 8 1.34Zm.67 10h-1.34V10h1.34v1.34Zm0-2.67H7.33v-4h1.34v4Z"/></svg>',
    notchecked: '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M8 1.34a6.67 6.67 0 1 0 0 13.33A6.67 6.67 0 0 0 8 1.34Zm0 12A5.34 5.34 0 1 1 8 2.67a5.34 5.34 0 0 1 0 10.67ZM4.67 7.34h6.67v1.33H4.67V7.34Z"/></svg>',
    expired: '<svg viewBox="0 0 16 16"><path fill="currentColor" d="m6.21 11.33 1.62-1.63 1.63 1.63.71-.7L8.54 9l1.63-1.63-.71-.7-1.63 1.62-1.62-1.62-.71.7L7.13 9 5.5 10.63l.71.7Zm6.46-9.33H12V.66h-1.33V2H5.33V.66H4V2h-.67C2.6 2 2 2.6 2 3.33L2 12.66C2 13.4 2.6 14 3.33 14h9.34C13.4 14 14 13.4 14 12.66V3.33C14 2.6 13.4 2 12.67 2Zm0 10.66H3.33V5.33h9.34v7.33Z"/></svg>',
  };
  const ORDER = { failed: 0, expired: 1, progress: 2, review: 3, invited: 4, notchecked: 5, verified: 6 };
  const COUNT_ORDER = ['invited', 'progress', 'review', 'failed', 'expired', 'notchecked'];

  function st(key, text, extraCls) {
    const s = STATUS[key];
    return `<span class="st ${s.tone} ${extraCls || ''}">${SVG[s.icon]}<span>${esc(text)}</span></span>`;
  }
  /* table cell: short label, AML says Passed instead of Verified */
  function stCell(c, field) {
    if (!isPerson(c) || !c.status) return '<span class="dash">—</span>';
    const k = c.status[field];
    const label = k === 'verified' && field === 'aml' ? 'Passed' : STATUS[k].short;
    return st(k, label);
  }
  function stLine(c, withDate) {
    const k = c.status.id;
    const d = withDate && k !== 'notchecked' && c.status.date ? `<span class="date">&nbsp;· ${esc(c.status.date)}</span>` : '';
    return `<span class="st big ${STATUS[k].tone}">${SVG[STATUS[k].icon]}<span>${esc(STATUS[k].line)}</span>${d}</span>`;
  }
  function clientDone(key) {
    const c = C(key);
    if (isPerson(c)) return c.status.id === 'verified';
    return linkedPeople(key).every((p) => p.status.id === 'verified');
  }

  /* -------------------------------------------------------------- routing */
  function route() {
    const h = (location.hash || '#/directory').slice(2);
    const [path, qs] = h.split('?');
    const parts = path.split('/');
    const params = new URLSearchParams(qs || '');
    if (parts[0] === 'matter' && matterById(parts[1])) return { name: 'matter', id: parts[1], tab: parts[2] || 'summary', params };
    if (parts[0] === 'matters') return { name: 'matters', params };
    return { name: 'directory', params };
  }
  let lastRouteKey = '';
  window.addEventListener('hashchange', () => {
    const r = route();
    const key = r.name + (r.id || '') + (r.tab || '');
    if (key !== lastRouteKey) { ui.tab.sel.clear(); ui.tab.q = ''; ui.menu = null; ui.popover = null; }
    if (r.name === 'directory' && r.params.get('q') != null) { ui.dir.q = r.params.get('q'); ui.dir.filter = 'all'; ui.dir.page = 1; }
    const hl = r.params.get('hl'); if (hl) flash(hl);
    lastRouteKey = key;
    render(true);
  });
  function go(hash) { location.hash = hash; }

  function flash(key) { ui.flash.add(key); setTimeout(() => { ui.flash.delete(key); }, 1700); }

  /* ------------------------------------------------------------ side nav */
  function sidenavHtml(r) {
    const item = (icon, label, act, sel, chev) => `<button class="nav-item ${sel ? 'sel' : ''}" data-act="${act}"><span class="ms">${icon}</span>${label}${chev ? '<span class="ms chev">expand_more</span>' : ''}</button>`;
    return `
      <button class="icon-btn collapse" data-act="na" aria-label="Collapse menu" style="color:#fff"><span class="ms">menu_open</span></button>
      ${item('dashboard', 'Dashboard', 'na')}
      ${item('work', 'Matters', 'nav-matters', r.name === 'matters' || r.name === 'matter')}
      ${item('contacts', 'Directory', 'nav-directory', r.name === 'directory')}
      ${item('account_balance', 'Accounting', 'na', false, true)}
      ${item('apartment', 'Head Office', 'na', false, true)}
      ${item('bar_chart', 'Reports', 'na', false, true)}
      ${item('settings', 'Settings', 'na', false, true)}
      <div class="proto">
        <b>Prototype controls</b>
        <label><input type="checkbox" data-act="toggle-fail" ${ui.failNext ? 'checked' : ''}> Next send fails</label>
        <button class="pbtn" data-act="advance">Move invites on a step ▸</button>
        <button class="pbtn" data-act="reset">Reset data</button>
        <div class="hint">Invited → In progress → In review → Verified. Changes are shared by the Directory, matter headers and the Clients/Parties tabs.</div>
      </div>`;
  }

  /* ------------------------------------------------------------ directory */
  function dirRows() {
    const q = ui.dir.q.trim().toLowerCase();
    let rows = Object.values(db.contacts).map((c) => ({ c, roles: rolesOf(c.key) }));
    if (ui.dir.filter === 'clients') rows = rows.filter((r) => r.roles.includes('Client'));
    if (ui.dir.filter === 'parties') rows = rows.filter((r) => r.roles.includes('Party'));
    if (q) rows = rows.filter(({ c }) => [c.ref, fullName(c), c.company, companyOf(c) && companyOf(c).company, c.email, c.phone].join(' ').toLowerCase().includes(q));
    const sortKey = (c) => (isPerson(c) ? `${c.last} ${c.first}` : c.company).toLowerCase();
    rows.sort((a, b) => sortKey(a.c).localeCompare(sortKey(b.c)));
    return rows;
  }

  function personCells(c) {
    const co = companyOf(c);
    if (!isPerson(c)) {
      return `<td>Company</td><td class="dash">—</td><td class="dash">—</td><td class="dash">—</td><td class="company-name">${esc(c.company)}</td>`;
    }
    return `<td>Person</td><td>${esc(c.title)}</td><td>${esc(givenName(c))}</td><td>${esc(c.last)}</td><td>${co ? esc(co.company) : '<span class="dash">—</span>'}</td>`;
  }
  function contactCells(c) {
    const phone = c.phone ? `<a data-act="contact-link" data-kind="phone">${esc(c.phone)}</a>` : '';
    const email = c.email ? `<a data-act="contact-link" data-kind="email">${esc(c.email)}</a>` : '';
    return `<td class="link">${phone}</td><td class="link">${email}</td>`;
  }
  function cbHtml(state, act, attrs, hidden) {
    const cls = state === true ? 'on' : state === 'mixed' ? 'mixed' : '';
    return `<button class="cb-hit ${hidden ? 'hidden' : ''}" data-act="${act}" ${attrs || ''} aria-label="Select"><span class="cb ${cls}"></span></button>`;
  }

  function selBarHtml(selKeys, scope) {
    if (!selKeys.length) return '';
    const hasCompany = selKeys.some((k) => !isPerson(C(k)));
    return `<div class="selbar">
      <button class="icon-btn teal" data-act="sel-clear" data-scope="${scope}" aria-label="Clear selection"><span class="ms">close</span></button>
      <span class="count">${selKeys.length} selected</span>
      <a class="act ${hasCompany ? 'disabled' : ''}" data-act="invite-sel" data-scope="${scope}">Invite to Verify ID</a>
      ${hasCompany ? '<span class="err"><span class="ms sm">error</span>Only people can be asked for an ID check. Deselect companies to continue.</span>' : ''}
    </div>`;
  }

  function directoryHtml() {
    const all = dirRows();
    const per = 25;
    const pages = Math.max(1, Math.ceil(all.length / per));
    ui.dir.page = Math.min(ui.dir.page, pages);
    const rows = all.slice((ui.dir.page - 1) * per, ui.dir.page * per);
    const sel = ui.dir.sel;
    const visSel = rows.filter((r) => sel.has(r.c.key)).length;
    const headState = visSel === 0 ? false : visSel === rows.length ? true : 'mixed';
    const seg = (k, label) => `<button class="${ui.dir.filter === k ? 'on' : ''}" data-act="dir-filter" data-k="${k}">${ui.dir.filter === k ? '<span class="ms sm">check</span>' : ''}${label}</button>`;
    const body = rows.map(({ c, roles }) => `
      <tr class="${ui.flash.has(c.key) ? 'flash' : ''}" data-key="${c.key}">
        <td class="chk">${cbHtml(sel.has(c.key), 'dir-sel', `data-key="${c.key}"`)}</td>
        <td>${esc(c.ref)}</td>
        ${personCells(c)}
        <td><span class="roles">${roles.map((r) => `<span class="role">${r}</span>`).join('') || '<span class="dash">—</span>'}</span></td>
        ${contactCells(c)}
        <td>${stCell(c, 'id')}</td><td>${stCell(c, 'addr')}</td><td>${stCell(c, 'aml')}</td>
        <td class="act-col"><button class="icon-btn" data-act="row-menu" data-scope="dir" data-key="${c.key}" aria-label="Actions"><span class="ms">more_vert</span></button></td>
      </tr>`).join('');
    const pg = [];
    for (let i = 1; i <= pages; i++) pg.push(`<button class="pg ${i === ui.dir.page ? 'on' : ''}" data-act="dir-page" data-p="${i}">${i}</button>`);
    return `<div class="page">
      <div class="page-head"><h1>Directory</h1><button class="btn filled tall" data-act="na"><span class="ms">add</span>Add</button></div>
      <div class="toolbar">
        <label class="search"><span class="ms">search</span><input id="dir-q" placeholder="Search Contacts" value="${esc(ui.dir.q)}" autocomplete="off"></label>
        <button class="tool-link" data-act="na"><span class="ms sm">view_column</span>Columns</button>
        <button class="tool-link" data-act="na"><span class="ms sm">filter_list</span>Filters</button>
        <span class="spacer"></span>
        <div class="seg">${seg('all', 'All')}${seg('clients', 'Clients')}${seg('parties', 'Parties')}</div>
      </div>
      ${selBarHtml([...sel], 'dir')}
      <div class="table-wrap" style="flex:1;min-height:320px">
        <div class="table-scroll" id="dir-scroll">
          <table class="dt"><thead><tr>
            <th class="chk">${cbHtml(headState, 'dir-sel-all')}</th>
            <th>Reference</th><th>Type</th><th>Title</th><th>Name</th><th>Surname</th><th>Company</th><th>Role</th><th>Phone</th><th>Email</th><th>ID Verified</th><th>Address Verified</th><th>AML Check</th><th class="act-col">Action</th>
          </tr></thead><tbody>${body}</tbody></table>
          ${rows.length ? '' : '<div class="empty">No contacts match your search.</div>'}
        </div>
        <div class="pager">
          <button class="pg" data-act="dir-page" data-p="1" ${ui.dir.page === 1 ? 'disabled' : ''}><span class="ms sm">first_page</span></button>
          <button class="pg" data-act="dir-page" data-p="${ui.dir.page - 1}" ${ui.dir.page === 1 ? 'disabled' : ''}><span class="ms sm">chevron_left</span></button>
          ${pg.join('')}
          <button class="pg" data-act="dir-page" data-p="${ui.dir.page + 1}" ${ui.dir.page === pages ? 'disabled' : ''}><span class="ms sm">chevron_right</span></button>
          <span class="per">25 <span class="ms sm">arrow_drop_down</span></span><span style="margin-left:12px">Items per page</span>
          <span class="total">${ui.dir.page} of ${pages} page${pages > 1 ? 's' : ''} (${all.length} item${all.length === 1 ? '' : 's'})</span>
        </div>
      </div>
    </div>`;
  }

  /* -------------------------------------------------------------- matters */
  function checksSummary(m) {
    const need = m.clients.filter((k) => !clientDone(k)).length;
    return need ? `<span class="checks-need">${need} check${need > 1 ? 's' : ''} needed</span>` : '<span class="checks-ok">All verified</span>';
  }
  function mattersHtml() {
    const rows = db.matters.map((m) => `<tr>
      <td class="link"><a class="mref" href="#/matter/${m.id}/summary">${esc(m.ref)}</a></td>
      <td>${esc(m.clients.map((k) => fullName(C(k))).slice(0, 3).join(', '))}${m.clients.length > 3 ? ` + ${m.clients.length - 3} more` : ''}</td>
      <td>${esc(m.description)}</td><td>${esc(m.type)}</td><td>${esc(m.opened)}</td>
      <td><span class="role">${esc(m.status)}</span></td>
      <td>${checksSummary(m)}</td>
      <td class="link"><a href="#/matter/${m.id}/parties">${m.parties.length} parties</a></td>
    </tr>`).join('');
    return `<div class="page flow">
      <div class="page-head"><h1>Matters</h1><button class="btn filled tall" data-act="na"><span class="ms">add</span>New matter</button></div>
      <div class="table-wrap"><div class="table-scroll"><table class="dt"><thead><tr>
        <th>Matter</th><th>Client(s)</th><th>Description</th><th>Type</th><th>Opened</th><th>Status</th><th>Client ID checks</th><th>Parties</th>
      </tr></thead><tbody>${rows}</tbody></table></div></div>
    </div>`;
  }

  /* ------------------------------------------------------- matter header */
  function joinNames(names) {
    if (names.length <= 1) return names.join('');
    return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
  }
  function clientsTitle(m) {
    const cl = m.clients.map(C);
    if (cl.length >= 5) return cl.map(listName).join(' & ');
    return joinNames(cl.map(fullName));
  }
  function contactRows(c) {
    const out = [];
    out.push(`<div class="row"><span class="ms">call</span>${c.phone ? `<a data-act="contact-link" data-kind="phone">${esc(c.phone)}</a>` : '<span class="muted">No phone number</span>'}</div>`);
    out.push(`<div class="row"><span class="ms">mail</span>${c.email ? `<a data-act="contact-link" data-kind="email" title="${esc(c.email)}">${esc(c.email)}</a>` : '<span class="muted">No email address</span>'}</div>`);
    return out.join('');
  }
  function nameStatus(c, primary) {
    if (!isPerson(c)) return `<div class="row plain">${esc(c.company)}${primary ? ' (Primary)' : ''}</div>`;
    return `<div class="row">${st(c.status.id, listName(c) + (primary ? ' (Primary)' : ''), 'big')}</div>`;
  }
  function companyColumn(c, primary) {
    const ppl = linkedPeople(c.key);
    return `<div class="ccol">${nameStatus(c, primary)}${ppl.length ? ppl.map((p) => nameStatus(p)).join('') : '<div class="row muted">No associated person(s)</div>'}</div>`;
  }
  function headerClientsHtml(m) {
    const cl = m.clients.map(C);
    const n = cl.length;
    if (n === 1) {
      const c = cl[0];
      if (!isPerson(c)) return companyColumn(c, false);
      return `<div class="ccol"><div class="row">${stLine(c, false)}</div>${contactRows(c)}</div>`;
    }
    if (n <= 3) {
      return cl.map((c, i) => (isPerson(c) ? `<div class="ccol">${nameStatus(c, i === 0)}${contactRows(c)}</div>` : companyColumn(c, i === 0))).join('');
    }
    const first = `<div class="ccol">${nameStatus(cl[0], true)}${isPerson(cl[0]) ? contactRows(cl[0]) : ''}</div>`;
    if (n === 4) return first + `<div class="ccol">${cl.slice(1).map((c) => nameStatus(c)).join('')}</div>`;
    const rest = n - 3;
    const need = m.clients.filter((k) => !clientDone(k)).length;
    return first + `<div class="ccol">${cl.slice(1, 3).map((c) => nameStatus(c)).join('')}
      <div class="row"><a class="more" data-act="more-clients" data-id="${m.id}">+ ${rest} more</a>${need ? `<span class="needed">${need} check${need > 1 ? 's' : ''} needed</span>` : '<span class="allv">All Verified</span>'}</div></div>`;
  }
  function headerHtml(m) {
    return `<div class="mh ${ui.compact ? 'compact' : ''}">
      <button class="back" data-act="back" aria-label="Back"><span class="ms">chevron_left</span></button>
      <div class="ref"><span class="num">${esc(m.ref)}</span><span class="folder"><span class="ms">folder</span></span></div>
      <div class="body">
        <div class="title" title="${esc(clientsTitle(m))}">${esc(clientsTitle(m))}</div>
        <div class="desc">${esc(m.description)}</div>
        <div class="clients">${headerClientsHtml(m)}</div>
        <div class="meta"><div><span class="open">${esc(m.status)}</span>${esc(m.opened)} - ${esc(m.closed)}</div><div>${esc(m.type)}</div></div>
      </div>
      <div class="right">
        <button class="btn filled" data-act="actions-menu" data-id="${m.id}"><span class="ms sm">expand_more</span>Actions</button>
        <button class="icon-btn teal" data-act="compact" aria-label="Collapse header"><span class="ms">${ui.compact ? 'expand_more' : 'expand_less'}</span></button>
      </div>
    </div>`;
  }

  function moreClientsHtml(m, rect) {
    const rest = m.clients.slice(3);
    const sorted = rest.slice().sort((a, b) => {
      const da = clientDone(a), dbb = clientDone(b);
      if (da !== dbb) return da ? 1 : -1;
      if (!da) {
        const oa = isPerson(C(a)) ? ORDER[C(a).status.id] : 9, ob = isPerson(C(b)) ? ORDER[C(b).status.id] : 9;
        if (oa !== ob) return oa - ob;
      }
      return listName(C(a)).localeCompare(listName(C(b)));
    });
    const cell = (c) => `<td>${c.phone ? `<a data-act="contact-link" data-kind="phone">${esc(c.phone)}</a>` : ''}</td><td>${c.email ? `<a data-act="contact-link" data-kind="email">${esc(c.email)}</a>` : (c.phone ? '—' : '')}</td>`;
    const rows = sorted.map((k) => {
      const c = C(k);
      if (!isPerson(c)) {
        return `<tr><td class="co">${esc(c.company)}</td>${cell(c)}</tr>` + linkedPeople(k).map((p) => `<tr class="sub"><td>${p.status.id === 'verified' ? esc(listName(p)) : st(p.status.id, listName(p), 'big')}</td>${cell(p)}</tr>`).join('');
      }
      const done = c.status.id === 'verified';
      const nm = done ? `<span style="color:var(--text);font-weight:500">${esc(listName(c))}</span>` : st(c.status.id, listName(c), 'big');
      const contact = !c.phone && !c.email ? '<td colspan="2">No contact details on file</td>' : cell(c);
      return `<tr><td>${nm}</td>${contact}</tr>`;
    }).join('');
    const total = m.clients.length;
    const done = m.clients.filter(clientDone).length;
    const counts = {};
    m.clients.forEach((k) => { const c = C(k); if (isPerson(c) && c.status.id !== 'verified') counts[c.status.id] = (counts[c.status.id] || 0) + 1; });
    const sum = done < total ? `<div class="sum">
        <div class="hd"><span>ID verification status</span><span>${done} of ${total} Completed</span></div>
        <div class="bar"><i style="width:${Math.round(done / total * 100)}%"></i></div>
        <div class="counts">${COUNT_ORDER.filter((k) => counts[k]).map((k) => st(k, `${counts[k]} ${STATUS[k].short}`, 'big')).join('')}</div>
      </div>` : '';
    const left = Math.min(rect.left, window.innerWidth - 490);
    return `<div class="mcp" style="left:${left}px;top:${rect.bottom + 8}px">
      <h4>${rest.length} additional clients</h4>
      <table><thead><tr><th>Client</th><th>Phone</th><th>Email</th></tr></thead><tbody>${rows}</tbody></table>${sum}</div>`;
  }

  /* ------------------------------------------------------ clients/parties */
  function tabRows(m, tab) {
    if (tab === 'parties') return m.parties.map(([k, rel]) => ({ key: k, rel }));
    const rows = [];
    m.clients.forEach((k, i) => {
      rows.push({ key: k, rel: i === 0 ? 'Client (Primary)' : 'Client' });
      if (!isPerson(C(k))) linkedPeople(k).forEach((p) => rows.push({ key: p.key, rel: 'Contact for client' }));
    });
    return rows;
  }
  function peopleTabHtml(m, tab) {
    const scope = `${m.id}:${tab}`;
    if (ui.tab.scope !== scope) { ui.tab.scope = scope; ui.tab.sel.clear(); }
    const q = ui.tab.q.trim().toLowerCase();
    let rows = tabRows(m, tab);
    if (q) rows = rows.filter((r) => { const c = C(r.key); return [c.ref, fullName(c), c.company, companyOf(c) && companyOf(c).company, c.email, c.phone, r.rel].join(' ').toLowerCase().includes(q); });
    const sel = ui.tab.sel;
    const visSel = rows.filter((r) => sel.has(r.key)).length;
    const headState = visSel === 0 ? false : visSel === rows.length ? true : 'mixed';
    const noun = tab === 'parties' ? 'Parties' : 'Clients';
    const body = rows.map(({ key, rel }) => {
      const c = C(key);
      return `<tr class="${ui.flash.has(key) ? 'flash' : ''}">
        <td class="chk">${cbHtml(sel.has(key), 'tab-sel', `data-key="${key}"`)}</td>
        <td class="link"><a data-act="to-directory" data-key="${key}" title="Open in Directory">${esc(c.ref)}</a></td>
        ${personCells(c)}
        <td>${esc(rel)}</td>
        ${contactCells(c)}
        <td>${stCell(c, 'id')}</td><td>${stCell(c, 'addr')}</td><td>${stCell(c, 'aml')}</td>
        <td>${esc(c.address) || '<span class="dash">—</span>'}</td>
        <td class="act-col"><button class="icon-btn" data-act="row-menu" data-scope="tab" data-key="${key}" data-id="${m.id}" aria-label="Actions"><span class="ms">more_vert</span></button></td>
      </tr>`;
    }).join('');
    return `<div class="tab-body">
      <div class="toolbar">
        <label class="search" style="width:352px"><span class="ms">search</span><input id="tab-q" placeholder="Search ${noun}" value="${esc(ui.tab.q)}" autocomplete="off"></label>
        <button class="tool-link" data-act="na"><span class="ms sm">view_column</span>Columns</button>
        <button class="tool-link" data-act="na"><span class="ms sm">filter_list</span>Filters</button>
        <span class="spacer"></span>
        <button class="btn outline teal" data-act="${tab === 'parties' ? 'add-party' : 'na'}" data-id="${m.id}"><span class="ms sm">add</span>Add ${tab === 'parties' ? 'Party' : 'Client'}</button>
      </div>
      ${selBarHtml([...sel], 'tab')}
      <div class="table-wrap"><div class="table-scroll" id="tab-scroll">
        <table class="dt"><thead><tr>
          <th class="chk">${cbHtml(headState, 'tab-sel-all', `data-id="${m.id}" data-tab="${tab}"`)}</th>
          <th>Reference</th><th>Type</th><th>Title</th><th>Name</th><th>Surname</th><th>Company</th><th>Relationship</th><th>Phone No.</th><th>Email Address</th><th>ID Verified</th><th>Address Verified</th><th>AML Check</th><th>Address</th><th class="act-col">Action</th>
        </tr></thead><tbody>${body}</tbody></table>
        ${rows.length ? '' : `<div class="empty">No ${noun.toLowerCase()} match your search.</div>`}
      </div></div>
    </div>`;
  }

  function summaryHtml(m) {
    return `<div class="tab-body grey"><div class="cards">
      <div>
        <div class="card"><h3>Balances</h3><div class="kv"><span>Client balance</span><b>£1500.00</b></div><div class="kv"><span>Deposit balance</span><b>£8000.00</b></div><div class="kv"><span>Office balance</span><b>£50.00</b></div></div>
        <div class="card"><h3>Quotes</h3><div class="kv" style="border:0"><b>Cost Quote</b><b>£2500.00</b></div><div style="text-align:right;color:#D10000;font-size:13px">211.04%</div><div class="bar"><i style="width:100%;background:#E3000F"></i></div>
          <div class="kv" style="border:0"><span>Disbursement Quote</span><b>£300.00</b></div><div style="text-align:right;color:#16A34A;font-size:13px">48%</div><div class="bar"><i style="width:48%;background:#16A34A"></i></div></div>
      </div>
      <div>
        <div class="card"><h3>Important Notes <span class="ms" style="color:var(--link)">add_circle</span></h3>
          <div class="when"><span class="ms">schedule</span>04/02/2025 12:15 AM</div><div class="note">We have to get in contact with both clients. We have conflicting documents on both houses. Can you confirm that we need to…</div>
          <div class="when"><span class="ms">schedule</span>04/02/2025 12:15 AM</div><div class="note">No conflicts</div></div>
        <div class="card"><h3>Key Dates <span class="ms" style="color:var(--link)">add_circle</span></h3><div class="when"><span class="ms">calendar_month</span>10 Feb 2026</div>
          <div class="kv" style="margin-top:12px"><span>Type</span><b>Property key date</b></div><div class="kv"><span>Created by</span><b>${esc(m.feeEarner)}</b></div></div>
      </div>
      <div>
        <div class="card"><h3>Matter details</h3><div class="kv"><span>Opened date</span><b>${esc(m.opened)}</b></div><div class="kv"><span>Matter status</span><b>${esc(m.status)}</b></div><div class="kv"><span>Matter type</span><b>${esc(m.type.split(' / ').pop())}</b></div><div class="kv"><span>Principal fee earner</span><b>${esc(m.feeEarner)}</b></div><div class="kv"><span>Client ID checks</span><b>${checksSummary(m)}</b></div></div>
        <div class="card"><h3>Parties</h3>${m.parties.slice(0, 4).map(([k, rel]) => { const c = C(k); return `<div class="kv"><span>${esc(fullName(c))}</span>${isPerson(c) ? st(c.status.id, STATUS[c.status.id].short) : `<span class="dash">${esc(rel)}</span>`}</div>`; }).join('')}
          <div style="text-align:right;margin-top:10px"><a href="#/matter/${m.id}/parties">View all parties</a></div></div>
      </div>
    </div></div>`;
  }

  const TABS = [['summary', 'Summary'], ['details', 'Details'], ['documents', 'Documents'], ['financials', 'Financials'], ['activities', 'Activities'], ['clients', 'Clients'], ['parties', 'Parties'], ['feeearners', 'Fee Earners'], ['compliance', 'Compliance'], ['pafs', 'PAFs']];
  function matterHtml(m, tab) {
    const tabs = TABS.map(([k, label]) => {
      const n = k === 'clients' ? tabRows(m, 'clients').length : k === 'parties' ? m.parties.length : null;
      return `<a class="tab ${k === tab ? 'sel' : ''}" href="#/matter/${m.id}/${k}">${label}${n != null ? `<span class="n">${n}</span>` : ''}</a>`;
    }).join('');
    let body;
    if (tab === 'parties' || tab === 'clients') body = peopleTabHtml(m, tab);
    else if (tab === 'summary') body = summaryHtml(m);
    else body = `<div class="placeholder"><span class="ms">construction</span>The ${TABS.find((t) => t[0] === tab)[1]} tab isn't part of this prototype.<br>Try <a href="#/matter/${m.id}/parties">Parties</a> or <a href="#/matter/${m.id}/clients">Clients</a>.</div>`;
    return headerHtml(m) + `<nav class="tabs">${tabs}</nav>` + body;
  }

  /* ------------------------------------------------------------ dialog */
  function rowFrom(key, rel, ticked) {
    const c = C(key);
    return { key, rel, roles: rolesOf(key), ticked };
  }
  const defaultTick = (c) => ['notchecked', 'failed', 'expired'].includes(c.status.id);

  function openInvite(opts) {
    ui.menu = null; ui.popover = null;
    ui.modal = Object.assign({ phase: 'idle', error: false, editing: null, draft: {}, editErr: {}, newParties: [], checkboxes: true, allowAdd: false, unit: 'people', origin: '' }, opts);
    render();
  }
  function inviteFromMatter(m) {
    const clients = [];
    m.clients.forEach((k) => {
      const c = C(k);
      if (isPerson(c)) clients.push(rowFrom(k, '', defaultTick(c)));
      else linkedPeople(k).forEach((p) => clients.push(rowFrom(p.key, `Contact for ${c.company}`, defaultTick(p))));
    });
    const parties = m.parties.filter(([k]) => isPerson(C(k))).map(([k, rel]) => rowFrom(k, rel, defaultTick(C(k))));
    openInvite({
      origin: 'matter', matterId: m.id, allowAdd: true,
      subtitle: "Check who should be asked to verify their ID and the contact details we'll send an invite to. People with a verified ID aren't selected.",
      groups: [{ label: 'Clients', rows: clients }, { label: 'Parties', rows: parties }],
    });
  }
  function inviteFromDirectory(keys) {
    const rows = keys.map((k) => rowFrom(k, '', true));
    openInvite({
      origin: 'directory',
      subtitle: "Check who should be asked to verify their ID and the contact details we'll send an invite to.",
      groups: [{ label: 'Clients', rows: rows.filter((r) => r.roles.includes('Client')) }, { label: 'Parties', rows: rows.filter((r) => !r.roles.includes('Client')) }],
    });
  }
  function inviteFromTab(m, tab, keys) {
    const rels = Object.fromEntries(tabRows(m, tab).map((r) => [r.key, r.rel]));
    openInvite({
      origin: 'tab', matterId: m.id, checkboxes: false, unit: tab === 'parties' ? 'parties' : 'clients',
      subtitle: "Check the contact details we'll send the ID check invite to. Use the pencil to change them.",
      groups: [{ label: '', rows: keys.map((k) => rowFrom(k, rels[k] || '', true)) }],
    });
  }
  function inviteSingle(key, rel) {
    openInvite({
      origin: 'single', checkboxes: false,
      subtitle: "Check the contact details we'll send the ID check invite to. Use the pencil to change them.",
      groups: [{ label: '', rows: [rowFrom(key, rel || '', true)] }],
    });
  }

  function md() { return ui.modal; }
  function allRows() { return md().groups.flatMap((g) => g.rows); }
  function tickedCount() { return allRows().filter((r) => r.ticked).length + md().newParties.filter((p) => p.ticked).length; }

  function fld(id, label, value, err, extra) {
    return `<div class="fld ${err ? 'err' : ''} ${extra || ''}"><label for="${id}">${esc(label)}</label><input id="${id}" data-fld="${id}" value="${esc(value || '')}" autocomplete="off">${err ? `<span class="ms ei">error</span><div class="help">${esc(err)}</div>` : ''}</div>`;
  }
  function personRowHtml(r) {
    const M = md();
    const c = C(r.key);
    const roles = r.roles.map((x) => `<span class="role">${x}</span>`).join('');
    const editing = M.editing === r.key;
    let lower;
    if (editing) {
      lower = `<div class="fields">${fld('e-email', 'Email address*', M.draft.email, M.editErr.email)}${fld('e-mobile', 'Mobile number*', M.draft.mobile, M.editErr.mobile)}</div>
        <div class="inline-actions"><button class="btn text" data-act="edit-cancel">Cancel</button><button class="btn text" data-act="edit-save">Save</button></div>`;
    } else {
      lower = `<div class="contact">
        ${c.email ? `<span><span class="ms">mail</span>${esc(c.email)}</span>` : '<span class="miss"><span class="ms">mail</span>No email address</span>'}
        ${c.phone ? `<span><span class="ms">call</span>${esc(c.phone)}</span>` : '<span class="miss"><span class="ms">call</span>No mobile number</span>'}
      </div>`;
    }
    const rel = r.rel ? `<span class="rel">${esc(r.rel)}</span>` : '';
    return `<div class="prow">
      ${M.checkboxes ? cbHtml(r.ticked, 'm-tick', `data-key="${r.key}"`) : ''}
      <div class="av">${esc(initials(c))}</div>
      <div class="pmain">
        <div class="pname">${esc(fullName(c))}<span class="roles">${roles}</span>${rel}</div>
        <div>${stLine(c, true)}</div>
        ${lower}
      </div>
      ${editing || M.phase !== 'idle' ? '<span style="width:40px"></span>' : `<button class="icon-btn teal edit" data-act="edit" data-key="${r.key}" aria-label="Edit contact details"><span class="ms">edit</span></button>`}
    </div>`;
  }
  function newPartyHtml(p, i) {
    const e = p.err || {};
    const opts = ['<option value=""></option>'].concat(RELATIONSHIPS.map((x) => `<option ${p.rel === x ? 'selected' : ''}>${x}</option>`)).join('');
    return `<div class="prow adding">
      ${cbHtml(p.ticked, 'np-tick', `data-i="${i}"`)}
      <div class="pmain">
        <div class="pname" style="font-weight:500;font-size:13px;color:var(--text-3);margin-top:10px">New party <span class="role">Party</span></div>
        <div class="fields">
          ${fld(`np-${i}-first`, 'First name*', p.first, e.first)}
          ${fld(`np-${i}-last`, 'Last name*', p.last, e.last)}
          <div class="fld full ${e.rel ? 'err' : ''}"><label>Relationship*</label><select data-fld="np-${i}-rel">${opts}</select><span class="ms caret">expand_more</span>${e.rel ? `<div class="help">${esc(e.rel)}</div>` : ''}</div>
          ${fld(`np-${i}-email`, 'Email address*', p.email, e.email)}
          ${fld(`np-${i}-mobile`, 'Mobile number*', p.mobile, e.mobile)}
        </div>
      </div>
      <button class="icon-btn teal" data-act="np-remove" data-i="${i}" aria-label="Remove new party" style="margin-top:4px"><span class="ms">close</span></button>
    </div>`;
  }
  function modalHtml() {
    const M = md();
    const n = tickedCount();
    const groups = M.groups.filter((g) => g.rows.length || (g.label === 'Parties' && M.allowAdd)).map((g) => `
      ${g.label ? `<div class="grp">${g.label}</div>` : ''}
      ${g.rows.map(personRowHtml).join('')}
      ${g.label === 'Parties' && M.allowAdd ? M.newParties.map(newPartyHtml).join('') + `<button class="add-party" data-act="np-add"><span class="ms">add</span>Add new party</button>` : ''}`).join('');
    const unit = n === 1 ? (M.unit === 'people' ? 'person' : M.unit.replace(/ies$/, 'y').replace(/s$/, '')) : M.unit;
    const info = M.error ? '<span class="info err">An error occurred sending the invites. Please try again.</span>' : `<span class="info">${M.groups.length && (M.checkboxes || n > 1) ? `${n} ${unit} selected` : ''}</span>`;
    let primary;
    if (M.phase === 'sending') primary = '<button class="btn filled tall" disabled style="background:var(--primary);color:#fff;opacity:.85"><span class="spin"></span>Sending</button>';
    else if (M.phase === 'sent') primary = '<button class="btn filled tall"><span class="ms sm">check</span>Request Sent</button>';
    else primary = `<button class="btn filled tall" data-act="send" ${n === 0 || M.editing ? 'disabled' : ''}>${n === 1 ? 'Send invite' : `Send ${n} invites`}</button>`;
    return `<div class="scrim" data-act="scrim"><div class="dlg" role="dialog" aria-modal="true" aria-labelledby="dlg-t">
      <div class="dlg-h"><h2 id="dlg-t">Invite to Verify ID</h2><p>${esc(M.subtitle)}</p><button class="icon-btn x" data-act="m-close" aria-label="Close"><span class="ms">close</span></button></div>
      <div class="dlg-b" id="dlg-b">${groups}</div>
      <div class="dlg-f">${info}<button class="btn outline tall" data-act="m-close" ${M.phase !== 'idle' ? 'disabled' : ''}>Cancel</button>${primary}</div>
    </div></div>`;
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validateContact(email, mobile) {
    const e = {};
    if (!email.trim()) e.email = 'We need email to send the invite';
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address';
    if (!mobile.trim()) e.mobile = 'We need a mobile number to send the invite';
    return e;
  }
  function readDraftInputs() {
    const M = md(); if (!M) return;
    document.querySelectorAll('[data-fld]').forEach((el) => {
      const f = el.dataset.fld;
      if (f === 'e-email') M.draft.email = el.value;
      else if (f === 'e-mobile') M.draft.mobile = el.value;
      else {
        const m = f.match(/^np-(\d+)-(\w+)$/);
        if (m && M.newParties[+m[1]]) M.newParties[+m[1]][m[2]] = el.value;
      }
    });
  }

  function send() {
    const M = md();
    readDraftInputs();
    // existing people with missing details: open the first one's editor with the error
    const missing = allRows().find((r) => r.ticked && (!C(r.key).email || !C(r.key).phone));
    if (missing) {
      const c = C(missing.key);
      M.editing = missing.key; M.draft = { email: c.email, mobile: c.phone };
      M.editErr = validateContact(c.email || '', c.phone || '');
      render(); return;
    }
    let bad = false;
    M.newParties.forEach((p) => {
      if (!p.ticked) { p.err = {}; return; }
      const e = validateContact(p.email || '', p.mobile || '');
      if (!(p.first || '').trim()) e.first = 'Enter a first name';
      if (!(p.last || '').trim()) e.last = 'Enter a last name';
      if (!p.rel) e.rel = 'Choose a relationship';
      p.err = e; if (Object.keys(e).length) bad = true;
    });
    if (bad) { render(); return; }
    M.phase = 'sending'; M.error = false; render();
    setTimeout(() => {
      if (!ui.modal) return;
      if (ui.failNext) { ui.failNext = false; save(); M.phase = 'idle'; M.error = true; render(); return; }
      M.phase = 'sent'; render();
      setTimeout(() => { if (ui.modal) applyInvites(); }, 900);
    }, 1300);
  }

  function applyInvites() {
    const M = md();
    const sent = [];
    allRows().filter((r) => r.ticked).forEach((r) => {
      const c = C(r.key);
      c.status = { id: 'invited', addr: 'invited', aml: 'invited', date: TODAY };
      sent.push(c); flash(c.key);
    });
    const m = M.matterId ? matterById(M.matterId) : null;
    M.newParties.filter((p) => p.ticked).forEach((p) => {
      const key = `new${db.seq++}`;
      const c = { key, ref: `${p.last.trim()[0].toUpperCase()}${50300 + db.seq}`, type: 'Person', title: '', first: p.first.trim(), middle: '', last: p.last.trim(), companyId: null, roles: [], phone: p.mobile.trim(), email: p.email.trim(), address: '', status: { id: 'invited', addr: 'invited', aml: 'invited', date: TODAY } };
      db.contacts[key] = c;
      if (m) m.parties.push([key, p.rel]);
      sent.push(c); flash(key);
    });
    const unit = M.unit;
    if (M.origin === 'directory') ui.dir.sel.clear();
    if (M.origin === 'tab') ui.tab.sel.clear();
    ui.modal = null;
    save();
    snack(sent.length === 1 ? `An invitation to verify has been sent to ${fullName(sent[0])}` : `An invitation to verify has been sent to ${sent.length} ${unit}`);
    render();
  }

  /* -------------------------------------------------------- feedback */
  let snackTimer, toastTimer;
  function snack(msg) { ui.snack = msg; clearTimeout(snackTimer); snackTimer = setTimeout(() => { ui.snack = null; render(); }, 6000); }
  function toast(msg) { ui.toast = msg; clearTimeout(toastTimer); toastTimer = setTimeout(() => { ui.toast = null; render(); }, 2600); render(); }

  /* ------------------------------------------------------------ menus */
  function openMenu(btn, items) {
    const r = btn.getBoundingClientRect();
    ui.menu = { x: r.right, y: r.bottom + 4, items };
    ui.popover = null;
    render();
  }
  function menuHtml() {
    const M = ui.menu;
    const items = M.items.map((it, i) => {
      if (it.sep) return '<div class="sep"></div>';
      if (it.label && it.heading) return `<div class="lbl">${esc(it.label)}</div>`;
      return `<button data-act="menu-item" data-i="${i}" ${it.disabled ? 'disabled' : ''}>${esc(it.label)}${it.sub ? `<span class="sub">${esc(it.sub)}</span>` : ''}</button>`;
    }).join('');
    const w = 260;
    const left = Math.max(8, Math.min(M.x - w, window.innerWidth - w - 8));
    const estH = M.items.length * 48 + 16;
    const top = M.y + estH > window.innerHeight - 8 ? Math.max(8, M.y - estH - 48) : M.y;
    return `<div class="menu" style="left:${left}px;top:${top}px;width:${w}px">${items}</div>`;
  }

  /* ------------------------------------------------------------ render */
  function render(resetScroll) {
    const r = route();
    const main = $('#main');
    const active = document.activeElement;
    const focusId = active && active.id && /^(dir-q|tab-q)$/.test(active.id) ? active.id : null;
    const caret = focusId ? active.selectionStart : 0;
    const scrolls = {};
    ['dir-scroll', 'tab-scroll', 'dlg-b'].forEach((id) => { const el = document.getElementById(id); if (el) scrolls[id] = [el.scrollLeft, el.scrollTop]; });
    const mainTop = main.scrollTop;

    $('#sidenav').innerHTML = sidenavHtml(r);
    let html;
    if (r.name === 'matter') html = matterHtml(matterById(r.id), r.tab);
    else if (r.name === 'matters') html = mattersHtml();
    else html = directoryHtml();
    main.innerHTML = html;
    main.style.background = r.name === 'matter' && r.tab === 'summary' ? 'var(--page)' : '#fff';

    let layer = '';
    if (ui.popover) {
      const m = matterById(ui.popover.id);
      if (m) layer += moreClientsHtml(m, ui.popover.rect);
    }
    if (ui.menu) layer += menuHtml();
    if (ui.modal) layer += modalHtml();
    if (ui.snack) layer += `<div class="snack" role="status"><span class="msg">${esc(ui.snack)}</span><button class="icon-btn" data-act="snack-close" style="color:#fff" aria-label="Dismiss"><span class="ms">close</span></button></div>`;
    if (ui.toast) layer += `<div class="toast">${esc(ui.toast)}</div>`;
    $('#layer').innerHTML = layer;

    if (resetScroll) main.scrollTop = 0; else main.scrollTop = mainTop;
    Object.entries(scrolls).forEach(([id, [l, t]]) => { const el = document.getElementById(id); if (el && !(resetScroll && id !== 'dlg-b')) { el.scrollLeft = l; el.scrollTop = t; } });
    if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus(); el.setSelectionRange(caret, caret); } }
    if (ui.modal && ui.modal.editing) { const el = document.getElementById('e-email'); if (el && document.activeElement !== el && !document.activeElement.id.startsWith('e-')) el.focus(); }
  }

  /* ------------------------------------------------------------ events */
  document.addEventListener('input', (e) => {
    if (e.target.id === 'dir-q') { ui.dir.q = e.target.value; ui.dir.page = 1; render(); }
    else if (e.target.id === 'tab-q') { ui.tab.q = e.target.value; render(); }
    else if (e.target.dataset && e.target.dataset.fld) readDraftInputs();
  });
  document.addEventListener('change', (e) => {
    if (e.target.dataset && e.target.dataset.fld) readDraftInputs();
    if (e.target.dataset && e.target.dataset.act === 'toggle-fail') { ui.failNext = e.target.checked; save(); toast(ui.failNext ? 'The next send will fail' : 'Sends will succeed'); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (ui.menu || ui.popover) { ui.menu = null; ui.popover = null; render(); }
      else if (ui.modal && ui.modal.phase === 'idle') { ui.modal = null; render(); }
    }
  });

  document.addEventListener('click', (e) => {
    const t = e.target instanceof Element ? e.target.closest('[data-act]') : null;
    const insideLayer = e.target instanceof Element && e.target.closest('.menu, .mcp');
    if (!t) {
      if ((ui.menu || ui.popover) && !insideLayer) { ui.menu = null; ui.popover = null; render(); }
      return;
    }
    const act = t.dataset.act;
    if (act === 'toggle-fail') return; // handled on change
    if (act !== 'menu-item' && act !== 'more-clients' && (ui.menu || ui.popover) && !insideLayer) { ui.menu = null; ui.popover = null; }
    const r = route();
    const d = t.dataset;
    switch (act) {
      case 'na': toast('Not part of this prototype'); break;
      case 'contact-link': e.preventDefault(); toast(d.kind === 'email' ? 'Would open a new email' : 'Would start a call'); break;
      case 'nav-matters': go('#/matters'); break;
      case 'nav-directory': go('#/directory'); break;
      case 'back': if (history.length > 1) history.back(); else go('#/matters'); break;
      case 'compact': ui.compact = !ui.compact; render(); break;

      case 'dir-filter': ui.dir.filter = d.k; ui.dir.page = 1; render(); break;
      case 'dir-page': ui.dir.page = +d.p; render(); { const el = $('#dir-scroll'); if (el) el.scrollTop = 0; } break;
      case 'dir-sel': ui.dir.sel.has(d.key) ? ui.dir.sel.delete(d.key) : ui.dir.sel.add(d.key); render(); break;
      case 'dir-sel-all': {
        const all = dirRows().slice((ui.dir.page - 1) * 25, ui.dir.page * 25).map((x) => x.c.key);
        const allOn = all.every((k) => ui.dir.sel.has(k));
        all.forEach((k) => (allOn ? ui.dir.sel.delete(k) : ui.dir.sel.add(k)));
        render(); break;
      }
      case 'tab-sel': ui.tab.sel.has(d.key) ? ui.tab.sel.delete(d.key) : ui.tab.sel.add(d.key); render(); break;
      case 'tab-sel-all': {
        const m = matterById(d.id);
        const keys = tabRows(m, d.tab).map((x) => x.key);
        const allOn = keys.every((k) => ui.tab.sel.has(k));
        keys.forEach((k) => (allOn ? ui.tab.sel.delete(k) : ui.tab.sel.add(k)));
        render(); break;
      }
      case 'sel-clear': (d.scope === 'dir' ? ui.dir.sel : ui.tab.sel).clear(); render(); break;
      case 'invite-sel': {
        if (d.scope === 'dir') inviteFromDirectory([...ui.dir.sel]);
        else inviteFromTab(matterById(r.id), r.tab, [...ui.tab.sel]);
        break;
      }
      case 'to-directory': go(`#/directory?q=${encodeURIComponent(C(d.key).ref)}&hl=${d.key}`); break;

      case 'row-menu': {
        const c = C(d.key);
        const person = isPerson(c);
        if (d.scope === 'dir') {
          const ms = mattersOf(d.key);
          const items = [
            { label: 'Edit', fn: () => toast('Not part of this prototype') },
            { label: 'Invite to Verify ID', disabled: !person, fn: () => inviteSingle(d.key) },
            { label: 'Add Matter', fn: () => toast('Not part of this prototype') },
          ];
          if (ms.length) {
            items.push({ sep: true }, { heading: true, label: 'Open matter' });
            ms.forEach((x) => items.push({ label: x.m.ref, sub: x.as, fn: () => { flash(d.key); go(`#/matter/${x.m.id}/${x.tab}`); } }));
          }
          openMenu(t, items);
        } else {
          const m = matterById(d.id);
          const rel = (tabRows(m, r.tab).find((x) => x.key === d.key) || {}).rel;
          openMenu(t, [
            { label: 'Edit', fn: () => toast('Not part of this prototype') },
            { label: 'Invite to Verify ID', disabled: !person, fn: () => inviteSingle(d.key, rel) },
            { label: 'View in Directory', fn: () => go(`#/directory?q=${encodeURIComponent(c.ref)}&hl=${d.key}`) },
            { label: r.tab === 'parties' ? 'Remove from matter' : 'Remove client', fn: () => toast('Not part of this prototype') },
          ]);
        }
        break;
      }
      case 'actions-menu': {
        const m = matterById(d.id);
        openMenu(t, ['Edit matter', 'Mark Favourite', 'Print', 'Start Timer', 'Add payment Request', 'Send email', 'InfoTrack request', 'Invite to Verify ID', 'Close Matter']
          .map((label) => ({ label, fn: label === 'Invite to Verify ID' ? () => inviteFromMatter(m) : () => toast('Not part of this prototype') })));
        break;
      }
      case 'menu-item': { const it = ui.menu.items[+d.i]; ui.menu = null; if (it && it.fn) it.fn(); render(); break; }
      case 'more-clients': {
        if (ui.popover) { ui.popover = null; render(); break; }
        const rect = t.getBoundingClientRect();
        ui.menu = null;
        ui.popover = { id: d.id, rect: { left: rect.left - 16, bottom: rect.bottom } };
        render(); break;
      }
      case 'add-party': inviteFromMatter(matterById(d.id)); md().newParties.push({ first: '', last: '', rel: '', email: '', mobile: '', ticked: true, err: {} }); render(); break;

      /* dialog */
      case 'scrim': if (e.target === t && ui.modal && ui.modal.phase === 'idle') { ui.modal = null; render(); } break;
      case 'm-close': if (ui.modal && ui.modal.phase === 'idle') { ui.modal = null; render(); } break;
      case 'm-tick': { readDraftInputs(); const row = allRows().find((x) => x.key === d.key); row.ticked = !row.ticked; md().error = false; render(); break; }
      case 'np-tick': { readDraftInputs(); const p = md().newParties[+d.i]; p.ticked = !p.ticked; render(); break; }
      case 'np-add': readDraftInputs(); md().newParties.push({ first: '', last: '', rel: '', email: '', mobile: '', ticked: true, err: {} }); render(); { const b = $('#dlg-b'); if (b) b.scrollTop = b.scrollHeight; } break;
      case 'np-remove': readDraftInputs(); md().newParties.splice(+d.i, 1); render(); break;
      case 'edit': { readDraftInputs(); const c = C(d.key); Object.assign(md(), { editing: d.key, draft: { email: c.email, mobile: c.phone }, editErr: {} }); render(); break; }
      case 'edit-cancel': Object.assign(md(), { editing: null, draft: {}, editErr: {} }); render(); break;
      case 'edit-save': {
        readDraftInputs();
        const M = md();
        const err = validateContact(M.draft.email || '', M.draft.mobile || '');
        if (Object.keys(err).length) { M.editErr = err; render(); break; }
        const c = C(M.editing);
        c.email = M.draft.email.trim(); c.phone = M.draft.mobile.trim();
        Object.assign(M, { editing: null, draft: {}, editErr: {}, error: false });
        save(); render(); break;
      }
      case 'send': send(); break;

      case 'snack-close': ui.snack = null; render(); break;
      case 'advance': {
        const next = { invited: 'progress', progress: 'review', review: 'verified' };
        let moved = 0;
        Object.values(db.contacts).forEach((c) => {
          if (!isPerson(c)) return;
          let changed = false;
          ['id', 'addr', 'aml'].forEach((f) => { if (next[c.status[f]]) { c.status[f] = next[c.status[f]]; changed = true; } });
          if (changed) { c.status.date = TODAY; moved++; flash(c.key); }
        });
        save(); snack(moved ? `Simulated: ${moved} people's checks moved on a step` : 'Nothing to move on'); render(); break;
      }
      case 'reset':
        try { localStorage.removeItem(KEY); } catch (err) { /* ignore */ }
        db = seed(); ui.failNext = false; ui.dir.sel.clear(); ui.tab.sel.clear(); ui.modal = null;
        snack('Prototype data reset'); render(); break;
      default: break;
    }
  });
  window.addEventListener('resize', () => { if (ui.menu || ui.popover) { ui.menu = null; ui.popover = null; render(); } });

  /* boot */
  if (!location.hash) location.replace('#/directory');
  const r0 = route();
  if (r0.name === 'directory' && r0.params.get('q') != null) ui.dir.q = r0.params.get('q');
  lastRouteKey = r0.name + (r0.id || '') + (r0.tab || '');
  render(true);
})();
