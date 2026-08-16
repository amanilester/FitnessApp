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
import Profile from './Components/Profile.tsx'
import ProtectedRoute from './Components/ProtectedRoute.tsx'

let loggedIn = false;
const router = createBrowserRouter([
  { element: <Layout />,
    children: [
      {
        path: '/home',
        element:<ProtectedRoute> <Home /> </ProtectedRoute>
      },
      {
        path: '/new-program',
        element:<ProtectedRoute> <NewProgram /> </ProtectedRoute>
      },
      {
        path: '/programs',
        element:<ProtectedRoute> <Programs /> </ProtectedRoute>
      },
      {
        path: '/workout/:id',
        element:<ProtectedRoute> <Workout /> </ProtectedRoute>
      },
      {
        path: '/profile',
        element:<ProtectedRoute> <Profile /> </ProtectedRoute>
      },
      { path: '/', element: <App /> },
      { path: '/*', element: <NotFound />},
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