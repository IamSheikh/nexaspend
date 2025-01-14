/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
/* eslint-disable new-cap */
/* eslint-disable promise/always-return */
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

import { useState, useRef, useEffect } from 'react';
import { Bounce, ToastContainer } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import {
  IDaybook,
  ICategory,
  IParty,
  ILedger,
  ITransactionAccount,
} from '../../types';
import '../styles/dist/dist.css';
import { formatDate, getFirstAndLastDayOfMonth } from '../utils';
import AddCategoryModal from '../components/AddCategoryModal';
import AddTransaction from '../components/AddTransaction';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Tabs from '../components/Tabs';
import UpdateDaybook from '../components/UpdateDaybook';
import DeleteCategoryModal from '../components/DeleteCategoryModal';
import DeleteTransaction from '../components/DeleteTransaction';
import EditCategoryModal from '../components/EditCategoryModal';
import ViewCategories from '../components/ViewCategories';
import SecondaryHeader from '../components/SecondaryHeader';
import MainTable from '../components/MainTable';
import AccountsModal from '../components/AccountsModal';
import LoginAccount from '../components/LoginAccount';
import Charts from '../components/Charts';
import AddParty from '../components/AddParty';
import ViewParties from '../components/ViewParties';
import DeletePartyModal from '../components/DeletePartyModal';
import EditPartyModal from '../components/EditPartyModal';
import AddLedger from '../components/AddLedger';
import MainLedgerTable from '../components/MainLedgerTable';
import UpdateLedger from '../components/UpdateLedger';
import AddTransactionAccountModal from '../components/AddTransactionAccountModal';
import ViewTransactionAccounts from '../components/ViewTransactionAccounts';
import EditTransactionAccountModal from '../components/EditTransactionAccountModal';
import DeleteTransactionAccountModal from '../components/DeleteTransactionAccountModal';

const Home = ({
  refreshState,
  setRefreshState,
}: {
  refreshState: any;
  setRefreshState: any;
}) => {
  const tableRef = useRef(null);
  const sideBarRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountsModalOpen, setAccountsModalOpen] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [results, setResults] = useState<IDaybook[]>([]);
  // const [refreshState, setRefreshState] = useState(false);
  const [searchData, setSearchData] = useState({
    startDate: '',
    endDate: '',
    entryType: 'ALL',
    categoryId: 'ALL',
  });
  const [isUpdateDaybook, setIsUpdateDaybook] = useState(false);
  const [selectedDaybook, setSelectedDaybook] = useState<IDaybook>();
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const [currentDate1, setCurrentDate1] = useState(new Date());
  const [currentDate2, setCurrentDate2] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Transaction');
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);
  const [isDeleteTransactionModalOpen, setIsDeleteTransactionModalOpen] =
    useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [, setCurrentMonthExpenses] = useState<IDaybook[]>([]);
  const [isViewCategoryShowing, setIsViewingCategoryShowing] = useState(false);
  const [printingMode, setPrintingMode] = useState(false);
  const [currentAccountId, setCurrentAccountId] = useState(
    // @ts-ignore
    +localStorage.getItem('currentAccountId'),
  );

  const [isOpen, setIsOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [textColor, setTextColor] = useState('black');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
    useState(false);
  const [isAddLedgerModalOpen, setIsAddLedgerModalOpen] = useState(false);
  const [isTableFooterShowing, setIsTableFooterShowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddPartyModalShowing, setIsAddPartyModalShowing] = useState(false);
  const [isViewingLedgerShowing, setIsViewingLedgerShowing] = useState(false);
  const [selectedParty, setSelectedParty] = useState<IParty>();
  const [isEditPartyModalOpen, setIsEditPartyModalOpen] = useState(false);
  const [isDeletePartyModalOpen, setIsDeletePartyModalOpen] = useState(false);
  const [ledgerResults, setLedgerResults] = useState<ILedger[]>([]);
  const [ledgerCurrentPage, setLedgerCurrentPage] = useState(1);
  const ledgerTableRef = useRef<any>();
  const [isLedgerTableFooterShowing] = useState(true);
  const [isUpdateLedger, setIsUpdateLedger] = useState(false);
  const [selectedLedger, setSelectedLedger] = useState<ILedger>();
  const [
    isAddTransactionAccountModalOpen,
    setIsAddTransactionAccountModalOpen,
  ] = useState(false);
  const [selectedTransactionAccount, setSelectedTransactionAccount] =
    useState<ITransactionAccount>();
  const [
    isDeleteTransactionAccountModalOpen,
    setIsDeleteTransactionAccountModalOpen,
  ] = useState(false);
  const [
    isEditTransactionAccountModalOpen,
    setIsEditTransactionAccountModalOpen,
  ] = useState(false);

  const itemsPerPage = 20;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // const handlePrint = useReactToPrint({
  //   contentRef: tableRef,
  // });

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        setPrintingMode(true);
        setTimeout(() => {
          // handlePrint();
          setPrintingMode(false);
        }, 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getData = async () => {
    const { firstDay, lastDay } = getFirstAndLastDayOfMonth();
    const today = formatDate(new Date());
    const lastTenDaybook = await window.electron.getDaybookByFilters(
      [today, today],
      'ALL',
      'ALL',
      // @ts-ignore
      +localStorage.getItem('currentAccountId'),
    );
    setResults(lastTenDaybook);

    const ledgerDatae = await window.electron.getLedgerByFilters(
      [firstDay, lastDay],
      'ALL',
      selectedParty?.id as unknown as number,
      // @ts-ignore
      +localStorage.getItem('currentAccountId'),
    );
    console.log(ledgerDatae);

    setLedgerResults(ledgerDatae);

    const findD = await window.electron.getDaybookByFilters(
      [firstDay, lastDay],
      'ALL',
      'ALL',
      // @ts-ignore
      +localStorage.getItem('currentAccountId'),
    );
    setCurrentMonthExpenses(findD);

    setCurrentAccountId(
      // @ts-ignore
      +localStorage.getItem('currentAccountId'),
    );
    // console.log(+localStorage.getItem('currentAccountId'));
  };

  useEffect(() => {
    getData();
    console.log('die rn');
  }, [refreshState, selectedParty, isUpdateLedger]);

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const currentData = printingMode
    ? results
    : results.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      );
  const handlePageChange = (page: any) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const ledgerTotalPages = Math.ceil(ledgerResults.length / itemsPerPage);
  const currentLedgerData = printingMode
    ? ledgerResults
    : ledgerResults.slice(
        (ledgerCurrentPage - 1) * itemsPerPage,
        ledgerCurrentPage * itemsPerPage,
      );
  const handleLedgerPageChange = (page: any) => {
    if (page > 0 && page <= totalPages) {
      setLedgerCurrentPage(page);
    }
  };

  const handlePreview = (target: any) => {
    return new Promise(() => {
      const data = target.contentWindow.document.documentElement.innerHTML;

      const styles = target.contentWindow.document.querySelectorAll(
        'style, link[rel="stylesheet"]',
      );
      let injectedStyles = '';

      styles.forEach((style: any) => {
        if (style.tagName === 'STYLE') {
          injectedStyles += `<style>${style.innerHTML}</style>`;
        } else if (style.tagName === 'LINK') {
          injectedStyles += `<link rel="stylesheet" href="${style.href}">`;
        }
      });

      const fullContent = `
      <html>
        <head>
          ${injectedStyles}
        </head>
        <body>
          ${data}
        </body>
      </html>
    `;

      const blob = new Blob([fullContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      window.electron.preview(url);
    });
  };

  const handlePrint = useReactToPrint({
    // content: () => tableRef.current,
    contentRef: tableRef,
    documentTitle: 'Test',
    print: handlePreview,
  });

  const printTable = () => {
    setPrintingMode(true);
    setTimeout(() => {
      handlePrint();
      setPrintingMode(false);
    }, 0);
  };

  const handleDownloadPDF = () => {
    setPrintingMode(true);
  };

  const handleLedgerPint = useReactToPrint({
    // content: () => tableRef.current,
    contentRef: ledgerTableRef,
    documentTitle: 'Test',
    print: handlePreview,
  });

  const printLedgerTable = () => {
    setPrintingMode(true);
    setTimeout(() => {
      handleLedgerPint();
      setPrintingMode(false);
    }, 0);
  };

  const handleClickOutside = (event: any) => {
    // If the click is outside the sidebar, close the sidebar
    // @ts-ignore
    if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener when component is unmounted or sidebar is closed
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
        setAccountModalOpen={setAccountsModalOpen}
        setCurrentAccountId={setCurrentAccountId}
        setLoginModal={setLoginModal}
        currentAccountId={currentAccountId}
        refreshState={refreshState}
        activeTab={activeTab}
        setIsAddPartyModalOpen={setIsAddPartyModalShowing}
        setIsViewingLedgerShowing={setIsViewingLedgerShowing}
        setIsTableFooterShowing={setIsTableFooterShowing}
        setCurrentDate1={setCurrentDate1}
        setCurrentDate2={setCurrentDate2}
      />

      <div ref={sideBarRef}>
        <Sidebar
          currentMonthExpenses={results}
          isOpen={isOpen}
          searchData={searchData}
          setIsOpen={setIsOpen}
          setResults={setResults}
          setSearchData={setSearchData}
          toggleSidebar={toggleSidebar}
          setBackgroundColor={setBackgroundColor}
          setTextColor={setTextColor}
          currentAccountId={currentAccountId}
          refreshState={refreshState}
        />
      </div>

      <Tabs
        printingMode={printingMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsViewingLedgerShowing={setIsViewingLedgerShowing}
      />

      {/* Modal */}
      {isModalOpen && (
        <AddCategoryModal
          setIsModalOpen={setIsModalOpen}
          setActiveTab={setActiveTab}
          setIsViewingCategoryShowing={setIsViewingCategoryShowing}
          setRefreshState={setRefreshState}
        />
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

      {accountsModalOpen && (
        <AccountsModal
          setAccountModalOpen={setAccountsModalOpen}
          setCurrentAccountId={setCurrentAccountId}
          setRefreshState={setRefreshState}
          setLoginModal={setLoginModal}
        />
      )}

      {/* Tab: Transaction */}
      <SecondaryHeader
        activeTab={activeTab}
        backgroundColor={backgroundColor}
        printingMode={printingMode}
        results={results}
        searchData={searchData}
        setBackgroundColor={setBackgroundColor}
        setCurrentPage={setCurrentPage}
        setRefreshState={setRefreshState}
        setResults={setResults}
        setSearchData={setSearchData}
        setTextColor={setTextColor}
        textColor={textColor}
        toggleSidebar={toggleSidebar}
        refreshState={refreshState}
        setIsTableFooterShowing={setIsTableFooterShowing}
      />

      {isAddTransactionModalOpen && (
        <AddTransaction
          setRefreshState={setRefreshState}
          refreshState={refreshState}
          isAddTransactionModalOpen={isAddTransactionModalOpen}
          setIsAddTransactionModalOpen={setIsAddTransactionModalOpen}
        />
      )}

      {isAddLedgerModalOpen && (
        <AddLedger
          setRefreshState={setRefreshState}
          isAddLedgerModalOpen={isAddLedgerModalOpen}
          refreshState={refreshState}
          setIsAddLedgerModalOpen={setIsAddLedgerModalOpen}
        />
      )}

      {activeTab === 'Transaction' && (
        <Charts
          currentAccountId={currentAccountId}
          refreshState={refreshState}
          setSearchData={setSearchData}
          setResults={setResults}
          setBackgroundColor={setBackgroundColor}
          setTextColor={setTextColor}
          searchData={searchData}
          setIsTableFooterShowing={setIsTableFooterShowing}
          results={results}
          currentDate1={currentDate1}
          currentDate2={currentDate2}
          setCurrentDate1={setCurrentDate1}
          setCurrentDate2={setCurrentDate2}
        />
      )}

      <MainTable
        activeTab={activeTab}
        currentData={currentData}
        currentPage={currentPage}
        handleDownloadPDF={handleDownloadPDF}
        handlePageChange={handlePageChange}
        printTable={printTable}
        printingMode={printingMode}
        setIsDeleteTransactionModalOpen={setIsDeleteTransactionModalOpen}
        setIsUpdateDaybook={setIsUpdateDaybook}
        setRefreshState={setRefreshState}
        setSelectedDaybook={setSelectedDaybook}
        tableRef={tableRef}
        totalPages={totalPages}
        searchData={searchData}
        currentAccountId={currentAccountId}
        refreshState={refreshState}
        isTableFooterShowing={isTableFooterShowing}
      />

      {/* Ledger Table */}

      {isViewingLedgerShowing && (
        <MainLedgerTable
          activeTab={activeTab}
          currentAccountId={currentAccountId}
          printingMode={printingMode}
          refreshState={refreshState}
          setRefreshState={setRefreshState}
          currentLedgerData={currentLedgerData}
          handleLedgerPageChange={handleLedgerPageChange}
          ledgerCurrentPage={ledgerCurrentPage}
          ledgerTableRef={ledgerTableRef}
          ledgerTotalPages={ledgerTotalPages}
          printLedgerTable={printLedgerTable}
          isLedgerTableFooterShowing={isLedgerTableFooterShowing}
          selectedParty={selectedParty}
          setLedgerResults={setLedgerResults}
          setLedgerCurrentPage={setLedgerCurrentPage}
          setSelectedLedger={setSelectedLedger}
          setIsUpdateLedger={setIsUpdateLedger}
          setIsLedgerShowing={setIsViewingLedgerShowing}
          isUpdateLedger={isUpdateLedger}
        />
      )}

      {isUpdateLedger && selectedLedger && (
        <UpdateLedger
          selectedLedger={selectedLedger}
          setIsUpdateLedger={setIsUpdateLedger}
          setRefreshState={setRefreshState}
          setSelectedLedger={setSelectedLedger}
        />
      )}

      {/* Update Daybook Model */}
      {isUpdateDaybook && selectedDaybook && (
        <UpdateDaybook
          selectedDaybook={selectedDaybook}
          setIsUpdateDaybook={setIsUpdateDaybook}
          setRefreshState={setRefreshState}
          setSelectedDaybook={setSelectedDaybook}
          setIsDeleteTransactionModalOpen={setIsDeleteTransactionModalOpen}
        />
      )}

      {isDeleteCategoryModalOpen && (
        <DeleteCategoryModal
          selectedCategory={selectedCategory}
          setIsDeleteCategoryModalOpen={setIsDeleteCategoryModalOpen}
          setRefreshState={setRefreshState}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {isDeleteTransactionModalOpen && (
        <DeleteTransaction
          selectedDaybook={selectedDaybook}
          setIsDeleteTransactionModalOpen={setIsDeleteTransactionModalOpen}
          setRefreshState={setRefreshState}
          setSelectedDaybook={setSelectedDaybook}
        />
      )}

      {isDeletePartyModalOpen && (
        <DeletePartyModal
          selectedParty={selectedParty}
          setIsDeletePartyModalOpen={setIsDeletePartyModalOpen}
          setRefreshState={setRefreshState}
          setSelectedParty={setSelectedParty}
        />
      )}

      {isDeleteTransactionAccountModalOpen && (
        <DeleteTransactionAccountModal
          selectedTransactionAccount={selectedTransactionAccount}
          setSelectedTransactionAccount={setSelectedTransactionAccount}
          setIsDeleteTransactionAccountModalOpen={
            setIsDeleteTransactionAccountModalOpen
          }
          setRefreshState={setRefreshState}
        />
      )}

      {isEditCategoryModalOpen && (
        <EditCategoryModal
          selectedCategory={selectedCategory}
          setIsEditCategoryModalOpen={setIsEditCategoryModalOpen}
          setRefreshState={setRefreshState}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {isEditPartyModalOpen && (
        <EditPartyModal
          selectedParty={selectedParty}
          setIsEditPartyModalOpen={setIsEditPartyModalOpen}
          setRefreshState={setRefreshState}
          setSelectedParty={setSelectedParty}
        />
      )}

      {isEditTransactionAccountModalOpen && (
        <EditTransactionAccountModal
          selectedTransactionAccount={selectedTransactionAccount}
          setIsEditTransactionAccountModal={
            setIsEditTransactionAccountModalOpen
          }
          setRefreshState={setRefreshState}
          setSelectedTransactionAccount={setSelectedTransactionAccount}
        />
      )}

      {isViewCategoryShowing && (
        <ViewCategories
          setIsDeleteCategoryModalOpen={setIsDeleteCategoryModalOpen}
          setIsEditCategoryModalOpen={setIsEditCategoryModalOpen}
          setRefreshState={setRefreshState}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {activeTab === 'Ledger' && !isViewingLedgerShowing && (
        <ViewParties
          setRefreshState={setRefreshState}
          setSelectedParty={setSelectedParty}
          setIsDeletePartyModalOpen={setIsDeletePartyModalOpen}
          refreshState={refreshState}
          setIsEditPartyModalOpen={setIsEditPartyModalOpen}
          setIsViewingLedgerShowing={setIsViewingLedgerShowing}
        />
      )}

      {isAddPartyModalShowing && (
        <AddParty
          setActiveTab={setActiveTab}
          setIsModalOpen={setIsAddPartyModalShowing}
          // setIsViewingPartyShowing={setIsViewingPartyShowing}
          setRefreshState={setRefreshState}
        />
      )}

      {loginModal && (
        <LoginAccount
          selectedAccount={currentAccountId}
          setLoginModal={setLoginModal}
          setRefreshState={setRefreshState}
          setAccountModal={setAccountsModalOpen}
          setCurrentAccountId={setCurrentAccountId}
          setIsShowingChooseAccount={setAccountsModalOpen}
        />
      )}

      {isAddTransactionAccountModalOpen && (
        <AddTransactionAccountModal
          setIsModalOpen={setIsAddTransactionAccountModalOpen}
          setRefreshState={setRefreshState}
        />
      )}

      {activeTab === 'Account' && (
        <ViewTransactionAccounts
          refreshState={refreshState}
          setIsDeleteTransactionAccountModalOpen={
            setIsDeleteTransactionAccountModalOpen
          }
          setIsEditTransactionAccountModalOpen={
            setIsEditTransactionAccountModalOpen
          }
          setRefreshState={setRefreshState}
          setSelectedTransactionAccount={setSelectedTransactionAccount}
        />
      )}

      {/* {!loginModal &&
        !isViewCategoryShowing &&
        !isDeleteCategoryModalOpen &&
        !isDeleteTransactionModalOpen &&
        !isEditCategoryModalOpen &&
        !isUpdateDaybook &&
        !accountsModalOpen &&
        !isModalOpen && ( */}
      {/* // <div className="fire-wrapper"> */}
      {/* // <div className="fire-overlay"></div> */}
      <button
        // className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 px-2 py-2 text-white shadow-lg rounded-md z-[50000] transition-all duration-300 ease-in-out"
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${activeTab === 'Transaction' ? 'bg-green-500 hover:bg-green-600' : activeTab === 'Ledger' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-red-500 hover:bg-red-600'} py-2 text-white shadow-lg rounded-md z-[50000] transition-all duration-300 ease-in-out`}
        type="button"
        onClick={() => {
          if (activeTab === 'Transaction') {
            setIsAddTransactionModalOpen(true);
          } else if (activeTab === 'Ledger') {
            setIsAddLedgerModalOpen(true);
          } else if (activeTab === 'Account') {
            setIsAddTransactionAccountModalOpen(true);
          }
        }}
        onMouseEnter={() => setIsHovered(true)} // Hover starts
        onMouseLeave={() => setIsHovered(false)} // Hover ends
      >
        <span
          className={`inline-block transition-all duration-500 ease-in-out ${
            isHovered ? 'w-auto px-4' : 'w-12 px-2'
          }`}
        >
          {isHovered
            ? activeTab === 'Transaction'
              ? 'Add Entry'
              : activeTab === 'Ledger'
                ? 'Add Ledger'
                : 'Add Account'
            : '+'}
        </span>
      </button>
      {/* // </div> */}
      {/* )} */}
    </div>
  );
};

export default Home;
