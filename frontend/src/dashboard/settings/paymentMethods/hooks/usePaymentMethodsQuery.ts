import { useQuery } from "@tanstack/react-query";
import { getPaymentMethods } from "../services/paymentMethods.service";

const usePaymentMethodsQuery = () => {
    const { data: listPaymentMethods } = useQuery({
        queryKey: ["paymentMethods"],
        queryFn: getPaymentMethods,
        staleTime: 1000 * 60 * 60 * 8,
    });

    return {
        listPaymentMethods,
    };
};

export default usePaymentMethodsQuery;
