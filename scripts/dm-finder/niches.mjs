// High-ticket local niches that live on social media.
//
// "value" is a rough sense of what a build + retainer is worth to them, which is
// what decides whether a $3,500 site and a $300-700/mo plan is an easy yes.
// Volume figures are from a Central NJ scan on 2026-08-08 (no-website count).

export const NICHES = {
  medspa: {
    label: 'Med spa / aesthetics / wellness',
    value: 'high',
    volume: 256,
    selectors: ['nwr["shop"="beauty"]', 'nwr["shop"="massage"]', 'nwr["leisure"="spa"]', 'nwr["amenity"="spa"]', 'nwr["shop"="cosmetics"]'],
    // OSM tags nail bars and hair salons as shop=beauty too. Those are low-ticket
    // and cannot justify a $3,500 build, so they are filtered out by name/subtag.
    match: (t) => {
      const name = (t.name || '').toLowerCase()
      const lowTicket = /\bnail|\bmani|\bpedi|barber|\bhair\b|blow ?dry|braid|lash bar|threading/.test(name)
        || t.beauty === 'nails' || t.beauty === 'hairdresser' || t.shop === 'hairdresser'
      if (lowTicket) return false
      return /med ?spa|medspa|aesthetic|laser|skin|derm|botox|inject|wellness|\bspa\b|massage|cryo|body ?sculpt/.test(name)
        || t.leisure === 'spa'
        || t.amenity === 'spa'
        || t.shop === 'massage'
    },
  },
  dental: {
    label: 'Dental practice',
    value: 'high',
    volume: 165,
    selectors: ['nwr["amenity"="dentist"]'],
    match: (t) => t.amenity === 'dentist',
  },
  furniture: {
    label: 'Furniture / cabinetry / interiors',
    value: 'high',
    volume: 122,
    selectors: ['nwr["shop"="furniture"]', 'nwr["craft"="cabinet_maker"]', 'nwr["shop"="kitchen"]', 'nwr["shop"="interior_decoration"]'],
    match: (t) => ['furniture', 'kitchen', 'interior_decoration'].includes(t.shop) || t.craft === 'cabinet_maker',
  },
  jewelry: {
    label: 'Jewelry',
    value: 'high',
    volume: 75,
    selectors: ['nwr["shop"="jewelry"]'],
    match: (t) => t.shop === 'jewelry',
  },
  venue: {
    label: 'Event venue',
    value: 'high',
    volume: 34,
    selectors: ['nwr["amenity"="events_venue"]', 'nwr["amenity"="conference_centre"]'],
    match: (t) => ['events_venue', 'conference_centre'].includes(t.amenity),
  },
  landscaping: {
    label: 'Landscaping / hardscape',
    value: 'high',
    volume: 30,
    selectors: ['nwr["craft"="gardener"]', 'nwr["shop"="garden_centre"]'],
    match: (t) => t.craft === 'gardener' || t.shop === 'garden_centre',
  },
  tattoo: {
    label: 'Tattoo studio',
    value: 'medium-high',
    volume: 28,
    selectors: ['nwr["shop"="tattoo"]'],
    match: (t) => t.shop === 'tattoo',
  },
  pool: {
    label: 'Pool / spa install',
    value: 'high',
    volume: 11,
    selectors: ['nwr["shop"="swimming_pool"]', 'nwr["shop"="pool"]'],
    match: (t) => ['swimming_pool', 'pool'].includes(t.shop),
  },
  bridal: {
    label: 'Bridal / formalwear',
    value: 'high',
    volume: 12,
    selectors: ['nwr["shop"="clothes"]["clothes"~"wedding|bridal|formal"]'],
    match: (t) => t.shop === 'clothes' && /wedding|bridal|formal/.test(t.clothes || ''),
  },
  auto: {
    label: 'Auto repair / custom',
    value: 'mixed',
    volume: 481,
    selectors: ['nwr["shop"="car_repair"]', 'nwr["shop"="car_parts"]', 'nwr["shop"="tyres"]'],
    match: (t) => ['car_repair', 'car_parts', 'tyres'].includes(t.shop),
  },
}

// Default set: high value AND visual enough that a DM with work samples lands.
export const DEFAULT_NICHES = ['medspa', 'dental', 'furniture', 'jewelry', 'venue', 'landscaping', 'tattoo', 'pool', 'bridal']

// Central NJ. south,west,north,east
export const DEFAULT_BBOX = '40.05,-75.05,40.70,-74.10'
