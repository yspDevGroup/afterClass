import { Button, Checkbox, Divider, Modal, Popconfirm, Radio } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useModel, Link } from 'umi';
import styles from './index.less';
import { getKHKCSJ } from '@/services/after-class/khkcsj';
import { enHenceMsg, getQueryString } from '@/utils/utils';
import moment from 'moment';
import { createKHXSDD } from '@/services/after-class/khxsdd';
import WWOpenDataCom from '@/pages/Manager/ClassManagement/components/WWOpenDataCom';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import noPic from '@/assets/noPic.png';
import GoBack from '@/components/GoBack';
import { queryXNXQList } from '@/services/local-services/xnxq';

const CourseDetails: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [BJ, setBJ] = useState<string>();
  const [FY, setFY] = useState<number>();
  const [state, setstate] = useState(false);
  const [KcDetail, setKcDetail] = useState<any>();
  const [orderInfo, setOrderInfo] = useState<any>();
  const [classDetail, setClassDetail] = useState<any>();
  const [kaiguan, setKaiguan] = useState<boolean>(true);
  const [fk, setFk] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const courseid = getQueryString('courseid');
  const index = getQueryString('index');
  const curDate: Date = new Date();
  const myDate: Date = new Date(moment(curDate).format('YYYY/MM/DD'));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Xystate, setXystate] = useState(false);

  const children = currentUser?.subscriber_info?.children || [
    {
      student_userid: currentUser?.UserId,
      njId: '1',
      name: currentUser?.username,
    },
  ];

  const changeStatus = (ind: number, data?: any) => {
    const detail = data || KcDetail;
    const current = detail.KHBJSJs![ind];
    console.log(current, '=====');
    const start = current.BMKSSJ ? current.BMKSSJ : detail.BMKSSJ;
    const end = current.BMKSSJ ? current.BMJSSJ : detail.BMJSSJ;
    const enAble =
      myDate >= new Date(moment(start).format('YYYY/MM/DD')) &&
      myDate <= new Date(moment(end).format('YYYY/MM/DD'));
    // setFk(current.KHXSBJs.length >= current.BJRS || !enAble);
    setFY(current.FY);
    setBJ(current.id);
  };
  const getWxData = async () => {
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      await initWXConfig(['checkJsApi']);
    }
    await initWXAgentConfig(['checkJsApi']);
    setIsLoading(true);
  };
  useEffect(() => {
    getWxData();
  }, [isLoading]);
  useEffect(() => {
    if (courseid) {
      getWxData();
      (async () => {
        const res = await queryXNXQList();
        if (res.current) {
          const result = await getKHKCSJ({
            kcId: courseid,
            XXJBSJId: currentUser?.xxId,
            XNXQId: res.current.id,
          });
          console.log(result, '----------------');
          if (result.status === 'ok') {
            if (result.data) {
              setKcDetail(result.data);
              changeStatus(0, result.data);
              const kcstart = moment(result.data.BMKSSJ).format('YYYY/MM/DD');
              const kcend = moment(result.data.BMJSSJ).format('YYYY/MM/DD');
              const btnEnable = myDate >= new Date(kcstart) && myDate <= new Date(kcend);
              setKaiguan(btnEnable);
            }
          } else {
            enHenceMsg(result.message);
          }
        }
      })();
    }
  }, [courseid]);

  useEffect(() => {
    if (orderInfo) linkRef.current?.click();
  }, [orderInfo]);
  const onBJChange = (e: any) => {
    const bjId = e.target.value.split('+')[0];
    setBJ(bjId);
    setFY(e.target.value.split('+')[1]);
  };
  const onchanges = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  };
  const submit = async () => {
    const bjInfo = KcDetail.KHBJSJs.find((item: any) => {
      return item.id === BJ;
    });
    await setClassDetail(bjInfo);
    const data: API.CreateKHXSDD = {
      XDSJ: new Date().toISOString(),
      ZFFS: '线上支付',
      DDZT: '待付款',
      DDFY: FY!,
      XSId: children[0].student_userid!,
      XSXM: children[0].name!,
      KHBJSJId: BJ!,
    };
    const res = await createKHXSDD(data);
    if (res.status === 'ok') {
      setOrderInfo(res.data);
    } else {
      enHenceMsg(res.message);
    }
  };
  const butonclick = (ind: number) => {
    changeStatus(ind);
  };

  /** 课后帮服务协议弹出框 */
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
    setXystate(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFxChange = (e: { target: { checked: any } }) => {
    // eslint-disable-next-line no-console
    // console.log(e.target.checked);
    setXystate(e.target.checked);
  };
  console.log(KcDetail?.KHBJSJs, '----');
  return (
    <div className={styles.CourseDetails}>
      {index === 'all' ? (
        <GoBack title={'课程简介'} />
      ) : (
        <GoBack title={'课程简介'} onclick="/parent/home?index=index" />
      )}
      <div className={styles.wrap}>
        {KcDetail?.KCTP && KcDetail?.KCTP.indexOf('http') > -1 ? (
          <img src={KcDetail?.KCTP} alt="" style={{ marginBottom: '18px', height: '200px' }} />
        ) : (
          <div
            style={{
              padding: '10px',
              border: '1px solid #F7F7F7',
              textAlign: 'center',
              marginBottom: '18px',
            }}
          >
            <img style={{ width: '180px', height: 'auto', marginBottom: 0 }} src={noPic} />
          </div>
        )}
        <p className={styles.title}>{KcDetail?.KCMC}</p>

        <ul>
          <li>
            报名时段：{moment(KcDetail?.BMKSSJ).format('YYYY.MM.DD')}~
            {moment(KcDetail?.BMJSSJ).format('YYYY.MM.DD')}
          </li>
          <li>
            上课时段：{moment(KcDetail?.KKRQ).format('YYYY.MM.DD')}~
            {moment(KcDetail?.JKRQ).format('YYYY.MM.DD')}
          </li>
          <li>上课地点：本校</li>
        </ul>
        <p className={styles.title}>课程简介</p>
        <p className={styles.content}>{KcDetail?.KCMS}</p>
        <Divider />
        <p className={styles.content}>开设班级：</p>
        <ul className={styles.classInformation}>
          {KcDetail?.KHBJSJs &&
            KcDetail?.KHBJSJs.map((value: any) => {
              return (
                <li>
                  <div style={{ paddingBottom: '10px' }}>
                    <p className={styles.bjname}>
                      <span>{value.BJMC}</span>
                    </p>
                    <p className={styles.bzrname}>
                      班主任：
                      {isLoading ? <WWOpenDataCom type="userName" openid={value.ZJS} /> : <></>}
                    </p>
                    <p className={styles.bzrname}>
                      副班：
                      {isLoading ? (
                        value.FJS.split(',').map((item: any) => {
                          return (
                            <span style={{ marginRight: '5px' }}>
                              <WWOpenDataCom type="userName" openid={item} />
                            </span>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </p>
                    <table>
                      <thead>
                        <tr>
                          <th>课时数</th>
                          <th>总人数</th>
                          <th>报名费</th>
                          <th>上课时间</th>
                          <th>上课地点</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{value.KSS}课时</td>
                          <td>{value.BJRS}人</td>
                          <td>{value.FY}元</td>
                          {/* <td style={{ padding: '2px 0' }}>
                            {value.KHPKSJs.map(
                              (val: { FJSJ: any; XXSJPZ: any; WEEKDAY: number }) => {
                                const weeks = `每周${'日一二三四五六'.charAt(val.WEEKDAY)}`;
                                return (
                                  <p>
                                    {weeks}
                                    {val.XXSJPZ.KSSJ.substring(0, 5)}-
                                    {val.XXSJPZ.JSSJ.substring(0, 5)}
                                  </p>
                                );
                              },
                            )}
                          </td>
                          <td style={{ padding: '2px 0' }}>
                            {value.KHPKSJs.map(
                              (val: { FJSJ: any; XXSJPZ: any; WEEKDAY: number }) => {
                                return <p>{val.FJSJ.FJMC}</p>;
                              },
                            )}
                          </td> */}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
      <div className={styles.footer}>
        {kaiguan ? (
          <button className={styles.btn} onClick={() => setstate(true)}>
            立即报名
          </button>
        ) : (
          <button className={styles.btnes}>课程不在报名时间范围内</button>
        )}
      </div>
      {state === true ? (
        <div className={styles.payment} onClick={() => setstate(false)}>
          <div onClick={onchanges}>
            <p className={styles.title}>{KcDetail?.KCMC}</p>
            <p className={styles.price}>
              <span>￥{FY}</span>
              <span>/学期</span>
            </p>
            <p className={styles.title} style={{ fontSize: '14px' }}>
              班级
            </p>
            <Radio.Group onChange={onBJChange} value={`${BJ}+${FY}`}>
              {KcDetail?.KHBJSJs?.map(
                (
                  value: {
                    BJMC: string;
                    id: string;
                    FJS: string;
                    FY: string;
                    BMKSSJ: Date;
                    BMJSSJ: Date;
                    BJRS: number;
                    KHXSBJs: any[];
                  },
                  ind: number,
                ) => {
                  const text = `${value.BJMC}已有${value.KHXSBJs.length}人报名，共${value.BJRS}个名额`;
                  const valueName = `${value.id}+${value.FY}`;
                  const start = value.BMKSSJ ? value.BMKSSJ : KcDetail.BMKSSJ;
                  const end = value.BMKSSJ ? value.BMJSSJ : KcDetail.BMJSSJ;
                  const enAble =
                    myDate >= new Date(moment(start).format('YYYY/MM/DD')) &&
                    myDate <= new Date(moment(end).format('YYYY/MM/DD'));
                  return (
                    <Popconfirm
                      overlayClassName={styles.confirmStyles}
                      placement="bottom"
                      title={text}
                      defaultVisible={BJ === value.id}
                    >
                      <Radio.Button
                        value={valueName}
                        style={{ marginRight: '14px' }}
                        disabled={!enAble}
                        onClick={() => butonclick(ind)}
                      >
                        {value.BJMC}
                      </Radio.Button>
                    </Popconfirm>
                  );
                },
              )}
            </Radio.Group>
            <div className={styles.agreement}>
              <Checkbox onChange={onFxChange} checked={Xystate}>
                <span>我已阅读并同意</span>
              </Checkbox>
              <a onClick={showModal}>《课后帮服务协议》</a>
            </div>
            <Button className={styles.submit} disabled={fk || BJ === undefined} onClick={submit}>
              确定并付款
            </Button>
            <Link
              style={{ visibility: 'hidden' }}
              ref={linkRef}
              to={{
                pathname: '/parent/mine/orderDetails',
                state: {
                  title: KcDetail?.KCMC,
                  detail: classDetail,
                  payOrder: orderInfo,
                  user: currentUser,
                  KKRQ: KcDetail?.KCRQ,
                  JKRO: KcDetail?.KCRQ,
                },
              }}
            ></Link>
          </div>
        </div>
      ) : (
        ''
      )}
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        bodyStyle={{
          width: 200,
        }}
        className={styles.showagreement}
      >
        <p>课后帮服务协议书</p>
        <div>
          <p>
            尊敬的各位家长或监护人:
            根据《教育部办公厅关于做好中小学生课后服务工作的指导意见》（教基一厅[2017]2号）要求，丹东市教育局《关于做好中小学课后服务工作的实施意见》，丹东市教育局关于开展中小学课后服务工作的通知精神，我校中学部决定从本学期开始在七至九年级开展课后服务工作。为了学生安全，请家长积极配合学校管理学生，家校共同承担教育责任，协定如下:
            一、课后服务说明
            1、参加课后服务纯属学生及家长自愿，学校尊重学生和家长的自主选择。2、不愿意参加的同学，不作强行要求。
            3、课后服务时间:平均每次不超过1.5小时。（冬季时间稍短，夏季时间稍长。节假日及学生下午离校时间除外，特殊情况另行通知）
            4、学生有病或者有特殊事情时家长必须提前亲自到校或电话为学生请假。
            5、参加课后服务的学生自下午放学后不得擅自离校，要严格遵守学校的各项规章制度，服从教师管理，对严重违纪或屡教不改的学生学校有权终止其参加课后服务的资格。
            6、为解决学生参加课后服务期间晚餐的问题，家长可以为学生自备饮食，也可以购买配餐单位为学生提供的间食（按月收取费用），学生和家长自愿选择。严禁放学后外出就餐或购买外卖，违者取消其参加课后服务的资格。
            二、安全要求
            1、服务期间，学校和家长共同做好安全工作，加强安全教育。参加服务的学生严格遵守校规校纪，严禁在走廊跑跳、疯闹、打架等;严禁携带危险物品(如刀具）到校。教育学生服务期间遵守交通规则。家长必须叮嘱学生上学放学路上的安全,按时回家，不得在外逗留。
            2、家长必须加强对孩子交通安全教育和防溺水等安全教育，严格监控学生的时间。3、参加课后服务的学生家长要保持通讯畅通，便于及时沟通。
            4、家长对回家较晚或离家较早的学生要注意动向，及时打电话与学校联系。三、本协议未尽之处由学校及家长委员会另行补充。
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default CourseDetails;
