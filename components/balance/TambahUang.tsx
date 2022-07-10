import React, { SetStateAction } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Modal } from '../../components/utilities/Modal';
import Spinner from '../utilities/Spinner';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export interface TambahUangProps {
  balance: number;
  setBalance: React.Dispatch<SetStateAction<{ balance: number }>>;
}

interface IFormUang {
  amount: string;
}

export default function TambahUang({
  balance,
  setBalance,
}: TambahUangProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [tempAmount, setTempAmount] = React.useState<number>(0);

  const methods = useForm<IFormUang>({
    defaultValues: {
      amount: '',
    },
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    const newAmount = { balance: balance + parseInt(data.amount) };
    const docRef = doc(db, 'balance', 'balance');
    setDoc(docRef, newAmount)
      .then(() => {
        setBalance(newAmount);
        setTempAmount(0);
        setIsOpen(false);
        toast.success('Saldo berhasil ditambah');
      })
      .catch((err) => {
        toast.error(`Error: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  });

  return (
    <>
      <button
        className='bg-green-600 font-medium px-7 py-2.5 rounded-md text-sm text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 active:animate-wiggle'
        onClick={() => {
          reset({
            amount: '',
          });
          setTempAmount(0);
          setIsOpen(true);
        }}
      >
        Tambah
      </button>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <header className='flex items-center'>
              <Modal.Title as='h3'>Tambah Uang</Modal.Title>
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

            <main className='flex flex-col gap-4 mt-4 sm:flex-row'>
              <div className='flex flex-col gap-2.5 w-full sm:w-1/2'>
                <label
                  htmlFor='amount'
                  className='block font-medium text-gray-900 text-sm'
                >
                  Uang yang Ditambah
                </label>
                <div className='flex'>
                  <span className='bg-gray-200 border border-gray-300 border-r-0 inline-flex items-center px-3 rounded-l-lg text-gray-900 text-sm dark:bg-gray-600 dark:border-gray-600 dark:text-gray-400'>
                    Rp.
                  </span>
                  <input
                    {...register('amount', {
                      required: 'Uang yang ditambah wajib diisi',
                      min: { value: 0, message: 'Tidak boleh kurang dari 0' },
                      onChange: (e) => setTempAmount(e.target.value || 0),
                    })}
                    id='item_price'
                    type='number'
                    className='bg-gray-50 block border border-gray-300 outline-none p-2.5 rounded-r-lg text-gray-900 text-sm transition-all w-full focus:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300'
                    onKeyDown={(e) => {
                      if (['.', '-', 'e'].includes(e.key)) e.preventDefault();
                    }}
                  />
                </div>
                {errors.amount?.message && (
                  <span className='text-red-600 text-xs'>
                    {errors.amount.message}
                  </span>
                )}
              </div>
              <div className='flex flex-col gap-2.5 w-full sm:w-1/2'>
                <p className='block font-medium text-gray-900 text-sm'>
                  Saldo Setelah Uang Ditambah
                </p>
                <div className='flex'>
                  <span className='bg-gray-200 border border-gray-300 border-r-0 inline-flex items-center px-3 rounded-l-lg text-gray-900 text-sm dark:bg-gray-600 dark:border-gray-600 dark:text-gray-400'>
                    Rp.
                  </span>
                  <span className='bg-gray-100 block border border-gray-300 cursor-not-allowed outline-none px-3 py-2.5 rounded-r-lg text-gray-900 text-sm w-full'>
                    {balance + parseInt(tempAmount.toString())}
                  </span>
                </div>
              </div>
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
