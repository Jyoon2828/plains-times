import test from 'node:test';
import assert from 'node:assert/strict';
import {freshResearch,restoreResearch,createPin,pointOnImage,pinVisibleInSwipe,finishRecord,buildResearchHTML} from '../src/research-model.js';
const labs={maps:{id:'maps',title:'지도 조사',tag:'지도',question:'무엇이 달라졌나요?',notice:'같은 장소를 비교해요.',sources:[{id:'past',kind:'image',title:'옛 지도',date:'1970년',place:'대전',src:'past.jpg',sourceName:'자료원',sourceUrl:'https://example.org/map',caption:'지도 자료'}]},rice:{id:'rice',title:'논 조사',tag:'농사',question:'어떻게 농사짓나요?',sources:[{id:'video',kind:'video',title:'농사 영상',date:'2022년',place:'우리나라',sourceName:'자료원',sourceUrl:'https://example.org/video'}]}};
test('fieldwork drafts and completion survive storage restoration',()=>{
 const store=freshResearch(labs),record=store.labs.maps;
 record.observation='논 옆에 길이 보여요.';record.inference='사람들이 오가기 편해졌을 것 같아요.';record.pins.past.push(createPin(.2,.7,'길'));
 assert.equal(finishRecord(record,'2026-10-29T00:00:00.000Z'),true);
 const restored=restoreResearch(JSON.stringify(store),labs);assert.deepEqual(restored,store);
 assert.equal(finishRecord(store.labs.rice),false);
});
test('restoration sanitizes corrupt data and keeps only known sources',()=>{
 assert.deepEqual(restoreResearch('{oops',labs),freshResearch(labs));
 const input={version:1,labs:{maps:{observation:'',inference:12,completed:true,updatedAt:'invalid',pins:{past:[{x:Infinity,y:.3},{x:-2,y:5,label:'edge'},{x:.4,y:.5,label:3}],unknown:[{x:.1,y:.2}]}},unknown:{completed:true}}};
 const store=restoreResearch(input,labs);assert.equal(store.labs.maps.completed,false);assert.equal(store.labs.maps.updatedAt,null);assert.equal(store.labs.maps.inference,'');
 assert.deepEqual(store.labs.maps.pins.past,[{x:0,y:1,label:'edge'},{x:.4,y:.5,label:''}]);assert.equal(store.labs.maps.pins.unknown,undefined);assert.equal(store.labs.unknown,undefined);
});
test('pin coordinates stay normalized and ignore clicks outside the actual photo',()=>{
 assert.deepEqual(createPin(-1,2,'a'),{x:0,y:1,label:'a'});assert.equal(createPin(NaN,.2),null);
 const rect={left:30,top:20,width:400,height:200};assert.deepEqual(pointOnImage(rect,230,120),{x:.5,y:.5,label:''});assert.equal(pointOnImage(rect,10,100),null);assert.equal(pointOnImage({...rect,width:0},50,30),null);
});
test('a swipe only shows evidence pins belonging to the visible period',()=>{
 assert.equal(pinVisibleInSwipe({x:.25},0,50),true);assert.equal(pinVisibleInSwipe({x:.25},1,50),false);
 assert.equal(pinVisibleInSwipe({x:.75},0,50),false);assert.equal(pinVisibleInSwipe({x:.75},1,50),true);
 assert.equal(pinVisibleInSwipe({x:.5},0,50),false);assert.equal(pinVisibleInSwipe({x:.5},1,50),true);
 assert.equal(pinVisibleInSwipe({x:.2},0,0),false);assert.equal(pinVisibleInSwipe({x:.2},1,0),true);
});
test('downloaded notebook escapes student text and embeds only valid image data',()=>{
 const store=freshResearch(labs);store.labs.maps.observation='<script>alert("hi")</script>';store.labs.maps.pins.past=[createPin(.5,.5,'<img onerror=bad>')];
 const html=buildResearchHTML(labs,store,'<b>탐정</b>',{'maps/past':'data:image/png;base64,aGVsbG8='});
 assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>alert'));assert.ok(html.includes('&lt;b&gt;탐정&lt;/b&gt;'));assert.ok(html.includes('&lt;img onerror=bad&gt;'));assert.ok(html.includes('data:image/png;base64,aGVsbG8='));assert.ok(html.includes('left:50%;top:50%'));
 const bad=buildResearchHTML(labs,store,'탐정',{'maps/past':'javascript:bad()'});assert.ok(!bad.includes('javascript:bad'));
});
