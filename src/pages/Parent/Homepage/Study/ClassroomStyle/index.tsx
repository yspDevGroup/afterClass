/* eslint-disable no-nested-ternary */
import GoBack from '@/components/GoBack';
import styles from './index.less';
import { Avatar, Image, Row, Col, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { getPresenceByStudent } from '@/services/after-class/khktfc';
import noOrder from '@/assets/noOrder.png';
import { queryXNXQList } from '@/services/local-services/xnxq';
import MobileCon from '@/components/MobileCon';

const ClassroomStyle = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student } = currentUser || {};
  const StorageXSId = localStorage.getItem('studentId');
  const [listData, setListData] = useState<any>();
  const [showData, setShowData] = useState<any>();
  const [showIndex, setShowIndex] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [startY, setStartY] = useState<number>(0);
  const [endY, setEndY] = useState<number>(0);

  const getData = async () => {
    const result = await queryXNXQList(currentUser?.xxId);
    const resKHKTFC = await getPresenceByStudent({
      XSJBSJId: StorageXSId || (student && student[0].XSJBSJId) || testStudentId,
      XNXQId: result.current?.id,
    });
    if (resKHKTFC.status === 'ok') {
      const allData: any = [];
      resKHKTFC.data?.rows?.forEach((item: any) => {
        const imgsArr = item.TP.split(';');
        imgsArr.pop();
        const data = {
          id: item.id,
          className: item.KHBJSJ.KHKCSJ.KCMC,
          classNum: item.KHBJSJ.BJMC,
          content: item.NR,
          imgs: imgsArr,
          time: item.createdAt,
          teacherName: item.JZGJBSJ.XM,
          // 班级所属于学校或机构的名称
          schoolName: item.KHBJSJ.KHKCSJ.KHJYJG?.QYMC || item.KHBJSJ.KHKCSJ.XXJBSJ?.XXMC,
        };
        allData.push(data);
      });
      setShowData(allData.slice(0, 3));
      setListData(allData);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const handleTouchStart = (e: any) => {
    setStartY(e.touches[0].clientY);
  };
  const handleTouchMove = (e: any) => {
    setEndY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (startY > -1 && endY > -1) {
      const distance = Math.abs(startY - endY);
      if (distance > 50) {
        if (startY > endY) {
          // 上滑
          setShowData([...showData, ...listData.slice(showIndex, showIndex + 3)]);
          setShowIndex(showIndex + 3);
        } else {
          // 下拉
        }
      }
    }

    setStartY(-1);
    setEndY(-1);
  };

  return (
    <MobileCon>
      <div
        className={styles.ClassroomStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <GoBack title={'课堂风采'} onclick="/parent/home?index=study" />
        {showData && showData?.length === 0 ? (
          <div className={styles.ZWSJ}>
            <img src={noOrder} alt="" />
            <p>暂无数据</p>
          </div>
        ) : (
          <div className={styles.wrap}>
            {!loading ? (
              <>
                {showData.map((item: any) => {
                  return (
                    <div className={styles.cards}>
                      <p>
                        <Avatar
                          style={{
                            backgroundColor: '#15B628',
                            verticalAlign: 'middle',
                            fontSize: 18,
                          }}
                          size="large"
                        >
                          {item.teacherName.slice(0, 1)}
                        </Avatar>
                        <p className={styles.name}>
                          <p>{item.teacherName}</p>
                          <p>{item.schoolName}</p>
                        </p>
                      </p>
                      <div className={styles.content}>
                        <p>{item.content}</p>
                        <div className={styles.imgContainer}>
                          <Image.PreviewGroup>
                            <Row gutter={[6, 6]} style={{ width: '100%' }}>
                              {item.imgs.map((url: string) => {
                                return (
                                  <Col
                                    span={
                                      item.imgs.length === 2 || item.imgs.length === 4
                                        ? 12
                                        : item.imgs.length === 1
                                        ? 24
                                        : 8
                                    }
                                    className={
                                      item.imgs.length === 2 || item.imgs.length === 4
                                        ? styles.pairImg
                                        : item.imgs.length === 1
                                        ? styles.oneImg
                                        : styles.nineImg
                                    }
                                  >
                                    <Image src={url} />
                                  </Col>
                                );
                              })}
                            </Row>
                          </Image.PreviewGroup>
                        </div>
                        <p>
                          <span>{item.time}</span>
                        </p>
                        <p>
                          <span>
                            {item.className}｜{item.classNum}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div>
                {[1, 2, 3].map(() => {
                  return (
                    <div className={styles.cards}>
                      <Skeleton avatar active loading={loading} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </MobileCon>
  );
};
export default ClassroomStyle;
