import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function AddCoursePage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const userResp = await supabase.auth.getUser()
    const user = userResp.data.user
    if (!user) {
      setError('You must be logged in to add a course.')
      setLoading(false)
      return
    }
    const { error } = await supabase
      .from('courses')
      .insert([{ name, description, creator_id: user.id }])
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/courses')
  }

  return (
    <div>
      <h1>Add Course</h1>
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
          {loading ? 'Adding...' : 'Add Course'}
        </button>
      </form>
    </div>
  )
}