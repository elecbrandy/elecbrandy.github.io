#  🏠 House-rental-chat

<br>

## 📌 Overview

> _**주택임대차보호법 RAG 챗봇 + RAGAS 정량 평가**_

- `House-rental-chat`은 [주택임대차보호법](https://www.law.go.kr/법령/주택임대차보호법)을 근거로 전세·월세·보증금·계약갱신 질문에 **조문을 인용해 답하는** RAG 챗봇입니다.
- RAG 도입, 튜닝 전후의 RAG의 기여분을 격리해서 측정했습니다.

| 항목 | 내용 |
|---|---|
| 스택 | `FastAPI` `LangGraph` `PostgreSQL` `RAGAS` |
| 팀 | 2인 |
| 담당 | RAG pipeline 구축 및 서빙 |


- **주요 업무**
    - 법령 수집·청킹·임베딩·Qdrant 인덱싱 오프라인 파이프라인 구현
    - BGE-M3 dense + Kiwi+BM25 sparse 하이브리드 검색기 + cross-encoder 리랭커 구현
    - top-k·하이브리드·리랭커 단계별 ablation 실험 및검색 튜닝
    - 골든셋 작성·라벨 감사, RAGAS 평가 파이프라인 구축
    - Base LLM vs RAG 격리 비교로 RAG 기여분 정량화
    - LangGraph 오케스트레이션 구현

<br>
<br>

## 🧩 Core features

- Ingestion: 국가법령정보센터 API 수집 → 조문 청킹 → 임베딩 → Qdrant 인덱싱
- Hybrid Retrieval: BGE-M3 dense + Kiwi+BM25 sparse → RRF → cross-encoder 리랭킹
- Grounded Generation: quote-then-answer 프롬프트로 근거 조문 인용 후 답변 생성
- Evaluation: RAGAS 4지표 + 자체 exact-match 조문/세부 정답률 보조지표
- Agent: 인젝션 가드 → query rewrite → 3-way 의도분류 → tool dispatch → 응답 합성 (LangGraph, 멀티턴)

<br>
<br>

## 🏗️ System Architecture

#### LangGraph Architecture

![lang architecture](https://github.com/elecbrandy/house-rental-chat/raw/main/img/house-arch2.png)

<br>

#### System Architecture

![system architecture](https://github.com/elecbrandy/house-rental-chat/raw/main/img/house-arch.png)

<br>
<br>

## 🚨 Key Decisions & Troubleshooting

<br>

#### 후보폭(top-k) 스윕

- **문제**
    - retriever의 top-5k 가 1, 5 등으로 작은 경우 문제 상황 발생
    - 정답 조문이 검색 후보에 아예 안 들어오는 경우가 있었음 (`recall .73`)
- **원인**
    - 후보폭이 좁으면 뒤에 붙일 하이브리드·리랭커로도 못 살림
    - 즉, 후보에 없는 건 못 건지는 상황
- **해결**
    - k를 `{3, 5, 10, 20, 40}`으로 스윕해 recall·hit이 꺾이는 지점을 찾음
    - `k=5→10`에서 recall `.73→.85`·hit `.85→.93`으로 가장 크게 오르고 이후 완만 → `k=10` 고정

<br>

#### Hybrid Search (Kiwi + BM25)

- **문제**
    - dense 단독은 정답이 대개 상위에 오지만(`mrr .62`) 주변이 노이즈.
- **원인**
    - dense는 의미는 잘 잡지만 `제6조의3` 같은 정확한 어휘 매칭이 약함.
    - 순수 whitespace BM25는 한국어 조사·어미(`임차인이`/`임차인은`)와 조문번호를 못 쪼갬.
- **해결**
    - Kiwi 형태소 + 조문번호 정규화 + BM25(sparse)를 dense와 RRF로 결합.
    - hit은 무승부, mrr `.62→.66` → 못 찾던 조문을 새로 찾진 못해도 이미 찾은 정답을 상위로 끌어올림.

<br>

#### Reranker + Wide Fetch

- **문제**
    - 하이브리드 후에도 정답 주변 노이즈가 남고, top-10 밖으로 밀린 정답을 못 건짐
    - 후보폭을 넓히면 distractor가 늘어 precision이 나빠질 것으로 봤음(그래서 앞 단계에서 k=10에 멈춤)
- **원인**
    - dense·sparse는 query와 조문을 각각 임베딩해 유사도만 봄
    - 순위를 한 번에 다시 볼 장치가 없음
- **해결**
    - cross-encoder 리랭커로 넓게 뽑은 뒤(`fetch=40`) top-10으로 좁힘
        - mrr `.66→.72`, hit `.92→.94`.
    - precision은 그대로
        - 리랭커가 distractor를 밀어냈기 때문
        - "넓히면 안 된다"던 정책 변경 → `fetch=40` 고정

<br>

#### 골든셋 라벨 감사

- **문제**
    - hit@k가 `.94`에서 더 안 올라, 남은 miss를 검색 실패로 의심
- **원인**
    - 실제로 까보니 일부는 검색 실패가 아니라 골든셋 **정답 라벨이 불완전**했음
    - (묵시적 갱신 질문에 정답 조문 일부가 누락 — retriever는 이미 정답을 가져오고 있었음)
- **해결**
    - 라벨을 감사·정정 → hit@k `.94 → .99`
    - 단 이는 **검색 코드 개선이 아니라 측정 정정**임을 구분해 기록 (성과로 오인 방지)
    - 지표가 안 오를 때 알고리즘부터 만지기 전에 골든셋 라벨을 먼저 점검해야 하는 습관 가지기

<br>

#### RAGAS 환각

- **문제**
    - base LLM이 조문번호를 지어내는 환각 발생
    - 그럼에도 RAGAS `answer_correctness`는 base와 RAG를 거의 같게 채점(+0.02, flat)
- **원인**
    - `answer_correctness`는 의미 유사도 위주
    - 따라서 `제6조의3` 을 `제6조의2` 로 틀린 것 같은 조문번호 오류에 둔감함
- **해결**
    - "정답 조문번호를 맞혔는가"를 직접 재는 **exact-match 조문 정답률** 보조지표를 정의해 eval에 추가

<br>

#### recall@k vs hit@k

- **문제**
    - `recall@k(.86)`와 `hit@k(.99)`가 크게 벌어져, "검색이 잘 되는 건가?"를 판단할 때 어느 숫자를 봐야 할지 헷갈림
- **원인**
    - `hit@k`: 이 질문, 검색이 정답을 건드리긴 했나
        - top-k 후보 안에 정답 조문이 **하나라도** 있으면 성공(0/1)
    - `recall@k`: 정답을 빠짐없이 다 담았나
        — 정답 조문이 여러 개인 질문에서 그중 몇 개가 top-k에 들어왔는지
    - 정답이 1개인 질문은 두 값이 같지만, 다중조문 질문에서 일부만 담기면 `hit=1`인데 `recall<1` → **항상 `hit@k ≥ recall@k`**
    - 즉 현재 격차(`.99` vs `.86`)는 검색 실패라기보다, 다중조문 질문에서 정답 청크 일부가 top-10 밖으로 밀린 것
- **해결**
    - 두 지표를 목적별로 분리해 사용
    - `hit@k`(.99) → *"정답이 후보에 들어왔나"* = **검색이 병목인지 가르는 진단용** → 병목은 검색이 아님을 확정
    - `recall@k`(.86) → *"다 담았나"* = **k·청킹을 더 조일지 판단용**
    - k를 키우면 `recall@k`는 오르지만(`k=40`에서 `.93`) `precision@k`가 붕괴(`.12→.03`) → k=10 유지, 남은 recall은 **청킹으로만** 개선 여지

<br>

#### 병목 진단

- **문제**
    - 지표가 여럿(recall·mrr·hit·RAGAS·조문 정답률)이라 "다음에 무엇을 개선할지"가 불명확
- **원인**
    - 단계를 나눠 보니 격차의 위치가 드러남
    - 검색은 정답 조문을 거의 다 후보에 넣음 (`hit ≈ .99`)
    - 그런데 답이 그 조문을 실제로 인용하는 비율은 `.76` → 격차는 검색이 아니라 **생성**에 있음
- **해결**
    - 검색을 더 튜닝하는 대신 개선 축을 **생성(프롬프트·모델)으로 이동**
    - `hit@k`는 성과 지표가 아니라 **"병목이 검색이 아님"을 보이는 진단 근거**로 사용

<br>

#### Generation 프롬프트 튜닝

- **문제**
    - 검색이 정답 조문을 가져와도(article_hit↑), 그 안의 기간·비율(5%·2년) 세부는 base와 동급으로 못 뽑음
    - 프롬프트를 바꿔봐도 run마다 점수가 `±0.1` 흔들려 개선인지 노이즈인지 구분 불가
- **원인**
    - 조문번호는 맞혀도 조문 속 수치를 옮기지 못하는 생성(generation) 병목
    - generator LLM에 temperature가 안 걸려(기본값 > 0) 매 실행 답이 달라짐 → A/B 비교 불가
- **해결**
    - `quote-then-answer` 프롬프트: 답 쓰기 전에 근거 조문의 수치를 원문 그대로 인용하도록 유도
    - generator `temperature=0` 고정으로 eval 재현성 확보 (judge뿐 아니라 생성도 결정적으로)
    - 이를 재는 **세부(기간·산식) exact-match** 지표도 함께 신설

<br>
<br>

## 🔗 Link

- [GitHub Repo >>](https://github.com/elecbrandy/house-rental-chat)


<br>
<br>
