+++
title = '[tmp]'
date = 2025-06-12
draft = false
featured_image = "https://gohugo.io/images/hugo-logo-wide.svg"
tags = ['hugo']
+++

<br>

## 9주차: 클래스 상속
### 1. 상속이란 무엇인가? C++에서 사용되는 접근 지정자의 규칙을 설명하시오.
속성을 상속하는 class의 기능으로, 하나의 클래스에서 다른 클래스로 속성을 획득하는 프로세스 이다.

public 접근 지정자의 경우 외부, 파생클래스에서 모두 접근 가능하다.
protected 접근 지정자의 경우 자기 자신과 직접, 간접 파생 클래스에서만 접근 가능하고, 외부에서는 접근 불가능하다.
private 접근 지정자의 경우 선언된 클래스 내부에서만 접근 가능하며, 파생클래스와 외부 모두 접근 불가능 하다.

### 2. 프로그래밍 예제를 통해 단일 상속을 설명하시오.

``` c++
#include <iostream>
#include <string>

class Animal {
    public:
        std::string type = "Animal";
};

class Cat: public Animal {
    public:
        std::string name = "Cat";
};

int main() {
    Cat navi;
    std::cout << navi.type << "\n"; // Animal
    std::cout << navi.name << "\n"; // Cat
}
```

### 3. 프로그래밍 예제를 통해 다단계(multi-level) 상속을 설명하시오.

``` c++
#include <iostream>
#include <string>

class Animal {
    public:
        std::string main_type = "Animal";
};

class Cat: public Animal {
    public:
        std::string sub_type = "Cat";
};

class Navi: public Cat {
    public:
        std::string name = "Navi";

};

int main() {
    Navi navi;
    std::cout << navi.main_type << "\n"; // Animal
    std::cout << navi.sub_type << "\n"; // Cat
    std::cout << navi.name << "\n"; // Navi
}
```

### 4. 프로그래밍 예제를 통해 다중(multiple) 상속을 설명하시오.
``` c++
#include <iostream>
#include <string>

class Animal {
    public:
        std::string main_type = "Animal";
};

class Color {
    public:
        std::string color = "Red";
};

class Cat: public Animal, public Color {
    public:
        std::string sub_type = "Cat";
};

int main() {
    Cat navi;
    std::cout << navi.main_type << "\n"; // Animal
    std::cout << navi.sub_type << "\n"; // Cat
    std::cout << navi.color << "\n"; // Red
}
```

### 5. 프로그래밍 예제를 통해 계층적(Hya 상속을 설명하시오.
``` c++
#include <iostream>
#include <string>

class Animal {
    public:
        std::string main_type = "Animal";
};

class Dog: public Animal {
    public:
        std::string name = "Dog";
};

class Cat: public Animal {
    public:
        std::string name = "Cat";
};

int main() {
    Cat navi;
    Dog mini;
    std::cout << navi.main_type << "\n"; // Animal
    std::cout << navi.name << "\n"; // Cat

    std::cout << mini.main_type << "\n"; // Animal
    std::cout << mini.name << "\n"; // Dog
}

```

### 6. 프로그래밍 예제를 통해 하이브리드 상속을 설명하시오.

``` c++
#include <string>
#include <iostream>

class A {
public:
    std::string main_type = "A";
};

class B : virtual public A {
public:
    std::string sub_type1 = "B";
};

class C : virtual public A {
public:
    std::string sub_type2 = "C";
};

class D : public B, public C{
public:
    std::string my_type = "D";
};

int main() {
    D tmp;
    std::cout << tmp.main_type << "\n";
    std::cout << tmp.sub_type1 << "\n";
    std::cout << tmp.sub_type2 << "\n";
    std::cout << tmp.my_type << "\n";
}
```

### 7. 가상 클래스란 무엇인가? 프로그래밍 예를 들어 설명하십시오.
위 예시처럼 B와 C가 A를 상속하면, D는 A의 맴버를 두 번 복사하게 된다. 즉, D입장에서 A의 맴버를 참조할때 어떤 A의 복사본인지 모호함이 생기게된다. 따라서 B와 C가 A를 상속받을때 vitual 키워드를 붙여 D 입장에서 A가 한번만 상속되게 하여 모호함을 없애는 작업이 필요하고, 이것이 가상화 이다.

### 8. 생성 자와 소멸 자는 파생 클래스를 어떻게 호출하는가? 두 가지 프로그램의 예를 들어 설명하시오.

``` c++
#include <iostream>
#include <string>

class Animal {
    public:
        std::string main_type = "Animal";
        Animal() {
            std::cout << "Animal 생성자" << "\n";
        }
        ~Animal() {
            std::cout << "Animal 소멸자" << "\n";
        }
};

class Dog: public Animal {
    public:
        std::string name = "Dog";
        Dog() {
            std::cout << "Dog 생성자" << "\n";
        }
        ~Dog() {
            std::cout << "Dog 소멸자" << "\n";
        }
};

int main() {
    Dog mini;
    return 0;
}

```

Animal 생성자
Dog 생성자
Dog 소멸자
Animal 생성자

즉, 메모리 적재 시 Base 클래스 먼저 만들고(생성자 호출), 그다음 파생 클래스.
메모리 정리 시 파생 클래스 먼저 없애고, 그 다음 Base 클래스 소멸자 호출

# 10주차: 클래스 템플릿

### 1. 클래스 템플릿의 구문을 정의하고 예를 작성해보시오.
클래스 템플릿은 다른 형식의 데이터를 재활용할 수 있는 일반 형식이다.
즉, 상이한 데이터 형식을 다루는 단일 일반 컨테이너 이다.

``` c++
template <class T>
class A {
    T a, b;
public:
    void getData();
    void putData();
}
```


### 2. 클래스 템플릿을 사용하여 2 개의 숫자를 합을 구하는 프로그램을 작성하시오. 세부적으로 + 연산자  오버로딩을 사용하는 예의 프로그램 작성하시오.

``` c++
#include <iostream>

template <class T>
class A {
    T data;
public:
    A(T tmp) : data(tmp) {}
    A operator+(const A& other) const {
        return A(data + other.data);
    }

    T getData() const {
        return data;
    }
};

int main () {
    A<int> num1(10);
    A<int> num2(20);
    A<int> result = num1 + num2;

    std::cout << result.getData() << "\n";
    return 0;
}
```

###  3. 클래스 “인스턴스화”는 무엇인가? 프로그램의 예로 설명하시오.
템플릿 매개변수를 다양한 데이터 형식으로 대치하는 과정이다.

``` c++
template <class T>
class A {
    T data;
    A (T input) : data(input) {}
}

int main () {
    A<int> tmp(10); // 인스턴스 화
    return 0;
}
```


### 4. 클래스 템플릿 맴버 함수를 프로그래밍 예로 설명하시오.

``` c++
#include <string>
#include <iostream>

template <class T>
class A {
public:
    T data;
    A (T input) : data(input) {}
    void printData();
};

template <class T>
void A<T>::printData() {
    std::cout << this->data << "\n";
}

int main () {
    A<std::string> tmp("hello");
    tmp.printData();
    return 0;
}
```


### 5. 클래스 템플릿 선언에서 friend 멤버를 선언하는 방법을 설명하시오.
우선 friend 키워드는 class의 private, protected 맴버에 외부 함수 또는 다른 클래스가 접근하게 해주는 것이다.

우선 템플릿 클래스 `A` 가 있다고 가정해보자. 이때 `A` 내부에 firend 맴버 함수 또는 클래스를 선언할 수 있을 것이다. 총 3가지 방법이 있다.

**첫번째 방법: 템플릿이 아닌 friend class or function**  
그냥 `A` 내부에 friend 키워드와 함께 등록만 하면 ok!
``` c++
template <class T>
class A {
    friend class C;
    friend void B::functionB();
};
```

**두번째 방법: bound friend class template or function template**  
T 타입에 고정(bound)된 friend를 등록한다. 즉, A<int>는 C<int>와 B<int>::functionB() 만 friend로 인정
``` c++
template <class T>
class A {
    firend class C<T>;
    firend void B<T>::funtionB();
}
```

**세번째 방법: unbound friend class template or function template**
타입에 상관없이, 해당 템플릿 전체가 friend이다. 즉, A<int>건 A<double>이건 상관없이 모든 C<U>, functionB<U>가 접근 가능하다.
``` c++
template <typename T>
class A {
    template <typename U>
    friend class C;              // 모든 타입의 C<U>가 friend
    template <typename U>
    friend void functionB(U);    // 모든 타입의 functionB가 friend
};
```

### 6. 네포 클래스 템플릿을 예를 들어 간략히 설명하시오.
이 구조는 클래스 list<T>안에 T를 사용하는 클래스를 선언하여 사용하는 것. 캡슐화를 높인다.

``` c++
template <class T>
class list {
private:
    class data {
        T data;
    }
}
```

###  7. 멤버 템플릿 코드를 어떻게 작성하는지 예를 들어 설명하시오.
``` c++
template <class T>
class A {
private:
    template <class U>
    class integer_number {
        U data;
        T value;
    };

public:
    template <class Type>
    void sum(Type a, Type b) {
        Type c = a + b;
        std::cout << "c=" << c << '\n';
    }
};
```
A<int> 처럼 인스턴스를 만들었더라도, sum<int>, sum<float> 등 자유롭게 사용 가능하다.

# 11주차: 포인터, 가상함수 및 다형성

###  1. 다형 성이란 무엇인가? 다형 성을 2가지로 분류하여 설명하시오.
다형성은 여러 형태의 동작을 수행하게 하는 객체 지향의 개념을 의미한다.
- 정적 다형성: 호출될 대상이 컴파일 시점에 확정된다. (ex: 함수, 연산자 오버로딩)
- 동적 다형성: 호출될 대상이 런타임에 확정된다. (ex: 가상함수)

###  2. 프로그래밍 예를 사용하여 객체에 대한 포인터를 설명하시오.
``` c++
#include <iostream>

class A {
public:
    std::string id = "A";
};

int main() {
    A tmp;
    A* p;

    p = &tmp;
    std::cout << p->id  << '\n';
    return 0;
}
```

### 3. 파생 클래스에 대한 포인터를 보여주는 프로그램 예를 작성하시오.

``` c++
#include <iostream>
#include <string>

class Human {
    public:
        int hp = 100;
};

class Hero: public Human {
    public:
        std::string skill = "fireball";
};

int main() {
    Human *human_ptr;
    Human man;
    human_ptr = &man;

    Hero *hero_ptr;
    Hero Superman;
    hero_ptr = &Superman;

    // 자식 포인터로 부모 접근 -> ok
    std::cout << hero_ptr->hp << '\n';
    std::cout << hero_ptr->skill << '\n';

    // 부모 포인터로 자식 접근 -> no
    std::cout << human_ptr->hp << "\n";
    // std::cout << human_ptr->skill << "\n"; // no
}
```


### 4. 포인터 타입캐스팅은 어떻게 하는가? 프로그래밍으로 설명예시를 들어 작성하시오.

``` c++
#include <iostream>
#include <string>

class Human {
    public:
        virtual ~Human() {};
        int hp = 100;
    
};

class Hero: public Human {
    public:
        std::string skill = "fireball";
};

int main() {
    Hero superman;
    Human* human_ptr = &superman;

    Hero* hero_ptr = dynamic_cast<Hero*>(human_prt);
    return 0;
}
```

###  5. 가상함수는 무엇 인가? 프로그램의 예를 들어 설명하시오.
가상 함수는 상속 관계에서 부모포인터로 자식 객체를 가리킬 때, 자식 클래스에서 오버라이딩한 함수를 호출할 수 있게 해주는 기능이다. 이를 위해 부모 클래스 함수 선언 앞에 virtual 키워드를 붙인다. 이렇게 하면 런타임에 실제 객체 타입에 따라 함수가 동적으로 바인딩되어 호출된다.

``` c++
#include <iostream>
#include <string>

class Human {
public:
    int hp = 100;
    virtual ~Human() {};
    virtual void printData(std::string input) {
        std::cout << input << hp << '\n';
    }
};

class Hero: public Human {
public:
    std::string skill = "fireball";
    void printData(std::string input) {
        std::cout << input << skill << '\n';
    }
};

int main() {
    Human* ptr = new Hero();
    ptr->printData("log: ");
    delete ptr;
    return 0;
}
```

### 6. 가상함수 작성 규칙을 설명하시오.
- 기본 클래스에서 정의한다.
- 정적 맴버가 될 수 없다.
- 다른 클래스에 friend 함수로 선언될 수 있다.
- 클래스의 public 영역에 선언 되어야 한다.
- 함수의 원형은 기본, 파생 클래스에서 모두 동일해야한다.
- 기본 클래스 포인터로 파생 클래스 객체 주소를 지정할 수 있으나, 반대의 경우 불가능
- 소멸자는 가상으로 만들 수 있다.

### 7. 가상함수의 장점을 쓰시오.
가상함수를 사용하면 파생 클래스의 객체 맴버 함수 접근을 위하여 포인터를 형 변환 할 필요가 없다.

### 8. 순수 가상 함수는 무엇입니까? 예를 들어 설명하시오.
파생 클래스 함수가 재정의할 수 있도록 인터페이스만 제공하고, 베이스 클래스에서는 실제 구현하지 않는 함수이다.

아무것도 하지 않는 맴버함수이다.
기본 클래스에서 선언만한다.
순수 가상 함수를 가진 클래스는 인스턴스화 할 수 없다.

``` c++
#include <iostream>
#include <string>

class Human {
public:
    int hp = 100;
    virtual ~Human() {};
    virtual void printData(std::string input) = 0;
};

class Hero: public Human {
public:
    std::string skill = "fireball";
    void printData(std::string input) {
        std::cout << input << skill << '\n';
    }
};

int main() {
    Human* ptr = new Hero();
    ptr->printData("log: ");
    delete ptr;
    return 0;
}
```

### 9. 가상 소멸자는 어떻게 사용하는가? 적절한 예를 들어 설명하시오.

``` c++
#include <iostream>
#include <string>

class Human {
public:
    int hp = 100;
    virtual ~Human() {};
    virtual void printData(std::string input) = 0;
};

class Hero: public Human {
public:
    std::string skill = "fireball";
    void printData(std::string input) {
        std::cout << input << skill << '\n';
    }
};

int main() {
    Human* ptr = new Hero();
    ptr->printData("log: ");
    delete ptr;
    return 0;
}
```

동적 할당된 파생 클래스 객체를 기본 클래스 포인터로 관리할 때, delete 연산이 올바르게 파생 클래스의 소멸자를 호출하려면 기본 클래스의 소멸자에 반드시 virtual을 붙여야 한다. 그렇지 않으면 delete base_ptr;를 수행했을 때 파생 클래스의 소멸자는 건너뛰고 기본 클래스 소멸자만 호출되므로, 파생 클래스에서 할당한 메모리나 자원이 해제되지 않아 메모리 누수가 발생할 수 있다.

# 12주차
### 1. Stream은  무엇 인지를 요약하여 설명하시오.
프로그램과 장치 사이에서 바이트가 한 방향으로 흘러가도록 추상화한 개념이다.

### 2. C++ 언어에서 지원하는 I/O 시스템의 특징을 간단히 설명하시오.
모든 I/O 작업은 공통 클래스인 ios, streambuf에서 파생된 스트림 클래스에서 수행할 수 있다.

### 3. C++ 언어와 C 언어의 I/O 기능은 어떻게 다른가?
c는 print, scanf 와 같은 문자열 기반 함수로 동작한다.
그러나 c++의 경우 cin, cout, <<, >> 처럼 객체와 연산자를 통해 스트림과 버퍼구조로 입출력을 관리하고 있다.

### 4. cin과 cout 은 키워드가 아닌 이유를 설명하시오.
cin과 cout는 키워드가 아니라 std::istram, std::ostream의 전역 객체이기 때문이다.

### 5. 입력 stream에서 지원하는 get() 함수는 어떻게 사용하는지 예를 들어 설명하시오.
get() 함수는 공백과 개행을 포함한 정확히 한글자 또는 지정한 길이만큼의 문자를 읽어온다. 예를들어 `std::cin.get(buf, 20)` 은 buf에 줄바꿈 전까지 19자 (이 경우 널값 고려)를 읽어온다.

### 6. 다음 두 개의 실행 문은 어떻게 다른지를 설명하시오.
     cin >> c;   cin.get(c);
cin >> c; 의 경우 공백과 개행을 건너띄지만, cin.get(c)l의 경우 만나는 문자 그 자체를 가져와 공백, 개행도 가져온다.

### 7.  iomanip 의 역할은 무엇인지 설명하시오.
setw, setfill 과같이 출력표기를 선언적으로 바꾸는 manipulator이다.

### 8.  fill() 함수의 역할은 무엇인지 설명하시오.
setw가 남긴 빈 칸을 어떤 문자로 채울지 설정하거나, 어떤 문자로 채워져야하는지 조회하여 출력서식을 맞춘다.

### 9.  set() 함수의 역할은 무엇인지 설명하시오.
스트림 비트 플래그를 켜거나 끄도록해 출력 형식을 제어한다.

### 10. C++에서 입력 및 출력 작업은 무엇인가? 라벨이 있는 블록 다이어그램을 그리고 설명하시오.
input device로 들어온 데이터가 input stream 버퍼에 임시 저장된다. 프로그램은 이 버퍼에서 필요한 만큼 데이터를 꺼내와 처리한다. 이 결과는 다시 삽입연산을 통해 output stream에 담긴다.

### 11. I/O 작업을 수행하는 클래스의 계층 구조를 설명하시오.

### 12. 데이터 파일의 유형을 설명하시오.
인간이 읽을 수 있는 텍스트 파일과, 메모리 형태 그대로 저장된 바이너리 파일이 있다.

### 13. 파일을 열고 닫는 방법을 예시를 들어 설명하시오.
생성자에서 바로 열기: 객체 생성 시 파일 이름을 넘겨주면 생성자 안에서 자동으로 open이 호출된다.
`std::ifstream fin("text.dat");`  

open 함수 사용하기  
std::ifstream fin;  
fin.open("text.dat");  

### 14. 텍스트 파일에서 입력 및 출력 작업을 수행하는 방법을 예시를 들어 설명하시오.
program에서 i/o 인터페이스를 통해 file을 open 하고, 그 file에서 get 등의 함수를 반복문 로직에 넣어 파일을 읽거나 수정할 수 있다.

### 15. 바이너리 파일의 입력 및 출력 작업에 대해 설명하시오.
write(), read()로 바이트 배열을 그대로 일

### 16. 어떻게 파일의 끝을 어떻게 감지하는가? 프로그램의 예시를 들어 설명하시오.
while(std::getLine(fin.eof())) 와 같이 eof 함수를 통해 

### 17. 파일 포인터와 그 조작에 대해 간략하게 설명하시오.
get 포인터로 읽고, put 포인터로 쓰기 조작한다. 이때 각각의 포인터를 조작해 파일 처음, 끝 또는 원하는 위치로 이동시킬 수 있으며, 포인터의 위치도 알아낼 수 있다.

# 13주차
### 1. C++ 에서 5 가지 종류의 Casting Operator를 나열하고 상속 클래스에서 다형적 형식의 캐스팅 예를 보이시오.

### 2. const_cast 의 기능을 간단히 설명하시오.
상수성을 제거하거나 추가할때 사용하는 캐스팅연산자이다.

### 3. static_cast 의 기능을 간단히 설명하시오.
컴파일 타임에 타입 간 명시적 변환을 수행하는 연산자이다.

### 4. reinterpret_cast 는 어떠한 때에 사용하는가?
포인터나 정수형 사이 저수준 형식 변환을 수행할때 사용하는 캐스팅 연산자 이다.

### 5. using 키워드의 2 가지 사용예를 들고 설명하시오.
1. namespace 이름을 현재 범위로 가져올때. using namespace std;
2. 타입 별칭을 지정할때. using myvector = std::vector<int>;

### 6. unnamed namespace 의 사용예를 들고 설명하시오.
파일 단위 내부에서만 사용하는 식별자를 선언할때 쓰인다.
``` c++

namespace {
    int counter = 0;
    void increase() {
        counter++;
    }
}

int main() {
    increase();
    increase();
}

```

### 7. static class member 는 일반 member와 어떻게 다른가?
일반 맴버 생명주기는 객체 생성-소멸 과정을 따른다.
그러나 static class member는 객체가 아닌 프로그램 시작-종료 과정을 따른다.
따라서, 프로그램 시작 시 메모리에 할당되고, 프로그램이 종료될때까지 유지된다.

### 8. const member 함수에서 mutable의 기능을 설명하시오.
mutable 키워드가 붙은 맴버변수의 경우 const 맴버 함수 안에서도 수정이 가능하다.

( 표준템플릿 라이브러리 )

### 1.  STL 은 무엇인가? C++ 표준라이브러리와어떻게다른가?
STL은 C++ 에서 템플릿 기반으로 구현된 자료구조와 알고리즘의 집합이다. 표준라이브러리는 STL을 포함하는 더 넓은 개념이다.

### 2. 컨테이터의3가지종류를쓰시오.
순차 컨테이너  vector, deque, list, array  

연관 컨테이너 set, map  

컨테이너 어댑터 stack, queue  

### 3. 순차(sequence) 컨테이너와 연관(associative) 컨테이너와의 주된 차이점은 무엇인가?
순차 컨테이너의 경우 데이터를 삽입한 순서대로 저장하고 위치기반 접근이 가능
연관 컨테이너의 경우 키-벨류 형태로 저장하며 키기반 검색과 연산이 효율적으로 이뤄짐

### 4. 시퀀스 컨테이너를사용하기에가장좋은상황은무엇인가?
데이터를 입력한 순서대로 저장하고 싶을때 사용한다. 

### 5. 연관 컨테이너를사용하기에가장좋은상황은무엇인가?
키를 기준으로 빠르게 검색하고 싶을때

### 6. iterator 는 무엇인가? 그 특징은 무엇인가?
c++ STL에서 컨테이너 요소를 순차적으로 접근하기 위한 일종의 포인터로, 컨테이너 내부구조를 몰라고 순차 접근할수있는 추상성을 제공한다. 또한 포인터처럼 ++,--등 연산 사용가능하다.

### 7. 알고리즘은무엇인가?통상적인알고리즘과STL알고리즘은무엇이다른가?.
어떤 문제를 해결하기 위한 절차나 계산 방법을 의미한다.

### 8. STL 알고리즘은 어떻게동작시키는가?
반복자 또는 알고리즘 컨테이너 내부 맴버함수를 통해 작동시킬 수 있다.

### 9. 다음 아래의각각의차이점을서술하시오.
 a) list 와 vector 이중연결리스트로 구현 / 연속된 메모리 배열로 구현
 b) set와 map value 만 저장 vs key-value 쌍 저장
 c) map 과 multimap key중복 허용 / 불허용
 d) queue 와 deque queue 전단에서 제거, 후단에서 삽입만 가능 / 양쪽다 제거 삽입 가능
 e) array 와 vector 고정크기배열 / 유동크기배열

### 10. 3 가지 순차컨테이너의성능특성을비교하시오.

vector 인덱스를 통한 임의 접근 O(1), 끝에서 삽입과 삭제 O(1), 중간 O(n);

list 연속적이지는 않지만 

dequeue

### 11. 아래의 응용프로그램에서컨테이너의적절한사용법을제안하시오.
a) 컨테이너끝쪽에원소삽입 벡터
b) 컨테이너양쪽끝에빈번한원소삽입과삭제 디큐
c) 컨테이너중간에빈번한원소삽입과삭제 리스트
d) 원소의빈번한랜덤읽기와쓰기 벡터

### 12. 다음 설명중참과거짓을식별하시오.
 a) STL iterator(반복자) 는 포인터의 일반 형이다.
 b) STL iterator(반복자)의 한가지 목적은 컨테이너의 알고리즘을 연결하기 위한 것이다.
 c) STL 알고리즘은 컨테이너의 멤버함수이다.
 d) STL 벡터의 크기는원소가제거되었을때,변하지않는다.
 e) STL 알고리즘은 C 언어의배열과같이사용되어진다.
 f) STL iterator는 컨테이너를 통하여 항상 앞 또는 뒤쪽방향으로이동할수있다.
 g) 맴버 함수end() 는 컨테이너의마지막요소의참조값을반환한다.
 h) 맴버 함수back() 는 컨테이너마지막요소를제거한다.
 i) sort() 알고리즘은 랜덤 읽기 쓰기 반복자를필요로한다.
 j) map 은 같은 키값을갖는두개이상의요소를가질수있다.