+++
title = 'CleanCode'
date = 2026-01-18
featured_image = "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788966260959.jpg"
tags = ['dev101']
draft = false
+++

<br>

## 1. 소개

> Clean Code

AI Agent와 코드를 협업하는 시점에서 왜 Clean Code는 어떤 의미가 있을까?
이 책은 바이블처럼 언급되지만 유명하지만 그것 자체로 성경의 권위가 있기도 하지만, 시간이 많이 지났고, ai기술발달과 함께 이 책이 말하는 클린코드가 항상 옳다라고 더 이상 말하기 어려울 수도 있음. 각 언어, 프로덕션, 회사에서 클린한 코드에 대한 정의가 구성원마다 다를수도있고. 논쟁도 많음. 그리고 ai 기술을 발달로 우린 코드를 한땀한땀 직접 치는 경우보다 llm을 활용하는 경우도 생각보다 많고 이 과정에서 "클린코드한" 또는 "내 프로덕션 또는 내 구성원들이 추구하는 클린코드" 스러운 코드를 달라고 요청하면 바로 해주기도 할것.
그럼에도 불구하고 이 시점에서 이 책을 읽는 이유는 다음과 같음
AI에게 먹히지 않는
결국 사람이 운용. 명령은 사람이
나중에 없는 환경에서 일할 수도 있고
개발자적인 관점에서 더 나은 직관을 기르기 위해

<br>
<br>

## 2. Clean Code


### 2-1. 작성 예시

``` bash
feat($browser): onUrlChange event (popstate/hashchange/polling)

Added new event to $browser:
- forward popstate event if available
- forward hashchange event if popstate not available
- do polling when neither popstate nor hashchange available

Breaks $browser.onHashChange, which was removed (use onUrlChange instead)
```

<br>

### 2-2. Subject
- **type, scope(선택), subject** 으로 구성됨.
- `<type>`: 커밋의 종류
  - `feat`: 새로운 기능을 추가할 때.
  - `fix`: 버그 픽스 시.
  - `docs`: 문서만 변경했을 때.
  - `style`: 코드 의미 변화 없이 포맷팅 등 수정 시.
  - `refactor`: 기능 변경 없이 코드 리팩토링 시.
  - `test`: 누락된 테스트를 추가하거나 기존 테스트 수정 시.
  - `chore`: 빌드 프로세스, 외부 라이브러리 업데이트 등 유지보수 작업 시.
- `<subject>`: 변경의 대한 짧은 설명
  - 현재 시재
  - 첫 글자는 소문자로, 끝은 마침표 없이

<br>

### 2-3. Body
- 변경 이유 기재
- 이전과의 차이 기재

<br>

### 2-4. Footer
- 커밋과 관련된 중요 정보나 참조 이슈 포함
- 기존 버전과 호환되지 않는 변경인 경우 필수 명시
- 또는 해당 커밋으로 닫히는 이슈가 있을 경우 나열

<br>
<br>

## 3. AngularJS 커밋 컨벤션 (번역)


<details>
<summary>AngularJS 커밋 컨벤션</summary>
<div markdown="1">


### 3-1. Commit Message Conventions

이 규칙들은 [AngularJS 커밋 규칙](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/)에서 가져온 것입니다.

* [Goals](#goals)
* [Generating CHANGELOG.md](#generating-changelogmd)

  * [Recognizing unimportant commits](#recognizing-unimportant-commits)
  * [Provide more information when browsing the history](#provide-more-information-when-browsing-the-history)
* [Format of the commit message](#format-of-the-commit-message)

  * [Subject line](#subject-line)

    * [Allowed `<type>`](#allowed-type)
    * [Allowed `<scope>`](#allowed-scope)
    * [`<subject>` text](#subject-text)
  * [Message body](#message-body)
  * [Message footer](#message-footer)

    * [Breaking changes](#breaking-changes)
    * [Referencing issues](#referencing-issues)
  * [Examples](#examples)


## Goals

* 스크립트를 사용하여 `CHANGELOG.md`를 자동으로 생성할 수 있도록 함
* 포맷팅 등의 중요하지 않은 커밋을 `git bisect`에서 무시할 수 있도록 함
* 히스토리를 탐색할 때 더 나은 정보를 제공함



## Generating CHANGELOG.md

우리는 changelog를 생성할 때 세 가지 섹션 — 새로운 기능(new features), 버그 수정(bug fixes), 주요 변경사항(breaking changes) — 을 사용합니다.
이 목록은 릴리즈 시 스크립트를 통해 자동으로 생성할 수 있습니다. 또한 관련 커밋에 대한 링크도 포함할 수 있습니다.
물론 실제 릴리즈 전에 이 changelog를 직접 편집할 수 있지만, 기본 골격은 자동으로 만들어집니다.

최근 릴리즈 이후의 모든 커밋 제목(첫 줄)을 보려면 다음 명령을 실행합니다:

```bash
git log <last tag> HEAD --pretty=format:%s
```

이번 릴리즈에서 새 기능만 추출하려면:

```bash
git log <last release> HEAD --grep feature
```

### Recognizing unimportant commits

중요하지 않은 커밋은 코드 포맷 변경(공백 추가/삭제, 들여쓰기 수정), 세미콜론 누락, 주석 추가 등과 같은 것입니다.
이런 커밋은 논리적인 코드 변경이 없으므로, 변경사항을 추적할 때 무시해도 됩니다.

`git bisect` 실행 시 이런 커밋을 건너뛰려면 다음 명령을 사용할 수 있습니다:

```bash
git bisect skip $(git rev-list --grep irrelevant <good place> HEAD)
```

### Provide more information when browsing the history

이 규칙을 따르면 커밋 메시지에 “맥락(context)” 정보를 추가할 수 있습니다.

예를 들어 다음과 같은 메시지를 봅시다:

* Fix small typo in docs widget (tutorial instructions)
* Fix test for scenario.Application - should remove old iframe
* docs - various doc fixes
* docs - stripping extra new lines
* Replaced double line break with single when text is fetched from Google
* Added support for properties in documentation

이 메시지들은 변경된 위치를 대략적으로 알려주지만, 일관된 규칙이 없습니다.

반대로 이런 메시지들은 어떤 부분이 수정된 건지 알기 어렵습니다:

* fix comment stripping
* fixing broken links
* Bit of refactoring
* Check whether links do exist and throw exception
* Fix sitemap include (to work on case sensitive linux)

파일 경로를 보면 알 수 있지만, 이는 느리고 불편합니다.
모두가 커밋 메시지에 변경된 위치를 언급하려 하지만, 표준화된 규칙이 없을 뿐입니다.
이 규칙은 바로 그 문제를 해결합니다.

---

## Format of the commit message

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

각 줄은 **100자 이하**로 작성해야 합니다.
이렇게 하면 GitHub이나 다른 Git 도구에서 메시지를 더 쉽게 읽을 수 있습니다.

---

### Subject line

Subject(제목 줄)는 변경사항에 대한 간결한 설명을 포함합니다.

#### Allowed `<type>`

* feat (새로운 기능)
* fix (버그 수정)
* docs (문서 관련 변경)
* style (포맷팅, 세미콜론 누락 등 코드 의미 없는 변경)
* refactor (리팩터링)
* test (테스트 추가나 보완)
* chore (빌드나 유지보수 작업)

#### Allowed `<scope>`

Scope(영역)는 커밋이 변경된 위치를 나타냅니다.
예: `$location`, `$browser`, `$compile`, `$rootScope`, `ngHref`, `ngClick`, `ngView` 등

#### `<subject>` text

* 명령형, 현재 시제로 작성: “change” → O / “changed”, “changes” → X
* 첫 글자를 대문자로 쓰지 않음
* 마지막에 마침표(.)를 붙이지 않음

---

### Message body

* 마찬가지로 명령형, 현재 시제로 작성
* 변경의 **동기(motivation)** 와 **이전 동작과의 차이점**을 설명

참고:
[http://365git.tumblr.com/post/3308646748/writing-git-commit-messages](http://365git.tumblr.com/post/3308646748/writing-git-commit-messages)
[http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)

---

### Message footer

#### Breaking changes

모든 **주요 변경사항(BREAKING CHANGE)** 은 푸터에 명시해야 하며,
변경 내용, 이유, 마이그레이션 방법 등을 함께 설명해야 합니다.

예시:

```
BREAKING CHANGE: isolate scope bindings definition has changed and
    the inject option for the directive controller injection was removed.
    
    To migrate the code follow the example below:
    
    Before:
    
    scope: {
      myAttr: 'attribute',
      myBind: 'bind',
      myExpression: 'expression',
      myEval: 'evaluate',
      myAccessor: 'accessor'
    }
    
    After:
    
    scope: {
      myAttr: '@',
      myBind: '@',
      myExpression: '&',
      // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
      myAccessor: '=' // in directive's template change myAccessor() to myAccessor
    }
    
    The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

---

#### Referencing issues

해결된 이슈는 푸터의 별도 줄에 `"Closes"` 키워드를 사용하여 참조합니다.

```
Closes #234
```

여러 개의 이슈를 닫을 경우:

```
Closes #123, #245, #992
```

---

## Examples

```
feat($browser): onUrlChange event (popstate/hashchange/polling)

Added new event to $browser:
- forward popstate event if available
- forward hashchange event if popstate not available
- do polling when neither popstate nor hashchange available

Breaks $browser.onHashChange, which was removed (use onUrlChange instead)
```

```
fix($compile): couple of unit tests for IE9

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

Closes #392
Breaks foo.bar api, foo.baz should be used instead
```

```
feat(directive): ng:disabled, ng:checked, ng:multiple, ng:readonly, ng:selected

New directives for proper binding these attributes in older browsers (IE).
Added coresponding description, live examples and e2e tests.

Closes #351
```

```
style($location): add couple of missing semi colons
```

```
docs(guide): updated fixed docs from Google Docs

Couple of typos fixed:
- indentation
- batchLogbatchLog -> batchLog
- start periodic checking
- missing brace
```

```
feat($compile): simplify isolate scope bindings

Changed the isolate scope binding options to:
  - @attr - attribute binding (including interpolation)
  - =model - by-directional model binding
  - &expr - expression execution binding

This change simplifies the terminology as well as
number of choices available to the developer. It
also supports local name aliasing from the parent.

BREAKING CHANGE: isolate scope bindings definition has changed and
the inject option for the directive controller injection was removed.

To migrate the code follow the example below:

Before:

scope: {
  myAttr: 'attribute',
  myBind: 'bind',
  myExpression: 'expression',
  myEval: 'evaluate',
  myAccessor: 'accessor'
}

After:

scope: {
  myAttr: '@',
  myBind: '@',
  myExpression: '&',
  // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
  myAccessor: '=' // in directive's template change myAccessor() to myAccessor
}

The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

</div>
</details>

<br>
<br>

## 4. Reference


- https://gist.github.com/stephenparish/9941e89d80e2bc58a153
- https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit?tab=t.0#heading=h.uyo6cb12dt6w

<br>
