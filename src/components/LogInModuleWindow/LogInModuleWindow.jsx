import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import css from './LogInModuleWindow.module.css';
import sprite from '../../assets/icons/sprite.svg';
import { useDispatch } from 'react-redux';
import { login, verify2FA } from '../../redux/auth/operations';
import { useNavigate } from 'react-router-dom';
import { API } from '../../helpers/axios';
import { generateRSAKeyPair } from '../../helpers/cryptoKeys';

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Min 6 characters')
    .required('Password is required'),
});

export const LogInModuleWindow = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const [code, setCode] = useState('');

  const emailId = useId();
  const passwordId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const setupKeys = async accessToken => {
    const existingKey = localStorage.getItem('privateKey');
    console.log('Checking for privateKey:', existingKey);

    if (existingKey) return;

    console.log('Generating RSA key pair...');
    const { publicKey, privateKey } = await generateRSAKeyPair();
    console.log('Generated keys:', { publicKey, privateKey });

    localStorage.setItem('privateKey', privateKey);

    try {
      console.log('Sending publicKey to server...');
      const res = await API.post(
        '/users/public-key',
        { publicKey },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log('Upload response:', res.data);
    } catch (err) {
      console.error('Error uploading public key:', err);
    }
  };

  const onSubmit = async data => {
    try {
      const result = await dispatch(login(data)).unwrap();
      if (result?.accessToken) {
        await setupKeys(result.accessToken);
        navigate('/mainPage');
        reset();
      } else if (result?.requires2FA && result?.email) {
        setTempEmail(result.email);
        setShow2FA(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handle2FASubmit = async e => {
    e.preventDefault();
    try {
      const result = await dispatch(
        verify2FA({ code, email: tempEmail })
      ).unwrap();
      if (result?.accessToken) {
        await setupKeys(result.accessToken);
        navigate('/mainPage');
        setCode('');
        reset();
      }
    } catch (error) {
      console.error('2FA verification failed:', error);
    }
  };

  return (
    <>
      {!show2FA && (
        <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
          <button
            type="button"
            className={css.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg className={css.closeIcon}>
              <use href={`${sprite}#icon-x`} />
            </svg>
          </button>
          <h2 className={css.title}>Log In</h2>
          <p className={css.subtitle}>
            Welcome back! Please enter your credentials to access your account.
          </p>

          <label className={css.label}>
            <input
              id={emailId}
              type="email"
              placeholder="Email"
              {...register('email')}
              className={css.input}
            />
            {errors.email && (
              <span className={css.error}>{errors.email.message}</span>
            )}
          </label>

          <label className={css.label}>
            <div className={css.passwordWrapper}>
              <input
                id={passwordId}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password')}
                className={css.input}
              />
              <span
                className={css.toggle}
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? (
                  <svg className={css.icon}>
                    <use href={`${sprite}#icon-eye`} />
                  </svg>
                ) : (
                  <svg className={css.icon}>
                    <use href={`${sprite}#icon-eye-blocked`} />
                  </svg>
                )}
              </span>
            </div>
            {errors.password && (
              <span className={css.error}>{errors.password.message}</span>
            )}
          </label>

          <button type="submit" className={css.button}>
            Log In
          </button>
        </form>
      )}

      {show2FA && (
        <form onSubmit={handle2FASubmit} className={css.form}>
          <h3 className={css.subtitle}>
            Enter the 2FA code sent to your email
          </h3>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={e => setCode(e.target.value)}
            className={css.input}
          />
          <button type="submit" className={css.button}>
            Verify Code
          </button>
        </form>
      )}
    </>
  );
};
