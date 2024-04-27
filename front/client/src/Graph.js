import React, { useState, useRef, useEffect } from 'react';
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
  // let network = useRef(null);
//   const options = {
//     physics: {
//       enabled: true
//     }
//   };
// const options = {
//     layout: {
//         hierarchical: false,
//     },
//     physics: {
//         enabled: true,
//     },
//     edges: {
//         arrows: {
//             to: {
//                 enabled: true,
//                 scaleFactor: 0.5 // Vous pouvez ajuster la taille des flèches selon vos préférences
//             }
//         }
//     },
//     nodes: {
//         font: {
//             size: 14 // Ajustez la taille de police selon vos préférences
//         }
//     }
// };
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
    // addNode: function (data, callback) {
    //   // ... (existing code)
    // },
    // editNode: function (data, callback) {
    //   // ... (existing code)
    // },
    // addEdge: function (data, callback) {
    //   // ... (existing code)
    // },
    enabled: true, 
    initiallyActive: true, 
    addNode : false,
    addEdge : false,

    editEdge: {
      editWithoutDrag: function (data, callback) {
        editEdgeWithoutDrag(data, callback);
      },
    },

}
};


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
  }

  function drawGraph() {
   // Créez un tableau pour stocker les options de chaque nœud
   const nodeOptions = nodes.map(node => ({
    id: node.id,
    label: node.label,
    title: `${node.label}`, // Use node.label to make it dynamic
        color: "#f88"
}));

    new vis.Network(graphRef.current, {
    //   nodes,
      nodes: new vis.DataSet(nodeOptions),
      edges,
      options
    }, 
    // options
    );
  }


//   function drawGraphMin(min_way_to_color) {
//     console.log("min_way_to_color: ", min_way_to_color);
//     // Créez un tableau pour stocker les options de chaque nœud
//     const nodeOptions = nodes.map(node => ({
//         id: node.id,
//         label: node.label,
//         color: min_way_to_color.some(path => path.includes(node.label)) ? "#3c4" : "#aaf"    }));

//     new vis.Network(graphRef.current, {
//         nodes: new vis.DataSet(nodeOptions),
//         edges,
//         options
//     });
// }


function drawGraphMin(all_potential,min_way_to_color) {
  console.log("min all_potential : ", all_potential);


  console.log("min_way_to_color: ", min_way_to_color[0]);
  // Créez un tableau pour stocker les options de chaque nœud0
  // To get a node's data:

  const nodeOptions = nodes.map(node => ({
      id: node.id,
      label: node.label,
      color:  "#f88",
      font: 
      min_way_to_color[0][0] == node.id? { size: 22, color: "#fff", face: "Arial" ,background : "#7f7"} : 
      // min_way_to_color[0][min_way_to_color.length - 1] == node.id? { size: 22, color: "#fff", face: "Arial" ,background : "#ff4433"} :
              min_way_to_color.some(path => path.includes(node.label)) ? { size: 22, color: "#fff", face: "Arial" } :"",
      shadow: min_way_to_color.some(path => path.includes(node.label)) ?  true : false
  }));

const edgeOptions = edges.map(edge => {
  // Vérifiez si cette arête est présente dans un chemin spécifique de min_way_to_color
  const isSpecialEdge = min_way_to_color.some(path => {
      for (let i = 0; i < path.length - 1; i++) {
          if (path[i] === edge.from && path[i + 1] === edge.to) {
              return true;
          }
      }
      return false;
  });
  // Définissez la largeur et la couleur de l'arête en fonction de la condition
  // const width = isSpecialEdge ? 7 : 1;
  let width = 1;
  let color = isSpecialEdge ? '#fff' : '#848484'; // Couleur différente pour les arêtes spéciales
  let dashes = false;
  let fontColor = '#555'; 
  let fontSize = 14;
  if (isSpecialEdge) {
      width = 9; // ou toute autre largeur souhaitée pour les arêtes spéciales
      color = "#ddd";
      dashes = [3, 12]; // Définir le style des traits, 5 pixels de trait suivi de 5 pixels d'espace
      fontColor = "#000";
      fontSize = 24;
  }
  return {
      ...edge,
      width: width,
      dashes : dashes,
      // length: 300,
      color: color,
      font : {color : fontColor, size : fontSize}
  };


});


 const net =  new vis.Network(graphRef.current, {
      nodes: new vis.DataSet(nodeOptions),
      edges: new vis.DataSet(edgeOptions),
      options

  });
  net.on("afterDrawing", function () {
    updateNodePositions(net,all_potential);
});

}

//#############################################################################################################
//#############################################################################################################

function updateNodePositions(network,all_potential) {

  if (!all_potential.length) {
    console.log("all_potential is empty or not loaded yet");
    return; // Exit if data isn't ready
  }
  clearExistingOverlays();
  const nodeIds = network.body.nodeIndices;
  const nodesDataset = network.body.data.nodes; // Access the nodes DataSet

  nodeIds.forEach((nodeId) => {
      const nodePosition = network.getPositions([nodeId]);
      const domPos = network.canvasToDOM(nodePosition[nodeId]);
      const nodeData = nodesDataset.get(nodeId); // Get the node data

      const PotentialValue = all_potential[all_potential.length - 1][nodeData.label];

      updateOrCreateOverlay(nodeId, domPos, PotentialValue);
  });
}


function updateOrCreateOverlay(nodeId, position, label) {
  let overlay = document.getElementById('overlay-' + nodeId);
  if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'node-overlay';
      overlay.id = 'overlay-' + nodeId;
      overlay.textContent = label; // Custom text to show over the node
      document.body.appendChild(overlay);
  }
  overlay.style.left = position.x + 420 + 'px' ;
  overlay.style.top = position.y + 100 +   'px';
}

function clearExistingOverlays() {
  const overlays = document.querySelectorAll('.node-overlay');
  overlays.forEach(overlay => overlay.remove());
}
//#############################################################################################################
//#############################################################################################################
  async function getMinWay() {
    // Create the graph object in the required format
    const graph = {};

    nodes.forEach(node => {
        // Initialize an empty object for each node
        graph[node.label] = {};
        // Find edges related to this node
        edges.forEach(edge => {
            const destinationNode = nodes.find(n => n.id === edge.to);
            if (edge.from === node.id ) {
                // Add the edge weight to the corresponding destination node
                graph[node.label][destinationNode.label] = parseInt(edge.label);
            }
        });
    });

    try {
        console.log(JSON.stringify(graph));
      const response = await axios.post('/get_min_way', graph);
      setTitlePage("Chemin Minimal");
      const minPotentials_direct = response.data.min_potentials_at_each_step;
      setMinPotentials(minPotentials_direct);
      drawGraphMin(minPotentials_direct,response.data.min_optimal_ways);
      setOptimalWay(response.data.min_optimal_ways);
      Swal.fire('Success!', 'Données du graph envoyées avec succès!', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'Une erreur est survenue lors de l\'envoi des données!', 'error');
    }
  }



/////////////////////   get max way

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
      setMinPotentials(maxPotentials_direct);
      drawGraphMin(maxPotentials_direct,response.data.max_optimal_ways);
      setOptimalWay(response.data.max_optimal_ways);

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

  useEffect(() => {
    options.physics.enabled = physicsEnabled;
    if(titlePage == ""){
      drawGraph();
      clearExistingOverlays() ;
    }
    else{
      drawGraphMin(minPotentials,optimalWay);
    }
  }, [physicsEnabled]);



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
              <PotentialTable minPotentials={minPotentials} />
            </div>
      </div>
        <div className='main-container'>
            <div className='graph-title'>
                <h2>OPERATIONNAL SEARCH</h2>
                <h2>{titlePage}</h2>
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
            </div>
            <div ref={graphRef} className='' />              

        </div>

    </div>
  );

}


