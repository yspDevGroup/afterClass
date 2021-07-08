import { Pagination } from 'antd';
import styles from "./index.less";

const Pagina = (props: { total: number, setPages: React.Dispatch<React.SetStateAction<number>> }) => {
  const { total, setPages } = props;

  const onChange = (pageNumber: number) => {
    setPages(pageNumber);
  
  }
  return (
    <div className={styles.paginationBox}>
      <Pagination size="small" total={total} onChange={onChange} pageSizeOptions={['10']} />
    </div>
  )
}

export default Pagina
