import { useToken } from "@renderer/theme";
import { createStyle } from "cinjs";

export const useMainStyle = () => {
  const token = useToken();
  return createStyle(() => ({
    '.home':{
      display: 'flex',
      height: '100vh',
      '-webkit-app-region': 'drag',
      backgroundColor: token.value.background,
      alignItems: 'flex-start',
    }
  }),{update:true});
}