<div align="center">

<img src="./public/images/logoimage.svg" alt="Nomadiq Logo" width="120" />

### AI 기반 몽골 여행 가이드 플랫폼


**국민대학교 2026 캡스톤 디자인 | 팀 81**

[📱 데모 보기](https://kookmin-sw.github.io/2026-capstone-81/) · [🐛 이슈 신고](https://github.com/kookmin-sw/2026-capstone-81/issues) · [📖 위키](https://github.com/kookmin-sw/2026-capstone-81/wiki)

</div>

---

## 📋 목차

1. [프로젝트 소개](#-프로젝트-소개)
2. [주요 기능](#-주요-기능)
3. [기술 스택](#-기술-스택)
4. [시스템 아키텍처](#-시스템-아키텍처)
5. [시작하기](#-시작하기)
6. [환경 변수 설정](#-환경-변수-설정)
7. [실행 방법](#-실행-방법)
8. [모바일 빌드 (Android)](#-모바일-빌드-android)
9. [테스트](#-테스트)
10. [프로젝트 구조](#-프로젝트-구조)
11. [팀 소개](#-팀-소개)

---

## 🗺 프로젝트 소개

**Nomadiq**는 몽골 여행을 계획하는 사람들을 위한 AI 통합 여행 가이드 플랫폼입니다.

기존 여행 앱이 단순 정보 나열에 그치는 반면, Nomadiq는 **Google Gemini 2.5 Flash** 기반 AI 챗봇과 **맞춤형 일정 자동 생성**, **인터랙티브 지도**, **커뮤니티 블로그**를 하나의 앱에서 제공합니다. 몽골어를 모르는 여행자도 현지에서 즉시 활용할 수 있는 실용적 기능을 중심으로 설계되었습니다.

Android 네이티브 앱(Capacitor), PWA, 데스크탑 웹을 **단일 코드베이스**로 지원하며, 한국어·영어·몽골어 3개 언어를 자동으로 감지하고 응답합니다.

> **팀 페이지:** https://kookmin-sw.github.io/capstone-2026-81/

---

## ✨ 주요 기능

### 🤖 AI 챗봇 "Nomadiq"

- **Google Gemini 2.5 Flash** 기반 몽골 여행 전문 챗봇
- 한국어 / 영어 / 몽골어 **자동 감지 및 응답**
- 대화 중 언급된 장소를 지도에 **실시간 자동 표시** (`[MAP_UPDATE]` 파싱)
- 택시 기사에게 보여줄 **몽골어 문장 즉석 생성**

### 🗓 AI 여행 플래너

- 여행 기간·관심사(자연, 문화, 음식, 액티비티, 사진, 역사)·출발 도시 입력
- Gemini가 **일별 상세 일정 JSON 자동 생성** (장소명, 이동 거리, 난이도, 준비물 포함)
- **Google Places API** 연동으로 일정 내 장소 사진 자동 삽입
- 탐색 페이지 특정 지역 선택 → 플래너로 **즉시 연동**

### 🏔 여행지 탐색

- 울란바토르, 고비 사막, 테를지, 홉스골 등 **12개 이상 지역** 수록
- 지역·카테고리(자연 / 문화 / 액티비티)별 **필터링**
- 아이막 선택 시 하위 지역 목록 **사이드바 표시**
- 상세 페이지: 평점, 소요 기간, 최적 시즌, 거리 정보 제공

### 🗺 인터랙티브 지도

- **Leaflet** 기반 지도에 여행지 마커 표시
- AI 챗봇 응답과 연동하여 실시간 지도 업데이트

### 📝 블로그 커뮤니티

- **Firebase Firestore** 기반 여행 후기 작성 / 조회
- 이미지 업로드 (Firebase Storage)
- 키워드 기반 **블로그 검색** 기능

### 🛠 여행 유틸리티

| 기능 | 설명 |
|------|------|
| 💰 예산 계산기 | 여행 일수·인원·스타일별 USD / KRW / MNT 예산 자동 계산 |
| 🎒 패킹 리스트 | 몽골 여행 필수 준비물 체크리스트 |
| 📖 문화 가이드 | 몽골 역사·풍습·음식·유목 생활 소개 |
| 🍽 레스토랑 정보 | 울란바토르 추천 식당 목록 |
| 🔖 저장함 | 관심 여행지 및 일정 저장 |

### 📱 플랫폼 지원

| 플랫폼 | 방식 |
|--------|------|
| 모바일 앱 (Android) | Capacitor → APK 빌드 |
| PWA | Service Worker + manifest (홈 화면 설치 지원) |
| 데스크탑 웹 | `window.innerWidth < 768` 기준 자동 전환 |
| 다국어 | 한국어 · 영어 · 몽골어 (`LangContext`) |
| 인증 | Firebase Auth (이메일 · Google 로그인) |

---

## 🛠 기술 스택

### Frontend

| 기술 | 버전 | 역할 |
|------|------|------|
| React | 18.3 | UI 프레임워크 |
| Vite | 5.4 | 빌드 도구 |
| TailwindCSS | 3.4 | 스타일링 |
| React Router | v6 | SPA 라우팅 |
| Leaflet / react-leaflet | 1.9 / 4.2 | 인터랙티브 지도 |
| Lucide React | 0.456 | 아이콘 |
| vite-plugin-pwa | 1.3 | PWA 지원 |

### Backend

| 기술 | 버전 | 역할 |
|------|------|------|
| Node.js + Express | 4.21 | REST API 서버 |
| @google/generative-ai | latest | Gemini SDK |
| dotenv | 16 | 환경 변수 관리 |
| cors | 2.8 | CORS 처리 |

### AI / 외부 API

| 서비스 | 사용 경로 | 역할 |
|--------|-----------|------|
| Google Gemini 2.5 Flash | 프론트엔드 직접 호출 | 챗봇, 여행 플래너 |
| Google Gemini 1.5 Flash | 백엔드 서버 경유 | 챗봇, 여행 플래너 (fallback) |
| Google Places API | 백엔드 서버 경유 | 여행 일정 장소 사진 자동 삽입 |

### Firebase (BaaS)

| 서비스 | 역할 |
|--------|------|
| Firestore | 블로그 글, 사용자 데이터 저장 |
| Authentication | 이메일 / Google 로그인 |
| Storage | 블로그 이미지 업로드 |

### 모바일 / 배포

| 기술 | 역할 |
|------|------|
| Capacitor | 웹앱 → Android APK 변환 |
| AWS Amplify | 프론트엔드 CI/CD 및 배포 |

### 테스트

| 기술 | 역할 |
|------|------|
| Vitest | 단위 테스트 프레임워크 |
| @testing-library/react | React 컴포넌트 테스트 |
| supertest | Express API 테스트 |
| fast-check | 속성 기반(Property-based) 테스트 |

---

## 🏗 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                          Client                             │
│         React + Vite  (Mobile / Desktop 자동 전환)           │
│                                                             │
│   ┌─────────────────────┐   ┌─────────────────────────┐    │
│   │   Gemini 2.5 Flash  │   │  Firebase (Auth / DB)   │    │
│   │   (직접 호출)        │   │  Firestore / Storage    │    │
│   └──────────┬──────────┘   └─────────────────────────┘    │
│              │                                              │
│              ▼                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │             Express Backend  (port 3001)             │  │
│   │                                                      │  │
│   │   POST /api/chat  ──►  Gemini 1.5 Flash              │  │
│   │   POST /api/plan  ──►  Gemini 1.5 Flash              │  │
│   │                    +  Google Places API              │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                             │
│                     AWS Amplify 배포                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 시작하기

### 사전 요구사항

- **Node.js** 18 이상
- **npm** 9 이상
- [Firebase 프로젝트](https://console.firebase.google.com/) 생성 완료
- [Google Gemini API 키](https://aistudio.google.com/app/apikey) 발급
- *(선택)* Google Maps / Places API 키

### 설치

```bash
# 1. 저장소 클론
git clone https://github.com/kookmin-sw/capstone-2026-81.git
cd capstone-2026-81

# 2. 프론트엔드 의존성 설치
npm install

# 3. 백엔드 의존성 설치
cd server && npm install && cd ..
```

---

## ⚙ 환경 변수 설정

### 프론트엔드 (`/.env`)

```env
# ── Firebase ──────────────────────────────────────────────
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# ── Google Gemini (프론트엔드 직접 호출) ───────────────────
VITE_GEMINI_API_KEY=your_gemini_api_key

# ── 앱 모드 강제 지정 (선택 — 기본값: 브라우저 너비 자동 감지) ─
# VITE_MODE=mobile
# VITE_MODE=desktop
```

### 백엔드 (`/server/.env`)

```env
# ── Google Gemini (서버 사이드) ────────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ── Google Maps / Places API (여행 일정 사진 삽입, 선택) ───
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# ── 서버 설정 ─────────────────────────────────────────────
PORT=3001

# ── CORS 허용 오리진 (쉼표로 여러 도메인 지정) ──────────────
ALLOWED_ORIGINS=http://localhost:5173
```

> **⚠ 주의:** `.env` 파일은 절대 Git에 커밋하지 마세요. `.gitignore`에 등록되어 있는지 반드시 확인하세요.

---

## ▶ 실행 방법

### 개발 모드

```bash
# 터미널 1 — 백엔드 서버 실행
cd server
npm run dev
# → http://localhost:3001

# 터미널 2 — 프론트엔드 실행 (브라우저 너비 기준 모드 자동 감지)
npm run dev
# → http://localhost:5173

# 모바일 모드 강제 실행
npm run dev:mobile   # → http://localhost:5173

# 데스크탑 모드 강제 실행
npm run dev:desktop  # → http://localhost:5174
```

### 프로덕션 빌드

```bash
# 프론트엔드 빌드
npm run build          # → dist/
npm run build:mobile   # → dist-mobile/
npm run build:desktop  # → dist-desktop/

# 빌드 결과 미리보기
npm run preview
```

---

## 📱 모바일 빌드 (Android)

Capacitor를 사용하여 Android APK를 빌드합니다.

> **사전 설치 필요:** Android Studio 및 Android SDK

```bash
# 1. 프론트엔드 프로덕션 빌드
npm run build

# 2. Capacitor 동기화
npx cap sync android

# 3. Android Studio에서 프로젝트 열기
npx cap open android

# 4. Android Studio에서 ▶ Run 버튼 클릭 또는 Build > Generate Signed APK
```

---

## 🧪 테스트

```bash
# 프론트엔드 단위 테스트 (Vitest)
npm test

# 백엔드 API 테스트 (supertest)
cd server && npm test
```

---

## 📁 프로젝트 구조

```
capstone-2026-81/
├── src/
│   ├── App.jsx                  # 라우팅 진입점 (모바일/데스크탑 분기)
│   ├── main.jsx                 # React 마운트 진입점
│   ├── firebase.js              # Firebase 초기화
│   ├── components/
│   │   ├── desktop/             # DesktopLayout, DesktopNav, ChatWidget
│   │   └── ...                  # 공통 컴포넌트
│   ├── pages/
│   │   ├── desktop/             # 데스크탑 전용 페이지 (12개)
│   │   ├── mobile/              # 모바일 전용 페이지 (7개)
│   │   └── ...                  # 공유 페이지
│   ├── context/
│   │   ├── AuthContext.jsx      # Firebase Auth 전역 상태
│   │   └── LangContext.jsx      # 다국어 전역 상태
│   ├── data/                    # 정적 데이터 (locations, restaurants, translations 등)
│   ├── hooks/
│   │   └── useViewport.js       # 뷰포트 감지 훅
│   ├── utils/
│   │   ├── gemini.js            # Gemini API 직접 호출 유틸
│   │   └── api.js               # 백엔드 서버 경유 API 호출 유틸
│   └── test/                    # 프론트엔드 테스트 파일
│
├── server/
│   ├── index.js                 # Express 서버 진입점
│   ├── config.js                # 서버 설정 (모델, 토큰, 시스템 프롬프트)
│   ├── services/
│   │   └── bedrock.js           # Gemini + Google Places 연동 서비스
│   ├── middleware/
│   │   ├── cors.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   └── __tests__/               # 백엔드 테스트 파일
│
├── public/
│   ├── images/                  # 여행지 정적 이미지
│   ├── manifest.json            # PWA 설정
│   └── sw.js                    # Service Worker
│
├── android/                     # Capacitor Android 프로젝트
├── capacitor.config.json        # Capacitor 설정
├── vite.config.js               # Vite 빌드 설정
├── tailwind.config.js           # TailwindCSS 설정
└── amplify.yml                  # AWS Amplify 배포 설정
```

---

## 👥 팀 소개

> 국민대학교 소프트웨어융합대학 2026 캡스톤 디자인 — 팀 81

| 학번 | 이름 | 역할 | 주요 담당 | GitHub |
|------|------|------|----------|--------|
| 20233121 | 헝거르졸 |Integration + DevOps| 시스템 통합 실행 관리 및 연동| [@Khongorzullll(https://github.com/Khongorzullll) |
| 20223579 | 노민 에르덴 | AI / Frontend | Gemini 챗봇 통합, 여행 플래너 | [@nomin27n](https://github.com/nomin27n) |
| 20213008 | 빌랙자르갈 | Frontend · UI/UX | React Native UI , AWS Amplify 배포 | [@bilgee1121([https://github.com/bilgee1121]) |
| 20223582 | 체벡수랭홀랑 | Map + Location Data | 지도 기능, 여행지 데이터 관리 | [@yerimlee224](https://github.com/yerimlee224) |
| 20233064 | 오토공체체그 | Backend + Aws Server | AWS/Render서버 구축, 데이터 관리 | [@Otgon88](https://github.com/Otgon88) |

---

<div align="center">

**© 2026 Nomadiq Team · 국민대학교 캡스톤 디자인**

[팀 페이지](https://kookmin-sw.github.io/capstone-2026-81/) · [GitHub](https://github.com/kookmin-sw/capstone-2026-81)

</div>
