+++
title = '[42cursus] ft_printf'
date = 2023-11-15
featured_image = "http://t1.daumcdn.net/cfile/146B7E10B091A05214"
tags = ['c', '42cursus']
draft = true
+++


## 그래프
그래프를 형식을 저장하는 방식 2가지 하나는 메트릭스 / 하나는 연결리스트
- (n = number of vertices / m = number of edges)

1. 메트릭스
	- 검색 시간 복잡도 O(1)
	- V 이웃 몇명인지 O(n)
	- 공간 복잡도 O(n^2)

2. 연결리스트
	- 검색 시간 복잡도 O(degree(v) or degree(w))
	- V 이웃 몇명인지 O(degree(v))
	- 공간 복잡도 O(n + m)

## DFS
노드를 3가지로 구분한다. 
1. 아직 안 간 노드
2. 방문 했지만, 아직 순회 프로세스 중에 있는 노드
3. 완벽히 탐색을 마친 노드

일단 돌면서 2번으로 칠하면서 랜덤하게 이동한다. 계속해서 2번으로 칠하면서 가다가 더 이상 움직일 수 없는 노드에 봉착했을때. (1번 노드로만 갈 수 있음)
그러면 이제 그 노드는 3번으로 칠하고, 직전 노드로 이동해서 반복한다.

``` python
void dfs(w, currentTime) 
	w.startTime = currentTime
	cureentTime++
	make w as (in progress)
	for v in w.neighbors:
		if v is unvisted:
			currentTime
				= dfs(vm currentTime)
			currenntTime++
	w.finishTime = current Time
	mark w as (all done)
	return currentTime
```
dfs의 runngintime은 O(n + m), 이때 (n = number of vertices / m = number of edges).

그 dfs을 사용하여 위상정렬(topological ordering을 구현할 수 있음.)
리눅스 패키지 설치 시 의존성 문제를 tolological sortingㅡ올 해결할 수 있고, 단, dag 일때만 다능

정리하면, 위상정렬은 정렬 유형에 가깝고 이를 구현하는 구체적 방법 중 하나가 dfs임.
이때 위상 정렬은 dag 그래프

정리
위상정렬 : 정렬 알고리즘. 간선 u->v 라면 u는 항상 v보다 먼저 정렬되어야한다.
dfs : 위상정렬을 구현하는 방법 중 하나
dag 그래프 : 사이클이 없고 방향성이 존재하는 그래프
<중요> 위상정렬은 dag 그래프에서만 가능.

아까 dfs에서 출입 시간을 체크한다면, 우리는 좀더 일반화해서 dfs를 통한 위상정렬의 특성을 하나 뽑을 수 잇음.
타임스탬프 부모start 자식start 자식end 부모end 이런식으로 부모stamp가 자식을 감싼다.

예를 들어. A -> B 일때, 항상 B의 finish time < A의 finish time 임.
위 조건은 항상 성립하며, 만약 B를 A보다  먼저 탐색해야한다 라는 조건을 만족하면 B가 A의 자손이 아니여도 성립한다.

뭐 결국에는 finish time이 작은 것부터 역순 나열하면됨.

``` c++
class Graph {
	int V; // v 갯수
	list<int>* adj; // 그래프 형상
	void dfs(int v, bool visited[]. stack<int>& stack);

public:
	Graph(int V);
	void addEdge(int v, int w);
	void topologicalSort();
}

void dfs(int v, bool visited[]. stack<int>& stack) {
	visited[v] = true;
	list<int>::iterator i;
	for (i = adj[v].begin(); i != adj[v].end(); ++i) 
		if (!visied[*i])
			dfs(*i, visited, stack);
	stack.push(v);
}

void Graph::topologicalSort() {
	stack<int> stack;
	
	bool* visited = new bool[v];
	for (int i = 0; i < v; i++) 
		visited[i] = false;

	for (int i = 0; i < v; i++)
		if (visited[i] == false)
			dfs(i, visited, stack);

	while (stack.empty()) {
		cout << stack.top() << " ";
		stack.popr
	}
}
```

아래는 수도코드 
``` python
class Graph:
	def __init__(self, V):
		self.V = V  # 정점 개수
		self.adj = [[] for _ in range(V)]  # 인접 리스트로 그래프 표현

	def add_edge(self, v, w):
		self.adj[v].append(w)  # 정점 v에서 w로의 간선을 추가

	def dfs(self, v, visited, stack):
		visited[v] = True  # 현재 정점 방문 처리
		for neighbor in self.adj[v]:  # 인접 정점 탐색
			if not visited[neighbor]:
				self.dfs(neighbor, visited, stack)
		stack.append(v)  # 탐색 완료 후 스택에 추가

	def topological_sort(self):
		stack = []  # 위상 정렬 결과를 저장할 스택
		visited = [False] * self.V  # 정점 방문 여부

		# 모든 정점에 대해 DFS 호출
		for i in range(self.V):
			if not visited[i]:
				self.dfs(i, visited, stack)

		# 스택을 역순으로 출력 (위상 정렬 결과)
		while stack:
			print(stack.pop(), end=" ")

```


이제는 bfs에 대하여 알아보자

## bfs
bfs의 기본 다이디어는 breth-first serach임
그러니까 출발노드에서 몇번 단계를 거쳐서 도달할 수 있는 노드들이냐. 그 몇번을 step로 생각하면
일단 같은 level을 다 흝고 그 다음 step으로 가는거임.

보통 큐를 사용하고, 재귀는 사용하지 않음.
코테에 자주 나옴

``` c++
class Graph {
	int v;
	list<int> *adj;
public:
	Graph(int v);
	void addEdge(int v, int w);
	void bfs(int s);
}

void Graph::bfs(int s) {
	bool *visited = new bool[v];  // 방문 여부를 저장하는 배열
	for (int i = 0; i < v; i++)
		visited[i] = false;       // 초기화: 모든 정점은 방문하지 않음

	list<int> queue;              // BFS 탐색에 사용할 큐
	visited[s] = true;            // 시작 정점 방문 처리
	queue.push_back(s);           // 큐에 시작 정점 추가

	list<int>::iterator i;        // 인접 정점을 탐색하기 위한 반복자
	while (!queue.empty()) {      // 큐가 비어있을 때까지 반복
		s = queue.front();        // 큐에서 정점 하나를 가져옴
		cout << s << " ";         // 현재 정점 출력
		queue.pop_front();        // 큐에서 제거

		for (i = adj[s].begin(); i != adj[s].end(); ++i) { // 인접 정점 탐색
			if (!visited[*i]) {    // 방문하지 않은 정점이면
				visited[*i] = true;  // 방문 처리
				queue.push_back(*i); // 큐에 추가
			}
		}
	}
}

```
일단 보면 시작 노드를 큐에 넣고, while을 돌린다. 이때, 반복문을 
while 문 자체는 큐가 비어있을때까지 반복한다.
	일단 큐에서 정점 하나를 가져온다.(초깃값은 start node 이겠지?)
	그리고 그 노드를 출력하고, 큐에서 제거한다.
	for문은 이터레이터를 타고 s의 인접한 노드를 순회한다.
		현재 탐색 중인 노드가 아직 방문하지 않았다면,
			방문처리하고
			큐에 넣는다.

runningtime은 O(n + m) 이다.
이때 (n = number of vertices / m = number of edges).

이 시점에서 dfs와 bfs를 비교해볼까?
1. dfs
- 위상 정렬에 유용
- 또는 그래프의 정확한 탐색에 유용
2. bfs
- unweight graph의 최단경로 탐색에 유용

그렇다면 각 edge에 weight 이 있는 graph에서의 최단경로 탐색은 어떻게 하지?
weighted grapth의 경우 다익스트림 알고리즘을 사용한다.


## 다익스트라 알고리즘
그리디 패러다임 아래에
다익스트라가 있다. : 중치가 있는 그래프에서 단일 출발점에서 다른 모든 정점까지의 최단 경로를 찾는 알고리즘

1. 초기화
출발 노드 거리는 0 / 나머지는 무한대로/ 그리고 방문여부와 출발점에서부터의 거리를 항상 업데이트한다. 매 이터레이션 마다

2. 아직 방문하지 않은 노드 중 출발점에서 거리가 가장 짦은 노드를 선택 : 처음에는 출발노드로 가겠지

3. 선택된 노드와 인접한 모든 노드에 대하여 기존 거리보다 선택된 노드를 거쳐가는 거리가 더 짧으면 갱신

코드를 한번 보자.

``` c++
#include <iostream>
#include <vector>
#include <list>
#include <set>
#include <utility>
#include <climits> // for INT_MAX

using namespace std;

class Graph {
	int v; // 정점의 개수
	list<pair<int, int>> *adj; // 인접 리스트 (각 정점의 간선과 가중치를 저장)

public:
	Graph(int v);				// 생성자
	void shortestPath(int src); // 다익스트라 알고리즘
};

void shortestPath(int src) {
	vector<int> dist(v, INT_MAX); // 거리 배열: 시작 정점에서 각 정점까지의 최단 거리를 저장 (초기값은 무한대)
	set<pair<int, int>> setds; // STL의 set: (거리, 정점) 형태로 저장하며, 거리의 오름차순으로 정렬됨
	
	dist[src] = 0; // 시작 정점의 거리는 0
	setds.insert(make_pair(0, src)); // (거리 0, 정점 src)를 삽입

	while (!setds.empty()) {
		pair<int, int> tmp = *(setds.begin()); // 현재 최소 거리를 가진 정점을 가져옴 (set의 첫 번째 원소)
		setds.erase(setds.begin()); // 집합에서 제거
		int u = tmp.second; // 현재 정점 번호

		// 현재 정점의 모든 인접 정점을 탐색
		for (list<pair<int, int>>::iterator i = adj[u].begin(); i != adj[u].end(); i++) {
			int v = (*i).first;      // 인접 정점
			int weight = (*i).second; // 간선의 가중치

			if (dist[v] > dist[u] + weight) { 	// 최단 거리 업데이트 조건 확인
				if (dist[v] != INT_MAX)			// 기존의 거리가 무한대가 아니면, 즉 이미 탐색된 상태라면 집합에서 제거
					setds.erase(setds.find(make_pair(dist[v], v)));
				dist[v] = dist[u] + weight;		// 새로운 거리 계산 및 업데이트
				setds.insert(make_pair(dist[v], v)); // 집합에 (새 거리, 정점) 추가
			}
		}
	}

	// 최단 거리 출력
	cout << "Vertex Distance from Source" << endl;
	for (int i = 0; i < v; i++)
		cout << i << "\t\t" << dist[i] << endl;
}
```

그럼 이제 다익스트라 알고리즘을 증명해보자. 우리는 총 2가지를 증명해야함
1. 모든 반복 상황에서 항상 d[v] >= d(s,v). 즉 d[v]를 업데이트해가며 실제 최단 거리 d(s, v)에 가까워 지는 것임
2. 알고리즘이 종료되었을때 d[v] = d(s ,v) 즉 우리가 찾은 최단거리 d[v]가 실제 최단거리 d(s, v) 이다.

1번 먼저 증명해보자
### **귀납적 가정 (Inductive Hypothesis)**:
t번째 반복 후, d[v] >= d(s, v)가 성립한다고 가정.

### **기초 단계 (Base Case)**:
t = 0 일때, 시작점 s에서 s까지 d(s, s) 는 0이고, d(s, v) <= 무한대

### **귀납 단계 (Inductive Step)**:
각 스텝 t+1에서 (t일때 성립하면 t + 1일때도 성립함)
선택된 정점 u가 있고, u의 인접 노드를 v라고 하자.
이떄 d[v] <- min(d[v], d[u] + w(u, v))
이때 min에서 비교하는 두가지는
d[v] : 기존에 v 노드 도달 최단거리 (배열에 담겨잇는)
d[u] : u까지 가는데 걸린 거리(가중치)
w(u, v) : u에서 v까지 가는 거리(가중치)

이어서 2번 증명해보자.
### 시작 vertex s
시작 vertex s 는 탐색완료 상태일것이고, d[s] = d(s, s) = 0 임.
### 다른 모든 vertex v에 대하여
내가 선택한 노드 u를 확정(sure) 상태로 추가하려고 할 때의 프로세스가 설명된다.
u를 고르는 기준은, 아직 d[u] 값이 확정되지 않은 not-sure 정점들 중 가장 작은 값을 가지는 정점
u의 이웃 정점들의 거리 값을 업데이트한다. 그리고 그리고 u를 sure으로 만들고 다시 반복
그러핟면 우리는 이렇게 증명할 수 있다.

2번 증명:

문제정의 : 어떤 정점 v가 "good"이라고 불리는 조건은 d[v] = d(s, v),
즉 시작점 s로부터 v까지의 실제 최단 경로가 d[v]로 기록된 거리와 동일함을 의미합니다.

z는 u 이전의 마지막 "good" 정점입니다. z'는 z 다음 정점이며, u가 될 수도 있습니다.
u가 "good"이 아님을 가정하고 증명을 시작합니다.

자, 지금 내가 선택한 노드가 good이 아니라면.

d[z] = d(s, z)이고, 이는 z가 "good"이라는 조건에 의해 성립합니다.
시작점에서 z를 거쳐 u까지의 최단 경로는 d(s, z) + \text{edgeWeight}(z, u)일 것입니다.
이때 다익스트라 알고리즘의 Claim 1에 의해 d(s, z) \leq d[u]입니다.

두 가지 경우로 나뉩니다:
  1. d[z] = d[u]: 이 경우 u는 "good"임이 자명합니다.
  2. d[z] < d[u]: 이 경우 z는 이미 "확정(sure)" 상태입니다.

- z가 "sure"라면 z'의 거리 값은 이미 업데이트된 상태여야 합니다:
  \[
  d[z'] \gets \min(d[z'], d[z] + \text{edgeWeight}(z, z'))
  \]

- 업데이트된 후 d[z']의 조건은 다음과 같습니다:
  \[
  d[z'] \leq d[z] + \text{edgeWeight}(z, z') = d(s, z') \leq d[z']
  \]

- 위 식에서 모든 부등식이 동일하게 성립하므로 d[s, z'] = d[z']입니다. 따라서 z'는 "good"임이 증명됩니다.
- 그러나 z' 다음 정점 u가 "good"이 아님을 가정했으므로 모순이 발생합니다.

---

**결론**
가정이 잘못되었음을 보였으므로, u가 "good"이어야 함이 증명되었습니다. 이는 다익스트라 알고리즘에서 정점이 확정(sure) 상태로 선택될 때 그 정점까지의 거리가 올바르다는 사실을 논리적으로 뒷받침합니다.

### 사실 . 더중요한건 is it fast? 질문이다. 러닝타임이 어떻게 되는가?
일단 아래는 다익스트라의 수도코드이다.
``` python
set all vertices to not-sured
d[v] = INF for all v in V
d[s] = 0
while there are not-sure nodes:
		pick the not-sure node u with smallest estimate d[u]
		for v in u.neighbors
			d[v] <- min(d[v], d[u] + edgeweight(u, v))
		mkae u as sure
	now disf(s, v) = d[v]
```

그렇다면 루프를 살펴보자.
 = n (T(findMin) + T(removeMin)) + m * T(updateKey)

n : 전체 V의 모음 중 u를 하나 선택해야함. 이것은 곧 V의 숫자만큼 반복하게 될것.
T(findMin) : not-sure 노드 중 d[u]가 가장 낮은 것을 선택
T(removeMin) : 위에서 선택한 u를 탐색대상자료구조에서 제거하기
T(updateKey) : 선택된 u의 이웃정점들의 d[v] 값 갱신

이걸 만약에 array 자료구조를 쓰면 
T(findMin) : O(n)
T(removeMin) : O(n)
T(updateKey) : O(1) 결국
O(n(T(findMin) + T(removeMin)) + mT(updateKey)) = O(n^2) + O(m) = O(n^2)

이걸 만약에 redblackree를 쓰면
T(findMin) : O(log(n))
T(removeMin) : O(log(n))
T(updateKey) : O(log(n)) 결국
O((n+m)log(n))

이걸 만약에 피보나치힙을 쓰면
T(findMin) : O(1)
T(removeMin) : O(log(n))
T(updateKey) : O(1) 결국
평균적으로 O(nlogn + m)

여기까지 다익스트라. 그런데 다익스트라를 적용할 수 없는 경우들이 있음 (한계점)
1. 엣지 가중치가 음수인 경우
2. 그래프가 가중치가 중간에 변경되면 처음부터 다시 돌려야함




dp : 동적프로그래밍
dp를 활용한 방법 method fhsms
1. 벨만포드

2. 피보나치

3. 플로이드 워셜