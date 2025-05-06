import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCallback, useState } from 'react';

import sprite from '../../assets/icons/sprite.svg';
import avatarMobile1x from '../../assets/img/tess_1x.png';
import avatarMobile2x from '../../assets/img/tess_2x.png';
import css from './UserSettingsForm.module.css';

const schema = yup.object().shape({
  userPhone: yup
    .string()
    .max(12, 'Phone number must be 12 characters or less')
    .matches(/^\+\d{11}$/, 'Phone number must be in format +XXXXXXXXXXX')

    .required('Phone number is required'),
  userName: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  userBirth: yup
    .date()
    .typeError('Date is required')
    .required('Date is required')
    .max(new Date(), 'Date must be in the past'),
  userBio: yup.string().max(500, 'Bio must be at most 500 characters'),
});

export const UserSettingsForm = ({ onClose }) => {
  const [imagePreview, setImagePreview] = useState();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleImageChange = useCallback(
    async event => {
      const file = event.target.files[0];
      if (file) {
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);
        setValue('userImage', file);
        await trigger('userImage');
      }
    },
    [imagePreview, setValue, trigger]
  );

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={css.formWrapper}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className={css.bntClose}
      >
        <svg className={css.btnCloseIcon}>
          <use href={`${sprite}#icon-x`} />
        </svg>
      </button>

      <h2 className={css.titleModule}>Settings</h2>

      <div className={css.uploadContainer}>
        <input
          type="file"
          id="userImage"
          className={css.fileImage}
          accept="image/*"
          {...register('userImage')}
          onChange={handleImageChange}
        />
        <img
          src={imagePreview || avatarMobile1x}
          srcSet={
            imagePreview
              ? `${imagePreview}`
              : `${avatarMobile1x} 1x, ${avatarMobile2x} 2x`
          }
          alt="User photo"
          aria-label="Upload a photo"
          className={css.userPhoto}
          loading="lazy"
          width="75"
          height="75"
        />
        <label htmlFor="userImage" className={css.uploadButton}>
          <svg>
            <use href={`${sprite}#icon-upload`} />
          </svg>
          Upload Photo
        </label>
        {errors.userImage && (
          <span className={css.error}>{errors.userImage.message}</span>
        )}
      </div>

      <h3 className={css.account}>Account</h3>

      <div className={css.wrapper}>
        <div className={css.wrapperInput}>
          <label className={css.labelInput}>
            Enter your number
            <input
              type="text"
              placeholder="Tap to change phone number"
              {...register('userPhone')}
              className={`${css.input} ${
                errors.userPhone ? css.inputError : ''
              }`}
            />
            {errors.userPhone && (
              <span className={css.error}>{errors.userPhone.message}</span>
            )}
          </label>

          <label className={css.labelInput}>
            Enter your name
            <input
              type="text"
              placeholder="User name"
              {...register('userName')}
              className={`${css.input} ${
                errors.userName ? css.inputError : ''
              }`}
            />
            {errors.userName && (
              <span className={css.error}>{errors.userName.message}</span>
            )}
          </label>

          <label className={css.labelInput}>
            Enter your date of birth
            <input
              type="date"
              {...register('userBirth')}
              className={`${css.input} ${
                errors.userBirth ? css.inputError : ''
              }`}
            />
            {errors.userBirth && (
              <span className={css.error}>{errors.userBirth.message}</span>
            )}
          </label>
        </div>

        <label className={css.labelInput}>
          <textarea
            placeholder="Add a few words about yourself"
            {...register('userBio')}
            className={`${css.textarea} ${
              errors.userBio ? css.inputError : ''
            }`}
          />
          {errors.userBio && (
            <span className={css.error}>{errors.userBio.message}</span>
          )}
        </label>
      </div>

      <button type="submit" className={css.btnSave}>
        Save
      </button>
    </form>
  );
};
