/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */

import { useState, FormEvent, useRef, useEffect } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import numeral from 'numeral';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import IDaybook from '../../types/IDaybook';
import ICategory from '../../types/ICategory';
import '../output/dist.css';
import {
  getFirstAndLastDayOfMonth,
  getFirstAndLastDayOfLastMonth,
} from '../utils/getFirstAndLastDayOfMonth';

function formatDate(date: any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0'); // Day of the month
  return `${year}-${month}-${day}`;
}

const Home = () => {
  const date = new Date();
  const tableRef = useRef(null);
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
  const [previousMonthResults, setPreviousMonthResults] = useState<IDaybook[]>(
    [],
  );
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
  const [, setAllDaybook] = useState<IDaybook[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const [activeTab, setActiveTab] = useState('Transaction');
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);
  const [isDeleteTransactionModalOpen, setIsDeleteTransactionModalOpen] =
    useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState<IDaybook[]>(
    [],
  );
  const [isViewCategoryShowing, setIsViewingCatetgoryShowing] = useState(false);
  const [printingMode, setPrintingMode] = useState(false);
  const [categorySearch, setCategorySearch] = useState({
    entryType: 'ALL',
  });
  const [copyCate, setCopyCate] = useState<ICategory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [textColor, setTextColor] = useState('black');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handlePrint = useReactToPrint({
    contentRef: tableRef,
  });

  const handleDownloadPDF = () => {
    setPrintingMode(true);

    setTimeout(async () => {
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF() as any;
      const table = tableRef.current as any;

      const rows: any = [];
      const headers: any = [];

      // Extract table headers
      table.querySelectorAll('thead tr th').forEach((th: any) => {
        if (th.textContent !== 'Actions') {
          headers.push(th.textContent);
        }
      });

      // Extract table rows
      table.querySelectorAll('tbody tr').forEach((tr: any) => {
        const row: any = [];
        tr.querySelectorAll('td').forEach((td: any) => {
          row.push(td.textContent);
        });
        rows.push(row);
      });

      // Use jsPDF AutoTable to generate table in PDF
      // pdf.autoTable({
      //   head: [headers],
      //   body: rows,
      //   styles: { fontSize: 10, halign: 'center', valign: 'middle' },
      // });
      pdf.autoTable({
        head: [headers],
        body: rows,
        headStyles: {
          fillColor: [255, 255, 255], // White background for header
          textColor: [0, 0, 0], // Black text color for header
          fontStyle: 'bold', // Bold text style for header
        },
        styles: {
          cellPadding: 3, // Cell padding
          fontSize: 10, // Font size for table content
          halign: 'center', // Horizontal alignment
          valign: 'middle', // Vertical alignment
        },
        theme: 'striped', // Optional: Change table style ('striped', 'grid', or 'plain')
      });

      // Save the PDF
      pdf.save('table.pdf');

      setPrintingMode(false);
    }, 1000);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        setPrintingMode(true);
        setTimeout(() => {
          handlePrint();
          setPrintingMode(false);
        }, 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
    toast('Transaction added successfully', {
      type: 'success',
    });

    setInputData({
      amount: 0,
      date: formatDate(formattedDate),
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

    const { firstDay, lastDay } = getFirstAndLastDayOfMonth();
    const lastTenDaybook = await window.electron.getDaybookByFilters(
      [firstDay, lastDay],
      'ALL',
      'ALL',
    );
    const allDay = await window.electron.getAllDaybook();
    setAllDaybook(allDay);
    setResults(lastTenDaybook);
    setAllCate(allCat);
    setCopyCate(allCat);

    const { firstDay: previousMonthFirstDay, lastDay: previousMonthLastDay } =
      getFirstAndLastDayOfLastMonth();
    const previous = await window.electron.getDaybookByFilters(
      [previousMonthFirstDay, previousMonthLastDay],
      'ALL',
      'ALL',
    );
    setPreviousMonthResults(previous);

    setInputData({
      ...inputData,
      categoryId: allCat.length === 0 ? 1 : (allCat[0].id as number),
    });
    const findD = await window.electron.getDaybookByFilters(
      [firstDay, lastDay],
      'ALL',
      'ALL',
    );
    setCurrentMonthExpenses(findD);
  };

  useEffect(() => {
    getData();
  }, [refreshState]);

  const handleSearch = async () => {
    const isThereDates = searchData.startDate !== '' && searchData.endDate;
    const filteredResults = await window.electron.getDaybookByFilters(
      isThereDates
        ? [searchData.startDate, searchData.endDate]
        : [
            getFirstAndLastDayOfMonth().firstDay,
            getFirstAndLastDayOfMonth().lastDay,
          ],
      searchData.entryType,
      searchData.categoryId,
    );
    setCurrentMonthExpenses(filteredResults);

    setResults(filteredResults);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const currentData = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const handlePageChange = (page: any) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdateDaybook = async (e: FormEvent) => {
    e.preventDefault();
    await window.electron.updateDaybook(selectedDaybook as IDaybook);
    toast('Transaction Updated Successfully', {
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
    setRefreshState((prev) => !prev);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const calculateLuminance = (hexColor: any) => {
    const rgb = hexColor
      .replace('#', '')
      .match(/.{1,2}/g)
      .map((x: any) => parseInt(x, 16));

    const [r, g, b] = rgb.map((channel: any) => {
      const normalized = channel / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luminance > 0.5 ? 'black' : 'white';
  };

  return (
    <div>
      <div
        className={`flex justify-between mt-2 mb-2 p-2 top-0 sticky z-50 bg-white ${printingMode && 'hidden'}`}
      >
        <h1
          className="text-4xl font-bold cursor-pointer"
          onClick={() => {
            setActiveTab('Transaction');
            setIsViewingCatetgoryShowing(false);
            setRefreshState((prev) => !prev);
            setSearchData({
              startDate: '',
              endDate: '',
              categoryId: 'ALL',
              entryType: 'ALL',
            });
            setBackgroundColor('white');
            setTextColor('black');
          }}
        >
          <span className="text-red-500">A</span>
          <span className="text-orange-500">Q</span>
          <span className="text-yellow-300">A</span>
          <span className="text-green-500">S</span>
          <span className="text-blue-500">A</span>
          {/* <span className="text-violet-500">p</span>
          <span className="text-red-500">e</span>
          <span className="text-orange-500">n</span>
          <span className="text-yellow-300">d</span> */}
        </h1>
        <div>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ml-2"
            type="button"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Category
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-50 bg-gray-200 w-64 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <h2
          //  className="text-white text-lg font-semibold"
          >
            Expenses By Category
          </h2>
          <button
            onClick={toggleSidebar}
            // className="text-gray-400 hover:text-white"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="px-4 py-2">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="py-2 text-left text-sm font-semibold">
                  Category
                </th>
                <th className="py-2 text-right text-sm font-semibold">
                  Expense
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {expenseCategories.map((cate) => {
                const totalAmount = currentMonthExpenses.reduce(
                  (total, item) =>
                    item.categoryId === cate.id ? total + item.amount : total,
                  0,
                );

                return (
                  <tr
                    key={cate.id}
                    className="text-black cursor-pointer"
                    onClick={async () => {
                      const clone = { ...searchData };
                      clone.categoryId = cate.id as unknown as string;
                      setSearchData(clone);
                      const isThereDates =
                        searchData.startDate !== '' && searchData.endDate;
                      const filteredResults =
                        await window.electron.getDaybookByFilters(
                          isThereDates
                            ? [searchData.startDate, searchData.endDate]
                            : [
                                getFirstAndLastDayOfMonth().firstDay,
                                getFirstAndLastDayOfMonth().lastDay,
                              ],
                          searchData.entryType,
                          clone.categoryId,
                        );
                      // setCurrentMonthExpenses(filteredResults);
                      setResults(filteredResults);
                      setIsOpen(false);
                      const newColor = getRandomColor();
                      setBackgroundColor(newColor);
                      setTextColor(calculateLuminance(newColor));
                    }}
                  >
                    <td className="text-left text-sm font-medium">
                      {cate.name}
                    </td>
                    <td className="text-sm text-black text-right">
                      {numeral(totalAmount).format('0,0')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={`flex justify-around border-b top-[50px] sticky z-40 bg-white  border-gray-300 ${activeTab === '' && 'hidden'} ${printingMode && 'hidden'}`}
      >
        {['Transaction', 'Add Transaction'].map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-gray-600  ${
              activeTab === tab
                ? 'border-b-2 border-black text-black'
                : 'hover:text-black'
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
                <button
                  type="button"
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ml-2"
                  onClick={() => {
                    setIsViewingCatetgoryShowing(true);
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
      <div
        className={`px-2 flex z-30 top-[79px] sticky bg-white justify-between ${activeTab !== 'Transaction' && 'hidden'} ${printingMode && 'hidden'}`}
      >
        {/* <div>
          <h2 className="text-lg font-semibold mt-2 mb-2">
            Expenses by Category
          </h2>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {expenseCategories.map((cate) => {
              const totalAmount = currentMonthExpenses.reduce(
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
                  <h2
                    className="font-semibold text-gray-800 mr-2 cursor-pointer"
                    onClick={async () => {
                      const clone = { ...searchData };
                      clone.categoryId = cate.id as unknown as string;
                      setSearchData(clone);
                      const isThereDates =
                        searchData.startDate !== '' && searchData.endDate;
                      const filteredResults =
                        await window.electron.getDaybookByFilters(
                          isThereDates
                            ? [searchData.startDate, searchData.endDate]
                            : null,
                          searchData.entryType,
                          clone.categoryId,
                        );
                      setCurrentMonthExpenses(filteredResults);

                      setResults(filteredResults);
                    }}
                  >
                    {cate.name}:
                  </h2>
                  <span className="text-gray-700">{totalAmount}</span>
                </div>
              );
            })}
          </div>
        </div> */}
        <button
          onClick={toggleSidebar}
          className="ml-4 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 text-2xl"
          type="button"
        >
          ☰
        </button>
        <div
          className={`flex items-center ${activeTab !== 'Transaction' && 'hidden'} ${printingMode && 'hidden'}`}
        >
          {/* Date Range Picker */}
          <div className="flex">
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
                className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2"
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
            <div className="flex items-center ml-1">
              <label
                htmlFor="endDate"
                className="text-sm font-medium text-gray-700"
              >
                End Date:
              </label>
              <input
                id="endDate"
                type="date"
                className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2"
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
            <div className="flex items-center ml-1">
              <label
                htmlFor="entryType"
                className="text-sm font-medium text-gray-700"
              >
                Entry Type:
              </label>
              <select
                id="entryType"
                className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2"
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
            <div className="flex items-center ml-1">
              <label
                htmlFor="category"
                className="text-sm font-medium text-gray-700"
              >
                Category:
              </label>
              <select
                id="category"
                className={`border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2 ${
                  searchData.categoryId !== 'ALL' && 'focus:ring-0'
                }`}
                style={{ backgroundColor, color: textColor }}
                value={searchData.categoryId}
                onChange={(e) => {
                  const clone = { ...searchData };
                  clone.categoryId = e.target.value;
                  setSearchData(clone);

                  if (e.target.value === 'ALL') {
                    setBackgroundColor('white');
                    setTextColor('black');
                  } else {
                    const newColor = getRandomColor();
                    setBackgroundColor(newColor);

                    setTextColor(calculateLuminance(newColor));
                  }
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
          <div className="ml-2">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleSearch}
            >
              Search
            </button>
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-2"
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
        <div className="flex flex-col">
          <div className="mr-2 flex items-center text-red-500">
            <h2 className="text-sm font-semibold">
              {new Date(
                new Date().setMonth(new Date().getMonth() - 1),
              ).toLocaleString('default', { month: 'long' })}
              , {new Date().getFullYear()}:{' '}
            </h2>
            {/* <div className="flex flex-wrap justify-end items-center gap-4 mb-4"> */}
            <p className="ml-5">
              {numeral(
                previousMonthResults
                  .filter((da) => da.type === 'EXPENSE')
                  .reduce((total: number, item: any) => {
                    return total + item.amount;
                  }, 0),
              ).format('0,0')}
            </p>
            {/* </div> */}
          </div>
          <div className="flex items-center">
            <h2 className="text-sm font-semibold text-blue-800">
              {new Date().toLocaleDateString('default', { month: 'long' })},{' '}
              {new Date().getFullYear()}:{' '}
            </h2>
            {/* <div className="flex flex-wrap justify-end items-center gap-4 mb-4"> */}
            <p className="ml-5">
              {numeral(
                results
                  .filter((da) => da.type === 'EXPENSE')
                  .reduce((total: number, item: any) => {
                    return total + item.amount;
                  }, 0),
              ).format('0,0')}
            </p>
            {/* </div> */}
          </div>
        </div>
      </div>

      <div
        className={`${!printingMode && 'flex justify-center self-center items-center flex-col mb-4'} ${activeTab !== 'Transaction' && 'hidden'}`}
      >
        <div className={`${!printingMode && 'overflow-auto max-h-[400px]'}`}>
          <table className="border-collapse w-[95vw]" ref={tableRef}>
            <thead className="border border-gray-300 sticky top-0">
              <tr className="bg-gray-200">
                <th className="border border-gray-300">Date</th>
                <th className="border border-gray-300">Type</th>
                <th className="border border-gray-300">Category</th>
                <th className="border border-gray-300">Amount</th>
                <th className="border border-gray-300">Details</th>
                <th
                  className={`border border-gray-300 ${printingMode && 'hidden'} no-print`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="border border-gray-300">
              {currentData.map((da) => (
                <tr className="text-center">
                  <td className="border border-gray-300">{da.date}</td>
                  <td className="border border-gray-300 text-left px-2">
                    {da.type === 'INCOME' ? 'Income' : 'Expense'}
                  </td>
                  <td className="border border-gray-300 text-left px-2">
                    {/* {allCate.find((c) => c.id === da.categoryId)?.name} */}
                    {da.type === 'EXPENSE'
                      ? expenseCategories.find((c) => c.id === da.categoryId)
                          ?.name
                      : incomeCategories.find((c) => c.id === da.categoryId)
                          ?.name}
                  </td>
                  <td className="border border-gray-300 text-right px-2">
                    {numeral(da.amount).format('0,0')}
                  </td>
                  <td className="border border-gray-300 text-left px-2">
                    {da.details}
                  </td>
                  <td
                    className={`border border-gray-300 items-center justify-center flex ${printingMode && 'hidden'} no-print`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsUpdateDaybook(true);
                        setSelectedDaybook(da);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        width="16"
                        height="20"
                      >
                        <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                      </svg>
                    </button>
                    {/* <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-[0.4rem] px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-2"
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
                  </button> */}
                    <button
                      type="button"
                      className="bg-transparent font-semibold py-1 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ml-2"
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

        <div className="flex w-[95vw] justify-between">
          <div className="flex justify-start self-start items-start mt-4 ml-2">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-3"
              type="button"
              onClick={() => {
                setPrintingMode(true);
                setTimeout(() => {
                  handlePrint();
                  setPrintingMode(false);
                }, 1000);
              }}
            >
              Print
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-3"
              type="button"
              onClick={handleDownloadPDF}
            >
              Download
            </button>
          </div>

          <div className="flex justify-end self-end items-end mt-4 ml-2 mr-5">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              type="button"
            >
              {'<<'}
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              type="button"
            >
              {'<'}
            </button>
            <button
              className="px-3 py-1 mx-1 rounded bg-blue-500 text-white"
              type="button"
            >
              {currentPage} of {totalPages === 0 ? '1' : totalPages}
            </button>
            {/* {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              type="button"
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))} */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              type="button"
              disabled={currentPage === totalPages}
              className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {'>'}
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              type="button"
              disabled={currentPage === totalPages}
              className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {'>>'}
            </button>
          </div>
        </div>
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
                  toast('Transaction Successfully deleted', {
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

      {isViewCategoryShowing && (
        <div className="flex justify-center flex-col items-center self-center mt-4">
          <div className="flex mb-4">
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
                value={categorySearch.entryType}
                onChange={(e) => {
                  const clone = { ...categorySearch };
                  clone.entryType = e.target.value;
                  setCategorySearch(clone);
                }}
              >
                <option value="ALL">All</option>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div className="ml-4">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={async () => {
                  const searchResults =
                    await window.electron.getCategoriesByFilters(
                      categorySearch.entryType,
                    );
                  setCopyCate(searchResults);
                }}
              >
                Search
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-2"
                onClick={() => {
                  setRefreshState((prev) => !prev);
                  setCategorySearch({
                    entryType: 'ALL',
                  });
                }}
              >
                X
              </button>
            </div>
          </div>
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
              {copyCate.map((da, index) => (
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
      )}
    </div>
  );
};

export default Home;
