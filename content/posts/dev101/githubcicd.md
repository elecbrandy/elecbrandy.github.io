+++
title = '[github] github action 톺아보기'
date = 2023-12-18
featured_image = "https://static.wikia.nocookie.net/windows/images/0/01/GitHub_logo_2013.png/revision/latest?cb=20231201024220"
draft = true
tags = ['github', 'dev101']
+++

<br>

## 1. 소개


> Github Action, CI/CD

github action을 통한 자동 배포를 간헐적으로 사용해봤지만, 좀 더 정확히 어떻게 작동하는지 알아보고자 글을 작성한다.  

<br>
<br>

## 2. CI/CD


github action 옆에 주로 보이는 CI/CD 부터 알아보자. CI/CD는 지속적 제공/배포를 의미하며, 개발 사이클을 간소화/가속화에 목표를 두고 있다. 

### 2-1. CI (지속적 통합)

- `코드를 자주 합치고, 문제가 없는지 자동으로 확인하는 과정`

협업과정에서 우리는 흔히 여러 개발자가 각자 코드를 짜서 하나의 저장소에 자주 합친다. 이때마다 자동으로 빌드와 테스트를 진행해서, 문제가 생기면 즉시 개발자에게 알려준다. 이러한 초동대처로 버그를 초기에 발견하고 해결할 수 있다.

### 2-2. CD (지속적 배포)

- `CI 성공 이후 완성된 코드를 자동으로 배포하는 과정`

- **지속적 제공**
    - 테스트를 통과한 코드를 언제든지 배포할 수 있는 상태로 준비
- **지속적 배포**
    - 테스트를 통과한 코드를 사람의 개입 없이 자동으로 사용자에게 배포

<br>
<br>

## 3. Github Action


### 3-1. Github Action 이란?


### 3-2. 기저에서의 작동

### 3-3. 설정 방법


<br>
<br>

## 7. Reference


- https://www.elancer.co.kr/blog/detail/759
- https://en.wikipedia.org/wiki/CI/CD
- https://www.redhat.com/ko/topics/devops/what-is-ci-cd

<br>
<br>