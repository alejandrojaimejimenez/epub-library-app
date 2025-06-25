export interface ViewToggleProps {
  /**
   * Whether the grid view is active
   */
  isGridView: boolean;
  /**
   * Callback when the view type changes
   */
  onToggle: () => void;
  /**
   * Accessibility label for the grid view button
   */
  gridViewAccessibilityLabel?: string;
  /**
   * Accessibility label for the list view button
   */
  listViewAccessibilityLabel?: string;
  /**
   * Test ID for testing purposes
   */
  testID?: string;
}
