import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const EMPTY = {
  name: '', description: '', price: '', originalPrice: '', category: 'men',
  frameType: 'full-rim', stock: '', isFeatured: false, images: [],
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then(({ data }) => {
        setForm({
          name: data.name, description: data.description, price: data.price,
          originalPrice: data.originalPrice || '', category: data.category,
          frameType: data.frameType, stock: data.stock,
          isFeatured: data.isFeatured, images: data.images || [],
        });
      });
    }
  }, [id, isEdit]);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('images', f));
    try {
      const { data } = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((prev) => ({ ...prev, images: [...prev.images, ...data.urls] }));
      toast.success('Images uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors bg-white";

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Product Name</label>
              <input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Classic Aviator Sunglasses" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Description</label>
              <textarea className={inputClass} required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Price (₹)</label>
                <input type="number" className={inputClass} required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="1499" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Original Price (₹)</label>
                <input type="number" className={inputClass} min="0" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="1999" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Category</label>
                <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {['men', 'women', 'sunglasses', 'computer-glasses', 'lenses', 'frames'].map((c) => (
                    <option key={c} value={c}>{c.replace('-', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Frame Type</label>
                <select className={inputClass} value={form.frameType} onChange={(e) => setForm({ ...form, frameType: e.target.value })}>
                  {['full-rim', 'half-rim', 'rimless', 'n/a'].map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Stock</label>
              <input type="number" className={inputClass} required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="50" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 rounded" />
              <label htmlFor="featured" className="text-sm text-gray-700">Mark as Featured</label>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <label className="text-xs text-gray-500 mb-3 block">Product Images</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="" className="w-20 h-20 object-cover rounded-xl bg-gray-50" />
                  <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
                </div>
              ))}
              <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <span className="text-2xl text-gray-300">{uploading ? '⏳' : '+'}</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')}
              className="border border-gray-200 text-gray-600 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
