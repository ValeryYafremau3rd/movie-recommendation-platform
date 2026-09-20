"use client";

import { useState } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { SearchItem, SearchResource } from "@/types/searchResources";
import { useDebouncedQuery } from "@/hooks/useDebouncedQuery";

type ResourceComboboxProps = {
  resource: SearchResource;
  onSelect: (item: SearchItem | null) => void;
};

export default function ResourceCombobox({
  resource,
  onSelect,
}: ResourceComboboxProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);

  const { items, isLoading } = useDebouncedQuery({
    endpoint: resource.endpoint,
    query: inputValue,
    enabled:
      selectedItem?.name.toLowerCase() !== inputValue.trim().toLowerCase(),
  });

  function handleValueChange(item: SearchItem | null) {
    setSelectedItem(item);
    setInputValue(item?.name ?? "");
    onSelect(item);
  }

  function handleInputChange(value: string) {
    setInputValue(value);

    if (
      selectedItem &&
      value.toLowerCase() !== selectedItem.name.toLowerCase()
    ) {
      setSelectedItem(null);
      onSelect(null);
    }
  }

  const showResults =
    inputValue.trim().length >= 2 &&
    selectedItem?.name.toLowerCase() !== inputValue.trim().toLowerCase();

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {resource.label}
      </label>

      <Combobox value={selectedItem} onValueChange={handleValueChange}>
        <ComboboxInput
          value={inputValue}
          onChange={(event) => handleInputChange(event.target.value)}
          placeholder={resource.placeholder}
          className="w-full"
        />

        {showResults && (
          <ComboboxContent>
            <ComboboxList>
              {isLoading && <ComboboxEmpty>Searching...</ComboboxEmpty>}

              {!isLoading && items.length === 0 && (
                <ComboboxEmpty>
                  No {resource.label.toLowerCase()}s found.
                </ComboboxEmpty>
              )}

              {items.map((item) => (
                <ComboboxItem key={item.id} value={item}>
                  {item.name}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        )}
      </Combobox>
    </div>
  );
}
