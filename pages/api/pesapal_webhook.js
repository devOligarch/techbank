import axios from "axios";

let receivedData = null;

export default async function handler(req, res) {
  if (req.method === "POST") {
    let orderData = req.body;

    // Get Bearer token
    const auth_data = {
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://pay.pesapal.com/v3/api/Auth/RequestToken",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: auth_data,
    };

    const {
      data: { token },
    } = await axios.request(config);

    console.log("Token : ", token);

    // Get transaction status
    try {
      const config = {
        method: "get",
        url: `https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderData?.OrderTrackingId}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data: response } = await axios.request(config);

      console.log(response);

      receivedData = response;
    } catch (err) {
      console.log("Error get tx status", err);
    }

    return res.status(200).json({
      orderNotificationType: orderData?.OrderNotificationType,
      orderTrackingId: orderData?.OrderTrackingId,
      orderMerchantReference: orderData?.OrderMerchantReference,
      status: 200,
    });
  }

  if (req.method === "GET") {
    if (receivedData) {
      const dataToSend = receivedData;
      receivedData = null;
      return res.status(200).json({ data: dataToSend });
    }
    return res.status(204).end(); // No content if no data
  }

  return res.status(405).json({ message: "Method not allowed" });
}
