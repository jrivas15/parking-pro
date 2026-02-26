import { use, useEffect, useState } from 'react'
import { User } from '../types/user.type';

const useUser = () => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openForm, setOpenForm] = useState(false);
  
  const handleDelete = (user: User) => {
    if (!user) {
      setSelectedUser(null);
    }else{
      setSelectedUser(user);
    }
    setOpenConfirm(true);
  }
  
  const handleUpdate = (user: User) => {
    if (!user) {
      setSelectedUser(null);
    }else{
      setSelectedUser(user);
    }
    setOpenForm(true);
  }

  useEffect(() => {
    if (!openForm) {
      setSelectedUser(null);
    }
  }, [openForm]);
  
  return {
    openConfirm,
    setOpenConfirm,
    selectedUser,
    openForm,
    setOpenForm,
    handleDelete,
    handleUpdate
  }
}

export default useUser
