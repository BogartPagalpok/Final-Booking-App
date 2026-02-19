const qs=(s,c=document)=>c.querySelector(s)
const qsa=(s,c=document)=>Array.from(c.querySelectorAll(s))
const views={dashboard:qs('#view-dashboard'),bookings:qs('#view-bookings'),users:qs('#view-users'),settings:qs('#view-settings')}
const sidebar=qs('#sidebar')
const toast=qs('#toast')
function showToast(t){toast.textContent=t;toast.style.display='block';clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.style.display='none',2200)}
qs('#sidebarToggle').addEventListener('click',()=>{sidebar.classList.toggle('collapsed')})
qsa('.nav-item').forEach(a=>a.addEventListener('click',()=>{qsa('.nav-item').forEach(x=>x.classList.remove('active'));a.classList.add('active');Object.values(views).forEach(v=>v.classList.remove('visible'));const id=a.getAttribute('data-view');qs(`#view-${id}`).classList.add('visible')}))
function formatMoney(n){return Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n)}
const seed=(()=>{let s=7;return()=>s=Math.imul(48271,s)%2147483647})()
function r(n=1){let v=seed();return (v%1000)/1000*n}
const names=['Alex','Hanna','Svetlana','Andrea','Carlo','Liam','Emma','Olivia','Noah','Mia','Ava','Mason','Zoe','Ethan','Lucas','Sofia']
const statuses=['Confirmed','Pending','Cancelled']
function randName(){return names[Math.floor(r(names.length))]}
function randStatus(){return statuses[Math.floor(r(statuses.length))]}
function genId(){return Math.floor(1000+r(9000))}
function today(d=0){const t=new Date();t.setDate(t.getDate()+d);return t.toISOString().slice(0,10)}
const recentTbody=qs('#tableRecent tbody')
const bookingsTbody=qs('#tableBookings tbody')
const usersTbody=qs('#tableUsers tbody')
let bookings=[]
let users=[]
for(let i=0;i<16;i++){bookings.push({id:genId(),name:randName(),room:Math.floor(r(300))+100,date:today(Math.floor(r(20))-10),nights:1+Math.floor(r(6)),status:randStatus(),total:120+Math.floor(r(880))})}
for(let i=0;i<12;i++){users.push({id:genId(),name:randName(),email:`${randName().toLowerCase()}${i}@mail.com`,role:i%3===0?'Admin':i%2===0?'Manager':'Staff',status:i%5===0?'Suspended':'Active'})}
function badge(s){if(s==='Confirmed')return `<span class="status paid">Confirmed</span>`;if(s==='Pending')return `<span class="status pending">Pending</span>`;return `<span class="status cancelled">Cancelled</span>`}
function renderRecent(){recentTbody.innerHTML=bookings.slice(0,8).map(b=>`<tr><td>#${b.id}</td><td>${b.name}</td><td>${b.room}</td><td>${b.date}</td><td>${badge(b.status)}</td><td class="actions-row"><button class="row-btn" data-edit="${b.id}">Edit</button><button class="row-btn" data-del="${b.id}">Delete</button></td></tr>`).join('')}
function renderBookings(list=bookings){bookingsTbody.innerHTML=list.map(b=>`<tr><td>#${b.id}</td><td>${b.name}</td><td>${b.room}</td><td>${b.date}</td><td>${b.nights}</td><td>${badge(b.status)}</td><td>${formatMoney(b.total)}</td><td class="actions-row"><button class="row-btn" data-edit="${b.id}">Edit</button><button class="row-btn" data-del="${b.id}">Delete</button></td></tr>`).join('')}
function renderUsers(list=users){usersTbody.innerHTML=list.map(u=>`<tr><td>#${u.id}</td><td>${u.name}</td><td>${u.email}</td><td><span class="tag">${u.role}</span></td><td>${u.status}</td><td class="actions-row"><button class="row-btn" data-reset="${u.id}">Reset</button><button class="row-btn" data-remove="${u.id}">Remove</button></td></tr>`).join('')}
function updateKpis(){const rev=bookings.reduce((a,b)=>a+b.total,0);qs('#kpiRevenue').textContent=formatMoney(rev);qs('#kpiBookings').textContent=bookings.length;qs('#kpiGuests').textContent=new Set(bookings.map(b=>b.name)).size;qs('#kpiOccupancy').textContent=`${60+Math.floor(r(35))}%`}
function openModal(id){qs(`#${id}`).classList.add('show')}
function closeModal(m){m.classList.remove('show')}
qsa('[data-open]').forEach(b=>b.addEventListener('click',()=>openModal(b.getAttribute('data-open'))))
qsa('.modal [data-close]').forEach(b=>b.addEventListener('click',e=>closeModal(b.closest('.modal'))))
qsa('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m)}))
qs('#mbCreate').addEventListener('click',()=>{const n=qs('#mbName').value||randName();const room=qs('#mbRoom').value||Math.floor(r(300))+100;const date=qs('#mbDate').value||today();const nights=parseInt(qs('#mbNights').value||'1',10);const b={id:genId(),name:n,room,date,nights,status:'Confirmed',total:100+Math.floor(r(900))};bookings.unshift(b);renderRecent();renderBookings();updateKpis();showToast('Booking created');closeModal(qs('#modalBooking'))})
qs('#muCreate').addEventListener('click',()=>{const n=qs('#muName').value||randName();const email=qs('#muEmail').value||`${n.toLowerCase()}@mail.com`;const role=qs('#muRole').value;users.unshift({id:genId(),name:n,email,role,status:'Active'});renderUsers();showToast('User created');closeModal(qs('#modalUser'))})
qs('#bookingFilter').addEventListener('input',e=>{const v=e.target.value.toLowerCase();const f=bookings.filter(b=>b.name.toLowerCase().includes(v)||b.status.toLowerCase().includes(v));renderBookings(f)})
qs('#userFilter').addEventListener('input',e=>{const v=e.target.value.toLowerCase();const f=users.filter(u=>u.name.toLowerCase().includes(v)||u.email.toLowerCase().includes(v));renderUsers(f)})
qs('#globalSearch').addEventListener('input',e=>{const v=e.target.value.toLowerCase();const fb=bookings.filter(b=>`${b.id}${b.name}${b.status}${b.room}`.toLowerCase().includes(v));renderBookings(fb);qsa('.nav-item').forEach(x=>x.classList.remove('active'));qsa('.view').forEach(vv=>vv.classList.remove('visible'));qs('[data-view="bookings"]').classList.add('active');views.bookings.classList.add('visible')})
qs('#newActionBtn').addEventListener('click',()=>openModal('modalBooking'))
qs('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('alt');showToast(document.body.classList.contains('alt')?'Theme alt':'Theme default')})
qs('#applyBrand').addEventListener('click',()=>{const p=qs('#colorPrimary').value;const a=qs('#colorAccent').value;document.documentElement.style.setProperty('--primary',p);document.documentElement.style.setProperty('--accent',a);document.documentElement.style.setProperty('--gradient',`linear-gradient(135deg,${p},${a})`);showToast('Brand updated')})
qs('#reducedMotion').addEventListener('change',e=>{document.body.style.setProperty('transition','none');document.body.style.setProperty('animation',e.target.checked?'none':'')})
qs('#denseTables').addEventListener('change',e=>{document.body.classList.toggle('dense',e.target.checked)})
bookingsTbody.addEventListener('click',e=>{const id=e.target.getAttribute('data-del');const ed=e.target.getAttribute('data-edit');if(id){const i=bookings.findIndex(b=>b.id==id);if(i>-1){bookings.splice(i,1);renderRecent();renderBookings();updateKpis();showToast('Booking deleted')}}if(ed){showToast('Edit not implemented')}})
usersTbody.addEventListener('click',e=>{const id=e.target.getAttribute('data-remove');const rs=e.target.getAttribute('data-reset');if(id){const i=users.findIndex(u=>u.id==id);if(i>-1){users.splice(i,1);renderUsers();showToast('User removed')}}if(rs){showToast('Password reset link sent')}})
qsa('#tableRecent thead th[data-sort]').forEach(th=>th.addEventListener('click',()=>{const key=th.getAttribute('data-sort');bookings.sort((a,b)=>String(a[key]).localeCompare(String(b[key])));renderRecent()}))
function renderChart(){const el=qs('#miniChart');el.innerHTML='';const n=20;const max=100;const wrap=document.createElement('div');wrap.style.cssText='display:flex;align-items:flex-end;gap:8px;width:100%;height:100%';for(let i=0;i<n;i++){const v=60+Math.floor(r(40))-Math.floor(i/4);const bar=document.createElement('div');bar.style.cssText=`width:${100/n}% ;height:${Math.max(10,v)}% ;background:var(--gradient);border-radius:8px`;wrap.appendChild(bar)}el.appendChild(wrap)}
function init(){renderRecent();renderBookings();renderUsers();updateKpis();renderChart()}
init()
