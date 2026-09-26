import "dotenv/config";
import bcrypt from "bcrypt";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sequelize } from "./config/database.js";
import { AdminUser } from "./models/AdminUser.js";
import { GalleryImage } from "./models/GalleryImage.js";
import { Testimonial } from "./models/Testimonial.js";
import { TeamMember } from "./models/TeamMember.js";
import { Project } from "./models/Project.js";
import { Event } from "./models/Event.js";
import { seedBlogs } from "./seedBlogs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
function toMarathiNumeral(n) {
  return String(n)
    .split("")
    .map((d) => DEVANAGARI_DIGITS[Number(d)] ?? d)
    .join("");
}
const uploadsDir = path.join(__dirname, "..", "uploads");
const frontendImagesDir = path.join(__dirname, "..", "..", "frontend", "src", "assets", "images");

// Seeding reuses the site's real existing images by copying them into
// backend/uploads/, exactly like a real admin upload would land there —
// so seeded records are served the same way as anything created later
// through the admin panel.
function copyIntoUploads(sourceRelativePath) {
  const source = path.join(frontendImagesDir, sourceRelativePath);
  const filename = `seed-${sourceRelativePath.replace(/[\\/]/g, "-")}`;
  const dest = path.join(uploadsDir, filename);
  fs.copyFileSync(source, dest);
  return `/uploads/${filename}`;
}

const GALLERY_CATEGORIES = [
  {
    key: "annapoorna",
    folder: "lokmangal-annapoorna-yojana",
    titleEn: "Lokmangal Annapoorna Yojana",
    titleMr: "लोकमंगल अन्नपूर्णा योजना",
  },
  {
    key: "jalsandharan",
    folder: "lokmangal-jalsandharan-project",
    titleEn: "Jalsandharan Project",
    titleMr: "जलसंधारण प्रकल्प",
  },
  {
    key: "vidyadaan",
    folder: "lokmangal-vidyadaan-yojana",
    titleEn: "LOTUS (Vidyadaan Yojana)",
    titleMr: "लोटस (विद्यादान योजना)",
  },
  {
    key: "vivah",
    folder: "lokmangal-samudayik-vivah",
    titleEn: "Samudayik Vivah Sohala",
    titleMr: "सामुदायिक विवाह सोहळा",
  },
];

const TEAM = [
  { name: "Rohan Deshmukh", nameMr: "रोहन देशमुख", roleEn: "Chairman", roleMr: "अध्यक्ष", category: "Office Bearer", photo: "board/rohan-deshmukh.jpg" },
  { name: "Manish Deshmukh", nameMr: "मनीष देशमुख", roleEn: "Vice Chairman", roleMr: "उपाध्यक्ष", category: "Office Bearer", photo: "board/manish-deshmukh.jpg" },
  { name: "Jaywant Thorat", nameMr: "जयवंत थोरात", roleEn: "Secretary", roleMr: "सचिव", category: "Office Bearer", photo: "board/jaywant-thorat.jpg" },
  { name: "Maruti Todkar", nameMr: "मारुती तोडकर", roleEn: "Joint Secretary", roleMr: "सहसचिव", category: "Office Bearer", photo: "board/maruti-todkar.jpg" },
  { name: "Prakash Mokashi", nameMr: "प्रकाश मोकाशी", roleEn: "Member", roleMr: "सदस्य", category: "Member", photo: "board/prakash-mokashi.jpg" },
  { name: "Amit Jain", nameMr: "अमित जैन", roleEn: "Member", roleMr: "सदस्य", category: "Member", photo: "board/amit-jain.jpg" },
  { name: "Uttam Shinde", nameMr: "उत्तम शिंदे", roleEn: "Member", roleMr: "सदस्य", category: "Member", photo: "board/uttam-shinde.jpg" },
  { name: "Balasaheb Ghodake", nameMr: "बाळासाहेब घोडके", roleEn: "Member", roleMr: "सदस्य", category: "Member", photo: "board/balasaheb-ghodake.jpg" },
  { name: "Sujata Sutar", nameMr: "सुजाता सुतार", roleEn: "Member", roleMr: "सदस्य", category: "Member", photo: "board/sujata-sutar.jpg" },
];

const PROJECTS = [
  {
    slug: "lokmangal-annapurna-yojana",
    titleEn: "Lokmangal Annapoorna Yojana",
    titleMr: "लोकमंगल अन्नपूर्णा योजना",
    summaryEn:
      "Senior citizens neglected by their families receive hot, nutritious tiffins daily at their doorstep.",
    summaryMr: "ज्येष्ठ नागरिकांना दोन वेळेचे सकस व पोषणयुक्त भोजन पुरवून त्यांच्या वृद्धापकाळात सन्मान देणे.",
    objectiveEn: "To ensure the needy do not have to undergo trouble to arrange food for himself.",
    objectiveMr: "स्वतःसाठी अन्नाची व्यवस्था करण्यासाठी असहाय्य ज्येष्ठ नागरिकांना हाल सोसावे लागू नयेत यासाठी.",
    descriptionEn: [
      "Food is the basic necessity of life. India's rich ancient culture takes a holistic approach to food which acknowledges the importance of food. Annadaan, or donating food, is considered to be a highly noble and sacred gesture. Because food not only satiates the hunger, it also nourishes the mind and soul.",
      "Even after six decades of Independence, it is a troubling fact that not all Indians can have two square meals a day. Financially weak or physically disabled senior citizens, who are neglected by their families or have no family and have to look after themselves in old age, are the most severely affected. They neither have the resources nor the energy to manage the food.",
      "Considering this situation, Lokmangal Foundation introduced the Lokmangal Annapoorna Yojana. Started on 8th March 2013, the Annapoorna Yojana aims to bring back the smile of happiness on the face of elderly people who are unfortunate enough to get a simple meal.",
      "Under this scheme, senior citizens (above 60), who are neglected by their families or don't have any family, are provided meals twice a day right at their doorstep. Through advertisements in newspapers, a database of genuinely needy senior citizens gets compiled. A huge yet hygienic catering facility is put up. A team of cooks and assistants works here with the dedication to prepare the food. Another team of equally committed volunteers takes up the tiffins to the homes of the needy, scattered in different areas of the city.",
      "Foundation aims to extend the scope of the scheme to include 1,500 senior citizens as beneficiaries. Through sunshine, rain and fog, activists involved in the Annapoorna Yojana work every single day of the year to provide food to the elderly people.",
      "Currently, this project serves for the senior citizens of Solapur. It is our sincere wish to get every needy senior citizen of India to have fulfilling meals every day.",
    ].join("\n\n"),
    descriptionMr: [
      "अन्न ही जीवनाची मूलभूत गरज आहे. भारताच्या प्राचीन व समृद्ध संस्कृतीमध्ये अन्नाचे महत्व सांगणारा समग्र दृष्टीकोन मांडण्यात आला आहे. आपल्या संस्कृतीमध्ये अन्नदान हे अतिशय महान आणि पवित्र कृत्य मानले जाते. अन्न केवळ भूक भागवत नाही तर ते मन व आत्माही तृप्त करते.",
      "स्वातंत्र्यप्राप्तीनंतर सहा दशके उलटूनही आजचे हे भीषण वास्तव आहे की भारतामधील सर्व नागरिकांना दोन वेळा चौरस आहार मिळत नाही. आर्थिकदृष्ट्या दुर्बल अथवा शारीरिकदृष्ट्या अपंग ज्येष्ठ नागरिक, ज्यांना त्यांच्या कुटुंबांद्वारे दुर्लक्षित केले गेले आहे अथवा त्यांचे कुटुंब नाही आणि वृद्धापकाळात सांभाळ करणारे कोणी नाही, प्रामुख्याने अशा ज्येष्ठांना या परिस्थितीस तोंड द्यावे लागते.",
      "या परिस्थितीचा विचार करून लोकमंगल फाऊंडेशनने ८ मार्च २०१३ पासून लोकमंगल अन्नपूर्णा योजना सुरू केली. आपले अन्न मिळवू न शकणार्‍या दुर्दैवी ज्येष्ठ नागरिकांच्या चेहेर्‍यावर हसू फुलविणे हे या योजनेचे लक्ष्य आहे.",
      "आपल्या कुटुंबियांकडून दुर्लक्षित अथवा ज्यांना कुटुंब नाही अशा ज्येष्ठ नागरिकांसाठी (६० वर्षांहून अधिक वयाचे) या योजनेअंतर्गत दिवसातून दोन वेळा घरपोच जेवण पुरविले जाते. वर्तमानपत्रांमध्ये जाहिरातींद्वारे गरजू ज्येष्ठ नागरिकांच्या डेटाबेसचे संकलन केले जाते. स्वयंपाकाची एक मोठी व स्वच्छ यंत्रणा या योजनेसाठी कार्यरत आहे.",
      "या कार्याचा विस्तार वाढवीत नेत १,५०० ज्येष्ठ नागरिकांना या योजनेचा लाभार्थी म्हणून समाविष्ट करून घेण्याचा फाउंडेशनचा उद्देश आहे. ऊन पावसाची पर्वा न करता, आमचे कार्यकर्ते वर्षभर दररोज अथक काम करत आहेत.",
      "हा प्रकल्प सध्या सोलापूरमधील ज्येष्ठ नागरिकांसाठी चालविला जात आहे. भारतातील प्रत्येक गरजू वरिष्ठ नागरिकांना दररोज पुरेसे भोजन पुरविता यावे ही आमची प्रामाणिक इच्छा आहे.",
    ].join("\n\n"),
    statEn: "Beneficiaries: 550",
    statMr: "लाभार्थी : ५५०",
    videoUrl: "https://www.youtube.com/embed/xqe6JKzo11I?rel=0",
    image: "slider/annapoorna-yojana.jpg",
  },
  {
    slug: "jalsandharan-project",
    titleEn: "Jalsandharan Project",
    titleMr: "जलसंधारण प्रकल्प",
    summaryEn:
      "Districts like Solapur face frequent drought. Lokmangal Jalsandharan Pattern brings water security to farming.",
    summaryMr: "दुष्काळग्रस्त सोलापूर व आसपासच्या भागांत बंधारे व जलसाठे निर्माण करून शेती समृद्ध करणे.",
    objectiveEn: [
      "To improve water availability through this project.",
      "To manage the available water resources.",
    ].join("\n"),
    objectiveMr: [
      "या प्रकल्पामार्फत पाण्याची उपलब्धता वाढविण्यासाठी.",
      "उपलब्ध जलस्रोतांचे व्यवस्थापन करण्यासाठी.",
    ].join("\n"),
    descriptionEn: [
      "Agriculture is the backbone of India's economy. As a nation, we ought to be proud of the farmers who sweat it out in the fields to produce the crops that make up our meals. Indeed, the Indian farmer has the capacity to feed the entire nation if properly trained and given equal prospects.",
      "However, in reality, it shows a very different, dismal picture. Natural calamities like drought and floods make the crops, and ultimately the farmers, suffer. The loss is unbearable as these calamities are occurring more often these days, especially for farmers from the low rainfall region.",
      "To fight against these conditions, Lokmangal Foundation has initiated Lokmangal Jalsandharan Pattern B.B. This pattern is the irrigation scheme mainly to improve water availability. After thorough research, we design the plans to manage the water resources in a particular area.",
      "This project has turned out to be a huge success wherever it has been implemented. Water availability for farming has improved, per ton yield has boosted up, the water table has enhanced and the farmers from respective regions are appreciating the prosperity.",
      "NEED OF THE HOUR – USE, CONSERVE & MANAGE WATER PROPERLY BECAUSE EACH & EVERY DROP COUNTS.",
    ].join("\n\n"),
    descriptionMr: [
      "शेती हा भारताच्या अर्थव्यवस्थेचा कणा आहे. आपणा सर्वांना या देशाचे नागरिक या नात्याने, शेतामध्ये घाम गाळून धान्य पिकविणार्‍या शेतकर्‍यांचा अभिमान वाटावयास हवा. योग्य प्रशिक्षण व समान संधी मिळाल्यास भारतातील शेतकर्‍यांमध्ये संपूर्ण देशाला पोसण्याची क्षमता नक्कीच आहे.",
      "प्रत्यक्षात मात्र जे चित्र आपल्याला दिसते ते भिन्न व निराशाजनक आहे. दुष्काळ आणि पूर यांसारख्या नैसर्गिक आपत्तींमुळे पिकांची व पर्यायाने शेतकर्‍यांची हानी होते. विशेषतः पर्जन्यमान कमी असणार्‍या प्रदेशातील शेतकर्‍यांना याचा सर्वाधिक फटका बसतो.",
      "या परिस्थितीच्या विरोधात लढण्यासाठी लोकमंगल फाऊंडेशनने लोकमंगल जलसंधारण पॅटर्न बी. बी. चा आरंभ केला आहे. हा पॅटर्न ही पाण्याची उपलब्धता वाढविण्यासाठी असणारी एक सिंचन योजना आहे.",
      "हा प्रकल्प जेथे जेथे अंमलात आला आहे तेथे तेथे तो प्रचंड यशस्वी झाला आहे. या प्रकल्पाद्वारे शेतीसाठी असणार्‍या पाण्याच्या उपलब्धतेमध्ये वाढ झाली आहे, पाण्याची पातळी वाढली आहे आणि संबंधित क्षेत्रातील शेतकरी या समृद्धीला दाद देत आहेत.",
      "गरज आहे ती योग्य पद्धतीने पाण्याचा वापर, संवर्धन आणि व्यवस्थापन करण्याची — कारण प्रत्येक थेंब मोलाचा आहे.",
    ].join("\n\n"),
    statEn: "Covered: 5000 Sq. km.",
    statMr: "व्याप्ती : ५००० चौ. किमी.",
    videoUrl: "https://www.youtube.com/embed/DyXdiolI1TI?rel=0",
    image: "slider/jalsandharan-project.jpg",
  },
  {
    slug: "vidyadaan-yojana",
    titleEn: "LOTUS (Lokmangal Org for Teaching Underprivileged Students)",
    titleMr: "लोटस (विद्यादान योजना)",
    summaryEn: "Adopting financially underprivileged students and supporting their dream of higher education.",
    summaryMr: "आर्थिक अडचणींमुळे शिक्षण सोडू लागलेल्या गरजू व हुशार विद्यार्थ्यांना दत्तक घेऊन त्यांचे शिक्षण पूर्ण करणे.",
    objectiveEn: "To provide educational facilities to the underprivileged and deserving students.",
    objectiveMr: "वंचित व गरजू विद्यार्थ्यांना शैक्षणिक सुविधा प्रदान करणे.",
    descriptionEn: [
      "Education is the right of every child. It has the power to transform one's life. Education is not a preparation for life, it is the life itself. However, not all kids who enrol at school get the chance to go for higher studies — mainly because of financial constraints, they are compelled to sacrifice their hunger for knowledge.",
      "Lokmangal Foundation has always sensed the need for higher education. Out of this inspiration, we have initiated the Vidyadaan Yojana, or as we call it LOTUS (Lokmangal Organization for Teaching Underprivileged Students), where deserving students are adopted and their educational expenses are met by the Foundation.",
      "Under this ambitious scheme, every year 200 HSC passed students are supported by Lokmangal Foundation. By shouldering their educational cost, we try to contribute to their future.",
      "You can adopt these children and share the responsibility. We act as a facilitator between donors and students by channelizing funds through a common platform. The donors receive the details of the students assisted with the help of their funds so they can keep in touch with them while tracking their progress. LOTUS lies on the foundations of trust, transparency and accountability.",
      '"Education breeds confidence and confidence breeds hope." We want to be that confidence in the hearts of students who hope for the best and have the spirit to achieve that.',
    ].join("\n\n"),
    descriptionMr: [
      "शिक्षण हा प्रत्येक मुलाचा हक्क आहे. जीवनामध्ये परिवर्तन घडवून आणण्याची शक्ती शिक्षणात आहे. शिक्षण ही जीवनाची तरतूद नव्हे तर शिक्षण हे जीवनच आहे. तथापि, बहुतांश वेळा आर्थिक अडचणींमुळे मुलांना आपली शिक्षणाची भूक मारणे भाग पडते.",
      "लोकमंगल फाऊंडेशनने उच्च शिक्षणाची गरज नेहेमीच ओळखली आहे. याच प्रेरणेतून आम्ही विद्यादान योजनेची सुरुवात केली आहे. या योजनेस LOTUS (लोकमंगल ऑर्गनायझेशन फॉर टिचिंग अंडरप्रिव्हिलेज्ड स्टुडंट्स) म्हणूनही ओळखले जाते.",
      "या महत्त्वाकांक्षी योजने अंतर्गत दरवर्षी एचएससी पास झालेल्या २०० विद्यार्थ्यांना लोकमंगल फाऊंडेशनकडून पाठबळ दिले जाते.",
      "देणगीदार आणि विद्यार्थी यांच्यामध्ये निधी हस्तांतरणासाठी एक सामाईक माध्यम म्हणून आम्ही काम करतो. विश्वास, पारदर्शकता आणि जबाबदारी यांच्या पायावर LOTUS उभी आहे.",
      "\"शिक्षणामुळे आत्मविश्वास आणि आत्मविश्वासामुळे उमेद जन्म घेते\" अशी एक सुंदर म्हण आहे. शिक्षणाची आस असणार्‍या विद्यार्थ्यांमध्ये आम्हाला आत्मविश्वास जागृत करावयाचा आहे.",
    ].join("\n\n"),
    statEn: "Helped: 225",
    statMr: "लाभार्थी : २२५",
    videoUrl: "https://www.youtube.com/embed/Mi-1-IPWPmk?rel=0",
    image: "slider/vidyadaan-yojana.jpg",
  },
  {
    slug: "samudayik-vivah-sohala",
    titleEn: "Samudayik Vivah Sohala",
    titleMr: "सामुदायिक विवाह सोहळा",
    summaryEn: "Reducing the burden of wedding expenses for economically weaker sections of society.",
    summaryMr: "गोरगरीब कुटुंबांवरील लग्नखर्चाचा ताण कमी करून सन्मानाने विवाह सोहळे संपन्न करणे.",
    objectiveEn: [
      "To help economically backward couples have a wedding ceremony",
      "To put an end to social evils like dowry",
      "To help families put their wedding budgets to a more productive use",
      "To help communities rise above caste and creed by participating collectively and enable social harmony",
    ].join("\n"),
    objectiveMr: [
      "आर्थिकदृष्ट्या मागासलेल्या जोडप्यांच्या विवाह सोहळ्यास मदत करण्यासाठी",
      "हुंड्यासारख्या वाईट सामाजिक प्रथांचा अंत करण्यासाठी",
      "कुटुंबाने विवाहासाठी केलेल्या आर्थिक तरतुदीचा अधिक सयुक्तिक कारणासाठी उपयोग करता यावा यासाठी",
      "संपूर्ण समाजाला जात, पंथ यांपलीकडे जाऊन एकत्र आणणे तसेच सामाजिक सलोखा प्रस्थापित करण्यासाठी",
    ].join("\n"),
    descriptionEn: [
      "If life is a journey, marriage is a major milestone in this journey. However, for people in the economically weaker sections of society, tying the knot is easier said than done. The prohibitive cost involved in staging a wedding simply puts the prospect of marriage out of their reach.",
      "Sensing this concern, Lokmangal Foundation has initiated the Samudayik Vivah Sohala (Community Wedding Event) where aspiring brides and bridegrooms are offered free facilities to get married.",
      "Samudayik Vivah Sohala is truly a mega annual event, where thousands of couples from various castes and communities gather to get married. The participating couples are offered wedding costumes, ornaments and household items, and a massive catering facility offers meals to a lakh guests in a single day.",
      "If the bride happens to be from the backward class, the Foundation also helps her to get the 'Kanyadaan Anudan' given by the Social Welfare Department. Equally important, Samudayik Vivah Sohala goes a long way in putting an end to the social evil of dowry.",
      "Since 2007, Lokmangal Foundation, through this initiative, has helped more than 3000 couples tie the knot. We will continue serving the poor through the plethora of initiatives we've undertaken.",
    ].join("\n\n"),
    descriptionMr: [
      "आयुष्याच्या प्रवासात विवाह हा एक प्रमुख व महत्वाचा टप्पा असतो. तथापि, समाजातील आर्थिकदृष्ट्या दुर्बल घटकांसाठी लग्नगाठ बांधणे हे वाटते तेवढे सोपे नसते. प्रतिष्ठा जपण्यासाठी होणारे खर्चही त्यांच्यासाठी आवाक्याबाहेरचे ठरतात.",
      "या परिस्थितीवर तोडगा काढण्यासाठी लोकमंगल फाऊंडेशनने सामुदायिक विवाह सोहळा सुरू केला आहे, ज्यामध्ये विवाहेच्छू वधू वरांना विवाहासाठी विविध सुविधा मोफत पुरविल्या जातात.",
      "सामुदायिक विवाह सोहळा हा खरोखर एक भव्य वार्षिक कार्यक्रम आहे, जेथे विविध जाती आणि समुदायातील हजारो जोडप्यांना विवाहाच्या निमित्ताने एकत्र आणले जाते. सहभागी जोडप्यांना विवाहाचा पोशाख, दागदागिने आणि गृहोपयोगी वस्तू दिल्या जातात.",
      "वधू मागासवर्गीय असल्यास फाऊंडेशन सामाजिक कल्याण विभागातर्फे त्यांना 'कन्यादान अनुदान' मिळवून देण्यास मदत करते. हुंड्यासारख्या दुष्प्रथांचा निःपात करण्याचाही हा एक मोठा मार्ग आहे.",
      "२००७ पासून लोकमंगल फाऊंडेशनने सुरू केलेल्या सामुदायिक विवाह सोहळ्याद्वारे ३००० पेक्षा अधिक जोडप्यांना लग्नगाठ बांधण्यास सहाय्य केले आहे.",
    ].join("\n\n"),
    statEn: "Married: 3221 Couples",
    statMr: "विवाहित जोडपे : ३२२१",
    videoUrl: "https://www.youtube.com/embed/pooqDuktVeM?rel=0",
    image: "slider/samudayik-vivah-sohala.jpg",
  },
];

const EVENTS = [
  {
    titleEn: "Shivputra Shambhu Raje Mahanatya",
    titleMr: "शिवपुत्र शंभूराजे महानाट्य",
    descriptionEn:
      "A historical drama featuring Dr. Amol Kolhe as Shambhu Raje and 250 actors arranged for all.",
    descriptionMr: "डॉ. अमोल कोल्हे यांच्या मुख्य भूमिकेतील आणि २५० कलाकारांच्या सहभागातील महानाट्याचे भव्य आयोजन.",
    eventDate: "26 to 31 January, 2018",
    image: "events/shivputra-shambhuraje.jpg",
  },
  {
    titleEn: "Samudayik Vivah Sohala",
    titleMr: "सामुदायिक विवाह सोहळा",
    descriptionEn:
      "As per every year, Community Wedding Event was held in Osmanabad where hundreds of couples got married.",
    descriptionMr: "दरवर्षीप्रमाणे उस्मानाबाद येथे सामुदायिक विवाह सोहळा पार पडला ज्यामध्ये शेकडो जोडप्यांचा विवाह झाला.",
    eventDate: "18 February, 2018",
    image: "events/vivah-sohala.jpg",
  },
  {
    titleEn: "Lokmangal Shikshak Ratna Puraskar",
    titleMr: "लोकमंगल शिक्षकरत्न पुरस्कार",
    descriptionEn: "Mrs. Lilatai Koti received Dr. Abdul Kalam Award. Eleven teachers and two schools received honors.",
    descriptionMr: "सौ. लीलाताई कोटी यांना डॉ. अब्दुल कलाम पुरस्कार आणि ११ शिक्षक व २ शाळांना विविध पुरस्कारांनी सन्मानित केले.",
    eventDate: "9 September, 2018",
    image: "events/shikshak-ratna-puraskar.jpg",
  },
];

const TESTIMONIALS = [
  {
    name: "Mahesh Dattatray Sathe",
    roleEn: "Lokmangal Milk Dairy",
    roleMr: "लोकमंगल दूध डेअरी",
    messageEn:
      "The very name Lokmangal reflects the welfare of ordinary people. Lokmangal is not a business group but a beautiful family system. Because of Lokmangal, 25,000 hands have found work today.",
    messageMr:
      "लोकमंगल या नावातच जनसामान्यांचे हित उमजते. लोकमंगल हा उद्योग समूह नसून एक सुंदरशी कुटुंब प्रणाली आहे. लोकमंगलमुळे आज २५ हजार हातांना काम मिळाले आहे.",
  },
  {
    name: "Vijaya Krishnat Sathe",
    roleEn: "Lokmangal Super Bazar",
    roleMr: "लोकमंगल सुपर बाजार",
    messageEn:
      "The small sapling of Lokmangal has transformed into a flourishing banyan tree. This is a movement that gives dignity and honor to the poor.",
    messageMr:
      "लोकमंगल या छोट्याशा रोपट्याचं रूपांतर फळा फुलांनी बहरलेल्या वटवृक्षात झाले आहे. गोर गरिबांना प्रतिष्ठा आणि सन्मान मिळवून देणारी ही चळवळ आहे.",
  },
];

async function seed() {
  await sequelize.sync({ force: true });

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await AdminUser.create({ email, passwordHash });
  console.log(`Admin user created: ${email}`);

  for (const cat of GALLERY_CATEGORIES) {
    for (let i = 1; i <= 12; i++) {
      const n = String(i).padStart(2, "0");
      const imageUrl = copyIntoUploads(`gallery/${cat.folder}/${cat.folder}-${n}.jpg`);
      await GalleryImage.create({
        category: cat.key,
        titleEn: `${cat.titleEn} — Photo ${i}`,
        titleMr: `${cat.titleMr} — छायाचित्र ${toMarathiNumeral(i)}`,
        imageUrl,
        sortOrder: i,
      });
    }
  }
  console.log("Gallery seeded (48 images)");

  for (const t of TEAM) {
    await TeamMember.create({
      name: t.name,
      nameMr: t.nameMr,
      roleEn: t.roleEn,
      roleMr: t.roleMr,
      category: t.category,
      photoUrl: copyIntoUploads(`team/${t.photo}`),
      sortOrder: TEAM.indexOf(t),
    });
  }
  console.log("Team seeded");

  for (const p of PROJECTS) {
    const { image, ...rest } = p;
    await Project.create({
      ...rest,
      coverImageUrl: copyIntoUploads(image),
      sortOrder: PROJECTS.indexOf(p),
    });
  }
  console.log("Projects seeded");

  for (const e of EVENTS) {
    await Event.create({
      titleEn: e.titleEn,
      titleMr: e.titleMr,
      descriptionEn: e.descriptionEn,
      descriptionMr: e.descriptionMr,
      eventDate: e.eventDate,
      imageUrl: copyIntoUploads(e.image),
    });
  }
  console.log("Events seeded");

  for (const t of TESTIMONIALS) {
    await Testimonial.create({ ...t, sortOrder: TESTIMONIALS.indexOf(t) });
  }
  console.log("Testimonials seeded");

  await seedBlogs();
  console.log("Blogs seeded");

  await sequelize.close();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
