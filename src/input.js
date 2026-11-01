export function joystickVector(dx,dy,radius=30,deadzone=8){
 if(!Number.isFinite(dx)||!Number.isFinite(dy))return {x:0,y:0};
 const distance=Math.hypot(dx,dy);if(distance<=deadzone)return {x:0,y:0};
 const amount=Math.min(1,(distance-deadzone)/Math.max(1,radius-deadzone));
 return {x:dx/distance*amount,y:dy/distance*amount};
}
