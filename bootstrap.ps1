Param(
    [String]$Env,
    [String]$System,
    [String]$Server
)

if (!(Test-Path "./runtime")) { mkdir "./runtime" }
if (!(Test-Path "./runtime/database")) { mkdir "./runtime/database" }
if (!(Test-Path "./runtime/log")) { mkdir "./runtime/log" }
& node src/dbapi/model/keychain
& node src/dbapi/model/package
& node src/dbapi/model/resource
& node src/dbapi/model/announcement
& node src/dbapi/model/ranking

if ($System -eq "win32") {
    Copy-Item "./config/system/directory.win.json" "./config/system/directory.json" -Force
}

if ($System -eq "unix") {
    Copy-Item "./config/system/directory.unix.json" "./config/system/directory.json" -Force
}

if ($Env -eq "prod") {
    Copy-Item "./config/system/environment.prod.json" "./config/system/environment.json" -Force
}

if ($Env -eq "dev") {
    Copy-Item "./config/system/environment.dev.json" "./config/system/environment.json" -Force
}
