import * as uuid from "uuid";

export const deviceId = (): string => {
  if (typeof window === "undefined") return "server";

  const deviceId = localStorage.getItem("deviceId");

  if (deviceId) return deviceId;

  const newId: string = uuid.v4();

  localStorage.setItem("deviceId", newId);

  return newId;
};
