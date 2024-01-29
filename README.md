This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


First, run the development server:

```bash
npm install -g yarn
yarn dev
```

#list of plugins in vscode that must be installed

<img width="383" alt="image" src="https://github.com/dbtpl/CRS/assets/8503526/dec5a191-2bd0-45f4-9f28-722589bd5978">

# user settings in VSCODE to effect auto format

Command + Shift + P and search for user settings
<img width="728" alt="image" src="https://github.com/dbtpl/CRS/assets/8503526/44362e7c-edc3-4890-a79d-6454442a1542">

Settings

```
{
  "workbench.colorTheme": "One Dark Pro",
  "editor.minimap.enabled": false,
  "editor.inlineSuggest.enabled": true,
  "git.autofetch": true,
  "files.autoSave": "onFocusChange",
  "explorer.confirmDelete": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "liveServer.settings.donotShowInfoMsg": true,
  "workbench.startupEditor": "none",
  "editor.formatOnSave": true,
  "explorer.autoReveal": false,
  "window.zoomLevel": 1,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
