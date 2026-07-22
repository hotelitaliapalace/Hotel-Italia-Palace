'use strict';

// Navigation is kept separate from data.js so a future Marzipano export does
// not overwrite the curated tour structure.
window.TOUR_CONFIG = {
  groups: [
    {
      id: 'superior-suite-one',
      label: 'Superior Suite I',
      scenes: [
        '0-superior-suite-overview',
        '1-superior-suite-terrace',
        '2-superior-suite-living',
        '3-superior-suite-bedroomm'
      ]
    },
    {
      id: 'superior-suite-two',
      label: 'Superior Suite II',
      scenes: [
        '4-superior-suite-overview',
        '5-superior-suite-view',
        '6-superior-suite-bedview',
        '7-superio-suite-bedroom',
        '8-superior-suite-entrance'
      ]
    },
    {
      id: 'deluxe-suite',
      label: 'Deluxe Suite',
      scenes: [
        '45-delux-suite-overview',
        '46-delux-suite-2-overview',
        '47-delux-suite-living',
        '48-delux-suite-sleeping',
        '49-delux-suite-terrace-view',
        '50-delux-suite-bathroom'
      ]
    },
    {
      id: 'dependance',
      label: 'Dependance',
      scenes: [
        '9-dependance-harbour-view',
        '10-dependance-sundeck',
        '11-dependance-rooftop-view',
        '12-dependance-glass-pool',
        '13-dependance-entrance'
      ]
    },
    {
      id: 'family-suite',
      label: 'Family Suite',
      scenes: [
        '17-family-suite-bed-view',
        '18-family-suite-overview',
        '19-family-suite-bunk-beds',
        '20-family-suite-bathroom'
      ]
    },
    {
      id: 'junior-suite',
      label: 'Junior Suite',
      scenes: [
        '16-junior-suite-terrace',
        '21-junior-suite-overview',
        '22-junior-suite',
        '23-junior-suite-bathroom',
        '24-junior-suite-large-terrace',
        '25-junior-suite-terrace'
      ]
    },
    {
      id: 'suite',
      label: 'Suite',
      scenes: [
        '26-suite-bedroom',
        '27-suite-living',
        '28-suite-bathroom'
      ]
    },
    {
      id: 'bar-and-dining',
      label: 'Bar & Dining',
      scenes: [
        '29-bar--lounge-greenhouse',
        '30-bar--lounge-outside',
        '31-bar--lounge',
        '32-breakfast-1part',
        '33-breakfast-2part',
        '34-breakfast-3part',
        '35-restaurant-terrazza',
        '36-restaurant',
        '37-reading-room'
      ]
    },
    {
      id: 'pools-and-rooftop',
      label: 'Pools & Rooftop',
      scenes: [
        '38-back-yard-pool-night',
        '39-dependance-pool-at-night',
        '40-rooftop-pool-day',
        '41-back-yard-pool',
        '42-dependace-cristal-pool',
        '43-dependance-pool-jacuzzi',
        '44-dependance-pool-waterblade'
      ]
    }
  ],

  // Display-only corrections. IDs remain unchanged to preserve tile URLs.
  names: {
    '0-superior-suite-overview': 'Overview',
    '1-superior-suite-terrace': 'Terrace',
    '2-superior-suite-living': 'Living room',
    '3-superior-suite-bedroomm': 'Bedroom',
    '4-superior-suite-overview': 'Overview',
    '5-superior-suite-view': 'Panoramic view',
    '6-superior-suite-bedview': 'Bedroom view',
    '7-superio-suite-bedroom': 'Bedroom',
    '8-superior-suite-entrance': 'Entrance',
    '9-dependance-harbour-view': 'Harbour view',
    '10-dependance-sundeck': 'Sun deck',
    '11-dependance-rooftop-view': 'Rooftop view',
    '12-dependance-glass-pool': 'Glass pool',
    '13-dependance-entrance': 'Entrance',
    '14-hallway': 'Hallway',
    '15-hotel-stairs': 'Hotel stairs',
    '16-junior-suite-terrace': 'Terrace',
    '17-family-suite-bed-view': 'Bedroom view',
    '18-family-suite-overview': 'Overview',
    '19-family-suite-bunk-beds': 'Bunk beds',
    '20-family-suite-bathroom': 'Bathroom',
    '21-junior-suite-overview': 'Overview',
    '22-junior-suite': 'Living area',
    '23-junior-suite-bathroom': 'Bathroom',
    '24-junior-suite-large-terrace': 'Large terrace',
    '25-junior-suite-terrace': 'Terrace view',
    '26-suite-bedroom': 'Bedroom',
    '27-suite-living': 'Living room',
    '28-suite-bathroom': 'Bathroom',
    '29-bar--lounge-greenhouse': 'Greenhouse',
    '30-bar--lounge-outside': 'Outdoor lounge',
    '31-bar--lounge': 'Bar & Lounge',
    '32-breakfast-1part': 'Breakfast room I',
    '33-breakfast-2part': 'Breakfast room II',
    '34-breakfast-3part': 'Breakfast room III',
    '35-restaurant-terrazza': 'Restaurant terrace',
    '36-restaurant': 'Restaurant',
    '37-reading-room': 'Reading room',
    '38-back-yard-pool-night': 'Backyard pool · Night',
    '39-dependance-pool-at-night': 'Dependance pool · Night',
    '40-rooftop-pool-day': 'Rooftop pool · Day',
    '41-back-yard-pool': 'Backyard pool · Day',
    '42-dependace-cristal-pool': 'Crystal pool',
    '43-dependance-pool-jacuzzi': 'Pool jacuzzi',
    '44-dependance-pool-waterblade': 'Pool water blade',
    '45-delux-suite-overview': 'Overview I',
    '46-delux-suite-2-overview': 'Overview II',
    '47-delux-suite-living': 'Living room',
    '48-delux-suite-sleeping': 'Sleeping area',
    '49-delux-suite-terrace-view': 'Terrace view',
    '50-delux-suite-bathroom': 'Bathroom'
  }
};
