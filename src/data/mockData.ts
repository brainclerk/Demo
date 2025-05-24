import { User, Pet, Message, VetHistoryItem, PinnedFeature, NutritionOrder, QuickAction, Shortcut } from '../types';
import { subDays, subHours, subMinutes, addDays } from 'date-fns';

export const mockUser: User = {
  id: 'ba53f380-4868-4e12-9c5b-5e6a31d9625e',
  name: 'Sarah Johnson',
  email: 'sarahjohnson@gmail.com',
  premium: true,
  avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  credits: 'Unlimited Credits',
};

// export const mockPet: Pet = {
//   id: '1',
//   user_id: 'user1',
//   pet_name: 'Ruby',
//   breed: 'Samoyed',
//   breed_type: 'purebred',
//   sex: 'female',
//   birth_date: '2021-01-15T00:00:00Z',
//   weight: '20',
//   size_category: 'medium',
//   medical_conditions: ['Seasonal allergies', 'Mild hip dysplasia'],
//   other_condition: '',
//   current_medications: 'Apoquel 16mg daily',
//   surgeries_or_procedures: '',
//   surgery_date: null,
//   vet_records: null,
//   diet_types: ['Kibble'],
//   other_diet_type: '',
//   main_brands: 'Hill\'s Science Diet Sensitive Stomach',
//   takes_supplements: true,
//   supplement_details: 'Daily fish oil supplement',
//   food_allergies: 'Chicken, Wheat',
//   activity_level: 'moderate',
//   activity_minutes: 60,
//   uses_tracking_device: false,
//   tracking_device_details: '',
//   alone_in_day: false,
//   hours_alone: 0,
//   temperament: 'friendly',
//   recent_behaviors: ['Fetch', 'Agility training', 'Swimming'],
//   current_symptoms: [],
//   major_health_events: '',
//   top_concern: 'Hip dysplasia management',
//   improvement_goals: 'Maintain healthy weight and joint health',
//   care_confidence: 4,
//   interests: ['Training', 'Exercise', 'Nutrition'],
//   created_at: '2024-01-01T00:00:00Z',
//   updated_at: '2024-01-01T00:00:00Z'
// };

export const mockMessages: Message[] = [
  {
    id: '1',
    content: "Hi, I'm worried about Ruby's appetite. She hasn't been eating much lately.",
    role: 'user',
    timestamp: new Date(2025, 4, 20, 14, 35),
    agentType: 'assessment'
  },
  {
    id: '2',
    content: "I understand your concern about Ruby's decreased appetite. This could be due to several factors, including stress, dental issues, or an underlying health condition. When did you first notice this change? Has there been any other change in her behavior or routine?",
    role: 'assistant',
    timestamp: new Date(2025, 4, 20, 14, 36),
    agentType: 'assessment'
  },
  {
    id: '3',
    content: "It started about 3 days ago. She's also been a bit more lethargic than usual and seems to be scratching her ears more frequently.",
    role: 'user',
    timestamp: new Date(2025, 4, 20, 14, 37),
    agentType: 'assessment'
  },
  {
    id: '4',
    content: "Given Ruby's history of seasonal allergies and the timing of these symptoms, this could be related to her allergies. The scratching and lethargy are common signs. However, the decreased appetite is something we should monitor closely. Have you noticed any changes in her water intake? Also, is she still taking her Apoquel medication regularly?",
    role: 'assistant',
    timestamp: new Date(2025, 4, 20, 14, 38),
    agentType: 'assessment'
  },
  {
    id: '5',
    content: "Can you help me plan a balanced diet for Ruby? She's been on Hill's Science Diet but I'd like to explore some fresh food options.",
    role: 'user',
    timestamp: new Date(2025, 4, 20, 15, 0),
    agentType: 'nutrition'
  },
  {
    id: '6',
    content: "I'd be happy to help you plan a balanced diet for Ruby! Given her allergies to chicken and wheat, we'll need to be careful with protein sources. I can suggest some fresh food options that would complement her current diet. Would you like to gradually transition to fresh food or maintain a mix of both? Also, are there any specific concerns about her current diet you'd like to address?",
    role: 'assistant',
    timestamp: new Date(2025, 4, 20, 15, 1),
    agentType: 'nutrition'
  },
  {
    id: '7',
    content: "I've noticed Ruby's been more active in the evenings lately. Can you help me understand if this is normal behavior?",
    role: 'user',
    timestamp: new Date(2025, 4, 20, 16, 0),
    agentType: 'analysis'
  },
  {
    id: '8',
    content: "Let me analyze Ruby's activity patterns. Based on her typical routine of two 30-minute walks per day and her age, increased evening activity could be normal, especially if she's not getting enough mental stimulation during the day. However, given her hip dysplasia, we should ensure she's not overexerting herself. Would you like me to suggest some low-impact activities that could help channel her energy appropriately?",
    role: 'assistant',
    timestamp: new Date(2025, 4, 20, 16, 1),
    agentType: 'analysis'
  }
];

export const mockVetHistory: VetHistoryItem[] = [
  {
    id: '1',
    type: 'allergies',
    title: 'Allergies list',
    timestamp: subMinutes(new Date(), 5),
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Vet appointment',
    timestamp: subHours(new Date(), 2),
  },
  {
    id: '3',
    type: 'question',
    title: 'Ask about sleep quality',
    timestamp: subHours(new Date(), 5),
  },
  {
    id: '4',
    type: 'question',
    title: 'Ask about meal history',
    timestamp: subHours(new Date(), 8),
  },
  {
    id: '5',
    type: 'question',
    title: 'Ask about heart condition',
    timestamp: subDays(new Date(), 1),
  },
];

export const mockPinnedFeatures: PinnedFeature[] = [
  {
    id: '1',
    title: 'Latest health report',
    icon: 'clipboard-list',
    path: '/health-report',
  },
  {
    id: '2',
    title: 'Allergies report',
    icon: 'clipboard-list',
    path: '/allergies-report',
  },
  {
    id: '3',
    title: 'Nutrition history',
    icon: 'clipboard-list',
    path: '/nutrition-history',
  },
];

export const mockNutritionOrder: NutritionOrder = {
  id: '20490944692',
  nextDelivery: addDays(new Date(), 7),
  frequency: '3 weeks',
  status: 'active',
  products: [
    {
      id: '1',
      name: 'Superfood Softchew',
      description: 'Natural Salmon Flavor',
      price: 39.99,
      image: 'https://cdn.shopify.com/s/files/1/0629/0898/9620/files/shopifypc.png?v=1700520674',
      quantity: 1,
    },
  ],
};

export const mockQuickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Generate',
    icon: 'zap',
    color: 'bg-blue-500',
  },
  {
    id: '2',
    title: 'Brainstorm',
    icon: 'message-square',
    color: 'bg-amber-400',
  },
  {
    id: '3',
    title: 'Analyze',
    icon: 'clipboard-list',
    color: 'bg-indigo-400',
  },
  {
    id: '4',
    title: 'Creative',
    icon: 'lightbulb',
    color: 'bg-purple-500',
  },
  {
    id: '5',
    title: 'More',
    icon: 'more-horizontal',
    color: 'bg-green-500',
  },
];

export const mockShortcuts: Shortcut[] = [
  {
    id: '1',
    title: 'Pet Profile',
    icon: 'paw-print',
    color: 'bg-blue-100',
    path: '/pets',
  },
  {
    id: '2',
    title: 'Coming Soon',
    icon: 'stethoscope',
    color: 'bg-amber-100',
    path: '/vet',
  },
  {
    id: '3',
    title: 'Coming Soon',
    icon: 'flask-conical',
    color: 'bg-green-100',
    path: '/labs',
  },
  {
    id: '4',
    title: 'Coming Soon',
    icon: 'database',
    color: 'bg-red-100',
    path: '/data',
  },
];