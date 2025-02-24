import React, { Key } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { Types } from "mongoose";

type TableProps<T extends { _id: Types.ObjectId }> = {
  data: T[];
  columns: { name: string; uid: string }[];
  renderCell: (
    item: T,
    column: { name: string; uid: string }
  ) => React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
};

const ReusableTable = <T extends { _id: Types.ObjectId }>({
  data,
  columns,
  renderCell,
  onLoadMore,
  hasMore,
  isLoading,
}: TableProps<T>) => {
  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore,
    onLoadMore,
  });
  return (
    <Table
      style={{ backgroundColor: "#09090b" }}
      aria-label="Reusable Table with Infinite Scroll"
      isHeaderSticky
      baseRef={scrollerRef}
      bottomContent={
        isLoading ? (
          <div className="flex w-full justify-center">
            <Spinner ref={loaderRef} color="white" />
          </div>
        ) : null
      }
      classNames={{
        base: "max-h-[520px] overflow-scroll ",
        table: "min-h-[400px]",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody>
        {data.map((item) => {
          return (
            <TableRow key={String(item._id) as Key}>
              {columns.map((columnData, columnKey) => (
                <TableCell key={`${item._id}-${columnKey}`}>
                  {renderCell(item, columnData)}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ReusableTable;
