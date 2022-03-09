/* eslint-disable no-else-return */
/* eslint-disable no-lonely-if */
/* eslint-disable @typescript-eslint/no-shadow */
/*
 * @description:
 * @author: Wu Zhan
 * @Date: 2021-12-14 08:59:02
 * @LastEditTime: 2022-02-09 15:27:04
 * @LastEditors: zpl
 */

import React, { useState, useEffect, useRef } from 'react';
import { useModel } from 'umi';
import { Button, Col, message, Row, Select, Space, Tag } from 'antd';
import ProForm, {
  ModalForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { createKHFWSJ, getKHFWSJ, updateKHFWSJ } from '@/services/after-class/khfwsj';
import { getGradesByCampus } from '@/services/after-class/njsj';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import UploadImage from '@/components/ProFormFields/components/UploadImage';
import SelectCourses from './SelectCourses';
import styles from './index.less';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getAllXXJTPZ } from '@/services/after-class/xxjtpz';

type ServiceBasicsType = {
  title: string;
  reload: () => Promise<void>;
  serviceId?: string;
  type?: string;
};

const SeveiceBasics = (props: ServiceBasicsType) => {
  const { title, reload, serviceId, type } = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [campusId, setCampusId] = useState<string>();
  const [campusData, setCampusData] = useState<any[]>();
  const [NJData, setNJData] = useState<any[]>();
  const [XNXQData, setXNXQData] = useState<any[]>();
  const [XNXQId, setXNXQId] = useState<string>();
  const [imageUrl, setImageUrl] = useState('');
  const [JFLX, setJFLX] = useState<number>();
  // 报名时段 数据
  const [BMSDData, setBMSDData] = useState<any[]>();

  const formRef = useRef<any>();

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };
  //  获取校区
  const getCampusData = async () => {
    const res = await getAllXQSJ({
      XXJBSJId: currentUser?.xxId,
    });
    if (res?.status === 'ok') {
      const arr = res?.data?.map((item: any) => {
        return {
          label: item?.XQMC,
          value: item?.id,
        };
      });

      setCampusData(arr);
    }
  };
  // 获取排课时间配置
  const getDetailTimePZ = async () => {
    const res = await getAllXXJTPZ({
      XNXQId,
      XQSJId: campusId,
    });
    if (res.status === 'ok') {
      if (res.data?.length !== 0) {
        const { sjpzstr } = res.data?.[0];
        if (sjpzstr) {
          const str = JSON.parse(sjpzstr);
          if (str.list?.find((item: any) => item?.isEnable === 1) === undefined) {
            setBMSDData([]);
            setJFLX(str.JFLX);
          } else {
            setJFLX(str.JFLX);
            setBMSDData(str.list);
          }
        }
      }
    }
  };

  // 学年学期
  const getXNXQData = async () => {
    const res = await queryXNXQList(currentUser?.xxId);
    console.log(res, 'res---------')
    const { current } = res;
    // console.log('res', res)
    if (current) {
      setXNXQData(
        res?.xnxqList.map((item: any) => {
          return { value: item.value, label: item.text };
        }),
      );
      setXNXQId(current?.id);
    }
  };

  // 获取年级
  /**
   *
   * @param value 校区Id
   * @returns
   */
  const getNJData = async (value: string) => {
    const res = await getGradesByCampus({
      XQSJId: value,
    });
    if (res?.status === 'ok') {
      const list = res?.data?.map((item: any) => {
        return { label: `${item.XD}${item.NJMC}`, value: item.id };
      });
      setNJData(list);
    }
  };

  useEffect(() => {
    getCampusData();
    getXNXQData();
    getDetailTimePZ();
  }, []);
  useEffect(() => {
    getDetailTimePZ();
  }, [campusId]);
  const imageChange = (_type: string, e?: any) => {
    if (e.file.status === 'done') {
      const mas = e.file.response.message;
      if (typeof e.file.response === 'object' && e.file.response.status === 'error') {
        message.error(`上传失败，${mas}`);
      } else {
        const res = e.file.response;
        if (res.status === 'ok') {
          message.success(`上传成功`);
          setImageUrl(res.data);
        }
      }
    } else if (e.file.status === 'error') {
      const mass = e.file.response.message;
      message.error(`上传失败，${mass}`);
    }
  };
  const handleSubmit = async (values: any) => {
    const { FWMC, XQSJId, XNXQId, KHKC, NJIds, FWMS, ZDKCS, FWFY } = values;
    let KHKCIds: any[];
    if (KHKC) {
      KHKCIds = [].map.call(KHKC, (val: { value: string }) => {
        return val.value as string;
      });
    } else {
      KHKCIds = [];
    }

    const params = {
      FWMC,
      XQSJId,
      XNXQId,
      KHBJSJIds: KHKCIds,
      NJIds,
      FWTP: imageUrl,
      FWMS,
      ZDKCS,
      FWFY,
    };

    if (serviceId) {
      const result = await updateKHFWSJ({ id: serviceId }, params);
      if (result.status === 'ok') {
        message.success('修改成功');
        reload();
        return true;
      } else {
        message.warning(result.message);
        return false;
      }
    } else {
      const res = await createKHFWSJ(params);
      if (res.status === 'ok') {
        message.success('提交成功');
        reload();
        return true;
      } else {
        message.warning(res.message);
        return false;
      }
    }
  };
  const handleRefile = async () => {
    if (serviceId) {
      const res = await getKHFWSJ({ id: serviceId });
      if (res.status === 'ok' && res.data) {
        const { FWFY, FWMC, FWMS, FWTP, XNXQId, ZDKCS, XQSJId, NJSJs, KHBJSJs } = res.data;
        let NJIds: any[] = [];
        let KHKC: any[] = [];
        if (FWTP) setImageUrl(FWTP);
        if (XQSJId) getNJData(XQSJId);
        if (NJSJs?.length) {
          NJIds = [].map.call(NJSJs, (v: { id: string }) => {
            return v.id as string;
          });
        }
        if (KHBJSJs?.length) {
          KHKC = [].map.call(KHBJSJs, (v: { id: string; BJMC: string }) => {
            return {
              value: v.id,
              label: v.BJMC,
            };
          });
        }
        setCampusId(XQSJId);
        formRef?.current?.setFieldsValue({
          FWMC,
          XQSJId,
          XNXQId,
          KHKC,
          NJIds,
          FWTP,
          FWMS,
          ZDKCS,
          FWFY,
        });
      }
    } else {
      console.log(formRef, 'formRef')
      console.log(campusData, 'campusData--++++++++++++++++++++++++++---')
      if (campusData?.length) {
        let id = campusData?.find((item: any) => item?.label === '本校')?.value;
        if (!id) {
          id = campusData[0].value;
        }
        getNJData(id);
        await setCampusId(id);
        formRef?.current?.setFieldsValue({
          ZDKCS: 2,
          XQSJId: id,
          XNXQId
        });
      }
      formRef?.current?.setFieldsValue({
        ZDKCS: 2,
        XNXQId
      });
    }
  };
  console.log(formRef, 'formRef----------')
  console.log(campusData, 'campusData----------')
  return (
    <>
      <ModalForm<{
        name: string;
        company: string;
      }>
        key={serviceId}
        formRef={formRef}
        title={title}
        submitter={!type}
        trigger={
          <Button
            type={serviceId ? 'link' : 'primary'}
            onClick={handleRefile}
            icon={serviceId ? '' : <PlusOutlined />}
          >
            {serviceId ? (type ? '查看' : '编辑') : '新增模板'}
          </Button>
        }
        modalProps={{
          destroyOnClose: true,
          // onCancel: () => console.log('run'),
        }}
        onFinish={handleSubmit}
        layout="horizontal"
        className={type ? `${styles.newModules} ${styles.noModalFooter}` : `${styles.newModules}`}
        {...formLayout}
      >
        <Row>
          <Col span={12}>
            <ProFormText
              label="服务模板"
              name="FWMC"
              readonly={!!type}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              rules={[{ required: true, message: '请填写服务模板' }]}
            />
          </Col>
          <Col span={12}>
            <ProForm.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              name="XQSJId"
              key="XQSJId"
              label="所属校区"
              rules={[{ required: true, message: '请选择所属校区' }]}
            >
              <Select
                placeholder="请选择校区"
                options={campusData}
                disabled={!!type}
                onChange={(value: string) => {
                  setCampusId(value);
                  getNJData(value);
                }}
              />
            </ProForm.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ProForm.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              name="XNXQId"
              key="XNXQId"
              label="适用学期"
              rules={[{ required: true, message: '请选择适用学期' }]}
            >
              <Select placeholder="请选择" disabled={!!type} options={XNXQData} />
            </ProForm.Item>
          </Col>
          <Col span={12}>
            <ProForm.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              name="NJIds"
              key="NJIds"
              label="适用年级"
              rules={[{ required: true, message: '请选择适用年级' }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择"
                disabled={!!type}
                options={NJData}
                onChange={(value) => {
                  formRef?.current?.setFieldsValue({
                    KHKC: undefined
                  })
                }}
              />
            </ProForm.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ProFormTextArea
              label="简介："
              rules={[{ required: false, message: '请输入班级课程安排' }]}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              readonly={!!type}
              name="FWMS"
              key="FWMS"
              placeholder="请输入班级课程安排"
              fieldProps={{
                autoSize: { minRows: 4, maxRows: 5 },
                showCount: true,
                maxLength: 200,
              }}
            />
          </Col>
          <Col span={12}>
            <ProForm.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              name="FWTP"
              key="FWTP"
              label="服务图片"
            >
              <UploadImage
                imageurl={imageUrl}
                upurl="/api/upload/uploadFile?type=badge&plat=agency"
                accept=".jpg, .jpeg, .png"
                imagename="image"
                width={160}
                height={100}
                readonly={!!type}
                handleImageChange={(value: any) => {
                  imageChange('ZP', value);
                }}
              />
            </ProForm.Item>
          </Col>
        </Row>
        <ProForm.Item
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          name="KHKC"
          key="KHKC"
          label="课后课程"
          rules={[{ required: false, message: '请选择课后课程' }]}
        >
          <SelectCourses
            title="选择课程班"
            maxLength={50}
            disabled={!!type}
            getNJArr={() => {
              // 获取年级
              // console.log('NJIDS',formRef?.current?.getFieldValue('NJIds'))
              return formRef?.current?.getFieldValue('NJIds');
            }}
            XNXQId={XNXQId}
            // 课程班=0 辅导班=1
            flag={0}
            XQSJId={campusId}
          />
        </ProForm.Item>

        <Row wrap={false} justify="center" align="top">
          <Col flex="none">
            <ProFormDigit
              labelCol={{ flex: 'none' }}
              wrapperCol={{ span: 'auto' }}
              label="课程数限制:"
              rules={[{ required: true, message: '请输入课程数限制' }]}
              name="ZDKCS"
              key="ZDKCS"
              min={1}
              max={50}
              disabled={!!type}
              width="xs"
            />
          </Col>
          <Col flex="auto">
            <span
              style={{ color: '#999', marginLeft: '9px', height: '32px', lineHeight: '32px' }}
              className="ant-form-text"
            >
              {' '}
              限制每个学生最大可选课后课程班数量
            </span>
          </Col>
        </Row>
        {
          BMSDData?.length !== 0 ? <div style={{ background: '#EFEFEF', padding: '16px 0', marginBottom: '24px' }}>
            <Row wrap={false} style={{ paddingBottom: '16px' }}>
              <Col flex={'7em'} style={{ textAlign: 'end', color: '#222222' }}>
                收费方式：
              </Col>
              <Col flex="auto">
                <Space style={{ width: '100%' }}>
                  <span>{JFLX === 0 ? '按月缴费' : '自定义时段收费'}</span>
                  <span style={{ color: '#3E88F8' }}>
                    配置生效前可在“课后服务 — 报名设置”中统一维护
                  </span>
                </Space>
              </Col>
            </Row>
            <Row wrap={false}>
              <Col flex={'7em'} style={{ textAlign: 'end', color: '#222222' }}>
                报名时段：
              </Col>
              <Col flex="auto">
                <Space wrap style={{ width: '100%' }}>
                  {BMSDData?.filter((item: any) => {
                    // 缴费方式是月
                    if (JFLX === 0 && item.type === JFLX && item.isEnable === 1) {
                      return true;
                    }
                    if (JFLX === 1) {
                      return item.type === JFLX;
                    }
                    return false;
                  }).map((item: any) => {
                    return (
                      <Tag>
                        <span style={{ fontSize: '16px' }}>{item.name}</span>
                        <span style={{ color: '#999' }}>
                          {' '}
                          {`${moment(item.KSRQ).format('MM-DD')}~${moment(item.JSRQ).format(
                            'MM-DD',
                          )}`}
                        </span>
                        {/* {`${item.name} ${moment(item.KSRQ).format('MM-DD')}~${moment(item.KSRQ).format('MM-DD')}`} */}
                      </Tag>
                    );
                  })}
                </Space>
              </Col>
            </Row>
          </div> : <></>
        }

        <ProFormDigit
          label="服务费用:"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          rules={[{ required: true, message: '请输入服务费用' }]}
          disabled={!!type}
          width="xs"
          name="FWFY"
          key="FWFY"
          min={0}
        />
      </ModalForm>
    </>
  );
};

export default SeveiceBasics;
