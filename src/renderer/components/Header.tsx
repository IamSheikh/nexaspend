/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useEffect, useState } from 'react';
import { IAccount } from '../../types';

const Header = ({
  printingMode,
  setActiveTab,
  setIsViewingCategoryShowing,
  setRefreshState,
  setSearchData,
  setBackgroundColor,
  setTextColor,
  setAccountModalOpen,
  setIsModalOpen,
  currentAccountId,
  refreshState,
}: {
  printingMode: any;
  setActiveTab: any;
  setIsViewingCategoryShowing: any;
  setRefreshState: any;
  setSearchData: any;
  setBackgroundColor: any;
  setTextColor: any;
  setIsModalOpen: any;
  setAccountModalOpen: any;
  currentAccountId: any;
  refreshState: any;
}) => {
  const [currentAccount, setCurrentAccount] = useState<IAccount>();

  useEffect(() => {
    (async () => {
      const allAccounts =
        (await window.electron.getAllAccounts()) as IAccount[];
      const account = allAccounts.find(
        (acc) =>
          acc.id ===
          // @ts-ignore
          currentAccountId,
      );
      console.log(currentAccountId);
      setCurrentAccount(account);
    })();
  }, [refreshState]);

  return (
    <div
      className={`flex justify-between mt-2 mb-2 p-2 top-0 sticky z-50 bg-white ${printingMode && 'hidden'}`}
    >
      <h1
        className="text-4xl font-bold cursor-pointer"
        onClick={() => {
          setActiveTab('Transaction');
          setIsViewingCategoryShowing(false);
          setRefreshState((prev: any) => !prev);
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
          className="bg-white  text-black font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ml-2"
          type="button"
          onClick={() => {
            setAccountModalOpen((prev: any) => !prev);
          }}
        >
          {currentAccount?.name}
        </button>
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
  );
};

export default Header;
