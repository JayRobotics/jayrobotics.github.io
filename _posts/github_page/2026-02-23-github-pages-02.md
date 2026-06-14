---
title: "[Github Pages] 깃허브 블로그 만들기 (2) - 초기 세팅"
date: 2026-02-23 16:48:00 +0900
categories: [Github Pages]
tags: [Github Pasges, 블로그, 개발자 블로그, Github]
comments: true
math: true
toc: true
#pin: true
image:
  path: /assets/images/github-pages/github_pages_logo.jpg
  #alt: image alternative text
---
## **1. 배경지식**

### **1-1. Ruby 란?**

<img src="/assets/images/github-pages/Ruby_(software)_Logo.png" alt="그림 1.1 Ruby 로고"> 

1995년 일본의 마츠모토 유키히로(Yukihiro Mastumoto)가 만든 **객체지향 프로그래밍 언어**이다.
**간결함**과 **생산성**을 강조한 만큼 사람에게 매우 친숙한 언어를 지향하기 때문에 원하는 부분을 자유롭게 바꿀 수 있는 유연성과 함께
**Block**이나 **Mixin**과 같이 다른 언어가 가지고 있지 않은 다양한 매력을 보유하고 있다.

- **순수 객체지향**  
    순수 객체지향 언어는 모든 것이 객체이며, 모든 연산이 객체 간의 메시지 전달로 이루어지는 언어이다. 
    예들 들어 Java의 경우에는 char, int와 같은 원시 자료형(primitive type)이 존재하며, 
    이를 객체로 다루기 위해 Integer, Character 등의 Wrapper Class가 별도로 존재한다. 
    하지만 Ruby는 이러한 구분이 없으며, 숫자나 문자열을 포함한 모든 값이 객체로 취급된다.
- **함수형 언어**  
    Ruby는 코드 블록(**Block**)과 **Proc**, **Lambda**와 같은 객체를 지원하기 때문에 코드의 집합을 변수에 저장하거나 메소드의 인수로 전달할 수 있다. 
    이는 함수를 하나의 값처럼 다룰 수 있음을 의미한다. 
    또한 외부 변수의 값을 기억하는 **클로저(closure)**를 지원하며, 람다 표현식을 통해 이름 없는 함수를 생성할 수 있다.
- **메타 프로그래밍**  
    <mark>메타 프로그래밍이란 프로그램이 자기 자신의 구조나 동작을 실행 중에 수정하거나 확장할 수 있는 기법</mark>을 의미한다. 
    Ruby는 **객체지향적 특징**과 **함수형 언어적 특징**이 결합되어 있어 메타 프로그래밍을 매우 유연하게 지원한다. 
    예를 들어 실행 중에 클래스에 메소드를 동적으로 추가하거나, 기존 메소드를 재정의할 수 있다. 
    이러한 특성은 언어 자체를 확장 가능하게 만들며, 적은 코드로 강력한 기능을 구현할 수 있게 한다. 
    Ruby의 창시자인 마츠모토 유키히로는 Emacs와 Elisp의 영향을 받았으며, 이러한 철학이 Ruby의 메타 프로그래밍 설계에 반영되었다.
<br><br>

### **1-2. Jekyll 란?**

<img src="/assets/images/github-pages/Jekyll_(software)_Logo.png" alt="그림 1.2 Jekyll 로고"> 

Jekyll은 **Ruby로 만들어진 정적 사이트 생성기(static site generator)**이다. 소스 파일(Markdown, HTML 템플릿, 데이터 파일)을 
정적 HTML, CSS, JavaScript 및 asset file로 변환하여 어떤 웹 서버나 CDN(Content Delivery Network)에서도 
제공(serve)할 수 있도록 하는 도구이다.
<br>

또한, Jekyll은 **단순성(simplicity)**, **성능(performance)** 그리고 **버전 관리 가능한 콘텐츠(version-controlled content)**를 중요하게 여기며,
<mark>Github Pages의 기본 정적 사이트 워크플로우를 구동하는 핵심 엔진이다.</mark>
<br><br><br>

## **2. Ruby 설치**

Ruby 설치 사이트: [Ruby Installer](https://rubyinstaller.org/downloads/archives/)  
Jekyll 공식 문서: [Jekyll Docs](https://jekyllrb.com/docs/)

<img src="/assets/images/github-pages/Ruby_install.png" alt="그림 1.3 Ruby install"> 

Jekyll 공식 문서의 Windows 설치 가이드에는 x64(64bit) 사용할 것을 권장한다고 나와있다. 
그래서 그냥 화살표 되어있는 **Ruby+Devkit 3.4.8-1 (x64)** 버전을 설치하였다.

<img src="/assets/images/github-pages/Ruby_version.png" alt="그림 1.4 Ruby version"> 
<br><br><br>

## **3. Jekyll 설치**
**명령 프롬프트(CMD)** 또는 **PowerShell** 창을 열어서 아래 커멘드를 입력하여 설치한다. 
Jekyll은 Ruby용 라이브러리 파일 묶음인 **gem**에 의존하기 때문에 의존성 버전 관리 도구인 **Bundler**를 함께 설치한다.

```shell
gem install jekyll // 순서 1
gem install bundler // 순서 2
```
<img src="/assets/images/github-pages/Jekyll_version.png" alt="그림 1.5 Jekyll version"> 
<br><br><br>

## **4. Git 설치**

<img src="/assets/images/github-pages/git_logo.png" alt="그림 1.5 Git logo"> 


Git은 **분산형 버전 관리 시스템(Distributed Version Control System, DVCS)**이다.
<br>

쉽게 말해
- 코드의 변경 이력을 저장하고,
- 이전 상태로 되돌릴 수 있으며,
- 여러 사람이 동시에 협업할 수 있게 해주는 도구  

설치 방법을 잘 정리해둔 블로그가 있어서 해당 블로그 링크 남겨둔다. → [Git 설치 방법](https://sfida.tistory.com/46)
<br><br><br>

## **5. Node.js 설치 (선택사항)**
Chirpy 테마는 두 가지 버전이 존재하는데 필자는 현재 **chirpy-starter**를 사용중이다. 
해당 테마는 **<u>블로그 운영을 쉽게 하기 위한 사용자용 템플릿</u>**으로 초보자가 사용하기에 좋은 테마이다.
<br>

**Chirpy 테마 사용 시 Node.js를 설치해야 하는 이유**는 Chirpy가 JavaScript 번들링/압축 빌드 시스템을 사용하기 때문이다. 
테마가 동작하는데 필요한 JS/CSS 파일을 자동 생성(build)하려면 Node.js 환경이 반드시 필요하다고 한다. 
그런데 이는 Chirpy 테마의 원본 레포지토리인 **jekyll-theme-chirpy** 사용할 때의 얘기이다.
<br>

따라서 설치 안해도 문제는 없는데 로컬에서 웹 서버 돌리면 VScode 터미널 창에 자꾸 에러 뜨길래 신경 쓰여서 GPT에게 물어보았다.

<img src="/assets/images/github-pages/nodejs_error.png" alt="그림 1.6 Node.js error"> 

이 또한 설치 방법을 잘 정리해둔 블로그가 있어서 해당 블로그 링크 남겨둔다. → [Node.js 설치 방법](https://studyhard24.tistory.com/1426)
