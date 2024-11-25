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
    resizable: false, 
    center: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    menuBarVisible: false,
  });

  // Prevent the menu from being displayed even with Alt key
  win.setMenuBarVisibility(false);

  // Remove the menu completely in production
  if (app.isPackaged) {
    win.removeMenu();
  }

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
