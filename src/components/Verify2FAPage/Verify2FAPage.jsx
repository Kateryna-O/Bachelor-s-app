import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verify2FA } from '../../redux/auth/operations';
import { useNavigate } from 'react-router-dom';

export const Verify2FAPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const email = useSelector(state => state.auth.tempEmail);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) return alert('No email found for verification');

    try {
      const result = await dispatch(verify2FA({ email, code })).unwrap();
      console.log('✅ Verification success:', result);
      navigate('/mainPage');
    } catch (err) {
      console.error('❌ Verification error:', err);
      alert(err || 'Verification failed');
    }
  };

  return (
    <div>
      <h2>Verify Two-Factor Code</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Enter the 2FA code"
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};
