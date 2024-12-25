/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useEffect, useState } from 'react';
import { IAccount } from '../../types';
import CreateNewAccountModal from './CreateNewAccountModal';

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
  setCurrentAccountId,
  setLoginModal,
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
  setCurrentAccountId: any;
  setLoginModal: any;
}) => {
  const [currentAccount, setCurrentAccount] = useState<IAccount>();
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [isAccountModal, setIsAccountModal] = useState(false);

  useEffect(() => {
    (async () => {
      const allAccounts =
        (await window.electron.getAllAccounts()) as IAccount[];
      setAccounts(allAccounts);
    })();
  }, [refreshState]);

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
      setCurrentAccount(account);
    })();
  }, [refreshState]);

  const handleClick = (accountId: number) => {
    const newAccount = accounts.find((account) => account.id === accountId);
    setCurrentAccount(newAccount);
    setCurrentAccountId(accountId);
    setLoginModal((prev: any) => !prev);
  };

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
      <div className="flex">
        <div className="flex items-center">
          <span className="text-gray-700 text-lg">Welcome to</span>
          <select
            className="ml-2 px-4 py-2 border rounded-lg bg-gray-200 hover:bg-gray-300 focus:ring focus:ring-indigo-200 focus:outline-none"
            onChange={(e) => handleClick(Number(e.target.value))}
            value={currentAccount?.id || ''}
          >
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No accounts available
              </option>
            )}
          </select>
        </div>
        <div className="flex items-center">
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ml-3"
            type="button"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Category
          </button>
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ml-3"
            type="button"
            onClick={() => {
              setIsAccountModal(true);
            }}
          >
            Add Account
          </button>
        </div>
      </div>

      {isAccountModal && (
        <CreateNewAccountModal
          setIsModalOpen={setIsAccountModal}
          setRefreshState={setRefreshState}
        />
      )}
    </div>
  );
};

export default Header;
