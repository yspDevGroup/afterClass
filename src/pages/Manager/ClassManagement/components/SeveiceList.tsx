/*
 * @description:
 * @author: Wu Zhan
 * @Date: 2021-12-14 08:59:02
 * @LastEditTime: 2022-02-09 15:30:21
 * @LastEditors: zpl
 */

import React, { useRef, useState } from 'react';
import { Button } from 'antd';
import { ModalForm } from '@ant-design/pro-form';
import { getNJbyKHBJSJId } from '@/services/after-class/khbjsj';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import styles from '../index.less';
type ServiceBasicsType = {
  title: string;
  bjId: string;
  termId: string;
};

const SeveiceList = (props: ServiceBasicsType) => {
  const { title, bjId, termId } = props;

  const formRef = useRef();
  const [dataSource, setDataSource] = useState<any>();
  const [subTitle, setSubTitle] = useState<string>();
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
    },
    {
      title: '服务名称',
      dataIndex: 'FWMC',
      key: 'FWMC',
      align: 'center',
      width: 160,
      render: (test: any, record: any) => {
        return `${record.KHFWBJ?.FWMC}`;
      },
    },
    {
      title: '所属行政班',
      dataIndex: 'NJMC',
      key: 'NJMC',
      align: 'center',
      width: 160,
      render: (test: any, record: any) => {
        return `${record.KHFWBJ?.BJSJ?.NJSJ?.NJMC} ${record.KHFWBJ?.BJSJ?.BJ}`;
      },
    },
    {
      title: '服务费用',
      dataIndex: 'FWFY',
      key: 'FWFY',
      align: 'center',
      width: 80,
      render: (test: any, record: any) => {
        return `${record.KHFWBJ?.FWFY}`;
      },
    },
    {
      title: '服务状态',
      dataIndex: 'ZT',
      key: 'ZT',
      align: 'center',
      width: 100,
      render: (_, record: any) => {
        if (record.KHFWBJ?.ZT === 0) {
          return '未发布';
        }
        return '已发布';
      },
    },
  ];
  const getDataSource = async () => {
    const res = await getNJbyKHBJSJId({
      XNXQId: termId,
      KHBJSJId: bjId,
    });
    if (res.status === 'ok' && res.data) {
      const { BJMC, KCFWBJs } = res.data;
      setSubTitle(BJMC);
      setDataSource(KCFWBJs);
    }
  };
  return (
    <>
      <ModalForm<{
        name: string;
        company: string;
      }>
        formRef={formRef}
        title={title}
        className={styles.noModalFooter}
        trigger={
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              getDataSource();
            }}
          >
            已引用
          </Button>
        }
        modalProps={{
          destroyOnClose: true,
        }}
        layout="horizontal"
      >
        <ProTable<any>
          columns={columns}
          rowKey="id"
          headerTitle={subTitle}
          pagination={{
            showQuickJumper: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            pageSize: 5,
            defaultCurrent: 1,
          }}
          dataSource={dataSource}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          search={false}
        />
      </ModalForm>
    </>
  );
};
export default SeveiceList;
