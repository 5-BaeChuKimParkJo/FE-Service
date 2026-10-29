# 찰낙찰낙 · 경매 포트폴리오

중고 경매 플랫폼의 고객 웹이다. 2025년 팀 프로젝트를 기반으로 경매·입찰·검색·
낙찰자 테스트 결제를 중심으로 홈랩 배포와 운영 기능을 정리했다.

기준일: 2026-10-30. 현재 구성의 설명은 아래 문서에서 시작한다.

| 읽는 순서                                             | 내용                                                                 |
| ----------------------------------------------------- | -------------------------------------------------------------------- |
| [1. 아키텍처](docs/portfolio/architecture.md)         | N100·Oracle 배치, 서비스 책임, 이벤트·결제·GitOps 흐름과 선택의 이유 |
| [2. 체험 순서](docs/portfolio/demo-guide.md)          | 비회원 조회 → 체험 로그인 → 입찰 → 조건에 맞는 낙찰자 테스트 결제    |
| [3. 검증 근거](docs/portfolio/verification.md)        | 커밋·CI·DB 동시성 테스트·운영 관찰 결과와 한계                       |
| [팀 프로젝트 원본](docs/history/team-project-2025.md) | 당시 소개·팀원·기여·기술 구성 보존                                   |

## 현재 체험할 수 있는 기능

- 로그인 없는 경매 탐색·검색·상세와 최근 24시간 인기 경매 TOP 10.
- 버튼으로 체험 계정 로그인, 입찰 저장 결과 확인.
- 계정별 [관심 경매](docs/saved-auctions.md) 저장과 마이페이지 목록·20개 단위 조회.
- 종료된 경매의 낙찰자 전용 Toss 테스트 결제와 상태 확인.
- MinIO 이미지 업로드·조회, 프로필 수정과 기본 `penguins.svg`.
- 별도 관리자 웹의 경매·입찰·결제·관리 이력과 운영 개요.
- 서버의 5분 주기 활성 데모 보충. 기존 입찰·결제는 초기화하지 않는다.

현재 홈랩은 채팅·SSE 알림·상품 서비스를 배포하지 않는다. 입찰 성공은 저장
내역으로 확인하고, 검색 반영은 비동기다. 관리자는 5분·30분·24시간 데모를 생성할 수
있으며 짧은 데모는 생성 직후 시작한다. 자동 보충 데모는 23~24시간 후 종료한다.
정산·실배송·실결제는 제공하지 않는다.

## 저장소와 배포

`FE-Service`는 Next.js / React / TypeScript 고객 웹이고 실행 이름은 `frontend`다.
이미지는 `ghcr.io/5-baechukimparkjo/fe-service:<commit-sha>`로 게시한다.
소스 main의 검증·빌드 후 Image Updater가 GitOps 태그를 변경하고 Argo CD가 적용한다.

- 계정·인증: [member-service → account-service](https://github.com/5-BaeChuKimParkJo/member-service)
- 경매·결제: [node-service → auction-service](https://github.com/5-BaeChuKimParkJo/node-service)
- 검색: [search-service](https://github.com/5-BaeChuKimParkJo/search-service)
- 관리자 BFF·웹: [chalnak-admin](https://github.com/5-BaeChuKimParkJo/chalnak-admin)
- 배포·운영: [cncn_private](https://github.com/chuman0216/cncn_private) — 비공개, 접근 권한 필요

고객 웹은 운영자가 안내한 NPM 도메인 또는 허용된 Tailnet 경로로 접속한다.
DB·관리 콘솔 주소와 운영 계정은 공개 문서에 넣지 않는다.

## 로컬 실행

Node.js 22와 pnpm을 사용한다. pnpm 버전은 `package.json`의
`packageManager`(`10.34.6`)를 따른다. 아래는 이 저장소 루트에서 실행한다.

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

기본 화면은 [localhost:3000](http://localhost:3000)이다. `.env.local`에
`API_URL`을 로컬에서 접근 가능한 Kong 주소로 설정한다. 브라우저용 주소가
필요하면 `NEXT_PUBLIC_API_URL`을 별도로 설정한다. 로컬 HTTP 쿠키에는
`COOKIE_SECURE=false`, 홈랩 체험 표시는 `NEXT_PUBLIC_DEPLOYMENT_MODE=homelab`을 사용한다.
이 설정은 공개 HTTPS 환경의 쿠키 정책과 구분한다.

체험 로그인 버튼은 서버에 `DEMO_MEMBER_ID`와 `DEMO_MEMBER_PASSWORD`가 설정됐을 때만
나온다. 값은 운영자에게 별도로 전달받고 `NEXT_PUBLIC_*` 변수나 Git에 넣지 않는다.
프론트만 띄워도 로컬 DB나 API가 자동으로 생성되지는 않는다.

## 검증과 기여

```powershell
pnpm test:conventions
pnpm check:conventions
pnpm test
pnpm typecheck
pnpm build
```

상세 환경과 검증 범위는 [검증 문서](docs/portfolio/verification.md),
코드·커밋 규칙은 [CONTRIBUTING.md](CONTRIBUTING.md)를 따른다.
