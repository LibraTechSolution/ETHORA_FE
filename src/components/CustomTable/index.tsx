'use client';
import * as React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react';
// import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  OnChangeFn,
  PaginationState,
} from '@tanstack/react-table';
import { availableParallelism } from 'os';
import { useCallback, useMemo, useState } from 'react';

export type DataTableProps<Data extends object> = {
  data: Data[];
  columns: ColumnDef<Data, any>[];
  pagination?: PaginationState;
  onPaginationChange: (param: PaginationState) => void;
};

export function CustomTable<Data extends object>({
  data,
  columns,
  // pagination,
  onPaginationChange,
}: DataTableProps<Data>) {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = useMemo(() => {
    onPaginationChange({
      pageIndex,
      pageSize,
    });
    return {
      pageIndex,
      pageSize,
    };
  }, [pageIndex, pageSize]);

  // const fetchDataOptions = {
  //   pageIndex,
  //   pageSize,
  // };
  // useEffect(() => {
  //   console.log(pagination)
  // }, []);

  // console.log(fetchDataOptions);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    // getSortedRowModel: getSortedRowModel()
    getPaginationRowModel: getPaginationRowModel(),
    // onSortingChange: setSorting,
    onPaginationChange: setPagination,
    // manualPagination: true,
    state: {
      // sorting,
      pagination,
    },
  });

  return (
    <>
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = header.column.columnDef.meta;
                return (
                  <Th
                    key={header.id}
                    // onClick={header.column.getToggleSortingHandler()}
                    isNumeric={meta?.isNumeric}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}

                    {/* <chakra.span pl="4">
                      {header.column.getIsSorted()
                        ? header.column.getIsSorted() === 'desc'
                          ? // <TriangleDownIcon aria-label="sorted descending" />
                            'up'
                          : // <TriangleUpIcon aria-label="sorted ascending" />
                            'down'
                        : null}
                    </chakra.span> */}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = cell.column.columnDef.meta;
                return (
                  <Td key={cell.id} isNumeric={meta?.isNumeric}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table?.setPageIndex(0)}
          disabled={!table?.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
