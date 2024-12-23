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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { IDaybook, ICategory } from '../../types';
import '../styles/dist/dist.css';
import { getFirstAndLastDayOfMonth } from '../utils';
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

const Home = () => {
  const tableRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [results, setResults] = useState<IDaybook[]>([]);
  const [refreshState, setRefreshState] = useState(false);
  const [searchData, setSearchData] = useState({
    startDate: '',
    endDate: '',
    entryType: 'ALL',
    categoryId: 'ALL',
  });
  const [isUpdateDaybook, setIsUpdateDaybook] = useState(false);
  const [selectedDaybook, setSelectedDaybook] = useState<IDaybook>();
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

  const getData = async () => {
    const { firstDay, lastDay } = getFirstAndLastDayOfMonth();
    const lastTenDaybook = await window.electron.getDaybookByFilters(
      [firstDay, lastDay],
      'ALL',
      'ALL',
    );
    setResults(lastTenDaybook);

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

  const printTable = () => {
    setPrintingMode(true);
    setTimeout(() => {
      handlePrint();
      setPrintingMode(false);
    }, 0);
  };

  const handleDownloadPDF = () => {
    setPrintingMode(true);

    setTimeout(() => {
      const element = document.getElementById('table-container') as any;
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('table-styled.pdf');
      });

      setPrintingMode(false);
    }, 0);
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
      />

      {activeTab !== 'Transaction' && (
        <AddTransaction
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setRefreshState={setRefreshState}
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
      />

      {/* Update Daybook Model */}
      {isUpdateDaybook && selectedDaybook && (
        <UpdateDaybook
          selectedDaybook={selectedDaybook}
          setIsUpdateDaybook={setIsUpdateDaybook}
          setRefreshState={setRefreshState}
          setSelectedDaybook={setSelectedDaybook}
        />
      )}

      {/* Delete Category Modal */}
      {isDeleteCategoryModalOpen && (
        <DeleteCategoryModal
          selectedCategory={selectedCategory}
          setIsDeleteCategoryModalOpen={setIsDeleteCategoryModalOpen}
          setRefreshState={setRefreshState}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {/* Delete Transaction Modal */}
      {isDeleteTransactionModalOpen && (
        <DeleteTransaction
          selectedDaybook={selectedDaybook}
          setIsDeleteTransactionModalOpen={setIsDeleteTransactionModalOpen}
          setRefreshState={setRefreshState}
          setSelectedDaybook={setSelectedDaybook}
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

      {isViewCategoryShowing && (
        <ViewCategories
          setIsDeleteCategoryModalOpen={setIsDeleteCategoryModalOpen}
          setIsEditCategoryModalOpen={setIsEditCategoryModalOpen}
          setRefreshState={setRefreshState}
          setSelectedCategory={setSelectedCategory}
        />
      )}
    </div>
  );
};

export default Home;
