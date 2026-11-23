import test from 'node:test';
import assert from 'node:assert/strict';
import {totalOf,stateOf,changeFor,canAdvance,transitionOrder} from './domain.js';
test('totales y vuelto en céntimos',()=>{assert.equal(totalOf([{price:2390,qty:3},{price:850,qty:2}]),8870);assert.equal(changeFor(8870,'100'),1130);assert.equal(changeFor(8870,'50'),-3870)});
test('solo todos los productos listos habilitan recogida',()=>{const items=[{state:'ready'},{state:'pending'}];assert.equal(stateOf({items}),'preparing');assert.equal(stateOf({items:items.map(()=>({state:'ready'}))}),'ready');assert.equal(stateOf({items,delivered:true}),'delivered')});
test('estados de cocina avanzan en orden',()=>{assert.equal(canAdvance('pending','ready'),false);assert.equal(canAdvance('pending','preparing'),true);assert.equal(canAdvance('preparing','ready'),true);assert.equal(canAdvance('ready','preparing'),false)});
test('un solo cambio prepara y completa todos los productos sin modificar cantidades',()=>{
 const original={items:[{id:'a',qty:2,state:'pending'},{id:'b',qty:1,state:'pending'}]};
 assert.equal(transitionOrder(original,'ready'),undefined);
 const preparing=transitionOrder(original,'preparing');
 assert.deepEqual(preparing.items.map(i=>i.state),['preparing','preparing']);
 const ready=transitionOrder(preparing,'ready');
 assert.equal(stateOf(ready),'ready');
 assert.deepEqual(ready.items.map(i=>i.qty),[2,1]);
 assert.equal(original.items[0].state,'pending');
 assert.equal(transitionOrder(ready,'ready'),undefined);
 assert.equal(transitionOrder({...preparing,delivered:true},'ready'),undefined);
});
test('comandas existentes con estados mixtos no retroceden productos listos',()=>{
 const mixed={items:[{id:'a',state:'ready'},{id:'b',state:'pending'}]};
 assert.equal(transitionOrder(mixed,'ready'),undefined);
 const prepared=transitionOrder(mixed,'preparing');
 assert.deepEqual(prepared.items.map(i=>i.state),['ready','preparing']);
 assert.equal(stateOf(transitionOrder(prepared,'ready')),'ready');
});
