/* Entirely synthetic UI fixture. Pixel units only. Not a geographic map. MIT. */
window.SCENARIO={id:'synthetic-layer-fixture',width:1000,height:625,
  layers:[{id:'texture',name:'形状层'},{id:'line',name:'线条层'},{id:'points',name:'对象层'},{id:'event',name:'先后层'},{id:'evidence',name:'证据层'}],
  points:[{id:'a',name:'对象 A',x:240,y:330,note:'这是界面测试对象，没有真实地点、经纬度或历史含义。'},{id:'b',name:'对象 B',x:730,y:240,note:'这是界面测试对象，不代表城市、军营或人物位置。'}],
  steps:[
    {title:'先看空画布',text:'这是图层引擎的虚构网格测试，不是历史地图。每加一层，观察多了什么信息。',layers:[]},
    {title:'一层：形状',text:'抽象形状只演示底层淡入，不代表山地、陆地或边界。',layers:['texture']},
    {title:'二层：线条',text:'新线条叠在原形状上，前面的信息保留。它不是河流或道路。',layers:['texture','line']},
    {title:'三层：对象',text:'点击 A 或 B 聚焦。选择对象不改变已有图层。',layers:['texture','line','points']},
    {title:'四层：先后',text:'虚构对象之间的虚线只测试视觉顺序，不提供任何历史事实。',layers:['texture','line','points','event']},
    {title:'五层：证据',text:'真实项目应给每条主张独立来源和精度限制。此处仅展示证据槽。',layers:['texture','line','points','event','evidence']},
    {title:'关层比较',text:'去掉先后与证据层，观察基础信息仍然保留。也可以自己开关各层。',layers:['texture','line','points']}
  ]};
