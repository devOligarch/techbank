import {
  Accordion,
  Badge,
  Button,
  ColorSwatch,
  Image,
  Text,
  Timeline,
  Tooltip,
} from "@mantine/core";
import {
  IconCircleCheck,
  IconClipboard,
  IconCubeSend,
  IconReceipt,
} from "@tabler/icons-react";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/Accordion.module.css";
import { useViewportSize } from "@mantine/hooks";

function Orders({ orders }) {
  const { width } = useViewportSize();
  const router = useRouter();

  if (orders?.length > 0) {
    return (
      <div className="py-8 space-y-6">
        {orders.map((order, i) => (
          <Order order={order} key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="py-8 ">
      <div className="bg-white rounded-lg p-8 lg:flex lg:m-24">
        {width > 750 && <img src="/no-order.svg" className="mx-auto" />}

        <div>
          <h1 className="text-[1.4rem] font-semibold">
            It is pretty hard to believe
          </h1>
          <br />
          <p className="text-gray-600">
            But it looks like you haven&apos;t purchased anything on TechBank
            yet.
          </p>
          <br />
          {width < 750 && <img src="/no-order.svg" className="mx-auto" />}
          <br />
          <Button size="lg" fullWidth onClick={() => router.push("/all")}>
            Shop sweet deals
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Orders;

const Order = ({ order }) => {
  let completed =
    order?.saleInfo?.delivery?.dispatchTime &&
    order?.saleInfo?.delivery?.collectionTime;

  const primaryIndex =
    order?.variant?.colors?.find((color) => color["id"] == order?.color)
      ?.primaryIndex || 0;

  return (
    <Accordion classNames={{ root: styles.root }}>
      <Accordion.Item value="tracking">
        <Accordion.Control>
          <div className=" bg-white rounded-lg relative">
            {completed && (
              <div className="flex space-x-2 bg-green-200 rounded-md py-1 px-2 w-[120px]  absolute top-[-12px] right-[0px]">
                <IconCircleCheck size={20} />
                <span className="text-[0.8rem] ">Completed</span>
              </div>
            )}

            {order?.saleInfo?.payment?.timestamp &&
              !order?.saleInfo?.delivery?.dispatchTime &&
              !order?.saleInfo?.delivery?.collectionTime && (
                <div className="flex space-x-2 bg-blue-200 rounded-md py-1 px-2 w-[120px]  absolute top-[-12px] right-[0px]">
                  <IconReceipt size={20} />
                  <span className="text-[0.8rem] ">Processing</span>
                </div>
              )}

            {order?.saleInfo?.delivery?.dispatchTime &&
              !order?.saleInfo?.delivery?.collectionTime && (
                <div className="flex space-x-2 bg-orange-200 rounded-md py-1 px-2 w-[120px]  absolute top-[-12px] right-[0px]">
                  <IconCubeSend size={20} />
                  <span className="text-[0.8rem] ">In transit</span>
                </div>
              )}

            <br />
            <div className="flex space-x-4 items-center">
              <div>
                <img
                  className="h-[85px] w-auto object-contain"
                  src={
                    order?.variant?.colors?.find(
                      (color) => color["id"] == order?.color
                    )?.images[primaryIndex]
                  }
                />
              </div>
              <div className="space-y-1">
                <p className=" font-semibold ">
                  {order?.variant?.model} -{" "}
                  {
                    order?.variant?.storages?.find(
                      (storage) => storage["id"] == order?.storage
                    )?.label
                  }{" "}
                  -{" "}
                  {
                    order?.variant?.colors?.find(
                      (color) => color["id"] == order?.color
                    )?.label
                  }
                </p>
                <div className="flex space-x-2">
                  {/* <p className="text-[0.7rem] text-gray-500">
                    {order?.description}
                  </p> */}
                </div>
                <p className=" font-semibold text-slate-500 ">
                  Ksh.{" "}
                  {order?.saleInfo?.payment?.amount?.toLocaleString("en-US")}
                </p>

                {/* {getSlashedPrice(order) && (
                  <div className="flex space-x-2">
                    <Badge color="#94f5bc" radius={"xs"} p={4}>
                      <p className="text-[#006b40] text-[0.5rem]">
                        Save Ksh.
                        {(
                          getSlashedPrice(order) - getCurrentPrice(order)
                        ).toLocaleString("en-US")}
                      </p>
                    </Badge>
                    <p className="line-through text-[0.8rem] text-gray-500">
                      Ksh. {getSlashedPrice(order).toLocaleString("en-US")}
                    </p>
                  </div>
                )} */}
              </div>
            </div>
            <br />
          </div>
        </Accordion.Control>
        <Accordion.Panel>
          <Timeline
            color="#002540"
            active={
              order?.saleInfo?.delivery?.dispatchTime &&
              !order?.saleInfo?.delivery?.collectionTime
                ? 1
                : completed
                ? 3
                : 0
            }
            bulletSize={12}
            lineWidth={2}
          >
            <Timeline.Item title={<p>Paid</p>}>
              <p className="text-gray-500">
                {moment(
                  new Date(parseInt(order?.saleInfo?.payment?.timestamp))
                ).format("Do MMM")}
              </p>
            </Timeline.Item>
            <Timeline.Item title={<p>Order dispatched , in transit now</p>}>
              {order?.saleInfo?.delivery?.dispatchTime && (
                <p className="text-gray-500">
                  {moment(
                    new Date(parseInt(order?.saleInfo?.delivery?.dispatchTime))
                  ).format("Do MMM")}
                </p>
              )}
            </Timeline.Item>
            <Timeline.Item
              title={completed ? <p>Collected</p> : <p>Estimated delivery</p>}
            >
              <p className="text-gray-500">
                {" "}
                {completed
                  ? moment(
                      new Date(
                        parseInt(order?.saleInfo?.delivery?.collectionTime)
                      )
                    ).format("Do MMM")
                  : moment(
                      new Date(
                        parseInt(order?.saleInfo?.payment?.timestamp) +
                          172800000
                      )
                    ).format("Do MMM") +
                    "-" +
                    moment(
                      new Date(
                        parseInt(order?.saleInfo?.payment?.timestamp) +
                          2 * 172800000
                      )
                    ).format("Do MMM")}
              </p>
            </Timeline.Item>
          </Timeline>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
