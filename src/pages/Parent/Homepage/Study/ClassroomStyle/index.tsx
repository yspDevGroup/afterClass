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
        const data = getClassInfo(item, imgsArr);
        allData.push(data);
      });
      Promise.all(allData).then((results) => {
        setListData(results);
      });
    }

  }

  const getClassInfo = async (item: any, imgsArr: any) => {
    const resKHBJSJ = await getKHBJSJ({ id: item.KHBJSJId });
    const resJZGJBSJ = await getJZGJBSJ({ id: item.JZGJBSJId });
    console.log('resJZGJBSJ: ', resJZGJBSJ);
    if (resKHBJSJ.status === 'ok' && resJZGJBSJ.status ==='ok') {
      return {
        id: item.id,
        className: resKHBJSJ.data.KHKCSJ.KCMC,
        classNum: resKHBJSJ.data.BJMC,
        content: item.NR,
        imgs: imgsArr,
        time: item.createdAt,
        teacherName: resJZGJBSJ.data.XM,
        schoolName: resJZGJBSJ.data.XXM
      };
    }
    return '';

  }


  function cancel(e: any) {
    // console.log(e);
    // message.error('Click on No');
  }

  useEffect(() => {
    getData();
  }, []);

  // return (
  //   <div className={styles.ClassroomStyle}>
  //     <GoBack title={'课堂风采'} />
  //     <div className={styles.wrap}>
  //         <div className={styles.cards}>
  //           <p>
  //             <Avatar size="large" icon={<UserOutlined />} />
  //             <p className={styles.name}>
  //               <p>{'某'}老师</p>
  //               <p>鸿浩国学堂</p>
  //             </p>
  //           </p>
  //           <div className={styles.content}>
  //             <p>孩子们在本次课上的表现都很不错，积极活跃，学习氛围很好。</p>
  //             <div className={styles.imgContainer}>
  //               <Image className={styles.img} width={200} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"/>
  //               <Image className={styles.img} width={200} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"/>
  //               <Image className={styles.img} width={200} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"/>
  //             </div>
  //             <p>
  //               <span>{'5月26日 18:30'}</span>
  //               <span>
  //                 {'少儿书法'} ｜{'入门班'}
  //               </span>{' '}
  //             </p>
  //           </div>
  //           </div>
  //       </div>
  //   </div>
  // );
  return (
    <div className={styles.ClassroomStyle}>
      <GoBack title={'课堂风采'} />
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
                        return <Col span={item.imgs.length === (2 || 4) ? 12 : (item.imgs.length === 1 ? 24 : 8)}>
                          <Image className={item.imgs.length === (2 || 4) ? styles.pairImg: (item.imgs.length === 1 ? styles.oneImg : styles.nineImg)} src={url} />
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


