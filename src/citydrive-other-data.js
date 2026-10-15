export const citydriveOther = {
  fishing: [1, 2].map(number => ({
    type: 'image', src: `./assets/citydrive/fishing-invitation-${number}.png`,
    width: 1290, height: 2000, fit: 'contain',
    alt: `Ситидрайву 11 лет — приглашение на рыбалку, вариант ${number}`,
    caption: `Рыболовный выезд / Приглашение ${number}`,
  })),
  "postcard": [
    {
      "type": "image",
      "src": "./assets/citydrive/other-postcard-front.webp",
      "width": 1722,
      "height": 2400,
      "fit": "contain",
      "alt": "Ситидрайв × PURPUR — лицевая сторона открытки"
    },
    {
      "type": "image",
      "src": "./assets/citydrive/other-postcard-back.webp",
      "width": 1722,
      "height": 2400,
      "fit": "contain",
      "alt": "Ситидрайв × PURPUR — оборот открытки"
    }
  ],
  "hero": {
    "type": "image",
    "src": "./assets/citydrive/other-minisharing.webp",
    "width": 1800,
    "height": 1800,
    "fit": "contain",
    "alt": "Мини-шеринг — анонс"
  },
  "stands": [
    {
      "type": "image",
      "src": "./assets/citydrive/other-stand-tall.webp",
      "width": 1086,
      "height": 1448,
      "fit": "contain",
      "alt": "Стойка — специальный тариф «Мини-шеринг»"
    },
    {
      "type": "image",
      "src": "./assets/citydrive/other-stand-wide.webp",
      "width": 1448,
      "height": 1086,
      "fit": "contain",
      "alt": "Стойка — на пункте проката"
    }
  ],
  "layouts": [
    {
      "type": "image",
      "src": "./assets/citydrive/other-layout-tall.webp",
      "width": 1097,
      "height": 1551,
      "fit": "contain",
      "alt": "Мини-шеринг — информационный макет"
    },
    {
      "type": "image",
      "src": "./assets/citydrive/other-layout-wide.webp",
      "width": 1800,
      "height": 1273,
      "fit": "contain",
      "alt": "Мини-шеринг — макет на пункте проката"
    }
  ],
  "life": {
    "type": "image",
    "src": "./assets/citydrive/other-minisharing-life.webp",
    "width": 1600,
    "height": 2400,
    "fit": "contain",
    "alt": "Мини-шеринг / в жизни"
  },
  "donuts": {
    "type": "image",
    "src": "./assets/citydrive/other-donuts.webp",
    "width": 1697,
    "height": 2400,
    "fit": "contain",
    "alt": "Как получить драйвовые пончики — тейбл-тент"
  },
  "windshield": {
    "type": "image",
    "src": "./assets/citydrive/other-windshield.webp",
    "width": 1800,
    "height": 1273,
    "fit": "contain",
    "alt": "Москвич 3 — информационная карточка"
  },
  "bottom": [
    {
      "type": "image",
      "src": "./assets/citydrive/other-start.webp",
      "width": 1800,
      "height": 1260,
      "fit": "contain",
      "alt": "Начинайте путешествие в приложении"
    },
    {
      "type": "image",
      "src": "./assets/citydrive/other-chill.webp",
      "width": 1800,
      "height": 1261,
      "fit": "contain",
      "alt": "Место для чилла"
    }
  ],
  "chillVideo": {
    "type": "video",
    "src": "./assets/citydrive/other-chill-life.mp4",
    "poster": "./assets/citydrive/other-chill-life.jpg",
    "width": 900,
    "height": 900,
    "fit": "contain",
    "autoplay": true,
    "alt": "Место для чилла / в жизни"
  },
  "phone": {
    "type": "video",
    "src": "./assets/citydrive/other-phone.webm",
    "safariSrc": "./assets/citydrive/other-phone.mov",
    "poster": "./assets/citydrive/other-phone.png",
    "width": 540,
    "height": 1000,
    "fit": "contain",
    "autoplay": true,
    "alt": "Мини-шеринг — анонс в ТГ-канале"
  },
  "eventPhotos": [
    {
      "type": "image",
      "src": "./assets/citydrive/other-windshield-life.webp",
      "width": 1800,
      "height": 1200,
      "fit": "contain",
      "alt": "Информационная карточка на лобовом стекле / в жизни"
    },
    {
      "type": "image",
      "src": "./assets/citydrive/other-donuts-life.webp",
      "width": 1800,
      "height": 1200,
      "fit": "contain",
      "alt": "Стойка для пончиков / в жизни"
    }
  ]
};
