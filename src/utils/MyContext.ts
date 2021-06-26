import { createContext, } from "react";

export default createContext<{
  bmkssj?: string,
  skkssj?: string,
  skjssj?: string;
  bmjssj?: string,
  yxkc?: any[];
  kskc?: any[];
  weekSchedule?: any;
  rjkc?: any[];
  courseStatus?: string;
  currentUserInfo?: API.CurrentUser
}>({});