// ============================================================================
// SCREEN: Unloading Bay
// Shows scan items from an active container unloading session.
// Left: scanned items list. Right: workload estimate by zone.
// ============================================================================

isc.DataSource.create({
    ID: "scanItemsDS",
    clientOnly: true,
    fields: [
        { name: "id",          primaryKey: true, type: "text" },
        { name: "type",        type: "text" },
        { name: "brand",       type: "text" },
        { name: "description", type: "text" },
        { name: "color",       type: "text" },
        { name: "weightKg",    type: "float" },
        { name: "dimensions",  type: "text" },
        { name: "condition",   type: "text" },
        { name: "hazardous",              type: "boolean" },
        { name: "requiresSpecialHandling", type: "boolean" },
        { name: "fragile",     type: "boolean" },
        { name: "destination", type: "any" },
        { name: "handlingMinutes", type: "integer" },
        { name: "alert",       type: "any" }
    ]
});

// Zone workload estimates (clientOnly, computed from scan items)
isc.DataSource.create({
    ID: "ub_zoneEstimateDS",
    clientOnly: true,
    fields: [
        { name: "zone",  type: "text",    title: "Zone",  primaryKey: true },
        { name: "hours", type: "float",   title: "Est. Hours" },
        { name: "units", type: "integer", title: "Units"  }
    ]
});

// Progress summary form
isc.DynamicForm.create({
    ID: "ub_progressForm",
    autoDraw: false,
    width: "100%",
    numCols: 6,
    cellPadding: 8,
    backgroundColor: "#1e3a5f",
    fields: [
        { name: "container",     title: "Container",     type: "staticText",
          titleStyle: "color:white", cellStyle: "color:white" },
        { name: "scanned",       title: "Scanned",       type: "staticText",
          titleStyle: "color:white", cellStyle: "color:white" },
        { name: "coldChain",     title: "Cold Chain",    type: "staticText",
          titleStyle: "color:white", cellStyle: "color:white" },
        { name: "alerts",        title: "Alerts",        type: "staticText",
          titleStyle: "color:white", cellStyle: "color:white" },
        { name: "handlingTime",  title: "Handling (min)", type: "staticText",
          titleStyle: "color:white", cellStyle: "color:white" },
        { name: "dock",          title: "Dock",          type: "staticText",
          titleStyle: "color:white", cellStyle: "color:white" }
    ]
});

isc.ListGrid.create({
    ID: "ub_scanGrid",
    autoDraw: false,
    width: "100%",
    height: "*",
    dataSource: "scanItemsDS",
    autoFetchData: false,
    showHeaderMenuButton: false,
    alternateRecordStyles: true,
    fields: [
        { name: "id",          title: "Item ID",    width: 90  },
        { name: "brand",       title: "Brand",      width: 90  },
        { name: "type",        title: "Type",       width: 120 },
        { name: "description", title: "Description", width: "*" },
        { name: "destination", title: "Zone",       width: 90,
          formatCellValue: function(v) {
              return (v && v.zone) ? v.zone : (v || "—");
          }
        },
        { name: "handlingMinutes", title: "Min",    width: 55, align: "right" },
        { name: "hazardous",   title: "Haz",        width: 45, align: "center",
          formatCellValue: function(v) { return v ? "⚠" : ""; }
        },
        { name: "fragile",     title: "Frag",       width: 45, align: "center",
          formatCellValue: function(v) { return v ? "★" : ""; }
        },
        { name: "alert",       title: "Alert",      width: 80,
          formatCellValue: function(v) {
              if (!v) return "";
              return "<span class='delay-danger'>⚠ " + (v.type || "Alert") + "</span>";
          }
        }
    ],
    dataArrived: function() {
        // Build zone workload summary from scan items
        var records = this.data.getRange(0, this.getTotalRows());
        var zoneMap = {};
        records.forEach(function(r) {
            var z = (r.destination && r.destination.zone) ? r.destination.zone : (r.destination || "Unknown");
            if (!zoneMap[z]) zoneMap[z] = { zone: z, hours: 0, units: 0 };
            zoneMap[z].hours += (r.handlingMinutes || 0) / 60;
            zoneMap[z].units += 1;
        });
        var zoneData = Object.values(zoneMap).map(function(z) {
            return { zone: z.zone, hours: Math.round(z.hours * 10) / 10, units: z.units };
        });
        ub_zoneEstimateDS.setCacheData(zoneData);
        ub_zoneGrid.fetchData();

        // Update progress form
        var alerts = records.filter(function(r) { return r.alert; }).length;
        var cold = records.filter(function(r) { return r.requiresSpecialHandling; }).length;
        var totalMins = records.reduce(function(s, r) { return s + (r.handlingMinutes || 0); }, 0);
        ub_progressForm.setValues({
            container:    "CONT-4201 — Nike",
            scanned:      records.length + " items",
            coldChain:    cold + " items",
            alerts:       alerts + " alerts",
            handlingTime: totalMins + " min",
            dock:         "Dock 3"
        });
    }
});

isc.ListGrid.create({
    ID: "ub_zoneGrid",
    autoDraw: false,
    width: "100%",
    height: 200,
    dataSource: "ub_zoneEstimateDS",
    autoFetchData: false,
    showHeaderMenuButton: false,
    canSort: false,
    title: "Live Workload Estimate by Zone",
    fields: [
        { name: "zone",  title: "Zone",       width: "*" },
        { name: "hours", title: "Est. Hours", width: 100, align: "right",
          formatCellValue: function(v) { return (v || 0).toFixed(1) + "h"; }
        },
        { name: "units", title: "Items",      width: 80, align: "right" }
    ]
});

// Load scan items into clientOnly DataSource
isc.RPCManager.sendRequest({
    actionURL: "./data/scan_items.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try {
            scanItemsDS.setCacheData(JSON.parse(data));
            ub_scanGrid.fetchData();
        } catch(e) {}
    }
});

isc.VLayout.create({
    ID: "unloadingScreen",
    autoDraw: false,
    width: "100%",
    height: "100%",
    members: [
        ub_progressForm,
        isc.HLayout.create({
            autoDraw: false,
            width: "100%",
            height: "*",
            members: [
                // Left: scan items
                isc.VLayout.create({
                    autoDraw: false,
                    width: "60%",
                    height: "100%",
                    members: [
                        isc.Label.create({
                            autoDraw: false, height: 30,
                            contents: "<div class='section-title'>Scanned Items</div>"
                        }),
                        ub_scanGrid
                    ]
                }),
                // Right: zone estimate
                isc.VLayout.create({
                    autoDraw: false,
                    width: "40%",
                    height: "100%",
                    padding: 10,
                    backgroundColor: "#f8f9fa",
                    membersMargin: 10,
                    members: [
                        isc.Label.create({
                            autoDraw: false, height: 30,
                            contents: "<div class='section-title'>Live Workload Estimate by Zone</div>"
                        }),
                        ub_zoneGrid,
                        isc.Label.create({
                            autoDraw: false,
                            contents: "<div style='padding:10px; background:white; border:1px solid #e5e7eb; font-size:12px; color:#374151;'>" +
                                "<b>Estimation Note:</b> Zone D (Cold Storage) currently at 89% capacity. " +
                                "Cold-chain items detected may trigger re-estimation and recommendation update.</div>",
                            height: 80,
                            overflow: "hidden"
                        })
                    ]
                })
            ]
        })
    ]
});
