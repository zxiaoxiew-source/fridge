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
      lightboxImage.src = image.src;
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

    var sectionIds = ['prologue', 'problem', 'pre-research', 'ideation', 'v1', 'v2', 'research', 'v3', 'demo', 'method', 'future', 'summary'];
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
