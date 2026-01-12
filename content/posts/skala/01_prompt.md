+++
title = '생성형 AI 기초 및 Prompt Engineering'
date = 2026-01-12
featured_image = "https://zrr.kr/QgOehQ"
tags = ['skala','ai']
draft = true
+++

<br>

# NLP Technical Summary

## 언어 이해의 시작, NLP

## 맥락 이해

## 워드 임베딩

언어라는건 큰 맥락이 필요한데, RNN에는 ~한 

파라미터->
하이퍼파라미터 -> 분석가가 손을 대는 수치

왜 이렇게 파라미터가 많아야할까? 중간 계산에/
엄청난 양의 데이터를 


## Prompt Engineering

### LLM 출력 구성
- Output Length: 출력 길이에 맞는 prompt 설계가 필요
- Temperature: 토큰 선택의 임의성 정도를 제어
    - 가장 높은 값(2)에 가까울수록 더 무작위적
    - 가장 낮은 값(0)에 가까울수록 가장 높은 확률의 토큰이 항상 선택
    - 2023.11 GPT-4-turbo 이후 최대값이 1에서 2로 변경됨
    - temperature 값은 결국 어떤 토큰이 출력될 확률에 적용되는 가중치임. 모델이 생성할 다음 단어의 확률 분포를 조정하며, 높은 temperature는 분포를 평평하게 만들어 낮은 확률의 단어도 선택될 가능성을 높임.
- Top-K: 예측된 토큰 중 가장 가능성이 높은 상위 K개의 토큰을 선택(하위 짜르기)
    - 높을수록 모델의 출력은 더욱 창의적이고 다양해짐
    - 낮을수록 모델의 출력은 더욱 불안정하고 사실적
- Top-p: 누적 확률이 특정값(p)을 초과하지 않는 상위 토큰을 선택
    - P값이 0일 경우, 가장 높은 확률의 토큰을 선택하며, P값이 1일 경우 LLM 어휘집에 있는 모든 토큰이 출력후보
    - 보통 현업에서 많이 씀.
    - 1 이면 모든 후보를 다 쓰겠다는 의미.

보다 창의적인 결과를 원하는 경우 -> temperature 1.7~1.8
과제의 정답이 하나만 있는 경우(수학문제등) -> temperature 0

Sampling Parameters
Max Tokens
0
Temperature
1.000
Top P
1.000
Top K
0.000
Frequency Penalty
0.020
Presence Penalty
0.000
Repetition Penalty
1.000
Min P
0.000
Top A

### Prompt design
- LLM이 잘 이해하여 답변할 수 있도록 질의
- 원하는 답변의 요구사항을 명확하게 제시
- 원하는 답변을 일관되게 할 수 있도록

- 생성형 AI의 페르소나를 정의
- 수행할 구체적인 작업을 명시
- Context(배경지식/정보제공) 함께 제공하기


### Prompt Engineering Techniques

#### Zero / One / Few shot
- 예시를 주느냐 하나주느냐 다수를 주느냐
- 제로샷은 "예시 없음"을 의미
    - 제로샷이 효과가 없을 경우, 프롬프트에 데모나 예시를 제공할 수 있음.
    - 간단하고 빠르게 적용 가능하고, 모델의 기본추론 능력에 의존
- 원샷은 예시를 하나 주는 것을 의미
    - 예시 제공은 매우 유용
- Few Shot: 모델에 여러가지 예시를 제공
    - One shot과 유사하지만, 원하는 패턴의 여러가지 예를 사용하면 모델이 패턴을 따를 확률이 높아짐

