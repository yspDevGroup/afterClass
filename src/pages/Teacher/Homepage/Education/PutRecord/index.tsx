import { useState } from 'react';
import { history, useModel } from 'umi';
import { Row, Button, Form, Input, message } from 'antd';
import ListComponent from '@/components/ListComponent';
import ImagesUpload from '@/components/ImagesUpload';
import GoBack from '@/components/GoBack';
import { createKHKTFC } from '@/services/after-class/khktfc';
import styles from './index.less';
import MobileCon from '@/components/MobileCon';

const PutRecord = (props: any) => {
  const { bjid, data, jsid } = props.location.state;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [imgUrl, setImgUrl] = useState<any>('');

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const onFinish = async (values: any) => {
    const resKHKTFC = await createKHKTFC({
      NR: values.nr,
      TP: imgUrl,
      KHBJSJId: bjid,
      JZGJBSJId: jsid,
      XXJBSJId: currentUser?.xxId,
    });
    if (resKHKTFC.status === 'ok') {
      message.success('发布成功！');
      history.push('/teacher/home?index=education');
    } else {
      message.error(resKHKTFC.message);
    }
  };

  return (
    <MobileCon>
      <div className={styles.classroomStyle}>
        <GoBack title="发布" teacher onclick="/teacher/home?index=education" />
        <div className={styles.wrap}>
          <ListComponent listData={data} />
          <Form form={form} onFinish={onFinish}>
            <Form.Item name="nr" rules={[{ required: true, message: '请输入要发布的内容！' }]}>
              <TextArea
                showCount
                maxLength={255}
                placeholder={'快来分享课堂精彩瞬间~'}
                rows={6}
                bordered={false}
              />
            </Form.Item>
            <ImagesUpload
              onValueChange={(value: any) => {
                setImgUrl(value);
              }}
            />
          </Form>
        </div>
        <div className={styles.footer}>
          <Row justify="center">
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
      </div>
    </MobileCon>
  );
};
export default PutRecord;
