import config from '../config.json';

export interface Props {
  FILE_PATH: string;
  ABSOLUTE_DIR: boolean;
  RELATIVE_PATH: string;
  SPECIFIED_PATH: string;
  CACHE_VERSION: string;
}

export const getRenderProps = (Astro: any): Props => {
  const FILE_PATH = new URL(Astro.url.toString(), Astro.url.origin).pathname.replace('/', '');
  const RELATIVE_PATH = '../'.repeat(FILE_PATH.split('/').length - 1);
  const SPECIFIED_PATH = config.ABSOLUTE_DIR ? '/' : RELATIVE_PATH;
  const CACHE_VERSION = config.CACHE_VERSION ? `?v=${config.CACHE_VERSION}` : '';

  return {
    FILE_PATH,
    ABSOLUTE_DIR: config.ABSOLUTE_DIR,
    RELATIVE_PATH,
    SPECIFIED_PATH,
    CACHE_VERSION,
  };
};