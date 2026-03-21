import { Bike, Building2, Car, Motorbike, User } from "lucide-react";

export const COLORS = [
  { value: "blanco", label: "Blanco" },
  { value: "negro", label: "Negro" },
  { value: "gris", label: "Gris" },
  { value: "plata", label: "Plata" },
  { value: "rojo", label: "Rojo" },
  { value: "azul", label: "Azul" },
  { value: "verde", label: "Verde" },
  { value: "amarillo", label: "Amarillo" },
  { value: "otro", label: "Otro" },
];


export const VEHICLE_TYPES = [
  { value: "C", label: "Carro", icon: <Car size={22} /> },
  { value: "M", label: "Moto", icon: <Motorbike size={22} /> },
  { value: "B", label: "Bici", icon: <Bike size={22} /> },
];


export const CUSTOMER_TYPES = [
  { value: "NATURAL", label: "Natural", icon: <User size={20} /> },
  { value: "JURIDICA", label: "Jurídica", icon: <Building2 size={20} /> },
];
