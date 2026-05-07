import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-charcoal text-white antialiased">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="rounded-lg bg-cyan-600 px-6 py-3 text-white font-medium hover:bg-cyan-500 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
