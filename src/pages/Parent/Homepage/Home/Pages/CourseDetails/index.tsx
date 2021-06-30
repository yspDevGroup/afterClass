/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
import { Button, message, Radio, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import styles from './index.less';
import { getKHKCSJ } from '@/services/after-class/khkcsj';
import { getQueryString } from '@/utils/utils';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import { DateRange, Week } from '@/utils/Timefunction';
import moment from 'moment';
import IconFont from '@/components/CustomIcon';
import { getKHPKSJByBJID } from '@/services/after-class/khpksj';





const CourseDetails: React.FC = () => {
  const [BJ, setBJ] = useState<string>();
  const [FY, setFY] = useState<number>();
  const [XY, setXY] = useState(false);
  const [state, setstate] = useState(false);
  const [Student, setStudent] = useState<any>();
  const [currentDate, setCurrentDate] = useState<string>();
  const [KcDetail, setKcDetail] = useState<any>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [timetableList, setTimetableList] = useState<any[]>();
  const hrefs = window.location.href;
  let courseid: any;
  let classid: any;
  let valueKey = '';

  const bjid = getQueryString('classid');
  async function ksssj() {
    const res = await getKHPKSJByBJID({ id: bjid! });
    if (res.status === 'ok' && res.data) {
      const attend = [...new Set(res.data.map(n => n.WEEKDAY))]
      async function Learning() {
        const res1 = await getAllKHXSCQ(
          {
            xsId: currentUser!.id,
            bjId: bjid!,
            CQZT: '',
            CQRQ: '',
          }
        );
        if (res1.status === 'ok' && res1.data) {
          const classbegins: any[] = [];
          res1.data.forEach((item: any) => {
            const datex = DateRange(item.KHBJSJ.KKRQ, item.KHBJSJ.JKRQ)
            datex.forEach((record: any) => {
              for (let i = 0; i < attend.length; i += 1) {
                if (Week(record) === attend[i] && !classbegins.includes(record)) {
                  classbegins.push(record);
                }
              }
            })
          })
          const Attendancedate: any[] = [];
          for (let i = 0; i < classbegins.length; i += 1) {
            Attendancedate.push(moment(classbegins[i]).format('MM/DD'))
          }
          const absence: any[] = [];
          const myDate = new Date();
          const nowtime = moment(myDate.toLocaleDateString()).format('MM/DD')
          Attendancedate.forEach((record: any, index: number) => {
            if (res1.data) {
              for (let i = 0; i < res1.data.length; i += 1) {
                const chuqindate = moment(res1.data[i].CQRQ).format('MM/DD');
                if (res1.data[i].CQZT === '出勤' && chuqindate === record) {
                  absence.push({
                    id: `kc${index}`,
                    JC: `第${index + 1}节`,
                    data: record,
                    type: '出勤'
                  })
                } else if ((res1.data[i].CQZT === '请假' || res1.data[i].CQZT === '缺席') && chuqindate === record) {
                  absence.push({
                    id: `kc${index}`,
                    JC: `第${index + 1}节`,
                    data: record,
                    type: `缺勤`
                  })
                } else if (nowtime === record) {
                  absence.push({
                    id: `kc${index}`,
                    JC: `第${index + 1}节`,
                    data: record,
                    type: `今日`
                  })
                }
                else {
                  absence.push({
                    id: `kc${index}`,
                    JC: `第${index + 1}节`,
                    data: record,
                    type: ``
                  })
                }
              }
            }
          })
          // 获取课程表数据
          const Section = [];
          const intercept = {};
          for (let i = 0; i < absence.length; i += 1) {
            if (!intercept[absence[i].id]) {
              Section.push(absence[i]);
              intercept[absence[i].id] = true;
            }
            if (Section[(Section.length - 1)].id === absence[i].id && Section[Section.length - 1].type === '') {
              Section[(Section.length - 1)] = absence[i]
            }
          }
          setTimetableList(Section);
        }
      }
      await Learning()
    }
  }


  useEffect(() => {
    ksssj();
  }, [])

  if (hrefs.indexOf('classid') === -1) {
    courseid = hrefs.split('courseid=')[1].split('&')[0];
    valueKey = 'true';
  } else {
    courseid = getQueryString('courseid');
    classid = getQueryString('classid');
    valueKey = 'false';
  }

  useEffect(() => {
    (async () => {
      const result = await getKHKCSJ({ kcId: courseid });
      setStudent(currentUser?.username);
      if (result.status === 'ok') {
        setKcDetail(result.data);
        setFY(result.data!.KHBJSJs![0].FY);
        setBJ(result.data!.KHBJSJs![0].id);
      } else {
        message.error(result.message);
      }
    })();
    const myDate = new Date().toLocaleDateString().slice(5, 9);
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
    if (BJ === undefined) {
      message.error("请选择班级")
    } else if (XY === false) {
      message.info('请阅读并同意《课后服务协议》')
    }
    // const data ={
    //   BJ,
    //   XY
    // }
  }
  const valueNames = `${BJ}+${FY}`;
  const tempfun = (arr: any) => {
    const fjname: string[] = [];
    arr.forEach((item: any) => {
      if (!fjname.includes(item.FJSJ.FJMC)) {
        fjname.push(item.FJSJ.FJMC)
      }
    });
    return fjname.map((values: any) => {
      return <span>{values}</span>
    })
  }
  return <>
    {
      valueKey === 'true' ?
        <div className={styles.CourseDetails}>
          <div className={styles.wrap}>
            {
              KcDetail?.KCTP && KcDetail?.KCTP.indexOf('http') > -1 ?
                <img src={KcDetail?.KCTP} alt="" /> :
                <IconFont type="icon-zanwutupian1" style={{ fontSize: 'calc(100vw - 20px)', height: '200px' }} />
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
                KcDetail?.KHBJSJs?.map((value: { BJMC: string, ZJS: string, FJS: string, KCSC: string, KHPKSJs: any }) => {
                  return <li>{value.BJMC}：总课时：{value.KCSC},
                    上课时间：{
                      value.KHPKSJs.map((values: { FJSJ: any, XXSJPZ: any, WEEKDAY: number }) => {
                        const weeks = `周${'日一二三四五六'.charAt(values.WEEKDAY)}`;
                        let kssj = '';
                        if (values.XXSJPZ.KSSJ) {
                          values.XXSJPZ.KSSJ.split(':')
                          kssj = `${values.XXSJPZ.KSSJ.split(':')[0]}:${values.XXSJPZ.KSSJ.split(':')[1]}`
                        }
                        let jssj = '';
                        if (values.XXSJPZ.JSSJ) {
                          values.XXSJPZ.JSSJ.split(':')
                          jssj = `${values.XXSJPZ.JSSJ.split(':')[0]}:${values.XXSJPZ.JSSJ.split(':')[1]}`
                        }
                        return <span>{weeks}{kssj}-{jssj},</span>
                      })
                    }
                    上课地点：{
                      value.KHPKSJs.map((values: { FJSJ: any }) => {
                        return <span>{values.FJSJ.FJMC},</span>
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
                      KcDetail?.KHBJSJs?.map((value: { BJMC: string, id: string, FJS: string, FY: string }) => {
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
                      <Button className={styles.submit} onClick={submit} >确定并付款</Button> :
                      <Link to={`/parent/mine/orderDetails?id=${courseid}&type=false`}><Button className={styles.submit} onClick={submit} >确定并付款</Button></Link>
                  }
                </div>
              </div> : ''
          }

        </div> :
        <div className={styles.CourseDetails2}>
          <div className={styles.KCXX}>
            {/* 上课时段 */}
            <p className={styles.title}>{KcDetail?.KCMC}</p>
            <ul>
              {
                KcDetail?.KHBJSJs?.map((value: { id: string, KSS: string, KHPKSJs: any, KKRQ: string, JKRQ: string, BJMC: string }) => {
                  if (value.id === classid) {
                    return <> <li>上课时段：{value.KKRQ}~{value.JKRQ}</li>
                      <li> 上课地点：{
                        tempfun(value.KHPKSJs)
                        // value.KHPKSJs.map((values: { FJSJ: any }) => {

                        //   console.log(values.FJSJ.FJMC)
                        //   return <span>{values.FJSJ.FJMC},</span>
                        // })
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
                !(timetableList?.length === 0) ? timetableList?.map((value) => {
                  return <div className={value.data === currentDate ? styles.card2 : (value.type === '缺勤' ? styles.card1 : (value.type === '出勤' ? styles.card3 : (value.type === '今日' ? styles.card4 : styles.card)))} >
                    <p>{value.JC}</p>
                    <p>{value.data}</p>
                  </div>
                }) : <div>班级暂无排课</div>
              }
            </div>


          </div>
        </div>
    }
  </>

};

export default CourseDetails

  ;
