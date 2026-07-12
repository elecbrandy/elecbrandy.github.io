+++
title = 'MINISHELL'
date = '2024-06-01'
featured_image = 'http://t1.daumcdn.net/cfile/15110210A862C131F7'
+++

<br>

## 📌 Overview

> 42Seoul C 기반 간단한 shell 구현

- `minishell`은 shell을 직접 구현하는 프로젝트입니다.
- 사용자의 명령어를 읽고, 파싱한 뒤, 필요한 프로세스를 생성해 실행합니다.

| 항목 | 내용 |
|---|---|
| 기간 | `2024.05 ~ 2024.06` |
| 스택 | `C` `Makefile` `readline` `fork()` `execve()` `pipe()` `dup2()` |
| 팀 | 2인 |
| 담당 | Cmd / Pipe Redirection |

- **주요 업무**
    - command node 기반 실행 구조 구현
    - builtin 명령어 처리
    - pipe, redirection 실행 흐름 처리
    - 환경 변수 linked list 관리
    - process fork, execve, wait 처리
    - signal handler 구성

<br>
<br>

## 🧩 Core features

- **Prompt 입력**: `readline()` 기반 interactive shell prompt 제공
- **명령어 파싱**: command, argument, quote, pipe, redirection 처리
- **환경 변수 확장**: `$VAR`, `$?` 기반 문자열 치환
- **Redirection**: `<`, `>`, `>>`, `<<` 처리
- **Pipe**: command node chain을 기반으로 파이프라인 명령 실행
- **Builtin**: `echo`, `cd`, `pwd`, `export`, `unset`, `env`, `exit` 구현
- **External Command**: `PATH` 탐색 후 `execve()`로 외부 명령 실행
- **Signal 처리**: interactive, child, heredoc 상황별 signal handler 구성

<br>
<br>

## 🏗️ System Architecture

![architecture](https://github.com/elecbrandy/minishell/raw/main/img/mini_arch.png)

<br>

- `readline()`으로 입력을 받은 뒤 parser와 executor를 순차적으로 거
- parser는  `;`, `|`, quote, dollar expansion, redirection 기준으로 해석
- 각 cmd는 `t_node` linked list에 저장
- executor는 command node 개수와 builtin 여부에 따라
    - 부모 프로세스 실행
    - 또는 `fork()` 실행을 결정합니다.
- 외부 명령은 환경 변수 list를 배열로 변환한 뒤 `execve()`에 전달

| Layer | Responsibility |
|---|---|
| Input | readline prompt, history 관리 |
| Parser | quote, dollar expansion, pipe, redirection, heredoc 처리 |
| Node | command, path, input fd, output fd, previous error number 저장 |
| Exec | builtin dispatch, fork, pipe, dup2, wait, execve 처리 |
| Env | environment linked list 생성, 추가, 삭제, 배열 변환 |
| Signal | prompt, child, heredoc signal handler 관리 |

<br>
<br>

## 🚨 Key Decisions & Troubleshooting

#### command node 기반 실행 구조

- **상황**
    - 단일 명령어, redirection 명령어, pipe 명령어를 같은 실행 흐름에서 처리해야 했음
- **구조**
    - parser가 각 command를 `t_node`로 변환
    - `t_node`는 `cmd`, `path`, `in_fd`, `out_fd`, `prev_errnum`, `next`를 보관
    - pipe로 연결된 명령은 linked list 형태로 저장
- **처리**
    - `processing()`에서 node 개수를 계산
    - node가 하나이면 단일 명령으로 처리
    - node가 여러 개이면 `pipe()`와 `dup2()`를 사용해 앞뒤 command를 연결

<br>

#### pipe 연속 생성 시 fd 누수 문제 해결

- **문제**
    - pipe가 길게 이어지는 명령을 반복 실행하면 shell이 불안정
    - pipe를 정리하지 않으면, 프로세스가 불필요한 read/write end를 계속 들고 있게 됨
    - 그 결과 pipe 입력 종료가 제대로 전달되지 않거나, 반복 실행 시 fd가 누적되어 실행 흐름이 깨지는 현상 발견
- **해결**
    - 현재 cmd와 다음 cmd 사이에 필요한 pipe 하나만 생성하게 정리
    - child process에서는 `fd[1]` 을 `STDOUT` 에 `dup2()` 한 뒤 사용하지 않는 pipe fd를 닫음
    - parent process에서는 fd[0]을 `STDIN` 에 `dup2()` 해 다음 cmd의 입력으로 넘기고, 기존 pipe 정리
    - 다음 cmd는 부모의 갱신된 `STDIN` 을 상속받아 이전  cmd의 출력과 자연스럽게 연결됨
    - pipeline 실행이 끝난 뒤에는 `save_stdio()/restore_stdio()` 로 shell의 원래 표준 입출력을 복구
- **결과**
    - pipe fd를 누적해서 관리하지 않고 한 단계씩 재사용하는 구조
    - 긴 pipe 명령을 반복 실행해도 이전 pipe fd가 남아 다음 실행에 영향을 주지 X

<br>

#### builtin과 외부 명령 실행 분리

- **상황**
    - `cd`, `export`, `unset`, `exit`처럼 shell 상태를 바꾸는 명령은 부모 프로세스에서 처리해야 함
    - 외부 명령은 `fork()` 이후 child process에서 실행해야 함
- **구조**
    - `is_builtin()`으로 builtin 여부 판별
    - 단일 builtin은 부모 프로세스에서 직접 실행
    - 외부 명령은 `find_path()`로 실행 경로를 찾은 뒤 `execve()` 호출
- **지원 builtin**
    - `echo`, `cd`, `pwd`, `export`, `unset`, `env`, `exit`

<br>
<br>

## 🔗 Link

- [GitHub Repo >>](https://github.com/elecbrandy/minishell)

<br>
<br>
