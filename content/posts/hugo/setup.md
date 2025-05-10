+++
title = '[hugo] hugo + github 호스팅으로 개인 블로그 구축하기'
date = 2025-05-09
draft = false
featured_image = "https://gohugo.io/images/hugo-logo-wide.svg"
tags = ['hugo']
+++

<br>

## 1. 소개
____

> Hugo + GitHub Pages 조합으로 30 분 만에 개인 개발 블로그를 구축하기

컴퓨터 공부를 하다 보면 학습 내용을 정리할 공간이 필요하다. 개인 메모용으로, 혹은 지식을 공유하기 위해 개발 블로그를 운영하는 경우가 많다. 플랫폼은 네이버 블로그, 티스토리, Medium 등 다양하지만, 나는 마크다운(`.md`) 기반으로 필기하는 습관이 있어 **Hugo + GitHub Pages** 조합을 선택하였다. 이 방식은 다음과 같은 이점을 제공한다.

- **마크다운 그대로 작성**할 수 있다!
- **정적 사이트**이므로 속도가 빠르고 보안 부담이 적다.
- **GitHub Pages**를 이용해 **무료**로 호스팅할 수 있다.

그러나 한국어 자료가 적어 시행착오가 있었다. 같은 고민을 겪을 초보자를 위해 이 가이드를 작성한다. 예시 테마는 내가 제작한 [freshPink](https://elecbrandy.github.io/freshpink/)이다.  

아래 가이드를 따라서 30 분 안에 다음 구성을 갖춘 블로그를 완성해보자!
- 마크다운 기반 게시글
- 테마(freshPink) 적용
- GitHub Actions를 통한 자동 배포(CI/CD)

<br>
<br>

## 2. Hugo란?

___

Hugo는 **Go 언어로 작성된 정적 사이트 생성기**(Static Site Generator)이다. 물론 Go 문법을 몰라도 대부분의 테마를 그대로 사용할 수 있다.

**Hugo에 입력되는 것들...**  
`content/`의 마크다운, `layouts/`의 레이아웃, `static/`의 이미지‧CSS‧JS, `config.toml` 설정  


**Hugo에서 출력되는 것들...**  
HTML‧CSS‧JS로 구성된 완전한 정적 웹사이트

<br>

### 2‑1. Hugo 동작 원리

1. **빌드** `hugo` 명령을 실행하면 Hugo가 소스 파일을 모아 `public/` 디렉터리에 정적 파일을 생성한다.
2. **배포** CI/CD가 이 `public/` 내용을 **배포 브랜치**(`gh-pages`)에 푸시한다.
3. **호스팅** GitHub Pages가 배포 브랜치의 정적 파일을 읽어 전 세계에 서비스한다.

정리하면 `Hugo → public/ → 배포 브랜치 → GitHub Pages` 순서로 진행된다.

<br>
<br>

## 3. Step by Step (MacBook M1 기준)

___

### 3‑1. GitHub 리포지토리 세팅

**1. 새 리포지토리 생성**  
`username.github.io` 이름으로 Public 레포를 만든다.  

**2. 클론**  

```bash
git clone https://github.com/<username>/<username>.github.io.git
cd <username>.github.io
```

<br>
<br>

### 3‑2. Hugo 설치 및 사이트 초기화

**1. Homebrew 설치**  
없다면 [brew.sh](https://brew.sh/) 참고  

**2. Hugo 설치 후 사이트 초기화**  
```bash
# hugo 설치
brew install hugo

# hugo 초기화
cd <username>.github.io.git
hugo new site .
```  

초기화 후 구조는 다음과 같다.

``` bash
.
├── archetypes/
├── content/
├── data/
├── layouts/
├── static/
├── config.toml
└── themes/
```

<br>
<br>

### 3‑3. freshPink 테마 설치 (Hugo Modules)

**1. 모듈 초기화 후 테마 설치**  

```bash
# 모듈 초기화
hugo mod init github.com/<username>/<username>.github.io

# freshpink 테마 설치
hugo mod get github.com/elecbrandy/freshpink
```  

<br>

**2. hugo.toml 세팅**  
Hugo에서 `hugo.toml`은 사이트 전체 설정을 담는 구성 파일이다. 이 파일에 적힌 내용에 따라 Hugo가 사이트를 어떻게 생성하고 보여줄지를 결정한다.  

기존에 있던 `hugo.toml` 의 내용을 전부 지우고, 아래 내용으로 복붙하자. 그 이후 필요한 정보를 기입하면 된다.

```toml
baseURL = "https://elecbrandy.github.io/"
languageCode = "en-us"
title = "elecbrandy"
canonifyURLs = true

[[menus.main]]
name = 'Home'
url = '/'
weight = 10

[[menus.main]]
name = 'TAGS'
url = '/tags/'
weight = 20

[[menus.main]]
name = 'ABOUT'
url = '/about/'
weight = 30

[module]
  [module.hugoVersion]
    extended = true
    min = "0.116.0"
  [[module.imports]]
    path = "github.com/elecbrandy/freshpink"

[params]
  googleAnalytics = 'G-000000000' # your GoogleAnalytics code
  githubUsername = 'elecbrandy' # your githubUsername
  copyright = 'Copyright © 2024 elecbrandy'
  math = true

[taxonomies]
  tag = "tags"

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```

우리가 기입해야하는 정보는 다음과 같다!

- `baseURL`: github 레포지토리의 주소 (예시: https://elecbrandy.github.io/)
- `title`: 블로그 이름 정해서 기입하기
- `githubUsername`:
	- github 유저네임 기입
	- freshpink 테마 상 main 화면 잔디 노출 용도
- `googleAnalytics`:
	- 구글 애널리틱스 사용할 경우 기입
	- 사용하지 않을 경우 그대로 두어도 무방

<br>
<br>

### 3-2. 로컬 확인

```bash
# 기본 실행
hugo server
# 초안 글 포함
hugo server -D
# 캐시 무시
hugo server --ignoreCache --noHTTPCache
```

브라우저에서 [http://localhost:1313/](http://localhost:1313/) 로 접속해 테마가 적용되었는지 확인한다.

<br>
<br>

## 4. CI/CD 파이프라인

### 4‑1. 사전 준비

GitHub Pages와 액션용 Secret 설정은 한 번만 해두면 끝나는 작업이다. 우리는 배포용으로 `gh-pages` 브랜치를 사용할 것이다. 이때 워크플로가 `gh-pages` 브랜치에 파일을 푸시하려면 인증 토큰이 필요하다. 이를 Secret으로 저장해 두면된다. 아래 설명을 차근차근 따라 해보자!

- **GitHub Pages 위치 지정**
	1. 저장소(Repo) 화면 오른쪽 위의 **Settings** 탭을 클릭한다.
	2. 왼쪽 사이드바에서 **Pages** 메뉴를 선택한다.
	3. “Build and deployment” 섹션의 **Source** 드롭다운을 연다.
	4. **Branch** 항목에서 `gh-pages` 브랜치를 고르고, **/ (root)** 또는 기본으로 제시되는 폴더를 선택한다.
		- 아직 `gh-pages` 브랜치가 없더라도 괜찮다.
		- 처음 배포가 끝나면 이 브랜치가 자동으로 생성되고, 방금 지정한 위치에 파일이 올라가 사이트가 열리게 된다.
	5. **Save** 버튼을 누르면 설정이 완료된다.

_즉, “Pages가 어느 브랜치의 어떤 폴더를 웹사이트로 쓸지” 미리 알려 주는 단계_

- **인증 토큰 발급**
	1. 다시 **Settings** 탭에서 왼쪽 메뉴 중 **Secrets and variables → Actions** 를 선택한다.
	2. **New repository secret** 버튼을 클릭한다.
	3. **Name** 칸에 **`BLOG`** 라고 입력한다.
	4. **Secret** 칸에는
	- 간단히 쓸 경우: `${{ github.token }}` 대신 **개인 액세스 토큰(PAT)** 을 만들어 붙여 넣는다.
	- 토큰 생성은 GitHub 프로필 → Settings → **Developer settings → Personal access tokens**(Fine-grained or classic)에서 가능하다.
	- 권한은 **repo** (저장소 전체)만 체크해 두면 충분하다.
	5. **Add secret** 를 눌러 저장한다.  

_즉, 요약: 워크플로 파일에서 `github_token: ${{ secrets.BLOG }}` 로 참조할 수 있게 “BLOG”라는 안전한 비밀번호를 등록해 두는 단계다._  

<br>

### 4‑2. 워크플로 파일 작성

프로젝트 루트에 `.github/workflows/` 디렉토리를 만들고 그 안에 `deploy.yml` 을 생성한다.
`deploy.yml` 에 아래 내용을 붙여넣는다.

```yaml
name: Deploy Hugo Site

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
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
          github_token: ${{ secrets.BLOG }}
          publish_dir: ./public
          keep_files: false
```
<br>
<br>

### 4‑3. 동작과 배포

1. **Push** `main` 브랜치에 푸시되면 워크플로가 실행된다.
2. **Build** Hugo가 `public/` 폴더에 정적 사이트를 생성한다.
3. **Deploy** `public/` 내용이 `gh-pages` 브랜치로 푸시된다.
4. **Serve** GitHub Pages가 `gh-pages` 브랜치를 호스팅한다.

<br>
<br>

## 5. 마무리
____

이제 마크다운으로 글 작성 → `git push` 만으로 블로그가 자동 빌드‧배포된다. 추가로 다음을 시도해 볼 수 있다. 궁금한 점이나 오류가 있다면 GitHub Issues에 남겨 주시면 감사하겠다..!

<br>
<br>
