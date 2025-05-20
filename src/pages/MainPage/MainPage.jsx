import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { PopUpMenu } from '../../components/PopUpMenu/PopUpMenu';
import sprite from '../../assets/icons/sprite.svg';
import css from './MainPage.module.css';
import { fetchUsers } from '../../redux/users/operations';
import defaultAvatar from '../../assets/img/tess_1x.png';
import { useNavigate } from 'react-router-dom';

export const MainPage = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.items);
  const isLoading = useSelector(state => state.users.isLoading);
  const error = useSelector(state => state.users.error);

  const [page, setPage] = useState(1);
  const [searchEmail, setSearchEmail] = useState(''); // новий стан для пошуку
  const itemsPerPage = 4;

  const navigate = useNavigate();

  const handleChatStart = userId => {
    navigate(`/chat/${userId}`); // перехід на сторінку чату
  };

  useEffect(() => {
    dispatch(fetchUsers())
      .unwrap()
      .then(data => console.log('fetchUsers fulfilled with data:', data))
      .catch(err => console.error('fetchUsers rejected with error:', err));
  }, [dispatch]);

  // Фільтруємо користувачів за email
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const loadMore = () => {
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
            placeholder="Search by email..."
            className={css.searchInput}
            value={searchEmail}
            onChange={e => {
              setSearchEmail(e.target.value);
              setPage(1); // при новому пошуку скидаємо сторінку на 1
            }}
          />
          <button className={css.button}>
            <svg className={css.btnIcon}>
              <use href={`${sprite}#icon-search`} />
            </svg>
          </button>
        </div>
      </div>
      <ul className={css.userList}>
        {filteredUsers.slice(0, itemsPerPage * page).map(user => (
          <li key={user._id} className={css.userCard}>
            <img
              src={user.photo || defaultAvatar}
              alt={user.name}
              className={css.avatar}
            />
            <div>
              <p className={css.name}>{user.name}</p>
              <button
                className={css.chatButton}
                onClick={() => handleChatStart(user._id)}
              >
                Enter the chat
              </button>
            </div>
          </li>
        ))}
      </ul>

      {filteredUsers.length > itemsPerPage * page && (
        <button type="button" className={css.loadMoreBtn} onClick={loadMore}>
          Load more
        </button>
      )}
    </div>
  );
};
