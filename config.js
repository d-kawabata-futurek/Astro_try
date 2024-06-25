import config from './src/config.json';

// 環境変数に基づいてURLを取得するヘルパー関数
const getUrl = (type) => {
  const env = process.env.NODE_ENV === 'production' ? 'PROD'
            : process.env.NODE_ENV === 'staging' ? 'STG'
            : 'DEV';
  return config[type][env] || config[type].DEV;
};

export const SITE_URL = getUrl('SITE_URL');
export const ASSETS_URL = config.ASSETS_URL.STATUS ? getUrl('ASSETS_URL') : getUrl('SITE_URL');