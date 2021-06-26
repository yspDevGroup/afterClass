import { createContext, } from "react";

export default createContext<{
  skkssj?: string,
  skjssj?: string;
  weekSchedule?: any;
  rjkc?: any[];
  courseStatus?: string;
  currentUser?: API.CurrentUser
}>({});