'use client';
import { CustomTable } from '@/components/CustomTable';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';

import {
  Column,
  Table as ReactTable,
  PaginationState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  OnChangeFn,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: 'relationship' | 'complicated' | 'single';
  subRows?: Person[];
};

// function Table<T>({ data, columns }: { data: T[]; columns: ColumnDef<T>[] }) {
//   const table = useReactTable({
//     data,
//     columns,
//     enableColumnResizing: true,
//     columnResizeMode: 'onChange',
//     // Pipeline
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     //

//     debugTable: true,
//     debugHeaders: true,
//     debugColumns: true,
//   });

//   const countLeafColumns = table?.getAllLeafColumns().length;

//   return (
//     <div className="p-2">
//       <div className="h-2" />
//       <table width={'full'}>
//         <thead>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => {
//                 return (
//                   <th key={header.id} colSpan={header.colSpan}>
//                     {header.isPlaceholder ? null : (
//                       <div>
//                         {flexRender(header.column.columnDef.header, header.getContext())}
//                         {header.column.getCanFilter() ? (
//                           <div>{/* <Filter column={header.column} table={table} /> */}</div>
//                         ) : null}
//                       </div>
//                     )}
//                   </th>
//                 );
//               })}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {table?.getRowModel().rows.length === 0 ? (
//             <tr>
//               <td colSpan={countLeafColumns}>
//                 <div>no data....</div>
//               </td>
//             </tr>
//           ) : (
//             table?.getRowModel().rows.map((row) => {
//               return (
//                 <tr key={row.id}>
//                   {row.getVisibleCells().map((cell) => {
//                     return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
//                   })}
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//       <div className="h-2" />
//       <div className="flex items-center gap-2">
//         <button
//           className="border rounded p-1"
//           onClick={() => table?.setPageIndex(0)}
//           disabled={!table?.getCanPreviousPage()}
//         >
//           {'<<'}
//         </button>
//         <button
//           className="border rounded p-1"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           {'<'}
//         </button>
//         <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
//           {'>'}
//         </button>
//         <button
//           className="border rounded p-1"
//           onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//           disabled={!table.getCanNextPage()}
//         >
//           {'>>'}
//         </button>
//         <span className="flex items-center gap-1">
//           <div>Page</div>
//           <strong>
//             {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
//           </strong>
//         </span>
//         <span className="flex items-center gap-1">
//           | Go to page:
//           <input
//             type="number"
//             defaultValue={table.getState().pagination.pageIndex + 1}
//             onChange={(e) => {
//               const page = e.target.value ? Number(e.target.value) - 1 : 0;
//               table.setPageIndex(page);
//             }}
//             className="border p-1 rounded w-16"
//           />
//         </span>
//         <select
//           value={table.getState().pagination.pageSize}
//           onChange={(e) => {
//             table.setPageSize(Number(e.target.value));
//           }}
//         >
//           {[10, 20, 30, 40, 50].map((pageSize) => (
//             <option key={pageSize} value={pageSize}>
//               Show {pageSize}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }

export default function ProfilePage() {
  type UnitConversion = {
    fromUnit: string;
    toUnit: string;
    factor: number;
  };

  const data: UnitConversion[] = [
    {
      fromUnit: 'inches',
      toUnit: 'millimetres (mm)',
      factor: 25.4,
    },
    {
      fromUnit: 'feet',
      toUnit: 'centimetres (cm)',
      factor: 30.48,
    },
    {
      fromUnit: 'yards',
      toUnit: 'metres (m)',
      factor: 0.91444,
    },
  ];

  const columnHelper = createColumnHelper<UnitConversion>();

  const columns = [
    columnHelper.accessor('fromUnit', {
      cell: (info) => info.getValue(),
      header: 'To convert',
    }),
    columnHelper.accessor('toUnit', {
      cell: (info) => info.getValue(),
      header: 'Into',
    }),
    columnHelper.accessor('factor', {
      cell: (info) => info.getValue(),
      header: 'Multiply by',
      meta: {
        isNumeric: true,
      },
    }),
  ];

  return (
    <Flex
      gap={10}
      direction={'column'}
      bgImage="url('/images/profile/bg-item.png')"
      bgRepeat="no-repeat"
      bgPosition="top -87px left 45px"
    >
      <Flex
        direction={'column'}
        w={'100%'}
        maxW={'195px'}
        p={4}
        color="white"
        marginX={'auto'}
        display={'flex'}
        alignItems={'center'}
        gap={'27px'}
      >
        <Box w={'64px'} h={'64px'} borderRadius={'100%'} overflow={'hidden'} bg={'yellow'}>
          avata
        </Box>
        <Box>addresss</Box>
      </Flex>
      <Grid
        w={'100%'}
        maxW={'1104px'}
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }}
        mx={'auto'}
        rowGap={3}
      >
        <GridItem textAlign={'center'} padding={3} borderRight={{ sm: '1px solid #242428' }}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'}>Chain</Text>
            <Box>Chain Selected</Box>
          </Flex>
        </GridItem>
        <GridItem textAlign={'center'} padding={3} borderRight={{ md: '1px solid #242428', lg: '1px solid #242428' }}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'}>Daily Rank</Text>
            <Text fontSize={'2xl'}>--</Text>
          </Flex>
        </GridItem>
        <GridItem
          textAlign={'center'}
          padding={3}
          borderRight={{ base: 'none', sm: '1px solid #242428', md: 'none', lg: '1px solid #242428' }}
        >
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'}>Weekly Rank</Text>
            <Text fontSize={'2xl'}>--</Text>
          </Flex>
        </GridItem>
        <GridItem textAlign={'center'} padding={3} borderRight={{ md: '1px solid #242428', lg: '1px solid #242428' }}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'}>Win Rate</Text>
            <Text fontSize={'2xl'}>0.00%</Text>
          </Flex>
        </GridItem>
        <GridItem textAlign={'center'} padding={3} borderRight={{ sm: '1px solid #242428' }}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'}>Won</Text>
            <Text fontSize={'2xl'}>10/12 trades</Text>
          </Flex>
        </GridItem>
        <GridItem textAlign={'center'} padding={3}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'}>Most Traded Asset</Text>
            <Text fontSize={'2xl'}>--</Text>
          </Flex>
        </GridItem>
      </Grid>
      <Flex
        w={'100%'}
        maxW={'763px'}
        marginX={'auto'}
        padding={5}
        gap={5}
        flexWrap={'wrap'}
        backgroundColor={'#252528'}
        borderRadius={'20px'}
        alignItems={'center'}
      >
        {/* <Box> */}
        <Box
          w={'55px'}
          h={'55px'}
          borderRadius={'100%'}
          overflow={'hidden'}
          bg={'yellow'}
          marginX={{ base: 'auto', sm: 'initial' }}
        >
          avata
        </Box>
        <Box>
          <Heading as="h4" fontSize={20} lineHeight={'30px'} color={'white'}>
            Invite your friends to join Ethora now!
          </Heading>
          <Text>Get fee discounts and rebates!</Text>
        </Box>
        <Button
          colorScheme="primary"
          fontSize={'16px'}
          size="md"
          marginLeft={'auto'}
          flex={{ base: '1', sm: '1', md: 'none' }}
          flexBasis={{ base: '142px', sm: '142px', md: 'auto' }}
        >
          Connect Wallet
        </Button>
        {/* </Box> */}
      </Flex>
      <div>
        <Heading as="h4" fontSize={24} lineHeight={'36px'} color={'white'} fontWeight={600} marginBottom={'20px'}>
          Metrics
        </Heading>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }}
          gap="25px"
        >
          <GridItem padding={5} borderRadius={'20px'} backgroundColor={'#3D3D40'} minH={'200px'}>
            <Text fontSize={'sm'} color={'white'} fontWeight={600} marginBottom={'40px'}>
              Referral Metrics
            </Text>
            <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
              <Box
                w={'80px'}
                h={'80px'}
                borderRadius={'100%'}
                overflow={'hidden'}
                bg={'yellow'}
                marginX={{ base: 'auto', sm: 'initial' }}
                marginBottom={'8px'}
              >
                avata
              </Box>
              <Text size={'sm'}>Wallet not connected.</Text>
            </Flex>
          </GridItem>
          <GridItem padding={5} borderRadius={'20px'} backgroundColor={'#3D3D40'} minH={'200px'}>
            <Text fontSize={'sm'} color={'white'} fontWeight={600} marginBottom={'40px'}>
              USDC Trading Metrics
            </Text>
            <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
              <Box
                w={'80px'}
                h={'80px'}
                borderRadius={'100%'}
                overflow={'hidden'}
                bg={'yellow'}
                marginX={{ base: 'auto', sm: 'initial' }}
                marginBottom={'8px'}
              >
                avata
              </Box>
              <Text size={'sm'}>Wallet not connected.</Text>
            </Flex>
          </GridItem>
        </Grid>
      </div>
      <div>
        <Heading as="h4" fontSize={24} lineHeight={'36px'} color={'white'} fontWeight={600} marginBottom={'20px'}>
          My trades
        </Heading>
        <Tabs>
          <TabList borderBottom={'none'}>
            <Tab>One</Tab>
            <Tab>Two</Tab>
            <Tab>Three</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <CustomTable columns={columns} data={data} onPaginationChange={(data) => console.log(data)} />
      </div>
    </Flex>
  );
}
