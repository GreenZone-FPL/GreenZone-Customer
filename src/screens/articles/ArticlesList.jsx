import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { AppGraph } from '../../layouts/graphs';
import { Row } from '../../components/containers/Row';
import { TitleText } from '../../components/texts/TitleText';
import { Column } from '../../components/containers/Column';

const width = Dimensions.get('window').width;

export const ArticlesList = props => {

  const navigation = useNavigation()


  const onArticlePress = (html) => {
    navigation.navigate(AppGraph.ArticleScreen, { html: html })
  }
  return (
    <Column style={{ padding: 16 }}>

      <Row>
        <Icon source='star-shooting' size={24} color={colors.yellow500} />
        <TitleText text='Khám phá thêm' style={styles.headerTitle} />
      </Row>



      <FlatList
       data={articles.slice().reverse()}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.itemContainer} onPress={() => onArticlePress(item.html)}>
            <Image source={{uri: item.image}} style={styles.image} resizeMode='cover' />


            <Column style={styles.contentContaner}>
              <Text style={styles.articleTitle} numberOfLines={2} >{item.title}</Text>
              <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
              <Row>
                <Icon
                  source="clock-time-eight"
                  size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                  color={colors.orange700}
                />
                <Text style={styles.date}>{item.date}</Text>
              </Row>
            </Column>


          </Pressable>
        )}
        contentContainerStyle={{ gap: 16, paddingVertical: 8 }}
      />
    </Column>
  );
};


const articles = [
  {
    id: '1',
    image: 'https://greenzone.motcaiweb.io.vn/uploads/2e4a939c-b2a1-4cfc-a082-4f81158cf268.png',
    title: 'Giới thiệu GreenZone',
    content: `GreenZone là hệ thống ứng dụng toàn diện giúp người dùng dễ dàng đặt hàng, quản lý cửa hàng và tối ưu hóa quy trình bán hàng một cách hiệu quả và hiện đại.`,
    html: `
      <h1>Giới thiệu GreenZone</h1>
      <p>GreenZone là hệ thống ứng dụng hỗ trợ đặt hàng và quản lý cửa hàng đồ uống. Hệ thống được thiết kế để mang đến trải nghiệm mua hàng thuận tiện, hiện đại cho khách hàng, đồng thời giúp tối ưu hóa quy trình vận hành cho các cửa hàng và nhân viên giao hàng.</p>
      <img src="https://greenzone.motcaiweb.io.vn/uploads/2e4a939c-b2a1-4cfc-a082-4f81158cf268.png" alt="GreenZone System"/>
      <h2>Khả năng tích hợp linh hoạt</h2>
      <p>GreenZone có thể tích hợp dễ dàng với hệ thống bán hàng hiện tại, mang lại hiệu quả tối ưu trong việc theo dõi đơn hàng, xử lý thanh toán, và đánh giá khách hàng.</p>
      <h2>Phát triển hướng tới tương lai</h2>
      <p>Với khả năng mở rộng linh hoạt, GreenZone không chỉ giới hạn ở lĩnh vực đồ uống mà còn có thể áp dụng cho các ngành hàng thực phẩm, nhà hàng, và dịch vụ giao hàng khác.</p>
      <p>Hệ thống được cập nhật thường xuyên, cải tiến giao diện người dùng và nâng cấp bảo mật nhằm mang đến sự ổn định lâu dài cho cả người dùng và đối tác.</p>
    `,
    date: '2025-04-01'
  },
  {
    id: '2',
    image: 'https://greenzone.motcaiweb.io.vn/uploads/f6376273-4556-4157-ad0c-0c9915647e54.png',
    title: 'Các ứng dụng trong hệ thống',
    content: `Hệ thống bao gồm nhiều ứng dụng từ khách hàng đến quản trị viên: đặt hàng, quản lý cửa hàng, ứng dụng dành cho shipper và giao diện quản trị cho Admin.`,
    html: `
      <h1>Các ứng dụng trong hệ thống</h1>
      <ul>
        <li><strong>Ứng dụng đặt hàng cho khách hàng:</strong> Giao diện đơn giản, dễ sử dụng để chọn món và thanh toán.</li>
        <li><strong>Ứng dụng quản lý cửa hàng:</strong> Giúp chủ cửa hàng theo dõi doanh thu, quản lý sản phẩm và đơn hàng.</li>
        <li><strong>Ứng dụng dành cho shipper:</strong> Cập nhật trạng thái giao hàng theo thời gian thực.</li>
        <li><strong>Trang quản trị dành cho Admin:</strong> Quản lý toàn bộ hệ thống, người dùng và báo cáo thống kê.</li>
      </ul>
      <img src="https://greenzone.motcaiweb.io.vn/uploads/f6376273-4556-4157-ad0c-0c9915647e54.png" alt="GreenZone Apps"/>
      <h2>Kết nối đồng bộ giữa các ứng dụng</h2>
      <p>Các ứng dụng trong hệ thống GreenZone được kết nối đồng bộ với nhau qua cơ sở dữ liệu đám mây, giúp đảm bảo dữ liệu luôn được cập nhật theo thời gian thực.</p>
      <p>Việc quản lý đơn hàng, theo dõi trạng thái và phân phối nhiệm vụ giữa các bên diễn ra trơn tru và tự động, hạn chế tối đa lỗi do thao tác thủ công.</p>
    `,
    date: '2025-04-05'
  },
  
  {
    id: '3',
    image: 'https://greenzone.motcaiweb.io.vn/uploads/179d3df1-38f2-4e22-bb1f-5d08bccc766e.png',
    title: 'Lợi ích cho khách hàng',
    content: `Khách hàng có thể đặt hàng mọi lúc mọi nơi, nhận thông báo cập nhật đơn hàng, thanh toán tiện lợi và hỗ trợ nhanh chóng từ hệ thống.`,
    html: `
      <h1>Lợi ích dành cho khách hàng</h1>
      <p>GreenZone mang đến sự tiện lợi cho khách hàng với chức năng đặt hàng online, theo dõi đơn hàng, thanh toán nhanh chóng và giao hàng đúng thời gian.</p>
      <h2>Trải nghiệm người dùng vượt trội</h2>
      <p>Khách hàng có thể lưu lại đơn yêu thích, theo dõi lịch sử đặt hàng, nhận thông báo về khuyến mãi và các chương trình ưu đãi đặc biệt.</p>
      <img src="https://greenzone.motcaiweb.io.vn/uploads/179d3df1-38f2-4e22-bb1f-5d08bccc766e.png" alt="User Experience"/>
      <h2>Hỗ trợ và phản hồi nhanh chóng</h2>

      <p>GreenZone tạo ra một nền tảng đặt hàng thông minh, giúp khách hàng tiết kiệm thời gian và nâng cao trải nghiệm mua sắm. Người dùng có thể chọn món, đặt hàng và thanh toán chỉ với vài thao tác đơn giản trên điện thoại hoặc máy tính bảng.</p>
      <p>GreenZone cung cấp kênh hỗ trợ khách hàng 24/7 thông qua chat trực tuyến hoặc email, đảm bảo mọi thắc mắc được giải đáp kịp thời.</p>
      <p>Hệ thống đánh giá sau mỗi đơn hàng cũng giúp khách hàng chia sẻ trải nghiệm và giúp cải thiện chất lượng dịch vụ.</p>
    `,
    date: '2025-04-10'
  },
  {
    id: '4',
    image: 'https://greenzone.motcaiweb.io.vn/uploads/65c9de10-8bf8-4de1-a35f-bbad6b2e5850.png',
    title: 'Tối ưu vận hành cho cửa hàng và nhân viên giao hàng',
    content: `GreenZone không chỉ là công cụ bán hàng, mà còn là trợ thủ đắc lực giúp các cửa hàng vận hành mượt mà và đội ngũ giao hàng hoạt động hiệu quả. Hệ thống cập nhật trạng thái đơn hàng theo thời gian thực, hỗ trợ bản đồ dẫn đường thông minh, nâng cao trải nghiệm cho cả người bán và người giao.`,
    html: `
      <h1>Tối ưu vận hành cho cửa hàng và nhân viên giao hàng</h1>
      <p>GreenZone mang đến giải pháp toàn diện giúp các cửa hàng vận hành chuyên nghiệp và hiệu quả hơn bao giờ hết. Mỗi đơn hàng đều được quản lý tự động, từ khi tạo đến lúc giao thành công, giảm thiểu sai sót, tiết kiệm thời gian và nâng cao độ hài lòng từ phía khách hàng.</p>
      <img src="https://greenzone.motcaiweb.io.vn/uploads/65c9de10-8bf8-4de1-a35f-bbad6b2e5850.png" alt="Quản lý hiệu quả"/>
      <h2>Quản lý thông minh cho cửa hàng</h2>
      <p>Chủ cửa hàng có thể dễ dàng theo dõi sản phẩm, đơn hàng, doanh thu và trạng thái giao hàng ngay trên ứng dụng. Hệ thống phân quyền rõ ràng, hỗ trợ thông báo tức thì và báo cáo trực quan, giúp nhà quản lý nắm bắt toàn bộ hoạt động kinh doanh chỉ trong vài thao tác.</p>
  
      <h2>Hỗ trợ tối đa cho nhân viên giao hàng</h2>
      <p>Nhân viên giao hàng – thành phần không thể thiếu trong chuỗi vận hành – được trang bị ứng dụng hiện đại cho phép theo dõi đơn hàng realtime, cập nhật trạng thái liên tục như “đang chuẩn bị”, “đang giao hàng”, hay “đã giao thành công”.</p>
      <p>Hệ thống còn tích hợp bản đồ định vị GPS thông minh, hỗ trợ chỉ đường tối ưu và chính xác, giúp nhân viên di chuyển thuận lợi, tiết kiệm thời gian, tránh thất lạc đơn và nâng cao hiệu suất làm việc.</p>
  
     
  
      <p>GreenZone không chỉ giúp cửa hàng phát triển bền vững, mà còn hỗ trợ đội ngũ nhân viên giao hàng trở thành cánh tay nối dài hiệu quả, chuyên nghiệp và đáng tin cậy của doanh nghiệp.</p>
    `,
    date: '2025-04-15'
  }


];








const styles = StyleSheet.create({
  itemContainer: {
    width: width / 2,
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingBottom: 10
  },
  contentContaner: {
    paddingHorizontal: 8,

  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  headerTitle: {
    fontWeight: '500',
    fontSize: 16,
    color: colors.black
  },
  articleTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
    color: colors.black,
  },
  content: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    lineHeight: 20
  },
  date: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    color: colors.brown700,
  },
});


