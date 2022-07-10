import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface IToastProps {
  isLoading?: boolean;
}

export default function Toast({ isLoading }: IToastProps) {
  React.useEffect(() => {
    if (isLoading !== undefined) {
      if (isLoading === true) {
        toast.loading('Loading...');
        return;
      }
      toast.dismiss();
    }
  }, [isLoading]);

  return (
    <Toaster
      position='bottom-right'
      reverseOrder={false}
      gutter={8}
      containerClassName=''
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 5000,
        style: {
          background: '#fff',
          color: '#000',
          padding: '0.75rem',
        },
        // Default options for specific types
        success: {
          theme: {
            primary: 'green',
            secondary: 'white',
          },
        },
        error: {
          theme: {
            primary: 'red',
            secondary: 'white',
          },
        },
      }}
    />
  );
}
