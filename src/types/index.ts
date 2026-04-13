import type {ReactNode} from 'react';
import type {User, UserParsed, UserExtended, UserExtendedParsed, UserEditorState} from './user';
// import type {UserProfile, UserProfileEditor} from './profile';

export type EmptyObject = Record<PropertyKey, never>;

export type SelectInputValues = Array<{label: ReactNode, value: string}>;
export const RECORD_STATUS_VALUES: SelectInputValues = [
  {label: 'Enabled', value: 'true'},
  {label: 'Disabled', value: 'false'},
];

export type ObjectValue = undefined | null | boolean | string | number | Date | string[] | number[]; // available end values in a nested object
export interface ObjectRecord {[key: string]: ObjectRecord | ObjectValue}

export type RecordRaw = User | UserExtended;
export type RecordParsed = UserParsed | UserExtendedParsed;
export type EditorState = UserEditorState;
