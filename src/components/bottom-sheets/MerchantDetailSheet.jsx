import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import React from 'react';
import GLOBAL_KEYS from '../../constants/globalKeys';
import colors from '../../constants/color';
import {Icon} from 'react-native-paper';
import OverlayStatusBar from '../status-bars/OverlayStatusBar';
const width = Dimensions.get('window').width;

const MerchantDetailSheet = props => {
  const {navigation, route} = props;

  const {item} = route.params;

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.overlay}}>
      <View style={styles.container}>
        <OverlayStatusBar />
        <Slider item={item} handleGoBack={handleGoBack} />
        <Body item={item} />
      </View>
    </View>
  );
};

const Slider = ({item, handleGoBack}) => (
  <View style={styles.Slider}>
    <Image source={{uri: item.image}} style={styles.image} />
    <TouchableOpacity
      style={styles.goBackButton}
      onPress={() => handleGoBack()}>
      <Icon
        source="close"
        color={colors.primary}
        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
      />
    </TouchableOpacity>
  </View>
);

const Body = ({item}) => (
  <ScrollView>
    <View style={styles.body}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.openingHours}>Giờ mở cửa: 07:00-22:00</Text>

      <View style={styles.infoContainer}>
        <Icon
          source="navigation-variant-outline"
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
          color={colors.primary}
        />
        <Text style={styles.infoText}>83 Quang Trung, P7 Gò vấp, Tp.HCM</Text>
      </View>

      <View style={styles.infoContainer}>
        <Icon
          source="cards-heart-outline"
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
          color={colors.primary}
        />
        <Text style={styles.infoText}>Thêm vào danh sách yêu thích</Text>
      </View>

      <View style={styles.infoContainer}>
        <Icon
          source="phone-outline"
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
          color={colors.primary}
        />
        <Text style={styles.infoText}>Liên hệ: 09812312312</Text>
      </View>

      <View style={styles.infoContainer}>
        <Icon
          source="share-variant-outline"
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
          color={colors.primary}
        />
        <Text style={styles.infoText}>Chia sẻ với bạn bè</Text>
      </View>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: StatusBar.currentHeight + 40,
  },
  Slider: {
    width: width,
  },
  image: {
    width: width,
    height: width * 0.8,
    resizeMode: 'cover',
  },
  goBackButton: {
    padding: 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * ,
    backgroundColor: colors.green100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    end: 0,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  body: {
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  title: {
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
  },
  location: {
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '600',
  },
  openingHours: {
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  infoText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    marginLeft: GLOBAL_KEYS.PADDING_DEFAULT,
  },
});

export default MerchantDetailSheet;
