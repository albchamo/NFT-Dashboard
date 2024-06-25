'use client';

import React from 'react';
import { TextField, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface NodeFormProps {
  nodes: { address: string; tag: string }[];
  setNodes: React.Dispatch<React.SetStateAction<{ address: string; tag: string }[]>>;
  handleNodeChange: (index: number, field: 'address' | 'tag', value: string) => void;
  addNodeField: () => void;
  removeNodeField: (index: number) => void;
}

const NodeForm: React.FC<NodeFormProps> = ({
  nodes,
  setNodes,
  handleNodeChange,
  addNodeField,
  removeNodeField,
}) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedNodes = Array.from(nodes);
    const [movedNode] = reorderedNodes.splice(result.source.index, 1);
    reorderedNodes.splice(result.destination.index, 0, movedNode);

    setNodes(reorderedNodes);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="nodes">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={{ padding: '0 40px', overflowY: 'auto' }}>
            {nodes.map((node, index) => (
              <Draggable key={index} draggableId={index.toString()} index={index}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    display="flex"
                    alignItems="center"
                    marginBottom="8px"
                    style={{ padding: '0 40px', borderRadius: '4px' }}
                  >
                    <TextField
                      label={`Node ${index + 1} Contract Address`}
                      value={node.address}
                      onChange={(e) => handleNodeChange(index, 'address', e.target.value)}
                      margin="normal"
                      style={{ flex: 2 }}
                      InputLabelProps={{ style: { color: '#ffffff' } }}
                      InputProps={{
                        style: { color: '#ffffff' },
                        sx: {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffffff',
                            borderWidth: '2px', // Adjust the border width here
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffffff',
                            borderWidth: '2px', // Adjust the border width on hover
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffffff',
                            borderWidth: '2px', // Adjust the border width when focused
                          },
                        },
                      }}
                    />
                    <TextField
                      label="Name"
                      value={node.tag}
                      onChange={(e) => handleNodeChange(index, 'tag', e.target.value)}
                      margin="normal"
                      style={{ flex: 1, marginLeft: '10px' }}
                      InputLabelProps={{ style: { color: '#ffffff' } }}
                      InputProps={{
                        style: { color: '#ffffff' },
                        sx: {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffffff',
                            borderWidth: '2px', // Adjust the border width here
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffffff',
                            borderWidth: '2px', // Adjust the border width on hover
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffffff',
                            borderWidth: '2px', // Adjust the border width when focused
                          },
                        },
                      }}
                    />
                    <IconButton
                      onClick={() => removeNodeField(index)}
                      aria-label="remove node"
                      style={{ marginLeft: '8px', color: '#D80032' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Box display="flex" justifyContent="center" mt={2} p={2}>
        <IconButton
          onClick={addNodeField}
          style={{
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '12px',
            borderRadius: '50%',
            fontSize: '32px',
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </DragDropContext>
  );
};

export default NodeForm;
