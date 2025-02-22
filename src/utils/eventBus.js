import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter"
export const EventBus  = new EventEmitter()
export const EVENT = Object.freeze({
    UPDATE_CART: 'UPDATE_CART'
})