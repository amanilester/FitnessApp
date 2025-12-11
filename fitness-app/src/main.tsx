import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Home from './Components/Home.tsx'
import NotFound from './Components/NotFound.tsx'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/home', element: <Home /> },
  { path: '/*', element: <NotFound />}
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
