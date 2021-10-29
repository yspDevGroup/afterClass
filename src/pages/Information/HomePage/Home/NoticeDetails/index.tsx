import { Col, Row } from 'antd';
import { JYJGTZGG } from '@/services/after-class/jyjgtzgg';
import { useEffect, useState } from 'react';
import TopNav from './../components/TopNav'
import { XXTZGG } from '@/services/after-class/xxtzgg';

const NoticeDetails = (props: any) => {
  const { allDataSource, index, infoType } = props.location.state
  const [nrInfo, setNrInfo] = useState<any>();

  useEffect(() => {
    getData();
  }, [allDataSource[index].id])

  const getData = async () => {
    if(infoType === 'zc'){
      const result = await JYJGTZGG({ id: allDataSource[index].id });
      setNrInfo(result.data.NR);
    }else{
      const result = await XXTZGG({ id: allDataSource[index].id });
      setNrInfo(result.data.NR);
    }


  }

  return (
    <div>
      <TopNav />
      <div style={{padding: '65px 10px' }}>
        <Row gutter={[0, 32]}>
          <Col span={20} offset={2}>
            <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>{allDataSource[index].BT}</h2>
          </Col>
        </Row>
        <Row gutter={[0, 32]}>
          <Col span={10} offset={7}>
            {allDataSource[index].RQ || allDataSource[index].createdAt}
          </Col>
        </Row>
        <Row gutter={[0, 32]}>
          <Col span={20} offset={2}>
            <div dangerouslySetInnerHTML={{ __html: nrInfo }}></div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default NoticeDetails;
