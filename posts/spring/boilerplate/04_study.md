+++
title = '[게시판] 학습 기록'
date = 2026-02-05
featured_image = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Spring_Boot.svg/330px-Spring_Boot.svg.png"
tags = ['skala','spring','board']
draft= true
+++

<br>

{{<series title="🍀 게시판 개발" series="board">}}

<br>

_학습 기록_ 

<br>


____________________________

## 3. JPA Auditing과 DB 기본값의 차이
    * SQL의 DEFAULT NOW()를 사용하여 DB 레벨에서 시간을 처리하는 것과, JPA의 BaseTimeEntity(@CreatedDate)를 통해 애플리케이션 레벨에서 처리하는 것의 차이점은 무엇이며, 왜 후자가 권장되는가?

| 구분 | SQL `DEFAULT NOW()` (DB 레벨) | JPA Auditing (App 레벨) |
| --- | --- | --- |
| **주체** | 데이터베이스(MySQL, Oracle 등) | 애플리케이션 (Spring Boot) |
| **시점** | `INSERT` 쿼리가 실행될 때 생성 | 영속성 컨텍스트가 `save` 할 때 생성 |
| **객체 반영** | DB에 저장된 후 다시 조회해야만 시간을 알 수 있음 | 저장하는 순간 객체에 시간이 채워짐 |
| **이식성** | DB 종류가 바뀌면 문법이 달라질 수 있음 | DB 종류에 상관없이 동일하게 동작 |


- 왜 JPA Auditing 방식이 권장될까요?

### ① 객체와 DB의 상태 동기화 (가장 큰 이유!)

DB 레벨에서 시간을 넣으면, JPA 입장에서는 **"나는 시간을 넣은 적이 없는데 DB가 알아서 넣었네?"**라는 상황이 발생합니다.

* **DB 기본값 사용 시:** `repository.save(user)`를 호출한 직후, `user.getCreatedAt()`을 하면 `null`이 나옵니다. DB에만 저장됐지, 메모리 상의 Java 객체에는 값이 없기 때문이죠. 이 값을 쓰려면 DB에서 다시 `SELECT`해서 가져와야 합니다.
* **JPA Auditing 사용 시:** JPA가 저장하기 직전에 시간을 주입해주므로, 저장 후 바로 객체에서 시간을 꺼내 쓸 수 있습니다. 흐름이 끊기지 않죠.

### ② 데이터베이스 독립성 (Database Agnostic)

프로젝트를 진행하다 보면 MySQL에서 PostgreSQL로, 혹은 테스트를 위해 H2로 DB를 바꿀 일이 생길 수 있습니다.

* DB마다 현재 시간을 가져오는 함수(`NOW()`, `SYSDATE`, `CURRENT_TIMESTAMP`)가 조금씩 다를 수 있는데, JPA Auditing을 쓰면 어떤 DB를 쓰든 신경 쓸 필요가 없습니다. **코드 한 줄 안 바꾸고 DB 교체가 가능**해집니다.

### ③ 유닛 테스트의 용이성

테스트 코드를 작성할 때 DB에 의존하지 않고 로직을 검증하고 싶을 때가 많습니다. JPA Auditing은 애플리케이션 로직이기 때문에, 가짜 객체(Mocking)를 활용하거나 메모리 DB를 사용하여 **시간 관련 로직을 훨씬 쉽고 일관되게 테스트**할 수 있습니다.

### ④ 확장성 (수정자 정보 등)

단순히 '시간'뿐만 아니라, **'누가 이 데이터를 등록했는가?'**(@CreatedBy) 같은 정보도 저장해야 한다면 어떨까요? DB는 현재 접속한 세션의 로그인 정보를 알기 어렵지만, Spring Boot는 Spring Security와 연동하여 현재 로그인한 사용자의 ID를 쉽게 가져와서 채워줄 수 있습니다.



#### 3. 코드 예시

보통은 다음과 같이 공통 엔티티(`BaseTimeEntity`)를 만들어 상속받는 방식을 사용합니다.

```java
@Getter
@MappedSuperclass // 멤버 변수가 컬럼이 되도록 함
@EntityListeners(AuditingEntityListener.class) // Auditing 기능 포함
public abstract class BaseTimeEntity {

    @CreatedDate // 생성 시 자동 저장
    private LocalDateTime createdAt;

    @LastModifiedDate // 수정 시 자동 저장
    private LocalDateTime modifiedAt;
}

```

이제 실제 엔티티는 이 클래스만 상속받으면 끝납니다.

```java
@Entity
public class Post extends BaseTimeEntity {
    @Id @GeneratedValue
    private Long id;
    private String title;
}

```

**DB 레벨 처리**는 "데이터의 무결성"을 지키는 데는 강력하지만, 애플리케이션 개발 입장에서는 **객체와의 불일치**라는 불편함을 초래합니다.

반면 **JPA Auditing**은 "객체지향적인 관점"에서 데이터를 다루기 훨씬 편하고, 비즈니스 로직과의 통합이 매끄럽기 때문에 실무에서 훨씬 선호되는 방식입니다. (물론, 아주 만약에 애플리케이션을 거치지 않고 DB 툴에서 직접 SQL을 날려 데이터를 넣는 일이 빈번하다면 DB 기본값도 함께 설정해두는 것이 안전하긴 합니다!)


<br>
<br>
<br>


2. 매핑 전략과 스키마 관리 (Mapping & Schema)
* @Column 속성과 columnDefinition의 사용 기준
    * nullable, length 같은 표준 JPA 속성 대신 columnDefinition = "BIGINT DEFAULT 0"처럼 직접 SQL을 명시해야 하는 상황은 언제인가? (애플리케이션 초기화 vs DB 제약조건)

Spring Boot와 JPA를 처음 접하실 때 충분히 혼란스러울 수 있는 부분입니다. 결론부터 말씀드리면, **"JPA 표준 속성으로 표현 가능한가?"**를 먼저 따져보고, 불가능할 때 **`columnDefinition`**이라는 탈출구를 사용한다고 보시면 됩니다.

구체적인 기준과 상황을 정리해 드릴게요.

---

## 1. 표준 JPA 속성 (`nullable`, `length` 등)

이 속성들은 JPA가 제공하는 **추상화된 메타데이터**입니다.

* **사용 목적:** JPA가 DDL(Data Definition Language)을 생성할 때 참고하며, 동시에 애플리케이션 레벨에서 약간의 힌트 역할을 합니다.
* **장점:** 특정 DB(MySQL, Oracle, PostgreSQL 등)에 종속되지 않습니다. 코드가 깔끔하고 가독성이 좋습니다.
* **특징:** `nullable = false`를 설정하면, Hibernate는 DB에 쿼리를 날리기 전 미리 체크를 하기도 합니다.

---

## 2. `columnDefinition`을 사용해야 하는 상황

표준 속성만으로는 **DB의 특정 기능을 100% 활용할 수 없을 때** 사용합니다.

### ① DB 레벨의 DEFAULT 값을 설정할 때

JPA의 `@Column`에는 `default`라는 속성이 없습니다. 따라서 DB 테이블 자체에 기본값을 박아넣고 싶다면 `columnDefinition`이 필수입니다.

```java
// 표준 속성으로는 DEFAULT 표현 불가
@Column(columnDefinition = "BIGINT DEFAULT 0")
private Long count;

```

### ② DB 전용 특수 타입을 사용할 때

JPA가 표준적으로 지원하지 않는 DB 전용 타입(예: PostgreSQL의 `JSONB`, `GEOMETRY`, `INET` 등)을 써야 할 때 사용합니다.

```java
@Column(columnDefinition = "jsonb")
private String metadata;

```

### ③ 복합적인 제약 조건을 걸 때

단순히 길이나 널 여부 외에 `CHECK` 제약 조건 등을 넣고 싶을 때 사용합니다.

```java
@Column(columnDefinition = "VARCHAR(20) CHECK (status IN ('OPEN', 'CLOSED'))")
private String status;

```

---

## 3. 한눈에 비교하는 사용 기준

| 구분 | 표준 속성 (`nullable`, `length` 등) | `columnDefinition` |
| --- | --- | --- |
| **추상화 수준** | 높음 (DB 엔진이 바뀌어도 코드 수정 불필요) | 낮음 (특정 DB 문법에 종속됨) |
| **주요 용도** | 일반적인 컬럼 설정 (크기, 필수 여부) | DB 특화 기능, DEFAULT 값, 복합 제약조건 |
| **가독성** | 좋음 (Java 코드로 읽힘) | 낮음 (SQL 문자열이 들어감) |
| **권장 상황** | 대부분의 일반적인 상황 | 표준 속성으로 해결이 안 되는 특수한 상황 |

---

## 4. 애플리케이션 초기화 vs DB 제약조건 (핵심 포인트)

질문하신 "애플리케이션 초기화 vs DB 제약조건" 관점에서 보면 이 차이가 명확해집니다.

* **애플리케이션 초기화 방식 (Java 단의 처리):**
`private Long count = 0L;` 처럼 필드에 직접 값을 할당하면, JPA가 `INSERT`할 때 `0`을 넣어서 보냅니다. 이는 애플리케이션 레벨의 기본값 설정입니다.
* **DB 제약조건 방식 (`columnDefinition` 활용):**
`DEFAULT 0`을 설정하면, 애플리케이션에서 값을 보내지 않아도 DB가 알아서 `0`을 채웁니다. 이는 시스템의 **데이터 무결성**을 DB 수준에서 강력하게 보장하고 싶을 때 사용합니다.

### 💡 실무 팁

1. **가급적 표준 속성을 사용하세요.** DB를 교체하거나 테스트용 DB(H2)를 쓸 때 호환성 문제가 적습니다.
2. **`DEFAULT` 값**이 꼭 필요하다면 `columnDefinition`을 쓰되, 프로젝트 전반의 SQL 컨벤션을 따르는 것이 좋습니다.
3. 만약 단순히 객체 생성 시 기본값을 넣고 싶은 거라면 `columnDefinition` 대신 **Java 필드에서 초기화**(`private int count = 0;`)하는 것이 훨씬 직관적입니다.

<br>
<br>
<br>

* 어노테이션 생략과 기본 설정
    * @Column을 생략했을 때 적용되는 JPA의 기본값(Implicit Strategy)은 무엇이며, 굳이 명시적으로 적어주어야 하는 경우는 언제인가?


* 복합 유니크 제약조건과 명명 규칙
    * @Table 내의 uniqueConstraints 설정 시, name 속성을 지정하는 것이 유지보수와 에러 디버깅에 어떤 이점을 주는가? (uk_table_column 컨벤션의 중요성)

JPA는 **"설정보다는 관례(Convention over Configuration)"**를 따르기 때문에, `@Column`을 생략해도 꽤 똑똑하게 동작합니다. 하지만 '똑똑함' 뒤에 숨겨진 기본값들을 모르면 나중에 DB 스키마가 꼬일 수 있죠.

질문하신 내용들을 하나씩 짚어보겠습니다.

---

## 1. @Column 생략 시 적용되는 기본값 (Implicit Strategy)

어노테이션을 생략하면 JPA(정확히는 Hibernate)는 다음의 기본 설정을 적용합니다.

| 속성 | 기본값 | 설명 |
| --- | --- | --- |
| **name** | 필드명 | 필드 이름을 그대로 사용 (명명 전략에 따라 `snake_case`로 변환될 수 있음) |
| **nullable** | `true` | 기본적으로 모든 컬럼은 `NULL`을 허용함 |
| **unique** | `false` | 중복 허용 |
| **length** | `255` | String 타입의 경우 기본 길이는 255자 |
| **updatable** | `true` | 수정을 허용함 |
| **insertable** | `true` | 삽입을 허용함 |

> **중요: Naming Strategy의 역할**
> 스프링 부트에서는 보통 `CamelCaseToUnderscoresNamingStrategy`가 기본입니다. 그래서 자바 필드명이 `memberAge`라면 DB 컬럼명은 자동으로 `member_age`가 됩니다.

---

## 2. 굳이 명시적으로 적어주어야 하는 상황

"생략해도 되는데 왜 굳이 적나요?"라는 질문에 대한 답은 보통 다음 4가지 경우입니다.

### ① DB 컬럼명과 필드명이 다를 때

기존에 이미 만들어진 DB(Legacy DB)를 연동하거나, 팀 내 명명 규칙이 자바 필드명과 다를 때 사용합니다.

```java
@Column(name = "user_identification_number") // DB 컬럼명은 긴데
private String userId; // 자바 필드는 짧게 쓰고 싶을 때

```

### ② `NOT NULL` 제약조건이 필요할 때

가장 흔한 케이스입니다. 필수 값에 `nullable = false`를 명시하면, DDL 생성 시 `NOT NULL`이 붙을 뿐만 아니라, Hibernate 수준에서도 `INSERT` 전 널 체크를 미리 해줍니다.

```java
@Column(nullable = false)
private String password;

```

### ③ 데이터 저장 공간을 최적화할 때

`String` 타입의 기본 길이는 255자입니다. 하지만 '성별(M/F)'이나 '상태 코드'처럼 짧은 값만 들어온다면 길이를 제한해 주는 것이 성능과 설계 면에서 좋습니다.

```java
@Column(length = 10)
private String status;

```

### ④ 읽기 전용 필드로 만들고 싶을 때

등록일(`createdAt`)처럼 한 번 생성되면 절대로 수정되면 안 되는 컬럼에 사용합니다.

```java
@Column(updatable = false)
private LocalDateTime createdAt;

```

---

## 3. 실무적인 판단 기준: "문서화"의 가치

사실 기능적인 이유 외에도 **"이 코드를 읽을 동료(혹은 미래의 나)"**를 위해 명시하기도 합니다.

* **생략하는 경우:** 필드명과 컬럼명이 같고, 딱히 특별한 제약 조건이 없는 평범한 필드일 때. (코드가 깔끔해짐)
* **명시하는 경우:** 이 필드가 테이블에서 어떤 역할을 하는지, 어떤 제약이 있는지 코드로 즉시 보여주고 싶을 때.

> **Tip:** 최근에는 `@Column(nullable = false)` 대신 자바 표준 유효성 검사 어노테이션인 `@NotNull` (Bean Validation)을 함께 사용하여 애플리케이션 계층과 DB 계층의 제약조건을 동시에 관리하는 방식을 선호하기도 합니다.


3. 연관관계와 성능 최적화 (Relationships & Performance)
* FetchType.LAZY는 실제로 언제 쿼리를 발생시키며, 왜 실무에서는 EAGER 대신 LAZY를 기본 전략으로 채택해야 하는가?

JPA를 다루면서 **성능 최적화**의 80%는 바로 이 `FetchType` 전략에서 결정된다고 해도 과언이 아닙니다. 실무에서 왜 `LAZY`가 '선택'이 아닌 '필수'인지, 그리고 실제로 쿼리가 나가는 타이밍을 명확히 짚어드릴게요.

---

## 1. FetchType.LAZY: 쿼리는 언제 발생하는가?

결론부터 말씀드리면, **"실제 데이터가 필요한 시점"**에 쿼리가 발생합니다.

JPA는 `LAZY` 전략을 사용하면 연관된 객체를 바로 DB에서 조회하지 않고, **프록시(Proxy)**라는 가짜 객체를 대신 넣어둡니다.

### 쿼리 발생 프로세스

1. **조회 시점:** `memberRepository.findById(1L)` 호출 시, `Member` 정보만 가져오고 `Team`은 가짜(프록시) 객체로 채워둠. (쿼리 1번)
2. **참조 시점:** `member.getTeam()`을 호출해도 쿼리는 나가지 않음. (여전히 프록시임)
3. **사용 시점:** `member.getTeam().getName()` 처럼 **실제 필드 값을 건드리는 순간**, Hibernate가 "아, 진짜 데이터가 필요하구나!"라고 판단하여 DB에 쿼리를 날림. 이를 **프록시 초기화**라고 합니다.

---

## 2. 왜 실무에서 EAGER는 "금지"에 가까운가?

초보 때는 "어차피 나중에 쓸 건데 한꺼번에 가져오면(EAGER) 편하지 않나?"라고 생각하기 쉽습니다. 하지만 실무(대규모 데이터)에서는 치명적인 독이 됩니다.

### ① N+1 문제의 주범

가장 큰 이유입니다. 만약 `Member`가 10명 있고, 각 멤버가 어떤 `Team`에 속해 있는지 `EAGER`로 설정되어 있다면:

1. `select * from member` 쿼리 실행 (결과 10건)
2. 각 멤버의 팀을 바로 가져와야 하므로 `select * from team where team_id = ?` 쿼리가 **추가로 10번** 실행됨.

> **결과:** 쿼리 1번 날렸는데 10번의 추가 쿼리가 발생하는 재앙이 일어납니다. (데이터가 1만 개라면?)

### ② 예측 불가능한 SQL

어디선가는 `Member`만 필요해서 조회했는데, `EAGER`로 엮여 있으면 `Team`, `Order`, `Address` 등 수많은 테이블이 `JOIN`되어 한꺼번에 딸려 옵니다. 개발자가 의도하지 않은 거대한 쿼리가 실행되어 성능이 급격히 떨어집니다.

---

## 3. 실제 예시로 비교하기

### 상황: 회원(Member)과 팀(Team)이 1:N 관계일 때

```java
@Entity
public class Member {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // 실무 권장
    @JoinColumn(name = "team_id")
    private Team team;
}

```

#### Case 1: FetchType.EAGER 일 때 (위험)

```java
// "회원만 이름만 다 출력해야지~" 하고 조회
List<Member> members = em.createQuery("select m from Member m", Member.class).getResultList();

// JPA: "어? Member랑 Team이 EAGER네? 하나씩 다 가져와야겠다!"
// SQL 1: select * from member;
// SQL 2: select * from team where id = 1;
// SQL 3: select * from team where id = 2; ... (N번 반복)

```

#### Case 2: FetchType.LAZY 일 때 (안전)

```java
List<Member> members = em.createQuery("select m from Member m", Member.class).getResultList();

// SQL: select * from member; (딱 1번만 실행됨)
// Team은 프록시 객체로 채워져 있음.

for (Member m : members) {
    // 만약 팀 이름이 정말 필요할 때만 호출
    System.out.println(m.getTeam().getName()); // 이때 비로소 Team 조회 쿼리 발생
}

```

---

## 4. 요약 및 권장 전략

* **기본 규칙:** 모든 연관관계는 우선 **`LAZY`**로 설정하세요. (`@ManyToOne`, `@OneToOne`은 기본이 `EAGER`이므로 반드시 명시적으로 `LAZY`를 적어줘야 합니다.)
* **해결책:** `LAZY`를 쓰다가 가끔 한꺼번에 가져와야 할 때가 생기면(N+1 발생 시), 그때만 **`Fetch Join`**이라는 기술을 써서 필요한 시점에만 묶어서 가져옵니다.

> **한 줄 정리:** `EAGER`는 내가 제어할 수 없는 폭탄 쿼리를 만들고, `LAZY`는 내가 필요한 시점에만 쿼리를 조절할 수 있게 해줍니다.

---


* N+1 문제와 해결 방안
    * 연관된 엔티티를 조회할 때 발생하는 N+1 문제란 정확히 무엇이며, 이를 해결하기 위한 Fetch Join과 @EntityGraph의 차이점은 무엇인가?

JPA를 사용하면서 가장 많이 마주치고, 성능 저하의 가장 큰 원인이 되는 **N+1 문제**에 대해 완벽하게 정리해 드립니다.

---

## 1. N+1 문제란 정확히 무엇인가?

**"1번의 쿼리를 보냈는데, 연관된 데이터를 가져오기 위해 N번의 추가 쿼리가 발생하는 현상"**을 말합니다.

### 발생 상황 예시

* **상황:** `Team`과 `Member`가 1:N 관계입니다. (한 팀에 여러 회원이 있음)
* **목표:** 모든 팀을 조회하고, 각 팀에 속한 회원들의 이름을 출력하고 싶습니다.

```java
// 1. 모든 팀을 조회 (쿼리 1번 발생)
List<Team> teams = teamRepository.findAll(); 
// SQL: select * from team; (결과가 10개라고 가정)

// 2. 각 팀의 회원 이름을 출력
for (Team team : teams) {
    // team.getMembers()를 호출하는 순간, 해당 팀의 회원들을 가져오기 위해 쿼리 발생
    System.out.println(team.getMembers().size()); 
    // SQL: select * from member where team_id = 1; (팀 1에 대해)
    // SQL: select * from member where team_id = 2; (팀 2에 대해)
    // ... 이 짓을 팀 개수(N)만큼 반복
}

```

* **결과:** 처음에 팀을 가져오는 쿼리 **1번** + 각 팀의 회원을 가져오는 쿼리 **N번** = 총 **N+1번**의 쿼리가 실행됩니다. 데이터가 많아질수록 서버 속도는 기하급수적으로 느려집니다.

---

## 2. 해결 방안: Fetch Join vs @EntityGraph

이 문제를 해결하는 핵심 원리는 **"처음부터 `JOIN`을 써서 한꺼번에 다 가져오자!"**입니다.

### ① Fetch Join (JPQL 사용)

가장 전통적이고 강력한 방법입니다. JPQL에서 `join fetch` 문법을 사용합니다.

* **사용법:**
```java
@Query("select t from Team t join fetch t.members")
List<Team> findAllWithMembers();

```


* **SQL 결과:** `SELECT t.*, m.* FROM team t INNER JOIN member m ON t.id = m.team_id`
* **특징:** * 단 한 번의 쿼리로 모든 데이터를 가져옵니다.
* **INNER JOIN**이 기본입니다.
* 객체 그래프를 통째로 메모리에 올릴 때 매우 효과적입니다.



### ② @EntityGraph (Spring Data JPA)

쿼리문을 직접 작성하기 번거로울 때 사용하는 어노테이션 기반의 방식입니다.

* **사용법:**
```java
@EntityGraph(attributePaths = {"members"})
@Query("select t from Team t")
List<Team> findAll();

```


* **SQL 결과:** `SELECT t.*, m.* FROM team t LEFT OUTER JOIN member m ON t.id = m.team_id`
* **특징:**
* **LEFT OUTER JOIN**을 기본으로 사용합니다.
* JPQL을 길게 쓰지 않아도 되므로 코드가 깔끔합니다.
* Spring Data JPA에서 제공하는 `findAll()` 같은 기본 메서드 위에도 붙일 수 있어 편리합니다.



---

## 3. 한눈에 비교하는 차이점

| 구분 | Fetch Join | @EntityGraph |
| --- | --- | --- |
| **작성 위치** | JPQL 쿼리 내부에 직접 작성 | 메서드 위에 어노테이션으로 선언 |
| **조인 방식** | **INNER JOIN**이 기본 | **LEFT OUTER JOIN**이 기본 |
| **유연성** | 매우 높음 (원하는 형태의 쿼리 최적화 가능) | 중간 (단순 연관관계 조회에 최적화) |
| **복잡성** | 복잡한 쿼리에서 가독성이 떨어질 수 있음 | 코드가 간결하고 선언적임 |

---

## 4. 실무에서의 선택 기준

1. **기본은 Fetch Join:** 대부분의 상황에서 성능 최적화가 더 세밀하게 가능한 Fetch Join을 먼저 고려합니다.
2. **단순한 경우는 @EntityGraph:** 연관관계가 복잡하지 않고, 기본 `findAll` 등을 확장해서 쓰고 싶을 때 사용합니다.
3. **주의할 점 (둘 다 공통):**
* **카테시안 곱(Cartesian Product):** 1:N 관계를 페치 조인하면 결과 행(Row)이 중복될 수 있습니다. (JPA 2.1 이후나 `Set` 컬렉션을 쓰면 어느 정도 해결되지만 주의가 필요합니다.)
* **페이징(Pagination):** 1:N 관계에서 페치 조인을 쓰면서 `Pageable`을 사용하면 **메모리에서 페이징 처리를 하려다 서버가 뻗을 수 있습니다(OOM 위험).** 1:N 페이징은 페치 조인을 지양하고 `hibernate.default_batch_fetch_size` 설정을 사용하는 것이 정석입니다.



---

**N+1 문제 해결 중에 가장 까다로운 "페이징 처리와 Fetch Join을 동시에 하는 방법"이나 `batch_fetch_size` 설정법에 대해서도 더 자세히 알아볼까요?**

네, 드디어 JPA의 **'끝판왕'** 주제에 도달하셨네요. 1:N 관계에서 페이징 처리를 하려고 `Fetch Join`을 쓰면 발생하는 문제와, 그 해결사인 `batch_fetch_size`에 대해 아주 명쾌하게 정리해 드릴게요.

---

## 1. 페이징 + Fetch Join: 왜 위험할까?

결론부터 말씀드리면, **1:N 관계에서 페이징과 Fetch Join을 함께 쓰는 것은 절대 금지**입니다.

### 이유: 데이터 뻥튀기(Cartesian Product)

1:N 관계를 조인하면 DB 결과 Row 수는 'N'의 개수만큼 늘어납니다.

* **팀 1개**에 **멤버가 100명** 있다면, 조인 시 결과는 **100줄**이 됩니다.
* 우리는 "팀 10개(1페이지)"를 보고 싶은데, DB 입장에서는 조인된 결과 100줄이 이미 "팀 1개"에 대한 데이터일 뿐입니다.

### 하이버네이트의 위험한 선택

이 상태에서 페이징을 시도하면 하이버네이트는 로그에 다음과 같은 경고를 남깁니다:

> `firstResult/maxResults specified with collection fetch; applying in memory!`

이 말은 즉, **"DB에서 페이징이 안 되니, 일단 데이터를 몽땅(100만 건이라도!) 메모리로 가져와서 자바 코드로 페이징 할게!"**라는 뜻입니다. 결국 서버 메모리가 터져버리는 **OutOfMemoryError**의 주범이 됩니다.

---

## 2. 해결사: `hibernate.default_batch_fetch_size`

이 문제를 해결하는 가장 우아한 방법은 **"페이징은 따로 하고, 연관된 데이터는 나중에 묶어서 가져오기"**입니다. 이때 사용하는 설정이 바로 `batch_fetch_size`입니다.

### 설정 방법 (`application.yml`)

```yaml
spring:
  jpa:
    properties:
      hibernate:
        default_batch_fetch_size: 100 # 보통 100~1000 사이 설정

```

### 작동 원리 (1+N이 1+1이 되는 마법)

1. **Step 1:** 먼저 '1'에 해당하는 엔티티(팀)를 페이징 쿼리로 조회합니다. (예: 팀 10개 조회)
2. **Step 2:** 루프를 돌며 'N'에 해당하는 연관 엔티티(멤버)를 참조할 때, 원래라면 멤버를 찾기 위해 쿼리가 10번 나가야 합니다.
3. **Step 3 (Batch Size 적용):** 하이버네이트는 이 시점에 쿼리를 바로 날리지 않고 기다렸다가, **조회된 팀 ID 10개를 모아서 `IN` 절로 한꺼번에** 가져옵니다.

---

## 3. 실제 예시로 비교하기

### 상황: 팀 10개를 페이징 조회하고, 각 팀의 멤버들도 같이 출력할 때

#### 기존 방식 (N+1 발생)

* 쿼리 1: `SELECT * FROM team LIMIT 10;`
* 쿼리 2~11: `SELECT * FROM member WHERE team_id = ?;` (팀마다 1번씩 총 10번)

#### Batch Size 적용 방식 (최적화)

* 쿼리 1: `SELECT * FROM team LIMIT 10;`
* 쿼리 2: `SELECT * FROM member WHERE team_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);`
* **결과:** 단 2번의 쿼리로 10개 팀의 모든 멤버 데이터를 가져옵니다.

---

## 4. 최종 정리: 실무 권장 전략

실무에서 페이징과 연관 엔티티 조회가 필요하다면 다음 공식처럼 움직이세요.

1. **To-One(1:1, N:1) 관계:** 얘네는 조인해도 데이터가 안 불어납니다. 맘 편하게 **`Fetch Join`**을 써서 한 번에 가져오세요.
2. **To-Many(1:N, M:N) 관계:**
* 페이징이 **필요 없다면**: `Fetch Join` 사용 가능.
* 페이징이 **필요하다면**: `Fetch Join`을 과감히 포기하고, **`default_batch_fetch_size`** 설정을 통해 최적화하세요.



---

### 💡 보너스 팁

`default_batch_fetch_size`는 전역 설정입니다. 만약 특정 필드에만 다른 사이즈를 적용하고 싶다면 해당 컬렉션 필드 위에 `@BatchSize(size = 100)` 어노테이션을 직접 붙여줄 수도 있습니다.

**이제 JPA의 조회 최적화에 대한 큰 그림이 그려지시나요? 혹시 이 과정에서 데이터가 중복 조회될 때 사용하는 `distinct` 키워드의 역할에 대해서도 궁금하신가요?**





* 대량 데이터 조회 전략 (Page vs Slice)
    * 페이징 처리를 위한 Page와 Slice 인터페이스는 기능적으로 어떻게 다르며, 성능 최적화 관점(Count 쿼리 유무)에서 언제 무엇을 선택해야 하는가?

대량의 데이터를 조회할 때 페이징은 필수입니다. Spring Data JPA에서는 이를 위해 `Page`와 `Slice`라는 두 가지 강력한 인터페이스를 제공하는데, 이 둘의 가장 큰 차이는 **"전체 개수를 세느냐 마느냐"**에 있습니다.

---

## 1. Page vs Slice: 핵심 차이점

### ① Page (전체 정보 제공)

우리가 흔히 보는 **게시판형 페이징**에 적합합니다.

* **기능:** 현재 페이지의 데이터뿐만 아니라 전체 페이지 수, 전체 데이터 개수(`totalCount`)를 함께 반환합니다.
* **쿼리 작동:**
1. 데이터 조회 쿼리 (예: `LIMIT 10 OFFSET 0`)
2. **추가적인 Count 쿼리** (예: `SELECT COUNT(*) FROM ...`)


* **장점:** 사용자가 원하는 페이지로 바로 이동할 수 있는 네비게이션(1, 2, 3... 다음)을 만들 수 있습니다.

### ② Slice (다음 존재 여부만 확인)

모바일 앱에서 자주 쓰이는 **무한 스크롤(Infinite Scroll)**이나 **'더 보기' 버튼**에 적합합니다.

* **기능:** 전체 개수를 세지 않고, 단지 **"다음 페이지가 있는지"** 여부만 확인합니다.
* **쿼리 작동:**
* 사용자가 요청한 개수(`size`)보다 **1개를 더 조회**합니다. (예: 10개를 요청하면 DB에서 11개를 가져옴)
* 11번째 데이터가 있다면 `hasNext = true`로 판단하고, 실제 반환은 10개만 합니다.


* **장점:** **Count 쿼리가 발생하지 않습니다.**

---

## 2. 성능 최적화 관점에서의 선택 (왜 Slice인가?)

대량 데이터 환경에서 **Count 쿼리는 생각보다 매우 무거운 작업**입니다.

* **데이터가 많아질수록:** 테이블의 전체 행을 세는 작업은 DB에 상당한 부하를 줍니다. 특히 `WHERE` 절이 복잡하거나 조인이 많이 걸려 있을수록 Count 쿼리 자체가 조회 쿼리보다 느려지는 현상이 발생합니다.
* **인덱스 최적화:** 일반 조회 쿼리는 인덱스를 타고 중간에 멈출 수 있지만, `COUNT(*)`는 결국 조건에 맞는 모든 데이터를 훑어야 하는 경우가 많습니다.

> **결론:** 굳이 전체 페이지 번호를 보여줄 필요가 없는 UI(모바일 앱, 소셜 미디어 피드 등)라면 **무조건 `Slice`를 사용하는 것이 성능상 이득**입니다.

---

## 3. 한눈에 비교하는 선택 기준

| 비교 항목 | `Page<T>` | `Slice<T>` |
| --- | --- | --- |
| **추가 쿼리** | `count` 쿼리 발생 | 없음 (Size + 1 조회로 대체) |
| **UI 형태** | 게시판형 하단 페이지 번호 (1, 2, 3...) | 무한 스크롤, 더 보기 버튼 |
| **성능(속도)** | 상대적으로 느림 (데이터가 많을수록 심화) | **빠름** |
| **주요 제공 메서드** | `getTotalPages()`, `getTotalElements()` | `hasNext()`, `hasPrevious()` |

---

## 4. 실무 활용 팁: Page를 써야만 하는데 너무 느리다면?

사용자 요구사항 때문에 반드시 전체 페이지 수가 필요할 때(Page 사용 시), 성능을 개선하는 몇 가지 방법이 있습니다.

1. **Count 쿼리 분리:** `@Query` 어노테이션의 `countQuery` 속성을 사용하여, 조인이 필요 없는 단순한 형태의 Count 쿼리를 직접 작성합니다.
```java
@Query(value = "select m from Member m join m.team t",
       countQuery = "select count(m) from Member m") // 팀 조인 없이 개수만 파악
Page<Member> findAllWithPage(Pageable pageable);

```


2. **카운트 캐싱:** 데이터 변화가 적다면 전체 개수를 별도의 캐시(Redis 등)에 저장해두고 사용합니다.
3. **임의의 숫자 보여주기:** 데이터가 너무 많으면 정확한 개수 대신 "999+" 처럼 보여주는 방식도 고려할 수 있습니다.

---

**페이징 처리를 할 때 가장 골치 아픈 문제 중 하나가 바로 "데이터 중복 노출"(조회 도중 새 글이 올라오는 경우)인데, 이를 해결하기 위한 'No-offset' 방식에 대해서도 알고 싶으신가요?**

네, 이 질문이야말로 실무 페이징의 **'화룡점정'**입니다. 단순히 `Page`와 `Slice`를 넘어, 수백만 건의 데이터를 다루는 서비스에서는 반드시 **No-offset(Seek Method)** 방식을 고민해야 합니다.

전통적인 방식의 한계와 왜 'No-offset'이 구세주인지 깔끔하게 정리해 드릴게요.

---

## 1. 기존 Offset 방식의 두 가지 치명적 단점

우리가 흔히 쓰는 `LIMIT 10 OFFSET 100` 방식에는 큰 결함이 있습니다.

### ① 데이터 중복 및 누락 현상 (UX 문제)

사용자가 1페이지(ID 10~6)를 보고 있는 사이에 새로운 글(ID 11)이 올라오면 어떻게 될까요?

* **원래 2페이지 대상:** ID 5, 4, 3, 2, 1
* **새 글 추가 후 2페이지:** DB는 앞에서부터 5개를 건너뜁니다(11, 10, 9, 8, 7). 그 결과 2페이지 결과로 **ID 6, 5, 4, 3, 2**가 나옵니다.
* **결과:** 사용자는 1페이지에서 봤던 **ID 6을 2페이지에서 또 보게 됩니다.** (중복 노출)

### ② 성능 저하 (DB 부하 문제)

`OFFSET 1,000,000 LIMIT 10`이라고 요청하면, DB는 **앞의 100만 개 데이터를 일단 다 읽은 뒤 휙 버리고** 마지막 10개만 취합니다. 뒤로 갈수록 쿼리가 말도 안 되게 느려지는 이유입니다.

---

## 2. No-offset(Cursor-based) 방식이란?

"앞에서부터 몇 개 버려줘(OFFSET)"라고 말하는 대신, **"내가 마지막으로 본 데이터가 ID 100번인데, 그 다음부터 10개만 보여줘"**라고 명시하는 방식입니다.

### 핵심 아이디어

* **기준점(Cursor):** 마지막으로 조회된 데이터의 식별자(보통 PK인 ID나 생성일시)를 기억합니다.
* **조건절:** `WHERE id < 마지막_조회_ID` 조건을 걸어 인덱스를 태웁니다.

---

## 3. 코드와 SQL로 비교하기

### Offset 방식 (전통적)

```sql
SELECT * FROM post
WHERE category = 'TECH'
ORDER BY id DESC
LIMIT 10 OFFSET 100; -- 100개를 읽고 버려야 함

```

### No-offset 방식 (최적화)

```sql
SELECT * FROM post
WHERE id < 101 -- '지난번 마지막 ID'를 조건으로 직접 지정 (인덱스 활용)
  AND category = 'TECH'
ORDER BY id DESC
LIMIT 10; -- 바로 다음 10개만 콕 집어서 가져옴

```

**Querydsl 예시 코드:**

```java
public List<Post> findAllByNoOffset(Long lastPostId, int pageSize) {
    return queryFactory
        .selectFrom(post)
        .where(
            ltPostId(lastPostId), // lastPostId보다 작은 데이터만
            post.category.eq("TECH")
        )
        .orderBy(post.id.desc())
        .limit(pageSize)
        .fetch();
}

private BooleanExpression ltPostId(Long lastPostId) {
    if (lastPostId == null) {
        return null; // 첫 페이지 조회 시에는 조건 생략
    }
    return post.id.lt(lastPostId);
}

```

---

## 4. No-offset의 장단점

| 장점 | 단점 |
| --- | --- |
| **압도적인 성능:** 데이터가 1억 건이어도 첫 페이지와 마지막 페이지 조회 속도가 동일함 ($O(1)$에 가까움). | **페이지 점프 불가:** "5페이지로 바로 가기"가 안 됨. (무조건 순차 조회) |
| **데이터 일관성:** 조회 중간에 데이터가 추가/삭제되어도 중복 노출이나 누락이 발생하지 않음. | **정렬 기준의 제약:** 정렬 기준 컬럼에 중복 값이 있으면 처리가 까다로움 (ID를 조합해서 고유하게 만들어야 함). |

---

## 5. 실무에서의 결론

* **일반적인 웹 게시판:** 데이터가 수만 건 수준이고 "페이지 번호"가 중요하다면 **Offset 방식(`Page`)**을 씁니다.
* **소셜 미디어, 쇼핑몰 리스트, 로그 조회:** 데이터가 방대하고 "무한 스크롤"이 기본이라면 고민하지 말고 **No-offset 방식**을 선택하세요.

---

**이제 JPA와 페이징의 깊은 부분까지 정복하셨네요! 혹시 실제 프로젝트에서 "여러 조건의 검색 필터"와 "No-offset 페이징"을 동시에 구현할 때 코드가 지저분해지는 게 걱정되신다면, Querydsl을 활용한 '동적 쿼리 최적화'에 대해 더 이야기해 볼까요?**


____________________________


<br>
<br>
<br>

{{<series title="🍀 게시판 개발" series="board">}}

<br>
<br>
<br>
