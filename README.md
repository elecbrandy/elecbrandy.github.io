# elecbrandy.github.io

TypeScript로 만든 초경량 정적 블로그. 외부 프레임워크 없이 `src/build.ts` 하나가 마크다운을 HTML로 변환한다.

## 사용법

```bash
npm install      # 최초 1회
npm run build    # dist/ 생성
npm run dev      # 빌드 + http://localhost:4321 프리뷰
```

`main`에 push하면 GitHub Actions가 자동으로 빌드·배포한다.

## 글 쓰기

`posts/<카테고리>/제목.md` 파일을 만들면 끝. **프론트매터는 선택사항**이다.

- **제목**: 프론트매터 `title` → 없으면 본문 첫 `# 제목` → 없으면 파일명
- **날짜**: 프론트매터 `date` → 없으면 git 최초 커밋일 → 없으면 파일 수정일
- **태그**: 프론트매터 `tags` → 없으면 카테고리(폴더명)
- **초안**: 파일명을 `_`로 시작하거나 프론트매터에 `draft = true` → 빌드 제외

기존 Hugo 글의 TOML(`+++`)/YAML(`---`) 프론트매터와 숏코드(`{{<series>}}`, `{{<youtube>}}`, `{{<alert>}}`)는 그대로 렌더링된다.

### 토글(아코디언)

노션 토글처럼 `>!`로 시작하면 접히는 블록이 된다. 이어지는 `>` 줄이 내용이고, 빈 줄이 나오면 끝난다.

```markdown
>! 접히는 제목
> 내용은 **마크다운** 전부 지원.
> - 리스트
> - 코드 블록
```

일반 `>` 인용구는 기존대로 인용구로 렌더링된다.

## 구조

```
posts/      글 (폴더 = 카테고리)
about.md    소개 페이지
home.md     홈 상단 소개문
src/        빌드 스크립트 + 템플릿 + CSS
static/     favicon, 이미지 등 (dist/ 루트로 복사됨)
dist/       빌드 결과물 (커밋 안 함)
```
