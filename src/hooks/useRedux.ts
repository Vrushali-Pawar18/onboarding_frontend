/**
 * Typed Redux Hooks
 * Pre-typed dispatch and selector hooks
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

/**
 * Pre-typed dispatch hook
 */
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

/**
 * Pre-typed selector hook
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
