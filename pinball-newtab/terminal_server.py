#!/usr/bin/env python3
"""
✦ 终端 WebSocket 服务器（稳定版）
配合 newtab-glass-editor.html 的终端气泡使用

使用方法:
  pip install websockets
  python3 terminal_server.py

然后刷新页面，点击终端气泡 → 点「重连」
支持 vim、top、htop 等交互式程序 ✨
"""

import asyncio
import websockets
import os
import signal
import pty
import struct
import fcntl
import termios
import logging

logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(message)s', datefmt='%H:%M:%S')
log = logging.getLogger(__name__)


class PtyTerminal:
    """为每个连接创建一个伪终端"""

    def __init__(self, websocket):
        self.ws = websocket
        self.pid = None
        self.fd = None
        self._loop = asyncio.get_event_loop()

    def _set_size(self, rows=24, cols=80):
        """设置终端大小"""
        if self.fd is not None:
            try:
                size = struct.pack("HHHH", rows, cols, 0, 0)
                fcntl.ioctl(self.fd, termios.TIOCSWINSZ, size)
            except Exception:
                pass

    def _spawn(self):
        """创建伪终端并启动 shell"""
        shell = os.environ.get('SHELL', '/bin/bash')

        pid, fd = pty.fork()
        if pid == 0:
            # 子进程
            try:
                # 设置终端大小
                self._set_size(24, 80)
                os.execvp(shell, [shell])
            except Exception:
                os._exit(1)
            return

        # 父进程
        self.pid = pid
        self.fd = fd

        # 设为非阻塞
        fl = fcntl.fcntl(fd, fcntl.F_GETFL)
        fcntl.fcntl(fd, fcntl.F_SETFL, fl | os.O_NONBLOCK)

        return pid, fd

    async def read_pty(self):
        """读取 PTY 输出 → WebSocket"""
        loop = self._loop
        buf = b''

        while True:
            try:
                data = await loop.run_in_executor(None, os.read, self.fd, 65536)
                if not data:
                    break
                await self.ws.send(data.decode('utf-8', errors='replace'))
            except (BlockingIOError, OSError):
                await asyncio.sleep(0.01)
            except websockets.exceptions.ConnectionClosed:
                break
            except Exception:
                break

    async def write_pty(self):
        """WebSocket 消息 → PTY 输入"""
        async for message in self.ws:
            if isinstance(message, str):
                os.write(self.fd, message.encode('utf-8'))
            elif isinstance(message, bytes):
                os.write(self.fd, message)

    async def start(self):
        """启动终端会话"""
        try:
            self._spawn()
            log.info(f"  PID={self.pid}  终端已创建")

            # 发送欢迎信息
            await self.ws.send(
                "\r\n\x1b[35m✦ 终端已连接 ✦\x1b[0m"
                "\r\n\x1b[90m输入 exit 或 Ctrl+D 退出\x1b[0m\r\n"
            )

            await asyncio.gather(
                self.read_pty(),
                self.write_pty()
            )
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            self.cleanup()

    def cleanup(self):
        """清理资源"""
        if self.pid:
            try:
                os.kill(self.pid, signal.SIGTERM)
                os.waitpid(self.pid, 0)
            except (OSError, ChildProcessError):
                pass
            self.pid = None
        if self.fd is not None:
            try:
                os.close(self.fd)
            except OSError:
                pass
            self.fd = None
        log.info("  终端已关闭")


async def handler(websocket):
    """处理 WebSocket 连接"""
    addr = websocket.remote_address
    log.info(f"[+] 新连接: {addr}")

    terminal = PtyTerminal(websocket)
    try:
        await terminal.start()
    except Exception as e:
        log.error(f"  [!] 错误: {e}")
    finally:
        terminal.cleanup()
    log.info(f"[-] 断开: {addr}")


async def main():
    print("""
 ╔══════════════════════════════════╗
 ║  ✦ 终端 WebSocket 服务器 ✦      ║
 ║  运行在 ws://localhost:8765      ║
 ║  Ctrl+C 停止                     ║
 ╚══════════════════════════════════╝
    """)

    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()  # 永久运行


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[!] 服务器已停止")
