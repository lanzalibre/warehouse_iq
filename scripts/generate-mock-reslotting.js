#!/usr/bin/env node

/**
 * Generate Mock Reslotting Opportunities Script
 *
 * This script generates mock reslotting opportunity data for:
 * - Single products (SKUs that should be moved to reduce travel time)
 * - Product pairs (SKUs that are often ordered together)
 * - Product triplets (Three SKUs often ordered together)
 *
 * Usage: node scripts/generate-mock-reslotting.js
 */

import fs from 'fs'
import path from 'path'

// ─── Configuration ───────────────────────────────────────────────────────────────

const MOCK_DATA_FILE = path.join(__dirname, '../src/mockData.js')
const OUTPUT_DIR = path.join(__dirname, '../src/mockData.js')

// SKUs to use for generation
const SKUS = [
  'NB-574-41', 'NB-530-42', 'NB-996-43', 'NB-550-38',
  'ADIDAS-ULTRA-40', 'ADIDAS-ULTRA-41', 'ADIDAS-ULTRA-42',
  'NIKE-AIRMAX-42', 'NIKE-AIRMAX-43', 'NIKE-AIRMAX-44',
  'HM-TSHIRT-L', 'HM-TSHIRT-M', 'HM-TSHIRT-XL',
  'PUMA-SNEAKER-39', 'PUMA-SNEAKER-40', 'PUMA-SNEAKER-41',
  'REEBOK-CROSS-38', 'REEBOK-CROSS-39', 'REEBOK-CROSS-40',
  'CONVERSE-ALLSTAR-41', 'CONVERSE-ALLSTAR-42', 'CONVERSE-ALLSTAR-43',
  'VANS-OLD-SKOOL-44', 'VANS-OLD-SKOOL-45',
  'NEW-BALANCE-43', 'NEW-BALANCE-44',
  'SAUCONY-JAZZ-40', 'SAUCONY-JAZZ-41',
  'ASICS-GEL-42', 'ASICS-GEL-43',
]

// Zones in the warehouse
const ZONES = ['A', 'B', 'C', 'D']

// ─── Helper Functions ───────────────────────────────────────────────────────────────

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateLocationId(zone, rack, level) {
  return `${zone}-${String(rack).padStart(2, '0')}-${String(level).padStart(2, '0')}`
}

function generateSkuId() {
  return `SKU-${getRandomInt(1000, 9999)}`
}

function generateEmployeeName() {
  const firstNames = ['John', 'Sarah', 'Mike', 'Emily', 'Tom', 'Lisa', 'David', 'Maria', 'Chris', 'Anna', 'James']
  const lastNames = ['Smith', 'Johnson', 'Davis', 'Chen', 'Wilson', 'Brown', 'Garcia', 'Taylor', 'Lee', 'Martinez']
  return `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`
}

function generateOrderId() {
  return `ORD-${getRandomInt(1000, 9999)}`
}

function generateDaysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}

// ─── Generate Single Product Opportunities ───────────────────────────────────────

function generateSingleProductOpportunities(count = 15) {
  const opportunities = []

  for (let i = 0; i < count; i++) {
    const zone = getRandomItem(['C', 'D', 'B']) // Far zones
    const rack = getRandomInt(5, 25)
    const level = getRandomInt(1, 6)

    const currentLocation = { zone, rack, level }
    const suggestedLocation = {
      zone: 'A', // Close to dispatch
      rack: getRandomInt(1, 8),
      level: getRandomInt(1, 10),
    }

    const timeSavingsMinutes = getRandomInt(10, 45) / 10

    opportunities.push({
      id: `SPO-${String(i + 1).padStart(3, '0')}`,
      locationId: generateLocationId(zone, rack, level),
      currentSku: getRandomItem(SKUS),
      currentLocation,
      suggestedLocation,
      timeSavingsMinutes,
      status: getRandomItem(['pending', 'pending', 'pending', 'pending']),
    })
  }

  // Sort by time savings (largest first)
  opportunities.sort((a, b) => b.timeSavingsMinutes - a.timeSavingsMinutes)

  return opportunities
}

// ─── Generate Product Pair Opportunities ───────────────────────────────────────

function generateProductPairOpportunities(count = 8) {
  const opportunities = []

  for (let i = 0; i < count; i++) {
    const skuA = getRandomItem(SKUS)
    const skuB = getRandomItem(SKUS.filter(sku => sku !== skuA))

    const locationA = {
      zone: getRandomItem(['B', 'C', 'D']),
      rack: getRandomInt(5, 20),
      level: getRandomInt(1, 6),
    }

    const locationB = {
      zone: getRandomItem(['B', 'C', 'D']),
      rack: getRandomInt(5, 20),
      level: getRandomInt(1, 6),
    }

    // Suggest locations close to each other
    const baseRack = getRandomInt(1, 6)
    const suggestedLocationA = {
      zone: 'A',
      rack: baseRack,
      level: getRandomInt(1, 10),
    }
    const suggestedLocationB = {
      zone: 'A',
      rack: baseRack + 1,
      level: getRandomInt(1, 10),
    }

    const timeSavingsMinutes = getRandomInt(15, 50) / 10

    opportunities.push({
      id: `PPO-${String(i + 1).padStart(3, '0')}`,
      skuA,
      skuB,
      locationA,
      locationB,
      suggestedLocationA,
      suggestedLocationB,
      timeSavingsMinutes,
      status: getRandomItem(['pending', 'pending', 'accepted', 'pending']),
    })
  }

  // Sort by time savings
  opportunities.sort((a, b) => b.timeSavingsMinutes - a.timeSavingsMinutes)

  return opportunities
}

// ─── Generate Product Triplet Opportunities ─────────────────────────────────────

function generateProductTripletOpportunities(count = 5) {
  const opportunities = []

  for (let i = 0; i < count; i++) {
    const usedSkus = []
    const skuA = getRandomItem(SKUS)
    usedSkus.push(skuA)

    const skuB = getRandomItem(SKUS.filter(sku => sku !== skuA))
    usedSkus.push(skuB)

    const skuC = getRandomItem(SKUS.filter(sku => !usedSkus.includes(sku)))
    usedSkus.push(skuC)

    const locationA = {
      zone: getRandomItem(['B', 'C', 'D']),
      rack: getRandomInt(5, 22),
      level: getRandomInt(1, 6),
    }
    const locationB = {
      zone: getRandomItem(['B', 'C', 'D']),
      rack: getRandomInt(5, 22),
      level: getRandomInt(1, 6),
    }
    const locationC = {
      zone: getRandomItem(['B', 'C', 'D']),
      rack: getRandomInt(5, 22),
      level: getRandomInt(1, 6),
    }

    // Suggest locations close together in Zone A
    const baseRack = getRandomInt(1, 5)
    const suggestedLocationA = {
      zone: 'A',
      rack: baseRack,
      level: getRandomInt(1, 10),
    }
    const suggestedLocationB = {
      zone: 'A',
      rack: baseRack + 1,
      level: getRandomInt(1, 10),
    }
    const suggestedLocationC = {
      zone: 'A',
      rack: baseRack + 2,
      level: getRandomInt(1, 10),
    }

    const timeSavingsMinutes = getRandomInt(25, 70) / 10

    opportunities.push({
      id: `TPO-${String(i + 1).padStart(3, '0')}`,
      skuA,
      skuB,
      skuC,
      locationA,
      locationB,
      locationC,
      suggestedLocationA,
      suggestedLocationB,
      suggestedLocationC,
      timeSavingsMinutes,
      status: getRandomItem(['pending', 'pending', 'pending', 'accepted']),
    })
  }

  // Sort by time savings
  opportunities.sort((a, b) => b.timeSavingsMinutes - a.timeSavingsMinutes)

  return opportunities
}

// ─── Generate Trip Data ───────────────────────────────────────────────────────

function generateTripsForOpportunity(opportunity, count = 5) {
  const trips = []

  for (let i = 0; i < count; i++) {
    const picksInRoute = getRandomInt(8, 25)

    const baseRouteMinutes = getRandomInt(3, 12)
    const baseRouteSeconds = getRandomInt(0, 59)
    const savedMinutes = opportunity.timeSavingsMinutes

    const currentRouteStr = `${baseRouteMinutes}m ${String(baseRouteSeconds).padStart(2, '0')}s`
    const updatedMinutes = Math.max(0, baseRouteMinutes - savedMinutes)
    const updatedSeconds = Math.max(0, baseRouteSeconds - Math.floor(savedMinutes * 60) % 60)
    const updatedRouteStr = `${updatedMinutes}m ${String(updatedSeconds).padStart(2, '0')}s`
    const savedStr = `${Math.floor(savedMinutes)}m ${String(Math.floor(savedMinutes * 60) % 60).padStart(2, '0')}s`

    const isSameRoute = opportunity.skuB || opportunity.skuC // Pairs and triplets have same route

    trips.push({
      employee: generateEmployeeName(),
      date: generateDaysAgo(i),
      orderId: generateOrderId(),
      picksInRoute,
      routeLength: currentRouteStr,
      updatedRouteLength: updatedRouteStr,
      timeSaved: savedStr,
      sameRoute: isSameRoute,
    })
  }

  // Sort by date (newest first)
  trips.sort((a, b) => new Date(b.date) - new Date(a.date))

  return trips
}

function generateAllTripData(opportunities) {
  const tripData = {}
  opportunities.forEach(opp => {
    const tripCount = getRandomInt(3, 8)
    tripData[opp.id] = generateTripsForOpportunity(opp, tripCount)
  })
  return tripData
}

// ─── Read and Parse mockData.js ───────────────────────────────────────────────

function parseMockDataFile() {
  const content = fs.readFileSync(MOCK_DATA_FILE, 'utf-8')
  const lines = content.split('\n')

  // Find the position to insert new data
  let insertPosition = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('// ─── MFA Data')) {
      insertPosition = i
      break
    }
  }

  if (insertPosition === -1) {
    // If MFA section doesn't exist, insert before export
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes('export default')) {
        insertPosition = i
        break
      }
    }
  }

  return { lines, insertPosition }
}

// ─── Generate New Data ───────────────────────────────────────────────────────

function generateMFAScript() {
  const singleOpportunities = generateSingleProductOpportunities(15)
  const pairOpportunities = generateProductPairOpportunities(8)
  const tripletOpportunities = generateProductTripletOpportunities(5)

  const allOpportunities = [...singleOpportunities, ...pairOpportunities, ...tripletOpportunities]
  const tripData = generateAllTripData(allOpportunities)

  const script = `
// ─── MFA Data ─────────────────────────────────────────────────────────────

// ─── Mock Data: Single Product Reslotting Opportunities ───────────────
export const SINGLE_PRODUCT_OPPORTUNITIES = ${JSON.stringify(singleOpportunities, null, 2)}

// ─── Mock Data: Product Pairs Reslotting Opportunities ───────────────────
export const PRODUCT_PAIRS_OPPORTUNITIES = ${JSON.stringify(pairOpportunities, null, 2)}

// ─── Mock Data: Product Triplets Reslotting Opportunities ──────────────────
export const PRODUCT_TRIPLETS_OPPORTUNITIES = ${JSON.stringify(tripletOpportunities, null, 2)}

// ─── Mock Data: Trips for Detail View ───────────────────────────────────────
export const TRIP_DATA = ${JSON.stringify(tripData, null, 2)}

`

  return script
}

// ─── Main: Update mockData.js ─────────────────────────────────────────────

function main() {
  console.log('📊 Generating Mock Reslotting Opportunities...\n')

  // Parse existing file
  const { lines, insertPosition } = parseMockDataFile()

  // Generate new script
  const newScript = generateMFAScript()

  if (insertPosition === -1) {
    console.error('❌ Could not find insertion point in mockData.js')
    process.exit(1)
  }

  // Remove existing MFA data (from insertPosition to next marker or end)
  const newLines = [...lines.slice(0, insertPosition), newScript]

  // Write back to file
  fs.writeFileSync(MOCK_DATA_FILE, newLines.join('\n'), 'utf-8')

  console.log(`✅ Successfully updated ${MOCK_DATA_FILE}`)
  console.log(`\n📈 Generated:`)
  console.log(`   - ${singleOpportunities.length} single product opportunities`)
  console.log(`   - ${pairOpportunities.length} product pair opportunities`)
  console.log(`   - ${tripletOpportunities.length} product triplet opportunities`)
  console.log(`   - ${Object.keys(tripData).length} trip data sets`)
  console.log('\n🎯 Refresh your browser to see the new data!\n')
}

// Run the script
main()
