import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { Breadcrumb } from "../components";
import { ProductCard } from "../components";
import { products } from "../data/products";

export function Wishlist() {
  const { items: wishlistIds } = useWishlist();
  const { addItem } = useCart();
  const { addToast } = useToast();

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const moveToCart = (product) => {
    addItem(product, product.sizes?.[0] ?? "M", product.colors?.[0] ?? "", 1);
    addToast("Moved to cart!");
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Wishlist" }]} />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/30 py-20 text-center">
          <span className="text-6xl">❤️</span>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Your wishlist is empty</h2>
          <p className="mt-2 text-gray-600">Save your favorite dresses for later.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-full bg-rose-500 px-8 py-3 font-medium text-white hover:bg-rose-600"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Wishlist" }]} />
      <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
      <p className="mt-1 text-gray-600">{wishlistProducts.length} item(s)</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {wishlistProducts.map((product) => (
          <div key={product.id} className="group relative">
            <ProductCard product={product} showQuickAdd={false} />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => moveToCart(product)}
                className="flex-1 rounded-lg bg-rose-500 py-2 text-sm font-medium text-white hover:bg-rose-600"
              >
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
