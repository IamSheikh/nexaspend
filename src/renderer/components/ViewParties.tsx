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
import { IParty } from '../../types';

const ViewParties = ({
  setSelectedParty,
  setRefreshState,
  setIsDeletePartyModalOpen,
  setIsEditPartyModalOpen,
  refreshState,
  setIsViewingLedgerShowing,
}: {
  setSelectedParty: any;
  setRefreshState: any;
  setIsDeletePartyModalOpen: any;
  refreshState: any;
  setIsEditPartyModalOpen: any;
  setIsViewingLedgerShowing: any;
}) => {
  const [parties, setParties] = useState<IParty[]>([]);
  const [filteredParties, setFilteredParties] = useState<IParty[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      const allParties = (await window.electron.getAllParties(
        // @ts-ignore
        +localStorage.getItem('currentAccountId'),
      )) as IParty[];
      setParties(allParties);
    })();
  }, [refreshState]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredParties(parties);
    } else {
      setFilteredParties(
        parties.filter((party) =>
          party.partyName.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }
  }, [searchQuery, parties]);

  return (
    <div className="flex justify-center flex-col items-center self-center mt-4">
      <h1 className="text-3xl font-semibold mb-4">All Parties</h1>
      <div className="w-3/4 mb-2">
        <input
          type="text"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search party..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <table className="table-auto border-collapse border border-gray-300 w-[95vw]">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-2">No.</th>
            <th className="border border-gray-300 px-2">Name</th>
            <th className="border border-gray-300 px-2">Mobile Number</th>
            <th className="border border-gray-300 px-2">Address</th>
            <th className="border border-gray-300 px-2">Email</th>
            <th className="border border-gray-300 px-2">More About</th>
            <th className="border border-gray-300 px-2">Balance</th>
            <th className="border border-gray-300 px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredParties.map((da, index) => (
            <tr
              className="text-center"
              onClick={() => {
                setIsViewingLedgerShowing((prev: any) => !prev);
                setSelectedParty(da);
              }}
              key={da.id}
            >
              <td className="border border-gray-300 px-2">{index + 1}</td>
              <td className="border border-gray-300 px-2 text-left">
                {da.partyName}
              </td>
              <td className="border border-gray-300 px-2 text-left">
                {da.mobileNumber}
              </td>
              <td className="border border-gray-300 px-2 text-left">
                {da.address}
              </td>
              <td className="border border-gray-300 px-2 text-left">
                {da.email}
              </td>
              <td className="border border-gray-300 px-2 text-left">
                {da.details}
              </td>
              <td className="border border-gray-300 px-2 text-right">
                {numeral(da.balance).format('0,0')}
              </td>
              <td className="border border-gray-300 px-2 items-center justify-center flex">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedParty(da);
                    setIsEditPartyModalOpen(true);
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
                <button
                  type="button"
                  className="bg-transparent font-semibold py-1 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ml-2"
                  onClick={async (e) => {
                    e.stopPropagation();
                    setSelectedParty(da);
                    setIsDeletePartyModalOpen(true);
                    setRefreshState((prev: any) => !prev);
                  }}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewParties;
