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

export function useTheme(x:number,y:number,endRadius:number,fn:(theme:string)=>void) {
  let isDark: Boolean;
  // @ts-ignore
  const transition = document.startViewTransition(() => {
    const root = document.documentElement;
    isDark = root.classList.contains('dark');
    root.classList.remove(isDark ? 'dark' : 'light');
    root.classList.add(isDark ? 'light' : 'dark');
    fn(isDark ? 'light' : 'dark');
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: isDark ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 450,
        easing: 'ease-in-out',
        pseudoElement: isDark
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    );
  });
}