import prisma from "../db.server";

export async function loader() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(posts);
}
