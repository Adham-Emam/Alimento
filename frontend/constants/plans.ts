export const plans = [
  {
    id: 'free',
    title: 'Free',
    subtitle: 'Start tracking and exploring the platform',
    price: '$0 / month',
    features: [
      { label: 'Basic nutrition tracking', available: true },
      { label: '2 daily Personalized AI meal plans', available: true },
      { label: 'Create meals & recipes', available: true },
      { label: 'Marketplace access', available: false },
      { label: 'Chat with coaches', available: false },
    ],
  },
  {
    id: 'pro',
    title: 'Pro',
    subtitle: 'For users who want deeper insights',
    price: '$14.99 / month',
    features: [
      { label: 'Everything in Free', available: true },
      { label: '30 daily Personalized AI meal plans', available: true },
      { label: 'Advanced nutrition analytics', available: true },
      { label: 'Marketplace access', available: true },
      { label: 'Chat with coaches', available: true },
    ],
  },
  {
    id: 'coach',
    title: 'Become a Coach',
    subtitle: 'Monetize your knowledge and coach others',
    price: '$24.99 / month',
    features: [
      { label: 'Create a public coach profile', available: true },
      { label: 'Accept coaching requests', available: true },
      { label: 'Chat with clients', available: true },
      { label: 'Get paid through the platform', available: true },
      { label: 'Featured coach visibility', available: true },
    ],
  },
]
