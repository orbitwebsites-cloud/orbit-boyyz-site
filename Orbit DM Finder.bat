@echo off
title Orbit DM Finder
cd /d "%~dp0"
echo Starting Orbit DM Finder...
echo A browser tab will open. Close this window to stop.
echo.
node "scripts\dm-finder\ui.mjs"
pause
