+++
title = 'Merge Sort'
date = 2024-10-04
featured_image = "https://upload.wikimedia.org/wikipedia/commons/e/ef/Sorting_shaker_sort_anim.gif"
tags = ['algorithm']
+++

{{<series title="📚 /algorithm" series="algorithm">}}

<br>

## 1. Merge Sort

<img src="https://i.imgur.com/jRBle47.png" max-width=100%>

`병합 정렬`은 분할 정복(Divide and Conquer) 알고리즘의 한 종류로, 데이터를 작은 부분으로 분할하고, 정렬된 부분을 병합하여 전체 데이터를 정렬하는 방식으로 동작한다. 이 알고리즘은 리스트를 반으로 나누어 재귀적으로 각 부분 리스트를 정렬한 후, 정렬된 부분 리스트들을 합쳐서 전체 리스트를 정렬한다.

- 병합 정렬은 다음과 같은 단계로 이루어진다.
	- **분할(Divide):** 리스트를 중간 지점에서 두 부분으로 분할
	- **정복(Conquer):** 각 부분 리스트를 재귀적으로 병합 정렬을 이용하여 정렬
	- **병합(Combine):** 두 개의 정렬된 부분 리스트를 하나의 정렬된 리스트로 병합

<br>
<br>
<br>

## 2. 구현 분석


### 2-1. 구현

<details>
<summary>MergeSort Code</summary>
<div markdown="1">

``` C++
void mergeSort(int *arr, int left, int right) {
	if (left < right) {
		int mid = left + (right - left) / 2;

		mergeSort(arr, left, mid);
		mergeSort(arr, mid + 1, right);

		merge(arr, left, mid, right);
	}
}

void merge(int *arr, int left, int mid, int right) {
	int i, j, k;
	int left_len = mid - left + 1;
	int right_len = right - mid;

	int L[left_len], R[right_len];
	for (i = 0; i < left_len; i++)
		L[i] = arr[left + i];
	for (j = 0; j < right_len; j++)
		R[j] = arr[m + 1 + j];

	i = 0;
	j = 0;
	k = left;
	while (i < left_len && j < right_len) {
		if (L[i] <= R[j]) {
			arr[k] = L[i];
			i++;
		} else {
			arr[k] = R[j];
			j++;
		}
		k++;
	}

	while (i < left_len) {
		arr[k] = L[i];
		i++;
		k++;
	}
	while (j < right_len) {
		arr[k] = R[j];
		j++;
		k++;
	}
}
```
</div>
</details>

### 2-2. mergeSort

``` C++
void mergeSort(int *arr, int left, int right) {
	/* 재귀 종료 조건 */
	if (left < right) {
		/* mid index 계산 */
		int mid = left + (right - left) / 2;

		/* 분할 재귀 호출 */
		mergeSort(arr, left, mid);
		mergeSort(arr, mid + 1, right);

		/* 정렬, 병합 */
		merge(arr, left, mid, right);
	}
}
```

주 함수 `void mergeSort(int *arr, int left, int right)`는 정렬 대상 배열, 좌측 끝 인덱스, 우측 끝 인덱스를 받는다. 이때 좌측, 우측 끝 인덱스를 받는 이유는 한 재귀 호출 안에서 다루는 배열의 범위가 어디서 부터 어디인지 알기 위함이다.

- **`if (left < right)`**
	- 이때 이 **재귀의 종료 조건**은 곧 배열을 계속 쪼개 나가다가 `left` 인덱스와 `right` 인덱스가 같아질 때, 즉 더 이상 **divide** 할 수 없을 때를 의미한다.
- **`int mid = left + (right - left) / 2;`**
	- 다음 재귀 호출로 배열의 범위를 넘겨줄 때에는, 현재 범위에서 반을 잘라 넘겨 주어야 한다. 그러므로 그 중간 지점을 계산하는 연산이 필요하며, `int mid` 에 담아 다음 호출에 전달한다.
- **`mergeSort(arr, left, mid);`** , **`mergeSort(arr, mid + 1, right);`**
	- 첫번째 재귀 호출에는 `left ~ mid`를 넘겨 왼쪽의 배열을 처리하게하고, 두번째 재귀 호출에는 `mid + 1 ~ right`을 넘겨 오른쪽 배열을 처리하게 한다. 
- **`merge(arr, left, mid, right);`**
	정렬된 두 리스트를 병합한다.

<br>
<br>
<br>

### 2-3. merge

``` C++
void merge(int *arr, int left, int mid, int right) {
	/* 좌측, 우측 배열 길이 계산 */
	int left_len = mid - left + 1;
	int right_len = right - mid;
	
	/* 복사 */
	int i, j, k;
	int L[left_len], R[right_len];
	for (i = 0; i < left_len; i++)
		L[i] = arr[left + i];
	for (j = 0; j < right_len; j++)
		R[j] = arr[m + 1 + j];

	i = 0;
	j = 0;
	k = left;
	
	/* 비교 */
	while (i < left_len && j < right_len) {
		if (L[i] <= R[j]) {
			arr[k] = L[i];
			i++;
		} else {
			arr[k] = R[j];
			j++;
		}
		k++;
	}

	/* 잔여 처리 */
	while (i < left_len) {
		arr[k] = L[i];
		i++;
		k++;
	}
	while (j < right_len) {
		arr[k] = R[j];
		j++;
		k++;
	}
}
```

`merge` 함수의 구조는 생각보다 간단하다. 우선 이번 재귀 호출로 `merge` 함수가 받아온 좌측 배열 범위와 우측 배열 범위를 임시 배열에 각각 복사한다. 그 다음, 좌측 임시 배열과 우측 임시 배열에서 값을 하나씩 꺼내어 더 비교하며 원래 배열을 정렬한다. 비교가 모두 끝난 이후 좌측 또는 우측에 남아있는 값들이 있다면 그냥 뒤에 이어 붙여준다. 즉, 이 함수는 정렬된 두 부분 리스트를 병합하여 하나의 정렬된 리스트로 만드는 역할을 한다.  

- **임시 배열 생성 및 데이터 복사**
	- 좌측 부분 리스트 `L`과 우측 부분 리스트 `R`을 생성하고, 각각의 데이터를 복사한다.
- **병합 과정**
	- 두 임시 배열 `L`과 `R`의 요소들을 비교하여 작은 값부터 `arr`에 저장한다.
- **남은 요소들 복사**
	- 한쪽 배열의 모든 요소를 다 사용한 후, 다른 배열에 남은 요소들을 `arr`에 복사한다.

<br>
<br>
<br>

## 3. 정확성 분석


`병합 정렬`은 리스트를 재귀적으로 분할하고, 병합하는 과정에서 정렬을 수행한다. 이제 수학적 귀납법을 통해 이 알고리즘의 정확성을 증명해보자.

<br>

### 3-1. 명제 설정

**명제 P(n):** _길이 n인 배열을 `mergeSort` 함수로 정렬하면, 배열은 항상 오름차순으로 정렬된다._

<br>

### 3-2. 귀납적 증명의 구성 요소

1. **기저 사례(Base Case):** n = 1일 때, 명제가 참임을 보인다.
2. **귀납 가정(Inductive Hypothesis):** 길이가 k 이하인 배열에 대해 명제가 참이라고 가정한다.
3. **귀납 단계(Inductive Step):** 길이가 k + 1인 배열에 대해서도 명제가 참임을 보인다.
4. **종료성(Termination):** 알고리즘이 유한한 단계 내에 종료함을 보인다.

<br>

### 3-3. 귀납적 증명
#### 기저 사례

- **n = 1인 경우** 배열의 길이가 1이면, 이미 정렬된 상태이므로 명제 P(1)은 참이다.

<br>

#### 귀납 가정
- **길이가 k 이하인 배열은 `mergeSort`로 정렬되었을 때 항상 오름차순이다**라고 가정한다.

<br>

#### 귀납 단계
- **길이가 k + 1인 배열에 대하여**
  1. 배열을 중간 지점에서 두 부분으로 분할하면, 각 부분의 길이는 최대 k이다.
  2. 귀납 가정에 의해, 각 부분 배열은 `mergeSort`를 통해 정렬된다.
  3. `merge` 함수는 두 개의 정렬된 배열을 병합하여 하나의 정렬된 배열을 만든다.
  4. 따라서, 길이가 k + 1인 배열도 정렬된다.

<br>

#### 종료성
- **알고리즘의 종료성**
	- 각 재귀 호출마다 배열의 크기가 절반으로 감소하므로, 재귀 깊이는 최대 `log n` !
	- 배열의 크기가 1이 되면 재귀 호출이 종료되므로, 알고리즘은 유한한 단계 내에 종료한다.

<br>

#### 결론
- 기저 사례와 귀납 단계를 통해 모든 자연수 n에 대해 명제 P(n)이 참임을 증명하였다.
- 따라서 `mergeSort` 알고리즘은 항상 배열을 올바르게 정렬한다.

<br>
<br>
<br>

## 4. 효율성 분석


### 4-1. 시간 복잡도

`병합 정렬`의 시간 복잡도는 분할 단계와 병합 단계로 나누어 분석할 수 있다.

- **분할 단계**
  - 배열을 반으로 분할하는 작업은 `O(1)`의 시간 복잡도를 가지며, 분할 횟수는 `log n`이다.
- **병합 단계**
  - 각 단계에서 배열의 모든 요소를 한 번씩 비교하거나 복사한다.
  - 각 단계의 시간 복잡도는 `O(n)`이다.

따라서 전체 시간 복잡도는 다음과 같다.

$$
T(n) = 2T\left(\frac{n}{2}\right) + O(n)
$$

이를 마스터 정리를 통해 해석하면,

$$
T(n) = O(n \log n)
$$

<br>

### 4-2. 공간 복잡도

`병합 정렬`은 추가적인 임시 배열을 사용하여 데이터를 저장하므로, 공간 복잡도는 `O(n)`이다. 이는 입력 배열의 크기에 비례하는 추가 메모리가 필요함을 의미한다.

<br>

### 4-3. Best, Average, Worst Case

`병합 정렬`은 입력 배열의 초기 상태와 관계없이 항상 동일한 분할과 병합 과정을 수행하므로, Best Case, Average Case, Worst Case 모두 시간 복잡도가 `O(nlog n)`이다.

<br>
<br>
<br>

## 5. 결론


`병합 정렬`은 분할 정복 알고리즘을 활용하여 안정적이고 효율적인 정렬을 수행한다. 시간 복잡도가 `O(nlog n)`으로 효율적이며, 입력 데이터의 분포에 영향을 받지 않는다. 그러나 추가적인 메모리 공간을 필요로 하기 때문에 메모리 사용이 중요한 환경에서는 고려가 필요하다. 대량의 데이터를 안정적으로 정렬해야 하는 경우에 적합한 알고리즘이다.

<br>
<br>
<br>

{{<series title="📚 /algorithm" series="algorithm">}}

<br>
<br>
<br>
