+++
title = 'JWT'
date = 2026-02-08
featured_image = "https://tecoble.techcourse.co.kr/static/408d754c1376bb22579b82422d439f83/00419/jwt.avif"
tags = ['dev101','spring']
+++

<br>

## 1. JWT의 정의와 특징

- **`JSON Web Token`**

JWT는 당사자 간에 정보를 JSON 객체로 안전하게 전송하기 위한 표준이다.
웹에서 인증과 권한 부여를 구현할 때 가장 널리 사용되는 수단 중 하나이다.
토큰 자체가 사용자의 권한 정보나 서비스 상태를 포함하고 있어, 이를 수신하는 서버는 별도의 데이터베이스 조회 없이도 토큰 내의 정보만으로 요청을 처리할 수 있다.

<br>
<br>
<br>

## 2. JWT의 구조

- **`header`.`payload`.`signature`**

JWT는 마침표(`.`)를 구분자로 하여 세 가지 부분으로 나뉜다. 각 부분은 `Base64Url` 방식으로 인코딩되어 하나의 문자열을 형성한다.

<br>

### 2-1. Header

헤더는 토큰에 대한 메타데이터를 담고 있다. 일반적으로 두 가지 정보를 포함한다.

``` json

{
    "alg": "HS256",
    "typ": "JWT"
}
```

* `alg`: 서명 시 사용된 해싱 알고리즘 (예: HS256, RS256)
* `typ`: 토큰의 유형 (JWT)

<br>

### 2-2. Payload (페이로드)


페이로드에는 전달하고자 하는 실제 정보인 `Claim` 이 포함된다. 

``` json
{
    "name": "Hong",
    "email": "Hong@example.com",
}
```

_`Claim` 은 크게 세 가지 종류로 구분_


* **등록된 `Claims`**
    * 토큰의 제어를 위해 이름이 이미 정의된 속성
    * `iss`(발행자), `exp`(만료 시간), `sub`(제목), `iat`(발행 시간) 등
* **공개 `Claims`**
    * 사용자 정의 클레임으로, 충돌을 방지하기 위해 URI 형식의 이름을 사용
* **비공개 `Claims`**
    * 서버와 클라이언트 간의 협의 하에 사용되는 사용자 정의 데이터
* **주의 사항**
    * 페이로드는 암호화되는 것이 아니라 `Base64Url` 로 단순 인코딩됨
    * 즉, 누구나 디코딩하여 내용을 확인할 수 있으므로, 비밀번호나 개인정보와 같은 민감한 데이터는 절대 포함해서는 안 됨

<br>

### 2-3. Signature

Signature 는 토큰의 무결성을 증명하는 핵심 부분이다. 인코딩된 헤더와 페이로드를 합친 뒤, 서버가 안전하게 보관 중인 `Secret Key` 를 사용하여 헤더에 명시된 알고리즘으로 해싱한다. 이를 통해 서버는 전달받은 토큰이 위변조되지 않았음을 검증할 수 있다.

<br>
<br>
<br>

## 3. 인증 방식의 변화: 세션 기반 vs 토큰 기반

로그인 상태를 유지하는 방식은 서버의 상태 저장 여부에 따라 크게 두 가지로 나뉜다.

<br>

### 3-1. Stateful → `세션`

전통적인 세션 방식은 서버가 사용자의 상태를 메모리나 데이터베이스에 유지한다.

* **장점**
    * 서버가 세션을 직접 관리하므로 특정 세션을 강제로 만료시키는 등 제어가 용이
* **단점:**
    * 사용자가 늘어날수록 서버의 메모리 부담이 커짐
    * 여러 대의 서버를 운영하는 분산 환경에서는 세션 동기화 문제 발생 가능

<br>

### 3-2. Stateless → `JWT`

JWT는 서버가 상태를 저장하지 않는 Stateless 아키텍처를 지향한다.

* **장점**
    * 서버는 토큰의 서명만 검증하면 되므로 데이터베이스 조회가 줄어들고 부하를 분산
    * MSA 환경에서 각 서비스가 독립적으로 인증을 처리하기에 매우 적합
* **단점**
    * 한 번 발급된 토큰은 유효기간이 만료되기 전까지 서버에서 제어하기 어려움
    * 토큰의 길이가 길어질수록 네트워크 트래픽에 영향을 줄 수 있음

| 구분 | 세션/쿠키 방식 | JWT 방식 |
| --- | --- | --- |
| **저장 위치** | 서버(Memory/DB) 및 클라이언트 쿠키 | 클라이언트 (Local Storage/Cookie) |
| **확장성** | 낮음 (세션 동기화 필요) | 높음 (어느 서버에서나 검증 가능) |
| **보안성** | 세션 ID 탈취 시 위험하지만 서버 제어 가능 | 토큰 탈취 시 만료 전까지 무방비 상태 |

<br>
<br>

## 4. 보안 강화를 위한 Access & Refresh Token

- JWT의 치명적인 단점인 `탈취 시 제어 불가능` 문제를 해결할 수 있을까?

이를 위해 `Access Token` 과 `Refresh Token` 을 병행하는 전략이 사용된다. 이 방식을 통해 사용자는 빈번한 로그인 없이 서비스를 이용할 수 있으며, 서버는 `Refresh Token` 을 검증하거나 차단함으로써 사용자의 접속을 제어할 수 있는 수단을 갖게 된다. 최근에는 보안성을 더 높이기 위해 `Refresh Token` 을 한 번 사용하면 폐기하고 재발급하는 방법도 사용하고 있다.

* **Access Token**
    * 실제 권한 확인에 사용되는 토큰
    * 유효기간을 매우 짧게(예: 30분) 설정하여 탈취 시의 피해를 최소화
* **Refresh Token**
    * Access Token이 만료되었을 때 새로운 Access Token을 발급받기 위한 용도로 사용
    * 유효기간을 길게(예: 2주) 설정하며, 서버의 데이터베이스에 저장하여 관리

<br>
<br>
<br>

## 5. JWT와 쿠키

쿠키와 JWT는 사실 완전히 상이한 개념이다.

- **쿠키**
    - 브라우저가 가지고 있는 작은 메모장
    - 뭐든 저장 가능
    - 브라우저가 자동으로 서버에 보여줌
- **JWT**
    - 사용자 인증 정보를 담은 내용물
    - 어딘가에 보관해야함

<br>
<br>
<br>

## 6. JWT 토큰 보관 장소?

그렇다면 클라이언트에서 토큰을 어디에 저장하는게 좋을까?
브라우저의 로컬 스토리지에 담을 수도 있고, 쿠키에 담아 보관할 수도 있다.

<br>

### 6-1. Local Storage

``` json

// HTTP 응답
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "eyJhbGci...",
  "username": "hong"
}

```

JWT 토큰을 로컬 스토리지에 보관하기 위해서는, 백엔드가 Response Body에 토큰을 담아보내면 된다.
그러면 프론트에서 토큰을 받아 로컬스토리지에 저장하면 된다.

<br>
<br>

### 6-2. Cookie

``` java
// 백엔드 (Cookie 방식)
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request, 
                                HttpServletResponse response) {
    // 인증 처리
    String token = jwtTokenProvider.createToken(username);

    // 쿠키로 토큰 전달
    Cookie cookie = new Cookie("jwt", token);  // 쿠키에 담아서 줌
    cookie.setHttpOnly(true);   // JS 접근 차단
    cookie.setSecure(true);     // HTTPS만
    cookie.setMaxAge(3600);     // 1시간
    cookie.setPath("/");
    response.addCookie(cookie);

    return ResponseEntity.ok(new LoginResponse("로그인 성공"));
}
```

JWT 토큰을 쿠키에 저장하기 위해서는 백엔드에서 보낼 때 `Cookie` 객체에 담아서 보내면 된다.
보안을 위한 몇가지 설정을 하고 쿠키 객체에 담아서 보내면 프론트에서 추가작업 없이 자동적으로 브라우저의 쿠키영역에 토큰이 저장된다.

<br>
<br>

### 6-3. 보관 방법 선택

그래서 어디에 저장하는게 좋을까?

#### 차이점 정리

| 구분 | Local Storage | HttpOnly Cookie |
| --- | --- | --- |
| XSS 공격 | 취약 (JS 접근 가능) | 안전 (HttpOnly시 JS 접근 불가) |
| CSRF 공격 | 안전 | 취약 (자동 요청) |
| 용량 제한 | 약 5MB | 약 4KB |

<br>

#### Local Storage를 선택하는 경우
- 장점
    - 구현이 직관적이고, CSRF 방어 로직을 따로 짤 필요가 없음
    - 모바일 앱과 웹을 동시에 운영할 때 로직이 비슷해서 편함
- 단점
    - XSS 공격에 매우 취약
    - 공격자가 내 사이트에 악성 스크립트를 심는 순간 사용자의 모든 토큰이 탈취 가능

#### Cookie (HttpOnly & Secure)를 선택하는 경우
- 장점
    - HttpOnly 플래그를 쓰면 XSS 공격으로 토큰 탈취 불가
- 단점
    - CSRF 공격을 막기 위해 SameSite 설정 필요
    - 또한 CSRF 토큰을 별도로 관리 필요

#### 요즘 어떤걸 쓰나 보니까
- Access Token
    - 아주 짧은 수명(15분~1시간)으로 설정
    - Local Storage 혹은 **변수(Memory)** 에 저장.
- Refresh Token
    - 긴 수명(7일~14일)으로 설정
    - HttpOnly, Secure, SameSite=Strict 옵션이 적용된 Cookie에 저장

> 이렇게 하면 XSS로 Access Token이 털려도 금방 만료되어 피해가 적고, 핵심인 Refresh Token은 자바스크립트가 접근할 수 없어 안전하게 보호 가능!

<br>
<br>
<br>

## 7. Spring의 몫 vs 개발자의 몫

### 7-1. Spring Security에서 제공하는 것

- `Filter Chain`
    - 요청을 가로채서 검사할 수 있는 검문소 구조
    - 개발자가 커스텀 필터를 만들기만 하면 끼울 수 있는 슬롯 제공
- `SecurityContext`
    - _현재 로그인한 사람이 누구냐?_ 를 저장하는 전역 저장소
    - 개발자가 검증된 유저 정보를 여기에 넣어주기만 하면, 컨트롤러 어디서든 꺼내 쓸 수 있게 관리
- `Authorization`
    - 접근 제어
    - _이 URL은 로그인한 사람만", "저 URL은 관리자만_ 같은 규칙을 설정(SecurityConfig)
    - 설정하면 알아서 막아줌
- `BCryptPasswordEncoder`
    - 강력한 암호화 도구를 제공
    - 비밀번호 암호화 등에 사용 가능

<br>

### 7-2. 개발자가 만들어야 하는 것

- `JwtTokenProvider`
    - 토큰 생성기 & 검증기
    - Spring은 JWT라는 문자열을 어떻게 사용하는지 모름
    - 외부 라이브러리(jjwt)를 써서 토큰 생성, 만료 확인, 위조 확인 하는 코드는 개발자가 짜야함
- `JwtAuthenticationFilter`
    - 인증 필터
    - Spring은 요청이 들어올 때 헤더(Header)를 자동으로 뒤져서 토큰을 찾지 않음
    - 개발자가 임의로
        - _헤더에서 Authorization 꺼내서,_
        - _JwtTokenProvider한테 검사 맡기고,_
        - _통과하면 SecurityContext에 넣어라_
        - 라는 로직을 작성해야 함
- `UserDetailsService`
    - 신원 조회 시스템
    - Spring Security는 우리 DB의 users 테이블이 어떻게 생겼는지 모름
    - UserSerivce 로직과 함께 쓰기도 하나, 순환참조 조심하기
- `AuthService`
    - 토큰 발급 창구
    - 사용자가 아이디/비번을 보냈을 때
        - DB와 비교하고,
        - 맞으면 JwtTokenProvider을 시켜서 토큰을 리턴해주는 서비스 로직

<br>
<br>
<br>

## 8. 결론

#### JWT란?

- 사용자 정보를 안전하게 담아서 서버-클라이언트 간에 주고받을 수 있는 암호화 신분증

<br>

#### JWT vs Session 인증

- `JWT` 인증
    - 서버는 아무것도 저장 안 하고, 사용자가 신분증을 직접 들고 다니며 매번 보여줌
- `Session` 인증
    - 서버가 로그인 정보를 메모리에 저장하고, 브라우저는 번호표(Session ID)만 들고 다님

<br>

#### Spring에서 JWT 사용 전개

``` bash
// 로그인
POST /login → 토큰 생성 → "eyJhbG..." 반환

// 이후 요청  
GET /api/posts + Header(토큰) → Filter에서 검증 → Controller
```

<br>
<br>
<br>

## 9. Reference

- https://tecoble.techcourse.co.kr/post/2021-05-22-cookie-session-jwt/
- https://www.youtube.com/watch?v=36lpDzQzVXs

<br>
<br>
<br>
