/*
 * @description:
 * @author: Wu Zhan
 * @Date: 2021-12-14 08:59:02
 * @LastEditTime: 2021-12-17 09:48:02
 * @LastEditors: Wu Zhan
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { ModalForm } from '@ant-design/pro-form';
import { Link } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';

type ServiceBasicsType = {
  title: string
}

const SeveiceList = (props: ServiceBasicsType) => {
  const { title } = props;

  const formRef = useRef();
  const [dataSource, setDataSource] = useState<any>();
  // useEffect(() => {
    
  // },[])
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
    },
    {
      title: '年级名称',
      dataIndex: 'NJMC',
      key: 'NJMC',
      align: 'center',
      width: 160,
      render: (test: any, record: any) => {
        return `${record.NJSJ.XD}${record.NJSJ.NJMC}`;
      },
    },
    {
      title: '行政班名称',
      dataIndex: 'BJ',
      key: 'BJ',
      align: 'center',
      width: 160,
    },
    {
      title: '班级人数',
      dataIndex: 'xs_count',
      key: 'xs_count',
      align: 'center',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'ZT',
      key: 'ZT',
      align: 'center',
      width: 100,
      render: (_, record: any) => {
        if (record?.KHFWBJs?.length) {
          if (record?.KHFWBJs[0]?.ZT === 0) {
            return '未发布';
          }
          return '已发布';
        }
        return '待配置';
      },
    },
  ];
  const getDataSource=()=>{
    const data = [{
      "id": "fa07dab5-af1d-4652-b9a8-844060cfe4ac",
      "BH": 401,
      "BJ": "1班",
      "createdAt": "2021-10-14 09:08:00",
      "xsfwbm_count": 0,
      "xs_count": 22,
      "KHFWBJs": [{ZT: 0}],
      "NJSJ": {
        "id": "af7a2db0-2c87-11ec-a7d0-52540033d8e0",
        "NJ": 31,
        "NJMC": "一年级",
        "XD": "小学"
      }
    },{
      "id": "4d2195c1-df64-4978-971d-41e469a95ebf",
      "BH": 402,
      "BJ": "2班",
      "createdAt": "2021-10-14 09:08:01",
      "xsfwbm_count": 0,
      "xs_count": 0,
      "KHFWBJs": [{ZT: 0}],
      "NJSJ": {
        "id": "af7a2db0-2c87-11ec-a7d0-52540033d8e0",
        "NJ": 31,
        "NJMC": "一年级",
        "XD": "小学"
      }
    }];
    setDataSource(data);
  }
  return (
    <>
      <ModalForm<{
        name: string;
        company: string;
      }>
        formRef={formRef}
        title={title}
        trigger={
          <Button type="link" onClick={
            ()=>{
              getDataSource();
            }
          } >
            已引用
          </Button>
        }
        modalProps={{
          destroyOnClose: true,
        }}
        layout='horizontal'
      >
        <ProTable<any>
          columns={columns}
          rowKey="id"
          pagination={{
            showQuickJumper: true,
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
  )
}
export default SeveiceList
