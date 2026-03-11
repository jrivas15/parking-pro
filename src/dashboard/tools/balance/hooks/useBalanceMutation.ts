import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { changeSalePaymentMethod, transferSale } from '../services/sales.service'
import { SaleWithMovement } from '../types/sales.type'

const useBalanceMutation = () => {
    const queryClient = useQueryClient()

    // Shared selected sale
    const [selectedSale, setSelectedSale] = useState<SaleWithMovement | null>(null)

    // Detail dialog
    const [openDetailDialog, setOpenDetailDialog] = useState(false)

    // Change payment method dialog
    const [openChangePaymentDialog, setOpenChangePaymentDialog] = useState(false)
    const [newPaymentMethodId, setNewPaymentMethodId] = useState<string>('')

    // Transfer dialog
    const [openTransferDialog, setOpenTransferDialog] = useState(false)
    const [transferUserId, setTransferUserId] = useState<string>('')

    const changePaymentMutation = useMutation({
        mutationFn: ({ saleId, pmId }: { saleId: number; pmId: number }) =>
            changeSalePaymentMethod(saleId, pmId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales'] })
            setOpenChangePaymentDialog(false)
        },
    })

    const transferMutation = useMutation({
        mutationFn: ({ saleId, userId }: { saleId: number; userId: number }) =>
            transferSale(saleId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales'] })
            setOpenTransferDialog(false)
        },
    })

    const handleConfirmChangePayment = () => {
        if (!selectedSale || !newPaymentMethodId) return
        sileo.promise(
            changePaymentMutation.mutateAsync({ saleId: selectedSale.id, pmId: parseInt(newPaymentMethodId) }),
            {
                loading: { title: 'Actualizando...' },
                success: { title: 'Medio de pago actualizado' },
                error: { title: 'Error', description: 'No se pudo actualizar el medio de pago' },
            }
        )
    }

    const handleConfirmTransfer = () => {
        if (!selectedSale || !transferUserId) return
        sileo.promise(
            transferMutation.mutateAsync({ saleId: selectedSale.id, userId: parseInt(transferUserId) }),
            {
                loading: { title: 'Transfiriendo...' },
                success: { title: 'Movimiento transferido' },
                error: { title: 'Error', description: 'No se pudo transferir el movimiento' },
            }
        )
    }

    // Handlers for column action menu
    const onViewDetails = (sale: SaleWithMovement) => {
        setSelectedSale(sale)
        setOpenDetailDialog(true)
    }

    const onPrint = (_sale: SaleWithMovement) => {
        window.print()
    }

    const onTransfer = (sale: SaleWithMovement) => {
        setSelectedSale(sale)
        setTransferUserId('')
        setOpenTransferDialog(true)
    }

    const onChangePaymentMethod = (sale: SaleWithMovement) => {
        setSelectedSale(sale)
        setNewPaymentMethodId(sale.paymentMethod?.id.toString() ?? '')
        setOpenChangePaymentDialog(true)
    }

    return {
        // column handlers
        onViewDetails,
        onPrint,
        onTransfer,
        onChangePaymentMethod,
        // selected sale
        selectedSale,
        // detail dialog
        openDetailDialog,
        setOpenDetailDialog,
        // change payment dialog
        openChangePaymentDialog,
        setOpenChangePaymentDialog,
        newPaymentMethodId,
        setNewPaymentMethodId,
        handleConfirmChangePayment,
        isChangingPayment: changePaymentMutation.isPending,
        // transfer dialog
        openTransferDialog,
        setOpenTransferDialog,
        transferUserId,
        setTransferUserId,
        handleConfirmTransfer,
        isTransferring: transferMutation.isPending,
    }
}

export default useBalanceMutation
