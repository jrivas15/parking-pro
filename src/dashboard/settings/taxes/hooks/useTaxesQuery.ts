import { useQuery } from "@tanstack/react-query";
import { getTaxes } from "../services/taxes.service";

const useTaxesQuery = () => {
    const taxesQuery = useQuery({
        queryKey: ["taxes"],
        queryFn: getTaxes,
    });

    return { taxesQuery, taxes: taxesQuery.data };
};

export default useTaxesQuery;
