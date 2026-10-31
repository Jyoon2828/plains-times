import test from 'node:test';
import assert from 'node:assert/strict';
import {RESEARCH_KEY,freshResearch,restoreResearch,createPin,pointOnImage,pinVisibleInSwipe,collectEvidence,readyToCompare,finishComparison,buildResearchHTML} from '../src/research-model.js';
const labs={maps:{id:'maps',title:'지도 조사',tag:'지도',question:'무엇이 달라졌나요?',notice:'같은 장소를 비교해요.',sources:[{id:'past',kind:'image',title:'옛 지도',date:'1970년',place:'대전',sourceName:'자료원',sourceUrl:'https://example.org/past',caption:'옛 지도 자료'},{id:'now',kind:'image',title:'최근 지도 비공개 내용',date:'2021년',place:'대전',sourceName:'자료원',sourceUrl:'https://example.org/now',caption:'최근 항공사진 미수집 내용'}]},rice:{id:'rice',title:'논 조사',sources:[]},grow:{id:'grow',title:'농업 참고',reference:true,sources:[]}};
const snapshot=()=>freshResearch(labs).labs.maps;
test('only an actually loaded source and an observation can become evidence',()=>{
 const record=snapshot();assert.equal(collectEvidence(record,'past',{observation:'길이 보여요.',mediaReady:false}),false);
 assert.equal(collectEvidence(record,'past',{observation:' ',mediaReady:true}),false);
 assert.equal(collectEvidence(record,'past',{observation:'길이 보여요.',pins:[createPin(.3,.5,'길')],mediaReady:true},'2026-10-29T00:00:00.000Z'),true);
 assert.equal(record.past.collected,true);assert.equal(record.now.collected,false);assert.equal(readyToCompare(record),false);
});
test('a comparison card needs collected evidence from both periods and a comparison sentence',()=>{
 const record=snapshot();collectEvidence(record,'past',{observation:'논을 보았어요.',mediaReady:true});
 assert.equal(finishComparison(record,'집이 늘었어요.'),false);
 collectEvidence(record,'now',{observation:'건물들이 보여요.',mediaReady:true});assert.equal(readyToCompare(record),true);
 assert.equal(finishComparison(record,' '),false);assert.equal(finishComparison(record,'같은 자리의 논 대신 건물들이 보여요.','하천은 남아 있어요.'),true);
 assert.equal(record.completed,true);assert.equal(record.unchanged,'하천은 남아 있어요.');
});
test('the evidence v2 save restores cards but never treats legacy completion as collected evidence',()=>{
 assert.equal(RESEARCH_KEY,'deulbit-evidence-v2');
 const legacy={version:1,labs:{maps:{observation:'기존 기록',inference:'기존 추리',completed:true,pins:{past:[{x:.2,y:.3}]}}}};
 assert.deepEqual(restoreResearch(JSON.stringify(legacy),labs),freshResearch(labs));
 const store=freshResearch(labs);collectEvidence(store.labs.maps,'past',{observation:'논',mediaReady:true});collectEvidence(store.labs.maps,'now',{observation:'건물',mediaReady:true});finishComparison(store.labs.maps,'논이 있던 자리에 건물이 있어요.');
 assert.deepEqual(restoreResearch(JSON.stringify(store),labs),store);assert.deepEqual(restoreResearch('{oops',labs),freshResearch(labs));
 const forged={version:2,labs:{maps:{past:{collected:true,observation:''},now:{collected:true,observation:'현재'},comparison:'비교',completed:true}}};
 assert.equal(restoreResearch(forged,labs).labs.maps.completed,false);assert.equal(restoreResearch(forged,labs).labs.maps.past.collected,false);
});
test('coordinates remain normalized; image padding and hidden periods cannot receive evidence pins',()=>{
 assert.deepEqual(createPin(-1,2,'a'),{x:0,y:1,label:'a'});assert.equal(createPin(NaN,.2),null);
 const rect={left:30,top:20,width:400,height:200};assert.deepEqual(pointOnImage(rect,230,120),{x:.5,y:.5,label:''});assert.equal(pointOnImage(rect,10,100),null);assert.equal(pointOnImage({...rect,width:0},50,30),null);
 assert.equal(pinVisibleInSwipe({x:.25},0,50),true);assert.equal(pinVisibleInSwipe({x:.25},1,50),false);assert.equal(pinVisibleInSwipe({x:.75},0,50),false);assert.equal(pinVisibleInSwipe({x:.75},1,50),true);
 assert.equal(pinVisibleInSwipe({x:.5},0,50),false);assert.equal(pinVisibleInSwipe({x:.5},1,50),true);
});
test('HTML export escapes student text and never reveals an uncollected source',()=>{
 const store=freshResearch(labs);collectEvidence(store.labs.maps,'past',{observation:'<script>alert("hi")</script>',pins:[createPin(.5,.5,'<img onerror=bad>')],mediaReady:true});
 const html=buildResearchHTML(labs,store,'<b>탐정</b>',{'maps/past':'data:image/png;base64,aGVsbG8=','maps/now':'data:image/png;base64,bm90eWV0'});
 assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>alert'));assert.ok(html.includes('&lt;b&gt;탐정&lt;/b&gt;'));assert.ok(html.includes('&lt;img onerror=bad&gt;'));
 assert.ok(html.includes('data:image/png;base64,aGVsbG8='));assert.ok(!html.includes('bm90eWV0'));assert.ok(!html.includes('최근 지도 비공개 내용'));assert.ok(!html.includes('최근 항공사진 미수집 내용'));
});
test('reference material never counts as a collected pair after restoring data',()=>{
 const store=freshResearch(labs);store.labs.grow.past={collected:true,observation:'시설',pins:[]};store.labs.grow.now={collected:true,observation:'시설',pins:[]};store.labs.grow.comparison='비교';store.labs.grow.completed=true;store.labs.grow.referenceNote='물을 주는 장치가 있어요.';
 const record=restoreResearch(store,labs).labs.grow;assert.equal(record.completed,false);assert.equal(record.past.collected,false);assert.equal(record.now.collected,false);assert.equal(record.referenceNote,'물을 주는 장치가 있어요.');
});
