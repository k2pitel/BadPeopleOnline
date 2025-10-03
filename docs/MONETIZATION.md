# Monetization Strategy

## Revenue Streams

### 1. Premium Subscription ($4.99/month)

#### Features
- **Ad-Free Experience**: No advertisements during gameplay
- **All Question Packs**: Access to all premium question collections
- **Private Rooms**: Create private rooms (free users limited to public)
- **Custom Questions**: Create and save custom question packs
- **Priority Support**: Faster response times
- **Exclusive Badge**: Special badge visible to other players
- **Early Access**: New features and packs before free users

#### Implementation
```javascript
// User model already has isPremium field
{
  isPremium: Boolean,
  premiumUntil: Date
}

// Middleware to check premium status
function requirePremium(req, res, next) {
  if (!req.user.isPremium || req.user.premiumUntil < new Date()) {
    return res.status(403).json({ error: 'Premium subscription required' });
  }
  next();
}

// Apply to routes
router.post('/rooms/private', requirePremium, createPrivateRoom);
router.post('/questions/custom', requirePremium, createCustomPack);
```

### 2. Question Packs ($1.99 each)

#### Available Packs
- **Spicy Pack**: Edgy questions for adults
- **College Edition**: Questions about college life
- **Work Edition**: Office and workplace scenarios
- **Date Night**: Questions for couples
- **International**: Questions from different cultures
- **Seasonal**: Holiday and seasonal themed

#### One-Time Purchase Model
Users can buy individual packs without subscription:
```javascript
// User model tracks purchased packs
{
  purchasedPacks: [ObjectId]
}

// Check access
function hasAccessToPack(user, packId) {
  if (user.isPremium) return true;
  if (user.purchasedPacks.includes(packId)) return true;
  return false;
}
```

### 3. Advertisements (Free Tier)

#### Ad Placement Strategy
- **Between Rounds**: 5-second ad every 3 rounds
- **Room Lobby**: Banner ad while waiting for players
- **Results Screen**: Banner ad on final scores

#### Ad Networks
- Google AdSense
- Unity Ads (for future mobile apps)
- Programmatic ad platforms

#### Implementation
```jsx
// AdBanner component
function AdBanner({ placement }) {
  const { user } = useAuth();
  
  if (user?.isPremium) {
    return null; // No ads for premium users
  }
  
  return (
    <div className="ad-container">
      {/* Ad code here */}
    </div>
  );
}
```

### 4. Cosmetic Items (Future)

#### Avatar Customization
- Custom avatars: $0.99-$2.99
- Avatar packs: $4.99
- Animated avatars: $3.99

#### Chat Effects
- Custom emoji packs: $1.99
- Sound effects: $0.99

#### Profile Customization
- Custom themes: $1.99
- Achievement badges: $0.99

## Pricing Strategy

### Free Tier
- Basic question packs
- Public rooms only
- Ad-supported
- Max 8 players per room

### Premium Tier ($4.99/month)
- All features unlocked
- No ads
- Up to 12 players per room
- Custom questions

### Annual Subscription ($49.99/year)
- Same as monthly premium
- 2 months free (17% discount)

## Payment Integration

### Payment Processors
1. **Stripe**: Primary payment processor
2. **PayPal**: Alternative payment option
3. **Apple Pay / Google Pay**: Mobile convenience

### Implementation Example
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create subscription
router.post('/subscribe/premium', auth, async (req, res) => {
  const { paymentMethodId } = req.body;
  
  const subscription = await stripe.subscriptions.create({
    customer: req.user.stripeCustomerId,
    items: [{ price: process.env.PREMIUM_PRICE_ID }],
    default_payment_method: paymentMethodId,
  });
  
  // Update user
  req.user.isPremium = true;
  req.user.premiumUntil = new Date(subscription.current_period_end * 1000);
  await req.user.save();
  
  res.json({ success: true });
});

// Purchase question pack
router.post('/purchase/pack/:packId', auth, async (req, res) => {
  const { paymentMethodId } = req.body;
  const pack = await QuestionPack.findById(req.params.packId);
  
  const payment = await stripe.paymentIntents.create({
    amount: pack.price * 100, // Convert to cents
    currency: 'usd',
    customer: req.user.stripeCustomerId,
    payment_method: paymentMethodId,
    confirm: true,
  });
  
  // Add pack to user
  req.user.purchasedPacks.push(pack._id);
  await req.user.save();
  
  res.json({ success: true });
});
```

## Conversion Optimization

### 1. Free Trial
- 7-day free premium trial for new users
- Automatic conversion to free tier after trial
- Email reminders before trial ends

### 2. Upgrade Prompts
- Show premium features during gameplay
- "Unlock this pack" prompts
- Limited-time discount offers

### 3. Social Proof
- "Join 10,000+ premium members"
- Testimonials from satisfied users
- Premium badge visibility

### 4. Referral Program
- Refer a friend, get 1 month free
- Friend gets 50% off first month
- Both benefit from referral

## Analytics & Metrics

### Key Performance Indicators (KPIs)

1. **Conversion Rate**
   - Free to Premium: Target 5%
   - Trial to Paid: Target 40%

2. **Customer Lifetime Value (CLV)**
   - Average subscription duration: 6 months
   - CLV = $4.99 * 6 = $29.94

3. **Churn Rate**
   - Monthly churn target: <10%
   - Annual churn target: <30%

4. **Average Revenue Per User (ARPU)**
   - Target: $2.50/month
   - Calculation: (Premium subs + Pack sales + Ad revenue) / Total users

5. **Ad Revenue**
   - Target eCPM: $5-$10
   - Daily active users needed: 1000+

## Revenue Projections

### Year 1 Projections (Conservative)

**Users**
- Month 1-3: 1,000 users
- Month 4-6: 5,000 users
- Month 7-9: 15,000 users
- Month 10-12: 30,000 users

**Revenue Breakdown (Month 12)**
- Premium Subscriptions (5%): 1,500 users × $4.99 = $7,485/month
- Question Pack Sales: 500 packs/month × $1.99 = $995/month
- Ad Revenue: 28,500 free users × $0.50/month = $14,250/month
- **Total Monthly Revenue**: $22,730
- **Annual Revenue**: ~$150,000

### Year 2 Projections (Growth)
- 100,000 total users
- 8% premium conversion
- **Monthly Revenue**: $95,000
- **Annual Revenue**: $1,140,000

## Cost Structure

### Fixed Costs
- Server hosting: $200-$500/month
- Database: $100-$300/month
- CDN: $50-$150/month
- SSL certificates: $100/year
- Domain: $20/year

### Variable Costs
- Payment processing: 2.9% + $0.30 per transaction
- Customer support: $1,000-$3,000/month
- Marketing: 20% of revenue

### Total Estimated Costs
- Year 1: $50,000
- Year 2: $200,000

## Marketing Strategy

1. **Content Marketing**
   - Blog posts about party games
   - YouTube gameplay videos
   - Social media engagement

2. **Influencer Partnerships**
   - Partner with gaming streamers
   - Sponsored gameplay sessions
   - Affiliate links

3. **Paid Advertising**
   - Facebook/Instagram ads
   - Google Ads
   - TikTok promotion

4. **Viral Growth**
   - Social sharing features
   - Referral bonuses
   - Tournament prizes

## Future Monetization

- [ ] Tournament entry fees
- [ ] Branded question packs (partnerships)
- [ ] White-label licensing for companies
- [ ] Mobile app with in-app purchases
- [ ] Merchandise (T-shirts, mugs)
- [ ] API access for developers
