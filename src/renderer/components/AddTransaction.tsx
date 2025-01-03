/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { toast } from 'react-toastify';
import IDaybook from '../../types/IDaybook';
import { formatDate } from '../utils';
import { ICategory } from '../../types';

const AddTransaction = ({
  setRefreshState,
  refreshState,
  isAddTransactionModalOpen,
  setIsAddTransactionModalOpen,
}: {
  setRefreshState: any;
  refreshState: any;
  isAddTransactionModalOpen: any;
  setIsAddTransactionModalOpen: any;
}) => {
  const date = new Date();
  const formattedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const [inputData, setInputData] = useState<IDaybook>({
    amount: 0,
    categoryId: 0,
    date: formatDate(formattedDate),
    details: '',
    type: 'EXPENSE',
    // @ts-ignore
    accountId: +localStorage?.getItem('currentAccountId') as unknown as number,
  });
  const [expenseCategories, setExpenseCategories] = useState<ICategory[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<ICategory[]>([]);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const getData = async () => {
    const allCategories = (await window.electron.getAllCategories(
      // @ts-ignore
      +localStorage.getItem('currentAccountId'),
    )) as ICategory[];

    const filteredExpenseCategories = allCategories.filter(
      (category) => category.type === 'EXPENSE',
    );
    const filteredIncomeCategories = allCategories.filter(
      (category) => category.type === 'INCOME',
    );

    setExpenseCategories(filteredExpenseCategories);
    setIncomeCategories(filteredIncomeCategories);
    setInputData({
      ...inputData,
      categoryId: filteredExpenseCategories[0].id as number,
    });
  };

  useEffect(() => {
    getData();
  }, [refreshState]);

  const handleDateClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await window.electron.addDaybook(inputData);
    toast('Transaction added successfully', {
      type: 'success',
    });

    setInputData({
      amount: 0,
      date: formatDate(formattedDate),
      type: 'EXPENSE',
      categoryId: 1,
      details: '',
      // @ts-ignore
      accountId: +localStorage.getItem('currentAccountId'),
    });
    setIsAddTransactionModalOpen(false);
    setRefreshState((prev: any) => !prev);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
        isAddTransactionModalOpen
          ? 'opacity-100 visible'
          : 'opacity-0 invisible'
      }`}
      onClick={() => setIsAddTransactionModalOpen(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Transaction
          </h2>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-2"
            onClick={() => {
              setIsAddTransactionModalOpen(false);
            }}
          >
            X
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="flex items-center self-center mt-4">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-gray-700 w-1/6"
            >
              Amount:
            </label>
            <input
              id="amount"
              type="number"
              min={0}
              placeholder="Amount"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={inputData.amount === 0 ? '' : inputData.amount}
              onChange={(e) => {
                const clone = { ...inputData };
                clone.amount = +e.target.value;
                setInputData(clone);
              }}
            />
          </div>

          {/* Date */}
          <div className="flex items-center w-full mt-4">
            <label
              htmlFor="date"
              className="text-sm font-medium text-gray-700 w-1/6"
            >
              Date:
            </label>
            <input
              id="date"
              type="date"
              ref={dateInputRef}
              onClick={handleDateClick}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={inputData.date}
              onChange={(e) => {
                const clone = { ...inputData };
                clone.date = e.target.value;
                setInputData(clone);
              }}
            />
          </div>

          {/* Type */}
          <div className="mt-4 w-full flex">
            <label
              htmlFor="type"
              className="text-sm font-medium text-gray-700 w-1/6"
            >
              Type:
            </label>
            <div className="flex items-center space-x-4 w-5/6">
              <div className="flex items-center">
                <input
                  id="expense"
                  name="type"
                  type="radio"
                  value="EXPENSE"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  required
                  checked={inputData.type === 'EXPENSE'}
                  onChange={(e) => {
                    const clone = { ...inputData };
                    clone.type = e.target.value as 'INCOME' | 'EXPENSE';
                    clone.categoryId = expenseCategories[0].id as number;
                    setInputData(clone);
                  }}
                />
                <label
                  htmlFor="expense"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Expense
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="income"
                  name="type"
                  type="radio"
                  value="INCOME"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  required
                  checked={inputData.type === 'INCOME'}
                  onChange={(e) => {
                    const clone = { ...inputData };
                    clone.type = e.target.value as 'INCOME' | 'EXPENSE';
                    clone.categoryId = incomeCategories[0].id as number;
                    setInputData(clone);
                  }}
                />
                <label
                  htmlFor="income"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Income
                </label>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center w-full mt-4">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700 w-1/6"
            >
              Category:
            </label>
            <select
              id="category"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={inputData.categoryId}
              onChange={(e) => {
                const clone = { ...inputData };
                clone.categoryId = +e.target.value;
                setInputData(clone);
              }}
            >
              {inputData.type === 'EXPENSE'
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
          <div className="flex items-center w-full mt-4">
            <label
              htmlFor="details"
              className="text-sm font-medium text-gray-700 w-1/6"
            >
              Details:
            </label>
            <input
              id="details"
              type="text"
              placeholder="Details"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={inputData.details}
              onChange={(e) => {
                const clone = { ...inputData };
                clone.details = e.target.value;
                setInputData(clone);
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
