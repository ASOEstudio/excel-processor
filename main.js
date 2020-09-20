const { app, BrowserWindow } = require('electron')
const url = require('url');
const path = require('path');

let appWindow

function initWindow() {
  appWindow = new BrowserWindow({
    show: false,
    backgroundColor: '#303030',
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // atrasa apresentação da tela até que esteja carregada
  // appWindow.once('ready-to-show', () => { appWindow.show() });
  appWindow.webContents.on('did-finish-load', () => { appWindow.show() });

  // Remove default menuBar
  appWindow.setMenu(null);

  // Electron Build Path
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '/dist/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // Initialize the DevTools.
  // appWindow.webContents.openDevTools()

  appWindow.on('closed', function () {
    appWindow = null
  });
}

app.on('ready', initWindow);

// Close when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (win === null) {
    initWindow()
  }
});
