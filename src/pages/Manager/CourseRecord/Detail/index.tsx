import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Select, Button, Divider, Row, Col, Image, Empty } from 'antd';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';
import Style from './index.less';
import noData from '@/assets/noData.png';
import { getKHBJSJ } from '@/services/after-class/khbjsj';
import { getAllKHKTFC } from '@/services/after-class/khktfc';
import { getJZGJBSJ } from '@/services/after-class/jzgjbsj';


const AfterSchoolClass: React.FC = (props: any) => {
  const { state } = props.location;
  console.log('state: ', state);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [listData, setListData] = useState<any>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const resKHKTFC = await getAllKHKTFC({
      KHBJSJId: state.data.id,
    });
    if (resKHKTFC.status === 'ok') {
      const allData: any = [];
      resKHKTFC.data?.rows?.forEach((item: any, index: number) => {
        // const resJZGJBSJ = await getJZGJBSJ({ id: item.JZGJBSJId });
        // console.log('resJZGJBSJ: ', resJZGJBSJ);
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

  return (
    /// PageContainer组件是顶部的信息
    <PageContainer>
      <Button
        type="primary"
        onClick={() => {
          history.go(-1);
        }}
      >
        <LeftOutlined />
        返回上一页
      </Button>
      <Divider />
      <h3 style={{ fontWeight: 'bold' }}>{`${listData[0]?.className || '--'}/${listData[0]?.classNum || '--'}/${listData[0]?.teacherName || '--'}`}</h3>
      <div className={Style.container}>
        <ul>
          {
            listData.length ? listData.map((item: any) => {
              console.log('item: ', item);
              return (
                <li>
                  <Row>
                    <Col span={2} className={Style.time}>
                      <p className={Style.date}>{moment(item.time).format('MM-DD')}</p>
                      <p className={Style.hour}>{moment(item.time).format('HH:mm:ss')}</p>
                    </Col>
                    <Col span={22}>
                      <p className={Style.content}>{item.content}</p>
                      <Image.PreviewGroup>
                        {
                          item.imgs.map((url: string) => {
                            return <Image width={106}
                              height={78} style={{marginRight: 12}} src={url} />
                          })
                        }
                      </Image.PreviewGroup>
                    </Col>
                  </Row>
                </li>
              )
            }) : <Empty
              image={noData}
              style={{ marginTop: '20px', borderRadius: '8px', minHeight: '300px', backgroundColor: '#fff', }}
              imageStyle={{
                height: 200,
              }}
              description={'暂无课堂风采记录'} />
          }
        </ul>
      </div>
    </PageContainer>
  );
};
export default AfterSchoolClass;
