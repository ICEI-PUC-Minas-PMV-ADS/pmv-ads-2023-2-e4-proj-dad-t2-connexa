import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';

type ToastType = 'error' | 'success';

type MyToastProps = {
  type: ToastType;
  message: string;
};

const MyToast: React.FC<MyToastProps> = ({ type, message }) => {
  useEffect(() => {
    Toast.show({
      type,
      text1: type === 'error' ? 'Erro' : 'Sucesso',
      text2: message,
    });
  }, []); 

  return null;
};

export default MyToast;
