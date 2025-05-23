import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../../lib/supabaseClient'

export default function EditCoursePage() {
  const router = useRouter()
  const { id } = router.query

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [owner, setOwner] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchCourse = async () => {
      const userResp = await supabase.auth.getUser()
      const user = userResp.data.user
      if (!user) {
        setError('You must be logged in to edit a course.')
        setLoading(false)
        return
      }
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
      if (data.creator_id !== user.id) {
        setError('You can only edit your own courses.')
        setLoading(false)
        return
      }
      setName(data.name)
      setDescription(data.description || '')
      setOwner(true)
      setLoading(false)
    }
    fetchCourse()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase
      .from('courses')
      .update({ name, description })
      .eq('id', id)
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/courses')
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!owner) return null

  return (
    <div>
      <h1>Edit Course</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course Name:</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && <div>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}