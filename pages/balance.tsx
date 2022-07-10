import { doc, getDoc } from 'firebase/firestore';
import { NextPage } from 'next';
import React from 'react';
import AmbilUang from '../components/balance/AmbilUang';
import TambahUang from '../components/balance/TambahUang';
import Layout from '../components/utilities/Layout';
import { db } from '../lib/firebase';

const Balance: NextPage = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [balance, setBalance] = React.useState<{ balance: number }>({
    balance: 0,
  });

  const getBalance = async () => {
    setIsLoading(true);
    const docRef = doc(db, 'balance', 'balance');
    getDoc(docRef).then((data) => {
      setBalance(data.data() as { balance: number });
      setIsLoading(false);
    });
  };

  React.useEffect(() => {
    getBalance();
  }, []);

  return (
    <>
      <Layout title='Balance Box' isLoading={isLoading}>
        <div className='mt-7 px-10 w-full'>
          <h4>Balance Box</h4>
        </div>
        <div className='min-h-[20rem] my-3 px-10 w-full'>
          <div className='bg-white flex flex-col gap-y-4 items-center p-5 px-10 rounded-md shadow w-full sm:flex-row sm:justify-between'>
            <div className='text-center sm:text-start'>
              <p>Balance:</p>
              <h1>Rp. {balance.balance}</h1>
            </div>
            <div className='flex gap-4'>
              <AmbilUang balance={balance.balance} setBalance={setBalance} />
              <TambahUang balance={balance.balance} setBalance={setBalance} />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Balance;
