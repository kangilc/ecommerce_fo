# Ecommerce Frontend (ecommerce_fo)

이 프로젝트는 Vite + React + TypeScript 기반의 이커머스 프론트엔드 애플리케이션입니다.

## 🚀 주요 기술 스택

- **Framework:** React 19
- **Build Tool:** Vite 8
- **Language:** TypeScript
- **Routing:** React Router Dom
- **HTTP Client:** Axios
- **Linting:** ESLint

## 📂 프로젝트 구조

애플리케이션은 확장성을 고려하여 다음과 같은 구조로 설계되었습니다.

```text
src/
├── api/             # API 통신 관련 로직 (Axios 인스턴스 및 서비스)
│   ├── client.ts    # Axios 공통 설정 (baseURL: /api)
│   └── auth.ts      # 인증 관련 API (회원가입 등)
├── pages/           # 페이지 단위 컴포넌트
│   └── Register/    # 사용자 등록(회원가입) 페이지
│       ├── RegisterPage.tsx
│       └── RegisterPage.css
├── types/           # TypeScript 인터페이스 및 타입 정의
│   └── auth.ts      # 인증 관련 타입
├── App.tsx          # 라우팅 설정 및 메인 레이아웃
└── main.tsx         # 애플리케이션 진입점
```

## ✨ 현재 구현된 기능

### 1. 사용자 등록 (Registration)
- **위치:** `/register`
- **기능:** 
  - 이메일, 사용자 이름, 비밀번호 입력 및 확인
  - 비밀번호 일치 여부 확인 로직 포함
  - 백엔드(`POST /api/users`) 연동을 통한 회원 정보 저장
  - 성공/실패에 따른 사용자 피드백(메시지) 표시

## ⚙️ 설정 및 백엔드 연동

### 백엔드 프록시 설정
개발 환경에서의 CORS 문제를 해결하기 위해 `vite.config.ts`에 프록시 설정이 되어 있습니다.
- **Backend URL:** `http://localhost:8081`
- **Proxy Path:** `/api` -> `http://localhost:8081/` (rewrite 적용)

### 개발 서버 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 🛠 향후 계획
- [ ] 로그인 기능 구현
- [ ] 상품 목록 및 상세 페이지
- [ ] 장바구니 및 주문 기능
- [ ] 전역 상태 관리 (Redux or Context API) 도입

---
이 프로젝트는 백엔드 `ecommerce_be`와 연동하여 동작합니다.
