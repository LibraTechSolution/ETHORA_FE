'use client'
import { CSVLink } from 'react-csv';

type ColumnDefinitionType<T, K extends keyof T> = {
  key: K;
  label: string;
}

type TableProps<T, K extends keyof T> = {
  data: Array<T>;
  headers: Array<ColumnDefinitionType<T, K>>;
  filename: string,
}

const DownloadCSV = <T, K extends keyof T>({ data, headers ,filename }: TableProps<T, K>) => {
  return (
    <CSVLink data={data as []} headers={headers as []} asyncOnClick={true} enclosingCharacter={''} target="_blank" filename={filename}>
      Download CSV
    </CSVLink>
  );
};
export default DownloadCSV;
