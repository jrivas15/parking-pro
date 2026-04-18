import { useQuery } from "@tanstack/react-query";
import { EInvoiceFilters } from "../types/eInvoice.type";
import { getEInvoices } from "../services/eInvoice.service";

const useEInvoicesQuery = (filters: EInvoiceFilters) => {
    const eInvoicesQuery = useQuery({
        queryKey: ['eInvoices', filters],
        queryFn: () => getEInvoices(filters),
        placeholderData: (prev) => prev,
    });

    return { eInvoicesQuery };
};

export default useEInvoicesQuery;
