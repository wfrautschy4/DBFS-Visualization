// Random graph generation
function generateRandomGraph() {
    const nodeCount = Math.floor(Math.random() * 11) + 20; // Random number between 5 and 15
    const nodes = [];
    const edges = [];

    // Create sequentially numbered nodes
    for (let i = 1; i <= nodeCount; i++) {
        nodes.push({ id: i, label: String(i), color: { background: 'lightgray' } });
    }

    // Ensure all nodes are connected
    for (let i = 1; i <= nodeCount; i++) {
        const connections = Math.floor(Math.random() * 3) + 1; // Random number of edges [1-3]
        for (let j = 0; j < connections; j++) {
            let targetNode = Math.floor(Math.random() * nodeCount) + 1;
            while (targetNode === i || edges.some(edge => (edge.from === i && edge.to === targetNode) || (edge.from === targetNode && edge.to === i))) {
                targetNode = Math.floor(Math.random() * nodeCount) + 1;
            }
            if(!objectExistsInArrOfObjects(edges, {from: i, to: targetNode})){
                edges.push({ from: i, to: targetNode, arrows:'to,from'});
            }

            if(!objectExistsInArrOfObjects(edges, {from: targetNode, to: i})){
                edges.push({ from: targetNode, to: i, hidden:true});
            }

        }
    }
    return { nodes, edges };
};
function generateGraphToGetHome(){
    const nodes = [];
    const edges = [];

    //Create all Nodes
    nodes.push({id: 1, label: "Baker Systems", color: {background: 'lightgray'}});
    nodes.push({id: 2, label: "18th Ave Lib", color: {background: 'lightgray'}});
    nodes.push({id: 3, label: "Curl Market", color: {background: 'lightgray'}});
    nodes.push({id: 4, label: "High Street", color: {background: 'lightgray'}});
    nodes.push({id: 5, label: "Old Man's Home", color: {background: 'lightgray'}});
    nodes.push({id: 6, label: "Cockins Hall", color: {background: 'lightgray'}});
    nodes.push({id: 7, label: "Enarson Classroom", color: {background: 'lightgray'}});
    nodes.push({id: 8, label: "McPherson Lab", color: {background: 'lightgray'}});
    nodes.push({id: 9, label: "Panda Express", color: {background: 'lightgray'}});
    nodes.push({id: 10, label: "Target", color: {background: 'lightgray'}});
    nodes.push({id: 11, label: "Donatos", color: {background: 'lightgray'}});
    nodes.push({id: 12, label: "Dreese Labs", color: {background: 'lightgray'}});


    //Create all Edges
    edges.push({from: 1, to: 12, arrows: 'to'});
    edges.push({from: 1, to: 7, arrows: 'to'});
    edges.push({from: 1, to: 6, arrows: 'to'});
    edges.push({from: 6, to: 7, arrows: 'to'});
    edges.push({from: 3, to: 4, arrows: 'to'});
    edges.push({from: 4, to: 10, arrows: 'to'});
    edges.push({from: 4, to: 9, arrows: 'to'});
    edges.push({from: 4, to: 11, arrows: 'to'});
    edges.push({from: 2, to: 8, arrows: 'to'});
    edges.push({from: 1, to: 2, arrows: 'to'});
    edges.push({from: 8, to: 3, arrows: 'to'});
    edges.push({from: 4, to: 5, arrows: 'to'});




    return {nodes, edges};
}

function objectExistsInArrOfObjects(array, object){
    objectExists = false;
    array.forEach((item) => {
        hasAllAttr = true;
        for (const atr in object){
            if(item[atr] != object[atr]){
                hasAllAttr = false;
            }
        }
        objectExists = hasAllAttr;
    });
        
    return objectExists;
}
function highlightTreePath(path) {
    // Highlight nodes in the shortest path
    path.forEach((nodeId, index) => {
        // Highlight the node
        treeData.nodes.update({
            id: nodeId,
            color: { background: 'gold' }, // Set a unique color to highlight
            font: { color: 'black', bold: true },
        });

        // Highlight the edge to the next node in the path (if not the last node)
        if (index < path.length - 1) {
            const parentNode = nodeId;
            const childNode = path[index + 1];

            // Update the edge color
            treeData.edges.update({
                from: parentNode,
                to: childNode,
                color: { color: 'gold', highlight: 'gold' },
                width: 2,
            });
        }
    });

    networkTree.redraw(); // Redraw the tree to reflect the changes
};

function highlightGraphPath(path) {
    // Highlight nodes in the shortest path on the graph
    path.forEach((nodeId, index) => {
        // Highlight the node
        graphData.nodes.update({
            id: nodeId,
            color: { background: 'gold' }, // Set a unique color to highlight
            font: { color: 'black', bold: true },
        });

        // Highlight the edge to the next node in the path (if not the last node)
        if (index <= path.length) {
            const parentNode = nodeId;
            const childNode = path[index + 1];

            // Update the edge color
            graphData.edges.update({
                id: getEdgeId(childNode, parentNode),
                color: { color: 'gold', highlight: 'gold' },
                width: 2,
            });
        }
    });

    networkGraph.redraw(); // Redraw the graph to reflect the changes
};

// Queue management functions
function updateStackDisplay(path) {
    const stackContainer = document.getElementById("stack-container");
    stackContainer.innerHTML = ""; // Clear current queue
    path.forEach(node => {
        const nodeElement = document.createElement("div");
        nodeElement.textContent = node;
        nodeElement.className = "stack-item";
        stackContainer.appendChild(nodeElement);
    });
};

function updateQueueDisplay(path) {
    const queueContainer = document.getElementById("queue-container");
    queueContainer.innerHTML = ""; // Clear current queue
    path.forEach(node => {
        const nodeElement = document.createElement("div");
        nodeElement.textContent = node;
        nodeElement.className = "queue-item";
        queueContainer.appendChild(nodeElement);
    });
};

function getEdgeId(childNode, parentNode) {
    // Find the edge that connects the parent to the child and is not hidden
    const matchingEdge = graphData.edges.get().find(edge => 
     (edge.from === parentNode && edge.to === childNode) || 
     (edge.from == childNode && edge.to == parentNode) && 
     !edge.hidden // Check if the edge is not hidden
    );

    // Return the ID of the matching edge, or null if none found
    return matchingEdge ? matchingEdge.id : null;
}

