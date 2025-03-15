import { Header } from "@/components";
import NewTradeIn from "@/components/new-tradein";
import { useUser } from "@/context/User";
import { Drawer } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import React, { useState } from "react";

function NewTradeInPage() {
  const [tradeInOpen, setTradeInOpen] = useState(false);
  const { width } = useViewportSize();

  return (
    <div className="bg-slate-100 w-full min-h-screen">
      <Header />
      <div className="p-8 space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-[1.3rem] font-semibold ">
            Trade in your device for cash or upgrade!
          </h1>
          <span
            className="text-[#131c33] font-medium text-[0.8rem] underline hover:cursor-pointer  "
            onClick={() => setTradeInOpen(true)}
          >
            How it works
          </span>
        </div>
        <div className="p-6 bg-white shadow-lg">
          <NewTradeIn />
        </div>

        <Drawer
          position={width > 750 ? "right" : "bottom"}
          size={width > 750 ? "35%" : "90%"}
          opened={tradeInOpen}
          onClose={() => setTradeInOpen(false)}
          title={null}
        >
          <div className="space-y-6 p-2">
            <p className="w-full  text-center pb-4  border-b-[1px]">Trade in</p>
            <img
              src="/step-trade-in.svg"
              alt="trade-in"
              className="rounded-lg"
            />
            <h1 className="font-duplet font-bold text-[1.4rem] text-center">
              How Trade-in works
            </h1>
            <br />
            {[
              {
                title: "Get a price",
                description:
                  "Get an estimate of your device via our Ai powered platform.",
              },
              {
                title: "Bring us the device",
                description:
                  "Visit our shop or send the phone to our shop for a final physical evaluation with the phone receipt or box.",
              },
              {
                title: "Get Paid",
                description: "Get paid instant cash or Upgrade your tech!",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="flex space-x-4 justify-between px-4 border-b-[1px] pb-6"
              >
                <span>
                  <img
                    src={`/${i + 1}.png`}
                    className="min-w-[100px] max-w-[100px]"
                    alt="1"
                  />
                </span>
                <div className="space-y-2">
                  <p className="font-bold">{step?.title}</p>
                  <p className="text-gray-600">{step?.description}</p>
                </div>
              </div>
            ))}
            <br />
          </div>
        </Drawer>
      </div>
    </div>
  );
}

export default NewTradeInPage;
