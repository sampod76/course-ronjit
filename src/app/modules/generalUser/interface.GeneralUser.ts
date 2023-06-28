import { Model } from 'mongoose';

type IOtherInfo = { uid: string; photoURL: string };

type IPurchaseCourses = {
  courseId: string;
  total_completed_vedio: string[];
};

export type IGeneralUser = {
  name: string; //embedded object
  gender?: 'male' | 'female';
  dateOfBirth?: string;
  password?: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  uid?: string;
  otherInfo?: IOtherInfo;
  role: string;
  status?: 'active' | 'deactive';
  purchase_courses?: IPurchaseCourses[];
};

export type GeneralUserModel = Model<IGeneralUser, Record<string, unknown>>;

export type IGeneralUserFilters = {
  searchTerm?: string;
  email?: string;
  phone?: string;
};
