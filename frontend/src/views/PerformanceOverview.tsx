import { useContext, useEffect } from "react";
import * as d3 from "d3";

import DataTable from "../components/DataTable";
import { OverviewContext } from "../store/overview-context";
import { BaselineContext } from "../store/baseline-context";
import { SelectedIDContext } from "../store/selected-id-context";
import { retrainedData } from "../constants/gt";
import { AnalysisTextLinkIcon } from "../components/ui/icons";
import { Overview, colors, columns } from "../components/Columns";

export const payments: Overview[] = [
  {
    id: "231a",
    forget: "0",
    training: "-",
    unlearning: "Retrain",
    defense: "-",
    ua: 0.013,
    ra: 0.989,
    ta: 0.947,
    tua: 0.978,
    tra: 0.986,
    rte: 1480.1,
    rank: 1,
  },
  {
    id: "7g9b",
    forget: "1",
    training: "best_train_resnet18_CIFAR10_30epochs_0.01lr.pth",
    unlearning: "Random-Label",
    defense: "-",
    ua: 0.007,
    ra: 0.973,
    ta: 0.995,
    tua: 0.974,
    tra: 0.987,
    rte: 1460.2,
    rank: 2,
  },
  {
    id: "6k3a",
    forget: "1",
    training: "-",
    unlearning: "Fine-Tuning",
    defense: "-",
    ua: 0.01,
    ra: 0.991,
    ta: 0.992,
    tua: 0.991,
    tra: 0.998,
    rte: 1473.8,
    rank: 3,
  },
  {
    id: "p83h",
    forget: "3",
    training: "-",
    unlearning: "Retrain",
    defense: "-",
    ua: 0.004,
    ra: 1.0,
    ta: 0.981,
    tua: 0.99,
    tra: 0.975,
    rte: 1491.7,
    rank: 4,
  },
  {
    id: "j30a",
    forget: "2",
    training: "best_train_resnet18_CIFAR10_30epochs_0.01lr.pth",
    unlearning: "Gradient-Ascent",
    defense: "-",
    ua: 0.008,
    ra: 0.981,
    ta: 0.998,
    tua: 0.983,
    tra: 0.988,
    rte: 1465.5,
    rank: 5,
  },
  {
    id: "qq78",
    forget: "2",
    training: "-",
    unlearning: "Fine-Tuning",
    defense: "-",
    ua: 0.011,
    ra: 0.997,
    ta: 0.987,
    tua: 0.984,
    tra: 0.993,
    rte: 1459.4,
    rank: 6,
  },
  {
    id: "v097",
    forget: "1",
    training: "-",
    unlearning: "Random-Label",
    defense: "-",
    ua: 0.009,
    ra: 0.914,
    ta: 0.967,
    tua: 0.972,
    tra: 0.991,
    rte: 1478.2,
    rank: 7,
  },
  {
    id: "z8c0",
    forget: "9",
    training: "best_train_resnet18_CIFAR10_30epochs_0.01lr.pth",
    unlearning: "Gradient-Ascent",
    defense: "-",
    ua: 0.012,
    ra: 0.957,
    ta: 0.964,
    tua: 0.969,
    tra: 0.99,
    rte: 1497.5,
    rank: 8,
  },
  {
    id: "j68d",
    forget: "6",
    training: "best_train_resnet18_CIFAR10_30epochs_0.01lr.pth",
    unlearning: "Fint-Tuning",
    defense: "-",
    ua: 0.011,
    ra: 0.978,
    ta: 0.981,
    tua: 0.977,
    tra: 0.962,
    rte: 1497.7,
    rank: 9,
  },
];
const values = {
  ua: payments.map((d) => d.ua),
  ra: payments.map((d) => d.ra),
  ta: payments.map((d) => d.ta),
  tua: payments.map((d) => d.tua),
  tra: payments.map((d) => d.tra),
  rte: payments.map((d) => d.rte),
};
const performanceMetrics = {
  ua: {
    colorScale: d3.scaleQuantile<string>().domain(values.ua).range(colors),
  },
  ra: {
    colorScale: d3.scaleQuantile<string>().domain(values.ra).range(colors),
  },
  ta: {
    colorScale: d3.scaleQuantile<string>().domain(values.ta).range(colors),
  },
  tua: {
    colorScale: d3.scaleQuantile<string>().domain(values.tua).range(colors),
  },
  tra: {
    colorScale: d3.scaleQuantile<string>().domain(values.tra).range(colors),
  },
  rte: {
    colorScale: d3.scaleQuantile<string>().domain(values.rte).range(colors),
  },
};

export default function PerformanceOverview({ height }: { height: number }) {
  const { overview, retrieveOverview } = useContext(OverviewContext);
  const { baseline } = useContext(BaselineContext);
  const { selectedID, saveSelectedID } = useContext(SelectedIDContext);

  useEffect(() => {
    retrieveOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOverview = overview.filter(
    (el) => el.forget_class === baseline.toString()
  );

  const handleTableRowClick = (idx: number) => {
    saveSelectedID(idx);
  };

  const currRetrainedData = retrainedData[baseline];
  const retrainedUA = currRetrainedData.unlearn_accuracy;
  const retrainedRA = currRetrainedData.remain_accuracy;
  const retrainedTA = currRetrainedData.test_accuracy;

  const colorScale = d3
    .scaleSequential<string>(
      d3.interpolateRgbBasis(["#F2AAA8", "#FFFFFF", "#A6A6F9"])
    )
    .domain([1, 0]);

  return (
    <section
      style={{ height: `${height}px` }}
      className="w-[1110px] p-[5px] relative border-[1px] border-solid border-[rgba(0, 0, 0, 0.2)]"
    >
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center">
          <AnalysisTextLinkIcon />
          <h5 className="font-semibold ml-[3px]">Overview</h5>
        </div>
        <div className="flex flex-col items-start absolute right-[6px] top-3">
          <div className="text-[11px]">Performance</div>
          <div className="w-[250px] h-5 relative">
            <div
              className="w-full h-[10px]"
              style={{
                background: `linear-gradient(to right, ${colorScale(
                  0
                )}, ${colorScale(0.5)}, ${colorScale(1)})`,
              }}
            ></div>
            <div className="flex justify-between w-full text-[11px] mt-[2px]">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={payments}
        performanceMetrics={performanceMetrics}
      />
    </section>
  );
}
