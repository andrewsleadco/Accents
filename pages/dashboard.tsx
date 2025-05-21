import AuthGuard from '../components/AuthGuard'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login')
      } else {
        setUser(data.session.user)
      }
    })
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return <p>Loading...</p>

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{user.email}</strong></p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  )
}