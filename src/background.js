'use strict'

import {
	app,
	protocol,
	BrowserWindow,
	ipcMain,
	shell
} from 'electron'
import {
	createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {
	VUEJS3_DEVTOOLS
} from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// 本地存储
const Store = require('electron-store')
Store.initRenderer()

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
	scheme: 'app',
	privileges: {
		secure: true,
		standard: true
	}
}])

// const winURL = 'http://localhost:8080/'
const winURL = process.env.NODE_ENV === 'development' ?
	`http://localhost:8080` :
	`file://${__dirname}/index.html`

const show = process.env.NODE_ENV === 'development' ?
	true : false

async function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		// fullscreen: true, // 默认全屏
		webPreferences: {

			// Use pluginOptions.nodeIntegration, leave this alone
			// See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
			nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
		}
	})

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
		if (!process.env.IS_TEST) win.webContents.openDevTools()
	} else {
		createProtocol('app')
		// Load the index.html when not in development
		win.loadURL('app://./index.html')
	}

	// menu配置
	if (!show) {
		win.setMenu(null)
	}

	win.maximize()
	
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		try {
			await installExtension(VUEJS3_DEVTOOLS)
		} catch (e) {
			console.error('Vue Devtools failed to install:', e.toString())
		}
	}
	createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit()
			}
		})
	} else {
		process.on('SIGTERM', () => {
			app.quit()
		})
	}
}

ipcMain.on("base", (event, arg) => {
	let baseWindow;
	baseWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
		}
	})
	baseWindow.loadURL(winURL + '#/home')
	baseWindow.on("closed", () => {
		baseWindow = null
	})
	// 开发模式下显示菜单 & 正常模式下不显示菜单
	if (!show) {
		baseWindow.setMenu(null)
	}

	baseWindow.maximize()

})

ipcMain.on("config", (event, arg) => {
	let configWindow;
	configWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			enableRemoteModule: true,
			nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
		}
	})
	configWindow.loadURL(winURL + '#/config')
	configWindow.on("closed", () => {
		configWindow = null
	})
	// 开发模式下显示菜单 & 正常模式下不显示菜单
	if (!show) {
		configWindow.setMenu(null)
	}

	configWindow.maximize()

})


ipcMain.on("splite", (event, arg) => {
	let spliteWindow;
	spliteWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			enableRemoteModule: true,
			nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
		}
	})
	spliteWindow.loadURL(winURL + '#/splite')
	spliteWindow.on("closed", () => {
		spliteWindow = null
	})
	// 开发模式下显示菜单 & 正常模式下不显示菜单
	if (!show) {
		spliteWindow.setMenu(null)
	}

	spliteWindow.maximize()

})

// 默认浏览器打开链接
ipcMain.on('open-url', (event, url) => {
	shell.openExternal(url);
})