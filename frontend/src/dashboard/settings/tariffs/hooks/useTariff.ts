import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { daysOfWeek } from "../data";
import { newTariff } from "../services/tariff.service";
import { TariffFormData, tariffSchema, defaultValues } from "../schema/tariff.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useTariffQuery from "./useTariffQuery";
import { Tariff } from "../types/tariff.type";
import useTariffMutation from "./useTariffMutation";
import { toast } from "sonner";

const useTariff = () => {
    const [mode, setMode] = useState<'view' | 'new' | 'edit'>('view');
    const [selectedTariffId, setSelectedTariffId] = useState<string | null>(null);
    const { data: dataTariffs } = useTariffQuery();
    const { newTariffMutation, updateTariffMutation, deleteTariffMutation } = useTariffMutation();

    const form = useForm({
        resolver: zodResolver(tariffSchema),
        defaultValues
    });
    const selectedDays = form.watch("enableDays");

    useEffect(() => {
        if (mode === "view" && selectedTariffId && dataTariffs) {
            form.reset(dataTariffs.find((t: Tariff) => t.id === parseInt(selectedTariffId)) || defaultValues);
        }
    }, [selectedTariffId, dataTariffs])


    const toggleDay = (dayId: number) => {
        const currentDays = form.getValues("enableDays") || [];
        const newDays = currentDays.includes(dayId)
            ? currentDays.filter((d) => d !== dayId)
            : [...currentDays, dayId];
        form.setValue("enableDays", newDays);
    };

    const selectAllDays = () => {
        const allDayIds = daysOfWeek.map((day) => day.id);
        form.setValue("enableDays", allDayIds);
    };

    const handleNew = () => {
        setMode("new");
        setSelectedTariffId(null);
        form.reset(defaultValues);
    };

    const handleEdit = () => {
        if (!selectedTariffId) return;
        setMode("edit");
    };

    const handleDelete = () => {
        if (!selectedTariffId) {
            toast.error("Selecciona una tarifa para eliminar");
            return;
        }
        deleteTariffMutation.mutate(parseInt(selectedTariffId));
        setSelectedTariffId(null);
        setMode("view");
    };

    const handleCancel = () => {
        setMode("view");
        form.reset();
    };

    const handleSubmit = (data: TariffFormData) => {
        console.log("Form data:", data);
        if (mode === "new") {
            newTariffMutation.mutate(data)
        }else if (mode === "edit" && selectedTariffId) {
            updateTariffMutation.mutate({ id: parseInt(selectedTariffId), data });
        }
        setMode("view");
    };

    return {
        mode,
        setMode,
        selectedTariffId,
        setSelectedTariffId,
        form,
        selectedDays,
        toggleDay,
        selectAllDays,
        handleNew,
        handleEdit,
        handleDelete,
        handleCancel,
        handleSubmit
    }
}

export default useTariff
