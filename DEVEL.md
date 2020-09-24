# Recreate project structure

## Setup basic Node + TypeScript + Webpack + ESLint project

### Install packages
```sh
npm init -y
npm install webpack webpack-cli webpack-dev-server --save-dev
```

##### For MacOS

If error
```sh
gyp: No Xcode or CLT version detected!
```

occurs see https://github.com/nodejs/node-gyp/blob/master/macOS_Catalina.md

### Install TypeScript

```sh
npm install typescript ts-loader --save-dev
```

### Setup TypeScript

* Run
```sh
npx tsc --init
```

* Be sure to include options in tsconfig.json:

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "noImplicitAny": true,
    "target": "es5",
    "checkJs": false,
    "allowJs": true
  }
}
```

* Create webpack.config.js (see https://webpack.js.org/guides/typescript/)

* Be sure to configure source maps https://webpack.js.org/guides/typescript/#source-maps

## Setup Webpack Dev Server

* Configure webpack-dev-server. See
    * https://github.com/webpack/webpack-dev-server for installation
    * https://webpack.js.org/configuration/dev-server/ for configuration in webpack.config.js

  * Set contentBase https://webpack.js.org/configuration/dev-server/#devservercontentbase
  * Set publicPath https://webpack.js.org/configuration/dev-server/#devserverpublicpath-

### Install ESLint

 * npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
 * See https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md for configuration instruction
 * Set additional rules, like
    ```json
    rules: {
      "semi": ["error", "always"]
    },
    ```

### Start development

* Create index.html

```html
<html>
    <head>
        <title>Hello World</title>
        <script src="dist/bundle.js"></script>
    </head>
    <body>
        <canvas id="canvas" width="800" height="600">
        </canvas>
    </body>
</html>
```

* Create first src/index.ts file
```typescript
window.onload = (): void => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error('WebGL2 is not available');
        return;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
};
```
