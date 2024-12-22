/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useState, useEffect, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { ICategory, IDaybook } from '../../types';

const UpdateDaybook = ({
  selectedDaybook,
  setSelectedDaybook,
  setIsUpdateDaybook,
  setRefreshState,
}: {
  selectedDaybook: any;
  setSelectedDaybook: any;
  setIsUpdateDaybook: any;
  setRefreshState: any;
}) => {
  const [incomeCategories, setIncomeCategories] = useState<ICategory[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    (async () => {
      const allCategories =
        (await window.electron.getAllCategories()) as ICategory[];
      const filteredIncomeCategories = allCategories.filter(
        (category) => category.type === 'INCOME',
      );
      const filteredExpenseCategories = allCategories.filter(
        (category) => category.type === 'EXPENSE',
      );
      setIncomeCategories(filteredIncomeCategories);
      setExpenseCategories(filteredExpenseCategories);
    })();
  }, []);

  const handleUpdateDaybook = async (e: FormEvent) => {
    e.preventDefault();
    await window.electron.updateDaybook(selectedDaybook as IDaybook);
    toast('Transaction Updated Successfully', {
      type: 'success',
    });
    setRefreshState((prev: any) => !prev);
    setSelectedDaybook(undefined);
    setIsUpdateDaybook(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-transform duration-500 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/12 transform transition-transform duration-500 ease-in-out">
        <h2 className="text-xl font-semibold mb-4">Update Daybook Entry</h2>

        <form onSubmit={handleUpdateDaybook}>
          {/* Amount */}
          <div className="flex items-center space-x-2 mb-4">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Amount:
            </label>
            <input
              id="amount"
              type="number"
              min={0}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={selectedDaybook.amount}
              onChange={(e) => {
                const clone = { ...selectedDaybook };
                clone.amount = +e.target.value;
                setSelectedDaybook(clone);
              }}
            />
          </div>

          {/* Date */}
          <div className="flex items-center space-x-2 mb-4">
            <label
              htmlFor="date"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Date:
            </label>
            <input
              id="date"
              type="date"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={selectedDaybook.date}
              onChange={(e) => {
                const clone = { ...selectedDaybook };
                clone.date = e.target.value;
                setSelectedDaybook(clone);
              }}
            />
          </div>

          {/* Category */}
          <div className="flex items-center space-x-2 mb-4">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Category:
            </label>
            <select
              id="category"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={selectedDaybook.categoryId}
              onChange={(e) => {
                const clone = { ...selectedDaybook };
                clone.categoryId = +e.target.value;
                setSelectedDaybook(clone);
              }}
            >
              {selectedDaybook.type === 'EXPENSE'
                ? expenseCategories.map((cate) => (
                    <option key={cate.id} value={cate.id}>
                      {cate.name}
                    </option>
                  ))
                : incomeCategories.map((cate) => (
                    <option key={cate.id} value={cate.id}>
                      {cate.name}
                    </option>
                  ))}
            </select>
          </div>

          {/* Details */}
          <div className="flex items-center space-x-2 mb-4">
            <label
              htmlFor="details"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Details:
            </label>
            <input
              id="details"
              type="text"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={selectedDaybook.details}
              onChange={(e) => {
                const clone = { ...selectedDaybook };
                clone.details = e.target.value;
                setSelectedDaybook(clone);
              }}
            />
          </div>

          {/* Modal Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-3"
              onClick={() => {
                setIsUpdateDaybook(false);
                setSelectedDaybook(undefined);
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

export default UpdateDaybook;
