+++
title = 'DFS'
date = 2026-02-03
featured_image = "https://preview.redd.it/l1y3zxept0c01.png?width=1080&crop=smart&auto=webp&s=5bece4f6883ce8507cf8614621041d3c44714112"
tags = ['algorithm', 'cpp', 'dfs']
draft=true
+++

{{<series title="📚 algorithm" series="algorithm">}}

<br>

## 1. 소개

Depth-First Search, 즉 깊이 우선 탐색은 그래프나 트리 구조를 탐색할 때 루트 노드(혹은 시작 노드)에서 시작하여 다음 분기로 넘어가기 전에 해당 분기를 완벽하게 탐색하는 방법이다.
이번 글에서는 DFS의 동작 원리를 정리하고, 가장 기본적인 재귀 구현과 이를 최적화한 DP(메모이제이션) 구현을 비교해보고자 한다.

<br>
<br>
<br>

## 2. DFS란 무엇인가

쉽게 비유하자면 미로 찾기와 같다! 갈림길이 나오면 무조건 한쪽 길을 선택하여 막다른 벽이 나올 때까지 계속 전진한다. 벽을 만나면(더 이상 갈 곳이 없으면) 가장 가까운 갈림길로 돌아와 가보지 않은 다른 길을 탐색한다. 이러한 특성 때문에 DFS는 다음과 같은 특징을 가진다.

- **모든 노드 방문**
    - 그래프의 모든 정점을 방문해야 할 때 적합하다.
- **경로의 특징 저장**
    - 경로상의 노드들을 기억해야 하는 문제(예: 미로 찾기 경로 출력)에 유리하다.
- **자료구조**
    - 후입선출(LIFO) 방식인 **스택(Stack)** 혹은 시스템 스택을 이용하는 **재귀(Recursion)** 를 사용한다.

<br>
<br>
<br>

## 3. 동작 원리와 시간 복잡도

DFS의 핵심은 `되돌아갈 곳을 기억하는 것` 이다.

1. 탐색 시작 노드를 스택에 넣고 방문 처리한다.
2. 스택의 최상단 노드에 방문하지 않은 인접 노드가 있으면, 그 노드를 스택에 넣고 방문 처리한다.
3. 방문하지 않은 인접 노드가 없으면 스택에서 최상단 노드를 꺼낸다(Pop).
4. 스택이 빌 때까지 2~3번 과정을 반복한다.

**시간 복잡도**:
노드(Vertex)의 수를 , 간선(Edge)의 수를 라고 할 때:

* **인접 리스트**로 구현 시: 
* **인접 행렬**로 구현 시: 

대부분의 알고리즘 문제에서는 희소 그래프(Sparse Graph)가 주어지는 경우가 많으므로, 메모리와 속도 효율면에서 인접 리스트 방식이 선호된다.

## 4. 구현: 재귀와 DP

DFS를 구현하는 방법은 크게 스택을 직접 사용하는 방법과 재귀 함수를 이용하는 방법이 있다. 여기서는 가장 직관적인 **재귀(Recursion)** 방식과, DFS의 탐색 과정에서 중복 연산을 제거하는 **DP(메모이제이션)** 방식을 비교하여 설명한다.

### 4-1. 기본적인 DFS (재귀 구현)

가장 표준적인 DFS 구현이다. `visited` 배열을 통해 이미 방문한 노드를 재방문하지 않도록 제어하며, 그래프의 연결된 모든 노드를 순회한다. 코드는 C++의 `vector`를 이용한 인접 리스트 방식이다.

```cpp
#include <iostream>
#include <vector>

using namespace std;

// 방문 여부를 체크할 배열
bool visited[10];
// 그래프 연결 정보를 담을 인접 리스트
vector<int> graph[10];

void dfs(int x) {
    // 1. 현재 노드를 방문 처리
    visited[x] = true;
    cout << x << " ";

    // 2. 현재 노드와 연결된 다른 노드들을 확인
    for (int i = 0; i < graph[x].size(); i++) {
        int next = graph[x][i];
        // 3. 방문하지 않은 노드라면 재귀적으로 깊이 들어감
        if (!visited[next]) {
            dfs(next);
        }
    }
}

int main() {
    // 예시: 1번 노드와 2번 노드 연결
    graph[1].push_back(2);
    graph[2].push_back(1);
    
    // ... (그래프 초기화 생략) ...
    
    dfs(1); // 1번 노드부터 탐색 시작
    return 0;
}

```

이 방식은 코드가 간결하고 직관적이다. 하지만 그래프의 깊이가 매우 깊어질 경우 `Stack Overflow`가 발생할 수 있다는 점을 유의해야 한다.

### 4-2. DFS와 DP의 결합 (메모이제이션)

단순한 탐색을 넘어, "피보나치 수열"이나 "경로의 수 구하기" 같은 문제에서는 동일한 상태(노드)를 여러 번 방문해야 할 때가 있다. 이때 일반적인 재귀 DFS를 사용하면 지수 시간( 등)이 걸려 시간 초과가 발생한다.

이때 DFS에 **메모이제이션(Memoization)** 기법을 적용하면, 이것이 곧 **탑다운(Top-down) DP**가 된다. 한 번 계산한(방문한) 노드의 결과를 저장해두고, 다시 방문할 때 저장된 값을 반환함으로써 중복 계산을 막는다.

```cpp
#include <iostream>
#include <vector>

using namespace std;

// 계산된 값을 저장할 메모이제이션 배열 (초기값 0)
long long dp[100]; 

// 피보나치 수열을 DFS(재귀)로 구하는 과정
// 사실상 탐색 트리를 DFS로 순회하는 것과 동일하다.
long long fibonacci_dfs(int x) {
    // 1. 기저 조건(Base Case): 탐색의 끝
    if (x == 1 || x == 2) return 1;

    // 2. 이미 계산한 적이 있는 노드라면 저장된 값 반환 (Pruning)
    if (dp[x] != 0) return dp[x];

    // 3. 점화식에 따라 자식 노드들을 방문하고 결과를 저장
    // visited 배열 대신 dp 배열에 값이 차있는지가 방문 여부가 됨
    return dp[x] = fibonacci_dfs(x - 1) + fibonacci_dfs(x - 2);
}

int main() {
    int n = 50;
    cout << n << "번째 피보나치 수: " << fibonacci_dfs(n) << endl;
    return 0;
}

```

위의 예시에서 `fibonacci_dfs` 함수는 논리적으로 트리 형태의 그래프를 탐색한다. `dp` 배열이 없다면 동일한 서브 트리들을 반복해서 탐색하게 되지만, `dp` 배열을 통해 한 번 방문한 노드(계산한 값)는 다시 탐색하지 않고 즉시 값을 반환한다.

이처럼 **DFS는 모든 경우의 수를 탐색하는 브루트 포스(Brute Force)의 기본이자, 여기에 '기억(Memoization)'을 더해 효율성을 극대화하는 DP의 근간**이 된다.

## 5. 결론

DFS는 컴퓨터 과학에서 데이터를 순회하는 가장 기초적이면서도 강력한 도구이다. 단순히 그래프의 모든 점을 잇는 것을 넘어, 문제 해결 과정에서 **상태 공간을 어떻게 정의하고 탐색할 것인가**에 대한 해답을 준다.

* **단순 구현 (재귀)**: 그래프의 연결성 확인, 순열/조합 생성 등 모든 가능성을 확인해야 할 때 사용한다.
* **DP 응용 (메모이제이션)**: 중복되는 하위 문제(Overlapping Subproblems)가 발생하는 경우, 탐색 결과를 저장하여 효율을 높인다.

학부 시절에는 이 두 가지를 별개의 알고리즘으로 생각했었다. 하지만 결국 DP도 "스마트한 DFS"의 일종이라는 점을 이해하면, 복잡한 문제도 더 체계적으로 접근할 수 있다. 코딩 테스트뿐만 아니라, 실제 시스템에서 의존성 해결(Dependency Resolution)이나 가비지 컬렉션(GC)의 Reachability 분석 등 다양한 분야에 DFS가 녹아있음을 기억하자.

## 6. Reference

* Introduction to Algorithms (CLRS)
* GeeksforGeeks - Depth First Search or DFS for a Graph
* CP-Algorithms - Depth First Search