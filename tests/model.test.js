'use strict';const assert=require('node:assert/strict'),{createModel,validateCues,cueAt}=require('../dist/model.js');
const cfg={id:'test',layers:[{id:'a'},{id:'b'}],steps:[{layers:[]},{layers:['a']},{layers:['a','b']}],points:[{id:'x'}]};let passed=0;function test(name,f){f();console.log('PASS',name);passed++;}
test('initial layers empty',()=>assert.deepEqual(createModel(cfg).getState().layers,{a:false,b:false}));
test('steps accumulate',()=>assert.deepEqual(createModel(cfg).setStep(2).layers,{a:true,b:true}));
test('step clamps',()=>assert.equal(createModel(cfg).setStep(999).step,2));
test('invalid number rejected',()=>assert.throws(()=>createModel(cfg).setStep(NaN)));
test('independent manual layer',()=>{const m=createModel(cfg);m.setStep(2);m.toggle('b');assert.deepEqual(m.getState().layers,{a:true,b:false});});
test('snapshot isolated',()=>{const m=createModel(cfg);m.getState().layers.a=true;assert.equal(m.getState().layers.a,false);});
test('unknown layer rejected',()=>assert.throws(()=>createModel(cfg).toggle('z')));
test('unknown object rejected',()=>assert.throws(()=>createModel(cfg).select('z')));
const cues=[{start:0,end:2,step:0},{start:2,end:4,step:1},{start:5,end:7,step:2}];
test('cue boundaries half-open',()=>{assert.equal(cueAt(cues,2).step,1);assert.equal(cueAt(cues,4),null);});
test('cue overlap rejected',()=>assert.throws(()=>validateCues([{start:0,end:3,step:0},{start:2,end:4,step:1}],3)));
test('cue bounds rejected',()=>assert.throws(()=>validateCues([{start:0,end:3,step:3}],3)));
test('empty cues rejected',()=>assert.throws(()=>validateCues([],3)));
test('time seek forward/back',()=>{const m=createModel(cfg);m.loadCues(cues);assert.equal(m.synchronize(5.2).step,2);assert.equal(m.synchronize(.3).step,0);});
test('invalid replacement clears old cues',()=>{const m=createModel(cfg);m.loadCues(cues);assert.throws(()=>m.loadCues([]));assert.equal(m.synchronize(6).step,0);});
test('observation serializes',()=>assert.equal(JSON.parse(createModel(cfg).serialize()).scenario,'test'));
console.log(JSON.stringify({passed,failed:0}));
