/* eslint-disable no-nested-ternary */
import { Avatar, Image, Row, Col, message, Skeleton, Modal } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import GoBack from '@/components/GoBack';
import { getAllKHKTFC, deleteKHKTFC } from '@/services/after-class/khktfc';
import styles from './index.less';
import { useModel } from 'umi';
import ShowName from '@/components/ShowName';
import noData from '@/assets/noData.png';
import Nodata from '@/components/Nodata';

const Record = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [listData, setListData] = useState<any>();
  const [showData, setShowData] = useState<any>([]);
  const [showIndex, setShowIndex] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [startY, setStartY] = useState<number>(0);
  const [endY, setEndY] = useState<number>(0);
  const [ModalVisible, setModalVisible] = useState(false);
  const [ids, setids] = useState();


  const getData = async (res: any) => {
    const resKHKTFC = await getAllKHKTFC({
      XXJBSJId: currentUser?.xxId,
      page: res / 10,
      pageSize: 10
    });
    if (resKHKTFC.status === 'ok') {
      setListData(resKHKTFC?.data?.rows)
      resKHKTFC.data?.rows?.forEach((item: any) => {
        const imgsArr = item.TP?.split(';');
        imgsArr.pop();
        const data = {
          id: item.id,
          className: item.KHBJSJ?.KHKCSJ?.KCMC,
          classNum: item.KHBJSJ?.BJMC,
          content: item.NR,
          imgs: imgsArr,
          time: item.createdAt,
          teacher: item.JZGJBSJ,
          JSId: item.JZGJBSJId,
        };
        showData.push(data);
      });

      setLoading(false);
    }
  };

  useEffect(() => {
    getData(showIndex);
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
          setShowIndex(showIndex + 10);
          if (showIndex !== 10 && listData?.length !== 0) {
            getData(showIndex);
          }
          if (listData?.length === 0 && type === true) {
            getData(showIndex - 1);
          }
        }
      }
    }
    setStartY(-1);
    setEndY(-1);
  };

  const handleOks = () => {
    try {
      if (ids) {
        const params = { id: ids };
        const res = deleteKHKTFC(params);
        new Promise((resolve) => {
          resolve(res);
        }).then((data: any) => {
          if (data.status === 'ok') {
            message.success('删除成功');
            const newArr = showData.filter((item: any) => {
              return item?.id !== ids
            })
            setShowData(newArr)
            setModalVisible(false);
          }
        });
      }
    } catch (err) {
      message.error('删除失败，请联系管理员或稍后重试。');
    }
  }
  return (
    <div
      className={styles.ClassroomStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <GoBack title="课堂风采" teacher onclick="/teacher/home?index=education" />
      <div className={styles.wrap}>
        {!loading ? (
          showData && showData?.length ? (
            showData.map((item: any) => {
              return (
                <div className={styles.cards}>
                  <p>
                    <Avatar
                      style={{ backgroundColor: '#0066FF', verticalAlign: 'middle' }}
                      size="large"
                    >
                      <p style={{ fontSize: '14px', lineHeight: '21px', height: '21px' }}>
                        {moment(item.time).format('DD')}
                      </p>
                      <p
                        style={{
                          fontSize: '12px',
                          lineHeight: '12px',
                          height: '12px',
                          fontWeight: 300,
                        }}
                      >
                        {`${moment(item.time).format('MM')}月`}
                      </p>
                    </Avatar>
                    <div className={styles.name}>
                      <p>{item.className}</p>
                      <p>
                        {`${item.classNum}\u00A0\u00A0`}{' '}
                        <ShowName
                          type="userName"
                          openid={item?.teacher?.WechatUserId}
                          XM={item?.teacher?.XM}
                        />
                      </p>
                    </div>
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
                      <span>{moment(item.time).format('HH:mm:ss')}</span>
                      {currentUser?.JSId === item.JSId ? (
                        <a onClick={() => {
                          setModalVisible(true);
                          setids(item?.id);
                        }}>删除</a>
                      ) : (
                        <></>
                      )}
                      <a onClick={() => {
                        setModalVisible(true);
                        setids(item?.id);
                      }}>删除</a>
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <Nodata imgSrc={noData} desc="暂无课堂风采" />
          )
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
      <Modal
        title="删除确认"
        visible={ModalVisible}
        onOk={handleOks}
        onCancel={() => {
          setModalVisible(false);
        }}
        closable={false}
        className={styles.signUpModal}
        okText="确认"
        cancelText="取消"
      >
        <div>
          <p>您确定要删除此条内容吗？</p>
        </div>
      </Modal>
    </div>
  );
};
export default Record;
