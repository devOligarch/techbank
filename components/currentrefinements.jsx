import { Pill } from "@mantine/core";
import React from "react";
import { useCurrentRefinements } from "react-instantsearch";

export default function CustomCurrentRefinements(props) {
  const { items, refine } = useCurrentRefinements({
    includedAttributes: [
      "deviceType",
      "brand",
      "model",
      "storages.label",
      "colors.label",
    ],
  });

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) =>
        item.refinements.map((refinement) => (
          <Pill
            key={refinement.label}
            onRemove={() => refine(refinement)}
            withRemoveButton
          >
            {refinement.label}
          </Pill>
        ))
      )}
    </div>
  );
}

function isModifierClick(event) {
  const isMiddleClick = event.button === 1;

  return Boolean(
    isMiddleClick ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
  );
}
