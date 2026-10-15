import { typography } from './typography.js?v=4';

export function createMediaHeading(title, category) {
  const heading = document.createElement('p');
  heading.className = 'media-heading project-media-heading';
  const label = document.createElement('span');
  label.textContent = typography(title);
  heading.append(label);
  if (category) {
    const type = document.createElement('span');
    type.className = 'media-heading-category';
    type.textContent = typography(category);
    heading.append(type);
  }
  return heading;
}
