# -*- coding: utf-8 -*-
"""start.bat 兜底服务脚本（建议随包分发）。

为什么需要它：部分 Windows 电脑的名字含中文时，老版本 Python（如 3.7）执行
`python -m http.server` 会在 socket.getfqdn 处抛 UnicodeDecodeError 直接退出。
本脚本补一行 getfqdn 补丁即可正常起服务，其余行为与 http.server 完全一致。

用法：python serve.py [端口]   # 默认 8080，服务目录为本文件所在目录
"""
import functools
import os
import socket
import sys

socket.getfqdn = lambda *a, **k: 'localhost'  # 兼容中文主机名 / 老版本 Python

import http.server  # noqa: E402

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
sys.stdout.write('serving %s on http://127.0.0.1:%d/3Dprogram_3.1.html\n' % (ROOT, PORT))
sys.stdout.flush()
http.server.ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
