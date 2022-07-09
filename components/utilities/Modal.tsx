import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

interface ModalPropsInterface {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType | undefined;
}

function ModalComponent({ isOpen, setIsOpen, children, className = "", as }: ModalPropsInterface): JSX.Element {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog className="relative z-20" onClose={() => setIsOpen(false)}>
        <Transition.Child as={Fragment} enter="transition-opacity ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition duration-300"
          enterFrom="-translate-y-10 opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transition duration-300"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="-translate-y-10 opacity-0"
        >
          <div className="fixed inset-0 overflow-y-auto py-8">
            <div className="flex min-h-full w-full items-center justify-center overflow-auto">
              <Dialog.Panel className={`w-11/12 max-w-2xl rounded-2xl bg-white p-4 ${className}`} as={as}>
                {children}
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export const Modal = Object.assign(ModalComponent, {
  Title: Dialog.Title,
  Description: Dialog.Description,
});
