class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
      return this;
    }

    let current = this.root;
    while (true) {
      if (value === current.value) return undefined;
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  search(value) {
    const nodesVisited = [];
    let current = this.root;
    while (current) {
      nodesVisited.push(current);
      if (value === current.value) {
        return { found: true, nodesVisited };
      }
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return { found: false, nodesVisited };
  }

  inOrderTraversal(node, callback) {
    if (node !== null) {
      this.inOrderTraversal(node.left, callback);
      callback(node.value);
      this.inOrderTraversal(node.right, callback);
    }
  }

  clear() {
    this.root = null;
  }
}

// Function to draw the tree on canvas
function drawTree(root, x, y, ctx, highlightedNode) {
  if (!root) return;
  const radius = 20;
  const spacing = 6;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Set font size before displaying the value
  ctx.font = '18px Arial'; // Adjust the font size and font family as needed
  ctx.fillText(root.value, x - 5, y + 5);

  if (highlightedNode && highlightedNode.value === root.value) {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, radius + 5 + spacing, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'red';
  }

  if (root.left) {
      ctx.moveTo(x, y + radius);
      ctx.lineTo(x - 50, y + 80 + spacing - 10);
      ctx.stroke();
      drawTree(root.left, x - 50, y + 80 + spacing - 10, ctx, highlightedNode);
  }

  if (root.right) {
      ctx.moveTo(x, y + radius);
      ctx.lineTo(x + 50, y + 80 + spacing - 10);
      ctx.stroke();
      drawTree(root.right, x + 50, y + 80 + spacing - 10, ctx, highlightedNode);
  }
}

// Create a canvas and draw the tree
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const bst = new BinarySearchTree();
let highlightedNodeIndex = 0;
let searchInterval;

function insertValue() {
  const insertValueInput = document.getElementById('insertValue');
  const value = parseInt(insertValueInput.value);
  if (!isNaN(value)) {
    bst.insert(value);
    clearCanvas();
    drawTree(bst.root, canvas.width / 2, 50, ctx, null);
  }
  insertValueInput.value = '';
}

function searchValue() {
  const searchValueInput = document.getElementById('searchValue');
  const value = parseInt(searchValueInput.value);
  if (!isNaN(value)) {
    const { found, nodesVisited } = bst.search(value);
    clearCanvas();
    drawTree(bst.root, canvas.width / 2, 50, ctx, null);

    if (found) {
      currentSearchValue = value; // Store the search value
      highlightedNodeIndex = 0;
      animateSearchPath(nodesVisited);
      console.log(`Value ${value} found in the tree.`);
    } else {
      console.log(`Value ${value} not found in the tree.`);
      ctx.font = '20px Arial';
      ctx.fillText(`Value ${value} not found`, canvas.width / 2 - 70, canvas.height - 20);
    }
  }
  searchValueInput.value = '';
}

function animateSearchPath(nodesVisited) {
  clearInterval(searchInterval);
  searchInterval = setInterval(() => {
    if (highlightedNodeIndex >= nodesVisited.length) {
      clearInterval(searchInterval);
    } else {
      const currentNode = nodesVisited[highlightedNodeIndex];
      clearCanvas();
      drawTree(bst.root, canvas.width / 2, 50, ctx, currentNode);
      highlightedNodeIndex++;
    }
  }, 1000); // Adjust the interval to control the animation speed
}

function pauseSearch() {
  clearInterval(searchInterval);
}

function continueSearch() {
  animateSearchPath(bst.search(currentSearchValue).nodesVisited);
}

function stepBack() {
  clearInterval(searchInterval);
  if (highlightedNodeIndex > 0) {
    highlightedNodeIndex--;
    const currentNode = bst.search(currentSearchValue).nodesVisited[highlightedNodeIndex];
    clearCanvas();
    drawTree(bst.root, canvas.width / 2, 50, ctx, currentNode);
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearTree() {
  bst.clear();
  clearCanvas();
}

function readFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const content = event.target.result;
    const values = content.split('\n').map(line => parseInt(line));
    values.forEach(value => bst.insert(value));
    clearCanvas();
    drawTree(bst.root, canvas.width / 2, 50, ctx, null);
  };

  reader.readAsText(file);
}

function inOrderTraversal() {
  const traversalOutput = document.createElement('div');
  traversalOutput.style.marginTop = '10px';
  document.body.appendChild(traversalOutput);

  bst.inOrderTraversal(bst.root, value => {
    traversalOutput.innerHTML += `${value} -> `;
  });
}

