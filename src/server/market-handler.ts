import {
  MarketIntelligenceProduct,
  MarketIntelligenceReport,
} from '../app/models/shakti.models';

export function getDefaultMarketIntelligence(): MarketIntelligenceReport {
  const products: MarketIntelligenceProduct[] = [
    {
      id: 'market-prod-1',
      title: 'Authentic Bengali Panch Phoron 5-Spice Blend (250g Glass Jar)',
      category: 'food_spices_masala',
      categoryLabel: 'Spices & Shakti Masala',
      targetRegion: 'Kolkata, West Bengal & Pan-India Regional Foodies',
      lastUpdated: '2026-10-25T09:30:00.000Z',
      recommendation: 'SCALE_CATALOG',
      approvalStatus: 'APPROVED',
      approvedAt: '2026-10-24T16:00:00.000Z',
      approvedBy: 'Kamal Das (Administrator)',
      actualPerformance: {
        sales: 84,
        actualProfit: 5754,
        roiPercent: 124.5,
      },
      scores: {
        demandEvidence: 24, // out of 25
        customerFeedback: 19, // out of 20
        competitionDiff: 14, // out of 15
        profitMargin: 19, // out of 20
        supplierReliability: 10, // out of 10
        operationalRisk: 9, // out of 10
        totalScore: 95,
        confidenceLevel: 'HIGH',
        unknownFactors: [
          'Seasonal price volatility of Radhuni (wild celery seed) between monsoon and winter harvests in Bengal mandis.',
        ],
        rankingRationale:
          'Highest customer repeat rate among spice blends. Authentic Radhuni inclusion creates stark differentiation from commercial supermarket brands that substitute mustard.',
      },
      unitEconomics: {
        supplierCost: 55,
        sellingPrice: 175,
        gstRate: 5,
        gstAmount: 8.75, // GST collected from customer (not counted as profit)
        packagingShippingCost: 35,
        platformFee: 3.5, // 2% payment gateway fee
        adOrAffiliateCommission: 9.25,
        expectedReturnRatePercent: 1.5,
        expectedDamageLoss: 2.5,
        contributionProfitPerUnit: 69.75,
        contributionMarginPercent: 39.86,
        costAssumptions: [
          'Supplier cost verified at Burrabazar Spices Wholesale Guild (Kolkata).',
          'Selling price benchmarked against Amazon & Flipkart direct seller listings.',
          'GST 5% output tax remitted to government, Input Tax Credit (ITC) recoverable on raw procurement.',
          'Packaging in food-grade airtight PET jar with induction seal.',
        ],
      },
      reviewInsights: [
        {
          id: 'rev-1',
          category: 'POSITIVE_FEATURES',
          summary: 'Authentic Radhuni inclusion provides true heirloom Bengali aroma.',
          evidenceQuote:
            'Most store-bought panch phoron uses yellow mustard instead of genuine Radhuni. Saarthi’s mix has real Radhuni and gives that unmistakable Maachher Jhol aroma.',
          sourceUrl: 'https://amazon.in/dp/B07PANCHPHORON/customer-reviews',
          frequency: 'HIGH',
          sentimentScore: 5,
        },
        {
          id: 'rev-2',
          category: 'QUALITY_PACKAGING_COMPLAINTS',
          summary: 'Moisture ingress risk if seal is torn improperly during humid monsoon.',
          evidenceQuote:
            'In humid Kolkata weather the fenugreek and fennel can absorb moisture if the jar seal is damaged in courier transit.',
          sourceUrl: 'https://saarthienterprise.in/reviews/panch-phoron',
          frequency: 'MEDIUM',
          sentimentScore: 3,
        },
        {
          id: 'rev-3',
          category: 'PRICE_VALUE_OBJECTIONS',
          summary: 'Individual delivery fee on a single ₹175 item causes cart drop-off.',
          evidenceQuote:
            'The spice blend is superb, but paying ₹50 courier on a ₹175 bottle is painful. Better to bundle 3 bottles together for free shipping.',
          sourceUrl: 'https://flipkart.com/panch-phoron-reviews',
          frequency: 'HIGH',
          sentimentScore: 3,
        },
        {
          id: 'rev-4',
          category: 'DELIVERY_RETURNS',
          summary: 'Express 48-hour delivery in Kolkata metro; 4-5 days to southern India.',
          evidenceQuote:
            'Delivered in Behala within 2 days. For Bangalore delivery it took 5 days via Delhivery Surface.',
          sourceUrl: 'https://saarthienterprise.in/tracking/SAR-2026-1001',
          frequency: 'LOW',
          sentimentScore: 4,
        },
        {
          id: 'rev-5',
          category: 'UNMET_NEEDS',
          summary: 'Customers demand pre-roasted ready-to-crush "Bhaja Moshla" variant.',
          evidenceQuote:
            'Can you also launch a roasted powdered version of this for sprinkling on Ghugni, Alur Dom and Chatpati?',
          sourceUrl: 'https://facebook.com/saarthienterprise/comments',
          frequency: 'HIGH',
          sentimentScore: 5,
        },
      ],
      sources: [
        {
          id: 'src-1',
          name: 'Burrabazar Spice Merchant Guild Daily Price Bulletin',
          sourceUrl: 'https://agmarknet.gov.in/PriceTrends/Kolkata',
          researchDate: '2026-10-24',
          observedFacts:
            'Raw cumin at ₹240/kg, fennel at ₹160/kg, fenugreek at ₹85/kg, nigella at ₹195/kg, radhuni at ₹480/kg. Blended cost per 250g is ₹48-₹55.',
          limitations: 'Mandis rates fluctuate weekly based on seasonal arrivals from Gujarat and Bengal fields.',
          status: 'ACCESSIBLE',
        },
        {
          id: 'src-2',
          name: 'Google Trends India — Culinary Keyword Query Index',
          sourceUrl: 'https://trends.google.com/trends/explore?geo=IN&q=panch+phoron,bengali+spices',
          researchDate: '2026-10-23',
          observedFacts:
            'Search interest maintains stable baseline index of 68 throughout year with peaks during Puja festival.',
          limitations: 'Indicates consumer search appetite; does not guarantee e-commerce cart completion.',
          status: 'ACCESSIBLE',
        },
        {
          id: 'src-3',
          name: 'Public Marketplace Listings (Amazon & Flipkart)',
          sourceUrl: 'https://amazon.in/s?k=bengali+panch+phoron',
          researchDate: '2026-10-24',
          observedFacts:
            'Leading 250g brands retail between ₹165 and ₹249 with average customer rating of 4.3/5 across 1,400+ reviews.',
          limitations: 'Competitor sales velocity estimated via rank and review velocity rather than direct internal ledger.',
          status: 'ACCESSIBLE',
        },
      ],
      marketingDraft: {
        headline: 'Authentic Bengali Panch Phoron with Genuine Radhuni — Saarthi Enterprise',
        hook: 'Are you getting real Radhuni in your Panch Phoron, or just cheap mustard filler?',
        bodyEnglish:
          'Experience the true heirloom aroma of Bengal. Hand-blended in Kolkata with equal-ratio Nigella, Fennel, Fenugreek, Cumin, and genuine wild Radhuni. Sealed fresh in aroma-barrier pet jars.',
        bodyBengali:
          'আসল রাঁধুনি দেওয়া খাঁটি পাঁচফোড়ন — কলকাতার বড়বাজার থেকে সরাসরি। মাছে-ভাতে বাঙালির চচ্চড়ি, ডাল আর তরকারিতে আনুন সেই সাবেকি গন্ধ ও স্বাদ। ১০০% খাঁটি, কোনো ভেজাল নেই।',
        bodyHindi:
          'बंगाल का प्रामाणिक पांच फोड़न — असली राधुनी के साथ। अपने दाल, तड़का और सब्जियों को दें पारंपरिक कोलकाता रसोई का सोंधा स्वाद।',
        targetAudience: 'Bengali homemakers, food bloggers, diaspora living in Bengaluru/Mumbai/Delhi, traditional culinary lovers.',
        painPointAddressed: 'Commercially packaged brands replace expensive Radhuni with yellow mustard, destroying authentic taste.',
        sevenDayOrganicPlan: [
          { day: 1, platform: 'instagram', focus: 'Ingredient Breakdown Reel', draftAction: 'Close-up video showing Radhuni vs Mustard seeds side-by-side.' },
          { day: 2, platform: 'facebook', focus: 'Heritage Recipe Post', draftAction: 'Traditional Shukto and Machher Jhol tempering recipe with carousel photo.' },
          { day: 3, platform: 'youtube', focus: 'Aroma Purity Short', draftAction: 'Sound-on tempering sizzle video showing whole seeds crackling in pure mustard oil.' },
          { day: 4, platform: 'facebook', focus: 'Customer Testimonial', draftAction: 'Quote from verified Kolkata chef reviewing aroma comparison.' },
          { day: 5, platform: 'instagram', focus: 'Packaging Seal Showcase', draftAction: 'Behind-the-scenes video showing tamper-evident induction jar sealing.' },
          { day: 6, platform: 'youtube', focus: 'Combo Saver Announcement', draftAction: '3-Jar Spice Kitchen Pack launch post with free shipping coupon.' },
          { day: 7, platform: 'facebook', focus: 'Weekly Order Dispatch', draftAction: 'Video of packed boxes ready for Delhivery courier pickup.' },
        ],
      },
    },
    {
      id: 'market-prod-2',
      title: 'Handloom Tant Cotton Saree (Phulia/Shantipur Weave with Floral Buti)',
      category: 'fashion_sarees_kurtis',
      categoryLabel: 'Fashion & Sarees',
      targetRegion: 'West Bengal, Assam, Tripura & Pan-India Ethnic Shoppers',
      lastUpdated: '2026-10-25T08:15:00.000Z',
      recommendation: 'TEST_ORGANIC',
      approvalStatus: 'NEEDS_APPROVAL',
      scores: {
        demandEvidence: 24,
        customerFeedback: 18,
        competitionDiff: 13,
        profitMargin: 18,
        supplierReliability: 9,
        operationalRisk: 8,
        totalScore: 90,
        confidenceLevel: 'HIGH',
        unknownFactors: [
          'Apparel return rates benchmark between 12-16% on e-commerce due to subjective color perception on mobile screens.',
        ],
        rankingRationale:
          'Tremendous organic demand for comfortable 100-count cotton sarees for summer, festivals, and daily office wear. Sourcing direct from Phulia weavers guarantees high margins.',
      },
      unitEconomics: {
        supplierCost: 450,
        sellingPrice: 1150,
        gstRate: 5,
        gstAmount: 57.5,
        packagingShippingCost: 75,
        platformFee: 23,
        adOrAffiliateCommission: 65,
        expectedReturnRatePercent: 12,
        expectedDamageLoss: 35,
        contributionProfitPerUnit: 444.5,
        contributionMarginPercent: 38.65,
        costAssumptions: [
          'Direct procurement from cooperative weavers cluster in Phulia (Nadia District).',
          'Return loss buffer accounts for two-way shipping in 12% of orders without fabric damage.',
          'GST at 5% for apparel under ₹1,000 threshold basis (or 12% if priced higher; strictly segregated).',
        ],
      },
      reviewInsights: [
        {
          id: 'rev-6',
          category: 'POSITIVE_FEATURES',
          summary: 'Extremely lightweight, breathable pure cotton fabric ideal for Indian summers.',
          evidenceQuote: 'The saree is so soft and lightweight. It breathes easily even at 38 degrees humidity.',
          sourceUrl: 'https://meesho.com/phulia-tant-saree/reviews',
          frequency: 'HIGH',
          sentimentScore: 5,
        },
        {
          id: 'rev-7',
          category: 'QUALITY_PACKAGING_COMPLAINTS',
          summary: 'Pallu thread ends fray if weaver has not applied proper edge lock.',
          evidenceQuote: 'Beautiful weave but the ends of the pallu had loose threads that needed manual trimming.',
          sourceUrl: 'https://amazon.in/dp/B08TANTCOTTON/reviews',
          frequency: 'MEDIUM',
          sentimentScore: 3,
        },
        {
          id: 'rev-8',
          category: 'PRICE_VALUE_OBJECTIONS',
          summary: 'Comparing online prices with physical Hatibagan or Gariahat market bargains.',
          evidenceQuote: 'In Gariahat street stalls similar cotton sarees go for ₹900, but online sellers charge ₹1,400.',
          sourceUrl: 'https://flipkart.com/tant-sarees-bengal',
          frequency: 'MEDIUM',
          sentimentScore: 3,
        },
        {
          id: 'rev-9',
          category: 'DELIVERY_RETURNS',
          summary: 'Wrinkles during folding in courier transit require steam pressing before gifting.',
          evidenceQuote: 'Delivered safely in 3 days, but packaging was tightly folded so heavy ironing was needed.',
          sourceUrl: 'https://saarthienterprise.in/inquiries',
          frequency: 'LOW',
          sentimentScore: 4,
        },
        {
          id: 'rev-10',
          category: 'UNMET_NEEDS',
          summary: 'Customers strongly prefer sarees bundled with ready-stitched matching blouse piece & falls.',
          evidenceQuote: 'Wish this came with pre-stitched fall and pico so I wouldn’t have to visit tailor.',
          sourceUrl: 'https://instagram.com/comments/bengal_sarees',
          frequency: 'HIGH',
          sentimentScore: 5,
        },
      ],
      sources: [
        {
          id: 'src-4',
          name: 'Weavers Service Centre & Nadia Co-operative Wholesale Price Index',
          sourceUrl: 'https://handlooms.nic.in/clusters/nadia-phulia',
          researchDate: '2026-10-23',
          observedFacts:
            'Pure 100s count cotton sarees with jacquard border wholesale between ₹420 and ₹490 at master weaver clusters.',
          limitations: 'Requires minimum order quantities (MOQ) of 15-20 pieces per colorway for best price tier.',
          status: 'ACCESSIBLE',
        },
        {
          id: 'src-5',
          name: 'Google Trends India — "Tant Saree Online"',
          sourceUrl: 'https://trends.google.com/trends/explore?geo=IN&q=tant+saree,cotton+saree',
          researchDate: '2026-10-24',
          observedFacts:
            'Searches surge by 85% during Durga Puja and Poila Boishakh (Bengali New Year) seasons with steady year-round baseline.',
          limitations: 'High search competition from established national marketplaces (Myntra, Ajio, Meesho).',
          status: 'ACCESSIBLE',
        },
      ],
      marketingDraft: {
        headline: 'Pure Phulia Handloom Tant Saree — Handwoven Bengal Cotton Elegance',
        hook: 'Tired of stiff polyester replicas? Wear 100% authentic handloom cotton directly from Nadia weavers.',
        bodyEnglish:
          'Handcrafted with airy 100-count pure cotton yarn, traditional temple border, and delicate floral butis. Drapes effortlessly and stays cool all day. Direct from artisan clusters to your doorstep.',
        bodyBengali:
          'নদীয়ার ফুলিয়ার আসল তাঁতের শাড়ি — ১০০% সুতির শীতল স্পর্শ। ঐতিহ্যবাহী পাড় ও সুক্ষ্ম বুটির কাজে সাজিয়ে তুলুন আপনার প্রতিদিনের সাজ। আরামদায়ক ও আভিজাত্যপূর্ণ।',
        bodyHindi:
          'पश्चिम बंगाल के फूलिया की असली हथकरघा तांत साड़ी। 100% शुद्ध सूती धागे से बुनी, बेहद हल्की और गर्मियों के लिए सर्वोत्तम।',
        targetAudience: 'Women aged 25-55, working professionals, Bengali festive shoppers, handloom saree collectors.',
        painPointAddressed: 'Machine-made polyester copies sold under the name of handloom cotton that cause sweating and rashes.',
        sevenDayOrganicPlan: [
          { day: 1, platform: 'instagram', focus: 'Loom Sound ASMR', draftAction: 'Short reel capturing wooden handloom shuttle clicking in Phulia workshop.' },
          { day: 2, platform: 'facebook', focus: 'Drape & Styling Tutorial', draftAction: '30-second easy pleating and drape guide for busy mornings.' },
          { day: 3, platform: 'youtube', focus: 'Pure Cotton Burn Test', draftAction: 'Fabric authenticity test demonstrating zero synthetic melting or smoke.' },
          { day: 4, platform: 'instagram', focus: 'Colorway Carousel', draftAction: 'High-res photos of 6 pastel shades shot in natural daylight.' },
          { day: 5, platform: 'facebook', focus: 'Artisan Story', draftAction: 'Meet Master Weaver Subhash Pal who spent 3 days crafting this pattern.' },
          { day: 6, platform: 'youtube', focus: 'Pre-Fall & Pico Service', draftAction: 'Announcement of free fall and pico edging for first 25 orders.' },
          { day: 7, platform: 'facebook', focus: 'Customer Review Highlight', draftAction: 'Photo review shared by a teacher wearing the saree to school.' },
        ],
      },
    },
    {
      id: 'market-prod-3',
      title: '360° Revolving Stainless Steel Spice Carousel (16 Airtight Glass Jars)',
      category: 'household_tools_accessories',
      categoryLabel: 'Household & Kitchenware',
      targetRegion: 'Pan-India Urban Kitchens',
      lastUpdated: '2026-10-25T07:45:00.000Z',
      recommendation: 'SCALE_CATALOG',
      approvalStatus: 'NEEDS_APPROVAL',
      scores: {
        demandEvidence: 23,
        customerFeedback: 17,
        competitionDiff: 13,
        profitMargin: 17,
        supplierReliability: 9,
        operationalRisk: 8,
        totalScore: 87,
        confidenceLevel: 'HIGH',
        unknownFactors: [
          'Glass jars require double-bubble thermocol padding to prevent courier transit breakage.',
        ],
        rankingRationale:
          'Complements Saarthi’s core spice sales perfectly as a high-ticket cross-sell bundle. High visual appeal in cooking reels.',
      },
      unitEconomics: {
        supplierCost: 480,
        sellingPrice: 1099,
        gstRate: 18,
        gstAmount: 167.64,
        packagingShippingCost: 110,
        platformFee: 22,
        adOrAffiliateCommission: 75,
        expectedReturnRatePercent: 4,
        expectedDamageLoss: 45,
        contributionProfitPerUnit: 199.36,
        contributionMarginPercent: 18.14,
        costAssumptions: [
          'Supplier cost verified with Howrah hardware & kitchenware manufacturing distributor.',
          'Volumetric weight is 1.8kg requiring heavy-duty courier slab.',
          'Damage replacement insurance factor built into costs.',
        ],
      },
      reviewInsights: [
        {
          id: 'rev-11',
          category: 'POSITIVE_FEATURES',
          summary: 'Smooth 360-degree ball-bearing rotation and compact kitchen counter footprint.',
          evidenceQuote: 'Rotates very smoothly without wobbling, saves half the counter space in my small kitchen.',
          sourceUrl: 'https://amazon.in/dp/B08SPICECAROUSEL/reviews',
          frequency: 'HIGH',
          sentimentScore: 5,
        },
        {
          id: 'rev-12',
          category: 'QUALITY_PACKAGING_COMPLAINTS',
          summary: 'Occasional broken jar if courier package is dropped by logistics handler.',
          evidenceQuote: 'One glass jar had a hairline crack upon arrival. Seller replaced it promptly within 3 days.',
          sourceUrl: 'https://saarthienterprise.in/support',
          frequency: 'MEDIUM',
          sentimentScore: 3,
        },
        {
          id: 'rev-13',
          category: 'PRICE_VALUE_OBJECTIONS',
          summary: 'Buyers compare with cheaper all-plastic 12-jar rotating racks at ₹499.',
          evidenceQuote: 'A bit pricier than plastic organizers, but the steel stand and glass jars feel much more premium.',
          sourceUrl: 'https://flipkart.com/spice-rack-reviews',
          frequency: 'LOW',
          sentimentScore: 4,
        },
        {
          id: 'rev-14',
          category: 'DELIVERY_RETURNS',
          summary: 'Bulky box packaging needs sturdy reinforced carton.',
          evidenceQuote: 'Packaging was well-padded with thermocol corners.',
          sourceUrl: 'https://saarthienterprise.in/tracking/SAR-2026-1002',
          frequency: 'LOW',
          sentimentScore: 5,
        },
        {
          id: 'rev-15',
          category: 'UNMET_NEEDS',
          summary: 'Customers request pre-printed waterproof spice name stickers in English and Hindi/Bengali.',
          evidenceQuote: 'Please provide printed labels for Haldi, Mirch, Dhaniya, Jeera so we do not have to write by hand.',
          sourceUrl: 'https://saarthienterprise.in/feedback',
          frequency: 'HIGH',
          sentimentScore: 5,
        },
      ],
      sources: [
        {
          id: 'src-6',
          name: 'Bengal Kitchenware & Hardware Wholesale Mandi (Howrah)',
          sourceUrl: 'https://howrahmanufacturers.org/kitchen-tools',
          researchDate: '2026-10-22',
          observedFacts: 'Bulk carton price for 16-jar rotating rack is ₹480 per unit in lots of 10.',
          limitations: 'Supplier lead time 2-3 business days when stock depletes.',
          status: 'ACCESSIBLE',
        },
        {
          id: 'src-7',
          name: 'Amazon India Kitchen Bestsellers Category Ranks',
          sourceUrl: 'https://amazon.in/gp/bestsellers/kitchen/1380388031',
          researchDate: '2026-10-24',
          observedFacts: 'Top 3 carousel brands average ₹999-₹1,249 with 3,500+ monthly purchases.',
          limitations: 'High return risk if courier does not handle glass jars with fragile sticker.',
          status: 'ACCESSIBLE',
        },
      ],
      marketingDraft: {
        headline: 'Organize Your Kitchen with 360° Rotating Stainless Steel Spice Carousel',
        hook: 'Stop searching through 20 messy spice jars while your curry is burning on the stove!',
        bodyEnglish:
          'Keep your 16 essential spices at your fingertips. Premium food-grade glass jars with 2-way sprinkler lids and smooth revolving stainless steel base. Includes waterproof labels.',
        bodyBengali:
          'রান্নাঘরে মশলা খোঁজার ঝামেলা শেষ! ১৬টি এয়ারটাইট কাঁচের জার সহ ৩৬০ ডিগ্রি ঘূর্ণায়মান স্টেইনলেস স্টিল মশলা রেক। সুন্দর ও মজবুত।',
        bodyHindi:
          'अपनी रसोई को दें आधुनिक और साफ-सुथरा लुक। 16 जार वाला 360° घूमने वाला स्टेनलेस स्टील मसाला रैक।',
        targetAudience: 'Home cooks, modern apartment dwellers, wedding gift shoppers, modular kitchen owners.',
        painPointAddressed: 'Cluttered kitchen counters and lost spice jars during fast cooking.',
        sevenDayOrganicPlan: [
          { day: 1, platform: 'youtube', focus: 'Kitchen Transformation Short', draftAction: 'Before vs After 15-second transformation of messy spice shelf.' },
          { day: 2, platform: 'instagram', focus: 'Spin ASMR', draftAction: 'Satisfying spin video showing jars filled with vibrant colorful Saarthi spices.' },
          { day: 3, platform: 'facebook', focus: 'Waterproof Label Test', draftAction: 'Water splash test on spice labels showing zero smudge.' },
          { day: 4, platform: 'instagram', focus: 'Bundle Offer Post', draftAction: 'Buy Carousel + Get 4 Saarthi Spices at 50% discount announcement.' },
          { day: 5, platform: 'youtube', focus: 'Fragile Box Unboxing', draftAction: 'Unboxing video showing multi-layer thermocol safety protection.' },
          { day: 6, platform: 'facebook', focus: 'Customer Review Showcase', draftAction: 'Photo review sent by customer showing carousel in new modular kitchen.' },
          { day: 7, platform: 'instagram', focus: 'Limited Stock Reminder', draftAction: 'Announcement of only 12 units remaining in current Howrah batch.' },
        ],
      },
    },
    {
      id: 'market-prod-4',
      title: 'Cordless USB Rechargeable Mini Garlic & Masala Chopper (250ml)',
      category: 'dropshipping_trending',
      categoryLabel: 'Dropshipping Opportunities',
      targetRegion: 'Pan-India E-Commerce',
      lastUpdated: '2026-10-25T08:50:00.000Z',
      recommendation: 'TEST_ORGANIC',
      approvalStatus: 'NEEDS_APPROVAL',
      scores: {
        demandEvidence: 22,
        customerFeedback: 16,
        competitionDiff: 12,
        profitMargin: 17,
        supplierReliability: 8,
        operationalRisk: 8,
        totalScore: 83,
        confidenceLevel: 'MEDIUM',
        unknownFactors: [
          'Battery life longevity varies across budget Chinese motor variants; need supplier sample test.',
        ],
        rankingRationale:
          'High impulse-purchase price point under ₹500 with strong viral demonstration potential on Reels and Shorts.',
      },
      unitEconomics: {
        supplierCost: 170,
        sellingPrice: 449,
        gstRate: 18,
        gstAmount: 68.49,
        packagingShippingCost: 55,
        platformFee: 9,
        adOrAffiliateCommission: 45,
        expectedReturnRatePercent: 8,
        expectedDamageLoss: 20,
        contributionProfitPerUnit: 81.51,
        contributionMarginPercent: 18.15,
        costAssumptions: [
          'Direct dropship supplier fulfillment with Howrah/Delhi supplier hubs.',
          'USB cable and stainless 3-blade assembly included in box.',
        ],
      },
      reviewInsights: [
        {
          id: 'rev-16',
          category: 'POSITIVE_FEATURES',
          summary: 'Chops garlic, ginger, and green chillies in 10 seconds without smelly hands.',
          evidenceQuote: 'Chops 10 garlic cloves in 5 pulses. No garlic smell on my fingers!',
          sourceUrl: 'https://meesho.com/mini-chopper-reviews',
          frequency: 'HIGH',
          sentimentScore: 5,
        },
        {
          id: 'rev-17',
          category: 'QUALITY_PACKAGING_COMPLAINTS',
          summary: 'Do not overload motor with hard nuts or frozen ingredients.',
          evidenceQuote: 'Works great for onions and garlic, but struggles if you put raw hard turmeric.',
          sourceUrl: 'https://amazon.in/dp/B08MINICHOPPER',
          frequency: 'HIGH',
          sentimentScore: 3,
        },
        {
          id: 'rev-18',
          category: 'PRICE_VALUE_OBJECTIONS',
          summary: 'Cheap plastic body in some unbranded batches.',
          evidenceQuote: 'Good value for ₹450, but do not drop it on ceramic tile floor.',
          sourceUrl: 'https://flipkart.com/mini-chopper-feedback',
          frequency: 'MEDIUM',
          sentimentScore: 3,
        },
        {
          id: 'rev-19',
          category: 'DELIVERY_RETURNS',
          summary: 'Charge battery fully before first use.',
          evidenceQuote: 'Arrived with zero charge. Plugged in for 2 hours and worked smoothly.',
          sourceUrl: 'https://saarthienterprise.in/inquiries',
          frequency: 'LOW',
          sentimentScore: 4,
        },
        {
          id: 'rev-20',
          category: 'UNMET_NEEDS',
          summary: 'Customers want spare blade replacement option in case blade dulls after 6 months.',
          evidenceQuote: 'Would love if seller offered an extra spare blade set.',
          sourceUrl: 'https://instagram.com/comments/mini-chopper',
          frequency: 'LOW',
          sentimentScore: 4,
        },
      ],
      sources: [
        {
          id: 'src-8',
          name: 'Indiamart & Howrah Dropship Importers Directory',
          sourceUrl: 'https://dir.indiamart.com/kolkata/electric-choppers',
          researchDate: '2026-10-23',
          observedFacts: 'Bulk dropship unit cost between ₹160 and ₹185 with same-day dispatch.',
          limitations: 'Supplier must verify battery BIS safety certification.',
          status: 'ACCESSIBLE',
        },
      ],
      marketingDraft: {
        headline: 'Chop Garlic, Ginger & Chillies in 10 Seconds — Mini Electric USB Chopper',
        hook: 'Still crying while chopping onions and washing smelly garlic from your hands?',
        bodyEnglish:
          'One-touch wireless electric chopper with razor-sharp 3-tier stainless steel blades. USB rechargeable, lightweight, and rinses clean in 5 seconds under tap water.',
        bodyBengali:
          'হাত দিয়ে রসুন-লঙ্কা কাটার ঝামেলা চিরতরে বন্ধ! ইউএসবি রিচার্জেবল মিনি ইলেকট্রিক চপার — মাত্র ১০ সেকেন্ডে কুচি কুচি মশলা প্রস্তুত।',
        bodyHindi:
          'लहसुन, प्याज और मिर्च को सिर्फ 10 सेकंड में बारीक काटें। यूएसबी रिचार्जेबल वायरलेस मिनी चॉपर।',
        targetAudience: 'Hostel students, working couples, bachelor kitchens, daily cooks.',
        painPointAddressed: 'Time-consuming manual chopping and pungent garlic residue on fingers.',
        sevenDayOrganicPlan: [
          { day: 1, platform: 'instagram', focus: '10-Second Timer Challenge', draftAction: 'Real-time countdown timer chopping a whole bowl of garlic.' },
          { day: 2, platform: 'youtube', focus: 'Ginger & Green Chilli Demo', draftAction: 'Short showing quick prep for morning tea and curry paste.' },
          { day: 3, platform: 'facebook', focus: 'Tap Rinse Video', draftAction: '5-second quick rinse under running water demonstrating zero blade mess.' },
          { day: 4, platform: 'instagram', focus: 'Hostel Cooking Reel', draftAction: 'Student demonstrating making quick Maggi seasoning paste.' },
          { day: 5, platform: 'facebook', focus: 'Price Comparison Infographic', draftAction: 'Comparing ₹449 price with expensive ₹2,500 food processors.' },
          { day: 6, platform: 'youtube', focus: 'Battery Life Test', draftAction: 'Showing 30 cycles of chopping on a single USB charge.' },
          { day: 7, platform: 'facebook', focus: 'Cash On Delivery Promo', draftAction: 'COD available across India with 5-day return guarantee.' },
        ],
      },
    },
    {
      id: 'market-prod-5',
      title: 'Preethi Zodiac Cosmo 750W Heavy-Duty Mixer Grinder (4 Stainless Jars)',
      category: 'affiliate_appliances',
      categoryLabel: 'Affiliate Marketing',
      targetRegion: 'Pan-India Home Chefs',
      lastUpdated: '2026-10-25T09:10:00.000Z',
      recommendation: 'SCALE_CATALOG',
      approvalStatus: 'APPROVED',
      approvedAt: '2026-10-24T18:00:00.000Z',
      approvedBy: 'Kamal Das (Administrator)',
      actualPerformance: {
        sales: 4,
        actualProfit: 1867.8,
        roiPercent: 100, // zero inventory capital deployed
      },
      scores: {
        demandEvidence: 24,
        customerFeedback: 19,
        competitionDiff: 13,
        profitMargin: 15,
        supplierReliability: 10,
        operationalRisk: 10, // Zero inventory risk (affiliate)
        totalScore: 91,
        confidenceLevel: 'HIGH',
        unknownFactors: [
          'Affiliate commission tracking cookie window is 24 hours on Amazon Associates India.',
        ],
        rankingRationale:
          'Zero capital investment required. Directly tied to spice grinding video content where viewers immediately ask "Which mixer did you use for this fine powder?".',
      },
      unitEconomics: {
        supplierCost: 0, // Affiliate model
        sellingPrice: 8499,
        gstRate: 0, // Handled by marketplace merchant
        gstAmount: 0,
        packagingShippingCost: 0,
        platformFee: 0,
        adOrAffiliateCommission: 467.44, // 5.5% verified affiliate commission
        expectedReturnRatePercent: 0, // Returns handled by marketplace
        expectedDamageLoss: 0,
        contributionProfitPerUnit: 467.44,
        contributionMarginPercent: 100,
        costAssumptions: [
          'Amazon Associates India commission rate for Large & Small Kitchen Appliances is 5.5%.',
          'Zero inventory holding cost, zero transit loss, zero return risk for Saarthi.',
        ],
      },
      reviewInsights: [
        {
          id: 'rev-21',
          category: 'POSITIVE_FEATURES',
          summary: 'Powerful 750W Vega W5 motor grinds tough turmeric roots and garam masala seeds into velvet powder.',
          evidenceQuote: 'Grinds rock-hard Lakadong turmeric rhizomes into fine powder in 90 seconds without motor overheating.',
          sourceUrl: 'https://amazon.in/dp/B08XYZDEMO/reviews',
          frequency: 'HIGH',
          sentimentScore: 5,
        },
        {
          id: 'rev-22',
          category: 'QUALITY_PACKAGING_COMPLAINTS',
          summary: 'High motor noise during dry spice grinding mode.',
          evidenceQuote: 'Motor is very powerful but it is noisy (about 80 dB), which is normal for 750W heavy duty.',
          sourceUrl: 'https://amazon.in/dp/B08XYZDEMO/reviews',
          frequency: 'HIGH',
          sentimentScore: 4,
        },
        {
          id: 'rev-23',
          category: 'PRICE_VALUE_OBJECTIONS',
          summary: 'Pricier than 500W entry-level mixers, but lasts years longer.',
          evidenceQuote: 'Priced around ₹8,500, but the Master Chef food processor jar saves hours of dough kneading.',
          sourceUrl: 'https://flipkart.com/preethi-zodiac-reviews',
          frequency: 'MEDIUM',
          sentimentScore: 4,
        },
        {
          id: 'rev-24',
          category: 'DELIVERY_RETURNS',
          summary: 'Amazon Prime 1-day delivery with 2-year manufacturer doorstep warranty.',
          evidenceQuote: 'Delivered next day in Kolkata. Technician came to demonstrate attachments.',
          sourceUrl: 'https://amazon.in/customer-service',
          frequency: 'LOW',
          sentimentScore: 5,
        },
        {
          id: 'rev-25',
          category: 'UNMET_NEEDS',
          summary: 'Users want precise timing guidelines for grinding each traditional Indian spice.',
          evidenceQuote: 'Would be helpful if they included a guide for seconds required for Biryani masala vs Garam masala.',
          sourceUrl: 'https://youtube.com/comments/saarthi_preethi_review',
          frequency: 'MEDIUM',
          sentimentScore: 5,
        },
      ],
      sources: [
        {
          id: 'src-9',
          name: 'Amazon Associates India Affiliate Commission Schedule',
          sourceUrl: 'https://affiliate-program.amazon.in/help/node/topic/G202047300',
          researchDate: '2026-10-24',
          observedFacts: 'Standard commission for Kitchen Appliances is 5.5% on verified customer purchases.',
          limitations: 'Attribution window is 24 hours; commission reversed if buyer returns appliance within 10-day window.',
          status: 'ACCESSIBLE',
        },
      ],
      marketingDraft: {
        headline: 'How We Grind Pure Spices at Saarthi — Preethi Zodiac 750W Heavy-Duty Grinder',
        hook: 'Can your regular mixer grinder turn whole dried turmeric into super-fine aromatic powder without smoking?',
        bodyEnglish:
          'The exact machine we recommend for grinding Saarthi whole spices at home. 750W Vega motor with 3-speed control and overload protection. Includes 4 heavy-gauge stainless jars.',
        bodyBengali:
          'বাড়িতে খাঁটি মশলা গুঁড়ো করার সেরা মেশিন। ৭৫০ ওয়াটের শক্তিশালী প্রিথি জোডিয়াক মিক্সার গ্রাইন্ডার। সম্পূর্ণ হলুদের টুকরোও গুঁড়ো করে নিমিষে।',
        bodyHindi:
          'घर पर खड़े मसालों को पीसने का सबसे शक्तिशाली 750 वॉट मिक्सर ग्राइंडर।',
        targetAudience: 'Home cooking enthusiasts, biryani cooks, health-conscious families.',
        painPointAddressed: 'Burned-out 500W mixers when trying to grind hard Indian spices at home.',
        sevenDayOrganicPlan: [
          { day: 1, platform: 'youtube', focus: 'Rock Turmeric Grinding Test', draftAction: 'Grinding hard Lakadong turmeric in 60 seconds with temperature check.' },
          { day: 2, platform: 'instagram', focus: 'Biryani Masala Blend Demo', draftAction: 'Live blending of 12 whole spices into fine royal biryani powder.' },
          { day: 3, platform: 'facebook', focus: 'Affiliate Disclosure & Buying Guide', draftAction: 'Transparent breakdown of 2-year warranty and verified Amazon discount link.' },
          { day: 4, platform: 'youtube', focus: 'Noise & Vibration Comparison', draftAction: 'Side-by-side comparison with budget 500W mixer.' },
          { day: 5, platform: 'instagram', focus: 'Atta Kneading Attachment Demo', draftAction: 'Kneading soft roti dough in 1 minute using food processor jar.' },
          { day: 6, platform: 'facebook', focus: 'Community Spice Q&A', draftAction: 'Answering audience questions on spice shelf-life after grinding.' },
          { day: 7, platform: 'youtube', focus: 'Weekend Recipe Live', draftAction: 'Cooking traditional Kosha Mangsho using freshly ground spice mix.' },
        ],
      },
    },
  ];

  const totalOpportunities = products.length;
  const averageMarginPercent = Math.round(
    products.reduce((acc, p) => acc + p.unitEconomics.contributionMarginPercent, 0) / totalOpportunities,
  );

  return {
    lastUpdated: '2026-10-25T09:30:00.000Z',
    status: 'FRESH',
    totalOpportunities,
    averageMarginPercent,
    products,
  };
}

export function generateMarketCsv(products: MarketIntelligenceProduct[]): string {
  const headers = [
    'ID',
    'Product Title',
    'Category',
    'Target Region',
    'Overall Score (100)',
    'Demand (25)',
    'Customer Feedback (20)',
    'Competition (15)',
    'Margin Score (20)',
    'Supplier Reliability (10)',
    'Risk Score (10)',
    'Supplier Cost (INR)',
    'Selling Price (INR)',
    'GST Rate (%)',
    'Contribution Profit (INR)',
    'Contribution Margin (%)',
    'Recommendation',
    'Approval Status',
  ];

  const rows = products.map((p) => [
    p.id,
    `"${p.title.replace(/"/g, '""')}"`,
    p.categoryLabel,
    `"${p.targetRegion.replace(/"/g, '""')}"`,
    p.scores.totalScore,
    p.scores.demandEvidence,
    p.scores.customerFeedback,
    p.scores.competitionDiff,
    p.scores.profitMargin,
    p.scores.supplierReliability,
    p.scores.operationalRisk,
    p.unitEconomics.supplierCost,
    p.unitEconomics.sellingPrice,
    p.unitEconomics.gstRate,
    p.unitEconomics.contributionProfitPerUnit,
    p.unitEconomics.contributionMarginPercent,
    p.recommendation,
    p.approvalStatus,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
