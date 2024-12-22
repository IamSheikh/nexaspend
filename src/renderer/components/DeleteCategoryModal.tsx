/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { toast } from 'react-toastify';

const DeleteCategoryModal = ({
  selectedCategory,
  setIsDeleteCategoryModalOpen,
  setSelectedCategory,
  setRefreshState,
}: {
  selectedCategory: any;
  setIsDeleteCategoryModalOpen: any;
  setSelectedCategory: any;
  setRefreshState: any;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-6">Are you sure you want to delete this category?</p>
        <div className="flex justify-end mt-2">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg mr-2"
            onClick={() => {
              setIsDeleteCategoryModalOpen(false);
              setSelectedCategory(undefined);
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={async () => {
              await window.electron.deleteCategory(
                selectedCategory?.id as number,
              );
              toast('Category Successfully deleted', {
                type: 'error',
              });
              setIsDeleteCategoryModalOpen(false);
              setSelectedCategory(undefined);
              setRefreshState((prev: any) => !prev);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
