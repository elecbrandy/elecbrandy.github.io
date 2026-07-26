+++
title = 'Spring Boot: auth-jwt'
date = 2026-02-09
featured_image = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Spring_Boot.svg/330px-Spring_Boot.svg.png"
tags = ['skala','spring']
+++

{{<series title="🍀 Spring Boot Boilerplate" series="boilerplate">}}

<br>

## 1. 소개

- Spring Boot Boilerplate
- **`auth-jwt-redis`**
    - Access Token + Refresh Token 전략
    - Redis 활용 -> Refresh Token을 저장하여 보안성 강화

<br>
<br>
<br>

## 2. ERD 구조

![erd](/images/spring/boilerplate/0.png)

<br>
<br>
<br>


## 3. RestAPI

- `/api/auth/register` : 회원가입
- `/api/auth/login` : 로그인
- `/api/auth/logout` : 로그아웃
- `/api/auth/reissue` : 토큰재발급

<br>
<br>
<br>


## 4. `/api/auth/login`

![login](/images/spring/boilerplate/1.png)

_전체 구조_

<br>
<br>

#### 로그인 요청과 Security Filter Chain 진입

![login](/images/spring/boilerplate/2.png)

1. **Login 요청**
    - `POST /api/auth/login` 요청
    - `{"email": "user@test.com", "password": "1234"}`
2. **Security Filter**
    - 로그인 요청은 반드시 _Spring Security FilterChain_ 을 거친다
    - **`JwtAuthenticationFilter`**
        - _resolveToken(request)_ 를 실행해 쿠키나 헤더에 토큰이 있는지 찾는다
        - 로그인 시점에는 토큰이 없으므로 _token == null_
        - 따라서 조용히 다음 필터로 이동한다
    - **`AuthorizationFilter`**
        - 이 요청이 권한이 필요한가? 를 확인한다
        - _SecurityConfig_ 의 _permitAll()_ 설정에 의해 로그인 요청은 인증 객체 없어도 통과된다

<br>
<br>

#### Controller와 Service 진입

![login](/images/spring/boilerplate/3.png)

3. **AuthController 진입**
    - `@Valid` 를 통해 Request의 형식이 맞는지 검사한다
    - 통과하면 userService를 호출한다
4. **UserService 진입**
    - 사용자가 입력한 이메일 + 평문 비밀번호를 담은 임시 인증용 토근을 발급한다
    - 임시 토큰: `UsernamePasswordAuthenticationToken`
    - 이 토큰을 `AuthenticationManager` 에게 던진다
    - _이 사람 진짜 유저인지 너가 검증해줘!_

<br>
<br>

#### Spring Security 핵심 인증 처리

![login](/images/spring/boilerplate/4.png)

5. **AuthenticationManager**
    - `UserService` 에게 받은 요청을 어떤 Provider에게 위임할지 결정한다
    - ... 살펴보다가 `AuthenticationProvider` 에게 위임!
6. **CustomUserDetailService ↭ UserRepository ↭ DB**
    - `AuthenticationProvider` 는 유저 검증을 위해서 DB에 있는 실제 유저 정보가 필요하다. 그러나 스스로 가져올 수 없으므로...
    - `CustomUserDetailService`를 호출해 DB에 있는 유저 정보를 가져온다
7. **다시 AuthenticationProvider**
    - DB에서 가져온 정보와 사용자 입력 정보를 비교한다
    - 일치하는 경우 인증 성공!

<br>
<br>

#### 토큰 발급 및 응답 마무리

![login](/images/spring/boilerplate/5.png)

8. **UserService**
    - 인증 성공하여 돌아온 완성된 토큰을 `JwtTokenProvider` 에게 넘긴다
9. **JwtTokenProvider**
    - `generateToken()` 으로 _AccessToken, RefreshToken_ 을 생성한다
10. **UserService ↭ RefreshTokenRepository**
    - 생성된 `RefreshToken` 을 DB에 저장한다
    - 저장 과정에서 현재 이메일로 저장된 토큰이 설정값을 넘으면 가장 오래된 것을 삭제한다
11. **다시 AuthController**
    - `setTokenCookies()` 으로  _Access/Refresh Token_ 을 각각 HttpOnly 쿠키로 세팅한다
    - 최종적으로 클라이언트에게 `200 OK` 와 `로그인 성공` 메세지를 담은 `JSON(ApiResponse)` 을 반환한다

## 5. Reference
- https://velog.io/@dhkim1522/SpringSecurity-JWT-%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84
- https://inkyu-yoon.github.io/docs/Language/SpringBoot/SpringSecurityJoin

<br>
<br>
<br>
