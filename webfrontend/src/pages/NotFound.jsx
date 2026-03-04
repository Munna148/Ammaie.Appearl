import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="text-8xl">👗</span>
      <h1 className="mt-4 text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-lg text-gray-600">Page not found. This dress might have been moved.</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-rose-500 px-8 py-3 font-medium text-white hover:bg-rose-600"
      >
        Back to Home
      </Link>
    </div>
  );
}
