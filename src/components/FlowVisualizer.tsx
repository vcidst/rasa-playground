import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { ReactFlow, Controls, Background, Node, Edge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import yaml from 'js-yaml';

interface FlowVisualizerProps {
  flowContent: string;
}

export const FlowVisualizer: React.FC<FlowVisualizerProps> = ({ flowContent }) => {
  // useMemo hook to parse YAML and generate initial nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    try {
      const parsedYaml = yaml.load(flowContent) as any;
      const flowData = parsedYaml?.flows || {};

      const generatedNodes: Node[] = [];
      const generatedEdges: Edge[] = [];

      Object.entries(flowData).forEach(([flowId, flow]: [string, any], flowIndex) => {
        // Add flow node
        generatedNodes.push({
          id: flowId,
          data: { label: flowId },
          position: { x: 100 + flowIndex * 300, y: 50 },
          type: 'input',
        });

        let previousStepId = flowId;

        const steps = flow.steps || [];
        steps.forEach((step: any, stepIndex) => {
          let stepId: string;
          let label: string;
          let emoji = "";

          // Determine step type and set properties
          if (step.collect) {
            stepId = `collect-${step.collect}`;
            label = `collect ${step.collect}`;
          } else if (step.action) {
            stepId = `action-${step.action}`;
            label = step.action;
            emoji = step.action.startsWith("utter_") ? "🗣️ " : "⚙️ ";
          } else if (step.noop === true) {
            stepId = `noop-${stepIndex}`;
            label = `Condition`;
          } else {
            stepId = `step-${stepIndex}`;
            label = `Step ${stepIndex}`;
          }

          // Add step node
          generatedNodes.push({
            id: stepId,
            data: { label: emoji + label },
            position: { x: 100 + flowIndex * 300, y: 200 + stepIndex * 150 },
          });

          // Connect previous step to current step
          generatedEdges.push({
            id: `${previousStepId}-${stepId}`,
            source: previousStepId,
            target: stepId,
          });

          // Handle next steps (conditional branching)
          if (step.next) {
            const nextSteps = Array.isArray(step.next) ? step.next : [step.next];
            nextSteps.forEach((nextStep: any, index) => {
              const nextId = nextStep.then || nextStep.if || 'END';
              const edgeLabel = nextStep.if ? `if: ${nextStep.if}` : nextId === 'END' ? 'END' : `then: ${nextId}`;

              generatedEdges.push({
                id: `${stepId}-${nextId}-${index}`,
                source: stepId,
                target: nextId,
                label: edgeLabel,
              });
            });
          }

          previousStepId = stepId;
        });
      });

      return { initialNodes: generatedNodes, initialEdges: generatedEdges };
    } catch (e) {
      console.error("Error parsing YAML:", e);
      return { initialNodes: [], initialEdges: [] };
    }
  }, [flowContent]);

  // useState hooks for managing nodes and edges
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // useEffect hook to update nodes and edges when initialNodes/Edges change
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

  // useCallback hooks for node/edge changes
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
