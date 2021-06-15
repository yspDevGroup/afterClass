/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-11 15:02:49
 * @LastEditTime: 2021-06-15 16:44:15
 * @LastEditors: txx
 */
import { JSXElementConstructor, ReactElement } from 'react'
import { Pagination } from 'antd';
import styles from "./index.less"
import { LeftOutlined, RightOutlined, VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';

function itemRender(
  page?: number,
  type?: "page" | "prev" | "next" | "jump-prev" | "jump-next",
  originalElement?: ReactElement<HTMLElement, string | JSXElementConstructor<any>>
) {
  if (type === "prev") {
    return (
      <div className={styles.left}>
        <div>
          <a href="">
            <VerticalRightOutlined />
          </a>
        </div>
        <div >
          <a href="">
            <LeftOutlined />
          </a>
        </div>
      </div>)
  }
  if (type === "next") {
    return (
      <div className={styles.right}>
        <div>
          <a href="">
            <RightOutlined />
          </a>
        </div>
        <div>
          <a href="">
            <VerticalLeftOutlined />
          </a>
        </div>
      </div >
    )
  }
  return originalElement
}

const Pagina = (props: { total?: number }) => {
  const { total } = props
  return (
    <div className={styles.paginationBox}>
      <Pagination size="small" total={total} itemRender={itemRender} />
    </div>
  )
}

export default Pagina
