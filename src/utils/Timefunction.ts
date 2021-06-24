import moment from "moment";

// const s='2021/6/23'
// alert("今天星期"+"天一二三四五六".charAt(new Date(s).getDay()))


//遍历日期的方法
export const DateRange = (startDate: string, endDate: string) => {
    //存放groupDate;
    const groupDate: any[] = [];
    //截取的开始时间
    var startTime = new Date(startDate);
    //截取的结束时间
    var endTime = new Date(endDate);
    //利用setTime获取两个日期之间差值,差值毫秒换算成天1000*60*60*24
    var distanceDayLength = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24);
    var startDay = startTime.getDate();
    for (let i = 0; i <= distanceDayLength; i++) {
        groupDate.push(moment(startTime.setDate(startDay + i)).format("yyyy-MM-DD"));
    }
    return groupDate
}

// 获取某一天是周几
export const Week = (time: any) => {
    return "0123456".charAt(new Date(time).getDay())
}
