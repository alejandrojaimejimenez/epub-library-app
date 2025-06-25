import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@theme/useTheme';
import { Header, SideMenu } from '@components/molecules';
import { useSideMenu } from '@hooks/useSideMenu';
import { createStyles } from './styles';
import type { IScreenWithSideMenuProps } from './types';

/**
 * Template de pantalla con header y menú lateral.
 * Proporciona una estructura base con navegación lateral integrada.
 *
 * @example
 * ```tsx
 * <ScreenWithSideMenu title="Mi Pantalla">
 *   <MyScreenContent />
 * </ScreenWithSideMenu>
 * ```
 */
const ScreenWithSideMenu: React.FC<IScreenWithSideMenuProps> = ({
  title,
  children,
  rightComponent,
  showBackButton = false,
  onBackPress,
  menuWidth = '75%',
  menuPosition = 'right',
  testID = 'screen-with-side-menu',
}) => {
  const { colors } = useTheme();
  const styles = createStyles({ colors });
  const { isVisible, openMenu, closeMenu } = useSideMenu();

  return (
    <View style={styles.container} testID={testID}>
      {/* Header */}
      <Header
        title={title}
        rightComponent={rightComponent}
        showBackButton={showBackButton}
        onBackPress={onBackPress}
        showHamburgerMenu={!showBackButton}
        onHamburgerPress={openMenu}
      />

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Side Menu */}
      <SideMenu
        isVisible={isVisible}
        onClose={closeMenu}
        width={menuWidth}
        position="right"
      />
    </View>
  );
};

export default React.memo(ScreenWithSideMenu);
