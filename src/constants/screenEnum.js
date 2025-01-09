const screens = {
  MainNavigation: 'MainNavigation',
  // auth
  SplashScreen: 'SplashScreen',
  LoginScreen: 'LoginScreen',
  MainScreen: 'MainScreen',
  ProductDetail: 'ProductDetail',

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

  // ProfileScreen
  ProfileStackScreen: 'ProfileStackScreen',
  UpdateProfileScreen: 'UpdateProfileScreen',

  ProductDetailSheet: 'ProductDetailSheet',


  // Cart, Order
  CheckoutScreen: 'CheckoutScreen',
  OrderHistoryScreen: 'OrderHistoryScreen'
  
};

const ScreenEnum = Object.freeze({
  ...screens,
});

export default ScreenEnum;
