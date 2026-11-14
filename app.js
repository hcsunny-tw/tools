function getTaipeiDateString() { 
        return new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'); 
    }
    
    function showToast(msg, actText, actCb) {
        const c = document.getElementById('toastContainer'); 
        const t = document.createElement('div'); t.className = 'toast-msg';
        t.innerHTML = `<span>${msg}</span>` + (actText ? `<button class="btn sm" style="background:#fff;color:#333;border:none;flex-shrink:0;">${actText}</button>` : ''); 
        c.appendChild(t); 
        if(actText && actCb) { t.querySelector('button').onclick = ()=>{ actCb(); t.remove(); }; }
        setTimeout(()=> {
            t.style.animation = 'slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse';
            setTimeout(()=>t.remove(), 300);
        }, 4000);
    }

    let audioCtx = null;
    function resumeAudio() { 
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume(); 
        return audioCtx;
    }

    function playSuccessSound() {
        const ctx = resumeAudio(); const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(523.25, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1);
        g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.5);
    }
    
    function playCoinSound() {
        const ctx = resumeAudio(); const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'square'; o.frequency.setValueAtTime(987.77, ctx.currentTime); o.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.1);
        g.gain.setValueAtTime(0.1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.3);
    }

    function playTickSound() {
        const ctx = resumeAudio(); const now = ctx.currentTime; const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(800, now); o.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        g.gain.setValueAtTime(0.1, now); g.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.05);
    }

    function playStarSound() {
        const ctx = resumeAudio(); const now = ctx.currentTime;
        const o1 = ctx.createOscillator(); const g1 = ctx.createGain();
        o1.type = 'sine'; o1.frequency.setValueAtTime(1318.51, now); 
        g1.gain.setValueAtTime(0.2, now); g1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        o1.connect(g1); g1.connect(ctx.destination); o1.start(now); o1.stop(now + 0.4);
        
        const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
        o2.type = 'sine'; o2.frequency.setValueAtTime(1567.98, now + 0.1); 
        g2.gain.setValueAtTime(0.2, now + 0.1); g2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        o2.connect(g2); g2.connect(ctx.destination); o2.start(now + 0.1); o2.stop(now + 0.5);
    }
    window.playStarSound = playStarSound;
    window.playTickSound = playTickSound;
    window.playSuccessSound = playSuccessSound;
    window.playCoinSound = playCoinSound;
    window.showToast = showToast;

    function playTimerTickSound() {
        const ctx = resumeAudio(); const now = ctx.currentTime;
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(880, now); 
        g.gain.setValueAtTime(0.2, now); 
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        o.connect(g); g.connect(ctx.destination);
        o.start(now); o.stop(now + 0.1);
    }
    window.playTimerTickSound = playTimerTickSound;

    function playTimerVictoryMusic() {
        const ctx = resumeAudio(); const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        const times = [0, 0.15, 0.3, 0.45];
        
        notes.forEach((freq, i) => {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'square'; 
            o.frequency.setValueAtTime(freq, now + times[i]);
            g.gain.setValueAtTime(0.15, now + times[i]);
            
            if (i === notes.length - 1) {
                g.gain.exponentialRampToValueAtTime(0.01, now + times[i] + 1.2);
                o.start(now + times[i]); o.stop(now + times[i] + 1.2);
            } else {
                g.gain.exponentialRampToValueAtTime(0.01, now + times[i] + 0.15);
                o.start(now + times[i]); o.stop(now + times[i] + 0.15);
            }
            o.connect(g); g.connect(ctx.destination);
        });
    }
    
window.playTimerVictoryMusic = playTimerVictoryMusic;

// 🔮 幻獸召喚池設定
const gachaPool = [
    { id: "p1", name: "迷路的小黃狗", rarity: 1, img: "🐾" },
    { id: "p2", name: "瞌睡卡皮巴拉", rarity: 1, img: "🐹" },
    { id: "p3", name: "魔法黑貓", rarity: 2, img: "🐈‍⬛" },
    { id: "p4", name: "搗蛋酷洛米", rarity: 2, img: "😈" },
    { id: "p5", name: "聖光史努比", rarity: 3, img: "🐶" },
    { id: "p6", name: "傳說霸王龍", rarity: 3, img: "🦖" }
];
const SUMMON_COST = 10;

    
const levelConfig = [
    { lv: 1, exp: 0, coins: 0, rank: "🌱 迷路的小村民", color: "#9ca3af" },
    { lv: 2, exp: 10, coins: 5, rank: "🪵 木劍小勇者", color: "#86efac" },
    { lv: 3, exp: 30, coins: 10, rank: "🛡️ 銅牌小護衛", color: "#22c55e" },
    { lv: 4, exp: 60, coins: 10, rank: "🐾 森林小遊俠", color: "#0ea5e9" },
    { lv: 5, exp: 100, coins: 15, rank: "🗡️ 鐵甲小騎士", color: "#3b82f6" },
    { lv: 6, exp: 140, coins: 15, rank: "🦅 飛鷹小偵探", color: "#6366f1" },
    { lv: 7, exp: 180, coins: 20, rank: "🐺 灰狼小戰士", color: "#8b5cf6" },
    { lv: 8, exp: 220, coins: 20, rank: "🧙🏻‍♀️ 見習魔法師", color: "#a855f7" },
    { lv: 9, exp: 260, coins: 20, rank: "🦄 獨角獸騎士", color: "#d946ef" },
    { lv: 10, exp: 300, coins: 30, rank: "🌟 星星守護者", color: "#ec4899" },
    { lv: 11, exp: 350, coins: 30, rank: "🔥 烈焰小法師", color: "#f43f5e" },
    { lv: 12, exp: 400, coins: 30, rank: "💧 水波小精靈", color: "#ef4444" },
    { lv: 13, exp: 450, coins: 30, rank: "🌪️ 狂風小飛俠", color: "#f97316" },
    { lv: 14, exp: 500, coins: 30, rank: "⚡ 閃電小超人", color: "#ea580c" },
    { lv: 15, exp: 550, coins: 40, rank: "❄️ 冰雪魔法使", color: "#f59e0b" },
    { lv: 16, exp: 600, coins: 40, rank: "🦁 獅鷲小騎士", color: "#eab308" },
    { lv: 17, exp: 650, coins: 40, rank: "🏹 神準小獵人", color: "#ca8a04" },
    { lv: 18, exp: 700, coins: 40, rank: "⚔️ 雙劍小達人", color: "#14b8a6" },
    { lv: 19, exp: 750, coins: 40, rank: "🛡️ 聖光小衛兵", color: "#06b6d4" },
    { lv: 20, exp: 800, coins: 50, rank: "👑 城堡守衛隊長", color: "#0284c7" },
    { lv: 21, exp: 860, coins: 50, rank: "🐉 飛龍馴獸師", color: "#2563eb" },
    { lv: 22, exp: 920, coins: 50, rank: "🦖 恐龍小霸王", color: "#4f46e5" },
    { lv: 23, exp: 980, coins: 50, rank: "🌋 火山探險家", color: "#7c3aed" },
    { lv: 24, exp: 1040, coins: 50, rank: "🌌 星空小旅人", color: "#9333ea" },
    { lv: 25, exp: 1100, coins: 50, rank: "🌠 彗星觀測者", color: "#c026d3" },
    { lv: 26, exp: 1170, coins: 50, rank: "🏅 青銅大師", color: "#db2777" },
    { lv: 27, exp: 1240, coins: 50, rank: "🥈 白銀大師", color: "#e11d48" },
    { lv: 28, exp: 1310, coins: 50, rank: "🥇 黃金大師", color: "#ea580c" },
    { lv: 29, exp: 1380, coins: 50, rank: "💎 鑽石大師", color: "#d97706" },
    { lv: 30, exp: 1450, coins: 50, rank: "🏆 榮耀大師", color: "#65a30d" },
    { lv: 31, exp: 1530, coins: 50, rank: "🧚 森林精靈王", color: "#16a34a" },
    { lv: 32, exp: 1610, coins: 60, rank: "🦅 鳳凰守護者", color: "#059669" },
    { lv: 33, exp: 1690, coins: 60, rank: "🦄 幻獸大師", color: "#0d9488" },
    { lv: 34, exp: 1770, coins: 60, rank: "⚡ 雷神小勇士", color: "#0891b2" },
    { lv: 35, exp: 1850, coins: 60, rank: "☀️ 太陽神官", color: "#0284c7" },
    { lv: 36, exp: 1940, coins: 60, rank: "👑 傳說中的勇者", color: "#4f46e5" },
    { lv: 37, exp: 2030, coins: 60, rank: "🌌 宇宙大探險家", color: "#7c3aed" },
    { lv: 38, exp: 2120, coins: 60, rank: "🌟 銀河守護神", color: "#be185d" },
    { lv: 39, exp: 2210, coins: 60, rank: "🐉 萬獸之王", color: "#e11d48" },
    { lv: "Max", exp: 2300, coins: 100, rank: "✨ 全班的超級英雄", color: "#ffd700" }
];
    
const thresholds = levelConfig.slice(1).map(config => ({
    exp: config.exp,
    coins: config.coins,
    rank: `${config.rank} (Lv.${config.lv})`
}));
function getRankHtml(exp) {
    let currentLevel = levelConfig[0];
    for (let i = levelConfig.length - 1; i >= 0; i--) {
        if (exp >= levelConfig[i].exp) {
            currentLevel = levelConfig[i];
            break;
        }
    }
    return `<span class="rank-text" style="color:${currentLevel.color}; font-weight:bold;">Lv.${currentLevel.lv} ${currentLevel.rank}</span>`;
}
    window.getRankHtml = getRankHtml;

    let currentSortBy = 'no'; 
    let currentSortAsc = true;

    const firebaseConfig = {
      apiKey: "AIzaSyA0UhDKqcsChUa8OZWxZUmuFdKATfgiL8E",
      authDomain: "homework-hc906.firebaseapp.com",
      projectId: "homework-hc906",
      storageBucket: "homework-hc906.firebasestorage.app",
      messagingSenderId: "1051903125085",
      appId: "1:1051903125085:web:b205f868669ea7d5c34fb4",
      measurementId: "G-V0BEG0TVJY"
    };

    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 
    import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

    let app, db, auth;
    try { 
        app = initializeApp(firebaseConfig); 
        db = getFirestore(app); 
        auth = getAuth(app); 
    } catch (e) { 
        alert("Firebase 初始化錯誤，請檢查 Config"); 
    }

    let currentUser = null;
    const defaultData = {
        roster: [ { no: 1, name: "勇者A", exp: 0, coins: 0, group: 1 }, { no: 2, name: "法師B", exp: 0, coins: 0, group: 1 }, { no: 3, name: "弓手C", exp: 0, coins: 0, group: 2 } ],
        assignments: [],
        teachers: ["公會長"],
        questSettings: { "國語": ["國語習作", "國語考卷"], "數學": ["數學習作", "數學考卷"] },
        attendance: {}, 
        discipline: null,
        expLogs: [], 
        settings: { },
        coinPresets: {
            plus: [ { v: 1, l: '作業優良' }, { v: 3, l: '超級優秀' }, { v: 1, l: '準時' } ],
            minus: [ { v: -1, l: '上課吵鬧' }, { v: -1, l: '未帶物品' } ]
        }
    };
    let data = JSON.parse(JSON.stringify(defaultData)); 
    let saveTimeout = null;
    let currentAssignmentId = null;
    let pickerTarget = null;
    let newAssignmentAssignedIndices = []; 
    let isBatchMode = false;
    let isBatchExpMode = false;
    let targetAssignmentIdToDelete = null; 
    let tempQuestSettings = {};
    let currentFilter = { teacher: 'all', subject: 'all' };
    let lastRosterState = null; 
    const APP_SCALE = 1;
    
    setInterval(() => {
        const timeStr = new Date().toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false });
        const fc = document.getElementById('fcTime');
        if (fc) fc.innerText = timeStr;
    }, 1000);

    window.switchView = function(id) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('show'));
        const target = document.getElementById(id);
        if(target) { target.classList.add('show'); renderAll(); }
    }

    function updateSaveStatus(status, message = '') {
        const ind = document.getElementById('saveStatusIndicator'); if(!ind) return;
        if (status === 'pending' || status === 'uploading') ind.innerHTML = `<span style="color:var(--primary)"><i class="bi bi-cloud-arrow-up"></i> ${message || '處理中...'}</span>`;
        else if (status === 'local') ind.innerHTML = `<span style="color:#ea580c" title="已存在本機，稍後自動上傳雲端"><i class="bi bi-device-hdd"></i> 待同步</span>`;
        else if (status === 'success') ind.innerHTML = `<span style="color:var(--success)"><i class="bi bi-cloud-check"></i> 已同步</span>`;
        else ind.innerHTML = `<span style="color:var(--danger)"><i class="bi bi-exclamation-triangle"></i> ${message}</span>`;
    }

    let isDirty = false;
    let lastSyncedState = { core: '', assignments: '', attendance: '', logs: '' }; 

    function triggerAutoSave() {
        if (currentUser) {
            localStorage.setItem(`guild_backup_${currentUser.uid}`, JSON.stringify(data));
        }
        isDirty = true;
        updateSaveStatus('local');

        clearTimeout(saveTimeout); 
        saveTimeout = setTimeout(() => {
            syncToCloud();
        }, 15000); 
    }

async function syncToCloud() {
        if (!currentUser || !isDirty) return;
        updateSaveStatus('uploading', '雲端同步中');
        try { 
            const cleanData = JSON.parse(JSON.stringify(data)); 
            
            const coreData = { roster: cleanData.roster, teachers: cleanData.teachers, questSettings: cleanData.questSettings, discipline: cleanData.discipline, settings: cleanData.settings, coinPresets: cleanData.coinPresets };
            const assignData = { assignments: cleanData.assignments };
            const attData = { attendance: cleanData.attendance };
            const logsData = { expLogs: cleanData.expLogs };

            const promises = [];
            
            const coreStr = JSON.stringify(coreData);
            const assignStr = JSON.stringify(assignData);
            const attStr = JSON.stringify(attData);
            const logsStr = JSON.stringify(logsData);

            let needsPublicUpdate = false; 

            if (lastSyncedState.core !== coreStr) {
                promises.push(setDoc(doc(db, "users", currentUser.uid, "data", "core"), coreData));
                lastSyncedState.core = coreStr;
                needsPublicUpdate = true;
            }
            if (lastSyncedState.assignments !== assignStr) {
                promises.push(setDoc(doc(db, "users", currentUser.uid, "data", "assignments"), assignData));
                lastSyncedState.assignments = assignStr;
                needsPublicUpdate = true;
            }
            if (lastSyncedState.attendance !== attStr) {
                promises.push(setDoc(doc(db, "users", currentUser.uid, "data", "attendance"), attData));
                lastSyncedState.attendance = attStr;
            }
            if (lastSyncedState.logs !== logsStr) {
                promises.push(setDoc(doc(db, "users", currentUser.uid, "data", "logs"), logsData));
                lastSyncedState.logs = logsStr;
            }

            if (needsPublicUpdate || promises.length > 0) {
                const publicSummary = cleanData.roster.map((s, i) => {
                    const debts = [];
                    cleanData.assignments.forEach(a => {
                        if(!a.archived) {
                            const indices = a.assignedIndices || 'all';
                            if (indices === 'all' || indices.includes(i)) {
                                const st = (a.statuses || [])[i] || 0;
                                if (st === 0 || st === 2) { 
                                    debts.push({ title: a.title, st: st, subject: a.subject || '一般', date: a.date });
                                }
                            }
                        }
                    });
                    // 🌟 這裡新增了 exp 與 coins 資料
                    return { no: s.no, name: s.name, exp: s.exp || 0, coins: s.coins || 0, debts: debts };
                });

                promises.push(setDoc(doc(db, "public_boards", currentUser.uid), { 
                    lastUpdated: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
                    summary: publicSummary 
                }));
            }

            if (promises.length > 0) {
                await Promise.all(promises);
            }

            isDirty = false;
            updateSaveStatus('success'); 
        } catch (e) { 
            console.error(e);
            updateSaveStatus('error', e.code === 'permission-denied' ? '權限不足' : '儲存失敗');
        }
    }

    document.getElementById('btnRefreshData').addEventListener('click', async () => {
        const btn = document.getElementById('btnRefreshData');
        btn.disabled = true;
        if (isDirty) {
            await syncToCloud(); 
        } else {
            await loadDataFromFirebase(); 
        }
        showToast("🔄 資料已與雲端同步完成");
        btn.disabled = false;
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && isDirty) {
            syncToCloud();
        }
    });
    window.addEventListener('beforeunload', (e) => {
        if (isDirty) {
            syncToCloud();
            e.preventDefault();
            e.returnValue = ''; 
        }
    });

    async function loadDataFromFirebase() {
        if (!currentUser) return;
        updateSaveStatus('pending', '讀取中');
        try {
            const coreRef = doc(db, "users", currentUser.uid, "data", "core");
            const assignRef = doc(db, "users", currentUser.uid, "data", "assignments");
            const attRef = doc(db, "users", currentUser.uid, "data", "attendance");
            const logsRef = doc(db, "users", currentUser.uid, "data", "logs");

            const [coreSnap, assignSnap, attSnap, logsSnap] = await Promise.all([
                getDoc(coreRef), getDoc(assignRef), getDoc(attRef), getDoc(logsRef)
            ]);

            if (coreSnap.exists()) {
                const coreData = coreSnap.data();
                data.roster = coreData.roster || defaultData.roster;
                data.teachers = coreData.teachers || defaultData.teachers;
                data.questSettings = coreData.questSettings || defaultData.questSettings;
                data.discipline = coreData.discipline || null;
                data.settings = coreData.settings || {};
                data.coinPresets = coreData.coinPresets || defaultData.coinPresets;

                data.assignments = assignSnap.exists() ? (assignSnap.data().assignments || []) : [];
                data.attendance = attSnap.exists() ? (attSnap.data().attendance || {}) : {};
                data.expLogs = logsSnap.exists() ? (logsSnap.data().expLogs || []) : [];

                lastSyncedState = {
                    core: JSON.stringify(coreData),
                    assignments: JSON.stringify(assignSnap.data() || {}),
                    attendance: JSON.stringify(attSnap.data() || {}),
                    logs: JSON.stringify(logsSnap.data() || {})
                };
            } else {
                const oldDocSnap = await getDoc(doc(db, "users", currentUser.uid, "data", "guildData"));
                if (oldDocSnap.exists()) {
                    const loadedData = oldDocSnap.data();
                    data.roster = Array.isArray(loadedData.roster) ? loadedData.roster : defaultData.roster;
                    data.assignments = Array.isArray(loadedData.assignments) ? loadedData.assignments : [];
                    data.teachers = Array.isArray(loadedData.teachers) && loadedData.teachers.length > 0 ? loadedData.teachers : defaultData.teachers;
                    data.questSettings = loadedData.questSettings || JSON.parse(JSON.stringify(defaultData.questSettings));
                    data.attendance = loadedData.attendance || {};
                    data.discipline = loadedData.discipline || null;
                    data.settings = loadedData.settings || {};
                    data.expLogs = Array.isArray(loadedData.expLogs) ? loadedData.expLogs : [];
                    data.coinPresets = loadedData.coinPresets || JSON.parse(JSON.stringify(defaultData.coinPresets));
                    
                    isDirty = true;
                    setTimeout(() => syncToCloud(), 3000); 
                } else {
                    data = JSON.parse(JSON.stringify(defaultData));
                }
            }

            data.roster.forEach(r => { 
                if(typeof r.exp === 'undefined') r.exp = 0; 
                if(typeof r.coins === 'undefined') r.coins = 0; 
                if(typeof r.maxExp === 'undefined') r.maxExp = r.exp; 
                if(typeof r.group === 'undefined') r.group = 1; 
                if(typeof r.pets === 'undefined') r.pets = []; 
            });
            
            onDataLoaded(); updateSaveStatus('success');
        } catch (error) {
            console.error("🔥 Firebase 讀取失敗:", error);
            let errMsg = "⚠️ 資料庫連線失敗！\n\n【錯誤代碼】 " + (error.code || "無") + "\n【錯誤訊息】 " + (error.message || error);
            alert(errMsg);
            data = JSON.parse(JSON.stringify(defaultData)); 
            onDataLoaded();
            updateSaveStatus('error', '連線失敗 (離線模式)');
        }
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user; 
            document.getElementById('loginOverlay').style.display = 'none'; 
            document.getElementById('mainApp').style.display = 'flex'; 
            
            const emailDisp = document.getElementById('userEmailDisplay');
            if(emailDisp) emailDisp.innerHTML = `<i class="bi bi-person-circle"></i> <span class="nav-text">${user.email.split('@')[0]}</span>`;
            
            initApp();
        } else {
            document.getElementById('loginOverlay').style.display = 'flex'; 
            document.getElementById('mainApp').style.display = 'none';
        }
    });

    document.getElementById('btnLogin').addEventListener('click', () => signInWithPopup(auth, new GoogleAuthProvider()));
    document.getElementById('btnLogout').addEventListener('click', () => { if(confirm("確定要登出？")) signOut(auth).then(() => window.location.reload()); });

    function initApp() {
        const color = localStorage.getItem('hwColor') || 'guild';
        document.documentElement.setAttribute('data-color-theme', color);
        document.querySelectorAll('.theme-option').forEach(el => el.classList.toggle('active', el.dataset.theme === color));

        const isDark = localStorage.getItem('hwTheme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        document.getElementById('darkModeToggle').checked = isDark;

        switchView('view-dashboard');
        loadDataFromFirebase();
    }

    function renderClassStars() {
        if (!data.settings) data.settings = {};
        const stars = data.settings.classStars || 0;
        const headerText = document.getElementById('classStarCountText');
        const adminText = document.getElementById('adminClassStarCount');
        if (headerText) headerText.innerText = stars;
        if (adminText) adminText.innerText = stars;
    }

    function onDataLoaded() {
        const today = getTaipeiDateString();
        if (!data.attendance || !data.attendance[today]) {
            document.getElementById('attendanceReminderModal').classList.add('show');
        }


        populateTeacherDropdowns(); 
        updateSubjectDropdown(); 
        resetNewAssignmentState();
        checkAndResetDiscipline(); 
        renderCoinDropdowns(); 
        renderClassStars(); 
        renderAll(); 
        renderChecklists(); 
    }

// ⭐ 更新常駐側邊欄的函式
    function updatePersistentSidebar() {
        if (!data || !data.roster) return;
        
        const activeAssigns = (data.assignments || []).filter(a => !a.archived);
        const todayStr = getTaipeiDateString();
        const clearedStudents = []; 
        const helpStudents = [];
        
        // 重新計算名單
        data.roster.forEach((s, i) => {
            let pendingCount = 0;
            for (let a of activeAssigns) {
                const indices = a.assignedIndices || 'all';
                if (indices === 'all' || indices.includes(i)) {
                    const st = (a.statuses || [])[i] || 0;
                    if (st === 0 || st === 2) {
                        // 若有開啟隱藏今日再訂正功能，則排除
                        if (typeof hideTodayRedo !== 'undefined' && hideTodayRedo && st === 2 && a.date === todayStr) continue;
                        pendingCount++;
                    }
                }
            }
            if (pendingCount === 0) clearedStudents.push(s.no);
            if (pendingCount >= 5) helpStudents.push(s.no);
        });
        
        clearedStudents.sort((a,b) => a - b); 
        helpStudents.sort((a,b) => a - b);
        
        // 渲染至畫面
        const psClearedList = document.getElementById('psClearedList');
        const psHelpList = document.getElementById('psHelpList');
        
        if (psClearedList) {
            psClearedList.innerHTML = clearedStudents.length > 0 
                ? clearedStudents.map(n => `<span class="num-badge" style="width:28px; height:28px; font-size:14px; background:var(--success); color:#fff;">${n}</span>`).join('') 
                : '<span style="font-size:12px;opacity:0.6;">無</span>';
        }
        if (psHelpList) {
            psHelpList.innerHTML = helpStudents.length > 0 
                ? helpStudents.map(n => `<span class="num-badge" style="width:28px; height:28px; font-size:14px; background:var(--danger); color:#fff;">${n}</span>`).join('') 
                : '<span style="font-size:12px;opacity:0.6;">無</span>';
        }
    }

    // ⭐ 修改後的 renderAll 函式
    function renderAll() {
        const v = document.querySelector('.view.show'); if(!v) return;
        if (v.id === 'view-dashboard') renderDashboard();
        else if (v.id === 'view-student-status') renderStudentStatus();
        else if (v.id === 'view-roster') renderRosterEditor();
        else if (v.id === 'view-attendance') initAttendanceView();
        if (document.getElementById('quickSidebar') && document.getElementById('quickSidebar').classList.contains('show')) {
            window.renderQuickSidebar();
        }
        // 加入這一行：每次重新渲染畫面時，都更新左側常駐欄
        updatePersistentSidebar(); 
    }
    window.renderAll = renderAll;

    function logAction(sidx, delta, type, reason) {
        if(!data.expLogs) data.expLogs = [];
        data.expLogs.push({
            time: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
            name: data.roster[sidx].name,
            delta: delta > 0 ? '+' + delta + ' ' + type : delta + ' ' + type,
            reason: reason
        });
        if(data.expLogs.length > 2000) data.expLogs.shift();
    }

    function changeExp(sidx, delta, reason = '系統調整', silent = false) {
        if (!data.roster[sidx]) return;
        const oldState = JSON.parse(JSON.stringify(data.roster[sidx]));
        const oldLogsLength = data.expLogs ? data.expLogs.length : 0;

        const oldExp = data.roster[sidx].exp || 0;
        const maxExp = data.roster[sidx].maxExp || oldExp; 

        data.roster[sidx].exp = oldExp + delta;
        if (data.roster[sidx].exp < 0) data.roster[sidx].exp = 0;
        const newExp = data.roster[sidx].exp;
        
        logAction(sidx, delta, 'EXP', reason);
        
        if (!silent) {
            playSuccessSound();
            const msg = delta > 0 ? `✨ ${data.roster[sidx].name} 獲得 ${delta} EXP！` : `💔 ${data.roster[sidx].name} 失去 ${Math.abs(delta)} EXP...`;
            
            showToast(msg, "復原", () => {
                data.roster[sidx] = oldState;
                if(data.expLogs && data.expLogs.length > oldLogsLength) {
                    data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
                }
                triggerAutoSave(); renderAll();
            });
            triggerAutoSave(); renderAll();
        }

    if (delta > 0) {
        thresholds.forEach((t) => {
            if (maxExp < t.exp && newExp >= t.exp) {
                data.roster[sidx].coins = (data.roster[sidx].coins || 0) + t.coins;
                logAction(sidx, t.coins, '金幣', `晉升 ${t.rank} 獎勵`);
                
                setTimeout(() => {
                    showToast(`🌟 恭喜 ${data.roster[sidx].name} 晉升為【${t.rank}】！獲得 ${t.coins} 枚金幣！`);
                    playSuccessSound();
                    renderAll();
                }, 1500); 
            }
        });

        data.roster[sidx].maxExp = Math.max(maxExp, newExp);
        }
    }
    window.changeExp = changeExp;

    function changeCoin(sidx, delta, reason = '手動調整', silent = false) {
        if (!data.roster[sidx]) return;
        const oldState = JSON.parse(JSON.stringify(data.roster[sidx]));
        const oldLogsLength = data.expLogs ? data.expLogs.length : 0;

        if (typeof data.roster[sidx].coins === 'undefined') data.roster[sidx].coins = 0;
        data.roster[sidx].coins += delta;
        
        logAction(sidx, delta, '金幣', reason);
        
        if (!silent) {
            playCoinSound();
            const msg = delta > 0 ? `✨ ${data.roster[sidx].name} ${reason} 獲得 ${delta} 金幣！` : `💔 ${data.roster[sidx].name} ${reason} 失去 ${Math.abs(delta)} 金幣...`;
            
            showToast(msg, "復原", () => {
                data.roster[sidx] = oldState;
                if(data.expLogs && data.expLogs.length > oldLogsLength) {
                    data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
                }
                triggerAutoSave(); renderAll();
            });
            triggerAutoSave(); renderAll();
        }
    }
    window.changeCoin = changeCoin;

    window.checkAllClearAndCheer = function(a) {
        const indices = a.assignedIndices === 'all' ? data.roster.map((_, i)=>i) : a.assignedIndices;
        if (indices.length === 0) return;
        
        const allClear = indices.every(i => {
            const st = (a.statuses || [])[i] || 0;
            return st === 1 || st === 3;
        });
        
        if (allClear && !a.cheered) {
            a.cheered = true;
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#ff0', '#f00', '#0f0', '#00f', '#f0f'] });
            if (window.playStarSound) { 
                window.playStarSound(); 
                setTimeout(()=> { if(window.playTimerVictoryMusic) window.playTimerVictoryMusic(); }, 400); 
            }
            showToast(`🎉 狂賀！【${a.title}】全員繳交完成！`);
            triggerAutoSave();
        } else if (!allClear && a.cheered) {
            a.cheered = false;
            triggerAutoSave();
        }
    };

    function updateStatus(aid, sidx, newStatus) {
        const a = data.assignments.find(i => i.id == aid);
        if(a) {
            if(!a.statuses) a.statuses = Array(data.roster.length).fill(0);
            if(!a.earnedExp) a.earnedExp = {}; 

            const oldStatus = a.statuses[sidx] || 0;
            const oldState = JSON.parse(JSON.stringify(data.roster[sidx]));
            const oldLogsLength = data.expLogs ? data.expLogs.length : 0;
            const currentEarned = a.earnedExp[sidx] || { handIn: 0, complete: 0 };

            a.statuses[sidx] = newStatus;

            const todayStr = getTaipeiDateString();
            const isSameDay = (todayStr === a.date);
            const d1 = new Date(a.date.replace(/-/g, '/'));
            const d2 = new Date(todayStr.replace(/-/g, '/'));
            const diffDays = Math.floor(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));

            const newEarned = { handIn: currentEarned.handIn, complete: 0 };

            if (newStatus !== 0) {
                if (currentEarned.handIn === 0 && isSameDay) newEarned.handIn = 1;
            } else {
                newEarned.handIn = 0; 
            }

            if (newStatus === 3) {
                if (currentEarned.complete === 0) newEarned.complete = (diffDays <= 1) ? 2 : 1;
                else newEarned.complete = currentEarned.complete; 
            }

            const oldTotal = currentEarned.handIn + currentEarned.complete;
            const newTotal = newEarned.handIn + newEarned.complete;
            const deltaExp = newTotal - oldTotal;

            a.earnedExp[sidx] = newEarned; 

            if (deltaExp !== 0) {
                let reason = `更新任務 [${a.title}]`;
                if (deltaExp > 0) {
                    if (newEarned.complete > 0 && currentEarned.complete === 0) reason = (diffDays <= 1) ? `迅速討伐 [${a.title}]` : `完成討伐 [${a.title}]`;
                    else reason = `準時回報 [${a.title}]`;
                } else {
                    reason = `任務退回 [${a.title}]`;
                }

                changeExp(sidx, deltaExp, reason, true); 
                
                if (deltaExp > 0) {
                    playSuccessSound();
                    showToast(`🎉 ${reason}！${data.roster[sidx].name} 獲得 ${deltaExp} EXP`, "復原", () => {
                        a.statuses[sidx] = oldStatus;
                        a.earnedExp[sidx] = currentEarned;
                        data.roster[sidx] = oldState;
                        if(data.expLogs) data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
                        triggerAutoSave(); renderAll();
                    });
                } else {
                    showToast(`⚠️ ${reason}！${data.roster[sidx].name} 收回 ${Math.abs(deltaExp)} EXP`, "復原", () => {
                        a.statuses[sidx] = oldStatus;
                        a.earnedExp[sidx] = currentEarned;
                        data.roster[sidx] = oldState;
                        if(data.expLogs) data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
                        triggerAutoSave(); renderAll();
                    });
                }
                
                triggerAutoSave(); 
                renderAll();
                
            } else {
                triggerAutoSave(); renderAll();
            }

            window.checkAllClearAndCheer(a); // ⭐ 檢查是否達成全員繳交
        }
    }
    window.updateStatus = updateStatus;

    function toggleStatus(aid, idx) {
        resumeAudio();
        const a = data.assignments.find(x => x.id == aid); if(!a) return;
        let s = (a.statuses || [])[idx] || 0;
        s = (s + 1) % 4; 
        updateStatus(aid, idx, s);
    }
    window.toggleStatus = toggleStatus;

    function renderDashboard() {
        const list = document.getElementById('sideAssignmentList'); list.innerHTML = '';
        
        let assignments = data.assignments.filter(a => {
            if (a.archived) return false;
            const matchT = currentFilter.teacher === 'all' || a.teacher === currentFilter.teacher;
            const matchS = currentFilter.subject === 'all' || (a.subject ? a.subject === currentFilter.subject : a.title.includes(currentFilter.subject));
            return matchT && matchS;
        }).sort((a,b) => a.date < b.date ? 1 : -1);

        if (assignments.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:20px; color:var(--muted); font-size:13px;">沒有符合的委託</div>';
            document.getElementById('dashEmptyState').style.display = 'flex'; 
            document.getElementById('dashDetailPanel').classList.remove('show'); 
            return;
        }

        assignments.forEach(a => {
            const el = document.createElement('div'); 
            el.className = 'side-item' + (currentAssignmentId === a.id ? ' active' : '');
            
            const indices = a.assignedIndices || 'all';
            const total = indices === 'all' ? data.roster.length : indices.length;
            const completed = (a.statuses || []).filter((s, i) => s === 3 && (indices === 'all' || indices.includes(i))).length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            const color = progress === 100 ? 'var(--success)' : 'var(--primary)';

        let hasStatus1 = false; let allStatus0 = true; let assignedCount = 0; let missingCount = 0;   
            for (let i = 0; i < data.roster.length; i++) {
                if (indices === 'all' || indices.includes(i)) {
                    assignedCount++; const st = (a.statuses || [])[i] || 0;
                    if (st === 1) hasStatus1 = true; 
                    if (st !== 0) allStatus0 = false; 
                    if (st === 0) missingCount++; 
                }
            }

            let gradeBadge = assignedCount === 0 ? `<span style="color: #9ca3af; background: #f3f4f6; padding: 2px 4px; border-radius: 4px; font-size: 11px; font-weight: bold;">無對象</span>` : 
                             hasStatus1 ? `<span style="color: #ea580c; background: #ffedd5; padding: 2px 4px; border-radius: 4px; font-size: 11px; font-weight: bold;">未批改</span>` : 
                             allStatus0 ? `<span style="color: #4b5563; background: #e5e7eb; padding: 2px 4px; border-radius: 4px; font-size: 11px; font-weight: bold;">未清點</span>` : 
                             `<span style="color: #166534; background: #dcfce7; padding: 2px 4px; border-radius: 4px; font-size: 11px; font-weight: bold;">批改完</span>`;
            let missingBadge = assignedCount > 0 ? (missingCount > 0 ? `<span style="color: #be123c; background: #ffe4e6; padding: 2px 4px; border-radius: 4px; font-size: 11px; font-weight: bold;">缺${missingCount}</span>` : `<span style="color: #1d4ed8; background: #dbeafe; padding: 2px 4px; border-radius: 4px; font-size: 11px; font-weight: bold;">缺0</span>`) : '';

            el.innerHTML = `
                <div class="side-item-title" style="display: flex; align-items: center; justify-content: space-between; gap: 4px;">
                    <span style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${a.title}">${a.title}</span>
                    <div style="display: flex; gap: 4px; flex-shrink: 0;">${missingBadge} ${gradeBadge}</div>
                </div>
                <div class="side-item-meta muted" style="display: flex; justify-content: space-between; margin-top: 4px;">
                    <span>${a.date}</span><span>${a.teacher}</span>
                </div>
                <div style="margin-top:6px; display:flex; align-items:center; gap:6px; font-size:12px;">
                    <div style="flex:1; height:6px; background:rgba(0,0,0,0.1); border-radius:3px; overflow:hidden;">
                        <div style="width:${progress}%; height:100%; background:${color}; transition: width 0.5s;"></div>
                    </div>
                    <span>${completed}/${total}</span>
                </div>
            `;
            
            el.onmouseenter = (e) => window.showAssignmentTooltip(e, a);
            el.onmouseleave = () => window.hideAssignmentTooltip();
            el.onmousemove = (e) => window.moveAssignmentTooltip(e);

            el.onclick = () => { currentAssignmentId = a.id; renderDashboardDetail(a.id); renderDashboard(); };
            list.appendChild(el);
        });
        if(assignments.length > 0 && !currentAssignmentId) {
            currentAssignmentId = assignments[0].id;
        }
        if(currentAssignmentId) renderDashboardDetail(currentAssignmentId);
    }

    window.openQuickDebtMenu = function(e, sidx, oldDebtsString) {
        e.stopPropagation();
        
        let oldDebts = [];
        try { oldDebts = JSON.parse(decodeURIComponent(oldDebtsString)); } catch(err) {}

        const menu = document.getElementById('quickDebtMenu');
        const studentId = String(sidx);
        
        if (menu.classList.contains('show') && menu.dataset.currentSidx === studentId) {
            menu.classList.remove('show'); menu.style.display = ''; menu.dataset.currentSidx = ""; return;
        }
        
        menu.dataset.currentSidx = studentId;
        const list = document.getElementById('quickDebtList');
        
        list.innerHTML = ''; 
        
        const student = data.roster[sidx];

        document.getElementById('quickDebtTitle').innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>【${student.name}】待清舊帳</span>
                <i class="bi bi-x-circle-fill btn-close-debt" onclick="document.getElementById('quickDebtMenu').classList.remove('show'); document.getElementById('quickDebtMenu').dataset.currentSidx='';" style="cursor: pointer; font-size: 18px; color: var(--danger);"></i>
            </div>
        `;
        
        oldDebts.forEach(debt => {
            const item = document.createElement('div'); item.className = 'quick-debt-item';
            const stLbl = debt.st === 2 ? '<span style="color:#c62828; font-size:11px;">(再訂正)</span>' : '<span style="color:#888; font-size:11px;">(未交)</span>';
            
            item.innerHTML = `
                <div style="flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:13px; font-weight:bold;" title="${debt.title}">${debt.title} ${stLbl}</div>
                <button class="btn sm" style="padding: 2px 8px; border-radius: 4px; font-size: 12px; background: var(--primary); color: #fff;"><i class="bi bi-check-lg"></i> 完成</button>
            `;
            
            item.onclick = (evt) => {
                evt.stopPropagation(); window.updateStatus(debt.id, sidx, 3);
                menu.classList.remove('show'); menu.style.display = ''; menu.dataset.currentSidx = "";
            };
            list.appendChild(item);
        });

        menu.style.display = ''; menu.classList.add('show'); 
        let x = e.clientX + 10; let y = e.clientY + 10;
        const rect = menu.getBoundingClientRect();
        if (x + rect.width > window.innerWidth) x = e.clientX - rect.width - 10;
        if (y + rect.height > window.innerHeight) y = e.clientY - rect.height - 10;
        menu.style.left = x + 'px'; menu.style.top = y + 'px';
    };

    function renderDashboardDetail(id) {
        const a = data.assignments.find(x => x.id == id); if (!a) return;
        document.getElementById('dashEmptyState').style.display = 'none';
        document.getElementById('dashDetailPanel').classList.add('show');
        document.getElementById('dashDetailTitle').innerHTML = `
            <span class="badge" style="background:var(--primary); color:#fff; font-size:14px; padding:2px 8px; border-radius:4px;">${a.subject || '一般'}</span> 
            ${a.title}
            <button class="btn sm ghost icon-only" title="編輯名稱" onclick="window.editAssignmentTitle(${a.id})" style="border:none; color:var(--muted);"><i class="bi bi-pencil-fill"></i></button>
        `;

        // ⭐ 產生小組一鍵繳交按鈕
        const groupActions = document.getElementById('groupQuickActions');
        groupActions.innerHTML = '<span style="font-size:13px; font-weight:bold; color:var(--primary); align-self:center; margin-right:4px;"><i class="bi bi-people-fill"></i> 小組回報：</span>';
        const groups = [...new Set(data.roster.map(s => s.group || 1))].sort((x, y) => x - y);
        
        groups.forEach(g => {
            const btn = document.createElement('button');
            btn.className = 'btn sm ghost group-submit-btn';
            btn.innerText = `第 ${g} 組交`;
            btn.onclick = () => {
                let changed = false;
                data.roster.forEach((st, i) => {
                    if ((st.group || 1) === g) {
                        const isAssigned = (a.assignedIndices === 'all') || (a.assignedIndices && a.assignedIndices.includes(i));
                        if (isAssigned) {
                            const oldStatus = (a.statuses || [])[i] || 0;
                            if (oldStatus === 0 || oldStatus === 2) {
                                window.updateStatus(a.id, i, 1);
                                changed = true;
                            }
                        }
                    }
                });
                if (changed) {
                    showToast(`✨ 第 ${g} 組已全數設為「已回報」！`);
                }
            };
            groupActions.appendChild(btn);
        });
        
        const grid = document.getElementById('dashGridContainer'); grid.innerHTML = '';
        data.roster.forEach((s, i) => {
            const isAssigned = (a.assignedIndices === 'all') || (a.assignedIndices && a.assignedIndices.includes(i));
            const st = a.statuses[i] || 0; 
            const div = document.createElement('div'); div.className = `seatItem ${!isAssigned ? 'not-assigned' : ''}`;
            
            let oldDebts = [];
            if(isAssigned) {
                (data.assignments || []).forEach(otherA => {
                    if (otherA.id !== a.id && !otherA.archived) {
                        const otherIndices = otherA.assignedIndices || 'all';
                        if (otherIndices === 'all' || otherIndices.includes(i)) {
                            const otherSt = (otherA.statuses || [])[i] || 0;
                            if (otherSt === 0 || otherSt === 2) oldDebts.push({ id: otherA.id, title: otherA.title, st: otherSt });
                        }
                    }
                });
            }

            let badgeHtml = oldDebts.length > 0 ? `<div class="debt-badge" title="有 ${oldDebts.length} 項未完成的舊任務" onclick="window.openQuickDebtMenu(event, ${i}, '${encodeURIComponent(JSON.stringify(oldDebts))}')">${oldDebts.length}</div>` : '';

            div.innerHTML = `
                <div style="position: relative; flex-shrink: 0;">
                    ${badgeHtml}
                    <div class="seat s${st}" onclick="window.toggleStatus(${id}, ${i})">${s.no}</div>
                </div>
                <div class="seatName">
                    <span>${s.name}</span><br>
                    <span style="font-size:10px; color:var(--muted);">⭐ ${s.exp||0} 💰 ${s.coins||0}</span>
                </div>
            `;
            
            grid.appendChild(div);
        });

        document.getElementById('btnDeleteCurrent').onclick = () => {
            targetAssignmentIdToDelete = id; 
            document.getElementById('deleteTargetTitle').innerText = a.title; 
            document.getElementById('deleteChoiceModal').classList.add('show');
        };
    }

    document.getElementById('rangeSize').addEventListener('input', (e) => { 
        document.documentElement.style.setProperty('--seat', `${e.target.value}px`); 
        document.documentElement.style.setProperty('--seat-font', `${Math.max(10, Math.floor(e.target.value * 0.3))}px`); 
    });

    function checkAndResetDiscipline() {
        const today = getTaipeiDateString();
        if (!data.discipline || data.discipline.date !== today) { 
            data.discipline = { date: today, statuses: {} }; 
            triggerAutoSave(); 
        }
    }

    document.getElementById('selStudentSort').addEventListener('change', (e) => {
        currentSortBy = e.target.value;
        currentSortAsc = true;
        document.getElementById('btnSortDirection').innerHTML = '<i class="bi bi-sort-numeric-down"></i>';
        renderStudentStatus();
    });
let hideClearStudents = false;
document.getElementById('btnToggleClearStudents').addEventListener('click', (e) => {
    hideClearStudents = !hideClearStudents;
    e.currentTarget.innerHTML = hideClearStudents ? '<i class="bi bi-eye"></i> ' : '<i class="bi bi-eye-slash"></i> ';
    e.currentTarget.style.color = hideClearStudents ? 'var(--primary)' : 'var(--muted)';
    renderStudentStatus();
});
    let groupDebtsBySubject = true;
    document.getElementById('btnToggleDebtSort').addEventListener('click', (e) => {
        groupDebtsBySubject = !groupDebtsBySubject;
        e.currentTarget.innerHTML = groupDebtsBySubject ? '<i class="bi bi-tags-fill"></i> ' : '<i class="bi bi-tags"></i> ';
        e.currentTarget.style.color = groupDebtsBySubject ? 'var(--primary)' : 'var(--muted)';
        renderStudentStatus();
    });

    let hideTodayRedo = false;
    document.getElementById('btnToggleTodayRedo').addEventListener('click', (e) => {
        hideTodayRedo = !hideTodayRedo;
        e.currentTarget.innerHTML = hideTodayRedo ? '<i class="bi bi-calendar-x-fill"></i> ' : '<i class="bi bi-calendar-check"></i> ';
        e.currentTarget.style.color = hideTodayRedo ? 'var(--danger)' : 'var(--muted)';
        renderStudentStatus();
    });
    
    document.getElementById('btnSortDirection').addEventListener('click', (e) => {
        currentSortAsc = !currentSortAsc;
        const isNum = currentSortBy === 'no' || currentSortBy === 'exp' || currentSortBy === 'coins' || currentSortBy === 'debts';
        e.currentTarget.innerHTML = `<i class="bi bi-sort-${isNum ? (currentSortAsc?'numeric-down':'numeric-up-alt') : (currentSortAsc?'down':'up')}"></i>`;
        renderStudentStatus();
    });

    function renderStudentStatus() {
        const todayStr = getTaipeiDateString(); 
        const con = document.getElementById('studentStatusContainer'); 
        con.innerHTML = '';
        
        const tb = document.getElementById('batchExpToolbar');
        if (isBatchExpMode) {
            tb.classList.add('show');
            document.getElementById('btnToggleBatchExp').innerHTML = '<i class="bi bi-x-lg"></i> 取消加扣分';
            document.getElementById('btnToggleBatchExp').classList.add('warn');
        } else {
            tb.classList.remove('show');
            document.getElementById('btnToggleBatchExp').innerHTML = '<i class="bi bi-magic"></i> 加扣分模式';
            document.getElementById('btnToggleBatchExp').classList.remove('warn');
        }

        if (isBatchMode) {
            document.getElementById('btnBatchExport').style.display = 'inline-block';
            document.getElementById('btnBatchSelectAll').style.display = 'inline-block';
            document.getElementById('btnToggleBatchMode').innerHTML = '<i class="bi bi-x-lg"></i> 取消列印';
            document.getElementById('btnToggleBatchMode').classList.add('warn');
        } else {
            if (!isBatchExpMode) document.getElementById('btnBatchSelectAll').style.display = 'none';
            document.getElementById('btnBatchExport').style.display = 'none';
            document.getElementById('btnToggleBatchMode').innerHTML = `<i class="bi bi-printer"></i> 批量列印卷軸`;
            document.getElementById('btnToggleBatchMode').classList.remove('warn');
        }

        checkAndResetDiscipline();

        const activeAssigns = (data.assignments || []).filter(a => !a.archived);
        const clearedStudents = []; const helpStudents = [];
        data.roster.forEach((s, i) => {
            let pendingCount = 0;
            for (let a of activeAssigns) {
                const indices = a.assignedIndices || 'all';
                    if (indices === 'all' || indices.includes(i)) {
                    const st = (a.statuses || [])[i] || 0;
                    if (st === 0 || st === 2) {
                        if (hideTodayRedo && st === 2 && a.date === todayStr) continue;
                        pendingCount++;
                    }
                }
            }
            if (pendingCount === 0) clearedStudents.push(s.no);
            if (pendingCount >= 5) helpStudents.push(s.no);
        });
        clearedStudents.sort((a,b)=>a-b); helpStudents.sort((a,b)=>a-b);

      const overviewCon = document.getElementById('studentStatusOverviewContainer');
        if (!isBatchMode && !isBatchExpMode) { 
            overviewCon.style.display = 'block';
            overviewCon.innerHTML = `
                <div class="status-overview">
                    <div class="overview-card success" style="flex: 3;"><div class="overview-icon-bg"><i class="bi bi-trophy"></i></div><div class="overview-header"><i class="bi bi-trophy-fill"></i> 討伐全冠王 (${clearedStudents.length})</div>
                        <div class="overview-nums">${clearedStudents.length > 0 ? clearedStudents.map(n => `<span class="num-badge">${n}</span>`).join('') : '<span style="font-size:12px;opacity:0.6;">💪 尚無人達成</span>'}</div>
                    </div>
                    <div class="overview-card danger" style="flex: 1.8;"><div class="overview-icon-bg"><i class="bi bi-bandaid"></i></div><div class="overview-header"><i class="bi bi-bandaid-fill"></i> 需補血成員 (欠款≥5)</div>
                        <div class="overview-nums">${helpStudents.length > 0 ? helpStudents.map(n => `<span class="num-badge">${n}</span>`).join('') : '<span style="font-size:12px;opacity:0.6;">✅ 全員健康</span>'}</div>
                    </div>
                </div>
            `;
        } else {
            overviewCon.style.display = 'none';
            overviewCon.innerHTML = '';
        }

        let studentDataList = data.roster.map((s, i) => {
            let debts = [];
            data.assignments.forEach(a => {
                if(!a.archived) {
                    const indices = a.assignedIndices || 'all';
                    if(indices === 'all' || indices.includes(i)) {
                        const taskSt = (a.statuses||[])[i] || 0;
                        if(taskSt === 0 || taskSt === 2) {
                            if (hideTodayRedo && taskSt === 2 && a.date === todayStr) return;
                            debts.push({ id: a.id, title: a.title, st: taskSt, date: a.date, subject: a.subject || '其他' });
                        }
                    }
                }
            });
            return { s: s, i: i, debts: debts, debtCount: debts.length };
        });
        if (hideClearStudents) {
        studentDataList = studentDataList.filter(item => item.debtCount > 0);
        }
        studentDataList.sort((a, b) => {
            let valA, valB;
            if (currentSortBy === 'no') { valA = a.s.no; valB = b.s.no; }
            else if (currentSortBy === 'exp') { valA = a.s.exp || 0; valB = b.s.exp || 0; }
            else if (currentSortBy === 'coins') { valA = a.s.coins || 0; valB = b.s.coins || 0; }
            else if (currentSortBy === 'debts') { valA = a.debtCount; valB = b.debtCount; }
            
            if (valA < valB) return currentSortAsc ? -1 : 1;
            if (valA > valB) return currentSortAsc ? 1 : -1;
            return a.s.no - b.s.no; 
        });

// 🌟 優化 1：建立 DocumentFragment 暫存 DOM 節點，避免頻繁觸發畫面重繪
        const fragment = document.createDocumentFragment();
        const grid = document.createElement('div');
        grid.className = 'student-status-grid';
        
        // 🌟 優化 2：宣告變數記錄上一次點選的卡片索引，用於 Shift 區間選擇
        let lastSelectedIndex = -1;
        
        // 注意這裡加入了 loopIndex
        studentDataList.forEach((item, loopIndex) => {
            const { s, i, debts } = item;
            const st = (data.discipline && data.discipline.statuses) ? (data.discipline.statuses[i] || 0) : 0;
            const avatarBg = st === 0 ? '#22c55e' : st === 1 ? '#eab308' : '#ef4444';
            
            let sortedDebts = [...debts];
            if (groupDebtsBySubject) {
                sortedDebts.sort((a, b) => {
                    const subA = a.subject || '其他';
                    const subB = b.subject || '其他';
                    if (subA !== subB) return subA.localeCompare(subB, 'zh-TW'); 
                    if (a.title !== b.title) return a.title.localeCompare(b.title, 'zh-TW');
                    return a.date < b.date ? 1 : -1; 
                });
            } else {
                sortedDebts.sort((a, b) => a.date < b.date ? 1 : -1); 
            }

            let tasksHtml = sortedDebts.map(t => {
                let statusSpan = t.st === 2 ? `<span class="pill p-orange" style="transform:scale(0.85); transform-origin:right center; margin:0;">再訂正</span>` : `<span class="pill p-gray" style="transform:scale(0.85); transform-origin:right center; margin:0;">未交</span>`;
                let subjTag = groupDebtsBySubject ? `<span style="font-size:10px; background:var(--tbl-head); color:var(--primary); padding:2px 4px; border-radius:4px; margin-right:4px;">${t.subject}</span>` : '';
                
                return `<div class="task-item-hover" style="font-size:13px; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; justify-content:space-between; gap:4px; cursor:pointer; padding:4px 0; border-bottom:1px dashed rgba(0,0,0,0.1);" onclick="window.toggleCardTaskStatus(event, ${t.id}, ${i})"><span style="flex:1; overflow:hidden; text-overflow:ellipsis;" title="${t.title}">${subjTag}🔸 ${t.title}</span> ${statusSpan}</div>`;
            }).join('');

            const badgeHtml = (debts.length > 0 && !isBatchExpMode) ? `<div class="debt-badge" style="top:5px; right:0px;" onclick="window.openQuickDebtMenu(event, ${i}, '${encodeURIComponent(JSON.stringify(debts))}')">${debts.length}</div>` : '';
            
            const printBtnHtml = (debts.length > 0 && !isBatchMode && !isBatchExpMode) ? `<i class="bi bi-printer" style="position:absolute; top:12px; right:12px; cursor:pointer; color:var(--muted); font-size:16px; padding:4px; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--muted)'" onclick="window.printSingleStudent(${i})" title="列印卷軸"></i>` : '';
            
            const checkboxTypeClass = isBatchMode ? 'batch-export-checkbox' : 'batch-exp-checkbox';
            const checkboxHtml = (isBatchMode || isBatchExpMode) ? `<input type="checkbox" class="${checkboxTypeClass}" data-sidx="${i}">` : '';

            const card = document.createElement('div');
            card.className = 'd-student-card' + ((isBatchMode || isBatchExpMode) ? ' selectable' : '');
            card.style.alignItems = 'flex-start';
            card.style.textAlign = 'left';
            
            card.innerHTML = `
                ${checkboxHtml}
                ${printBtnHtml}
                <div style="display:flex; width:100%; gap:10px; align-items:center;">
                    <div style="position:relative; flex-shrink:0;">
                        ${badgeHtml}
                        <div class="d-avatar" onclick="window.cycleTrafficLight(${i})" style="background:${avatarBg}; width:48px; height:48px; font-size:22px;">${s.no}</div>
                    </div>
                    <div style="flex:1; min-width:0; padding-right:20px;">
                        <div style="font-weight:900; font-size:20px; display:flex; align-items:baseline; gap:4px; flex-wrap:wrap;">
                            ${s.name} ${getRankHtml(s.exp||0)}
                        </div>
                        <div style="font-size:14px; margin-top:4px; font-weight:bold; color:var(--muted); display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                            <span style="white-space:nowrap;">⭐ <span style="font-size:17px; color:var(--primary);">${s.exp||0}</span></span>
                            <span style="white-space:nowrap;">💰 <span style="font-size:17px; color:#b45309;">${s.coins||0}</span></span>
                            <button class="btn sm ghost" style="border-radius:14px; padding:2px 8px; font-size:12px; color:#d97706; border:1px solid #fcd34d; background:#fffbef; white-space:nowrap; margin-left:auto;" onclick="event.stopPropagation(); window.openSummonModal(${i})" title="花費金幣召喚幻獸">
                                <i class="bi bi-stars"></i> 召喚
                            </button>
                        </div>
                        ${(s.pets && s.pets.length > 0) ? `<div style="font-size:13px; margin-top:6px; display:flex; gap:4px; flex-wrap:wrap;">
                            ${Object.entries((s.pets || []).reduce((acc, pid) => { acc[pid] = (acc[pid] || 0) + 1; return acc; }, {})).map(([pid, count]) => {
                                const pet = gachaPool.find(p => p.id === pid);
                                return pet ? `<span style="background:var(--bg); border:1px solid var(--tbl-border); border-radius:10px; padding:1px 6px; font-size:12px; display:inline-flex; align-items:center; gap:2px;" title="${pet.name}">${pet.img}${count > 1 ? `<small style="font-size:10px; color:var(--primary); font-weight:900;">x${count}</small>` : ''}</span>` : '';
                            }).join('')}
                        </div>` : ''}
                    </div>
                </div>
                
                <div style="width:100%; margin-top:8px; border-top:1px solid rgba(0,0,0,0.05); padding-top:4px; display:${isBatchExpMode ? 'none' : 'block'};">
                    ${tasksHtml || '<div style="color:#888; font-size:12px; text-align:center; padding: 10px 0;">🎉 無欠交作業</div>'}
                </div>

                <div style="display:${isBatchExpMode ? 'flex' : 'none'}; width:100%; align-items:center; gap:4px; margin-top:8px; padding-top:8px; border-top:1px dashed var(--tbl-border);">
                    <button class="btn sm warn ghost icon-only" onclick="window.changeCoin(${i}, -1, '手動扣款')" style="padding:2px 6px;">-1</button>
                    <input type="number" id="scCoinInput_${i}" style="width:40px; padding:2px; text-align:center; font-size:12px;" placeholder="$$">
                    <button class="btn sm ghost icon-only" onclick="window.changeCoin(${i}, 1, '手動獎勵')" style="padding:2px 6px;">+1</button>
                    <button class="btn sm icon-only" onclick="window.applySingleCustomCoin(${i})" style="padding:2px 6px;"><i class="bi bi-check-lg"></i></button>
                </div>
            `;
            
            if (isBatchMode || isBatchExpMode) {
                card.onclick = (e) => {
                    if (e.target.closest('.btn') || e.target.closest('.debt-badge') || e.target.closest('.d-avatar') || e.target.tagName.toLowerCase() === 'input') return;
                    
                    const isSelecting = !card.classList.contains('selected');
                    
                    // 🌟 實作 Shift 多選邏輯
                    if (e.shiftKey && lastSelectedIndex !== -1) {
                        const start = Math.min(lastSelectedIndex, loopIndex);
                        const end = Math.max(lastSelectedIndex, loopIndex);
                        const allCards = grid.querySelectorAll('.d-student-card');
                        
                        for (let j = start; j <= end; j++) {
                            const targetCard = allCards[j];
                            if (isSelecting) {
                                targetCard.classList.add('selected');
                            } else {
                                targetCard.classList.remove('selected');
                            }
                            const cb = targetCard.querySelector('.' + checkboxTypeClass);
                            if (cb) cb.checked = isSelecting;
                        }
                    } else {
                        // 單次點擊切換
                        card.classList.toggle('selected');
                        const cb = card.querySelector('.' + checkboxTypeClass);
                        if (cb) cb.checked = card.classList.contains('selected');
                    }
                    
                    // 更新最後一次點擊的索引
                    lastSelectedIndex = loopIndex;
                };
            }

            grid.appendChild(card);
        });
        
        fragment.appendChild(grid);
        con.innerHTML = ''; // 清空舊內容
        con.appendChild(fragment); // 一次性掛載，減少 Reflow/Repaint
      
    }

    window.applySingleCustomCoin = function(idx) {
        const val = parseInt(document.getElementById(`scCoinInput_${idx}`).value);
        if(!isNaN(val) && val !== 0) {
            window.changeCoin(idx, val, '手動調整');
        }
    };

    window.toggleCardTaskStatus = function(e, aid, sidx) {
        e.stopPropagation();
        const a = data.assignments.find(x => x.id == aid); if(!a) return;
        const currentStatus = a.statuses[sidx] || 0;
        
        if (currentStatus === 2) {
            if (confirm(`【${data.roster[sidx].name}】的「${a.title}」\n是否已完成並改為「討伐成功」？`)) {
                updateStatus(aid, sidx, 3);
            }
        } else {
            pickerTarget = { idx: sidx, aid: aid };
            const picker = document.getElementById('statusPicker');
            picker.style.top = (e.clientY + 10) + 'px'; 
            picker.style.left = (e.clientX + 10) + 'px'; 
            picker.classList.add('show');
        }
    };

    document.getElementById('btnGreenAllExpPlus').addEventListener('click', () => {
        let count = 0;
        const oldRoster = JSON.parse(JSON.stringify(data.roster));
        const oldLogsLength = data.expLogs ? data.expLogs.length : 0;
        
        const activeAssigns = (data.assignments || []).filter(a => !a.archived);
        const todayStr = getTaipeiDateString();
        
        data.roster.forEach((s, i) => {
            let pendingCount = 0;
            for (let a of activeAssigns) {
                const indices = a.assignedIndices || 'all';
                if (indices === 'all' || indices.includes(i)) {
                    const st = (a.statuses || [])[i] || 0;
                    if (st === 0 || st === 2) {
                        if (hideTodayRedo && st === 2 && a.date === todayStr) continue;
                        pendingCount++; 
                    }
                }
            }
            
            if (pendingCount === 0) { 
                window.changeExp(i, 1, '綠燈全體獎勵', true); 
                count++; 
            }
        });
        
        if (count > 0) { 
            playSuccessSound(); 
            triggerAutoSave(); 
            renderAll(); 
            showToast(`✨ 綠燈全體 (${count}人) 獲得 +1 EXP！`, "復原", () => {
                data.roster = oldRoster;
                if(data.expLogs) data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
                triggerAutoSave();
                renderAll();
                showToast("已復原綠燈加分操作！");
            });
        } else {
            showToast("🥺 目前還沒有人達成綠燈條件喔！");
        }
    });
    
    document.getElementById('btnAllClearedPlus').addEventListener('click', () => {
        let count = 0;
        const oldRoster = JSON.parse(JSON.stringify(data.roster));
        const oldLogsLength = data.expLogs ? data.expLogs.length : 0;
        
        const activeAssigns = (data.assignments || []).filter(a => !a.archived);
        
        data.roster.forEach((s, i) => {
            let pendingCount = 0;
            for (let a of activeAssigns) {
                const indices = a.assignedIndices || 'all';
                const todayStr = getTaipeiDateString();
                if (indices === 'all' || indices.includes(i)) {
                    const st = (a.statuses || [])[i] || 0;
                    if (st === 0 || st === 2) {
                        if (hideTodayRedo && st === 2 && a.date === todayStr) continue;
                        pendingCount++; 
                    }
                }
            }
            
            if (pendingCount === 0) { 
                changeCoin(i, 1, '全冠王獎勵', true); 
                count++; 
            }
        });
        
        if (count > 0) { 
            playSuccessSound(); 
            triggerAutoSave(); 
            renderAll(); 
            showToast(`🏆 討伐全冠王 (${count}人) 獲得 +1 金幣！`, "復原", () => {
                data.roster = oldRoster;
                if(data.expLogs) data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
                triggerAutoSave();
                renderAll();
                showToast("已復原全冠王加分操作！");
            });
        } else {
            showToast("🥺 目前還沒有人成為討伐全冠王喔！");
        }
    });

    window.cycleTrafficLight = function(sidx) { 
        data.discipline.statuses[sidx] = ((data.discipline.statuses[sidx] || 0) + 1) % 3; 
        triggerAutoSave(); 
        renderStudentStatus(); 
    };

    window.renderCoinDropdowns = function() {
        const sp = document.getElementById('selBatchPlus');
        const sm = document.getElementById('selBatchMinus');
        if(sp && data.coinPresets && data.coinPresets.plus) {
            sp.innerHTML = data.coinPresets.plus.map(p => `<option value="${p.v}|${p.l}">+${p.v} ${p.l}</option>`).join('');
        }
        if(sm && data.coinPresets && data.coinPresets.minus) {
            sm.innerHTML = data.coinPresets.minus.map(p => `<option value="${p.v}|${p.l}">${p.v} ${p.l}</option>`).join('');
        }
    };

    window.applySelectedBatchCoin = function(type) {
        const sel = document.getElementById(type === 'plus' ? 'selBatchPlus' : 'selBatchMinus');
        if(!sel || !sel.value) return;
        const [val, label] = sel.value.split('|');
        window.applyBatchCoin(parseInt(val), label);
    };

    document.getElementById('btnToggleBatchExp').addEventListener('click', () => { 
        isBatchExpMode = !isBatchExpMode; 
        if (isBatchExpMode) isBatchMode = false; 
        
        const btnSelectAll = document.getElementById('btnBatchSelectAll');
        if (isBatchExpMode || isBatchMode) { btnSelectAll.style.display = 'inline-block'; } 
        else { btnSelectAll.style.display = 'none'; }
        
        renderStudentStatus(); 
    });

    window.applyBatchCoin = function(delta, presetReason) {
        const checked = document.querySelectorAll('.batch-exp-checkbox:checked');
        if (!checked.length) { alert("請先勾選學生！"); return; }
        
        const oldRoster = JSON.parse(JSON.stringify(data.roster));
        const oldLogsLength = data.expLogs ? data.expLogs.length : 0;

        checked.forEach(cb => {
            const idx = parseInt(cb.dataset.sidx);
            changeCoin(idx, delta, presetReason, true);
            cb.checked = false; 
        });
        
        playSuccessSound();
        showToast(`✨ 已為 ${checked.length} 名學生套用：${presetReason} (${delta>0?'+'+delta:delta} 金幣)`, "復原", () => {
            data.roster = oldRoster;
            if(data.expLogs) data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
            triggerAutoSave(); renderAll();
        });
        triggerAutoSave(); renderAll();
    };

    window.applyCustomBatchCoin = function() {
        const val = parseInt(document.getElementById('customExpVal').value);
        const reason = document.getElementById('customExpReason').value || '自訂調整';
        if (isNaN(val)) { alert("請輸入分數"); return; }
        window.applyBatchCoin(val, reason);
        document.getElementById('customExpVal').value = '';
        document.getElementById('customExpReason').value = '';
    };

      function generateScrollHTML(studentData, debts) {
        debts.sort((a, b) => a.title.localeCompare(b.title, 'zh-TW'));
        let tasksHtml = debts.map(t => {
            let statusText = t.st === 2 ? '需再訂正' : '尚未繳交';
            let dateText = t.date ? t.date : '無日期';
            let statusColor = t.st === 2 ? '#e65100' : '#d32f2f';
            return `
                <div style="display: flex; align-items: flex-start; border-bottom: 1px dashed #ccc; padding: 6px 0; font-size: 14px; line-height: 1.4;">
                    <div style="width: 14px; height: 14px; border: 1.5px solid #333; margin-right: 8px; border-radius: 3px; flex-shrink: 0; margin-top: 2px;"></div>
                    <div style="flex: 1; font-weight: bold; color: #222;">
                        ${t.title} <span style="color:#666; font-size: 12px; font-weight: normal;">(${dateText})</span> <span style="color:${statusColor}; margin-left: 4px;">${statusText}</span>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div style="border: 2px dashed #888; padding: 15px; border-radius: 8px; background: #fff; font-family: 'Microsoft JhengHei', sans-serif; page-break-inside: avoid; width: 100%; box-sizing: border-box; position: relative;">
                <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #000; border-bottom: 2px solid #000; padding-bottom: 5px; text-align: center;">
                    ${studentData.name} 的任務單
                </h2>
                
                <div style="margin-bottom: 15px;">
                    ${tasksHtml}
                </div>
                
                <div style="display: flex; justify-content: flex-end; align-items: flex-end; margin-top: 15px;">
                    <div style="font-size: 14px; font-weight: bold;">家長簽名：</div>
                    <div style="border-bottom: 1px solid #000; width: 120px; margin-left: 5px;"></div>
                </div>
            </div>
        `;
    }

    window.printSingleStudent = function(idx) {
        const student = data.roster[idx];
        let debts = [];
        data.assignments.forEach(a => {
            if(!a.archived) {
                const indices = a.assignedIndices || 'all';
                if(indices === 'all' || indices.includes(idx)) {
                    const taskSt = (a.statuses||[])[idx] || 0;
                    if(taskSt === 0 || taskSt === 2) debts.push({ title: a.title, st: taskSt, date: a.date });
                }
            }
        });
        
        if(debts.length === 0) {
            showToast("🎉 該名冒險者目前無欠款，無須列印！");
            return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html><head><title>列印任務單</title>
            <style>
                @page { size: A4; margin: 10mm; }
                body { margin: 0; padding: 20px; background: #fff; display: flex; justify-content: center; }
                .single-container { width: 100%; max-width: 400px; }
            </style>
            </head><body>
            <div class="single-container">
                ${generateScrollHTML(student, debts)}
            </div>
            </body></html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 500);
    };

    document.getElementById('btnToggleBatchMode').addEventListener('click', () => { 
        isBatchMode = !isBatchMode; 
        if (isBatchMode) isBatchExpMode = false; 
        
        const btnSelectAll = document.getElementById('btnBatchSelectAll');
        if (isBatchExpMode || isBatchMode) { btnSelectAll.style.display = 'inline-block'; } 
        else { btnSelectAll.style.display = 'none'; }
        
        renderStudentStatus(); 
    });

    document.getElementById('btnBatchSelectAll').addEventListener('click', () => {
        const cards = document.querySelectorAll('.d-student-card.selectable');
        const cbs = document.querySelectorAll(isBatchMode ? '.batch-export-checkbox' : '.batch-exp-checkbox');
        const allChecked = Array.from(cbs).every(c => c.checked);
        
        cbs.forEach(c => c.checked = !allChecked);
        cards.forEach(card => {
            if (!allChecked) card.classList.add('selected');
            else card.classList.remove('selected');
        });
    });

    document.getElementById('btnBatchExport').addEventListener('click', () => {
        const checked = document.querySelectorAll('.batch-export-checkbox:checked');
        if (checked.length === 0) { 
            alert("⚠️ 請先點選小卡，選取要列印卷軸的冒險者！"); 
            return; 
        }
        
        let printQueue = [];
        
        checked.forEach(cb => {
            const idx = parseInt(cb.dataset.sidx);
            const student = data.roster[idx];
            let debts = [];
            data.assignments.forEach(a => {
                if(!a.archived) {
                    const indices = a.assignedIndices || 'all';
                    if(indices === 'all' || indices.includes(idx)) {
                        const taskSt = (a.statuses||[])[idx] || 0;
                        if(taskSt === 0 || taskSt === 2) debts.push({ title: a.title, st: taskSt, date: a.date });
                    }
                }
            });
            if(debts.length > 0) {
                printQueue.push({ student: student, debts: debts, count: debts.length });
            }
        });

        printQueue.sort((a, b) => b.count - a.count);

        let allHtml = printQueue.map(item => generateScrollHTML(item.student, item.debts)).join('');

        if(!allHtml) { 
            showToast("🎉 勾選的冒險者皆無欠款！"); 
            return; 
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html><head><title>批量列印任務單</title>
            <style>
                @page { size: A4; margin: 10mm; }
                body { margin: 0; padding: 0; background: #fff; font-family: "Microsoft JhengHei", sans-serif; }
                .print-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                @media (max-width: 600px) { .print-grid { grid-template-columns: 1fr; } }
            </style>
            </head><body>
            <div class="print-grid">
                ${allHtml}
            </div>
            </body></html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 500);
    });
    
    function initAttendanceView() {
        const date = document.getElementById('attDatePicker').value;
        if (!data.attendance[date]) {
            data.attendance[date] = data.roster.map(() => ({ status: 0, note: '' }));
            triggerAutoSave();
        }
        renderAttendanceUI();
    }

    function renderAttendanceUI() {
        const date = document.getElementById('attDatePicker').value;
        const currentData = data.attendance[date];
        const list = document.getElementById('attendanceList');
        list.innerHTML = '';
        
        let stats = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0};

        data.roster.forEach((s, i) => {
            const r = currentData[i] || { status: 0, note: '' };
            if(stats[r.status] !== undefined) stats[r.status]++;
            
            const div = document.createElement('div'); div.className = 'att-card';
            let btns = '';
            
            [{id:0,l:'出席'},{id:1,l:'遲到'},{id:2,l:'早退'},{id:3,l:'病假'},{id:5,l:'事假'},{id:4,l:'公假'}].forEach(o => {
                btns += `<button class="att-btn ${r.status===o.id?'active':''}" data-status="${o.id}" onclick="window.setAttStatus('${date}', ${i}, ${o.id})">${o.l}</button>`;
            });
            
            let noteHtml = '';
            if (r.note) {
                let isTime = /^\d{2}:\d{2}$/.test(r.note);
                let noteColor = isTime ? '#1d4ed8' : 'var(--danger)';
                let noteBg = isTime ? '#dbeafe' : '#fee2e2';
                let noteBorder = isTime ? '#bfdbfe' : '#fecaca';
                let noteIcon = isTime ? 'bi-clock' : 'bi-pencil';
                noteHtml = `<span class="att-note" style="display:inline-block; background:${noteBg}; color:${noteColor}; border-color:${noteBorder}; padding: 4px 8px; border-radius: 12px;"><i class="bi ${noteIcon}"></i> ${r.note}</span>`;
            }

            div.innerHTML = `<div class="att-no">${s.no}</div><div class="att-name">${s.name} ${noteHtml}</div><div style="display:flex; flex-wrap:wrap; gap:4px;">${btns}</div>`;
            list.appendChild(div);
        });

        document.getElementById('statPresent').innerText = stats[0];
        document.getElementById('statLate').innerText = stats[1];
        document.getElementById('statEarly').innerText = stats[2];
        document.getElementById('statSick').innerText = stats[3];
        document.getElementById('statPersonal').innerText = stats[5];
        document.getElementById('statOfficial').innerText = stats[4];
    }

    window.setAttStatus = function(date, idx, status) {
        let note = '';
        if (status === 2 || status === 3) {
            const t = prompt("請輸入備註 (例如：發燒、14:00 早退)：");
            if (t) note = t;
        }
        data.attendance[date][idx] = { status, note };
        triggerAutoSave();
        renderAttendanceUI();
    };

    document.getElementById('btnExportAttendance').addEventListener('click', () => {
        if (!data.attendance || Object.keys(data.attendance).length === 0) {
            showToast("⚠️ 目前沒有任何點名紀錄可以匯出！");
            return;
        }

        const allDates = Object.keys(data.attendance).sort();
        const statusMap = { 0: '出席', 1: '遲到', 2: '早退', 3: '病假', 4: '公假', 5: '事假' };
        
        let csv = "\uFEFF座號,姓名,出席(天),遲到(次),早退(次),病假(天),事假(天),公假(天)";
        allDates.forEach(date => {
            csv += `,${date}`; 
        });
        csv += "\n";

        data.roster.forEach((s, i) => {
            let counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            let dailyRecords = [];

            allDates.forEach(date => {
                const record = data.attendance[date][i];
                if (record) {
                    counts[record.status]++; 
                    
                    let text = statusMap[record.status];
                    if (record.note) text += ` (${record.note.replace(/"/g, '""')})`;
                    dailyRecords.push(`"${text}"`);
                } else {
                    dailyRecords.push(`"-"`); 
                }
            });

            csv += `${s.no},${s.name},${counts[0]},${counts[1]},${counts[2]},${counts[3]},${counts[5]},${counts[4]}`;
            if (dailyRecords.length > 0) {
                csv += `,${dailyRecords.join(',')}`;
            }
            csv += "\n";
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `公會出缺勤統計總表_${getTaipeiDateString()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`📊 成功匯出點名統計！共統計 ${allDates.length} 天`);
    });

    
    document.getElementById('attDatePicker').addEventListener('change', initAttendanceView);
    document.getElementById('btnSaveAttendance').addEventListener('click', () => { 
    const date = document.getElementById('attDatePicker').value;
    const currentData = data.attendance[date];
    
    if (!currentData.rewarded) {
        let rewardedCount = 0;
        data.roster.forEach((s, i) => {
            if (currentData[i] && currentData[i].status === 0) {
                window.changeCoin(i, 1, '本日出席獎勵', true); 
                rewardedCount++;
            }
        });
        currentData.rewarded = true; 
        
        if (rewardedCount > 0) {
            window.playSuccessSound();
            setTimeout(() => window.showToast(`✨ 已自動為 ${rewardedCount} 位出席冒險者發放獎勵！`), 500);
        }
    }
    
    showToast("✅ 點名已儲存同步！"); 
    triggerAutoSave(); 
    renderAll();
});
    
    document.getElementById('btnGoToAttendance').addEventListener('click', () => {
        document.getElementById('attendanceReminderModal').classList.remove('show');
        document.getElementById('attDatePicker').value = getTaipeiDateString();
        switchView('view-attendance');
    });

    document.getElementById('btnAdminAttendance').addEventListener('click', () => { 
        document.getElementById('adminProfileModal').classList.remove('show'); 
        document.getElementById('attDatePicker').value = getTaipeiDateString(); 
        switchView('view-attendance'); 
    });

    document.getElementById('btnAdminRoster').addEventListener('click', () => { 
        document.getElementById('adminProfileModal').classList.remove('show'); 
        switchView('view-roster'); 
    });

    function renderRosterEditor() {
        const d = document.getElementById('rosterEditor'); d.innerHTML = '';
        data.roster.forEach(s => {
            // ⭐ 編輯名單時加入小組設定
            d.innerHTML += `<div class="roster-item"><input type="number" value="${s.no}" class="roster-no-input"><input value="${s.name}" class="roster-name-input"><input type="number" value="${s.group || 1}" class="roster-group-input" style="width:60px; padding:8px;" title="組別" placeholder="組別"></div>`;
        });
        if (document.getElementById('roster-content-teachers').classList.contains('show')) {
            renderTeacherEditor();
        }
    }

    function renderTeacherEditor() {
        const d = document.getElementById('teacherEditor'); d.innerHTML = '';
        const teachersList = (data.teachers && data.teachers.length > 0) ? data.teachers : ["公會長"];
        
        teachersList.forEach(t => {
            d.innerHTML += `
                <div class="teacher-item" style="display:flex; gap:8px; margin-bottom:8px;">
                    <input value="${t}" class="teacher-name-input" style="flex:1; padding:8px;">
                    <button class="btn sm warn icon-only" onclick="this.parentElement.remove()" title="刪除"><i class="bi bi-trash"></i></button>
                </div>`;
        });
        
        const addBtn = document.createElement('button');
        addBtn.className = 'btn sm ghost';
        addBtn.style.marginTop = '8px';
        addBtn.innerHTML = '<i class="bi bi-plus-lg"></i> 新增公會長';
        addBtn.onclick = () => {
            const div = document.createElement('div');
            div.className = 'teacher-item';
            div.style.cssText = 'display:flex; gap:8px; margin-bottom:8px;';
            div.innerHTML = `<input class="teacher-name-input" style="flex:1; padding:8px;" placeholder="輸入公會長名稱"><button class="btn sm warn icon-only" onclick="this.parentElement.remove()" title="刪除"><i class="bi bi-trash"></i></button>`;
            d.insertBefore(div, addBtn);
        };
        d.appendChild(addBtn);
    }

    document.getElementById('btnApplyTeachers').addEventListener('click', () => {
        const inputs = document.querySelectorAll('.teacher-name-input');
        const newTeachers = [];
        inputs.forEach(ip => {
            const val = ip.value.trim();
            if (val) newTeachers.push(val);
        });
        
        if (newTeachers.length === 0) {
            showToast("⚠️ 至少需要保留一位公會長！");
            return;
        }
        
        data.teachers = newTeachers; 
        triggerAutoSave(); 
        populateTeacherDropdowns(); 
        showToast("✅ 公會長名冊已更新");
    });

    document.getElementById('btnAddStudentRow').addEventListener('click', () => {
        const div = document.getElementById('rosterEditor'); const c = div.querySelectorAll('.roster-item').length + 1;
        const d = document.createElement('div'); d.className = 'roster-item';
        // 新增預設組別
        d.innerHTML = `<input type="number" value="${c}" class="roster-no-input"><input class="roster-name-input"><input type="number" value="1" class="roster-group-input" style="width:60px; padding:8px;" title="組別" placeholder="組別">`;
        div.appendChild(d);
    });

    document.getElementById('btnApplyRoster').addEventListener('click', () => {
        const r = [];
        document.querySelectorAll('.roster-item').forEach(d => {
            const no = parseInt(d.querySelector('.roster-no-input').value);
            const name = d.querySelector('.roster-name-input').value.trim();
            const group = parseInt(d.querySelector('.roster-group-input').value) || 1;
            if(no && name) {
                const existing = data.roster.find(x => x.no === no && x.name === name);
                r.push({ no, name, group, exp: existing ? existing.exp : 0, coins: existing ? existing.coins : 0, maxExp: existing ? existing.maxExp : 0, pets: existing && Array.isArray(existing.pets) ? existing.pets : [] });
            }
        });
        data.roster = r; triggerAutoSave(); showToast("✅ 名單已更新");
    });

    function renderChecklists() {
        const buildList = (items, cid) => { 
            const container = document.getElementById(cid);
            if(container) {
                container.innerHTML = items.map((item, idx) => `
                    <div class="checklist-item" onclick="this.classList.toggle('done')">
                        <div style="width: 28px; height: 28px; border-radius: 50%; background: #fff; color: var(--primary); display:grid; place-items:center; border: 2px solid var(--primary); font-size:14px;">${idx+1}</div>
                        ${item}
                    </div>`).join(''); 
            }
        };
        buildList(['💧 喝滿水壺', '📚 準備下節課本', '🧹 桌面淨空', '🚻 上廁所'], 'recessChecklist'); 
        buildList(['🗑️ 座位周邊無垃圾', '🪑 椅子靠攏', '📓 聯絡簿帶齊', '🎒 整理背包'], 'dismissalChecklist');
    }

    document.getElementById('btnLoadFromPaste').addEventListener('click', () => {
        const text = document.getElementById('taRosterPaste').value.trim();
        if (!text) {
            showToast("⚠️ 請先在文字框內貼上名單！");
            return;
        }

        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        const isReplace = confirm("請問要「取代」現有名單嗎？\n\n[確定]：清空現有名單，完全替換\n[取消]：接續附加在現有名單最後面");

        if (isReplace) {
            data.roster = lines.map((name, idx) => ({ no: idx + 1, name: name, group: 1, exp: 0, coins: 0, maxExp: 0 }));
        } else {
            let startNo = data.roster.length > 0 ? Math.max(...data.roster.map(s => s.no)) + 1 : 1;
            const newRoster = lines.map((name, idx) => ({ no: startNo + idx, name: name, group: 1, exp: 0, coins: 0, maxExp: 0 }));
            data.roster = data.roster.concat(newRoster);
        }

        document.getElementById('taRosterPaste').value = '';
        document.getElementById('detailsRosterPaste').removeAttribute('open');
        renderRosterEditor();
        triggerAutoSave();
        showToast("✅ 名單已成功匯入並自動儲存！");
    });

    document.getElementById('btnCloseRosterPaste').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('detailsRosterPaste').removeAttribute('open');
    });

    window.editAssignmentTitle = function(id) {
        const a = data.assignments.find(x => x.id == id);
        if(!a) return;
        const newTitle = prompt("請輸入新的委託內容：", a.title);
        if(newTitle && newTitle.trim() !== "") {
            a.title = newTitle.trim(); triggerAutoSave();
            renderDashboardDetail(id); renderDashboard();
        }
    }

    const toolTipEl = document.getElementById('assignmentTooltip');
    window.showAssignmentTooltip = function(e, a) {
        if (!a) return;
        const indices = a.assignedIndices || 'all'; const missing = []; const redo = [];
        data.roster.forEach((s, i) => {
            if (indices === 'all' || indices.includes(i)) {
                const status = (a.statuses || [])[i] || 0;
                if (status === 0) missing.push(s.no); if (status === 2) redo.push(s.no);
            }
        });
        if (missing.length === 0 && redo.length === 0) return;
        let html = `<h4>${a.title}</h4><ul>`;
        if (redo.length) html += `<li class="t-redo">再戰：${redo.join(', ')}</li>`;
        if (missing.length) html += `<li class="t-miss">未交：${missing.join(', ')}</li>`;
        html += `</ul>`;
        toolTipEl.innerHTML = html; toolTipEl.style.display = 'block'; moveAssignmentTooltip(e);
    };

    window.moveAssignmentTooltip = function(e) {
        const x = (e.clientX + 15) / APP_SCALE; const y = (e.clientY + 15) / APP_SCALE;
        toolTipEl.style.top = y + 'px'; toolTipEl.style.left = x + 'px';
        const rect = toolTipEl.getBoundingClientRect();
        if((x * APP_SCALE + rect.width) > window.innerWidth) toolTipEl.style.left = ((e.clientX - rect.width - 10) / APP_SCALE) + 'px';
        if((y * APP_SCALE + rect.height) > window.innerHeight) toolTipEl.style.top = ((e.clientY - rect.height - 10) / APP_SCALE) + 'px';
    };
    
    window.hideAssignmentTooltip = function() { toolTipEl.style.display = 'none'; };

    const userBadge = document.getElementById('userEmailDisplay');
    if(userBadge) {
        userBadge.addEventListener('click', () => {
            const list = document.getElementById('adminDebtList'); 
            if (list) {
                list.innerHTML = ''; 
                const debts = [];
                data.roster.forEach((s, idx) => {
                    let c = 0; 
                    data.assignments.forEach(a => { 
                        if(!a.archived) { 
                            const st = (a.statuses||[])[idx]||0; 
                            if(st===0||st===2) c++; 
                        } 
                    });
                    if(c>=5) debts.push({name: s.name, c});
                });
                if(debts.length) debts.forEach(d => list.innerHTML += `<span style="background:#fee2e2;color:#b91c1c;padding:6px 12px;border-radius:20px;font-weight:bold;margin-right:8px;">${d.name} (${d.c})</span>`);
                else list.innerHTML = '<p style="color:var(--success)">目前無人欠款！</p>';
            }
            document.getElementById('adminProfileModal').classList.add('show');
        });
    }

    document.getElementById('btnDownloadArchive').addEventListener('click', () => {
        const arcs = data.assignments.filter(a => a.archived); 
        if(!arcs.length) { alert("無封存資料"); return; }
        let csv = "\uFEFF發布日期,內容,導師," + data.roster.map(s => s.name).join(",") + "\n";
        arcs.forEach(a => { 
            const st = a.statuses || []; 
            csv += `${a.date},"${a.title}",${a.teacher},` + data.roster.map((_, i) => ["未","交","改","完"][st[i]||0]).join(",") + "\n"; 
        });
        const url = URL.createObjectURL(new Blob([csv], {type:"text/csv"})); 
        const el = document.createElement("a"); el.href=url; el.download="封存.csv"; el.click();
    });

document.getElementById('btnExportJSON').addEventListener('click', () => {
    const backupData = JSON.stringify(data, null, 2);
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = getTaipeiDateString();
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `AdventurerGuild_Backup_${dateStr}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast("💾 備份檔案已產生並下載");
});

document.getElementById('btnImportJSONTrigger').addEventListener('click', () => {
    document.getElementById('ipImportJSON').click();
});


    // ...接續前面的程式碼 (大約在第 1195 行左右)

    document.getElementById('ipImportJSON').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                
                // 基礎格式檢查：確認是否有關鍵欄位
                if (!importedData.roster || !Array.isArray(importedData.roster)) {
                    throw new Error("格式不正確：找不到冒險者名冊資料");
                }

                if (confirm("⚠️ 注意：還原備份將會覆蓋掉目前公會的所有資料（包含等級、任務與點名紀錄）。\n\n確定要繼續嗎？")) {
                    // 更新記憶體中的資料
                    data = importedData;
                    
                    // 強制觸發存檔到 Firebase
                    triggerAutoSave();
                    
                    // 重新初始化整個 App 介面
                    onDataLoaded(); 
                    
                    showToast("✅ 資料還原成功，已同步至雲端！");
                    
                    // 關閉執務室視窗
                    document.getElementById('adminProfileModal').classList.remove('show');
                }
            } catch (err) {
                console.error("還原失敗:", err);
                alert("❌ 還原失敗：檔案內容格式錯誤或已損壞。\n" + err.message);
            }
            // 清空 input 讓下次選同一個檔案也能觸發 change
            e.target.value = '';
        };
        reader.readAsText(file);
    });

    document.getElementById('btnDownloadExpLogs').addEventListener('click', () => {
        if(!data.expLogs || data.expLogs.length === 0) { alert("目前無任何 EXP 異動紀錄"); return; }
        let csv = "\uFEFF紀錄時間,姓名,變動,原因\n";
        data.expLogs.forEach(log => {
            csv += `"${log.time}","${log.name}","${log.delta}","${log.reason}"\n`;
        });
        const url = URL.createObjectURL(new Blob([csv], {type:"text/csv"})); 
        const el = document.createElement("a"); el.href=url; el.download="EXP_異動紀錄.csv"; el.click();
    });

    document.getElementById('btnClearAssignments').addEventListener('click', () => { 
        if(confirm("警告：這將銷毀所有任務與出缺席紀錄！\n確定要繼續嗎？")) { 
            
            const clearExp = confirm("是否要一併【清空】所有冒險者的「經驗值」與「金幣」？\n\n[確定]：連同經驗值、金幣與最高等級一起歸零\n[取消]：只刪除任務，保留現有等級與財產");
            
            data.assignments = []; 
            data.attendance = {}; 
            
            if (clearExp) {
                data.roster.forEach(s => {
                    s.exp = 0;
                    s.coins = 0;
                    s.maxExp = 0; 
                });
                data.expLogs = []; 
                showToast("🔥 已銷毀契約，並將冒險者等級與金幣全部歸零！");
            } else {
                showToast("✨ 已銷毀契約，但為冒險者保留了目前的等級與金幣！");
            }
            
            triggerAutoSave(); 
            renderAll(); 
            document.getElementById('adminProfileModal').classList.remove('show'); 
        } 
    });
    
    document.getElementById('btnResetAll').addEventListener('click', () => { 
        if(prompt("輸入 DESTROY 以重置一切") === "DESTROY") { 
            data.roster = []; data.assignments = []; data.attendance = {}; data.discipline = null; data.expLogs = []; triggerAutoSave(); renderAll(); document.getElementById('adminProfileModal').classList.remove('show'); 
        } 
    });

    ['btnNavDashboard','btnNavStudentStatus'].forEach(id => {
        document.getElementById(id).addEventListener('click', (e) => {
            const map = { 'btnNavDashboard':'view-dashboard', 'btnNavStudentStatus':'view-student-status' };
            switchView(map[e.currentTarget.id]);
        });
    });

    ['teacherFilter','subjectFilter'].forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener('change', (e) => { 
                currentFilter[id.replace('Filter','')] = e.target.value; 
                renderDashboard(); 
            });
        }
    });

    document.getElementById('btnClearFilter').addEventListener('click', () => { 
        currentFilter = { teacher: 'all', subject: 'all' }; 
        document.getElementById('teacherFilter').value = 'all'; 
        document.getElementById('subjectFilter').value = 'all'; 
        renderDashboard(); 
    });

    function populateTeacherDropdowns() {
        const ts = data.teachers || []; 
        const sel = document.getElementById('ipTeacherSelect'); 
        if(sel) { 
            sel.innerHTML = ts.map(t => `<option value="${t}">${t}</option>`).join('') + '<option value="custom">自行輸入...</option>'; 
            document.getElementById('ipTeacherCustom').style.display = sel.value === 'custom' ? 'block' : 'none'; 
        }
        
        const fil = document.getElementById('teacherFilter');
        if(fil) { 
            fil.innerHTML = '<option value="all">所有公會長</option>' + ts.map(t => `<option value="${t}">${t}</option>`).join(''); 
            fil.value = currentFilter.teacher; 
        }
    }
    
    function updateSubjectDropdown() {
        const db = data.questSettings || defaultData.questSettings; 
        const sel = document.getElementById('selSubject'); 
        const fil = document.getElementById('subjectFilter');
        
        if(sel) {
            sel.innerHTML = '<option value="">📂 科目...</option>'; 
            Object.keys(db).forEach(s => { sel.add(new Option(s, s)); });
        }
        if(fil) { 
            fil.innerHTML = '<option value="all">📚 所有科目</option>';
            Object.keys(db).forEach(s => { fil.add(new Option(s, s)); });
            fil.value = currentFilter.subject;
        }
    }

    function resetNewAssignmentState() {
        document.getElementById('ipTitle').value = ''; 
        document.getElementById('selSubject').value = ''; 
        document.getElementById('selPresetTask').innerHTML = '<option value="">📜 常用...</option>';
        document.getElementById('ipDate').value = getTaipeiDateString(); 
        newAssignmentAssignedIndices = []; 
        document.getElementById('assignStatusText').innerText = "發布給：全體冒險者";
        const sel = document.getElementById('ipTeacherSelect'); 
        if(sel && data.teachers && data.teachers.length > 0) { 
            sel.value = data.teachers[0]; 
            document.getElementById('ipTeacherCustom').style.display = 'none'; 
        }
    }

    document.getElementById('btnOpenNewQuestWindowSidebar').addEventListener('click', () => { 
        resetNewAssignmentState(); 
        document.getElementById('panelNewQuest').classList.add('show'); 
    });

    document.getElementById('ipTeacherSelect').addEventListener('change', (e) => {
        document.getElementById('ipTeacherCustom').style.display = e.target.value === 'custom' ? 'block' : 'none';
    });

    document.getElementById('selSubject').addEventListener('change', (e) => { 
        const sel = document.getElementById('selPresetTask'); 
        sel.innerHTML = '<option value="">📜 常用任務...</option>'; 
        if(e.target.value && data.questSettings[e.target.value]) {
            data.questSettings[e.target.value].forEach(t => sel.add(new Option(t, t))); 
        }
    });

    document.getElementById('selPresetTask').addEventListener('change', (e) => { 
        if(e.target.value) document.getElementById('ipTitle').value = e.target.value; 
    });

    document.getElementById('btnToggleKeypad').addEventListener('click', () => { 
        const kp = document.getElementById('virtualKeypad'); 
        kp.style.display = kp.style.display === 'none' || kp.style.display === '' ? 'flex' : 'none'; 
    });

    document.getElementById('virtualKeypad').addEventListener('click', (e) => { 
        if(e.target.classList.contains('vk-btn')) { 
            const val = e.target.dataset.val; const ip = document.getElementById('ipTitle'); 
            if (val === 'backspace') ip.value = ip.value.slice(0, -1); 
            else if (val === 'clear') ip.value = ''; 
            else if (val === 'space') ip.value += ' '; 
            else ip.value += val; 
            ip.focus(); 
        } 
    });

    document.getElementById('btnCreate').addEventListener('click', () => {
        let t = document.getElementById('ipTeacherSelect').value; 
        if(t === 'custom') t = document.getElementById('ipTeacherCustom').value.trim();
        const title = document.getElementById('ipTitle').value.trim(); 
        const sub = document.getElementById('selSubject').value; 
        const d = document.getElementById('ipDate').value;
        
        if(!t || !title || !d) { showToast("⚠️ 請填寫完整內容"); return; }
        
        if(!data.teachers.includes(t)) data.teachers.push(t);
        const isAll = !newAssignmentAssignedIndices.length || newAssignmentAssignedIndices.length === data.roster.length;
        
        data.assignments.push({ 
            id: Date.now(), title, teacher: t, subject: sub, date: d, 
            assignedIndices: isAll ? 'all' : newAssignmentAssignedIndices, 
            statuses: Array(data.roster.length).fill(0),
            cheered: false
        });
        
        triggerAutoSave(); 
        renderAll(); 
        document.getElementById('panelNewQuest').classList.remove('show'); 
        showToast("✨ 新委託已發布！");
    });

    document.getElementById('btnOpenQuestSettings').addEventListener('click', () => { 
        tempQuestSettings = JSON.parse(JSON.stringify(data.questSettings)); 
        renderQuestConfig(); 
        document.getElementById('questSettingsModal').classList.add('show'); 
    });
    
    function renderQuestConfig() {
        const list = document.getElementById('questConfigList'); list.innerHTML = '';
        Object.keys(tempQuestSettings).forEach(sub => {
            const div = document.createElement('div'); div.className = 'quest-config-card';
            div.innerHTML = `<div class="quest-config-header"><span class="quest-config-title">${sub}</span><button class="btn sm warn btn-del-subj" data-sub="${sub}"><i class="bi bi-trash"></i> 移除</button></div><div class="quest-tags">${tempQuestSettings[sub].map((t, i) => `<span class="quest-tag">${t} <i class="bi bi-x-circle-fill btn-del-task" data-sub="${sub}" data-idx="${i}"></i></span>`).join('')}</div><div class="quest-add-row"><input placeholder="輸入新任務名稱..." id="newT_${sub}" style="flex:1; font-size:13px; padding:6px;"><button class="btn sm btn-add-task" data-sub="${sub}"><i class="bi bi-plus-lg"></i> 新增</button></div>`;
            list.appendChild(div);
        });
    }
    
    document.getElementById('questConfigList').addEventListener('click', (e) => {
        if(e.target.closest('.btn-del-subj')) { const s = e.target.closest('.btn-del-subj').dataset.sub; if(confirm(`確定要移除【${s}】科目嗎？`)) { delete tempQuestSettings[s]; renderQuestConfig(); } }
        else if(e.target.closest('.btn-del-task')) { const t = e.target.closest('.btn-del-task'); const s = t.dataset.sub; const i = parseInt(t.dataset.idx); tempQuestSettings[s].splice(i, 1); renderQuestConfig(); }
        else if(e.target.closest('.btn-add-task')) { const s = e.target.closest('.btn-add-task').dataset.sub; const ip = document.getElementById(`newT_${s}`); if(ip.value.trim()) { tempQuestSettings[s].push(ip.value.trim()); renderQuestConfig(); } }
    });
    
    document.getElementById('btnAddSubject').addEventListener('click', () => { const v = document.getElementById('ipNewSubject').value.trim(); if(v && !tempQuestSettings[v]) { tempQuestSettings[v] = []; document.getElementById('ipNewSubject').value=''; renderQuestConfig(); } });
    document.getElementById('btnSaveQuestSettings').addEventListener('click', () => { data.questSettings = tempQuestSettings; triggerAutoSave(); updateSubjectDropdown(); document.getElementById('questSettingsModal').classList.remove('show'); showToast("⚙️ 任務選單設定已儲存"); });

    let currentCoinTab = 'plus';
    let tempCoinPresets = {};

    document.getElementById('btnOpenCoinSettings').addEventListener('click', () => {
        document.getElementById('adminProfileModal').classList.remove('show');
        tempCoinPresets = JSON.parse(JSON.stringify(data.coinPresets));
        currentCoinTab = 'plus';
        updateCoinTabUI();
        renderCoinConfig();
        document.getElementById('coinSettingsModal').classList.add('show');
    });

    function updateCoinTabUI() {
        document.getElementById('btnCoinTabPlus').className = currentCoinTab === 'plus' ? 'btn sm' : 'btn sm ghost';
        document.getElementById('btnCoinTabMinus').className = currentCoinTab === 'minus' ? 'btn sm warn' : 'btn sm ghost';
    }

    document.getElementById('btnCoinTabPlus').onclick = () => { currentCoinTab = 'plus'; updateCoinTabUI(); renderCoinConfig(); };
    document.getElementById('btnCoinTabMinus').onclick = () => { currentCoinTab = 'minus'; updateCoinTabUI(); renderCoinConfig(); };

    function renderCoinConfig() {
        const list = document.getElementById('coinConfigList');
        list.innerHTML = '';
        const arr = tempCoinPresets[currentCoinTab] || [];
        arr.forEach((item, idx) => {
            const div = document.createElement('div');
            div.style.cssText = 'display:flex; gap:8px; margin-bottom:8px; align-items:center; background:var(--bg); padding:8px; border-radius:6px; border:1px solid var(--tbl-border);';
            div.innerHTML = `
                <span style="font-weight:bold; width: 40px; text-align:center; color:${currentCoinTab === 'plus' ? 'var(--success)' : 'var(--danger)'};">${item.v > 0 ? '+'+item.v : item.v}</span>
                <span style="flex:1; font-weight:bold;">${item.l}</span>
                <button class="btn sm warn icon-only btn-del-coin" data-idx="${idx}"><i class="bi bi-trash"></i></button>
            `;
            list.appendChild(div);
        });
        document.getElementById('ipNewCoinVal').value = currentCoinTab === 'plus' ? '1' : '-1';
    }

    document.getElementById('coinConfigList').addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-del-coin');
        if(btn) {
            const idx = parseInt(btn.dataset.idx);
            tempCoinPresets[currentCoinTab].splice(idx, 1);
            renderCoinConfig();
        }
    });

    document.getElementById('btnAddCoinPreset').onclick = () => {
        const val = parseInt(document.getElementById('ipNewCoinVal').value);
        const label = document.getElementById('ipNewCoinReason').value.trim();
        if(isNaN(val) || !label) { alert("請填寫完整分數與原因"); return; }
        if(currentCoinTab === 'plus' && val <= 0) { alert("加分項目請輸入正數"); return; }
        if(currentCoinTab === 'minus' && val >= 0) { alert("扣分項目請輸入負數"); return; }
        
        tempCoinPresets[currentCoinTab].push({ v: val, l: label });
        document.getElementById('ipNewCoinReason').value = '';
        renderCoinConfig();
    };

    document.getElementById('btnSaveCoinSettings').onclick = () => {
        data.coinPresets = tempCoinPresets;
        triggerAutoSave();
        window.renderCoinDropdowns();
        document.getElementById('coinSettingsModal').classList.remove('show');
        showToast("⚙️ 加扣分項目已儲存");
    };

    document.getElementById('btnMarkAllYellow').addEventListener('click', () => { if(confirm("確認全員改為「已回報」？")) updateAllStatus(1); });
    document.getElementById('btnMarkAllOrange').addEventListener('click', () => { if(confirm("確認全員改為「再挑戰」？")) updateAllStatus(2); });
    
    // ⭐ 新增：重新清點事件綁定
    document.getElementById('btnRecountCurrent').addEventListener('click', () => { 
        if(confirm("⚠️ 確認重新清點？\n這會將全員狀態歸零（設為未交），並靜默扣回已領取的 EXP！")) {
            updateAllStatus(0);
        }
    });

    // ⭐ 完美改寫：批量修改狀態邏輯，確保正確靜默發放/收回 EXP
    function updateAllStatus(s) {
        const a = data.assignments.find(x => x.id == currentAssignmentId);
        if(a) { 
            const idxs = a.assignedIndices || 'all'; 
            let changedExp = false;
            
            const todayStr = getTaipeiDateString();
            const isSameDay = (todayStr === a.date);
            const d1 = new Date(a.date.replace(/-/g, '/'));
            const d2 = new Date(todayStr.replace(/-/g, '/'));
            const diffDays = Math.floor(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));

            data.roster.forEach((st, i) => { 
                if(idxs === 'all' || idxs.includes(i)) {
                    if(!a.statuses) a.statuses = Array(data.roster.length).fill(0);
                    if(!a.earnedExp) a.earnedExp = {}; 

                    const currentEarned = a.earnedExp[i] || { handIn: 0, complete: 0 };
                    const newEarned = { handIn: currentEarned.handIn, complete: 0 };
                    
                    if (s !== 0) {
                        if (currentEarned.handIn === 0 && isSameDay) newEarned.handIn = 1;
                    } else {
                        newEarned.handIn = 0; 
                    }

                    if (s === 3) {
                        if (currentEarned.complete === 0) newEarned.complete = (diffDays <= 1) ? 2 : 1;
                        else newEarned.complete = currentEarned.complete; 
                    }

                    const deltaExp = (newEarned.handIn + newEarned.complete) - (currentEarned.handIn + currentEarned.complete);
                    
                    a.statuses[i] = s;
                    a.earnedExp[i] = newEarned;

                    if (deltaExp !== 0) {
                        changeExp(i, deltaExp, `批量變更 [${a.title}]`, true); // true = 靜音，不彈跳獨立通知
                        changedExp = true;
                    }
                } 
            });
            if(changedExp) showToast("⚠️ 狀態已批量變更，並重新結算對應的 EXP");
            window.checkAllClearAndCheer(a); // 檢查是否有全員繳交
            triggerAutoSave(); renderDashboardDetail(currentAssignmentId); renderDashboard();
        }
    }

    document.getElementById('btnConfirmArchive').addEventListener('click', () => {
        const a = data.assignments.find(x => x.id == targetAssignmentIdToDelete);
        if(a) { a.archived = true; triggerAutoSave(); renderDashboard(); }
        document.getElementById('deleteChoiceModal').classList.remove('show');
    });

    document.getElementById('btnConfirmDelete').addEventListener('click', () => {
        data.assignments = data.assignments.filter(x => x.id != targetAssignmentIdToDelete);
        triggerAutoSave(); renderDashboard();
        document.getElementById('deleteChoiceModal').classList.remove('show');
        showToast("已徹底銷毀");
    });

    document.getElementById('btnOpenSettings').addEventListener('click', () => document.getElementById('settingsModal').classList.add('show'));
    
    document.getElementById('themeOptionsContainer').addEventListener('click', (e) => {
        if(e.target.classList.contains('theme-option')) {
            const t = e.target.dataset.theme; 
            document.documentElement.setAttribute('data-color-theme', t); 
            localStorage.setItem('hwColor', t); 
            document.querySelectorAll('.theme-option').forEach(el => el.classList.remove('active')); 
            e.target.classList.add('active'); 
        }
    });

    document.getElementById('darkModeToggle').addEventListener('change', (e) => { 
        const t = e.target.checked ? 'dark' : 'light'; 
        document.documentElement.setAttribute('data-theme', t); 
        localStorage.setItem('hwTheme', t); 
    });
    
    document.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', (e) => e.target.closest('.modal-overlay').classList.remove('show')));
    
    document.getElementById('btnOpenAssignModal').addEventListener('click', () => {
        const c = document.getElementById('assignStudentListContainer'); c.innerHTML = '';
        data.roster.forEach((s, i) => { const chk = !newAssignmentAssignedIndices.length || newAssignmentAssignedIndices.includes(i); const l = document.createElement('label'); l.className = 'assign-student-item'; l.innerHTML = `<input type="checkbox" data-idx="${i}" ${chk?'checked':''}> ${s.no}.${s.name}`; c.appendChild(l); });
        document.getElementById('assignStudentModal').classList.add('show');
    });
    document.getElementById('btnConfirmAssign').addEventListener('click', () => {
        const chks = document.querySelectorAll('#assignStudentListContainer input:checked'); newAssignmentAssignedIndices = Array.from(chks).map(c => parseInt(c.dataset.idx));
        document.getElementById('assignStatusText').innerText = newAssignmentAssignedIndices.length === data.roster.length ? "發布給：全體冒險者" : `發布給：已選 ${newAssignmentAssignedIndices.length} 位`; 
        document.getElementById('assignStudentModal').classList.remove('show');
    });
    document.getElementById('btnAssignSelectAll').addEventListener('click', () => document.querySelectorAll('#assignStudentListContainer input').forEach(c => c.checked=true));
    document.getElementById('btnAssignDeselectAll').addEventListener('click', () => document.querySelectorAll('#assignStudentListContainer input').forEach(c => c.checked=false));

    document.getElementById('btnToggleToolbox').addEventListener('click', function() { 
        document.getElementById('toolboxMenu').classList.toggle('show'); 
        this.classList.toggle('active'); 
    });

    function openTool(id) { 
        const win = document.getElementById(id); 
        if(win) {
            win.classList.add('show'); 
            bringToFront(win);
        }
        document.getElementById('toolboxMenu').classList.remove('show'); 
        document.getElementById('btnToggleToolbox').classList.remove('active'); 
    }
    
    function bringToFront(el) {
        document.querySelectorAll('.tool-window').forEach(w => w.style.zIndex = 5005);
        el.style.zIndex = 5006;
    }

    
['panelRecess', 'panelDismissal', 'panelMarquee', 'panelTimer', 'panelStopwatch', 'panelNumDice', 'panelAlphaDice', 'panelDraw', 'panelDecibel', 'panelBGM', 'panelApple', 'panelHgTimer'].forEach(id => {
        const win = document.getElementById(id);
        if(!win) return;
        
        win.addEventListener('mousedown', () => bringToFront(win));
        
        const header = win.querySelector('.tool-header');
        let isDragging = false, startX, startY, startLeft, startTop;
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = win.getBoundingClientRect();
            win.style.transform = 'none';
            win.style.left = rect.left + 'px';
            win.style.top = rect.top + 'px';
            startX = e.clientX; startY = e.clientY;
            startLeft = rect.left; startTop = rect.top;
            bringToFront(win);
        });
        
        document.addEventListener('mousemove', (e) => {
            if(!isDragging) return;
            win.style.left = (startLeft + e.clientX - startX) + 'px';
            win.style.top = (startTop + e.clientY - startY) + 'px';
        });
        
        document.addEventListener('mouseup', () => isDragging = false);
    });

    document.getElementById('btnOpenRecess').onclick = () => openTool('panelRecess');
    document.getElementById('btnOpenDismissal').onclick = () => openTool('panelDismissal');
    document.getElementById('btnOpenMarquee').onclick = () => openTool('panelMarquee');
    document.getElementById('btnOpenTimer').onclick = () => openTool('panelTimer');
    document.getElementById('btnOpenHgTimer').onclick = () => { openTool('panelHgTimer'); if(window.updateHgVisuals) window.updateHgVisuals('none'); };
    document.getElementById('btnOpenStopwatch').onclick = () => openTool('panelStopwatch');
    document.getElementById('btnOpenNumDice').onclick = () => openTool('panelNumDice');
    document.getElementById('btnOpenAlphaDice').onclick = () => openTool('panelAlphaDice');
    document.getElementById('btnOpenDraw').onclick = () => { openTool('panelDraw'); renderWheel(); };
    document.getElementById('btnOpenDecibel').onclick = () => openTool('panelDecibel');
    document.getElementById('btnOpenBGM').onclick = () => openTool('panelBGM');

    document.getElementById('btnOpenApple').onclick = () => { openTool('panelApple'); renderLunchApple(); };

    let lunchApple = { count: 3, status: 'ongoing' };
    let appleTriggered1159 = false;
    let appleTriggered1235 = false;

    function renderLunchApple() {
        const container = document.getElementById('appleContainer');
        const statusText = document.getElementById('appleStatusText');
        
        if (lunchApple.status === 'failed') {
            container.innerHTML = '<span style="animation: shakeBlur 0.5s; font-size: 20cqi;">😢</span>';
            statusText.innerText = '挑戰失敗...蘋果沒了';
            statusText.style.color = 'var(--danger)';
        } else if (lunchApple.status === 'success') {
            container.innerHTML = '🍎🍎🍎';
            statusText.innerText = '🎉 挑戰成功！完美守護！';
            statusText.style.color = 'var(--success)';
        } else {
            container.innerHTML = '';
            for(let i = 0; i < lunchApple.count; i++) {
                const apple = document.createElement('span');
                apple.innerText = '🍎';
                apple.style.cursor = 'pointer';
                apple.style.transition = 'transform 0.1s, opacity 0.2s';
                apple.onmouseover = () => apple.style.transform = 'scale(1.1) rotate(-5deg)';
                apple.onmouseout = () => apple.style.transform = 'scale(1) rotate(0deg)';
                apple.onclick = () => {
                    lunchApple.count--;
                    apple.style.transform = 'scale(0)';
                    apple.style.opacity = '0';
                    setTimeout(() => {
                        if (lunchApple.count <= 0) {
                            lunchApple.status = 'failed';
                            if (window.playTickSound) window.playTickSound();
                        } else {
                            if (window.playTickSound) window.playTickSound();
                        }
                        renderLunchApple();
                    }, 200); 
                };
                container.appendChild(apple);
            }
            statusText.innerText = `保護 ${lunchApple.count} 顆蘋果！`;
            statusText.style.color = 'var(--primary)';
        }
    }

    document.getElementById('btnAppleReset').onclick = () => {
        lunchApple = { count: 3, status: 'ongoing' };
        renderLunchApple();
    };
    document.getElementById('btnAppleTest').onclick = () => {
        lunchApple = { count: 3, status: 'success' };
        renderLunchApple();
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        if (window.playStarSound) window.playStarSound();
    };

    setInterval(() => {
        const now = new Date();
        const hh = now.getHours();
        const mm = now.getMinutes();

        if (hh === 11 && mm === 59) {
            if (!appleTriggered1159) {
                lunchApple = { count: 3, status: 'ongoing' };
                renderLunchApple();
                appleTriggered1159 = true;
                appleTriggered1235 = false; 
            }
        } else {
            appleTriggered1159 = false; 
        }

        if (hh === 12 && mm === 35) {
            if (!appleTriggered1235) {
                if (lunchApple.status === 'ongoing' && lunchApple.count === 3) {
                    lunchApple.status = 'success';
                    renderLunchApple();
                    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                    if (window.playSuccessSound) window.playSuccessSound();
                }
                appleTriggered1235 = true;
            }
        } else {
            appleTriggered1235 = false;
        }
    }, 1000);
    
    const bgmPlayer = document.getElementById('bgmPlayer');
    const bgmVol = document.getElementById('bgmVolume');
    const btnPlayBGM = document.getElementById('btnPlayBGM');
    const btnStopBGM = document.getElementById('btnStopBGM');
    
    if (bgmVol) {
        bgmVol.addEventListener('input', (e) => {
            if (bgmPlayer) bgmPlayer.volume = e.target.value;
        });
    }

    function updateBgmUI() {
        if (!bgmPlayer.paused && bgmPlayer.currentTime > 0) {
            btnPlayBGM.innerHTML = '<i class="bi bi-pause-fill"></i> 暫停';
            btnPlayBGM.style.background = 'var(--accent)'; 
        } else {
            btnPlayBGM.innerHTML = '<i class="bi bi-play-fill"></i> 播放';
            btnPlayBGM.style.background = 'var(--primary)'; 
        }
    }

    window.changeBGM = function(url, btn) {
        if (!bgmPlayer) return;
        
        btnPlayBGM.innerHTML = '<i class="bi bi-hourglass-split"></i> 載入中...';
        
        bgmPlayer.src = url;
        bgmPlayer.volume = bgmVol.value;
        
        bgmPlayer.play().then(() => {
            updateBgmUI();
        }).catch(e => {
            console.log("等待互動後播放", e);
            updateBgmUI();
        });
        
        const btns = document.querySelectorAll('#panelBGM .tool-btn.ghost');
        btns.forEach(b => {
            if (b.id !== 'btnStopBGM') {
                b.style.borderColor = 'var(--tbl-border)';
                b.style.background = 'transparent';
            }
        });
        if(btn) {
            btn.style.borderColor = 'var(--primary)';
            btn.style.background = 'var(--tbl-alt)';
        }
    };

    btnPlayBGM.addEventListener('click', () => {
        if (bgmPlayer) {
            if (!bgmPlayer.getAttribute('src')) {
                const firstSongBtn = document.querySelectorAll('#panelBGM .tool-btn.ghost')[0];
                if (firstSongBtn) firstSongBtn.click();
            } else {
                if (bgmPlayer.paused) bgmPlayer.play();
                else bgmPlayer.pause();
                updateBgmUI();
            }
        }
    });

    if (bgmPlayer) {
        bgmPlayer.addEventListener('play', updateBgmUI);
        bgmPlayer.addEventListener('pause', updateBgmUI);
        bgmPlayer.addEventListener('canplay', updateBgmUI); 
    }

    btnStopBGM.addEventListener('click', () => {
        if (bgmPlayer) {
            bgmPlayer.pause();
            bgmPlayer.currentTime = 0; 
            updateBgmUI();
        }
    });

    document.addEventListener('click', (e) => { 
        if (e.target.closest('.tool-close')) { 
            const win = e.target.closest('.tool-window'); if (win) win.classList.remove('show'); 
        }
        const picker = document.getElementById('statusPicker');
        if (picker && picker.classList.contains('show') && !picker.contains(e.target) && !e.target.closest('div[onclick^="window.toggleCardTaskStatus"]')) picker.classList.remove('show');
        const menu = document.getElementById('quickDebtMenu');
        if (menu && menu.classList.contains('show') && !menu.contains(e.target) && !e.target.closest('.debt-badge') && !e.target.closest('.btn-close-debt')) { menu.classList.remove('show'); menu.style.display = ''; menu.dataset.currentSidx = ""; }
    });

    document.getElementById('btnMqShow').addEventListener('click', () => { 
        const txt = document.getElementById('mqTextInput').value; 
        if(!txt) return; 
        const el = document.getElementById('marqueeText'); 
        el.innerText = txt; 
        el.style.color = document.getElementById('mqColorInput').value;
        el.style.fontSize = document.getElementById('mqSizeInput').value + 'px';
        
        const speed = parseInt(document.getElementById('mqSpeedInput').value);
        
        if (speed === 0) {
            el.style.animation = 'none';
            el.style.paddingLeft = '0';
            el.style.width = '100%';
            el.style.textAlign = 'center';
        } else {
            el.style.animation = 'marquee-anim linear infinite';
            el.style.paddingLeft = '100%';
            el.style.width = 'auto';
            el.style.textAlign = 'left';
            el.style.animationDuration = Math.max(3, 50 - speed) + 's'; 
        }
        
        document.getElementById('topMarquee').style.display = 'block'; 
    });
    
    document.getElementById('btnMqHide').addEventListener('click', () => document.getElementById('topMarquee').style.display = 'none');

    document.getElementById('btnQuickDebtMarquee').addEventListener('click', () => {
        const contactBookTask = data.assignments.find(a => !a.archived && a.title.includes('聯絡簿'));
        
        if (!contactBookTask) {
            showToast('⚠️ 目前看板上沒有名為「聯絡簿」的委託單！');
            return;
        }
        
        let missingStudents = [];
        const indices = contactBookTask.assignedIndices || 'all';
        
        data.roster.forEach((s, i) => {
            if (indices === 'all' || indices.includes(i)) {
                const st = (contactBookTask.statuses || [])[i] || 0;
                if (st === 0 || st === 2) {
                    missingStudents.push(s.no);
                }
            }
        });
        
        const inputEl = document.getElementById('mqTextInput');
        if (missingStudents.length === 0) {
            inputEl.value = '🎉 全班聯絡簿皆已繳交完成！';
        } else {
            inputEl.value = `⚠️ 聯絡簿未交 / 待訂正：${missingStudents.join(', ')} 號，請盡速交至講台！`;
        }
    });

    let timerInt = null; let timerSec = 0;
    function updateTimer() { document.getElementById('timerDisplay').innerText = `${String(Math.floor(timerSec/60)).padStart(2,'0')}:${String(timerSec%60).padStart(2,'0')}`; }
    document.querySelectorAll('.btn-timer-preset').forEach(b => b.addEventListener('click', (e) => { timerSec += parseInt(e.target.dataset.min) * 60; updateTimer(); }));
    
document.getElementById('btnTimerStart').addEventListener('click', (e) => { 
        const ctx = resumeAudio(); 
        const unlockOsc = ctx.createOscillator(); 
        const unlockGain = ctx.createGain();
        unlockGain.gain.value = 0; 
        unlockOsc.connect(unlockGain); 
        unlockGain.connect(ctx.destination);
        unlockOsc.start(); unlockOsc.stop(ctx.currentTime + 0.1);

        const displayBox = document.getElementById('timerDisplay');
        const btn = document.getElementById('btnTimerStart'); 
        
        if(timerInt) { 
            clearInterval(timerInt); timerInt=null; 
            btn.innerHTML=`<i class="bi bi-play-fill"></i> 繼續`; 
            btn.classList.remove('warn');
        } else { 
            const inM = parseInt(document.getElementById('timerInput').value); const inS = parseInt(document.getElementById('timerInputSec').value);
            if (!isNaN(inM) || !isNaN(inS)) { 
                timerSec = (inM || 0) * 60 + (inS || 0); 
                document.getElementById('timerInput').value=''; document.getElementById('timerInputSec').value=''; 
                updateTimer(); 
            }
            
            if(timerSec > 0) { 
                btn.innerHTML=`<i class="bi bi-pause-fill"></i> 暫停`; 
                btn.classList.add('warn');
                
                displayBox.style.backgroundColor = 'var(--bg)'; 
                displayBox.style.color = 'var(--primary)';
                
                timerInt = setInterval(() => { 
                    if(timerSec > 0) { 
                        timerSec--; 
                        updateTimer(); 
                        
                        if (timerSec > 0 && timerSec <= 3) {
                            if (window.playTimerTickSound) window.playTimerTickSound();
                        }
                    } 
                    
                    if(timerSec <= 0) { 
                        clearInterval(timerInt); timerInt=null; 
                        
                        btn.innerHTML=`<i class="bi bi-play-fill"></i> 開始`; 
                        btn.classList.remove('warn'); 
                        
                        if (window.playTimerVictoryMusic) window.playTimerVictoryMusic(); 
                        showToast("⏰ 時間到！任務結束！"); 
                    } 
                }, 1000);
            } 
        } 
    });
    
    document.getElementById('btnTimerReset').addEventListener('click', () => { 
        clearInterval(timerInt); timerInt=null; timerSec=0; updateTimer(); 
        const btn = document.getElementById('btnTimerStart'); btn.innerHTML=`<i class="bi bi-play-fill"></i> 開始`; btn.classList.remove('warn');
    });

    let swInt = null, swStart = 0, swElapsed = 0;
    function updateSw() {
        const t = Date.now() - swStart + swElapsed;
        const ms = String(Math.floor((t % 1000) / 10)).padStart(2, '0');
        const s = String(Math.floor((t / 1000) % 60)).padStart(2, '0');
        const m = String(Math.floor((t / 60000))).padStart(2, '0');
        document.getElementById('swDisplay').innerText = `${m}:${s}:${ms}`;
    }
    document.getElementById('btnSwStart').addEventListener('click', (e) => {
        if(swInt) { clearInterval(swInt); swInt=null; swElapsed += Date.now() - swStart; e.currentTarget.innerHTML=`<i class="bi bi-play-fill"></i> 繼續`; e.currentTarget.classList.remove('warn'); }
        else { swStart = Date.now(); swInt = setInterval(updateSw, 10); e.currentTarget.innerHTML=`<i class="bi bi-pause-fill"></i> 暫停`; e.currentTarget.classList.add('warn'); }
    });
    document.getElementById('btnSwReset').addEventListener('click', () => {
        clearInterval(swInt); swInt=null; swElapsed=0; document.getElementById('swDisplay').innerText="00:00:00"; 
        const btn = document.getElementById('btnSwStart'); btn.innerHTML=`<i class="bi bi-play-fill"></i> 開始`; btn.classList.remove('warn');
    });

    function rollDiceBox(boxId, getResultFn) {
        resumeAudio(); const box = document.getElementById(boxId); box.classList.add('dice-rolling');
        let count = 0;
        const intv = setInterval(() => { box.innerText = getResultFn(true); playTickSound(); count++; if(count > 15) { clearInterval(intv); box.classList.remove('dice-rolling'); box.innerText = getResultFn(false); playSuccessSound(); } }, 50);
    }
    document.getElementById('btnRollNumDice').addEventListener('click', () => {
        const min = parseInt(document.getElementById('diceMin').value) || 1;
        const max = parseInt(document.getElementById('diceMax').value) || 6;
        rollDiceBox('numDiceResult', () => Math.floor(Math.random() * (max - min + 1)) + min);
    });
    document.getElementById('btnRollAlphaDice').addEventListener('click', () => {
        rollDiceBox('alphaDiceResult', () => String.fromCharCode(65 + Math.floor(Math.random() * 26)));
    });

    document.getElementById('tabBasicDraw').onclick = () => { document.getElementById('tabBasicDraw').classList.add('active'); document.getElementById('tabWheelDraw').classList.remove('active'); document.getElementById('viewBasicDraw').style.display='block'; document.getElementById('viewWheelDraw').style.display='none'; };
    document.getElementById('tabWheelDraw').onclick = () => { document.getElementById('tabWheelDraw').classList.add('active'); document.getElementById('tabBasicDraw').classList.remove('active'); document.getElementById('viewWheelDraw').style.display='block'; document.getElementById('viewBasicDraw').style.display='none'; renderWheel(); };

    document.getElementById('btnLuckyDraw').addEventListener('click', () => { 
        resumeAudio(); const btn = document.getElementById('btnLuckyDraw'); const res = document.getElementById('luckyDrawResult'); 
        if (!data.roster || !data.roster.length) return; if (btn.disabled) return; 
        btn.disabled = true; btn.innerHTML = `<i class="bi bi-arrow-repeat"></i> 轉動中...`; res.classList.add('dice-rolling');
        let c = 0; const intv = setInterval(() => { res.innerText = data.roster[Math.floor(Math.random() * data.roster.length)].name; playTickSound(); c++; if(c>20) { clearInterval(intv); res.classList.remove('dice-rolling'); playSuccessSound(); confetti(); btn.disabled=false; btn.innerHTML=`<i class="bi bi-dice-5-fill"></i> 再次抽出`; } }, 50);
    });

    let currentWheelDeg = 0;
    function renderWheel() {
        const c = document.getElementById('wheelCanvas'); if(!data.roster || !data.roster.length) { c.style.background = '#ccc'; return; }
        const slice = 360 / data.roster.length; let grad = [];
        data.roster.forEach((s, i) => { const color = i % 2 === 0 ? '#FAF0E6' : '#E6D2B5'; grad.push(`${color} ${i*slice}deg ${(i+1)*slice}deg`); });
        c.style.background = `conic-gradient(${grad.join(', ')})`;
    }
    document.getElementById('btnSpinWheel').addEventListener('click', () => {
        if (!data.roster || !data.roster.length) return; resumeAudio(); const c = document.getElementById('wheelCanvas'); const btn = document.getElementById('btnSpinWheel'); btn.disabled=true; document.getElementById('wheelWinnerName').innerText = "轉動中...";
        const spinDeg = Math.floor(Math.random() * 360) + 1440; currentWheelDeg += spinDeg; c.style.transform = `rotate(${currentWheelDeg}deg)`;
        setTimeout(() => { 
            const actualDeg = currentWheelDeg % 360; 
            const idx = Math.floor((360 - actualDeg) / (360 / data.roster.length)) % data.roster.length;
            document.getElementById('wheelWinnerName').innerText = `🎉 ${data.roster[idx].name}`; playSuccessSound(); confetti(); btn.disabled=false;
        }, 4000);
    });

    let micStream = null, audioCtx2 = null, analyser = null, micInt = null;
    document.getElementById('btnToggleMic').addEventListener('click', async (e) => {
        const btn = e.currentTarget; const bar = document.getElementById('decibelBar'); const txt = document.getElementById('decibelText'); const icon = document.getElementById('micIcon');
        if(micStream) {
            clearInterval(micInt); micStream.getTracks().forEach(t=>t.stop()); micStream=null; audioCtx2.close(); audioCtx2=null;
            btn.innerHTML=`<i class="bi bi-play-circle"></i> 啟動偵測`; btn.classList.remove('warn'); bar.style.width='0%'; txt.innerText='已停止'; icon.style.color='var(--muted)';
        } else {
            try {
                micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioCtx2 = new (window.AudioContext || window.webkitAudioContext)();
                const src = audioCtx2.createMediaStreamSource(micStream); analyser = audioCtx2.createAnalyser(); analyser.fftSize = 256; src.connect(analyser);
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                btn.innerHTML=`<i class="bi bi-stop-circle"></i> 停止偵測`; btn.classList.add('warn'); icon.style.color='var(--danger)';
                
                micInt = setInterval(() => {
                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0; for(let i=0; i<dataArray.length; i++) sum+=dataArray[i];
                    let vol = sum / dataArray.length; 
                    let pct = Math.min(100, Math.floor((vol / 120) * 100)); 
                    bar.style.width = pct + '%';
                    bar.style.backgroundColor = pct > 80 ? 'var(--danger)' : (pct > 50 ? '#f97316' : 'var(--success)');
                    txt.innerText = pct > 80 ? '太吵了！⚠️' : (pct > 50 ? '有點聲音' : '很安靜');
                }, 100);
            } catch(err) { alert('無法取得麥克風權限！'); }
        }
    });

let isSidebarEditMode = false;

document.getElementById('btnOpenSidebar').addEventListener('click', () => {
    document.getElementById('quickSidebar').classList.add('show');
    document.body.classList.add('sidebar-open'); 
    renderQuickSidebar();
});
document.getElementById('btnCloseSidebar').addEventListener('click', () => {
    document.getElementById('quickSidebar').classList.remove('show');
    document.body.classList.remove('sidebar-open'); 
});

document.getElementById('btnToggleSidebarEdit').addEventListener('click', (e) => {
    isSidebarEditMode = !isSidebarEditMode;
    const btn = e.currentTarget;
    
    if (isSidebarEditMode) {
        btn.innerHTML = '<i class="bi bi-unlock-fill"></i>';
        btn.classList.remove('ghost');
        btn.style.background = 'var(--danger)';
        btn.style.borderColor = 'var(--danger)';
        btn.style.color = '#fff';
    } else {
        btn.innerHTML = '<i class="bi bi-lock-fill"></i>';
        btn.classList.add('ghost');
        btn.style.background = 'transparent';
        btn.style.borderColor = 'var(--text-light)';
        btn.style.color = 'var(--text-main)';
    }
    renderQuickSidebar();
});

window.renderQuickSidebar = function() {
    const list = document.getElementById('quickSidebarList');
    if (!list) return;
    
    list.style.gridTemplateColumns = isSidebarEditMode ? '1fr' : '1fr 1fr';
    list.innerHTML = '';
    
    data.roster.forEach((s, i) => {
        const div = document.createElement('div');
        div.className = 'qs-item';
        
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; width: 100%;">
                <div style="font-weight:900; font-size:13px; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    <span style="color:var(--primary); margin-right:2px;">${s.no}.</span>${s.name}
                </div>
                <div style="display: ${isSidebarEditMode ? 'none' : 'flex'}; gap:6px; font-size:12px; font-weight:bold;">
                    <span style="color:var(--muted);">⭐${s.exp||0}</span>
                    <span style="color:#b45309;">💰${s.coins||0}</span>
                </div>
            </div>
            
            <div style="display: ${isSidebarEditMode ? 'flex' : 'none'}; gap: 8px; margin-top: 6px; width: 100%;">
                
                <div style="flex:1; display:flex; justify-content:space-between; align-items:center; background:var(--card); padding:2px 4px; border-radius:4px; border:1px solid var(--tbl-border);">
                    <button class="btn sm warn ghost icon-only" onclick="window.changeExp(${i}, -1, '速覽手動扣分')" style="border:none; padding:2px 6px; font-size:14px;">-</button>
                    <span style="font-size:12px; font-weight:bold; color:var(--muted);">⭐ ${s.exp||0}</span>
                    <button class="btn sm ghost icon-only" onclick="window.changeExp(${i}, 1, '速覽手動加分')" style="border:none; padding:2px 6px; font-size:14px;">+</button>
                </div>
                
                <div style="flex:1; display:flex; justify-content:space-between; align-items:center; background:var(--card); padding:2px 4px; border-radius:4px; border:1px solid var(--tbl-border);">
                    <button class="btn sm warn ghost icon-only" onclick="window.changeCoin(${i}, -1, '速覽手動扣款')" style="border:none; padding:2px 6px; font-size:14px;">-</button>
                    <span style="font-size:12px; font-weight:bold; color:#b45309;">💰 ${s.coins||0}</span>
                    <button class="btn sm ghost icon-only" onclick="window.changeCoin(${i}, 1, '速覽手動加幣')" style="border:none; padding:2px 6px; font-size:14px;">+</button>
                </div>

            </div>
        `;
        list.appendChild(div);
    });
};

    
    document.getElementById('tabBtnStudents').addEventListener('click', (e) => {
        e.currentTarget.classList.add('active');
        document.getElementById('tabBtnTeachers').classList.remove('active');
        document.getElementById('roster-content-students').classList.add('show');
        document.getElementById('roster-content-teachers').classList.remove('show');
    });

    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            const targetId = e.currentTarget.dataset.target;
            document.querySelectorAll('.admin-tab-content').forEach(content => {
                content.style.display = content.id === targetId ? 'block' : 'none';
            });
        });
    });

    document.getElementById('btnPlusClassStar').addEventListener('click', (e) => {
        if (!data.settings) data.settings = {};
        data.settings.classStars = (data.settings.classStars || 0) + 1;
        
        if (window.playStarSound) window.playStarSound();
        triggerAutoSave();
        renderClassStars();
        
        const display = document.getElementById('classStarDisplay');
        display.classList.remove('star-pop-anim');
        void display.offsetWidth; 
        display.classList.add('star-pop-anim');
        
        confetti({ 
            particleCount: 80, 
            spread: 100, 
            origin: { y: 0.1 },
            colors: ['#fcd34d', '#f59e0b', '#fbbf24', '#fffbeb'] 
        });

        const emojis = ['✨', '💖', '🥰', '🎉', '🌟', '🤩'];
        const emojiCount = Math.floor(Math.random() * 3) + 3; 
        for(let i = 0; i < emojiCount; i++) {
            const el = document.createElement('div');
            el.className = 'floating-emoji';
            el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.left = (e.clientX - 30 + Math.random() * 60) + 'px';
            el.style.top = (e.clientY - 30 + Math.random() * 30) + 'px';
            el.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
            document.body.appendChild(el);
            
            setTimeout(() => el.remove(), 1200); 
        }
        
        showToast("🌟 班級星星 +1！繼續保持！");
    });

    document.getElementById('btnMinusClassStar').addEventListener('click', () => {
        if (!data.settings) data.settings = {};
        if ((data.settings.classStars || 0) > 0) {
            data.settings.classStars--;
            triggerAutoSave();
            renderClassStars();
        }
    });

    document.getElementById('btnResetClassStar').addEventListener('click', () => {
        if (confirm("確定要將班級星星歸零嗎？\n(通常在兌換獎勵後使用)")) {
            if (!data.settings) data.settings = {};
            data.settings.classStars = 0;
            triggerAutoSave();
            renderClassStars();
            showToast("🔄 班級星星已歸零！");
        }
    });
    
    document.getElementById('userEmailDisplay').addEventListener('click', () => {
        const firstTab = document.querySelector('.admin-tab-btn[data-target="adminTab-debts"]');
        if (firstTab) firstTab.click();
    });

    document.getElementById('btnAdminRoster').addEventListener('click', () => { 
        document.getElementById('adminProfileModal').classList.remove('show'); 
        switchView('view-roster'); 
    });
    
    document.getElementById('tabBtnTeachers').addEventListener('click', (e) => {
        e.currentTarget.classList.add('active');
        document.getElementById('tabBtnStudents').classList.remove('active');
        document.getElementById('roster-content-teachers').classList.add('show');
        document.getElementById('roster-content-students').classList.remove('show');
        renderTeacherEditor();
    });

    document.querySelectorAll('.status-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (pickerTarget) {
                const newStatus = parseInt(e.currentTarget.getAttribute('data-status'));
                window.updateStatus(pickerTarget.aid, pickerTarget.idx, newStatus);
                document.getElementById('statusPicker').classList.remove('show');
                pickerTarget = null;
            }
        });
    });

    let hgTimerInterval = null;
    let hgTotalSeconds = 60;
    let hgVolumeA = 0; 
    let hgFlipCount = 0;
    let hgIsRunning = false;
    let hgIsFlipping = false;

    const hgSandA = document.getElementById('hg-sand-a');
    const hgSandB = document.getElementById('hg-sand-b');
    const hgStream = document.getElementById('hg-stream');
    const hgDisplay = document.getElementById('hg-time-display');
    const hgTimeInput = document.getElementById('hg-time-input');
    const hgWrapper = document.getElementById('hg-wrapper');
    const hgPlayIcon = document.getElementById('hg-play-icon');
    const hgPauseIcon = document.getElementById('hg-pause-icon');
    const hgBody = document.getElementById('hgTimerBody');

    window.updateHgHourglassScale = function(seconds) {
        const scale = Math.max(0.85, Math.min(1.25, 0.72 + Math.sqrt(seconds) / 28));
        hgWrapper.style.setProperty('--hg-scale', scale);
    };

    window.updateHgVisuals = function(transitionType = 'linear') {
        let amountA = hgTotalSeconds > 0 ? hgVolumeA / hgTotalSeconds : 0;
        let amountB = 1 - amountA;

        let transitionStyle = 'none';
        if (transitionType === 'smooth') {
            transitionStyle = 'top 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        } else if (transitionType === 'linear') {
            transitionStyle = 'top 1s linear, height 1s linear';
        }

        hgSandA.style.transition = transitionStyle + ', background 0.4s ease';
        hgSandB.style.transition = transitionStyle + ', background 0.4s ease';

        hgSandA.style.height = `${amountA * 100}%`;
        hgSandB.style.height = `${amountB * 100}%`;

        if (hgFlipCount % 2 === 0) {
            hgSandA.style.top = `${(1 - amountA) * 100}%`;
            hgSandB.style.top = `${(1 - amountB) * 100}%`;
        } else {
            hgSandA.style.top = `0%`;
            hgSandB.style.top = `0%`;
        }

        let displaySecs = (hgFlipCount % 2 === 0) ? hgVolumeA : hgTotalSeconds - hgVolumeA;
        const m = Math.floor(displaySecs / 60).toString().padStart(2, '0');
        const s = (displaySecs % 60).toString().padStart(2, '0');
        hgDisplay.innerText = `${m}:${s}`;
    };

    window.applyHgPreset = function(sec, color, btn) {
        resumeAudio();
        document.querySelectorAll('.hg-pbtn').forEach(b => b.classList.remove('active'));
        if(btn) btn.classList.add('active');
        
        if(color) hgBody.style.setProperty('--hg-sand-color', color);
        
        hgTimeInput.value = sec;
        clearInterval(hgTimerInterval);
        hgIsRunning = false;
        hgPlayIcon.style.display = 'block'; hgPauseIcon.style.display = 'none';
        hgStream.classList.remove('active');

        hgTotalSeconds = sec;
        hgVolumeA = 0; 
        hgFlipCount = 0; 
        
        hgWrapper.style.setProperty('--hg-rot', `0deg`);
        hgStream.style.transform = `translateX(-50%) rotate(0deg)`;
        
        window.updateHgVisuals('none');
        window.updateHgHourglassScale(sec); 
    };

    hgTimeInput.addEventListener('input', () => {
        if (hgIsRunning) return;
        const val = parseInt(hgTimeInput.value);
        if (val > 0) {
            hgTotalSeconds = val;
            hgVolumeA = (hgFlipCount % 2 === 0) ? 0 : val; 
            window.updateHgVisuals('none');
            window.updateHgHourglassScale(val);
            document.querySelectorAll('.hg-pbtn').forEach(b => b.classList.remove('active'));
        }
    });

    window.toggleHgTimer = function() {
        resumeAudio();
        if (hgIsRunning) {
            clearInterval(hgTimerInterval);
            hgIsRunning = false;
            hgPlayIcon.style.display = 'block'; hgPauseIcon.style.display = 'none';
            hgStream.classList.remove('active');
        } else {
            let displaySecs = (hgFlipCount % 2 === 0) ? hgVolumeA : hgTotalSeconds - hgVolumeA;
            if (displaySecs <= 0) { window.flipHourglassPanel(); return; }

            hgIsRunning = true;
            hgPlayIcon.style.display = 'none'; hgPauseIcon.style.display = 'block';
            hgStream.classList.add('active');

            hgTimerInterval = setInterval(() => {
                if (hgFlipCount % 2 === 0) {
                    if (hgVolumeA > 0) hgVolumeA--;
                } else {
                    if (hgVolumeA < hgTotalSeconds) hgVolumeA++;
                }

                window.updateHgVisuals('linear');

                let currentSecs = (hgFlipCount % 2 === 0) ? hgVolumeA : hgTotalSeconds - hgVolumeA;
                if (currentSecs <= 0) {
                    clearInterval(hgTimerInterval);
                    hgIsRunning = false;
                    hgPlayIcon.style.display = 'block'; hgPauseIcon.style.display = 'none';
                    hgStream.classList.remove('active');
                    hgDisplay.innerText = "00:00"; 
                    
                    showToast("⏳ 沙漏時間到！任務結束！");
                    if (window.playTimerVictoryMusic) window.playTimerVictoryMusic();
                }
            }, 1000);
        }
    };

    window.resetHgTimer = function() {
        clearInterval(hgTimerInterval);
        hgIsRunning = false;
        hgPlayIcon.style.display = 'block'; hgPauseIcon.style.display = 'none';
        hgStream.classList.remove('active');
        
        const inputVal = parseInt(hgTimeInput.value);
        hgTotalSeconds = isNaN(inputVal) || inputVal <= 0 ? 60 : inputVal;
        hgVolumeA = 0; 
        hgFlipCount = 0;
        
        hgWrapper.style.setProperty('--hg-rot', `0deg`);
        hgStream.style.transform = `translateX(-50%) rotate(0deg)`;
        
        window.updateHgVisuals('none');
        window.updateHgHourglassScale(hgTotalSeconds);
    };

    window.flipHourglassPanel = function() {
        if (hgIsFlipping || hgTotalSeconds <= 0) return;
        resumeAudio();
        hgIsFlipping = true;

        let displaySecsBefore = (hgFlipCount % 2 === 0) ? hgVolumeA : hgTotalSeconds - hgVolumeA;
        hgFlipCount++;
        let newRot = hgFlipCount * 180;
        
        hgWrapper.style.setProperty('--hg-rot', `${newRot}deg`);
        hgStream.style.transform = `translateX(-50%) rotate(${-newRot}deg)`;

        window.updateHgVisuals('smooth');

        setTimeout(() => { hgIsFlipping = false; }, 600);

        if (displaySecsBefore === 0 && !hgIsRunning) {
            window.toggleHgTimer();
        }
    };
// ==========================================
    // ⭐ 左側常駐浮窗：拖曳與收合功能 (支援電腦與平板)
    // ==========================================
    const psSidebar = document.getElementById('persistentSidebar');
    const psHandle = document.getElementById('psDragHandle');
    let isPsDragging = false;
    let psStartX, psStartY, psInitialLeft, psInitialTop;

    // 啟動拖曳
    const startPsDrag = (e) => {
        // 如果點擊的是按鈕，不要觸發拖曳
        if (e.target.closest('#btnTogglePs')) return; 
        
        isPsDragging = true;
        psSidebar.style.transition = 'none'; // 拖曳時取消動畫，讓跟隨更順暢
        
        // 判斷是滑鼠還是觸控
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        psStartX = clientX;
        psStartY = clientY;
        
        const rect = psSidebar.getBoundingClientRect();
        psInitialLeft = rect.left;
        psInitialTop = rect.top;
        
        psHandle.style.cursor = 'grabbing';
    };

    // 拖曳中
    const doPsDrag = (e) => {
        if (!isPsDragging) return;
        // e.preventDefault(); // 避免在平板上拖曳時畫面跟著捲動 (若有需要可解除註解)
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        const dx = clientX - psStartX;
        const dy = clientY - psStartY;
        
        psSidebar.style.left = `${psInitialLeft + dx}px`;
        psSidebar.style.top = `${psInitialTop + dy}px`;
        psSidebar.style.bottom = 'auto';
        psSidebar.style.right = 'auto';
    };

    // 結束拖曳
    const stopPsDrag = () => {
        if (!isPsDragging) return;
        isPsDragging = false;
        psHandle.style.cursor = 'grab';
        psSidebar.style.transition = 'background-color .3s, color .3s'; // 恢復背景顏色漸變動畫
    };

    // 綁定滑鼠事件 (電腦端)
    psHandle.addEventListener('mousedown', startPsDrag);
    document.addEventListener('mousemove', doPsDrag);
    document.addEventListener('mouseup', stopPsDrag);

    // 綁定觸控事件 (平板/手機端)
    psHandle.addEventListener('touchstart', startPsDrag, { passive: true });
    document.addEventListener('touchmove', doPsDrag, { passive: true });
    document.addEventListener('touchend', stopPsDrag);

    // 收合/展開按鈕邏輯
    document.getElementById('btnTogglePs').addEventListener('click', function() {
        const wrapper = document.getElementById('psContentWrapper');
        const icon = this.querySelector('i');
        
        if (wrapper.style.display === 'none') {
            wrapper.style.display = 'block';
            icon.className = 'bi bi-arrows-collapse';
            psSidebar.style.minWidth = '55px';
        } else {
            wrapper.style.display = 'none';
            icon.className = 'bi bi-arrows-expand';
            psSidebar.style.minWidth = 'auto';
        }
    });
// ==========================================
// ⭐ 幻獸召喚系統邏輯
// ==========================================
let currentSummonStudentIdx = null;

function renderSummonOwnedList(student) {
    const listEl = document.getElementById('summonOwnedList');
    if (!listEl) return;
    const pets = student.pets || [];
    if (pets.length === 0) {
        listEl.innerHTML = '<span style="font-size:12px; color:var(--muted);">尚未收服任何幻獸，快點擊下方按鈕召喚吧！</span>';
        return;
    }
    const counts = pets.reduce((acc, pid) => {
        acc[pid] = (acc[pid] || 0) + 1;
        return acc;
    }, {});
    listEl.innerHTML = Object.entries(counts).map(([pid, count]) => {
        const pet = gachaPool.find(p => p.id === pid);
        if (!pet) return '';
        const borderCol = pet.rarity === 3 ? '#be185d' : (pet.rarity === 2 ? '#7c3aed' : 'var(--tbl-border)');
        return `<span style="background:var(--card); border:2px solid ${borderCol}; border-radius:12px; padding:2px 8px; font-size:13px; font-weight:bold; display:inline-flex; align-items:center; gap:4px;" title="${pet.name}">
            <span>${pet.img}</span>
            <span>${pet.name}</span>
            ${count > 1 ? `<span style="color:var(--primary); font-size:11px;">x${count}</span>` : ''}
        </span>`;
    }).join('');
}

window.openSummonModal = function(sidx) {
    const student = data.roster[sidx];
    if (!student) return;
    currentSummonStudentIdx = sidx;
    
    document.getElementById('summonStudentName').innerText = `【${student.name}】的召喚儀式`;
    document.getElementById('summonStudentCoins').innerText = student.coins || 0;
    
    document.getElementById('summonMysteryBox').style.display = 'block';
    document.getElementById('summonResultPet').style.display = 'none';
    document.getElementById('btnDoSummon').disabled = false;
    
    renderSummonOwnedList(student);
    document.getElementById('summonModal').classList.add('show');
};

document.getElementById('btnDoSummon').addEventListener('click', () => {
    if (currentSummonStudentIdx === null || !data.roster[currentSummonStudentIdx]) return;
    const student = data.roster[currentSummonStudentIdx];
    
    if ((student.coins || 0) < SUMMON_COST) {
        showToast("⚠️ 金幣不足！還需要多接幾張委託喔！");
        return;
    }

    // 重置畫面至水晶球搖晃狀態
    const mysteryBox = document.getElementById('summonMysteryBox');
    const petUI = document.getElementById('summonResultPet');
    petUI.style.display = 'none';
    mysteryBox.style.display = 'block';

    // 1. 扣除金幣
    window.changeCoin(currentSummonStudentIdx, -SUMMON_COST, '幻獸召喚', true);
    document.getElementById('summonStudentCoins').innerText = student.coins;

    // 2. 鎖定按鈕與音效
    const btn = document.getElementById('btnDoSummon');
    btn.disabled = true;
    playTickSound();

    // 3. 機率抽選
    const rand = Math.random() * 100;
    let targetRarity = 1;
    if (rand > 90) targetRarity = 3;      // 10% SSR
    else if (rand > 60) targetRarity = 2; // 30% SR

    const possiblePets = gachaPool.filter(p => p.rarity === targetRarity);
    const resultPet = possiblePets[Math.floor(Math.random() * possiblePets.length)];

    // 4. 存入學生資料
    if (!Array.isArray(student.pets)) student.pets = [];
    student.pets.push(resultPet.id);
    
    triggerAutoSave();

    // 5. 動畫演出
    mysteryBox.classList.add('dice-rolling');
    
    setTimeout(() => {
        mysteryBox.classList.remove('dice-rolling');
        mysteryBox.style.display = 'none';
        
        document.getElementById('summonPetImg').innerText = resultPet.img;
        document.getElementById('summonPetName').innerText = resultPet.name;
        
        const rarityUI = document.getElementById('summonPetRarity');
        if (targetRarity === 3) { rarityUI.innerText = "SSR 傳說"; rarityUI.style.background = "#be185d"; }
        else if (targetRarity === 2) { rarityUI.innerText = "SR 稀有"; rarityUI.style.background = "#7c3aed"; }
        else { rarityUI.innerText = "N 尋常"; rarityUI.style.background = "#059669"; }
        
        petUI.style.display = 'flex';
        renderSummonOwnedList(student);
        
        playStarSound();
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: targetRarity * 50, spread: 80, origin: { y: 0.5 } });
        }
        
        btn.disabled = false;
        renderAll();
    }, 800);
});
