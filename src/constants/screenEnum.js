

const screens = {
    // auth
    SplashScreen: 'SplashScreen',
    LoginScreen: 'LoginScreen',
    MainScreen: 'MainScreen',
    ProductDetail: 'ProductDetail',
    UpdateProfileScreen: 'UpdateProfileScreen',

    // bottom_navs_screen
    HomeScreen: 'HomeScreen',
    OrderScreen: 'OrderScreen',
    MerchantScreen: 'MerchantScreen',
    VoucherScreen: 'VoucherScreen',
    ProfileScreen: 'ProfileScreen',


     // bottom_navs_stack
     HomeStackScreen: 'HomeStackScreen',
     OrderStackScreen: 'OrderStackScreen',
     MerchantStackScreen: 'MerchantStackScreen',
     VoucherStackScreen: 'VoucherStackScreen',
     ProfileStackScreen: 'ProfileStackScreen'







}

const ScreenEnum = Object.freeze({
    ...screens
});

export default ScreenEnum;