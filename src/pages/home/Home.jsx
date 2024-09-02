import { useEffect, useState } from 'react';
import Featured from '../../components/featured/Featured';
import List from '../../components/list/List';
import Navbar from '../../components/navbar/Navbar';
import './Home.scss';
import axios from 'axios';

export default function Home({ type }) {
  const [lists, setLists] = useState([]);
  const [genre, setGenre] = useState(null);

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}lists/find${type ? "/?type=" + type : ""}${type && genre ? "&genre=" + genre : ""}`;
    
    console.log('Genre:', genre);
    console.log('Type:', type);
    console.log('Fetching data from URL:', url);

    const getRandomLists = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTc4MWIzNjQ3YzEzNjYyNzVjNjkwOCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyNDY1NDYxNCwiZXhwIjoxNzI1MDg2NjE0fQ.MHnkqE-isYy9fNQK0QPPjX07gLW805Td1bsW1Koz2zk",
          }
        });

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
