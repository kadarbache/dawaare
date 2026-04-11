import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return Response.json([]);
  }

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      price: true,
      sku: true,
      stock_qty: true,
      is_low_stock: true,
    },
    take: 20,
  });

  return Response.json(products);
}

export { GET };
