const assets = {
  "title-white": {
    "type": "image",
    "src": "./assets/spectrum-stickers/title-white.png",
    "width": 3427,
    "height": 612,
    "alt": "Спектрум & Rassvet.award",
    "fit": "contain"
  },
  "title-warm": {
    "type": "image",
    "src": "./assets/spectrum-stickers/title-warm.svg",
    "width": 3427,
    "height": 612,
    "alt": "Спектрум & Rassvet.award",
    "fit": "contain"
  },
  "title-purple": {
    "type": "image",
    "src": "./assets/spectrum-stickers/title-purple.svg",
    "width": 3427,
    "height": 612,
    "alt": "Спектрум & Rassvet.award",
    "fit": "contain"
  },
  "title-green": {
    "type": "image",
    "src": "./assets/spectrum-stickers/title-green.png",
    "width": 3427,
    "height": 612,
    "alt": "Спектрум & Rassvet.award",
    "fit": "contain"
  },
  "who-white": {
    "type": "image",
    "src": "./assets/spectrum-stickers/who-white.png",
    "width": 3437,
    "height": 737,
    "alt": "Кто, если не ты?",
    "fit": "contain"
  },
  "who-warm": {
    "type": "image",
    "src": "./assets/spectrum-stickers/who-warm.png",
    "width": 3406,
    "height": 706,
    "alt": "Кто, если не ты?",
    "fit": "contain"
  },
  "who-purple": {
    "type": "image",
    "src": "./assets/spectrum-stickers/who-purple.png",
    "width": 3406,
    "height": 706,
    "alt": "Кто, если не ты?",
    "fit": "contain"
  },
  "who-green": {
    "type": "image",
    "src": "./assets/spectrum-stickers/who-green.png",
    "width": 3406,
    "height": 706,
    "alt": "Кто, если не ты?",
    "fit": "contain"
  },
  "pr-white": {
    "type": "image",
    "src": "./assets/spectrum-stickers/pr-white.png",
    "width": 3415,
    "height": 603,
    "alt": "Кто о чем — а я о пиаре",
    "fit": "contain"
  },
  "pr-warm": {
    "type": "image",
    "src": "./assets/spectrum-stickers/pr-warm.png",
    "width": 3385,
    "height": 573,
    "alt": "Кто о чем — а я о пиаре",
    "fit": "contain"
  },
  "pr-purple": {
    "type": "image",
    "src": "./assets/spectrum-stickers/pr-purple.png",
    "width": 3385,
    "height": 573,
    "alt": "Кто о чем — а я о пиаре",
    "fit": "contain"
  },
  "pr-green": {
    "type": "image",
    "src": "./assets/spectrum-stickers/pr-green.png",
    "width": 3385,
    "height": 573,
    "alt": "Кто о чем — а я о пиаре",
    "fit": "contain"
  },
  "mirror": {
    "type": "image",
    "src": "./assets/spectrum-stickers/mirror.png",
    "width": 3448,
    "height": 665,
    "alt": "Свет мой, зеркальце, скажи: кто сегодня победил?",
    "fit": "contain"
  },
  "star": {
    "type": "image",
    "src": "./assets/spectrum-stickers/star.png",
    "width": 2868,
    "height": 2529,
    "alt": "Да, мне больше всех надо!",
    "fit": "contain"
  },
  "keyhole": {
    "type": "image",
    "src": "./assets/spectrum-stickers/keyhole.png",
    "width": 1272,
    "height": 1965,
    "alt": "Не прячь свой свет",
    "fit": "contain"
  },
  "spotlight": {
    "type": "image",
    "src": "./assets/spectrum-stickers/spotlight.png",
    "width": 1145,
    "height": 1289,
    "alt": "На мне свет клином сошелся",
    "fit": "contain"
  },
  "door": {
    "type": "image",
    "src": "./assets/spectrum-stickers/door.png",
    "width": 1088,
    "height": 1499,
    "alt": "Луч света в темном царстве креатива",
    "fit": "contain"
  },
  "sunrise": {
    "type": "image",
    "src": "./assets/spectrum-stickers/sunrise.png",
    "width": 1804,
    "height": 1548,
    "alt": "Ни свет ни заря, а мы уже в инфополе",
    "fit": "contain"
  },
  "pitch": {
    "type": "image",
    "src": "./assets/spectrum-stickers/pitch.png",
    "width": 1247,
    "height": 1201,
    "alt": "Не откладывай на завтра то, что можно запитчить сегодня",
    "fit": "contain"
  },
  "prism": {
    "type": "image",
    "src": "./assets/spectrum-stickers/prism.png",
    "width": 1548,
    "height": 1358,
    "alt": "Не сгущаем краски, а расширяем спектр",
    "fit": "contain"
  },
  "earth": {
    "type": "image",
    "src": "./assets/spectrum-stickers/earth.png",
    "width": 1095,
    "height": 1604,
    "alt": "Да, я пуп земли",
    "fit": "contain"
  },
  "radio": {
    "type": "image",
    "src": "./assets/spectrum-stickers/radio.png",
    "width": 1278,
    "height": 1290,
    "alt": "Один в медиаполе не воин",
    "fit": "contain"
  }
};

export const spectrumStickerPack = {
  title: ["white", "warm", "purple", "green"].map(color => assets[`title-${color}`]),
  who: ["white", "warm", "purple", "green"].map(color => assets[`who-${color}`]),
  pr: ["white", "warm", "purple", "green"].map(color => assets[`pr-${color}`]),
  illustrations: ["spotlight", "door", "sunrise", "pitch", "prism", "earth", "radio", "keyhole"].map(key => Object.assign(assets[key], { key })),
  mirror: assets.mirror,
  star: assets.star,
  media: Object.values(assets),
};
