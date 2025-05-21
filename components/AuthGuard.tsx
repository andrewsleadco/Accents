// components/AuthGuard.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session
      if (session) {
        setAuthorized(true)
      } else {
        router.push('/login')
      }
      setLoading(false)
    })
  }, [router])

  if (loading) return <p>Loading...</p>
  if (!authorized) return null

  return <>{children}</>
}