/**
 * @file application.js
 * @module application
 * @description This is the main init for the application. Well actually it's the background.js,
 * but I've had a really tough time trying to move that file into this folder structure. (See the Dev_Journal for all the details & links)
 * Details can also be found at this link:
 * {@link https://stackoverflow.com/questions/62722398/simulatedgreg-electron-vue-vuetify-error-message-vue-warn-unknown-custom-ele}
 * Ultimately I decided to leave the background.js & main.js in-place and just turn them into wrapper/call-forwarder.
 * So all of the functionality in those files is now done via a call to this file.
 * The file contains all of the application event processing.
 * Of course most of the work will be handed off to the Framework.
 * @requires module:warden
 * @requires {@link https://www.npmjs.com/package/electron|electron}
 * @requires {@link https://www.npmjs.com/package/vue-cli-plugin-electron-builder|vue-cli-plugin-electron-builder}
 * @requires {@link https://www.npmjs.com/package/electron-devtools-installer|electron-devtools-installer}
 * @requires {@link https://www.npmjs.com/package/path|path}
 * @author Seth Hollingsead
 * @date 2020/07/16
 * @copyright Copyright © 2020-… by Seth Hollingsead. All rights reserved
 */
'use strict'

import warden from '../../Framework/Controllers/warden';
import * as c from './Constants/application.constants';
import { app, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
var path = require('path');
const isDevelopment = process.env.NODE_ENV !== 'production'
global.appRoot = path.resolve(__dirname);
var rootPath = '';
var baseFileName = 'application';

/**
 * @function createMainApplicationWindow
 * @description Does the creation of the main application window.
 * @param {object} mainWindow The instance of the main window. We take this as input and return it after it's set,
 * because in some cases we need to keep a reference to the window object other the whole application will
 * shut down because of garbage collection.
 * @return {object} An instance of the window object after it has been created and set.
 * @author System Generated
 * @date 2020/07/15
 */
function createMainApplicationWindow(mainWindow) {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) {
      mainWindow.webContents.openDevTools();
    }
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  return mainWindow;
};

/**
 * @function quitApplication
 * @description Quits the application.
 * @return {void}
 * @author System Generated
 * @date 2020/07/15
 */
function quitApplication() {
  // Quit when all windows are closed.
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
};

/**
 * @function activateApplication
 * @description Activates the application, as part of the startup process.
 * @param {object} mainWindow An instance of the main window so that we can pass it along to have the main application window created.
 * @return {object} An instance of the main application window, so the background.js (caller)
 * can have a chance to keep a reference of this object,
 * and there will be no chance of it getting picked up by garbage collection.
 * @author System Generated
 * @date 2020/07/15
 */
function activateApplication(mainWindow) {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    mainWindow = createMainApplicationWindow(mainWindow);
  }
  return mainWindow;
};

/**
 * @function applicationReady
 * @description Called with the application is ready event is fired,
 * and calls the createMainApplicationWindow as part of the startup process.
 * @param {object} mainWindow An instance of the main window so that we can pass it along to have the main application window created.
 * @return {object} An instance of the main application window, so the background.js (caller)
 * can have a chance to keep a reference of this object,
 * and there will be no chance of it getting picked up by garbage collection.
 * @author System Generated
 * @date 2020/07/15
 */
async function applicationReady(mainWindow) {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  rootPath = global.appRoot;
  rootPath = warden.processRootPath(rootPath);
  warden.bootStrapApplication(rootPath + c.cConfigurationDataLookupPrefixPath);
  warden.saveRootPath(rootPath);
  return createMainApplicationWindow(mainWindow);
};

export default {
  createMainApplicationWindow,
  quitApplication,
  activateApplication,
  applicationReady
};
