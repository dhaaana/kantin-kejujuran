import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Modal } from '../../components/utilities/Modal';
import Spinner from '../utilities/Spinner';
import { IItemData } from '../../pages/index';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage, db } from '../../lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import toast from 'react-hot-toast';

interface TambahItemProps {
  toggleRefetch: () => void;
}

interface IFormTambahItem
  extends Omit<IItemData, 'item_id' | 'item_img' | 'item_created_at'> {
  file: FileList;
}

type ITambahItemPayload = Omit<IItemData, 'item_id'>;

export default function TambahItem({
  toggleRefetch,
}: TambahItemProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const methods = useForm<IFormTambahItem>({
    defaultValues: {
      item_name: '',
      item_description: '',
      item_price: 0,
      file: undefined,
    },
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = methods;

  const handleFormat = (value: FileList) => {
    if (!value[0]) return;
    const file = value[0];
    if (!file.type.match(/image\/(png|jpg|jpeg)/i)) {
      return false;
    }
    return true;
  };

  const handleAddDoc = async (item: ITambahItemPayload) => {
    try {
      await addDoc(collection(db, 'items'), item);
      toast.success('Pengumuman ditambahkan');
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = handleSubmit(async ({ file, ...data }) => {
    setIsLoading(true);
    const item_img = file[0];
    const imageRef = ref(storage, `item_img/${item_img.name}-${uuidv4()}`);
    uploadBytes(imageRef, item_img)
      .then(() => {
        getDownloadURL(imageRef).then((item_img) => {
          handleAddDoc({
            ...data,
            item_img: item_img,
            item_created_at: serverTimestamp() as Timestamp,
          });
        });
      })
      .catch((error) => toast.error(`Error: ${error}`));
  });

  return (
    <>
      <button
        className='bg-purple-700 font-medium px-5 py-2.5 rounded-md text-sm text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 active:animate-wiggle'
        onClick={() => {
          reset({
            item_name: '',
            item_description: '',
            item_price: 0,
            file: undefined,
          });
          setIsOpen(true);
        }}
      >
        Tambah Item
      </button>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <header className='flex items-center'>
              <Modal.Title as='h3'>Tambah Item</Modal.Title>
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
              <label
                htmlFor='item_name'
                className='block font-medium text-gray-900 text-sm'
              >
                Nama Item
              </label>
              <input
                {...register('item_name', { required: true })}
                id='item_name'
                className='bg-gray-50 block border border-gray-300 outline-none p-2.5 rounded-lg text-gray-900 text-sm transition-all w-full focus:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300'
              />
              {errors.item_name && (
                <span className='text-red-600 text-xs'>
                  Nama item wajib diisi
                </span>
              )}
              <label
                htmlFor='item_description'
                className='block font-medium text-gray-900 text-sm'
              >
                Deskripsi Item
              </label>
              <input
                {...register('item_description', { required: true })}
                id='item_description'
                className='bg-gray-50 block border border-gray-300 outline-none p-2.5 rounded-lg text-gray-900 text-sm transition-all w-full focus:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300'
              />
              {errors.item_description && (
                <span className='text-red-600 text-xs'>
                  Deskripsi item wajib diisi
                </span>
              )}
              <label
                htmlFor='item_price'
                className='block font-medium text-gray-900 text-sm'
              >
                Harga Item
              </label>
              <div className='flex'>
                <span className='bg-gray-200 border border-gray-300 border-r-0 inline-flex items-center px-3 rounded-l-lg text-gray-900 text-sm dark:bg-gray-600 dark:border-gray-600 dark:text-gray-400'>
                  Rp.
                </span>
                <input
                  {...register('item_price', { required: true, min: 0 })}
                  id='item_price'
                  type='number'
                  className='bg-gray-50 block border border-gray-300 outline-none p-2.5 rounded-r-lg text-gray-900 text-sm transition-all w-full focus:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300'
                />
              </div>
              {errors.item_price?.type === 'required' && (
                <span className='text-red-600 text-xs'>
                  Harga item wajib diisi
                </span>
              )}
              {errors.item_price?.type === 'min' && (
                <span className='text-red-600 text-xs'>
                  Harga item harus di atas 0
                </span>
              )}
              <label
                htmlFor='file'
                className='block font-medium text-gray-900 text-sm'
              >
                Gambar Item
              </label>
              <input
                {...register('file', {
                  required: 'Gambar item wajib diisi',
                  validate: (value) =>
                    handleFormat(value) || 'Format file tidak didukung',
                })}
                className='bg-gray-50 block border border-gray-300 outline-none p-2.5 rounded-lg text-gray-900 text-sm transition-all w-full focus:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300'
                id='file'
                type='file'
                accept='.png, .jpg, .jpeg'
              ></input>
              {errors.file?.message && (
                <span className='text-red-600 text-xs'>
                  {errors.file?.message}
                </span>
              )}
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
                type='submit'
              >
                {isLoading ? <Spinner className='h-5 w-5' /> : 'Tambah'}
              </button>
            </footer>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
}
