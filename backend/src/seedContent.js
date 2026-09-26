// One-off, idempotent seed for the PageContent table (drives the admin
// "Site Content" CMS). Safe to re-run: uses findOrCreate per key, so it
// never overwrites content an admin has already edited — it only fills in
// keys that don't exist yet. Values below mirror the original static text
// from frontend/src/i18n/{en,mr}.js at the time this system was introduced.
import "dotenv/config";
import { sequelize } from "./config/database.js";
import { PageContent } from "./models/PageContent.js";

const CONTENT = {
  home: {
    en: {
      hero: [
        {
          image: "slider/annapoorna-yojana.jpg",
          title: "Annapoorna Bhagwan",
          text: "Age should not be a barrier to getting two square meals. Lokmangal Annapoorna Yojana is ready to provide them with two nutritious meal boxes.",
          link: "/lokmangal-annapurna-yojana",
        },
        {
          image: "slider/vidyadaan-yojana.jpg",
          title: "Education Will Transform Their World",
          text: "Education is the right of our children. Let them get the best education and shape their own future with their own hands.",
          link: "/vidyadaan-yojana",
        },
        {
          image: "slider/jalsandharan-project.jpg",
          title: "Today's Conservation, Tomorrow's Reserve",
          text: "Water is life. Conserving, storing and protecting water are our primary objectives.",
          link: "/jalsandharan-project",
        },
        {
          image: "slider/samudayik-vivah-sohala.jpg",
          title: "The Beginning of a New Life, a Shared Life",
          text: "When the worries related to marriage are resolved, planning everything else becomes easier.",
          link: "/samudayik-vivah-sohala",
        },
      ],
      welcomeTitle: "Welcome to Lokmangal Foundation",
      welcomeText:
        "We are committed to the holistic development of rural areas. Through our various initiatives, our main purpose is to enrich society.",
      pillars: [
        {
          icon: "connecting-hearts.png",
          image: "resource/connecting-hearts.jpg",
          title: "Connecting Hearts",
          subtitle: "Lessening Burdens",
          text: "Marriage has differentiating importance in everybody's life. It is burdensome for underprivileged families, sometimes leading to suicides. To help such families.",
        },
        {
          icon: "satisfying-souls.png",
          image: "resource/satisfying-souls.jpg",
          title: "Satisfying Souls",
          subtitle: "Nourishing Minds",
          text: "In old age, earning a living becomes difficult. We provide our respected elders with warm, nutritious tiffins daily.",
        },
        {
          icon: "save-water.png",
          image: "resource/saving-water.jpg",
          title: "Saving Water",
          subtitle: "Saving Future",
          text: "Water conservation is essential for drought-prone regions. Our community watershed model secures farming and future generations.",
        },
      ],
      projectsTitle: "Our Projects",
      allProjects: "All Projects",
      eventsTitle: "Our Events",
      viewAllEvents: "View All Events",
      aboutTitle: "About Lokmangal Foundation",
      whatWeDoTitle: "What We Do",
      whatWeDoText:
        "Lokmangal Foundation works for the betterment of rural society to elevate standard of living across healthcare, education, and farming.",
      pillarsTitle: "Pillars",
      pillarsList: [
        "Lokmangal Annapoorna Yojana",
        "Jalsandharan Project",
        "Vidyadaan Yojana",
        "Samudayik Vivah Sohala",
      ],
      objectivesTitle: "Our Objectives",
      objectivesIntro: "Through these initiatives, our dedicated commitment is:",
      objectives: [
        "To provide healthy and sufficient meals to the elders",
        "To eradicate water deficiency and bring agricultural security",
        "To educate every deserving student without financial barriers",
        "To lessen the burden of marriage expenses on rural families",
      ],
      visionTitle: "Vision and Mission",
      vision: [
        "To provide the rural society a better standard of living.",
        "To develop models which the whole country can follow.",
        "To stand united for the upliftment of rural India.",
      ],
      statsTitle: "Our Impact & Beneficiaries",
      statsSubtitle: "Transforming lives and bringing prosperity across rural Maharashtra",
      stats: [
        { icon: "satisfying-souls.png", tint: "orange", number: "550", label: "Annapoorna Beneficiaries" },
        { icon: "connecting-hearts.png", tint: "green", number: "225", label: "LOTUS Students Supported" },
        { icon: "connecting-hearts.png", tint: "orange", number: "3,221", label: "Couples Married (Vivah)" },
        { icon: "volunteers.png", tint: "green", number: "5,000+", label: "Active Volunteers" },
      ],
      awardsTitle: "Lokmangal Shikshak Ratna Awards",
      awardsSubtitle: "Honoring exceptional teachers and model schools across Maharashtra",
      awards: [
        { icon: "GraduationCap", title: "Primary Teacher", pdf: "pdf/प्राथमिक-विभाग.pdf" },
        { icon: "BookOpen", title: "Secondary Teacher", pdf: "pdf/माध्यमिक-शिक्षक.pdf" },
        { icon: "Landmark", title: "Junior College", pdf: "pdf/कनिष्ठ-महाविद्यालय.pdf" },
        { icon: "Building2", title: "Senior College", pdf: "pdf/वरिष्ठ-महाविद्यालय.pdf" },
        { icon: "Trophy", title: "Model School", pdf: "pdf/आदर्श-शाळा-पुरस्कार.pdf" },
      ],
      viewDetails: "View Details",
      volunteersTitle: "Volunteers Of The Month",
      volunteers: [
        { image: "team/rahul-kolhatkar.jpg", name: "Rahul Kolhatkar", place: "Solapur" },
        { image: "team/rajesh.jpg", name: "Rajesh", place: "Solapur" },
        { image: "team/kolikaka.jpg", name: "Kolikaka", place: "Solapur" },
        { image: "team/asif-shaikh.jpg", name: "Asif Shaikh", place: "Solapur" },
      ],
      galleryTitle: "Our Gallery",
      viewFullGallery: "View Full Gallery",
      testimonialsTitle: "Words From People",
      donateCtaTitle: "Support Our Mission",
      donateCtaText:
        "Your contribution helps us feed the elderly, conserve water, educate students, and support families in need. Every rupee brings us closer to a prosperous rural India.",
      donateCtaButton: "Donate Now",
      calloutTitle: "Join to be a pillar. Become a volunteer.",
      becomeVolunteer: "Become a Volunteer",
    },
    mr: {
      hero: [
        {
          image: "slider/annapoorna-yojana.jpg",
          title: "अन्न हे पूर्णब्रह्म",
          text: "दोन वेळची भाकरी मिळविण्यासाठी त्यांचे वय हा अडसर ठरू नये. लोकमंगल अन्नपूर्णा योजना सज्ज आहे त्यांना दोन वेळा पोषणयुक्त जेवणाचा डबा पुरविण्यासाठी.",
          link: "/mr/lokmangal-annapurna-yojana",
        },
        {
          image: "slider/vidyadaan-yojana.jpg",
          title: "शिक्षणाने बदलून जाईल त्यांचे विश्व",
          text: "शिक्षण हा आपल्या मुलांचा हक्क आहे. त्यांना उत्तम शिक्षण घेऊ द्या, स्वतःचे भविष्य स्वतःच्या हाताने घडवू द्या.",
          link: "/mr/vidyadaan-yojana",
        },
        {
          image: "slider/jalsandharan-project.jpg",
          title: "आजचे संधारण ही उद्यासाठी साठवण",
          text: "पाणी म्हणजे जीवन. पाणी वाचवणे, साठवणे आणि त्याची जपणूक करणे ही आमची प्राथमिक उद्दिष्टे आहेत.",
          link: "/mr/jalsandharan-project",
        },
        {
          image: "slider/samudayik-vivah-sohala.jpg",
          title: "शुभारंभ नवजीवनाचा, सहजीवनाचा",
          text: "जेव्हा आपल्या विवाहासंबंधी असणाऱ्या चिंता दूर होतात, तेव्हा इतर गोष्टींचे नियोजन सोपे होते.",
          link: "/mr/samudayik-vivah-sohala",
        },
      ],
      welcomeTitle: "लोकमंगल फाउंडेशनमध्ये आपले स्वागत",
      welcomeText:
        "ग्रामीण भागाच्या विकासासाठी आम्ही वचनबद्ध आहोत. आमच्या विविध उपक्रमांद्वारे समाज समृद्ध करणे हा आमचा मुख्य हेतू आहे.",
      pillars: [
        {
          icon: "connecting-hearts.png",
          image: "resource/connecting-hearts.jpg",
          title: "मने जोडणे",
          subtitle: "भार हलका करणे",
          text: "ज्यांची आर्थिक स्थिती बेताची असते त्यांच्यासाठी विवाह सोहळा मोठा खर्चिक ठरतो. अशा कुटुंबांना आधार देऊन विवाह संपन्न करणे.",
        },
        {
          icon: "satisfying-souls.png",
          image: "resource/satisfying-souls.jpg",
          title: "आत्मिक समाधान",
          subtitle: "मनःशांती आणि तृप्ती",
          text: "उतारवयात कष्ट करणे अशक्य होते. अशा निराधार ज्येष्ठ नागरिकांना सन्मानाने दोन वेळचे भरपेट आणि पौष्टिक भोजन उपलब्ध करून देणे.",
        },
        {
          icon: "save-water.png",
          image: "resource/saving-water.jpg",
          title: "जलसंधारण",
          subtitle: "सुरक्षित भविष्य",
          text: "पाणी हेच जीवन. दुष्काळग्रस्त भागातील गावांमध्ये जलसंधारणाची विविध कामे करून शेती व पाण्याचा प्रश्न कायमस्वरूपी सोडवणे.",
        },
      ],
      projectsTitle: "आमचे प्रकल्प",
      allProjects: "सर्व प्रकल्प",
      eventsTitle: "आमचे कार्यक्रम",
      viewAllEvents: "सर्व कार्यक्रम पहा",
      aboutTitle: "लोकमंगल फाऊंडेशनबद्दल",
      whatWeDoTitle: "आम्ही काय करतो",
      whatWeDoText:
        "लोकमंगल फाऊंडेशन ग्रामीण भागाच्या सर्वांगीण विकासासाठी कटिबद्ध आहे. त्यांच्या जीवनात सकारात्मक बदल घडवण्यासाठी आम्ही चार प्रमुख क्षेत्रांवर कार्यरत आहोत.",
      pillarsTitle: "चार मुख्य आधारस्तंभ",
      pillarsList: [
        "लोकमंगल अन्नपूर्णा योजना",
        "जलसंधारण प्रकल्प",
        "लोटस (विद्यादान योजना)",
        "सामुदायिक विवाह सोहळा",
      ],
      objectivesTitle: "उद्दिष्टे आणि संकल्प",
      objectivesIntro: "या प्रकल्पांच्या माध्यमातून आमचा निरंतर प्रयत्न आहे:",
      objectives: [
        "ज्येष्ठांना सकस व सन्मानपूर्वक दोन वेळचे भोजन देणे",
        "गावांतील पाणी टंचाई कायमस्वरूपी दूर करणे",
        "आर्थिक अडचणींमुळे कोणतीही हुशार मुले शिक्षणापासून वंचित राहू नयेत",
        "सामुदायिक विवाह सोहळ्यांद्वारे लग्नखर्च कमी करून शेतकरी आत्महत्या रोखणे",
      ],
      visionTitle: "दृष्टी आणि ध्येय",
      vision: [
        "ग्रामीण समाजाला समृद्ध आणि सन्माननीय जीवन जगण्याचे साधन देणे.",
        "संपूर्ण देशासाठी अनुकरणीय असे सामाजिक कार्य मॉडेल विकसित करणे.",
        "प्रत्येक गरजवंताच्या पाठीशी खंबीरपणे उभे राहणे.",
      ],
      statsTitle: "आमचा प्रभाव आणि कार्य",
      statsSubtitle: "ग्रामीण भागातील हजारो कुटुंबांच्या जीवनात सकारात्मक बदल",
      stats: [
        { icon: "satisfying-souls.png", tint: "orange", number: "५५०", label: "अन्नपूर्णा लाभार्थी" },
        { icon: "connecting-hearts.png", tint: "green", number: "२२५", label: "लोटस (विद्यादान) लाभार्थी" },
        { icon: "connecting-hearts.png", tint: "orange", number: "३,२२१", label: "विवाहित जोडपे" },
        { icon: "volunteers.png", tint: "green", number: "५०००+", label: "सक्रिय स्वयंसेवक" },
      ],
      awardsTitle: "लोकमंगल शिक्षकरत्न पुरस्कार",
      awardsSubtitle: "गुणवंत शिक्षकांचा व आदर्श शाळांचा यथोचित सन्मान व गौरव",
      awards: [
        { icon: "GraduationCap", title: "प्राथमिक शिक्षक", pdf: "pdf/प्राथमिक-विभाग.pdf" },
        { icon: "BookOpen", title: "माध्यमिक शिक्षक", pdf: "pdf/माध्यमिक-शिक्षक.pdf" },
        { icon: "Landmark", title: "कनिष्ठ महाविद्यालय", pdf: "pdf/कनिष्ठ-महाविद्यालय.pdf" },
        { icon: "Building2", title: "वरिष्ठ महाविद्यालय", pdf: "pdf/वरिष्ठ-महाविद्यालय.pdf" },
        { icon: "Trophy", title: "आदर्श शाळा", pdf: "pdf/आदर्श-शाळा-पुरस्कार.pdf" },
      ],
      viewDetails: "माहिती पहा",
      volunteersTitle: "महिन्याचे स्वयंसेवक",
      volunteers: [
        { image: "team/rahul-kolhatkar.jpg", name: "Rahul Kolhatkar", place: "Solapur" },
        { image: "team/rajesh.jpg", name: "Rajesh", place: "Solapur" },
        { image: "team/kolikaka.jpg", name: "Kolikaka", place: "Solapur" },
        { image: "team/asif-shaikh.jpg", name: "Asif Shaikh", place: "Solapur" },
      ],
      galleryTitle: "आमची छायाचित्रे",
      viewFullGallery: "सर्व छायाचित्रे पहा",
      testimonialsTitle: "लोकांचे अभिप्राय",
      donateCtaTitle: "आमच्या कार्यात सहभागी व्हा",
      donateCtaText:
        "तुमचे योगदान ज्येष्ठांना भोजन, जलसंधारण, विद्यार्थ्यांचे शिक्षण आणि गरजू कुटुंबांना मदत करण्यासाठी उपयोगी पडते. प्रत्येक रुपया समृद्ध ग्रामीण भारताच्या स्वप्नाच्या अधिक जवळ घेऊन जातो.",
      donateCtaButton: "देणगी द्या",
      calloutTitle: "सहभागी व्हा एका उदात्त कार्यात. स्वयंसेवक बना.",
      becomeVolunteer: "स्वयंसेवक बना",
    },
  },
  about: {
    en: {
      title: "About Lokmangal Foundation",
      introTitle: "Bringing Back the Glory of Rural India",
      introText:
        "Lokmangal Foundation is a Registered Charitable Trust, operating across a broad landscape of social causes. Rooted in Solapur, Maharashtra, we work to elevate the standard of living of rural communities through food security, water conservation, education, and community welfare.",
    },
    mr: {
      title: "लोकमंगल फाऊंडेशनबद्दल",
      introTitle: "ग्रामीण भारताचे गतवैभव परत आणताना",
      introText:
        "ग्रामीण भारताला त्याचे गतवैभव पुन्हा एकदा प्राप्त करून देण्यासाठी लोकमंगल फाऊंडेशन कार्यरत आहे. ग्रामीण समाजाच्या सर्व स्तरातील नागरिकांना त्यांचे जीवनमान उंचावण्यासाठी आम्ही अन्न सुरक्षा, जलसंधारण, शिक्षण आणि सामुदायिक कल्याण या माध्यमातून सर्वतोपरी साहाय्य करतो.",
    },
  },
  volunteer: {
    en: {
      title: "Become a Volunteer",
      introTitle: "Join Our Family of Volunteers",
      introText:
        "Lokmangal Foundation runs entirely on the goodwill and effort of volunteers who believe in our cause. Whichever way you can help — your time, your skills, or your voice — we would love to have you with us.",
    },
    mr: {
      title: "स्वयंसेवक व्हा",
      introTitle: "आमच्या स्वयंसेवक कुटुंबात सामील व्हा",
      introText:
        "लोकमंगल फाऊंडेशन पूर्णपणे आमच्या ध्येयावर विश्वास ठेवणाऱ्या स्वयंसेवकांच्या सदिच्छा आणि प्रयत्नांवर चालते. तुमचा वेळ, कौशल्य किंवा आवाज — ज्या मार्गाने तुम्ही मदत करू शकता, त्या मार्गाने आम्हाला तुमची साथ हवी आहे.",
    },
  },
  faq: {
    en: {
      title: "Frequently Asked Questions",
      items: [
        {
          q: "Whom does Lokmangal Foundation work for?",
          a: "Lokmangal Foundation works for rural people. We work for the betterment of rural societies.",
        },
        {
          q: "How can I help?",
          a: "All types of help are welcome. You can get involved with Lokmangal Foundation with volunteering your time, donating money or in kinds, sponsoring a student or fundraising in your community.",
        },
        { q: "Can I sponsor a child?", a: "Yes, you can sponsor students at Lokmangal Foundation." },
        {
          q: "Is my donation tax deductible?",
          a: "Yes, we are a Registered Charitable Trust. Your donations are deductible under Section 80G of the Income Tax Act, 1961.",
        },
        { q: "How can I contact you?", a: "Please see our Contact page for more details." },
        {
          q: "Are your projects applicable to the States other than Maharashtra?",
          a: "Yes, we would like to work for rural societies in other States too.",
        },
        {
          q: "Can foreign citizens donate online?",
          a: "Yes, please visit the Donate tab for more details.",
        },
        {
          q: "What will my donation be used for?",
          a: "Your donation will be used for one of our four projects where it will be needed at that time. If you want to donate for any particular project, you can tell us and we will use the donation for that project.",
        },
        {
          q: "Why should I support Lokmangal Foundation?",
          a: "Lokmangal Foundation works for the betterment of rural societies. We work to improve their standard of living by all means. If you want these people to advance with time, you can join us.",
        },
        {
          q: "Why does Lokmangal Foundation work only for rural societies?",
          a: "Rural communities are the ones who suffer from financial deficiencies and have less access to advanced facilities. With our projects, Lokmangal Foundation is trying to take off their burdens arising due to lack of finances and bring them into the development stream.",
        },
      ],
    },
    mr: {
      title: "सामान्य प्रश्न",
      items: [
        {
          q: "लोकमंगल फाऊंडेशन कोणासाठी काम करते?",
          a: "लोकमंगल फाउंडेशन ग्रामीण भागातील लोकांसाठी काम करते. आम्ही ग्रामीण समाजाच्या उन्नतीसाठी काम करतो.",
        },
        {
          q: "आम्ही कशाप्रकारे मदत करू शकतो?",
          a: "आपल्या सर्व प्रकारच्या मदतीचे येथे स्वागत आहे. आपण स्वयंसेवक म्हणून वेळ देऊ शकता, आर्थिक अथवा वस्तूंच्या स्वरुपात मदत देऊ शकता, एखाद्या विद्यार्थ्याची जबाबदारी घेऊ शकता अथवा आपल्या समाजामधून निधी उभारू शकता.",
        },
        {
          q: "मला एखाद्या मुलाची जबाबदारी घेता येऊ शकते का?",
          a: "होय, तुम्ही लोकमंगल फाऊंडेशनमध्ये विद्यार्थ्यांना प्रायोजित करू शकता.",
        },
        {
          q: "माझी देणगी कर सवलतीस पात्र आहे का?",
          a: "होय, आम्ही एक नोंदणीकृत चॅरिटेबल ट्रस्ट आहोत. आयकर अधिनियम, १९६१च्या कलम ८० जी अंतर्गत आपल्या देणग्या कर सवलतीस पूर्णपणे पात्र आहेत.",
        },
        { q: "मला आपल्याशी कशाप्रकारे संपर्क साधता येईल?", a: "या माहितीसाठी कृपया आमचे संपर्क पृष्ठ पहा." },
        {
          q: "तुमचे प्रकल्प महाराष्ट्राव्यतिरिक्त इतर राज्यांना लागू आहेत का?",
          a: "होय, आम्ही इतर राज्यांमधील ग्रामीण समाजांसाठी देखील काम करू इच्छितो.",
        },
        {
          q: "परदेशी नागरिकांना ऑनलाईन देणगी देता येईल का?",
          a: "होय, अधिक माहितीसाठी कृपया देणगी च्या पृष्ठाला भेट द्या.",
        },
        {
          q: "माझ्या देणगीचा वापर कोठे केला जाईल?",
          a: "आपल्या देणगीचा विनियोग आमच्या चार प्रकल्पांपैकी आवश्यकता असेल त्या प्रकल्पासाठी केला जाईल. आपण कोणत्याही विशिष्ट प्रकल्पासाठी देणगी देऊ इच्छित असल्यास, आम्हाला सूचित करू शकता.",
        },
        {
          q: "मी लोकमंगल फाऊंडेशनला मदत का करावी?",
          a: "लोकमंगल फाऊंडेशन ग्रामीण समाजाच्या उन्नतीसाठी काम करते. जर आपणास असे वाटत असेल की या समाजानेही काळासोबत पुढे जावे, तर आपणही आमच्याबरोबर सहभागी व्हा.",
        },
        {
          q: "लोकमंगल फाऊंडेशन फक्त ग्रामीण समाजासाठीच का काम करते?",
          a: "ग्रामीण भागातील जनतेला बहुतेक वेळा आर्थिक कमतरतेला तोंड द्यावे लागते तसेच आधुनिक सोयी सुविधांचाही अभाव असतो. त्यांच्यावर पडणारा भार हलका करण्याचा प्रयत्न लोकमंगल फाऊंडेशन आपल्या प्रकल्पांद्वारे करीत आहे.",
        },
      ],
    },
  },
  contact: {
    en: {
      title: "Contact",
      formTitle: "Send Your Message",
      quickContactTitle: "Quick Contact",
      quickContactText: "Let your passion for helping others reach to us.",
      nameLabel: "Your Name",
      emailLabel: "Your Email",
      phoneLabel: "Phone",
      subjectLabel: "Subject",
      messageLabel: "Your Message",
      send: "Send Message",
      sentTitle: "Thank you!",
      sentText: "Your message has been recorded. We will get back to you shortly.",
      required: "This field is required",
      invalidEmail: "Please enter a valid email",
    },
    mr: {
      title: "संपर्क",
      formTitle: "आपला संदेश पाठवा",
      quickContactTitle: "त्वरित संपर्क",
      quickContactText: "इतरांना मदत करण्याची तुमची आवड आमच्यापर्यंत पोहोचू द्या.",
      nameLabel: "तुमचे नाव",
      emailLabel: "तुमचा ई-मेल",
      phoneLabel: "फोन",
      subjectLabel: "विषय",
      messageLabel: "तुमचा संदेश",
      send: "संदेश पाठवा",
      sentTitle: "धन्यवाद!",
      sentText: "तुमचा संदेश नोंदवला गेला आहे. आम्ही लवकरच तुमच्याशी संपर्क साधू.",
      required: "ही माहिती भरणे आवश्यक आहे",
      invalidEmail: "कृपया योग्य ई-मेल टाका",
    },
  },
  contribute: {
    en: {
      title: "Contribute",
      introTitle: "Your Support Changes Lives",
      introText:
        "Every contribution, big or small, goes directly towards feeding the elderly, conserving water for farmers, educating underprivileged students, and helping economically weaker families hold dignified weddings.",
      donateCta: "Donate via Razorpay",
    },
    mr: {
      title: "योगदान द्या",
      introTitle: "तुमचे योगदान आयुष्य बदलते",
      introText:
        "तुमचे छोटे-मोठे योगदान थेट ज्येष्ठ नागरिकांना भोजन देण्यासाठी, शेतकऱ्यांसाठी जलसंधारणासाठी, गरजू विद्यार्थ्यांच्या शिक्षणासाठी आणि आर्थिकदृष्ट्या दुर्बल कुटुंबांना सन्मानाने विवाह करण्यासाठी उपयोगी पडते.",
      donateCta: "Razorpay द्वारे देणगी द्या",
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy",
      intro:
        "Lokmangal Foundation respects your privacy and therefore protects your personal and financial information. The information you provide us is highly confidential. To maintain privacy values, we have designed the following policies:",
      infoUse: [
        "We may request you to submit your personal information such as name, address, email ID, contact number for the purpose of verification.",
        "Your personal information is provided to make sure we have the correct record of all the donations we receive.",
        "We do not share your information with anyone without your consent.",
        "With the donor's consent, the information provided may be used for promotional and/or fundraising purposes.",
        "We may disclose information whenever required by law, when needed to protect our privacy, safety, rights, property, donors, or users, or when obligatory to enforce our terms of service.",
        "The information you share with us may be used for: communicating with donors, recordkeeping, processing payments, internal analysis, research, informing donors about upcoming events, reporting to applicable government agencies as required by law, surveys, other fundraising purposes, and analytical purposes.",
        "We do not share or sell the information we hold.",
      ],
      donationsTitle: "Donations",
      donations: [
        "We handle your donations with respect.",
        "The donor can donate in monetary or non-monetary forms.",
        "The donation(s) you have made are non-refundable.",
        "We offer donors the option to donate anonymously.",
      ],
      securityTitle: "Security Policies",
      security: [
        "We, Lokmangal Foundation, are committed to protecting the donor's personal information from alteration, unauthorised access, disclosure, and/or destruction.",
        "We undertake adequate security measures for secure web access for users.",
      ],
      updatesTitle: "Updating This Privacy Policy",
      updates: [
        "We may update the Privacy Policy from time to time.",
        "The updates will reflect on this page.",
        "All rights are reserved with Lokmangal Foundation regarding the addition, alteration, deletion or modification of any of the terms and conditions of this Privacy Policy.",
        "You are requested to check the page periodically for further updates.",
      ],
    },
    // The original site never translated the privacy policy's legal text
    // into Marathi (the /mr page showed the same English copy) — preserved
    // as-is here, only the title was translated.
    mr: {
      title: "गोपनीयता धोरण",
      intro:
        "Lokmangal Foundation respects your privacy and therefore protects your personal and financial information. The information you provide us is highly confidential. To maintain privacy values, we have designed the following policies:",
      infoUse: [
        "We may request you to submit your personal information such as name, address, email ID, contact number for the purpose of verification.",
        "Your personal information is provided to make sure we have the correct record of all the donations we receive.",
        "We do not share your information with anyone without your consent.",
        "With the donor's consent, the information provided may be used for promotional and/or fundraising purposes.",
        "We may disclose information whenever required by law, when needed to protect our privacy, safety, rights, property, donors, or users, or when obligatory to enforce our terms of service.",
        "The information you share with us may be used for: communicating with donors, recordkeeping, processing payments, internal analysis, research, informing donors about upcoming events, reporting to applicable government agencies as required by law, surveys, other fundraising purposes, and analytical purposes.",
        "We do not share or sell the information we hold.",
      ],
      donationsTitle: "Donations",
      donations: [
        "We handle your donations with respect.",
        "The donor can donate in monetary or non-monetary forms.",
        "The donation(s) you have made are non-refundable.",
        "We offer donors the option to donate anonymously.",
      ],
      securityTitle: "Security Policies",
      security: [
        "We, Lokmangal Foundation, are committed to protecting the donor's personal information from alteration, unauthorised access, disclosure, and/or destruction.",
        "We undertake adequate security measures for secure web access for users.",
      ],
      updatesTitle: "Updating This Privacy Policy",
      updates: [
        "We may update the Privacy Policy from time to time.",
        "The updates will reflect on this page.",
        "All rights are reserved with Lokmangal Foundation regarding the addition, alteration, deletion or modification of any of the terms and conditions of this Privacy Policy.",
        "You are requested to check the page periodically for further updates.",
      ],
    },
  },
  siteInfo: {
    en: {
      address: "Lokmangal Foundation, 13-A, Sahyadri Nagar, Near Old Hotagi Naka, Vikas Nagar, Solapur - 413003",
      phone: "+91 9923404583",
      phoneDisplay: "(0217) 23 22 480 / +91 9923404583",
      email: "lokmangalgroups@gmail.com",
      donateUrl: "https://pages.razorpay.com/lokmangalfoundation",
    },
    mr: {
      address: "लोकमंगल फाऊंडेशन, १३-ए, सह्याद्री नगर, जुना होटगी नाका, विकास नगर, सोलापूर - ४१३००३",
      phone: "+९१ ९९२३४०४५८३",
      phoneDisplay: "(०२१७) २३ २२ ४८० / +९१ ९९२३४०४५८३",
      email: "lokmangalgroups@gmail.com",
      donateUrl: "https://pages.razorpay.com/lokmangalfoundation",
    },
  },
  footer: {
    en: { copyright: "Copyright © 2026 Lokmangal Foundation. All Rights Reserved." },
    mr: { copyright: "कॉपीराइट © २०२६ लोकमंगल फाऊंडेशन. सर्व हक्क सुरक्षित." },
  },
  gallery: {
    en: { title: "Our Gallery", subtitle: "A glimpse into our work across Maharashtra", filterAll: "View All" },
    mr: { title: "आमची छायाचित्रे", subtitle: "महाराष्ट्रभर सुरू असलेल्या आमच्या कार्याची झलक", filterAll: "सर्व पहा" },
  },
  testimonials: {
    en: { title: "Words From People", subtitle: "What our supporters and partners say about us" },
    mr: { title: "लोकांचे अभिप्राय", subtitle: "आमच्या समर्थकांचे व सहकाऱ्यांचे आमच्याबद्दलचे मत" },
  },
  events: {
    en: { title: "Our Events", subtitle: "Celebrations, awards, and milestones from our journey" },
    mr: { title: "आमचे कार्यक्रम", subtitle: "आमच्या वाटचालीतील सोहळे, पुरस्कार आणि महत्त्वाचे टप्पे" },
  },
  projects: {
    en: { title: "Our Projects", subtitle: "The four pillars of Lokmangal Foundation's work" },
    mr: { title: "आमचे प्रकल्प", subtitle: "लोकमंगल फाऊंडेशनच्या कार्याचे चार आधारस्तंभ" },
  },
  blogs: {
    en: { title: "Our Blogs", subtitle: "Stories, updates, and news from Lokmangal Foundation" },
    mr: { title: "आमचे लेख", subtitle: "लोकमंगल फाऊंडेशनकडून कथा, अपडेट्स आणि बातम्या" },
  },
  team: {
    en: {
      title: "Our Team",
      subtitle: "The people who guide the work of Lokmangal Foundation",
      badge: "Leadership",
      intro: "Lokmangal Foundation's work in food security, water conservation, education and community welfare is guided by a dedicated team of office bearers and members.",
      officeBearersTitle: "Office Bearers",
      membersTitle: "Members",
      teaserTitle: "Meet the People Behind Lokmangal",
      teaserText: "Our office bearers and members guide every initiative of the foundation.",
      teaserButton: "Meet the Full Team",
      ctaTitle: "Join Hands With Our Team",
      ctaText: "Give your time and skills to the causes we work for.",
      ctaButton: "Become a Volunteer",
    },
    mr: {
      title: "आमची टीम",
      subtitle: "लोकमंगल फाऊंडेशनच्या कार्याला दिशा देणारे मार्गदर्शक",
      badge: "नेतृत्व",
      intro: "अन्नसुरक्षा, जलसंधारण, शिक्षण आणि सामुदायिक कल्याण या क्षेत्रांतील लोकमंगल फाऊंडेशनच्या कार्याला समर्पित पदाधिकारी व सदस्य दिशा देतात.",
      officeBearersTitle: "पदाधिकारी",
      membersTitle: "सदस्य",
      teaserTitle: "लोकमंगलच्या कार्यामागील चेहरे",
      teaserText: "फाऊंडेशनच्या प्रत्येक उपक्रमाला आमचे पदाधिकारी व सदस्य मार्गदर्शन करतात.",
      teaserButton: "संपूर्ण टीम पहा",
      ctaTitle: "आमच्या टीमसोबत कार्यात सहभागी व्हा",
      ctaText: "आम्ही ज्या कार्यासाठी झटतो, त्यासाठी आपला वेळ आणि कौशल्य द्या.",
      ctaButton: "स्वयंसेवक व्हा",
    },
  },
  saptahik: {
    en: {
      title: "Lokmangal Saptahik",
      badge: "Weekly Publication",
      intro: "The weekly publication of Lokmangal Foundation. Read every issue online, page by page, or download the PDF.",
      latestLabel: "Latest Issue",
      readLatest: "Read Latest Issue",
      statIssues: "Issues",
      statYears: "Years",
      archiveBadge: "Archive",
      archiveTitle: "Browse Past Issues",
      archiveSubtitle: "Every issue of Lokmangal Saptahik, organized by year.",
      emptyTitle: "The first issue is coming soon",
      emptyText: "A new issue will be published here every week.",
    },
    mr: {
      title: "लोकमंगल साप्ताहिक",
      badge: "साप्ताहिक प्रकाशन",
      intro: "लोकमंगल फाऊंडेशनचे साप्ताहिक प्रकाशन. प्रत्येक अंक येथे ऑनलाइन पान-दर-पान वाचा किंवा PDF डाउनलोड करा.",
      latestLabel: "नवीन अंक",
      readLatest: "नवीन अंक वाचा",
      statIssues: "अंक",
      statYears: "वर्षे",
      archiveBadge: "संग्रह",
      archiveTitle: "मागील अंक",
      archiveSubtitle: "लोकमंगल साप्ताहिकाचे सर्व अंक, वर्षानुसार.",
      emptyTitle: "पहिला अंक लवकरच येत आहे",
      emptyText: "दर आठवड्याचा नवीन अंक येथे प्रकाशित होईल.",
    },
  },
};

async function seedContent() {
  await sequelize.authenticate();
  await sequelize.sync();

  for (const [key, { en, mr }] of Object.entries(CONTENT)) {
    const [row, created] = await PageContent.findOrCreate({
      where: { key },
      defaults: { dataEn: en, dataMr: mr },
    });
    console.log(created ? `created: ${key}` : `already exists, left alone: ${key}`);
  }

  await sequelize.close();
  console.log("Done.");
}

seedContent().catch((err) => {
  console.error(err);
  process.exit(1);
});
