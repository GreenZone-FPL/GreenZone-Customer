import Geolocation from '@react-native-community/geolocation';
import MapboxGL from '@rnmapbox/maps';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import { getAllMerchants } from '../../axios/modules/merchant';
import {
  AuthContainer,
  Column,
  CustomSearchBar,
  HeaderWithBadge,
  NormalText,
  TitleText
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAuthActions } from '../../containers';
import { useAuthContext, useCartContext } from '../../context';
import { AppGraph } from '../../layouts/graphs';
import { MerchantItemSkeleton, MerchantListSkeleton, SkeletonBox } from '../../skeletons';
import { CartManager } from '../../utils';

const { width } = Dimensions.get('window');
const GOONG_API_KEY = 'stT3Aahcr8XlLXwHpiLv9fmTtLUQHO94XlrbGe12';
const GOONG_MAPTILES_KEY = 'pBGH3vaDBztjdUs087pfwqKvKDXtcQxRCaJjgFOZ';

MapboxGL.setAccessToken(GOONG_API_KEY);

const MerchantScreen = ({ navigation, route }) => {
  // State Variables
  const [isMapView, setIsMapView] = useState(false);
  const [merchants, setMerchants] = useState([]);
  const [sortedMerchants, setSortedMerchants] = useState([]);
  const [userLocation, setUserLocation] = useState([null, null]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const cameraRef = useRef(null);
  const [selectedMerchant, setSelectedMerchant] = useState([]);
  const [queryMerchants, setQueryMerchants] = useState([]);
  const { isUpdateOrderInfo } = route.params || false;
  const { fromCheckout } = route.params || false;
  const { fromHome } = route.params || false;

  const { authState } = useAuthContext();
  const { cartDispatch } = useCartContext();
  const { onNavigateLogin } = useAuthActions();
  const [loadingMerchants, setLoadingMerchants] = useState(false);


  const fetchMerchants = async () => {
    try {
      setLoadingMerchants(true)
      const data = await getAllMerchants();
      setMerchants(data.docs);
    } catch (error) {
      console.log('Error fetching merchants:', error);
    } finally {
      setLoadingMerchants(false)
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  // hàm tính khoảng cách giữa người dùng và cửa hàng
  const haversineDistance = (lat2, lon2) => {
    if (!userLocation || userLocation[0] === null || userLocation[1] === null) {
      return null; // Invalid user location
    }

    const R = 6371; // Earth radius in km
    const toRad = angle => (angle * Math.PI) / 180;

    const lat1 = userLocation[1];
    const lon1 = userLocation[0];
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(2);
  };

  // hàm mở map
  const toggleView = () => {
    setIsMapView(!isMapView);
  };

  // hàm tới cửa hàng chi tiết
  const handleMerchant = merchant => {
    if (isUpdateOrderInfo) {
      const storeSelect = merchant._id;
      const storeInfoSelect = {
        storeName: merchant.name,
        storeAddress: `${merchant.address}`,
      };

      const updatePayload = fromHome
        ? { storeSelect, storeInfoSelect }
        : {
          store: storeSelect,
          storeInfo: storeInfoSelect,
          storeSelect,
          storeInfoSelect
        };

      CartManager.updateOrderInfo(cartDispatch, updatePayload);
      navigation.goBack();
    } else {
      navigation.navigate(AppGraph.MerchantDetailSheet, {
        item: merchant,
      });
    }
  };


  // Handle Search Focus
  const handleSearchPress = () => {
    setIsMapView(false);
  };

  // Fetch User Location
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          if (cameraRef.current) {
            cameraRef.current.setCamera({
              centerCoordinate: [longitude, latitude],
              zoomLevel: 14,
              animationDuration: 1000,
            });
          }
        },
        error => console.log(error),
        { timeout: 5000 },
      );
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);



  // sắp xếp lại merchants theo khoảng cách
  useEffect(() => {
    if (!merchants || merchants.length === 0) return;

    const sortedList = merchants
      .map(item => ({
        ...item,
        distance: haversineDistance(item.latitude, item.longitude),
      }))
      .sort((a, b) => a.distance - b.distance);

    setSortedMerchants(sortedList);
  }, [merchants, userLocation]);

  // hàm tìm kiếm cửa hàng
  const removeVietnameseTones = str => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D') // Thay đ → d
      .toLowerCase(); // Chuyển về chữ thường
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      const queryNormalized = removeVietnameseTones(searchQuery);

      const filteredMerchants = sortedMerchants.filter(merchant =>
        [
          merchant.name,
          merchant.district,
          merchant.phoneNumber,
          merchant.province,
          merchant.ward,
          merchant.specificAddress,
        ]
          .map(removeVietnameseTones)
          .some(field => field.includes(queryNormalized)),
      );

      setQueryMerchants(filteredMerchants);
    } else {
      setQueryMerchants([]);
    }
  }, [searchQuery]);

  // Shape Data for Mapbox
  const shapeData = {
    type: 'FeatureCollection',
    features: merchants.map(store => ({
      type: 'Feature',
      properties: {
        id: store._id,
        name: store.name,
        iconImage: 'store',
      },
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(store.longitude), parseFloat(store.latitude)],
      },
    })),
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBadge
        title={isMapView ? 'Bản đồ' : 'Cửa hàng'}
        enableLeftIcon={isUpdateOrderInfo}
        enableBadge={!!authState.lastName}
        onLeftPress={() => navigation.goBack()}
      />

      {!authState.lastName && (
        <AuthContainer onPress={onNavigateLogin} />
      )}

      <View style={styles.content}>
        <View style={styles.tool}>
          <View style={{ position: 'relative', flex: 1 }}>
          

            {suggestions.length > 0 && (
              <View style={styles.suggestionContainer}>
                <FlatList
                  scrollEnabled={false}
                  data={suggestions}
                  keyExtractor={item => item.place_id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectLocation(item.place_id)}
                      style={styles.suggestionItem}>
                      <Text>{item.description}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.map} onPress={toggleView}>
            <Icon
              source={isMapView ? 'store' : 'google-maps'}
              size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
              color={colors.primary}
            />
            <NormalText text={isMapView ? 'Cửa hàng' : 'Bản đồ'} />

          </TouchableOpacity>
        </View>

        {isMapView ? (
          <View style={styles.mapView}>
            <MapboxGL.MapView
              style={{ flex: 1 }}
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
              {/* Đăng ký hình ảnh cho các cửa hàng */}
              <MapboxGL.Images
                images={{
                  store: require('../../assets/images/image-Service/ic_location.png'),
                }}
              />

              {/* Vị trí người dùng */}
              {userLocation[0] !== null && (
                <MapboxGL.PointAnnotation
                  coordinate={userLocation}
                  id="userLocation">
                  <View style={styles.userMarker} />
                </MapboxGL.PointAnnotation>
              )}
              {/* Hiển thị các cửa hàng trên bản đồ */}
              <MapboxGL.ShapeSource
                id="storeLocations"
                shape={shapeData}
                onPress={event => {
                  const { properties } = event.features[0];
                  const merchant = merchants.find(m => m._id === properties.id);
                  if (merchant) {
                    setSelectedMerchant(merchant);

                    navigation.navigate(AppGraph.MerchantDetailSheet, {
                      item: merchant,
                    });
                  }
                }}>
                <MapboxGL.SymbolLayer
                  id="storeIcons"
                  style={{
                    iconAllowOverlap: true,
                    iconImage: 'store',
                    iconSize: 0.1,
                  }}
                />
              </MapboxGL.ShapeSource>
            </MapboxGL.MapView>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.mechant1}>
              {
                loadingMerchants ?
                  <SkeletonBox width='40%' height={20} borderRadius={10} style={{ marginHorizontal: 16, marginVertical: 10 }} /> :
                  <Text style={styles.title}>Cửa hàng gần bạn</Text>
              }



              {sortedMerchants.length == 0 ? (
                <MerchantListSkeleton numOfRows={1} />

              ) : (
                <FlatList
                  scrollEnabled={false}
                  data={
                    queryMerchants.length > 0
                      ? queryMerchants
                      : sortedMerchants.slice(0, 1)
                  }
                  renderItem={({ item }) =>
                    RenderItem({ handleMerchant, item, haversineDistance })
                  }
                  keyExtractor={item => item._id.toString()}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
            {
              loadingMerchants ?

                <SkeletonBox width='40%' height={20} borderRadius={10} style={{ marginHorizontal: 16, marginVertical: 10 }} /> :
                <Text style={styles.title}>Cửa hàng khác</Text>
            }

            {sortedMerchants.length == 0 ? (
              <MerchantListSkeleton numOfRows={3} />


            ) : (
              <FlatList
                scrollEnabled={false}
                data={
                  queryMerchants.length > 0
                    ? queryMerchants
                    : sortedMerchants.slice(1)
                }
                renderItem={({ item }) =>
                  RenderItem({ handleMerchant, item, haversineDistance })
                }
                keyExtractor={item => item._id}
                contentContainerStyle={{ gap: 3, backgroundColor: colors.fbBg }}
              />
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const RenderItem = ({ item, handleMerchant, haversineDistance }) => {

  return (
    <TouchableOpacity onPress={() => handleMerchant(item)} style={styles.item}>
      <Image source={{ uri: item.images[0] }} style={styles.imageItem} />

      <Column style={styles.infoItem}>

        <TitleText text={item.name} />

        <NormalText
          style={styles.location}
          text={`${item?.address}`}
        />


        {
          haversineDistance(item.latitude, item.longitude) &&
          <NormalText
            style={styles.distance}
            text={`${haversineDistance(item.latitude, item.longitude)} km`}
          />
        }


      </Column>
    </TouchableOpacity>
  )
}




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
    top: 60,
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
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '600',
    marginVertical: 10,
    color: colors.lemon,
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
  textName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    borderColor: colors.fbBg,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,

  },
  infoItem: { flex: 1 },
  imageItem: {
    width: width / 5,
    height: width / 5,
    borderRadius: width / 2,
    marginRight: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  location: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '400',
    color: colors.black
  },
  distance: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.orange700
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
});

export default MerchantScreen;
