class ArrayManipulator {
  constructor(canvas) {
    this.dataArray = [];
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.pushButton = document.getElementById('pushButton');
    this.popButton = document.getElementById('popButton');
    this.clearButton = document.getElementById('clearButton');
    this.fileInput = document.getElementById('fileInput');
    this.inputField = document.getElementById('inputField');

    this.pushButton.addEventListener('click', this.pushValue.bind(this));
    this.popButton.addEventListener('click', this.popValue.bind(this));
    this.clearButton.addEventListener('click', this.clearArray.bind(this));
    this.fileInput.addEventListener('change', this.handleFileUpload.bind(this));

    this.updateCanvas();
  }

  pushValue() {
    const value = this.inputField.value;
    if (value) {
      this.dataArray.push(value);
      this.updateCanvas();
      this.inputField.value = '';
    }
  }

  popValue() {
    if (this.dataArray.length > 0) {
      this.dataArray.pop();
      this.updateCanvas();
    }
  }

  clearArray() {
    this.dataArray = [];
    this.updateCanvas();
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.dataArray = reader.result.split('\n').map(line => line.trim());
        this.updateCanvas();
      };
      reader.readAsText(file);
    }
  }


  updateCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const blockWidth = 40;
    const blockHeight = 20;
    const fontSize = 14; // Set the font size
    this.context.font = `${fontSize}px Arial`; // Set the font size and type
    const startX = 10;
    let currentX = startX;
    let currentY = this.canvas.height - 50;
  
    for (let i = 0; i < this.dataArray.length; i++) {
      const element = this.dataArray[i];
  
      this.context.fillStyle = 'blue';
      this.context.fillRect(currentX, currentY, blockWidth, blockHeight);
      this.context.fillStyle = 'white';
      this.context.fillText(element, currentX + 5, currentY + blockHeight / 3 + fontSize / 2 + 5);
  
      // Display index below the block
      this.context.fillStyle = 'black'; // Set the color for index numbers
      this.context.fillText(i.toString(), currentX + 5, currentY + blockHeight + fontSize + 5); // Adjust vertical position
  
      currentX += blockWidth + 5;
      if (currentX + blockWidth > this.canvas.width - startX) {
        currentX = startX;
        currentY -= blockHeight + 30; // Adjust vertical spacing
      }
    }
  }
  
  
}  

//   updateCanvas() {
//     this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     const blockWidth = 40;
//     const blockHeight = 20;
//     const startX = 10;
//     let currentX = startX;
//     let currentY = this.canvas.height - 30;

//     for (const element of this.dataArray) {
//       this.context.fillStyle = 'blue';
//       this.context.fillRect(currentX, currentY, blockWidth, blockHeight);
//       this.context.fillStyle = 'white';
//       this.context.fillText(element, currentX + 5, currentY + blockHeight / 2 + 5);

//       currentX += blockWidth + 5;
//       if (currentX + blockWidth > this.canvas.width - startX) {
//         currentX = startX;
//         currentY -= blockHeight + 10;
//       }
//     }
//   }
// }

const canvas = document.getElementById('canvas');
const manipulator = new ArrayManipulator(canvas);