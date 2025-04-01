import {useNavigation} from '@react-navigation/native';
import {useAppContext} from '../../context/appContext';
import {useAppContainer} from '../useAppContainer';

export const useProfileContainer = () => {
  const {authDispatch, authState} = useAppContext();
  const {onNavigateLogin, onNavigateRegister} = useAppContainer();

  const navigation = useNavigation();

  return {};
};
