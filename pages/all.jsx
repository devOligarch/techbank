import { Footer, Header, ProductCard, SearchCard } from "@/components";
import { Button, Divider, Drawer, Menu, Pill } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/Custom.module.css";
import {
  CurrentRefinements,
  HierarchicalMenu,
  InfiniteHits,
  RangeInput,
  RefinementList,
  SearchBox,
  Stats,
  Configure,
  useInfiniteHits,
} from "react-instantsearch";
import CustomInfiniteHits from "@/components/hits";
import Refinement from "@/components/refinement";
import PriceFilter from "@/components/pricefilter";
import { useViewportSize } from "@mantine/hooks";
import CustomCurrentRefinements from "@/components/currentrefinements";

function All() {
  const { items, isLastPage, showMore } = useInfiniteHits();
  const sentinelRef = useRef(null);

  const router = useRouter();
  const { model, deviceType } = router.query;

  const [checked, setChecked] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [moveUp, setMoveUp] = useState(false);

  const { width } = useViewportSize();

  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore();
          }
        });
      });

      observer.observe(sentinelRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [isLastPage, showMore]);

  return (
    <div className="bg-slate-100">
      <Header />
      <br />

      <div className="px-8 space-y-3">
        <SearchBox placeholder="Search" className="w-full" />

        <div className="flex flex-wrap">
          {/* <CurrentRefinements /> */}

          <CustomCurrentRefinements />
        </div>

        <div className="lg:grid lg:gap-8 lg:grid-cols-5 flex flex-col-reverse">
          <div className=" no-scrollbar col-span-4 lg:grid grid-cols-4 gap-5 overflow-y-auto space-y-2 lg:max-h-[calc(100vh-160px)]">
            {/* <Configure
              filters={
                model
                  ? `brand:"${model}"`
                  : deviceType
                  ? `deviceType:"${deviceType}"`
                  : ""
              }
            /> */}
            <CustomInfiniteHits />
          </div>

          {width > 750 && (
            <div className="col-span-1 overflow-y-auto no-scrollbar max-h-[calc(100vh-160px)]">
              <strong>Product</strong>
              <br />
              <Refinement getDeviceType={deviceType} attribute={"deviceType"} />
              <br />
              <strong>Brand</strong>
              <br />
              <Refinement getBrand={model} attribute={"brand"} />
              <br />
              <strong>Model</strong>
              <Refinement attribute={"model"} /> <br />
              <strong>Storage / Label</strong>
              <Refinement attribute={"storages.label"} />
              <br />
              <strong>Color</strong>
              <Refinement attribute={"colors.label"} />
              <br />
              <strong>Price</strong>
              {/* <RangeInput attribute={"price"} /> */}
              <PriceFilter />
            </div>
          )}
        </div>
      </div>
      <br />

      {width < 750 && (
        <div
          className={`fixed bg-slate-200 bottom-0 w-full p-4 ${
            !moveUp && "translate-y-[430px]"
          } z-[99]`}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-bold text-[1.3rem]">Filters</h1>
            <Button variant="transparent" onClick={() => setMoveUp(!moveUp)}>
              {!moveUp ? <IconChevronUp /> : <IconChevronDown />}
            </Button>
          </div>

          <div className="max-h-[400px] h-[400px] overflow-y-auto  no-scrollbar">
            <br />
            <strong>Product</strong>
            <br />
            <Refinement getDeviceType={deviceType} attribute={"deviceType"} />
            <br />
            <strong>Brand</strong>
            <br />
            <Refinement getBrand={model} attribute={"brand"} />
            <br />
            <strong>Model</strong>
            <Refinement attribute={"model"} /> <br />
            <strong>Storage/ Label</strong>
            <Refinement attribute={"storages.label"} />
            <br />
            <strong>Color</strong>
            <Refinement attribute={"colors.label"} />
            <br />
            <strong>Price</strong>
            {/* <RangeInput attribute={"price"} /> */}
            <PriceFilter />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default All;
