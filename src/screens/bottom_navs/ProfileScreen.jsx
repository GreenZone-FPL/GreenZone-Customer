import { StyleSheet, Image, SafeAreaView, Text, View, ScrollView , TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Fontisto';




const CardItem = ({ icon, text, color }) => {
  return (
    <View style={styles.card}>
      <Icon name={icon} size={24} color={color} />
      <Text style={styles.cardText}>{text}</Text>
    </View>
  );
};


const ProfileScreen = (props) => {
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.textHeader}>Khác</Text>
        <View style={styles.notification}>
          <View style={styles.itemNotification}>
            <Icon name="ticket-confirmation-outline" size={25} color="#1c1c1c" />
          </View>
          <View style={styles.itemNotification}>
            <Icons name="bell" size={25} color="#1c1c1c" />
          </View>
        </View>
      </View>

      <ScrollView style={styles.body}>
        <Text style={styles.tittle}>
          Tiện ích
        </Text>
        <View style={styles.extention}>
          <CardItem 
            icon="file-document-outline" 
            text="Lịch sử đơn hàng" 
            color="#ff9800" 
          />
          <CardItem 
            icon="file-document-outline" 
            text="Điều khoản" 
            color="#8e44ad" 
          />
        </View>
        <View style={styles.row}>
          <CardItem 
            icon="file-document-outline" 
            text="Điều khoản VNPAY" 
            color="#8e44ad" 
          />
        </View>
        <Text style={styles.tittle}>
          Hỗ trợ
        </Text>
        <View style={styles.support}>
            <TouchableOpacity style={styles.item}>
            <View style={styles.leftSection}>
              <Icon name="star-outline" size={24} color="#000" />
              <Text style={styles.title}>Đánh giá đơn hàng</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.item}>
            <View style={styles.leftSection}>
              <Icon name="message-outline" size={24} color="#000" />
              <Text style={styles.title}>Liên hệ và góp ý</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.item}>
            <View style={styles.leftSection}>
              <Icon name="file-chart-outline" size={24} color="#000" />
              <Text style={styles.title}>Hướng dẫn xuất hoá đơn GTGT</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>


        <Text style={styles.tittle}>
          Tài Khoản
        </Text>
        <View style={styles.support}>
            <TouchableOpacity style={styles.item}>
            <View style={styles.leftSection}>
              <Icon name="account-outline" size={24} color="#000" />
              <Text style={styles.title}>Thông tin cá nhân</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.separator} />
          <TouchableOpacity style={styles.item}>
            <View style={styles.leftSection}>
              <Icon name="bookmark-outline" size={24} color="#000" />
              <Text style={styles.title}>Địa chỉ đã lưu</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.separator} />
          <TouchableOpacity style={styles.item}>
            <View style={styles.leftSection}>
              <Icon name="cog-outline" size={24} color="#000" />
              <Text style={styles.title}>Cài đặt</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.separator} />
          <TouchableOpacity style={styles.item}>
            <View style={styles.leftSection}>
              <Icon name="login" size={24} color="#000" />
              <Text style={styles.title}>Đăng xuất</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,
    width: 352,
  },
  support:{
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    flex: 1,
    height: 80,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-around',
  },
  cardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1c1c1c',
  },
  extention:{
    flexDirection: 'row'
  },
  tittle:{
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  body:{
    flexDirection: 'column',
    paddingHorizontal: 20,
    marginTop: 15
  },
  textHeader:{
    fontSize: 16,
    fontWeight: 'bold'
  },
  itemNotification: {
    width: 50,
    height: 40,
    marginHorizontal: 3, 
    backgroundColor: '#fff',
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  notification: {
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5F5F5',
  },
});