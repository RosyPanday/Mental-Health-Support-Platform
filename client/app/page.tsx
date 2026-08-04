import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <h1 className="text-3xl font-bold">Mental Health Support Platform</h1>
      <p className="text-gray-600">Welcome to the platform!</p>
      
      <Link 
        href="/signup" 
        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
      >
        Go to Sign Up Page
      </Link>
    </div>
  );
}