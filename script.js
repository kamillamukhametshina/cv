const heroCluster = document.getElementById("hero-cluster");
const projectModal = document.getElementById("project-modal");
const projectWindowTemplate = projectModal?.querySelector(".project-window-template");
const mapScene = document.querySelector(".map-scene");
let projectWindowZ = 300;
const EXTERNAL_PROJECT_LINKS = {
  "project-telegram": "https://t.me/kamillamukhametshina",
  "project-cv": "https://drive.google.com/file/d/1BIQqj-1_1hxqpHU8X1pwsX6JppOlyj6-/view?usp=sharing",
};

function openExternalProject(projectId) {
  const url = EXTERNAL_PROJECT_LINKS[projectId];
  if (!url) {
    return false;
  }

  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}

function clearDesktopIconFocus() {
  document.querySelectorAll(".desktop-icon").forEach((icon) => {
    if (icon instanceof HTMLElement) {
      icon.blur();
      icon.classList.remove("is-hovered");
    }
  });
}

function fixWidows(text) {
  if (typeof text !== "string") {
    return text;
  }

  // Привязываем короткие слова к следующему слову, чтобы не было висячих предлогов/союзов.
  const shortWordPattern =
    /(^|[\s\u00A0])((?:[Вв]|[Кк]|[Сс]|[Уу]|[Оо]|[Ии]|[Аа]|[Вв]о|[Нн]а|[Зз]а|[Пп]о|[Ии]з|[Оо]т|[Дд]о|[Бб]ез|[Дд]ля|[Пп]од|[Нн]ад|[Оо]б|[Оо]бо|[Пп]ри|[Пп]ро|[Кк]о|[Сс]о|[Нн]о|[Нн]и))( )(?=\S)/g;
  const widowsFixed = text.replace(shortWordPattern, "$1$2\u00A0");
  // Типографские кавычки-елочки: "текст" -> «текст»
  return widowsFixed.replace(/"([^"]+)"/g, "«$1»");
}

const projectContent = {
  r7: {
    title: "Информация о: R7MINER",
    name: "R7MINER",
    company: "Майнинговая компания (топ-5) / 2025-2026",
    intro:
      "Развивала event-направление компании: вела участие в отраслевых выставках, запускала клиентские мероприятия и собирала спецпроекты под бизнес-задачи.",
    metrics:
      "5 выставок → 3 клиентских мероприятия → 50 VIP-подарков за 30 дней → 10+ подрядчиков в координации",
    detailItems: [
      "Вела проекты полного цикла: от идеи и концепции до реализации и пост-аналитики.",
      "Организовала участие компании в крупных отраслевых выставках, включая международные площадки (The Trends, Blockchain Forum Dubai, Crypto Summit и т.д.).",
      "Координировала застройку стендов, подрядчиков, логистику и тайминг мероприятий.",
      "Работала с внутренними командами: маркетинг, продажи, руководство, спикеры.",
      "Готовила презентации, клиентские материалы и сопровождала коммуникацию с гостями.",
      "Запустила проект новогодних подарков для клиентов: концепция, производство, упаковка и логистика 50 комплектов за месяц.",
      "Оптимизировала подготовку мероприятий с использованием AI-инструментов.",
    ],
    thumb: "./assets/career-r7miner.svg",
    preview: "./assets/r7miner/r7-01-wide.jpg",
    gallery: [
      { src: "./assets/r7miner/r7-01-wide.jpg", layout: "full" },
      { src: "./assets/r7miner/r7-pair-01.jpg" },
      { src: "./assets/r7miner/r7-pair-02.jpg" },
      { src: "./assets/r7miner/r7-gif-01.gif", layout: "full" },
      { src: "./assets/r7miner/r7-single-02.jpg", layout: "full" },
      { src: "./assets/r7miner/r7-gif-02.gif", layout: "full" },
      { src: "./assets/r7miner/r7-pair-03.jpg" },
      { src: "./assets/r7miner/r7-pair-04.jpg" },
      { src: "./assets/r7miner/r7-gif-05.gif", layout: "pair" },
      { src: "./assets/r7miner/r7-pair-05.jpg" },
      { src: "./assets/r7miner/r7-gif-06.gif", layout: "full" },
    ],
  },
  region: {
    title: "Информация о: РЕГИОН СТАЛЬ",
    name: "РЕГИОН СТАЛЬ",
    company: "Металлоторгующая компания (топ-3 СПб / оборот 5 млрд.) / 2024-2025",
    intro:
      "Работала на стыке HR и операционного управления: выстраивала найм, адаптацию и внутренние процессы филиала в период роста команды, позже участвовала в запуске обучающей программы компании.",
    metrics:
      "Рост команды 8 → 25 сотрудников → 50+ обученных сотрудников → онбординг -30% по времени → 25+ обучающих видео за месяц",
    detailItems: [
      "Вела полный цикл найма",
      "Проводила очное обучение по продажам и продукту",
      "Внедрила HR-ботов в Telegram: ответы на частые вопросы, вводная информация и обучение",
      "Контролировала административные процессы филиала",
      "Смонтировала 20+ видео средней длительностью 25 минут за месяц",
      "Собрала единый визуальный стиль видеокурса",
    ],
    thumb: "./assets/career-region-stal.svg",
    preview: "./assets/region-stal/region-1.jpg",
    gallery: [
      { src: "./assets/region-stal/region-1.jpg", layout: "full" },
      { src: "./assets/region-stal/region-2.gif", layout: "pair" },
      { src: "./assets/region-stal/region-pair-extra-2.png", layout: "pair" },
      { src: "./assets/region-stal/region-pair-1-3.png", layout: "pair" },
      { src: "./assets/region-stal/region-pair-2-3.gif", layout: "pair" },
      { src: "./assets/region-stal/region-5.gif", layout: "full" },
      { src: "./assets/region-stal/region-6.gif", layout: "full" },
      { src: "./assets/region-stal/region-7.gif?v=20260418-2", layout: "full" },
      { src: "./assets/region-stal/region-8.gif", layout: "full" },
    ],
  },
  newmedia: {
    title: "Информация о: NEW MEDIA LAB",
    name: "NEW MEDIA LAB",
    company: "Рекламное агентство (стартап) / 2021-2023",
    intro:
      "Развивала студенческое рекламное агентство: выстроила визуальный язык, наладила процессы команды и участвовала в запуске кейс-чемпионата.",
    metrics:
      "400+ диджитал материалов → 100+ привлеченных участников → 20+ макетов на печать → 2 сайта → 1 гайдлайн",
    detailItems: [
      "Разработала логотип и визуальную систему агентства",
      "Создавала контент для соцсетей, оформила сайт и digital-материалы",
      "Инициировала и внедрила систему работы команды: роли, процессы, публикации, ответственность",
      "Координировала дизайнеров, копирайтеров и таргетологов",
      "Разработала айдентику кейс-чемпионата за одну ночь",
    ],
    thumb: "./assets/career-new-media-lab.svg",
    preview: "./assets/nml/nml-1.png",
    gallery: [
      { src: "./assets/nml/nml-1.png", layout: "full" },
      { src: "./assets/nml/nml-2.png", layout: "full" },
      { src: "./assets/nml/nml-3.gif", layout: "full" },
      { src: "./assets/nml/nml-4.png", layout: "pair" },
      { src: "./assets/nml/nml-5.png", layout: "pair" },
      { src: "./assets/nml/nml-6.png", layout: "full" },
      { src: "./assets/nml/nml-7.png", layout: "full" },
      { src: "./assets/nml/nml-8.png", layout: "full" },
      { src: "./assets/nml/nml-9.gif", layout: "full" },
      {
        type: "card",
        title: "Media Case Club",
        subtitle: "Айдентика за одну ночь",
        text: "Организация кейс-чемпионата и запуск визуальной системы проекта",
      },
      { src: "./assets/nml/mcc/mcc-1.png", layout: "full" },
      { src: "./assets/nml/mcc/mcc-2.png", layout: "full" },
      { src: "./assets/nml/mcc/mcc-3a.png", layout: "pair" },
      { src: "./assets/nml/mcc/mcc-3b.png", layout: "pair" },
      { src: "./assets/nml/mcc/mcc-4.png", layout: "full" },
      { src: "./assets/nml/mcc/mcc-5.png", layout: "full" },
      { src: "./assets/nml/mcc/mcc-6.jpg", layout: "full" },
      { src: "./assets/nml/mcc/mcc-7.gif", layout: "full" },
      { src: "./assets/nml/mcc/mcc-8.jpg", layout: "full" },
      { src: "./assets/nml/mcc/mcc-9.gif", layout: "full" },
    ],
  },
  fresh: {
    title: "Информация о: FRESH AUTO",
    name: "FRESH AUTO",
    company: "Автомобильный маркетплейс (топ-3)",
    intro:
      "Работала in-house дизайнером в крупной компании: вела визуальные задачи для бренда и подразделений, запускала материалы для внутренних и внешних коммуникаций.",
    metrics:
      "20+ макетов к печати → 20+ шаблонов презентаций → 1 бренд-проект подразделения → участие в ребрендинге коллаборации",
    detailItems: [
      "Самостоятельно вела проект по созданию системы шаблонов презентаций для всех отделов компании",
      "Разрабатывала печатные материалы: баннеры, POS-материалы, носители для офлайн-задач",
      "Создавала дизайн корпоративного мерча",
      "Разрабатывала визуалы для оклейки автомобилей",
      "Обновляла визуальную концепцию подразделения Fresh Service: коммуникация, носители, единый стиль",
      "Участвовала в доработке визуальных материалов для Fresh x Dubrovskiy Syndicate",
    ],
    thumb: "./assets/career-fresh-auto.svg",
    preview: "./assets/fresh/fresh-1.png",
    gallery: [
      { src: "./assets/fresh/fresh-1.png", layout: "full" },
      { src: "./assets/fresh/fresh-2.png", layout: "full" },
      { src: "./assets/fresh/fresh-3.gif", layout: "full" },
      { src: "./assets/fresh/fresh-4.png", layout: "full" },
      { src: "./assets/fresh/fresh-5.png", layout: "full" },
      { src: "./assets/fresh/fresh-6.png", layout: "full" },
      { src: "./assets/fresh/fresh-7.png", layout: "full" },
      { src: "./assets/fresh/fresh-8.png", layout: "full" },
      { src: "./assets/fresh/fresh-9.gif", layout: "full" },
    ],
  },
  rassvet: {
    title: "Информация о: ВК ЗНАКОМСТВА",
    name: "ВК ЗНАКОМСТВА",
    company: "Сервис знакомств",
    intro:
      "Работала хелпером на съемках креатива. Пересобирала пресс, помогала с реквизитом.",
    hideMetrics: true,
    hideDetails: true,
    thumb: "./assets/icon-vk-znakomstva.svg",
    preview: "./assets/vk-znakomstva/vk-1.gif",
    gallery: [
      { src: "./assets/vk-znakomstva/vk-1.gif", layout: "full" },
      { src: "./assets/vk-znakomstva/vk-pair-2-left.jpg", layout: "pair" },
      { src: "./assets/vk-znakomstva/vk-pair-2-right.jpg", layout: "pair" },
      { src: "./assets/vk-znakomstva/vk-pair-3-left.jpg", layout: "pair" },
      { src: "./assets/vk-znakomstva/vk-pair-3-right.jpg", layout: "pair" },
      { src: "./assets/vk-znakomstva/vk-4.jpg", layout: "full" },
    ],
  },
  sence: {
    title: "Информация о: SENCE",
    name: "SENCE",
    company: "Бутик-агентство полного цикла (стажировка) / 2023",
    intro:
      "Занималась оценкой SMM и дизайн-концепциями. Монтировала рилсы, делала дизайн для соцсетей. Один из рилсов, смонтированный мной, набрал 54к просмотров!",
    hideMetrics: true,
    hideDetails: true,
    thumb: "./assets/icon-project-sence.png",
    preview: "./assets/sence/sence-pair-1-left.png",
    gallery: [
      { src: "./assets/sence/sence-pair-1-left.png", layout: "pair" },
      { src: "./assets/sence/sence-pair-1-right.png", layout: "pair" },
      { src: "./assets/sence/sence-pair-2-left.png", layout: "pair" },
      { src: "./assets/sence/sence-pair-2-right.gif", layout: "pair" },
      { src: "./assets/sence/sence-pair-3-left.gif", layout: "pair" },
      { src: "./assets/sence/sence-pair-3-right.png", layout: "pair" },
      { src: "./assets/sence/sence-pair-4-left.png", layout: "pair" },
      { src: "./assets/sence/sence-pair-4-right.png", layout: "pair" },
      { src: "./assets/sence/sence-5.gif", layout: "full" },
    ],
  },
  bitrix: {
    title: "Информация о: BITRIX.24",
    name: "Bitrix.24",
    company: "CRM-система",
    intro:
      "Работала с презентациями для Bitrix24. Собрала визуальный нарратив через AI-персонажа, который сопровождал историю на каждом слайде. Разработано более 50+ версий пресонажа",
    hideMetrics: true,
    hideDetails: true,
    thumb: "./assets/project-bitrix.svg",
    preview: "./assets/bitrix/slider-1/1.png",
    gallery: [
      { type: "slider", group: 0 },
      { type: "slider", group: 1 },
      {
        type: "text-card",
        text:
          "Генерация видео сцены из фильма «Иллюзия обмана» с заменой лица",
      },
      { src: "./assets/bitrix/bitrix-face-swap.gif", layout: "full" },
    ],
    sliders: [
      [
        "./assets/bitrix/slider-1/1.png",
        "./assets/bitrix/slider-1/2.png",
        "./assets/bitrix/slider-1/3.png",
        "./assets/bitrix/slider-1/4.png",
        "./assets/bitrix/slider-1/5.png",
        "./assets/bitrix/slider-1/6.png",
        "./assets/bitrix/slider-1/7.png",
        "./assets/bitrix/slider-1/8.png",
        "./assets/bitrix/slider-1/9.png",
        "./assets/bitrix/slider-1/10.png",
        "./assets/bitrix/slider-1/11.png",
        "./assets/bitrix/slider-1/12.png",
        "./assets/bitrix/slider-1/13.png",
        "./assets/bitrix/slider-1/14.png",
        "./assets/bitrix/slider-1/15.png",
        "./assets/bitrix/slider-1/16.png",
        "./assets/bitrix/slider-1/17.png",
      ],
      [
        "./assets/bitrix/slider-2/1.png",
        "./assets/bitrix/slider-2/2.png",
        "./assets/bitrix/slider-2/3.png",
        "./assets/bitrix/slider-2/4.png",
        "./assets/bitrix/slider-2/5.png",
        "./assets/bitrix/slider-2/6.png",
        "./assets/bitrix/slider-2/7.png",
        "./assets/bitrix/slider-2/8.png",
        "./assets/bitrix/slider-2/9.png",
        "./assets/bitrix/slider-2/10.png",
      ],
    ],
  },
  citydrive: {
    title: "Информация о: СИТИДРАЙВ",
    name: "СИТИДРАЙВ",
    company: "Каршеринг",
    intro:
      "Работала над influencer-рассылкой для Ситидрайва: персонализированные открытки, печатная подготовка и доставка подарков.",
    hideMetrics: true,
    hideDetails: true,
    thumb: "./assets/project-citydrive.svg",
    preview: "./assets/citydrive/citydrive-1.png",
    gallery: [
      { src: "./assets/citydrive/citydrive-1.png", layout: "full" },
      { src: "./assets/citydrive/citydrive-2.png", layout: "full" },
      { src: "./assets/citydrive/citydrive-3.jpg", layout: "full" },
    ],
  },
  phoenix: {
    title: "Информация о: ФЕНИКС ОНЛАЙН",
    name: "ФЕНИКС ОНЛАЙН",
    company: "Телевизионное агентство",
    intro:
      "Работала с телевизионным агентством «Феникс Онлайн»: создавала визуальный контент для соцсетей и адаптировала материалы под быстрый медиаритм публикаций",
    hideMetrics: true,
    hideDetails: true,
    thumb: "./assets/icon-project-phoenix.png",
    preview: "./assets/phoenix/phoenix-1.png",
    gallery: [
      { src: "./assets/phoenix/phoenix-1.png", layout: "full" },
      { src: "./assets/phoenix/phoenix-pair-2-left.png", layout: "pair" },
      { src: "./assets/phoenix/phoenix-pair-2-right.png", layout: "pair" },
      { src: "./assets/phoenix/phoenix-3.png", layout: "full" },
      { src: "./assets/phoenix/phoenix-pair-4-left.png", layout: "pair" },
      { src: "./assets/phoenix/phoenix-pair-4-right.png", layout: "pair" },
    ],
  },
  "edu-bbe": {
    title: "Информация о: Bang Bang Education",
    name: "Bang Bang Education",
    intro:
      "Изучала дизайн как широкую дисциплину: UX-исследования, графический дизайн, айдентика и визуальное мышление.",
    hideMeta: true,
    hideMetrics: true,
    hideDetails: true,
    hideGallery: true,
    thumb: "./assets/edu-bbe.svg",
  },
  "edu-bitrix": {
    title: "Информация о: Bitrix24",
    name: "Bitrix24",
    intro:
      "Изучала vibe-coding и современные no-code / AI-подходы к созданию цифровых продуктов. На практике собрала собственный сайт и несколько пилотных проектов.",
    hideMeta: true,
    hideMetrics: true,
    hideDetails: true,
    hideGallery: true,
    thumb: "./assets/edu-bitrix.svg",
  },
  "edu-mads": {
    title: "Информация о: Mads",
    name: "Mads",
    intro:
      "Креативный воркшоп в коллаборации с Яндекс Маркетом. Работала с генерацией идей, брейнштормингом и созданием рекламных концепций.",
    hideMeta: true,
    hideMetrics: true,
    hideDetails: true,
    hideGallery: true,
    thumb: "./assets/icon-edu-mads.jpeg",
  },
  "edu-egor": {
    title: "Информация о: Егор Панковский",
    name: "Егор Панковский",
    intro:
      "Изучала монтаж видео как систему: ритм, звук, цвет, композиция кадра и типографику. Работала в Adobe Premiere Pro.",
    hideMeta: true,
    hideMetrics: true,
    hideDetails: true,
    hideGallery: true,
    thumb: "./assets/icon-edu-egor.jpeg",
  },
  "edu-tatiana": {
    title: "Информация о: Татьяна Щелокова",
    name: "Татьяна Щелокова",
    intro:
      "Обучение ретуши и цветокоррекции. Работала с деталями изображения, светом, кожей и финальной визуальной чистотой кадра.",
    hideMeta: true,
    hideMetrics: true,
    hideDetails: true,
    hideGallery: true,
    thumb: "./assets/icon-edu-tatiana.jpeg",
  },
  "edu-ohdschool": {
    title: "Информация о: Ohdschool",
    name: "Ohdschool",
    intro:
      "Обучение веб-дизайну: проектирование сайтов, визуальные системы, сборка и верстка на Tilda, работа со сложной анимацией.",
    hideMeta: true,
    hideMetrics: true,
    hideDetails: true,
    hideGallery: true,
    thumb: "./assets/icon-edu-ohdschool.jpeg",
  },
  "edu-cherkasov": {
    title: "Информация о: cherkasov.co",
    name: "cherkasov.co",
    intro:
      "Плакатный воркшоп о композиции, визуальной иерархии и типографике. Работала с формой, ритмом и выразительностью сообщения через постерный формат.",
    hideMeta: true,
    hideMetrics: true,
    hideDetails: true,
    hideGallery: true,
    thumb: "./assets/icon-edu-cherkasov.jpeg",
  },
  "edu-mikhail": {
    title: "Информация о: Михаил Гребенюк",
    name: "Михаил Гребенюк",
    intro:
      "Изучала системный подход к HR и продажам: найм, структура отдела, мотивация, управление результатом и коммерческое мышление.",
    hideMeta: true,
    hideMetrics: true,
    hideDetails: true,
    hideGallery: true,
    thumb: "./assets/icon-edu-mikhail.jpeg",
  },
  "edu-liza": {
    title: "Информация о: Лиза Ланглиб",
    name: "Лиза Ланглиб",
    intro:
      "Наставничество на стыке HR, бизнес-процессов и личного развития. Разрабатывали совместный проект «Душевный эйчар».",
    hideMeta: true,
    hideMetrics: true,
    hideDetails: true,
    hideGallery: true,
    thumb: "./assets/icon-edu-liza.jpeg",
  },
  "project-reklama": {
    title: "Информация о: РЕКЛАМА / КОНКУРС",
    name: "Реклама / конкурс",
    company:
      "Культурно-образовательный проект Финансового Университета при Правительстве РФ",
    intro:
      "Переосмыслили digital-образ бренда 29DI: собрали новую визуальную систему, контент для соцсетей и рекламный ролик. Проект получил 1 место.",
    metricsTitle: "В цифрах",
    metrics:
      "1 место → 15+ анимированных иллюстраций → Telegram-стикерпак → рекламный ролик полного цикла",
    hideDetails: true,
    thumb: "./assets/project-reklama.jpg",
    preview: "./assets/project-reklama.jpg",
    gallery: [
      { src: "./assets/reklama-contest/reklama-pair-1-left.png", layout: "pair" },
      { src: "./assets/reklama-contest/reklama-pair-1-right.png", layout: "pair" },
      { src: "./assets/reklama-contest/reklama-pair-2-left.png", layout: "pair" },
      { src: "./assets/reklama-contest/reklama-pair-2-right.png", layout: "pair" },
      { src: "./assets/reklama-contest/reklama-3.gif", layout: "full" },
      {
        src: "https://media.githubusercontent.com/media/kamillamukhametshina/cv/main/assets/reklama-contest/reklama-pair-4-left.mp4",
        layout: "pair",
      },
      {
        src: "https://media.githubusercontent.com/media/kamillamukhametshina/cv/main/assets/reklama-contest/reklama-pair-4-right.mp4",
        layout: "pair",
      },
      {
        src: "https://media.githubusercontent.com/media/kamillamukhametshina/cv/main/assets/reklama-contest/reklama-pair-5-left.mp4",
        layout: "pair",
      },
      {
        src: "https://media.githubusercontent.com/media/kamillamukhametshina/cv/main/assets/reklama-contest/reklama-pair-5-right.mp4",
        layout: "pair",
      },
      { src: "./assets/reklama-contest/reklama-6.png", layout: "full" },
      {
        src: "https://media.githubusercontent.com/media/kamillamukhametshina/cv/main/assets/reklama-contest/reklama-7.mp4",
        layout: "full",
        player: true,
      },
    ],
  },
  "project-mediacase": {
    title: "Информация о: MEDIA CASE CLUB / КОНКУРС",
    name: "MEDIA CASE CLUB / КОНКУРС",
    company: "Для 2050.lab — национального центра промышленного дизайна и инноваций.",
    intro:
      "Собрали стратегию digital-присутствия для 2050.lab: от глубокой аналитики рынка до визуальной системы контента и креативных механик продвижения. Проект занял 2 место.",
    hideMetrics: true,
    hideDetails: true,
    thumb: "./assets/icon-media-case-contest.svg",
    preview: "./assets/mcc-contest/mcc-1.gif",
    gallery: [
      { src: "./assets/mcc-contest/mcc-1.gif", layout: "full" },
      { type: "slider", group: 0 },
      { src: "./assets/mcc-contest/mcc-pair-3-left.png", layout: "pair" },
      { src: "./assets/mcc-contest/mcc-pair-3-right.png", layout: "pair" },
      { src: "./assets/mcc-contest/mcc-4.png", layout: "full" },
      { src: "./assets/mcc-contest/mcc-pair-5-left.jpg", layout: "pair" },
      { src: "./assets/mcc-contest/mcc-pair-5-right.jpg", layout: "pair" },
      { src: "./assets/mcc-contest/mcc-6.gif", layout: "full" },
    ],
    sliders: [Array.from({ length: 43 }, (_, i) => `./assets/mcc-contest/slider-2/${i + 1}.png`)],
  },
  "project-okei": {
    title: "Информация о: О’КЕЙ",
    name: "О’кей",
    company: "Сеть магазинов",
    intro: "Делала дизайн для соц сетей и готовила к печати открытки",
    hideMetrics: true,
    hideDetails: true,
    thumb: "./assets/icon-project-okei.png",
    preview: "./assets/okei/okei-1.png",
    gallery: [
      { src: "./assets/okei/okei-1.png", layout: "full" },
      { src: "./assets/okei/okei-2.png", layout: "full" },
      { src: "./assets/okei/okei-3.png", layout: "full" },
      { src: "./assets/okei/okei-4.png", layout: "full" },
    ],
  },
  "project-telegram": {
    title: "Information about: Telegram",
    name: "Telegram",
    company: "Площадка",
    intro: "Серия материалов и концептов для публикаций: дизайн карточек, визуальные рубрики и контент-подача.",
    details: "Type: Social Content > Channel Design > Visual Templates",
    thumb: "./assets/project-telegram.svg",
    preview: "./assets/project-telegram.svg",
  },
  "project-cv": {
    title: "Information about: CV",
    name: "CV",
    company: "Личный проект",
    intro: "Сборка визуального резюме в формате интерактивной mindmap-страницы с акцентом на опыт и достижения.",
    details: "Type: Personal Project > Web Design > Interaction > Portfolio",
    thumb: "./assets/icon-project-cv.png",
    preview: "./assets/icon-project-cv.png",
  },
  "project-eco": {
    title: "Информация о: ПРОИЗВОЛЬНЫЕ РАБОТЫ",
    name: "Произвольные работы",
    hideCompany: true,
    hideIntro: true,
    hideMetrics: true,
    hideDetails: true,
    thumb: "./assets/project-eco.png",
    preview: "./assets/proizvolnye/1.png",
    gallery: [
      { src: "./assets/proizvolnye/1.png", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/2.gif?v=20260429-1", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/3.png", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/4.gif?v=20260429-1", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/5.gif?v=20260429-1", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/6.png", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/7.png", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/8.png", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/9.gif?v=20260429-1", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/10.gif?v=20260429-1", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/11.png", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/13.png", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/14.gif?v=20260429-1", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/15.png", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/16.png", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/17.gif?v=20260429-1", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/18.gif?v=20260429-1", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/19.jpg", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/20.png", layout: "pair", cropFixed: true },
      { src: "./assets/proizvolnye/21.png", layout: "pair", cropFixed: true },
      {
        src: "https://media.githubusercontent.com/media/kamillamukhametshina/cv/main/assets/proizvolnye/video-22.mov",
        layout: "pair",
        player: true,
      },
      {
        src: "https://media.githubusercontent.com/media/kamillamukhametshina/cv/main/assets/proizvolnye/video-24.mp4",
        layout: "pair",
        player: true,
      },
      {
        src: "https://media.githubusercontent.com/media/kamillamukhametshina/cv/main/assets/proizvolnye/video-23.mov",
        layout: "full",
        player: true,
      },
      {
        src: "https://media.githubusercontent.com/media/kamillamukhametshina/cv/main/assets/proizvolnye/video-25.mov",
        layout: "full",
        player: true,
      },
      {
        type: "text-card",
        text: "Айдентика образовательного проекта по переработке мусора для Финансового Университета при Правительстве РФ",
      },
      { src: "./assets/proizvolnye/26/vmeste-1-1.png", layout: "pair" },
      { src: "./assets/proizvolnye/26/vmeste-2-1.png", layout: "pair" },
      { src: "./assets/proizvolnye/26/vmeste-1-2.png", layout: "pair" },
      { src: "./assets/proizvolnye/26/vmeste-2-2.png", layout: "pair" },
      { src: "./assets/proizvolnye/26/4.jpg", layout: "full" },
      { src: "./assets/proizvolnye/26/445.jpg", layout: "full" },
      { src: "./assets/proizvolnye/26/frame-32.png", layout: "full" },
      { src: "./assets/proizvolnye/26/frame-181.png", layout: "full" },
    ],
  },
};

function preloadMediaAssets() {
  const imageQueue = new Set();
  const videoQueue = new Set();

  const enqueue = (src) => {
    if (typeof src !== "string" || !src.trim()) {
      return;
    }
    if (/\.(mp4|webm|mov)(\?.*)?$/i.test(src)) {
      // Heavy videos should not preload globally: they make media-rich windows
      // feel broken before the user even scrolls to them.
      return;
    } else {
      imageQueue.add(src);
    }
  };

  Object.values(projectContent).forEach((project) => {
    enqueue(project.thumb);
    enqueue(project.preview);

    if (Array.isArray(project.gallery)) {
      project.gallery.slice(0, 4).forEach((item) => {
        if (typeof item === "string") {
          enqueue(item);
        } else if (item && typeof item === "object") {
          enqueue(item.src);
        }
      });
    }

    if (Array.isArray(project.slider)) {
      project.slider.forEach(enqueue);
    }

    if (Array.isArray(project.sliders)) {
      project.sliders.forEach((group) => {
        if (Array.isArray(group)) {
          group.forEach(enqueue);
        }
      });
    }
  });

  const preloadImage = (src) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = src;
  };

  const run = () => {
    imageQueue.forEach(preloadImage);
    videoQueue.clear();
  };

  window.setTimeout(run, 220);
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 1400 });
  } else {
    window.setTimeout(run, 900);
  }
}

preloadMediaAssets();

function loadProjectVideo(video) {
  if (!(video instanceof HTMLVideoElement)) {
    return;
  }
  if (video.dataset.loaded === "1") {
    return;
  }
  const src = video.dataset.src;
  if (!src) {
    return;
  }
  video.dataset.loaded = "1";
  video.src = src;
  video.load();
}

function setupAutoplayWhenVisible(windowElement) {
  const scrollRoot = windowElement.querySelector(".project-window-body");
  if (!scrollRoot) {
    return;
  }

  const videos = Array.from(windowElement.querySelectorAll(".project-gallery-video"));
  if (videos.length === 0) {
    return;
  }

  videos.forEach((video) => {
    const isPlayer = video.classList.contains("is-player");
    // Always start muted by default.
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.preload = "none";
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    if (isPlayer) {
      video.controls = true;
      video.loop = false;
      video.autoplay = false;
    } else {
      video.loop = true;
      video.autoplay = true;
      video.controls = false;
    }
    video.addEventListener(
      "error",
      () => {
        if (video.dataset.retryLoad === "1") {
          return;
        }
        video.dataset.retryLoad = "1";
        video.load();
      },
      { once: true }
    );
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (!(video instanceof HTMLVideoElement)) {
          return;
        }

        if (entry.isIntersecting) {
          video.dataset.wantsPlay = "1";
          loadProjectVideo(video);
          const playWhenReady = () => {
            if (video.dataset.wantsPlay !== "1") {
              return;
            }
            video.play().catch(() => {
              // Ignore autoplay blocking or codec issues on specific devices.
            });
          };
          if (video.readyState >= 2) {
            playWhenReady();
          } else {
            video.addEventListener("loadeddata", playWhenReady, { once: true });
          }
        } else if (!video.paused) {
          video.dataset.wantsPlay = "0";
          video.pause();
        } else {
          video.dataset.wantsPlay = "0";
        }
      });
    },
    {
      root: scrollRoot,
      threshold: 0.08,
      rootMargin: "420px 0px",
    }
  );

  videos.forEach((video) => observer.observe(video));
  windowElement.__videoObserver = observer;
}

function setupTapToToggleVideo(windowElement) {
  const videos = windowElement.querySelectorAll(".project-gallery-video");
  if (!videos.length) {
    return;
  }

  videos.forEach((video) => {
    video.addEventListener("click", (event) => {
      // Allow native controls tap handling first; toggle only on direct video tap.
      if (event.target !== video) {
        return;
      }
      loadProjectVideo(video);
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  });
}

function cleanupWindowMediaObservers(windowElement) {
  const observer = windowElement.__videoObserver;
  if (observer && typeof observer.disconnect === "function") {
    observer.disconnect();
  }
  delete windowElement.__videoObserver;
}

function bringProjectWindowToFront(windowElement) {
  projectWindowZ += 1;
  windowElement.style.zIndex = String(projectWindowZ);
}

function removeProjectWindowAfterAnimation(windowElement, callback) {
  if (windowElement.classList.contains("is-closing")) {
    return;
  }

  windowElement.classList.add("is-closing");
  let isFinalized = false;

  const finalize = () => {
    if (isFinalized) {
      return;
    }
    isFinalized = true;
    cleanupWindowMediaObservers(windowElement);
    windowElement.removeEventListener("transitionend", onTransitionEnd);
    windowElement.removeEventListener("animationend", onAnimationEnd);
    if (windowElement.isConnected) {
      windowElement.remove();
    }
    if (callback) {
      callback();
    }
  };

  const onTransitionEnd = (event) => {
    if (event.target !== windowElement) {
      return;
    }
    finalize();
  };

  const onAnimationEnd = (event) => {
    if (event.target !== windowElement) {
      return;
    }
    finalize();
  };

  windowElement.addEventListener("transitionend", onTransitionEnd);
  windowElement.addEventListener("animationend", onAnimationEnd);
  window.setTimeout(finalize, 320);
}

function closeProjectWindow(windowElement) {
  removeProjectWindowAfterAnimation(windowElement, () => {
    const hasOpenWindows = Boolean(projectModal?.querySelector(".project-window:not(.project-window-template)"));
    if (!hasOpenWindows) {
      projectModal?.classList.remove("is-open");
      projectModal?.setAttribute("aria-hidden", "true");
    }

    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
    clearDesktopIconFocus();
  });
}

function closeAllProjectWindows() {
  const openWindows = projectModal?.querySelectorAll(".project-window:not(.project-window-template)");
  if (!openWindows?.length) {
    return;
  }

  let pending = openWindows.length;
  openWindows.forEach((windowElement) => {
    removeProjectWindowAfterAnimation(windowElement, () => {
      pending -= 1;
      if (pending > 0) {
        return;
      }

      projectModal?.classList.remove("is-open");
      projectModal?.setAttribute("aria-hidden", "true");

      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
      clearDesktopIconFocus();
    });
  });
}

function getPositionBounds() {
  if (window.matchMedia("(max-width: 760px)").matches) {
    return {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  const sceneRect = mapScene?.getBoundingClientRect();
  if (sceneRect && sceneRect.width > 0 && sceneRect.height > 0) {
    return sceneRect;
  }

  return {
    left: 0,
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function getWindowElementSize(windowElement) {
  if (!(windowElement instanceof HTMLElement)) {
    return { width: 0, height: 0 };
  }

  // offsetWidth/offsetHeight не зависят от transform: scale(...) и дают стабильный размер окна.
  const width = windowElement.offsetWidth;
  const height = windowElement.offsetHeight;
  if (width > 0 && height > 0) {
    return { width, height };
  }

  const rect = windowElement.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

function positionProjectWindowAt(windowElement, clientX, clientY) {
  const { width, height } = getWindowElementSize(windowElement);
  const bounds = getPositionBounds();
  const margin = 20;
  const minX = bounds.left + margin + width / 2;
  const maxX = bounds.right - margin - width / 2;
  const minY = bounds.top + margin + height / 2;
  const maxY = bounds.bottom - margin - height / 2;
  const targetX = Number.isFinite(clientX) ? clientX : bounds.left + bounds.width / 2;
  const targetY = Number.isFinite(clientY) ? clientY : bounds.top + bounds.height / 2;

  const clampedX = maxX >= minX ? Math.max(minX, Math.min(maxX, targetX)) : bounds.left + bounds.width / 2;
  const clampedY = maxY >= minY ? Math.max(minY, Math.min(maxY, targetY)) : bounds.top + bounds.height / 2;
  windowElement.style.setProperty("--modal-left", `${clampedX}px`);
  windowElement.style.setProperty("--modal-top", `${clampedY}px`);
}

function positionProjectWindowRandomly(windowElement) {
  const { width, height } = getWindowElementSize(windowElement);
  const bounds = getPositionBounds();
  const margin = 20;
  const minX = bounds.left + margin + width / 2;
  const maxX = bounds.right - margin - width / 2;
  const minY = bounds.top + margin + height / 2;
  const maxY = bounds.bottom - margin - height / 2;
  const fallbackX = bounds.left + bounds.width / 2;
  const fallbackY = bounds.top + bounds.height / 2;

  const randomX = maxX > minX ? minX + Math.random() * (maxX - minX) : fallbackX;
  const randomY = maxY > minY ? minY + Math.random() * (maxY - minY) : fallbackY;
  positionProjectWindowAt(windowElement, randomX, randomY);
}

function ensureProjectWindowInBounds(windowElement) {
  const rect = windowElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  positionProjectWindowAt(windowElement, centerX, centerY);
}

function positionProjectWindowNearIcon(windowElement, iconElement, radius = 30) {
  if (!(iconElement instanceof HTMLElement)) {
    positionProjectWindowRandomly(windowElement);
    return;
  }

  const iconRect = iconElement.getBoundingClientRect();
  const iconCenterX = iconRect.left + iconRect.width / 2;
  const iconCenterY = iconRect.top + iconRect.height / 2;
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * radius;
  const targetX = iconCenterX + Math.cos(angle) * distance;
  const targetY = iconCenterY + Math.sin(angle) * distance;

  positionProjectWindowAt(windowElement, targetX, targetY);
}

function enableProjectWindowDrag(windowElement) {
  const closeButton = windowElement.querySelector(".project-window-close");
  windowElement.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    if (
      event.target instanceof HTMLElement &&
      (event.target.closest(".project-slider") || event.target.closest(".project-gallery-video"))
    ) {
      return;
    }

    if (closeButton && event.target instanceof HTMLElement && event.target.closest(".project-window-close")) {
      return;
    }

    const rect = windowElement.getBoundingClientRect();
    const startCenterX = rect.left + rect.width / 2;
    const startCenterY = rect.top + rect.height / 2;
    const startX = event.clientX;
    const startY = event.clientY;
    let dragActive = false;
    let holdTimer = null;

    const startDrag = () => {
      if (dragActive) {
        return;
      }
      dragActive = true;
      event.preventDefault();
      bringProjectWindowToFront(windowElement);
      windowElement.classList.add("is-dragging");
      windowElement.setPointerCapture(event.pointerId);
    };

    const handleMove = (moveEvent) => {
      if (!dragActive && event.pointerType === "touch") {
        if (Math.abs(moveEvent.clientX - startX) > 6 || Math.abs(moveEvent.clientY - startY) > 6) {
          if (holdTimer !== null) {
            window.clearTimeout(holdTimer);
            holdTimer = null;
          }
        }
        return;
      }

      if (!dragActive) {
        startDrag();
      }

      const nextX = startCenterX + (moveEvent.clientX - startX);
      const nextY = startCenterY + (moveEvent.clientY - startY);
      positionProjectWindowAt(windowElement, nextX, nextY);
    };

    const handleUp = () => {
      if (holdTimer !== null) {
        window.clearTimeout(holdTimer);
        holdTimer = null;
      }
      windowElement.classList.remove("is-dragging");
      windowElement.removeEventListener("pointermove", handleMove);
      windowElement.removeEventListener("pointerup", handleUp);
      windowElement.removeEventListener("pointercancel", handleUp);
    };

    if (event.pointerType === "touch") {
      holdTimer = window.setTimeout(() => {
        holdTimer = null;
        startDrag();
      }, 140);
    } else {
      startDrag();
    }

    windowElement.addEventListener("pointermove", handleMove);
    windowElement.addEventListener("pointerup", handleUp);
    windowElement.addEventListener("pointercancel", handleUp);
  });
}

function openProjectModal(projectId, sourceIcon = null) {
  if (!projectModal || !projectWindowTemplate) {
    return;
  }

  const data = projectContent[projectId];
  if (!data) {
    return;
  }

  const windowElement = projectWindowTemplate.cloneNode(true);
  windowElement.classList.remove("project-window-template");
  windowElement.classList.add("is-opening");
  windowElement.classList.add(`project-${projectId}`);
  const title = windowElement.querySelector(".project-window-title");
  const name = windowElement.querySelector(".js-project-name");
  const meta = windowElement.querySelector(".project-meta");
  const company = windowElement.querySelector(".js-project-company");
  const intro = windowElement.querySelector(".js-project-intro");
  const metrics = windowElement.querySelector(".js-project-metrics");
  const pointsList = windowElement.querySelector(".js-project-points");
  const gallery = windowElement.querySelector(".js-project-gallery");
  const thumb = windowElement.querySelector(".js-project-thumb");
  const closeButton = windowElement.querySelector(".project-window-close");
  const metricsSection = windowElement.querySelector(".project-section-metrics");
  const detailsSection = windowElement.querySelector(".project-section-details");
  const metricsTitle = metricsSection?.querySelector(".project-section-title");

  const localizedTitle = (data.title || "").replace(/^Information about:/, "Информация о:");
  const localizedDetails = (data.details || "").replace(/^Type:/, "Тип:");
  const metricsText = data.metrics || localizedDetails || "";
  const showMetrics = !data.hideMetrics && Boolean(metricsText);
  const showDetails = !data.hideDetails;
  const showMeta = !data.hideMeta;
  const showGallery = !data.hideGallery;
  const detailItems = Array.isArray(data.detailItems) ? data.detailItems : [];
  const galleryItems = Array.isArray(data.gallery) && data.gallery.length > 0
    ? data.gallery
    : (data.preview ? [data.preview] : []);
  const sliderItems = Array.isArray(data.slider) && data.slider.length > 0 ? data.slider : [];
  const sliderGroups = Array.isArray(data.sliders)
    ? data.sliders.filter((group) => Array.isArray(group) && group.length > 0)
    : (sliderItems.length > 0 ? [sliderItems] : []);
  const hasExplicitGallery = Array.isArray(data.gallery) && data.gallery.length > 0;
  const shouldRenderGalleryWithSliders = Boolean(data.renderGalleryWithSliders);

  if (title) title.textContent = fixWidows(localizedTitle || data.title);
  if (name) name.textContent = fixWidows(data.name);
  if (meta) {
    meta.hidden = !showMeta;
  }
  const showCompany = !data.hideCompany && Boolean(data.company);
  const showIntro = !data.hideIntro && Boolean(data.intro);

  if (company) {
    company.hidden = !showCompany;
    company.textContent = showCompany ? fixWidows(data.company) : "";
  }

  if (intro) {
    intro.hidden = !showIntro;
    intro.textContent = showIntro ? fixWidows(data.intro) : "";
  }
  if (metricsSection) metricsSection.hidden = !showMetrics;
  if (metricsTitle) metricsTitle.textContent = data.metricsTitle || "Цифры:";
  if (metrics) metrics.textContent = showMetrics ? fixWidows(metricsText) : "";
  if (detailsSection) detailsSection.hidden = !showDetails;
  if (thumb) {
    if (data.thumb) {
      thumb.hidden = false;
      thumb.setAttribute("src", data.thumb);
      thumb.onerror = null;
    } else {
      thumb.hidden = true;
      thumb.removeAttribute("src");
    }
  }
  if (pointsList && showDetails) {
    pointsList.innerHTML = "";
    if (detailItems.length > 0) {
      detailItems.forEach((item) => {
        const cleanItem = String(item).trim().replace(/[.!?…]+$/u, "");
        const li = document.createElement("li");
        li.className = "project-details-item";
        li.textContent = fixWidows(cleanItem);
        pointsList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.className = "project-details-item";
      li.textContent = fixWidows("Подробное описание проекта скоро будет добавлено");
      pointsList.appendChild(li);
    }
  }
  const isGifFile = (src) => /\.(gif)(\?.*)?$/i.test(src);
  const isVideoFile = (src) => /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
  const reorderGalleryItems = (items) => {
    const ordered = [];
    const deferredGifs = [];
    let photoParity = 0; // 0 = row closed, 1 = one photo in row

    items.forEach((src) => {
      if (isGifFile(src)) {
        if (photoParity === 1) {
          deferredGifs.push(src);
        } else {
          ordered.push(src);
        }
        return;
      }

      ordered.push(src);
      photoParity = (photoParity + 1) % 2;

      if (photoParity === 0 && deferredGifs.length > 0) {
        ordered.push(...deferredGifs);
        deferredGifs.length = 0;
      }
    });

    if (deferredGifs.length > 0) {
      ordered.push(...deferredGifs);
    }

    return ordered;
  };

  if (gallery) {
    gallery.hidden = !showGallery;
    if (!showGallery) {
      gallery.innerHTML = "";
    }
  }

  if (gallery && showGallery) {
    gallery.innerHTML = "";
    const buildSlider = (slides, sliderOrdinal = 1) => {
      const slider = document.createElement("section");
      slider.className = "project-slider";
      slider.setAttribute("aria-label", "Слайдер презентации");

      const track = document.createElement("div");
      track.className = "project-slider-track";

      const totalSlides = slides.length;
      const trackItems =
        totalSlides > 1
          ? [slides[totalSlides - 1], ...slides, slides[0]]
          : [...slides];

      trackItems.forEach((src, idx) => {
        const slide = document.createElement("figure");
        slide.className = "project-slider-slide";
        const img = document.createElement("img");
        img.className = "project-slider-image";
        img.src = src;
        img.alt = `${data.name} — слайдер ${sliderOrdinal}, слайд ${idx + 1}`;
        img.loading = "lazy";
        slide.appendChild(img);
        track.appendChild(slide);
      });

      const prevButton = document.createElement("button");
      prevButton.type = "button";
      prevButton.className = "project-slider-button is-prev";
      prevButton.setAttribute("aria-label", "Предыдущий слайд");
      prevButton.textContent = "‹";

      const nextButton = document.createElement("button");
      nextButton.type = "button";
      nextButton.className = "project-slider-button is-next";
      nextButton.setAttribute("aria-label", "Следующий слайд");
      nextButton.textContent = "›";

      let activeIndex = totalSlides > 1 ? 1 : 0;
      let isAnimating = false;
      let wheelBuffer = 0;
      let wheelUnlockTimer = null;
      let wheelLocked = false;
      let pointerStartX = 0;
      let pointerIsDown = false;

      const setTrackPosition = (animate = true) => {
        if (animate) {
          track.style.transition = "";
        } else {
          track.style.transition = "none";
        }
        track.style.transform = `translateX(-${activeIndex * 100}%)`;
        if (!animate) {
          track.getBoundingClientRect();
          track.style.transition = "";
        }
      };

      const stepBy = (direction) => {
        if (totalSlides <= 1 || isAnimating) {
          return false;
        }
        isAnimating = true;
        activeIndex += direction;
        setTrackPosition(true);
        return true;
      };

      prevButton.addEventListener("click", () => stepBy(-1));
      nextButton.addEventListener("click", () => stepBy(1));

      track.addEventListener("transitionend", (event) => {
        if (event.target !== track || event.propertyName !== "transform") {
          return;
        }
        if (totalSlides <= 1) {
          isAnimating = false;
          return;
        }

        if (activeIndex === 0) {
          activeIndex = totalSlides;
          setTrackPosition(false);
        } else if (activeIndex === totalSlides + 1) {
          activeIndex = 1;
          setTrackPosition(false);
        }
        isAnimating = false;
      });

      slider.addEventListener(
        "wheel",
        (event) => {
          const horizontalIntent =
            Math.abs(event.deltaX) > 8 &&
            Math.abs(event.deltaX) >= Math.abs(event.deltaY) * 0.35;

          if (!horizontalIntent) {
            return;
          }

          event.preventDefault();
          if (wheelLocked) {
            return;
          }
          wheelBuffer += event.deltaX;
          if (Math.abs(wheelBuffer) < 55) {
            return;
          }
          let moved = false;
          if (wheelBuffer > 0) {
            moved = stepBy(1);
          } else {
            moved = stepBy(-1);
          }
          wheelBuffer = 0;
          if (moved) {
            wheelLocked = true;
            if (wheelUnlockTimer) {
              window.clearTimeout(wheelUnlockTimer);
            }
            wheelUnlockTimer = window.setTimeout(() => {
              wheelLocked = false;
              wheelBuffer = 0;
            }, 420);
          }
        },
        { passive: false }
      );

      slider.addEventListener("pointerleave", () => {
        wheelBuffer = 0;
      });

      slider.addEventListener("pointerdown", (event) => {
        pointerIsDown = true;
        pointerStartX = event.clientX;
      });

      slider.addEventListener("pointerup", (event) => {
        if (!pointerIsDown) {
          return;
        }
        pointerIsDown = false;
        const diffX = event.clientX - pointerStartX;
        if (Math.abs(diffX) < 40) {
          return;
        }
        if (diffX < 0) {
          stepBy(1);
        } else {
          stepBy(-1);
        }
      });

      slider.addEventListener("pointercancel", () => {
        pointerIsDown = false;
      });

      slider.append(track, prevButton, nextButton);
      setTrackPosition(false);
      return slider;
    };

    if (hasExplicitGallery || sliderGroups.length === 0 || shouldRenderGalleryWithSliders) {
      const normalizedItems = galleryItems.map((item) =>
        typeof item === "string" ? { src: item } : item
      );
      const hasCustomLayouts = normalizedItems.some((item) => item.layout);
      const displayItems = hasCustomLayouts
        ? normalizedItems
        : reorderGalleryItems(normalizedItems.map((item) => item.src)).map((src) => ({ src }));

      displayItems.forEach((item, index) => {
        if (item.type === "card") {
          const card = document.createElement("article");
          card.className = "project-gallery-note";
          const cardTitle = document.createElement("h4");
          cardTitle.className = "project-gallery-note-title";
          cardTitle.textContent = fixWidows(item.title || "Проект");
          const cardSubtitle = document.createElement("p");
          cardSubtitle.className = "project-gallery-note-subtitle";
          cardSubtitle.textContent = fixWidows(item.subtitle || "");
          const cardText = document.createElement("p");
          cardText.className = "project-gallery-note-text";
          cardText.textContent = fixWidows(item.text || "");
          card.append(cardTitle, cardSubtitle, cardText);
          gallery.appendChild(card);
          return;
        }
        if (item.type === "text-card") {
          const card = document.createElement("article");
          card.className = "project-gallery-note project-gallery-note--textonly";
          const cardText = document.createElement("p");
          cardText.className = "project-gallery-note-text";
          cardText.textContent = fixWidows(item.text || "");
          card.append(cardText);
          gallery.appendChild(card);
          return;
        }
        if (item.type === "slider") {
          const sliderIndex = Number.isInteger(item.group) ? item.group : 0;
          const sliderGroup = sliderGroups[sliderIndex];
          if (sliderGroup && sliderGroup.length > 0) {
            gallery.appendChild(buildSlider(sliderGroup, sliderIndex + 1));
          }
          return;
        }

        const src = item.src;
        const shouldRenderVideo = isVideoFile(src);
        const media = shouldRenderVideo ? document.createElement("video") : document.createElement("img");
        media.className = shouldRenderVideo
          ? "project-gallery-image project-gallery-video"
          : "project-gallery-image";

        if (isGifFile(src) || (shouldRenderVideo && !item.player)) {
          media.classList.add("is-gif");
        }
        if (item.layout === "full" || (!item.layout && index === 0)) {
          media.classList.add("is-featured");
        }
        if (src.includes("r7-gif-04.gif")) {
          media.classList.add("is-portrait");
        }
        if (item.layout === "pair") {
          media.classList.add("is-pair");
        }
        if (item.cropFixed) {
          media.classList.add("is-fixed-crop");
        }

        if (shouldRenderVideo) {
          media.dataset.src = src;
          media.setAttribute("playsinline", "");
          media.setAttribute("preload", "none");
          if (item.player) {
            media.controls = true;
            media.classList.add("is-player");
            media.muted = true;
            media.defaultMuted = true;
            media.setAttribute("muted", "");
          } else {
            media.autoplay = true;
            media.muted = true;
            media.loop = true;
            media.defaultMuted = true;
            media.setAttribute("muted", "");
          }
        } else {
          media.src = src;
          media.alt = `${data.name} — фото ${index + 1}`;
          media.loading = "lazy";
          media.decoding = "async";
        }

        gallery.appendChild(media);
      });
    }

    if (sliderGroups.length > 0 && (!hasExplicitGallery || shouldRenderGalleryWithSliders)) {
      sliderGroups.forEach((group, groupIndex) => {
        gallery.appendChild(buildSlider(group, groupIndex + 1));
      });
    }
  }
  if (closeButton) {
    closeButton.addEventListener("click", () => closeProjectWindow(windowElement));
  }

  windowElement.addEventListener("pointerdown", () => {
    bringProjectWindowToFront(windowElement);
  });

  projectModal.appendChild(windowElement);
  setupAutoplayWhenVisible(windowElement);
  setupTapToToggleVideo(windowElement);
  enableProjectWindowDrag(windowElement);
  bringProjectWindowToFront(windowElement);
  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");

  window.requestAnimationFrame(() => {
    const isMobileViewport = window.matchMedia("(max-width: 760px)").matches;
    const isEducationProject = /^edu-/.test(projectId);
    if (isMobileViewport) {
      const bounds = getPositionBounds();
      positionProjectWindowAt(
        windowElement,
        bounds.left + bounds.width / 2,
        bounds.top + bounds.height / 2
      );
    } else if (isEducationProject) {
      positionProjectWindowNearIcon(windowElement, sourceIcon, 30);
    } else {
      positionProjectWindowRandomly(windowElement);
    }
    const handleOpenAnimationEnd = (event) => {
      if (event.target !== windowElement) {
        return;
      }
      windowElement.classList.remove("is-opening");
      ensureProjectWindowInBounds(windowElement);
      windowElement.removeEventListener("animationend", handleOpenAnimationEnd);
    };
    windowElement.addEventListener("animationend", handleOpenAnimationEnd);
  });

  const mediaElements = windowElement.querySelectorAll("img, video");
  mediaElements.forEach((media) => {
    const adjust = () => ensureProjectWindowInBounds(windowElement);
    media.addEventListener("load", adjust, { once: true });
    media.addEventListener("loadedmetadata", adjust, { once: true });
    media.addEventListener("loadeddata", adjust, { once: true });
  });
}

document.addEventListener("pointerdown", (event) => {
  const openWindows = projectModal?.querySelectorAll(".project-window:not(.project-window-template)");
  if (!openWindows?.length) {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.closest(".project-window")) {
    return;
  }

  if (target.closest(".desktop-icon")) {
    return;
  }

  closeAllProjectWindows();
});

if (heroCluster) {
  const maxShift = 10;
  const careerIcons = Array.from(heroCluster.querySelectorAll(".desktop-icon")).filter(
    (icon) => !icon.closest(".mobile-layout")
  );
  const magneticRadius = 150;
  const magneticPull = 10;

  // Reset stored drag offsets after layout updates so icons start in their CSS positions.
  careerIcons.forEach((icon) => {
    icon.style.setProperty("--drag-x", "0px");
    icon.style.setProperty("--drag-y", "0px");
    delete icon.dataset.dragX;
    delete icon.dataset.dragY;
    delete icon.dataset.dragMoved;
  });

  function updateShift(event) {
    const rect = heroCluster.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

    heroCluster.style.setProperty("--p-x", `${relativeX * maxShift}px`);
    heroCluster.style.setProperty("--p-y", `${relativeY * maxShift}px`);
  }

  function resetShift() {
    heroCluster.style.setProperty("--p-x", "0px");
    heroCluster.style.setProperty("--p-y", "0px");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function resetMagnet(icon) {
    icon.style.setProperty("--mx", "0px");
    icon.style.setProperty("--my", "0px");
  }

  function updateMagnet(icon, event) {
    if (icon.classList.contains("is-dragging")) {
      return;
    }

    const rect = icon.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);

    if (distance > magneticRadius) {
      resetMagnet(icon);
      return;
    }

    const strength = 1 - distance / magneticRadius;
    const moveX = clamp((dx / magneticRadius) * magneticPull * strength * 3.2, -magneticPull, magneticPull);
    const moveY = clamp((dy / magneticRadius) * magneticPull * strength * 3.2, -magneticPull, magneticPull);
    icon.style.setProperty("--mx", `${moveX.toFixed(2)}px`);
    icon.style.setProperty("--my", `${moveY.toFixed(2)}px`);
  }

  heroCluster.addEventListener("pointermove", updateShift);
  heroCluster.addEventListener("pointerleave", resetShift);
  heroCluster.addEventListener("blur", resetShift);

  careerIcons.forEach((icon) => {
    // Disable keyboard focus on icons to avoid persistent focus ring after ESC.
    icon.setAttribute("tabindex", "-1");

    icon.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) {
        return;
      }

      const startX = event.clientX;
      const startY = event.clientY;
      const baseX = Number.parseFloat(icon.dataset.dragX || "0");
      const baseY = Number.parseFloat(icon.dataset.dragY || "0");
      let hasMoved = false;

      icon.classList.add("is-dragging");
      icon.setPointerCapture(event.pointerId);

      const handleMove = (moveEvent) => {
        const offsetX = baseX + (moveEvent.clientX - startX);
        const offsetY = baseY + (moveEvent.clientY - startY);

        if (Math.abs(moveEvent.clientX - startX) > 3 || Math.abs(moveEvent.clientY - startY) > 3) {
          hasMoved = true;
        }

        icon.dataset.dragX = offsetX.toFixed(2);
        icon.dataset.dragY = offsetY.toFixed(2);
        icon.style.setProperty("--drag-x", `${offsetX.toFixed(2)}px`);
        icon.style.setProperty("--drag-y", `${offsetY.toFixed(2)}px`);
      };

      const handleUp = () => {
        icon.classList.remove("is-dragging");
        icon.removeEventListener("pointermove", handleMove);
        icon.removeEventListener("pointerup", handleUp);
        icon.removeEventListener("pointercancel", handleUp);

        if (hasMoved) {
          icon.dataset.dragMoved = "1";
          window.setTimeout(() => {
            delete icon.dataset.dragMoved;
          }, 180);
        }
      };

      icon.addEventListener("pointermove", handleMove);
      icon.addEventListener("pointerup", handleUp);
      icon.addEventListener("pointercancel", handleUp);
    });

    icon.addEventListener("pointermove", (event) => updateMagnet(icon, event));
    icon.addEventListener("pointerenter", () => {
      icon.classList.add("is-hovered");
    });
    icon.addEventListener("pointerleave", () => resetMagnet(icon));
    icon.addEventListener("pointerleave", () => {
      icon.classList.remove("is-hovered");
    });
    icon.addEventListener("pointercancel", () => resetMagnet(icon));
    icon.addEventListener("pointercancel", () => {
      icon.classList.remove("is-hovered");
    });
    icon.addEventListener("click", () => {
      if (icon.dataset.dragMoved === "1") {
        delete icon.dataset.dragMoved;
        return;
      }

      const projectId = icon.dataset.project;
      if (openExternalProject(projectId)) {
        icon.classList.remove("is-hovered");
        resetMagnet(icon);
        return;
      }

      if (projectId) {
        openProjectModal(projectId, icon);
      }
    });
    icon.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      const projectId = icon.dataset.project;
      if (openExternalProject(projectId)) {
        icon.classList.remove("is-hovered");
        resetMagnet(icon);
        return;
      }

      if (projectId) {
        openProjectModal(projectId, icon);
      }
    });
  });

  window.addEventListener("blur", () => {
    careerIcons.forEach((icon) => {
      resetMagnet(icon);
      icon.classList.remove("is-hovered");
    });
  });
}

const mobileIcons = document.querySelectorAll(".mobile-layout .desktop-icon");
if (mobileIcons.length) {
  mobileIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 760px)").matches) {
        const opened = projectModal?.querySelectorAll(".project-window:not(.project-window-template)");
        opened?.forEach((windowElement) => {
          cleanupWindowMediaObservers(windowElement);
          windowElement.remove();
        });
        projectModal?.classList.remove("is-open");
        projectModal?.setAttribute("aria-hidden", "true");
      }

      const projectId = icon.dataset.project;
      if (openExternalProject(projectId)) {
        return;
      }
      if (projectId) {
        openProjectModal(projectId, icon);
      }
    });

    icon.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();

      if (window.matchMedia("(max-width: 760px)").matches) {
        const opened = projectModal?.querySelectorAll(".project-window:not(.project-window-template)");
        opened?.forEach((windowElement) => {
          cleanupWindowMediaObservers(windowElement);
          windowElement.remove();
        });
        projectModal?.classList.remove("is-open");
        projectModal?.setAttribute("aria-hidden", "true");
      }

      const projectId = icon.dataset.project;
      if (openExternalProject(projectId)) {
        return;
      }
      if (projectId) {
        openProjectModal(projectId, icon);
      }
    });
  });
}

document.querySelectorAll(".desktop-icon-title, .callout-text").forEach((node) => {
  if (node instanceof HTMLElement) {
    node.textContent = fixWidows(node.textContent || "");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearDesktopIconFocus();

    const openWindows = projectModal?.querySelectorAll(".project-window:not(.project-window-template)");
    if (!openWindows?.length) {
      return;
    }

    let topWindow = null;
    let maxZ = -Infinity;
    openWindows.forEach((windowElement) => {
      const z = Number.parseInt(window.getComputedStyle(windowElement).zIndex || "0", 10);
      if (z >= maxZ) {
        maxZ = z;
        topWindow = windowElement;
      }
    });

    if (topWindow) {
      closeProjectWindow(topWindow);
      window.setTimeout(() => {
        clearDesktopIconFocus();
      }, 0);
    }
  }
});

window.addEventListener("resize", () => {
  const openWindows = projectModal?.querySelectorAll(".project-window:not(.project-window-template)");
  openWindows?.forEach((windowElement) => {
    const rect = windowElement.getBoundingClientRect();
    positionProjectWindowAt(windowElement, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
});

function centerMobileSceneScroll() {
  if (!mapScene) {
    return;
  }

  if (!window.matchMedia("(max-width: 760px)").matches) {
    return;
  }

  const maxScrollX = mapScene.scrollWidth - mapScene.clientWidth;
  if (maxScrollX <= 0) {
    mapScene.scrollLeft = 0;
    return;
  }

  mapScene.scrollLeft = Math.round(maxScrollX / 2);
  mapScene.scrollTop = 0;
}

requestAnimationFrame(centerMobileSceneScroll);
window.addEventListener("load", centerMobileSceneScroll);
window.addEventListener("orientationchange", () => {
  window.setTimeout(centerMobileSceneScroll, 120);
});
