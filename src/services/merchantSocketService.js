import { io } from "socket.io-client";
import { AppAsyncStorage } from "../utils";


class MerchantSocketService {
  constructor() {
    this.socket = null;
  }

  // Khởi tạo kết nối socket
  async initialize() {
    if (!this.socket) {
      try {
        const token = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.accessToken);
        const storeId = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.storeId); // Lấy storeId từ AsyncStorage
        const role = await AppAsyncStorage.readData('role')


        if (!token || !storeId) {
          console.log("Không tìm thấy token hoặc storeId, không thể kết nối socket!");
          return;
        }

        this.socket = io("https://greenzone.motcaiweb.io.vn", {
          path: "/socket.io/",
          transports: ["websocket"],
          auth: { token },
        });

        this.socket.on("connect", () => {
          console.log("Connected socketId =", this.socket.id);

          if (role === 'merchant') {
            this.socket.emit('store.join', storeId);
            console.log(`Merchant joined store room: ${storeId}`);
          }
        });



        this.socket.on("disconnect", () => {
          console.log("Socket disconnected");
        });


        this.socket.on('order.new', (data) => {
          console.log('New Order:', data);
        });


        this.socket.on("order.updateStatus", (data) => {
          console.log("Trạng thái đơn hàng cập nhật:", data);
          // Xử lý cập nhật trạng thái đơn hàng
          // Bạn có thể gọi một callback hoặc cập nhật state ở đây
        });

      } catch (error) {
        console.log("Lỗi khi khởi tạo socket:", error);
      }
    }
  }

  updateOrderStatus(newOrder) {
    if (this.socket) {
      this.socket.emit('order.updateStatus', newOrder)
      console.log('Order update status', newOrder)
    }
  }

  assignOrder(order) {
    if (this.socket) {
      this.socket.emit('order.assigned', order)
      console.log('Order assigned', order)
    }
  }

  // Kiểm tra kết nối socket
  isConnected() {
    return this.socket && this.socket.connected;
  }

  // Ngắt kết nối socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket đã ngắt kết nối");
    }
  }
}

export default new MerchantSocketService();
