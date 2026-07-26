+++
title = 'Spring Boot 기반 Slack Bot'
date = 2025-05-09
featured_image = "https://gohugo.io/images/hugo-logo-wide.svg"
tags = ['hugo']
draft = true
+++

{{<series title="📚 Hugo 블로그 만들기" series="hugo" >}}

<br>

## 1. 소개


## 3. QnA

### 3-1. Slack과 Spring을 연결하는 과정

``` Java
@RestController
public class SlackController {
    @PostMapping("/api/slack/events")
    public String handleSlackEvent(@RequestBody Map<String, Object> payload) {
        if (payload.containsKey("challenge")) {
            return payload.get("challenge").toString();
        }
        System.out.println("Message from Slack: " + payload);
        return "ok";
    }
}
```

- `@RestController`
    - RestAPI 사용 어노테이션
    - `@Controller`에 `@ResponseBody`가 결합된 형태로, 리턴값을 JSON이나 문자열로 직접 응답할 때 사용한다.
- `@RequestBody`
    - JSON을 Java 객체로 변환
    - 클라이언트(Slack)가 보낸 HTTP 요청의 Body 내용을 자바 객체(여기서는 Map)로 변환해주는 역할을 한다.
    - Spring은 Jackson이라는 라이브러리를 내장하고 있다. `@RequestBody`를 붙이면 Slack이 보낸 JSON 데이터를 자동으로 Map<String, Object> 형태로 변환해준다.
    - 예: `{"type": "url_verification", "challenge": "12345"} → payload.get("challenge")` 로 `"12345"` 를 꺼낼 수 있다.
- `containsKey`
    - Map 안에 특정 이름의 **키(Key)가 존재하는지 확인** 하는 메서드이다.
    - 즉, `challenge` 라는 데이터가 왔는지 체크하는 것이다.
- 왜 하필이면 문자열 `"challenge"` 일까? 
    - Slack API 서버가 이 URL이 살아있는지 확인하기 위해 던지는 **인증용 퀴즈(Challenge)** 키값이다.
- `return payload.get("challenge").toString();` 의 의미
    - 
| **7** | `return ...toString()`의 의미 | **정확합니다.** Slack이 보낸 퀴즈 정답(`challenge` 값)을 그대로 문자열로 변환하여 응답으로 돌려주는 것입니다. |

---

## 2. 전문가적인 코드 상세 설명

이 코드는 **Slack Event Subscriptions** 기능을 사용하기 위한 가장 첫 번째 관문인 **'URL Verification'** 단계를 처리하는 로직입니다.

### @RequestBody: JSON을 Java 객체로 변환

Spring은 `Jackson`이라는 라이브러리를 내장하고 있습니다. `@RequestBody`를 붙이면 Slack이 보낸 JSON 데이터를 자동으로 `Map<String, Object>` 형태로 변환(Deserialization)해줍니다.

* 예: `{"type": "url_verification", "challenge": "12345"}` → `payload.get("challenge")`로 `"12345"`를 꺼낼 수 있음.

### 왜 "challenge"를 체크하고 반환하는가?

Slack API는 보안을 위해, 당신의 서버가 실제 요청을 받을 준비가 되었는지 확인합니다.

1. Slack이 내 서버에 `{"challenge": "some_random_string", ...}`을 보냅니다.
2. 서버는 즉시 그 `some_random_string`을 **Plain Text로 그대로 응답**해야 합니다.
3. 응답이 일치하면 Slack이 "이 서버는 믿을 수 있군!" 하고 인증을 완료해줍니다.

### 코드의 흐름 (Step-by-Step)

1. **수신:** `/api/slack/events`로 POST 요청이 들어옴.
2. **변환:** JSON 본문을 `payload`라는 Map에 담음.
3. **검증:** `payload.containsKey("challenge")`를 통해 이 요청이 Slack의 인증 요청인지 확인.
4. **응답:** 인증 요청이라면 받은 값을 그대로 리턴(Slack 인증 통과).
5. **일반 로직:** 인증 요청이 아니라면(실제 메시지 등), 콘솔에 출력하고 `"ok"`를 응답.


발전
* **DTO 사용:** `Map<String, Object>`는 유연하지만 내부 데이터를 알기 어렵습니다. Slack 요청 구조에 맞는 **자바 객체(DTO)**를 정의해 사용하는 것이 타입 안정성 면에서 좋습니다.
* **보안 검증:** 실제 서비스에서는 Slack이 보낸 `token`이나 `Signing Secret`을 검증하는 로직이 추가되어야 보안 사고를 막을 수 있습니다.

```java
// 실무 지향적 구조 예시
@PostMapping("/api/slack/events")
public ResponseEntity<String> handleSlackEvent(@RequestBody SlackEventRequest request) {
    if ("url_verification".equals(request.getType())) {
        return ResponseEntity.ok(request.getChallenge());
    }
    // 서비스 로직 처리
    return ResponseEntity.ok("ok");
}

```

이 코드는 단순히 "문자열을 돌려준다"는 행위를 넘어, **Slack 서버와 내 서버 사이의 신뢰를 구축하는 '악수(Handshake)'**의 핵심 로직입니다.

 개발자의 관점에서 이 한 줄이 갖는 의미를 세 가지 측면으로 나누어 상세히 설명해 드릴게요.

1. 코드 레벨의 동작 (Java 로직)
이 문장은 세 단계의 체인으로 구성되어 있습니다.

payload.get("challenge"):

payload는 Map<String, Object>입니다.

여기서 "challenge"라는 키(Key)에 해당하는 값을 꺼냅니다.

이때 반환 타입은 Object입니다. (Map을 정의할 때 Value 타입을 Object로 잡았기 때문입니다.)

.toString():

꺼내온 Object 타입의 데이터를 실제 String 형태로 변환합니다.

Slack이 보낸 데이터가 {"challenge": "3eZbr7..."} 라면, "3eZbr7..."이라는 문자열을 얻게 됩니다.

return:

@RestController 환경에서 이 값을 리턴하면, Spring은 이를 HTTP 응답 본문(Response Body)에 그대로 담아서 보냅니다.

2. 프로토콜 레벨의 의미 (Slack URL Verification)
Slack API를 처음 설정할 때, Slack은 당신의 서버 주소가 진짜인지, 그리고 요청을 처리할 준비가 되었는지 확인하고 싶어 합니다.

Slack의 질문: "내가 임의의 문자열 abc123을 보낼 테니, 네가 이걸 그대로 나에게 다시 돌려줘 봐. 그러면 네 서버가 살아있고 내 말을 이해한다고 믿을게."

서버의 답변: "알았어. 여기 abc123이야." (이것이 바로 return payload.get("challenge").toString(); 입니다.)

이 과정을 URL Verification이라고 하며, 이 응답이 성공적으로 이루어져야만 Slack API 설정 화면의 Verified 체크 표시가 활성화됩니다.

3. 왜 하필 "challenge" 인가? (데이터 구조)
Slack이 이벤트를 보낼 때, 인증 요청(url_verification)은 아래와 같은 JSON 구조로 들어옵니다.

JSON

{
    "token": "Jz79vJpWnEs4AthYeeY",
    "challenge": "v38df37293849f83u93bd338", // 바로 이 값!
    "type": "url_verification"
}
키(Key) 이름: Slack API 명세서(Documentation)에 이 값을 "challenge"라는 이름에 담아 보낸다고 약속되어 있습니다.

규칙: Slack은 응답 본문에 다른 수식어 없이 오직 이 challenge 값만 평문(Plain Text)으로 포함하여 응답하기를 요구합니다.

💡 의 한마디: 주의할 점
만약 이 로직이 없다면, Slack은 "이 서버는 내 요청을 처리할 준비가 안 됐군"이라고 판단하여 이벤트를 보내주지 않습니다.

또한, 실무에서는 Null 체크를 해주는 것이 안전합니다.

return payload.get("challenge") != null ? payload.get("challenge").toString() : "ok";


return "ok";는 짧은 한 줄이지만, 네트워크 통신과 Slack API의 동작 방식 관점에서 아주 중요한 역할을 합니다.  개발자로서 이 코드가 왜 필요한지, 그리고 실제 어떤 효과를 주는지 3가지 포인트로 짚어드릴게요.

1. "나 잘 받았어!"라는 수신 확인 (Acknowledgement)
Slack 서버가 우리 서버로 메시지나 이벤트를 보냈을 때, 우리 서버는 **"내가 이 데이터를 무사히 잘 받았다"**는 신호를 되돌려줘야 합니다.

@RestController에서 문자열 "ok"를 리턴하면, Spring은 HTTP 상태 코드 200 OK와 함께 ok라는 텍스트를 응답 본문에 담아 보냅니다.

꼭 "ok"일 필요는 없지만, 관례적으로 처리가 완료되었음을 알리기 위해 가장 많이 사용하는 짧은 문자열입니다.

2. 슬랙의 '재시도(Retry)'를 방지함
이게 가장 실무적으로 중요한 이유입니다. Slack API에는 **"3초 규칙"**이 있습니다.

3초 타임아웃: Slack이 이벤트를 보냈는데 우리 서버가 3초 안에 응답(200 OK)을 주지 않으면, Slack은 "어? 서버가 죽었나?"라고 판단합니다.

재시도 로직: 그러면 Slack은 같은 이벤트를 다시 보냅니다. (보통 5분 동안 총 3번 정도 시도합니다.)

문제 발생: 만약 return "ok";를 빼먹거나 처리가 너무 늦어지면, 내 서버에는 똑같은 메시지가 3번씩 들어와서 중복 처리가 되는 불상사가 생길 수 있습니다. 이를 방지하기 위해 "일단 잘 받았으니 그만 보내!"라고 말해주는 것이 return "ok";입니다.

3. "나는 지금 바빠, 나중에 처리할게"의 의미
실무에서는 로직이 복잡해지면 시간이 오래 걸릴 수 있습니다. 그래서 들은 보통 다음과 같이 코드를 짭니다.

받자마자: "ok"라고 응답해서 Slack을 안심시킨다.

비동기 처리: 실제 무거운 로직(DB 저장, AI 분석 등)은 별도의 스레드(Background)에서 돌린다.

Java

@PostMapping("/api/slack/events")
public String handleSlackEvent(@RequestBody SlackEventRequest request) {
    // 1. (인증 로직 생략) 
    
    // 2. 시간이 오래 걸리는 작업은 비동기로 던짐 (@Async 등 활용)
    myService.processHeavyWork(request); 

    // 3. 0.1초 만에 바로 "ok" 응답!
    return "ok"; 
}

사실 더 정석적인(Professional한) 표현은 ResponseEntity를 사용하는 것입니다. 문자열만 덜렁 보내는 것보다 HTTP 상태 코드를 명시적으로 보여줄 수 있기 때문이죠.

Java

@PostMapping("/api/slack/events")
public ResponseEntity<String> handleSlackEvent(@RequestBody SlackEventRequest request) {
    // ... 로직 ...
    return ResponseEntity.ok("ok"); // HTTP 200 상태코드와 "ok" 바디를 함께 반환
}
이제 Slack과 데이터를 주고받는 기초는 완벽히 이해하셨네요!