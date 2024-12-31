const GraphTraverser = class Traverser {
    constructor(visGraphs){
        this.visGraphs = visGraphs;

        // Init Traversal Variables
        this.traversalNodeList = [];
        this.visited = new Set();
        this.parent = {}; // Stores the parent of each node
        this.shortestPath = [];
        this.destinationFound = false; // Check if destination is found
        this.isTraversing = false; // Check if program has started traversing
        this.startNode = 1;
        this.destinationNode = 1;
        this.traversalNodeList.push(this.startNode);
        this.cycles = [];

        //Environmental Variables
        this.speed = 700;
        this.autoNavigate = true;
        this.navAllNeighbors = true; 

        //Init Navigation Method States
        this.navMethods = Object.freeze({
            BREADTH:   "breadth",
            DEPTH:  "depth"
        });
        this.navMethod = this.navMethods.BREADTH;
    }
    //--------- Navigation -----------------------------
    traverseStep(){
        //Check if traversal is over
        if(this.traversalNodeList.length == 0 || this.destinationFound){
            return;
        }

        //Traverse the next node
        this.isTraversing = true;
        if(this.navMethod == this.navMethods.BREADTH){
            this.#breadthStep();
        } else if (this.navMethod == this.navMethods.DEPTH){
            this.#depthStep();
        }
    }
    #breadthStep(){
        //Dequeue current node
        const currentNode = this.traversalNodeList.shift();

        //Check if node has been visited
        if(this.visited.has(currentNode)){
            this.#breadthStep(); //Call itself again
            return;
        }

        //Traverse the node
        this.#traverseNode(currentNode);
    }

    #depthStep(){
        //Pop current node
        const currentNode = this.traversalNodeList.pop();

        //Check if node has been visited
        if(this.visited.has(currentNode)){
            this.#depthStep(); //Call itself again
            return;
        }

        //Traverse the node
        this.#traverseNode(currentNode);
    }
    #traverseNode(node){
        //Mark the node as visited
        this.visited.add(node);

        //Highlight Node being traversed
        this.visGraphs.highlightGraphNodes([node], 'red');

        //Check if desination is found
        if(node == this.destinationNode){
            this.#destinationFound();
            return;
        }

        //Wait to make it seems like a node is being "processed"
        setTimeout(() => {
            if(this.destinationFound){return;}
        
            //Mark the node as processed (green)
            this.visGraphs.highlightGraphNodes([node], 'green');

            //Add Node to Tree Graph
            this.visGraphs.addNodeToTree(this.parent[node], node);
            this.visGraphs.stabilizeTree();

            // Enqueue neighbors that haven't been visited
            const neighbors = this.visGraphs.getNeighbors(node).filter(node => !this.visited.has(node));
            neighbors.forEach(neighbor => {
                if (!this.visited.has(neighbor) && !this.parent[neighbor]) {
                    // Assign parent only if it's not already assigned
                    this.parent[neighbor] = node;
                    this.traversalNodeList.push(neighbor);
                }
            });
        }, this.speed);

        if (this.navAllNeighbors && (this.navMethod != this.navMethods.DEPTH)) {
            for (let i = 0; i < this.traversalNodeList.length; i++) {
                this.traverseStep();
            }
        }
        
        if (this.autoNavigate && !this.destinationFound) {
            setTimeout(() => {
                this.traverseStep();
            }, this.speed);
        }
    }

    #destinationFound(){
        this.destinationFound = true;
        this.isTraversing = false;

        //Add Destination Node to Tree Graph
        this.visGraphs.addNodeToTree(this.parent[this.destinationNode], this.destinationNode);
        this.visGraphs.stabilizeTree();

        //Find shortest path
        this.shortestPath = this.#findShortestPath(this.destinationNode);
        const shortestPathLabels = this.shortestPath.map(nodeID => this.visGraphs.getNodeLabel(nodeID));
        
        //Highlight graphs and update shortest path queue
        this.visGraphs.highlightTreePath(this.shortestPath, 'gold');
        this.visGraphs.highlightGraphPath(this.shortestPath, 'gold');
        this.visGraphs.stabilizeTree();

        //Update Display for shortestPath
        updatePathDisplay(shortestPathLabels);
    }
    #findShortestPath(node){
        //Find shortest path - Start at destination node and navigate back through parents
        let path = [];
        while(node !== undefined){
            path.push(node);
            node = this.parent[node];
        }
        path.reverse();
        return path;
    }
    #findPathFromParents(parentList, startNode, endNode){
        let path = [endNode];
        let currentNode = parentList[endNode];

        while(currentNode != startNode){
            path.push(currentNode);
            currentNode = parentList[currentNode];
        }

        return path;
    }
    //--------- Find Graph Features -----------------------------
    findGraphCycles(){
        let cycles = [];

        //Find all cycles starting from every possible starting node
        for (let i = 0; i < this.visGraphs.getGraphNodeCount(); i++) {
            //Get the i'th node
            const startingNode = this.visGraphs.getGraphData().nodes.get()[i].id; 
            
            if(this.visGraphs.getNeighbors(startingNode).length > 1){ //Cycle can't exist without an entrance and exit
                //Perform DFS to find cycles from this point
                let visited = new Set();
                let stack = [startingNode];
                let parent = {};

                //Search all closed paths from startingNode
                while(stack.length != 0){
                    let node = stack.pop();
                    
                    //Check if node has been navigated
                    if(visited.has(node)){

                        //Check if path is closed
                        if(node == startingNode){
                            let cycle = this.#findPathFromParents(parent, startingNode, node);
                            if(cycle.length > 2){
                                cycles.push(cycle);
                            }
                        }
                        continue;
                    }
                    visited.add(node);

                    //Enqueue all neighbors
                    const neighbors = this.visGraphs.getNeighbors(node).filter(neighbor => (!visited.has(neighbor) || neighbor == startingNode));
                    neighbors.forEach(neighbor => {
                        stack.push(neighbor);
                        parent[neighbor] = node;
                    });
                }
            }
        }
        
        //Remove duplicate cycles - thanks chatGPT <3
        const uniqueCycles = cycles.filter((array, index, self) => {
            // Convert the array to a Set for uniqueness and back to a sorted array for comparison
            const arrayAsSetString = JSON.stringify([...new Set(array)].sort());
            // Check if any previous array as a Set matches the current array's Set representation
            return self.findIndex(a => 
                JSON.stringify([...new Set(a)].sort()) === arrayAsSetString
            ) === index;
        });

        //Make them go full circle
        uniqueCycles.map(cycle => cycle.push(cycle[0]));

        return uniqueCycles;
    }
    hasHamiltonianCycle(){
        //Check if there is a Cycle that contains all nodes
        this.cycles = this.findGraphCycles();

        const allCycleSets = this.cycles.map(cycle => new Set(cycle));
        const setOfAllNodes = new Set(this.visGraphs.getGraphData().nodes.get().map(node => node.id));
        
        for(let i = 0; i < allCycleSets.length; i++){
            if(allCycleSets[i].isSubsetOf(setOfAllNodes) && setOfAllNodes.isSubsetOf(allCycleSets[i])){
                return true;
            }
        }

        return false;
        
    }
    graphIsComplete(){
        //Check that every node has an edge adjacent to every other node
        const graphData = this.visGraphs.getGraphData();
        const nodes = graphData.nodes.get();
        const edges = graphData.edges.get();
        complete = true;

        for(let i = 0; i < nodes.length; i++){
            let neighbors = new Set(edges.find(edge => (edge.from == nodes[i])));
            let allNodesMinusCurrent = new Set(nodes);
            allNodesMinusCurrent.delete(nodes[i]);
    
            //Check that the edges incident to the chosen node are connected to all other nodes
            if(!neighbors.isSubsetOf(allNodesMinusCurrent) || !allNodesMinusCurrent.isSubsetOf(neighbors)){
                complete = false;
            }
        }
        return complete;
    }
    isWeaklyConnected(){
        //Perform BFS and ensure that all nodes are traversed
        const graphData = this.visGraphs.getGraphData();
        const nodes = graphData.nodes.get();
        const edges = graphData.edges.get();

        const allNodes = new Set(nodes.map(node => node.id));
        const searchedNodes = findNavigatableNodesWithBFS({nodes, edges}, nodes[0].id);
        return (allNodes.isSubsetOf(searchedNodes) && searchedNodes.isSubsetOf(allNodes));
    }
    
    isStronglyConnected() {
        //Perform BFS and ensure that all nodes are traversed from every node in the graph
        const graphData = this.visGraphs.getGraphData();
        const nodes = graphData.nodes.get();
        const edges = graphData.edges.get();
        const stronglyConnected = true;
        const allNodes = new Set(nodes.map(node => node.id));
    
        for(let i = 0; i < allNodes.size; i++) {
            //Search whole graph starting at the given node
            let searchedNodes = findNavigatableNodesWithBFS({nodes, edges}, nodes[i].id);
    
            //Check that whole graph is navigatable from that point
            if(!allNodes.isSubsetOf(searchedNodes) || !searchedNodes.isSubsetOf(allNodes)){
                stronglyConnected = false;
                break;
            }
        }
        return stronglyConnected;    
    }
    
    //--------- Alter Env Variables --------------------------------------
    changeNavigationMethod(state){
        state = state.toLowerCase();
        //Check that traversal is not already occuring
        if(!this.isTraversing){
            // If state is a valid traversal state
            const navMethodKey = Object.keys(this.navMethods).find(
                key => this.navMethods[key].toLowerCase() === state
            );

            if (navMethodKey) {
                // Assign new traversal method
                this.navMethod = this.navMethods[navMethodKey];
            } else {
                console.error("ERROR: Navigation method does not exist!");
            }
        } else {
            console.error("ERROR: Cannot change method of traversing during traversal")
        }
    }
    changeSpeed(speed){
        //Check speed is positive
        if(speed >= 0){
            this.speed = speed;
        } else {
            console.error("ERROR: Speed cannot be negative");
        }
    }
    changeDestinationNode(nodeID){
        //Check that node exists and traversing is not occuring
        let nodeCount = this.visGraphs.getGraphNodeCount();
        if(!this.isTraversing){
            if(0 < nodeID && nodeID <= nodeCount){
                this.destinationNode = nodeID;
            } else {
                console.error("ERROR: Destination Node must exist on the graph");
            }
        } else {
            console.error("ERROR: Cannot change destination node during traversal");
        }
    }
    changeStartNode(nodeID){
        //Check that node exists and traversing is not occuring
        let nodeCount = this.visGraphs.getGraphNodeCount();
        if(0 < nodeID && nodeID <= nodeCount && !this.isTraversing){
            this.startNode = nodeID;

            //Empty NodeTraversalList and add start node
            this.traversalNodeList = [];
            this.traversalNodeList.push(this.startNode);
        } else {
            console.error("ERROR: Destination Node must exist");
        }
    }
    changeAutoNav(state) {
        this.autoNavigate = state;
    }
    changeNavAllNeighbors(state) {
        this.navAllNeighbors = state;
    }
    reset(){
        this.traversalNodeList = [this.startNode];
        this.visited.clear();
        this.parent = {}; // Clear parent mapping
        this.destinationFound = false; // Reset the destination found flag
        this.shortestPath = [];
        this.cycles = [];

        this.isTraversing = false;
    }
    //-------- Retrieve Elements -----------------------------------
    isDestinationFound() {
        return this.destinationFound;
    }
    isTraversingGraph(){
        return this.isTraversing;
    }
    getDestinationNode() {
        return this.destinationNode;
    }
    getAutoNavState() {
        return this.autoNavigate;
    }
    getNavAllNeighborsState() {
        return this.navAllNeighbors;
    }
    getSpeed() {
        return this.speed;
    }
}