/**
 * Props para el componente HamburgerIcon
 */
export interface IHamburgerIconProps {
  /**
   * Función a ejecutar cuando se presiona el icono
   */
  onPress: () => void;

  /**
   * Color del icono. Si no se especifica, usa el color del tema
   */
  color?: string;

  /**
   * Tamaño del icono en píxeles
   * @default 24
   */
  size?: number;

  /**
   * ID para pruebas
   * @default "hamburger-icon"
   */
  testID?: string;

  /**
   * Si el icono está deshabilitado
   * @default false
   */
  disabled?: boolean;
}
