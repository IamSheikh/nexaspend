/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/function-component-definition */
import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { IAccount } from '../../types';
import CreateNewAccountModal from '../components/CreateNewAccountModal';
import LoginAccount from '../components/LoginAccount';
import AccountsModal from '../components/AccountsModal';

const Main = ({ setRefreshState }: { setRefreshState: any }) => {
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [loginModal, setLoginModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<number>();
  const [isShowingChooseAccount, setIsShowingChooseAccount] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const allAccounts =
        (await window.electron.getAllAccounts()) as IAccount[];
      if (allAccounts.length === 0) {
        localStorage.removeItem('currentAccountId');
      }

      setAccounts(allAccounts);
    })();
  }, [refresh]);

  useEffect(() => {
    if (localStorage.getItem('currentAccountId') !== null) {
      console.log(localStorage.getItem('currentAccountId'));
      setLoginModal(true);
      console.log('hi');
    } else {
      setLoginModal(false);
    }
  }, []);

  // const handleClick = (accountId: number) => {
  //   localStorage.setItem('currentAccountId', `${accountId}`);
  //   navigate('/home');
  //   setRefreshState((prev: any) => !prev);
  // };
  const handleClick = () => {
    setLoginModal((prev) => !prev);
  };

  const date = new Date('');

  return date.getFullYear() === 2025 &&
    date.getMonth() === 0 &&
    date.getDate() === 1 ? (
    <div className="mt-4 ml-4">
      <h1>
        <b>🎉 Happy New Year, Ladies and Gentlemen! 🎉</b>
        <br />
        As we step into 2025, I want to thank you for all your support over the
        years. However, I must announce that this app will no longer work
        starting this year. It&apos;s been an amazing journey, but every story
        has its end. That said, if you don’t bring me a guitar this year, I
        might just build an app to auto-send reminders to your inbox every hour.
        😏 Let’s make 2025 a harmonious year—literally! Wishing you success,
        joy, and better decision-making this year!
        <br />
        <br />
        Warm regards,
        <br />
        Tàhà Jameel
      </h1>
    </div>
  ) : localStorage.getItem('currentAccountId') === null ||
    localStorage.getItem('currentAccountId') === undefined ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Choose an Account
        </h1>
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
                  handleClick();
                  setSelectedAccount(account.id);
                }}
              >
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    {account.name}
                  </p>
                </div>
                {/* <span className="text-indigo-500 font-semibold">Log In</span> */}
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
      {loginModal && (
        <LoginAccount
          selectedAccount={selectedAccount}
          setRefreshState={setRefreshState}
          setLoginModal={setLoginModal}
        />
      )}
    </div>
  ) : (
    <>
      {loginModal && (
        <LoginAccount
          // @ts-ignore
          // selectedAccount={+localStorage.getItem('currentAccountId')}
          selectedAccount={+localStorage.getItem('currentAccountId')}
          setRefreshState={setRefreshState}
          setLoginModal={setLoginModal}
          setIsShowingChooseAccount={setIsShowingChooseAccount}
        />
      )}

      {isShowingChooseAccount && (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 z-50">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
            <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Choose an Account
            </h1>
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
                      handleClick();
                      setSelectedAccount(account.id);
                    }}
                  >
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        {account.name}
                      </p>
                    </div>
                    {/* <span className="text-indigo-500 font-semibold">Log In</span> */}
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
        </div>
      )}
    </>
  );
};

export default Main;
