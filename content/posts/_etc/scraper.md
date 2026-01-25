+++
title = 'Ray 기반 웹 스크래퍼'
date = 2025-11-23
featured_image = "https://zrr.kr/QgOehQ"
tags = ['python']
draft = true
+++

{{<series title="📚 서고: 전자책 검색 서비스" series="seogo">}}

<br>

## 1. 소개


- **이것은 어떤 프로젝트인가요?**
    - 오랜 숙원이었던 `교보문고 전자책 웹사이트에서 전자책 데이터를 수집하는 스크래퍼` 를 만들었다.
    - `playwright + ray` 기반으로 작동해서 빠르고 대용량 스크래핑에 유리하다.
- **어떻게 작동하나요?**
    - `🐳 스크래퍼 컨테이너` → `📄 책 데이터` → `🐳 DB 컨테이너`
    - 스크래퍼가 시작하면…
        1. `n개의 actor`가 병렬실행을 위해 준비 (cpu core)
        2. 도서관 하나가 가진 `여러 책 리스트 page urls` 를 `n개의 actor` 에게 지속적으로 공급
        3. 도서관 하나 스크랩 완료하고, 다음 도서관으로 이동
    - 즉, 각 도서관 하나를 병렬로 빠르게 스크래핑 → 다음 도서관 → ...

<br>
<br>

## 2. Seogo-Scraper


- ℹ️ 아래 내용은 `seogo-scraper` 프로젝트의 `README.md` 와 동일합니다.  
- 🌏 [github repository 방문하기 >>](https://github.com/elecbrandy/seogo_scraper)

![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=flat-square&logo=python&logoColor=white)
![Ray](https://img.shields.io/badge/Ray-Distributed-028CF0?style=flat-square&logo=ray&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-Async-45BA4B?style=flat-square&logo=google-chrome&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)

**Seogo-Scrpaer**는 대규모 전자도서관 데이터를 효율적으로 수집하기 위해 설계된 분산 웹스크래퍼 입니다.
단일 프로세스의 성능 한계를 극복하기 위해 **Ray 아키텍처**를 도입하였으며, Docker 환경에서 실행 가능합니다.

<br>
<br>

### 📦 Architecture

<img src="https://github.com/elecbrandy/seogo_scraper/blob/main/static/ac.png?raw=1" style="max-width:600px; width:100%; height:auto;">

이 프로젝트는 **Docker** 환경 위에서 **Ray** 프레임워크를 활용한 분산 처리 아키텍처를 따릅니다. **Playwright**를 사용한 다수의 스크래퍼 워커(Scraper Workers)가 병렬로 데이터를 수집하며, 수집된 데이터는 **DbActor**를 통해 **MySQL** 데이터베이스에 비동기적으로 저장됩니다.

<br>

#### 🧩 Infrastructure Overview
1.  **🐳 Scraper Container** (`scraper`) : Python 애플리케이션과 Ray 런타임이 구동되는 핵심 컨테이너입니다.
2.  **🐳 Database Container**  (`db`): MySQL 8.0이 구동되며, 영구 데이터 저장을 담당합니다.
3.  **🌐 Bridge Network** (`seogo`): 두 컨테이너는 격리된 Docker Bridge 네트워크를 통해 통신을 수행합니다.

<br>

#### 🔄 Process Data Flow
1.  **Task Distribution (Main Process → Workers)**
    * `src/main.py`가 실행되면 Ray 클러스터를 초기화하고, 설정된 개수(`ACTOR_NUMS`)만큼의 `ScraperWorker`를 생성합니다.
    * 메인 프로세스는 도서관별/카테고리별 수집 작업을 각 워커에게 분배합니다.

2.  **External Scraping (Workers ↔ Internet)**
    * 각 `ScraperWorker`는 독립된 Playwright 브라우저 인스턴스를 가집니다.
    * 외부(교보문고 서버)로 **HTTP Request**를 보내고, 응답받은 HTML/JSON 데이터를 파싱하여 `BookData` 객체로 변환합니다.

3.  **Data Aggregation (Workers → DbActor)**
    * 워커는 DB에 직접 연결하지 않고, 파싱된 데이터를 `DbActor`에게 전달(Remote Call)합니다.
    * 이를 통해 DB 커넥션 풀을 효율적으로 관리하고, 동시성 문제를 방지합니다.

4.  **Persistence (DbActor ↔ MySQL)**
    * 싱글톤으로 동작하는 `DbActor`는 `aiomysql` 커넥션 풀을 사용하여 데이터를 `INSERT` 또는 `UPDATE` 합니다.
    * 컨테이너 간 통신은 내부 네트워크(`db:3306`)를 통해 이루어집니다.

<br>

#### 🔑 Key Components

| Component | Type | Role & Responsibility |
| :--- | :--- | :--- |
| **ScraperWorker** | `Ray Actor` | Headless Browser(Chromium)를 관리하며 실제 웹 페이지를 탐색 및 파싱합니다. |
| **DbActor** | `Ray Actor` | DB 커넥션 풀을 관리하는 **싱글톤 액터**입니다. 다수의 워커로부터 저장 요청을 받아 처리합니다. |
| **Ray Runtime** | `Framework` | 프로세스 간 통신(IPC) 및 작업 스케줄링을 담당하여 멀티코어 리소스를 극대화합니다. |
| **MySQL** | `Database` | 수집된 도서, 저자, 출판사 정보를 관계형 데이터로 저장합니다. |

<br>
<br>

### ⚡ Key Decisions

#### 1. 분산 환경에서의 브라우저 리소스 관리 (Ray Actor)
  - **문제점:** `multiprocessing` 사용 시 브라우저 프로세스의 생성/종료 오버헤드가 크고 좀비 프로세스 관리가 어려움.
  * **개선안:** `Ray Actor` 를 도입하여 브라우저 인스턴스를 미리 띄워두고, 작업(Task)만 할당하는 방식으로 처리 속도를 개선.

#### 2. DB 병목 현상 해소 (Async DB Actor)
  - **문제점:** 다수의 스크래퍼가 동시에 DB에 접근할 때 Connection Pool 고갈 및 Lock 발생.
  - **개선안:** `DbActor` 를 운용하여 모든 쓰기 요청을 큐 형태로 받아 비동기(`aiomysql`)로 처리, 데이터 무결성을 보장.

#### 3. 유연한 확장성 (Strategy Pattern)
  - **기능:** 도서관마다 다른 페이지 구조를 대응하기 위해, 스크래핑 로직을 `BasePageScraper` 추상 클래스로 분리.
  - **이점:** `Worker Actor` 코드는 수정하지 않고, 로직 클래스만 갈아끼우는 방식으로 교보문고 외 타 사이트 확장이 용이.

<br>
<br>

### 🛠 Tech Stack

| Category | Technology |
| --- | --- |
| **Language** | Python 3.10 |
| **Distributed** | **Ray** (Actor Model) |
| **Browser Automation** | **Playwright** (Async) |
| **Database** | MySQL 8.0, aiomysql |
| **Infrastructure** | Docker, Docker Compose |

<br>
<br>

### 📂 Project Structure

```bash
.
├── Makefile                # 실행 명령 관리
├── docker-compose.yml      # 컨테이너 오케스트레이션
├── src
│   ├── main.py             # Entry Point (Ray Init)
│   ├── core                # 프레임워크 코어
│   │   ├── actors          # Ray Actor (Worker, DB)
│   │   ├── base            # 추상화된 스크래퍼 인터페이스
│   │   └── browser         # Playwright 설정 (Stealth 모드)
│   └── providers           # 사이트별 구현체 (교보, 알라딘 등)
└── db                      # DB 스키마 및 초기화
```

<br>
<br>

### ⚠️ 실행 전 주의사항!

#### `.env` 파일 생성하기

``` .env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=mydatabase
MYSQL_USER=user
MYSQL_PASSWORD=password

DB_HOST=db
DB_PORT=3306
DB_NAME=mydatabase
DB_USER=user
DB_PASSWORD=password
```

프로젝트의 루트 디렉토리는 환경 설정을 위해 `.env` 파일을 사용합니다. `.env` 파일에는 컨테이너들이 서로 통신하고 데이터베이스를 초기화하는 데 필요한 다양한 정보가 적혀있으며, 보안 상 `.env` 파일이 레포지토리에는 존재하지 않습니다. 임시 방편으로 루트 디렉토리에 `.env` 파일을 새로 생성하고 위 내용을 복사하여 붙어넣어 주세요.

<br>

#### Actor 수 변경하기
``` python
# src/core/utils/constants.py

ACTOR_NUMS = 4 # 👈 이 부분
```
시스템의 동시 처리 능력을 조정하려면 Ray Actor의 개수를 변경해야 합니다.
본인 로컬 머신의 cpu core 갯수 보다 좀 적게 설정하세요.

<br>

#### DB 포트 충돌 체크하기

``` yaml
# docker-compose.yml
services:
    db:
    # ... (생략)
    ports:
        - "3306:3306"  # 👈 이 부분 (ex. "3307:3306")
```

이 스크래퍼는 DB 컨테이너를 띄워 통신합니다. 이때 `3306` 포트를 사용하기 때문에, 로컬 `3306` 포트가 이미 사용 중인 경우 `docker-compose.yml` 에서 외부 포트 매핑을 변경할 수 있습니다. 앞의 숫자만 로컬 포트로 변경하고, 콜론 뒤의 컨테이너 내부 포트(`3306`)는 그대로 유지해야 합니다.

<br>
<br>

### 🚀 Quick Start

Docker가 설치된 환경에서 단 한 줄의 명령어로 전체 시스템을 실행할 수 있습니다.
실행 전 주의사항을 다시한번 사용하세요!

- `.env` 파일 확인하기
- Actor 갯수 확인하기 (default=4)
- DB 포트 확인하기

```bash
# 1. 시스템 실행 (DB & Scraper 컨테이너 구동)
make up

# 2. 스크래핑 시작
make scrape

# 3. 로그 확인 👈 스크래핑 과정을 볼 수 있습니다.
make logs

# 4. 종료 및 정리
make clean
```

<br>
<br>

### ☑️ 기능별 요구사항
- [x] ⚙️ **프로젝트 기본 설정**
    - `git init` 및 `.gitignore` 파일 생성 (Python의 `__pycache__`, `.venv` 등 포함)
    - `README.md` 기본 파일 생성
    - `requirements.txt` 파일 생성 (ray, playwright/selenium 등)
    - 가상 환경 설정 및 라이브러리 설치
- [x] 🌏 **Playwright 기반 브라우징 함수**
    - 브라우저를 작동한다.
    - 브라우저 객체 또는 페이지 객체를 반환하는 메소드
    - 브라우저를 재활용하는 구조로 작동한다.
- [x] 📄 **Ray 이전 사이클 구조 만들기**
    - kyobo 전자책 메인 페이지에서 전체 도서관 링크를 수집한다.
    - 이제 싸이클은 각 도서관을 순회하면 진행된다.
    - 각 도서관에 접속 -> 테마별 링크 수집 -> Ray에게 병렬 분배
- [x] 🛠️ **Actor 도입**
    - 도서관 단위의 Ray 분산 작업 도입
    - Ray를 시작하고, DB 액터와 스크래퍼 액터 풀을 생성
    - 생성된 액터들을 파이프라인에 전달
    - "카테고리" 작업 목록을 만들고 asyncio.Queue에 삽입
    - 여러 Actor가 도서관 하나를 맡아 끝까지 처리하도록 로직을 수정
    - 즉, 도서관 순차 -> 각 도서관 내부에서 병렬
- [x] 💿 **DB연결 후 Docker 환경점검**
    - .env 로 DB 도커로 띄우기
    - DB Actor를 통해 스크래핑 데이터를 DB에 추가
    - `docker-compose` 와 `make` 를 통해 가상 환경에서 스크래핑, 저장이 잘 되는지 확인
    - 특히 docker 컨테이너 내부의 ray에게 로컬과 같은 방식으로 cpu 자원을 할당해 줄 수 있는지 확인
- [ ] 📄 **ctgr 분류 제거**
    - 전자책 검색에 집중한다면, 수집 과정에서 굳이 추가 자원을 지출하면서 전자책의 카테고리까지 수집해야할까?
    - `전자책~소속도서관` 의 관계에 집중하면 되는 것 아닐까?
    - 추후 수정 예정
- [ ] 🖨️ **콘솔 상호작용 추가**
    - 스크래핑 진척도를 볼 수 있게 개선
    - 회사별, 도서관 별 상호작용이 가능하게 개선
    - 추후 추가 예정

<br>
<br>

## 3. 정리
    
- **이런 점에서 좋았다.**
    - 이전에 실패했던 프로젝트를 2주 안에 완성시켰다.
    - `Ray` 를 공부하고, 적극적으로 프로젝트에 사용했다.
    - 객체지향적인 부분에서 프리코스에서 배웠던 점을 적용하고자 노력했다.
- **이런 점에서 아쉬웠다.**
    - 프리코스에서 배웠던 점을 적용하고자 노력했으나 부족한 점이 많다.
        - 계획을 세우고 기능별로 커밋하는 것은 여전히 쉽지 않다.
        - 특히 함수를 쪼개고, 가독성을 높이고, 유지보수성을 높이는 부분에서 낙제점이다.
        - 객체지향적인 부분에서 노력했지만, 그마저도 아쉬운 부분이 많다.
    - 작동하긴 하지만, 기능적인 측면에서 완벽하지 않다.
        - 스크래핑 과정은 보이지만, 진척도를 확인할 수 없다.
        - 사용자 스크래핑 과정에 개입할 수 없다. (`부분 스크래핑, 중지, 재실행 등`)
        - 도서의 테마 정보를 굳이 수집해야하는가?
            - 목적이 `전자도서관-전자책` 검색인데, 이 DB에서 테마 정보가 의미가 있을까?
            - 각 회사마다 테마 이름, 부여 기준이 다르기 때문에 전처리가 갈수록 복잡해질 것이다.
- **이후 계획**
    - 우선, 아쉬웠던 점을 고치고 더 유연하고 가독성 좋은 스크래퍼로 개선할 예정이다.
        - 진척도 확인을 로그에 표시하게끔 개선 예정
        - 콘솔로 사용자와 의사소통을 가능하게 개선할 예정
            - (`원하는 도서관, 회사 상호작용 또는 오류 트래킹 등`)
        - 테마 정보 삭제 (스크래핑은 더 빨라짐)
        - 다른 도서관 추가 예정
    - Spring을 공부해서, 완성된 DB와 연결해 최종 서비스를 만들 예정이다.

{{<series title="📚 서고: 전자책 검색 서비스" series="seogo">}}

<br>
<br>
