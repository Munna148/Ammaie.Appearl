import { Link } from "react-router-dom";

export function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
        <li>
          <Link to="/" className="hover:text-rose-600">Home</Link>
        </li>
        {items?.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <span className="text-gray-300">/</span>
            {item.to ? (
              <Link to={item.to} className="hover:text-rose-600">{item.label}</Link>
            ) : (
              <span className="text-gray-800 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
