+++
title = '[hugo] freshPink 테마'
date = 2025-05-11
draft = false
featured_image = "https://i.imgur.com/URQWyyY.png"
tags = ['hugo']
+++

{{<series title="📚 /hugo 튜토리얼" series="hugo" >}}

<br>

## 1. 소개


> How to use freshPink

Hugo 테마는 종류도 정말 많고, 각 테마마다 지원하는 기능이 다양하기 때문에 잘 활용하기 위해서는 각 테마가 지원하는 기능을 알아두는 것이 좋다. 이번 기회에 `freshPink` 테마의 지원 기능에 대해서 알아보자.

<br>
<br>

## 2. 지원 기능 목록

_

⤵️ _클릭 시 이동_ 

1. [메인 화면 이미지](#3-1-메인-화면-이미지)
2. [메인 화면 깃허브 잔디](#3-2-메인-화면-github-잔디)
3. [메인 컬러 변경](#3-3-primary-color-변경)
4. [Front Matter](#3-4-front-matter-살펴보기)
5. [태그 기능](#3-5-tags)
6. [시리즈 리스트](#3-6-시리즈-만들기)
7. [기타](#3-7-기타-기능)
    - dark 모드 지원
    - TOC
    - Back to Top 버튼
    

<br>
<br>

## 3. 기능 사용하기



각 기능을 어떻게 제어하고, 사용할 수 있는지 알아보자.

<br>

### 3-1. 메인 화면 이미지

``` toml
[params]
    mainImageUrl = "https://i.imgur.com/URQWyyY.png"
    showMainImage = true
```

- `freshPink` 테마는 메인 페이지에 원하는 이미지를 노출할 수 있는 기능을 제공한다.
- 원하는 이미지의 url을 `hugo.toml -> mainImageUrl` 속성에 기입하면 된다.
- 이미지 노출 여부는 `hugo.toml -> showMainImage` 속성으로 제어할 수 있다.
    - `showMainImage = true` : 이미지 ON
    - `showMainImage = false` : 이미지 OFF

<br>
<br>

### 3-2. 메인 화면 `Github` 잔디

``` toml
[params]
    githubUsername = "username"
    showGithubChart = true
```

- `freshPink` 테마는 메인 페이지에 자신의 깃허브 잔디를 노출할 수 있는 기능을 제공한다.
- 자신의 깃허브 아이디를 `hugo.toml -> githubUsername` 속성에 기입하면 된다.
- 잔디 노출 여부는 `hugo.toml -> showGithubChart` 속성으로 제어할 수 있다.
    - `showGithubChart = true` : 잔디 ON
    - `showGithubChart = false` : 잔디 OFF

<br>
<br>

### 3-3. Primary Color 변경

``` toml
[params]
    primaryColor = "#fa8b84"
```

- `freshPink` 테마는 `primaryColor` 를 변경할 수 있는 기능을 제공한다.
- 이 색상은 Github 잔디 색상, a태그 호버 색상, 인용 문구 배경 색상 등을 결정한다.

<br>
<br>

### 3-4. `Front Matter` 살펴보기

``` markdown
+++
title = '03. Shortcuts'
date = 2000-10-10
draft = false
featured_image = "img.url..."
tags = ['tag_b']
+++
```

- Front Matte r란 마크다운 파일의 머리말 역할을 하며, Hugo가 글을 빌드할 때 필요한 메타데이터를 담는 구역이다.
    - `title` : 글 제목
    - `date` : 작성 날짜
    - `draft` : 초안 여부 (true면 빌드 시 무시됨, false면 공개됨)
    - `tags` : 태그 달기
    - `featured_image` : 해당 게시글 상단에 이미지가 표시된다.

<br>
<br>

### 3-5. Tags

각 `.md` 파일의 Front Matter를 보면 `tags = []` 필드가 있다. 이 필드를 사용하여 게시글에 태그를 지정한다.
네비게이션 바의 tag 탭을 통해 지정된 태그별로 글을 분류해서 볼 수 있다.

``` markdown
tags = ['tag_a']
```

여러 개의 태그를 동시에 지정할 수도 있다.

``` markdown
tags = ['tag_a', 'tag_c']
```

태그별로 글을 모아보려면 **태그 페이지**를 생성해야 한다.

1.  `content/tags` 경로로 이동한다 (폴더가 없다면 생성한다).
2.  그 안에 태그 이름과 동일한 디렉토리를 생성한다 (예: `unix`).
    이렇게 하면 `content/tags/unix` 경로가 생성되며 설정이 완료된다.

<br>
<br>

### 3-6. 시리즈 만들기

때로는 태그만으로는 분류하기 어려운 글들이 있다. 이런 경우, 특정 글들을 "freshPink" 와 같이 하나의 시리즈로 묶어 관리하고자 할 때 유용하다. 시리즈를 생성하면 관련 글들을 한곳에서 관리하기가 수월해진다. 각 마크다운 파일에 접을 수 있는 리스트 형태의 링크를 추가하면, 글 간의 이동이 편리해지고 시리즈를 체계적으로 정리할 수 있다.

<br>

#### 3-6-1. 시리즈 데이터 파일 생성하기

먼저 각 시리즈에 포함될 문서 정보를 담은 데이터 파일을 생성해야 한다. 블로그의 `data/series` 디렉토리(없으면 만들자) 아래에 YAML 파일을 만들어 시리즈 정보를 관리한다.

```yaml
title: "freshPink"
items:
  - name: "01. freshPink"
    link: "https://elecbrandy.github.io/posts/post-1"
  - name: "03. features"
    link: "https://elecbrandy.github.io/posts/post-2"
  - name: "03. shortcuts"
    link: "https://elecbrandy.github.io/posts/post-3"
```

이 파일의 `items` 리스트에는 해당 시리즈에 속하는 각 문서의 이름과 링크를 작성한다.

<br>

#### 3-6-2. 생성한 시리즈 리스트 사용하기

마크다운 파일 내에 시리즈를 표시하려면 다음과 같이 숏코드를 사용한다.

```markdown
{{</* series title="📚 /hugo 튜토리얼" series="hugo" */>}}
```
  - `title`: 사용자가 클릭하여 리스트를 펼칠 때 보이는 제목이다.
  - `series`: `data/series/` 디렉토리에 있는 YAML 파일의 이름(확장자 제외)을 지정한다.

<br>

#### 3-6-3. 시리즈 리스트 예시

{{< series title="📚 /hugo 튜토리얼" series="hugo" >}}

<br>
<br>

### 3-7. 기타 기능

#### 3-7-1. Table of Contents (TOC)
게시글의 왼쪽에 **목차(TOC)** 가 포함되어 있다. 기본적으로 목차는 글을 읽는 동안 시선을 방해하지 않도록 투명하게 처리된다. 마우스를 목차 위에 올리면(Hover) 목차가 표시되며 클릭 가능 상태가 된다.

<br>

#### 3-7-2. Back to Top Button
**맨 위로 가기** 버튼이 [Vanilla Back to Top](https://github.com/vfeskov/vanilla-back-to-top). 기능을 통해 포함되어 있다. 이 기능은 사용자가 페이지의 맨 위로 빠르게 돌아갈 수 있도록 도와준다.

<br>

#### 3-7-3. dark 모드 지원

네비게이션 바의 `/tolight`, `/todark` 를 통해 모드를 변환할 수 있다!

<br>
<br>

{{<series title="📚 /hugo 튜토리얼" series="hugo" >}}

<br>
<br>
