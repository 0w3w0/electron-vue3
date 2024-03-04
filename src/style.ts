import { cssinjs } from "./theme/cssinjs";

const useGlobalStyles = () => {
  return cssinjs.createStyle('ThemeTrans',() => ({
    '::view-transition-old(root),::view-transition-new(root)':{
      animation: 'none',
      mixBlendMode: 'normal',
    },
    '.dark::view-transition-old(root)':{
      zIndex: 1,
    },
    '.dark::view-transition-new(root)':{
      zIndex: 999,
    },
    '::view-transition-old(root)':{
      zIndex: 999,
    },
    '::view-transition-new(root)':{
      zIndex: 1,
    },
  }),{updated:false,scoped:false});
};

export default useGlobalStyles;