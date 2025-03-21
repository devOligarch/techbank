import { Footer, Header, ProductCard } from "@/components";
import {
  Accordion,
  ActionIcon,
  Badge,
  Button,
  Card,
  ColorSwatch,
  Divider,
  Drawer,
  Group,
  Image,
  Modal,
  NumberInput,
  Radio,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconChevronRight,
  IconHeart,
  IconInfoCircleFilled,
  IconPower,
  IconShieldCheckFilled,
  IconTruck,
  IconTruckDelivery,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import classes from "../../styles/Custom.module.css";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "urql";
import {
  ADD_TO_CART,
  GET_DEVICE,
  GET_SUGGESTIONS,
  GET_VARIANT,
} from "@/lib/request";
import { signIn, useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import models from "@/lib/models.json";
import Loader from "@/components/loader";
import { useUser } from "@/context/User";
import { useViewportSize, useWindowScroll } from "@mantine/hooks";
import moment from "moment";
import Head from "next/head";
import { BreadcrumbJsonLd, NextSeo, ProductJsonLd } from "next-seo";
import AcceptedPayments from "@/components/acceptedpayments";
import { color } from "@cloudinary/url-gen/qualifiers/background";

function Product() {
  const router = useRouter();
  const [scroll, scrollTo] = useWindowScroll();

  const { width } = useViewportSize();
  const { data: session } = useSession();
  const [isSticky, setIsSticky] = useState(false);
  const [tradeInOpen, setTradeInOpen] = useState(false);

  const [loadingAdd, setLoadingAdd] = useState(false);

  const [topBanner, setTopBanner] = useState(true);

  const { user, refreshApp } = useUser();

  const { id } = router.query;

  const [{ data, fetching, error }] = useQuery({
    query: GET_VARIANT,
    variables: {
      getVariantId: id,
    },
  });

  const [_, _addToCart] = useMutation(ADD_TO_CART);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const triggerPoint = 500; // Adjust this value to the point where you want the div to stick

      if (scrollY >= triggerPoint) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAddToCart = () => {
    if (!session?.user?.email) {
      signIn();
      return;
    }

    if (!selection?.color) {
      notifications.show({
        title: "Please select a color option",
        color: "orange",
      });
      return;
    }

    setLoadingAdd(true);

    _addToCart({
      email: session?.user?.email,
      variant: id,
      storage: selection?.storage,
      color: selection?.color,
    })
      .then(({ data }, error) => {
        console.log(data, error);
        if (data?.addToCart && !error) {
          notifications.show({
            message: `"${variant?.model}" added to cart successfully`,
            icon: <IconCheck />,
            color: "green",
          });

          refreshApp();
        } else {
          notifications.show({
            message: `"${variant?.model}" was not added to cart`,
            icon: <IconInfoCircleFilled />,
            color: "orange",
          });
        }
        return;
      })
      .finally(() => {
        setLoadingAdd(false);
      });
  };

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
  };

  const [selection, setSelection] = useState({ storage: null, color: null });

  const variant = data?.getVariant;

  useEffect(() => {
    if (data?.getVariant) {
      setSelection({
        storage: data.getVariant.storages?.[0]?.id ?? null,
        color: null,
      });
    }
  }, [data]);

  const price = variant?.storages?.find(
    (storage) => storage["id"] == selection?.storage
  )?.price;

  return (
    <div>
      <NextSeo
        canonical={`https://tech-bank-ke.vercel.app/products/${id}}`}
        title="TechBank"
        description={
          variant?.description?.length > 150
            ? variant?.description.slice(0, 150) + "..."
            : variant?.description
        }
        titleTemplate={`%s |   ${variant?.brand} ${variant?.model} `}
        robotsProps={{
          nosnippet: false,
          notranslate: true,
          noimageindex: false,
          noarchive: true,
          maxSnippet: -1,
          maxImagePreview: "standard",
          maxVideoPreview: -1,
        }}
      />

      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: variant?.deviceType,
            item: "https://tech-bank-ke.vercel.app/all",
          },
          {
            position: 2,
            name: variant?.brand,
            item: `https://tech-bank-ke.vercel.app/all?model=${variant?.brand}`,
          },
          {
            position: 3,
            name: variant?.model,
            item: `https://tech-bank-ke.vercel.app/all?model=${variant?.brand}`,
          },
        ]}
      />

      <ProductJsonLd
        productName={`${variant?.model}`}
        images={variant?.colors[0]?.images[0]}
        description={variant?.model}
        brand={variant?.brand}
        aggregateRating={{
          ratingValue: "4.8",
          reviewCount: "89",
        }}
        offers={[
          {
            price: variant?.storages[0]?.price?.toLocaleString("en-US"),
            priceCurrency: "KES",
            itemCondition: "https://schema.org/NewCondition",
            availability: "https://schema.org/InStock",
            url: `https://tech-bank-ke.vercel.app/products/${id}}`,
            seller: {
              name: "TechBank",
            },
          },
        ]}
        mpn="925872"
      />

      <Header />
      <div
        className={`${
          !topBanner && "hidden"
        } p-4 bg-[#FFE0B2] flex justify-between items-center`}
      >
        <p className="text-[0.7rem] font-semibold">
          Trade in tech you don&apos;t want for cash you do.{" "}
          <span
            className="underline hover:cursor-pointer"
            onClick={() => router.push("/new-tradein")}
          >
            Get started
          </span>{" "}
        </p>
        <Button
          onClick={() => setTopBanner(false)}
          w={32}
          h={32}
          p={0}
          variant="transparent"
          color="black"
        >
          <IconX />
        </Button>
      </div>
      <div className="p-8">
        <div className="flex justify-between">
          <div className="flex space-x-8">
            <UnstyledButton onClick={() => router.back()} className="mt-[-6px]">
              <IconArrowLeft />
            </UnstyledButton>
            <h1 className="font-semibold">{variant?.model}</h1>
          </div>
          <div>
            {/* <UnstyledButton>
              <IconHeart />
            </UnstyledButton> */}
          </div>
        </div>

        <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="p-8 lg:col-span-1">
            <Carousel
              autoPlay
              showThumbs={false}
              showIndicators={false}
              interval={3000}
              infiniteLoop
              selectedItem={selectedIndex}
              onChange={(index) => setSelectedIndex(index)}
            >
              {variant?.colors
                ?.map(({ images }) => images)
                ?.flat()
                ?.map((img, i) => {
                  return (
                    <div key={i} className="lg:p-12">
                      <img src={img} className="h-[50vh] object-contain" />
                    </div>
                  );
                })}
            </Carousel>

            <div className="flex justify-center gap-2 mt-4">
              {variant?.colors
                ?.map(({ images }) => images)
                ?.flat()
                ?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={image}
                    onClick={() => handleThumbnailClick(index)}
                    className={`
              w-20 h-14 object-contain p-2 rounded-md cursor-pointer transition-all duration-300 
              ${
                selectedIndex === index
                  ? "border-2 border-blue-500 shadow-lg"
                  : "border-2 border-transparent"
              }
            `}
                  />
                ))}
            </div>

            {width > 750 && (
              <TechnicalSpecifications
                specs={variant?.technicalSpecifications}
              />
            )}
          </div>

          <div className="space-y-6 lg:col-span-1">
            <div className="space-y-2">
              <h1 className="font-semibold">
                {variant?.model} -{" "}
                {
                  variant?.storages?.find(
                    (storage) => storage["id"] == selection?.storage
                  )?.label
                }{" "}
                -{" "}
                {
                  variant?.colors?.find(
                    (color) => color["id"] == selection?.color
                  )?.label
                }
              </h1>
              {/* <p>{device?.description}</p> */}
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-semibold lg:text-[2rem] text-[1.5rem]">
                  Ksh.{" "}
                  {variant?.storages
                    ?.find((storage) => storage["id"] == selection?.storage)
                    ?.price?.toLocaleString("en-US")}
                </h1>
                {/* {device?.slashedPrice && (
                  <>
                    <p className="line-through text-[0.8rem] text-gray-500">
                      Ksh. {device?.slashedPrice?.toLocaleString("en-US")}
                    </p>
                    <Badge color="#94f5bc" radius={"xs"} className="mt-2">
                      <p className="text-[#006b40] text-[0.7rem]">
                        Save Ksh.
                        {(
                          device?.slashedPrice - device?.currentPrice
                        )?.toLocaleString("en-US")}
                      </p>
                    </Badge>
                  </>
                )} */}
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                loading={loadingAdd}
                disabled={loadingAdd}
              >
                <p className="text-[0.8rem] font-normal">Add to cart</p>
              </Button>
            </div>
            <div>
              {variant?.financing?.find(
                (_financer) => _financer == "buySimu"
              ) && <BuySimu price={price} width={width} />}

              {variant?.financing?.find(
                (_financer) => _financer == "chanteq"
              ) && <Chanteq price={price} width={width} />}

              <Badge
                color="#edeff3"
                size="lg"
                className="mt-3 w-full"
                onClick={() => setTradeInOpen(true)}
              >
                <div className="flex items-center space-x-4">
                  <img src="/trade-in.svg" className="h-[12px]" />

                  <p className="text-black normal-case font-medium">
                    Get this for even less with trade in
                  </p>
                  <IconChevronRight color="black" size={16} />
                </div>
              </Badge>

              {/* Trade In information */}
              {width < 750 ? (
                <Drawer
                  position="bottom"
                  size="90%"
                  opened={tradeInOpen}
                  onClose={() => setTradeInOpen(false)}
                  title={null}
                >
                  <TradeInInfo />
                </Drawer>
              ) : (
                <Modal
                  opened={tradeInOpen}
                  onClose={() => setTradeInOpen(false)}
                  title={null}
                >
                  <TradeInInfo />
                </Modal>
              )}
            </div>
            <Divider />

            <EveryPurchase />
            <Options
              variant={variant}
              selection={selection}
              setSelection={setSelection}
            />
            {width < 750 && (
              <TechnicalSpecifications
                specs={variant?.technicalSpecifications}
              />
            )}
          </div>
        </div>
      </div>
      <YouMayAlsoLike variant={id} brand={variant?.brand} />
      <div className="p-8 space-y-12">
        <AcceptedPayments />
      </div>
      <Footer />

      <div
        className={`fixed left-0 right-0 p-4 bg-white border border-t-[1px]  transition-transform duration-300 ${
          isSticky ? "bottom-0" : "-bottom-full"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="mt-1">
            <h1 className="font-semibold">
              Ksh. {price?.toLocaleString("en-US")}
            </h1>
            {/* {device?.slashedPrice && (
              <p className="line-through text-[0.8rem] text-gray-500">
                Ksh. {device?.slashedPrice?.toLocaleString("en-US")}
              </p>
            )} */}
          </div>

          <Button
            size="lg"
            onClick={handleAddToCart}
            loading={loadingAdd}
            disabled={loadingAdd}
          >
            <p className="text-[0.8rem] font-normal">Add to cart</p>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Product;

const EveryPurchase = () => {
  return (
    <div>
      <div className="flex space-x-4">
        <ActionIcon
          color="#002540"
          size={48}
          variant="light"
          aria-label="Delivery"
        >
          <IconTruckDelivery />
        </ActionIcon>

        <div className="space-y-1">
          <p className="text-[1rem] font-medium">Free countrywide delivery</p>
          <p className="text-[0.7rem]">
            Estimated arrival from{" "}
            {moment(new Date().setDate(new Date().getDate() + 1)).format(
              "Do MMM"
            )}
            -{" "}
            {moment(new Date().setDate(new Date().getDate() + 2)).format(
              "Do MMM"
            )}
            .Same day delivery within Nairobi
          </p>
        </div>
      </div>

      <br />
      <div className="flex space-x-4">
        <ActionIcon
          color="#002540"
          size={48}
          variant="light"
          aria-label="Delivery"
        >
          <IconShieldCheckFilled />
        </ActionIcon>

        <div className="space-y-1">
          <p className="text-[1rem] font-medium">Verified Refurbished</p>
          <p className="text-[0.7rem]">Quality assured product</p>
        </div>
      </div>
      <br />

      <Divider />
    </div>
  );
};

const Options = ({ variant, selection, setSelection }) => {
  console.log(variant, selection);
  return (
    <div className="space-y-8">
      <div>
        <p className="font-medium text-[1.05rem] mb-2">
          {variant?.deviceType == "Phone" ||
          variant?.deviceType == "Macbook" ||
          variant?.deviceType == "Tablets"
            ? "Storage"
            : "Options"}
        </p>
        <div className="flex gap-4 flex-wrap">
          {variant?.storages?.map((_storage, i) => (
            <div
              key={i}
              onClick={() =>
                setSelection((prev) => ({ color: null, storage: _storage?.id }))
              }
              className={`${
                selection?.storage == _storage?.id && "bg-[#FFE0B2]"
              } flex space-x-3 text-[0.8rem]  rounded-md border border-black hover:cursor-pointer
               p-2 items-center `}
            >
              <span>{_storage?.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="font-medium text-[1.05rem] mb-2">Color</p>
        <div className="flex gap-4 flex-wrap">
          {variant?.colors?.map((_color, i) => (
            <div
              key={i}
              onClick={() => {
                if (
                  variant?.storages
                    ?.find((storage) => storage?.id == selection?.storage)
                    ?.availableColors?.includes(_color?.label)
                ) {
                  setSelection((prev) => ({ ...prev, color: _color?.id }));
                  return;
                } else {
                  return;
                }
              }}
              className={`${
                selection?.color == _color?.id && "bg-[#FFE0B2]"
              } flex space-x-3 text-[0.8rem] relative  rounded-md border ${
                variant?.storages
                  ?.find((storage) => storage?.id == selection?.storage)
                  ?.availableColors?.includes(_color?.label) &&
                "border border-black hover:cursor-pointer"
              } p-2 items-center `}
            >
              {!variant?.storages
                ?.find((storage) => storage?.id == selection?.storage)
                ?.availableColors?.includes(_color?.label) && (
                <span className="absolute rounded-sm bg-red-500 text-[0.5rem] right-[6px]  top-[-6px] text-white px-1">
                  Sold out
                </span>
              )}
              <ColorSwatch color={_color?.colorCode} size={16} />
              <span>{_color?.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[1rem] font-medium">Comes with</p>
        <div className="flex flex-wrap gap-2">
          {/* <div className="flex space-x-2 bg-gray-200 px-4 py-2 rounded-full">
            <Image src="/cable.svg" className="w-[18px] h-[18px] mt-[4px]" />
            <span className="text-[0.8rem] mt-[2px]">Cable</span>
          </div> */}
          {(variant?.deviceType == "Phone" ||
            variant?.deviceType == "Macbook" ||
            variant?.deviceType == "Tablets" ||
            variant?.deviceType == "Apple Watch") && (
            <div className="flex space-x-2 bg-gray-200 px-4 py-2 rounded-full">
              <IconShieldCheckFilled />
              <span className="text-[0.8rem] mt-[2px]">6 months warranty</span>
            </div>
          )}
          <div className="flex space-x-2 bg-gray-200 px-4 py-2 rounded-full">
            <IconTruckDelivery />
            <span className="text-[0.8rem] mt-[2px]">Free shipping</span>
          </div>
        </div>
      </div>

      <Divider />
    </div>
  );
};

const TechnicalSpecifications = ({ specs }) => {
  return (
    <Accordion defaultValue="1">
      <Accordion.Item value="1">
        <Accordion.Control>
          <h1 className=" font-medium">Technical Specifications</h1>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="space-y-2">
            {specs?.map((spec, index) => (
              <div
                key={index}
                className=" border-b-[0.3px] relative grid grid-cols-3 justify-between mb-2 "
              >
                <p className="col-span-1">{spec.label}</p>
                <p className=" col-span-2 item-center text-gray-600 text-right   ">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

const YouMayAlsoLike = ({ variant, brand }) => {
  const [{ data, fetching, error }] = useQuery({
    query: GET_SUGGESTIONS,
    variables: {
      brand,
    },
  });
  return (
    <div className="bg-slate-100 p-8 space-y-8">
      <h1 className="text-[1.3rem] font-semibold">More from {brand}</h1>

      <div className=" no-scrollbar flex flex-nowrap space-x-6 overflow-x-auto">
        {data?.getSuggestions
          ?.filter(({ id }) => id !== variant)
          .map((_variant) => (
            <ProductCard key={_variant?.id} variant={_variant} />
          ))}
      </div>
    </div>
  );
};

const BuySimu = ({ price, width }) => {
  const [buySimuOpen, setBuySimuOpen] = useState(false);

  const getBuySimuMonthly = useCallback((m, p) => {
    let value;

    switch (m) {
      case 1:
        value = (p * 0.6 + 0.3 * p * 0.6 + 0.02 * p) / m;
        break;

      case 2:
        value = (p * 0.6 + 0.4 * p * 0.6 + 0.04 * p) / m;
        break;

      case 3:
        value = (p * 0.6 + 0.5 * p * 0.6 + 0.06 * p) / m;
        break;

      case 4:
        value = (p * 0.5 + 0.6 * p * 0.5 + 0.06 * p) / m;
        break;

      case 5:
        value = (p * 0.5 + 0.7 * p * 0.5 + 0.06 * p) / m;
        break;

      case 6:
        value = (p * 0.5 + 0.8 * p * 0.5 + 0.06 * p) / m;
        break;
    }

    return value || 0;
  }, []);

  const getFinancingDeposit = useCallback((m, p) => {
    if (m === 1 || m === 2 || m === 3) {
      return p * 0.4;
    } else if (m === 4 || m === 5 || m === 6) {
      return p * 0.5;
    }
  }, []);

  return (
    <>
      <p>
        <img src="/bs.png" alt="buysimu" className="h-[24px] mr-2 inline" />
        Buy now , pay later with Buy Simu .{" "}
        <Link
          onClick={() => setBuySimuOpen(true)}
          href="#"
          className="underline cursor-pointer font-semibold"
        >
          Learn more
        </Link>
      </p>

      {width < 750 ? (
        <Drawer
          position="bottom"
          size="90%"
          opened={buySimuOpen}
          onClose={() => setBuySimuOpen(false)}
          title={null}
        >
          <div className="space-y-6 p-2">
            <div className="mx-auto space-y-2">
              <img src="/bs.png" className="mx-auto h-[64px]" alt="" />

              <h1 className="font-duplet font-bold text-[1.4rem] text-center">
                Buy now , pay over time
              </h1>
              <p className="text-gray-600 text-center">
                Check your eligibility below
              </p>
            </div>
            <br />

            <div className="p-4 ">
              <NumberInput
                disabled
                label="Gadget price"
                prefix="Ksh. "
                hideControls
                thousandSeparator=","
                defaultValue={price}
              />
              <br />

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <div className="space-y-4">
                  {[3, 6].map((months, i) => (
                    <div className="space-y-4" key={i}>
                      <Divider
                        label={`${months} months plan`}
                        labelPosition="center"
                      />
                      <div className="flex justify-between">
                        <p>Deposit</p>
                        <p className="text-gray-600">
                          Ksh.{" "}
                          {getFinancingDeposit(months, price).toLocaleString(
                            "en-US"
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p>Monthly pay</p>
                        <p className="text-gray-600">
                          Ksh.{" "}
                          {getBuySimuMonthly(months, price).toLocaleString(
                            "en-US"
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p>Weekly pay</p>
                        <p className="text-gray-600">
                          Ksh.{" "}
                          {(
                            getBuySimuMonthly(months, price) / 4
                          ).toLocaleString("en-US")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <br />
                <Card.Section>
                  <hr />

                  <Accordion>
                    <Accordion.Item value="req">
                      <Accordion.Control>
                        <p className="font-bold">Requirements</p>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <div className="space-y-2">
                          <p className="flex  space-x-4">
                            <span>1.</span>
                            <span>
                              3 month payslip/MPESA statement/Bank statement
                            </span>
                          </p>
                          <p className="flex  space-x-4">
                            <span>2.</span>
                            <span>
                              40% deposit (3 month paymant plan) , 50% deposit
                              (6 month paymant plan )
                            </span>
                          </p>
                          <p className="flex  space-x-4">
                            <span>3.</span>
                            <span>Copy of national ID</span>
                          </p>
                        </div>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Card.Section>
              </Card>

              <br />
              <p className="font-bold">
                How to proceed with{" "}
                <img src="/bs.png" className="h-[36px] inline" alt="buy_simu" />
              </p>

              <br />

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <div className="space-y-4">
                  <div className="flex items-center space-x-5 justify-between">
                    <ActionIcon variant="light" aria-label="1">
                      1
                    </ActionIcon>
                    <p>Load up your cart and select BuySimu at checkout</p>
                  </div>
                  <div className="flex items-center space-x-5 ">
                    <ActionIcon variant="light" aria-label="1">
                      2
                    </ActionIcon>
                    <p>
                      We will contact you of how to send us the requirements
                    </p>
                  </div>
                  <div className="flex items-center space-x-5 justify-between">
                    <ActionIcon variant="light" aria-label="1">
                      3
                    </ActionIcon>
                    <p>
                      Get your device once BuySimu approves your request.
                      That&apos;s it
                    </p>
                  </div>
                </div>
              </Card>

              <br />

              <p className="text-gray-600 leading-6">
                Buy Simu finances a select range of devices. If you are viewing
                this message, financing is available for this specific device.
                Pricing includes interest and an insurance fee. Eligibility
                assessments are conducted upon submission of the required
                documents outlined above.
              </p>
            </div>
          </div>
        </Drawer>
      ) : (
        <Modal
          centered
          opened={buySimuOpen}
          onClose={() => setBuySimuOpen(false)}
          title={null}
        >
          <div className="space-y-6 p-2">
            <div className="mx-auto space-y-2">
              <img src="/bs.png" className="mx-auto h-[64px]" alt="" />

              <h1 className="font-duplet font-bold text-[1.4rem] text-center">
                Buy now , pay over time
              </h1>
              <p className="text-gray-600 text-center">
                Check your eligibility below
              </p>
            </div>
            <br />

            <div className="p-4 ">
              <NumberInput
                disabled
                label="Gadget price"
                prefix="Ksh. "
                hideControls
                thousandSeparator=","
                defaultValue={price}
              />
              <br />

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <div className="space-y-4">
                  {[3, 6].map((months, i) => (
                    <div className="space-y-4" key={i}>
                      <Divider
                        label={`${months} month plan`}
                        labelPosition="center"
                      />
                      <div className="flex justify-between">
                        <p>Deposit</p>
                        <p className="text-gray-600">
                          Ksh.{" "}
                          {getFinancingDeposit(months, price).toLocaleString(
                            "en-US"
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p>Monthly pay</p>
                        <p className="text-gray-600">
                          Ksh.{" "}
                          {getBuySimuMonthly(months, price).toLocaleString(
                            "en-US"
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p>Weekly pay</p>
                        <p className="text-gray-600">
                          Ksh.{" "}
                          {(
                            getBuySimuMonthly(months, price) / 4
                          ).toLocaleString("en-US")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <br />
                <Card.Section>
                  <hr />

                  <Accordion>
                    <Accordion.Item value="req">
                      <Accordion.Control>
                        <p className="font-bold">Requirements</p>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <div className="space-y-2">
                          <p className="flex  space-x-4">
                            <span>1</span>
                            <span>
                              3 month payslip/MPESA statement/Bank statement
                            </span>
                          </p>
                          <p className="flex  space-x-4">
                            <span>2</span>
                            <span>
                              40% deposit (3 month paymant plan) , 50% deposit
                              (6 month paymant plan )
                            </span>
                          </p>
                          <p className="flex  space-x-4">
                            <span>3</span>
                            <span>Copy of national ID</span>
                          </p>
                        </div>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Card.Section>
              </Card>

              <br />
              <p className="font-bold">
                How to proceed with{" "}
                <img src="/bs.png" className="h-[36px] inline" alt="buy_simu" />
              </p>

              <br />

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <div className="space-y-4">
                  <div className="flex items-center space-x-5 justify-between">
                    <ActionIcon variant="light" aria-label="1">
                      1
                    </ActionIcon>
                    <p>Load up your cart and select BuySimu at checkout</p>
                  </div>
                  <div className="flex items-center space-x-5 ">
                    <ActionIcon variant="light" aria-label="1">
                      2
                    </ActionIcon>
                    <p>
                      We will contact you of how to send us the requirements
                    </p>
                  </div>
                  <div className="flex items-center space-x-5 justify-between">
                    <ActionIcon variant="light" aria-label="1">
                      3
                    </ActionIcon>
                    <p>
                      Get your device once BuySimu approves your request.
                      That&apos;s it
                    </p>
                  </div>
                </div>
              </Card>

              <br />

              <p className="text-gray-600 leading-6">
                Buy Simu finances a select range of devices. If you are viewing
                this message, financing is available for this specific device.
                Pricing includes interest and an insurance fee. Eligibility
                assessments are conducted upon submission of the required
                documents outlined above.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

const Chanteq = ({ width, price }) => {
  const [chantechOpen, setChantechOpen] = useState(false);

  const getFinancingDeposit = useCallback((m, p) => {
    if (m === 1 || m === 2 || m === 3) {
      return p * 0.4;
    } else if (m === 4 || m === 5 || m === 6) {
      return p * 0.5;
    }
  }, []);

  const getChantechMonthly = useCallback((m, p) => {
    let value;

    switch (m) {
      case 1:
        value = (p * 0.6 + 0.3 * p * 0.6) / m;
        break;

      case 2:
        value = (p * 0.6 + 0.4 * p * 0.6) / m;
        break;

      case 3:
        value = (p * 0.6 + 0.5 * p * 0.6) / m;
        break;

      case 4:
        value = (p * 0.5 + 0.6 * p * 0.5) / m;
        break;

      case 5:
        value = (p * 0.5 + 0.7 * p * 0.5) / m;
        break;

      case 6:
        value = (p * 0.5 + 0.8 * p * 0.5) / m;
        break;
    }

    return value || 0;
  }, []);

  return (
    <>
      <p className="mt-2">
        <img
          src="/chanteq.png"
          alt="chanteq"
          className="h-[32px] mr-2 inline"
        />
        Buy now , pay later with Chanteq .{" "}
        <Link
          onClick={() => setChantechOpen(true)}
          href="#"
          className="underline cursor-pointer font-semibold"
        >
          Learn more
        </Link>
      </p>

      {width < 750 ? (
        <Drawer
          position="bottom"
          size="90%"
          opened={chantechOpen}
          onClose={() => setChantechOpen(false)}
          title={null}
        >
          <div className="space-y-6 p-2">
            <div className="mx-auto space-y-2">
              <img
                src="/chanteq.png"
                className="mx-auto h-[64px]"
                alt="Chanteq"
              />

              <h1 className="font-duplet font-bold text-[1.4rem] text-center">
                Buy now , pay over time
              </h1>
              <p className="text-gray-600 text-center">
                Check your eligibility below
              </p>
            </div>
            <br />

            <div className="p-4 ">
              <NumberInput
                disabled
                label="Gadget price"
                prefix="Ksh. "
                hideControls
                thousandSeparator=","
                defaultValue={price}
              />
              <br />

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <div className="space-y-4">
                  {[3, 6].map((months, i) => (
                    <div className="space-y-4" key={i}>
                      <Divider
                        label={`${months} month plan`}
                        labelPosition="center"
                      />
                      <div className="flex justify-between">
                        <p>Deposit</p>
                        <p className="text-gray-600">
                          Ksh.{" "}
                          {getFinancingDeposit(months, price).toLocaleString(
                            "en-US"
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p>Monthly pay</p>
                        <p className="text-gray-600">
                          Ksh.{" "}
                          {getChantechMonthly(months, price).toLocaleString(
                            "en-US"
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p>Weekly pay</p>
                        <p className="text-gray-600">
                          Ksh.{" "}
                          {(
                            getChantechMonthly(months, price) / 4
                          ).toLocaleString("en-US")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <br />
                <Card.Section>
                  <hr />

                  <Accordion>
                    <Accordion.Item value="req">
                      <Accordion.Control>
                        <p className="font-bold">Requirements</p>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <div className="space-y-2">
                          <p className="flex  space-x-4">
                            <span>1.</span>
                            <span>
                              3 month payslip/MPESA statement/Bank statement
                            </span>
                          </p>
                          <p className="flex  space-x-4">
                            <span>2.</span>
                            <span>
                              40% deposit (3 month paymant plan) , 50% deposit
                              (6 month paymant plan )
                            </span>
                          </p>
                          <p className="flex  space-x-4">
                            <span>3.</span>
                            <span>Copy of national ID</span>
                          </p>
                        </div>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Card.Section>
              </Card>

              <br />
              <p className="font-bold">
                How to proceed with{" "}
                <img
                  src="/chanteq.png"
                  className="h-[36px] inline"
                  alt="chanteq"
                />
              </p>

              <br />

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <div className="space-y-4">
                  <div className="flex items-center space-x-5 justify-between">
                    <ActionIcon variant="light" aria-label="1">
                      1
                    </ActionIcon>
                    <p>Load up your cart and select Chanteq at checkout</p>
                  </div>
                  <div className="flex items-center space-x-5 ">
                    <ActionIcon variant="light" aria-label="1">
                      2
                    </ActionIcon>
                    <p>
                      We will contact you of how to send us the requirements
                    </p>
                  </div>
                  <div className="flex items-center space-x-5 justify-between">
                    <ActionIcon variant="light" aria-label="1">
                      3
                    </ActionIcon>
                    <p>
                      Get your device once Chanteq approves your request.
                      That&apos;s it
                    </p>
                  </div>
                </div>
              </Card>

              <br />

              <p className="text-gray-600 leading-6">
                Chanteq finances a select range of devices. If you are viewing
                this message, financing is available for this specific device.
                Pricing includes interest but excludes insurance. Eligibility
                assessments are conducted upon submission of the required
                documents outlined above.
              </p>
            </div>
          </div>
        </Drawer>
      ) : (
        <Modal
          opened={chantechOpen}
          onClose={() => setChantechOpen(false)}
          title={null}
        >
          <div className="space-y-6 p-2">
            <div className="mx-auto space-y-2">
              <img src="/chanteq.png" className="mx-auto h-[64px]" alt="" />

              <h1 className="font-duplet font-bold text-[1.4rem] text-center">
                Buy now , pay over time
              </h1>
              <p className="text-gray-600 text-center">
                Check your eligibility below
              </p>
            </div>
            <br />

            <div className="p-4 ">
              <NumberInput
                disabled
                label="Gadget price"
                prefix="Ksh. "
                hideControls
                thousandSeparator=","
                defaultValue={price}
              />
              <br />

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <div className="space-y-4">
                  {[3, 6].map((months, i) => (
                    <div className="space-y-4" key={i}>
                      <Divider
                        label={`${months} month plan`}
                        labelPosition="center"
                      />
                      <div className="flex justify-between">
                        <p>Deposit</p>
                        <p className="text-gray-600">
                          Ksh.{" "}
                          {getFinancingDeposit(months, price).toLocaleString(
                            "en-US"
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p>Monthly pay</p>
                        <p className="text-gray-600">
                          Ksh.{" "}
                          {getChantechMonthly(months, price).toLocaleString(
                            "en-US"
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p>Weekly pay</p>
                        <p className="text-gray-600">
                          Ksh.{" "}
                          {(
                            getChantechMonthly(months, price) / 4
                          ).toLocaleString("en-US")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <br />
                <Card.Section>
                  <hr />

                  <Accordion>
                    <Accordion.Item value="req">
                      <Accordion.Control>
                        <p className="font-bold">Requirements</p>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <div className="space-y-2">
                          <p className="flex  space-x-4">
                            <span>1</span>
                            <span>
                              3 month payslip/MPESA statement/Bank statement
                            </span>
                          </p>
                          <p className="flex  space-x-4">
                            <span>2</span>
                            <span>
                              40% deposit (3 month paymant plan) , 50% deposit
                              (6 month paymant plan )
                            </span>
                          </p>
                          <p className="flex  space-x-4">
                            <span>3</span>
                            <span>Copy of national ID</span>
                          </p>
                        </div>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Card.Section>
              </Card>

              <br />
              <p className="font-bold">
                How to proceed with{" "}
                <img
                  src="/chanteq.png"
                  className="h-[36px] inline"
                  alt="chanteq"
                />
              </p>

              <br />

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <div className="space-y-4">
                  <div className="flex items-center space-x-5 justify-between">
                    <ActionIcon variant="light" aria-label="1">
                      1
                    </ActionIcon>
                    <p>Load up your cart and select Chanteq at checkout</p>
                  </div>
                  <div className="flex items-center space-x-5 ">
                    <ActionIcon variant="light" aria-label="1">
                      2
                    </ActionIcon>
                    <p>
                      We will contact you of how to send us the requirements
                    </p>
                  </div>
                  <div className="flex items-center space-x-5 justify-between">
                    <ActionIcon variant="light" aria-label="1">
                      3
                    </ActionIcon>
                    <p>
                      Get your device once Chanteq approves your request.
                      That&apos;s it
                    </p>
                  </div>
                </div>
              </Card>

              <br />

              <p className="text-gray-600 leading-6">
                Chanteq finances a select range of devices. If you are viewing
                this message, financing is available for this specific device.
                Pricing includes interest but excludes insurance. Eligibility
                assessments are conducted upon submission of the required
                documents outlined above.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

const TradeInInfo = () => {
  return (
    <div className="space-y-6 p-2">
      <p className="w-full  text-center pb-4  border-b-[1px]">Trade in</p>
      <img src="/step-trade-in.svg" alt="trade-in" className="rounded-lg" />

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
      <Button
        fullWidth
        variant="outline"
        color="dark"
        size="lg"
        onClick={() => router.push("/new-tradein")}
      >
        Get started
      </Button>
      <br />
    </div>
  );
};
