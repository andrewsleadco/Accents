import AuthGuard from '../components/AuthGuard'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
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
      <ul>
        <li>
          <Link href="/courses">
            <button>Browse Courses</button>
          </Link>
        </li>
        <li>
          <Link href="/courses/add">
            <button>Add Course</button>
          </Link>
        </li>
      </ul>
    </div>
  )
}
