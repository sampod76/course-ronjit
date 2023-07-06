import { Model } from 'mongoose';
import { IPhotoContestUser } from '../photoContest/photoContest.interface';
import { IFileUploade } from '../fileUploade/interface.fileUploade';

// import { IFileUploade } from '../fileUploade/interface.fileUploade';

export type IRunContestFilters = {
  searchTerm?: string;
  title?: string;
  status?: 'active' | 'deactive' | 'save';
};

export type IRunContestSearchableField = {
  title?: string;
  header_1?: string;
  description?: string;
};

export type IRunContest = {
  contestId: number;
  title?: string;
  header_1?: string;
  description?: string;
  thumbnail?: string | IFileUploade;
  // images_album: (string | IFileUploade)[];
  images_album: Array<string | IFileUploade>;
  status?: 'active' | 'deactive' | 'save';
  winnerList?: IPhotoContestUser[];
  winnerPrize?: [];
  duration_time: {
    startDate: string;
    endDate: string;
  };
};

export type RunContestModel = Model<IRunContest, Record<string, unknown>>;
