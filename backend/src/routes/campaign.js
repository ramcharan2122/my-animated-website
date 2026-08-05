import express from 'express';
import { dbGet, dbRun } from '../db.js';

const router = express.Router();

// Get Current Store Campaign Status
router.get('/status', async (req, res) => {
  try {
    const activeCampaign = await dbGet(
      'SELECT * FROM store_campaigns ORDER BY deployed_at DESC LIMIT 1'
    );

    if (!activeCampaign) {
      return res.json({
        isActive: false,
        title: 'Standard Store Operations',
        discountPercentage: 0,
        promoCode: '',
        bannerText: '',
        marketingSpend: '',
        targetCategory: 'ALL',
        deployedAt: null
      });
    }

    res.json({
      isActive: Boolean(activeCampaign.is_active),
      title: activeCampaign.title,
      discountPercentage: activeCampaign.discount_percentage,
      promoCode: activeCampaign.promo_code,
      bannerText: activeCampaign.banner_text,
      marketingSpend: activeCampaign.marketing_spend,
      targetCategory: activeCampaign.target_category,
      occasionKey: activeCampaign.occasion_key || 'seasonal',
      deployedAt: activeCampaign.deployed_at,
      simulationId: activeCampaign.simulation_id
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch campaign status.' });
  }
});

// Deploy Campaign from Boardroom Decision to Demo Business Store
router.post('/deploy', async (req, res) => {
  try {
    const { title, discountPercentage, promoCode, bannerText, marketingSpend, targetCategory, occasionKey, simulationId } = req.body;

    const campaignId = `camp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Deactivate old campaigns
    await dbRun('UPDATE store_campaigns SET is_active = 0');

    // Insert active campaign
    await dbRun(
      `INSERT INTO store_campaigns (id, is_active, title, discount_percentage, promo_code, banner_text, marketing_spend, target_category, occasion_key, simulation_id)
       VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        campaignId,
        title || 'FESTIVAL SALE',
        discountPercentage !== undefined ? discountPercentage : 35,
        promoCode || 'FESTIVAL35',
        bannerText || 'CELEBRATION SPECIAL: EXCLUSIVE DISCOUNTS ACROSS CATALOG',
        marketingSpend || '₹50 Lakhs',
        targetCategory || 'ALL CATEGORIES',
        occasionKey || 'seasonal',
        simulationId || null
      ]
    );

    res.status(201).json({
      message: 'Campaign successfully deployed to live demo business store!',
      campaign: {
        id: campaignId,
        isActive: true,
        title: title || 'FESTIVAL SALE',
        discountPercentage: discountPercentage !== undefined ? discountPercentage : 35,
        promoCode: promoCode || 'FESTIVAL35',
        bannerText: bannerText || 'CELEBRATION SPECIAL: EXCLUSIVE DISCOUNTS ACROSS CATALOG',
        marketingSpend: marketingSpend || '₹50 Lakhs',
        targetCategory: targetCategory || 'ALL CATEGORIES',
        occasionKey: occasionKey || 'seasonal',
        deployedAt: new Date().toISOString(),
        simulationId: simulationId || null
      }
    });
  } catch (err) {
    console.error('Deploy campaign error:', err);
    res.status(500).json({ error: 'Failed to deploy campaign.' });
  }
});

// Reset Campaign (Revert Store to Normal Mode)
router.post('/reset', async (req, res) => {
  try {
    await dbRun('UPDATE store_campaigns SET is_active = 0');

    res.json({
      message: 'Store campaign reset. Demo store reverted to normal non-sale mode.',
      isActive: false
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset store campaign.' });
  }
});

export default router;
