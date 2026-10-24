import Link from "next/link";
import db from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { Filter, SlidersHorizontal, Search, RotateCcw, Sparkles } from "lucide-react";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    boltPattern?: string;
    diameter?: string;
    q?: string;
    sort?: string;
  }>;
}

export const revalidate = 0;

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const { category, brand, boltPattern, diameter, q, sort } = params;

  // Build Prisma where filter
  const where: any = { isActive: true };

  if (category) {
    where.category = { slug: category };
  }
  if (brand) {
    where.brand = { slug: brand };
  }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }

  // Filter by variant specs if specified
  if (boltPattern || diameter) {
    where.variants = {
      some: {
        ...(boltPattern ? { boltPattern: { contains: boltPattern } } : {}),
        ...(diameter ? { diameter: parseFloat(diameter) } : {}),
      },
    };
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { basePrice: "asc" };
  if (sort === "price-desc") orderBy = { basePrice: "desc" };
  if (sort === "name-asc") orderBy = { name: "asc" };

  // Execute database query
  const [products, categories, brands] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      include: {
        brand: true,
        category: true,
        variants: {
          where: { isActive: true },
        },
      },
    }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  const hasActiveFilters = Boolean(category || brand || boltPattern || diameter || q || sort);

  return (
    <div className="min-h-screen bg-[#08090B] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8 border-b border-[#22262E] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-300">Shop Catalog</span>
              {category && (
                <>
                  <span>/</span>
                  <span className="text-[#D71920] uppercase font-bold">{category}</span>
                </>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              CATALOG &bull; <span className="text-gradient-chrome">WHEELS &amp; TIRES</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Showing {products.length} performance products ready for pickup at 311 N Cicero Ave or delivery.
            </p>
          </div>

          {/* Search Bar */}
          <form method="GET" action="/shop" className="relative w-full md:w-80">
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder="Search wheels, tires, sizes..."
              className="w-full bg-[#111317] border border-[#292D34] rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D71920]"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          </form>
        </div>

        {/* Layout with Filters Sidebar & Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className="space-y-6">
            <div className="bg-[#111317] border border-[#22262E] rounded-xl p-5 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#22262E]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                  <SlidersHorizontal className="w-4 h-4 text-[#D71920]" />
                  <span>Filters</span>
                </div>
                {hasActiveFilters && (
                  <Link
                    href="/shop"
                    className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#F1262D] transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </Link>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                  Category
                </h4>
                <div className="space-y-1.5 text-xs">
                  <Link
                    href="/shop"
                    className={`block px-2.5 py-1.5 rounded transition-colors ${
                      !category
                        ? "bg-[#D71920]/20 text-[#F1262D] font-bold border border-[#D71920]/30"
                        : "text-gray-400 hover:bg-[#191C21] hover:text-white"
                    }`}
                  >
                    All Categories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      className={`block px-2.5 py-1.5 rounded transition-colors ${
                        category === cat.slug
                          ? "bg-[#D71920]/20 text-[#F1262D] font-bold border border-[#D71920]/30"
                          : "text-gray-400 hover:bg-[#191C21] hover:text-white"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bolt Pattern / PCD */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                  Bolt Pattern (PCD)
                </h4>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {["5x114.3", "5x120", "5x112", "5x115"].map((pcd) => (
                    <Link
                      key={pcd}
                      href={`/shop?${category ? `category=${category}&` : ""}boltPattern=${pcd}`}
                      className={`px-2.5 py-1.5 rounded text-center border font-mono transition-colors ${
                        boltPattern === pcd
                          ? "bg-[#D71920] text-white border-[#D71920] font-bold"
                          : "bg-[#08090B] text-gray-400 border-[#292D34] hover:text-white"
                      }`}
                    >
                      {pcd}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Diameter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                  Wheel Diameter
                </h4>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                  {["19", "20", "21"].map((dia) => (
                    <Link
                      key={dia}
                      href={`/shop?${category ? `category=${category}&` : ""}diameter=${dia}`}
                      className={`px-2 py-1.5 rounded text-center border transition-colors ${
                        diameter === dia
                          ? "bg-[#D71920] text-white border-[#D71920] font-bold"
                          : "bg-[#08090B] text-gray-400 border-[#292D34] hover:text-white"
                      }`}
                    >
                      {dia}"
                    </Link>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                  Brand
                </h4>
                <div className="space-y-1.5 text-xs">
                  {brands.map((b) => (
                    <Link
                      key={b.id}
                      href={`/shop?brand=${b.slug}`}
                      className={`block px-2.5 py-1.5 rounded transition-colors ${
                        brand === b.slug
                          ? "bg-[#D71920]/20 text-[#F1262D] font-bold border border-[#D71920]/30"
                          : "text-gray-400 hover:bg-[#191C21] hover:text-white"
                      }`}
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort & Count Bar */}
            <div className="flex items-center justify-between bg-[#111317] border border-[#22262E] px-4 py-3 rounded-lg text-xs">
              <span className="text-gray-400">
                Found <strong className="text-white">{products.length}</strong> items
              </span>

              <div className="flex items-center gap-2">
                <span className="text-gray-500">Sort by:</span>
                <div className="flex gap-2">
                  <Link
                    href={`/shop?${category ? `category=${category}&` : ""}sort=newest`}
                    className={`px-2.5 py-1 rounded ${
                      !sort || sort === "newest" ? "bg-[#191C21] text-white font-bold" : "text-gray-400"
                    }`}
                  >
                    Newest
                  </Link>
                  <Link
                    href={`/shop?${category ? `category=${category}&` : ""}sort=price-asc`}
                    className={`px-2.5 py-1 rounded ${
                      sort === "price-asc" ? "bg-[#191C21] text-white font-bold" : "text-gray-400"
                    }`}
                  >
                    Price: Low to High
                  </Link>
                  <Link
                    href={`/shop?${category ? `category=${category}&` : ""}sort=price-desc`}
                    className={`px-2.5 py-1 rounded ${
                      sort === "price-desc" ? "bg-[#191C21] text-white font-bold" : "text-gray-400"
                    }`}
                  >
                    Price: High to Low
                  </Link>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="bg-[#111317] border border-[#22262E] rounded-xl py-20 text-center space-y-4">
                <p className="text-gray-400 text-sm">No products found matching your current filter criteria.</p>
                <Link
                  href="/shop"
                  className="btn-primary inline-flex items-center gap-1.5 px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
