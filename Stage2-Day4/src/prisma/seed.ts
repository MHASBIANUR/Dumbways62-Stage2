import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear old data (urutan penting karena foreign key)
  await prisma.order.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.supplierStock.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const usersData = [
  { name: "bayu", email: "bayu@example.com", points: 1500 },
  { name: "anur", email: "anur@example.com", points: 800 },
  { name: "rudi", email: "rudi@example.com", points: 300 },
  { name: "sinta", email: "sinta@example.com", points: 1200 },
  { name: "mega", email: "mega@example.com", points: 950 },
];

  const users = [];
  for (const u of usersData) {
    const user = await prisma.user.create({ data: u });
    users.push(user);
  }

  // Create Suppliers
  const suppliersData = [
  { name: "Supplier A" },
  { name: "Supplier B" },
  { name: "Supplier C" },
  { name: "Supplier D" },
  { name: "Supplier E" },
];

  const suppliers = [];
  for (const s of suppliersData) {
    const supplier = await prisma.supplier.create({ data: s });
    suppliers.push(supplier);
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
    const product = await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        stock: p.stock,
      },
    });
    products.push(product);
  }

  // Create SupplierStock (hubungkan product ke supplier)
  const supplierStocksData = [
  { supplierIndex: 0, productIndex: 0, stock: 20 }, // Supplier A - Baju
  { supplierIndex: 1, productIndex: 1, stock: 30 }, // Supplier B - Parfum
  { supplierIndex: 2, productIndex: 2, stock: 40 }, // Supplier C - Celana
  { supplierIndex: 3, productIndex: 3, stock: 50 }, // Supplier D - Jam Tangan
  { supplierIndex: 4, productIndex: 4, stock: 60 }, // Supplier E - Topi
];

  for (const ss of supplierStocksData) {
    await prisma.supplierStock.create({
      data: {
        supplierId: suppliers[ss.supplierIndex].id,
        productId: products[ss.productIndex].id,
        stock: ss.stock,
      },
    });
  }

  // Create Posts
  const postsData = [
  { title: "Judul Post 1", content: "Isi Post 1", category: "Teknologi", authorIndex: 0 },
  { title: "Judul Post 2", content: "Isi Post 2", category: "Hiburan", authorIndex: 1 },
  { title: "Judul Post 3", content: "Isi Post 3", category: "Olahraga", authorIndex: 2 },
  { title: "Judul Post 4", content: "Isi Post 4", category: "Teknologi", authorIndex: 3 },
  { title: "Judul Post 5", content: "Isi Post 5", category: "Hiburan", authorIndex: 4 },
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
    posts.push(post);
  }

  // Create Comments
  const commentsData = [
    { postIndex: 0, content: "Komentar pertama untuk Post 1" },
    { postIndex: 1, content: "Komentar kedua untuk Post 2" },
    { postIndex: 2, content: "Komentar ketiga untuk Post 3" },
    { postIndex: 3, content: "Komentar keempat untuk Post 4" },
    { postIndex: 4, content: "Komentar kelima untuk Post 5" },
  ];

  for (const c of commentsData) {
    await prisma.comment.create({
      data: {
        content: c.content,
        postId: posts[c.postIndex].id,
      },
    });
  }

  // Create Orders
  const ordersData = [
  { userIndex: 0, productIndex: 0, quantity: 2 },
  { userIndex: 1, productIndex: 1, quantity: 1 },
  { userIndex: 2, productIndex: 2, quantity: 3 },
  { userIndex: 3, productIndex: 3, quantity: 1 },
  { userIndex: 4, productIndex: 4, quantity: 2 },
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
