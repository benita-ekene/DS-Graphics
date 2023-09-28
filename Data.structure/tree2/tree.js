const codeEditor = CodeMirror.fromTextArea(document.getElementById('code'), {
  mode: 'javascript',
  theme: 'dracula', // You can choose a different theme
  lineNumbers: true,
  autofocus: true,
});

// Function to execute the code in the editor
function executeCode() {
  clearCanvas();
  const code = codeEditor.getValue();
  eval(code); // Evaluate the code provided by the user
}

// Attach an event listener to the "Execute" button
document.getElementById('execute').addEventListener('click', executeCode);

// Binary Search Tree and Visualization code
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
  // Tree drawing code
  // ...

  // Search animation functions
  // ...

  // Other functions
  // ...
}

function clearCanvas() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}