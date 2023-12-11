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
countyCenterMap.set('新北市', { center: [121.65, 25.03], zoom: 16 });
countyCenterMap.set('臺北市', { center: [121.50, 25.03], zoom: 20 });
countyCenterMap.set('高雄市', { center: [120.57, 22.98], zoom: 12 });
countyCenterMap.set('基隆市', { center: [121.70, 25.08], zoom: 20 });
countyCenterMap.set('新竹市', { center: [120.98, 24.88], zoom: 20 });
countyCenterMap.set('臺中市', { center: [120.94, 24.29], zoom: 12 });
countyCenterMap.set('臺南市', { center: [120.32, 23.30], zoom: 16 });
countyCenterMap.set('宜蘭縣', { center: [121.65, 24.66], zoom: 16 });
countyCenterMap.set('桃園市', { center: [121.18, 24.99], zoom: 16 });
countyCenterMap.set('桃園縣', { center: [121.18, 24.99], zoom: 16 });
countyCenterMap.set('新竹縣', { center: [121.12, 24.86], zoom: 16 });
countyCenterMap.set('苗栗縣', { center: [120.89, 24.43], zoom: 16 });
countyCenterMap.set('彰化縣', { center: [120.52, 24.04], zoom: 16 });
countyCenterMap.set('南投縣', { center: [121.02, 23.84], zoom: 12 });
countyCenterMap.set('雲林縣', { center: [120.42, 23.82], zoom: 16 });
countyCenterMap.set('嘉義縣', { center: [120.47, 23.39], zoom: 16 });
countyCenterMap.set('嘉義市', { center: [120.47, 23.39], zoom: 20 });
countyCenterMap.set('屏東縣', { center: [120.63, 22.42], zoom: 16 });
countyCenterMap.set('花蓮縣', { center: [121.36, 23.79], zoom: 12 });
countyCenterMap.set('臺東縣', { center: [121.14, 22.75], zoom: 12 });
countyCenterMap.set('澎湖縣', { center: [119.57, 23.59], zoom: 20 });
countyCenterMap.set('金門縣', { center: [119.77, 24.70], zoom: 16 });
countyCenterMap.set('連江縣', { center: [120.57, 25.62], zoom: 12 });

export { defaultCenter, countyCenterMap };
