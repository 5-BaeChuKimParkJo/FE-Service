# 구매자·판매자 체험 모드

홈과 로그인 화면에서 구매자 또는 판매자 체험 계정을 선택한다. 판매자는 별도 일반
회원이며 로그인 후 **내 경매**(`/mypage/sales`)로 이동한다. 기존 경매의 체험 버튼은
구매자로 로그인하고 원래 경매로 돌아오는 동작을 유지한다.

두 선택은 서버가 보관한 서로 다른 자격 증명을 기존 정상 signIn API에 전달한다.
임의 ID·비밀번호·관리자 역할을 클라이언트에서 지정할 수 없다. 판매자 설정이 없거나
구매자와 같으면 판매자로 로그인하지 않으며 구매자로 대체하지 않는다. action 결과는
`{ok:true}`뿐이고 실패 문구는 고정된다. 옵션 props에는 공개 역할·라벨·이동 경로만 보낸다.
버튼 준비/진행 상태와 공유 잠금으로 빠른 중복·교차 클릭에도 인증을 하나만 진행한다.
성공 후 문서 탐색으로 바뀐 계정의 화면을 새로 읽는다. 두 계정은 공유 체험용이다.

판매자 샘플은 비공개 GitOps의 운영 스크립트가 정상 가입·이미지 업로드·경매 생성 API로
준비한다. 로그인은 데이터를 생성하지 않는다. 준비 직후 대기·진행·종료가 하나씩이며
상태는 실제 시각에 따라 바뀐다. 샘플의 일정·입찰·결제를 자동 초기화하지 않는다.
스크립트는 본인 목록에 동일 샘플이 있으면 건너뛰며 원본 이미지와 이력을 보존한다.

## 검증 · 2026-10-31

새 역할/가용성/이동/비밀 값 차단을 포함한 프론트 단위120건, checker11·컨벤션·
typecheck·린트·프로덕션 빌드가 통과했다. 기존 Next lint deprecation 안내는 남아 있다.
실제 프로덕션 Next + 로컬 HTTP fixture로 데스크톱/모바일10건을 통과했다:
두 역할 선택·판매자 세 상태·구매자 소유권 분리·오류 재시도·교차 클릭1회 인증·
홈 진입·반복 로그인으로 샘플 증가 없음·기존 입찰 화면 복귀를 확인했다.
버튼 활성화 CSS 전환을 완료한 두 화면 캡처도 확인했다.

fixture의 검색 응답 필드와 Next route announcer에 겹친 alert 선택자를 바로잡았다.
같은 경매 URL로 돌아오는 비동기 로그인은 URL만 보지 않고 쿠키와 인증 후 화면까지
기다리도록 검증했다. 해당 수정은 fixture/선택자 수정이며 앱 인증을 완화하지 않았다.

운영 준비는 Python 테스트18건(신규15+기존 seed3), 식별자 테스트5건과 실제 계약·
Kustomize 렌더링으로 검증한다. 실제 계정·샘플 준비는 CI 단위 검증과 구분한다.

단일 정적 리뷰에서 상대 이미지 경로와 지연 생성 중복 위험을 발견해, 실패 테스트2건을
추가한 뒤 보완했다. 상대 경로는 루프백 API를 기준으로 다운로드한다. 생성 전에는
Secret에 미확정 제목을 저장하고, 응답 유실 후 행이 보이지 않으면 재요청을 중단한다.
실제 행이 확인되면 이어가며, 끝난 요청의 실패가 확인된 경우에만 운영자가 장벽을 해제한다.

미니PC의 정상 API로 별도 판매자와 샘플3개를 실제 준비했다. 본인 목록에서
waiting/active/ended 각각1개와 구매자 ID 분리를 확인했고, 같은 준비 명령을 다시
실행한 결과는 `created:0, skipped:3, uploads:0`이었다. 입찰·결제는 수행하지 않았다.

프론트 실행 이미지 `30dd911d02464959fa3a3fff034264ebeaf5b5af`의
[CI·GHCR 발행](https://github.com/5-BaeChuKimParkJo/FE-Service/actions/runs/41081305641),
[GitOps 구성 검사](https://github.com/chuman0216/cncn_private/actions/runs/41081292485),
[자동 이미지 변경 검사](https://github.com/chuman0216/cncn_private/actions/runs/41081933017)가
통과했다. 이미지 업데이터 커밋은 `839a5d2bd97d341091af6edc6f29e266541cb73a`다.
정확한 이미지 반영 후 frontend rollout 완료와 Argo CD `Synced / Healthy`를 확인했다.
선택적 판매자 Secret 참조 두 개도 실제 Deployment에서 확인했으며 값은 출력하지 않았다.

라이브 브라우저는 데스크톱1440×1000과 모바일390×844에서 구매자·판매자 정상 로그인,
판매자 샘플3개와 실제 이미지 로딩·대기/진행/종료1개씩, 가로 넘침 없음, 서로 다른 회원과
소유 목록 분리를 확인했다. 새 컨텍스트의 반복 판매자 로그인도 동일한 샘플3개를 유지했다.
입찰·결제·presigned 업로드 POST는0건이다. 브라우저 검사는 계정이나 경매를 생성하지 않았다.

접속: `http://100.116.209.29:30080/sign-in` → **판매자 체험 계정으로 시작하기**.
기존 Tailscale 접속 범위는 그대로 사용한다.

## 운영 판단과 범위

샘플은 실제 시간이 지나면 종료된다. 상태 고정·자동 초기화·보충을 추가하지 않았다.
같은 본인 제목은 건너뛰며 명시적 실행 시 soft delete된 샘플을 다시 만들 수 있다.
강제 종료 lock과 미확정 생성의 수동 복구, 중단된 새 업로드의 고아 객체는 운영 부담으로
남긴다. 기존 기록이나 원본은 지우지 않는다. 이 선택의 비용은 데모 상태 갱신과 복구·
객체 정리가 수동이라는 점이다.

기존 인증·암호화·공통 미디어 동작, 공유 계정 악용 정책, 임의의 특권 설정 교체는 이번
변경의 개선 범위에서 제외했다. 기존 정상 인증과 소유권 검사는 유지한다. 로컬 검증과
실제 준비·CI·배포·브라우저 검증은 작성자가 수행하며, 정적 리뷰가 독립 재실행한 결과로
표현하지 않는다.

## 로컬 브라우저 재현

운영 값을 복사하지 않고 fixture 전용 값으로 서버를 실행한다.

```powershell
$env:API_URL='http://127.0.0.1:34426'
$env:NEXT_PUBLIC_DEPLOYMENT_MODE='homelab'
$env:COOKIE_SECURE='false'
$env:DEMO_MEMBER_ID='fixturebuyer'
$env:DEMO_MEMBER_PASSWORD='buyer-fixture-password'
$env:DEMO_SELLER_MEMBER_ID='fixtureseller'
$env:DEMO_SELLER_MEMBER_PASSWORD='seller-fixture-password'
pnpm build
pnpm exec next start -p 34728 -H 127.0.0.1
```

다른 터미널:

```powershell
$env:E2E_BASE_URL='http://127.0.0.1:34728'
pnpm exec playwright test e2e/seller-demo.spec.ts --workers=1 --retries=0
```

[운영 준비 안내](https://github.com/chuman0216/cncn_private/blob/main/docs/runbooks/seller-demo.md)는
비공개 저장소 권한이 필요하다. 새 상시 서비스·백엔드 API·SMS 발송·입찰·결제 테스트나
데이터베이스 초기화는 이 기능의 준비에 필요하지 않다.
