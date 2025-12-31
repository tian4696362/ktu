import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// 存储所有窗口的数组
const windows: BrowserWindow[] = []

function createWindow(): void {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 开发环境下打开开发者工具
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 将窗口添加到数组中
  windows.push(mainWindow)

  // 窗口关闭时从数组中移除
  mainWindow.on('closed', () => {
    const index = windows.indexOf(mainWindow)
    if (index !== -1) {
      windows.splice(index, 1)
    }
  })
}

// 创建新窗口的函数
function createNewWindow(): void {
  createWindow()
}

// IPC 通道用于从渲染进程创建新窗口
ipcMain.on('create-new-window', () => {
  createNewWindow()
})

// IPC 通道用于获取窗口数量
ipcMain.handle('get-window-count', () => {
  return windows.length
})

// IPC 通道用于关闭所有窗口
ipcMain.on('close-all-windows', () => {
  windows.forEach(window => {
    window.close()
  })
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occur.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // 创建初始窗口
  createWindow()

  // 注册快捷键来创建新窗口 (Ctrl+N)
  app.on('web-contents-created', (_, contents) => {
    contents.on('before-input-event', (event, input) => {
      if (input.key === 'n' && input.control && !input.alt && !input.meta) {
        event.preventDefault()
        createNewWindow()
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 在这个文件中，您可以包含应用程序的特定主进程代码
// 您也可以将它们放在单独的文件中并在此处引用