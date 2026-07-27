# Pinball New Tab - 弹珠新标签页

一个可自定义的浏览器新标签页，拥有浮动弹珠风格的快捷工具：编辑器、终端、链接管理、便签、音乐播放器，目前仍在开发。
项目中使用了AI

## 使用截图
![弹珠起始页](https://github.com/snowinging/pinball-newtab/blob/main/image/screenshot0.png)
![弹珠尾迹](https://github.com/snowinging/pinball-newtab/blob/main/image/screenshot1.png)
![音乐播放器](https://github.com/snowinging/pinball-newtab/blob/main/image/screenshot2.png)
![入口自定义](https://github.com/snowinging/pinball-newtab/blob/main/image/screenshot3.png)
![入口图标自定义](https://github.com/snowinging/pinball-newtab/blob/main/image/screenshot4.png)
![终端](https://github.com/snowinging/pinball-newtab/blob/main/image/screenshot5.png)
![html编辑器](https://github.com/snowinging/pinball-newtab/blob/main/image/screenshot6.png)
![小纸条](https://github.com/snowinging/pinball-newtab/blob/main/image/screenshot7.png)
## 功能特性

- **编辑器** — 实时预览当前页面的 HTML 代码
- **终端** — 通过 WebSocket 连接系统终端（unix/linux only）
- **链接** — 管理快捷链接，支持图标选择器
- **便签** — 便签笔记，支持导入导出 TXT 文件
- **音乐** — 播放网络音频或本地音频，管理播放列表
- **弹珠模式** — 让弹珠在屏幕上物理弹射，支持右键抓取

## 安装方法

### Firefox

1. 打开 `about:debugging#/runtime/this-firefox`
2. 点击「加载临时附加组件」
3. 选择 `manifest.json`

### Chrome / Edge

1. 打开 `chrome://extensions`
2. 开启「开发者模式」
3. 点击「加载已解压的扩展」
4. 选择本项目所在文件夹

## 使用方法

- 点击弹珠打开对应工具
- 右键按住并拖动可移动弹珠位置
- 在音乐弹珠上长按左键 0.2 秒可呼出快捷轮盘菜单
- 点击「弹珠模式」让所有弹珠物理弹射
- 弹珠运动中可右键抓取单个弹珠使其停下
- `Ctrl+Shift+P` 可切换弹珠层显示（仅扩展版本）

## 终端服务器（可选）

如果需要使用终端功能，请先安装依赖并启动服务器：

```bash
pip install websockets
python3 terminal_server.py
```

## 项目结构

```
my-custom-newtab-extension/
├── manifest.json         # 浏览器扩展声明
├── index.html            # 新标签页入口
├── pinball.js            # 弹珠系统主逻辑
├── icon.png              # 扩展图标
├── terminal_server.py    # 终端 WebSocket 服务器（可选）
└── README.md             # 本文件
```

## 许可证

MIT
