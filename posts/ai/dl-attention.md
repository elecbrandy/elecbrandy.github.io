+++
title = 'DL-Transformer & Attention'
date = 2026-04-25
featured_image = "https://zrr.kr/XQ8OAd"
tags = ['skala','ai']
draft=true
+++


<br>

## 1. Attention is All You Need

- **RNN의 한계**
    - RNN은 정보를 순차적으로 처리하다가...
    - 멀리 떨어진 단어 사이의 관계를 잊어버리고(기울기 소실), 병렬 처리도 불가능
- **Transformer의 등장**
    - 순서대로 읽지 말고, 중요한 부분에 집중(Attention)해서 한꺼번에 보자
    - 오늘날 ChatGPT, BERT 등 모든 LLM의 뿌리가 된 아키텍처
- **핵심 특징**
    - `Parallelization` 전체 문장을 한 번에 처리하여 학습 속도가 비약적으로 향상
    - `Long-term Dependency` 문장이 아무리 길어도 단어 간의 관계를 직접 계산하여 정보 손실이 없음
    - `Self-Attention` 자기 자신 안에서 단어 간의 연관성을 찾아 맥락을 파악

<br>
<br>

### 2. Attention

- 중요한 것에 집중하기
- 인간이 문장을 읽을 때 모든 단어를 같은 비중으로 보지 않는 것과 같음
- 예를 들어 _그 남자는 사과를 먹었다. 그것은 맛있었다._ 라는 문장에서
    - `그것` 을 읽을 때 우리 뇌는 `사과` 에 강하게 집중함
- 고정된 가중치가 아니라, 입력 데이터 간의 관계에 따라 실시간으로 계산되는 가중치

<br>
<br>

### 3. Q, K, V: Attention의 세 기둥

- Attention 연산은 도서관에서 책을 찾는 과정과 매우 유사함
    - **Query** $Q$ 내가 찾고자 하는 정보 (질문)
    - **Key** $K$ 도서관에 비치된 책들의 제목 (색인)
    - **Value** $V$ 책 안에 들어있는 실제 내용 (정보)
- **연산 프로세스**
    - `Dot-product` 내 질문($Q$)과 각 책의 제목($K$)이 얼마나 유사한지 점수를 매김
    - `Softmax` 점수를 확률(0~1)로 변환함
    - 그 확률만큼 각 책의 내용($V$)을 가져와서 합침

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

<br>
<br>

### 4. Multi-Head Attention: "다각도로 바라보기"

- 하나의 질문을 던지는 것이 아니라, 여러 명의 전문가(Head)가 각기 다른 관점에서 문장을 분석함
- 어떤 Head는 **문법적 관계**에 집중하고, 어떤 Head는 **의미적 맥락**에 집중함
- 여러 관점의 결과물을 다시 합쳐서(Concatenate) 더 풍부한 표현력을 가짐

<br>
<br>

### 5. Transformer Architecture: Encoder & Decoder



- **Encoder (왼쪽)**: 입력 문장을 이해하고 압축하여 의미 있는 벡터로 변환 (예: BERT)
- **Decoder (오른쪽)**: 인코더의 정보와 지금까지 생성한 단어를 바탕으로 다음 단어를 예측 (예: GPT)
- **Positional Encoding**: Transformer는 순서 개념이 없기 때문에, 단어의 위치 정보를 주기 위해 사인(Sine)과 코사인(Cosine) 함수 값을 입력 벡터에 더해줌

<br>
<br>

### 6. RNN vs Transformer 비교

| 구분 | RNN / LSTM | Transformer |
| :--- | :--- | :--- |
| **처리 방식** | 순차적 (Sequential) | 병렬적 (Parallel) |
| **연산 속도** | 느림 (이전 연산이 끝나야 함) | 매우 빠름 (동시 연산) |
| **기억력** | 문장이 길어지면 앞을 잊음 | 문장 길이에 상관없이 직접 연결 |
| **핵심 기술** | Hidden State 전달 | Self-Attention |

<br>
<br>

### 7. 통합 핵심 정리

- `Attention`은 데이터 안에서 **"무엇이 중요한지"**를 스스로 판단하는 기술임
- `Transformer`는 이 Attention을 극대화하여 **순서(Sequence)의 굴레**를 벗어던진 모델임
- 결국 이 "전체를 한꺼번에 보고 중요한 맥락을 짚어내는 능력"이 인공지능의 폭발적인 성능 향상을 이끌어냄

<br>
<br>
<br>


<br>
<br>
<br>