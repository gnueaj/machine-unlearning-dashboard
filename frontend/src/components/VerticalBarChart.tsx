import { useContext } from "react";
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

import { forgetClassNames } from "../constants/forgetClassNames";
import { TABLEAU10 } from "../constants/tableau10";
import { ChartContainer, type ChartConfig } from "./UI/chart";
import { ForgetClassContext } from "../store/forget-class-context";
import { GapDataItem } from "../views/Accuracies";

const TOOLTIP_FIX_LENGTH = 3;
const LABEL_FONT_SIZE = 11;
const chartConfig = {
  value: {
    label: "Gap",
  },
  A: {
    label: "airplane",
    color: TABLEAU10[0],
  },
  B: {
    label: "automobile",
    color: TABLEAU10[1],
  },
  C: {
    label: "bird",
    color: TABLEAU10[2],
  },
  D: {
    label: "cat",
    color: TABLEAU10[3],
  },
  E: {
    label: "deer",
    color: TABLEAU10[4],
  },
  F: {
    label: "dog",
    color: TABLEAU10[5],
  },
  G: {
    label: "frog",
    color: TABLEAU10[6],
  },
  H: {
    label: "horse",
    color: TABLEAU10[7],
  },
  I: {
    label: "ship",
    color: TABLEAU10[8],
  },
  J: {
    label: "truck",
    color: TABLEAU10[9],
  },
} satisfies ChartConfig;

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as GapDataItem;
    return (
      <div className="rounded-lg border border-border/50 bg-white px-2.5 py-1.5 text-sm shadow-xl">
        <p className="font-medium">
          Class: {forgetClassNames[+data.classLabel]}
        </p>
        <p>Gap: {data.gap.toFixed(TOOLTIP_FIX_LENGTH)}</p>
        <p>Baseline: {data.baselineAccuracy.toFixed(TOOLTIP_FIX_LENGTH)}</p>
        <p>Comparison: {data.comparisonAccuracy.toFixed(TOOLTIP_FIX_LENGTH)}</p>
      </div>
    );
  }
  return null;
}

interface Props {
  mode: "Training" | "Test";
  gapData: GapDataItem[] | [];
  maxGap: number;
}

export default function VerticalBarChart({ mode, gapData, maxGap }: Props) {
  const { forgetClass } = useContext(ForgetClassContext);

  return (
    <div className="flex flex-col justify-center items-center">
      <h5 className="text-[15px] mb-1 ml-5">{mode} Dataset</h5>
      <ChartContainer config={chartConfig} className="w-[240px] h-[200px]">
        <BarChart
          accessibilityLayer
          data={gapData}
          layout="vertical"
          margin={{
            left: 1,
            right: 40,
            top: 0,
            bottom: 8,
          }}
        >
          <YAxis
            limitingConeAngle={30}
            dataKey="category"
            type="category"
            tickLine={false}
            axisLine={true}
            interval={0}
            fontSize={LABEL_FONT_SIZE}
            tickFormatter={(value) => {
              const label =
                chartConfig[value as keyof typeof chartConfig]?.label;
              const isForgetClass =
                forgetClass && label === forgetClassNames[forgetClass];
              return isForgetClass ? label + " (X)" : label;
            }}
          />
          <XAxis
            dataKey="value"
            type="number"
            domain={[-maxGap, maxGap]}
            tickFormatter={(value) => value.toString()}
            fontSize={LABEL_FONT_SIZE}
            ticks={[-maxGap, 0, maxGap]}
          >
            <Label
              fill="black"
              className="-translate-y-1 text-[13px] font-light"
              value={`← Baseline High | Comparison High →`}
              offset={-2}
              dx={9}
              position="bottom"
            />
          </XAxis>
          <ReferenceLine x={0} stroke="#777" />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Bar dataKey="gap" layout="vertical" />
        </BarChart>
      </ChartContainer>
    </div>
  );
}