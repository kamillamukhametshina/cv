import { mobileLayout } from './responsive.js';
import { mobileImages, mobileCoverVideos } from './mobile-media-map.js';

export const imageSource = src => mobileLayout.matches ? mobileImages[src] || src : src;
export const coverVideoSource = src => mobileLayout.matches ? mobileCoverVideos[src] || src : src;
