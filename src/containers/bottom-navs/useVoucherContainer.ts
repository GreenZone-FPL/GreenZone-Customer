import {useEffect, useState} from 'react';
import {useAppContext} from '../../context/appContext';
import {AppAsyncStorage} from '../../utils';

export const useVoucherContainer = () => {
  const {authState} = useAppContext();
  const [user, setUser] = useState(null);

  useEffect((): void => {
    const getProfile = async (): Promise<void> => {
      try {
        const response = await AppAsyncStorage.readData(
          AppAsyncStorage.STORAGE_KEYS.user,
          null,
        );
        if (response) {
          setUser(response);
        }
      } catch (error) {
        console.log('Error', error);
      }
    };

    getProfile();
  }, []);
  return {authState, user};
};
