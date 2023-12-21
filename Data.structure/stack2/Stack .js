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

class StackVisualizer {
  constructor() {
    this.stack = new Stack();
    this.canvas = document.getElementById("stackCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.placeholderText = "VISUALIZE STACK DATA STRUCTURE HERE.";
    this.setupEvents();
    this.drawStack();
  }

  setupEvents() {
    document.getElementById("uploadBtn").addEventListener("change", () => this.uploadFile());
    document.getElementById("pushBtn").addEventListener("click", () => this.pushData());
    document.getElementById("popBtn").addEventListener("click", () => this.popData());
    document.getElementById("clearBtn").addEventListener("click", () => this.clearStack());
  }

  drawStack() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Drawing logic for the stack remains the same
    // ...
  }

  uploadFile() {
    const fileInput = document.getElementById("uploadBtn");
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const lines = data.split("\n");
        this.stack.clear();
        lines.forEach((line) => this.stack.push(parseInt(line.trim())));
        this.drawStack();
      };
      reader.readAsText(file);
    }
  }

  pushData() {
    const dataInput = document.getElementById("dataInput");
    const data = parseInt(dataInput.value.trim());
    if (!isNaN(data)) {
      this.stack.push(data);
      this.drawStack();
      dataInput.value = "";
    }
  }

  popData() {
    const data = this.stack.pop();
    if (data !== null) {
      const message = `Popped data: ${data}`;
      alert(message);
      this.drawStack();
    }
  }

  clearStack() {
    this.stack.clear();
    this.drawStack();
  }
}

// Initialize the StackVisualizer
const stackVisualizer = new StackVisualizer();


// class Stack {
//   constructor() {
//     this.items = [];
//   }

//   push(item) {
//     this.items.push(item);
//   }

//   pop() {
//     if (!this.isEmpty()) {
//       return this.items.pop();
//     } else {
//       console.log("Stack is empty.");
//       return null;
//     }
//   }

//   isEmpty() {
//     return this.items.length === 0;
//   }

//   clear() {
//     this.items = [];
//   }

//   display() {
//     return this.items;
//   }
// }

// const stack = new Stack();
// const canvas = document.getElementById("stackCanvas");
// const ctx = canvas.getContext("2d");

// function drawStack() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   const startX = 50;
//   const startY = canvas.height - 100;
//   const barHeight = 30;
//   const spacing = 10;

//   // Drawing logic for the stack remains the same
//   // ...
//   // Check if the stack is empty
//   if (stack.isEmpty()) {
//     // Draw the placeholder text
//     ctx.fillStyle = "blue";
//     ctx.font = "40px cursive";
//     ctx.fillText(placeholderText, startX, startY - 50);
//   } else {
//     // Draw the stack
//     stack.display().forEach((item, index) => {
//       const barWidth = item * 3;
//       const x = startX;
//       const y = startY - index * (barHeight + spacing);
//       ctx.fillStyle = "blue";
//       ctx.fillRect(x, y, barWidth, barHeight);
//       ctx.fillStyle = "white";
//     const fontSize = 20; // Set the reduced font size
//       ctx.font = `${fontSize}px Arial`;
//       ctx.fillText(item, x + 4, y + barHeight / 1.5 + 2);
//     });


//   const pointerY = startY - stack.display().length * (barHeight + spacing);
//   ctx.beginPath();
//   ctx.moveTo(startX - 10, pointerY);
//   ctx.lineTo(startX + 10, pointerY);
//   ctx.lineTo(startX, pointerY - 10);
//   ctx.closePath();
//   ctx.fillStyle = "red";
//   ctx.fill();
// }

// function uploadFile() {
//   const fileInput = document.getElementById("fileInput");
//   const file = fileInput.files[0];

//   if (file) {
//     const reader = new FileReader();
//     reader.onload = function(event) {
//       const data = event.target.result;
//       const lines = data.split("\n");
//       stack.clear(); // Clear the stack before adding new data from the file
//       lines.forEach(line => stack.push(parseInt(line.trim())));
//       drawStack();
//     };
//     reader.readAsText(file);
//   }
// }

// // Other functions (pushData, popData, clearStack) remain the same
// // Function to push data
// function pushData() {
//   const dataInput = document.getElementById("dataInput");
//   const data = parseInt(dataInput.value.trim());
//   if (!isNaN(data)) {
//     stack.push(data);
//     drawStack();
//     // Clear the input after processing
//     dataInput.value = "";
//   }
// }

// // Function to pop data
// function popData() {
//   const data = stack.pop();
//   if (data !== null) {
//     const message = `Popped data: ${data}`;
//     alert(message);
//     drawStack();
//   }
// }

// // Function to clear stack
// function clearStack() {
//   stack.clear();
//   drawStack();
// }
// }

// drawStack();
