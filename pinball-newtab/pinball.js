  const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>New Tab</title>
<script src="https://unpkg.com/feather-icons"><\/script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Noto Sans SC',sans-serif;height:100vh;overflow:hidden;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);display:flex;align-items:center;justify-content:center;color:#fff}
  #stars-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}
  .container{position:relative;z-index:1;text-align:center;width:100%;max-width:700px;padding:20px}
  .time{font-size:80px;font-weight:300;letter-spacing:4px;text-shadow:0 0 30px rgba(255,255,255,0.15);margin-bottom:8px}
  .greeting{font-size:22px;font-weight:300;color:rgba(255,255,255,0.7);margin-bottom:35px;letter-spacing:2px}
  .search-box{position:relative;width:100%;max-width:560px;margin:0 auto 40px}
  .search-box input{width:100%;padding:16px 50px 16px 24px;border:1px solid rgba(255,255,255,0.15);border-radius:50px;background:rgba(255,255,255,0.08);backdrop-filter:blur(12px);color:#fff;font-size:16px;outline:none;transition:all 0.3s;font-family:inherit}
  .search-box input::placeholder{color:rgba(255,255,255,0.4)}
  .search-box input:focus{border-color:rgba(255,255,255,0.35);background:rgba(255,255,255,0.14);box-shadow:0 0 30px rgba(79,172,254,0.15)}
  .search-box .search-icon{position:absolute;right:18px;top:50%;transform:translateY(-50%);opacity:0.45;cursor:pointer;display:flex;align-items:center;justify-content:center}
  .search-box .search-icon:hover{opacity:0.85;transform:translateY(-50%)scale(1.08)}
  .search-box .search-icon .feather{width:20px;height:20px}
  .feather{stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
  .links-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:16px;max-width:560px;margin:0 auto}
  .link-card{display:flex;flex-direction:column;align-items:center;padding:14px 8px 10px;border-radius:16px;background:rgba(255,255,255,0.05);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.06);cursor:pointer;transition:all 0.25s;text-decoration:none;color:rgba(255,255,255,0.75);font-size:12px}
  .link-card:hover{background:rgba(255,255,255,0.13);transform:translateY(-4px);border-color:rgba(255,255,255,0.2);color:#fff}
  .link-card .icon{display:flex;align-items:center;justify-content:center;width:32px;height:32px;margin-bottom:6px}
  .link-card .icon .feather{width:26px;height:26px;stroke-width:1.5}
  .footer-quote{margin-top:40px;font-size:13px;color:rgba(255,255,255,0.25);letter-spacing:1px}
</style></head>
<body>
<canvas id="stars-canvas"></canvas>
<div class="container">
  <div class="time" id="clock">00:00</div>
  <div class="greeting" id="greeting"> 今天也要元气满满哦 </div>
  <div class="search-box"><input type="text" id="search-input" placeholder="搜索点什么吧…" autofocus><span class="search-icon" id="search-btn"><i data-feather="search"><\/i><\/span></div>
  <div class="links-grid" id="links-grid"></div>
  <div class="footer-quote">* 做你喜欢的事，成为你想成为的人 *</div>
</div>

</body></html>`;


  // ============================================================
  //  2. DOM 引用
  // ============================================================
  const mainFrame = document.getElementById('main-frame');
  const bubContainer = document.getElementById('bubbles-container');
  const overlay = document.getElementById('overlay');
  const floatEditor = document.getElementById('float-editor');
  const floatTerminal = document.getElementById('float-terminal');
  const floatLinks = document.getElementById('float-links');
  const floatNotes = document.getElementById('float-notes');
  const floatMusic = document.getElementById('float-music');
  const allFloats = [floatEditor, floatTerminal, floatLinks, floatNotes, floatMusic];

  // ============================================================
  //  3. 气泡定义
  // ============================================================
  const BUBBLE_CONFIG = {
    editor: {
      icon: 'edit-3', label: '编辑 HTML', tip: '编辑起始页 HTML',
      float: floatEditor,
      open: null, close: null, // 在下面绑定
    },
    terminal: {
      icon: 'terminal', label: '系统终端', tip: '打开系统终端',
      float: floatTerminal,
      open: null, close: null,
    },
    links: {
      icon: 'link-2', label: '管理链接', tip: '自定义快捷链接',
      float: floatLinks,
      open: null, close: null,
    },
    notes: {
      icon: 'edit', label: '小纸条', tip: '便签笔记',
      float: floatNotes,
      open: null, close: null,
    },
    music: {
      icon: 'music', label: '音乐播放', tip: '网络音频播放',
      float: floatMusic,
      open: null, close: null,
    },
    home: {
      icon: 'home', label: '回到首页', tip: '重置起始页',
      float: null, noFloat: true,
      open: () => {
        const el = bubbleEls['home'];
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const overlay = document.getElementById('transition-overlay');
        const wrapper = document.getElementById('page-wrapper');

        // 第 1 步：展开黑幕（页面保持正常可见）
        overlay.style.transition = 'none';
        overlay.style.clipPath = `circle(0% at ${cx}px ${cy}px)`;
        overlay.classList.add('active');
        void overlay.offsetHeight;

        overlay.style.transition = 'clip-path 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        overlay.style.clipPath = `circle(150% at ${cx}px ${cy}px)`;

        // 第 2 步：精确监听黑幕完全覆盖的时刻 → 切换页面 + 消散
        const onTransitionEnd = () => {
          overlay.removeEventListener('transitionend', onTransitionEnd);

          // 黑幕刚好完全覆盖 → 切换页面 + 收起 wrapper
          wrapper.style.transition = 'none';
          wrapper.style.clipPath = `circle(0% at ${cx}px ${cy}px)`;
          renderPage(localStorage.getItem('my_newtab_code') || DEFAULT_HTML);
          void wrapper.offsetHeight;

          // 消散：黑幕消失，页面从弹珠位置展开
          overlay.style.transition = 'none';
          overlay.style.clipPath = `circle(0% at ${cx}px ${cy}px)`;
          overlay.classList.remove('active');

          wrapper.style.transition = 'clip-path 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
          wrapper.style.clipPath = `circle(150% at ${cx}px ${cy}px)`;

          setTimeout(() => {
            wrapper.style.transition = '';
            wrapper.style.clipPath = '';
            overlay.style.clipPath = '';
            overlay.style.transition = '';
          }, 480);

          // 🏠 弹珠闪绿光
          el.style.transform = 'scale(1.3)';
          el.style.background = 'rgba(166,227,161,0.85)';
          el.style.color = '#1e1e2e';
          el.style.borderColor = 'rgba(166,227,161,0.6)';
          setTimeout(() => {
            el.style.transform = '';
            el.style.background = '';
            el.style.color = '';
            el.style.borderColor = '';
          }, 500);
        };
        overlay.addEventListener('transitionend', onTransitionEnd);
      },
      close: null,
    },
  };
  const BUBBLE_IDS = Object.keys(BUBBLE_CONFIG);
  const BUBBLE_SIZE = 42;

  // ===== 生成气泡 DOM =====
  BUBBLE_IDS.forEach(id => {
    const cfg = BUBBLE_CONFIG[id];
    const el = document.createElement('div');
    el.className = 'bubble';
    el.dataset.bubble = id;
    el.innerHTML = `<span class="bub-icon"><i data-feather="${cfg.icon}"></i></span><span class="bub-tip">${cfg.tip}</span>`;
    bubContainer.appendChild(el);
  });
  feather.replace();

  // ============================================================
  //  4. 气泡位置管理
  // ============================================================
  let bubblePositions = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem('my_bubble_positions'));
      if (saved && BUBBLE_IDS.every(id => saved[id])) return saved;
    } catch {}
    // 随机生成
    const pos = {};
    const M = 24;
    const w = window.innerWidth, h = window.innerHeight;
    const forbid = { x1: w*0.22, x2: w*0.78, y1: h*0.18, y2: h*0.56 };
    BUBBLE_IDS.forEach((id, i) => {
      // 按索引分布在不同的安全区域
      const zones = [
        { x1: M, y1: M, x2: forbid.x1-M, y2: forbid.y2 },
        { x1: forbid.x2+M, y1: M, x2: w-M-BUBBLE_SIZE, y2: forbid.y2 },
        { x1: M, y1: forbid.y2+M, x2: forbid.x1-M, y2: h-M-BUBBLE_SIZE },
      ].filter(z => z.x1<=z.x2 && z.y1<=z.y2);
      const zi = i < zones.length ? i : zones.length-1;
      const z = zones[zi] || { x1: M, y1: h-M-BUBBLE_SIZE-60*i, x2: w-M-BUBBLE_SIZE, y2: h-M-BUBBLE_SIZE-60*i+20 };
      pos[id] = {
        left: z.x1 + (z.x2-z.x1) * (0.2 + 0.6*Math.random()),
        top:  z.y1 + (z.y2-z.y1) * (0.2 + 0.6*Math.random()),
      };
    });
    localStorage.setItem('my_bubble_positions', JSON.stringify(pos));
    return pos;
  })();

  // 应用位置
  const bubbleEls = {};
  BUBBLE_IDS.forEach(id => {
    const el = bubContainer.querySelector(`[data-bubble="${id}"]`);
    bubbleEls[id] = el;
    const p = bubblePositions[id];
    el.style.left = p.left + 'px';
    el.style.top  = p.top  + 'px';
  });

  function saveBubblePos(id) {
    const el = bubbleEls[id];
    const rect = el.getBoundingClientRect();
    bubblePositions[id] = { left: rect.left, top: rect.top };
    localStorage.setItem('my_bubble_positions', JSON.stringify(bubblePositions));
  }

  // ============================================================
  //  5. 气泡交互（Pointer Events）
  // ============================================================
  let activeBubble = null; // 当前打开的是哪个气泡
  let dotDrag = null;
  let clickStart = null;
  let dragBubbleId = null;

  BUBBLE_IDS.forEach(id => {
    const el = bubbleEls[id];

    el.addEventListener('pointerdown', (e) => {
      clickStart = { x: e.clientX, y: e.clientY, id };

      if (e.button === 2) {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        // 弹珠运动中：将当前弹珠从物理引擎中摘除，使其静止
        if (PINBALL && PINBALL.running && PINBALL.bubbles[id]) {
          delete PINBALL.bubbles[id];
          el.classList.remove('pinballing');
          el.style.boxShadow = '';
        }
        dragBubbleId = id;
        const rect = el.getBoundingClientRect();
        dotDrag = {
          startX: e.clientX, startY: e.clientY,
          startLeft: rect.left, startTop: rect.top,
        };
        el.style.cursor = 'grabbing';
      }
      // 音乐弹珠左键：0.2秒长按触发轮盘（仍在物理引擎中的弹珠跳过）
      if (e.button === 0 && id === 'music') {
        const stillMoving = PINBALL && PINBALL.running && PINBALL.bubbles && PINBALL.bubbles[id];
        if (!stillMoving) {
          clearTimeout(pressTimer);
          pressTimer = setTimeout(() => showRadialMenu(el), 200);
        }
      }
    });

    el.addEventListener('pointermove', (e) => {
      // 轮盘菜单激活时追踪方向
      if (miniActive && id === 'music') {
        docMove(e);
        return;
      }
      if (!dotDrag || dragBubbleId !== id) return;
      e.preventDefault();
      const dx = e.clientX - dotDrag.startX;
      const dy = e.clientY - dotDrag.startY;
      let nl = dotDrag.startLeft + dx;
      let nt = dotDrag.startTop + dy;
      nl = Math.max(0, Math.min(window.innerWidth - BUBBLE_SIZE, nl));
      nt = Math.max(0, Math.min(window.innerHeight - BUBBLE_SIZE, nt));
      el.style.left = nl + 'px';
      el.style.top = nt + 'px';
    });

    el.addEventListener('pointerup', (e) => {
      // 轮盘菜单激活时，由 docUp 处理
      if (miniActive && id === 'music') return;
      // 快速点击，清除定时器
      if (id === 'music' && e.button === 0 && !miniActive) clearTimeout(pressTimer);
      if (dotDrag && dragBubbleId === id) {
        try { el.releasePointerCapture(e.pointerId); } catch {}
        saveBubblePos(id);
        dotDrag = null; dragBubbleId = null;
        el.style.cursor = '';
        clickStart = null;
        return;
      }
      // 左键点击检测
      if (e.button === 0 && clickStart && clickStart.id === id) {
        const dx = e.clientX - clickStart.x;
        const dy = e.clientY - clickStart.y;
        clickStart = null;
        if (Math.sqrt(dx*dx + dy*dy) < 6) {
          toggleBubble(id);
        }
      }
    });

    el.addEventListener('contextmenu', (e) => e.preventDefault());
  });

  // ===== 🎵 音乐弹珠轮盘快捷菜单 =====
  let pressTimer = null;
  let miniActive = false;
  let miniCX = 0, miniCY = 0;
  let miniRadius = 68;
  let miniEls = [];
  let miniSectors = [];
  let miniDir = -1;
  let miniArcCenter = 0;
  let miniArcSpan = Math.PI * 0.44;
  const MINI_ACTIONS = [
    { icon: 'skip-forward', label: '下一首', action: () => document.getElementById('mc-next')?.click() },
    { icon: 'play',         label: '播放/暂停', action: () => document.getElementById('mc-play')?.click() },
    { icon: 'skip-back',    label: '上一首', action: () => document.getElementById('mc-prev')?.click() },
    { icon: 'repeat',       label: '循环模式', action: () => document.getElementById('mc-mode')?.click() },
  ];

  function showRadialMenu(el) {
    dismissRadial();
    const rect = el.getBoundingClientRect();
    miniCX = rect.left + rect.width / 2;
    miniCY = rect.top + rect.height / 2;
    miniActive = true;
    document.addEventListener('pointerup', docUp);

    // 检测四边空间，选最宽敞的方向展开弧形
    const spaces = [
      { dir: 0, space: window.innerWidth - miniCX },
      { dir: Math.PI, space: miniCX },
      { dir: -Math.PI/2, space: window.innerHeight - miniCY },
      { dir: Math.PI/2, space: miniCY },
    ].sort((a, b) => b.space - a.space);
    miniArcCenter = spaces[0].dir;

    const SR = 1000, SW = Math.PI * 0.17, D = SR * 2;
    MINI_ACTIONS.forEach((a, i) => {
      const offset = (i - 1.5) * miniArcSpan / 3;
      const angle = miniArcCenter + offset;
      // 透明扇形（半径 1000px，圆心角 30°）
      const sa = angle - SW/2, ea = angle + SW/2;
      const sec = document.createElement('div');
      sec.style.cssText = `position:fixed;left:${miniCX-SR}px;top:${miniCY-SR}px;width:${D}px;height:${D}px;pointer-events:auto;z-index:498;clip-path:polygon(${SR}px ${SR}px,${SR+SR*Math.cos(sa)}px ${SR+SR*Math.sin(sa)}px,${SR+SR*Math.cos(ea)}px ${SR+SR*Math.sin(ea)}px)`;
      sec.addEventListener('mouseenter', () => {
        if (miniDir !== i) {
          miniDir = i;
          miniEls.forEach((el, idx) => {
            if (idx === i) { el.style.transform='scale(1.3)'; el.style.boxShadow='0 0 24px rgba(0,255,255,0.6),0 0 0 3px rgba(0,255,255,0.25)'; el.style.borderColor='rgba(0,255,255,0.8)'; }
            else { el.style.transform=''; el.style.boxShadow=''; el.style.borderColor=''; }
          });
        }
      });
      document.body.appendChild(sec);
      miniSectors.push(sec);
      // 小弹珠
      const x = miniCX + Math.cos(angle) * miniRadius;
      const y = miniCY + Math.sin(angle) * miniRadius;
      const btn = document.createElement('div');
      btn.className = 'mini-ctrl';
      btn.title = a.label;
      btn.style.left = (x - 20) + 'px';
      btn.style.top = (y - 20) + 'px';
      btn.style.animationDelay = (i * 0.04) + 's';
      // 循环模式图标跟随 playMode，播放/暂停跟随 isPlaying
      let icon = a.icon;
      if (i === 1) icon = isPlaying ? 'pause' : 'play';
      if (i === 3) icon = playMode === 'shuffle' ? 'shuffle' : playMode === 'repeat' ? 'repeat' : 'list';
      btn.innerHTML = `<i data-feather="${icon}"></i>`;
      document.body.appendChild(btn);
      miniEls.push(btn);
    });
    // 取消区：覆盖剩余区域的透明圆形，鼠标进入时取消选中
    const cancel = document.createElement('div');
    cancel.style.cssText = `position:fixed;left:${miniCX-1000}px;top:${miniCY-1000}px;width:2000px;height:2000px;pointer-events:auto;z-index:497;clip-path:circle(100% at 1000px 1000px);`;
    cancel.addEventListener('mouseenter', () => {
      if (miniDir !== -1) {
        miniDir = -1;
        miniEls.forEach(el => { el.style.transform=''; el.style.boxShadow=''; el.style.borderColor=''; });
      }
    });
    document.body.appendChild(cancel);
    miniSectors.push(cancel);
    feather.replace();
  }

  function docMove(e) {
    if (!miniActive) return;
    // 计算鼠标相对主弹珠的角度，映射到 4 个小弹珠
    const angle = Math.atan2(e.clientY - miniCY, e.clientX - miniCX);
    let best = -1;
    let minDiff = Infinity;
    for (let i = 0; i < 4; i++) {
      const offset = (i - 1.5) * miniArcSpan / 3;
      const target = miniArcCenter + offset;
      let diff = angle - target;
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      diff = Math.abs(diff);
      if (diff < minDiff) { minDiff = diff; best = i; }
    }
    // 角度差超过弧长的 1/4 就不选中（80°/4 = 20°）
    if (minDiff > miniArcSpan / 4) best = -1;
    if (best === miniDir) return;
    miniDir = best;
    miniEls.forEach((el, idx) => {
      if (idx === best) {
        el.style.transform = 'scale(1.3)';
        el.style.boxShadow = '0 0 24px rgba(0,255,255,0.6), 0 0 0 3px rgba(0,255,255,0.25)';
        el.style.borderColor = 'rgba(0,255,255,0.8)';
      } else {
        el.style.transform = '';
        el.style.boxShadow = '';
        el.style.borderColor = '';
      }
    });
  }

  function confirmDirection() {
    if (miniDir >= 0 && miniDir < MINI_ACTIONS.length) {
      const a = MINI_ACTIONS[miniDir];
      // 修复播放/暂停图标
      if (miniDir === 1) {
        MINI_ACTIONS[1].icon = isPlaying ? 'pause' : 'play';
      }
      a.action();
    }
    dismissRadial();
  }

  function dismissRadial() {
    clearTimeout(pressTimer); pressTimer = null;
    document.removeEventListener('pointermove', docMove);
    document.removeEventListener('pointerup', docUp);
    miniActive = false; miniDir = -1;
    miniEls.forEach(el => { el.classList.add('fade-out'); setTimeout(() => el.remove(), 250); });
    miniEls = [];
    miniSectors.forEach(el => el.remove());
    miniSectors = [];
  }

  function docUp(e) { if (miniActive) { confirmDirection(); } }

  // ============================================================
  //  6. 浮窗打开/关闭
  // ============================================================
  let activeFloatId = null;
  let winDrag = null;

  function toggleBubble(id) {
    if (activeFloatId === id) {
      closeFloat(id);
    } else {
      if (activeFloatId) closeFloat(activeFloatId);
      openFloat(id);
    }
  }

  function openFloat(id) {
    const cfg = BUBBLE_CONFIG[id];
    // 无浮窗弹珠：直接执行动作（防止重入）
    if (cfg.noFloat) {
      if (cfg._busy) return;
      cfg._busy = true;
      if (cfg.open) cfg.open();
      setTimeout(() => { cfg._busy = false; }, 1200);
      activeFloatId = null;
      return;
    }
    activeFloatId = id;
    const el = cfg.float;
    const bubEl = bubbleEls[id];

    // 计算位置
    const br = bubEl.getBoundingClientRect();
    const ew = Math.min(parseInt(el.style.width) || 680, window.innerWidth - 40);
    const eh = Math.min(parseInt(el.style.height) || 400, window.innerHeight - 40);

    let left = br.left + br.width + 10;
    let top = br.top;
    if (left + ew > window.innerWidth - 16) left = Math.max(16, br.left - ew - 10);
    if (left < 16) left = Math.max(16, (window.innerWidth - ew) / 2);
    if (top + eh > window.innerHeight - 16) top = Math.max(16, window.innerHeight - eh - 16);
    if (top < 16) top = 16;

    el.style.left = left + 'px';
    el.style.top = top + 'px';
    el.style.width = ew + 'px';
    el.style.height = eh + 'px';

    overlay.classList.add('active');
    el.classList.add('active');
    bubEl.classList.add('active');

    // 调用各浮窗的 open 回调
    if (cfg.open) cfg.open();
  }

  function closeFloat(id) {
    const cfg = BUBBLE_CONFIG[id];
    if (cfg.close) cfg.close();
    if (cfg.float) cfg.float.classList.remove('active');
    bubbleEls[id].classList.remove('active');
    if (activeFloatId === id) activeFloatId = null;
    if (cfg.float && !allFloats.some(f => f.classList.contains('active'))) {
      overlay.classList.remove('active');
    }
  }

  overlay.addEventListener('click', () => {
    BUBBLE_IDS.forEach(id => { if (activeFloatId === id) closeFloat(id); });
  });

  // 关闭按钮
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeFloat(btn.dataset.close));
  });

  // ESC 关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeFloatId) closeFloat(activeFloatId);
  });

  // ===== 浮窗拖拽（通用） =====
  document.querySelectorAll('[data-drag]').forEach(hdr => {
    const id = hdr.dataset.drag;
    const win = BUBBLE_CONFIG[id].float;

    hdr.addEventListener('mousedown', (e) => {
      if (e.target.closest('.f-close')) return;
      e.preventDefault();
      const rect = win.getBoundingClientRect();
      winDrag = { id, startX: e.clientX, startY: e.clientY, startLeft: rect.left, startTop: rect.top };
      hdr.classList.add('dragging');
    });
  });

  document.addEventListener('mousemove', (e) => {
    if (!winDrag) return;
    const win = BUBBLE_CONFIG[winDrag.id].float;
    win.style.left = (winDrag.startLeft + e.clientX - winDrag.startX) + 'px';
    win.style.top  = (winDrag.startTop  + e.clientY - winDrag.startY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (winDrag) {
      const hdr = BUBBLE_CONFIG[winDrag.id].float.querySelector('[data-drag]');
      if (hdr) hdr.classList.remove('dragging');
      winDrag = null;
    }
  });

  // ============================================================
  //  7. 编辑器功能
  // ============================================================
  const editorEl = document.getElementById('code-editor');
  const edStatus = document.getElementById('ed-status');

  const editor = CodeMirror.fromTextArea(editorEl, {
    mode: 'htmlmixed', theme: 'dracula',
    lineNumbers: true, lineWrapping: true, indentUnit: 2, tabSize: 2,
  });

  
// 起始页脚本（从 DEFAULT_HTML 中提取，动态注入）
const PAGE_SCRIPT = `
  !function(){const c=document.getElementById('stars-canvas'),x=c.getContext('2d');let s=[];const N=150;
  function r(){c.width=window.innerWidth,c.height=window.innerHeight}r(),window.addEventListener('resize',r);
  for(let i=0;i<N;i++)s.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.8+0.5,a:Math.random(),sp:Math.random()*0.008+0.003});
  !function d(){x.clearRect(0,0,c.width,c.height);s.forEach(t=>{t.a+=t.sp,t.a>1||t.a<0.2&&(t.sp=-t.sp),x.beginPath(),x.arc(t.x,t.y,t.r,0,Math.PI*2),x.fillStyle='rgba(255,255,255,'+t.a+')',x.fill()});requestAnimationFrame(d)}()}();
  !function t(){const n=new Date;document.getElementById('clock').textContent=(n.getHours()+'').padStart(2,'0')+':'+(n.getMinutes()+'').padStart(2,'0')+':'+(n.getSeconds()+'').padStart(2,'0');
  const h=n.getHours();let g='';h<6?g='夜深了':h<9?g='早上好':h<12?g='上午好':h<14?g='中午好':h<18?g='下午好':h<21?g='傍晚好':g='晚安';
  document.getElementById('greeting').innerHTML=''+g+'';setTimeout(t,1000)}();
  document.getElementById('search-btn').onclick=function(){const q=document.getElementById('search-input').value.trim();q&&(location.href='https://www.bing.com/search?q='+encodeURI(q))};
  document.getElementById('search-input').addEventListener('keydown',function(e){e.key==='Enter'&&document.getElementById('search-btn').click()});
  const savedLinks = localStorage.getItem('my_custom_links');
  if (savedLinks) {
    try {
      const L = JSON.parse(savedLinks);
      const G=document.getElementById('links-grid');G.innerHTML='';
      L.forEach(l=>{const a=document.createElement('a');a.href=l.u,a.target='_blank',a.className='link-card',a.innerHTML='<span class="icon"><i data-feather="'+l.ic+'"><\/i><\/span><span class="label">'+l.lb+'</span>',G.appendChild(a)});
    } catch(e){}
  } else {
    const defaultLinks = [
      {ic:'play',lb:'BiliBili',u:'https://www.bilibili.com'},
      {ic:'film',lb:'YouTube',u:'https://www.youtube.com'},
      {ic:'github',lb:'GitHub',u:'https://github.com'},
      {ic:'edit-3',lb:'Zhihu',u:'https://www.zhihu.com'},
      {ic:'image',lb:'Pixiv',u:'https://www.pixiv.net'},
      {ic:'message-square',lb:'ChatGPT',u:'https://chat.openai.com'},
      {ic:'music',lb:'NetEase',u:'https://music.163.com'},
      {ic:'box',lb:'NPM',u:'https://www.npmjs.com'},
    ];
    localStorage.setItem('my_custom_links', JSON.stringify(defaultLinks));
    const G=document.getElementById('links-grid');
    defaultLinks.forEach(l=>{const a=document.createElement('a');a.href=l.u,a.target='_blank',a.className='link-card',a.innerHTML='<span class="icon"><i data-feather="'+l.ic+'"><\/i><\/span><span class="label">'+l.lb+'</span>',G.appendChild(a)});
  }
  feather.replace();
`;

function renderPage(html) {
    mainFrame.srcdoc = html;
    // 等待 iframe 加载后注入脚本（Blob URL 绕过 CSP）
    mainFrame.onload = () => {
        try {
            const doc = mainFrame.contentDocument || mainFrame.contentWindow.document;
            const s = doc.createElement('script');
            const blob = new Blob([PAGE_SCRIPT], { type: 'text/javascript' });
            s.src = URL.createObjectURL(blob);
            doc.body.appendChild(s);
        } catch(e) { console.warn('Pinball: script inject failed', e); }
        mainFrame.onload = null;
    };
}

  function loadPage() {
    const saved = localStorage.getItem('my_newtab_code');
    const html = saved || DEFAULT_HTML;
    renderPage(html);
    editor.setValue(html);
  }
  loadPage();

  function runCode() {
    const code = editor.getValue();
    renderPage(code);
    localStorage.setItem('my_newtab_code', code);
    edStatus.textContent = '✅ 已更新';
    setTimeout(() => { edStatus.textContent = '就绪'; }, 1500);
  }

  function saveCode() {
    localStorage.setItem('my_newtab_code', editor.getValue());
    edStatus.textContent = '💾 已保存';
    setTimeout(() => { edStatus.textContent = '就绪'; }, 1500);
  }

  document.getElementById('btn-run').addEventListener('click', runCode);
  document.getElementById('btn-save-ed').addEventListener('click', saveCode);
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm('重置为默认起始页？')) {
      editor.setValue(DEFAULT_HTML);
      runCode();
    }
  });
  editor.setOption('extraKeys', { 'Ctrl-Enter': runCode, 'Cmd-Enter': runCode });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveCode(); }
  });

  BUBBLE_CONFIG.editor.open = () => {
    editor.refresh();
    setTimeout(() => editor.focus(), 100);
  };

  // ============================================================
  //  8. 终端功能
  // ============================================================
  let termWs = null;
  let termConnected = false;
  let term = null;
  let termFit = null;
  const termDot = document.getElementById('term-dot');
  const termLabel = document.getElementById('term-label');
  const termStatus = document.getElementById('term-status');

  function initTerminal() {
    const container = document.getElementById('terminal-container');
    container.innerHTML = '';
    term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'bar',
      fontSize: 14,
      fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
      theme: {
        background: '#1a1a2e', foreground: '#cdd6f4',
        cursor: '#cba6f7', selectionBackground: '#45475a',
        black: '#45475a', red: '#f38ba8', green: '#a6e3a1',
        yellow: '#f9e2af', blue: '#89b4fa', magenta: '#cba6f7',
        cyan: '#94e2d5', white: '#cdd6f4',
      },
    });
    termFit = new FitAddon.FitAddon();
    term.loadAddon(termFit);
    term.open(container);
    termFit.fit();
    term.write('欢迎使用系统终端\r\n');
    term.write('运行终端服务器后可连接:\r\n');
    term.write('  python3 terminal_server.py\r\n\r\n');
    term.write('键入命令按 Enter 执行...\r\n\r\n$ ');

    let cmdBuffer = '';
    term.onKey(e => {
      const ev = e.domEvent;
      if (ev.key === 'Enter') {
        term.write('\r\n');
        if (termWs && termWs.readyState === WebSocket.OPEN) {
          termWs.send(cmdBuffer + '\n');
        } else {
          term.write(`\x1b[31m[未连接] 请先连接终端服务器\x1b[0m\r\n`);
        }
        cmdBuffer = '';
        term.write('$ ');
      } else if (ev.key === 'Backspace') {
        if (cmdBuffer.length > 0) {
          cmdBuffer = cmdBuffer.slice(0, -1);
          term.write('\b \b');
        }
      } else if (!ev.ctrlKey && !ev.metaKey && ev.key.length === 1) {
        cmdBuffer += ev.key;
        term.write(ev.key);
      }
    });

    // 窗口缩放适配
    const ro = new ResizeObserver(() => {
      try { termFit.fit(); } catch {}
    });
    ro.observe(container);
  }

  function connectTerminal() {
    if (termWs) {
      try { termWs.close(); } catch {}
      termWs = null;
    }
    termDot.className = 'dot';
    termLabel.textContent = '正在连接...';
    termStatus.textContent = '连接中';

    try {
      termWs = new WebSocket('ws://localhost:8765');
      termWs.onopen = () => {
        termDot.className = 'dot connected';
        termLabel.textContent = '已连接到终端服务器';
        termStatus.textContent = '已连接';
        term.write('\x1b[32m✓ 连接成功！\x1b[0m\r\n');
        termConnected = true;
        bubbleEls['terminal'] && bubbleEls['terminal'].classList.add('term-connected');
      };
      termWs.onmessage = (e) => {
        term.write(e.data);
      };
      termWs.onclose = () => {
        termDot.className = 'dot';
        termLabel.textContent = '连接已断开';
        termStatus.textContent = '已断开';
        termWs = null;
        term.write('\r\n\x1b[33m! 连接已断开\x1b[0m\r\n');
        termConnected = false;
        bubbleEls['terminal'] && bubbleEls['terminal'].classList.remove('term-connected');
      };
      termWs.onerror = () => {
        termDot.className = 'dot';
        termLabel.textContent = '连接失败 - 终端服务器未运行';
        termStatus.textContent = '未连接';
        termWs = null;
        term.write('\r\n\x1b[31m! 连接失败，请运行终端服务器\x1b[0m\r\n');
        term.write('  python3 terminal_server.py\r\n');
        termConnected = false;
        bubbleEls['terminal'] && bubbleEls['terminal'].classList.remove('term-connected');
      };
    } catch (err) {
      termLabel.textContent = '连接出错';
      termStatus.textContent = '错误';
    }
  }

  document.getElementById('term-reconnect').addEventListener('click', connectTerminal);

  BUBBLE_CONFIG.terminal.open = () => {
    if (!term) { initTerminal(); }
    setTimeout(() => {
      try {
        termFit.fit();
        term.focus();
      } catch {}
    }, 100);
  };

  BUBBLE_CONFIG.terminal.close = () => {
    // 不断开连接，只关闭界面
  };

  // ============================================================
  //  9. 链接管理功能
  // ============================================================
  function getLinks() {
    try {
      return JSON.parse(localStorage.getItem('my_custom_links')) || [];
    } catch { return []; }
  }

  function saveLinks(links) {
    localStorage.setItem('my_custom_links', JSON.stringify(links));
    // 同时也更新编辑器中的代码
    const editorCode = editor.getValue();
    // 重新渲染 iframe 让链接更新
    refreshIframeLinks();
  }

  function refreshIframeLinks() {
    const code = editor.getValue();
    renderPage(code);
  }

  function renderLinksList() {
    const list = document.getElementById('links-list');
    const links = getLinks();
    const lkStatus = document.getElementById('lk-status');
    lkStatus.textContent = `${links.length} 个链接`;

    if (links.length === 0) {
      list.innerHTML = `<div class="links-empty"><i data-feather="link-2"></i><br>还没有快捷链接<br>添加一个吧</div>`;
      feather.replace();
      return;
    }

    list.innerHTML = '';
    links.forEach((link, idx) => {
      const item = document.createElement('div');
      item.className = 'link-item';
      item.innerHTML = `
        <span class="li-icon"><i data-feather="${link.ic || 'link'}"></i></span>
        <span class="li-name">${link.lb}</span>
        <span class="li-url">${link.u}</span>
        <button class="li-move" data-moveup="${idx}" title="上移">↑</button>
        <button class="li-move" data-movedown="${idx}" title="下移">↓</button>
        <button class="li-edit" data-edit="${idx}" title="编辑">✎</button>
        <button class="li-del" data-del="${idx}" title="删除">✕</button>
      `;
      list.appendChild(item);
    });
    feather.replace();

    // 上移
    list.querySelectorAll('[data-moveup]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.moveup);
        if (idx === 0) return;
        const links = getLinks();
        [links[idx-1], links[idx]] = [links[idx], links[idx-1]];
        saveLinks(links); renderLinksList(); refreshIframeLinks();
      });
    });
    // 下移
    list.querySelectorAll('[data-movedown]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.movedown);
        const links = getLinks();
        if (idx >= links.length - 1) return;
        [links[idx], links[idx+1]] = [links[idx+1], links[idx]];
        saveLinks(links); renderLinksList(); refreshIframeLinks();
      });
    });

    // 删除事件
    list.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.del);
        const links = getLinks();
        links.splice(idx, 1);
        saveLinks(links);
        renderLinksList();
        refreshIframeLinks();
      });
    });

    // 编辑事件（简化：删除后弹出添加框）
    list.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.edit);
        const links = getLinks();
        const link = links[idx];
        document.getElementById('lk-name').value = link.lb;
        document.getElementById('lk-url').value = link.u;
        // 删除原条目，点添加时重新加入
        links.splice(idx, 1);
        saveLinks(links);
        renderLinksList();
        refreshIframeLinks();
        document.getElementById('lk-name').focus();
      });
    });

    // 点击图标打开选择器
    list.querySelectorAll('.li-icon').forEach((el, i) => {
      el.style.cursor = 'pointer';
      el.title = '点击更换图标';
      el.addEventListener('click', () => openIconPicker(i));
    });
  }

  // ===== 图标选择器 =====
  let pickerTargetIdx = -1;
  let allIcons = [];

  function getAllFeatherIcons() {
    if (allIcons.length > 0) return allIcons;
    try { allIcons = Object.keys(feather.icons).sort(); }
    catch { allIcons = ['link','play','film','github','edit-3','image','message-square','music','box','search','at-sign','globe','star','heart','home','settings','user','calendar','clock','bookmark','tag','map-pin','cloud','phone','mail','camera','database','download','upload','trash-2','external-link','share-2'];}
    return allIcons;
  }

  function openIconPicker(idx) {
    pickerTargetIdx = idx;
    const picker = document.getElementById('lk-icon-picker');
    const grid = document.getElementById('lk-ip-grid');
    picker.style.display = 'flex';
    const icons = getAllFeatherIcons();
    const links = getLinks();
    const current = links[idx]?.ic || 'link';
    grid.innerHTML = '';
    icons.forEach(name => {
      const item = document.createElement('div');
      item.className = 'ip-item' + (name === current ? ' selected' : '');
      item.dataset.icon = name;
      item.innerHTML = `<i data-feather="${name}"></i>`;
      item.addEventListener('click', () => {
        const links = getLinks();
        if (links[pickerTargetIdx]) {
          links[pickerTargetIdx].ic = name;
          saveLinks(links);
          renderLinksList();
          refreshIframeLinks();
        }
        closeIconPicker();
      });
      grid.appendChild(item);
    });
    feather.replace();
    document.getElementById('lk-ip-search').value = '';
    document.getElementById('lk-ip-search').focus();
  }

  function closeIconPicker() {
    document.getElementById('lk-icon-picker').style.display = 'none';
  }

  function filterIcons() {
    const q = document.getElementById('lk-ip-search').value.trim().toLowerCase();
    const grid = document.getElementById('lk-ip-grid');
    grid.querySelectorAll('.ip-item').forEach(el => {
      const name = el.dataset.icon;
      el.style.display = !q || name.includes(q) ? '' : 'none';
    });
  }

  document.getElementById('lk-ip-close').addEventListener('click', closeIconPicker);
  document.getElementById('lk-ip-search').addEventListener('input', filterIcons);
  document.getElementById('lk-ip-search').addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeIconPicker();
  });

  document.getElementById('lk-add').addEventListener('click', () => {
    const name = document.getElementById('lk-name').value.trim();
    const url = document.getElementById('lk-url').value.trim();
    if (!name || !url) return;

    // 简单判断图标
    let icon = 'link';
    const lower = name.toLowerCase();
    if (lower.includes('b站') || lower.includes('bili')) icon = 'play';
    else if (lower.includes('youtube') || lower.includes('yt')) icon = 'film';
    else if (lower.includes('github') || lower.includes('git')) icon = 'github';
    else if (lower.includes('知乎')) icon = 'edit-3';
    else if (lower.includes('pixiv') || lower.includes('插画')) icon = 'image';
    else if (lower.includes('chatgpt') || lower.includes('gpt')) icon = 'message-square';
    else if (lower.includes('音乐') || lower.includes('网易')) icon = 'music';
    else if (lower.includes('npm') || lower.includes('包')) icon = 'box';
    else if (lower.includes('谷歌') || lower.includes('google')) icon = 'search';
    else if (lower.includes('微博')) icon = 'at-sign';
    else if (lower.includes('twitter') || lower.includes('x')) icon = 'twitter';
    else if (lower.includes(',')) icon = 'globe';

    const links = getLinks();
    links.push({ ic: icon, lb: name, u: url.startsWith('http') ? url : 'https://' + url });
    saveLinks(links);
    renderLinksList();
    refreshIframeLinks();
    document.getElementById('lk-name').value = '';
    document.getElementById('lk-url').value = '';
  });

  // Enter 添加
  document.getElementById('lk-url').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('lk-add').click();
  });

  BUBBLE_CONFIG.links.open = () => {
    renderLinksList();
  };

  // ============================================================
  //  11. 小纸条功能
  // ============================================================
  let notesData = [];
  let currentNoteId = null;

  function loadNotes() {
    try { notesData = JSON.parse(localStorage.getItem('my_notes')) || []; }
    catch { notesData = []; }
    if (notesData.length === 0) {
      notesData = [{ id: 'note_1', title: '欢迎使用小纸条 📝', content: '在这里记下你的想法吧～\n\n可以创建多条便签\n支持导入/导出 TXT 文件' }];
      saveNotes();
    }
    return notesData;
  }

  function saveNotes() {
    localStorage.setItem('my_notes', JSON.stringify(notesData));
    document.getElementById('nt-status').textContent = `${notesData.length} 条笔记`;
  }

  function renderNotesList() {
    const list = document.getElementById('nt-list');
    list.innerHTML = '';
    notesData.forEach(n => {
      const item = document.createElement('div');
      item.className = 'nt-item' + (n.id === currentNoteId ? ' active' : '');
      item.innerHTML = `${n.title}<button class="nt-del" data-ntdel="${n.id}">✕</button>`;
      item.addEventListener('click', (e) => { if (!e.target.closest('.nt-del')) selectNote(n.id); });
      list.appendChild(item);
    });
    list.querySelectorAll('[data-ntdel]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.ntdel;
        notesData = notesData.filter(n => n.id !== id);
        if (currentNoteId === id) currentNoteId = notesData.length > 0 ? notesData[0].id : null;
        saveNotes(); renderNotesList();
        if (currentNoteId) renderNoteContent(currentNoteId); else clearNoteEditor();
      });
    });
    if (!currentNoteId || !notesData.find(n => n.id === currentNoteId)) {
      currentNoteId = notesData.length > 0 ? notesData[0].id : null;
    }
  }

  function selectNote(id) { currentNoteId = id; renderNotesList(); renderNoteContent(id); }

  function renderNoteContent(id) {
    const note = notesData.find(n => n.id === id);
    if (!note) return;
    document.getElementById('nt-title').value = note.title;
    document.getElementById('nt-content').value = note.content;
    document.getElementById('nt-saved').textContent = '已加载 ✓';
  }

  function clearNoteEditor() { document.getElementById('nt-title').value = ''; document.getElementById('nt-content').value = ''; document.getElementById('nt-saved').textContent = ''; }

  function saveCurrentNote() {
    if (!currentNoteId) return;
    const note = notesData.find(n => n.id === currentNoteId);
    if (!note) return;
    note.title = document.getElementById('nt-title').value.trim() || '未命名';
    note.content = document.getElementById('nt-content').value;
    saveNotes(); renderNotesList();
    document.getElementById('nt-saved').textContent = '已保存 ✓';
    setTimeout(() => { document.getElementById('nt-saved').textContent = '自动保存 ✓'; }, 2000);
  }

  document.getElementById('nt-new').addEventListener('click', () => {
    const id = 'note_' + Date.now();
    notesData.push({ id, title: '新便签', content: '' });
    saveNotes(); selectNote(id);
    document.getElementById('nt-title').focus();
  });

  document.getElementById('nt-save').addEventListener('click', saveCurrentNote);

  document.getElementById('nt-content').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveCurrentNote(); }
  });

  let autoSaveTimer;
  document.getElementById('nt-title').addEventListener('input', () => {
    clearTimeout(autoSaveTimer); document.getElementById('nt-saved').textContent = '未保存…';
    autoSaveTimer = setTimeout(saveCurrentNote, 800);
  });
  document.getElementById('nt-content').addEventListener('input', () => {
    clearTimeout(autoSaveTimer); document.getElementById('nt-saved').textContent = '未保存…';
    autoSaveTimer = setTimeout(saveCurrentNote, 800);
  });

  document.getElementById('nt-export').addEventListener('click', () => {
    if (!currentNoteId) return;
    const note = notesData.find(n => n.id === currentNoteId);
    if (!note) return;
    const blob = new Blob([`# ${note.title}

${note.content}`], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${note.title}.txt`; a.click();
    URL.revokeObjectURL(a.href);
    document.getElementById('nt-saved').textContent = '📥 已下载';
  });

  document.getElementById('nt-import').addEventListener('click', () => { document.getElementById('nt-file-input').click(); });
  document.getElementById('nt-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      let title = file.name.replace(/\.txt$/i, '');
      let content = ev.target.result;
      const lines = content.split('\n');
      if (lines[0] && lines[0].startsWith('# ')) { title = lines[0].slice(2).trim(); content = lines.slice(1).join('\n').trim(); }
      notesData.push({ id: 'note_' + Date.now(), title, content });
      saveNotes(); selectNote(notesData[notesData.length - 1].id);
      document.getElementById('nt-saved').textContent = '📤 已导入';
    };
    reader.readAsText(file, 'UTF-8');
    this.value = '';
  });

  BUBBLE_CONFIG.notes.open = () => {
    loadNotes(); renderNotesList();
    if (currentNoteId) renderNoteContent(currentNoteId);
    else if (notesData.length > 0) selectNote(notesData[0].id);
  };

  // ============================================================
  //  13. 🎵 音乐播放器
  // ============================================================
  let audioEl = null;
  let musicList = [];
  let currentTrack = -1;
  let isPlaying = false;

  function loadMusicList() {
    try { musicList = JSON.parse(localStorage.getItem('my_music_list')) || []; }
    catch { musicList = []; }
    if (musicList.length === 0) {
      musicList = [
        { name: '示例音乐', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      ];
      saveMusicList();
    }
    return musicList;
  }

  function saveMusicList() {
    localStorage.setItem('my_music_list', JSON.stringify(musicList));
    document.getElementById('mc-status').textContent =
      isPlaying ? '▶ 播放中' : (musicList.length + ' 首曲目');
  }

  function renderMusicList() {
    const list = document.getElementById('mc-list');
    list.innerHTML = '';
    musicList.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = 'ml-item' + (i === currentTrack ? ' active' : '');
      item.innerHTML = `
        <span class="ml-index">${i + 1}</span>
        <span class="ml-name">${t.name}</span>
        <button class="ml-del" data-mdel="${i}">✕</button>`;
      item.addEventListener('click', (e) => {
        if (e.target.closest('.ml-del')) return;
        playTrack(i);
      });
      list.appendChild(item);
    });
    list.querySelectorAll('[data-mdel]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const i = parseInt(btn.dataset.mdel);
        musicList.splice(i, 1);
        if (currentTrack === i) { stopTrack(); currentTrack = -1; }
        else if (currentTrack > i) currentTrack--;
        saveMusicList(); renderMusicList();
        if (musicList.length === 0) {
          document.getElementById('mc-title').textContent = '播放列表为空';
          document.getElementById('mc-status').textContent = '已停止';
        }
      });
    });
  }

  function initAudio() {
    if (!audioEl) {
      audioEl = new Audio();
      audioEl.addEventListener('timeupdate', updateProgress);
      audioEl.addEventListener('loadedmetadata', () => {
        document.getElementById('mc-duration').textContent = formatTime(audioEl.duration);
        document.getElementById('mc-progress').max = Math.floor(audioEl.duration) || 100;
      });
      audioEl.addEventListener('ended', () => {
        if (playMode === 'repeat' && currentTrack >= 0) {
          // 单曲循环：重播当前曲目
          audioEl.currentTime = 0;
          audioEl.play().catch(() => {});
        } else if (playMode === 'shuffle' && musicList.length > 0) {
          // 随机：随机选一首（不和当前相同）
          let next;
          do { next = Math.floor(Math.random() * musicList.length); }
          while (next === currentTrack && musicList.length > 1);
          playTrack(next);
        } else {
          // 顺序：播下一首，最后一首停止
          if (currentTrack < musicList.length - 1) playTrack(currentTrack + 1);
          else stopTrack();
        }
      });
      audioEl.addEventListener('play', () => {
        isPlaying = true;
        document.getElementById('mc-play').textContent = '⏸';
        saveMusicList();
        bubbleEls['music'] && bubbleEls['music'].classList.add('music-playing');
      });
      audioEl.addEventListener('pause', () => {
        isPlaying = false;
        document.getElementById('mc-play').textContent = '▶';
        saveMusicList();
        bubbleEls['music'] && bubbleEls['music'].classList.remove('music-playing');
      });
      // 加载出错时自动切下一首
      audioEl.addEventListener('error', () => {
        // 播放失败时不切歌/停播，保留选中状态并提示
        if (currentTrack >= 0 && currentTrack < musicList.length) {
          const name = musicList[currentTrack]?.name || '未知';
          document.getElementById('mc-title').textContent = '⚠️ 无法播放: ' + name;
        }
        document.getElementById('mc-status').textContent = '加载失败';
        isPlaying = false;
        document.getElementById('mc-play').textContent = '▶';
        // 尝试播下一首（但不影响 currentTrack 高亮）
        if (currentTrack >= 0 && currentTrack < musicList.length - 1) {
          const next = currentTrack + 1;
          if (audioEl) { audioEl.pause(); audioEl.removeAttribute('src'); audioEl.load(); }
          currentTrack = next;
          const track = musicList[next];
          audioEl.src = track.url;
          audioEl.load();
          audioEl.play().catch(() => {});
          document.getElementById('mc-title').textContent = track.name;
          document.getElementById('mc-source').textContent = track.url;
          renderMusicList();
          saveMusicList();
        }
      });
    }
  }

  // ===== 🎵 音乐可视化：弹珠随声律动 =====
  let audioCtx = null;
  let analyser = null;
  function playTrack(index) {
    if (index < 0 || index >= musicList.length) return;
    initAudio();
    currentTrack = index;
    const track = musicList[index];
    // 先重置进度条
    document.getElementById('mc-progress').value = 0;
    document.getElementById('mc-current').textContent = '00:00';
    document.getElementById('mc-duration').textContent = '00:00';
    audioEl.src = track.url;
    // 加载后自动播放，失败时静默处理
    audioEl.load();
    audioEl.play().catch(() => {});
    document.getElementById('mc-title').textContent = track.name;
    document.getElementById('mc-source').textContent = track.url;
    renderMusicList();
    saveMusicList();
  }

  function stopTrack() {
    if (audioEl) { audioEl.pause(); audioEl.removeAttribute('src'); audioEl.load(); }
    isPlaying = false;
    currentTrack = -1;
    document.getElementById('mc-play').textContent = '▶';
    document.getElementById('mc-title').textContent = '未选择歌曲';
    document.getElementById('mc-current').textContent = '00:00';
    document.getElementById('mc-duration').textContent = '00:00';
    document.getElementById('mc-progress').value = 0;
    document.getElementById('mc-progress').max = 100;
    renderMusicList();
    saveMusicList();
    bubbleEls['music'] && bubbleEls['music'].classList.remove('music-playing');
  }

  // ===== 进度条拖拽防冲突 =====
  let seeking = false;

  document.getElementById('mc-progress').addEventListener('mousedown', () => { seeking = true; });
  document.getElementById('mc-progress').addEventListener('touchstart', () => { seeking = true; });
  document.getElementById('mc-progress').addEventListener('input', (e) => {
    if (audioEl && audioEl.duration) {
      audioEl.currentTime = parseFloat(e.target.value);
    }
  });
  document.getElementById('mc-progress').addEventListener('change', () => { seeking = false; });
  document.getElementById('mc-progress').addEventListener('mouseup', () => { seeking = false; });
  document.getElementById('mc-progress').addEventListener('touchend', () => { seeking = false; });
  document.addEventListener('mouseup', () => { if (seeking) seeking = false; });

  function formatTime(sec) {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function updateProgress() {
    if (!audioEl || !audioEl.duration || seeking) return;
    document.getElementById('mc-current').textContent = formatTime(audioEl.currentTime);
    document.getElementById('mc-progress').value = Math.floor(audioEl.currentTime);
  }

  // 控制按钮
  document.getElementById('mc-play').addEventListener('click', () => {
    if (!audioEl || !audioEl.src) {
      if (musicList.length > 0) playTrack(0);
      return;
    }
    if (audioEl.paused) audioEl.play().catch(() => {});
    else audioEl.pause();
  });

  document.getElementById('mc-next').addEventListener('click', () => {
    if (musicList.length === 0) return;
    if (currentTrack < musicList.length - 1) playTrack(currentTrack + 1);
    else playTrack(0);
  });

  document.getElementById('mc-prev').addEventListener('click', () => {
    if (musicList.length === 0) return;
    if (currentTrack > 0) playTrack(currentTrack - 1);
    else playTrack(musicList.length - 1);
  });

  document.getElementById('mc-progress').addEventListener('input', (e) => {
    if (audioEl && audioEl.duration) {
      audioEl.currentTime = parseFloat(e.target.value);
    }
  });

  // ===== 音量控制 =====
  let volMuted = false;
  
  function syncVolumeIcon() {
    const vol = parseInt(document.getElementById('mc-volume-slider').value);
    const icon = document.getElementById('mc-vol-icon');
    const label = document.getElementById('mc-vol-label');
    if (volMuted || vol === 0) {
      icon.textContent = '○';
      label.textContent = '静音';
    } else {
      icon.textContent = '◉';
      label.textContent = '音量 ' + vol;
    }
  }

  document.getElementById('mc-volume').addEventListener('click', () => {
    if (!audioEl) return;
    volMuted = !volMuted;
    audioEl.muted = volMuted;
    syncVolumeIcon();
  });

  document.getElementById('mc-volume-slider').addEventListener('input', (e) => {
    if (!audioEl) return;
    const val = parseInt(e.target.value);
    audioEl.volume = val / 100;
    if (audioEl.muted && val > 0) { audioEl.muted = false; volMuted = false; }
    syncVolumeIcon();
  });

  // ===== 循环模式 =====
  const MODE_ICONS = {
    order: '→▪', orderLabel: '顺序',
    repeat: '↺', repeatLabel: '单曲',
    shuffle: '⇄', shuffleLabel: '随机'
  };
  const MODE_NEXT = { order: 'repeat', repeat: 'shuffle', shuffle: 'order' };
  let playMode = 'order';

  document.getElementById('mc-mode').addEventListener('click', () => {
    playMode = MODE_NEXT[playMode];
    const icon = MODE_ICONS[playMode];
    const label = MODE_ICONS[playMode + 'Label'];
    document.getElementById('mc-mode').innerHTML = icon + ' <span class="mc-label">' + label + '</span>';
    // 点击反馈
    const el = document.getElementById('mc-mode');
    el.style.transform = 'scale(1.08)';
    setTimeout(() => el.style.transform = '', 150);
  });

  // 重写 ended 事件支持三种模式
  document.getElementById('mc-add').addEventListener('click', () => {
    const url = document.getElementById('mc-url').value.trim();
    if (!url) return;
    let name = document.getElementById('mc-name').value.trim();
    if (!name) {
      name = url.split('/').pop().split('?')[0] || url;
      if (name.length > 30) name = name.slice(0, 27) + '…';
    }
    musicList.push({ name, url });
    saveMusicList(); renderMusicList();
    document.getElementById('mc-url').value = '';
    document.getElementById('mc-name').value = '';
    if (musicList.length === 1) playTrack(0);
  });

  // 两个输入框都支持回车添加
  document.getElementById('mc-url').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('mc-add').click();
  });
  document.getElementById('mc-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('mc-add').click();
  });

  // 文件选择器：选择本地音频文件
  document.getElementById('mc-file').addEventListener('click', () => {
    document.getElementById('mc-file-input').click();
  });
  document.getElementById('mc-file-input').addEventListener('change', (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      let name = document.getElementById('mc-name').value.trim() || file.name.replace(/\.[^.]+$/, '');
      musicList.push({ name, url });
    });
    saveMusicList(); renderMusicList();
    document.getElementById('mc-name').value = '';
    e.target.value = '';
    if (musicList.length > 0 && typeof audioEl !== 'undefined' && (audioEl.paused || !audioEl.src)) {
      playTrack(musicList.length - files.length);
    }
  });

  BUBBLE_CONFIG.music.open = () => {
    loadMusicList(); renderMusicList();
    initAudio();
  };

  // ============================================================
  //  14. 初始渲染
  // ============================================================
  // 首次加载时确保音乐播放器可用
  loadMusicList(); initAudio();

  // 首次加载时确保默认链接存在
  if (!localStorage.getItem('my_custom_links')) {
    const defaults = [
      {ic:'play',lb:'B站',u:'https://www.bilibili.com'},
      {ic:'film',lb:'YouTube',u:'https://www.youtube.com'},
      {ic:'github',lb:'GitHub',u:'https://github.com'},
      {ic:'edit-3',lb:'知乎',u:'https://www.zhihu.com'},
      {ic:'image',lb:'Pixiv',u:'https://www.pixiv.net'},
      {ic:'message-square',lb:'ChatGPT',u:'https://chat.openai.com'},
      {ic:'music',lb:'网易云',u:'https://music.163.com'},
      {ic:'box',lb:'NPM',u:'https://www.npmjs.com'},
    ];
    localStorage.setItem('my_custom_links', JSON.stringify(defaults));
  }

  // ============================================================
  //  15. 🎱 弹珠物理引擎
  // ============================================================
  const PINBALL = {
    running: false,
    animId: null,
    startTime: 0,
    maxDuration: 18000,   // 最多弹 18 秒
    minSpeed: 8,          // 速度低于此值停止
    bubbles: {},
  };

  /** 启动弹射（支持连续点击加速！） */
  function launchPinball() {
    // 关闭所有打开的浮窗
    BUBBLE_IDS.forEach(id => {
      if (activeFloatId === id) closeFloat(id);
    });

    const btn = document.getElementById('pinball-btn');
    const S = BUBBLE_SIZE;

    if (!PINBALL.running) {
      // ===== 首次启动 =====
      btn.classList.add('launching');
      btn.querySelector('.pb-label').textContent = '弹珠中';

      PINBALL.startTime = performance.now();
      PINBALL.bubbles = {};

      BUBBLE_IDS.forEach(id => {
        const el = bubbleEls[id];
        const rect = el.getBoundingClientRect();
        el.style.left = rect.left + 'px';
        el.style.top  = rect.top  + 'px';
        el.style.bottom = 'auto';
        el.style.right  = 'auto';
        el.classList.add('pinballing');

        const angle = Math.random() * Math.PI * 2;
        const speed = 6000 + Math.random() * 5000;
        PINBALL.bubbles[id] = {
          el, x: rect.left, y: rect.top,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        };
      });

      PINBALL.running = true;
      startPinballLoop();

    } else {
      // ===== 连续弹射：叠加冲量！像弹珠机拉杆一样 =====
      btn.querySelector('.pb-label').textContent = '弹珠中 +1';

      BUBBLE_IDS.forEach(id => {
        const el = bubbleEls[id];
        let b = PINBALL.bubbles[id];
        // 被摘出的弹珠重新加入物理引擎
        if (!b) {
          const rect = el.getBoundingClientRect();
          el.classList.add('pinballing');
          b = PINBALL.bubbles[id] = {
            el, x: rect.left, y: rect.top,
            vx: 0, vy: 0,
          };
        }
        const angle = Math.random() * Math.PI * 2;
        const impulse = 4000 + Math.random() * 3000;
        b.vx += Math.cos(angle) * impulse;
        b.vy += Math.sin(angle) * impulse;
      });

      // 续命：重置计时器
      PINBALL.startTime = performance.now();

      // 闪烁反馈
      btn.style.transition = 'none';
      btn.style.transform = 'scale(1.15)';
      setTimeout(() => {
        btn.style.transition = 'transform 0.2s';
        btn.style.transform = '';
        btn.querySelector('.pb-label').textContent = '弹珠中';
      }, 120);
    }
  }

  /** 动画主循环 */
  function startPinballLoop() {
    const S = BUBBLE_SIZE;
    let lastTime = performance.now();

    function tick(now) {
      if (!PINBALL.running) return;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const FRICTION = 0.998;
      const BOUNCE  = 0.72;
      const elapsed = now - PINBALL.startTime;
      let allSlow = true;

      BUBBLE_IDS.forEach(id => {
        const b = PINBALL.bubbles[id];
        if (!b) return;

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // ---- 边界碰撞 ----
        if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx) * BOUNCE; }
        else if (b.x + S > window.innerWidth) {
          b.x = window.innerWidth - S;
          b.vx = -Math.abs(b.vx) * BOUNCE;
        }
        if (b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy) * BOUNCE; }
        else if (b.y + S > window.innerHeight) {
          b.y = window.innerHeight - S;
          b.vy = -Math.abs(b.vy) * BOUNCE;
        }

        // ---- 减速 ----
        b.vx *= FRICTION;
        b.vy *= FRICTION;

        // ---- 应用位置 ----
        b.el.style.left = b.x + 'px';
        b.el.style.top  = b.y + 'px';

        // ---- 🎵 音乐弹珠粒子尾迹 ----
        if (id === 'music' && isPlaying) {
          const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
          if (speed > 40) {
            const count = 2 + Math.floor(Math.random() * 3); // 2~4 个
            for (let i = 0; i < count; i++) {
              const p = document.createElement('div');
              p.className = 'pinball-particle';
              const size = 5 + Math.random() * 8;
              const ox = (Math.random() - 0.5) * 20;
              const oy = (Math.random() - 0.5) * 20;
              p.style.width = size + 'px';
              p.style.height = size + 'px';
              p.style.left = (b.x + S/2 + ox) + 'px';
              p.style.top = (b.y + S/2 + oy) + 'px';
              p.style.background = `rgba(0, ${200+Math.random()*55}, 255, ${0.5+Math.random()*0.5})`;
              p.style.boxShadow = `0 0 ${8+Math.random()*12}px rgba(0,255,255,0.5)`;
              p.style.animationDuration = (0.3 + Math.random() * 0.4) + 's';
              document.body.appendChild(p);
              setTimeout(() => p.remove(), 700);
            }
          }
        }
        // ---- 💻 终端弹珠粒子尾迹 ----
        if (id === 'terminal' && termConnected) {
          const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
          if (speed > 40) {
            for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
              const p = document.createElement('div');
              p.className = 'pinball-particle';
              const sz = 4 + Math.random() * 8;
              const ox = (Math.random() - 0.5) * 18;
              const oy = (Math.random() - 0.5) * 18;
              p.style.cssText = `width:${sz}px;height:${sz}px;left:${b.x+S/2+ox}px;top:${b.y+S/2+oy}px;background:rgba(0,${220+Math.random()*35|0},${80+Math.random()*60|0},${0.4+Math.random()*0.5});box-shadow:0 0 ${6+Math.random()*10|0}px rgba(0,255,100,0.4);animation-duration:${0.3+Math.random()*0.4}s`;
              document.body.appendChild(p);
              setTimeout(() => p.remove(), 700);
            }
          }
        }

        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed > PINBALL.minSpeed) allSlow = false;
      });

      if (elapsed < PINBALL.maxDuration && !allSlow) {
        PINBALL.animId = requestAnimationFrame(tick);
      } else {
        stopPinball();
      }
    }

    PINBALL.animId = requestAnimationFrame(tick);
  }

  /** 停止弹射，回正状态 */
  function stopPinball() {
    PINBALL.running = false;
    if (PINBALL.animId) {
      cancelAnimationFrame(PINBALL.animId);
      PINBALL.animId = null;
    }

    const btn = document.getElementById('pinball-btn');
    btn.classList.remove('launching');
    btn.querySelector('.pb-label').textContent = '弹珠模式';

    // 恢复气泡样式，确保位置持久化
    BUBBLE_IDS.forEach(id => {
      const el = bubbleEls[id];
      el.classList.remove('pinballing');
      saveBubblePos(id);
    });
  }

  // 绑定弹珠按钮
  document.getElementById('pinball-btn').addEventListener('click', launchPinball);

  // 窗口缩放时如果正在弹射，强行停止
  window.addEventListener('resize', () => {
    if (PINBALL.running) stopPinball();
  });
