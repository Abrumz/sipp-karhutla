 
export type ColorType = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'transparent' | 'white' | 'rose' | 'dark';
 
export const getColorClass = (colorValue: string): string[] => {
  switch (colorValue) {
    case 'primary': return ['bg-blue-600', 'text-white'];
    case 'info': return ['bg-sky-500', 'text-white'];
    case 'success': return ['bg-green-500', 'text-white'];
    case 'warning': return ['bg-yellow-500', 'text-white'];
    case 'danger': return ['bg-red-600', 'text-white'];
    case 'transparent': return ['bg-transparent'];
    case 'white': return ['bg-white', 'text-gray-800'];
    case 'rose': return ['bg-pink-500', 'text-white'];
    case 'dark': return ['bg-gray-800', 'text-white'];
    default: return ['bg-white', 'text-gray-800'];
  }
};
 
export const getBorderColorClass = (colorValue: string): string => {
  switch (colorValue) {
    case 'primary': return 'border-blue-600';
    case 'info': return 'border-sky-500';
    case 'success': return 'border-green-500';
    case 'warning': return 'border-yellow-500';
    case 'danger': return 'border-red-600';
    case 'transparent': return 'border-transparent';
    case 'white': return 'border-white';
    case 'rose': return 'border-pink-500';
    case 'dark': return 'border-gray-800';
    default: return 'border-gray-300';
  }
};
 
export const getTextColorClass = (colorValue: string): string => {
  switch (colorValue) {
    case 'primary': return 'text-blue-600';
    case 'info': return 'text-sky-500';
    case 'success': return 'text-green-500';
    case 'warning': return 'text-yellow-500';
    case 'danger': return 'text-red-600';
    case 'transparent': return 'text-transparent';
    case 'white': return 'text-white';
    case 'rose': return 'text-pink-500';
    case 'dark': return 'text-gray-800';
    default: return 'text-gray-800';
  }
};
 
export const getHoverColorClass = (colorValue: string): string[] => {
  switch (colorValue) {
    case 'primary': return ['hover:bg-blue-700', 'hover:text-white'];
    case 'info': return ['hover:bg-sky-600', 'hover:text-white'];
    case 'success': return ['hover:bg-green-600', 'hover:text-white'];
    case 'warning': return ['hover:bg-yellow-600', 'hover:text-white'];
    case 'danger': return ['hover:bg-red-700', 'hover:text-white'];
    case 'transparent': return ['hover:bg-gray-100'];
    case 'white': return ['hover:bg-gray-100', 'hover:text-gray-900'];
    case 'rose': return ['hover:bg-pink-600', 'hover:text-white'];
    case 'dark': return ['hover:bg-gray-900', 'hover:text-white'];
    default: return ['hover:bg-gray-100', 'hover:text-gray-900'];
  }
};