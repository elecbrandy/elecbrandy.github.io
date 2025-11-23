+++
title = '[hugo] hugo + github 로 개인 블로그 구축하기'
date = 2025-05-09
draft = false
featured_image = "https://gohugo.io/images/hugo-logo-wide.svg"
tags = ['hugo']
+++

{{<series title="📚 /hugo 튜토리얼" series="hugo" >}}

<br>

## 1. 소개
____

> **Hugo + GitHub hosting + Github Action** 조합으로 30 분 만에 개인 개발 블로그를 구축하기

이런 저런 이유로 인터넷 공간 한 구석에 나만을 위한 원룸이 필요할 때가 있다. 개인 메모용, 혹은 지식을 공유하기 위한 개발 블로그 등등... 나는 마크다운(`.md`) 기반으로 필기하는 습관이 있어 **Hugo + GitHub Pages** 조합을 선택했다.  

1️⃣ **마크다운 그대로 작성**할 수 있다!  
2️⃣ **정적 사이트**이므로 속도가 빠르고 보안 부담이 적다.  
3️⃣ **GitHub Pages**를 이용해 **무료**로 호스팅할 수 있다.   

아래 Hugo 테마 사이트에 들어가면 전세계 Hugo 유저들이 제작한 블로그 테마가 등록되어 있다. 다른 테마를 원하는 경우 아래 링크에서 더 많은, 더 예쁜 테마를 확인해보자!
각 테마 내부에 데모 사이트 접속부터 실제 설치-사용방법까지 적혀있기 때문에 초보자라도 쉽게 따라할 수 있다.  

- 🌏 [Hugo 테마 사이트 방문하기 >>](https://themes.gohugo.io)

물론 대부분 테마의 가이드가 영어로 적혀 있다. 때문에 따라하는 과정에서 시행착오가 존재할 수 있고, 업데이트가 종료된 테마인 경우 최신 Hugo 엔진에서 작동하지 않는 경우도 있다. 따라서 이와 같은 고민을 겪을 초보자를 위해 이 가이드를 작성하며, 우선 내가 작성한 `freshPink` 테마를 사용해 실습해보자.  

<br>
<br>

## 2. 기본 정보
___

가이드에 앞서 우리가 사용할 기술에 대한 간단한 사전 지식을 읽어보자!

- **Github Page** <br>
GitHub Pages는 GitHub 저장소에 있는 HTML, CSS, JS 파일 등의 정적 콘텐츠를 웹사이트로 호스팅해주는 서비스이다. GitHub 계정이 있다면 누구나 추가 비용 없이 웹사이트를 호스팅할 수 있다.  

- **Hugo** <br>
Hugo는 Go 언어로 작성된 정적 사이트 생성기(Static Site Generator)이다. 물론 Go 문법을 몰라도 대부분의 테마를 그대로 사용할 수 있다. 나도 Go 문법은 잘 모른다.  

- **Github Actions** <br>
GitHub Actions 이란 깃허브 저장소 내에서 개발 작업을 자동으로 처리해주는 도구이다. 코드를 저장소에 올렸을 때(이벤트) 자동으로 빌드하고, 테스트하고, 배포하는 등의 반복적인 작업을 자동으로 대신 처리하도록 설정하는 기능이다. 우리는 `.yml` 설정 파일을 통해 기능을 정의할 수 있다. 예를 들어, 코드를 푸시할 때마다 자동으로 오류가 없는지 테스트 하거나, 테스트를 통과하면 자동으로 GitHub Pages에 배포하게 설정할 수 있다.

<br>
<br>

## 3. Github Actions
____

소스코드와 결과물의 분리에서 오는 관리의 이득, 그리고 배포과정 자동화에서 오는 편리성과 휴먼에러 방지 목표로 Github Actions 을 사용하는 것이 좋다.

#### 소스코드와 결과물의 분리
보통 Hugo와 같은 정적 사이트 생성기는 아래 소스와 결과물

- **소스** (`Markdown, 테마, 설정 파일`)
- **결과물** (`HTML, CSS, JS가 담긴 public 폴더`)

이 명확히 구분된다. 만약 사람이 직접 빌드해서 `public` 폴더까지 `main` 브랜치에 같이 올리면, 글자 하나만 수정해도 수많은 HTML 파일이 변경된 것으로 처리되어 커밋 내역이 매우 지저분해진다. 또한, 소스 코드와 컴파일된 코드가 뒤섞여 관리가 어렵다. 따라서 배포 전용 branch를 두면 깔끔하게 처리 가능하다.  

- **main** 브랜치에는 순수한 소스 코드만 관리한다.
- **public** 폴더는 `.gitignore` 에 등록해 무시한다.
- **gh-pages** 브랜치에는 GitHub Action 이 자동으로 빌드해준 **최종 결과물(HTML)** 만 담아둔다.  


#### 배포 과정의 자동화
`CI/CD` 를 사용하지 않으면 글을 쓸 때마다 다음 과정을 수동으로 해야 한다.

- `1` hugo 명령어 입력(빌드)
- `2` public 폴더로 이동
- `3` git add/commit/push

GitHub Actions를 설정해두면, `main` 브랜치에 글을 쓰고 푸시하기만 해도, GitHub 서버가 알아서 Hugo를 설치하고 빌드한 뒤 `gh-pages` 브랜치에 결과물을 업데이트해준다. 과정이 훨씬 간편해진다.  

<br>
<br>

## 4. freshPink 테마 살펴보기

이번 가이드로 사용해볼 테마는 `freshPink` 테마이다. 다음 링크를 접속해서 어떻게 생긴 테마인지, 데모사이트는 어떤지 한번 살펴보자. 마음에 들지 않는다면, 일단 한번 배포까지 연습해보고 나중에 다른 테마로 갈아끼우면 그만이다. 혹은 fork를 떠서 마개조해도 좋다.

- 🌏 [freshPink github 방문 >>](https://github.com/elecbrandy/freshpink)

- 🌏 [freshPink Demo site 방문 >>](https://elecbrandy.github.io/freshpink/)

<br>
<br>

## 5. 설치 방법
___

- ⚠️ **주의사항**
  - 아래 가이드는 **Mac** 기준입니다!
  - `https://github.com/username.github.io` 을 목표로 하는 가이드입니다!
  - Hugo는 반드시 `Extended` 버전으로 설치하세요!
- ⚙️ **파이프라인**
  1. **빌드** Hugo가 소스 파일을 모아 `public/` 디렉터리에 정적 파일을 생성한다.
  2. **배포** Github Action이 `public/` 내용을 **배포 브랜치**(`gh-pages`)에 푸시한다.
  3. **호스팅** GitHub Pages가 배포 브랜치의 정적 파일을 읽어 전 세계에 서비스한다.

<br>

### 5-1. 로컬에 블로그 설치하기

#### 5-1-1. `Go` , `Hugo` 설치하기

```bash
# Go, Hugo 설치하기
brew install go
brew install hugo

# extended 버전인지 확인하기
hugo version
```

`hombrew` 를 통해 Hugo 를 설치할 수 있다. 아직 homebrew가 없다면 아래 링크에서 설치하자.
또한, Hugo가 `extended` 버전으로 설치되었는지 잘 확인하자!

- 🌏 [homebrew 설치하러가기 >>](https://brew.sh/)

<br>

#### 5-1-2. `Github repository` 만들고 `Hugo` 세팅하기

```bash
# 클론 받기
git clone https://github.com/<username>/<username>.github.io.git

# 해당 디렉토리로 이동
cd <username>.github.io

# Hugo site 생성하기 (강제)
hugo new site . --force
```

우선 `username.github.io` 이름으로 Public 레포를 만들고, 클론 받자.
그리고 해당 디렉토리로 이동해서 그 디렉토리 내부에 Hugo 사이트를 생성하자!

<br>

#### 5-1-3. `.gitignore` 추가

``` bash
echo "/public/" >> .gitignore
```

루트 디렉토리에 `.gitignore` 파일을 만들고 안에 `/public/` 을 추가하자. 어처피 우리가 나중에 호스팅할 파일은 다른 브랜치에 모여있을 예정이기 때문이다.

<br>

#### 5-1-4. `hugo.toml` 설정하기

디렉토리에 생성된 `hugo.toml` 파일을 열고, 기존 내용은 모두 지운 뒤 아래 내용을 복사해서 붙여넣자!
그리고 각 부분은 본인 정보에 맞게 채워넣어 보자.

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

⤵️ _변경 가능한 부분들_ 

- **baseUrl**
  - 실제 호스팅 될 블로그의 주소를 적어주면 된다.
  - `https://username.github.io/`
- **title**
  - 블로그 이름을 정해주자.
- **primaryColor**
  - 블로그의 메인 색도 변경할 수 있다.
- **githubUsername**
  - 블로그 메인 화면의 깃허브 잔디를 표시하기 위해 깃허브 `username`이 필요하다.
  - 메인 화면에서 보고싶지 않다면, 아래 `showGithubChart = false` 로 숨길 수 있다.
- **mainImageUrl**
  - 블로그 메인 화면의 이미지를 표시하기 위한 `image url` 이 필요하다.
  - 메인 화면에서 보고싶지 않다면, 아래 `showGithubChart = false` 로 숨길 수 있다.
- **googleAnalytics**
  - GA를 사용해 블로그 통계를 관리할 수도 있다!
- **[[module.imports]]**
  - 이 path는 우리가 추후 적용할 `freshpink` 테마의 주소이다.
  - 만약 다른 테마를 원한다면 이 부분을 수정해야 한다.
  - 물론 이 부분 뿐만 아니라 각 테마마다 세팅이 다르기 때문에, 해당 테마에서 제공하는 설명을 정독하고 처음부터 다시 만드는 것이 좋을 듯 하다.

<br>

#### 5-1-5. `theme` 받아오기

설정을 마쳤다면 아래 명령어를 입력해 theme 파일을 받아오자.

```bash
# go.mod 만들기 -> 모듈로 테마를 관리하겠다는 뜻 -> go.mod 가 생성됨
hugo mod init github.com/username/username.github.io

# hugo.toml 파일에 지정한 테마를 모듈로 다운받는다는 뜻
hugo mod get

# 다운로드 후 모듈 정리 등
hugo mod tidy
```

<br>

#### 5-1-6. 로컬에서 확인하기

```bash
# 새로운 글 만들어보기
hugo new posts/hello.md

# 로컬 서버 띄우기 (캐시 무시)
hugo server --ignoreCache --noHTTPCache

# 확인했다면 일단 푸시해주자
git add .
git commit -m "blog init"
git push origin main
```

우선 테스트용 게시글을 하나 만들어본 후, 로컬 서버를 실행해 블로그가 잘 작동하는지 확인해보자.
인터넷 브라우저를 켜고 [http://localhost:1313](https://www.google.com/search?q=http://localhost:1313) 주소로 접속하면 적용된 테마를 볼 수 있다!

<br>

#### 5-1-7. 업데이트

```bash
hugo mod get -u
hugo mod tidy
```

만약 사용하던 테마에 새로운 기능이 추가되었다면 -> 테마를 최신 버전으로 업데이트하기 위해 위 명령어를 사용하면 된다.

<br>
<br>

### 5-2. `Github Action` 설정하기

#### 5-2-1. `workflow` 파일 작성

프로젝트 루트에 `.github/workflows/` 디렉토리를 만들고 그 안에 `deploy.yml` 을 생성한다. `deploy.yml` 에 아래 내용을 붙여넣는다.

``` yml
name: Deploy Hugo Site

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          submodules: true

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          extended: true

      - name: Build site
        run: hugo --destination public

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          keep_files: false
```

1. `Push` main 브랜치에 푸시되면 워크플로가 실행된다.
2. `Build` Hugo가 public/ 폴더에 정적 사이트를 생성한다.
3. `Deploy` public/ 내용이 gh-pages 브랜치로 푸시된다.
4. `Serve` GitHub Pages가 gh-pages 브랜치를 호스팅한다.

<br>

#### 5-2-2. 토큰 권한 부여

- **GITHUB_TOKEN이란?** <br>
우리가 사용한 토큰은 `GITHUB_TOKEN` 이다.  
이 토큰은 workflow가 시작될 때 깃허브가 자동으로 발급해준다. 또한, workflow 가 끝나면 즉시 사라진다. `Settings -> Secrets` 메뉴에 가도 안 보이지만, `${{ secrets.GITHUB_TOKEN }}` 이라고 쓰면 사용할 수 있다. 

<br> 

- **권한 부여**
  1. 블로그 레포지토리 메인 화면으로 진입
  2. 왼쪽 상단 메뉴 탭에서 Settings 클릭
  3. 왼쪽 사이드바 메뉴에서 Actions를 클릭하고, 하위 메뉴인 General에 진입
  4. 화면을 가장 아래로 쭉 스크롤 하면 보이는 `Workflow permissions`라는 항목 찾기
  5. 여기서 `Read and write permissions` 에 체크하고 Save!

#### 5-2-3. `Github Pages` 위치 지정

이제 Github Page가 어느 브랜치의 어떤 폴더를 웹사이트로 쓸지 알려줘야 한다!

- `Github Pages` **위치 지정**
  1. 저장소 화면 오른쪽 상단 Settings 탭 클릭
  2. 왼쪽 사이드 바에서 Pages 메뉴 진입
  3. `build and deployment` 섹션의 Source 드롭다운을 연다.
  4. Branch 항복에서 gh-pages 브랜치를 고르고, / 또는 기본으로 제시되는 폴더를 선택한다.
  5. Save를 눌러 저장하자.

<br>
<br>

## 6. How to use?

_____

이제 블로그 디렉토리에서 한창 글을 쓰다가, 단순 `git push` 만으로 블로그가 자동 빌드‧배포된다. 본격적인 테마의 사용 방법이나, 커스텀 방법이 궁금하다면 아래 링크를 읽어보자.

- 🌏 [freshPink 테마 사용방법 알아보기 >>](https://elecbrandy.github.io/posts/project/freshpink/)

<br>
<br>

{{<series title="📚 /hugo 튜토리얼" series="hugo" >}}

<br>
<br>