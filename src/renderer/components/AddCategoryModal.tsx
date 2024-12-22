/* eslint-disable prettier/prettier */
/* eslint-disable react/function-component-definition */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import ICategory from '../../types/ICategory';

const AddCategoryModal = ({
  setActiveTab,
  setIsModalOpen,
  setIsViewingCategoryShowing,
  setRefreshState,
}: {
  setIsModalOpen: any;
  setActiveTab: any;
  setIsViewingCategoryShowing: any;
  setRefreshState: any;
}) => {
  const [categoryInputData, setCategoryInputData] = useState<ICategory>({
    name: '',
    type: 'EXPENSE',
  });

  const handleModalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await window.electron.addCategory(categoryInputData);
    toast('New Category Successfully Added', {
      type: 'success',
    });
    setIsModalOpen(false);
    setCategoryInputData({
      name: '',
      type: 'EXPENSE',
    });
    setRefreshState((prev: any) => !prev);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-transform duration-500 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/12 transform transition-transform duration-500 ease-in-out">
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>

        {/* Modal Form */}
        <form onSubmit={handleModalSubmit}>
          {/* Type */}
          <div className="w-full flex mb-4">
            <span className="text-sm font-medium text-gray-700 w-1/3">
              Type:
            </span>
            <div className="flex items-center space-x-4 w-2/3 ml-2">
              <div className="flex items-center">
                <input
                  id="expenseModal"
                  name="type"
                  type="radio"
                  value="EXPENSE"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  required
                  checked={categoryInputData.type === 'EXPENSE'}
                  onChange={(e) => {
                    const clone = { ...categoryInputData };
                    clone.type = e.target.value as 'EXPENSE' | 'INCOME';
                    setCategoryInputData(clone);
                  }}
                />
                <label
                  htmlFor="expenseModal"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Expense
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="incomeModal"
                  name="type"
                  type="radio"
                  value="INCOME"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  required
                  onChange={(e) => {
                    const clone = { ...categoryInputData };
                    clone.type = e.target.value as 'EXPENSE' | 'INCOME';
                    setCategoryInputData(clone);
                  }}
                />
                <label
                  htmlFor="incomeModal"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Income
                </label>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="flex items-center space-x-2 mt-4 w-full">
            <label
              htmlFor="categoryName"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Name:
            </label>
            <input
              id="categoryName"
              type="text"
              placeholder="Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-2/3 ml-2"
              required
              value={categoryInputData.name}
              onChange={(e) => {
                const clone = { ...categoryInputData };
                clone.name = e.target.value;
                setCategoryInputData(clone);
              }}
            />
          </div>

          {/* Modal Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-3"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ml-2"
              onClick={() => {
                setIsViewingCategoryShowing(true);
                setIsModalOpen(false);
                setActiveTab('');
              }}
            >
              View Categories
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
