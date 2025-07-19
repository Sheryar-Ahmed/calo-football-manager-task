import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="p-4">
      <nav className="space-x-4 mb-4">
        <Link to="/" className="text-blue-600">Home</Link>
        <Link to="/about" className="text-blue-600">About</Link>
      </nav>
      <Outlet />
    </div>
  )
}
