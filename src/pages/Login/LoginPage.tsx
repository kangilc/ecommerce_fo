import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { setAccessToken } from '../../api/client';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      // 백엔드 명세에 맞게 파라미터를 보냄 (예: username / password)
      const res = await login({ email: form.email, password: form.password });
      
      // Access Token과 Refresh Token 저장
      const accessToken = res.accessToken || res.data?.accessToken;
      const refreshToken = res.refreshToken || res.data?.refreshToken;
      
      if (accessToken) {
        setAccessToken(accessToken); // 메모리에 엑세스 토큰 세팅
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken); // 로컬 스토리지에 리프레시 토큰 보관
      }
      
      // 사용자 정보 로컬스토리지 보관 (옵션)
      const userInfo = res.user || res.data?.user;
      if (userInfo) {
         localStorage.setItem('user_info', JSON.stringify(userInfo));
      }

      window.dispatchEvent(new Event('auth-change'));
      
      alert('로그인 성공!');
      navigate('/'); // 홈으로 이동
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>아이디(이메일)</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border)' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>비밀번호</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border)' }}
            required
          />
        </div>
        {error && <div style={{ color: 'red', fontSize: '0.9rem' }}>{error}</div>}
        <button type="submit" style={{ padding: '0.8rem', marginTop: '1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          로그인
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
