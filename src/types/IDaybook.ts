/* eslint-disable prettier/prettier */
interface IDaybook {
  id?: number;
  date: string;
  amount: number;
  categoryId: number;
  details: string;
  type: 'EXPENSE' | 'INCOME';
  accountId: number;
}

export default IDaybook;
