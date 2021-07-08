import type { FC } from "react";
import loadImg from '@/assets/loading.gif';

const Nodata: FC = () => {
  return (
    <div><img style={{width:'50vw',maxWidth:'400px',margin:'0 auto',paddingTop:'15vh',display:'block'}} src={loadImg} /></div>
  )
}

export default Nodata