import React, { useState, useRef, useEffect } from 'react';
import * as vis from 'vis';
import 'vis/dist/vis.min.css';
import './Graph.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios';

export default function Graph() {
    const [nextNodeId,setNextNodeId ] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [titlePage,setTitlePage] = useState("");
  const graphRef = useRef(null);

//   const options = {
//     physics: {
//       enabled: true
//     }
//   };
const options = {
    layout: {
        hierarchical: false,
    },
    physics: {
        enabled: true,
    },
    edges: {
        arrows: {
            to: {
                enabled: true,
                scaleFactor: 0.5 // Vous pouvez ajuster la taille des flèches selon vos préférences
            }
        }
    },
    nodes: {
        font: {
            size: 14 // Ajustez la taille de police selon vos préférences
        }
    }
};

  function addNode(e) {
    e.preventDefault();
    const newLabel = e.target.nodeLabel.value.trim(); // Trim leading/trailing spaces
    const sublabel = 1;
    if (nodes.some(node => node.label.toLowerCase() === newLabel.toLowerCase())) {
      Swal.fire('Attention!', 'Noeud déjà existant', 'warning');
    } else {
      const nodeOptions = nodes.map(node => ({
        id: node.id,
        label: node.label
    }));
        const newNode = {
            id: nextNodeId,
            label: newLabel,            
        };
      setNodes(prev => [...prev, newNode]);
      setNextNodeId(nextNodeId + 1);
    }
    e.target.nodeLabel.value = '';
  }
  

//   function addEdge(e) {
//     e.preventDefault();
//     const newEdge = {
//       from: e.target.node1.value,
//       to: e.target.node2.value,
//       label: e.target.edgeWeight.value,
//       arrows: "to"
//     };
//     // drawGraph(); // redessiner à chaque ajout
//     setEdges(prev => [...prev, newEdge]);
//     e.target.edgeWeight.value = 0;
//   }

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
        label: e.target.edgeWeight.value,
        arrows: "to" // Replace with desired default arrow direction
      };
      setEdges(prev => [...prev, newEdge]);
      e.target.edgeWeight.value = 0; // Reset weight input
    }
  }
  

  function resetGraph() {
    setNextNodeId(1)
    setNodes([]);
    setEdges([]);
    setTitlePage("");
  }

  function drawGraph() {
   // Créez un tableau pour stocker les options de chaque nœud
   const nodeOptions = nodes.map(node => ({
    id: node.id,
    label: node.label,
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


function drawGraphMin(min_way_to_color) {
  console.log("min_way_to_color: ", min_way_to_color);
  // Créez un tableau pour stocker les options de chaque nœud
  const nodeOptions = nodes.map(node => ({
      id: node.id,
      label: node.label,
      color:  "#f88",
      font: min_way_to_color.some(path => path.includes(node.label)) ? { size: 22, color: "#fff", face: "Arial" } :"",
      shadow: min_way_to_color.some(path => path.includes(node.label)) ?  true : false
  }));

// Créez un tableau pour stocker les options de chaque arête
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
      color: color,
      font : {color : fontColor, size : fontSize}
  };
});


  new vis.Network(graphRef.current, {
      nodes: new vis.DataSet(nodeOptions),
      edges: new vis.DataSet(edgeOptions),
      options: {
        
          // Spécifiez d'autres options si nécessaire
      }
  });
}

  async function getMinWay() {
    // Create the graph object in the required format
    const graph = {};

    nodes.forEach(node => {
        // Initialize an empty object for each node
        graph[node.label] = {};
        // Find edges related to this node
        edges.forEach(edge => {
            const destinationNode = nodes.find(n => parseInt(n.id) === parseInt(edge.to));
            if (parseInt(edge.from) === parseInt(node.id) ) {
                // Add the edge weight to the corresponding destination node
                graph[node.label][destinationNode.label] = parseInt(edge.label);
            }
        });
    });

    try {
        console.log(JSON.stringify(graph));
      const response = await axios.post('/get_min_way', graph);
      console.log("reposne : ")
      console.log(response.data); // Handle the server response (optional)
      setTitlePage("Chemin Minimal");
      drawGraphMin(response.data.min_optimal_ways);
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
            const destinationNode = nodes.find(n => parseInt(n.id) === parseInt(edge.to));
            if (parseInt(edge.from) === parseInt(node.id) ) {
                // Add the edge weight to the corresponding destination node
                graph[node.label][destinationNode.label] = parseInt(edge.label);
            }
        });
    });

    try {
        console.log(JSON.stringify(graph));
      const response = await axios.post('/get_max_way', graph);
      console.log("reposne : ")
      console.log(response.data); // Handle the server response (optional)
      setTitlePage("Chemin Maximal");
      drawGraphMin(response.data.max_optimal_ways);
      Swal.fire('Success!', 'Données du graph envoyées avec succès!', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'Une erreur est survenue lors de l\'envoi des données!', 'error');
    }
  }


  useEffect(() => {
    drawGraph();
  }, [nodes, edges]);
  

  
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
            <input name="edgeWeight" /> 
          </label>
          <button>Add Edge</button> 
        </form>

        <button onClick={resetGraph}>Reset</button> 
      <button onClick={getMinWay}>Trouver le chemin Minimal</button>
      <button onClick={getMaxWay}>Trouver le chemin Maximal</button>

      </div>
        <div className='main-container'>
            <div className='graph-title'>
                <h2>RECHERCHE OPERATIONNEL</h2>
                <h2>{titlePage}</h2>
            </div>
            <div ref={graphRef} className='' />              
            
        </div>
      {/* <button onClick={drawGraph}>Draw</button> */}
    </div>
  );

}


