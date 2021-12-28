/*
 * @description:
 * @author: wsl
 * @Date: 2021-09-04 14:33:06
 * @LastEditTime: 2021-12-10 13:31:55
 * @LastEditors: zpl
 */
import GoBack from '@/components/GoBack';
import { deleteKHBJPJ, getKHBJPJ } from '@/services/after-class/khbjpj';
import { getStudentEvaluationClasses } from '@/services/after-class/khbjsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { Button, message, Rate, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel, Link } from 'umi';
import styles from './index.less';
import noOrder from '@/assets/noOrder.png';
import ShowName from '@/components/ShowName';

const { TabPane } = Tabs;

const Evaluation = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [KcData, setKcData] = useState<any>();
  const [History, setHistory] = useState<any>([]);
  const StorageXSId = localStorage.getItem('studentId');
  const getKcData = async () => {
    const result = await queryXNXQList(currentUser?.xxId, undefined);
    const { student } = currentUser || {};
    const res = await getStudentEvaluationClasses({
      XSJBSJId: StorageXSId || (student && student[0].XSJBSJId) || testStudentId,
      XNXQId: result.current.id,
      ZT: [0, 1, 2],
    });
    if (res.status === 'ok') {
      const newArr: any[] = [];
      res.data.forEach((value: any) => {
        if (value.KHBJSJ?.KHBJPJs?.length === 0) {
          newArr.push(value);
        }
      });
      setKcData(newArr);
    }
    const resgetKHBJPJ = await getKHBJPJ({
      KHBJSJId: '',
      XSJBSJId: StorageXSId || (student && student[0].XSJBSJId) || testStudentId,
      XNXQId: '',
      page: 0,
      pageSize: 0,
    });
    setHistory(resgetKHBJPJ?.data?.rows);
  };
  useEffect(() => {
    getKcData();
  }, [StorageXSId]);

  const submit = async (value: { id: any }) => {
    const res = await deleteKHBJPJ({ id: value.id });
    if (res.status === 'ok') {
      message.success('撤销成功');
      getKcData();
    }
  };

  return (
    <div className={styles.Evaluation}>
      <GoBack title={'课程评价'} onclick="/parent/home?index=mine" />
      <Tabs type="card">
        <TabPane tab="评价" key="评价">
          {KcData?.length !== 0 ? (
            <>
              <div className={styles.Application}>
                <div>
                  {KcData?.map((value: any) => {
                    return (
                      <>
                        <div className={styles.cards}>
                          <p className={styles.title}>{value.KHBJSJ?.KHKCSJ?.KCMC}</p>
                          <p>
                            班级：{value.KHBJSJ?.BJMC} ｜ 任课教师：
                            <ShowName
                              type="userName"
                              openid={value.KHBJSJ?.KHBJJs?.[0].JZGJBSJ?.WechatUserId}
                              XM={value.KHBJSJ?.KHBJJs?.[0].JZGJBSJ?.XM}
                            />
                          </p>
                          <Link
                            key="pj"
                            to={{
                              pathname: '/parent/mine/evaluation/evaluationDetails',
                              state: value,
                            }}
                          >
                            <Button>去评价</Button>
                          </Link>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className={styles.ZWSJ}>
              <img src={noOrder} alt="" />
              <p>暂无数据</p>
            </div>
          )}
        </TabPane>
        <TabPane tab="评价历史" key="评价历史">
          {History?.length === 0 ? (
            <div className={styles.ZWSJ}>
              <img src={noOrder} alt="" />
              <p>暂无数据</p>
            </div>
          ) : (
            <div className={styles.History}>
              <div>
                {History?.map((value: any) => {
                  return (
                    <div className={styles.Pjcards}>
                      <p className={styles.name}>
                        <span>{value?.PJR}</span>
                        <Rate value={parseInt(value.PJFS, 10)} disabled />
                      </p>
                      <p>{value.createdAt.split(' ')[0]}评价</p>
                      <div className={styles.PY}>{value.PY}</div>
                      <div className={styles.BJXX}>
                        <p>{value.KHBJSJ?.KHKCSJ?.KCMC}</p>
                        <p>
                          班级：{value.KHBJSJ?.BJMC} ｜ 任课教师：
                          {value.KHBJSJ?.KHBJJs?.[0].JZGJBSJ?.XM}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          submit(value);
                        }}
                      >
                        撤销
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Evaluation;
