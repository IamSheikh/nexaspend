/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useState, useEffect, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { IAccount, ICategory, IDaybook } from '../../types';

const UpdateDaybook = ({
  selectedDaybook,
  setSelectedDaybook,
  setIsUpdateDaybook,
  setRefreshState,
  setIsDeleteTransactionModalOpen,
}: {
  selectedDaybook: any;
  setSelectedDaybook: any;
  setIsUpdateDaybook: any;
  setRefreshState: any;
  setIsDeleteTransactionModalOpen: any;
}) => {
  const [incomeCategories, setIncomeCategories] = useState<ICategory[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ICategory[]>([]);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const originalAccount = selectedDaybook.accountId;

  useEffect(() => {
    (async () => {
      const allAccounts =
        (await window.electron.getAllAccounts()) as IAccount[];
      setAccounts(allAccounts);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const allCategories = (await window.electron.getAllCategories(
        // @ts-ignore
        selectedDaybook.accountId,
      )) as ICategory[];
      const filteredIncomeCategories = allCategories.filter(
        (category) => category.type === 'INCOME',
      );
      const filteredExpenseCategories = allCategories.filter(
        (category) => category.type === 'EXPENSE',
      );
      setIncomeCategories(filteredIncomeCategories);
      setExpenseCategories(filteredExpenseCategories);

      if (selectedDaybook.accountId !== originalAccount) {
        const clone = { ...selectedDaybook };
        clone.categoryId = filteredExpenseCategories[0].id;
        setSelectedDaybook(clone);
      }
    })();
  }, [selectedDaybook.accountId]);

  useEffect(() => {
    console.log(selectedDaybook.categoryId);
  }, [selectedDaybook.categoryId]);

  const handleUpdateDaybook = async (e: FormEvent) => {
    e.preventDefault();
    if (isInputDisabled) {
      setIsInputDisabled((prev) => !prev);
    } else {
      console.log(selectedDaybook);
      await window.electron.updateDaybook(selectedDaybook as IDaybook);
      toast('Transaction Updated Successfully', {
        type: 'success',
      });
      setRefreshState((prev: any) => !prev);
      setSelectedDaybook(undefined);
      setIsUpdateDaybook(false);
      setIsInputDisabled((prev) => !prev);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-transform duration-500 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/12 transform transition-transform duration-500 ease-in-out">
        <h2 className="text-xl font-semibold mb-4">Update Entry</h2>

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
              disabled={isInputDisabled}
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
              disabled={isInputDisabled}
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
              disabled={isInputDisabled}
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

          <div className="flex items-center space-x-2 mb-4">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Account:
            </label>
            <select
              id="category"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              disabled={isInputDisabled}
              value={selectedDaybook.accountId}
              onChange={(e) => {
                const clone = { ...selectedDaybook };
                clone.accountId = +e.target.value;
                setSelectedDaybook(clone);
              }}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
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
              disabled={isInputDisabled}
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
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-3"
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
              {isInputDisabled ? 'Edit' : 'Save'}
            </button>
          </div>

          {/* <div className="w-full flex"> */}
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-full mt-4 items-center flex justify-center"
            onClick={() => {
              setIsDeleteTransactionModalOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2"
              width={25}
              height={25}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            Delete
          </button>
          {/* </div> */}
        </form>
      </div>
    </div>
  );
};

export default UpdateDaybook;
