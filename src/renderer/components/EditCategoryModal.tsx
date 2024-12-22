/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { FormEvent } from 'react';
import { toast } from 'react-toastify';
import { ICategory } from '../../types';

const EditCategoryModal = ({
  selectedCategory,
  setSelectedCategory,
  setIsEditCategoryModalOpen,
  setRefreshState,
}: {
  selectedCategory: any;
  setSelectedCategory: any;
  setIsEditCategoryModalOpen: any;
  setRefreshState: any;
}) => {
  const handleUpdateCategory = async (e: FormEvent) => {
    e.preventDefault();
    await window.electron.updateCategory(selectedCategory as ICategory);
    toast('Category successfully updated', {
      type: 'success',
    });
    setIsEditCategoryModalOpen(false);
    setSelectedCategory(undefined);
    setRefreshState((prev: any) => !prev);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-transform duration-500 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/12 transform transition-transform duration-500 ease-in-out">
        <h2 className="text-xl font-semibold mb-4">Update Category</h2>

        <form onSubmit={handleUpdateCategory}>
          {/* Name */}
          <div className="flex items-center space-x-2 mb-4">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Name:
            </label>
            <input
              id="name"
              type="text"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={selectedCategory?.name}
              onChange={(e) => {
                const clone = { ...selectedCategory };
                clone.name = e.target.value;
                setSelectedCategory(clone as ICategory);
              }}
            />
          </div>

          {/* Modal Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-3"
              onClick={() => {
                setIsEditCategoryModalOpen(false);
                setSelectedCategory(undefined);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
