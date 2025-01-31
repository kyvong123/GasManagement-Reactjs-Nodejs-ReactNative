import {Dimensions, PixelRatio, Platform} from 'react-native'

const windowSize = Dimensions.get('window')

export default class DetectDeviceService {
	static instance = null

    static getInstance() {
    	if (DetectDeviceService.instance == null) {
    		DetectDeviceService.instance = new DetectDeviceService()
    	}
    	return DetectDeviceService.instance
    }

	constructor() {
		this.pixelDensity = PixelRatio.get()
		this.width = windowSize.width
		// alert(this.width)
		this.height = windowSize.height
		this.adjustedWidth = this.width * this.pixelDensity
		this.adjustedHeight = this.height * this.pixelDensity
		this.marginTopHeader = 0

		// HomeScreen
		this.marginBottomHomeDealItem = 0
		this.marginTopHomeCategoryList = 0
		this.marginTopHomeBody = 0
		this.paddingBottom = 0
		this.paddingBottomMap =0
		this.marginLeft =0
		this.marginTop =0
		this.detectPhone()
	}

	detectPhone() {
		// Iphone XS Max, XR 
		if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
			// Iphone XS Max, XR 
			if ((windowSize.height === 812 || windowSize.width === 812) || (windowSize.height === 896 || windowSize.width === 896)) {
				this.marginTopHeader =30
				this.marginBottomHomeDealItem = 15
				this.marginTopHomeCategoryList = -10
				this.marginTopHomeBody = 20
				this.paddingBottom = 0
				this.paddingBottomMap =80
			}
			// Iphone x
			if ((windowSize.height === 812 || windowSize.width === 812)) {
				this.marginTopHeader = 45
				this.marginTopHomeBody = 20
				this.paddingBottom = 0
				this.paddingBottomMap =80
			}
		}
		// Android
		if (Platform.OS === 'android') {
			this.marginTopHeader = 0
			this.marginTop = 5
			this.marginTopHomeCategoryList = 20
			if ((windowSize.height >= 732 || windowSize.width >= 732)) {
				this.marginTopHomeCategoryList = -10
			}
		}
		// IOS
		if(Platform.OS === 'ios'){
			this.marginLeft = 5
			this.marginTopHeader = 20
		}
	}
}