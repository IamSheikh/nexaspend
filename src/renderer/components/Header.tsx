/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useEffect, useRef, useState } from 'react';
import { IAccount } from '../../types';
import CreateNewAccountModal from './CreateNewAccountModal';
import EditAccount from './EditAccount';
import { calculateLuminance, getRandomColor } from '../utils';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditAccountModalShowing, setIsEditAccountModalShowing] =
    useState(false);
  const [selectedAccount, setSelectedAccount] = useState<IAccount>();
  const [backgroundColor, setBG] = useState<any>();
  const [textColor, setTC] = useState<any>();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);
  const dropdownRef = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    (async () => {
      const allAccounts =
        (await window.electron.getAllAccounts()) as IAccount[];
      setAccounts(allAccounts);
    })();

    const newColor = getRandomColor();
    setBG(newColor);
    setTC(calculateLuminance(newColor));
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
    // const newAccount = accounts.find((account) => account.id === accountId);
    // setCurrentAccount(newAccount);
    setCurrentAccountId(accountId);
    setLoginModal((prev: any) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false); // Close dropdown
      }
    };

    // Attach event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const date = new Date();

  return (
    <>
      <div
        className={`flex justify-between items-center p-2 top-0 sticky z-50 bg-white ${
          printingMode ? 'hidden' : ''
        }`}
        style={{ height: '64px' }} // Fixed header height to avoid layout shifting
      >
        {/* Logo Section */}
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
          {['A', 'Q', 'A', 'S', 'A'].map((letter, index) => (
            <span
              key={index}
              className={`${
                [
                  'text-red-500',
                  'text-orange-500',
                  'text-yellow-300',
                  'text-green-500',
                  'text-blue-500',
                ][index]
              }`}
            >
              {letter}
            </span>
          ))}
        </h1>

        <h1 className="text-center text-xl font-semibold">
          {date.getDate() === 1 &&
            date.getMonth() + 1 === 1 &&
            'Happy New Year, Clown 🤡'}
        </h1>

        {/* Action Buttons */}
        <div className="flex items-center ml-3">
          <div className="flex items-center relative mr-2">
            {/* Text + Button Wrapper */}
            <div className="flex items-center">
              <span className="text-green-500 text-lg font-bold">
                Welcome to
              </span>
              <button
                className="ml-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 focus:ring focus:ring-indigo-200 focus:outline-none"
                style={{ backgroundColor, color: textColor }}
                type="button"
                onClick={toggleDropdown}
                ref={buttonRef}
              >
                {currentAccount?.name || 'Select Account'}
              </button>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg z-50 w-[16.5rem]"
                style={{
                  top: '100%', // Position the dropdown directly below the button
                  left: '0', // Align it to the left of the parent container
                }}
                ref={dropdownRef}
              >
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      handleClick(account.id as number);
                      closeDropdown();
                    }}
                  >
                    <span className="text-gray-700">{account.name}</span>
                    <div className="flex space-x-2">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        style={{
                          display:
                            currentAccount?.id === account.id
                              ? 'block'
                              : 'none',
                        }}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedAccount(account);
                          setIsEditAccountModalShowing((prev) => !prev);
                          // alert('Edit account functionality here');
                          closeDropdown();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="black"
                          width={20}
                          height={20}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                <div
                  // key={account.id}
                  className="flex items-center justify-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setIsAccountModal(true)}
                >
                  <span>Add Account</span>
                </div>
              </div>
            )}
          </div>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            Category
          </button>
        </div>
      </div>

      {/* Modal for Adding New Account */}
      {isAccountModal && (
        <CreateNewAccountModal
          setIsModalOpen={setIsAccountModal}
          setRefreshState={setRefreshState}
        />
      )}

      {isEditAccountModalShowing && (
        <EditAccount
          selectedAccount={selectedAccount}
          setIsModalOpen={setIsEditAccountModalShowing}
          setRefreshState={setRefreshState}
          setSelectedAccount={setSelectedAccount}
        />
      )}
    </>
  );
};

export default Header;
