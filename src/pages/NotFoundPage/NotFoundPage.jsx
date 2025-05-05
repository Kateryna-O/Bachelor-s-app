import { Link } from 'react-router-dom';
import css from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404</h1>
      <p className={css.message}>Page not found</p>
      <Link to="/" className={css.button}>
        Go Home
      </Link>
    </div>
  );
};
