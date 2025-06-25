import { ViewStyle } from 'react-native';

export interface IButtonProps {
  /** Título del botón */
  title: string;
  /** Función a ejecutar al presionar el botón */
  onPress: () => void;
  /** Variante de estilo del botón: primary, secondary, outline */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Tamaño del botón: small, medium, large */
  size?: 'small' | 'medium' | 'large';
  /** Estilo personalizado para el contenedor del botón */
  style?: ViewStyle;
  /** Indica si el botón está deshabilitado */
  disabled?: boolean;
  /** Indica si el botón está en estado de carga */
  loading?: boolean;
  /** Indica si el botón debe ocupar todo el ancho disponible */
  fullWidth?: boolean;
  /** Etiqueta de accesibilidad */
  accessibilityLabel?: string;
  /** Descripción de accesibilidad */
  accessibilityHint?: string;
  /** ID para pruebas automatizadas */
  testID?: string;
}
