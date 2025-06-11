+++
title = '[project] 전자책 검색 서비스 개발일지'
date = 2025-
featured_image = "http://t1.daumcdn.net/movie/3b7d03c8bcca1e76bbd1882f188e92169883eead"
tags = ['docker', 'spring', 'react', 'mariadb']
draft = true
+++

{{<series title="📚 /ebook" series="ebook">}}

<br>

## 1. 소개
____
우선 책 datafmf

전자책을 읽다 보면 밀리의 서재나 특정 구독 서비스에서 제공하지 않는 책이 많아 불편함을 느꼈다. 다행히 대학 도서관, 서울시 전자책 도서관, 소상공인 전자책 도서관 등을 통해 부족한 책들을 보완할 수 있었지만, 원하는 책이 없는 경우가 많았고, 여러 곳을 직접 검색해야 하는 불편함이 컸다.

이를 해소하려 통합 검색 서비스를 찾아보았지만, 기존 사이트들은 느린 속도와 불안정한 접속, 직관적이지 않은 UI 때문에 불편했다. 42서울 과정을 마무리하며, 직접 통합 전자책 검색 서비스를 개발하기로 결심했다.  

<br>
<br>

## 2. 프로젝트 설계
____
이 프로젝트는 공공기관 등의 전자책 사이트에서 서적 정보를 크롤링하고, 사용자가 검색하면 대여 가능한 곳을 알려주는 서비스다. 목표는 **완전 자동화 시스템 구축**이며, 주기적인 자동 크롤링을 통해 최신 데이터를 유지할 계획이다.  

<br>

### 기술 스택
- **웹 스크래핑**: Playwright
- **데이터베이스**: MariaDB
- **백엔드**: Spring Boot
- **프론트엔드**: React
- **리버스 프록시 및 배포**: Nginx
- **자동화 및 배포**: Docker, Docker Compose, GitHub Actions (CI/CD)

- 42서울 과정을 통해 익숙한 구조다.
- Docker로 일관된 개발, 테스트, 배포 환경 유지 가능하다.
- CI/CD로 코드 변경 사항 자동 배포와 신속한 롤백을 지원한다.
- 서비스별 독립 컨테이너 운영으로 관리가 용이하다.

<br>

### 프로젝트 폴더 구조

``` bash
e-book-search/
├── Makefile                # 개발 자동화 명령어
├── .gitignore              # Git 제외 파일
├── docker-compose.yml      # 서비스 컨테이너 구성
├── srcs/
│   ├── backend/            # Spring Boot 백엔드
│   ├── frontend/           # React 프론트엔드
│   ├── crawler/            # Playwright 크롤러
│   └── nginx/              # Nginx 설정
├── db/                     # 데이터베이스 설정
├── scripts/                # 자동화 및 배포 스크립트
└── .github/                # CI/CD 설정
```

### 주요 개발 과정

1. **스크랩퍼 개발 (Playwright)**
   * 빠르고 안정적인 데이터 수집 및 DB 저장

2. **Docker Compose 및 Makefile 구성**
   * 각 서비스를 독립적인 컨테이너로 운영
   * 간편한 명령어로 개발 환경 관리

3. **백엔드 API 개발 (Spring Boot + JPA)**
   * 효율적인 데이터 조회 API 구축

4. **프론트엔드 개발 (React)**
   * 직관적인 검색 UI 및 백엔드 API 연동

5. **Nginx 리버스 프록시 설정**
   * 서비스 트래픽 관리 및 성능 향상

6. **크롤링 자동화 및 배포 (CI/CD)**
   * GitHub Actions로 자동화된 테스트 및 배포
   * 크롤링 주기적 자동화 실행 (월 1회)

<br>
<br>

## 3. Reference
- empty
