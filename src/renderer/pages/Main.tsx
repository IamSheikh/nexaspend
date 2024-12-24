/* eslint-disable prettier/prettier */
/* eslint-disable react/function-component-definition */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IAccount } from '../../types';
import CreateNewAccountModal from '../components/CreateNewAccountModal';

const Main = ({ setRefreshState }: { setRefreshState: any }) => {
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const allAccounts =
        (await window.electron.getAllAccounts()) as IAccount[];
      setAccounts(allAccounts);
    })();
  }, [refresh]);

  const handleClick = (accountId: number) => {
    localStorage.setItem('currentAccountId', `${accountId}`);
    navigate('/home');
    setRefreshState((prev: any) => !prev);
  };

  return (
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
                  handleClick(account.id as number);
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
    </div>
  );
};

export default Main;
