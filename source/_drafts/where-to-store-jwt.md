---
title: Where to store JWT?
tags: [JWT]
date: 2020-05-22 22:17:47
description: Where to store JWT? 에서부터 시작한 고찰
---

# Where to store tokens? 에서 시작한 고찰....

## 앞서서....

- 모든 아래에 제시된 사이트들의 정보를 취합한 것이며 이미지 또는 구절이 모두 인용된 것 입니다.

## JWT 란

- RFC 7519 에 정의되어있다.
- compact and self-contained way for securely transmitting information between parties as a JSON object.
- This information can be verified and trusted because it is digitally signed.
- JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.
- JSON Data
- Cryptographically "signed"
- Not encrypted

### what's a Cryptographic Signature?

![image](https://user-images.githubusercontent.com/32104982/82040982-6802a300-96e2-11ea-930f-448fb7124c98.png)

출처: [https://www.youtube.com/watch?v=GdJ0wFi1Jyo](https://www.youtube.com/watch?v=GdJ0wFi1Jyo)

- 누군가에 의해서 작성된지 알게 해준다.

## 용어정리

### Stateless JWT

- entirely self-contained, and holds all user information necessary to complete a transaction within it.
- EG: userName, firstName, lastName, email, etc....

![image](https://user-images.githubusercontent.com/32104982/82040935-54573c80-96e2-11ea-829f-f86152f281d9.png)

### Stateful JWT

- only contains a session ID.
- All user data is stored server-side and retreived from a database.

![image](https://user-images.githubusercontent.com/32104982/82041025-781a8280-96e2-11ea-9a0d-ff9958fc31a4.png)

### Session Token

- A cryptographically signed (or unsigned) session identifier.
- All user data is stored server-side and retrieved from a database.

![image](https://user-images.githubusercontent.com/32104982/82041042-7f419080-96e2-11ea-8540-9fc261d4736f.png)

### Cookies

- An HTTP header field that allows you to store or retreive key/value data, set data expiration times, and apply various other data integrity rueles.
- Caps out at ~4k.

### Local Storage

- A Javascript API that allows a user to store data in a browser that is accessible only via Javascript

## 언제 사용하는가

- Authorization
- Information Exchange

## Structure

```jsx
xxxxx.yyyyy.zzzzz;
```

### 1. header

- 보통 토큰의 종류(ex: JWT)와 전자서명알고리즘(ex: HMAC SHA256 or RSA)을 명세한다

```jsx
{
	"alg":"HS256",
	"typ":"JWT"
}
```

- 이 JSON은 Base64Url 방식으로 인코딩 된다.

### 2. payload

- `claim` 을 담고있다.
- `claim` 이란 객체의 추가적인 데이터를 의미한다
- 총 3가지의 타입이 존재한다.
  - Registered claim
    - 사전 정의된 클래임이다.
    - 필수적이진 않지만 추천되는 것들이다.
    - iss(issure), exp(expiration time), sub(subject), aud(audience), and others
    - Notice that the claim names are only three characters long as JWT is meant to be compact.
  - Public claim
    - These can be defined at will by those using JWTs. But to avoid collisions they should be defined in the IANA JSON Web Token Registry or be defined as a URI that contains a collision resistant namespace.
  - Private claim
    - 커스텀 클레임이다.
- payload 또한 BaseUrl64로 인코딩 된다.

```jsx
Do note that for signed tokens this information,
though protected against tampering,
is readable by anyone.
Do not put secret information in the payload
or header elements of a JWT unless it is encrypted.
```

### 3. Signature

- 인코딩된 헤더와 인코딩된 페이로드를 이용해 전자서명을 실시한다.
- HMAC SHA256 알고리즘을 사용한다고 하면 signature은

```jsx
HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret);
```

- 전자서명은 이 메시지가 누군가에 의해서 변조되지 않았음을 증명한다.

## JWT는 어떻게 동작하는가?

![image](https://user-images.githubusercontent.com/32104982/82041058-8799cb80-96e2-11ea-93ff-2a07cf522b50.png)

출처: [https://jwt.io/introduction/](https://jwt.io/introduction/)

- 유저가 보호되고있는 자원이나 라우트에 접근을 시도할 때 user agent 는 JWT를 메시지에 동봉해야한다.
- 관행적으로 `Authorization` 헤더에 `Bearer` 스키마를 이용하여 동봉한다.

```jsx
Authorization: Bearer <token>
```

- 이는 stateless authorization mechanism 이 될 수 있다.
- 서버는 `Authorization` 헤더를 보고 이 유저가 접근권한이 있는지 JWT를 확인한다.
- 만약 `Authorization` 헤더를 이용하면 Cross-Origin Resource Sharing 문제를 발생시키지 않는다(쿠키를 사용하지 않으면)

![image](https://user-images.githubusercontent.com/32104982/82041080-8d8fac80-96e2-11ea-9c0c-e9e2f0c5b4f7.png)

## 주의할 점

출처 : [https://blog.outsider.ne.kr/1160](https://blog.outsider.ne.kr/1160)

- 클레임 셋은 암호화하지 않는다.
  - 그래서 서명 없이도 누구나 열어볼 수 있기 때문에 여기에는 보안이 중요한 데이터는 넣으면 안 된다.
  - base64로 인코딩해서 사용하다 보면 이 부분을 간과하기 쉬운데 필요한 최소한의 정보만 클레임셋에 담아야 한다.
- 인코딩 특성상 클레임셋의 내용이 많아지면 토큰의 길이도 같이 길어진다.
  - 그래서 편하다고 너무 많은 정보를 담으면 안 된다.
  - 앞에서 정의된 클레임 네임이 전부 약자를 사용하는 이유도 JWT를 최대한 짧게 만들기 위함이다.
- 토큰을 강제로 만료시킬 방법이 없다.
  - 서버가 토큰의 상대를 가지고 있지 않고 토큰 발급시 해당 토큰이 유효한 조건이 결정되므로 클라이언트가 로그아웃하더라도 해당 토큰을 클라이언트가 제거하는 것 뿐이지 토큰 자체가 만료되는 것은 아니다.
  - 만약 이때 누군가 토큰을 탈취한다면 해당 토큰을 만료시간까지는 유효하게 된다. 많은 고민을 해보았지만 무상태를 유지하면서 이 부분을 같이 해결할 방법은 존재하지 않으므로 서비스에서 이부분이 문제가 된다면 선택을 해야한다고 본다.

---

## JWT에 대한 미신들

- Token 을 어디에 저장해야하는지 결론을 내리기에 앞서 우선적으로 JWT에 대한 미신에 대해서 알면 도움이 됩니다.
- 이 미신들은 `SFNode Meetup: Why JWTs Are Bad for Authentication - Randall Degges - 2018-01` 에서 나온 내용들로 JWT를 사용하지 말자는 취지입니다.
- 다소 긴 내용으로 생략하셔도 됩니다.

### 1. JWTs are Easier to Use

- **FALSE!**

- JWTS:
  - First spec draftL DEC 27, 2012
  - Began gaining adoption / marketing: mid 2014
  - Requires additional tools, libraries, and knowledge to function (developer effort required)
- Sessions:
  - Every web framwork since 1990s
  - Requires 0 effort to use

### JWTs are More Flexible

- **FALSE!**

![image](https://user-images.githubusercontent.com/32104982/82041099-941e2400-96e2-11ea-8a83-762727e2a81a.png)

### JWTs are More Secure

- **FALSE!**

- **JWTs**

  - Goods
    - Cryptographically signed
    - Can be encrypted (JWE)
  - Bads
    - Complex spec
    - Multiple vulnerabilities found in last year
    - Vastly different support in libraries

- **Sessions**
  - Goods
    - Cryptographically signed
    - Can be encryped
    - Been around since ~1994
    - Well vetted, battle tested
    - 0 complexity in the spec
    - No vulnerabilities in like.... forever
    - Identical library support everywhere

### JWTs Don't Require "Cookie Consent"

- **FALSE!**

```jsx
The law requires you to notify a user IF you are tracking their
behavior(eg: analytics, tracking, marketing)
-- not for login functionality.
The place of storage does not matter.
```

### JWTs Prevent CSRF

- **FALSE!**

- Cookies

  - you are still susceptible to CSRF

- Local Storage
  - you are safe from CSRF, but have opened yourself up to a much greater attack vector .....XSS

**🚀CSRF is trival to fix. XSS .... Not so much**

- OWASP(Open Web Application Security Project)

```jsx
"... In other words, any authentication your application requires
can be bypassed by a user with local privileges to the machine
on which the data is stored. Therefore, it's recommended not
to store any sensitive information in local storage"
```

### JWTs Are Better for Cross Domain

- **FALSE!**

![image](https://user-images.githubusercontent.com/32104982/82041113-9c765f00-96e2-11ea-8554-d583e1aeb4b3.png)

- Login server 는 쿠키를 이용하여 사용자를 자신의 도메인에 로그인 시켰다.
- 사용자는 이제 로그인 서브도메인으로 로그인 되었다.
- 로그인 서버는 만료기간이 10초인 JWT를 생성하여 유저를 대시보드 서브도메인으로 302 리다이렉트 시킨다.
- 대시보드 서버는 url에 있는 토큰을 가져와 추출한다.
- 이후 대시보드 서버는 유저의 세션 아이디가 포함된 JWT를 검증한다.
- 완료되면, 유저에게 새로운 쿠키를 생성한다.
- 이제 유저는 대시보드 도메인에 로그인 되어있다.
- 유저는 로그인 된 채로 대시보드 페이지를 받을 수 있다.

- 이는 굉장히 큰 어플리케이션에서 top-level 도메인을 across 할 수 있는 방법 이다.
- 모든 인증정보는 쿠키에 저장되어 안전하다.
- JWT는 유저의 세션아이디 만을 가지고 짧은 만료기한을 가졌다.
- 또한 JWT가 올바르게 사용되는 유스케이스이다.

- **즉, cookie를 사용하여 안전하게 cross domain이 가능하다.**

### JWTs Work Better on Mobile

- **FALSE!**
- 모바일에도 충분히 cookie를 사용할 수 있다.

### JWTs are More Efficient

- **FALSE!**

![image](https://user-images.githubusercontent.com/32104982/82041124-a5673080-96e2-11ea-9e0f-afd4514653a6.png)

- 그 크기가 너무 크다.

### JWTs Are Easy to Revoke

- **FALSE!**

![image](https://user-images.githubusercontent.com/32104982/82041140-ab5d1180-96e2-11ea-998d-5d5ece711cf1.png)

- 공격자가 access token을 훔쳤을 경우 서버에서 이를 차단하기 위해서는 key를 변경할 수 밖에 없다.
- 다른 사용자까지 재인증을 해야하는 상황이 발생한다.

![image](https://user-images.githubusercontent.com/32104982/82041155-af892f00-96e2-11ea-8f72-d755139dc5f4.png)

- 테이블을 유지하면 된다!

![image](https://user-images.githubusercontent.com/32104982/82041172-b4e67980-96e2-11ea-8e4e-19fc9cdbf242.png)

- 하지만 이럴거면 session id를 사용하는 것이 낫다.
- JWT는 크고 효율적이지 못하다.

### JWTs are Easier to "Scale"

- **FALSE!**

- JWTs

  - Good
    - Can be validated locally without any necessary external DB access
  - Bad
    - This only applies to stateless JWTs, not stateful JWTs
    - Requires more bandwidth on every request

- Sessions
  - Good
    - Can use different types of session caches to speed up access server-side (including local memory)
    - Requires less bandwidth for users
  - Bad
    - Always requires some sort of DB / cache to retrieve data

![image](https://user-images.githubusercontent.com/32104982/82041192-bca61e00-96e2-11ea-8d93-42ae2b109c47.png)

- 우측에 DB stack은 cluster DB를 의미한다.

![image](https://user-images.githubusercontent.com/32104982/82041205-c29bff00-96e2-11ea-92a9-3449fb3825d3.png)

- session scailing 에는 문제가 없다. 큰어려움이 존재하지 않는다.

### JWTs Have Stale Data

- **TRUE!**

![image](https://user-images.githubusercontent.com/32104982/82041219-c7f94980-96e2-11ea-895a-341b88cdd09b.png)

- **caching is bad, caching is enemy - 보안적인 측면에서 항상 고려해야하는 부분.**

### 🚀 So, when we can use JWT?

### JWT Use Cases

![image](https://user-images.githubusercontent.com/32104982/82041228-cc256700-96e2-11ea-9e50-71d3fad1b364.png)

- 짧은 유효기간, 단 1번의 사용

![image](https://user-images.githubusercontent.com/32104982/82041239-d0ea1b00-96e2-11ea-8c2a-536e9850f116.png)

---

## "**_Where"_** to store TOKEN??????

- OWSAP 에서 말한것과 같이 예민한 정보는 Local storage에 두는 것을 권장되지 않는다.
- XSS와 같은 공격에 노출되기 쉬운데 이는 완벽히 차단하는 것이 매우 어렵다고 한다.
- Cookie에 저장하고 http only 옵션을 통해 js에서 접근하지 못하게 하는 방법이 있다.
- Cookie 저장 방법 또한 CSRF 공격에 노출되어 있는데 이는, XSS 보다 방어하기 쉬우며 많은 생태계의 지원이 존재한다.
- 하지만 Cookie에 두면 모든 요청에 자동으로 들어가지게 된다.
- 또한 `Authorization` 헤더에 삽입이 불가능하다.
- 하지만 Local storage 보다는 cookie에 저장하는 것이 권장된다.
- 자세한 내용은 위의 JWT의 미신에서 서술되어있다.
- Cookie 를 사용하게되면 refresh / access token 전략을 사용할 수 없다. 왜냐하면 모든 요청에 자연스럽게 쿠키가 동봉되기 때문이다.

### 그러면 어디에 저장해야하는가?

- 한가지의 전략을 '권혁우' 님에게 추천받았다.
- [https://www.youtube.com/watch?v=iD49_NIQ-R4&t=5s](https://www.youtube.com/watch?v=iD49_NIQ-R4&t=5s)
- access token은 in memory에 저장하고 refresh token은 cookie로 써 저장하는 방식이다.
- 모든 요청에 refresh token이 들어있으므로 만료된 access token을 보내도 바로 발급을 받을 수 있어서 사용자 입장에선 불편한 것이 없다.
- 또한 공격자가 이를 이용해 CSRF 공격을 하더라도 access token 없이 refresh token만 해당 메시지에 존재하므로 아무런 공격을 할 수 없다.

## 그렇다면 모든 문제 해결?

- 보안쪽으로는 스스로가 능통하지 못하니 어떠한 문제가 더 발생할지는 알 수 가 없다.
- 그렇다면 어떻게 해야 알지못하는 미래의 안전을 보장할 수 있을까?
- 사실 가장 좋은 방법은 예민한 정보는 **클라이언트에 두지 않는 것**이다.
- 그렇다면 실제 서비스는 어떤 식으로 동작할까?
- jwt를 사용할까?

## 실제 서비스를 확인해보자

- 현재 과제와 관련된 airbnb를 통해 확인해보자
- 쿠키를 살펴보자
- `_aat` 와 `_airbed_session_id` 를 제거하면 로그아웃이 된다.
- `_aat` 의 값은`0%7CLf6Pe%2Fin%2F3c6Znq5ajLWt%2FQ45kvrfNRHp6F97CeVxcJ8Qowy4Vv8cF9UmBTHykbo`
- `_airbend_session_id` 의 값은 `22f40fbe811d5522717b285da57fbd05` 로 나왔다.
- JWT에서 말하는 형식은 아니다. 그렇다면 어떻게 구성된 것일까?
- 길이로보나 형식을 보나 stateless JWT 로 보이지는 않는다.
- 그렇다면 서버에서 세션테이블을 유지하는 것 같은데 자세히 알 수가 없다.
- oauth 로 로그인 하였기 때문에 그 토큰을 통해 나의 권한을 확인 할 것이라고 생각했는데 그 토큰은 클라이언트에게 저장되어 있지 않은 것 같다.
- 그렇다면 그 토큰은 서버에 저장되어 있고 그 키값만 클라이언트가 쿠키의 형태로 저장하는 것은 아닐까 하는 추측을 하게 되었다.
- 그러던 와중 MSA 로 구성되었을 경우 API Gateway 라는 것을 두어 이곳에서 토큰을 테이블로 관리하고 클라이언트에게는 그 키 값만 쿠키에 저장하도록 하는 것이다.
- JWT가 MSA에 사용하기에 적합하다고는 하나 그 위험성을 무시하지 못하니 API 게이트웨이라는 것을 두어 여기서 인증, 인가를 담당하게 하는 것은 아닐까 하는 생각을 하게 되었다.

## API Gateway

![image](https://user-images.githubusercontent.com/32104982/82041258-d7789280-96e2-11ea-83cf-3aa34ac59de1.png)

출처:[https://bcho.tistory.com/1005](https://bcho.tistory.com/1005)

[MSA 아키텍쳐 구현을 위한 API 게이트웨이의 이해 (API GATEWAY)](https://bcho.tistory.com/1005)

## 결론

- JWT는 보안적인 문제가 존재하고 JWT로만 할 수 있다고 알려진 것들은 대부분 세션id를 통해 사용하는 방법으로 대체할 수는 있다. 하지만 두가지 방식의 목적은 다르다.
- JWT에 부족한 보안을 채우기 위한 대체 방법들은 토큰 방식의 이점을 잃어버리게 된다. 즉, 쿠키에 세션 id를 저장하는 방법보다 유리한 점을 찾기가 힘들어진다.
- 토큰을 서버에 테이블로 저장하고 그 키값만 클라이언트가 쿠키로 저장하는 방식을 사용하게 되면 stateless token의 이점을 누리지 못한다.
- 프론트엔드 프레임워크, 라이브러리 들은 이 토큰정보를 안전하게 저장하기 위한 많은 장치들을 제공해준다
- 하지만 제일 중요한 것은 토큰 인증 방식은 보안적인 측면을 강화하기 위해서 나온것이 아니라 **서버에서의 DB접근의 부담을 줄이고 서버를 stateless로 유지하기 위함**이다.
- refresh token , access token 전략을 사용하더라도 웹 브라우저 상에서 refresh token을 완벽히 안전하게 저장하는 것은 불가능하다. 따라서, 절때 토큰에 민감한 정보를 두어선 안된다.

## 나만의 생각

- 이번 과제에서는 access token은 메모리에 저장하고 refresh token은 쿠키에 저장하는 방식을 사용해보려고 한다.
- oauth는 서버 개발자 입장에서 인증의 부담을 줄이는 것도 있지만 그 토큰을 자체적으로 관리를 또 해야하므로
- 사용자들에게 편리함을 제공해주기 위해서 사용한다는 점이 더 클수도 있겠다는 생각을 했다.

## 참고 사이트

- [Where to Store Tokens](https://auth0.com/docs/security/store-tokens#native-mobile-apps)

- [joepie91's Ramblings](http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/)

- [SFNode Meetup: Why JWTs Are Bad for Authentication - Randall Degges - 2018-01](https://www.youtube.com/watch?v=GdJ0wFi1Jyo)

- [MSA 아키텍쳐 구현을 위한 API 게이트웨이의 이해 (API GATEWAY)](https://bcho.tistory.com/1005)

- [JWT(JSON Web Token)에 대해서... :: Outsider's Dev Story](https://blog.outsider.ne.kr/1160)
