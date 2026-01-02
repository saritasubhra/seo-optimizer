import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const posts = await prisma.post.findMany({
    where: {
      shop: shop,
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(posts);
}
