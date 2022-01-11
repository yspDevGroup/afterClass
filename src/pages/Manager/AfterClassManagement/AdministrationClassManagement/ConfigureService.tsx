import React, { useState, useRef, useEffect } from 'react';
import {
  ModalForm,
  ProFormDigit,
  ProFormList,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { Button, Col, message, Row, Space, Spin, DatePicker, Tag } from 'antd';
import SelectCourses from '../components/SelectCourses';
import ProForm, { ProFormSwitch, ProFormSelect } from '@ant-design/pro-form';
import styles from './index.less';
import UploadImage from '@/components/ProFormFields/components/UploadImage';
import { createKHFWBJ, getKHFWBJ, updateKHFWBJ } from '@/services/after-class/khfwbj';
import SignUpClass, { SelectType } from './SignUpClass';

import { getAllXXJTPZ } from '@/services/after-class/xxjtpz';
import moment from 'moment';
import { getAllKHFWSJ, updateKHFWSJ, createKHFWSJ } from '@/services/after-class/khfwsj';
const { RangePicker } = DatePicker;
import seviceImage from '@/assets/seviceImage.png';
import { getAllClasses } from '@/services/after-class/khbjsj';
import PromptInformation from '@/components/PromptInformation';

type ConfigureSeverType = {
  KHFWBJs: any[];
  XNXQId: string | undefined;
  // campusId: string,
  BJSJId: string;
  NJSJ: any;
  XQData?: any; //{JSRQ: "2021-12-29" KSRQ: "2021-08-30"}
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
  // KSRQ?: string/;
  // JSRQ?: string;
  timeFrames?: any;
};
const ConfigureService = (props: ConfigureSeverType) => {
  const { XNXQId, BJSJId, NJSJ, KHFWBJs, XQData, actionRef, XQSJId, key } = props;
  const [isTemplate, setIsTemplate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState('');
  const [detailValue, setDetailValue] = useState<ModalValue>();
  // 模板
  const [templateData, setTemplateData] = useState<any[]>();
  // 报名时段 数据
  const [BMSDData, setBMSDData] = useState<any[]>();

  const [templateId, setTemplateId] = useState<string>();
  const [JFLX, setJFLX] = useState<number>();
  const formRef = useRef();
  const signUpClassRef = useRef();

  const [informationOpen, setInformationOpen] = useState<boolean>(false);

  // 保存并报名
  const [saveFalg, setSaveFalg] = useState<boolean>(false);

  const formLayout = {
    labelCol: { flex: '7em' },
    wrapperCol: { flex: 'auto' },
  };

  // 获取排课时间配置
  const getDetailTimePZ = async () => {
    setLoading(true);
    const res = await getAllXXJTPZ({
      XNXQId: XNXQId,
      XQSJId: XQSJId,
    });
    if (res.status === 'ok') {
      if (res.data?.length === 0) {
        // message.warning('未配置时段请先配置报名信息')
        setInformationOpen(true);
      } else {
        const { sjpzstr } = res.data?.[0];
        if (sjpzstr) {
          const str = JSON.parse(sjpzstr);
          if (str) {
            setJFLX(str.JFLX);
            setBMSDData(str.list);
          }
        }
        setLoading(false);
      }
    }
  };
  const getDetailValue = async () => {
    if (BJSJId && XNXQId) {
      setLoading(true);
      const res = await getKHFWBJ({
        BJSJId,
        XNXQId,
      });
      if (res.status === 'ok') {
        const KCFD: any = [];
        const KHKC: any = [];
        const { data } = res;
        if (data) {
          data?.KCFWBJs?.forEach((item: any) => {
            console.log(item);
            // 1 辅导班
            if (item.LX === 1) {
              KCFD.push({ label: item?.KHBJSJ?.BJMC, value: item?.KHBJSJ?.id });
            }
            // 0 课程班
            if (item?.LX === 0) {
              KHKC.push({ label: item?.KHBJSJ?.BJMC, value: item?.KHBJSJ?.id });
            }
          });

          setDetailValue({
            isTemplate: false,
            KCFD,
            KHKC,
            KXSL: data?.KXSL,
            FWMC: data?.FWMC,
            FWFY: data?.FWFY,
            FWMS: data?.FWMS,
            id: data?.id,
            JFLX: data?.JFLX,
            // timeFrames,
          });

          if (data?.JFLX) {
            setJFLX(data?.JFLX);
          }
          if (data.FWTP) {
            setImageUrl(data.FWTP);
          }
        }
      }
      setLoading(false);
    }
  };

  const imageChange = (type: string, e?: any) => {
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

  // modal 提交
  const onFinish = async (values: ModalValue) => {
    setLoading(true);
    const KHBJSJIds: any[] = [];
    // KHBJSJIds=[ { KHBJSJId: '719ac8f1-192c-4bc4-840c-0f6d065d345e', LX: 1 },{KHBJSJId: 'f0bc43eb-2d6a-40cd-a80a-82d0596443d3', LX: 0}];
    // 辅导 1
    if (values?.KCFD) {
      values?.KCFD?.forEach((item: any) => {
        KHBJSJIds.push({ KHBJSJId: item.value, LX: 1 });
      });
    }
    // 课程班 0
    if (values?.KHKC) {
      values?.KHKC?.forEach((item: any) => {
        KHBJSJIds.push({ KHBJSJId: item.value, LX: 0 });
      });
    }
    // /** 缴费类型，0:按月缴费,1:自由缴费 */
    // JFLX?: number;
    // KSRQ?: string;
    // JSRQ?: string;
    // let KSRQ='';
    // let JSRQ='';

    const params: any = {
      BJSJId,
      XNXQId,
      ZT: 0,
      FWMC: values?.FWMC,
      FWTP: imageUrl,
      FWMS: values?.FWMS,
      FWFY: values?.FWFY,
      KXSL: values?.KXSL,
      JFLX,
      KSRQ: undefined,
      JSRQ: undefined,
      KHBJSJIds,
      RQs: undefined,
    };
    //  批量报名并且 发布课程
    if (saveFalg) {
      params.ZT = 1;
    }

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
    // 编辑
    if (detailValue?.id) {
      const res = await updateKHFWBJ({ id: detailValue?.id }, { ...params });
      if (res.status === 'ok') {
        message.success('修改成功');
        if (saveFalg) {
          signUpClassRef?.current?.onSetVisible(true);
        }
        if (actionRef && !saveFalg) {
          actionRef.current?.reloadAndRest();
        }
      } else {
        message.error(res.message);
      }
    } else {
      // 新增
      const res = await createKHFWBJ(params);
      if (res.status === 'ok') {
        message.success('配置成功');
        if (saveFalg) {
          signUpClassRef?.current?.onSetVisible(true);
        }
        if (actionRef && !saveFalg) {
          actionRef.current?.reloadAndRest();
        }
      } else {
        message.error(res.message);
      }
    }
    setLoading(false);
    return true;
  };

  const getData = async () => {
    if (XQSJId && XNXQId && NJSJ) {
      const res = await getAllKHFWSJ({
        XNXQId: XNXQId,
        XQSJId: XQSJId,
        NJSJIds: [NJSJ.id],
        FWZT: [1],
      });

      if (res.status === 'ok' && res.data) {
        setTemplateData(res.data?.rows);
      }
    }
  };

  useEffect(() => {
    if (detailValue) {
      formRef?.current?.setFieldsValue(detailValue);
    }
  }, [detailValue]);

  // 监听保存并报名
  useEffect(() => {
    if (saveFalg) {
      formRef?.current?.submit();
    }
  }, [saveFalg]);

  // 模板选择后
  const onTemplateChange = (value: string) => {
    setTemplateId(value);
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
      setDetailValue(v);
      if (data?.FWTP && data.FWTP !== '') {
        setImageUrl(data.FWTP);
      }
    }
  };
  // v true 更新 false 新建
  const onTemplateSave = (v: boolean = false) => {
    console.log('模板-----', formRef?.current);
    formRef?.current?.validateFields?.().then(async (values: ModalValue) => {
      const params: any = {
        FWMC: values?.FWMC,
        XQSJId,
        XNXQId,
        KHBJSJIds: values?.KHKC?.map((item: SelectType) => item.value),
        // NJIds,
        FWTP: imageUrl,
        FWMS: values?.FWMS,
        ZDKCS: values?.KXSL,
        FWFY: values?.FWFY,
      };

      // 更新
      if (v) {
        if (templateId) {
          const data = templateData?.find((item: any) => item.id === templateId);
          const { KHBJSJs } = data;
          let falg = true;
          // 获取模板课程数据 是否有改变
          if (KHBJSJs?.length) {
            const v1 = JSON.stringify(KHBJSJs.map((item: any) => item.id).sort());
            const v2 = JSON.stringify(params.KHBJSJIds.sort());
            falg = v1 === v2;
          }

          // 无改变
          if (falg) {
            const result = await updateKHFWSJ({ id: templateId }, params);
            if (result.status === 'ok') {
              message.success('更新成功');
              getData();
              return true;
            } else {
              message.warning(result.message);
              return false;
            }
          } else {
            message.warning('因课程班不匹配当前模板');
          }
        } else {
          message.error('未选择服务模板');
        }
      } else {
        params.NJIds = [NJSJ.id];
        params.FWZT = 1;
        const res = await createKHFWSJ(params);
        // console.log('==========')
        if (res.status === 'ok') {
          message.success('保存成功');
          getData();
          return true;
        } else {
          message.warning(res.message);
          return false;
        }
      }
    });
  };

  const getKHFD = async () => {
    const params: ModalValue = {
      FWFY: 140,
      KXSL: 2,
      isTemplate: false,
      KCFD: [],
      KHKC: [],
      FWMC: '',
      FWMS: '',
    };
    const res = await getAllClasses({
      XNXQId,
      ISFW: 1,
      BJZT: '已开班',
      KCTAG: '校内辅导',
      NJSJId: NJSJ?.id,
      BJSJId, // 行政班Id，
      page: 0,
      pageSize: 0,
      XQSJId: XQSJId,
    });
    if (res?.status === 'ok' && res?.data?.rows?.length) {
      params.KCFD = res.data.rows.map((item: any) => {
        return { value: item.id, label: item.BJMC };
      });
    }
    // 初始化表单
    setDetailValue(params);
    // // 默认先交费类型
    // setJFLX(0);
    // 请求模板
    getData();
  };

  return (
    <Spin spinning={loading}>
      <ModalForm<ModalValue>
        key={key}
        formRef={formRef}
        title={KHFWBJs?.length ? '编辑' : '配置课后服务'}
        trigger={
          <a
            type="link"
            onClick={() => {
              if (KHFWBJs.length) {
                getDetailValue();
                getData();
              } else {
                getKHFD();
              }
              getDetailTimePZ();
            }}
          >
            {KHFWBJs?.length ? '编辑' : '配置课后服务'}
          </a>
        }
        submitter={{
          searchConfig: {
            submitText: '保存',
            resetText: '取消',
          },
          render: (_props, defaultDoms) => {
            return [
              <div className={styles.modelFooter}>
                <Button
                  type="primary"
                  onClick={() => {
                    onTemplateSave();
                  }}
                  style={{ marginLeft: 0 }}
                >
                  {' '}
                  存为服务模板{' '}
                </Button>

                <div>
                  <Button
                    onClick={() => {
                      setSaveFalg(true);
                    }}
                  >
                    保存并批量报名
                  </Button>
                  {defaultDoms[1]}
                  {defaultDoms[0]}
                </div>
              </div>,
              // <Button type='primary' ghost> 存为服务模板 </Button>,
              // <Button >保存并批量报名</Button>,
              // ...defaultDoms
            ];
          },
        }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setIsTemplate(false);
          },
        }}
        onFinish={onFinish}
        layout="horizontal"
        {...formLayout}
      >
        <ProFormSwitch
          name="isTemplate"
          label="引用模板："
          initialValue={isTemplate}
          fieldProps={{
            onChange: (checked: boolean) => {
              setIsTemplate(checked);
            },
          }}
        />
        {isTemplate && (
          <Row justify="start">
            <Col span={12}>
              <ProFormSelect
                label="模板名称："
                name="text"
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
            <Col span={12} className={styles.ghostButton}>
              <Space>
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    onTemplateSave(true);
                  }}
                  style={{ marginLeft: '8px' }}
                >
                  更新模板
                </Button>
              </Space>
            </Col>
          </Row>
        )}
        <Row>
          <Col span={12}>
            <ProFormText
              label="服务名称："
              name="FWMC"
              rules={[{ required: true, message: '请输入服务名称' }]}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ProFormTextArea
              label="简介："
              rules={[{ required: false, message: '请输入班级课程安排' }]}
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
            <ProForm.Item name="FWTP" key="FWTP" label="服务图片">
              <UploadImage
                imageurl={imageUrl || seviceImage}
                upurl="/api/upload/uploadFile?type=badge&plat=agency"
                accept=".jpg, .jpeg, .png"
                imagename="image"
                handleImageChange={(value: any) => {
                  imageChange('ZP', value);
                }}
              />
            </ProForm.Item>
          </Col>
        </Row>

        <ProForm.Item
          label="课后辅导："
          rules={[{ required: false, message: '请选择课后辅导班' }]}
          name="KCFD"
          key="KCFD"
        >
          <SelectCourses
            title="选择辅导班"
            maxLength={50}
            getNJArr={() => {
              // 获取年级
              if (NJSJ) {
                return [NJSJ?.id];
              }
              return [];
            }}
            XNXQId={XNXQId}
            BJSJId={BJSJId}
            // 课程班=0 辅导班=1
            flag={1}
            XQSJId={XQSJId}
          />
        </ProForm.Item>
        <ProForm.Item
          label="课后课程："
          rules={[{ required: false, message: '请选择课程班' }]}
          name="KHKC"
          key="KHKC"
        >
          <SelectCourses
            title="选择课程班"
            maxLength={50}
            getNJArr={() => {
              // 获取年级
              if (NJSJ) {
                return [NJSJ?.id];
              }
              return [];
            }}
            XNXQId={XNXQId}
            // 课程班=0 辅导班=1
            flag={0}
            XQSJId={XQSJId}
          />
        </ProForm.Item>
        <Row justify="start" align="middle">
          <Col flex="14em">
            <ProFormDigit
              wrapperCol={{ flex: '6em' }}
              label="课程数限制"
              rules={[{ required: true, message: '请输入课程数限制' }]}
              name="KXSL"
              key="KXSL"
              min={1}
              max={50}
              width={80}
            />
          </Col>
          <Col flex="auto">
            <span style={{ color: '#999' }} className="ant-form-text ant-form-item">
              {' '}
              限制每个学生最大可选课后课程班数量
            </span>
          </Col>
        </Row>
        <div style={{ background: '#EFEFEF', padding: '16px 0', marginBottom: '24px' }}>
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
                  console.log('item', item);
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
        </div>

        <Row justify="start" align="middle">
          <Col flex="14em">
            <ProFormDigit
              wrapperCol={{ flex: '6em' }}
              label="服务费用"
              rules={[{ required: true, message: '请收入服务费用' }]}
              name="FWFY"
              key="FWFY"
              min={0}
              width={80}
              // width='xs'
            />
          </Col>
          <Col flex="auto">
            <span className="ant-form-text ant-form-item">{JFLX === 1 ? '元' : '元/月'}</span>
          </Col>
        </Row>
      </ModalForm>
      {XNXQId && BJSJId && (
        <SignUpClass
          ref={signUpClassRef}
          type={0}
          XNXQId={XNXQId}
          BJSJId={BJSJId}
          actionRef={actionRef}
        />
      )}
      <PromptInformation
        text="未查询到报名时段数据，请先设置报名时段"
        link="/afterClassManagement/registration_setting"
        open={informationOpen}
        colse={() => {
          setInformationOpen(false);
        }}
      />
    </Spin>
  );
};

export default ConfigureService;
