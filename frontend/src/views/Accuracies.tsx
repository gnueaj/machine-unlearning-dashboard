import { useMemo, useContext, useState } from "react";

import View from "../components/View";
import Title from "../components/Title";
import Indicator from "../components/Indicator";
import VerticalBarChart from "../components/Accuracies/VerticalBarChart";
import { ViewProps } from "../types/common";
import { Chart01Icon } from "../components/UI/icons";
import { ForgetClassContext } from "../store/forget-class-context";
import { BaselineComparisonContext } from "../store/baseline-comparison-context";
import { ExperimentsContext } from "../store/experiments-context";
import { getAccuracyGap, getMaxGap } from "../utils/data/accuracies";

export default function Accuracies({ width, height }: ViewProps) {
  const { forgetClass } = useContext(ForgetClassContext);
  const { baseline, comparison } = useContext(BaselineComparisonContext);
  const { baselineExperiment, comparisonExperiment } =
    useContext(ExperimentsContext);

  const [hoveredClass, setHoveredClass] = useState<string | null>(null);

  const trainAccuracyGap = useMemo(
    () => getAccuracyGap(baselineExperiment?.accs, comparisonExperiment?.accs),
    [baselineExperiment?.accs, comparisonExperiment?.accs]
  );
  const testAccuracyGap = useMemo(
    () =>
      getAccuracyGap(baselineExperiment?.t_accs, comparisonExperiment?.t_accs),
    [baselineExperiment?.t_accs, comparisonExperiment?.t_accs]
  );

  const trainMaxGap = getMaxGap(trainAccuracyGap);
  const testMaxGap = getMaxGap(testAccuracyGap);

  const maxGap = Math.max(trainMaxGap, testMaxGap);

  const forgetClassExist = forgetClass !== undefined;
  const bothBaselineComparisonExist = baseline !== "" && comparison !== "";

  return (
    <View width={width} height={height} className="border-t-0">
      <Title
        Icon={<Chart01Icon />}
        title="Accuracies"
        customClass="bottom-[2px] right-[1px]"
        AdditionalContent={
          <span className="ml-1">(Comparison - Baseline)</span>
        }
      />
      {forgetClassExist ? (
        bothBaselineComparisonExist ? (
          <div className="w-full flex items-center relative bottom-0.5">
            <VerticalBarChart
              mode="Training"
              gapData={trainAccuracyGap}
              maxGap={maxGap}
              hoveredClass={hoveredClass}
              setHoveredClass={setHoveredClass}
            />
            <VerticalBarChart
              mode="Test"
              gapData={testAccuracyGap}
              maxGap={maxGap}
              showYAxis={false}
              hoveredClass={hoveredClass}
              setHoveredClass={setHoveredClass}
            />
          </div>
        ) : (
          <Indicator about="BaselineComparison" />
        )
      ) : (
        <Indicator about="ForgetClass" />
      )}
    </View>
  );
}
