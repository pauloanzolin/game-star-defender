<#
  release-v1.1.ps1 — fluxo DevOps para publicar a v1.1 no GitHub.

  Pré-requisitos:
    - git instalado e no PATH
    - autenticado no GitHub (GitHub CLI `gh auth login`, ou credential manager / PAT)
    - acesso de escrita ao repositório pauloanzolin/game-star-defender

  Uso (a partir da pasta star-defender):
    powershell -ExecutionPolicy Bypass -File .\scripts\release-v1.1.ps1
#>

$ErrorActionPreference = "Stop"

$Repo    = "https://github.com/pauloanzolin/game-star-defender.git"
$Branch  = "feature/ranking-competitivo"
$Tag     = "v1.1.0"
$Version = "1.1.0"

# 1) Garante repositório git (init + remote, ou usa o existente)
if (-not (Test-Path ".git")) {
  git init
  git branch -M main
  git remote add origin $Repo
} elseif (-not (git remote 2>$null | Select-String -SimpleMatch "origin")) {
  git remote add origin $Repo
}

# 2) Traz o histórico remoto (v1.0) se houver, sem travar caso esteja vazio
git fetch origin 2>$null
if ($?) { try { git merge --ff-only origin/main } catch { } }

# 3) Cria/usa a branch de feature
git checkout -B $Branch

# 4) Adiciona as mudanças da v1.1
git add -A

# 5) Commit semântico (Conventional Commits)
$msg = @'
feat: ranking competitivo com lista de recordes persistente (v1.1.0)

- jogador informa o nome e cada partida grava a pontuação (localStorage)
- lista de recordes ordenada do maior para o menor (top 10)
- destaque para o líder e para a entrada do jogador atual
- mensagem de posição no fim de jogo + atalho Enter para iniciar
- tela de fim de jogo reformulada; "recorde" deriva do topo do ranking

Refs: CHANGELOG.md
'@
git commit -m $msg

# 6) Envia a branch
git push -u origin $Branch

# 7) Tag anotada da release e push da tag
git tag -a $Tag -m "Star Defender $Version - ranking competitivo"
git push origin $Tag

Write-Host ""
Write-Host "OK! Branch '$Branch' e tag '$Tag' enviadas." -ForegroundColor Green
Write-Host "Abra um Pull Request para 'main' e crie a Release a partir da tag $Tag." -ForegroundColor Green
