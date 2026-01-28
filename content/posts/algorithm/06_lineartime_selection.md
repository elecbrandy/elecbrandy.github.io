+++
title = 'Linear-time selection'
date = 2024-10-20
featured_image = "https://upload.wikimedia.org/wikipedia/commons/e/ef/Sorting_shaker_sort_anim.gif"
tags = ['algorithm']
+++

{{<series title="📚 /algorithm" series="algorithm">}}

<br>

## 1. 개요

정렬되지 않은 데이터에서 k번째로 작은 수를 가장 효율적으로 찾는 방법은 무엇일까? 알고리즘 문제를 풀다 보면 `데이터 집합에서 중앙값을 찾아라` 혹은 `k번째로 작은 수를 구하라`는 요구사항을 마주한다. 가장 직관적인 방법은 배열을 정렬한 뒤 인덱스로 접근하는 것이다. 하지만 일반적인 정렬 알고리즘은 $O(n \log n)$ 의 시간 복잡도를 가진다.

고작 숫자 하나를 찾기 위해 배열 전체를 정렬하는 것은 낭비가 아닐까? 만약 정렬 없이 $O(n)$ 의 시간 복잡도로 원하는 순서의 요소를 찾을 수 있다면 훨씬 효율적일 것이다. 이를 가능하게 하는 것이 바로 **선형 시간 선택 알고리즘(Linear-Time Selection Algorithm)** 이다.

<br>
<br>
<br>

## 2. 아이디어: 퀵 정렬의 변형

이 알고리즘의 핵심 아이디어는 Quick Sort 의 분할 과정에 있다. 퀵 정렬은 피벗을 기준으로 작은 값은 왼쪽, 큰 값은 오른쪽으로 보내며 양쪽 모두를 재귀적으로 정렬한다. 하지만 우리의 목표는 정렬이 아니라 **'k번째 수 찾기'이다.**

따라서 피벗을 기준으로 나눈 뒤, k번째 수가 존재할 가능성이 있는 **한쪽 영역만 선택해서 탐색** 하면 된다.

<br>

### 2-1. 동작 프로세스

1. 배열에서 임의의 **피벗(Pivot)** 을 선택한다.
2. 피벗을 기준으로 배열을 분할한다. (왼쪽: 피벗보다 작은 수, 오른쪽: 피벗보다 큰 수)
3. 분할이 끝나면 피벗은 자신의 정렬된 위치(인덱스)를 찾게 된다.
4. 피벗의 위치와 찾고자 하는 `k` 를 비교한다.
    - `pivot_index == k` : 피벗이 바로 우리가 찾는 값이다. (종료)
    - `pivot_index > k` : 우리가 찾는 값은 왼쪽에 있다. (왼쪽만 재귀 탐색)
    - `pivot_index < k` : 우리가 찾는 값은 오른쪽에 있다. (오른쪽만 재귀 탐색)

<br>

### 2-2. 퀵 정렬과의 비교

이해를 돕기 위해 퀵 정렬과 선형 시간 선택 알고리즘을 비교해보자.

| 구분 | 퀵 정렬 (Quick Sort) | 선형 시간 선택 (Quick Select) |
| --- | --- | --- |
| **목표** | 전체 배열을 순서대로 나열 | 특정 순서(k번째)의 값 하나만 찾음 |
| **탐색 범위** | 피벗 기준 **양쪽** 모두 재귀 호출 | 피벗 기준 **한쪽**만 선택하여 재귀 호출 |
| **시간 복잡도** | 평균 $O(n \log n)$ | 평균 $O(n)$ |

<br>
<br>
<br>

## 3. 구현

아이디어를 코드로 구현하면 다음과 같다. C++의 `std::swap` 등을 활용할 수 있지만, 알고리즘의 이해를 위해 직접 구현한 형태이다.

<br>

### 3-1. Partition 함수

먼저 피벗을 기준으로 배열을 나누는 `partition` 함수이다.

```cpp
int partition(int *arr, int left, int right, int pivot) {
    while (left <= right) {
        while (arr[left] < pivot) left++;
        while (arr[right] > pivot) right--;
        
        if (left <= right) {
            std::swap(arr[left], arr[right]);
            left++;
            right--;
        }
    }
    return left - 1; // 피벗의 최종 위치 반환
}

```

<br>

### 3-2. Select 함수

실질적인 탐색을 수행하는 `select` 함수이다. 분할 후 k값이 속한 범위로 좁혀 들어가는 로직을 볼 수 있다.

```cpp
int select(int *arr, int left, int right, int k) {
    // k가 유효 범위를 벗어난 경우 예외 처리
    if (k < 0 || k >= right - left + 1) return INT_MAX;

    int n = right - left + 1;
    // 최악의 경우를 방지하기 위해 피벗을 무작위로 선택
    int pivot = arr[left + rand() % n];

    // 분할 수행
    int pivot_idx = partition(arr, left, right, pivot);

    // 피벗 위치와 k 비교
    if (pivot_idx - left == k) {
        return arr[pivot_idx];
    } else if (pivot_idx - left > k) {
        return select(arr, left, pivot_idx - 1, k);
    } else {
        // 오른쪽 그룹에서 찾을 때는 k값을 조정해야 함 (상대적 위치)
        return select(arr, pivot_idx + 1, right, k - (pivot_idx - left + 1));
    }
}

```

<br>
<br>
<br>

## 4. 알고리즘의 효율성 분석

왜 이 알고리즘이  의 성능을 낼까? 직관적으로 계산해보자.

- **`평균 시간 복잡도: O(N)`**
  - 이상적인 경우, 피벗이 매번 배열을 절반으로 나눈다고 가정해보자. 첫 단계에서는 개의 요소를 살펴본다. 그 다음 단계에서는 절반인 , 그 다음은 ... 이런 식으로 탐색 범위가 줄어든다. 이는 전체를 정렬하는 비용보다 훨씬 효율적이다.
- **`평균 시간 복잡도: O(N^2)`**
- 하지만 퀵 정렬과 마찬가지로 최악의 경우도 존재한다. 만약 피벗이 매번 가장 작은 값이나 가장 큰 값으로 선택된다면, 배열이 절반으로 줄어드는 게 아니라 고작 1개씩만 줄어든다. 

이를 방지하기 위해 구현 코드에서는 `rand()` 를 사용하여 피벗을 무작위로 선택했다. 더 확실한 방법으로는 **Median of Medians** 알고리즘을 사용하여 피벗을 신중하게 고르는 방법이 있지만, 구현이 복잡하고 상수 오버헤드가 커서 잘 쓰이지 않는다.

<br>
<br>
<br>

## 5. 귀납법을 통한 증명

이 알고리즘이 정말로 $k$ 번째 원소를 찾아내는지 수학적 귀납법을 통해 간단히 확인해보자.

**명제 $P(n)$**: 배열 크기가 $n$일 때, `select` 함수는 $k$번째로 작은 요소를 정확히 반환한다.

- **기저 사례 (Base Case)**
  - $n=1$ 일 때, 배열에는 원소가 하나뿐이므로 $k=0$ 일 수밖에 없다. 함수는 즉시 해당 원소를 반환하므로 명제는 참이다.
- **귀납 가정 (Inductive Hypothesis)**
  - $n$보다 작은 모든 크기의 배열에 대해 명제 $P$가 참이라고 가정한다.
- **귀납 단계 (Inductive Step)**
  - 크기가 $n$인 배열을 생각해보자.
    - `partition` 함수는 피벗을 기준으로 배열을 두 개의 부분 배열로 나눈다.
    - 피벗의 위치가 $k$와 같다면 정답을 찾은 것이다.
    - 피벗 위치가 $k$와 다르다면, 왼쪽 혹은 오른쪽 부분 배열에 대해 재귀 호출을 수행한다.
    - 이때 호출되는 부분 배열의 크기는 반드시 $n$보다 작다.
    - 귀납 가정에 의해, $n$보다 작은 배열에서의 탐색은 정확한 값을 반환한다.
- **결론**
  - 따라서 모든 자연수 $n$에 대해 `select` 알고리즘은 올바른 값을 반환한다. 또한 매 재귀마다 문제의 크기(`n`)가 줄어들므로 알고리즘은 무한 루프 없이 종료된다.

<br>
<br>
<br>

## 6. 결론

선형 시간 선택 알고리즘은 정렬 문제의 부분집합과 같다. 전체를 줄 세울 필요가 없을 때, 굳이 줄을 세우지 않고도 원하는 답을 찾아낼 수 있다.
C++ STL에서도 이 알고리즘을 `std::nth_element` 라는 이름으로 제공하고 있다. 전체 정렬(`std::sort`)이 부담스러운 상황에서 상위 10%의 데이터를 추리거나 중앙값을 구할 때 매우 유용하게 사용할 수 있다.

<br>
<br>
<br>

## 7. Reference

* https://en.wikipedia.org/wiki/Quickselect
* https://www.geeksforgeeks.org/quickselect-algorithm/
* Introduction to Algorithms (CLRS)

<br>
<br>
<br>

{{<series title="📚 /algorithm" series="algorithm">}}

<br>
<br>
<br>
