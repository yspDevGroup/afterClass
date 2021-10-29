import { Empty, Avatar, Image, Row, Col, Popconfirm, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import GoBack from '@/components/GoBack';
import { getAllKHKTFC, deleteKHKTFC } from '@/services/after-class/khktfc';
import noData from '@/assets/noData.png';
import styles from './index.less';

const Record = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [listData, setListData] = useState<any>();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log('listData:', listData);
  }, listData);

  const getData = async () => {

    const resKHKTFC = await getAllKHKTFC({});
    if (resKHKTFC.status === 'ok') {
      const allData: any = [];
      resKHKTFC.data?.rows?.forEach((item: any, index: number) => {
        const imgsArr = item.TP.split(';');
        imgsArr.pop();
        const data =  {
          id: item.id,
          className: item.KHBJSJ.KHKCSJ.KCMC,
          classNum: item.KHBJSJ.BJMC,
          content: item.NR,
          imgs: imgsArr,
          time: item.createdAt
        };
        allData.push(data);
      });
      Promise.all(allData).then((results)=>{
        setListData(results);
      });
    }

  }



  function cancel(e: any) {
    // console.log(e);
    // message.error('Click on No');
  }

  return (
    <div className={styles.ClassroomStyle}>
      <GoBack title="课堂风采" teacher onclick="/teacher/home?index=education" />
      <div className={styles.wrap}>
        {
          listData ? listData.map((item: any) => {
            return (
              <div className={styles.cards}>
                <p>
                <Avatar style={{ backgroundColor: '#0066FF', verticalAlign: 'middle' }} size="large">
                  {item.className.slice(0,1)}
                  </Avatar>
                  <div className={styles.name}>
                    <p>{item.className}</p>
                    <p>{item.classNum}</p>
                  </div>
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
                        }}
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

          }) : <Empty
          image={noData}
          style={{marginTop: '20px', borderRadius: '8px', minHeight: '300px',backgroundColor: '#fff',}}
          imageStyle={{
            height: 200,
          }}
          description={'暂无课堂风采记录'} />
        }
      </div>
    </div>
  );
};
export default Record;
