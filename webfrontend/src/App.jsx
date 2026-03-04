import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider, WishlistProvider, AuthProvider, ProfileProvider, ToastProvider, ThemeProvider } from "./context";
import { Layout } from "./components";
import {
  Home,
  Shop,
  ProductDetails,
  Cart,
  Wishlist,
  Checkout,
  Login,
  Register,
  ForgotPassword,
  Profile,
  Orders,
  NotFound,
} from "./pages";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
        <ProfileProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
