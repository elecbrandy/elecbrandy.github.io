+++
title = '[42seoul] ft_transcendence'
date = 2025-03-22
featured_image = "https://img.khan.co.kr/news/2021/09/06/l_2021090701000718800062862.webp"
tags = ['javascript', 'docker', '42seoul']
+++

{{<series title="📚 /42seoul 시리즈" series="42seoul">}}

<br>

_바닐라 js와 장고를 사용해 로컬 탁구게임 서비스 만들기_  

_(작성 중)_


## n. Evaluation


_2025.05 코드 리뷰 추가 삽입_

**try1 - review 1**  
<img src="https://i.imgur.com/LXmSlp0.png" width="300">  

**try2 - review 1**  
<img src="https://i.imgur.com/RdPpkfo.png" width="300">  

**try2 - reivew 2**  
<img src="https://i.imgur.com/Z5ANwTL.png" width="300">

**try2 - review 3**  
<img src="https://i.imgur.com/FrDEjB4.png" width="300">

42 과정의 마지막 과제였지만, 아쉽게도 한 번에 통과하진 못했다.  

첫 번째 평가에서 **이메일 로그인 페이로드에 비밀번호를 평문으로 전송**한다는 지적을 받았다. 이 때문에 **FAIL** 판정을 받았고, 팀원들과 해결 방안을 논의했다. 다른 서비스들은 어떻게 처리하나 살펴보니, 42뿐 아니라 Apple·Amazon 등 대부분이 페이로드에 평문 비밀번호를 그대로 보낸다는 사실을 확인했다.  

생각해 보니 비밀번호 해싱은 DB에 저장되기 직전에 이뤄진다.
프런트엔드나 API 게이트웨이에서 해싱해 보내더라도 결국 페이로드에는 ‘해시 값’이라는 새 평문이 담길 뿐, 노출 위험은 그대로다. 해싱된 문자열도 **단지 또 다른 텍스트**일 뿐이기 때문이다. 이 논리를 근거로 디펜스를 준비했고, 실제 서비스 사례를 제시해 다음 평가에서는 무사히 통과했다.  

이런 과정이 참 재미있다. 때로는 ‘무엇이든 뚫지 못하는 창 vs. 무엇이든 막지 못하는 방패’ 같은 공방이 벌어지지만, 대부분의 경우 이렇게 배움과 깨달음의 기회를 준다. 나는 42 과정의 핵심이 코딩 실력뿐 아니라 코드 리뷰와 토론을 통해 타인의 생각을 존중하고 배우는 경험에 있다고 믿는다.  
