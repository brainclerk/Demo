import React from 'react';
import NutritionShop from '../Features/NutritionShop';
import VetHistory from '../Features/VetHistory';
import { mockNutritionOrder } from '../../data/mockData';

interface FeatureCardsProps {
  onSessionSelect: (sessionId: string) => void;
}

const FeatureCards: React.FC<FeatureCardsProps> = ({ onSessionSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <NutritionShop order={mockNutritionOrder} />
      <VetHistory onSessionSelect={onSessionSelect} />
    </div>
  );
};

export default FeatureCards;