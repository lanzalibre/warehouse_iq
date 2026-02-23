// ─── Warehouse Zone Configuration ─────────────────────────────────────────────
export const ZONE_CONFIG = {
  'Zone A': {
    color: '#3b82f6',
    barClass: 'bg-blue-500',
    textClass: 'text-blue-700',
    lightClass: 'bg-blue-50 border-blue-200',
    dotClass: 'bg-blue-500',
    label: 'Receiving & Prep',
    currentLoadPct: 72,
    maxDailyHours: 18,
  },
  'Zone B': {
    color: '#10b981',
    barClass: 'bg-emerald-500',
    textClass: 'text-emerald-700',
    lightClass: 'bg-emerald-50 border-emerald-200',
    dotClass: 'bg-emerald-500',
    label: 'General Storage',
    currentLoadPct: 58,
    maxDailyHours: 24,
  },
  'Zone C': {
    color: '#8b5cf6',
    barClass: 'bg-violet-500',
    textClass: 'text-violet-700',
    lightClass: 'bg-violet-50 border-violet-200',
    dotClass: 'bg-violet-500',
    label: 'Pick & Pack',
    currentLoadPct: 45,
    maxDailyHours: 20,
  },
  'Zone D': {
    color: '#f97316',
    barClass: 'bg-orange-500',
    textClass: 'text-orange-700',
    lightClass: 'bg-orange-50 border-orange-200',
    dotClass: 'bg-orange-500',
    label: 'Cold Storage',
    currentLoadPct: 89,   // Already near capacity — key to the plot twist
    maxDailyHours: 10,
  },
  'Crossdock': {
    color: '#eab308',
    barClass: 'bg-yellow-500',
    textClass: 'text-yellow-700',
    lightClass: 'bg-yellow-50 border-yellow-200',
    dotClass: 'bg-yellow-500',
    label: 'Crossdock Bay',
    currentLoadPct: 62,
    maxDailyHours: 12,
  },
}

// ─── Site Stats ────────────────────────────────────────────────────────────────
export const SITE_STATS = {
  todayThroughput: 1847,
  dockUtilization: 68,
  activeTeams: 14,
  pendingContainers: 312,
  slaRiskCount: 2,
  avgCycleTimeHours: 4.2,
}

// ─── Yard totals ───────────────────────────────────────────────────────────────
export const TOTAL_CONTAINERS_IN_YARD = 312

// ─── Helper: Generate large datasets with volume metrics ─────────────────────────
function generateVolumeMetrics(baseVolume, variance = 0.3) {
  return Math.floor(baseVolume * (1 + (Math.random() - 0.5) * variance))
}

// ─── Generate expanded Pick Tasks (simulating 500+ tasks) ───────────────────────
const PICK_TASKS_BASE = [
  {
    id: 'PICK-001', orderId: 'ORD-4521', sku: 'NIKE-AIRMAX-42', waveId: 'WAVE-001', description: 'Nike Air Max 270 - Size 42 - White/Black',
    wms: { location: 'Zone C-Aisle 12-Shelf B3', plannedQty: 3, plannedWindow: '09:00-09:15', plannedDurationSeconds: 240, priority: 'high' },
    wes: { picker: 'W008 - Kevin Liu', station: 'Pick Station C-4', actualQty: 3, scanTime: '09:08:23', completeTime: '09:11:42', travelTime: 185, dwellTime: 99 },
    status: 'normal', exceptions: [], volume7Days: 245
  },
  {
    id: 'PICK-002', orderId: 'ORD-4522', sku: 'ADIDAS-ULTRA-40', waveId: 'WAVE-001', description: 'Adidas UltraBoost 22 - Size 40 - Core Black',
    wms: { location: 'Zone C-Aisle 08-Shelf A1', plannedQty: 2, plannedWindow: '09:15-09:30', plannedDurationSeconds: 240, priority: 'normal' },
    wes: { picker: 'W008 - Kevin Liu', station: 'Pick Station C-4', actualQty: 1, scanTime: '09:18:45', completeTime: '09:24:12', travelTime: 245, dwellTime: 327 },
    status: 'exception', exceptions: ['under-pick', 'excessive-duration'], volume7Days: 189
  },
  {
    id: 'PICK-003', orderId: 'ORD-4523', sku: 'PUMA-NITRO-43', waveId: 'WAVE-002', description: 'Puma NITRO Running Shoes - Size 43 - Blue/Orange',
    wms: { location: 'Zone C-Aisle 15-Shelf C2', plannedQty: 1, plannedWindow: '09:30-09:45', plannedDurationSeconds: 210, priority: 'urgent' },
    wes: { picker: 'W050 - Taylor Knight', station: 'Pick Station C-2', actualQty: null, scanTime: null, completeTime: '09:42:15', travelTime: 198, dwellTime: 0 },
    status: 'exception', exceptions: ['no-scan', 'wrong-location'], volume7Days: 312
  },
  {
    id: 'PICK-004', orderId: 'ORD-4524', sku: 'NB-574-41', waveId: 'WAVE-002', description: 'New Balance 574 Classic - Size 41 - Grey',
    wms: { location: 'Zone C-Aisle 05-Shelf D4', plannedQty: 4, plannedWindow: '09:45-10:00', plannedDurationSeconds: 270, priority: 'high' },
    wes: { picker: 'W051 - Lennon Warren', station: 'Pick Station C-3', actualQty: 4, scanTime: '09:48:22', completeTime: '09:53:08', travelTime: 165, dwellTime: 281 },
    status: 'normal', exceptions: [], volume7Days: 178
  },
  {
    id: 'PICK-005', orderId: 'ORD-4525', sku: 'UA-HOVR-39', waveId: 'WAVE-003', description: 'Under Armour HOVR Phantom - Size 39 - Navy',
    wms: { location: 'Zone C-Aisle 18-Shelf A5', plannedQty: 2, plannedWindow: '10:00-10:15', plannedDurationSeconds: 240, priority: 'normal' },
    wes: { picker: 'W052 - Finley Wood', station: 'Pick Station C-1', actualQty: 3, scanTime: '10:02:15', completeTime: '10:08:42', travelTime: 192, dwellTime: 387 },
    status: 'exception', exceptions: ['over-pick'], volume7Days: 156
  },
  {
    id: 'PICK-006', orderId: 'ORD-4526', sku: 'REEBOK-CLUB-44', waveId: 'WAVE-003', description: 'Reebok Club C 85 - Size 44 - White/Green',
    wms: { location: 'Zone C-Aisle 03-Shelf B1', plannedQty: 1, plannedWindow: '10:15-10:30', plannedDurationSeconds: 200, priority: 'low' },
    wes: { picker: 'W053 - Remy Spencer', station: 'Pick Station C-5', actualQty: 1, scanTime: '10:18:33', completeTime: '10:21:05', travelTime: 178, dwellTime: 154 },
    status: 'normal', exceptions: [], volume7Days: 134
  },
  {
    id: 'PICK-007', orderId: 'ORD-4527', sku: 'TIMBERLAND-PRO-45', waveId: 'WAVE-001', description: 'Timberland PRO Boots - Size 45 - Wheat',
    wms: { location: 'Zone C-Aisle 22-Shelf E2', plannedQty: 2, plannedWindow: '10:30-10:45', plannedDurationSeconds: 240, priority: 'high' },
    wes: { picker: 'W054 - Bellamy Kim', station: 'Pick Station C-2', actualQty: 2, scanTime: '10:32:18', completeTime: '10:55:42', travelTime: 312, dwellTime: 724 },
    status: 'exception', exceptions: ['excessive-duration'], volume7Days: 298
  }
]

// Generate 500+ tasks by expanding base patterns
export const PICK_TASKS_ALL = (() => {
  const tasks = [...PICK_TASKS_BASE]
  const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Crossdock']
  const aisles = ['Aisle 01', 'Aisle 02', 'Aisle 03', 'Aisle 04', 'Aisle 05', 'Aisle 06', 'Aisle 07', 'Aisle 08', 'Aisle 09', 'Aisle 10']
  const shelves = ['Shelf A1', 'Shelf A2', 'Shelf B1', 'Shelf B2', 'Shelf C1', 'Shelf C2', 'Shelf D1', 'Shelf D2', 'Shelf E1', 'Shelf E2']
  const priorities = ['urgent', 'high', 'normal', 'low']
  const exceptionsTypes = ['no-scan', 'wrong-location', 'under-pick', 'over-pick', 'excessive-duration']

  const waveIds = ['WAVE-001', 'WAVE-002', 'WAVE-003']

  for (let i = 8; i <= 500; i++) {
    const zone = zones[Math.floor(Math.random() * zones.length)]
    const isException = Math.random() < 0.15 // 15% exception rate
    const exceptions = isException
      ? [exceptionsTypes[Math.floor(Math.random() * exceptionsTypes.length)]]
      : []

    const plannedQty = Math.floor(Math.random() * 5) + 1
    const actualQty = exceptions.includes('no-scan')
      ? null
      : exceptions.includes('under-pick')
        ? Math.max(1, plannedQty - Math.floor(Math.random() * 2))
        : exceptions.includes('over-pick')
          ? plannedQty + Math.floor(Math.random() * 2) + 1
          : plannedQty

    const travelTime = Math.floor(Math.random() * 300) + 100
    const dwellTime = exceptions.includes('no-scan')
      ? 0
      : exceptions.includes('excessive-duration')
        ? Math.floor(Math.random() * 600) + 400
        : Math.floor(Math.random() * 300) + 50

    const plannedDurationSeconds = Math.floor(Math.random() * 60) + 180  // 180-240s planned

    const volume = generateVolumeMetrics(Math.random() * 300 + 50)

    tasks.push({
      id: `PICK-${String(i).padStart(4, '0')}`,
      orderId: `ORD-${4000 + i}`,
      sku: `SKU-${10000 + i}`,
      waveId: waveIds[Math.floor(Math.random() * waveIds.length)],
      description: `${['Nike', 'Adidas', 'Puma', 'New Balance', 'Under Armour', 'Reebok'][Math.floor(Math.random() * 6)]} ${['Running', 'Training', 'Basketball', 'Lifestyle', 'Performance'][Math.floor(Math.random() * 5)]} - ${['Black', 'White', 'Blue', 'Red', 'Grey'][Math.floor(Math.random() * 5)]}`,
      wms: {
        location: `${zone}-${aisles[Math.floor(Math.random() * aisles.length)]}-${shelves[Math.floor(Math.random() * shelves.length)]}`,
        plannedQty,
        plannedWindow: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 12) * 5).padStart(2, '0')}-${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 12) * 5).padStart(2, '0')}`,
        plannedDurationSeconds,
        priority: priorities[Math.floor(Math.random() * priorities.length)]
      },
      wes: {
        picker: `W${String(Math.floor(Math.random() * 108) + 1).padStart(3, '0')} - ${['Kevin', 'Taylor', 'Lennon', 'Finley', 'Remy', 'Bellamy', 'Shiloh', 'Luca', 'Nico', 'Sasha'][Math.floor(Math.random() * 10)]}`,
        station: `Pick Station ${zone.charAt(zone.length - 1)}-${Math.floor(Math.random() * 6) + 1}`,
        actualQty,
        scanTime: exceptions.includes('no-scan') ? null : `09:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        completeTime: exceptions.includes('no-scan') ? null : `09:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        travelTime,
        dwellTime
      },
      status: isException ? 'exception' : 'normal',
      exceptions,
      volume7Days: volume
    })
  }

  return tasks.sort((a, b) => b.volume7Days - a.volume7Days)
})()

// ─── Container Data ────────────────────────────────────────────────────────────
export const CONTAINERS = [
  {
    id: 'CONT-4201',
    poNumber: 'PO-6124',
    category: 'Sports & Outdoor',
    subcategory: 'Athletic Footwear',
    supplier: 'Nike',
    ageInYard: 7,
    palletCount: 6,
    estimatedUnits: 840,
    truckId: 'TRK-887',
    dockAssigned: 'Dock 3',
    priority: 'urgent',
    // Pre-scan estimate (based on PO data + historical similar orders)
    initialEstimate: {
      certainty: 62,
      totalHours: 18.5,
      breakdown: { unloading: 3.2, binning: 11.8, crossdocking: 3.5 },
      byZone: {
        'Zone A': { hours: 4.5, units: 210 },
        'Zone B': { hours: 6.3, units: 400 },
        'Zone C': { hours: 1.9, units: 120 },
        'Zone D': { hours: 0.0, units: 0 },
        'Crossdock': { hours: 5.8, units: 110 },
      },
    },
    // Post-scan estimate (revealed after cold-chain items discovered)
    updatedEstimate: {
      certainty: 91,
      totalHours: 31.2,
      breakdown: { unloading: 4.8, binning: 19.4, crossdocking: 7.0 },
      byZone: {
        'Zone A': { hours: 4.5, units: 210 },
        'Zone B': { hours: 5.1, units: 290 },
        'Zone C': { hours: 1.9, units: 120 },
        'Zone D': { hours: 14.3, units: 310 },   // cold chain explosion
        'Crossdock': { hours: 5.4, units: 110 },
      },
    },
    criteria: {
      workloadBalance:      { score: 0.65, label: 'Moderate' },
      ageScore:             { score: 0.95, label: 'Critical' },
      processingEfficiency: { score: 0.88, label: 'High' },
      overall: 0.82,
    },
    updatedCriteria: {
      workloadBalance:      { score: 0.31, label: 'Poor' },
      ageScore:             { score: 0.95, label: 'Critical' },
      processingEfficiency: { score: 0.44, label: 'Low' },
      overall: 0.57,
    },
    isRecommended: true,
    isUpdatedRecommended: false,
    recommendationReasons: [
      'Oldest container at 7 days — approaching SLA breach threshold',
      'Standard footwear processing is highly efficient at this site',
      'Current dock window availability aligns with 18.5 h estimated workload',
    ],
  },
  {
    id: 'CONT-2847',
    poNumber: 'PO-4821',
    category: 'Sports & Outdoor',
    subcategory: 'Performance Apparel',
    supplier: 'Under Armour',
    ageInYard: 5,
    palletCount: 10,
    estimatedUnits: 1240,
    truckId: 'TRK-902',
    dockAssigned: 'Dock 7',
    priority: 'high',
    initialEstimate: {
      certainty: 58,
      totalHours: 42.0,
      breakdown: { unloading: 6.5, binning: 28.5, crossdocking: 7.0 },
      byZone: {
        'Zone A': { hours: 8.2, units: 380 },
        'Zone B': { hours: 14.6, units: 520 },
        'Zone C': { hours: 12.2, units: 240 },
        'Zone D': { hours: 0.0, units: 0 },
        'Crossdock': { hours: 7.0, units: 100 },
      },
    },
    updatedEstimate: null,
    criteria: {
      workloadBalance:      { score: 0.72, label: 'Good' },
      ageScore:             { score: 0.78, label: 'High' },
      processingEfficiency: { score: 0.68, label: 'Moderate' },
      overall: 0.73,
    },
    updatedCriteria: null,
    isRecommended: false,
    isUpdatedRecommended: false,
    recommendationReasons: [],
  },
  {
    id: 'CONT-1943',
    poNumber: 'PO-3876',
    category: 'General Clothing',
    subcategory: 'Casual Wear',
    supplier: 'H&M',
    ageInYard: 3,
    palletCount: 15,
    estimatedUnits: 2100,
    truckId: 'TRK-761',
    dockAssigned: 'Dock 2',
    priority: 'normal',
    initialEstimate: {
      certainty: 71,
      totalHours: 35.0,
      breakdown: { unloading: 5.0, binning: 24.0, crossdocking: 6.0 },
      byZone: {
        'Zone A': { hours: 6.8, units: 480 },
        'Zone B': { hours: 16.2, units: 920 },
        'Zone C': { hours: 6.0, units: 520 },
        'Zone D': { hours: 0.0, units: 0 },
        'Crossdock': { hours: 6.0, units: 180 },
      },
    },
    updatedEstimate: null,
    criteria: {
      workloadBalance:      { score: 0.91, label: 'Excellent' },
      ageScore:             { score: 0.55, label: 'Moderate' },
      processingEfficiency: { score: 0.85, label: 'High' },
      overall: 0.77,
    },
    updatedCriteria: null,
    isRecommended: false,
    isUpdatedRecommended: true,   // becomes recommended after scan reveals special handling
    recommendationReasons: [],
    updatedRecommendationReasons: [
      'Best workload balance score (91%) — distributes evenly across all available zones',
      'Zero special handling requirements — avoids overloading Zone D (currently 89% capacity)',
      'High processing efficiency for General Clothing category',
      'Estimated 35 h fits current team capacity without overtime risk',
    ],
  },
  {
    id: 'CONT-2599',
    poNumber: 'PO-4502',
    category: 'Shoes',
    subcategory: 'Running Shoes',
    supplier: 'Adidas',
    ageInYard: 2,
    palletCount: 10,
    estimatedUnits: 1580,
    truckId: 'TRK-443',
    dockAssigned: 'Dock 5',
    priority: 'normal',
    initialEstimate: {
      certainty: 65,
      totalHours: 32.0,
      breakdown: { unloading: 4.8, binning: 21.2, crossdocking: 6.0 },
      byZone: {
        'Zone A': { hours: 5.5, units: 350 },
        'Zone B': { hours: 14.5, units: 720 },
        'Zone C': { hours: 8.0, units: 380 },
        'Zone D': { hours: 0.0, units: 0 },
        'Crossdock': { hours: 4.0, units: 130 },
      },
    },
    updatedEstimate: null,
    criteria: {
      workloadBalance:      { score: 0.78, label: 'Good' },
      ageScore:             { score: 0.35, label: 'Low' },
      processingEfficiency: { score: 0.71, label: 'Good' },
      overall: 0.61,
    },
    updatedCriteria: null,
    isRecommended: false,
    isUpdatedRecommended: false,
    recommendationReasons: [],
  },
  {
    id: 'CONT-3156',
    poNumber: 'PO-5033',
    category: 'Sports & Outdoor',
    subcategory: 'Team Sports Equipment',
    supplier: 'Puma',
    ageInYard: 1,
    palletCount: 8,
    estimatedUnits: 3200,
    truckId: 'TRK-519',
    dockAssigned: 'Dock 1',
    priority: 'low',
    initialEstimate: {
      certainty: 75,
      totalHours: 28.0,
      breakdown: { unloading: 3.5, binning: 22.0, crossdocking: 2.5 },
      byZone: {
        'Zone A': { hours: 5.0, units: 640 },
        'Zone B': { hours: 12.0, units: 1200 },
        'Zone C': { hours: 8.5, units: 1160 },
        'Zone D': { hours: 0.0, units: 0 },
        'Crossdock': { hours: 2.5, units: 200 },
      },
    },
    updatedEstimate: null,
    criteria: {
      workloadBalance:      { score: 0.88, label: 'Excellent' },
      ageScore:             { score: 0.15, label: 'Low' },
      processingEfficiency: { score: 0.65, label: 'Moderate' },
      overall: 0.56,
    },
    updatedCriteria: null,
    isRecommended: false,
    isUpdatedRecommended: false,
    recommendationReasons: [],
  },
  // ── Containers ranked 6-10 (complete the visible top-10 from 312 in yard) ────
  {
    id: 'CONT-5102',
    poNumber: 'PO-7234',
    category: 'Shoes',
    subcategory: 'Sneakers & Casual Shoes',
    supplier: 'New Balance',
    ageInYard: 4,
    palletCount: 8,
    estimatedUnits: 2800,
    truckId: 'TRK-621',
    dockAssigned: 'Dock 8',
    priority: 'high',
    initialEstimate: {
      certainty: 69,
      totalHours: 24.0,
      breakdown: { unloading: 3.2, binning: 18.0, crossdocking: 2.8 },
      byZone: {
        'Zone A': { hours: 4.2, units: 560 },
        'Zone B': { hours: 10.5, units: 1100 },
        'Zone C': { hours: 7.0, units: 960 },
        'Zone D': { hours: 0.0, units: 0 },
        'Crossdock': { hours: 2.3, units: 180 },
      },
    },
    updatedEstimate: null,
    criteria: {
      workloadBalance:      { score: 0.74, label: 'Good' },
      ageScore:             { score: 0.65, label: 'Moderate' },
      processingEfficiency: { score: 0.58, label: 'Moderate' },
      overall: 0.54,
    },
    updatedCriteria: null,
    isRecommended: false,
    isUpdatedRecommended: false,
    recommendationReasons: [],
  },
  {
    id: 'CONT-6344',
    poNumber: 'PO-8192',
    category: 'General Clothing',
    subcategory: 'Formal Wear',
    supplier: 'Mango',
    ageInYard: 6,
    palletCount: 18,
    estimatedUnits: 1640,
    truckId: 'TRK-774',
    dockAssigned: 'Dock 4',
    priority: 'urgent',
    initialEstimate: {
      certainty: 55,
      totalHours: 48.0,
      breakdown: { unloading: 7.5, binning: 32.5, crossdocking: 8.0 },
      byZone: {
        'Zone A': { hours: 9.2, units: 320 },
        'Zone B': { hours: 22.0, units: 880 },
        'Zone C': { hours: 8.8, units: 340 },
        'Zone D': { hours: 0.0, units: 0 },
        'Crossdock': { hours: 8.0, units: 100 },
      },
    },
    updatedEstimate: null,
    criteria: {
      workloadBalance:      { score: 0.60, label: 'Moderate' },
      ageScore:             { score: 0.88, label: 'High' },
      processingEfficiency: { score: 0.42, label: 'Moderate' },
      overall: 0.51,
    },
    updatedCriteria: null,
    isRecommended: false,
    isUpdatedRecommended: false,
    recommendationReasons: [],
  },
  {
    id: 'CONT-7891',
    poNumber: 'PO-9021',
    category: 'Shoes',
    subcategory: 'Boots & Outdoor Footwear',
    supplier: 'Timberland',
    ageInYard: 2,
    palletCount: 7,
    estimatedUnits: 3100,
    truckId: 'TRK-308',
    dockAssigned: 'Dock 9',
    priority: 'normal',
    initialEstimate: {
      certainty: 61,
      totalHours: 30.0,
      breakdown: { unloading: 4.5, binning: 20.5, crossdocking: 5.0 },
      byZone: {
        'Zone A': { hours: 5.8, units: 620 },
        'Zone B': { hours: 10.2, units: 1100 },
        'Zone C': { hours: 9.0, units: 1100 },
        'Zone D': { hours: 0.0, units: 0 },
        'Crossdock': { hours: 5.0, units: 280 },
      },
    },
    updatedEstimate: null,
    criteria: {
      workloadBalance:      { score: 0.68, label: 'Good' },
      ageScore:             { score: 0.35, label: 'Low' },
      processingEfficiency: { score: 0.55, label: 'Moderate' },
      overall: 0.48,
    },
    updatedCriteria: null,
    isRecommended: false,
    isUpdatedRecommended: false,
    recommendationReasons: [],
  },
  {
    id: 'CONT-4501',
    poNumber: 'PO-3344',
    category: 'Sports & Outdoor',
    subcategory: 'Training & Fitness Gear',
    supplier: 'Reebok',
    ageInYard: 3,
    palletCount: 9,
    estimatedUnits: 4200,
    truckId: 'TRK-091',
    dockAssigned: 'Dock 11',
    priority: 'normal',
    initialEstimate: {
      certainty: 72,
      totalHours: 36.0,
      breakdown: { unloading: 5.0, binning: 26.0, crossdocking: 5.0 },
      byZone: {
        'Zone A': { hours: 6.5, units: 840 },
        'Zone B': { hours: 16.0, units: 1900 },
        'Zone C': { hours: 9.5, units: 1200 },
        'Zone D': { hours: 0.0, units: 0 },
        'Crossdock': { hours: 4.0, units: 260 },
      },
    },
    updatedEstimate: null,
    criteria: {
      workloadBalance:      { score: 0.55, label: 'Moderate' },
      ageScore:             { score: 0.55, label: 'Moderate' },
      processingEfficiency: { score: 0.62, label: 'Moderate' },
      overall: 0.45,
    },
    updatedCriteria: null,
    isRecommended: false,
    isUpdatedRecommended: false,
    recommendationReasons: [],
  },
  {
    id: 'CONT-8823',
    poNumber: 'PO-2211',
    category: 'General Clothing',
    subcategory: 'Kids Clothing',
    supplier: 'Gap',
    ageInYard: 1,
    palletCount: 5,
    estimatedUnits: 720,
    truckId: 'TRK-445',
    dockAssigned: 'Dock 2',
    priority: 'low',
    initialEstimate: {
      certainty: 78,
      totalHours: 14.0,
      breakdown: { unloading: 2.5, binning: 9.0, crossdocking: 2.5 },
      byZone: {
        'Zone A': { hours: 3.0, units: 160 },
        'Zone B': { hours: 6.5, units: 380 },
        'Zone C': { hours: 2.0, units: 120 },
        'Zone D': { hours: 0.0, units: 0 },
        'Crossdock': { hours: 2.5, units: 60 },
      },
    },
    updatedEstimate: null,
    criteria: {
      workloadBalance:      { score: 0.62, label: 'Moderate' },
      ageScore:             { score: 0.15, label: 'Low' },
      processingEfficiency: { score: 0.82, label: 'High' },
      overall: 0.41,
    },
    updatedCriteria: null,
    isRecommended: false,
    isUpdatedRecommended: false,
    recommendationReasons: [],
  },
]

// ─── Scan Items for CONT-4201 ──────────────────────────────────────────────────
// Items 0-4: normal footwear (no alerts)
// Items 5-7: special handling items (unexpected — not declared in PO)
// Item 7 triggers re-estimation
// Item 8: oversized item
// Item 9: normal again
export const SCAN_ITEMS = [
  {
    id: 'PKG-001',
    type: 'Running Shoes',
    brand: 'Nike',
    description: 'Air Max Series — Mixed sizes (case of 24)',
    color: 'Multicolor — assorted colorways',
    weightKg: 11.2,
    dimensions: '45 × 30 × 25 cm',
    condition: 'Good',
    hazardous: false,
    requiresSpecialHandling: false,
    fragile: false,
    destination: 'Zone B',
    handlingMinutes: 8,
    alert: null,
  },
  {
    id: 'PKG-002',
    type: 'Training Shoes',
    brand: 'Nike',
    description: 'Metcon Training Shoes — 12-pack',
    color: 'White/Black / Red accents',
    weightKg: 14.8,
    dimensions: '40 × 35 × 30 cm',
    condition: 'Good',
    hazardous: false,
    requiresSpecialHandling: false,
    fragile: false,
    destination: 'Zone B',
    handlingMinutes: 10,
    alert: null,
  },
  {
    id: 'PKG-003',
    type: 'Lifestyle Sneakers',
    brand: 'Nike',
    description: 'Air Force 1 Collection — bulk case',
    color: 'White leather boxes / Black trim',
    weightKg: 8.5,
    dimensions: '50 × 40 × 20 cm',
    condition: 'Good',
    hazardous: false,
    requiresSpecialHandling: false,
    fragile: false,
    destination: 'Zone B',
    handlingMinutes: 7,
    alert: null,
  },
  {
    id: 'PKG-004',
    type: 'Basketball Shoes',
    brand: 'Nike',
    description: 'LeBron & Jordan Series — mixed case (12 SKUs)',
    color: 'Bright mixed packaging',
    weightKg: 6.2,
    dimensions: '55 × 40 × 35 cm',
    condition: 'Good',
    hazardous: false,
    requiresSpecialHandling: false,
    fragile: false,
    destination: 'Zone A',
    handlingMinutes: 9,
    alert: null,
  },
  {
    id: 'PKG-005',
    type: 'Limited Edition',
    brand: 'Nike',
    description: 'SNKRS Drops — 6 × Limited Release pairs',
    color: 'Special edition packaging',
    weightKg: 7.8,
    dimensions: '35 × 35 × 40 cm',
    condition: 'Good',
    hazardous: false,
    requiresSpecialHandling: false,
    fragile: true,
    destination: 'Zone B',
    handlingMinutes: 11,
    alert: null,
  },
  {
    id: 'PKG-006',
    type: 'Performance Shoes',
    brand: 'Nike',
    description: 'Vaporfly Elite Racing Shoes — bulk pack',
    color: 'White / Blue special packaging',
    weightKg: 12.4,
    dimensions: '40 × 40 × 30 cm',
    condition: 'Good',
    hazardous: false,
    requiresSpecialHandling: true,
    handling: 'Climate Controlled Storage',
    fragile: false,
    destination: 'Zone D',
    handlingMinutes: 22,
    alert: {
      type: 'special-handling',
      severity: 'warning',
      message: 'Climate controlled storage required — not declared in PO. Routing to Zone D (Climate Storage).',
    },
  },
  {
    id: 'PKG-007',
    type: 'Premium Materials',
    brand: 'Nike',
    description: 'Gore-Tex Waterproof Collection — 48-pack',
    color: 'Black / White waterproof packaging',
    weightKg: 18.6,
    dimensions: '60 × 50 × 35 cm',
    condition: 'Good',
    hazardous: false,
    requiresSpecialHandling: true,
    handling: 'Climate Controlled Storage',
    fragile: false,
    destination: 'Zone D',
    handlingMinutes: 25,
    alert: {
      type: 'special-handling',
      severity: 'warning',
      message: 'Premium waterproof materials require climate storage. PO declared ambient storage.',
    },
  },
  {
    id: 'PKG-008',
    type: 'Limited Edition',
    brand: 'Nike',
    description: 'SB Dunk High Pro — 36 units',
    color: 'Collaboration artwork boxes',
    weightKg: 9.8,
    dimensions: '45 × 30 × 25 cm',
    condition: 'Good',
    hazardous: false,
    requiresSpecialHandling: true,
    handling: 'Climate Controlled Storage',
    fragile: false,
    destination: 'Zone D',
    handlingMinutes: 20,
    triggersReestimation: true,   // This item triggers workload re-estimation
    alert: {
      type: 'special-handling',
      severity: 'critical',
      message: '3rd special-handling item detected. Zone D currently at 89% capacity. Triggering workload re-estimation.',
    },
  },
  {
    id: 'PKG-009',
    type: 'Display Units',
    brand: 'Nike',
    description: 'Retail Display Racks — 12 units',
    color: 'Swoosh-branded display units',
    weightKg: 48.0,
    dimensions: '120 × 80 × 80 cm',
    condition: 'Good',
    hazardous: false,
    requiresSpecialHandling: false,
    fragile: false,
    oversized: true,
    destination: 'Zone B',
    handlingMinutes: 18,
    alert: {
      type: 'oversized',
      severity: 'warning',
      message: 'Oversized — requires forklift and extended processing lane. Manual routing applied.',
    },
  },
  {
    id: 'PKG-010',
    type: 'Accessories',
    brand: 'Nike',
    description: 'Socks & Insoles — mixed case',
    color: 'Multi-color packaging',
    weightKg: 10.2,
    dimensions: '35 × 35 × 30 cm',
    condition: 'Good',
    hazardous: false,
    requiresSpecialHandling: false,
    fragile: true,
    destination: 'Zone B',
    handlingMinutes: 12,
    alert: null,
  },
]

// ─── Helper functions ──────────────────────────────────────────────────────────
export function getScoreColor(score) {
  if (score >= 0.80) return 'text-green-600'
  if (score >= 0.60) return 'text-blue-600'
  if (score >= 0.40) return 'text-amber-600'
  return 'text-red-600'
}

export function getScoreBarClass(score) {
  if (score >= 0.80) return 'bg-green-500'
  if (score >= 0.60) return 'bg-blue-500'
  if (score >= 0.40) return 'bg-amber-500'
  return 'bg-red-500'
}

export function getPriorityConfig(priority) {
  const map = {
    urgent: { label: 'URGENT',  bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
    high:   { label: 'HIGH',    bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-500' },
    normal: { label: 'NORMAL',  bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500' },
    low:    { label: 'LOW',     bg: 'bg-slate-100',  text: 'text-slate-600',  dot: 'bg-slate-400' },
  }
  return map[priority] || map.normal
}

export function getCategoryAbbr(category) {
  const map = {
    'Sports & Outdoor':   'Sports',
    'Shoes':              'Shoes',
    'General Clothing':   'Clothing',
    'Home & Garden':      'Home & Garden',
    'Health & Beauty':    'Beauty',
    'Automotive Parts':   'Automotive',
  }
  return map[category] || category
}

// ─── Labor: Workers ────────────────────────────────────────────────────────────
// 22 workers per zone (108 total).  Compact format mapped to full objects.
// Zone D: all 22 absent from this AM shift → 0 h capacity (critical alert).
// Columns: id · name · zone · role · checkedIn(1/0) · time · expA·B·C·D·XD
const _W = [
  // ── Zone A (22 workers, 17 checked in) ─────────────────────────────────────
  ['W001','Priya Nair',        'Zone A','Lead Receiver',       1,'05:45', 36,4, 2,8, 6],
  ['W002','Maria Santos',      'Zone A','Receiver',            1,'05:52', 18,2, 0,3, 0],
  ['W003','Diego Reyes',       'Zone A','Receiver',            1,'06:08', 12,0, 0,0, 2],
  ['W013','Elena Petrov',      'Zone A','Senior Receiver',     1,'06:01', 24,3, 0,5, 0],
  ['W014','Marcus Williams',   'Zone A','Senior Receiver',     1,'05:58', 30,6, 0,0, 0],
  ['W015','Yuki Tanaka',       'Zone A','Receiver',            1,'06:12', 16,0, 0,0, 0],
  ['W016','Andre Silva',       'Zone A','Receiver',            1,'06:04', 20,4, 0,0, 0],
  ['W017','Ling Wang',         'Zone A','Receiver',            1,'06:09', 14,0, 0,0, 0],
  ['W018','Omar Hassan',       'Zone A','Junior Receiver',     1,'06:18',  8,0, 0,0, 0],
  ['W019','Sophia Rossi',      'Zone A','Receiver',            1,'06:03', 18,0, 0,0, 0],
  ['W020','Luis Garcia',       'Zone A','Receiver',            1,'06:07', 22,0, 0,0, 0],
  ['W021','Keiko Sato',        'Zone A','Receiver',            1,'06:14', 15,2, 0,0, 0],
  ['W022','David Johnson',     'Zone A','Senior Receiver',     1,'06:06', 28,4, 0,0, 0],
  ['W023','Amira Khalil',      'Zone A','Junior Receiver',     1,'06:22',  6,0, 0,0, 0],
  ['W024','Jordan Brooks',     'Zone A','Receiver',            1,'06:11', 12,0, 0,0, 3],
  ['W025','Tasha Patel',       'Zone A','Receiver',            1,'06:16', 10,0, 0,0, 0],
  ['W026','Roberto Kim',       'Zone A','Receiver',            1,'06:19',  8,0, 0,0, 0],
  ['W027','Mei Osei',          'Zone A','Receiver',            0,  null,  14,0, 0,0, 0],
  ['W028','Jamal Andersen',    'Zone A','Receiver',            0,  null,  10,3, 0,0, 0],
  ['W029','Ingrid Yamamoto',   'Zone A','Senior Receiver',     0,  null,  32,0, 0,0, 0],
  ['W030','Kwame Ferreira',    'Zone A','Receiver',            0,  null,   9,0, 0,0, 0],
  ['W031','Nadia Novak',       'Zone A','Receiver',            0,  null,   7,0, 0,0, 0],
  // ── Zone B (22 workers, 17 checked in) ─────────────────────────────────────
  ['W004','James Park',        'Zone B','Lead Stower',         1,'06:02',  6,28,8, 0, 0],
  ['W005','Aisha Thompson',    'Zone B','Senior Stower',       1,'06:15',  0,18,4, 0, 3],
  ['W006','Fatima Al-Hassan',  'Zone B','Stower',              1,'06:20',  2,14,0, 0, 0],
  ['W007','Carlos Mendoza',    'Zone B','Stower',              0,  null,   0, 8,0, 0, 0],
  ['W032','Leila Vasquez',     'Zone B','Stower',              1,'06:05',  0,22,0, 0, 0],
  ['W033','Antoine Dubois',    'Zone B','Stower',              1,'06:11',  0,16,3, 0, 0],
  ['W034','Zara Bergmann',     'Zone B','Senior Stower',       1,'06:08',  0,26,0, 0, 0],
  ['W035','Finn Murphy',       'Zone B','Stower',              1,'06:03',  3,14,0, 0, 0],
  ['W036','Hana Nakamura',     'Zone B','Stower',              1,'06:17',  0,18,2, 0, 0],
  ['W037','Marco Adeyemi',     'Zone B','Junior Stower',       1,'06:14',  0, 6,0, 0, 0],
  ['W038','Yara Johnson',      'Zone B','Stower',              1,'06:21',  0,20,0, 0, 0],
  ['W039','Dion Mitchell',     'Zone B','Stower',              1,'06:09',  0,15,0, 0, 2],
  ['W040','Alex Turner',       'Zone B','Stower',              1,'06:13',  0,10,4, 0, 0],
  ['W041','Robin Casey',       'Zone B','Senior Stower',       1,'06:07',  0,24,0, 0, 0],
  ['W042','Dana Fuller',       'Zone B','Stower',              1,'06:00',  0,14,0, 0, 0],
  ['W043','Tyler Stone',       'Zone B','Junior Stower',       1,'06:18',  0, 7,0, 0, 0],
  ['W044','Casey Reed',        'Zone B','Stower',              1,'06:22',  0,18,0, 0, 0],
  ['W045','Morgan Lane',       'Zone B','Junior Stower',       1,'06:25',  0, 5,0, 0, 0],
  ['W046','Sam Cruz',          'Zone B','Stower',              0,  null,   0,12,0, 0, 0],
  ['W047','Jamie Ross',        'Zone B','Stower',              0,  null,   0, 9,0, 0, 0],
  ['W048','Avery Flynn',       'Zone B','Stower',              0,  null,   0,11,0, 0, 0],
  ['W049','Blake Hart',        'Zone B','Stower',              0,  null,   0, 8,0, 0, 0],
  // ── Zone C (22 workers, 14 checked in) ─────────────────────────────────────
  ['W008','Kevin Liu',         'Zone C','P&P Specialist',      1,'06:10',  4,6, 20,0, 8],
  ['W009',"Sara O'Brien",      'Zone C','Pick & Pack',         0,  null,   0,0, 10,0, 0],
  ['W050','Taylor Knight',     'Zone C','P&P Specialist',      1,'06:05',  0,0, 18,0, 0],
  ['W051','Lennon Warren',     'Zone C','Pick & Pack',         1,'06:12',  2,0, 14,0, 0],
  ['W052','Finley Wood',       'Zone C','Pick & Pack',         1,'06:08',  0,0, 12,0, 0],
  ['W053','Remy Spencer',      'Zone C','Pick & Pack',         1,'06:15',  0,0, 16,0, 0],
  ['W054','Bellamy Kim',       'Zone C','P&P Specialist',      1,'06:03',  0,0, 22,0, 0],
  ['W055','Shiloh Lewis',      'Zone C','Junior P&P',          1,'06:19',  0,0,  8,0, 0],
  ['W056','Luca Carter',       'Zone C','Pick & Pack',         1,'06:07',  0,3, 14,0, 0],
  ['W057','Nico Bailey',       'Zone C','Pick & Pack',         1,'06:11',  0,0, 10,0, 0],
  ['W058','Sasha Cooper',      'Zone C','Junior P&P',          1,'06:22',  0,0,  6,0, 0],
  ['W059','Kit Turner',        'Zone C','Pick & Pack',         1,'06:06',  0,0, 12,0, 0],
  ['W060','Micah Wright',      'Zone C','P&P Specialist',      1,'06:01',  0,0, 24,0, 0],
  ['W061','Raven Scott',       'Zone C','Pick & Pack',         1,'06:16',  0,0,  9,0, 0],
  ['W062','Phoenix Green',     'Zone C','Junior P&P',          0,  null,   0,0,  5,0, 0],
  ['W063','Storm Adams',       'Zone C','Pick & Pack',         0,  null,   0,0,  7,0, 0],
  ['W064','August Mitchell',   'Zone C','Pick & Pack',         0,  null,   0,0, 11,0, 0],
  ['W065','Cleo Davis',        'Zone C','P&P Specialist',      0,  null,   0,0, 16,0, 0],
  ['W066','Orion Rivera',      'Zone C','Pick & Pack',         0,  null,   0,0,  8,0, 0],
  ['W067','Atlas Edwards',     'Zone C','Pick & Pack',         0,  null,   0,0,  6,0, 0],
  ['W068','Zephyr Collins',    'Zone C','Pick & Pack',         0,  null,   0,0,  4,0, 0],
  ['W069','Lyric Morris',      'Zone C','Pick & Pack',         0,  null,   0,0,  3,0, 0],
  // ── Zone D (22 workers, 0 checked in – AM shift absent) ────────────────────
  ['W010','Tom Fischer',       'Zone D','Cold Storage Lead',   0,  null,   0,0,  0,32,0],
  ['W070','Ingrid Kolb',       'Zone D','Cold Storage Op.',    0,  null,   0,0,  0,24,0],
  ['W071','Sven Nielsen',      'Zone D','Cold Storage Op.',    0,  null,   0,0,  0,18,0],
  ['W072','Anya Sokolova',     'Zone D','Cold Storage Op.',    0,  null,   0,0,  0,20,0],
  ['W073','Bjorn Larsen',      'Zone D','Cold Storage Op.',    0,  null,   0,0,  0,16,0],
  ['W074','Natasha Morozova',  'Zone D','Cold Storage Tech',   0,  null,   0,0,  0,14,0],
  ['W075','Henrik Gustafsson', 'Zone D','Cold Storage Tech',   0,  null,   0,0,  0,22,0],
  ['W076','Olga Petrenko',     'Zone D','Cold Storage Tech',   0,  null,   0,0,  0,12,0],
  ['W077','Erik Eriksson',     'Zone D','Cold Storage Op.',    0,  null,   0,0,  0,28,0],
  ['W078','Astrid Berg',       'Zone D','Cold Storage Tech',   0,  null,   0,0,  0,10,0],
  ['W079','Lars Hansen',       'Zone D','Cold Storage Op.',    0,  null,   0,0,  0,18,0],
  ['W080','Freya Lindqvist',   'Zone D','Cold Storage Lead',   0,  null,   0,0,  0,26,0],
  ['W081','Harald Strand',     'Zone D','Cold Storage Op.',    0,  null,   0,0,  0,15,0],
  ['W082','Sigrid Olsen',      'Zone D','Cold Storage Tech',   0,  null,   0,0,  0,11,0],
  ['W083','Morten Dahl',       'Zone D','Cold Storage Op.',    0,  null,   0,0,  0,20,0],
  ['W084','Bente Christensen', 'Zone D','Cold Storage Op.',    0,  null,   0,0,  0, 8,0],
  ['W085','Gunnar Pedersen',   'Zone D','Cold Storage Op.',    0,  null,   0,0,  0,16,0],
  ['W086','Ragnhild Andersen', 'Zone D','Cold Storage Tech',   0,  null,   0,0,  0,13,0],
  ['W087','Leif Eriksen',      'Zone D','Cold Storage Op.',    0,  null,   0,0,  0, 9,0],
  ['W088','Kari Haugen',       'Zone D','Cold Storage Tech',   0,  null,   0,0,  0, 7,0],
  ['W089','Tor Johansen',      'Zone D','Cold Storage Op.',    0,  null,   0,0,  0,11,0],
  ['W090','Marta Gustavsson',  'Zone D','Cold Storage Tech',   0,  null,   0,0,  0, 6,0],
  // ── Crossdock (20 workers, 13 checked in) ──────────────────────────────────
  ['W011','Nina Vasquez',      'Crossdock','Crossdock Lead',     1,'06:00', 3,2,3, 0,22],
  ['W012','Ben Okafor',        'Crossdock','Crossdock Operator', 1,'06:05', 2,4,6, 0,16],
  ['W091','Parker Webb',       'Crossdock','Crossdock Operator', 1,'06:08', 0,2,1, 0,10],
  ['W092','Cameron Grant',     'Crossdock','Crossdock Operator', 1,'06:11', 0,0,0, 0, 8],
  ['W093','Reese Burns',       'Crossdock','Senior Operator',    1,'06:03', 0,0,2, 0,14],
  ['W094','Spencer Fox',       'Crossdock','Crossdock Operator', 1,'06:15', 0,3,0, 0,12],
  ['W095','Emerson Cole',      'Crossdock','Crossdock Operator', 1,'06:07', 2,0,0, 0, 9],
  ['W096','Rowan Shaw',        'Crossdock','Junior Operator',    1,'06:19', 0,0,0, 0, 6],
  ['W097','Sage Barker',       'Crossdock','Crossdock Operator', 1,'06:04', 0,0,0, 0,11],
  ['W098','Skyler Pierce',     'Crossdock','Crossdock Operator', 1,'06:12', 0,0,0, 0, 8],
  ['W099','River Hayes',       'Crossdock','Crossdock Lead',     1,'06:02', 3,2,0, 0,20],
  ['W100','Blake Ford',        'Crossdock','Crossdock Operator', 1,'06:09', 0,0,0, 0, 7],
  ['W101','Quinn James',       'Crossdock','Junior Operator',    1,'06:22', 0,0,0, 0, 5],
  ['W102','Drew Summers',      'Crossdock','Crossdock Operator', 0,  null,  0,0,0, 0, 9],
  ['W103','Alex Park',         'Crossdock','Crossdock Operator', 0,  null,  0,0,0, 0, 7],
  ['W104','Jordan West',       'Crossdock','Crossdock Operator', 0,  null,  0,0,0, 0, 6],
  ['W105','Sam Rivera',        'Crossdock','Crossdock Operator', 0,  null,  0,4,0, 0, 8],
  ['W106','Casey Morgan',      'Crossdock','Crossdock Operator', 0,  null,  0,0,0, 0, 5],
  ['W107','Taylor Reed',       'Crossdock','Crossdock Operator', 0,  null,  0,0,1, 0, 7],
  ['W108','Morgan Cruz',       'Crossdock','Junior Operator',    0,  null,  0,0,0, 0, 4],
]

export const WORKERS = _W.map(([id, name, zone, role, inFlag, time, a, b, c, d, x]) => ({
  id,
  name,
  initials: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
  role,
  assignedZone: zone,
  checkedIn: !!inFlag,
  checkInTime: time,
  experience: { 'Zone A': a, 'Zone B': b, 'Zone C': c, 'Zone D': d, 'Crossdock': x },
}))

// ─── Labor: Workload & Capacity data by time period ───────────────────────────
// capacity = checked-in workers × remaining shift hours for that zone/period
// For "Current Shift": 7.8 h remaining per checked-in worker (06:10 into 06:00–14:00)
export const LABOR_PERIOD_DATA = {
  shift: {
    label: 'Current Shift',
    sublabel: '06:00 – 14:00',
    hoursLabel: 'hours',
    // Zone D capacity = 0 because Tom Fischer has not checked in
    zones: {
      'Zone A':    { estimated: 18,  done: 3,  capacity: 23.4 },
      'Zone B':    { estimated: 28,  done: 6,  capacity: 23.4 },
      'Zone C':    { estimated: 12,  done: 2,  capacity: 7.8  },
      'Zone D':    { estimated: 14,  done: 0,  capacity: 0    },
      'Crossdock': { estimated: 10,  done: 4,  capacity: 15.6 },
    },
  },
  today: {
    label: 'Today',
    sublabel: 'All 3 shifts',
    hoursLabel: 'hours',
    zones: {
      'Zone A':    { estimated: 52,  done: 8,  capacity: 58   },
      'Zone B':    { estimated: 78,  done: 14, capacity: 62   },
      'Zone C':    { estimated: 34,  done: 5,  capacity: 32   },
      'Zone D':    { estimated: 40,  done: 0,  capacity: 22   },
      'Crossdock': { estimated: 28,  done: 9,  capacity: 45   },
    },
  },
  twodays: {
    label: 'Next 2 Days',
    sublabel: 'Incl. today',
    hoursLabel: 'hours',
    zones: {
      'Zone A':    { estimated: 110, done: 8,  capacity: 120  },
      'Zone B':    { estimated: 160, done: 14, capacity: 125  },
      'Zone C':    { estimated: 72,  done: 5,  capacity: 65   },
      'Zone D':    { estimated: 85,  done: 0,  capacity: 44   },
      'Crossdock': { estimated: 60,  done: 9,  capacity: 90   },
    },
  },
  week: {
    label: 'This Week',
    sublabel: 'Mon – Fri',
    hoursLabel: 'hours',
    zones: {
      'Zone A':    { estimated: 380, done: 8,  capacity: 420  },
      'Zone B':    { estimated: 540, done: 14, capacity: 440  },
      'Zone C':    { estimated: 240, done: 5,  capacity: 230  },
      'Zone D':    { estimated: 290, done: 0,  capacity: 155  },
      'Crossdock': { estimated: 210, done: 9,  capacity: 315  },
    },
  },
}

// ─── Labor: Rebalancing recommendations ───────────────────────────────────────
export const REBALANCING_RECS = [
  {
    id: 'REC-001',
    priority: 'critical',
    workerId: 'W001',   // Priya Nair
    fromZone: 'Zone A',
    toZone: 'Zone D',
    experienceMonths: 8,
    surplusPeriodKey: 'Zone A',
    deficitPeriodKey: 'Zone D',
    reasoning: "Zone D has zero available capacity (Tom Fischer absent) against 14 h of workload. Priya Nair has the highest Zone D experience (8 mo.) among Zone A workers, and Zone A currently has an 8.4 h labor surplus.",
    impact: 'Resolves ~7.8 h of Zone D deficit for current shift',
  },
  {
    id: 'REC-002',
    priority: 'high',
    workerId: 'W012',   // Ben Okafor
    fromZone: 'Crossdock',
    toZone: 'Zone C',
    experienceMonths: 4,
    surplusPeriodKey: 'Crossdock',
    deficitPeriodKey: 'Zone C',
    reasoning: "Zone C is 2.2 h short with Sara O'Brien absent. Ben Okafor has 4 months Zone C experience and Crossdock has a 9.6 h surplus that can absorb the reallocation.",
    impact: 'Closes the Zone C 2.2 h gap for current shift',
  },
]

// ─── Labor helpers ─────────────────────────────────────────────────────────────
export function getExperienceLevel(months) {
  if (months >= 36) return { dots: 5, label: 'Expert',      color: 'text-emerald-600' }
  if (months >= 24) return { dots: 4, label: 'Senior',      color: 'text-blue-600'    }
  if (months >= 12) return { dots: 3, label: 'Proficient',  color: 'text-blue-500'    }
  if (months >= 6)  return { dots: 2, label: 'Developing',  color: 'text-amber-600'   }
  if (months >= 1)  return { dots: 1, label: 'Beginner',    color: 'text-slate-500'   }
  return              { dots: 0, label: 'No exp.',     color: 'text-slate-400'   }
}

// ─── Expanded containers to simulate 100s of containers ───────────────────────────
export const CONTAINERS_ALL = (() => {
  const containers = [...CONTAINERS]
  const categories = ['Shoes', 'Sports & Outdoor', 'General Clothing']
  const subcategories = ['Athletic Footwear', 'Running Shoes', 'Casual Wear', 'Performance Apparel', 'Training & Fitness Gear']
  const suppliers = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Under Armour', 'Reebok', 'Timberland', 'H&M', 'Mango', 'Gap', 'Zara']
  const priorities = ['urgent', 'high', 'normal', 'low']

  for (let i = 0; i < 292; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)]
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)]
    const palletCount = Math.floor(Math.random() * 15) + 5
    const estimatedUnits = palletCount * (Math.floor(Math.random() * 100) + 80)
    const ageInYard = Math.floor(Math.random() * 14) + 1
    const priority = priorities[Math.floor(Math.random() * priorities.length)]

    // Generate workload distribution
    const zoneAHours = Math.random() * 8 + 2
    const zoneBHours = Math.random() * 12 + 4
    const zoneCHours = Math.random() * 6 + 1
    const zoneDHours = Math.random() * 4
    const crossdockHours = Math.random() * 5 + 1
    const totalHours = zoneAHours + zoneBHours + zoneCHours + zoneDHours + crossdockHours

    // Generate workload balance score (more even = higher score)
    const workloads = [zoneAHours, zoneBHours, zoneCHours, zoneDHours, crossdockHours]
    const maxWorkload = Math.max(...workloads)
    const avgWorkload = workloads.reduce((a, b) => a + b, 0) / workloads.length
    const workloadBalance = avgWorkload > 0 ? 1 - (maxWorkload - avgWorkload) / maxWorkload : 0.5

    // Generate age score (older = higher score)
    const ageScore = Math.min(ageInYard / 14, 1)

    // Generate processing efficiency
    const processingEfficiency = 0.5 + Math.random() * 0.4

    const criteria = {
      workloadBalance: { score: Math.round(workloadBalance * 100) / 100, label: workloadBalance >= 0.8 ? 'Excellent' : workloadBalance >= 0.6 ? 'Good' : workloadBalance >= 0.4 ? 'Moderate' : 'Poor' },
      ageScore: { score: Math.round(ageScore * 100) / 100, label: ageScore >= 0.8 ? 'Critical' : ageScore >= 0.6 ? 'High' : ageScore >= 0.4 ? 'Moderate' : 'Low' },
      processingEfficiency: { score: Math.round(processingEfficiency * 100) / 100, label: processingEfficiency >= 0.8 ? 'High' : processingEfficiency >= 0.6 ? 'Moderate' : 'Low' },
      overall: Math.round(((workloadBalance * 0.4) + (ageScore * 0.4) + (processingEfficiency * 0.2)) * 100) / 100,
    }

    // Calculate crossdock percentage
    const crossdockPercent = crossdockHours / totalHours

    containers.push({
      id: `CONT-${9000 + i}`,
      poNumber: `PO-${8000 + i}`,
      category,
      subcategory,
      supplier,
      ageInYard,
      palletCount,
      estimatedUnits,
      truckId: `TRK-${100 + Math.floor(Math.random() * 900)}`,
      dockAssigned: `Dock ${Math.floor(Math.random() * 12) + 1}`,
      priority,
      initialEstimate: {
        certainty: Math.floor(Math.random() * 30) + 50,
        totalHours: Math.round(totalHours * 10) / 10,
        breakdown: {
          unloading: Math.round((totalHours * 0.15) * 10) / 10,
          binning: Math.round((totalHours * 0.70) * 10) / 10,
          crossdocking: Math.round((totalHours * 0.15) * 10) / 10,
        },
        byZone: {
          'Zone A': { hours: Math.round(zoneAHours * 10) / 10, units: Math.floor(zoneAHours * 80) },
          'Zone B': { hours: Math.round(zoneBHours * 10) / 10, units: Math.floor(zoneBHours * 80) },
          'Zone C': { hours: Math.round(zoneCHours * 10) / 10, units: Math.floor(zoneCHours * 80) },
          'Zone D': { hours: Math.round(zoneDHours * 10) / 10, units: Math.floor(zoneDHours * 80) },
          'Crossdock': { hours: Math.round(crossdockHours * 10) / 10, units: Math.floor(crossdockHours * 80) },
        },
      },
      updatedEstimate: null,
      criteria,
      updatedCriteria: null,
      isRecommended: false,
      isUpdatedRecommended: false,
      recommendationReasons: [],
    })
  }

  return containers
})()

// ─── Expanded containers with products for detail view ─────────────────────────
export const CONTAINER_PRODUCTS = [
  {
    containerId: 'CONT-4201',
    products: [
      { sku: 'NIKE-AIRMAX-42', description: 'Nike Air Max 270 - Size 42 - White/Black', quantity: 24, volume7Days: 245, zoneWorkload: { 'Zone A': 2, 'Zone B': 4, 'Zone C': 1, 'Zone D': 0, 'Crossdock': 2 } },
      { sku: 'NIKE-METCON-40', description: 'Nike Metcon Training Shoes - Size 40 - Core Black', quantity: 12, volume7Days: 189, zoneWorkload: { 'Zone A': 1, 'Zone B': 3, 'Zone C': 0, 'Zone D': 0, 'Crossdock': 1 } },
      { sku: 'NIKE-AIRFORCE-43', description: 'Nike Air Force 1 - Size 43 - White', quantity: 18, volume7Days: 312, zoneWorkload: { 'Zone A': 2, 'Zone B': 3, 'Zone C': 1, 'Zone D': 0, 'Crossdock': 1 } },
      { sku: 'NIKE-LEBRON-44', description: 'Nike LeBron Basketball - Size 44 - Red/Black', quantity: 8, volume7Days: 156, zoneWorkload: { 'Zone A': 0, 'Zone B': 2, 'Zone C': 1, 'Zone D': 0, 'Crossdock': 0 } },
      { sku: 'NIKE-DUNK-39', description: 'Nike Dunk Low - Size 39 - Panda', quantity: 15, volume7Days: 278, zoneWorkload: { 'Zone A': 1, 'Zone B': 3, 'Zone C': 1, 'Zone D': 0, 'Crossdock': 1 } },
    ]
  },
  {
    containerId: 'CONT-2847',
    products: [
      { sku: 'UA-PROJECT-40', description: 'Under Armour Project Rock - Size 40 - Black', quantity: 20, volume7Days: 198, zoneWorkload: { 'Zone A': 2, 'Zone B': 4, 'Zone C': 1, 'Zone D': 0, 'Crossdock': 2 } },
      { sku: 'UA-HOVR-42', description: 'Under Armour HOVR Phantom - Size 42 - Navy', quantity: 16, volume7Days: 245, zoneWorkload: { 'Zone A': 1, 'Zone B': 3, 'Zone C': 1, 'Zone D': 0, 'Crossdock': 1 } },
      { sku: 'UA-CURRY-39', description: 'Under Armour Curry Flow - Size 39 - Yellow', quantity: 12, volume7Days: 178, zoneWorkload: { 'Zone A': 1, 'Zone B': 2, 'Zone C': 1, 'Zone D': 0, 'Crossdock': 1 } },
    ]
  },
  {
    containerId: 'CONT-1943',
    products: [
      { sku: 'HM-TSHIRT-L', description: 'H&M Cotton T-Shirt - Size L - White', quantity: 50, volume7Days: 156, zoneWorkload: { 'Zone A': 3, 'Zone B': 5, 'Zone C': 2, 'Zone D': 0, 'Crossdock': 2 } },
      { sku: 'HM-JEANS-32', description: 'H&M Slim Jeans - Size 32 - Blue', quantity: 40, volume7Days: 234, zoneWorkload: { 'Zone A': 2, 'Zone B': 6, 'Zone C': 2, 'Zone D': 0, 'Crossdock': 2 } },
      { sku: 'HM-HOODIE-M', description: 'H&M Hoodie - Size M - Grey', quantity: 30, volume7Days: 189, zoneWorkload: { 'Zone A': 2, 'Zone B': 4, 'Zone C': 2, 'Zone D': 0, 'Crossdock': 1 } },
    ]
  },
]

// ─── WES records for Delay Patterns with expected vs actual times ──────────────
export const DELAY_WES_RECORDS = [
  { id: 'WES-001', zone: 'Mezzanine 2', equipment: 'Elevator 2A', orderType: 'Same-Day Delivery', expectedTime: 180, actualTime: 245, delaySeconds: 65, delayPercent: 36, timestamp: '06:15:22', taskId: 'PICK-001' },
  { id: 'WES-002', zone: 'Mezzanine 2', equipment: 'Elevator 2A', orderType: 'Same-Day Delivery', expectedTime: 195, actualTime: 268, delaySeconds: 73, delayPercent: 37, timestamp: '06:22:45', taskId: 'PICK-005' },
  { id: 'WES-003', zone: 'Mezzanine 2', equipment: 'Elevator 2A', orderType: 'B2B Bulk Orders', expectedTime: 210, actualTime: 298, delaySeconds: 88, delayPercent: 42, timestamp: '06:35:18', taskId: 'PICK-012' },
  { id: 'WES-004', zone: 'Mezzanine 1', equipment: 'Conveyor C-3', orderType: 'Same-Day Delivery', expectedTime: 165, actualTime: 212, delaySeconds: 47, delayPercent: 28, timestamp: '06:48:33', taskId: 'PICK-018' },
  { id: 'WES-005', zone: 'Mezzanine 1', equipment: 'Conveyor C-3', orderType: 'Same-Day Delivery', expectedTime: 175, actualTime: 238, delaySeconds: 63, delayPercent: 36, timestamp: '07:02:15', taskId: 'PICK-025' },
  { id: 'WES-006', zone: 'Put-Wall 4', equipment: 'Put-Wall 4', orderType: 'Same-Day Delivery', expectedTime: 190, actualTime: 285, delaySeconds: 95, delayPercent: 50, timestamp: '07:15:42', taskId: 'PICK-031' },
  { id: 'WES-007', zone: 'Put-Wall 4', equipment: 'Put-Wall 4', orderType: 'Same-Day Delivery', expectedTime: 200, actualTime: 310, delaySeconds: 110, delayPercent: 55, timestamp: '07:28:18', taskId: 'PICK-038' },
  { id: 'WES-008', zone: 'Conveyor Line 7', equipment: 'Conveyor Line 7', orderType: 'B2B Bulk Orders', expectedTime: 220, actualTime: 285, delaySeconds: 65, delayPercent: 30, timestamp: '07:42:55', taskId: 'PICK-045' },
  { id: 'WES-009', zone: 'Conveyor Line 7', equipment: 'Conveyor Line 7', orderType: 'B2B Bulk Orders', expectedTime: 235, actualTime: 312, delaySeconds: 77, delayPercent: 33, timestamp: '08:05:22', taskId: 'PICK-052' },
  { id: 'WES-010', zone: 'Mezzanine 2', equipment: 'Elevator 2A', orderType: 'Same-Day Delivery', expectedTime: 185, actualTime: 275, delaySeconds: 90, delayPercent: 49, timestamp: '08:18:45', taskId: 'PICK-060' },
  { id: 'WES-011', zone: 'Mezzanine 2', equipment: 'Elevator 2A', orderType: 'B2B Bulk Orders', expectedTime: 200, actualTime: 265, delaySeconds: 65, delayPercent: 33, timestamp: '08:32:18', taskId: 'PICK-068' },
  { id: 'WES-012', zone: 'Put-Wall 4', equipment: 'Put-Wall 4', orderType: 'Same-Day Delivery', expectedTime: 180, actualTime: 245, delaySeconds: 65, delayPercent: 36, timestamp: '08:48:33', taskId: 'PICK-075' },
]

// ─── Accumulated delay since day started ──────────────────────────────────────
export const ACCUMULATED_DELAY = {
  totalDelaySeconds: 5845, // ~1h 37min total
  totalDelayMinutes: 97,
  totalDelayedTasks: 47,
  avgDelayPerTask: 124, // seconds
  delayByZone: [
    { zone: 'Mezzanine 2', delaySeconds: 2345, taskCount: 18 },
    { zone: 'Mezzanine 1', delaySeconds: 1256, taskCount: 12 },
    { zone: 'Put-Wall 4', delaySeconds: 1250, taskCount: 9 },
    { zone: 'Conveyor Line 7', delaySeconds: 994, taskCount: 8 },
  ],
}

// ─── Plan vs Execution: Pick Task Comparison ───────────────────────────────────────
export const PICK_TASK_COMPARISON = {
  period: 'Current Shift (06:00-14:00)',
  totalTasks: 156,
  normalTasks: 142,
  exceptionTasks: 14,
  tasks: [
    {
      id: 'PICK-001',
      orderId: 'ORD-4521',
      sku: 'NIKE-AIRMAX-42',
      description: 'Nike Air Max 270 - Size 42 - White/Black',
      wms: {
        location: 'Zone C-Aisle 12-Shelf B3',
        plannedQty: 3,
        plannedWindow: '09:00-09:15',
        priority: 'high'
      },
      wes: {
        picker: 'W008 - Kevin Liu',
        station: 'Pick Station C-4',
        actualQty: 3,
        scanTime: '09:08:23',
        completeTime: '09:11:42',
        travelTime: 185,
        dwellTime: 99
      },
      status: 'normal',
      exceptions: []
    },
    {
      id: 'PICK-002',
      orderId: 'ORD-4522',
      sku: 'ADIDAS-ULTRA-40',
      description: 'Adidas UltraBoost 22 - Size 40 - Core Black',
      wms: {
        location: 'Zone C-Aisle 08-Shelf A1',
        plannedQty: 2,
        plannedWindow: '09:15-09:30',
        priority: 'normal'
      },
      wes: {
        picker: 'W008 - Kevin Liu',
        station: 'Pick Station C-4',
        actualQty: 1,
        scanTime: '09:18:45',
        completeTime: '09:24:12',
        travelTime: 245,
        dwellTime: 327
      },
      status: 'exception',
      exceptions: ['under-pick', 'excessive-duration']
    },
    {
      id: 'PICK-003',
      orderId: 'ORD-4523',
      sku: 'PUMA-NITRO-43',
      description: 'Puma NITRO Running Shoes - Size 43 - Blue/Orange',
      wms: {
        location: 'Zone C-Aisle 15-Shelf C2',
        plannedQty: 1,
        plannedWindow: '09:30-09:45',
        priority: 'urgent'
      },
      wes: {
        picker: 'W050 - Taylor Knight',
        station: 'Pick Station C-2',
        actualQty: null,
        scanTime: null,
        completeTime: '09:42:15',
        travelTime: 198,
        dwellTime: 0
      },
      status: 'exception',
      exceptions: ['no-scan', 'wrong-location']
    },
    {
      id: 'PICK-004',
      orderId: 'ORD-4524',
      sku: 'NB-574-41',
      description: 'New Balance 574 Classic - Size 41 - Grey',
      wms: {
        location: 'Zone C-Aisle 05-Shelf D4',
        plannedQty: 4,
        plannedWindow: '09:45-10:00',
        priority: 'high'
      },
      wes: {
        picker: 'W051 - Lennon Warren',
        station: 'Pick Station C-3',
        actualQty: 4,
        scanTime: '09:48:22',
        completeTime: '09:53:08',
        travelTime: 165,
        dwellTime: 281
      },
      status: 'normal',
      exceptions: []
    },
    {
      id: 'PICK-005',
      orderId: 'ORD-4525',
      sku: 'UA-HOVR-39',
      description: 'Under Armour HOVR Phantom - Size 39 - Navy',
      wms: {
        location: 'Zone C-Aisle 18-Shelf A5',
        plannedQty: 2,
        plannedWindow: '10:00-10:15',
        priority: 'normal'
      },
      wes: {
        picker: 'W052 - Finley Wood',
        station: 'Pick Station C-1',
        actualQty: 3,
        scanTime: '10:02:15',
        completeTime: '10:08:42',
        travelTime: 192,
        dwellTime: 387
      },
      status: 'exception',
      exceptions: ['over-pick']
    },
    {
      id: 'PICK-006',
      orderId: 'ORD-4526',
      sku: 'REEBOK-CLUB-44',
      description: 'Reebok Club C 85 - Size 44 - White/Green',
      wms: {
        location: 'Zone C-Aisle 03-Shelf B1',
        plannedQty: 1,
        plannedWindow: '10:15-10:30',
        priority: 'low'
      },
      wes: {
        picker: 'W053 - Remy Spencer',
        station: 'Pick Station C-5',
        actualQty: 1,
        scanTime: '10:18:33',
        completeTime: '10:21:05',
        travelTime: 178,
        dwellTime: 154
      },
      status: 'normal',
      exceptions: []
    },
    {
      id: 'PICK-007',
      orderId: 'ORD-4527',
      sku: 'TIMBERLAND-PRO-45',
      description: 'Timberland PRO Boots - Size 45 - Wheat',
      wms: {
        location: 'Zone C-Aisle 22-Shelf E2',
        plannedQty: 2,
        plannedWindow: '10:30-10:45',
        priority: 'high'
      },
      wes: {
        picker: 'W054 - Bellamy Kim',
        station: 'Pick Station C-2',
        actualQty: 2,
        scanTime: '10:32:18',
        completeTime: '10:55:42',
        travelTime: 312,
        dwellTime: 724
      },
      status: 'exception',
      exceptions: ['excessive-duration']
    }
  ]
}

// ─── Expanded misplaced locations with volume data ─────────────────────────────
const MISPLACED_LOCATIONS_BASE = [
  {
    id: 'LOC-MP-001',
    location: 'Zone B-Aisle 15-Shelf C4',
    sku: 'ADIDAS-SAMBA-42',
    description: 'Adidas Samba OG - Size 42 - Black/White',
    zone: 'Zone B',
    bypassCount: 7,
    volume7Days: 245,
    denialReasons: ['empty location', 'pick denial'],
    suggestedAction: 'trigger-cycle-count',
    issueType: 'inventory-issue',
    ignored: false,
    pickerBypasses: [
      { pickerId: 'W004', time: '08:45:22', reason: 'empty location' },
      { pickerId: 'W032', time: '09:12:18', reason: 'empty location' },
      { pickerId: 'W034', time: '09:45:33', reason: 'pick denial' },
      { pickerId: 'W035', time: '10:08:15', reason: 'empty location' },
      { pickerId: 'W036', time: '10:32:44', reason: 'empty location' },
      { pickerId: 'W037', time: '10:55:28', reason: 'pick denial' },
      { pickerId: 'W038', time: '11:18:55', reason: 'empty location' }
    ]
  },
  {
    id: 'LOC-MP-002',
    location: 'Zone C-Aisle 07-Shelf A3',
    sku: 'PUMA-RS-39',
    description: 'Puma RS-X - Size 39 - Multi-color',
    zone: 'Zone C',
    bypassCount: 5,
    volume7Days: 189,
    denialReasons: ['wrong location'],
    suggestedAction: 'audit-location',
    issueType: 'slotting-issue',
    ignored: false,
    pickerBypasses: [
      { pickerId: 'W008', time: '08:22:18', reason: 'wrong location' },
      { pickerId: 'W050', time: '09:08:45', reason: 'wrong location' },
      { pickerId: 'W051', time: '09:45:22', reason: 'wrong location' },
      { pickerId: 'W054', time: '10:22:18', reason: 'wrong location' },
      { pickerId: 'W060', time: '11:05:33', reason: 'wrong location' }
    ]
  },
  {
    id: 'LOC-MP-003',
    location: 'Zone B-Aisle 09-Shelf D2',
    sku: 'NB-990-44',
    description: 'New Balance 990v6 - Size 44 - Grey',
    zone: 'Zone B',
    bypassCount: 3,
    volume7Days: 178,
    denialReasons: ['empty location'],
    suggestedAction: 're-slot-sku',
    issueType: 'inventory-issue',
    ignored: false,
    pickerBypasses: [
      { pickerId: 'W033', time: '08:55:12', reason: 'empty location' },
      { pickerId: 'W039', time: '09:32:48', reason: 'empty location' },
      { pickerId: 'W041', time: '10:15:33', reason: 'empty location' }
    ]
  },
  {
    id: 'LOC-MP-004',
    location: 'Zone A-Aisle 04-Shelf B1',
    sku: 'NIKE-DUNK-43',
    description: 'Nike Dunk Low - Size 43 - Panda',
    zone: 'Zone A',
    bypassCount: 4,
    volume7Days: 312,
    denialReasons: ['pick denial', 'empty location'],
    suggestedAction: 'trigger-cycle-count',
    issueType: 'inventory-issue',
    ignored: true,
    pickerBypasses: [
      { pickerId: 'W001', time: '08:08:45', reason: 'pick denial' },
      { pickerId: 'W002', time: '08:45:22', reason: 'empty location' },
      { pickerId: 'W013', time: '09:22:18', reason: 'pick denial' },
      { pickerId: 'W014', time: '09:55:33', reason: 'empty location' }
    ]
  },
  {
    id: 'LOC-MP-005',
    location: 'Zone C-Aisle 19-Shelf E4',
    sku: 'UA-PROJECT-40',
    description: 'Under Armour Project Rock - Size 40 - Black',
    zone: 'Zone C',
    bypassCount: 2,
    denialReasons: ['wrong location'],
    suggestedAction: 're-slot-sku',
    issueType: 'slotting-issue',
    ignored: false,
    pickerBypasses: [
      { pickerId: 'W052', time: '08:38:22', reason: 'wrong location' },
      { pickerId: 'W053', time: '09:18:45', reason: 'wrong location' }
    ]
  }
]

// ─── Accumulated misplacement stats by zone ─────────────────────────────────────
export const MISPLACED_ACCUMULATED_STATS = {
  shift: {
    totalBypasses: 847,
    totalMinutesLost: 2541,  // ~42 hours
    byZone: [
      { zone: 'Zone A', bypasses: 156, minutesLost: 468 },
      { zone: 'Zone B', bypasses: 234, minutesLost: 702 },
      { zone: 'Zone C', bypasses: 312, minutesLost: 936 },
      { zone: 'Zone D', bypasses: 89, minutesLost: 267 },
      { zone: 'Crossdock', bypasses: 56, minutesLost: 168 }
    ],
    projectedEndOfShift: {
      totalBypasses: 1124,
      totalMinutesLost: 3372  // ~56 hours projected
    }
  },
  day: {
    totalBypasses: 2456,
    totalMinutesLost: 7368,
    byZone: [
      { zone: 'Zone A', bypasses: 423, minutesLost: 1269 },
      { zone: 'Zone B', bypasses: 678, minutesLost: 2034 },
      { zone: 'Zone C', bypasses: 901, minutesLost: 2703 },
      { zone: 'Zone D', bypasses: 289, minutesLost: 867 },
      { zone: 'Crossdock', bypasses: 165, minutesLost: 495 }
    ],
    projectedEndOfDay: {
      totalBypasses: 2892,
      totalMinutesLost: 8676
    }
  }
}

// ─── Generate 100s of misplaced locations with volume data ─────────────────────────────
export const MISPLACED_LOCATIONS_ALL = (() => {
  const locations = [...MISPLACED_LOCATIONS_BASE]
  const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Crossdock']
  const aisles = ['Aisle 01', 'Aisle 02', 'Aisle 03', 'Aisle 04', 'Aisle 05', 'Aisle 06', 'Aisle 07', 'Aisle 08', 'Aisle 09', 'Aisle 10']
  const shelves = ['Shelf A1', 'Shelf A2', 'Shelf B1', 'Shelf B2', 'Shelf C1', 'Shelf C2', 'Shelf D1', 'Shelf D2', 'Shelf E1', 'Shelf E2']
  const issueTypes = ['inventory-issue', 'slotting-issue']
  const denialReasonsList = ['empty location', 'pick denial', 'wrong location']

  for (let i = 5; i < 250; i++) {
    const zone = zones[Math.floor(Math.random() * zones.length)]
    const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)]
    const bypassCount = Math.floor(Math.random() * 12) + 1
    const volume = generateVolumeMetrics(Math.random() * 300 + 50)
    const denialReasons = [denialReasonsList[Math.floor(Math.random() * denialReasonsList.length)]]
    if (Math.random() > 0.5) {
      denialReasons.push(denialReasonsList[Math.floor(Math.random() * denialReasonsList.length)])
    }

    const suggestedActions = {
      'inventory-issue': ['trigger-cycle-count', 're-slot-sku', 'ignore'],
      'slotting-issue': ['audit-location', 're-slot-sku', 'ignore']
    }

    // Generate picker bypasses
    const pickerBypasses = []
    for (let j = 0; j < bypassCount; j++) {
      pickerBypasses.push({
        pickerId: `W${String(Math.floor(Math.random() * 108) + 1).padStart(3, '0')}`,
        time: `${String(Math.floor(Math.random() * 12)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        reason: denialReasons[Math.floor(Math.random() * denialReasons.length)]
      })
    }

    locations.push({
      id: `LOC-MP-${String(i).padStart(4, '0')}`,
      location: `${zone}-${aisles[Math.floor(Math.random() * aisles.length)]}-${shelves[Math.floor(Math.random() * shelves.length)]}`,
      sku: `SKU-${10000 + i}`,
      description: `${['Nike', 'Adidas', 'Puma', 'New Balance', 'Under Armour', 'Reebok'][Math.floor(Math.random() * 6)]} ${['Running', 'Training', 'Basketball', 'Lifestyle', 'Performance'][Math.floor(Math.random() * 5)]} - ${['Black', 'White', 'Blue', 'Red', 'Grey'][Math.floor(Math.random() * 5)]}`,
      zone,
      bypassCount,
      volume7Days: volume,
      denialReasons,
      suggestedAction: suggestedActions[issueType][0],
      issueType,
      ignored: false,
      pickerBypasses,
      // Accumulated stats per location
      accumulated: {
        shift: { bypasses: bypassCount, minutesLost: bypassCount * 3 },
        day: { bypasses: Math.floor(bypassCount * 2.9), minutesLost: Math.floor(bypassCount * 2.9 * 3) }
      }
    })
  }

  return locations.sort((a, b) => b.volume7Days - a.volume7Days)
})()

// ─── Delay Patterns (>30% delay) with accumulation stats ─────────────────────
export const DELAY_PATTERNS = {
  period: 'Current Shift (06:00-14:00)',
  totalDelayedTasks: 47,
  thresholdPercent: 30,
  zones: [
    {
      id: 'ZONE-MZ2',
      name: 'Mezzanine 2',
      type: 'zone',
      delayPercent: 42,
      avgDelaySeconds: 385,
      taskCount: 18,
      accumulated: {
        shift: { delayedSeconds: 6930, tasksAffected: 18 },
        day: { delayedSeconds: 11550, tasksAffected: 30 },
        projectedEndOfShift: { delayedSeconds: 9240, tasksAffected: 24 },
        projectedEndOfDay: { delayedSeconds: 13860, tasksAffected: 36 }
      },
      wesContext: {
        issue: 'Elevator bottleneck',
        description: 'Elevator 2A experiencing frequent delays due to maintenance',
        impact: 'Increased travel times for all zone access'
      },
      wmsContext: {
        skusAffected: 24,
        fastMovingOrders: 15,
        serviceRisk: 'high',
        description: 'Multiple fast-moving SKUs stored in this zone - SLA at risk'
      },
      affectedPickerRoutes: [
        { picker: 'W008 - Kevin Liu', routeId: 'RT-0412', plannedStopTime: '09:12:00', actualArrival: '09:19:42', delaySeconds: 462 },
        { picker: 'W050 - Taylor Knight', routeId: 'RT-0418', plannedStopTime: '09:45:00', actualArrival: '09:52:18', delaySeconds: 438 },
        { picker: 'W051 - Lennon Warren', routeId: 'RT-0421', plannedStopTime: '10:05:00', actualArrival: '10:11:55', delaySeconds: 415 },
        { picker: 'W052 - Finley Wood', routeId: 'RT-0427', plannedStopTime: '10:30:00', actualArrival: '10:37:22', delaySeconds: 442 },
      ]
    },
    {
      id: 'ZONE-MZ1',
      name: 'Mezzanine 1',
      type: 'zone',
      delayPercent: 35,
      avgDelaySeconds: 298,
      taskCount: 12,
      accumulated: {
        shift: { delayedSeconds: 3576, tasksAffected: 12 },
        day: { delayedSeconds: 5960, tasksAffected: 20 },
        projectedEndOfShift: { delayedSeconds: 4770, tasksAffected: 16 },
        projectedEndOfDay: { delayedSeconds: 7155, tasksAffected: 24 }
      },
      wesContext: {
        issue: 'Conveyor slowdown',
        description: 'Conveyor belt C-3 running at 60% capacity due to sensor issue',
        impact: 'Reduced throughput for zone outputs'
      },
      wmsContext: {
        skusAffected: 18,
        fastMovingOrders: 8,
        serviceRisk: 'medium',
        description: 'Moderate impact on order fulfillment SLAs'
      },
      affectedPickerRoutes: [
        { picker: 'W053 - Remy Spencer', routeId: 'RT-0508', plannedStopTime: '10:15:00', actualArrival: '10:20:14', delaySeconds: 314 },
        { picker: 'W054 - Bellamy Kim', routeId: 'RT-0515', plannedStopTime: '10:40:00', actualArrival: '10:45:02', delaySeconds: 302 },
        { picker: 'W055 - Shiloh Park', routeId: 'RT-0519', plannedStopTime: '11:00:00', actualArrival: '11:04:58', delaySeconds: 298 },
      ]
    }
  ],
  equipment: [
    {
      id: 'EQ-PW-04',
      name: 'Put-Wall 4',
      type: 'equipment',
      delayPercent: 48,
      avgDelaySeconds: 452,
      taskCount: 9,
      accumulated: {
        shift: { delayedSeconds: 4068, tasksAffected: 9 },
        day: { delayedSeconds: 6780, tasksAffected: 15 },
        projectedEndOfShift: { delayedSeconds: 5424, tasksAffected: 12 },
        projectedEndOfDay: { delayedSeconds: 8136, tasksAffected: 18 }
      },
      wesContext: {
        issue: 'Frequent micro-stoppages',
        description: 'Put-wall sensors misreading carton barcodes - requires manual override',
        impact: '20% of tasks need human intervention'
      },
      wmsContext: {
        skusAffected: 12,
        fastMovingOrders: 7,
        serviceRisk: 'critical',
        description: 'Fast-moving order types routed here - urgent SLA risk'
      },
      affectedPickerRoutes: [
        { picker: 'W008 - Kevin Liu', routeId: 'RT-0412', plannedStopTime: '09:18:00', actualArrival: '09:26:32', delaySeconds: 512 },
        { picker: 'W051 - Lennon Warren', routeId: 'RT-0421', plannedStopTime: '09:52:00', actualArrival: '10:00:10', delaySeconds: 490 },
        { picker: 'W055 - Shiloh Park', routeId: 'RT-0522', plannedStopTime: '10:22:00', actualArrival: '10:29:44', delaySeconds: 464 },
      ]
    },
    {
      id: 'EQ-CV-07',
      name: 'Conveyor Line 7',
      type: 'equipment',
      delayPercent: 38,
      avgDelaySeconds: 312,
      taskCount: 8,
      accumulated: {
        shift: { delayedSeconds: 2496, tasksAffected: 8 },
        day: { delayedSeconds: 4160, tasksAffected: 13 },
        projectedEndOfShift: { delayedSeconds: 3120, tasksAffected: 10 },
        projectedEndOfDay: { delayedSeconds: 4992, tasksAffected: 16 }
      },
      wesContext: {
        issue: 'Reduced conveyor speed',
        description: 'Speed reduced to 0.8 m/s (normal: 1.5 m/s) pending maintenance',
        impact: 'Throughput reduced by 47%'
      },
      wmsContext: {
        skusAffected: 9,
        fastMovingOrders: 4,
        serviceRisk: 'medium',
        description: 'Primarily bulk orders - manageable SLA impact'
      },
      affectedPickerRoutes: [
        { picker: 'W052 - Finley Wood', routeId: 'RT-0601', plannedStopTime: '09:30:00', actualArrival: '09:35:18', delaySeconds: 318 },
        { picker: 'W053 - Remy Spencer', routeId: 'RT-0607', plannedStopTime: '10:00:00', actualArrival: '10:05:10', delaySeconds: 310 },
      ]
    }
  ],
  orderTypes: [
    {
      id: 'OT-SAMEDAY',
      name: 'Same-Day Delivery',
      type: 'order-type',
      delayPercent: 33,
      avgDelaySeconds: 267,
      taskCount: 22,
      accumulated: {
        shift: { delayedSeconds: 5874, tasksAffected: 22 },
        day: { delayedSeconds: 9690, tasksAffected: 37 },
        projectedEndOfShift: { delayedSeconds: 7842, tasksAffected: 30 },
        projectedEndOfDay: { delayedSeconds: 11763, tasksAffected: 45 }
      },
      wesContext: {
        issue: 'High picker congestion',
        description: 'Multiple pickers competing for same zone access during peak hours',
        impact: 'Increased dwell times for all same-day orders'
      },
      wmsContext: {
        skusAffected: 35,
        fastMovingOrders: 22,
        serviceRisk: 'critical',
        description: 'Same-day SLA requires <4hr fulfillment - current delays causing breaches'
      }
    },
    {
      id: 'OT-B2B',
      name: 'B2B Bulk Orders',
      type: 'order-type',
      delayPercent: 31,
      avgDelaySeconds: 245,
      taskCount: 15,
      accumulated: {
        shift: { delayedSeconds: 3675, tasksAffected: 15 },
        day: { delayedSeconds: 6125, tasksAffected: 25 },
        projectedEndOfShift: { delayedSeconds: 4900, tasksAffected: 20 },
        projectedEndOfDay: { delayedSeconds: 7350, tasksAffected: 30 }
      },
      wesContext: {
        issue: 'Loading dock coordination',
        description: 'Bulk orders waiting for trailer availability',
        impact: 'Extended dwell times at packing stations'
      },
      wmsContext: {
        skusAffected: 28,
        fastMovingOrders: 6,
        serviceRisk: 'low',
        description: 'B2B SLAs more flexible - minimal service risk'
      }
    }
  ]
}

// ─── Action Types for Misplaced Locations ─────────────────────────────────────────
export const MISPLACED_ACTIONS = [
  { id: 'trigger-cycle-count', label: 'Trigger Cycle Count', description: 'Initiate immediate inventory count at this location' },
  { id: 'audit-location', label: 'Audit Location', description: 'Physical audit and verify location integrity' },
  { id: 're-slot-sku', label: 'Re-slot SKU', description: 'Move SKU to optimal location based on velocity' },
  { id: 'ignore', label: 'Ignore', description: 'Mark as resolved without action (false positive)' }
]

// ─── Unified Plan vs Execution: Wave/Order Data for Overview Tab ─────────────
export const WAVE_ORDER_DATA = {
  period: 'Current Shift (06:00-14:00)',
  waves: [
    {
      id: 'WAVE-001',
      name: 'ADIDAS0012 08:00 - Same-Day',
      plannedHours: 42.5,
      actualHours: 38.2,
      delayHours: -4.3,  // Negative = ahead
      delayType: 'ahead',
      delayBreakdown: {
        delayMinutes: 0,
        denialMinutes: 0
      },
      tasksCompleted: 245,
      totalTasks: 267
    },
    {
      id: 'WAVE-002',
      name: 'NIKE0034 09:00 - Standard',
      plannedHours: 35.8,
      actualHours: 42.1,
      delayHours: 6.3,
      delayType: 'delayed',
      delayBreakdown: {
        delayMinutes: 278,  // ~4.6 hours of delays
        denialMinutes: 100   // ~1.7 hours of pick denials
      },
      tasksCompleted: 198,
      totalTasks: 212
    },
    {
      id: 'WAVE-003',
      name: 'B2BBULK47 10:00 - B2B Bulk',
      plannedHours: 28.5,
      actualHours: 31.2,
      delayHours: 2.7,
      delayType: 'delayed',
      delayBreakdown: {
        delayMinutes: 112,
        denialMinutes: 50
      },
      tasksCompleted: 156,
      totalTasks: 168
    }
  ],
  orders: [
    {
      id: 'ORD-4521',
      sku: 'SHOE-NKE-123445',
      units: 525,
      plannedMinutes: 12.5,
      actualMinutes: 14.2,
      status: 'complete',
      accumulatedDurationSec: 852,
      delayMinutes: 1.7,
      delayType: 'delayed',
      waveId: 'WAVE-001'
    },
    {
      id: 'ORD-4522',
      sku: 'SHOE-ADS-098712',
      units: 310,
      plannedMinutes: 8.0,
      actualMinutes: 7.1,
      status: 'complete',
      accumulatedDurationSec: 426,
      delayMinutes: -0.9,
      delayType: 'ahead',
      waveId: 'WAVE-001'
    },
    {
      id: 'ORD-4523',
      sku: 'SHOE-PUM-334421',
      units: 780,
      plannedMinutes: 18.0,
      actualMinutes: 21.3,
      status: 'ongoing',
      accumulatedDurationSec: 1278,
      delayMinutes: 3.3,
      delayType: 'delayed',
      waveId: 'WAVE-002'
    },
    {
      id: 'ORD-4524',
      sku: 'SHOE-NB-556677',
      units: 215,
      plannedMinutes: 6.5,
      actualMinutes: null,
      status: 'planned',
      accumulatedDurationSec: null,
      delayMinutes: null,
      delayType: 'planned',
      waveId: 'WAVE-002'
    },
    {
      id: 'ORD-4525',
      sku: 'SHOE-UA-889900',
      units: 640,
      plannedMinutes: 15.0,
      actualMinutes: null,
      status: 'planned',
      accumulatedDurationSec: null,
      delayMinutes: null,
      delayType: 'planned',
      waveId: 'WAVE-003'
    },
    {
      id: 'ORD-4526',
      sku: 'SHOE-RBK-112233',
      units: 420,
      plannedMinutes: 10.5,
      actualMinutes: null,
      status: 'planned',
      accumulatedDurationSec: null,
      delayMinutes: null,
      delayType: 'planned',
      waveId: 'WAVE-003'
    }
  ]
}

// ─── Projections for end-of-shift/day outcomes ────────────────────────────────
export const PROJECTIONS = {
  shift: {
    currentDifference: -1.3,  // Hours ahead (negative)
    projectedDifference: 0.5,  // Slightly behind projected
    projectedEndHour: '13:45',
    trend: 'improving',
    confidence: 85
  },
  day: {
    currentDifference: 8.5,
    projectedDifference: 12.3,
    trend: 'worsening',
    confidence: 72
  }
}

// ─── Alert Subscription Data ───────────────────────────────────────────────────
export const ALERT_SUBSCRIPTIONS = [
  {
    id: 'ALERT-SUB-001',
    type: 'misplacement',
    enabled: true,
    filters: {
      zones: ['Zone A', 'Zone B'],
      shifts: ['AM', 'PM'],
      severityThreshold: 'high'
    },
    notificationMethods: ['email', 'sms'],
    lastTriggered: '2026-02-22 14:32:15'
  },
  {
    id: 'ALERT-SUB-002',
    type: 'sustained-delay',
    enabled: true,
    filters: {
      zones: ['Zone C', 'Zone D'],
      shifts: ['AM'],
      severityThreshold: 'critical',
      sustainedMinutes: 30
    },
    notificationMethods: ['email'],
    lastTriggered: '2026-02-22 12:15:00'
  },
  {
    id: 'ALERT-SUB-003',
    type: 'trend',
    enabled: false,
    filters: {
      zones: ['All'],
      shifts: ['AM', 'PM', 'Night'],
      severityThreshold: 'medium',
      trendType: 'worsening',
      thresholdPercent: 10
    },
    notificationMethods: ['email', 'sms', 'slack'],
    lastTriggered: null
  },
  {
    id: 'ALERT-SUB-004',
    type: 'sla-risk',
    enabled: true,
    filters: {
      zones: ['Zone D'],
      shifts: ['All'],
      severityThreshold: 'high',
      orderTypes: ['Same-Day Delivery']
    },
    notificationMethods: ['email', 'slack'],
    lastTriggered: '2026-02-22 10:45:30'
  }
]
