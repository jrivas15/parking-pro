import MenuOption from '@/components/shared/MenuOption';
import { BarChart3, FileText, ScrollText, CreditCard, Lock } from 'lucide-react';

const AdministrationPage = () => {
  return (
    <section className='grid grid-rows-[auto_1fr] h-full py-2 px-10 w-full'>
      <h1 className='text-white text-center text-2xl'>Administración</h1>
      <div className='mt-20 w-full grid grid-cols-6 grid-rows-5 gap-8'>
        <MenuOption route='/administration/reports' text='Reportes' icon={<BarChart3 className='size-11' />} />
        <MenuOption route='/administration/sales-closings' text='Cierres de venta' icon={<Lock className='size-11' />} />
        <MenuOption route='/administration/billing' text='Facturación' icon={<FileText className='size-11' />} />
        <MenuOption route='/administration/fe' text='F. Electrónica' icon={<ScrollText className='size-11' />} />
        <MenuOption route='/administration/payments' text='Abonos' icon={<CreditCard className='size-11' />} />
      </div>
    </section>
  );
};

export default AdministrationPage;
