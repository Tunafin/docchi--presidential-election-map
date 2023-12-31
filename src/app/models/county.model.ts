export interface CountyModel {
  行政區別: string;
  候選人資料列表: {
    選號: number;
    黨籍: string;
    候選人組合: string[];
    票數: number;
  }[];
  當選政黨: string;
  有效票數: number;
  無效票數: number;
  投票數: number;
  已領未投票數: number;
  選舉人數: number;
  投票率: number;
  '鄉(鎮、市、區)別': string;
}

export interface TownModel extends CountyModel {
  '鄉(鎮、市、區)別': string;
}
