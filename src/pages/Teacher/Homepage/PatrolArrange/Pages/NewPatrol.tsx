/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-26 10:30:36
 * @LastEditTime: 2021-09-30 19:56:18
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { InputNumber, message, Switch } from 'antd';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import { createKHXKJL, KHXKJL } from '@/services/after-class/khxkjl';
import GoBack from '@/components/GoBack';

import styles from '../index.less';
import moment from 'moment';

const NewPatrol = (props: any) => {
  const { kcid, kcmc, xkrq, bjxx, check } = props?.location?.state;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 是否准时上课
  const [onTime, setOnTime] = useState<boolean>(true);
  // 是否原定教师
  const [oriTeacher, setOriTeacher] = useState<boolean>(true);
  // 是否点名
  const [checkIn, setCheckIn] = useState<boolean>(false);
  // 实到人数准确与否
  const [accurate, setAccurate] = useState<boolean>(true);
  // 学生出勤人数
  const [checkNum, setCheckNum] = useState<number>(0);
  // 巡课确认人数
  const [realNum, setRealNum] = useState<number>(0);
  // 其他说明
  const [bzDetail, setBzDetail] = useState<any>();
  const teacherInfo = bjxx?.KHBJJs?.[0]?.JZGJBSJ;
  const roominfo = bjxx?.KHPKSJs?.[0]?.FJSJ;
  const recordDetail: API.CreateKHXKJL = {
    /** 巡课日期 */
    RQ: moment(xkrq).format('YYYY-MM-DD'),
    /** 是否准时上课 */
    SFZSSK: onTime,
    /** 是否为原定教师 */
    SFYDJS: oriTeacher,
    /** 是否点名 */
    SFDM: checkIn,
    /** 实到人数是否准确 */
    RSSFZQ: accurate,
    /** 备注信息 */
    BZXX: '',
    YDRS: bjxx?.xs_count,
    SDRS: checkNum,
    /** 巡课教师ID */
    XKJSId: currentUser.JSId || testTeacherId,
    /** 授课教师ID */
    SKJSId: teacherInfo?.id,
    /** 教室ID */
    FJSJId: roominfo?.id,
    /** 班级ID */
    KHBJSJId: bjxx.id,
  };
  const getCq = async () => {
    const resAll = await getAllKHXSCQ({
      bjId: bjxx?.id, // 班级ID
      CQRQ: xkrq, // 日期
      pkId: bjxx?.KHPKSJs?.[0]?.id || undefined, // 排课ID
    });
    if (resAll.status === 'ok') {
      const allData = resAll.data;
      // allData 有值时已点过名
      if (allData?.length) {
        setCheckIn(true);
        const comeClass = allData.filter((item: any) => item.CQZT === '出勤');
        setCheckNum(comeClass?.length);
      }
    }
  };
  const getDetail = async (id: string) => {
    const res = await KHXKJL({
      id: id
    });
    if (res.status === 'ok' && res.data) {
      const { data } = res;
      setOnTime(data.SFZSSK!);
      setOriTeacher(data.SFYDJS!);
      setAccurate(data.RSSFZQ!);
      setCheckNum(data.SDRS!);
      setBzDetail(data.BZXX);
      setRealNum(data.QRRS!);
    }
  };
  useEffect(() => {
    getCq();
    if (bjxx.KHXKJLs?.length) {
      getDetail(bjxx.KHXKJLs[0].id);
    }
  }, [bjxx]);
  const handleSubmit = async () => {
    const res = await createKHXKJL(recordDetail);
    if (res.status === 'ok') {
      message.success('巡课记录已提交');
      history.push('/teacher/patrolArrange/classes', { id: kcid, day: xkrq, xxId: currentUser?.xxId, kcmc: kcmc, });
    } else {
      message.error(res.message);
    }
  };
  return (
    <>
      <GoBack title={'巡课记录'} teacher />
      <div className={styles.patrolWrapper}>
        <div className={styles.patrolContent}>
          <div className={styles.patrolRecord}>
            <h4>{kcmc}</h4>
            <div className={styles.card}>
              <h4>教师出勤情况</h4>
              <ul>
                <li><label>课程班名称</label><span>{bjxx?.BJMC}</span></li>
                <li><label>任课教师</label><span>{bjxx?.KHBJJs?.[0]?.JZGJBSJ?.XM}</span></li>
                <li><label>上课教室</label><span>{bjxx?.KHPKSJs?.[0]?.FJSJ?.FJMC}</span></li>
                <li>
                  <label>是否准时上课</label>
                  <span>
                    <Switch disabled={check} checked={onTime} onChange={(checked) => {
                      setOnTime(checked);
                    }} />
                  </span>
                </li>
                <li>
                  <label>是否原定教师</label>
                  <span>
                    <Switch disabled={check} checked={oriTeacher} onChange={(checked) => {
                      setOriTeacher(checked);
                    }} />
                  </span>
                </li>
              </ul>
            </div>
            <div className={styles.card}>
              <h4>学生出勤情况</h4>
              <ul>
                <li><label>是否已点名</label><span>{checkIn ? '已点名':'未点名'}</span></li>
                <li>
                  <label>应到人数</label>
                  <span><InputNumber value={bjxx?.xs_count} disabled />人</span>
                </li>
                <li>
                  <label>实到人数</label>
                  <span>{(checkIn || check) ? <InputNumber value={checkNum} disabled /> : <InputNumber placeholder='请输入' min={0} max={bjxx?.xs_count} onBlur={(e) => {
                    recordDetail.SDRS = Number(e.target.value);
                  }} />}人</span>
                </li>
                {checkIn ? <li>
                  <label>实到人数准确</label>
                  <span><Switch disabled={check} checked={accurate} onChange={(checked) => setAccurate(checked)} /></span>
                </li> : ''}
                {!accurate ? <li>
                  <label>巡课确认人数</label>
                  <span>
                    {check ? <InputNumber value={realNum} disabled /> : <InputNumber disabled={check} placeholder='请输入' min={0} max={bjxx?.xs_count} onBlur={(e) => {
                      recordDetail.QRRS = Number(e.target.value);
                    }} />}人
                  </span>
                </li> : ''}
              </ul>
            </div>
            <div className={styles.card} style={{ marginBottom: 60 }}>
              <h4>其他说明</h4>
              {check ? <div style={{ padding: '10px 10px 24px', color: '#666' }}>
                {bzDetail}
              </div> : <textarea name="" id="" rows={5} onBlur={(e) => {
                recordDetail.BZXX = e.target.value;
              }}></textarea>}
            </div>
            <div className={styles.footer}>
              <button className={styles.btn} onClick={() => history.go(-1)} >
                {check ? '返回' : '取消'}
              </button>
              {check ? '' : <button className={styles.btnes} onClick={handleSubmit}>提交</button>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPatrol;
