import { useQuery } from "@tanstack/react-query";
import { getEInvoiceConfig } from "../services/eInvoice.service";

const useEInvoiceConfigQuery = () => {
    const eInvoiceConfigQuery = useQuery({
        queryKey: ['eInvoiceConfig'],
        queryFn: getEInvoiceConfig,
        staleTime: 1000 * 60 * 60 * 8, // 8 hours
    });

    return { eInvoiceConfigQuery };
};

export default useEInvoiceConfigQuery;
