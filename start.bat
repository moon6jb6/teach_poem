@echo off
chcp 65001 >nul
REM 天阙诗都·越长安——上国诗章，长安之上 本地启动脚本
REM 兼容「中文计算机名 + 老版本 Python（<=3.8）」：优先用 serve.py（补 socket.getfqdn 一行）
cd /d "%~dp0"
echo ============================================================
echo   天阙诗都·越长安——上国诗章，长安之上
echo   正在启动本地静态服务器 http://127.0.0.1:8080 ...
echo   启动后请用 Chrome / Edge 102+ 打开：
echo   http://127.0.0.1:8080/3Dprogram_3.1.html
echo   【注意】必须通过 http:// 访问，直接双击 HTML（file://）会白屏。
echo ============================================================
start "" http://127.0.0.1:8080/3Dprogram_3.1.html
if not exist "serve.py" goto plain
python serve.py 8080
if errorlevel 1 goto plain
goto end

:plain
echo [提示] serve.py 启动失败或无 Python，改用 python -m http.server 8080 ...
python -m http.server 8080
if errorlevel 1 goto plain2
goto end

:plain2
echo [提示] 仍未成功：请检查 Python 3 是否安装；也可手动执行：
echo        python serve.py 8080   或   python -m http.server 8080
echo        然后用浏览器打开 http://127.0.0.1:8080/3Dprogram_3.1.html

:end
pause
