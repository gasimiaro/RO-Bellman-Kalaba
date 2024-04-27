import './PotentialTable.css';

export default function PotentialTable({ minPotentials }) {
    const nodes = Object.keys(minPotentials[0]);
  
    return (
      <table>
        <thead>
          <tr>
            <th>Node</th>
            {minPotentials.map((step, index) => (
              <th key={index}>Step {index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {nodes.map((node, nodeIndex) => (
            <tr key={nodeIndex}>
              <td>{node}</td>
              {minPotentials.map((step, index) => (
                <td key={index}>{step[node] === Infinity ? "~" : step[node]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  

// export default function PotentialTable({ minPotentials }) {
//     return (
//       <table>
//         <thead>
//           <tr>
//             <th>Step</th>
//             {Object.keys(minPotentials[0]).map(node => (
//               <th key={node}>{node}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {minPotentials.map((step, index) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               {Object.values(step).map((value, nodeIndex) => (
//                 <td key={nodeIndex}>{value === Infinity ? "Infinity" : value}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   }


  