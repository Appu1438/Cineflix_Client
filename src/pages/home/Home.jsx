import { useEffect, useState } from 'react'
import Featured from '../../components/featured/Featured'
import List from '../../components/list/List'
import Navbar from '../../components/navbar/Navbar'
import './Home.scss'
import axios from 'axios'


export default function Home({ type }) {

  const [lists, setLists] = useState([])
  const [genre, setGenre] = useState(null)
  useEffect(() => {

    const getRandomLists = async () => {

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}lists/find/${type ? "?type=" + type : ""}${genre ? "&genre=" + genre : ""}`, {
          headers: {
            token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTc4MWIzNjQ3YzEzNjYyNzVjNjkwOCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyMzI4MTQzOSwiZXhwIjoxNzIzNzEzNDM5fQ.GcSudNwYKYaaVtTdvHvXvuTqCUQzlMYz5MNZXTHNVM4",
          }
        })
        setLists(response.data)

      } catch (error) {
        console.log(error);
      }
    }
    getRandomLists()
  }, [genre, type])

  return (
    <div className='home'>
      <Navbar />
      <Featured type={type} setGenre={setGenre} />
       {lists.map((list,index)=>(
        <List list={list} key={index}/>
       ))}
    </div>
  )
}
