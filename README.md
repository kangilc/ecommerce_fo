#  react로 front end
  1. 기술 스택 추천
  현대적인 웹 개발 표준과 유지보수성을 고려한 추천 조합입니다.

   * Framework: React (with Vite - 속도가 빠르고 설정이 간편함)
   * Language: TypeScript (백엔드의 엔티티/DTO 구조와 타입을 맞추기 위해 필수적)
   * Styling: Vanilla CSS 또는 Styled-components (개인 선호에 따라 선택)
   * State Management: TanStack Query (React Query) (백엔드 API 호출 및 캐싱 관리 최적화)
   * HTTP Client: Axios (인터셉터를 통한 공통 응답 처리에 유리)

  ---

  2. 프로젝트 초기화 (Vite 사용)
  터미널에서 다음 명령어로 프로젝트를 생성합니다.

   1 # 프로젝트 생성 (루트 디렉토리 또는 별도 폴더)
   2 npm create vite@latest shop-frontend -- --template react-ts
   3 cd shop-frontend
   4 npm install

  ---

  3. 주요 아키텍처 및 구현 포인트

  A. API 연동 계층 (Axios & ApiResponse 처리)
  백엔드에서 구현한 ApiResponse의 공통 포맷(success, message, data, http.*)을 처리할 수 있는 베이스 설정을 만듭니다.

    1 // src/api/axiosInstance.ts
    2 import axios from 'axios';
    3
    4 const axiosInstance = axios.create({
    5   baseURL: 'http://localhost:8080', // 백엔드 주소
    6   headers: { 'Content-Type': 'application/json' }
    7 });
    8
    9 // 공통 응답 처리 인터셉터
   10 axiosInstance.interceptors.response.use(
   11   (response) => response.data, // ApiResponse 객체 바로 반환
   12   (error) => {
   13     // 500 에러 등의 공통 처리
   14     console.error("API Error:", error.response?.data?.message);
   15     return Promise.reject(error);
   16   }
   17 );

  B. 타입 정의 (Types)
  백엔드의 BuyerResponse, OrderRequest 등과 대응되는 TypeScript 인터페이스를 정의합니다.

    1 // src/types/buyer.ts
    2 export interface ApiResponse<T> {
    3   success: boolean;
    4   message: string;
    5   data: T;
    6   "http.method": string;
    7   "http.path": string;
    8   "http.status_code": number;
    9   latency_ms: number;
   10 }
   11
   12 export interface Buyer {
   13   id: number;
   14   name: string;
   15   email: string;
   16   phone?: string;
   17 }

  C. React Query를 활용한 데이터 페칭
  방금 만든 BuyerController의 API를 호출하는 커스텀 훅 예시입니다.

    1 // src/hooks/useBuyers.ts
    2 import { useQuery } from '@tanstack/react-query';
    3 import { axiosInstance } from '../api/axiosInstance';
    4 import { ApiResponse, Buyer } from '../types';
    5
    6 export const useBuyers = () => {
    7   return useQuery({
    8     queryKey: ['buyers'],
    9     queryFn: () => axiosInstance.get<ApiResponse<Buyer[]>>('/api/buyers')
   10   });
   11 };

  ---

  4. 진행 순서 가이드 (Step-by-Step)

   1. CORS 설정 (Backend): React(보통 5173 포트)에서 Spring Boot(8080 포트)로 요청을 보낼 수 있도록 백엔드에 WebMvcConfigurer를 추가하여 CORS를 허용해야 합니다.
   2. 프로젝트 구조 잡기: src/api, src/components, src/hooks, src/pages 등으로 폴더 구조를 나눕니다.
   3. 공통 레이아웃 구현: 네비게이션 바(상품 목록, 주문 확인, 내 정보 등)를 만듭니다.
   4. 주요 화면 구현 순서:
       * 상품 목록 (shop-product 연동): 상품 리스트 확인 및 상세 보기.
       * 구매자 정보 (shop-order의 Buyer API 연동): 로그인 또는 구매자 등록/조회.
       * 주문 하기 (shop-order 연동): 상품 선택 후 주문 생성.
       * 주문 이력/상태 조회: 주문 진행 상황 및 이력 확인.

  ---

  5. 다음 단계 제안
  제가 백엔드에 CORS 설정을 추가해 드릴까요? 아니면 React 프로젝트의 초기 보일러플레이트 코드(Axios 설정 및 기본 API 호출 구조)를 먼저 작성해 드릴까요? 원하시는 방향을 알려주시면 바로 진행하겠습니다.
