
import { AppGraph } from "./appGraph";

// Graph chứa các màn hình cho Authentication
// Splash, Login, ChangePassword, OTP,...
export const AuthGraph = Object.freeze({
    graphName: AppGraph.AUTHENTICATION,

    SendOTPScreen: 'SendOTPScreen',
    VerifyOTPScreen: 'VerifyOTPScreen',
    SplashScreen: 'SplashScreen',
    SplashScreen2: 'SplashScreen2',
    LoginScreen: 'LoginScreen',
    RegisterScreen: 'RegisterScreen',

});