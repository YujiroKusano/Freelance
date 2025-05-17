const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const stripe = require('../libs/stripe');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/create-customer', authenticate, async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      email: req.user.email
    });
    await prisma.user.update({
      where: { id: req.user.id },
      data: { stripeCustomerId: customer.id }
    });
    res.json({ customerId: customer.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/subscribe', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: user.stripeCustomerId,
      line_items: [
        {
          price: 'price_XXXXXXXXXXXX', // Stripe ダッシュボードで事前に作成
          quantity: 1
        }
      ],
      success_url: 'https://your-domain.com/success',
      cancel_url: 'https://your-domain.com/cancel'
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;