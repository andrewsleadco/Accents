import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function CourseDetailsPage() {
  const router = useRouter()
  const { id } = router.query

  const [course, setCourse] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      const userResp = await supabase.auth.getUser()
      setUser(userResp.data.user)
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single()
      if (error || !data) {
        setError('Course not found.')
        setLoading(false)
        return
      }
      setCourse(data)
      setLoading(false)
    }
    fetchData()
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course?')) return
    await supabase.from('courses').delete().eq('id', id)
    router.push('/courses')
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!course) return null

  return (
    <div>
      <h1>{course.name}</h1>
      <p>{course.description}</p>
      <div>
        Created: {new Date(course.created_at).toLocaleString()}
      </div>
      {user && course.creator_id === user.id && (
        <>
          <Link href={`/courses/edit/${course.id}`}>
            <button>Edit</button>
          </Link>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
      <div>
        <Link href="/courses">
          <button>Back to Courses</button>
        </Link>
      </div>
    </div>
  )
}