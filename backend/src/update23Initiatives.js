import "dotenv/config";
import { sequelize } from "./config/database.js";
import { Project } from "./models/Project.js";

const INITIATIVES_DATA = [
  {
    sortOrder: 1,
    slug: "lokmangal-annapurna-yojana",
    titleMr: "लोकमंगल अन्नपूर्णा योजना",
    titleEn: "Lokmangal Annapurna Yojana",
    summaryMr: "अन्न ही प्रत्येक व्यक्तीची गरज आहे. प्रत्येकाला दिवसातून पुरेसे जेवण मिळणे आवश्यक आहे. आपल्या देशात अन्नाला नेहमीच महत्त्व दिले गेले आहे. गरजू व्यक्तीला अन्न देणे हे चांगले काम मानले जाते. अन्नामुळे केवळ भूक भागत नाही, तर शरीराला आवश्यक ताकदही मिळते. आजही देशातील अनेक लोकांना दिवसातून दोन वेळचे जेवण मिळत नाही. याचा सर्वाधिक त्रास गरजू ज्येष्ठ नागरिकांना होतो...",
    summaryEn: "Food is a basic necessity for every individual. Everyone should have access to sufficient meals every day. Food has always held an important place in Indian society, and providing food to a person in need is considered a noble act. Food not only satisfies hunger but also provides the body with the strength and nutrition it needs. Even today, many people across the country do not have access to two meals a day.",
    objectiveMr: "६० वर्षांपेक्षा जास्त वयाच्या गरजू, निराधार ज्येष्ठ नागरिकांना रोजचे दोन वेळेचे जेवण घरपोच उपलब्ध करून देणे.",
    objectiveEn: "",
    descriptionMr: `अन्न ही प्रत्येक व्यक्तीची गरज आहे. प्रत्येकाला दिवसातून पुरेसे जेवण मिळणे आवश्यक आहे. आपल्या देशात अन्नाला नेहमीच महत्त्व दिले गेले आहे. गरजू व्यक्तीला अन्न देणे हे चांगले काम मानले जाते. अन्नामुळे केवळ भूक भागत नाही, तर शरीराला आवश्यक ताकदही मिळते. आजही देशातील अनेक लोकांना दिवसातून दोन वेळचे जेवण मिळत नाही. याचा सर्वाधिक त्रास गरजू ज्येष्ठ नागरिकांना होतो. काही ज्येष्ठ नागरिकांची आर्थिक परिस्थिती चांगली नसते. काहींना शारीरिक अडचणी असतात. काहींना कुटुंबाकडून मदत मिळत नाही, तर काही ज्येष्ठ नागरिकांचे कुटुंबच नसते. वृद्धापकाळात स्वतःसाठी जेवण बनवणे किंवा जेवणाची व्यवस्था करणे त्यांच्यासाठी कठीण होते.

या समस्येचा विचार करून लोकमंगल फाऊंडेशनने ८ मार्च २०१३ रोजी ‘लोकमंगल अन्नपूर्णा योजना’ सुरू केली. या योजनेचा उद्देश गरजू ज्येष्ठ नागरिकांना रोजचे जेवण उपलब्ध करून देणे हा आहे. या योजनेअंतर्गत ६० वर्षांपेक्षा जास्त वयाच्या गरजू ज्येष्ठ नागरिकांना दिवसातून दोन वेळा घरपोच जेवण दिले जाते. ज्या ज्येष्ठ नागरिकांना कुटुंबाकडून मदत मिळत नाही किंवा ज्यांचे कुटुंब नाही, अशा नागरिकांना या योजनेत मदत दिली जाते.

गरजू ज्येष्ठ नागरिकांची माहिती मिळवण्यासाठी वर्तमानपत्रांमध्ये जाहिराती दिल्या जातात. त्यातून गरजू नागरिकांची माहिती जमा केली जाते. त्यानंतर योग्य लाभार्थी निवडून त्यांना योजनेचा लाभ दिला जातो. योजनेसाठी मोठ्या आणि स्वच्छ स्वयंपाकघराची व्यवस्था करण्यात आली आहे. येथे आचारी आणि त्यांचे सहाय्यक ज्येष्ठ नागरिकांसाठी दररोज जेवण तयार करतात. तयार केलेले जेवण डब्यांमध्ये भरले जाते. त्यानंतर स्वयंसेवक हे जेवणाचे डबे शहरातील वेगवेगळ्या भागांत राहणाऱ्या गरजू ज्येष्ठ नागरिकांच्या घरी पोहोचवतात.

अन्नपूर्णा योजनेचे काम वर्षभर दररोज सुरू असते. ऊन असो, पाऊस असो किंवा धुके असो, या योजनेत काम करणारे कर्मचारी आणि स्वयंसेवक ज्येष्ठ नागरिकांपर्यंत जेवण पोहोचवण्याचे काम करतात. त्यामुळे लाभार्थी ज्येष्ठ नागरिकांना रोजच्या जेवणासाठी मदत मिळते. लोकमंगल फाऊंडेशनला या योजनेचा विस्तार करून १,५०० ज्येष्ठ नागरिकांना या योजनेचा लाभ देण्याचे उद्दिष्ट आहे. सध्या ही योजना सोलापूरमधील ज्येष्ठ नागरिकांसाठी सुरू आहे. भविष्यात भारतातील प्रत्येक गरजू ज्येष्ठ नागरिकाला दररोज पुरेसे जेवण मिळावे, अशी फाऊंडेशनची इच्छा आहे.

• एका टिफिनसाठी दरमहा खर्च — ₹१,५००
• ५५० लाभार्थी × ₹१,५०० = ₹८,२५,००० प्रति महिना
म्हणजे ५५० ज्येष्ठ नागरिकांना दरमहा जेवण देण्यासाठी एकूण ₹८,२५,००० खर्च येतो.

या योजनेमुळे गरजू ज्येष्ठ नागरिकांना रोजच्या जेवणासाठी मदत मिळते. समाजातील व्यक्ती आणि संस्थांनी आर्थिक मदत केल्यास हा उपक्रम आणखी गरजू ज्येष्ठ नागरिकांपर्यंत पोहोचवता येऊ शकतो.`,
    descriptionEn: `Food is a basic necessity for every individual. Everyone should have access to sufficient meals every day. Food has always held an important place in Indian society, and providing food to a person in need is considered a noble act. Food not only satisfies hunger but also provides the body with the strength and nutrition it needs. Even today, many people across the country do not have access to two meals a day.

Needy senior citizens are among those who face this difficulty the most. Some senior citizens do not have adequate financial resources, while others face physical challenges. Some do not receive support from their families, while others have no family at all. During old age, preparing meals or arranging food for themselves can become difficult.

Understanding this need, Lokmangal Foundation launched the Lokmangal Annapurna Yojana on 8 March 2013. The objective of the initiative is to provide daily meals to needy senior citizens.

Under this initiative, needy senior citizens above the age of 60 years are provided with two home-delivered meals every day. The initiative supports senior citizens who do not receive assistance from their families or who have no family support.

To identify senior citizens in need, advertisements are published in newspapers to collect information about potential beneficiaries. The information is then assessed, eligible beneficiaries are identified, and the selected individuals are provided with the benefits of the initiative.

A large and hygienic kitchen facility has been established for the initiative. Cooks and their assistants prepare meals every day for senior citizens. The prepared food is packed into tiffin boxes, which are then delivered by volunteers to the homes of needy senior citizens living in different parts of the city.

The Annapurna Yojana operates every day throughout the year. Whether it is summer, monsoon or winter, the employees and volunteers associated with the initiative continue their efforts to ensure that meals reach senior citizens. This provides beneficiaries with regular support for their daily food requirements.

Lokmangal Foundation aims to expand the initiative and provide its benefits to 1,500 senior citizens.

At present, the initiative is being implemented for senior citizens in Solapur. In the future, the Foundation hopes that every needy senior citizen across India will have access to sufficient meals every day.

Monthly cost of one tiffin — ₹1,500

550 beneficiaries × ₹1,500 = ₹825,000 per month

This means that providing meals to 550 senior citizens costs a total of ₹825000 per month.

The initiative provides needy senior citizens with regular support for their daily meals. With financial support from individuals and organisations, this initiative can be extended to reach many more senior citizens in need.`,
    statMr: "५५० लाभार्थी | ₹८,२५,००० प्रति महिना",
    statEn: "550 Beneficiaries | ₹8,25,000/mo",
    videoUrl: "https://www.youtube.com/embed/xqe6JKzo11I?rel=0",
  },
  {
    sortOrder: 2,
    slug: "jalsandharan-project",
    titleMr: "जलसंधारण",
    titleEn: "Water Conservation",
    summaryMr: "भारत हा एक कृषीप्रधान देश असून शेती आपल्या देशाच्या अर्थव्यवस्थेचा कणा आहे. शेतात अहोरात्र कष्ट करून आपलं पालनपोषण करणाऱ्या अन्नाची उत्पत्ति करणाऱ्या शेतकारीचा अभिमान बाळगणे हे प्रत्येक भारतीय नागरिकाचे कर्तव्य आहे. देशाच्या अर्थव्यवस्थेचा कणा असलेल्या शेतीचा जल म्हणजेच पाणी हा एक महत्त्वाचा स्त्रोत आहे. भारतातील अनेक शेतकऱ्यांना पाण्याशी संबंधित अनेक संकटांचा सामना करावा लागतो… अधिक वाचा",
    summaryEn: "India is an agrarian country, and agriculture is the backbone of its economy. Every Indian citizen should take pride in the farmers who work tirelessly in the fields to produce the food that sustains us. Water is one of the most important resources for agriculture, which forms the backbone of the country's economy.\n\nFarmers across India face several challenges related to water, including droughts, floods and unseasonal rainfall. The losses caused by such situations can be extremely severe, particularly as these events are occurring more frequently.",
    objectiveMr: "पाण्याची उपलब्धता सुधारणे, धरणांतील गाळ काढून साठवण क्षमता वाढवणे आणि शेतीसाठी मुबलक पाणी उपलब्ध करून देणे.",
    objectiveEn: "",
    descriptionMr: `भारत हा एक कृषीप्रधान देश असून शेती आपल्या देशाच्या अर्थव्यवस्थेचा कणा आहे. शेतात अहोरात्र कष्ट करून आपलं पालनपोषण करणाऱ्या अन्नाची उत्पत्ति करणाऱ्या शेतकारीचा अभिमान बाळगणे हे प्रत्येक भारतीय नागरिकाचे कर्तव्य आहे. देशाच्या अर्थव्यवस्थेचा कणा असलेल्या शेतीचा जल म्हणजेच पाणी हा एक महत्त्वाचा स्त्रोत आहे. भारतातील अनेक शेतकऱ्यांना पाण्याशी संबंधित अनेक संकटांचा सामना करावा लागतो. जसेकी दुष्काळ , पूर , अवेळी पाऊस इत्यादि. ह्या आपत्ततींमुळे होणारा नुकसान खरंच खूप असहनीय आहे कारण आजकाल अशा आपत्ती वारंवार घडत आहेत.

शेतकऱ्यांच्या भल्यासाठी अश्या आपत्तींवर मात करण्यासाठी लोकमंगल फाऊंडेशनने जलसंधारण योजना सुरू केली. सदर योजना ही खरं तर एक सिंचन योजना आहे ज्याचा मुख्य उद्देश पाण्याची उपलब्धता सुधारणे हा आहे.

या भारत देशात महाराष्ट्र राज्य हा सर्वाधिक जलसाठे व धरणं असलेला राज्य आहे. महाराष्ट्रातील धरणांमध्ये दरवर्षी साठत चाललेल्या गाळामुळे धरणांच्या साठवण क्षमतेत मोठ्या प्रमाणात घट होत. यावर मात करण्यासाठी जलसंधारण ह्या उपक्रमाअंतर्गत , “गाळमुक्त धरण गाळयुक्त शिवार” ही योजना सुरू केली आहे. सदर योजना शेतकऱ्यांसाठी वरदान ठरली असून पाण्याचा साठा असलेल्या अनेक तलावात मोठ्या प्रमाणात गाळ साठला आहे.

लोकमंगल फाऊंडेशनतर्फे तलावातील हा गाळ काढून शेतकऱ्यांना विनामूल्य भरून दिला जातो. आतापर्यंत सुमारे १०.०० लाख घनमीटर गाळ काढण्यात आला आहे. यामुळे १०० कोटी लीटर पाण्याची साठवण क्षमता वाढली असून पन्नास हजार लोकसंख्येला ३६५ दिवस पुरेल इतका पाणीसाठा वाढत आहे. यामुळे ८०० एकर क्षेत्रास वाढीव पाण्याचा लाभ होऊ शकतो. आजतागायत ६५० शेतकऱ्यांनी याचा लाभ घेतला आहे. एकरुख मध्यम प्रकल्प , लघुपाटबंधारे तलाव , सोरेगांव , बीबी दारफळ आणि हिप्परगा तलाव येथेही जलसंधारणाचे काम करून शेतकऱ्यांना गाळ वाटप करण्यात आले. या बरोबरच ग्रामीण भागात अनेक ठिकाणी ओढ्यांचे खोलीकरण व रुंदीकरण करण्यात आल्याने पाण्याचा स्त्रोत वाढण्यास मदत झाली आहे.

या प्रकल्पाला ज्या ज्या ठिकाणी राबवण्यात आले, त्या सर्व ठिकाणी त्याला चांगले यश मिळाले आहे. या प्रकल्पामुळे शेतीसाठी पाण्याची उपलब्धता वाढली आहे. तसेच एकरी उत्पादनातही वाढ झाली असून, जमिनीखालील पाण्याची पातळी सुधारली आहे. त्यामुळे या भागातील शेतकरीही समाधानी आहेत आणि त्यांच्या जीवनात चांगला बदल घडत आहे.

अन्न पिकवून आपल्या सर्वांचे पोट भरणाऱ्या शेतकऱ्यांच्या चेहऱ्यावर आपल्या छोट्याशा प्रयत्नातून आनंद पाहता येतो, याचा आम्हाला आनंद आहे. भविष्यात जास्तीत जास्त भागातील पाण्याची समस्या दूर व्हावी आणि शेतकऱ्यांना शेतीसाठी पुरेसे पाणी मिळावे, हे आमचे ध्येय आहे.`,
    descriptionEn: `India is an agrarian country, and agriculture is the backbone of its economy. Every Indian citizen should take pride in the farmers who work tirelessly in the fields to produce the food that sustains us. Water is one of the most important resources for agriculture, which forms the backbone of the country's economy.

Farmers across India face several challenges related to water, including droughts, floods and unseasonal rainfall. The losses caused by such situations can be extremely severe, particularly as such events are occurring more frequently.

To help farmers address these challenges, Lokmangal Foundation launched its Water Conservation Initiative. The initiative primarily focuses on improving irrigation and increasing the availability of water.

Maharashtra has a large number of dams and water storage structures. However, the accumulation of silt in these dams every year significantly reduces their storage capacity. To address this issue, the Foundation undertook the “Silt-Free Dams, Silt-Rich Farmlands” initiative under its water conservation programme.

The initiative has proved highly beneficial for farmers. Large quantities of silt have accumulated in several water bodies, and Lokmangal Foundation removes this silt and provides it to farmers free of cost for use on their agricultural land.

So far, approximately 10.00 lakh cubic metres of silt have been removed. This has increased water storage capacity by 100 crore litres, providing an additional water reserve sufficient to meet the requirements of a population of 50,000 people for 365 days. The increased availability of water can benefit approximately 800 acres of agricultural land. To date, 650 farmers have benefited from the initiative.

Water conservation work has also been undertaken at Ekrukh Medium Project, Minor Irrigation Tanks, Soregaon, Bibi Darphal and Hipparga Lake, where silt has been removed and distributed to farmers.

In addition, streams have been deepened and widened at several locations in rural areas, helping to increase water availability.

The initiative has achieved positive results wherever it has been implemented. It has improved the availability of water for agriculture, increased per-acre agricultural productivity and helped improve groundwater levels. Farmers in these areas have also experienced positive changes in their lives.

Seeing the happiness on the faces of farmers who feed our society through their hard work is a source of satisfaction for us. Our goal is to address water-related challenges across as many areas as possible and ensure that farmers have adequate water available for agriculture.`,
    statMr: "१० लाख घनमीटर गाळ | १०० कोटी लिटर साठा",
    statEn: "10 Lakh cu.m Desilted | 100 Cr Litres Capacity",
    videoUrl: "https://www.youtube.com/embed/DyXdiolI1TI?rel=0",
  },
  {
    sortOrder: 3,
    slug: "vidyadaan-yojana",
    titleMr: "LOTUS (विद्यादान योजना)",
    titleEn: "LOTUS (Lokmangal Organization for Teaching Underprivileged Students)",
    summaryMr: "शिक्षण हे प्रत्येक मुलाचे अधिकार आहे. कारण त्यात एखाद्याचे जीवन बदलण्याची क्षमता आहे. नेल्सन मंडेला ह्यांच्या शब्दात सांगायला गेलं तर , “शिक्षण हे सर्वात शक्तिशाली शस्त्र आहे जे आपण जग बदलण्यासाठी वापरू शकतो.” या देशात अनेक होतकरू व मेहनती विद्यार्थी/मुलं आहेत जे शिक्षण ह्या विशेष अधिकारापासून वंचित आहेत… अधिक वाचा",
    summaryEn: "Education is every child's right because it has the power to transform lives. As Nelson Mandela said, “Education is the most powerful weapon which you can use to change the world.” There are many hardworking and deserving students in our country who are deprived of this important right because of their difficult financial circumstances.",
    objectiveMr: "आर्थिक अडचणींमुळे शिक्षण थांबलेल्या होतकरू विद्यार्थ्यांना दत्तक घेऊन त्यांच्या उच्च शिक्षणाचा खर्च उचलणे.",
    objectiveEn: "",
    descriptionMr: `शिक्षण हे प्रत्येक मुलाचे अधिकार आहे. कारण त्यात एखाद्याचे जीवन बदलण्याची क्षमता आहे. नेल्सन मंडेला ह्यांच्या शब्दात सांगायला गेलं तर , “शिक्षण हे सर्वात शक्तिशाली शस्त्र आहे जे आपण जग बदलण्यासाठी वापरू शकतो.” या देशात अनेक होतकरू व मेहनती विद्यार्थी/मुलं आहेत जे शिक्षण ह्या विशेष अधिकारापासून वंचित आहेत. कारण , त्यांची कमकुवत आर्थिक पार्श्वभूमी व परिस्थिति. अश्या विद्यार्थ्यांसाठी लोकमंगल फाऊंडेशन घेऊन आले आहे LOTUS (Lokmangal Organization for Teaching Underprivileged Students).

या उपक्रमा अंतर्गत गरीब परंतु होतकरू विद्यार्थ्यांना संस्था दत्तक घेते व त्यांच्या पुढील शिक्षणाचा खर्च उचलते. लोकमंगल फाऊंडेशनच्या माध्यमातून दरवर्षी बारावी उत्तीर्ण झालेल्या २०० विद्यार्थ्यांना शिक्षणासाठी मदत केली जाते. त्यांच्या शिक्षणाचा खर्च उचलून त्यांना पुढे शिकता यावे आणि आपले भविष्य घडवता यावे, यासाठी आम्ही प्रयत्न करतो.

आपल्या आयुष्यात मोठी स्वप्ने पाहण्याचा आणि ती पूर्ण करण्याचा हक्क प्रत्येकाला आहे. हीच स्वप्ने पूर्ण करण्यासाठी या विद्यार्थ्यांना मदत करणे, हा आमच्या छोट्याशा प्रयत्नांचा एक भाग आहे. या उपक्रमा अंतर्गत आत्तापर्यन्त एकूण २२५ विद्यार्थ्यांना दत्तक घेतले असून अखेर एकूण ९०,९९,२२६ रुपये आर्थिक सहकार्य/शिष्यवृत्तीची रक्कम जमा करण्यात आली आहे.

आपणही या विद्यार्थ्यांची जबाबदारी घेऊन त्यांच्या शिक्षणाला मदत करू शकता. पुढच्या पिढीचे भविष्य चांगले घडावे, अशी इच्छा असलेल्या लोकांना आम्ही मदत करतो. शिकण्याची खूप इच्छा असूनही पैशांच्या अडचणीमुळे शिक्षण घेता न येणाऱ्या विद्यार्थ्यांना आणि त्यांना मदत करू इच्छिणाऱ्या दानशूर व्यक्तींना आम्ही एकत्र आणण्याचे काम करतो.

देणगीदार आणि विद्यार्थ्यांना जोडण्याचे काम आम्ही करतो. देणगीदारांकडून मिळणारी मदत योग्य विद्यार्थ्यांपर्यंत पोहोचवली जाते. ज्या विद्यार्थ्याला आपल्या मदतीतून शिक्षणासाठी आधार मिळाला आहे, त्याची माहिती देणगीदारांना दिली जाते. त्यामुळे ते त्या विद्यार्थ्याच्या संपर्कात राहू शकतात आणि त्याच्या शिक्षणातील प्रगतीची माहिती घेऊ शकतात.

LOTUSचा पाया विश्वास, पारदर्शकता आणि जबाबदारी या तीन गोष्टींवर आहे.
एक सुंदर विचार आहे — “शिक्षणामुळे आत्मविश्वास वाढतो आणि आत्मविश्वासामुळे आशा निर्माण होते.”
ज्यांना आयुष्यात काहीतरी चांगले करण्याची इच्छा आहे आणि आपली स्वप्ने पूर्ण करण्याची जिद्द आहे, अशा विद्यार्थ्यांच्या मनात हा आत्मविश्वास निर्माण करण्याचे काम आम्हाला करायचे आहे. त्यांच्या उज्ज्वल भविष्यासाठी त्यांना योग्य वेळी आधार देणे, हेच आमचे ध्येय आहे.`,
    descriptionEn: `Education is every child's right because it has the power to transform lives. As Nelson Mandela said, “Education is the most powerful weapon which you can use to change the world.”

There are many hardworking and deserving students in our country who are deprived of access to education because of their difficult financial circumstances. For such students, Lokmangal Foundation has introduced LOTUS (Lokmangal Organization for Teaching Underprivileged Students).

Under this initiative, the Foundation adopts financially disadvantaged but deserving students and supports the cost of their further education.

Through Lokmangal Foundation, 200 students who complete Class XII are provided educational assistance every year. We support their educational expenses so that they can continue their studies and build a better future for themselves.

Every individual has the right to dream big and work towards fulfilling those dreams. Helping these students turn their aspirations into reality is one of the ways in which we contribute to their future.

Under this initiative, a total of 225 students have been adopted so far, and financial assistance/scholarships amounting to ₹90,99,226 have been provided.

You too can take responsibility for supporting these students and contribute towards their education.

We work to connect people who wish to contribute to a better future for the next generation with students who have a strong desire to learn but are unable to continue their education because of financial difficulties. We bring together students in need of support and generous individuals willing to help them.

We connect donors with students and ensure that the assistance received from donors reaches the appropriate beneficiaries. Donors are provided with information about the student whose education they are supporting. This enables them to remain connected with the student and follow their educational progress.

LOTUS is built on three core principles — trust, transparency and responsibility.

There is a beautiful thought — “Education builds confidence, and confidence creates hope.”

Our aim is to nurture this confidence in students who have the determination to achieve something meaningful in life and fulfil their dreams. Providing them with the right support at the right time for a brighter future is our commitment.`,
    statMr: "२२५ विद्यार्थी दत्तक | ₹९०,९९,२२६ निधी",
    statEn: "225 Students Adopted | ₹90,99,226 Scholarship",
    videoUrl: "https://www.youtube.com/embed/Mi-1-IPWPmk?rel=0",
  },
  {
    sortOrder: 4,
    slug: "samudayik-vivah-sohala",
    titleMr: "सामुदायिक विवाह सोहळा",
    titleEn: "Community Marriage Ceremony",
    summaryMr: "विवाह हा केवळ एक सोहळा नाही, तर दोन मनांना, दोन कुटुंबांना आणि दोन आयुष्यांना जोडणारा संस्कार आहे. विवाहामुळे आपल्याला आयुष्यभराची साथ मिळते. आपल्या सुखात आनंद मानणारी आणि दुःखाच्या वेळी आपल्या सोबत उभी राहणारी व्यक्ती आपल्याला मिळते. मात्र, आर्थिक अडचणी असलेल्या कुटुंबांसाठी लग्न करणे सोपे नसते… अधिक वाचा",
    summaryEn: "Marriage is not merely a ceremony; it is a sacred bond that brings together two individuals, two families and two lives. Marriage provides companionship for a lifetime — someone who shares in our happiness and stands beside us during difficult times. However, for families facing financial difficulties, arranging a marriage can be challenging.",
    objectiveMr: "हुंडा प्रथा निर्मूलन, सर्वधर्मीय सामाजिक सलोखा आणि आर्थिकदृष्ट्या दुर्बल कुटुंबांना विवाहाचा संपूर्ण खर्च मोफत उपलब्ध करून देणे.",
    objectiveEn: "",
    descriptionMr: `विवाह हा केवळ एक सोहळा नाही, तर दोन मनांना, दोन कुटुंबांना आणि दोन आयुष्यांना जोडणारा संस्कार आहे. विवाहामुळे आपल्याला आयुष्यभराची साथ मिळते. आपल्या सुखात आनंद मानणारी आणि दुःखाच्या वेळी आपल्या सोबत उभी राहणारी व्यक्ती आपल्याला मिळते. मात्र, आर्थिक अडचणी असलेल्या कुटुंबांसाठी लग्न करणे सोपे नसते. लग्नाचा मोठा खर्च परवडत नसल्यामुळे अनेक मुला-मुलींच्या लग्नात अडचणी येतात.

ही अडचण लक्षात घेऊन लोकमंगल फाऊंडेशनने ‘सामुदायिक विवाह सोहळा’ हा उपक्रम सुरू केला आहे. या उपक्रमातून लग्न करू इच्छिणाऱ्या मुला-मुलींना लग्नासाठी आवश्यक सुविधा मोफत दिल्या जातात. त्यामुळे आर्थिक अडचणी असलेल्या कुटुंबांना लग्नाचा मोठा खर्च करण्याची गरज पडत नाही आणि मुला-मुलींना नव्या आयुष्याची सुरुवात करता येते.

सामुदायिक विवाह सोहळा हा एक भव्य वार्षिक सोहळा आहे ज्यात विविध जाती , धर्म व पंथातील जोडपे विवाहित होण्यासाठी एकत्र येतात. हा कार्यक्रम योग्य पद्धतीने आणि मोठ्या प्रमाणावर आयोजित केला जातो. यासाठी मोठा मंडप उभारला जातो, स्टेज तयार केले जाते. तसेच लाईट, माईक, साऊंड सिस्टिम, संगीत आणि इतर आवश्यक सोयींची व्यवस्था केली जाते.

या सामुदायिक विवाह सोहळ्यात सहभागी होणाऱ्या जोडप्यांना लग्नासाठी लागणारे कपडे, दागिने आणि संसारासाठी आवश्यक वस्तू दिल्या जातात. त्यामुळे नव्या संसाराची सुरुवात करताना त्यांना मदत होते. तसेच एका दिवसात तब्बल एक लाख पाहुण्यांसाठी जेवणाची व्यवस्था केली जाते.

प्रत्येक समाजाच्या परंपरेनुसार लग्नाचे विधी केले जातात. त्यासाठी वेगवेगळ्या समाजातील पुजारी आणि धर्मगुरूंना बोलावले जाते. वधू मागासवर्गीय समाजातील असल्यास, तिला समाज कल्याण विभागाकडून मिळणारे ‘कन्यादान अनुदान’ मिळवून देण्यासाठीही फाऊंडेशन मदत करते. समाजात सांप्रदायिक सलोखा वाढावा व हुंडा प्रथेला आळा घालणे हे या उपक्रमाचे मुख्य उद्देश आहेत.

सदर उपक्रमा अंतर्गत आतापर्यन्त ४८ विवाह सोहळे संपन्न झाले असून एकूण ३२२१ जोडपे या उपक्रमा अंतर्गत विवाहबद्ध झाले आहेत ज्यात २५०८ हिंदू , ६८१ बौद्ध , २१ मुस्लिम , ७ जैन व ४ ख्रिस्ती जोडप्यांचा समावेश आहे.`,
    descriptionEn: `Marriage is not merely a ceremony; it is a sacred bond that brings together two individuals, two families and two lives. Marriage provides companionship for a lifetime — someone who shares in our happiness and stands beside us during difficult times. However, for families facing financial difficulties, arranging a marriage can be challenging.

The high cost of marriage can create difficulties for many families and may become an obstacle for couples wishing to begin their married life. Understanding this challenge, Lokmangal Foundation launched the Community Marriage Ceremony initiative.

Through this initiative, couples who wish to get married are provided with the necessary facilities for their wedding free of cost. This helps families facing financial difficulties avoid the burden of significant wedding expenses and enables couples to begin their new lives with dignity.

The Community Marriage Ceremony is a grand annual event in which couples from different castes, religions and communities come together to get married.

The programme is organised on a large scale with a spacious wedding venue, stage, lighting, microphones, sound systems, music and other necessary facilities.

Couples participating in the Community Marriage Ceremony are provided with wedding clothes, jewellery and essential household items required to begin their married life. This provides them with support as they start their new household.

Food arrangements are also made for as many as one lakh guests in a single day. Marriage rituals are conducted according to the traditions of each participating community. Priests and religious leaders from different communities are invited to conduct the respective ceremonies.

If the bride belongs to a Scheduled Caste or another eligible category, the Foundation also assists her in accessing the ‘Kanyadan Grant’ provided by the Social Welfare Department.

Promoting communal harmony and helping to curb the practice of dowry are among the key objectives of this initiative.

Under this initiative, 48 Community Marriage Ceremonies have been conducted so far, with a total of 3,221 couples getting married. This includes 2,508 Hindu, 681 Buddhist, 21 Muslim, 7 Jain and 4 Christian couples.`,
    statMr: "४८ सोहळे | ३,२२१ जोडपे विवाहबद्ध",
    statEn: "48 Ceremonies | 3,221 Couples Married",
    videoUrl: "https://www.youtube.com/embed/pooqDuktVeM?rel=0",
  },
  {
    sortOrder: 5,
    slug: "ek-muth-dhanya-yojana",
    titleMr: "एक मूठ धान्य योजना",
    titleEn: "One Fistful of Grain Initiative",
    summaryMr: "लहान वयातच मुलांमध्ये गरजू व्यक्तींना मदत करण्याची आणि दान करण्याची सवय निर्माण व्हावी, हा या उपक्रमामागील मुख्य उद्देश आहे. शाळेतील विद्यार्थी धान्य जमा करून ते अन्नपूर्णा योजनेसाठी देतात. यासोबतच, आई-वडील आणि आजी-आजोबांना निराधार होऊ न देण्याची शपथही विद्यार्थ्यांना दिली जाते...",
    summaryEn: "The primary objective of this initiative is to develop the habit of helping those in need and giving back to society among children from an early age.",
    objectiveMr: "विद्यार्थ्यांमध्ये संस्कार, सहकार्य आणि अन्नदानाच्या माध्यमातून गरजू ज्येष्ठांना आधार देण्याची भावना निर्माण करणे.",
    objectiveEn: "",
    descriptionMr: `लहान वयातच मुलांमध्ये गरजू व्यक्तींना मदत करण्याची आणि दान करण्याची सवय निर्माण व्हावी, हा या उपक्रमामागील मुख्य उद्देश आहे. शाळेतील विद्यार्थी धान्य जमा करून ते अन्नपूर्णा योजनेसाठी देतात. यासोबतच, आई-वडील आणि आजी-आजोबांना निराधार होऊ न देण्याची शपथही विद्यार्थ्यांना दिली जाते.

अहवालानुसार, ७० हून अधिक शाळांमधील सुमारे २५,००० विद्यार्थ्यांपर्यंत हा सामाजिक संस्कार पोहोचवण्यात आला आहे. मुलांनी दिलेली प्रत्येक मूठ धान्य भुकेल्या वृद्धांच्या चेहऱ्यावर हसू फुलवण्यासाठी उपयोगात आणली जाते.`,
    descriptionEn: `The primary objective of this initiative is to develop the habit of helping those in need and giving back to society among children from an early age.

Students collect grains at their schools and donate them to the Annapurna Yojana. Along with this, students are also encouraged to take a pledge not to let their parents and grandparents become unsupported or neglected.

According to the available report, this social message has reached approximately 25,000 students across more than 70 schools.`,
    statMr: "७०+ शाळा | २५,०००+ विद्यार्थी",
    statEn: "70+ Schools | 25,000+ Students",
  },
  {
    sortOrder: 6,
    slug: "lokmangal-sahitya-puraskar",
    titleMr: "लोकमंगल साहित्य पुरस्कार",
    titleEn: "Lokmangal Literature Award",
    summaryMr: "गुणवंत आणि दर्जेदार साहित्यनिर्मिती करणाऱ्या साहित्यिकांचा सन्मान करून त्यांच्या साहित्यिक कार्याला प्रोत्साहन देण्यासाठी २०१५ पासून लोकमंगल साहित्य पुरस्कार सुरू करण्यात आला. आतापर्यंत ११ पुरस्कार सोहळे आयोजित करण्यात आले असून, ५० साहित्यिकांचा सन्मान करण्यात आला आहे.",
    summaryEn: "The Lokmangal Literature Award was instituted to honour literary personalities who create high-quality and distinguished literary works and to encourage their continued contribution to the field of literature.",
    objectiveMr: "दर्जेदार साहित्यनिर्मितीला चालना देणे आणि मराठी भाषा व साहित्यिकांचा यथोचित गौरव करणे.",
    objectiveEn: "",
    descriptionMr: `गुणवंत आणि दर्जेदार साहित्यनिर्मिती करणाऱ्या साहित्यिकांचा सन्मान करून त्यांच्या साहित्यिक कार्याला प्रोत्साहन देण्यासाठी लोकमंगल साहित्य पुरस्कार सुरू करण्यात आला. २०१५ पासून या पुरस्काराचे आयोजन केले जात आहे.

अहवालानुसार, आतापर्यंत ११ पुरस्कार सोहळे आयोजित करण्यात आले असून, ५० साहित्यिकांचा सन्मान करण्यात आला आहे. साहित्य क्षेत्रातील योगदानाची दखल घेऊन साहित्यिकांचा गौरव करणे हा या उपक्रमाचा मुख्य हेतू आहे.`,
    descriptionEn: `The Lokmangal Literature Award was instituted to honour literary personalities who create high-quality and distinguished literary works and to encourage their continued contribution to the field of literature.

The award has been organised since 2015.

According to the available report, 11 award ceremonies have been organised so far, honouring 50 literary personalities.

The primary objective of this initiative is to recognise and honour the contributions of writers and literary personalities to the field of literature.`,
    statMr: "११ सोहळे | ५० साहित्यिक सन्मानित",
    statEn: "11 Ceremonies | 50 Writers Honored",
  },
  {
    sortOrder: 7,
    slug: "lokmangal-shikshak-ratna-puraskar",
    titleMr: "लोकमंगल शिक्षक रत्न पुरस्कार",
    titleEn: "Lokmangal Teacher Ratna Award",
    summaryMr: "गुणवंत, कर्तबगार शिक्षक तसेच शैक्षणिक क्षेत्रात उल्लेखनीय कामगिरी करणाऱ्या आदर्श शाळांचा सन्मान करण्यासाठी २००७ पासून सातत्याने लोकमंगल शिक्षक रत्न पुरस्कार दिला जातो. प्राथमिक, माध्यमिक, कनिष्ठ व वरिष्ठ शिक्षक आणि शाळांचा गौरव केला जातो.",
    summaryEn: "The Lokmangal Teacher Ratna Award was instituted to honour meritorious and dedicated teachers, as well as exemplary schools that have made significant contributions to the field of education.",
    objectiveMr: "शिक्षण क्षेत्रातील उत्कृष्ट शिक्षकांचे कार्य गौरवणे आणि आदर्श शाळांना प्रोत्साहन देणे.",
    objectiveEn: "",
    descriptionMr: `गुणवंत, कर्तबगार शिक्षक तसेच शैक्षणिक क्षेत्रात उल्लेखनीय कामगिरी करणाऱ्या आदर्श शाळांचा सन्मान करण्यासाठी लोकमंगल शिक्षक रत्न पुरस्कार सुरू करण्यात आला. २००७ पासून या उपक्रमाचे सातत्याने आयोजन केले जात आहे.

१२ वर्षांपेक्षा अधिक सेवा केलेल्या गुणवंत शिक्षकांचा तसेच शैक्षणिक क्षेत्रात उल्लेखनीय कार्य करणाऱ्या शाळांचा गौरव केला जातो. प्राथमिक, माध्यमिक, कनिष्ठ आणि वरिष्ठ शिक्षक, आदर्श शाळा तसेच ए.पी.जे. अब्दुल कलाम पुरस्कार या माध्यमातून सन्मानित केले जातात.`,
    descriptionEn: `The Lokmangal Teacher Ratna Award was instituted to honour meritorious and dedicated teachers, as well as exemplary schools that have made significant contributions to the field of education.

The initiative has been organised continuously since 2007.

Meritorious teachers with more than 12 years of service, as well as schools that have made notable contributions to education, are recognised through this initiative.

The awards recognise primary, secondary, junior college and senior teachers, exemplary schools, as well as recipients under the A.P.J. Abdul Kalam Award category.`,
    statMr: "२००७ पासून सातत्य | १२+ वर्षे सेवा",
    statEn: "Active Since 2007 | 12+ Yrs Service",
  },
  {
    sortOrder: 8,
    slug: "lokmangal-sanjeevani-medical",
    titleMr: "लोकमंगल संजीवनी मेडिकल",
    titleEn: "Lokmangal Sanjeevani Medical",
    summaryMr: "लोकमंगल संजीवनी मेडिकलची सुरुवात १२ डिसेंबर २०२५ रोजी करण्यात आली. गरीब, गरजू आणि वंचित घटकांना आवश्यक औषधे मोफत उपलब्ध करून देणे हा या उपक्रमाचा मुख्य उद्देश आहे. विशेषतः रक्तदाब, मधुमेह यांसारख्या आजारांसाठी औषधे पुरवली जातात.",
    summaryEn: "Lokmangal Sanjeevani Medical was launched on 12 December 2025.",
    objectiveMr: "दीर्घकालीन आजारांनी ग्रस्त गरजू रुग्णांना नियमित मोफत औषधपुरवठा सुनिश्चित करणे.",
    objectiveEn: "",
    descriptionMr: `लोकमंगल संजीवनी मेडिकलची सुरुवात १२ डिसेंबर २०२५ रोजी करण्यात आली. गरीब, गरजू आणि वंचित घटकांना आवश्यक औषधे मोफत उपलब्ध करून देणे हा या उपक्रमाचा मुख्य उद्देश आहे.

विशेषतः रक्तदाब, मधुमेह यांसारख्या आजारांसाठी नियमितपणे घ्यावी लागणारी औषधे उपलब्ध करून दिली जातात. अशा औषधांचा दर महिन्याला पुरवठा करून गरजू रुग्णांना त्यांचे उपचार सातत्याने सुरू ठेवण्यास मदत केली जाते.`,
    descriptionEn: `Lokmangal Sanjeevani Medical was launched on 12 December 2025.

The primary objective of this initiative is to provide essential medicines free of cost to poor, needy and underserved sections of society.

The initiative particularly provides medicines that are required regularly for conditions such as high blood pressure and diabetes.

By providing a monthly supply of such medicines, the initiative helps needy patients continue their treatment without interruption.`,
    statMr: "रक्तदाब व मधुमेह मोफत औषधोपचार",
    statEn: "Free Chronic & BP/Diabetes Medicines",
  },
  {
    sortOrder: 9,
    slug: "mahaarogya-shibir",
    titleMr: "महाआरोग्य शिबीर",
    titleEn: "Maha Arogya Health Camp",
    summaryMr: "सोलापूर आणि आसपासच्या नागरिकांना मोफत तपासणी, औषधोपचार आणि शस्त्रक्रियेची सुविधा उपलब्ध करून देण्यासाठी महाआरोग्य शिबिराचे आयोजन करण्यात आले. ३१ मे २०१६ रोजी आयोजित या शिबिराचा सुमारे ३५,००० रुग्णांनी लाभ घेतला.",
    summaryEn: "The Maha Arogya Health Camp was organised to provide free medical check-ups, treatment and surgical facilities to citizens from Solapur and surrounding areas. The camp, held on 31 May 2016, benefited approximately 35,000 patients. Of these, around 3,600 patients underwent free surgeries, while 250 patients underwent cataract surgeries. Arrangements were also made for ambulances and buses to facilitate patient transportation, along with the services of specialist doctors, nurses, pharmacists and other healthcare professionals.",
    objectiveMr: "ग्रामीण भागातील गोरगरिबांना तज्ज्ञ डॉक्टरांकडून मोफत तपासणी, मोफत औषधे व जटिल शस्त्रक्रिया उपलब्ध करणे.",
    objectiveEn: "",
    descriptionMr: `सोलापूर आणि आसपासच्या नागरिकांना मोफत तपासणी, औषधोपचार आणि शस्त्रक्रियेची सुविधा उपलब्ध करून देण्यासाठी महाआरोग्य शिबिराचे आयोजन करण्यात आले. ३१ मे २०१६ रोजी आयोजित करण्यात आलेल्या या शिबिराचा सुमारे ३५,००० रुग्णांनी लाभ घेतला.

यापैकी सुमारे ३,६०० रुग्णांवर मोफत शस्त्रक्रिया करण्यात आल्या, तर २५० जणांवर मोतीबिंदूच्या शस्त्रक्रिया करण्यात आल्या. तज्ज्ञ डॉक्टर, परिचारिका, औषधतज्ज्ञ आणि इतर आरोग्य कर्मचाऱ्यांसह रुग्णांच्या ने-आणीसाठी रुग्णवाहिका आणि बसचीही व्यवस्था करण्यात आली होती.`,
    descriptionEn: `The Maha Arogya Health Camp was organised to provide free medical check-ups, treatment and surgical facilities to citizens from Solapur and surrounding areas. The camp, held on 31 May 2016, benefited approximately 35,000 patients. Of these, around 3,600 patients underwent free surgeries, while 250 patients underwent cataract surgeries. Arrangements were also made for ambulances and buses to facilitate patient transportation, along with the services of specialist doctors, nurses, pharmacists and other healthcare professionals.`,
    statMr: "३५,००० रुग्ण | ३,६०० शस्त्रक्रिया",
    statEn: "35,000 Patients | 3,600 Surgeries",
  },
  {
    sortOrder: 10,
    slug: "divyang-shibir",
    titleMr: "दिव्यांग शिबीर",
    titleEn: "Disability Support Camp",
    summaryMr: "दिव्यांग बांधवांच्या दैनंदिन जीवनात उपयोगी पडणारे साहित्य त्यांना मोफत उपलब्ध करून देण्यासाठी शिबिराचे आयोजन. जयपूर फूट, कॅलिपर्स, कुबड्या, तीनचाकी सायकल, व्हीलचेअर, श्रवणयंत्र आणि ऑर्थो शूज यांसारख्या साहित्याचे वाटप करण्यात आले.",
    summaryEn: "This camp was organised to provide free assistive equipment and essential materials that can support persons with disabilities in their daily lives. Various items, including Jaipur Foot prostheses, calipers, crutches, tricycles, wheelchairs, hearing aids and orthopaedic shoes, were distributed.",
    objectiveMr: "दिव्यांग बांधवांना आत्मनिर्भर जीवन जगण्यासाठी आवश्यक ती सर्व आधुनिक उपकरणे विनामूल्य प्रदान करणे.",
    objectiveEn: "",
    descriptionMr: `दिव्यांग बांधवांच्या दैनंदिन जीवनात उपयोगी पडणारे साहित्य त्यांना मोफत उपलब्ध करून देण्यासाठी या शिबिराचे आयोजन करण्यात आले. जयपूर फूट, कॅलिपर्स, कुबड्या, तीनचाकी सायकल, व्हीलचेअर, श्रवणयंत्र आणि ऑर्थो शूज यांसारख्या विविध साहित्याचे वाटप करण्यात आले.

सोलापूरसह धाराशिव, लातूर, विजयपूर आणि सांगली येथील लाभार्थी या शिबिरात सहभागी झाले. अहवालानुसार, एकूण ३,२४४ लाभार्थ्यांना विविध प्रकारचे साहित्य देण्यात आले.`,
    descriptionEn: `This camp was organised to provide free assistive equipment and essential materials that can support persons with disabilities in their daily lives. Various items, including Jaipur Foot prostheses, calipers, crutches, tricycles, wheelchairs, hearing aids and orthopaedic shoes, were distributed.

Beneficiaries from Solapur, Dharashiv, Latur, Vijayapura and Sangli participated in the camp. According to the report, a total of 3,244 beneficiaries received different types of assistive equipment.`,
    statMr: "३,२४४ लाभार्थी | ५ जिल्हे",
    statEn: "3,244 Beneficiaries | 5 Districts",
  },
  {
    sortOrder: 11,
    slug: "mofat-sarvarog-nidan-shibir",
    titleMr: "मोफत सर्वरोग निदान शिबीर",
    titleEn: "Free Multi-Disease Diagnostic Camp",
    summaryMr: "झोपडपट्टी, कामगार व गरजू भागातील नागरिकांची विविध आजारांसाठी मोफत तपासणी करून त्यांना वेळेवर उपचार उपलब्ध करून दिले जातात. मोतीबिंदू, महिलांची रक्त तपासणी, कर्करोग, दंतविकार व हृदयविकाराची तपासणी केली जाते.",
    summaryEn: "The objective of this initiative is to provide free medical check-ups to residents of slum areas, labour settlements and other underserved communities and ensure that they receive timely treatment.",
    objectiveMr: "वंचित वसाहतींमधील नागरिकांपर्यंत प्राथमिक व प्रगत आरोग्य तपासणी व उपचार पोहोचवणे.",
    objectiveEn: "",
    descriptionMr: `झोपडपट्टी, कामगार व गरजू भागातील नागरिकांची विविध आजारांसाठी मोफत तपासणी करून त्यांना वेळेवर उपचार उपलब्ध करून देणे हा या उपक्रमाचा उद्देश आहे.

शिबिरामध्ये सर्वसाधारण आरोग्य तपासणीसोबत मोतीबिंदूची तपासणी केली जाते आणि आवश्यक असल्यास मोफत शस्त्रक्रियाही करण्यात येते. महिला व किशोरवयीन मुलींची रक्त तपासणी करून रक्ताची कमतरता आढळल्यास आवश्यक औषधे दिली जातात. कर्करोग, दंतविकार, हृदयविकार तसेच इतर आजारांची तपासणीही या शिबिरांमध्ये केली जाते.`,
    descriptionEn: `The objective of this initiative is to provide free medical check-ups to residents of slum areas, labour settlements and other underserved communities and ensure that they receive timely treatment.

The camps provide general health check-ups along with cataract screening, and free surgeries are also conducted wherever required. Blood tests are conducted for women and adolescent girls, and necessary medicines are provided in cases where anaemia or other deficiencies are detected.

Screening for cancer, dental conditions, heart diseases and other illnesses is also conducted as part of these camps.`,
    statMr: "मोफत तपासणी व मोतीबिंदू शस्त्रक्रिया",
    statEn: "Free Diagnosis & Cataract Surgery",
  },
  {
    sortOrder: 12,
    slug: "raktadan-shibir",
    titleMr: "रक्तदान शिबीर",
    titleEn: "Blood Donation Camp",
    summaryMr: "रक्ताची निर्मिती कृत्रिम पद्धतीने करता येत नसल्यामुळे गरजू रुग्णांसाठी रक्तदान अत्यंत महत्त्वाचे आहे. विविध दिवसांचे औचित्य साधून रक्तदान शिबिरांचे आयोजन केले जाते व रक्तदानाबाबत जनजागृती केली जाते.",
    summaryEn: "Since blood cannot be artificially manufactured, blood donation plays a vital role in supporting patients in need. Donating blood to someone in need is a direct way of extending support during their treatment.",
    objectiveMr: "आपत्कालीन वेळी रक्ताचा तुटवडा भासू नये म्हणून नियमित रक्तदान शिबिरे आयोजित करून जनजागृती घडवणे.",
    objectiveEn: "",
    descriptionMr: `रक्ताची निर्मिती कृत्रिम पद्धतीने करता येत नसल्यामुळे गरजू रुग्णांसाठी रक्तदान अत्यंत महत्त्वाचे आहे. गरजू व्यक्तीस रक्तदान करणे म्हणजे त्याच्या उपचारासाठी थेट मदतीचा हात पुढे करणे होय.

याच सामाजिक जाणिवेतून विविध दिवसांचे औचित्य साधून रक्तदान शिबिरांचे आयोजन केले जाते. या उपक्रमाच्या माध्यमातून नागरिकांमध्ये रक्तदानाबाबत जागरूकता निर्माण करून गरजेच्या वेळी रक्त उपलब्ध होण्यास मदत केली जाते.`,
    descriptionEn: `Since blood cannot be artificially manufactured, blood donation plays a vital role in supporting patients in need. Donating blood to someone in need is a direct way of extending support during their treatment.

With this sense of social responsibility, blood donation camps are organised on various occasions throughout the year. Through this initiative, awareness about blood donation is created among citizens, helping ensure the availability of blood when it is needed.`,
    statMr: "सामाजिक जनजागृती व जीवनदान",
    statEn: "Voluntary Donation & Life Saving",
  },
  {
    sortOrder: 13,
    slug: "school-supplies-notebook-distribution",
    titleMr: "विद्यार्थ्यांना शालेय साहित्य व वही वाटप",
    titleEn: "Distribution of School Supplies and Notebooks to Students",
    summaryMr: "जिल्हा परिषद शाळांमध्ये शिक्षण घेणाऱ्या गरीब, गरजू आणि एकल पालकांच्या मुलांना शिक्षणासाठी आवश्यक साहित्य उपलब्ध करून दिले जाते. वह्या तसेच इतर शालेय साहित्य मोफत पुरवले जाते.",
    summaryEn: "This initiative is undertaken to provide educational materials to children from poor and needy families, as well as children of single parents studying in Zilla Parishad schools.",
    objectiveMr: "आर्थिक अडचणींमुळे गरजू मुलांचे शिक्षण थांबू नये म्हणून शैक्षणिक साहित्याची मदत करणे.",
    objectiveEn: "",
    descriptionMr: `जिल्हा परिषद शाळांमध्ये शिक्षण घेणाऱ्या गरीब, गरजू आणि एकल पालकांच्या मुलांना शिक्षणासाठी आवश्यक साहित्य उपलब्ध करून देण्यासाठी हा उपक्रम राबवला जातो. विद्यार्थ्यांना वह्या तसेच इतर शालेय साहित्य मोफत दिले जाते.

आर्थिक अडचणींमुळे मुलांच्या शिक्षणात अडथळा निर्माण होऊ नये, यासाठी ही मदत केली जाते. त्यांच्या शैक्षणिक प्रवासात छोटा का होईना, पण उपयोगी हातभार लावणे हा या उपक्रमाचा मुख्य उद्देश आहे.`,
    descriptionEn: `This initiative is undertaken to provide educational materials to children from poor and needy families, as well as children of single parents studying in Zilla Parishad schools.

Students are provided with notebooks and other essential school supplies free of cost. This assistance is intended to ensure that financial difficulties do not become an obstacle to their education.

The primary objective of this initiative is to make a meaningful contribution, however small, to the educational journey of these students and support them in continuing their education.`,
    statMr: "जिल्हा परिषद शाळा व एकल पालक मुले",
    statEn: "ZP Schools & Single Parent Kids",
  },
  {
    sortOrder: 14,
    slug: "balsanskar-shibir",
    titleMr: "बालसंस्कार शिबीर",
    titleEn: "Child Values and Development Camp",
    summaryMr: "नवीन पिढीमध्ये चांगले संस्कार, शिस्त आणि सकारात्मक मूल्ये रुजवण्यासाठी निवासी बालसंस्कार शिबिरांचे आयोजन केले जाते. भजन, कीर्तन, लेझीम, भगवद्गीता, योग, प्राणायाम आणि ध्यान यांत मुलांना सहभागी केले जाते.",
    summaryEn: "Residential child development camps are organised to nurture good values, discipline and positive attitudes among the younger generation.",
    objectiveMr: "लहान मुलांमध्ये सांस्कृतिक मूल्ये, शिस्त, योग आणि सकारात्मक व्यक्तिमत्त्व विकासाची पायाभरणी करणे.",
    objectiveEn: "",
    descriptionMr: `नवीन पिढीमध्ये चांगले संस्कार, शिस्त आणि सकारात्मक मूल्ये रुजवण्यासाठी निवासी बालसंस्कार शिबिरांचे आयोजन केले जाते.

मुलांना भजन, कीर्तन, टाळ वाजवणे, लेझीम, भगवद्गीता, योग, प्राणायाम आणि ध्यान यांसारख्या विविध उपक्रमांमध्ये सहभागी करून घेतले जाते. दैनंदिन दिनचर्या आणि आध्यात्मिक विचारांची ओळखही मुलांना करून दिली जाते. भारतीय संस्कृतीची माहिती, चांगल्या सवयी आणि शिस्तीची जाणीव मुलांमध्ये रुजवणे हा या शिबिराचा मुख्य हेतू आहे.`,
    descriptionEn: `Residential child development camps are organised to nurture good values, discipline and positive attitudes among the younger generation.

Children participate in a range of activities such as bhajans, kirtans, playing traditional cymbals, lezim, Bhagavad Gita studies, yoga, pranayama and meditation.

Children are also introduced to daily routines and spiritual values. The primary objective of the camp is to familiarise children with Indian culture, encourage good habits and instil a sense of discipline and responsibility.`,
    statMr: "संस्कृती, योग व मूल्य संवर्धन",
    statEn: "Cultural Heritage & Yoga Training",
  },
  {
    sortOrder: 15,
    slug: "killa-bandhani-spardha",
    titleMr: "किल्ला बांधणी स्पर्धा",
    titleEn: "Fort-Building Competition",
    summaryMr: "दिवाळीत मुलांनी घरी किल्ले बांधण्याची जुनी परंपरा पुढील पिढीपर्यंत पोहोचावी आणि मुलांना इतिहासाची ओळख व्हावी यासाठी शाळांच्या माध्यमातून भव्य किल्ला बांधणी स्पर्धा आयोजित केली जाते.",
    summaryEn: "In Solapur district, building forts at home during Diwali is a long-standing tradition among children. To preserve this tradition for future generations and help children develop an understanding of their history, a Fort-Building Competition is organised.",
    objectiveMr: "छत्रपती शिवाजी महाराजांचा जाज्वल्य इतिहास आणि किल्ल्यांची महती शालेय विद्यार्थ्यांपर्यंत पोहोचवणे.",
    objectiveEn: "",
    descriptionMr: `सोलापूर जिल्ह्यात दिवाळीत मुलांनी घरी किल्ले बांधण्याची जुनी परंपरा आहे. ही परंपरा पुढील पिढीपर्यंत पोहोचावी आणि मुलांना आपल्या इतिहासाची ओळख व्हावी, यासाठी किल्ला बांधणी स्पर्धेचे आयोजन केले जाते.

विद्यार्थ्यांना विविध किल्ल्यांचा इतिहास आणि त्यांची माहिती समजावी यासाठी शाळांच्या माध्यमातून ही स्पर्धा आयोजित केली जाते. प्रत्येक शाळेतून विद्यार्थ्यांचे गट तयार करून शिक्षकांच्या मार्गदर्शनाखाली किल्ले तयार केले जातात. या उपक्रमामुळे इतिहासाची ओळख आणि किल्ल्यांविषयीचा आदर मुलांमध्ये वाढण्यास मदत होते.`,
    descriptionEn: `In Solapur district, building forts at home during Diwali is a long-standing tradition among children. To preserve this tradition for future generations and help children develop an understanding of their history, a Fort-Building Competition is organised.

The competition is conducted through schools to help students learn about the history and significance of various forts. Groups of students are formed in each school, and forts are built under the guidance of teachers.

This initiative helps children develop an understanding of history and fosters respect for Maharashtra's forts and heritage.`,
    statMr: "ऐतिहासिक संस्कृती व परंपरा जतन",
    statEn: "Historical Pride & Fort Models",
  },
  {
    sortOrder: 16,
    slug: "rozgar-melava",
    titleMr: "रोजगार मेळावा",
    titleEn: "Employment Fair",
    summaryMr: "तरुणांना शिक्षण आणि कौशल्यानुसार रोजगाराच्या संधी मिळाव्यात यासाठी कौशल्य विकास विभाग आणि फाउंडेशन यांच्या संयुक्त विद्यमाने ३१ जानेवारी २०२४ रोजी शासकीय ITI सोलापूर येथे भव्य रोजगार मेळावा आयोजित करण्यात आला.",
    summaryEn: "An employment fair was organised to provide young people with employment opportunities suited to their educational qualifications and skills.",
    objectiveMr: "ग्रामीण व निमशहरी तरुणांना प्रतिष्ठित उद्योगांमध्ये थेट रोजगाराच्या संधी उपलब्ध करून देणे.",
    objectiveEn: "",
    descriptionMr: `तरुणांना त्यांच्या शिक्षण आणि कौशल्यानुसार रोजगाराच्या संधी उपलब्ध व्हाव्यात, यासाठी रोजगार मेळाव्याचे आयोजन करण्यात आले.

३१ जानेवारी २०२४ रोजी शासकीय औद्योगिक प्रशिक्षण संस्थेत कौशल्य विकास, रोजगार व उद्योजकता विभाग आणि लोकमंगल Foundation यांच्या संयुक्त विद्यमाने हा मेळावा आयोजित करण्यात आला. सोलापूरसह पुणे, कोल्हापूर, अहिल्यानगर आणि छत्रपती संभाजीनगर येथील कंपन्यांनी या मेळाव्यात सहभाग घेतला. या मेळाव्यात सुमारे २,००० तरुण सहभागी झाले.`,
    descriptionEn: `An employment fair was organised to provide young people with employment opportunities suited to their educational qualifications and skills.

On 31 January 2024, the fair was organised jointly by the Department of Skill Development, Employment and Entrepreneurship and Lokmangal Foundation at the Government Industrial Training Institute.

Companies from Solapur, Pune, Kolhapur, Ahilyanagar and Chhatrapati Sambhajinagar participated in the fair. Approximately 2,000 young people attended the event.`,
    statMr: "२,०००+ तरुण | ५ प्रमुख शहरे",
    statEn: "2,000+ Youth | Multi-City Employers",
  },
  {
    sortOrder: 17,
    slug: "mahila-din",
    titleMr: "महिला दिन",
    titleEn: "Women's Day",
    summaryMr: "जागतिक महिला दिन आणि अन्नपूर्णा योजनेच्या वर्धापन दिनाचे औचित्य साधून कर्तबगार व यशस्वी महिलांचा सन्मान केला जातो. महिलांसाठी सांस्कृतिक खेळ, विविध स्पर्धा आणि मार्गदर्शनपर सत्रांचे आयोजन केले जाते.",
    summaryEn: "On the occasion of International Women's Day and the anniversary of the Annapurna Yojana, accomplished and successful women are honoured for their contributions and achievements.",
    objectiveMr: "महिलांच्या कर्तृत्वाला दाद देणे, त्यांचा आत्मविश्वास वाढवणे आणि सामाजिक सहभागाला प्रोत्साहन देणे.",
    objectiveEn: "",
    descriptionMr: `जागतिक महिला दिन आणि अन्नपूर्णा योजनेच्या वर्धापन दिनाचे औचित्य साधून कर्तबगार व यशस्वी महिलांचा सन्मान केला जातो. महिलांसाठी सांस्कृतिक खेळ आणि विविध स्पर्धांचे आयोजन करून त्यांच्या सहभागाला प्रोत्साहन दिले जाते.

यशस्वी महिलांचे अनुभव आणि मार्गदर्शन इतर महिलांपर्यंत पोहोचवले जाते. अशा कार्यक्रमांच्या माध्यमातून महिलांना प्रोत्साहन, आत्मविश्वास आणि पुढे जाण्याची प्रेरणा मिळावी हा या उपक्रमाचा उद्देश आहे.`,
    descriptionEn: `On the occasion of International Women's Day and the anniversary of the Annapurna Yojana, accomplished and successful women are honoured for their contributions and achievements.

Cultural activities, games and various competitions are organised for women to encourage their participation. The experiences and guidance of successful women are also shared with other women.

The objective of such programmes is to provide women with encouragement, confidence and inspiration to move forward and pursue their aspirations.`,
    statMr: "कर्तबगार महिला सन्मान व प्रेरणा",
    statEn: "Honoring Women Trailblazers",
  },
  {
    sortOrder: 18,
    slug: "bhajan-bharud-spardha",
    titleMr: "भजन व भारूड स्पर्धा",
    titleEn: "Bhajan and Bharud Competition",
    summaryMr: "धार्मिक आणि सांस्कृतिक लोकपरंपरांचे जतन व संवर्धन करण्यासाठी दरवर्षी भजन-भारूड स्पर्धेचे आयोजन केले जाते. भजन व कीर्तन मंडळांना मृदंग, तबला, पेटी, हार्मोनियम यांसारखे साहित्यही उपलब्ध करून दिले जाते.",
    summaryEn: "A Bhajan and Bharud Competition is organised once a year to preserve and promote religious and cultural traditions.",
    objectiveMr: "संतपरंपरेचे विचार, भजन-भारुड कला जपणे आणि पारंपरिक कलाकारांना वाद्ये व व्यासपीठ उपलब्ध करून देणे.",
    objectiveEn: "",
    descriptionMr: `धार्मिक आणि सांस्कृतिक परंपरांचे जतन व संवर्धन करण्यासाठी वर्षातून एकदा भजन-भारूड स्पर्धेचे आयोजन केले जाते. नवीन पिढीला या लोकपरंपरांची ओळख व्हावी आणि या परंपरांचे संस्कार पुढील पिढीपर्यंत पोहोचावेत, यावर भर दिला जातो.

भजन, भारूड आणि कीर्तन करणाऱ्या मंडळांना प्रोत्साहन देण्यासाठी मृदंग, तबला, पेटी, हार्मोनियम यांसारखे साहित्यही उपलब्ध करून दिले जाते. यामुळे कला आणि धार्मिक-सांस्कृतिक परंपरांना चालना मिळण्यास मदत होते.`,
    descriptionEn: `A Bhajan and Bharud Competition is organised once a year to preserve and promote religious and cultural traditions.

Emphasis is placed on introducing the younger generation to these folk traditions and passing their cultural values on to future generations.

To encourage groups that perform bhajans, bharuds and kirtans, musical instruments and equipment such as mridang, tabla, harmonium and other instruments are also provided.

This initiative helps encourage artistic expression and preserve religious and cultural traditions.`,
    statMr: "लोककला जतन व संगीत साहित्य वाटप",
    statEn: "Folk Traditions & Musical Instruments",
  },
  {
    sortOrder: 19,
    slug: "yoga-din",
    titleMr: "योग दिन",
    titleEn: "Yoga Day",
    summaryMr: "दरवर्षी २१ जून रोजी आंतरराष्ट्रीय योग दिनानिमित्त शाळा, महाविद्यालये व सामाजिक केंद्रांमध्ये योग शिक्षकांच्या मार्गदर्शनाखाली प्रशिक्षण दिले जाते. शारीरिक व मानसिक आरोग्याबाबत जनजागृती केली जाते.",
    summaryEn: "Every year on 21 June, awareness about yoga is promoted on the occasion of International Yoga Day.",
    objectiveMr: "नागरिक व विद्यार्थ्यांमध्ये नियमित योगाभ्यास आणि निरोगी जीवनशैलीची सवय रुजवणे.",
    objectiveEn: "",
    descriptionMr: `दरवर्षी २१ जून रोजी आंतरराष्ट्रीय योग दिनाचे औचित्य साधून योगाबाबत जनजागृती केली जाते. शाळा, महाविद्यालये आणि इतर ठिकाणी योगशिक्षकांच्या मार्गदर्शनाखाली योगाचे प्रशिक्षण दिले जाते.

योगाच्या माध्यमातून शारीरिक, मानसिक आणि आध्यात्मिक आरोग्याबाबत नागरिकांना माहिती दिली जाते. नियमित योगाभ्यासाची सवय लागावी आणि आरोग्याची काळजी घेण्याची जाणीव वाढावी हा या उपक्रमाचा उद्देश आहे.`,
    descriptionEn: `Every year on 21 June, awareness about yoga is promoted on the occasion of International Yoga Day.

Yoga training sessions are conducted in schools, colleges and other locations under the guidance of trained yoga instructors.

Citizens are educated about physical, mental and spiritual well-being through yoga. The objective of this initiative is to encourage the habit of regular yoga practice and create greater awareness about the importance of maintaining good health.`,
    statMr: "२१ जून | आरोग्य व मनःशांती",
    statEn: "June 21 | Health & Peace of Mind",
  },
  {
    sortOrder: 20,
    slug: "ekal-mahila-upakram",
    titleMr: "एकल महिला उपक्रम",
    titleEn: "Support Initiative for Single Women",
    summaryMr: "पतीचे निधन झालेल्या, घटस्फोटित अथवा निराधार महिलांना आर्थिक व सामाजिक आधार देण्यासाठी उपक्रम. शैक्षणिक पात्रतेनुसार रोजगाराच्या संधी, मुलांचे शिक्षण, गृहकर्ज व सरकारी योजनांचा लाभ मिळवून देण्याचा प्रयत्न.",
    summaryEn: "This initiative is undertaken to provide financial and social support to women who are widowed, divorced, separated or without adequate family support.",
    objectiveMr: "एकल महिलांचे स्वावलंबन, मुलांचे शिक्षण आणि सन्माननीय जीवन जगण्यासाठी सर्वांगीण आधार देणे.",
    objectiveEn: "",
    descriptionMr: `पतीचे निधन झालेल्या, घटस्फोटित, विभक्त किंवा निराधार महिलांना आर्थिक व सामाजिक आधार देण्यासाठी हा उपक्रम राबवला जातो. महिलांच्या शैक्षणिक पात्रतेनुसार त्यांना रोजगाराच्या संधी उपलब्ध करून देणे तसेच त्यांच्या मुलांच्या शिक्षणासाठी आर्थिक मदत आणि शालेय साहित्य उपलब्ध करून देणे यामध्ये समाविष्ट आहे.

मुलांना रोजगार, मुला-मुलींचे विवाह, व्यावसायिक किंवा गृहकर्ज तसेच सरकारी योजनांचा लाभ मिळवून देण्यासाठीही मदत केली जाते. या माध्यमातून महिलांना स्वतःच्या तसेच कुटुंबाच्या गरजा पूर्ण करण्यासाठी आवश्यक आधार मिळवून देण्याचा प्रयत्न केला जातो.`,
    descriptionEn: `This initiative is undertaken to provide financial and social support to women who are widowed, divorced, separated or without adequate family support.

The initiative includes facilitating employment opportunities based on women's educational qualifications, as well as providing financial assistance and educational materials for their children's education.

Support is also provided to help children access employment opportunities, assist with the marriage of sons and daughters, facilitate business or home loans, and access government welfare schemes.

Through this initiative, efforts are made to provide women with the support they need to meet their own needs and those of their families and move towards greater self-reliance.`,
    statMr: "आर्थिक, सामाजिक व रोजगार आधार",
    statEn: "Economic & Social Empowerment",
  },
  {
    sortOrder: 21,
    slug: "vruksharopan",
    titleMr: "वृक्षारोपण",
    titleEn: "Tree Plantation",
    summaryMr: "पर्यावरणाचे रक्षण आणि झाडांची संख्या वाढवण्यासाठी शाळा परिसर तसेच लोकवस्तीमध्ये वृक्षारोपण केले जाते. केवळ झाड लावणे नव्हे, तर त्याची वाढ होईपर्यंत संगोपन करण्याचा सामाजिक संदेश दिला जातो.",
    summaryEn: "Tree plantation drives are conducted in school premises and residential areas to protect the environment and increase green cover.",
    objectiveMr: "पर्यावरण रक्षण, भूजल संवर्धन आणि मुलांमध्ये वृक्षांविषयी आत्मीयता निर्माण करणे.",
    objectiveEn: "",
    descriptionMr: `पर्यावरणाचे रक्षण आणि झाडांची संख्या वाढवण्यासाठी शाळा परिसर तसेच लोकवस्तीमध्ये वृक्षारोपण केले जाते. केवळ झाड लावणे पुरेसे नसून, त्याची वाढ होईपर्यंत त्याचे संगोपन करणे आवश्यक आहे, हा संदेश या उपक्रमातून दिला जातो.

मुलांमध्ये लहानपणापासून झाडांविषयी प्रेम आणि पर्यावरणाप्रती जबाबदारीची भावना निर्माण करण्यावर भर दिला जातो. वाढदिवस किंवा इतर विशेष प्रसंगी किमान एक झाड लावून त्याचे संगोपन करण्याचे आवाहनही करण्यात आले आहे.`,
    descriptionEn: `Tree plantation drives are conducted in school premises and residential areas to protect the environment and increase green cover.

The initiative emphasises that planting a tree is only the beginning; it is equally important to nurture and care for the tree until it grows.

Special emphasis is placed on developing a love for trees and a sense of environmental responsibility among children from an early age. Citizens are also encouraged to plant and nurture at least one tree on birthdays or other special occasions.`,
    statMr: "पर्यावरण रक्षण व वृक्ष संवर्धन",
    statEn: "Green Cover & Eco-Preservation",
  },
  {
    sortOrder: 22,
    slug: "dandiya-utsav",
    titleMr: "दांडिया उत्सव",
    titleEn: "Dandiya Festival",
    summaryMr: "नवरात्रोत्सवाच्या निमित्ताने महिलांना सांस्कृतिक उपक्रमांमध्ये सहभागी होण्यासाठी दांडिया आणि गरबा स्पर्धांचे आयोजन केले जाते. समूह तसेच वैयक्तिक पद्धतीने महिलांना नृत्यकला सादर करण्यासाठी व्यासपीठ मिळते.",
    summaryEn: "On the occasion of Navratri, Dandiya and Garba competitions are organised to encourage women to participate in cultural activities.",
    objectiveMr: "महिलांच्या कलागुणांना व्यासपीठ देणे आणि सुरक्षित, आनंदी वातावरणात सांस्कृतिक सण साजरा करणे.",
    objectiveEn: "",
    descriptionMr: `नवरात्रोत्सवाच्या निमित्ताने महिलांना सांस्कृतिक उपक्रमांमध्ये सहभागी होण्यासाठी दांडिया आणि गरबा स्पर्धांचे आयोजन केले जाते. समूह तसेच वैयक्तिक पद्धतीने महिलांना आपली नृत्यकला सादर करण्याची संधी दिली जाते.

यामुळे महिलांच्या कला आणि कौशल्यांना व्यासपीठ उपलब्ध होते. विजेत्या महिलांना सन्मानपत्र, ट्रॉफी, रोख रक्कम किंवा घरगुती साहित्य अशा विविध स्वरूपात बक्षिसे देऊन त्यांना प्रोत्साहन दिले जाते.`,
    descriptionEn: `On the occasion of Navratri, Dandiya and Garba competitions are organised to encourage women to participate in cultural activities.

Women are given opportunities to showcase their dancing skills both individually and as groups. This provides a platform for women to express and develop their artistic talents.

The winning participants are encouraged through prizes in various forms, including certificates of appreciation, trophies, cash prizes and household items.`,
    statMr: "नवरात्रोत्सव | महिला कला व्यासपीठ",
    statEn: "Navratri Celebration & Dance Arena",
  },
  {
    sortOrder: 23,
    slug: "madhyamanchi-dakhal",
    titleMr: "माध्यमांची दखल",
    titleEn: "Media Coverage",
    summaryMr: "लोकमंगल Foundationच्या विविध सामाजिक, शैक्षणिक, आरोग्य, महिला, रोजगार आणि सांस्कृतिक उपक्रमांची विविध वृत्तपत्रांनी दखल घेतली आहे. संस्थात्मक कार्याचा हा महत्त्वपूर्ण दस्तऐवज आहे.",
    summaryEn: "Various newspapers have highlighted the social, educational, healthcare, women's empowerment, employment and cultural initiatives undertaken by Lokmangal Foundation.",
    objectiveMr: "संस्थेच्या सामाजिक उपक्रमांचे कार्य व यश प्रसारमाध्यमांद्वारे व्यापक जनसामान्यांपर्यंत पोहोचवणे.",
    objectiveEn: "",
    descriptionMr: `लोकमंगल Foundationच्या विविध सामाजिक, शैक्षणिक, आरोग्य, महिला, रोजगार आणि सांस्कृतिक उपक्रमांची विविध वृत्तपत्रांनी दखल घेतली आहे.

अहवालाच्या या भागात साहित्य पुरस्कार, लोटस योजनेतील विद्यार्थ्यांना मदत, बालसंस्कार शिबिर, भजन मंडळांना साहित्य, दिव्यांगांना साहित्य, आरोग्य शिबिरे, जलसंधारण आणि रोजगार मेळावे यांसंबंधीच्या बातम्यांचा समावेश आहे.

विविध वृत्तपत्रांमधून प्रसिद्धी मिळाल्यामुळे या उपक्रमांची माहिती अधिकाधिक लोकांपर्यंत पोहोचण्यास मदत झाली आहे. माध्यमांमधील ही नोंद संस्थेच्या विविध सामाजिक कार्याची माहिती देणारा महत्त्वाचा भाग आहे.`,
    descriptionEn: `Various newspapers have highlighted the social, educational, healthcare, women's empowerment, employment and cultural initiatives undertaken by Lokmangal Foundation.

This section of the report includes news coverage related to the Literature Award, assistance provided to students under the LOTUS initiative, Child Values and Development Camps, distribution of equipment to bhajan groups, support for persons with disabilities, healthcare camps, water conservation initiatives and employment fairs.

Coverage in various newspapers has helped bring information about these initiatives to a wider audience.

This media coverage serves as an important record of the Foundation's diverse social initiatives and its work across different areas of community development.`,
    statMr: "वृत्तपत्रे व प्रसारमाध्यमांतून गौरव",
    statEn: "Media Recognition & News Coverage",
  },
];

async function updateAll() {
  console.log("Connecting to database...");
  await sequelize.authenticate();
  console.log("Connected to MySQL!");

  for (const item of INITIATIVES_DATA) {
    const existing = await Project.findOne({ where: { slug: item.slug } });
    if (existing) {
      console.log(`Updating existing project: ${item.slug}`);
      await existing.update({
        titleMr: item.titleMr,
        titleEn: item.titleEn,
        summaryMr: item.summaryMr,
        summaryEn: item.summaryEn,
        objectiveMr: item.objectiveMr,
        objectiveEn: item.objectiveEn,
        descriptionMr: item.descriptionMr,
        descriptionEn: item.descriptionEn,
        statMr: item.statMr,
        statEn: item.statEn,
        sortOrder: item.sortOrder,
        ...(item.videoUrl && !existing.videoUrl ? { videoUrl: item.videoUrl } : {}),
      });
    } else {
      console.log(`Creating new project: ${item.slug}`);
      await Project.create({
        slug: item.slug,
        titleMr: item.titleMr,
        titleEn: item.titleEn,
        summaryMr: item.summaryMr,
        summaryEn: item.summaryEn,
        objectiveMr: item.objectiveMr,
        objectiveEn: item.objectiveEn,
        descriptionMr: item.descriptionMr,
        descriptionEn: item.descriptionEn,
        statMr: item.statMr,
        statEn: item.statEn,
        sortOrder: item.sortOrder,
        videoUrl: item.videoUrl || null,
        coverImageUrl: null,
      });
    }
  }

  const allProjects = await Project.findAll({ order: [["sortOrder", "ASC"]] });
  console.log(`Successfully synced! Total projects in DB: ${allProjects.length}`);
  process.exit(0);
}

updateAll().catch((err) => {
  console.error("Error updating initiatives:", err);
  process.exit(1);
});
