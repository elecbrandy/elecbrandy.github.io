+++
title = 'RAG Evaluation'
date = 2026-06-12
featured_image = "http://t1.daumcdn.net/movie/171980d2cd9344808580f4fc0cb65e151557709136361"
tags = ['ai','skala']
+++


<br>

## 1. 소개

RAG 시스템을 평가할 때 검색 품질을 측정하는 지표로 `Precision@K`, `Recall@K`, `Context Precision`, `Context Recall`이 자주 등장한다. 이름이 비슷해서 혼동하기 쉽지만, 각 지표가 보는 관점은 다르다.


| 지표                    | 보는 관점                                 | 핵심 질문                                 |
| --------------------- | ------------------------------------- | ------------------------------------- |
| **Precision@K**       | Top-K 검색 결과 중 정답 chunk 비율             | 가져온 것 중 얼마나 맞는가?                      |
| **Recall@K**          | 전체 정답 chunk 중 Top-K 안에 포함된 비율         | 찾아야 할 것 중 얼마나 찾았는가?                   |
| **Context Precision** | 검색된 context가 답변 생성에 얼마나 유효한가          | LLM에 넣은 context가 불필요한 내용 없이 깨끗한가?     |
| **Context Recall**    | 검색된 context가 정답 생성에 필요한 정보를 얼마나 포함하는가 | 답변을 만들기 위한 핵심 정보가 context 안에 충분히 있는가? |

<br>
<br>

## 2. 지표 정리

법률 도메인을 예시로 각 지표가 정확히 어떤 의미를 내포하고 있는지, 또 어떻게 계산되는지 알아보자!

<br>

### 2.1. `Precision@K`

`Precision@K`는 검색된 Top-K 결과 중 실제 정답 chunk가 얼마나 포함되어 있는지를 보는 지표이다.

예를 들어 어떤 질문의 정답 근거 chunkd와 Top-5가 다음과 같다고 하자.

``` text
정답 chunk: A, B, C
Top-5 검색 결과: A, X, B, Y, Z
```

이 경우 Top-5 중 정답 chunk는 `A`, `B` 총 2개이다. 즉, Precision@K는 “가져온 검색 결과가 얼마나 깨끗한가”를 보는 지표이다.

$$
\text{Precision@5} = \frac{\text{Top-5 안의 정답 chunk 수}}{5}
= \frac{2}{5}
= 0.4
$$


#### Example

법령 RAG에서는 비슷한 이름의 법령, 유사한 조문, 다른 법률의 해설이 함께 검색될 수 있다. 이때 Precision@K가 낮다면 검색 결과에 불필요한 chunk가 많이 섞였다는 뜻이다.

예를 들어 질문이 다음과 같다고 하자.

```text
임차인의 대항력 요건은 무엇인가?
```

검색 결과가 다음과 같다면 Precision@5는 낮아진다.

```text
1. 주택임대차보호법 제3조 - 대항력
2. 주민등록과 대항력 해설
3. 상가건물 임대차보호법 대항력
4. 계약갱신청구권
5. 중개보수 계산 기준
```

1, 2번은 질문과 직접 관련이 있지만, 3, 4, 5번은 현재 질문에 대한 핵심 근거로 보기 어렵다. 즉, 검색 결과에 노이즈가 섞인 상태이다.

다만 Precision@K는 K가 커질수록 낮아지기 쉽다. Top-3까지만 보면 관련 문서가 잘 나오더라도, Top-10까지 넓히면 덜 관련 있는 chunk가 섞일 가능성이 커지기 때문이다.

<br>
<br>

### 2.2. `Recall@K`

`Recall@K`는 전체 정답 chunk 중 Top-K 안에 얼마나 많이 포함되었는지를 보는 지표이다.

예를 들어 어떤 질문에 답하기 위해 필요한 정답 chunk가 다음 5개라고 이고, 검색기가 Top-3로 다음 chunk를 가져왔다고 하자.

```text
정답 chunk: A, B, C, D, E
Top-3 검색 결과: A, B, X
```

이 경우 전체 정답 chunk 5개 중 Top-3 안에 포함된 정답 chunk는 `A`, `B` 총 2개이다. 즉, Recall@K는 “찾아야 할 근거를 얼마나 놓치지 않았는가”를 보는 지표이다.

$$
\text{Recall@3} = \frac{\text{Top-3 안의 정답 chunk 수}}{\text{전체 정답 chunk 수}}
= \frac{2}{5}
= 0.4
$$

#### Example

법령 RAG에서는 하나의 질문에 답하기 위해 여러 근거가 필요할 수 있다. 예를 들어 대항력 질문에 답하려면 단순히 조문 하나만 필요한 것이 아니라 다음 정보들이 함께 필요할 수 있다.

```text
1. 주택의 인도
2. 주민등록
3. 다음 날 0시부터 대항력 발생
4. 제3자에 대한 효력
5. 관련 해설 또는 판례
```

이때 Top-1만 평가하면 Recall@1은 구조적으로 낮게 나올 수밖에 없다.

```text
Top-1 검색 결과: A
정답 chunk: A, B, C, D, E

Recall@1 = 1 / 5 = 0.2
```

이 결과만 보고 retriever 성능이 나쁘다고 판단하면 안 된다. 정답 근거가 여러 개인데 K를 1로 잡았기 때문에 낮게 나온 것이다.

따라서 Recall@K는 실제 RAG 파이프라인의 context budget과 함께 해석해야 한다. LLM에 Top-5를 넣는 구조라면 Recall@5가 중요하고, 1차 후보를 Top-20까지 가져온 뒤 reranker로 줄이는 구조라면 Recall@20도 함께 보는 것이 타당하다.

<br>
<br>

### 2.3. `Context Precision`

`Context Precision`은 검색된 context 전체가 답변 생성에 얼마나 유효한 정보로 구성되어 있는지를 보는 지표이다.

Precision@K가 chunk ID 또는 문서 라벨 기준으로 “정답 chunk가 몇 개 들어왔는가”를 본다면, Context Precision은 LLM에 전달된 context가 실제 답변에 도움 되는 정보 중심으로 구성되어 있는지를 본다.

예를 들어 질문이 다음과 같다고 하자.

```text
임차인의 대항력 요건은 무엇인가?
```

검색된 context가 다음과 같다면 Context Precision은 높게 나올 가능성이 있다.

```text
Context 1: 임차인은 주택의 인도와 주민등록을 마친 때에는 그 다음 날부터 제3자에 대하여 효력이 생긴다.
Context 2: 주민등록은 대항력 취득 요건 중 하나로 본다.
Context 3: 대항력은 임차인이 제3자에게 임대차관계를 주장할 수 있는 효력이다.
```

세 context 모두 답변 생성에 직접적으로 유효하다.

반대로 검색된 context가 다음과 같다면 Context Precision은 낮아진다.

```text
Context 1: 임차인은 주택의 인도와 주민등록을 마친 때에는 그 다음 날부터 제3자에 대하여 효력이 생긴다.
Context 2: 계약갱신요구권은 일정한 요건에서 행사할 수 있다.
Context 3: 공인중개사의 중개보수는 거래금액에 따라 달라진다.
Context 4: 보증금 증액은 일정 비율을 초과하지 못한다.
```

Context 1은 유효하지만, 나머지는 질문에 대한 답변 생성에 직접 필요하지 않다. 이 경우 LLM은 불필요한 정보를 함께 받게 되고, 답변이 산만해지거나 잘못된 방향으로 생성될 수 있다. 즉, Context Precision은 **LLM에게 전달한 근거 묶음이 얼마나 정제되어 있는가** 를 평가하는 데 유용하다.

<br>
<br>

### 2.4. `Context Recall`

`Context Recall`은 검색된 context 안에 정답을 만들기 위해 필요한 정보가 충분히 포함되어 있는지를 보는 지표이다. `Recall@K` 는 정답 chunk ID가 Top-K 안에 포함되었는지를 본다. 반면 `Context Recall` 은 chunk ID보다 내용 자체를 본다.

#### Example

예를 들어 골든 정답이 다음과 같다고 하자.

```text
임차인이 대항력을 얻기 위해서는 주택의 인도와 주민등록을 마쳐야 하며, 그 효력은 다음 날부터 발생한다.
```

이 정답을 만들기 위해 필요한 핵심 정보는 다음과 같다.

```text
1. 주택의 인도
2. 주민등록
3. 다음 날부터 효력 발생
```

검색된 context가 다음과 같다면 Context Recall은 높다.

```text
Context 1: 임차인은 주택의 인도와 주민등록을 마친 때에는 그 다음 날부터 제3자에 대하여 효력이 생긴다.
```

하나의 chunk만 검색되었더라도 정답 생성에 필요한 핵심 정보가 모두 들어 있기 때문이다.

반대로 검색된 context가 다음과 같다면 Context Recall은 낮다.

```text
Context 1: 임차인은 주택을 인도받은 경우 일정한 보호를 받을 수 있다.
Context 2: 임대차계약은 임대인과 임차인 사이의 계약이다.
```

겉으로는 관련 있어 보이지만, 정답에 필요한 `주민등록`, `다음 날부터 효력 발생` 정보가 빠져 있다. 이 경우 LLM이 정확한 답변을 만들기 어렵다.

즉, Context Recall은 “정답을 생성할 수 있을 만큼 필요한 정보가 context 안에 들어왔는가”를 보는 지표이다.

<br>
<br>

## 3. Recall@K와 Context Recall의 차이

`Recall@K`와 `Context Recall`은 특히 헷갈리기 쉽다. 둘 다 “놓친 것이 없는가”를 보는 지표처럼 보이기 때문이다.

하지만 기준이 다르다.

| 구분         | Recall@K                 | Context Recall                     |
| ---------- | ------------------------ | ---------------------------------- |
| 평가 기준      | 정답 chunk ID 또는 문서 라벨     | 정답 생성에 필요한 정보                      |
| 평가 단위      | 검색 결과 리스트                | LLM에 전달된 context 내용                |
| 낮아지는 경우    | 정답 chunk가 Top-K 안에 없음    | 정답에 필요한 핵심 정보가 context에 없음         |
| 높을 수 있는 경우 | 정답 chunk ID가 Top-K 안에 있음 | chunk ID가 달라도 필요한 정보가 context에 포함됨 |

예를 들어 정답 chunk ID가 `A`라고 하자. 검색 결과에 `A`는 없지만, 다른 해설 chunk `H`에 정답에 필요한 내용이 모두 들어 있을 수 있다.

```text
정답 chunk ID: A

Top-3 검색 결과: H, X, Y

H의 내용:
임차인은 주택의 인도와 주민등록을 마친 경우 다음 날부터 대항력을 취득한다.
```

이 경우 Recall@3은 낮을 수 있다. 정답 chunk ID인 `A`가 검색되지 않았기 때문이다.

하지만 Context Recall은 높을 수 있다. `H` 안에 정답 생성에 필요한 핵심 정보가 모두 들어 있기 때문이다.

반대로 정답 chunk ID가 Top-K 안에 들어왔지만, chunk가 잘못 잘려 핵심 문장이 빠져 있을 수도 있다.

```text
Top-3 검색 결과: A, X, Y

A의 내용:
제3조(대항력 등) 임대차는 그 등기가 없는 경우에도...
```

만약 이 chunk 안에 `주택의 인도`, `주민등록`, `다음 날부터 효력 발생` 문장이 빠져 있다면 Recall@3은 높아도 Context Recall은 낮을 수 있다.

<br>
<br>

## 4. 법령 RAG에서의 해석 방식

법령 RAG에서는 지표를 다음처럼 나누어 보는 것이 적절하다.

| 평가 목적                | 추천 지표                             | 해석                   |
| -------------------- | --------------------------------- | -------------------- |
| 검색기가 정답 chunk를 잘 찾는가 | Precision@K, Recall@K             | retriever 자체 성능 평가   |
| LLM에 들어간 근거가 좋은가     | Context Precision, Context Recall | RAG 입력 context 품질 평가 |
| 최종 답변이 정확한가          | Faithfulness, Answer Correctness  | generation 품질 평가     |

예를 들어 1차 검색과 reranker를 함께 사용하는 구조라면 다음처럼 평가할 수 있다.

```text
1차 검색: Top-20
→ Recall@20 측정
→ 필요한 후보 근거를 넓게 잘 가져오는지 확인

Reranker 이후: Top-5
→ Precision@5, Context Precision 측정
→ LLM에 넣을 최종 context가 깨끗한지 확인

답변 생성 이후
→ Faithfulness, Answer Correctness 측정
→ 근거 기반으로 정확한 답변을 생성했는지 확인
```

이렇게 나누면 병목을 분리해서 볼 수 있다.

예를 들어 `Recall@20`이 낮다면 1차 검색 단계에서 필요한 근거를 놓치고 있는 것이다. 이 경우 chunking, embedding model, hybrid search, query expansion 등을 개선해야 한다.

반대로 `Recall@20`은 높지만 `Precision@5`가 낮다면 후보는 잘 가져오지만 reranker가 최종 근거를 잘 고르지 못하는 것이다. 이 경우 reranker 모델이나 reranking 기준을 개선해야 한다.

또 `Context Recall`은 높은데 `Faithfulness`가 낮다면 검색된 근거는 충분하지만 LLM이 근거에 없는 내용을 생성하고 있는 것이다. 이 경우 prompt, citation constraint, context-only answer, temperature 설정 등을 조정해야 한다.

<br>
<br>

## 5. 정리

네 지표를 한 문장으로 정리하면 다음과 같다.

| 지표                    | 한 줄 요약                                                 |
| --------------------- | ------------------------------------------------------ |
| **Precision@K**       | Top-K로 가져온 chunk 중 정답 chunk 비율이다.                      |
| **Recall@K**          | 전체 정답 chunk 중 Top-K 안에 포함된 비율이다.                       |
| **Context Precision** | LLM에 전달된 context가 답변에 필요한 정보 중심으로 구성되었는지 보는 지표이다.      |
| **Context Recall**    | LLM에 전달된 context 안에 정답 생성에 필요한 정보가 충분히 포함되었는지 보는 지표이다. |


#### 법령이라면?

따라서 법령 RAG 평가에서는 `Precision@K`, `Recall@K`를 검색기 자체 평가에 사용하고, `Context Precision`, `Context Recall`을 LLM 입력 context 품질 평가에 사용하는 것이 자연스럽다.

특히 법령 도메인에서는 단순히 정답 chunk ID를 맞추는 것보다 최종 답변에 필요한 법적 요건, 예외, 효력 발생 시점, 적용 조건이 context에 제대로 포함되었는지가 중요하다. 따라서 `Recall@K`와 `Context Recall`을 함께 보되, 둘의 의미를 구분해서 해석해야 한다.

<br>
<br>


<br>
<br>
