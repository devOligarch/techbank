import { Button, Modal, NumberInput, TextInput } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

function Test() {
  const [tx, setTx] = useState({
    amount: null,
    phone: null,
  });
  const [loading, setLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentLink, setPaymentLink] = useState(null);
  const [webhookData, setWebhookData] = useState(null);

  const handleInitiateTx = async () => {
    setLoading(true);

    if (!paymentLink) {
      try {
        const { data } = await axios.post("/api/pesapal_create_request", tx, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setPaymentLink(data?.redirect_url);
        console.log(data);
        setPaymentModalOpen(true);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      setPaymentModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setPaymentModalOpen(false);
    setPaymentLink(null);
    setLoading(false);
  };

  // useEffect(() => {
  //   const eventSource = new EventSource("/api/webhook_test");

  //   eventSource.onmessage = function (event) {
  //     const receivedData = JSON.parse(event.data);
  //     console.log("Received Data from Webhook:", receivedData);
  //   };

  //   // Clean up the connection when the component is unmounted
  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);

  // const [sseConnection, setSSEConnection] = useState(null);

  // const listenToSSEUpdates = useCallback(() => {
  //   console.log("listenToSSEUpdates func");
  //   const eventSource = new EventSource("/api/webhook_test");
  //   eventSource.onopen = () => {
  //     console.log("SSE connection opened.");
  //     // Save the SSE connection reference in the state
  //   };
  //   eventSource.onmessage = (event) => {
  //     const data = event.data;
  //     console.log("Received SSE Update:", data);

  //     // Update your UI or do other processing with the received data
  //   };
  //   eventSource.onerror = (event) => {
  //     console.error("SSE Error:", event);
  //     // Handle the SSE error here
  //   };
  //   setSSEConnection(eventSource);
  //   return eventSource;
  // }, []);

  // useEffect(() => {
  //   listenToSSEUpdates();
  //   return () => {
  //     if (sseConnection) {
  //       sseConnection.close();
  //     }
  //   };
  // }, [listenToSSEUpdates]);

  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     console.dir(sseConnection);
  //     if (sseConnection) {
  //       console.info("Closing SSE connection before unloading the page.");
  //       sseConnection.close();
  //     }
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   // Clean up the event listener when the component is unmounted
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [sseConnection]);

  const [data, setData] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/webhook_test"); // Adjust based on your API route

    eventSource.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      console.log("Received:", receivedData);
      setData(receivedData);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="p-12 space-y-8">
      <strong>Pesa Pal sandbox</strong>

      <NumberInput
        label="Amount"
        prefix="Ksh."
        thousandSeparator
        value={tx?.amount}
        onChange={(val) => setTx((prev) => ({ ...prev, amount: val }))}
      />

      <TextInput
        label="Phone number"
        value={tx?.phone}
        onChange={(e) => setTx((prev) => ({ ...prev, phone: e.target.value }))}
      />

      {tx?.amount && tx?.phone && (
        <Button
          onClick={handleInitiateTx}
          loading={loading}
          disabled={loading}
          fullWidth
        >
          Initiate TX
        </Button>
      )}

      <Modal centered opened={paymentModalOpen} onClose={handleCloseModal}>
        <iframe
          className="no-scrollbar border-none"
          src={paymentLink}
          width="100%"
          height="500px"
        />
      </Modal>
    </div>
  );
}

export default Test;
