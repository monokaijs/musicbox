const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const electronIsDev = require("electron-is-dev");

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  if (!electronIsDev) {
    mainWindow.loadFile('index.html').then(() => null);
  } else {
    mainWindow.loadURL('http://localhost:3000').then(() => null);
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})
