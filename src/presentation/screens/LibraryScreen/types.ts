import { ViewStyle } from 'react-native';
import { MBook } from '@models/Book';

export type ViewMode = 'grid' | 'list';

export interface IBookCardProps {
  book: MBook;
  style: ViewStyle;
  onPress: (book: MBook) => void;
}

export interface ISearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isSearching?: boolean;
}

export interface IViewToggleProps {
  currentView: ViewMode;
  onToggle: () => void;
}
