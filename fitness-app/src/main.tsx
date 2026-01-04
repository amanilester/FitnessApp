import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Home from './Components/Home.tsx'
import NotFound from './Components/NotFound.tsx'
import Navbar from './Components/Navbar.tsx'
import NewProgram from './Components/NewProgram.tsx'
import Day from './Components/Workouts/Day.tsx'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'


let loggedIn = false;
const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/home', element: <Home /> },
  { path: '/*', element: <NotFound />},
  { path: '/new-program', element: <NewProgram /> },
  { path: '/day-testing', element: <Day /> }
])



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Navbar loggedIn={loggedIn} />
    <RouterProvider router={router} />
  </StrictMode>,
)

export default loggedIn;