import prisma from "../db.server";

export const action = async ({ request }) => {
  const { id } = await request.json();

  await prisma.post.delete({
    where: { id },
  });

  return Response.json({ success: true });
};
