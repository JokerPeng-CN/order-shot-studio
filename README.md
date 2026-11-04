# 订单截图工坊 · Order Shot Studio

一个完全离线的静态网页：复刻所给订单详情截图，在网页里修改订单信息、替换商品图、一键导出 PNG。

## 直接使用

**双击 `index.html` 即可。** 不需要服务器、不需要联网。

推荐使用最新版 Chrome / Edge。首次打开时字体与图片均从本地加载，导出后会自动下载：

```
订单截图_YYYYMMDD_HHmmss.png
```

也可以按 `Ctrl + Enter`（Mac 为 `Cmd + Enter`）直接导出。

## 可编辑内容

| 区域 | 说明 |
| --- | --- |
| 门店信息 | 品牌固定为“瑞幸咖啡”，只能修改括号内的门店名 |
| 配送地址 | 默认留空；第一行为地点，第二行为收货人 / 电话，支持换行 |
| 订单号码 | 输入连续数字，无需手动空格；截图会自动按 4 位分组显示 |
| 下单时间 | 打开页面时默认为当前时间；可手动修改日期与时间 |
| 合计金额 | 固定为原图裁切的「合计 ¥26.9」，不支持修改，也不参与随机 |
| 商品图片 | 默认使用您提供的第二张商品图；可拖入或点击替换（JPG / PNG / WebP） |

- “随机生成”会替换门店分店名、地址、订单号和时间；**年月日保持不变，只随机时分秒**，金额不会改变。订单号右侧的小按钮可单独重掷。
- “恢复初始状态”会清空配送地址、把门店/订单号恢复为示例值，并把下单时间重置为当前时间；金额始终保持原图金额。
- 所有数据只在浏览器内处理，不会上传到任何服务器。
- 地址超过两行时，截图画布会自动增高，避免文字被裁掉；一至两行时始终导出 1080 × 2400。
- 导出的图片只包含手机截图本身，不包含网页的预览外框。

## 关于 1:1 还原

- 顶部状态栏 / “订单已完成”标题栏、底部广告横幅与手势条，直接取自原始截图的同尺寸局部，并内嵌为 base64，因此这部分逐像素一致。
- 两张信息卡片使用 **HarmonyOS Sans SC**（与原图字体一致）按 1080px 原图尺寸重新排版，字号、行距、颜色、圆角、间距均以截图逐项校准；合计金额不再用字体渲染，直接从原图裁切为静态 PNG 叠加，保证与截图一致且不可编辑。
- “期望时间、餐具数量、配送服务、支付方式、收藏、复制、费用明细”等未要求编辑的内容保持固定。
- 商品缩略图按需求默认展示您提供的第二张商品图。原始截图中的缩略图是该图更紧的局部裁切；若希望完全贴近截图，可在替换 `assets/product-default.jpg` 后运行素材内嵌脚本。
- 字体仅保留本工具所需字符集，导出时会使用浏览器本地已加载的同一字体。

## 文件结构

```
index.html                 页面与截图结构
css/app.css                工具界面 + 1080px 截图复刻样式
js/app.js                  编辑同步、随机数据、预览缩放、导出
js/assets-data.js          内嵌的截图头部 / 底部 / 默认商品图（Base64）
js/vendor/html2canvas.min.js  导出用的 DOM → Canvas 渲染库（MIT）
assets/
  chrome-top.png           原始截图顶部（状态栏 + 标题栏）
  chrome-bottom.png        原始截图底部（广告 + 手势条）
  product-default.jpg      默认商品图（用户提供的第二张图片）
  amount-total.png         从原图裁切的「合计 ¥26.9」（固定、不可编辑）
  fonts/                   HarmonyOS Sans SC 裁剪字体（Regular / Bold）
  favicon.svg
tools/embed-assets.py      重新生成 js/assets-data.js 的开发脚本
```

## 修改静态素材（可选）

若替换了 `assets/chrome-top.png`、`assets/chrome-bottom.png`、`assets/product-default.jpg` 或 `assets/amount-total.png`，运行：

```bash
python tools/embed-assets.py
```

它会重新生成 `js/assets-data.js`，保证在 `file://` 直接打开时导出也不会因为本地图片污染 Canvas 而失败。

## 部署到 GitHub Pages

这是一个纯静态站点，不需要构建，`index.html` 必须位于仓库根目录。

### 方式一：GitHub 网页上传（最简单）

1. 在 GitHub 新建一个 **Public** 仓库，例如 `order-shot-studio`（仓库名建议使用英文）。
2. 进入仓库 → **Add file → Upload files**，上传本目录中的：
   `index.html`、`README.md`、`.gitignore`、`.nojekyll`、`css/`、`js/`、`assets/`、`tools/`。
   请保持目录层级不变，不要上传 `.trae-html-share-packages/`、`.screenshots/` 等本地隐藏目录。
3. 进入仓库 **Settings → Pages**：
   - Source 选择 **Deploy from a branch**
   - Branch 选择 **main**，目录选择 **/ (root)**
   - 点击 **Save**
4. 等待 1–2 分钟，访问：
   `https://<你的GitHub用户名>.github.io/<仓库名>/`

   例如仓库名为 `order-shot-studio`：
   `https://jokerpeng-cn.github.io/order-shot-studio/`

### 方式二：本地 Git 推送

在项目目录执行（把仓库地址替换成你自己的）：

```bash
git init -b main
git add .
git commit -m "feat: order shot studio"
git remote add origin https://github.com/<用户名>/<仓库名>.git
git push -u origin main
```

如果使用 GitHub CLI 且已登录，也可以直接创建仓库并推送：

```bash
gh repo create order-shot-studio --public --source=. --remote=origin --push
```

推送完成后，同样在 **Settings → Pages** 中选择 `main` / `/ (root)` 并保存。

> 提示：免费版 GitHub Pages 通常要求仓库为 Public；如果必须私有，可以选择 Cloudflare Pages 或 Netlify 等静态托管。Pages 生效后首次访问可能需要等待片刻，且导出 PNG 不需要任何后端服务。

## 许可与素材

- HarmonyOS Sans SC 字体：版权归华为，使用条款见 `assets/fonts/LICENSE.txt`。
- [html2canvas](https://html2canvas.hertzen.com/)：MIT License，许可信息保留在 `js/vendor/html2canvas.min.js` 文件头。
- 页面中的订单截图版式与用户提供的两张图片仅用于本工具演示。
