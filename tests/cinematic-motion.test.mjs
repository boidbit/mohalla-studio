import test from 'node:test';
import assert from 'node:assert/strict';
import {routeBend,signedAngle,cameraClearance} from '../src/cinematic-motion.js';

const makeRoute=(points)=>{
  const lengths=[0];
  for(let i=1;i<points.length;i++) lengths.push(lengths[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].z-points[i-1].z));
  return {points,lengths,total:lengths.at(-1)};
};
const v=(x,y,z)=>({x,y,z,clone(){return v(this.x,this.y,this.z);},lerp(other,t){this.x+=(other.x-this.x)*t;this.y+=(other.y-this.y)*t;this.z+=(other.z-this.z)*t;return this;}});

test('angle difference wraps without 360-degree turns',()=>{
  assert.ok(Math.abs(signedAngle(-Math.PI+.05, Math.PI-.05)-.1)<1e-8);
});
test('straight route has no turn',()=>{
  const route=makeRoute([{x:0,z:0},{x:0,z:5},{x:0,z:10}]);
  assert.equal(routeBend(route,4,3),0);
});
test('curve is anticipated and fades away after bend',()=>{
  const route=makeRoute([{x:0,z:0},{x:0,z:5},{x:3,z:5},{x:5,z:5}]);
  assert.ok(routeBend(route,4.8,3)>0);
  assert.ok(Math.abs(routeBend(route,9,3))<.01);
  assert.equal(routeBend(route,4.8,0),0);
});
test('camera remains clear with no buildings',()=>{
  const cam=v(0,4,10);assert.equal(cameraClearance(v(0,2,0),cam,[]),cam);
});
test('continuous wall test stops before building',()=>{
  const block=[{x:0,z:6,hw:2.5,hd:2.5,h:10}];
  const point=cameraClearance(v(0,2,0),v(0,3,12),block);
  assert.ok(point.z>0 && point.z<4.6,`camera z=${point.z}`);
});
test('wall behind camera and obstacle above ray do not obstruct',()=>{
  const look=v(0,2,0),desired=v(0,3,12);
  assert.equal(cameraClearance(look,desired,[{x:0,z:-6,hw:2.5,hd:1,h:8}]),desired);
  assert.equal(cameraClearance(look,desired,[{x:0,z:6,hw:2.5,hd:1,h:1}]),desired);
});
