import { Prisma } from "@prisma/client";

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

export type ItemsCategory = {
  id: string;
  name: string;
  count: number;
  created_at: Date;
  updated_at: Date;
};

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

export type SaleWithCustomerAndItems = Prisma.SaleGetPayload<{
  include: {
    customer: { select: { name: true; id: true } };
    _count: { select: { sale_items: true } };
    sale_items: {
      select: {
        product_id: true;
        quantity: true;
        unit_price: true;
        total_price: true;
        product: {
          select: {
            name: true;
            image: true;
          };
        };
      };
    };
  };
}>;

export type CustomerWithSales = Prisma.CustomerGetPayload<{
  include: {
    sales: {
      include: {
        customer: { select: { name: true; id: true } };
        _count: { select: { sale_items: true } };
        sale_items: {
          select: {
            product_id: true;
            quantity: true;
            unit_price: true;
            total_price: true;
            product: {
              select: {
                name: true;
                image: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type Repayment = Prisma.RepaymentGetPayload<{
  include: {
    sale: false;
  };
}>;

export type SaleWithCustomerWithRepaymentsAndItems = Prisma.SaleGetPayload<{
  include: {
    customer: { select: { name: true; id: true } };
    _count: { select: { sale_items: true } };
    sale_items: {
      select: {
        product_id: true;
        quantity: true;
        unit_price: true;
        total_price: true;
        product: {
          select: {
            name: true;
            image: true;
          };
        };
      };
    };
    repayments: true;
  };
}>;
