const visGraph = class visGraphs {
    //------------- Constructor ----------------------------------------------------
    constructor(graphDiv, treeDiv) {
        //Initialize Empty 
        this.graphData = {nodes: new vis.DataSet(), edges: new vis.DataSet()};
        const optionsGraph = {physics: { enabled: true }};
        this.networkGraph = new vis.Network(graphDiv, this.graphData, optionsGraph);

        //Initialize Vis.js Tree
        this.treeData = { nodes: new vis.DataSet(), edges: new vis.DataSet()};
        const optionsTree = {
            layout: { 
                hierarchical: { 
                    levelSeparation: 150,
                    treeSpacing: 200,
                    blockShifting: true,
                    edgeMinimization: true,
                    parentCentralization: true,
                    direction: 'UD',
                    nodeSpacing: 300,
                    sortMethod: "directed" //directed,hubsize 
                } 
            },
            physics: { enabled: false},
            interaction: {
                dragNodes: false, // Keep nodes fixed in hierarchy
                zoomView: false,
                dragView: false,
            },
            autoResize: true
        };
        this.networkTree = new vis.Network(treeDiv, this.treeData, optionsTree);
    }
    //--------------- Highlight Methods ------------------------------------------------
    highlightGraphNodes(nodeIDPath, color){
        // Highlight nodes in the shortest path on the graph
        nodeIDPath.forEach((nodeId) => {
            // Highlight the node
            this.graphData.nodes.update({
                id: nodeId,
                color: { background: color }, // Set a unique color to highlight
                font: { color: 'black', bold: true },
            });
        });

        this.networkGraph.redraw(); // Redraw the graph to reflect the changes
    }
    highlightGraphEdges(nodeIDPath, color){
        for(let i = 0; i < nodeIDPath.length - 1; i++){
            // Highlight the edge to the next node in the path (if not the last node)
            const parentNode = nodeIDPath[i];
            const childNode = nodeIDPath[i + 1];

            // Update the edge color
            this.graphData.edges.update({
                id: this.getEdgeId(childNode, parentNode),
                color: { color: color, highlight: color },
                width: 2,
            });
        }
        this.networkGraph.redraw(); // Redraw the graph to reflect the changes
    }
    highlightGraphPath(nodeIDPath, color){
        this.highlightGraphNodes(nodeIDPath, color);
        this.highlightGraphEdges(nodeIDPath, color);
    }
    highlightTreePath(nodeIDPath, color){
        // Highlight nodes in the shortest path
        nodeIDPath.forEach((nodeId, index) => {
            // Highlight the node
            this.treeData.nodes.update({
                id: nodeId,
                color: { background: color }, // Set a unique color to highlight
                font: { color: 'black', bold: true },
            });

            // Highlight the edge to the next node in the path (if not the last node)
            if (index < nodeIDPath.length - 1) {
                const parentNode = nodeId;
                const childNode = nodeIDPath[index + 1];

                // Update the edge color
                this.treeData.edges.update({
                    from: parentNode,
                    to: childNode,
                    color: { color: color, highlight: color },
                    width: 2,
                });
            }
        });

        this.networkTree.redraw(); // Redraw the tree to reflect the changes
    }
    removeGraphHighlights(){
        // Remove highlights from all nodes
        this.graphData.nodes.forEach((node) => {
            this.graphData.nodes.update({
                id: node.id,
                color: { background: '#97C2FC' }, // Reset the node color
                font: { color: 'black', bold: false },
            });
        });

        //Remove highlights from all edges
        this.graphData.edges.forEach((edge) => {
            this.graphData.edges.update({
                id: edge.id,
                color: { color: '#97C2FC', highlight: '#97C2FC' }, // Reset the edge color
                width: 1,
            });
        });

        this.networkGraph.redraw(); // Redraw the graph to reflect the changes
    }
    //------------------------------------------------------------------------------------------



    //----------- Functionality ----------------------------------------------------
    clear() {
        //Clear Previous Graphs
        this.graphData.nodes.clear();
        this.graphData.edges.clear();
        this.treeData.nodes.clear(); 
        this.treeData.edges.clear();
    }
    add(data) {
        this.graphData.nodes.add(data.nodes);
        this.graphData.edges.add(data.edges);
    }
    addNodeToTree(parent, node){
        const nodeLabel = this.getNodeLabel(node);
        this.treeData.nodes.add({id: node, label: nodeLabel});
        if(parent !== undefined) {
            this.treeData.edges.add({ from: parent, to: node});
        }
    }
    //----------- Retrieve Data ----------------------------------------------------------------
    getGraphData(){
        return this.graphData;
    }
    getTreeData(){
        return this.treeData;
    }
    getNeighbors(node){
        return this.graphData.edges.get().filter(edge => edge.from === node).map(edge => edge.to);
    }
    stabilizeGraph(){
        this.networkGraph.stabilize();
    }
    stabilizeTree() {
        this.networkTree.stabilize();
    }
    getNodeLabel(node){
        return this.graphData.nodes.get(node).label;
    }
    getGraphNode(nodeID){
        return this.graphData.nodes.get(nodeID);
    }
    getGraphNodeCount(){
        return this.graphData.nodes.length;
    }
    //------------------------------------------------------------------------------------------
    getEdgeId(childNode, parentNode) {
        // Find the edge that connects the parent to the child and is not hidden
        const matchingEdge = this.graphData.edges.get().find(edge => 
         (edge.from === parentNode && edge.to === childNode) || 
         (edge.from == childNode && edge.to == parentNode) && 
         !edge.hidden // Check if the edge is not hidden
        );
    
        // Return the ID of the matching edge, or null if none found
        return matchingEdge ? matchingEdge.id : null;
    }
};
