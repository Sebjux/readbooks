const fs = require('fs');
const path = require('path');

const bookData = {
  "id": "healthy-1",
  "title": "The Rhythm of Renewal",
  "author": "Clara Miller",
  "level": "B1",
  "genre": "health",
  "minutes": 65,
  "vocab": 3,
  "dateAdded": "2026-09-23",
  "c1": "#059669",
  "c2": "#022C22",
  "story": {
    "C2": [
      [
        "At thirty-four, Marcus Vance had cultivated a career in architectural design that was as demanding as it was prestigious, yet his personal vitality was steadily eroding beneath the relentless pressure of corporate deadlines.",
        "His mornings commenced with a double shot of espresso consumed in hasty solitude, followed by twelve-hour stretches at his drafting monitor where processed convenience meals replaced wholesome nutrition.",
        "The insidiousness of chronic fatigue had become his ambient reality; sleep was an elusive luxury interrupted by nocturnal emails and persistent anxiety regarding project milestone reviews.",
        "It was during a pivotal presentation to the municipal urban planning committee that his precarious equilibrium collapsed in a dizzying wave of palpitations and acute hypertension."
      ],
      [
        "Surriving at the emergency medical center, the attending physician delivered a stark prognosis: his physiological metrics indicated severe systemic stress, demanding immediate lifestyle intervention.",
        "The diagnosis served as a sobering catalyst, compelling Marcus to seek guidance from Dr. Hannah Brooks, a renowned specialist in integrative health and habitual wellness.",
        "In her tranquil consultation office, Hannah eschewed superficial medical jargon, emphasizing instead the profound restorative power of incremental, sustainable behavioral recalibration.",
        "'Transformation is not an abrupt overhaul, Marcus,' she remarked thoughtfully, 'but rather a delicate harmony composed of proper nutrition, restorative sleep, and conscious physical movement.'"
      ],
      [
        "Implementing his initial recalibration required substituting refined evening sugars and late-night screen illumination with a rigorous sleep hygiene protocol.",
        "Marcus established a sacred pre-slumber routine, dimming his apartment lights at nine o'clock and engaging in reflective journaling alongside herbal infusions.",
        "Simultaneously, he reorganized his culinary habits, replacing processed cafeteria lunches with Mediterranean-style whole foods prepared during peaceful Sunday prep sessions.",
        "The initial week tested his psychological fortitude as caffeine withdrawal and ingrained habitual inertia mounted a stubborn resistance against his newly forged discipline."
      ],
      [
        "To address his sedentary baseline, Hannah recommended commencing with low-intensity aerobic conditioning, specifically twenty-minute brisk walks at dawn before opening his laptop.",
        "As autumn sunlight filtered through the suburban park canopy, Marcus began noticing the subtle sensory pleasures of outdoor movement that his sedentary routine had long obscured.",
        "His colleague Sarah, observing his nascent dedication, offered encouraging camaraderie, joining him for post-lunch walking meetings around the office courtyard.",
        "This simple social integration transformed exercise from an intimidating obligation into a refreshing, collaborative interlude within his workday."
      ],
      [
        "By the second month, the physiological dividends of his sustained discipline manifested in remarkable clarity of mind and stabilized energy levels throughout the afternoon.",
        "His resting blood pressure returned to optimal parameters, while his cognitive stamina during complex architectural renderings surpassed his previous benchmarks.",
        "More importantly, Marcus had internalistically embraced the philosophy that self-care was not an impediment to productivity, but its foundational prerequisite.",
        "Presenting his finalized eco-residential project to the board, he stood with renewed poise, embodying the vital equilibrium he had diligently reclaimed."
      ]
    ],
    "C1": [
      [
        "At thirty-four, Marcus Vance was a successful architectural designer, but his busy lifestyle was taking a heavy toll on his physical and mental health.",
        "His days always started with strong coffee on an empty stomach, followed by long hours sitting at his desk eating fast food between urgent deadlines.",
        "Constant tiredness had become normal for him; he rarely slept deeply because late-night work emails kept his mind racing until dawn.",
        "During an important presentation to city planners, his body finally broke down under the stress, forcing him to sit as dizziness and racing heartbeats took over."
      ],
      [
        "At the medical clinic, the doctor warned him clearly that his elevated blood pressure and extreme fatigue required an immediate change in daily habits.",
        "This health scare became a turning point, prompting Marcus to consult Dr. Hannah Brooks, a respected lifestyle and wellness counselor.",
        "Rather than giving him complicated diets, Hannah focused on small, manageable changes to his daily routine that could last a lifetime.",
        "'Real health isn't about extreme changes,' Hannah explained kindly. 'It is built through balanced nutrition, quality sleep, and regular daily movement.'"
      ],
      [
        "Marcus began his recovery by fixing his sleep habits, turning off his phone and computer screens at nine each evening to let his nervous system relax.",
        "He replaced junk food and sugary snacks with balanced whole food meals prepared at home on weekends.",
        "Although the first two weeks were difficult as caffeine cravings and old habits resisted, he stayed committed to his new evening routine.",
        "Soon, his sleep deepened, and he woke up feeling truly rested for the first time in years."
      ],
      [
        "To rebuild his physical fitness, Marcus started taking early morning walks in the nearby park before starting his workday.",
        "Walking outdoors helped clear his head, allowing him to enjoy fresh morning air and manage his work stress much better.",
        "His coworker Sarah noticed his positive energy and joined him for daily lunchtime walks around the office grounds.",
        "Exercise was no longer a chore; it became an enjoyable part of his daily life that brightened his afternoons."
      ],
      [
        "After two months of consistent healthy habits, Marcus experienced a complete renewal of his energy, focus, and emotional well-being.",
        "His blood pressure returned to a healthy range, and his creative focus on architecture projects reached new heights.",
        "He realized that taking care of his body made him more productive and creative, not less.",
        "When he delivered his final presentation to his team, he felt confident, calm, and truly healthy."
      ]
    ],
    "B2": [
      [
        "Marcus Vance was thirty-four years old and worked as a dedicated architect in a busy city office.",
        "However, long work hours, lack of exercise, and constant fast food had left him exhausted and stressed.",
        "He drank several cups of coffee every morning and often worked late into the night without proper rest.",
        "One afternoon during a major meeting, he suddenly felt dizzy and had to stop speaking as his heart pounded rapidly."
      ],
      [
        "A doctor at the local clinic checked his blood pressure and told him that his body was under too much pressure.",
        "Realizing he needed help, Marcus made an appointment with Dr. Hannah Brooks, a supportive health advisor.",
        "Hannah explained that small, consistent changes in sleep, food, and daily activity could rebuild his energy.",
        "'You don't need a hard diet or intense workouts,' Hannah said. 'You just need a balanced routine that respects your body.'"
      ],
      [
        "Marcus started by improving his evening routine, turning off electronic devices an hour before bed and reading quietly instead.",
        "He began preparing fresh lunches with vegetables and lean protein on Sunday afternoons to avoid buying fast food at work.",
        "The first week was challenging because his body missed caffeine and sugary drinks, but he kept going.",
        "Within ten days, he noticed that he was sleeping better and waking up with less morning brain fog."
      ],
      [
        "Next, he added a twenty-minute morning walk in a nearby park before starting his work computer.",
        "The fresh air and gentle movement gave him steady energy without needing three cups of coffee.",
        "His office colleague Sarah noticed the positive change and suggested walking together during lunch breaks.",
        "Having a walking partner made the habit fun and helped both of them handle workplace stress much better."
      ],
      [
        "After eight weeks of sticking to his new habits, Marcus felt like a completely different person.",
        "His blood pressure was back to normal, his mood was positive, and his work productivity had improved significantly.",
        "He learned that choosing health every day was the best investment he could ever make for his future.",
        "With new energy and confidence, he proudly completed his major building project with ease."
      ]
    ],
    "B1": [
      [
        "Marcus was thirty-four years old and worked as a busy architect.",
        "He worked long hours every day, ate fast food, and rarely exercised.",
        "Every morning, he drank three cups of strong coffee because he felt very tired.",
        "One day at work, he felt dizzy during an important presentation and had to sit down."
      ],
      [
        "The doctor told Marcus that his blood pressure was too high because of stress and poor habits.",
        "Marcus decided to visit Dr. Hannah, a friendly health coach.",
        "Hannah told him that small daily habits could make a big difference in his health.",
        "'You do not need to change everything in one day,' Hannah said. 'Start with good sleep, good food, and daily walks.'"
      ],
      [
        "Marcus began going to bed at ten o'clock every night and turned off his phone before sleep.",
        "He started cooking simple meals with fresh vegetables and water instead of soda.",
        "The first few days were hard, but he slowly felt less tired and more relaxed.",
        "After two weeks, he woke up every morning feeling refreshed and ready for the day."
      ],
      [
        "Marcus also began walking for twenty minutes in the park every morning.",
        "He enjoyed the cool air and quiet green trees before his busy workday started.",
        "His coworker Sarah saw his energy and decided to walk with him during lunch breaks.",
        "Walking together made work less stressful and helped them stay active every day."
      ],
      [
        "After two months, Marcus felt healthy, strong, and full of energy.",
        "His doctor checked his blood pressure again and was very happy with the results.",
        "Marcus was happy too because he could work better and enjoy his life more.",
        "He learned that small healthy steps every day lead to big happiness."
      ]
    ],
    "A2": [
      [
        "Marcus was thirty-four years old. He worked in a big office as an architect.",
        "He worked hard every day. He ate fast food and drank a lot of coffee.",
        "He did not sleep well because he was always worried about work.",
        "One day, he felt dizzy at work and needed to sit down."
      ],
      [
        "Marcus went to see a doctor. The doctor said he needed better habits.",
        "So Marcus talked to Hannah, a health teacher.",
        "Hannah said, 'You need sleep, healthy food, and daily exercise.'",
        "Marcus agreed to try small changes every day."
      ],
      [
        "First, Marcus went to sleep early. He turned off his phone at nine o'clock.",
        "He cooked fresh meals with vegetables and drank water every day.",
        "At first, it was difficult, but soon he had more energy.",
        "He slept well and felt happy in the morning."
      ],
      [
        "Second, Marcus started walking in the park every morning for twenty minutes.",
        "He liked the green trees and fresh air.",
        "His friend Sarah walked with him at lunch time.",
        "They talked, walked, and felt less stressed."
      ],
      [
        "After two months, Marcus felt strong and active again.",
        "His doctor was very happy with his health.",
        "Marcus learned that good habits make a good life.",
        "He was happy and ready for new challenges."
      ]
    ],
    "A1": [
      [
        "Marcus is thirty-four years old. He works in an office.",
        "He works a lot every day. He is very busy.",
        "He drinks coffee and eats fast food.",
        "He is tired and stressed."
      ],
      [
        "One day, Marcus feels sick at work.",
        "He goes to a doctor.",
        "The doctor says, 'You need good food and sleep.'",
        "Marcus wants to be healthy."
      ],
      [
        "Marcus sleeps early every night.",
        "He eats good food with fresh vegetables.",
        "He drinks cold water.",
        "He feels better."
      ],
      [
        "Every morning, Marcus walks in the park.",
        "The park is quiet and green.",
        "His friend Sarah walks with him.",
        "They are happy."
      ],
      [
        "Now, Marcus is healthy and strong.",
        "He has good energy every day.",
        "Good food and exercise are very good for him.",
        "Marcus smiles."
      ]
    ]
  }
};

const contentPath = path.join(__dirname, '../books/content/healthy-1.json');
fs.writeFileSync(contentPath, JSON.stringify(bookData, null, 2));
console.log('Created books/content/healthy-1.json successfully!');
