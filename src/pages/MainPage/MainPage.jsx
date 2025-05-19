import { PopUpMenu } from '../../components/PopUpMenu/PopUpMenu';
import sprite from '../../assets/icons/sprite.svg';
import css from './MainPage.module.css';

export const MainPage = () => {
  return (
    <div className={css.pageWrapper}>
      <PopUpMenu />
      <div className={css.wrapperSearch}>
        <input
          type="text"
          placeholder="Search..."
          className={css.searchInput}
        />
        <button className={css.button}>
          <svg className={css.btnIcon}>
            <use href={`${sprite}#icon-search`} />
          </svg>
        </button>
      </div>
    </div>
  );
};
