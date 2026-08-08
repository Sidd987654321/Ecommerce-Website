import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import Navbar from "../../components/Navbar.jsx";
import ProductCard from "../../components/ProductCard.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;

    api
      .get("/products", { params })
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load products"))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-ink text-bone">
      <Navbar />

      {/* Hero */}
      <section id="new" className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-rustLight uppercase mb-4">
              New Season
            </p>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mb-6">
              Dress with
              <br />
              intention.
            </h1>
            <p className="text-muted max-w-sm mb-8">
              Considered essentials for the modern man — built to last, styled to move
              through the day without a second thought.
            </p>
            <a
              href="#shop"
              className="inline-block bg-rust hover:bg-rustLight text-ink font-medium rounded px-6 py-3 transition-colors"
            >
              Shop the collection
            </a>
          </div>
          <div className="aspect-[4/5] bg-panel border border-line rounded-lg overflow-hidden">
            <img
              src={products[0]?.images?.[0] || "https://placehold.co/600x750/1c1d18/9b9788?text=Ecommerce"}
              alt="Featured"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl">Shop all</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="bg-panel border border-line rounded px-3 py-2 text-sm flex-1 min-w-[180px] focus:border-rust outline-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-panel border border-line rounded px-3 py-2 text-sm focus:border-rust outline-none"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-panel border border-line rounded px-3 py-2 text-sm focus:border-rust outline-none"
          >
            <option value="">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A–Z</option>
            <option value="name_desc">Name: Z–A</option>
          </select>
        </div>

        {error && <p className="text-rustLight mb-6">{error}</p>}

        {loading ? (
          <p className="text-muted">Loading…</p>
        ) : products.length === 0 ? (
          <p className="text-muted">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      <footer id="about" className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-muted">
          <p className="font-display text-xl text-bone mb-2">ECOMMERCE</p>
          <p>Considered menswear, made to be worn — not just bought.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
