const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  win.loadURL("http://localhost:5173");
}

ipcMain.handle("run-cli", async (_, args) => {
  return new Promise((resolve, reject) => {
    const cli = spawn("python", ["../index.py", ...args]);

    let output = "";
    let error = "";

    cli.stdout.on("data", (data) => {
      output += data.toString();
    });

    cli.stderr.on("data", (data) => {
      error += data.toString();
    });

    cli.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(error);
    });
  });
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
