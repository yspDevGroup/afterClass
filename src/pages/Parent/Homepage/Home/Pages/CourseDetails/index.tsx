/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
import { Button, message, Radio, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'umi';
import styles from './index.less';
import { TimetableList } from './mock';
import type { KcDetailType } from './data'
import { getDetailsKHKCSJ } from '@/services/after-class/khkcsj';

const CourseDetails: React.FC = () => {
  const [BJ, setBJ] = useState();
  const [FY, setFY] = useState();
  const [XY, setXY] = useState(false);
  const [state, setstate] = useState(false);
  const [KcData, setKcData] = useState<any>();
  const [currentDate, setCurrentDate] = useState<string>();
  const [KcDetail, setKcDetail] = useState<KcDetailType>();
  const valueKey = window.location.href.split('type=')[1];
  const ids = window.location.href.split('id=')[1].split('&')[0];
  
  useEffect(() => {
    (async () => {
      const result = await getDetailsKHKCSJ(ids);
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

  }, [ids]);
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
            // console.log(value)
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
        <p className={styles.title}>{KcData?.title}</p>
        <ul>
          <li>上课时段：2021.09.12—2021.11.20</li>
          <li>上课地点：{KcData?.desc[0].left[2]}</li>
          <li>总课时：{KcData?.desc[1].left[0]}</li>
          <li>班级：A班</li>
          <li>学生：刘大大</li>
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
