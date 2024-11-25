const {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
} = require("chart.js");

// Register the components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip
);

var HID = require("node-hid");

const ctx = document.getElementById("joystickChart").getContext("2d");
const maxPoints = 100;

// Circular buffer
function createCircularBuffer(size) {
  const buffer = new Array(size).fill(0);
  let index = 0;
  return {
    add(value) {
      buffer[index] = value;
      index = (index + 1) % size;
    },
    getArray() {
      return buffer.slice(index).concat(buffer.slice(0, index));
    },
  };
}

const azimuthBuffer = createCircularBuffer(maxPoints);
const elevationBuffer = createCircularBuffer(maxPoints);

// Initialize Chart.js
const joystickChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: Array.from({ length: maxPoints }, (_, i) => i),
    datasets: [
      {
        label: "Azimuth",
        data: azimuthBuffer.getArray(),
        borderColor: "#FFE39F",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: "Elevation",
        data: elevationBuffer.getArray(),
        borderColor: "#B0CDFF",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      tooltip: false,
      legend: true,
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
      y: {
        beginAtZero: true,
        max: 70000,
      },
    },
  },
});

// Add after your existing imports
const joystickCanvas = document.getElementById("joystickVisual");
const joystickCtx = joystickCanvas.getContext("2d");

// Function to draw the joystick visualization
function drawJoystickPosition(azimuth, elevation) {
    // Clear the canvas
    joystickCtx.clearRect(0, 0, joystickCanvas.width, joystickCanvas.height);
    
    const centerX = joystickCanvas.width / 2;
    const centerY = joystickCanvas.height / 2;
    const maxRadius = (joystickCanvas.width / 2) - 10;

    // Draw outer circle (boundary)
    joystickCtx.beginPath();
    joystickCtx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    joystickCtx.strokeStyle = '#666';
    joystickCtx.lineWidth = 2;
    joystickCtx.stroke();

    // Draw center crosshair
    joystickCtx.beginPath();
    joystickCtx.moveTo(centerX - 10, centerY);
    joystickCtx.lineTo(centerX + 10, centerY);
    joystickCtx.moveTo(centerX, centerY - 10);
    joystickCtx.lineTo(centerX, centerY + 10);
    joystickCtx.strokeStyle = '#666';
    joystickCtx.lineWidth = 1;
    joystickCtx.stroke();

    // Calculate joystick position
    // Normalize values from 0-70000 to -1 to 1
    const normalizedX = ((azimuth / 70000) * 2) - 1;
    const normalizedY = ((elevation / 70000) * 2) - 1;

    // Calculate position within the circle
    const posX = centerX + (normalizedX * maxRadius);
    const posY = centerY + (normalizedY * maxRadius);

    // Draw joystick position
    joystickCtx.beginPath();
    joystickCtx.arc(posX, posY, 8, 0, Math.PI * 2);
    joystickCtx.fillStyle = '#2196F3';
    joystickCtx.fill();
    joystickCtx.strokeStyle = '#1976D2';
    joystickCtx.lineWidth = 2;
    joystickCtx.stroke();

    // Draw line from center to joystick position
    joystickCtx.beginPath();
    joystickCtx.moveTo(centerX, centerY);
    joystickCtx.lineTo(posX, posY);
    joystickCtx.strokeStyle = '#2196F3';
    joystickCtx.lineWidth = 1;
    joystickCtx.stroke();
}

// Modify your existing updateChart function
function updateChart(azimuth, elevation) {
    azimuthBuffer.add(azimuth);
    elevationBuffer.add(elevation);

    joystickChart.data.datasets[0].data = azimuthBuffer.getArray();
    joystickChart.data.datasets[1].data = elevationBuffer.getArray();

    joystickChart.update();
    
    // Add this line to update the joystick visualization
    drawJoystickPosition(azimuth, elevation);
}

let currentDevice = null;
let currentlySelectedDevice = null;
let lastDataReceived = 0;

// Update status displays
function updateStatus(type, message, className = '') {
    switch(type) {
        case 'connection':
            const connStatus = document.getElementById('connectionStatus');
            connStatus.textContent = message;
            connStatus.className = 'status-value ' + className;
            break;
        case 'device':
            document.getElementById('deviceInfo').textContent = message;
            break;
        case 'data':
            const dataStatus = document.getElementById('dataStatus');
            dataStatus.textContent = message;
            dataStatus.className = 'status-value ' + className;
            break;
        case 'memory':
            const memoryStatus = document.getElementById('memoryStatus');
            memoryStatus.textContent = message;
            memoryStatus.className = 'status-value ' + className;
            break;
    }
}

function initJoystickVisual() {
  const centerX = joystickCanvas.width / 2;
  const centerY = joystickCanvas.height / 2;
  const maxRadius = (joystickCanvas.width / 2) - 10;

  // Clear the canvas
  joystickCtx.clearRect(0, 0, joystickCanvas.width, joystickCanvas.height);
  
  // Draw outer circle (boundary)
  joystickCtx.beginPath();
  joystickCtx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
  joystickCtx.strokeStyle = '#666';
  joystickCtx.lineWidth = 2;
  joystickCtx.stroke();

  // Draw center crosshair
  joystickCtx.beginPath();
  joystickCtx.moveTo(centerX - 10, centerY);
  joystickCtx.lineTo(centerX + 10, centerY);
  joystickCtx.moveTo(centerX, centerY - 10);
  joystickCtx.lineTo(centerX, centerY + 10);
  joystickCtx.strokeStyle = '#666';
  joystickCtx.lineWidth = 1;
  joystickCtx.stroke();

  // Draw initial position
  joystickCtx.beginPath();
  joystickCtx.arc(centerX, centerY, 8, 0, Math.PI * 2);
  joystickCtx.fillStyle = '#2196F3';
  joystickCtx.fill();
  joystickCtx.strokeStyle = '#1976D2';
  joystickCtx.lineWidth = 2;
  joystickCtx.stroke();
}

initJoystickVisual();

// Function to list all HID devices
function listDevices() {
  return HID.devices();
}

// Populate the select box with available devices
function populateDeviceSelect() {
    const devices = listDevices();
    const selectBox = document.getElementById("deviceSelect");
    
    // Clear existing options
    selectBox.innerHTML = '<option value="">Select a device</option>';

    devices.forEach((device, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.text = `${device.product} (VID: ${device.vendorId}, PID: ${device.productId})`;
        
        // Check if this device matches our currently connected device
        if (currentlySelectedDevice && 
            device.vendorId === currentlySelectedDevice.vendorId && 
            device.productId === currentlySelectedDevice.productId) {
            option.selected = true;
        }
        
        selectBox.add(option);
    });
}

// Disconnect the current device
function disconnectCurrentDevice() {
  if (currentDevice) {
      currentDevice.close();
      currentDevice = null;
      currentlySelectedDevice = null;
      updateStatus('connection', 'Disconnected', 'disconnected');
      updateStatus('device', 'None');
      updateStatus('data', 'No data', 'disconnected');
      initJoystickVisual(); // Reset joystick visualization
  }
}
// Connect to HID device
const connect = async (vid, pid) => {
    try {
        disconnectCurrentDevice();

        currentDevice = new HID.HID(vid, pid);
        currentlySelectedDevice = { vendorId: vid, productId: pid };
        
        updateStatus('connection', 'Connected', 'connected');
        updateStatus('device', `VID: ${vid}, PID: ${pid}`);
        updateStatus('data', 'Waiting for data...', 'disconnected');

        let lastUpdateTime = 0;
        const updateInterval = 20;

        currentDevice.on("data", (data) => {
            const now = Date.now();
            lastDataReceived = now;
            
            if (now - lastUpdateTime >= updateInterval) {
                try {
                    const azimuth = (data[5] << 8) + data[4];
                    const elevation = (data[7] << 8) + data[6];
                    updateChart(azimuth, elevation);
                    updateStatus('data', 'Receiving data', 'receiving');
                    lastUpdateTime = now;
                } catch (err) {
                    console.error("Error processing HID data:", err);
                    updateStatus('data', 'Error processing data', 'disconnected');
                }
            }
        });

        currentDevice.on("error", (err) => {
            console.error("HID device error:", err);
            updateStatus('connection', 'Error: Device disconnected', 'disconnected');
            updateStatus('data', 'No data', 'disconnected');
            currentlySelectedDevice = null;
            disconnectCurrentDevice();
        });

    } catch (err) {
        console.error("Failed to connect to HID device:", err);
        updateStatus('connection', 'Connection failed', 'disconnected');
        updateStatus('data', 'No data', 'disconnected');
        currentlySelectedDevice = null;
    }
};

// Handle device selection
document.getElementById("deviceSelect").addEventListener("change", (event) => {
    const selectedIndex = event.target.value;
    if (selectedIndex === "") {
        disconnectCurrentDevice();
        return;
    }

    const devices = listDevices();
    const selectedDevice = devices[selectedIndex];

    if (selectedDevice) {
        connect(selectedDevice.vendorId, selectedDevice.productId);
    } else {
        currentlySelectedDevice = null;
        disconnectCurrentDevice();
    }
});

// Initial setup
populateDeviceSelect();
updateStatus('connection', 'Disconnected', 'disconnected');
updateStatus('device', 'None');
updateStatus('data', 'No data', 'disconnected');

// Check data status periodically
setInterval(() => {
    if (currentDevice && Date.now() - lastDataReceived > 1000) {
        updateStatus('data', 'No recent data', 'disconnected');
    }
}, 1000);

// Monitor memory usage
setInterval(() => {
    const memory = process.memoryUsage();
    const memoryInMB = (memory.rss / 1024 / 1024).toFixed(1);
    updateStatus('memory', `${memoryInMB} MB`, 
        memoryInMB < 100 ? 'connected' : 
        memoryInMB < 200 ? 'receiving' : 'disconnected'
    );
    console.log(`Memory usage: RSS=${memoryInMB} MB`);
}, 5000);
