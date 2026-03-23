import { Trash, Plus, Minus } from "lucide-react";

type Item = {
  id: string;
  name: string;
  quantity: number;
};

type InventoryItemProps = {
  item: Item;
  onUpdateQuantity: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
};

export function InventoryItem({ item, onUpdateQuantity, onRemove }: InventoryItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
      <div className="flex flex-col">
        <span className="font-semibold text-lg">{item.name}</span>
        {item.quantity < 3 && (
          <span className="text-red-500 text-sm font-bold mt-1">
            Estoque Baixo
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-white border rounded-md overflow-hidden">
          <button 
            onClick={() => onUpdateQuantity(item.id, -1)}
            disabled={item.quantity === 0}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-mono text-lg font-bold">
            {item.quantity}
          </span>
          <button 
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="p-2 hover:bg-gray-100"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          disabled={item.quantity > 0}
          className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
}