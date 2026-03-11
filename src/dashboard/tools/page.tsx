import { useState } from 'react';
import MenuOption from '@/components/shared/MenuOption';
import { Scale, Calculator } from 'lucide-react';
import CashCountDialog from './cashCount/CashCountDialog';

const ToolsPage = () => {
  const [cashCountOpen, setCashCountOpen] = useState(false);

  return (
    <section className='grid grid-rows-[auto_1fr] h-full py-2 px-10 w-full'>
      <h1 className='text-white text-center text-2xl'>Herramientas</h1>
      <div className='mt-20 w-full grid grid-cols-6 grid-rows-5 gap-8'>
        <MenuOption route='/tools/balance' text='Balance de caja' icon={<Scale className='size-11' />} />
        <MenuOption onClick={() => setCashCountOpen(true)} text='Arqueo' icon={<Calculator className='size-11' />} />
      </div>

      <CashCountDialog open={cashCountOpen} onOpenChange={setCashCountOpen} />
    </section>
  );
};

export default ToolsPage;
