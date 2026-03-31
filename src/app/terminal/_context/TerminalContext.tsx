"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
} from "react";

// Using a simplified type for Product to avoid complex Prisma imports in the context unless necessary
export type TerminalProduct = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock_qty: number;
  image?: string | null;
  category?: string;
};

export type CartItem = {
  product: TerminalProduct;
  quantity: number;
  subtotal: number;
};

interface TerminalContextValue {
  cartItems: CartItem[];
  addToCart: (product: TerminalProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  selectedCustomer: string | null;
  setSelectedCustomer: (id: string | null) => void;

  paymentMethod: string;
  setPaymentMethod: (method: string) => void;

  amountPaid: string;
  setAmountPaid: (amount: string) => void;

  products: TerminalProduct[];
}

const TerminalContext = createContext<TerminalContextValue | null>(null);

export function TerminalProvider({
  children,
  initialProducts,
}: {
  children: ReactNode;
  initialProducts: TerminalProduct[];
}) {
  const [products] = useState<TerminalProduct[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("ZAAD");
  const [amountPaid, setAmountPaid] = useState("");

  const addToCart = useCallback((product: TerminalProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.product.price,
              }
            : item,
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          subtotal: product.price,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity,
                subtotal: quantity * item.product.price,
              }
            : item,
        ),
      );
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setSelectedCustomer(null);
    setPaymentMethod("cash");
    setAmountPaid("");
  }, []);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    selectedCustomer,
    setSelectedCustomer,
    paymentMethod,
    setPaymentMethod,
    amountPaid,
    setAmountPaid,
    products,
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
}
