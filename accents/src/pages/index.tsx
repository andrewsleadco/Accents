import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Course Site</h1>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
        <Link href="/dashboard">Dashboard</Link>
      </nav>
      <p>Welcome to the prototype. Use the links above to get started.</p>
    </div>
  )
}
