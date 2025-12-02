import { prisma } from "../db.server";

export async function action({ request }) {
  const body = await request.json();

  const { id, title, content, keyword, score } = body;

  if (!title) return Response.json({ error: "Missing title" }, { status: 400 });

  if (id) {
    const updated = await prisma.post.update({
      where: { id },
      data: { title, content, keyword, score },
    });
    return Response.json(updated);
  }

  const created = await prisma.post.create({
    data: { title, content, keyword, score },
  });

  return Response.json(created);
}
