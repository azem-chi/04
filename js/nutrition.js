/* ══════════════════════════════════════════
   AZEM — NUTRITION DIARY MODULE (v7)
   يوميات التغذية بقاعدة بيانات أطعمة عربية/جزائرية
══════════════════════════════════════════ */

/* ─── قاعدة بيانات الأطعمة ─── */
const FOODS_DB = [
  // p=protein(g), c=carbs(g), f=fat(g) per unit
  // ── بروتين ──
  { id:'egg',       name:'بيضة مسلوقة',         icon:'🥚', cal:78,  unit:'حبة',          cat:'بروتين', p:6,  c:0.6, f:5   },
  { id:'egg_fr',    name:'بيضة مقلية',           icon:'🍳', cal:90,  unit:'حبة',          cat:'بروتين', p:6,  c:0.4, f:7   },
  { id:'chicken',   name:'دجاج مشوي',            icon:'🍗', cal:165, unit:'100 غ',        cat:'بروتين', p:31, c:0,   f:3.6 },
  { id:'tuna',      name:'تونة (علبة)',           icon:'🐟', cal:130, unit:'علبة',         cat:'بروتين', p:28, c:0,   f:1   },
  { id:'beef',      name:'لحم بقري مشوي',        icon:'🥩', cal:250, unit:'100 غ',        cat:'بروتين', p:26, c:0,   f:15  },
  { id:'fish',      name:'سمك مشوي',             icon:'🐠', cal:200, unit:'100 غ',        cat:'بروتين', p:24, c:0,   f:8   },
  { id:'kafta',     name:'كفتة مشوية',            icon:'🥙', cal:240, unit:'2 قطعة',      cat:'بروتين', p:20, c:2,   f:16  },
  { id:'lentils',   name:'عدس مطبوخ',            icon:'🫘', cal:140, unit:'كوب',          cat:'بروتين', p:9,  c:24,  f:0.4 },
  { id:'chickpea',  name:'حمص مطبوخ',            icon:'🫘', cal:160, unit:'كوب',          cat:'بروتين', p:8,  c:28,  f:2   },
  // ── نشويات ──
  { id:'rice',      name:'أرز مطبوخ',            icon:'🍚', cal:200, unit:'كوب',          cat:'نشويات', p:4,  c:44,  f:0.4 },
  { id:'bread_ar',  name:'خبز عربي',             icon:'🫓', cal:170, unit:'رغيف',         cat:'نشويات', p:6,  c:33,  f:1.5 },
  { id:'bread_br',  name:'خبز أسمر (شريحة)',     icon:'🍞', cal:70,  unit:'شريحة',        cat:'نشويات', p:3,  c:12,  f:1   },
  { id:'pasta',     name:'مكرونة مطبوخة',        icon:'🍝', cal:220, unit:'كوب',          cat:'نشويات', p:8,  c:43,  f:1.3 },
  { id:'couscous',  name:'كسكوس مطبوخ',          icon:'🥣', cal:180, unit:'كوب',          cat:'نشويات', p:6,  c:36,  f:0.3 },
  { id:'potato',    name:'بطاطا مسلوقة',         icon:'🥔', cal:150, unit:'حبة متوسطة',  cat:'نشويات', p:3,  c:34,  f:0.2 },
  { id:'oats',      name:'شوفان بالحليب',        icon:'🥣', cal:300, unit:'كوب',          cat:'نشويات', p:10, c:50,  f:6   },
  { id:'corn',      name:'ذرة مسلوقة',           icon:'🌽', cal:130, unit:'كوز',          cat:'نشويات', p:4,  c:28,  f:1.5 },
  // ── فاكهة ──
  { id:'banana',    name:'موزة',                 icon:'🍌', cal:105, unit:'حبة',          cat:'فاكهة',  p:1.3,c:27,  f:0.4 },
  { id:'apple',     name:'تفاحة',                icon:'🍎', cal:80,  unit:'حبة',          cat:'فاكهة',  p:0.4,c:21,  f:0.3 },
  { id:'orange',    name:'برتقالة',              icon:'🍊', cal:60,  unit:'حبة',          cat:'فاكهة',  p:1.2,c:15,  f:0.2 },
  { id:'dates',     name:'تمر',                  icon:'🫘', cal:60,  unit:'3 حبات',       cat:'فاكهة',  p:0.4,c:16,  f:0.1 },
  { id:'grape',     name:'عنب',                  icon:'🍇', cal:90,  unit:'عنقود صغير',  cat:'فاكهة',  p:0.9,c:23,  f:0.2 },
  { id:'water_m',   name:'بطيخ',                 icon:'🍉', cal:85,  unit:'شريحة',        cat:'فاكهة',  p:1.7,c:21,  f:0.4 },
  // ── ألبان ──
  { id:'milk',      name:'حليب',                 icon:'🥛', cal:150, unit:'كوب',          cat:'ألبان',  p:8,  c:12,  f:8   },
  { id:'yogurt',    name:'لبن زبادي',            icon:'🍶', cal:100, unit:'كوب',          cat:'ألبان',  p:10, c:7,   f:2   },
  { id:'cheese',    name:'جبنة (شريحة)',          icon:'🧀', cal:80,  unit:'شريحة',        cat:'ألبان',  p:5,  c:0.4, f:6   },
  { id:'labneh',    name:'لبنة',                 icon:'🥄', cal:150, unit:'2 ملعقة',      cat:'ألبان',  p:6,  c:4,   f:10  },
  // ── دهون ──
  { id:'olive_oil', name:'زيت زيتون',            icon:'🫙', cal:120, unit:'ملعقة كبيرة', cat:'دهون',   p:0,  c:0,   f:14  },
  { id:'nuts',      name:'مكسرات مشكلة',         icon:'🥜', cal:170, unit:'حفنة',         cat:'دهون',   p:5,  c:7,   f:15  },
  { id:'almond',    name:'لوز',                  icon:'🌰', cal:160, unit:'حفنة',         cat:'دهون',   p:6,  c:6,   f:14  },
  { id:'avocado',   name:'أفوكادو',              icon:'🥑', cal:240, unit:'حبة متوسطة',  cat:'دهون',   p:3,  c:13,  f:22  },
  // ── خضروات ──
  { id:'salad',     name:'سلطة خضراء',           icon:'🥗', cal:30,  unit:'طبق',          cat:'خضروات', p:2,  c:5,   f:0.5 },
  { id:'tomato',    name:'طماطم',                icon:'🍅', cal:35,  unit:'2 حبات',       cat:'خضروات', p:1.6,c:7,   f:0.4 },
  { id:'cucumber',  name:'خيار',                 icon:'🥒', cal:25,  unit:'حبة',          cat:'خضروات', p:1,  c:5,   f:0.2 },
  { id:'soup',      name:'شوربة خضار',           icon:'🍲', cal:80,  unit:'طبق',          cat:'خضروات', p:3,  c:14,  f:1   },
  { id:'chorba',    name:'شوربة / حريرة',        icon:'🍵', cal:120, unit:'طبق',          cat:'خضروات', p:7,  c:18,  f:2   },
  // ── مشروبات ──
  { id:'water',     name:'ماء',                  icon:'💧', cal:0,   unit:'كوب',          cat:'مشروبات',p:0,  c:0,   f:0   },
  { id:'coffee',    name:'قهوة (بدون سكر)',      icon:'☕', cal:5,   unit:'كوب',          cat:'مشروبات',p:0.3,c:0,   f:0   },
  { id:'tea',       name:'شاي (بدون سكر)',       icon:'🍵', cal:2,   unit:'كوب',          cat:'مشروبات',p:0,  c:0.5, f:0   },
  { id:'juice',     name:'عصير برتقال طبيعي',   icon:'🧃', cal:120, unit:'كوب',          cat:'مشروبات',p:2,  c:26,  f:0.5 },
  { id:'soda',      name:'مشروب غازي',           icon:'🥤', cal:140, unit:'علبة',         cat:'مشروبات',p:0,  c:39,  f:0   },
  // ── وجبات جاهزة ──
  { id:'ch_plate',  name:'وجبة دجاج (أرز+دجاج)',icon:'🍽️', cal:500, unit:'طبق',          cat:'وجبات',  p:35, c:55,  f:10  },
  { id:'cous_plt',  name:'كسكسي بالدجاج',        icon:'🍽️', cal:450, unit:'طبق',          cat:'وجبات',  p:30, c:50,  f:8   },
  { id:'shawarma',  name:'شاورما دجاج',           icon:'🌯', cal:400, unit:'حبة',          cat:'وجبات',  p:25, c:40,  f:14  },
  { id:'burger',    name:'برغر',                 icon:'🍔', cal:500, unit:'حبة',          cat:'وجبات',  p:25, c:40,  f:25  },
  { id:'pizza',     name:'بيتزا (شريحة)',         icon:'🍕', cal:300, unit:'شريحة',        cat:'وجبات',  p:12, c:35,  f:12  },
  { id:'sandwich',  name:'ساندويتش دجاج',        icon:'🥪', cal:350, unit:'حبة',          cat:'وجبات',  p:22, c:38,  f:10  },
  { id:'tagine',    name:'طاجين لحم',            icon:'🍲', cal:380, unit:'طبق',          cat:'وجبات',  p:28, c:30,  f:15  },
  // ── حلويات ──
  { id:'choco',     name:'شوكولاتة',             icon:'🍫', cal:150, unit:'30 غ',         cat:'حلويات', p:2,  c:18,  f:9   },
  { id:'cake',      name:'كيك (شريحة)',           icon:'🎂', cal:350, unit:'شريحة',        cat:'حلويات', p:4,  c:55,  f:14  },
  { id:'icecream',  name:'آيس كريم',             icon:'🍦', cal:200, unit:'كوب',          cat:'حلويات', p:3,  c:32,  f:8   },
  { id:'baklava',   name:'بقلاوة',               icon:'🍯', cal:150, unit:'قطعة',         cat:'حلويات', p:2,  c:20,  f:8   },
  { id:'makroud',   name:'مقروض',                icon:'🧆', cal:130, unit:'حبة',          cat:'حلويات', p:2,  c:22,  f:5   },
  { id:'honey_sp',  name:'عسل',                 icon:'🍯', cal:60,  unit:'ملعقة',        cat:'حلويات', p:0,  c:17,  f:0   },
  // ── مكملات ──
  { id:'protein_s', name:'شيك بروتين',           icon:'💪', cal:150, unit:'كوب',          cat:'مكملات', p:25, c:8,   f:2   },
  { id:'protbar',   name:'قضيب بروتين',          icon:'🍫', cal:220, unit:'قضيب',         cat:'مكملات', p:20, c:24,  f:7   },
];

const NUT_CATS = ['الكل','بروتين','نشويات','فاكهة','ألبان','دهون','خضروات','مشروبات','وجبات','حلويات','مكملات'];
let _nutActiveCat = 'الكل';
let _nutSearch = '';
let _pendingFood = null; // الطعام المحدد قيد الإضافة
let _pendingQty = 1;

/* ─── حساب الهدف اليومي + الماكرو ─── */

// حساب الماكرو الفعلي من قائمة الوجبات
function calcMacroFromEntries(entries) {
  return entries.reduce((acc, e) => {
    const food = FOODS_DB.find(f => f.id === e.id);
    const qty = e.qty || 1;
    if (food) {
      acc.p += (food.p || 0) * qty;
      acc.c += (food.c || 0) * qty;
      acc.f += (food.f || 0) * qty;
    }
    return acc;
  }, { p: 0, c: 0, f: 0 });
}

// هدف الماكرو اليومي
function calcMacroTargets() {
  const kg   = parseFloat(S.user?.weight) || 70;
  const goal = S.user?.goal || 'burn';
  const target = calcDailyCalTarget();
  const p = Math.round(kg * (goal === 'muscle' ? 2.0 : 1.6));
  const f = Math.round(kg * 0.8);
  const c = Math.max(50, Math.round((target - p * 4 - f * 9) / 4));
  return { p, c, f, cal: target };
}

function calcDailyCalTarget() {
  const kg     = parseFloat(S.user?.weight) || 70;
  const cm     = parseFloat(S.user?.height) || 170;
  const age    = parseFloat(S.user?.age)    || 25;
  const gender = S.user?.gender || 'male';
  const goal   = S.user?.goal   || 'burn';
  const bmr = gender === 'female'
    ? Math.round(10*kg + 6.25*cm - 5*age - 161)
    : Math.round(10*kg + 6.25*cm - 5*age + 5);
  const tdee = Math.round(bmr * 1.375);
  if (goal === 'burn')   return Math.round(tdee - 300);
  if (goal === 'muscle') return Math.round(tdee + 300);
  return tdee;
}

/* ─── مفتاح اليوم ─── */
function todayKey() {
  return new Date().toISOString().split('T')[0];
}

/* ─── الإجمالي اليومي ─── */
function todayNutTotal() {
  const entries = (S.nutritionLog || {})[todayKey()]?.entries || [];
  return entries.reduce((s, e) => s + (e.totalCal || 0), 0);
}

/* ═══════════════════════════════════════
   RENDER DIARY — يُعيد رسم قسم التغذية
═══════════════════════════════════════ */
function renderNutritionDiary() {
  const el = document.getElementById('nutrition-plan');
  if (!el) return;

  const targets  = calcMacroTargets();
  const total    = todayNutTotal();
  const pct      = Math.min(100, Math.round((total / targets.cal) * 100));
  const entries  = (S.nutritionLog || {})[todayKey()]?.entries || [];
  const macro    = calcMacroFromEntries(entries);

  // ── تتبع الماء ──
  const waterToday = (S.nutritionLog || {})[todayKey()]?.water || 0;
  const waterTarget = Math.round((parseFloat(S.user?.weight)||70) * 0.035 * 33.8 / 8); // أكواب
  const waterPct = Math.min(100, Math.round((waterToday / waterTarget) * 100));

  const barColor = pct > 110 ? '#ef4444' : pct >= 80 ? '#D4A843' : '#22c55e';

  el.innerHTML = `
    <!-- ── تبويبات السعرات / الماكرو / الماء ── -->
    <div style="display:flex;gap:6px;margin-bottom:14px;" id="nut-tab-bar">
      <button onclick="nutSwitchView('cal')" id="nut-tab-cal"
        style="flex:1;padding:8px 4px;border-radius:10px;border:1.5px solid var(--gold);background:rgba(212,168,67,.15);color:var(--gold);font-family:'Cairo',sans-serif;font-size:12px;font-weight:800;cursor:pointer;">
        🔥 السعرات</button>
      <button onclick="nutSwitchView('macro')" id="nut-tab-macro"
        style="flex:1;padding:8px 4px;border-radius:10px;border:1.5px solid var(--border);background:transparent;color:var(--dim);font-family:'Cairo',sans-serif;font-size:12px;font-weight:700;cursor:pointer;">
        💪 الماكرو</button>
      <button onclick="nutSwitchView('water')" id="nut-tab-water"
        style="flex:1;padding:8px 4px;border-radius:10px;border:1.5px solid var(--border);background:transparent;color:var(--dim);font-family:'Cairo',sans-serif;font-size:12px;font-weight:700;cursor:pointer;">
        💧 الماء</button>
    </div>

    <!-- ── لوحة السعرات ── -->
    <div id="nut-view-cal">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:6px;">
        <div style="font-size:12px;color:var(--dim);">
          الهدف: <strong style="color:var(--gold);">${targets.cal.toLocaleString('ar')} كال</strong> ·
          مُسجَّل: <strong style="color:${barColor};">${total.toLocaleString('ar')} كال</strong>
        </div>
        <button onclick="openNutritionModal()" style="padding:6px 12px;border-radius:10px;background:linear-gradient(135deg,var(--gl),var(--gd));border:none;color:var(--night);font-family:'Cairo',sans-serif;font-size:12px;font-weight:900;cursor:pointer;">+ إضافة</button>
      </div>
      <div style="background:rgba(255,255,255,0.07);border-radius:8px;height:10px;overflow:hidden;margin-bottom:6px;">
        <div style="width:${pct}%;height:100%;background:${barColor};border-radius:8px;transition:width .6s ease;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--dim);margin-bottom:14px;">
        <span>${pct}% من هدفك</span>
        <span>${Math.max(0,targets.cal-total).toLocaleString('ar')} كال متبقية</span>
      </div>
      ${entries.length === 0 ? `
        <div style="text-align:center;padding:20px 0;color:var(--dim);">
          <div style="font-size:28px;margin-bottom:8px;">🍽️</div>
          <div style="font-size:13px;">لا توجد وجبات مُسجَّلة اليوم</div>
        </div>` : `
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
          ${entries.map((e,idx) => `
            <div style="display:flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:8px 10px;">
              <span style="font-size:22px;flex-shrink:0;">${_escHtml(e.icon)||'🍽️'}</span>
              <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:700;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${_escHtml(e.name)}</div>
                <div style="font-size:10px;color:var(--dim);">${e.qty} ${_escHtml(e.unit)||''}
                  ${e.totalP ? `· 💪${Math.round(e.totalP)}غ` : ''}
                  ${e.totalC ? `· 🍚${Math.round(e.totalC)}غ` : ''}
                  ${e.totalF ? `· 🫙${Math.round(e.totalF)}غ` : ''}
                </div>
              </div>
              <div style="font-size:13px;font-weight:800;color:var(--gold);flex-shrink:0;">${e.totalCal}<span style="font-size:9px;color:var(--dim);"> كال</span></div>
              <button onclick="removeNutEntry(${idx})" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#ef4444;border-radius:8px;padding:4px 8px;font-size:12px;cursor:pointer;">×</button>
            </div>`).join('')}
        </div>`}
      <button onclick="openNutritionModal()" style="width:100%;padding:11px;border-radius:12px;background:rgba(212,168,67,.08);border:1.5px dashed rgba(212,168,67,.3);color:var(--gold);font-family:'Cairo',sans-serif;font-size:13px;font-weight:700;cursor:pointer;">
        ＋ إضافة طعام أو وجبة
      </button>
    </div>

    <!-- ── لوحة الماكرو ── -->
    <div id="nut-view-macro" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px;">
        ${[
          {lbl:'🥩 بروتين', got:Math.round(macro.p), target:targets.p, color:'#f97316', unit:'غ'},
          {lbl:'🍚 كارب',   got:Math.round(macro.c), target:targets.c, color:'#38bdf8', unit:'غ'},
          {lbl:'🫙 دهون',   got:Math.round(macro.f), target:targets.f, color:'#a78bfa', unit:'غ'},
        ].map(m => {
          const mpct = Math.min(100, Math.round((m.got/m.target)*100));
          const mcolor = mpct>=90?'#22c55e':mpct>=60?m.color:'#ef4444';
          return `<div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:12px 8px;text-align:center;">
            <div style="font-size:11px;color:var(--dim);margin-bottom:6px;">${m.lbl}</div>
            <div style="font-size:18px;font-weight:900;color:${mcolor};">${m.got}<span style="font-size:10px;color:var(--dim);font-weight:400;"> ${m.unit}</span></div>
            <div style="font-size:10px;color:var(--dim);margin-top:2px;">/ ${m.target}${m.unit}</div>
            <div style="height:4px;background:rgba(255,255,255,.07);border-radius:2px;margin-top:6px;overflow:hidden;">
              <div style="height:100%;width:${mpct}%;background:${mcolor};border-radius:2px;transition:width .5s;"></div>
            </div>
          </div>`;
        }).join('')}
      </div>
      ${macro.p > 0 || macro.c > 0 || macro.f > 0 ? `
        <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;">
          <div style="font-size:11px;color:var(--dim);margin-bottom:8px;">توزيع الطاقة</div>
          <div style="display:flex;height:12px;border-radius:6px;overflow:hidden;gap:2px;">
            ${(()=>{
              const total3 = macro.p*4 + macro.c*4 + macro.f*9 || 1;
              const pp = Math.round(macro.p*4/total3*100);
              const cp = Math.round(macro.c*4/total3*100);
              const fp = 100-pp-cp;
              return `<div style="flex:${pp};background:#f97316;border-radius:4px;" title="بروتين ${pp}%"></div>
                      <div style="flex:${cp};background:#38bdf8;border-radius:4px;" title="كارب ${cp}%"></div>
                      <div style="flex:${fp};background:#a78bfa;border-radius:4px;" title="دهون ${fp}%"></div>`;
            })()}
          </div>
          <div style="display:flex;gap:12px;margin-top:8px;font-size:10px;color:var(--dim);">
            <span><span style="color:#f97316;">●</span> بروتين</span>
            <span><span style="color:#38bdf8;">●</span> كارب</span>
            <span><span style="color:#a78bfa;">●</span> دهون</span>
          </div>
        </div>` : `
        <div style="text-align:center;padding:20px;color:var(--dim);font-size:13px;">سجّل وجباتك لرؤية توزيع الماكرو</div>`}
    </div>

    <!-- ── لوحة الماء ── -->
    <div id="nut-view-water" style="display:none;">
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:48px;margin-bottom:8px;">💧</div>
        <div style="font-size:28px;font-weight:900;color:#38bdf8;">${waterToday} <span style="font-size:14px;font-weight:400;color:var(--dim);">/ ${waterTarget} كوب</span></div>
        <div style="font-size:12px;color:var(--dim);margin-top:4px;">${waterPct}% من هدفك اليومي</div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-bottom:16px;">
        ${Array.from({length: waterTarget}, (_, i) => `
          <div style="width:28px;height:28px;border-radius:50%;background:${i < waterToday ? '#38bdf8' : 'rgba(56,189,248,.12)'};border:1.5px solid ${i < waterToday ? '#38bdf8' : 'rgba(56,189,248,.2)'};display:flex;align-items:center;justify-content:center;font-size:12px;transition:all .3s;">
            ${i < waterToday ? '💧' : ''}</div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center;">
        <button onclick="addWater(1)" style="flex:1;padding:12px;border-radius:14px;background:rgba(56,189,248,.15);border:1.5px solid rgba(56,189,248,.3);color:#38bdf8;font-family:'Cairo',sans-serif;font-size:14px;font-weight:800;cursor:pointer;">
          + كوب 💧</button>
        <button onclick="addWater(-1)" style="padding:12px 16px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid var(--border);color:var(--dim);font-family:'Cairo',sans-serif;font-size:14px;cursor:pointer;">−</button>
      </div>
      <div style="text-align:center;font-size:11px;color:var(--dim);margin-top:10px;">
        هدفك: ${((parseFloat(S.user?.weight)||70) * 0.035).toFixed(1)} لتر يومياً
        ${(S.completedDays||[]).includes(S.currentDay) ? '(+ 0.5 لتر يوم تمرين 🔥)' : ''}
      </div>
    </div>
  `;
}

// تبديل لوحات التغذية
function nutSwitchView(view) {
  ['cal','macro','water'].forEach(v => {
    const panel = document.getElementById('nut-view-' + v);
    const tab   = document.getElementById('nut-tab-' + v);
    if (!panel || !tab) return;
    const active = v === view;
    panel.style.display = active ? 'block' : 'none';
    tab.style.borderColor    = active ? 'var(--gold)' : 'var(--border)';
    tab.style.background     = active ? 'rgba(212,168,67,.15)' : 'transparent';
    tab.style.color          = active ? 'var(--gold)' : 'var(--dim)';
  });
}

// إضافة / حذف كوب ماء
function addWater(delta) {
  const dateKey = todayKey();
  if (!S.nutritionLog) S.nutritionLog = {};
  if (!S.nutritionLog[dateKey]) S.nutritionLog[dateKey] = { entries: [] };
  const current = S.nutritionLog[dateKey].water || 0;
  S.nutritionLog[dateKey].water = Math.max(0, current + delta);
  saveState();
  renderNutritionDiary();
  // انتقل لتبويب الماء بعد الإضافة
  setTimeout(() => nutSwitchView('water'), 50);
  if (delta > 0) {
    try { microCelebrate('water_cup'); } catch(e) { showMiniToast('💧 +كوب ماء!'); }
  }
}

/* ═══════════════════════════════════════
   MODAL — فاتح منتقي الطعام
═══════════════════════════════════════ */
function openNutritionModal() {
  _nutActiveCat = 'الكل';
  _nutSearch = '';
  document.getElementById('nut-modal').style.display = 'flex';
  document.getElementById('nut-search-inp').value = '';
  renderNutCategoryTabs();
  renderNutFoodList();
  setTimeout(() => document.getElementById('nut-search-inp').focus(), 300);
}

function closeNutritionModal() {
  document.getElementById('nut-modal').style.display = 'none';
  _pendingFood = null;
  document.getElementById('nut-qty-panel').style.display = 'none';
}

function renderNutCategoryTabs() {
  const el = document.getElementById('nut-cat-tabs');
  if (!el) return;
  el.innerHTML = NUT_CATS.map(cat => `
    <button class="nut-cat-tab ${_nutActiveCat === cat ? 'active' : ''}"
      onclick="nutSetCat('${cat}')">${cat}</button>
  `).join('');
}

function nutSetCat(cat) {
  _nutActiveCat = cat;
  renderNutCategoryTabs();
  renderNutFoodList();
}

function renderNutFoodList() {
  const el = document.getElementById('nut-food-list');
  if (!el) return;

  let filtered = FOODS_DB;
  if (_nutActiveCat !== 'الكل') filtered = filtered.filter(f => f.cat === _nutActiveCat);
  if (_nutSearch) {
    const q = _nutSearch.toLowerCase();
    filtered = filtered.filter(f => f.name.includes(q) || f.cat.includes(q));
  }

  if (filtered.length === 0) {
    el.innerHTML = `<div style="text-align:center;padding:32px;color:var(--dim);font-size:13px;">
      <div style="font-size:28px;margin-bottom:8px;">🔍</div>
      لا توجد نتائج — جرب إضافة وجبة مخصصة
    </div>`;
    return;
  }

  el.innerHTML = filtered.map(f => `
    <button class="nut-food-item" onclick="nutSelectFood('${f.id}')">
      <span class="nut-food-icon">${f.icon}</span>
      <div class="nut-food-info">
        <div class="nut-food-name">${f.name}</div>
        <div class="nut-food-unit">لكل ${f.unit}</div>
      </div>
      <div class="nut-food-cal">${f.cal} <span style="font-size:10px;">كال</span></div>
    </button>
  `).join('');
}

function nutSelectFood(id) {
  const food = FOODS_DB.find(f => f.id === id);
  if (!food) return;
  _pendingFood = food;
  _pendingQty = 1;
  showNutQtyPanel();
}

function showNutQtyPanel() {
  if (!_pendingFood) return;
  const panel = document.getElementById('nut-qty-panel');
  panel.style.display = 'flex';
  updateQtyPanel();
}

function updateQtyPanel() {
  if (!_pendingFood) return;
  document.getElementById('qty-food-icon').textContent = _pendingFood.icon;
  document.getElementById('qty-food-name').textContent = _pendingFood.name;
  document.getElementById('qty-food-unit').textContent = `لكل ${_pendingFood.unit}`;
  document.getElementById('qty-num').textContent = _pendingQty;
  document.getElementById('qty-total-cal').textContent = Math.round(_pendingFood.cal * _pendingQty);
}

function nutAdjQty(delta) {
  _pendingQty = Math.max(0.5, _pendingQty + delta);
  // Round to 0.5 steps
  _pendingQty = Math.round(_pendingQty * 2) / 2;
  updateQtyPanel();
}

function confirmNutAdd() {
  if (!_pendingFood) return;
  const dateKey = todayKey();
  if (!S.nutritionLog) S.nutritionLog = {};
  if (!S.nutritionLog[dateKey]) S.nutritionLog[dateKey] = { entries: [] };

  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

  S.nutritionLog[dateKey].entries.push({
    id:       _pendingFood.id,
    name:     _pendingFood.name,
    icon:     _pendingFood.icon,
    cal:      _pendingFood.cal,
    unit:     _pendingFood.unit,
    qty:      _pendingQty,
    totalCal: Math.round(_pendingFood.cal * _pendingQty),
    totalP:   Math.round((_pendingFood.p || 0) * _pendingQty * 10) / 10,
    totalC:   Math.round((_pendingFood.c || 0) * _pendingQty * 10) / 10,
    totalF:   Math.round((_pendingFood.f || 0) * _pendingQty * 10) / 10,
    time:     timeStr,
    ts:       Date.now()
  });

  saveState();
  renderNutritionDiary();
  closeNutritionModal();
  // تحديث الرسم البياني إذا كان مفتوحاً
  if (typeof renderTrendChart === 'function') {
    try { renderTrendChart(14); } catch(e) {}
  }
  showMiniToast(`✅ ${_pendingFood.icon} ${_pendingFood.name} — ${Math.round(_pendingFood.cal * _pendingQty)} كال`);
  _pendingFood = null;
  _pendingQty = 1;
}

/* ─── إضافة وجبة مخصصة ─── */
function nutAddCustom() {
  const name = document.getElementById('nut-custom-name').value.trim();
  const cal  = parseInt(document.getElementById('nut-custom-cal').value) || 0;
  if (!name || cal <= 0) {
    showMiniToast('⚠️ أدخل اسم الوجبة والسعرات');
    return;
  }
  // FIX: حد أقصى معقول للسعرات (5000 كحد يومي تقريبي لأي وجبة)
  if (cal > 9999) {
    showMiniToast('⚠️ السعرات تبدو كثيرة جداً — تحقق من الرقم');
    return;
  }
  const dateKey = todayKey();
  if (!S.nutritionLog) S.nutritionLog = {};
  if (!S.nutritionLog[dateKey]) S.nutritionLog[dateKey] = { entries: [] };

  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

  S.nutritionLog[dateKey].entries.push({
    id: 'custom_' + Date.now(),
    name, icon:'🍽️', cal, unit:'وجبة', qty:1, totalCal:cal,
    time: timeStr, ts: Date.now()
  });

  saveState();
  renderNutritionDiary();
  closeNutritionModal();
  showMiniToast(`✅ ${name} — ${cal} كال`);
  document.getElementById('nut-custom-name').value = '';
  document.getElementById('nut-custom-cal').value = '';
}

/* ─── حذف إدخال ─── */
function removeNutEntry(idx) {
  const dateKey = todayKey();
  const entries = (S.nutritionLog || {})[dateKey]?.entries;
  if (!entries) return;
  entries.splice(idx, 1);
  saveState();
  renderNutritionDiary();
}

/* ─── البحث ─── */
function nutSearch(val) {
  _nutSearch = val.trim();
  renderNutFoodList();
}

/* ══════════════════════════════════════════
   Patch renderNutrition in render.js (override)
══════════════════════════════════════════ */
window.renderNutrition = renderNutritionDiary;
