/* eslint-disable prettier/prettier */
interface ICategory {
  id?: number;
  name: string;
  type: 'EXPENSE' | 'INCOME';
  accountId: number;
}

export default ICategory;
