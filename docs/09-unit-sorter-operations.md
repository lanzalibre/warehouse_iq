# Unit Sorter Operations — User Story & Implementation Guide

## Overview

The Unit Sorter represents the automated core of warehouse outbound operations. Managing sorter capacity, task allocation, and equipment maintenance directly impacts throughput and reduces manual rework. This document describes the user story, operational issues, task allocation strategies, maintenance workflows, and exception handling system.

---

## User Story

**As a** Warehouse Operations Manager (Jordan Chen - Inbound Manager, supporting outbound coordination)
**I want to** dynamically allocate sorting tasks to available sorters while managing equipment maintenance and handling exceptions
**So that** I can maximize throughput, minimize mis-sorts, and prevent equipment failures during peak volume periods.

### Scenario
During a peak shipping window, orders arrive from multiple picking zones (PTL Order Picking, Cart Pick, Pallet Pick) destined for different distribution channels. The Sorter must:
1. Accept incoming item streams from all pickers
2. Route items to correct output chutes based on order destination
3. Detect mis-sorts and reroute to manual staging
4. Schedule maintenance windows without causing bottlenecks
5. Rebalance load across multiple sorter units if available

---

## Issues Identified

### 1. Sorter Capacity vs. Demand Mismatch
- **Current Utilization**: 62% (moderate, but peak periods exceed 85%)
- **Throughput**: 18 pallets/h (target: 21 pallets/h)


### 3. Equipment Maintenance Pressure
- **Maintenance Need**: Red. Sorter 3 has been running for 1200 hours without belt inspection (recommended every 1000 hours)
- Yellow. Sorters 1 and 2 error rate has been increasing (currently 2.3% vs. target <1%)



---

## Operational Issues Display in MFA


When users click the **Unit Sorter node** in the Warehouse Process Flow diagram:

1. **Node Tooltip** shows:
   - Throughput and target: "18 pallets/h (target: 21)"
   - Task Queue: 45 pending items (2.5h backlog)
   - Key metrics: Utilization (62%), error rate (2.3%), avg cycle time
   - Equipment Status: 9 sorters operational, sorter 1 in maintenance, sorter 3 due for inspection
   - Color indicators:  Error Rate (AMBER), Maintenance (RED)
    - TODO: remove Utilization and analysis

3. **Maintenance Status Card**:
  - **Maintenance Need**: Red. Sorter 3 has been running for 1200 hours without belt inspection (recommended every 1000 hours)
  - Yellow. Sorters 1 and 2 error rate has been increasing (currently 2.3% vs. target <1%)



5. ** Recommended Action: 
   - Create maintenance ticket.
   - Bring sorter 3 offline for inspection.

