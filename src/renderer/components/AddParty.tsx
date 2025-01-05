/* eslint-disable prettier/prettier */
/* eslint-disable react/function-component-definition */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { IParty } from '../../types';

const AddParty = ({
  setActiveTab,
  setIsModalOpen,
  setIsViewingPartyShowing,
  setRefreshState,
}: {
  setIsModalOpen: any;
  setActiveTab: any;
  setIsViewingPartyShowing: any;
  setRefreshState: any;
}) => {
  const [partyInputData, setPartyInputData] = useState<IParty>({
    // @ts-ignore
    accountId: +localStorage.getItem('currentAccountId'),
    address: '',
    balance: 0,
    details: '',
    email: '',
    mobileNumber: '',
    partyName: '',
  });

  const handleModalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await window.electron.addParty(partyInputData);
    toast('New Party Successfully Added', {
      type: 'success',
    });
    setIsModalOpen(false);
    setPartyInputData({
      // @ts-ignore
      accountId: +localStorage.getItem('currentAccountId'),
      address: '',
      balance: 0,
      details: '',
      email: '',
      mobileNumber: '',
      partyName: '',
    });
    setRefreshState((prev: any) => !prev);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-transform duration-500 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/12 transform transition-transform duration-500 ease-in-out">
        <h2 className="text-xl font-semibold mb-4">Add New Party</h2>

        {/* Modal Form */}
        <form onSubmit={handleModalSubmit}>
          {/* Name */}
          <div className="flex items-center space-x-2 mt-4 w-full">
            <label
              htmlFor="partyName"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Name:
            </label>
            <input
              id="partyName"
              type="text"
              placeholder="Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-2/3 ml-2"
              required
              value={partyInputData.partyName}
              onChange={(e) => {
                const clone = { ...partyInputData };
                clone.partyName = e.target.value;
                setPartyInputData(clone);
              }}
            />
          </div>

          <div className="flex items-center space-x-2 mt-4 w-full">
            <label
              htmlFor="mobileNumber"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Mobile Number:
            </label>
            <input
              id="mobileNumber"
              type="text"
              placeholder="Mobile Number"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-2/3 ml-2"
              value={partyInputData.mobileNumber}
              onChange={(e) => {
                const clone = { ...partyInputData };
                clone.mobileNumber = e.target.value;
                setPartyInputData(clone);
              }}
            />
          </div>

          <div className="flex items-center space-x-2 mt-4 w-full">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Address:
            </label>
            <input
              id="address"
              type="text"
              placeholder="Address"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-2/3 ml-2"
              value={partyInputData.address}
              onChange={(e) => {
                const clone = { ...partyInputData };
                clone.address = e.target.value;
                setPartyInputData(clone);
              }}
            />
          </div>

          <div className="flex items-center space-x-2 mt-4 w-full">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Email:
            </label>
            <input
              id="email"
              type="text"
              placeholder="Email"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-2/3 ml-2"
              value={partyInputData.address}
              onChange={(e) => {
                const clone = { ...partyInputData };
                clone.email = e.target.value;
                setPartyInputData(clone);
              }}
            />
          </div>

          <div className="flex items-center space-x-2 mt-4 w-full">
            <label
              htmlFor="details"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              More About:
            </label>
            <input
              id="details"
              type="text"
              placeholder="More About"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-2/3 ml-2"
              value={partyInputData.details}
              onChange={(e) => {
                const clone = { ...partyInputData };
                clone.details = e.target.value;
                setPartyInputData(clone);
              }}
            />
          </div>

          {/* Modal Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-3"
              onClick={() => {
                setIsModalOpen(false);
                setActiveTab('Ledger');
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ml-2"
              onClick={() => {
                setIsViewingPartyShowing(true);
                setIsModalOpen(false);
                setActiveTab('liquidation');
              }}
            >
              View Parties
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddParty;
