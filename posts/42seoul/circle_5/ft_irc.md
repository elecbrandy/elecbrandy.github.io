+++
title = 'ft_irc'
date = '2024-11-20'
featured_image = "https://www.shutterstock.com/ko/blog/wp-content/uploads/sites/17/2020/09/showing-text-banner.jpg"
tags = ['c', '42seoul']
+++

{{<series title="📚 42seoul" series="42seoul">}}

<br>

## 1. 소개


> Internet Relay Chat

본과정에서 열세 번째로 진행한 과제로, C++을 활용하여 IRC(Internet Relay Chat) 서버를 구현하는 팀 과제이다.
이번 프로젝트는 IRC 프로토콜을 기반으로 한 채팅 서버를 구현하는 것이 목적이었다.
IRC는 오래된 프로토콜로, 기본적인 RFC 문서를 바탕으로 하되 실제 상용 클라이언트와의 호환성을 확보하기 위해서는 추가적인 분석과 적용이 필요했다.
따라서 RFC 공식 문서를 기본으로 삼고, 실제로 사용되는 상용 서버 및 클라이언트 간의 통신 과정을 분석하여 구현하였다.  

과제는 3명의 팀원이 함께 진행하였다. 나는 소켓 프로그래밍, 서버 구현 및 버퍼 관리를 담당했다. 나머지 두 팀원이 각각 명령어 구현과 irc 프로토콜과 레퍼런스에 따라 기본 사항 구현을 담당했다.
각 분야 개발이 끝나고, 디버깅을 하며 상세한 프로토콜 요구사항을 맞춰 완성했다. 이 과정에서 팀원 모두가 동일한 환경에서 테스트할 수 있도록 docker 컨테이너를 하나 만들어 사용했다.
docker 컨테이너를 통해 환경 구축을 표준화하여, 팀원들이 빠르게 환경을 구축하고 동일한 조건에서 테스트를 수행할 수 있었다. docker의 강력함을 몸소 느낄 수 있었다...

- 상용 IRC 서버와 클라이언트 간의 실제 통신 로그 분석
- 우리 서버와 상용 클라이언트 간의 통신 테스트 및 로그 검토

‼️ **소켓 프로그래밍에 대한 이해가 있고, 바로 과제에 대한 정보를 얻고 싶다면?** ‼️   
[_FT_IRC서버전송중너만오면고_](#custom-id)   (<< click!!!) 

<br>
<br>
<br>

## 2. ft_irc 명세서


- **PROGRAM NAME**
	- `ircserv`
- **Arguments**
	- `port`: The listening port
	- `password`: The connection password
- **DESCRIPTION**  
    - overview 참조
- **EXTERNAL FUNCTIONS**
	- Everything in C++ 98.
    - socket, close, setsockopt, getsockname, getprotobyname, gethostbyname, getaddrinfo, freeaddrinfo, bind, connect, listen, accept, htons, htonl, ntohs, ntohl, inet_addr, inet_ntoa, send, recv, signal, sigaction, lseek, fstat, fcntl, poll, (or equivalent)

<br>

### 2-1. Overview
- c++로 irc 프로토콜로 상호작용하는 서버를 만드는 과제이다. 단일서버로, 서버-서버 연결은 구현하지 않아도 된다.
- 수신받은 패킷은 이어붙여서 처리해야한다. (예시: com^Dman^Dd -> command)
- 구현해야하는 명령어
    - `KICK`: 채널에서 클라이언트 강제 퇴장
    - `INVITE`: 특정 클라이언트를 채널로 초대
    - `TOPIC`: 채널 주제 변경 또는 조회
    - `MODE`
        - `i`: 초대 전용 채널 설정/해제
        - `t`: 운영자만 채널 주제 변경 가능하도록 설정/해제
        - `k`: 채널 비밀번호 설정/해제
        - `o`: 운영자 권한 부여/박탈
        - `l`: 채널 인원 제한 설정/해체

<br>
<br>
<br>

## 3. 개념 정리


1. irc가 뭔지 정체를 우선 알아보자.
1. 소켓 프로그래밍의 작동 방식을 공부하고
2. 작동 중 나타나는 동기, 비동기 방식을 알아보고
3. 어떤 방식으로 처리해야하는지 공부해보자.

<br>

### 3-1. IRC 프로토콜

IRC(Internet Relay Chat) 프로토콜은 RFC 1459, RFC 2810 등 여러 공식 문서에 걸쳐 정의되어 있으며, 설계 원칙부터 명령 포맷, 동작 방식까지 매우 상세하게 기술되어 있다.
하지만 IRC는 역사가 오래된 만큼 다양한 RFC 버전이 존재하고, 현재도 서버/클라이언트마다 프로토콜 해석과 구현이 조금씩 다르기 때문에, **초기에는 하나의 구현을 기준으로 삼는 것이 중요** 하다.

#### 3-1-1. 간단한 역사

IRC는 1988년 핀란드 대학생 Jarkko Oikarinen 이 기존 채팅 시스템의 한계를 극복하기 위해 개발을 시작했다.
1989년부터 유럽과 북미로 빠르게 퍼지며, 전 세계적으로 가장 널리 쓰이는 실시간 채팅 수단 중 하나가 되었다.

1993년 5월, **RFC 1459**를 통해 IRC 프로토콜이 공식 표준으로 정의되었으며, 이후 **RFC 2810\~2813** 등이 보완사항을 제시하면서 확장되었다.

IRC는 당대 최초로 **채널 개념**을 도입했고, **서버 간 네트워크 구성**, **실시간 사용자 리스트**, **닉네임 변경**, **프라이빗 메시지** 기능 등 현대 채팅의 기반을 다진 시스템이다.
오늘날에는 Slack, Discord 같은 신세대 서비스에 밀려나긴 했지만, 여전히 상용 IRC 서버와 클라이언트는 존재하며, 각자 프로토콜을 조금씩 개량해 사용 중이다.

_이번 프로젝트에서는 서버는 **InspIRCd**, 클라이언트는 **irssi**를 기준으로 테스트했다._

#### 3-1-2. 프로토콜 개요

IRC 프로토콜은 텍스트 기반이며, 클라이언트와 서버 간에 주고받는 메시지는 특정한 포맷을 따른다.
특히 처음 접속 시 클라이언트가 전송해야 하는 메시지 순서, 그리고 서버로부터 수신하는 코드 기반 응답 메시지들이 RFC 문서에 명시되어 있다.

RFC를 참고하면 누군가의 블로그를 뒤지는 것보다 훨씬 정확하게 구조와 의도를 파악할 수 있다.
우리 팀은 RFC 내용을 바탕으로 문서 하나를 만들어 각 명령어와 응답 메시지를 정리하고, 체크리스트 형식으로 구현 여부를 관리했다. 이 방식이 협업에도 매우 유용했다.

- https://datatracker.ietf.org/doc/html/rfc1459
- https://www.rfc-editor.org/rfc/rfc2812  

<br>

### 3-2. 소켓 프로그래밍

소켓이란 네트워크 상에서 데이터를 주고받는 통신의 끝점이다. 마치 콘센트 플러그와 같은. 양쪽이 소켓을 연결해야만 데이터를 주고받을 수 있다. 우리는 커널을 통해 소켓을 생성하고 관리할 수 있다. 코드로 한번 알아보자!  

순서: `socket()` ->  `bind()` -> `listen()` -> `fcntl` -> `accept()`  

#### 3-2-1. `socket()`: 소켓 생성
- **PROTOTYPE**
	- `int socket(int domain, int type, int protocol);`
- **ARGUMENTS**
	- `int domain`
        - 사용할 주소 체계
        - 예시: `AF_INET`(IPv4), `AF_INET`(IPv6)
	- `int type`
        - 소켓 종류
        - 예시: `SOCK_STREAM`(TCP), `SOCK_DGRAM`(UDP)
    - `int protocol`
        - 프로토콜 번호 지정, 거의 항상 `0`
- **DESCRIPTION**  
    - 커널 내부에 소켓 구조체를 생성하고, 프로세스의 fd 테이블에 등록한다.
- **RETURN VALUE**
	- 생성된 소켓의 fd
    - 또는 오류 발생 시 `-1`

#### 3-2-2. `bind():` 소켓 바인딩
- **PROTOTYPE**
	- `int bind(int sockfd, const struct sockaddr *addr, socklen_t addrlen);`
- **ARGUMENTS**
	- `int sockfd`
        - `socket()`이 반환한 소켓의 fd
	- `int backlog`
        - 바인딩할 주소 정보가 담긴 구조체 포인터(위에서 만든)
    - `socklen_t addrlen`
        - `addr` 버퍼의 크기
- **DESCRIPTION**  
    - 지정된 소켓에 IP 주소와 포트를 실제로 연결(binding)
    - 이미 사용 중인 포트라면 실패
- **RETURN VALUE**
	- 성공 시 `0`
    - 또는 오류 발생 시 `-1`

#### 3-2-3.`listen()`: 소켓을 대기 상태로 설정
- **PROTOTYPE**
	- `int listen(int sockfd, int backlog);`
- **ARGUMENTS**
	- `int sockfd`
        - `socket()`이 반환한 소켓의 fd
	- `int backlog`
        - 동시에 대기큐에 올릴 최대 연결 요청 수
        - 시스템 마다 최댓값 제한 다를 수도
- **DESCRIPTION**  
    - 해당 소켓을 대기 상태로 전환하여, 클라이언트의 연결 요청을 큐에 쌓아둔다.
- **RETURN VALUE**
	- 성공 시 `0`
    - 또는 오류 발생 시 `-1`

#### 3-2-4. `fcntl`: 논블로킹 소켓 설정
- **PROTOTYPE**
    - `int fcntl(int fd, int cmd, long arg);`
- **ARGUMENTS**
    - `int fd`
        - 조작 대상 파일 디스크립터 (소켓 포함)
    - `int cmd`
        - 수행할 명령어
        - `F_GETFL`: 현재 파일 상태 플래그 반환
        - `F_SETFL`: 파일 상태 플래그 설정
    - `long arg`
        - 명령어에 따라 해석되는 추가 인자
        - `F_SETFL` 시: 설정할 플래그 비트(`O_NONBLOCK`, `O_APPEND` 등)
- **DESCRIPTION**
    - `fcntl()`은 열린 파일 디스크립터의 동작 모드를 제어하거나 조회할 때 사용한다.
    - 논블로킹 소켓으로 전환하고 싶은 경우
        - `fcntl(_fd, F_SETFL, O_NONBLOCK)`
* **RETURN VALUE**
    - `F_GETFL` 호출 시
        - ≥ 0: 현재 플래그 비트 (예: `O_RDONLY`|`O_NONBLOCK`)
        - −1: 오류 발생 (`errno` 설정)
    - `F_SETFL` 호출 시
        - 0: 성공
        - −1: 오류 발생 (`errno` 설정)


#### 3-2-5. `accpet()`: 서버에서 클라이언트의 연결 요청을 수락
- **PROTOTYPE**
	- `int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);`
- **ARGUMENTS**
	- `int sockfd`
        - listen 상태인 소켓의 fd
        - 즉, 클라이언트의 연결 요청을 기다리는 서버의 fd
	- `struct sockaddr *addr`
        - 새로운 클라이언트 정보를 채워 넣은 버퍼
    - `socklen_t *addrlen`
        - 위 버퍼 크기를 입력으로, 채워진 길이를 출력으로 사용
- **DESCRIPTION**  
    - 연결 요청이 따로 없으면, 이 줄에서 멈춰있다가 요청이 오면 돌아간다.
    - 연결된 클라이언트와의 통신을 담당할 새 fd 발급
- **RETURN VALUE**
	- 성공 시 `0`
    - 또는 오류 발생 시 `-1`  

요약하면, 소켓은 IP·포트·프로토콜 정보가 담긴 커널 내부 구조체이며, 일반 파일처럼 fd로 관리한다.
서버는 listen_fd를 통해 연결 요청을 기다리고, `accept()` 가 새로운 FD를 돌려주면 이를 내부 자료구조에 추가해 클라이언트마다 별도의 소켓으로 통신을 유지한다.

<br>

### 3-3. 동기, 비동기, 블로킹, 논블로킹

이 과제에서는 비동기/논블로킹 방식을 구현해야 한다. 비슷한듯 다른듯 애매한 이 개념들을 정리해야, 실제로 구현할때 헷갈리지 않을 듯 하다. 렛츠고 🥲

- **동기 (Synchronous)**
    - 작업 A가 끝나야 작업 B가 시작된다.
    - 작업의 완료를 **호출한 쪽에서 직접 챙긴다.**
    - 함수가 결과를 반환할 때까지 기다리거나, 혹은 계속해서 작업 완료 여부를 확인(Polling)한다.
    - 즉, 호출된 함수의 종료와 호출한 함수의 작업 시작 시점이 맞물려 있다!
- **비동기 (Asynchronous)**
    - 작업 A를 던져두고 결과가 나오든 말든 작업 B를 시작한다.
    - 작업의 완료를 **호출된 쪽에서 알아서 처리하도록 맡긴다.**
    - 작업이 완료되면 콜백 함수나 이벤트 등을 통해 통보받을 뿐, 호출한 쪽은 완료 시점을 신경 쓰지 않는다.
    - 즉, 호출과 결과 처리가 별개의 흐름으로 움직이는 것이다!

정리하면, 동기 vs 비동기는 **"결과를 누가 확인하고 처리하느냐?"**의 문제이다.
호출한 쪽에서 결과 발생을 계속 체크하면 동기, 호출받은 쪽에서 끝났다고 알려주면 비동기인 것이다.

- **블로킹 (Blocking)**
    - 호출된 함수가 자신의 작업을 마칠 때까지 **제어권을 돌려주지 않는다.**
    - 요청을 보낸 스레드는 제어권이 없으므로 함수가 반환될 때까지 다른 일을 못 하고 멈춰(Wait) 있게 된다.
    - 스레드는 말 그대로 함수 안에 갇혀 있는 상태!
- **논블로킹 (Non-blocking)**
    - 호출된 함수가 작업 완료 여부와 상관없이 **제어권을 즉시 반환한다.**
    - 함수 호출 직후 호출한 스레드는 다시 제어권을 갖게 되어 다른 작업을 수행할 수 있다.
    - 즉, 결과가 안 나왔어도 일단 내 할 일을 계속 할 수 있다!

블로킹 vs 논블로킹은 **"제어권이 누구에게 있느냐?"**의 문제이다.
제어권을 뺏겨서 멈춰 있으면 블로킹, 제어권을 바로 돌려받아 내 일을 계속하면 논블로킹인 것이다.

동기와 블로킹, 비동기와 논블로킹은 그 작동 행태가 비슷하여 많이 헷갈리지만, **결과 처리 방식(동기/비동기)**과 **제어권 유지 여부(블로킹/논블로킹)**의 구분을 잘 기억하고 다음으로 이어나가보자.

- **동기 + 블로킹 (Sync-Blocking)**
    - 제어권을 넘겨주고 작업이 끝날 때까지 기다림 + 결과도 직접 챙김
    - 가장 흔한 구조 (일반적인 함수 호출)
- **동기 + 논블로킹 (Sync-Nonblocking)**
    - 제어권은 바로 돌려받음 + 결과는 내가 계속 확인(Polling)함
    - "다 됐어? 아니", "이제 됐어? 아니"라고 계속 물어보는 상태
- **비동기 + 블로킹 (Async-Blocking)**
    - 제어권을 넘겨주고 기다림 + 결과는 나중에 통보받기로 함
    - 비동기인데도 멈춰있어야 하는 비효율적인 상황 (의도치 않게 발생하거나, select/poll 같은 다중화 모델에서 사용)
- **비동기 + 논블로킹 (Async-Nonblocking)**
    - 제어권을 바로 돌려받음 + 결과는 나중에 알아서 통보해 줌
    - 효율이 극대화된 상태! 내 할 일을 하다가 알림이 오면 그때 처리하면 된다.

_과제 지침에 따르면 우리는 비동기+논블로킹을 구현해야한다._ 

<br>

### 3-4. poll()
그렇다면 우리 서버는 클라이언트가 뭔가 우리에게 전송했을때 그것을 어떻게 비동기적이고 논블로킹스럽게 처리할 수 있을까?
이것을 도와주는 함수가 존재한다. `poll()`, `epoll()`, `kqueue` 등...
우리는 클러스터 개발 환경을 고려해서 `poll()` 함수를 사용했다.

#### 3-4-1. `poll()` {#poll-id}
- **PROTOTYPE**
    - `int poll(struct pollfd *fds, nfds_t nfds, int timeout);`
- **ARGUMENTS**
    - `struct pollfd *fds`
        - 감시할 파일 디스크립터 배열
        - 배열의 각 원소는 다음 필드를 포함:
            - `fd`: 감시 대상 파일 디스크립터
            - `events`: 감시할 이벤트 (예: `POLLIN`, `POLLOUT`)
            - `revents`: 실제로 발생한 이벤트 (출력 전용)
    - `nfds_t nfds`
        - `fds` 배열에 들어있는 감시할 항목 수
    - `int timeout`
        -  대기 시간 (밀리초)
        - `0`: **논블로킹 모드** (즉시 리턴)
        - `> 0`: 해당 시간만큼 대기
        - `-1`: 무한정 대기 (블로킹)
- **DESCRIPTION**
    - 여러 파일 디스크립터에 대해 **I/O 이벤트 발생 여부를 감시**
    - 예를 들어, 읽을 데이터가 있는지(`POLLIN`), 쓰기 가능한지(`POLLOUT`) 등을 확인
    - `timeout == 0`을 주면 즉시 리턴하므로 논블로킹 + 비동기 + 논블로킹 가능
    - 스레드는 멈추지 않으며 이벤트 유무만 확인하고 바로 다음 작업으로 이동
- **RETURN VALUE**
    - `> 0`: 이벤트가 발생한 디스크립터 개수
    - `0`: 감시 중인 디스크립터에 아무 이벤트도 없음
    - `-1`: 에러 발생 → `errno`로 확인 (`EINTR`, `EBADF`, 등)

#### 3-4-2. `epoll()`, `kqueue()`

`poll()` 과 비슷한 역할을 하는 함수가 몇가지 더 있다. `epoll()`, `kqueue()` 을 간단히 알아보자.  

- **poll()**
    - 매 호출마다 fd 배열 전체를 커널에 전달해 n개의 fd를 순회 → `O(n)`
    - _얘 지금 준비됐어?_ 라고 하나씩 묻는 방식 → 많은 fd일수록 느림
    - 명단 전체를 보며 하나씩 상태를 묻는 것과 같음
- **epoll()**
    - `epoll_ctl()`로 감시할 fd를 미리 등록 → 커널이 이벤트 발생 fd만 ready 큐에 저장
    - `epoll_wait()`는 ready 큐에서 이벤트가 발생한 fd만 꺼내므로, 발생한 이벤트 수 k에 비례 → `O(k)`
    - 매번 전체 fd를 순회하지 않고, 실제 이벤트가 발생한 소수의 fd만 빠르게 처리
    - 목록을 한 번만 등록해두고, 준비된 일만 꺼내 처리하는 것과 같음
- **kqueue()**
    - `kevent()` 호출 전 다양한 이벤트(읽기·쓰기·시그널 등)를 미리 등록
    - 커널이 이벤트 발생 시 자동으로 이벤트 리스트에 저장 → `kevent()`로 꺼내기만! → `O(k)`
    - 네트워크 I/O뿐 아니라 파일 변경, 시그널, 타이머 등 다양한 필터 지원
    - 모든 상태변화를 감시해두고, 발생 시 바로 대기 리스트에 추가하는 것과 같음

<br>
<br>
<br>

## 4. Mandatory 


### 4-1. 비동기, 논블로킹 구현 {#custom-id}

우리는 비동기 + 논블로킹 방식의 서버를 구현해야한다.

- 우선 **비동기 방식** 이기 때문에 특정 작업을 내가 아니라 OS 등에 맡기는 것이다.
- 작업을 맡긴 이후 결과가 나올때까지 기다릴수도, 요청 시점에서의 결과를 바로 받을수도있다.
- 이때 **논블로킹 방식** 이기 때문에 요청 시점의 결과를 기다리지 않고, 바로 확인한 후 다음으로 넘어간다.
- 즉, 특정 작업을 OS 등에 일임하고, 그 결과가 나올때까지 기다리지 않고 바로 확인하고 넘어간다.

### 4-2. 서버 내부 자원 관리

서버 구현 시 기본적인 통신 처리뿐만 아니라 RFC에 정의된 다양한 데이터와 기능을 구현해야 한다. 클라이언트는 닉네임, 상태 메시지 등 고유한 속성을 가지며 하나의 클라이언트가 여러 채팅방에 동시에 참여할 수 있는 모델이다.  

개발 초기에는 채팅방이 생성될 때마다 해당 방에 속한 클라이언트 정보를 복사하여 방 내부에 저장하는 방식을 사용하였다. 그러나 이 방식은 한 채팅방에서 닉네임이 변경되었을 때 다른 방에는 반영되지 않아 데이터 불일치 문제가 발생하는 단점이 있었다.  

이를 해결하기 위해 클라이언트 데이터를 중앙에서 관리하는 싱글톤 패턴을 도입하였다. 모든 채팅방이 하나의 객체를 참조하도록 구성함으로써 클라이언트 정보가 변경되면 즉시 모든 방에 반영되도록 하였다. 이러한 구조는 채팅방과 클라이언트 수가 늘어날 때 발생하는 메모리 복사 부담을 크게 줄여주며 정보 동기화 문제를 효과적으로 해소해준다.

### 4-3. 코드

세부 명령어와 프로토콜은 과제를 수행하며 RFC 문서를 질리도록 읽게될 것이므로...  
서버 기본 작동 구현을 소개하겠다.

#### main

``` cpp
int main(int ac, char** av) {
	if (ac != 3) {
		std::cerr << C_ERR << "Error: " << ERR_ARG_COUNT << C_RESET << std::endl;
		return 1;
	}

	try {
		IrcServer server(av[1], av[2]);
		signal(SIGINT, signalHandler);
		signal(SIGQUIT, signalHandler);
		server.init();  // 서버 자원 초기화
		server.run();   // 서버 실제 작동
	} catch (const IrcServer::ServerException &e) {
		std::cerr << C_ERR << "Error: " << e.what() << C_RESET << std::endl;
		return 1;
	}
	return 0;
}
```

#### run

```cpp
void IrcServer::run() {
	bool exitFlag = false;
	while (true) {
		try {
			checkPingTimeOut();

			if (poll(&_fds[0], _fds.size(), 0) < 0) {
				if (errno != EINTR) {
					exitFlag = true;
				}
				throw ServerException(ERR_POLL);
			}

			for (int i = _fds.size() - 1; i>= 0; --i) {
				// POLLIN event
				if (_fds[i].revents & POLLIN) {
					if (_fds[i].fd == this->_fd) {
						// Another(client) fd
						acceptClient();
					} else {
						// Another(client) fd
						handleSocketRead(_fds[i].fd); 

						// Add to remove list if Client Shutdown
						if (getClient(_fds[i].fd) == NULL) { 
							_fdsToRemove.push_back(_fds[i].fd);
						}
					}
				}

				// POLLOUT event
				if (_fds[i].revents & POLLOUT) {
					handleSocketWrite(_fds[i].fd);
					
					// Add to remove list if Client Shutdown
					if (getClient(_fds[i].fd) == NULL) { 
						_fdsToRemove.push_back(_fds[i].fd);
					}
				}
			}

			// Remove Client fds
			for (size_t j = 0; j < _fdsToRemove.size(); ++j) {
				removeClientFd(_fdsToRemove[j]);
			}
			_fdsToRemove.clear();

		} catch (const ServerException& e) {
			serverLog(this->_fd, LOG_ERR, C_ERR, e.what());
			if (exitFlag) {
				exit(EXIT_FAILURE);
			}
		}
	}
}
```

1. `poll`을 통해 여러 소켓을 감시하며, 새 데이터가 올 때마다 처리
2. 데이터가 들어오는 소켓은 `handleSocketRead`로 처리하고, 데이터를 보낼 준비가 된 소켓은 `handleSocketWrite`로 처리
3. 클라이언트 연결을 종료하면 해당 소켓을 제거
4. 예외가 발생하면 이를 처리하고, 필요시 서버를 종료

<br>

**무한 루프 (while true)**  

``` cpp
while (true) { ...
```
- 서버가 계속 동작하도록, 내부에서 오류 발생 시에도 잡아서 로깅한 뒤 재시도 하고 있다.
- 특별한 일이 아니면 서버는 절대 꺼지면 안된다고 명시되어있다.  

<br>

**ping 타임아웃 검사**

``` cpp
checkPingTimeOut();
```

- 일정 시간(ping interval)을 넘긴 연결을 찾아 강제 종료한다.
- 내부적으로 `removeClientFd()` 등을 호출해 `_fds`에서 fd를 제거하고 자원을 정리한다.  

<br>

**논블로킹 poll()**

```cpp
if (poll(&_fds[0], _fds.size(), 0) < 0) {
    if (errno != EINTR) {
        exitFlag = true;
    }
    throw ServerException(ERR_POLL);
}
```

- ‼️ **poll 함수 다시 확인하기**‼️ [_poll()_](#poll-id) (<< click!!!) 
- 반환값이 음수인 경우
  - `errno == EINTR`, 즉 시그널 인터럽트인 경우 재시도한다. (`exitFlag` = `false`)
  - 그 외에는 심각 오류로 간주하며, 예외를  발생시킨다. (`exitFlag = true`)

<br>

**이벤트 루프 (역순 순회)**

```cpp
for (int i = _fds.size() - 1; i >= 0; --i) {
    // POLLIN
    if (_fds[i].revents & POLLIN) { … }

    // POLLOUT
    if (_fds[i].revents & POLLOUT) { … }
}
```
- 각 fd를 순회하며 이벤트가 있는지 확인하는데, **역순** 으로 접근한다.
- 만약 어떤 fd를 삭제해야할때, 바로 삭제하면 내부 로직에서 문제가 생길 수 있으므로, `_fdsToRemove`에 기록만 한다.

<br>

**POLLIN 처리**

```cpp
if (_fds[i].revents & POLLIN) {
    if (_fds[i].fd == this->_fd) {
        // 서버 소켓 → 새로운 클라이언트 수락
        acceptClient();
    } else {
        // 클라이언트 데이터 수신
        handleSocketRead(_fds[i].fd);
        // 클라이언트 정상 종료 시 리스트에 추가
        if (getClient(_fds[i].fd) == NULL)
            _fdsToRemove.push_back(_fds[i].fd);
    }
}
```
- 리스닝 소켓 (`_fd`)
    - `acceptClient()` → `accept()` 호출
    - 새 fd를 `_fds`에 추가하고 내부 클라이언트 맵 생성
- 클라이언트 소켓
    - `handleSocketRead(fd)` → 버퍼에서 읽고 IRC 메시지 파싱/처리
    - 읽기 도중 연결 종료(클라이언트 측 해제) 시 `getClient(fd)`가 `NULL` → `_fdsToRemove`에 `fd` 기록

<br>

**POLLOUT 처리**

```cpp
if (_fds[i].revents & POLLOUT) {
    handleSocketWrite(_fds[i].fd);
    if (getClient(_fds[i].fd) == NULL)
        _fdsToRemove.push_back(_fds[i].fd);
}
```

- 쓰기 가능** 신호가 왔을 때(`POLLOUT`)
    - `handleSocketWrite(fd)` → 대기 중인 송신 버퍼를 전송.
    - 송신 후 연결 닫힘 감지 시 동일하게 제거 대기 리스트에 추가.

<br>

**연결 종료된 FD 정리**

```cpp
for (size_t j = 0; j < _fdsToRemove.size(); ++j) {
    removeClientFd(_fdsToRemove[j]);
}
_fdsToRemove.clear();
```

- `removeClientFd(fd)`
    - 내부 클라이언트 맵에서 제거
    - `_fds` 벡터에서 해당 `pollfd` 엔트리 삭제
    - 소켓 `close(fd)` 및 자원 해제
    - 분리된 정리 단계 덕분에 이벤트 순회 중 컨테이너 변형으로 인한 iterator/인덱스 붕괴를 방지

<br>

**예외 처리 및 종료**

```cpp
} catch (const ServerException& e) {
    serverLog(this->_fd, LOG_ERR, C_ERR, e.what());
    if (exitFlag) {
        exit(EXIT_FAILURE);
    }
}
```

- 로그 기록은 `serverLog()`로
- 심각 오류 시 `exitFlag == true` → 프로세스 종료
- 단순 인터럽트 혹은 클라이언트 오류 (`exitFlag == false`) → 루프 재진입

<br>
<br>
<br>

## 5. Evaluation


_2025.05 코드 리뷰 추가 삽입_

**try1 - review 1**  
<img src="https://i.imgur.com/3d8URFb.png" width="300">  

**try1 - reivew 2**  
<img src="https://i.imgur.com/CBmqyFf.png" width="300">

**try1 - review 3**  
<img src="https://i.imgur.com/UkmytcD.png" width="300">

우선 전체적으로 어떤 과제인지 설명을 하고, 각자 맡은 부분에 대해서 따로 설명했다. 서버 구현 방법이 사람들 마다 조금씩 달랐고, 특히 서버에서 로그를 출력하는 것이 과제 지침 상 맞는 것인지 토의했던 기억이 난다. 또한 비동기-논블로킹 방식에 대해서 설명하고 어떻게 구현했는지 코드 리뷰 했다.  

아쉽게 quit 명령어 동작에서 약간의 실수가 있어 점수가 조금 깎였다. 채팅방 이탈 시 문제였는데, 나중에 확인해보니 간단하게 고칠 수 있는 부분이라 좀 아쉬웠다.  

<br>
<br>
<br>

## 6. Reference

- https://datatracker.ietf.org/doc/html/rfc1459
- https://www.rfc-editor.org/rfc/rfc2812
- https://80000coding.oopy.io/1ac75b59-6930-4297-9c9d-7dec31eff19d

<br>
<br>
<br>