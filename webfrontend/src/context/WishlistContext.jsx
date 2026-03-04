import { createContext, useContext, useReducer, useCallback } from "react";

const WishlistContext = createContext(null);

const initialState = {
  items: [],
};

function wishlistReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const id = action.payload;
      if (state.items.includes(id)) return state;
      return { items: [...state.items, id] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((id) => id !== action.payload) };
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  const addItem = useCallback((productId) => {
    dispatch({ type: "ADD_ITEM", payload: productId });
  }, []);

  const removeItem = useCallback((productId) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  }, []);

  const toggleItem = useCallback((productId) => {
    if (state.items.includes(productId)) {
      dispatch({ type: "REMOVE_ITEM", payload: productId });
    } else {
      dispatch({ type: "ADD_ITEM", payload: productId });
    }
  }, [state.items]);

  const clearWishlist = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const isInWishlist = useCallback(
    (productId) => state.items.includes(productId),
    [state.items]
  );

  const value = {
    items: state.items,
    addItem,
    removeItem,
    toggleItem,
    clearWishlist,
    isInWishlist,
    count: state.items.length,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
