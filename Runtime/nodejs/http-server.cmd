@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\http-server\bin\http-server" %*
) ELSE (
  node  "%~dp0\node_modules\http-server\bin\http-server" %*
)