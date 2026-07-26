+++
title = 'DL-LSTM'
date = 2026-01-28
featured_image = "https://zrr.kr/XQ8OAd"
tags = ['skala','ai']
+++

{{<series title="🦋 SKALA: SK AX AI Leader Academy" series="skala">}}

<br>

## 1. LSTM

<img src="https://i.imgur.com/4TP2RRo.png" max-width=100%>

- _Long Short-Term Memory_
- 기본 RNN의 치명적인 단점인 **장기 의존성(Long-Term Dependency)** 문제를 해결하기 위해 고안된 모델
- 쉽게 말하면, 아주 긴 문장이 들어와도 앞부분의 중요한 정보를 끝까지 잊지 않고 전달하는 _기억력이 아주 좋은 RNN_
- 정보가 흘러가는 통로를 제어하는 Gate 장치를 추가하여, 어떤 정보를 기억하고 어떤 정보를 지울지 스스로 결정
- **특징**
    - `Long-term Memory` 먼 과거의 정보를 보존하는 능력이 탁월함
    - `Gating Mechanism` 3개의 게이트를 통해 정보의 흐름을 정밀하게 제어
    - `Gradient Flow` 셀 상태(Cell State)를 통해 기울기 소실 문제를 획기적으로 완화

<br>
<br>

### 2. Cell State (셀 상태)

<img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vIJdqcmnsZAJ_7UyKpyVmg.png" max-width=100%>

- LSTM의 핵심 중의 핵심! 
- 컨베이어 벨트처럼 전체 체인을 관통하며, 정보가 큰 변함없이 흐를 수 있게 해줌
- 게이트들에 의해 정보가 추가되거나 삭제될 뿐, 메인 스트림(Main Stream) 역할을 수행함
- 덕분에 아주 오래전의 정보도 현재 시점까지 안전하게 전달될 수 있음

<br>
<br>

### 3. The Three Gates (3개의 게이트)

<img src="https://i.imgur.com/WjNIEPr.png" max-width=100%>

#### **① Forget Gate (망각 게이트)**
- _"과거의 기억 중 무엇을 버릴까?"_
- 현재의 입력($x_t$)과 이전의 은닉 상태($h_{t-1}$)를 보고, 과거의 정보($C_{t-1}$)에서 버릴 부분을 결정
- 시그모이드($\sigma$) 함수를 사용하여 0(전부 삭제)과 1(전부 보존) 사이의 값을 출력

#### **② Input Gate (입력 게이트)**
- _"새로운 정보 중 무엇을 저장할까?"_
- 현재 들어온 정보 중 가치 있는 것을 골라내어 셀 상태에 저장
- 어떤 값을 업데이트할지 정하는 시그모이드 층과 새로운 후보 값들을 만드는 $\tanh$ 층으로 구성

#### **③ Output Gate (출력 게이트)**
- _"현재 시점에 어떤 정보를 출력할까?"_
- 업데이트된 셀 상태를 바탕으로, 현재 시점의 출력($h_t$)을 결정
- 모든 정보를 다 내보내는 것이 아니라, 필요한 필터링을 거친 '정제된' 정보만 다음 층으로 전달

<br>
<br>

### 4. Mathematical Flow

- LSTM의 각 단계는 다음과 같은 수식으로 정의됨 ($W$는 가중치, $b$는 편향)
    - **망각 게이트:** $f_t = \sigma(W_f \cdot [h_{t-1}, x_t] + b_f)$
    - **입력 게이트:** $i_t = \sigma(W_i \cdot [h_{t-1}, x_t] + b_i)$
    - **새로운 기억 후보:** $\tilde{C}_t = \tanh(W_C \cdot [h_{t-1}, x_t] + b_C)$
    - **셀 상태 업데이트:** $C_t = f_t \ast C_{t-1} + i_t \ast \tilde{C}_t$
    - **출력 게이트:** $o_t = \sigma(W_o \cdot [h_{t-1}, x_t] + b_o)$
    - **최종 은닉 상태:** $h_t = o_t \ast \tanh(C_t)$

<br>
<br>

## 5. RNN vs LSTM

| 구분 | RNN | LSTM |
| :--- | :--- | :--- |
| **기억 능력** | \* 과거 정보를 짧게 기억 | \* RNN 보다는 과거 정보를 길게 기억 가능 |
| **구조** | \* 현재 상태와 입력값을 받아 Hidden State(현재 상태)를 통해 출력<br>\* tanh 함수로 단순 계산 | \* Cell State(기억 저장소, 장기 상태)와 Gate를 활용하여 상태 출력<br>\* Forget/Input/Output Gate로 정보 조절<br>\* 계산량이 많고, RNN보다 학습 시간이 길어짐 |
| **한계점** | \* 어느 정도 과거를 기억하지만, 긴 시퀀스 학습 어려움 (Vanishing Gradient)<br>\* 시간 순서 의존 $\rightarrow$ 연산 속도 느림 (병렬처리 한계) | \* 계산량이 많고, 긴 시퀀스에서 목적을 달성하기 어려움<br>\* 시간 순서 의존 $\rightarrow$ 연산 속도 느림 (병렬처리 한계) |
| **설명** | \* 순간순간 정보를 이어가는 방식 | \* 순간순간 정보를 이어가는 방식에 더해<br>\* 중요한 정보를 따로 저장하는 기억 저장소(Cell)를 통해 과거 중요한 정보를 오래 활용할 수 있도록 함 |

<br>
<br>

### 6. GRU: LSTM의 라이벌

- _Gated Recurrent Unit_
- LSTM의 복잡한 구조를 단순화(게이트를 2개로 축소)한 모델
- `Reset Gate`와 `Update Gate`만 사용하며, 셀 상태와 은닉 상태를 하나로 합침
- LSTM보다 파라미터가 적어 연산 효율이 좋으면서도 성능은 거의 대등함

<br>
<br>

### 7. LSTM 핵심 정리

- `Forget` 필요 없는 과거는 지우고
- `Input` 중요한 현재 정보는 더하고
- `Cell State` 이 정보를 고속도로에 실어 보내어
- `Output` 다음 단계에 필요한 맥락만 출력하는 구조

<br>
<br>
<br>

{{<series title="🦋 SKALA: SK AX AI Leader Academy" series="skala">}}

<br>
<br>
<br>