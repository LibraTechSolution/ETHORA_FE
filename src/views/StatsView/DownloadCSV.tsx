'use client';
import dayjs from 'dayjs';
import { CSVLink } from 'react-csv';

type ColumnDefinitionType<T, K extends keyof T> = {
  key: K;
  label: string;
};

type TableProps<T, K extends keyof T> = {
  data: Array<T>;
  headers: Array<ColumnDefinitionType<T, K>>;
  filename: string;
};

const DownloadCSV = <T, K extends keyof T>({ data, headers, filename }: TableProps<T, K>) => {
  const mapData = data.map((item: any) => {
    return {
      ...item,
      timestamp: dayjs(+item?.timestamp * 1000).format('MM/DD/YYYY'),
    };
  });
  return (
    <CSVLink
      data={mapData as []}
      headers={headers as []}
      asyncOnClick={true}
      enclosingCharacter={''}
      target="_blank"
      filename={filename}
    >
      Download CSV
    </CSVLink>
  );
};
export default DownloadCSV;
