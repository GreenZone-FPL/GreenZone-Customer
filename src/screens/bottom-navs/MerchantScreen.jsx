import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Linking
} from 'react-native';
import {Icon} from 'react-native-paper';
import {CustomSearchBar, HeaderWithBadge} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {AppGraph} from '../../layouts/graphs/appGraph';
import Geolocation from '@react-native-community/geolocation';
import MapboxGL from '@rnmapbox/maps';

const GOONG_API_KEY = 'stT3Aahcr8XlLXwHpiLv9fmTtLUQHO94XlrbGe12';
const GOONG_MAPTILES_KEY = 'pBGH3vaDBztjdUs087pfwqKvKDXtcQxRCaJjgFOZ';

MapboxGL.setAccessToken(GOONG_API_KEY);

const MerchantScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapView, setIsMapView] = useState(false);
  const handleMerchant = item => {
    navigation.navigate(AppGraph.MerchantDetailSheet, {item});
  };

  const toggleView = () => {
    setIsMapView(!isMapView);
  };
  const [userLocation, setUserLocation] = useState([null, null]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setUserLocation([longitude, latitude]);
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: 14,
            animationDuration: 1000,
          });
        }
      },
      error => console.log('Lỗi lấy vị trí:', error),
      {enableHighAccuracy: true, timeout: 5000},
    );
  }, []);

  // hàm tính khoảng cách giữa 2 điểm trên bản đồ
  const haversineDistance = ([lat1, lon1], [lat2, lon2]) => {
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Khoảng cách tính theo km
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBadge title={isMapView ? 'Bản đồ' : 'Cửa hàng'} />

      <View style={styles.content}>
        <View style={styles.tool}>
          <View style={{position: 'relative', flex: 1}}>
            <CustomSearchBar
              placeholder="Tìm kiếm cửa hàng...."
              searchQuery={searchQuery}
              leftIcon="magnify"
              rightIcon="close"
              style={{elevation: 3}}
            />
          </View>

          <TouchableOpacity onPress={toggleView}>
            <View style={styles.map}>
              <Icon
                source="google-maps"
                size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                color={colors.primary}
              />
              <Text style={styles.normalText}>
                {isMapView ? 'Cửa hàng' : 'Bản đồ'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {isMapView ? (
          <View style={{flex: 1}}>
            <MapboxGL.MapView
              style={{flex: 1}}
              styleURL={`https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAPTILES_KEY}`}>
              <MapboxGL.Camera
                ref={cameraRef}
                animationMode="flyTo"
                zoomLevel={14}
                centerCoordinate={
                  userLocation[0] !== null
                    ? userLocation
                    : [106.700987, 10.776889]
                }
              />

              <MapboxGL.Images
                images={{
                  store: require('../../assets/images/image-Service/icon_location.png'),
                }}
              />

              {userLocation[0] !== null && (
                <MapboxGL.PointAnnotation
                  coordinate={userLocation}
                  id="userLocation">
                  <View style={styles.userMarker} />
                </MapboxGL.PointAnnotation>
              )}

              <MapboxGL.ShapeSource
                id="storeLocations"
                shape={{
                  type: 'FeatureCollection',
                  features: storeLocations.map(store => ({
                    type: 'Feature',
                    properties: {
                      id: store.id,
                      name: store.name,
                      specificAddress: store.specificAddress,
                    },
                    geometry: {
                      type: 'Point',
                      coordinates: [store.longitude, store.latitude],
                    },
                  })),
                }}
                onPress={e => {
                  if (e.features.length > 0) {
                    const {properties, geometry} = e.features[0];
                    const store = storeLocations.find(
                      s => s.id === properties.id,
                    );

                    if (store) {
                      const distance =
                        userLocation[0] !== null
                          ? haversineDistance(
                              [userLocation[1], userLocation[0]],
                              [store.latitude, store.longitude],
                            )
                          : null;

                      setSelectedStore({
                        id: store.id,
                        name: store.name,
                        specificAddress: store.specificAddress,
                        phoneNumber: store.phoneNumber,
                        openTime: store.openTime,
                        closeTime: store.closeTime,
                        images: store.images,
                        distance,
                        coordinate: geometry.coordinates,
                      });

                      setModalVisible(true);
                    }
                  }
                }}>
                <MapboxGL.SymbolLayer
                  id="storeIcons"
                  style={{
                    iconImage: 'store',
                    iconSize: 0.1,
                    iconAllowOverlap: true,
                  }}
                />
              </MapboxGL.ShapeSource>
            </MapboxGL.MapView>

            {modalVisible && selectedStore && (
              <Modal visible={modalVisible} transparent animationType="slide">
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setModalVisible(false)}>
                  <View style={styles.bottomSheetContainer}>
                    <View style={styles.modalContent}>
                      {/* Tên cửa hàng */}
                      <Text style={styles.modalTitle}>
                        {selectedStore.name}
                      </Text>

                      {/* Ảnh cửa hàng */}
                      {selectedStore.images.length > 0 && (
                        <Image
                          source={{uri: selectedStore.images[0]}}
                          style={styles.image}
                        />
                      )}

                      {/* Địa chỉ */}
                      <TouchableOpacity
                        onPress={() => {
                          const [lng, lat] = selectedStore.coordinate;
                          const destination = `${lat},${lng}`;
                          const source =
                            userLocation[0] !== null
                              ? `${userLocation[1]},${userLocation[0]}`
                              : '';
                          const url = `https://www.google.com/maps/dir/?api=1&origin=${source}&destination=${destination}&travelmode=driving`;
                          Linking.openURL(url);
                        }}>
                        <Text style={[styles.modalText, styles.greenText]}>
                          📍 {selectedStore.specificAddress}
                        </Text>
                      </TouchableOpacity>

                      {/* Giờ mở cửa */}
                      <View style={styles.modalTime}>
                        <Icon
                          source="clock-outline"
                          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                          color={colors.primary}
                        />
                        <Text style={styles.modalText}>
                          {selectedStore.openTime} - {selectedStore.closeTime}
                        </Text>
                      </View>

                      {/* Khoảng cách */}
                      {selectedStore.distance && (
                        <Text style={styles.modalText}>
                          Khoảng cách: {selectedStore.distance} km
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>
            )}
          </View>
        ) : (
          <View>
            <View style={styles.mechant1}>
              <Text style={styles.tittle}>Cửa hàng gần bạn</Text>
              <FlatList
                data={data.slice(0, 1)}
                renderItem={({item}) => renderItem({handleMerchant, item})}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <Text style={styles.tittle}>Cửa hàng Khác</Text>
            <FlatList
              data={data}
              renderItem={({item}) => renderItem({handleMerchant, item})}
              keyExtractor={item => item.id}
              scrollEnabled={true}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const renderItem = ({item, handleMerchant}) => (
  <TouchableOpacity onPress={() => handleMerchant(item)} style={styles.item}>
    <Image source={{uri: item.image}} style={styles.imageItem} />
    <View style={styles.infoItem}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.distance}>{item.distance}</Text>
    </View>
  </TouchableOpacity>
);

const data = [
  {
    id: '1',
    name: 'GREEN ZONE',
    location: 'HCM Cao Thang',
    distance: 'Cách đây 0,7 km',
    image:
      'https://minio.thecoffeehouse.com/image/admin/store/5b3b04d5fbc68621f3385253_5b3b04d5fbc68621f3385253_nguyen_20duy_20trinh.jpg',
  },
  {
    id: '2',
    name: 'GREEN ZONE',
    location: 'HCM Cao Thang',
    distance: 'Cách đây 1 km',
    image:
      'https://minio.thecoffeehouse.com/image/admin/store/5bfe084efbc6865eac59c98a_to_20ngoc_20van.jpg',
  },
];

const storeLocations = [
  {
    id: '1',
    name: 'GreenZone Coffee',
    phoneNumber: '0987654321',
    images: [
      'https://i.pinimg.com/originals/3d/8b/e8/3d8be817b8a1b70452890e02c8279d1f.jpg',
      'https://www.doanhchu.com/wp-content/uploads/2015/01/coffee-shop-1.jpg',
    ],
    openTime: '08:00',
    closeTime: '22:00',
    specificAddress: 'GreenZone Coffee, CVPM Quang Trung',
    province: 'Hồ Chí Minh',
    district: 'Quận 12',
    ward: 'Phường Bến Nghé',
    latitude: 10.85461098999802,
    longitude: 106.62733749568963,
  },

  {
    id: '2',
    name: 'GreenZone Coffee',
    phoneNumber: '0977223344',
    images: ['https://hoason.vn/wp-content/uploads/2020/05/Quan-Cafe-1-1.jpg'],
    openTime: '07:00',
    closeTime: '23:00',
    specificAddress: '456 Đường Nguyễn Huệ',
    province: 'Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Thành',
    latitude: 10.7756,
    longitude: 106.7035,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  suggestionContainer: {
    position: 'absolute',
    top: 60, // Điều chỉnh tùy thuộc vào vị trí của CustomSearchBar
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    zIndex: 10, // Giúp danh sách hiển thị phía trên các thành phần khác
    maxHeight: 200, // Giới hạn chiều cao, tránh che hết màn hình
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  tool: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    justifyContent: 'space-between',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  map: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'flex-end',
  },
  tittle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  mapView: {
    flex: 1,
  },
  mapText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  normalText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    marginBottom: 8,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  infoItem: {
    flex: 1,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  imageItem: {
    width: 80,
    height: 80,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    marginRight: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  userMarker: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: 'white',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#299345',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.gray700
  },
  greenText: {
    color: '#299345',
  },
  modalTime: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
});

export default MerchantScreen;
