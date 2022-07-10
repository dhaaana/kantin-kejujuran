import type { NextPage } from 'next';
import React from 'react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import TambahItem from '../components/store/TambahItem';
import ItemCard from '../components/store/ItemCard';
import Layout from '../components/utilities/Layout';

export interface IItemData {
  item_id: string;
  item_name: string;
  item_description: string;
  item_price: number;
  item_img: string;
  item_img_ref: string;
  item_created_at: Timestamp;
}

const Home: NextPage = () => {
  const [items, setItems] = React.useState<IItemData[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [fetchToggle, setFetchToggle] = React.useState<boolean>(true);

  const getAllItem = async () => {
    setIsLoading(true);
    const querySnapshot = await getDocs(collection(db, 'items'));
    querySnapshot.forEach((doc) => {
      setItems((prev) => {
        const arr = [...prev];
        const newItem = { ...doc.data(), item_id: doc.id };
        if (!arr.some((data) => data.item_id === doc.id)) {
          arr.push(newItem as IItemData);
        }
        return arr;
      });
    });
    setIsLoading(false);
  };

  const toggleRefetch = () => {
    setFetchToggle((prev) => !prev);
  };

  React.useEffect(() => {
    getAllItem();
  }, [fetchToggle]);

  return (
    <>
      <Layout title='Store' isLoading={isLoading}>
        <div className='flex justify-between mt-7 px-10 w-full'>
          <div className='w-1/2'>
            <h4>Store</h4>
          </div>
          <div className='text-end w-1/2'>
            <TambahItem toggleRefetch={toggleRefetch} setItems={setItems} />
          </div>
        </div>
        <div className='min-h-[20rem] my-3 w-full'>
          <div className='flex flex-wrap gap-3 justify-center'>
            {isLoading ? (
              [0, 1, 2].map((i) => {
                return (
                  <span
                    key={i}
                    className='animate-pulse bg-gradient-to-b from-slate-200 h-60 rounded-md to-purple-50 w-80'
                  ></span>
                );
              })
            ) : items.length === 0 ? (
              <p className='mt-5 text-slate-700'>
                Tidak ada item, tekan{' '}
                <span className='font-semibold'>Tambah Item</span> untuk
                menambahkan
              </p>
            ) : (
              items.map((item, i) => {
                return (
                  <ItemCard
                    key={i}
                    item={item}
                    toggleRefetch={toggleRefetch}
                    setItems={setItems}
                  />
                );
              })
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
