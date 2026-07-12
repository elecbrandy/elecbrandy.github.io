+++
title = 'AI Agent 기반 기업 Compliance 솔루션: i-veri'
date = '2026-07-01'
featured_image = "https://i.namu.wiki/i/BWyG5oPbxZ_pKwRjYVwVwiffq4eGgSdpb8cPAOUFUjK-LlnVXE888oSuyJhBQVFzPFuDAA3K9fIhjXwPU7SGQmF8sxgeGnAH2K00CfRI-TlAuHK2EYWoDbkYgAsjrHm77R1aH54HfG6p3t_4Ljqt5jog2HCLze3QbwNsFi3tldY.webp"
+++

<br>

## 📌 Overview

> SK AX 주관 SK AI Leader Academy 3기 최종 프로젝트 (SK AX SHE 현업 부서 요청 과제 기반)

- `i-veri`는 산업 현장의 Compliance 업무를 AI Agent 기반으로 지원하는 솔루션입니다. 법령 검토, 증빙 자료 정리, 현장 데이터 관리처럼 반복적이고 복잡한 업무를 자동화해, 실무자가 더 빠르게 판단하고 대응할 수 있도록 돕습니다.

| 항목 | 내용 |
|---|---|
| 기간 | `2026.04 ~ 2026.06` |
| 스택 | `React` `Spring` `FastAPI` `LangGraph` `PostgreSQL` `Qdrant` `K8S` |
| 팀 | 6인 (Backend 1 · Frontend 1 · AI/Agent 3 · PM/Infra 1) |
| 담당 | Backend |

- **주요 업무**
    - Spring Boot 기반 인증/프로젝트/집행 내역 API 개발
    - FastAPI 기반 AI Agent 서버 연동
    - PostgreSQL 쿼리 튜닝 및 인덱스 개선
    - 부하 테스트 결과 기반 병목 분석 및 개선


<br>
<br>

## 🧩 Core features

- **증빙 등록**: 현장 담당자가 세금계산서·현장 사진 등 증빙자료 업로드
- **AI 법령 검토**: LangGraph 기반 Agent가 등록된 자료를 법령과 대조해 집행 적정성 판단, 근거 조문까지 명시
- **보완사항 확인**: SHE 담당자가 AI 검토 결과와 보완 필요 항목을 확인하고 승인/반려 처리

<br>
<br>

## 🏗️ System Architecture

![architecture](https://github.com/SKALA-TEAM5/.github/raw/main/img/arch.png)

<br>
<br>

## 📺 Demo

{{< youtube anGs3avv3aU >}}

<br>
<br>
<br>

## 🚨 Key Decisions & Troubleshooting

#### 법령 데이터 반정규화 — RAG 인용 정확성을 위한 RDB 설계

- **상황**
    - AI Agent가 법령을 검토할 때 "어느 조 어느 항 어느 호에 근거한 판단인지"를
    응답에 명시해야 하는 요구사항
    - 초기 설계안은 법령 / 조 / 항 / 호를 각각 별도 테이블로 분리한 정규화 구조
- **선택지**
    - 정규화 유지: 법령 계층을 테이블로 분리 → 정합성 높지만 JOIN 복잡, 벡터 검색
    결과를 RDB에 매핑하기 어려움
    - 반정규화 마스터 테이블: corpus(조문)와 rule(허용/불가 규칙)을 단일 테이블에
    `record_type`으로 구분, 조문 계층을 컬럼으로 보유
- **결정**
    - 반정규화 단일 테이블(`legal_master`)로 설계하자고 제안
    - `article_no / paragraph_no / item_no / section_path` 컬럼을 두어 "제7조 > 제1항 >
    제2호" 단위로 인용 출처를 명시할 수 있도록 구조화
    - `chunk_id`로 Qdrant 벡터 DB 청크와 1:1 연결 → 벡터 검색 결과에 RDB 메타데이터를
    보강해 AI가 정확한 조문 출처를 응답에 포함할 수 있는 구조
    - `hash` 컬럼 + `law_log` 테이블로 새벽 배치 시 법령 변경을 청크 단위로 감지하고
    벡터 DB 재적재 여부를 판단
- **trade-off**
    - corpus 전용 컬럼과 rule 전용 컬럼이 같은 테이블에 있어 nullable 컬럼이 많아짐
    - 대신 JOIN 없이 단일 쿼리로 조회 가능하고, 벡터 검색 결과와 RDB를 `chunk_id`
    하나로 연결할 수 있어 RAG 파이프라인이 단순해짐

<br>

#### 인증 병목으로 인한 401 연쇄 실패 개선

- **문제**
    - 동시 사용자 1,000명 기준 전체 요청의 18.3%가 실패, 그 중 401 에러가 4,358건
    - 로그인 지연 -> 토큰 갱신 실패 -> 이후 모든 인증 요청이 실패하는 구조
- **원인**
    - 로그인 함수의 트랜잭션이 bcrypt 연산(CPU 50~100ms) 동안에도 DB 커넥션을 점유
    - 커넥션 풀 기본값(10)이 작아 대기 큐 포화
    - application.yaml에 hikari 설정을 추가했으나 실제로는 미적용 상태
    — DataSource bean을 직접 생성하는 구조라 yaml binding이 무시됨. DB 커넥션 수를 직접 확인해 발견
- **해결**
    - `@Transactional` 제거 — bcrypt 연산은 트랜잭션 밖으로, DB 쓰기(refresh token 저장)만 내부 메서드에 유지해 커넥션 점유 시간 단축
    - `DataSource` bean에 `@ConfigurationProperties` 추가 → hikari 설정이 실제로 적용되도록
  수정
    - 커넥션 풀 10 → 20 상향 (PG max_connections 100 기준 여유 확인 후 결정)
    - `POST /auth/refresh` p99 121초 → 15초 (-88%), 401 건수 완전 해소

<br>

#### 프로젝트 목록 조회 풀스캔 제거

- **문제**
    - 부하 테스트에서 프로젝트 목록 조회 p99가 90초
    - 쿼리 플랜을 확인하니 정렬·기간 필터 조건에서 Seq Scan 발생
- **원인**
    - `construction_start_date, construction_end_date, (project_name, id)` 컬럼에 인덱스 X
    - 데이터가 늘수록 정렬·범위 필터 비용이 선형으로 증가하는 구조
- **해결**
    - 세 컬럼에 B-tree 인덱스 추가
    - 정렬 옵션별로 실행 계획을 확인해 인덱스가 실제로 타는지 검증 후 배포
    - p99 90초 → 18초 (-80%)

<br>
<br>

## 🔗 Link

- [GitHub Repo](https://github.com/SKALA-TEAM5)

<br>
<br>
