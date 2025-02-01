import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter'
import EventTypes from '@mobilestructure/constants/EventTypes'

const eventEmitter = new EventEmitter()

export default class EventListener {
	static instance = null

	static getInstance() {
		if (EventListener.instance == null) {
			EventListener.instance = new EventListener()
		}
		return EventListener.instance
	}

	constructor() {
		this.addListener = (eventType, listener) => {
			eventEmitter.addListener(eventType, listener)
		}

		this.logInEvent = (user) => eventEmitter.emit(EventTypes.LOGIN_EVENT, user)
		this.openModal = (isModal)=>{
			eventEmitter.emit("modalVisible" , isModal)
		}
		this.logOut = () => eventEmitter.emit("LOGOUT_EVENT")
		this.notification = () => eventEmitter.emit("NOTIFICATION_EVENT")


	}

}
