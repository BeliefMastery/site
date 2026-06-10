import{a as e,c as t,d as n,f as r,h as i,i as a,l as o,m as s,o as c,s as l,t as u,u as d}from"./spa-engine-external-bvnqWVN1.js";import{t as f}from"./debug-reporter-BTFgBEv_.js";import{_ as p,a as m,h,i as g,l as _,m as v,n as y,p as b,r as x,t as S,u as C}from"./spa-questionnaire-host-5ue7H_jU.js";var w,T,E,D,O,k,A,j=class{constructor(e={}){u(this,e),this.currentPhase=1,this.currentQuestionIndex=0,this.answers={},this.questionSequence=[],this.vectorScores={},this.prioritizedVectors=[],this.assessedVectors=[],this.reportComplete=!1,this.analysisData={timestamp:new Date().toISOString(),phase1Results:{},phase2Results:{},phase3Results:{},vectorScores:{},identifiedVectors:[],primaryVector:null,supportingVectors:[],tactics:[],structuralModifier:null,allAnswers:{},questionSequence:[]},this.debugReporter=f(`ManipulationEngine`),i(this.debugReporter),this.debugReporter.markInitialized(),this.dataStore=new d(`manipulation-assessment`,`1.0.0`),this.ui=y(this,{idle:{show:[`#introSection`,`#actionButtonsSection`],hide:[`#questionnaireSection`,`#resultsSection`]},assessment:{show:[`#questionnaireSection`],hide:[`#introSection`,`#actionButtonsSection`,`#resultsSection`]},results:{show:[`#resultsSection`],hide:[`#introSection`,`#actionButtonsSection`,`#questionnaireSection`]}}),this.ready=this.init()}init(){return Promise.resolve(this.loadStoredData()).then(()=>g(this)).catch(e=>{this.debugReporter.logError(e,`init`)})}async loadManipulationData(){if(!(w&&k))try{w=(await s(`./manipulation-data/manipulation-vectors.js`,`Manipulation Vectors`)).MANIPULATION_VECTORS,T=(await s(`./manipulation-data/manipulation-tactics.js`,`Manipulation Tactics`)).MANIPULATION_TACTICS,E=(await s(`./manipulation-data/symptom-questions.js`,`Symptom Questions`)).SYMPTOM_QUESTIONS,D=(await s(`./manipulation-data/effect-questions.js`,`Effect Questions`)).EFFECT_QUESTIONS,O=(await s(`./manipulation-data/consequence-questions.js`,`Consequence Questions`)).CONSEQUENCE_QUESTIONS,(await s(`./manipulation-data/vector-mapping.js`,`Vector Mapping`)).VECTOR_MAPPING;let e=await s(`./manipulation-data/manipulation-questions-v2.js`,`Manipulation Questions`);k=e.PHASE_1_VECTOR_SCREENING,A=e.generatePhase3VectorQuestions,this.debugReporter.recordSection(`Phase 1`,k?.length||0)}catch(e){throw this.debugReporter.logError(e,`loadManipulationData`),n.showUserError(`Failed to load assessment data. Please refresh the page.`),e}}getEmptyAnalysisData(){return{timestamp:new Date().toISOString(),phase1Results:{},phase2Results:{},phase3Results:{},prioritizedVectors:[],assessedVectors:[],vectorScores:{},primaryVector:null,secondaryVectors:[],allAnswers:{},questionSequence:[]}}pickRandomIndices(e,t){let n=Array.from({length:e},(e,t)=>t);for(let e=n.length-1;e>0;--e){let t=Math.floor(Math.random()*(e+1));[n[e],n[t]]=[n[t],n[e]]}return n.slice(0,t)}answerQuestionForSample(e){if(!e||!Array.isArray(e.options)||e.options.length===0)return;if(e.type===`multiselect`){let t=e.maxSelections||3,n=Math.min(e.options.length,Math.max(1,Math.ceil(Math.random()*t))),r=this.pickRandomIndices(e.options.length,n).map(t=>e.options[t]);this.answers[e.id]=r,this.currentPhase===3&&this.processPhase3Answer(e);return}let t=e.options[Math.floor(Math.random()*e.options.length)];this.answers[e.id]=t,this.currentPhase===3&&this.processPhase3Answer(e)}async generateSampleReport(){try{if(await this.loadManipulationData(),this.currentPhase=1,this.currentQuestionIndex=0,this.answers={},this.questionSequence=[],this.prioritizedVectors=[],this.assessedVectors=[],this.analysisData=this.getEmptyAnalysisData(),await this.buildPhase1Sequence(),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),await this.analyzePhase1Results(),this.questionSequence.forEach(e=>this.answerQuestionForSample(e)),await this.processPhase2Results(),this.currentPhase===3&&this.questionSequence.length>0){for(let e=0;e<this.questionSequence.length;e+=1){let t=this.questionSequence[e];this.answerQuestionForSample(t)}this.processPhase3Results()}this.completeAssessment()}catch(e){this.debugReporter.logError(e,`generateSampleReport`),n.showUserError(`Failed to generate sample report. Please try again.`)}}startAssessment(){this.ui.transition(`assessment`),this.buildPhase1Sequence()}async buildPhase1Sequence(){await this.loadManipulationData(),this.questionSequence=[],this.currentPhase=1,this.currentQuestionIndex=0,this.questionSequence.push(...k),this.debugReporter.recordQuestionCount(this.questionSequence.length);let e=document.getElementById(`questionnaireSection`);e&&!e.classList.contains(`active`)&&e.classList.add(`active`),this.renderCurrentQuestion()}async analyzePhase1Results(){await this.loadManipulationData();try{this.vectorScores={},Object.keys(w).forEach(e=>{let t=w[e],n=0,r=0;k.forEach(t=>{let i=this.answers[t.id];if(i&&i.mapsTo&&i.mapsTo.vector===e){let e=i.mapsTo.state,t=i.mapsTo.weight||1;n+=(e===`high`?3:+(e===`medium`))*t,r+=t}});let i=r>0?n/r:0,a=i>=2?`high`:i>=.5?`medium`:`low`;this.vectorScores[e]={state:a,score:i,vector:t}}),this.analysisData.phase1Results=this.vectorScores,await this.buildPhase2Sequence()}catch(e){this.debugReporter.logError(e,`analyzePhase1Results`),n.showUserError(`Failed to analyze Phase 1 results. Please try again.`)}}async buildPhase2Sequence(){await this.loadManipulationData();try{this.questionSequence=[],this.currentPhase=2,this.currentQuestionIndex=0;let e=Object.keys(this.vectorScores).filter(e=>this.vectorScores[e].state===`high`||this.vectorScores[e].state===`medium`).map(e=>({id:e,vector:w[e],score:this.vectorScores[e].score,state:this.vectorScores[e].state})).sort((e,t)=>t.score-e.score).slice(0,6);this.questionSequence.push(v({id:`p2_prioritization`,question:`Based on your initial screening, how much do you want to explore each manipulation vector?`,type:`multiselect`,maxSelections:3,options:e.map(e=>({text:`${e.vector.name}: ${e.vector.description}`,mapsTo:{vector:e.id,priority:e.state===`high`?`high`:`medium`},vector:e.id})),phase:2,likelyVectors:e},{convertMultiselect:!0})),this.debugReporter.recordQuestionCount(this.questionSequence.length),this.renderCurrentQuestion()}catch(e){this.debugReporter.logError(e,`buildPhase2Sequence`),n.showUserError(`Failed to load Phase 2. Please refresh the page.`)}}async processPhase2Results(){try{let e=this.answers.p2_prioritization,t=this.questionSequence.find(e=>e.id===`p2_prioritization`);e?.weights&&t?.allocationMembers?(this.prioritizedVectors=p(e,t.allocationMembers,e=>e.mapsTo?.vector,12,3),this.analysisData.prioritizedVectors=this.prioritizedVectors):Array.isArray(e)&&(this.prioritizedVectors=e.map(e=>e.mapsTo.vector),this.analysisData.prioritizedVectors=this.prioritizedVectors),await this.buildPhase3Sequence()}catch(e){this.debugReporter.logError(e,`processPhase2Results`),n.showUserError(`Failed to process Phase 2 results.`)}}async buildPhase3Sequence(){await this.loadManipulationData();try{this.questionSequence=[],this.currentPhase=3,this.currentQuestionIndex=0;let e={symptoms:[],effects:[],consequences:[]};Object.keys(E).forEach(t=>{let n=E[t];Array.isArray(n)&&e.symptoms.push(...n)}),Object.keys(D).forEach(t=>{let n=D[t];Array.isArray(n)&&e.effects.push(...n)}),Object.keys(O).forEach(t=>{let n=O[t];Array.isArray(n)&&e.consequences.push(...n)}),this.prioritizedVectors.forEach(t=>{let n=w[t];n&&A(t,n,e).forEach(e=>{this.questionSequence.push({...e,phase:3,vector:t})})}),this.renderCurrentQuestion()}catch(e){this.debugReporter.logError(e,`buildPhase3Sequence`),n.showUserError(`Failed to build Phase 3 sequence. Please try again.`)}}processPhase3Answer(e){if(e.type===`binary_unsure`){let t=this.answers[e.id];if(t&&t.text){let n=e.conditional&&e.conditional[t.text];if(n){let t=this.questionSequence.findIndex(t=>t.id===e.id);h(n).forEach((n,r)=>{this.questionSequence.splice(t+1+r,0,{...n,phase:3,vector:e.vector})})}}}else if(e.type===`multiselect`&&e.conditional&&e.conditional.selected){let t=this.answers[e.id];if(t&&Array.isArray(t)&&t.length>0){let n=t.map(e=>e.mapsTo?.symptomId||e.mapsTo?.effectId||e.mapsTo?.consequenceId).filter(Boolean),r=e.conditional.selected.filter(e=>{if(e.conditional!==!0)return!1;let t=e.originalQuestion?.id;return t&&n.includes(t)});if(r.length>0){let t=this.questionSequence.findIndex(t=>t.id===e.id);r.forEach((n,r)=>{this.questionSequence.findIndex(e=>e.id===n.id)===-1&&this.questionSequence.splice(t+1+r,0,{...n,phase:3,vector:e.vector})})}}}}renderCurrentQuestion(){let e=performance.now();if(this.currentQuestionIndex>=this.questionSequence.length){this.completePhase();return}let t=this.questionSequence[this.currentQuestionIndex];if(x(this,t,{totalQuestions:this.questionSequence.length,questionIndex:this.currentQuestionIndex,phase:this.currentPhase,stageLabel:this.getPhaseLabel(this.currentPhase)}))return;let i=this._externalQuestionMount||document.getElementById(`questionContainer`);if(i)try{let n=``;t.type===`allocation`?n=C(t,this.answers[t.id],{phase:this.currentPhase,questionIndex:this.currentQuestionIndex,questionTotal:this.questionSequence.length,stageLabel:this.getPhaseLabel(this.currentPhase)}):t.type===`three_point`?n=this.renderThreePointQuestion(t):t.type===`binary_unsure`?n=this.renderBinaryUnsureQuestion(t):t.type===`frequency`?n=this.renderFrequencyQuestion(t):t.type===`multiselect`&&(n=this.renderMultiselectQuestion(t)),r.safeInnerHTML(i,n),this.attachQuestionListeners(t),t.type===`allocation`&&_(i,this,t);let a=performance.now()-e;this.debugReporter.recordRender(`question`,a),setTimeout(()=>{i.scrollIntoView({behavior:`smooth`,block:`start`})},100);let s=i.querySelector(`input, button, select, textarea`);s&&o.focusElement(s)}catch(e){this.debugReporter.logError(e,`renderCurrentQuestion`),n.showUserError(`Failed to render question. Please refresh the page.`)}}renderThreePointQuestion(e){let t=this.answers[e.id];return`
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex+1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${r.sanitizeHTML(e.question||``)}</h3>
        ${e.description?`<div class="question-description">${r.sanitizeHTML(e.description||``)}</div>`:``}
        <div class="three-point-options">
          ${e.options.map((n,i)=>`
            <label class="three-point-option ${t&&t.text===n.text?`selected`:``}">
              <input 
                type="radio" 
                name="question_${e.id}" 
                value="${i}"
                data-option-data='${JSON.stringify(n).replace(/'/g,`&apos;`)}'
                ${t&&t.text===n.text?`checked`:``}
              />
              <span class="option-text">${r.sanitizeHTML(n.text||``)}</span>
            </label>
          `).join(``)}
        </div>
      </div>
    `}renderBinaryUnsureQuestion(e){let t=this.answers[e.id];return`
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex+1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${r.sanitizeHTML(e.question||``)}</h3>
        ${e.description?`<div class="question-description">${r.sanitizeHTML(e.description||``)}</div>`:``}
        <div class="binary-unsure-options">
          ${e.options.map((n,i)=>`
            <label class="binary-unsure-option ${t&&t.text===n.text?`selected`:``}">
              <input 
                type="radio" 
                name="question_${e.id}" 
                value="${i}"
                data-option-data='${JSON.stringify(n).replace(/'/g,`&apos;`)}'
                ${t&&t.text===n.text?`checked`:``}
              />
              <span class="option-text">${r.sanitizeHTML(n.text||``)}</span>
            </label>
          `).join(``)}
        </div>
      </div>
    `}renderFrequencyQuestion(e){let t=this.answers[e.id];return`
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex+1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${r.sanitizeHTML(e.question||``)}</h3>
        ${e.description?`<div class="question-description">${r.sanitizeHTML(e.description||``)}</div>`:``}
        <div class="frequency-options">
          ${e.options.map((n,i)=>`
            <label class="frequency-option ${t&&t.text===n.text?`selected`:``}">
              <input 
                type="radio" 
                name="question_${e.id}" 
                value="${i}"
                data-option-data='${JSON.stringify(n).replace(/'/g,`&apos;`)}'
                ${t&&t.text===n.text?`checked`:``}
              />
              <span class="option-text">${r.sanitizeHTML(n.text||``)}</span>
            </label>
          `).join(``)}
        </div>
      </div>
    `}renderMultiselectQuestion(e){let t=this.answers[e.id]||[],n=e.maxSelections||3;return e.id===`p2_prioritization`?this.renderPhase2Prioritization(e,t,n):`
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex+1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${r.sanitizeHTML(e.question||``)}</h3>
        ${e.description?`<div class="question-description">${r.sanitizeHTML(e.description||``)}</div>`:``}
        <p class="selection-limit">Select all that apply${n<e.options.length?` (up to ${n})`:``}</p>
        <div class="multiselect-options">
          ${e.options.map((n,i)=>{let a=t.some(e=>e.text===n.text);return`
              <label class="multiselect-option ${a?`selected`:``}">
                <input 
                  type="checkbox" 
                  name="question_${e.id}" 
                  value="${i}"
                  data-option-data='${JSON.stringify(n).replace(/'/g,`&apos;`)}'
                  ${a?`checked`:``}
                />
                <span class="option-text">${r.sanitizeHTML(n.text||``)}</span>
              </label>
            `}).join(``)}
        </div>
        <div class="selection-count" id="selectionCount_${e.id}">Selected: ${t.length}${n<e.options.length?` / ${n}`:``}</div>
      </div>
    `}renderPhase2Prioritization(e,t,n){let i=Object.keys(this.vectorScores).filter(e=>this.vectorScores[e].state===`high`).map(e=>w[e].name),a=Object.keys(this.vectorScores).filter(e=>this.vectorScores[e].state===`medium`).map(e=>w[e].name),o=`
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex+1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <div class="warning-box">
          <h4>Your Vector Screening Summary</h4>
          ${i.length>0?`<p><strong>High concern:</strong> ${i.map(e=>r.sanitizeHTML(e||``)).join(`, `)}</p>`:``}
          ${a.length>0?`<p><strong>Moderate concern:</strong> ${a.map(e=>r.sanitizeHTML(e||``)).join(`, `)}</p>`:``}
          <p>Based on this screening, select 2-3 manipulation vectors you'd like to explore in depth.</p>
        </div>
        <h3 class="question-text">${r.sanitizeHTML(e.question||``)}</h3>
        <p class="selection-limit">Select up to ${n}</p>
        <div class="multiselect-options">
    `;return e.options.forEach((n,i)=>{let a=t.some(e=>e.text===n.text),s=w[n.mapsTo.vector];o+=`
        <label class="multiselect-option ${a?`selected`:``}">
          <input 
            type="checkbox" 
            name="question_${e.id}" 
            value="${i}"
            data-option-data='${JSON.stringify(n).replace(/'/g,`&apos;`)}'
            ${a?`checked`:``}
          />
          <div class="multiselect-content">
            <div class="multiselect-title vector-title">${r.sanitizeHTML(s.name||``)}</div>
            <div class="multiselect-description">${r.sanitizeHTML(s.description||``)}</div>
          </div>
        </label>
      `}),o+=`
        </div>
        <div class="selection-count" id="selectionCount_${e.id}">Selected: ${t.length} / ${n}</div>
      </div>
    `,o}attachQuestionListeners(e){if(e.type===`three_point`||e.type===`binary_unsure`||e.type===`frequency`)document.querySelectorAll(`input[name="question_${e.id}"]`).forEach(t=>{t.addEventListener(`change`,t=>{let n=JSON.parse(t.target.dataset.optionData);this.answers[e.id]=n,document.querySelectorAll(`.three-point-option, .binary-unsure-option, .frequency-option`).forEach(e=>{e.classList.remove(`selected`)}),t.target.closest(`label`).classList.add(`selected`),this.currentPhase===3&&this.processPhase3Answer(e),this.saveProgress()})});else if(e.type===`multiselect`){let t=document.querySelectorAll(`input[name="question_${e.id}"]`),n=e.maxSelections||3,r=document.getElementById(`selectionCount_${e.id}`);t.forEach(i=>{i.addEventListener(`change`,i=>{let a=Array.from(t).filter(e=>e.checked).map(e=>JSON.parse(e.dataset.optionData));if(a.length>n){i.target.checked=!1;return}if(this.answers[e.id]=a,document.querySelectorAll(`.multiselect-option`).forEach(e=>{e.classList.remove(`selected`)}),a.forEach(e=>{let n=Array.from(t).find(t=>JSON.parse(t.dataset.optionData).text===e.text);n&&n.closest(`label`).classList.add(`selected`)}),r){let t=n<e.options.length?` / ${n}`:``;r.textContent=`Selected: ${a.length}${t}`}this.currentPhase===3&&this.processPhase3Answer(e),this.saveProgress()})})}}getPhaseLabel(e){return{1:`Vector Screening`,2:`Vector Prioritization`,3:`Deep Assessment`}[e]||`Phase ${e}`}getPhaseLabelPlain(e){return{Ingress:`Entry Phase - Happens early in the relationship to draw you in`,Entrench:`Control Phase - Happens once they have you, to keep you trapped`,Extract:`Harvest Phase - Happens when they're taking what they want from you`}[e]||e||`Unknown phase`}getModeLabelPlain(e){return{Covert:`Hidden/Subtle - Hard to notice, sneaky manipulation`,Overt:`Open/Obvious - Direct and clear manipulation`,Contextual:`Depends on situation - Changes based on what works`,"Overt and Covert":`Both hidden and open - Uses whatever works in the moment`}[e]||e||`Unknown mode`}getActivationLevelLabel(e){return{high:`High - This manipulation is very active and strong`,medium:`Medium - This manipulation is moderately present`,low:`Low - This manipulation is present but weak`}[e]||e||`Unknown`}getStructuralModifierLabel(e){return{structural:`Structural - This is a deep, ongoing pattern that affects your whole life`,situational:`Situational - This happens in specific situations but isn't constant`,mixed:`Mixed - This shows up both as ongoing patterns and in specific situations`}[e]||e||`Unknown`}getTotalQuestions(){let e=0;return this.currentPhase>=1&&(e+=k.length),this.currentPhase>=2&&(e+=1),this.currentPhase>=3&&(e+=this.prioritizedVectors.length*6),e}getCurrentQuestionNumber(){let e=0;return this.currentPhase>1&&(e+=k.length),this.currentPhase>2&&(e+=1),e+=this.currentQuestionIndex,e}async nextQuestion(){let e=this.questionSequence[this.currentQuestionIndex];if(e?.type===`allocation`){if(!b(this.answers[e.id],e.allocationTargetSum??1e3)){n.showUserError(`Please distribute 100% across the options before continuing.`);return}}else if(e&&!this.answers[e.id]){n.showUserError(`Please select an answer before proceeding.`);return}this.saveCurrentAnswer(),this.currentQuestionIndex++,this.saveProgress(),this.currentQuestionIndex<this.questionSequence.length?this.renderCurrentQuestion():await this.completePhase()}prevQuestion(){this.currentQuestionIndex>0?(this.saveCurrentAnswer(),this.currentQuestionIndex--,this.renderCurrentQuestion(),this.saveProgress()):this.currentPhase>1&&(this.currentPhase--,this.currentPhase===1?this.buildPhase1Sequence():this.currentPhase===2&&(this.analyzePhase1Results(),this.buildPhase2Sequence()),this.currentQuestionIndex=this.questionSequence.length-1,this.renderCurrentQuestion(),this.saveProgress())}saveCurrentAnswer(){}async completePhase(){try{this.currentPhase===1?(await this.analyzePhase1Results(),this.questionSequence.length>0?this.renderCurrentQuestion():this.completeAssessment()):this.currentPhase===2?(await this.processPhase2Results(),this.questionSequence.length>0?this.renderCurrentQuestion():this.completeAssessment()):this.currentPhase===3&&(this.processPhase3Results(),this.completeAssessment())}catch(e){this.debugReporter.logError(e,`completePhase`),n.showUserError(`Failed to complete phase. Please try again.`)}}processPhase3Results(){this.analysisData.phase3Results={},this.assessedVectors=[...this.prioritizedVectors],this.prioritizedVectors.forEach(e=>{let t=Object.keys(this.answers).filter(t=>t.startsWith(`p3_${e}`)).map(e=>this.answers[e]),n=t.filter(e=>e&&e.mapsTo&&e.mapsTo.category===`symptoms`),r=t.filter(e=>e&&e.mapsTo&&e.mapsTo.category===`effects`),i=t.filter(e=>e&&e.mapsTo&&e.mapsTo.category===`consequences`),a=e=>{if(e.length===0)return 0;let t=e.reduce((e,t)=>(t.mapsTo&&t.mapsTo.frequency,e+(t.mapsTo&&t.mapsTo.weight?t.mapsTo.weight:0)),0);return e.length>0?t/e.length:0};this.analysisData.phase3Results[e]={vector:w[e],symptoms:{present:n.some(e=>e.mapsTo&&e.mapsTo.flow===`present`),score:a(n.filter(e=>e.mapsTo&&e.mapsTo.frequency))},effects:{present:r.some(e=>e.mapsTo&&e.mapsTo.flow===`present`),score:a(r.filter(e=>e.mapsTo&&e.mapsTo.frequency))},consequences:{present:i.some(e=>e.mapsTo&&e.mapsTo.flow===`present`),score:a(i.filter(e=>e.mapsTo&&e.mapsTo.frequency))},answers:t}})}async completeAssessment(){this.calculateResults(),this.analysisData.allAnswers={...this.answers},this.analysisData.questionSequence=this.getAllQuestionsAnswered(),this.reportComplete=!0,this.externalUI?await m(this,this.renderResults):await this.renderResults(),this.saveProgress()}getAllQuestionsAnswered(){let e=[];return k.forEach(t=>{e.push({id:t.id,question:t.question,phase:1,answer:this.answers[t.id]})}),e}calculateResults(){this.analysisData.vectorScores={},Object.keys(this.analysisData.phase3Results||{}).forEach(e=>{let t=this.analysisData.phase3Results[e],n=w[e],r=t.symptoms.present?t.symptoms.score:0,i=t.effects.present?t.effects.score:0,a=t.consequences.present?t.consequences.score:0,o=(r+i+a)/3,s=o*n.weight;this.analysisData.vectorScores[e]={name:n.name,description:n.description,rawScore:o,weightedScore:s,symptoms:t.symptoms,effects:t.effects,consequences:t.consequences,activationLevel:s>=6?`high`:s>=3?`medium`:`low`}});let e=Object.entries(this.analysisData.vectorScores).map(([e,t])=>({key:e,...t})).sort((e,t)=>t.weightedScore-e.weightedScore);e.length>0&&(this.analysisData.primaryVector=e[0],this.analysisData.supportingVectors=e.slice(1),this.analysisData.identifiedVectors=e),this.determineStructuralModifier(),this.identifyTactics()}determineStructuralModifier(){if(!this.analysisData.primaryVector)return;let e=this.analysisData.primaryVector,t=e.consequences?e.consequences.score:0,n=e.effects?e.effects.score:0,r=e.symptoms?e.symptoms.score:0;t>=6&&n>=6?this.analysisData.structuralModifier=`structural`:r>=6&&t<5?this.analysisData.structuralModifier=`situational`:this.analysisData.structuralModifier=`mixed`}identifyTactics(){if(this.analysisData.tactics=[],this.analysisData.primaryVector){let e=w[this.analysisData.primaryVector.key];e&&e.tactics&&e.tactics.forEach(e=>{let t=T[e];t&&this.analysisData.tactics.push(t)})}}async renderResults(e){let t=e||this._externalResultsMount||document.getElementById(`vectorResults`);if(t)try{await this.loadManipulationData();let e=`<div class="manipulation-summary">`;if(e+=`<h3>Manipulation Vector Analysis Results</h3>`,e+=`<p>Based on your responses, here are patterns that may be consistent with manipulation vectors and suggested strategies to strengthen your position.</p>`,e+=`<p class="form-help">This estimate is based on self-report patterns and is directional rather than definitive.</p>`,e+=`</div>`,this.analysisData.primaryVector){let t=this.analysisData.primaryVector,n=r.sanitizeHTML(t.name||`Unknown`),i=r.sanitizeHTML(t.description||``);e+=`
          <div class="vector-result warning-box">
            <h3>Primary Vector: ${n}</h3>
            <p>${i}</p>
            <p><strong>Activation Level:</strong> ${this.getActivationLevelLabel(t.activationLevel)}</p>
            ${this.analysisData.structuralModifier?`<p><strong>Pattern Type:</strong> ${this.getStructuralModifierLabel(this.analysisData.structuralModifier)}</p>`:``}
          </div>
        `}this.analysisData.supportingVectors&&this.analysisData.supportingVectors.length>0&&(e+=`<div class="supporting-vectors">`,e+=`<h4>Supporting Vectors</h4>`,this.analysisData.supportingVectors.forEach(t=>{let n=r.sanitizeHTML(t.name||`Unknown`),i=r.sanitizeHTML(t.description||``);e+=`
            <div class="vector-result" style="background: var(--glass); border-left: 3px solid var(--brand); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem;">
              <h4>${n}</h4>
              <p style="font-size: 0.9rem; color: var(--muted);">${i}</p>
            </div>
          `}),e+=`</div>`),this.analysisData.tactics&&this.analysisData.tactics.length>0&&(e+=`<div class="tactics-section">`,e+=`<h4>Identified Tactics</h4>`,e+=`<p class="content-section">These are specific manipulation tactics that may be present in your relationship. Each tactic includes examples and explanations in plain language.</p>`,this.analysisData.tactics.forEach(t=>{let n=this.getPhaseLabelPlain(t.phase),i=this.getModeLabelPlain(t.mode);e+=`
          <div class="tactic-item">
            <h5>${r.sanitizeHTML(t.name||``)}</h5>
            ${t.phase||t.mode?`
              <div class="tactic-context">
                ${t.mode?`<strong>How it works:</strong> ${r.sanitizeHTML(i||``)}`:``}
                ${t.phase&&t.mode?` • `:``}
                ${t.phase?`<strong>When it happens:</strong> ${r.sanitizeHTML(n||``)}`:``}
              </div>
            `:``}
            ${t.example?`
              <div class="tactic-example">
                <strong>Example:</strong>
                <p>"${r.sanitizeHTML(t.example||``)}"</p>
              </div>
            `:``}
            ${t.mechanism?`
              <div class="tactic-detail">
                <strong>What it does:</strong>
                <p>${r.sanitizeHTML(t.mechanism||``)}</p>
              </div>
            `:``}
            ${t.leverage?`
              <div class="tactic-detail">
                <strong>How it can influence your choices:</strong>
                <p>${r.sanitizeHTML(t.leverage||``)}</p>
              </div>
            `:``}
          </div>
        `}),e+=`</div>`),e+=`<div class="panel-brand-left" style="background: var(--glass); border-radius: var(--radius); padding: 1.25rem; margin-top: 2rem; border-left: 4px solid var(--accent);">`,e+=`<p style="margin: 0;"><strong style="color: var(--accent);">Explore further:</strong> Identifying vectors is the first step; building resistance is the next. <a href="sovereignty.html">Cognitive Resistance Capacity</a> maps your vulnerability profile and how to strengthen it; <a href="sovereignty-spectrum.html">Your Sovereignty Paradigm</a> shows how your values alignment affects what you defend against.</p>`,e+=`</div>`,r.safeInnerHTML(t,e)}catch(e){this.debugReporter.logError(e,`renderResults`),n.showUserError(`Failed to render results. Please refresh the page.`)}}exportReportHtml(){e({title:`Manipulation Vector Analysis`,filenameBase:`manipulation-analysis-${Date.now()}`,rootSelector:`#resultsSection`})||n.showUserError(`Could not build report file. Open results and try again.`)}exportAnalysis(e=`json`){e===`csv`?a(l(this.analysisData,`manipulation`,`Manipulation Vector Identification`),`manipulation-analysis-${Date.now()}.csv`,`text/csv`):a(t(this.analysisData,`manipulation`,`Manipulation Vector Identification`),`manipulation-analysis-${Date.now()}.json`,`application/json`)}exportExecutiveBrief(){a(c(this.analysisData,`manipulation`,`Manipulation Defense Decoder`),`manipulation-executive-brief-${Date.now()}.txt`,`text/plain`)}saveProgress(){try{let e={currentPhase:this.currentPhase,currentQuestionIndex:this.currentQuestionIndex,reportComplete:this.reportComplete===!0,answers:this.answers,vectorScores:this.vectorScores,prioritizedVectors:this.prioritizedVectors,assessedVectors:this.assessedVectors,analysisData:this.analysisData,timestamp:new Date().toISOString()};this.dataStore.save(`progress`,e)}catch(e){this.debugReporter.logError(e,`saveProgress`)}}async loadStoredData(){try{let e=this.dataStore.load(`progress`);if(!e)return;if(this.currentPhase=e.currentPhase||1,this.currentQuestionIndex=e.currentQuestionIndex||0,this.answers=e.answers||{},this.vectorScores=e.vectorScores||{},this.prioritizedVectors=e.prioritizedVectors||[],this.assessedVectors=e.assessedVectors||[],this.analysisData=e.analysisData||this.analysisData,this.reportComplete=e.reportComplete===!0,this.reportComplete&&this.analysisData?.primaryVector){await this.renderResults();return}(this.currentQuestionIndex>0||this.currentPhase>1)&&(this.currentPhase===1?await this.buildPhase1Sequence():this.currentPhase===2?(await this.analyzePhase1Results(),await this.buildPhase2Sequence()):this.currentPhase===3&&(await this.processPhase2Results(),await this.buildPhase3Sequence()),this.renderCurrentQuestion())}catch(e){console.error(`Error loading stored data:`,e)}}resetAssessment(){this.currentPhase=1,this.currentQuestionIndex=0,this.answers={},this.questionSequence=[],this.vectorScores={},this.prioritizedVectors=[],this.assessedVectors=[],this.analysisData={timestamp:new Date().toISOString(),phase1Results:{},phase2Results:{},phase3Results:{},vectorScores:{},identifiedVectors:[],primaryVector:null,supportingVectors:[],tactics:[],structuralModifier:null,allAnswers:{},questionSequence:[]},this.reportComplete=!1,sessionStorage.removeItem(`manipulationProgress`),this.dataStore.clear(`progress`),this._externalQuestionSnapshot=null,this.ui.transition(`idle`),this.buildPhase1Sequence()}};S(j,{legacyMarkerId:`questionContainer`});export{j as ManipulationEngine};