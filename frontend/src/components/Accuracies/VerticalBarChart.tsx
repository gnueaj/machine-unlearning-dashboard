import { useMemo, useCallback, memo } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ReferenceLine,
  Label,
  Tooltip,
  TooltipProps,
} from "recharts";

import {
  BaselineNeuralNetworkIcon,
  ComparisonNeuralNetworkIcon,
} from "../UI/icons";
import {
  FORGET_CLASS_NAMES,
  FONT_CONFIG,
  STROKE_CONFIG,
} from "../../constants/common";
import { COLORS } from "../../constants/colors";
import { VERTICAL_BAR_CHART_CONFIG } from "../../constants/accuracies";
import { useForgetClass } from "../../hooks/useForgetClass";
import { ChartContainer } from "../UI/chart";
import { GapDataItem } from "../../types/accuracies";

const CONFIG = {
  TOOLTIP_TO_FIXED_LENGTH: 3,
  BAR_HEIGHT: 12,
} as const;

interface Props {
  mode: "Training" | "Test";
  gapData: GapDataItem[];
  maxGap: number;
  showYAxis?: boolean;
  hoveredClass: string | null;
  onHoverChange: (value: string | null) => void;
}

export default function VerticalBarChart({
  mode,
  gapData,
  maxGap,
  showYAxis = true,
  hoveredClass,
  onHoverChange,
}: Props) {
  const { forgetClassNumber } = useForgetClass();

  const renderTick = useCallback(
    (props: any) => (
      <AxisTick
        {...props}
        hoveredClass={hoveredClass}
        forgetClass={forgetClassNumber}
      />
    ),
    [forgetClassNumber, hoveredClass]
  );

  const remainGapAvgValue = useMemo(() => {
    const remainingData = gapData.filter(
      (datum) =>
        FORGET_CLASS_NAMES[+datum.classLabel] !==
        FORGET_CLASS_NAMES[forgetClassNumber]
    );

    return remainingData.length
      ? remainingData.reduce((sum, datum) => sum + datum.gap, 0) /
          remainingData.length
      : 0;
  }, [forgetClassNumber, gapData]);

  const remainGapAvg = remainGapAvgValue.toFixed(
    CONFIG.TOOLTIP_TO_FIXED_LENGTH
  );

  return (
    <div className="flex flex-col justify-center items-center relative">
      <span
        className={`text-[15px] relative ${
          mode === "Training" ? "left-[30px]" : "left-0"
        }`}
      >
        {mode} Dataset
      </span>
      <ChartContainer
        config={VERTICAL_BAR_CHART_CONFIG}
        className={`${showYAxis ? "w-[265px]" : "w-[205px]"} h-[233px]`}
      >
        <BarChart
          accessibilityLayer
          data={gapData}
          layout="vertical"
          margin={{
            left: 8,
            right: 8,
            top: 12,
            bottom: 2,
          }}
          onMouseMove={(state: any) => {
            if (state?.activePayload) {
              onHoverChange(state.activePayload[0].payload.category);
            }
          }}
          onMouseLeave={() => onHoverChange(null)}
        >
          <YAxis
            limitingConeAngle={30}
            dataKey="category"
            type="category"
            tickLine={false}
            axisLine={{ stroke: COLORS.BLACK }}
            interval={0}
            fontSize={FONT_CONFIG.FONT_SIZE_10}
            fontWeight={FONT_CONFIG.LIGHT_FONT_WEIGHT}
            tick={showYAxis ? renderTick : false}
            width={showYAxis ? 60 : 1}
            tickMargin={-1}
            tickFormatter={(value) => {
              const label =
                VERTICAL_BAR_CHART_CONFIG[
                  value as keyof typeof VERTICAL_BAR_CHART_CONFIG
                ]?.label;
              const isForgetClass =
                label === FORGET_CLASS_NAMES[forgetClassNumber];
              return isForgetClass ? `${label}\u00A0(X)` : label;
            }}
            style={{ whiteSpace: "nowrap" }}
          />
          <XAxis
            dataKey="value"
            type="number"
            axisLine={{ stroke: COLORS.BLACK }}
            domain={[-maxGap, maxGap]}
            tickFormatter={(value) => value.toString()}
            fontSize={FONT_CONFIG.FONT_SIZE_10}
            ticks={[-maxGap, 0, maxGap]}
          >
            <Label
              fill={COLORS.BLACK}
              className="-translate-y-2 text-xs"
              value={`← Baseline High | Comparison High →`}
              offset={-1}
              dx={8.5}
              position="bottom"
            />
          </XAxis>
          <ReferenceLine x={0} stroke={COLORS.GRAY} />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Bar dataKey="gap" layout="vertical" barSize={CONFIG.BAR_HEIGHT} />
          <ReferenceLine
            x={remainGapAvg}
            stroke={COLORS.GRAY}
            strokeDasharray={STROKE_CONFIG.STROKE_DASHARRAY}
            label={{
              value: `avg (remain): ${remainGapAvg}`,
              position: "top",
              fontSize: FONT_CONFIG.FONT_SIZE_10,
              fill: COLORS.BLACK,
              offset: 3.5,
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as GapDataItem;

    return (
      <div className="rounded-lg border border-border/50 bg-white px-2 py-1 text-sm shadow-xl">
        <div className="flex items-center">
          <BaselineNeuralNetworkIcon className="mr-1" />
          <p>
            Baseline:{" "}
            <span className="font-semibold">
              {data.baselineAccuracy.toFixed(CONFIG.TOOLTIP_TO_FIXED_LENGTH)}
            </span>
          </p>
        </div>
        <div className="flex items-center">
          <ComparisonNeuralNetworkIcon className="mr-1" />
          <p>
            Comparison:{" "}
            <span className="font-semibold">
              {data.comparisonAccuracy.toFixed(CONFIG.TOOLTIP_TO_FIXED_LENGTH)}
            </span>
          </p>
        </div>
        <p>
          Difference:{" "}
          <span className="font-semibold">
            {data.gap.toFixed(CONFIG.TOOLTIP_TO_FIXED_LENGTH)}
          </span>
        </p>
      </div>
    );
  }
  return null;
}

type TickProps = {
  x: number;
  y: number;
  payload: any;
  hoveredClass: string | null;
  forgetClass: number;
};

const AxisTick = memo(
  ({ x, y, payload, hoveredClass, forgetClass }: TickProps) => {
    const label =
      VERTICAL_BAR_CHART_CONFIG[
        payload.value as keyof typeof VERTICAL_BAR_CHART_CONFIG
      ]?.label;
    const isForgetClass = label === FORGET_CLASS_NAMES[forgetClass];
    const formattedLabel = isForgetClass ? `${label}\u00A0(X)` : label;

    return (
      <text
        x={x}
        y={y}
        dy={4}
        textAnchor="end"
        fontSize={FONT_CONFIG.FONT_SIZE_10}
        fontWeight={
          hoveredClass === payload.value
            ? "bold"
            : FONT_CONFIG.LIGHT_FONT_WEIGHT
        }
      >
        {formattedLabel}
      </text>
    );
  }
);
