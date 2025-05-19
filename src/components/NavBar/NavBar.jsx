import { Logo } from '../Logo/Logo';
import css from './NavBar.module.css';
import { useNavigate } from 'react-router-dom';

export const NavBar = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={css.wrapper}>
        <Logo />
        <div className={css.BtnWrapper}>
          <button
            type="button"
            className={css.btnRed}
            onClick={() => navigate('/login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={css.btnRed}
            onClick={() => navigate('/signup')}
          >
            Sing up
          </button>
        </div>
      </div>
      <hr className={css.line} />
    </>
  );
};
