import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/dashboard')
  }, [])
  return <h1 className="text-2xl font-semibold">Home Page</h1>
}
