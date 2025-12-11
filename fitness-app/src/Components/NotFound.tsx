import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Return to App</Link>
    </div>
  )
}

export default NotFound