import { io } from "socket.io-client";
import { AppAsyncStorage } from "../utils";

class SocketService {
  constructor() {
    this.socket = null;
  }

  async initialize() {
    if (!this.socket) {
      try {
        const token = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.accessToken);
        if (!token) {
          console.log("Không tìm thấy token, không thể kết nối socket!");
          return;
        }

        this.socket = io("https://greenzone.motcaiweb.io.vn", {
          path: "/socket.io/",
          transports: ["websocket"],
          auth: { token },
        });

        this.socket.on("connect", () => {
          console.log("Connected socketId =", this.socket.id);
        });

        this.socket.on("disconnect", () => {
          console.log("Socket disconnected");
        });


      } catch (error) {
        console.log("Lỗi khi khởi tạo socket:", error);
      }
    }
  }

  async joinOrder2(orderId, status, callback) {
    try {
      if (!this.socket) throw new Error("Socket chưa được khởi tạo");

      this.socket.emit("order.join", orderId, () => {
        console.log(`Đã tham gia order ${orderId}`);
      });

      // Lấy danh sách activeOrders từ AsyncStorage
      let activeOrders = await AppAsyncStorage.getActiveOrders();

      // Tìm order cũ để lấy trạng thái trước khi update
      const existingOrder = activeOrders.find(order => order.orderId === orderId);

      // Nếu chưa có trong danh sách thì thêm vào
      if (!existingOrder) {
        const newOrder = {
          visible: true,
          orderId,
          oldStatus: status,
          message: "",
          status: status
        };

        activeOrders.push(newOrder);
        await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.activeOrders, activeOrders);
      }

      // // Xóa các listener cũ trước khi thêm listener mới
      // this.socket.off("order.updateStatus");

      // Lắng nghe sự kiện cập nhật trạng thái đơn hàng
      this.socket.on("order.updateStatus", async (data) => {
        try {
          console.log("Trạng thái đơn hàng cập nhật:", data);

          // Lấy trạng thái cũ từ AsyncStorage
          let currentActiveOrders = await AppAsyncStorage.getActiveOrders();

          // Cập nhật trạng thái mới cho đơn hàng
          const newActiveOrders = currentActiveOrders.map(order =>
            order.orderId === data.orderId
              ? {
                ...order,
                oldStatus: order.status, // Lưu trạng thái cũ trước khi cập nhật
                message: data.message,
                status: data.status
              }
              : order
          );

          await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.activeOrders, newActiveOrders);
          console.log('Cập nhật newActiveOrders =', JSON.stringify(newActiveOrders, null, 2));

          // Gọi callback để cập nhật UI
          if (callback) callback(data);
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        }
      });

    } catch (error) {
      console.error("Lỗi trong joinOrder2:", error);
    }
  }






  joinOrder(orderId, callback) {
    if (this.socket) {
      this.socket.emit("order.join", orderId, () => {
        console.log(`Đã tham gia order ${orderId}`);
      });

      // Xóa listener cũ trước khi đăng ký mới
      this.socket.off("order.updateStatus");

      this.socket.on("order.updateStatus", (data) => {
        // Trạng thái đơn hàng cập nhật: 
        // {"message": "🚀 Đơn hàng của bạn đang được chuẩn bị", "orderId": "67d43e500c8091ebd360ac6f", "status": "processing"}
        console.log("Trạng thái đơn hàng cập nhật:", data);
        callback?.(data);
      });
    }
  }

  saveOr



  isConnected() {
    return this.socket && this.socket.connected;
  }


  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket đã ngắt kết nối");
    }
  }
}

export default new SocketService();
