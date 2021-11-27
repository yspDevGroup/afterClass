import { Avatar, Image, Row, Col, Popconfirm, message, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import GoBack from '@/components/GoBack';
import { getAllKHKTFC, deleteKHKTFC } from '@/services/after-class/khktfc';
import styles from './index.less';
import { useModel } from 'umi';

const Record = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [listData, setListData] = useState<any>();
  const [showData, setShowData] = useState<any>();
  const [showIndex, setShowIndex] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [startY, setStartY] = useState<number>(0);
  const [endY, setEndY] = useState<number>(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const resKHKTFC = await getAllKHKTFC({ XXJBSJId: currentUser?.xxId });
    if (resKHKTFC.status === 'ok') {
      const allData: any = [];
      resKHKTFC.data?.rows?.forEach((item: any, index: number) => {
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
        };
        allData.push(data);
      });
      setShowData(allData.slice(0, 3));
      setListData(allData);
      setLoading(false);
    }

  }

  function cancel(e: any) {
    // console.log(e);
  }

  const handleTouchStart = (e: any) => {
    setStartY(e.touches[0].clientY);
  };
  const handleTouchMove = (e: any) => {
    setEndY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: any) => {
    if (startY > -1 && endY > -1) {
      let distance = Math.abs(startY - endY);
      if (distance > 50) {
        if (startY > endY) {
          //上滑
          setShowData([...showData, ...listData.slice(showIndex, showIndex + 3)])
          setShowIndex(showIndex + 3);
        } else {
          //下拉
        }
      }
    }

    setStartY(-1);
    setEndY(-1);
  };

  return (
    <div className={styles.ClassroomStyle} onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      <GoBack title="课堂风采" teacher onclick="/teacher/home?index=education" />
      <div className={styles.wrap}>
        {
          !loading ? showData.map((item: any) => {
            return (
              <div className={styles.cards}>
                <p>
                  <Avatar style={{ backgroundColor: '#0066FF', verticalAlign: 'middle' }} size="large">
                    <p style={{ fontSize: '14px', lineHeight: '21px', height: '21px' }}>{moment(item.time).format('DD')}</p>
                    <p style={{ fontSize: '12px', lineHeight: '12px', height: '12px', fontWeight: 300 }}>{moment(item.time).format('MM') + '月'}</p>
                  </Avatar>
                  <div className={styles.name}>
                    <p>{item.className}</p>
                    <p>{item.classNum + '\u00A0\u00A0' + item.teacherName}</p>
                  </div>
                </p>
                <div className={styles.content}>
                  <p>{item.content}</p>
                  <div className={styles.imgContainer}>
                    <Image.PreviewGroup>
                      <Row gutter={[6, 6]} style={{ width: '100%' }}>
                        {
                          item.imgs.map((url: string) => {
                            return <Col span={(item.imgs.length === 2 || item.imgs.length === 4) ? 12 : (item.imgs.length === 1 ? 24 : 8)} className={(item.imgs.length === 2 || item.imgs.length === 4) ? styles.pairImg : (item.imgs.length === 1 ? styles.oneImg : styles.nineImg)}>
                              <Image src={url} />
                            </Col>
                          })
                        }
                      </Row>
                    </Image.PreviewGroup>
                  </div>
                  <p>
                    <span>{moment(item.time).format('HH:mm:ss')}</span>
                    <Popconfirm
                      title="您确定要删除此条内容吗？"
                      placement="topRight"
                      onConfirm={async () => {
                        try {
                          if (item.id) {
                            const params = { id: item.id };
                            const res = deleteKHKTFC(params);
                            new Promise((resolve) => {
                              resolve(res);
                            }).then((data: any) => {
                              if (data.status === 'ok') {
                                message.success('删除成功');
                                getData();
                              }
                            });
                          }
                        } catch (err) {
                          message.error('删除失败，请联系管理员或稍后重试。');
                        }
                      }
                      }
                      onCancel={cancel}
                      okText="确定"
                      cancelText="取消"
                      key={item.id}
                    >
                      <a href="#">删除</a>
                    </Popconfirm>
                  </p>
                </div>
              </div>
            )

          }) : <div>
            {
              [1, 2, 3].map(() => {
                return <div className={styles.cards}>
                  <Skeleton avatar active loading={loading} />
                </div>
              })
            }
          </div>
        }
      </div>
    </div>
  );
};
export default Record;
