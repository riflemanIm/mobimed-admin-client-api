import React from "react";
import MedicalBrandList from "./MedicalBrandList";
import { MedicalBrandProvider } from "../../context/MedicalBrandContext";

export default function MedicalBrands() {
  return (
    <MedicalBrandProvider>
      <MedicalBrandList />
    </MedicalBrandProvider>
  );
}
