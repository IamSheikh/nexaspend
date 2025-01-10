/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

const Tabs = ({
  printingMode,
  activeTab,
  setActiveTab,
  setIsViewingLedgerShowing,
}: {
  printingMode: any;
  activeTab: any;
  setActiveTab: any;
  setIsViewingLedgerShowing: any;
}) => {
  return (
    <div
      className={`flex justify-around border-b top-[60px] sticky z-40 bg-white  border-gray-300 ${activeTab === '' && 'hidden'} ${printingMode && 'hidden'}`}
    >
      {['Transaction', 'Ledger', 'Account'].map((tab) => (
        <button
          type="button"
          key={tab}
          onClick={() => {
            setActiveTab(tab);
            if (tab === 'Transaction') {
              setIsViewingLedgerShowing(false);
            }
          }}
          className={`pb-2 text-gray-600  ${
            activeTab === tab
              ? 'border-b-2 border-black text-black'
              : 'hover:text-black'
          }`}
        >
          {tab === 'Transaction' ? 'Daybook' : tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
