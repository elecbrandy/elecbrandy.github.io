+++
title = 'Windows Python 개발환경 설치'
date = 2026-09-01
tags = ['dev101']
+++

# Windows에서 Python LangGraph/LangChain과 Docker 개발환경 설치 방법

## 0. 최종 폴더 구조

프로젝트는 Windows 경로인 `C:\\Users\\...` 또는 `/mnt/c/Users/...`가 아니라 WSL 파일시스템에 둔다.

```text
/home/<Ubuntu사용자명>/projects/langgraph-app
├── .venv/
├── .env
├── compose.yaml
├── pyproject.toml
└── src/
```

## 1. Windows에서 WSL2 Ubuntu 설치

PowerShell을 관리자 권한으로 열고 다음 명령을 실행한다.

```powershell
wsl --install -d Ubuntu
```

Windows를 재시작한 뒤 Ubuntu를 실행한다. 최초 실행 화면에서 Linux 사용자명과 비밀번호를 만든다.

WSL 버전과 배포판 상태를 확인한다.

```powershell
wsl --status
wsl -l -v
```

`Ubuntu`의 `VERSION` 값이 `2`인지 확인한다. 값이 `1`이면 다음 명령을 실행한다.

```powershell
wsl --set-version Ubuntu 2
wsl --set-default-version 2
```

## 2. Windows 프로그램 설치

다음 프로그램을 설치한다.

```text
Windows Terminal
Visual Studio Code
Docker Desktop
```

Windows Terminal에서 Ubuntu를 열어 이후 Linux 명령을 실행한다.

## 3. Docker Desktop을 WSL2와 연결

Docker Desktop을 실행하고 다음 항목을 설정한다.

```text
Settings > General > Use the WSL 2 based engine: 켜기
Settings > Resources > WSL Integration > Enable integration with my default WSL distro: 켜기
Settings > Resources > WSL Integration > Ubuntu: 켜기
```

Ubuntu 터미널에서 Docker 연결을 확인한다.

```bash
docker version
docker compose version
docker run --rm hello-world
```

`docker` 명령을 찾을 수 없거나 Docker daemon 연결 오류가 나오면 Docker Desktop이 실행 중인지 확인하고, WSL Integration의 Ubuntu 항목을 다시 켠다.

## 4. WSL Ubuntu 기본 패키지 설치

Ubuntu 터미널에서 다음 명령을 실행한다.

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y build-essential ca-certificates curl git pkg-config python3 python3-pip python3-venv
git --version
python3 --version
curl --version
```

## 5. VS Code Remote - WSL 연결

Windows용 VS Code에서 Extensions 화면을 열고 Microsoft의 `WSL` 확장을 설치한다.

Ubuntu에서 프로젝트 폴더를 만들고 VS Code를 WSL 모드로 연다.

```bash
mkdir -p ~/projects/langgraph-app
cd ~/projects/langgraph-app
code .
```

VS Code 왼쪽 아래 상태 표시줄에 `WSL: Ubuntu`가 표시되는지 확인한다. 표시되지 않으면 명령 팔레트에서 `WSL: Reopen Folder in WSL`을 실행한다. VS Code의 Python 확장도 WSL: Ubuntu 창에서 설치한다.

## 6. uv 설치와 Python 프로젝트 생성

`uv`는 Python 패키지와 가상환경을 관리하는 도구이다. Ubuntu에서 설치한다.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source "$HOME/.local/bin/env"
uv --version
```

새 프로젝트와 Python 3.12 가상환경을 만든다.

```bash
cd ~/projects
uv init langgraph-app
cd langgraph-app
uv python install 3.12
uv venv --python 3.12
source .venv/bin/activate
python --version
```

VS Code에서 Python 인터프리터 선택 화면을 열고 `.venv/bin/python`을 선택한다.

## 7. LangGraph와 LangChain 설치

가상환경이 활성화된 상태에서 기본 패키지를 설치한다.

```bash
uv add langgraph langchain langchain-openai python-dotenv
uv add --dev pytest ruff
uv run python -c "import langgraph, langchain; print('LangGraph and LangChain installed')"
uv tree
```

OpenAI API를 사용하는 경우 `.env` 파일을 만든다. 실제 API 키는 Git에 올리지 않는다.

```bash
printf '%s\n' 'OPENAI_API_KEY=실제_API_키' > .env
printf '%s\n' '.env' >> .gitignore
```

`.env`에 적은 키는 외부에 공유하지 않는 비밀 값이다.

## 8. Git 사용자 정보와 저장소 연결

Git 사용자 정보를 설정한다.

```bash
git config --global user.name "사용자 이름"
git config --global user.email "사용자 이메일"
git config --global init.defaultBranch main
git config --global --list
```

### 8.1 SSH 방식

SSH 키를 만들고 공개키를 출력한다.

```bash
ssh-keygen -t ed25519 -C "사용자이메일@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
```

출력된 공개키 전체를 GitHub 또는 GitLab 계정의 SSH Key 설정에 등록한다. GitHub 연결을 확인한다.

```bash
ssh -T git@github.com
```

GitHub의 SSH 22번 포트가 회사망에서 차단된 경우 다음 설정을 추가한다.

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
cat >> ~/.ssh/config <<'EOF'
Host github.com
  Hostname ssh.github.com
  Port 443
  User git
EOF
chmod 600 ~/.ssh/config
ssh -T git@github.com
```

### 8.2 HTTPS 방식

HTTPS 주소로 저장소를 복제한다.

```bash
git clone https://github.com/<조직또는사용자>/<저장소>.git
```

GitHub는 비밀번호 대신 Personal Access Token을 요구할 수 있다. 토큰을 비밀번호 입력란에 붙여 넣는다.

현재 프로젝트를 원격 저장소에 연결하는 명령은 다음과 같다.

```bash
git init
git add .
git commit -m "Initial project setup"
git remote add origin https://github.com/<조직또는사용자>/<저장소>.git
git push -u origin main
```

## 9. 회사 VPN·프록시·DNS 점검

먼저 Windows에서 회사 VPN에 연결한다. 그 다음 Ubuntu에서 네트워크를 확인한다.

```bash
curl -I https://github.com
getent hosts github.com
git ls-remote https://github.com/git/git.git HEAD
docker pull hello-world
```

Windows에서는 되지만 WSL에서 이름 해석, 프록시, 사내 Git 연결이 실패하면 Windows 홈 폴더의 `.wslconfig`에 다음을 추가한다.

```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
autoProxy=true
```

PowerShell에서 WSL을 종료하고 다시 연다.

```powershell
wsl --shutdown
wsl -d Ubuntu
```

회사가 명시적인 프록시 주소를 제공한 경우에만 Git 프록시를 설정한다.

```bash
git config --global http.proxy http://proxy.company.com:8080
git config --global https.proxy http://proxy.company.com:8080
```

프록시 설정을 제거하는 명령은 다음과 같다.

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

Python 패키지 설치에 프록시가 필요한 경우 현재 셸에만 적용한다.

```bash
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
uv sync
```

회사 보안 프록시의 인증서 때문에 `CERTIFICATE_VERIFY_FAILED` 오류가 나면 보안팀에서 Linux/WSL용 사내 루트 인증서를 받아 설치해야 한다. 인증서 검증을 끄는 방식은 사용하지 않는다.

## 10. PostgreSQL·Redis·Qdrant를 Docker Compose로 실행

프로젝트 루트에서 `compose.yaml` 파일을 만들고 다음 내용을 입력한다.

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app_password
      POSTGRES_DB: langgraph
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d langgraph"]
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 10

  qdrant:
    image: qdrant/qdrant:v1.13.4
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  postgres_data:
  redis_data:
  qdrant_data:
```

개발용 기본 비밀번호 `app_password`는 로컬 환경 전용 값이다. 운영 환경에서는 Docker secrets 또는 비밀 관리 서비스를 사용한다.

컨테이너를 실행한다.

```bash
docker compose up -d
docker compose ps
docker compose logs --tail=100
```

각 서비스의 연결을 확인한다.

```bash
docker compose exec postgres psql -U app -d langgraph -c 'SELECT version();'
docker compose exec redis redis-cli ping
curl http://localhost:6333/healthz
```

정상 결과는 PostgreSQL 버전 정보, Redis의 `PONG`, Qdrant의 HTTP 200 응답이다.

컨테이너를 중지한다.

```bash
docker compose down
```

컨테이너와 데이터 볼륨을 함께 삭제하는 명령은 다음과 같다. 이 명령은 PostgreSQL·Redis·Qdrant의 로컬 데이터를 삭제한다.

```bash
docker compose down -v
```

## 11. Codex를 WSL에서 사용

Codex CLI는 WSL Ubuntu 터미널에서 실행하는 구성이 가장 단순하다. 프로젝트 경로도 WSL 내부 경로를 사용한다.

```bash
cd ~/projects/langgraph-app
codex --version
codex
```

VS Code의 WSL 창에서 통합 터미널을 열고 같은 명령을 실행해도 된다. Codex가 Docker를 실행해야 하는 작업에서는 Docker Desktop을 먼저 실행하고 다음 명령이 성공하는지 확인한다.

```bash
docker ps
docker compose ps
```

Windows에 설치된 Codex와 WSL에 설치된 Python·Docker를 섞어 사용하지 않는다. 프로젝트 명령, `uv`, `git`, `docker compose`, Codex는 모두 WSL Ubuntu 터미널에서 실행한다.

## 12. 전체 설치 확인 명령

프로젝트 루트에서 다음 명령을 순서대로 실행한다.

```bash
pwd
uname -a
python3 --version
uv --version
git --version
docker version
docker compose version
uv run python -c "import langgraph, langchain; print('LangGraph and LangChain installed')"
docker compose up -d
docker compose ps
docker compose exec redis redis-cli ping
curl -fsS http://localhost:6333/healthz
docker compose down
```

`pwd` 출력이 `/home/<Ubuntu사용자명>/projects/langgraph-app` 형태이고, Docker 서비스와 Python import가 성공하면 설치가 완료된 상태이다.

## 13. 문제 해결 명령

### WSL 상태 확인과 재시작

```powershell
wsl --status
wsl -l -v
wsl --update
wsl --shutdown
wsl -d Ubuntu
```

### Docker daemon 연결 오류

```bash
docker context ls
docker context use default
docker version
docker info
```

Docker Desktop을 완전히 종료한 뒤 다시 실행한다. 그 후 PowerShell에서 `wsl --shutdown`을 실행하고 Ubuntu를 다시 연다.

### 포트 충돌 확인

PostgreSQL, Redis, Qdrant의 포트가 이미 사용 중인지 확인한다.

```bash
ss -ltnp | rg ':(5432|6379|6333|6334)'
docker ps --format 'table {{.Names}}\t{{.Ports}}'
```

충돌한 서비스가 있으면 `compose.yaml`의 왼쪽 포트 번호를 변경한다. 예를 들어 `"15432:5432"`은 Windows와 WSL의 15432 포트를 컨테이너의 PostgreSQL 5432 포트에 연결하는 설정이다.

### Python 가상환경 재생성

가상환경이 손상되었을 때 실행한다.

```bash
deactivate 2>/dev/null || true
rm -rf .venv
uv venv --python 3.12
uv sync
source .venv/bin/activate
```

### Git 인증과 연결 확인

```bash
git remote -v
ssh -vT git@github.com
git ls-remote origin HEAD
git config --global --get-regexp 'http\..*proxy|https\..*proxy' || true
```

### DNS 확인과 갱신

```bash
cat /etc/resolv.conf
getent hosts github.com
resolvectl status 2>/dev/null || true
curl -vI https://github.com
```

VPN 연결을 변경한 직후 DNS가 실패하면 PowerShell에서 다음을 실행한 뒤 Ubuntu를 다시 연다.

```powershell
wsl --shutdown
ipconfig /flushdns
wsl -d Ubuntu
```

## 14. 일상 개발 시작 명령

Windows에서 Docker Desktop과 회사 VPN을 먼저 실행한다. 이후 Ubuntu 터미널에서 다음 명령을 실행한다.

```bash
cd ~/projects/langgraph-app
source .venv/bin/activate
docker compose up -d
code .
codex
```

작업 종료 시 컨테이너를 중지한다.

```bash
cd ~/projects/langgraph-app
docker compose down
```
