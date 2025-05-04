+++
title = '[42seoul] cub3d'
date = 2024-08-20
featured_image = "https://upload.wikimedia.org/wikipedia/en/d/de/Doom_ingame_1.png"
tags = ['C', '42seoul']
+++

{{<series title="📚 /42seoul 시리즈" series="42seoul">}}

<br>

## 1. 소개
____

> My first RayCaster with miniLibX

42서울 본과정 입과 후 열번째로 수행한 과제로, 레이케스팅을 통해 간단한 3d 게임...? 을 만드는 것이 목표이다.
이전 fdf 과제와 비슷하게 2차원 맵을 파싱 받아와서 3차원처럼 보이게 구현해보자. 해당 과제 또한 팀원과 함께하는 팀 과제이다.

<br>
<br>

## 2. cub3D 명세서
____
- **PROGRAMNAME**
	- `cub3D`
- **DESCRIPTION**
	- **Mandatory part**
        - 1인칭 시점으로 미로 내부를 사실적인 3D 그래픽으로 표현
        - 앞서 언급한 레이 캐스팅 원리를 사용해야함
	- **Bonus part**
        - 벽 충돌
		- 미니맵 시스템
        - 열고 닫히는 문
        - 동적 스프라이트
        - 마우스를 통한 뷰 이동

<br>
<br>

## 3. 개념 정리
____

사실 그래픽에 크게 관심이 없던 카뎃이라면 매번 그래픽 과제를 만났을 때 처음 c언어를 접했을 때로 돌아가는 기분을 느꼈을 것이다. 그것은 나 또한 마찬가지로, 기존에 3d 공간에 단 하나의 관심도 없었다. 도대체 레이케스팅이 무엇이길래...?  

다행히도 방랑자들을 위한 튜토리얼이 준비 되어있다. 영어 원문과 능력자 356kim님의 번역본까지 함께 링크를 남겨보겠다.

- 영어 원문: https://lodev.org/cgtutor/raycasting.html
- 번역본: https://github.com/365kim/raycasting_tutorial?tab=readme-ov-file

튜토리얼을 자세히 읽고, 일단 예제를 따라해보자. 그리고 3층 화이트 보드 벽면에 팀원과 함께 좌표평면을 직접 그려보며 이해하면 좋다. 레이케스팅 구현은 내가, 맵 파싱은 팀원분이 해주셨다. 담당한 부분은 달랐지만, 어처피 평가도 받아야하고 설명도 해야하기 때문에 우리는 과제하는 동안 3층 한켠에서 좌표를 그리며 레이케스팅을 이해하고자 노력했다...  

#### 레이케스팅?
레이캐스팅은 2차원 맵을 기반으로 플레이어가 바라보는 시야를 3차원처럼 렌더링하는 기술이다. 원리를 간단히 설명하면 다음과 같다. 플레이어의 위치와 바라보는 방향을 기준으로 일정한 시야각(Field of View, FOV)을 설정한 뒤, 그 시야각 내에서 여러 개의 광선(ray)을 펼쳐 발사한다. 각각의 광선은 플레이어의 위치에서 출발하여 장애물(벽 등)에 부딪힐 때까지 직선으로 진행한다.

각 광선이 벽에 부딪힌 지점을 통해 플레이어가 보는 시야가 결정되며, 이 정보는 매 프레임마다 모니터에 렌더링된다. 즉, 멀리 있는 벽은 화면에 작게 나타나고, 가까이 있는 벽은 화면에 크게 나타난다. 이는 화면에 세로선을 얼마나 길게 그려내야 하는지 결정하는 문제로 귀결된다.

레이캐스팅을 통한 3차원 시각 효과 구현에 필요한 정확한 수식과 친절한 튜토리얼은 위에 이미 존재한다. 따라서 이 글에서는 기본 개념을 다시 반복하지는 않으려 한다...

<br>
<br>

## 4. Mandatory
____

- _추후 추가_

<br>
<br>

## 5. Evaluation
____

_2025.05 코드 리뷰 추가 삽입_

**try1 - review 1**  
<img src="https://i.imgur.com/szahqDi.png" width="300">  

**try1 - reivew 2**  
<img src="https://i.imgur.com/hO7TD44.png" width="300">

**try1 - review 3**  
<img src="https://i.imgur.com/m5qB8Ch.png" width="300">

간단한 3d 게임? 과제였지만 레이케스팅 등 튜토리얼이 잘 되어있어서 무리없이 할 수 있었다. 팀플하는 동안 사방이 화이트보드로 덮힌 공간에 자리를 잡고, 각자 레이케스팅을 공부한 뒤 서로에게 설명하는 시간을 가졌다. 그리고 실제로 평가자에게도 화이트보드에 그린 그림으로 설명을 했다.  

<br>
<br>

## 6. Reference
____
- [영어원문] https://lodev.org/cgtutor/raycasting.html
- [번역본] https://github.com/365kim/raycasting_tutorial?tab=readme-ov-file

<br>
<br>
