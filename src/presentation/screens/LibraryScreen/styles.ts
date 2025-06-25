import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    height: theme.layout.buttonHeight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.layout.borderRadius.small,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
  },
  searchButton: {
    height: theme.layout.buttonHeight,
  },
  bookList: {
    padding: theme.spacing.md,
  },
  gridCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: theme.spacing.md,
  },
  listCard: {
    width: '100%',
    marginBottom: theme.spacing.md,
    height: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    textAlign: 'center',
  },
  viewToggle: {
    fontSize: 24,
    color: theme.colors.primary,
    padding: theme.spacing.xs,
  },
});
