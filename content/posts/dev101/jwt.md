+++
title = 'JWT'
date = 2026-02-08
featured_image = "https://tecoble.techcourse.co.kr/static/408d754c1376bb22579b82422d439f83/00419/jwt.avif"
tags = ['dev101','springboot']
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

### 3-1. Stateful → `세션/쿠키`

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

## 5. 안전한 토큰 보관소?

- 그렇다면 클라이언트에서 토큰을 어디에 저장하는게 좋을까?
    - **`Local Storage` vs `Cookie` ?**
    - **HttpOnly와 Secure 옵션이 적용된 쿠키 사용을 권장**

| 구분 | Local Storage | HttpOnly Cookie |
| --- | --- | --- |
| **주요 위협** | XSS 취약 | CSRF 취약 |
| **접근성** | JS로 접근 👍 | JS로 접근 👎 (HttpOnly 설정 시) |
| **난이도** | 구현 간단 | 구현 복잡 |
| **결론** | 보안 수준 낮음 | 보안 수준 더 높음 |

* **HttpOnly**
    * 브라우저에서 자바스크립트가 쿠키에 접근하는 것을 원천 봉쇄
    * 이를 통해 해커가 악성 스크립트를 심어 토큰을 훔쳐가는 **XSS 공격**을 막을 수 있음
* **Secure & SameSite**
    * HTTPS 환경에서만 전송되도록 하고, 다른 도메인에서의 비정상적인 요청인 **CSRF 공격**을 차단
* **이중화 전략**
    * Access Token은 메모리나 로컬 스토리지에 둘 수 있으나...
    * 토큰을 재발급하는 핵심 열쇠인 **Refresh Token** 은 반드시 보안 쿠키에 담아 서버에서 관리

<br>
<br>
<br>


## 6. Spring Security 와 JWT

Spring Security 상에서 JWT를 사용할 때 내부적으로 어떤 일이 일어나는지 공부해보자.

<br>

### 6-1. Spring 내부 전개

``` bash
# == 전체 흐름 ==
사용자 요청
    ↓
① Tomcat (웹 서버)
    ↓
② DispatcherServlet (Spring MVC 입구)
    ↓
③ Spring Security Filter Chain (여기서 JWT 검증!)
    ↓
④ Controller (우리가 만든 코드)
```

<br>

#### ① Tomcat이 요청을 

``` bash
사용자가 보낸 HTTP 요청:
┌─────────────────────────────────────┐
│ POST /api/posts HTTP/1.1            │
│ Authorization: Bearer eyJhbGc...    │  ← JWT 토큰!
│                                     │
│ { "title": "안녕하세요" }              │    
└─────────────────────────────────────┘

```

<br>

#### ② DispatcherServlet으로 전달

* **DispatcherServlet**
    * `어떤 Controller로 보내야 하지?`
    * `URL이 /api/posts 니까... PostController로 보내야겠다!`
    * `하지만 잠깐! 보내기 전에 Filter들을 먼저 통과시켜야 해!`

<br>

#### ③ Spring Security Filter Chain

- 여기서 JWT 검증이 일어남!
- Filter Chain은 여러 개의 필터가 체인처럼 연결된 구조
    - `[Filter 1: CORS 필터]`
    - `[Filter 2: JWT 인증 필터]`
    - `[Filter 3: 권한 체크 필터]`
    - 이후 컨트롤러로...

<br>

### 6-2. 성공 / 실패 케이스

#### 인증 성공 케이스

``` bash

[0ms] 사용자 요청 도착
      POST /api/posts
      Authorization: Bearer eyJhbG...

[1ms] Tomcat이 받음
      → DispatcherServlet으로 전달

[2ms] DispatcherServlet
      "Controller 찾기 전에 Filter 먼저!"

[3ms] CORS 필터 통과
      "다른 도메인 요청이네? 허용할까? OK!"

[4ms] JWT 필터
      ├─ [4.1ms] 헤더에서 토큰 추출
      ├─ [4.2ms] 서명 검증 (암호화 연산)
      ├─ [4.3ms] 만료시간 확인
      ├─ [4.4ms] Payload에서 userId, role 추출
      └─ [4.5ms] SecurityContext에 저장
      
[5ms] 권한 체크 필터
      "ROLE_USER 권한 있네? 통과!"

[6ms] Controller 도착!
      PostController.createPost() 실행

[10ms] 응답 반환
    {
        "id": 1, "title": "안녕하세요"
    }
```

<br>

#### 실패케이스

``` bash
# == 토큰이 없는 경우 ==

요청: POST /api/posts
헤더: Authorization 없음

[JWT 필터]
→ "토큰이 없네? 그냥 통과" (인증 안 된 상태로)

[권한 체크 필터]  
→ "이 API는 로그인 필요한데 인증 안 됐네?"
→ 401 Unauthorized 응답

Controller에 도달 못함!
```

<br>

``` bash
# == 토큰이 만료된 경우 ==

요청: POST /api/posts
헤더: Authorization: Bearer (만료된토큰)

[JWT 필터]
→ 토큰 검증 중...
→ 만료시간 확인: 2024-02-08 14:00 < 현재 15:00
→ ExpiredJwtException 발생!
→ 401 응답: "토큰이 만료되었습니다"

Controller에 도달 못함!
```

<br>

``` bash
# == 토큰이 위조된 경우 ==

요청: POST /api/posts  
헤더: Authorization: Bearer (해커가조작한토큰)

[JWT 필터]
→ 서명 검증 중...
→ 계산된 서명 ≠ 토큰의 서명
→ JwtException 발생!
→ 401 응답: "유효하지 않은 토큰입니다"

Controller에 도달 못함!
```

<br>

#### 결국 핵심은

1. **필터에서 JWT를 검증** 하고
2. **SecurityContext에 인증 정보를 저장** 하면
3. **Controller에서 자유롭게 사용자 정보를 쓸 수** 있음!

<br>
<br>
<br>

## 7. 정리

#### JWT란?

- 사용자 정보를 안전하게 담아서 서버-클라이언트 간에 주고받을 수 있는 암호화 신분증

<br>

#### JWT vs Cookie

- `JWT`
    - 서버는 아무것도 저장 안 하고, 사용자가 신분증을 직접 들고 다니며 매번 보여줌
- `Cookie`
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

#### Spring에 JWT 도입 시 만들어야 하는 것

- `JwtTokenProvider` → 토큰 생성/검증
- `JwtAuthenticationFilter` → 요청마다 토큰 체크
- `SecurityConfig` → 필터 등록

<br>
<br>
<br>

## 8. Reference

- https://tecoble.techcourse.co.kr/post/2021-05-22-cookie-session-jwt/
- https://www.youtube.com/watch?v=36lpDzQzVXs

<br>
<br>
<br>