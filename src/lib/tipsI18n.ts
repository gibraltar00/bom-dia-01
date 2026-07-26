import type { LangCode } from './translations';

const en = [
  'Recycling one aluminum can saves enough energy to run a TV for 3 hours.',
  'A plastic bottle can take up to 450 years to decompose — recycle it instead!',
  'Glass is 100% recyclable and can be reused endlessly without losing quality.',
  'Recycling a single ton of paper saves about 17 trees and 7,000 gallons of water.',
  'Upcycling gives waste a second life and keeps it out of landfills entirely.',
  'Did you know? Composting food scraps cuts methane emissions from landfills.',
  'One recycled glass bottle saves enough energy to power a computer for 25 minutes.',
  'Cardboard can be recycled up to 7 times before the fibers wear out.',
  'Electronic waste contains precious metals — recycle it, do not trash it.',
  'Refusing single-use plastics is even better than recycling them.',
  'Recycling one ton of plastic saves nearly 2,000 gallons of oil.',
  'A steel can can be recycled into a new can in just 60 days.',
];

const pt = [
  'Reciclar uma lata de alumínio economiza energia para rodar uma TV por 3 horas.',
  'Uma garrafa plástica pode levar até 450 anos para se decompor — recicle-a!',
  'Vidro é 100% reciclável e pode ser reutilizado infinitamente sem perder qualidade.',
  'Reciclar uma tonelada de papel salva cerca de 17 árvores e 26.000 litros de água.',
  'A reciclagem criativa dá uma segunda vida ao lixo e o mantém fora dos aterros.',
  'Sabia? Compostar restos de comida reduz as emissões de metano dos aterros.',
  'Uma garrafa de vidro reciclada economiza energia para ligar um computador por 25 minutos.',
  'Papelão pode ser reciclado até 7 vezes antes de as fibras se desgastarem.',
  'Lixo eletrônico contém metais preciosos — recicle, não jogue fora.',
  'Recusar plásticos de uso único é ainda melhor do que reciclá-los.',
  'Reciclar uma tonelada de plástico economiza quase 7.500 litros de petróleo.',
  'Uma lata de aço pode se tornar uma nova lata em apenas 60 dias.',
];

const es = [
  'Reciclar una lata de aluminio ahorra energía para ver la TV 3 horas.',
  'Una botella de plástico tarda hasta 450 años en descomponerse — ¡recíclala!',
  'El vidrio es 100% reciclable y se puede reutilizar sin perder calidad.',
  'Reciclar una tonelada de papel salva unos 17 árboles y 26.000 litros de agua.',
  'El upcycling da una segunda vida a los desechos y los saca de los vertederos.',
  '¿Sabías? Compostar restos de comida reduce las emisiones de metano.',
  'Una botella de vidrio reciclada ahorra energía para una computadora 25 minutos.',
  'El cartón se puede reciclar hasta 7 veces antes de que las fibras se gasten.',
  'Los residuos electrónicos contienen metales preciosos — recíclalos, no los tires.',
  'Rechazar plásticos de un solo uso es aún mejor que reciclarlos.',
  'Reciclar una tonelada de plástico ahorra casi 7.500 litros de petróleo.',
  'Una lata de acero puede convertirse en una nueva en solo 60 días.',
];

const fr = [
  'Recycler une canette en aluminium économise assez d\'énergie pour 3h de TV.',
  'Une bouteille en plastique peut mettre 450 ans à se décomposer — recyclez-la !',
  'Le verre est 100% recyclable et réutilisable sans perdre en qualité.',
  'Recycler une tonne de papier sauve 17 arbres et 26 000 litres d\'eau.',
  'L\'upcycling donne une seconde vie aux déchets et les garde hors des décharges.',
  'Le saviez-vous ? Composter les restes réduit les émissions de méthane.',
  'Une bouteille recyclée économise assez d\'énergie pour 25 min d\'ordinateur.',
  'Le carton se recycle jusqu\'à 7 fois avant que les fibres ne s\'usent.',
  'Les déchets électroniques contiennent des métaux précieux — recyclez-les.',
  'Refuser les plastiques à usage unique est encore mieux que les recycler.',
  'Recycler une tonne de plastique économise près de 7 500 litres de pétrole.',
  'Une boîte en acier peut redevenir une boîte en seulement 60 jours.',
];

const de = [
  'Eine Aludose zu recyceln spart Strom für 3 Stunden Fernsehen.',
  'Eine Plastikflasche braucht bis zu 450 Jahre zum Verrotten — recycle sie!',
  'Glas ist 100% recycelbar und endlos wiederverwendbar ohne Qualitätsverlust.',
  'Eine Tonne Papier zu recyceln rettet 17 Bäume und 26.000 Liter Wasser.',
  'Upcycling gibt Abfall ein zweites Leben und hält ihn aus Deponien heraus.',
  'Wusstest du? Kompostieren reduziert Methanemissionen aus Deponien.',
  'Eine recycelte Glasflasche spart Strom für 25 Minuten Computer.',
  'Pappe kann bis zu 7 Mal recycelt werden, bevor die Fasern sich abnutzen.',
  'Elektroschrott enthält Edelmetalle — recyceln, nicht wegwerfen.',
  'Einwegplastik abzulehnen ist besser als es zu recyceln.',
  'Eine Tonne Plastik zu recyceln spart fast 7.500 Liter Öl.',
  'Eine Stahldose kann in 60 Tagen wieder eine Dose werden.',
];

const it = [
  'Riciclare una lattina di alluminio risparmia energia per 3 ore di TV.',
  'Una bottiglia di plastica impiega 450 anni a decomporsi — riciclala!',
  'Il vetro è 100% riciclabile e riutilizzabile senza perdere qualità.',
  'Riciclare una tonnellata di carta salva 17 alberi e 26.000 litri d\'acqua.',
  'L\'upcycling dà una seconda vita ai rifiuti e li tiene fuori dalle discariche.',
  'Lo sapevi? Compostare gli avanzi riduce le emissioni di metano.',
  'Una bottiglia di vetro riciclata risparmia energia per 25 minuti di PC.',
  'Il cartone si ricicla fino a 7 volte prima che le fibre si consumino.',
  'I rifiuti elettronici contengono metalli preziosi — riciclali.',
  'Rifiutare la plastica monouso è meglio che riciclarla.',
  'Riciclare una tonnellata di plastica risparmia quasi 7.500 litri di petrolio.',
  'Una lattina d\'acciaio può diventare nuova in soli 60 giorni.',
];

const ja = [
  'アルミ缶一つのリサイクルでテレビ3時間分の電力を節約できます。',
  'ペットボトルは分解に450年かかります — リサイクルしましょう！',
  'ガラスは100%リサイクル可能で、品質を落とさず何度でも使えます。',
  '紙1トンのリサイクルで17本の木と26,000リットルの水を守ります。',
  'アップサイクルは廃棄物に第二の命を与え、埋立地から遠ざけます。',
  '知ってた？生ゴミを堆肥化すると埋立地のメタン排出を減らせます。',
  'リサイクルされたガラス瓶一本で25分のPC電力を節約できます。',
  '段ボールは繊維が劣化するまで7回リサイクルできます。',
  '電子廃棄物には貴金属が含まれます — リサイクルしましょう。',
  '使い捨てプラスチックを拒否することはリサイクルより良いです。',
  'プラスチック1トンのリサイクルで約7,500リットルの石油を節約。',
  'スチール缶はわずか60日で新しい缶にリサイクルできます。',
];

const zh = [
  '回收一个铝罐可省下看3小时电视的电力。',
  '一个塑料瓶需要450年才能分解 — 请回收它！',
  '玻璃是100%可回收的，可无限次再利用而不失品质。',
  '回收一吨纸可拯救约17棵树和26,000升水。',
  '升级改造给废物第二次生命，完全远离填埋场。',
  '你知道吗？堆肥厨余可减少填埋场的甲烷排放。',
  '回收一个玻璃瓶可省下电脑运行25分钟的电力。',
  '纸板可回收多达7次，直到纤维磨损。',
  '电子废物含有贵金属 — 回收它，别丢弃。',
  '拒绝一次性塑料比回收它更好。',
  '回收一吨塑料可节省近7,500升石油。',
  '一个钢罐可在60天内变成新罐。',
];

const ko = [
  '알루미늄 캔 하나를 재활용하면 TV 3시간 전력을 아껴요.',
  '플라스틱 병은 분해에 450년 걸려요 — 재활용해요!',
  '유리는 100% 재활용 가능하고 품질 손실 없이 무한히 쓸 수 있어요.',
  '종이 1톤 재활용은 17그루 나무와 26,000리터 물을 살려요.',
  '업사이클링은 쓰레기에 두 번째 삶을 줘 매립지에서 멀리해요.',
  '아시나요? 음식물 퇴비화는 매립지 메탄 배출을 줄여요.',
  '재활용 유리병 하나는 컴퓨터 25분 전력을 아껴요.',
  '골판지는 섬유가 닳기 전까지 7번 재활용 가능해요.',
  '전자폐기물에는 귀금속이 있어요 — 재활용해요.',
  '일회용 플라스틱 거부가 재활용보다 더 좋아요.',
  '플라스틱 1톤 재활용은 약 7,500리터 석유를 아껴요.',
  '강철 캔은 60일 만에 새 캔이 될 수 있어요.',
];

const ru = [
  'Переработка одной алюминиевой банки экономит энергию на 3 часа ТВ.',
  'Пластиковая бутылка разлагается до 450 лет — перерабатывайте её!',
  'Стекло на 100% перерабатывается без потери качества.',
  'Переработка тонны бумаги спасает 17 деревьев и 26 000 литров воды.',
  'Апсайклинг даёт отходам вторую жизнь и убирает их со свалок.',
  'Знали? Компостирование пищевых отходов снижает выбросы метана.',
  'Переработанная стеклянная бутылка экономит энергию на 25 минут ПК.',
  'Картон можно перерабатывать до 7 раз, пока волокна не износятся.',
  'Электронные отходы содержат драгметаллы — перерабатывайте их.',
  'Отказ от одноразового пластика лучше, чем его переработка.',
  'Переработка тонны пластика экономит почти 7 500 литров нефти.',
  'Стальная банка может стать новой всего за 60 дней.',
];

const ar = [
  'إعادة تدوير علبة ألمنيوم واحدة توفر طاقة لتشغيل التلفاز 3 ساعات.',
  'زجاجة بلاستيك تحتاج 450 سنة لتتحلل — أعِد تدويرها!',
  'الزجاج قابل لإعادة التدوير 100% دون فقدان الجودة.',
  'إعادة تدوير طن ورق تنقذ 17 شجرة و26,000 لتر ماء.',
  'الإعادة الإبداعية تمنح النفايات حياة ثانية وتبقيها خارج المكبات.',
  'هل تعلم؟ تأسيد بقايا الطعام يقلل انبعاثات الميثان.',
  'زجاجة زجاج معاد تدويرها توفر طاقة لـ25 دقيقة حاسوب.',
  'الكرتون يعاد تدويره حتى 7 مرات قبل تلف الألياف.',
  'النفايات الإلكترونية تحتوي معادن ثمينة — أعِد تدويرها.',
  'رفض البلاستيك للاستخدام مرة واحدة أفضل من إعادة تدويره.',
  'إعادة تدوير طن بلاستيك توفر نحو 7,500 لتر نفط.',
  'علبة صلب يمكن أن تصبح جديدة في 60 يوماً فقط.',
];

const hi = [
  'एक एल्युमिनियम कैन रीसाइकिल करने से टीवी 3 घंटे चलने की बिजली बचती है।',
  'प्लास्टिक बोतल को सड़ने में 450 साल लगते हैं — रीसाइकिल करें!',
  'काँच 100% रीसाइकल होता है और बिना गुण खोए बार-बार इस्तेमाल होता है।',
  'एक टन कागज रीसाइकिल करने से 17 पेड़ और 26,000 लीटर पानी बचता है।',
  'अपसाइक्लिंग कचरे को दूसरी ज़िंदगी देता है और लैंडफिल से दूर रखता है।',
  'जानते हैं? खाद्य अवशेष की खाद बनाने से मीथेन उत्सर्जन कम होता है।',
  'एक रीसाइकिल की काँच की बोतल 25 मिनट कंप्यूटर बिजली बचाती है।',
  'कार्डबोर्ड 7 बार रीसाइकिल हो सकता है फिर रेशे घिस जाते हैं।',
  'इलेक्ट्रॉनिक कचरे में कीमती धातुएँ होती हैं — रीसाइकिल करें।',
  'एकबारगी प्लास्टिक मना करना रीसाइकिल से बेहतर है।',
  'एक टन प्लास्टिक रीसाइकिल करने से लगभग 7,500 लीटर तेल बचता है।',
  'एक स्टील कैन 60 दिनों में नई कैन बन सकती है।',
];

export const RECYCLING_TIPS_I18N: Record<LangCode, string[]> = {
  en, pt, es, fr, de, it, ja, zh, ko, ru, ar, hi,
};

export function getRecyclingTips(lang: LangCode): string[] {
  return RECYCLING_TIPS_I18N[lang] ?? en;
}
