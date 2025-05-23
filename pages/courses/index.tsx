import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function CourseListPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  useEffect(() => {
    // Fetch courses
    const fetchCourses = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
      setCourses(data || [])
      setLoading(false)
    }
    fetchCourses()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Courses</h1>
      <Link href="/courses/add">
        <button>Add Course</button>
      </Link>
      {courses.length === 0 && <div>No courses available.</div>}
      {courses.map((course) => (
        <div key={course.id}>
          <h2>{course.name}</h2>
          <p>{course.description}</p>
          <div>
            Created: {new Date(course.created_at).toLocaleString()}
          </div>
          {/* View Button (all users) */}
          <Link href={`/courses/${course.id}`}>
            <button>View</button>
          </Link>
          {/* Edit/Delete Buttons (owner only) */}
          {user && course.creator_id === user.id && (
            <>
              <Link href={`/courses/edit/${course.id}`}>
                <button>Edit</button>
              </Link>
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to delete this course?')) {
                    await supabase.from('courses').delete().eq('id', course.id)
                    setCourses((prev) => prev.filter((c) => c.id !== course.id))
                  }
                }}
              >
                Delete
              </button>
            </>
          )}
          <hr />
        </div>
      ))}
    </div>
  )
}