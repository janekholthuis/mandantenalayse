import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { showSuccess, showError } from "../../lib/toast";
import Button from "../ui/Button";

interface FormData {
  name: string;
  employee_count?: number;
  plz?: number;
  ort?: string;
  land?: string;
  strasse?: string;
}

const NewClientForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase.from("clients").insert(data);
      if (error) throw error;

      showSuccess("Mandant erfolgreich erstellt");
      navigate("/clients");
    } catch (error: any) {
      showError(error.message || "Fehler beim Erstellen des Mandanten");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-lg shadow max-w-4xl">
      <h2 className="text-xl font-bold text-gray-900">Mandanteninformationen</h2>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Firmenname <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          {...register("name", { required: "Pflichtfeld" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
      </div>

      {/* Employee Count */}
      <div>
        <label htmlFor="employee_count" className="block text-sm font-medium text-gray-700">
          Mitarbeiteranzahl
        </label>
        <input
          type="number"
          id="employee_count"
          {...register("employee_count", {
            valueAsNumber: true,
            min: { value: 1, message: "Mindestens 1 Mitarbeiter" },
            max: { value: 10000, message: "Maximal 10000 Mitarbeiter" },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.employee_count && <p className="text-sm text-red-600 mt-1">{errors.employee_count.message}</p>}
      </div>

      {/* PLZ */}
      <div>
        <label htmlFor="plz" className="block text-sm font-medium text-gray-700">
          PLZ
        </label>
        <input
          type="number"
          id="plz"
          {...register("plz", {
            valueAsNumber: true,
            min: { value: 1000, message: "Ungültige PLZ" },
            max: { value: 99999, message: "Ungültige PLZ" },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.plz && <p className="text-sm text-red-600 mt-1">{errors.plz.message}</p>}
      </div>

      {/* Ort */}
      <div>
        <label htmlFor="ort" className="block text-sm font-medium text-gray-700">
          Ort
        </label>
        <input
          id="ort"
          {...register("ort")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Land */}
      <div>
        <label htmlFor="land" className="block text-sm font-medium text-gray-700">
          Land
        </label>
        <input
          id="land"
          defaultValue="Deutschland"
          {...register("land")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Straße */}
      <div>
        <label htmlFor="strasse" className="block text-sm font-medium text-gray-700">
          Straße & Hausnummer
        </label>
        <input
          id="strasse"
          {...register("strasse")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 border-t pt-6">
        <Button type="button" variant="secondary" onClick={() => navigate("/clients")}>
          Abbrechen
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Mandant speichern
        </Button>
      </div>
    </form>
  );
};

export default NewClientForm;
