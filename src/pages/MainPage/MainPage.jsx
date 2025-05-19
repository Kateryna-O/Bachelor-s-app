import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { PopUpMenu } from '../../components/PopUpMenu/PopUpMenu';
import sprite from '../../assets/icons/sprite.svg';
import css from './MainPage.module.css';
import { fetchUsers } from '../../redux/users/operations';

export const MainPage = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.items);
  const isLoading = useSelector(state => state.users.isLoading);
  const error = useSelector(state => state.users.error);

  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    console.log('MainPage mounted: dispatching fetchUsers');
    dispatch(fetchUsers())
      .unwrap()
      .then(data => {
        console.log('fetchUsers fulfilled with data:', data);
      })
      .catch(err => {
        console.error('fetchUsers rejected with error:', err);
      });
  }, [dispatch]);

  // Логування при зміні users
  useEffect(() => {
    console.log('Users updated:', users);
  }, [users]);

  // Логування для isLoading і error
  useEffect(() => {
    console.log('Loading state:', isLoading, 'Error state:', error);
  }, [isLoading, error]);

  const loadMore = () => {
    console.log('Load more clicked, old page:', page);
    setPage(prevPage => prevPage + 1);
  };

  if (isLoading && users.length === 0) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className={css.error}>Error: {error}</p>;
  }

  return (
    <div>
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
      <ul className={css.userList}>
        {users.slice(0, itemsPerPage * page).map(user => (
          <li key={user._id} className={css.userCard}>
            <img
              src={user.photo || '../../assets/img/tess_1x.png'}
              alt={user.name}
              className={css.avatar}
            />
            <p className={css.name}>{user.name}</p>
            <button className={css.chatButton}>Перейти в чат</button>
          </li>
        ))}
      </ul>

      {users.length > itemsPerPage * page && (
        <button type="button" className={css.loadMoreBtn} onClick={loadMore}>
          Load more
        </button>
      )}
    </div>
  );
};
