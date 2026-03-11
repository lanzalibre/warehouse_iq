// ============================================================================
// SCREEN: Labor Management
// Left: zone summary with capacity. Right: worker roster + rebalancing recs.
// ============================================================================

isc.DataSource.create({
    ID: "workersDS",
    clientOnly: true,
    fields: [
        { name: "id",          primaryKey: true, type: "text" },
        { name: "name",        type: "text" },
        { name: "initials",    type: "text" },
        { name: "role",        type: "text" },
        { name: "assignedZone", type: "text" },
        { name: "checkedIn",   type: "boolean" },
        { name: "checkInTime", type: "text" },
        { name: "experience",  type: "any" }
    ]
});

isc.DataSource.create({
    ID: "rebalancingDS",
    clientOnly: true,
    fields: [
        { name: "id",                primaryKey: true, type: "text" },
        { name: "priority",          type: "text" },
        { name: "workerId",          type: "text" },
        { name: "fromZone",          type: "text" },
        { name: "toZone",            type: "text" },
        { name: "experienceMonths",  type: "integer" },
        { name: "reasoning",         type: "text" },
        { name: "impact",            type: "text" }
    ]
});

// Zone summary clientOnly DS (loaded from zone_config + workers aggregation)
isc.DataSource.create({
    ID: "lb_zoneSummaryDS",
    clientOnly: true,
    fields: [
        { name: "zone",        type: "text",    title: "Zone",        primaryKey: true },
        { name: "label",       type: "text",    title: "Description"  },
        { name: "total",       type: "integer", title: "Total"        },
        { name: "checkedIn",   type: "integer", title: "Checked In"   },
        { name: "loadPct",     type: "integer", title: "Load %"       },
        { name: "maxHours",    type: "integer", title: "Max Hours/Day" }
    ]
});

// Load zone summary from zones.json
isc.RPCManager.sendRequest({
    actionURL: "./data/zones.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try {
            var zones = JSON.parse(data);
            lb_zoneSummaryDS.setCacheData(zones.map(function(z) {
                return {
                    zone:      z.zone,
                    label:     z.label,
                    total:     0,
                    checkedIn: 0,
                    loadPct:   z.currentLoadPct,
                    maxHours:  z.maxDailyHours
                };
            }));
            lb_zoneGrid.fetchData();
        } catch(e) {}
    }
});

// After workers load, update zone totals
function lb_updateZoneSummary(workers) {
    var existing = lb_zoneSummaryDS.getCacheData() || [];
    var zoneMap = {};
    existing.forEach(function(z) { zoneMap[z.zone] = { total:0, checkedIn:0 }; });
    workers.forEach(function(w) {
        var z = w.assignedZone;
        if (!zoneMap[z]) zoneMap[z] = { total:0, checkedIn:0 };
        zoneMap[z].total++;
        if (w.checkedIn) zoneMap[z].checkedIn++;
    });
    existing.forEach(function(z) {
        var counts = zoneMap[z.zone] || { total:0, checkedIn:0 };
        z.total     = counts.total;
        z.checkedIn = counts.checkedIn;
    });
    lb_zoneSummaryDS.setCacheData(existing);
    lb_zoneGrid.fetchData();
}

// --- Zone summary grid ---
isc.ListGrid.create({
    ID: "lb_zoneGrid",
    autoDraw: false,
    width: "100%",
    height: "*",
    dataSource: "lb_zoneSummaryDS",
    autoFetchData: false,
    selectionType: "single",
    showHeaderMenuButton: false,
    alternateRecordStyles: true,
    fields: [
        { name: "zone",      title: "Zone",         width: 100 },
        { name: "label",     title: "Description",  width: "*"  },
        { name: "checkedIn", title: "In / Total",   width: 90, align: "center",
          formatCellValue: function(v, r) {
              var pct = r.total > 0 ? Math.round(v / r.total * 100) : 0;
              var cls = pct < 50 ? "delay-danger" : (pct < 80 ? "delay-warn" : "checked-in");
              return "<span class='" + cls + "'>" + v + "/" + r.total + "</span>";
          }
        },
        { name: "loadPct",   title: "Load %",       width: 70, align: "right",
          formatCellValue: function(v) {
              var cls = v >= 85 ? "delay-danger" : (v >= 70 ? "delay-warn" : "delay-ok");
              return "<span class='" + cls + "'>" + v + "%</span>";
          }
        },
        { name: "maxHours",  title: "Max Hrs",      width: 70, align: "right" }
    ],
    selectionUpdated: function(record) {
        if (!record) return;
        lb_workerGrid.filterData({ assignedZone: record.zone });
    }
});

// --- Worker roster grid ---
isc.ListGrid.create({
    ID: "lb_workerGrid",
    autoDraw: false,
    width: "100%",
    height: "*",
    dataSource: "workersDS",
    autoFetchData: false,
    showHeaderMenuButton: false,
    alternateRecordStyles: true,
    fields: [
        { name: "id",          title: "ID",     width: 80 },
        { name: "name",        title: "Name",   width: 140 },
        { name: "role",        title: "Role",   width: 120 },
        { name: "assignedZone", title: "Zone",  width: 100 },
        { name: "checkedIn",   title: "Status", width: 80, align: "center",
          formatCellValue: function(v) {
              return v ? "<span class='checked-in'>✓ In</span>"
                       : "<span class='checked-out'>— Out</span>";
          }
        },
        { name: "checkInTime", title: "Check-in", width: 80 }
    ],
    dataArrived: function() {
        var workers = this.data.getRange(0, this.getTotalRows());
        lb_updateZoneSummary(workers);
    }
});

// --- Rebalancing recommendations grid ---
isc.ListGrid.create({
    ID: "lb_rebalanceGrid",
    autoDraw: false,
    width: "100%",
    height: 130,
    dataSource: "rebalancingDS",
    autoFetchData: false,
    showHeaderMenuButton: false,
    canSort: false,
    fields: [
        { name: "workerId",         title: "Worker",    width: 100 },
        { name: "fromZone",         title: "From",      width: 80  },
        { name: "toZone",           title: "To",        width: 80  },
        { name: "experienceMonths", title: "Exp (mo)",  width: 75, align: "right" },
        { name: "reasoning",        title: "Reasoning", width: "*" },
        { name: "priority",         title: "Priority",  width: 80,
          formatCellValue: function(v) { return "<span class='priority-" + (v||"").toLowerCase() + "'>" + (v||"") + "</span>"; }
        }
    ]
});

// Load workers and rebalancing recs into clientOnly DataSources
isc.RPCManager.sendRequest({
    actionURL: "./data/workers.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try {
            workersDS.setCacheData(JSON.parse(data));
            lb_workerGrid.fetchData();
        } catch(e) {}
    }
});
isc.RPCManager.sendRequest({
    actionURL: "./data/rebalancing_recs.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try {
            rebalancingDS.setCacheData(JSON.parse(data));
            lb_rebalanceGrid.fetchData();
        } catch(e) {}
    }
});

// --- Screen root layout ---
isc.VLayout.create({
    ID: "laborScreen",
    autoDraw: false,
    width: "100%",
    height: "100%",
    members: [
        isc.HLayout.create({
            autoDraw: false,
            width: "100%",
            height: "*",
            members: [
                // Left: zone summary
                isc.VLayout.create({
                    autoDraw: false,
                    width: 380,
                    height: "100%",
                    members: [
                        isc.Label.create({
                            autoDraw: false, height: 30,
                            contents: "<div class='section-title'>Zone Summary — Click to filter workers</div>"
                        }),
                        lb_zoneGrid
                    ]
                }),
                // Right: worker list + rebalancing
                isc.VLayout.create({
                    autoDraw: false,
                    width: "*",
                    height: "100%",
                    members: [
                        isc.Label.create({
                            autoDraw: false, height: 30,
                            contents: "<div class='section-title'>Worker Roster (Current Shift 06:00–14:00)</div>"
                        }),
                        lb_workerGrid,
                        isc.Label.create({
                            autoDraw: false, height: 30,
                            contents: "<div class='section-title'>Rebalancing Recommendations</div>"
                        }),
                        lb_rebalanceGrid
                    ]
                })
            ]
        })
    ]
});
