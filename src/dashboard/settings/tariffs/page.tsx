import CustomInput from "@/components/forms/CustomInput";
import FormDecimalInput from "@/components/forms/FormDecimalInput";
import FormIntInput from "@/components/forms/FormIntInput";
import FormSelect from "@/components/forms/FormSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Banknote, Calendar, Pencil, Plus, Trash2 } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { vehicleTypes, tariffTypes, daysOfWeek } from "./data";
import FormSwitch from "@/components/forms/FormSwitch";
import useTariff from "./hooks/useTariff";
import useTariffQuery from "./hooks/useTariffQuery";
import { Tariff } from "./types/tariff.type";
const TariffsPage = () => {
  const {
    mode,
    selectedTariffId,
    setSelectedTariffId,
    selectedDays,
    form,
    toggleDay,
    selectAllDays,
    handleNew,
    handleEdit,
    handleDelete,
    handleCancel,
    handleSubmit,
  } = useTariff();
  const {data:dataTariffs} = useTariffQuery();
  const isDisabled = mode === "view";

  return (
    <section className="flex  flex-col gap-4 p-4">
      <FormProvider {...form}>
        <FormSwitch formName="enable" label="Activa" disabled={isDisabled} />
        <form
          className="flex  flex-col gap-2 w-full"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Card className="w-full">
            <CardContent className="flex gap-3">
              <div className="flex flex-col gap-2 w-full">
                <h1 className="text-primary/80">Tarifa seleccionada</h1>
                <Select
                  value={selectedTariffId || ""}
                  onValueChange={setSelectedTariffId}
                  disabled={mode !== "view"}
                >
                  <SelectTrigger className="w-full min-w-30">
                    <SelectValue placeholder="Seleccionar una tarifa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tarifa</SelectLabel>
                      {dataTariffs?.map((tariff: Tariff) => (
                        <SelectItem key={tariff.id} value={tariff.id.toString()}>
                          {tariff.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <FormSelect
                options={tariffTypes}
                formName="tariffType"
                label="Tipo de tarifa"
                placeholder="Seleccionar un tipo"
                colorLabel="text-primary/80"
                disabled={isDisabled}
              />

              <FormSelect
                options={vehicleTypes}
                formName="vehicleType"
                placeholder="Seleccionar tipo de vehiculo"
                label="Tipo de vehiculo"
                colorLabel="text-primary/80"
                disabled={isDisabled}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="text-primary" size={35} />
                Tarifa base
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <CustomInput
                  formName="name"
                  label="Nombre de la tarifa"
                  disabled={isDisabled}
                />
              </div>

              <FormDecimalInput
                formName="priceHour"
                label="Valor x hora"
                disabled={isDisabled}
              />
              <FormDecimalInput
                formName="priceHourAdditional"
                label="Valor hora adicional"
                disabled={isDisabled}
              />
              <FormDecimalInput
                formName="maxPrice"
                label="Valor tope máximo"
                disabled={isDisabled}
              />
              <FormIntInput
                formName="segment"
                label="Segmento(horas)"
                disabled={isDisabled}
              />
              <FormIntInput
                formName="startTimeCharge"
                label="Inicio de cobro (min)"
                disabled={isDisabled}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="text-primary" size={35} />
                  Días de vigencia
                </CardTitle>
                <button
                  type="button"
                  onClick={selectAllDays}
                  disabled={isDisabled}
                  className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Seleccionar todos
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {daysOfWeek.map((day) => {
                  const isSelected = selectedDays.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(day.id)}
                      disabled={isDisabled}
                      className={`flex items-center gap-4 transition-all disabled:cursor-not-allowed ${
                        isSelected ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                          isSelected
                            ? "bg-yellow-500 text-black"
                            : "border-2 border-yellow-600 text-yellow-600"
                        }`}
                      >
                        {day.label.charAt(0)}
                      </div>
                      <span
                        className={`text-sm font-medium tracking-wider ${
                          isSelected ? "text-white" : "text-yellow-600"
                        }`}
                      >
                        {day.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <menu className="flex justify-between p-2 ">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleNew}
                disabled={mode !== "view"}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={mode !== "view" || !selectedTariffId}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleEdit}
                disabled={mode !== "view" || !selectedTariffId}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </div>
            <div>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={mode === "view"}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={mode === "view"}>
                Guardar
              </Button>
            </div>
          </menu>
        </form>
      </FormProvider>
    </section>
  );
};

export default TariffsPage;
