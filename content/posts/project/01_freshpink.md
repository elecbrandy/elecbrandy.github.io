+++
title = '[hugo] Hugo 블로그 구축하기 (1)'
date = 2025-05-09
featured_image = "https://i.imgur.com/URQWyyY.png"
tags = ['hugo']
+++

{{<series title="📚 /Hugo 블로그 만들기" series="hugo" >}}

<br>

## 1. 소개

> **Hugo + Github** 조합으로 30분 만에 개인 개발 블로그를 구축하기 (1)

세상에 정말 많은 블로그 서비스가 존재한다. 개인 메모용, 혹은 지식을 공유하기 위한 개발 블로그 등등... 나는 마크다운 기반으로 필기하는 습관이 있어 **Hugo + GitHub Pages** 조합을 선택했다.  

아래 Hugo 테마 사이트에 들어가면 전세계 Hugo 유저들이 제작한 블로그 테마가 등록되어 있다. 다른 테마를 원하는 경우 아래 링크에서 더 많은, 더 예쁜 테마를 확인해보자. 각 테마 내부에 데모 사이트 접속부터 실제 설치-사용방법까지 적혀있기 때문에 초보자라도 쉽게 따라할 수 있다.  

물론 설치 과정에서 시행착오가 존재할 수 있고, 업데이트가 종료된 테마인 경우 최신 Hugo 엔진에서 작동하지 않는 경우도 있다. 따라서 이와 같은 고민을 겪을 초보자를 위해 이 가이드를 작성하며, 우선 `freshPink` 테마를 사용해 실습해보자.  

- 🌏 [Hugo 테마 사이트 방문하기 >>](https://themes.gohugo.io)

<br>
<br>

## 2. 기본 정보

가이드에 앞서 우리가 사용할 기술에 대한 간단한 사전 지식을 읽어보자!

<br>

### 2-1. Github Page

GitHub Pages는 GitHub 저장소에 있는 HTML, CSS, JS 파일 등의 정적 콘텐츠를 웹사이트로 호스팅해주는 서비스이다. GitHub 계정이 있다면 누구나 추가 비용 없이 웹사이트를 호스팅할 수 있다. 감사합니다 Github!

<br>

### 2-2. Github Actions

`GitHub Actions` 이란 깃허브 저장소 내에서 개발 작업을 자동으로 처리해주는 도구이다.

- **간단한 예시!**
  - 코드를 푸시할 때마다 자동으로 오류가 없는지 테스트 하거나, 테스트를 통과하면 자동으로 GitHub Pages에 배포하게 설정할 수 있다. (CI/CD)

<br>

### 2-3. Hugo

`Hugo` 는 Go 언어로 작성된 정적 사이트 생성기(Static Site Generator)이다. (사용하기 위해 Go를 알 필요없음)

- **Hugo의 작동**
  - Input으로 다음을 받는다.   → `Markdown, 테마, 설정 파일`
  - Output으로 다음을 뱉는다.  → `HTML, CSS, JS가 담긴 public 폴더`
  - 우리는 결국 `Hugo` 가 뱉어내는 `/public` 폴더 내부 파일을 인터넷에 공유하는 셈이다.

<br>
<br>

## 4. freshPink 테마 살펴보기

이번 가이드로 사용해볼 테마는 `freshPink` 테마이다. 다음 링크를 접속해서 어떻게 생긴 테마인지, 데모사이트는 어떤지 한번 살펴보자.

- **freshPink 링크**
  - 🌏 [freshPink github 방문 >>](https://github.com/elecbrandy/freshpink)
  - 🌏 [freshPink Demo site 방문 >>](https://elecbrandy.github.io/freshpink/)
- **마음에 들지 않는다면**
  - 일단 한번 배포까지 연습해보고 나중에 다른 테마로 갈아끼우면 그만이다.
  - 혹은 fork를 떠서 마개조해도 상관없다.
  - 단, 테마마다 상세 사용법이 약간씩 다른 것에 주의할 것!

<br>
<br>

## 5. 설치 방법

- ⚠️ **주의사항** ⚠️
  - 이 가이드는 Mac 기준.
  - Hugo는 반드시 `Extended` 버전으로 설치.
  - 우리의 목표 → `https://github.com/username.github.io`
- **파이프라인**
  1. **빌드** Hugo가 소스 파일을 모아 `public/` 디렉터리에 정적 파일을 생성한다.
  2. **배포** Github Action이 `public/` 내용을 **배포 브랜치**(`gh-pages`)에 푸시한다.
  3. **호스팅** GitHub Pages가 배포 브랜치의 정적 파일을 읽어 전 세계에 서비스한다.

<br>
<br>

## 6. Local에 설치하기

### 6-1. `Go` , `Hugo` 설치

``` bash
# Go, Hugo 설치하기
brew install go
brew install hugo

# extended 버전인지 확인하기
hugo version
```

- **homebrew가 없다면**
  - 🌏 [homebrew 설치하러가기 >>](https://brew.sh/)

<br>

### 6-2. Github repo 세팅하기

- 우선, Github에 가서 `username.github.io` 이름으로 Public 레포지토리를 만들어야 한다.
- 이후, 터미널에서 아래 명령어를 실행하자.
- 루트 디렉토리에 `.gitignore` 파일을 만들고 안에 `/public/` 을 추가하자. 어처피 우리가 나중에 호스팅할 파일은 다른 브랜치에 모여있을 예정이기 때문이다.

``` bash
# 클론 받기
git clone https://github.com/<username>/<username>.github.io.git

# 해당 디렉토리로 이동
cd <username>.github.io

# Hugo site 생성하기 (강제)
hugo new site . --force

# gitignore 추가
echo "/public/" >> .gitignore
```

<br>

### 6-3. `hugo.toml` 덮어씌우기

- 디렉토리에 생성된 `hugo.toml` 파일을 열어보자.
- 기존 내용을 모두 지운 뒤 아래 내용을 복사해서 붙여넣자!

``` toml
baseURL = 'https://example.org/' # your git repository address
title = 'freshpink' # your own blog title
languageCode = 'en-us'
canonifyURLs = true

[[menus.main]]
name = 'Home'
pageRef = '/'
weight = 10

[[menus.main]]
name = 'TAGS'
pageRef = '/tags/'
weight = 20

[[menus.main]]
name = 'ABOUT'
pageRef = '/about/'
weight = 30

[module]
  [module.hugoVersion]
    extended = true
    min = "0.116.0"
  [[module.imports]]
    path = "github.com/elecbrandy/freshpink"

[params]
  # --- Site Metadata ---
  googleAnalytics = "G-000000000"
  copyright = 'Copyright © 2024 elecbrandy'

  # --- Theme & Display Settings ---
  primaryColor = "#fa8b84"
  math = true

  # --- GitHub Chart ---
  githubUsername = "elecbrandy"
  showGithubChart = true

  # --- Main Image ---
  mainImageUrl = "https://zrr.kr/0wve8W"
  showMainImage = true

[taxonomies]
  tag = 'tags'

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```

<br>

### 6-4. `hugo.toml` 수정하기 

- 덮어씌우기가 완료되었다면, 상세 내용을 본인 정보에 맞게 채워넣어 보자.

- **`baseUrl`**
  - 실제 호스팅 될 블로그의 주소를 적어주면 된다.
  - `https://username.github.io/`
- **`title`**
  - 블로그 이름을 정해주자.
- **`primaryColor`**
  - 블로그의 메인 색도 변경할 수 있다.
- **`githubUsername`**
  - 블로그 메인 화면의 깃허브 잔디를 표시하기 위해 깃허브 `username`이 필요하다.
  - 메인 화면에서 보고싶지 않다면, 아래 `showGithubChart = false` 로 숨길 수 있다.
- **`mainImageUrl`**
  - 블로그 메인 화면의 이미지를 표시하기 위한 `image url` 이 필요하다.
  - 메인 화면에서 보고싶지 않다면, 아래 `showGithubChart = false` 로 숨길 수 있다.
- **`googleAnalytics`**
  - GA를 사용해 블로그 통계를 관리할 수도 있다! 일단은 그냥 방치해도 무방.
- **`[[module.imports]]`**
  - 이 path는 우리가 추후 적용할 `freshpink` 테마의 주소이다.
  - 만약 다른 테마를 원한다면 이 부분을 수정해야 한다.

<br>

### 6-5. `theme` 받아오기

- 설정을 마쳤다면 아래 명령어를 입력해 theme 파일을 받아오자.

``` bash
# go.mod 만들기 -> 모듈로 테마를 관리하겠다는 뜻 -> go.mod 가 생성됨
hugo mod init github.com/username/username.github.io

# hugo.toml 파일에 지정한 테마를 모듈로 다운받는다는 뜻
hugo mod get

# 다운로드 후 모듈 정리 등
hugo mod tidy
```

<br>

### 6-5. `theme` 적용 확인하기

- 우선 테스트용 게시글을 하나 만들어본 후, 로컬 서버를 실행해 블로그가 잘 작동하는지 확인해보자.
- 인터넷 브라우저를 켜고 `http://localhost:1313` 주소로 접속하면 확인할 수 있다.

``` bash
# 새로운 글 만들어보기
hugo new posts/hello.md

# 로컬 서버 띄우기 (캐시 무시)
hugo server --ignoreCache --noHTTPCache

# 확인했다면 일단 푸시해주자
git add .
git commit -m "blog init"
git push origin main
```

<br>

### 6-6. `theme` 업데이트

```bash
hugo mod get -u
hugo mod tidy
```

만약 사용하던 테마에 새로운 기능이 추가되었다면 -> 테마를 최신 버전으로 업데이트하기 위해 위 명령어를 사용하면 된다.

<br>
<br>

## 7. 마무리

- 이렇게 로컬 환경에 Hugo 블로그를 무사히 설치했다.
- 이어서 `Github Action` 을 통해 블로그 배포 자동화를 시도해봅시다!
- 🌏 [Github Action 적용하러가기 >>](https://themes.gohugo.io)

<br>
<br>

{{<series title="📚 /Hugo 블로그 만들기" series="hugo" >}}

<br>
<br>

