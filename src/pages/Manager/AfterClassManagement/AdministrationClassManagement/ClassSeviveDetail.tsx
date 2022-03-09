import React, { useState } from 'react';
import ProForm, { ModalForm } from '@ant-design/pro-form';
import { Col, Row, Spin, Tag } from 'antd';
import { getKHFWBJ } from '@/services/after-class/khfwbj';
import type { ModalValue } from './ConfigureService';
import UploadImage from '@/components/CustomForm/components/UploadImage';
import seviceImage from '@/assets/seviceImage.png';
import styles from './index.less';

type ClassSeviveDetailProps = {
  BJSJId: string;
  XNXQId: string;
};
const ClassSeviveDetail = (props: ClassSeviveDetailProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detailValue, setDetailValue] = useState<ModalValue>();
  const { BJSJId, XNXQId } = props;
  const getDetailValue = async () => {
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
          if (item.LX === 1) {
            KCFD.push({ label: item?.KHBJSJ?.BJMC, value: item?.KHBJSJ?.id });
          }
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
          FWTP: data?.FWTP,
          id: data?.id,
        });
      }
    }
    setLoading(false);
  };

  const formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };

  return (
    <Spin spinning={loading}>
      <ModalForm
        title={'服务详情'}
        trigger={
          <a
            onClick={() => {
              getDetailValue();
            }}
          >
            查看
          </a>
        }
        submitter={false}
        // className={styles.noModalFooter}
        modalProps={{
          destroyOnClose: true,
        }}
        layout="horizontal"
        {...formLayout}
      >
        <ProForm.Item
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 6 }}
          label="服务名称："
          name="FWMC"
        >
          {detailValue?.FWMC || ''}
        </ProForm.Item>

        <Row>
          <Col span={12}>
            <ProForm.Item
              label="简介："
              name="FWMC"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              {detailValue?.FWMC || ''}
            </ProForm.Item>
          </Col>
          <Col span={12}>
            <ProForm.Item
              label="服务图片"
              name="FWMC"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <UploadImage
                imageurl={detailValue?.FWTP || seviceImage}
                readonly={true}
                imagename="image"
              />
            </ProForm.Item>

            {/* <ProForm.Item
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                            name="FWTP"
                            key="FWTP"
                            label="服务图片"
                        >
                            {/* {detailValue} */}
            {/* {
                              detailValue?.FWTP &&<UploadImage
                              imageurl={detailValue.FWTP}
                              upurl="/api/upload/uploadFile?type=badge&plat=agency"
                              accept=".jpg, .jpeg, .png"
                              imagename="image"
                              />
                            }

                        </ProForm.Item> */}
          </Col>
        </Row>

        <ProForm.Item
          label="课后辅导："
          // rules={[{ required: true, message: '请选择课后辅导班' }]}
          name="KCFD"
          key="KCFD"
        >
          {detailValue?.KCFD?.length
            ? detailValue.KCFD.map((item: any) => <Tag>{item?.label}</Tag>)
            : '-'}
        </ProForm.Item>
        <ProForm.Item
          label="课后课程："
          // rules={[{ required: true, message: '请选择课程班' }]}
          name="KHKC"
          key="KHKC"
        >
          {detailValue?.KHKC?.length
            ? detailValue.KHKC.map((item: any) => <Tag>{item?.label}</Tag>)
            : '-'}
        </ProForm.Item>
        <ProForm.Item label="课程数限制">{detailValue?.KXSL || '-'}</ProForm.Item>
        <ProForm.Item label="服务费用">{detailValue?.FWFY || '-'}</ProForm.Item>
      </ModalForm>
    </Spin>
  );
};

export default ClassSeviveDetail;
