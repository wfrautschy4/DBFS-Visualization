# Depth and Breadth First Search Visualization
---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Visuals](#visuals)
7. [Future Enhancements](#future-enhancements)
8. [Contributing](#contributing)

---

## Overview
- **What**: This Project's goal is to visualize the node-traversing of graph searching methods such as Depth and Breadth first on a step-by-step controlled basis. The program also allows for control over graphs and displays info about the generated graphs
- **Why**: It exists to try to explain a not-so-easy to understand topic in a easier way to understand. It also allows for experimentation and exploring at your own pace to fully understand the concept in an interactive way.
- **How**: The program uses vis.js to visualize the nodes and utilizes algorithms like Breadth and Depth first search to navigate and discover underlying features of the graph.

---

## Features
- Real-time Graph Traversal visualization.
- Visualization Highlights Nodes in controlled steps
- Options for Custom and generated Graphs of certain types
- Control over Speed of Traversal
- Statistics which hold data about the graphs are displayed
- Ability to change graph navigation methods - (Breadth and Depth Supported / Djikstr and A* Soon)
- 
-
---
## Technologies Used
- **Languages**: JavaScript, HTML, CSS
- **Libraries**: [vis.js](https://github.com/visjs)

---

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/wfrautschy4/DBFS-Visualization.git
   ```
2. Navigate to the project directory
    ```bash
    cd DBFS-Visualization
    ```
3. Open ```index.html``` in your browser

## Usage 
1. Open file
2. Set the type of graph you want to generate
3. Set the node and edge count of your graph (if generated)
4. Adjust visualization settings like speed, auto-traversal, and navigating more than one node per step
5. Choose between breadth and depth first search to navigate the graph
6. Click the SEARCH button or press the Space bar to start searching
7. Reset to keep the graph and settings or Generate a new Graph to start new


## Visuals
<table>
    <tr>
        <td>

![alt text](assets/imgs/breadth.gif)
        </td>
        <td>

![alt text](assets/imgs/depth.gif)
        </td>
    </tr>
</table>

## Future Enhancements
- Combine the HTML files into one
- Allow for the creation of graphs without needing to code.
- Add ability to chose starting and ending nodes

## Contributing
1. Fork the repository
2. Create a feature branch
```bash
git checkout -b feature-name
```
3. Commit changes and submit a pull request

