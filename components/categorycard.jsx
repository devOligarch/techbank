import { useRouter } from "next/router";
import { useViewportSize } from "@mantine/hooks";

import React, { useEffect, useState } from "react";

function CategoryCard({ img, label, goTo }) {
  const router = useRouter();

  return (
    <div
      className={`bg-white rounded-md p-4 w-[calc(50vw-48px)] aspect-square relative`}
      onClick={() => router.push(goTo)}
    >
      <img
        src={img}
        alt="label"
        className="mx-auto mt-4 mb-2 h-[calc(50vw-112px)] lg:h-[calc(15vw)] object-cover"
      />
      <strong className="w-full text-[0.9rem] text-center absolute translate-x-[-50%] left-[50%] bottom-2">
        {label}
      </strong>
    </div>
  );
}

export default CategoryCard;
