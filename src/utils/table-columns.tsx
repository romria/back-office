import {type ReactNode} from 'react';
import Switch from '@/components/switch';
import Link from '@/components/link';
import ActionIcon from '@/components/action-icon';
import {type Column} from '@/components/virtual-table';

interface BaseRecord {
  id: string
}

// TS limitation: T[keyof T & string] doesn't reduce to a concrete value type in generic contexts.
// key typed as string so [key] resolves cleanly. Type safety is enforced by the Cell types at call site.
const readPrimitive = <T,>(row: T, key: string): string | number =>
  (row as Record<string, string | number>)[key];
const readString = <T,>(row: T, key: string): string =>
  (row as Record<string, string>)[key];
const readBoolean = <T,>(row: T, key: string): boolean =>
  (row as Record<string, boolean>)[key];

// keyof T & string is used instead of KeysOfType<T, V> (a conditional type) because
// typescript-eslint cannot resolve conditional indexed types in generic contexts and marks
// their values as "error typed", causing no-unsafe-assignment errors at every usage site.
// keyof T & string is a plain intersection — ESLint resolves it as string — no casts needed.
type TextCell<T extends BaseRecord> = {
  type: 'text'
  key: keyof T & string
  label: string
  isSortable?: boolean
  isCentered?: boolean
  minWidth?: number
}

type LinkCell<T extends BaseRecord> = {
  type: 'link'
  key: keyof T & string
  to: (id: string) => string
  label: string
  isSortable?: boolean
  isCentered?: boolean
  minWidth?: number
}

type ImageCell<T extends BaseRecord> = {
  type: 'image'
  key: keyof T & string
  width: number
  height: number
  label: string
  isCentered?: boolean
  minWidth?: number
}

type SwitchCell<T extends BaseRecord> = {
  type: 'switch'
  key?: keyof T & string
  label: string
  isCentered?: boolean
  onToggle: (isToggled: boolean, id: string) => void
}

type EditCell = {
  type: 'edit'
  label: string
  isCentered?: boolean
}

type DeleteCell = {
  type: 'delete'
  label: string
  isCentered?: boolean
}

export type Cell<T extends BaseRecord> = TextCell<T> | LinkCell<T> | ImageCell<T> | SwitchCell<T> | EditCell | DeleteCell
export type TableColumns<T extends BaseRecord> = Array<Cell<T>>;

interface ActionHandlers {
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export const toVirtualColumns = <T extends BaseRecord>(
  columns: TableColumns<T>,
  handlers: ActionHandlers,
): Array<Column<T>> => columns.map((col): Column<T> => {
  if (col.type === 'edit') {
    return {
      key: 'edit',
      label: col.label,
      isCentered: col.isCentered,
      render: (row): ReactNode => handlers.onEdit != null
        ? <ActionIcon type="edit" id={row.id} onClick={handlers.onEdit} />
        : null,
    };
  }

  if (col.type === 'delete') {
    return {
      key: 'delete',
      label: col.label,
      isCentered: col.isCentered,
      minWidth: 80,
      render: (row): ReactNode => handlers.onDelete != null
        ? <ActionIcon type="delete" id={row.id} onClick={handlers.onDelete} />
        : null,
    };
  }

  if (col.type === 'switch') {
    return {
      key: col.key ?? 'switch',
      label: col.label,
      isCentered: col.isCentered,
      minWidth: 80,
      render: (row): ReactNode => (
        <Switch
          inline
          toggled={col.key != null ? readBoolean(row, col.key) : false}
          name={row.id}
          onToggle={col.onToggle}
          aria-label={col.label}
        />
      ),
    };
  }

  if (col.type === 'link') {
    return {
      key: col.key,
      label: col.label,
      isCentered: col.isCentered,
      isSortable: col.isSortable,
      minWidth: col.minWidth,
      render: (row): ReactNode => <Link to={col.to(row.id)}>{readPrimitive(row, col.key)}</Link>,
    };
  }

  if (col.type === 'image') {
    return {
      key: col.key,
      label: col.label,
      isCentered: col.isCentered,
      minWidth: col.minWidth ?? (col.width + 16), // image width + padding
      render: (row): ReactNode => (
        <img
          style={{width: col.width, height: col.height, objectFit: 'cover', display: 'block'}}
          src={readString(row, col.key)}
          alt=""
        />
      ),
    };
  }

  // text — col.type === 'text' at this point; explicit guard needed because TS doesn't fully
  // reduce EditCell/DeleteCell out of the union after separate if-return branches above.
  // CustomColumn (with render) is used because keyof T & string is not assignable to
  // DataColumn's key: KeysOfType<T, string | number>.
  if (col.type === 'text') {
    return {
      key: col.key,
      label: col.label,
      isCentered: col.isCentered,
      isSortable: col.isSortable,
      minWidth: col.minWidth,
      render: (row): ReactNode => readPrimitive(row, col.key),
    };
  }

  // exhaustive check — all Cell variants handled above
  const _exhaustive: never = col;
  throw new Error(`Unhandled cell type: ${String((_exhaustive as Cell<T>).type)}`);
});
