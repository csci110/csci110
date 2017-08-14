# Welcome to CSCI 110!

To customize this Cloud9 workspace, you should install the csci110 plugin. Follow these steps.
1. Highlight and copy this JavaScript code:
```javascript
if (services.c9.workspaceId.match("csci110")) {
    services.pluginManager.loadPackage([
       "~/.c9/plugins/csci110/package.json"
    ]);
}
```
2. Click the `Cloud9` menu in the upper left portion of the screen, and choose `Open Your Init Script`.
3. Paste the JavaScript code at the bottom of the `init.js` file that appears. Save and close this file.
4. Force your browser to reload Cloud9, using the `F5` key, or the appropriate button or menu option.


You should be good to go, but notice that the plugin will only work for Cloud9 workspaces with the name "csci110".

