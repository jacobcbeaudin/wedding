/**
 * Meal configuration for wedding reception.
 * Update these values when the menu is finalized.
 */

export const MEAL_OPTIONS = ['Fish', 'Beef', 'Vegetarian'] as const;

export type MealChoice = (typeof MEAL_OPTIONS)[number];

/**
 * Event slug that requires meal selection.
 */
export const MEAL_REQUIRED_EVENT = 'wedding';
