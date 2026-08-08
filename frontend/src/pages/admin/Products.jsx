import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import AdminLayout from "../../components/AdminLayout.jsx";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  subCategory: "",
  price: "",
  oldPrice: "",
  images: "",
  sizes: "",
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load products"));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      // "M:20, L:15" -> [{size:"M",stock:20},{size:"L",stock:15}]
      const sizes = form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const [size, stock] = s.split(":").map((x) => x.trim());
          return { size, stock: Number(stock) || 0 };
        });

      const images = form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await api.post("/products", {
        title: form.title,
        description: form.description,
        category: form.category,
        subCategory: form.subCategory,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        images,
        sizes,
      });

      setForm(emptyForm);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <AdminLayout eyebrow="Inventory" title="Products">
      {error && (
        <p className="text-rustLight bg-rust/10 border border-rust/30 rounded px-3 py-2 mb-6 text-sm">
          {error}
        </p>
      )}

      {/* Add product form */}
      <form
        onSubmit={handleSubmit}
        className="bg-panel border border-line rounded-lg p-6 mb-10 grid grid-cols-2 gap-4"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="bg-charcoal border border-line rounded px-3 py-2 text-sm focus:border-rust outline-none"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category (e.g. Clothes)"
          required
          className="bg-charcoal border border-line rounded px-3 py-2 text-sm focus:border-rust outline-none"
        />
        <input
          name="subCategory"
          value={form.subCategory}
          onChange={handleChange}
          placeholder="Sub-category (e.g. Shirt)"
          required
          className="bg-charcoal border border-line rounded px-3 py-2 text-sm focus:border-rust outline-none"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="bg-charcoal border border-line rounded px-3 py-2 text-sm focus:border-rust outline-none"
        />
        <input
          name="oldPrice"
          type="number"
          value={form.oldPrice}
          onChange={handleChange}
          placeholder="Old price (optional)"
          className="bg-charcoal border border-line rounded px-3 py-2 text-sm focus:border-rust outline-none"
        />
        <input
          name="images"
          value={form.images}
          onChange={handleChange}
          placeholder="Image URLs, comma separated"
          required
          className="bg-charcoal border border-line rounded px-3 py-2 text-sm focus:border-rust outline-none"
        />
        <input
          name="sizes"
          value={form.sizes}
          onChange={handleChange}
          placeholder="Sizes e.g. M:20, L:15"
          required
          className="bg-charcoal border border-line rounded px-3 py-2 text-sm focus:border-rust outline-none col-span-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          rows={2}
          className="bg-charcoal border border-line rounded px-3 py-2 text-sm focus:border-rust outline-none col-span-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="col-span-2 bg-rust hover:bg-rustLight text-ink font-medium rounded px-3 py-2.5 transition-colors disabled:opacity-50"
        >
          {saving ? "Adding…" : "Add product"}
        </button>
      </form>

      {/* Product table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted border-b border-line font-mono text-xs uppercase tracking-wide">
            <th className="pb-3 font-normal">Title</th>
            <th className="pb-3 font-normal">Category</th>
            <th className="pb-3 font-normal">Price</th>
            <th className="pb-3 font-normal">Stock</th>
            <th className="pb-3 font-normal"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b border-line/50">
              <td className="py-3">{p.title}</td>
              <td className="py-3 text-muted">
                {p.category} / {p.subCategory}
              </td>
              <td className="py-3 font-mono">₹{p.price}</td>
              <td className="py-3 font-mono text-muted">
                {p.sizes.map((s) => `${s.size}:${s.stock}`).join(", ")}
              </td>
              <td className="py-3 text-right">
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-xs font-mono uppercase text-rustLight hover:text-rust"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-muted">
                No products yet — add one above.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default Products;
