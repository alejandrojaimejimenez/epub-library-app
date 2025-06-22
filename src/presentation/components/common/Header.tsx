import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';

interface HeaderProps {
  title: string;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, rightComponent, leftComponent }) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {leftComponent}
      </View>
      
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      
      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 90 : 60,
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
    backgroundColor: colors.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    color: colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
});

export default Header;
