import {useCallback, useMemo, type ReactElement} from 'react';
import type {EmptyObject, RecordRaw} from '@/types';
import type {Query, RequestData} from '@/types/request';
import type {RequestResult} from '@/controllers/request';
import useList from './list';
// import Filter, {type FilterLayout} from '@/filter';
import VirtualTable from '@/components/virtual-table';
// import HR from '../hr';
// import {SVGArrowClockwise, SVGPlusLG} from '../svg';
import {type TableColumns, toVirtualColumns} from '@/utils/table-columns';
import classes from './records-list.module.scss';

interface Props<
  TRecord extends RecordRaw,
  TRecordFormatted extends {id: string},
  // TFilters extends Record<string, unknown>,
  TGETParams extends Query,
  TGETResponseData = {list: TRecord[], total: number},
> {
  recordName: string
  // initialFilter: TFilters
  // filterLayout: FilterLayout<TFilters>
  tableColumns: TableColumns<TRecordFormatted>
  mapGetRecords: (params: {limit: number, skip: number, sortedBy: string, order: 'asc' | 'desc'}) => TGETParams
  apiGetRecords: (params: TGETParams) => Promise<RequestResult<TGETResponseData>>
  mapGetRecordsData: (data: TGETResponseData) => {list: TRecord[], total: number}
  parseAndFormatRecord: (record: TRecord) => TRecordFormatted
  apiUpdateRecord?: (params: RequestData & {id: string}) => Promise<RequestResult<TRecord>>
  apiDeleteRecord?: (params: string) => Promise<RequestResult<EmptyObject>>
}

const RecordsList = <
  TRecord extends RecordRaw,
  TRecordFormatted extends {id: string},
  // TFilters extends Record<string, unknown>,
  TGETParams extends Query,
  TGETResponseData = {list: TRecord[], total: number},
>({
    recordName,
    // initialFilter,
    // filterLayout,
    tableColumns,
    mapGetRecords,
    apiGetRecords,
    mapGetRecordsData,
    parseAndFormatRecord,
    // apiUpdateRecord,
    // apiDeleteRecord,
  }: Props<TRecord, TRecordFormatted, TGETParams, TGETResponseData>): ReactElement => {
  const {
    data,
    total,
    isLoading,
    onParamsChange,
    // filteredBy,
    // onFilterData,
    onOpenEditor,
    // onOpenEditorNew,
  } = useList<TRecord, TRecordFormatted, TGETParams, TGETResponseData>({
    recordName,
    // initialFilter,
    mapGetRecords,
    apiGetRecords,
    mapGetRecordsData,
    parseAndFormatRecord,
    // apiUpdateRecord,
    // apiDeleteRecord,
  });

  const columns = useMemo(
    () => toVirtualColumns(tableColumns, {onEdit: onOpenEditor, onDelete: () => {}}),
    [tableColumns, onOpenEditor],
  );

  // const filterLayoutWithActions = useMemo(() => filterLayout.map(({filterComponents, actionComponents}) => ({
  //   filterComponents,
  //   actionComponents: actionComponents.map(({type, label, ...rest}) => ({
  //     ...rest,
  //     type,
  //     onClick: (() => {
  //       switch (type) {
  //         case 'action-refresh':
  //           return refresh;
  //         case 'action-create':
  //           return onOpenEditorNew;
  //         case 'action-button':
  //         default:
  //           return rest.onClick;
  //       }
  //     })(),
  //     label: (() => {
  //       switch (type) {
  //         case 'action-refresh':
  //           return <><SVGArrowClockwise />{label}</>;
  //         case 'action-create':
  //           return <><SVGPlusLG />{label}</>;
  //         case 'action-button':
  //         default:
  //           return label;
  //       }
  //     })(),
  //   })),
  // })), [filterLayout, refresh, onOpenEditorNew]);

  const onRowClick = useCallback((record: TRecordFormatted): void => {
    onOpenEditor(record.id);
  }, [onOpenEditor]);

  return (
    <div className={classes.root}>
      <div className={classes.titleRow}>
        <h1 className={classes.title}>{`${recordName}s`}</h1>
      </div>

      {/* <Filter
        layout={filterLayoutWithActions}
        values={filteredBy}
        onUpdateFilters={onFilterData}
        isLoading={isLoading}
      />

      <HR /> */}

      <div className={classes.tableContainer}>
        <VirtualTable
          columns={columns}
          data={data}
          total={total}
          isPending={isLoading}
          onParamsChange={onParamsChange}
          onRowClick={onRowClick}
        />
      </div>
    </div>
  );
};

export default RecordsList;
