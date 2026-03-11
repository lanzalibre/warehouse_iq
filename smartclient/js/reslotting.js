// ============================================================================
// SCREEN: Multi-Faceted Analytics — Reslotting Opportunities
// Tabs: Single Products | Product Pairs. Each tab is a ListGrid.
// ============================================================================

isc.DataSource.create({
    ID: "reslottingSingleDS",
    clientOnly: true,
    fields: [
        { name: "id",                primaryKey: true, type: "text" },
        { name: "currentSku",        type: "text"    },
        { name: "demandLevel",       type: "text"    },
        { name: "currentLocation",   type: "any"     },
        { name: "suggestedLocation", type: "any"     },
        { name: "timeSavingsMinutes", type: "float"  },
        { name: "tripFrequency",     type: "any"     },
        { name: "status",            type: "text"    }
    ]
});

isc.DataSource.create({
    ID: "reslottingPairsDS",
    clientOnly: true,
    fields: [
        { name: "id",                 primaryKey: true, type: "text" },
        { name: "skuA",               type: "text"    },
        { name: "skuB",               type: "text"    },
        { name: "locationA",          type: "any"     },
        { name: "locationB",          type: "any"     },
        { name: "suggestedLocationA", type: "any"     },
        { name: "suggestedLocationB", type: "any"     },
        { name: "timeSavingsMinutes", type: "float"   },
        { name: "status",             type: "text"    }
    ]
});

// KPI summary
isc.DynamicForm.create({
    ID: "rs_kpiForm",
    autoDraw: false,
    width: "100%",
    height: 60,
    numCols: 4,
    cellPadding: 10,
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    fields: [
        { name: "singleOpps",    title: "Single Product Opps", type: "staticText",
          cellStyle: "kpi-value", titleStyle: "kpi-label" },
        { name: "pairsOpps",     title: "Product Pair Opps",   type: "staticText",
          cellStyle: "kpi-value", titleStyle: "kpi-label" },
        { name: "totalSavings",  title: "Total Potential Savings", type: "staticText",
          cellStyle: "kpi-value", titleStyle: "kpi-label" },
        { name: "highDemand",    title: "High Demand SKUs",    type: "staticText",
          cellStyle: "kpi-value kpi-danger", titleStyle: "kpi-label" }
    ]
});

// Single products grid
isc.ListGrid.create({
    ID: "rs_singleGrid",
    autoDraw: false,
    width: "100%",
    height: "100%",
    dataSource: "reslottingSingleDS",
    autoFetchData: false,
    showHeaderMenuButton: false,
    alternateRecordStyles: true,
    fields: [
        { name: "id",                title: "Opportunity ID",   width: 130 },
        { name: "currentSku",        title: "SKU",              width: 160 },
        { name: "demandLevel",       title: "Demand",           width: 80,
          formatCellValue: function(v) {
              var cls = v === "high" ? "demand-high" : (v === "medium" ? "demand-medium" : "demand-low");
              return "<span class='" + cls + "'>" + (v||"") + "</span>";
          }
        },
        { name: "currentLocation",   title: "Current Location", width: 160,
          formatCellValue: function(v) {
              if (!v) return "—";
              return "Zone " + v.zone + "-R" + v.rack + "-L" + v.level;
          }
        },
        { name: "suggestedLocation", title: "Suggested Location", width: 160,
          formatCellValue: function(v) {
              if (!v) return "—";
              return "Zone " + v.zone + "-R" + v.rack + "-L" + v.level;
          }
        },
        { name: "timeSavingsMinutes", title: "Savings (min)",   width: 100, align: "right",
          formatCellValue: function(v) {
              return v ? "<span class='wave-ahead'>+" + v.toFixed(1) + " min</span>" : "—";
          }
        },
        { name: "tripFrequency",     title: "Trips (7d/30d/90d)", width: 140,
          formatCellValue: function(v) {
              if (!v) return "—";
              return (v.days7||0) + " / " + (v.days30||0) + " / " + (v.days90||0);
          }
        },
        { name: "status",            title: "Status",           width: 90,
          formatCellValue: function(v) {
              if (v === "approved")  return "<span class='wave-ahead'>Approved</span>";
              if (v === "rejected")  return "<span class='delay-danger'>Rejected</span>";
              return "<span style='color:#9ca3af'>Pending</span>";
          }
        }
    ],
    dataArrived: function() {
        var rows = this.data.getRange(0, this.getTotalRows());
        var savings = rows.reduce(function(s, r) { return s + (r.timeSavingsMinutes || 0); }, 0);
        var highD = rows.filter(function(r) { return r.demandLevel === "high"; }).length;
        rs_kpiForm.setValue("singleOpps",   rows.length);
        rs_kpiForm.setValue("totalSavings", savings.toFixed(0) + " min/day");
        rs_kpiForm.setValue("highDemand",   highD);
    }
});

// Product pairs grid
isc.ListGrid.create({
    ID: "rs_pairsGrid",
    autoDraw: false,
    width: "100%",
    height: "100%",
    dataSource: "reslottingPairsDS",
    autoFetchData: false,
    showHeaderMenuButton: false,
    alternateRecordStyles: true,
    fields: [
        { name: "id",                 title: "Opportunity ID",    width: 130 },
        { name: "skuA",               title: "SKU A",             width: 150 },
        { name: "skuB",               title: "SKU B",             width: 150 },
        { name: "locationA",          title: "Location A",        width: 140,
          formatCellValue: function(v) {
              if (!v) return "—";
              return "Zone " + v.zone + "-R" + v.rack + "-L" + v.level;
          }
        },
        { name: "locationB",          title: "Location B",        width: 140,
          formatCellValue: function(v) {
              if (!v) return "—";
              return "Zone " + v.zone + "-R" + v.rack + "-L" + v.level;
          }
        },
        { name: "timeSavingsMinutes", title: "Savings (min)",     width: 100, align: "right",
          formatCellValue: function(v) {
              return v ? "<span class='wave-ahead'>+" + v.toFixed(1) + " min</span>" : "—";
          }
        },
        { name: "status",             title: "Status",            width: 90,
          formatCellValue: function(v) {
              if (v === "approved")  return "<span class='wave-ahead'>Approved</span>";
              if (v === "rejected")  return "<span class='delay-danger'>Rejected</span>";
              return "<span style='color:#9ca3af'>Pending</span>";
          }
        }
    ],
    dataArrived: function() {
        var rows = this.data.getRange(0, this.getTotalRows());
        rs_kpiForm.setValue("pairsOpps", rows.length);
    }
});

// Load reslotting data into clientOnly DataSources
isc.RPCManager.sendRequest({
    actionURL: "./data/reslotting_single.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try { reslottingSingleDS.setCacheData(JSON.parse(data)); rs_singleGrid.fetchData(); } catch(e) {}
    }
});
isc.RPCManager.sendRequest({
    actionURL: "./data/reslotting_pairs.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try { reslottingPairsDS.setCacheData(JSON.parse(data)); rs_pairsGrid.fetchData(); } catch(e) {}
    }
});

isc.TabSet.create({
    ID: "rs_tabs",
    autoDraw: false,
    width: "100%",
    height: "*",
    tabs: [
        { title: "Single Products", pane: rs_singleGrid },
        { title: "Product Pairs",   pane: rs_pairsGrid  }
    ]
});

isc.VLayout.create({
    ID: "reslottingScreen",
    autoDraw: false,
    width: "100%",
    height: "100%",
    members: [
        rs_kpiForm,
        isc.Label.create({
            autoDraw: false, height: 30,
            contents: "<div class='section-title'>Reslotting Opportunities</div>"
        }),
        rs_tabs
    ]
});
