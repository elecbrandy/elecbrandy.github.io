+++
title = 'FT_TRANSCENDENCE'
date = '2025-05-06'
featured_image = 'https://t1.daumcdn.net/contentshub/movie/e58513a6c8c15b66214931aa69a064d66d75df50954d274973f9cb732e0d62b9'
+++

<br>

## 📌 Overview

> 42Seoul 웹 기반 Pong 게임 서비스 프로젝트

- `ft_transcendence`는 브라우저에서 Pong 게임을 플레이하고, 사용자 기록을 관리할 수 있는 웹 서비스입니다.
- 프론트엔드는 정적 SPA 구조로 로그인, 회원가입, OTP 인증, OAuth callback, 프로필, 친구, 설정, 토너먼트, Three.js 기반 Pong 게임 화면을 제공합니다.

| 항목 | 내용 |
|---|---|
| 스택 | `JavaScript` `Django` `PostgreSQL` `Three.js` |
| 팀 | 5인 |
| 담당 | Frontend |


- **주요 업무**
    - hash 기반 SPA 라우터 구성
    - 로그인, 회원가입, OTP 인증, OAuth callback 화면 구현
    - 프로필, 전적, 친구, 설정 UI 구현
    - 개인정보 설정, username/password 변경, 계정 탈퇴 모달 구성
    - 게임 옵션, 토너먼트 대진표, Pong 플레이 화면 구현
    - Three.js 기반 Pong 게임 렌더링 및 키 입력 처리
    - `sessionStorage` 기반 토너먼트 진행 상태 관리
    - 다국어 UI 전환 구조 구성

<br>
<br>

## 🧩 Core features

- **Hash Router**: `#login`, `#profile`, `#gameplay/option`, `#gameplay/tournament`, `#gameplay/play-<id>` 기반 SPA 라우팅
- **인증 화면**: 로그인, 회원가입, OTP 인증, 42 Intra OAuth callback 처리
- **Tournament**: 플레이어 목록 기반 대진표 생성, 현재 경기 저장, 라운드 진행
- **Pong Game**: Three.js 기반 3D Pong 게임, 점수판, 카운트다운, 승자 표시
- **Match Result**: 로그인 유저의 경기 결과를 백엔드 API로 전송
- **i18n**: `en`, `ko`, `fn` 언어 데이터 기반 UI 텍스트 전환

<br>
<br>

## 🏗️ System Architecture

![architecture](https://github.com/elecbrandy/ft_transcendence/raw/master/img/ts_arch.png)

<br>

- 프론트엔드는 nginx 컨테이너에서 정적 파일로 서빙됩니다.
- `index.html`이 공통 진입점이며, `router.js`가 URL hash를 기준으로 페이지 컴포넌트를 렌더링합니다.
- API 요청은 `https://localhost/api/...` 경로로 전송되고, nginx가 backend 컨테이너로 reverse proxy합니다.
- 인증 상태는 HttpOnly Secure Cookie 기반 JWT를 백엔드 API로 확인합니다.
- 토너먼트 진행 상태와 게임 옵션은 `sessionStorage`에 저장합니다.
- Pong 게임 화면은 Three.js CDN을 로드한 뒤 canvas를 생성해 렌더링합니다.

<br>
<br>

## 🚨 Key Decisions & Troubleshooting

#### hash 기반 SPA 라우팅 구조

- **상황**
    - 별도 프론트엔드 프레임워크 없이 여러 화면을 하나의 정적 SPA로 구성해야 했음
- **구조**
    - `router.js`에서 `window.location.hash`를 읽어 route key로 변환
    - route key에 따라 Login, Signup, Profile, Game Option, Tournament, Game Play 페이지 렌더러 호출
    - 페이지가 문자열을 반환하면 `innerHTML`, DOM element를 반환하면 `replaceChildren()`으로 렌더링
- **처리**
    - hash가 없으면 로그인 화면으로 이동
    - 존재하지 않는 route는 404 화면 렌더링
    - OAuth callback은 `/oauth-callback/` 경로를 hash route로 변환해 처리
    - 게임 플레이 route는 `gameplay/play-<id>` 형식으로 동적 처리

<br>

#### 보호 라우트와 토너먼트 세션 검증

- **상황**
    - 로그인하지 않은 사용자가 프로필/게임 화면에 접근하지 못하게 해야 했음
    - 토너먼트 진행 중 잘못된 URL 접근이나 이미 종료된 경기 재진입을 막아야 했음
- **구조**
    - `isProtectedRoute()`로 보호 대상 route 구분
    - `checkCookie()`로 JWT 쿠키 상태 확인
    - `sessionStorage`에 `tournament_in_progress`, `game_option`, `playerList`, `matches`, `currentMatch`, `finishedGames` 저장
- **처리**
    - 보호 route 접근 시 토큰이 없으면 로그인 화면으로 redirect
    - 토너먼트 route 접근 시 `validateTournamentSession()`으로 player list, game option, match data 검증
    - 현재 match id와 URL의 `play-<id>`가 다르면 접근 차단
    - 종료된 경기 id는 `finishedGames`에 저장해 재진입 방지
    - 토너먼트 중 다른 페이지로 이동하려 하면 confirm으로 진행 종료 여부 확인

<br>

#### Three.js 기반 Pong 게임 구현

- **상황**
    - 브라우저에서 실행되는 Pong 게임 화면과 플레이 로직이 필요했음
- **구조**
    - `GamePlayPage`에서 Three.js CDN을 동적으로 로드
    - `initializePingPongGame()`에서 scene, camera, renderer, paddle, ball, obstacle 생성
    - 게임 옵션은 `sessionStorage`의 `game_option`을 읽어 공 속도, 패들 크기, 장애물 수에 반영
- **처리**
    - `requestAnimationFrame()`으로 게임 루프 실행
    - `W/S`, `I/K` 키 입력으로 양쪽 paddle 이동
    - 공과 벽, paddle, obstacle 충돌 처리
    - 득점 시 3초 countdown 후 공 위치 초기화
    - 7점 도달 시 승자 표시 및 토너먼트 화면 복귀 버튼 제공
    - 페이지 이탈 시 `cleanup()`에서 animation frame과 keyboard listener 제거

<br>
<br>

## 🔗 Link

- [GitHub Repo >>](https://github.com/elecbrandy/ft_transcendence)

<br>
<br>
