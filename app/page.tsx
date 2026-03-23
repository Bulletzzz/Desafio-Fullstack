"use client";

import { useState, useEffect } from "react";
import { Plus, Package } from "lucide-react";
import { InventoryItem } from "../components/InventoryItem";

type Item = {
  id: string;
  name: string;
  quantity: number;
};

export default function InventoryManager() {
  const [productName, setProductName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("inventory_items");
    if (saved) {
      setItems(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("inventory_items", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  useEffect(() => {
    document.title = productName || "Gerenciador e Catálogo";
  }, [productName]);

  const updateQuantity = (id: string, amount: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(0, item.quantity + amount) };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const addItem = () => {
    if (productName.trim() === "") return;

    const newItem: Item = {
      id: Date.now().toString(),
      name: productName,
      quantity: 0
    };
    
    setItems((prevItems) => [...prevItems, newItem]);
    setProductName("");
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans text-black">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="text-blue-500" /> Cadastrar Produto
          </h2>
          
          <div className="flex flex-col gap-4 mb-8">
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Nome do produto..."
              className="w-full text-lg p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />

            <button 
              onClick={addItem}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Plus size={20} /> Adicionar ao Estoque
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Lista de Controle</h3>
            {items.map((item) => (
              <InventoryItem 
                key={item.id} 
                item={item} 
                onUpdateQuantity={updateQuantity} 
                onRemove={removeItem} 
              />
            ))}
            
            {items.length === 0 && (
              <p className="text-center text-gray-400 py-6 text-sm">Nenhum item para gerenciar.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Package className="text-orange-500" /> Catálogo de Produtos
            </h2>
            <span className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">
              {items.length} {items.length === 1 ? 'item' : 'itens'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={`card-${item.id}`} className="bg-white p-5 rounded-xl shadow-sm border border-transparent hover:border-orange-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-xl uppercase">
                    {item.name.charAt(0)}
                  </div>
                  {item.quantity > 0 ? (
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
                      Em estoque
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded uppercase">
                      Esgotado
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {item.name}
                </h3>
                
                <div className="mt-4 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-semibold">Disponível</span>
                      <span className={`text-xl font-mono font-bold ${item.quantity < 3 ? 'text-red-500' : 'text-gray-700'}`}>
                        {item.quantity} un
                      </span>
                   </div>
                   
                   {item.quantity < 3 && item.quantity > 0 && (
                     <div className="animate-pulse bg-red-50 text-red-600 text-[10px] px-2 py-1 rounded-full border border-red-100">
                        Reposição Necessária
                     </div>
                   )}
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="col-span-full border-2 border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-400">
                O seu catálogo aparecerá aqui assim que você cadastrar produtos.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
