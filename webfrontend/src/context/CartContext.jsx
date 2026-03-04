import { createContext, useContext, useReducer, useCallback, useEffect, useState } from "react";
import { products } from "../data/products";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "girls-dresses-cart";

function serializeItem(item) {
  return {
    productId: item.product.id,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
  };
}

function deserializeItem(serialized) {
  const product = products.find((p) => p.id === serialized.productId);
  if (!product) return null;
  return {
    key: `${product.id}-${serialized.size}-${serialized.color}`,
    product,
    size: serialized.size,
    color: serialized.color,
    quantity: serialized.quantity,
  };
}

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    const items = (parsed.items || [])
      .map(deserializeItem)
      .filter(Boolean);
    return { items };
  } catch {
    return { items: [] };
  }
}

const initialState = { items: [] };

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, size, color, quantity = 1 } = action.payload;
      const key = `${product.id}-${size}-${color}`;
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            key,
            product,
            size,
            color,
            quantity,
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.key !== action.payload) };
    case "UPDATE_QUANTITY": {
      const { key, quantity } = action.payload;
      if (quantity < 1) return { items: state.items.filter((i) => i.key !== key) };
      return {
        items: state.items.map((i) =>
          i.key === key ? { ...i, quantity } : i
        ),
      };
    }
    case "CLEAR_CART":
      return initialState;
    case "HYDRATE":
      return { items: action.payload ?? [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadCartFromStorage();
    dispatch({ type: "HYDRATE", payload: stored.items });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const toStore = {
      items: state.items.map(serializeItem),
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(toStore));
  }, [state.items, hydrated]);

  const addItem = useCallback((product, size, color, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, size, color, quantity } });
  }, []);

  const removeItem = useCallback((key) => {
    dispatch({ type: "REMOVE_ITEM", payload: key });
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { key, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const getItemTotal = (item) => {
    const price = item.product.discount ?? item.product.price;
    return price * item.quantity;
  };

  const subtotal = state.items.reduce((sum, item) => sum + getItemTotal(item), 0);
  const tax = Math.round(subtotal * 0.05);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + tax + shipping;

  const value = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemTotal,
    subtotal,
    tax,
    shipping,
    total,
    count: state.items.reduce((c, i) => c + i.quantity, 0),
    hydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
