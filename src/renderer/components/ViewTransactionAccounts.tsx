/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useState, useEffect } from 'react';
import numeral from 'numeral';
import { ITransactionAccount } from '../../types';

const ViewTransactionAccounts = ({
  setSelectedTransactionAccount,
  setRefreshState,
  setIsDeleteTransactionAccountModalOpen,
  setIsEditTransactionAccountModalOpen,
  refreshState,
}: {
  setSelectedTransactionAccount: any;
  setRefreshState: any;
  setIsDeleteTransactionAccountModalOpen: any;
  refreshState: any;
  setIsEditTransactionAccountModalOpen: any;
}) => {
  const [accounts, setAccounts] = useState<ITransactionAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<
    ITransactionAccount[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      const allAccounts = (await window.electron.getAllTransactionAccounts(
        // @ts-ignore
        +localStorage.getItem('currentAccountId'),
      )) as ITransactionAccount[];
      setAccounts(allAccounts);
    })();
  }, [refreshState]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAccounts(accounts);
    } else {
      setFilteredAccounts(
        accounts.filter((account) =>
          account.accountName.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }
  }, [searchQuery, accounts]);

  return (
    <div className="flex justify-center flex-col items-center self-center mt-4">
      <h1 className="text-3xl font-semibold mb-4">All Accounts</h1>
      <div className="relative w-3/4 mb-2 flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search account..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <table className="table-auto border-collapse border border-gray-300 w-[95vw]">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-2">No.</th>
            <th className="border border-gray-300 px-2">Name</th>
            <th className="border border-gray-300 px-2">Balance</th>
            <th className="border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map((da, index) => (
            <tr
              className="text-center"
              onClick={() => {
                setSelectedTransactionAccount(da);
              }}
              key={da.id}
            >
              <td className="border border-gray-300 px-2">{index + 1}</td>
              <td className="border border-gray-300 px-2 text-left">
                {da.accountName}
              </td>
              <td className="border border-gray-300 px-2 text-left">
                {Math.sign(da.balance) !== -1 ? (
                  numeral(da.balance).format('0,0')
                ) : (
                  <span className="text-red-500">
                    {numeral(Math.abs(da.balance)).format('0,0')}
                  </span>
                )}
              </td>
              <td className="border border-gray-300 px-2 flex justify-center items-center">
                {da.accountName === 'abc' ? (
                  'hey you you cannot edit and delete this one good luck mate'
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTransactionAccount(da);
                        setIsEditTransactionAccountModalOpen(true);
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
                    {da.balance === 0 && da.accountName !== 'Cash' && (
                      <button
                        type="button"
                        className="bg-transparent font-semibold py-1 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ml-2"
                        onClick={async (e) => {
                          e.stopPropagation();
                          setSelectedTransactionAccount(da);
                          setIsDeleteTransactionAccountModalOpen(true);
                          setRefreshState((prev: any) => !prev);
                        }}
                      >
                        X
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTransactionAccounts;
