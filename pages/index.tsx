import type { NextPage } from 'next';
import React from 'react';
import {
  collection,
  getDocs,
  orderBy,
  OrderByDirection,
  query,
  Timestamp,
} from 'firebase/firestore';
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

  const sortItem = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '0') {
      setItems([]);
      getAllItem();
      return;
    }
    setIsLoading(true);
    setItems([]);
    const param = e.target.value.split('-');
    const q = query(
      collection(db, 'items'),
      orderBy(param[0], param[1] as OrderByDirection)
    );
    const querySnapshot = await getDocs(q);
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

  React.useEffect(() => {
    getAllItem();
  }, []);

  return (
    <>
      <Layout title='Store' isLoading={isLoading}>
        <div className='flex justify-between mt-7 px-10 w-full'>
          <div className='w-1/2'>
            <h4>Store</h4>
          </div>
          <div className='flex gap-2 items-center justify-end w-1/2'>
            <p className='font-semibold text-purple-700 text-xs'>Sort By</p>
            <select
              name='sort'
              id='sort'
              className='bg-gray-50 block border border-gray-300 outline-none p-2.5 rounded-lg text-gray-900 text-sm transition-all w-1/4 focus:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300'
              onChange={(e) => sortItem(e)}
            >
              <option value='0'>No Sort</option>
              <option value='item_name-asc'>Name A-Z</option>
              <option value='item_name-desc'>Name Z-A</option>
              <option value='item_created_at-asc'>Latest Created Time</option>
              <option value='item_created_at-desc'>Oldest Created Time</option>
            </select>
            <TambahItem setItems={setItems} />
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
                return <ItemCard key={i} item={item} setItems={setItems} />;
              })
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
