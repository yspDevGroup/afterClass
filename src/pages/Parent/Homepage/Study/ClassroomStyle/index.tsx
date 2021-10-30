import GoBack from '@/components/GoBack';
import styles from './index.less';
import { Empty, Avatar, Image, Row, Col, Popconfirm, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { getJZGJBSJ } from '@/services/after-class/jzgjbsj';
import { getKHBJSJ } from '@/services/after-class/khbjsj';
import { getAllKHKTFC, deleteKHKTFC } from '@/services/after-class/khktfc';
import { UserOutlined } from '@ant-design/icons';
import noData from '@/assets/noData.png';

const ClassroomStyle = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [listData, setListData] = useState<any>();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
  }, listData);

  const getData = async () => {
    const resKHKTFC = await getAllKHKTFC({});
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
          teacherName:  item.JZGJBSJ.XM,
          schoolName:  item.JZGJBSJ.XXJBSJ.XXMC
        };
        allData.push(data);
      });
      Promise.all(allData).then((results) => {
        setListData(results);
      });
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
          listData ? listData.map((item: any) => {
            return (
              <div className={styles.cards}>
                <p>
                  <Avatar style={{ backgroundColor: '#45C977', verticalAlign: 'middle' }} size="large">
                  {item.teacherName.slice(0,1)}
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
                    <Row gutter={[6, 6]} style={{width: '100%',height: item.imgs.length === (2 || 4) ? '100px': (item.imgs.length === 1? 'auto' : '280px')}}>
                    {
                      item.imgs.map((url: string)=> {
                        return <Col span={(item.imgs.length === 2 || item.imgs.length === 4) ? 12 : (item.imgs.length === 1 ? 24 : 8)} className={(item.imgs.length === 2 || item.imgs.length === 4) ? styles.pairImg: (item.imgs.length === 1 ? styles.oneImg : styles.nineImg)}>
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

          }) : <Empty
            image={noData}
            style={{ marginTop: '20px', borderRadius: '8px', minHeight: '300px', backgroundColor: '#fff', }}
            imageStyle={{
              height: 200,
            }}
            description={'暂无课堂风采记录'} />
        }
      </div>
    </div>
  );
};
export default ClassroomStyle;


