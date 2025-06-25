import { ReactNode } from 'react';

/**
 * Props para el componente Header
 */
export interface IHeaderProps {
  /**
   * Título a mostrar en el centro del header
   */
  title: string;

  /**
   * Componente opcional para mostrar en la parte derecha del header
   */
  rightComponent?: ReactNode;

  /**
   * Componente opcional para mostrar en la parte izquierda del header.
   * Si se proporciona, tiene prioridad sobre showBackButton y showHamburgerMenu
   */
  leftComponent?: ReactNode;

  /**
   * Si es true, muestra un botón de retroceso en la parte izquierda
   * @default false
   */
  showBackButton?: boolean;

  /**
   * Función a ejecutar cuando se presiona el botón de retroceso
   * Requerido si showBackButton es true
   */
  onBackPress?: () => void;

  /**
   * Si es true, muestra el icono hamburger en la parte izquierda
   * @default false
   */
  showHamburgerMenu?: boolean;

  /**
   * Función a ejecutar cuando se presiona el icono hamburger
   * Requerido si showHamburgerMenu es true
   */
  onHamburgerPress?: () => void;

  /**
   * ID para pruebas
   */
  testID?: string;
}
