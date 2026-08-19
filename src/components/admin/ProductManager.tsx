import React, { useState } from 'react';
import { Product, Category } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { ProductFormModal } from './ProductFormModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Flame,
  CheckCircle2,
  XCircle,
  UtensilsCrossed,
} from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
  categories: Category[];
  onSaveProduct: (productData: Partial<Product>) => Promise<void>;
  onUpdateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  categories,
  onSaveProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('ALL');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryId === 'ALL' || p.categoryId === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Product>) => {
    if (editingProduct) {
      await onUpdateProduct(editingProduct.id, data);
    } else {
      await onSaveProduct(data);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D1B08]">Manajemen Menu Jajanan</h1>
          <p className="text-xs text-[#8C7B6B]">
            Tambah, edit, hapus, dan atur ketersediaan menu makanan & minuman
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-xs shadow-md shadow-[#FF6321]/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Menu Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#E6DCCF] shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8C7B6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari menu..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FFFBF5] border border-[#E6DCCF] text-xs font-medium text-[#2D1B08] focus:outline-hidden focus:border-[#FF6321]"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryId('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryId === 'ALL'
                ? 'bg-[#FF6321] text-white'
                : 'bg-[#FFF3E0] text-[#4A3728] border border-[#E6DCCF] hover:bg-[#E6DCCF]/40'
            }`}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategoryId(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategoryId === c.id
                  ? 'bg-[#FF6321] text-white'
                  : 'bg-[#FFF3E0] text-[#4A3728] border border-[#E6DCCF] hover:bg-[#E6DCCF]/40'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#8C7B6B] bg-white rounded-3xl border border-dashed border-[#E6DCCF] p-6 space-y-2">
            <UtensilsCrossed className="w-8 h-8 mx-auto text-[#8C7B6B]/60" />
            <p className="text-xs font-bold">Tidak ada menu ditemukan</p>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const cat = categories.find((c) => c.id === p.categoryId);
            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-[#E6DCCF] shadow-2xs overflow-hidden p-4 flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-[#FFFBF5] shrink-0 border border-[#E6DCCF]"
                  />
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-1">
                      {p.isBestSeller && (
                        <span className="p-1 rounded-md bg-[#FFF3E0] text-[#FF6321] border border-[#E6DCCF]">
                          <Flame className="w-3 h-3" />
                        </span>
                      )}
                      <h3 className="font-bold text-[#2D1B08] text-sm truncate">{p.name}</h3>
                    </div>
                    <span className="text-[10px] font-bold text-[#2D1B08] bg-[#FFF3E0] px-2 py-0.5 rounded-md inline-block border border-[#E6DCCF]">
                      {cat?.name || 'Jajanan'}
                    </span>
                    <div className="font-black text-[#FF6321] text-sm">
                      {formatRupiah(p.basePrice)}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#8C7B6B] line-clamp-2">
                  {p.description}
                </div>

                {p.variants && p.variants.length > 0 && (
                  <div className="text-[11px] text-[#8C7B6B] bg-[#FFFBF5] p-2 rounded-xl border border-[#E6DCCF]">
                    <span className="font-bold text-[#4A3728] block">
                      Varian ({p.variants.length}):
                    </span>
                    <span className="truncate block">
                      {p.variants.map((v) => `${v.name} (${formatRupiah(v.price)})`).join(', ')}
                    </span>
                  </div>
                )}

                {/* Quick Status Toggles & Actions */}
                <div className="pt-2 border-t border-[#E6DCCF] flex items-center justify-between gap-2">
                  <button
                    onClick={() =>
                      onUpdateProduct(p.id, { isAvailable: !p.isAvailable })
                    }
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      p.isAvailable
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-[#FFF3E0] text-[#8C7B6B] border border-[#E6DCCF]'
                    }`}
                  >
                    {p.isAvailable ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tersedia
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Habis
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 rounded-xl text-[#4A3728] hover:bg-[#FFF3E0] hover:text-[#FF6321] transition-colors cursor-pointer"
                      title="Edit Menu"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus menu "${p.name}"?`)) {
                          onDeleteProduct(p.id);
                        }
                      }}
                      className="p-2 rounded-xl text-[#8C7B6B] hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                      title="Hapus Menu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

    </div>
  );
};
