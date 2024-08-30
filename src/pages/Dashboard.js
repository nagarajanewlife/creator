import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../App.css";

const initialTasks = [
  {
    id: "task1",
    content: <input type="text" placeholder="Input for Task 1" />,
  },
  {
    id: "task2",
    content: <button type="button">Button 1</button>,
  },
  {
    id: "task3",
    content: (
      <select>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
    ),
  },
];

const ItemType = {
  TASK: "TASK",
};

const DraggableTask = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASK,
    item: { content: task.content },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="draggable"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {task.content}
    </div>
  );
};

const DropArea = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TASK,
    drop: (item) => onDrop(item.content),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        background: isOver ? "lightgreen" : "lightgray",
        padding: "20px",
        margin: "10px 0",
        minHeight: "50px",
        border: "1px dashed #000",
      }}
    >
      Drop here to add input field
    </div>
  );
};

function App() {
  const [tasks] = useState(initialTasks);
  const [droppedInputs, setDroppedInputs] = useState([]);

  const handleDrop = (content) => {
    setDroppedInputs((prev) => [...prev, content]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className="task-list">
          {tasks.map((task) => (
            <DraggableTask key={task.id} task={task} />
          ))}
        </div>
        <div>
          <DropArea onDrop={handleDrop} />
          {droppedInputs.map((input, index) => (
            <div
              key={index}
              style={{ margin: "10px 0", width: "100%", height: "100%" }}
            >
              {input}
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
