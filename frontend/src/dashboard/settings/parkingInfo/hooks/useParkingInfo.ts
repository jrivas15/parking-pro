import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { defaultValues, ParkingInfoFormType, parkingInfoSchema } from "../schemas/parkingInfo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useParkingInfoMutation from "./useParkingInfoMutation";
import useParkingInfoQuery from "./useParkingInfoQuery";

const useParkingInfo = () => {
    const { parkingInfoQuery } = useParkingInfoQuery();

    const form = useForm<ParkingInfoFormType>({
        resolver: zodResolver(parkingInfoSchema),
        defaultValues,
    });
    const [mode, setMode] = useState<"view" | "edit">("view");
    const { parkingInfoMutation } = useParkingInfoMutation();

    const handleEdit = () => {
        setMode("edit");
    };
    const handleCancel = () => {
        setMode("view");
        form.reset(parkingInfoQuery.data);
    };

    const onSubmit = (data: ParkingInfoFormType) => parkingInfoMutation.mutate(data);

    useEffect(() => {
        if (parkingInfoMutation.isSuccess) {
            setMode("view");
        }
    }, [parkingInfoMutation.isSuccess]);

    useEffect(() => {
        if (parkingInfoQuery.data) form.reset(parkingInfoQuery.data);
    }, [parkingInfoQuery.data]);

    return {
        form,
        mode,
        handleEdit,
        handleCancel,
        onSubmit
    }
}

export default useParkingInfo
