import sprite from '../../assets/icons/sprite.svg';
import css from './PopUpMenu.module.css';

import avatarMobile1x from '../../assets/img/tess_1x.png';
import avatarMobile2x from '../../assets/img/tess_2x.png';
import { useState } from 'react';
import { Modal } from '../../components/Modal/Modal';
import { UserSettingsForm } from '../../components/UserSettingsForm/UserSettingsForm';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/auth/operations';
import { selectUser } from '../../redux/auth/selectors';

export const PopUpMenu = () => {
  const { name, number, photo } = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettOpen, setIsSettOpen] = useState(false);
  const [hideOrShow, setHideOrShow] = useState({
    opacity: 0,
    transform: 'translateX(-100%)',
    visibility: 'hidden',
    pointerEvents: 'none',
  });

  const handleMenu = () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);

    if (willOpen) {
      setHideOrShow({
        opacity: 1,
        transform: 'translateX(0)',
        visibility: 'visible',
        pointerEvents: 'auto',
      });
    } else {
      setHideOrShow({
        opacity: 0,
        transform: 'translateX(-100%)',
      });

      setTimeout(() => {
        setHideOrShow({
          opacity: 0,
          transform: 'translateX(-100%)',
          visibility: 'hidden',
          pointerEvents: 'none',
        });
      }, 300);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Перенаправлення на домашню сторінку
  };
  return (
    <div className={css.menuContainer}>
      <div>
        {isOpen ? (
          <button onClick={handleMenu} type="button" className={css.button}>
            <svg className={css.bntCloseIcon}>
              <use href={`${sprite}#icon-x`} />
            </svg>
          </button>
        ) : (
          <button onClick={handleMenu} type="button" className={css.button}>
            <svg className={css.bntOpenIcon}>
              <use href={`${sprite}#icon-menu`} />
            </svg>
          </button>
        )}

        <div className={css.navVision} style={hideOrShow}>
          <img
            src={photo || avatarMobile1x}
            srcSet={
              photo ? `${photo}` : `${avatarMobile1x} 1x, ${avatarMobile2x} 2x`
            }
            alt="User photo"
            aria-label="Upload a photo"
            loading="lazy"
            width="75"
            height="75"
            className={css.userPhoto}
          />
          <h2 className={css.userName}>{name || 'User'}</h2>
          <p className={css.userNumber}>{number || 'phone number'}</p>
          <div className={css.buttonContainer}>
            <button
              className={css.navBtn}
              onClick={() => {
                setIsSettOpen(true);
                handleMenu(); // Закриває бокове меню
              }}
            >
              <svg className={css.navBtnSett}>
                <use href={`${sprite}#icon-cog`} />
              </svg>
              Settings
            </button>
            <button className={css.navBtn} onClick={handleLogout}>
              <svg className={css.navBtnLogOut}>
                <use href={`${sprite}#icon-logout`} />
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </div>
      {isSettOpen && (
        <Modal onClose={() => setIsSettOpen(false)}>
          <UserSettingsForm onClose={() => setIsSettOpen(false)} />
        </Modal>
      )}
    </div>
  );
};
