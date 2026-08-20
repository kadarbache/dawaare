import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

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
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export { GET };
