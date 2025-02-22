import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter"
export const EventBus  = new EventEmitter()
export const EVENT = Object.freeze({
    ADD_TO_CART: 'ADD_TO_CART',
    UPDATE_CART: 'UPDATE_CART',
    DELETE_ITEM: 'DELETE_ITEM',
    CLEAR_CART: 'CLEAR_CART'
})