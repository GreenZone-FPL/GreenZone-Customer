import { NativeEventEmitter } from "react-native";

class EventBus extends NativeEventEmitter {
    constructor() {
        super();
    }
}

const eventBus = new EventBus();

export default eventBus;
