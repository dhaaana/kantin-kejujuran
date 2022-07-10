import React, { SetStateAction } from 'react';
import { Modal } from '../utilities/Modal';
import Spinner from '../utilities/Spinner';
import toast from 'react-hot-toast';
import { IItemData } from '../../pages';
import { deleteDoc, doc } from 'firebase/firestore';
import { storage, db } from '../../lib/firebase';
import { ref, deleteObject } from 'firebase/storage';

interface BeliItemProps
  extends Omit<IItemData, 'item_img' | 'item_created_at' | 'item_description'> {
  setItems: React.Dispatch<SetStateAction<IItemData[]>>;
}

export default function TambahItem({
  setItems,
  item_name,
  item_price,
  item_id,
  item_img_ref,
}: BeliItemProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const deleteItem = async () => {
    setIsLoading(true);
    try {
      const imageRef = ref(storage, item_img_ref);
      const documentRef = doc(db, 'items', item_id);
      const document = deleteDoc(documentRef);
      const img = deleteObject(imageRef);
      Promise.all([document, img]);
      setItems((prev) => prev.filter((item) => item.item_id !== item_id));
      setIsOpen(false);
      toast.success('Item berhasil dibeli');
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className='bg-purple-700 font-medium px-5 py-1.5 rounded-md text-sm text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 active:animate-wiggle'
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Beli
      </button>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <header className='flex items-center'>
          <Modal.Title as='h3'>Beli Item</Modal.Title>
          <button
            className='aspect-square inline-flex items-center justify-center ml-auto p-0 rounded-lg w-10 hover:bg-slate-200 focus-visible:ring-primary/50 active:animate-wiggle'
            onClick={() => setIsOpen(false)}
            type='button'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </header>

        <main className='flex flex-col gap-2.5 mt-4'>
          Apakah anda yakin ingin membeli {item_name} dengan harga {item_price}
        </main>

        <footer className='flex gap-4 justify-end mt-4'>
          <button
            className='bg-purple-300 font-medium px-5 py-2.5 rounded-md text-purple-700 text-sm hover:bg-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-300 active:animate-wiggle'
            onClick={() => setIsOpen(false)}
            type='button'
          >
            Batal
          </button>
          <button
            className='bg-purple-700 font-medium px-5 py-2.5 rounded-md text-sm text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 active:animate-wiggle'
            type='button'
            onClick={deleteItem}
          >
            {isLoading ? <Spinner className='h-5 w-5' /> : 'Yakin'}
          </button>
        </footer>
      </Modal>
    </>
  );
}
