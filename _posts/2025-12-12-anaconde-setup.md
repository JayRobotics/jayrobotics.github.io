---
title: "[Anaconda] Jupyter Notebook 가상환경 설정"
date: 2025-12-12 19:02:00 +0900
categories: [Setup]
tags: [Anaconda, Anaconda Prompt, jupyter notebook, kernel, programming]
comments: true
math: true
toc: true
#pin: true
#image:
  #path: thumbnail.png
  #alt: image alternative text
---

파이썬에서 프로젝트를 진행할 때는 각각의 프로젝트 별로 **가상환경**을 만들어서 진행해주는 것이 좋다.
Anaconda prompt에서 conda 명령어를 통해 Python 가상환경을 Jupyter notebook 커널로 추가하거나 삭제하는 방법을 알아보자.  


## **1. 가상환경 생성하기**
conda 명령어로 venv1이라는 이름의 pyhton 3.8 버전을 사용하는 가상환경을 생성한다.
```bash
conda create -n venv1 python=3.8
```

## **2. 가상환경 활성화 하기**
앞에서 생성한 venv1를 활성화 한다.  
```bash
conda activate venv1
```

## **3. ipykernel 설치하기**
ipykernel을 설치한다.
```bash
pip install ipykernel
```

## **4. 커널 추가하기**
앞에서 설치한 ipykernel을 이용해서 가상환경 venv1을 jupyter notebook의 커널로 추가한다.
```bash
python -m ipykernel install --user --name=venv1
```

## **5. 기타 명령어**
anaconda 가상환경 리스트 확인
```bash
conda env list
```

anaconda 가상환경 실행
```bash
conda [env_name] activate
```

anaconda 가상환경 종료
```bash
conda [env_name] deactivate
```

jupyter notebook에 추가된 커널 목록을 확인
```bash
jupyter kernelspec list
```

jupyter notebook에 추가된 커널 삭제
```bash
jupyter kernelspec uninstall [kernel_name]
```

## **6. 궁금한 점**
> **Q.가상환경을 만들어서 사용하는 이유는 무엇인가?**
> - 프로젝트마다 필요로 하는 라이브러리 버전이 다르다.
> - "의존성 충돌(Dependency Conflict)"을 방지하기 위함이다.
> - 프로젝트의 독립성 확보
  

> **Q. 커널(kernel)이란?**
> - 운영체제의 핵심 부분으로, 컴퓨터의 <u>하드웨어와 소프트웨어 사이를 연결</u>해주는 중추 시스템이다.
> - 프로그램이 CPU, 메모리, 저장장치, 네트워크 등 하드웨어를 직접 건드리지 못하도록 커널이 대신 중재하고 관리한다.

  
> **Q. jupyter notebook에 가상환경 커널을 추가하는 이유는 무엇인가?**
> - 커널을 추가하는 이유는 가상환경을 생성한 커널의 이동을 빠르게 하기 위해서이다.
> ![image](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F1XdLD%2FbtrTQ1MrKUR%2FAAAAAAAAAAAAAAAAAAAAALb661iDzs56vycHf83tbp9hhgwBVxZfJE7vv9KhVaFG%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1767193199%26allow_ip%3D%26allow_referer%3D%26signature%3DNFdp11CWDodwNKrkOAgZEPGViq8%253D)
>  
> **e.g. project_A 가상환경에서 작업 중인데 project_B 가상환경의 코드를 수정해야 하는 경우가 발생한다면?**  
> 1. 커널 추가하지 않은 경우  
> step 1. project_A 가상환경 비활성화  
> step 2. project_B 가상환겨 활성화  
> step 3. project_B의 jupyter notebook 실행  
> step 4. project_B 가상환경의 수정할 파일 실행  
> step 5. 코드 수정
>  
> 2. 커널 추가 한 경우  
> step 1. project_B 가상환경의 수정할 파일 실행  
> step 2. jupyter notebook 내 커널 변경  
> step 3. 코드 수정
>
> <mark>따라서, jupyter notebook 가상환경을 이용한 작업 시 kernel을 추가해두면 수정이 편리하다..!</mark>










