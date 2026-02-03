+++
title = 'Vue.js(3) component'
date = 2026-02-02
featured_image = "https://cdn.devdojo.com/images/May2015/vue.js.jpg?auto=format&q=70&w=1280"
tags = ['vue.js']
+++

<br>

## 1. Computed (계산된 속성)

``` javascript
const count = ref(1);
const double = computed(() => count.value * 2); // count가 바뀔 때만 재계산됨
```

- `computed`는 기존 데이터를 가공하여 **새로운 값을 생성**할 때 사용
- **특징**
    - 계산 결과가 캐싱됨
    - 의존하는 반응형 데이터가 변경되지 않으면 함수를 다시 실행하지 않고 기존 값을 재사용
- **용도**
    - 데이터 필터링, 포맷팅, 복잡한 연산 결과 노출 등

<br>
<br>
<br>

## 2. Watch (감시)

``` javascript
// 단일 감시
watch(count, (newVal, oldVal) => { ... });

// 동시 감시
watch([count, name], ([newCount, newName], [oldCount, oldName]) => { ... });
```

- `watch`는 특정 데이터의 변화를 감지한 후 로직을 실행할 때 사용
- 비동기 처리나 DOM 조작 등에 적합
- **단일 감시**
    - 하나의 소스만 추적
- **동시 감시**
    - 여러 소스를 배열로 묶어 동시에 추적
    - 변경된 값들을 배열 형태로 수신

<br>
<br>
<br>

## 3. Reactive 객체 감시와 Deep 옵션

```javascript
const state = reactive({ user: { age: 20 } });
watch(() => state.user, (val) => { ... }, { deep: true });

```

- **Reactive 전체 감시**
    * `reactive`로 선언된 객체를 감시하면 내부 속성이 바뀔 때마다 실행
    * 이때 `deep` 옵션은 자동으로 `true`로 설정
- **중첩 속성 감시 (Deep)**
    * 객체 내부의 깊은 곳에 있는 값을 감시할 때 사용
    * 일반 `ref` 객체의 내부를 감시하려면 `{ deep: true }` 설정이 필요

<br>
<br>
<br>

## 4. Immediate 옵션

``` javascript
watch(source, (val) => { ... }, { immediate: true });
```

- **동작 방식**
    - 데이터가 처음 선언될 때 즉시 감시 로직을 한 번 실행하고 싶을 때 사용

<br>
<br>
<br>

## 5. WatchEffect (계산 및 감시)

- `watchEffect`는 감시 대상을 명시하지 않고, 함수 내부에서 참조하는 모든 반응형 데이터를 자동으로 추적
- **특징**
    - 선언과 동시에 즉시 실행(`immediate: true`와 유사)
    - 의존성 자동 추적으로 어떤 데이터가 바뀔지 일일이 명시할 필요가 없어 코드가 간결
- **용도**
    - 여러 데이터가 얽힌 초기 로직 설정이나 동기화 작업에 사용

<br>
<br>
<br>

## 4. 도구별 비교 및 선택 가이드

| 구분 | `computed` | `watch` | `watchEffect` |
| --- | --- | --- | --- |
| **목적** | 새로운 값 산출 (결과값 반환) | 특정 상태 변화에 따른 로직 실행 | 의존성 기반의 자동 로직 실행 |
| **캐싱** | **지원** (성능 최적화) | 지원 안 함 | 지원 안 함 |
| **실행 시점** | 참조될 때 (Lazy) | 명시된 타겟이 바뀔 때 | 즉시 실행 + 의존성 바뀔 때 |
| **권장 상황** | 템플릿 내 복잡한 연산 | 비동기 호출, 외부 라이브러리 연동 | 다수의 데이터를 참조하는 설정 로직 |

<br>
<br>
<br>

## 5. Computed 감시하기

```javascript
const isAdult = computed(() => user.age >= 20);

// 계산된 결과(isAdult)가 바뀔 때 로그 전송
watch(isAdult, (newVal) => {
  if (newVal) console.log("성인 인증 완료");
});

```

- Computed 결과값도 감시가 가능하다!
- `computed` 또한 내부적으로는 `ref`와 같은 반응형 객체를 반환하기 때문에, `watch`의 대상이 될 수 있음
- 이는 _가공된 데이터의 최종 결과가 특정 조건을 만족할 때_ 추가 로직을 실행하기 위해 사용


<br>
<br>
<br>

## 6. computed, watch, watchEffect 최종 요약

- **`computed`**
    - 선언적 구조
    - "A는 B에 의해 결정된다"는 정의에 집중
- **`watch`**
    - 명령적 구조
    - "A가 바뀌면 B를 수행하라"는 절차에 집중
- **`watchEffect`**
    - 자동화 구조
    - "이 로직 안에 있는 데이터가 변경되면 다시 실행하라"는 흐름에 집중

<br>
<br>
<br>
