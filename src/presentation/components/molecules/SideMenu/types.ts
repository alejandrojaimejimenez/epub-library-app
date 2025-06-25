/**
 * Props para el componente SideMenu
 */
export interface ISideMenuProps {
  /**
   * Si el menú está visible o no
   */
  isVisible: boolean;

  /**
   * Función a ejecutar cuando se cierra el menú
   */
  onClose: () => void;

  /**
   * Función a ejecutar cuando se presiona fuera del menú
   */
  onBackdropPress?: () => void;

  /**
   * Ancho del menú en porcentaje o píxeles
   * @default '75%'
   */
  width?: string | number;

  /**
   * Posición del menú (izquierda o derecha)
   * @default 'right'
   */
  position?: 'left' | 'right';

  /**
   * ID para pruebas
   */
  testID?: string;
}

/**
 * Elemento de menú lateral
 */
export interface ISideMenuItem {
  /**
   * ID único del elemento
   */
  id: string;

  /**
   * Etiqueta a mostrar
   */
  label: string;

  /**
   * Icono opcional (puede ser un componente React)
   */
  icon?: React.ReactNode;

  /**
   * Función a ejecutar cuando se presiona el elemento
   */
  onPress: () => void;

  /**
   * Si el elemento está deshabilitado
   */
  disabled?: boolean;

  /**
   * Si el elemento está activo/seleccionado
   */
  active?: boolean;
}
