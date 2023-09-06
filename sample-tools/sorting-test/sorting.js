const canvas = document.getElementById("dataCanvas");
const ctx = canvas.getContext("2d");
const data = [];

function drawData() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = 20;
    const spacing = 5;
    const startY = canvas.height;

    data.forEach((value, index) => {
        const x = index * (barWidth + spacing);
        const barHeight = value * 10; // Adjust for scaling
        ctx.fillStyle = "blue";
        ctx.fillRect(x, startY - barHeight, barWidth, barHeight);
    });
}

function addData() {
    const dataInput = document.getElementById("dataInput");
    const value = parseInt(dataInput.value.trim());
    if (!isNaN(value)) {
        data.push(value);
        drawData();
        dataInput.value = "";
    }
}

function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const dataFromFile = event.target.result.split("\n");
            dataFromFile.forEach(line => {
                const value = parseInt(line.trim());
                if (!isNaN(value)) {
                    data.push(value);
                }
            });
            drawData();
        };
        reader.readAsText(file);
    }
}

function bubbleSort() {
    // Implement Bubble Sort algorithm
    const n = data.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            if (data[i] > data[i + 1]) {
                const temp = data[i];
                data[i] = data[i + 1];
                data[i + 1] = temp;
                swapped = true;
                drawData();
            }
        }
    } while (swapped);
}

function quickSort() {
    // Implement Quick Sort algorithm
    // (You can use a library or write your own implementation)
    // Sorting algorithms like Quick Sort are complex and require more code.
    // You can find existing implementations or write one based on your needs.
}

// Event listeners for buttons
document.getElementById("addData").addEventListener("click", addData);
document.getElementById("uploadFile").addEventListener("click", uploadFile);
document.getElementById("bubbleSort").addEventListener("click", bubbleSort);
document.getElementById("quickSort").addEventListener("click", quickSort);
