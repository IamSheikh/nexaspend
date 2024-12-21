/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useState, useEffect } from 'react';
import { ICategory } from '../../types';

const ViewCategories = ({
  setSelectedCategory,
  setRefreshState,
  setIsDeleteCategoryModalOpen,
  setIsEditCategoryModalOpen,
}: {
  setSelectedCategory: any;
  setRefreshState: any;
  setIsDeleteCategoryModalOpen: any;
  setIsEditCategoryModalOpen: any;
}) => {
  const [categorySearch, setCategorySearch] = useState({
    entryType: 'ALL',
  });
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    (async () => {
      const allCategories =
        (await window.electron.getAllCategories()) as ICategory[];
      setCategories(allCategories);
    })();
  }, []);

  return (
    <div className="flex justify-center flex-col items-center self-center mt-4">
      <div className="flex mb-4">
        <div className="flex items-center">
          <label
            htmlFor="entryType"
            className="text-sm font-medium text-gray-700"
          >
            Entry Type:
          </label>
          <select
            id="entryType"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2"
            value={categorySearch.entryType}
            onChange={(e) => {
              const clone = { ...categorySearch };
              clone.entryType = e.target.value;
              setCategorySearch(clone);
            }}
          >
            <option value="ALL">All</option>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
        <div className="ml-4">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={async () => {
              const searchResults =
                await window.electron.getCategoriesByFilters(
                  categorySearch.entryType,
                );
              setCategories(searchResults);
            }}
          >
            Search
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-2"
            onClick={() => {
              setRefreshState((prev: any) => !prev);
              setCategorySearch({
                entryType: 'ALL',
              });
            }}
          >
            X
          </button>
        </div>
      </div>
      <table className="table-auto border-collapse border border-gray-300 w-[95vw]">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-2">No.</th>
            <th className="border border-gray-300 px-2">Type</th>
            <th className="border border-gray-300 px-2">Name</th>
            <th className="border border-gray-300 px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((da, index) => (
            <tr className="text-center">
              <td className="border border-gray-300 px-2">{index + 1}</td>
              <td className="border border-gray-300 px-2">
                {da.type === 'INCOME' ? 'Income' : 'Expense'}
              </td>
              <td className="border border-gray-300 px-2">{da.name}</td>
              <td className="border border-gray-300 px-2 items-center justify-center flex">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(da);
                    setIsEditCategoryModalOpen(true);
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
                  onClick={async () => {
                    setSelectedCategory(da);
                    setIsDeleteCategoryModalOpen(true);
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

export default ViewCategories;
