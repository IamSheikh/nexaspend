/* eslint-disable prettier/prettier */
/* eslint-disable no-lonely-if */
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
  const [isInputDisabled, setIsInputDisabled] = useState(true);
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

  useEffect(() => {
    setRefreshState((prev: any) => !prev);
  }, []);

  const handleUpdateDaybook = async (e: FormEvent) => {
    e.preventDefault();

    if (!isInputDisabled) {
      await window.electron.updateLedger(selectedLedger as ILedger);

      if (clonedLedger?.partyId === selectedLedger.partyId) {
        const findParty = parties.find(
          (party) => party.id === selectedLedger.partyId,
        ) as IParty;

        if (
          clonedLedger?.transaction_type === selectedLedger.transaction_type
        ) {
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
        } else {
          if (selectedLedger.transaction_type === 'YOU RECEIVED') {
            if (selectedLedger.amount === clonedLedger?.amount) {
              const newBalance =
                // @ts-ignore
                findParty.balance + 2 * clonedLedger?.amount;
              await window.electron.updateParty({
                ...findParty,
                balance: newBalance,
              });
              console.log('hi');
            } else {
              // @ts-ignore
              const psycho = findParty.balance + clonedLedger?.amount;

              // console.log(psycho + selectedLedger.amount);
              // findParty.balance - clonedLedger.amount + selectedLedger.amount
              // -1000 + 1000 = 0 + 2000 = 2000

              await window.electron.updateParty({
                ...findParty,
                balance: psycho + selectedLedger.amount,
              });
            }
          } else if (selectedLedger.transaction_type === 'YOU GAVE') {
            // c'mon do something
            if (selectedLedger.amount === clonedLedger?.amount) {
              // @ts-ignore
              const newBalance = findParty.balance - 2 * clonedLedger?.amount;
              await window.electron.updateParty({
                ...findParty,
                balance: newBalance,
              });
            } else {
              // @ts-ignore
              // const newBalance = findParty.balance - 2 * selectedLedger?.amount;
              const psycho = findParty.balance - clonedLedger?.amount;
              await window.electron.updateParty({
                ...findParty,
                balance: psycho - selectedLedger.amount,
              });
            }
          }
        }
      } else {
        const currentParty = parties.find(
          // @ts-ignore
          (party) => party.id === +clonedLedger?.partyId,
        ) as IParty;
        console.log(selectedLedger);
        const newParty = parties.find(
          (party) => party.id === +selectedLedger?.partyId,
        ) as IParty;
        // console.log(currentParty.balance + selectedLedger.amount);

        if (
          selectedLedger.transaction_type === 'YOU GAVE' &&
          clonedLedger?.transaction_type !== 'YOU GAVE'
        ) {
          await window.electron.updateParty({
            ...currentParty,
            balance: currentParty.balance + selectedLedger.amount,
          });

          await window.electron.updateParty({
            ...newParty,
            balance: newParty.balance - selectedLedger.amount,
          });
        } else if (
          selectedLedger.transaction_type === 'YOU RECEIVED' &&
          clonedLedger?.transaction_type !== 'YOU RECEIVED'
        ) {
          const newBalanceOfPreviousParty =
            currentParty.balance - selectedLedger.amount;
          const newBalanceOfNewParty =
            // @ts-ignore
            newParty.balance + selectedLedger.amount;

          // findParty.balance + 2 * clonedLedger?.amount;

          await window.electron.updateParty({
            ...currentParty,
            balance: newBalanceOfPreviousParty,
          });

          await window.electron.updateParty({
            ...newParty,
            balance: newBalanceOfNewParty,
          });
        }
      }

      toast('Ledger Updated Successfully', {
        type: 'success',
      });

      setSelectedLedger(undefined);
      setIsUpdateLedger(false);
      setRefreshState((prev: any) => !prev);
      setIsInputDisabled(false);
    } else {
      setIsInputDisabled((prev) => !prev);
    }

    setRefreshState((prev: any) => !prev);
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
              disabled={isInputDisabled}
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
              disabled={isInputDisabled}
              value={selectedLedger.date}
              onChange={(e) => {
                const clone = { ...selectedLedger };
                clone.date = e.target.value;
                setSelectedLedger(clone);
              }}
            />
          </div>

          <div className="mt-4 w-full flex mb-4">
            <label
              htmlFor="transactionType"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Type:
            </label>
            <div className="flex items-center space-x-4 w-5/6">
              <div className="flex items-center">
                <input
                  id="youGave"
                  name="type"
                  type="radio"
                  value="YOU GAVE"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  required
                  disabled={isInputDisabled}
                  checked={selectedLedger.transaction_type === 'YOU GAVE'}
                  onChange={(e) => {
                    const clone = { ...selectedLedger };
                    clone.transaction_type = e.target.value as
                      | 'YOU GAVE'
                      | 'YOU RECEIVED';
                    setSelectedLedger(clone);
                  }}
                />
                <label
                  htmlFor="youGave"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  You GAVE
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="youReceived"
                  name="type"
                  type="radio"
                  value="YOU RECEIVED"
                  disabled={isInputDisabled}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  required
                  checked={selectedLedger.transaction_type === 'YOU RECEIVED'}
                  onChange={(e) => {
                    const clone = { ...selectedLedger };
                    clone.transaction_type = e.target.value as
                      | 'YOU GAVE'
                      | 'YOU RECEIVED';
                    setSelectedLedger(clone);
                  }}
                />
                <label
                  htmlFor="youReceived"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  You Received
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center w-full mb-4">
            <label
              htmlFor="party"
              className="text-sm font-medium text-gray-700 w-1/3"
            >
              Party:
            </label>
            <select
              id="category"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-5/6"
              required
              value={selectedLedger.partyId}
              disabled={isInputDisabled}
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
              disabled={isInputDisabled}
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
              {isInputDisabled ? 'Edit' : 'Save'}
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
