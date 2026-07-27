# Pinball New Tab

A customizable browser new tab page with floating bubble-style quick tools: editor, terminal, links manager, notes, music player.

## Features

- **Editor** - Edit HTML and preview in real-time
- **Terminal** - Connect to a system terminal via WebSocket (macOS / Linux only)
- **Links** - Manage quick links with an icon picker
- **Notes** - Sticky notes with TXT import/export support
- **Music** - Play network audio with playlist management
- **Pinball Mode** - Launch bubbles with physics simulation; right-click to grab and stop individual bubbles

## Installation

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json`

### Chrome / Edge

1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this folder

## Usage

- Click a bubble to open its tool
- Right-click and drag to reposition a bubble
- Long-press (0.2s) the music bubble for radial quick controls
- Click "Pinball Mode" to launch all bubbles with physics
- Right-click a flying bubble to grab and stop it
- `Ctrl+Shift+P` toggles the bubble layer (extension version only)

## Terminal Server (optional)

```bash
pip install websockets
python3 terminal_server.py
```

## Project Structure

```
my-custom-newtab-extension/
├── manifest.json         # Extension manifest
├── index.html            # New tab page entry
├── pinball.js            # Main bubble system logic
├── icon.png              # Extension icon
├── terminal_server.py    # WebSocket terminal server (optional)
├── README.md             # Chinese documentation
└── README_EN.md          # English documentation (this file)
```

## License

MIT
