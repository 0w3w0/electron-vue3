import { cssinjs } from '@/theme';

export const useButtonStyles = () => {
  const size = '48px';
  return cssinjs.createStyle('Button', ({ update }) => {
    update(false);
    return {
      button: {
        display: 'inline-block',
        padding: '0 15px',
        height: size,
        width: size,
        lineHeight: size,
        fontSize: '14px',
        fontWeight: 500,
        borderRadius: '50rem',
        cursor: 'pointer',
        transition: 'all 0.3s',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        border: '1px solid transparent',
        '&:hover': {
          boxShadow: '0 0 8px 0 rgba(0,0,0,0.1)',
        },
        '&:active': {
          boxShadow: '0 0 8px 0 rgba(0,0,0,0.1)',
        },
        '&:disabled': {
          cursor: 'not-allowed',
          opacity: 0.5,
        },
      },
    };
  });
};
