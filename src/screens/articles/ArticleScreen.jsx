import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { FAB } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';
import { NormalHeader, OverlayStatusBar } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';


const ArticleScreen = () => {
  const { width } = useWindowDimensions();
  const { html } = useRoute().params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <OverlayStatusBar/>
      <NormalHeader
        title="Khám phá thêm"
        leftIcon='close'
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={true} style={styles.contentContainer}>
        <RenderHtml
          contentWidth={width}
          source={{ html }}
          tagsStyles={tagsStyles}
        />
      </ScrollView>
      <FAB
        icon="home"
        style={styles.fab}
        onPress={() => navigation.goBack()}
        backgroundColor={colors.fbBg}
        color={colors.primary}
      />
    </SafeAreaView>
  );
};

const tagsStyles = {
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.primary
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: colors.orange700
  },
  p: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    lineHeight: 24,
    marginBottom: 12,
    color: colors.black
  },
  ul: {
    marginVertical: 8,
    paddingLeft: 20
  },
  li: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    lineHeight: 24,
    marginBottom: 6,
    color: colors.black,

  },
  img: {
    width: '100%',
    height: undefined,
    aspectRatio: 2,
    marginVertical: 12,
    borderRadius: 8
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    gap: 8,
    position: 'relative',
  },
  contentContainer: {
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    marginTop: 8,
    marginBottom: 70
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ArticleScreen;
