import { useEffect } from 'react';
import { forceLogout } from '../api/client';

/**
 * 백엔드의 SSE(Server-Sent Events) 스트림에 연결하여
 * 실시간 알람(예: Kafka에서 컨슘한 이벤트)을 수신하는 커스텀 훅입니다.
 */
export const useSseListener = () => {
  useEffect(() => {
    // 백엔드의 SSE 엔드포인트 URL
    // (만약 사용자 식별을 위한 param이 필요하다면 ?token=... 식으로 넘길 수 있습니다)
    const url = `/api/notifications/stream`;
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.log('SSE 연결이 활성화되었습니다.');
    };

    // 백엔드의 Kafka 컨슈머가 'LOGOUT_SUCCESS' 이벤트를 SSE로 브로드캐스팅할 때
    eventSource.addEventListener('LOGOUT_SUCCESS', (event) => {
      console.warn('받은 이벤트:', event.data);
      alert('세션이 강제로 종료되었거나 다른 환경에서 로그아웃 되었습니다.');
      
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
      eventSource.close();
    };
  }, []); // 의존성 배열에 사용자 ID 등을 추가하여 연결을 갱신하게 할 수도 있습니다.
};
