import { deleteKHBJSJ } from "@/services/after-class/khbjsj";
import { Popconfirm } from "antd";
import { message } from "antd";
import { Divider } from "antd";
import React from "react";
import type { CourseItem } from "../data";

type propstype={
    handleEdit: (data: CourseItem) => void;
    record: CourseItem;
}

const ActionBar = (props: propstype) => {
    const { handleEdit,record} = props

    switch (record.NJMC) {
        case '未排课':
            return (
                <>
                <a>排课</a>
                 <Divider type="vertical" />
                   <a onClick={() => handleEdit(record)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm
                title="删除之后，数据不可恢复，确定要删除吗?"
                onConfirm={async () => {
                try {
                if (record.id) {
                  const params = { id: record.id };
                  const res = deleteKHBJSJ(params);
                  new Promise((resolve) => {
                    resolve(res);
                  }).then((data: any) => {
                    if (data.status === 'ok') {
                      message.success('删除成功');
                    } else {
                      message.error('删除失败');
                    }
                  });
                }
              } catch (err) {
                message.error('删除失败，请联系管理员或稍后重试。');
              }
            }}
            okText="确定"
            cancelText="取消"
            placement="topLeft"
          >
            <a>删除</a>
          </Popconfirm> 
                </>
            );
            break;
        case '已排课':
            return (
                <>
                    223
                </>
            );
            break;
        case '已发布':
            return (
                <>
                    223
                </>
            );
            break;
        case '已下架':
            return (
                <>
                    223
                </>
            );
            break;
        default:
            return (
                <>
                    123
                </>
            );
    }
}
export default ActionBar