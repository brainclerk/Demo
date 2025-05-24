import React from 'react';
import { NutritionOrder } from '../../types';
import { format } from 'date-fns';
import { RotateCw } from 'lucide-react';

interface NutritionShopProps {
  order: NutritionOrder;
}

const NutritionShop: React.FC<NutritionShopProps> = ({ order }) => {
  const productUrl = "https://plutopets.co/products/superfood-softchew";

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-[420px] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-xl font-semibold">Shop Nutrition</h3>
        <a 
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm bg-white rounded-md px-3 py-1.5 text-gray-700 hover:bg-gray-50 border border-gray-100"
        >
          View all
        </a>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="text-gray-500 text-sm">#{order.id}</div>
        <div className="flex items-center justify-between">
          <div className="text-gray-900">Next order: {format(order.nextDelivery, 'MMM dd, yyyy')}</div>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium">
            Active
          </span>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <RotateCw className="w-4 h-4 mr-1.5" />
          Deliver every {order.frequency}
        </div>
      </div>

      <a 
        href={productUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center px-4 py-6 border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 p-2">
            <img 
              src={order.products[0].image} 
              alt={order.products[0].name} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900">{order.products[0].name}</div>
            <div className="text-gray-500 text-sm">{order.products[0].description}</div>
            <div className="font-medium text-gray-900 mt-0.5">${order.products[0].price.toFixed(2)} ×1</div>
          </div>
        </div>
      </a>
      
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-gray-600">${order.products[0].price.toFixed(2)} + $5.99 shipping</div>
        <button 
          disabled
          className="bg-gray-300 text-gray-500 px-4 py-1.5 rounded-md text-sm font-medium cursor-not-allowed"
        >
          View details
        </button>
      </div>
    </div>
  );
};

export default NutritionShop;