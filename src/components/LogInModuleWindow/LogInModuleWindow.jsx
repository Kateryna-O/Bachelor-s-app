import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import css from './LogInModuleWindow.module.css';
import sprite from '../../assets/icons/sprite.svg';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/auth/operations';
import { useNavigate } from 'react-router-dom';

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
  const onSubmit = async data => {
    try {
      await dispatch(login(data)).unwrap(); // чекаємо завершення логіну
      navigate('/mainPage'); // переходимо на головну сторінку
      reset(); // очищаємо форму
    } catch (error) {
      console.error('Login failed:', error);
      // тут можна показати повідомлення про помилку користувачу
    }
  };

  return (
    <>
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
    </>
  );
};
