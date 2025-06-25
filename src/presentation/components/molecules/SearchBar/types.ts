/**
 * Props para el componente SearchBar
 */
export interface ISearchBarProps {
  /**
   * Valor actual del campo de búsqueda
   */
  value: string;

  /**
   * Callback cuando el texto de búsqueda cambia
   */
  onChangeText: (text: string) => void;

  /**
   * Callback cuando se presiona el botón de búsqueda o se envía el formulario
   */
  onSubmit: () => void;

  /**
   * Indica si se está realizando una búsqueda
   * @default false
   */
  isSearching?: boolean;

  /**
   * Placeholder para mostrar cuando el input está vacío
   * @default "Buscar..."
   */
  placeholder?: string;

  /**
   * Estilos adicionales para el contenedor
   */
  containerStyle?: object;

  /**
   * ID para pruebas
   */
  testID?: string;
}
