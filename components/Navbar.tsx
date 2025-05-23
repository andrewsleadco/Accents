// components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full p-4 bg-gray-100 flex items-center justify-between">
      <Link href="/dashboard" className="text-blue-600 hover:underline text-lg font-semibold">
        ← Back to Dashboard
      </Link>
      {/* Add any other nav items here */}
    </nav>
  );
}