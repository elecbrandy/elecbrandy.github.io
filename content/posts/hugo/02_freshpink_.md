+++
title = 'Hugo 블로그 구축하기 (2)'
date = 2025-05-10
featured_image = "https://i.imgur.com/URQWyyY.png"
tags = ['hugo']
+++

{{<series title="📚 /Hugo 블로그 만들기" series="hugo" >}}

<br>

## 1. 소개

> **Hugo + Github** 조합으로 30분 만에 개인 개발 블로그를 구축하기 (2)

이어서 Github Action을 통해 Hugo 블로그 배포를 자동화해보자.

<br>
<br>

## 2. `Github Action` 설정하기

### 2-1. `workflow` 파일 작성

- 프로젝트 루트에 `.github/workflows/` 디렉토리를 만들고 그 안에 `deploy.yml` 을 생성한다.
- `deploy.yml` 에 아래 내용을 붙여넣는다.
- 우리가 설정할 Github Action의 작동은 다음과 같다.
  1. `Push` main 브랜치에 푸시되면 워크플로가 실행된다.
  2. `Build` Hugo가 public/ 폴더에 정적 사이트를 생성한다.
  3. `Deploy` public/ 내용이 gh-pages 브랜치로 푸시된다.
  4. `Serve` GitHub Pages가 gh-pages 브랜치를 호스팅한다.

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

<br>

### 2-2. `GITHUB_TOKEN`  권한 부여

- 방금 설정한 workflow에서 사용한 `GITHUB_TOKEN` 에게 권한을 부여하자!
  1. 블로그 깃허브 레포지토리 메인 화면으로 진입
  2. 왼쪽 상단 메뉴 탭에서 Settings 클릭
  3. 왼쪽 사이드바 메뉴에서 Actions를 클릭하고, 하위 메뉴인 General에 진입
  4. 화면을 가장 아래로 쭉 스크롤 하면 보이는 `Workflow permissions`라는 항목 찾기
  5. 여기서 `Read and write permissions` 에 체크하고 Save!

<br>

### 2-3. `Github Pages` 위치 지정

- 이제 Github에게 어느 브랜치의 어떤 폴더를 웹사이트로 쓸지 알려주자.
  1. 저장소 화면 오른쪽 상단 Settings 탭 클릭
  2. 왼쪽 사이드 바에서 Pages 메뉴 진입
  3. `build and deployment` 섹션의 Source 드롭다운을 연다.
  4. Branch 항목에서 gh-pages 브랜치를 고르고, / 또는 기본으로 제시되는 폴더를 선택한다.
  5. Save를 눌러 저장하자.

<br>

### 2-4. 우리가 방금 한 일은?

- **우리가 방금 한 일**
  - 블로그에 글을 업로드하는 과정을 최대한 쉽게 자동화한 것이다.
  - 블로그에 글을 올릴 때마다 매번 복잡한 과정을 거쳐야 한다면 매우 번거로울 것이다.

- **자동화가 없을 때의 문제점**
  - 글을 하나 쓸 때마다 다음의 3단계를 직접 수행해야 한다.
    - 빌드: Hugo 명령어를 입력해 소스 코드를 HTML로 변환한다.
    - 이동: 생성된 파일들이 있는 `/public` 으로 이동한다.
    - 업로드: Git 명령어를 통해 서버에 업로드(`add/commit/push`)한다.

- **이렇게 GitHub Actions을 사용하면?**
  - 이 과정이 매우 단순해진다.
  - 개발자는 main 브랜치에 글을 쓰고 `push` 만 하면 된다.
  - GitHub 서버가 자동으로 Hugo를 설치하고 빌드한다.
  - 빌드 결과물을 배포 전용 브랜치인 `gh-pages` 에 자동으로 업데이트한다.

- **브랜치를 나누어 관리하는 이유?**
  - 결과물(`/public`)을 원본 코드와 함께 올리면...
    - 글자 하나만 수정해도 수많은 HTML 파일이 변경된 것으로 인식되어 관리 기록이 복잡해진다.
    - 내가 쓴 글과 Hugo가 만든 결과물이 섞여 관리가 어려워진다.
  - 따라서 다음과 같이 역할을 철저히 분리한다.
    - `main` 브랜치: 내가 직접 작성한 순수한 소스 코드
    - `/public` 폴더는 **.gitignore** 에 등록해 제외
    - `gh-pages` 브랜치: GitHub Action이 자동으로 빌드해준 **최종 결과물(HTML)**만 담아두는 배포 전용 공간으로 활용!

  <br>

## 3. 마무리

이제 복잡한 배포 과정은 신경 쓰지 않아도 된다. 자유롭게 글을 작성하고, 마지막에 `git push` 명령어 한 번만 입력하면 내 블로그가 즉시 업데이트된다 본격적인 테마 사용법이나 나만의 스타일로 커스텀하는 방법이 궁금하다면 아래 링크를 참고하자.

- 🌏 [freshPink 테마 사용방법 알아보기 >>](https://elecbrandy.github.io/posts/project/freshpink/)

<br>
<br>

{{<series title="📚 /Hugo 블로그 만들기" series="hugo" >}}

<br>
<br>



``` markdown
### 내가 여태까지 했던 방식
- 레포지토리 1개로 `/frontend`, `/backend` 디렉토리로 관리.
- makefile + docker-compose로 각각 front, back 컨테이너를 띄우는 방식으로 공통 환경설정 팀원들에게 줬음.
- 브런치 설정
    - main: 실제 버전이 올라갈때 머지
    - dev: front+back 머지용
    - front: 프론트끼리 작업하고 합치는용
    - back: 백끼리 작업하고 합치는용
```