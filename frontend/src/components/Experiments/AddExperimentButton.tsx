import React, { useContext, useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../UI/dialog";
import Unlearning from "./Unlearning";
import Defense from "./Defense";
import Button from "../Button";
import { PlusIcon } from "../UI/icons";
import { RunningStatusContext } from "../../store/running-status-context";

type ModeType = "unlearning" | "defense";

const UNLEARNING = "unlearning";
const DEFENSE = "defense";

export default function AddExperimentButton() {
  const { isRunning } = useContext(RunningStatusContext);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModeType>(UNLEARNING);

  useEffect(() => {
    if (isRunning) setOpen(false);
  }, [isRunning]);

  const isUnlearning = mode === UNLEARNING;

  const handleAddExpClick = () => {
    setOpen(true);
  };

  const handleExperimentModeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    setMode(e.currentTarget.id as ModeType);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value: boolean) => {
        setOpen(value);
      }}
    >
      <DialogTrigger disabled={true}>
        <Button
          onClick={handleAddExpClick}
          content={
            <>
              <PlusIcon color="#d1d5db" className="w-2.5 h-2.5 mr-1.5" />
              <span className="text-gray-300">Add Experiment</span>
            </>
          }
          className="px-2.5 mr-0.5 bg-gray-100 hover:bg-gray-100 cursor-not-allowed"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-4">
        <DialogHeader className="hidden">
          <DialogTitle>Run</DialogTitle>
          <DialogDescription>Running Configuration</DialogDescription>
        </DialogHeader>
        <div className="w-full flex items-center mt-2">
          <div
            id={UNLEARNING}
            onClick={handleExperimentModeChange}
            className={`w-full h-8 relative flex items-center cursor-pointer ${
              !isUnlearning && "text-gray-400"
            }`}
          >
            <button className="font-semibold w-full">Unlearning</button>
            <div
              className={`absolute w-full h-0.5 bg-black bottom-0 ${
                !isUnlearning && "bg-gray-400 h-[1px]"
              }`}
            />
          </div>
          <div
            id={DEFENSE}
            onClick={handleExperimentModeChange}
            className={`w-full h-8 relative flex items-center cursor-pointer ${
              isUnlearning && "text-gray-400"
            }`}
          >
            <button className="font-semibold w-full">Defense</button>
            <div
              className={`absolute w-full h-0.5 bg-black bottom-0 ${
                isUnlearning && "bg-gray-400 h-[1px]"
              }`}
            />
          </div>
        </div>
        {isUnlearning ? <Unlearning /> : <Defense />}
      </DialogContent>
    </Dialog>
  );
}
