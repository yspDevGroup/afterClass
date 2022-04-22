/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-26 10:30:36
 * @LastEditTime: 2022-04-22 14:40:42
 * @LastEditors: Wu Zhan
 */
import { useEffect, useState } from 'react';
import { Input, InputNumber, message, Switch } from 'antd';
import { useModel, history } from 'umi';
import GoBack from '@/components/GoBack';
import ShowName from '@/components/ShowName';
import styles from '../index.less';
import moment from 'moment';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import { getSerEnrolled } from '@/services/after-class/khbjsj';
import { createKHXKJL, KHXKJL, updateKHXKJL } from '@/services/after-class/khxkjl';
import MobileCon from '@/components/MobileCon';

const { TextArea } = Input;
const NewPatrol = (props: any) => {
  const { kcid, kcmc, xkrq, bjxx, skxx, check, jcId } = props?.location?.state;
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
  // 班级报名人数
  const [signNum, setSignNum] = useState<number>(0);
  // 其他说明
  const [bzDetail, setBzDetail] = useState<any>();
  // 巡课记录ID
  const [hisId, setHisId] = useState<string>();

  const teacherInfo = skxx?.KCBSKJSSJs?.find((item: any) => item?.JSLX === 1);
  const roominfo = skxx?.FJSJ;
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
    RSSFZQ: checkIn ? accurate : false,
    /** 备注信息 */
    BZXX: '',
    YDRS: signNum || bjxx?.xs_count,
    SDRS: checkNum,
    /** 巡课教师ID */
    XKJSId: currentUser.JSId || testTeacherId,
    /** 授课教师ID */
    SKJSId: teacherInfo?.JZGJBSJId,
    /** 教室ID */
    FJSJId: roominfo?.id,
    /** 班级ID */
    KHBJSJId: bjxx.id,
    XXSJPZId: jcId,
  };
  const getCq = async () => {
    const resAll = await getAllKHXSCQ({
      bjId: bjxx?.id, // 班级ID
      CQRQ: xkrq, // 日期
      XXSJPZId: jcId || undefined, // 排课ID
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
      id,
    });
    if (res.status === 'ok' && res.data) {
      console.log('res', res);
      const { data } = res;
      setOnTime(data.SFZSSK!);
      setOriTeacher(data.SFYDJS!);
      setAccurate(data.RSSFZQ!);
      setCheckNum(data.SDRS!);
      setBzDetail(data.BZXX);
      setRealNum(data.QRRS!);

      setHisId(data.id);
    }
  };
  useEffect(() => {
    getCq();
    if (bjxx.KHXKJLs?.length) {
      console.log('bjxx.KHXKJLs', bjxx.KHXKJLs);
      getDetail(bjxx.KHXKJLs[0].id);
    }
    if (bjxx.ISFW === 1) {
      (async () => {
        const resStudent = await getSerEnrolled({ id: bjxx.id || '' });
        if (resStudent.status === 'ok') {
          const studentData = resStudent.data;
          setSignNum(studentData?.length || 0);
        }
      })();
    } else {
      setSignNum(bjxx?.xs_count || 0);
    }
  }, [bjxx]);

  const handleSubmit = async () => {
    console.log('recordDetail', recordDetail);

    const newRecordDetai: API.CreateKHXKJL = {
      ...recordDetail,
      SFDM: checkIn,
      YDRS: signNum || bjxx?.xs_count,
      // 是否准时上课
      SFZSSK: onTime,
      //是否原定教师
      SFYDJS: oriTeacher,
      BZXX: bzDetail,
      /** 实到人数是否准确 */
      RSSFZQ: checkIn ? accurate : false,
      SDRS: checkNum,
      QRRS: realNum,
    };
    //修改
    if (hisId) {
      const res = await updateKHXKJL({ id: hisId }, newRecordDetai);
      if (res.status === 'ok') {
        message.success('巡课记录已提交');
        history.push('/teacher/patrolArrange/classes', {
          id: kcid,
          day: xkrq,
          xxId: currentUser?.xxId,
          kcmc,
        });
      } else {
        message.error(res.message);
      }
    } else {
      const res = await createKHXKJL(newRecordDetai);
      if (res.status === 'ok') {
        message.success('巡课记录已提交');
        history.push('/teacher/patrolArrange/classes', {
          id: kcid,
          day: xkrq,
          xxId: currentUser?.xxId,
          kcmc,
        });
      } else {
        message.error(res.message);
      }
    }
  };
  const limitDecimals = (value?: any) => {
    return value?.replace(/[^\d]+/g, '');
  };
  return (
    <MobileCon>
      <GoBack title={'巡课记录'} teacher />
      <div className={styles.patrolWrapper}>
        <div className={styles.patrolContent}>
          <div className={styles.patrolRecord}>
            <h4>{kcmc}</h4>
            <div className={styles.card}>
              <h4>教师出勤情况</h4>
              <ul>
                <li>
                  <label>课程班名称</label>
                  <span>{bjxx?.BJMC}</span>
                </li>
                <li>
                  <label>任课教师</label>
                  <span>
                    <ShowName
                      XM={teacherInfo?.JZGJBSJ?.XM}
                      type="userName"
                      openid={teacherInfo?.JZGJBSJ?.WechatUserId}
                    />
                  </span>
                </li>
                <li>
                  <label>上课教室</label>
                  <span>{roominfo?.FJMC}</span>
                </li>
                <li>
                  <label>是否准时上课</label>
                  <span>
                    <Switch
                      disabled={check}
                      checked={onTime}
                      onChange={(checked) => {
                        setOnTime(checked);
                      }}
                    />
                  </span>
                </li>
                <li>
                  <label>是否原定教师</label>
                  <span>
                    <Switch
                      disabled={check}
                      checked={oriTeacher}
                      onChange={(checked) => {
                        setOriTeacher(checked);
                      }}
                    />
                  </span>
                </li>
              </ul>
            </div>
            <div className={styles.card}>
              <h4>学生出勤情况</h4>
              <ul>
                <li>
                  <label>授课教师是否已点名</label>
                  <span>{checkIn ? '已点名' : '未点名'}</span>
                </li>
                <li>
                  <label>应到人数</label>
                  <span>
                    <InputNumber value={signNum} disabled />人
                  </span>
                </li>
                {checkIn ? (
                  <li>
                    <label>实到人数</label>
                    <span>
                      <InputNumber value={checkNum} disabled /> 人
                    </span>
                  </li>
                ) : (
                  ''
                )}
                {checkIn ? (
                  <li>
                    <label>实到人数准确</label>
                    <span>
                      <Switch
                        disabled={check}
                        checked={accurate}
                        onChange={(checked) => setAccurate(checked)}
                      />
                    </span>
                  </li>
                ) : (
                  ''
                )}
                {!accurate || !checkIn ? (
                  <li>
                    <label>巡课确认人数</label>
                    <span>
                      {check ? (
                        <InputNumber value={realNum} disabled />
                      ) : (
                        <InputNumber
                          disabled={check}
                          placeholder="请输入"
                          min={0}
                          max={signNum}
                          formatter={limitDecimals}
                          parser={limitDecimals}
                          value={realNum}
                          onChange={(value) => {
                            recordDetail.QRRS = value;
                            setRealNum(value);
                          }}
                          // onBlur={(e) => {
                          //   const val = Number(e.target.value);
                          //   const num = val > signNum ? signNum : val < 0 ? 0 : val;
                          //   recordDetail.QRRS = num;
                          // }}
                        />
                      )}
                      人
                    </span>
                  </li>
                ) : (
                  ''
                )}
              </ul>
            </div>
            <div className={styles.card} style={{ marginBottom: 60, paddingBottom: 24 }}>
              <h4>其他说明</h4>
              {check ? (
                <div style={{ padding: '10px', color: '#666' }}>{bzDetail}</div>
              ) : (
                <TextArea
                  value={bzDetail}
                  rows={6}
                  showCount
                  maxLength={255}
                  onChange={(value) => {
                    // console.log('value', value.target.value);
                    // recordDetail.BZXX = value.target.value;
                    setBzDetail(value.target.value);
                  }}
                />
              )}
            </div>
            <div className={styles.footer}>
              <button className={styles.btn} onClick={() => history.go(-1)}>
                {check ? '返回' : '取消'}
              </button>
              {check ? (
                ''
              ) : (
                <button className={styles.btnes} onClick={handleSubmit}>
                  提交
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MobileCon>
  );
};

export default NewPatrol;
