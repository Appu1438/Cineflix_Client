import { useEffect, useState } from 'react';
import Featured from '../../components/featured/Featured';
import List from '../../components/list/List';
import Navbar from '../../components/navbar/Navbar';
import './Home.scss';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';

export default function Home({ type }) {
  const [lists, setLists] = useState([]);
  const [genre, setGenre] = useState(null);

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

  return (
    <div className='home'>
      <Navbar />
      <Featured type={type} setGenre={setGenre} />
      {lists.map((list, index) => (
        <List list={list} key={index} />
      ))}
    </div>
  );
}
