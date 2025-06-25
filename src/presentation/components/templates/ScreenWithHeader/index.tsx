import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '@molecules/Header';
import { useTheme } from '@theme/useTheme';

interface IScreenWithHeaderProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

const ScreenWithHeader: React.FC<IScreenWithHeaderProps> = ({
  children,
  title,
  showBackButton = true,
  rightComponent
}) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={title}
        showBackButton={showBackButton}
        onBackPress={navigation.goBack}
        rightComponent={rightComponent}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenWithHeader;
