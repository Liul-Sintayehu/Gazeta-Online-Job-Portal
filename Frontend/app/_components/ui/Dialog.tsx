import React from 'react';

interface ModalProps {
  children?: React.ReactNode;
  title?: string;
  isModalOpen: boolean;
  toggleModal: () => void;
}

const Dialog: React.FC<ModalProps> = ({ children, isModalOpen, toggleModal , title}) => {
  return (
    <>
      <button
        onClick={toggleModal}
        className="open-modal-button"
        type="button"
      >
        Open Modal
      </button>

      {isModalOpen && (
        <div className="flex justify-center items-center h-screen">
        <div className="w-1/2 p-4">

        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sign in to our platform
              </h3>
              {/* <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button> */}
                </div>

              {children}
            </div>
          </div>
        </div>
        </div>
      )}
    </>
  );
};

export default Dialog;
