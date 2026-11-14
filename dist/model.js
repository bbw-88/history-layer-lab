/* Copyright 2026 History Layer Lab contributors. MIT License. */
'use strict';
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LayerEngine=api;})(globalThis,()=>{
  function validateCues(cues,stepCount){
    if(!Array.isArray(cues)||!cues.length||cues.length>500)throw Error('需要1–500段动作轴');
    let end=-1;
    return cues.map(c=>{
      if(!c||!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.start<end||c.end<=c.start||!Number.isInteger(c.step)||c.step<0||c.step>=stepCount)throw Error('时间须有序、不重叠；步骤须在范围内');
      end=c.end;return{start:c.start,end:c.end,step:c.step};
    });
  }
  function cueAt(cues,time){if(!Number.isFinite(time)||time<0)return null;return cues.find(c=>time>=c.start&&time<c.end)||null;}
  function createModel(config){
    const keys=config.layers.map(l=>l.id);
    if(!keys.length||new Set(keys).size!==keys.length||!config.steps.length)throw Error('需要唯一图层及步骤');
    config.steps.forEach(s=>{if(!Array.isArray(s.layers)||s.layers.some(k=>!keys.includes(k)))throw Error('步骤包含未知图层');});
    let state={step:0,layers:{},mode:'step',selected:null},cues=[];
    const snapshot=()=>JSON.parse(JSON.stringify(state));
    function setStep(n){if(!Number.isInteger(n))throw Error('步骤必须是整数');state.step=Math.max(0,Math.min(config.steps.length-1,n));state.layers=Object.fromEntries(keys.map(k=>[k,config.steps[state.step].layers.includes(k)]));state.mode='step';state.selected=null;return snapshot();}
    setStep(0);
    return{
      getState:snapshot,setStep,
      toggle(k,value){if(!keys.includes(k))throw Error('未知图层');state.layers[k]=typeof value==='boolean'?value:!state.layers[k];state.mode='manual';return snapshot();},
      select(id){if(id!==null&&!config.points.some(p=>p.id===id))throw Error('未知对象');state.selected=id;state.mode='manual';return snapshot();},
      loadCues(input){cues=[];cues=validateCues(input,config.steps.length);return cues.length;},
      synchronize(time){const c=cueAt(cues,time);if(c&&c.step!==state.step)setStep(c.step);return snapshot();},
      serialize(){return JSON.stringify({schema:'layer-engine-observation-v1',scenario:config.id,...snapshot()});}
    };
  }
  return{validateCues,cueAt,createModel};
});
