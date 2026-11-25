(function () {
  'use strict';

  var labData = {
    v1: {
      topbar: '页面预览 · 1.0 原型',
      title: '鲜知 FreshSense · 手机 App',
      subtitle: '顶部外置入口：NFC 结果 / 首页 / 食谱 / 补货 / 设备 / 重置演示',
      lines: [
        ['首页', '16 件食材'],
        ['临期提醒', '按天数查看'],
        ['四层分区总览', '上层 / 中层 / 下层 / 果蔬'],
        ['快速操作', '食材库 · 食谱 · 补货 · 设备']
      ],
      tabs: ['首页', '食谱', '补货', '设备'],
      active: '首页',
      kicker: '01 / 功能先上线',
      heading: '能做的事很多，但用户要自己找',
      text: '1.0 已经把冰箱屏数据、NFC 碰一碰、食谱、补货、设备连接串起来了。顶部还有一排外置预览按钮，功能地图很满；代价是首屏没有明确告诉用户「先做什么」。'
    },
    v2: {
      topbar: '鲜知 · 19 件食材 · 8 件快到期',
      title: '2.0：结构重整',
      subtitle: '请用手机内底部导航 · 碰一碰 / 重置数据',
      lines: [
        ['冰箱型号', '常规双门 · 5 分区'],
        ['切换入口', '更换 / 拍照识别 ›'],
        ['分区状态', '2 急'],
        ['临期筛选', '已过期 / 1天内 / 2天内 / 3天内']
      ],
      tabs: ['首页', '食谱', '＋添加', '补货', '我的'],
      active: '首页',
      kicker: '02 / 结构重整',
      heading: '结构对了，语言还没翻译',
      text: '2.0 把底部导航收敛成四个入口，中间加入「＋添加」，冰箱新增冷冻室，也允许按型号切换分区。用户测试发现：入口比 1.0 好找了，但「2 急」这类内部表述和新用户自然语言之间还有一道墙。'
    },
    v3: {
      topbar: '鲜知 · 19 件 · 8 临期',
      title: '3.0：行动引导',
      subtitle: '🧭 教程 · 下滑查看冰箱分区 ↓',
      lines: [
        ['首页模块', '⏰ 临期 / 🧊 分区'],
        ['冰箱型号', '切换冰箱类型 / 拍照识别'],
        ['分区状态', '2 件即将过期'],
        ['高风险食材', '⏰ 优先吃']
      ],
      tabs: ['首页', '食谱', '＋添加', '补货', '我的'],
      active: '首页',
      kicker: '03 / 行动引导',
      heading: '不只说状态，还给出下一步',
      text: '3.0 用新手教程带用户走完一遍核心流程；首页改成「临期 / 分区」模块切换；文案回到日常语言；高风险条目直接贴上「⏰ 优先吃」。信息终于从“被展示”走向“被使用”。'
    }
  };

  var labFacts = {
    v1: '原型证据　外置入口：NFC 结果 / 首页 / 食谱 / 补货 / 设备 / 重置演示',
    v2: '原型证据　顶部状态「19 件食材 · 8 件快到期」；分区标签「2 急」',
    v3: '原型证据　顶部「19 件 · 8 临期」；高风险条目「⏰ 优先吃」'
  };

  function renderLab(key) {
    var data = labData[key];
    if (!data) return;

    var topbar = document.getElementById('labScreen').querySelector('.phone-topbar');
    topbar.textContent = data.topbar;
    document.getElementById('labTitle').textContent = data.title;
    document.getElementById('labSubtitle').textContent = data.subtitle;

    var lines = document.getElementById('labLines');
    lines.textContent = '';
    data.lines.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'phone-line';
      var left = document.createElement('span');
      left.textContent = item[0];
      var right = document.createElement('b');
      right.textContent = item[1];
      row.appendChild(left);
      row.appendChild(right);
      lines.appendChild(row);
    });

    var tabbar = document.getElementById('labTabbar');
    tabbar.textContent = '';
    data.tabs.forEach(function (label) {
      var tab = document.createElement('span');
      tab.textContent = label;
      if (label === data.active) tab.className = 'active';
      tabbar.appendChild(tab);
    });

    document.getElementById('labKicker').textContent = data.kicker;
    document.getElementById('labHeading').textContent = data.heading;
    document.getElementById('labText').textContent = data.text;
    document.getElementById('labFact').textContent = labFacts[key];
  }

  var labTabs = Array.prototype.slice.call(document.querySelectorAll('.lab-tab'));
  if (document.getElementById('labScreen') && labTabs.length) {
    labTabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        labTabs.forEach(function (item) {
          item.classList.remove('active');
          item.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        renderLab(tab.dataset.lab);
      });
      tab.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        var direction = event.key === 'ArrowRight' ? 1 : -1;
        var next = labTabs[(index + direction + labTabs.length) % labTabs.length];
        next.focus();
        next.click();
      });
    });
    renderLab('v1');
  }

  var lightbox = document.getElementById('researchLightbox');
  var lightboxImage = document.getElementById('lightboxImage');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  var lastArtifactTrigger = null;

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lastArtifactTrigger) lastArtifactTrigger.focus();
    lastArtifactTrigger = null;
  }

  Array.prototype.slice.call(document.querySelectorAll('.artifact-btn, .cover-shot')).forEach(function (button) {
    button.addEventListener('click', function () {
      if (!lightbox) return;
      var image = button.querySelector('img');
      if (!image) return;
      lastArtifactTrigger = button;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = button.dataset.caption || image.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      if (lightboxClose) lightboxClose.focus();
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && lightbox && lightbox.classList.contains('open')) closeLightbox();
  });

  var progressBar = document.getElementById('progressBar');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a'));
  var ticking = false;

  function updateScrollState() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? (scrollTop / max) * 100 : 0) + '%';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });
  updateScrollState();

  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(function (item) { revealObserver.observe(item); });

    var sectionIds = ['prologue', 'problem', 'pre-research', 'ideation', 'v1', 'v2', 'research', 'v3', 'demo'];
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var target = link.getAttribute('href').slice(1);
          link.classList.toggle('active', target === entry.target.id);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  } else {
    revealItems.forEach(function (item) { item.classList.add('visible'); });
  }
})();

// ===== 演示模式：PPT 式翻页浏览 =====
(function () {
  'use strict';

  var body = document.body;
  var progressBar = document.getElementById('progressBar');
  var lightbox = document.getElementById('researchLightbox');

  // 每个板块的直接子元素 = 一页幻灯片
  var containers = Array.prototype.slice.call(
    document.querySelectorAll('.hero, section.section, section.chapter, .ending')
  );
  var slides = [];
  containers.forEach(function (container) {
    var source = container.classList.contains('chapter')
      ? (container.querySelector('.chapter-inner') || container)
      : container;
    Array.prototype.forEach.call(source.children, function (child) {
      if (child.nodeType !== 1) return;
      if (child.getAttribute && child.getAttribute('aria-hidden') === 'true') return;
      var tag = child.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK') return;
      slides.push({ el: child, container: container });
    });
  });
  if (!slides.length) return;

  // 计算放回原位的锚点（原位置之后第一个不属于幻灯片的兄弟节点）
  slides.forEach(function (s) {
    var ref = s.el.nextSibling;
    while (ref && slides.some(function (x) { return x.el === ref; })) {
      ref = ref.nextSibling;
    }
    s.anchor = ref;
    s.parent = s.el.parentNode;
  });

  var stage = null;
  var current = 0;
  var active = false;
  var wheelLock = false;
  var touchStartY = null;

  var toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'slide-toggle';
  toggleBtn.textContent = '▶ 演示模式';
  toggleBtn.addEventListener('click', function () {
    if (active) exitMode(); else enterMode();
  });
  body.appendChild(toggleBtn);

  var ui = document.createElement('div');
  ui.className = 'slide-ui';
  var prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.textContent = '‹';
  prevBtn.setAttribute('aria-label', '上一页');
  var countEl = document.createElement('span');
  countEl.className = 'slide-count';
  var nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.textContent = '›';
  nextBtn.setAttribute('aria-label', '下一页');
  prevBtn.addEventListener('click', function () { show(current - 1); });
  nextBtn.addEventListener('click', function () { show(current + 1); });
  ui.appendChild(prevBtn);
  ui.appendChild(countEl);
  ui.appendChild(nextBtn);
  body.appendChild(ui);

  var hint = document.createElement('div');
  hint.className = 'slide-hint';
  hint.textContent = '滚轮 / 方向键 / 空格 翻页 · Esc 退出';
  body.appendChild(hint);

  function buildStage() {
    stage = document.createElement('div');
    stage.className = 'slide-stage';
    slides.forEach(function (s) {
      var item = document.createElement('div');
      item.className = 'slide-item';
      // 继承容器的类名（去掉 section 布局类），保证原有样式选择器继续生效
      Array.prototype.forEach.call(s.container.classList, function (name) {
        if (name !== 'section') item.classList.add(name);
      });
      var inner = document.createElement('div');
      inner.className = 'slide-inner';
      inner.appendChild(s.el);
      item.appendChild(inner);
      stage.appendChild(item);
      s.item = item;
    });
    body.appendChild(stage);
  }

  function teardownStage() {
    slides.forEach(function (s) {
      if (s.item) s.item.classList.remove('is-active');
      if (s.anchor && s.anchor.parentNode === s.parent) s.parent.insertBefore(s.el, s.anchor);
      else s.parent.appendChild(s.el);
    });
    if (stage && stage.parentNode) stage.parentNode.removeChild(stage);
    stage = null;
    slides.forEach(function (s) { delete s.item; });
  }

  function show(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach(function (s, idx) {
      if (s.item) s.item.classList.toggle('is-active', idx === current);
    });
    countEl.textContent = (current + 1) + ' / ' + slides.length;
    if (progressBar) progressBar.style.width = ((current + 1) / slides.length * 100) + '%';
    var item = slides[current].item;
    if (item) item.scrollTop = 0;
    var containerId = slides[current].container.id;
    if (containerId) {
      Array.prototype.forEach.call(document.querySelectorAll('.site-nav a'), function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + containerId);
      });
    }
  }

  function go(delta) { show(current + delta); }

  function enterMode() {
    active = true;
    body.classList.add('presentation');
    buildStage();
    var start = 0;
    var hash = location.hash.replace('#', '');
    if (hash) {
      var target = document.getElementById(hash);
      if (target) {
        slides.some(function (s, idx) {
          if (s.container === target || s.el === target || s.el.contains(target)) {
            start = idx;
            return true;
          }
          return false;
        });
      }
    }
    show(start);
    toggleBtn.textContent = '✕ 退出演示';
  }

  function exitMode() {
    active = false;
    body.classList.remove('presentation');
    teardownStage();
    toggleBtn.textContent = '▶ 演示模式';
  }

  // 键盘翻页
  document.addEventListener('keydown', function (event) {
    if (!active) return;
    if (lightbox && lightbox.classList.contains('open')) return;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        event.preventDefault();
        go(1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'PageUp':
        event.preventDefault();
        go(-1);
        break;
      case 'Home':
        event.preventDefault();
        show(0);
        break;
      case 'End':
        event.preventDefault();
        show(slides.length - 1);
        break;
      case 'Escape':
        exitMode();
        break;
    }
  });

  // 滚轮翻页：页面内容未滚动到边缘时优先滚动内容
  document.addEventListener('wheel', function (event) {
    if (!active) return;
    var item = slides[current].item;
    if (!item) return;
    var atTop = item.scrollTop <= 1;
    var atBottom = item.scrollTop + item.clientHeight >= item.scrollHeight - 2;
    var down = event.deltaY > 0;
    if (down && !atBottom) return;
    if (!down && !atTop) return;
    event.preventDefault();
    if (wheelLock) return;
    wheelLock = true;
    window.setTimeout(function () { wheelLock = false; }, 650);
    go(down ? 1 : -1);
  }, { passive: false });

  // 触屏滑动翻页
  document.addEventListener('touchstart', function (event) {
    if (!active) return;
    touchStartY = event.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (event) {
    if (!active || touchStartY === null) return;
    var delta = touchStartY - event.changedTouches[0].clientY;
    touchStartY = null;
    if (Math.abs(delta) > 60) go(delta > 0 ? 1 : -1);
  }, { passive: true });

  // 演示模式下点击页内锚点 → 跳到对应页
  document.addEventListener('click', function (event) {
    if (!active) return;
    var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].container === target || slides[i].el === target || slides[i].el.contains(target)) {
        event.preventDefault();
        show(i);
        return;
      }
    }
  });
})();

// ===== 用户反馈：手动滚轮循环卡片（近大远小） =====
(function () {
  'use strict';

  var stage = document.getElementById('feedbackStage');
  if (!stage) return;
  var cards = Array.prototype.slice.call(stage.querySelectorAll('.feedback-card'));
  var counter = document.getElementById('feedbackCount');
  var total = cards.length;
  if (!total) return;

  var current = 0;
  var wheelLock = false;
  var touchStartY = null;

  var GAP = 18;
  var stageH = 0;
  var cardH = 0;

  function measure() {
    stageH = stage.clientHeight;
    cardH = cards.reduce(function (max, card) {
      return Math.max(max, card.offsetHeight || 0);
    }, 0) || 170;
  }

  function render() {
    if (!stageH) measure();
    // 三张卡竖向罗列：中间完整放大，上下两条缩小并稍微变浅
    var centerY = Math.max(0, (stageH - cardH) / 2);
    cards.forEach(function (card, index) {
      // 有符号的循环距离：0 = 中间，负数 = 上方，正数 = 下方
      var raw = (index - current + total) % total;
      var offset = raw <= total / 2 ? raw : raw - total;
      var y = centerY;
      var scale = 0.72;
      var opacity = 0;
      var z = 0;
      var visible = false;
      if (offset === 0) {
        scale = 1; opacity = 1; z = 3; visible = true;
      } else if (offset === -1) {
        y = centerY - GAP - cardH * 0.82;
        scale = 0.82; opacity = 0.45; z = 2; visible = true;
      } else if (offset === 1) {
        y = centerY + cardH + GAP;
        scale = 0.82; opacity = 0.45; z = 2; visible = true;
      }
      card.dataset.offset = String(offset);
      card.style.zIndex = String(z);
      card.style.transform = 'translateY(' + y.toFixed(1) + 'px) scale(' + scale + ')';
      card.style.opacity = String(opacity);
      card.style.pointerEvents = visible ? 'auto' : 'none';
      card.classList.toggle('is-active', offset === 0);
      card.setAttribute('aria-hidden', offset === 0 ? 'false' : 'true');
    });
    if (counter) {
      counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    }
  }

  function move(delta) {
    current = (current + delta + total) % total;
    render();
  }

  // 演示模式下让位给全局翻页逻辑，避免滚轮 / 按键被卡片拦截
  function inPresentation() {
    return document.body.classList.contains('presentation');
  }

  stage.addEventListener('wheel', function (event) {
    if (inPresentation() || wheelLock) return;
    event.preventDefault();
    event.stopPropagation();
    wheelLock = true;
    window.setTimeout(function () { wheelLock = false; }, 420);
    move(event.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  var prev = document.querySelector('.feedback-prev');
  var next = document.querySelector('.feedback-next');
  if (prev) prev.addEventListener('click', function () { move(-1); });
  if (next) next.addEventListener('click', function () { move(1); });

  stage.addEventListener('keydown', function (event) {
    if (inPresentation()) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      move(1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      move(-1);
    }
  });

  var dragStartY = null;
  var dragMoved = false;

  function markDragged() {
    dragMoved = true;
    window.setTimeout(function () { dragMoved = false; }, 140);
  }

  // 点击上/下两条侧卡，直接把它送到中间
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      if (dragMoved) return;
      var offset = Number(card.dataset.offset);
      if (offset === -1 || offset === 1) move(offset);
    });
  });

  stage.addEventListener('mousedown', function (event) { dragStartY = event.clientY; });
  stage.addEventListener('mouseup', function (event) {
    if (dragStartY === null || inPresentation()) return;
    var delta = dragStartY - event.clientY;
    dragStartY = null;
    if (Math.abs(delta) > 40) {
      markDragged();
      move(delta > 0 ? 1 : -1);
    }
  });
  stage.addEventListener('mouseleave', function () { dragStartY = null; });

  stage.addEventListener('touchstart', function (event) {
    if (inPresentation()) return;
    touchStartY = event.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', function (event) {
    if (inPresentation() || touchStartY === null) return;
    var delta = touchStartY - event.changedTouches[0].clientY;
    touchStartY = null;
    if (Math.abs(delta) > 40) {
      markDragged();
      move(delta > 0 ? 1 : -1);
    }
  }, { passive: true });

  window.addEventListener('resize', function () { measure(); render(); });
  window.addEventListener('load', function () { measure(); render(); });

  render();
})();

// ===== 演示录屏：进入视口自动播放，离开暂停；减少动态效果时不自动播放 =====
(function () {
  'use strict';
  var videos = document.querySelectorAll('.demo-video');
  if (!videos.length) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    videos.forEach(function (v) {
      v.removeAttribute('autoplay');
      v.removeAttribute('loop');
      v.pause();
    });
    return;
  }

  if (!('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var p = entry.target.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.25 });
  videos.forEach(function (v) { observer.observe(v); });
})();
