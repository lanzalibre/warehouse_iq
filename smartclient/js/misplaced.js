// ============================================================================
// SCREEN: Misplaced / Not Found Items
// ListGrid with misplaced/slotting issues + detail form.
// ============================================================================

isc.DataSource.create({
    ID: "misplacedDS",
    clientOnly: true,
    fields: [
        { name: "id",              primaryKey: true, type: "text" },
        { name: "location",        type: "text"     },
        { name: "sku",             type: "text"     },
        { name: "description",     type: "text"     },
        { name: "zone",            type: "text"     },
        { name: "issueType",       type: "text"     },
        { name: "volume7Days",     type: "integer"  },
        { name: "bypassCount",     type: "integer"  },
        { name: "denialReasons",   type: "any"      },
        { name: "suggestedAction", type: "text"     },
        { name: "ignored",         type: "boolean"  },
        { name: "accumulated",     type: "any"      }
    ]
});

// Summary stats form
isc.DynamicForm.create({
    ID: "mp_statsForm",
    autoDraw: false,
    width: "100%",
    height: 60,
    numCols: 4,
    cellPadding: 10,
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    fields: [
        { name: "inventoryIssues",  title: "Inventory Issues",  type: "staticText",
          cellStyle: "kpi-value kpi-danger", titleStyle: "kpi-label" },
        { name: "slottingIssues",   title: "Slotting Issues",   type: "staticText",
          cellStyle: "kpi-value", titleStyle: "kpi-label" },
        { name: "totalBypasses",    title: "Total Bypasses",    type: "staticText",
          cellStyle: "kpi-value", titleStyle: "kpi-label" },
        { name: "ignored",          title: "Ignored",           type: "staticText",
          titleStyle: "kpi-label" }
    ]
});

// Filter form
isc.DynamicForm.create({
    ID: "mp_filterForm",
    autoDraw: false,
    width: "100%",
    numCols: 3,
    cellPadding: 6,
    fields: [
        { name: "issueType", title: "Issue Type", type: "select",
          defaultValue: "all",
          valueMap: { all: "All Types", "inventory-issue": "Inventory Issue", "slotting-issue": "Slotting Issue" },
          changed: function(form, item, value) {
              if (value === "all") mp_misplacedGrid.clearCriteria();
              else mp_misplacedGrid.filterData({ issueType: value });
          }
        },
        { name: "zone", title: "Zone", type: "select",
          defaultValue: "all",
          valueMap: { all: "All Zones", "Zone A": "Zone A", "Zone B": "Zone B",
                      "Zone C": "Zone C", "Zone D": "Zone D", "Crossdock": "Crossdock" },
          changed: function(form, item, value) {
              if (value === "all") mp_misplacedGrid.clearCriteria();
              else mp_misplacedGrid.filterData({ zone: value });
          }
        },
        { name: "ignored", title: "Show Ignored", type: "checkbox",
          defaultValue: true,
          changed: function(form, item, value) {
              if (!value) mp_misplacedGrid.filterData({ ignored: false });
              else mp_misplacedGrid.clearCriteria();
          }
        }
    ]
});

// Main grid
isc.ListGrid.create({
    ID: "mp_misplacedGrid",
    autoDraw: false,
    width: "100%",
    height: "*",
    dataSource: "misplacedDS",
    autoFetchData: false,
    showHeaderMenuButton: false,
    alternateRecordStyles: true,
    selectionType: "single",
    fields: [
        { name: "id",           title: "ID",       width: 80  },
        { name: "location",     title: "Location", width: 180 },
        { name: "zone",         title: "Zone",     width: 90  },
        { name: "sku",          title: "SKU",      width: 150 },
        { name: "description",  title: "Description", width: "*" },
        { name: "issueType",    title: "Issue Type", width: 130,
          formatCellValue: function(v) {
              if (v === "inventory-issue") return "<span class='issue-inventory'>Inventory</span>";
              if (v === "slotting-issue")  return "<span class='issue-slotting'>Slotting</span>";
              return v;
          }
        },
        { name: "volume7Days",  title: "Vol 7d",  width: 65, align: "right" },
        { name: "bypassCount",  title: "Bypasses", width: 75, align: "right",
          formatCellValue: function(v) {
              if (v > 5) return "<span class='delay-danger'>" + v + "</span>";
              return v;
          }
        },
        { name: "suggestedAction", title: "Suggested Action", width: 160 },
        { name: "ignored",      title: "Ignored", width: 70, align: "center",
          formatCellValue: function(v) {
              return v ? "<span style='color:#9ca3af'>Yes</span>" : "";
          }
        }
    ],
    dataArrived: function() {
        var rows = this.data.getRange(0, this.getTotalRows());
        var inv = 0, slot = 0, bypass = 0, ign = 0;
        rows.forEach(function(r) {
            if (r.issueType === "inventory-issue") inv++;
            else if (r.issueType === "slotting-issue") slot++;
            bypass += r.bypassCount || 0;
            if (r.ignored) ign++;
        });
        mp_statsForm.setValues({
            inventoryIssues: inv,
            slottingIssues: slot,
            totalBypasses: bypass,
            ignored: ign
        });
    }
});

// Detail form
isc.DynamicForm.create({
    ID: "mp_detailForm",
    autoDraw: false,
    width: "100%",
    numCols: 4,
    cellPadding: 8,
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    visibility: "hidden",
    fields: [
        { name: "location",       title: "Location",        type: "staticText" },
        { name: "sku",            title: "SKU",             type: "staticText" },
        { name: "zone",           title: "Zone",            type: "staticText" },
        { name: "issueType",      title: "Issue Type",      type: "staticText" },
        { name: "volume7Days",    title: "7-Day Volume",    type: "staticText" },
        { name: "bypassCount",    title: "Bypass Count",    type: "staticText" },
        { name: "suggestedAction", title: "Suggested Action", type: "staticText" },
        { name: "description",    title: "Description",     type: "staticText", colSpan: 4 }
    ]
});

// Load misplaced locations into clientOnly DataSource
isc.RPCManager.sendRequest({
    actionURL: "./data/misplaced_locations.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try { misplacedDS.setCacheData(JSON.parse(data)); mp_misplacedGrid.fetchData(); } catch(e) {}
    }
});

// Wire selection to detail form
mp_misplacedGrid.addProperties({
    selectionUpdated: function(record) {
        if (!record) return;
        mp_detailForm.show();
        mp_detailForm.setValues({
            location:       record.location,
            sku:            record.sku,
            zone:           record.zone,
            issueType:      record.issueType,
            volume7Days:    record.volume7Days,
            bypassCount:    record.bypassCount,
            suggestedAction: record.suggestedAction,
            description:    record.description
        });
    }
});

isc.VLayout.create({
    ID: "misplacedScreen",
    autoDraw: false,
    width: "100%",
    height: "100%",
    membersMargin: 0,
    members: [
        mp_statsForm,
        isc.VLayout.create({
            autoDraw: false,
            width: "100%",
            padding: 6,
            backgroundColor: "white",
            members: [mp_filterForm]
        }),
        mp_misplacedGrid,
        isc.Label.create({
            autoDraw: false, height: 26,
            contents: "<div class='section-title'>Selected Item Detail</div>"
        }),
        mp_detailForm
    ]
});
