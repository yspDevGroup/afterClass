import { dynamic } from 'umi';

export default dynamic({
  async loader() {
    const { default: AddRoom } = await import('./AddRoom');
    return AddRoom;
  },
});