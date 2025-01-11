export interface UserProfile {
  image: string;
  fullName: string;
  userName: string;
  basedIn: string;
  jobTitle: string;
  phone: string;
  email: string;
}

export interface ProfileSidebarProps {
  profile: UserProfile; 
}

export interface IFormInputs {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
