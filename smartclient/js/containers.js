// ============================================================================
// SCREEN: Container Selection
// Master-detail: list of containers (left) + detail pane (right)
// ============================================================================

// --- DataSource (clientOnly — data loaded via RPCManager below) ---
isc.DataSource.create({
    ID: "containersDS",
    clientOnly: true,
    fields: [
        { name: "id",               primaryKey: true, type: "text"    },
        { name: "rank",             type: "integer"  },
        { name: "poNumber",         type: "text"     },
        { name: "category",         type: "text"     },
        { name: "subcategory",      type: "text"     },
        { name: "supplier",         type: "text"     },
        { name: "ageInYard",        type: "integer"  },
        { name: "palletCount",      type: "integer"  },
        { name: "estimatedUnits",   type: "integer"  },
        { name: "truckId",          type: "text"     },
        { name: "dockAssigned",     type: "text"     },
        { name: "priority",         type: "text"     },
        { name: "isRecommended",    type: "boolean"  },
        { name: "initialEstimate",  type: "any"      },
        { name: "criteria",         type: "any"      },
        { name: "recommendationReasons", type: "any" }
    ]
});

// --- Helper functions ---
function cs_getPriorityHtml(priority) {
    if (!priority) return "";
    return "<span class='priority-" + priority.toLowerCase() + "'>" +
           priority.toUpperCase() + "</span>";
}

function cs_getScoreClass(score) {
    if (score >= 0.8) return "score-excellent";
    if (score >= 0.6) return "score-good";
    if (score >= 0.4) return "score-moderate";
    return "score-poor";
}

function cs_getScoreLabel(score) {
    if (score >= 0.8) return "Excellent";
    if (score >= 0.6) return "Good";
    if (score >= 0.4) return "Moderate";
    return "Poor";
}

function cs_scoreHtml(score) {
    return "<span class='" + cs_getScoreClass(score) + "'>" +
           Math.round(score * 100) + "% (" + cs_getScoreLabel(score) + ")</span>";
}

// --- Detail pane components ---
isc.DynamicForm.create({
    ID: "cs_headerForm",
    autoDraw: false,
    width: "100%",
    numCols: 4,
    cellPadding: 8,
    colWidths: [120, "*", 120, "*"],
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    fields: [
        { name: "supplier",     title: "Supplier",     type: "staticText" },
        { name: "poNumber",     title: "PO Number",    type: "staticText" },
        { name: "category",     title: "Category",     type: "staticText" },
        { name: "ageInYard",    title: "Age in Yard",  type: "staticText",
          formatValue: function(v) {
              if (!v) return "";
              if (v >= 5) return "<span class='age-warning'>" + v + " days ⚠</span>";
              return v + " days";
          }
        },
        { name: "dockAssigned", title: "Dock",         type: "staticText" },
        { name: "truckId",      title: "Truck",        type: "staticText" },
        { name: "priority",     title: "Priority",     type: "staticText",
          formatValue: function(v) { return cs_getPriorityHtml(v); }
        },
        { name: "isRecommended", title: "Status",      type: "staticText",
          formatValue: function(v) {
              return v ? "<span class='badge-recommended'>★ RECOMMENDED</span>"
                       : "<span style='color:#9ca3af'>—</span>";
          }
        }
    ]
});

// Zone workload table for the selected container
isc.DataSource.create({
    ID: "cs_zonesDS",
    clientOnly: true,
    fields: [
        { name: "zone",  type: "text",    title: "Zone"  },
        { name: "hours", type: "float",   title: "Hours" },
        { name: "units", type: "integer", title: "Units" }
    ]
});

isc.ListGrid.create({
    ID: "cs_zoneGrid",
    autoDraw: false,
    width: "100%",
    height: 140,
    dataSource: "cs_zonesDS",
    autoFetchData: false,
    showHeaderMenuButton: false,
    canSort: false,
    alternateRecordStyles: true,
    fields: [
        { name: "zone",  title: "Zone",  width: 120 },
        { name: "hours", title: "Hours", width: 80, align: "right",
          formatCellValue: function(v) { return v ? v + "h" : "—"; }
        },
        { name: "units", title: "Units", width: 80, align: "right" }
    ]
});

isc.DynamicForm.create({
    ID: "cs_criteriaForm",
    autoDraw: false,
    width: "100%",
    numCols: 4,
    cellPadding: 6,
    fields: [
        { name: "workloadBalance",      title: "Workload Balance",    type: "staticText" },
        { name: "ageScore",             title: "Age Score",           type: "staticText" },
        { name: "processingEfficiency", title: "Efficiency",          type: "staticText" },
        { name: "overallScore",         title: "Overall",             type: "staticText" }
    ]
});

isc.HTMLPane.create({
    ID: "cs_reasonsPane",
    autoDraw: false,
    width: "100%",
    height: 80,
    overflow: "auto",
    contents: "<i style='color:#9ca3af'>Select a container to view details</i>"
});

isc.IButton.create({
    ID: "cs_acceptBtn",
    autoDraw: false,
    title: "Accept & Start Unloading",
    width: 260,
    height: 40,
    click: function() {
        var r = cs_containerList.getSelectedRecord();
        if (r) isc.say("Started unloading " + r.id + " — " + r.supplier);
    }
});

isc.VLayout.create({
    ID: "cs_detailPane",
    autoDraw: false,
    width: "100%",
    height: "100%",
    membersMargin: 10,
    padding: 12,
    backgroundColor: "#f8f9fa",
    overflow: "auto",
    members: [
        isc.Label.create({ autoDraw:false, contents:"<b>Container Details</b>", height:22 }),
        cs_headerForm,
        isc.Label.create({ autoDraw:false, contents:"<b>Workload by Zone (Initial Estimate)</b>", height:22 }),
        cs_zoneGrid,
        isc.Label.create({ autoDraw:false, contents:"<b>Selection Criteria</b>", height:22 }),
        cs_criteriaForm,
        isc.Label.create({ autoDraw:false, contents:"<b>Recommendation Reasons</b>", height:22 }),
        cs_reasonsPane,
        isc.HLayout.create({
            autoDraw:false, width:"100%", height:50, align:"center",
            members: [cs_acceptBtn]
        })
    ]
});

// --- Master list ---
isc.DynamicForm.create({
    ID: "cs_filterForm",
    autoDraw: false,
    width: "100%",
    numCols: 2,
    cellPadding: 6,
    fields: [
        { name: "priority", title: "Priority", type: "select",
          defaultValue: "all",
          valueMap: { all: "All", urgent: "Urgent", high: "High", normal: "Normal" },
          changed: function(form, item, value) {
              if (value === "all") cs_containerList.clearCriteria();
              else cs_containerList.filterData({ priority: value });
          }
        },
        { name: "supplier", title: "Supplier", type: "text", width: 120,
          changed: function(form, item, value) {
              if (value) cs_containerList.filterData({ supplier: value });
              else cs_containerList.clearCriteria();
          }
        }
    ]
});

isc.ListGrid.create({
    ID: "cs_containerList",
    autoDraw: false,
    width: "100%",
    height: "*",
    dataSource: "containersDS",
    autoFetchData: false,
    selectionType: "single",
    alternateRecordStyles: true,
    showHeaderMenuButton: false,
    fields: [
        { name: "rank",     title: "#",        width: 35, align: "center",
          formatCellValue: function(v, r) {
              if (r.isRecommended) return "<span class='badge-recommended'>★" + v + "</span>";
              return v;
          }
        },
        { name: "supplier", title: "Supplier", width: 100 },
        { name: "priority", title: "Pri",      width: 50, align: "center",
          formatCellValue: function(v) { return cs_getPriorityHtml(v); }
        },
        { name: "ageInYard", title: "Age",     width: 45, align: "center",
          formatCellValue: function(v) {
              if (v >= 5) return "<span class='age-warning'>" + v + "d</span>";
              return v + "d";
          }
        },
        { name: "id",       title: "Container", width: 100 },
        { name: "dockAssigned", title: "Dock",  width: 70 }
    ],
    selectionUpdated: function(record) {
        if (!record) return;
        cs_headerForm.setValues({
            supplier:     record.supplier,
            poNumber:     record.poNumber,
            category:     record.category + " / " + record.subcategory,
            ageInYard:    record.ageInYard,
            dockAssigned: record.dockAssigned,
            truckId:      record.truckId,
            priority:     record.priority,
            isRecommended: record.isRecommended
        });

        // Zone workload from initialEstimate.byZone (object keyed by zone name)
        var est = record.initialEstimate || {};
        var byZoneObj = est.byZone || {};
        var byZoneArr = Object.keys(byZoneObj).map(function(zoneName) {
            return { zone: zoneName, hours: byZoneObj[zoneName].hours, units: byZoneObj[zoneName].units };
        });
        cs_zonesDS.setCacheData(byZoneArr);
        cs_zoneGrid.fetchData();

        // Criteria (each sub-criterion is {score, label}, overall is a plain number)
        var c = record.criteria || {};
        cs_criteriaForm.setValues({
            workloadBalance:      cs_scoreHtml((c.workloadBalance && c.workloadBalance.score) || 0),
            ageScore:             cs_scoreHtml((c.ageScore && c.ageScore.score) || 0),
            processingEfficiency: cs_scoreHtml((c.processingEfficiency && c.processingEfficiency.score) || 0),
            overallScore:         cs_scoreHtml(c.overall || 0)
        });

        // Reasons
        var reasons = record.recommendationReasons || [];
        if (reasons.length > 0) {
            var html = "<ul style='margin:0; padding-left:16px; font-size:12px;'>";
            reasons.forEach(function(r) { html += "<li>" + r + "</li>"; });
            html += "</ul>";
            cs_reasonsPane.setContents(html);
        } else {
            cs_reasonsPane.setContents("<i style='color:#9ca3af'>No recommendation reasons</i>");
        }

        cs_acceptBtn.setTitle("Accept & Start Unloading — " + record.id);
    },
    dataArrived: function() {
        if (this.getTotalRows() > 0) this.selectSingleRecord(0);
    }
});

// --- Load plain-array JSON into clientOnly DataSource ---
isc.RPCManager.sendRequest({
    actionURL: "./data/containers.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try {
            containersDS.setCacheData(JSON.parse(data));
            cs_containerList.fetchData();
        } catch(e) {}
    }
});

// --- Screen root layout ---
isc.VLayout.create({
    ID: "containersScreen",
    autoDraw: false,
    width: "100%",
    height: "100%",
    members: [
        isc.HLayout.create({
            autoDraw: false,
            width: "100%",
            height: "100%",
            members: [
                // Left sidebar
                isc.VLayout.create({
                    autoDraw: false,
                    width: 340,
                    height: "100%",
                    backgroundColor: "#f8f9fa",
                    members: [
                        isc.Label.create({
                            autoDraw: false, height: 34,
                            contents: "<div class='section-title'>Containers — Not Yet Processed (312)</div>"
                        }),
                        isc.VLayout.create({
                            autoDraw: false, width: "100%", padding: 6,
                            backgroundColor: "white",
                            members: [cs_filterForm]
                        }),
                        cs_containerList
                    ]
                }),
                cs_detailPane
            ]
        })
    ]
});
