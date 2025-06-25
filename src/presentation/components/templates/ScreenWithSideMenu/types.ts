import { ReactNode } from 'react';

/**
 * Props para el componente ScreenWithSideMenu
 */
export interface IScreenWithSideMenuProps {
  /**
   * Título del header
   */
  title: string;

  /**
   * Contenido principal de la pantalla
   */
  children: ReactNode;

  /**
   * Componente opcional para mostrar en la parte derecha del header
   */
  rightComponent?: ReactNode;

  /**
   * Si mostrar el botón de retroceso en lugar del hamburger menu
   * @default false
   */
  showBackButton?: boolean;

  /**
   * Función a ejecutar cuando se presiona el botón de retroceso
   */
  onBackPress?: () => void;

  /**
   * Ancho del menú lateral
   * @default '75%'
   */
  menuWidth?: string | number;

  /**
   * Posición del menú lateral
   * @default 'right'
   */
  menuPosition?: 'left' | 'right';

  /**
   * ID para pruebas
   */
  testID?: string;
}
