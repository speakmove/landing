/**
 * Schema.org structured data builders for AI search and Google rich results.
 *
 * Each builder returns a plain object that can be passed directly to
 * <JsonLd data={...} />. Centralised here so the shape of the structured
 * data stays consistent across pages.
 */

const SCHEMA_CONTEXT = 'https://schema.org';

/* -------------------------------------------------------------------------
 * Organization — site-wide identity, applied once in the root layout.
 * ------------------------------------------------------------------------- */

type TOrganizationInput = {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
  contactEmail: string;
};

export const buildOrganizationLd = ({
  name,
  url,
  logo,
  description,
  sameAs,
  contactEmail,
}: TOrganizationInput) => ({
  '@context': SCHEMA_CONTEXT,
  '@type': 'Organization',
  name,
  url,
  logo,
  description,
  sameAs,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: contactEmail,
  },
});

/* -------------------------------------------------------------------------
 * SoftwareApplication + Offer — applied on /pricing for Google rich results
 * and AI assistants surfacing pricing + free trial.
 * ------------------------------------------------------------------------- */

type TSoftwareApplicationInput = {
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  inLanguage: readonly string[];
  url: string;
  offer: {
    price: string;
    priceCurrency: string;
    unitText: string;
    botUrl: string;
    areaServed: string;
  };
};

export const buildSoftwareApplicationLd = ({
  name,
  description,
  applicationCategory,
  operatingSystem,
  inLanguage,
  url,
  offer,
}: TSoftwareApplicationInput) => ({
  '@context': SCHEMA_CONTEXT,
  '@type': 'SoftwareApplication',
  name,
  description,
  applicationCategory,
  operatingSystem,
  inLanguage,
  url,
  offers: {
    '@type': 'Offer',
    price: offer.price,
    priceCurrency: offer.priceCurrency,
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      unitText: offer.unitText,
    },
    availability: 'https://schema.org/InStock',
    url: offer.botUrl,
    areaServed: offer.areaServed,
  },
});

/* -------------------------------------------------------------------------
 * FAQPage — Q&A extraction for Google AI Overviews and assistants.
 * ------------------------------------------------------------------------- */

type TFaqEntry = {
  question: string;
  answer: string;
};

export const buildFaqLd = (items: TFaqEntry[]) => ({
  '@context': SCHEMA_CONTEXT,
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});

/* -------------------------------------------------------------------------
 * BreadcrumbList — explicit page hierarchy for Google rich-result
 * breadcrumbs and AI source-trail attribution.
 * ------------------------------------------------------------------------- */

type TBreadcrumbItem = {
  name: string;
  url: string;
};

export const buildBreadcrumbLd = (items: TBreadcrumbItem[]) => ({
  '@context': SCHEMA_CONTEXT,
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.name,
    item: item.url,
  })),
});

/* -------------------------------------------------------------------------
 * HowTo — step-by-step content (e.g. /how-it-works flow) for Google AI
 * Overviews and assistants answering "how do I..." queries.
 * ------------------------------------------------------------------------- */

type THowToStep = {
  name: string;
  text: string;
};

type THowToInput = {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration, e.g. 'PT15M'
  steps: THowToStep[];
};

export const buildHowToLd = ({ name, description, totalTime, steps }: THowToInput) => ({
  '@context': SCHEMA_CONTEXT,
  '@type': 'HowTo',
  name,
  description,
  ...(totalTime ? { totalTime } : {}),
  step: steps.map((step, idx) => ({
    '@type': 'HowToStep',
    position: idx + 1,
    name: step.name,
    text: step.text,
  })),
});

/* -------------------------------------------------------------------------
 * SpeakableSpecification — marks page sections suitable for voice
 * assistants to read aloud via CSS selectors that target the key answer
 * regions (page title, lead paragraph, FAQ answers).
 * ------------------------------------------------------------------------- */

export const buildSpeakableLd = (cssSelectors: string[]) => ({
  '@context': SCHEMA_CONTEXT,
  '@type': 'WebPage',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: cssSelectors,
  },
});

/* -------------------------------------------------------------------------
 * Review / AggregateRating — DO NOT enable yet.
 *
 * Google's structured-data spam policy treats unverifiable, missing or
 * fabricated reviews as a manual-action risk. Enable this only when the
 * site has real customer reviews backed by an audit trail (e.g. Trustpilot,
 * G2, or a moderated in-app review flow). Until then keep this commented
 * so the schema definition stays version-controlled alongside the rest.
 * -------------------------------------------------------------------------
 *
 * type TAggregateRatingInput = {
 *   itemName: string;     // product/app the rating refers to
 *   ratingValue: number;  // average rating, e.g. 4.7
 *   reviewCount: number;  // total review count
 *   bestRating?: number;  // scale ceiling, default 5
 * };
 *
 * export const buildAggregateRatingLd = ({
 *   itemName,
 *   ratingValue,
 *   reviewCount,
 *   bestRating = 5,
 * }: TAggregateRatingInput) => ({
 *   '@context': SCHEMA_CONTEXT,
 *   '@type': 'Product',
 *   name: itemName,
 *   aggregateRating: {
 *     '@type': 'AggregateRating',
 *     ratingValue: ratingValue.toFixed(1),
 *     reviewCount,
 *     bestRating,
 *     worstRating: 1,
 *   },
 * });
 */
