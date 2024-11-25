const { app, BrowserWindow, screen } = require("electron");

function createWindow() {
  // Get the primary display's workArea
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Calculate optimal window size (80% of screen size)
  const windowWidth = Math.min(1300, Math.floor(width * 0.9));
  const windowHeight = Math.min(800, Math.floor(height * 0.8));

  const win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    resizable: false,    // Disable window resizing
    center: true,        // Center the window on the screen
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    // Optional: remove the default menu bar
    // autoHideMenuBar: true,
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
