+++
title = 'born2beroot'
date = 2024-01-18
featured_image = "http://t1.daumcdn.net/cfile/14492610B091CC6254"
tags = ['docker', '42seoul']
+++

{{<series title="📚 42seoul" series="42seoul">}}

<br>

## 1. 소개

> YOU CAN DO ANYTHING YOU WANT TO DO, VM, THIS IS YOUR WORLD

42서울 본과정 입과 후 네번째로 수행한 과제로, 가상머신에 리눅스를 설치하고 공부하는 과정이다. 가상머신에 리눅스(Debian or Rocky)를 설치하고, LVM를 통한 파티션 설정과 기타 여러가지 기능을 직접 실습한다. 요구사항이 상당히 많고 처음 접한다면 배워야할 개념도 상당히 많다. 리눅스 설치는 하다보면 10번 넘게 하다보니... 중요한 개념 위주로만 정리했다.

<br>
<br>
<br>

## 2. 개념 정리


### 2-1. 운영체제
Operating System은 응용 프로그램 또는 사용자에게 컴퓨터 자원을 사용할 수 있는 인터페이스를 제공하고, 그 결과를 돌려주는 시스템 소프트웨어이다. CPU, Memory, 저장장치 등의 하드웨어를 관리하고 Process 관리, 자원 접근 및 할당, 파일 시스템을 관리한다.

<br>
<br>
<br>

### 2-2. Virtual Machine(VM)
하나의 컴퓨터 안에서 여러 개의 독립된 환경을 만들어 내는 것으로 물리적 하드웨어 시스템 위에 구축되는 소프트웨어 기반의 컴퓨터이다. 자체적인 OS, CPU, Memory, Network interface, 저장장치 등을 가지고 있고, Hypervisor를 통해 하드웨어에서 VM의 소스를 분리하고 적절히 프로비저닝하여 VM에서 사용할 수 있게 만든다.  

- **VM 장점:** 완벽한 격리 보안, 대화형 개발, 스냅샷 기능 등
- **VM 단점:** 온전한 OS를 부팅, 운영, 관리해야하므로 속도가 느리고 호스트 컴퓨터 공간 부족 이슈 가능

<br>
<br>
<br>

### 2-3. Debian
다양한 환경에서 광범위 하게 사용되는 운영체제로, 다양한 소프트웨어 패키지를 제공한다.
커뮤니티 중심으로 개발되는 프로젝트이며, 자유 소프트웨어 원칙을 강력히 지지하는 것이 특징! 패키지 관리자로 Package management tools, 보안 모듈로 AppArmor를 사용한다.  

<br>
<br>
<br>

### 2-4. Debian과 Rocky의 차이점

| 기준              | Debian                                   | Rocky Linux                                     |
| ----------------- | ---------------------------------------- | ----------------------------------------------- |
| **기반**          | 리눅스 커널 기반                         | 리눅스 커널 기반                                |
| **목적**          | 범용성, 다양한 환경에 적합               | 엔터프라이즈급 환경, 서버 및 데이터 센터에 적합 |
| **커뮤니티/개발** | 커뮤니티 중심, 자유 소프트웨어 원칙 강조 | Red Hat Enterprise Linux(RHEL)와의 호환성 강조  |
| **패키지 관리자** | APT 등    | dnf 등           |
| **보안 모듈**     | AppArmor, SELinux 옵션 제공              | 권장 보안 모듈 SELinux                                         |
| **이식성**        | 다양한 하드웨어 아키텍처 지원            | 주로 x86_64 아키텍처에 초점                     |
| **사용자 친화성** | 데스크톱 및 서버 사용에 모두 적합        | 주로 서버 및 데이터 센터 운영에 초점            |
| **라이선스**      | 대부분 GPL 및 다양한 오픈 소스 라이선스  | GPL 및 RHEL 호환 라이선스                       |

<br>
<br>
<br>

### 2-5. Package management tools
Linux의 패키징 시스템을 관리하는 도구 모음으로 패키지 설치, 업그레이드, 제거 등을 자동화하여 쉽게 관리 가능하다. 특정 소프트웨어가 필요로 하는 모든 추가 패키지를 자동으로 파악하고 설치함으로써 의존성 문제를 해결했다. **Debian과 Rocky 사이의 Package management tools의 차이점을 더 공부해보자 :)**  

- **Debian-APT**
	- Debian은 .deb 패키지 포맷을 사용하며, 패키지 관리 도구로는 주로 `APT (Advanced Package Tool)`를 사용한다. `APT`는 패키지 설치, 업그레이드, 삭제 등을 쉽게 관리할 수 있도록 도와준다. `APT`는 의존성 문제를 자동으로 해결하며, 패키지 소스 리스트를 통해 소프트웨어를 중앙 저장소에서 쉽게 설치할 수 있다. (의존성 문제 해결, 패키지 소스 관리, 소프트웨어 업데이트 관리가 자동화되어 있다.)  
	- `dpkg`
		- `APT`의 하위 도구로, 패키지를 직접 설치하거나 제거하는 데 사용된다. `APT`는 `dpkg`를 기반으로 하여 더 높은 수준의 패키지 관리 기능을 제공한다.

- **Rocky-dnf**
	- Rocky Linux는 .rpm 포맷을 사용하며, `dnf (Dandified YUM)` 패키지 관리 도구를 사용한다. `dnf`는 Red Hat 계열에서 사용되는 패키지 관리 도구로, YUM(Yellowdog Updater, Modified)을 대체하여 더 나은 성능과 의존성 해결 능력을 제공한다.
	- `dnf`
		- 패키지 설치, 업데이트, 삭제 등을 관리하며, 다양한 저장소에서 패키지를 가져올 수 있다. 또한, dnf는 여러 의존성 문제를 자동으로 해결하며, 고급 캐싱 및 플러그인 시스템을 지원한다.
	- `rpm`
		- .rpm 패키지 포맷을 사용하여 dnf를 통해 관리된다.

#### 차이점 요약
- **패키지 포맷:** Debian은 .deb, Rocky Linux는 .rpm을 사용한다.
- **패키지 관리 도구:** Debian은 APT, dpkg를 사용하며, Rocky Linux는 dnf와 rpm을 사용한다.
- **의존성 해결:** APT와 dnf 모두 의존성을 자동으로 해결하지만, 기본적으로 사용하는 도구와 메커니즘이 다르다.
- **사용자 경험:** 두 도구 모두 의존성 문제를 자동으로 해결하며, 각 배포판의 철학에 맞게 최적화되어 있다. APT는 Debian 기반의 시스템에서, dnf는 Red Hat 계열 시스템에서 널리 사용된다.

<br>
<br>
<br>

### 2-6. AppArmor
시스템 관리자가 개별 응용프로그램이 엑세스 할 수 있는 시스템 리소스와 권한을 제어 할 수 있게 하는 Linux Kernel 보안 모듈로 MAC(Mandatory Access Control) 방식을 통해 사전에 정의된 규칙(Profile)에 기반하여 권한을 제어한다. 즉, 특정 프로그램이 파일/네트워크/기타 시스템 자원에 접근하는 방식을 경로를 통해 구분한다.  

타 모듈에 비해 간단한 설정이 장점이지만, 단순한만큼 복잡한 보안 요구 사항을 충족시키지 못할 수 있으며 Profile 로딩 시간 때문에 시스템 시작 속도에 영향을 미칠 수 있다. 또한 동일 어플리케이션에 대하여 여러 경로가 존재할 수 있기 때문, 한 프로그램에 대하여 여러 보안 Profile이 생성될 수 있다.  

**그렇다면 AppArmor가 없었던 시절에는 어떻게 관리했을까?**  AppArmor가 도입되기 전에는 Linux 시스템에서 주로 **DAC (Discretionary Access Control)** 방식으로 권한을 관리했다. DAC는 파일이나 디렉토리의 소유자가 누구에게 접근 권한을 부여할지 결정하는 방식이다. Linux에서 가장 흔한 형태의 DAC는 파일의 소유자, 그룹, 기타 사용자에 대한 **파일 권한 (읽기, 쓰기, 실행 권한)** 설정이다.

- **DAC의 특징**  
	- 소유자가 자신이 소유한 파일이나 디렉토리에 대해 자유롭게 권한을 설정할 수 있다.
	- 유연하지만, 보안 측면에서는 취약할 수 있다. 예를 들어, 프로그램이 공격에 의해 권한을 획득하면 소유자가 부여한 권한을 남용할 수 있다.
	- 시스템 전반적인 보안 관리가 어려워, 보안 사고가 발생할 가능성이 더 높았다.

- **AppArmor와의 차이점**  
	- DAC는 파일 소유자가 권한을 설정하고 제어할 수 있었던 반면, AppArmor는 시스템 관리자가 **MAC (Mandatory Access Control)** 방식을 통해 보다 강력하고 체계적인 방식으로 권한을 제어한다. 즉, 프로그램이 어떤 파일에 접근할 수 있는지를 경로 기반의 규칙으로 제한할 수 있다.
	- AppArmor는 프로파일을 사용하여, 특정 프로그램이 어떤 자원에 접근할 수 있는지 미리 정의된 규칙에 따라 결정한다. 이는 DAC 방식보다 더 세밀하고 강력한 보안 정책을 적용할 수 있게 해준다.

AppArmor가 도입되기 전에는 **SELinux**와 같은 다른 MAC 방식의 보안 모듈도 존재했지만, 설정이 복잡하고 관리가 어려워 일부 시스템 관리자들에게는 DAC 방식이 여전히 주로 사용되었다.

<br>
<br>
<br>

### 2-7. Sudo
Sudo(Superuser do)는 Unix 및 Linux 기반 시스템에서 슈퍼유저 또는 root 권한으로 명령을 실행할 수 있게 해주는 프로그램이다. 일반 사용자에게 관리자(루트) 권한으로 명령을 실행할 수 있는 권한을 제한적으로 부여하여 루트 사용자로의 지속적인 로그인을 방지하고, 보안 위험을 줄일 수 있다. 또한 루트 권한으로 실행된 모든 명령과 사용자를 기록 가능해 시스템 관리, 감시 추적 등이 용이하다.

**sudo log를 어디서 확인 할 수 있을까?** `sudo` 명령어로 실행된 작업에 대한 로그는 보통 `/var/log/auth.log` 또는 `/var/log/secure` 경로에서 확인할 수 있다. 사용 중인 배포판에 따라 경로가 약간 다를 수 있지만, 일반적으로 다음 경로에서 `sudo` 관련 로그를 찾을 수 있다:

- **Debian 기반 배포판 (예: Ubuntu)**: `/var/log/auth.log`
  - 이 파일에는 인증과 관련된 로그가 저장되며, `sudo` 명령이 실행된 내역도 포함된다.

- **Red Hat 기반 배포판 (예: Rocky Linux, CentOS)**: `/var/log/secure`
  - 이 파일에는 보안 관련 정보가 기록되며, `sudo` 명령 내역도 이곳에 저장된다.

로그 파일에서 `sudo` 명령을 필터링하여 확인하려면 `grep` 명령을 사용할 수 있다. 

```bash
grep 'sudo' /var/log/auth.log    # Debian 기반 시스템
grep 'sudo' /var/log/secure      # Red Hat 기반 시스템
```

<br>
<br>
<br>

### 2-8. TTY
TTY(Tele Type Writer)는 컴퓨터와 연결된 가상의 터미널로 한 컴퓨터를 여럿이서 사용하기 위해 (물리적 한계 극복) 사용했으며 현재 UNIX 시스템에서 터미널 역할을 수행한다. 텍스트 기반 인터페이스와 다중 터미널 세션 기능, 원격 접속과 시스템 관리 및 표준 입출력 관리가 특징이다. 이때 Sudo가 TTY를 요구한다는 것은 Sudo 명령어를 사용자가 직접 터미널 세션에서 입력해야만 Sudo 권한을 사용할 수 있다는 것을 의미한다. 

**그렇다면 이것이 왜 필요할까?** `sudo`가 TTY(Tele Type Writer)를 요구하는 이유는 보안 측면에서 사용자 인증을 강화하고, 비정상적인 사용을 방지하기 위해서이다. TTY는 물리적 또는 가상 터미널로서 사용자가 직접 명령을 입력하는 환경을 제공하는데, 이를 요구함으로써 `sudo` 명령을 자동화된 스크립트나 백그라운드 프로세스에서 악용하는 것을 막을 수 있다. 이 방식은 다음과 같은 이유로 보안이 강화된다.

1. **직접 사용자 인증 요구**  
   TTY를 요구함으로써 `sudo` 명령이 직접 사용자가 터미널 세션을 통해 입력되었는지 확인할 수 있다. 이 과정에서 사용자의 비밀번호를 묻거나, 사용자가 로그인된 터미널에서 명령이 실행되었는지 확인할 수 있어 인증 절차를 강화한다.

2. **악성 스크립트 방지**  
   자동화된 스크립트나 원격 프로세스가 루트 권한을 남용하지 못하게 한다. 만약 TTY 없이 `sudo`가 허용된다면, 악의적인 사용자가 원격으로 시스템에 접근해 루트 권한을 얻는 데 악용할 수 있다. TTY를 요구함으로써 사용자가 직접 명령을 입력하지 않는 비정상적인 상황에서 `sudo` 사용을 막는다.

3. **로그 추적 및 감시 강화**  
   TTY 환경에서는 사용자가 어떤 터미널에서 어떤 명령을 실행했는지 명확하게 기록할 수 있다. 이를 통해 `sudo` 사용 내역을 보다 쉽게 추적할 수 있고, 누가 언제 어디서 루트 권한으로 명령을 실행했는지 확인할 수 있어 보안 관리가 용이해진다.  
  

때로는 `sudo`가 TTY 없이도 작동해야 하는 경우가 있다. 예를 들어, 특정 자동화 작업이나 데몬 프로세스에서 `sudo` 명령이 필요할 때 TTY 요구를 비활성화할 수 있다. 이를 위해서는 `/etc/sudoers` 파일에 다음과 같은 규칙을 추가한다:

```bash
Defaults !requiretty
```

그러나, 이 설정은 보안 위험을 초래할 수 있으므로 매우 신중하게 사용해야 한다. TTY 요구는 사용자가 터미널을 통해 직접 인증할 수 있게 하고, 시스템의 보안을 강화하기 위한 중요한 요소이다.

<br>
<br>
<br>

### 2-9. UFW
UFW(Uncomlicted FireWall)은 사용자 친화적인 방화벽 관리 인터페이스로 기존 iptables의 복잡성을 단순화 시켰으며 주로 입출력 트래픽을 제어하고, 원하지 않는 네트워크 접근을 차단하기 위해 사용한다.

<br>
<br>
<br>

### 2-10. SSH
SSH(Secure SHell) 이란 컴퓨터가 같은 public network를 통해 통신 시 보안적으로 안전하게 통신을 하기 위한 프로토콜으로 보안적으로 안전한 채널을 구축한 뒤 정보를 교환하는 방식(키 기반의 인증 / 암호화)이다. 이 프로토콜은 **대칭키 암호화**와 **비대칭키 암호화**를 결합하여 작동하며, 안전한 통신을 보장한다. 또한 **키 검증**을 통해 통신 상대방의 신뢰성을 확인한다.  

- **대칭키 암호화**
	- **하나의 동일한 키**를 사용해 데이터를 암호화하고 복호화하는 방식.
	- 장점 : 암호화와 복호화가 빠름!
	- 단점 : 대칭키 암호화의 단점은 키가 노출되면 통신이 쉽게 해독될 수 있음
	- 그래서 SSH는 **세션 키**라고 불리는 대칭키를 안전하게 교환할 수 있는 방법을 추가적으로 사용한다.

- **비대칭키 암호화**
	- **공개키와 개인키**라는 두 가지 키를 사용하여 데이터를 암호화하고 복호화한다.
	- 공개키는 누구나 볼 수 있지만, 개인키는 오직 소유자만 가지고 있어야 한다.

SSH의 초기 연결 과정에서, 클라이언트는 서버의 **공개키**를 사용하여 세션을 설정하고 대칭키를 암호화하여 전송한다. 서버는 이 대칭키를 자신의 **개인키**로 복호화하고, 그 후에는 대칭키를 사용해 암호화된 데이터 통신을 계속한다. 이 과정에서 대칭키는 보안이 강화된 상태로 안전하게 전달된다. 과정을 요약하면 다음과 같다.  

1. **세션 설정:** 클라이언트는 서버와 연결을 시도하고, 서버는 자신의 공개키를 클라이언트에 제공한다.
2. **세션 키 교환:** 클라이언트는 비대칭키 암호화를 사용해 서버의 공개키로 대칭키(세션 키)를 암호화하여 전송한다.
3. **세션 시작:** 서버는 개인키로 대칭키를 복호화하고, 이제부터 대칭키를 사용해 빠르고 효율적인 암호화 통신이 시작된다.

#### 키 검증 방식
SSH는 **호스트 키 검증**을 통해 클라이언트가 서버의 신뢰성을 확인할 수 있도록 한다. 클라이언트가 서버에 처음 연결할 때 서버는 자신의 공개키를 제공하고, 클라이언트는 이를 기록한다. 이후 연결 시 클라이언트는 다음 방법을 통해 서버의 신뢰성을 검증한다:

- **Known_hosts 파일**: 클라이언트는 서버의 공개키가 **`~/.ssh/known_hosts`** 파일에 저장된 공개키와 일치하는지 확인한다. 만약 서버의 키가 변경되었거나 일치하지 않으면 경고 메시지가 표시되며, 클라이언트는 연결을 중단하거나 위험을 감수하고 계속 연결할 수 있다.
  
- **디지털 서명**: 서버는 연결 중에 디지털 서명을 사용해 자신의 신원을 증명할 수 있다. 서버는 클라이언트에게 개인키로 서명한 메시지를 제공하고, 클라이언트는 서버의 공개키를 사용해 서명을 검증한다.

#### 정리하면
- **대칭키 암호화**: SSH는 빠른 암호화 통신을 위해 세션에서 대칭키를 사용한다.
- **비대칭키 암호화**: 세션 키(대칭키)를 안전하게 교환하기 위해 비대칭키 암호화가 사용된다.
- **키 검증 방식**: SSH는 서버의 공개키를 검증하여 서버의 신뢰성을 확인하고, 이를 통해 도청이나 위장 공격을 방지한다.

이러한 SSH의 작동 방식은 클라이언트와 서버 간의 안전한 통신을 보장하며, 네트워크 상의 다양한 보안 위협으로부터 보호할 수 있게 한다.

<br>

### 2-11. Linux Partition
- **Primary Partition**
	- (주, 기본 파티션)
	- disk를 Logical하게 분할하는 가장 기본적인 방법 중 하나
	- MBR 시스템에서 최대 4개의 기본 Partition을 가질 수 있으며, GPT 기반 시스템에서는 이보다 많은 기본 Partition을 지원함
- **Extended Partition**
	- (확장 파티션)
	- MBR의 기본 Partition의 제한(최대 4개)을 극복하기 위해 사용
	- Extended Partition 내부에는 여러 개의 Logical Partition을 생성할 수 있음
-  **Logical Partition**
	- (논리 파티션)
	- Extend Partition 내부에 생성
	- 기본 Partition의 제한을 넘어서 추가적인 파티션을 생성할 수 있음
- **Swap Partition**
	- (스왑 파티션)
	- Memory가 부족할 때 사용되는 영역
	- Swap Partition은 시스템의 성능과 안정성을 개선
- **LVM**
	- (Logical Volume Manager)
	- 여러 개의 Disk 또는 Partition을 하나의 큰 Logical Volume으로 운용 가능
	- Partition 크기 변경, 스냅샷, RAID구성에 유용

<br>

### 2-12. MBR
MBR은 하드 디스크의 첫 번째 섹터(512바이트)에 위치한 데이터로, 하드 디스크의 전체 구조와 운영 체제(OS)의 부팅 정보를 저장하는 영역이다. 

#### MBR 구성
1. **부트 로더**: 운영 체제를 부팅하기 위한 작은 프로그램이 포함되어 있다. 이 부트 로더는 운영 체제가 설치된 파티션으로의 부팅을 초기화한다.
2. **파티션 테이블**: 디스크의 파티션 정보를 저장하는 테이블로, 최대 4개의 기본(primary) 파티션 또는 확장 파티션을 관리할 수 있다.
3. **디스크 시그니처**: 디스크를 고유하게 식별하는 ID로 사용된다.

#### sda5
`sda5`는 디스크의 특정 파티션을 나타낸다. 이를 좀 더 구체적으로 살펴보면:
- **sda**: 첫 번째 SATA 드라이브를 의미한다. 디스크를 가리키며, 이 디스크에는 여러 파티션이 있을 수 있다.
- **숫자 5**: 5는 파티션 번호를 의미한다. 일반적으로 `sda1`에서 `sda4`까지는 기본(primary) 또는 확장(extended) 파티션을 나타내고, 그 이상의 번호(`sda5`, `sda6` 등)는 확장 파티션 내에서 생성된 **논리(logical) 파티션**이다.  

`MBR의 파티션 테이블`은 최대 4개의 기본(primary) 파티션 또는 3개의 기본 파티션과 1개의 확장 파티션을 기록할 수 있다. 확장 파티션은 여러 논리(logical) 파티션을 포함할 수 있으며, `sda5`는 이러한 확장 파티션 내에 위치한 첫 번째 논리 파티션이다.
  
#### 부트 프로세스에서의 역할
MBR은 부트 로더를 통해 운영 체제를 로드할 파티션을 결정한다. 만약 운영 체제가 `sda5`에 설치되어 있다면, MBR의 부트 로더는 `sda5`로 부팅을 진행하게 된다. 이 과정에서 MBR은 파티션 테이블을 참조해 `sda5`의 시작 위치를 찾아 운영 체제가 위치한 논리 파티션으로 부팅을 넘긴다.

#### 정리하면
- **MBR**은 하드 디스크의 첫 번째 섹터에 위치한 부트 로더와 파티션 테이블을 포함하는 중요한 시스템 영역이다.
- **sda5**는 MBR에서 정의된 확장 파티션 내의 첫 번째 논리 파티션으로, 운영 체제가 설치될 수 있는 위치이다.
- MBR은 부트 과정에서 sda5와 같은 파티션을 참조하여 운영 체제를 부팅하는 역할을 한다.

이처럼 MBR과 sda5는 디스크의 부트 프로세스와 파티션 구조에서 중요한 역할을 하며, MBR은 부팅 시 운영 체제가 위치한 논리 파티션(sda5)을 식별하고 부팅을 진행하게 된다.

<br>
<br>
<br>

## 2-13. LVM
LVM(Linux Volume Manager)은 Linux에서 복잡한 스토리지 구성을 효율적으로 관리하기 위한 시스템으로 물리적 디스크를 하나의 논리적 볼륨으로 결합할 수 있고, 볼륨의 크기를 쉽게 조정 가능하다.

#### LVM 단위 구성
- **PV**
	- Physical Volume
	- LVM에서 블록장치에 접근하기 위해서 PV로 초기화가 필요
- **PE**
	- Physical Extent
	- PV를 구성하는 일정한 크기의 블록으로 LVM2에서 기본 크기가 4MB
	- LV의 LE와 1:1로 대응
- **VG**
	- Volume Group
	- PV들의 집합으로 LV를 할당할 수 있는 공간
	- PV로 초기화된 장치들은 VG로 통합됨
	- 사용자는 VG 안에서 유연성 높게 공간을 쪼개 LV 생성 가능
- **LV**
	- Logical Volume
	- 사용자가 최종적으로 다루게 되는 논리적 스토리지
- **LE**
	- LV를 구성하는 일정한 크기의 블록으로 PE와 마찬가지로 4MB
	- 각각의 LV들은 PE들과 1:1로 맵핑됨

<br>
<br>
<br>

### 2-14. Cron
Cron이란 OS Time-based job scheduling으로 demon의 일종이다. `/etc/crontab` 에 위치해 있다. **과제 수행 중 Cron 코드 작성 시 Sudo 명령어의 갯수를 잘 카운트해야한다!**

<details>
<summary>cron code</summary>
<div markdown="1">

``` bash
# The architecture of your operating system and its kernel version.
printf "#Architecture: "
uname -a

# The number of physical processors
printf "#CPU physical : "
cat /proc/cpuinfo | grep "physical id" | sort -u | wc -l

# The number of virtual processors
printf "#vCPU : "
cat /proc/cpuinfo | grep processor | wc -l

# The current available RAM on your server and its utilization rate as a percentage
printf "#Memory Usage: "
m_total=$(free -m | awk '$1 == "Mem:" {print $2}')
m_used=$(free -m | awk '$1 == "Mem:" {print $3}')
m_usage=$(awk "BEGIN {printf \"%.2f\", ($m_used/$m_total)*100}")
printf "%s/%s MB (%s%%)\n" "$m_used" "$m_total" "$m_usage"

# The current available memory on your server and its utilization rate as a percentage.
printf "#Disk Usage: "
d_total=$(df -Bg | grep '^/dev/' | grep -v '/boot$' | awk '{ft += $2} END {print ft}')
d_used=$(df -Bm | grep '^/dev/' | grep -v '/boot$' | awk '{ut += $3} END {print ut}')
d_per=$(df -Bm | grep '^/dev/' | grep -v '/boot$' | awk '{ut += $3} {ft += $2} END {printf("%d%%", ut/ft*100)}')
printf "%s/%sGb (%s)\n" "$d_used" "$d_total" "$d_per"


# The current utilization rate of your processors as a percentage
printf "#CPU load: "
mpstat | grep all | awk '{printf "%.1f%%\n", 100-$13}'

# The date and time of the last reboot
printf "#Last boot: "
last_boot=$(who -b | awk '{print $3, $4}')
printf "%s\n" "$last_boot"

# Whether LVM is active or not
if lsblk | grep -q "lvm"; then
    printf "#LVM use: yes\n"
else
    printf "#LVM use: no\n"
fi

# The number of active connections
printf "#Connections TCP : "
ss | grep 'ESTAB' | wc -l | tr -d '\n'
printf " ESTABLISHED\n"

# The number of users using the server
printf "#User log: "
who | wc -l

# The IPv4 address of your server and its MAC (Media Access Control) address
ip=$(hostname -I)
mac=$(ip link show | awk '$1 == "link/ether" {print $2}')
printf "#Network: IP %s (%s)\n" "$ip" "$mac"

# The number of commands executed with the sudo program
printf "#Sudo : "
grep 'COMMAND=' /var/log/auth.log | wc -l | tr -d '\n'
printf " cmd\n"
```
</div>
</details>

<br>
<br>
<br>

## 3. Evaluation


_2025.05 코드 리뷰 추가 삽입_

**try1 - review 1**  
<img src="https://i.imgur.com/3eVQVwt.png" width="300">  

**try2 - review 1**  
<img src="https://i.imgur.com/O6hFrz9.png" width="300">  

**try2 - reivew 2**  
<img src="https://i.imgur.com/6R0r7t0.png" width="300">

**try2 - review 3**  
<img src="https://i.imgur.com/bvaCct2.png" width="300">

태어나서 처음으로 가상머신, 그리고 그 위에 도커를 올려봤던 과제. 첫번째 try에서는 그 작동법도 미숙했고, 마지막 평가 항목에서 스크립트를 잘못짜서 fail을 받았다.  

해당 부분을 수정하고, 명령어나 figma 도식 등을 좀 더 깔끔하게 정리했다. 다행히 2차 try에서는 통과할 수 있었다. 평가 중 부트로더의 작동에 대해서 이야기를 좀 나누었는데, 아쉽게 둘다 해당 부분은 지식이 깊지 않기도 했고 마침 주변에 더 물어볼만한 사람이 없어서 마무리 했다.

<br>
<br>
<br>

## 4. Reference

- https://www.debian.org
- https://greencloud33.tistory.com/41
- http://forensic-proof.com/archives/439
