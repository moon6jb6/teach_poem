# 《天阙诗都·越长安》场景贴图 / 首页背景设计说明

> 任务：用本地 SDXL-Lightning 重做「地砖 / 天空穹顶 / 首页视频」并补充新纹理。
> 产出目录：`run/3dmod_and_pic/pic/textures/`（图片 + manifest + preview）与 `run/3dmod_and_pic/pic/vd/selector-bg.mp4`。
> **不修改 `book.js` / `3Dprogram_3.1.html`**（集成由 project-runner 执行）；**旧素材全部保留**可回退。

## 1. 替换对照表（旧 → 新）

| 旧素材 | 旧规格/用途 | 新素材 | 新规格 | 集成建议 |
| --- | --- | --- | --- | --- |
| `pic/grey_zhuankuai.jpg` | 1078×1048 碎石墙，`book.js` 两处地面网格 `repeat(50,50)`（~L53 / ~L686） | `pic/textures/ground-court-01.jpg`（场景 one 朱雀大街）<br>`pic/textures/ground-stone-01.jpg`（场景 two 城西） | 1024×1024，可平铺 | 仅替换两处纹理 URL；`repeat(50,50)` 可保留（新图每贴图约 8×8 块方砖，匹配现有尺度），微调推荐 40—60 |
| `pic/t1.jpg` | 2725×1538 城门插画，两处巨型半球（r=150/1500）天空穹顶（~L90 / ~L723） | `pic/textures/sky-dusk-01.jpg`（场景 one）<br>`pic/textures/sky-night-01.jpg`（场景 two） | 2048×1024（2:1 全景） | 仅替换 URL；贴图**底边对齐地平线**；横向环绕接缝已做过渡；若半球 UV 需要可设 `wrapS=RepeatWrapping`、`rotation.y` 微调 |
| `pic/vd/main.mp4` | 1080×2400 竖版动画夜景，`#selector-bg-video` 首页背景 | `pic/vd/selector-bg.mp4` | 1920×1080 / 约 25s / H.264 / 静音 / ≤8MB | 替换 `<source src=…>`；容器样式建议 `object-fit: cover`（旧视频为竖版，新视频为横版 16:9） |

## 2. 素材清单

| 文件 | 尺寸 | 类型 | 用途 |
| --- | --- | --- | --- |
| `ground-court-01.jpg` | 1024×1024 | 可平铺 | 朱雀大街御道青石方砖（浅灰青、细缝、微磨痕、均匀俯视光） |
| `ground-stone-01.jpg` | 1024×1024 | 可平铺 | 城西坊间石板 + 夯土混铺（灰褐、青苔缝隙） |
| `sky-dusk-01.jpg` | 2048×1024 | 全景（横向环绕） | 盛唐暮色天空：晚霞暖金、云海、远山与城郭（塔/城楼）剪影、飞鸟、低地平线 |
| `sky-night-01.jpg` | 2048×1024 | 全景（横向环绕） | 城西暮夜：冷青蓝、薄云、星月初升、远山剪影 |
| `selector-bg-01.jpg` | 1920×1080 | 背景图 | 首页 A：长安宫阙夜景灯笼 |
| `selector-bg-02.jpg` | 1920×1080 | 背景图 | 首页 B：朱雀大街暮色灯笼 |
| `selector-bg-03.jpg` | 1920×1080 | 背景图 | 首页 C：城西槐院 / 远山晨雾 |
| `selector-bg.mp4` | 1920×1080 | 视频（静音循环） | 首页场景选择背景：A→B→C→A 缓慢推拉 + 1s 交叉淡化 |
| `cloud-layer-01.png` | 1024×512 | RGBA 透明云层 | 额外：可作为 THREE/CSS 叠加氛围层（screen/additive），非替换件 |
| `water-01.jpg` | 1024×1024 | 可平铺 | 额外：水面涟漪，备用（若后续加水景） |

## 3. 首页视频参数

- 分辨率/帧率：1920×1080 / 24fps；编码 H.264（libx264，`-crf 27 -maxrate 3M`，`+faststart`）；**无音轨**。
- 时长：由 4 段（A→B→C→A）各 7s + 3 次 1s xfade 合成，**实测 25.0s**；首尾均落在 A 图推近段，`loop` 播放衔接自然。
- 体积：**实测 2.62MB（≤8MB）**，平均码率约 878kbps。
- 运动：A 缓慢推近、B 横向平移、C 缓慢拉远、末段 A 轻微漂浮。
- 重新生成：`node run/3dmod_and_pic/pic/textures/_tools/build_selector_video.cjs`（依赖 WinGet 安装的 ffmpeg 8.1）。
- 截图预览：`run/3dmod_and_pic/pic/textures/preview/video-frame-1..3.jpg`。

## 4. 生成与后处理说明

- 模型：SDXL base fp16 + SDXL-Lightning 4-step LoRA；4 步、CFG=1.0、EulerDiscreteScheduler(trailing)、`enable_model_cpu_offload`（8GB 显存安全）。
- Prompt 全部 ≤75 CLIP token（SDXL 文本编码器上限 77；CFG=1.0 时 negative prompt 不生效，约束全部写入正向 prompt）。完整 prompt / seed / 耗时见 `manifest.json`。
- 平铺处理（地面/水面）：1024² 生成 → **四边环绕融合**（左右边带向对边平均值平滑过渡、上下同法）→ 1024² 可平铺。相比 2×2 镜像拼贴，避免了明显的镜像对称「万花筒」纹；`preview/tiling-*.jpg` 为 2×2 平铺目检图（原始分辨率，避免缩略摩尔纹误判）。
- 天空处理（`_tools/fix_sky.py`，可从 `_raw` 幂等重跑）：1024×512 生成 → **横向环绕接缝渐变** → 放大 2048×1024 → **裁掉生成图下方的水面倒影**，只保留天空 + 横向压缩/压暗/虚化的远山与塔楼剪影带（底部 120px 渐隐合成，无硬接缝），保证穹顶贴图「天空为主、剪影贴地平线」。
- 首页背景：1344×768 生成 → Lanczos 放大到 1920×1080。其中 `selector-bg-02` 生成结果带有 2 个远景行人剪影，已用 OpenCV TELEA inpainting 移除（原处有极轻微修补痕迹，1920 背景 + 视频运动中不可见）。
- 目检：`preview/contact-sheet.jpg`（全部素材总览 + 视频抽帧）；逐张已检查无文字/无正脸人物/无现代物/无明显接缝。`selector-bg-02` 墙面招幌保留少量装饰性墨迹纹样（非可读正文），如需绝对无字可改用 `selector-bg-01` 作为 B 段。

## 5. 回退说明

- 旧素材 **未删除**：`pic/grey_zhuankuai.jpg`、`pic/t1.jpg`、`pic/vd/main.mp4` 均仍在原位。
- 回退方法：把 `book.js`（两处地面、两处半球）与 `3Dprogram_3.1.html`（视频 source）中的路径改回旧文件名即可，无需其它改动。
- 新素材均在 `pic/textures/` 与 `pic/vd/` 下，不改动原有文件，可随时并行对比。

## 6. 预览与清单

- Contact sheet：`run/3dmod_and_pic/pic/textures/preview/contact-sheet.jpg`
- 平铺目检：`preview/tiling-ground-court-01.jpg`、`preview/tiling-ground-stone-01.jpg`、`preview/tiling-water-01.jpg`
- 视频抽帧：`preview/video-frame-1.jpg` / `-2` / `-3`
- 机器可读清单：`run/3dmod_and_pic/pic/textures/manifest.json`（含 prompt/seed/尺寸/耗时/替换映射/回退信息）
