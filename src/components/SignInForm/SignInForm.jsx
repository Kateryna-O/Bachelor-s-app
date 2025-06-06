import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import css from './SignInForm.module.css';
import sprite from '../../assets/icons/sprite.svg';
import { useDispatch } from 'react-redux';
import { register as singUp } from '../../redux/auth/operations';
import { useNavigate } from 'react-router-dom';

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Min 6 characters')
    .required('Password is required'),
});

export const SignInForm = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailId = useId();
  const passwordId = useId();
  const nameId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  // const onSubmit = async data => {
  //   console.log('Login data:', data);
  //   try {
  //     await dispatch(singUp(data)).unwrap(); // дождаться результата регистрации
  //     navigate('/mainPage'); // перейти только после успешной регистрации
  //     reset();
  //   } catch (error) {
  //     console.error('Registration failed:', error);
  //     // здесь можно показать ошибку пользователю
  //   }
  // };
  const onSubmit = async data => {
    try {
      await dispatch(singUp(data)).unwrap(); // чекаємо результату
      // alert('Ви успішно зареєстровані! Увійдіть у свій акаунт.'); // або toast
      navigate('/login'); // редірект на логін
      reset(); // очищення форми
      // onClose(); // закриваємо модалку (не обов'язково, якщо переходить сторінка)
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  return (
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

      <h2 className={css.title}>Sign up</h2>
      <p className={css.subtitle}>
        Thank you for your interest in our platform! In order to register, we
        need some information. Please provide us with the following information.
      </p>

      <label className={css.label}>
        <input
          id={nameId}
          type="text"
          placeholder="Name"
          {...register('name', { required: 'Name is required' })}
          className={css.input}
        />
        {errors.name && (
          <span className={css.error}>{errors.name.message}</span>
        )}
      </label>

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
            <svg className={css.icon}>
              <use
                href={`${sprite}#${
                  showPassword ? 'icon-eye' : 'icon-eye-blocked'
                }`}
              />
            </svg>
          </span>
        </div>
        {errors.password && (
          <span className={css.error}>{errors.password.message}</span>
        )}
      </label>

      <button type="submit" className={css.button}>
        Sign up
      </button>
    </form>
  );
};
