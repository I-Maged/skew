$env:BIASLY_ADMIN_SECRET = "<your secret>"

# 1. manual scrape

Invoke-RestMethod -Uri http://localhost:3000/api/scrape -Method Post `  -Headers @{ "x-biasly-admin-secret" = $env:BIASLY_ADMIN_SECRET; "Content-Type" = "application/json" }`
-Body '{"perSourceLimit":3}'

# 2. create schedules

Invoke-RestMethod -Uri http://localhost:3000/api/oxylabs/schedules -Method Post `
-Headers @{ "x-biasly-admin-secret" = $env:BIASLY_ADMIN_SECRET }

# 3. list

Invoke-RestMethod -Uri http://localhost:3000/api/oxylabs/schedules -Method Get `
-Headers @{ "x-biasly-admin-secret" = $env:BIASLY_ADMIN_SECRET }

# 4. process completed runs

Invoke-RestMethod -Uri http://localhost:3000/api/oxylabs/scheduled-results/process -Method Post `
-Headers @{ "x-biasly-admin-secret" = $env:BIASLY_ADMIN_SECRET }

# 5. cron pipeline (local dev skips secret check)

Invoke-RestMethod -Uri http://localhost:3000/api/cron/pipeline -Method Get
