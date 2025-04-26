import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { OverlayStatusBar } from '../../components/status-bars/OverlayStatusBar';
import { GLOBAL_KEYS, colors } from '../../constants';
import { Pressable } from 'react-native';
import { Toaster } from '../../utils';

const width = Dimensions.get('window').width;

const MerchantDetailSheet = props => {
  const { navigation, route } = props;
  const { item } = route.params;

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <OverlayStatusBar />
        <Slider item={item} handleGoBack={handleGoBack} />
        <Body item={item} />
      </View>
    </View>
  );
};

const Slider = ({ item, handleGoBack }) => {
  const [index, setIndex] = useState(0);
  const handelImage = () => {
    if (index < 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  };
  return (
    <View>
      <TouchableOpacity style={styles.buttonText} onPress={handelImage}>
        <Text
          style={{ color: colors.white, fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE }}>
          Xem thêm
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handelImage} />

      <Image source={{ uri: item.images[index] }} style={styles.image} />
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => handleGoBack()}>
        <Icon
          source="close"
          color={colors.gray700}
          size={GLOBAL_KEYS.ICON_SIZE_SMALL}
        />
      </TouchableOpacity>
    </View>
  );
};

const Body = ({ item }) => {
  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch(err =>
      console.error('Lỗi mở Google Maps:', err),
    );
  };
  return (

    <SafeAreaView style={styles.body}>
      <Text style={styles.title}>{item.name}</Text>

      <Text style={styles.openingHours}>Giờ mở cửa: {item.openTime}</Text>
      <Text style={styles.openingHours}>Giờ đóng cửa: {item.closeTime}</Text>
      <Pressable
        onPress={() => openGoogleMaps(item.latitude, item.longitude)}
        style={styles.infoContainer}>
        <Icon
          source="navigation-variant-outline"
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
          color={colors.primary}
        />
        <Text numberOfLines={2} style={styles.infoText}>
          {item.address}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)}
        style={styles.infoContainer}>
        <Icon
          source="phone-outline"
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
          color={colors.primary}
        />
        <Text style={styles.infoText}>Liên hệ: {item.phoneNumber}</Text>
      </Pressable>


      <Pressable
        onPress={() => Toaster.show('Tính năng đang phát triển')}
        style={styles.infoContainer}>
        <Icon
          source="share-variant-outline"
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
          color={colors.primary}
        />
        <Text style={styles.infoText}>Chia sẻ với bạn bè</Text>
      </Pressable>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: StatusBar.currentHeight + 40,
    gap: 8,
  },

  image: {
    width: width,
    height: width * 0.8,
    resizeMode: 'cover',
  },
  goBackButton: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2,
    backgroundColor: colors.green100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    end: 0,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    padding: 4,
  },
  body: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black
  },
  location: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '600',
  },
  openingHours: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '400',
    marginLeft: GLOBAL_KEYS.PADDING_DEFAULT,
    color: colors.black,
    flex: 1,
    lineHeight: 20
  },
  buttonText: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    width: width,
    height: GLOBAL_KEYS.ICON_SIZE_LARGE + 10,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MerchantDetailSheet;
