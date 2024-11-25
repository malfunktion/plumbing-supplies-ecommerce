$runs = gh run list --json databaseId --limit 1000 | ConvertFrom-Json
foreach ($run in $runs) {
    gh run delete $run.databaseId
}
