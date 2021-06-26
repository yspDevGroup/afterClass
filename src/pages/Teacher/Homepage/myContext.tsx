import { createContext, } from "react";

export default createContext<{
  bmkssj?: string,
  bmjssj?: string,
  skkssj?: string,
  skjssj?: string;
  weekSchedule?: any;
  kskc?: any[];
  yxkc?: any[];
  rjkc?: any[];
  courseStatus?: string;
  currentUser?: API.CurrentUser
}>({});