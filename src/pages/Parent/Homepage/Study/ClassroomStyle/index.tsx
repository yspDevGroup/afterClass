import GoBack from '@/components/GoBack';
import { getAllKHKTFC } from '@/services/after-class/khktfc';
import { getData } from '@/utils/utils';
import { UserOutlined } from '@ant-design/icons';
import { Empty, Avatar, Image} from 'antd';
import { useEffect } from 'react';
import styles from './index.less';

const ClassroomStyle = () => {

  useEffect(()=>{
    getData();
  },[]);

  const  getData =  async() => {
    const resKHKTFC = await getAllKHKTFC({});
    console.log('resKHKTFC: ', resKHKTFC);
  }

  return (
    <div className={styles.ClassroomStyle}>
      <GoBack title={'课堂风采'} />
      <div className={styles.wrap}>
          <div className={styles.cards}>
            <p>
              <Avatar size="large" icon={<UserOutlined />} />
              <p className={styles.name}>
                <p>{'某'}老师</p>
                <p>鸿浩国学堂</p>
              </p>
            </p>
            <div className={styles.content}>
              <p>孩子们在本次课上的表现都很不错，积极活跃，学习氛围很好。</p>
              <div className={styles.imgContainer}>
                <Image className={styles.img} width={200} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"/>
                <Image className={styles.img} width={200} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"/>
                <Image className={styles.img} width={200} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"/>
              </div>
              <p>
                <span>{'5月26日 18:30'}</span>
                <span>
                  {'少儿书法'} ｜{'入门班'}
                </span>{' '}
              </p>
            </div>
            </div>
        </div>
    </div>
  );
};
export default ClassroomStyle;
