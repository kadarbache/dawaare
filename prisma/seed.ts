import { PrismaClient, PaymentMethod } from "./app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";
dotenv.config();
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Return a random integer between min and max (inclusive) */
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Return a random element from an array */
function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)];
}

/** Return a random Date between two dates */
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

/** Round a float to 2 decimal places */
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// ─── Date range ─────────────────────────────────────────────────────────────

const SEED_START = new Date("2026-01-01T08:00:00.000Z");
const SEED_END = new Date();

// ─── Product catalogue ───────────────────────────────────────────────────────

const PRODUCTS = [
  // Electronics
  {
    name: "Samsung Galaxy A55",
    sku: "ELC-001",
    category: "Electronics",
    price: 320.0,
    cost_price: 240.0,
    stock_qty: 18,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
    public_id: "fake_pid_elc_001",
  },
  {
    name: "Apple AirPods Pro",
    sku: "ELC-002",
    category: "Electronics",
    price: 180.0,
    cost_price: 130.0,
    stock_qty: 25,
    image:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&q=80",
    public_id: "fake_pid_elc_002",
  },
  {
    name: "Xiaomi Smart Watch",
    sku: "ELC-003",
    category: "Electronics",
    price: 95.0,
    cost_price: 60.0,
    stock_qty: 30,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    public_id: "fake_pid_elc_003",
  },
  {
    name: "USB-C Hub 7-in-1",
    sku: "ELC-004",
    category: "Electronics",
    price: 45.0,
    cost_price: 25.0,
    stock_qty: 50,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",
    public_id: "fake_pid_elc_004",
  },
  {
    name: "Anker 65W Charger",
    sku: "ELC-005",
    category: "Electronics",
    price: 38.0,
    cost_price: 22.0,
    stock_qty: 60,
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80",
    public_id: "fake_pid_elc_005",
  },

  // Clothing
  {
    name: "Men's Slim Fit Jeans",
    sku: "CLT-001",
    category: "Clothing",
    price: 42.0,
    cost_price: 20.0,
    stock_qty: 40,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
    public_id: "fake_pid_clt_001",
  },
  {
    name: "Women's Floral Dress",
    sku: "CLT-002",
    category: "Clothing",
    price: 55.0,
    cost_price: 28.0,
    stock_qty: 30,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80",
    public_id: "fake_pid_clt_002",
  },
  {
    name: "Classic Hoodie - Black",
    sku: "CLT-003",
    category: "Clothing",
    price: 48.0,
    cost_price: 24.0,
    stock_qty: 35,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80",
    public_id: "fake_pid_clt_003",
  },
  {
    name: "Sport Sneakers - Nike",
    sku: "CLT-004",
    category: "Clothing",
    price: 90.0,
    cost_price: 55.0,
    stock_qty: 20,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    public_id: "fake_pid_clt_004",
  },
  {
    name: "Leather Belt",
    sku: "CLT-005",
    category: "Clothing",
    price: 22.0,
    cost_price: 10.0,
    stock_qty: 80,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    public_id: "fake_pid_clt_005",
  },

  // Home & Kitchen
  {
    name: "Electric Kettle 1.7L",
    sku: "HMK-001",
    category: "Home & Kitchen",
    price: 32.0,
    cost_price: 18.0,
    stock_qty: 25,
    image:
      "https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?w=400&q=80",
    public_id: "fake_pid_hmk_001",
  },
  {
    name: "Ceramic Dinner Set (6pcs)",
    sku: "HMK-002",
    category: "Home & Kitchen",
    price: 75.0,
    cost_price: 40.0,
    stock_qty: 15,
    image:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80",
    public_id: "fake_pid_hmk_002",
  },
  {
    name: "Non-Stick Frying Pan",
    sku: "HMK-003",
    category: "Home & Kitchen",
    price: 28.0,
    cost_price: 14.0,
    stock_qty: 40,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    public_id: "fake_pid_hmk_003",
  },
  {
    name: "Blender 600W",
    sku: "HMK-004",
    category: "Home & Kitchen",
    price: 55.0,
    cost_price: 30.0,
    stock_qty: 20,
    image:
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80",
    public_id: "fake_pid_hmk_004",
  },
  {
    name: "Stainless Steel Thermos",
    sku: "HMK-005",
    category: "Home & Kitchen",
    price: 18.0,
    cost_price: 9.0,
    stock_qty: 60,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80",
    public_id: "fake_pid_hmk_005",
  },

  // Beauty & Personal Care
  {
    name: "Vitamin C Serum 30ml",
    sku: "BPC-001",
    category: "Beauty & Personal Care",
    price: 25.0,
    cost_price: 12.0,
    stock_qty: 45,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
    public_id: "fake_pid_bpc_001",
  },
  {
    name: "Perfume - Oud Collection 50ml",
    sku: "BPC-002",
    category: "Beauty & Personal Care",
    price: 65.0,
    cost_price: 35.0,
    stock_qty: 22,
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80",
    public_id: "fake_pid_bpc_002",
  },
  {
    name: "Electric Shaver Pro",
    sku: "BPC-003",
    category: "Beauty & Personal Care",
    price: 55.0,
    cost_price: 30.0,
    stock_qty: 18,
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
    public_id: "fake_pid_bpc_003",
  },

  // Food & Beverages
  {
    name: "Organic Green Tea (50 bags)",
    sku: "FDB-001",
    category: "Food & Beverages",
    price: 12.0,
    cost_price: 6.0,
    stock_qty: 100,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
    public_id: "fake_pid_fdb_001",
  },
  {
    name: "Premium Arabica Coffee 500g",
    sku: "FDB-002",
    category: "Food & Beverages",
    price: 18.0,
    cost_price: 10.0,
    stock_qty: 80,
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80",
    public_id: "fake_pid_fdb_002",
  },
  {
    name: "Almond Butter 350g",
    sku: "FDB-003",
    category: "Food & Beverages",
    price: 14.0,
    cost_price: 7.5,
    stock_qty: 55,
    image:
      "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=400&q=80",
    public_id: "fake_pid_fdb_003",
  },

  // Stationery
  {
    name: "Notebook A5 - Hardcover",
    sku: "STN-001",
    category: "Stationery",
    price: 8.0,
    cost_price: 3.5,
    stock_qty: 120,
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80",
    public_id: "fake_pid_stn_001",
  },
  {
    name: "Parker Ballpoint Pen Set",
    sku: "STN-002",
    category: "Stationery",
    price: 15.0,
    cost_price: 7.0,
    stock_qty: 90,
    image:
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&q=80",
    public_id: "fake_pid_stn_002",
  },
] as const;

// ─── Payment methods ─────────────────────────────────────────────────────────

// Weight: cash used most, then ZAAD, then E_DAHAB
function randomPaymentMethod(): PaymentMethod {
  const r = Math.random();
  if (r < 0.55) return PaymentMethod.CASH;
  if (r < 0.85) return PaymentMethod.ZAAD;
  return PaymentMethod.E_DAHAB;
}

// ─── Sale notes (optional walk-in notes) ─────────────────────────────────────

const NOTES_POOL = [
  null,
  null,
  null,
  "Walk-in customer – no receipt requested",
  "Customer paid in exact change",
  "Bulk purchase – slight discount applied",
  "Rush purchase before closing",
  "Regular walk-in",
  null,
  null,
];

// ─── Low stock threshold ─────────────────────────────────────────────────────

const LOW_STOCK_THRESHOLD = 10;

// ─── Main seed ───────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...\n");

  // ── 1. Clear existing data (order matters for FK constraints) ─────────────
  console.log("🗑️  Clearing existing data...");
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  console.log("   Done.\n");

  // ── 2. Seed products ──────────────────────────────────────────────────────
  console.log("📦 Seeding products...");
  const createdProducts = await Promise.all(
    PRODUCTS.map((p) =>
      prisma.product.create({
        data: {
          name: p.name,
          sku: p.sku,
          category: p.category,
          price: p.price,
          cost_price: p.cost_price,
          stock_qty: p.stock_qty,
          is_low_stock: p.stock_qty <= LOW_STOCK_THRESHOLD,
          image: p.image,
          public_id: p.public_id,
        },
      }),
    ),
  );
  console.log(`   ✅ ${createdProducts.length} products created.\n`);

  // ── 3. Seed sales (walk-in, Jan 2026 – Apr 2 2026) ───────────────────────
  console.log("🛒 Seeding sales...");

  // We target roughly 3–6 sales per day across ~92 days ≈ ~340 sales
  // We'll generate a specific number and spread them with randomDate()
  const TOTAL_SALES = 380;

  let totalSalesCreated = 0;

  for (let i = 0; i < TOTAL_SALES; i++) {
    const saleDate = randomDate(SEED_START, SEED_END);

    // Each sale has 1–4 line items
    const itemCount = rand(1, 4);

    // Pick unique products for this sale
    const shuffled = [...createdProducts].sort(() => Math.random() - 0.5);
    const selectedProducts = shuffled.slice(0, itemCount);

    // Build line items
    const lineItems = selectedProducts.map((product) => {
      const qty = rand(1, 5);
      const unit_price = product.price;
      const total_price = round2(qty * unit_price);
      return {
        product_id: product.id,
        product_name: product.name,
        quantity: qty,
        unit_price,
        total_price,
      };
    });

    const total_amount = round2(
      lineItems.reduce((sum, li) => sum + li.total_price, 0),
    );

    const payment_method = randomPaymentMethod();

    // Occasionally create a partial payment (unpaid/partial) – ~10% of sales
    const paymentChance = Math.random();
    let amount_paid: number;
    let remaining: number;
    let status: string;

    if (paymentChance < 0.08) {
      // partial payment
      amount_paid = round2(total_amount * (rand(30, 80) / 100));
      remaining = round2(total_amount - amount_paid);
      status = "partial";
    } else if (paymentChance < 0.02) {
      // unpaid (very rare)
      amount_paid = 0;
      remaining = total_amount;
      status = "unpaid";
    } else {
      // fully paid
      amount_paid = total_amount;
      remaining = 0;
      status = "paid";
    }

    const notes = pick(NOTES_POOL);

    await prisma.sale.create({
      data: {
        customer_id: null, // walk-in
        total_amount,
        amount_paid,
        remaining,
        status,
        payment_method,
        notes,
        created_at: saleDate,
        updated_at: saleDate,
        sale_items: {
          create: lineItems.map((li) => ({
            product_id: li.product_id,
            product_name: li.product_name,
            quantity: li.quantity,
            unit_price: li.unit_price,
            total_price: li.total_price,
            created_at: saleDate,
            updated_at: saleDate,
          })),
        },
      },
    });

    totalSalesCreated++;
  }

  console.log(`   ✅ ${totalSalesCreated} sales created (all walk-in).\n`);

  // ── 4. Summary ────────────────────────────────────────────────────────────
  const [productCount, saleCount, saleItemCount] = await Promise.all([
    prisma.product.count(),
    prisma.sale.count(),
    prisma.saleItem.count(),
  ]);

  console.log("─────────────────────────────────────────");
  console.log("✅ Seed complete!");
  console.log(`   Products  : ${productCount}`);
  console.log(`   Sales     : ${saleCount}`);
  console.log(`   Sale items: ${saleItemCount}`);
  console.log(`   Customers : 0 (walk-in only)`);
  console.log("─────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
