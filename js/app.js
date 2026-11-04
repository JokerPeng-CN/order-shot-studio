(() => {
  'use strict';

  const IMAGE_ASSETS = window.IMAGE_ASSETS || {};
  const DEFAULT_PRODUCT = IMAGE_ASSETS.product || 'assets/product-default.jpg';

  const DEFAULTS = {
    storeBranch: '阳光在线广场店',
    address: '',
    order: '2302 3699 2427 7879 157',
    image: DEFAULT_PRODUCT
  };

  const STORE_BRANDS = [
    '阳光在线广场店',
    '万象城二店',
    '科技园店',
    '中心广场店',
    '万达广场店',
    '恒隆广场店',
    '滨江天街店',
    '解放路店',
    '大学城店',
    '国贸商城店',
    '金融中心店',
    '软件园店'
  ];

  const ADDRESS_LINES = [
    '万象城A座(一楼大堂外卖柜)',
    '阳光花园3号楼(便利店旁外卖架)',
    '科技园总部(南门保安亭)',
    '滨江天街5幢(快递柜旁)',
    '幸福里8号楼(西门外卖架)',
    '大学城公寓4区(宿管室外卖架)',
    '金融中心B座(负一层取餐点)',
    '翡翠湾12栋(北门门卫室)',
    '中央公园壹号(三单元门口)',
    '青年公寓(一楼共享大厅)'
  ];

  const SURNAMES = ['陈', '林', '周', '苏', '江', '顾', '许', '沈', '陆', '王', '李', '张', '宋', '叶'];
  const TITLES = ['先生', '女士'];

  const $ = (id) => document.getElementById(id);
  const capture = $('capture');
  const phone = $('phone');
  const phoneViewport = document.querySelector('.phone-viewport');
  const stageCanvas = $('stageCanvas');
  const scaleReadout = $('scaleReadout');

  const inputs = {
    store: $('in-store'),
    address: $('in-address'),
    order: $('in-order'),
    time: $('in-time')
  };
  const views = {
    store: $('vStore'),
    address: $('vAddress'),
    order: $('vOrder'),
    time: $('vTime'),
    product: $('vProduct')
  };

  const uploader = $('uploader');
  const fileInput = $('fileInput');
  const uploadPreview = $('uploadPreview');
  const resetImageBtn = $('resetImageBtn');
  const exportBtn = $('exportBtn');
  const toast = $('toast');
  const outSize = $('outSize');

  let toastTimer = 0;
  let fitTimer = 0;

  function hydrateAssetImages() {
    document.querySelectorAll('img[data-asset]').forEach((img) => {
      const src = IMAGE_ASSETS[img.dataset.asset];
      if (src) img.src = src;
    });
  }

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[rand(0, arr.length - 1)];
  const pad = (n, len = 2) => String(n).padStart(len, '0');

  function randomOrder() {
    return [
      String(rand(2000, 8999)),
      String(rand(1000, 9999)),
      String(rand(1000, 9999)),
      String(rand(1000, 9999)),
      String(rand(100, 999))
    ].join(' ');
  }

  function formatDateTime(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function currentDateTimeString() {
    return formatDateTime(new Date());
  }

  function buildStore(raw) {
    let branch = String(raw || '').replace(/[()（）]/g, '').trim();
    branch = branch.replace(/^瑞幸咖啡\s*/, '').trim();
    return branch ? `瑞幸咖啡(${branch})` : '瑞幸咖啡';
  }

  // 随机时保留当前输入里的年月日，只重掷时分秒。
  function randomTimeKeepingDate(currentValue) {
    const now = new Date();
    const match = String(currentValue || '').match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let dateText = `${year}-${pad(month)}-${pad(day)}`;

    if (match) {
      year = Number(match[1]);
      month = Number(match[2]);
      day = Number(match[3]);
      dateText = `${pad(year, 4)}-${pad(month)}-${pad(day)}`;
    }

    let secondsInDay;
    if (year === now.getFullYear() && month === now.getMonth() + 1 && day === now.getDate()) {
      const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const earliest = nowSeconds >= 8 * 3600 ? 8 * 3600 : 0;
      secondsInDay = rand(earliest, nowSeconds);
    } else {
      secondsInDay = rand(8 * 3600, 23 * 3600 + 59 * 60 + 59);
    }

    const hours = Math.floor(secondsInDay / 3600);
    const minutes = Math.floor((secondsInDay % 3600) / 60);
    const seconds = secondsInDay % 60;
    return `${dateText} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function randomAddress() {
    const surname = pick(SURNAMES);
    const title = pick(TITLES);
    const phoneNo = `1${rand(3, 9)}${rand(0, 9)}****${rand(1000, 9999)}`;
    return `${pick(ADDRESS_LINES)}\n${surname}**(${title}) ${phoneNo}`;
  }

  function applyValue(key, raw) {
    inputs[key].value = raw;
    views[key].textContent = raw;
  }

  function syncAll() {
    views.store.textContent = buildStore(inputs.store.value);
    applyValue('address', inputs.address.value.replace(/\r\n/g, '\n'));
    applyValue('order', inputs.order.value);
    applyValue('time', inputs.time.value);
    scheduleFit();
  }

  function randomizeAll() {
    inputs.store.value = pick(STORE_BRANDS);
    inputs.address.value = randomAddress();
    inputs.order.value = randomOrder();
    inputs.time.value = randomTimeKeepingDate(inputs.time.value);
    syncAll();
    showToast('已生成一组随机订单信息');
  }

  function resetAll() {
    inputs.store.value = DEFAULTS.storeBranch;
    inputs.address.value = DEFAULTS.address;
    inputs.order.value = DEFAULTS.order;
    inputs.time.value = currentDateTimeString();
    setDefaultImage();
    syncAll();
    showToast('已恢复初始状态');
  }

  function setDefaultImage() {
    views.product.src = DEFAULTS.image;
    uploadPreview.src = DEFAULTS.image;
    resetImageBtn.hidden = true;
  }

  function setProductImage(dataUrl) {
    views.product.src = dataUrl;
    uploadPreview.src = dataUrl;
    resetImageBtn.hidden = false;
    scheduleFit();
  }

  function readImage(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      showToast('图片超过 12MB，请压缩后再上传');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProductImage(String(reader.result));
      showToast('商品图片已更新');
    };
    reader.onerror = () => showToast('图片读取失败');
    reader.readAsDataURL(file);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function scheduleFit() {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitPreview, 80);
  }

  function fitPreview() {
    const stageStyles = getComputedStyle(stageCanvas);
    const padX = parseFloat(stageStyles.paddingLeft) + parseFloat(stageStyles.paddingRight);
    const padY = parseFloat(stageStyles.paddingTop) + parseFloat(stageStyles.paddingBottom);
    const availableW = Math.max(120, stageCanvas.clientWidth - padX);
    const availableH = Math.max(180, stageCanvas.clientHeight - padY);
    const shotHeight = capture.scrollHeight;
    const shellWidth = 1096;
    const shellHeight = shotHeight + 16;
    const stacked = window.matchMedia('(max-width: 980px)').matches;
    const scale = stacked
      ? Math.max(0.1, Math.min(availableW / shellWidth, 0.36))
      : Math.max(0.1, Math.min(availableW / shellWidth, availableH / shellHeight, 0.52));
    phone.style.transform = `scale(${scale})`;
    phoneViewport.style.height = `${shellHeight * scale}px`;
    scaleReadout.textContent = `${Math.round(scale * 100)}%`;
    if (outSize) outSize.textContent = `1080 × ${shotHeight} px`;
  }

  async function exportImage() {
    if (exportBtn.disabled) return;
    const label = exportBtn.querySelector('.btn-label');
    const originalHTML = label.innerHTML;
    exportBtn.disabled = true;
    label.innerHTML = '<span class="spinner" aria-hidden="true"></span>正在生成 PNG…';
    let host = null;

    try {
      await document.fonts.ready;
      if (typeof html2canvas !== 'function') throw new Error('renderer missing');

      host = document.createElement('div');
      host.setAttribute('aria-hidden', 'true');
      host.style.cssText = 'position:fixed;left:-20000px;top:0;width:1080px;background:#fff;z-index:-1;';
      const clone = capture.cloneNode(true);
      clone.removeAttribute('id');
      host.appendChild(clone);
      document.body.appendChild(host);

      const height = clone.scrollHeight;
      const canvas = await html2canvas(clone, {
        width: 1080,
        height,
        scale: 1,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
        logging: false,
        windowWidth: 1080,
        windowHeight: height
      });

      if (!canvas || !canvas.width || !canvas.height) throw new Error('empty canvas');
      const dataUrl = canvas.toDataURL('image/png');
      const stamp = (inputs.time.value.replace(/[^0-9]/g, '').slice(0, 14) || String(Date.now()));
      const link = document.createElement('a');
      link.download = `订单截图_${stamp}.png`;
      link.href = dataUrl;
      link.click();
      showToast(`已导出 PNG · ${canvas.width} × ${canvas.height}`);
    } catch (err) {
      console.error(err);
      showToast('导出失败，请刷新页面后重试');
    } finally {
      if (host) host.remove();
      exportBtn.disabled = false;
      label.innerHTML = originalHTML;
      scheduleFit();
    }
  }

  Object.values(inputs).forEach((el) => {
    el.addEventListener('input', syncAll);
  });

  $('randomBtn').addEventListener('click', randomizeAll);
  $('randomOrderBtn').addEventListener('click', () => {
    inputs.order.value = randomOrder();
    syncAll();
    showToast('订单号已重新生成');
  });
  $('resetBtn').addEventListener('click', resetAll);
  exportBtn.addEventListener('click', exportImage);
  resetImageBtn.addEventListener('click', () => {
    setDefaultImage();
    showToast('已恢复默认商品图');
  });

  uploader.addEventListener('click', () => fileInput.click());
  uploader.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener('change', () => {
    readImage(fileInput.files && fileInput.files[0]);
    fileInput.value = '';
  });

  ['dragenter', 'dragover'].forEach((type) => {
    uploader.addEventListener(type, (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploader.classList.add('is-dragging');
    });
  });
  ['dragleave', 'drop'].forEach((type) => {
    uploader.addEventListener(type, (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploader.classList.remove('is-dragging');
    });
  });
  uploader.addEventListener('drop', (e) => {
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    readImage(file);
  });

  window.addEventListener('resize', scheduleFit);
  if (window.ResizeObserver) {
    new ResizeObserver(scheduleFit).observe(stageCanvas);
  }
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      exportImage();
    }
  });

  // Initialise with the exact reference values.
  hydrateAssetImages();
  inputs.store.value = DEFAULTS.storeBranch;
  inputs.address.value = DEFAULTS.address;
  inputs.order.value = DEFAULTS.order;
  inputs.time.value = currentDateTimeString();
  setDefaultImage();
  syncAll();

  document.fonts.ready.then(() => {
    fitPreview();
    setTimeout(fitPreview, 140);
  });
  window.addEventListener('load', () => {
    fitPreview();
    setTimeout(fitPreview, 180);
  });
})();
