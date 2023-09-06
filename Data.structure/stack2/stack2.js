class Stack {
  constructor() {
      this.items = [];
  }

  push(item) {
      this.items.push(item);
  }

  pop() {
      if (!this.isEmpty()) {
          return this.items.pop();
      } else {
          console.log("Stack is empty.");
          return null;
      }
  }

  isEmpty() {
      return this.items.length === 0;
  }

  clear() {
      this.items = [];
  }

  display() {
      return this.items;
  }
}

const stack = new Stack();
const canvas = document.getElementById("stackCanvas");
const ctx = canvas.getContext("2d");

// const placeholderText = "Enter a value, use the push operation to add the value to the stack, and use the pop operation to remove a value from the stack.";
const placeholderText = "ENTER DATA TO VISUALIZE STACK DATA STRUCTURE HERE.";

function drawStack() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const startX = 50;
  const startY = canvas.height - 100;
  const barHeight = 30;
  const spacing = 10;

  // Check if the stack is empty
  if (stack.isEmpty()) {
    // Draw the placeholder text
    ctx.fillStyle = "blue";
    ctx.font = "40px cursive";
    ctx.fillText(placeholderText, startX, startY - 150);
  } else {
    // Draw the stack
    stack.display().forEach((item, index) => {
      const barWidth = item * 10;
      const x = startX;
      const y = startY - index * (barHeight + spacing);
      ctx.fillStyle = "blue";
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fillStyle = "white";
      ctx.fillText(item, x + 5, y + barHeight / 2 + 5);
    });

    const pointerY = startY - stack.display().length * (barHeight + spacing);
    ctx.beginPath();
    ctx.moveTo(startX - 10, pointerY);
    ctx.lineTo(startX + 10, pointerY);
    ctx.lineTo(startX, pointerY - 10);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
  }
}

// Function to upload file
function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const data = event.target.result;
      const lines = data.split("\n");
      lines.forEach(line => stack.push(parseInt(line.trim())));
      drawStack();
    };
    reader.readAsText(file);
  }
}

// Function to push data
function pushData() {
  const dataInput = document.getElementById("dataInput");
  const data = parseInt(dataInput.value.trim());
  if (!isNaN(data)) {
    stack.push(data);
    drawStack();
    // Clear the input after processing
    dataInput.value = "";
  }
}

// Function to pop data
function popData() {
  const data = stack.pop();
  if (data !== null) {
    const message = `Popped data: ${data}`;
    alert(message);
    drawStack();
  }
}

// Function to clear stack
function clearStack() {
  stack.clear();
  drawStack();
}

drawStack();
