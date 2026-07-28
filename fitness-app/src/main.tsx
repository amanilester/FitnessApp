import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Home from './Components/Home.tsx'
import NotFound from './Components/NotFound.tsx'
import NewProgram from './Components/NewProgram.tsx'
import Login from './Components/LoginRegister/Login.tsx'
import Register from './Components/LoginRegister/Register.tsx'
import Layout from './Components/Layout.tsx'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Programs from './Components/Workouts/Programs.tsx'
import Workout from './Components/Workouts/Workout.tsx'

let loggedIn = false;
const router = createBrowserRouter([
  { element: <Layout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/home', element: <Home /> },
      { path: '/*', element: <NotFound />},
      { path: '/new-program', element: <NewProgram /> },
      { path: '/programs', element: <Programs /> },
      { path: '/workout/:id', element: <Workout /> },
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