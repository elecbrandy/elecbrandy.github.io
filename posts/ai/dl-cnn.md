+++
title = 'DL-CNN'
date = 2026-01-25
featured_image = "https://zrr.kr/XQ8OAd"
tags = ['skala','ai']
+++

{{<series title="🦋 SKALA: SK AX AI Leader Academy" series="skala">}}

<br>

## 1. CNN

- _Convolutional Neural Network_
- 이미지, 시계열, 텍스트 등 격자형 데이터에 특화된 딥러닝 아키텍처
- 쉽게 말하면, 이미지 전체를 한 번에 보는 게 아니라 작은 창문으로 조금씩 훑으면서 특징을 파악
- 예를 들어 얕은 층에서는 _선이 있다_, 깊은 층에서는 _눈이 있다_, 더 깊은 층에서는 _고양이다_ 처럼 점점 추상적인 특징을 학습
- **특징**
    - 아래 방법을 통해 모델의 파라미터 수를 획기적으로 줄임
    - `Translation invariance` 위치가 바뀌어도 같은 특징을 알아보는 성질
    - `parameter sharing` 같은 필터를 재사용
- **핵심 구성 요소**
    - Convolution Layer, Pooling Layer, Fully Connected Layer
    - 각 층이 계층적으로 특징(feature)을 추출함

<br>
<br>

### 2. Convolution

<img src="https://withkairos.wordpress.com/wp-content/uploads/2015/09/convolution_schematic.gif?w=300" max-width=100%>

- 보통 두 함수 $f$와 $g$에 대해 정의되는 수학적 연산이라고 정의
- DL에서는 작은 필터가 이미의 한 부분과 뒤섞이며 새로운 특징을 만들어 냄
- `kernel`이 입력 위를 이동하며 내적을 계산하여 `feature map`을 생성

<br>
<br>

### 3. Convolution Layer

- CNN의 핵심 층!!!
- 학습 가능한 파라미터인 `filter` 를 통해 입력으로부터 `local feature` 을 추출
- **파라미터 공유**
    - 동일한 커널이 입력 전체를 슬라이딩하며 적용되므로, 위치에 무관한 특징 감지가 가능
    - 같은 엣지 감지 필터 하나로 이미지의 모든 위치에서 엣지를 찾을 수 있음
    - 따라서 위치마다 다른 가중치를 쓰는 것보다 파라미터 수가 훨씬 적음
- **희소 연결(sparse connectivity)**
    - 각 출력 뉴런이 입력의 일부 영역(수용 영역)에만 연결되어 연산 효율이 높음
    - 모든 픽셀을 서로 연결하는 대신, 가까운 픽셀끼리만 연결하는 것
    - 마치 퍼즐 조각을 맞출 때 멀리 떨어진 조각이 아닌 인접한 조각만 먼저 살피는 것과 같음
- **활성함수 필요**
    - 비선형 활성화 함수(ReLU 등)가 뒤따르며, 선형 연산인 convolution에 비선형성을 부여
    - 활성화 함수가 없으면 여러 층을 쌓아도 결국 하나의 선형 연산과 같아지기 때문에, 복잡한 패턴을 학습하려면 반드시 필요함

<br>

### 3-1. Convolution Layer 구성

<img src="https://i.imgur.com/iTrr5CH.png" max-width=100%>

- **Kernel**
    - 학습을 통해 최적화되는 소형 가중치 행렬
    - 일반적으로 3×3, 5×5, 7×7 크기를 사용함
    - 이미지 전체가 아닌 아주 작은 영역만 보는 돋보기 역할
    - 이 돋보기가 찾는 패턴은 학습을 통해 자동으로 결정됨
    - 합성곱 연산을 수행하는 작은 창으로, 이미지 위를 움직이며 합성곱 연산을 수행하여 특직을 뽑아냄
- **Stride**
    - 커널이 입력 위를 이동할 때의 간격
    - 출력 `feature map` 의 공간적 크기를 제어함
    - stride=1이면 한 칸씩 이동, stride=2면 두 칸씩 건너뛰며 이동함
- **Padding**
    - 입력 경계에 추가하는 픽셀(보통 0)로, 출력 크기와 경계 정보 보존을 제어하기 위해 사용
    - 이미지 가장자리에 빈 테두리를 덧대는 것으로, 커널이 경계 부분에서도 정상적으로 연산할 수 있게 해줌
    - `Valid padding` 패딩 없이 커널이 완전히 겹치는 영역만 연산하여 출력 크기가 줄어듦
    - `Same padding` 출력 크기가 입력과 동일하도록 패딩을 추가

<br>
<br>

### 4. Pooling Layer

<img src="https://i.imgur.com/z8iNCD2.png" max-width=100%>

- 대표값을 추출하여 작은 이미지 생성하며, 학습 파라미터가 없음
- 소규모 이동에 대한 불변성 제공 → 고양이가 몇 픽셀 살짝 이동해도 같은 결과를 내는 것
- **대표값 추출 방식에 따라 구분**
    - `Max Pooling`
        - 수용 영역 내 최대값을 취하며, 가장 두드러진 특징의 존재 여부를 보존함
        — 현재 가장 널리 사용됨
        - _이 영역에 고양이 귀 같은 뾰족한 특징이 조금이라도 있었나?_ 에 Yes/No로 답하는 것과 비슷
    - `Average Pooling`
        - 수용 영역 내 평균값을 취하며, 배경 정보 등 공간 전반에 걸친 특징을 보존함
    - `Global Average Pooling (GAP)`
        - 각 feature map 전체의 평균값 하나를 추출
        - classifier 직전에 적용하여 파라미터 수를 크게 줄임
        — NiN, GoogLeNet, ResNet 등에서 채택


<br>
<br>

### 5. Flatten Layer

<img src="https://i.imgur.com/vTOwPRY.png" max-width=100%>

- 분석한 이미지 데이터를 라벨 분류하기 위해 1차원으로 바꿔주는 역할
- 즉, 다차원 feature map 텐서($H \times W \times C$)를 1차원 벡터로 변환하는 층
- Convolution 블록과 완전연결층(FC layer) 사이를 연결함
- 3차원 박스 형태의 데이터를 한 줄로 쭉 펼치는 작업으로, 이후 FC layer가 한 줄짜리 입력을 받을 수 있게 준비하는 과정
    - Flatten 이후 FC layer의 파라미터 수는 $(H \cdot W \cdot C) \times D$로, 입력 해상도에 비례하여 급격히 증가함
    - 입력 이미지가 조금만 커져도 파라미터 수가 폭발적으로 늘어나므로 메모리와 연산량 부담이 커짐
    - Global Average Pooling으로 대체하면 Flatten 없이 채널당 하나의 값으로 집계되어 파라미터 수를 대폭 감소시킬 수 있음

<br>
<br>

### 6. Softmax Function

<img src="https://i.imgur.com/pzgMfJm.png" max-width=100%>

- 다중 클래스 분류의 최종 출력층에서 사용되는 함수
- Max 값을 가짐을 증명하며, CNN 을 통해 Max로 분류되었음을 증명 → Max값 위치가 몇 번째인지 증명
- 임의의 실수 벡터를 확률 분포로 변환함
    - 예를 들어 `[2.1, 0.5, -1.3]` 같은 날 것의 점수...
    - `[0.75, 0.20, 0.05]` 처럼 각 클래스일 확률로 바꿔주는 함수임
    - $K$개 클래스에 대해 $\text{softmax}(z_i) = \dfrac{e^{z_i}}{\sum_{j=1}^{K} e^{z_j}}$ 로 정의되며, 출력의 합은 항상 1임
- 지수 함수를 통해 클래스 간 점수 차이를 증폭시키므로, 최대 점수를 가진 클래스의 확률이 두드러지게 높아짐
- 점수 차이가 작아도 지수 함수를 거치면 확률 차이가 크게 벌어지므로, 모델이 더 자신 있는 예측을 뚜렷하게 표현할 수 있음
- **수치 안정성 문제**
    - $e^{z_i}$ 계산 시 오버플로(overflow)가 발생할 수 있음
    - 실제 구현에서는 $\text{softmax}(z_i - \max_j z_j)$로 정규화
    - $e^{1000}$ 같은 값은 컴퓨터가 표현할 수 없을 만큼 커지므로...
    - 가장 큰 값을 빼서 최대 지수값이 $e^0 = 1$이 되도록 조정

<br>
<br>

### 7. CNN 핵심 정리

<img src="https://i.imgur.com/sFJefNg.png" max-width=100%>

- `Conv` 이미지 특징을 뽑아내고
- `Pooling` 중요한 것만 추려내고
- `FC` 펼쳐서
- `Dense` 최종 분류하는 구조

<br>
<br>
<br>

{{<series title="🦋 SKALA: SK AX AI Leader Academy" series="skala">}}

<br>
<br>
<br>



