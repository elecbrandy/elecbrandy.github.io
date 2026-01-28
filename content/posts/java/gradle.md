+++
title = 'Gradle'
date = 2026-01-12
featured_image = "https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/10D74/production/_126208986_wed5.jpg.webp"
tags = ['java','dev101']
+++

## 1. 소개

> Gradle의 개념과 동작 원리: Makefile 사용자의 관점에서 공부해보기

이전에 C++ 기반의 IRC 서버를 구현할 당시에는 `Makefile` 과 `docker-compose` 를 통해 서버를 관리했다. 자바 스프링 생태계로 넘어오면서 `Gradle` 이 표준 빌드 자동화 도구로 활용되는 것을 확인하였고, 내부적으로 어떻게 동작하는지 정리해보고자 한다.

<br>
<br>
<br>

## 2. Gradle이란 무엇인가
`Gradle` 은 단순히 make의 자바 버전을 넘어, 의존성 관리와 태스크 기반 라이프사이클이 결합된 고도화된 빌드 도구이다. `Makefile` 이 파일 간의 관계를 정의하여 빌드 명령어를 실행하는 방식이라면, `Gradle` 은 표준화된 빌드 라이프사이클을 내장하고 있어 의존성 다운로드부터 컴파일, 테스트, 패키징까지의 과정을 자동화한다.

`Makefile` 에서는 특정 바이너리를 만들기 위해 컴파일러와 링크 과정을 개발자가 일일이 명시해야 한다. 반면 `Gradle` 은 자바 빌드에 필요한 표준 절차를 이미 알고 있다! 개발자는 `build.gradle` 파일에 필요한 라이브러리와 플러그인을 선언하기만 하면 된다.

<br>
<br>
<br>

## 3. Gradle의 빌드 라이프사이클

<img src="https://docs.gradle.org/current/userguide/img/build-lifecycle-example.png" max-width=100%>

1. **Initialization** : 빌드 대상이 되는 프로젝트들을 결정한다. 멀티 모듈 설정 등이 이 단계에서 확인된다.
2. **Configuration** :  build.gradle 파일을 실행하여 태스크들 간의 의존 관계를 나타내는 DAG를 생성한다.
3. **Execution** : 선택한 태스크와 그에 의존하는 상위 태스크들을 실제 실행한다.

<br>
<br>
<br>

## 4. Gradle Task

Makefile의 Target에 대응하는 개념이 Gradle의 **Task**이다. 하지만 Gradle의 Task는 단순한 셸 명령어의 나열이 아니라, 상태와 동작을 모두 가진 독립적인 객체로 동작한다.

<br>

### 4-1. 객체 지향적 설계와 증분 빌드

Makefile이 파일의 수정 시간에 의존한다면, Gradle은 더 정밀한 방식을 사용한다.

- **상태를 가진 객체**: `compileJava` 같은 태스크는 단순 명령어가 아니라 어떤 파일이 들어오고(`Input`), 어떤 결과가 나오는지(`Output`)를 명확히 알고 있는 객체이다.
- **체크섬(Checksum) 비교**: Gradle은 입력물과 출력물의 데이터 지문(해시값)을 비교한다.
- **UP-TO-DATE**: 소스 코드가 단 한 글자도 바뀌지 않았다면, Gradle은 태스크를 실행하지 않고 `이미 최신 상태`라고 판단하여 건너뛴다.

<br>

### 4-2. DAG와 지능적인 의존성 관리

C++에서 타겟들이 서로 얽혀 있듯, Gradle 태스크들도 **DAG** 구조로 연결되어 있다. 사용자가 `./gradlew bootRun` 만 입력해도, Gradle은 이 작업을 위해 소스 컴파일(`classes`)과 설정 파일 복사(`processResources`)가 먼저 필요하다는 것을 스스로 계산하여 순차적으로 실행한다.

<br>

### 4-3. 일괄 처리와 효율적인 부분 컴파일

Makefile이 파일 하나하나에 대응하는 타겟을 만드는 방식이라면, Gradle은 작업의 종류를 정의한다. 대표적인 예시로 프로젝트에 자바 파일이 10개든 1,000개든 실행되는 태스크는 `compileJava` 하나이다. 이러한 일괄 처리 방식임에도 불구하고, Gradle은 내부적으로 변경된 파일만 골라낸다. 빌드 전 스냅샷을 찍어 이전 상태와 비교한 뒤(**Checksum**), 수정된 파일과 그 영향을 받는 파일들만 컴파일러에 전달하여 효율성을 극대화한다.

<br>

### 4-4. 비유로 보는 차이점

gemini에게 `Makefile` 과 `Gradle` 의 비교를 위한 간단한 예시를 부탁했다.

| 구분 | Makefile 방식 (개별 주문) | Gradle 방식 (지능형 주방) |
| --- | --- | --- |
| **작업 방식** | "계란 프라이 1개", "토스트 1개" 식으로 메뉴마다 개별 주문서를 작성함. | "조식 준비"라는 전체 시스템을 가동함. |
| **효율성** | 요리사가 주문서를 하나씩 보며 그때마다 불을 켬. | 주방장이 냉장고를 확인하여, 재료가 그대로면 기존 요리를 내놓고 바뀐 재료만 새로 요리함. |
| **관리** | 파일이 늘어날수록 관리할 타겟도 많아짐. | 파일이 아무리 늘어나도 "조식 준비"라는 큰 틀 안에서 자동 처리됨. |

<br>
<br>
<br>

## 5. 결론
C++은 소스 파일 간의 복잡한 포함 관계(`#include`)로 인해 파일 단위 제어가 중요하지만, 자바는 패키지 구조와 클래스 경로 기반으로 동작한다. 따라서 대규모 프로젝트에서는 특정 폴더의 소스를 몽땅 읽어 처리하는 추상화된 태스크 방식이 훨씬 효율적이다. 글 작성을 위해 검색하는 과정에서 빌드 도구의 진화 과정에 따른 Makefile, Maven, Gradle과 관련된 다양한 글도 볼 수 있었다.

42서울 본과정 내내 Makefile 사용이 필수였기에, 이것이 빌드의 기본이자 가장 효율적인 방법이라 믿어 의심치 않았다. 굳이 다른 대안을 찾아볼 필요성조차 느끼지 못했던 것이 사실이다.
물론 Makefile을 선호하는 사람도 있었지만 난 가장 나은 방법 중 하나라고 생각하고 있었는데 더 편리하고 발전된 대안들이 많았다... 우물에서 기어나온 기분이다.
여튼 결론은 `Gradle` 이 **객체 지향적 설계** 와 **고도화된 상태 비교** 를 통해 빠르고 유연한 빌드 환경을 제공한다는 것!

<br>
<br>
<br>

## 6. Reference
- https://docs.gradle.org/current/userguide/build_lifecycle.html
- https://velog.io/@leesomyoung/Maven%EA%B3%BC-Gradle%EC%9D%98-%EC%B0%A8%EC%9D%B4-%EB%B0%8F-%EB%B9%84%EA%B5%90
- https://www.reddit.com/r/cpp_questions/comments/1en2eeh/why_is_cmake_so_hated_and_why_not_use_make_files/?tl=ko

<br>
<br>
<br>
