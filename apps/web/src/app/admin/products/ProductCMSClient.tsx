"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  productType: string;
  description: string;
  shortDescription?: string | null;
  basePrice: number;
  salePrice?: number | null;
  costPrice?: number | null;
  primaryImage: string;
  galleryImages: string;
  technicalSpecs: string;
  isFeatured: boolean;
  isActive: boolean;
  brand?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
  variants: Array<{
    id: string;
    sku: string;
    stockOnHand: number;
    price: number;
  }>;
}

interface ProductCMSClientProps {
  initialProducts: ProductRecord[];
  categories: Array<{ id: string; name: string; slug: string }>;
  brands: Array<{ id: string; name: string; slug: string }>;
}

export default function ProductCMSClient({
  initialProducts,
  categories,
  brands,
}: ProductCMSClientProps) {
  const [products, setProducts] = useState<ProductRecord[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    productType: "WHEEL",
    categoryId: "",
    brandId: "",
    basePrice: 849,
    salePrice: 799,
    costPrice: 420,
    shortDescription: "",
    description: "",
    primaryImage: "/images/wheel-forged.jpg",
    isFeatured: true,
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "ALL" ? true : p.category?.id === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      productType: "WHEEL",
      categoryId: categories[0]?.id || "",
      brandId: brands[0]?.id || "",
      basePrice: 850,
      salePrice: 799,
      costPrice: 420,
      shortDescription: "",
      description: "",
      primaryImage: "/images/wheel-forged.jpg",
      isFeatured: true,
      isActive: true,
    });
    setFeedback(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: ProductRecord) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      productType: p.productType,
      categoryId: p.category?.id || "",
      brandId: p.brand?.id || "",
      basePrice: p.basePrice,
      salePrice: p.salePrice || p.basePrice,
      costPrice: p.costPrice || 0,
      shortDescription: p.shortDescription || "",
      description: p.description,
      primaryImage: p.primaryImage,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
    });
    setFeedback(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      ...formData,
      basePrice: Number(formData.basePrice),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      costPrice: formData.costPrice ? Number(formData.costPrice) : null,
      galleryImages: [formData.primaryImage],
      technicalSpecs: {
        Warranty: "Lifetime Structural Warranty",
        Finishes: "Multi-Coat Electrostatic Powder",
      },
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((item) => (item.id === editingProduct.id ? { ...item, ...data.product } : item))
        );
        setFeedback({ text: "Product updated successfully!", error: false });
      } else {
        setProducts((prev) => [data.product, ...prev]);
        setFeedback({ text: "Product created successfully!", error: false });
      }

      setTimeout(() => {
        setModalOpen(false);
      }, 1000);
    } catch (err: any) {
      setFeedback({ text: err.message, error: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (p: ProductRecord) => {
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...p,
          isActive: !p.isActive,
          galleryImages: JSON.parse(p.galleryImages || "[]"),
          technicalSpecs: JSON.parse(p.technicalSpecs || "{}"),
        }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, isActive: !item.isActive } : item))
        );
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22262E] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D71920]">
            Storefront Catalog &bull; CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            PRODUCT MANAGEMENT
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure wheels, tires, services, variants, prices, cost margins, and media.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-primary px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-glow-red"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111317] border border-[#22262E] p-4 rounded-xl">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product title or slug..."
            className="w-full bg-[#08090B] border border-[#292D34] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D71920]"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <span className="text-gray-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#08090B] border border-[#292D34] text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D71920]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#111317] border border-[#22262E] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08090B] text-gray-400 uppercase font-mono border-b border-[#22262E]">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Base / Sale Price</th>
                <th className="py-3 px-4 text-center">Variants</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F232B] text-gray-300">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#16191F] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded bg-[#08090B] border border-[#22262E] overflow-hidden shrink-0">
                        <Image
                          src={p.primaryImage || "/images/wheel-forged.jpg"}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-white leading-tight">{p.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">/{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191C21] border border-[#292D34]">
                      {p.productType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-300">
                    {p.brand?.name || "Chi-Town Customs"}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    ${p.basePrice.toFixed(2)}
                    {p.salePrice && p.salePrice < p.basePrice && (
                      <span className="text-[11px] text-emerald-400 block font-normal">
                        Sale: ${p.salePrice.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                    {p.variants?.length || 0}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                        p.isActive
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800"
                          : "bg-gray-800 text-gray-400 border border-gray-700"
                      }`}
                    >
                      {p.isActive ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/shop/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#191C21]"
                        title="View on Storefront"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-gray-400 hover:text-[#D71920] rounded hover:bg-[#191C21]"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111317] border border-[#292D34] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="border-b border-[#22262E] pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D71920]">
                  Product Catalog Editor
                </span>
                <h3 className="text-xl font-black text-white uppercase">
                  {editingProduct ? `Edit ${editingProduct.name}` : "Create New Performance Product"}
                </h3>
              </div>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-lg text-xs font-semibold ${
                  feedback.error
                    ? "bg-red-950/40 text-red-300 border border-red-800"
                    : "bg-emerald-950/40 text-emerald-300 border border-emerald-800"
                }`}
              >
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)+/g, "");
                      setFormData({
                        ...formData,
                        name,
                        slug: editingProduct ? formData.slug : slug,
                      });
                    }}
                    placeholder="e.g. Chi-Town Apex-7 Forged"
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Product Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Manufacturer / Brand
                  </label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Base Retail Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Sale Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Cost Price ($) &bull; Restricted
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Primary Image Asset
                  </label>
                  <select
                    value={formData.primaryImage}
                    onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                  >
                    <option value="/images/wheel-apex7.jpg">Apex-7 Forged Monoblock Wheel (Bare Metal Rim)</option>
                    <option value="/images/wheel-streetviper.jpg">StreetViper 2-Piece Modular Wheel (Deep Dish Rim)</option>
                    <option value="/images/michelin-ps4s.jpg">Michelin Pilot Sport 4S (Unmounted Tire)</option>
                    <option value="/images/continental-dws06.jpg">Continental ExtremeContact DWS06 Plus (Unmounted Tire)</option>
                    <option value="/images/tire-performance.jpg">Performance Tires Showroom Stack</option>
                    <option value="/images/finishes-showcase.jpg">Signature Finishes Showcase</option>
                    <option value="/images/wheel-repair.jpg">Wheel Repair Workshop</option>
                    <option value="/images/hero-car.jpg">Supercar On Custom Wheels</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence summary for catalog cards"
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Full Technical Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of engineering, structural integrity, and warranty."
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="text-[#D71920] focus:ring-[#D71920] rounded"
                  />
                  <span className="text-gray-300 font-semibold">Feature on Storefront Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="text-[#D71920] focus:ring-[#D71920] rounded"
                  />
                  <span className="text-gray-300 font-semibold">Active &bull; Available for Purchase</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#22262E]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary px-4 py-2 rounded text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider shadow-glow-red"
                >
                  {isSubmitting ? "Saving to Database..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
