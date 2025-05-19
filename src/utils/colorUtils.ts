export type ColorType = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'transparent' | 'white' | 'rose' | 'dark';
 
export const getColorClass = (colorValue: string): string[] => {
  switch (colorValue) {
    case 'primary': return ['bg-blue-600', 'text-white'];
    case 'info': return ['bg-gradient-to-r', 'from-blue-600', 'to-indigo-700', 'text-white'];
    case 'success': return ['bg-green-500', 'text-white'];
    case 'warning': return ['bg-yellow-500', 'text-white'];
    case 'danger': return ['bg-red-500', 'text-white'];
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
    case 'info': return 'border-blue-600';
    case 'success': return 'border-green-500';
    case 'warning': return 'border-yellow-500';
    case 'danger': return 'border-red-500';
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
    case 'info': return 'text-blue-600';
    case 'success': return 'text-green-500';
    case 'warning': return 'text-yellow-500';
    case 'danger': return 'text-red-500';
    case 'transparent': return 'text-transparent';
    case 'white': return 'text-white';
    case 'rose': return 'text-pink-500';
    case 'dark': return 'text-gray-800';
    default: return 'text-gray-800';
  }
};
 
export const getHoverColorClass = (colorValue: string): string[] => {
  switch (colorValue) {
    case 'primary': return ['hover:bg-blue-700', 'hover:text-white', 'hover:shadow-md'];
    case 'info': return ['hover:from-blue-700', 'hover:to-indigo-800', 'hover:text-white', 'hover:shadow-md'];
    case 'success': return ['hover:bg-green-600', 'hover:text-white', 'hover:shadow-md'];
    case 'warning': return ['hover:bg-yellow-600', 'hover:text-white', 'hover:shadow-md'];
    case 'danger': return ['hover:bg-red-600', 'hover:text-white', 'hover:shadow-md'];
    case 'transparent': return ['hover:bg-gray-100'];
    case 'white': return ['hover:bg-gray-100', 'hover:text-gray-900'];
    case 'rose': return ['hover:bg-pink-600', 'hover:text-white', 'hover:shadow-md'];
    case 'dark': return ['hover:bg-gray-900', 'hover:text-white', 'hover:shadow-md'];
    default: return ['hover:bg-gray-100', 'hover:text-gray-900'];
  }
};
 
export const getGradientClass = (colorValue: string): string[] => {
  switch (colorValue) {
    case 'primary': return ['bg-gradient-to-r', 'from-blue-600', 'to-blue-700'];
    case 'info': return ['bg-gradient-to-r', 'from-blue-600', 'to-indigo-700'];
    case 'success': return ['bg-gradient-to-r', 'from-green-500', 'to-green-600'];
    case 'warning': return ['bg-gradient-to-r', 'from-yellow-500', 'to-amber-600'];
    case 'danger': return ['bg-gradient-to-r', 'from-red-500', 'to-red-600'];
    case 'rose': return ['bg-gradient-to-r', 'from-pink-500', 'to-rose-600'];
    case 'dark': return ['bg-gradient-to-r', 'from-gray-800', 'to-gray-900'];
    default: return ['bg-gradient-to-r', 'from-blue-600', 'to-indigo-700'];
  }
};
 
export const getSubtleTextColorClass = (colorValue: string): string => {
  switch (colorValue) {
    case 'primary': return 'text-blue-100';
    case 'info': return 'text-blue-100';
    case 'success': return 'text-green-100';
    case 'warning': return 'text-yellow-100';
    case 'danger': return 'text-red-100';
    case 'rose': return 'text-pink-100';
    case 'dark': return 'text-gray-300';
    case 'white': return 'text-gray-600';
    default: return 'text-gray-600';
  }
};
 
export const getTransitionClass = (): string => {
  return 'transition-all duration-300';
};
 
export const getShadowClass = (intensity: 'sm' | 'md' | 'lg' | 'xl' = 'md'): string => {
  switch (intensity) {
    case 'sm': return 'shadow-l';
    case 'md': return 'shadow-md';
    case 'lg': return 'shadow-lg';
    case 'xl': return 'shadow-xl';
    default: return 'shadow-md';
  }
};
 
export const getFocusRingClass = (colorValue: string): string => {
  switch (colorValue) {
    case 'primary': return 'focus:ring-blue-600 focus:ring-2 focus:ring-offset-2 focus:outline-none';
    case 'info': return 'focus:ring-blue-600 focus:ring-2 focus:ring-offset-2 focus:outline-none';
    case 'success': return 'focus:ring-green-500 focus:ring-2 focus:ring-offset-2 focus:outline-none';
    case 'warning': return 'focus:ring-yellow-500 focus:ring-2 focus:ring-offset-2 focus:outline-none';
    case 'danger': return 'focus:ring-red-500 focus:ring-2 focus:ring-offset-2 focus:outline-none';
    case 'rose': return 'focus:ring-pink-500 focus:ring-2 focus:ring-offset-2 focus:outline-none';
    case 'dark': return 'focus:ring-gray-800 focus:ring-2 focus:ring-offset-2 focus:outline-none';
    default: return 'focus:ring-blue-600 focus:ring-2 focus:ring-offset-2 focus:outline-none';
  }
};
  
export const getButtonClasses = (colorValue: string, outlined: boolean = false): string => {
  if (outlined) {
    return `${getBorderColorClass(colorValue)} ${getTextColorClass(colorValue)} bg-transparent border ${getTransitionClass()} rounded-lg py-2 px-4 ${getFocusRingClass(colorValue)} hover:bg-opacity-10 hover:${getTextColorClass(colorValue)} hover:shadow-l`;
  } else {
    return `${getColorClass(colorValue).join(' ')} ${getTransitionClass()} rounded-lg py-2 px-4 ${getFocusRingClass(colorValue)} ${getHoverColorClass(colorValue).join(' ')}`;
  }
};
 
export const getCardClasses = (withHover: boolean = false): string => {
  return `bg-white rounded-xl ${getShadowClass('md')} overflow-hidden ${withHover ? 'hover:shadow-lg ' + getTransitionClass() : ''}`;
};