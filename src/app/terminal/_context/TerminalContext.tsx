"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import { authClient } from "@/lib/auth-client";

// Using a simplified type for Product to avoid complex Prisma imports in the context unless necessary
export type TerminalProduct = {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost_price: number;
  stock_qty: number;
  image?: string | null;
  category?: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
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
  updatePrice: (productId: string, price: number) => void;
  clearCart: () => void;
  cartTotal: number;

  selectedCustomer: Customer | null;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;

  amountPaid: string;
  setAmountPaid: (amount: string) => void;

  products: TerminalProduct[];

  exchangeRate: number | undefined;

  repaymentDate: Date | undefined;
  setRepaymentDate: (date: Date | undefined) => void;

  sellerId: string | null;
}

const TerminalContext = createContext<TerminalContextValue | null>(null);

export function TerminalProvider({
  children,
  initialProducts,
  customer,
  exchangeRate,
}: {
  children: ReactNode;
  initialProducts: TerminalProduct[];
  customer?: Customer | null;
  exchangeRate: number | undefined;
}) {
  const [products] = useState<TerminalProduct[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    customer || null,
  );
  const [paymentMethod, setPaymentMethod] = useState("ZAAD");
  const [amountPaid, setAmountPaid] = useState("");
  const [repaymentDate, setRepaymentDate] = useState<Date | undefined>(
    undefined,
  );

  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;
  let sellerId: string | null = null;
  if (user && !sessionLoading) {
    sellerId = user.id;
  }

  const addToCart = useCallback((product: TerminalProduct) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item: CartItem) => item.product.id === product.id,
      );
      if (existing) {
        return prev.map((item: CartItem) =>
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
      prev.filter((item: CartItem) => item.product.id !== productId),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCartItems((prev) =>
        prev.map((item: CartItem) =>
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

  function updatePrice(productId: string, price: number) {
    setCartItems((prev) =>
      prev.map((item: CartItem) =>
        item.product.id === productId
          ? {
              ...item,
              product: { ...item.product, price },
              subtotal: item.quantity * price,
            }
          : item,
      ),
    );
  }

  const clearCart = useCallback(() => {
    setCartItems([]);
    setSelectedCustomer(null);
    setPaymentMethod("cash");
    setAmountPaid("");
  }, []);

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (total: number, item: CartItem) => total + item.subtotal,
      0,
    );
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    selectedCustomer,
    paymentMethod,
    setPaymentMethod,
    amountPaid,
    setAmountPaid,
    products,
    updatePrice,
    exchangeRate,
    repaymentDate,
    setRepaymentDate,
    sellerId,
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
