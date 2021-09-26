/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-26 10:30:36
 * @LastEditTime: 2021-09-26 17:03:55
 * @LastEditors: Sissle Lynn
 */
import styles from '../index.less';
import GoBack from '@/components/GoBack';
import { InputNumber, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import { useModel } from 'umi';

const NewPatrol = (props: any) => {
  const { kcmc, xkrq, bjxx } = props?.location?.state;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 是否点名
  const [check, setCheck] = useState<boolean>(false);
  // 实到人数准确与否
  const [accurate, setAccurate] = useState<boolean>(true);
  const teacherInfo = bjxx?.KHBJJs?.[0]?.KHJSSJ;
  const roominfo = bjxx?.KHPKSJs?.[0]?.FJSJ;
  const recordDetail = {
    /** 巡课日期 */
    RQ: xkrq,
    /** 是否准时上课 */
    SFZSSK: true,
    /** 是否为原定教师 */
    SFYDJS: true,
    /** 是否点名 */
    SFDM: false,
    /** 实到人数是否准确 */
    RSSFZQ: true,
    /** 学生应到人数 */
    YDRS: '',
    /** 学生实到人数 */
    SDRS: '',
    /** 备注信息 */
    BZXX: '',
    /** 巡课教师ID */
    XKJSId: currentUser.JSId || '1965a118-4b5b-4b58-bf16-d5f45e78b28c',
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
        setCheck(true);
      } else {
        // setCheck(false);
      }
    }
  }
  useEffect(() => {
    getCq();
  }, [bjxx]);

  return (
    <>
      <GoBack title={'巡课记录'} onclick='/teacher/patrolArrange/classes' teacher />
      <div className={styles.patrolWrapper}>
        <div className={styles.patrolContent}>
          <div className={styles.patrolRecord}>
            <h4>{kcmc}</h4>
            <div className={styles.card}>
              <h4>教师出勤情况</h4>
              <ul>
                <li><label>班级名称</label><span>{bjxx?.BJMC}</span></li>
                <li><label>任课教师</label><span>{bjxx?.KHBJJs?.[0]?.KHJSSJ?.XM}</span></li>
                <li><label>上课教室</label><span>{bjxx?.KHPKSJs?.[0]?.FJSJ?.FJMC}</span></li>
                <li><label>是否准时上课</label><span><Switch defaultChecked /></span></li>
                <li><label>是否原定教师</label><span><Switch defaultChecked /></span></li>
              </ul>
            </div>
            <div className={styles.card}>
              <h4>学生出勤情况</h4>
              <ul>
                <li><label>是否已点名</label><span><Switch disabled checked={check} /></span></li>
                <li>
                  <label>应到人数</label>
                  <span><InputNumber value={35} disabled />人</span>
                </li>
                <li>
                  <label>实到人数</label>
                  <span>{check ? <InputNumber value={35} disabled /> : <InputNumber placeholder='请输入' min={0} max={35} />}人</span>
                </li>
                {check ? <li>
                  <label>实到人数准确</label>
                  <span><Switch defaultChecked onChange={(checked) => setAccurate(checked)} /></span>
                </li> : ''}
                {!accurate ? <li>
                  <label>巡课确认人数</label>
                  <span>
                    <InputNumber placeholder='请输入' min={0} max={35} />人
                  </span>
                </li> : ''}
              </ul>
            </div>
            <div className={styles.card} style={{ marginBottom: 60 }}>
              <h4>其他说明</h4>
              <textarea name="" id="" rows={5} ></textarea>
            </div>
            <div className={styles.footer}>
              <button className={styles.btn} >
                取消
              </button>
              <button className={styles.btnes}>提交</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPatrol;
