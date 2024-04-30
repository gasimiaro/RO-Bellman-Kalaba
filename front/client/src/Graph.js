import React, { useState, useRef, useEffect ,useCallback} from 'react';
import * as vis from 'vis';
import 'vis/dist/vis.min.css';
import './Graph.css';
import Swal from 'sweetalert2';

import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios';
import PotentialTable from './PotentialTable';
export default function Graph() {
    // const [nextNodeId,setNextNodeId ] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [titlePage,setTitlePage] = useState("");
  const [optimalWay,setOptimalWay] = useState([]);
  const graphRef = useRef(null);
  const [minPotentials, setMinPotentials] = useState([{}]);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  //for step by step
  const [network, setNetwork] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  //history
  const [history, setHistory] = useState([{ nodes: [], edges: [] }]);
const [currentIndex, setCurrentIndex] = useState(0);


useEffect(() => {
  const newHistory = [...history.slice(0, currentIndex + 1), { nodes, edges }];
  setHistory(newHistory);
  setCurrentIndex(newHistory.length - 1);
}, [nodes, edges]);

const undo = () => {
  if (currentIndex > 0) {
    setCurrentIndex(currentIndex - 1);
    const { nodes, edges } = history[currentIndex - 1];
    setNodes(nodes);
    setEdges(edges);
  }
};

useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === 'z') {  // Pour Windows/Linux, 'command' pour Mac
      event.preventDefault();  // Empêche d'autres comportements par défaut du Ctrl+Z
      undo();
    }
  };

  // Ajout de l'écouteur d'événements au document
  document.addEventListener('keydown', handleKeyDown);

  // Nettoyage de l'effet
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, [undo, currentIndex]);  


const options = {
  layout: {
    hierarchical: false,
  },
  physics: {
    enabled: physicsEnabled,
  },
  edges: {
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      },
    },
  },
  nodes: {
    font: {
      size: 14,
    },
  },
  manipulation: {

    enabled: true, 
    initiallyActive: true, 
    addNode : false,
    addEdge : false,

    editEdge: {
      editWithoutDrag: function (data, callback) {
        editEdgeWithoutDrag(data, callback);
      },
    },
    deleteNode: function (data, callback) {
      confirmDelete(data, callback, 'node');
    },
    deleteEdge: function (data, callback) {
      confirmDelete(data, callback, 'edge');
    },    

}
};

function removeEdgeById(edges, edgeId) {
  // Filter out the edge with the given ID
  return edges.filter(edge => edge.id !== edgeId);
}



async function confirmDelete(data, callback, type) {
  const itemType = type.charAt(0).toUpperCase() + type.slice(1); // 'Node' or 'Edge'
  const swalResult = await Swal.fire({
    title: `Are you sure you want to delete this ${itemType}?`,
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });

  if (swalResult.value) {
    setCurrentStepIndex(0);
      if(type == "edge"){
        const new_edges = removeEdgeById(edges, data.edges[0]);
        setEdges(new_edges);
      }
      if(type == "node"){
        console.log("nodes : ",data.nodes[0])
        const new_nodes = removeEdgeById(nodes, data.nodes[0]);
        const new_edges = edges.filter(edge => edge.from !== data.nodes[0] && edge.to !== data.nodes[0]);
        setEdges(new_edges);
        setNodes(new_nodes);
      }
      clearExistingOverlays() ;
      setTitlePage("");
      setMinPotentials([{}]);
      setCurrentStepIndex(0);
    // callback(data); // Vis.js expects this callback to be called with the data to finalize the deletion
    Swal.fire(
      'Deleted!',
      `Your ${itemType} has been deleted.`,
      'success'
    );
  }
}

async function editEdgeWithoutDrag(data, callback) {
  const { value: newLabel } = await Swal.fire({
    title: "Edit Edge Label",
    input: "text",   
    inputValue: data.label,
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "You need to enter a label";
      }
    },
  });

  if (newLabel) {
    if (typeof data.to === "object") data.to = data.to.id;
    if (typeof data.from === "object") data.from = data.from.id;
    const updatedEdge = {
      from: data.from,
      to: data.to,
      // length: 300,
      label: newLabel,
      arrows: "to",
    };

    // Update the edges state with the edited edge
    setEdges((prevEdges) =>
      prevEdges.map((edge) =>
        edge.from === updatedEdge.from && edge.to === updatedEdge.to
          ? updatedEdge
          : edge
      )
    );

    callback(updatedEdge);
    clearExistingOverlays() ;
    setTitlePage("");
    setMinPotentials([{}]);
    setCurrentStepIndex(0);

  }
}

  function addNode(e) {
    e.preventDefault();
    const newLabel = e.target.nodeLabel.value.trim(); // Trim leading/trailing spaces
    const sublabel = 1;
    if (nodes.some(node => node.label === newLabel)) {
      Swal.fire('Attention!', 'Noeud déjà existant', 'warning');
    } else {
      const nodeOptions = nodes.map(node => ({
        id: node.id,
        label: node.label
    }));
        const newNode = {
            id: newLabel,
            label: newLabel,            
        };
      setNodes(prev => [...prev, newNode]);
      // setNextNodeId(nextNodeId + 1);
    }
    e.target.nodeLabel.value = '';
    setTitlePage("");
    clearExistingOverlays() ;
    setTitlePage("");
    setMinPotentials([{}]);
    setCurrentStepIndex(0);

  }
  
function addEdge(e) {
    e.preventDefault();
  
    // Get selected node IDs
    const fromId = e.target.node1.value;
    const toId = e.target.node2.value;
  
    // Check if an edge already exists between the selected nodes
    const existingEdge = edges.some(
      (edge) => edge.from === fromId && edge.to === toId
    );
  
    if (existingEdge) {
      Swal.fire('Attention!', 'Un arc existe déjà entre ces noeuds!', 'warning');
    } else {
      const newEdge = {
        from: fromId,
        to: toId,
        // length: 300,
        label: e.target.edgeWeight.value,
        arrows: "to" // Replace with desired default arrow direction
      };
      setEdges(prev => [...prev, newEdge]);
      e.target.edgeWeight.value = 0; // Reset weight input
    }
    setTitlePage("");
    clearExistingOverlays() ;
    setTitlePage("");
    setMinPotentials([{}]);
    setCurrentStepIndex(0);

  }
  

//############################################################################3

  function resetGraph() {
    // setNextNodeId(1)
    setNodes([]);
    setEdges([]);
    setTitlePage("");
    clearExistingOverlays() ;
    setTitlePage("");
    setMinPotentials([{}]);
    setCurrentStepIndex(0);
  }

  function drawGraph() {
   // Créez un tableau pour stocker les options de chaque nœud
   const nodeOptions = nodes.map(node => ({
    id: node.id,
    label: node.label,
    title: `${node.label}`, // Use node.label to make it dynamic
        color: "#f88"
}));

    const net = new vis.Network(graphRef.current, {
    //   nodes,
      nodes: new vis.DataSet(nodeOptions),
      edges,
      options
    }, 
    );
    setNetwork(net);
    clearExistingOverlays() ;

  }

  function resetGraphStyles(network) {
    const nodes = network.body.data.nodes;
    const edges = network.body.data.edges;
  
    nodes.update(nodes.map(node => ({
      ...node, 
      font: { size: 14 }, 
      shadow: false 
    })));
  
    edges.update(edges.map(edge => ({
      ...edge, 
      width: 1, 
      dashes: false, 
      color: '#848484', 
      font: { color: '#555', size: 14 }
    })));
  }

  function drawGraphMin(all_potential, min_way_to_color, network) {
    console.log("min_way_to_color : ", min_way_to_color);
  
    if (min_way_to_color.length === 0) {
      resetGraphStyles(network);
    } else {
      // Update node and edge styles for non-empty min_way_to_color
      const nodes = network.body.data.nodes;
      const edges = network.body.data.edges;
  
      nodes.update(nodes.map(node => {
        const isStartNode = min_way_to_color[0][0] === node.id;
        const isOnPath = min_way_to_color.some(path => path.includes(node.label));
        return {
          ...node,
          font: isStartNode ? { size: 22, color: '#fff', face: 'Arial', background: '#7f7' }
                            : isOnPath ? { size: 22, color: '#fff', face: 'Arial' }
                                       : { size: 14 },
          shadow: isOnPath,
        };
      }));
  
      edges.update(edges.map(edge => {
        const isSpecialEdge = min_way_to_color.some(path => {
          for (let i = 0; i < path.length - 1; i++) {
            if (path[i] === edge.from && path[i + 1] === edge.to) return true;
          }
          return false;
        });
  
        return {
          ...edge,
          width: isSpecialEdge ? 9 : 1,
          dashes: isSpecialEdge ? [3, 12] : false,
          color: isSpecialEdge ? '#ddd' : '#848484',
          font: { color: isSpecialEdge ? '#000' : '#555', size: isSpecialEdge ? 24 : 14 },
        };
      }));
    }
  }
  
// function drawGraphMin(all_potential, min_way_to_color, network) {
//   // To get a node's data:
//   console.log("min_way_to_color : ", min_way_to_color);

//   // Check if min_way_to_color is not empty
//   if (min_way_to_color.length === 0) {
//     // If min_way_to_color is empty, reset node and edge styles to default
//     const nodes = network.body.data.nodes;
//     const edges = network.body.data.edges;

//     nodes.update(nodes.map(node => ({ ...node, font: { size: 14 }, shadow: false })));
//     edges.update(edges.map(edge => ({ ...edge, width: 1, dashes: false, color: '#848484', font: { color: '#555', size: 14 } })));
//   } else {
//     // If min_way_to_color is not empty, update node and edge styles
//     const nodes = network.body.data.nodes;
//     const edges = network.body.data.edges;

//     nodes.update(nodes.map(node => {
//       const isStartNode = min_way_to_color[0][0] === node.id;
//       const isOnPath = min_way_to_color.some(path => path.includes(node.label));

//       return {
//         ...node,
//         font: isStartNode
//           ? { size: 22, color: '#fff', face: 'Arial', background: '#7f7' }
//           : isOnPath
//             ? { size: 22, color: '#fff', face: 'Arial' }
//             : { size: 14 },
//         shadow: isOnPath,
//       };
//     }));

//     edges.update(edges.map(edge => {
//       const isSpecialEdge = min_way_to_color.some(path => {
//         for (let i = 0; i < path.length - 1; i++) {
//           if (path[i] === edge.from && path[i + 1] === edge.to) {
//             return true;
//           }
//         }
//         return false;
//       });

//       let width = 1;
//       let color = '#848484';
//       let dashes = false;
//       let fontColor = '#555';
//       let fontSize = 14;

//       if (isSpecialEdge) {
//         width = 9;
//         color = '#ddd';
//         dashes = [3, 12];
//         fontColor = '#000';
//         fontSize = 24;
//       }

//       return {
//         ...edge,
//         width,
//         dashes,
//         color,
//         font: { color: fontColor, size: fontSize },
//       };
//     }));
//   }
// }

// function drawGraphMin(all_potential,min_way_to_color, network) {

//   // To get a node's data:
// console.log("min_way_to_color : ",min_way_to_color)
//   const nodeOptions = nodes.map(node => ({
//       id: node.id,
//       label: node.label,
//       color:  "#f88",
//       font: 
//       min_way_to_color[0][0] == node.id? { size: 22, color: "#fff", face: "Arial" ,background : "#7f7"} : 
//       // min_way_to_color[0][min_way_to_color.length - 1] == node.id? { size: 22, color: "#fff", face: "Arial" ,background : "#ff4433"} :
//               min_way_to_color.some(path => path.includes(node.label)) ? { size: 22, color: "#fff", face: "Arial" } :"",
//       shadow: min_way_to_color.some(path => path.includes(node.label)) ?  true : false
//   }));

// const edgeOptions = edges.map(edge => {
//   // Vérifiez si cette arête est présente dans un chemin spécifique de min_way_to_color
//   const isSpecialEdge = min_way_to_color.some(path => {
//       for (let i = 0; i < path.length - 1; i++) {
//           if (path[i] === edge.from && path[i + 1] === edge.to) {
//               return true;
//           }
//       }
//       return false;
//   });
//   // Définissez la largeur et la couleur de l'arête en fonction de la condition
//   let width = 1;
//   let color = isSpecialEdge ? '#fff' : '#848484'; // Couleur différente pour les arêtes spéciales
//   let dashes = false;
//   let fontColor = '#555'; 
//   let fontSize = 14;
//   if (isSpecialEdge) {
//       width = 9; // ou toute autre largeur souhaitée pour les arêtes spéciales
//       color = "#ddd";
//       dashes = [3, 12]; // Définir le style des traits, 5 pixels de trait suivi de 5 pixels d'espace
//       fontColor = "#000";
//       fontSize = 24;
//   }
//   return {
//       ...edge,
//       width: width,
//       dashes : dashes,
//       // length: 300,
//       color: color,
//       font : {color : fontColor, size : fontSize}
//   };


// });

//   // network.setData({ 
//   //   nodes: new vis.DataSet(nodeOptions), 
//   //   edges: new vis.DataSet(edgeOptions) 
//   // });
// //  const network =  new vis.Network(graphRef.current, {
// //       nodes: new vis.DataSet(nodeOptions),
// //       edges: new vis.DataSet(edgeOptions),
// //       options

// //   });
// //   network.on("afterDrawing", function () {
// //     updateNodePositions(network,all_potential);
// // });
// return network; // Add this line to return the network instance
// }

//#############################################################################################################
//#############################################################################################################

function updateNodePositions(network,all_potential) {

  if (!all_potential.length) {
    // console.log("all_potential is empty or not loaded yet");
    return; // Exit if data isn't ready
  }
  clearExistingOverlays();
  const nodeIds = network.body.nodeIndices;
  const nodesDataset = network.body.data.nodes; // Access the nodes DataSet

  nodeIds.forEach((nodeId) => {
      const nodePosition = network.getPositions([nodeId]);
      const domPos = network.canvasToDOM(nodePosition[nodeId]);
      const nodeData = nodesDataset.get(nodeId); // Get the node data

      const PotentialValue = all_potential[currentStepIndex][nodeData.label];
      updateOrCreateOverlay(nodeId, domPos, PotentialValue);
  });
}




function updateOrCreateOverlay(nodeId, position, label) {
  let overlay = document.getElementById('overlay-' + nodeId);
  if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'node-overlay';
      overlay.id = 'overlay-' + nodeId;

          overlay.textContent = label ; // Custom text to show over the node
          document.body.appendChild(overlay);
  }
  setPosX(position.x);
  setPosY(position.y);
  overlay.style.left = position.x + 420 + 'px' ;
  overlay.style.top = position.y + 125 +'px';
}

function clearExistingOverlays() {
  const overlays = document.querySelectorAll('.node-overlay');
  overlays.forEach(overlay => overlay.remove());
}

//step by step

const handlePreviousStep = () => {
  if (currentStepIndex > 0) {
    setCurrentStepIndex(currentStepIndex - 1);
  }
};

const handleNextStep = () => {
  if (currentStepIndex < minPotentials.length - 1) {
    setCurrentStepIndex(currentStepIndex + 1);
  }
};


const handleSkipStep = () => {
  if (currentStepIndex < minPotentials.length - 1) {
    setCurrentStepIndex(minPotentials.length - 1);
  }
};
//#############################################################################################################
//#############################################################################################################
  async function getMinWay() {
    // Create the graph object in the required format
    const graph = {};
    console.log(edges,nodes)
    nodes.forEach(node => {
        // Initialize an empty object for each node
        graph[node.label] = {};
        // Find edges related to this node
        edges.forEach(edge => {
            const destinationNode = nodes.find(n => n.id === edge.to);
            if (edge.from === node.id ) {
              console.log(edge.from,edge.to,destinationNode)
                // Add the edge weight to the corresponding destination node
                graph[node.label][destinationNode.label] = parseInt(edge.label);
            }
        });
    });

    try {
      const response = await axios.post('/get_min_way', graph);
      setTitlePage("Chemin Minimal");
      const minPotentials_direct = response.data.min_potentials_at_each_step;
      const current_optimal_way = response.data.min_optimal_ways;
      setMinPotentials(minPotentials_direct);
      console.log("lehibe : ",minPotentials_direct.length)
      setCurrentStepIndex(0);

      if(minPotentials_direct.length == 1){
        drawGraphMin(minPotentials_direct,current_optimal_way,network);
      }
      setOptimalWay(current_optimal_way);
      Swal.fire('Success!', 'Données du graph envoyées avec succès!', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'Une erreur est survenue lors de l\'envoi des données!', 'error');
    }
  }

async function getMaxWay() {
    // Create the graph object in the required format
    const graph = {};

    nodes.forEach(node => {
        // Initialize an empty object for each node
        graph[node.label] = {};
        // Find edges related to this node
        edges.forEach(edge => {
            const destinationNode = nodes.find(n => (n.id) === (edge.to));
            if ((edge.from) === (node.id) ) {
                // Add the edge weight to the corresponding destination node
                graph[node.label][destinationNode.label] = parseInt(edge.label);
            }
        });
    });

    try {
      const response = await axios.post('/get_max_way', graph);
      setTitlePage("Chemin Maximal");
      const maxPotentials_direct = response.data.max_potentials_at_each_step;
      const current_optimal_way = response.data.max_optimal_ways;
      setMinPotentials(maxPotentials_direct);
      setCurrentStepIndex(0);

      if(maxPotentials_direct.length == 1){
        drawGraphMin(maxPotentials_direct,current_optimal_way,network);
      }
      setOptimalWay(current_optimal_way);

      Swal.fire('Success!', 'Données du graph envoyées avec succès!', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'Une erreur est survenue lors de l\'envoi des données!', 'error');
    }
  }


  useEffect(() => {
    drawGraph();
  }, [nodes, edges]);
  

  
  const handlePhysicsChange = (event) => {
    setPhysicsEnabled(event.target.checked);
  };

  // useEffect(() => {
  //   options.physics.enabled = physicsEnabled;
  //   if(titlePage == ""){
  //     drawGraph();
  //     clearExistingOverlays() ;
  //   }
  //   else{
  //     // drawGraphMin(minPotentials,optimalWay);
  //     const network = drawGraphMin(minPotentials, optimalWay);
  //     updateNodePositions(network, minPotentials);
  //   }
  // }, [physicsEnabled, titlePage, minPotentials, optimalWay, currentStepIndex]);


  function initializeGraph() {
    // Créez un tableau pour stocker les options de chaque nœud
    const nodeOptions = nodes.map(node => ({
      id: node.id,
      label: node.label,
      title: `${node.label}`, // Use node.label to make it dynamic
      color: "#f88"
    }));
  
    const network = new vis.Network(graphRef.current, {
      nodes: new vis.DataSet(nodeOptions),
      edges,
      options
    });
  
    setNetwork(network);
    clearExistingOverlays();

  }

  useEffect(() => {
    
    if (!network) {
      initializeGraph();
    }
  }, [nodes, edges, network]);

// useEffect(()=>{
//   console.log(posX)
//   if(network){
//     updateNodePositions(network,minPotentials); 
//   }

// },[posX,posY]);

  useEffect(() => {
    if (network) {
      const updatedOptions = {
        ...options,
        physics: {
          enabled: physicsEnabled,
        },
      };
  
      network.setOptions(updatedOptions);
    }
  }, [physicsEnabled, options, network]);

  useEffect(() => {
    options.physics.enabled = physicsEnabled;
    if (titlePage === "") {
      clearExistingOverlays();
    } else if (currentStepIndex == minPotentials.length -1) {
      drawGraphMin(minPotentials, optimalWay, network);
    } else {
      resetGraphStyles(network);
    }
  }, [titlePage, minPotentials, optimalWay, physicsEnabled, network, currentStepIndex]);
  
  // useEffect(() => {
  //   options.physics.enabled = physicsEnabled;
  //   if (titlePage === "") {
  //     clearExistingOverlays();
  //   } else {
  //     if(currentStepIndex == minPotentials.length -1){
  //       drawGraphMin(minPotentials, optimalWay, network);
  //     }
  //     else{
  //     }
  //   }
  //   // options.physics.enabled = physicsEnabled;

  // }, [titlePage, minPotentials, optimalWay, physicsEnabled, network, currentStepIndex]);

  // useEffect(() => {
  //   options.physics.enabled = physicsEnabled;
  //   if (titlePage === "") {
  //     drawGraph();
  //     clearExistingOverlays();
  //   } else {
  //     // const networkInstance = drawGraphMin(minPotentials, optimalWay);
  //     // setNetwork(networkInstance);
  //     drawGraphMin(minPotentials, optimalWay, network);
  //   }
  // }, [titlePage, minPotentials, optimalWay, physicsEnabled, nodes, edges]);

  useEffect(() => {
    if (network && minPotentials.length > 0) {
      updateNodePositions(network, minPotentials);
    }
  }, [network, minPotentials, currentStepIndex]);   

  return (
    // <div style={{ border: '3px solid green' }}>      
    <div className="green-border container">

      <div className="sidebar green-border">
        <form onSubmit={addNode}>

          <label>
            Label:
            <input name="nodeLabel" />  
          </label>
          <button>Add Node</button>
        </form>

        <form onSubmit={addEdge}>
          <select name="node1">
            {nodes.map(node => 
              <option key={node.id} value={node.id}>{node.label}</option>
            )}
          </select>
          <select name="node2">
            {nodes.map(node => 
              <option key={node.id} value={node.id}>{node.label}</option>
            )}
          </select>
          <label>
            Weight:
            <input type='number' name="edgeWeight" /> 
          </label>
          <button>Add Edge</button> 
        </form>

        <button onClick={resetGraph}>Reset</button> 
        <button onClick={getMinWay}>Trouver le chemin Minimal</button>
        <button onClick={getMaxWay}>Trouver le chemin Maximal</button>
        <div>
              <h1>Potentials at each step</h1>
              <PotentialTable minPotentials={minPotentials} currentStepIndex={currentStepIndex}  />
            </div>
      </div>
        <div className='main-container'>
            <div className='graph-title'>
                <h2>OPERATIONNAL SEARCH :  {titlePage}</h2>
            </div>
            <div>
            <label>
                <input
                  type="checkbox"
                  checked={physicsEnabled}
                  onChange={handlePhysicsChange}
                />
                smooth
              </label>
              <div>
                  <button    className="button previous" onClick={handlePreviousStep} disabled={currentStepIndex === 0}>
                    Previous
                  </button>
                  <button
                  className="button next"
                    onClick={handleNextStep}
                    disabled={currentStepIndex === minPotentials.length - 1}
                  >
                    Next
                  </button>
                  <button
                  className="button skip"
                    onClick={handleSkipStep}
                    disabled={currentStepIndex === minPotentials.length - 1}
                  >
                    Skip
                  </button>
                  <button className="button undo" onClick={undo} disabled={currentIndex === 0}>
                  Undo
                </button>
              </div>

            </div>
            <div ref={graphRef} className='' />              

        </div>

    </div>
  );

}


