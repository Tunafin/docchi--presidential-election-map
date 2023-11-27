export interface PartyHistoryModel {
  party: string;
  data: {
    year: number, // 年份
    value: number, // 票數
    percentage: number // 得票率(0~100)
  }[];
}

// 資料為手動輸入
export function getDefaultPartyHistoryModelList(): PartyHistoryModel[] {
  return [
    {
      party: '中國國民黨',
      data: [
        { year: 1996, value: 5813699, percentage: 54.00 },
        { year: 2000, value: 2925513, percentage: 23.10 },
        { year: 2004, value: 6442452, percentage: 49.89 },
        { year: 2008, value: 7659014, percentage: 58.44 },
        { year: 2012, value: 6891139, percentage: 51.60 },
        { year: 2016, value: 3813365, percentage: 31.04 },
        { year: 2020, value: 5522119, percentage: 38.61 },
      ]
    },
    {
      party: '民主進步黨',
      data: [
        { year: 1996, value: 2274586, percentage: 21.13 },
        { year: 2000, value: 4977697, percentage: 39.30 },
        { year: 2004, value: 6471970, percentage: 50.11 },
        { year: 2008, value: 5444949, percentage: 41.55 },
        { year: 2012, value: 6093578, percentage: 45.63 },
        { year: 2016, value: 6894744, percentage: 56.12 },
        { year: 2020, value: 8170231, percentage: 57.13 },
      ]
    },
    {
      party: '親民黨',
      data: [
        { year: 2016, value: 1576861, percentage: 12.83 },
        { year: 2020, value: 608590, percentage: 4.26 },
      ]
    },
    {
      party: '其他',
      data: [
        { year: 1996, value: 1074044 + 1603790, percentage: 9.98 + 14.90 },
        { year: 2000, value: 4664972 + 16782 + 79429, percentage: 36.84 + 0.13 + 0.63 },
        { year: 2012, value: 369588, percentage: 2.76 },
      ]
    }
  ]
}
