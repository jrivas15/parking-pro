import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "../services/expenses.service";

const useExpensesQuery = () => {
    const expensesQuery = useQuery({
        queryKey: ["expenses"],
        queryFn: getExpenses,
    });

    return { expensesQuery };
};

export default useExpensesQuery;
