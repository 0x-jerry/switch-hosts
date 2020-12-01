import { EventEmitter } from 'events'

export const eventBus = new EventEmitter()

export enum EVENTS {
  UPDATE_TRAY_MENU = 'update-tray-menu'
}
