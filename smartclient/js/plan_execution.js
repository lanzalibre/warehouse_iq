// ============================================================================
// SCREEN: Plan vs Execution
// Top: KPI summary. Tabs: Wave summary | Pick tasks with exceptions.
// ============================================================================

isc.DataSource.create({
    ID: "wavesDS",
    clientOnly: true,
    fields: [
        { name: "id",              primaryKey: true, type: "text" },
        { name: "name",            type: "text" },
        { name: "plannedHours",    type: "float" },
        { name: "actualHours",     type: "float" },
        { name: "delayHours",      type: "float" },
        { name: "delayType",       type: "text" },
        { name: "tasksCompleted",  type: "integer" },
        { name: "totalTasks",      type: "integer" },
        { name: "delayBreakdown",  type: "any" }
    ]
});

isc.DataSource.create({
    ID: "ordersDS",
    clientOnly: true,
    fields: [
        { name: "id",                  primaryKey: true, type: "text" },
        { name: "sku",                 type: "text" },
        { name: "units",               type: "integer" },
        { name: "plannedMinutes",      type: "float" },
        { name: "actualMinutes",       type: "float" },
        { name: "delayMinutes",        type: "float" },
        { name: "delayType",           type: "text" },
        { name: "status",              type: "text" },
        { name: "waveId",              type: "text" }
    ]
});

isc.DataSource.create({
    ID: "pickTasksDS",
    clientOnly: true,
    fields: [
        { name: "id",         primaryKey: true, type: "text" },
        { name: "orderId",    type: "text" },
        { name: "sku",        type: "text" },
        { name: "waveId",     type: "text" },
        { name: "description", type: "text" },
        { name: "wms",        type: "any" },
        { name: "wes",        type: "any" },
        { name: "status",     type: "text" },
        { name: "exceptions", type: "any" },
        { name: "volume7Days", type: "integer" }
    ]
});

// --- KPI form ---
isc.DynamicForm.create({
    ID: "pe_kpiForm",
    autoDraw: false,
    width: "100%",
    height: 70,
    numCols: 6,
    cellPadding: 10,
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    fields: [
        { name: "plannedHours",  title: "Planned Hours",  type: "staticText",
          cellStyle: "kpi-value", titleStyle: "kpi-label" },
        { name: "actualHours",   title: "Actual Hours",   type: "staticText",
          cellStyle: "kpi-value", titleStyle: "kpi-label" },
        { name: "totalDelay",    title: "Delay (hrs)",    type: "staticText",
          cellStyle: "kpi-value", titleStyle: "kpi-label" },
        { name: "waves",         title: "Waves",          type: "staticText",
          cellStyle: "kpi-value", titleStyle: "kpi-label" },
        { name: "tasksComplete", title: "Tasks Done",     type: "staticText",
          cellStyle: "kpi-value", titleStyle: "kpi-label" },
        { name: "period",        title: "Period",         type: "staticText",
          titleStyle: "kpi-label" }
    ]
});

// --- Waves grid ---
isc.ListGrid.create({
    ID: "pe_wavesGrid",
    autoDraw: false,
    width: "100%",
    height: "100%",
    dataSource: "wavesDS",
    autoFetchData: false,
    showHeaderMenuButton: false,
    alternateRecordStyles: true,
    fields: [
        { name: "id",           title: "Wave ID",   width: 100 },
        { name: "name",         title: "Name",      width: "*"  },
        { name: "plannedHours", title: "Planned h", width: 90, align: "right",
          formatCellValue: function(v) { return (v || 0).toFixed(1); }
        },
        { name: "actualHours",  title: "Actual h",  width: 90, align: "right",
          formatCellValue: function(v) { return (v || 0).toFixed(1); }
        },
        { name: "delayHours",   title: "Delay h",   width: 80, align: "right",
          formatCellValue: function(v) {
              if (!v && v !== 0) return "—";
              var cls = v <= 0 ? "wave-ahead" : (v > 4 ? "delay-danger" : "delay-warn");
              var sign = v > 0 ? "+" : "";
              return "<span class='" + cls + "'>" + sign + v.toFixed(1) + "</span>";
          }
        },
        { name: "delayType",    title: "Status",    width: 90,
          formatCellValue: function(v) {
              return v === "ahead"
                  ? "<span class='wave-ahead'>▲ Ahead</span>"
                  : "<span class='wave-delayed'>▼ Delayed</span>";
          }
        },
        { name: "tasksCompleted", title: "Tasks",   width: 90, align: "right",
          formatCellValue: function(v, r) {
              return v + " / " + (r.totalTasks || 0);
          }
        }
    ],
    dataArrived: function() {
        // Compute KPIs
        var rows = this.data.getRange(0, this.getTotalRows());
        var planned = 0, actual = 0, delay = 0, tasksD = 0, tasksT = 0;
        rows.forEach(function(r) {
            planned += r.plannedHours || 0;
            actual  += r.actualHours  || 0;
            delay   += r.delayHours   || 0;
            tasksD  += r.tasksCompleted || 0;
            tasksT  += r.totalTasks     || 0;
        });
        pe_kpiForm.setValues({
            plannedHours:  planned.toFixed(1) + "h",
            actualHours:   actual.toFixed(1)  + "h",
            totalDelay:    (delay > 0 ? "+" : "") + delay.toFixed(1) + "h",
            waves:         rows.length,
            tasksComplete: tasksD + " / " + tasksT,
            period:        "Current Shift (06:00–14:00)"
        });
    }
});

// --- Orders grid ---
isc.ListGrid.create({
    ID: "pe_ordersGrid",
    autoDraw: false,
    width: "100%",
    height: "100%",
    dataSource: "ordersDS",
    autoFetchData: false,
    showHeaderMenuButton: false,
    alternateRecordStyles: true,
    fields: [
        { name: "id",              title: "Order ID", width: 100 },
        { name: "sku",             title: "SKU",      width: 160 },
        { name: "units",           title: "Units",    width: 65, align: "right" },
        { name: "plannedMinutes",  title: "Plan min", width: 80, align: "right",
          formatCellValue: function(v) { return (v || 0).toFixed(1); }
        },
        { name: "actualMinutes",   title: "Act min",  width: 80, align: "right",
          formatCellValue: function(v) { return (v || 0).toFixed(1); }
        },
        { name: "delayMinutes",    title: "Delay",    width: 75, align: "right",
          formatCellValue: function(v) {
              if (!v && v !== 0) return "—";
              var cls = v <= 0 ? "wave-ahead" : (Math.abs(v) > 3 ? "delay-danger" : "delay-warn");
              return "<span class='" + cls + "'>" + (v > 0 ? "+" : "") + v.toFixed(1) + "m</span>";
          }
        },
        { name: "waveId",          title: "Wave",     width: 100 },
        { name: "status",          title: "Status",   width: 90,
          formatCellValue: function(v) {
              return v === "complete"
                  ? "<span class='wave-ahead'>Complete</span>"
                  : "<span class='delay-warn'>In Progress</span>";
          }
        }
    ]
});

// --- Pick tasks grid ---
isc.ListGrid.create({
    ID: "pe_pickGrid",
    autoDraw: false,
    width: "100%",
    height: "100%",
    dataSource: "pickTasksDS",
    autoFetchData: false,
    showHeaderMenuButton: false,
    alternateRecordStyles: true,
    fields: [
        { name: "id",          title: "Task ID",      width: 90  },
        { name: "orderId",     title: "Order",        width: 90  },
        { name: "sku",         title: "SKU",          width: 140 },
        { name: "waveId",      title: "Wave",         width: 90  },
        { name: "description", title: "Description",  width: "*"  },
        { name: "status",      title: "Status",       width: 90,
          formatCellValue: function(v) {
              return v === "exception"
                  ? "<span class='status-exception'>Exception</span>"
                  : "<span class='status-normal'>Normal</span>";
          }
        },
        { name: "exceptions",  title: "Exceptions",   width: 180,
          formatCellValue: function(v) {
              if (!v || v.length === 0) return "—";
              return v.join(", ");
          }
        },
        { name: "volume7Days", title: "Vol 7d",      width: 65, align: "right" }
    ]
});

// Load data into clientOnly DataSources
isc.RPCManager.sendRequest({
    actionURL: "./data/waves_flat.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try { wavesDS.setCacheData(JSON.parse(data)); pe_wavesGrid.fetchData(); } catch(e) {}
    }
});
isc.RPCManager.sendRequest({
    actionURL: "./data/orders.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try { ordersDS.setCacheData(JSON.parse(data)); pe_ordersGrid.fetchData(); } catch(e) {}
    }
});
isc.RPCManager.sendRequest({
    actionURL: "./data/pick_tasks.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try { pickTasksDS.setCacheData(JSON.parse(data)); pe_pickGrid.fetchData(); } catch(e) {}
    }
});

// --- Tabs ---
isc.TabSet.create({
    ID: "pe_tabs",
    autoDraw: false,
    width: "100%",
    height: "*",
    tabs: [
        { title: "Wave Overview",  pane: pe_wavesGrid  },
        { title: "Orders",         pane: pe_ordersGrid },
        { title: "Pick Tasks",     pane: pe_pickGrid   }
    ]
});

isc.VLayout.create({
    ID: "planExecutionScreen",
    autoDraw: false,
    width: "100%",
    height: "100%",
    members: [
        pe_kpiForm,
        pe_tabs
    ]
});
