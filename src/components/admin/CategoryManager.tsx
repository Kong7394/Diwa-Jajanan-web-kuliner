import React, { useState } from 'react';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, Tags, Check, X } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string) => Promise<void>;
  onUpdateCategory: (id: string, name: string, isActive: boolean) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsSubmitting(true);
    await onAddCategory(newCategoryName.trim());
    setNewCategoryName('');
    setIsSubmitting(false);
  };

  const handleSaveEdit = async (id: string, isActive: boolean) => {
    if (!editingName.trim()) return;
    await onUpdateCategory(id, editingName.trim(), isActive);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      <div>
        <h1 className="text-2xl font-black text-[#2D1B08]">Kategori Menu</h1>
        <p className="text-xs text-[#8C7B6B]">
          Kelola kategori untuk mempermudah pelanggan memfilter menu makanan dan minuman
        </p>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-3xl border border-[#E6DCCF] shadow-2xs flex gap-2">
        <input
          type="text"
          required
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nama Kategori Baru (misal: Paket Hemat, Camilan)"
          className="flex-1 px-4 py-2.5 rounded-xl border border-[#E6DCCF] text-xs font-semibold text-[#2D1B08] focus:border-[#FF6321] bg-[#FFFBF5]"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </form>

      {/* Category List */}
      <div className="bg-white rounded-3xl border border-[#E6DCCF] shadow-2xs overflow-hidden divide-y divide-[#E6DCCF]">
        {categories.map((c) => (
          <div key={c.id} className="p-4 flex items-center justify-between gap-3 text-xs">
            {editingId === c.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#FF6321] font-semibold text-xs flex-1 text-[#2D1B08] bg-white"
                />
                <button
                  onClick={() => handleSaveEdit(c.id, c.isActive)}
                  className="p-1.5 rounded-lg bg-emerald-600 text-white cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-1.5 rounded-lg bg-[#FFF3E0] text-[#4A3728] cursor-pointer border border-[#E6DCCF]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Tags className="w-4 h-4 text-[#FF6321]" />
                  <span className="font-bold text-[#2D1B08]">{c.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateCategory(c.id, c.name, !c.isActive)}
                    className={`px-2.5 py-1 rounded-xl font-bold text-[11px] cursor-pointer ${
                      c.isActive
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-[#FFF3E0] text-[#8C7B6B] border border-[#E6DCCF]'
                    }`}
                  >
                    {c.isActive ? 'Aktif' : 'Nonaktif'}
                  </button>

                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setEditingName(c.name);
                    }}
                    className="p-1.5 text-[#8C7B6B] hover:text-[#FF6321] cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Hapus kategori "${c.name}"?`)) onDeleteCategory(c.id);
                    }}
                    className="p-1.5 text-[#8C7B6B] hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
