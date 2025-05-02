import React from 'react';
import NutritionShop from '../Features/NutritionShop';
import VetHistory from '../Features/VetHistory';
import { mockNutritionOrder, mockVetHistory } from '../../data/mockData';

const FeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <NutritionShop order={mockNutritionOrder} />
      <VetHistory historyItems={mockVetHistory} />
    </div>
  );
};

export default FeatureCards;