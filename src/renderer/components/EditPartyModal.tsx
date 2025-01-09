/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { FormEvent } from 'react';
import { toast } from 'react-toastify';
import { IParty } from '../../types';

const EditPartyModal = ({
  selectedParty,
  setSelectedParty,
  setIsEditPartyModalOpen,
  setRefreshState,
}: {
  selectedParty: any;
  setSelectedParty: any;
  setIsEditPartyModalOpen: any;
  setRefreshState: any;
}) => {
  const handleUpdateCategory = async (e: FormEvent) => {
    e.preventDefault();
    await window.electron.updateParty(selectedParty as IParty);
    toast('Party successfully updated', {
      type: 'success',
    });
    setIsEditPartyModalOpen(false);
    setSelectedParty(undefined);
    setRefreshState((prev: any) => !prev);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-transform duration-500 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/12 transform transition-transform duration-500 ease-in-out">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Update Party</h2>

          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-3"
            type="button"
            onClick={() => {
              setIsEditPartyModalOpen(false);
              setSelectedParty(undefined);
            }}
          >
            X
          </button>
        </div>

        <form onSubmit={handleUpdateCategory}>
          {/* Name */}
          <div className="flex items-center space-x-2 mt-4 w-full">
            <label
              htmlFor="partyName"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Party Name:
            </label>
            <input
              id="partyName"
              type="text"
              placeholder="Party Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-2/3 ml-2"
              value={selectedParty.partyName}
              onChange={(e) => {
                const clone = { ...selectedParty };
                clone.partyName = e.target.value;
                setSelectedParty(clone);
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
              value={selectedParty.mobileNumber}
              onChange={(e) => {
                const clone = { ...selectedParty };
                clone.mobileNumber = e.target.value;
                setSelectedParty(clone);
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
              value={selectedParty.address}
              onChange={(e) => {
                const clone = { ...selectedParty };
                clone.address = e.target.value;
                setSelectedParty(clone);
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
              value={selectedParty.email}
              onChange={(e) => {
                const clone = { ...selectedParty };
                clone.email = e.target.value;
                setSelectedParty(clone);
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
              value={selectedParty.details}
              onChange={(e) => {
                const clone = { ...selectedParty };
                clone.details = e.target.value;
                setSelectedParty(clone);
              }}
            />
          </div>

          {/* Modal Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-3"
              onClick={() => {
                setIsEditPartyModalOpen(false);
                setSelectedParty(undefined);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPartyModal;
