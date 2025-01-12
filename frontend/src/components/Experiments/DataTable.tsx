import { useState, useEffect, useContext, useMemo } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  CellContext,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../UI/table";
import { ContextMenu, ContextMenuTrigger } from "../UI/context-menu";
import { COLORS } from "../../constants/colors";
import { useForgetClass } from "../../hooks/useForgetClass";
import { useModelSelection } from "../../hooks/useModelSelection";
import { calculatePerformanceMetrics } from "../../utils/data/experiments";
import { ExperimentData } from "../../types/data";
import { PerformanceMetrics } from "../../types/experiments";
import { hexToRgba } from "../../utils/data/colors";
import { ScrollArea } from "../UI/scroll-area";
import { ExperimentsContext } from "../../store/experiments-context";
import { BaselineComparisonContext } from "../../store/baseline-comparison-context";
import { RadioGroup, RadioGroupItem } from "../UI/radio-group";
import { cn } from "../../utils/util";
import { COLUMN_WIDTHS } from "./Columns";

const BASELINE = "baseline";
const COMPARISON = "comparison";

export default function DataTable({
  columns,
}: {
  columns: ColumnDef<ExperimentData>[];
}) {
  const { experiments } = useContext(ExperimentsContext);
  const { saveBaseline, saveComparison } = useContext(
    BaselineComparisonContext
  );

  const { forgetClass } = useForgetClass();
  const { baseline, comparison } = useModelSelection();

  const [sorting, setSorting] = useState<SortingState>([]);

  const tableData = useMemo(() => {
    const experimentsArray = Object.values(experiments);
    const pretrainedExp = experimentsArray.find(
      (exp) => exp.id === `000${forgetClass}`
    );
    const retrainedExp = experimentsArray.find(
      (exp) => exp.id === `a00${forgetClass}`
    );

    if (!pretrainedExp || !retrainedExp) return [];

    const remainingExps = experimentsArray.filter(
      (exp) => exp.id !== pretrainedExp.id && exp.id !== retrainedExp.id
    );

    return [pretrainedExp, retrainedExp, ...remainingExps];
  }, [experiments, forgetClass]);

  const performanceMetrics = calculatePerformanceMetrics(
    experiments
  ) as PerformanceMetrics;

  const modifiedColumns = columns.map((column) => {
    if (column.id === BASELINE) {
      return {
        ...column,
        cell: ({ row }: CellContext<ExperimentData, unknown>) => (
          <RadioGroup className="flex justify-center items-center ml-[0px]">
            <RadioGroupItem
              value={row.id}
              className={cn(
                "w-[18px] h-[18px] rounded-full",
                baseline === row.id && "[&_svg]:h-3 [&_svg]:w-3"
              )}
              checked={baseline === row.id}
              onClick={() => {
                saveBaseline(baseline === row.id ? "" : row.id);
              }}
              disabled={comparison === row.id}
            />
          </RadioGroup>
        ),
      };
    }
    if (column.id === COMPARISON) {
      return {
        ...column,
        cell: ({ row }: CellContext<ExperimentData, unknown>) => (
          <RadioGroup className="flex justify-center items-center ml-[0px]">
            <RadioGroupItem
              value={row.id}
              className={cn(
                "w-[18px] h-[18px] rounded-full",
                comparison === row.id && "[&_svg]:h-3 [&_svg]:w-3"
              )}
              checked={comparison === row.id}
              onClick={() => {
                saveComparison(comparison === row.id ? "" : row.id);
              }}
              disabled={baseline === row.id}
            />
          </RadioGroup>
        ),
      };
    }
    return column;
  });

  const opacityMapping = useMemo(() => {
    const mapping: { [key: string]: { [value: number]: number } } = {};

    Object.keys(performanceMetrics).forEach((columnId) => {
      if (!performanceMetrics[columnId]) return;

      const values = tableData
        .map((datum) => datum[columnId as keyof ExperimentData] as number)
        .filter(
          (value) =>
            value !== undefined && value !== null && typeof value === "number"
        );

      const uniqueValues = Array.from(new Set(values));

      uniqueValues.sort((a, b) => a - b);

      const numUniqueValues = uniqueValues.length;

      const valueOpacityMap: { [value: number]: number } = {};

      if (numUniqueValues === 0) {
        uniqueValues.forEach((value) => {
          valueOpacityMap[value] = 0;
        });
      } else if (numUniqueValues === 1) {
        valueOpacityMap[uniqueValues[0]] = 1;
      } else {
        uniqueValues.forEach((value, index) => {
          const opacity = index / (numUniqueValues - 1);
          valueOpacityMap[value] = opacity;
        });
      }

      mapping[columnId] = valueOpacityMap;
    });

    return mapping;
  }, [tableData, performanceMetrics]);

  const table = useReactTable({
    getRowId: (row: ExperimentData) => row.id,
    data: tableData as ExperimentData[],
    columns: modifiedColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting },
  });

  useEffect(() => {
    const baselineExists = Object.values(experiments).some(
      (experiment) => experiment.id === baseline
    );
    if (!baselineExists) {
      if (tableData.length > 0) {
        saveBaseline(tableData[0].id);
        saveComparison(tableData[1].id);
      } else {
        saveBaseline("");
        saveComparison("");
      }
    }
  }, [
    baseline,
    comparison,
    experiments,
    saveBaseline,
    saveComparison,
    tableData,
  ]);

  return (
    <div className="w-full h-[197px]">
      <div className="relative w-full">
        <Table className="w-full table-fixed border-t">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const columnWidth =
                    COLUMN_WIDTHS[
                      header.column.id as keyof typeof COLUMN_WIDTHS
                    ];
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: `${columnWidth}px`,
                        minWidth: `${columnWidth}px`,
                        ...(header.column.id === BASELINE && {
                          paddingRight: 0,
                        }),
                        ...(header.column.id === COMPARISON && {
                          paddingLeft: 0,
                        }),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
        </Table>
        <ScrollArea className="w-full h-[161px]">
          <Table className="w-full table-fixed">
            <TableBody
              className={`text-sm ${
                table.getRowModel().rows?.length <= 5 &&
                "[&_tr:last-child]:border-b"
              }`}
            >
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <ContextMenu>
                    <ContextMenuTrigger className="contents">
                      <TableRow
                        key={row.id}
                        id={row.id}
                        className="!border-b"
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell, idx) => {
                          const columnId = cell.column.id;
                          const columnWidth =
                            COLUMN_WIDTHS[
                              columnId as keyof typeof COLUMN_WIDTHS
                            ];

                          const isPerformanceMetric =
                            columnId in performanceMetrics;

                          let cellStyle: React.CSSProperties = {
                            width: `${columnWidth}px`,
                            minWidth: `${columnWidth}px`,
                            ...(columnId === BASELINE && { paddingRight: 0 }),
                            ...(columnId === COMPARISON && { paddingLeft: 0 }),
                          };

                          if (isPerformanceMetric) {
                            const { baseColor } = performanceMetrics[columnId];
                            const value = cell.getValue() as number;
                            const opacity =
                              opacityMapping[columnId]?.[value] ?? 0;

                            if (baseColor) {
                              let color, textColor;

                              if (tableData.length === 1 && value === 0) {
                                color = COLORS.WHITE;
                                textColor = COLORS.BLACK;
                              } else {
                                color = hexToRgba(baseColor, opacity);
                                textColor =
                                  opacity >= 0.8 ? COLORS.WHITE : COLORS.BLACK;
                              }

                              cellStyle = {
                                ...cellStyle,
                                borderLeft:
                                  columnId === "UA"
                                    ? "1px solid rgb(229 231 235)"
                                    : "none",
                                borderRight:
                                  idx === row.getVisibleCells().length - 1
                                    ? "none"
                                    : "1px solid rgb(229 231 235)",
                                backgroundColor: color,
                                color: textColor,
                              };
                            }
                          }

                          return (
                            <TableCell key={cell.id} style={cellStyle}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </ContextMenuTrigger>
                  </ContextMenu>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[178px] text-center text-gray-500 text-[15px]"
                  >
                    Failed to load the data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
