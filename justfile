NODE := "docker compose exec node"
PNPM := NODE + " pnpm"

pnpm *args:
    {{PNPM}} {{args}}

back *args:
    {{PNPM}} -F "backend" {{args}}

front *args:
    {{PNPM}} -F "frontend" {{args}}

shell:
    docker compose exec -it node bash

nest *args:
    {{NODE}} bash -c "cd apps/backend && nest {{args}}" 