import { writeFileSync } from 'fs';
import {
  ZONE_CONFIG, SITE_STATS, CONTAINERS, SCAN_ITEMS,
  WORKERS, LABOR_PERIOD_DATA, REBALANCING_RECS,
  DELAY_WES_RECORDS, ACCUMULATED_DELAY, WAVE_ORDER_DATA,
  PROJECTIONS, ALERT_SUBSCRIPTIONS, MISPLACED_LOCATIONS_ALL,
  SINGLE_PRODUCT_OPPORTUNITIES, PRODUCT_PAIRS_OPPORTUNITIES,
  PICK_TASKS_ALL, DELAY_PATTERNS, CONTAINERS_ALL, CONTAINER_PRODUCTS,
  HISTORICAL_PO_CONTAINERS
} from './src/mockData.js';

const exports_map = {
  zone_config: ZONE_CONFIG,
  site_stats: SITE_STATS,
  containers: CONTAINERS,
  scan_items: SCAN_ITEMS.slice(0, 15),
  workers: WORKERS,
  labor_period_data: LABOR_PERIOD_DATA,
  rebalancing_recs: REBALANCING_RECS,
  delay_wes_records: DELAY_WES_RECORDS,
  accumulated_delay: ACCUMULATED_DELAY,
  waves: WAVE_ORDER_DATA,
  projections: PROJECTIONS,
  alert_subscriptions: ALERT_SUBSCRIPTIONS,
  misplaced_locations: MISPLACED_LOCATIONS_ALL.slice(0, 25),
  reslotting_single: SINGLE_PRODUCT_OPPORTUNITIES.slice(0, 30),
  reslotting_pairs: PRODUCT_PAIRS_OPPORTUNITIES.slice(0, 20),
  pick_tasks: PICK_TASKS_ALL.slice(0, 30),
  delay_patterns: DELAY_PATTERNS,
  containers_all: CONTAINERS_ALL.slice(0, 12),
  container_products: CONTAINER_PRODUCTS,
  historical_po_containers: HISTORICAL_PO_CONTAINERS,
};

for (const [key, val] of Object.entries(exports_map)) {
  writeFileSync('smartclient/data/' + key + '.json', JSON.stringify(val, null, 2));
  console.log('Wrote', key + '.json');
}
