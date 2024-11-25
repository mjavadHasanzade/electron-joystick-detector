# Electron-joystick-detector

A real-time data visualization tool built with Electron and Chart.js for monitoring joystick input data through HID (Human Interface Device) connections. This application provides a graphical interface to display and analyze joystick movements in real-time.

## Keywords

`electron` `nodejs` `hid` `joystick` `chart.js` `data-visualization` `usb-hid` `gamepad` `controller` `device-monitoring` `cross-platform` `desktop-app` `javascript` `node-hid` `visualization` `hardware-interface` `electron-app`


## Features

- 📊 Real-time line chart visualization of joystick movements
- 🎮 Visual joystick position indicator
- 🔌 Auto-detection of HID devices
- 📡 Live status monitoring (connection, device, data, memory)
- 🔄 Circular buffer implementation for smooth data display
- 📉 Performance optimized for continuous data streaming

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Windows or Linux operating system

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mjavadHasanzade/electron-joystick-detector.git
   cd electron-joystick-detector
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development
To run the application in development mode:
```bash
npm run dev
```

### Building Executables

For Windows:
```bash
npm run windows
```

For Linux:
```bash
npm run linux
```

## Application Features

### Real-time Visualization
- Line chart showing azimuth and elevation data
- Visual joystick position indicator
- 100-point circular buffer for smooth data display
- 20ms update interval for optimal performance

### Status Monitoring
- Connection status (Connected/Disconnected)
- Device information (VID/PID)
- Data status (Receiving/No data)
- Memory usage monitoring

### Device Management
- Automatic HID device detection
- Device selection dropdown
- Error handling for device disconnection
- Automatic data stream management

## Technical Details

### Dependencies
Main Dependencies:
- chart.js: ^4.4.6 (Data visualization)
- node-hid: ^3.1.2 (HID device communication)

Dev Dependencies:
- electron: ^33.2.0 (Application framework)
- electron-packager: ^17.1.2 (Build tool)
- @electron/fuses: ^1.8.0 (Electron utilities)

### Data Processing
- Circular buffer implementation for efficient data storage
- Real-time data normalization
- Throttled updates for performance optimization
- Memory usage monitoring and status display

## Troubleshooting

### No Devices Shown
- Ensure your joystick is properly connected
- Check if your device is recognized by your operating system
- Verify you have the necessary permissions to access HID devices

### Data Not Updating
- Check the connection status indicator
- Verify the device is sending data
- Monitor the data status indicator
- Check the memory usage status

### Performance Issues
- Monitor memory usage indicator
- Ensure system meets minimum requirements
- Close unnecessary background applications

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository. 