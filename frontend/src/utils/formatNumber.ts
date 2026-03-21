
export const formatNumByCommas = (num:number):string => {
    return new Intl.NumberFormat('es-ES').format(num)
}