import React, { memo } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from '@theme/useTheme';
import type { ViewToggleProps } from './types';
import { createStyles } from './styles';

/**
 * ViewToggle component allows switching between grid and list views
 */
export const ViewToggle = memo(({
  isGridView,
  onToggle,
  gridViewAccessibilityLabel = 'Switch to grid view',
  listViewAccessibilityLabel = 'Switch to list view',
  testID = 'view-toggle',
}: ViewToggleProps) => {
  const { colors, layout, spacing } = useTheme();
  const styles = createStyles({ colors, layout, spacing });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onToggle}
        accessibilityLabel={gridViewAccessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ selected: isGridView }}
        style={[styles.button, isGridView && styles.activeButton]}
        testID={`${testID}-grid`}
      >
        <Text style={[styles.text, isGridView && styles.activeText]}>
          Grid
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onToggle}
        accessibilityLabel={listViewAccessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ selected: !isGridView }}
        style={[styles.button, !isGridView && styles.activeButton]}
        testID={`${testID}-list`}
      >
        <Text style={[styles.text, !isGridView && styles.activeText]}>
          List
        </Text>
      </TouchableOpacity>
    </View>
  );
});
