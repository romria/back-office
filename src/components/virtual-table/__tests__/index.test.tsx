import {render, screen, fireEvent} from '@testing-library/react';
import VirtualTable, {type Column, type TableParams} from '@/components/virtual-table';

// Minimal stub — renders header + rows so we can exercise sort and row-click logic
jest.mock('react-virtuoso', () => ({
  TableVirtuoso: jest.fn(
    ({
      data,
      components,
      fixedHeaderContent,
      itemContent,
      className,
    }: {
      data: Record<string, unknown>[];
      components?: {
        Table?: React.ComponentType<React.HTMLAttributes<HTMLTableElement>>;
        TableRow?: React.ComponentType<React.HTMLAttributes<HTMLTableRowElement> & {'data-index'?: number}>;
      };
      fixedHeaderContent?: () => React.ReactNode;
      itemContent?: (index: number, item: Record<string, unknown>) => React.ReactNode;
      className?: string;
    }) => {
      const TableRow = components?.TableRow;
      return (
        <table className={className}>
          <thead>{fixedHeaderContent?.()}</thead>
          <tbody>
            {data.map((row, index) => {
              if (TableRow != null) {
                return (
                  <TableRow key={index} data-index={index}>
                    {itemContent?.(index, row)}
                  </TableRow>
                );
              }
              return <tr key={index}>{itemContent?.(index, row)}</tr>;
            })}
          </tbody>
        </table>
      );
    },
  ),
}));

type Row = {id: number; name: string; age: number};

const columns: Array<Column<Row>> = [
  {key: 'id', label: 'ID'},
  {key: 'name', label: 'Name', isSortable: true},
  {key: 'age', label: 'Age', isSortable: true},
];

const rows: Row[] = [
  {id: 1, name: 'Alice', age: 30},
  {id: 2, name: 'Bob', age: 25},
];

const renderTable = (overrides: Partial<{
  data: Row[];
  total: number;
  isPending: boolean;
  onParamsChange: jest.Mock;
  onRowClick: jest.Mock;
}> = {}): {onParamsChange: jest.Mock; onRowClick: jest.Mock} => {
  const onParamsChange = overrides.onParamsChange ?? jest.fn();
  const onRowClick = overrides.onRowClick;
  render(
    <VirtualTable
      columns={columns}
      data={overrides.data ?? rows}
      total={overrides.total ?? rows.length}
      isPending={overrides.isPending}
      onParamsChange={onParamsChange}
      onRowClick={onRowClick}
    />,
  );
  return {onParamsChange, onRowClick: onRowClick ?? jest.fn()};
};

describe('VirtualTable — rendering', () => {
  it('renders column headers', () => {
    renderTable();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders data rows via itemContent', () => {
    renderTable();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('uses a custom render function when provided', () => {
    const customColumns: Array<Column<Row>> = [
      {key: 'name', label: 'Name', render: (row) => <strong>{row.name.toUpperCase()}</strong>},
    ];
    render(
      <VirtualTable
        columns={customColumns}
        data={rows}
        total={rows.length}
        onParamsChange={jest.fn()}
      />,
    );
    expect(screen.getByText('ALICE')).toBeInTheDocument();
  });

  it('shows "No results" in pagination when total is 0', () => {
    renderTable({data: [], total: 0});
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('shows row range info when total > 0', () => {
    renderTable({total: 2});
    expect(screen.getByText(/Showing 1-2 of 2/)).toBeInTheDocument();
  });
});

describe('VirtualTable — sorting', () => {
  it('calls onParamsChange with sortBy and order when a sortable header is clicked', () => {
    const {onParamsChange} = renderTable();
    fireEvent.click(screen.getByText('Name'));
    expect(onParamsChange).toHaveBeenCalledWith(
      expect.objectContaining({sortBy: 'name', order: 'asc', skip: 0}),
    );
  });

  it('toggles sort direction from asc to desc on second click', () => {
    const {onParamsChange} = renderTable();
    fireEvent.click(screen.getByText('Name'));
    fireEvent.click(screen.getByText('Name'));
    expect(onParamsChange).toHaveBeenLastCalledWith(
      expect.objectContaining({sortBy: 'name', order: 'desc'}),
    );
  });

  it('resets to asc when a different column is sorted', () => {
    const {onParamsChange} = renderTable();
    fireEvent.click(screen.getByText('Name'));  // sort by name asc
    fireEvent.click(screen.getByText('Age'));   // sort by age — should be asc (new col)
    expect(onParamsChange).toHaveBeenLastCalledWith(
      expect.objectContaining({sortBy: 'age', order: 'asc'}),
    );
  });

  it('resets page (skip=0) when sort changes', () => {
    const {onParamsChange} = renderTable();
    fireEvent.click(screen.getByText('Name'));
    const call = onParamsChange.mock.calls[0][0] as TableParams;
    expect(call.skip).toBe(0);
  });

  it('does not call onParamsChange when a non-sortable header is clicked', () => {
    const {onParamsChange} = renderTable();
    fireEvent.click(screen.getByText('ID'));
    expect(onParamsChange).not.toHaveBeenCalled();
  });
});

describe('VirtualTable — pagination', () => {
  it('shows page 1 / 1 for a single page of results', () => {
    renderTable({total: 2});
    expect(screen.getByText('1 / 1')).toBeInTheDocument();
  });

  it('next page button calls onParamsChange with incremented skip', () => {
    const {onParamsChange} = renderTable({total: 100});
    fireEvent.click(screen.getByRole('button', {name: /next page/i}));
    expect(onParamsChange).toHaveBeenCalledWith(
      expect.objectContaining({skip: 20, limit: 20}),
    );
  });

  it('previous page button is disabled on the first page', () => {
    renderTable({total: 100});
    expect(screen.getByRole('button', {name: /previous page/i})).toBeDisabled();
  });

  it('last page button calls onParamsChange with last page skip', () => {
    const {onParamsChange} = renderTable({total: 40});
    // total=40, pageSize=20 → totalPages=2; last page skip = (2-1)*20 = 20
    fireEvent.click(screen.getByRole('button', {name: /last page/i}));
    expect(onParamsChange).toHaveBeenCalledWith(
      expect.objectContaining({skip: 20, limit: 20}),
    );
  });

  it('preserves sort params when changing page', () => {
    const {onParamsChange} = renderTable({total: 100});
    fireEvent.click(screen.getByText('Name'));           // sort by name asc
    onParamsChange.mockClear();
    fireEvent.click(screen.getByRole('button', {name: /next page/i}));
    expect(onParamsChange).toHaveBeenCalledWith(
      expect.objectContaining({sortBy: 'name', order: 'asc'}),
    );
  });
});

describe('VirtualTable — row clicks', () => {
  it('calls onRowClick with the row data when a row is clicked', () => {
    const onRowClick = jest.fn();
    renderTable({onRowClick});
    // Rows are rendered as <tr> elements; click the first one
    const rows = document.querySelectorAll('tbody tr');
    fireEvent.click(rows[0]);
    expect(onRowClick).toHaveBeenCalledWith({id: 1, name: 'Alice', age: 30});
  });

  it('does not throw when onRowClick is not provided', () => {
    renderTable();
    const tableRows = document.querySelectorAll('tbody tr');
    expect(() => fireEvent.click(tableRows[0])).not.toThrow();
  });
});
