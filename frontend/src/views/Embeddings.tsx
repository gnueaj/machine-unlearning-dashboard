import { useState } from "react";

import SvgViewer from "../components/SvgViewer";
import ToggleGroup from "../components/ToggleGroup";
import { Slider } from "../components/ui/slider";
import { Separator } from "../components/ui/separator";
import { TABLEAU10 } from "../constants/tableau10";
import {
  ChartScatterIcon,
  CircleIcon,
  CursorPointer01Icon,
  Drag01Icon,
  MultiplicationSignIcon,
  RepeatIcon,
  ScrollVerticalIcon,
  NeuralNetworkIcon,
  GitCompareIcon,
} from "../components/ui/icons";

interface Props {
  height: number;
}

export default function Embeddings({ height }: Props) {
  const [neighbors, setNeighbors] = useState([5]);
  const [dist, setDist] = useState([0.1]);

  const handleReplayClick = () => {
    console.log("Replay Button Clicked !");
  };

  return (
    <section
      style={{ height: `${height}` }}
      className="w-[1440px] px-[5px] py-[4px] border-[1px] border-solid border-[rgba(0, 0, 0, 0.2)]"
    >
      <div className="flex justify-between items-center mb-[2px]">
        <div className="flex items-center">
          <ChartScatterIcon />
          <h5 className="font-semibold ml-[3px]">Embeddings</h5>
        </div>
        <div className="w-[680px] flex justify-end items-center">
          <div className="flex items-center">
            <span>neighbors</span>
            <div className="flex items-center">
              <Slider
                onValueChange={(value: number[]) => setNeighbors(value)}
                value={neighbors}
                defaultValue={[5]}
                className="w-44 mx-2 cursor-pointer"
                min={5}
                max={15}
                step={1}
              />
              <span className="w-2 text-[14px]">{neighbors}</span>
            </div>
          </div>
          <div className="flex items-center mx-8">
            <span>min_dist</span>
            <div className="flex items-center">
              <Slider
                onValueChange={(value: number[]) => setDist(value)}
                value={dist}
                defaultValue={[0.1]}
                className="w-44 mx-2 cursor-pointer"
                min={0.1}
                max={0.5}
                step={0.05}
              />
              <span className="w-4 text-[14px]">{dist}</span>
            </div>
          </div>
          <RepeatIcon
            onClick={handleReplayClick}
            className="scale-125 cursor-pointer mr-2"
          />
        </div>
      </div>
      <div className="w-[1428px] h-[683px] flex justify-evenly items-center border-[1px] border-solid border-[rgba(0, 0, 0, 0.2)] rounded-[6px]">
        <div className="w-[116px] h-[660px] flex flex-col justify-center items-center">
          {/* Legend - Metadata */}
          <div className="w-full h-[105px] flex flex-col justify-start items-start mb-[5px] px-2 py-[5px] border-[1px] border-solid border-[rgba(0, 0, 0, 0.2)] rounded-[6px]">
            <span className="text-[15px]">Metadata</span>
            <div className="flex flex-col justify-start items-start">
              <span className="text-[15px] font-light">Points: 2000</span>
              <span className="text-[15px] font-light">Dimension: 8192</span>
              <span className="text-[15px] font-light">Dataset: Training</span>
            </div>
          </div>
          {/* Legend - Controls */}
          <div className="w-full h-[105px] flex flex-col justify-start items-start mb-[5px] px-[10px] py-[5px] border-[1px] border-solid border-[rgba(0, 0, 0, 0.2)] rounded-[6px]">
            <span className="text-[15px]">Controls</span>
            <div>
              <div className="flex items-center">
                <CursorPointer01Icon className="scale-110 mr-[6px]" />
                <span className="text-[15px] font-light">Details</span>
              </div>
              <div className="flex items-center -my-[2px]">
                <ScrollVerticalIcon className="scale-110 mr-[6px]" />
                <span className="text-[15px] font-light">Zooming</span>
              </div>
              <div className="flex items-center">
                <Drag01Icon className="scale-110 mr-[6px]" />
                <span className="text-[15px] font-light">Panning</span>
              </div>
            </div>
          </div>
          {/* Legend - Data Type */}
          <div className="w-full h-[85px] flex flex-col justify-start items-start mb-[5px] px-[10px] py-[5px] border-[1px] border-solid border-[rgba(0, 0, 0, 0.2)] rounded-[6px]">
            <span className="text-[15px]">Data Type</span>
            <div>
              <div className="flex items-center text-[15px] font-light">
                <CircleIcon className="scale-75 mr-[6px]" />
                <span>Retrained</span>
              </div>
              <div className="flex items-center text-[15px] font-light">
                <MultiplicationSignIcon className="scale-125 mr-[6px]" />
                <span>Forgotten</span>
              </div>
            </div>
          </div>
          {/* Legend - Predictions */}
          <div className="w-full h-[358px] flex flex-col justify-start items-start px-[10px] py-[7px] border-[1px] border-solid border-[rgba(0, 0, 0, 0.2)] rounded-[6px]">
            <span className="text-[15px]">Predictions</span>
            <div>
              <div className="flex items-center mb-[2px]">
                <div
                  style={{ backgroundColor: `${TABLEAU10[0]}` }}
                  className="w-[14px] h-[30px] mr-[6px]"
                />
                <span className="text-[15px] font-light">airplane</span>
              </div>
              <div className="flex items-center mb-[2px]">
                <div
                  style={{ backgroundColor: `${TABLEAU10[1]}` }}
                  className="w-[14px] h-[30px] mr-[6px]"
                />
                <span className="text-[15px] font-light">automobile</span>
              </div>
              <div className="flex items-center mb-[2px]">
                <div
                  style={{ backgroundColor: `${TABLEAU10[2]}` }}
                  className="w-[14px] h-[30px] mr-[6px]"
                />
                <span className="text-[15px] font-light">bird</span>
              </div>
              <div className="flex items-center mb-[2px]">
                <div
                  style={{ backgroundColor: `${TABLEAU10[3]}` }}
                  className="w-[14px] h-[30px] mr-[6px]"
                />
                <span className="text-[15px] font-light">cat</span>
              </div>
              <div className="flex items-center mb-[2px]">
                <div
                  style={{ backgroundColor: `${TABLEAU10[4]}` }}
                  className="w-[14px] h-[30px] mr-[6px]"
                />
                <span className="text-[15px] font-light">deer</span>
              </div>
              <div className="flex items-center mb-[2px]">
                <div
                  style={{ backgroundColor: `${TABLEAU10[5]}` }}
                  className="w-[14px] h-[30px] mr-[6px]"
                />
                <span className="text-[15px] font-light">dog</span>
              </div>
              <div className="flex items-center mb-[2px]">
                <div
                  style={{ backgroundColor: `${TABLEAU10[6]}` }}
                  className="w-[14px] h-[30px] mr-[6px]"
                />
                <span className="text-[15px] font-light">frog</span>
              </div>
              <div className="flex items-center mb-[2px]">
                <div
                  style={{ backgroundColor: `${TABLEAU10[7]}` }}
                  className="w-[14px] h-[30px] mr-[6px]"
                />
                <span className="text-[15px] font-light">horse</span>
              </div>
              <div className="flex items-center mb-[2px]">
                <div
                  style={{ backgroundColor: `${TABLEAU10[8]}` }}
                  className="w-[14px] h-[30px] mr-[6px]"
                />
                <span className="text-[15px] font-light">ship</span>
              </div>
              <div className="flex items-center mb-[2px]">
                <div
                  style={{ backgroundColor: `${TABLEAU10[9]}` }}
                  className="w-[14px] h-[30px] mr-[6px]"
                />
                <span className="text-[15px] font-light">truck</span>
              </div>
            </div>
          </div>
        </div>
        <Separator
          orientation="vertical"
          className="h-[664px] w-[1px] mx-[2px]"
        />
        <div className="flex flex-col justify-center items-center relative">
          <div className="flex relative top-7 items-center">
            <NeuralNetworkIcon className="mr-[2px]" />
            <h5 className="ml-[2px]">Baseline Model</h5>
          </div>
          <ToggleGroup />
          <SvgViewer mode="baseline" />
        </div>
        <Separator
          orientation="vertical"
          className="h-[664px] w-[1px] mx-[2px]"
        />
        <div className="flex flex-col justify-center items-center relative">
          <div className="flex relative top-7 items-center">
            <GitCompareIcon className="mr-[2px]" />
            <h5 className="ml-[2px]">Comparison Model</h5>
          </div>
          <ToggleGroup />
          <SvgViewer mode="comparison" />
        </div>
      </div>
    </section>
  );
}
