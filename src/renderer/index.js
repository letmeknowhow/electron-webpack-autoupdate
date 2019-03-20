// Initial welcome page. Delete the following line to remove it.
"use strict";
import { ipcRenderer } from "electron";
const styles = document.createElement("style");
styles.innerText = `@import url(https://unpkg.com/spectre.css/dist/spectre.min.css);.empty{display:flex;flex-direction:column;justify-content:center;height:100vh;position:relative}.footer{bottom:0;font-size:13px;left:50%;opacity:.9;position:absolute;transform:translateX(-50%);width:100%}`;
const vueScript = document.createElement("script");
vueScript.setAttribute("type", "text/javascript"),
  vueScript.setAttribute("src", "https://unpkg.com/vue"),
  (vueScript.onload = init),
  document.head.appendChild(vueScript),
  document.head.appendChild(styles);
function init() {
  (Vue.config.devtools = false),
    (Vue.config.productionTip = false),
    new Vue({
      data: {
        versions: {
          electron: process.versions.electron,
          electronWebpack: require("electron-webpack/package.json").version,
          app: require("../../package.json").version
        },
        msg: ["update message"]
      },
      methods: {
        checkForUpdate(b) {
          ipcRenderer.send("checkForUpdate");
          //   require("electron").shell.openExternal(b);
        }
      },
      created: function() {
        ipcRenderer.on("message", (event, text) => {
          // console.log(arguments);
          console.log(text);
          this.msg.push(text);
          this.tips = text;
        });

        ipcRenderer.on("downloadProgress", (event, progressObj) => {
          console.log(progressObj);
          this.downloadPercent = progressObj.percent || 0;
        });
        ipcRenderer.on("isUpdateNow", () => {
          ipcRenderer.send("isUpdateNow");
        });
      },
      template: `<div>
      <div class=empty>
      <p class="empty-title h5">Welcome to your new project!<p class=empty-subtitle>Get qwdqwd now and take advantage of the great documentation at hand.
      <div class=empty-action>
      <button @click="checkForUpdate()"class="btn btn-primary">Click for checking update</button><br>
      <ul class=breadcrumb>
      <li class=breadcrumb-item>electron-webpack v{{ versions.electronWebpack }}</li>
      <li class=breadcrumb-item>electron v{{ versions.electron }}</li>
      <li class=breadcrumb-item>app v{{ versions.app }}</li>
      </ul>
      </div>
      <p>{{ msg }}</p>
      <p class=footer>This intitial landing page can be easily removed from <code>src/renderer/index.js</code>.</p>
      </div>
      </div>
      `
    }).$mount("#app");
}
