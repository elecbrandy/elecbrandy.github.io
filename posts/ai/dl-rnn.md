+++
title = 'DL-RNN'
date = 2026-01-27
featured_image = "https://zrr.kr/XQ8OAd"
tags = ['skala','ai']
+++

{{<series title="🦋 SKALA: SK AX AI Leader Academy" series="skala">}}

<br>

## 1. RNN

- _Recurrent Neural Network_
- 음성, 텍스트, 주가 등 순서가 있는 **시퀀스(Sequence) 데이터**나 시계열 데이터 처리에 최적화된 구조
- 쉽게 말하면, 앞의 정보를 잊지 않고 다음 단계의 입력에 반영하는 '기억력'을 가진 신경망
- 예를 들어 문장을 읽을 때 _"나는"_ 다음에 _"밥을"_ 이 나오면, 그 뒤에 _"먹었다"_ 가 나올 것을 예측하는 것처럼 과거의 맥락을 현재에 활용
- **특징**
    - `Sequential Data` 데이터의 순서 정보가 매우 중요함
    - `Variable Length` 입력과 출력의 길이에 유연하게 대응 가능
    - `Weight Sharing` 모든 시점($t$)에서 동일한 가중치를 공유하여 파라미터 효율성을 높임

<br>
<br>

### 1.1. Recurrent Structure (순환 구조)

<img src="https://i.imgur.com/mJbqj8q.png" max-width=100%>

- **RNN**
    - 메모리를 저장하는 네트워크
- **Cell, Memory Cell**
    - Hidden Layer에서 Activation Function을 통해 결과를 내보내는 역할
    - 내부 연산 단위
- **Hidden State**
    - 여태까지 들어온 과거의 Input 정보를 저장
    - 이후 이를 가지고 다음 단어 예측 (결과값, 결과 상태값)
- **특징**
    - 자기 자신으로 순환하는 루프가 있다는 것
    - 시계열 데이터를 처리하기 위해 네트워크를 시간축으로 펼쳐서 이해할 수 있음
    - $t$ 시점의 입력 $x_t$와 이전 시점($t-1$)의 기억이 합쳐져 현재의 상태를 결정
    - 마치 이어달리기에서 바톤을 넘겨주듯, 이전 단계의 정보가 계속 전달되는 구조

<br>
<br>

### 1.2. Hidden State (은닉 상태)

- RNN의 핵심이자 메모리 역할!!!
- 특정 시점까지의 정보를 압축해서 들고 있는 벡터로, $h_t$로 표기함
- **수학적 정의**
    - $h_t = \tanh(W_{xh}x_t + W_{hh}h_{t-1} + b_h)$
    - 현재의 입력($x_t$)과 이전의 상태($h_{t-1}$)에 각각 가중치를 곱해 더한 후 활성화 함수를 통과시킴
- **특징**
    - 과거의 모든 입력 정보를 이론적으로는 포함하고 있음
    - 새로운 입력이 들어올 때마다 업데이트
    - 출력층으로 정보를 보내기도 하지만 다음 시점의 자신에게 정보를 전달하는 것이 핵심

<br>
<br>

### 1.3. BPTT (Backpropagation Through Time)

- RNN의 학습 방식으로, 시간의 흐름을 거슬러 올라가며 오차를 전파함
- 각 시점($t$)에서의 손실(Loss)을 모두 더하여 전체 손실을 계산하고, 가중치를 업데이트
- **문제점: 기울기 소실(Vanishing Gradient)**
    - 시퀀스가 길어질수록(시간이 멀어질수록) 앞부분의 정보가 뒤로 전달되지 않는 문제 발생
    - 곱셈 연산이 반복되면서 미분값이 0에 가까워져, 초반부 데이터의 학습이 제대로 이루어지지 않음
    - 마치 아주 긴 문장을 읽다 보면 앞 문장의 주어가 무엇이었는지 까먹는 것과 같음

<br>
<br>

### 1.4. RNN의 다양한 구조

- 입력과 출력의 형태에 따라 유연하게 구성 가능
- `One-to-Many` 하나의 이미지에서 설명을 생성하는 Image Captioning
- `Many-to-One` 문장을 읽고 긍정/부정을 판단하는 감성 분석(Sentiment Analysis)
- `Many-to-Many` 문장을 번역하거나(Seq2Seq), 영상의 프레임마다 태그를 다는 작업

<br>
<br>

### 1.5. LSTM & GRU (진화된 RNN)

- 기본 RNN의 장기 의존성(Long-term dependency) 문제를 해결하기 위해 등장
- **LSTM (Long Short-Term Memory)**
    - `Cell State`라는 정보 고속도로를 두어 중요한 정보는 멀리까지 보냄
    - `Forget Gate`, `Input Gate`, `Output Gate`를 통해 어떤 정보를 버리고 저장할지 정밀하게 제어
- **GRU (Gated Recurrent Unit)**
    - LSTM을 간소화하여 연산 속도를 높인 모델
    - 파라미터 수는 적지만 LSTM과 유사한 성능을 내어 널리 쓰임

<br>
<br>

### 1.6. RNN 핵심 정리

- `Input` 순서가 있는 데이터를 집어넣고
- `Hidden State` 이전 시점의 기억과 합쳐 맥락을 파악하며
- `Unrolling` 시간 순서대로 펼쳐서 연산하고
- `BPTT` 과거로 돌아가며 학습하여 최적의 가중치를 찾는 구조

<br>
<br>

## 2. RNN vs LSTM

| 구분 | RNN | LSTM |
| :--- | :--- | :--- |
| **기억 능력** | \* 과거 정보를 짧게 기억 | \* RNN 보다는 과거 정보를 길게 기억 가능 |
| **구조** | \* 현재 상태와 입력값을 받아 Hidden State(현재 상태)를 통해 출력<br>\* tanh 함수로 단순 계산 | \* Cell State(기억 저장소, 장기 상태)와 Gate를 활용하여 상태 출력<br>\* Forget/Input/Output Gate로 정보 조절<br>\* 계산량이 많고, RNN보다 학습 시간이 길어짐 |
| **한계점** | \* 어느 정도 과거를 기억하지만, 긴 시퀀스 학습 어려움 (Vanishing Gradient)<br>\* 시간 순서 의존 $\rightarrow$ 연산 속도 느림 (병렬처리 한계) | \* 계산량이 많고, 긴 시퀀스에서 목적을 달성하기 어려움<br>\* 시간 순서 의존 $\rightarrow$ 연산 속도 느림 (병렬처리 한계) |
| **설명** | \* 순간순간 정보를 이어가는 방식 | \* 순간순간 정보를 이어가는 방식에 더해<br>\* 중요한 정보를 따로 저장하는 기억 저장소(Cell)를 통해 과거 중요한 정보를 오래 활용할 수 있도록 함 |

<br>
<br>
<br>

{{<series title="🦋 SKALA: SK AX AI Leader Academy" series="skala">}}

<br>
<br>
<br>