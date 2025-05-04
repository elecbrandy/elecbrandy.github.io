+++
title = '[42seoul] inception'
date = 2025-01-27
featured_image = "https://static1.srcdn.com/wordpress/wp-content/uploads/2024/07/cobb-s-totem-in-inception.jpg?q=49&fit=crop&w=750&h=422&dpr=2"
tags = ['c', '42seoul']
+++

{{<series title="🪐 /42seoul" series="42seoul">}}

<br>

## 1. 소개
____

> One container is not enough, WE NEED TO GO DEEPER

본과정에서 열다섯번째로 진행한 과제로, 가상 머신에서 Docker Compose를 사용해 여러 서비스로 구성된 소규모 인프라를 구축하는 과제이다. 실습도 실습이지만, 평가자에게 설명하기 위해서라도 많은 내용을 공부해야 했다.

<br>
<br>

## 2. inception 명세서
____

- **General guidelines**
    - 이 프로젝트는 반드시 VM 위에서 진행해야 한다.
    - 프로젝트 설정에 필요한 모든 파일은 `srcs` 폴더에 넣어야 한다.
    - Makefile도 반드시 필요하며, 프로젝트 디렉토리의 root에 존재해야 한다.
    - 이 Makefile은 전체 애플리케이션을 설정해야 하며, `docker-compose.yml`을 이용해 Docker 이미지를 빌드해야 한다.
- **Mandatory**
    - 각 Docker 이미지 이름은 반드시 해당 서비스 이름과 동일해야 한다.
    - 각 서비스는 전용 컨테이너에서만 실행되어야 한다.
    - 베이스 이미지는 Alphine 또는 Debian의 penultimate stable 버전 중 하나를 선택해 사용한다.
    - 서비스 별로 직접 작성한 Dockerfile을 하나씩 준비하고, Makefile이 이를 docker-compose.yml 에서 빌드하도록 연결해야 한다.
    - Dockerhub 등에서 미리 만들어진 이미지를 가져오는 것은 금지되어있다. (Alphine, Debian 제외)
    - 모든 컨테이너는 충돌 발생 시 자동 재시작 설정
    - 반드시 준비할 컨테이너/볼륨/네트워크
        - nginx 컨테이너: TLSv1.2 또는 TLSv1.3만 허용
        - wordpress + php-fmp 컨테이너: nginx 없이 설치 및 구성
        - mariadb 컨테이너: nginx 없이 설치
        - 볼륨1: wordpress db 저장용
        - 볼륨2: wordpress 웹사이트 파일 저장용
        - docker network: 컨테이너간 통신용
- **Warnning**
    - Docker 컨테이너는 VM이 아니므로, tail -f, bash, sleep infinity, while true 같은 무한 루프 후킹(hacky patch) 사용 금지
    - network: host 또는 --link/links 옵션 사용 금지
    - entrypoint에서 무한 루프를 돌리는 방식도 전면 금지
    - PID 1 역할 및 Dockerfile 작성 베스트 프랙티스 학습 권장
- **More requirements**
    - wordpress
        - db 내 사용자 2명 필수이며, 그 중 하나는 관리자
        - 관리자 계정 이름에 admin, Admin, administrator 등 포함 금지
    - 호스트 볼륨 마운트 경로
        - 볼륨은 호스트의 `/home/<your_login>/data` 디렉토리에 마운트 
        - `<your_login>` 부분을 본인 계정명으로 교체
        - `<your_login>.42.fr` 도메인을 로컬 IP로 매핑
    -  환경변수, 보안 
        - latest 태그 사용 금지
        - Dockerfile 내에 비밀번호 직접 기재 금지
        - 반드시 환경 변수 사용
        - .env 파일을 srcs 디렉토리 최상위에 두어 환경 변수 관리 권장
    - 인프라 진입점
        - 오직 nginx 컨테이너만 포트 433으로 외부 요청을 받아야 함

<br>
<br>

## 3. 개념 정리
___

1. vm,docker 부분은 이전 과제인 born2beroot와 유사하므로 넘어가자
2. 컨테이너의 연결 방식은 마지막 과제인 ft_transcendence에서도 쓰일 수 있으니 공부하자
3. 전체적으로 과제를 진행하며 궁금했던 난잡한 구조의 질문들을 정리해보았다.
4. 각 개념만으로도 전공서적 수십 권 분량의 방대한 내용이 존재하므로, 이번 과제의 이해에 필요한 핵심만 간략히 서술하였다.


<br>

### 3-1. Docker compose

Docker Compose는 여러 개의 컨테이너 서비스를 하나의 YAML 파일(보통 `docker‑compose.yml`)로 정의하고, 한 번의 명령으로 일괄 빌드·실행·종료·삭제까지 제어할 수 있도록 돕는 도구이다.

- **docker compose의 기능**
    - 복수 컨테이너 설정을 YAML 한 파일에 선언형으로 표현하므로, 긴 `docker run` 옵션을 기억할 필요가 없다.
    - 환경 전체가 동일한 `docker‑compose.yml`을 공유하므로 “작동하는 환경”이 코드화되어 환경 편차가 줄어든다.
    - `depends_on` 지시어로 서비스 기동 순서를 명시할 수 있어, DB → 백엔드 → 프런트엔드 같은 구동 흐름을 자동으로 보장한다.
    - `docker compose up ‑d` 한 줄로 빌드부터 백그라운드 실행까지 끝낼 수 있어 개발·테스트 자동화가 용이하다.
    - 기본적으로 프로젝트 단위의 가상 브리지 네트워크를 자동 생성하므로, 컨테이너끼리 서비스명으로 DNS 해결이 가능하다.

- **docker compose의 명령 실행**
    - `docker compose up ‑d` : 빌드·의존성 순서대로 기동 후 데몬 모드로 전환
    - `docker compose ps` : 현재 동작 중인 서비스 목록을 확인
    - `docker compose down ‑v` : 모든 컨테이너와 네트워크·볼륨(‑v 옵션)을 정리

- **docker compose와 Makefile을 함께 사용하는 방법**
  - Compose 명령을 Makefile의 **타깃**으로 래핑하면, 복잡한 옵션을 숨기고 프로젝트 고유의 빌드·배포 흐름을 자동화할 수 있다. 예시는 다음과 같다.
  - 개발자는 `make up` 한 줄로 빌드 + 기동까지 완료할 수 있다.
  - CI/CD 파이프라인에서는 동일한 Makefile을 호출해 일관된 배포 스크립트를 재사용할 수 있다.

``` make
COMPOSE=docker compose

.PHONY: up down logs restart

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down -v

logs:
	$(COMPOSE) logs -f --tail=100

restart: down up
```


<br>

### 3-2. Nginx

Nginx는 이벤트 기반 아키텍처를 사용해 정적 파일‑서빙, 리버스 프록시, 로드 밸런싱을 처리하는 오픈소스 웹 서버이다.

- **nginx의 기능**
    - 이벤트 루프‑모델(Non‑blocking I/O)을 사용하므로, 프로세스/스레드 폭증 없이 수만 개의 동시 연결을 처리할 수 있다.
    - 프로세스 수가 적어 컨테이너·임베디드 환경에서도 부담이 작다.
    - 업스트림(백엔드) 서버를 묶어 라운드로빈·IP‑해시 등으로 트래픽을 분산할 수 있다.
    - `sendfile`, `gzip`, `expires` 헤더 등을 통해 정적 자산을 캐시·압축해 전송 속도를 높인다.
    - HTTP/2, OCSP Stapling, SNI, ALPN 등 최신 TLS 기능을 지원해 보안 연결을 빠르게 처리한다.
    - 리라이트, 인증, 보안 헤더 삽입, 접근 제어 등 풍부한 모듈을 컴파일 옵션 없이 설정 파일만으로 활성화할 수 있다.
    - 선언형 디렉티브와 블록 구조를 사용해 가독성이 높다.

<br>

### 3-2. 무한 루프 금지

무한 루프 금지란, Docker 컨테이너 내부에서 `tail -f`, `bash`, `sleep infinity`, `while true`와 같은 무한 루프를 사용하지 말라는 의미이다. 이는 Docker가 VM과 다르게 자원의 효율적인 사용을 요구하기 때문이다. 무한 루프가 포함된 프로세스는 자원을 낭비하며, 이는 컨테이너가 설계된 목적에 부합하지 않는다. 따라서, 이러한 루프를 피하고 다른 방식으로 작업을 처리하는 것이 좋다.

- **조건의 의미**
    - Docker 컨테이너는 “프로세스를 담은 프로세스”일 뿐이며, 가상머신처럼 자체 init 시스템이나 서비스 매니저를 탑재하지 않는다.
    - 따라서 컨테이너 내부에서 `tail ‑f`, `sleep infinity`, `while true`와 같은 무한 루프를 걸어 프로세스를 억지로 붙잡아 두면, **컨테이너가 “정상 동작 중”이라는 착시만 남기고 실제 서비스는 정지**한 상태가 된다.

<br>

### 3-3. PID 1

컨테이너가 시작될 때 가장 먼저 실행되는 프로세스가 PID 1을 차지한다. 리눅스에서 PID 1은 일반 프로세스와 달리 특별한 임무를 가진다.

- **PID 1 의 역할**
    - `SIGTERM`, `SIGINT` 같은 종료 신호가 컨테이너에 도착하면 PID 1이 이를 받아 자식 프로세스에 전달해야 정상 종료가 이뤄진다.
    - 좀비 프로세스 수거자이다. 종료된 자식의 exit 코드를 `wait()` 으로 회수하지 않으면 좀비 프로세스가 쌓이고 메모리가 낭비된다.
    - 오케스트레이터(Docker Compose, K8s)는 “PID 1이 살아 있는가”만 확인하여 헬스 상태를 판단한다. 메인 서비스가 이미 죽었는데도 PID 1이 무한 루프 중이라면 장애를 감지하지 못한다.

- **잘못된 PID 1 예시**
    - `tail -f /dev/null`, `while true; do sleep 1; done`, `bash` 루프 같은 임시 방편을 PID 1로 두면 위 임무를 수행하지 못해 종료 신호가 무시되고, 좀비가 발생하며, 장애 모니터링이 실패한다.

- **올바른 설정 방법**
    - **Docker --init 옵션**을 사용한다. `docker run --init …` 또는 `docker compose.yml`에서 `init: true`를 지정하면, 경량 init 프로세스인 `tini`가 자동으로 PID 1 자리를 맡는다.
    - `dumb‑init` 을 직접 적용한다. `dumb‑init`은 시그널 포워딩과 좀비 수거 기능만 제공하는 40 KB짜리 경량 바이너리이다.
    - **tini**를 명시적으로 사용한다. Alpine 이미지에 기본 포함되어 있으므로 `ENTRYPOINT ["tini", "--"]`처럼 지정하면 된다.

<br>

### 3-4. .env

`.env` 파일은 프로젝트 루트에 두는 평문 설정 파일이며, `KEY=VALUE` 형식으로 환경 변수를 선언해 둔 목록이다. 즉, **“코드는 동일, 설정은 외부화”** 원칙을 실천해, 컨테이너 기반 서비스의 배포·보안·유지보수를 간결하게 만드는 핵심 도구이다.

- **왜 사용하는가?**
    - 비밀번호·포트·경로처럼 실행 환경마다 달라지는 값을 소스 코드와 분리해, 동일한 빌드 이미지를 여러 환경에서 재사용할 수 있다.
    - 민감 정보를 코드 저장소에 노출하지 않을 수 있다.
    - 복잡한 `export` 나 길다란 커맨드라인 옵션 대신, 사람이 읽고 수정하기 쉬운 포맷으로 설정을 문서화한다.
- **Docker Compose에서 로드**
   - 같은 디렉터리에 `.env` 가 있으면 `docker compose up` 시 자동으로 읽힌다.
   - 다른 경로를 쓰려면 `docker compose --env-file ./config/prod.env up` 옵션을 사용한다.
   - 변수 참조는 `${VAR_NAME}` 형태로 한다.
- **베스트 프랙티스**
   - 실제 비밀 키를 담은 `.env` 는 커밋하지 말고, 예시용 `example.env` 만 저장소에 포함한다.
   - 새 변수를 추가할 때는 README와 `example.env` 를 동시에 업데이트해 팀원 간 불일치를 방지한다.

<br>

### 3‑5. TLS 1.2 / 1.3

TLS(Transport Layer Security)는 애플리케이션 계층과 전송 계층 사이에서 **암호화·무결성·인증**을 제공해, HTTP·SMTP·FTP 등 모든 TCP 프로토콜을 “https” 형태의 **보안 터널**로 감싸는 표준이다.

- **TLS 효과**
    - **기밀성**: 대칭키 암호화로 패킷 내용을 제3자가 볼 수 없게 한다.
    - **무결성**: MAC / AEAD 알고리즘으로 데이터 변조를 탐지한다.
    - **서버 인증**: X.509 인증서와 CA 체계로 “우리가 접속한 서버가 진짜 example.com인지” 증명한다.
- **베스트 프랙티스**
    - 최신 브라우저·라이브러리는 1.3을 기본 지원하므로, 호환성 이슈가 거의 없다.
    - 인증서·키는 **컨테이너 외부 볼륨**에 마운트해, 이미지 빌드 과정에 비밀 키가 섞이지 않게 한다.

<br>
<br>

## 4. Mandatory 
____

<img src="https://i.imgur.com/2nOev5a.png" width="700">

우리는 총 3개의 컨테이너를 구성해야 한다. (**nginx**, **wordpress**,**mariadb**)  

서버스에 접근하는 모든 요청은 먼저 **nginx**로 전달되며, nginx는 정적 파일을 직접 제공하고, 동적 요소는 wordpress(PHP) 컨테이너로 프록시하여 처리한다.
그리고 워드프레스에서 사용하는 게시글, 사용자 정보 등 서비스의 모든 데이터는 mariadb 컨테이너에서 관리하게 된다.

### 4-1. Makefile

``` Makefile
all: build up

build:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) build --no-cache

up:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d

stop:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) stop

down:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down

clean:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down --volumes --rmi all

# 정리: 사용하지 않는 이미지, 캐시 및 네트워크 제거
fclean:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down --volumes --rmi all
	docker system prune -a --volumes -f
	rm -rf $(MARIADB_LOCAL_VOLUME) $(WORDPRESS_LOCAL_VOLUME)
	sleep 5
	mkdir -p $(MARIADB_LOCAL_VOLUME) $(WORDPRESS_LOCAL_VOLUME)
	chmod 777 * $(MARIADB_LOCAL_VOLUME) $(WORDPRESS_LOCAL_VOLUME)

# 볼륨 디렉토리 초기화
reset-volumes:
	rm -rf $(MARIADB_LOCAL_VOLUME) $(WORDPRESS_LOCAL_VOLUME)
	mkdir -p $(MARIADB_LOCAL_VOLUME) $(WORDPRESS_LOCAL_VOLUME)
	chmod 777 * $(MARIADB_LOCAL_VOLUME) $(WORDPRESS_LOCAL_VOLUME)

```

<br>

### 4-2. Docker-compose.yml

``` yml
# version: '3.7'

services:
  mariadb:
    build:
      context: ./requirements/mariadb
      dockerfile: Dockerfile
    image: mariadb
    expose:
      - "3306"
    env_file:
      - .env
    volumes:
      - mariadb_data:/var/lib/mysql
    container_name: mariadb
    restart: always
    networks:
      - 42_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1", "-u", "root", "-p${MYSQL_ROOT_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  wordpress:
    build:
      context: ./requirements/wordpress
      dockerfile: Dockerfile
    image: wordpress
    depends_on:
      mariadb:
        condition: service_healthy
    expose:
      - "9000"
    env_file:
      - .env
    volumes:
      - wordpress_data:/var/www/html/wordpress
    container_name: wordpress
    restart: always
    networks:
      - 42_network
    healthcheck:
      test: ["CMD-SHELL", "pgrep php-fpm7.4 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s

  nginx:
    build:
      context: ./requirements/nginx
      dockerfile: Dockerfile
      args:
        MY_SSL_PATH: ${MY_SSL_PATH}
        WORDPRESS_URL: ${WORDPRESS_URL}
    image: nginx
    ports:
      - "443:443"
    container_name: nginx
    depends_on:
      wordpress:
        condition: service_healthy
    env_file:
      - .env
    volumes:
      - wordpress_data:/var/www/html/wordpress
    restart: always
    networks:
      - 42_network

volumes:
  mariadb_data:
    driver: local
    driver_opts:
      type: 'none'
      device: ${MARIADB_LOCAL_VOLUME}
      o: 'bind'

  wordpress_data:
    driver: local
    driver_opts:
      type: 'none'
      device: ${WORDPRESS_LOCAL_VOLUME}
      o: 'bind'

networks:
  42_network:
    name: 42_network
    driver: bridge

```

<br>

### 4-3. Dockerfile

<br>

#### 4-3-1. nginx

``` Dockerfile
# Debian Linux
FROM debian:11

ARG MY_SSL_PATH
ARG WORDPRESS_URL

# 필수 패키지 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    openssl \
    curl \
    dumb-init && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 인증서와 키 파일을 포함시킬 디렉토리 생성
RUN mkdir -p ${MY_SSL_PATH} && chmod -R 755 ${MY_SSL_PATH}

# SSL 인증서와 키 생성
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ${MY_SSL_PATH}/server.key \
    -out ${MY_SSL_PATH}/server.crt \
    -subj "/C=/ST=/L=/O=/OU=/CN="

# 컨테이너 내부에서 필요한 파일 복사
COPY conf/nginx.conf /etc/nginx/nginx.conf

# 설정 파일 내의 변수 설정
RUN sed -i "s|__WORDPRESS_URL__|${WORDPRESS_URL}|g" /etc/nginx/nginx.conf && \
    sed -i "s|__MY_SSL_PATH__|${MY_SSL_PATH}|g" /etc/nginx/nginx.conf

# 443 포트 개방
EXPOSE 443

# dumb-init을 엔트리포인트로 설정하고 Nginx를 실행
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Nginx를 포그라운드 모드로 실행
CMD ["nginx", "-g", "daemon off;"]
```

<br>

#### 4-3-2. wordpress

``` Dockerfile
# Dockerfile (wordpress)
FROM debian:11

RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    unzip \
    curl \
    php \
    php7.4-fpm \
    php7.4-json \
    php7.4-mbstring \
    php7.4-mysql \
    php7.4-phar \
    less \
    bash \
    netcat-openbsd \
    dumb-init \
    ca-certificates && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN id -u www-data || useradd -r -s /usr/sbin/nologin -d /var/www/html -U www-data

COPY conf/php-fpm.conf /etc/php/7.4/fpm/php-fpm.conf
COPY conf/www.conf /etc/php/7.4/fpm/pool.d/www.conf

RUN mkdir -p /var/log/php7.4-fpm && \
    chown -R www-data:www-data /var/log/php7.4-fpm && \
    chmod -R 755 /var/log/php7.4-fpm

# WordPress 파일 다운로드 (임시 경로)
RUN mkdir -p /usr/src/wordpress && \
    wget https://wordpress.org/latest.zip -O /tmp/wordpress.zip && \
    unzip /tmp/wordpress.zip -d /usr/src/ && \
    rm /tmp/wordpress.zip

COPY tools/wp_setup.sh /usr/local/bin/wp_setup.sh
RUN chmod +x /usr/local/bin/wp_setup.sh

EXPOSE 9000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["/bin/bash", "-c", "/usr/local/bin/wp_setup.sh && exec php-fpm7.4 -F"]

```

<br>

#### 4-3-3. mariadb

``` Dockerfile
FROM debian:11

# 필수 패키지 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    mariadb-server \
    mariadb-client \
    dumb-init \
    bash \
    curl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# bind-address 설정: 외부 접속 가능하도록
RUN sed -i 's/^bind-address\s*=.*/bind-address = 0.0.0.0/' /etc/mysql/mariadb.conf.d/50-server.cnf

# 데이터 디렉토리 및 mysqld 소켓 디렉토리 권한 설정
# VOLUME ["/var/lib/mysql"]
RUN mkdir -p /run/mysqld && chown -R mysql:mysql /run/mysqld /var/lib/mysql

# 초기화 스크립트 복사
COPY tools/db_setup.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/db_setup.sh

# 엔트리포인트 스크립트 복사
COPY tools/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# 환경 변수 설정 (필요에 따라 빌드 시나 docker run/docker compose 시 오버라이드 가능)
ENV MYSQL_ROOT_PASSWORD=secret
ENV MYSQL_DATABASE=mydb
ENV MYSQL_USER=myuser
ENV MYSQL_PASSWORD=mypassword

# MariaDB 포트 개방
EXPOSE 3306

# dumb-init을 EntryPoint로 설정 + 커스텀 엔트리포인트 스크립트 실행
ENTRYPOINT ["/usr/bin/dumb-init", "--", "/usr/local/bin/entrypoint.sh"]
```

<br>

## 5. Reference
____
- https://docs.docker.com
- https://hub.docker.com/_/nginx
- https://github.com/Xperaz/inception-42

<br>
<br>