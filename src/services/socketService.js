import {io} from 'socket.io-client';
import {AppAsyncStorage} from '../utils';

class SocketService {
  constructor() {
    this.socket = null;
  }

  async initialize() {
    if (!this.socket) {
      try {
        const token = await AppAsyncStorage.readData(
          AppAsyncStorage.STORAGE_KEYS.accessToken,
        );
        if (!token) {
          console.log('Không tìm thấy token, không thể kết nối socket!');
          return;
        }

        this.socket = io('https://greenzone.motcaiweb.io.vn', {
          path: '/socket.io/',
          transports: ['websocket'],
          auth: {token},
        });

        this.socket.on('connect', () => {
          console.log('Connected socketId =', this.socket.id);
        });

        this.socket.on('disconnect', () => {
          console.log('Socket disconnected');
        });
      } catch (error) {
        console.log('Lỗi khi khởi tạo socket:', error);
      }
    }
  }

  async joinOrder2(orderId, status, callback) {
    try {
      // Nếu socket chưa khởi tạo, khởi tạo ngay
      if (!this.socket || !this.socket.connected) {
        // console.log("Socket chưa được khởi tạo, đang khởi tạo...");
        await this.initialize();
      }

      if (!this.socket) {
        // console.log("Không thể khởi tạo socket, thoát khỏi joinOrder2");
        return;
      }

      this.socket.emit('order.join', orderId, () => {
        // console.log(`Đã tham gia order ${orderId}`);
      });

      // Lấy danh sách activeOrders từ AsyncStorage
      let activeOrders = await AppAsyncStorage.getActiveOrders();

      // Tìm order cũ để lấy trạng thái trước khi update
      const existingOrder = activeOrders.find(
        order => order.orderId === orderId,
      );

      // Nếu chưa có trong danh sách thì thêm vào
      if (!existingOrder) {
        const newOrder = {
          visible: true,
          orderId,
          message: '',
          status: status,
        };

        activeOrders.push(newOrder);
        await AppAsyncStorage.storeData(
          AppAsyncStorage.STORAGE_KEYS.activeOrders,
          activeOrders,
        );
      }

      // Lắng nghe sự kiện cập nhật trạng thái đơn hàng
      this.socket.off('order.updateStatus'); // Đảm bảo không bị trùng listener
      this.socket.on('order.updateStatus', async data => {
        try {
          console.log('Trạng thái đơn hàng cập nhật:', data);

          // Lấy danh sách đơn hàng hiện tại từ AsyncStorage
          let currentActiveOrders = await AppAsyncStorage.getActiveOrders();

          // Cập nhật trạng thái đơn hàng
          const newActiveOrders = currentActiveOrders
            .map(order =>
              order.orderId === data.orderId
                ? {...order, message: data.message, status: data.status}
                : order,
            )
            .filter(
              order =>
                !['completed', 'cancelled', 'failedDelivery'].includes(
                  order.status,
                ),
            ); // Xóa đơn đã hoàn thành hoặc bị hủy

          await AppAsyncStorage.storeData(
            AppAsyncStorage.STORAGE_KEYS.activeOrders,
            newActiveOrders,
          );
          console.log(
            'Cập nhật newActiveOrders =',
            JSON.stringify(newActiveOrders, null, 2),
          );

          // Gọi callback để cập nhật UI
          if (callback) callback(data);
        } catch (error) {
          console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        }
      });
    } catch (error) {
      console.log('Lỗi trong joinOrder2:', error);
    }
  }

  async rejoinOrder(callback) {
    try {
      // Kiểm tra xem socket đã được khởi tạo chưa
      if (!this.socket || !this.socket.connected) {
        // console.log("Socket chưa được khởi tạo hoặc chưa kết nối!");
        await this.initialize();
      }

      // Lấy danh sách activeOrders từ AsyncStorage
      let activeOrders = await AppAsyncStorage.getActiveOrders();

      if (activeOrders && activeOrders.length > 0) {
        // Duyệt qua từng đơn hàng để tham gia lại
        for (const order of activeOrders) {
          // console.log(`Đang rejoin order với ID: ${order.orderId} và trạng thái: ${order.status}`); // Log ID và status

          // Gọi joinOrder2 cho mỗi đơn hàng, đồng thời gọi callback khi hoàn thành
          await this.joinOrder2(order.orderId, order.status, data => {
            // Gọi callback sau khi join order thành công
            if (callback) {
              callback(data); // Truyền dữ liệu về callback
            }
          });
        }
      }
    } catch (error) {
      console.log('Lỗi khi rejoin các đơn hàng:', error);
    }
  }

  joinOrder(orderId, callback) {
    if (this.socket) {
      this.socket.emit('order.join', orderId, () => {
        console.log(`Đã tham gia order ${orderId}`);
      });

      // Xóa listener cũ trước khi đăng ký mới
      this.socket.off('order.updateStatus');

      this.socket.on('order.updateStatus', data => {
        // Trạng thái đơn hàng cập nhật:
        // {"message": "🚀 Đơn hàng của bạn đang được chuẩn bị", "orderId": "67d43e500c8091ebd360ac6f", "status": "processing"}
        console.log('Trạng thái đơn hàng cập nhật:', data);
        callback?.(data);
      });
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket đã ngắt kết nối');
    }
  }
}

export default new SocketService();
