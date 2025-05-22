import AuthGuard from '../components/AuthGuard'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login')
      } else {
        setUser(data.session.user)
      }
    })
  }, [router])

  useEffect(() => {
    if (user) {
      supabase
        .from('courses')
        .select('*')
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching courses:', error)
          } else {
            setCourses(data || [])
          }
        })
    }
  }, [user])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return <p>Loading...</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, <strong>{user.email}</strong></p>
      <button className="mb-6 px-4 py-2 bg-red-600 text-white rounded" onClick={handleLogout}>Log Out</button>

      <h2 className="text-xl font-semibold mb-2">Available Courses</h2>
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map(course => (
            <li key={course.id} className="border p-4 rounded">
              <h3 className="font-bold">{course.title}</h3>
              <p>{course.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}