/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */

import { useState, FormEvent, useRef, useEffect } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import IDaybook from '../../types/IDaybook';
import ICategory from '../../types/ICategory';
import '../output/dist.css';

function formatDate(date: any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0'); // Day of the month
  return `${year}-${month}-${day}`;
}

const Home = () => {
  const date = new Date();
  const formattedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const dateInputRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState<IDaybook>({
    amount: 0,
    categoryId: 0,
    date: formatDate(formattedDate),
    details: '',
    type: 'EXPENSE',
  });
  const [categoryInputData, setCategoryInputData] = useState<ICategory>({
    name: '',
    type: 'EXPENSE',
  });
  const [results, setResults] = useState<IDaybook[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ICategory[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<ICategory[]>([]);
  const [allCate, setAllCate] = useState<ICategory[]>([]);
  const [refreshState, setRefreshState] = useState(false);
  const [, setAllCategories] = useState<ICategory[]>([]);
  const [searchData, setSearchData] = useState({
    startDate: '',
    endDate: '',
    entryType: 'ALL',
    categoryId: 'ALL',
  });
  const [isUpdateDaybook, setIsUpdateDaybook] = useState(false);
  const [selectedDaybook, setSelectedDaybook] = useState<IDaybook>();
  const [allDaybooks, setAllDaybook] = useState<IDaybook[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const [activeTab, setActiveTab] = useState('Transaction');
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);
  const [isDeleteTransactionModalOpen, setIsDeleteTransactionModalOpen] =
    useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);

  const handleDateClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleStartDateClick = () => {
    if (startDateRef.current) {
      startDateRef.current.showPicker();
    }
  };

  const handleEndDateClick = () => {
    if (endDateRef.current) {
      endDateRef.current.showPicker();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await window.electron.addDaybook(inputData);
    toast('Daybook added successfully', {
      type: 'success',
    });

    setInputData({
      amount: 0,
      date: '',
      type: 'EXPENSE',
      categoryId: 1,
      details: '',
    });
    setActiveTab('Transaction');
    setRefreshState((prev) => !prev);
  };

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
    setRefreshState((prev) => !prev);
  };

  const getData = async () => {
    const allCat = (await window.electron.getAllCategories()) as ICategory[];
    const filteredExpenseCate = allCat.filter(
      (cate) => cate.type === 'EXPENSE',
    );
    const filteredIncomeCate = allCat.filter((cate) => cate.type === 'INCOME');
    setExpenseCategories(filteredExpenseCate);
    setIncomeCategories(filteredIncomeCate);
    setAllCategories(
      inputData.type === 'EXPENSE' ? filteredExpenseCate : filteredIncomeCate,
    );
    // if (!inputData.categoryId) {
    //   const clone = { ...inputData };
    //   clone.categoryId =
    //     inputData.type === 'EXPENSE'
    //       ? filteredExpenseCate.length === 0
    //         ? 1
    //         : (filteredExpenseCate[0].id as number)
    //       : filteredIncomeCate.length === 0
    //         ? 1
    //         : (filteredIncomeCate[0].id as number);
    //   setInputData(clone);
    // }

    const lastTenDaybook = await window.electron.getLastTenDaybook();
    const allDay = await window.electron.getAllDaybook();
    setAllDaybook(allDay);
    setResults(lastTenDaybook);
    setAllCate(allCat);

    setInputData({
      ...inputData,
      categoryId: allCat.length === 0 ? 1 : (allCat[0].id as number),
    });
  };

  useEffect(() => {
    getData();
  }, [refreshState]);

  const handleSearch = async () => {
    const isThereDates = searchData.startDate !== '' && searchData.endDate;
    const filteredResults = await window.electron.getDaybookByFilters(
      isThereDates ? [searchData.startDate, searchData.endDate] : null,
      searchData.entryType,
      searchData.categoryId,
    );
    setResults(filteredResults);
  };

  const handleUpdateDaybook = async (e: FormEvent) => {
    e.preventDefault();
    await window.electron.updateDaybook(selectedDaybook as IDaybook);
    toast('Daybook Updated Successfully', {
      type: 'success',
    });
    setRefreshState((prev) => !prev);
    setSelectedDaybook(undefined);
    setIsUpdateDaybook(false);
  };

  const handleUpdateCategory = async (e: FormEvent) => {
    e.preventDefault();
    await window.electron.updateCategory(selectedCategory as ICategory);
    toast('Category successfully updated', {
      type: 'success',
    });
    setIsEditCategoryModalOpen(false);
    setSelectedCategory(undefined);
  };

  return (
    <div>
      <div className="flex justify-between mt-2 mb-2 p-2">
        <h1 className="text-4xl font-bold">
          <span className="text-red-500">N</span>
          <span className="text-orange-500">e</span>
          <span className="text-yellow-300">x</span>
          <span className="text-green-500">a</span>
          <span className="text-blue-500">S</span>
          <span className="text-violet-500">p</span>
          <span className="text-red-500">e</span>
          <span className="text-orange-500">n</span>
          <span className="text-yellow-300">d</span>
        </h1>
        <div>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ml-2"
            type="button"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Add New Category
          </button>
        </div>
      </div>

      <div className="flex justify-around border-b border-gray-300">
        {['Transaction', 'Add Transaction', 'Categories'].map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-gray-600 ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'hover:text-blue-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Tab: Add Transaction */}
      <div
        className={`flex justify-center items-center w-full ${activeTab !== 'Add Transaction' && 'hidden'}`}
      >
        <form
          onSubmit={handleSubmit}
          className="justify-center items-center w-5/6"
          hidden={activeTab !== 'Add Transaction'}
        >
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
              // value={inputData.amount}
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
              // value="2024-05-15"
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
                    setAllCategories(expenseCategories);
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
                    setAllCategories(incomeCategories);
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
              {/* {allCategories.map((cate) => (
              <option key={cate.id} value={cate.id}>
                {cate.name}
              </option>
            ))} */}
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

      {/* Modal */}
      {isModalOpen && (
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
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />

      {/* Tab: Transaction */}
      <div className={`px-2 ${activeTab !== 'Transaction' && 'hidden'}`}>
        <h2 className="text-lg font-semibold mt-2 mb-2">
          Expenses by Category
        </h2>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {expenseCategories.map((cate) => {
            const totalAmount = allDaybooks.reduce(
              (total: number, item: any) => {
                return item.categoryId === cate.id
                  ? total + item.amount
                  : total;
              },
              0,
            );

            return (
              <div
                key={cate.id}
                className="text-sm p-1 rounded-md flex items-center"
              >
                <h2 className="font-semibold text-gray-800 mr-2">
                  {cate.name}:
                </h2>
                <span className="text-gray-700">{totalAmount}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={`flex justify-center items-center w-full p-4 ${activeTab !== 'Transaction' && 'hidden'}`}
      >
        {/* Date Range Picker */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label
              htmlFor="startDate"
              className="text-sm font-medium text-gray-700"
            >
              Start Date:
            </label>
            <input
              id="startDate"
              type="date"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2"
              ref={startDateRef}
              onClick={handleStartDateClick}
              value={searchData.startDate}
              onChange={(e) => {
                const clone = { ...searchData };
                clone.startDate = e.target.value;
                setSearchData(clone);
              }}
            />
          </div>
          <div className="flex items-center">
            <label
              htmlFor="endDate"
              className="text-sm font-medium text-gray-700"
            >
              End Date:
            </label>
            <input
              id="endDate"
              type="date"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2"
              ref={endDateRef}
              onClick={handleEndDateClick}
              value={searchData.endDate}
              onChange={(e) => {
                const clone = { ...searchData };
                clone.endDate = e.target.value;
                setSearchData(clone);
              }}
            />
          </div>

          {/* Income/Expense Dropdown */}
          <div className="flex items-center">
            <label
              htmlFor="entryType"
              className="text-sm font-medium text-gray-700"
            >
              Entry Type:
            </label>
            <select
              id="entryType"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2"
              value={searchData.entryType}
              onChange={(e) => {
                const clone = { ...searchData };
                clone.entryType = e.target.value;
                setSearchData(clone);
              }}
            >
              <option value="ALL">All</option>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700"
            >
              Category:
            </label>
            <select
              id="category"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2"
              value={searchData.categoryId}
              onChange={(e) => {
                const clone = { ...searchData };
                clone.categoryId = e.target.value;
                setSearchData(clone);
              }}
            >
              <option value="ALL">All</option>
              {searchData.entryType === 'ALL'
                ? allCate.map((cate) => (
                    <option key={cate.id} value={cate.id}>
                      {cate.name}
                    </option>
                  ))
                : searchData.entryType === 'EXPENSE'
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
        </div>

        {/* Search Button */}
        <div className="ml-4">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-2"
            onClick={() => {
              setRefreshState((prev) => !prev);
              setSearchData({
                startDate: '',
                endDate: '',
                categoryId: 'ALL',
                entryType: 'ALL',
              });
            }}
          >
            X
          </button>
        </div>
      </div>

      <div
        className={`flex justify-center self-center mb-4 ${activeTab !== 'Transaction' && 'hidden'}`}
      >
        <table className="table-auto border-collapse border border-gray-300 w-[95vw]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">No.</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Type</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">Details</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((da, index) => (
              <tr className="text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{da.date}</td>
                <td className="border border-gray-300 p-2">
                  {da.type === 'INCOME' ? 'Income' : 'Expense'}
                </td>
                <td className="border border-gray-300 p-2">
                  {/* {allCate.find((c) => c.id === da.categoryId)?.name} */}
                  {da.type === 'EXPENSE'
                    ? expenseCategories.find((c) => c.id === da.categoryId)
                        ?.name
                    : incomeCategories.find((c) => c.id === da.categoryId)
                        ?.name}
                </td>
                <td className="border border-gray-300 p-2">{da.amount}</td>
                <td className="border border-gray-300 p-2">{da.details}</td>
                <td className="border border-gray-300 p-2 items-center justify-center flex">
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-2"
                    onClick={() => {
                      setIsUpdateDaybook(true);
                      setSelectedDaybook(da);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="21"
                      height="24"
                    >
                      <path
                        d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                        fill="white"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-2"
                    onClick={async () => {
                      setSelectedDaybook(da);
                      setIsDeleteTransactionModalOpen(true);
                      setRefreshState((prev) => !prev);
                    }}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Daybook Model */}
      {isUpdateDaybook && selectedDaybook && (
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

              {/* Type */}
              {/* <div className="flex items-center mb-4">
                <span className="text-sm font-medium text-gray-700 w-1/3">
                  Type:
                </span>
                <div className="flex items-center space-x-4 w-5/6 ml-2">
                  <div className="flex items-center">
                    <input
                      id="expense"
                      name="type"
                      type="radio"
                      value="EXPENSE"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      required
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
                    />
                    <label
                      htmlFor="income"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      Income
                    </label>
                  </div>
                </div>
              </div> */}

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
      )}

      {/* Delete Category Modal */}
      {isDeleteCategoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this category?
            </p>
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
                  setRefreshState((prev) => !prev);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Transaction Modal */}
      {isDeleteTransactionModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this transaction?
            </p>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg mr-2"
                onClick={() => {
                  setIsDeleteTransactionModalOpen(false);
                  setSelectedDaybook(undefined);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                onClick={async () => {
                  await window.electron.deleteDaybook(
                    selectedDaybook?.id as number,
                  );
                  toast('Daybook Successfully deleted', {
                    type: 'error',
                  });
                  setIsDeleteTransactionModalOpen(false);
                  setSelectedDaybook(undefined);
                  setRefreshState((prev) => !prev);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditCategoryModalOpen && (
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
      )}

      <div
        className={`flex justify-center self-center ${activeTab !== 'Categories' && 'hidden'} mt-4`}
      >
        <table className="table-auto border-collapse border border-gray-300 w-[95vw]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">No.</th>
              <th className="border border-gray-300 p-2">Type</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allCate.map((da, index) => (
              <tr className="text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  {da.type === 'INCOME' ? 'Income' : 'Expense'}
                </td>
                <td className="border border-gray-300 p-2">{da.name}</td>
                <td className="border border-gray-300 p-2 items-center justify-center flex">
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-2"
                    onClick={() => {
                      setSelectedCategory(da);
                      setIsEditCategoryModalOpen(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="21"
                      height="24"
                    >
                      <path
                        d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                        fill="white"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-2"
                    onClick={async () => {
                      setSelectedCategory(da);
                      setIsDeleteCategoryModalOpen(true);
                      setRefreshState((prev) => !prev);
                    }}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
