+++
title = '[42seoul] libft'
date = 2023-11-03
featured_image = "http://t1.daumcdn.net/cfile/116C5A10B09188A10A"
tags = ['c', '42seoul']
+++

{{<series title="📚 /42seoul 시리즈" series="42seoul">}}

<br>

## 1. 소개


> Your very first own library  

42서울 본과정 입과 후 첫번째로 만나는 과제로 앞으로 본과정에서 사용할 라이브러리를 만드는 것이 목표이다.
이후 과제를 수행하며 자주 사용할 함수들이 몇가지 있기 때문에 최대한 범용성 높게 - 커스텀하기 쉽게 만드는 것을 목표로 했다.

본과정에서는 과제에서 허용하지 않은 라이브러리-__그것이 기본 라이브러리라 할지라도__-는 절대 사용할 수 없다. 그 말은 곧 `strcpy, strlen, atoi, strjoin` 등 앞으로 기본적인 함수들을 사용하지 못한다는 것을 의미한다. 따라서, 기존 라이브러리를 대체해서 우리가 필요한 여러 함수들을 실제로 구현해야한다.  

항상 느끼는 것이지만 `norm` 규칙의 첫번째 목표는 카뎃이 다른 카뎃의 코드를 보았을 때 최소한의 일관성을 유지하여 쉽게 읽을 수 있게 하는 것... 이고 두번째는 코드 길이를 적당히 조절함으로써 자연스럽게 모듈화를 하게 하는 것. 그 이상의 의미는 두지 않기로 했다.  

<br>
<br>
<br>

## 2. libft 명세서

- **Part 1 - Libs functions**
	- ft_isalpha, ft_isdigit, ft_isalnum, ft_isascii, ft_isprint
	- ft_strlen , ft_memset, ft_bzero, ft_memcpy, ft_memmove, ft_strlcpy, ft_strlcat, ft_strncmp
	- ft_strchr, ft_strrchr, ft_toupper, ft_tolower
	- ft_memchr, ft_memcmp, ft_strnstr, ft_atoi
	- ft_calloc, ft_strdup

- **Part 2 - Addtional functions**
	- ft_substr, ft_strjoin, ft_split, ft_itoa, ft_strmapi, ft_striteri
	- ft_putchar_fd, ft_putstr_fd, ft_putendl_fd, ft_putnbr_fd

- **Part 3 - Bonus functions**
	- ft_lstnew, ft_lstadd_front, ft_lstsize, ft_lstlast, ft_lstadd_back, ft_lstdelone, ft_lstclear, ft_lstiter, ft_lstmap

<br>
<br>
<br>

## 3. 개념 정리

### 3-1. size_t
해당 운영체제에서 포함할 수 있는 최대 크기의 데이터 타입으로, 32비트 운영체제에서 4바이트, 64비트 운영체제에서 8바이트로 정의되어있다. 객체의 크리를 나타내는 부호 없는 정수 유형! `sizeof` 연산자의 결과값이기도 하며, 결국 '크기'를 다룰 때 선호한다. 과거 레지스터 별로 달랐던 자료의 범위 값으로 인한 메모리의 낭비나 부족을 막기 위해 사용했다.

<br>

### 3-2. atoi의 한계
사실 `atoi` 함수는 **LONG_MAX**와 **LONG_MIN**을 초과하는 범위에서 결과값이 고정되어있다. 이는 현재 `atoi` 함수 내부를 들여다보면 궁금증을 풀 수 있으니 여러 버전의 오픈소스를 통해 `atoi`의 구현을 살펴보자. 추가적으로 `strol` 함수에 대해서 공부해보자.

<br>

### 3-3. Parity bit
패리티 비트는 정보 전달 과정에서 오류가 생겼는지 검사하기 위한 비트이다. 오류 검출을 위해 전송하는 데이터의 끝에 1비트를 더하여 전송하는 방법이다. 1바이트(8비트) 구조에서 피리티 비트는 7비트 크기의 ASCII 코드를 제외한 나머지 1비트를 의미한다.

<br>
<br>
<br>

## 4. Evaluation


_2025.05 코드 리뷰 추가 삽입_

**try1 - review 1**  
<img src="https://i.imgur.com/zM3kpYn.png" width="300">  

**try1 - reivew 2**  
<img src="https://i.imgur.com/x6k1ggU.png" width="300">

**try1 - review 3**  
<img src="https://i.imgur.com/VWCVqnm.png" width="300">

과정을 끝내고 평가자들의 코드리뷰를 다시 보내 감회가 새롭다. 정말 저때는 캐스팅이라는 단어를 처음 접하며 과제를 풀었던 기억이 난다. 변수의 남용에 대해서도 처음으로 다시 생각해볼 수 있었던, 아주 의미있는 첫번째 과제였다.  

리뷰를 다시 보니, 저때까지만 해도 chat gpt라는 것은 하나의 신기한 질문기? 단순한 새로운 대답기? 가 나온 느낌이라 다들 이것저것 간단하게 물어보는 용도로만 사용했던 것 같고, 성능도 썩 좋지 않았던 것으로 기억난다. 기술발전이 이렇게 빠를 줄은 몰랐다. 

<br>
<br>
<br>

## 5. Rerference

- https://man.freebsd.org/cgi/man.cgi

