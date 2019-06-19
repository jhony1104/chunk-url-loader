/* eslint-disable
  import/first,
  import/order,
  comma-dangle,
  linebreak-style,
  no-param-reassign,
  no-underscore-dangle,
  prefer-destructuring
*/
import schema from './options.json';
import loaderUtils from 'loader-utils';
import validateOptions from '@webpack-contrib/schema-utils';

import NodeTargetPlugin from 'webpack/lib/node/NodeTargetPlugin';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import WebWorkerTemplatePlugin from 'webpack/lib/webworker/WebWorkerTemplatePlugin';

import WorkerLoaderError from './Error';

export default function loader() { }

export function pitch(request) {
  const options = loaderUtils.getOptions(this) || {};

  validateOptions({ name: 'Worker Loader', schema, target: options });

  if (!this.webpack) {
    throw new WorkerLoaderError({
      name: 'Worker Loader',
      message: 'This loader is only usable with webpack',
    });
  }

  this.cacheable(false);

  const cb = this.async();

  const filename = loaderUtils.interpolateName(
    this,
    options.name || '[hash].js',
    {
      context: options.context || this.rootContext || this.options.context,
      regExp: options.regExp,
    }
  );

  const chunk = {};

  chunk.options = {
    filename,
    chunkFilename: `[id].${filename}`,
    namedChunkFilename: null,
  };

  chunk.compiler = this._compilation.createChildCompiler(
    'entry',
    chunk.options
  );

  // // Tapable.apply is deprecated in tapable@1.0.0-x.
  // // The plugins should now call apply themselves.
  // new WebWorkerTemplatePlugin(chunk.options).apply(chunk.compiler);

  if (this.target !== 'webworker' && this.target !== 'web') {
    new NodeTargetPlugin().apply(chunk.compiler);
  }

  new SingleEntryPlugin(this.context, `!!${request}`, 'main').apply(
    chunk.compiler
  );

  const subCache = `subcache ${__dirname} ${request}`;

  chunk.compilation = (compilation) => {
    if (compilation.cache) {
      if (!compilation.cache[subCache]) {
        compilation.cache[subCache] = {};
      }

      compilation.cache = compilation.cache[subCache];
    }
  };

  if (chunk.compiler.hooks) {
    const plugin = { name: 'ChuckFileLoader' };

    chunk.compiler.hooks.compilation.tap(plugin, chunk.compilation);
  } else {
    chunk.compiler.plugin('compilation', chunk.compilation);
  }

  chunk.compiler.runAsChild((err, entries, compilation) => {
    if (err) return cb(err);

    if (entries[0]) {
      chunk.file = entries[0].files[0];

      return cb(null, `module.exports = ${options.publicPath ? JSON.stringify(options.publicPath) : '__webpack_public_path__'} + ${JSON.stringify(chunk.file)};`);
    }

    return cb(null, null);
  });
}
