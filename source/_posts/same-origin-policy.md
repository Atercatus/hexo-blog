---
title: Same-origin policy
date: 2020-05-22 22:17:47
tags: [SOP]
---

## Same-origin policy

[Same-origin policy: The core of web security @ OWASP Wellington](https://www.youtube.com/watch?v=zul8TtVS-64) 을 보고 정리한 학습노트 입니다.

## What is the same-origin policy?

### What is origin?

```
scheme://username:password@domain.com:443/path?query#fragment
```

`Origin = (scheme, domain, port)`

### What is the same origin?

|                  URL A |          URL B          | Same origin?         |
| ---------------------: | :---------------------: | :------------------- |
|    http://domain.com/a |   http://domain.com/b   | Yes                  |
|    http://goodsite.com |  https://goodsite.com   | No(different scheme) |
|      http://domain.com |  http://www.domain.com  | No(different domain) |
|      http://domain.com | http://domain.com:8080  | No(different port)   |
| http://domain.com/user | http://domain.com/admin | Yes                  |

### Window

브라우저의 각 Tab / Window 는 분리되어있습니다.
각각의 자바스크립트 실행 환경을 가집니다. 이 때, 같은 사이트라면 해당 `window` 객체에 접근이 가능하나 다른 사이트의 경우에는 same-origin 이 아니므로 해당 `window`의 접근이 불가합니다.

`window.open` 으로 새로운 윈도우를 열 수 있고, 해당 윈도우에서 `window.opener`로 자신을 `open`한 윈도우에 접근할 수 있습니다.

### Frame

Frame 또한 분리된 자바스크립트 실행 환경을 가집니다. window 와 마찬가지로 같은 사이트일 경우에만 접근이 가능합니다.

`parent.domain`의 도메인을 가진 사이트에서 `siteA.com` 와 `siteB.com`의 두 개의 `src` 를 가진 `frame`을 html body에 가진다면 부모 페이지에서 각 frame 에 존재하는 데이터에 접근할 수 없습니다.

## Why is it important?

브라우저에서 동작하는 하나의 웹사이트에서 다른 웹사이트에 접근하는 것을 막아줍니다.

이는 다른 사이트에서 해당 사이트의 데이터가 읽히는 것을 막아줍니다.

즉, 안전하게 웹페이지를 볼 수 있게 해줍니다.

## How does it apply to ?

### How does SOP apply to anchors?

```html
<a href="http://another.site.com/"></a>
```

사이트는 다른 사이트로 하이퍼링크 할 수 있습니다. 그 응답은 새로운 컨택스트를 가지고 있으며 따라서, 원래의 사이트는 접근한 사이트로 변경됩니다.

단, 사이트는 다른 사이트로 링크할 수는 있지만 그 응답을 읽을 수는 없습니다.

### How does SOP apply to forms?

```html
<form action="http://target.site.com/" method="POST"></form>
```

`Form`은 어떤 사이트에도 `POST`를 할 수 있습니다.

`anchor` 와 마찬가지로 그 요청을 보낼 수 있지만 그 응답을 읽을 순 없습니다.

### How does SOP apply to images?

```html
<img src="http://source.com/picture.jpg" />
```

해당 이미지를 보여줄 수 있습니다. 다만 그 이미지 데이터에 접근할 수 없습니다. 이는 정적 미디어(이미지, 동영상, 오디오)에 모두 적용됩니다.

### How does SOP apply to CSS?

```html
<link rel="stylesheet" type="text/css" href="http://source.com/main.css" />
```

다른 사이트의 CSS 를 포함(`include`) 할 수 있습니다. 단 CSS 데이터를 볼 수 없습니다.

이는 다른 사이트에서 가져온 CSS 를 브라우저에서 그 `rule` 을 깨트릴 수 없음을 의미합니다.

단, 이러한 것들은 브라우저에서만 해당됩니다.

### How does SOP apply to javascript includes?

```html
<script src="http://othersite.com/main.js">
```

다른 사이트의 자바스크립트 파일을 `include` 할 수 있습니다.

자바스크립트는 원래의 사이트에서 돌아갑니다.

### How does SOP apply to JSONP?

위와 같이 `script` 태그는 `include`가 가능하고 그 실행이 원래의 사이트에서 이루어 진다는 점을 이용하여 데이터를 요청할 수 있습니다.

이를 JSONP(JSON with Padding) 이라고 합니다. 그 자세한 내용은 아래의 참조에서 확인할 수 있습니다.

- 요청

```html
<script>
  function parseResponse(data) {...}
</script>
<script src="http://othersite.com/parseResponse" />
```

- 응답

```javascript
parseResponse({ Name: 'FOO' });
```

#### 참조

- [JSONP](https://ko.wikipedia.org/wiki/JSONP)
- [JSONP 알고 쓰자](https://kingbbode.tistory.com/26)

### How does SOP apply to web storage?

- Local storage

  - same origin 인 윈도우에서만 공유
  - 윈도우가 닫혀도 남아있음

- Session storage:

  - 현재 윈도우에서만 가능
  - 윈도우와 그 생명주기를 같이함

### How does SOP apply to cookies?

- CSRF Example
  - `<form action="http://othersite.com">...</form>` 와 같은 페이지를 응답 받습니다.
  - 해당 `form` 이 제출 됩니다.
  - 이 때, `action`에 적힌 사이트에 대한 쿠키가 동봉된 채로 요청이 갑니다.
  - 만약 해당 요청이 공격의 의도가 있고 쿠키에 로그인 정보가 존재했다면 이는 공격으로 이어집니다.

쿠키는 SOP 가 약간 다르게 적용됩니다. 쿠키는 이름, 도메인, path 에 의해 구별됩니다. 쿠키는 부모 도메인으로 확대될 수 있습니다. 또한 모든 서브도메인에 보낼 수 있습니다.

### How does SOP apply to windows, frames and iframes

프레임은 다른 프레임으로 이동시킬 수 있습니다.

- Parent frames: window.frames[0].location
- Child frames: window.parent, window.top
- Windows: window.opener, var x = window.open(...)

이는 tab-nabbing, window.opener, malicious advertisements를 야기합니다.

### How does SOP apply to XMLHttpRequest?

어떤 사이트에도 요청할 수 있습니다. 브라우저는 이 요청에 쿠키나 인증을 attach 합니다.

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://othersite.com', false);
xhr.send();
```

하지만 same origin의 경우에만 그 응답을 볼 수 있습니다.

## Getting around smae-origin policy

### Using PostMessage to communicate between frames

frame 과 window 는 다른 오리진끼리 통신할 수 없습니다.

`PostMessage` 를 이용하면 SOP 를 제거할 수 있습니다.

송신자는 보내고자하는 origin을 명시하고 수신자는 어떤 origin에서 메시지를 보냈는지 확인합니다.

- Sender

```javascript
window.frameA.postMessage(message, 'http://othersite.com');
```

- Receiver

```javascript
window.addEventListener(
  'message',
  function (event) {
    if (event.origin !== 'http://parent.site.com') {
      console.log('Wrong origin!' + event.origin);
      return;
    }
    window.rec.innerText = event.data;
  },
  false
);
```

### Using Cross-Origin Resource Sharing

CORS 는 SOP를 약화시키고 다른 사이트의 데이터를 읽을 수 있게 해줍니다.

- Sender

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://google.com/data.json', false);
xhr.send();
```

- Receiver

```
Access-Control-Allow-Origin: http://requester.com
```

## How-to?

### How to get data from another site?

- 서버로부터 바로 데이터 불러오기

  - CORS
  - JSONP

- Cross-frame communication
  - PostMessage
  - url fragments(not recommanded)

### How to isolate user content?

서브도메인을 사용하거나 다른 도메인을 사용합니다.

[Suborigin](https://w3c.github.io/webappsec-suborigins/)을 사용할 수 있습니다.

### How to share cookies?

쿠키 스코프를 부모 도메인으로 확장시킵니다.

쿠키를 설정하는 외부 리소스를 포함시킵니다.

Redirect between domains, setting cookies on the way

## Limitations

SOP 는 오직 브라우저에서만 적용됩니다.

다른 코드는 제한없이 리소스에 접근할 수 있습니다.

다른 보안 정책들과 사용해야합니다.

- Authentication
- Rate-limiting
- Captchas

## 참고자료

- [Same-origin policy: The core of web security @ OWASP Wellington](https://www.youtube.com/watch?v=zul8TtVS-64)
