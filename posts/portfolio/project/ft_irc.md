+++
title = 'FT_IRC'
date = '2024-12-02'
featured_image = 'http://t1.daumcdn.net/movie/ddbe24743b592b34a7776fa250640a4fb5b2bdc8'
+++

<br>

## 📌 Overview

> 42Seoul C++98 기반 IRC 서버 구현

- `ft_irc`는 [IRC(Internet Relay Chat)](https://en.wikipedia.org/wiki/Internet_Relay_Chat) 프로토콜을 직접 구현하는 프로젝트입니다.
- 소켓 프로그래밍과 네트워크 프로토콜의 기본 구조를 유지하면서, 클라이언트 생명주기와 채널 상태 관리 로직을 더 안전하게 정리하는 것을 목표로 합니다.

| 항목 | 내용 |
|---|---|
| 기간 | `2024.10 ~ 2024.11` |
| 스택 | `C++98` `TCP Socket` `poll()` `Makefile` `Docker` `Python` |
| 팀 | 3인 (Server 1 · Cmd 2) |
| 담당 | Server / Infra |

- **주요 업무**
    - `poll()` 기반 non-blocking IRC 서버 이벤트 루프 구현 및 리팩토링
    - 클라이언트 접속, 등록, 종료 생명주기 관리
    - read/write, send buffer, 비정상 disconnect 대응
    - Python 기반 통합 테스트

<br>
<br>

## 🧩 Core features

- **클라이언트 등록**: `PASS`, `NICK`, `USER` 명령을 통해 IRC 클라이언트 등록 상태 관리
- **채널 참여 및 메시징**: `JOIN`, `PART`, `PRIVMSG` 기반 채널 입장, 퇴장, 브로드캐스트 처리
- **운영자 기능**: `KICK`, `INVITE`, `TOPIC`, `MODE` 명령으로 채널 운영 권한 제어
- **채널 모드 관리**: `+i`, `+t`, `+k`, `+o`, `+l` 모드 지원
- **연결 안정성 처리**: non-blocking socket, partial packet buffering, send buffer, timeout 기반 클라이언트 정리

<br>
<br>

## 🏗️ System Architecture

![architecture](https://github.com/elecbrandy/ft_irc_refactor/raw/main/img/irc_arch.png)

<br>

- `ircserv`는 단일 스레드 이벤트 루프 구조
- 서버 socket과 모든 클라이언트 socket을 하나의 `poll()` 루프에서 감시
- 읽기 이벤트가 발생하면 IRC 메시지를 파싱한 뒤 `Cmd` 계층으로 dispatch
- 서버 상태는 `Client`, `Channel`, nickname map을 중심으로 메모리에서 관리

| Layer | Responsibility |
|---|---|
| I/O | 클라이언트 접속 수락, non-blocking read/write, send buffer 관리 |
| Protocol | IRC 메시지 파싱, 명령어 dispatch, numeric reply 생성 |
| State | 클라이언트, 채널, 닉네임 인덱스, 채널 모드 관리 |
| Test | Python socket 기반 통합 테스트로 회귀 검증 |

<br>
<br>

## 🚨 Key Decisions & Troubleshooting

#### 클라이언트 삭제 지연 처리 — 반복자 무효화와 use-after-free 방지

- **문제**
    - `broadcastMsg()`가 `_clients` 또는 channel map을 순회하는 중 `castMsg()`를 호출
    - 죽은 socket으로 전송하다가 `EPIPE`, `ECONNRESET`, `ENOTCONN` 등이 발생하면, 기존 구조에서는 순회 중인 map에서 client를 즉시 erase/delete할 수 있었음
    - 이 경우 반복자 무효화와 use-after-free가 발생할 수 있어 비결정적인 메모리 오류로 이어질 위험이 있었음
- **원인**
    - `QUIT`, ping timeout, write error, `POLLERR/POLLHUP`, broadcast 실패 등 클라이언트 삭제 경로가 여러 곳에 분산됨
    - `markClientForRemoval()`이라는 이름과 달리 실제로는 즉시 teardown까지 수행하던 경로가 있어, 마킹과 삭제의 책임이 섞여 있었음
- **해결**
    - `std::set<int> _toRemove`를 도입해 모든 삭제 경로가 client를 즉시 삭제하지 않고 fd만 표시하도록 변경
    - `markClientForRemoval(fd)`는 마킹 전용, `removeClientFromServer(client)`는 실제 teardown 전용으로 역할 분리
    - 실제 정리는 `cleanupMarkedClients()`에서 poll loop 순회가 끝난 뒤 한 번만 수행
    - channel 퇴장, nickname map 삭제, `_clients` erase, `delete client`, `_fds` 압축을 단일 cleanup 지점으로 통합
    - `acceptClient()`의 `revents = 0` 초기화, `POLLERR/POLLHUP/POLLNVAL` 분기도 함께 추가
- **검증**
    - `make re`, `make test` 통과
    - 다중 클라이언트가 채널에 참여한 뒤 일부가 비정상 종료되고, 남은 클라이언트가 브로드캐스트하는 상황에서 메모리 오류 없이 서버 생존 확인

<br>

#### 테스트 안전망 구축 — 리팩토링 회귀 방지

- **상황**
    - IRC 서버는 실제 socket 연결, 명령어 순서, 서버 응답, 연결 종료 흐름을 함께 검증해야 함
    - 클라이언트 생명주기와 채널 운영자 상태는 수동 테스트만으로 회귀를 잡기 어려웠음
- **결정**
    - `test/run_all.py`를 추가해 `test/test_*.py` 파일을 자동 수집하고 순차 실행
    - `make test`에서 서버 실행 후 Python 통합 테스트를 수행하도록 구성
    - 생명주기 작업 검증을 위해 `make asan` 타깃 추가
- **검증 범위**
    - 등록 흐름과 USER 검증
    - 기본 IRC 명령 처리
    - 운영자 `MODE +o/-o`, `NICK`, `KICK` 흐름
    - 비정상 disconnect 이후 서버 생존 여부
- **결과**
    - 문서 기준 `make test` 4/4 통과
    - ASan/UBSan 빌드로 메모리 오류 여부를 함께 확인할 수 있는 안전망 확보

<br>
<br>

## 🔗 Link

- [GitHub Repo >>](https://github.com/elecbrandy/ft_irc_refactor)

<br>
<br>
