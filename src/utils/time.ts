import { addZeroBefore } from "./number";


export const convertDurationToHourAndMinutes = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);

  return `${addZeroBefore(hours)}:${addZeroBefore(minutes)}`;
};


export const convertDurationToHourMinutesSeconds = (duration: number, isText?: boolean) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);
  const seconds = Math.floor(duration - hours * 3600 - minutes * 60);

  return `${addZeroBefore(hours)}${isText ? 'h ' : ':'}${addZeroBefore(minutes)}${isText ? 'm ' : ':'}${addZeroBefore(seconds)}${isText ? 's' : ''}`;
};