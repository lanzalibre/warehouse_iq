// ============================================================================
// APP SHELL — Main navigation and site header
// Assembles all screens into a TabSet with a header bar showing site stats.
// ============================================================================

// Site stats label (populated from site_stats.json)
isc.Label.create({
    ID: "appHeaderStats",
    autoDraw: false,
    width: "100%",
    height: 40,
    overflow: "hidden",
    backgroundColor: "#1e3a5f",
    contents: "<div class='app-header'>SpinnakerSCA — Warehouse Intelligence &nbsp;&nbsp;" +
              "<span style='font-size:12px; opacity:0.7; font-weight:400'>Loading stats...</span></div>"
});

// Load site stats and update header
isc.RPCManager.sendRequest({
    actionURL: "./data/site_stats.json",
    httpMethod: "GET",
    serverOutputAsString: true,
    callback: function(rpcResponse, data) {
        try {
            var s = JSON.parse(data);
            appHeaderStats.setContents(
                "<div class='app-header'>SpinnakerSCA — Warehouse Intelligence" +
                " &nbsp;|&nbsp; Throughput: <b>" + s.todayThroughput + " units</b>" +
                " &nbsp;|&nbsp; Dock Util: <b>" + s.dockUtilization + "%</b>" +
                " &nbsp;|&nbsp; Active Teams: <b>" + s.activeTeams + "</b>" +
                " &nbsp;|&nbsp; Pending Containers: <b>" + s.pendingContainers + "</b>" +
                " &nbsp;|&nbsp; SLA Risk: <b style='color:#fbbf24'>" + s.slaRiskCount + "</b>" +
                "</div>"
            );
        } catch(e) {}
    }
});

// Main navigation TabSet
isc.TabSet.create({
    ID: "mainTabs",
    autoDraw: false,
    width: "100%",
    height: "*",
    tabs: [
        { title: "Container Selection",  ID: "tab_containers",    pane: containersScreen    },
        { title: "Unloading Bay",        ID: "tab_unloading",     pane: unloadingScreen     },
        { title: "Labor Management",     ID: "tab_labor",         pane: laborScreen         },
        { title: "Plan vs Execution",    ID: "tab_plan",          pane: planExecutionScreen },
        { title: "Misplaced Items",      ID: "tab_misplaced",     pane: misplacedScreen     },
        { title: "Delay Patterns",       ID: "tab_delay",         pane: delayScreen         },
        { title: "Reslotting (MFA)",     ID: "tab_reslotting",    pane: reslottingScreen    }
    ]
});

// Root layout — assembles header + tabs
isc.VLayout.create({
    ID: "appRoot",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    members: [
        appHeaderStats,
        mainTabs
    ]
});
