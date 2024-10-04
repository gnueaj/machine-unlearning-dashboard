import { useState, useEffect, useContext } from "react";

import Header from "../components/Header";
import Settings from "../views/Settings";
import PerformanceOverview from "../views/PerformanceOverview";
import Accuracies from "../views/Accuracies";
import Core from "../views/Core";
import Predictions from "../views/Predictions";
import Correlations from "../views/Correlations";
import { BaselineContext } from "../store/baseline-context";
import { SelectedIDContext } from "../store/selected-id-context";
import { OverviewContext } from "../store/overview-context";

const UPPER_HEIGHT = 290;
const LOWER_HEIGHT = 720;

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const { baseline, saveBaseline, retrieveBaseline } =
    useContext(BaselineContext);
  const { saveSelectedID } = useContext(SelectedIDContext);
  const { overview, retrieveOverview } = useContext(OverviewContext);

  useEffect(() => {
    retrieveBaseline();
    retrieveOverview();

    saveBaseline(baseline ?? 0);
    saveSelectedID(overview.length === 0 ? 0 : overview.length - 1);

    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overview.length]);

  if (isLoading) {
    return <div>Loading . . .</div>;
  }

  return (
    <section>
      <Header />
      <div className="flex">
        <Settings height={UPPER_HEIGHT} />
        <PerformanceOverview height={UPPER_HEIGHT} />
        <Accuracies height={UPPER_HEIGHT} />
      </div>
      <div className="flex">
        <Core height={LOWER_HEIGHT} />
        <div className="flex flex-col">
          <Predictions height={257} />
          <Correlations height={LOWER_HEIGHT - 257} />
        </div>
      </div>
    </section>
  );
}
