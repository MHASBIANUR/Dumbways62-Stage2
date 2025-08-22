import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.order.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const usersData = [
    { name: "hasbi", email: "hasbi@example.com" },
    { name: "anur", email: "anur@example.com" },
    { name: "rudi", email: "rudi@example.com" },
  ];

  const users = [];
  for (const u of usersData) {
    const user = await prisma.user.create({ data: u });
    users.push(user); // simpan user beserta id-nya
  }

  // Create Products
  const productsData = [
    { name: "Baju", price: 400_000, stock: 20 },
    { name: "Parfum", price: 700_000, stock: 30 },
    { name: "Celana", price: 500_000, stock: 40 },
    { name: "Jam Tangan", price: 1_000_000, stock: 50 },
    { name: "Topi", price: 350_000, stock: 60 },
  ];

  const products = [];
  for (const p of productsData) {
    const product = await prisma.product.create({ data: p });
    products.push(product);
  }

  // Create Posts
  const postsData = [
    { title: "Judul Post 1", content: "Isi Post 1", category: "Teknologi", authorIndex: 0 },
    { title: "Judul Post 2", content: "Isi Post 2", category: "Hiburan", authorIndex: 1 },
    { title: "Judul Post 3", content: "Isi Post 3", category: "Olahraga", authorIndex: 2 },
  ];

  const posts = [];
  for (const p of postsData) {
    const post = await prisma.post.create({
      data: {
        title: p.title,
        content: p.content,
        category: p.category,
        authorId: users[p.authorIndex].id,
      },
    });
    posts.push(post); // simpan post beserta id-nya
  }

 
  // Create Comments
  const commentsData = [
    { postIndex: 0, content: "Komentar pertama untuk Post 1" },
    { postIndex: 0, content: "Komentar kedua untuk Post 1" },
    { postIndex: 1, content: "Komentar pertama untuk Post 2" },
    { postIndex: 2, content: "Komentar pertama untuk Post 3" },
    { postIndex: 0, content: "Komentar ketiga untuk Post 1" },
  ];

  for (const c of commentsData) {
    await prisma.comment.create({
      data: {
        content: c.content,
        postId: posts[c.postIndex].id, // gunakan id post yang sudah dibuat
      },
    });
  }


  // Create Orders
  const ordersData = [
    { userIndex: 0, productIndex: 0, quantity: 2 },
    { userIndex: 0, productIndex: 1, quantity: 1 },
    { userIndex: 1, productIndex: 2, quantity: 1 },
    { userIndex: 1, productIndex: 3, quantity: 2 },
    { userIndex: 2, productIndex: 1, quantity: 4 },
    { userIndex: 2, productIndex: 4, quantity: 3 },
  ];

  for (const o of ordersData) {
    await prisma.order.create({
      data: {
        userId: users[o.userIndex].id,
        productId: products[o.productIndex].id,
        quantity: o.quantity,
      },
    });
  }

  console.log("✅ Seeding completed :)");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
