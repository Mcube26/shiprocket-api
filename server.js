const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const EMAIL = "gunamhatre0312@gmail.com";
const PASSWORD = "p!#wnEY2#0ZWLVW@sB$VyDQWNw*Ic6z9";

let token = "";

// 🔐 Get token
async function getToken() {
  const res = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: EMAIL,
      password: PASSWORD,
    }
  );
  token = res.data.token;
}

// 🚚 Delivery API
app.get("/check-delivery", async (req, res) => {
  try {
    const pincode = req.query.pincode;

    if (!token) await getToken();

    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=400001&delivery_postcode=${pincode}&cod=1&weight=0.5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const couriers = response.data.data.available_courier_companies;

    if (!couriers.length) {
      return res.json({ success: false });
    }

    const fastest = couriers[0];

    res.json({
      success: true,
      days: fastest.estimated_delivery_days,
      courier: fastest.courier_name,
    });

  } catch (err) {
    res.status(500).json({ error: "Error fetching delivery" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});