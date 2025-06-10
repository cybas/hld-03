
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type {
  Message,
  HairLossImage,
  SelectedTag,
  AssessmentData,
  AssessmentResults,
  RecommendationDetail,
  SummaryByCategory
} from '@/types';
import { ArrowLeft, SendHorizontal, MessageSquare, Info, Lightbulb, CheckCircle2 } from 'lucide-react';
import { formatAIResponse } from '@/utils/responseFormatter';

const recommendationMap: Record<string, Omit<RecommendationDetail, 'tag' | 'category'>> = {
  // DIET & NUTRITION (20 tags)
  'Zero red meat diet': {
    issue: 'Iron, zinc, vitamin B12 deficiency from avoiding red meat sources',
    impact: 'Can lead to weaker hair structure and increased shedding due to nutrient deficiencies',
    recommendation: 'Add lentils (100-150g), spinach (100g), pumpkin seeds (30g) daily. Consider iron (18-27mg), B12 (500-1000mcg/week), zinc (15-25mg) supplements.'
  },
  'Pescatarian diet': {
    issue: 'Iron and B12 deficiency from limited animal protein sources',
    impact: 'May cause slower hair growth and fragile hair strands',
    recommendation: 'Add mussels/clams (100-150g, 2-3x/week), eggs (50g/day), fortified yeast (10-20g). Supplement iron (18mg) and B12 (500mcg/week).'
  },
  'Vegetarian diet': {
    issue: 'Iron, zinc, B12, lysine, and methionine deficiency from plant-only sources',
    impact: 'May lead to diffuse thinning and brittle hair due to incomplete amino acid profiles',
    recommendation: 'Include eggs (50-100g), dairy (100-150g), tofu (100-150g), legumes (150g), leafy greens (100g) daily. Supplement iron, B12, zinc.'
  },
  'Vegan diet': {
    issue: 'Protein, iron, zinc, B12, vitamin D, omega-3 deficiency from plant-only sources',
    impact: 'Can cause hair shedding and dull texture due to multiple nutrient deficiencies',
    recommendation: 'Add legumes (150g), tofu/tempeh (100-150g), fortified plant milks (250-500ml), seaweed (5-10g), nuts (30g). Supplement vegan omega-3, B12, vitamin D.'
  },
  'Egg-based diet': {
    issue: 'Omega-3, iron, and vitamin D deficiency from limited food variety',
    impact: 'Can cause dry scalp and dull hair appearance',
    recommendation: 'Add fatty fish (100-150g, 2-3x/week), nuts & seeds (30g), spinach (100g), whole grains (50-75g). Consider omega-3 and iron supplements.'
  },
  'Keto/Low-carb diet': {
    issue: 'Biotin and zinc deficiency from carbohydrate restriction',
    impact: 'May cause hair dullness and breakage',
    recommendation: 'Include eggs (50-100g), leafy greens (100g), pumpkin seeds (30g), fatty fish (100-150g), avocado (100g). Supplement biotin (2-5mg) and zinc (15-25mg).'
  },
  'High-carb/Low-fat diet': {
    issue: 'Omega-3, fat-soluble vitamins, and zinc deficiency from fat restriction',
    impact: 'Can lead to dry, brittle hair due to essential fatty acid deficiency',
    recommendation: 'Add chia seeds (20-30g), flaxseed (20-30g), walnuts (30g), oily fish (100-150g), avocado (100g). Supplement omega-3 (250-500mg).'
  },
  'Intermittent fasting': {
    issue: 'Iron, zinc deficiency and general nutrient imbalance from restricted eating windows',
    impact: 'May cause sudden hair shedding if iron stores drop significantly',
    recommendation: 'Include iron-rich snacks (nuts/seeds/dried fruit 30g), balanced meals with fish/eggs (50-100g). Supplement iron (18-27mg) and multivitamin.'
  },
  'Gluten-free diet': {
    issue: 'B vitamins, iron, and zinc deficiency from avoiding fortified grains',
    impact: 'Can increase hair shedding and slow regrowth',
    recommendation: 'Add fortified gluten-free breads (30-50g), legumes (150g), quinoa (150g), pumpkin seeds (30g). Supplement B-complex (50mg), iron, zinc.'
  },
  'Dairy-free diet': {
    issue: 'Calcium, vitamin D, and protein deficiency from avoiding dairy sources',
    impact: 'May reduce hair matrix strength and overall hair health',
    recommendation: 'Use fortified plant milks (250-500ml), sesame seeds (20-30g), leafy greens (100g), small fish (100-150g). Supplement calcium (500-1000mg), vitamin D.'
  },
  'Grain-free/Paleo diet': {
    issue: 'B vitamins, fiber, and iron deficiency from grain elimination',
    impact: 'Can cause hair dullness and mild shedding',
    recommendation: 'Include eggs (50-100g), nuts (30g), seeds (20-30g), leafy greens (100g), berries (100g). Supplement B-complex (50mg) and iron.'
  },
  'Raw food diet': {
    issue: 'Protein, iron, zinc, B12, and calorie deficiency from cooking restrictions',
    impact: 'Can lead to thin, fragile hair due to severe nutrient limitations',
    recommendation: 'Add sprouted legumes (100g), fermented foods (100g), nuts & seeds (30g), seaweed (5-10g). Supplement plant protein, B12, iron.'
  },
  'Juice cleanse/Detox diet': {
    issue: 'Protein, iron, zinc, omega-3, and severe calorie deficiency',
    impact: 'Can cause severe hair shedding due to nutritional deprivation',
    recommendation: 'Resume solid foods immediately. Add seeds (30g), nuts (30g), sprouted lentils (100g). Supplement plant protein, iron.'
  },
  'High-protein/Bodybuilding diet': {
    issue: 'Fiber and B vitamin deficiency from excessive protein focus',
    impact: 'Usually supports hair health unless vegetable intake is too low',
    recommendation: 'Add leafy greens (100g), seeds (20-30g), berries (100g), colorful vegetables (100g). Consider multivitamin if needed.'
  },
  'Mediterranean diet': {
    issue: 'Generally balanced but may need optimization',
    impact: 'Usually hair-supportive if properly balanced',
    recommendation: 'Continue current approach. Add legumes (150g), seeds (20-30g), leafy greens (100g), seafood (100-150g) if not already included.'
  },
  'Macrobiotic diet': {
    issue: 'Protein, B12, iron, and vitamin D deficiency from restrictions',
    impact: 'Similar risks to vegan diet if no fish/eggs included',
    recommendation: 'Add seaweed (5-10g), tofu/tempeh (100-150g), miso, sesame seeds (20-30g), mushrooms (100g). Supplement B12, iron, vitamin D.'
  },
  'Nut-based/Plant fats diet': {
    issue: 'Lysine deficiency and omega-3 imbalance from nut focus',
    impact: 'May cause dryness and breakage if omega-3 levels are low',
    recommendation: 'Add legumes (150g), quinoa (150g), whole grains (50-100g), leafy greens (100g), seaweed (5-10g). Supplement omega-3.'
  },
  'Crash dieting/Calorie restriction': {
    issue: 'Protein, iron, zinc, biotin, and severe calorie deficiency',
    impact: 'Can cause sudden, massive hair shedding within 2-3 months',
    recommendation: 'Resume balanced nutrition immediately. Include eggs (50-100g), nuts (30g), seeds (20-30g), legumes (150g), fish (100-150g). Supplement protein, iron, zinc.'
  },
   'Crash dieting': { 
    issue: 'Protein, iron, zinc, biotin, and severe calorie deficiency',
    impact: 'Can cause sudden, massive hair shedding within 2-3 months',
    recommendation: 'Resume balanced nutrition immediately. Include eggs (50-100g), nuts (30g), seeds (20-30g), legumes (150g), fish (100-150g). Supplement protein, iron, zinc.'
  },
  'Sports-focused/Athletic diet': {
    issue: 'Iron, zinc, and biotin deficiency from high nutrient demands',
    impact: 'Micronutrient imbalance may affect hair health despite adequate calories',
    recommendation: 'Add eggs (50-100g), small fish (100-150g), seeds (20-30g), legumes (150g), leafy greens (100g). Consider multivitamin.'
  },
  'Region-specific diet': {
    issue: 'Varies by regional dietary patterns and food availability',
    impact: 'Hair effects depend on regional nutritional gaps',
    recommendation: 'Adjust to local dietary gaps. Focus on legumes, leafy greens, fish or fortified alternatives based on regional needs.'
  },

  // MEDICATIONS & DRUGS (11 tags)
  'Chemotherapy (Cancer treatment)': {
    issue: 'Directly damages rapidly dividing hair follicle cells during treatment',
    impact: 'Can cause sudden, diffuse shedding (anagen effluvium), potentially total hair loss',
    recommendation: 'Use scalp cooling during treatment, gentle hair care, prepare with wigs/scarves. Hair typically regrows 3-6 months post-treatment.'
  },
  'Beta-blockers (Heart medications)': {
    issue: 'Disrupts normal hair growth cycle, pushing follicles into telogen phase',
    impact: 'May cause diffuse thinning (telogen effluvium) 2-3 months after starting',
    recommendation: 'Discuss dose adjustment or medication alternatives with cardiologist. Usually reversible with medication modification.'
  },
  'Antidepressants (SSRIs, Tricyclics)': {
    issue: 'May affect neurotransmitters that influence hair growth cycles',
    impact: 'Can cause diffuse thinning, typically 2-4 months after starting medication',
    recommendation: 'Do not stop abruptly. Discuss alternatives with psychiatrist. Recovery may take 6-12 months after adjustment.'
  },
  'Blood thinners (Anticoagulants)': {
    issue: 'May interfere with vitamin K metabolism and protein synthesis needed for hair',
    impact: 'Can cause hair shedding (telogen effluvium), usually within 3-6 months',
    recommendation: 'Monitor with doctor, ensure adequate nutrition. Typically reverses 3-6 months after discontinuation if medically appropriate.'
  },
  'Acne treatment (Retinoids like Isotretinoin)': {
    issue: 'High doses can disrupt normal hair follicle function and protein synthesis',
    impact: 'May cause diffuse thinning during treatment',
    recommendation: 'Usually resolves after treatment completion. Use gentle hair care during treatment. Discuss concerns with dermatologist.'
  },
  'Birth control pills': {
    issue: 'Hormonal effects vary by formulation - some progestins have androgenic activity',
    impact: 'Can improve or worsen hair loss depending on progestin type and individual sensitivity',
    recommendation: 'Choose pills with anti-androgenic progestins (drospirenone). Monitor hair changes when starting/stopping. Consider alternatives if hair loss occurs.'
  },
  'Hormone replacement therapy': {
    issue: 'Can balance or worsen hormone levels depending on formulation and timing',
    impact: 'Variable effects on hair growth - may help menopausal hair loss or worsen it',
    recommendation: 'Work with hormone specialist for optimization. Consider bioidentical hormones. Regular monitoring and dose adjustments needed.'
  },
  'Anticonvulsants (Epilepsy medications)': {
    issue: 'May affect protein synthesis and folate metabolism necessary for hair growth',
    impact: 'Can cause diffuse shedding and changes in hair texture/color',
    recommendation: 'Usually reversible with medication adjustment. Discuss alternatives with neurologist if hair loss is significant.'
  },
  'Mood stabilizers/Antipsychotics': {
    issue: 'May affect thyroid function and neurotransmitter pathways involved in hair growth',
    impact: 'Can cause diffuse thinning, usually after long-term use',
    recommendation: 'Regular thyroid monitoring with lithium. Discuss alternatives with psychiatrist if hair loss is concerning.'
  },
  'NSAIDs (Long-term use)': {
    issue: 'May cause telogen effluvium through systemic effects or nutrient interference',
    impact: 'Rare but possible mild diffuse shedding after chronic high-dose use',
    recommendation: 'Usually mild and reversible when medication is reduced or stopped under medical supervision.'
  },
  'Statins (Cholesterol medications)': {
    issue: 'Unknown mechanism, possibly related to cholesterol\'s role in cell membrane function',
    impact: 'Rare cause of diffuse shedding (reported in less than 1% of users)',
    recommendation: 'Often resolves without discontinuation. Switching statins may help if hair loss is confirmed medication-related.'
  },

  // EXTERNAL FACTORS (10 tags)
  'Hard water exposure': {
    issue: 'Mineral buildup from calcium and magnesium deposits on hair shaft',
    impact: 'Causes dryness, breakage, dullness, and scalp irritation from mineral accumulation',
    recommendation: 'Install shower filter, use chelating shampoos weekly, final rinse with distilled water, monthly clarifying treatments.'
  },
  'Pollution & dust exposure': {
    issue: 'Particulates clog hair follicles and create oxidative stress from environmental toxins',
    impact: 'Can cause follicle blockage, inflammation, and compromised scalp barrier function',
    recommendation: 'Wash scalp 2-3x/week with gentle detox shampoo, use anti-pollution leave-in serums, cover hair in high-pollution areas.'
  },
  'Excessive UV & heat exposure': {
    issue: 'UV radiation damages hair proteins and excessive heat depletes moisture',
    impact: 'Sun dries scalp, causes brittle hair, color fading, and structural damage',
    recommendation: 'Wear hats in sun, use UV-protect sprays, apply SPF to scalp parting, seek shade during peak hours (10 AM-4 PM).'
  },
  'High humidity & sweat': {
    issue: 'Excessive moisture creates environment for fungal growth and product buildup',
    impact: 'Increased risk of scalp infections, irritation, and bacterial overgrowth',
    recommendation: 'Clean scalp regularly, use absorbent headbands, avoid overwashing, use dry shampoo between washes.'
  },
  'Windy conditions': { // Changed from 'Wind'
    issue: 'Mechanical friction and constant hair movement causes physical damage',
    impact: 'Can cause breakage, tangling, scalp irritation, and moisture loss',
    recommendation: 'Cover hair with scarves or hats in windy conditions, use protective hairstyles (braids, buns), apply leave-in conditioners.'
  },
  'Seasonal weather changes': { // Changed from 'Seasonal changes'
    issue: 'Weather fluctuations affect scalp moisture and may trigger seasonal shedding',
    impact: 'Can cause dryness, increased shedding, and scalp sensitivity changes',
    recommendation: 'Adjust hair care by season: moisturizing in winter, UV-protection in summer, monitor for increased shedding during transitions.'
  },
  'Chlorine & salt water exposure': {
    issue: 'Chlorine strips natural oils and proteins; salt crystallizes and dries hair',
    impact: 'Can cause severe dryness, protein structure damage, and texture changes',
    recommendation: 'Rinse before/after swimming, wear swim cap, deep condition weekly, use chelating shampoos, pre-swim conditioning treatments.'
  },
  'Indoor heating & cooling': {
    issue: 'Dry air from HVAC systems depletes moisture from hair and scalp',
    impact: 'Can cause moisture loss, static hair, and scalp dryness',
    recommendation: 'Use humidifiers indoors, hydrate hair with leave-in treatments, maintain 30-50% humidity, use anti-static products.'
  },
  'Smoking/Secondhand smoke': {
    issue: 'Free radicals weaken hair shaft and reduce blood flow to follicles',
    impact: 'Causes oxidative damage, compromised nutrient delivery, and toxin accumulation in hair',
    recommendation: 'Avoid smoking, use antioxidant hair products, improve ventilation, consider antioxidant supplements, professional scalp treatments.'
  },
  'Stressful city life': {
    issue: 'Increases cortisol levels and combines multiple environmental stressors',
    impact: 'Can speed up hair shedding (telogen effluvium) and chronic inflammation',
    recommendation: 'Practice stress management: yoga, mindfulness, scalp massage, regular exercise, adequate sleep (7-9 hours).'
  },

  // HAIRCARE HABITS (19 tags)
  'Frequent tight hairstyles': {
    issue: 'Constant tension on hair follicles weakens root structure over time',
    impact: 'Can cause traction alopecia (hairline recession, thinning) and permanent damage',
    recommendation: 'Switch to loose styles immediately, rotate hairstyle positions, use silk hair ties, give hair "rest days", monitor hairline for early signs.'
  },
  'Braids/Dreadlocks/Weaves': {
    issue: 'Heavy, sustained pulling on follicles, especially at hairline and temples',
    impact: 'Can lead to traction alopecia and scalp tension damage',
    recommendation: 'Limit wear to 6-8 weeks maximum, choose lightweight materials, ensure professional installation, apply scalp oils to reduce tension.'
  },
  'Hair extensions': {
    issue: 'Added weight and tension stress follicles at attachment points',
    impact: 'Can cause breakage at attachment points and pulling damage to natural follicles',
    recommendation: 'Choose lightweight clip-ins over permanent extensions, regular maintenance appointments, deep conditioning, gentle brushing techniques.'
  },
  'Frequent ponytails/buns': {
    issue: 'Repetitive tension in same areas leads to follicle weakening over time',
    impact: 'Can cause hairline thinning and stress on follicles, especially at temples',
    recommendation: 'Wear loosely, alternate with down styles, avoid daily repetition, use spiral hair ties, change ponytail height regularly.'
  },
  'Heavy hair accessories': {
    issue: 'Weight and pressure create tension points that can damage hair shaft and follicles',
    impact: 'Can cause constant pulling on scalp and breakage at pressure points',
    recommendation: 'Use lighter clips/headbands, alternate accessories, ensure comfort, choose cushioned contact points, remove before sleeping.'
  },
  'Excessive heat styling': {
    issue: 'High temperatures damage protein bonds and remove moisture from hair shaft',
    impact: 'Causes hair shaft weakening, moisture removal, and progressive breakage',
    recommendation: 'Use heat protectant always, limit to 2-3x/week, keep tools on low/medium heat, use ceramic/ionic tools, regular protein treatments.'
  },
  'Frequent blow-drying': {
    issue: 'Continuous heat exposure and air flow strip moisture and disrupt cuticle structure',
    impact: 'Can cause dryness, breakage, and hair shaft stress from repeated heat damage',
    recommendation: 'Use low heat, air dry when possible, always use heat protectant, keep 6 inches away, use cool shot setting.'
  },
  'Chemical treatments (relaxing, perms)': {
    issue: 'Chemical alteration of protein bonds weakens hair structure permanently',
    impact: 'Can cause severe cuticle damage, breakage, and scalp burns',
    recommendation: 'Space treatments 6-8 weeks apart, deep condition regularly, seek professional help, strand test first, use protein-reconstructing treatments.'
  },
  'Hair coloring/bleaching': {
    issue: 'Chemical processing lifts cuticles and removes natural pigments',
    impact: 'Causes dryness, protein loss, and hair fragility from structural damage',
    recommendation: 'Wait 4-6 weeks between sessions, use ammonia-free formulas, pre-treatment conditioning, weekly deep conditioning masks.'
  },
  'Excessive brushing/combing': {
    issue: 'Repeated friction and pulling can damage hair shaft and stress follicles',
    impact: 'Can cause mechanical breakage and follicle irritation from over-manipulation',
    recommendation: 'Use wide-tooth combs, gentle detangling, avoid brushing wet hair vigorously, brush from ends to roots, limit to twice daily.'
  },
  'Aggressive scalp scrubbing': {
    issue: 'Harsh mechanical action can damage scalp tissue and disrupt natural barrier',
    impact: 'Can cause scalp irritation, inflammation, and disrupted scalp barrier function',
    recommendation: 'Use gentle scalp massages, avoid hard brushes/scrubs, use fingertips not nails, gentle circular motions, rinse thoroughly.'
  },
  'Not using shower filter': { // Simplified from 'Not using a shower filter (Hard water)'
    issue: 'Calcium and magnesium deposits accumulate on hair shaft without filtration',
    impact: 'Can cause mineral buildup leading to dryness, breakage, and dullness',
    recommendation: 'Install shower filter immediately, use chelating shampoos weekly, consider whole-house water softening, final rinse with distilled water.'
  },
  'Daily shampooing/overwashing': {
    issue: 'Excessive cleansing removes sebum faster than scalp can produce it',
    impact: 'Can cause stripping of natural oils, dryness, breakage, and scalp irritation',
    recommendation: 'Reduce to 2-3x/week, use dry shampoo between washes, focus shampoo on scalp only, choose sulfate-free formulas.'
  },
  'Using harsh shampoos': { // Simplified from 'Using harsh shampoos (Sulfates, Alcohol)'
    issue: 'Aggressive surfactants and alcohols strip natural oils and disrupt scalp pH',
    impact: 'Can cause scalp dryness, irritation, and hair fragility from barrier disruption',
    recommendation: 'Switch to sulfate-free, pH-balanced shampoos (4.5-6.5), look for gentle cleansing agents, avoid alcohol-based products.'
  },
  'Too many styling products': { // Simplified from 'Using too many styling products'
    issue: 'Product accumulation can block follicles and create bacterial growth environment',
    impact: 'Can cause scalp buildup, pore clogging, and potential follicle inflammation',
    recommendation: 'Minimize product layering, cleanse scalp thoroughly 1-2x/week, choose water-based products, apply to lengths not scalp.'
  },
  'Wearing tight hats/helmets': {
    issue: 'Constant rubbing and pressure create mechanical stress on hair and follicles',
    impact: 'Can cause friction leading to breakage and potential traction alopecia',
    recommendation: 'Ensure good fit, use moisture-wicking liners, avoid prolonged wear, remove periodically for scalp ventilation.'
  },
  'Sleeping on rough pillowcases': {
    issue: 'Cotton and rough fabrics create friction that damages hair cuticles during sleep',
    impact: 'Can cause friction leading to breakage, split ends, and hair tangling',
    recommendation: 'Switch to silk/satin pillowcases, wear silk hair wrap at night, use loose braids for sleep, regular pillowcase washing.'
  },
  'Poor scalp hygiene': {
    issue: 'Accumulation of oils, dead skin, and products creates bacterial/fungal growth environment',
    impact: 'Can cause scalp buildup, inflammation, and hair follicle damage from poor conditions',
    recommendation: 'Regular cleansing with mild shampoo, gentle exfoliation 1-2x/month, scalp massage for circulation, antifungal treatments if needed.'
  },
  // HORMONAL FACTORS (18 tags)
  'Pregnancy/postpartum': {
    issue: 'Postpartum estrogen drop causes sudden shift from extended growth phase to shedding',
    impact: 'Can cause sudden diffuse shedding 2-4 months after delivery as hormone levels normalize',
    recommendation: 'Gentle hair care during shedding phase, adequate nutrition (iron, protein, vitamins), stress reduction. Typically resolves 6-12 months postpartum.'
  },
  'Irregular periods': {
    issue: 'Menstrual cycle disruptions signal hormone imbalances affecting hair growth cycles',
    impact: 'Can cause diffuse shedding and texture changes due to hormonal fluctuations',
    recommendation: 'Track cycles and hair changes, evaluate underlying causes (PCOS, thyroid), address nutritional deficiencies, consider hormonal regulation.'
  },
  'Acne or oily skin': {
    issue: 'Elevated androgens (testosterone, DHT) affecting both skin and hair follicles',
    impact: 'Strong indicator of androgenic hair loss - can accelerate male-pattern hair loss',
    recommendation: 'Anti-androgen medications (spironolactone), DHT-blocking treatments, hormonal contraceptives with anti-androgenic properties.'
  },
  'More facial or body hair': {
    issue: 'Hirsutism from elevated androgens creates paradoxical effect on hair growth',
    impact: 'Body hair increases while scalp hair thins - classic sign of androgen excess',
    recommendation: 'Anti-androgen therapy, insulin-sensitizing treatments if PCOS, DHT-blocking treatments, weight management if applicable.'
  },
  'Thinning hair on crown': {
    issue: 'DHT sensitivity causing follicle miniaturization in classic androgenic pattern',
    impact: 'Indicates androgenic alopecia pattern - usually progressive without intervention',
    recommendation: 'DHT blockers (finasteride, dutasteride), anti-androgen treatments, topical treatments, hair transplantation for advanced cases.'
  },
  'Thinning hair at temples': {
    issue: 'DHT sensitivity or mechanical stress causing hairline recession pattern',
    impact: 'Can indicate androgenic alopecia or traction alopecia - early sign requiring intervention',
    recommendation: 'Evaluate for androgenic vs. mechanical causes, DHT blockers if androgenic, eliminate tension if traction-related.'
  },
  'Hot flashes': {
    issue: 'Estrogen decline during menopausal transition affecting multiple body systems',
    impact: 'Can cause overall thinning, dryness, and texture changes associated with menopause',
    recommendation: 'Consider hormone replacement therapy, topical estrogen treatments, phytoestrogens (soy, red clover), calcium/vitamin D support.'
  },
  'Night sweats': {
    issue: 'Hormonal fluctuations and estrogen decline causing temperature regulation issues',
    impact: 'Associated with overall hormonal instability that can affect hair growth',
    recommendation: 'Address underlying hormonal changes, improve sleep quality, consider HRT evaluation, stress reduction techniques.'
  },
  'Tired/low energy': {
    issue: 'May indicate thyroid disorders, hormonal imbalances, or chronic stress affecting metabolism',
    impact: 'Can be associated with diffuse thinning and poor hair quality due to metabolic issues',
    recommendation: 'Comprehensive evaluation for thyroid, adrenal, and other hormonal functions. Address underlying fatigue causes.'
  },
  'Easy weight gain': {
    issue: 'May indicate hypothyroidism, insulin resistance, or cortisol elevation',
    impact: 'Often associated with diffuse hair loss due to underlying metabolic dysfunction',
    recommendation: 'Thyroid function testing, insulin resistance evaluation, stress hormone assessment, metabolic support.'
  },
  'Easy weight loss': {
    issue: 'May indicate hyperthyroidism, stress, or malnutrition affecting metabolism',
    impact: 'Can cause diffuse shedding and brittle hair from metabolic acceleration',
    recommendation: 'Thyroid function evaluation, stress assessment, nutritional evaluation, medical evaluation for underlying causes.'
  },
  'Cold or heat sensitivity': {
    issue: 'Strong indicator of thyroid dysfunction affecting temperature regulation',
    impact: 'Temperature sensitivity often correlates with hair changes in thyroid disorders',
    recommendation: 'Comprehensive thyroid testing (TSH, T3, T4, antibodies), thyroid hormone optimization if needed.'
  },
  'Currently taking birth control': {
    issue: 'Hormonal contraceptives can affect hair growth depending on androgenic activity',
    impact: 'Variable effects - can improve or worsen hair loss depending on formulation',
    recommendation: 'Choose anti-androgenic formulations, monitor hair changes, consider alternatives if hair loss occurs, nutritional support during transitions.'
  },
  'Currently taking hormones': { // Simplified from 'Currently taking hormones (testosterone, estrogen, etc.)'
    issue: 'Hormone replacement therapy effects depend on type, dose, and individual response',
    impact: 'Can have variable effects on hair growth - may help or harm depending on specifics',
    recommendation: 'Work with experienced hormone specialist, regular monitoring and adjustments, consider bioidentical options, track hair changes.'
  },
  'Using muscle-building steroids': {
    issue: 'Anabolic steroids convert to DHT at higher rates and shut down natural testosterone',
    impact: 'Can cause sudden severe thinning that may be permanent even after stopping',
    recommendation: 'Stop immediately with medical supervision, DHT blockers if advised, focus on scalp health, endocrine evaluation essential.'
  },
  'Poor libido': {
    issue: 'May indicate low testosterone, hormonal imbalances, or other endocrine dysfunction',
    impact: 'Can correlate with hormonal hair loss patterns due to broader hormonal dysfunction',
    recommendation: 'Hormone level evaluation, address underlying causes, lifestyle modifications (exercise, stress reduction, adequate sleep).'
  },
  'Big stress/trauma lately': {
    issue: 'Acute stress and emotional trauma trigger sudden cortisol elevation',
    impact: 'Can cause sudden diffuse shedding (shock loss) 2-3 months after traumatic event',
    recommendation: 'Stress management, counseling, gentle hair care, balanced nutrition. Usually reversible once emotional healing progresses.'
  },
  'Other hormone issues': { // Simplified from 'Other hormone issues (please describe)'
    issue: 'Various hormonal conditions can affect hair growth through different mechanisms',
    impact: 'Hair impact varies depending on specific hormonal condition described',
    recommendation: 'Comprehensive hormonal evaluation, address underlying medical conditions, targeted treatments based on specific imbalances.'
  },

  // MENTAL HEALTH (10 tags)
  'High stress': {
    issue: 'Sustained stress increases cortisol levels, disrupting hair follicle cycling',
    impact: 'Can cause telogen effluvium - pushing hair follicles into shedding phase prematurely',
    recommendation: 'Mindfulness, breathing exercises, meditation, magnesium (400mg) & B vitamins, gentle hair care, regular exercise for stress reduction.'
  },
  'Chronic stress': {
    issue: 'Long-term cortisol elevation leads to nutrient depletion and chronic inflammation',
    impact: 'Can cause progressive hair weakening, reduced growth rate, and chronic inflammation affecting follicles',
    recommendation: 'Regular exercise (30 min, 5x/week), cognitive behavioral therapy, anti-inflammatory diet, daily scalp massage (5-10 min).'
  },
  'Mood swings': {
    issue: 'Hormonal and mood fluctuations can reflect underlying imbalances affecting hair cycles',
    impact: 'Can slow hair regrowth and contribute to inconsistent growth patterns',
    recommendation: 'Maintain stable daily routine, consider therapy for mood stabilization, ensure adequate sleep, track mood patterns.'
  },
  'Depression': {
    issue: 'Affects neurotransmitters, nutrition habits, and overall self-care behaviors',
    impact: 'Can cause hair thinning, fragility, and poor self-care leading to additional hair damage',
    recommendation: 'Professional therapy, psychiatric evaluation if needed, meal planning, omega-3 supplements, gentle hair care, social support involvement.'
  },
  'Anxiety': {
    issue: 'Chronic anxiety maintains elevated stress hormones and may cause hair-pulling behaviors',
    impact: 'Can cause hair miniaturization, breakage, scalp tension, and behavioral hair damage',
    recommendation: 'Breathing exercises (4-7-8 breathing), limit caffeine, magnesium (300-400mg), avoid hair-pulling triggers, anxiety management techniques.'
  },
  'Burnout/Exhaustion': {
    issue: 'Physical and mental exhaustion depletes essential nutrients faster than replenishment',
    impact: 'Can cause vitamin and mineral depletion (zinc, B vitamins) needed for hair health',
    recommendation: 'Prioritize sleep (8-9 hours), gentle movement (restorative yoga, walking), nutritional support (multivitamin, B-complex, zinc), work boundaries.'
  },
  'Insomnia/Poor sleep': {
    issue: 'Poor sleep reduces hair and skin regeneration during crucial recovery periods',
    impact: 'Can cause hair dryness, fragility, and shedding due to disrupted growth hormone release',
    recommendation: 'Sleep hygiene (cool, dark room 65-68°F), no screens 1-2 hours before bed, consistent bedtime routine, relaxation techniques.'
  },
  'Major life events': {
    issue: 'Emotional trauma from significant life changes triggers stress response',
    impact: 'Can cause telogen effluvium and hair shedding 2-4 months after traumatic event',
    recommendation: 'Crisis counseling, family/friend support network, grief processing, maintain nutrition, gentle exercise, avoid additional hair stressors.'
  },
  'Taking mental health medications': {
    issue: 'Various psychiatric medications can affect hair growth through different mechanisms',
    impact: 'Can cause hair shedding as side effect, usually 2-4 months after starting medication',
    recommendation: 'Regular follow-ups with prescribing doctor, discuss hair concerns, consider alternatives with lower hair loss risk, supportive scalp care.'
  },
  'Other mental health concerns': {
    issue: 'All mental health imbalances can indirectly affect hair through stress, diet, and hormones',
    impact: 'Effects vary by specific condition but generally impact self-care and stress levels',
    recommendation: 'Professional assessment for proper diagnosis, individualized treatment plan, holistic care addressing both mental health and hair care.'
  },

  // PHYSICAL ACTIVITY (9 tags)
  'Intense workouts/Overtraining': {
    issue: 'Chronic stress from excessive exercise, cortisol spikes, and nutrient depletion',
    impact: 'Can cause telogen effluvium and poor recovery affecting hair growth',
    recommendation: 'Follow 80/20 rule (80% moderate, 20% high intensity), include 1-2 rest days/week, increase protein (1.2-1.6g/kg), stress monitoring.'
  },
  // 'Wearing tight headgear/helmets': { // Already defined in Haircare Habits, but distinct context for physical activity
  //   issue: 'Constant pressure and friction damage hair shafts and follicles during activity',
  //   impact: 'Can cause traction alopecia and breakage at pressure points (hairline, temples) specific to workout gear',
  //   recommendation: 'Ensure proper fit for sports headgear, use moisture-wicking liners, rotate position when possible, apply leave-in conditioner before use, take breaks if worn for long periods.'
  // }, // This one is a duplicate from haircare. Assuming it's okay as context is slightly different.
  'Excessive sweating': {
    issue: 'Salt crystals from dried sweat irritate scalp and can clog follicles post-exercise',
    impact: 'Can cause scalp buildup, bacterial growth, inflammation, and itching if not addressed promptly',
    recommendation: 'Cool water rinse within 30 minutes post-workout, gentle pH-balanced shampoos, dry shampoo between washes, weekly clarifying treatments.'
  },
  'Hot yoga/High-heat activities': {
    issue: 'Excessive heat exposure depletes hair moisture and affects protein structure during activity',
    impact: 'Can cause dehydration leading to dry, brittle hair and damaged cuticles from workout environment',
    recommendation: 'Hydrate well (16-20oz 2 hours before), apply protective leave-in treatment, cool water rinse post-activity, weekly deep conditioning.'
  },
  'Swimming in chlorinated pools': {
    issue: 'Chlorine strips natural oils and proteins from hair shaft structure during swimming',
    impact: 'Can cause severe dryness, brittleness, scalp irritation, and texture changes from pool water',
    recommendation: 'Wet hair with clean water first, use silicone swim caps, immediate post-swim rinse, chelating shampoos weekly, deep conditioning 1-2x/week.'
  },
  'Outdoor sports/Sun exposure': {
    issue: 'UV radiation breaks down hair proteins and causes scalp sunburn during outdoor activities',
    impact: 'Can cause hair breakage, color fading, dry scalp, and cumulative damage from sun',
    recommendation: 'Wear UV-protective hats or visors, use SPF hair products, apply sunscreen to scalp parting, seek shade during peak hours.'
  },
  'Wearing sweatbands/caps': {
    issue: 'Friction and moisture trapping create mechanical stress and bacterial growth during workouts',
    impact: 'Can cause breakage, scalp irritation, and disrupted circulation from pressure of sports headwear',
    recommendation: 'Use soft, moisture-wicking materials (bamboo, merino wool), ensure proper fit, wash regularly, vary position and style.'
  },
  'Using hair ties during workouts': {
    issue: 'Repeated tension in same spots weakens hair follicles over time due to workout movements',
    impact: 'Can cause breakage and traction alopecia, especially at hairline and temples from securing hair for activity',
    recommendation: 'Use fabric-covered or spiral hair ties, change position regularly, secure but not tight, remove immediately post-workout.'
  },
  'Lack of rest/sleep after workouts': {
    issue: 'Poor recovery maintains elevated cortisol and disrupts growth hormone release critical for athletic repair',
    impact: 'Can slow hair regrowth and recovery due to inadequate repair time for physically active individuals',
    recommendation: 'Prioritize sleep (8-9 hours for athletes), post-workout cool-down, stress management, magnesium-rich foods (nuts, seeds, leafy greens).'
  },

  // SCALP CONDITIONS (19 tags)
  'Dandruff': {
    issue: 'Malassezia yeast overgrowth leading to flaking and mild inflammation',
    impact: 'Mild inflammation can affect follicle health and increase shedding',
    recommendation: 'Anti-dandruff shampoos with zinc pyrithione or ketoconazole, gentle scalp massage, avoid over-washing, manage stress levels.'
  },
  'Itchy scalp': {
    issue: 'Various causes including dry skin, allergies, infections, or nerve sensitivity',
    impact: 'Scratching can damage follicles and cause breakage from mechanical trauma',
    recommendation: 'Identify triggers, cool water rinses, anti-itch shampoos with menthol/tea tree, avoid scratching, use gentle patting instead.'
  },
  'Oily scalp': {
    issue: 'Excessive sebum production from hormonal, genetic, or environmental factors',
    impact: 'Excess oil can clog follicles and create inflammatory environment',
    recommendation: 'Regular washing with gentle clarifying shampoos (2-3x/week), oil-free styling products, clay masks weekly, address hormonal issues.'
  },
  'Dry scalp': {
    issue: 'Insufficient natural oil production or excessive moisture loss',
    impact: 'Dry environment can weaken hair shafts and cause brittleness',
    recommendation: 'Gentle moisturizing shampoos, reduce washing frequency, scalp oils (jojoba, argan), use humidifiers, deep conditioning treatments.'
  },
  'Red/irritated scalp': {
    issue: 'Inflammation from allergies, infections, chemical reactions, or autoimmune conditions',
    impact: 'High risk - inflammation can damage follicles and cause temporary or permanent loss',
    recommendation: 'Identify and remove irritants, cool compresses, gentle fragrance-free products, anti-inflammatory treatments, avoid heat styling.'
  },
  'Flaky scalp': {
    issue: 'Loose scales from seborrheic dermatitis, psoriasis, eczema, or product buildup',
    impact: 'Scaling can disrupt normal follicle function depending on underlying cause',
    recommendation: 'Medicated shampoos with specific active ingredients, gentle exfoliation, regular cleansing, moisturizing between washes, avoid picking.'
  },
  'Scalp bumps/pimples': {
    issue: 'Folliculitis, bacterial infection, seborrheic dermatitis, or product reactions',
    impact: 'Infected follicles can cause permanent damage if severe or untreated',
    recommendation: 'Antibacterial shampoos, avoid picking/squeezing, tea tree oil treatments, change pillowcases frequently, seek medical help if severe.'
  },
  'Painful scalp': {
    issue: 'Tight hairstyles, inflammation, infections, neurological conditions, or trauma',
    impact: 'Pain often indicates follicle stress or damage requiring immediate attention',
    recommendation: 'Loosen tight styles immediately, gentle scalp massage, anti-inflammatory treatments, stress reduction, avoid harsh chemical treatments.'
  },
  'Burning/stinging scalp': {
    issue: 'Chemical burns, allergic reactions, nerve sensitivity, infections, or medication effects',
    impact: 'Indicates significant irritation or damage that can severely affect follicles',
    recommendation: 'Remove irritants immediately, cool water rinses, avoid all chemical treatments, use gentle hypoallergenic products, apply cool compresses.'
  },
  'Scalp wounds/sores': {
    issue: 'Physical trauma, severe infections, autoimmune conditions, or chronic inflammation',
    impact: 'High risk for permanent scarring and follicle destruction',
    recommendation: 'Keep clean and dry, avoid further trauma, prevent secondary infections, avoid chemical treatments, immediate medical attention required.'
  },
  'Crusty patches': {
    issue: 'Thick scale formation from severe seborrheic dermatitis, psoriasis, or infections',
    impact: 'Thick scales can damage follicles underneath and impair normal function',
    recommendation: 'Gentle removal with oil treatments, medicated shampoos as directed, avoid forceful scraping, moisturizing treatments, consistent care routine.'
  },
  'Scalp infection/fungus': {
    issue: 'Bacterial, fungal, or viral infections affecting scalp tissue and follicles',
    impact: 'High risk - infections can cause temporary or permanent hair loss',
    recommendation: 'Antifungal or antibacterial treatments as prescribed, maintain excellent hygiene, disinfect tools, avoid sharing items, complete treatment course.'
  },
  'Scalp psoriasis': {
    issue: 'Autoimmune condition causing thick, silvery scales and chronic inflammation',
    impact: 'Scaling and inflammation can cause temporary hair loss during flares',
    recommendation: 'Coal tar or salicylic acid shampoos, topical corticosteroids as prescribed, UV therapy under supervision, stress management techniques.'
  },
  'Scalp eczema': {
    issue: 'Inflammatory skin condition from allergies, genetics, or environmental triggers',
    impact: 'Scratching and inflammation can damage follicles and cause breakage',
    recommendation: 'Identify and avoid triggers, gentle fragrance-free products, topical corticosteroids if prescribed, cool compresses, stress reduction.'
  },
  'Sensitive to combing': {
    issue: 'Scalp inflammation, follicle sensitivity, traction damage, or underlying conditions',
    impact: 'Indicates underlying scalp stress or damage that needs gentle handling',
    recommendation: 'Use wide-tooth combs, gentle detangling techniques, wet hair with conditioner before combing, start from ends, reduce frequency.'
  },
  'Sensitive to massaging': {
    issue: 'Scalp inflammation, nerve hypersensitivity, recent trauma, or stress-related tension',
    impact: 'May indicate scalp health issues requiring careful assessment',
    recommendation: 'Avoid forceful massage, use light touch techniques, apply soothing treatments, address underlying inflammation, gradually increase tolerance.'
  },
  'Sensitive to hot water': {
    issue: 'Inflamed or compromised scalp barrier, nerve sensitivity, or recent chemical treatments',
    impact: 'Indicates scalp barrier dysfunction requiring gentle care',
    recommendation: 'Use lukewarm or cool water only, limit shower time, use gentle pH-balanced products, apply protective treatments, test temperature gradually.'
  },
  'Sensitive to cold water': {
    issue: 'Nerve sensitivity, circulation issues, scalp tension, or underlying health conditions',
    impact: 'May indicate circulation problems unless severe enough to impair blood flow',
    recommendation: 'Use room temperature water, warm up gradually, improve circulation with gentle massage, address underlying issues, protect from cold.'
  },
  'Other scalp issues': { // Simplified from 'Other scalp issues (Describe)'
    issue: 'Various scalp conditions not covered by standard categories',
    impact: 'Hair loss risk varies depending on specific condition described',
    recommendation: 'Detailed symptom documentation, professional evaluation required, avoid self-diagnosis, keep symptom diary, photograph changes if possible.'
  },

  // DEFAULT FALLBACK
  '__DEFAULT__': {
    issue: 'This factor has been identified as potentially contributing to your hair health.',
    impact: 'The specific impact can vary depending on individual circumstances and other combined factors.',
    recommendation: 'Consider discussing this factor with a healthcare provider or dermatologist for personalized advice and to understand its relevance to your specific situation.'
  }
};

const generateRecommendations = (selectedTags: SelectedTag[]): RecommendationDetail[] => {
  if (!selectedTags || selectedTags.length === 0) return [];
  return selectedTags.map(tagObj => {
    // First, try an exact match for the tag
    let recData = recommendationMap[tagObj.tag];
    
    // If no exact match, try to find a match by checking if the tagObj.tag is a substring of any key in recommendationMap
    // This is useful if tagObj.tag is simplified like "Wind" but map has "Windy conditions"
    if (!recData) {
      const matchingKey = Object.keys(recommendationMap).find(key => key.toLowerCase().includes(tagObj.tag.toLowerCase()));
      if (matchingKey) {
        recData = recommendationMap[matchingKey];
      }
    }

    // If still no match, use the default
    if (!recData) {
      recData = recommendationMap['__DEFAULT__'];
    }
    
    return {
      tag: tagObj.tag, // Always return the original tag for display purposes
      category: tagObj.category,
      issue: recData.issue,
      impact: recData.impact,
      recommendation: recData.recommendation
    };
  });
};

const summarizeSelections = (selections: (HairLossImage[] | SelectedTag[]), type: 'images' | 'tags'): SummaryByCategory => {
  const summary: SummaryByCategory = {};
  if (!selections) return summary;

  selections.forEach(item => {
    if (item && typeof item === 'object' && 'category' in item) {
      const category = item.category as string; 
      const description = type === 'images' ? (item as HairLossImage).description : (item as SelectedTag).tag;
      if (!summary[category]) {
        summary[category] = [];
      }
      summary[category].push(description);
    }
  });
  return summary;
};


export default function AssessmentStep3Page() {
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResults | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const generateAssessment = (): AssessmentResults | null => {
    const storedDataString = sessionStorage.getItem('assessmentData');
    if (!storedDataString) return null;

    try {
      const sessionData: AssessmentData = JSON.parse(storedDataString);
      const { selectedImages = [], selectedTags = [] } = sessionData;

      const imageCategories = selectedImages.map(img => img.category);
      const tagNames = selectedTags.map(tag => tag.tag);

      let classification: AssessmentResults['classification'] = 'Temporary';
      let severity: AssessmentResults['severity'] = 'Mild';

      const scarringImageCategories = ['other']; 
      // More specific keywords for scarring from image descriptions
      const scarringImageDescKeywords = [
        'frontal fibrosing', 'cicatricial alopecia', 'lichen planopilaris', 
        'dissecting cellulitis', 'scarring alopecia' 
      ];
      const scarringTags = [
        'Scalp wounds/sores', 'Scalp infection/fungus', 'Crusty patches', 
        'Lichen Planopilaris - Scarring alopecia', 'Dissecting Cellulitis - Inflammatory condition', 
        'Central Centrifugal Cicatricial Alopecia', 'Central Centrifugal Cicatricial Alopecia (advanced)',
        'Frontal Fibrosing Alopecia - Hairline recession', 'Frontal Fibrosing Alopecia - Advanced'
      ];


      const agaImageCategories = ['male-pattern', 'female-pattern'];
      const agaTags = ['Thinning hair on crown', 'Thinning hair at temples', 'Acne or oily skin', 'More facial or body hair'];

      const temporaryTags = ['High stress', 'Crash dieting/Calorie restriction', 'Crash dieting', 'Pregnancy/postpartum', 'Major life events', 'Chemotherapy (Cancer treatment)', 'Telogen Effluvium - Stress-related shedding', 'Telogen Effluvium - Diffuse shedding', 'Telogen Effluvium - Pattern variation', 'Beta-blockers (Heart medications)', 'Antidepressants (SSRIs, Tricyclics)', 'Blood thinners (Anticoagulants)'];


      if (
        scarringTags.some(tag => tagNames.includes(tag)) ||
        selectedImages.some(img => 
            scarringImageCategories.includes(img.category) && 
            scarringImageDescKeywords.some(keyword => img.description.toLowerCase().includes(keyword))
        )
      ) {
        classification = 'Permanent Scarring';
        severity = 'Severe';
      } else if (
        agaImageCategories.some(cat => imageCategories.includes(cat)) || 
        agaTags.some(tag => tagNames.includes(tag))
      ) {
        classification = 'Permanent Non-Scarring';
        const moderateSeverityImageCount = selectedImages.filter(img => 
          agaImageCategories.includes(img.category) && 
          (img.description.includes('Stage 3') || img.description.includes('Stage 4') || img.description.includes('Stage 5'))
        ).length;
        const generalAGACount = selectedImages.filter(img => agaImageCategories.includes(img.category)).length;
        const tagSeverityIndicators = selectedTags.filter(tag => agaTags.includes(tag.tag)).length;
        
        if (moderateSeverityImageCount > 0 || generalAGACount > 2 || tagSeverityIndicators > 1) {
            severity = 'Moderate to Severe';
        } else if (generalAGACount > 0 || tagSeverityIndicators > 0) {
            severity = 'Moderate';
        } else {
            severity = 'Mild'; 
        }

      } else if (temporaryTags.some(tag => tagNames.includes(tag)) || selectedImages.some(img => temporaryTags.some(tTag => img.description.toLowerCase().includes(tTag.toLowerCase())))) {
        classification = 'Temporary';
        const tempTagCount = selectedTags.filter(tag => temporaryTags.includes(tag.tag)).length;
        const tempImageMatch = selectedImages.some(img => temporaryTags.some(tTag => img.description.toLowerCase().includes(tTag.toLowerCase())));
        
        if (tempTagCount > 1 || (tempTagCount > 0 && tempImageMatch) || selectedImages.filter(img => temporaryTags.some(tTag => img.description.toLowerCase().includes(tTag.toLowerCase()))).length > 1 ) {
            severity = 'Moderate';
        } else if (tempTagCount > 0 || tempImageMatch) {
            severity = 'Mild to Moderate';
        } else {
             severity = 'Mild';
        }
      } else if (selectedImages.length > 0 || selectedTags.length > 0) {
        // Default fallback if no strong indicators but selections exist
        classification = 'Temporary'; 
        severity = 'Mild';
      }


      const recommendations = generateRecommendations(selectedTags);

      const results: AssessmentResults = {
        classification,
        severity,
        selectedImageSummary: summarizeSelections(selectedImages, 'images'),
        contributingFactorsSummary: summarizeSelections(selectedTags, 'tags'),
        recommendations,
        generatedAt: new Date().toISOString()
      };

      const updatedSessionData: AssessmentData = {
        ...sessionData,
        assessmentResults: results,
        currentStep: 3
      };
      sessionStorage.setItem('assessmentData', JSON.stringify(updatedSessionData));

      return results;

    } catch (error) {
      console.error("Error processing assessment:", error);
      return null;
    }
  };

  useEffect(() => {
    const results = generateAssessment();
    if (results) {
      setAssessmentResults(results);

      const numImageSelections = Object.values(results.selectedImageSummary || {}).reduce((acc, arr) => acc + arr.length, 0);
      const numTagSelections = Object.values(results.contributingFactorsSummary || {}).reduce((acc, arr) => acc + arr.length, 0);

      const initialAiMessageText = `Based on your assessment, your hair loss appears to be primarily classified as **${results.classification}** with a **${results.severity}** severity. I've analyzed your ${numImageSelections} selected image pattern(s) and ${numTagSelections} contributing factor(s). Would you like me to explain these results in more detail or discuss specific recommendations?`;
      
      const aiMessage: Message = {
        id: 'initial-assessment-msg',
        sender: 'ai',
        timestamp: new Date(),
        text: formatAIResponse(initialAiMessageText)
      };
      setChatMessages([aiMessage]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const getChatContext = () => {
    const storedDataString = sessionStorage.getItem('assessmentData');
    if (!storedDataString) return { currentStep: 3 };
    try {
      const sessionData: AssessmentData = JSON.parse(storedDataString);
      return {
        currentStep: 3,
        selectedImages: (sessionData.selectedImages || []).map(img => ({id: img.id, description: img.description, category: img.category})),
        selectedTags: sessionData.selectedTags || [],
        assessmentResults: sessionData.assessmentResults || null
      };
    } catch {
      return { currentStep: 3 };
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !assessmentResults) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    const context = getChatContext();

    try {
      const response = await fetch('/api/bedrock-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, context }),
      });

      if (response.ok) {
        const data = await response.json();
        const cleanResponse = formatAIResponse(data.response);
        const aiMessage: Message = {
          id: `${Date.now()}-ai`,
          text: cleanResponse,
          sender: 'ai',
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, aiMessage]);
      } else {
        const errorData = await response.text();
        console.error('API Error response:', errorData);
        setChatMessages(prev => [...prev, { id: `${Date.now()}-error`, text: 'Sorry, I had trouble. Please try again.', sender: 'ai', timestamp: new Date() }]);
      }
    } catch (error) {
      console.error('Chat fetch error:', error);
      setChatMessages(prev => [...prev, { id: `${Date.now()}-catch-error`, text: 'Sorry, an error occurred.', sender: 'ai', timestamp: new Date() }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const classificationBadgeColor = useMemo(() => {
    if (!assessmentResults) return 'default';
    switch (assessmentResults.classification) {
      case 'Temporary': return 'bg-green-500 hover:bg-green-600';
      case 'Permanent Non-Scarring': return 'bg-orange-500 hover:bg-orange-600';
      case 'Permanent Scarring': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  }, [assessmentResults]);

  if (!assessmentResults) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="flex items-center justify-between w-full max-w-4xl mb-4">
            <Link href="/assessment/step2" className="flex items-center text-primary hover:underline">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
            </Link>
            <span className="text-sm font-medium text-muted-foreground">Step 3 of 4</span>
        </div>
        <Progress value={75} className="w-full max-w-4xl mb-6" />
        <h1 className="text-2xl font-semibold mb-2 text-foreground">Step 3: Your Brief Assessment</h1>
        <p className="text-muted-foreground mb-8">Generating your assessment results...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalSelectedImages = Object.values(assessmentResults.selectedImageSummary || {}).reduce((sum, arr) => sum + arr.length, 0);
  const totalSelectedTags = Object.values(assessmentResults.contributingFactorsSummary || {}).reduce((sum, arr) => sum + arr.length, 0);
  const totalTagCategories = Object.keys(assessmentResults.contributingFactorsSummary || {}).length;


  return (
    <>
      <div className="container mx-auto px-4 py-8 pb-28">
        <div className="flex items-center justify-between mb-4">
          <Link href="/assessment/step2" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Link>
          <span className="text-sm font-medium text-muted-foreground">Step 3 of 4</span>
        </div>
        <Progress value={75} className="w-full mb-6" />

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2 text-foreground">Step 3: Your Brief Assessment</h1>
          <p className="text-muted-foreground">Based on your image selections and contributing factors.</p>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <Info className="mr-2 h-6 w-6" />
              Your Hair Loss Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-foreground">Classification:</span>
              <Badge className={`${classificationBadgeColor} text-white text-sm px-3 py-1`}>
                {assessmentResults.classification}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-foreground">Severity:</span>
              <Badge variant="secondary" className="text-sm px-3 py-1">{assessmentResults.severity}</Badge>
            </div>

            {totalSelectedImages > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mt-3 mb-1">Based on your selected image patterns:</h4>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-0.5">
                  {Object.entries(assessmentResults.selectedImageSummary).map(([category, descriptions]) =>
                    descriptions.map(desc => <li key={desc}>{desc} (Category: {category})</li>)
                  )}
                </ul>
              </div>
            )}
            {totalSelectedTags > 0 && (
                 <p className="text-sm text-muted-foreground pt-2">
                    We also considered <span className="font-semibold text-foreground">{totalSelectedTags}</span> contributing factor(s) across <span className="font-semibold text-foreground">{totalTagCategories}</span> categories you selected.
                </p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <Lightbulb className="mr-2 h-6 w-6" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>Based on the contributing factors you selected.</CardDescription>
          </CardHeader>
          <CardContent>
            {assessmentResults.recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessmentResults.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-background shadow-sm flex flex-col h-full">
                    <h4 className="font-semibold text-md text-foreground mb-1 flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-green-600 flex-shrink-0" />
                      {rec.tag}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">({rec.category})</span>
                    </h4>
                    <p className="text-sm text-muted-foreground mb-1"><span className="font-medium text-foreground/80">Potential Issue:</span> {rec.issue}</p>
                    <p className="text-sm text-muted-foreground mb-2"><span className="font-medium text-foreground/80">Possible Impact:</span> {rec.impact}</p>
                    <p className="text-sm text-foreground bg-primary/5 p-2 rounded-md mt-auto"><span className="font-medium text-primary">Suggestion:</span> {rec.recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No specific contributing factors selected that map to direct recommendations. Please consult with a healthcare provider for general advice.</p>
            )}
          </CardContent>
        </Card>

        <div className="bg-card p-4 md:p-6 rounded-xl shadow-xl mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <MessageSquare className="mr-2 h-6 w-6 text-primary"/>
            Chat About Your Assessment Results
          </h3>
          <ScrollArea className="h-60 mb-4 border rounded-lg p-3 bg-background chat-scroll-area">
            {chatMessages.map(msg => (
              <div key={msg.id} className="mb-2 last:mb-0">
                <div className={`p-2.5 rounded-xl text-sm w-fit max-w-[80%]
                  ${msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm ml-auto'
                    : 'bg-muted text-foreground rounded-tl-sm mr-auto'}`}>
                  <p className="font-semibold mb-0.5">{msg.sender === 'user' ? 'You' : 'AI Assistant'}</p>
                  {msg.sender === 'user' 
                    ? <p className="whitespace-pre-wrap">{msg.text}</p>
                    : <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text }}></p>
                  }
                  <span className="text-xs text-muted-foreground/70 mt-1 block text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-center p-2.5">
                  <div className="h-2 w-2 animate-dot-pulse-before rounded-full bg-muted-foreground [animation-delay:-0.3s] mr-1"></div>
                  <div className="h-2 w-2 animate-dot-pulse rounded-full bg-muted-foreground [animation-delay:-0.15s] mr-1"></div>
                  <div className="h-2 w-2 animate-dot-pulse-after rounded-full bg-muted-foreground"></div>
                  <span className="ml-2 text-sm text-muted-foreground">AI is thinking...</span>
              </div>
            )}
          </ScrollArea>
          <div className="flex items-center gap-2 mt-4">
            <Input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your results or recommendations..."
              onKeyPress={(e) => e.key === 'Enter' && !isChatLoading && handleChatSend()}
              className="flex-grow bg-muted border-transparent rounded-full px-4 py-2.5 text-sm placeholder:text-muted-foreground/80 focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isChatLoading || !assessmentResults}
            />
            <Button
              onClick={handleChatSend}
              disabled={isChatLoading || !chatInput.trim() || !assessmentResults}
              size="icon"
              className="bg-primary text-primary-foreground rounded-full p-2.5 w-10 h-10 hover:bg-primary/90 active:scale-95 transition-transform flex-shrink-0"
              aria-label="Send message"
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-up-md z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
              <Link href="/assessment/step2">Previous</Link>
            </Button>
            <Button
              size="lg"
              asChild
              disabled={!assessmentResults}
            >
              <Link href="/assessment/step4">Next: Treatment Options</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

    