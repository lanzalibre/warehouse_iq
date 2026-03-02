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
      processingMethods: { CR: 2.1, PR: 3.4, FBD: 4.2, PTL: 3.8, XDK: 3.5, NonCon: 0.8 },
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
      processingMethods: { CR: 8.5, PR: 5.2, FBD: 10.8, PTL: 9.5, XDK: 5.0, NonCon: 2.2 },
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
      processingMethods: { CR: 2.5, PR: 1.5, FBD: 12.5, PTL: 11.0, XDK: 5.5, NonCon: 1.5 },
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
    poNumber: 'PO-6124',
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
      processingMethods: { CR: 8.5, PR: 9.5, FBD: 4.0, PTL: 3.5, XDK: 4.5, NonCon: 1.5 },
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
      processingMethods: { CR: 5.0, PR: 4.5, FBD: 7.0, PTL: 6.5, XDK: 3.5, NonCon: 1.0 },
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
    poNumber: 'PO-4821',
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
      processingMethods: { CR: 7.0, PR: 5.5, FBD: 4.5, PTL: 3.5, XDK: 2.5, NonCon: 0.8 },
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
      processingMethods: { CR: 5.0, PR: 3.5, FBD: 15.0, PTL: 14.0, XDK: 8.0, NonCon: 2.0 },
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
      processingMethods: { CR: 7.5, PR: 6.5, FBD: 6.0, PTL: 5.0, XDK: 3.5, NonCon: 1.0 },
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
      processingMethods: { CR: 8.0, PR: 5.5, FBD: 9.0, PTL: 8.0, XDK: 4.0, NonCon: 1.0 },
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
      processingMethods: { CR: 1.5, PR: 1.0, FBD: 4.5, PTL: 4.0, XDK: 2.0, NonCon: 0.8 },
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

  // Create a pool of shared PO numbers for ~60% of containers
  // Shared POs: each will be used for 2-4 containers
  const sharedPOs = [
    'PO-6124', 'PO-4821', 'PO-3876', 'PO-5033', 'PO-8192', 'PO-9021', 'PO-3344', 'PO-2211',
    'PO-9100', 'PO-7555', 'PO-6248', 'PO-3892', 'PO-5176', 'PO-9034', 'PO-4471', 'PO-2683', 'PO-8150',
    'PO-5921', 'PO-3707', 'PO-7346', 'PO-1952', 'PO-6289', 'PO-8473', 'PO-5108', 'PO-2895', 'PO-4102', 'PO-6729',
    'PO-9558', 'PO-3180', 'PO-7463', 'PO-2017', 'PO-6354', 'PO-8530', 'PO-5167', 'PO-2954', 'PO-4261', 'PO-6888',
    'PO-9273', 'PO-3466', 'PO-7578', 'PO-2129', 'PO-6466', 'PO-8642', 'PO-5279', 'PO-3066', 'PO-4373', 'PO-6999',
  ]

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

    // Compute random-weighted processing method distribution (unloading methods only)
    // Hazard and Fragile are SKU labels, not processing methods
    const pmWeights = { CR: Math.random() * 0.25 + 0.05, PR: Math.random() * 0.2 + 0.03, FBD: Math.random() * 0.25 + 0.05, PTL: Math.random() * 0.2 + 0.03, NonCon: Math.random() * 0.05 + 0.01 }
    const pmWeightSum = Object.values(pmWeights).reduce((a, b) => a + b, 0)
    const remainingHours = totalHours - crossdockHours
    const processingMethods = {
      CR:      Math.round((pmWeights.CR / pmWeightSum) * remainingHours * 10) / 10,
      PR:      Math.round((pmWeights.PR / pmWeightSum) * remainingHours * 10) / 10,
      FBD:     Math.round((pmWeights.FBD / pmWeightSum) * remainingHours * 10) / 10,
      PTL:     Math.round((pmWeights.PTL / pmWeightSum) * remainingHours * 10) / 10,
      XDK:     Math.round(crossdockHours * 10) / 10,
      NonCon:  Math.round((pmWeights.NonCon / pmWeightSum) * remainingHours * 10) / 10,
    }

    // Assign PO: ~60% get shared POs, ~40% get null (no PO)
    const hasPO = Math.random() < 0.60
    const poNumber = hasPO ? sharedPOs[i % sharedPOs.length] : null

    containers.push({
      id: `CONT-${9000 + i}`,
      poNumber,
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
        processingMethods,
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

// ─── Helper: Generate SKU details for a container ───────────────────────────────
function generateContainerProducts(containerId, category, subcategory, processingMethods) {
  const numProducts = Math.floor(Math.random() * 4) + 3 // 3-6 products per container
  const products = []
  const divisions = ['Athletic Footwear', 'Performance Apparel', 'Casual Wear', 'Outdoor Gear', 'Lifestyle']
  // Unloading methods only (Hazard is a SKU label, not a processing method)
  const pmKeys = Object.keys(processingMethods)
    .filter(k => processingMethods[k] > 0)
    .filter(k => ['CR', 'PR', 'FBD', 'PTL', 'XDK', 'NonCon'].includes(k))
  const totalHours = Object.entries(processingMethods)
    .filter(([k]) => ['CR', 'PR', 'FBD', 'PTL', 'XDK', 'NonCon'].includes(k))
    .reduce((sum, [, v]) => sum + v, 0)

  for (let i = 0; i < numProducts; i++) {
    const supplier = category.replace(/\s/g, '').toUpperCase().substring(0, 4)
    const style = subcategory.replace(/\s/g, '-').toUpperCase().substring(0, 8)
    const size = Math.floor(Math.random() * 12) + 36 // 36-47
    const color = ['Black', 'White', 'Red', 'Blue', 'Navy', 'Grey', 'White/Black', 'Core Black'][Math.floor(Math.random() * 8)]

    const sku = `${supplier}-${style}-${size}-${i + 1}`
    const description = `${category} ${subcategory} - Size ${size} - ${color}`
    const quantity = Math.floor(Math.random() * 40) + 8
    const volume7Days = Math.floor(Math.random() * 200) + 100
    const division = divisions[Math.floor(Math.random() * divisions.length)]

    // Assign processing method based on the container's processing methods distribution
    const methodIndex = pmKeys.length > 0 ? Math.floor(Math.random() * pmKeys.length) : 0
    const processingMethod = pmKeys.length > 0 ? pmKeys[methodIndex] : 'CR'

    // Calculate forecasted hours proportionally
    const hoursPerUnit = totalHours > 0 ? totalHours / numProducts : 1.5
    const forecastedProcessingHours = Math.round((hoursPerUnit + (Math.random() - 0.5) * 0.5) * 10) / 10

    // Assign labels (Hazard/Fragile) - ~15% chance of having a label
    const hasHazard = Math.random() < 0.08
    const hasFragile = Math.random() < 0.07
    const labels = []
    if (hasHazard) labels.push('Hazard')
    if (hasFragile) labels.push('Fragile')

    products.push({
      sku,
      description,
      quantity,
      volume7Days,
      division,
      forecastedProcessingHours: Math.max(0.5, forecastedProcessingHours),
      processingMethod,
      labels: labels.length > 0 ? labels : undefined,
    })
  }

  return products
}

// ─── Container Products (forecasted data for all unprocessed containers) ────────
export const CONTAINER_PRODUCTS = (() => {
  const productsByContainer = []

  // Get all container IDs from CONTAINERS_ALL
  const allContainerIds = CONTAINERS_ALL.map(c => c.id)

  // Generate products for each container
  allContainerIds.forEach(containerId => {
    const container = CONTAINERS_ALL.find(c => c.id === containerId)
    if (container) {
      const products = generateContainerProducts(
        containerId,
        container.category,
        container.subcategory,
        container.initialEstimate?.processingMethods || { CR: 1 }
      )
      productsByContainer.push({ containerId, products })
    }
  })

  return productsByContainer
})()

// ─── Historical PO container data (already-processed containers per PO) ────────
// These containers have been processed and only show actual hours and method
// Hazard and Fragile are SKU labels, not processing methods
export const HISTORICAL_PO_CONTAINERS = [
  {
    poNumber: 'PO-6124',
    pastContainers: [
      {
        containerId: 'CONT-4098',
        processedDate: '2026-02-18',
        skus: [
          { sku: 'NIKE-AIRMAX-42', description: 'Nike Air Max 270 - Size 42 - White/Black', quantity: 18, division: 'Athletic Footwear', actualMethod: 'CR', actualTimeHours: 1.4, labels: ['Fragile'] },
          { sku: 'NIKE-AIRFORCE-43', description: 'Nike Air Force 1 - Size 43 - White', quantity: 24, division: 'Athletic Footwear', actualMethod: 'CR', actualTimeHours: 1.9 },
          { sku: 'NIKE-DUNK-39', description: 'Nike Dunk Low - Size 39 - Panda', quantity: 15, division: 'Athletic Footwear', actualMethod: 'XDK', actualTimeHours: 0.8 },
        ],
      },
      {
        containerId: 'CONT-3871',
        processedDate: '2026-02-20',
        skus: [
          { sku: 'NIKE-METCON-40', description: 'Nike Metcon Training Shoes - Size 40 - Core Black', quantity: 12, division: 'Athletic Footwear', actualMethod: 'FBD', actualTimeHours: 1.8, labels: ['Hazard'] },
          { sku: 'NIKE-LEBRON-44', description: 'Nike LeBron Basketball - Size 44 - Red/Black', quantity: 8, division: 'Athletic Footwear', actualMethod: 'PR', actualTimeHours: 2.2 },
        ],
      },
    ],
  },
  {
    poNumber: 'PO-4821',
    pastContainers: [
      {
        containerId: 'CONT-2701',
        processedDate: '2026-02-21',
        skus: [
          { sku: 'UA-PROJECT-40', description: 'Under Armour Project Rock - Size 40 - Black', quantity: 16, division: 'Performance Apparel', actualMethod: 'FBD', actualTimeHours: 1.6 },
          { sku: 'UA-HOVR-42', description: 'Under Armour HOVR Phantom - Size 42 - Navy', quantity: 20, division: 'Athletic Footwear', actualMethod: 'CR', actualTimeHours: 1.8 },
          { sku: 'UA-CURRY-39', description: 'Under Armour Curry Flow - Size 39 - Yellow', quantity: 12, division: 'Athletic Footwear', actualMethod: 'PTL', actualTimeHours: 2.1, labels: ['Fragile'] },
        ],
      },
      {
        containerId: 'CONT-3544',
        processedDate: '2026-02-22',
        skus: [
          { sku: 'NB-574-41', description: 'New Balance 574 Classic - Size 41 - Grey', quantity: 25, division: 'Athletic Footwear', actualMethod: 'PR', actualTimeHours: 2.3 },
          { sku: 'NB-990-43', description: 'New Balance 990 - Size 43 - Silver', quantity: 10, division: 'Athletic Footwear', actualMethod: 'CR', actualTimeHours: 1.4, labels: ['Fragile', 'Hazard'] },
        ],
      },
    ],
  },
  {
    poNumber: 'PO-3876',
    pastContainers: [
      {
        containerId: 'CONT-2991',
        processedDate: '2026-02-23',
        skus: [
          { sku: 'HM-TSHIRT-L', description: 'H&M Cotton T-Shirt - Size L - White', quantity: 50, division: 'Casual Wear', actualMethod: 'FBD', actualTimeHours: 2.0 },
          { sku: 'HM-JEANS-32', description: 'H&M Slim Jeans - Size 32 - Blue', quantity: 40, division: 'Casual Wear', actualMethod: 'PTL', actualTimeHours: 2.7 },
        ],
      },
    ],
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

// ─── Generate large orders dataset for wave drill-down ────────────────────────
const _generateWaveOrders = () => {
  const brands = ['NKE', 'ADS', 'PUM', 'NB', 'UA', 'RBK', 'TBL', 'VNS', 'SKC', 'CRS']
  const rndSku = (i) => `SHOE-${brands[i % brands.length]}-${String(Math.floor(Math.random() * 900000 + 100000))}`
  const rndUnits = () => Math.floor(Math.random() * 800 + 100)
  const rndMin = (base) => Math.round((base + (Math.random() - 0.5) * base * 0.4) * 10) / 10

  const orders = []
  let n = 4521

  // WAVE-001 (ahead): 60 complete orders
  for (let i = 0; i < 60; i++) {
    const planned = rndMin(12)
    const actual = Math.round(planned * (0.7 + Math.random() * 0.5) * 10) / 10
    orders.push({ id: `ORD-${n++}`, sku: rndSku(i), units: rndUnits(), plannedMinutes: planned, actualMinutes: actual, status: 'complete', accumulatedDurationSec: Math.floor(actual * 60), delayMinutes: Math.round((actual - planned) * 10) / 10, delayType: actual <= planned ? 'ahead' : 'delayed', waveId: 'WAVE-001' })
  }

  // WAVE-002 (delayed): 25 complete + 10 ongoing + 20 planned
  for (let i = 0; i < 55; i++) {
    const planned = rndMin(14)
    let status, actual, elapsed
    if (i < 25)      { status = 'complete'; actual = Math.round(planned * (0.9 + Math.random() * 0.6) * 10) / 10; elapsed = Math.floor(actual * 60) }
    else if (i < 35) { status = 'ongoing';  actual = Math.round(planned * (0.4 + Math.random() * 0.4) * 10) / 10; elapsed = Math.floor(actual * 60) }
    else             { status = 'planned';  actual = null; elapsed = null }
    orders.push({ id: `ORD-${n++}`, sku: rndSku(i + 2), units: rndUnits(), plannedMinutes: planned, actualMinutes: actual, status, accumulatedDurationSec: elapsed, delayMinutes: actual != null ? Math.round((actual - planned) * 10) / 10 : null, delayType: actual != null ? (actual <= planned ? 'ahead' : 'delayed') : 'planned', waveId: 'WAVE-002' })
  }

  // WAVE-003 (delayed): 10 complete + 10 ongoing + 30 planned
  for (let i = 0; i < 50; i++) {
    const planned = rndMin(16)
    let status, actual, elapsed
    if (i < 10)      { status = 'complete'; actual = Math.round(planned * (1.1 + Math.random() * 0.4) * 10) / 10; elapsed = Math.floor(actual * 60) }
    else if (i < 20) { status = 'ongoing';  actual = Math.round(planned * (0.3 + Math.random() * 0.4) * 10) / 10; elapsed = Math.floor(actual * 60) }
    else             { status = 'planned';  actual = null; elapsed = null }
    orders.push({ id: `ORD-${n++}`, sku: rndSku(i + 4), units: rndUnits(), plannedMinutes: planned, actualMinutes: actual, status, accumulatedDurationSec: elapsed, delayMinutes: actual != null ? Math.round((actual - planned) * 10) / 10 : null, delayType: actual != null ? (actual <= planned ? 'ahead' : 'delayed') : 'planned', waveId: 'WAVE-003' })
  }

  return orders
}

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
  orders: _generateWaveOrders()
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
]// ─── MFA Data ─────────────────────────────────────────────────────────────

// Zone distance from staging (A = staging area)
export const ZONE_DISTANCE_FROM_STAGING = {
  'A': 0, 'B': 1, 'C': 2, 'D': 3
}

// SKU demand levels - high demand SKUs should be closer to staging
export const SKU_DEMAND_LEVELS = {
  'SAUCONY-JAZZ-40': 'high',
  'SAUCONY-JAZZ-41': 'high',
  'ASICS-GEL-43': 'high',
  'CONVERSE-ALLSTAR-41': 'high',
  'CONVERSE-ALLSTAR-42': 'high',
  'NB-530-42': 'high',
  'NB-996-43': 'high',
  'NEW-BALANCE-44': 'medium',
  'REEBOK-CROSS-38': 'low',
  'HM-TSHIRT-XL': 'low',
  'PUMA-SNEAKER-39': 'low',
  'PUMA-SNEAKER-40': 'low',
  'PUMA-SNEAKER-41': 'low'
}

// Trip frequency by time window (number of picks/orders)
export const SKU_TRIP_FREQUENCY = {
  'SAUCONY-JAZZ-40': { days7: 42, days30: 178, days90: 534 },
  'SAUCONY-JAZZ-41': { days7: 38, days30: 156, days90: 468 },
  'ASICS-GEL-43': { days7: 35, days30: 142, days90: 426 },
  'CONVERSE-ALLSTAR-41': { days7: 45, days30: 189, days90: 567 },
  'CONVERSE-ALLSTAR-42': { days7: 32, days30: 128, days90: 384 },
  'NB-530-42': { days7: 28, days30: 112, days90: 336 },
  'NB-996-43': { days7: 24, days30: 96, days90: 288 },
  'NEW-BALANCE-44': { days7: 18, days30: 72, days90: 216 },
  'REEBOK-CROSS-38': { days7: 8, days30: 32, days90: 96 },
  'HM-TSHIRT-XL': { days7: 6, days30: 24, days90: 72 },
  'PUMA-SNEAKER-39': { days7: 5, days30: 20, days90: 60 },
  'PUMA-SNEAKER-40': { days7: 4, days30: 16, days90: 48 },
  'PUMA-SNEAKER-41': { days7: 7, days30: 28, days90: 84 }
}

// ─── Mock Data: Single Product Reslotting Opportunities ───────────────
export const SINGLE_PRODUCT_OPPORTUNITIES = [
  {
    "id": "SPO-007",
    "locationId": "B-16-03",
    "currentSku": "SAUCONY-JAZZ-40",
    "demandLevel": "high",
    "inventoryUnits": 85,
    "tripFrequency": { days7: 42, days30: 178, days90: 534 },
    "currentLocation": {
      "zone": "B",
      "rack": 16,
      "level": 3
    },
    "suggestedLocation": {
      "zone": "A",
      "rack": 8,
      "level": 10
    },
    "timeSavingsMinutes": 4.5,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'A', rack: 8, level: 10, timeSavingsMinutes: 4.5 },
      { id: 'alt-2', zone: 'A', rack: 5, level: 8, timeSavingsMinutes: 4.2 },
      { id: 'alt-3', zone: 'A', rack: 3, level: 6, timeSavingsMinutes: 3.8 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-003",
    "locationId": "B-11-01",
    "currentSku": "ASICS-GEL-43",
    "demandLevel": "high",
    "inventoryUnits": 72,
    "tripFrequency": { days7: 35, days30: 142, days90: 426 },
    "currentLocation": {
      "zone": "B",
      "rack": 11,
      "level": 1
    },
    "suggestedLocation": {
      "zone": "A",
      "rack": 3,
      "level": 10
    },
    "timeSavingsMinutes": 4.3,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'A', rack: 3, level: 10, timeSavingsMinutes: 4.3 },
      { id: 'alt-2', zone: 'A', rack: 2, level: 8, timeSavingsMinutes: 4.0 },
      { id: 'alt-3', zone: 'A', rack: 1, level: 5, timeSavingsMinutes: 3.5 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-008",
    "locationId": "B-19-02",
    "currentSku": "CONVERSE-ALLSTAR-41",
    "demandLevel": "high",
    "inventoryUnits": 91,
    "tripFrequency": { days7: 45, days30: 189, days90: 567 },
    "currentLocation": {
      "zone": "B",
      "rack": 19,
      "level": 2
    },
    "suggestedLocation": {
      "zone": "A",
      "rack": 8,
      "level": 4
    },
    "timeSavingsMinutes": 4.3,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'A', rack: 8, level: 4, timeSavingsMinutes: 4.3 },
      { id: 'alt-2', zone: 'A', rack: 6, level: 3, timeSavingsMinutes: 4.0 },
      { id: 'alt-3', zone: 'A', rack: 4, level: 2, timeSavingsMinutes: 3.6 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-010",
    "locationId": "D-09-05",
    "currentSku": "SAUCONY-JAZZ-41",
    "demandLevel": "high",
    "inventoryUnits": 78,
    "tripFrequency": { days7: 38, days30: 156, days90: 468 },
    "currentLocation": {
      "zone": "D",
      "rack": 9,
      "level": 5
    },
    "suggestedLocation": {
      "zone": "A",
      "rack": 3,
      "level": 1
    },
    "timeSavingsMinutes": 4.3,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'A', rack: 3, level: 1, timeSavingsMinutes: 4.3 },
      { id: 'alt-2', zone: 'A', rack: 5, level: 3, timeSavingsMinutes: 4.0 },
      { id: 'alt-3', zone: 'B', rack: 2, level: 1, timeSavingsMinutes: 2.5 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-006",
    "locationId": "C-21-03",
    "currentSku": "NB-530-42",
    "demandLevel": "high",
    "inventoryUnits": 68,
    "tripFrequency": { days7: 28, days30: 112, days90: 336 },
    "currentLocation": {
      "zone": "C",
      "rack": 21,
      "level": 3
    },
    "suggestedLocation": {
      "zone": "A",
      "rack": 8,
      "level": 8
    },
    "timeSavingsMinutes": 3.7,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'A', rack: 8, level: 8, timeSavingsMinutes: 3.7 },
      { id: 'alt-2', zone: 'A', rack: 6, level: 5, timeSavingsMinutes: 3.4 },
      { id: 'alt-3', zone: 'B', rack: 3, level: 2, timeSavingsMinutes: 2.0 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-013",
    "locationId": "D-10-02",
    "currentSku": "NB-996-43",
    "demandLevel": "high",
    "inventoryUnits": 65,
    "tripFrequency": { days7: 24, days30: 96, days90: 288 },
    "currentLocation": {
      "zone": "D",
      "rack": 10,
      "level": 2
    },
    "suggestedLocation": {
      "zone": "A",
      "rack": 2,
      "level": 4
    },
    "timeSavingsMinutes": 3.6,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'A', rack: 2, level: 4, timeSavingsMinutes: 3.6 },
      { id: 'alt-2', zone: 'A', rack: 4, level: 6, timeSavingsMinutes: 3.3 },
      { id: 'alt-3', zone: 'B', rack: 1, level: 3, timeSavingsMinutes: 2.0 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-004",
    "locationId": "C-08-02",
    "currentSku": "CONVERSE-ALLSTAR-41",
    "demandLevel": "high",
    "inventoryUnits": 88,
    "tripFrequency": { days7: 45, days30: 189, days90: 567 },
    "currentLocation": {
      "zone": "C",
      "rack": 8,
      "level": 2
    },
    "suggestedLocation": {
      "zone": "A",
      "rack": 3,
      "level": 9
    },
    "timeSavingsMinutes": 3.1,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'A', rack: 3, level: 9, timeSavingsMinutes: 3.1 },
      { id: 'alt-2', zone: 'A', rack: 5, level: 7, timeSavingsMinutes: 2.8 },
      { id: 'alt-3', zone: 'B', rack: 2, level: 4, timeSavingsMinutes: 1.5 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-012",
    "locationId": "B-11-06",
    "currentSku": "PUMA-SNEAKER-41",
    "demandLevel": "low",
    "inventoryUnits": 22,
    "tripFrequency": { days7: 7, days30: 28, days90: 84 },
    "currentLocation": {
      "zone": "B",
      "rack": 11,
      "level": 6
    },
    "suggestedLocation": {
      "zone": "A",
      "rack": 3,
      "level": 1
    },
    "timeSavingsMinutes": 2.9,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'C', rack: 5, level: 3, timeSavingsMinutes: -1.5 },
      { id: 'alt-2', zone: 'C', rack: 8, level: 5, timeSavingsMinutes: -1.8 },
      { id: 'alt-3', zone: 'D', rack: 3, level: 2, timeSavingsMinutes: -2.5 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-011",
    "locationId": "D-20-01",
    "currentSku": "NEW-BALANCE-44",
    "demandLevel": "medium",
    "inventoryUnits": 45,
    "tripFrequency": { days7: 18, days30: 72, days90: 216 },
    "currentLocation": {
      "zone": "D",
      "rack": 20,
      "level": 1
    },
    "suggestedLocation": {
      "zone": "A",
      "rack": 4,
      "level": 6
    },
    "timeSavingsMinutes": 2.7,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'A', rack: 4, level: 6, timeSavingsMinutes: 2.7 },
      { id: 'alt-2', zone: 'B', rack: 3, level: 4, timeSavingsMinutes: 1.5 },
      { id: 'alt-3', zone: 'C', rack: 2, level: 3, timeSavingsMinutes: 0.8 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-001",
    "locationId": "A-22-04",
    "currentSku": "REEBOK-CROSS-38",
    "demandLevel": "low",
    "inventoryUnits": 18,
    "tripFrequency": { days7: 8, days30: 32, days90: 96 },
    "currentLocation": {
      "zone": "A",
      "rack": 22,
      "level": 4
    },
    "suggestedLocation": {
      "zone": "C",
      "rack": 10,
      "level": 3
    },
    "timeSavingsMinutes": -2.6,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'C', rack: 10, level: 3, timeSavingsMinutes: -2.6 },
      { id: 'alt-2', zone: 'C', rack: 15, level: 5, timeSavingsMinutes: -2.8 },
      { id: 'alt-3', zone: 'D', rack: 8, level: 2, timeSavingsMinutes: -3.5 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-005",
    "locationId": "A-11-05",
    "currentSku": "HM-TSHIRT-XL",
    "demandLevel": "low",
    "inventoryUnits": 15,
    "tripFrequency": { days7: 6, days30: 24, days90: 72 },
    "currentLocation": {
      "zone": "A",
      "rack": 11,
      "level": 5
    },
    "suggestedLocation": {
      "zone": "C",
      "rack": 12,
      "level": 4
    },
    "timeSavingsMinutes": -2.6,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'C', rack: 12, level: 4, timeSavingsMinutes: -2.6 },
      { id: 'alt-2', zone: 'C', rack: 18, level: 6, timeSavingsMinutes: -3.0 },
      { id: 'alt-3', zone: 'D', rack: 5, level: 3, timeSavingsMinutes: -3.8 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-015",
    "locationId": "D-25-02",
    "currentSku": "PUMA-SNEAKER-40",
    "demandLevel": "low",
    "inventoryUnits": 20,
    "tripFrequency": { days7: 4, days30: 16, days90: 48 },
    "currentLocation": {
      "zone": "D",
      "rack": 25,
      "level": 2
    },
    "suggestedLocation": {
      "zone": "A",
      "rack": 1,
      "level": 6
    },
    "timeSavingsMinutes": 2.2,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'A', rack: 1, level: 6, timeSavingsMinutes: 2.2 },
      { id: 'alt-2', zone: 'B', rack: 3, level: 4, timeSavingsMinutes: 1.2 },
      { id: 'alt-3', zone: 'C', rack: 5, level: 2, timeSavingsMinutes: 0.5 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-009",
    "locationId": "B-11-06",
    "currentSku": "CONVERSE-ALLSTAR-42",
    "demandLevel": "high",
    "inventoryUnits": 75,
    "tripFrequency": { days7: 32, days30: 128, days90: 384 },
    "currentLocation": {
      "zone": "B",
      "rack": 11,
      "level": 6
    },
    "suggestedLocation": {
      "zone": "A",
      "rack": 8,
      "level": 1
    },
    "timeSavingsMinutes": 1.9,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'A', rack: 8, level: 1, timeSavingsMinutes: 1.9 },
      { id: 'alt-2', zone: 'A', rack: 6, level: 3, timeSavingsMinutes: 1.6 },
      { id: 'alt-3', zone: 'A', rack: 4, level: 5, timeSavingsMinutes: 1.3 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-014",
    "locationId": "A-23-03",
    "currentSku": "HM-TSHIRT-XL",
    "demandLevel": "low",
    "inventoryUnits": 17,
    "tripFrequency": { days7: 6, days30: 24, days90: 72 },
    "currentLocation": {
      "zone": "A",
      "rack": 23,
      "level": 3
    },
    "suggestedLocation": {
      "zone": "C",
      "rack": 15,
      "level": 4
    },
    "timeSavingsMinutes": -1.9,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'C', rack: 15, level: 4, timeSavingsMinutes: -1.9 },
      { id: 'alt-2', zone: 'C', rack: 20, level: 6, timeSavingsMinutes: -2.3 },
      { id: 'alt-3', zone: 'D', rack: 10, level: 3, timeSavingsMinutes: -3.0 }
    ],
    "status": "pending"
  },
  {
    "id": "SPO-002",
    "locationId": "A-11-01",
    "currentSku": "PUMA-SNEAKER-39",
    "demandLevel": "low",
    "inventoryUnits": 19,
    "tripFrequency": { days7: 5, days30: 20, days90: 60 },
    "currentLocation": {
      "zone": "A",
      "rack": 11,
      "level": 1
    },
    "suggestedLocation": {
      "zone": "C",
      "rack": 8,
      "level": 2
    },
    "timeSavingsMinutes": -1.2,
    "alternativeLocations": [
      { id: 'alt-1', zone: 'C', rack: 8, level: 2, timeSavingsMinutes: -1.2 },
      { id: 'alt-2', zone: 'C', rack: 12, level: 4, timeSavingsMinutes: -1.6 },
      { id: 'alt-3', zone: 'D', rack: 6, level: 3, timeSavingsMinutes: -2.2 }
    ],
    "status": "pending"
  }
]

// ─── Mock Data: Product Pairs Reslotting Opportunities ───────────────────
export const PRODUCT_PAIRS_OPPORTUNITIES = [
  {
    "id": "PPO-002",
    "skuA": "VANS-OLD-SKOOL-44",
    "skuB": "CONVERSE-ALLSTAR-41",
    "locationA": { "zone": "D", "rack": 9, "level": 3 },
    "locationB": { "zone": "D", "rack": 5, "level": 6 },
    "suggestedLocationA": { "zone": "A", "rack": 2, "level": 1 },
    "suggestedLocationB": { "zone": "A", "rack": 3, "level": 9 },
    "timeSavingsMinutes": 4.6,
    "status": "pending",
    "ordersInPeriod": { "days7": 16, "days30": 63, "days90": 189 },
    "demandRateA": { "unitsPerDay": 14.1, "level": "high" },
    "demandRateB": { "unitsPerDay": 9.8, "level": "high" },
    "inventoryUnitsB": 82,
    "distanceAB": 52.4,
    "alternativeLocations": [
      { "id": "suggested", "zone": "A", "rack": 3, "level": 9, "skuAtLocation": "REEBOK-CLASSIC-42", "demandRateC": { "unitsPerDay": 4.8, "level": "low" }, "inventoryUnitsC": 20, "distanceAC": 2.8, "timeSavingsMinutes": 4.6, "isSuggested": true },
      { "id": "alt-1", "zone": "A", "rack": 4, "level": 7, "skuAtLocation": "PUMA-RS-X-41", "demandRateC": { "unitsPerDay": 6.1, "level": "medium" }, "inventoryUnitsC": 35, "distanceAC": 3.5, "timeSavingsMinutes": 4.1 },
      { "id": "alt-2", "zone": "A", "rack": 5, "level": 4, "skuAtLocation": "ASICS-GEL-41", "demandRateC": { "unitsPerDay": 7.3, "level": "medium" }, "inventoryUnitsC": 42, "distanceAC": 4.2, "timeSavingsMinutes": 3.6 }
    ]
  },
  {
    "id": "PPO-006",
    "skuA": "NEW-BALANCE-43",
    "skuB": "NIKE-AIRMAX-43",
    "locationA": { "zone": "D", "rack": 18, "level": 6 },
    "locationB": { "zone": "C", "rack": 6, "level": 4 },
    "suggestedLocationA": { "zone": "A", "rack": 5, "level": 7 },
    "suggestedLocationB": { "zone": "A", "rack": 6, "level": 5 },
    "timeSavingsMinutes": 4.6,
    "status": "pending",
    "ordersInPeriod": { "days7": 15, "days30": 61, "days90": 183 },
    "demandRateA": { "unitsPerDay": 13.5, "level": "high" },
    "demandRateB": { "unitsPerDay": 11.2, "level": "high" },
    "inventoryUnitsB": 78,
    "distanceAB": 48.7,
    "alternativeLocations": [
      { "id": "suggested", "zone": "A", "rack": 6, "level": 5, "skuAtLocation": "SAUCONY-JAZZ-41", "demandRateC": { "unitsPerDay": 5.5, "level": "medium" }, "inventoryUnitsC": 38, "distanceAC": 3.1, "timeSavingsMinutes": 4.6, "isSuggested": true },
      { "id": "alt-1", "zone": "A", "rack": 7, "level": 3, "skuAtLocation": "CONVERSE-ALLSTAR-42", "demandRateC": { "unitsPerDay": 6.9, "level": "medium" }, "inventoryUnitsC": 45, "distanceAC": 3.9, "timeSavingsMinutes": 4.0 },
      { "id": "alt-2", "zone": "A", "rack": 8, "level": 2, "skuAtLocation": "ADIDAS-ULTRA-42", "demandRateC": { "unitsPerDay": 8.1, "level": "medium" }, "inventoryUnitsC": 50, "distanceAC": 4.8, "timeSavingsMinutes": 3.3 }
    ]
  },
  {
    "id": "PPO-007",
    "skuA": "VANS-OLD-SKOOL-45",
    "skuB": "NIKE-AIRMAX-44",
    "locationA": { "zone": "B", "rack": 13, "level": 1 },
    "locationB": { "zone": "C", "rack": 9, "level": 4 },
    "suggestedLocationA": { "zone": "A", "rack": 6, "level": 2 },
    "suggestedLocationB": { "zone": "A", "rack": 7, "level": 8 },
    "timeSavingsMinutes": 4.5,
    "status": "pending",
    "ordersInPeriod": { "days7": 14, "days30": 57, "days90": 171 },
    "demandRateA": { "unitsPerDay": 12.8, "level": "high" },
    "demandRateB": { "unitsPerDay": 10.4, "level": "high" },
    "inventoryUnitsB": 75,
    "distanceAB": 46.1,
    "alternativeLocations": [
      { "id": "suggested", "zone": "A", "rack": 7, "level": 8, "skuAtLocation": "REEBOK-CLASSIC-43", "demandRateC": { "unitsPerDay": 4.2, "level": "low" }, "inventoryUnitsC": 22, "distanceAC": 2.9, "timeSavingsMinutes": 4.5, "isSuggested": true },
      { "id": "alt-1", "zone": "A", "rack": 8, "level": 5, "skuAtLocation": "PUMA-RS-X-43", "demandRateC": { "unitsPerDay": 5.8, "level": "medium" }, "inventoryUnitsC": 40, "distanceAC": 3.7, "timeSavingsMinutes": 3.9 },
      { "id": "alt-2", "zone": "B", "rack": 1, "level": 2, "skuAtLocation": "ASICS-GEL-44", "demandRateC": { "unitsPerDay": 7.1, "level": "medium" }, "inventoryUnitsC": 48, "distanceAC": 5.1, "timeSavingsMinutes": 3.2 }
    ]
  },
  {
    "id": "PPO-001",
    "skuA": "NEW-BALANCE-44",
    "skuB": "NIKE-AIRMAX-43",
    "locationA": { "zone": "D", "rack": 20, "level": 1 },
    "locationB": { "zone": "C", "rack": 14, "level": 2 },
    "suggestedLocationA": { "zone": "A", "rack": 3, "level": 5 },
    "suggestedLocationB": { "zone": "A", "rack": 4, "level": 1 },
    "timeSavingsMinutes": 4.3,
    "status": "pending",
    "ordersInPeriod": { "days7": 14, "days30": 58, "days90": 175 },
    "demandRateA": { "unitsPerDay": 12.3, "level": "high" },
    "demandRateB": { "unitsPerDay": 8.7, "level": "medium" },
    "inventoryUnitsB": 42,
    "distanceAB": 45.2,
    "alternativeLocations": [
      { "id": "suggested", "zone": "A", "rack": 4, "level": 1, "skuAtLocation": "PUMA-RS-X-40", "demandRateC": { "unitsPerDay": 5.2, "level": "medium" }, "inventoryUnitsC": 35, "distanceAC": 3.2, "timeSavingsMinutes": 4.3, "isSuggested": true },
      { "id": "alt-1", "zone": "A", "rack": 5, "level": 2, "skuAtLocation": "REEBOK-CLASSIC-41", "demandRateC": { "unitsPerDay": 6.4, "level": "medium" }, "inventoryUnitsC": 42, "distanceAC": 4.1, "timeSavingsMinutes": 3.8 },
      { "id": "alt-2", "zone": "A", "rack": 6, "level": 3, "skuAtLocation": "VANS-OLD-SKOOL-42", "demandRateC": { "unitsPerDay": 7.8, "level": "medium" }, "inventoryUnitsC": 52, "distanceAC": 5.0, "timeSavingsMinutes": 3.1 }
    ]
  },
  {
    "id": "PPO-003",
    "skuA": "NEW-BALANCE-43",
    "skuB": "CONVERSE-ALLSTAR-43",
    "locationA": { "zone": "D", "rack": 7, "level": 1 },
    "locationB": { "zone": "C", "rack": 6, "level": 5 },
    "suggestedLocationA": { "zone": "A", "rack": 1, "level": 10 },
    "suggestedLocationB": { "zone": "A", "rack": 2, "level": 4 },
    "timeSavingsMinutes": 4.2,
    "status": "pending",
    "ordersInPeriod": { "days7": 13, "days30": 54, "days90": 162 },
    "demandRateA": { "unitsPerDay": 11.9, "level": "high" },
    "demandRateB": { "unitsPerDay": 8.1, "level": "medium" },
    "inventoryUnitsB": 38,
    "distanceAB": 43.8,
    "alternativeLocations": [
      { "id": "suggested", "zone": "A", "rack": 2, "level": 4, "skuAtLocation": "ADIDAS-ULTRA-40", "demandRateC": { "unitsPerDay": 4.9, "level": "low" }, "inventoryUnitsC": 18, "distanceAC": 3.0, "timeSavingsMinutes": 4.2, "isSuggested": true },
      { "id": "alt-1", "zone": "A", "rack": 3, "level": 6, "skuAtLocation": "SAUCONY-JAZZ-42", "demandRateC": { "unitsPerDay": 6.2, "level": "medium" }, "inventoryUnitsC": 38, "distanceAC": 3.8, "timeSavingsMinutes": 3.7 },
      { "id": "alt-2", "zone": "A", "rack": 4, "level": 8, "skuAtLocation": "ASICS-GEL-42", "demandRateC": { "unitsPerDay": 7.5, "level": "medium" }, "inventoryUnitsC": 45, "distanceAC": 4.6, "timeSavingsMinutes": 3.0 }
    ]
  },
  {
    "id": "PPO-008",
    "skuA": "SAUCONY-JAZZ-40",
    "skuB": "HM-TSHIRT-M",
    "locationA": { "zone": "B", "rack": 7, "level": 4 },
    "locationB": { "zone": "B", "rack": 6, "level": 4 },
    "suggestedLocationA": { "zone": "A", "rack": 2, "level": 6 },
    "suggestedLocationB": { "zone": "A", "rack": 3, "level": 8 },
    "timeSavingsMinutes": 4.1,
    "status": "pending",
    "ordersInPeriod": { "days7": 12, "days30": 49, "days90": 148 },
    "demandRateA": { "unitsPerDay": 10.7, "level": "high" },
    "demandRateB": { "unitsPerDay": 7.4, "level": "medium" },
    "inventoryUnitsB": 45,
    "distanceAB": 38.5,
    "alternativeLocations": [
      { "id": "suggested", "zone": "A", "rack": 3, "level": 8, "skuAtLocation": "REEBOK-CLASSIC-40", "demandRateC": { "unitsPerDay": 3.9, "level": "low" }, "inventoryUnitsC": 15, "distanceAC": 2.6, "timeSavingsMinutes": 4.1, "isSuggested": true },
      { "id": "alt-1", "zone": "A", "rack": 4, "level": 5, "skuAtLocation": "PUMA-RS-X-42", "demandRateC": { "unitsPerDay": 5.3, "level": "medium" }, "inventoryUnitsC": 32, "distanceAC": 3.4, "timeSavingsMinutes": 3.5 },
      { "id": "alt-2", "zone": "A", "rack": 5, "level": 3, "skuAtLocation": "CONVERSE-ALLSTAR-40", "demandRateC": { "unitsPerDay": 6.7, "level": "medium" }, "inventoryUnitsC": 42, "distanceAC": 4.3, "timeSavingsMinutes": 2.9 }
    ]
  },
  {
    "id": "PPO-005",
    "skuA": "VANS-OLD-SKOOL-45",
    "skuB": "NEW-BALANCE-44",
    "locationA": { "zone": "B", "rack": 5, "level": 4 },
    "locationB": { "zone": "C", "rack": 19, "level": 3 },
    "suggestedLocationA": { "zone": "A", "rack": 5, "level": 6 },
    "suggestedLocationB": { "zone": "A", "rack": 6, "level": 5 },
    "timeSavingsMinutes": 2.3,
    "status": "pending",
    "ordersInPeriod": { "days7": 9, "days30": 37, "days90": 111 },
    "demandRateA": { "unitsPerDay": 8.2, "level": "medium" },
    "demandRateB": { "unitsPerDay": 6.5, "level": "medium" },
    "inventoryUnitsB": 40,
    "distanceAB": 35.9,
    "alternativeLocations": [
      { "id": "suggested", "zone": "A", "rack": 6, "level": 5, "skuAtLocation": "ADIDAS-ULTRA-43", "demandRateC": { "unitsPerDay": 4.1, "level": "low" }, "inventoryUnitsC": 20, "distanceAC": 3.3, "timeSavingsMinutes": 2.3, "isSuggested": true },
      { "id": "alt-1", "zone": "A", "rack": 7, "level": 4, "skuAtLocation": "SAUCONY-JAZZ-43", "demandRateC": { "unitsPerDay": 5.6, "level": "medium" }, "inventoryUnitsC": 36, "distanceAC": 4.0, "timeSavingsMinutes": 1.9 },
      { "id": "alt-2", "zone": "B", "rack": 1, "level": 6, "skuAtLocation": "ASICS-GEL-45", "demandRateC": { "unitsPerDay": 6.8, "level": "medium" }, "inventoryUnitsC": 45, "distanceAC": 5.2, "timeSavingsMinutes": 1.4 }
    ]
  },
  {
    "id": "PPO-004",
    "skuA": "NIKE-AIRMAX-44",
    "skuB": "SAUCONY-JAZZ-40",
    "locationA": { "zone": "B", "rack": 8, "level": 1 },
    "locationB": { "zone": "C", "rack": 12, "level": 5 },
    "suggestedLocationA": { "zone": "A", "rack": 2, "level": 3 },
    "suggestedLocationB": { "zone": "A", "rack": 3, "level": 3 },
    "timeSavingsMinutes": 1.6,
    "status": "pending",
    "ordersInPeriod": { "days7": 7, "days30": 29, "days90": 87 },
    "demandRateA": { "unitsPerDay": 6.8, "level": "medium" },
    "demandRateB": { "unitsPerDay": 5.3, "level": "medium" },
    "inventoryUnitsB": 35,
    "distanceAB": 31.4,
    "alternativeLocations": [
      { "id": "suggested", "zone": "A", "rack": 3, "level": 3, "skuAtLocation": "REEBOK-CLASSIC-44", "demandRateC": { "unitsPerDay": 3.5, "level": "low" }, "inventoryUnitsC": 17, "distanceAC": 2.4, "timeSavingsMinutes": 1.6, "isSuggested": true },
      { "id": "alt-1", "zone": "A", "rack": 4, "level": 4, "skuAtLocation": "PUMA-RS-X-44", "demandRateC": { "unitsPerDay": 4.8, "level": "low" }, "inventoryUnitsC": 22, "distanceAC": 3.2, "timeSavingsMinutes": 1.2 },
      { "id": "alt-2", "zone": "A", "rack": 5, "level": 5, "skuAtLocation": "VANS-OLD-SKOOL-43", "demandRateC": { "unitsPerDay": 5.9, "level": "medium" }, "inventoryUnitsC": 38, "distanceAC": 4.0, "timeSavingsMinutes": 0.8 }
    ]
  },
  {
    "id": "PPO-009",
    "skuA": "ADIDAS-ULTRA-41",
    "skuB": "REEBOK-CLASSIC-42",
    "locationA": { "zone": "C", "rack": 11, "level": 3 },
    "locationB": { "zone": "D", "rack": 8, "level": 2 },
    "suggestedLocationA": { "zone": "A", "rack": 1, "level": 3 },
    "suggestedLocationB": { "zone": "A", "rack": 2, "level": 2 },
    "timeSavingsMinutes": 3.9,
    "status": "pending",
    "ordersInPeriod": { "days7": 11, "days30": 45, "days90": 136 },
    "demandRateA": { "unitsPerDay": 10.2, "level": "high" },
    "demandRateB": { "unitsPerDay": 7.9, "level": "medium" },
    "inventoryUnitsB": 48,
    "distanceAB": 41.3,
    "alternativeLocations": [
      { "id": "suggested", "zone": "A", "rack": 2, "level": 2, "skuAtLocation": "ASICS-GEL-40", "demandRateC": { "unitsPerDay": 4.4, "level": "low" }, "inventoryUnitsC": 19, "distanceAC": 2.7, "timeSavingsMinutes": 3.9, "isSuggested": true },
      { "id": "alt-1", "zone": "A", "rack": 3, "level": 4, "skuAtLocation": "CONVERSE-ALLSTAR-44", "demandRateC": { "unitsPerDay": 5.7, "level": "medium" }, "inventoryUnitsC": 35, "distanceAC": 3.6, "timeSavingsMinutes": 3.4 },
      { "id": "alt-2", "zone": "A", "rack": 4, "level": 6, "skuAtLocation": "SAUCONY-JAZZ-44", "demandRateC": { "unitsPerDay": 7.0, "level": "medium" }, "inventoryUnitsC": 46, "distanceAC": 4.4, "timeSavingsMinutes": 2.8 }
    ]
  },
  {
    "id": "PPO-010",
    "skuA": "ASICS-GEL-43",
    "skuB": "ADIDAS-ULTRA-42",
    "locationA": { "zone": "C", "rack": 15, "level": 5 },
    "locationB": { "zone": "D", "rack": 4, "level": 3 },
    "suggestedLocationA": { "zone": "A", "rack": 3, "level": 1 },
    "suggestedLocationB": { "zone": "A", "rack": 4, "level": 3 },
    "timeSavingsMinutes": 3.5,
    "status": "pending",
    "ordersInPeriod": { "days7": 10, "days30": 41, "days90": 124 },
    "demandRateA": { "unitsPerDay": 9.6, "level": "medium" },
    "demandRateB": { "unitsPerDay": 7.2, "level": "medium" },
    "inventoryUnitsB": 43,
    "distanceAB": 39.7,
    "alternativeLocations": [
      { "id": "suggested", "zone": "A", "rack": 4, "level": 3, "skuAtLocation": "NIKE-AIRMAX-42", "demandRateC": { "unitsPerDay": 4.0, "level": "low" }, "inventoryUnitsC": 16, "distanceAC": 2.5, "timeSavingsMinutes": 3.5, "isSuggested": true },
      { "id": "alt-1", "zone": "A", "rack": 5, "level": 1, "skuAtLocation": "PUMA-RS-X-45", "demandRateC": { "unitsPerDay": 5.4, "level": "medium" }, "inventoryUnitsC": 33, "distanceAC": 3.3, "timeSavingsMinutes": 3.0 },
      { "id": "alt-2", "zone": "A", "rack": 6, "level": 4, "skuAtLocation": "VANS-OLD-SKOOL-41", "demandRateC": { "unitsPerDay": 6.6, "level": "medium" }, "inventoryUnitsC": 42, "distanceAC": 4.1, "timeSavingsMinutes": 2.4 }
    ]
  },
  {
    "id": "PPO-011",
    "skuA": "REEBOK-CLASSIC-43",
    "skuB": "SAUCONY-JAZZ-42",
    "locationA": { "zone": "B", "rack": 16, "level": 2 },
    "locationB": { "zone": "C", "rack": 3, "level": 6 },
    "suggestedLocationA": { "zone": "A", "rack": 1, "level": 6 },
    "suggestedLocationB": { "zone": "A", "rack": 2, "level": 8 },
    "timeSavingsMinutes": 2.8,
    "status": "pending",
    "ordersInPeriod": { "days7": 8, "days30": 33, "days90": 99 },
    "demandRateA": { "unitsPerDay": 7.5, "level": "medium" },
    "demandRateB": { "unitsPerDay": 5.9, "level": "medium" },
    "inventoryUnitsB": 36,
    "distanceAB": 33.6,
    "alternativeLocations": [
      { "id": "suggested", "zone": "A", "rack": 2, "level": 8, "skuAtLocation": "CONVERSE-ALLSTAR-45", "demandRateC": { "unitsPerDay": 3.7, "level": "low" }, "inventoryUnitsC": 18, "distanceAC": 2.3, "timeSavingsMinutes": 2.8, "isSuggested": true },
      { "id": "alt-1", "zone": "A", "rack": 3, "level": 7, "skuAtLocation": "ADIDAS-ULTRA-44", "demandRateC": { "unitsPerDay": 5.1, "level": "medium" }, "inventoryUnitsC": 34, "distanceAC": 3.1, "timeSavingsMinutes": 2.3 },
      { "id": "alt-2", "zone": "A", "rack": 4, "level": 9, "skuAtLocation": "ASICS-GEL-45", "demandRateC": { "unitsPerDay": 6.3, "level": "medium" }, "inventoryUnitsC": 44, "distanceAC": 3.9, "timeSavingsMinutes": 1.8 }
    ]
  }
]

// ─── Mock Data: Product Triplets Reslotting Opportunities ──────────────────
export const PRODUCT_TRIPLETS_OPPORTUNITIES = [
  {
    "id": "TPO-003",
    "skuA": "NEW-BALANCE-44",
    "skuB": "CONVERSE-ALLSTAR-41",
    "skuC": "CONVERSE-ALLSTAR-42",
    "inventoryUnitsA": 78,
    "inventoryUnitsB": 85,
    "inventoryUnitsC": 82,
    "locationA": {
      "zone": "C",
      "rack": 9,
      "level": 3
    },
    "locationB": {
      "zone": "D",
      "rack": 13,
      "level": 1
    },
    "locationC": {
      "zone": "C",
      "rack": 21,
      "level": 2
    },
    "suggestedLocationA": {
      "zone": "A",
      "rack": 2,
      "level": 10
    },
    "suggestedLocationB": {
      "zone": "A",
      "rack": 3,
      "level": 6
    },
    "suggestedLocationC": {
      "zone": "A",
      "rack": 4,
      "level": 10
    },
    "timeSavingsMinutes": 5.8,
    "status": "pending"
  },
  {
    "id": "TPO-001",
    "skuA": "ADIDAS-ULTRA-41",
    "skuB": "ASICS-GEL-43",
    "skuC": "NEW-BALANCE-43",
    "inventoryUnitsA": 72,
    "inventoryUnitsB": 68,
    "inventoryUnitsC": 74,
    "locationA": {
      "zone": "B",
      "rack": 6,
      "level": 1
    },
    "locationB": {
      "zone": "D",
      "rack": 17,
      "level": 1
    },
    "locationC": {
      "zone": "B",
      "rack": 21,
      "level": 6
    },
    "suggestedLocationA": {
      "zone": "A",
      "rack": 4,
      "level": 4
    },
    "suggestedLocationB": {
      "zone": "A",
      "rack": 5,
      "level": 10
    },
    "suggestedLocationC": {
      "zone": "A",
      "rack": 6,
      "level": 7
    },
    "timeSavingsMinutes": 5,
    "status": "pending"
  },
  {
    "id": "TPO-005",
    "skuA": "NIKE-AIRMAX-43",
    "skuB": "HM-TSHIRT-XL",
    "skuC": "SAUCONY-JAZZ-41",
    "inventoryUnitsA": 80,
    "inventoryUnitsB": 24,
    "inventoryUnitsC": 45,
    "locationA": {
      "zone": "C",
      "rack": 18,
      "level": 6
    },
    "locationB": {
      "zone": "D",
      "rack": 9,
      "level": 2
    },
    "locationC": {
      "zone": "C",
      "rack": 8,
      "level": 5
    },
    "suggestedLocationA": {
      "zone": "A",
      "rack": 4,
      "level": 6
    },
    "suggestedLocationB": {
      "zone": "A",
      "rack": 5,
      "level": 5
    },
    "suggestedLocationC": {
      "zone": "A",
      "rack": 6,
      "level": 5
    },
    "timeSavingsMinutes": 4.9,
    "status": "pending"
  },
  {
    "id": "TPO-002",
    "skuA": "REEBOK-CROSS-38",
    "skuB": "ADIDAS-ULTRA-41",
    "skuC": "CONVERSE-ALLSTAR-41",
    "inventoryUnitsA": 20,
    "inventoryUnitsB": 72,
    "inventoryUnitsC": 88,
    "locationA": {
      "zone": "C",
      "rack": 20,
      "level": 1
    },
    "locationB": {
      "zone": "D",
      "rack": 8,
      "level": 2
    },
    "locationC": {
      "zone": "B",
      "rack": 14,
      "level": 5
    },
    "suggestedLocationA": {
      "zone": "A",
      "rack": 3,
      "level": 5
    },
    "suggestedLocationB": {
      "zone": "A",
      "rack": 4,
      "level": 7
    },
    "suggestedLocationC": {
      "zone": "A",
      "rack": 5,
      "level": 4
    },
    "timeSavingsMinutes": 3.2,
    "status": "pending"
  },
  {
    "id": "TPO-004",
    "skuA": "REEBOK-CROSS-38",
    "skuB": "SAUCONY-JAZZ-40",
    "skuC": "PUMA-SNEAKER-41",
    "inventoryUnitsA": 18,
    "inventoryUnitsB": 70,
    "inventoryUnitsC": 25,
    "locationA": {
      "zone": "D",
      "rack": 19,
      "level": 5
    },
    "locationB": {
      "zone": "B",
      "rack": 16,
      "level": 6
    },
    "locationC": {
      "zone": "C",
      "rack": 7,
      "level": 4
    },
    "suggestedLocationA": {
      "zone": "A",
      "rack": 3,
      "level": 9
    },
    "suggestedLocationB": {
      "zone": "A",
      "rack": 4,
      "level": 8
    },
    "suggestedLocationC": {
      "zone": "A",
      "rack": 5,
      "level": 8
    },
    "timeSavingsMinutes": 3,
    "status": "accepted"
  }
]

// ─── Mock Data: Trips for Detail View ───────────────────────────────────────
export const TRIP_DATA = {
  "SPO-007": [
    {
      "employee": "John Lee",
      "date": "2026-02-25",
      "orderId": "ORD-6082",
      "picksInRoute": 21,
      "routeLength": "6m 50s",
      "updatedRouteLength": "1.5m 20s",
      "timeSaved": "4m 30s"
    },
    {
      "employee": "John Lee",
      "date": "2026-02-24",
      "orderId": "ORD-7924",
      "picksInRoute": 22,
      "routeLength": "3m 37s",
      "updatedRouteLength": "0m 07s",
      "timeSaved": "4m 30s"
    },
    {
      "employee": "Emily Smith",
      "date": "2026-02-23",
      "orderId": "ORD-1125",
      "picksInRoute": 22,
      "routeLength": "11m 24s",
      "updatedRouteLength": "6.5m 00s",
      "timeSaved": "4m 30s"
    },
    {
      "employee": "Anna Lee",
      "date": "2026-02-22",
      "orderId": "ORD-9080",
      "picksInRoute": 15,
      "routeLength": "11m 52s",
      "updatedRouteLength": "6.5m 22s",
      "timeSaved": "4m 30s"
    },
    {
      "employee": "John Chen",
      "date": "2026-02-21",
      "orderId": "ORD-5099",
      "picksInRoute": 10,
      "routeLength": "3m 56s",
      "updatedRouteLength": "0m 26s",
      "timeSaved": "4m 30s"
    },
    {
      "employee": "Lisa Wilson",
      "date": "2026-02-20",
      "orderId": "ORD-9125",
      "picksInRoute": 19,
      "routeLength": "6m 22s",
      "updatedRouteLength": "1.5m 00s",
      "timeSaved": "4m 30s"
    },
    {
      "employee": "Chris Martinez",
      "date": "2026-02-19",
      "orderId": "ORD-4774",
      "picksInRoute": 24,
      "routeLength": "9m 04s",
      "updatedRouteLength": "4.5m 00s",
      "timeSaved": "4m 30s"
    },
    {
      "employee": "Tom Chen",
      "date": "2026-02-18",
      "orderId": "ORD-7230",
      "picksInRoute": 24,
      "routeLength": "7m 18s",
      "updatedRouteLength": "2.5m 00s",
      "timeSaved": "4m 30s"
    }
  ],
  "SPO-003": [
    {
      "employee": "Maria Brown",
      "date": "2026-02-25",
      "orderId": "ORD-5676",
      "picksInRoute": 18,
      "routeLength": "3m 40s",
      "updatedRouteLength": "0m 22s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "Maria Johnson",
      "date": "2026-02-24",
      "orderId": "ORD-2270",
      "picksInRoute": 18,
      "routeLength": "12m 13s",
      "updatedRouteLength": "7.7m 00s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "Sarah Chen",
      "date": "2026-02-23",
      "orderId": "ORD-8406",
      "picksInRoute": 23,
      "routeLength": "3m 14s",
      "updatedRouteLength": "0m 00s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "James Taylor",
      "date": "2026-02-22",
      "orderId": "ORD-4190",
      "picksInRoute": 24,
      "routeLength": "5m 31s",
      "updatedRouteLength": "0.7000000000000002m 13s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "Lisa Wilson",
      "date": "2026-02-21",
      "orderId": "ORD-7215",
      "picksInRoute": 10,
      "routeLength": "11m 11s",
      "updatedRouteLength": "6.7m 00s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "Sarah Martinez",
      "date": "2026-02-20",
      "orderId": "ORD-3238",
      "picksInRoute": 15,
      "routeLength": "12m 51s",
      "updatedRouteLength": "7.7m 33s",
      "timeSaved": "4m 18s"
    }
  ],
  "SPO-008": [
    {
      "employee": "Mike Brown",
      "date": "2026-02-25",
      "orderId": "ORD-3209",
      "picksInRoute": 25,
      "routeLength": "5m 21s",
      "updatedRouteLength": "0.7000000000000002m 03s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "James Johnson",
      "date": "2026-02-24",
      "orderId": "ORD-9873",
      "picksInRoute": 10,
      "routeLength": "8m 22s",
      "updatedRouteLength": "3.7m 04s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "David Johnson",
      "date": "2026-02-23",
      "orderId": "ORD-4213",
      "picksInRoute": 9,
      "routeLength": "9m 31s",
      "updatedRouteLength": "4.7m 13s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "Emily Smith",
      "date": "2026-02-22",
      "orderId": "ORD-2884",
      "picksInRoute": 16,
      "routeLength": "5m 48s",
      "updatedRouteLength": "0.7000000000000002m 30s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "Maria Johnson",
      "date": "2026-02-21",
      "orderId": "ORD-5826",
      "picksInRoute": 18,
      "routeLength": "5m 28s",
      "updatedRouteLength": "0.7000000000000002m 10s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "Mike Martinez",
      "date": "2026-02-20",
      "orderId": "ORD-1179",
      "picksInRoute": 17,
      "routeLength": "8m 49s",
      "updatedRouteLength": "3.7m 31s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "James Johnson",
      "date": "2026-02-19",
      "orderId": "ORD-4348",
      "picksInRoute": 19,
      "routeLength": "3m 22s",
      "updatedRouteLength": "0m 04s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "Maria Garcia",
      "date": "2026-02-18",
      "orderId": "ORD-3795",
      "picksInRoute": 17,
      "routeLength": "6m 25s",
      "updatedRouteLength": "1.7000000000000002m 07s",
      "timeSaved": "4m 18s"
    }
  ],
  "SPO-010": [
    {
      "employee": "Tom Martinez",
      "date": "2026-02-25",
      "orderId": "ORD-1749",
      "picksInRoute": 20,
      "routeLength": "10m 06s",
      "updatedRouteLength": "5.7m 00s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "James Smith",
      "date": "2026-02-24",
      "orderId": "ORD-7377",
      "picksInRoute": 11,
      "routeLength": "7m 14s",
      "updatedRouteLength": "2.7m 00s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "Anna Davis",
      "date": "2026-02-23",
      "orderId": "ORD-7908",
      "picksInRoute": 15,
      "routeLength": "3m 02s",
      "updatedRouteLength": "0m 00s",
      "timeSaved": "4m 18s"
    },
    {
      "employee": "John Chen",
      "date": "2026-02-22",
      "orderId": "ORD-3108",
      "picksInRoute": 15,
      "routeLength": "5m 21s",
      "updatedRouteLength": "0.7000000000000002m 03s",
      "timeSaved": "4m 18s"
    }
  ],
  "SPO-006": [
    {
      "employee": "Sarah Taylor",
      "date": "2026-02-25",
      "orderId": "ORD-9730",
      "picksInRoute": 9,
      "routeLength": "11m 00s",
      "updatedRouteLength": "7.3m 00s",
      "timeSaved": "3m 42s"
    },
    {
      "employee": "Anna Garcia",
      "date": "2026-02-24",
      "orderId": "ORD-2863",
      "picksInRoute": 11,
      "routeLength": "7m 38s",
      "updatedRouteLength": "3.3m 00s",
      "timeSaved": "3m 42s"
    },
    {
      "employee": "Chris Smith",
      "date": "2026-02-23",
      "orderId": "ORD-3064",
      "picksInRoute": 23,
      "routeLength": "8m 38s",
      "updatedRouteLength": "4.3m 00s",
      "timeSaved": "3m 42s"
    },
    {
      "employee": "Lisa Smith",
      "date": "2026-02-22",
      "orderId": "ORD-1517",
      "picksInRoute": 19,
      "routeLength": "3m 14s",
      "updatedRouteLength": "0m 00s",
      "timeSaved": "3m 42s"
    }
  ],
  "SPO-013": [
    {
      "employee": "Lisa Garcia",
      "date": "2026-02-25",
      "orderId": "ORD-3783",
      "picksInRoute": 16,
      "routeLength": "4m 07s",
      "updatedRouteLength": "0.3999999999999999m 00s",
      "timeSaved": "3m 36s"
    },
    {
      "employee": "John Martinez",
      "date": "2026-02-24",
      "orderId": "ORD-3466",
      "picksInRoute": 9,
      "routeLength": "5m 48s",
      "updatedRouteLength": "1.4m 12s",
      "timeSaved": "3m 36s"
    },
    {
      "employee": "James Brown",
      "date": "2026-02-23",
      "orderId": "ORD-5684",
      "picksInRoute": 20,
      "routeLength": "6m 48s",
      "updatedRouteLength": "2.4m 12s",
      "timeSaved": "3m 36s"
    }
  ],
  "SPO-004": [
    {
      "employee": "Emily Smith",
      "date": "2026-02-25",
      "orderId": "ORD-4915",
      "picksInRoute": 22,
      "routeLength": "6m 57s",
      "updatedRouteLength": "2.9m 51s",
      "timeSaved": "3m 06s"
    },
    {
      "employee": "Sarah Brown",
      "date": "2026-02-24",
      "orderId": "ORD-3018",
      "picksInRoute": 12,
      "routeLength": "8m 54s",
      "updatedRouteLength": "4.9m 48s",
      "timeSaved": "3m 06s"
    },
    {
      "employee": "James Martinez",
      "date": "2026-02-23",
      "orderId": "ORD-5448",
      "picksInRoute": 22,
      "routeLength": "7m 25s",
      "updatedRouteLength": "3.9m 19s",
      "timeSaved": "3m 06s"
    },
    {
      "employee": "Chris Taylor",
      "date": "2026-02-22",
      "orderId": "ORD-5841",
      "picksInRoute": 24,
      "routeLength": "3m 16s",
      "updatedRouteLength": "0m 10s",
      "timeSaved": "3m 06s"
    },
    {
      "employee": "Maria Brown",
      "date": "2026-02-21",
      "orderId": "ORD-7424",
      "picksInRoute": 23,
      "routeLength": "10m 14s",
      "updatedRouteLength": "6.9m 08s",
      "timeSaved": "3m 06s"
    },
    {
      "employee": "Mike Brown",
      "date": "2026-02-20",
      "orderId": "ORD-3955",
      "picksInRoute": 10,
      "routeLength": "5m 21s",
      "updatedRouteLength": "1.9m 15s",
      "timeSaved": "3m 06s"
    }
  ],
  "SPO-012": [
    {
      "employee": "Sarah Smith",
      "date": "2026-02-25",
      "orderId": "ORD-4547",
      "picksInRoute": 24,
      "routeLength": "12m 09s",
      "updatedRouteLength": "9.1m 00s",
      "timeSaved": "2m 54s"
    },
    {
      "employee": "Maria Johnson",
      "date": "2026-02-24",
      "orderId": "ORD-5203",
      "picksInRoute": 20,
      "routeLength": "8m 48s",
      "updatedRouteLength": "5.1m 00s",
      "timeSaved": "2m 54s"
    },
    {
      "employee": "Anna Johnson",
      "date": "2026-02-23",
      "orderId": "ORD-2920",
      "picksInRoute": 20,
      "routeLength": "7m 03s",
      "updatedRouteLength": "4.1m 00s",
      "timeSaved": "2m 54s"
    },
    {
      "employee": "Mike Taylor",
      "date": "2026-02-22",
      "orderId": "ORD-5502",
      "picksInRoute": 21,
      "routeLength": "11m 39s",
      "updatedRouteLength": "8.1m 00s",
      "timeSaved": "2m 54s"
    }
  ],
  "SPO-011": [
    {
      "employee": "Lisa Wilson",
      "date": "2026-02-25",
      "orderId": "ORD-9630",
      "picksInRoute": 15,
      "routeLength": "9m 00s",
      "updatedRouteLength": "6.3m 00s",
      "timeSaved": "2m 42s"
    },
    {
      "employee": "Sarah Taylor",
      "date": "2026-02-24",
      "orderId": "ORD-7125",
      "picksInRoute": 15,
      "routeLength": "4m 51s",
      "updatedRouteLength": "1.2999999999999998m 09s",
      "timeSaved": "2m 42s"
    },
    {
      "employee": "Tom Wilson",
      "date": "2026-02-23",
      "orderId": "ORD-8197",
      "picksInRoute": 23,
      "routeLength": "12m 44s",
      "updatedRouteLength": "9.3m 02s",
      "timeSaved": "2m 42s"
    },
    {
      "employee": "Tom Johnson",
      "date": "2026-02-22",
      "orderId": "ORD-7286",
      "picksInRoute": 17,
      "routeLength": "6m 59s",
      "updatedRouteLength": "3.3m 17s",
      "timeSaved": "2m 42s"
    },
    {
      "employee": "Sarah Martinez",
      "date": "2026-02-21",
      "orderId": "ORD-9985",
      "picksInRoute": 21,
      "routeLength": "6m 36s",
      "updatedRouteLength": "3.3m 00s",
      "timeSaved": "2m 42s"
    },
    {
      "employee": "Emily Martinez",
      "date": "2026-02-20",
      "orderId": "ORD-1105",
      "picksInRoute": 13,
      "routeLength": "7m 54s",
      "updatedRouteLength": "4.3m 12s",
      "timeSaved": "2m 42s"
    },
    {
      "employee": "Lisa Smith",
      "date": "2026-02-19",
      "orderId": "ORD-2229",
      "picksInRoute": 19,
      "routeLength": "9m 31s",
      "updatedRouteLength": "6.3m 00s",
      "timeSaved": "2m 42s"
    },
    {
      "employee": "Mike Davis",
      "date": "2026-02-18",
      "orderId": "ORD-4576",
      "picksInRoute": 19,
      "routeLength": "6m 57s",
      "updatedRouteLength": "3.3m 15s",
      "timeSaved": "2m 42s"
    }
  ],
  "SPO-001": [
    {
      "employee": "James Taylor",
      "date": "2026-02-25",
      "orderId": "ORD-6460",
      "picksInRoute": 8,
      "routeLength": "9m 59s",
      "updatedRouteLength": "6.4m 23s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "John Smith",
      "date": "2026-02-24",
      "orderId": "ORD-4545",
      "picksInRoute": 19,
      "routeLength": "7m 25s",
      "updatedRouteLength": "4.4m 00s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "Lisa Johnson",
      "date": "2026-02-23",
      "orderId": "ORD-2761",
      "picksInRoute": 18,
      "routeLength": "12m 52s",
      "updatedRouteLength": "9.4m 16s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "Mike Chen",
      "date": "2026-02-22",
      "orderId": "ORD-2155",
      "picksInRoute": 24,
      "routeLength": "5m 10s",
      "updatedRouteLength": "2.4m 00s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "John Martinez",
      "date": "2026-02-21",
      "orderId": "ORD-1431",
      "picksInRoute": 13,
      "routeLength": "3m 24s",
      "updatedRouteLength": "0.3999999999999999m 00s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "Tom Johnson",
      "date": "2026-02-20",
      "orderId": "ORD-7435",
      "picksInRoute": 8,
      "routeLength": "5m 08s",
      "updatedRouteLength": "2.4m 00s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "Chris Brown",
      "date": "2026-02-19",
      "orderId": "ORD-8043",
      "picksInRoute": 10,
      "routeLength": "9m 32s",
      "updatedRouteLength": "6.4m 00s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "Maria Martinez",
      "date": "2026-02-18",
      "orderId": "ORD-6534",
      "picksInRoute": 9,
      "routeLength": "7m 26s",
      "updatedRouteLength": "4.4m 00s",
      "timeSaved": "2m 36s"
    }
  ],
  "SPO-005": [
    {
      "employee": "James Taylor",
      "date": "2026-02-25",
      "orderId": "ORD-2698",
      "picksInRoute": 9,
      "routeLength": "3m 20s",
      "updatedRouteLength": "0.3999999999999999m 00s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "Emily Chen",
      "date": "2026-02-24",
      "orderId": "ORD-8370",
      "picksInRoute": 12,
      "routeLength": "3m 17s",
      "updatedRouteLength": "0.3999999999999999m 00s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "Sarah Taylor",
      "date": "2026-02-23",
      "orderId": "ORD-3834",
      "picksInRoute": 17,
      "routeLength": "11m 30s",
      "updatedRouteLength": "8.4m 00s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "David Wilson",
      "date": "2026-02-22",
      "orderId": "ORD-5591",
      "picksInRoute": 16,
      "routeLength": "6m 16s",
      "updatedRouteLength": "3.4m 00s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "Mike Johnson",
      "date": "2026-02-21",
      "orderId": "ORD-8095",
      "picksInRoute": 9,
      "routeLength": "9m 42s",
      "updatedRouteLength": "6.4m 06s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "Chris Garcia",
      "date": "2026-02-20",
      "orderId": "ORD-5479",
      "picksInRoute": 23,
      "routeLength": "6m 32s",
      "updatedRouteLength": "3.4m 00s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "Lisa Wilson",
      "date": "2026-02-19",
      "orderId": "ORD-9942",
      "picksInRoute": 24,
      "routeLength": "9m 46s",
      "updatedRouteLength": "6.4m 10s",
      "timeSaved": "2m 36s"
    },
    {
      "employee": "Mike Chen",
      "date": "2026-02-18",
      "orderId": "ORD-5258",
      "picksInRoute": 19,
      "routeLength": "9m 24s",
      "updatedRouteLength": "6.4m 00s",
      "timeSaved": "2m 36s"
    }
  ],
  "SPO-015": [
    {
      "employee": "Maria Johnson",
      "date": "2026-02-25",
      "orderId": "ORD-8431",
      "picksInRoute": 23,
      "routeLength": "12m 33s",
      "updatedRouteLength": "9.8m 21s",
      "timeSaved": "2m 12s"
    },
    {
      "employee": "James Chen",
      "date": "2026-02-24",
      "orderId": "ORD-4159",
      "picksInRoute": 10,
      "routeLength": "4m 42s",
      "updatedRouteLength": "1.7999999999999998m 30s",
      "timeSaved": "2m 12s"
    },
    {
      "employee": "Mike Garcia",
      "date": "2026-02-23",
      "orderId": "ORD-8464",
      "picksInRoute": 11,
      "routeLength": "8m 14s",
      "updatedRouteLength": "5.8m 02s",
      "timeSaved": "2m 12s"
    },
    {
      "employee": "Sarah Garcia",
      "date": "2026-02-22",
      "orderId": "ORD-9874",
      "picksInRoute": 19,
      "routeLength": "9m 19s",
      "updatedRouteLength": "6.8m 07s",
      "timeSaved": "2m 12s"
    },
    {
      "employee": "Mike Brown",
      "date": "2026-02-21",
      "orderId": "ORD-3624",
      "picksInRoute": 18,
      "routeLength": "8m 11s",
      "updatedRouteLength": "5.8m 00s",
      "timeSaved": "2m 12s"
    },
    {
      "employee": "David Davis",
      "date": "2026-02-20",
      "orderId": "ORD-8984",
      "picksInRoute": 17,
      "routeLength": "10m 20s",
      "updatedRouteLength": "7.8m 08s",
      "timeSaved": "2m 12s"
    },
    {
      "employee": "Chris Brown",
      "date": "2026-02-19",
      "orderId": "ORD-8210",
      "picksInRoute": 10,
      "routeLength": "11m 02s",
      "updatedRouteLength": "8.8m 00s",
      "timeSaved": "2m 12s"
    }
  ],
  "SPO-009": [
    {
      "employee": "John Lee",
      "date": "2026-02-25",
      "orderId": "ORD-6011",
      "picksInRoute": 21,
      "routeLength": "8m 53s",
      "updatedRouteLength": "6.1m 00s",
      "timeSaved": "1m 54s"
    },
    {
      "employee": "Chris Martinez",
      "date": "2026-02-24",
      "orderId": "ORD-8870",
      "picksInRoute": 24,
      "routeLength": "7m 35s",
      "updatedRouteLength": "5.1m 00s",
      "timeSaved": "1m 54s"
    },
    {
      "employee": "Anna Davis",
      "date": "2026-02-23",
      "orderId": "ORD-9404",
      "picksInRoute": 12,
      "routeLength": "8m 26s",
      "updatedRouteLength": "6.1m 00s",
      "timeSaved": "1m 54s"
    }
  ],
  "SPO-014": [
    {
      "employee": "John Wilson",
      "date": "2026-02-25",
      "orderId": "ORD-1310",
      "picksInRoute": 20,
      "routeLength": "10m 10s",
      "updatedRouteLength": "8.1m 00s",
      "timeSaved": "1m 54s"
    },
    {
      "employee": "Mike Taylor",
      "date": "2026-02-24",
      "orderId": "ORD-5604",
      "picksInRoute": 14,
      "routeLength": "12m 57s",
      "updatedRouteLength": "10.1m 03s",
      "timeSaved": "1m 54s"
    },
    {
      "employee": "Mike Taylor",
      "date": "2026-02-23",
      "orderId": "ORD-2830",
      "picksInRoute": 9,
      "routeLength": "7m 51s",
      "updatedRouteLength": "5.1m 00s",
      "timeSaved": "1m 54s"
    },
    {
      "employee": "Lisa Davis",
      "date": "2026-02-22",
      "orderId": "ORD-5341",
      "picksInRoute": 25,
      "routeLength": "3m 23s",
      "updatedRouteLength": "1.1m 00s",
      "timeSaved": "1m 54s"
    },
    {
      "employee": "Maria Taylor",
      "date": "2026-02-21",
      "orderId": "ORD-1287",
      "picksInRoute": 9,
      "routeLength": "8m 56s",
      "updatedRouteLength": "6.1m 02s",
      "timeSaved": "1m 54s"
    },
    {
      "employee": "Lisa Lee",
      "date": "2026-02-20",
      "orderId": "ORD-3775",
      "picksInRoute": 22,
      "routeLength": "7m 18s",
      "updatedRouteLength": "5.1m 00s",
      "timeSaved": "1m 54s"
    }
  ],
  "SPO-002": [
    {
      "employee": "Chris Johnson",
      "date": "2026-02-25",
      "orderId": "ORD-7867",
      "picksInRoute": 8,
      "routeLength": "4m 52s",
      "updatedRouteLength": "2.8m 40s",
      "timeSaved": "1m 12s"
    },
    {
      "employee": "John Taylor",
      "date": "2026-02-24",
      "orderId": "ORD-8318",
      "picksInRoute": 22,
      "routeLength": "7m 31s",
      "updatedRouteLength": "5.8m 19s",
      "timeSaved": "1m 12s"
    },
    {
      "employee": "Maria Martinez",
      "date": "2026-02-23",
      "orderId": "ORD-8141",
      "picksInRoute": 15,
      "routeLength": "11m 11s",
      "updatedRouteLength": "9.8m 00s",
      "timeSaved": "1m 12s"
    },
    {
      "employee": "Anna Wilson",
      "date": "2026-02-22",
      "orderId": "ORD-8791",
      "picksInRoute": 9,
      "routeLength": "6m 32s",
      "updatedRouteLength": "4.8m 20s",
      "timeSaved": "1m 12s"
    },
    {
      "employee": "John Martinez",
      "date": "2026-02-21",
      "orderId": "ORD-8229",
      "picksInRoute": 24,
      "routeLength": "4m 24s",
      "updatedRouteLength": "2.8m 12s",
      "timeSaved": "1m 12s"
    },
    {
      "employee": "John Johnson",
      "date": "2026-02-20",
      "orderId": "ORD-3543",
      "picksInRoute": 24,
      "routeLength": "3m 09s",
      "updatedRouteLength": "1.8m 00s",
      "timeSaved": "1m 12s"
    },
    {
      "employee": "James Taylor",
      "date": "2026-02-19",
      "orderId": "ORD-1991",
      "picksInRoute": 13,
      "routeLength": "6m 40s",
      "updatedRouteLength": "4.8m 28s",
      "timeSaved": "1m 12s"
    }
  ],
  "PPO-002": [
    {
      "employee": "John Brown",
      "date": "2026-02-25",
      "orderId": "ORD-8913",
      "picksInRoute": 9,
      "routeLength": "10m 17s",
      "updatedRouteLength": "5.4m 00s",
      "timeSaved": "4m 36s",
      "sameRoute": "CONVERSE-ALLSTAR-41"
    },
    {
      "employee": "Sarah Wilson",
      "date": "2026-02-24",
      "orderId": "ORD-9158",
      "picksInRoute": 23,
      "routeLength": "10m 37s",
      "updatedRouteLength": "5.4m 01s",
      "timeSaved": "4m 36s",
      "sameRoute": "CONVERSE-ALLSTAR-41"
    },
    {
      "employee": "Chris Wilson",
      "date": "2026-02-23",
      "orderId": "ORD-4238",
      "picksInRoute": 20,
      "routeLength": "11m 04s",
      "updatedRouteLength": "6.4m 00s",
      "timeSaved": "4m 36s",
      "sameRoute": "CONVERSE-ALLSTAR-41"
    },
    {
      "employee": "Mike Smith",
      "date": "2026-02-22",
      "orderId": "ORD-6590",
      "picksInRoute": 25,
      "routeLength": "11m 20s",
      "updatedRouteLength": "6.4m 00s",
      "timeSaved": "4m 36s",
      "sameRoute": "CONVERSE-ALLSTAR-41"
    },
    {
      "employee": "Mike Chen",
      "date": "2026-02-21",
      "orderId": "ORD-2673",
      "picksInRoute": 21,
      "routeLength": "12m 33s",
      "updatedRouteLength": "7.4m 00s",
      "timeSaved": "4m 36s",
      "sameRoute": "CONVERSE-ALLSTAR-41"
    },
    {
      "employee": "Lisa Garcia",
      "date": "2026-02-20",
      "orderId": "ORD-9715",
      "picksInRoute": 11,
      "routeLength": "12m 55s",
      "updatedRouteLength": "7.4m 19s",
      "timeSaved": "4m 36s",
      "sameRoute": "CONVERSE-ALLSTAR-41"
    }
  ],
  "PPO-006": [
    {
      "employee": "Maria Davis",
      "date": "2026-02-25",
      "orderId": "ORD-9961",
      "picksInRoute": 22,
      "routeLength": "6m 13s",
      "updatedRouteLength": "1.4000000000000004m 00s",
      "timeSaved": "4m 36s",
      "sameRoute": "NIKE-AIRMAX-43"
    },
    {
      "employee": "Tom Wilson",
      "date": "2026-02-24",
      "orderId": "ORD-6357",
      "picksInRoute": 25,
      "routeLength": "4m 28s",
      "updatedRouteLength": "0m 00s",
      "timeSaved": "4m 36s",
      "sameRoute": "NIKE-AIRMAX-43"
    },
    {
      "employee": "Mike Chen",
      "date": "2026-02-23",
      "orderId": "ORD-7296",
      "picksInRoute": 9,
      "routeLength": "3m 21s",
      "updatedRouteLength": "0m 00s",
      "timeSaved": "4m 36s",
      "sameRoute": "NIKE-AIRMAX-43"
    }
  ],
  "PPO-007": [
    {
      "employee": "Mike Wilson",
      "date": "2026-02-25",
      "orderId": "ORD-9644",
      "picksInRoute": 21,
      "routeLength": "10m 26s",
      "updatedRouteLength": "5.5m 00s",
      "timeSaved": "4m 30s",
      "sameRoute": "NIKE-AIRMAX-44"
    },
    {
      "employee": "Mike Smith",
      "date": "2026-02-24",
      "orderId": "ORD-2634",
      "picksInRoute": 19,
      "routeLength": "11m 09s",
      "updatedRouteLength": "6.5m 00s",
      "timeSaved": "4m 30s",
      "sameRoute": "NIKE-AIRMAX-44"
    },
    {
      "employee": "Maria Smith",
      "date": "2026-02-23",
      "orderId": "ORD-6740",
      "picksInRoute": 14,
      "routeLength": "11m 34s",
      "updatedRouteLength": "6.5m 04s",
      "timeSaved": "4m 30s",
      "sameRoute": "NIKE-AIRMAX-44"
    },
    {
      "employee": "David Wilson",
      "date": "2026-02-22",
      "orderId": "ORD-8480",
      "picksInRoute": 24,
      "routeLength": "6m 59s",
      "updatedRouteLength": "1.5m 29s",
      "timeSaved": "4m 30s",
      "sameRoute": "NIKE-AIRMAX-44"
    }
  ],
  "PPO-001": [
    {
      "employee": "Lisa Smith",
      "date": "2026-02-25",
      "orderId": "ORD-3552",
      "picksInRoute": 9,
      "routeLength": "12m 25s",
      "updatedRouteLength": "7.7m 07s",
      "timeSaved": "4m 18s",
      "sameRoute": "NIKE-AIRMAX-43"
    },
    {
      "employee": "James Garcia",
      "date": "2026-02-24",
      "orderId": "ORD-4574",
      "picksInRoute": 8,
      "routeLength": "5m 00s",
      "updatedRouteLength": "0.7000000000000002m 00s",
      "timeSaved": "4m 18s",
      "sameRoute": "NIKE-AIRMAX-43"
    },
    {
      "employee": "Maria Wilson",
      "date": "2026-02-23",
      "orderId": "ORD-7610",
      "picksInRoute": 23,
      "routeLength": "9m 08s",
      "updatedRouteLength": "4.7m 00s",
      "timeSaved": "4m 18s",
      "sameRoute": "NIKE-AIRMAX-43"
    },
    {
      "employee": "Tom Martinez",
      "date": "2026-02-22",
      "orderId": "ORD-3989",
      "picksInRoute": 18,
      "routeLength": "5m 33s",
      "updatedRouteLength": "0.7000000000000002m 15s",
      "timeSaved": "4m 18s",
      "sameRoute": "NIKE-AIRMAX-43"
    },
    {
      "employee": "Maria Davis",
      "date": "2026-02-21",
      "orderId": "ORD-8727",
      "picksInRoute": 19,
      "routeLength": "3m 09s",
      "updatedRouteLength": "0m 00s",
      "timeSaved": "4m 18s",
      "sameRoute": "NIKE-AIRMAX-43"
    },
    {
      "employee": "John Lee",
      "date": "2026-02-20",
      "orderId": "ORD-4900",
      "picksInRoute": 16,
      "routeLength": "6m 02s",
      "updatedRouteLength": "1.7000000000000002m 00s",
      "timeSaved": "4m 18s",
      "sameRoute": "NIKE-AIRMAX-43"
    },
    {
      "employee": "David Wilson",
      "date": "2026-02-19",
      "orderId": "ORD-7013",
      "picksInRoute": 24,
      "routeLength": "11m 33s",
      "updatedRouteLength": "6.7m 15s",
      "timeSaved": "4m 18s",
      "sameRoute": "NIKE-AIRMAX-43"
    },
    {
      "employee": "Chris Wilson",
      "date": "2026-02-18",
      "orderId": "ORD-2685",
      "picksInRoute": 14,
      "routeLength": "6m 03s",
      "updatedRouteLength": "1.7000000000000002m 00s",
      "timeSaved": "4m 18s",
      "sameRoute": "NIKE-AIRMAX-43"
    }
  ],
  "PPO-003": [
    {
      "employee": "Anna Brown",
      "date": "2026-02-25",
      "orderId": "ORD-9112",
      "picksInRoute": 11,
      "routeLength": "7m 20s",
      "updatedRouteLength": "2.8m 08s",
      "timeSaved": "4m 12s",
      "sameRoute": "CONVERSE-ALLSTAR-43"
    },
    {
      "employee": "Emily Taylor",
      "date": "2026-02-24",
      "orderId": "ORD-3378",
      "picksInRoute": 13,
      "routeLength": "4m 05s",
      "updatedRouteLength": "0m 00s",
      "timeSaved": "4m 12s",
      "sameRoute": "CONVERSE-ALLSTAR-43"
    },
    {
      "employee": "Sarah Wilson",
      "date": "2026-02-23",
      "orderId": "ORD-2175",
      "picksInRoute": 19,
      "routeLength": "9m 30s",
      "updatedRouteLength": "4.8m 18s",
      "timeSaved": "4m 12s",
      "sameRoute": "CONVERSE-ALLSTAR-43"
    },
    {
      "employee": "Sarah Martinez",
      "date": "2026-02-22",
      "orderId": "ORD-4144",
      "picksInRoute": 18,
      "routeLength": "11m 21s",
      "updatedRouteLength": "6.8m 09s",
      "timeSaved": "4m 12s",
      "sameRoute": "CONVERSE-ALLSTAR-43"
    },
    {
      "employee": "Anna Martinez",
      "date": "2026-02-21",
      "orderId": "ORD-5380",
      "picksInRoute": 17,
      "routeLength": "10m 29s",
      "updatedRouteLength": "5.8m 17s",
      "timeSaved": "4m 12s",
      "sameRoute": "CONVERSE-ALLSTAR-43"
    }
  ],
  "PPO-008": [
    {
      "employee": "Emily Taylor",
      "date": "2026-02-25",
      "orderId": "ORD-8163",
      "picksInRoute": 16,
      "routeLength": "8m 07s",
      "updatedRouteLength": "3.9000000000000004m 02s",
      "timeSaved": "4m 05s",
      "sameRoute": "HM-TSHIRT-M"
    },
    {
      "employee": "Lisa Davis",
      "date": "2026-02-24",
      "orderId": "ORD-9068",
      "picksInRoute": 23,
      "routeLength": "8m 38s",
      "updatedRouteLength": "3.9000000000000004m 33s",
      "timeSaved": "4m 05s",
      "sameRoute": "HM-TSHIRT-M"
    },
    {
      "employee": "Mike Garcia",
      "date": "2026-02-23",
      "orderId": "ORD-3134",
      "picksInRoute": 25,
      "routeLength": "7m 25s",
      "updatedRouteLength": "2.9000000000000004m 20s",
      "timeSaved": "4m 05s",
      "sameRoute": "HM-TSHIRT-M"
    },
    {
      "employee": "Maria Taylor",
      "date": "2026-02-22",
      "orderId": "ORD-6550",
      "picksInRoute": 25,
      "routeLength": "4m 18s",
      "updatedRouteLength": "0m 13s",
      "timeSaved": "4m 05s",
      "sameRoute": "HM-TSHIRT-M"
    },
    {
      "employee": "Emily Davis",
      "date": "2026-02-21",
      "orderId": "ORD-6565",
      "picksInRoute": 20,
      "routeLength": "11m 51s",
      "updatedRouteLength": "6.9m 46s",
      "timeSaved": "4m 05s",
      "sameRoute": "HM-TSHIRT-M"
    },
    {
      "employee": "Lisa Lee",
      "date": "2026-02-20",
      "orderId": "ORD-6328",
      "picksInRoute": 21,
      "routeLength": "3m 15s",
      "updatedRouteLength": "0m 10s",
      "timeSaved": "4m 05s",
      "sameRoute": "HM-TSHIRT-M"
    },
    {
      "employee": "Sarah Brown",
      "date": "2026-02-19",
      "orderId": "ORD-9047",
      "picksInRoute": 10,
      "routeLength": "10m 08s",
      "updatedRouteLength": "5.9m 03s",
      "timeSaved": "4m 05s",
      "sameRoute": "HM-TSHIRT-M"
    }
  ],
  "PPO-005": [
    {
      "employee": "Anna Johnson",
      "date": "2026-02-25",
      "orderId": "ORD-5982",
      "picksInRoute": 21,
      "routeLength": "5m 27s",
      "updatedRouteLength": "2.7m 09s",
      "timeSaved": "2m 18s",
      "sameRoute": "NEW-BALANCE-44"
    },
    {
      "employee": "Tom Davis",
      "date": "2026-02-24",
      "orderId": "ORD-6811",
      "picksInRoute": 21,
      "routeLength": "7m 50s",
      "updatedRouteLength": "4.7m 32s",
      "timeSaved": "2m 18s",
      "sameRoute": "NEW-BALANCE-44"
    },
    {
      "employee": "Anna Taylor",
      "date": "2026-02-23",
      "orderId": "ORD-4142",
      "picksInRoute": 8,
      "routeLength": "8m 50s",
      "updatedRouteLength": "5.7m 32s",
      "timeSaved": "2m 18s",
      "sameRoute": "NEW-BALANCE-44"
    },
    {
      "employee": "James Lee",
      "date": "2026-02-22",
      "orderId": "ORD-4300",
      "picksInRoute": 10,
      "routeLength": "4m 26s",
      "updatedRouteLength": "1.7000000000000002m 08s",
      "timeSaved": "2m 18s",
      "sameRoute": "NEW-BALANCE-44"
    },
    {
      "employee": "Emily Taylor",
      "date": "2026-02-21",
      "orderId": "ORD-2951",
      "picksInRoute": 13,
      "routeLength": "12m 31s",
      "updatedRouteLength": "9.7m 13s",
      "timeSaved": "2m 18s",
      "sameRoute": "NEW-BALANCE-44"
    },
    {
      "employee": "David Lee",
      "date": "2026-02-20",
      "orderId": "ORD-7987",
      "picksInRoute": 10,
      "routeLength": "4m 21s",
      "updatedRouteLength": "1.7000000000000002m 03s",
      "timeSaved": "2m 18s",
      "sameRoute": "NEW-BALANCE-44"
    },
    {
      "employee": "Chris Brown",
      "date": "2026-02-19",
      "orderId": "ORD-7406",
      "picksInRoute": 17,
      "routeLength": "4m 05s",
      "updatedRouteLength": "1.7000000000000002m 00s",
      "timeSaved": "2m 18s",
      "sameRoute": "NEW-BALANCE-44"
    },
    {
      "employee": "Chris Taylor",
      "date": "2026-02-18",
      "orderId": "ORD-3315",
      "picksInRoute": 23,
      "routeLength": "9m 19s",
      "updatedRouteLength": "6.7m 01s",
      "timeSaved": "2m 18s",
      "sameRoute": "NEW-BALANCE-44"
    }
  ],
  "PPO-004": [
    {
      "employee": "Maria Johnson",
      "date": "2026-02-25",
      "orderId": "ORD-2219",
      "picksInRoute": 15,
      "routeLength": "10m 16s",
      "updatedRouteLength": "8.4m 00s",
      "timeSaved": "1m 36s",
      "sameRoute": "SAUCONY-JAZZ-40"
    },
    {
      "employee": "Sarah Martinez",
      "date": "2026-02-24",
      "orderId": "ORD-9686",
      "picksInRoute": 18,
      "routeLength": "7m 34s",
      "updatedRouteLength": "5.4m 00s",
      "timeSaved": "1m 36s",
      "sameRoute": "SAUCONY-JAZZ-40"
    },
    {
      "employee": "Sarah Garcia",
      "date": "2026-02-23",
      "orderId": "ORD-9513",
      "picksInRoute": 17,
      "routeLength": "7m 05s",
      "updatedRouteLength": "5.4m 00s",
      "timeSaved": "1m 36s",
      "sameRoute": "SAUCONY-JAZZ-40"
    },
    {
      "employee": "Lisa Chen",
      "date": "2026-02-22",
      "orderId": "ORD-9636",
      "picksInRoute": 15,
      "routeLength": "7m 14s",
      "updatedRouteLength": "5.4m 00s",
      "timeSaved": "1m 36s",
      "sameRoute": "SAUCONY-JAZZ-40"
    },
    {
      "employee": "Chris Taylor",
      "date": "2026-02-21",
      "orderId": "ORD-3854",
      "picksInRoute": 23,
      "routeLength": "8m 50s",
      "updatedRouteLength": "6.4m 14s",
      "timeSaved": "1m 36s",
      "sameRoute": "SAUCONY-JAZZ-40"
    },
    {
      "employee": "Anna Johnson",
      "date": "2026-02-20",
      "orderId": "ORD-8538",
      "picksInRoute": 25,
      "routeLength": "5m 07s",
      "updatedRouteLength": "3.4m 00s",
      "timeSaved": "1m 36s",
      "sameRoute": "SAUCONY-JAZZ-40"
    }
  ],
  "TPO-003": [
    {
      "employee": "Lisa Taylor",
      "date": "2026-02-25",
      "orderId": "ORD-2926",
      "picksInRoute": 25,
      "routeLength": "12m 58s",
      "updatedRouteLength": "6.2m 10s",
      "timeSaved": "5m 48s",
      "sameRoute": "CONVERSE-ALLSTAR-41"
    },
    {
      "employee": "Emily Martinez",
      "date": "2026-02-24",
      "orderId": "ORD-1010",
      "picksInRoute": 11,
      "routeLength": "8m 55s",
      "updatedRouteLength": "2.2m 07s",
      "timeSaved": "5m 48s",
      "sameRoute": "CONVERSE-ALLSTAR-41"
    },
    {
      "employee": "Maria Johnson",
      "date": "2026-02-23",
      "orderId": "ORD-1826",
      "picksInRoute": 23,
      "routeLength": "8m 07s",
      "updatedRouteLength": "2.2m 00s",
      "timeSaved": "5m 48s",
      "sameRoute": "CONVERSE-ALLSTAR-41"
    },
    {
      "employee": "David Johnson",
      "date": "2026-02-22",
      "orderId": "ORD-2782",
      "picksInRoute": 8,
      "routeLength": "8m 32s",
      "updatedRouteLength": "2.2m 00s",
      "timeSaved": "5m 48s",
      "sameRoute": "CONVERSE-ALLSTAR-41"
    }
  ],
  "TPO-001": [
    {
      "employee": "Sarah Smith",
      "date": "2026-02-25",
      "orderId": "ORD-7584",
      "picksInRoute": 10,
      "routeLength": "7m 29s",
      "updatedRouteLength": "2m 29s",
      "timeSaved": "5m 00s",
      "sameRoute": "ASICS-GEL-43"
    },
    {
      "employee": "Chris Chen",
      "date": "2026-02-24",
      "orderId": "ORD-5377",
      "picksInRoute": 18,
      "routeLength": "7m 16s",
      "updatedRouteLength": "2m 16s",
      "timeSaved": "5m 00s",
      "sameRoute": "ASICS-GEL-43"
    },
    {
      "employee": "Maria Davis",
      "date": "2026-02-23",
      "orderId": "ORD-8900",
      "picksInRoute": 15,
      "routeLength": "12m 31s",
      "updatedRouteLength": "7m 31s",
      "timeSaved": "5m 00s",
      "sameRoute": "ASICS-GEL-43"
    }
  ],
  "TPO-005": [
    {
      "employee": "John Davis",
      "date": "2026-02-25",
      "orderId": "ORD-6873",
      "picksInRoute": 18,
      "routeLength": "7m 50s",
      "updatedRouteLength": "2.0999999999999996m 00s",
      "timeSaved": "4m 54s",
      "sameRoute": "HM-TSHIRT-XL"
    },
    {
      "employee": "Lisa Johnson",
      "date": "2026-02-24",
      "orderId": "ORD-7475",
      "picksInRoute": 25,
      "routeLength": "10m 04s",
      "updatedRouteLength": "5.1m 00s",
      "timeSaved": "4m 54s",
      "sameRoute": "HM-TSHIRT-XL"
    },
    {
      "employee": "Sarah Smith",
      "date": "2026-02-23",
      "orderId": "ORD-1628",
      "picksInRoute": 24,
      "routeLength": "3m 45s",
      "updatedRouteLength": "0m 00s",
      "timeSaved": "4m 54s",
      "sameRoute": "HM-TSHIRT-XL"
    }
  ],
  "TPO-002": [
    {
      "employee": "Mike Lee",
      "date": "2026-02-25",
      "orderId": "ORD-8269",
      "picksInRoute": 17,
      "routeLength": "10m 17s",
      "updatedRouteLength": "6.8m 05s",
      "timeSaved": "3m 12s",
      "sameRoute": "ADIDAS-ULTRA-41"
    },
    {
      "employee": "Chris Johnson",
      "date": "2026-02-24",
      "orderId": "ORD-9072",
      "picksInRoute": 11,
      "routeLength": "8m 30s",
      "updatedRouteLength": "4.8m 18s",
      "timeSaved": "3m 12s",
      "sameRoute": "ADIDAS-ULTRA-41"
    },
    {
      "employee": "John Wilson",
      "date": "2026-02-23",
      "orderId": "ORD-4294",
      "picksInRoute": 10,
      "routeLength": "11m 46s",
      "updatedRouteLength": "7.8m 34s",
      "timeSaved": "3m 12s",
      "sameRoute": "ADIDAS-ULTRA-41"
    }
  ],
  "TPO-004": [
    {
      "employee": "Tom Davis",
      "date": "2026-02-25",
      "orderId": "ORD-1948",
      "picksInRoute": 12,
      "routeLength": "9m 54s",
      "updatedRouteLength": "6m 54s",
      "timeSaved": "3m 00s",
      "sameRoute": "SAUCONY-JAZZ-40"
    },
    {
      "employee": "Sarah Wilson",
      "date": "2026-02-24",
      "orderId": "ORD-3671",
      "picksInRoute": 17,
      "routeLength": "7m 02s",
      "updatedRouteLength": "4m 02s",
      "timeSaved": "3m 00s",
      "sameRoute": "SAUCONY-JAZZ-40"
    },
    {
      "employee": "Tom Davis",
      "date": "2026-02-23",
      "orderId": "ORD-5455",
      "picksInRoute": 12,
      "routeLength": "12m 00s",
      "updatedRouteLength": "9m 00s",
      "timeSaved": "3m 00s",
      "sameRoute": "SAUCONY-JAZZ-40"
    },
    {
      "employee": "Anna Johnson",
      "date": "2026-02-22",
      "orderId": "ORD-7933",
      "picksInRoute": 25,
      "routeLength": "4m 21s",
      "updatedRouteLength": "1m 21s",
      "timeSaved": "3m 00s",
      "sameRoute": "SAUCONY-JAZZ-40"
    }
  ]
}

// ─── Mock Data: Delays for Alternative Location ───────────────────────────────
// These are trips that would be negatively affected if the alternative location is used
export const DELAY_DATA = {
  "SPO-007": {
    // SKU: SAUCONY-JAZZ-40, moving from B-16-03 to A-8-10
    // Delays for routes that currently use Zone A locations that would be displaced
    frequency: { days7: 8, days30: 32, days90: 96 },
    avgDelayMinutes: 2.1,
    trips: [
      {
        "employee": "Mike Chen",
        "date": "2026-02-25",
        "orderId": "ORD-7123",
        "picksInRoute": 18,
        "currentRouteLength": "4m 15s",
        "alternativeRouteLength": "6m 25s",
        "timeAdded": "2m 10s",
        "affectedSku": "NIKE-AIR-42"
      },
      {
        "employee": "Sarah Jones",
        "date": "2026-02-24",
        "orderId": "ORD-8456",
        "picksInRoute": 14,
        "currentRouteLength": "5m 30s",
        "alternativeRouteLength": "7m 45s",
        "timeAdded": "2m 15s",
        "affectedSku": "ADIDAS-RUN-39"
      },
      {
        "employee": "Tom Wilson",
        "date": "2026-02-23",
        "orderId": "ORD-9012",
        "picksInRoute": 22,
        "currentRouteLength": "3m 45s",
        "alternativeRouteLength": "5m 50s",
        "timeAdded": "2m 05s",
        "affectedSku": "PUMA-SPORT-41"
      },
      {
        "employee": "Lisa Brown",
        "date": "2026-02-22",
        "orderId": "ORD-3456",
        "picksInRoute": 16,
        "currentRouteLength": "6m 20s",
        "alternativeRouteLength": "8m 35s",
        "timeAdded": "2m 15s",
        "affectedSku": "NB-WALK-43"
      },
      {
        "employee": "James Taylor",
        "date": "2026-02-21",
        "orderId": "ORD-5678",
        "picksInRoute": 19,
        "currentRouteLength": "4m 50s",
        "alternativeRouteLength": "7m 00s",
        "timeAdded": "2m 10s",
        "affectedSku": "REEBOK-CROSS-40"
      }
    ]
  },
  "SPO-003": {
    // SKU: ASICS-GEL-43, moving from B-11-01 to A-3-10
    frequency: { days7: 6, days30: 24, days90: 72 },
    avgDelayMinutes: 1.8,
    trips: [
      {
        "employee": "Emily Davis",
        "date": "2026-02-25",
        "orderId": "ORD-2345",
        "picksInRoute": 20,
        "currentRouteLength": "5m 10s",
        "alternativeRouteLength": "6m 55s",
        "timeAdded": "1m 45s",
        "affectedSku": "CONVERSE-CT-42"
      },
      {
        "employee": "Robert Kim",
        "date": "2026-02-24",
        "orderId": "ORD-6789",
        "picksInRoute": 15,
        "currentRouteLength": "4m 30s",
        "alternativeRouteLength": "6m 25s",
        "timeAdded": "1m 55s",
        "affectedSku": "VANS-OLD-41"
      },
      {
        "employee": "Anna Lee",
        "date": "2026-02-23",
        "orderId": "ORD-1122",
        "picksInRoute": 18,
        "currentRouteLength": "3m 55s",
        "alternativeRouteLength": "5m 40s",
        "timeAdded": "1m 45s",
        "affectedSku": "DC-SHOES-40"
      }
    ]
  },
  "SPO-008": {
    // SKU: CONVERSE-ALLSTAR-41, moving from B-19-02 to A-8-4
    frequency: { days7: 10, days30: 40, days90: 120 },
    avgDelayMinutes: 2.3,
    trips: [
      {
        "employee": "Chris Martin",
        "date": "2026-02-25",
        "orderId": "ORD-4455",
        "picksInRoute": 24,
        "currentRouteLength": "6m 30s",
        "alternativeRouteLength": "9m 05s",
        "timeAdded": "2m 35s",
        "affectedSku": "JORDAN-AIR-44"
      },
      {
        "employee": "Diana Ross",
        "date": "2026-02-24",
        "orderId": "ORD-7788",
        "picksInRoute": 17,
        "currentRouteLength": "5m 15s",
        "alternativeRouteLength": "7m 30s",
        "timeAdded": "2m 15s",
        "affectedSku": "YEEZY-BOOST-42"
      }
    ]
  },
  "SPO-001": {
    // SKU: REEBOK-CROSS-38, LOW demand in Zone A - moving OUT would free up space
    // This is a "costs" item - the delays shown are for routes that benefit from current location
    frequency: { days7: 3, days30: 12, days90: 36 },
    avgDelayMinutes: -1.5, // Negative means removing this SKU from A would IMPROVE routes
    trips: [
      {
        "employee": "John Smith",
        "date": "2026-02-25",
        "orderId": "ORD-9988",
        "picksInRoute": 12,
        "currentRouteLength": "8m 20s",
        "alternativeRouteLength": "6m 50s",
        "timeAdded": "-1m 30s", // Actually a savings
        "affectedSku": "HIGH-DEMAND-SKU-01"
      },
      {
        "employee": "Mary Johnson",
        "date": "2026-02-24",
        "orderId": "ORD-8877",
        "picksInRoute": 15,
        "currentRouteLength": "7m 45s",
        "alternativeRouteLength": "6m 15s",
        "timeAdded": "-1m 30s",
        "affectedSku": "HIGH-DEMAND-SKU-02"
      }
    ]
  }
}

// ─── Mock Data: Alternative Location Details ───────────────────────────────
// Maps locations to the SKU currently there and trip impact data
export const ALTERNATIVE_LOCATION_DATA = {
  // For SPO-007: SAUCONY-JAZZ-40 moving from B-16-03
  "A-8-10": {
    currentSku: "NIKE-AIR-MAX-42",
    inventoryUnits: 45,
    frequency: { days7: 8, days30: 32, days90: 96 },
    avgImpactMinutes: 2.1,
    trips: [
      { employee: "Mike Chen", date: "2026-02-25", orderId: "ORD-7123", picksInRoute: 18, currentRouteLength: "4m 15s", alternativeRouteLength: "6m 25s", timeAdded: "2m 10s" },
      { employee: "Sarah Jones", date: "2026-02-24", orderId: "ORD-8456", picksInRoute: 14, currentRouteLength: "5m 30s", alternativeRouteLength: "7m 45s", timeAdded: "2m 15s" },
      { employee: "Tom Wilson", date: "2026-02-23", orderId: "ORD-9012", picksInRoute: 22, currentRouteLength: "3m 45s", alternativeRouteLength: "5m 50s", timeAdded: "2m 05s" },
      { employee: "Lisa Brown", date: "2026-02-22", orderId: "ORD-3456", picksInRoute: 16, currentRouteLength: "6m 20s", alternativeRouteLength: "8m 35s", timeAdded: "2m 15s" },
      { employee: "James Taylor", date: "2026-02-21", orderId: "ORD-5678", picksInRoute: 19, currentRouteLength: "4m 50s", alternativeRouteLength: "7m 00s", timeAdded: "2m 10s" }
    ]
  },
  "A-5-8": {
    currentSku: "ADIDAS-ULTRA-41",
    inventoryUnits: 30,
    frequency: { days7: 6, days30: 24, days90: 72 },
    avgImpactMinutes: 1.8,
    trips: [
      { employee: "Emily Davis", date: "2026-02-25", orderId: "ORD-2345", picksInRoute: 20, currentRouteLength: "5m 10s", alternativeRouteLength: "6m 55s", timeAdded: "1m 45s" },
      { employee: "Robert Kim", date: "2026-02-24", orderId: "ORD-6789", picksInRoute: 15, currentRouteLength: "4m 30s", alternativeRouteLength: "6m 25s", timeAdded: "1m 55s" },
      { employee: "Anna Lee", date: "2026-02-23", orderId: "ORD-1122", picksInRoute: 18, currentRouteLength: "3m 55s", alternativeRouteLength: "5m 40s", timeAdded: "1m 45s" }
    ]
  },
  "A-3-6": {
    currentSku: "PUMA-RS-X-40",
    inventoryUnits: 22,
    frequency: { days7: 5, days30: 20, days90: 60 },
    avgImpactMinutes: 1.5,
    trips: [
      { employee: "Chris Park", date: "2026-02-25", orderId: "ORD-5566", picksInRoute: 12, currentRouteLength: "4m 00s", alternativeRouteLength: "5m 30s", timeAdded: "1m 30s" },
      { employee: "Diana Lee", date: "2026-02-24", orderId: "ORD-4433", picksInRoute: 16, currentRouteLength: "5m 45s", alternativeRouteLength: "7m 15s", timeAdded: "1m 30s" },
      { employee: "Eric Chen", date: "2026-02-23", orderId: "ORD-3322", picksInRoute: 14, currentRouteLength: "3m 30s", alternativeRouteLength: "5m 00s", timeAdded: "1m 30s" }
    ]
  },
  // For SPO-003: ASICS-GEL-43 moving from B-11-01
  "A-3-10": {
    currentSku: "VANS-OLD-SKOOL-42",
    inventoryUnits: 30,
    frequency: { days7: 6, days30: 24, days90: 72 },
    avgImpactMinutes: 1.8,
    trips: [
      { employee: "Emily Davis", date: "2026-02-25", orderId: "ORD-2345", picksInRoute: 20, currentRouteLength: "5m 10s", alternativeRouteLength: "6m 55s", timeAdded: "1m 45s" },
      { employee: "Robert Kim", date: "2026-02-24", orderId: "ORD-6789", picksInRoute: 15, currentRouteLength: "4m 30s", alternativeRouteLength: "6m 25s", timeAdded: "1m 55s" },
      { employee: "Anna Lee", date: "2026-02-23", orderId: "ORD-1122", picksInRoute: 18, currentRouteLength: "3m 55s", alternativeRouteLength: "5m 40s", timeAdded: "1m 45s" }
    ]
  }
}

// ─── Mock Data: Product Pairs Trip Data ───────────────────────────────────────
export const PRODUCT_PAIRS_TRIP_DATA = {
  "PPO-001": {
    table1: [
      { tripId: "TR-P001-001", employee: "Lisa Smith", date: "2026-02-25", orderId: "ORD-3552", picks: 9, difference: "picks A+B instead of A", duration: "12m 25s", timeDifferenceMinutes: -3.8 },
      { tripId: "TR-P001-002", employee: "Mike Chen", date: "2026-02-24", orderId: "ORD-4271", picks: 14, difference: "picks A+B instead of B", duration: "9m 40s", timeDifferenceMinutes: -4.1 },
      { tripId: "TR-P001-003", employee: "Sara Jones", date: "2026-02-23", orderId: "ORD-5183", picks: 11, difference: "picks A+B instead of A", duration: "11m 15s", timeDifferenceMinutes: -3.5 },
      { tripId: "TR-P001-004", employee: "Tom Brown", date: "2026-02-22", orderId: "ORD-6094", picks: 8, difference: "picks A+B instead of B", duration: "8m 50s", timeDifferenceMinutes: -4.6 },
      { tripId: "TR-P001-005", employee: "Amy Wilson", date: "2026-02-21", orderId: "ORD-7015", picks: 16, difference: "picks A+B instead of A", duration: "14m 30s", timeDifferenceMinutes: -3.2 },
      { tripId: "TR-P001-006", employee: "Lisa Smith", date: "2026-02-20", orderId: "ORD-7936", picks: 12, difference: "picks A+B instead of B", duration: "10m 05s", timeDifferenceMinutes: -3.9 },
      { tripId: "TR-P001-007", employee: "Carlos Diaz", date: "2026-02-19", orderId: "ORD-8847", picks: 10, difference: "picks A+B instead of A", duration: "11m 55s", timeDifferenceMinutes: -3.4 }
    ],
    table2: [
      { tripId: "TR-P001-C01", employee: "Mike Chen", date: "2026-02-25", orderId: "ORD-7123", picks: 18, difference: "picks C at B instead of C", duration: "6m 25s", timeDifferenceMinutes: 2.1 },
      { tripId: "TR-P001-C02", employee: "Amy Wilson", date: "2026-02-23", orderId: "ORD-8034", picks: 22, difference: "picks C at B instead of C", duration: "7m 10s", timeDifferenceMinutes: 1.9 },
      { tripId: "TR-P001-C03", employee: "Tom Brown", date: "2026-02-20", orderId: "ORD-9145", picks: 15, difference: "picks C at B instead of C", duration: "5m 50s", timeDifferenceMinutes: 2.3 }
    ]
  },
  "PPO-002": {
    table1: [
      { tripId: "TR-P002-001", employee: "Carlos Diaz", date: "2026-02-25", orderId: "ORD-3601", picks: 11, difference: "picks A+B instead of A", duration: "13m 10s", timeDifferenceMinutes: -4.2 },
      { tripId: "TR-P002-002", employee: "Sara Jones", date: "2026-02-24", orderId: "ORD-4512", picks: 9, difference: "picks A+B instead of B", duration: "10m 30s", timeDifferenceMinutes: -4.5 },
      { tripId: "TR-P002-003", employee: "Lisa Smith", date: "2026-02-23", orderId: "ORD-5423", picks: 15, difference: "picks A+B instead of A", duration: "12m 45s", timeDifferenceMinutes: -3.9 },
      { tripId: "TR-P002-004", employee: "Mike Chen", date: "2026-02-22", orderId: "ORD-6334", picks: 13, difference: "picks A+B instead of B", duration: "9m 20s", timeDifferenceMinutes: -4.7 },
      { tripId: "TR-P002-005", employee: "Amy Wilson", date: "2026-02-21", orderId: "ORD-7245", picks: 7, difference: "picks A+B instead of A", duration: "11m 00s", timeDifferenceMinutes: -3.6 },
      { tripId: "TR-P002-006", employee: "Tom Brown", date: "2026-02-20", orderId: "ORD-8156", picks: 18, difference: "picks A+B instead of B", duration: "14m 15s", timeDifferenceMinutes: -4.1 },
      { tripId: "TR-P002-007", employee: "Carlos Diaz", date: "2026-02-19", orderId: "ORD-9067", picks: 10, difference: "picks A+B instead of A", duration: "12m 35s", timeDifferenceMinutes: -3.8 },
      { tripId: "TR-P002-008", employee: "Sara Jones", date: "2026-02-18", orderId: "ORD-9978", picks: 12, difference: "picks A+B instead of B", duration: "10m 50s", timeDifferenceMinutes: -4.0 }
    ],
    table2: [
      { tripId: "TR-P002-C01", employee: "Tom Brown", date: "2026-02-25", orderId: "ORD-7234", picks: 20, difference: "picks C at B instead of C", duration: "6m 40s", timeDifferenceMinutes: 2.2 },
      { tripId: "TR-P002-C02", employee: "Lisa Smith", date: "2026-02-22", orderId: "ORD-8345", picks: 17, difference: "picks C at B instead of C", duration: "5m 55s", timeDifferenceMinutes: 1.8 },
      { tripId: "TR-P002-C03", employee: "Carlos Diaz", date: "2026-02-20", orderId: "ORD-9456", picks: 24, difference: "picks C at B instead of C", duration: "7m 20s", timeDifferenceMinutes: 2.4 },
      { tripId: "TR-P002-C04", employee: "Mike Chen", date: "2026-02-18", orderId: "ORD-1567", picks: 19, difference: "picks C at B instead of C", duration: "6m 10s", timeDifferenceMinutes: 2.0 }
    ]
  },
  "PPO-003": {
    table1: [
      { tripId: "TR-P003-001", employee: "Amy Wilson", date: "2026-02-25", orderId: "ORD-3650", picks: 10, difference: "picks A+B instead of A", duration: "11m 50s", timeDifferenceMinutes: -3.7 },
      { tripId: "TR-P003-002", employee: "Tom Brown", date: "2026-02-24", orderId: "ORD-4561", picks: 13, difference: "picks A+B instead of B", duration: "9m 15s", timeDifferenceMinutes: -4.3 },
      { tripId: "TR-P003-003", employee: "Lisa Smith", date: "2026-02-23", orderId: "ORD-5472", picks: 8, difference: "picks A+B instead of A", duration: "12m 20s", timeDifferenceMinutes: -3.4 },
      { tripId: "TR-P003-004", employee: "Mike Chen", date: "2026-02-22", orderId: "ORD-6383", picks: 16, difference: "picks A+B instead of B", duration: "10m 40s", timeDifferenceMinutes: -4.1 },
      { tripId: "TR-P003-005", employee: "Carlos Diaz", date: "2026-02-21", orderId: "ORD-7294", picks: 11, difference: "picks A+B instead of A", duration: "11m 05s", timeDifferenceMinutes: -3.9 },
      { tripId: "TR-P003-006", employee: "Sara Jones", date: "2026-02-20", orderId: "ORD-8205", picks: 14, difference: "picks A+B instead of B", duration: "9m 50s", timeDifferenceMinutes: -4.4 },
      { tripId: "TR-P003-007", employee: "Amy Wilson", date: "2026-02-19", orderId: "ORD-9116", picks: 9, difference: "picks A+B instead of A", duration: "12m 00s", timeDifferenceMinutes: -3.6 }
    ],
    table2: [
      { tripId: "TR-P003-C01", employee: "Sara Jones", date: "2026-02-24", orderId: "ORD-7345", picks: 21, difference: "picks C at B instead of C", duration: "6m 05s", timeDifferenceMinutes: 1.9 },
      { tripId: "TR-P003-C02", employee: "Tom Brown", date: "2026-02-21", orderId: "ORD-8456", picks: 16, difference: "picks C at B instead of C", duration: "5m 45s", timeDifferenceMinutes: 1.7 },
      { tripId: "TR-P003-C03", employee: "Amy Wilson", date: "2026-02-19", orderId: "ORD-9567", picks: 23, difference: "picks C at B instead of C", duration: "7m 00s", timeDifferenceMinutes: 2.2 }
    ]
  },
  "PPO-004": {
    table1: [
      { tripId: "TR-P004-001", employee: "Mike Chen", date: "2026-02-25", orderId: "ORD-3700", picks: 8, difference: "picks A+B instead of A", duration: "9m 30s", timeDifferenceMinutes: -1.4 },
      { tripId: "TR-P004-002", employee: "Lisa Smith", date: "2026-02-24", orderId: "ORD-4611", picks: 12, difference: "picks A+B instead of B", duration: "7m 50s", timeDifferenceMinutes: -1.7 },
      { tripId: "TR-P004-003", employee: "Carlos Diaz", date: "2026-02-23", orderId: "ORD-5522", picks: 10, difference: "picks A+B instead of A", duration: "10m 15s", timeDifferenceMinutes: -1.5 },
      { tripId: "TR-P004-004", employee: "Sara Jones", date: "2026-02-22", orderId: "ORD-6433", picks: 14, difference: "picks A+B instead of B", duration: "8m 40s", timeDifferenceMinutes: -1.8 },
      { tripId: "TR-P004-005", employee: "Tom Brown", date: "2026-02-21", orderId: "ORD-7344", picks: 9, difference: "picks A+B instead of A", duration: "9m 55s", timeDifferenceMinutes: -1.6 },
      { tripId: "TR-P004-006", employee: "Amy Wilson", date: "2026-02-20", orderId: "ORD-8255", picks: 11, difference: "picks A+B instead of B", duration: "8m 10s", timeDifferenceMinutes: -1.9 },
      { tripId: "TR-P004-007", employee: "Mike Chen", date: "2026-02-19", orderId: "ORD-9166", picks: 7, difference: "picks A+B instead of A", duration: "10m 00s", timeDifferenceMinutes: -1.3 }
    ],
    table2: [
      { tripId: "TR-P004-C01", employee: "Carlos Diaz", date: "2026-02-25", orderId: "ORD-7456", picks: 19, difference: "picks C at B instead of C", duration: "5m 30s", timeDifferenceMinutes: 1.5 },
      { tripId: "TR-P004-C02", employee: "Sara Jones", date: "2026-02-22", orderId: "ORD-8567", picks: 14, difference: "picks C at B instead of C", duration: "4m 55s", timeDifferenceMinutes: 1.3 },
      { tripId: "TR-P004-C03", employee: "Lisa Smith", date: "2026-02-20", orderId: "ORD-9678", picks: 22, difference: "picks C at B instead of C", duration: "6m 20s", timeDifferenceMinutes: 1.7 }
    ]
  },
  "PPO-005": {
    table1: [
      { tripId: "TR-P005-001", employee: "Sara Jones", date: "2026-02-25", orderId: "ORD-3749", picks: 9, difference: "picks A+B instead of A", duration: "10m 20s", timeDifferenceMinutes: -2.1 },
      { tripId: "TR-P005-002", employee: "Carlos Diaz", date: "2026-02-24", orderId: "ORD-4660", picks: 13, difference: "picks A+B instead of B", duration: "8m 35s", timeDifferenceMinutes: -2.4 },
      { tripId: "TR-P005-003", employee: "Amy Wilson", date: "2026-02-23", orderId: "ORD-5571", picks: 11, difference: "picks A+B instead of A", duration: "11m 00s", timeDifferenceMinutes: -2.0 },
      { tripId: "TR-P005-004", employee: "Tom Brown", date: "2026-02-22", orderId: "ORD-6482", picks: 7, difference: "picks A+B instead of B", duration: "7m 50s", timeDifferenceMinutes: -2.5 },
      { tripId: "TR-P005-005", employee: "Mike Chen", date: "2026-02-21", orderId: "ORD-7393", picks: 15, difference: "picks A+B instead of A", duration: "12m 40s", timeDifferenceMinutes: -1.9 },
      { tripId: "TR-P005-006", employee: "Lisa Smith", date: "2026-02-20", orderId: "ORD-8304", picks: 10, difference: "picks A+B instead of B", duration: "9m 05s", timeDifferenceMinutes: -2.3 },
      { tripId: "TR-P005-007", employee: "Sara Jones", date: "2026-02-19", orderId: "ORD-9215", picks: 12, difference: "picks A+B instead of A", duration: "10m 50s", timeDifferenceMinutes: -2.2 }
    ],
    table2: [
      { tripId: "TR-P005-C01", employee: "Amy Wilson", date: "2026-02-25", orderId: "ORD-7567", picks: 18, difference: "picks C at B instead of C", duration: "5m 15s", timeDifferenceMinutes: 1.4 },
      { tripId: "TR-P005-C02", employee: "Carlos Diaz", date: "2026-02-22", orderId: "ORD-8678", picks: 13, difference: "picks C at B instead of C", duration: "4m 40s", timeDifferenceMinutes: 1.2 },
      { tripId: "TR-P005-C03", employee: "Tom Brown", date: "2026-02-19", orderId: "ORD-9789", picks: 21, difference: "picks C at B instead of C", duration: "6m 00s", timeDifferenceMinutes: 1.6 }
    ]
  },
  "PPO-006": {
    table1: [
      { tripId: "TR-P006-001", employee: "Tom Brown", date: "2026-02-25", orderId: "ORD-3798", picks: 12, difference: "picks A+B instead of A", duration: "13m 45s", timeDifferenceMinutes: -4.3 },
      { tripId: "TR-P006-002", employee: "Amy Wilson", date: "2026-02-24", orderId: "ORD-4709", picks: 10, difference: "picks A+B instead of B", duration: "11m 00s", timeDifferenceMinutes: -4.6 },
      { tripId: "TR-P006-003", employee: "Carlos Diaz", date: "2026-02-23", orderId: "ORD-5620", picks: 14, difference: "picks A+B instead of A", duration: "12m 20s", timeDifferenceMinutes: -4.0 },
      { tripId: "TR-P006-004", employee: "Sara Jones", date: "2026-02-22", orderId: "ORD-6531", picks: 8, difference: "picks A+B instead of B", duration: "9m 35s", timeDifferenceMinutes: -4.8 },
      { tripId: "TR-P006-005", employee: "Lisa Smith", date: "2026-02-21", orderId: "ORD-7442", picks: 17, difference: "picks A+B instead of A", duration: "14m 50s", timeDifferenceMinutes: -3.7 },
      { tripId: "TR-P006-006", employee: "Mike Chen", date: "2026-02-20", orderId: "ORD-8353", picks: 11, difference: "picks A+B instead of B", duration: "10m 25s", timeDifferenceMinutes: -4.2 },
      { tripId: "TR-P006-007", employee: "Tom Brown", date: "2026-02-19", orderId: "ORD-9264", picks: 9, difference: "picks A+B instead of A", duration: "12m 55s", timeDifferenceMinutes: -3.9 }
    ],
    table2: [
      { tripId: "TR-P006-C01", employee: "Lisa Smith", date: "2026-02-25", orderId: "ORD-7678", picks: 23, difference: "picks C at B instead of C", duration: "7m 05s", timeDifferenceMinutes: 2.3 },
      { tripId: "TR-P006-C02", employee: "Mike Chen", date: "2026-02-22", orderId: "ORD-8789", picks: 18, difference: "picks C at B instead of C", duration: "6m 20s", timeDifferenceMinutes: 2.0 },
      { tripId: "TR-P006-C03", employee: "Amy Wilson", date: "2026-02-20", orderId: "ORD-9890", picks: 25, difference: "picks C at B instead of C", duration: "7m 45s", timeDifferenceMinutes: 2.5 },
      { tripId: "TR-P006-C04", employee: "Carlos Diaz", date: "2026-02-18", orderId: "ORD-1901", picks: 20, difference: "picks C at B instead of C", duration: "6m 50s", timeDifferenceMinutes: 2.2 }
    ]
  },
  "PPO-007": {
    table1: [
      { tripId: "TR-P007-001", employee: "Lisa Smith", date: "2026-02-25", orderId: "ORD-3847", picks: 11, difference: "picks A+B instead of A", duration: "12m 55s", timeDifferenceMinutes: -4.1 },
      { tripId: "TR-P007-002", employee: "Tom Brown", date: "2026-02-24", orderId: "ORD-4758", picks: 9, difference: "picks A+B instead of B", duration: "10m 10s", timeDifferenceMinutes: -4.4 },
      { tripId: "TR-P007-003", employee: "Mike Chen", date: "2026-02-23", orderId: "ORD-5669", picks: 14, difference: "picks A+B instead of A", duration: "12m 30s", timeDifferenceMinutes: -3.8 },
      { tripId: "TR-P007-004", employee: "Sara Jones", date: "2026-02-22", orderId: "ORD-6580", picks: 12, difference: "picks A+B instead of B", duration: "9m 45s", timeDifferenceMinutes: -4.6 },
      { tripId: "TR-P007-005", employee: "Amy Wilson", date: "2026-02-21", orderId: "ORD-7491", picks: 16, difference: "picks A+B instead of A", duration: "14m 20s", timeDifferenceMinutes: -3.5 },
      { tripId: "TR-P007-006", employee: "Carlos Diaz", date: "2026-02-20", orderId: "ORD-8402", picks: 10, difference: "picks A+B instead of B", duration: "10m 40s", timeDifferenceMinutes: -4.3 },
      { tripId: "TR-P007-007", employee: "Lisa Smith", date: "2026-02-19", orderId: "ORD-9313", picks: 8, difference: "picks A+B instead of A", duration: "12m 05s", timeDifferenceMinutes: -4.0 }
    ],
    table2: [
      { tripId: "TR-P007-C01", employee: "Sara Jones", date: "2026-02-25", orderId: "ORD-7789", picks: 22, difference: "picks C at B instead of C", duration: "6m 50s", timeDifferenceMinutes: 2.1 },
      { tripId: "TR-P007-C02", employee: "Tom Brown", date: "2026-02-22", orderId: "ORD-8890", picks: 17, difference: "picks C at B instead of C", duration: "6m 05s", timeDifferenceMinutes: 1.8 },
      { tripId: "TR-P007-C03", employee: "Mike Chen", date: "2026-02-19", orderId: "ORD-9901", picks: 20, difference: "picks C at B instead of C", duration: "7m 15s", timeDifferenceMinutes: 2.3 }
    ]
  },
  "PPO-008": {
    table1: [
      { tripId: "TR-P008-001", employee: "Carlos Diaz", date: "2026-02-25", orderId: "ORD-3896", picks: 10, difference: "picks A+B instead of A", duration: "11m 40s", timeDifferenceMinutes: -3.8 },
      { tripId: "TR-P008-002", employee: "Amy Wilson", date: "2026-02-24", orderId: "ORD-4807", picks: 8, difference: "picks A+B instead of B", duration: "9m 00s", timeDifferenceMinutes: -4.2 },
      { tripId: "TR-P008-003", employee: "Sara Jones", date: "2026-02-23", orderId: "ORD-5718", picks: 13, difference: "picks A+B instead of A", duration: "12m 10s", timeDifferenceMinutes: -3.5 },
      { tripId: "TR-P008-004", employee: "Mike Chen", date: "2026-02-22", orderId: "ORD-6629", picks: 11, difference: "picks A+B instead of B", duration: "9m 30s", timeDifferenceMinutes: -4.0 },
      { tripId: "TR-P008-005", employee: "Lisa Smith", date: "2026-02-21", orderId: "ORD-7540", picks: 15, difference: "picks A+B instead of A", duration: "13m 55s", timeDifferenceMinutes: -3.3 },
      { tripId: "TR-P008-006", employee: "Tom Brown", date: "2026-02-20", orderId: "ORD-8451", picks: 9, difference: "picks A+B instead of B", duration: "8m 20s", timeDifferenceMinutes: -4.5 },
      { tripId: "TR-P008-007", employee: "Carlos Diaz", date: "2026-02-19", orderId: "ORD-9362", picks: 12, difference: "picks A+B instead of A", duration: "11m 25s", timeDifferenceMinutes: -3.7 }
    ],
    table2: [
      { tripId: "TR-P008-C01", employee: "Amy Wilson", date: "2026-02-25", orderId: "ORD-7890", picks: 20, difference: "picks C at B instead of C", duration: "6m 35s", timeDifferenceMinutes: 2.0 },
      { tripId: "TR-P008-C02", employee: "Sara Jones", date: "2026-02-22", orderId: "ORD-8901", picks: 15, difference: "picks C at B instead of C", duration: "5m 50s", timeDifferenceMinutes: 1.7 },
      { tripId: "TR-P008-C03", employee: "Carlos Diaz", date: "2026-02-19", orderId: "ORD-9012", picks: 23, difference: "picks C at B instead of C", duration: "7m 10s", timeDifferenceMinutes: 2.2 }
    ]
  },
  "PPO-009": {
    table1: [
      { tripId: "TR-P009-001", employee: "Mike Chen", date: "2026-02-25", orderId: "ORD-3945", picks: 10, difference: "picks A+B instead of A", duration: "11m 20s", timeDifferenceMinutes: -3.5 },
      { tripId: "TR-P009-002", employee: "Lisa Smith", date: "2026-02-24", orderId: "ORD-4856", picks: 13, difference: "picks A+B instead of B", duration: "9m 35s", timeDifferenceMinutes: -3.9 },
      { tripId: "TR-P009-003", employee: "Amy Wilson", date: "2026-02-23", orderId: "ORD-5767", picks: 9, difference: "picks A+B instead of A", duration: "11m 50s", timeDifferenceMinutes: -3.2 },
      { tripId: "TR-P009-004", employee: "Tom Brown", date: "2026-02-22", orderId: "ORD-6678", picks: 15, difference: "picks A+B instead of B", duration: "8m 50s", timeDifferenceMinutes: -4.1 },
      { tripId: "TR-P009-005", employee: "Sara Jones", date: "2026-02-21", orderId: "ORD-7589", picks: 11, difference: "picks A+B instead of A", duration: "12m 25s", timeDifferenceMinutes: -3.4 },
      { tripId: "TR-P009-006", employee: "Carlos Diaz", date: "2026-02-20", orderId: "ORD-8500", picks: 8, difference: "picks A+B instead of B", duration: "9m 10s", timeDifferenceMinutes: -3.8 },
      { tripId: "TR-P009-007", employee: "Mike Chen", date: "2026-02-19", orderId: "ORD-9411", picks: 14, difference: "picks A+B instead of A", duration: "11m 05s", timeDifferenceMinutes: -3.6 }
    ],
    table2: [
      { tripId: "TR-P009-C01", employee: "Tom Brown", date: "2026-02-25", orderId: "ORD-7901", picks: 19, difference: "picks C at B instead of C", duration: "6m 00s", timeDifferenceMinutes: 1.8 },
      { tripId: "TR-P009-C02", employee: "Amy Wilson", date: "2026-02-22", orderId: "ORD-8012", picks: 14, difference: "picks C at B instead of C", duration: "5m 25s", timeDifferenceMinutes: 1.5 },
      { tripId: "TR-P009-C03", employee: "Lisa Smith", date: "2026-02-19", orderId: "ORD-9123", picks: 22, difference: "picks C at B instead of C", duration: "6m 50s", timeDifferenceMinutes: 2.0 }
    ]
  },
  "PPO-010": {
    table1: [
      { tripId: "TR-P010-001", employee: "Sara Jones", date: "2026-02-25", orderId: "ORD-3994", picks: 9, difference: "picks A+B instead of A", duration: "10m 45s", timeDifferenceMinutes: -3.1 },
      { tripId: "TR-P010-002", employee: "Carlos Diaz", date: "2026-02-24", orderId: "ORD-4905", picks: 12, difference: "picks A+B instead of B", duration: "8m 55s", timeDifferenceMinutes: -3.5 },
      { tripId: "TR-P010-003", employee: "Tom Brown", date: "2026-02-23", orderId: "ORD-5816", picks: 10, difference: "picks A+B instead of A", duration: "11m 15s", timeDifferenceMinutes: -2.9 },
      { tripId: "TR-P010-004", employee: "Amy Wilson", date: "2026-02-22", orderId: "ORD-6727", picks: 14, difference: "picks A+B instead of B", duration: "9m 20s", timeDifferenceMinutes: -3.7 },
      { tripId: "TR-P010-005", employee: "Mike Chen", date: "2026-02-21", orderId: "ORD-7638", picks: 8, difference: "picks A+B instead of A", duration: "11m 40s", timeDifferenceMinutes: -2.8 },
      { tripId: "TR-P010-006", employee: "Lisa Smith", date: "2026-02-20", orderId: "ORD-8549", picks: 11, difference: "picks A+B instead of B", duration: "8m 35s", timeDifferenceMinutes: -3.4 },
      { tripId: "TR-P010-007", employee: "Sara Jones", date: "2026-02-19", orderId: "ORD-9460", picks: 13, difference: "picks A+B instead of A", duration: "10m 25s", timeDifferenceMinutes: -3.2 }
    ],
    table2: [
      { tripId: "TR-P010-C01", employee: "Carlos Diaz", date: "2026-02-25", orderId: "ORD-8023", picks: 17, difference: "picks C at B instead of C", duration: "5m 40s", timeDifferenceMinutes: 1.6 },
      { tripId: "TR-P010-C02", employee: "Tom Brown", date: "2026-02-22", orderId: "ORD-9134", picks: 21, difference: "picks C at B instead of C", duration: "6m 30s", timeDifferenceMinutes: 1.9 },
      { tripId: "TR-P010-C03", employee: "Amy Wilson", date: "2026-02-19", orderId: "ORD-1245", picks: 15, difference: "picks C at B instead of C", duration: "5m 05s", timeDifferenceMinutes: 1.4 }
    ]
  },
  "PPO-011": {
    table1: [
      { tripId: "TR-P011-001", employee: "Amy Wilson", date: "2026-02-25", orderId: "ORD-4043", picks: 8, difference: "picks A+B instead of A", duration: "9m 55s", timeDifferenceMinutes: -2.5 },
      { tripId: "TR-P011-002", employee: "Sara Jones", date: "2026-02-24", orderId: "ORD-4954", picks: 11, difference: "picks A+B instead of B", duration: "7m 50s", timeDifferenceMinutes: -2.8 },
      { tripId: "TR-P011-003", employee: "Carlos Diaz", date: "2026-02-23", orderId: "ORD-5865", picks: 9, difference: "picks A+B instead of A", duration: "10m 20s", timeDifferenceMinutes: -2.3 },
      { tripId: "TR-P011-004", employee: "Mike Chen", date: "2026-02-22", orderId: "ORD-6776", picks: 13, difference: "picks A+B instead of B", duration: "8m 10s", timeDifferenceMinutes: -3.0 },
      { tripId: "TR-P011-005", employee: "Tom Brown", date: "2026-02-21", orderId: "ORD-7687", picks: 10, difference: "picks A+B instead of A", duration: "10m 45s", timeDifferenceMinutes: -2.2 },
      { tripId: "TR-P011-006", employee: "Lisa Smith", date: "2026-02-20", orderId: "ORD-8598", picks: 7, difference: "picks A+B instead of B", duration: "7m 35s", timeDifferenceMinutes: -2.7 },
      { tripId: "TR-P011-007", employee: "Amy Wilson", date: "2026-02-19", orderId: "ORD-9509", picks: 12, difference: "picks A+B instead of A", duration: "9m 30s", timeDifferenceMinutes: -2.6 }
    ],
    table2: [
      { tripId: "TR-P011-C01", employee: "Mike Chen", date: "2026-02-25", orderId: "ORD-8134", picks: 16, difference: "picks C at B instead of C", duration: "5m 10s", timeDifferenceMinutes: 1.4 },
      { tripId: "TR-P011-C02", employee: "Carlos Diaz", date: "2026-02-22", orderId: "ORD-9245", picks: 20, difference: "picks C at B instead of C", duration: "6m 00s", timeDifferenceMinutes: 1.7 },
      { tripId: "TR-P011-C03", employee: "Tom Brown", date: "2026-02-19", orderId: "ORD-1356", picks: 13, difference: "picks C at B instead of C", duration: "4m 50s", timeDifferenceMinutes: 1.3 }
    ]
  }
}
