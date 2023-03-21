export {};

declare global {
  interface Window {
    booking: any;
    __SSR_MODULE_DATA__: any;
    IBU_HOTEL: any;
    initParams: any;
  }
}