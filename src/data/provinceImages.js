// Province-based image mapping for locations without individual photos
// Uses real Mongolia landscape photos from Unsplash
const provinceImageMap = {
  'Архангай': [
    'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1596003903685-c4e4c7c3514c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1573505820053-179cc3de63e4?auto=format&fit=crop&w=600&q=80',
  ],
  'Баян-Өлгий': [
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
  ],
  'Баянхонгор': [
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=600&q=80',
  ],
  'Булган': [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
  ],
  'Говь-Алтай': [
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=600&q=80',
  ],
  'Говьсүмбэр': [
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=600&q=80',
  ],
  'Дархан-Уул': [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
  ],
  'Дорноговь': [
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=600&q=80',
  ],
  'Дорнод': [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1596003903685-c4e4c7c3514c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
  ],
  'Дундговь': [
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=600&q=80',
  ],
  'Завхан': [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=600&q=80',
  ],
  'Орхон': [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
  ],
  'Өвөрхангай': [
    'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1596003903685-c4e4c7c3514c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
  ],
  'Өмнөговь': [
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=600&q=80',
  ],
  'Ховд': [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1596003903685-c4e4c7c3514c?auto=format&fit=crop&w=600&q=80',
  ],
  'Увс': [
    'https://images.unsplash.com/photo-1596003903685-c4e4c7c3514c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
  ],
  'Хөвсгөл': [
    'https://images.unsplash.com/photo-1596003903685-c4e4c7c3514c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1573505820053-179cc3de63e4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=600&q=80',
  ],
  'Сэлэнгэ': [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
  ],
  'Сүхбаатар': [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
  ],
  'Хэнтий': [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1573505820053-179cc3de63e4?auto=format&fit=crop&w=600&q=80',
  ],
  'Төв': [
    'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1573505820053-179cc3de63e4?auto=format&fit=crop&w=600&q=80',
  ],
}

/**
 * Get an image URL for a province location.
 * Uses the location's id to deterministically pick from the province's image pool.
 */
export function getProvinceImage(location) {
  if (location.image) return location.image
  const images = provinceImageMap[location.province]
  if (!images) return 'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=600&q=80'
  // Use a simple hash of the id to pick an image
  const idx = location.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % images.length
  return images[idx]
}
