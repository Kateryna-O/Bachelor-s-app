import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import css from './SignInForm.module.css';
import sprite from '../../assets/icons/sprite.svg';

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Min 6 characters')
    .required('Password is required'),
});

export const SignInForm = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = data => {
    console.log('Login data:', data);
    // Тут логіка логіну (API запит, Redux dispatch і т.д.)
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
