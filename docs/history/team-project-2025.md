# 찰낙찰낙 🐟

<p align="center">
  <img alt="로고" src="https://github.com/user-attachments/assets/c0d2e3cc-fcda-404d-a773-b5e312913161" width="250" height="250">
</p>

<p align="center">
  <strong>중고 거래의 새로운 방식을 제시하는 경매 플랫폼</strong>
</p>

## 📋 프로젝트 개요

<br/>

| 항목           | 내용                                            |
| -------------- | ----------------------------------------------- |
| **프로젝트명** | 찰낙찰낙                                        |
| **팀명**       | 스파로스 6기 배추김박조                         |
| **기간**       | 2025.05.06 ~ 2025.07.15                         |
| **목표**       | 중고 물품을 경매 방식으로 거래할 수 있는 플랫폼 |

### 경매형 중고거래 플랫폼 찰낙찰낙

<br/>

📱 **가격 책정의 고민**: 물건을 저렴하게 등록했다가 금방 팔려버려 적정 가격을 놓치는 아쉬움

⏰ **선착순의 한계**: 이미 판매된 상품을 더 높은 가격에도 구매하고 싶지만 기존 서비스의 선착순 구조로 인한 기회 상실

💔 **거래 기회의 아쉬움**: 판매자는 더 높은 가격에 팔 수 있었을 기회를, 구매자는 원하는 상품을 놓치는 상호 아쉬움 발생

이러한 문제를 해결하기 위해, 경매 시스템을 도입한 중고거래 플랫폼을 기획했습니다!

입찰 경쟁을 통해 판매자와 구매자 모두가 원하는 가격에 만족스러운 거래를 할 수 있는 환경을 제공하는 것이 이 서비스의 핵심 목표입니다. 🌟

### 프로젝트 멤버

|   **Name**   |                 김호철                  |                   추지우                    |                배부승                 |                박자겸                 |               김민조                |
| :----------: | :-------------------------------------: | :-----------------------------------------: | :-----------------------------------: | :-----------------------------------: | :---------------------------------: |
| **Position** |          팀장 <br/> 프론트엔드          |              백엔드<br>인프라               |                백엔드                 |                백엔드                 |               백엔드                |
|   **Git**    | [HoChoRoo](https://github.com/HoChoRoo) | [chuman0216](https://github.com/chuman0216) | [bugling](https://github.com/bugling) | [pjg3335](https://github.com/pjg3335) | [Mongjo](https://github.com/Mongjo) |

<br/>

## 🎯 전체 프로젝트 주요 기능

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

- S3 PresignedURL 기반 이미지 업로드
- 이미지 최적화
- 드래그 앤 드롭 , 멀티 업로드, 이미지 미리보기

### 5. 검색 시스템

- Elasticsearch 기반 검색
- 필터링 및 정렬
- 무한 스크롤

## 👨‍💻 FE 주요 구현사항

### 🔥 실시간 경매 입찰

- 대용량 동시 입찰 처리를 가정해 단순 API 요청/응답 방식이 아니라, **SSE(Server-Sent Events)** 활용
- 이벤트 기반 실시간 입찰 결과 처리 및 **커스텀 예외처리** 구현
- 이를 통해 많은 사용자가 동시에 입찰해도 빠르고 안정적으로 각 사용자에게 **개별 결과가 실시간으로 전달**

### 💬 실시간 채팅의 낙관적 UI

- 서버 응답 대기 없이 사용자 입력을 **즉시 UI에 반영하는 Optimistic UI** 적용
- 메시지 **재전송, 삭제 기능**을 통한 사용자 경험 최적화

### 🎨 UI/UX 디테일

#### 에러 처리 및 안정성

- 에러 상황 발생 시 페이지별 `error.tsx`를 통한 **사용자 친화적 에러 페이지** 제공
- **MSA 환경**을 고려해 부분 컴포넌트 오류 시 해당 영역만 에러 UI로 대체하고 나머지 기능은 **정상 렌더링 및 동작**

#### 인터랙션 향상

- `template.tsx`를 통해 공통 레이아웃 관리와 페이지 전환 시 **SSR 유지하며 애니메이션 효과 적용**
- **Framer Motion**을 활용해 인터랙션에 자연스러운 애니메이션 추가
- **dnd-kit** 기반 직관적인 드래그앤드롭 기능 구현
- loading.tsx와 스켈레톤 컴포넌트를 적용 UX 고려
- 전체적으로 **부드럽고 완성도 높은 사용자 경험** 제공하려 노력
- 스탭퍼 기법을 적용해 회원가입, 상품 등록시 **복잡한 과정을 여러 단계로 분할**하여 UX 개선

### ⚡ 성능 최적화 고려

- 입력 지연이나 불필요한 렌더링을 막기 위해 **디바운스와 쓰로틀링**을 적극 활용
- Memoization을 위해 **React.memo, useMemo, useCallback** 적극 활용
- 서버 컴포넌트를 기본적으로 사용, 사용자 인터랙션이나 실시간 데이터 업데이트가 필요한 부분만 클라이언트 컴포넌트를 적용한 **하이브리드 렌더링** 전략

## 🛠️ 기술 스택

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white)
![React Query](https://img.shields.io/badge/React%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![DND Kit](https://img.shields.io/badge/DND%20Kit-000000?style=for-the-badge&logo=typescript&logoColor=white)
![Swiper](https://img.shields.io/badge/Swiper-6332F6?style=for-the-badge&logo=swiper&logoColor=white)
![Date-fns](https://img.shields.io/badge/Date--fns-6C7C7C?style=for-the-badge&logo=javascript&logoColor=white)

### Backend

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![fp-ts](https://img.shields.io/badge/fp--ts-8C52FF?style=for-the-badge&logo=fp-ts&logoColor=white)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/SpringSecurity-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![Spring Batch](https://img.shields.io/badge/SpringBatch-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-000000?style=for-the-badge&logo=websocket&logoColor=white)
![Stomp](https://img.shields.io/badge/Stomp-000000?style=for-the-badge&logo=apache&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
![QueryDSL](https://img.shields.io/badge/QueryDSL-0088CC?style=for-the-badge&logoColor=white)

### Database & Cache

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)

### Infrastructure

![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![AWS EC2](https://img.shields.io/badge/AWS%20EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![AWS EKS](https://img.shields.io/badge/AWS%20EKS-FF9900?style=for-the-badge&logo=amazoneks&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-277A9F?style=for-the-badge&logo=helm&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![ArgoCD](https://img.shields.io/badge/ArgoCD-EF7B4D?style=for-the-badge&logo=argo&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Kibana](https://img.shields.io/badge/Kibana-005571?style=for-the-badge&logo=kibana&logoColor=white)
![Kong](https://img.shields.io/badge/Kong-002659?style=for-the-badge&logo=kong&logoColor=white)
![Debezium](https://img.shields.io/badge/Debezium-000000?style=for-the-badge&logo=apachekafka&logoColor=white)

## 📁 FE 프로젝트 구조

```
chalnack/
├── src/
│   ├── actions/               # Server Actions
│   ├── app/                   # Next.js App Router
│   ├── components/            # UI 컴포넌트
│   ├── hooks/                 # 커스텀 훅
│   ├── stores/                # 상태 관리
│   ├── types/                 # 타입
│   └── utils/                 # 유틸리티 함수
├── public/                    # 정적 파일
├── package.json
├── next.config.js
└── tsconfig.json
```

## 🚀 개발 가이드

### 환경 설정

```bash
# 저장소 클론
git clone https://github.com/5-BaeChuKimParkJo/FE-Service.git
cd chalnack

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 린트 검사
pnpm lint

# 코드 포맷팅
pnpm format
```

### 주요 스크립트

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버 실행
pnpm lint         # ESLint 검사
pnpm format       # Prettier 포맷팅
pnpm commit       # 커밋 메시지 작성
```

## 🏗️ 아키텍처

### 시스템 아키텍처

<img alt="아키텍처 구조도" src="https://github.com/user-attachments/assets/099067f2-3c46-4be9-b814-d57091518c11">

### CI/CD 파이프라인

<img alt="CICD" src="https://github.com/user-attachments/assets/cca034b9-3596-4739-a9dc-57de3c8a0fc4">

### 데이터 모델링

| ![이벤트 스토밍](https://github.com/user-attachments/assets/8c57322d-e87d-4f80-b022-3634aeb4a53d) | ![ERD](https://github.com/user-attachments/assets/4bfeac59-cb79-4a63-94f5-b8df6c4d7033) |
| :-----------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------: |
|                                           이벤트 스토밍                                           |                                           ERD                                           |

## 4. 기능소개

### 🦀 화면별 기능 소개

#### 1. 회원가입 및 로그인

| <img src="https://github.com/user-attachments/assets/796508f4-cbfe-44c1-ac29-f6d1ec220da4" width="250"> | <img src="https://github.com/user-attachments/assets/a35be998-e50f-4af4-8f12-d1f0e8a58d16" width="250"> |
| :-----------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|                                                회원가입                                                 |                                                 로그인                                                  |

#### 2. 경매 시스템

| <img src="https://github.com/user-attachments/assets/a51a141c-e2e1-419c-9ed0-d1d67d9ef9fe" width="250"> | <img src="https://github.com/user-attachments/assets/04a1f1ba-7987-4518-87fa-82ee9472348f" width="250"> | <img src="https://github.com/user-attachments/assets/71965e34-e517-4d66-b6af-68ee4c42c113" width="250"> |
| :-----------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|                                                경매 등록                                                |                                               실시간 입찰                                               |                                            실시간 입찰 실패                                             |

#### 3. 실시간 채팅

| <img src="https://github.com/user-attachments/assets/17179e07-0da0-4820-9261-432374771051" width="250"> | <img src="https://github.com/user-attachments/assets/9cc18c43-3892-4970-8dc0-15d10166ca02" width="250"> | <img src="https://github.com/user-attachments/assets/eeeb048a-b635-409c-9e47-5ecda41fec82" width="250"> |
| :-----------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|                                               채팅 송수신                                               |                                             채팅 전송 실패                                              |                                         채팅 전송 실패 처리 전                                          |

### 4. 검색

| <img src="https://github.com/user-attachments/assets/c0e3fb70-03bb-4683-9056-2bfd7a5efcbb" width="250"> | <img src="https://github.com/user-attachments/assets/375707e0-e7b0-4cf8-b023-fc3a2ab84ca0" width="250"> | <img src="https://github.com/user-attachments/assets/83d07063-8e6f-4975-905c-d90d32221051" width="250"> |
| :-----------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|                                               리스트 조회                                               |                                                 필터링                                                  |                                               키워드 검색                                               |

#### 4. UI/UX 디테일

| <img src="https://github.com/user-attachments/assets/edcbacdc-a96d-425a-a72a-bacb4cd3cfea" width="250"> | <img src="https://github.com/user-attachments/assets/0b3cc23e-7007-4cee-a6ad-c519d9ebc2db" width="250"> |
| :-----------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|                                      채팅 알림 및 리스트 업데이트                                       |                                          이미지 드래그 앤 드롭                                          |

## 👨‍💻 개발 회고

<br/>

### 📱 모바일 환경에서 이미지 순서 변경(드래그 앤 드롭)시 화면 끊김과 성능 저하

- **문제**

  - 웹에서는 마우스로 원활하게 작동하던 이미지 순서 변경 기능이, 모바일 터치 환경에서는 스크롤 동작과 계속 충돌. 사용자가 목록을 넘기려고 스와이프할 때마다 드래그가 활성화되어 의도치 않은 순서 변경이 발생하고 스크롤을 방해하는 등 문제가 발생.

- **원인**

  - 웹(마우스)의 '클릭 후 드래그'와 모바일(터치)의 '스와이프'는 근본적으로 다른 인터랙션. 단일 로직으로 이를 처리하려다 보니, 모바일 환경에서 사용자의 '스크롤' 의도와 '순서 변경' 의도를 구분하지 못하고 모든 터치 입력을 드래그 시도로 오인한 것이 원인.

- **해결**

  - 드래그 동작이 시작되는 조건을 세밀하게 제어.
  - 사용자가 300ms 이상 길게 누르고(delay), 15px 이상 손가락을 움직여야만(distance) 비로소 드래그 모드로 진입하도록 로직을 수정.
  - 모바일 터치 기능을 더욱 세밀하게 관리함으로써, 짧은 터치나 스와이프는 스크롤로, 길고 명확한 끌기 동작은 순서 변경으로 명확히 구분하여 두 기능의 충돌을 해결.

- **결론**
  - 단순히 기능이 작동한다고 끝나는 것이 아니라 다양한 환경에서 문제없이 작동되는지 확인하고 테스트하는 것이 중요.
  - 마우스 ‘클릭, 드래그’와 모바일의 ‘터치, 스와이프’의 차이점을 몸으로 명확히 이해.
  - delay와 distance를 적용함으로써 사용자의 암묵적인 의도를 인지하면서 UX 설계에 대한 고민을 하게 됨.

---

### ⏱️ 다수의 타이머로 인한 성능 저하, 글로벌 타이머 도입

- **문제**

  - 경매 상품 목록 페이지에서 남은 경매 시간에 대해 각 상품이 개별적인 setInterval 타이머를 소유.
  - 이로 인해 조회 상품 수만큼의 타이머가 동시 동작하며 성능 저하 유발.

- **원인**

  - '현재 시간'이라는 공유 자원을 각 컴포넌트가 독립적인 로컬 상태로 관리하면서, 컴포넌트 수(N)만큼의 불필요한 타이머가 생성.

- **해결**
  - 1차 해결 시도 및 한계:
    - 중앙화된 상태 관리를 위해 Context API를 사용해 단일 글로벌 타이머를 구현 → 각각의 상태에서 1개의 중앙화된 상태로 변경 확인.
    - React Developer Tools로 분석 시, React.memo로 자식 컴포넌트의 렌더링을 막아도 Context를 구독하는 부모 컴포넌트의 리렌더링은 막을 수 없음을 파악.
  - 최종 해결:
    - 컴포넌트가 스토어의 특정 상태만 선택적으로 구독하여 리렌더링을 최소화하기 위해 Zustand를 통해 글로벌 타이머 설정.
    - useTimerStore(state => state.now)와 같은 Selector를 활용하여, 오직 `now` 값이 변경될 때만 해당 컴포넌트가 반응하도록 구현.

---

### 💬 안 읽은 메시지 수 관리 및 정합성

- **문제**

  - 전역적으로 안 읽은 메시지 수를 나타내는데, 데이터의 신뢰성과 애플리케이션 성능에 대한 고민.
  - SSE로 메시지 수신 시마다 API를 호출 → 신뢰성은 높지만 불필요한 API 호출로 성능 저하 가능성.
  - 클라이언트 상태에서만 관리 → 성능 저하는 없지만 데이터 오염 가능성.

- **해결**

  - 낙관적 업데이트: SSE로 메시지 수신을 감지하였을 때 Zustand 스토어의 상태만 업데이트.
  - 전략적 동기화: 채팅방 퇴장 시, 새로고침 시 API 호출을 하며 API 호출 최소화.

- **결론**
  - API 호출 횟수를 줄이는 것, 그리고 프론트엔드에서 효율적으로 데이터의 일관성을 맞춰야 하는지에 대한 고민을 하였음.
  - 클라이언트 상태와 서버 상태를 분리하고, 최적의 동기화 시점을 설계하는 것이 성능과 안정성을 해결할 수 있음.

---

### ⏰ 경매가 끝나도 알림이 오지 않는 이슈 (서비스별 Timezone 불일치)

- **문제**

  - 경매가 정상적으로 종료되어도 사용자에게 경매 종료 알림이 발송되지 않음.
  - 알림 수신에 문제가 생긴 줄 알고 직접 알림을 보내도 알림은 잘 옴 but 경매 종료 알림만 안 옴.
  - 디버깅한 결과 알림 자체에는 문제가 없음을 알게 됨.

- **원인**

  - MSA 환경에서 Timezone 설정 불일치:
    - 경매 서비스와 알림 서비스가 서로 다른 시간대를 가짐.
    - 경매 서비스는 KST(Asia/Seoul), 알림 서비스는 따로 설정이 되어있지 않아서 UTC로 기본 설정됨.
    - 실제로는 9시간 차이로 알림을 받게 됨.

- **해결**

  - 백엔드 Timezone을 UTC로 통일.
  - 프론트에서는 UTC로 받은 시간을 date-fns를 통해 사용자에 맞춘 시간으로 변환하여 표시.

- **결론**
  - MSA 환경에서 시스템 전반으로 공통 컨벤션 통일 필수라고 느낌.

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

<p align="center">
  <strong>거래를 가치롭게! 찰낙찰낙 🐟</strong>
</p>
