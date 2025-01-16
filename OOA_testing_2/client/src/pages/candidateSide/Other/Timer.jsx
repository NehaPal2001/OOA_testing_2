import React, { useState, useEffect } from "react";
import { Card } from "@/components/common/ui/card";
import { Clock } from "lucide-react";

const Timer = ({ durationInMinutes }) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);
  const [isWarning, setIsWarning] = useState(false);
  const [isDanger, setIsDanger] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsWarning(timeLeft <= 600 && timeLeft > 300);
    setIsDanger(timeLeft <= 300);
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const getTimerStyles = () => {
    if (isDanger) {
      return "bg-red-50 border-red-200 text-red-700";
    }
    if (isWarning) {
      return "bg-yellow-50 border-yellow-200 text-yellow-700";
    }
    return "bg-white/90 border-gray-100 text-indigo-700";
  };

  const getAnimationStyles = () => {
    if (isDanger) {
      return "animate-pulse";
    }
    return "";
  };

  return (
    <Card
      className={`shadow-lg backdrop-blur border ${getTimerStyles()} ${getAnimationStyles()}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Clock
            className={`w-5 h-5 ${
              isDanger
                ? "text-red-600"
                : isWarning
                ? "text-yellow-600"
                : "text-indigo-600"
            }`}
          />
          <span className="font-medium text-gray-600">Time Remaining</span>
        </div>

        <div className="flex justify-center gap-2">
          <TimerUnit
            value={hours}
            label="HRS"
            isDanger={isDanger}
            isWarning={isWarning}
          />
          <span className="text-2xl font-bold self-center">:</span>
          <TimerUnit
            value={minutes}
            label="MIN"
            isDanger={isDanger}
            isWarning={isWarning}
          />
          <span className="text-2xl font-bold self-center">:</span>
          <TimerUnit
            value={seconds}
            label="SEC"
            isDanger={isDanger}
            isWarning={isWarning}
          />
        </div>

        {(isWarning || isDanger) && (
          <div className="mt-3 text-center text-sm">
            {isDanger ? (
              <span className="text-red-600 font-medium">
                Time is almost up!
              </span>
            ) : (
              <span className="text-yellow-600 font-medium">
                10 minutes remaining
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

const TimerUnit = ({ value, label, isDanger, isWarning }) => {
  const getColor = () => {
    if (isDanger) return "text-red-700";
    if (isWarning) return "text-yellow-700";
    return "text-indigo-700";
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`text-3xl font-bold ${getColor()}`}>
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-xs font-medium text-gray-500">{label}</div>
    </div>
  );
};

export default Timer;
