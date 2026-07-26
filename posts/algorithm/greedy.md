+++
title = '[42cursus] ft_printf'
date = 2023-11-15
featured_image = "http://t1.daumcdn.net/cfile/146B7E10B091A05214"
tags = ['c', '42cursus']
draft = true
+++

그리디 알고리즘은 dp의 일종이나 모든 문제에 적용할수는 없음. 조건을 알아보자.
안되는 경우 : knapsack again 
되는 경우 : activity selection / huffman coding / minimum spanning tree

그리디 알고리즘의 작동은 그 선택 순간에 가장 효율적인 선택하기.
한번 선택하면 절대 뒤돌아보자 않음. 그냥 최고의 선택이길 비는거임.
장점 : 디자인하기 쉬움 / 단점 : optimality or correctness를 증명하기 힘듦'

### 그럼이제 활동선택? Activity Selection. 가장 많은 활동(갯수_을 하는 것이 목표임
총 3개의 input을 받는다.
- input : 활동들, 시작시점, 종료시점
- output : how many activities can you do today?

그럼 어떻게 tasks 들을 선택하느냐? -> 선택 지점에서 finish time이 빠를수록
만약에 내가 특정 task를 골랐다면, 나랑 겹치는 시간대에 있는 tasks는 더이상 선택 불가

러닝타임은 두가지
1. 모든 활동들이 종료시간 기준으로 정렬된 경우 O(n)
2. 반면에 sorting부터 해야하는 경우 O(nlogn)

그래서 봐야하는 것은
1. 정말 제대로 작동해?
2. 그리고 일반적으로 그리디 알고리즘은 좋은 선택임?
3. 왜 지금 배움 -> 동적 프로그래밍과 관련있어서

1. 정말 제대로 작동해?
"우리가 선택을 할 때, 최적의 해를 배제하지 않는다."
탐욕적 결정(Greedy Decision)을 내려도, 최적의 해(Optimal Solution)이 배제되지 않는다는 것을 강조합니다.
즉, 선택을 할 때마다 여전히 최적의 해를 포함한 경로를 따라가고 있다는 가정

"이것이 사실임을 증명할 수 있다고 가정하면"
우리는 최적의 해를 절대 배제하지 않는다.
각 단계에서 이루어진 선택이 최적의 해를 유지한다는 것을 증명하면 됩니다.
탐욕적 접근법을 사용해 선택을 반복한 끝에 어떤 해가 도출됩니다.
그 결과는 최적이다. 최적성을 배제하지 않았으므로, 얻어진 해답이 최적의 해라는 결론에 도달합니다.

### 다른예시하나더:huffman coding
아이디어 자체는 뭐냐면, 우리가 이제 자주 사용하는 알파벳이 있을거고, 적게 사용하는 알파벳이 있을텐데 이걸
아스키에서는 다 똑같이 취급하니까 사실 좀 메모리적으로 낭비가 있지 않나?

그래서 우리는 prefix-free coding으로 이를 해결해보자.
이게 뭐냐면, 특정 문자로 사용한 것은 다른 문자의 접두가 되면 안된다는것이다.
예를들어 A를 `01`으로 하기로 약속했다면, `01`으로 시작하는 다른 문자가 있으면 안되는 것이다.
이 논리구성으로 중복을 방지하고 컴퓨터가 잘 알아들을 수 있게함.

이건 어떤 자료구조를 사용하냐면...
바이너리 트리를 사용한다.
이때 cost(tree) = 시그마 P(x) * 깊이(x)
이 바이너리 트리를 구성하는 방법은 결국 순간의 최선의 선택을 하는 것이다.
즉, 자주 나오면 최대한 트리 사우이에, 안 나오면 저 밑에 박아두는것이다.
발생빈도가 낮은 애들끼리 묶어서 묶어서 올리는것.
수도 코드 ㅡ냥 한번 보기

그럼이제
1. 작동하는가? -> 예.
이걸 통해서 알 수 있는것. greedy를 적용해도 중한에 optimal한지를 체크해야하고, 그래야 greedr가 가능

### Minimum Spanning Tree
이 트리를 구성하는 알고리즘이 두가지가 있다.
1. 일단 MST란 무엇인가? : 최소 신장 트리
우선 Spanning Tree : 모든 V를 포함하는 tree
Minimum Spanning Tree : 모든 V를 포함하는 tree 중에 cost가 최소인 경우
슬로우버전 먼저 보자. 수도코드로(이건 증명 패스)

이 수도 코드(SlowPrim)는 **Prim's Algorithm**의 비효율적 구현으로, 최소 신장 트리(MST, Minimum Spanning Tree)를 찾는 과정을 단계별로 설명하고 있습니다. 각 줄을 상세히 해석하겠습니다.

---

### **수도 코드 분석**

``` python
slowPrim(G = (V, E), starting vertex s): # 입력값으로 그래프 G와 시작 정점 s를 받습니다.
    Let (s, u) be the lightest edge coming out of s. # MST를 만들기 위해 일단 처음으로 시작지점 기준 항상 가장 작은 가중치의 간선을 선택합니다.
    MST = {(s, u)} #첫 번째로 선택된 간선 (s, u)를 MST에 추가합니다.
    verticesVisited = {s, u} # s와 u를 방문한 정점으로 추가합니다.
    while |verticesVisited| < |V|: # MST가 완성될 때까지 반복합니다. 즉, 방문한 정점의 수가 전체 정점의 수에 도달할 때까지 루프를 실행합니다.
    find the lightest edge (x, v) in E so that:
        x is in verticesVisited # x는 이미 방문한 정점 중 하나여야 합니다.  
        v is not in verticesVisited # v는 아직 방문하지 않은 정점이어야 합니다.
        # - 이 조건을 만족하는 간선 (x, v) 중에서 가중치가 가장 작은 간선을 선택합니다.
        # - 이 단계가 알고리즘에서 가장 느린 부분입니다. 모든 간선을 확인해야 하므로 O(m) 시간이 소요됩니다.
        # - 이 과정을 반복 루프 O(n)과 결합하면 최종 시간 복잡도는 O(nm)가 됩니다.
    add (x, v) to MST # 선택된 간선 (x, v)를 MST에 추가합니다.
    add v to verticesVisited #새롭게 방문된 정점 v를 방문한 정점 집합에 추가합니다.
return MST
```

시간 복잡도 분석
O(nm) (정점 수 n = |V|, 간선 수 m = |E|).
그런데 이건 모든 간선을 매번 확인하니까 느림. 좀 경량화 하자. 너무 먼 거리 엣지와 v는 고려하지 않는다.
여기서 각 vertice가 가지고 있어야하는 내용은
1. 내가 spanning tree에 붙으려면 cost 얼마가 필요하지? **key**
2. 내가 spanning tree에 붙으려면 어떤 vertice에 붙어야하지? **parent**
이걸 기록해야한다.

우선 전체루프는 모든 V를 탐색할때까지 돌고, 내가 선택한 v의 인접 v의 data(key, parent)를 업뎃해준다.


결국 이것은 다익스트라와 상당히 비슷한 알고리즘이다.
그리고 시간복잡도도 다익스트라랑 같다.
O(mlogn) : 레드블랙트리 쓴경우
O(m + nlogn) : 피보나치 힙 쓴 경우

c++ 코드는 정리하면서 다시 한번 보고.

### 또 다른 알고리즘 하나가 있음.
아니 그냥 전체에서가장 weight 작은 순서대로 고르면 되는거 아님? 이라는 질문에서 시작했음
이게 크루스컬 알고리즘이다.

``` python
kruskal(G = (V, E)):
    Sort E by weight in non-decreasing order  # 간선을 가중치 기준으로 오름차순 정렬
    MST = {}  # 빈 트리를 초기화
    for v in V:  
        makeSet(v)  # 각 정점을 독립적인 집합으로 초기화
    for (u, v) in E:  
        if find(u) != find(v):  # u와 v가 동일한 집합에 속해 있지 않은 경우
            add (u, v) to MST  # 간선을 MST에 추가
            union(u, v)  # u의 트리와 v의 트리를 병합
    return MST  # 최소 신장 트리 반환
```

러닝 타임 한번 보자.
make set 에 n
find에 2m
union에 n
토탈-> 최악의 경우 O(mlogn) dlsep, 기수정렬 사용하면 O(m)

prim vs kruskal
- 차이점 정리하기



____

이제 남은거 하나. np completeness에 대하여
P는 **"Polynomial time"**의 약자로, 주어진 문제를 다항 시간 내에 해결할 수 있는 문제의 집합입니다.
NP는 검증은 다항 시간에 가능하지만, 해결이 다항 시간 내에 가능할지(즉, P에 속하는지)는 아직 불명확한 문제의 집합입니다.

그러니까 어떤 문제가 있을때