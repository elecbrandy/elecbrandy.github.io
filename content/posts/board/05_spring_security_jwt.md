+++
title = '[게시판] Spring Security와 JWT token 인증 도입'
date = 2026-02-09
featured_image = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Spring_Boot.svg/330px-Spring_Boot.svg.png"
tags = ['skala','springboot','board']
+++

<br>

{{<series title="🍀 게시판 개발" series="board">}}

<br>

## 1. 소개

- register 기능을 만든후 로그인 기능 도입
- _세션 vs jwt_ → `jwt` 토큰 발급 방식
- Spring Security 와 함께 사용할 것

<br>
<br>
<br>

## 2. Spring Security

스프링에서 제공하는 인증과 권한 보안 관련 기능을 제공하는 프레임워크이다.

- **Authentication** (인증)
    - 신원 확인
    - id/pw 입력
- **Authorization** (인가)
    - 권한 확인 / 부여
    - 특정 리소스에 대한 특정 유저의 접근 권한
- **주요 구성 요소**
    - `Principal`
        - 보호된 리소스에 접근하는 대상 (사용자)
    - `SecurityContextHolder`
        - 현재 보안 컨텍스트의 세부 정보를 담고 있는 바구니
    - `Authentication`
        - 현재 사용자의 인증 정보를 담는 객체
    - `GrantedAuthority`
        - 사용자에게 부여된 권한
        - 예: ROLE_USER, ROLE_ADMIN

<br>
<br>
<br>

## 3. Spring Security 내부구조

Spring Security의 내부 구조는 서블릿 필터 체인이다. 
즉, 클라이언트 요청이 서블릿(controller)에 도달하기 전에 여러 개의 필터를 거치며 보안 검사를 수행한다. 또한 사용자는 이 필터를 커스텀해 사용할 수 있다.

- **주요 필터 구성 요소**
    - `DelegatingFilterProxy`
        - 서블릿 컨테이너와 스프링 컨테이너 사이의 다리 역할
    - `FilterChainProxy`
        - 여러 SecurityFilterChain을 관리하고 적절한 필터를 실행
    - `AuthenticationFilter`
        - 요청을 가로채서 인증을 시도합
        - 예: UsernamePasswordAuthenticationFilter
    - `AuthenticationManager`
        - 실제 인증 로직이 시작되는 곳
    - `AuthenticationProvider`
        - 실제 인증 로직(DB 대조, 외부 연동 등)을 수행
    - `UserDetailsService`
        - 사용자의 정보를 DB에서 가져오는 인터페이스

<br>
<br>
<br>

## 4. Spring Security with JWT

### 4-1. `Login`

<br>

#### 🔴 1번: Login 요청 (진입)

![spring-security-number](/images/spring/spring-security-0.png)

* **상황**
    * 사용자가 프론트엔드(웹/앱)에서 아이디와 비밀번호를 입력 후
    * **로그인 버튼**을 누름
* **데이터**
    * JSON 형태의 Body가 전달
    * `{"email": "user@test.com", "password": "1234"}`

<br>
<br>

#### 🔴 2번: Security Filter Chain

![spring-security-number](/images/spring/spring-security-1.png)

* `JwtAuthenticationFilter`
    * "어? 헤더에 토큰 없네?" (로그인 요청이니까 당연히 없음) -> **통과**
* `AuthorizationFilter`
    * `SecurityConfig`의 설정을 확인
    * `/api/auth/login` 주소는 `permitAll()`(모두 허용)이네?
        * **검문 없이 문 열어줌**
* 만약 로그인이 아닌 다른 요청이었다면 여기서 막힘

<br>
<br>

#### 🔴 3번: UserService

![spring-security-number](/images/spring/spring-security-2.png)


* `AuthController`
    * DTO(`LoginRequest`)를 검증(`@Valid`)
    * 이후 `UserService.login()`을 호출
* DB를 뒤지기 전에
    * 일단 유저가 보낸 이메일/비번만 가지고 임시신분증을 하나 부여
    * 코드: `new UsernamePasswordAuthenticationToken(email, password)`
    * 이 신분증에는 아직 인증 도장이 없음
* 이 신분증이 진짜인지 확인을 위해 AuthenticationManager로 이동

<br>
<br>

#### 🔴 4번: AuthenticationManager

![spring-security-number](/images/spring/spring-security-3.png)

* `UserDetailsService` 호출
    * 이 이메일 가진 사람 서류 가져와
* `PasswordEncoder`
    * 비밀번호 맞는지 확인해줘

<br>
<br>

#### 🔴 5번: 실질적 검증 및 인증 성공

![spring-security-number](/images/spring/spring-security-3.png)

* `UserDetailsService`
    * 유저 정보 조회
    * `UserRepository`를 통해 DB(`users` 테이블)를 조회
    * DB에 있는 데이터를 꺼내와서 `UserDetails`라는 포맷으로 포장해서 제공
* `Password Encoder`
    * 비밀번호 해독
    * 유저가 입력한 비밀번호와 DB에서 가져온 암호화된 비밀번호를 여기에 넣고 비교
    * `matches()` 메서드가 돌아가고 **"일치함!"** 판정
* `인증 성공 기록`
    * 검증이 끝나면 팀장은 **정식신분증** (`Authentication`) 발급
    * `SecurityContext` 에 정식 신분증을 잠시 저장
    * 이후 `UserService`로 돌아가서 실제 JWT 토큰 발급 받음

<br>
<br>

### 4-1. `Posting`

![spring-security-number](/images/spring/spring-security-posting-1.png)

<br>

#### 🔴 1번: Posting 요청

![spring-security-number](/images/spring/spring-security-posting-2.png)

* **상황**
    * 유저가 `POST /api/posts` 요청을 보냈을 때
    * 헤더에 JWT가 들어가 있는 상태
* **데이터**
    * JSON 형태의 Body
    * `Request Header: { Authorization: "Bearer eyJhb..." }`

<br>
<br>

#### 🔴 2번: Spring Security Filter

![spring-security-number](/images/spring/spring-security-posting-2.png)

1. **`JwtAuthenticationFilter` 의 토큰 검증**
    * 스프링 시큐리티의 문지기로, 가장 먼저 요청을 가로챔
    * 헤더에서 토큰 추출해서 `JwtTokenProvider`에게 토큰 유효한지 질문
2. **`Security Context` 에 신분증 저장**
    * 토큰을 기반으로 `Authentication` 객체를 만들어 저장
3. **`AuthorizationFilter` 의 규칙 확인**
    * 이 요청(`POST /api/posts`)은 `인증된 사람만 가능하네
    * 아까 저장한 `SecurityContextHolder` 를 열어볼게
    * 신분증 _Authentication_ 이 들어있네? 통과!

<br>
<br>

#### 🔴 3번: Spring boot 로직

![spring-security-number](/images/spring/spring-security-posting-3.png)

* `DispatcherServlet`
    * URL을 보고 `PostController`의 `write()` 메서드를 호출
* `PostService`
    * 컨트롤러가 `service.write(dto)`를 호출
    * 그런데 DTO에는 제목과 내용만 있고 누가 썼는지가 없습...
* 정보를 가져오자!
    * 아까 저장한 `SecurityContextHolder` 를 열어볼게
    * 조회 완료
<br>
<br>

#### 정리

유저가 보낸 토큰은

- **필터(1단계)** 에서 **신분증(`Authentication`)** 으로 변환
- **금고(`SecurityContext`)** 에 저장되고,
- 이후 **서비스(4단계)** 가 그 금고를 열어서 사용
- 이 구조 덕분에 컨트롤러나 서비스 메서드에 매번 토큰을 파라미터로 넘길 필요가 없음

<br>
<br>
<br>

## 5. Reference
- https://velog.io/@dhkim1522/SpringSecurity-JWT-%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84
- https://inkyu-yoon.github.io/docs/Language/SpringBoot/SpringSecurityJoin

<br>
<br>
<br>
