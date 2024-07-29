require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(
  "sk_test_51PhnxtAcwg36T09wknSRnNKqDluTtcSq1bsOomF9IudQLZ7HzABgddT9r4xC9xTiofVuV72oVZgnwi8HxcGmd9D300ncMAqoDO"
);
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/subscription", async (req, res) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(
      "sub_1Phok8Acwg36T09wlcuMXho3",
      {
        default_payment_method: "req_8XYLO8OnbihyAq", // Replace with actual ID
      }
    );

    res.json(subscription);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/subscription-payment", async (req, res) => {
  try {
    const subscriptionId = "sub_1Phok8Acwg36T09wlcuMXho3";
    if (!subscriptionId) {
      return res.status(400).json({ error: "Subscription ID is required" });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription.default_payment_method) {
      return res.status(404).json({ error: "Payment method not found" });
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(
      subscription.default_payment_method
    );

    const paymentDetails = {
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
    };
    res.json(paymentDetails);
  } catch (error) {
    console.error("Error retrieving subscription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
