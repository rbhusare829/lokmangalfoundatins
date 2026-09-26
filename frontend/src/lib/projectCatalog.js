// Project data shared by the Projects page and the Home page: the four
// flagship initiatives shown as large featured cards, and the category each
// initiative (by slug) belongs to for the filter pills and card labels.

// 4 Featured Impact Cards
export const FEATURED_CARDS = [
  {
    numeral: "(i)",
    slug: "samudayik-vivah-sohala",
    titleMr: "सामुदायिक विवाह सोहळा",
    titleEn: "Sukhbandhan | Community Marriage Ceremony",
    tagMr: "सामाजिक कल्याण",
    tagEn: "Social Welfare",
    textMr:
      "आर्थिक अडचणींमुळे विवाहाचे स्वप्न अपूर्ण राहू नये, या उद्देशाने लोकमंगल फाऊंडेशनतर्फे सामुदायिक विवाह सोहळा आयोजित केला जातो. गरजू कुटुंबांना आधार देत विवाहाचा खर्चाचा भार कमी करण्याचा हा एक प्रयत्न.",
    textEn:
      "The Sukhbandhan Community Marriage Ceremony is organised by Lokmangal Foundation with the aim of ensuring that financial difficulties do not prevent deserving couples from fulfilling their dream of marriage. The initiative provides support to needy families and helps reduce the financial burden associated with marriage.",
    image: "slider/samudayik-vivah-sohala.jpg",
    badgeMr: "३,२२१+ जोडपी विवाहबद्ध",
    badgeEn: "3,221+ Couples Married",
    accentColor: "from-rose-500/20 to-orange-500/10",
    badgeColor: "bg-rose-600 text-white"
  },
  {
    numeral: "(ii)",
    slug: "lokmangal-annapurna-yojana",
    titleMr: "अन्नपूर्णा योजना",
    titleEn: "A Meal for the Hungry | A Helping Hand of Humanity",
    tagMr: "अन्नसेवा",
    tagEn: "Food Care",
    textMr:
      "भूक ही प्रत्येकाची गरज आहे; पण प्रत्येकाला दोन वेळचे अन्न मिळतेच असे नाही. गरजू आणि निराधार व्यक्तींना सन्मानाने अन्न मिळावे, या भावनेतून लोकमंगल फाऊंडेशन अन्नसेवेचा उपक्रम राबवत आहे.",
    textEn:
      "Food is a basic necessity for every individual, yet not everyone has access to two nutritious meals a day. With the belief that every person deserves to receive food with dignity, Lokmangal Foundation undertakes food service initiatives for needy and vulnerable individuals.",
    image: "slider/annapoorna-yojana.jpg",
    badgeMr: "१७.३ लाख+ टिफिन वितरित",
    badgeEn: "17.3 Lakh+ Meals Served",
    accentColor: "from-amber-500/20 to-orange-500/10",
    badgeColor: "bg-brand-orange-accent text-white"
  },
  {
    numeral: "(iii)",
    slug: "jalsandharan-project",
    titleMr: "जलसंधारण | जल हेच जीवन",
    titleEn: "Water Conservation | Water is Life",
    tagMr: "जलसंधारण",
    tagEn: "Water Security",
    textMr:
      "पाणी हे शेतीचे आणि ग्रामीण जीवनाचे आधारस्तंभ आहे. पाण्याची उपलब्धता वाढवून शेतीला स्थैर्य मिळावे आणि ग्रामीण भागातील जीवनमान सुधारावे, या उद्देशाने लोकमंगल फाऊंडेशन जलसंधारणाच्या विविध उपक्रमांतून पाणी साठवण, संवर्धन आणि योग्य वापरासाठी कार्यरत आहे.",
    textEn:
      "Water is the foundation of agriculture and rural life. Lokmangal Foundation works through various water conservation initiatives to improve water availability, strengthen agriculture and enhance the quality of life in rural communities by promoting water storage, conservation and responsible use.",
    image: "slider/jalsandharan-project.jpg",
    badgeMr: "१०० कोटी लिटर साठा",
    badgeEn: "100 Cr Litres Capacity",
    accentColor: "from-teal-500/20 to-emerald-500/10",
    badgeColor: "bg-teal-700 text-white"
  },
  {
    numeral: "(iv)",
    slug: "vidyadaan-yojana",
    titleMr: "लोटस | उज्ज्वल भविष्याची पहिली पायरी",
    titleEn: "Education | The First Step Towards a Bright Future",
    tagMr: "शिक्षण व शिष्यवृत्ती",
    tagEn: "Education & LOTUS",
    textMr:
      "शिक्षणाची संधी ही प्रत्येक मुलाच्या उज्ज्वल भविष्यासाठी महत्त्वाची आहे. आर्थिक अडचणींमुळे कोणत्याही गुणवंत आणि गरजू विद्यार्थ्याचे शिक्षण थांबू नये, यासाठी लोकमंगल फाऊंडेशन शैक्षणिक मदतीच्या माध्यमातून विद्यार्थ्यांना पुढे जाण्यासाठी आधार देत आहे.",
    textEn:
      "Access to education is essential for every child's bright future. Lokmangal Foundation provides educational assistance to ensure that no deserving and meritorious student is forced to discontinue their education due to financial difficulties, enabling them to move forward and build a better future.",
    image: "slider/vidyadaan-yojana.jpg",
    badgeMr: "₹९० लाख+ मदत",
    badgeEn: "₹90 Lakh+ Scholarship Aid",
    accentColor: "from-emerald-500/20 to-cyan-500/10",
    badgeColor: "bg-brand-green-primary text-white"
  }
];

export const CATEGORY_MAP = {
  "lokmangal-annapurna-yojana": { mr: "अन्न व पोषण", en: "Food & Nutrition", key: "food" },
  "ek-muth-dhanya-yojana": { mr: "अन्न व पोषण", en: "Food & Nutrition", key: "food" },
  "jalsandharan-project": { mr: "जल व शेती", en: "Water & Agriculture", key: "water" },
  "vidyadaan-yojana": { mr: "शिक्षण", en: "Education", key: "education" },
  "lokmangal-shikshak-ratna-puraskar": { mr: "शिक्षण", en: "Education", key: "education" },
  "school-supplies-notebook-distribution": { mr: "शिक्षण", en: "Education", key: "education" },
  "lokmangal-sanjeevani-medical": { mr: "आरोग्य", en: "Healthcare", key: "health" },
  "mahaarogya-shibir": { mr: "आरोग्य", en: "Healthcare", key: "health" },
  "divyang-shibir": { mr: "आरोग्य", en: "Healthcare", key: "health" },
  "mofat-sarvarog-nidan-shibir": { mr: "आरोग्य", en: "Healthcare", key: "health" },
  "raktadan-shibir": { mr: "आरोग्य", en: "Healthcare", key: "health" },
  "yoga-din": { mr: "आरोग्य", en: "Healthcare", key: "health" },
  "samudayik-vivah-sohala": { mr: "सामाजिक कल्याण", en: "Social Welfare", key: "social" },
  "madhyamanchi-dakhal": { mr: "सामाजिक कल्याण", en: "Social Welfare", key: "social" },
  "rozgar-melava": { mr: "महिला व रोजगार", en: "Women & Employment", key: "women_jobs" },
  "mahila-din": { mr: "महिला व रोजगार", en: "Women & Employment", key: "women_jobs" },
  "ekal-mahila-upakram": { mr: "महिला व रोजगार", en: "Women & Employment", key: "women_jobs" },
  "lokmangal-sahitya-puraskar": { mr: "संस्कृती व पर्यावरण", en: "Culture & Environment", key: "culture" },
  "balsanskar-shibir": { mr: "संस्कृती व पर्यावरण", en: "Culture & Environment", key: "culture" },
  "killa-bandhani-spardha": { mr: "संस्कृती व पर्यावरण", en: "Culture & Environment", key: "culture" },
  "bhajan-bharud-spardha": { mr: "संस्कृती व पर्यावरण", en: "Culture & Environment", key: "culture" },
  "vruksharopan": { mr: "संस्कृती व पर्यावरण", en: "Culture & Environment", key: "culture" },
  "dandiya-utsav": { mr: "संस्कृती व पर्यावरण", en: "Culture & Environment", key: "culture" }
};

export const CATEGORIES = [
  { id: "all", mr: "सर्व उपक्रम", en: "All Projects" },
  { id: "food", mr: "अन्न व पोषण", en: "Food & Nutrition" },
  { id: "water", mr: "जल व शेती", en: "Water & Agriculture" },
  { id: "education", mr: "शिक्षण", en: "Education" },
  { id: "health", mr: "आरोग्य", en: "Healthcare" },
  { id: "social", mr: "सामाजिक कल्याण", en: "Social Welfare" },
  { id: "women_jobs", mr: "महिला व रोजगार", en: "Women & Jobs" },
  { id: "culture", mr: "संस्कृती व पर्यावरण", en: "Culture & Environment" }
];
