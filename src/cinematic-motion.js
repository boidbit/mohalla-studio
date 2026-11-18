/**
 * Deterministic cinematic motion utilities. Pure functions so timeline scrubbing
 * and captured videos produce the same camera/turn every time.
 */
const clamp = (x,a,b) => Math.min(b, Math.max(a,x));
export const signedAngle = (a,b) => Math.atan2(Math.sin(a-b),Math.cos(a-b));

function arcPosition(route,distance){
  const points=route?.points||[];
  if(!points.length)return {x:0,z:0};
  if(points.length===1)return points[0];
  const d=clamp(distance,0,route.total||0);
  const lengths=route.lengths;
  let lo=1,hi=points.length-1;
  while(lo<hi){const mid=(lo+hi)>>1;if(lengths[mid]<d)lo=mid+1;else hi=mid;}
  const prev=lengths[lo-1], length=Math.max(1e-6,lengths[lo]-prev);
  const t=clamp((d-prev)/length,0,1);
  return {x:points[lo-1].x+(points[lo].x-points[lo-1].x)*t,
          z:points[lo-1].z+(points[lo].z-points[lo-1].z)*t};
}
function routeHeading(route,distance,sample=.35){
  if(!route || route.total<.001)return 0;
  const p0=arcPosition(route,distance-sample),p1=arcPosition(route,distance+sample);
  return Math.atan2(p1.x-p0.x,p1.z-p0.z);
}
/** Anticipate a road bend without rotating a paper-thin billboard sideways. */
export function routeBend(route,distance,speed){
  if(!route || route.total<.001 || speed<.08)return 0;
  const here=routeHeading(route,distance,.34);
  const next=routeHeading(route,distance+.90,.34);
  return clamp(signedAngle(next,here)*1.45,-1,1)*clamp(speed/1.8,0,1);
}
/** Camera ray vs expanded 3D building AABBs. Finds the nearest obstruction.
 * Compared with a handful of sample points, continuous slab intersection
 * avoids clipping into thin faces as the camera tracks around corners.
 */
export function cameraClearance(look,desired,blockers,clearance=.32){
  const dx=desired.x-look.x,dy=desired.y-look.y,dz=desired.z-look.z;
  const rayLength=Math.hypot(dx,dy,dz);
  if(rayLength<1e-6)return desired;
  let amount=1;
  for(const b of blockers){
    if(b.hw<2.2||b.hd<2.2)continue;
    const pad=.24;
    const bounds=[[b.x-b.hw-pad,b.x+b.hw+pad,look.x,dx],
                  [-.15,(b.h||8.5)+.24,look.y,dy],
                  [b.z-b.hd-pad,b.z+b.hd+pad,look.z,dz]];
    let enter=0,exit=1,hit=true;
    for(const [lower,upper,origin,delta] of bounds){
      if(Math.abs(delta)<1e-8){
        if(origin<lower||origin>upper){hit=false;break;}
      } else {
        const a=(lower-origin)/delta,c=(upper-origin)/delta;
        enter=Math.max(enter,Math.min(a,c));
        exit=Math.min(exit,Math.max(a,c));
        if(enter>exit){hit=false;break;}
      }
    }
    if(hit && exit>=0 && enter<=1){
      const before=Math.max(.1,enter-clearance/rayLength);
      amount=Math.min(amount,before);
    }
  }
  if(amount===1)return desired;
  return look.clone().lerp(desired,amount);
}
