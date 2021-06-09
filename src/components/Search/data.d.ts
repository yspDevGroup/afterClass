export type SearchDataType = {
  label?: string,
  type?: 'chainSelect'|'select'|'input',
  placeHolder?: string,
  defaultValue: {
    first: string,
    second: string
  },
  data?: any,
  isLabel?: boolean;
}[];