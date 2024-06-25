import { defineConfig } from 'astro/config';
import { SITE_URL, ASSETS_URL } from './config.js';

/**
 * @type {import('astro').AstroUserConfig}
 * @example
 * https://docs.astro.build/ja/reference/configuration-reference/
 * https://docs.astro.build/ja/guides/configuring-astro/
 */

export default defineConfig({
  site: SITE_URL, // 最終的にデプロイされるURL
  compressHTML: process.env.NODE_ENV === 'development' ? false : true, // htmlを圧縮するか否か デフォルトでは開発モードのみ圧縮を解除しています。
  trailingSlash: 'always',// 開発時に末尾のスラッシュを必須にする
  integrations: [
    {
      name: 'vite-build-hooks',
      hooks: {
        'astro:build:setup': ({ vite, target }) => {
          if(target === 'client') {
            vite.build.rollupOptions.output.chunkFileNames = `assets/js/[name].[hash].js`;
          }
        }
      }
    }
  ],
  build: {
    assets: ASSETS_URL, // アセット（画像、CSS、JavaScriptファイルなど）がビルドされた後に配置されるディレクトリの設定
    inlineStylesheets: 'never' // スタイルシートをインライン化するかどうか
  },
  server: (e) => ({
    port: e.command === 'dev' ? 3000 : 4321,
    host: true, // ローカルネットワーク上の他のデバイスからもアクセス可能にしています。
    open: true  // サーバー起動時に自動的にブラウザを開くかどうかの設定
  }),
  vite: {
    // https://ja.vitejs.dev/config/build-options.html
    build: {
      // minify: false, // コードを圧縮するかどうか
      // cssCodeSplit: true, // CSS をページ毎に分割するかどうか
      assetsInlineLimit: 0, // 4KB以下の時に自動的にインラインで埋め込まれてしまうのを防ぐ
      rollupOptions: {
        output: {
          entryFileNames: (entryInfo) => {
            return `assets/js/[name].[hash].js`;
          },
          // こちらで指定すると上記の問題があるのでコメントアウト
          // chunkFileNames: (chunkInfo) => {
          //   console.log(chunkInfo)
          //   return `assets/js/[name].[hash].js`;
          // },
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split('.').pop();
            let fileName = `assets/[ext]/[hash][extname]`;
            if (extType === 'css') {
              fileName = `assets/css/style.[hash][extname]`;
            } else if(/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              fileName = `assets/images/[name][extname]`;
            } else if(/ttf|otf|eot|woff|woff2/i.test(extType)) {
              fileName = `assets/fonts/[name][extname]`;
            }
            return fileName;
          }
        }
      }
    }
  }
});
