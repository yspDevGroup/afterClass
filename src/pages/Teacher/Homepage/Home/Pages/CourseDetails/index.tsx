// import { getQueryString } from '@/utils/utils';
// import React, { useEffect, useState } from 'react';
// import styles from './index.less';
// import { Article } from './mock';


// const CourseDetails: React.FC = () => {
//   const valueKey = getQueryString("courseId");
//   const [title, setTitle] = useState<any>('');
//   useEffect(() => {
//     if(valueKey){
//       setTitle(Article[valueKey])
//     }
//   }, [valueKey])
//   return (
//     <>
//       <div className={styles.CourseDetails2}>
//         <div className={styles.KCXX}>
//           <p className={styles.title}>{title.title}</p>
//           <ul>
//             <li>上课时段：{title.timeRange}</li>
//             <li>上课地点：{title.address}</li>
//             <li>总课时：{title.hours}</li>
//             <li>班级：{title.class}</li>
//             <li>学生：{title.student}</li>
//           </ul>
//         </div>
//         <div className={styles.Timetable}>
//           <p className={styles.title}>课程表</p>
//           <div className={styles.cards}>
//             {
//               title.schedule?.map((value: { type: string; JC: React.ReactNode; data: React.ReactNode; }) => {
//                 return <div className={value.type === '已上' ? styles.card1 : styles.card} >
//                   <p>{value.JC}</p>
//                   <p>{value.data}</p>
//                 </div>
//               })
//             }
//           </div>
//         </div>
//       </div>
//     </>)
// };

// export default CourseDetails;
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
import { Button, message, Radio, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'umi';
import styles from './index.less';
// import { TimetableList } from './mock';
// import type { KcDetailType } from './data'
import { getDetailsKHKCSJ } from '@/services/after-class/khkcsj';
import {currentUser} from '@/services/after-class/user'
import type{ KcDetailType } from '@/pages/Parent/Homepage/Home/Pages/CourseDetails/data';
import { TimetableList } from '@/pages/Parent/Homepage/Home/Pages/CourseDetails/mock';

const CourseDetails: React.FC = () => {
  const [BJ, setBJ] = useState();
  const [FY, setFY] = useState();
  const [XY, setXY] = useState(false);
  const [state, setstate] = useState(false);
  const [Student, setStudent] = useState<any>();
  const [currentDate, setCurrentDate] = useState<string>();
  const [KcDetail, setKcDetail] = useState<KcDetailType>();
  const hrefs = window.location.href;
  let courseid = '';
  let classid = '';
  let valueKey = '';
  if(hrefs.indexOf('classid') === -1){
    courseid = hrefs.split('courseid=')[1].split('&')[0];
    valueKey = 'true';
  }else{
    courseid = hrefs.split('courseid=')[1].split('&')[0];
    classid = hrefs.split('classid=')[1].split('&')[0];
    valueKey = 'false';
  }

  useEffect(() => {
    (async () => {
      const result = await getDetailsKHKCSJ(courseid);
      const resultUser = await currentUser();

      if (resultUser.status === 'ok') {
        setStudent(resultUser.data?.info.username)
      } else {
        message.error(result.message);
      }
      if (result.status === 'ok') {
        setKcDetail(result.data)
        setFY(result.data.KHBJSJs[0].FY)
        setBJ(result.data.KHBJSJs[0].id)
      } else {
        message.error(result.message);
      }
    })();
    const myDate = new Date().toLocaleDateString().slice(5,9);
    setCurrentDate(myDate);

  }, [courseid]);
  const onclick = () => {
    setstate(true);
  }
  const onclose = () => {
    setstate(false);
  }
  const onBJChange = (e: any) => {
    setBJ(e.target.value.split('+')[0]);
    setFY(e.target.value.split('+')[1]);
  }
  const onXYChange = () => {
    setXY(true)
  }
  const onchanges = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
  }
  const submit = async () => {
    if(BJ === undefined){
      message.error("请选择班级")
    }else if (XY === false) {
      message.info('请阅读并同意《课后服务协议》')
    }
    // const data ={
    //   BJ,
    //   XY
    // }
  }
  const valueNames = `${BJ}+${FY}`;
  return <>
  {
    valueKey === 'true' ?
    <div className={styles.CourseDetails}>
    <div className={styles.wrap}>
      {
        KcDetail?.KCTP === 'string' || KcDetail?.KCTP === '' ?
        <img src='https://i.postimg.cc/XXxH96fZ/noData.png' alt="" />:
        <img src={KcDetail?.KCTP} alt="" />
      }
      <p className={styles.title}>{KcDetail?.KCMC}</p>
      
      <ul>
        <li>上课时段：{KcDetail?.KKRQ}~{KcDetail?.JKRQ}</li>
        <li>上课地点：本校</li>
      </ul>
      <p className={styles.title}>课程简介</p>
      <p className={styles.content}>{KcDetail?.KCMS}</p>
      <p className={styles.content} style={{ marginTop: '20px' }}>开设班级：</p>
      <ul className={styles.classInformation}>
        {
          KcDetail?.KHBJSJs?.map((value: {BJMC: string,ZJS: string,FJS: string,KCSC: string,KHPKSJs: any})=>{
            return<li>{value.BJMC}：总课时：{value.KCSC},
             上课时间：{
                value.KHPKSJs.map((values: {FJSJ: any,XXSJPZ: any,WEEKDAY: number})=>{
                  const weeks = `周${'日一二三四五六'.charAt(values.WEEKDAY)}`;
                  let kssj = '';
                  if(values.XXSJPZ.KSSJ){
                    values.XXSJPZ.KSSJ.split(':')
                    kssj = `${values.XXSJPZ.KSSJ.split(':')[0]}:${values.XXSJPZ.KSSJ.split(':')[1]}`
                  }
                  let jssj = '';
                  if(values.XXSJPZ.JSSJ){
                    values.XXSJPZ.JSSJ.split(':')
                    jssj = `${values.XXSJPZ.JSSJ.split(':')[0]}:${values.XXSJPZ.JSSJ.split(':')[1]}`
                  }
                  return<span>{weeks}{kssj}-{jssj},</span>
                })
            }
            上课地点：{
              value.KHPKSJs.map((values: {FJSJ: any})=>{
                return<span>{values.FJSJ.FJMC},</span>
              })
            }
            班主任：{value.ZJS},副班：{value.FJS}。</li>
          })
        }
      </ul>
    </div>
    <div className={styles.footer}>
      <button className={styles.btn} onClick={onclick}>立即报名</button>
    </div>
    {
      state === true ?
        <div className={styles.payment} onClick={onclose}>
          <div onClick={onchanges}>
            <p className={styles.title}>{KcDetail?.KCMC}</p>
            <p className={styles.price}><span>￥{FY}</span><span>/学期</span></p>
            <p className={styles.title} style={{ fontSize: '14px' }}>班级</p>
            <Radio.Group onChange={onBJChange} defaultValue={valueNames}>
              {
                KcDetail?.KHBJSJs?.map((value: {BJMC: string,id: string,FJS: string,FY: string}) => {
                  const text = `${value.BJMC}已有12人报名，共50个名额`;
                  const valueName = `${value.id}+${value.FY}`;
                  return <div className={styles.BjInformation}>
                    <Tooltip placement="bottomLeft" title={text}>
                      <Radio.Button value={valueName}>{value.BJMC}</Radio.Button>
                    </Tooltip>
                  </div>
                })
              }
            </Radio.Group>
            <Radio 
              className={styles.agreement}
              onChange={onXYChange}
            >  <p>我已阅读并同意<a href=''>《课后帮服务协议》</a></p></Radio>
            {
              XY === false || BJ === undefined ?
              <Button className={styles.submit} onClick={submit} >确定并付款</Button>:
              <Link to={`/parent/mine/orderDetails?id=${ids}&type=false`}><Button className={styles.submit} onClick={submit} >确定并付款</Button></Link>
            }
          </div>
        </div> : ''
    }

  </div>:
  <div className={styles.CourseDetails2}>
     <div className={styles.KCXX}>
        <p className={styles.title}>{KcDetail?.KCMC}</p>
        <ul>
        {
          KcDetail?.KHBJSJs?.map((value: {id: string,KSS: string,KHPKSJs: any,KKRQ: string,JKRQ: string,BJMC: string})=>{
            // console.log(value)
            if(value.id === classid){
              return<> <li>上课时段：{value.KKRQ}~{value.JKRQ}</li>
              <li> 上课地点：{
             value.KHPKSJs.map((values: {FJSJ: any})=>{
               return<span>{values.FJSJ.FJMC},</span>
                })
              }</li>
              <li>总课时：{value.KSS}</li>
              <li>班级：{value.BJMC}</li>
              <li>学生：{Student}</li>
           </>
            }
              return ''
          })
        } 
        </ul>
    </div>
    <div className={styles.Timetable}>
      <p className={styles.title}>课程表</p>
      <div className={styles.cards}>
        {
          TimetableList.map((value)=>{
            return<div className={value.data === currentDate ? styles.card2:(value.type === '已上' ? styles.card1:(value.type === '未上' ? styles.card3:styles.card ))} >
              <p>{value.JC}</p>
              <p>{value.data}</p>
            </div>
          })
        }
      </div>
    </div>
  </div>
  }
  </>
  
};

export default CourseDetails

  ;

