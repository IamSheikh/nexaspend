/* eslint-disable prettier/prettier */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/function-component-definition */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import IAccount from '../../types/IAccount';

const CreateNewAccountModal = ({
  setIsModalOpen,
  setRefreshState,
}: {
  setIsModalOpen: any;
  setRefreshState: any;
}) => {
  const [accountInputData, setAccountInputData] = useState<IAccount>({
    name: '',
    pin: '',
  });
  const [pin, setPin] = useState(['', '', '', '']);

  const handleModalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fullPin = pin.join('');
    await window.electron.addAccount({
      name: accountInputData.name,
      pin: fullPin,
    });
    toast('New Account Successfully Added', {
      type: 'success',
    });
    setIsModalOpen(false);
    setAccountInputData({
      name: '',
      pin: '',
    });
    setRefreshState((prev: any) => !prev);
  };
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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-transform duration-500 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/12 transform transition-transform duration-500 ease-in-out">
        <h2 className="text-xl font-semibold mb-4">Create New Account</h2>

        {/* Modal Form */}
        <form onSubmit={handleModalSubmit}>
          {/* Name */}
          <div className="flex items-center space-x-2 mt-4 w-full">
            <label
              htmlFor="accountName"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Name:
            </label>
            <input
              id="accountName"
              type="text"
              placeholder="Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-2/3 ml-2"
              required
              value={accountInputData.name}
              onChange={(e) => {
                const clone = { ...accountInputData };
                clone.name = e.target.value;
                setAccountInputData(clone);
              }}
            />
          </div>
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

          {/* Modal Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-3"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewAccountModal;
