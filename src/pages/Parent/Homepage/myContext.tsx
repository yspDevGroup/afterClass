import { createContext, } from "react";

export default createContext<{
  bmkssj?: string,
  bmjssj?: string,
  skkssj?: string,
  skjssj?: string;
  weekSchedule?: any;
  kskc?: any[];
  yxkc?: any[];
  courseStatus?: string
}>({});