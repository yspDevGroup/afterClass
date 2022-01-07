/*
 * @description: 
 * @author: wsl
 * @Date: 2021-12-27 14:34:50
 * @LastEditTime: 2021-12-28 12:15:58
 * @LastEditors: wsl
 */

import { EnvironmentOutlined, HistoryOutlined, TeamOutlined } from '@ant-design/icons';
import styles from './index.less'
import noCourses1 from '@/assets/noCourses1.png';
import { history } from 'umi';
import { ClassStatus } from '@/utils/Timefunction';
import noData1 from '@/assets/today1.png';

const CourseList = (props: {
  data: any
}) => {
  const { data } = props;
  return <>
    <div className={styles.CourseList}>
      <div className={styles.title}>
        <div />
        <span>今日课程</span>
      </div>
      {
        data?.length !== 0 ? <>
          {
            data?.map((value: any) => {
              return <div className={styles.list} onClick={() => {
                history.push(`/teacher/home/courseDetails?classid=${value.bjId}&status=${value?.status}`)
              }
              }>
                <p><span>{value?.title}</span> <span
                  style={{ color: ClassStatus(value.start, value.end) === '待上课' ? '#15B628' : '#999999' }}>
                  {value?.status || ClassStatus(value.start, value.end)}</span></p>
                <div className={styles.box}>
                  <img src={value?.img || noCourses1} alt="" />
                  <div>
                    <p> <HistoryOutlined />{value.start}~{value?.end}</p>
                    <p> <EnvironmentOutlined />{value?.xq || '本校'} {value?.address ?<>| {value?.address}</>:<></>}</p>
                    <p> <TeamOutlined />{value?.BJMC} {value?.BJRS ? <> | 共{value?.BJRS}人</>:<></>}  </p>
                  </div>
                </div>
              </div>
            })
          }
        </> : <><div className={styles.noData}>
          <img src={noData1} alt="" />
          <p>今日没有课呦</p>
        </div>
        </>
      }


    </div>
  </>
}

export default CourseList;