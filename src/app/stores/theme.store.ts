import { createStore, withProps } from '@ngneat/elf';

interface ThemeProps {
  theme: { isDark: boolean } | null;
}

export const THEMES = {
  DARK: 'rosepine',
  LIGHT: 'dawn'
};

export const themeStore = createStore({ name: 'theme' }, withProps<ThemeProps>({ theme: { isDark: false } }));
