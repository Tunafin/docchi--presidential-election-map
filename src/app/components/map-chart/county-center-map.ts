interface Center {
  center: number[];
  zoom: number;
}

const defaultCenter: Center = {
  center: [120.7, 23.8],
  zoom: 4
}

// 包含改制後的縣市及舊桃園縣
const countyCenterMap = new Map<string, Center>();
countyCenterMap.set('新北市', { center: [121.30, 25.03], zoom: 8 });
countyCenterMap.set('臺北市', { center: [121.30, 25.03], zoom: 8 });
countyCenterMap.set('高雄市', { center: [120.37, 22.38], zoom: 8 });
countyCenterMap.set('基隆市', { center: [121.44, 25.08], zoom: 8 });
countyCenterMap.set('新竹市', { center: [120.88, 24.48], zoom: 8 });
countyCenterMap.set('臺中市', { center: [120.70, 24.09], zoom: 8 });
countyCenterMap.set('臺南市', { center: [120.32, 23.00], zoom: 8 });
countyCenterMap.set('宜蘭縣', { center: [121.45, 24.46], zoom: 8 });
countyCenterMap.set('桃園市', { center: [121.18, 24.59], zoom: 8 });
countyCenterMap.set('桃園縣', { center: [121.18, 24.59], zoom: 8 });
countyCenterMap.set('新竹縣', { center: [121.00, 24.46], zoom: 8 });
countyCenterMap.set('苗栗縣', { center: [120.79, 24.33], zoom: 8 });
countyCenterMap.set('彰化縣', { center: [120.32, 24.04], zoom: 8 });
countyCenterMap.set('南投縣', { center: [121.00, 23.54], zoom: 8 });
countyCenterMap.set('雲林縣', { center: [120.32, 23.42], zoom: 8 });
countyCenterMap.set('嘉義縣', { center: [120.27, 23.29], zoom: 8 });
countyCenterMap.set('嘉義市', { center: [120.27, 23.29], zoom: 8 });
countyCenterMap.set('屏東縣', { center: [120.49, 22.39], zoom: 8 });
countyCenterMap.set('花蓮縣', { center: [121.36, 23.59], zoom: 8 });
countyCenterMap.set('臺東縣', { center: [121.09, 22.45], zoom: 8 });
countyCenterMap.set('澎湖縣', { center: [119.87, 23.29], zoom: 10 });
countyCenterMap.set('金門縣', { center: [119.87, 24.50], zoom: 10 });
countyCenterMap.set('連江縣', { center: [120.50, 25.25], zoom: 10 });

export { defaultCenter, countyCenterMap };
