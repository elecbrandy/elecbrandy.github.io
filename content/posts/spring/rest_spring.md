+++
title = 'Spring Boot REST API 요청 처리 과정'
date = 2026-01-28
tags = ['springboot']
+++

> 정리중

<br>

## 1. 개요

웹 애플리케이션의 핵심은 클라이언트의 요청을 받아 적절한 응답을 내보내는 과정에 있다. 스프링 부트(Spring Boot) 환경에서 하나의 REST API 요청이 들어왔을 때, 인프라 계층부터 비즈니스 로직을 거쳐 다시 응답으로 나아가기까지의 내부 동작 원리를 정리한다.

<br>
<br>
<br>


## 2. 인프라 계층: 요청 수신 및 커넥션 처리

### Nginx (Reverse Proxy)

클라이언트의 HTTP 요청은 가장 먼저 외부망과 맞닿아 있는 리버스 프록시 서버인 **Nginx**에 도달한다. Nginx는 보안과 효율성 측면에서 중요한 역할을 수행한다.

* **SSL Termination**: HTTPS 요청의 경우 Nginx에서 복호화 과정을 거쳐 내부망에는 HTTP로 전달함으로써 애플리케이션 서버의 연산 부담을 줄인다.
* **Buffering**: 클라이언트의 네트워크 속도가 느릴 경우 Nginx가 요청 데이터를 모두 수신한 뒤, 내장 톰캣(Tomcat)으로 한꺼번에 전달한다. 이를 통해 백엔드 스레드가 불필요하게 대기하며 점유되는 시간을 최소화한다.
* **Load Balancing**: 여러 대의 애플리케이션 서버가 운용될 경우 요청을 적절히 분산하여 가용성을 높인다.

### Tomcat (Servlet Container) & Thread Pool

Nginx를 통과한 요청은 서블릿 컨테이너인 톰캣의 **Connector(NIO)**에 의해 처리된다.

* **Thread Assignment**: `Executor`는 스레드 풀에서 유휴 스레드를 하나 할당한다. 이 스레드는 요청이 완료될 때까지 **ThreadLocal** 영역에 요청 문맥을 유지하며 실행된다.
* **Http11Processor**: HTTP 프로토콜 파싱을 통해 자바 객체인 `HttpServletRequest`와 `HttpServletResponse`를 생성하여 이후 계층으로 전달한다.

<br>
<br>
<br>

## 3. 서블릿 및 공통 처리 계층

### Filter Chain

디스패처 서블릿(DispatcherServlet)에 도달하기 전, 서블릿 컨테이너 수준에서 **Filter**들이 순차적으로 실행된다. 필터는 스프링 컨텍스트 외부(혹은 경계)에서 동작하며 전역적인 처리를 담당한다.

* `DelegatingFilterProxy`를 통해 스프링 빈으로 등록된 필터들이 제어권을 넘겨받아 실행된다.
* 주로 인코딩 변환, CORS 설정 검증, 스프링 시큐리티를 이용한 인증 및 인가 처리가 이 단계에서 수행된다. 요청이 유효하지 않을 경우 보안 필터 단에서 즉시 차단되기도 한다.

### DispatcherServlet (Front Controller)

모든 API 요청의 중앙 접점이자 스프링 MVC의 핵심 컴포넌트이다.

1. **HandlerMapping 탐색**: `RequestMappingHandlerMapping`에서 요청 URL 경로와 HTTP 메서드에 부합하는 `HandlerMethod`(컨트롤러의 특정 메서드)를 찾는다.
2. **HandlerAdapter 결정**: 찾은 핸들러를 실행할 수 있는 적절한 어댑터(주로 `RequestMappingHandlerAdapter`)를 호출하여 실행 준비를 마친다.

<br>
<br>
<br>

## 4. 데이터 바인딩 및 컨트롤러 실행

### ArgumentResolver & HttpMessageConverter

컨트롤러 메서드의 파라미터를 분석하여 실제 데이터를 주입하는 과정이다.

* **JSON Parsing**: `@RequestBody`가 선언된 경우, `RequestResponseBodyMethodProcessor`가 작동하며 내부에 등록된 `MappingJackson2HttpMessageConverter`를 호출한다.
* **Jackson 라이브러리**: 이 과정에서 JSON 문자열은 자바의 **Request DTO** 객체로 역직렬화(Deserialization)된다. 이 단계에서 데이터 유효성 검증(`@Valid`)도 함께 진행되는 경우가 많다.

### Interceptor

컨트롤러 실행 직전과 직후, `preHandle()`과 `postHandle()` 메서드를 통해 비즈니스 공통 로직을 수행한다. 필터가 서블릿 단위의 공통 처리를 담당한다면, 인터셉터는 스프링 컨텍스트 내부에서 컨트롤러와 긴밀하게 연결된 상세 권한 체크나 API 호출 로깅 등에 사용된다.

<br>
<br>
<br>

## 5. 비즈니스 로직 및 영속성 계층

### Service Layer & Transaction Management

실질적인 비즈니스 요구사항이 처리되는 구간이다.

* **AOP Proxy**: `@Transactional`이 선언된 서비스 메서드 호출 시, 스프링은 **CGLIB** 또는 **JDK Dynamic Proxy**를 통해 트랜잭션을 시작한다. 메서드 실행 중 예외가 발생하면 롤백을 수행하고, 정상 종료 시 커밋을 진행한다.
* **Business Logic**: 서비스는 도메인 규칙에 따라 데이터를 가공하며, 필요에 따라 여러 리포지토리를 호출한다.

### Repository (JPA/Hibernate)

데이터베이스와의 상호작용이 일어나는 계층이다.

1. **Persistence Context**: 엔티티 매니저는 1차 캐시와 쓰기 지연 SQL 저장소를 통해 데이터 무결성을 관리한다.
2. **SQL 실행**: 리포지토리는 필요한 쿼리를 생성하여 DB 드라이버를 통해 데이터베이스에 전달한다. 이때 해당 스레드는 DB로부터 결과를 받을 때까지 **I/O Wait** 상태가 된다.
3. **Dirty Checking**: 트랜잭션 종료 시 엔티티의 변경 사항을 감지하여 자동으로 수정 쿼리를 생성한다.

<br>
<br>
<br>

## 6. 응답 생성 및 반환

### ReturnValueHandler & JSON 직렬화

비즈니스 로직이 종료되어 컨트롤러가 DTO를 반환하면 응답 생성이 시작된다.

* **Entity to DTO Mapping**: 서비스나 컨트롤러 계층에서는 엔티티를 직접 반환하지 않고 **Response DTO**로 변환한다. 이는 순환 참조를 방지하고 외부 API 스펙을 내부 도메인 모델과 분리하기 위함이다.
* **MessageConverter**: `HttpMessageConverter`가 다시 가동되어 자바 객체를 JSON 텍스트로 직렬화(Serialization)한다.

### Response Flow

1. 생성된 JSON 응답은 톰캣의 출력 스트림을 거쳐 Nginx로 전달된다.
2. Nginx는 설정에 따라 데이터를 압축(Gzip)하거나 캐싱 정책을 적용하여 최종적으로 클라이언트에게 전송한다.
3. 모든 작업이 끝난 톰캣 스레드는 스레드 풀로 반환되어 다음 요청을 처리하기 위한 대기 상태로 돌아간다.

<br>
<br>
<br>