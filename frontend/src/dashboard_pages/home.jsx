import Sidebar from "../components/sidebar"
import { Outlet } from "react-router-dom"

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-(--off-white)">
      <Sidebar />

      <main className="md:ml-64 flex flex-col h-screen min-w-0 bg-(--off-white)">
        <Outlet/>
      </main>
    </div>
  )
}

export default Home