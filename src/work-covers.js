import { frameCoverData } from './frame-cover-data.js';
// Archive covers supplied by the author; separate from the case galleries.
export const workCovers = {
  "recycle-it": {
    "type": "image",
    "src": "./assets/recycle-it/cover-original.png",
    "width": 1024,
    "height": 1024,
    "alt": "Recycle It! — интерактивная обложка"
  },
  "perekrestok": {
    "type": "video",
    "src": "./assets/work-covers/perekrestok-v5.webm",
    "poster": "./assets/work-covers/perekrestok-v5.webp",
    "width": 1254,
    "height": 1254,
    "alt": "Перекрёсток — анимированная обложка"
  },
  "sence": {
    "type": "video",
    "src": "./assets/work-covers/sence-v3.webm",
    "poster": "./assets/work-covers/sence-alpha.webp",
    "width": 957,
    "height": 957,
    "alt": "Sence — анимированная обложка"
  },
  "phoenix-online": {
    "type": "video",
    "src": "./assets/work-covers/phoenix-online-v3.webm",
    "poster": "./assets/work-covers/phoenix-online-alpha.webp",
    "width": 1024,
    "height": 1024,
    "alt": "Феникс Онлайн — анимированная обложка"
  },
  "tender-pioneer": {
    "type": "video",
    "src": "./assets/work-covers/tender-pioneer-v3.webm",
    "poster": "./assets/work-covers/tender-pioneer-alpha.webp",
    "width": 1024,
    "height": 1024,
    "alt": "Тендер Pioneer — анимированная обложка"
  },
  "region-steel": {
    "type": "video",
    "src": "./assets/work-covers/region-steel-v4.webm",
    "poster": "./assets/work-covers/region-steel-v4.webp",
    "width": 1024,
    "height": 1024,
    "alt": "Регион Сталь — анимированная обложка"
  },
  "29di": {
    "type": "video",
    "src": "./assets/work-covers/29di-v3.webm",
    "poster": "./assets/work-covers/29di-alpha.webp",
    "width": 1032,
    "height": 1080,
    "alt": "29DI — анимированная обложка"
  },
  "media-case-club": {
    "type": "video",
    "src": "./assets/work-covers/media-case-club.webm",
    "poster": "./assets/work-covers/media-case-club-alpha.webp",
    "width": 1024,
    "height": 1024,
    "alt": "Media Case Club — анимированная обложка"
  },
  "solar-staff": {
    "type": "video",
    "src": "./assets/work-covers/solar-staff.webm",
    "poster": "./assets/work-covers/solar-staff-alpha.webp",
    "width": 1024,
    "height": 1024,
    "alt": "Solar Staff — анимированная обложка"
  },
  "bitrix24-b2b-cmo": {
    "type": "video",
    "src": "./assets/work-covers/bitrix24-b2b-cmo.webm",
    "poster": "./assets/work-covers/bitrix24-b2b-cmo-alpha.webp",
    "width": 1418,
    "height": 798,
    "alt": "B2B CMO — анимированная обложка"
  },
  "bitrix24-stachka": {
    "type": "video",
    "src": "./assets/work-covers/bitrix24-stachka.webm",
    "poster": "./assets/work-covers/bitrix24-stachka-alpha.webp",
    "width": 1410,
    "height": 794,
    "alt": "Стачка — анимированная обложка"
  },
  "bitrix24-techwriter-days": {
    "type": "video",
    "src": "./assets/work-covers/bitrix24-techwriter-days.webm",
    "poster": "./assets/work-covers/bitrix24-techwriter-days-alpha.webp",
    "width": 1600,
    "height": 900,
    "alt": "Techwriter days — анимированная обложка"
  },
  "bitrix24-pr-report": {
    "type": "video",
    "src": "./assets/work-covers/bitrix24-pr-report.webm",
    "poster": "./assets/work-covers/bitrix24-pr-report-alpha.webp",
    "width": 1600,
    "height": 900,
    "alt": "Отчетная PR — анимированная обложка"
  },
  "bitrix24-big-bounty": {
    "type": "video",
    "src": "./assets/work-covers/bitrix24-big-bounty.webm",
    "poster": "./assets/work-covers/bitrix24-big-bounty-alpha.webp",
    "width": 1600,
    "height": 900,
    "alt": "Big Bounty — анимированная обложка"
  },
  "fresh-auto-template": {
    "type": "video",
    "src": "./assets/work-covers/fresh-auto-template.webm",
    "poster": "./assets/work-covers/fresh-auto-template-alpha.webp",
    "width": 1600,
    "height": 900,
    "alt": "Fresh Auto — анимированная обложка"
  },
  "new-media-lab-presentation": {
    "type": "video",
    "src": "./assets/work-covers/new-media-lab-presentation.webm",
    "poster": "./assets/work-covers/new-media-lab-presentation-alpha.webp",
    "width": 1600,
    "height": 900,
    "alt": "New Media Lab — анимированная обложка"
  },
  "f-date-eat-partners": {
    "type": "video",
    "src": "./assets/work-covers/f-date-eat-partners.webm",
    "poster": "./assets/work-covers/f-date-eat-partners-alpha.webp",
    "width": 1600,
    "height": 900,
    "alt": "F Date&Eat — партнёры — анимированная обложка"
  },
  "f-date-eat-ambassadors": {
    "type": "video",
    "src": "./assets/work-covers/f-date-eat-ambassadors.webm",
    "poster": "./assets/work-covers/f-date-eat-ambassadors-alpha.webp",
    "width": 1600,
    "height": 900,
    "alt": "F Date&Eat — амбассадоры — анимированная обложка"
  }
};

for (const [id, data] of Object.entries(frameCoverData)) {
  workCovers[id] = { type:'image', src:data.original, width:data.width, height:data.height, alt:data.name + ' — интерактивная обложка' };
}
