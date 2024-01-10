"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import Spinner from "../../../../components/common/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { useAuth } from "../../../../Auth/useAuth";
import InputTextarea from "../../../../components/common/InputTextarea";
import InputLabel from "../../../../components/common/InputLabel";

type HistoryFormData = {
  description: string;
  foundation_year: string;
};

const schema: ZodType<HistoryFormData> = z.object({
  description: z.string().nonempty({ message: "errors.input_required" }),
  foundation_year: z.string().nonempty({ message: "errors.input_required" }),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
  id: string;
  description: string;
  foundationYear: string;
}

export function HistoryForm({ id, description, foundationYear }: Props) {
  const t = useTranslations();
  const { supabase } = useAuth();

  const [loading, setLoading] = useState(false);

  const form = useForm<ValidationSchema>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      description: description,
      foundation_year: foundationYear,
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async () => {
    try {
      setLoading(true);

      const updates = {
        id,
        description,
        foundationYear,
      };

      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", id);
      setLoading(false);

      if (error) throw error;
    } catch (error) {
      alert("Error updating the data!");
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="history"
      className="container mb-4 space-y-3 bg-white px-6 py-4"
    >
      <h2 id="history-data" className="text-2xl">
        {t("history_business_title")}
      </h2>

      {loading ? (
        <Spinner size="medium" color="beer-blonde" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-row space-x-3 ">
            <InputTextarea
              form={form}
              label={"description"}
              labelText={t("history_business_description")}
              registerOptions={{
                required: true,
              }}
            />

            <InputLabel
              form={form}
              label={"foundation_year"}
              labelText={t("history_business_year")}
              registerOptions={{
                required: true,
              }}
            />
          </div>
        </form>
      )}
    </section>
  );
}
