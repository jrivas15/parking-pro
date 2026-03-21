import MenuOption from '@/components/shared/MenuOption';
import { Banknote, CreditCard, UserCircleIcon, WrenchIcon, Server, ScrollText, Percent } from 'lucide-react'
import { FaParking, FaDatabase, FaCar } from "react-icons/fa";

const SettingPage = () => {
  return (
    <section className='grid grid-rows-[auto_1fr] h-full py-2 px-10 w-full '>
      <h1 className='text-white text-center text-2xl'>Ajustes</h1>
      <div className='mt-20 w-full grid grid-cols-6 grid-rows-5 gap-8 '>
        <MenuOption route='/settings/parking-info' text='Parqueadero' icon={<FaParking className='size-11'/>}/>
        <MenuOption route='/settings/tariffs' text='Tarifas' icon={<Banknote className='size-11'/>}/>
        <MenuOption route='/settings/users' text='Usuarios' icon={<UserCircleIcon className='size-11'/>}/>
        <MenuOption route='/settings/db' text='DB' icon={<FaDatabase className='size-11'/>}/>
        <MenuOption route='/settings/advanced' text='Avanzadas' icon={<WrenchIcon className='size-11'/>}/>
        <MenuOption route='/settings/fe' text='F.Electronica' icon={<ScrollText className='size-11'/>}/>
        <MenuOption route='/settings/backups' text='Backups' icon={<Server className='size-11'/>}/>
        <MenuOption route='/settings/plate-restriction' text='Pico y placa' icon={<FaCar className='size-11'/>}/>
        <MenuOption route='/settings/payment-methods' text='Métodos de pago' icon={<CreditCard className='size-11'/>}/>
        <MenuOption route='/settings/taxes' text='Impuestos' icon={<Percent className='size-11'/>}/>
      </div>
    </section>
  )
}

export default SettingPage;