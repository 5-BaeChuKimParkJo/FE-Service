# 검증 근거와 설명 범위

기준일: 2026-10-25. 각 결과는 특정 커밋에서 관찰한 기록이다.
이 문서 변경에서 전체 애플리케이션 테스트나 결제를 다시 실행한 것은 아니다.

## 자동 데모 보충 릴리스

대상: [node-service `9745d97`](https://github.com/5-BaeChuKimParkJo/node-service/commit/9745d97cc7fe19ad73c422f85cb5c493ad95623e).

| 근거                                                                                                | 결과                                                                   | 해석                                                  |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| [main CI / 이미지 게시](https://github.com/5-BaeChuKimParkJo/node-service/actions/runs/40190444655) | 성공                                                                   | Linux 검증 뒤 GHCR 이미지 게시                        |
| 단위 테스트                                                                                         | 313건 통과                                                             | 같은 실행에서 DB 전용 49건은 의도적으로 건너뜀        |
| 격리 PostgreSQL 테스트                                                                              | 49건 통과                                                              | 별도 CI DB에서 결제 복구·동시성 및 데모 트랜잭션 검증 |
| 정적 검사 / 빌드                                                                                    | checker 테스트 18건, naming·architecture·format, Nest 앱 4개 빌드 통과 | 빌드한 4개 앱 모두를 운영에 배포했다는 의미는 아님    |
| 독립 코드 리뷰                                                                                      | 지적 사항 없음                                                         | 잠금·원본 재검증·공개 입력·트랜잭션·설정 경계 검토    |
| 운영 21:00 KST 예약 실행                                                                            | 활성 데모 한 건 생성, Outbox 한 건                                     | 테스트에서 스케줄러를 수동 호출하지 않고 관찰         |
| 운영 21:05 KST 예약 실행                                                                            | `skipped-active`, 자식·활성 데모 각 한 건 유지                         | 다음 주기에 중복 생성하지 않음                        |
| 데이터 보존 / 검색                                                                                  | 원본 경매 필드·입찰 3건·기존 주문/결제 행 보존, 새 검색 문서 확인      | 이 관찰에서는 입찰·결제 제공자 호출 없음              |

격리 검증용 [별도 CI 실행](https://github.com/5-BaeChuKimParkJo/node-service/actions/runs/40189877345)도
실제 PostgreSQL 49건과 Linux Kafka 네이티브 바인딩 검사를 통과했다. 로컬 Windows에서
Kafka 네이티브 실행이나 운영 DB 테스트가 통과했다고 표현하지 않는다.

## 기존 낙찰·결제 시나리오

2026-10-18에는 별도의 승인된 테스트 경매에서 브라우저 입찰·낙찰자 주문 고정·Toss
테스트 승인·관리자 전액 취소를 검증했다. 결제 인증은 사용자가 직접 완료했고,
서버가 저장한 주문으로 고객·관리자 화면 상태를 대조했다. 당시 실행 기록은
[GitOps E2E 런북](https://github.com/chuman0216/cncn_private/blob/main/docs/runbooks/2026-10-18-auction-checkout-e2e.md)에
있다. 비공개 저장소라 열람 권한이 필요하며 주문·사용자 식별자를 외부 소개에 복제하지 않는다.

이 기록은 실제 금전 결제·정산 검증이나 모든 변경 이후 반복 실행한 E2E 보장이 아니다.
최신 화면·데이터의 체험 가능 조건은 [체험 안내](demo-guide.md)를 따른다.

## 재현할 수 있는 검사

아래 명령은 해당 저장소 루트에서 실행한다. 환경 변수와 의존 서비스는 별도 준비가 필요하다.

```bash
# FE-Service / Node.js 22, package.json의 pnpm 버전 사용
pnpm install --frozen-lockfile
pnpm test:conventions
pnpm check:conventions
pnpm test
pnpm typecheck
pnpm build
```

```bash
# node-service / Node.js 22, npm 10.9.4
npm ci
npm run prisma:auction-service:generate
npm run prisma:notification-consumer-service:generate
npm run test:checks
npm run check:naming
npm run check:architecture
npm run check:format
npm run test:unit
npm run build:all
```

`node-service`의 `npm run test:payment:integration`은 `TEST_DATABASE_URL`에 지정한
버려도 되는 loopback `_test` DB에서만 실행한다. 마이그레이션과 fixture 생성·정리를
포함하므로 운영/Tailscale DB를 지정하지 않는다. 로컬에 해당 DB가 없다면 CI의
격리 DB 결과를 사용한다. 기본 unit 실행의 DB skip을 DB 통과 건수로 합산하지 않는다.

Java 서비스는 각 저장소 `CONTRIBUTING.md`의 JDK 17·Gradle 검증 절차를 따른다.
이미지 빌드·배포 완료, Pod Ready, 서비스 기능 성공은 각각 별도로 확인한다.

## 포트폴리오에서 설명할 수 있는 것

- 서비스별 소스·이미지·실행 이름을 연결하고 GitOps 변경으로 배포를 추적한 과정.
- N100 앱과 Oracle 데이터 컨테이너의 배치, 유지보수 편의와 단일 장애 지점의 절충.
- 경매 원본과 검색 사본의 역할, Outbox와 비동기 전파의 정합성 경계.
- 주문 고정·멱등성 키·결과 미확정 상태의 결제 복구, 관리자 사유와 이력.
- 실제 단위·DB 동시성 테스트와 제한된 운영 관찰로 확인한 범위.

고부하 처리량, 무중단·무손실 보장, 자동 백업·재해 복구, Kafka 전체 경로 exactly-once,
서비스 메시 기반 mTLS, 실제 고객 매출·정산은 검증한 사실에 포함하지 않는다.

[아키텍처](architecture.md) · [체험 순서](demo-guide.md) · [README](../../README.md).
