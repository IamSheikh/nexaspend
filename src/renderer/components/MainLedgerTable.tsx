/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useState, useEffect, useRef } from 'react';
import numeral from 'numeral';
import { IParty } from '../../types';
import { getFirstAndLastDayOfMonth } from '../utils';

const MainLedgerTable = ({
  printingMode,
  activeTab,
  ledgerTableRef,
  currentLedgerData,
  setRefreshState,
  //   setIsUpdateDaybook,
  // setSelectedLedger,
  //   setIsDeleteTransactionModalOpen,
  // handleLedgerDownloadPdf,
  handleLedgerPageChange,
  ledgerCurrentPage,
  ledgerTotalPages,
  // ledgerSearchData,
  printLedgerTable,
  currentAccountId,
  refreshState,
  isLedgerTableFooterShowing,
  selectedParty,
  setLedgerResults,
  setLedgerCurrentPage,
  setSelectedLedger,
  setIsUpdateLedger,
}: {
  printingMode: any;
  activeTab: any;
  ledgerTableRef: any;
  currentLedgerData: any;
  setRefreshState: any;
  //   setIsUpdateDaybook: any;
  // setSelectedLedger: any;
  //   setIsDeleteTransactionModalOpen: any;
  printLedgerTable: any;
  // handleLedgerDownloadPdf: any;
  handleLedgerPageChange: any;
  ledgerCurrentPage: any;
  ledgerTotalPages: any;
  // ledgerSearchData: any;
  currentAccountId: any;
  refreshState: any;
  isLedgerTableFooterShowing: any;
  selectedParty: any;
  setLedgerResults: any;
  setLedgerCurrentPage: any;
  setSelectedLedger: any;
  setIsUpdateLedger: any;
}) => {
  const startDateRef = useRef<any>();
  const endDateRef = useRef<any>();
  const [allParties, setAllParties] = useState<IParty[]>([]);
  const [currentParty, setCurrenParty] = useState<IParty>();
  const [ledgerSearchData, setLedgerSearchData] = useState({
    startDate: '',
    endDate: '',
    transactionType: '',
  });

  useEffect(() => {
    (async () => {
      const parties = (await window.electron.getAllParties(
        // @ts-ignore
        currentAccountId,
      )) as IParty[];
      const cp = parties.find((party) => party.id === selectedParty.id);
      setCurrenParty(cp);
      setAllParties(parties);
    })();
  }, [currentAccountId, refreshState]);

  const handleSearch = async () => {
    const { firstDay, lastDay } = getFirstAndLastDayOfMonth();
    const isThereDates =
      ledgerSearchData.startDate !== '' && ledgerSearchData.endDate;
    const filteredResults = await window.electron.getLedgerByFilters(
      isThereDates
        ? [ledgerSearchData.startDate, ledgerSearchData.endDate]
        : [firstDay, lastDay],
      ledgerSearchData.transactionType,
      selectedParty.id,
      // @ts-ignore
      localStorage.getItem('currentAccountId'),
    );

    setLedgerResults(filteredResults);
    setLedgerCurrentPage(1);
  };

  useEffect(() => {
    if (ledgerSearchData.startDate !== '' && ledgerSearchData.endDate !== '') {
      handleSearch();
    }
  }, [ledgerSearchData.startDate, ledgerSearchData.endDate]);

  return (
    <div
      className={`${!printingMode && 'flex justify-center self-center items-center flex-col mb-4'} ${activeTab !== 'Ledger' && ''}`}
    >
      <div
        className="flex flex-col justify-center items-center w-full"
        ref={ledgerTableRef}
      >
        <h1 className="text-2xl font-semibold mt-4">
          {selectedParty.partyName}:
        </h1>

        <div className="flex justify-center items-center mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 w-full mt-4 px-8">
            <div className="flex">
              <span className="font-semibold text-gray-700">
                Mobile Number:
              </span>
              <span className="ml-2 text-gray-900">
                {selectedParty.mobileNumber}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-700">Address:</span>
              <span className="ml-2 text-gray-900">
                {selectedParty.address}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-700">Email:</span>
              <span className="ml-2 text-gray-900">{selectedParty.email}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-700">Details:</span>
              <span className="ml-2 text-gray-900">
                {selectedParty.details}
              </span>
            </div>
            <div className="flex justify-center items-center self-center col-span-2">
              <span className="font-semibold text-gray-700">Balance:</span>
              <span className="ml-2 text-gray-900">
                {numeral(currentParty?.balance).format('0,0')}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`flex items-center ml-12 ${printingMode && 'hidden'} mt-5`}
        >
          <div className="flex">
            {/* Start Date Picker */}
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
                onClick={() => {
                  if (startDateRef.current) {
                    startDateRef.current.showPicker();
                  }
                }}
                value={ledgerSearchData.startDate}
                onChange={(e) => {
                  const clone = { ...ledgerSearchData };
                  clone.startDate = e.target.value;
                  setLedgerSearchData(clone);
                }}
              />
            </div>

            {/* End Date Picker */}
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
                onClick={() => {
                  if (endDateRef.current) {
                    endDateRef.current.showPicker();
                  }
                }}
                value={ledgerSearchData.endDate}
                onChange={(e) => {
                  const clone = { ...ledgerSearchData };
                  clone.endDate = e.target.value;
                  setLedgerSearchData(clone);
                }}
              />
            </div>

            {/* Entry Type Dropdown */}
            {/* <div className="flex items-center ml-1">
              <label
                htmlFor="entryType"
                className="text-sm font-medium text-gray-700"
              >
                Transaction Type:
              </label>
              <select
                id="entryType"
                className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2"
                value={ledgerSearchData.transactionType}
                onChange={(e) => {
                  const clone = { ...ledgerSearchData };
                  clone.transactionType = e.target.value;
                  setLedgerSearchData(clone);
                }}
              >
                <option value="ALL">All</option>
                <option value="YOU GAVE">You Gave</option>
                <option value="YOU RECEIVED">You Received</option>
              </select>
            </div> */}
          </div>

          {/* Search and Reset Button */}
          <div className="ml-2 flex">
            {/* <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleSearch}
            >
              Search
            </button> */}
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-2"
              onClick={() => {
                setRefreshState((prev: any) => !prev);
                setLedgerSearchData({
                  endDate: '',
                  startDate: '',
                  transactionType: 'ALL',
                });
                // setSearchData({
                //   startDate: '',
                //   endDate: '',
                //   categoryId: 'ALL',
                //   entryType: 'ALL',
                // });
                // setBackgroundColor('white');
                // setTextColor('black');
              }}
            >
              X
            </button>
          </div>
        </div>
        <table
          className={`border-collapse w-[95vw]  mt-5 `}
          id="table-container"
        >
          <thead
            className={`border border-gray-300 sticky ${printingMode ? '' : 'z-40'} specific-thead`}
            // style={{ zIndex: 50000000 }}
          >
            <tr className="bg-gray-200">
              <th
                className={`border border-gray-300 ${printingMode && 'text-center'}`}
              >
                Date
              </th>
              <th
                className={`border border-gray-300 ${printingMode && 'text-center'}`}
              >
                Type
              </th>
              <th
                className={`border border-gray-300 ${printingMode && 'text-center'}`}
              >
                Details
              </th>
              <th
                className={`border border-gray-300 ${printingMode && 'text-center'}`}
              >
                You Gave
              </th>
              <th
                className={`border border-gray-300 ${printingMode && 'text-center w-32'}`}
              >
                You Received
              </th>
              {/* <th
                className={`border border-gray-300 ${printingMode && 'text-center w-32'}`}
              >
                Balance
              </th> */}
            </tr>
          </thead>

          <tbody className="border border-gray-300">
            {currentLedgerData.map((da: any) => (
              <tr
                className="text-center"
                key={da.id}
                onClick={() => {
                  setSelectedLedger(da);
                  setIsUpdateLedger(true);
                }}
              >
                <td
                  className={`border border-gray-300 ${printingMode && 'pb-2 w-32'}`}
                >
                  {da.date}
                </td>
                <td
                  className={`border border-gray-300 text-left px-2 ${printingMode && 'pb-2'}`}
                >
                  {da.transaction_type === 'YOU GAVE'
                    ? 'You Gave'
                    : 'You Received'}
                </td>
                <td
                  className={`border border-gray-300 text-left px-2 ${printingMode && 'pb-2'}`}
                >
                  {da.details}
                </td>
                <td
                  className={`border border-gray-300 text-right px-2 ${printingMode && 'pb-2'}`}
                >
                  {da.transaction_type === 'YOU GAVE' &&
                    numeral(da.amount).format('0,0')}
                </td>
                <td
                  className={`border border-gray-300 text-right px-2 ${printingMode && 'pb-2'}`}
                >
                  {da.transaction_type === 'YOU RECEIVED' &&
                    numeral(da.amount).format('0,0')}
                </td>
                {/* <td
                  className={`border border-gray-300 text-right px-2 ${printingMode && 'pb-2'}`}
                >
                  {numeral(selectedParty.balance).format('0,0')}
                </td> */}
              </tr>
            ))}
          </tbody>
          {/* <tfoot className="flex justify-end border-red-500"> */}
          {/* </tfoot> */}
        </table>
      </div>

      {isLedgerTableFooterShowing && (
        <div className="flex w-[95vw] justify-between">
          <div className="flex justify-start self-start items-start mt-4 ml-2">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-3"
              type="button"
              onClick={() => {
                printLedgerTable();
              }}
            >
              Print
            </button>
            {/* <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-3"
              type="button"
              // onClick={handleLedgerDownloadPdf}
            >
              Download
            </button> */}
          </div>

          <div className="flex justify-end self-end items-end mt-4 ml-2 mr-5">
            <button
              onClick={() => handleLedgerPageChange(1)}
              disabled={ledgerCurrentPage === 1}
              className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              type="button"
            >
              {'<<'}
            </button>
            <button
              onClick={() => handleLedgerPageChange(ledgerCurrentPage - 1)}
              disabled={ledgerCurrentPage === 1}
              className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              type="button"
            >
              {'<'}
            </button>
            <button
              className="px-3 py-1 mx-1 rounded bg-blue-500 text-white"
              type="button"
            >
              {ledgerCurrentPage} of{' '}
              {ledgerTotalPages === 0 ? '1' : ledgerTotalPages}
            </button>
            <button
              onClick={() => handleLedgerPageChange(ledgerCurrentPage + 1)}
              type="button"
              disabled={ledgerCurrentPage === ledgerTotalPages}
              className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {'>'}
            </button>
            <button
              onClick={() => handleLedgerPageChange(ledgerTotalPages)}
              type="button"
              disabled={ledgerCurrentPage === ledgerTotalPages}
              className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {'>>'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLedgerTable;
