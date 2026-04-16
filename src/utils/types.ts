export type Sale = {
  id: string;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  customer_id: string | null;
  total_amount: number;
  amount_paid: number;
  remaining: number;
  status: string;
  payment_method: PaymentMethod;
};

enum PaymentMethod {
  ZAAD,
  E_DAHAB,
  CASH,
}

import { Prisma } from "@prisma/client";

// This defines a type for a Sale that MUST include its sale_items
export type SaleWithItems = Prisma.SaleGetPayload<{
  include: {
    sale_items: true;
  };
}>;

export type SaleItem = Prisma.SaleItemGetPayload<{
  include: {
    sale: false;
    product: false;
  };
}>;

export type SaleItemWithSaleAndCustomer = Prisma.SaleItemGetPayload<{
  include: {
    sale: {
      include: {
        customer: true;
      };
    };
    product: false;
  };
}>;

export type Product = Prisma.ProductGetPayload<{
  include: {
    sale_items: false;
  };
}>;

export type SaleItemsWithProductCostPrice = Prisma.SaleItemGetPayload<{
  include: {
    product: {
      select: {
        cost_price: true;
      };
    };
  };
}>;

export type RecentTransactionsWithCustomerName = Prisma.SaleGetPayload<{
  include: {
    customer: {
      select: {
        name: true;
      };
    };
  };
}>;

export type Customer = Prisma.CustomerGetPayload<{
  include: {
    sales: false;
  };
}>;
