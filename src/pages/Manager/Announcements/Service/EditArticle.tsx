/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { useEffect } from 'react';
import { Row, Col, Divider, Form, Input, Button, Space, message } from 'antd';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import { history, useModel } from 'umi';
import styles from '../index.module.less';
import PageContainer from '@/components/PageContainer';
import { createXXTZGG, updateXXTZGG } from '@/services/after-class/xxtzgg';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
};

/**
 * 主组件
 *
 * @returns
 */
const EditArticle = (props: any) => {
  const { state } = props.location;
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const initialValues = {
    LX: '课后服务协议',
  };
  const submit = async (params: any) => {
    const { id, NR } = params;
    const data = {
      ...params,
      RQ: new Date(),
      BT: '课后服务协议',
      LX: '课后服务协议',
      SFTJ: 0,
      SFTT: 0,
      NR: NR.toHTML(),
      XXJBSJId: currentUser?.xxId,
    };
    try {
      if (typeof id === 'undefined') {
        const result = await createXXTZGG({
          ...data,
          ZT: '已发布',
        });
        if (result.status === 'ok') {
          message.success('保存成功');
          history.push('/announcements/service');
        } else {
          message.error('保存失败，请联系管理员或稍后再试。');
        }
      } else {
        const resUpdateXXTZGG = await updateXXTZGG({ id }, data);
        if (resUpdateXXTZGG.status === 'ok') {
          message.success('修改成功');
          history.push('/announcements/service');
        } else {
          message.error('修改失败，请联系管理员或稍后再试。');
        }
      }
    } catch (err) {
      message.error('保存失败，请联系管理员或稍后再试。');
    }
  };

  // 如果有id参数，说明是编辑文章，需要回填信息
  useEffect(() => {
    (() => {
      const initData = {
        ...state,
        NR: BraftEditor.createEditorState(state?.NR || ''),
      };
      form.setFieldsValue(initData);
    })();
  }, [state]);
  return (
    <PageContainer>
      <div className={styles.container}>
        <Form {...formItemLayout} form={form} initialValues={initialValues} onFinish={submit}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Divider orientation="left">协议内容</Divider>
          <Form.Item
            name="NR"
            rules={[
              {
                required: true,
                message: '请输入协议内容！',
              },
            ]}
          >
            <BraftEditor className="my-editor" placeholder="请输入协议内容" />
          </Form.Item>
          <Row justify="end">
            <Col>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={() => {
                      history.push('/basicalSettings/service');
                    }}
                  >
                    取消
                  </Button>
                </Space>
              </Form.Item>
            </Col>
            <Col span={1} />
          </Row>
        </Form>
      </div>
    </PageContainer>
  );
};
EditArticle.wrappers = ['@/wrappers/auth'];
export default EditArticle;
