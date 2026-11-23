export const money = n => new Intl.NumberFormat('es-PE', {style:'currency',currency:'PEN'}).format(n/100);
export const totalOf = items => items.reduce((n,i)=>n+i.price*i.qty,0);
export const stateOf = o => o.delivered ? 'delivered' : o.items.every(i=>i.state==='ready') ? 'ready' : o.items.some(i=>i.state!=='pending') ? 'preparing' : 'pending';
export const changeFor = (total,received) => Math.round(Number(received)*100)-total;
export const canAdvance = (from,to) => (from==='pending'&&to==='preparing')||(from==='preparing'&&to==='ready');
export function transitionOrder(order,next){
 if(!order||order.delivered||!order.items.length)return;
 const pending=order.items.some(i=>i.state==='pending');
 if(next==='preparing'&&pending)return {...order,items:order.items.map(i=>i.state==='pending'?{...i,state:'preparing'}:i)};
 if(next==='ready'&&!pending&&order.items.some(i=>i.state==='preparing'))return {...order,items:order.items.map(i=>({...i,state:'ready'}))};
}
