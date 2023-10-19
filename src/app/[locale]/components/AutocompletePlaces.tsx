import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useTranslations } from "next-intl";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

export function AutocompletePlaces() {
  const t = useTranslations();

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: any) => {
    setValue(address, false);
    clearSuggestions();
  };

  return (
    <Combobox onSelect={handleSelect} aria-label="choose">
      <ComboboxInput
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        // disabled={!ready}
        className="combobox-input rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 text-lg focus:border-beer-blonde focus:outline-none "
        placeholder={t("search_an_address")}
      />

      <ComboboxPopover portal={false} className="absolute z-50 max-w-[404px]">
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}
