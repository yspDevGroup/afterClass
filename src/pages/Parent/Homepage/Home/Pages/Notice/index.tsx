/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 10:32:04
 * @,@LastEditTime: ,: 2021-07-02 11:06:28
 * @,@LastEditors: ,: Please set LastEditors
 */
import React, { useEffect, useState } from 'react';
import ListComp from '@/components/ListComponent';
import styles from "./index.less";

import Pagina from '../../components/Pagination/Pagination';
import { ListData } from '@/components/ListComponent/data';
import { getAllXXGG } from '@/services/after-class/xxgg';
import moment from 'moment';

const Notice = () => {
  const [notification, setNotification] = useState<any[]>();
  useEffect(() => {
    async function announcements() {
      const res = await getAllXXGG({ status: ['发布'] });
      if (res.status === 'ok' && !(res.data?.length===0)) {
        const newdata: any = [];
        await res.data!.map((record: any) => {
          const listdata = {
            title: record.BT,
            link: `/parent/home/notice/announcement?listid=${record.id}`,
            titleRight: {
              text: moment(record.updatedAt).format('YYYY-MM-DD'),
            },
          }
         newdata.push(listdata)
        })
        setNotification(newdata)
      } else {

      };
    };
    announcements();
  }, [])


  const mock: ListData = {
    type: 'onlyList',
    cls: 'onlyOneList',
    list: notification!
  }
  return (
    <div className={styles.NoticeBox}>
      <ListComp listData={mock} />
      <Pagina total={5} />
    </div>
  )
}

export default Notice