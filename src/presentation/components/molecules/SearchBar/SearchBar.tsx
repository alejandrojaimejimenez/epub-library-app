import React, { memo } from 'react';
import { View, TextInput } from 'react-native';
import Button from '@components/atoms/Button';
import { useTheme } from '@theme/useTheme';
import type { ISearchBarProps } from './types';
import { createStyles } from './styles';

/**
 * Componente de barra de búsqueda reutilizable
 */
export const SearchBar = memo(({
  value,
  onChangeText,
  onSubmit,
  isSearching = false,
  placeholder = "Buscar...",
  containerStyle,
  testID = 'search-bar'
}: ISearchBarProps) => {
  const { colors, layout, spacing } = useTheme();
  const styles = createStyles({ colors, layout, spacing });

  return (
    <View 
      style={[styles.searchContainer, containerStyle]}
      testID={testID}
    >
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        editable={!isSearching}
        returnKeyType="search"
        accessibilityLabel="Campo de búsqueda"
        accessibilityHint="Introduce el texto para buscar"
        testID={`${testID}-input`}
      />
      <Button
        title="Buscar"
        onPress={onSubmit}
        size="small"
        style={styles.searchButton}
        disabled={isSearching}
        accessibilityLabel="Buscar"
        testID={`${testID}-button`}
      />
    </View>
  );
});
