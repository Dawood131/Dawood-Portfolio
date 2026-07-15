export const GA_MEASUREMENT_ID = 'G-DES0XCTMMY';

export const trackPageView = (path) => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, { page_path: path });
  }
};