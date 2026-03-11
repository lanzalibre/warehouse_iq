/**
 * Container Selection - SmartClient UI Components
 *
 * This module defines all UI components bound to the containersDS DataSource.
 * Data is loaded from data/containers.json via RestDataSource.
 */

// ============================================================================
// DATA SOURCES
// ============================================================================

// Main containers DataSource - fetches from plain JSON array file
isc.RestDataSource.create({
    ID: "containersDS",
    dataFormat: "json",
    jsonPrefix: "",
    jsonSuffix: "",
    dataURL: "./data/containers.json",
    init: function() {
        this.Super("init", arguments);
        this.jsonPrefix = "";
        this.jsonSuffix = "";
        this.recordXPath = null;
    },
    transformResponse: function(dsResponse, dsRequest, data) {
        if (isc.isAn.Array(data)) {
            dsResponse.status = 0;
            dsResponse.data = data;
            dsResponse.totalRows = data.length;
        }
        return dsResponse;
    },
    fields: [
        { name: "id", primaryKey: true, type: "text", hidden: true },
        { name: "rank", type: "integer", title: "#" },
        { name: "poNumber", type: "text", title: "PO Number" },
        { name: "category", type: "text", title: "Category" },
        { name: "subcategory", type: "text", title: "Subcategory" },
        { name: "supplier", type: "text", title: "Supplier" },
        { name: "ageInYard", type: "integer", title: "Age (days)" },
        { name: "palletCount", type: "integer", title: "Pallets" },
        { name: "estimatedUnits", type: "integer", title: "Units" },
        { name: "truckId", type: "text", title: "Truck" },
        { name: "dockAssigned", type: "text", title: "Dock" },
        { name: "priority", type: "text", title: "Priority" },
        { name: "isRecommended", type: "boolean", title: "Recommended" },
        { name: "totalHours", type: "float", title: "Hours" },
        { name: "certainty", type: "integer", title: "Certainty" },
        { name: "workloadBalance", type: "float", title: "Workload" },
        { name: "ageScore", type: "float", title: "Age Score" },
        { name: "processingEfficiency", type: "float", title: "Efficiency" },
        { name: "overallScore", type: "float", title: "Overall" },
        { name: "recommendationReasons", type: "any", title: "Reasons" },
        { name: "zones", type: "any", title: "Zones" }
    ]
});

// Zones DataSource for detail pane (client-only, populated from selected container)
isc.DataSource.create({
    ID: "zonesDS",
    clientOnly: true,
    fields: [
        { name: "zone", type: "text", title: "Zone" },
        { name: "name", type: "text", title: "Name" },
        { name: "hours", type: "float", title: "Hours" },
        { name: "units", type: "integer", title: "Units" },
        { name: "cssClass", type: "text", title: "CSS Class" }
    ]
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getPriorityClass(priority) {
    return "priority-" + priority.toLowerCase();
}

function getScoreClass(score) {
    if (score >= 0.8) return "score-excellent";
    if (score >= 0.6) return "score-good";
    if (score >= 0.4) return "score-moderate";
    return "score-poor";
}

function getScoreLabel(score) {
    if (score >= 0.8) return "Excellent";
    if (score >= 0.6) return "Good";
    if (score >= 0.4) return "Moderate";
    return "Poor";
}

function createZoneCard(zoneData) {
    return isc.VLayout.create({
        autoDraw: false,
        width: 140,
        height: 90,
        styleName: "zone-card " + zoneData.cssClass,
        members: [
            isc.Label.create({
                autoDraw: false,
                contents: "<b>" + zoneData.zone + "</b>",
                width: "100%",
                height: 18,
                align: "center"
            }),
            isc.Label.create({
                autoDraw: false,
                contents: "<span style='font-size:10px; color:#666;'>" + zoneData.name + "</span>",
                width: "100%",
                height: 14,
                align: "center"
            }),
            isc.Label.create({
                autoDraw: false,
                contents: "<span style='font-size:16px; font-weight:bold;'>" + zoneData.hours + "h</span>",
                width: "100%",
                height: 22,
                align: "center"
            }),
            isc.Label.create({
                autoDraw: false,
                contents: "<span style='font-size:11px; color:#666;'>" + (zoneData.units || "—") + " units</span>",
                width: "100%",
                height: 18,
                align: "center"
            })
        ]
    });
}

function updateDetailPane(record) {
    if (!record) return;

    // Update header form
    containerHeaderForm.setValues({
        supplier: record.supplier,
        category: record.category + " - " + record.subcategory,
        poNumber: record.poNumber,
        ageInYard: record.ageInYard
    });

    // Update zones
    if (record.zones && record.zones.length > 0) {
        var zoneCards = record.zones.map(function(zone) {
            return createZoneCard(zone);
        });
        zoneCardsLayout.setMembers(zoneCards);
    }

    // Update criteria form
    criteriaForm.setValues({
        workloadBalance: "<span class='" + getScoreClass(record.workloadBalance) + "'>" +
            Math.round(record.workloadBalance * 100) + "% (" + getScoreLabel(record.workloadBalance) + ")</span>",
        ageScore: "<span class='" + getScoreClass(record.ageScore) + "'>" +
            Math.round(record.ageScore * 100) + "% (" + getScoreLabel(record.ageScore) + ")</span>",
        processingEfficiency: "<span class='" + getScoreClass(record.processingEfficiency) + "'>" +
            Math.round(record.processingEfficiency * 100) + "% (" + getScoreLabel(record.processingEfficiency) + ")</span>",
        overallScore: "<span class='" + getScoreClass(record.overallScore) + "'><b>" +
            Math.round(record.overallScore * 100) + "%</b></span>"
    });

    // Update recommendations
    if (record.recommendationReasons && record.recommendationReasons.length > 0) {
        var html = "<ul style='margin:0; padding-left:20px; font-size:12px;'>";
        record.recommendationReasons.forEach(function(reason) {
            html += "<li style='margin-bottom:4px;'>" + reason + "</li>";
        });
        html += "</ul>";
        recommendationsContent.setContents(html);
        recommendationsHeader.setContents("<b style='color:#16a34a;'>★ Recommended Container</b>");
    } else {
        recommendationsContent.setContents("<i style='color:#9ca3af;'>No specific recommendations</i>");
        recommendationsHeader.setContents("<b>Recommendation Reasons</b>");
    }

    // Update button
    acceptButton.setTitle("Accept & Start Unloading " + record.id);
}

// ============================================================================
// DETAIL PANE COMPONENTS
// ============================================================================

isc.DynamicForm.create({
    ID: "containerHeaderForm",
    autoDraw: false,
    width: "100%",
    numCols: 4,
    cellPadding: 8,
    colWidths: [100, "*", 100, "*"],
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    fields: [
        { name: "supplier", title: "Supplier", type: "staticText" },
        { name: "poNumber", title: "PO Number", type: "staticText" },
        { name: "category", title: "Category", type: "staticText" },
        { name: "ageInYard", title: "Age in Yard", type: "staticText",
          formatCellValue: function(value) {
              if (value >= 5) return "<span class='age-warning'>" + value + " days</span>";
              return value + " days";
          }
        }
    ]
});

isc.HLayout.create({
    ID: "zoneCardsLayout",
    autoDraw: false,
    width: "100%",
    height: 110,
    padding: 10,
    membersMargin: 12,
    members: []
});

isc.DynamicForm.create({
    ID: "criteriaForm",
    autoDraw: false,
    width: "100%",
    numCols: 4,
    cellPadding: 6,
    fields: [
        { name: "workloadBalance", title: "Workload", type: "staticText" },
        { name: "ageScore", title: "Age Score", type: "staticText" },
        { name: "processingEfficiency", title: "Efficiency", type: "staticText" },
        { name: "overallScore", title: "Overall", type: "staticText" }
    ]
});

isc.Label.create({
    ID: "recommendationsHeader",
    autoDraw: false,
    contents: "<b>Recommendation Reasons</b>",
    width: "100%",
    height: 24
});

isc.HTMLPane.create({
    ID: "recommendationsContent",
    autoDraw: false,
    width: "100%",
    height: 80,
    overflow: "auto",
    contents: "<i>Select a container to view details</i>"
});

isc.IButton.create({
    ID: "acceptButton",
    autoDraw: false,
    title: "Accept & Start Unloading",
    width: 280,
    height: 44,
    icon: "[SKIN]/actions/approve.png",
    click: function() {
        var record = containerList.getSelectedRecord();
        if (record) {
            isc.say("Started unloading " + record.id + " (" + record.supplier + ")");
        }
    }
});

// ============================================================================
// MASTER LISTGRID
// ============================================================================

isc.ListGrid.create({
    ID: "containerList",
    autoDraw: false,
    width: "100%",
    height: "100%",
    dataSource: "containersDS",
    autoFetchData: true,
    selectionType: "single",
    alternateRecordStyles: true,
    showRowNumbers: false,
    fields: [
        { name: "rank", width: 35, align: "center",
          formatCellValue: function(value, record) {
              if (record.isRecommended) {
                  return "<span style='color:#16a34a; font-weight:bold;'>★" + value + "</span>";
              }
              return value;
          }
        },
        { name: "supplier", width: 100 },
        { name: "priority", width: 45, align: "center",
          formatCellValue: function(value) {
              return "<span class='" + getPriorityClass(value) + "'>" + value.substring(0,1).toUpperCase() + "</span>";
          }
        },
        { name: "ageInYard", width: 40, align: "center",
          formatCellValue: function(value) {
              if (value >= 5) return "<span class='age-warning'>" + value + "d</span>";
              return value + "d";
          }
        },
        { name: "totalHours", width: 50, align: "center",
          formatCellValue: function(value) {
              return "<span style='color:#3b82f6; font-weight:500;'>" + value + "</span>";
          }
        },
        { name: "certainty", width: 40, align: "center" }
    ],
    selectionUpdated: function(record) {
        updateDetailPane(record);
    },
    dataArrived: function(startRow, endRow) {
        if (startRow === 0 && this.getTotalRows() > 0) {
            this.selectSingleRecord(0);
        }
    }
});

// ============================================================================
// FILTER FORM
// ============================================================================

isc.DynamicForm.create({
    ID: "filterForm",
    autoDraw: false,
    width: "100%",
    numCols: 2,
    cellPadding: 6,
    fields: [
        {
            name: "priorityFilter",
            title: "Priority",
            type: "select",
            defaultValue: "all",
            width: 100,
            valueMap: { all: "All", urgent: "Urgent", high: "High+", normal: "Normal+" },
            changed: function(form, item, value) {
                if (value === "all") {
                    containerList.filterData();
                } else if (value === "urgent") {
                    containerList.filterData({ priority: "urgent" });
                } else if (value === "high") {
                    containerList.filterData({ priority: ["urgent", "high"] });
                } else {
                    containerList.filterData({ priority: ["urgent", "high", "normal"] });
                }
            }
        },
        {
            name: "search",
            title: "Search",
            type: "text",
            width: 100,
            changed: function(form, item, value) {
                if (value) {
                    containerList.filterData({
                        _or: [{ supplier: value }, { id: value }, { category: value }]
                    });
                } else {
                    containerList.filterData();
                }
            }
        }
    ]
});

// ============================================================================
// LAYOUTS
// ============================================================================

// Detail Pane
isc.VLayout.create({
    ID: "detailPane",
    autoDraw: false,
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f2f5",
    membersMargin: 12,
    padding: 16,
    members: [
        containerHeaderForm,
        isc.Label.create({ autoDraw: false, contents: "<b>Workload Distribution by Zone</b>", width: "100%", height: 24 }),
        zoneCardsLayout,
        isc.VLayout.create({
            autoDraw: false,
            width: "100%",
            padding: 10,
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            members: [
                isc.Label.create({ autoDraw: false, contents: "<b>Selection Criteria</b>", width: "100%", height: 24 }),
                criteriaForm
            ]
        }),
        isc.VLayout.create({
            autoDraw: false,
            width: "100%",
            padding: 10,
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            members: [recommendationsHeader, recommendationsContent]
        }),
        isc.HLayout.create({
            autoDraw: false,
            width: "100%",
            height: 60,
            align: "center",
            members: [acceptButton]
        })
    ]
});

// Left Sidebar
isc.VLayout.create({
    ID: "leftSidebar",
    autoDraw: false,
    width: 320,
    height: "100%",
    backgroundColor: "#f8f9fa",
    membersMargin: 0,
    members: [
        isc.Label.create({
            autoDraw: false,
            contents: "<div style='font-size:15px; font-weight:600; color:#1e3a5f;'>Container Selection</div>",
            width: "100%",
            height: 36,
            padding: 10,
            backgroundColor: "white",
            border: "1px solid #e5e7eb"
        }),
        isc.VLayout.create({
            autoDraw: false,
            width: "100%",
            padding: 8,
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            members: [filterForm]
        }),
        isc.Label.create({
            autoDraw: false,
            contents: "<span style='color:#3b82f6;'>●</span> NOT YET PROCESSED (312)",
            width: "100%",
            height: 28,
            padding: 6,
            backgroundColor: "#f3f4f6"
        }),
        containerList
    ]
});

// Main Layout
isc.VLayout.create({
    ID: "mainLayout",
    width: "100%",
    height: "100%",
    members: [
        isc.Label.create({
            autoDraw: false,
            contents: "<div class='header-bar'>SpinnakerSCA Warehouse Intelligence - Container Prioritization</div>",
            width: "100%",
            height: 44,
            overflow: "hidden"
        }),
        isc.HLayout.create({
            autoDraw: false,
            width: "100%",
            height: "*",
            members: [leftSidebar, detailPane]
        })
    ]
});
