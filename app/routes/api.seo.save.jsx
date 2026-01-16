import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const body = await request.json();
  const { id, title, content, keyword, score } = body;

  if (!title) return Response.json({ error: "Missing title" }, { status: 400 });

  if (id) {
    const updated = await prisma.post.updateMany({
      where: {
        id: id,
        shop: shop,
      },
      data: { title, content, keyword, score },
    });
    return Response.json(updated);
  }

  const created = await prisma.post.create({
    data: {
      title,
      content,
      keyword,
      score,
      shop: shop,
    },
  });

  return Response.json(created);
}
