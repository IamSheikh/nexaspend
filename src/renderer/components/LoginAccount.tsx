/* eslint-disable prettier/prettier */
/* eslint-disable react/require-default-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/function-component-definition */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IAccount } from '../../types';

const LoginAccount = ({
  selectedAccount,
  setRefreshState,
  setLoginModal,
  setAccountModal,
  setCurrentAccountId,
  loginModal,
  setIsShowingChooseAccount,
}: {
  selectedAccount: any;
  setRefreshState: any;
  setLoginModal: any;
  setAccountModal?: any;
  setCurrentAccountId?: any;
  loginModal?: any;
  setIsShowingChooseAccount?: any;
}) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [account, setAccount] = useState<IAccount>();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const allAccounts =
        (await window.electron.getAllAccounts()) as IAccount[];
      const currentAccount = allAccounts.find(
        (acc) => acc.id === +selectedAccount,
      );
      setAccount(currentAccount);
    })();
  }, [selectedAccount]);

  const handleInputChange = (value: any, index: any) => {
    if (/^\d?$/.test(value)) {
      const updatedPin = [...pin];
      updatedPin[index] = value;
      setPin(updatedPin);

      if (value && index < 3) {
        // @ts-ignore
        document.getElementById(`pin-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e: any, index: any) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      // @ts-ignore
      document.getElementById(`pin-${index - 1}`).focus();
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const fullPin = pin.join('');
    if (fullPin !== account?.pin) {
      setError('Incorrect Pin');
    } else {
      setError('');
      setPin(['', '', '', '']);
      localStorage.removeItem('currentAccountId');
      localStorage.setItem('currentAccountId', `${account.id}`);
      navigate('/home');
      setRefreshState((prev: any) => !prev);
      setLoginModal(false);
      if (setAccountModal) {
        setAccountModal(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-transform duration-500 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/12 transform transition-transform duration-500 ease-in-out">
        <h2 className="text-xl font-semibold">{account?.name}</h2>
        <form onSubmit={handleLogin}>
          <div className="flex items-center space-x-2 mt-4 w-full">
            <label className="text-sm font-medium text-gray-700 w-1/3">
              PIN:
            </label>
            <div className="flex space-x-2 w-2/3">
              {pin.map((digit, index: any) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="password"
                  maxLength={1}
                  required
                  value={digit}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="border border-gray-300 rounded-lg px-2 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-12"
                />
              ))}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}{' '}
          {/* Error message */}
          {/* Modal Buttons */}
          <div className="flex justify-end mt-4">
            {loginModal ? (
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-3"
                onClick={() => {
                  if (setCurrentAccountId) {
                    // setCurrentAccountId(prev => !prev)
                  }
                  setLoginModal(false);
                }}
              >
                Cancel
              </button>
            ) : (
              ''
            )}

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>
          <button
            type="button"
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mr-3 w-full mt-5"
            onClick={() => {
              setLoginModal((prev: any) => !prev);
              if (setIsShowingChooseAccount) {
                setIsShowingChooseAccount(true);
              }
            }}
          >
            Choose Different Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAccount;
