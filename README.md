# 订单截图工坊 · Order Shot Studio

**v1.0.0 · 归档版**　|　[在线访问](https://jokerpeng-cn.github.io/order-shot-studio/)　|　[GitHub 仓库](https://github.com/JokerPeng-CN/order-shot-studio)　|　[版本发布](https://github.com/JokerPeng-CN/order-shot-studio/releases/tag/v1.0.0)

一个完全离线的静态网页：复刻指定订单详情截图，在页面内修改门店、地址、订单号、下单时间和商品图，一键导出 1080 × 2400 PNG。

---

## 目录

- [项目简介](#项目简介)
- [功能](#功能)
- [快速开始](#快速开始)
- [字段与规则](#字段与规则)
- [导出说明](#导出说明)
- [1:1 还原说明](#11-还原说明)
- [移动端](#移动端)
- [目录结构](#目录结构)
- [部署与更新](#部署与更新)
- [维护与替换素材](#维护与替换素材)
- [常见问题](#常见问题)
- [隐私与安全](#隐私与安全)
- [已知限制](#已知限制)
- [版本与归档](#版本与归档)
- [许可与声明](#许可与声明)

## 项目简介

- 纯静态 HTML / CSS / JavaScript，无构建步骤、无后端、无数据库。
- 可直接双击 `index.html` 离线使用，也可托管在 GitHub Pages。
- 当前线上地址：<https://jokerpeng-cn.github.io/order-shot-studio/>

## 功能

- **订单信息编辑**：门店分店名、配送地址、订单号码、下单时间。
- **固定内容**：门店品牌固定为“瑞幸咖啡”；合计金额固定为原图裁切的「合计 ¥26.9」。
- **商品图片**：默认使用提供的第二张商品图；支持点击选择或拖入 JPG / PNG / WebP，限 12MB。
- **随机生成**：一键随机门店分店名、地址、订单号和下单时间；金额不参与随机。
  - 点击随机时保留当前年月日，只改变时分秒。
  - 若日期为今天，随机时间不会超过当前时刻。
- **实时预览**：左侧修改，右侧手机预览自动缩放适配。
- **一键导出**：生成 1080 × 2400 PNG，自动下载为 `订单截图_YYYYMMDD_HHmmss.png`。
- **快捷导出**：`Ctrl + Enter`（macOS 为 `Cmd + Enter`）。
- **移动端适配**：手机 / 平板自动切换布局，输入字号 16px 避免 iOS 聚焦缩放。
- **完全本地处理**：图片、文字、导出都在浏览器内完成，不上传到任何服务器。

## 快速开始

### 方式一（最简单）

双击项目根目录的 `index.html`，推荐使用最新版 Chrome / Edge。

### 方式二（本地服务器）

```powershell
cd 'e:\project\订单模拟'
python -m http.server 8123
```

浏览器打开 <http://127.0.0.1:8123/>。

### 线上访问

<https://jokerpeng-cn.github.io/order-shot-studio/>

## 字段与规则

| 字段 | 规则 |
| --- | --- |
| 门店信息 | “瑞幸咖啡”品牌固定不可改，只能填写括号内分店名，最多 16 个字符 |
| 配送地址 | 默认留空；第一行为地点，第二行为收货人和电话；支持换行 |
| 订单号码 | 输入连续数字，自动去除空格和字母等非数字字符，最多 24 位；图片中自动每 4 位分组显示 |
| 下单时间 | 打开页面时默认为当前时间；可直接修改年月日与时间 |
| 合计金额 | 固定图片 `assets/amount-total.png`，不可编辑、不参与随机 |
| 商品图片 | 默认第二张商品图；自定义图片会按方形裁切（object-fit: cover）展示 |

### 随机与重置

- **随机生成**：替换门店分店名、地址、订单号和时间；金额保持不变；日期不变，仅随机时分秒。
- **订单号重掷**：点击订单号右侧的小按钮，只生成新订单号。
- **恢复初始状态**：清空地址，门店恢复“阳光在线广场店”，订单号恢复示例值，时间重置为当前时间，商品图恢复默认图。

### 示例

输入：

```
2302369924277879157
```

截图中的显示：

```
2302 3699 2427 7879 157
```

## 导出说明

- 默认导出尺寸：**1080 × 2400 px PNG**。
- 导出的图片只包含手机截图本身，不包含网页的编辑面板、预览边框与阴影。
- 配送地址一至两行时导出尺寸固定；超过两行时画布会自动增高（例如三行地址为 1080 × 2461），防止文字被裁切。
- 导出使用 `html2canvas`，在 `file://` 离线打开时也能正常工作；图片均以内嵌 Base64 提供，不会污染 Canvas。
- 文件名取自“下单时间”，若时间无法提取数字则使用当前时间戳。

## 1:1 还原说明

- 顶部状态栏 / “订单已完成”标题栏、底部广告横幅和手势条：直接取自原始截图的同尺寸局部，逐像素一致。
- 两张信息卡片使用 **HarmonyOS Sans SC** 按 1080px 原图重新排版，字号、行距、颜色、圆角、间距逐项校准。
- 合计金额：直接从原图裁切为静态 PNG，叠加回原坐标系（实测 `x 820–1020 / y 1675–1716`），不再由字体渲染，保证和截图样式一致且不可修改。
- 商品缩略图：按需求完整展示第二张商品图；原截图中的缩略图是同一张图更紧的局部裁切，因此这一小块和原截图有轻微差异。
- 字体为 GB2312 / 常用汉字子集；极少数生僻字可能回退到系统字体。
- “期望时间、餐具数量、配送服务、支付方式、收藏、复制、费用明细”等未要求编辑的内容均保持固定。

## 移动端

- 已在 390px、320px、768px 宽度验证，无横向滚动。
- 小屏时预览位于上方，编辑表单在下方。
- 输入框使用 16px 字号，避免 iOS 聚焦时自动放大页面。
- 导出按钮、随机按钮、恢复按钮均扩大点击区域。

## 目录结构

```
index.html                       页面结构 + 截图复刻结构
css/app.css                      编辑界面与 1080px 截图样式
js/app.js                        数据同步、随机、预览缩放、导出
js/assets-data.js                内嵌的头部/底部/商品图/金额图（Base64）
js/vendor/html2canvas.min.js     导出渲染库（MIT）
assets/
  chrome-top.png                 原图顶部（状态栏 + 标题栏）
  chrome-bottom.png              原图底部（广告 + 手势条）
  product-default.jpg            默认商品图（用户提供的第二张图片）
  amount-total.png               原图裁切的固定金额「合计 ¥26.9」
  fonts/HarmonyOS-Sans-SC-*.woff2
  fonts/LICENSE.txt              鸿蒙字体许可
  favicon.svg
tools/embed-assets.py            重新生成 js/assets-data.js 的开发脚本
README.md
CHANGELOG.md
.nojekyll                        GitHub Pages 静态站点标记
.gitignore
```

## 部署与更新

站点已经部署在 GitHub Pages：

- 仓库：<https://github.com/JokerPeng-CN/order-shot-studio>
- 页面：<https://jokerpeng-cn.github.io/order-shot-studio/>
- Pages 配置：`main` 分支 / `/ (root)` / Deploy from a branch
- HTTPS 已启用

### 更新网站

修改本地文件后：

```powershell
cd 'e:\project\订单模拟'
git add .
git commit -m "更新说明"
git push
```

推送后 Pages 通常 1–2 分钟自动重新构建。线上未更新时可查看仓库 Settings → Pages 的部署状态，或等待 CDN 缓存刷新。

### 从零部署到其他账号

1. 新建 Public 仓库，上传 `index.html`、`css/`、`js/`、`assets/`、`tools/` 及说明文件。
2. Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` → Save。
3. 等待构建，访问 `https://<用户名>.github.io/<仓库名>/`。

> GitHub 免费版 Pages 通常要求仓库为 Public；私有仓库可考虑 Cloudflare Pages 或 Netlify。

## 维护与替换素材

### 替换静态图片后重新内嵌

当替换了以下任一文件：

- `assets/chrome-top.png`
- `assets/chrome-bottom.png`
- `assets/product-default.jpg`
- `assets/amount-total.png`

执行：

```bash
python tools/embed-assets.py
```

该脚本会把四张图片重新生成为 Base64，写入 `js/assets-data.js`，确保离线导出正常。

### 修改固定金额

金额是原图裁切，不是文本：

1. 用新的金额区域替换 `assets/amount-total.png`（保持原图比例与像素位置）。
2. 调整 `css/app.css` 中 `.shot .amount-img` 的定位和尺寸（如金额区域位置变化）。
3. 同步更新编辑面板固定金额文字中的 `¥ 26.9`。
4. 运行 `python tools/embed-assets.py`。
5. 刷新页面确认预览与导出。

### 字体

字体文件是 HarmonyOS Sans SC 的裁剪版本，仅用于本工具展示。许可与使用条款见 `assets/fonts/LICENSE.txt`。

## 常见问题

**Q：双击打开后字体不对 / 很粗糙？**  
确认 `assets/fonts/` 下的 woff2 文件存在。Chrome / Edge 对本地字体支持最好。

**Q：导出按钮没反应或失败？**  
先刷新页面；确认使用最新版 Chrome / Edge。若通过 `file://` 打开且浏览器限制本地资源，可改用本地服务器或线上地址。

**Q：页面里的金额能改吗？**  
不能。金额固定取自原图，不支持编辑、重置或随机；如需更换请参考[维护与替换素材](#维护与替换素材)。

**Q：订单号为什么输入空格会被吃掉？**  
输入框只接受连续数字；截图会自动每 4 位分组显示。粘贴带空格或字母的内容会自动清理。

**Q：为什么地址输入三行后导出高度变高了？**  
这是为了避免地址被裁切；一至两行时保持 1080 × 2400。

**Q：GitHub Pages 访问 404？**  
等待构建完成；确认 Pages 来源是 `main` / `(root)`；确认 `index.html` 在仓库根目录。

## 隐私与安全

- 无分析脚本、无追踪、无远程 API 请求。
- 上传的商品图、填写的文字和导出的图片只存在于当前浏览器内存中。
- 导出时使用内嵌 Base64 图片，不需要将文件上传到服务器。
- 线上托管仅由 GitHub Pages 提供静态文件访问。
- 本项目用于界面演示与个人用途，请勿用于欺诈、伪造交易或违反平台规则的场景。

## 已知限制

- 合计金额固定为原图金额（¥26.9），不支持动态金额。
- 状态栏时间、标题栏、广告横幅和手势条为截图静态部分，不随订单变化。
- 商品缩略图完整展示第二张图，与原截图中更紧的裁切不完全一致。
- 配送地址超过两行会改变导出总高度，不再固定为 2400px。
- 字体子集不包含所有生僻字，特殊字符可能使用系统字体回退。
- 主要验证环境为 Chrome / Edge；其他浏览器可能存在像素级差异。

## 版本与归档

- 当前版本：**v1.0.0**
- 发布日期：**2026-11-04**
- Git 标签：`v1.0.0`
- 详细变更：[CHANGELOG.md](./CHANGELOG.md)
- 线上版本：<https://jokerpeng-cn.github.io/order-shot-studio/>
- GitHub Release：<https://github.com/JokerPeng-CN/order-shot-studio/releases/tag/v1.0.0>

v1.0.0 为归档版本，功能冻结；后续如需修改，建议从该标签创建分支或发布新的版本号。

## 许可与声明

- **HarmonyOS Sans SC**：版权归华为所有，使用条款见 [`assets/fonts/LICENSE.txt`](./assets/fonts/LICENSE.txt)。
- **html2canvas**：MIT License，许可信息保留在 `js/vendor/html2canvas.min.js` 文件头；项目主页 <https://html2canvas.hertzen.com/>。
- 页面中的订单版式与用户提供的截图/商品图片仅用于本项目演示；相关商标与内容权利归原权利人所有。
- 使用本项目即表示你自行承担使用责任，并遵守所在地法律法规及平台规则。
