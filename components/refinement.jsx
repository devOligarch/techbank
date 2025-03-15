// import { Checkbox } from "@mantine/core";
// import { useRouter } from "next/router";
// import React, { useEffect } from "react";
// import { useRefinementList } from "react-instantsearch";

// function Refinement({ attribute, getBrand }) {
//   const { items, refine } = useRefinementList({
//     attribute,
//   });

//   const router = useRouter();

//   const selectedFilter = router?.query?.model;

//   console.log(selectedFilter);

//   useEffect(() => {
//     if (selectedFilter && attribute == "variant.brand") {
//       refine(selectedFilter);
//     }

//     console.log(`Getting brand: ${getBrand}`);

//     if (getBrand) {
//       refine(getBrand);
//     }
//   }, [selectedFilter, refine, getBrand]);

//   return (
//     <div>
//       <ul className="space-y-2">
//         {items.map((item) => (
//           <li key={item.value}>
//             <label className="flex items-center space-x-2">
//               <Checkbox
//                 checked={item.isRefined}
//                 onChange={() => refine(item.value)}
//                 label={`${item.label} (${item.count})`}
//               />
//             </label>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Refinement;

import { Checkbox } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRefinementList } from "react-instantsearch";

function Refinement({ attribute, getBrand, getDeviceType }) {
  const { items, refine } = useRefinementList({ attribute });
  const router = useRouter();
  const selectedFilter = router?.query?.model;

  useEffect(() => {
    if (selectedFilter && attribute === "variant.brand") {
      const isAlreadyRefined = items.some(
        (item) => item.value === selectedFilter && item.isRefined
      );
      if (!isAlreadyRefined) {
        refine(selectedFilter);
      }
    }

    if (getBrand) {
      const isBrandRefined = items.some(
        (item) => item.value === getBrand && item.isRefined
      );
      if (!isBrandRefined) {
        refine(getBrand);
      }
    }

    if (getDeviceType) {
      const isDeviceTypeRefined = items.some(
        (item) => item.value === getDeviceType && item.isRefined
      );
      if (!isDeviceTypeRefined) {
        refine(getDeviceType);
      }
    }
  }, [selectedFilter, refine, getBrand, items, getDeviceType]); // Added `items` to dependencies

  return (
    <div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.value}>
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={item.isRefined}
                onChange={() => refine(item.value)}
              />
              <span>
                {item.label} ({item.count})
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Refinement;
