import { ColumnDef } from '@tanstack/react-table'
import useSalesQuery from './useSalesQuery'
import useUsers from '@/dashboard/settings/users/hooks/useUsersQuery'
import { BalanceFilters, SaleWithMovement } from '../types/sales.type'
import VehicleIcon from '@/components/shared/VehicleIcon'
import Plate from '@/dashboard/parking/components/Plate'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, FileText, Printer, ArrowLeftRight, CreditCard } from 'lucide-react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import useTariffQuery from '@/dashboard/settings/tariffs/hooks/useTariffQuery'
import usePaymentMethodsQuery from '@/dashboard/settings/paymentMethods/hooks/usePaymentMethodsQuery'
import useCloseSalesMutation from './useCloseSalesMutation'
import useBalanceMutation from './useBalanceMutation'
import { sileo } from 'sileo'

export const formatMoney = (value: number) => '$' + value.toLocaleString('es-CO');

interface SaleActionHandlers {
    onViewDetails: (sale: SaleWithMovement) => void
    onPrint: (sale: SaleWithMovement) => void
    onTransfer: (sale: SaleWithMovement) => void
    onChangePaymentMethod: (sale: SaleWithMovement) => void
}

const buildColumns = (handlers: SaleActionHandlers): ColumnDef<SaleWithMovement>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'movement.plate',
        header: 'Placa',
        cell: (info) => {
            const plate = info.getValue() as string;
            return <Plate plate={plate} />
        }
    },
    {
        accessorKey: 'movement.exitTime',
        header: 'Fecha de salida',
        cell: (info) => {
            const exitTime = dayjs(info.getValue() as Date).format('DD-MM-YY HH:mm');
            return <span className="text-center">{exitTime}</span>;
        }
    },
    {
        accessorKey: 'movement.parkingTime',
        header: 'Duración',
    },
    {
        accessorKey: 'movement.vehicleType',
        header: 'Tipo de vehículo',
        cell: (info) => {
            const type = info.getValue() as string;
            return <VehicleIcon type={type} />;
        }
    },
    {
        accessorKey: 'total',
        header: 'Total',
        cell: (info) => formatMoney(info.getValue() as number),
    },
    {
        accessorKey: 'paymentMethod.name',
        header: 'Método de pago',
        cell: (info) => {
            const method = info.getValue() as string;
            return <Badge variant='outline'>{method}</Badge>
        }
    },
    {
        header: 'Acciones',
        cell: (info) => {
            const sale = info.row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => handlers.onViewDetails(sale)}>
                            <FileText size={14} />
                            Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => handlers.onPrint(sale)}>
                            <Printer size={14} />
                            Imprimir recibo
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2" onClick={() => handlers.onTransfer(sale)}>
                            <ArrowLeftRight size={14} />
                            Transferir movimiento
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => handlers.onChangePaymentMethod(sale)}>
                            <CreditCard size={14} />
                            Cambiar medio de pago
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]


const useBalance = () => {
    const { profile, listUsers: users } = useUsers()
    const { data: tariffs } = useTariffQuery()
    const { listPaymentMethods: paymentMethods } = usePaymentMethodsQuery()
    const { handleCloseSales, isClosing } = useCloseSalesMutation()
    const balanceMutation = useBalanceMutation()

    // Filter state
    const [filters, setFilters] = useState({
        dateRange: undefined as DateRange | undefined,
        user: undefined as string | undefined,
        paymentMethod: 'all',
        vehicleType: 'all',
        tariff: undefined as string | undefined,
    })
    const [appliedFilters, setAppliedFilters] = useState<BalanceFilters>({})

    // Dialog state
    const [openNoteDialog, setOpenNoteDialog] = useState(false)
    const [closeNote, setCloseNote] = useState('')
    const [openCloseSalesDialog, setOpenCloseSalesDialog] = useState(false)

    const resolvedFilters = { ...appliedFilters, userID: appliedFilters.userID || profile?.id }
    const { openSalesQuery } = useSalesQuery(resolvedFilters)
    const openSales = openSalesQuery.data?.sales || []
    const balanceStats = openSalesQuery.data?.stats
    const isLoading = openSalesQuery.isLoading

    useEffect(() => {
        if (openSalesQuery.isSuccess) {
            sileo.success({title:"Ventas", description: "Las ventas cargadas exitosamente"})
        } else if (openSalesQuery.isError) {
            sileo.error({title:"Ventas", description: "Ocurrió un error al cargar las ventas"})
        }
    }, [openSalesQuery.isSuccess, openSalesQuery.dataUpdatedAt])

    const columns = buildColumns({
        onViewDetails: balanceMutation.onViewDetails,
        onPrint: balanceMutation.onPrint,
        onTransfer: balanceMutation.onTransfer,
        onChangePaymentMethod: balanceMutation.onChangePaymentMethod,
    })

    const handleApplyFilters = () => {
        setAppliedFilters({
            userID: filters.user ? parseInt(filters.user) : profile?.id,
            dateFrom: filters.dateRange?.from ? dayjs(filters.dateRange.from).toISOString() : undefined,
            dateTo: filters.dateRange?.to ? dayjs(filters.dateRange.to).toISOString() : undefined,
            paymentMethodId: filters.paymentMethod,
            vehicleType: filters.vehicleType,
            tariffId: filters.tariff,
        })
    }

    const handleResetFilters = () => {
        setFilters({
            dateRange: undefined,
            user: undefined,
            paymentMethod: 'all',
            vehicleType: 'all',
            tariff: undefined,
        })
        setAppliedFilters({})
    }

    return {
        // data
        columns,
        openSales,
        balanceStats,
        isLoading,
        // filter options
        users,
        tariffs,
        paymentMethods,
        profile,
        // filter state
        filters,
        setFilters,
        // filter actions
        handleApplyFilters,
        handleResetFilters,
        // close sales
        appliedFilters,
        closeNote,
        setCloseNote,
        openNoteDialog,
        setOpenNoteDialog,
        openCloseSalesDialog,
        setOpenCloseSalesDialog,
        handleCloseSales,
        isClosing,
        // sale actions
        ...balanceMutation,
    }
}

export default useBalance
