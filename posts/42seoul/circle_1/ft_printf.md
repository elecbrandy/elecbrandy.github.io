+++
title = 'ft_printf'
date = 2023-11-15
featured_image = "http://t1.daumcdn.net/cfile/146B7E10B091A05214"
tags = ['c', '42seoul']
+++

{{<series title="📚 42seoul" series="42seoul">}}

<br>

## 1. 소개


> putnbr and putstr aren’t enough

42서울 본과정 입과 후 두번째로 수행한 과제로, 말 그대로 C언어의 `printf` 함수를 재현하는 과제이다. bonus는 수행하지 않았고, 기본적인 내용만 구현하다보니 생각보다 난이도가 쉬웠던 것 같다. libc의 `printf` 함수를 재구현해야 하며, 실제 `printf`처럼 버퍼 관리를 수행해서는 안 된다. 서식 지정자 `cspdiuxX%`를 구현해야한다.

<br>
<br>
<br>

## 2. ft_printf 명세서

- **PROTOTYPE**
	- `int ft_printf(const char *str, ...);`
- **PARAMETER**
	- `const char *str` : format 이라는 이름의 문자열 상수 (서식 문자열)
	- `...` : 생략 기호로, 두번째 이후 인수부터는 인수의 개수와 타입을 점검하지 않으며, 컴파일러는 이후의 인수에 대해서 개수, 타입에 상관없이 그대로 함수에 넘겨줌
- **DESCRIPTION**
    - `%c` 단일 문자를 인쇄
	- `%s` 문자열을 인쇄
	- `%p` void * 포인터 인수는 16진수 형식으로 인쇄
	- `%d` 십진수(기본 10)를 인쇄
	- `%i` 기본 10의 정수를 인쇄
	- `%u` 부호 없는 10진수(베이스 10)를 인쇄
	- `%x` 16진수(베이스 16) 소문자 형식으로 숫자를 인쇄
	- `%X` 16진수(베이스 16) 대문자 형식으로 숫자를 인쇄
	- `%%` 백분율 기호를 인쇄
	- `External functions`
		- malloc, free, write
		- va_start, va_arg, va_copy, va_end
- **RETURN VALUES**
	- _Upon successful return, these functions return the number of characters printed (excluding the null byte used to end output to strings)._
	- 성공적으로 반환되면, 이 함수들은 인쇄된 문자 수를 (출력을 끝내는 데 사용되는 널 바이트 제외) 문자열을 반환함

<br>
<br>
<br>

## 3. 개념 정리

### 3-1. 가변인자
가변인자 다루는 것에 중점을 둔 과제인 만큼, `va_` 함수를 통해 가변인자를 통제하는 방법을 알아야한다.

<br>

### 3-2. 바이트 패딩
우리는 왜 char형을 읽는 순간 `(char)va_arg(ap, int);` 을 사용하는가? char형 자료를 읽는데 왜 int형 만큼 읽어오는 것인가?
바이트 패딩은 CPU가 데이터를 효율적으로 처리하게 하는 데 중요한 역할을 하며, 당연하게도 이는 32비트와 64비트 운영 체제 간의 데이터 처리 방식에 차이를 가져온다.  

그러나 바이트 패딩만으로 설명할 수 있을까?
다만 바이트 패딩만으로 위 질문에 답하기 애매한것은 운영체제의 비트에 따라 데이터 처리 단위가 상이하기 때문이다.  

32비트 운영 체제는 4바이트, 64비트 운영 체제는 8바이트 단위로 데이터를 처리하기 때문에, 카뎃의 의도가 정말 바이트 패딩을 통해 데이터를 효율적으로 처리하기 위함이었다면 운영체제의 종류를 고민한 흔적이 코드에 들어있어야 할 것 이다.  

그렇지만 대부분 `(char)va_arg(ap, int);` 을 명시적으로 사용하곤 한다.

유력한 다른 이유는 원시 C언어 시절에는 함수 프로토타입이 존재하지 않았기 때문에, 함수로 전달되는 인자의 정확한 자료형을 알 수 없었다. 따라서 모든 인자는 int로 처리되었고, 이러한 관행의 흔적이라고 보는 것이 좀 더 타당해보인다.

<br>

## 4. Mandatory


<img src="https://imgur.com/Ghuekwt.png" max-width=100%>

<br>

#### step 01
`ft_isformat`을 통해 지정된 포맷인지 확인하며 문자열을 읽어나간다.

#### step 02
지정된 포맷을 만났을 경우, `ft_parse_format` 함수를 통해 가변인자를 읽어 각 포맷에 맞게 변환한다.

#### step 03
지정된 포맷이 아닌 경우, 문자 하나 하나 `write` 함수를 통해 출력한다.

<br>

### 4-1. 구현

#### ft_printf

``` C
int	ft_printf(const char *format, ...)
{
	int		print_cnt;
	va_list	ap;

	va_start(ap, format);
	print_cnt = ft_print_format(format, ap);
	va_end(ap);
	return (print_cnt);
}
```
우선 `printf`의 return 값은 print된 문자의 수이므로 `printf_cnt` 함수에 담았다가 return 하는 방식을 선택했다.

<br>

#### ft_printf_format
``` c
int	ft_print_format(const char *str, va_list ap)
{
	int	print_cnt;

	print_cnt = 0;
	while (*str)
	{
		if (*str == '%' && ft_isformat(*(str + 1)))
		{
			ft_parse_format(*(str + 1), ap, &print_cnt);
			str++;
		}
		else
			ft_putchar_fd(1, *str, &print_cnt);
		str++;
	}
	return (print_cnt);
}
```
함수 `ft_printf_format`은 인자로 받은 `const char *fortmat`을 문자 `%`가 나올 때까지 탐색한다. 문자 `%`을 발견하면, `%` 바로 뒤의 포맷을 확인해서 해당하는 포맷과 알맞은 출력을 진행한다.

<br>

#### ft_putbase
``` c
void ft_putbase(unsigned int n, char *base, unsigned int number, int *cnt)
{
    if (*cnt == -1)
        return ;
    if (n / number != 0)
        ft_putbase(n / number, base, number, cnt);
    ft_putchar_fd(1, base[n % number], cnt);
}
```
진법에 맞는 숫자로 출력을 원할 때, 재귀를 사용하면 생각보다 코드가 깔끔해진다.

<br>
<br>
<br>

## 5. Evaluation


_2025.05 코드 리뷰 추가 삽입_

**try1 - review 1**  
<img src="https://i.imgur.com/C2zu5O2.png" width="300">  

**try1 - reivew 2**  
<img src="https://i.imgur.com/ywcMvSz.png" width="300">

**try1 - review 3**  
<img src="https://i.imgur.com/faSANvo.png" width="300">

ft_printf 과제는 정말 심혈을 기울여서 작업했고, 깔끔해보이고자 노력했던 과제이다. 또한 평가자들에게 figma로 도식을 그려가며 설명했다.  

첫번째 평가자 분에게 밤 늦은 시간 평가를 받았던 기억이 떠오른다. 아주 상세한 질문부터 날카로운 질문을 계속 해주셔서 매우 당황했었다. 그냥 당연하다고 짰던 분기문 등에 대하여 왜 그렇게 작성했는지 워드 하나하나를 톺아보며 질문해주셨다. 이런 분들이 많아져야 42 커뮤니티가 건강해지는게 아닐까? 아직도 기억에 남는 평가였고, 정말 좋은 경험이었다.

<br>
<br>
<br>

## 6. Reference

- https://jangsalt.tistory.com/entry/%EA%B0%80%EB%B3%80-%EC%9D%B8%EC%88%98-vastart-vaend-vaarg-valist
- https://jhnyang.tistory.com/293
- https://www.gnu.org/software/libc/manual/html_node/Argument-Macros.html
- https://azrael.digipen.edu/~mmead/www/Courses/CS120/VariadicFunctions.html#STACKS

<br>
<br>
<br>
