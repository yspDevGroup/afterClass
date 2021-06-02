import { dynamic } from 'umi';

export default dynamic({
  async loader() {
    const { default: SiteMaintenance } = await import('./SiteMaintenance');
    return SiteMaintenance;
  },
});