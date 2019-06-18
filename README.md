<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

# chunk-url-loader

loader to get url of compiled file

## Requirements

This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.

## Getting Started

To begin, you'll need to install `chunk-url-loader`:

```console
$ yarn add -D chunk-url-loader
```

### Inlined

```js
// App.js
import Worker from 'chunk-url-loader!./script.js';
```

### Config

```js
// webpack.config.js
{
  module: {
    rules: [
      {
        test: /script\.js$/,
        use: { loader: 'chunk-url-loader' }
      }
    ]
  }
}
```

```js
// App.js
import file from './script.js';

console.log(`File: ${file}`);
```

And run `webpack` via your preferred method.

## Options

### `name`

Type: `String`
Default: `[hash].worker.js`

To set a custom name for the output script, use the `name` parameter. The name
may contain the string `[hash]`, which will be replaced with a content dependent
hash for caching purposes. When using `name` alone `[hash]` is omitted.

```js
// webpack.config.js
{
  loader: 'chunk-url-loader',
  options: { name: '[hash].js' }
}
```

### publicPath

Type: `String`
Default: `null`

Overrides the path where the output file are placed. If not specified,
the same public path used for other webpack assets is used.

```js
// webpack.config.js
{
  loader: 'chunk-url-loader'
  options: { publicPath: '/scripts/workers/' }
}
```

## Acknowledgement

This loader is based on the [worker-loader](https://github.com/webpack-contrib/worker-loader)
