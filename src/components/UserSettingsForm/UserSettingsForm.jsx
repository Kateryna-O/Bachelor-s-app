import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCallback, useEffect, useState } from 'react';

import sprite from '../../assets/icons/sprite.svg';
import avatarMobile1x from '../../assets/img/tess_1x.png';
import avatarMobile2x from '../../assets/img/tess_2x.png';
import css from './UserSettingsForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectUserId } from '../../redux/auth/selectors';
import { updateUser } from '../../redux/users/operations';

const schema = yup.object().shape({
  userPhone: yup
    .string()
    .max(13, 'Phone number must be 13 characters or less')
    .matches(/^\+\d{12}$/, 'Phone number must be in format +XXXXXXXXXXXX'),
  userName: yup.string().min(2, 'Name must be at least 2 characters'),
  userBirth: yup
    .date()
    .max(new Date(), 'Date must be in the past')
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr)),
  userBio: yup.string().max(500, 'Bio must be at most 500 characters'),
});

export const UserSettingsForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { name, number, photo, aboutMe, dateOfBirth } = useSelector(selectUser);
  const [imagePreview, setImagePreview] = useState(photo);
  const userId = useSelector(selectUserId);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(schema),
    defaultValues: {
      userName: name || '',
      userPhone: number || '',
      userImage: photo || null,
      userBio: aboutMe || '',
      userBirth: dateOfBirth || '',
    },
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
      }
    },
    [imagePreview, setValue]
  );
  useEffect(() => {
    if (name !== undefined && number !== undefined) {
      reset({
        userName: name,
        userPhone: number,
        userImage: photo,
        userBio: aboutMe,
        userBirth: dateOfBirth
          ? new Date(dateOfBirth).toISOString().slice(0, 10)
          : '',
      });
      setImagePreview(photo);
    }
  }, [name, number, photo, aboutMe, dateOfBirth, reset]);

  const onSubmitForm = useCallback(
    async data => {
      const formData = new FormData();
      formData.append('name', data.userName);
      formData.append('number', data.userPhone);
      formData.append('dateOfBirth', data.userBirth);
      formData.append('aboutMe', data.userBio || '');

      if (data.userImage && typeof data.userImage !== 'string') {
        formData.append('photo', data.userImage); // важливо! назва 'photo' має відповідати тому, що чекає бекенд
      }
      const resultAction = await dispatch(
        updateUser({ id: userId, updates: formData })
      );

      if (updateUser.fulfilled.match(resultAction)) {
        onClose(false); // закриваємо форму, коли оновлення успішне
      } else {
        // Можна показати помилку або залишити форму відкритою
      }
    },
    [dispatch, onClose]
  );
  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className={css.formWrapper}>
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
