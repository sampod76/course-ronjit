import { Model, Types } from 'mongoose';
import { IUser } from '../users/users.interface';
import { IFileUploade } from '../fileUploade/interface.fileUploade';

export type ICourseFilters = {
  searchTerm?: string;
  price?: number;
  date?: string;
  type?: string;
  status?: string;
  'reviews.star'?: number;
};

// export type ICourseSearchableField = {
//   title: string;
//   publisherName: string;
//   header_1: string;
//   header_2: string;
//   description: string;
//   courseId: string;
// };

export type IPublish = {
  status: 'active' | 'deactive' | 'save';
  date: string;
};

export type ICourse = {
  courseId: string;
  title: string;
  price?: number;
  type: 'free' | 'paid' | 'open' | 'closed' | 'recurrig';
  category: string;
  discount?: {
    value: number;
    startDate?: string;
    expiryDate?: string;
  };
  vat?: number;
  header_1?: string;
  header_2?: string;
  description?: string;
  thumbnail?: string | IFileUploade;
  images_album: Array<string | IFileUploade>;
  categoryDetails?: {
    category?: string; //_id
    title?: string; //category name
  };
  publish?: IPublish;
  publisher: Types.ObjectId | IUser;
  publisherName: string;
  status?: 'active' | 'deactive' | 'save';
  tag?: string[];
  reviews?: {
    userId: Types.ObjectId;
    star: number;
    message?: string;
  }[];
};

export type CourseModel = Model<ICourse, Record<string, unknown>>;
