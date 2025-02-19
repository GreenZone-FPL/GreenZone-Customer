import React, {useState,useEffect,useRef} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {CustomSearchBar, HeaderWithBadge} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {AppGraph} from '../../layouts/graphs/appGraph';
import polyline from '@mapbox/polyline';
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
 const [lastLocation, setLastLocation] = useState([null, null]);
 const [searchText, setSearchText] = useState('');
 const [suggestions, setSuggestions] = useState([]);
 const [selectedLocation, setSelectedLocation] = useState(null);
 const cameraRef = useRef(null);
 const opacityAnim = useRef(new Animated.Value(0.3)).current;
 const watchId = useRef(null);
 const [routeCoordinates, setRouteCoordinates] = useState([]);

 const [circleOpacity, setCircleOpacity] = useState(1);

 // Tạo hiệu ứng nhấp nháy liên tục
 const pulseAnimation = useRef(new Animated.Value(1)).current;

 useEffect(() => {
   Animated.loop(
     Animated.sequence([
       Animated.timing(pulseAnimation, {
         toValue: 0.3, // Giảm độ mờ
         duration: 400,
         easing: Easing.linear,
         useNativeDriver: true,
       }),
       Animated.timing(pulseAnimation, {
         toValue: 1, // Trả về trạng thái ban đầu
         duration: 400,
         easing: Easing.linear,
         useNativeDriver: true,
       }),
     ]),
   ).start();
 }, []);

 useEffect(() => {
   watchId.current = Geolocation.watchPosition(
     position => {
       const {latitude, longitude} = position.coords;
       const newLocation = [longitude, latitude];

       if (
         !lastLocation[0] ||
         Math.abs(newLocation[0] - lastLocation[0]) > 0.0005 ||
         Math.abs(newLocation[1] - lastLocation[1]) > 0.0005
       ) {
         setUserLocation(newLocation);
         setLastLocation(newLocation);

         if (cameraRef.current) {
           cameraRef.current.setCamera({
             centerCoordinate: newLocation,
             zoomLevel: 16,
             animationDuration: 1000,
           });
         }
       }
     },
     error => console.log('Lỗi lấy vị trí:', error),
     {enableHighAccuracy: true, distanceFilter: 10},
   );

   return () => {
     if (watchId.current !== null) {
       Geolocation.clearWatch(watchId.current);
     }
   };
 }, []);

 const handleSearch = async text => {
   setSearchText(text);
   if (text.length < 3) {
     setSuggestions([]);
     return;
   }
   try {
     const response = await fetch(
       `https://rsapi.goong.io/Place/AutoComplete?api_key=${GOONG_API_KEY}&input=${text}`,
     );
     const data = await response.json();
     setSuggestions(data.predictions);
   } catch (error) {
     console.log('Lỗi tìm kiếm:', error);
   }
 };

 const handleSelectLocation = async placeId => {
   try {
     const response = await fetch(
       `https://rsapi.goong.io/Place/Detail?api_key=${GOONG_API_KEY}&place_id=${placeId}`,
     );
     const data = await response.json();
     const {lat, lng} = data.result.geometry.location;

     // Xóa tuyến đường trước đó
     setRouteCoordinates([]);

     setSelectedLocation([lng, lat]);

     if (cameraRef.current) {
       cameraRef.current.setCamera({
         centerCoordinate: [lng, lat],
         zoomLevel: 16,
         animationDuration: 1000,
       });
     }
     setSuggestions([]);
     setSearchText('');
   } catch (error) {
     console.log('Lỗi lấy chi tiết địa điểm:', error);
   }
 };

 const moveToCurrentLocation = () => {
   if (userLocation[0] !== null && cameraRef.current) {
     cameraRef.current.setCamera({
       centerCoordinate: userLocation,
       zoomLevel: 16,
       animationDuration: 1000,
     });
   }
 };

 // Lấy tuyến đường từ vị trí hiện tại đến vị trí đã chọn
 const fetchRoute = async () => {
   if (!userLocation[0] || !selectedLocation) {
     console.log('Vị trí không hợp lệ');
     return;
   }

   try {
     const response = await fetch(
       `https://rsapi.goong.io/Direction?origin=${userLocation[1]},${userLocation[0]}&destination=${selectedLocation[1]},${selectedLocation[0]}&vehicle=car&api_key=${GOONG_API_KEY}`,
     );
     const data = await response.json();

     if (data.routes && data.routes.length > 0) {
       const route = data.routes[0];
       if (route.legs && route.legs.length > 0) {
         const steps = route.legs[0].steps;
         const coordinates = steps
           .flatMap(step => polyline.decode(step.polyline.points))
           .map(coord => [coord[1], coord[0]]); // Chuyển về [lng, lat]

         setRouteCoordinates(coordinates);

         // 📌 Tính toán vùng hiển thị toàn bộ tuyến đường
         const lats = coordinates.map(c => c[1]);
         const lngs = coordinates.map(c => c[0]);
         const minLat = Math.min(...lats);
         const maxLat = Math.max(...lats);
         const minLng = Math.min(...lngs);
         const maxLng = Math.max(...lngs);

         // 📍 Điều chỉnh bản đồ để hiển thị toàn bộ tuyến đường
         if (cameraRef.current) {
           cameraRef.current.fitBounds(
             [minLng, minLat], // Góc trái dưới
             [maxLng, maxLat], // Góc phải trên
             100, // Padding để không bị sát mép
           );
         }
       } else {
         console.error('Không tìm thấy dữ liệu tuyến đường');
       }
     } else {
       console.error('Không có tuyến đường hợp lệ');
     }
   } catch (error) {
     console.log('Lỗi lấy tuyến đường:', error);
   }
 };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBadge title={isMapView ? 'Bản đồ' : 'Cửa hàng'} />

      <View style={styles.content}>
        <View style={styles.tool}>
          <CustomSearchBar
            placeholder="Tìm kiếm..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClearIconPress={() => setSearchQuery('')}
            leftIcon="magnify"
            rightIcon="close"
            style={{flex: 1, elevation: 3}}
          />

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
          <View style={styles.mapView}>
            <MapboxGL.MapView
              style={{flex: 1}}
              styleURL={`https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAPTILES_KEY}`}
              onPress={event => {
                const {geometry} = event;
                if (geometry && geometry.coordinates) {
                  setSelectedLocation(geometry.coordinates);
                }
              }}>
              <MapboxGL.Camera
                ref={cameraRef}
                animationMode="flyTo"
                zoomLevel={16}
                centerCoordinate={
                  selectedLocation ||
                  (userLocation[0] !== null
                    ? userLocation
                    : [106.660172, 10.762622])
                }
              />

              {/* userMarker*/}
              {userLocation[0] !== null && (
                <MapboxGL.PointAnnotation
                  coordinate={userLocation}
                  id="userLocation">
                  <Animated.View
                    style={[styles.userMarker, {opacity: pulseAnimation}]}
                  />
                </MapboxGL.PointAnnotation>
              )}

              {selectedLocation && (
                <MapboxGL.PointAnnotation
                  coordinate={selectedLocation}
                  id="selectedLocation">
                  <MapboxGL.Callout title="Vị trí đã chọn" />
                </MapboxGL.PointAnnotation>
              )}
              {routeCoordinates.length > 0 && (
                <MapboxGL.ShapeSource
                  id="routeSource"
                  shape={{
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: routeCoordinates,
                    },
                  }}>
                  <MapboxGL.LineLayer
                    id="routeLayer"
                    style={{
                      lineColor: 'blue',
                      lineWidth: 5,
                    }}
                  />
                </MapboxGL.ShapeSource>
              )}
            </MapboxGL.MapView>

            <View style={styles.searchBox}>
              <TextInput
                placeholder="Nhập địa điểm cần tìm..."
                value={searchText}
                onChangeText={handleSearch}
                style={styles.input}
              />
              <FlatList
                data={suggestions}
                keyExtractor={item => item.place_id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => handleSelectLocation(item.place_id)}
                    style={styles.suggestionItem}>
                    <Text>{item.description}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={moveToCurrentLocation}>
                <Text style={styles.buttonText}>📍 Vị trí của tôi</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={fetchRoute}>
                <Text style={styles.buttonText}>🚗 Chỉ đường</Text>
              </TouchableOpacity>
            </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
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
  userMarker: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: 'white',
  },
  searchBox: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#299345',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MerchantScreen;
