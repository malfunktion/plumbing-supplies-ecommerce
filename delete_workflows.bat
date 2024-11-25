@echo off
setlocal enabledelayedexpansion

for /f "tokens=1-7" %%a in ('gh run list --limit 1000') do (
    set "id=%%g"
    if "!id!" neq "ID" (
        gh run delete !id!
    )
)
