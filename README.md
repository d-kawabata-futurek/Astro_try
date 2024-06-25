# Astro スターターキット: 基本

```sh
npm create astro@latest -- --template basics
```

[![StackBlitzで開く](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![CodeSandboxで開く](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![GitHub Codespacesで開く](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **経験豊富な宇宙飛行士へ** このファイルを削除して楽しんでください！

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 プロジェクト構成

あなたのAstroプロジェクト内には、次のフォルダとファイルが表示されます:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astroは、`src/pages/`ディレクトリ内の`.astro`または`.md`ファイルを探します。各ページはファイル名に基づいてルートとして公開されます。

`src/components/`には特別なものはありませんが、私たちはここにAstro/React/Vue/Svelte/Preactコンポーネントを配置するのが好きです。

画像などの静的アセットは`public/`ディレクトリに配置できます。

## 🧞 コマンド

すべてのコマンドは、プロジェクトのルートからターミナルで実行します:

| コマンド                  | アクション                                      |
| :------------------------ | :---------------------------------------------- |
| `npm install`             | 依存関係をインストール                          |
| `npm run dev`             | ローカル開発サーバーを`localhost:3000`で起動    |
| `npm run build`           | 本番サイトを`./dist/`にビルド                   |
| `npm run preview`         | デプロイ前にローカルでビルドをプレビュー        |
| `npm run stg`             | ステージング環境用にビルド                     |
| `npm run prod`            | プロダクション環境用にビルド                   |
| `npm run astro ...`       | `astro add`、`astro check`などのCLIコマンドを実行 |
| `npm run astro -- --help` | Astro CLIの使用方法を取得                        |

## 👀 詳細を知りたいですか？

[ドキュメント](https://docs.astro.build)をご覧いただくか、[Discordサーバー](https://astro.build/chat)に参加してください。


# astro.config.mjs の中身を解説

## Integrationオブジェクト

  Astro の chunkFileNames で変更すると server で使われるスクリプトも書き換えられてしまうので、ターゲットが`client`のビルド時のみ指定したディレクトリに書き換える用のフックしています。

  >```javascript
  >{
  >  name: 'vite-build-hooks',
  >  hooks: {
  >    'astro:build:setup': ({ vite, target }) => {
  >      if(target === 'client') {
  >        vite.build.rollupOptions.output.chunkFileNames = `assets/js/[name].[hash].js`;
  >      }
  >    }
  >  }
  >}
  >```
  - これはAstroのビルドプロセスにフックを追加するためのオブジェクトです。ここでは、`astro:build:setup`というビルドのセットアップ段階でフックをかけています。
  - フック名
    - `astro:build:setup`：これはAstroのビルドセットアップ段階で呼び出されるフックだ。この段階でViteの設定をカスタマイズしています。
    - `{ vite, target }`：このオブジェクトには、Viteの設定とビルドターゲット（`client`か`server`）が含まれています。
  - クライアントサイドビルド時の設定変更
    - `if(target === 'client')`：ビルドターゲットが`client`（クライアントサイド）の場合にのみ設定を適用するようにしています。
    - `vite.build.rollupOptions.output.chunkFileNames`：Rollupの出力オプションの`chunkFileNames`を変更しています。これにより、クライアントサイドのビルドで生成されるチャンクファイルの名前が`assets/js/[name].[hash].js`という形式になります。

### `vite.build.rollupOptions.output.chunkFileNames`の設定について

  デフォルトではクライアントサイドビルド時にのみ特定の設定を適用しているため、サーバーサイドのスクリプトに影響を与えないようなっています。

  > ### `Integrationオブジェクト`
  > ```javascript
  > integrations: [
  >   {
  >     name: 'vite-build-hooks',
  >     hooks: {
  >       'astro:build:setup': ({ vite, target }) => {
  >         if(target === 'client') {
  >           vite.build.rollupOptions.output.chunkFileNames = `assets/js/[name].[hash].js`;
  >         }
  >       }
  >     }
  >   }
  > ],
  > ```
  > ### `vite`オプションでの設定
  > ```javascript
  > vite: {
  >   build: {
  >     rollupOptions: {
  >       output: {
  >         chunkFileNames: (chunkInfo) => {
  >           console.log(chunkInfo);
  >           return `assets/js/[name].[hash].js`;
  >         }
  >       }
  >     }
  >   }
  > }
  > ```

  #### 使い分け

  1. **`Integrationオブジェクト`での設定**：
    - **対象限定**：クライアントサイドのビルド時にのみ設定が適用されるようにしています。
    - **フックの利用**：Astroのビルドプロセスの特定の段階（`astro:build:setup`）でのみ適用されます。

  2. **`vite`オプションでの設定**：
    - **全体適用**：ビルド全体に対して設定が適用されます。
    - **グローバル設定**：特定のフックを利用せず、Viteのビルド設定全体に対して適用されます。特にビルドターゲットごとに異なる設定を行う必要がなく、全体に同じ設定を適用しても問題ない場合に有効にしてください。

## Viteの設定
  [Viteの公式ドキュメントのビルドオプション](https://ja.vitejs.dev/config/build-options.html)

  > ```javascript
  >   vite: {
  >     build: {
  >       // minify: false, // コードを圧縮するかどうか
  >       // cssCodeSplit: true, // CSS をページ毎に分割するかどうか
  >       assetsInlineLimit: 0, // 4KB以下の時に自動的にインラインで埋め込まれてしまうのを防ぐ
  >       rollupOptions: {
  >         output: {
  >           entryFileNames: (entryInfo) => {
  >             return `assets/js/[name].[hash].js`;
  >           },
  >           // こちらで指定すると上記の問題があるのでコメントアウト
  >           // chunkFileNames: (chunkInfo) => {
  >           //   console.log(chunkInfo)
  >           //   return `assets/js/[name].[hash].js`;
  >           // },
  >           assetFileNames: (assetInfo) => {
  >             let extType = assetInfo.name.split('.').pop();
  >             let fileName = `assets/[ext]/[hash][extname]`;
  >             if (extType === 'css') {
  >               fileName = `assets/css/style.[hash][extname]`;
  >             } else if(/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
  >               fileName = `assets/images/[name][extname]`;
  >             } else if(/ttf|otf|eot|woff|woff2/i.test(extType)) {
  >               fileName = `assets/fonts/[name][extname]`;
  >             }
  >             return fileName;
  >           }
  >         }
  >       }
  >     }
  >   }
  > ```

1. **コードの圧縮（minify）**：
  > ```javascript
  > // minify: false,
  > ```
  `minify: false`を設定すると、ビルドされたコードが圧縮されなくなります。通常はデフォルトで圧縮されるが、開発中にデバッグする際は有効にしてください。

2. **CSSのコード分割（cssCodeSplit）**：
  > ```javascript
  > // cssCodeSplit: true,
  > ```
  `cssCodeSplit: true`を設定すると、CSSファイルがページごとに分割されます。これにより、必要なCSSのみが読み込まれ、パフォーマンスが向上することがあります。

3. **アセットのインライン制限（assetsInlineLimit）**：
  > ```javascript
  > assetsInlineLimit: 0,
  > ```
  これは4KB以下のアセットが自動的にインラインで埋め込まれるのを防いでいます。すべてのアセットがファイルとして出力するために値を`0`に設定しています。

4. **Rollupのオプション（rollupOptions）**：
  > ```javascript
  > rollupOptions: {
  >   output: {
  >     entryFileNames: (entryInfo) => {
  >       return `assets/js/[name].[hash].js`;
  >     },
  >     assetFileNames: (assetInfo) => {
  >       let extType = assetInfo.name.split('.').pop();
  >       let fileName = `assets/[ext]/[hash][extname]`;
  >       if (extType === 'css') {
  >         fileName = `assets/css/style.[hash][extname]`;
  >       } else if(/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
  >         fileName = `assets/images/[name][extname]`;
  >       } else if(/ttf|otf|eot|woff|woff2/i.test(extType)) {
  >         fileName = `assets/fonts/[name][extname]`;
  >       }
  >       return fileName;
  >     }
  >   }
  > }
  > ```
  - **entryFileNames**: エントリーポイントのJavaScriptファイルの名前を設定しています。`assets/js/[name].[hash].js`という形式で出力されます。
  - **assetFileNames**: 各種アセットファイル（CSS、画像、フォントなど）の名前と配置場所をカスタマイズしています。ファイルの種類に応じて各フォルダに配置されます。
  
  プロジェクトのビルド時に生成されるファイルが一元管理し、整理されたディレクトリ構造が得られます。
  ハッシュを付加することでキャッシュの問題も解決しています。


## 🤔 What you can do with templates ?

本テンプレートでブラックボックス化している機能の詳細を   
以下に随時記述していきますのでご参考ください。

#### SCSS でフォントサイズや余白のレスポンシブ対応

mixin の内容は ```/src/common/stylesheets/mixins/``` を見れば分かりますが   
SP サイトなどを作成する際は、以下のように include する事で   
デザインの ```px``` や ```weight``` を上手いことレスポンシブ対応してくれます。

```scss
$size: 26;
@include config.fontSize_vw($size);
@include config.fontWeight('Medium');
@include config.lineHeight(44, $size);
@include config.letterSpacing(80);
```

また、 ```margin``` や ```padding``` も同様で以下のように指定が可能です。   
上記と同じくデザインの ```px``` の数値を入力するだけで大丈夫です。

```scss
// 一括の場合
@include config.margin_vw(10, 20, 30, 40);
// それぞれの場合
@include config.margin_top_vw(10);
@include config.margin_right_vw(20);
@include config.margin_bottom_vw(30);
@include config.margin_left_vw(40);

// 一括の場合
@include config.padding_vw(10, 20, 30, 40);
// それぞれの場合
@include config.padding_top_vw(10);
@include config.padding_right_vw(20);
@include config.padding_bottom_vw(30);
@include config.padding_left_vw(40);
```