'use strict';

// Each variant reuses the same panorama tiles and application code. Only the
// visitor-facing route changes, so there is no costly duplication of assets.
window.TOUR_VARIANTS = {
  all: {
    id: 'all',
    title: 'Virtual Tour',
    groups: null,
    relatedTours: [
      { label: 'Hotel', href: '?tour=hotel' },
      { label: 'Dependance', href: '?tour=dependance' }
    ]
  },

  hotel: {
    id: 'hotel',
    title: 'Hotel',
    groups: [
      'family-suite',
      'junior-suite',
      'suite',
      'bar-and-dining',
      {
        id: 'hotel-pools',
        label: 'Hotel Pools',
        scenes: [
          '38-back-yard-pool-night',
          '41-back-yard-pool'
        ]
      }
    ],
    relatedTours: [
      { label: 'Dependance', href: '?tour=dependance' },
      { label: 'Complete tour', href: './' }
    ]
  },

  dependance: {
    id: 'dependance',
    title: 'Dependance',
    groups: [
      'superior-suite-one',
      'superior-suite-two',
      'deluxe-suite',
      'dependance',
      {
        id: 'dependance-pools',
        label: 'Pools & Rooftop',
        scenes: [
          '39-dependance-pool-at-night',
          '40-rooftop-pool-day',
          '42-dependace-cristal-pool',
          '43-dependance-pool-jacuzzi',
          '44-dependance-pool-waterblade'
        ]
      }
    ],
    relatedTours: [
      { label: 'Hotel', href: '?tour=hotel' },
      { label: 'Complete tour', href: './' }
    ]
  }
};
