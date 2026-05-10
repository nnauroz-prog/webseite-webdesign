import { idleState, type ActionState } from "@/lib/actions/shared";

/**
 * Initial states for forms wired up via React's useActionState.
 *
 * Lives in this non-"use server" module because Next.js 16 / Turbopack
 * rejects any non-async-function export from a "use server" file at
 * runtime ("A 'use server' file can only export async functions"). The
 * action files themselves stay slim and only expose their async actions;
 * forms import their initial state from here.
 */

export const initialState: ActionState = idleState;
export const initialServiceState: ActionState = idleState;
export const initialTeamState: ActionState = idleState;
export const initialGalleryState: ActionState = idleState;
export const initialLeadState: ActionState = idleState;
export const initialApplicationState: ActionState = idleState;
export const initialBookingState: ActionState = idleState;
export const initialAdminState: ActionState = idleState;
export const initialInquiryState: ActionState = idleState;
