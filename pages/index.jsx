import { CategoryCard, Footer, Header, ProductCard } from "@/components";
import { Carousel } from "react-responsive-carousel";
import { Accordion, Button, Image, Skeleton, Tooltip } from "@mantine/core";

import { useRouter } from "next/router";
import { useQuery } from "urql";
import { GET_LANDING } from "@/lib/request";
import {
  IconBellDollar,
  IconCoins,
  IconPigMoney,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Offer from "@/components/offer";
import { useUser } from "@/context/User";
import HierarchialMenu from "@/components/HierarchialMenu";
import { HierarchicalMenu, RefinementList } from "react-instantsearch";
import { useViewportSize } from "@mantine/hooks";
import Loader from "@/components/loader";

// SEO
import {
  CorporateContactJsonLd,
  FAQPageJsonLd,
  LogoJsonLd,
  NextSeo,
} from "next-seo";
import AcceptedPayments from "@/components/acceptedpayments";

export default function Home() {
  const { width } = useViewportSize();
  const router = useRouter();
  const [topBanner, setTopBanner] = useState(true);

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: GET_LANDING,
  });

  const landing = data?.getLanding;

  return (
    <main className="bg-slate-100 relative no-scrollbar">
      <NextSeo
        title="Tech Bank - Official Website | Africa’s Premium Refurbished Tech Marketplace"
        description="Visit Tech Bank' sofficial website to explore affordable smartphones, trade-in services, and flexible payment plans in Africa."
        canonical="https://tech-bank-ke.vercel.app"
        openGraph={{
          url: "https://tech-bank-ke.vercel.app",
          title: "Tech Bank - Buy, Sell, Trade-In & Lipa Pole Pole Phones",
          description:
            "Visit Tech Bank's official website for the best phone deals, trade-ins, and flexible payment plans.",
          images: [
            {
              url: "/logo.webp", // Carousel 1
              width: 800,
              height: 600,
              alt: "Tech Bank's official website - Affordable smartphones in Kenya",
              type: "image/jpeg",
            },
          ],
          siteName: "Tech Bank",
        }}
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

      <CorporateContactJsonLd
        url="https://tech-bank-ke.vercel.app"
        logo="/logo.png"
        contactPoint={[
          {
            telephone: "+254705820082",
            contactType: "Customer service",
            email: "info@techbank.co.ke",
            areaServed: "KE",
            availableLanguage: ["English"],
          },
        ]}
      />

      <FAQPageJsonLd
        mainEntity={[
          {
            questionName: "How long is the delivery time?",
            acceptedAnswerText: "1-2 business days.",
          },
          {
            questionName: "How does TechBank guarantee quality?",
            acceptedAnswerText:
              "From a pre-listing screening process , we make sure to only sell you authentic products. It's also why every device comes with a 6 month warranty and 30 days to change your mind.",
          },
          {
            questionName: "What’s the difference between refurbished and new?",
            acceptedAnswerText:
              "On the outside, a refurbished smartphone looks and works like new. But it's what's on the inside that really counts. Refurbished tech helps keep e-waste out of our landfills, water, and air.",
          },
        ]}
      />

      <LogoJsonLd
        logo="/logo.webp" //URL
        url="https://tech-bank-ke.vercel.app"
      />

      <Header />

      <div
        className={`${
          !topBanner && "hidden"
        } p-4 bg-[#FFE0B2] flex justify-between items-center top-0 sticky `}
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

      <Carousel
        autoPlay
        showThumbs={false}
        showIndicators={false}
        interval={3000}
        transitionTime={500}
        swipeScrollTolerance={5}
        infiniteLoop
        showStatus={false}
        swipeable
        stopOnHover
      >
        {fetching ? (
          <div>
            <Skeleton height={width < 750 ? width : 300} width={width} />
          </div>
        ) : (
          landing?.carousels?.map((carousel, i) => (
            <div key={i} onClick={() => router.push(`${carousel?.link}`)}>
              {width < 750 ? (
                <img
                  alt="Tech Bank's website - Affordable smartphones in Africa"
                  className="aspect-square object-contain"
                  onClick={() => router.push(`/${carousel?.link}`)}
                  src={carousel?.smallScreen}
                />
              ) : (
                <img
                  onClick={() => router.push(`/${carousel?.link}`)}
                  src={carousel?.largeScreen}
                />
              )}
            </div>
          ))
        )}
      </Carousel>

      <div className="px-8 py-16 pt-8">
        {/* Offers */}

        {landing?.runningOffers?.length > 0 &&
          landing?.runningOffers?.map((offer, i) => (
            <Offer key={i} offer={offer} />
          ))}

        {/* Available brands */}

        <MostWanted />

        <LipaPolePole />
        <AvailableBrands />

        <Bestsellers landing={landing} />

        <Accessories />

        <TradeInLanding />

        <FAQs />

        <AcceptedPayments />

        <HelpAction />
      </div>
      <section id="footer">
        <Footer />
      </section>
    </main>
  );
}

const LipaPolePole = () => {
  const router = useRouter();
  return (
    <div className="lg:flex justify-center mt-12 lg:items-center lg:px-12 lg:space-x-12 my-8">
      <div className="lg:w-2/5">
        <h1 className="lg:text-[2rem] text-[1.3rem] font-semibold">
          Lipa Pole Pole for Your Dream Phone!
        </h1>
        <br />
        <p className="text-gray-700 lg:text-[0.9rem]">
          With Lipa Pole Pole, you can own the smartphone you’ve always wanted
          and pay for it in easy, affordable installments. No stress, no large
          upfront payments – just flexible financing that works for you!
        </p>
        <br />
        <Button
          onClick={() => router.push("/all")}
          fullWidth
          className="outline outline-[0.7px]"
        >
          <p className="font-normal">Start your search</p>
        </Button>
      </div>
      <br />
      <img
        src="/banners/lpp.webp"
        alt="lipa pole pole"
        className="rounded-md mx-auto lg:w-2/5"
      />
    </div>
  );
};

const Bestsellers = ({ landing }) => {
  return (
    <>
      <br />

      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-[1.1rem] font-semibold">Best deals</h1>
        </div>

        <Link href="/all" className="underline text-[0.8rem]">
          See all devices
        </Link>
      </div>
      <br />

      <br />
      <div className=" flex flex-nowrap space-x-6 overflow-x-auto no-scrollbar">
        {landing?.bestSellers?.map((variant) => (
          <ProductCard bestSeller key={variant?.id} variant={variant} />
        ))}
      </div>
      <br />
    </>
  );
};

const MostWanted = () => {
  return (
    <>
      <br />
      <div className="space-y-1">
        <h1 className="text-[1.1rem] font-semibold">Shop our most wanted</h1>
      </div>
      <br />

      <br />

      <div className="flex flex-wrap lg:flex-nowrap gap-8">
        {[
          {
            label: "iPhones",
            img: "/products/iPhone.webp",
            goTo: "/all?model=Apple",
          },
          {
            label: "iPads & Tablets",
            img: "/products/iPad.webp",
            goTo: "/all?deviceType=Tablets",
          },
          {
            label: "MacBooks",
            img: "/products/mac.webp",
            goTo: "/all?deviceType=Macbook",
          },
          {
            label: "Samsungs",
            img: "/products/Samsung.webp",
            goTo: "/all?model=Samsung",
          },
        ].map((category, i) => (
          <CategoryCard
            key={i}
            label={category?.label}
            img={category?.img}
            goTo={category?.goTo}
          />
        ))}
      </div>

      <br />
    </>
  );
};

const AvailableBrands = () => {
  return (
    <div className="my-8">
      <div className="space-y-1">
        <h1 className="text-[1.1rem] font-semibold">Brands we sell</h1>
      </div>
      <br />

      <br />

      <div className="grid mx-auto lg:grid-cols-4 gap-8 grid-cols-2">
        {["Apple", "Samsung", "OnePlus", "Google Pixel"].map((brand) => (
          <div
            key={brand}
            className="col-span-1 rounded-md bg-white aspect-square flex items-center justify-center "
          >
            <div>
              <Link href={`/all?model=${brand}`}>
                <img
                  alt={brand}
                  className={`lg:h-[64px] h-[32px] ${
                    brand == "samsumg" && "h-[128px]"
                  }`}
                  src={`/brands/${brand}.png`}
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Accessories = () => {
  return (
    <div className="my-12">
      <div className="space-y-1">
        <h1 className="text-[1.1rem] font-semibold ">Accessories</h1>
        <p className="text-gray-500 text-[0.9rem]">
          We are more than just smartphones & laptops
        </p>
      </div>
      <br />

      <br />
      <div className="flex flex-wrap lg:flex-nowrap gap-8">
        {[
          {
            label: "Apple Watches",
            img: "/products/AppleWatch.webp",
            goTo: "/all?deviceType=Apple%20Watch",
          },
          {
            label: "Airpods & Earphones",
            img: "/products/Airpods.webp",
            goTo: "/all?deviceType=Airpods%20%2F%20Earphones",
          },
          {
            label: "Chargers",
            img: "/products/Charger.webp",
            goTo: "/all?deviceType=Charger",
          },
          {
            label: "Phone cases",
            img: "/products/protector.webp",
            goTo: "/all?deviceType=Phone%20case",
          },
        ].map((category, i) => (
          <CategoryCard
            key={i}
            label={category?.label}
            img={category?.img}
            goTo={category?.goTo}
          />
        ))}
      </div>
    </div>
  );
};

const FAQs = () => {
  return (
    <div className="space-y-8 my-4 lg:mx-12 mb-16">
      <h1 className="text-[1.3rem] font-semibold">FAQs</h1>
      <Accordion defaultValue="1">
        <Accordion.Item key={1} value="1">
          <Accordion.Control>
            <h1 className=" font-medium"> How long is the delivery time?</h1>
          </Accordion.Control>
          <Accordion.Panel>
            <p className="text-gray-500">
              Delivery times vary depending on your location and the selected
              shipping method. Typically, orders are delivered within 1-2
              business days and in the same day within Nairobi.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key={2} value="2">
          <Accordion.Control>
            <h1 className=" font-medium">
              {" "}
              How does TechBank guarantee quality?
            </h1>
          </Accordion.Control>
          <Accordion.Panel>
            <p className="text-gray-500">
              From a pre-listing screening process , we make sure to only sell
              you authentic products. It&apos;s also why every device comes with
              a 6 month warranty.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key={3} value="3">
          <Accordion.Control>
            <h1 className=" font-medium">
              {" "}
              What’s the difference between refurbished and new?
            </h1>
          </Accordion.Control>
          <Accordion.Panel>
            <p className="text-gray-500">
              On the outside, a refurbished smartphone looks and works like new.
              But it&apos;s what&apos;s on the inside that really counts.
              Refurbished tech helps keep e-waste out of our landfills, water,
              and air.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

const TradeInLanding = () => {
  const router = useRouter();
  return (
    <div className="lg:flex lg:items-center lg:px-12 lg:space-x-12 my-8">
      <img
        src="/tradein.png"
        alt="tade-in"
        className="rounded-md mx-auto lg:w-2/5"
      />
      <br />

      <div className="lg:w-2/5">
        <h1 className="lg:text-[2rem] text-[1.3rem] font-semibold">
          Trade in. Upgrade. Save.
        </h1>
        <br />
        <p className="text-gray-700 lg:text-[0.9rem]">
          Trade in your old iPhone, Samsung, iPad, or MacBook and get top value
          towards your next purchase at Africa’s Premium Refurbished Tech
          Marketplace. Discover unbeatable deals on certified refurbished
          devices and save big. Upgrade today!
        </p>
        <br />
        <Button
          onClick={() => router.push("/new-tradein")}
          fullWidth
          color="black"
          variant="transparent"
          className="outline outline-[0.7px]"
        >
          <p className="font-normal">Get started</p>
        </Button>
      </div>
    </div>
  );
};

const HelpAction = () => {
  return (
    <div className="bottom-4 fixed z-[999] right-4">
      <Link
        href="https://wa.link/qlxza9"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Tooltip label="Need any help? Talk to one of our staff">
          <img
            src="/socials/whatsapp.webp"
            className="w-[48px] hover:cursor-pointer"
            alt="whatsapp"
          />
        </Tooltip>
      </Link>
    </div>
  );
};
