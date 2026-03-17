import type {ReactElement} from 'react';
// import {RECORD_STATUS_VALUES} from '@/types';
import type {Query} from '@/types/request';
import type {User, UserFormatted} from '@/types/user';
// import {type DateRange} from '@/utils/date';
import {type TableColumns} from '@/utils/table-columns';
// import {type FilterLayout} from '@/components/filter';
import RecordsList from '@/components/records-list';
import {
  // apiDeleteUser,
  getUsers,
  type UsersResponse,
  // apiUpdateUser,
} from '@/api/users';
import {mapGetUsers} from '@/utils/map-api-params';
import {parseAndFormatUser} from '@/utils/parse-data';

// export interface Filters extends Record<string, unknown> {
//   // limit: number
//   // skip: number
//   // sortedBy: {key: string, order: 'asc' | 'desc'} | undefined
//   dateRange: DateRange
//   roleId: string
//   isActive: string[]
//   userId: string
//   email: string
//   firstName: string
//   lastName: string
// }

// const filterLayout: FilterLayout<Filters> = [
//   {
//     filterComponents: [
//       {type: 'date-range', key: 'dateRange', placeholder: 'Filter By Creation Date Range'},
//       {type: 'select-single', key: 'roleId', placeholder: 'Filter By Role', values: [], disabled: true},
//       {type: 'select-multiple', key: 'isActive', placeholder: 'Filter By Status', values: RECORD_STATUS_VALUES},
//     ],
//     actionComponents: [
//       {type: 'action-refresh', label: 'Refresh List', onClick: () => {}},
//     ],
//   },
//   {
//     filterComponents: [
//       {type: 'search-text', key: 'userId', placeholder: 'User ID', minWidth: 120},
//       {type: 'search-text', key: 'email', placeholder: 'Email', minWidth: 200},
//       {type: 'search-text', key: 'firstName', placeholder: 'First Name', minWidth: 160},
//       {type: 'search-text', key: 'lastName', placeholder: 'Last Name', minWidth: 160},
//     ],
//     actionComponents: [
//       {type: 'action-create', label: 'Create User', onClick: () => {}},
//     ],
//   },
// ];

const mapUsersResponseToList = (data: UsersResponse): {list: User[], total: number} => ({
  list: data.users,
  total: data.total,
});

const tableColumns: TableColumns<UserFormatted> = [
  {
    type: 'image',
    key: 'image',
    label: '',
    width: 34,
    height: 34,
  },
  {type: 'text', label: 'ID', key: 'id', isSortable: true, minWidth: 60},
  {type: 'text', label: 'First Name', key: 'firstName', isSortable: true, minWidth: 130},
  {type: 'text', label: 'Last Name', key: 'lastName', isSortable: true, minWidth: 130},
  {type: 'text', label: 'Maiden Name', key: 'maidenName', isSortable: true, minWidth: 130},
  {type: 'text', label: 'Username', key: 'username', isSortable: true, minWidth: 130},
  {type: 'text', label: 'Email', key: 'email', isSortable: true, minWidth: 200},
  {type: 'text', label: 'Role', key: 'role', isSortable: true, minWidth: 130},
  {type: 'text', label: 'Age', key: 'age', isSortable: true, minWidth: 60},
  {type: 'text', label: 'Gender', key: 'gender', isSortable: true, minWidth: 80},
  {type: 'text', label: 'Phone', key: 'phone', minWidth: 120},
  {type: 'text', label: 'IP', key: 'ip', minWidth: 120},
  {type: 'text', label: 'MAC Address', key: 'macAddress', minWidth: 150},
  // {type: 'text', label: 'Last Login Date', key: 'lastLoginDate', isSortable: true},
  // {type: 'text', label: 'Creation Date', key: 'creationDate', isSortable: true},
  // {type: 'switch', label: 'ENABLED', isCentered: true},
  {type: 'edit', label: 'EDIT', isCentered: true},
  {type: 'delete', label: 'DELETE', isCentered: true},
];

const Users = (): ReactElement => {
  return (
    <RecordsList<User, UserFormatted, Query, UsersResponse>
      recordName="User"
      // filterLayout={filterLayout}
      tableColumns={tableColumns}
      mapGetRecords={mapGetUsers}
      apiGetRecords={getUsers}
      mapGetRecordsData={mapUsersResponseToList}
      parseAndFormatRecord={parseAndFormatUser}
      // apiUpdateRecord={apiUpdateUser}
      // apiDeleteRecord={apiDeleteUser}
    />
  );
};

export default Users;
