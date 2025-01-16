import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/common/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/card";
import { AlertTriangle } from "lucide-react";

const MAX_WARNINGS = 3;

export const useTabLockService = () => {
  const [warnings, setWarnings] = useState(0);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [showWarningOverlay, setShowWarningOverlay] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let hidden, visibilityChange;

    if (typeof document.hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      viibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    const handleVisibilityChange = () => {
      if (document[hidden]) {
        if (warnings >= MAX_WARNINGS - 1) {
          setIsSessionEnded(true);
          setTimeout(() => {
            navigate("/verification", {
              state: { verificationStatus: "session-ended" },
            });
          }, 3000);
        } else {
          setWarnings((prev) => prev + 1);
          setShowWarningOverlay(true);
          setTimeout(() => {
            setShowWarningOverlay(false);
          }, 3000);
        }
      }
    };

    document.addEventListener(visibilityChange, handleVisibilityChange);

    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange);
    };
  }, [warnings, navigate]);

  return {
    warnings,
    remainingWarnings: MAX_WARNINGS - warnings,
    isSessionEnded,
    showWarningOverlay,
  };
};

export const TabSwitchWarning = ({ warnings, remainingWarnings }) => {
  if (warnings === 0) return null;

  return (
    <Alert variant="destructive" className="mb-4 border-red-500 animate-pulse">
      <AlertTriangle className="h-5 w-5 text-red-500" />
      <AlertTitle className="text-red-500">Tab Switch Warning</AlertTitle>
      <AlertDescription className="text-red-700">
        You have switched tabs {warnings} time{warnings > 1 ? "s" : ""}.
        {remainingWarnings > 0
          ? ` ${remainingWarnings} more attempt${
              remainingWarnings > 1 ? "s" : ""
            } will result in automatic session termination.`
          : " Your session will be terminated."}
      </AlertDescription>
    </Alert>
  );
};

export const WarningOverlay = ({ warnings, remainingWarnings, show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-red-500/20 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border-2 border-red-500 animate-bounce">
        <div className="flex items-center justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 text-center mb-2">
          Warning: Tab Switch Detected
        </h2>
        <p className="text-red-700 text-center">
          You have switched tabs {warnings} time{warnings > 1 ? "s" : ""}.
          {remainingWarnings > 0
            ? ` ${remainingWarnings} more attempt${
                remainingWarnings > 1 ? "s" : ""
              } will result in automatic session termination.`
            : " Your session will be terminated."}
        </p>
      </div>
    </div>
  );
};

export const SessionEndedCard = () => {
  return (
    <div className="fixed inset-0 bg-red-500/10 backdrop-blur flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 border-2 border-red-500 animate-in slide-in-from-top">
        <CardHeader>
          <CardTitle className="text-red-600 text-center text-2xl">
            Session Terminated
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <p className="text-center mb-4 text-lg text-red-700">
            Your session has been terminated due to multiple tab switching
            attempts. Please contact your administrator for further assistance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
