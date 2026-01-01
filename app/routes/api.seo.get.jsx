import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  await authenticate.admin(request);

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json(post);
}
