import React from 'react';
import Image from 'next/image';
import BeliItem from './BeliItem';
import { IItemData } from '../../pages';
import { TambahItemProps } from './TambahItem';

interface ItemCardProps extends TambahItemProps {
  item: IItemData;
}

export default function ItemCard({
  item,
  toggleRefetch,
  setItems,
}: ItemCardProps): JSX.Element {
  const [status, setStatus] = React.useState<string>('loading');
  const {
    item_id,
    item_name,
    item_description,
    item_price,
    item_created_at,
    item_img,
    item_img_ref,
  } = item;

  return (
    <div className='bg-white flex flex-col max-w-xs p-5 rounded-md shadow w-[20rem]'>
      <div className='h-40 mb-3 overflow-hidden relative rounded'>
        <Image
          src={item_img}
          alt='item'
          layout='fill'
          objectFit='cover'
          quality={50}
          className={status === 'loading' ? 'animate-pulse bg-slate-100' : ''}
          onLoadingComplete={() => setStatus('complete')}
        />
        <h3 className='absolute bg-purple-100 font-semibold px-2.5 py-0.5 right-2 rounded text-purple-800 top-2'>
          Rp.{item_price}
        </h3>
      </div>
      <h4>{item_name}</h4>
      <p className='text-gray-500'>{item_description}</p>
      <div className='flex grow items-end justify-between mt-3'>
        <div>
          <p className='text-gray-500 text-xs'>
            Ditambahkan{' '}
            {item_created_at.toDate().toLocaleString('ID-id', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <BeliItem
          toggleRefetch={toggleRefetch}
          setItems={setItems}
          item_id={item_id}
          item_name={item_name}
          item_price={item_price}
          item_img_ref={item_img_ref}
        />
      </div>
    </div>
  );
}
