# [THE F2E 2023] Mission 2 - 總統即時開票全台地圖

![docchi](https://firebasestorage.googleapis.com/v0/b/ithome2023-82cec.appspot.com/o/github%2Fdocchi.png?alt=media&token=74786611-0450-483a-ae92-8b601e7ea761)

## 專案介紹

本專案為 [THE F2E 2023] 關卡二的投稿作品，主題為「總統即時開票全台地圖」。

* Demo: [線上觀看連結](https://tunafin.github.io/docchi--presidential-election-map/)

* THE F2E 2023 官網: <https://2023.thef2e.com/>

* 畫面參考來源:
  * 名稱: 台灣歷年總統 都幾?
  * UI設計師: jhen
  * 連結: https://2023.thef2e.com/users/12061579704041679194?week=2

## 如何運行

安裝所需套件
```
npm install
```

在本地端運行
```
npm start
```

## 主要使用技術與版本

* Node.js (v20.9.0)
* Angular (v17)
* Angular Material
* ECharts (v5.4)

## 專案資料夾結構

```
src
│
├─app
│  │
│  ├─components              // 存放各種組件
│  │  ├─area-data-table
│  │  ├─current-data-chart
│  │  ├─history-data-chart
│  │  ├─map-chart
│  │  └─share-toolbox
│  │          
│  ├─models                  // 存放資料來源的對應模型
│  │      
│  └─pages                   // 頁面
│      ├─dashboard
│      └─start
│              
└─assets
    │
    ├─data                   // 資料來源
    │      
    └─images                 // 圖片
        └─persons
                

```

## 資料參考來源

* 中選會 - 選舉及公投資料庫
  * [歷屆投票資料](https://db.cec.gov.tw/ElecTable/Election?type=President)
* 政府資料開放平台:
  * [直轄市、縣市界線](https://data.gov.tw/dataset/7442)
  * [鄉鎮市區界線](https://data.gov.tw/dataset/7441)
