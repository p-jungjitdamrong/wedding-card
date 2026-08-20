/* =========================================================================
   Fah & Non — Wedding E-Card :: BEHAVIOUR
   -------------------------------------------------------------------------
   ทุกข้อความอยู่ใน assets/js/content.js  ไฟล์นี้เป็นแค่ตัวขับเคลื่อน
   ปกติไม่ต้องแก้ไฟล์นี้เลย
   ========================================================================= */
(function () {
  'use strict';

  var W = window.WEDDING;
  if (!W) {
    document.documentElement.innerHTML =
      '<body style="font-family:sans-serif;padding:2rem;line-height:1.7">' +
      '<h1>โหลด content.js ไม่สำเร็จ</h1>' +
      '<p>ตรวจสอบว่ามีไฟล์ <code>assets/js/content.js</code> และถูกเรียกใน index.html ก่อน main.js</p></body>';
    return;
  }

  /* Browsers restore the previous scroll offset on reload. The door screen is
     position:fixed, so a restored offset stays invisible until the doors open —
     and the invitation then appears half-way down. Own the scroll instead. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  function jumpToTop() {
    var root = document.documentElement;
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';   // never animate this one
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
  }

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var hasGSAP = function () { return typeof window.gsap !== 'undefined'; };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* look up 'a.b.c' inside the content config */
  function get(path) {
    return path.split('.').reduce(function (o, k) {
      return (o === null || o === undefined) ? undefined : o[k];
    }, W);
  }

  /* ======================================================
     0 · RENDER CONTENT FROM content.js
     ====================================================== */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function renderBindings() {
    document.title = W.meta.title;
    var m = $('meta[name="description"]');       if (m) m.content = W.meta.description;
    var ot = $('meta[property="og:title"]');      if (ot) ot.content = W.meta.ogTitle;
    var od = $('meta[property="og:description"]');if (od) od.content = W.meta.ogDescription;

    $$('[data-t]').forEach(function (n) {
      var v = get(n.dataset.t);
      if (v !== undefined) n.textContent = v;
    });
    $$('[data-html]').forEach(function (n) {
      var v = get(n.dataset.html);
      if (v !== undefined) n.innerHTML = v;
    });
    // data-attr="href:venue.mapsUrl; aria-label:hero.scrollAria"
    $$('[data-attr]').forEach(function (n) {
      n.dataset.attr.split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i < 0) return;
        var name = pair.slice(0, i).trim();
        var v = get(pair.slice(i + 1).trim());
        if (v !== undefined) n.setAttribute(name, v);
      });
    });
  }

  function renderTimeline() {
    var host = $('#timeline');
    if (!host) return;
    host.innerHTML = '';
    W.schedule.items.forEach(function (item) {
      var li = el('li', 'tl-item reveal' + (item.highlight ? ' tl-item--highlight' : ''));
      li.appendChild(el('span', 'tl-dot')).setAttribute('aria-hidden', 'true');

      var time = el('time', 'tl-time', item.time + ' ');
      if (item.unit) time.appendChild(el('em', null, item.unit));
      li.appendChild(time);

      var body = el('div', 'tl-body');
      body.appendChild(el('h3', 'tl-head', item.title));
      if (item.note) body.appendChild(el('p', 'tl-note', item.note));
      li.appendChild(body);

      host.appendChild(li);
    });
  }

  function renderInfo() {
    var sw = $('#swatches');
    if (sw) {
      sw.innerHTML = '';
      W.info.dress.swatches.forEach(function (c) {
        var s = el('span', 'sw');
        s.style.setProperty('--sw', c);
        sw.appendChild(s);
      });
    }
    var pk = $('#parkingList');
    if (pk) {
      pk.innerHTML = '';
      W.info.parking.itemsHtml.forEach(function (html) {
        var li = document.createElement('li');
        li.innerHTML = html;
        pk.appendChild(li);
      });
    }
  }

  /* one radio / checkbox card */
  function choice(type, name, opt) {
    var label = el('label', 'choice');
    var input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.value = opt.value;
    var box = el('span', 'choice-box');
    box.appendChild(el('span', 'choice-title', opt.title));
    if (opt.note) box.appendChild(el('span', 'choice-note', opt.note));
    label.appendChild(input);
    label.appendChild(box);
    return label;
  }

  function renderRsvp() {
    var section = $('#rsvp');
    if (!section) return;

    if (W.rsvp.enabled === false) {           // ★ ปิดทั้ง section
      section.remove();
      return;
    }

    var ac = $('#attendanceChoices');
    ac.innerHTML = '';
    W.rsvp.attendance.forEach(function (opt, i) {
      var c = choice('radio', 'attendance', opt);
      if (i === 0) c.querySelector('input').required = true;
      ac.appendChild(c);
    });

    var sc = $('#slotChoices');
    sc.innerHTML = '';
    W.rsvp.slots.forEach(function (opt) { sc.appendChild(choice('checkbox', 'slot', opt)); });

    var f = W.rsvp.fields || {};
    if (f.guestCount === false) $('#fieldGuestCount').remove();
    if (f.slots      === false) $('#fieldSlots').remove();
    if (f.wishes     === false) $('#fieldWishes').remove();

    var max = W.rsvp.labels.guestsMax || 10;
    var gc = $('#guestCount');
    if (gc) gc.max = max;
  }

  document.documentElement.classList.add('is-locked');
  jumpToTop();

  renderBindings();
  renderTimeline();
  renderInfo();
  renderRsvp();

  /* ======================================================
     0b · PAGE DECORATION
     ====================================================== */

  /* scatter twinkling sparks into any container */
  function scatterSparkles(host, count, minSize, maxSize) {
    if (reduceMotion || !host) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var sp = document.createElement('span');
      sp.className = 'sparkle';
      sp.style.setProperty('--s', (minSize + Math.random() * (maxSize - minSize)).toFixed(1) + 'px');
      sp.style.setProperty('--dur', (3.4 + Math.random() * 4.2).toFixed(1) + 's');
      sp.style.setProperty('--delay', (Math.random() * 9).toFixed(1) + 's');
      sp.style.left = (2 + Math.random() * 94).toFixed(1) + '%';
      sp.style.top  = (2 + Math.random() * 94).toFixed(1) + '%';
      frag.appendChild(sp);
    }
    host.appendChild(frag);
  }

  scatterSparkles($('#sparkles'), 14, 9, 22);                                   // on the card
  scatterSparkles($('#pageSparkles'), window.innerWidth < 640 ? 16 : 26, 6, 15); // everywhere else

  /* gold bracket in each corner of a box */
  function addCorners(box) {
    ['tl', 'tr', 'bl', 'br'].forEach(function (pos) {
      box.appendChild(el('span', 'corner corner-' + pos));
    });
  }

  /* a flourish: hairline — kanok — diamond — kanok — hairline */
  function ornamentSvg(cls) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'orn-svg' + (cls ? ' ' + cls : ''));
    svg.setAttribute('viewBox', '0 0 170 32');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML =
      '<path class="orn-line" d="M2 16 H50"/>' +
      '<circle class="orn-dot" cx="56" cy="16" r="1.7"/>' +
      '<use href="#kanok" transform="translate(64,24) scale(-.5,.5)"/>' +
      '<use href="#m-rosette" stroke-width="4.6" transform="translate(85,16) scale(.30)"/>' +
      '<use href="#kanok" transform="translate(106,24) scale(.5)"/>' +
      '<circle class="orn-dot" cx="114" cy="16" r="1.7"/>' +
      '<path class="orn-line" d="M120 16 H168"/>';
    return svg;
  }

  /* small rosette riding a section boundary */
  function sepMark(extra) {
    var span = el('span', 'sep-mark' + extra);
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<use href="#m-rosette" stroke-width="3.4" transform="translate(50,50) scale(.9)"/>';
    span.appendChild(svg);
    return span;
  }

  function decorate() {
    // flourish below every section heading — after its subtitle/date line, not between them
    $$('.section-title').forEach(function (title) {
      var last = title;
      while (last.nextElementSibling &&
             /section-(sub|date)/.test(last.nextElementSibling.className)) {
        last = last.nextElementSibling;
      }
      var wrap = el('div', 'title-orn reveal');
      wrap.appendChild(ornamentSvg());
      last.parentNode.insertBefore(wrap, last.nextSibling);
    });

    // brackets on cards and countdown cells
    $$('.card').forEach(addCorners);
    $$('.cd-cell').forEach(addCorners);

    // frame the venue artwork
    var art = $('.lohaprasat');
    if (art && art.parentNode) {
      var frame = el('div', 'art-frame reveal');
      art.parentNode.insertBefore(frame, art);
      frame.appendChild(art);
      art.classList.remove('reveal');
      addCorners(frame);
    }

    // diamond markers riding the tinted-section boundaries
    $$('.section--tint').forEach(function (sec) {
      sec.insertBefore(sepMark(''), sec.firstChild);
      sec.appendChild(sepMark(' sep-mark--bottom'));
    });

    // flourish above the footer monogram
    var fm = $('.footer-mono');
    if (fm && fm.parentNode) {
      var f = el('div', 'footer-orn reveal');
      f.appendChild(ornamentSvg());
      fm.parentNode.insertBefore(f, fm);
    }
  }

  decorate();

  /* ======================================================
     1 · DOOR OPENING
     ====================================================== */
  var stage     = $('#doorStage');
  var scene     = $('#doorScene');
  var doorLeft  = $('#doorLeft');
  var doorRight = $('#doorRight');
  var seal      = $('#doorMedallion');
  var lightbeam = $('#doorLight');
  var godrays   = $('#godrays');
  var bloom     = $('#revealBloom');
  var archCard  = $('#archCard');
  var invite    = $('#invite');
  var opened    = false;

  /* floating gold dust on the landing screen */
  (function makeDust() {
    if (reduceMotion) return;
    var host = $('#dust');
    var n = window.innerWidth < 640 ? 14 : 22;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var d = document.createElement('span');
      var size = 2 + Math.random() * 4;
      d.style.width = d.style.height = size.toFixed(1) + 'px';
      d.style.left = (Math.random() * 100).toFixed(2) + '%';
      d.style.animationDuration = (11 + Math.random() * 12).toFixed(1) + 's';
      d.style.animationDelay = (-Math.random() * 18).toFixed(1) + 's';
      d.style.setProperty('--dx', (Math.random() * 80 - 40).toFixed(0) + 'px');
      frag.appendChild(d);
    }
    host.appendChild(frag);
  })();

  function showInvite() {
    invite.classList.add('is-visible');
    invite.setAttribute('aria-hidden', 'false');

    // start at the top, then unlock — and re-assert once the browser has
    // laid the unlocked page out, in case a restore was still queued.
    jumpToTop();
    document.documentElement.classList.remove('is-locked');
    document.body.classList.remove('is-locked');
    document.body.classList.add('is-revealed');
    requestAnimationFrame(jumpToTop);
    window.setTimeout(jumpToTop, 260);
    animateHero();
    initReveal();
  }

  function animateHero() {
    var items = $$('[data-hero]').sort(function (a, b) {
      return (+a.dataset.hero) - (+b.dataset.hero);
    });
    if (reduceMotion) {
      items.forEach(function (e) { e.style.opacity = 1; e.style.transform = 'none'; });
      return;
    }
    if (hasGSAP()) {
      gsap.timeline()
        .fromTo(archCard,
          { opacity: 0, y: 46, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 1.25, ease: 'power3.out' }, 0)
        .fromTo(items,
          { opacity: 0, y: 18 },
          // no clearProps here: [data-hero] carries transform:translateY(18px) in
          // CSS, so stripping the inline transform drops the text back down.
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 }, 0.35);
    } else {
      archCard.style.transition = 'opacity 1.1s ease, transform 1.1s cubic-bezier(.22,.9,.24,1)';
      archCard.style.opacity = 1;
      archCard.style.transform = 'none';
      items.forEach(function (e, i) {
        var d = 0.3 + i * 0.12;
        e.style.transition = 'opacity .9s ease ' + d + 's, transform .9s cubic-bezier(.22,.9,.24,1) ' + d + 's';
        requestAnimationFrame(function () { e.style.opacity = 1; e.style.transform = 'none'; });
      });
    }
  }

  function openDoors() {
    if (opened) return;
    opened = true;
    stage.setAttribute('aria-hidden', 'true');
    seal.setAttribute('disabled', 'disabled');
    seal.style.animation = 'none';   // hand the transform over to the timeline

    if (audioArmed) startMusic();    // a tap is the gesture browsers require

    if (reduceMotion || !hasGSAP()) {
      stage.classList.add('is-opening');
      window.setTimeout(function () { stage.classList.add('is-gone'); }, reduceMotion ? 0 : 900);
      window.setTimeout(showInvite, reduceMotion ? 60 : 1250);
      window.setTimeout(function () { stage.style.display = 'none'; }, reduceMotion ? 400 : 2900);
      return;
    }

    gsap.timeline()
      .to(seal, { scale: 1.14, duration: 0.42, ease: 'power2.out' }, 0)
      .to(seal, { scale: 1.5, opacity: 0, duration: 0.75, ease: 'power2.in' }, 0.42)
      .fromTo(lightbeam,
        { width: 0, opacity: 0 },
        { width: '30vw', opacity: 1, duration: 1.6, ease: 'power2.out' }, 0.3)
      .to(doorLeft,  { rotateY:  92, duration: 2.3, ease: 'power3.inOut' }, 0.6)
      .to(doorRight, { rotateY: -92, duration: 2.3, ease: 'power3.inOut' }, 0.6)
      .to($$('.door-shade'), { opacity: 0.72, duration: 1.9, ease: 'power2.in' }, 0.7)
      .to(scene,     { scale: 1.28,   duration: 2.6, ease: 'power2.inOut' }, 0.6)
      .to(godrays,   { opacity: 1,    duration: 1.1, ease: 'power1.out' }, 0.9)
      .to(bloom,     { opacity: 1,    duration: 1.0, ease: 'power2.out' }, 1.35)
      .add(showInvite, 1.95)
      .to(stage,     { opacity: 0,    duration: 1.0, ease: 'power2.inOut' }, 1.95)
      .to(bloom,     { opacity: 0,    duration: 1.3, ease: 'power2.inOut' }, 2.15)
      .set(stage,    { display: 'none' });
  }

  seal.addEventListener('click', openDoors);
  stage.addEventListener('click', openDoors);   // แตะที่ไหนก็เปิดได้

  if (hasGSAP() && !reduceMotion) {
    gsap.set(doorLeft,  { transformOrigin: 'left center',  transformPerspective: 1500 });
    gsap.set(doorRight, { transformOrigin: 'right center', transformPerspective: 1500 });
    gsap.set(scene,     { transformOrigin: '50% 46%' });
  }

  /* ======================================================
     2 · BACKGROUND MUSIC
     ====================================================== */
  var bgm        = $('#bgm');
  var musicBtn   = $('#musicToggle');
  var audioArmed = false;
  var fadeTimer  = null;
  var stopTimer  = null;
  var musicVol   = (W.music && typeof W.music.volume === 'number') ? W.music.volume : 0.35;

  var FADE_MS    = 700;
  var FADE_STEPS = 14;

  /* iOS refuses programmatic writes to HTMLMediaElement.volume — it always
     reads back as 1. Routing the element through a Web Audio gain node is the
     only way to control loudness there, so prefer it and keep the plain
     element volume as the fallback. */
  var audioCtx = null;
  var gainNode = null;

  function buildAudioGraph() {
    if (gainNode) return;
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      audioCtx = new Ctx();
      var src = audioCtx.createMediaElementSource(bgm);
      gainNode = audioCtx.createGain();
      gainNode.gain.value = 0;
      src.connect(gainNode);
      gainNode.connect(audioCtx.destination);
    } catch (e) {
      audioCtx = null;
      gainNode = null;   // fall back to bgm.volume
    }
  }

  function currentVolume() {
    return gainNode ? gainNode.gain.value : bgm.volume;
  }

  function setVolume(v) {
    v = Math.min(1, Math.max(0, v));
    if (gainNode) gainNode.gain.value = v;
    else bgm.volume = v;
  }

  /* Runs a fixed number of steps rather than waiting for the volume to reach
     the target — on a platform that ignores volume writes, waiting never ends
     and the track would keep playing after the guest pressed stop. */
  function fadeTo(target, done) {
    window.clearInterval(fadeTimer);
    var from = currentVolume();
    var i = 0;
    fadeTimer = window.setInterval(function () {
      i += 1;
      setVolume(from + (target - from) * (i / FADE_STEPS));
      if (i >= FADE_STEPS) {
        window.clearInterval(fadeTimer);
        setVolume(target);
        if (done) done();
      }
    }, FADE_MS / FADE_STEPS);
  }

  musicBtn.setAttribute('aria-label', W.music.label);
  $('#bgmSource').src = W.music.src;

  bgm.addEventListener('loadedmetadata', function () {
    audioArmed = true;
    musicBtn.hidden = false;
  });
  bgm.addEventListener('error', function () {
    musicBtn.hidden = true;    // ไม่มีไฟล์เพลง = ซ่อนปุ่มไปเลย
    audioArmed = false;
  }, true);
  bgm.preload = 'metadata';
  try { bgm.load(); } catch (e) { /* no source */ }

  function startMusic() {
    window.clearTimeout(stopTimer);
    buildAudioGraph();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    setVolume(0);
    var p = bgm.play();
    if (p && p.catch) {
      p.then(function () {
        musicBtn.setAttribute('aria-pressed', 'true');
        fadeTo(musicVol);
      }).catch(function () {
        musicBtn.setAttribute('aria-pressed', 'false');
      });
    }
  }

  function stopMusic() {
    musicBtn.setAttribute('aria-pressed', 'false');
    fadeTo(0, function () { bgm.pause(); });

    /* The fade runs on repeated ticks, and a browser throttles timers hard
       once the tab is in the background. Pin the actual stop to a single
       timer so pressing stop always silences the track on schedule. */
    window.clearTimeout(stopTimer);
    stopTimer = window.setTimeout(function () {
      window.clearInterval(fadeTimer);
      setVolume(0);
      bgm.pause();
    }, FADE_MS + 80);
  }

  musicBtn.addEventListener('click', function () {
    if (musicBtn.getAttribute('aria-pressed') === 'true') stopMusic();
    else startMusic();
  });

  /* ======================================================
     3 · COUNTDOWN
     ====================================================== */
  var target = new Date(W.event.startISO).getTime();
  var cd = { d: $('#cdDays'), h: $('#cdHours'), m: $('#cdMins'), s: $('#cdSecs') };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var cdTimer;

  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      Object.keys(cd).forEach(function (k) { cd[k].textContent = '00'; });
      $('#countdown').hidden = true;
      $('#countdownDone').hidden = false;
      window.clearInterval(cdTimer);
      return;
    }
    var s = Math.floor(diff / 1000);
    cd.d.textContent = pad(Math.floor(s / 86400));
    cd.h.textContent = pad(Math.floor(s % 86400 / 3600));
    cd.m.textContent = pad(Math.floor(s % 3600 / 60));
    cd.s.textContent = pad(s % 60);
  }
  tick();
  cdTimer = window.setInterval(tick, 1000);

  /* ======================================================
     4 · SCROLL REVEAL
     ====================================================== */
  var revealInited = false;
  function initReveal() {
    if (revealInited) return;
    revealInited = true;
    var targets = $$('.reveal');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (e) { e.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = (Math.min(i, 5) * 0.08) + 's';
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    targets.forEach(function (e) { io.observe(e); });
  }

  /* ======================================================
     5 · ADD TO CALENDAR
     ====================================================== */
  function toUTCStamp(iso) {
    return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }
  var startUTC = toUTCStamp(W.event.startISO);
  var endUTC   = toUTCStamp(W.event.endISO);

  $('#gcalBtn').addEventListener('click', function () {
    var url = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text='     + encodeURIComponent(W.event.calendarTitle)
      + '&dates='    + startUTC + '/' + endUTC
      + '&details='  + encodeURIComponent(W.event.calendarDetails)
      + '&location=' + encodeURIComponent(W.event.calendarLocation)
      + '&ctz=Asia/Bangkok';
    window.open(url, '_blank', 'noopener');
  });

  $('#icsBtn').addEventListener('click', function () {
    var esc = function (t) { return String(t).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n'); };
    var ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Fah and Non//Wedding E-Card//TH',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:fah-non-wedding-' + startUTC + '@ecard',
      'DTSTAMP:' + toUTCStamp(new Date().toISOString()),
      'DTSTART:' + startUTC,
      'DTEND:'   + endUTC,
      'SUMMARY:'     + esc(W.event.calendarTitle),
      'DESCRIPTION:' + esc(W.event.calendarDetails),
      'LOCATION:'    + esc(W.event.calendarLocation),
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:' + esc(W.event.calendarAlarm),
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href = url;
    a.download = W.countdown.icsFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  });

  /* ======================================================
     6 · RSVP
     ====================================================== */
  var form = $('#rsvpForm');
  if (form) initRsvp();

  function initRsvp() {
    var R        = W.rsvp;
    var fields   = R.fields || {};
    var thanks   = $('#rsvpThanks');
    var attOnly  = $('#attendingOnly');
    var countEl  = $('#guestCount');
    var wishesEl = $('#wishes');
    var lastRsvp = null;

    function showErr(key, on) {
      var e = document.querySelector('[data-err="' + key + '"]');
      if (e) e.hidden = !on;
    }

    $$('input[name="attendance"]').forEach(function (r) {
      r.addEventListener('change', function () {
        attOnly.hidden = (r.value !== 'attending') || !attOnly.children.length;
        showErr('attendance', false);
      });
    });

    if (countEl) {
      var bump = function (delta) {
        var v = parseInt(countEl.value, 10);
        if (isNaN(v)) v = 1;
        countEl.value = Math.min(parseInt(countEl.max, 10) || 10, Math.max(1, v + delta));
      };
      $('#stepMinus').addEventListener('click', function () { bump(-1); });
      $('#stepPlus').addEventListener('click',  function () { bump(1);  });
    }

    var slotLabel = {};
    R.slots.forEach(function (o) { slotLabel[o.value] = o.title; });

    function collect() {
      var status = document.querySelector('input[name="attendance"]:checked');
      var attending = status && status.value === 'attending';
      return {
        guestName:  $('#guestName').value.trim(),
        attendance: status ? status.value : '',
        guestCount: (attending && countEl) ? (parseInt(countEl.value, 10) || 1) : (attending ? 1 : 0),
        slots:      attending ? $$('input[name="slot"]:checked').map(function (c) { return c.value; }) : [],
        wishes:     wishesEl ? wishesEl.value.trim() : '',
        submittedAt: new Date().toISOString()
      };
    }

    function summaryText(d) {
      var S = R.summary;
      var lines = [
        S.header,
        S.name + ': ' + d.guestName,
        S.status + ': ' + (d.attendance === 'attending' ? S.attending : S.declined)
      ];
      if (d.attendance === 'attending') {
        if (fields.guestCount !== false) lines.push(S.guests + ': ' + d.guestCount + ' ' + S.guestsUnit);
        if (fields.slots !== false && d.slots.length) {
          lines.push(S.slots + ': ' + d.slots.map(function (v) { return slotLabel[v]; }).join(' , '));
        }
      }
      if (d.wishes) lines.push(S.wishes + ': ' + d.wishes);
      return lines.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = collect();
      var ok = true;

      if (!data.guestName) {
        showErr('guestName', true); $('#guestName').setAttribute('aria-invalid', 'true'); ok = false;
      } else {
        showErr('guestName', false); $('#guestName').removeAttribute('aria-invalid');
      }
      if (!data.attendance) { showErr('attendance', true); ok = false; }

      var needSlot = fields.slots !== false && data.attendance === 'attending';
      if (needSlot && data.slots.length === 0) { showErr('slot', true); ok = false; }
      else { showErr('slot', false); }

      if (!ok) {
        var firstErr = document.querySelector('.err:not([hidden])');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      lastRsvp = data;
      try { window.localStorage.setItem('fn-rsvp', JSON.stringify(data)); } catch (err) { /* private mode */ }

      var btn = $('#rsvpSubmit');
      btn.setAttribute('disabled', 'disabled');
      btn.textContent = R.labels.submitting;

      var finish = function () {
        btn.removeAttribute('disabled');
        btn.textContent = R.labels.submit;
        form.hidden = true;
        thanks.hidden = false;

        var attending = data.attendance === 'attending';
        $('#thanksTitle').textContent = attending ? R.thanks.titleAttending : R.thanks.titleDeclined;
        $('#thanksText').textContent =
          (attending ? R.thanks.textAttending : R.thanks.textDeclined).replace(/\{name\}/g, data.guestName);
        thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };

      if (R.endpoint) {
        fetch(R.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(finish).catch(finish);
      } else {
        window.setTimeout(finish, 550);
      }
    });

    $('#editRsvp').addEventListener('click', function () {
      thanks.hidden = true;
      form.hidden = false;
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    $('#copyRsvp').addEventListener('click', function () {
      if (!lastRsvp) return;
      var text = summaryText(lastRsvp);
      var hint = $('#copyHint');
      var done = function () { hint.textContent = R.thanks.copied; };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
      function fallbackCopy() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); }
        catch (err) { hint.textContent = R.thanks.copyFailed; }
        document.body.removeChild(ta);
      }
    });
  }

  /* ======================================================
     7 · MISC
     ====================================================== */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { window.clearInterval(cdTimer); }
    else { tick(); cdTimer = window.setInterval(tick, 1000); }
  });
})();
