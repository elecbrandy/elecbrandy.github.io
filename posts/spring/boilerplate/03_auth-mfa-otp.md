+++
title = 'Spring Boot Boilerplate'
date = 2026-02-04
featured_image = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Spring_Boot.svg/330px-Spring_Boot.svg.png"
tags = ['skala','spring']
draft= true
+++

{{<series title="🍀 Spring Boot Boilerplate" series="boilerplate">}}

<br>

## 1. 프로젝트 소개

- Spring Boot Boilerplate
- 기본적인 인증 세션을 구현하고, 브랜치 별로 다양한 기능을 분기
- 외부 DB 컨테이너와 연결

<br>
<br>
<br>

## 2. 기능 분기

- **`auth-jwt-redis`**
    - Access Token + Refresh Token 전략
    - Redis 활용 -> Refresh Token을 저장하여 보안성 강화
- **`auth-oauth-jwt`**
    - Google, Kakao, Naver 등의 OAuth2 공급자와 연동
    - 최초 소셜 인증은 OAuth2 프로토콜 사용
    - 이후 서비스 내부에서 JWT 발급하여 Stateless 구조 유지
- **`auth-mfa-otp`**
    - 추가로 OTP 검증 도입

<br>
<br>
<br>

## 3. 개발 문서 정리

- [`auth-jwt-redis` >> 바로가기]()
- [`auth-oauth-jwt` >> 바로가기]()
- [`auth-mfa-otp` >> 바로가기]()

<br>
<br>
<br>

{{<series title="🍀 Spring Boot Boilerplate" series="boilerplate">}}

<br>
<br>
<br>
