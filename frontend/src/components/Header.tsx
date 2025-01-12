import { useContext, useState, useMemo } from "react";

import {
  LogoIcon,
  PlusIcon,
  MultiplicationSignIcon,
  GithubIcon,
} from "./UI/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./UI/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./UI/select";
import { useForgetClass } from "../hooks/useForgetClass";
import { loadExperimentData } from "../constants/allData";
import { FORGET_CLASS_NAMES } from "../constants/common";
import { ForgetClassContext } from "../store/forget-class-context";
import { Experiments } from "../types/experiments-context";
import { ExperimentsContext } from "../store/experiments-context";
import { Label } from "./UI/label";
import Button from "./Button";

export default function Header() {
  const {
    selectedForgetClasses,
    saveForgetClass,
    addSelectedForgetClass,
    deleteSelectedForgetClass,
  } = useContext(ForgetClassContext);
  const { saveExperiments, setIsExperimentsLoading } =
    useContext(ExperimentsContext);

  const { forgetClass, forgetClassNumber } = useForgetClass();

  const unselectForgetClasses = useMemo(
    () =>
      FORGET_CLASS_NAMES.filter(
        (item) =>
          !selectedForgetClasses.includes(FORGET_CLASS_NAMES.indexOf(item))
      ),
    [selectedForgetClasses]
  );
  const [targetFC, setTargetFC] = useState(() => unselectForgetClasses[0]);
  const [open, setOpen] = useState(() => selectedForgetClasses.length === 0);

  const fetchAndSaveExperiments = async (targetClass: string) => {
    const forgetClass = FORGET_CLASS_NAMES.indexOf(targetClass);
    setIsExperimentsLoading(true);
    try {
      const data: Experiments = await loadExperimentData(forgetClass);
      saveExperiments(data);
    } finally {
      setIsExperimentsLoading(false);
    }
  };

  const handleForgetClassChange = async (value: string) => {
    saveForgetClass(value);
    await fetchAndSaveExperiments(value);
  };

  const handleAddClick = async () => {
    addSelectedForgetClass(targetFC);
    saveForgetClass(targetFC);
    setOpen(false);
    await fetchAndSaveExperiments(targetFC);
  };

  const handleDeleteClick = async (targetClass: string) => {
    const firstSelectedForgetClass = selectedForgetClasses[0];
    const secondSelectedForgetClass = selectedForgetClasses[1];
    const targetSelectedForgetClassesIndex = selectedForgetClasses.indexOf(
      FORGET_CLASS_NAMES.indexOf(targetClass)
    );

    const willBeEmpty = selectedForgetClasses.length === 1;

    deleteSelectedForgetClass(targetClass);

    if (targetClass === FORGET_CLASS_NAMES[forgetClassNumber]) {
      if (willBeEmpty) {
        saveForgetClass(undefined);
        setOpen(true);
      } else {
        const autoSelectedForgetClass =
          targetSelectedForgetClassesIndex === 0
            ? FORGET_CLASS_NAMES[secondSelectedForgetClass]
            : FORGET_CLASS_NAMES[firstSelectedForgetClass];
        saveForgetClass(autoSelectedForgetClass);
        await fetchAndSaveExperiments(autoSelectedForgetClass);
      }
    }
  };

  const handleGithubIconClick = () => {
    window.open(
      "https://github.com/gnueaj/Machine-Unlearning-Comparator",
      "_blank"
    );
  };

  return (
    <div className="w-[1805px] text-white bg-black h-12 flex justify-between items-center px-4 relative">
      <div>
        <div className="flex items-center relative">
          <div className="flex items-center">
            <LogoIcon className="w-7 h-7" />
            <span className="text-2xl font-semibold ml-2 mr-10">
              UnlearningComparator
            </span>
          </div>
          <div className="flex items-center gap-1 relative -bottom-2.5">
            {selectedForgetClasses.map((selectedForgetClass, idx) => {
              const isSelectedForgetClass = selectedForgetClass === forgetClass;
              const forgetClassName = FORGET_CLASS_NAMES[selectedForgetClass];

              return (
                <div key={idx} className="flex items-center relative">
                  <div
                    className={
                      "flex justify-center items-center h-[30px] pl-2.5 pr-[26px] rounded-t cursor-pointer transition " +
                      (isSelectedForgetClass
                        ? "bg-white text-black"
                        : "text-white hover:bg-gray-800 relative bottom-[1px]")
                    }
                    onClick={() => handleForgetClassChange(forgetClassName)}
                  >
                    <span
                      className={`px-1 font-medium ${
                        isSelectedForgetClass ? "text-black" : "text-[#64758B]"
                      }`}
                    >
                      Forget: {forgetClassName}
                    </span>
                  </div>
                  <MultiplicationSignIcon
                    onClick={() => handleDeleteClick(forgetClassName)}
                    className={
                      "w-3.5 h-3.5 p-[1px] cursor-pointer rounded-full absolute right-2.5 bg-transparent transition " +
                      (isSelectedForgetClass
                        ? "text-gray-500 hover:bg-gray-300"
                        : "text-gray-500 hover:bg-gray-700")
                    }
                  />
                  {isSelectedForgetClass && (
                    <div className="w-[calc(100%-19px)] h-0.5 absolute bottom-[1px] left-[10px] bg-black" />
                  )}
                </div>
              );
            })}
            <Dialog
              open={open}
              onOpenChange={
                selectedForgetClasses.length === 0
                  ? undefined
                  : (value: boolean) => {
                      setOpen(value);
                      setTargetFC(unselectForgetClasses[0]);
                    }
              }
            >
              <DialogTrigger className="w-8 h-[30px] flex justify-center items-center mb-0.5 transition hover:bg-gray-800 rounded-t">
                <PlusIcon className="w-3.5 h-3.5" color="#64758B" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[320px] p-4">
                <DialogHeader>
                  <DialogTitle>Which class do you want to unlearn?</DialogTitle>
                  <DialogDescription>
                    <p>
                      Select a class that you want to unlearn. Click add when
                      you're done.
                    </p>
                    <div className="grid grid-cols-2 gap-y-4 text-black mt-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Dataset
                        </span>
                        <span className="text-sm font-semibold -mt-[3px]">
                          CIFAR-10
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Model
                        </span>
                        <span className="text-sm font-semibold -mt-[3px]">
                          ResNet18
                        </span>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-start">
                  <Label className="text-xs text-muted-foreground text-center text-nowrap mb-0.5">
                    Forget Class
                  </Label>
                  <Select defaultValue={targetFC} onValueChange={setTargetFC}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={targetFC} />
                    </SelectTrigger>
                    <SelectContent>
                      {unselectForgetClasses.map((forgetClass) => (
                        <SelectItem key={forgetClass} value={forgetClass}>
                          {forgetClass}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddClick} content="Add" />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <GithubIcon
        onClick={handleGithubIconClick}
        className="w-7 h-7 cursor-pointer"
      />
      <div className="flex absolute right-[362px] bottom-1 text-[13px]">
        <div className="flex flex-col mr-10">
          <span className="text-[10px] text-gray-300">Dataset</span>
          <span className="text-xs font-semibold -mt-[3px]">CIFAR-10</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-300">Model</span>
          <span className="text-xs font-semibold -mt-[3px]">ResNet18</span>
        </div>
      </div>
    </div>
  );
}
