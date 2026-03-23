import { Card } from '../types';

export const professions: Card[] = [
  { id: 'p1', category: 'profession', name: 'Врач', description: 'Специалист в области медицины, умеет лечить и проводить операции', dangerLevel: 2 },
  { id: 'p2', category: 'profession', name: 'Инженер', description: 'Специалист по техническим системам, может ремонтировать оборудование', dangerLevel: 2 },
  { id: 'p3', category: 'profession', name: 'Военный', description: 'Имеет боевую подготовку и навыки выживания', dangerLevel: 3 },
  { id: 'p4', category: 'profession', name: 'Учёный', description: 'Исследователь с научными знаниями', dangerLevel: 2 },
  { id: 'p5', category: 'profession', name: 'Повар', description: 'Умеет готовить еду, важно для выживания', dangerLevel: 1 },
  { id: 'p6', category: 'profession', name: 'Электрик', description: 'Специалист по электричеству и проводке', dangerLevel: 2 },
  { id: 'p7', category: 'profession', name: 'Сантехник', description: 'Работает с водопроводом и канализацией', dangerLevel: 1 },
  { id: 'p8', category: 'profession', name: 'Охранник', description: 'Имеет навыки охраны и защиты', dangerLevel: 2 },
  { id: 'p9', category: 'profession', name: 'Механик', description: 'Ремонтирует технику и транспорт', dangerLevel: 2 },
  { id: 'p10', category: 'profession', name: 'Психолог', description: 'Помогает справляться с психологическими проблемами', dangerLevel: 1 },
  { id: 'p11', category: 'profession', name: 'Хирург', description: 'Проводит сложные хирургические операции', dangerLevel: 3 },
  { id: 'p12', category: 'profession', name: 'Программист', description: 'Работает с компьютерами и технологиями', dangerLevel: 1 },
  { id: 'p13', category: 'profession', name: 'Строитель', description: 'Умеет строить и ремонтировать помещения', dangerLevel: 2 },
  { id: 'p14', category: 'profession', name: 'Фермер', description: 'Знает сельское хозяйство и выращивание растений', dangerLevel: 1 },
  { id: 'p15', category: 'profession', name: 'Ветеринар', description: 'Лечит животных', dangerLevel: 1 },
  { id: 'p16', category: 'profession', name: 'Полицейский', description: 'Имеет навыки расследования и порядка', dangerLevel: 2 },
  { id: 'p17', category: 'profession', name: 'Пожарный', description: 'Специалист по чрезвычайным ситуациям', dangerLevel: 3 },
  { id: 'p18', category: 'profession', name: 'Учитель', description: 'Умеет обучать и передавать знания', dangerLevel: 1 },
  { id: 'p19', category: 'profession', name: 'Музыкант', description: 'Творит музыку, поднимает настроение', dangerLevel: 1 },
  { id: 'p20', category: 'profession', name: 'Художник', description: 'Создаёт art, может документировать события', dangerLevel: 1 },
];

export const bioCards: Card[] = [
  { id: 'b1', category: 'bio', name: 'Мужчина, 25 лет', description: 'Молодой мужчина, полон сил', dangerLevel: 1 },
  { id: 'b2', category: 'bio', name: 'Женщина, 30 лет', description: 'Женщина в расцвете сил', dangerLevel: 1 },
  { id: 'b3', category: 'bio', name: 'Мужчина, 45 лет', description: 'Опытный мужчина средних лет', dangerLevel: 2 },
  { id: 'b4', category: 'bio', name: 'Женщина, 50 лет', description: 'Зрелая женщина с жизненным опытом', dangerLevel: 2 },
  { id: 'b5', category: 'bio', name: 'Мужчина, 65 лет', description: 'Пожилой мужчина, мудрый', dangerLevel: 3 },
  { id: 'b6', category: 'bio', name: 'Женщина, 22 года', description: 'Молодая девушка', dangerLevel: 1 },
  { id: 'b7', category: 'bio', name: 'Мужчина, 35 лет', description: 'Мужчина в самом расцвете', dangerLevel: 1 },
  { id: 'b8', category: 'bio', name: 'Женщина, 40 лет', description: 'Женщина средних лет', dangerLevel: 2 },
  { id: 'b9', category: 'bio', name: 'Мужчина, 55 лет', description: 'Зрелый мужчина', dangerLevel: 2 },
  { id: 'b10', category: 'bio', name: 'Женщина, 28 лет', description: 'Молодая женщина', dangerLevel: 1 },
  { id: 'b11', category: 'bio', name: 'Мужчина, 70 лет', description: 'Пожилой мужчина', dangerLevel: 3 },
  { id: 'b12', category: 'bio', name: 'Женщина, 60 лет', description: 'Пожилая женщина', dangerLevel: 3 },
];

export const healthCards: Card[] = [
  { id: 'h1', category: 'health', name: 'Идеально здоров', description: 'Отличное здоровье, никаких проблем', dangerLevel: 1 },
  { id: 'h2', category: 'health', name: 'Простуда', description: 'Лёгкое заболевание, скоро пройдёт', dangerLevel: 1 },
  { id: 'h3', category: 'health', name: 'Грипп', description: 'Серьёзное заболевание, требует лечения', dangerLevel: 2 },
  { id: 'h4', category: 'health', name: 'Перелом руки', description: 'Сломанная рука, ограничивает движения', dangerLevel: 3 },
  { id: 'h5', category: 'health', name: 'Диабет', description: 'Хроническое заболевание, требует инсулина', dangerLevel: 3 },
  { id: 'h6', category: 'health', name: 'Астма', description: 'Хроническое заболевание лёгких', dangerLevel: 2 },
  { id: 'h7', category: 'health', name: 'Болезнь сердца', description: 'Серьёзное сердечное заболевание', dangerLevel: 4 },
  { id: 'h8', category: 'health', name: 'Мигрень', description: 'Сильные головные боли', dangerLevel: 2 },
  { id: 'h9', category: 'health', name: 'Аллергия', description: 'Аллергическая реакция на некоторые вещества', dangerLevel: 2 },
  { id: 'h10', category: 'health', name: 'Артрит', description: 'Болезнь суставов', dangerLevel: 3 },
  { id: 'h11', category: 'health', name: 'Варикоз', description: 'Проблемы с венами', dangerLevel: 2 },
  { id: 'h12', category: 'health', name: 'Диарея', description: 'Расстройство желудка', dangerLevel: 2 },
  { id: 'h13', category: 'health', name: 'Туберкулёз', description: 'Серьёзное инфекционное заболевание', dangerLevel: 4 },
  { id: 'h14', category: 'health', name: 'Гепатит', description: 'Вирусное заболевание печени', dangerLevel: 4 },
  { id: 'h15', category: 'health', name: 'Бессонница', description: 'Проблемы со сном', dangerLevel: 2 },
];

export const hobbyCards: Card[] = [
  { id: 'ho1', category: 'hobby', name: 'Чтение', description: 'Любит читать книги', dangerLevel: 1 },
  { id: 'ho2', category: 'hobby', name: 'Спорт', description: 'Занимается спортом регулярно', dangerLevel: 1 },
  { id: 'ho3', category: 'hobby', name: 'Музыка', description: 'Играет на музыкальных инструментах', dangerLevel: 1 },
  { id: 'ho4', category: 'hobby', name: 'Готовка', description: 'Любит готовить', dangerLevel: 1 },
  { id: 'ho5', category: 'hobby', name: 'Охота', description: 'Опытный охотник', dangerLevel: 2 },
  { id: 'ho6', category: 'hobby', name: 'Рыбалка', description: 'Умеет ловить рыбу', dangerLevel: 1 },
  { id: 'ho7', category: 'hobby', name: 'Выживание', description: 'Навыки выживания в дикой природе', dangerLevel: 2 },
  { id: 'ho8', category: 'hobby', name: 'Шитьё', description: 'Умеет шить и ремонтировать одежду', dangerLevel: 1 },
  { id: 'ho9', category: 'hobby', name: 'Садоводство', description: 'Выращивает растения', dangerLevel: 1 },
  { id: 'ho10', category: 'hobby', name: 'Фотография', description: 'Увлекается фотографией', dangerLevel: 1 },
  { id: 'ho11', category: 'hobby', name: 'Шахматы', description: 'Стратегическое мышление', dangerLevel: 1 },
  { id: 'ho12', category: 'hobby', name: 'Коллекционирование', description: 'Коллекционирует разные вещи', dangerLevel: 1 },
  { id: 'ho13', category: 'hobby', name: 'БДСМ', description: 'Имеет специфические предпочтения', dangerLevel: 2 },
  { id: 'ho14', category: 'hobby', name: 'Пение', description: 'Любит петь', dangerLevel: 1 },
  { id: 'ho15', category: 'hobby', name: 'Танцы', description: 'Умеет танцевать', dangerLevel: 1 },
];

export const phobiaCards: Card[] = [
  { id: 'ph1', category: 'phobia', name: 'Нет фобии', description: 'Ничего не боится', dangerLevel: 1 },
  { id: 'ph2', category: 'phobia', name: 'Арахнофобия', description: 'Боязнь пауков', dangerLevel: 2 },
  { id: 'ph3', category: 'phobia', name: 'Клаустрофобия', description: 'Боязнь замкнутых пространств', dangerLevel: 3 },
  { id: 'ph4', category: 'phobia', name: 'Трипофобия', description: 'Боязнь отверстий', dangerLevel: 2 },
  { id: 'ph5', category: 'phobia', name: 'Гилофобия', description: 'Боязнь леса, заблудиться', dangerLevel: 3 },
  { id: 'ph6', category: 'phobia', name: 'Гиерофобия', description: 'Боязнь предметов религиозного культа', dangerLevel: 2 },
  { id: 'ph7', category: 'phobia', name: 'Акрофобия', description: 'Боязнь высоты', dangerLevel: 2 },
  { id: 'ph8', category: 'phobia', name: 'Гемофобия', description: 'Боязнь крови', dangerLevel: 3 },
  { id: 'ph9', category: 'phobia', name: 'Некрофобия', description: 'Боязнь мёртвых', dangerLevel: 3 },
  { id: 'ph10', category: 'phobia', name: 'Агорафобия', description: 'Боязнь открытых пространств', dangerLevel: 3 },
  { id: 'ph11', category: 'phobia', name: 'Кинофобия', description: 'Боязнь собак', dangerLevel: 2 },
  { id: 'ph12', category: 'phobia', name: 'Орнитофобия', description: 'Боязнь птиц', dangerLevel: 2 },
  { id: 'ph13', category: 'phobia', name: 'Мизофобия', description: 'Боязнь грязи и микробов', dangerLevel: 3 },
  { id: 'ph14', category: 'phobia', name: 'Электрофобия', description: 'Боязнь электричества', dangerLevel: 2 },
  { id: 'ph15', category: 'phobia', name: 'Танатофобия', description: 'Боязнь смерти', dangerLevel: 4 },
];

export const infoCards: Card[] = [
  { id: 'i1', category: 'info', name: 'Рос в семье геологов', description: 'Знает о камнях и минералах', dangerLevel: 1 },
  { id: 'i2', category: 'info', name: 'Серьёзно задумывается о суициде', description: 'Психически нестабилен', dangerLevel: 4 },
  { id: 'i3', category: 'info', name: 'Знает 5 языков', description: 'Может общаться с разными людьми', dangerLevel: 1 },
  { id: 'i4', category: 'info', name: 'Бывший заключённый', description: 'Имел проблемы с законом', dangerLevel: 3 },
  { id: 'i5', category: 'info', name: 'Пережил катастрофу', description: 'Имеет опыт выживания', dangerLevel: 2 },
  { id: 'i6', category: 'info', name: 'Работал в шахте', description: 'Знает подземные работы', dangerLevel: 2 },
  { id: 'i7', category: 'info', name: 'Вырос в деревне', description: 'Знает сельскую жизнь', dangerLevel: 1 },
  { id: 'i8', category: 'info', name: 'Был в секте', description: 'Имеет странные убеждения', dangerLevel: 3 },
  { id: 'i9', category: 'info', name: 'Пережил войну', description: 'Видел ужасы войны', dangerLevel: 3 },
  { id: 'i10', category: 'info', name: 'Работал на стройке', description: 'Физически вынослив', dangerLevel: 1 },
];

export const knowledgeCards: Card[] = [
  { id: 'k1', category: 'knowledge', name: 'Координаты бункера с собакой', description: 'Знает где есть бункер с собакой', dangerLevel: 2 },
  { id: 'k2', category: 'knowledge', name: 'Координаты военной базы', description: 'Знает расположение военной базы', dangerLevel: 2 },
  { id: 'k3', category: 'knowledge', name: 'Координаты склада с оружием', description: 'Знает где оружие', dangerLevel: 3 },
  { id: 'k4', category: 'knowledge', name: 'Координаты больницы', description: 'Знает где медикаменты', dangerLevel: 2 },
  { id: 'k5', category: 'knowledge', name: 'Координаты продуктового склада', description: 'Знает где еда', dangerLevel: 1 },
  { id: 'k6', category: 'knowledge', name: 'Знает карту подземных туннелей', description: 'Знает пути отхода', dangerLevel: 2 },
  { id: 'k7', category: 'knowledge', name: 'Знает безопасные маршруты', description: 'Может провести безопасно', dangerLevel: 2 },
  { id: 'k8', category: 'knowledge', name: 'Знает радиочастоты', description: 'Может связаться по рации', dangerLevel: 2 },
  { id: 'k9', category: 'knowledge', name: 'Знает место, где нет радиации', description: 'Знает безопасную зону', dangerLevel: 3 },
  { id: 'k10', category: 'knowledge', name: 'Знает группу выживших', description: 'Знает где другие люди', dangerLevel: 2 },
];

export const bagageCards: Card[] = [
  { id: 'bg1', category: 'bagage', name: 'Хирургические инструменты', description: 'Профессиональные инструменты для операций', dangerLevel: 2 },
  { id: 'bg2', category: 'bagage', name: 'Набор альпиниста', description: 'Снаряжение для скалолазания', dangerLevel: 1 },
  { id: 'bg3', category: 'bagage', name: 'Театральный грим', description: 'Может изменить внешность', dangerLevel: 1 },
  { id: 'bg4', category: 'bagage', name: 'Аптечка', description: 'Лекарства и перевязочные материалы', dangerLevel: 1 },
  { id: 'bg5', category: 'bagage', name: 'Рация', description: 'Средство связи', dangerLevel: 1 },
  { id: 'bg6', category: 'bagage', name: 'Фонарик', description: 'Освещение в темноте', dangerLevel: 1 },
  { id: 'bg7', category: 'bagage', name: 'Нож', description: 'Оружие и инструмент', dangerLevel: 2 },
  { id: 'bg8', category: 'bagage', name: 'Сумка', description: 'Увеличивает переносимый груз', dangerLevel: 1 },
  { id: 'bg9', category: 'bagage', name: 'Рюкзак', description: 'Больше места для вещей', dangerLevel: 1 },
  { id: 'bg10', category: 'bagage', name: 'Дозиметр', description: 'Измеряет радиацию', dangerLevel: 1 },
  { id: 'bg11', category: 'bagage', name: 'Одеяло', description: 'Защита от холода', dangerLevel: 1 },
  { id: 'bg12', category: 'bagage', name: 'Консервы', description: 'Запас еды', dangerLevel: 1 },
  { id: 'bg13', category: 'bagage', name: 'Вода', description: 'Запас воды', dangerLevel: 1 },
  { id: 'bg14', category: 'bagage', name: 'Камера', description: 'Может записывать и фотографировать', dangerLevel: 1 },
  { id: 'bg15', category: 'bagage', name: 'Детектор лжи', description: 'Может определять правду', dangerLevel: 2 },
];

export const actionCards: Card[] = [
  { id: 'a1', category: 'action', name: 'Вскрыть две характеристики', description: 'Можно вскрыть две характеристики любого игрока за один ход', dangerLevel: 1 },
  { id: 'a2', category: 'action', name: 'Отменить карту', description: 'Отмените последнюю карту действия или условия', dangerLevel: 1 },
  { id: 'a3', category: 'action', name: 'Открыть комнату', description: 'Комната на ваш выбор становится открытой и оборудованной', dangerLevel: 1 },
  { id: 'a4', category: 'action', name: 'Защита', description: 'Можно защитить игрока от изгнания один раз', dangerLevel: 1 },
  { id: 'a5', category: 'action', name: 'Обмен', description: 'Поменяйте одну свою карту с другим игроком', dangerLevel: 1 },
  { id: 'a6', category: 'action', name: 'Подсказка', description: 'Узнайте один предмет, решающий текущую угрозу', dangerLevel: 1 },
];

export const conditionCards: Card[] = [
  { id: 'c1', category: 'condition', name: 'Камикадзе', description: 'При изгнании заберите с собой одного игрока', dangerLevel: 5 },
  { id: 'c2', category: 'condition', name: 'Крысы', description: 'При вашем изгнании в бункере заведутся вредители', dangerLevel: 3 },
  { id: 'c3', category: 'condition', name: 'Голос возмездия', description: 'При изгнании ваш голос против кого-то остаётся навсегда', dangerLevel: 4 },
  { id: 'c4', category: 'condition', name: 'Странный', description: 'При изгнании все узнают вашу тайну', dangerLevel: 3 },
  { id: 'c5', category: 'condition', name: 'Бомба', description: 'При изгнании таймер начинает обратный отсчёт', dangerLevel: 4 },
  { id: 'c6', category: 'condition', name: 'Двойник', description: 'При изгнании один игрок случайно становится вашим клоном', dangerLevel: 3 },
];

export const threats: Card[] = [
  { id: 't1', category: 'threat', name: 'Утечка газа', description: 'В бункере обнаружена утечка смертельного газа', dangerLevel: 4, dangerLevel: 4 },
  { id: 't2', category: 'threat', name: 'Прорыв воды', description: 'Вода начинает затапливать бункер', dangerLevel: 3 },
  { id: 't3', category: 'threat', name: 'Радиация', description: 'Уровень радиации резко повысился', dangerLevel: 4 },
  { id: 't4', category: 'threat', name: 'Пожар', description: 'Начался пожар в вентиляционной системе', dangerLevel: 4 },
  { id: 't5', category: 'threat', name: 'Зомби', description: 'Заражённый проник в бункер', dangerLevel: 5 },
  { id: 't6', category: 'threat', name: 'Бунт', description: 'Игроки начинают конфликтовать', dangerLevel: 3 },
  { id: 't7', category: 'threat', name: 'Эпидемия', description: 'Болезнь распространяется среди игроков', dangerLevel: 4 },
  { id: 't8', category: 'threat', name: 'Нехватка воздуха', description: 'Вентиляция сломалась', dangerLevel: 5 },
  { id: 't9', category: 'threat', name: 'Вторжение', description: 'Чужие пытаются проникнуть в бункер', dangerLevel: 4 },
  { id: 't10', category: 'threat', name: 'Крысы', description: 'Крысы расплодились и атакуют', dangerLevel: 2 },
];

export const allCards: Card[] = [
  ...professions,
  ...bioCards,
  ...healthCards,
  ...hobbyCards,
  ...phobiaCards,
  ...infoCards,
  ...knowledgeCards,
  ...bagageCards,
  ...actionCards,
  ...conditionCards,
];

export function getRandomCards(count: number, categories?: string[]): Card[] {
  let pool = categories 
    ? allCards.filter(c => categories.includes(c.category))
    : [...allCards];
  
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}