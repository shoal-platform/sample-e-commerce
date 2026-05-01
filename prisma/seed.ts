import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        name: "Electronics",
        slug: "electronics",
        description: "Latest gadgets and electronic devices",
        image: "https://picsum.photos/seed/electronics/800/600",
      },
    }),
    prisma.category.upsert({
      where: { slug: "clothing" },
      update: {},
      create: {
        name: "Clothing",
        slug: "clothing",
        description: "Fashion and apparel for all occasions",
        image: "https://picsum.photos/seed/clothing/800/600",
      },
    }),
    prisma.category.upsert({
      where: { slug: "books" },
      update: {},
      create: {
        name: "Books",
        slug: "books",
        description: "Books, eBooks, and educational materials",
        image: "https://picsum.photos/seed/books/800/600",
      },
    }),
    prisma.category.upsert({
      where: { slug: "home" },
      update: {},
      create: {
        name: "Home & Garden",
        slug: "home",
        description: "Everything for your home and garden",
        image: "https://picsum.photos/seed/home/800/600",
      },
    }),
    prisma.category.upsert({
      where: { slug: "sports" },
      update: {},
      create: {
        name: "Sports & Outdoors",
        slug: "sports",
        description: "Sports equipment and outdoor gear",
        image: "https://picsum.photos/seed/sports/800/600",
      },
    }),
  ]);

  const [electronics, clothing, books, home, sports] = categories;

  console.log("Categories created");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 12);
  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "user@example.com",
      password: userPassword,
      role: "USER",
    },
  });

  console.log("Users created");

  // Create products
  const products = [
    // Electronics
    {
      name: "Apple MacBook Pro 14-inch M3",
      slug: "macbook-pro-14-m3",
      description:
        "The most powerful MacBook Pro ever. With M3 Pro and M3 Max chips, MacBook Pro delivers groundbreaking performance for demanding workflows. Features a stunning Liquid Retina XDR display, up to 22 hours of battery life, and a comprehensive array of ports.",
      price: 1999.99,
      comparePrice: 2199.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/macbook1/800/600",
        "https://picsum.photos/seed/macbook2/800/600",
        "https://picsum.photos/seed/macbook3/800/600",
      ]),
      categoryId: electronics.id,
      stock: 50,
      rating: 4.8,
      reviewCount: 324,
      featured: true,
      brand: "Apple",
      sku: "MBPM3-14-SLV",
      weight: 1.55,
      colors: JSON.stringify(["Space Black", "Silver"]),
    },
    {
      name: "Sony WH-1000XM5 Wireless Headphones",
      slug: "sony-wh1000xm5",
      description:
        "Industry-leading noise canceling with two processors and eight microphones. 30-hour battery life with quick charging. Speak-to-chat technology automatically reduces volume during conversations.",
      price: 349.99,
      comparePrice: 399.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/sony1/800/600",
        "https://picsum.photos/seed/sony2/800/600",
      ]),
      categoryId: electronics.id,
      stock: 120,
      rating: 4.7,
      reviewCount: 892,
      featured: true,
      brand: "Sony",
      sku: "WH1000XM5-BLK",
      weight: 0.25,
      colors: JSON.stringify(["Black", "Silver"]),
    },
    {
      name: "Samsung 65\" QLED 4K Smart TV",
      slug: "samsung-65-qled-4k",
      description:
        "Experience breathtaking 4K QLED picture quality with Quantum HDR. Smart TV features bring you the best in streaming and entertainment. Built-in Alexa and Google Assistant.",
      price: 1299.99,
      comparePrice: 1599.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/samsung-tv1/800/600",
        "https://picsum.photos/seed/samsung-tv2/800/600",
      ]),
      categoryId: electronics.id,
      stock: 30,
      rating: 4.6,
      reviewCount: 567,
      featured: false,
      brand: "Samsung",
      sku: "QN65Q80C",
      weight: 22.5,
    },
    {
      name: "iPad Pro 12.9\" M2 Chip",
      slug: "ipad-pro-12-m2",
      description:
        "The ultimate iPad experience with the M2 chip. Features the stunning Liquid Retina XDR display, Apple Pencil hover, and ProRes video. Now with Wi-Fi 6E for even faster wireless performance.",
      price: 1099.99,
      comparePrice: null,
      images: JSON.stringify([
        "https://picsum.photos/seed/ipadpro1/800/600",
        "https://picsum.photos/seed/ipadpro2/800/600",
      ]),
      categoryId: electronics.id,
      stock: 75,
      rating: 4.9,
      reviewCount: 445,
      featured: true,
      brand: "Apple",
      sku: "MHNG3LL-A",
      weight: 0.685,
      colors: JSON.stringify(["Space Gray", "Silver"]),
    },
    {
      name: "Canon EOS R6 Mark II Camera",
      slug: "canon-eos-r6-mark-ii",
      description:
        "Professional mirrorless camera with 40fps RAW burst shooting. Features industry-leading AF system with Deep Learning technology, 6K RAW video, and in-body image stabilization.",
      price: 2499.99,
      comparePrice: 2699.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/canon1/800/600",
        "https://picsum.photos/seed/canon2/800/600",
      ]),
      categoryId: electronics.id,
      stock: 25,
      rating: 4.8,
      reviewCount: 178,
      featured: false,
      brand: "Canon",
      sku: "EOSR6MK2",
      weight: 0.588,
    },

    // Clothing
    {
      name: "Premium Cotton Classic Fit T-Shirt",
      slug: "premium-cotton-classic-tshirt",
      description:
        "Made from 100% premium Pima cotton, this classic fit t-shirt offers exceptional softness and durability. Pre-shrunk fabric ensures the perfect fit wash after wash. Available in a wide range of colors.",
      price: 29.99,
      comparePrice: 39.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/tshirt1/800/600",
        "https://picsum.photos/seed/tshirt2/800/600",
        "https://picsum.photos/seed/tshirt3/800/600",
      ]),
      categoryId: clothing.id,
      stock: 500,
      rating: 4.4,
      reviewCount: 1234,
      featured: false,
      brand: "BasicWear",
      sku: "BW-TSHIRT-001",
      weight: 0.2,
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "2XL"]),
      colors: JSON.stringify(["White", "Black", "Navy", "Gray", "Red"]),
    },
    {
      name: "Slim Fit Chino Pants",
      slug: "slim-fit-chino-pants",
      description:
        "Modern slim fit chinos crafted from stretch cotton twill for comfort and style. Features a flat front design, slash pockets, and a clean-finish hem. Perfect for business casual or smart casual occasions.",
      price: 69.99,
      comparePrice: 89.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/chino1/800/600",
        "https://picsum.photos/seed/chino2/800/600",
      ]),
      categoryId: clothing.id,
      stock: 200,
      rating: 4.5,
      reviewCount: 567,
      featured: false,
      brand: "StyleCraft",
      sku: "SC-CHINO-SLIM",
      weight: 0.4,
      sizes: JSON.stringify(["28", "30", "32", "34", "36", "38"]),
      colors: JSON.stringify(["Khaki", "Navy", "Olive", "Black"]),
    },
    {
      name: "Women's Floral Wrap Dress",
      slug: "womens-floral-wrap-dress",
      description:
        "Elegant wrap dress featuring a vibrant floral print on lightweight chiffon fabric. The adjustable wrap design flatters all body types. Perfect for summer events, parties, or casual outings.",
      price: 79.99,
      comparePrice: 109.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/dress1/800/600",
        "https://picsum.photos/seed/dress2/800/600",
        "https://picsum.photos/seed/dress3/800/600",
      ]),
      categoryId: clothing.id,
      stock: 150,
      rating: 4.6,
      reviewCount: 389,
      featured: true,
      brand: "EleganceWear",
      sku: "EW-WRAP-FLORAL",
      weight: 0.3,
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
      colors: JSON.stringify(["Blue Floral", "Red Floral", "Green Floral"]),
    },
    {
      name: "Merino Wool Crew Neck Sweater",
      slug: "merino-wool-crew-sweater",
      description:
        "Luxuriously soft merino wool sweater in a classic crew neck style. Natural temperature regulation keeps you comfortable year-round. Machine washable for easy care. A wardrobe essential.",
      price: 129.99,
      comparePrice: 159.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/sweater1/800/600",
        "https://picsum.photos/seed/sweater2/800/600",
      ]),
      categoryId: clothing.id,
      stock: 80,
      rating: 4.7,
      reviewCount: 234,
      featured: false,
      brand: "WoolCraft",
      sku: "WC-MERINO-CREW",
      weight: 0.5,
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "2XL"]),
      colors: JSON.stringify(["Camel", "Navy", "Burgundy", "Forest Green"]),
    },

    // Books
    {
      name: "Atomic Habits by James Clear",
      slug: "atomic-habits-james-clear",
      description:
        "No.1 New York Times bestseller. An Easy & Proven Way to Build Good Habits & Break Bad Ones. Tiny Changes, Remarkable Results. Learn how small habits can lead to extraordinary outcomes.",
      price: 16.99,
      comparePrice: 27.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/atomichabits/800/600",
        "https://picsum.photos/seed/atomichabits2/800/600",
      ]),
      categoryId: books.id,
      stock: 300,
      rating: 4.9,
      reviewCount: 45678,
      featured: true,
      brand: "Penguin Random House",
      sku: "BOOK-AH-HC",
      weight: 0.35,
    },
    {
      name: "The Psychology of Money",
      slug: "psychology-of-money",
      description:
        "Timeless lessons on wealth, greed, and happiness. Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people.",
      price: 14.99,
      comparePrice: 22.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/psychmoney/800/600",
      ]),
      categoryId: books.id,
      stock: 250,
      rating: 4.8,
      reviewCount: 23456,
      featured: false,
      brand: "Harriman House",
      sku: "BOOK-PSYM",
      weight: 0.3,
    },
    {
      name: "Clean Code by Robert C. Martin",
      slug: "clean-code-robert-martin",
      description:
        "A Handbook of Agile Software Craftsmanship. Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.",
      price: 39.99,
      comparePrice: 49.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/cleancode/800/600",
      ]),
      categoryId: books.id,
      stock: 175,
      rating: 4.7,
      reviewCount: 12345,
      featured: false,
      brand: "Pearson",
      sku: "BOOK-CC-RC",
      weight: 0.7,
    },
    {
      name: "Dune by Frank Herbert",
      slug: "dune-frank-herbert",
      description:
        "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the \"spice\" melange.",
      price: 12.99,
      comparePrice: 19.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/dune/800/600",
      ]),
      categoryId: books.id,
      stock: 400,
      rating: 4.8,
      reviewCount: 67890,
      featured: true,
      brand: "Ace Books",
      sku: "BOOK-DUNE-PB",
      weight: 0.45,
    },

    // Home & Garden
    {
      name: "Ninja Foodi 9-in-1 Pressure Cooker",
      slug: "ninja-foodi-9in1",
      description:
        "The pressure cooker that crisps! Pressure cook, air fry, steam, slow cook, sear/sauté, bake/roast, broil, dehydrate, and keep warm all in one pot. TenderCrisp Technology allows you to quickly cook ingredients, then finish with a crispy finish.",
      price: 199.99,
      comparePrice: 249.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/ninja1/800/600",
        "https://picsum.photos/seed/ninja2/800/600",
      ]),
      categoryId: home.id,
      stock: 60,
      rating: 4.7,
      reviewCount: 8934,
      featured: true,
      brand: "Ninja",
      sku: "NINJA-FD401",
      weight: 7.5,
    },
    {
      name: "Dyson V15 Detect Cordless Vacuum",
      slug: "dyson-v15-detect",
      description:
        "Intelligently adapts suction power to the task at hand. The laser reveals microscopic dust on hard floors. Automatically increases suction when it detects high concentrations of dust. Up to 60 minutes of fade-free power.",
      price: 749.99,
      comparePrice: 849.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/dyson1/800/600",
        "https://picsum.photos/seed/dyson2/800/600",
      ]),
      categoryId: home.id,
      stock: 40,
      rating: 4.8,
      reviewCount: 3421,
      featured: false,
      brand: "Dyson",
      sku: "DYSON-V15-D",
      weight: 3.1,
    },
    {
      name: "IKEA HEMNES 6-Drawer Dresser",
      slug: "ikea-hemnes-6drawer",
      description:
        "Solid wood dresser with 6 spacious drawers for all your storage needs. Smooth-running drawers with pull-out stop. Made from solid pine for durability. Classic design that works in any bedroom.",
      price: 449.99,
      comparePrice: null,
      images: JSON.stringify([
        "https://picsum.photos/seed/dresser1/800/600",
        "https://picsum.photos/seed/dresser2/800/600",
      ]),
      categoryId: home.id,
      stock: 20,
      rating: 4.5,
      reviewCount: 2134,
      featured: false,
      brand: "IKEA",
      sku: "HEMNES-6DR-WHT",
      weight: 85,
      colors: JSON.stringify(["White", "Black-Brown", "Light Brown"]),
    },
    {
      name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
      slug: "instant-pot-duo-7in1",
      description:
        "7-in-1 multi-cooker: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer. Cook up to 70% faster than traditional cooking methods.",
      price: 89.99,
      comparePrice: 119.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/instapot1/800/600",
        "https://picsum.photos/seed/instapot2/800/600",
      ]),
      categoryId: home.id,
      stock: 150,
      rating: 4.7,
      reviewCount: 156789,
      featured: false,
      brand: "Instant Pot",
      sku: "IP-DUO80",
      weight: 5.4,
    },

    // Sports & Outdoors
    {
      name: "Peloton Bike+ Exercise Bike",
      slug: "peloton-bike-plus",
      description:
        "The ultimate home fitness experience. Features a 24\" rotating HD touchscreen, automatic resistance adjustment, and access to thousands of live and on-demand classes. Auto-Follow technology adjusts resistance to match instructor cues.",
      price: 2495.00,
      comparePrice: 2695.00,
      images: JSON.stringify([
        "https://picsum.photos/seed/peloton1/800/600",
        "https://picsum.photos/seed/peloton2/800/600",
      ]),
      categoryId: sports.id,
      stock: 15,
      rating: 4.7,
      reviewCount: 5678,
      featured: true,
      brand: "Peloton",
      sku: "PELOTON-BIKEPLUS",
      weight: 68,
    },
    {
      name: "Hydro Flask 32oz Wide Mouth Water Bottle",
      slug: "hydro-flask-32oz",
      description:
        "TempShield double-wall vacuum insulation keeps beverages cold up to 24 hours and hot up to 12 hours. Made with pro-grade 18/8 stainless steel. BPA-free and phthalate-free. Dishwasher safe.",
      price: 49.99,
      comparePrice: 59.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/hydroflask1/800/600",
        "https://picsum.photos/seed/hydroflask2/800/600",
      ]),
      categoryId: sports.id,
      stock: 300,
      rating: 4.8,
      reviewCount: 34567,
      featured: false,
      brand: "Hydro Flask",
      sku: "HF-32WM",
      weight: 0.34,
      colors: JSON.stringify([
        "Pacific",
        "Stone",
        "Olive",
        "Black",
        "White",
        "Flamingo",
      ]),
    },
    {
      name: "Nike Air Zoom Pegasus 41 Running Shoes",
      slug: "nike-air-zoom-pegasus-41",
      description:
        "Built for everyday running. Features Air Zoom units for responsive cushioning, engineered mesh upper for breathability, and rubber outsole with waffle pattern for traction on multiple surfaces.",
      price: 139.99,
      comparePrice: 160.00,
      images: JSON.stringify([
        "https://picsum.photos/seed/nikepeg1/800/600",
        "https://picsum.photos/seed/nikepeg2/800/600",
        "https://picsum.photos/seed/nikepeg3/800/600",
      ]),
      categoryId: sports.id,
      stock: 200,
      rating: 4.6,
      reviewCount: 12345,
      featured: true,
      brand: "Nike",
      sku: "NIKE-PEG41-BLK",
      weight: 0.31,
      sizes: JSON.stringify(["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"]),
      colors: JSON.stringify(["Black/White", "Blue/Orange", "Gray/Green"]),
    },
    {
      name: "REI Co-op Trailmade Sleeping Bag",
      slug: "rei-trailmade-sleeping-bag",
      description:
        "Lightweight, packable sleeping bag perfect for 3-season camping. Rated to 20°F (-7°C). Features a water-resistant shell, a draft collar, and a hood for added warmth.",
      price: 149.99,
      comparePrice: 199.99,
      images: JSON.stringify([
        "https://picsum.photos/seed/sleepbag1/800/600",
        "https://picsum.photos/seed/sleepbag2/800/600",
      ]),
      categoryId: sports.id,
      stock: 80,
      rating: 4.5,
      reviewCount: 4567,
      featured: false,
      brand: "REI Co-op",
      sku: "REI-TRAILMADE-20",
      weight: 1.1,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("Products created");
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
