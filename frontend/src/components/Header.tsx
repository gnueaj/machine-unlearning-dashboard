// import { useState } from "react";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import {
//   EraserIcon,
//   NeuralNetworkIcon,
//   GitCompareIcon,
//   PlayCircleIcon,
// } from "./ui/icons";

export default function Header() {
  // const [forgetClass, setForgetClass] = useState("0");
  // const [baselineModel, setBaselineModel] = useState("231a");
  // const [comparisonModel, setComparisonModel] = useState("231a");

  // const handleApplyBtnClick = () => {
  //   console.log("Apply Button Clicked!");
  // };

  return (
    <div className="w-full text-white bg-black h-[66px] flex justify-start items-center px-4">
      <span className="ml-2 text-[40px] font-semibold">Title</span>
      <div className="ml-5 h-9 flex items-end">
        <span className="mr-3 text-[11px]">
          <strong>Model</strong>: Resnet18
        </span>
        <span className="text-[11px]">
          <strong>Dataset</strong>: CIFAR-10
        </span>
      </div>
      {/* <ul className="flex text-[20px] font-semibold">
        <li className="flex items-center">
          <EraserIcon className="text-white w-6 h-6 mr-1" />
          <span className="mr-[10px]">Forget Class</span>
          <Select onValueChange={setForgetClass} value={forgetClass}>
            <SelectTrigger className="w-[128px] h-6 bg-white text-black font-normal pr-1">
              <SelectValue placeholder="0" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
                (el, idx) => (
                  <SelectItem key={idx} value={el}>
                    {el}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </li>
        <li className="flex items-center mx-[22px]">
          <NeuralNetworkIcon className="text-white w-6 h-6 mr-1" />
          <span className="mr-[10px]">Baseline Model</span>
          <Select onValueChange={setBaselineModel} value={baselineModel}>
            <SelectTrigger className="w-[128px] h-6 bg-white text-black font-normal pr-1">
              <SelectValue placeholder="Select a forget class" />
            </SelectTrigger>
            <SelectContent defaultValue="231a" className="bg-white text-black">
              {[
                "231a",
                "7g9b",
                "6k3a",
                "j30a",
                "qq78",
                "p83h",
                "v097",
                "z8c0",
              ].map((el, idx) => (
                <SelectItem key={idx} value={el}>
                  {el}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </li>
        <li className="flex items-center">
          <GitCompareIcon className="text-white w-6 h-6 mr-1" />
          <span className="mr-[10px]">Comparison Model</span>
          <Select onValueChange={setComparisonModel} value={comparisonModel}>
            <SelectTrigger className="w-[128px] h-6 bg-white text-black font-normal pr-1">
              <SelectValue placeholder="Select a forget class" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {[
                "231a",
                "7g9b",
                "6k3a",
                "j30a",
                "qq78",
                "p83h",
                "v097",
                "z8c0",
              ].map((el, idx) => (
                <SelectItem key={idx} value={el}>
                  {el}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </li>
        <li
          onClick={handleApplyBtnClick}
          className="w-10 h-10 flex justify-center rounded-full items-center ml-[18px] cursor-pointer bg-transparent hover:bg-slate-900 transition"
        >
          <PlayCircleIcon className="w-7 h-7" />
        </li>
      </ul> */}
    </div>
  );
}
