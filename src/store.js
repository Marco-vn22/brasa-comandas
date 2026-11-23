import {initializeApp} from 'firebase/app';
import {getAuth,signInWithEmailAndPassword,signOut,onAuthStateChanged} from 'firebase/auth';
import {getDatabase,ref,onValue,push,set,runTransaction} from 'firebase/database';
import {transitionOrder} from './domain';
import defaultConfig from './firebase-config';
const KEY='brasa-demo-orders-v1';
export const config=localStorage.getItem('brasa-mode')==='demo'?null:JSON.parse(localStorage.getItem('brasa-firebase')||'null')||defaultConfig;
let db,auth;
if(config){const app=initializeApp(config);db=getDatabase(app);auth=getAuth(app)}
export const login=(email,password)=>signInWithEmailAndPassword(auth,email,password);
export const logout=()=>signOut(auth);
export const watchAuth=fn=>auth?onAuthStateChanged(auth,fn):(fn(null),()=>{});
const seed=()=>Object.fromEntries([
 {id:'demo-104',code:'104',type:'table',table:'04',name:'',createdAt:Date.now()-420000,method:'cash',received:10000,total:7650,items:[{id:'chicken',name:'1 pollo a la brasa',price:6800,qty:1,state:'pending'},{id:'soda',name:'Gaseosa 1.5 L',price:850,qty:1,state:'pending'}]},
 {id:'demo-103',code:'103',type:'takeaway',table:'',name:'Lucía',createdAt:Date.now()-720000,method:'yape',received:2400,total:2400,items:[{id:'quarter',name:'1/4 de pollo',price:2400,qty:1,state:'preparing'}]},
 {id:'demo-102',code:'102',type:'table',table:'02',name:'',createdAt:Date.now()-900000,method:'cash',received:5000,total:3600,items:[{id:'eighth',name:'1/8 de pollo',price:1400,qty:2,state:'ready'},{id:'salad',name:'Ensalada fresca',price:800,qty:1,state:'ready'}]}
].map(o=>[o.id,o]));
function read(){const saved=localStorage.getItem(KEY);if(saved)return JSON.parse(saved);const data=seed();localStorage.setItem(KEY,JSON.stringify(data));return data}
function emit(data){localStorage.setItem(KEY,JSON.stringify(data));window.dispatchEvent(new Event('brasa-update'))}
export function watchOrders(fn,error){if(db)return onValue(ref(db,'orders'),s=>fn(Object.values(s.val()||{})),error);const send=()=>fn(Object.values(read()));send();window.addEventListener('storage',send);window.addEventListener('brasa-update',send);return()=>{window.removeEventListener('storage',send);window.removeEventListener('brasa-update',send)}}
export function watchConnection(fn){if(!db){fn(true);return()=>{}}return onValue(ref(db,'.info/connected'),s=>fn(s.val()===true))}
export async function createOrder(order){const id=db?push(ref(db,'orders')).key:crypto.randomUUID();const data={...order,id,code:id.slice(-5).toUpperCase(),createdAt:Date.now(),delivered:false};if(db)await set(ref(db,'orders/'+id),data);else{const all=read();all[id]=data;emit(all)}return data}
async function mutate(id,fn){if(db){const result=await runTransaction(ref(db,'orders/'+id),current=>current?fn(current):undefined,{applyLocally:false});if(!result.committed)throw new Error('El pedido cambió. Actualiza e inténtalo nuevamente.')}else{const all=read();const changed=fn(all[id]);if(!changed)throw new Error('El pedido cambió.');all[id]=changed;emit(all)}}
export const advanceOrder=(id,next)=>mutate(id,o=>transitionOrder(o,next));
export const deliverOrder=id=>mutate(id,o=>{if(o.delivered||!o.items.every(i=>i.state==='ready'))return;return {...o,delivered:true,deliveredAt:Date.now()}});
