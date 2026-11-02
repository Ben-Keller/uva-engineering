(() => {
'use strict';
const R = window.UVA_REPORT;
const C = R.copy;
const $ = q => document.querySelector(q);
const $$ = q => Array.from(document.querySelectorAll(q));
const safe = s => String(s ?? '').replace(/[&<>"']/g, a => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[a]));
const p = n => `assets/media/${n}.webp`;
const photo = (file, cls='', opts='') => `<img src="${safe(file)}" class="${cls}" alt="" ${opts}>`;
const copy = key => safe(C[key]?.copy || '');
const menuImages = {about:'p03-00',undergraduate:'p05-00',experience:'p10-00',graduate:'p11-00',research:'p14-00',ventures:'p19-01',industry:'p21-01',community:'p22-00',alumni:'p23-00',operations:'p26-00',philanthropy:'p27-00',leadership:'p29-12',trustees:'p30-00'};
const mainChapters = R.chapters;
const journeyChapters = [{id:'cover',label:'Cover'}, ...mainChapters];
const navPhoto = id => p(menuImages[id]||'p01-00');
const sectionNavigator = `<nav class="section-nav" id="sectionNav" aria-label="Section navigation">
 <button type="button" class="section-trigger" id="sectionTrigger" aria-expanded="false" aria-controls="sectionPanel">
  <span class="section-number" id="sectionNumber">00</span>
  <span class="section-readout"><span class="section-eyebrow">YOU ARE READING</span><span class="title-window" id="titleWindow"><span class="title-track" id="titleTrack"><span class="title-line" id="currentTitle">Cover</span><span class="title-line" id="nextTitle" aria-hidden="true">About UVA Engineering</span></span></span></span>
  <span class="section-invitation">Explore chapters <span class="section-plus" aria-hidden="true">+</span></span>
 </button>
 <div class="section-progress" aria-hidden="true"><i id="sectionProgress"></i></div>
 <div class="section-panel" id="sectionPanel" inert>
  <div class="panel-heading"><span>CHOOSE YOUR NEXT CHAPTER</span><span>2026 / IMPACT REPORT</span></div>
  <div class="panel-content"><ol class="chapter-options">${journeyChapters.map((x,i)=>`<li><a href="#${x.id}" data-section-link="${i}"><span class="option-index">${String(i).padStart(2,'0')}</span><span class="option-label">${safe(x.label)}</span><span class="option-arrow" aria-hidden="true">↗</span></a></li>`).join('')}</ol>
  <figure class="chapter-preview"><img id="chapterPreviewImage" src="${navPhoto('about')}" alt=""><figcaption><span id="chapterPreviewNumber">01 / 13</span><strong id="chapterPreviewTitle">About UVA Engineering</strong><span>Discover the people. Explore the impact.</span></figcaption></figure></div>
 </div>
</nav>`;
const strategyImgs = ['p06-00','p14-00','p19-01','p28-00'];
const teamNames = ['Mechatronics and Robotics Society (MARS)','Rocketry Team','Concrete Canoe Team','Cyber Defense Team'];
const teamImages = ['p10-00','p08-00','p04-00','p27-01'];
const teams = teamNames.map((name,i)=>({...R.teams.find(t=>t.heading===name),image:p(teamImages[i])}));
const metric = (value, label, extra='') => `<div class="metric ${extra}"><strong>${safe(value)}</strong><span>${safe(label)}</span></div>`;
const leaderTiles = R.leaders.map((x,i)=>`<button type="button" class="person-tile" data-person="${i}" aria-label="${safe(x.name)} — ${safe(x.role)}">${photo(x.image,'person-image','loading="lazy"')}<span>${safe(x.name)}</span></button>`).join('');
const revenueColors = ['#15365c','#35648b','#5c88ac','#89a4ba','#bdc5d1','#dadfe4','#f3a06a','#ef712d'];
const dollar = v => '$'+Number(v).toFixed(Number.isInteger(Number(v))?0:1)+'M';
// Complete, verbatim opening sentences from the four corresponding report articles.
const researchBriefs=R.research.map((x,i)=>x.text.slice(0, x.text.indexOf([' Fioretto’s project',' The project,',' Launched with support',' Nikolaos (Nikos)'][i])));
const totalRev=R.revenue.reduce((s,x)=>s+x.value,0);
let accLen=0;
const circumference=2*Math.PI*91;
const donutPaths=R.revenue.map((x,i)=>{
 const length=x.value/totalRev*circumference,offset=-accLen; accLen+=length;
 return `<circle data-rev="${i}" tabindex="0" role="button" aria-label="${safe(x.name)} ${dollar(x.value)}" cx="0" cy="0" r="91" fill="none" stroke="${revenueColors[i]}" stroke-width="32" stroke-dasharray="${Math.max(0,length-.75)} ${circumference-Math.max(0,length-.75)}" stroke-dashoffset="${offset}" transform="rotate(-90)"/>`;
}).join('');
const revenueRows=R.revenue.map((x,i)=>`<button type="button" class="revenue-row" data-rev="${i}"><i style="background:${revenueColors[i]}"></i><span>${safe(x.name)}</span><strong>${dollar(x.value)}</strong></button>`).join('');

$('#app').innerHTML = `
<header class="header" id="header">
  <a class="logo" href="#cover"><span class="logo-mark" aria-hidden="true"></span><span>UVA<br><b>ENGINEERING</b></span></a>
  <div class="current-chapter" id="chapterReading">2026 IMPACT REPORT <span class="preview-badge">CLIENT PREVIEW</span></div>
  <div class="header-actions"><button type="button" id="openSearch">SEARCH</button><button type="button" id="openMenu">CONTENTS <i class="hamburger"></i></button></div>
</header>
<div class="read-progress" id="readProgress"></div>
${sectionNavigator}
<main>
<section class="cover chapter ink-dark" id="cover" data-nav="Cover">
  ${photo(p('p01-00'),'cover-image','fetchpriority="high"')}
  <div class="cover-pattern" aria-hidden="true"></div>
  <div class="cover-inner">
    <div class="cover-topline">UVA ENGINEERING</div>
    <div class="cover-middle"><div class="cover-headline"><h1>IMPACT<br>REPORT</h1><div class="cover-rule"></div><p>ENGINEERING<br><em>for the</em><br>GREATER GOOD</p></div><div class="cover-year" aria-label="2026"><span>20</span><span>26</span></div></div>
    <div class="cover-bottom"><p>${copy('dean')}</p><a href="#about" class="downscroll" aria-label="Continue to the report"><span>SCROLL</span> ↓</a></div>
  </div>
</section>
<section class="mission chapter" id="about" data-nav="About UVA Engineering">
  <div class="mission-image image-motion">${photo(p('p03-00'),'full-image','loading="lazy"')}</div>
  <div class="mission-panel"><div class="micro-rule"></div><div class="mission-display">BUILDING A<br><em>BRIGHTER FUTURE</em><span>through</span><br>ENGINEERING<br><small>for the</small> GREATER GOOD</div>
    <p class="lead">${copy('intro')}</p><p class="copy-text">${copy('about2')}</p>
    
  </div>
</section>
<section class="priorities ink-dark" id="priorities" data-nav="About UVA Engineering">
  <div class="priorities-heading"><div class="labeled-rule"><span>STRATEGIC PRIORITIES</span></div><h2>ENGINEERING<br><i>for the</i><br>GREATER GOOD</h2></div>
  <div class="priorities-interaction">
    <div class="priority-art" id="priorityArt">${photo(p(strategyImgs[0]),'priority-photo','loading="lazy"')}<div class="priority-index">01 / 04</div></div>
    <div class="priority-items" id="priorityItems">${C.strategies.map((s,i)=>`<button type="button" class="priority-item ${i===0?'selected':''}" data-priority="${i}" aria-pressed="${i===0}"><span>${String(i+1).padStart(2,'0')}</span><strong>${safe(s)}</strong><b>↗</b></button>`).join('')}</div>
  </div>
  <div class="priority-metrics">${metric('4,534','Students')}${metric('268','Faculty Members')}${metric('$84M','Annual Research Expenditures')}</div>
</section>

<section class="chapter" id="undergraduate" data-nav="Undergraduate Education">
  <div class="chapter-hero undergrad-hero ink-dark">${photo(p('p05-00'),'full-image','loading="lazy"')}<div class="chapter-hero-gradient"></div><div class="chapter-hero-body"><h2>UNDERGRADUATE<br><span>EDUCATION</span></h2><p>${copy('undergrad')}</p></div><div class="chapter-number">08–13</div></div>
  <div class="education-bridge">
    <div class="education-copy"><div class="vertical-rule"></div><h3>THE FIRST-YEAR<br>ENGINEERING CENTER</h3><p>${copy('firstyear')}</p></div>
    <div class="education-detail image-motion">${photo(p('p06-00'),'full-image','loading="lazy"')}</div>
    <div class="education-side">${metric('97%','Graduation Rate')}<p>${copy('undergradfellow')}</p></div>
  </div>
  <div class="story-module-head"><h3>UNDERGRADUATE STUDENTS</h3><span>Class of <b>2026</b></span></div>
  <div class="profiles-scroll" id="profileScroller">
    <div class="profile-stage" id="profileStage"><div class="profile-picture">${photo(R.portraits[0].image,'','id="profileStageImage" loading="lazy"')}<div class="profile-floating-number" id="profileNumber">01 / 04</div></div><div class="profile-thumbnail-nav" id="profileThumbs">${R.portraits.map((x,i)=>`<button type="button" class="${i===0?'selected':''}" data-go-profile="${i}" aria-label="Go to ${safe(x.heading)}">${photo(x.image)}</button>`).join('')}</div></div>
    <div class="profile-stories">${R.portraits.map((x,i)=>`<article class="profile-step reveal" id="profile-step-${i}" data-profile-step="${i}"><div class="profile-count">${String(i+1).padStart(2,'0')} / 04</div><h4>${safe(x.heading)}</h4><p>${safe(x.text)}</p></article>`).join('')}</div>
  </div>
</section>

<section class="chapter" id="experience" data-nav="Student Experience">
  <div class="mars-layout ink-dark">
    <div class="mars-sticky-photo image-motion">${photo(p('p10-00'),'full-image','loading="lazy"')}<span class="image-source-text">UVA ENGINEERING’S MARS TEAM</span></div>
    <div class="mars-narrative"><div class="mars-chapter-heading"><div class="micro-rule"></div><h2>STUDENT<br><em>EXPERIENCE</em></h2></div>
      <div class="mars-step reveal" data-mars="0"><span class="slim-count">01 / 03</span><h3>UVA Engineering’s<br>MARS TEAM</h3><p>${copy('marslead')}</p></div>
      <div class="mars-step reveal" data-mars="1"><span class="slim-count">02 / 03</span><p>${copy('marscomeback')}</p><div class="mars-inset">${photo(p('p10-01'),'','loading="lazy"')}</div></div>
      <div class="mars-step reveal" data-mars="2"><span class="slim-count">03 / 03</span><p>${copy('marsrobot')}</p></div>
      <div class="step-line" id="marsLine"><span></span></div>
    </div>
  </div>
  <div class="team-section"><div class="team-heading"><h3>EXPERIENTIAL<br>LEARNING</h3><p>${copy('studentexp')}</p></div>
    <div class="team-tiles">${teams.map((t,i)=>`<button type="button" class="team-tile ${i===0?'selected':''}" data-team="${i}" aria-pressed="${i===0}">${photo(t.image,'','loading="lazy"')}<span>${safe(t.heading)}</span><b>↗</b></button>`).join('')}</div>
    <div class="team-inline" id="teamInline"><div><span class="inline-num">01 / 04</span><h4 id="teamInlineTitle">${safe(teams[0].heading)}</h4></div><div><p id="teamInlineText">${safe(teams[0].text)}</p></div></div>
  </div>
</section>

<section class="chapter" id="graduate" data-nav="Graduate Education">
  <div class="graduate-image image-motion ink-dark">${photo(p('p11-00'),'full-image','loading="lazy"')}<div class="graduate-intro"><h2>GRADUATE<br>EDUCATION</h2><p>${copy('graduate')}</p></div></div>
  <div class="graduate-stats"><div class="grad-large">${metric('1,018','Graduate Students')}</div><div class="grad-stat-right">${metric('695','Ph.D. Students')}${metric('323','Master’s Students')}${metric('5.5','Average Years to Graduation for Ph.D. Students')}</div></div>
  <div class="graduate-bottom"><div class="graduate-bottom-image">${photo(p('p11-01'),'full-image','loading="lazy"')}</div><div class="graduate-words"><h3>GRADUATE EDUCATION PROGRAMS</h3><p>UVA Engineering offers doctoral, master of science and master of engineering programs across nine engineering disciplines.</p></div></div>
</section>

<section class="chapter" id="research" data-nav="Faculty and Research">
  <div class="research-opening ink-dark image-motion">${photo(p('p14-00'),'full-image','loading="lazy"')}<div class="research-header"><div class="micro-rule"></div><h2>FACULTY<br><span>AND RESEARCH</span></h2><p>${copy('facultylead')}</p></div><span class="research-count">686 <small>FY26 Research Proposals</small></span></div>
  <div class="gallery-intro"><h3>A FOCUS ON<br>RESEARCH IMPACT</h3><div class="gallery-actions"><button type="button" class="arrow-btn" id="researchPrev" aria-label="Previous research story">←</button><span id="researchCounter">01 / 04</span><button type="button" class="arrow-btn" id="researchNext" aria-label="Next research story">→</button></div></div>
  <div class="research-gallery" id="researchGallery" tabindex="0" aria-label="Research stories">${R.research.map((x,i)=>`<article class="research-slide" data-slide="${i}"><div class="slide-photo">${photo(x.image,'','loading="lazy"')}</div><div class="slide-copy"><span class="slide-order">${String(i+1).padStart(2,'0')} / 04</span><h4>${safe(x.heading)}</h4><p>${safe(researchBriefs[i])}</p></div></article>`).join('')}</div>
  <div class="research-underbar"><span class="research-underbar-fill" id="researchBar"></span></div>
</section>

<section class="chapter" id="ventures" data-nav="Entrepreneurship and Innovation Partnerships">
  <div class="ventures-intro"><div class="ventures-intro-photo">${photo(p('p19-01'),'full-image','loading="lazy"')}</div><div class="ventures-intro-words"><div class="micro-rule"></div><h2>ENTREPRENEURSHIP<br><span>AND INNOVATION</span><br>PARTNERSHIPS</h2><p>${copy('entrelead')}</p></div></div>
  <div class="venture-index"><div class="venture-ledger"><div class="ledger-heading">ENTREPRENEURIAL VENTURES</div>${R.ventures.map((x,i)=>`<button type="button" class="venture-entry ${i===0?'selected':''}" data-venture="${i}" aria-pressed="${i===0}"><span>${String(i+1).padStart(2,'0')}</span><strong>${safe(x.heading)}</strong><i>+</i></button>`).join('')}</div><div class="venture-inspector" id="ventureInspector"><div class="venture-photo" id="venturePhoto">${photo(p('p19-00'),'full-image')}</div><div class="venture-detail"><span id="ventureNumeral">01 / 04</span><h3 id="ventureHeading">${safe(R.ventures[0].heading)}</h3><p id="ventureDescription">${safe(R.ventures[0].text)}</p></div></div></div>
</section>

<section class="chapter" id="industry" data-nav="Industry Engagement">
  <div class="industry-bridge"><div class="industry-main-img image-motion">${photo(p('p21-01'),'full-image','loading="lazy"')}</div><div class="industry-title ink-dark"><h2>INDUSTRY<br>ENGAGEMENT</h2><div class="micro-rule"></div><h3>40CORE: A NEW MODEL FOR INDUSTRY ENGAGEMENT</h3><p>${copy('industrylead')}</p></div></div>
  <div class="capital-feature"><div class="capital-figure"><strong>$4.5M</strong><span>PARTNERSHIP WITH CAPITAL ONE ACCELERATES AI RESEARCH AND INVESTS IN STUDENTS</span></div><div class="capital-story"><p>${copy('capital')}</p></div><div class="capital-picture">${photo(p('p21-00'),'full-image','loading="lazy"')}</div></div>
</section>

<section class="chapter" id="community" data-nav="Community Engagement">
  <div class="community-photo image-motion ink-dark">${photo(p('p22-00'),'full-image','loading="lazy"')}<div class="community-banner"><h2>COMMUNITY<br><span>ENGAGEMENT</span></h2><p>${copy('communitylead')}</p></div></div>
  <div class="community-composition"><div class="community-mosaic">${photo(p('p22-01'),'full-image','loading="lazy"')}</div><div class="community-number"><strong>180</strong><h3>EMERGING ENGINEERS PROGRAM GIVES HIGH SCHOOL STUDENTS GLIMPSE INTO LIFE AS AN ENGINEER</h3><p>${copy('emerginglead')}</p></div><div class="community-quote"><div class="quote-glyph">“</div><blockquote>We want these students to figure out what an engineer does, how an engineer thinks, and where can they fit in,</blockquote><span>— Meara Habashi</span></div><div class="community-smallphoto">${photo(p('p22-03'),'full-image','loading="lazy"')}</div></div>
</section>

<section class="chapter" id="alumni" data-nav="Alumni Engagement">
  <div class="alumni-hero"><div class="alumni-photo">${photo(p('p23-00'),'full-image','loading="lazy"')}</div><div class="alumni-copy ink-dark"><div class="micro-rule"></div><h2>ALUMNI<br>ENGAGEMENT</h2><p>${copy('alumnilead')}</p><div class="alumni-stat">${metric('33,801','UVA Engineering Alumni')}</div></div></div>
  <div class="alumni-story-grid">${R.alumni.map((x,i)=>`<article class="alumni-story"><div class="alumni-story-image">${photo(x.image,'full-image','loading="lazy"')}</div><div class="alumni-story-copy"><h3>${safe(x.heading)}</h3><p>${safe(x.text)}</p></div></article>`).join('')}</div>
</section>

<section class="chapter" id="operations" data-nav="School Operations">
  <div class="operations-header"><h2>SCHOOL<br><span>OPERATIONS</span></h2><p>${copy('operationslead')}</p></div>
  <div class="operations-viz"><div class="revenue-viz"><div class="doughnut-wrap"><svg class="revenue-donut" viewBox="-122 -122 244 244" role="group" aria-label="FY26 revenue breakdown">${donutPaths}</svg><div class="donut-label"><b>$238M</b><span>FY26 Revenue</span></div></div><div class="revenue-selection" aria-live="polite"><span id="revenueCategory">FY26 Revenue</span><strong id="revenueAmount">$238M</strong></div></div><div class="revenue-breakdown"><h3>BY THE NUMBERS</h3><div class="revenue-rows" id="revenueRows">${revenueRows}</div><p>${copy('operationsline')}</p></div></div>
  <div class="operations-image image-motion">${photo(p('p26-00'),'full-image','loading="lazy"')}</div>
</section>

<section class="chapter" id="philanthropy" data-nav="Philanthropy">
  <div class="giving-opening ink-dark image-motion">${photo(p('p27-00'),'full-image','loading="lazy"')}<div class="giving-banner"><h2>PHILANTHROPY</h2><div class="giving-label">ENGINEERING for the GREATER GOOD,<br>POWERED BY PHILANTHROPY</div></div></div>
  <div class="giving-metrics">${metric('4,060','FY26 Donors')}${metric('$27.4M','FY26 Gifts Raised')}${metric('$1.7M','FY26 Thornton Society Leadership Giving')}</div>
  <div class="building"><div class="building-text"><h3>Whitehead Road Engineering Academic Building</h3><p>${copy('building')}</p></div><div class="building-img image-motion">${photo(p('p28-00'),'full-image','loading="lazy"')}</div></div>
  <div class="joyner"><div class="joyner-photo">${photo(p('p28-01'),'full-image','loading="lazy"')}</div><div class="joyner-story"><div class="micro-rule"></div><h3>Kitty O’Brien Joyner</h3><p>${copy('kitty')}</p></div></div>
</section>

<section class="chapter" id="leadership" data-nav="Dean and Leadership"><div class="leadership-heading"><h2>DEAN <em>and</em><br>LEADERSHIP</h2><p>DEPARTMENT CHAIRS</p></div><div class="leaders">${leaderTiles}</div><div class="leader-detail" id="leaderDetail" aria-live="polite"><div class="leader-detail-photo">${photo(R.leaders[0].image,'full-image','id="leaderDetailImage"')}</div><div class="leader-detail-copy"><button type="button" class="leader-close" id="leaderClose" aria-label="Close profile">×</button><h3 id="leaderDetailName">${safe(R.leaders[0].name)}</h3><p id="leaderDetailRole">${safe(R.leaders[0].role)}</p></div></div></section>
<section class="chapter" id="trustees" data-nav="Board of Trustees"><div class="trustees-layout"><div class="trustees-copy"><h2>BOARD OF<br>TRUSTEES</h2><p>UNIVERSITY OF VIRGINIA ENGINEERING FOUNDATION BOARD OF TRUSTEES</p></div><div class="trustees-photo">${photo(p('p30-00'),'full-image','loading="lazy"')}</div></div></section>
</main>
<footer class="footer"><span>UVA ENGINEERING</span><span>2026 IMPACT REPORT · CLIENT PREVIEW</span><button type="button" id="lockPreview">LOCK PREVIEW</button><a href="https://engineering.virginia.edu" target="_blank" rel="noopener">engineering.virginia.edu ↗</a></footer>
<div class="menu-overlay" id="menuOverlay" aria-hidden="true"><div class="menu-bar"><span>UVA ENGINEERING</span><button type="button" id="closeMenu">CLOSE ×</button></div><div class="menu-body"><nav class="menu-items" aria-label="Contents">${mainChapters.map((x,i)=>`<a href="#${x.id}" data-chapter-link="${x.id}" data-menu-photo="${menuImages[x.id]}"><span>${String(i+1).padStart(2,'0')}</span><b>${safe(x.label)}</b><i>↗</i></a>`).join('')}</nav><div class="menu-preview" id="menuPreview">${photo(p('p03-00'),'full-image')}</div></div><div class="menu-bottom"><a href="assets/ImpactReport26_Complete.pdf" target="_blank" rel="noopener">PDF ↗</a><button type="button" id="menuSearch">SEARCH</button></div></div>
<div class="search-modal" id="searchModal" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Search report"><div class="search-top"><input type="search" id="searchInput" placeholder="Search the report" aria-label="Search report" autocomplete="off"><button type="button" id="closeSearch">CLOSE ×</button></div><div class="search-items" id="searchItems"></div></div>
`;

$('#lockPreview').onclick=()=>window.UVA_PREVIEW?.lock();

// Search leads directly to the editorial sections, including selectable story content.
const searchExtras = {
 about: Object.values(C).filter(x=>x?.spread<=4).map(x=>x.copy).concat(C.strategies),
 experience: teams.map(x=>`${x.heading} ${x.text}`),
 research: R.research.map(x=>`${x.heading} ${x.text}`),
 ventures: R.ventures.map(x=>`${x.heading} ${x.text}`),
 leadership: R.leaders.map(x=>`${x.name} ${x.role}`)
};
const searchableText = root => {
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const words=[];let node;
 while((node=walker.nextNode()))words.push(node.textContent);
 return words.join(' ');
};
const searchIndex = mainChapters.map(chapter=>({
 ...chapter,
 text: [searchableText(document.getElementById(chapter.id)), ...(searchExtras[chapter.id]||[])].join(' ').replace(/\s+/g,' ').trim()
}));
const lock = () => document.body.classList.add('locked');
const unlock = () => {if(!$$('.menu-overlay.open,.search-modal.open').length)document.body.classList.remove('locked')};
const menu=$('#menuOverlay');function openMenu(){closeSearch();menu.classList.add('open');menu.setAttribute('aria-hidden','false');lock();$('#closeMenu').focus();}function closeMenu(){menu.classList.remove('open');menu.setAttribute('aria-hidden','true');unlock()}
$('#openMenu').onclick=openMenu;$('#closeMenu').onclick=closeMenu;$$('[data-chapter-link]').forEach(a=>{a.onclick=closeMenu;a.onmouseenter=()=>{const image=$('#menuPreview img');let src=p(a.dataset.menuPhoto);if(image.getAttribute('src')!==src)image.src=src}});
$('#menuSearch').onclick=()=>{closeMenu();openSearch()};
const search=$('#searchModal');function openSearch(){closeMenu();search.classList.add('open');search.setAttribute('aria-hidden','false');lock();$('#searchInput').focus();renderSearch()};function closeSearch(){search.classList.remove('open');search.setAttribute('aria-hidden','true');unlock()}
$('#openSearch').onclick=openSearch;$('#closeSearch').onclick=closeSearch;
function renderSearch(){
 const q=$('#searchInput').value.trim().toLowerCase();
 const list=searchIndex.filter(s=>!q||`${s.label} ${s.text}`.toLowerCase().includes(q));
 $('#searchItems').innerHTML=list.length?list.map(s=>{
  const k=q?s.text.toLowerCase().indexOf(q):-1;
  const start=Math.max(0,k-70),end=k>=0?k+180:210;
  const snippet=(start?'…':'')+s.text.slice(start,end)+(end<s.text.length?'…':'');
  return `<a class="search-result" href="#${safe(s.id)}"><span>${safe(s.label)}</span><p>${safe(snippet)}</p><b aria-hidden="true">↗</b></a>`;
 }).join(''):'<p>No matching sections</p>';
}
$('#searchItems').addEventListener('click',e=>{
 const link=e.target.closest('.search-result');
 if(!link)return;
 closeSearch();
 const target=document.getElementById(link.hash.slice(1));
 target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
});
$('#searchInput').addEventListener('input',renderSearch);
window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(search.classList.contains('open')){closeSearch();$('#openSearch').focus()}else if(menu.classList.contains('open')){closeMenu();$('#openMenu').focus()}}});

// The same editorial unit can be selected through pointer, keyboard or scrolling.
function setPriority(i){const art=$('#priorityArt img');const src=p(strategyImgs[i]);if(art.getAttribute('src')!==src){art.style.opacity='.2';setTimeout(()=>{art.src=src;art.style.opacity='1'},120)}$$('[data-priority]').forEach((b,j)=>{b.classList.toggle('selected',j===i);b.setAttribute('aria-pressed',String(j===i))});$('#priorityArt .priority-index').textContent=`${String(i+1).padStart(2,'0')} / 04`}
$$('[data-priority]').forEach(b=>b.addEventListener('click',()=>setPriority(+b.dataset.priority)));
let currentProfile=0,profileTimer=null;
function setProfile(i){if(i===currentProfile)return;currentProfile=i;const image=$('#profileStageImage');clearTimeout(profileTimer);image.style.opacity='.25';profileTimer=setTimeout(()=>{image.src=R.portraits[i].image;image.style.opacity='1'},110);$('#profileNumber').textContent=`${String(i+1).padStart(2,'0')} / 04`;$$('[data-go-profile]').forEach((b,j)=>{b.classList.toggle('selected',j===i)})}
$$('[data-go-profile]').forEach(b=>b.onclick=()=>{let i=+b.dataset.goProfile;document.getElementById('profile-step-'+i).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});setProfile(i)});
function syncProfileFromScroll(){
 const holder=$('#profileScroller').getBoundingClientRect();
 if(holder.bottom<0||holder.top>innerHeight)return;
 const marker=matchMedia('(max-width:760px)').matches?innerHeight*.79:innerHeight*.5;
 const candidate=$$('[data-profile-step]').find(el=>{const r=el.getBoundingClientRect();return r.top<=marker&&r.bottom>marker});
 if(candidate)setProfile(+candidate.dataset.profileStep);
} 
const marsObserver=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){let i=+e.target.dataset.mars;$('#marsLine span').style.height=`${(i+1)/3*100}%`;}},{rootMargin:'-30% 0px -40% 0px'});$$('[data-mars]').forEach(node=>marsObserver.observe(node));
function selectTeam(i){const t=teams[i];$$('[data-team]').forEach((b,j)=>{b.classList.toggle('selected',i===j);b.setAttribute('aria-pressed',String(i===j))});$('#teamInlineTitle').textContent=t.heading;$('#teamInlineText').textContent=t.text;$('#teamInline .inline-num').textContent=`${String(i+1).padStart(2,'0')} / 04`;}
$$('[data-team]').forEach(b=>b.onclick=()=>selectTeam(+b.dataset.team));
function selectVenture(i){let v=R.ventures[i];$$('[data-venture]').forEach((b,j)=>{b.classList.toggle('selected',i===j);b.setAttribute('aria-pressed',String(i===j));b.querySelector('i').textContent=i===j?'−':'+'});$('#ventureHeading').textContent=v.heading;$('#ventureDescription').textContent=v.text;$('#ventureNumeral').textContent=`${String(i+1).padStart(2,'0')} / 04`;$('#venturePhoto').classList.toggle('text-only',!v.image);$('#venturePhoto').innerHTML=v.image?photo(v.image,'full-image'):`<span>${safe(v.heading)}</span>`;}
$$('[data-venture]').forEach(b=>b.onclick=()=>selectVenture(+b.dataset.venture));

// Scroll-snap research gallery, with accessible arrow controls.
const slides=$$('.research-slide');let researchIndex=0;
function goResearch(i){researchIndex=Math.max(0,Math.min(slides.length-1,i));slides[researchIndex].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'nearest',inline:'start'});updateResearchIndicator();}
function updateResearchIndicator(){$('#researchCounter').textContent=`${String(researchIndex+1).padStart(2,'0')} / 04`;$('#researchBar').style.width=`${(researchIndex+1)/slides.length*100}%`;$('#researchPrev').disabled=researchIndex===0;$('#researchNext').disabled=researchIndex===slides.length-1;}
$('#researchPrev').onclick=()=>goResearch(researchIndex-1);$('#researchNext').onclick=()=>goResearch(researchIndex+1);const researchGallery=$('#researchGallery');let researchTick=false;researchGallery.addEventListener('scroll',()=>{if(!researchTick){requestAnimationFrame(()=>{const x=researchGallery.scrollLeft;let distances=slides.map(s=>Math.abs(s.offsetLeft-researchGallery.offsetLeft-x));researchIndex=distances.indexOf(Math.min(...distances));updateResearchIndicator();researchTick=false;});researchTick=true}},{passive:true});researchGallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();goResearch(researchIndex+1)}if(e.key==='ArrowLeft'){e.preventDefault();goResearch(researchIndex-1)}});updateResearchIndicator();

// Revenue chart: all values copied from the School Operations source spread.
function selectRevenue(i){$$('[data-rev]').forEach(x=>{let same=Number(x.dataset.rev)===i;x.classList.toggle('selected',same);x.classList.toggle('muted',i!==-1&&!same)});let row=R.revenue[i];$('#revenueCategory').textContent=row?row.name:'FY26 Revenue';$('#revenueAmount').textContent=row?dollar(row.value):'$238M'}
$$('[data-rev]').forEach(b=>{b.addEventListener('mouseenter',()=>selectRevenue(+b.dataset.rev));b.addEventListener('focus',()=>selectRevenue(+b.dataset.rev));b.addEventListener('click',()=>selectRevenue(+b.dataset.rev));if(b.tagName==='circle')b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectRevenue(+b.dataset.rev)}})});$('#revenueRows').addEventListener('mouseleave',()=>selectRevenue(-1));$('.revenue-donut').addEventListener('mouseleave',()=>selectRevenue(-1));

// Portrait directory: selection expands within the publication rather than opening a dialog.
function leader(i){const x=R.leaders[i];$('#leaderDetailImage').src=x.image;$('#leaderDetailName').textContent=x.name;$('#leaderDetailRole').textContent=x.role;$('#leaderDetail').classList.add('visible');$$('[data-person]').forEach((b,j)=>b.classList.toggle('selected',i===j));$('#leaderDetail').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'nearest'})}
$$('[data-person]').forEach(b=>b.onclick=()=>leader(+b.dataset.person));$('#leaderClose').onclick=()=>{$('#leaderDetail').classList.remove('visible');$$('[data-person]').forEach(b=>b.classList.remove('selected'))};

const revealObserver=new IntersectionObserver(entries=>{entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in-view');revealObserver.unobserve(x.target)}})},{threshold:.12,rootMargin:'0px 0px -30px 0px'});$$('.reveal, .chapter-hero-body, .mission-panel, .graduate-stats, .research-header, .giving-metrics .metric, .alumni-story').forEach(x=>revealObserver.observe(x));
// The incoming section physically pushes the fixed title out of its reading window.
const sectionNav=$('#sectionNav'), sectionTrigger=$('#sectionTrigger'), sectionPanel=$('#sectionPanel');
const sectionLinks=$$('[data-section-link]');
const journeySections=journeyChapters.map(x=>document.getElementById(x.id));
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let activeChapter=-1,scrolling=false,closeTimer,pinned=false;
function showPreview(i){
 const x=journeyChapters[i];$('#chapterPreviewImage').src=navPhoto(x.id);
 $('#chapterPreviewNumber').textContent=`${String(i).padStart(2,'0')} / 13`;
 $('#chapterPreviewTitle').textContent=x.label;
}
function setSectionOpen(open,restoreFocus=false){
 clearTimeout(closeTimer);sectionNav.classList.toggle('open',open);
 sectionTrigger.setAttribute('aria-expanded',String(open));sectionPanel.inert=!open;
 if(open)showPreview(Math.max(0,activeChapter));else pinned=false;
 if(restoreFocus)sectionTrigger.focus();
}
sectionNav.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')setSectionOpen(true)});
sectionNav.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!pinned&&!sectionNav.contains(document.activeElement))closeTimer=setTimeout(()=>setSectionOpen(false),180)});
sectionTrigger.addEventListener('click',e=>{
 if(e.detail&&matchMedia('(hover:hover)').matches){pinned=!pinned;setSectionOpen(pinned)}
 else {const open=!sectionNav.classList.contains('open');setSectionOpen(open);pinned=open}
});
sectionNav.addEventListener('focusout',e=>{if(!sectionNav.contains(e.relatedTarget)){pinned=false;closeTimer=setTimeout(()=>setSectionOpen(false),120)}});
document.addEventListener('pointerdown',e=>{if(!sectionNav.contains(e.target))setSectionOpen(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sectionNav.classList.contains('open')){setSectionOpen(false,true)}});
sectionTrigger.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();setSectionOpen(true);sectionLinks[Math.max(0,activeChapter)].focus()}});
sectionLinks.forEach((link,i)=>{
 link.addEventListener('mouseenter',()=>showPreview(i));
 link.addEventListener('focus',()=>showPreview(i));
 link.addEventListener('keydown',e=>{
  let next=i;
  if(e.key==='ArrowDown'||e.key==='ArrowRight')next=Math.min(sectionLinks.length-1,i+1);
  else if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=Math.max(0,i-1);
  else if(e.key==='Home')next=0;else if(e.key==='End')next=sectionLinks.length-1;else return;
  e.preventDefault();sectionLinks[next].focus();
 });
});
function readingOffset(){return $('#header').offsetHeight+(sectionTrigger.offsetHeight)}
function jumpToChapter(index){
 const chapter=journeyChapters[index];if(!chapter)return;
 setSectionOpen(false);
 const target=document.getElementById(chapter.id);history.pushState(null,'',`#${chapter.id}`);
 target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
 window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+scrollY-readingOffset()),behavior:reducedMotion.matches?'instant':'smooth'});

}
sectionPanel.addEventListener('click',e=>{
 const link=e.target.closest('[data-section-link]');if(!link||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 e.preventDefault();jumpToChapter(Number(link.dataset.sectionLink));
});
function updateScroll(){
 const y=scrollY,total=Math.max(1,document.documentElement.scrollHeight-innerHeight);
 const starts=journeySections.map(s=>s.getBoundingClientRect().top+y);
 document.documentElement.style.scrollPaddingTop=`${readingOffset()}px`;
 const marker=y+readingOffset()+1;
 let idx=0;starts.forEach((top,i)=>{if(top<=marker)idx=i});
 if(y>=total-2)idx=journeySections.length-1;
 const current=journeyChapters[idx],next=journeyChapters[idx+1];
 if(activeChapter!==idx){
  activeChapter=idx;
  $('#currentTitle').textContent=current.label;$('#nextTitle').textContent=next?.label||current.label;
  $('#currentTitle').classList.toggle('long-title',current.label.length>35);$('#nextTitle').classList.toggle('long-title',(next?.label||'').length>35);
  $('#sectionNumber').textContent=String(idx).padStart(2,'0');
  sectionTrigger.setAttribute('aria-label',`${current.label}. Explore chapters`);
  sectionLinks.forEach((link,i)=>{if(i===idx)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
 }
 const height=$('#titleWindow').offsetHeight;
 const push=next?Math.max(0,height-(starts[idx+1]-marker)):0;
 $('#titleTrack').style.transform=`translateY(-${reducedMotion.matches?0:Math.min(height,push)}px)`;
 const end=next?starts[idx+1]:document.documentElement.scrollHeight;
 const progress=y>=total-2?1:Math.max(0,Math.min(1,(marker-starts[idx])/Math.max(1,end-starts[idx])));
 $('#sectionProgress').style.transform=`scaleX(${progress})`;
 $('#readProgress').style.width=`${Math.min(100,100*y/total)}%`;
 $('#header').classList.toggle('scrolled',y>innerHeight*.76);
 $('#header').classList.toggle('on-dark',y<innerHeight*.75&&!$('#header').classList.contains('scrolled'));
 syncProfileFromScroll();
 $('.cover-image').style.transform=`translate3d(0,${(Math.min(1,y/Math.max(1,innerHeight))*5).toFixed(2)}%,0) scale(1.04)`;
 scrolling=false;
}
function queueScrollUpdate(){if(!scrolling){requestAnimationFrame(updateScroll);scrolling=true}}
addEventListener('scroll',queueScrollUpdate,{passive:true});addEventListener('resize',queueScrollUpdate);
new ResizeObserver(queueScrollUpdate).observe(document.querySelector('main'));
updateScroll();
})();
