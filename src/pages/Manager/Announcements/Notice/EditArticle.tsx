/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Divider,
  Form,
  Input,
  Select,
  Switch,
  DatePicker,
  Button,
  Space,
  message,
} from 'antd';
import dayjs from 'dayjs';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import { history, useModel } from 'umi';
import styles from '../index.module.less';
import PageContainer from '@/components/PageContainer';
import { createXXTZGG, XXTZGG, updateXXTZGG } from '@/services/after-class/xxtzgg';
import { LeftOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

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
const EditArticle = () => {
  const [id, setId] = useState<string | undefined>(); // 文章ID
  const [pubStatus, setPubStatus] = useState<'草稿' | '已发布' | '已删除' | string>('草稿'); // 发布状态，用于控制表单是否可提交
  const [stateImg, setstateImg] = useState<any>();
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const initialValues = {
    LX: '0',
    BH: 10,
    RQ:moment(new Date()),
    LY: '本站原创',
    SFTT: false,
    SFTJ: false,
  };
  const submit = async (params: any) => {
    const { NR, RQ, SFTT, SFTJ } = params;
    const data = {
      ...params,
      RQ: RQ.format(),
      SFTJ: SFTJ === true ? 1 : SFTJ,
      SFTT: SFTT === true ? 1 : SFTT,
      NR: NR.toHTML(),
      TP: stateImg || '',
      XXJBSJId: currentUser?.xxId,
    };
    try {
      if (typeof id === 'undefined') {
        const result = await createXXTZGG(data);
        if (result.status === 'ok') {
          message.success('保存成功');
          history.push('/announcements/Notice');
        } else {
          message.error('保存失败，请联系管理员或稍后再试。');
        }
      } else {
        const resUpdateXXTZGG = await updateXXTZGG({ id }, data);
        if (resUpdateXXTZGG.status === 'ok') {
          message.success('修改成功');
          history.push('/announcements/Notice');
        } else {
          message.error('修改失败，请联系管理员或稍后再试。');
        }
      }
    } catch (err) {
      message.error('保存失败，请联系管理员或稍后再试。');
    }
  };

  useEffect(() => {
    // 判断url中是否有id
    const url = new URL(window.location.href);
    const editId = url.searchParams.get('id');
    if (editId && !id) {
      setId(editId);
    }
  }, [id]);

  // 如果有id参数，说明是编辑文章，需要回填信息
  useEffect(() => {
    (async () => {
      try {
        if (id) {
          const result = await XXTZGG({ id });
          if (result.status === 'ok') {
            const { data } = result;
            const initData = {
              ...data,
              RQ: moment(data.RQ),
              NR: BraftEditor.createEditorState(data.NR),
            };
            form.setFieldsValue(initData);
            setPubStatus(data!.ZT!);
            setstateImg(data!.TP!);
          } else {
            message.error('获取文章内容失败，请联系管理员或稍后再试。');
          }
        }
      } catch (err) {
        message.error('获取文章内容失败，请联系管理员或稍后再试。');
      }
    })();
  }, [id]);

  const disabled = pubStatus !== '草稿';
  return (
    <PageContainer>
     <>
      <Button
        type="primary"
        onClick={() => {
          history.goBack();
        }}
      >
        <LeftOutlined />
        返回上一页
        </Button>
      <div className={styles.container}>
        <Form {...formItemLayout} form={form} initialValues={initialValues} onFinish={submit}>
          <Divider orientation="left">文章属性</Divider>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Row>
            <Col className="gutter-row" sm={12} xs={24}>
              <Form.Item
                name="BT"
                label="文章标题："
                rules={[
                  {
                    required: true,
                    message: '请输入文章标题！',
                  },
                ]}
              >
                <Input placeholder="请输入" disabled={disabled} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" sm={12} xs={24}>
              <Form.Item name="FBT" label="副标题：">
                <Input disabled={disabled} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" sm={12} xs={24}>
              <Form.Item name="GJC" label="关键词：">
                <Input disabled={disabled} />
              </Form.Item>
            </Col>

            <Col className="gutter-row" sm={6} xs={12}>
              <Form.Item
                name="LX"
                label="文章类型："
                labelCol={{ sm: { span: 8 } }}
                rules={[
                  {
                    required: true,
                    message: '请选择文章类型！',
                  },
                ]}
              >
                <Select disabled={disabled}>
                  <Option value='0'>校内通知</Option>
                  <Option value='1'>报名通知</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" sm={6} xs={12}>
              <Form.Item name="BH" label="排序值：" labelCol={{ sm: { span: 8 } }}>
                <Input disabled={disabled} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" sm={12} xs={24}>
              <Form.Item name="ZY" label="文章摘要：">
                <Input.TextArea
                  placeholder="说点什么..."
                  showCount
                  maxLength={200}
                  rows={4}
                  disabled={disabled}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" sm={6} xs={12}>
              <Form.Item
                name="RQ"
                label="时间："
                labelCol={{ sm: { span: 8 } }}
                rules={[
                  {
                    required: true,
                    message: '请选择时间！',
                  },
                ]}
              >
                <DatePicker showTime disabled={disabled} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" sm={6} xs={12}>
              <Form.Item name="LY" label="来源：" labelCol={{ sm: { span: 8 } }}>
                <Input disabled={disabled} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
          <Col className="gutter-row" sm={6} xs={12}>
              <Form.Item name="ZZ" label="作者：" labelCol={{ sm: { span: 8 } }}>
                <Input disabled={disabled} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" sm={3} xs={6} style={{ minWidth: '142px' }}>
              <Form.Item
                name="SFTT"
                label="是否头条："
                valuePropName="checked"
                labelCol={{ sm: { span: 16 } }}
              >
                <Switch disabled={disabled} />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">文章内容</Divider>
          <Form.Item
            name="NR"
            rules={[
              {
                required: true,
                message: '请输入正文内容！',
              },
            ]}
          >
            <BraftEditor
              className="my-editor"
              placeholder="请输入正文内容"
              // media={{
              //   uploadFn: upload
              // }}
            />
          </Form.Item>
          <Row justify="end">
            <Col>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={() => {
                      history.goBack();
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
      </>
    </PageContainer>
  );
};
EditArticle.wrappers = ['@/wrappers/auth'];
export default EditArticle;
