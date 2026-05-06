# 홈페이지 제작 가이드 — SUNONE (주)썬원

## 프로젝트 개요
회사/브랜드 소개 홈페이지 + 관리자 CMS 세트.
동일한 구조로 여러 거래처 홈페이지를 반복 제작하는 것이 목적.

## 기술 스택
- HTML5 / CSS3 / Vanilla JS (단일 파일 구조 — css/js 폴더 없음)
- 외부 라이브러리 사용 금지 (Bootstrap, jQuery 등)
- 폰트: Google Fonts — Cormorant Garamond (제목), Sora (본문), + Noto Sans/Serif KR, Black Han Sans, Gowun Dodum
- 아이콘: Unicode 기호 사용
- 로컬 서버: server.js (Node.js http 모듈, port 3000)

## 파일 구조
```
home_page/
├── index.html          ← 메인 홈페이지
├── admin.html          ← 회사정보·디자인·텍스트 관리자
├── product_admin.html  ← 제품 관리자 (products.json 저장)
├── company.json        ← admin.html 저장 데이터 (base64 이미지 포함, 6MB+)
├── products.json       ← product_admin.html 저장 데이터
├── server.js           ← 로컬 정적 서버 + /api/save, /api/save-products
└── CLAUDE.md
```

## 페이지 섹션 순서 (index.html)
1. Header     — 로고 + 네비게이션 (상단 고정)
2. Hero       — 메인 배너 (풀스크린)
3. Stats Bar  — 실적 숫자 카운트 애니메이션
4. About      — 회사 소개 + 태그
5. Technology — 비교 테이블 + 3포인트 (배경: --bg-tech)
6. Products   — 제품 카드 4개 (결제/상세 모달)
7. Evidence   — 실증 성과
8. Partners   — 글로벌 파트너십
9. Timeline   — 성장 여정
10. Contact   — 연락처 폼 (배경: --bg-contact)
11. Footer    — 회사정보 테이블 + 로고

## CSS 변수 (:root)
```css
--font-heading: 'Cormorant Garamond', serif;   /* 제목 폰트 — 어드민 변경 가능 */
--font-body:    'Sora', sans-serif;             /* 본문 폰트 — 어드민 변경 가능 */
--size-section-title: clamp(34px, 4vw, 52px);  /* 섹션 제목 크기 — 어드민 슬라이더 */
--size-section-desc:  16px;                    /* 본문 크기 — 어드민 슬라이더 */
--bg-tech:     #232a3d;   /* Technology 섹션 배경 — 어드민 색상 피커 */
--bg-contact:  #367a4d;   /* Contact 섹션 배경 — 어드민 색상 피커 */
--green-deep:  #0f2e1a;   /* 메인 컬러 — 어드민 색상 피커 */
--green-vivid: #5dbf78;   /* 보조 컬러 — 어드민 색상 피커 */
--cream:       #f4f0e8;
--text-dark:   #1a2018;
```

## 이미지 시스템 (두 가지 병렬 운영)

### 1. company.json 이미지 (admin.html 관리)
| 키 | 용도 | index.html element ID |
|----|------|-----------------------|
| 로고 | 헤더 로고 | logo-img |
| 메인배너 | Hero 배경 | hero-bg (backgroundImage) |
| 회사소개이미지 | About 섹션 | about-img |
| 제품1이미지 | 제품카드 1 | product-img-1 |
| 제품2이미지 | 제품카드 2 | product-img-2 |
| 제품3이미지 | 제품카드 3 | product-img-3 |
| 제품4이미지 | 제품카드 4 | product-img-4 |

### 2. products.json 이미지 (product_admin.html 관리)
- `thumbImage` — 제품 카드 썸네일 (loadProductsData()가 나중에 실행되므로 우선 적용)
- `detailImages[]` — 상세 모달 이미지

**우선순위:** loadProductsData() > loadCompanyData() (나중에 실행된 값이 덮어씀)
**이미지 표시 방식:** 기본 `display:none`, 데이터 있을 때 `display:block`으로 전환

## admin.html — FIELDS 맵 (company.json 키)
```
회사명, 대표자, 사업자번호, 전화번호, 주소, 이메일
메인컬러, 보조컬러, 기술배경색, 연락처배경색
폰트제목, 폰트본문, 제목크기, 본문크기   ← collectData()에서 별도 수집
히어로배지, 히어로타이틀1, 히어로타이틀2, 히어로부제, 히어로본문
어바웃라벨, 어바웃제목, 어바웃본문, 어바웃태그1~6
대표자인사말제목, 대표자인사말내용
카카오, 인스타그램, 유튜브, 네이버블로그
```
- 색상 필드: `collectData()`에서 hex input 값 수집, `fillForm()`에서 picker·preview 동기화 필요
- 폰트/크기 필드: select·range 타입이라 FIELDS 맵 외부에서 별도 처리

## admin.html — 카드 섹션 목록 (사이드바 data-section)
| data-section | card id | 내용 |
|---|---|---|
| basic | section-basic | 기본 회사정보 |
| design | section-design | 색상 피커 4개 |
| typo | section-typo | 폰트 선택 + 크기 슬라이더 |
| images | section-images | 이미지 업로드 존 |
| hero | section-hero | 히어로 문구 |
| about | section-about | About 섹션 텍스트 + 태그 |
| greeting | section-greeting | 대표자 인사말 |
| sns | section-sns | SNS 링크 |

## loadCompanyData() 적용 순서 (index.html)
1. CSS 변수: 색상 4개, 폰트 2개, 크기 2개
2. 연락처·푸터 텍스트 필드
3. 히어로 텍스트 (toHtml로 [강조] → `<em>` 변환)
4. About 섹션 텍스트 + 태그
5. 히어로 배너 이미지
6. imgMap 이미지 (display:none → display:block)

## 강조 텍스트 규칙
어드민 입력 시 `[단어]` 형식으로 감싸면 `<em>단어</em>`으로 변환되어 녹색 표시.
적용 필드: 히어로타이틀1, 히어로타이틀2, 어바웃제목

## 반응형 기준
- 모바일: 375px 이하
- 태블릿: 768px
- 데스크탑: 1200px

## 코드 규칙
- CSS 변수 사용 (위 목록 참고)
- class명: kebab-case
- 주석: 한국어로 섹션 구분
- 인라인 스타일 사용 금지 (`!important` 금지)
- 새 어드민 필드 추가 시: FIELDS 맵 → admin.html 입력 UI → index.html ID → loadCompanyData() 적용 4단계 필수

## 백업 규칙
폴더명: `home_page_backup_YYYYMMDD_설명`
위치: `/c/Users/kyuki/Dropbox/TEMP/sunone/`
현재 백업:
- `home_page_backup_20260419_1853` — 초기 CMS 완성 버전
- `home_page_backup_20260420_typo` — 타이포그래피 + About 어드민 연동 추가

## 금지 사항
- 외부 CDN 라이브러리 무단 추가 금지
- 하드코딩 이미지 URL 사용 금지 (모두 어드민 경유)
- 다른 섹션 건드리지 말고 요청한 부분만 수정
- 완료 전 확인 없이 파일 덮어쓰기 금지
- company.json 직접 편집 금지 (6MB+ base64 이미지 포함)

## 새 프로젝트 시작 명령어
"/new-homepage 회사명, 업종, 메인컬러" 형식으로 요청
예: /new-homepage 태비파트너스, 건강식품, #2e7d32
