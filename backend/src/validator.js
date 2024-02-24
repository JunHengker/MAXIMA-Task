const { z } = require('zod');

const customerData = z.object({
  customer_name: z.string().min(1).max(255),
  email: z.string().email(),
  city: z.string().min(1).max(255),
});

const orderData = z.object({
    customer_id: z.number().positive(),
    total_amount: z.number().positive()
});
  

const pastiin = (req, res, next) => {
    const hasil = customerData.safeParse(req.body);
    if (hasil.success) {
      req.aman = hasil.data;
      next();
    } else {
      res.status(400).json({ error: hasil.error.errors });
      console.log("error");
    }
};
  
const pastiin2 = (req, res, next) => {
    const hasil = orderData.safeParse(req.body);
    if (hasil.success) {
      req.aman = hasil.data;
      next();
    } else {
      res.status(400).json({ error: hasil.error.errors });
      console.log("error");
    }
};

module.exports = {
    pastiin,
    pastiin2
}
