import React from 'react';
import NutritionShop from '../Features/NutritionShop';
import VetHistory from '../Features/VetHistory';
import { mockNutritionOrder } from '../../data/mockData';

interface FeatureCardsProps {
  onSessionSelect: (sessionId: string) => void;
  historyRefreshTrigger: number;
}

const FeatureCards: React.FC<FeatureCardsProps> = ({ onSessionSelect, historyRefreshTrigger }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <NutritionShop order={mockNutritionOrder} />
      <VetHistory onSessionSelect={onSessionSelect} historyRefreshTrigger={historyRefreshTrigger} />
    </div>
  );
};

export default FeatureCards;