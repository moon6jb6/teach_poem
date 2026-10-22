# 《天阙诗都·越长安——上国诗章，长安之上》对话卡片设计说明

> 任务：重新设计游戏内「对话卡片」样式，从底部半透明黑条 → **浮动绢本长卷卡 + 左侧竖排名牌 + 笺纸选项条**。
> 源文件：`run/3Dprogram_3.1.html`（CSS 改造，JS 零改动）；素材：`run/ui/dialogue/`；构建：`logs/build_run_submit.mjs`。

## 1. 设计目标

| 项目 | 旧版 | 新版 |
| --- | --- | --- |
| 对话容器 | 底部整宽 33vh 黑半透明条 | 居中偏下浮动卡片：宽 `min(1180px,86vw)`，最大高 `46vh`，底边距 `4vh`，圆角小、深投影 |
| 卡面 | rgba 黑 | 绢本/宣纸长卷图（`dlg-card-*.png`，`100% 100%`）+ 内圈鎏金细线 + 四角如意云纹（`dlg-corner.png`）+ 淡墨氛围（`dlg-ink.png`） |
| 标题 | 左下白字 | **左侧竖排名牌**：`absolute left:-30px`、`top:8%`、宽 64px、高约 55%，`writing-mode: vertical-rl`、字色 `#f7ecd2`、楷体、字距 0.2em |
| 正文 | 居中 18px 白字 | 深墨 `#2b2318`、19px、行高 1.95、首行缩进 2em、最大宽 76%、左右 24px；`white-space: pre-line` 保留诗作分行 |
| 选项 | rgba 白底圆角按钮 | 笺纸条 `dlg-btn-normal/hover/active.png`，hover 亮金边 + 微上浮 + 0.15s 过渡，active 朱红晕 |
| 输入区 | 半透明深色输入框 | 笺纸条输入框（同选项条样式），`#input-area` 仍由 JS `display:flex` 控制 |
| 遮罩 | 平铺 rgba(0,0,0,.7) | `#overlay` = 半透明黑兜底 + `dlg-vignette.png` 墨晕暗角（中心透明，仍可点击关闭） |
| 关闭按钮 | 白色 × | 朱红印章底 + 暖白 ×（`dlg-seal.png`，hover 轻微旋转放大） |
| 入场动画 | 无 | 卡片 0.28s 自下 16px 淡入 + 轻微缩放；选项 `nth-child` 40ms 依次 stagger |

**样式选型**：默认 A 款（绢本暖黄）。深墨正文 `#2b2318` 在 A/B 卡面上对比度约 10:1（远高于 4.5:1）；
C 款深绢为备选，若启用需把正文改为浅色 `#f0e5cf`（CSS 中预留注释说明）。

## 2. DOM 结构（未改动，全部 id/class 保留）

```html
<div id="overlay"></div>
<div id="popup">
  <span class="close-btn" onclick="closePopup()">×</span>
  <div id="popup-title">对话</div>
  <div id="popup-text"></div>
  <div id="options-container"></div>
  <div id="input-area"><input type="text" id="user-input" ...></div>
</div>
```

JS 依赖全部保留：`popup / popup-title / popup-text / options-container / dialogue-btn / input-area / user-input / overlay / close-btn`；
`#popup` 仍由 JS 设 `display:flex`，`#input-area` 仍由 JS 设 `display:flex`，鼠标事件绑定未改动。

## 3. 素材清单（`run/ui/dialogue/`，13 张）

| 文件 | 尺寸 | 用途 | CSS 位置 |
| --- | --- | --- | --- |
| `dlg-card-a.png` | 1344×768 | 对话卡 A 款（绢本暖黄，默认） | `#popup` 背景 |
| `dlg-card-b.png` | 1344×768 | 对话卡 B 款（宣纸冷白，备选） | 备选 |
| `dlg-card-c.png` | 1344×768 | 对话卡 C 款（深绢暗金，备选） | 备选 |
| `dlg-nameplate-a.png` | 512×1024 | 竖排名牌 A 款（朱红漆木+金边） | `#popup-title` |
| `dlg-nameplate-b.png` | 512×1024 | 竖排名牌 B 款（暗铜朱漆，备选） | 备选 |
| `dlg-btn-normal.png` | 1024×256 | 选项条常态 | `.dialogue-btn`、`#input-area` |
| `dlg-btn-hover.png` | 1024×256 | 选项条 hover（亮金边+微光） | `.dialogue-btn:hover` |
| `dlg-btn-active.png` | 1024×256 | 选项条 active（朱红晕） | `.dialogue-btn:active` |
| `dlg-seal.png` | 512×512 | 朱红印章（透明底） | `.close-btn` |
| `dlg-divider.png` | 1024×128 | 云纹分隔线（透明底，备用装饰） | 备用 |
| `dlg-vignette.png` | 1024×1024 | 墨晕暗角遮罩（中心透明） | `#overlay` 叠加 |
| `dlg-corner.png` | 512×512 | 如意云纹角花（透明底） | `#popup` 四角 |
| `dlg-ink.png` | 1024×1024 | 淡墨晕染 | `#popup::before` 氛围 |

- 素材生成方式与 prompt/seed 见 `run/ui/dialogue/manifest.json`。
- 本机曾因 CPU/内存被其它进程占满导致 SDXL 加载异常缓慢，期间先用 Pillow 程序化生成同尺寸同名兜底图（`_tools/fallback_assets.py`，备份在 `_fallback_backup/`），SDXL 恢复后同名覆盖，CSS 路径不变。

## 4. 兼容性与可访问性

- 视口覆盖：1920×1080 / 1280×720 下卡片不出视口、正文不溢出（正文区 `max-height:24vh; overflow-y:auto`，选项区 `max-height:21vh; overflow-y:auto`）。
- 对比度：正文 `#2b2318` vs A/B 卡面实测对比度见 `preview/preview-result.json`（≥10:1，目标 ≥4.5:1）。
- 可点击性：选项、输入框、关闭按钮、遮罩关闭全部保留 `pointer-events` 默认行为；装饰层（`#popup::before/::after`）均 `pointer-events:none`。
- 无 JS 逻辑改动：仅 CSS 替换（旧样式块备份 `_tools/3Dprogram_3.1.html.bak`）。

## 5. 自测

- 脚本：`run/ui/dialogue/_tools/preview.cjs`（Playwright + Chrome，D3D11 硬件加速）。
- 产物：`run/ui/dialogue/preview/`（1920×1080 与 1280×720 两套截图 + `preview-result.json` 指标）。
- 真机完整流程（进场景→右键触发对话→拍正式图）由 project-runner 统一执行。
