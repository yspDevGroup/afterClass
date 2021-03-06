/*
 * @description: 批量配置课后服务
 * @author: zpl
 * @Date: 2022-02-15 09:11:42
 * @LastEditTime: 2022-02-15 10:18:21
 * @LastEditors: zpl
 */
import React, { useState, useRef, useEffect } from 'react';
import { ModalForm } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import { Button, Col, message, Row, Spin, Card } from 'antd';
import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import { getAllBJSJNoKHFW } from '@/services/after-class/bjsj';
import { getAllXXJTPZ } from '@/services/after-class/xxjtpz';
import { getAllKHFWSJ } from '@/services/after-class/khfwsj';
import PromptInformation from '@/components/PromptInformation';
import { getGradesByCampus } from '@/services/after-class/njsj';
import { bulkCreateKHFWBJ } from '@/services/after-class/khfwbj';
import styles from './index.less'

type ConfigureSeverType = {
  XNXQId: string | undefined;
  actionRef: any;
  XQSJId?: string;
  key: string;
};
export type ModalValue = {
  isTemplate: boolean;
  KCFD?: any[];
  KHKC: any[];
  KXSL: number;
  FWMC: string;
  FWFY: number;
  FWMS: string;
  id?: string;
  FWTP?: string;
  JFLX?: number;
  BJSJIds?: any;
};
/**
 * 批量配置课后服务
 *
 * @param {ConfigureSeverType} props
 * @return {*}
 */
const ConfigureServiceBatch = (props: ConfigureSeverType) => {
  const { XNXQId, actionRef, XQSJId, key } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState('');
  const [detailValue, setDetailValue] = useState<ModalValue>();
  // 模板
  const [templateData, setTemplateData] = useState<any[]>();
  // 报名时段 数据
  const [BMSDData, setBMSDData] = useState<any[]>();

  // const [templateId, setTemplateId] = useState<string>();
  const [JFLX, setJFLX] = useState<number>();

  const [NjId, setNjId] = useState<string>();
  const [NjData, setNjData] = useState<any>();
  const [BjData, setBjData] = useState<any>();

  const formRef = useRef<ProFormInstance<ModalValue>>();

  const [informationOpen, setInformationOpen] = useState<boolean>(false);

  const formLayout = {
    labelCol: { flex: '7em' },
    wrapperCol: { flex: 'auto' },
  };

  // 获取排课时间配置
  const getDetailTimePZ = async () => {
    setLoading(true);
    const res = await getAllXXJTPZ({
      XNXQId,
      XQSJId,
    });
    if (res.status === 'ok') {
      if (res.data?.length === 0) {
        // message.warning('未配置时段请先配置报名信息')
        setInformationOpen(true);
      } else {
        const { sjpzstr } = res.data?.[0];
        if (sjpzstr) {
          const str = JSON.parse(sjpzstr);
          if (str.list?.find((item: any) => item?.isEnable === 1) === undefined) {
            setBMSDData([]);
            setJFLX(str.JFLX);
            setInformationOpen(true);
          } else {
            setJFLX(str.JFLX);
            setBMSDData(str.list);
          }
        }
        setLoading(false);
      }
    }
  };
  // 获取年级数据
  const getNJSJ = async () => {
    if (XQSJId) {
      const res = await getGradesByCampus({
        XQSJId,
      });
      if (res.status === 'ok') {
        setNjData(res.data);
      }
    }
  };
  // 获取班级
  const getBJSJ = async () => {
    const res = await getAllBJSJNoKHFW({
      XQSJId,
      njId: NjId,
      page: 0,
      pageSize: 0,
      XNXQId,
    });
    if (res.status === 'ok') {
      const data = res.data?.rows?.map((item: any) => {
        return { label: item.BJ, value: item.id };
      });
      setBjData(data);
    }
  };

  const getData = async () => {
    if (XQSJId && XNXQId && NjId) {
      const res = await getAllKHFWSJ({
        XNXQId,
        XQSJId,
        NJSJIds: [NjId],
        FWZT: [1],
      });

      if (res.status === 'ok' && res.data) {
        setTemplateData(res.data?.rows);
      }
    }
  };
  useEffect(() => {
    if (NjId) {
      getBJSJ();
      getData();
    }
  }, [NjId]);

  // modal 提交
  const onFinish = async (values: ModalValue) => {
    if (detailValue) {
      setLoading(true);

      const KHBJSJIds: any[] = [];

      if (detailValue?.KHKC) {
        detailValue?.KHKC?.forEach((item: any) => {
          KHBJSJIds.push({ KHBJSJId: item.value, LX: 0 });
        });
      }

      const params: any = {
        XQSJId,
        BJSJIds: values?.BJSJIds,
        XNXQId,
        ZT: 0,
        FWMC: detailValue?.FWMC,
        FWTP: imageUrl,
        FWMS: detailValue?.FWMS,
        FWFY: detailValue?.FWFY,
        KXSL: detailValue?.KXSL,
        JFLX,
        KHBJSJIds,
        RQs: undefined,
      };

      params.RQs = BMSDData?.filter((item: any) => {
        // 缴费方式是月
        if (JFLX === 0 && item.type === JFLX && item.isEnable === 1) {
          return true;
        }
        if (JFLX === 1) {
          return item.type === JFLX;
        }
        return false;
      }).map((item: any) => {
        return { KSRQ: item.KSRQ, JSRQ: item.JSRQ, SDBM: item.name };
      });

      // 新增
      const res = await bulkCreateKHFWBJ(params);
      if (res.status === 'ok') {
        message.success('配置成功');
        setDetailValue(undefined);
        if (actionRef) {
          actionRef.current?.reloadAndRest();
        }
      } else {
        message.error(res.message);
      }

      setLoading(false);
    }
    return true;
  };

  // 模板选择后
  const onTemplateChange = (value: string) => {
    // setTemplateId(value);
    if (value) {
      const data = templateData?.find((item: any) => item.id === value);
      const v: ModalValue = {
        isTemplate: true,
        FWMC: data?.FWMC,
        FWMS: data?.FWMS,
        FWFY: data?.FWFY,
        KXSL: data?.ZDKCS,
        // KCFD,
        KHKC:
          data?.KHBJSJs?.map((item: any) => {
            return { label: item?.BJMC, value: item?.id };
          }) || [],
      };
      console.log(v, '------------')
      setDetailValue(v);
      if (data?.FWTP && data.FWTP !== '') {
        setImageUrl(data.FWTP);
      }
    } else {
      setDetailValue(undefined);
    }
  };

  return (
    <Spin spinning={loading}>
      <ModalForm<ModalValue>
        key={key}
        formRef={formRef}
        title="批量配置课后服务"
        trigger={
          <Button
            type="primary"
            onClick={() => {
              getDetailTimePZ();
              getNJSJ();
            }}
          >
            批量配置课后服务
          </Button>
        }
        submitter={{
          searchConfig: {
            submitText: '保存',
            resetText: '取消',
          },
        }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setDetailValue(undefined);
          },
        }}
        onFinish={onFinish}
        layout="horizontal"
        {...formLayout}
        width={650}
        className={styles.KHFWmodal}
      >
        <Row justify="start">
          <Col span={24}>
            <ProFormSelect
              label="所属年级"
              name="NJId"
              placeholder="请选择年级"
              rules={[{ required: true, message: '请选择所属年级' }]}
              fieldProps={{
                options: NjData?.map((item: any) => {
                  return { value: item?.id, label: `${item.XD}${item.NJMC}` };
                }),
                onChange: (value: string) => {
                  setNjId(value);
                  formRef?.current?.setFieldsValue({ BJSJIds: undefined });
                  setDetailValue(undefined);
                  // setTemplateId(undefined);
                },
                allowClear: true,
              }}
            />
          </Col>
        </Row>
        <Row justify="start">
          <Col span={24}>
            <ProFormSelect
              label="行政班级"
              name="BJSJIds"
              rules={[{ required: true, message: '请选择行政班' }]}
              placeholder="请选择行政班"
              fieldProps={{
                options: BjData,
                allowClear: true,
                mode: 'multiple',
              }}
            />
          </Col>
        </Row>
        <Row justify="start">
          <Col span={24}>
            <ProFormSelect
              label="选择模板："
              rules={[{ required: true, message: '请选择模板' }]}
              name="templateId"
              placeholder="请选择服务模板"
              fieldProps={{
                options: templateData?.map((item: any) => {
                  return { value: item?.id, label: item?.FWMC };
                }),
                onChange: onTemplateChange,
                allowClear: true,
              }}
            />
          </Col>
        </Row>
        {detailValue && (
          <Row wrap={false}>
            <Col flex={'7em'} />
            <Col flex={'auto'}>
              <Card title={'服务模板详情'} size="small" bordered>
                <Row wrap={false} style={{ padding: '24px 0' }}>
                  <Col span={12}>
                    <Row wrap={false}>
                      <Col flex="7em" style={{ textAlign: 'end' }}>
                        课程数限制：
                      </Col>
                      <Col flex="auto">{detailValue?.KXSL || '-'}门</Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row wrap={false}>
                      <Col flex="7em" style={{ textAlign: 'end' }}>
                        服务费用：
                      </Col>
                      <Col flex="auto">
                        {detailValue?.FWFY || '-'}
                        {detailValue?.JFLX ? '元/月' : '元/次'}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col flex="6em" style={{ textAlign: 'end' }}>
                    课后课程：
                  </Col>
                  <Col flex="auto">
                    {
                      detailValue?.KHKC.map((value: any) => {
                        return `${value?.label} `
                      })
                    }
                  </Col>
                </Row>
                <Row>
                  <Col flex="6em" style={{ textAlign: 'end' }}>
                    服务简介：
                  </Col>
                  <Col flex="auto">
                    {detailValue?.FWMC || ''}
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}
      </ModalForm>

      <PromptInformation
        text="未查询到报名时段数据，请先设置报名时段"
        link="/afterClassManagement/registration_setting"
        open={informationOpen}
        closeType={true}
        colse={() => {
          setInformationOpen(false);
        }}
      />
    </Spin>
  );
};

export default ConfigureServiceBatch;
