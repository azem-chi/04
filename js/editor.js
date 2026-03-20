/* ══════ PHASE 3: KEYBOARD SHORTCUTS ══════ */
const SHORTCUTS = [
  {key:'1-7', desc:'تغيير الثيم'}, {key:'8', desc:'تغيير الوضع'},
  {key:'M', desc:'تغيير الوضع'}, {key:'L', desc:'تغيير اللغة'},
  {key:'S', desc:'الصوت'}, {key:'← →', desc:'التنقل بين الأيام'},
  {key:'T', desc:'اليوم الحالي'}, {key:'Space', desc:'تشغيل/إيقاف'},
  {key:'N', desc:'التمرين التالي'}, {key:'P', desc:'التمرين السابق'},
  {key:'Enter', desc:'إنهاء المجموعة'}, {key:'Esc', desc:'إغلاق الجلسة'},
  {key:'R', desc:'إعادة المؤقت'}, {key:'C', desc:'تحديد مكتمل'},
  {key:'D', desc:'إنهاء اليوم'}, {key:'A', desc:'المدرب الذكي'},
  {key:'F', desc:'ملء الشاشة'}, {key:'?', desc:'هذه القائمة'},
];

function showShortcutsHelp() {
  const existing = document.getElementById('shortcuts-modal');
  if (existing) { existing.remove(); return; }
  const modal = document.createElement('div');
  modal.id = 'shortcuts-modal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9800;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);';
  modal.innerHTML = `
    <div style="background:var(--night);border:1px solid var(--border);border-radius:20px;padding:24px;max-width:420px;width:90%;max-height:80vh;overflow-y:auto;">
      <div style="display:flex;align-items:center;margin-bottom:16px;">
        <span style="font-size:16px;font-weight:900;flex:1;">⌨️ اختصارات لوحة المفاتيح</span>
        <button onclick="document.getElementById('shortcuts-modal').remove()" style="font-size:20px;padding:4px 8px;border-radius:8px;background:var(--card);border:1px solid var(--border);">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        ${SHORTCUTS.map(s=>`
          <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:10px;background:var(--card);border:1px solid var(--border);">
            <kbd style="background:var(--card2);border:1px solid var(--border);border-radius:6px;padding:2px 8px;font-size:11px;font-weight:900;font-family:monospace;color:var(--gold);white-space:nowrap;">${s.key}</kbd>
            <span style="font-size:12px;color:var(--text2);">${s.desc}</span>
          </div>`).join('')}
      </div>
      <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">
        <div style="font-size:13px;font-weight:900;margin-bottom:8px;">📺 ريموت التلفزيون</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;color:var(--text2);">
          <div>🔴 ابدأ/إيقاف الجلسة</div>
          <div>🟢 تحديد مكتمل ✓</div>
          <div>🟡 المدرب الذكي AI</div>
          <div>🔵 هذه القائمة</div>
          <div>1-7 الثيمات</div>
          <div>8 تغيير الوضع</div>
          <div>OK تأكيد/تفاصيل</div>
          <div>Back رجوع</div>
        </div>
      </div>
    </div>`;
  modal.onclick = e => { if(e.target===modal) modal.remove(); };
  document.body.appendChild(modal);
}

document.addEventListener('keydown', (e) => {
  // Don't trigger shortcuts when typing in inputs
  if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
  
  const sessOpen = document.getElementById('session-overlay')?.classList.contains('open');
  const key = e.key;
  const code = e.code;

  // Theme shortcuts: 1-7
  if (!e.ctrlKey && !e.altKey && key >= '1' && key <= '7') {
    const themes = ['default','fire','ocean','nature','neon','purple','light'];
    setTheme(themes[parseInt(key)-1]);
    showMiniToast(THEME_ICONS[themes[parseInt(key)-1]] + ' ' + themes[parseInt(key)-1]);
    return;
  }

  // Mode: 8 فقط (M محجوز للمدرب)
  if (!e.ctrlKey && key === '8') {
    cycleMode(); return;
  }
  // M = فتح تبويب المدرب
  if (key.toLowerCase() === 'm' && !sessOpen) {
    switchTab('coach', document.getElementById('tab-btn-coach')); return;
  }

  // Language: L
  if (key.toLowerCase() === 'l' && !sessOpen) {
    cycleLang(); return;
  }

  // Sound: S
  if (key.toLowerCase() === 's' && !sessOpen) {
    openSoundSheet(); return;
  }

  // Help: ?
  if (key === '?' || key === '/') {
    showShortcutsHelp(); return;
  }

  // Fullscreen: F
  if (key.toLowerCase() === 'f') {
    toggleFullscreen(); return;
  }

  // AI coach: A
  if (key.toLowerCase() === 'a' && !sessOpen) {
    if (typeof openAICoach === 'function') openAICoach();
    return;
  }

  // Day navigation: Arrow keys (when not in session)
  if (!sessOpen) {
    // RTL: ArrowRight = previous day (يمين = السابق), ArrowLeft = next day (يسار = التالي)
    if (key === 'ArrowRight') {
      if (S.currentDay > 1) { S.currentDay--; saveState(); render(); }
      return;
    }
    if (key === 'ArrowLeft') {
      const maxDay = S.user?.programDays || 30;
      if (S.currentDay < maxDay) { S.currentDay++; saveState(); render(); }
      return;
    }
    // ArrowDown/Up: scroll through days sequentially
    if (key === 'ArrowDown') {
      const maxDay = S.user?.programDays || 30;
      if (S.currentDay < maxDay) { S.currentDay++; saveState(); render(); }
      return;
    }
    if (key === 'ArrowUp') {
      if (S.currentDay > 1) { S.currentDay--; saveState(); render(); }
      return;
    }
    // T = today (اليوم الحالي في البرنامج)
    if (key.toLowerCase() === 't') {
      const today = S.currentDay;
      selectDay(today);
      showMiniToast('📅 اليوم ' + today);
      return;
    }
    // D = mark day done
    if (key.toLowerCase() === 'd') { toggleDayDone(); return; }
    // C = mark exercise done (first unchecked)
    if (key.toLowerCase() === 'c') {
      const firstCheck = document.querySelector('.ex-check:not(.checked)');
      if (firstCheck) firstCheck.click();
      return;
    }
    // Enter = start guided session (TV remote OK button)
    if (key === 'Enter') { startGuidedSession(); return; }
    // Space = timer play/pause
    if (key === ' ' || code === 'Space') {
      e.preventDefault();
      timerToggle(); return;
    }
    // R = reset timer
    if (key.toLowerCase() === 'r') { timerReset(); return; }
  }

  // Session shortcuts
  if (sessOpen) {
    if (key === 'Escape') { confirmCloseSession(); return; }
    if (key === ' ' || code === 'Space') { e.preventDefault(); sessPause(); return; }
    if (key === 'ArrowRight' || key.toLowerCase() === 'p') { sessPrev(); return; }
    if (key === 'ArrowLeft' || key.toLowerCase() === 'n') { sessSkip(); return; }
    if (key === 'Enter') { sessMainAction(); return; }
  }

  // TV Remote color buttons (Hbb TV standard)
  // TV Remote color buttons (HbbTV standard VK codes)
  if (key === 'ColorF0Red'   || key === 'VK_RED')    { sessOpen ? sessPause() : startGuidedSession(); }
  if (key === 'ColorF1Green' || key === 'VK_GREEN')  { toggleDayDone(); }
  if (key === 'ColorF2Yellow'|| key === 'VK_YELLOW') { openActiveRest(); }
  if (key === 'ColorF3Blue'  || key === 'VK_BLUE')   { if(typeof openAICoach==='function') openAICoach(); }
  // Real TV remote keys available on most remotes:
  if (key === 'GoBack' || key === 'BrowserBack') { confirmCloseSession && sessOpen ? confirmCloseSession() : showMiniToast('اضغط ↑↓ لتغيير اليوم'); }
  if (key === 'HomePage' || key === 'BrowserHome') { cycleMode(); }
  // Also handle Play/Pause media keys common on smart TV remotes
  if (key === 'MediaPlayPause' || key === 'MediaPlay') { sessOpen ? sessPause() : startGuidedSession(); }
  if (key === 'MediaStop') { if(sessOpen && typeof confirmCloseSession==='function') confirmCloseSession(); }
});

// Show shortcuts hint on desktop/TV
function showShortcutHint() {
  if (window.innerWidth > 600) {
    showMiniToast('⌨️ اضغط ? لعرض الاختصارات');
  }
}

/* ══════ PHASE 2: EXERCISE EDITOR ══════ */
/* ══════ DAY EDITOR ══════ */

function getEffectiveSchedule(day) {
  // FIX#2: unified — always delegate to getDaySchedule which already
  // handles S.customSchedule and progressive overload correctly
  return getDaySchedule(day);
}

function openExEditor(exId, day) {
  const allEx = [...(S.customExercises||[]), ...EXERCISES];
  const ex = allEx.find(e=>e.id===exId);
  if (!ex) return;
  document.getElementById('ex-editor-id').value = exId;
  document.getElementById('ex-editor-day').value = day;
  document.getElementById('ex-editor-title').textContent = '✏️ ' + ex.nameAr;
  document.getElementById('ex-ed-nameAr').value = ex.nameAr;
  document.getElementById('ex-ed-nameEn').value = ex.nameEn || '';
  document.getElementById('ex-ed-icon').value = ex.icon || '💪';
  document.getElementById('ex-ed-muscles').value = ex.muscles || '';
  document.getElementById('ex-ed-sets').value = ex.sets;
  document.getElementById('ex-ed-reps').value = ex.reps;
  document.getElementById('ex-ed-type').value = ex.type || 'reps';
  document.getElementById('ex-ed-steps').value = (ex.steps||[]).join('\n');
  const restEl = document.getElementById('ex-ed-rest');
  if (restEl) restEl.value = (typeof ex.rest === 'number' && ex.rest > 0) ? ex.rest : 30;
  // Build "add from list" section
  // FIX-I: read from S.customSchedule first, fall back to getDaySchedule
  const sched = (S.customSchedule && S.customSchedule[day]) || getDaySchedule(day).exercises.map(e=>e.id);
  const available = allEx.filter(e => !sched.includes(e.id));
  document.getElementById('ex-add-from-list').innerHTML = available.map(e=>
    // FIX-XSS: escape nameAr في زر الإضافة
    `<button onclick="addExToDay('${_escHtml(e.id)}',${day})" style="padding:6px 12px;border-radius:20px;background:var(--card2);border:1px solid var(--border);font-size:12px;font-weight:700;cursor:pointer;">${_escHtml(e.icon)} ${_escHtml(e.nameAr)}</button>`
  ).join('');
  document.getElementById('new-ex-form').style.display = 'none';
  document.getElementById('ex-editor-modal').classList.add('open');
}

function exEdTypeChange() {
  const type = document.getElementById('ex-ed-type')?.value || 'reps';
  const lbl = document.getElementById('ex-ed-reps-lbl');
  const inp = document.getElementById('ex-ed-reps');
  if (!lbl || !inp) return;
  const labels = {reps:'التكرار', timer:'المدة (ث)', distance:'المسافة (م)'};
  const placeholders = {reps:'10', timer:'30', distance:'200'};
  lbl.textContent = labels[type] || 'التكرار';
  inp.placeholder = placeholders[type] || '10';
}

function closeExEditor() {
  document.getElementById('ex-editor-modal').classList.remove('open');
  document.getElementById('new-ex-form').style.display = 'none';
}

/* ══════════════════════════════════════════
   ACTIVE REST DAY
══════════════════════════════════════════ */
let arIdx = 0;
let arTimerInterval = null;
let arRemain = 0;
let arTotal = 0;

function openActiveRest() {
  arIdx = 0;
  document.getElementById('active-rest-overlay').style.display = 'flex';
  arLoad();
}

function closeActiveRest() {
  clearInterval(arTimerInterval);
  document.getElementById('active-rest-overlay').style.display = 'none';
}

function arLoad() {
  clearInterval(arTimerInterval);
  const ex = STRETCH_EXERCISES[arIdx];
  const total = STRETCH_EXERCISES.length;
  document.getElementById('ar-icon').textContent = ex.icon;
  document.getElementById('ar-name').textContent = ex.nameAr;
  document.getElementById('ar-steps').innerHTML = ex.steps.map(s => '• ' + s).join('<br>');
  document.getElementById('ar-progress').textContent = (arIdx+1) + ' / ' + total;
  document.getElementById('ar-main-btn').textContent = arIdx === total-1 ? '✅ انتهى' : 'التالي ←';
  // Dots
  document.getElementById('ar-dots').innerHTML = STRETCH_EXERCISES.map((_,i) =>
    `<div style="width:${i===arIdx?20:8}px;height:8px;border-radius:4px;background:${i<=arIdx?'var(--gold)':'rgba(255,255,255,.15)'};transition:all .3s;"></div>`
  ).join('');
  arTotal = ex.dur;
  arRemain = ex.dur;
  arUpdateRing();
  // Beep
  playTone(660, 0.15, 'sine', 0.3);
  arTimerInterval = setInterval(() => {
    arRemain--;
    arUpdateRing();
    if (arRemain <= 0) {
      clearInterval(arTimerInterval);
      playTone(880, 0.2, 'sine', 0.4);
      if (arIdx < STRETCH_EXERCISES.length - 1) {
        setTimeout(() => { arIdx++; arLoad(); }, 800);
      } else {
        setTimeout(() => {
          closeActiveRest();
          showMiniToast('🧘 أحسنت! انتهت جلسة الراحة النشطة');
        }, 800);
      }
    }
  }, 1000);
}

function arUpdateRing() {
  document.getElementById('ar-timer-num').textContent = arRemain;
  const pct = arRemain / arTotal;
  const circ = 377;
  document.getElementById('ar-ring').style.strokeDashoffset = circ * (1 - pct);
  // Color transition: gold → red as time runs out
  const hue = Math.round(pct * 40); // 40=gold, 0=red
  document.getElementById('ar-ring').style.stroke = pct > 0.3 ? 'var(--gold)' : '#ef4444';
}

function arSkip() {
  if (arIdx >= STRETCH_EXERCISES.length - 1) {
    closeActiveRest();
    showMiniToast('🧘 أحسنت! انتهت جلسة الراحة النشطة');
    return;
  }
  arIdx++;
  arLoad();
}

function arPrev() {
  if (arIdx > 0) { arIdx--; arLoad(); }
}

/* ══════════════════════════════════════════
   SMART STATS
══════════════════════════════════════════ */
function renderTrainingLogSection() {
  const el = document.getElementById('training-history-list');
  if (!el) return;
  const log = Object.values(S.trainingLog || {}).sort((a,b) => b.day - a.day).slice(0, 14);
  if (!log.length) {
    el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--dim);font-size:13px;">أكمل تمريناً لترى سجلك هنا</div>';
    return;
  }
  el.innerHTML = log.map(entry => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--card);border-radius:14px;border:1px solid var(--border);margin-bottom:8px;">
        <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--gd));display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;">
          <div style="font-size:14px;font-weight:900;color:var(--night);line-height:1;">${entry.day}</div>
          <div style="font-size:8px;color:var(--night);opacity:.8;">يوم</div>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:700;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${(entry.exercises||[]).slice(0,3).map(n => _escHtml(n)).join(' · ')}${entry.exCount > 3 ? ' ...' : ''}
          </div>
          <div style="font-size:11px;color:var(--dim);margin-top:3px;">${entry.date||''}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;">
          <div style="font-size:12px;font-weight:700;color:var(--gold);">🔥 ${entry.calories||0} كالوري</div>
          <div style="font-size:11px;color:var(--dim);">⏱ ${entry.duration||0} دقيقة</div>
        </div>
      </div>`).join('');
}

function renderSmartStats() {
  const el = document.getElementById('smart-stats');
  if (!el) return;
  const log = Object.values(S.trainingLog || {}).sort((a,b) => (a.day||0) - (b.day||0));
  if (log.length < 2) {
    el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--dim);font-size:13px;">أكمل 2 أيام على الأقل لرؤية الإحصاء الذكي</div>';
    return;
  }

  const progDays  = S.user?.programDays || 30;
  const rate      = Math.round((S.completedDays.length / progDays) * 100);
  const nowTs     = Date.now();
  const msWeek    = 7 * 24 * 3600 * 1000;
  const thisWeekLog = log.filter(e => e.ts && (nowTs-e.ts) < msWeek);
  const lastWeekLog = log.filter(e => e.ts && (nowTs-e.ts) >= msWeek && (nowTs-e.ts) < 2*msWeek);
  const thisWeek  = thisWeekLog.length;
  const lastWeek  = lastWeekLog.length;
  const thisWCal  = thisWeekLog.reduce((s,e)=>s+(e.calories||0),0);
  const lastWCal  = lastWeekLog.reduce((s,e)=>s+(e.calories||0),0);
  const weekTrend = thisWeek >= lastWeek ? '📈' : '📉';
  const calTrend  = thisWCal >= lastWCal  ? '📈' : '📉';

  // أفضل يوم
  const DAY_NAMES = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const dayCount  = {0:0,1:0,2:0,3:0,4:0,5:0,6:0};
  log.forEach(e => { if(e.ts) dayCount[new Date(e.ts).getDay()]++; });
  const bestDayIdx = Object.entries(dayCount).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const bestDay = bestDayIdx !== undefined ? DAY_NAMES[bestDayIdx] : '—';

  // متوسط السعرات
  const avgCal = log.length ? Math.round(log.reduce((s,e)=>s+(e.calories||0),0)/log.length) : 0;
  // أفضل جلسة
  const bestSession = log.reduce((best,e) => (e.calories||0) > (best.calories||0) ? e : best, log[0]);
  // إجمالي وقت التمرين
  const totalMins = log.reduce((s,e)=>s+(e.duration||0),0);

  // ── Personal Records (أرقام قياسية) ──
  const exCountMap = {};
  const exCalMap   = {};
  log.forEach(entry => {
    (entry.exerciseIds||[]).forEach(id => {
      exCountMap[id] = (exCountMap[id]||0) + 1;
    });
    (entry.exercises||[]).forEach(name => {
      exCalMap[name] = (exCalMap[name]||0) + 1;
    });
  });
  const allExArr = [...(typeof EXERCISES!=='undefined'?EXERCISES:[]),...(S.customExercises||[])];
  const topExIds = Object.entries(exCountMap).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const topExList = topExIds.map(([id,cnt])=>{
    const ex = allExArr.find(e=>e.id===id);
    return { name: ex?.nameAr||id, count: cnt, icon: ex?.icon||'💪' };
  });

  // أرقام قياسية من سجل التمارين
  const prs = _calcPersonalRecords();

  el.innerHTML = `
    <!-- ── الإحصاء الأساسي ── -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px;">
      ${[
        { val:rate+'%',    lbl:'معدل الإتمام', color:'var(--gold)' },
        { val:avgCal,      lbl:'متوسط كال/جلسة', color:'#f97316' },
        { val:Math.round(totalMins/60)+'س', lbl:'إجمالي وقت التمرين', color:'#38bdf8' },
      ].map(s=>`
        <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:12px 8px;text-align:center;">
          <div style="font-size:22px;font-weight:900;color:${s.color};">${s.val}</div>
          <div style="font-size:10px;color:var(--dim);margin-top:3px;">${s.lbl}</div>
        </div>`).join('')}
    </div>

    <!-- ── مقارنة الأسبوع ── -->
    <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:14px;">
      <div style="font-size:12px;font-weight:800;color:var(--txt);margin-bottom:8px;">📅 مقارنة الأسبوعين</div>
      <div style="display:flex;gap:10px;">
        ${[
          { lbl:'جلسات', cur:thisWeek, prev:lastWeek, trend:weekTrend },
          { lbl:'سعرات', cur:thisWCal, prev:lastWCal, trend:calTrend },
        ].map(w=>{
          const diff = w.cur - w.prev;
          const color = diff >= 0 ? '#22c55e' : '#ef4444';
          return `<div style="flex:1;background:rgba(255,255,255,.04);border-radius:10px;padding:8px;text-align:center;">
            <div style="font-size:10px;color:var(--dim);">${w.lbl}</div>
            <div style="font-size:18px;font-weight:900;color:var(--gold);">${w.cur}</div>
            <div style="font-size:10px;color:${color};">${w.trend} ${diff>=0?'+':''}${diff}</div>
            <div style="font-size:9px;color:var(--dim);">الماضي: ${w.prev}</div>
          </div>`;
        }).join('')}
        <div style="flex:1;background:rgba(255,255,255,.04);border-radius:10px;padding:8px;text-align:center;">
          <div style="font-size:10px;color:var(--dim);">أفضل يوم</div>
          <div style="font-size:15px;font-weight:900;color:var(--gold);">${bestDay}</div>
          <div style="font-size:9px;color:var(--dim);">في الأسبوع</div>
        </div>
      </div>
    </div>

    <!-- ── أرقام قياسية Personal Records ── -->
    ${prs.length ? `
    <div style="background:var(--card);border:1px solid rgba(212,168,67,.2);border-radius:14px;padding:12px;margin-bottom:14px;">
      <div style="font-size:12px;font-weight:800;color:var(--gold);margin-bottom:8px;">🏅 أرقامك القياسية</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${prs.map(pr=>`
          <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04);">
            <span style="font-size:16px;">${pr.icon}</span>
            <div style="flex:1;font-size:12px;font-weight:700;color:var(--txt);">${_escHtml(pr.name)}</div>
            <div style="font-size:12px;font-weight:900;color:var(--gold);">${pr.value}</div>
            <div style="font-size:10px;color:var(--dim);">${_escHtml(pr.date)}</div>
          </div>`).join('')}
      </div>
    </div>` : ''}

    <!-- ── أكثر التمارين أداءً ── -->
    ${topExList.length ? `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:12px;">
      <div style="font-size:12px;font-weight:800;color:var(--txt);margin-bottom:8px;">💪 أكثر تمارينك أداءً</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${topExList.map((ex,i)=>`
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:22px;height:22px;border-radius:50%;background:${i===0?'var(--gold)':i===1?'rgba(192,192,192,.3)':'rgba(184,115,51,.3)'};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;color:${i===0?'var(--night)':'var(--dim)'};">${i+1}</div>
            <span style="font-size:16px;">${ex.icon}</span>
            <div style="flex:1;font-size:12px;font-weight:700;color:var(--txt);">${_escHtml(ex.name)}</div>
            <div style="font-size:11px;color:var(--dim);">${ex.count} جلسة</div>
          </div>`).join('')}
      </div>
    </div>` : ''}
  `;
}

// حساب الأرقام القياسية من سجل التدريب
function _calcPersonalRecords() {
  const log = Object.values(S.trainingLog || {});
  if (!log.length) return [];
  const prs = [];

  // أطول جلسة
  const longest = log.reduce((best,e) => (e.duration||0) > (best.duration||0) ? e : best, log[0]);
  if (longest.duration > 0) prs.push({
    icon:'⏱️', name:'أطول جلسة',
    value: longest.duration + ' دقيقة',
    date: longest.date || ''
  });

  // أعلى حرق في جلسة واحدة
  const hottest = log.reduce((best,e) => (e.calories||0) > (best.calories||0) ? e : best, log[0]);
  if (hottest.calories > 0) prs.push({
    icon:'🔥', name:'أعلى حرق في جلسة',
    value: hottest.calories + ' كال',
    date: hottest.date || ''
  });

  // أكثر يوم تمارين
  const busiest = log.reduce((best,e) => (e.exCount||0) > (best.exCount||0) ? e : best, log[0]);
  if (busiest.exCount > 0) prs.push({
    icon:'💪', name:'أكثر تمارين في جلسة',
    value: busiest.exCount + ' تمرين',
    date: busiest.date || ''
  });

  // أفضل سلسلة
  if (S.streak > 0) prs.push({
    icon:'⛓️', name:'السلسلة الحالية',
    value: S.streak + ' يوم',
    date: ''
  });

  return prs.slice(0,4);
}

/* ══════════════════════════════════════════
   HISTORY + SHARE + NOTIFICATIONS
══════════════════════════════════════════ */


/* ══════════════════════════════════════════
   EXPORT TRAINING DATA — تصدير بيانات التدريب
   CSV كامل + ملخص نصي
══════════════════════════════════════════ */

function exportTrainingCSV() {
  const log = Object.values(S.trainingLog || {})
    .sort((a,b) => (a.day||0) - (b.day||0));

  if (!log.length) {
    showMiniToast('⚠️ لا يوجد سجل تدريب بعد — أكمل جلسة أولاً');
    return;
  }

  // ── Header ──
  const headers = ['اليوم','التاريخ','نوع التدريب','التمارين','عدد التمارين','المجموعات','السعرات','المدة (دقيقة)'];
  const rows = [headers];

  log.forEach(e => {
    rows.push([
      e.day || '',
      e.date || '',
      e.type || e.label || 'تدريب',
      (e.exercises || []).join(' | '),
      e.exCount || (e.exercises||[]).length || '',
      e.sets || e.totalSets || '',
      e.calories || '',
      e.duration || '',
    ]);
  });

  // ── إحصاء ختامي ──
  rows.push([]);
  rows.push(['── إحصاء عام ──']);
  rows.push(['إجمالي الجلسات', log.length]);
  rows.push(['إجمالي السعرات', log.reduce((s,e)=>s+(e.calories||0),0)]);
  rows.push(['إجمالي الدقائق', log.reduce((s,e)=>s+(e.duration||0),0)]);
  rows.push(['أطول سلسلة', S.streak || 0]);
  rows.push(['الاسم', S.user?.name || '—']);
  rows.push(['الوزن', S.user?.weight ? S.user.weight + ' كغ' : '—']);
  rows.push(['الهدف', {burn:'حرق الدهون',muscle:'بناء العضلات',fitness:'تحسين اللياقة',health:'الصحة العامة'}[S.user?.goal] || '—']);

  // ── بيانات الوزن ──
  const measurements = Object.entries(S.bodyMeasurements || {})
    .filter(([,v]) => v.weight).sort(([a],[b]) => a.localeCompare(b));
  if (measurements.length) {
    rows.push([]);
    rows.push(['── سجل الوزن ──']);
    rows.push(['التاريخ','الوزن (كغ)','الخصر (سم)','الصدر (سم)']);
    measurements.forEach(([date, v]) => {
      rows.push([date, v.weight||'', v.waist||'', v.chest||'']);
    });
  }

  // ── تحويل لـ CSV ──
  const csvContent = rows.map(row =>
    Array.isArray(row)
      ? row.map(cell => `"${String(cell||'').replace(/"/g,'""')}"`).join(',')
      : ''
  ).join('\n');

  const BOM = '﻿'; // لدعم UTF-8 في Excel
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AZEM-training-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showMiniToast(`✅ تم تصدير ${log.length} جلسة كـ CSV`);
}

/* ══════════════════════════════════════════
   BARCODE SCANNER — مسح باركود الطعام
   يستخدم BarcodeDetector API المدمج في Chrome
   ويبحث في Open Food Facts API (مجاني)
══════════════════════════════════════════ */

let _barcodeStream = null;

function openBarcodeScanner() {
  // تحقق من دعم المتصفح
  if (!('BarcodeDetector' in window)) {
    showMiniToast('⚠️ مسح الباركود يتطلب Chrome 83+ على Android');
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    showMiniToast('⚠️ الكاميرا غير متاحة');
    return;
  }
  _showBarcodeScannerModal();
}

function _showBarcodeScannerModal() {
  let modal = document.getElementById('barcode-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'barcode-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div style="position:relative;width:100%;max-width:400px;aspect-ratio:4/3;background:#111;border-radius:0;overflow:hidden;">
      <video id="barcode-video" autoplay playsinline muted style="width:100%;height:100%;object-fit:cover;"></video>
      <!-- إطار المسح -->
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;">
        <div style="width:65%;height:40%;border:3px solid #D4A843;border-radius:12px;box-shadow:0 0 0 9999px rgba(0,0,0,.5);"></div>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.7);padding:12px;text-align:center;font-size:13px;color:rgba(255,255,255,.7);">
        وجّه الكاميرا نحو باركود المنتج
      </div>
    </div>
    <div id="barcode-result" style="width:100%;max-width:400px;background:#111;padding:16px;min-height:80px;"></div>
    <button onclick="closeBarcodeScanner()" style="margin-top:16px;padding:12px 32px;border-radius:14px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-family:'Cairo',sans-serif;font-size:15px;cursor:pointer;">✕ إغلاق</button>
  `;
  modal.style.display = 'flex';
  _startBarcodeDetection();
}

async function _startBarcodeDetection() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    _barcodeStream = stream;
    const video = document.getElementById('barcode-video');
    if (!video) { closeBarcodeScanner(); return; }
    video.srcObject = stream;

    const detector = new BarcodeDetector({ formats: ['ean_13','ean_8','upc_a','upc_e','code_128','qr_code'] });
    let scanning = true;
    let lastBarcode = '';

    const scan = async () => {
      if (!scanning || !document.getElementById('barcode-modal')) return;
      try {
        const barcodes = await detector.detect(video);
        if (barcodes.length > 0) {
          const barcode = barcodes[0].rawValue;
          if (barcode !== lastBarcode) {
            lastBarcode = barcode;
            scanning = false;
            // اهتزاز + صوت
            navigator.vibrate?.(100);
            if (typeof playBeep === 'function') playBeep();
            await _lookupBarcode(barcode);
            scanning = true;
            lastBarcode = '';
          }
        }
      } catch(e) {}
      if (scanning) requestAnimationFrame(scan);
    };
    video.onloadedmetadata = () => { video.play(); requestAnimationFrame(scan); };
  } catch(e) {
    closeBarcodeScanner();
    showMiniToast('⚠️ لا يمكن الوصول للكاميرا — تحقق من الصلاحيات');
  }
}

async function _lookupBarcode(barcode) {
  const resultEl = document.getElementById('barcode-result');
  if (resultEl) resultEl.innerHTML = `<div style="text-align:center;color:var(--gold);padding:16px;">⏳ جارٍ البحث عن ${barcode}...</div>`;

  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, {
      signal: AbortSignal.timeout(8000),
      mode: 'cors',
      headers: { 'Accept': 'application/json' }
    });
    const data = await res.json();

    if (data.status !== 1 || !data.product) {
      if (resultEl) resultEl.innerHTML = `
        <div style="color:#ef4444;text-align:center;padding:8px;">❌ المنتج غير موجود في قاعدة البيانات</div>
        <div style="font-size:11px;color:var(--dim);text-align:center;margin-top:4px;">الباركود: ${barcode}</div>`;
      return;
    }

    const p = data.product;
    const name = p.product_name_ar || p.product_name || p.product_name_en || 'منتج غير محدد';
    const n = p.nutriments || {};
    const cal100 = Math.round(n['energy-kcal_100g'] || n['energy_100g'] / 4.184 || 0);
    const p100   = Math.round(n['proteins_100g'] || 0);
    const c100   = Math.round(n['carbohydrates_100g'] || 0);
    const f100   = Math.round(n['fat_100g'] || 0);
    const serving = p.serving_size || '100 غ';

    if (resultEl) resultEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
        ${p.image_thumb_url ? `<img src="${p.image_thumb_url}" style="width:50px;height:50px;border-radius:8px;object-fit:cover;">` : '<div style="width:50px;height:50px;border-radius:8px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:24px;">📦</div>'}
        <div>
          <div style="font-size:14px;font-weight:700;color:#fff;">${name}</div>
          <div style="font-size:11px;color:rgba(255,255,255,.5);">لكل ${serving}</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        ${[['🔥 سعرات',cal100,'#D4A843'],['💪 بروتين',p100+'غ','#f97316'],['🍚 كارب',c100+'غ','#38bdf8'],['🫙 دهون',f100+'غ','#a78bfa']].map(([lbl,val,color])=>`
          <div style="flex:1;background:rgba(255,255,255,.07);border-radius:8px;padding:6px;text-align:center;">
            <div style="font-size:11px;color:rgba(255,255,255,.5);">${lbl}</div>
            <div style="font-size:13px;font-weight:800;color:${color};">${val}</div>
          </div>`).join('')}
      </div>
      ${cal100 > 0 ? `
        <div style="display:flex;gap:8px;">
          <input id="barcode-qty" type="number" value="1" min="0.5" step="0.5"
            style="width:60px;padding:8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:8px;color:#fff;font-family:'Cairo',sans-serif;text-align:center;">
          <button onclick="_addBarcodeFood('${barcode}','${name.replace(/'/g,'')}',${ cal100 },${ p100 },${ c100 },${ f100 },'${serving}')"
            style="flex:1;padding:10px;border-radius:10px;background:linear-gradient(135deg,var(--gl),var(--gd));border:none;color:var(--night);font-family:'Cairo',sans-serif;font-size:13px;font-weight:900;cursor:pointer;">
            + أضف للسجل</button>
        </div>` : ''}
    `;
  } catch(e) {
    if (resultEl) resultEl.innerHTML = `<div style="color:#ef4444;text-align:center;padding:8px;">⚠️ فشل الاتصال — تحقق من الإنترنت</div>`;
  }
}

function _addBarcodeFood(barcode, name, cal, p, c, f, unit) {
  const qty = parseFloat(document.getElementById('barcode-qty')?.value) || 1;
  const dateKey = new Date().toISOString().split('T')[0];
  if (!S.nutritionLog) S.nutritionLog = {};
  if (!S.nutritionLog[dateKey]) S.nutritionLog[dateKey] = { entries: [] };
  const now = new Date();
  S.nutritionLog[dateKey].entries.push({
    id: 'bc_' + barcode, name, icon: '📦',
    cal, unit, qty,
    totalCal: Math.round(cal * qty),
    totalP:   Math.round(p * qty * 10) / 10,
    totalC:   Math.round(c * qty * 10) / 10,
    totalF:   Math.round(f * qty * 10) / 10,
    time: now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0'),
    ts: Date.now()
  });
  saveState();
  if (typeof renderNutritionDiary === 'function') renderNutritionDiary();
  closeBarcodeScanner();
  showMiniToast(`✅ ${name} — ${Math.round(cal*qty)} كال`);
}

function closeBarcodeScanner() {
  if (_barcodeStream) {
    _barcodeStream.getTracks().forEach(t => t.stop());
    _barcodeStream = null;
  }
  const modal = document.getElementById('barcode-modal');
  if (modal) modal.remove();
}

// ══════════════════════════════════════════
// بطاقة الإنجاز — Canvas قابل للمشاركة
// ══════════════════════════════════════════
function shareProgress() {
  generateAchievementCard().then(dataUrl => {
    if (!dataUrl) { _shareTextFallback(); return; }
    // عرض البطاقة في modal
    _showAchievementModal(dataUrl);
  });
}

async function generateAchievementCard() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width  = 900;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    const done   = (S.completedDays||[]).length;
    const total  = S.user?.programDays || 30;
    const pct    = Math.round(done/total*100);
    const streak = S.streak || 0;
    const cal    = S.calories || 0;
    const name   = S.user?.name || 'بطل';
    const level  = typeof getCurrentLevel === 'function' ? getCurrentLevel() : { lvl:1, name:'مبتدئ', icon:'🌱' };

    // ── خلفية متدرجة حسب الثيم ──
    const themeGrads = {
      default: ['#07090F','#0F172A'],
      fire:    ['#0D0500','#2D0900'],
      ocean:   ['#00070F','#001830'],
      nature:  ['#020A05','#0A2010'],
      neon:    ['#050008','#180030'],
      purple:  ['#060010','#1A0040'],
      light:   ['#F1F5F9','#E2E8F0'],
    };
    const [bg1, bg2] = themeGrads[S.theme] || themeGrads.default;
    const grad = ctx.createLinearGradient(0, 0, 900, 500);
    grad.addColorStop(0, bg1);
    grad.addColorStop(1, bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 500);

    // ── حدود ذهبية ──
    ctx.strokeStyle = 'rgba(212,168,67,0.4)';
    ctx.lineWidth = 2;
    _roundRect(ctx, 12, 12, 876, 476, 20);
    ctx.stroke();

    // ── شعار AZEM ──
    ctx.font = 'bold 22px Arial';
    ctx.fillStyle = '#D4A843';
    ctx.textAlign = 'right';
    ctx.fillText('AZEM (عزم)', 880, 50);
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('تطبيق اللياقة العربي', 880, 72);

    // ── اسم + مستوى ──
    ctx.textAlign = 'right';
    ctx.font = 'bold 42px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(name, 860, 140);
    ctx.font = '20px Arial';
    ctx.fillStyle = '#D4A843';
    ctx.fillText(`${level.icon} مستوى ${level.lvl} — ${level.name}`, 860, 175);

    // ── شريط التقدم ──
    const barX = 40, barY = 210, barW = 820, barH = 16;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    _roundRect(ctx, barX, barY, barW, barH, 8);
    ctx.fill();
    const fillGrad = ctx.createLinearGradient(barX, 0, barX+barW, 0);
    fillGrad.addColorStop(0, '#D4A843');
    fillGrad.addColorStop(1, '#F59E0B');
    ctx.fillStyle = fillGrad;
    _roundRect(ctx, barX, barY, Math.max(16, barW * pct/100), barH, 8);
    ctx.fill();
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'left';
    ctx.fillText(`${done}/${total} يوم`, barX, barY + barH + 20);
    ctx.textAlign = 'right';
    ctx.fillText(`${pct}%`, barX + barW, barY + barH + 20);

    // ── إحصائيات 4 بطاقات ──
    const stats = [
      { label:'أيام مكتملة', val:done,    icon:'✅', color:'#22C55E' },
      { label:'سلسلة',       val:streak,  icon:'🔥', color:'#F97316' },
      { label:'سعرات',       val:cal>999?(cal/1000).toFixed(1)+'k':cal, icon:'⚡', color:'#38BDF8' },
      { label:'تقدم',        val:pct+'%', icon:'📊', color:'#D4A843' },
    ];
    stats.forEach((s, i) => {
      const x = 40 + i * 215;
      const y = 270;
      // بطاقة
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      _roundRect(ctx, x, y, 200, 110, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      _roundRect(ctx, x, y, 200, 110, 14);
      ctx.stroke();
      // قيمة
      ctx.font = 'bold 34px Arial';
      ctx.fillStyle = s.color;
      ctx.textAlign = 'center';
      ctx.fillText(s.icon + ' ' + s.val, x + 100, y + 52);
      // وصف
      ctx.font = '14px Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(s.label, x + 100, y + 82);
    });

    // ── تاريخ + رسالة ──
    const today = new Date().toLocaleDateString('ar-SA');
    ctx.textAlign = 'center';
    ctx.font = '13px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText(`${today} · azem.app`, 450, 460);

    return canvas.toDataURL('image/png');
  } catch(e) { console.warn('Card error:', e); return null; }
}

function _roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

function _showAchievementModal(dataUrl) {
  // إنشاء modal العرض
  let modal = document.getElementById('achievement-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'achievement-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.85);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;gap:14px;';
    modal.onclick = e => { if(e.target===modal) modal.remove(); };
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div style="font-size:15px;font-weight:900;color:#D4A843;">🏆 بطاقة إنجازك</div>
    <img src="${dataUrl}" style="width:100%;max-width:500px;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.6);">
    <div style="display:flex;gap:10px;width:100%;max-width:500px;">
      <button onclick="_downloadCard('${dataUrl}')"
        style="flex:1;padding:13px;border-radius:14px;background:linear-gradient(135deg,#D4A843,#F59E0B);border:none;color:#07090F;font-family:'Cairo',sans-serif;font-size:14px;font-weight:900;cursor:pointer;">
        ⬇️ تنزيل
      </button>
      <button onclick="_shareCard('${dataUrl}')"
        style="flex:1;padding:13px;border-radius:14px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-family:'Cairo',sans-serif;font-size:14px;font-weight:700;cursor:pointer;">
        📤 مشاركة
      </button>
      <button onclick="document.getElementById('achievement-modal').remove()"
        style="padding:13px 16px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.5);font-family:'Cairo',sans-serif;font-size:14px;cursor:pointer;">✕</button>
    </div>`;
  modal.style.display = 'flex';
}

function _downloadCard(dataUrl) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'AZEM-achievement-' + new Date().toISOString().split('T')[0] + '.png';
  a.click();
  showMiniToast('✅ تم تنزيل البطاقة!');
}

async function _shareCard(dataUrl) {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'azem-achievement.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'إنجازي في AZEM' });
    } else {
      _shareTextFallback();
    }
  } catch(e) { _shareTextFallback(); }
}

function _shareTextFallback() {
  const done   = (S.completedDays||[]).length;
  const total  = S.user?.programDays || 30;
  const pct    = Math.round(done/total*100);
  const name   = S.user?.name || 'بطل';
  const text = `💪 ${name} أكمل ${done}/${total} يوم في AZEM (عزم)!\n🔥 سلسلة ${S.streak||0} يوم · ⚡ ${S.calories||0} سعرة · 📊 ${pct}%`;
  navigator.share?.({ title:'AZEM', text }).catch(()=>
    navigator.clipboard?.writeText(text).then(()=> showMiniToast('✅ تم نسخ التقدم!')));
}

// Notifications
let notifInterval = null;
function toggleNotifSwitch() {
  const toggle = document.getElementById('notif-toggle');
  const knob = document.getElementById('notif-toggle-knob');
  const sub = document.getElementById('notif-toggle-sub');
  const isOn = toggle.dataset.on === '1';
  if (isOn) {
    // Turn off
    toggle.dataset.on = '0';
    toggle.style.background = 'rgba(100,116,139,.3)';
    knob.style.transform = 'translateX(0)';
    if (sub) sub.textContent = 'اضغط لتفعيل التنبيهات';
    return;
  }
  // Turn on → request permission
  requestNotifPerm();
}
function _setNotifToggleOn() {
  const toggle = document.getElementById('notif-toggle');
  const knob = document.getElementById('notif-toggle-knob');
  const sub = document.getElementById('notif-toggle-sub');
  if (toggle) { toggle.dataset.on = '1'; toggle.style.background = 'var(--green,#22c55e)'; }
  if (knob) knob.style.transform = 'translateX(24px)';
  if (sub) sub.textContent = '✅ التذكير مفعّل';
}
function requestNotifPerm() {
  if (!('Notification' in window)) {
    showMiniToast('المتصفح لا يدعم الإشعارات'); return;
  }
  Notification.requestPermission().then(perm => {
    if (perm === 'granted') {
      showMiniToast('✅ سيصلك تذكير في وقت تدريبك');
      scheduleTrainingNotif();
      _setNotifToggleOn();
    } else {
      showMiniToast('⚠️ الإشعارات غير مسموحة');
    }
  });
}


function toggleNotifFromSettings() {
  const toggle = document.getElementById('settings-notif-toggle');
  const knob = document.getElementById('settings-notif-knob');
  const sub = document.getElementById('settings-notif-sub');
  const isOn = toggle?.dataset.on === '1';
  if (isOn) {
    if (toggle) { toggle.dataset.on = '0'; toggle.style.background = 'rgba(100,116,139,.3)'; }
    if (knob) knob.style.transform = 'translateX(0)';
    if (sub) sub.textContent = 'اضغط لتفعيل التنبيهات';
    return;
  }
  if (!('Notification' in window)) { showMiniToast('المتصفح لا يدعم الإشعارات'); return; }
  Notification.requestPermission().then(perm => {
    if (perm === 'granted') {
      if (toggle) { toggle.dataset.on = '1'; toggle.style.background = 'var(--green,#22c55e)'; }
      if (knob) knob.style.transform = 'translateX(24px)';
      if (sub) sub.textContent = '✅ التذكير مفعّل';
      scheduleTrainingNotif();
      showMiniToast('✅ سيصلك تذكير في وقت تدريبك');
    } else {
      showMiniToast('⚠️ الإشعارات غير مسموحة');
    }
  });
}
function _syncSettingsNotifToggle() {
  const toggle = document.getElementById('settings-notif-toggle');
  const knob = document.getElementById('settings-notif-knob');
  const sub = document.getElementById('settings-notif-sub');
  const granted = typeof Notification !== 'undefined' && Notification.permission === 'granted';
  if (toggle) { toggle.dataset.on = granted ? '1' : '0'; toggle.style.background = granted ? 'var(--green,#22c55e)' : 'rgba(100,116,139,.3)'; }
  if (knob) knob.style.transform = granted ? 'translateX(24px)' : 'translateX(0)';
  if (sub) sub.textContent = granted ? '✅ التذكير مفعّل' : 'اضغط لتفعيل التنبيهات';
}

// ── بناء config الإشعار الكامل من حالة التطبيق ──
function buildReminderConfig() {
  const trainTime = S.user?.trainTime || '';
  if (!trainTime) return null;

  // هل اليوم الحالي مكتمل؟
  const isDoneToday = (S.completedDays||[]).includes(S.currentDay);

  // هل اليوم يوم راحة؟
  let isRestDay = false;
  try {
    const sched = getDaySchedule(S.currentDay);
    isRestDay = sched.type === 'rest';
  } catch(e) {}

  // كم يوماً غاب؟
  const log = Object.values(S.trainingLog||{}).sort((a,b)=>b.ts-a.ts);
  const lastTs = log[0]?.ts || Date.now();
  const daysMissed = Math.floor((Date.now() - lastTs) / 86400000);

  // أيام متبقية
  const progDays = S.user?.programDays || 30;
  const daysLeft = progDays - (S.completedDays||[]).length;

  // نسبة التقدم
  const donePct = Math.round((S.completedDays||[]).length / progDays * 100);

  // آخر رسالة مدرب استباقية للإشعار
  const mem = S.coachMemory || {};
  let coachMsg = '';
  if (mem.patterns?.trend === 'declining' && daysMissed >= 1) {
    coachMsg = `${S.user?.name||'بطل'}، لاحظت تراجعاً في أداءك — تمرين خفيف اليوم يعيد الزخم! 💪`;
  }

  return {
    trainTime,
    name:       S.user?.name       || 'بطل',
    day:        S.currentDay       || 1,
    streak:     S.streak           || 0,
    donePct,
    isDoneToday,
    isRestDay,
    daysMissed: Math.max(0, daysMissed - 1),
    personality: mem.personality   || 'balanced',
    daysLeft:   Math.max(0, daysLeft),
    coachMsg
  };
}

function scheduleTrainingNotif() {
  const cfg = buildReminderConfig();
  if (!cfg) return;

  // ── إرسال الـ config للـ SW (يعمل حتى التطبيق مغلق) ──
  const sendToSW = (sw) => {
    if (sw) {
      sw.postMessage({ type: 'SCHEDULE_REMINDER', config: cfg });
    }
  };

  if ('serviceWorker' in navigator) {
    if (navigator.serviceWorker.controller) {
      sendToSW(navigator.serviceWorker.controller);
    } else {
      navigator.serviceWorker.ready.then(reg => sendToSW(reg.active));
    }
  }

  // ── Fallback: interval عندما التطبيق مفتوح ──
  if (notifInterval) clearInterval(notifInterval);
  notifInterval = setInterval(() => {
    if (Notification.permission !== 'granted') return;
    const freshCfg = buildReminderConfig();
    if (!freshCfg) return;
    const now = new Date();
    const [h, m] = freshCfg.trainTime.split(':').map(Number);
    if (isNaN(h) || now.getHours() !== h || now.getMinutes() !== m) return;
    // تجنب التكرار
    const lastKey = 'azem_last_notif_' + now.toDateString();
    if (sessionStorage.getItem(lastKey)) return;
    sessionStorage.setItem(lastKey, '1');
    const content = _buildLocalNotifContent(freshCfg);
    new Notification(content.title, {
      body: content.body, icon: './icon-192-2.png',
      tag: content.tag, renotify: false
    });
  }, 60000);
}

// بناء محتوى الإشعار محلياً (نسخة client-side)
function _buildLocalNotifContent(cfg) {
  const name = cfg.name || 'بطل';
  const day  = cfg.day  || 1;
  if (cfg.coachMsg) return { title: '🤖 المدرب الذكي · AZEM', body: cfg.coachMsg, tag: 'azem-coach' };
  if (cfg.isDoneToday) return { title: '✅ أحسنت! · AZEM', body: `${name}، اليوم ${day} مكتمل! 💪`, tag: 'azem-done' };
  if (cfg.isRestDay)   return { title: '😴 يوم راحة · AZEM', body: `${name}، اليوم راحة مبرمجة.`, tag: 'azem-rest' };
  if (cfg.daysMissed >= 2) return { title: '⚡ AZEM يفتقدك!', body: `${name}! ${cfg.daysMissed} أيام — تمرين واحد اليوم يكفي 🔥`, tag: 'azem-absence' };
  if (cfg.daysLeft <= 3 && cfg.daysLeft > 0) return { title: `🏁 ${cfg.daysLeft} أيام للإنجاز!`, body: `${name}، الخط النهائي! 🏆`, tag: 'azem-finish' };
  if (cfg.streak >= 7) return { title: `🔥 ${cfg.streak} أيام متواصلة!`, body: `${name}! تمرين اليوم ${day} 💪`, tag: 'azem-streak' };
  return { title: 'AZEM (عزم) 🏋️', body: `${name}، وقت تدريبك! اليوم ${day} في انتظارك 💪`, tag: 'azem-reminder' };
}

// ── إشعار فوري من المدرب (يُستدعى من coach.js) ──
function sendCoachNotification(message) {
  if (Notification.permission !== 'granted') return;
  const name = S.user?.name || 'بطل';
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'COACH_NOTIFY', message, name
    });
  } else {
    new Notification('🤖 المدرب الذكي · AZEM', {
      body: message.slice(0, 150), icon: './icon-192-2.png',
      tag: 'azem-coach-' + Date.now()
    });
  }
}

// Auto-schedule if permission already granted
if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
  scheduleTrainingNotif();
  setTimeout(() => {
    const btn = document.getElementById('notif-btn');
    if (btn) { btn.textContent = '✅ التذكير مفعّل'; }
  }, 500);
}


/* ══════════════════════════════════════════
   ONBOARDING v2 — تسلسل جديد
══════════════════════════════════════════ */

// الخطوات: lang → auth → password-link → info → privacy → done
// navigation يدوي عبر obGoToStep
const OB_STEPS = ['lang','auth','password-link','info','privacy','done'];
let obCurrentStep = 'lang';

function showOnboarding() {
  // اذا كانت اللغة محفوظة مسبقا (المستخدم اختارها قبل تسجيل الدخول)
  // لا نعيد شاشة اللغة — نذهب مباشرة لـ auth
  const langAlreadySet = !!(S.lang && S.lang !== '');
  obCurrentStep = langAlreadySet ? 'auth' : 'lang';
  document.getElementById('onboarding').style.display = 'flex';
  renderObStep();
}

function obGoToStep(stepId) {
  obCurrentStep = stepId;
  const obEl = document.getElementById('onboarding');
  if (obEl && obEl.style.display === 'none') obEl.style.display = 'flex';
  renderObStep();
}

function obFinish() {
  S.onboardingDone = true;
  // FIX: undefined يُعامل كـ false — المستخدم يجب أن يختار صراحةً
  S.privacyAccepted = window._privacyAccepted === true;
  window._justFinishedOnboarding = true;
  saveState();
  if (window._fbUser && typeof sendToSheets === 'function') {
    sendToSheets(window._fbUser, { privacyAccepted: S.privacyAccepted });
  }
  document.getElementById('onboarding').style.display = 'none';
  // إذا لم يختر أياماً — اقترح الإثنين والأربعاء والجمعة كافتراضي
  if (!S.commitmentDays || S.commitmentDays.length === 0) {
    S.commitmentDays = [1, 3, 5]; // الاثنين، الأربعاء، الجمعة
    saveState();
  }
  // احفظ onboardingDone في Firestore
  if (typeof window.pushToCloud === 'function') window.pushToCloud();
  render();
  setTimeout(() => { window._justFinishedOnboarding = false; startTutorial(); }, 800);
}

function obSelectLang(code) {
  currentLang = code;
  S.lang = code;
  // تطبيق اللغة بدون render كامل — الـ Onboarding لم ينتهِ بعد
  document.documentElement.lang = code;
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
  document.body.style.fontFamily = code === 'ar' ? "'Cairo','Tajawal',sans-serif" : "'Inter',sans-serif";
  saveState();
  obGoToStep('auth');
}

function obNext() {
  if (obCurrentStep === 'info') {
    const wEl  = document.getElementById('ob-weight-inp');
    const hEl  = document.getElementById('ob-height-inp');
    const aEl  = document.getElementById('ob-age-inp');
    const nEl  = document.getElementById('ob-name-inp2');
    const phEl = document.getElementById('ob-phone-inp');
    // FIX: تحقق من صحة المدخلات قبل الحفظ
    const w = parseFloat(wEl?.value) || 0;
    const h = parseFloat(hEl?.value) || 0;
    const a = parseFloat(aEl?.value) || 0;
    if (w < 0 || w > 400) { showMiniToast('⚠️ أدخل وزناً صحيحاً (كغ)'); return; }
    if (h < 0 || h > 300) { showMiniToast('⚠️ أدخل طولاً صحيحاً (سم)'); return; }
    if (a < 0 || a > 120) { showMiniToast('⚠️ أدخل عمراً صحيحاً'); return; }
    if (w > 0) S.user.weight = w;
    if (h > 0) S.user.height = h;
    if (a > 0) S.user.age    = a;
    if (nEl  && nEl.value.trim())  S.user.name  = nEl.value.trim();
    if (phEl && phEl.value.trim()) S.user.phone = phEl.value.trim();
    if (!S.user.goal)   S.user.goal   = 'fitness';
    if (!S.user.gender) S.user.gender = 'male';
    saveState();
    obGoToStep('privacy');
    return;
  }
  if (obCurrentStep === 'privacy') {
    obFinish();
    return;
  }
  obFinish();
}

function obSetGender(g) {
  S.user.gender = g;
  const mBtn = document.getElementById('ob-gender-male');
  const fBtn = document.getElementById('ob-gender-female');
  if (mBtn) {
    mBtn.style.background = g==='male' ? 'rgba(99,102,241,.2)' : 'var(--card)';
    mBtn.style.borderColor = g==='male' ? '#6366f1' : 'var(--border)';
  }
  if (fBtn) {
    fBtn.style.background = g==='female' ? 'rgba(236,72,153,.2)' : 'var(--card)';
    fBtn.style.borderColor = g==='female' ? '#ec4899' : 'var(--border)';
  }
}

// إظهار/إخفاء حقل الاسم حسب وضع (تسجيل/دخول)
// لا تستدعي auth فوراً — فقط أظهر/أخفِ الحقول المناسبة
function obSetAuthMode(mode) {
  window._obAuthMode = mode;
  const nameEl    = document.getElementById('ob-name-inp');
  const confirmEl = document.getElementById('ob-confirm-btn');
  const signupBtn = document.getElementById('ob-email-btn');
  const loginBtn  = document.getElementById('ob-login-btn');

  if (mode === 'signup') {
    // إنشاء حساب: أظهر حقل الاسم وزر التأكيد
    if (nameEl)    nameEl.style.display    = 'block';
    if (confirmEl) confirmEl.style.display = 'block';
    // تمييز الزر النشط
    if (signupBtn) { signupBtn.style.opacity = '1'; signupBtn.style.background = 'linear-gradient(135deg,var(--gl),var(--gd))'; }
    if (loginBtn)  { loginBtn.style.opacity  = '0.5'; }
  } else {
    // دخول: أخفِ حقل الاسم وأظهر زر التأكيد للدخول
    if (nameEl)    nameEl.style.display    = 'none';
    if (confirmEl) {
      confirmEl.style.display = 'block';
      confirmEl.textContent = currentLang==='en' ? '✅ Login' : currentLang==='fr' ? '✅ Connexion' : '✅ دخول';
    }
    if (signupBtn) { signupBtn.style.opacity = '0.5'; signupBtn.style.background = 'var(--card)'; }
    if (loginBtn)  { loginBtn.style.opacity = '1'; loginBtn.style.background = 'var(--gold)'; loginBtn.style.color = 'var(--night)'; }
  }
}

function obSkip() {
  obGoToStep('info');
}

// دالة قديمة للتوافق
function obChoose(val) {
  const stepFieldMap = {goal:'goal', days:'programDays'};
  // للاستخدام من info step
  S.user.goal = val;
  renderObStep();
}

function renderObStep() {
  const _isAr = (currentLang||S.lang||'ar') === 'ar';
  const _isEn = (currentLang||S.lang||'ar') === 'en';
  const _T3   = (ar,en,fr) => _isAr?ar:_isEn?en:fr;
  const step  = obCurrentStep;

  // footer visibility
  const footerEl = document.getElementById('ob-footer');
  const nextBtn  = document.getElementById('ob-next-btn');
  const skipBtn  = document.querySelector('#ob-footer button:not(#ob-next-btn)');
  if (footerEl) footerEl.style.display = (step === 'lang' || step === 'auth' || step === 'password-link' || step === 'done') ? 'none' : 'flex';
  // Hide skip button on info step (obSkip goes to info, not useful there)
  const skipBtnEl = footerEl?.querySelector('button:not(#ob-next-btn)');
  if (skipBtnEl) skipBtnEl.style.display = step === 'info' ? 'none' : '';
  if (nextBtn)  nextBtn.textContent    = step === 'info' ? _T3('🚀 ابدأ الرحلة','🚀 Start','🚀 Commencer') : _T3('التالي ←','Next →','Suivant →');

  // dots
  const visibleSteps = ['auth','info'];
  const dotsEl = document.getElementById('ob-dots');
  if (dotsEl) {
    dotsEl.innerHTML = visibleSteps.map(s => {
      const active = s === step;
      const done   = visibleSteps.indexOf(s) < visibleSteps.indexOf(step);
      return `<div style="width:${active?20:8}px;height:8px;border-radius:4px;background:${done||active?'var(--gold)':'rgba(255,255,255,.15)'};transition:all .3s;"></div>`;
    }).join('');
  }

  let html = '';

  // ── Lang ─────────────────────────────────
  if (step === 'lang') {
    const langs = [
      { code:'ar', flag:'🇩🇿', name:'العربية' },
      { code:'en', flag:'🇺🇸', name:'English'  },
      { code:'fr', flag:'🇫🇷', name:'Français' },
    ];
    html = `<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;">
      <div style="font-size:70px;margin-bottom:16px;animation:iconPulse 2s ease-in-out infinite;">⚡</div>
      <div style="font-size:30px;font-weight:900;color:var(--gold);margin-bottom:4px;">AZEM</div>
      <div style="font-size:13px;color:var(--dim);margin-bottom:36px;text-align:center;">عزم · Determination · Détermination</div>
      <div style="display:flex;flex-direction:column;gap:14px;width:100%;max-width:320px;">
        ${langs.map(l => {
          const active = (S.lang || 'ar') === l.code;
          return `<button onclick="obSelectLang('${l.code}')" style="display:flex;align-items:center;gap:16px;padding:20px 22px;border-radius:18px;background:${active?'rgba(212,168,67,.15)':'var(--card)'};border:2px solid ${active?'var(--gold)':'var(--border)'};cursor:pointer;width:100%;transition:all .2s;-webkit-appearance:none;appearance:none;">
            <span style="font-size:34px;">${l.flag}</span>
            <span style="font-size:18px;font-weight:900;color:${active?'var(--gold)':'var(--txt)'};">${l.name}</span>
            ${active ? '<span style="margin-right:auto;color:var(--gold);font-size:20px;">✓</span>' : ''}
          </button>`;
        }).join('')}
      </div>
    </div>`;

  // ── Auth ─────────────────────────────────
  } else if (step === 'auth') {
    html = `<div style="min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:32px 24px;gap:16px;">
      <div style="text-align:center;margin-bottom:8px;">
        <div style="font-size:44px;margin-bottom:12px;">🔐</div>
        <div style="font-size:22px;font-weight:900;color:var(--txt);margin-bottom:6px;">${_T3('سجّل دخولك','Sign In','Connexion')}</div>
        <div style="font-size:12px;color:var(--dim);">${_T3('لحفظ بياناتك وتزامنها على أجهزتك','Save & sync your data across devices','Sauvegarder et synchroniser vos données')}</div>
      </div>

      <!-- Google -->
      <button id="ob-google-btn" onclick="obFirebaseGoogleSignIn()" style="width:100%;padding:16px;border-radius:16px;background:rgba(66,133,244,.12);border:2px solid rgba(66,133,244,.4);color:#4285f4;font-family:'Cairo',sans-serif;font-size:15px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;-webkit-appearance:none;appearance:none;">
        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/></svg>
        ${_T3('تسجيل الدخول بـ Google','Continue with Google','Continuer avec Google')}
      </button>

      <!-- Divider -->
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="flex:1;height:1px;background:var(--border);"></div>
        <span style="font-size:11px;color:var(--dim);">${_T3('أو','or','ou')}</span>
        <div style="flex:1;height:1px;background:var(--border);"></div>
      </div>

      <!-- Email + Password -->
      <div id="ob-auth-err" style="display:none;padding:8px 12px;border-radius:10px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#f87171;font-size:12px;text-align:center;"></div>
      <input id="ob-email-inp" type="email" placeholder="${_T3('الإيميل','Email','E-mail')}"
        style="width:100%;padding:14px 16px;border-radius:14px;background:var(--card);border:1.5px solid var(--border);color:var(--txt);font-family:'Cairo',sans-serif;font-size:14px;box-sizing:border-box;outline:none;direction:ltr;text-align:left;"
        oninput="document.getElementById('ob-auth-err').style.display='none'">
      <input id="ob-pass-inp" type="password" placeholder="${_T3('كلمة المرور (6 أحرف+)','Password (6+ chars)','Mot de passe (6+ car.)')}"
        style="width:100%;padding:14px 16px;border-radius:14px;background:var(--card);border:1.5px solid var(--border);color:var(--txt);font-family:'Cairo',sans-serif;font-size:14px;box-sizing:border-box;outline:none;direction:ltr;text-align:left;"
        oninput="document.getElementById('ob-auth-err').style.display='none'">
      <!-- حقل الاسم — يظهر فقط عند إنشاء الحساب -->
      <input id="ob-name-inp" type="text" placeholder="${_T3('اسمك (للتسجيل فقط)','Your name (signup only)','Votre nom (inscription)')}"
        style="width:100%;padding:14px 16px;border-radius:14px;background:var(--card);border:1.5px solid var(--border);color:var(--txt);font-family:'Cairo',sans-serif;font-size:14px;box-sizing:border-box;outline:none;display:none;">

      <!-- Buttons -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <button id="ob-email-btn" onclick="obSetAuthMode('signup')" style="padding:14px;border-radius:14px;background:linear-gradient(135deg,var(--gl),var(--gd));color:var(--night);font-family:'Cairo',sans-serif;font-size:14px;font-weight:900;cursor:pointer;border:none;-webkit-appearance:none;appearance:none;">
          ${_T3('إنشاء حساب','Sign Up','S\'inscrire')}
        </button>
        <button id="ob-login-btn" onclick="obSetAuthMode('login')" style="padding:14px;border-radius:14px;background:var(--card);border:1.5px solid var(--border);color:var(--txt);font-family:'Cairo',sans-serif;font-size:14px;font-weight:700;cursor:pointer;-webkit-appearance:none;appearance:none;">
          ${_T3('دخول','Login','Connexion')}
        </button>
      </div>
      <!-- زر التأكيد — يظهر فقط بعد اختيار "إنشاء حساب" -->
      <button id="ob-confirm-btn" onclick="obFirebaseEmailAuth(window._obAuthMode||'signup')"
        style="display:none;width:100%;padding:15px;border-radius:14px;background:linear-gradient(135deg,var(--gl),var(--gd));color:var(--night);font-family:'Cairo',sans-serif;font-size:15px;font-weight:900;cursor:pointer;border:none;-webkit-appearance:none;appearance:none;">
        ${_T3('✅ تأكيد التسجيل','✅ Confirm Sign Up','✅ Confirmer')}
      </button>

      <!-- Skip -->
      <button onclick="obGoToStep('info')" style="width:100%;padding:12px;border-radius:14px;background:transparent;border:1px solid var(--border);color:var(--dim);font-family:'Cairo',sans-serif;font-size:13px;cursor:pointer;-webkit-appearance:none;appearance:none;">
        ${_T3('تخطي — استمر بدون حساب','Skip — continue without account','Passer — continuer sans compte')}
      </button>
    </div>`;

  // ── Password Link (بعد Google) ────────────
  } else if (step === 'password-link') {
    html = `<div style="min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:32px 24px;gap:14px;">
      <div style="text-align:center;margin-bottom:8px;">
        <div style="font-size:44px;margin-bottom:10px;">🔑</div>
        <div style="font-size:20px;font-weight:900;color:var(--txt);margin-bottom:6px;">${_T3('أضف كلمة مرور','Add a Password','Ajouter un mot de passe')}</div>
        <div style="font-size:12px;color:var(--dim);line-height:1.7;">${_T3('يمكنك الدخول بإيميلك وكلمة المرور\nحتى بدون Google','Enter with email & password\neven without Google','Connectez-vous avec email & mot de passe\nsans Google')}</div>
      </div>
      <div id="ob-link-err" style="display:none;padding:8px 12px;border-radius:10px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#f87171;font-size:12px;text-align:center;"></div>
      <input id="ob-link-pass-inp" type="password" placeholder="${_T3('كلمة المرور الجديدة','New password','Nouveau mot de passe')}"
        style="width:100%;padding:14px 16px;border-radius:14px;background:var(--card);border:1.5px solid var(--border);color:var(--txt);font-family:'Cairo',sans-serif;font-size:14px;box-sizing:border-box;outline:none;direction:ltr;text-align:left;">
      <input id="ob-link-pass2-inp" type="password" placeholder="${_T3('تأكيد كلمة المرور','Confirm password','Confirmer le mot de passe')}"
        style="width:100%;padding:14px 16px;border-radius:14px;background:var(--card);border:1.5px solid var(--border);color:var(--txt);font-family:'Cairo',sans-serif;font-size:14px;box-sizing:border-box;outline:none;direction:ltr;text-align:left;">
      <button id="ob-link-btn" onclick="obLinkPassword()" style="width:100%;padding:16px;border-radius:14px;background:linear-gradient(135deg,var(--gl),var(--gd));color:var(--night);font-family:'Cairo',sans-serif;font-size:15px;font-weight:900;cursor:pointer;border:none;-webkit-appearance:none;appearance:none;">
        ${_T3('إضافة كلمة المرور','Add Password','Ajouter le mot de passe')}
      </button>
    </div>`;

  // ── Info (الوزن + الطول + الهدف) ──────────
  } else if (step === 'info') {
    const hasAccount = !!(window._fbUid || window._fbUser);
    const goalOptions = [
      {val:'burn',    icon:'🔥', label:_T3('حرق الدهون','Burn Fat','Brûler les graisses')},
      {val:'muscle',  icon:'💪', label:_T3('بناء العضلات','Build Muscle','Musculation')},
      {val:'fitness', icon:'🏃', label:_T3('تحسين اللياقة','Improve Fitness','Améliorer la forme')},
      {val:'health',  icon:'❤️', label:_T3('الصحة العامة','General Health','Santé générale')},
    ];
    html = `<div style="min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:32px 24px 100px;gap:20px;">
      <div style="text-align:center;">
        <div style="font-size:40px;margin-bottom:10px;">📋</div>
        <div style="font-size:22px;font-weight:900;color:var(--txt);">${_T3('معلوماتك الأساسية','Your Info','Vos informations')}</div>
      </div>

      <!-- حقل الاسم — يظهر فقط للمستخدمين بدون حساب -->
      ${!hasAccount ? `
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--dim);margin-bottom:8px;">${_T3('اسمك','Your name','Votre nom')}</div>
        <input id="ob-name-inp2" type="text" value="${S.user.name||''}" placeholder="${_T3('مثال: أحمد','e.g. Ahmed','ex: Ahmed')}"
          style="width:100%;padding:14px 16px;border-radius:14px;background:var(--card);border:1.5px solid var(--border);color:var(--txt);font-family:'Cairo',sans-serif;font-size:15px;box-sizing:border-box;outline:none;text-align:center;">
      </div>` : ''}

      <!-- العمر والجنس -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--dim);margin-bottom:8px;text-align:center;">${_T3('العمر','Age','Âge')}</div>
          <input id="ob-age-inp" type="number" value="${S.user.age||''}" placeholder="25" min="10" max="99"
            style="width:100%;padding:16px;border-radius:14px;background:var(--card);border:2px solid rgba(99,102,241,.5);color:var(--txt);font-family:'Cairo',sans-serif;font-size:20px;font-weight:700;box-sizing:border-box;outline:none;text-align:center;">
        </div>
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--dim);margin-bottom:8px;text-align:center;">${_T3('الجنس','Gender','Genre')}</div>
          <div style="display:flex;gap:8px;height:56px;">
            <button id="ob-gender-male" onclick="obSetGender('male')"
              style="flex:1;border-radius:14px;background:${(S.user.gender||'male')==='male'?'rgba(99,102,241,.2)':'var(--card)'};border:2px solid ${(S.user.gender||'male')==='male'?'#6366f1':'var(--border)'};color:var(--txt);font-family:'Cairo',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;-webkit-appearance:none;appearance:none;">
              👨 ${_T3('ذكر','Male','Homme')}
            </button>
            <button id="ob-gender-female" onclick="obSetGender('female')"
              style="flex:1;border-radius:14px;background:${S.user.gender==='female'?'rgba(236,72,153,.2)':'var(--card)'};border:2px solid ${S.user.gender==='female'?'#ec4899':'var(--border)'};color:var(--txt);font-family:'Cairo',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;-webkit-appearance:none;appearance:none;">
              👩 ${_T3('أنثى','Female','Femme')}
            </button>
          </div>
        </div>
      </div>

      <div>
        <div style="font-size:13px;font-weight:700;color:var(--dim);margin-bottom:8px;">${_T3('رقم الهاتف (اختياري)','Phone number (optional)','Numéro de téléphone (optionnel)')}</div>
        <input id="ob-phone-inp" type="tel" value="${S.user.phone||''}" placeholder="${_T3('+213xxxxxxxxx','+213xxxxxxxxx','+213xxxxxxxxx')}"
          style="width:100%;padding:14px 16px;border-radius:14px;background:var(--card);border:1.5px solid var(--border);color:var(--txt);font-family:'Cairo',sans-serif;font-size:15px;box-sizing:border-box;outline:none;text-align:center;direction:ltr;">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--dim);margin-bottom:8px;text-align:center;">${_T3('الوزن (كغ)','Weight (kg)','Poids (kg)')}</div>
          <input id="ob-weight-inp" type="number" value="${S.user.weight||''}" placeholder="74"
            style="width:100%;padding:16px;border-radius:14px;background:var(--card);border:2px solid var(--gold);color:var(--txt);font-family:'Cairo',sans-serif;font-size:20px;font-weight:700;box-sizing:border-box;outline:none;text-align:center;">
        </div>
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--dim);margin-bottom:8px;text-align:center;">${_T3('الطول (سم)','Height (cm)','Taille (cm)')}</div>
          <input id="ob-height-inp" type="number" value="${S.user.height||''}" placeholder="175"
            style="width:100%;padding:16px;border-radius:14px;background:var(--card);border:2px solid var(--gold);color:var(--txt);font-family:'Cairo',sans-serif;font-size:20px;font-weight:700;box-sizing:border-box;outline:none;text-align:center;">
        </div>
      </div>

      <div>
        <div style="font-size:13px;font-weight:700;color:var(--dim);margin-bottom:12px;text-align:center;">${_T3('ما هدفك؟','Your goal?','Votre objectif?')}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="ob-goal-grid">
          ${goalOptions.map(o => `
            <button onclick="S.user.goal='${o.val}';document.querySelectorAll('#ob-goal-grid button').forEach(b=>b.style.borderColor='var(--border)');this.style.borderColor='var(--gold)';this.style.background='rgba(212,168,67,.15)';"
              style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:18px 12px;border-radius:16px;background:${S.user.goal===o.val?'rgba(212,168,67,.15)':'var(--card)'};border:2px solid ${S.user.goal===o.val?'var(--gold)':'var(--border)'};cursor:pointer;transition:all .2s;-webkit-appearance:none;appearance:none;">
              <span style="font-size:30px;">${o.icon}</span>
              <span style="font-size:12px;font-weight:700;color:var(--txt);">${o.label}</span>
            </button>`).join('')}
        </div>
      </div>
    </div>`;
    if (footerEl) footerEl.style.display = 'flex';

  // ── Privacy Policy ──────────────────────
  } else if (step === 'privacy') {
    html = `<div style="min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:32px 24px 100px;gap:18px;">
      <div style="text-align:center;">
        <div style="font-size:44px;margin-bottom:10px;">🔒</div>
        <div style="font-size:20px;font-weight:900;color:var(--txt);margin-bottom:6px;">${_T3('سياسة الخصوصية','Privacy Policy','Politique de confidentialité')}</div>
        <div style="font-size:12px;color:var(--dim);line-height:1.8;">${_T3('نحن نهتم بخصوصيتك. اقرأ ما نجمعه.','We care about your privacy. Read what we collect.','Nous respectons votre vie privée.')}</div>
      </div>
      <div style="background:var(--card);border-radius:16px;padding:16px;border:1px solid var(--border);font-size:12px;color:var(--dim);line-height:1.9;max-height:280px;overflow-y:auto;">
        <div style="font-weight:800;color:var(--txt);margin-bottom:8px;">📋 ${_T3('ما نجمعه','What we collect','Ce que nous collectons')}</div>
        • ${_T3('الاسم والجنس والعمر والطول والوزن','Name, gender, age, height, weight','Nom, genre, âge, taille, poids')}<br>
        • ${_T3('رقم الهاتف (اختياري)','Phone number (optional)','Numéro de téléphone (optionnel)')}<br>
        • ${_T3('بيانات التدريب والتقدم','Training and progress data','Données d\'entraînement')}<br>
        • ${_T3('عنوان IP والموقع الجغرافي التقريبي','IP address and approximate location','Adresse IP et localisation approximative')}<br><br>
        <div style="font-weight:800;color:var(--txt);margin-bottom:8px;">🎯 ${_T3('لماذا نجمعها','Why we collect it','Pourquoi nous les collectons')}</div>
        • ${_T3('لتخصيص برنامجك وحساب السعرات','To personalize your program and calculate calories','Pour personnaliser votre programme')}<br>
        • ${_T3('لتحسين التطبيق وتطويره','To improve and develop the app','Pour améliorer l\'application')}<br><br>
        <div style="font-weight:800;color:var(--txt);margin-bottom:8px;">🔐 ${_T3('حقوقك','Your rights','Vos droits')}</div>
        • ${_T3('يمكنك حذف بياناتك في أي وقت من الإعدادات','You can delete your data anytime from Settings','Vous pouvez supprimer vos données depuis les Paramètres')}<br>
        • ${_T3('بياناتك لا تُباع لأطراف ثالثة','Your data is never sold to third parties','Vos données ne sont jamais vendues')}<br>
        • ${_T3('للتواصل: azem.chihani@gmail.com','Contact: azem.chihani@gmail.com','Contact: azem.chihani@gmail.com')}<br>
      </div>
      <button onclick="window._privacyAccepted=true;obNext();"
        style="width:100%;padding:16px;border-radius:14px;background:linear-gradient(135deg,var(--gl),var(--gd));color:var(--night);font-family:'Cairo',sans-serif;font-size:15px;font-weight:900;cursor:pointer;border:none;-webkit-appearance:none;appearance:none;">
        ✅ ${_T3('أوافق وأكمل','I Agree & Continue','J\'accepte et continue')}
      </button>
      <button onclick="window._privacyAccepted=false;obNext();"
        style="width:100%;padding:14px;border-radius:14px;background:transparent;border:1px solid var(--border);color:var(--dim);font-family:'Cairo',sans-serif;font-size:13px;cursor:pointer;-webkit-appearance:none;appearance:none;">
        ${_T3('أرفض (بعض الميزات قد تتأثر)','Decline (some features may be limited)','Refuser (certaines fonctionnalités limitées)')}
      </button>
    </div>`;
  }

  // ✅ كتابة المحتوى في DOM
  const stepsEl = document.getElementById('ob-steps');
  if (stepsEl) stepsEl.innerHTML = html;
}

// دالة للتوافق مع الكود القديم
function obInstallNow() {}
function obSaveApiKey() {
  const val = (document.getElementById('ob-apikey-inp')?.value||'').trim();
  if (val.startsWith('gsk_')) { S.apiKey = val; saveState(); showMiniToast('✅ تم حفظ المفتاح'); }
}
function obRequestNotif() { requestNotifPerm(); }
function obRefreshInstallStep() {}
let obStep = 0; // للتوافق

