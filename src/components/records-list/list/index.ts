import {useCallback, useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import type {RecordRaw, EmptyObject} from '@/types';
import type {Query, RequestData} from '@/types/request';
import type {RequestResult} from '@/controllers/request';
import type {TableParams} from '@/components/virtual-table';
// import {type DateRange} from '@/utils/date';
import useAsyncData from '@/hooks/use-async-data';
import {useAppStore} from '@/state';

interface Props<
  TRecord,
  TRecordFormatted extends {id: string},
  // TFilters extends Record<string, unknown>,
  TGETParams extends Query,
  TGETResponseData = {list: TRecord[], total: number},
> {
  recordName: string
  // initialFilter: TFilters
  mapGetRecords: (params: {limit: number, skip: number, sortedBy: string, order: 'asc' | 'desc'}) => TGETParams
  apiGetRecords: (params: TGETParams) => Promise<RequestResult<TGETResponseData>>
  mapGetRecordsData: (data: TGETResponseData) => {list: TRecord[], total: number}
  parseAndFormatRecord: (record: TRecord) => TRecordFormatted
  apiUpdateRecord?: (params: RequestData & {id: string}) => Promise<RequestResult<TRecord>>
  apiDeleteRecord?: (params: string) => Promise<RequestResult<EmptyObject>>
}

interface Result<TRecordFormatted extends {id: string}> {
  data: TRecordFormatted[]
  total: number
  isLoading: boolean
  onParamsChange: (params: TableParams) => void
  refresh: () => void
  // filteredBy: TFilters
  // onFilterData: (payload: Partial<TFilters>) => void
  onOpenEditor: (id: string) => void
  onOpenEditorNew: () => void
}

const useList = <
  TRecord extends RecordRaw,
  TRecordFormatted extends {id: string},
  // TFilters extends Record<string, unknown>,
  TGETParams extends Query,
  TGETResponseData = {list: TRecord[], total: number},
>({
    recordName,
    // initialFilter,
    mapGetRecords,
    apiGetRecords,
    mapGetRecordsData,
    parseAndFormatRecord,
    // apiUpdateRecord,
    // apiDeleteRecord,
  }: Props<TRecord, TRecordFormatted, TGETParams, TGETResponseData>): Result<TRecordFormatted> => {
  const onShowNotification = useAppStore((s) => s.onShowNotification);
  const navigate = useNavigate();
  const {pathname} = useLocation();

  const onOpenEditor = useCallback((id: string): void => { void navigate(`${pathname}/${id}`); }, [pathname, navigate]);
  const onOpenEditorNew = useCallback((): void => { onOpenEditor('new'); }, [onOpenEditor]);

  const [params, setParams] = useState<TableParams>({limit: 20, skip: 0});
  const {state, run} = useAsyncData<{data: TRecordFormatted[], total: number}>(true);

  const refresh = useCallback((): void => {
    // prepareRequestQuery(mapGetRecords({limit, skip, sortedBy, ...filters})),
    const query = mapGetRecords({
      limit: params.limit,
      skip: params.skip,
      sortedBy: params.sortBy ?? '',
      order: params.order ?? 'asc',
      // ...filters,
    });

    run(async () => {
      const result = await apiGetRecords(query);

      if (!result.ok) {
        onShowNotification('error', `Failed to fetch ${recordName} list`);
        return {data: [], total: 0};
      }

      const {list: rawList, total} = mapGetRecordsData(result.data);

      return {data: rawList.map((record) => parseAndFormatRecord(record)), total};
    });
  }, [
    params,
    mapGetRecords,
    apiGetRecords,
    mapGetRecordsData,
    parseAndFormatRecord,
    onShowNotification,
    recordName,
    run,
    // filters,
  ]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // const onUpdateRecord = useCallback(async (params: RequestData & {id: string}) => {
  //   ...
  // }, []);

  // const onDeleteRecordConfirm = useCallback((id: string) => {
  //   onShowModal({
  //     msg: `Are you sure you want to delete ${recordName} "${id}"`,
  //     onConfirm: () => { void onDeleteRecordRequest(id); },
  //   });
  // }, [recordName, onShowModal, onDeleteRecordRequest]);

  return {
    data: state.data?.data ?? [],
    total: state.data?.total ?? 0,
    isLoading: state.isLoading,
    onParamsChange: setParams,
    refresh,
    // filteredBy: filters,
    // onFilterData,
    onOpenEditor,
    onOpenEditorNew,
  };
};

export default useList;
