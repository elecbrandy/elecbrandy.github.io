+++
title = 'Vue.js(1) basic'
date = 2026-02-02
featured_image = "https://cdn.devdojo.com/images/May2015/vue.js.jpg?auto=format&q=70&w=1280"
tags = ['vue.js']
draft=true
+++

<br>

## 1. 소개

Vanilla js를 통해 라우터 기반 SPA 를 만들어본 경험을 바탕으로 `Vue.js` 를 공부해보자. html, css, js의 조합이 아닌 `Vue.js` 의 컴포넌트 조합 방식이 처음에 잘 이해가 안 가서, 공부하면서 이해가 잘 가지 않았던 부분을 정리했다.

<br>
<br>
<br>

## 2. `.vue` 의 정체

<br> _**`.vue 의 정체? 클래스?`**_ <br>
  
`.vue` 파일은 **객체 지향의 Class와 매우 유사한 역할을 하는 'UI 청사진'** 으로 이해하자.  
바닐라 JS에서 클래스를 만들어 `new Button()`으로 인스턴스를 생성하듯, Vue는 `.vue`라는 설계도를 바탕으로 화면에 컴포넌트 인스턴스를 찍어낸다.
바닐라 JS 클래스는 _어떻게 DOM을 조작할지_ 명령하지만, `.vue`는 _상태에 따라 화면이 무엇처럼 보여야 하는지_ 선언하고 관리한다.

| 구분 | JS | Vue.js |
| --- | --- | --- |
| **데이터 (상태)** | `this.state = { ... }` | `<script>` 내의 `ref` 또는 `data` |
| **UI 구조** | `render()` 메서드 내의 문자열/DOM | `<template>` 태그 내의 HTML |
| **스타일** | 별도 `.css` 파일 혹은 JS 내 삽입 | `<style scoped>` 태그 |
| **인스턴스화** | `const btn = new Button();` | `<Button />` (선언적 사용) |

<br>
<br>
<br>

## 3. 상속 대신 조합

<br> _**`비슷한 속성을 공유하는 컴포넌트는 공통 css나 js 설정이 어처피 필요한거 아닌가?`**_ <br>

비슷한 속성을 공유하는 컴포넌트들은 공통 CSS나 JS 설정이 필수적이다. 하지만 Vue는 이를 클래스 상속(`extends`)으로 해결하지 않는다. 바닐라 JS처럼 코드를 복제하거나 방대한 전역 클래스에 의존하는 대신, **Props**와 **조합**을 통해 효율적으로 관리한다.

#### 스타일의 계층적 관리

- **Global CSS (전역 스타일)**
  - `main.css` 등에 정의하며, 모든 컴포넌트가 공유하는 최소한의 기본 베이스(폰트, 여백 등)를 설정한다.
- **Scoped CSS (지역 스타일)**
  - 해당 `.vue` 파일 내에서만 유효한 고유 스타일이다. 전역 오염 없이 컴포넌트만의 개별 디자인을 정의한다.
- **Props (동적 스타일)**
  - 상속을 통해 스타일을 수정하는 것이 아니라, 부모가 던져준 '값'에 따라 클래스를 동적으로 갈아끼워 모양을 변경한다.

<br>
<br>
<br>

## 4. Vue에 상속이 없는 이유

<br> _**`왜 직접적인 상속 기능을 피한거?`**_ <br>

전통적인 클래스 상속(`A extends B`)은 Vue에서 권장되지 않는다. 상속 계층이 깊어지면 특정 기능의 출처를 파악하기 어렵고, 부모의 작은 변화가 모든 자식에게 치명적인 영향을 주는 **'취약한 기반 클래스 문제'** 가 발생하기 때문이다. Vue는 복잡한 계층 구조를 만드는 대신, 아래의 도구들을 **조합**하여 상속의 필요성을 완벽히 대체한다. `기능이나 디자인이 비슷한 컴포넌트` 를 만들 때, 상속은 새로운 클래스라는 유전자를 물려받는 과정이지만, Vue의 방식은 동일한 청사진(.vue)에 Props라는 옵션만 다르게 끼워 넣거나 필요한 JS 로직 부품을 조립하여 재사용하는 것이다.

- **Props**
  - 데이터와 설정을 부모에서 자식으로 전달하여 상태를 변경
- **Slots**
  - HTML 구조 자체를 부모가 자식에게 주입하여 레이아웃을 확장
- **Provide / Inject**
  - 계층이 깊은 자식 컴포넌트에게 데이터를 직접 전달하여 복잡한 연결 고리를 단순화

<br>
<br>
<br>

## 5. 컴포넌트 관리

<br> _**`그래서 버튼을 어떻게 컴포넌트 방식으로 생산/관리함?`**_ <br>

#### 우선 전역 설정 (`main.css`)

프로젝트 전체의 기준값을 정하는 셈. 실제 모양모단 최대한 공통적인 부분을 정의해주자.

``` css
:root {
  --main-blue: #007bff;   /* primary 색상 */
  --main-red: #dc3545;    /* danger 색상 */
  --font-size-base: 16px;
}

.btn-layout {
  display: inline-flex;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  padding: 10px 20px;
}
```

<br>

#### 버튼 제작 (`MyButton.vue`)

전역 설정에서 정한 기준값을 바탕으로 실제 버튼을 만들어주자.
이때, 여기서 `Props` 를 이용해 모양을 결정하는 로직을 딱한 번만 작성한다.

``` vue
<template>
  <button :class="['btn-layout', type]">
    <slot></slot> </button>
</template>

<script setup>
defineProps({
  // 부모로부터 'primary' 또는 'danger'라는 문자열을 받음
  type: { type: String, default: 'primary' } 
})
</script>

<style scoped> 
/* primary라고 전달받으면 적용될 스타일 */
.primary {
  background-color: var(--main-blue);
  color: white;
}

/* danger라고 전달받으면 적용될 스타일 */
.danger {
  background-color: var(--main-red);
  color: white;
}
</style>
```

<br>

#### 최종 사용

이제 다른 페이지에서는 CSS를 단 한줄도 적지 않는다. 위에서 만들어둔 버튼을 가져와서 Props만 지정해주면 된다.

``` vue
<template>
  <div class="login-page">
    <h1>로그인</h1>
    
    <MyButton type="primary">확인</MyButton>

    <MyButton type="danger">취소</MyButton>
  </div>
</template>

<script setup>
import MyButton from '../components/MyButton.vue'
</script>
```

<br>
<br>
<br>

## 6. Scoped

<br> _**`왜 굳이 Scoped를 사용하는지?`**_ <br>

다른 개발자가 만든 `Login.vue` 안에 실수로 `.danger { color: yellow; }` 라고 적었다면, 전체 웹사이트의 모든 위험 버튼이 노란색으로 변해버린다. scoped를 붙이면 Vue가 내부적으로 `.danger[data-v-f3f3eg]` 같은 고유 아이디를 붙여주기 때문에, MyButton.vue 안의 .danger는 오직 이 버튼에만 적용된다.

<br>
<br>
<br>

## 7. 중복되는 JS 로직의 경우

<br> _**`CSS 뿐만 아니라 JS 로직도 컴포넌트화가 가능?`**_ <br>

여러 컴포넌트에서 "클릭 시 로그를 남기는 기능"이나 "API 호출 로직"이 겹친다면, 이를 별도의 JS 파일로 빼서 조립할 수 있다!
별도의 JS 파일에 로직을 만들어 두고, vue로 만든 버튼 등의 컴포넌트에 붙여서 사용하는 것이다.

<br>
<br>
<br>

## 8. Vue 디렉티브 기본 요약

| 디렉티브 | 설명 | 예시 |
| --- | --- | --- |
| **`v-text`** | 엘리먼트의 텍스트 콘텐츠를 업데이트 | `<span v-text="msg"></span>` |
| **`v-html`** | HTML 코드를 직접 삽입 (XSS 주의) | `<div v-html="rawHtml"></div>` |
| **`v-bind`** | HTML 속성 동적 바인딩 (`:`) | `<img :src="imageSrc">` |
| **`v-on`** | 이벤트 리스너를 연결 (`@`) | `<button @click="doSomething">` |
| **`v-model`** | 폼 입력과 데이터 양방향 연결 | `<input v-model="name">` |
| **`v-if`** | 조건부로 엘리먼트를 생성/제거 | `<p v-if="seen">보여요</p>` |
| **`v-show`** | 조건부로 CSS `display` 속성 전환 | `<p v-show="seen">보여요</p>` |
| **`v-for`** | 배열이나 객체를 반복하여 렌더링 | `<li v-for="item in items">` |

<br>
<br>
<br>

## 9. `v-text`와 내부 텍스트

<br> _**`v-text 쓰면 내부의 기존 텍스트(`abcd`)는 못 쓰나?`**_ <br>

- `v-text`는 해당 엘리먼트의 `textContent`를 통째로 덮어버리는 역할
- `v-text="message"`는 내부적으로 `element.textContent = message`를 수행
- `<div v-text="message">abcd</div>`라고 적어도, Vue가 실행되는 순간 `abcd`는 삭제되고 `message` 변수의 값으로 교체
- 텍스트와 변수를 섞어 쓰고 싶다면 Mustache 문법을 사용하기
  - `<div>abcd {{ message }}</div>`

<br>
<br>
<br>

## 10. `v-model`과 `ref`의 관계

<br> _**`이 둘이 무슨 관계임?`**_ <br>

- 이 둘은 **"데이터 저장소"**와 **"연결 통로"**의 관계
- **`ref`**
  - JS에서 "이 데이터는 값이 변하면 화면도 바뀌어야 해!"라고 선언하는 반응형 상태
- **`v-model`**
  - HTML 입력창(`input`)과 그 `ref` 데이터를 실시간으로 동기화해주는 양방향 연결 고리

<br>
<br>
<br>

## 11. `v-bind`와 `v-model`의 관계

<br> _**`이 둘이 무슨 관계임?`**_ <br>

- `v-model`은 사실 **`v-bind`와 `v-on`을 합쳐놓은 확장판
- 데이터가 변하면 화면이 바뀌는.
- **`v-bind`**
  - 단방향
  - 화면(입력창)에서 값을 바꿔도 데이터는 변하지 않음
- **`v-model`**
  - 양방향
  - 화면 ←→ 데이터 

### 간단한 예시를 보자. (`v-model` vs `v-bind`, `v-on`)

``` vue
<template>
  <div>
    /* v-model 방법 */
    <input v-model="name" />

    /* v-bind, v-on */
    <input :value="name" @input="name = $event.target.value" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const name = ref('')
</script>

```

- **데이터에서 화면으로 (Data → View)**
  - `:value="name"` (`v-bind`) 부분이 담당
  - JavaScript의 `ref` 변수인 `name` 값이 변경되면, 연결된 `input` 태그의 `value` 속성에 즉시 반영
- **화면에서 데이터로 (View → Data)**
  - `@input="name = $event.target.value"` (`v-on`) 부분이 담당
  - 사용자가 타이핑을 하면 `input` 이벤트가 발생하고, 이때 입력창에 담긴 최신 값(`$event.target.value`)을 `name` 변수에 다시 할당
- **결론은**
  - `v-model`은 위 두 가지 과정을 하나로 합쳐 개발자가 일일이 이벤트를 연결하지 않아도 되게끔 도와줌

<br>
<br>
<br>

## 12. 수동 바인딩(v-bind + v-on)을 사용하는 이유

<br> _**`이 수동 바인딩을 쓰긴 쓰나?`**_ <br>

- 대부분의 상황에서는 `v-model`로 충분하지만, 특정 로직이 필요한 경우에는 수동 바인딩 방식을 쓰기도 함
- **데이터 가공**
  - 입력된 값을 실시간으로 대문자로 변환하거나, 특정 패턴(숫자만 허용 등)으로 필터링하여 저장하고 싶을 때
- **한글 입력 최적화**
  - `v-model`은 한글 입력 시 한 글자가 완성되기 전까지 데이터 반영이 미세하게 늦어지는 특성이 있음 ㅠㅠ
  - `@input`을 직접 사용하면 자음/모음이 입력되는 즉시 데이터를 업데이트할 수 있다.
- **추가 로직 실행**
  - 값이 바뀔 때마다 API를 호출하거나 다른 상태를 동시에 변경해야 하는 복합적인 작업이 필요할 때 유용

<br>
<br>
<br>

## 13. `v-if` vs `v-show` 차이 

<br> _**`언제 뭘 써야할까?`**_ <br>

- 두 디렉티브 모두 화면에서 보이게/안 보이게 조절하지만, 내부 동작이 약간 다름
- 추천하는 상황은?
  - **`v-if`**
    - 사용자가 권한에 따라 아예 못 봐야 하는 요소나, 한 번 결정되면 잘 안 바뀌는 경우
  - **`v-show`**
    - 탭 메뉴, 툴팁처럼 아주 자주 껐다 켰다 해야 하는 경우

| 구분 | `v-if` | `v-show` |
| --- | --- | --- |
| **방식** | **물리적 제거/생성** (DOM에서 삭제) | **CSS 제어** (`display: none`) |
| **초기 비용** | 조건이 거짓이면 아예 렌더링 안 함 (낮음) | 조건 상관없이 일단 렌더링함 (높음) |
| **전환 비용** | 바뀔 때마다 요소를 뺏다 꼈다 함 (높음) | 단순히 CSS만 바꿈 (낮음) |

<br>
<br>
<br>

## 14. `v-for` 사용 시 `:key` 가 필수인 이유

<br> _**`v-for에서 :key가 필수인 이유`**_ <br>

- Vue는 화면을 업데이트할 때 최소한으로 필요한 부분만 바꾸려고 노력
- 이때 `:key`는 각 항목의 **"주민등록번호"** 역할을 해줌
- **`:key`를 설정해야 하는 이유**
  - **효율적인 업데이트**
    - 리스트 중간에 항목이 추가되면, Vue는 모든 요소를 새로 그리는 대신 `key`를 대조해 바뀐 놈만 찾아내어 그 위치에 끼워 넣음
  - **상태 유지**
    - `key`가 없으면 Vue는 리스트 순서가 바뀌었을 때 내부 상태(예: 입력창에 적던 내용, 체크박스 체크 여부)를 엉뚱한 리스트 아이템에 연결하는 버그를 일으킬 수 있음
  - **주의사항**
    - `index`를 `key`로 쓰는 것은 피해야 함!!
    - 리스트가 정렬되거나 중간에 삭제되면 `index` 번호가 밀려버려 Vue가 어떤 놈이 그놈인지 헷갈리기 때문...
    - 이때는 고유한 ID값(`item.id`)을 쓰는 것이 베스트

<br>
<br>
<br>
