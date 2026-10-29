// Actual evidence is kept separate from the illustrated fictional village.
import {PHOTOS} from './photos.js';
export const LABS={
 rice:{id:'rice',title:'논에서 일하는 모습',tag:'🌾 농사 방법 조사',question:'두 자료에서 농사 도구와 일하는 모습은 무엇이 같고 다를까요?',guide:['사진 속 사람들의 손과 도구를 자세히 살펴봐요.','영상을 멈추고 기계가 하는 일을 찾아봐요.','자료에서 직접 본 것과 그것을 보고 생각한 것을 나누어 적어요.'],notice:'서로 다른 지역과 시기의 농사 사례예요. 같은 마을의 과거·현재를 촬영한 자료는 아니에요.',compare:true,sources:[]},
 maps:{id:'maps',title:'대전의 땅은 어떻게 달라졌을까?',tag:'🗺️ 항공사진 비교 조사',question:'같은 장소에서 땅을 이용하는 모습이 어떻게 달라졌을까요?',guide:['하천이나 길을 기준으로 두 사진에서 같은 장소를 찾아요.','달라진 곳과 비슷하게 남아 있는 곳에 단서를 표시해요.','사진에서 확인한 모습과 변화에 대한 생각을 나누어 적어요.'],notice:'항공사진은 하늘에서 찍은 실제 사진이에요. 1970년·2021년의 같은 장소를 비교해요. 건물 용도·인구수는 사진만으로 확정할 수 없어요.',compare:true,sources:[]},
 grow:{id:'grow',title:'비닐하우스 안으로!',tag:'🍅 재배 시설 조사',question:'온실 안에서 작물이 자라도록 돕는 시설을 찾을 수 있나요?',guide:['작물 주변에 어떤 시설이 있는지 사진에서 찾아봐요.','영상에서 물을 주거나 온도를 조절하는 모습을 살펴봐요.','찾은 시설이 어떤 도움을 줄지 근거와 함께 생각해 봐요.'],notice:'서로 다른 농장의 실제 사례예요. 모든 비닐하우스에 같은 시설이 있는 것은 아니에요.',compare:true,sources:[]}
};

LABS.maps.sources=[1970,2021].map(year=>({
 id:'aerial-'+year,kind:'image',src:'assets/research/daejeon-'+year+'.jpg',title:year+'년 항공사진',date:year+'년 자료',place:'대전 갑천 주변 · 도룡동·만년동 일대',caption:'하늘에서 내려다보고 찍은 사진이에요. 북쪽은 위쪽이며, 두 사진은 같은 범위(가로 3.6km · 세로 2.55km)예요.',sourceUrl:'https://gis.daejeon.go.kr/ispmap.do?menu_cde=menu004',sourceName:'대전광역시 공간정보포털',credit:'대전광역시 · 연도별 항공사진. 같은 범위 자르기·크기 조절. 연도는 원출처 레이어 표기 기준.'
}));
LABS.rice.sources=[{
 id:'hand-1989',kind:'image',src:'assets/research/rice-hand-1989.jpg',title:'손으로 모를 심는 모습',date:'1989년 5월 19일 기록',place:'경기도 김포',caption:'사진을 확대해서 손과 도구, 논의 모습을 관찰해요.',sourceUrl:'https://www.ehistory.go.kr/view/photo?mediadtl=105207&mediagbn=PG&mediaid=12634&mediasrcgbn=PT',sourceName:'e영상역사관 기록 사진',credit:'문화체육관광부 e영상역사관 · 공공누리 제4유형 · 사진 원본 그대로. 단서 표시는 별도 화면 요소.'
},{
 id:'machine-2022',kind:'video',src:'assets/research/rice-machine-2022.mp4',poster:'assets/research/rice-machine-2022.jpg',title:'기계로 모를 심는 모습',date:'2022년 제작',place:'국내 벼농사 사례 · 상세 촬영지 미표기',caption:'25초 관찰 영상 · 무음 발췌. 사람과 기계가 하는 일을 살펴봐요.',sourceUrl:'https://www.nongsaro.go.kr/portal/ps/psb/psby/vodPlay.ps?menuId=PS65513&mvpClipNo=3&mvpNo=823',sourceName:'농촌진흥청 농사로',credit:'농촌진흥청 · 국립식량과학원 협조. 「벼 드문모 심기 재배기술 - 3. 모내기」. 공공누리 제2유형 · 발췌·무음·재압축.'
}];
LABS.grow.sources=[{
 id:'greenhouse-photo',kind:'image',src:PHOTOS.grow.src,title:'비닐하우스 내부 사진',date:'2020년 5월 9일 촬영',place:'대한민국 · 상세 촬영지 미표기',caption:'작물이 자라는 곳 주변의 시설을 찾아 표시해요.',sourceUrl:PHOTOS.grow.sourceUrl,sourceName:'Wikimedia Commons 원문',credit:PHOTOS.grow.creditLine+' · 크기 축소.'
},{
 id:'greenhouse-2017',kind:'video',src:'assets/research/greenhouse-2017.mp4',poster:'assets/research/greenhouse-2017.jpg',title:'온실을 관리하는 모습',date:'2017년 제작',place:'우리나라 온실 사례 · 일부 장면: 충남 부여',caption:'23초 관찰 영상 · 여러 구간 발췌·연결 편집·무음 처리. 작물 곁의 측정 장치, 물 공급 관, 온실 통로를 살펴봐요.',sourceUrl:'https://www.nongsaro.go.kr/portal/ps/psb/psby/vodPlay.ps?menuId=PS65513&mvpNo=1285',sourceName:'농촌진흥청 농사로',credit:'농촌진흥청 · 국립농업과학원 협조. 「ICT융복합 스마트팜 장비 표준화」. 공공누리 제2유형 · 발췌·무음·재압축.'
}];
