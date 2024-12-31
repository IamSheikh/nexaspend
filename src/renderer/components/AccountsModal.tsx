/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/require-default-props */
/* eslint-disable react/function-component-definition */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { useEffect, useState } from 'react';
import { IAccount } from '../../types';
import CreateNewAccountModal from './CreateNewAccountModal';

const AccountsModal = ({
  setAccountModalOpen,
  setCurrentAccountId,
  setRefreshState,
  setLoginModal,
}: {
  setAccountModalOpen: any;
  setCurrentAccountId: any;
  setLoginModal: any;
  setRefreshState: any;
}) => {
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const allAccounts =
        (await window.electron.getAllAccounts()) as IAccount[];
      setAccounts(allAccounts);
    })();
  }, [refresh]);

  const handleClick = (accountId: number) => {
    // localStorage.removeItem('currentAccountId');
    // localStorage.setItem('currentAccountId', `${accountId}`);
    // setCurrentAccountId(accountId);
    // setAccountModalOpen((prev: any) => !prev);
    // setRefreshState((prev: any) => !prev);
    // localStorage.setItem('currentAccountId', `${accountId}`);
    setCurrentAccountId(accountId);
    // setRefreshState((prev: any) => !prev);
    setLoginModal((prev: any) => !prev);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-transform duration-500 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/12 transform transition-transform duration-500 ease-in-out">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold mb-4">All Accounts</h2>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-3"
            type="button"
            onClick={() => {
              setAccountModalOpen((prev: any) => !prev);
            }}
          >
            X
          </button>
        </div>
        <div className="space-y-4">
          {accounts.length === 0 ? (
            <h1 className="text-gray-500">There are no accounts</h1>
          ) : (
            accounts.map((account) => (
              <button
                type="button"
                key={account.id}
                className="w-full px-4 py-3 flex items-center justify-between border rounded-lg hover:bg-gray-50 focus:ring focus:ring-indigo-200 focus:outline-none"
                onClick={() => {
                  handleClick(account.id as number);
                }}
              >
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    {account.name}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="mt-6">
          <button
            className="w-full py-3 text-center bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:ring focus:ring-indigo-300 focus:outline-none"
            type="button"
            onClick={() => {
              setIsModalOpen((prev) => !prev);
            }}
          >
            Create a New Account
          </button>
        </div>
      </div>
      {isModalOpen && (
        <CreateNewAccountModal
          setIsModalOpen={setIsModalOpen}
          setRefreshState={setRefresh}
        />
      )}
    </div>
  );
};

export default AccountsModal;
