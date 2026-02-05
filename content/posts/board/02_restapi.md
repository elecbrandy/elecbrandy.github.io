+++
title = '[게시판] REST API 명세서'
date = 2026-02-05
featured_image = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Spring_Boot.svg/330px-Spring_Boot.svg.png"
tags = ['skala','springboot','board']
+++

{{<series title="🍀 게시판 개발" series="board">}}

<br>

- REST API 개발을 위한 요구사항 명세서
- BaseUrl: `http://localhost:8080`
- Auth Type: `Bearer Token (JWT)`
- Auth Header: `Authorization: Bearer {token}`

<br>

## 1. 공통 응답 구조

- 모든 API 요청은 HTTP 상태 코드 **200 OK**를 반환
- 실제 성공/실패 여부는 Response Body의 `status` 필드로 확인

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `status` | String | 응답 상태 (`success`, `fail`, `error`) |
| `message` | String | 응답 메시지 (성공 시 알림, 실패 시 에러 사유) |
| `data` | Object | 실제 데이터 페이로드 (데이터가 없는 경우 `null`) |

```json
{
  "status": "success",
  "message": "string",
  "data": {}
}
```

<br>
<br>
<br>

## 2. REST API 명세

_추가예정_

{{<series title="🍀 게시판 개발" series="board">}}