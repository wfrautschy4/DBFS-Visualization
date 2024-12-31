
function initializeNewGraph(){
    //Reinitialize with new graph
    //Get node and edge count
    const nodeCount = document.querySelector('#nodeCount').value;
    const edgeCount = document.querySelector('#edgeCount').value - nodeCount + 1;
    const {nodes:nodes, edges:edges} = generateUndirectedConnectedGraph(nodeCount,edgeCount);
    visGraphs.add({nodes, edges});

    //Find new Destination Node
    destinationNodeID = Math.floor(Math.random() * (nodes.length-2)) + 2; //[2, nodes.length]
    Traverser.changeStartNode(getRandomNodeID(nodes.length));
    Traverser.changeDestinationNode(destinationNodeID);    
    updateDestinationNodeLabel(destinationNodeID);

    //Resize Graph Window
    visGraphs.stabilizeGraph();
    
    //Update Interface Displays and Controls
    updateStatsDisplay()
}
//
function getRandomNodeID(nodeCount){
    return Math.floor(Math.random() * (nodeCount-1)) + 1;  
}
function updateStatsDisplay(){
    const hasHamiltonianCycle = document.querySelector('.hamiltonianCycle');
    const isWeaklyConnected = document.querySelector('.weaklyConnected');
    const isStronglyConnected = document.querySelector('.stronglyConnected');

    const trueHTML = '<span style="color: green;font-weight: bold;">True</span>';
    const falseHTML = '<span style="color: red;font-weight: bold;">False</span>';

    //Update blocks
    hasHamiltonianCycle.innerHTML = Traverser.hasHamiltonianCycle() ? trueHTML : falseHTML;
    isWeaklyConnected.innerHTML = Traverser.isWeaklyConnected() ? trueHTML : falseHTML;
    isStronglyConnected.innerHTML = Traverser.isStronglyConnected() ? trueHTML : falseHTML;

    //Update Start Node and End Node Options
    const startNodeSelect = document.querySelector("#startNode");
    const endNodeSelect = document.querySelector("#endNode");

    //Clear Children and Reappend new Node Labels
    startNodeSelect.innerHTML = '<option value="random">Random</option>';
    const listOfNodeLabels = visGraphs.getGraphData().nodes.get().map(node => node.label);
    for(let i = 0; i < listOfNodeLabels.length; i++){
        const optionNode = document.createElement("option");
        optionNode.setAttribute("value", listOfNodeLabels[i]);
        optionNode.innerHTML = listOfNodeLabels[i];
        startNodeSelect.appendChild(optionNode);
    }
    endNodeSelect.innerHTML = startNodeSelect.innerHTML;
    
}

function updateDestinationNodeLabel(destNodeID){
    //Update Destination Display
    const nodeLabel = visGraphs.getGraphData().nodes.get().filter(node => (node.id == destNodeID))[0].label;
    document.querySelector("#destination").innerHTML = `Destination: ${nodeLabel}`
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function displayCycles(){
    let cycles = Traverser.findGraphCycles();
    if(cycles.length > 0){
        for(let i = 0; i < cycles.length; i++){
            await sleep(Traverser.speed);
            visGraphs.highlightGraphPath(cycles[i], 'red');          
            await sleep(Traverser.speed);
            visGraphs.removeGraphHighlights();
        }
    } else {
        alert("No cycles found in the graph.");
    }
}



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
function generateCompleteGraph(nodeCount){
    //Create nodes and create an edge to every other node
    const edges = [];
    const nodes = [];

    //Create Nodes
    for(i = 1; i <= nodeCount; i++){
        nodes.push({ id: i, label: String(i), color: { background: 'lightgray' } });
    }

    //Create Edges
    for(i = 1; i <= nodeCount; i++){
        for(j = i + 1; j <= nodeCount; j++){
            edges.push({ from: i, to: j, arrows:'to'});
        }
    }

    return { nodes, edges };
}

function generateUndirectedConnectedGraph(nodeCount, extraEdges) {
    const nodes = [];
    const edges = [];
    
    // Generate nodes
    for (let i = 1; i <= nodeCount; i++) {
        nodes.push({ id: i, label: `${i}` });
    }
    
    // Ensure the graph is connected by creating a spanning tree
    for (let i = 2; i <= nodeCount; i++) {
        const parent = Math.floor(Math.random() * (i - 1)) + 1; // Random node in the range [1, i-1]
        edges.push({ from: parent, to: i, id: `edge-${parent}-${i}` });
    }
    
    // Find all possible Edges
    const allPossibleEdges = [];
    for (let i = 1; i <= nodeCount; i++) {
        for (let j = i + 1; j <= nodeCount; j++) {
            allPossibleEdges.push({ from: i, to: j });
        }
    }
    
    // Filter out edges already in the spanning tree
    const existingEdges = new Set(edges.map(edge => `${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`));
    const remainingEdges = allPossibleEdges.filter(edge => 
        !existingEdges.has(`${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`)
    );

    // Shuffle remaining edges and add up to 'extraEdges'
    for (let i = 0; i < Math.min(extraEdges, remainingEdges.length); i++) {
        const randomIndex = Math.floor(Math.random() * remainingEdges.length);
        const newEdge = remainingEdges.splice(randomIndex, 1)[0];
        edges.push({ from: newEdge.from, to: newEdge.to, id: `edge-${newEdge.from}-${newEdge.to}` });
    }
    
    //Add hidden and reversed edges to each edge (Make them Undirected)
    const initEdgeLength = edges.length;
    for (let i = 0; i < initEdgeLength; i++){
        //Add bi-directional arrows to each existing edge
        edges[i]['arrows'] = 'to,from';

        //Add a new edges that are reversed and invisible
        edges.push({ from: edges[i].to, to: edges[i].from, hidden:true})
    }

    return { nodes, edges };
}
function updatePathDisplay(path) {
    const queueContainer = document.getElementById("queue-container");
    queueContainer.innerHTML = ""; // Clear current queue
    path.forEach(node => {
        const nodeElement = document.createElement("div");
        nodeElement.textContent = node;
        nodeElement.className = "queue-item";
        queueContainer.appendChild(nodeElement);
    });
};
function findNavigatableNodesWithBFS(graphData, startNode){
    const queue = [startNode];
    const visited = new Set();

    while(queue.length != 0){
        
        //Navigate Node
        let node = queue.shift();

        //Check if Node has been Navigated already
        if(visited.has(node)){
            continue; 
        } 
        visited.add(node); 

        //Enqueue neighbors that haven't been visited
        const neighbors = graphData.edges
        .filter(edge => edge.from === node && !visited.has(edge.to))
        .map(edge => edge.to);

        neighbors.forEach(neighbor => {
            if (!visited.has(neighbor)) {
                queue.push(neighbor);
            }
        });
    }

    return visited;
}
