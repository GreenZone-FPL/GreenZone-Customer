import React, { useState } from 'react';
import { Linking, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { DialogFeedback, LightStatusBar, NormalHeader, Column } from '../../components';
import { GLOBAL_KEYS, colors } from '../../constants';


const ContactScreen = props => {
  const navigation = props.navigation;
  const [isDialogVisible, setDialogVisible] = useState(false);

  const handlePress = (type, path) => {
    switch (type) {
      case 'phone':
        Linking.openURL(`tel:${path}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${path}`);
        break;
      case 'website':
        Linking.openURL(path);
        break;
      case 'facebook':
        Linking.openURL(`https://${path}`);
        break;
      default:
        console.log('Không có hành động được chỉ định');
    }
  };

  const handleFeedbackPress = () => {
    setDialogVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Liên hệ và góp ý"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Card
          icon="phone"
          name="Tổng đài"
          path="18006936"
          onPress={() => handlePress('phone', '18006936')}
        />
        <Card
          icon="email"
          name="Email"
          path="greenzone@gmail.com"
          onPress={() => handlePress('email', 'greenzone@gmail.com')}
        />
        <Card
          icon="earth"
          name="Website"
          path="https://www.greenzone.com"
          onPress={() => handlePress('website', 'https://www.greenzone.com')}
        />
        <Card
          icon="facebook"
          name="Facebook"
          path="https://www.facebook.com/"
          onPress={() => handlePress('facebook', 'https://www.facebook.com/')}
        />
        <Pressable style={styles.card} onPress={handleFeedbackPress}>
          <Icon
            source="chat-alert"
            size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
            color={colors.gray700}
          />
          <Text style={styles.textName}>Gửi góp ý về ứng dụng</Text>
        </Pressable>
      </View>
      <DialogFeedback
        isVisible={isDialogVisible}
        onHide={() => setDialogVisible(false)}
      />
    </SafeAreaView>
  );
};

const Card = ({icon, name, path, onPress}) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Icon
      source={icon}
      size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
      color={colors.gray700}
    />
    <Column>
      <Text style={styles.textName}>{name}</Text>
      <Text style={styles.textPath}>{path}</Text>
    </Column>
  </Pressable>
);

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  content: {
    flexDirection: 'column',
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white,
    gap: 8

  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingHorizontal: 8,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.white
  },
  textName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  textPath: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray400,
  },
});
