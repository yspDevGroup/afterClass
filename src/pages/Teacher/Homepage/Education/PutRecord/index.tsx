import { useEffect, useState } from 'react';
import { history, useModel } from "umi";
import { getData } from '@/utils/utils';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { Empty, Row, Button, Form, Input, message } from 'antd';
import ListComponent from '@/components/ListComponent';
import ImagesUpload from '@/components/ImagesUpload';
import GoBack from '@/components/GoBack';
import { createKHKTFC } from '@/services/after-class/khktfc';
import noData from '@/assets/noCourses1.png';
import styles from './index.less';

const PutRecord = (props: any) => {
  const { bjid, data, jsid } = props.location.state;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [imgUrl, setImgUrl] = useState<any>('');

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  useEffect(() => {
    getData();
  }, []);

  const onFinish = async (values: any) => {
    const resKHKTFC = await createKHKTFC({
      NR: values.nr,
      TP: imgUrl,
      KHBJSJId: bjid,
      JZGJBSJId: jsid,
      XXJBSJId: currentUser?.xxId,
    });
    if(resKHKTFC.status === 'ok'){
      message.success('发布成功！');
      history.go(-1);
    }
  };

  return (
    <div className={styles.classroomStyle}>
      <GoBack title="发布" teacher onclick="/teacher/home?index=education" />
      <div className={styles.wrap}>
        <ListComponent listData={data} />
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="nr"
            rules={[{ required: true, message: '请输入要发布的内容！' }]}
          >
            <TextArea placeholder={'快来分享课堂精彩瞬间~'} rows={4} bordered={false} />
          </Form.Item>
          <ImagesUpload
            onValueChange={(value: any) => {
              setImgUrl(value);
            }}
          />
          <div className={styles.footer}>
            <Row justify="center" >
              <Button
                type="primary"
                ghost
                style={{ border: 'none', boxShadow: 'none' }}
                onClick={() => {
                  if (form) form.submit();
                }}
              >
                提交
              </Button>
            </Row>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default PutRecord;
