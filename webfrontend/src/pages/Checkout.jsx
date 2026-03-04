import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { Breadcrumb } from "../components";
import { ProtectedRoute } from "../components";

function CheckoutForm() {
  const { items, subtotal, tax, shipping, total, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!shippingForm.fullName?.trim()) e.fullName = "Required";
    if (!shippingForm.email?.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingForm.email)) e.email = "Invalid email";
    if (!shippingForm.phone?.trim()) e.phone = "Required";
    if (!shippingForm.address?.trim()) e.address = "Required";
    if (!shippingForm.city?.trim()) e.city = "Required";
    if (!shippingForm.pincode?.trim()) e.pincode = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    clearCart();
    addToast("Order placed successfully!");
    navigate("/orders");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-gray-600">Your cart is empty.</p>
        <Link to="/shop" className="mt-4 inline-block text-rose-600 hover:underline">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ to: "/cart", label: "Cart" }, { label: "Checkout" }]} />
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border border-rose-100 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={shippingForm.fullName}
                  onChange={(e) => setShippingForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={shippingForm.email}
                  onChange={(e) => setShippingForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={shippingForm.phone}
                  onChange={(e) => setShippingForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={shippingForm.address}
                  onChange={(e) => setShippingForm((f) => ({ ...f, address: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2"
                  placeholder="Street, building"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={shippingForm.city}
                  onChange={(e) => setShippingForm((f) => ({ ...f, city: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={shippingForm.state}
                  onChange={(e) => setShippingForm((f) => ({ ...f, state: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pincode</label>
                <input
                  type="text"
                  value={shippingForm.pincode}
                  onChange={(e) => setShippingForm((f) => ({ ...f, pincode: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2"
                />
                {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-rose-100 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
            <div className="mt-4 space-y-3">
              {[
                { id: "card", label: "Card", icon: "💳" },
                { id: "upi", label: "UPI", icon: "📱" },
                { id: "cod", label: "Cash on Delivery", icon: "💵" },
              ].map((pm) => (
                <label
                  key={pm.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 ${paymentMethod === pm.id ? "border-rose-500 bg-rose-50" : "border-rose-100"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={pm.id}
                    checked={paymentMethod === pm.id}
                    onChange={() => setPaymentMethod(pm.id)}
                    className="text-rose-600"
                  />
                  <span className="text-2xl">{pm.icon}</span>
                  <span className="font-medium">{pm.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-rose-100 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            <ul className="mt-4 max-h-60 space-y-2 overflow-y-auto">
              {items.map((item) => (
                <li key={item.key} className="flex justify-between text-sm">
                  <span className="line-clamp-1">{item.product.name} × {item.quantity}</span>
                  <span>₹{((item.product.discount ?? item.product.price) * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-rose-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>₹{subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Tax</dt>
                <dd>₹{tax.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : `₹${shipping}`}</dd>
              </div>
              <div className="flex justify-between border-t border-rose-100 pt-4 font-semibold">
                <dt>Total</dt>
                <dd>₹{total.toLocaleString()}</dd>
              </div>
            </dl>
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-rose-500 py-3 font-medium text-white hover:bg-rose-600"
            >
              Place Order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export function Checkout() {
  return (
    <ProtectedRoute>
      <CheckoutForm />
    </ProtectedRoute>
  );
}
