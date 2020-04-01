const GraphAMap = {
    A: ['B', 'C', 'D'],
    B: ['A', 'C', 'D'],
    C: ['A', 'B', 'D', 'E'],
    D: ['A', 'B', 'C', 'E'],
    E: ['C', 'D'],
};

const GraphBMap = {
    A: ['B', 'C', 'D'],
    B: ['A', 'C', 'E'],
    C: ['A', 'B', 'D', 'E'],
    D: ['A', 'C', 'E', 'F'],
    E: ['B', 'C', 'D', 'F'],
    F: ['D', 'E'],
};

const main = () => {

    //Determine what graph we will use and the starting vertices
    const args = process.argv.slice(2);
    const chosenGraph = args.length > 0 ? {...GraphBMap} : {...GraphAMap};
    const startingVertices = findStartingVertices(chosenGraph);

    //Find euler paths for each vertices
    startingVertices.forEach((vertex) => {
        const paths = findPaths(vertex, [], {...chosenGraph});
        const pathsArr = [...paths];
        pathsArr.forEach((path) => console.log(path));
    });

    console.log("done");
};


const findStartingVertices = (graph) => {
    let vertices = Object.keys(graph);

    // CASE 1: If all vertices have an even degree, every vertex can be a starting point
    const evenDegrees = vertices.every((vertex) => graph[vertex].length % 2 === 0);
    if (evenDegrees) return vertices;

    // CASE 2: If any vertices have an odd degree, there must be 2 and will eligible starting points
    const oddDegrees = vertices.filter((vertex) => graph[vertex].length % 2 !== 0);
    if (oddDegrees.length === 2) return oddDegrees;

    //No euler path exists
    return [];
};

// Generator/iterator to yield euler paths
function* findPaths(vertex, path, graph){
    // Add current vertex to path
    const currentPath = [...path, vertex];

    // Get neighbors of the current vertex
    const neighbors = graph[vertex];

    // Check if path is eulerian (Are all edges visited?)
    if (neighbors.length === 0 && isEulerian(currentPath, Object.keys(graph).length)) {
        yield currentPath;
    }

    for (const neighbor of neighbors) {
        //remove edge
        let graphCopy = {...graph};
        graphCopy[vertex] = graph[vertex].filter((v) => v !== neighbor);
        graphCopy[neighbor] = graphCopy[neighbor].filter((v) => v !== vertex);

        //Recursively go to the next iteration
        yield* findPaths(neighbor, currentPath, graphCopy);
    }

}

// Prove we visit all nodes using all edges only once
// this is done by using the formula 2n - 1, where n is the number of vertices
const isEulerian = (path, vCount) => {
    const visits = (2 * vCount) - 1;
    return path.length === visits;
};

main();