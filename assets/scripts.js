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

