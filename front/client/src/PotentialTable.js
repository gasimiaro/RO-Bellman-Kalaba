export default function PotentialTable({ minPotentials, currentStepIndex }) {
  const nodes = Object.keys(minPotentials[0]);

  return (
    <table>
      <thead>
        <tr>
          <th>Node</th>
          {minPotentials.map((step, index) => (
            <th key={index} style={{ backgroundColor: index <= currentStepIndex ? 'lightgreen' : 'transparent' }}>
              Step {index + 1}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {nodes.map((node, nodeIndex) => (
          <tr key={nodeIndex}>
            <td>{node}</td>
            {minPotentials.map((step, index) => {
              // Compare the current step with the previous step
              const previousStep = index > 0 ? minPotentials[index - 1][node] : null;
              const currentStep = step[node];
              const hasChanged = previousStep !== null && currentStep !== previousStep;

              // Apply the 'yellow' background only if the step is visible and has changed
              const isVisible = index <= currentStepIndex;
              const shouldHighlightChange = hasChanged && isVisible;

              return (
                <td
                  key={index}
                  style={{
                    backgroundColor: shouldHighlightChange ? 'yellow' : (isVisible ? 'lightgreen' : 'transparent'),
                    color: isVisible ? 'black' : 'transparent', // Only show text for visible steps
                  }}
                >
                  {currentStep === Infinity ? "~" : currentStep}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// export default function PotentialTable({ minPotentials, currentStepIndex }) {
//   const nodes = Object.keys(minPotentials[0]);

//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>Node</th>
//           {minPotentials.map((step, index) => (
//             <th key={index} style={{ backgroundColor: index <= currentStepIndex ? 'lightgreen' : 'transparent' }}>
//               Step {index + 1}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {nodes.map((node, nodeIndex) => (
//           <tr key={nodeIndex}>
//             <td>{node}</td>
//             {minPotentials.map((step, index) => (
//               <td
//                 key={index}
//                 style={{
//                   backgroundColor: index <= currentStepIndex ? 'lightgreen' : 'transparent',
//                   color: index <= currentStepIndex ? 'black' : 'transparent',
//                 }}
//               >
//                 {step[node] === Infinity ? "~" : step[node]}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }
// import './PotentialTable.css';

// export default function PotentialTable({ minPotentials, currentStepIndex }) {
//       const nodes = Object.keys(minPotentials[0]);
  
//     return (
//       <table>
//         <thead>
//           <tr>
//             <th>Node</th>
//             {minPotentials.map((step, index) => (
//               <th key={index}>Step {index + 1}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {nodes.map((node, nodeIndex) => (
//             <tr key={nodeIndex}>
//               <td>{node}</td>
//               {minPotentials.map((step, index) => (
//                 <td key={index}>{step[node] === Infinity ? "~" : step[node]}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   }
  

