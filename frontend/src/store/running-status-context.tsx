import { createContext, useReducer, useCallback, useEffect } from "react";

import { UnlearningStatus } from "../types/settings";
import {
  RunningStatus,
  RunningStatusContextType,
  Action,
} from "../types/running-status-context";

const RUNNING_STATUS = "running-status";
const initialStatus: UnlearningStatus = {
  is_unlearning: false,
  progress: "Idle",
  recent_id: null,
  current_epoch: 0,
  total_epochs: 0,
  current_unlearn_loss: 0,
  current_unlearn_accuracy: 0,
  p_training_loss: 0,
  p_training_accuracy: 0,
  p_test_loss: 0,
  p_test_accuracy: 0,
  method: "",
  estimated_time_remaining: 0,
};

export const RunningStatusContext = createContext<RunningStatusContextType>({
  isRunning: false,
  status: initialStatus,
  activeStep: 0,
  hasStatusHistory: true,

  updateIsRunning: () => {},
  initStatus: () => {},
  retrieveStatus: () => {},
  updateStatus: (status: UnlearningStatus) => {},
  updateActiveStep: (step: number) => {},
});

function runningStatusReducer(
  state: RunningStatus,
  action: Action
): RunningStatus {
  switch (action.type) {
    case "UPDATE_IS_RUNNING":
      const isRunning = action.payload;
      sessionStorage.setItem(
        RUNNING_STATUS,
        JSON.stringify({ ...state, isRunning })
      );
      return { ...state, isRunning };

    case "INIT_STATUS":
      sessionStorage.setItem(
        RUNNING_STATUS,
        JSON.stringify({
          ...state,
          status: initialStatus,
          hasStatusHistory: true,
        })
      );
      return { ...state, status: initialStatus, hasStatusHistory: true };

    case "RETRIEVE_STATUS":
      const savedStatus = sessionStorage.getItem(RUNNING_STATUS);
      if (savedStatus) {
        const parsedStatus: RunningStatus = JSON.parse(savedStatus);
        const updatedStatus = parsedStatus.status;
        sessionStorage.setItem(
          RUNNING_STATUS,
          JSON.stringify({ ...state, status: updatedStatus })
        );
        return { ...state, status: updatedStatus };
      }
      return state;

    case "UPDATE_STATUS":
      const status = action.payload;
      const progress =
        state.isRunning && status.progress === "Idle"
          ? "Unlearning"
          : !state.isRunning
          ? "Idle"
          : status.progress;
      sessionStorage.setItem(
        RUNNING_STATUS,
        JSON.stringify({
          ...state,
          status: { ...status, progress },
          hasStatusHistory: false,
        })
      );
      return { ...state, status, hasStatusHistory: false };

    case "UPDATE_ACTIVE_STEP":
      const step = action.payload;
      sessionStorage.setItem(
        RUNNING_STATUS,
        JSON.stringify({ ...state, activeStep: step })
      );
      return { ...state, activeStep: step };

    default:
      return state;
  }
}

export default function RunningStatusContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [runningStatus, dispatch] = useReducer(runningStatusReducer, {
    isRunning: false,
    status: initialStatus,
    activeStep: 0,
    hasStatusHistory: true,
  });

  const handleUpdateIsRunning = useCallback((isRunning: boolean) => {
    dispatch({ type: "UPDATE_IS_RUNNING", payload: isRunning });
  }, []);

  const handleInitStatus = useCallback(() => {
    dispatch({ type: "INIT_STATUS" });
  }, []);

  const handleRetrieveStatus = useCallback(() => {
    dispatch({ type: "RETRIEVE_STATUS" });
  }, []);

  const handleUpdateStatus = useCallback((status: UnlearningStatus) => {
    dispatch({ type: "UPDATE_STATUS", payload: status });
  }, []);

  const handleUpdateActiveStep = useCallback((step: number) => {
    dispatch({ type: "UPDATE_ACTIVE_STEP", payload: step });
  }, []);

  useEffect(() => {
    handleRetrieveStatus();
  }, [handleRetrieveStatus]);

  const ctxValue: RunningStatusContextType = {
    isRunning: runningStatus.isRunning,
    status: runningStatus.status,
    activeStep: runningStatus.activeStep,
    hasStatusHistory: runningStatus.hasStatusHistory,

    updateIsRunning: handleUpdateIsRunning,
    initStatus: handleInitStatus,
    retrieveStatus: handleRetrieveStatus,
    updateStatus: handleUpdateStatus,
    updateActiveStep: handleUpdateActiveStep,
  };

  return (
    <RunningStatusContext.Provider value={ctxValue}>
      {children}
    </RunningStatusContext.Provider>
  );
}
