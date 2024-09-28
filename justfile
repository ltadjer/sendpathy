NODE := "docker compose exec node"
PNPM := NODE + " pnpm"

pnpm *args:
    {{PNPM}} {{args}}

install-back *args:
    {{PNPM}} -F "backend" install {{args}}

install-front *args:
    {{PNPM}} -F "frontend" install {{args}}

front *args:
    {{PNPM}} -F "frontend" {{args}}

back *args:
    {{PNPM}} -F "backend" {{args}}

shell:
    docker compose exec -it node bash

nest *args:
    {{NODE}} bash -c "cd apps/backend && nest {{args}}"