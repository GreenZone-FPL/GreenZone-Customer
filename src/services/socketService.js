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

  joinOrder(orderId) {
    if (this.socket) {
      this.socket.emit("order.join", orderId);
      console.log(`Đã tham gia order ${orderId}`);
    }
  }

  onOrderUpdateStatus(callback) {
    if (this.socket) {
      this.socket.on("order.updateStatus", (data) => {
        console.log("Trạng thái đơn hàng cập nhật:", data);
        callback?.(data);
      });
    }
  }

  offOrderUpdateStatus(callback) {
    if (this.socket) {
      this.socket.off("order.updateStatus", callback);
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }

  // Emit event khi cập nhật trạng thái đơn hàng
  updateOrderStatus(orderId, status) {
    if (this.socket) {
      this.socket.emit("order.updateStatus", { orderId, status });
      console.log(`Đã emit event cập nhật trạng thái đơn hàng: ${orderId}, Status: ${status}`);
    }
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
