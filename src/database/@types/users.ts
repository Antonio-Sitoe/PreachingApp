import type { NewUser } from '../schemas';

export type UserInput = Pick<NewUser, 'name' | 'publisherType' | 'language' | 'monthlyHourGoal'>;

export type UserProfileInput = Required<Pick<UserInput, 'name' | 'publisherType' | 'language'>> &
  Pick<UserInput, 'monthlyHourGoal'>;
