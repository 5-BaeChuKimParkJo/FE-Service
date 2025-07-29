# 찰낙찰낙 🐟

<p align="center">
  <img alt="로고" src="https://github.com/user-attachments/assets/c0d2e3cc-fcda-404d-a773-b5e312913161" width="250" height="250">
</p>

<p align="center">
  <strong>중고 거래의 새로운 방식을 제시하는 경매 플랫폼</strong>
</p>

<p align="center">
  <a href="https://www.cabbage-secondhand.shop/">🌐 Live Demo</a> •
  <a href="#-기술-스택">🛠️ Tech Stack</a> •
  <a href="#-프로젝트-구조">📁 Project Structure</a> •
  <a href="#-개발-가이드">🚀 Development Guide</a>
</p>

## 📋 프로젝트 개요

| 항목           | 내용                                            |
| -------------- | ----------------------------------------------- |
| **프로젝트명** | 찰낙찰낙                                        |
| **팀명**       | 스파로스 6기 배추김박조                         |
| **기간**       | 2025.04.30 ~ 2025.07.15                         |
| **목표**       | 중고 물품을 경매 방식으로 거래할 수 있는 플랫폼 |

### 🎯 핵심 기능

- **실시간 경매 시스템** - 실시간 입찰 및 낙찰
- **WebSocket 채팅** - 구매자와 판매자 간 실시간 소통
- **SSE 알림** - 실시간 이벤트 알림
- **이미지 업로드** - S3 기반 이미지 관리
- **검색 시스템** - Elasticsearch 기반 검색

## 🛠️ 기술 스택

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white)
![React Hook Form](https://img.shields.io/badge/react--hook--form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)

### Backend

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

### Database & Cache

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)

### Infrastructure

![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)

## 📁 프로젝트 구조

```
chalnack/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 인증 관련 페이지
│   │   ├── (mainLayout)/      # 메인 레이아웃
│   │   ├── (minimalLayout)/   # 최소 레이아웃
│   │   └── (subLayout)/       # 서브 레이아웃
│   ├── components/             # UI 컴포넌트
│   │   ├── ui/               # 기본 UI 컴포넌트
│   │   ├── auction/          # 경매 관련 컴포넌트
│   │   ├── product/          # 상품 관련 컴포넌트
│   │   └── chat/             # 채팅 관련 컴포넌트
│   ├── actions/               # Server Actions
│   │   ├── auction-service/   # 경매 서비스
│   │   ├── product-service/   # 상품 서비스
│   │   └── chat-service/      # 채팅 서비스
│   ├── stores/                # 상태 관리
│   │   ├── auction/          # 경매 상태
│   │   └── use-register-store.ts
│   ├── hooks/                 # 커스텀 훅
│   ├── types/                 # TypeScript 타입
│   ├── utils/                 # 유틸리티 함수
│   └── libs/                  # 라이브러리 설정
├── public/                    # 정적 파일
└── package.json
```

## 🚀 개발 가이드

### 환경 설정

```bash
# 저장소 클론
git clone https://github.com/your-username/chalnack.git
cd chalnack

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트 검사
npm run lint
```

### 주요 스크립트

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 실행
npm run lint         # ESLint 검사
npm run format       # Prettier 포맷팅
npm run commit       # 커밋 메시지 생성
```

### 개발 규칙

#### 1. 파일 네이밍

- **컴포넌트**: PascalCase (`AuctionCard.tsx`)
- **훅**: kebab-case (`use-auction-submit.ts`)
- **유틸리티**: kebab-case (`auction-utils.ts`)

#### 2. 폴더 구조

- **도메인별 분리**: `auction/`, `product/`, `chat/`
- **Colocation 패턴**: 관련 파일들을 함께 배치
- **공통 컴포넌트**: `components/ui/`에 배치

#### 3. 상태 관리

- **Zustand**: 전역 상태 관리
- **React Query**: 서버 상태 관리
- **도메인별 분리**: 각 도메인별로 스토어 분리

## 🏗️ 아키텍처

### 시스템 아키텍처

<img alt="아키텍처 구조도" src="https://github.com/user-attachments/assets/099067f2-3c46-4be9-b814-d57091518c11">

### CI/CD 파이프라인

<img alt="CICD" src="https://github.com/user-attachments/assets/cca034b9-3596-4739-a9dc-57de3c8a0fc4">

### 데이터 모델링

| ![이벤트 스토밍](https://github.com/user-attachments/assets/8c57322d-e87d-4f80-b022-3634aeb4a53d) | ![ERD](https://github.com/user-attachments/assets/4bfeac59-cb79-4a63-94f5-b8df6c4d7033) |
| :-----------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------: |
|                                           이벤트 스토밍                                           |                                           ERD                                           |

## 👥 팀 멤버

|   **Name**   |                 김호철                  |                   추지우                    |                배부승                 |                박자겸                 |               김민조                |
| :----------: | :-------------------------------------: | :-----------------------------------------: | :-----------------------------------: | :-----------------------------------: | :---------------------------------: |
| **Position** |           팀장<br/>프론트엔드           |              백엔드<br/>인프라              |                백엔드                 |                백엔드                 |               백엔드                |
|   **Git**    | [HoChoRoo](https://github.com/HoChoRoo) | [chuman0216](https://github.com/chuman0216) | [bugling](https://github.com/bugling) | [pjg3335](https://github.com/pjg3335) | [Mongjo](https://github.com/Mongjo) |

## 🎯 주요 기능

### 1. 실시간 경매 시스템

- 실시간 입찰 및 낙찰
- 입찰 히스토리 추적
- 자동 낙찰 시스템

### 2. WebSocket 채팅

- 실시간 메시지 전송
- 읽음 처리 기능
- 채팅방 관리

### 3. SSE 알림

- 실시간 이벤트 알림
- 입찰, 낙찰, 채팅 알림

### 4. 이미지 관리

- S3 기반 이미지 업로드
- 이미지 최적화
- 드래그 앤 드롭 업로드

### 5. 검색 시스템

- Elasticsearch 기반 검색
- 필터링 및 정렬
- 무한 스크롤

## 📱 화면 구성

|   ![상품 등록](https://github.com/user-attachments/assets/a51a141c-e2e1-419c-9ed0-d1d67d9ef9fe)    |   ![경매 목록](https://github.com/user-attachments/assets/5a857724-ae41-440f-9169-5677c81bbd5c)   |  ![입찰하기](https://github.com/user-attachments/assets/04a1f1ba-7987-4518-87fa-82ee9472348f)   |
| :------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: |
|                                             상품 등록                                              |                                             경매 목록                                             |                                            입찰하기                                             |
| ![사용자 친화 UX](https://github.com/user-attachments/assets/29b3067c-471f-476d-991c-00735716689a) | ![채팅 읽음처리](https://github.com/user-attachments/assets/5324626c-9021-4d47-abac-973027f9f822) | ![채팅방 목록](https://github.com/user-attachments/assets/48b60072-4e24-479e-a0b0-31dceb7ad9dc) |
|                                           사용자 친화 UX                                           |                                           채팅 읽음처리                                           |                                           채팅방 목록                                           |

## 💡 개발 후기

### 🐚 배부승 (백엔드)

> 이번 프로젝트에서 스프링 부트 기반의 MSA 구조를 설계하면서 멤버, 카테고리, 태그 도메인을 분리하고 각 서비스 간의 이벤트 흐름을 카프카로 연결하는 구조를 경험했습니다. MSA가 처음이었지만, 팀원들과 도메인 경계를 계속 고민하고 조율하면서 분산 시스템에서의 책임 분리를 체감할 수 있었던 시간이었습니다.

### 🪸 추지우 (인프라)

> 인프라를 맡아 쿠버네티스, 헬름, 테라폼, Kong API Gateway를 실제로 구성해보며 클라우드 네이티브 환경에 대한 이해를 높일 수 있었습니다. 모니터링과 로깅은 아쉬움이 많이 남지만, 그만큼 운영 관점에서 어떤 준비가 필요한지도 느낄 수 있었습니다.

### 🪼 김호철 (프론트엔드)

> Next.js의 서버사이드 렌더링, zustand 상태관리, UX 중심의 애니메이션 처리 등을 프론트엔드에서 시도해 보며, 사용자 경험을 고려한 개발이 얼마나 중요한지 다시 한번 느낄 수 있었습니다. 프론트 개발은 기능 구현 뿐 아니라 디테일에서 완성도가 갈린다는 걸 체감했습니다.

### 🐳 박자겸 (백엔드)

> 이번 프로젝트에서 카프카 기반의 메시지 처리, 디비지움 CDC, 그리고 서비스 간의 정합성과 동시성 처리에 특히 집중했습니다. 이벤트 중심 아키텍처를 설계하면서 메시지 순서 보장, 중복 처리 등의 문제를 실제로 경험하고 해결해가는 과정이 인상 깊었습니다.

### 🦭 김민조 (백엔드)

> 실시간 채팅 서비스 구현, WebSocket + Redis Pub/Sub 구조 설계를 맡으며 사용자의 실시간 경험을 어떻게 설계하고 구성할지 깊이 고민할 수 있었습니다. 메시지 유실, 중복 처리, 세션 관리 등 실제 서비스에서 발생할 수 있는 문제들을 직접 경험하고 해결해가며 많은 성장을 느꼈습니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

<p align="center">
  <strong>거래를 가치롭게! 찰낙찰낙 🐟</strong>
</p>
