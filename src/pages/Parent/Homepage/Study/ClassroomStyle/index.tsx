import GoBack from '@/components/GoBack';
import styles from './index.less';
import { Avatar, Image, Row, Col, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { getAllKHKTFC } from '@/services/after-class/khktfc';

const ClassroomStyle = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student } = currentUser || {};
  const StorageXSId = localStorage.getItem('studentId');
  const [listData, setListData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
  }, listData);

  const getData = async () => {
    const resKHKTFC = await getAllKHKTFC({
      XSJBSJId: StorageXSId || (student && student[0].XSJBSJId) || testStudentId,
    });
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
          //班级所属于学校或机构的名称
          schoolName: item.KHBJSJ.KHKCSJ.KHJYJG?.QYMC || item.KHBJSJ.KHKCSJ.XXJBSJ?.XXMC
        };
        allData.push(data);
      });
      setListData(allData);
      setLoading(false);
    }

  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.ClassroomStyle}>
      <GoBack title={'课堂风采'} onclick="/parent/home?index=study" />
      <div className={styles.wrap}>
        {
          !loading ? listData.map((item: any) => {
            return (

              <div className={styles.cards}>
                <p>
                  <Avatar style={{ backgroundColor: '#45C977', verticalAlign: 'middle' }} size="large">
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
                    <span>{item.time}</span>
                    <span>
                      {item.className} ｜{item.classNum}
                    </span>
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
export default ClassroomStyle;


