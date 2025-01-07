/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useState, useEffect, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { ILedger, IParty } from '../../types';

const UpdateLedger = ({
  selectedLedger,
  setSelectedLedger,
  setIsUpdateLedger,
  setRefreshState,
}: {
  selectedLedger: any;
  setSelectedLedger: any;
  setIsUpdateLedger: any;
  setRefreshState: any;
}) => {
  //   const [incomeCategories, setIncomeCategories] = useState<ICategory[]>([]);
  //   const [expenseCategories, setExpenseCategories] = useState<ICategory[]>([]);
  const [parties, setParties] = useState<IParty[]>([]);
  const [clonedLedger, setClonedLedger] = useState<ILedger>();
  const originalAccount = selectedLedger.accountId;

  //   useEffect(() => {
  //     (async () => {
  //       const allAccounts =
  //         (await window.electron.getAllAccounts()) as IAccount[];
  //       setAccounts(allAccounts);
  //     })();
  //   }, []);

  useEffect(() => {
    (async () => {
      const allParties = (await window.electron.getAllParties(
        // @ts-ignore
        selectedLedger.accountId,
      )) as IParty[];
      setParties(allParties);

      if (selectedLedger.accountId !== originalAccount) {
        const clone = { ...selectedLedger };
        clone.partyId = allParties[0].id;
        setSelectedLedger(clone);
      }
    })();
  }, [selectedLedger.accountId]);

  useEffect(() => {
    setClonedLedger(selectedLedger);
  }, []);

  const handleUpdateDaybook = async (e: FormEvent) => {
    e.preventDefault();

    await window.electron.updateLedger(selectedLedger as ILedger);

    const findParty = parties.find(
      (party) => party.id === selectedLedger.partyId,
    ) as IParty;

    if (selectedLedger.transaction_type === 'YOU GAVE') {
      const newBalance =
        // @ts-ignore
        findParty.balance + clonedLedger?.amount - selectedLedger.amount;
      await window.electron.updateParty({
        ...findParty,
        balance: newBalance,
      });
    } else {
      const newBalance =
        // @ts-ignore
        findParty.balance - clonedLedger?.amount + selectedLedger.amount;
      await window.electron.updateParty({
        ...findParty,
        balance: newBalance,
      });
    }

    setRefreshState((prev: any) => !prev);

    toast('Ledger Updated Successfully', {
      type: 'success',
    });

    setSelectedLedger(undefined);
    setIsUpdateLedger(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-transform duration-500 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/12 transform transition-transform duration-500 ease-in-out">
        <h2 className="text-xl font-semibold mb-4">Update Entry</h2>

        <form onSubmit={handleUpdateDaybook}>
          {/* Amount */}
          <div className="flex items-center space-x-2 mb-4">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Amount:
            </label>
            <input
              id="amount"
              type="number"
              min={0}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={selectedLedger.amount}
              onChange={(e) => {
                const clone = { ...selectedLedger };
                clone.amount = +e.target.value;
                setSelectedLedger(clone);
              }}
            />
          </div>

          {/* Date */}
          <div className="flex items-center space-x-2 mb-4">
            <label
              htmlFor="date"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Date:
            </label>
            <input
              id="date"
              type="date"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={selectedLedger.date}
              onChange={(e) => {
                const clone = { ...selectedLedger };
                clone.date = e.target.value;
                setSelectedLedger(clone);
              }}
            />
          </div>

          {/* Category */}
          {/* <div className="flex items-center space-x-2 mb-4">
            <label
              htmlFor="party"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Party:
            </label>
            <select
              id="party"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={selectedLedger.partyId}
              onChange={(e) => {
                const clone = { ...selectedLedger };
                clone.partyId = +e.target.value;
                setSelectedLedger(clone);
              }}
            >
              {parties.map((party) => (
                <option key={party.id} value={party.id}>
                  {party.partyName}
                </option>
              ))}
            </select>
          </div> */}

          {/* Details */}
          <div className="flex items-center space-x-2 mb-4">
            <label
              htmlFor="details"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Details:
            </label>
            <input
              id="details"
              type="text"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={selectedLedger.details}
              onChange={(e) => {
                const clone = { ...selectedLedger };
                clone.details = e.target.value;
                setSelectedLedger(clone);
              }}
            />
          </div>

          {/* Modal Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-3"
              onClick={() => {
                setIsUpdateLedger(false);
                setSelectedLedger(undefined);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Edit
            </button>
          </div>

          {/* <div className="w-full flex"> */}
          {/* </div> */}
        </form>
      </div>
    </div>
  );
};

export default UpdateLedger;
