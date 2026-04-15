import { useEffect } from 'react';
import { forceLogout, getAccessToken } from '../api/client';

/**
 * 백엔드의 SSE(Server-Sent Events) 스트림에 연결하여
 * 실시간 알람(예: Kafka에서 컨슘한 이벤트)을 수신하는 커스텀 훅입니다.
 */
export const useSseListener = (isLoggedIn: boolean) => {
  useEffect(() => {
    // 로그아웃 상태일 때는 SSE 연결을 시도하지 않음
    if (!isLoggedIn) return;

    // 백엔드의 SSE 엔드포인트 URL
    // (Spring Security 필터 처리를 우회하기 위해 token을 쿼리 파라미터로 붙입니다)
    const token = getAccessToken();
    if (!token) {
      console.warn('SSE: Access Token이 없어 연결을 건너뜁니다.');
      return;
    }

    const url = `/api/notifications/subscribe?token=${token}`;
    const eventSource = new EventSource(url, { withCredentials: true });

    eventSource.onopen = () => {
      console.log('SSE 연결이 활성화되었습니다.');
    };

    // 백엔드의 Kafka 컨슈머가 'LOGOUT_SUCCESS' 이벤트를 SSE로 브로드캐스팅할 때
    eventSource.addEventListener('message', (event) => {
      console.log('받은 이벤트:', event.data);
      if ( event.data === 'LOGOUT_SUCCESS'){
          console.log("로그아웃 알림 수신, 세션 정리 시작");
          alert('세션이 강제로 종료되었거나 다른 환경에서 로그아웃 되었습니다.');
      }
      
      // 인터셉터 파일에서 만들어 둔 로그아웃 함수를 직접 호출하여 저장소 삭제 및 화면 이동
      forceLogout();
    });

    eventSource.onerror = (error) => {
      console.error('SSE 수신 에러 발생:', error);
      // 에러 발생 시 재연결을 시도하거나, 안전하게 닫아줍니다.
      eventSource.close();
    };

    // 컴포넌트가 언마운트될 때 메모리 낭비가 없도록 EventSource 연결 종료
    return () => {
      console.log("SSE 연결 종료");
      eventSource.close();
    };
  }, [isLoggedIn]); // 로그인 상태가 바뀔 때마다 실행/종료되도록 의존성 추가
};

