const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const electron = require('electron');

global.appRoot = path.resolve(__dirname);
global.fs = fs;
global.electron = electron;

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Load the index.html file of the React app.
  mainWindow.loadFile('build/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})