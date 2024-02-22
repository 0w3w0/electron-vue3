import { createStyle } from "@libs/jss";
import { useToken } from "@renderer/theme";
import { FullToken } from "@renderer/theme/interface";

const genHomeStyle = (token:FullToken) => {
  return {
    '.home': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: token.primary,
    },
  };
};

export const getHomeStyle = () => {
  const token = useToken();
  return createStyle('home', () => genHomeStyle(token.value));
};
