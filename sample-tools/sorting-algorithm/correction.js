class SortingVisualizer {
  constructor() {
    this.canvas = document.getElementById('myCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.barSpacing = 2;
    this.canvasHeight = this.canvas.height;
    this.canvasWidth = this.canvas.width;
    this.values = [];
    this.sortedValues = [];
    this.startTime = 0;
    this.timerInterval = null;
    this.isSortingPaused = false;
    this.sortingSpeed = 50; // Default sorting speed (higher value means slower sorting)
    this.initEventListeners();
  }

  initEventListeners() {
    document.getElementById('startSorting').addEventListener('click', this.performSorting.bind(this));
    document.getElementById('pauseSorting').addEventListener('click', this.pauseSorting.bind(this));
    document.getElementById('fileInput').addEventListener('change', this.handleFileUpload.bind(this));
    document.getElementById('enterData').addEventListener('click', this.enterData.bind(this));
    document.getElementById('clearCanvas').addEventListener('click', this.clearCanvas.bind(this));
  }

  parseCSV(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const lines = reader.result.split('\n');
        this.values = lines.map((line) => parseInt(line.trim()));
        resolve();
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  drawBars(swappingIndices = [], movingIndex = null) {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    const barWidth = (this.canvasWidth - (this.barSpacing * (this.values.length - 1))) / this.values.length;
    for (let i = 0; i < this.values.length; i++) {
      const barHeight = this.canvasHeight - this.values[i];
      if (swappingIndices.includes(i)) {
        this.ctx.fillStyle = 'red'; // Set a different color for swapping elements
      } else if (i === movingIndex) {
        this.ctx.fillStyle = 'green'; // Set a different color for the element being moved
      } else {
        this.ctx.fillStyle = 'blue'; // Default color for other elements
      }
      this.ctx.fillRect(i * (barWidth + this.barSpacing), barHeight, barWidth, this.values[i]);
    }
  }

  updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - this.startTime) / 1000;
    document.getElementById('timer').innerText = `Elapsed Time: ${elapsedTime.toFixed(2)} seconds`;
  }

  async animateSorting(sortingFunction) {
    for (let i = 0; i < this.values.length; i++) {
      while (this.isSortingPaused) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      await sortingFunction(i);
      await new Promise((resolve) => setTimeout(resolve, 1000 - this.sortingSpeed));
    }
  }

  async bubbleSort() {
    for (let i = 0; i < this.values.length - 1; i++) {
      let swapped = false;
      for (let j = 0; j < this.values.length - i - 1; j++) {
        if (this.values[j] > this.values[j + 1]) {
          await this.swap(j, j + 1);
          this.drawBars([j, j + 1], j + 1);
          swapped = true;
        }
      }
      if (!swapped) {
        break; // If no elements were swapped, the array is already sorted
      }
    }
  }

  async insertionSort() {
    for (let i = 1; i < this.values.length; i++) {
      let key = this.values[i];
      let j = i - 1;
      while (j >= 0 && this.values[j] > key) {
        await this.swap(j, j + 1);
        this.drawBars([j, j + 1], j + 1);
        j--;
      }
      this.values[j + 1] = key;
    }
  }

  async selectionSort() {
    for (let i = 0; i < this.values.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < this.values.length; j++) {
        if (this.values[j] < this.values[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        await this.swap(i, minIndex);
        this.drawBars([i, minIndex], minIndex);
      }
    }
  }

  async mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return await this.animateMerge(await this.mergeSort(left), await this.mergeSort(right));
  }

  async animateMerge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    const remaining = left.slice(leftIndex).concat(right.slice(rightIndex));
    result = result.concat(remaining);

    for (let i = 0; i < result.length; i++) {
      this.values[i] = result[i];
      this.drawBars([i], i); // Highlight the swapped element in red
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }

    return result;
  }

  async quickSort(arr, start, end) {
    if (start >= end) return;

    const index = await this.partition(arr, start, end);
    await this.quickSort(arr, start, index - 1);
    await this.quickSort(arr, index + 1, end);
  }

  async partition(arr, start, end) {
    let pivotValue = arr[end];
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
      if (arr[i] < pivotValue) {
        await this.swapWithAnimation(i, pivotIndex);
        pivotIndex++;
      }
    }
    await this.swapWithAnimation(pivotIndex, end);
    return pivotIndex;
  }

  async swap(i, j) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - this.sortingSpeed));
    let temp = this.values[i];
    this.values[i] = this.values[j];
    this.values[j] = temp;
    this.drawBars([], j); // Highlight the element being moved in green
  }

  async swapWithAnimation(i, j) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - this.sortingSpeed));
    let temp = this.values[i];
    this.values[i] = this.values[j];
    this.values[j] = temp;
    this.drawBars([i, j], j); // Highlight the swapped elements in red
  }

  async performSorting() {
    const algorithm = document.getElementById('algorithm').value;
    const order = document.getElementById('order').value;
    this.sortingSpeed = 100 - document.getElementById('speed').value; // Update sorting speed based on the slider

    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
      await this.parseCSV(fileInput.files[0]);
      document.getElementById('variablesBefore').innerText = `Before sorting:\n${this.values.join('\n')}`;
    } else {
      this.parseInputData();
    }

    this.drawBars();
    document.getElementById('variablesAfter').innerText = '';

    this.startTime = new Date().getTime(); // Record the start time for the timer
    this.isSortingPaused = false; // Reset the sorting paused flag

    switch (algorithm) {
      case 'bubble':
        await this.animateSorting(this.bubbleSort.bind(this));
        break;
      case 'insertion':
        await this.animateSorting(this.insertionSort.bind(this));
        break;
      case 'selection':
        await this.animateSorting(this.selectionSort.bind(this));
        break;
      case 'merge':
        this.values = await this.mergeSort(this.values);
        break;
      case 'quick':
        await this.quickSort(this.values, 0, this.values.length - 1);
        break;
      default:
        break;
    }

    if (order === 'descending') {
      this.values.reverse();
    }

    this.sortedValues = this.values.slice(); // Save the sorted values for repeating
    document.getElementById('variablesAfter').innerText = `After sorting:\n${this.values.join('\n')}`;
    this.drawBars();

    clearInterval(this.timerInterval); // Clear any existing timer interval
    this.updateTimer(); // Show the final time after sorting is completed
  }

  repeatPrevious() {
    this.values = this.sortedValues.slice(); // Restore the original unsorted values
    this.drawBars();
  }

  pauseSorting() {
    this.isSortingPaused = !this.isSortingPaused;
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.parseCSV(file).then(() => {
        this.drawBars();
      });
    }
  }

  enterData() {
    const inputData = document.getElementById('inputData').value;
    if (inputData) {
      const value = parseInt(inputData);
      if (!isNaN(value)) {
        this.values.push(value);
        this.drawBars();
        document.getElementById('inputData').value = '';
      }
    }
  }

  clearCanvas() {
    this.values = [];
    this.drawBars();
    document.getElementById('inputData').value = '';
    document.getElementById('variablesBefore').innerText = '';
    document.getElementById('variablesAfter').innerText = '';
    document.getElementById('timer').innerText = '';
  
    // Reset the algorithm selection, order, and speed inputs
    document.getElementById('algorithm').selectedIndex = 0;
    document.getElementById('order').selectedIndex = 0;
    document.getElementById('speed').value = 50;
  
    // Clear the file input field
    document.getElementById('fileInput').value = '';
  }
}

const sortingVisualizer = new SortingVisualizer();




// class SortingVisualizer {
//   constructor() {
//     this.canvas = document.getElementById('myCanvas');
//     this.ctx = this.canvas.getContext('2d');
//     this.barSpacing = 2;
//     this.canvasHeight = this.canvas.height;
//     this.canvasWidth = this.canvas.width;
//     this.values = [];
//     this.sortedValues = [];
//     this.startTime = 0;
//     this.timerInterval = null;
//     this.isSortingPaused = false;
//     this.sortingSpeed = 50; // Default sorting speed (higher value means slower sorting)
//     this.initEventListeners();
//   }

//   initEventListeners() {
//     document.getElementById('startSorting').addEventListener('click', this.performSorting.bind(this));
//     document.getElementById('pauseSorting').addEventListener('click', this.pauseSorting.bind(this));
//     document.getElementById('fileInput').addEventListener('change', this.handleFileUpload.bind(this));
//     document.getElementById('enterData').addEventListener('click', this.enterData.bind(this));
//     document.getElementById('clearCanvas').addEventListener('click', this.clearCanvas.bind(this));
//   }

//   parseCSV(file) {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const lines = reader.result.split('\n');
//         this.values = lines.map((line) => parseInt(line.trim()));
//         resolve();
//       };
//       reader.onerror = reject;
//       reader.readAsText(file);
//     });
//   }

//   drawBars(swappingIndices = [], movingIndex = null) {
//     this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
//     const barWidth = (this.canvasWidth - (this.barSpacing * (this.values.length - 1))) / this.values.length;
//     for (let i = 0; i < this.values.length; i++) {
//       const barHeight = this.canvasHeight - this.values[i];
//       if (swappingIndices.includes(i)) {
//         this.ctx.fillStyle = 'red'; // Set a different color for swapping elements
//       } else if (i === movingIndex) {
//         this.ctx.fillStyle = 'green'; // Set a different color for the element being moved
//       } else {
//         this.ctx.fillStyle = 'blue'; // Default color for other elements
//       }
//       this.ctx.fillRect(i * (barWidth + this.barSpacing), barHeight, barWidth, this.values[i]);
//     }
//   }

//   updateTimer() {
//     const currentTime = new Date().getTime();
//     const elapsedTime = (currentTime - this.startTime) / 1000;
//     document.getElementById('timer').innerText = `Elapsed Time: ${elapsedTime.toFixed(2)} seconds`;
//   }

//   async animateSorting(sortingFunction) {
//     for (let i = 0; i < this.values.length; i++) {
//       while (this.isSortingPaused) {
//         await new Promise((resolve) => setTimeout(resolve, 100));
//       }
//       await sortingFunction(i);
//       await new Promise((resolve) => setTimeout(resolve, 1000 - this.sortingSpeed));
//     }
//   }

//   async bubbleSort() {
//     for (let i = 0; i < this.values.length - 1; i++) {
//       let swapped = false;
//       for (let j = 0; j < this.values.length - i - 1; j++) {
//         if (this.values[j] > this.values[j + 1]) {
//           await this.swap(j, j + 1);
//           this.drawBars([j, j + 1], j + 1);
//           swapped = true;
//         }
//       }
//       if (!swapped) {
//         break; // If no elements were swapped, the array is already sorted
//       }
//     }
//   }

//   async insertionSort() {
//     for (let i = 1; i < this.values.length; i++) {
//       let key = this.values[i];
//       let j = i - 1;
//       while (j >= 0 && this.values[j] > key) {
//         await this.swap(j, j + 1);
//         this.drawBars([j, j + 1], j + 1);
//         j--;
//       }
//       this.values[j + 1] = key;
//     }
//   }

//   async selectionSort() {
//     for (let i = 0; i < this.values.length - 1; i++) {
//       let minIndex = i;
//       for (let j = i + 1; j < this.values.length; j++) {
//         if (this.values[j] < this.values[minIndex]) {
//           minIndex = j;
//         }
//       }
//       if (minIndex !== i) {
//         await this.swap(i, minIndex);
//         this.drawBars([i, minIndex], minIndex);
//       }
//     }
//   }

//   async mergeSort(arr) {
//     if (arr.length <= 1) return arr;

//     const middle = Math.floor(arr.length / 2);
//     const left = arr.slice(0, middle);
//     const right = arr.slice(middle);

//     return await this.animateMerge(await this.mergeSort(left), await this.mergeSort(right));
//   }

//   async animateMerge(left, right) {
//     let result = [];
//     let leftIndex = 0;
//     let rightIndex = 0;

//     while (leftIndex < left.length && rightIndex < right.length) {
//       if (left[leftIndex] < right[rightIndex]) {
//         result.push(left[leftIndex]);
//         leftIndex++;
//       } else {
//         result.push(right[rightIndex]);
//         rightIndex++;
//       }
//     }

//     const remaining = left.slice(leftIndex).concat(right.slice(rightIndex));
//     result = result.concat(remaining);

//     for (let i = 0; i < result.length; i++) {
//       this.values[i] = result[i];
//       this.drawBars(); // Show the merge process without highlighting
//       await new Promise((resolve) => requestAnimationFrame(resolve));
//     }

//     return result;
//   }

//   async quickSort(arr, start, end) {
//     if (start >= end) return;

//     const index = await this.partition(arr, start, end);
//     await this.quickSort(arr, start, index - 1);
//     await this.quickSort(arr, index + 1, end);
//   }

//   async partition(arr, start, end) {
//     let pivotValue = arr[end];
//     let pivotIndex = start;
//     for (let i = start; i < end; i++) {
//       if (arr[i] < pivotValue) {
//         await this.swap(arr, i, pivotIndex);
//         this.drawBars([i, pivotIndex], pivotIndex);
//         pivotIndex++;
//       }
//     }
//     await this.swap(arr, pivotIndex, end);
//     this.drawBars([pivotIndex, end], pivotIndex);
//     return pivotIndex;
//   }

//   async swap(i, j) {
//     await new Promise((resolve) => setTimeout(resolve, 1000 - this.sortingSpeed));
//     let temp = this.values[i];
//     this.values[i] = this.values[j];
//     this.values[j] = temp;
//     this.drawBars([], j); // Highlight the element being moved in green
//   }

//   async performSorting() {
//     const algorithm = document.getElementById('algorithm').value;
//     const order = document.getElementById('order').value;
//     this.sortingSpeed = 100 - document.getElementById('speed').value; // Update sorting speed based on the slider

//     const fileInput = document.getElementById('fileInput');
//     if (fileInput.files.length > 0) {
//       await this.parseCSV(fileInput.files[0]);
//       document.getElementById('variablesBefore').innerText = `Before sorting:\n${this.values.join('\n')}`;
//     } else {
//       this.parseInputData();
//     }

//     this.drawBars();
//     document.getElementById('variablesAfter').innerText = '';

//     this.startTime = new Date().getTime(); // Record the start time for the timer
//     this.isSortingPaused = false; // Reset the sorting paused flag

//     switch (algorithm) {
//       case 'bubble':
//         await this.animateSorting(this.bubbleSort.bind(this));
//         break;
//       case 'insertion':
//         await this.animateSorting(this.insertionSort.bind(this));
//         break;
//       case 'selection':
//         await this.animateSorting(this.selectionSort.bind(this));
//         break;
//       case 'merge':
//         this.values = await this.mergeSort(this.values);
//         break;
//       case 'quick':
//         await this.quickSort(this.values, 0, this.values.length - 1);
//         break;
//       default:
//         break;
//     }

//     if (order === 'descending') {
//       this.values.reverse();
//     }

//     this.sortedValues = this.values.slice(); // Save the sorted values for repeating
//     document.getElementById('variablesAfter').innerText = `After sorting:\n${this.values.join('\n')}`;
//     this.drawBars();

//     clearInterval(this.timerInterval); // Clear any existing timer interval
//     this.updateTimer(); // Show the final time after sorting is completed
//   }

//   repeatPrevious() {
//     this.values = this.sortedValues.slice(); // Restore the original unsorted values
//     this.drawBars();
//   }

//   pauseSorting() {
//     this.isSortingPaused = !this.isSortingPaused;
//   }

//   handleFileUpload(event) {
//     const file = event.target.files[0];
//     if (file) {
//       this.parseCSV(file).then(() => {
//         this.drawBars();
//       });
//     }
//   }

//   enterData() {
//     const inputData = document.getElementById('inputData').value;
//     if (inputData) {
//       const value = parseInt(inputData);
//       if (!isNaN(value)) {
//         this.values.push(value);
//         this.drawBars();
//         document.getElementById('inputData').value = '';
//       }
//     }
//   }

//   clearCanvas() {
//     this.values = [];
//     this.drawBars();
//     document.getElementById('inputData').value = '';
//     document.getElementById('variablesBefore').innerText = '';
//     document.getElementById('variablesAfter').innerText = '';
//     document.getElementById('timer').innerText = '';
  
//     // Reset the algorithm selection, order, and speed inputs
//     document.getElementById('algorithm').selectedIndex = 0;
//     document.getElementById('order').selectedIndex = 0;
//     document.getElementById('speed').value = 50;
  
//     // Clear the file input field
//     document.getElementById('fileInput').value = '';
//   }
// }

// const sortingVisualizer = new SortingVisualizer();



