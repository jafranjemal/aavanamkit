import React, { useMemo } from "react";
import { Group, Rect, Text } from "react-konva";

import * as Konva from "konva";

// A helper function to calculate the wrapped height of a text string.
const getWrappedTextHeight = (text, width, fontSize) => {
  if (!text) return 0;
  const tempText = new Konva.Text({
    text: String(text),
    width: width - 10, // Subtract padding
    fontSize: fontSize,
    fontFamily: "sans-serif",
  });
  return tempText.height();
};

const TableElement = React.forwardRef((props, ref) => {
  const {
    columns = [],
    header = {
      height: 30,
      fontSize: 12,
      backgroundColor: "#f0f0f0",
      textColor: "#000",
    },
    rows = {
      minHeight: 25,
      fontSize: 10,
      textColor: "#333",
      evenBackgroundColor: "#fff",
      oddBackgroundColor: "#f9f9f9",
    },
    width,
    dataBinding,
  } = props;

  const sampleData = useMemo(() => {
    if (!columns.length) return [];
    const sample = {};
    columns.forEach((col) => {
      sample[col.dataKey] = `Sample data for ${col.header}.`;
    });
    return [sample];
  }, [columns]);

  const tableData = dataBinding ? sampleData : [];

  const calculatedRows = tableData.map((item) => {
    let maxHeight = rows.minHeight;
    columns.forEach((col) => {
      const cellText = item[col.dataKey];
      const cellHeight =
        getWrappedTextHeight(cellText, col.width, rows.fontSize) + 10;
      maxHeight = Math.max(maxHeight, cellHeight);
    });
    return { data: item, height: maxHeight };
  });

  // THE FIX: We create an array of all the visual components first.
  const tableNodes = [];
  let currentY = 0;

  // Header
  tableNodes.push(
    <Rect
      key="header-bg"
      x={0}
      y={currentY}
      width={width}
      height={header.height}
      fill={header.backgroundColor}
    />
  );
  columns.forEach((col, i) => {
    const colX = columns.slice(0, i).reduce((acc, c) => acc + c.width, 0);
    tableNodes.push(
      <Text
        key={`header-text-${i}`}
        x={colX + 5}
        y={currentY + 5}
        width={col.width - 10}
        height={header.height - 10}
        text={col.header}
        fontSize={header.fontSize}
        fill={header.textColor}
        fontStyle="bold"
        verticalAlign="middle"
      />
    );
  });
  currentY += header.height;

  // Data Rows
  calculatedRows.forEach((row, rowIndex) => {
    const rowY = currentY;
    const rowBgColor =
      rowIndex % 2 === 0 ? rows.evenBackgroundColor : rows.oddBackgroundColor;

    tableNodes.push(
      <Rect
        key={`row-bg-${rowIndex}`}
        x={0}
        y={rowY}
        width={width}
        height={row.height}
        fill={rowBgColor}
      />
    );

    columns.forEach((col, colIndex) => {
      const colX = columns
        .slice(0, colIndex)
        .reduce((acc, c) => acc + c.width, 0);
      tableNodes.push(
        <Text
          key={`row-${rowIndex}-col-${colIndex}`}
          x={colX + 5}
          y={rowY + 5}
          width={col.width - 10}
          height={row.height - 10}
          text={String(row.data[col.dataKey] || "")}
          fontSize={rows.fontSize}
          fill={rows.textColor}
          verticalAlign="middle"
          wrap="word"
        />
      );
    });
    currentY += row.height;
  });

  // Column Resizing Lines
  let accumulatedX = 0;
  columns.forEach((col, i) => {
    if (i < columns.length - 1) {
      accumulatedX += col.width;
      tableNodes.push(
        <Rect
          key={`divider-${i}`}
          x={accumulatedX}
          y={0}
          width={1}
          height={props.height}
          fill="#ccc"
        />
      );
    }
  });

  return (
    <Group {...props} ref={ref}>
      <Rect
        width={width}
        height={props.height}
        stroke="black"
        strokeWidth={1}
      />
      {/* Now we render the clean array of nodes */}
      {tableNodes}
    </Group>
  );
});

export default TableElement;
