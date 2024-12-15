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
import 'jspdf-autotable';
import { IDaybook, ICategory } from '../../types';
import '../styles/dist/dist.css';
import {
  getFirstAndLastDayOfMonth,
  getFirstAndLastDayOfLastMonth,
  formatDate,
  getRandomColor,
  calculateLuminance,
} from '../utils';
import AddCategoryModal from '../components/AddCategoryModal';
import AddTransaction from '../components/AddTransaction';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Tabs from '../components/Tabs';

const Home = () => {
  const tableRef = useRef(null);

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [previousMonthResults, setPreviousMonthResults] = useState<IDaybook[]>(
    [],
  );
  const [results, setResults] = useState<IDaybook[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ICategory[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<ICategory[]>([]);
  const [allCate, setAllCate] = useState<ICategory[]>([]);
  const [refreshState, setRefreshState] = useState(false);
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
  const [isViewCategoryShowing, setIsViewingCategoryShowing] = useState(false);
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

  const getData = async () => {
    const allCat = (await window.electron.getAllCategories()) as ICategory[];
    const filteredExpenseCate = allCat.filter(
      (cate) => cate.type === 'EXPENSE',
    );
    const filteredIncomeCate = allCat.filter((cate) => cate.type === 'INCOME');
    setExpenseCategories(filteredExpenseCate);
    setIncomeCategories(filteredIncomeCate);

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

  return (
    <div>
      <Header
        printingMode={printingMode}
        setIsViewingCategoryShowing={setIsViewingCategoryShowing}
        setActiveTab={setActiveTab}
        setBackgroundColor={setBackgroundColor}
        setIsModalOpen={setIsModalOpen}
        setRefreshState={setRefreshState}
        setSearchData={setSearchData}
        setTextColor={setTextColor}
      />

      <Sidebar
        currentMonthExpenses={currentMonthExpenses}
        isOpen={isOpen}
        searchData={searchData}
        setIsOpen={setIsOpen}
        setResults={setResults}
        setSearchData={setSearchData}
        toggleSidebar={toggleSidebar}
        setBackgroundColor={setBackgroundColor}
        setTextColor={setTextColor}
      />

      <Tabs
        printingMode={printingMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Modal */}
      {isModalOpen && <AddCategoryModal setIsModalOpen={setIsModalOpen} />}

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
          <div className="flex items-center">
            <h2 className="text-sm font-semibold text-blue-800">Today:</h2>
            {/* <div className="flex flex-wrap justify-end items-center gap-4 mb-4"> */}
            <p className="ml-5">
              {numeral(
                results
                  .filter(
                    (da) =>
                      da.type === 'EXPENSE' &&
                      da.date === formatDate(new Date()),
                  )
                  .reduce((total: number, item: any) => {
                    return total + item.amount;
                  }, 0),
              ).format('0,0')}
            </p>
            {/* </div> */}
          </div>
        </div>
      </div>

      {activeTab !== 'Transaction' && (
        <AddTransaction
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setRefreshState={setRefreshState}
        />
      )}

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
