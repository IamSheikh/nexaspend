/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */

import { useState, FormEvent, useRef } from 'react';
import IDaybook from '../../types/IDaybook';

const Home = () => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [inputData, setInputData] = useState<IDaybook>({
    amount: 0,
    categoryId: 0,
    date: '05-15-2024',
    details: '',
    type: 'EXPENSE',
  });

  const handleDateClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log(inputData);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center">NexaSpend</h1>
      <form onSubmit={handleSubmit} className="w-full">
        {/* Amount */}
        <div className="flex items-center w-full mt-4">
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
            value={inputData.amount === 0 ? undefined : inputData.amount}
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
                onChange={(e) => {
                  const clone = { ...inputData };
                  clone.type = e.target.value as 'INCOME' | 'EXPENSE';
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
                onChange={(e) => {
                  const clone = { ...inputData };
                  clone.type = e.target.value as 'INCOME' | 'EXPENSE';
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
            onChange={(e) => {
              const clone = { ...inputData };
              clone.categoryId = +e.target.value;
              setInputData(clone);
            }}
          >
            <option value={1}>Random Category 1</option>
            <option value={2}>Random Category 2</option>
            <option value={3}>Random Category 3</option>
            <option value={4}>Random Category 4</option>
            <option value={5}>Random Category 5</option>
            <option value={6}>Random Category 6</option>
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
  );
};

export default Home;
