/* eslint-disable prettier/prettier */
interface ILedger {
  id?: number;
  partyId: number;
  details: string;
  amount: number;
  transaction_type: 'YOU GAVE' | 'YOU RECEIVED';
  date: string;
  transactionAccountId: number;
  accountId: number;
}

export default ILedger;
