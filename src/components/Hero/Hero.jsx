import { useNavigate } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar';
import css from './Hero.module.css';

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className={css.WrapperImg}>
      <NavBar />
      <div className={css.container}>
        <h1 className={css.textH1}>Make communication safe</h1>
        <p className={css.text}>
          Communicate confidentially and securely. Protect your data now!
        </p>
        <button
          type="button"
          className={css.btn}
          onClick={() => navigate('/signup')}
        >
          Start
        </button>
      </div>
    </div>
  );
};
