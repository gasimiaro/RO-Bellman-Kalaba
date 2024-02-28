import { useState, useEffect } from 'react';
import { DataSet } from 'vis-data/peer';
import { Network } from 'vis-network/peer';
// import { Graph } from 'react-graph-vis';
import Graph from './Graph';
export default function App() {
  // const [arbre, setArbre] = useState(null);  
  // const [minPotential, setMinPotential] = useState(null);
  // const [maxPotential, setMaxPotential] = useState(null);

  // useEffect(() => {
  //   async function fetchData() {
  //     const res = await fetch('http://localhost:5000/get_arbre');
  //     const data = await res.json();
  //     setArbre(data.arbre); 

  //     const minRes = await fetch('http://localhost:5000/get_min_potential');
  //     const minData = await minRes.json();
  //     setMinPotential(minData);

  //     const maxRes = await fetch('http://localhost:5000/get_max_potential');
  //     const maxData = await maxRes.json();  
  //     setMaxPotential(maxData);
  //   }
  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   if (arbre) {
  //     drawTree2(arbre, 'arbre');
  //   }  
  //   if (minPotential) {
  //     drawTree(minPotential.potential, minPotential.optimal_path, 'minPotentialTree');
  //   }
  //   if (maxPotential) {
  //     drawTree(maxPotential.potential, maxPotential.optimal_path, 'maxPotentialTree');
  //   }
  // }, [arbre, minPotential, maxPotential]);
  //   const drawTree2 = (treeData) => {

  //     // Créer les nodes
  //     const nodes = new DataSet();
  //     for (const [key, value] of Object.entries(treeData)) {
  //       nodes.add({id: key, label: value}); 
  //     }
    
  //     // Créer les edges
  //     const edges = new DataSet();
  //     for (const [parent, children] of Object.entries(treeData)) {
  //       for (const child of Object.keys(children)) {
  //         edges.add({from: parent, to: child});
  //       }
  //     }
    
  //     // Options de mise en page
  //     const options = {
  //       layout: {
  //         hierarchical: {
  //           direction: 'UD',
  //           sortMethod: 'directed'
  //         }
  //       }
  //     };
    
  //     // Créer le network
  //     const container = document.getElementById('arbre');
  //     const data = {
  //       nodes: nodes, 
  //       edges: edges
  //     };
  //     new Network(container, data, options);
    
  //   }

  // const drawTree = (treeData, optimalPath, containerId) => {
  //   const nodes = new DataSet();
  //   const edges = new DataSet();

  //   // Add nodes
  //   for (const [key, value] of Object.entries(treeData)) {
  //     nodes.add({ id: key, label: `${key}: ${value}` });
  //   }

  //   // Add edges
  //   for (let i = 1; i < optimalPath.length; i++) {
  //     edges.add({ from: optimalPath[i - 1], to: optimalPath[i] });
  //   }

  //   // Create a network
  //   const container = document.getElementById(containerId);
  //   const data = {
  //     nodes: nodes,
  //     edges: edges,
  //   };
  //   const options = {
  //     layout: {
  //       hierarchical: {
  //         direction: 'UD',
  //         sortMethod: 'directed',
  //       },
  //     },
  //   };
  //   new Network(container, data, options);
  // };

  return (
    <div>
      {/* <Graph
        graph={{
          nodes: [
            { id: "A", label: "A", color: "red" },
            // ...
          ], 
          edges: [
            { from: "A", to: "B" },
            // ...
          ]
        }}
        options={{
          layout: {
            hierarchical: true
          }
        }}
      /> */}
<Graph />
      {/* {arbre &&
        <div id="arbre" style={{height: '400px'}}></div>
      }    
      {minPotential && 
        <div>
          <h3>Min Potential</h3>
          <div id="minPotentialTree" style={{ height: '400px' }}></div>
        </div>
      }

      {maxPotential && 
        <div>
          <h3>Max Potential</h3>
          <div id="maxPotentialTree" style={{ height: '400px' }}></div>
        </div>
      } */}
    </div>
  );
}
