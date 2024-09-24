import { useContext, useEffect, useState } from 'react';
import Featured from '../../components/featured/Featured';
import List from '../../components/list/List';
import Navbar from '../../components/navbar/Navbar';
import './Home.scss';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import { get_User_Fav } from '../../context/favContext/apiCalls';
import { AuthContext } from '../../context/authContext/AuthContext';
import { FavContext } from '../../context/favContext/FavContext';
import { fetchUserDetailsIfOutdated } from '../../context/authContext/apiCalls';
import { get_User_WatchLater } from '../../context/watchLaterContext/apiCalls';
import { WatchLaterContext } from '../../context/watchLaterContext/WatchLaterContext';

export default function Home({ type }) {
  const [lists, setLists] = useState([]);
  const [genre, setGenre] = useState(null);

  const { user, dispatch: dispatchUser } = useContext(AuthContext)
  const { dispatch: dispatchFav } = useContext(FavContext)
  const { dispatch: dispatchWatchLater } = useContext(WatchLaterContext)

  useEffect(() => {
    const url = `lists/find${type ? "/?type=" + type : ""}${type && genre ? "&genre=" + genre : ""}`;

    console.log('Genre:', genre);
    console.log('Type:', type);
    console.log('Fetching data from URL:', url);

    const getRandomLists = async () => {
      try {
        const response = await axiosInstance.get(url);

        console.log('Fetched data:', response.data);
        setLists(response.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    getRandomLists();
  }, [genre, type]);

  useEffect(() => {
    get_User_Fav(user._id, dispatchFav)
  }, [user, dispatchFav])

  useEffect(() => {
    get_User_WatchLater(user._id, dispatchWatchLater)
  }, [user,dispatchWatchLater])

  return (
    <div className='home'>
      <Navbar />
      <Featured type={type} setGenre={setGenre} />
      {lists?.map((list, index) => (
        <List list={list} key={index} />
      ))}
    </div>
  );
}
