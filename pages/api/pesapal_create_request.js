import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

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

  // Get registered IPNs

  const get_registered_ipns = {
    method: "get",
    url: "https://pay.pesapal.com/v3/api/URLSetup/GetIpnList",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const { data: ipn_urls } = await axios.request(get_registered_ipns);

  const notification_id = ipn_urls?.find(
    ({ url }) => url == "https://tech-bank.vercel.app/api/pesapal_webhook"
  )?.ipn_id;

  // Send Order Request
  try {
    const data = {
      id: new Date().getTime().toString(),
      currency: "KES",
      amount: req.body.amount,
      description: "Payment description goes here",
      callback_url: "https://tech-bank.vercel.app/account  ",
      redirect_mode: "",
      notification_id,
      branch: "",
      billing_address: {
        email_address: req.body.email,
        phone_number: req.body.phone,
        country_code: "KE",
        first_name: req.body.name.split(/\s+/)[0],
        middle_name: "",
        last_name: req.body.name.split(/\s+/)[1] || "",
        line_1: req.body.town,
        line_2: "",
        city: "",
        state: "",
        postal_code: "",
        zip_code: "",
      },
    };

    console.log(data);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data,
    };

    const { data: response } = await axios.request(config);
    console.log(response);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error submitting order",
      error: error.response?.data || error.message,
    });
  }
}
