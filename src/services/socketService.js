import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  initialize(token) {
    if (!this.socket) {
      this.socket = io("https://greenzone.motcaiweb.io.vn", {
        path: "/socket.io/",
        transports: ["websocket"],
        auth: { token }, 
      });

      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket.id);
      });

      this.socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

    }
  }

  joinOrder(orderId) {
    if (this.socket) {
      this.socket.emit("order.join", orderId);
      console.log(`Joined order ${orderId}`);
    }
  }

  onOrderUpdateStatus(callback) {
    if (this.socket) {
      this.socket.on("order.updateStatus", (data) => {
        console.log("Order status updated:", data);
        callback?.(data);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
