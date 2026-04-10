/**
 * ContractorIQ Dashboard — Interactions
 * Handles all button taps, modals, filters, forms, and animations
 */
(function () {
  'use strict';

  // ─────────────────────────────────────────
  //  BOTTOM SHEET ENGINE
  // ─────────────────────────────────────────
  function createSheet(title, content, actions) {
    actions = actions || [];
    closeSheet();

    var overlay = document.createElement('div');
    overlay.id = 'iq-overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;opacity:0;transition:opacity .25s;';

    var sheet = document.createElement('div');
    sheet.id = 'iq-sheet';
    sheet.style.cssText =
      'position:fixed;bottom:0;left:0;right:0;max-width:520px;margin:0 auto;' +
      'background:#fff;border-radius:24px 24px 0 0;z-index:1001;' +
      'transform:translateY(100%);transition:transform .32s cubic-bezier(.34,1.2,.64,1);' +
      'max-height:88vh;overflow-y:auto;padding-bottom:env(safe-area-inset-bottom,20px);' +
      "font-family:'Inter',sans-serif;";

    var actionsHTML = actions.map(function (a) {
      return (
        '<button onclick="' + a.fn + '" style="width:100%;padding:13px 16px;text-align:left;' +
        'border:none;border-radius:12px;background:' + (a.bg || '#f8fafc') + ';color:' + (a.color || '#1e293b') + ';' +
        "font-size:14px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;" +
        'display:flex;align-items:center;gap:12px;margin-bottom:8px;' +
        'transition:filter .15s;" onmousedown="this.style.filter=\'brightness(.95)\'" onmouseup="this.style.filter=\'none\'">' +
        '<span style="font-size:18px;">' + (a.icon || '') + '</span>' + a.label + '</button>'
      );
    }).join('');

    sheet.innerHTML =
      '<div style="padding:10px 0 0;display:flex;justify-content:center;">' +
        '<div style="width:36px;height:4px;background:#e2e8f0;border-radius:2px;"></div>' +
      '</div>' +
      '<div style="padding:16px 20px 28px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">' +
          '<h3 style="font-size:18px;font-weight:800;color:#0f172a;margin:0;flex:1;padding-right:12px;">' + title + '</h3>' +
          '<button onclick="IQ.closeSheet()" style="width:30px;height:30px;border-radius:50%;background:#f1f5f9;border:none;' +
          'cursor:pointer;font-size:14px;color:#64748b;flex-shrink:0;">✕</button>' +
        '</div>' +
        content +
        actionsHTML +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(sheet);
    overlay.addEventListener('click', closeSheet);

    requestAnimationFrame(function () {
      overlay.style.opacity = '1';
      sheet.style.transform = 'translateY(0)';
    });
  }

  function closeSheet() {
    var overlay = document.getElementById('iq-overlay');
    var sheet = document.getElementById('iq-sheet');
    if (overlay) { overlay.style.opacity = '0'; setTimeout(function () { if (overlay.parentNode) overlay.remove(); }, 260); }
    if (sheet) { sheet.style.transform = 'translateY(100%)'; setTimeout(function () { if (sheet.parentNode) sheet.remove(); }, 340); }
  }

  // ─────────────────────────────────────────
  //  TOAST NOTIFICATIONS
  // ─────────────────────────────────────────
  function toast(msg, type) {
    type = type || 'success';
    var existing = document.getElementById('iq-toast');
    if (existing) existing.remove();

    var colors = { success: '#22c55e', error: '#ef4444', info: '#3b82f6', warning: '#f97316' };
    var icons  = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };

    var t = document.createElement('div');
    t.id = 'iq-toast';
    t.style.cssText =
      'position:fixed;top:96px;left:50%;transform:translateX(-50%) translateY(-16px);' +
      'background:' + colors[type] + ';color:#fff;padding:11px 20px;border-radius:50px;' +
      "font-size:13px;font-weight:600;font-family:'Inter',sans-serif;" +
      'z-index:2000;opacity:0;transition:all .25s;white-space:nowrap;' +
      'box-shadow:0 8px 20px rgba(0,0,0,.18);display:flex;align-items:center;gap:8px;';
    t.innerHTML = '<span style="font-size:15px;">' + icons[type] + '</span>' + msg;
    document.body.appendChild(t);

    requestAnimationFrame(function () {
      t.style.opacity = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(function () {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(-10px)';
      setTimeout(function () { if (t.parentNode) t.remove(); }, 280);
    }, 2800);
  }

  // ─────────────────────────────────────────
  //  FORM HELPERS
  // ─────────────────────────────────────────
  function field(label, type, placeholder, id) {
    return (
      '<div style="margin-bottom:13px;">' +
        '<label style="display:block;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;">' + label + '</label>' +
        '<input type="' + type + '" placeholder="' + placeholder + '" id="' + id + '" ' +
        'style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:12px;' +
        "font-size:14px;font-family:'Inter',sans-serif;color:#1e293b;outline:none;box-sizing:border-box;background:#fff;" +
        'transition:border-color .2s;" ' +
        'onfocus="this.style.borderColor=\'#f97316\'" onblur="this.style.borderColor=\'#e2e8f0\'">' +
      '</div>'
    );
  }

  function select(label, options, id) {
    var opts = options.map(function (o) { return '<option value="' + o + '">' + o + '</option>'; }).join('');
    return (
      '<div style="margin-bottom:13px;">' +
        '<label style="display:block;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;">' + label + '</label>' +
        '<select id="' + id + '" style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:12px;' +
        "font-size:14px;font-family:'Inter',sans-serif;color:#1e293b;outline:none;background:#fff;box-sizing:border-box;" +
        'transition:border-color .2s;" onfocus="this.style.borderColor=\'#f97316\'" onblur="this.style.borderColor=\'#e2e8f0\'">' +
        '<option value="">Select…</option>' + opts +
        '</select>' +
      '</div>'
    );
  }

  function textarea(label, placeholder, id) {
    return (
      '<div style="margin-bottom:13px;">' +
        '<label style="display:block;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;">' + label + '</label>' +
        '<textarea id="' + id + '" placeholder="' + placeholder + '" rows="3" ' +
        'style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:12px;' +
        "font-size:14px;font-family:'Inter',sans-serif;color:#1e293b;outline:none;resize:none;box-sizing:border-box;" +
        'transition:border-color .2s;" onfocus="this.style.borderColor=\'#f97316\'" onblur="this.style.borderColor=\'#e2e8f0\'"></textarea>' +
      '</div>'
    );
  }

  function btn(label, fn) {
    return (
      '<button onclick="' + fn + '" style="width:100%;padding:15px;background:linear-gradient(135deg,#f97316,#ea580c);' +
      'color:#fff;border:none;border-radius:14px;font-size:15px;font-weight:700;' +
      "font-family:'Inter',sans-serif;cursor:pointer;margin-top:4px;" +
      'box-shadow:0 4px 14px rgba(249,115,22,.32);transition:filter .15s;" ' +
      'onmousedown="this.style.filter=\'brightness(.92)\'" onmouseup="this.style.filter=\'none\'">' +
      label + '</button>'
    );
  }

  function infoBox(lines) {
    var rows = lines.map(function (l) {
      return '<p style="font-size:13px;color:#475569;margin:0 0 5px;">' + l + '</p>';
    }).join('');
    return '<div style="background:#f8fafc;border-radius:14px;padding:14px;margin-bottom:16px;">' + rows + '</div>';
  }

  // ─────────────────────────────────────────
  //  QUICK ACTIONS
  // ─────────────────────────────────────────
  function newJob() {
    createSheet('New Job',
      field('Client / Property Name', 'text', 'e.g. Smith Residence', 'nj-client') +
      select('Job Type', ['Kitchen Remodel','Bathroom Addition','Roof Replacement','Deck Construction','Garage Conversion','Basement Finishing','Home Addition','Drywall / Painting','Custom Build'], 'nj-type') +
      field('Address', 'text', 'Street address', 'nj-addr') +
      field('Contract Value ($)', 'number', 'e.g. 45000', 'nj-val') +
      field('Start Date', 'date', '', 'nj-start') +
      select('Assign Crew Lead', ['Tony R.','Jake M.','Rosa K.','Mike S.','Sam T.','Kevin L.'], 'nj-crew') +
      btn('➕  Create Job', 'IQ.saveNewJob()')
    );
  }

  function saveNewJob() {
    var client = (document.getElementById('nj-client') || {}).value;
    var type   = (document.getElementById('nj-type')   || {}).value;
    if (!client || !type) { toast('Please fill in client name and job type', 'warning'); return; }
    closeSheet();
    setTimeout(function () { toast('Job created for ' + client + '!', 'success'); }, 380);
  }

  function addLead() {
    createSheet('Add Lead',
      field('Full Name', 'text', 'e.g. John Smith', 'al-name') +
      field('Phone Number', 'tel', '(512) 555-0100', 'al-phone') +
      field('Email', 'email', 'email@example.com', 'al-email') +
      select('Service Interested In', ['Kitchen Remodel','Bathroom Addition','Roof Work','Deck / Patio','Garage Conversion','Home Addition','Painting','Other'], 'al-service') +
      field('Estimated Value ($)', 'number', 'e.g. 35000', 'al-val') +
      select('Lead Source', ['Referral','Google','Facebook','Door Hanger','Yard Sign','Repeat Client','Walk-In','Other'], 'al-source') +
      btn('➕  Add Lead', 'IQ.saveLead()')
    );
  }

  function saveLead() {
    var name = (document.getElementById('al-name') || {}).value;
    if (!name) { toast('Please enter a name', 'warning'); return; }
    closeSheet();
    setTimeout(function () { toast('Lead added: ' + name, 'success'); }, 380);
  }

  function newEstimate() {
    createSheet('New Estimate',
      select('Client', ['David Chen','Sarah Rodriguez','Mike Johnson','Lisa Park','Bob Williams','Amanda Torres','New Client…'], 'ne-client') +
      select('Job Type', ['Kitchen Remodel','Bathroom Addition','Roof Replacement','Deck Construction','Garage Conversion','Basement Finishing','Other'], 'ne-type') +
      field('Estimate Amount ($)', 'number', 'e.g. 38000', 'ne-amt') +
      field('Valid Until', 'date', '', 'ne-exp') +
      textarea('Scope Notes', 'Brief summary of work included…', 'ne-notes') +
      btn('📋  Create Estimate', 'IQ.saveEstimate()')
    );
  }

  function saveEstimate() {
    var client = (document.getElementById('ne-client') || {}).value;
    if (!client) { toast('Please select a client', 'warning'); return; }
    closeSheet();
    setTimeout(function () { toast('Estimate created for ' + client + '!', 'success'); }, 380);
  }

  function newCallLog() {
    createSheet('Log a Call',
      select('Client', ['David Chen','Sarah Rodriguez','Mike Johnson','Lisa Park','Bob Williams','Amanda Torres'], 'cl-client') +
      select('Outcome', ['Left Voicemail','Spoke with Client','No Answer','Appointment Set','Follow-up Needed','Converted to Job'], 'cl-out') +
      textarea('Notes', 'What was discussed…', 'cl-notes') +
      field('Follow-up Date', 'date', '', 'cl-follow') +
      btn('📞  Log Call', 'IQ.saveCall()')
    );
  }

  function saveCall() {
    var client = (document.getElementById('cl-client') || {}).value;
    var out    = (document.getElementById('cl-out')    || {}).value;
    if (!client || !out) { toast('Please fill in client and outcome', 'warning'); return; }
    closeSheet();
    setTimeout(function () { toast('Call logged for ' + client, 'success'); }, 380);
  }

  // ─────────────────────────────────────────
  //  JOB CARDS
  // ─────────────────────────────────────────
  var JOBS = [
    { id:'#1043', name:'Kitchen Remodel',      client:'Martinez Residence', addr:'847 Oak Ln, Austin TX',        status:'In Progress', val:'$48,200', due:'Apr 28',      crew:'Tony R., Jake M.', pct:65  },
    { id:'#1044', name:'Bathroom Addition',    client:'Thompson Home',      addr:'221 Pine Dr, Austin TX',       status:'In Progress', val:'$22,800', due:'May 15',      crew:'Rosa K.',          pct:40  },
    { id:'#1045', name:'Deck Construction',    client:'Williams Property',  addr:'519 Maple Ave, Round Rock TX', status:'Scheduled',   val:'$18,500', due:'Starts Apr 12',crew:'Mike S., Kevin L.',pct:0   },
    { id:'#1046', name:'Roof Replacement',     client:'Garcia House',       addr:'333 Birch Ct, Austin TX',      status:'In Progress', val:'$14,300', due:'Apr 13 ⚠️',   crew:'Sam T.',           pct:85  },
    { id:'#1047', name:'Home Office Build-Out',client:'Anderson Home',      addr:'92 Cedar St, Georgetown TX',   status:'Completed',   val:'$9,700',  due:'Paid ✓',      crew:'Tony R.',          pct:100 },
    { id:'#1048', name:'Garage Conversion',    client:'Park Residence',     addr:'711 Elm St, Kyle TX',          status:'Scheduled',   val:'$42,100', due:'Starts Apr 17',crew:'Mike S.',          pct:0   },
  ];

  function openJob(i) {
    var j = JOBS[i];
    var sColors = { 'In Progress':'#ffedd5|#c2410c', 'Scheduled':'#dbeafe|#1d4ed8', 'Completed':'#dcfce7|#15803d' };
    var sc = (sColors[j.status] || '#f1f5f9|#475569').split('|');
    var bar = j.status === 'Completed' ? '#22c55e' : j.status === 'Scheduled' ? '#3b82f6' : '#f97316';

    var content =
      infoBox([
        '<span style="font-size:11px;color:#94a3b8;font-weight:600;">' + j.id + '</span><span style="display:inline-block;margin-left:8px;font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;background:' + sc[0] + ';color:' + sc[1] + ';">' + j.status + '</span>',
        '📍 ' + j.addr,
        '💰 ' + j.val + '&emsp;📅 ' + j.due,
        '👷 ' + j.crew
      ]) +
      '<div style="margin-bottom:18px;">' +
        '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">' +
          '<span style="color:#64748b;font-weight:500;">Progress</span>' +
          '<span style="font-weight:800;color:#0f172a;">' + j.pct + '%</span>' +
        '</div>' +
        '<div style="height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;">' +
          '<div style="height:8px;border-radius:4px;background:' + bar + ';width:' + j.pct + '%;"></div>' +
        '</div>' +
      '</div>';

    createSheet(j.name, content, [
      { icon:'📞', label:'Call Client',        fn:'IQ.closeSheet();IQ.toast("Calling ' + j.client + '…","info")', bg:'#f0fdf4', color:'#15803d' },
      { icon:'📸', label:'Add Site Photos',    fn:'IQ.closeSheet();IQ.toast("Camera ready!","info")',             bg:'#eff6ff', color:'#1d4ed8' },
      { icon:'📊', label:'Update Progress',    fn:'IQ.closeSheet();IQ.updateProgress(' + i + ')',                bg:'#fff7ed', color:'#c2410c' },
      { icon:'📝', label:'Add Note',           fn:'IQ.closeSheet();IQ.addNote("' + j.name + '")',                 bg:'#f5f3ff', color:'#7c3aed' },
      { icon:'✅', label:'Mark Complete',      fn:'IQ.closeSheet();IQ.toast("Job marked complete!","success")',  bg:'#f0fdf4', color:'#15803d' },
    ]);
  }

  function updateProgress(i) {
    var j = JOBS[i];
    var opts = [10,20,25,30,40,50,60,65,70,75,80,85,90,95,100].map(function(p){
      return '<option value="' + p + '"' + (p === j.pct ? ' selected' : '') + '>' + p + '%</option>';
    }).join('');
    createSheet('Update Progress',
      '<p style="color:#64748b;font-size:14px;margin-bottom:14px;">Updating <strong>' + j.name + '</strong></p>' +
      '<div style="margin-bottom:14px;">' +
        '<label style="display:block;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;">Completion</label>' +
        '<select id="up-pct" style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:14px;font-family:Inter,sans-serif;color:#1e293b;outline:none;background:#fff;">' + opts + '</select>' +
      '</div>' +
      btn('✓  Save Progress', 'IQ.closeSheet();IQ.toast("Progress updated!","success")')
    );
  }

  function addNote(jobName) {
    createSheet('Add Note',
      '<p style="color:#64748b;font-size:14px;margin-bottom:14px;">Note for <strong>' + jobName + '</strong></p>' +
      textarea('Note', 'Type your note here…', 'note-txt') +
      btn('💾  Save Note', 'IQ.closeSheet();IQ.toast("Note saved!","success")')
    );
  }

  // ─────────────────────────────────────────
  //  LEAD CARDS
  // ─────────────────────────────────────────
  var LEADS = [
    { name:'David Chen',     phone:'(512) 555-0142', service:'Kitchen Remodel',    val:'$35K' },
    { name:'Sarah Rodriguez',phone:'(512) 555-0198', service:'Master Bath Reno',   val:'$28K' },
    { name:'Mike Johnson',   phone:'(512) 555-0176', service:'Full Home Addition',  val:'$120K'},
    { name:'Lisa Park',      phone:'(512) 555-0133', service:'Garage Conversion',   val:'$42K' },
    { name:'Bob Williams',   phone:'(512) 555-0117', service:'Outdoor Kitchen',     val:'$18K' },
    { name:'Amanda Torres',  phone:'(512) 555-0155', service:'Basement Finishing',  val:'$55K' },
  ];

  function openLead(i) {
    var l = LEADS[i];
    var first = l.name.split(' ')[0];
    createSheet(l.name,
      infoBox([
        '📋 ' + l.service,
        '💰 Estimated ' + l.val,
        '📞 ' + l.phone
      ]),
      [
        { icon:'📞', label:'Call ' + first,         fn:'IQ.closeSheet();IQ.toast("Calling ' + l.name + '…","info")',          bg:'#f0fdf4', color:'#15803d' },
        { icon:'💬', label:'Send Text',             fn:'IQ.closeSheet();IQ.toast("Opening messages…","info")',               bg:'#eff6ff', color:'#1d4ed8' },
        { icon:'📅', label:'Schedule Site Visit',   fn:'IQ.closeSheet();IQ.scheduleVisit("' + l.name + '")',                  bg:'#fff7ed', color:'#c2410c' },
        { icon:'✉️', label:'Send Estimate',         fn:'IQ.closeSheet();IQ.toast("Opening estimate builder…","info")',       bg:'#fdf4ff', color:'#9333ea' },
        { icon:'✅', label:'Convert to Job',        fn:'IQ.closeSheet();IQ.toast("' + l.name + ' converted to job!","success")', bg:'#f0fdf4', color:'#15803d' },
      ]
    );
  }

  function scheduleVisit(clientName) {
    createSheet('Schedule Site Visit',
      '<p style="color:#64748b;font-size:14px;margin-bottom:14px;">Visit with <strong>' + clientName + '</strong></p>' +
      field('Date', 'date', '', 'sv-date') +
      field('Time', 'time', '', 'sv-time') +
      field('Address', 'text', 'Site address', 'sv-addr') +
      btn('📅  Schedule Visit', 'IQ.closeSheet();IQ.toast("Visit scheduled with ' + clientName + '!","success")')
    );
  }

  // ─────────────────────────────────────────
  //  ESTIMATE CARDS
  // ─────────────────────────────────────────
  var ESTIMATES = [
    { id:'EST-2041', name:'Full Kitchen + Dining',    client:'Mike Johnson',    amt:'$48,900', status:'Awaiting', sent:'Apr 8'  },
    { id:'EST-2042', name:'Master Bath Renovation',   client:'Sarah Rodriguez', amt:'$34,500', status:'Awaiting', sent:'Apr 9'  },
    { id:'EST-2040', name:'Garage Conversion',         client:'Lisa Park',       amt:'$42,100', status:'Accepted', sent:'Apr 5'  },
    { id:'EST-2039', name:'Outdoor Kitchen & Patio',  client:'Bob Williams',    amt:'$18,400', status:'Draft',    sent:'Not sent'},
    { id:'EST-2038', name:'Basement Finishing',        client:'Amanda Torres',   amt:'$54,600', status:'Awaiting', sent:'Apr 3'  },
  ];

  function openEstimate(i) {
    var e = ESTIMATES[i];
    var actions;
    if (e.status === 'Draft') {
      actions = [
        { icon:'📤', label:'Send to ' + e.client, fn:'IQ.closeSheet();IQ.toast("Estimate sent to ' + e.client + '!","success")', bg:'#f0fdf4', color:'#15803d' },
        { icon:'✏️', label:'Edit Estimate',        fn:'IQ.closeSheet();IQ.toast("Opening editor…","info")',                     bg:'#eff6ff', color:'#1d4ed8' },
      ];
    } else if (e.status === 'Accepted') {
      actions = [
        { icon:'🏠', label:'Convert to Job',     fn:'IQ.closeSheet();IQ.toast("Job created from estimate!","success")', bg:'#f0fdf4', color:'#15803d' },
        { icon:'📄', label:'View / Print PDF',   fn:'IQ.closeSheet();IQ.toast("Opening PDF…","info")',                  bg:'#eff6ff', color:'#1d4ed8' },
      ];
    } else {
      actions = [
        { icon:'🔔', label:'Send Reminder',      fn:'IQ.closeSheet();IQ.toast("Reminder sent to ' + e.client + '!","success")', bg:'#fff7ed', color:'#c2410c'  },
        { icon:'✅', label:'Mark Accepted',      fn:'IQ.closeSheet();IQ.toast("Marked as accepted!","success")',                bg:'#f0fdf4', color:'#15803d'  },
        { icon:'❌', label:'Mark Declined',      fn:'IQ.closeSheet();IQ.toast("Marked as declined","error")',                   bg:'#fff1f2', color:'#e11d48'  },
        { icon:'📄', label:'View / Print PDF',   fn:'IQ.closeSheet();IQ.toast("Opening PDF…","info")',                          bg:'#eff6ff', color:'#1d4ed8'  },
      ];
    }
    createSheet(e.name,
      infoBox([
        '<span style="font-size:11px;color:#94a3b8;font-weight:600;">' + e.id + '</span>',
        '👤 ' + e.client,
        '<span style="font-size:22px;font-weight:900;color:#0f172a;">' + e.amt + '</span>',
        'Sent: ' + e.sent
      ]),
      actions
    );
  }

  // ─────────────────────────────────────────
  //  JOB FILTER CHIPS
  // ─────────────────────────────────────────
  function filterJobs(status, btnEl) {
    document.querySelectorAll('.job-chip').forEach(function (c) {
      c.style.background = '#fff';
      c.style.color = '#475569';
    });
    btnEl.style.background = '#0f172a';
    btnEl.style.color = '#fff';

    document.querySelectorAll('.job-card').forEach(function (card) {
      var ds = card.getAttribute('data-status');
      card.style.display = (status === 'all' || ds === status) ? 'block' : 'none';
    });
  }

  // ─────────────────────────────────────────
  //  NOTIFICATIONS
  // ─────────────────────────────────────────
  function openNotifications() {
    var items = [
      { icon:'🔔', title:'EST-2038 expiring in 7 days',     sub:'Amanda Torres · Basement Finishing',     time:'2h ago'   },
      { icon:'✅', title:'Job #1047 marked complete',       sub:'Anderson Home Office Build-Out',          time:'3h ago'   },
      { icon:'👤', title:'New lead: David Chen',            sub:'Kitchen Remodel · ~$35K',                 time:'4h ago'   },
      { icon:'📅', title:'Site visit tomorrow @ 9am',      sub:'Williams Deck · 519 Maple Ave',           time:'Yesterday'},
      { icon:'💰', title:'Invoice paid · $9,700',           sub:'Anderson Residence',                      time:'Yesterday'},
    ].map(function (n) {
      return (
        '<div style="display:flex;align-items:flex-start;gap:12px;padding:12px;border-radius:12px;background:#f8fafc;margin-bottom:8px;">' +
          '<div style="width:36px;height:36px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;box-shadow:0 1px 3px rgba(0,0,0,.08);">' + n.icon + '</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<p style="font-size:13px;font-weight:700;color:#0f172a;margin:0 0 2px;">' + n.title + '</p>' +
            '<p style="font-size:12px;color:#64748b;margin:0 0 2px;">' + n.sub + '</p>' +
            '<p style="font-size:11px;color:#94a3b8;margin:0;">' + n.time + '</p>' +
          '</div>' +
        '</div>'
      );
    }).join('');
    createSheet('Notifications', items);
  }

  // ─────────────────────────────────────────
  //  SCHEDULE DAY SWITCHER
  // ─────────────────────────────────────────
  function switchDay(dayName, el) {
    document.querySelectorAll('.day-circle').forEach(function (d) {
      d.style.background = '#f1f5f9';
      d.style.color = d.getAttribute('data-weekend') === '1' ? '#94a3b8' : '#334155';
    });
    el.style.background = '#f97316';
    el.style.color = '#fff';
    toast('Showing ' + dayName + '\'s schedule', 'info');
  }

  // ─────────────────────────────────────────
  //  ACTIVITY ROW TAP
  // ─────────────────────────────────────────
  function activityTap(tab) {
    if (typeof switchTab === 'function') switchTab(tab);
  }

  // ─────────────────────────────────────────
  //  EXPOSE
  // ─────────────────────────────────────────
  window.IQ = {
    closeSheet: closeSheet,
    toast: toast,
    newJob: newJob, saveNewJob: saveNewJob,
    addLead: addLead, saveLead: saveLead,
    newEstimate: newEstimate, saveEstimate: saveEstimate,
    newCallLog: newCallLog, saveCall: saveCall,
    openJob: openJob, updateProgress: updateProgress, addNote: addNote,
    openLead: openLead, scheduleVisit: scheduleVisit,
    openEstimate: openEstimate,
    filterJobs: filterJobs,
    openNotifications: openNotifications,
    switchDay: switchDay,
    activityTap: activityTap,
  };

})();
