import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.push('/login')
      } else {
        const { user } = data.session

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
        }

        setUser({ ...user, role: profile?.role || 'user' })
      }
    })
  }, [router])

  if (!user) return <p>Loading...</p>

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{user.email}</strong> ({user.role})</p>

      {user.role === 'admin' && (
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Create New Course
        </button>
      )}
    </div>
  )
}