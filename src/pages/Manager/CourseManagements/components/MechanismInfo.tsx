import React from 'react';
import { Drawer, Form, Input } from 'antd';
import UploadImage from '@/components/CustomForm/components/UploadImage';
import classes from './index.less';

/**
 * 机构详情
 * @returns
 */
const MechanismInfo = (props: {
  onMechanismInfoClose: any;
  visibleMechanismInfo: boolean;
  info: any;
}) => {
  const { onMechanismInfoClose, visibleMechanismInfo, info } = props;
  const disabled = true;

  return (
    <Drawer
      title="机构详情"
      placement="right"
      // closable={false}
      width={480}
      onClose={onMechanismInfoClose}
      visible={visibleMechanismInfo}
    >
      <Form initialValues={info} className={classes.forms} labelCol={{ span: 7, offset: 0 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item name="QYTB" key="QYTB" label="企业LOGO：">
          <UploadImage
            key="QYTBTP"
            imgWidth={80}
            imgHeight={80}
            imageurl={info?.QYTB}
            disabled={disabled}
            upurl="/api/upload/uploadFile?type=badge&plat=agency"
            accept=".jpg, .jpeg, .png"
            imagename="image"
          />
        </Form.Item>
        <Form.Item
          name="QYMC"
          key="QYMC"
          label="企业名称："
        >
          <Input placeholder={'——'} disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="LXRXM"
          key="LXRXM"
          label="联系人："
        >
          <Input placeholder={'——'} disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="LXDH"
          key="LXDH"
          label="联系电话："
        >
          <Input placeholder={'——'} disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="XD"
          key="XD"
          label="学段"
        >
          <Input disabled={disabled} placeholder="——" />
        </Form.Item>
        <Form.Item name="XZQ" key="XZQ" label="行政区域：">
          <Input disabled={disabled} placeholder="——" />
        </Form.Item>
        <Form.Item name="QYJGDZ" key="QYJGDZ" label="办公地址：">
          <Input placeholder={'——'} disabled={disabled} />
        </Form.Item>
        <Form.Item name="JGFWFW" key="JGFWFW" label="机构服务范围：">
          <Input placeholder={'——'} disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="ZZJGDM"
          key="ZZJGDM"
          label="统一社会信用代码："
        >
          <Input placeholder={'——'} disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="FRDBXM"
          key="FRDBXM"
          label="法人姓名："
        >
          <Input placeholder={'——'} disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="FRDBSFZH"
          key="FRDBSFZH"
          label="法人身份证号："
        >
          <Input placeholder={'——'} disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="YYZZ"
          key="YYZZ"
          label="营业执照："
        >
          <UploadImage
            key="YYZZTP"
            disabled={disabled}
            imageurl={info?.YYZZ}
            upurl="/api/upload/uploadFile?type=badge&plat=agency"
            accept=".jpg, .jpeg, .png"
            imagename="image"
          />
        </Form.Item>
        <Form.Item
          name="BXXKZ"
          key="BXXKZ"
          label="办学许可证："
        >
          <UploadImage
            key="BXXKZ"
            disabled={disabled}
            imageurl={info?.BXXKZ}
            upurl="/api/upload/uploadFile?type=badge&plat=agency"
            accept=".jpg, .jpeg, .png"
            imagename="image"
          />
        </Form.Item>
        <Form.Item name="JGJJ" key="JGJJ" label="机构简介：">
          <Input.TextArea placeholder={'——'} rows={4} disabled={disabled} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default MechanismInfo;
