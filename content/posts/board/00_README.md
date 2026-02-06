+++
title = '[게시판] README.md'
date = 2026-02-05
featured_image = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Spring_Boot.svg/330px-Spring_Boot.svg.png"
tags = ['skala','springboot','board']
+++

{{<series title="🍀 게시판 개발" series="board">}}

<br>

## 1. 프로젝트 소개

- Spring boot를 사용해 게시판 만들기
- 기본 CRUD 기능 구현
- 로그인 기능 구현 (`Oauth` 등)
- H2 DB로 개발 → 도커로 외부 DB와 연결

<br>
<br>
<br>

## 2. 아키텍쳐

![게시판_아키텍쳐](/images/board_arch.png)

- ![Vue.js](https://img.shields.io/badge/vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
- ![Spring Boot](https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
- ![PostgreSQL](https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
- ![Nginx](https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

<details>
<summary>Mermaid</summary>
<div markdown="1">

``` mermaid
---
config:
  layout: fixed
---
flowchart LR
 subgraph Client_Side["Client Side"]
        Browser["Web Browser<br>Vue.js SPA"]
  end
 subgraph Server_Side["Server Infrastructure"]
        Nginx["Nginx<br>Web Server &amp; Reverse Proxy"]
        SpringBoot["Spring Boot<br>API Server"]
        PostgreSQL[("PostgreSQL<br>Database")]
  end
    User(("User")) -- Access URL --> Browser
    Browser -- "1. Static Assets Req (HTML/JS/CSS)" --> Nginx
    Nginx -- Returns Vue Files --> Browser
    Browser -- "2. REST API Req (JSON)" --> Nginx
    Nginx -- Proxy Pass (/api) --> SpringBoot
    SpringBoot -- "3. JDBC/JPA" --> PostgreSQL
    PostgreSQL -- Data Result --> SpringBoot
    SpringBoot -- JSON Response --> Nginx
    Nginx -- Forward Response --> Browser

     Browser:::client
     Nginx:::proxy
     SpringBoot:::server
     PostgreSQL:::db
     User:::user
    classDef user fill:#f9f,stroke:#333,stroke-width:2px,color:black
    classDef client fill:#d1e7dd,stroke:#0f5132,stroke-width:2px,color:black
    classDef proxy fill:#fff3cd,stroke:#ffc107,stroke-width:2px,color:black
    classDef server fill:#cfe2ff,stroke:#084298,stroke-width:2px,color:black
    classDef db fill:#e2e3e5,stroke:#41464b,stroke-width:2px,color:black
```

</div>
</details>


<br>
<br>
<br>

## 3. ERD 설계

![게시판_erd](/images/board_erd.png)

- **핵심 엔티티**
    - `USERS`: 시스템의 주체
    - `CATEGORIES`: 게시글이 속하는 분류
    - `POSTS`: 사용자가 특정 카테고리에 작성하는 본문
- **소셜 및 상호작용 엔티티**
    - `POST_LIKES`: 사용자가 게시글을 좋아요를 누를 수 있음
    - `POST_FAVORITES`: 사용자가 게시글을 보관함에 저장
    - `CATEGORY_FAVORITES`: 사용자가 특정 카테고리를 구독하거나 즐겨찾기
    - `FOLLOWS`: 사용자 간의 관계
- **데이터 무결성**
    - `ON DELETE CASCADE`: 모든 연결 테이블(댓글, 좋아요, 팔로우 등)에 적용
    - 사용자를 삭제하면 그 사람이 쓴 글, 댓글, 좋아요 기록이 자동으로 모두 삭제

<br>
<br>
<br>

## 4. 개발 문서 정리

- [`README.md` >>]()
- [기능 요구사항 명세서 >>]()
- [REST API 명세서 >>]()
- [트러블 슈팅 기록 >>]()
- [학습 기록 >>]()

<br>
<br>
<br>

{{<series title="🍀 게시판 개발" series="board">}}

<br>
<br>
<br>
