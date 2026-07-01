import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Home from './Components/Home.tsx'
import NotFound from './Components/NotFound.tsx'
import Navbar from './Components/Navbar.tsx'
import NewProgram from './Components/NewProgram.tsx'
import Day from './Components/Workouts/Day.tsx'
import Login from './Components/LoginRegister/Login.tsx'
import Register from './Components/LoginRegister/Register.tsx'
import Layout from './Components/Layout.tsx'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'


let loggedIn = false;
const router = createBrowserRouter([
  { element: <Layout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/home', element: <Home /> },
      { path: '/*', element: <NotFound />},
      { path: '/new-program', element: <NewProgram /> },
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
])



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

export default loggedIn;