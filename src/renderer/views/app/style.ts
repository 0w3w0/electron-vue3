import { createStyle } from "cinjs";

export const useMainStyle = () => {
  return createStyle(() => ({
    '.home':{
      display: 'flex',
      height: '100vh',
      '-webkit-app-region': 'drag',
      backgroundColor: '#f0f0f0',
    }
  }));
}