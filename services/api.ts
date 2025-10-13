import { Earthquake, Volcano, TsunamiAlert, PlateBoundary, NuclearPlant, VolcanoWarning } from '@/types';

const USGS_BASE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

export type TimeRange = 'hour' | 'day' | 'week' | 'month';
export type MagnitudeRange = 'significant' | 'all' | '4.5' | '2.5' | '1.0';

export const fetchEarthquakes = async (
  timeRange: TimeRange,
  magnitudeRange: MagnitudeRange
): Promise<Earthquake[]> => {
  const url = `${USGS_BASE_URL}/${magnitudeRange}_${timeRange}.geojson`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.features.map((feature: any) => ({
      id: feature.id,
      time: feature.properties.time,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      magnitude: feature.properties.mag,
      magnitudeType: feature.properties.magType,
      depth: feature.geometry.coordinates[2],
      place: feature.properties.place,
      mmi: feature.properties.mmi,
      tsunami: feature.properties.tsunami === 1,
      url: feature.properties.url,
      source: feature.properties.net,
      status: feature.properties.status,
      type: feature.properties.type,
      felt: feature.properties.felt,
      cdi: feature.properties.cdi,
      alert: feature.properties.alert,
      sig: feature.properties.sig,
      net: feature.properties.net,
      code: feature.properties.code,
      ids: feature.properties.ids,
      sources: feature.properties.sources,
      types: feature.properties.types,
      nst: feature.properties.nst,
      dmin: feature.properties.dmin,
      rms: feature.properties.rms,
      gap: feature.properties.gap,
      magError: feature.properties.magError,
      depthError: feature.properties.depthError,
      horizontalError: feature.properties.horizontalError,
      locationSource: feature.properties.net,
      magSource: feature.properties.net,
    }));
  } catch (error) {
    console.error('Failed to fetch earthquakes:', error);
    throw error;
  }
};

const ACTIVE_VOLCANOES: Volcano[] = [
  { id: 'sabancaya', name: 'Sabancaya', latitude: -15.787, longitude: -71.857, country: 'Peru', region: 'Arequipa', elevation: 5967, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'September 13, 2025', activitySummary: 'Continuing eruption started September 13, 2025', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP'], category: 'active' },
  { id: 'krasheninnikov', name: 'Krasheninnikov', latitude: 54.593, longitude: 160.273, country: 'Russia', region: 'Kamchatka', elevation: 1856, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'August 2, 2025', activitySummary: 'Continuing eruption started August 2, 2025', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'KVERT'], category: 'active' },
  { id: 'telica', name: 'Telica', latitude: 12.602, longitude: -86.845, country: 'Nicaragua', region: 'León', elevation: 1061, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'July 14, 2025', activitySummary: 'Continuing eruption started July 14, 2025', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP'], category: 'active' },
  { id: 'kirishimayama', name: 'Kirishimayama', latitude: 31.931, longitude: 130.864, country: 'Japan', region: 'Kyushu', elevation: 1700, type: 'Shield Volcano', status: 'continuing eruption', lastEruptionDate: 'June 22, 2025', activitySummary: 'Continuing eruption started June 22, 2025', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'JMA'], category: 'active' },
  { id: 'karymsky', name: 'Karymsky', latitude: 54.049, longitude: 159.443, country: 'Russia', region: 'Kamchatka', elevation: 1513, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'April 30, 2025', activitySummary: 'Continuing eruption started April 30, 2025', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'KVERT'], category: 'active' },
  { id: 'ulawun', name: 'Ulawun', latitude: -5.050, longitude: 151.330, country: 'Papua New Guinea', region: 'New Britain', elevation: 2334, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'March 27, 2025', activitySummary: 'Continuing eruption started March 27, 2025', alertLevel: 'watch', vei: 3, sources: ['Smithsonian GVP', 'RVO'], category: 'active' },
  { id: 'raung', name: 'Raung', latitude: -8.125, longitude: 114.042, country: 'Indonesia', region: 'Java', elevation: 3332, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'March 13, 2025', activitySummary: 'Continuing eruption started March 13, 2025', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'PVMBG'], category: 'active' },
  { id: 'lewotolok', name: 'Lewotolok', latitude: -8.272, longitude: 123.505, country: 'Indonesia', region: 'Lembata', elevation: 1423, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'January 16, 2025', activitySummary: 'Continuing eruption started January 16, 2025', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'PVMBG'], category: 'active' },
  { id: 'poas', name: 'Poás', latitude: 10.200, longitude: -84.233, country: 'Costa Rica', region: 'Alajuela', elevation: 2708, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'January 5, 2025', activitySummary: 'Continuing eruption started January 5, 2025', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'OVSICORI'], category: 'active' },
  { id: 'bezymianny', name: 'Bezymianny', latitude: 55.972, longitude: 160.595, country: 'Russia', region: 'Kamchatka', elevation: 2882, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'December 24, 2024', activitySummary: 'Continuing eruption started December 24, 2024', alertLevel: 'watch', vei: 3, sources: ['Smithsonian GVP', 'KVERT'], category: 'active' },
  { id: 'kilauea', name: 'Kīlauea', latitude: 19.4069, longitude: -155.2834, country: 'United States', region: 'Hawaiʻi', elevation: 1247, type: 'Shield Volcano', status: 'continuing eruption', lastEruptionDate: 'December 23, 2024', activitySummary: 'Continuing eruption started December 23, 2024. HVO alert: WATCH/ORANGE', alertLevel: 'watch', vei: 0, sources: ['Smithsonian GVP', 'USGS HVO'], url: 'https://www.usgs.gov/volcanoes/kilauea', category: 'active' },
  { id: 'kanlaon', name: 'Kanlaon', latitude: 10.4123, longitude: 123.1320, country: 'Philippines', region: 'Negros Occidental', elevation: 2435, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'October 19, 2024', activitySummary: 'Continuing eruption started October 19, 2024', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'PHIVOLCS'], url: 'https://www.phivolcs.dost.gov.ph/volcano/Kanlaon', category: 'active' },
  { id: 'taal', name: 'Taal', latitude: 14.0023, longitude: 120.9933, country: 'Philippines', region: 'Batangas', elevation: 311, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'April 4, 2024', activitySummary: 'Continuing eruption started April 4, 2024', alertLevel: 'advisory', vei: 2, sources: ['Smithsonian GVP', 'PHIVOLCS'], url: 'https://www.phivolcs.dost.gov.ph/volcano/Taal', category: 'active' },
  { id: 'lewotobi', name: 'Lewotobi', latitude: -8.532, longitude: 122.775, country: 'Indonesia', region: 'Flores', elevation: 1703, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'December 23, 2023', activitySummary: 'Continuing eruption started December 23, 2023', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'PVMBG'], category: 'active' },
  { id: 'marapi', name: 'Marapi', latitude: -0.381, longitude: 100.473, country: 'Indonesia', region: 'Sumatra', elevation: 2891, type: 'Complex Volcano', status: 'continuing eruption', lastEruptionDate: 'December 3, 2023', activitySummary: 'Continuing eruption started December 3, 2023', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'PVMBG'], category: 'active' },
  { id: 'etna', name: 'Etna', latitude: 37.7510, longitude: 14.9934, country: 'Italy', region: 'Sicily', elevation: 3357, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'November 27, 2022', activitySummary: 'Continuing eruption started November 27, 2022. Most active volcano in Europe', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'INGV'], url: 'https://www.ingv.it/en/volcanoes/monitoring/etna.html', category: 'active' },
  { id: 'great-sitkin', name: 'Great Sitkin', latitude: 52.076, longitude: -176.130, country: 'United States', region: 'Alaska', elevation: 1740, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'May 25, 2021', activitySummary: 'Continuing eruption started May 25, 2021', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'AVO'], category: 'active' },
  { id: 'merapi', name: 'Merapi', latitude: -7.5408, longitude: 110.4458, country: 'Indonesia', region: 'Java', elevation: 2930, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'December 31, 2020', activitySummary: 'Continuing eruption started December 31, 2020. Very active volcano', alertLevel: 'watch', vei: 3, sources: ['Smithsonian GVP', 'PVMBG'], url: 'https://www.vsi.esdm.go.id/', category: 'active' },
  { id: 'sangay', name: 'Sangay', latitude: -2.005, longitude: -78.341, country: 'Ecuador', region: 'Morona-Santiago', elevation: 5286, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'March 26, 2019', activitySummary: 'Continuing eruption started March 26, 2019', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'IG-EPN'], category: 'active' },
  { id: 'semeru', name: 'Semeru', latitude: -8.108, longitude: 112.922, country: 'Indonesia', region: 'Java', elevation: 3657, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'February 24, 2019', activitySummary: 'Continuing eruption started February 24, 2019', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'PVMBG'], category: 'active' },
  { id: 'manam', name: 'Manam', latitude: -4.080, longitude: 145.037, country: 'Papua New Guinea', region: 'Madang', elevation: 1807, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'June 10, 2018', activitySummary: 'Continuing eruption started June 10, 2018', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'RVO'], category: 'active' },
  { id: 'nyamulagira', name: 'Nyamulagira', latitude: -1.408, longitude: 29.200, country: 'DR Congo', region: 'North Kivu', elevation: 3058, type: 'Shield Volcano', status: 'continuing eruption', lastEruptionDate: 'April 14, 2018', activitySummary: 'Continuing eruption started April 14, 2018', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'OVG'], category: 'active' },
  { id: 'ol-doinyo-lengai', name: 'Ol Doinyo Lengai', latitude: -2.764, longitude: 35.914, country: 'Tanzania', region: 'Arusha', elevation: 2962, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'April 9, 2017', activitySummary: 'Continuing eruption started April 9, 2017. Unique natrocarbonatite lava', alertLevel: 'normal', vei: 2, sources: ['Smithsonian GVP'], category: 'active' },
  { id: 'aira-sakurajima', name: 'Aira (Sakurajima)', latitude: 31.5850, longitude: 130.6572, country: 'Japan', region: 'Kyushu', elevation: 1117, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'March 25, 2017', activitySummary: 'Continuing eruption started March 25, 2017. Frequent eruptions', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'JMA'], url: 'https://www.jma.go.jp/', category: 'active' },
  { id: 'langila', name: 'Langila', latitude: -5.525, longitude: 148.420, country: 'Papua New Guinea', region: 'New Britain', elevation: 1330, type: 'Complex Volcano', status: 'continuing eruption', lastEruptionDate: 'October 22, 2022', activitySummary: 'Continuing eruption', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'RVO'], category: 'active' },
  { id: 'masaya', name: 'Masaya', latitude: 11.984, longitude: -86.161, country: 'Nicaragua', region: 'Masaya', elevation: 635, type: 'Shield Volcano', status: 'continuing eruption', lastEruptionDate: 'October 3, 2015', activitySummary: 'Lava lake activity since October 3, 2015', alertLevel: 'watch', vei: 1, sources: ['Smithsonian GVP', 'INETER'], category: 'active' },
  { id: 'tofua', name: 'Tofua', latitude: -19.750, longitude: -175.070, country: 'Tonga', region: 'Ha\'apai', elevation: 515, type: 'Caldera', status: 'continuing eruption', lastEruptionDate: 'October 2, 2015', activitySummary: 'Lava lake activity since October 2, 2015', alertLevel: 'normal', vei: 1, sources: ['Smithsonian GVP'], category: 'active' },
  { id: 'nevado-del-ruiz', name: 'Nevado del Ruiz', latitude: 4.892, longitude: -75.324, country: 'Colombia', region: 'Tolima', elevation: 5321, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'November 18, 2014', activitySummary: 'Continuing eruption started November 18, 2014', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'SGC'], category: 'active' },
  { id: 'saunders', name: 'Saunders', latitude: -57.800, longitude: -26.450, country: 'United Kingdom', region: 'South Sandwich Islands', elevation: 990, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'November 12, 2014', activitySummary: 'Lava lake activity since November 12, 2014', alertLevel: 'normal', vei: 1, sources: ['Smithsonian GVP'], category: 'active' },
  { id: 'heard', name: 'Heard', latitude: -53.106, longitude: 73.513, country: 'Australia', region: 'Heard Island', elevation: 2745, type: 'Complex Volcano', status: 'continuing eruption', lastEruptionDate: 'September 5, 2012', activitySummary: 'Lava lake activity since September 5, 2012', alertLevel: 'normal', vei: 1, sources: ['Smithsonian GVP'], category: 'active' },
  { id: 'reventador', name: 'Reventador', latitude: -0.077, longitude: -77.656, country: 'Ecuador', region: 'Napo', elevation: 3562, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'July 27, 2008', activitySummary: 'Continuing eruption started July 27, 2008', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'IG-EPN'], category: 'active' },
  { id: 'ibu', name: 'Ibu', latitude: 1.488, longitude: 127.630, country: 'Indonesia', region: 'Halmahera', elevation: 1325, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'April 5, 2008', activitySummary: 'Continuing eruption started April 5, 2008', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'PVMBG'], category: 'active' },
  { id: 'popocatepetl', name: 'Popocatépetl', latitude: 19.0232, longitude: -98.6278, country: 'Mexico', region: 'Central Mexico', elevation: 5426, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'January 9, 2005', activitySummary: 'Continuing eruption started January 9, 2005. Near Mexico City', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'CENAPRED'], url: 'https://www.gob.mx/cenapred', category: 'active' },
  { id: 'suwanosejima', name: 'Suwanosejima', latitude: 29.638, longitude: 129.714, country: 'Japan', region: 'Ryukyu Islands', elevation: 796, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'October 23, 2004', activitySummary: 'Continuing eruption started October 23, 2004', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'JMA'], category: 'active' },
  { id: 'nyiragongo', name: 'Nyiragongo', latitude: -1.520, longitude: 29.250, country: 'DR Congo', region: 'North Kivu', elevation: 3470, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'May 17, 2002', activitySummary: 'Lava lake activity (intermittent) since May 17, 2002', alertLevel: 'watch', vei: 1, sources: ['Smithsonian GVP', 'OVG'], category: 'active' },
  { id: 'fuego', name: 'Fuego', latitude: 14.473, longitude: -90.880, country: 'Guatemala', region: 'Sacatepéquez', elevation: 3763, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'January 4, 2002', activitySummary: 'Continuing eruption started January 4, 2002', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'INSIVUMEH'], category: 'active' },
  { id: 'bagana', name: 'Bagana', latitude: -6.137, longitude: 155.196, country: 'Papua New Guinea', region: 'Bougainville', elevation: 1750, type: 'Lava Cone', status: 'continuing eruption', lastEruptionDate: 'February 28, 2000', activitySummary: 'Continuing eruption started February 28, 2000', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'RVO'], category: 'active' },
  { id: 'sheveluch', name: 'Sheveluch', latitude: 56.6530, longitude: 161.3600, country: 'Russia', region: 'Kamchatka', elevation: 3283, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'August 15, 1999', activitySummary: 'Continuing eruption started August 15, 1999. Very active', alertLevel: 'watch', vei: 3, sources: ['Smithsonian GVP', 'KVERT'], url: 'http://www.kscnet.ru/ivs/kvert/', category: 'active' },
  { id: 'erebus', name: 'Erebus', latitude: -77.530, longitude: 167.170, country: 'Antarctica', region: 'Ross Island', elevation: 3794, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: '1972', activitySummary: 'Lava lake active since 1972', alertLevel: 'normal', vei: 1, sources: ['Smithsonian GVP'], category: 'active' },
  { id: 'erta-ale', name: 'Erta Ale', latitude: 13.605, longitude: 40.666, country: 'Ethiopia', region: 'Afar', elevation: 613, type: 'Shield Volcano', status: 'continuing eruption', lastEruptionDate: 'July 2, 1967', activitySummary: 'Long-lived lava lake activity since July 2, 1967', alertLevel: 'normal', vei: 1, sources: ['Smithsonian GVP'], category: 'active' },
  { id: 'stromboli', name: 'Stromboli', latitude: 38.7890, longitude: 15.2130, country: 'Italy', region: 'Aeolian Islands', elevation: 926, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'February 2, 1934', activitySummary: 'Near-continuous Strombolian bursts since February 2, 1934', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'INGV'], url: 'https://www.ingv.it/', category: 'active' },
  { id: 'dukono', name: 'Dukono', latitude: 1.693, longitude: 127.894, country: 'Indonesia', region: 'Halmahera', elevation: 1229, type: 'Complex Volcano', status: 'continuing eruption', lastEruptionDate: 'August 13, 1933', activitySummary: 'Continuing eruption started August 13, 1933', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'PVMBG'], category: 'active' },
  { id: 'santa-maria-santiaguito', name: 'Santa María (Santiaguito)', latitude: 14.756, longitude: -91.552, country: 'Guatemala', region: 'Quetzaltenango', elevation: 3772, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: 'June 22, 1922', activitySummary: 'Continuing eruption started June 22, 1922', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP', 'INSIVUMEH'], category: 'active' },
  { id: 'yasur', name: 'Yasur', latitude: -19.532, longitude: 169.425, country: 'Vanuatu', region: 'Tanna', elevation: 361, type: 'Stratovolcano', status: 'continuing eruption', lastEruptionDate: '~1270 CE', activitySummary: 'Frequent explosions active since ~1270 CE', alertLevel: 'watch', vei: 2, sources: ['Smithsonian GVP'], category: 'active' },
];

const SUPER_VOLCANOES: Volcano[] = [
  {
    id: 'yellowstone',
    name: 'Yellowstone',
    latitude: 44.428,
    longitude: -110.588,
    country: 'United States',
    region: 'Wyoming',
    elevation: 2805,
    type: 'Caldera',
    status: 'dormant',
    lastEruptionDate: '~631,000 years ago',
    lastMajorEruption: '~631,000 years ago',
    calderaSize: '~55 x 72 km',
    activitySummary: 'Three major eruptions: 2.1 million, 1.3 million, and 631,000 years ago',
    description: 'Hidden under Yellowstone National Park, this huge supervolcano has erupted three times — the last one about 631,000 years ago! It created massive lakes and geysers. Today, you can still see boiling hot springs and Old Faithful geyser powered by underground magma. Fun fact: If it erupted again (which is very unlikely soon), it could change global weather for years!',
    alertLevel: 'normal',
    vei: 8,
    sources: ['USGS', 'Yellowstone Volcano Observatory'],
    url: 'https://www.usgs.gov/volcanoes/yellowstone',
    category: 'super',
  },
  {
    id: 'taupo',
    name: 'Taupō',
    latitude: -38.82,
    longitude: 176.0,
    country: 'New Zealand',
    region: 'North Island',
    elevation: 760,
    type: 'Caldera',
    status: 'dormant',
    lastEruptionDate: '~26,500 years ago',
    lastMajorEruption: '~26,500 years ago (Oruanui eruption)',
    calderaSize: '~35 km diameter',
    activitySummary: 'Oruanui eruption was one of Earth\'s largest eruptions in the last 70,000 years',
    description: 'About 26,500 years ago, Taupō exploded in one of Earth\'s biggest eruptions ever, leaving a giant lake in the center of New Zealand. People can still see steaming vents and earthquakes there. Fun fact: The whole Lake Taupō is actually the volcano\'s top — a giant water-filled crater!',
    alertLevel: 'normal',
    vei: 8,
    sources: ['GNS Science', 'GeoNet'],
    category: 'super',
  },
  {
    id: 'toba',
    name: 'Toba',
    latitude: 2.685,
    longitude: 98.875,
    country: 'Indonesia',
    region: 'Sumatra',
    elevation: 905,
    type: 'Caldera',
    status: 'dormant',
    lastEruptionDate: '~74,000 years ago',
    lastMajorEruption: '~74,000 years ago',
    calderaSize: '~100 x 30 km',
    activitySummary: 'Largest volcanic eruption in the last 25 million years',
    description: 'Roughly 74,000 years ago, Toba erupted so massively that scientists believe it may have cooled the planet for several years. It created Lake Toba, the largest volcanic lake in the world. Fun fact: The eruption was 2,800 times bigger than Mount St. Helens\' 1980 blast!',
    alertLevel: 'normal',
    vei: 8,
    sources: ['Smithsonian GVP', 'PVMBG'],
    category: 'super',
  },
  {
    id: 'la-garita',
    name: 'La Garita',
    latitude: 37.75,
    longitude: -106.93,
    country: 'United States',
    region: 'Colorado',
    elevation: 3700,
    type: 'Caldera',
    status: 'extinct',
    lastEruptionDate: '~28 million years ago',
    lastMajorEruption: '~28 million years ago (Fish Canyon Tuff)',
    calderaSize: '~35 x 75 km',
    activitySummary: 'Produced one of the largest known volcanic eruptions on Earth',
    description: 'Located in Colorado, this volcano produced one of the largest eruptions ever about 28 million years ago — the Fish Canyon Tuff. The caldera is now quiet and covered by mountains. Fun fact: The eruption was so huge it could have covered half the United States in ash!',
    alertLevel: 'normal',
    vei: 9,
    sources: ['USGS'],
    category: 'super',
  },
  {
    id: 'la-pacana',
    name: 'La Pacana',
    latitude: -23.15,
    longitude: -67.40,
    country: 'Chile',
    region: 'Atacama Desert',
    elevation: 5400,
    type: 'Caldera',
    status: 'extinct',
    lastEruptionDate: '~4 million years ago',
    lastMajorEruption: '~4 million years ago',
    calderaSize: '~60 km diameter',
    activitySummary: 'One of Earth\'s largest known volcanic deposits',
    description: 'In Chile\'s Atacama Desert, La Pacana erupted around 4 million years ago, producing one of Earth\'s largest known volcanic deposits. Its caldera is about 60 km wide! Fun fact: Scientists can still see enormous ring structures from space.',
    alertLevel: 'normal',
    vei: 8,
    sources: ['SERNAGEOMIN'],
    category: 'super',
  },
  {
    id: 'cerro-galan',
    name: 'Cerro Galán',
    latitude: -25.98,
    longitude: -66.88,
    country: 'Argentina',
    region: 'Catamarca',
    elevation: 5912,
    type: 'Caldera',
    status: 'extinct',
    lastEruptionDate: '~2 million years ago',
    lastMajorEruption: '~2 million years ago',
    calderaSize: '~35 x 40 km',
    activitySummary: 'One of the world\'s highest calderas at nearly 4,000 m above sea level',
    description: 'Formed about 2 million years ago, Cerro Galán\'s eruption left a huge high-altitude crater in the Andes. It\'s one of the world\'s highest calderas at nearly 4,000 m above sea level. Fun fact: You can see colorful mineral lakes inside the old volcano.',
    alertLevel: 'normal',
    vei: 8,
    sources: ['SEGEMAR'],
    category: 'super',
  },
  {
    id: 'campi-flegrei',
    name: 'Campi Flegrei',
    latitude: 40.827,
    longitude: 14.139,
    country: 'Italy',
    region: 'Campania',
    elevation: 458,
    type: 'Caldera',
    status: 'active',
    lastEruptionDate: '1538',
    lastMajorEruption: '~39,000 years ago (Campanian Ignimbrite)',
    calderaSize: '~13 km diameter',
    activitySummary: 'Europe\'s biggest eruption in 200,000 years occurred ~39,000 years ago',
    description: 'Just west of Naples, this "Phlegraean Fields" supervolcano erupted around 39,000 years ago — Europe\'s biggest in 200,000 years. Today, it still steams and shakes occasionally. Fun fact: The Romans bathed in its warm springs, unaware they sat inside a supervolcano!',
    alertLevel: 'advisory',
    vei: 7,
    sources: ['INGV'],
    url: 'https://www.ingv.it/',
    category: 'super',
  },
  {
    id: 'long-valley',
    name: 'Long Valley Caldera',
    latitude: 37.70,
    longitude: -118.87,
    country: 'United States',
    region: 'California',
    elevation: 2500,
    type: 'Caldera',
    status: 'active',
    lastEruptionDate: '~760,000 years ago',
    lastMajorEruption: '~760,000 years ago',
    calderaSize: '~17 x 32 km',
    activitySummary: 'Created the beautiful Sierra Nevada scenery',
    description: 'Near California\'s Mammoth Lakes, this volcano erupted about 760,000 years ago. It left a 17 × 32 km caldera and created the beautiful Sierra Nevada scenery. Fun fact: Geologists watch it closely, but most activity is just hot gas and small quakes.',
    alertLevel: 'advisory',
    vei: 7,
    sources: ['USGS', 'California Volcano Observatory'],
    url: 'https://www.usgs.gov/volcanoes/long-valley',
    category: 'super',
  },
  {
    id: 'aso-caldera',
    name: 'Aso Caldera',
    latitude: 32.884,
    longitude: 131.104,
    country: 'Japan',
    region: 'Kyushu',
    elevation: 1592,
    type: 'Caldera',
    status: 'active',
    lastEruptionDate: '2021',
    lastMajorEruption: '~90,000 years ago (Aso-4)',
    calderaSize: '~25 km diameter',
    activitySummary: 'Shaped by four ancient eruptions, still active today',
    description: 'Aso is still active! Its huge caldera (about 25 km across) was shaped by four ancient eruptions, the last about 90,000 years ago. It\'s one of Japan\'s natural wonders. Fun fact: You can drive inside the caldera and see a real steaming crater!',
    alertLevel: 'watch',
    vei: 7,
    sources: ['JMA', 'Smithsonian GVP'],
    url: 'https://www.jma.go.jp/',
    category: 'super',
  },
  {
    id: 'whakamaru',
    name: 'Whakamaru Caldera',
    latitude: -38.37,
    longitude: 175.88,
    country: 'New Zealand',
    region: 'North Island',
    elevation: 400,
    type: 'Caldera',
    status: 'dormant',
    lastEruptionDate: '~340,000 years ago',
    lastMajorEruption: '~340,000 years ago',
    calderaSize: '~30 km diameter',
    activitySummary: 'Ejected over 1,000 km³ of material',
    description: 'One of Taupō\'s older neighbors, Whakamaru erupted about 340,000 years ago, ejecting over 1,000 km³ of material. It helped shape New Zealand\'s central volcanic plateau. Fun fact: The nearby forests and lakes sit on ancient volcanic ash.',
    alertLevel: 'normal',
    vei: 8,
    sources: ['GNS Science', 'GeoNet'],
    category: 'super',
  },
  {
    id: 'apolaki',
    name: 'Apolaki Caldera',
    latitude: 14.57,
    longitude: 126.27,
    country: 'Philippines',
    region: 'Philippine Sea (Benham Rise)',
    elevation: -3000,
    type: 'Caldera',
    status: 'extinct',
    lastEruptionDate: '~48-26 million years ago',
    lastMajorEruption: '~48-26 million years ago',
    calderaSize: '~150 km diameter',
    activitySummary: 'Discovered in 2019, possibly world\'s largest caldera',
    description: 'It was "discovered" recently (2019) by Filipino geophysicists using gravity and seafloor mapping data. The caldera is enormous — about 150 km in diameter. Some media reports call it the "world\'s largest caldera," though that is subject to scientific debate. The area (Benham Rise) is made of thick volcanic/magmatic rocks, with ages between about 48 to 26 million years ago. Because it\'s underwater and ancient, no modern eruption activity is observed. In fact, it\'s believed to be inactive for millions of years. There is some uncertainty whether Apolaki is strictly a volcanic caldera (from a giant eruption) or partly a collapse structure or other geological process. Because it\'s underwater, if there ever were an eruption, many volcanic products would be suppressed (water pressure, gas dissolving) — underwater volcanism behaves differently than land volcanoes.',
    alertLevel: 'normal',
    vei: 8,
    sources: ['UP Marine Science Institute', 'PHIVOLCS'],
    category: 'super',
  },
];

export const fetchVolcanoes = async (): Promise<Volcano[]> => {
  return [...ACTIVE_VOLCANOES, ...SUPER_VOLCANOES];
};

const fetchNOAATsunamiAlerts = async (): Promise<TsunamiAlert[]> => {
  try {
    const url = 'https://api.weather.gov/alerts/active?event=Tsunami';
    const response = await fetch(url, { headers: { Accept: 'application/geo+json', 'User-Agent': 'EarthquakeApp/1.0' } });
    if (!response.ok) {
      console.warn(`NOAA Tsunami API error: ${response.status}`);
      return [];
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('json')) {
      console.warn('NOAA Tsunami API returned non-JSON response');
      return [];
    }
    const text = await response.text();
    if (!text || text.trim().length === 0) {
      console.warn('NOAA Tsunami API returned empty response');
      return [];
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.warn('NOAA Tsunami API returned invalid JSON:', text.substring(0, 100));
      console.warn('Parse error:', parseError);
      return [];
    }
    const features = Array.isArray(data.features) ? data.features : [];
    return features.map((f: any, idx: number) => {
      const props = f.properties ?? {};
      const geom = f.geometry ?? null;
      return {
        id: `noaa-${f.id?.toString() ?? String(idx)}`,
        title: props.headline ?? props.event ?? 'Tsunami Alert',
        areaDescription: props.areaDesc ?? '',
        description: props.description ?? props.instruction ?? '',
        sent: props.sent ?? props.effective ?? props.onset ?? null,
        ends: props.ends ?? null,
        severity: props.severity ?? 'Unknown',
        certainty: props.certainty ?? 'Unknown',
        urgency: props.urgency ?? 'Unknown',
        event: props.event ?? 'Tsunami',
        geometry: geom,
        source: 'NOAA/NWS',
      } as TsunamiAlert;
    });
  } catch (error) {
    console.warn('Failed to fetch NOAA tsunami alerts:', error);
    return [];
  }
};

const fetchUSGSTsunamiData = async (): Promise<TsunamiAlert[]> => {
  try {
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`USGS Tsunami data error: ${response.status}`);
      return [];
    }
    const contentType = response.headers.get('content-type');
    const text = await response.text();
    if (!text || text.trim().length === 0) {
      console.warn('USGS Tsunami API returned empty response');
      return [];
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.warn('USGS Tsunami API returned invalid JSON:', text.substring(0, 100));
      console.warn('Parse error:', parseError);
      console.warn('Content-Type:', contentType);
      return [];
    }
    const features = Array.isArray(data.features) ? data.features : [];
    const tsunamiEvents = features.filter((f: any) => f.properties?.tsunami === 1);
    
    return tsunamiEvents.map((f: any, idx: number) => {
      const props = f.properties ?? {};
      const coords = f.geometry?.coordinates ?? [0, 0];
      return {
        id: `usgs-${f.id ?? String(idx)}`,
        title: `Tsunami-generating Earthquake: ${props.place ?? 'Unknown location'}`,
        areaDescription: props.place ?? 'Unknown location',
        description: `Magnitude ${props.mag} earthquake with tsunami potential. Time: ${new Date(props.time).toLocaleString()}`,
        sent: new Date(props.time).toISOString(),
        ends: null,
        severity: props.mag >= 7.5 ? 'Extreme' : props.mag >= 7.0 ? 'Severe' : 'Moderate',
        certainty: 'Observed',
        urgency: 'Immediate',
        event: 'Tsunami',
        geometry: {
          type: 'Point',
          coordinates: [coords[0], coords[1]],
        },
        source: 'USGS',
      } as TsunamiAlert;
    });
  } catch (error) {
    console.warn('Failed to fetch USGS tsunami data:', error);
    return [];
  }
};

const getPhilippinesTsunamiInfo = (): TsunamiAlert[] => {
  const philippinesAlerts: TsunamiAlert[] = [
    {
      id: 'ph-info-1',
      title: 'Philippines Tsunami Monitoring - PHIVOLCS',
      areaDescription: 'Philippines',
      description: 'The Philippine Institute of Volcanology and Seismology (PHIVOLCS) monitors tsunami threats in the Philippines. For real-time alerts, visit https://www.phivolcs.dost.gov.ph/ or follow their official social media channels. The Philippines is at risk from tsunamis generated by earthquakes in the Philippine Trench, Manila Trench, and other nearby subduction zones.',
      sent: new Date().toISOString(),
      ends: null,
      severity: 'Unknown',
      certainty: 'Unknown',
      urgency: 'Unknown',
      event: 'Information',
      geometry: {
        type: 'Point',
        coordinates: [121.7740, 12.8797],
      },
      source: 'PHIVOLCS',
    },
  ];
  return philippinesAlerts;
};

export const fetchTsunamiAlerts = async (): Promise<TsunamiAlert[]> => {
  try {
    const [noaaAlerts, usgsAlerts, phInfo] = await Promise.all([
      fetchNOAATsunamiAlerts(),
      fetchUSGSTsunamiData(),
      Promise.resolve(getPhilippinesTsunamiInfo()),
    ]);

    const allAlerts = [...noaaAlerts, ...usgsAlerts, ...phInfo];
    
    const uniqueAlerts = allAlerts.filter((alert, index, self) => 
      index === self.findIndex((a) => a.id === alert.id)
    );

    return uniqueAlerts.sort((a, b) => {
      const timeA = a.sent ? new Date(a.sent).getTime() : 0;
      const timeB = b.sent ? new Date(b.sent).getTime() : 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error('Failed to fetch tsunami alerts from all sources:', error);
    return getPhilippinesTsunamiInfo();
  }
};

export const fetchPlateBoundaries = async (): Promise<PlateBoundary[]> => {
  try {
    const url = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const features = data.features ?? [];
    return features.map((f: any, i: number) => ({
      id: f.id?.toString() ?? String(i),
      coordinates: f.geometry?.coordinates ?? [],
      name: f.properties?.Name ?? 'Boundary',
      type: f.properties?.Type ?? 'Boundary',
    })) as PlateBoundary[];
  } catch (e) {
    console.error('Failed to fetch plate boundaries', e);
    return [];
  }
};

const MOCK_NUCLEAR_PLANTS: NuclearPlant[] = [
  { id: '1', name: 'Fukushima Daiichi', country: 'Japan', latitude: 37.4217, longitude: 141.0327 },
  { id: '2', name: 'Chernobyl', country: 'Ukraine', latitude: 51.3890, longitude: 30.0990 },
  { id: '3', name: 'Three Mile Island', country: 'United States', latitude: 40.1536, longitude: -76.7250 },
  { id: '4', name: 'Diablo Canyon', country: 'United States', latitude: 35.2111, longitude: -120.8522 },
  { id: '5', name: 'Palo Verde', country: 'United States', latitude: 33.3883, longitude: -112.8650 },
  { id: '6', name: 'Bruce Nuclear', country: 'Canada', latitude: 44.3333, longitude: -81.6000 },
  { id: '7', name: 'Gravelines', country: 'France', latitude: 51.0133, longitude: 2.1333 },
  { id: '8', name: 'Zaporizhzhia', country: 'Ukraine', latitude: 47.5147, longitude: 34.5858 },
  // Add more known plants
  { id: '9', name: 'Cattenom', country: 'France', latitude: 49.4167, longitude: 6.2167 },
  { id: '10', name: 'Sizewell B', country: 'United Kingdom', latitude: 52.2150, longitude: 1.6190 },
  { id: '11', name: 'Forsmark', country: 'Sweden', latitude: 60.3833, longitude: 18.1667 },
  { id: '12', name: 'Olkiluoto', country: 'Finland', latitude: 61.2333, longitude: 21.4333 },
  { id: '13', name: 'Kashiwazaki-Kariwa', country: 'Japan', latitude: 37.4333, longitude: 138.6000 },
  { id: '14', name: 'Limerick', country: 'United States', latitude: 40.2267, longitude: -75.5850 },
  { id: '15', name: 'Ringhals', country: 'Sweden', latitude: 57.2667, longitude: 12.1167 },
];

export const fetchNuclearPlants = async (): Promise<NuclearPlant[]> => {
  try {
    const url = 'https://raw.githubusercontent.com/plotly/datasets/master/nuclear_power_plants.csv';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      console.warn(`Nuclear plants API returned status ${res.status}, using mock data`);
      return MOCK_NUCLEAR_PLANTS;
    }
    
    const text = await res.text();
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.warn('Nuclear plants API returned empty response, using mock data');
      return MOCK_NUCLEAR_PLANTS;
    }
    
    const lines = text.split('\n').filter((l) => l.trim().length > 0);
    const header = lines.shift();
    if (!header) {
      console.warn('Nuclear plants API returned no header, using mock data');
      return MOCK_NUCLEAR_PLANTS;
    }
    
    const cols = header.split(',');
    const latIdx = cols.findIndex((c) => /lat/i.test(c));
    const lonIdx = cols.findIndex((c) => /lon/i.test(c));
    const nameIdx = cols.findIndex((c) => /name/i.test(c));
    const countryIdx = cols.findIndex((c) => /country/i.test(c));

    const plants: NuclearPlant[] = [];
    lines.forEach((line, idx) => {
      const parts = line.split(',');
      const lat = Number(parts[latIdx] ?? 0);
      const lon = Number(parts[lonIdx] ?? 0);
      if (Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0 && lon !== 0) {
        plants.push({
          id: String(idx),
          name: (parts[nameIdx] ?? 'Nuclear Plant').trim(),
          country: (parts[countryIdx] ?? 'Unknown').trim(),
          latitude: lat,
          longitude: lon,
        });
      }
    });
    
    if (plants.length === 0) {
      console.warn('Nuclear plants API returned no valid data, using mock data');
      return MOCK_NUCLEAR_PLANTS;
    }
    
    return plants;
  } catch (e) {
    console.warn('Failed to fetch nuclear plants, using mock data:', e);
    return MOCK_NUCLEAR_PLANTS;
  }
};

export const formatTime = (timestamp: number, format: '12h' | '24h'): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (format === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${date.toLocaleDateString()} ${displayHours}:${minutes} ${period}`;
  }

  return `${date.toLocaleDateString()} ${hours.toString().padStart(2, '0')}:${minutes}`;
};

export const formatDepth = (depth: number, units: 'metric' | 'imperial'): string => {
  if (units === 'imperial') {
    const miles = depth * 0.621371;
    return `${miles.toFixed(1)} mi`;
  }
  return `${depth.toFixed(1)} km`;
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const fetchVolcanoWarnings = async (): Promise<VolcanoWarning[]> => {
  try {
    const warnings: VolcanoWarning[] = [];

    const activeVolcanoes = ACTIVE_VOLCANOES.filter(v => 
      v.alertLevel === 'watch' || v.alertLevel === 'warning' || v.alertLevel === 'advisory'
    );

    activeVolcanoes.forEach(volcano => {
      warnings.push({
        id: `warning-${volcano.id}`,
        volcanoName: volcano.name,
        country: volcano.country,
        region: volcano.region,
        alertLevel: volcano.alertLevel || 'normal',
        activityType: volcano.status,
        description: volcano.activitySummary || `${volcano.name} is currently in ${volcano.status} status.`,
        lastUpdate: volcano.lastEruptionDate || 'Unknown',
        source: volcano.sources.join(', '),
        latitude: volcano.latitude,
        longitude: volcano.longitude,
      });
    });

    return warnings.sort((a, b) => {
      const alertOrder = { warning: 0, watch: 1, advisory: 2, normal: 3 };
      return alertOrder[a.alertLevel] - alertOrder[b.alertLevel];
    });
  } catch (error) {
    console.error('Failed to fetch volcano warnings:', error);
    return [];
  }
};