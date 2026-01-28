export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready?: () => void;
        expand?: () => void;
        initDataUnsafe?: any;
        // add other WebApp members you use here
      };
    };
  }
}
