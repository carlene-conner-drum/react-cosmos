// @flow

import { join } from 'path';
import fs from 'fs';
import { silent as silentResolve } from 'resolve-from';
import { hasUserCustomWebpackConfig } from './webpack/user-webpack-config';

import type { Config } from 'react-cosmos-flow/config';
import type { PlaygroundOpts } from 'react-cosmos-flow/playground';

export default function getPlaygroundHtml(cosmosConfig: Config) {
  const { rootPath, publicUrl } = cosmosConfig;

  const html = fs.readFileSync(join(__dirname, 'static/index.html'), 'utf8');
  const opts: PlaygroundOpts = {
    loaderUri: join(publicUrl, '_loader.html'),
    projectKey: rootPath,
    webpackConfigType: hasUserCustomWebpackConfig(cosmosConfig)
      ? 'custom'
      : 'default',
    deps: getDeps(cosmosConfig)
  };

  return html.replace('__PLAYGROUND_OPTS__', JSON.stringify(opts));
}

function getDeps({ rootPath }: Config) {
  // We use knowledge of installed dependencies, collected on the server side,
  // to guide user onboarding in the Cosmos UI
  return {
    'html-webpack-plugin': hasDep(rootPath, 'html-webpack-plugin')
  };
}

function hasDep(rootPath: string, depName: string): boolean {
  return Boolean(silentResolve(rootPath, depName));
}
