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

  async joinOrder2(orderId) {
    if (this.socket) {
      this.socket.emit("order.join", orderId, () => {
        console.log(`Đã tham gia order ${orderId}`);
      });
  
      // Lấy danh sách activeOrders
      let activeOrders = await AppAsyncStorage.getActiveOrders();
  
      // Tìm order cũ để lấy trạng thái trước khi update
      const existingOrder = activeOrders.find(order => order.order.data._id === orderId);
      const oldStatus = existingOrder ? existingOrder.order.data.status : "pendingConfirmation";
  
      // Lưu lại order nếu chưa có trong danh sách
      if (!existingOrder) {
        activeOrders.push({
          visible: true,
          oldStatus,
          order: { data: { _id: orderId, status: "processing" } },
        });
  
        await AppAsyncStorage.saveActiveOrders(activeOrders);
      }
  
      // Lưu callback vào RAM để xử lý sự kiện cập nhật 
      if (callback) {
        this.orderCallbacks.set(orderId, callback);
      }
  
      // Lắng nghe sự kiện cập nhật trạng thái đơn hàng
      this.socket.off("order.updateStatus").on("order.updateStatus", async (data) => {
        console.log("Trạng thái đơn hàng cập nhật:", data);
  
        // Lấy trạng thái cũ từ activeOrders
        const updatedOrder = activeOrders.find(order => order.order.data._id === data._id);
        const prevStatus = updatedOrder ? updatedOrder.order.data.status : "pendingConfirmation";
  
        // Cập nhật lại activeOrders trong AsyncStorage
        const newActiveOrders = activeOrders.map(order => 
          order.order.data._id === data._id 
            ? { ...order, oldStatus: prevStatus, order: { ...order.order, data: { ...order.order.data, status: data.status } } } 
            : order
        );
  
        await AppAsyncStorage.saveActiveOrders(newActiveOrders);
  
        // Gọi callback để cập nhật UI
        callback?.(data, prevStatus);
      });
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
