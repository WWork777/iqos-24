import { NextResponse } from "next/server";

interface BatchStockRequest {
  refs: string[];
}

export async function POST(req: Request) {
  try {
    const { refs }: BatchStockRequest = await req.json();

    if (!Array.isArray(refs)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const uniqueRefs = [...new Set(refs)];
    const stockResults: Record<string, any> = {};

    await Promise.all(
      uniqueRefs.map(async (ref) => {
        try {
          const res = await fetch(`http://localhost:3001/api/product/${ref}`);

          if (res.ok) {
            const productData = await res.json();

            stockResults[ref] = productData;
          } else {
            stockResults[ref] = null;
          }
        } catch (error) {
          stockResults[ref] = null;
        }
      })
    );

    return NextResponse.json(stockResults);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
