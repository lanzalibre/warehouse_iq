// ============================================================================
// SCREEN: Delay Patterns
// WES records with >30% delay threshold + accumulated stats.
// ============================================================================

isc.DataSource.create({
    ID: "delayWesDS",
    clientOnly: true,
    fields: [
        { name: "id",           primaryKey: true, type: "text" },
        { name: "zone",         type: "text"    },
        { name: "equipment",    type: "text"    },
        { name: "orderType",    type: "text"    },
        { name: "expectedTime", type: "text"    },
        { name: "actualTime",   type: "text"    },
        { name: "delaySeconds", type: "integer" },
        { name: "delayPercent", type: "float"   },
        { name: "timestamp",    type: "text"    },
        { name: "taskId",       type: "text"    }
    ]
});

// Accumulated delay stats form
isc.DynamicForm.create({
    ID: "dl_statsForm",
    autoDraw: false,
    width: "100%",
    height: 60,
    numCols: 4,
    cellPadding: 10,
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    fields: [
        { name: "totalDelayMin",   title: "Total Delay (min)",    type: "staticText",
          cellStyle: "kpi-value kpi-danger", titleStyle: "kpi-label" },
        { name: "delayedTasks",    title: "Delayed Tasks",        type: "staticText",
          cellStyle: "kpi-value", titleStyle: "kpi-label" },
        { name: "avgDelayPerTask", title: "Avg Delay / Task (s)", type: "staticText",
          cellStyle: "kpi-value", titleStyle: "kpi-label" },
        { name: "threshold",       title: "Threshold",            type: "staticText",
          titleStyle: "kpi-label" }
    ]
});

// Load accumulated delay stats
isc.RPCManager.sendRequest({
    actionURL: "./data/accumulated_delay.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try {
            var d = JSON.parse(data);
            dl_statsForm.setValues({
                totalDelayMin:   d.totalDelayMinutes.toFixed(1) + " min",
                delayedTasks:    d.totalDelayedTasks,
                avgDelayPerTask: (d.avgDelayPerTask || 0).toFixed(1) + "s",
                threshold:       ">30% slower than planned"
            });
        } catch(e) {}
    }
});

// Filter form
isc.DynamicForm.create({
    ID: "dl_filterForm",
    autoDraw: false,
    width: "100%",
    numCols: 3,
    cellPadding: 6,
    fields: [
        { name: "zone", title: "Zone", type: "select",
          defaultValue: "all",
          valueMap: { all: "All Zones", "Zone A": "Zone A", "Zone B": "Zone B",
                      "Zone C": "Zone C", "Zone D": "Zone D", "Crossdock": "Crossdock" },
          changed: function(form, item, value) {
              if (value === "all") dl_wesGrid.clearCriteria();
              else dl_wesGrid.filterData({ zone: value });
          }
        },
        { name: "orderType", title: "Order Type", type: "select",
          defaultValue: "all",
          valueMap: { all: "All Types", "Standard": "Standard", "B2B": "B2B",
                      "Same-Day": "Same-Day", "Bulk": "Bulk" },
          changed: function(form, item, value) {
              if (value === "all") dl_wesGrid.clearCriteria();
              else dl_wesGrid.filterData({ orderType: value });
          }
        }
    ]
});

// WES records grid
isc.ListGrid.create({
    ID: "dl_wesGrid",
    autoDraw: false,
    width: "100%",
    height: "*",
    dataSource: "delayWesDS",
    autoFetchData: false,
    showHeaderMenuButton: false,
    alternateRecordStyles: true,
    fields: [
        { name: "taskId",       title: "Task ID",      width: 90  },
        { name: "zone",         title: "Zone",         width: 90  },
        { name: "equipment",    title: "Equipment",    width: 150 },
        { name: "orderType",    title: "Order Type",   width: 100 },
        { name: "expectedTime", title: "Expected",     width: 90  },
        { name: "actualTime",   title: "Actual",       width: 90  },
        { name: "delaySeconds", title: "Delay (s)",    width: 80, align: "right" },
        { name: "delayPercent", title: "Delay %",      width: 80, align: "right",
          formatCellValue: function(v) {
              if (!v && v !== 0) return "—";
              var cls = v > 45 ? "delay-danger" : (v > 30 ? "delay-warn" : "delay-ok");
              return "<span class='" + cls + "'>" + v.toFixed(1) + "%</span>";
          }
        },
        { name: "timestamp",    title: "Time",         width: 90  }
    ]
});

// Load WES delay records into clientOnly DataSource
isc.RPCManager.sendRequest({
    actionURL: "./data/delay_wes_records.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try { delayWesDS.setCacheData(JSON.parse(data)); dl_wesGrid.fetchData(); } catch(e) {}
    }
});

isc.VLayout.create({
    ID: "delayScreen",
    autoDraw: false,
    width: "100%",
    height: "100%",
    members: [
        dl_statsForm,
        isc.VLayout.create({
            autoDraw: false, width: "100%", padding: 6,
            backgroundColor: "white",
            members: [dl_filterForm]
        }),
        isc.Label.create({
            autoDraw: false, height: 30,
            contents: "<div class='section-title'>WES Records — Delays >30% Threshold</div>"
        }),
        dl_wesGrid
    ]
});
