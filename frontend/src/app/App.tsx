import React from "react";
import styles from "./App.module.css";

import Title from "../views/Title";
import ContentBox from "../views/ContentBox";
import SubTitle from "../views/SubTitle";
import Button from "../views/Button";
import SelectInput from "../views/SelectInput";
import NumberInput from "../views/NumberInput";
import SelectFromSubInput from "../views/SelectFromSubInput";
import Embeddings from "../views/Embeddings";
import PerformanceMetrics from "../views/PerformanceMetrics";

const DATASETS = ["CIFAR-10"];
const BATCH_SIZES = ["8", "16", "32", "64", "128", "256", "512"];
const METHODS = ["method1", "method2", "method3", "method4"];
const MODELS = ["ResNet18"];
const SEEDS = ["1234"];
const UNLEARN_CLASSES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function App() {
  return (
    <section id={styles["body-wrapper"]}>
      <div>
        <Title title="Settings" />
        <ContentBox height={45}>
          <div className={styles["subset-wrapper"]}>
            <SubTitle subtitle="Initial Settings" />
            <SelectInput labelName="Model" optionData={MODELS} />
            <SelectInput labelName="Dataset" optionData={DATASETS} />
            <SelectFromSubInput
              name="Method"
              subNames={["Predefined", "Custom"]}
              subTypes={["select", "file"]}
              optionData={[METHODS]}
            />
            <SelectInput labelName="Seed" optionData={SEEDS} />
            <SelectInput
              labelName="Unlearn Class"
              optionData={UNLEARN_CLASSES}
              labelFontSize="md"
            />
          </div>
          <div style={{ marginTop: "1rem" }} />
          <div className={styles["subset-wrapper"]}>
            <SubTitle subtitle="Training | Unlearning" />
            <SelectInput labelName="Batch Size" optionData={BATCH_SIZES} />
            <NumberInput labelName="Learning Rate" />
            <NumberInput labelName="Epochs" />
          </div>
          <div style={{ marginTop: "0.6rem" }} />
          <Button buttonText="Run" />
        </ContentBox>
        <ContentBox height={25}></ContentBox>
        <Title title="Histories" />
        <ContentBox height={20}></ContentBox>
      </div>
      <div>
        <Title title="Embeddings" />
        <Embeddings />
        <PerformanceMetrics />
      </div>
      <div>
        <Title title="Privacy Attacks" />
        <ContentBox height={50}></ContentBox>
        <ContentBox height={45}></ContentBox>
      </div>
    </section>
  );
}
