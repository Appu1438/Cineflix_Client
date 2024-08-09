import Featured from '../../components/featured/Featured'
import List from '../../components/list/List'
import Navbar from '../../components/navbar/Navbar'
import './Home.scss'

export default function Home() {
  return (
    <div className='home'>
      <Navbar />
      <Featured type={"movie"}/>
      <List/>
      <List/>
      <List/>
    </div>
  )
}
