import { Bell } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const BellNotification = () => {
  return (
    <div className='relative w-fit hover:scale-105 transition-transform cursor-pointer duration-300'>
      <Avatar className='size-9 rounded-sm'>
        <AvatarFallback className='rounded-sm'>
          <Bell className='size-5' />
        </AvatarFallback>
      </Avatar>
      <Badge className='absolute -top-2.5 -right-2.5 h-5 min-w-5 px-1 tabular-nums'>9</Badge>
    </div>
  )
}

export default BellNotification
