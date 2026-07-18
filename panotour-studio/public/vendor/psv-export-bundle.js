(()=>{var Xc=0,il=1,Yc=2;var nl=1,qc=2,_i=3,Ui=0,Ut=1,yi=2,ki=0,_n=1,sl=2,rl=3,ol=4,Zc=5,ji=100,$c=101,Kc=102,Jc=103,jc=104,Qc=200,eh=201,th=202,ih=203,zr=204,Vr=205,nh=206,sh=207,rh=208,oh=209,ah=210,lh=211,ch=212,hh=213,uh=214,co=0,ho=1,uo=2,yn=3,fo=4,po=5,mo=6,go=7,al=0,dh=1,fh=2,zi=0,vo=1,ph=2,mh=3,gh=4,vh=5,_h=6,yh=7;var ll=300,En=301,Tn=302,_o=303,yo=304,ks=306,Hr=1e3,Ji=1001,Gr=1002,jt=1003,xh=1004;var zs=1005;var Dt=1006,xo=1007;var xi=1008;var Mi=1009,cl=1010,hl=1011,ts=1012,Mo=1013,sn=1014,wi=1015,is=1016,wo=1017,bo=1018,An=1020,ul=35902,dl=1021,fl=1022,ni=1023,pl=1024,ml=1025,vn=1026,xn=1027,gl=1028,So=1029,vl=1030,Eo=1031;var To=1033,Vs=33776,Hs=33777,Gs=33778,Ws=33779,Ao=35840,Co=35841,Ro=35842,Po=35843,Io=36196,Lo=37492,Do=37496,Uo=37808,No=37809,Oo=37810,Fo=37811,Bo=37812,ko=37813,zo=37814,Vo=37815,Ho=37816,Go=37817,Wo=37818,Xo=37819,Yo=37820,qo=37821,Xs=36492,Zo=36494,$o=36495,_l=36283,Ko=36284,Jo=36285,jo=36286;var bs=2300,Wr=2301,kr=2302,$a=2400,Ka=2401,Ja=2402;var Mh=3200,wh=3201;var bh=0,Sh=1,Vi="",Ht="srgb",Ni="srgb-linear",Ss="linear",Qe="srgb";var gn=7680;var ja=519,Eh=512,Th=513,Ah=514,yl=515,Ch=516,Rh=517,Ph=518,Ih=519,Qa=35044;var xl="300 es",gi=2e3,Es=2001,Oi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},At=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Sc=1234567,Ms=Math.PI/180,Jn=180/Math.PI;function ns(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(At[i&255]+At[i>>8&255]+At[i>>16&255]+At[i>>24&255]+"-"+At[e&255]+At[e>>8&255]+"-"+At[e>>16&15|64]+At[e>>24&255]+"-"+At[t&63|128]+At[t>>8&255]+"-"+At[t>>16&255]+At[t>>24&255]+At[n&255]+At[n>>8&255]+At[n>>16&255]+At[n>>24&255]).toLowerCase()}function Fe(i,e,t){return Math.max(e,Math.min(t,i))}function Ml(i,e){return(i%e+e)%e}function Cp(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Rp(i,e,t){return i!==e?(t-i)/(e-i):0}function ws(i,e,t){return(1-t)*i+t*e}function Pp(i,e,t,n){return ws(i,e,1-Math.exp(-t*n))}function Ip(i,e=1){return e-Math.abs(Ml(i,e*2)-e)}function Lp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Dp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Up(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Np(i,e){return i+Math.random()*(e-i)}function Op(i){return i*(.5-Math.random())}function Fp(i){i!==void 0&&(Sc=i);let e=Sc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Bp(i){return i*Ms}function kp(i){return i*Jn}function zp(i){return(i&i-1)===0&&i!==0}function Vp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Hp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Gp(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),f=r((e-n)/2),p=o((e-n)/2),m=r((n-e)/2),v=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*f,l*p,a*c);break;case"YZY":i.set(l*p,a*h,l*f,a*c);break;case"ZXZ":i.set(l*f,l*p,a*h,a*c);break;case"XZX":i.set(a*h,l*v,l*m,a*c);break;case"YXY":i.set(l*m,a*h,l*v,a*c);break;case"ZYZ":i.set(l*v,l*m,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function $n(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Lt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Re={DEG2RAD:Ms,RAD2DEG:Jn,generateUUID:ns,clamp:Fe,euclideanModulo:Ml,mapLinear:Cp,inverseLerp:Rp,lerp:ws,damp:Pp,pingpong:Ip,smoothstep:Lp,smootherstep:Dp,randInt:Up,randFloat:Np,randFloatSpread:Op,seededRandom:Fp,degToRad:Bp,radToDeg:kp,isPowerOfTwo:zp,ceilPowerOfTwo:Vp,floorPowerOfTwo:Hp,setQuaternionFromProperEuler:Gp,normalize:Lt,denormalize:$n},Oe=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Fe(this.x,e.x,t.x),this.y=Fe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Fe(this.x,e,t),this.y=Fe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Fe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Fe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Le=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],f=n[7],p=n[2],m=n[5],v=n[8],_=s[0],d=s[3],u=s[6],E=s[1],S=s[4],M=s[7],I=s[2],A=s[5],C=s[8];return r[0]=o*_+a*E+l*I,r[3]=o*d+a*S+l*A,r[6]=o*u+a*M+l*C,r[1]=c*_+h*E+f*I,r[4]=c*d+h*S+f*A,r[7]=c*u+h*M+f*C,r[2]=p*_+m*E+v*I,r[5]=p*d+m*S+v*A,r[8]=p*u+m*M+v*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],f=h*o-a*c,p=a*l-h*r,m=c*r-o*l,v=t*f+n*p+s*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/v;return e[0]=f*_,e[1]=(s*c-h*n)*_,e[2]=(a*n-s*o)*_,e[3]=p*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-a*t)*_,e[6]=m*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ra.makeScale(e,t)),this}rotate(e){return this.premultiply(Ra.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ra.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ra=new Le;function wl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ts(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Lh(){let i=Ts("canvas");return i.style.display="block",i}var Ec={};function Cn(i){i in Ec||(Ec[i]=!0,console.warn(i))}function Dh(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Uh(i){let e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Nh(i){let e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var Tc=new Le().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ac=new Le().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Wp(){let i={enabled:!0,workingColorSpace:Ni,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Qe&&(s.r=Di(s.r),s.g=Di(s.g),s.b=Di(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Qe&&(s.r=Kn(s.r),s.g=Kn(s.g),s.b=Kn(s.b))),s},fromWorkingColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},toWorkingColorSpace:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Vi?Ss:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ni]:{primaries:e,whitePoint:n,transfer:Ss,toXYZ:Tc,fromXYZ:Ac,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ht},outputColorSpaceConfig:{drawingBufferColorSpace:Ht}},[Ht]:{primaries:e,whitePoint:n,transfer:Qe,toXYZ:Tc,fromXYZ:Ac,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ht}}}),i}var ze=Wp();function Di(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Kn(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Fn,Xr=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Fn===void 0&&(Fn=Ts("canvas")),Fn.width=e.width,Fn.height=e.height;let n=Fn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Fn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Ts("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Di(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Di(t[n]/255)*255):t[n]=Di(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Xp=0,As=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Xp++}),this.uuid=ns(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Pa(s[o].image)):r.push(Pa(s[o]))}else r=Pa(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Pa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Xr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Yp=0,xt=class i extends Oi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Ji,s=Ji,r=Dt,o=xi,a=ni,l=Mi,c=i.DEFAULT_ANISOTROPY,h=Vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yp++}),this.uuid=ns(),this.name="",this.source=new As(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Oe(0,0),this.repeat=new Oe(1,1),this.center=new Oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ll)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Hr:e.x=e.x-Math.floor(e.x);break;case Ji:e.x=e.x<0?0:1;break;case Gr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Hr:e.y=e.y-Math.floor(e.y);break;case Ji:e.y=e.y<0?0:1;break;case Gr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};xt.DEFAULT_IMAGE=null;xt.DEFAULT_MAPPING=ll;xt.DEFAULT_ANISOTROPY=1;var ht=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],f=l[8],p=l[1],m=l[5],v=l[9],_=l[2],d=l[6],u=l[10];if(Math.abs(h-p)<.01&&Math.abs(f-_)<.01&&Math.abs(v-d)<.01){if(Math.abs(h+p)<.1&&Math.abs(f+_)<.1&&Math.abs(v+d)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let S=(c+1)/2,M=(m+1)/2,I=(u+1)/2,A=(h+p)/4,C=(f+_)/4,N=(v+d)/4;return S>M&&S>I?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=A/n,r=C/n):M>I?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=A/s,r=N/s):I<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(I),n=C/r,s=N/r),this.set(n,s,r,t),this}let E=Math.sqrt((d-v)*(d-v)+(f-_)*(f-_)+(p-h)*(p-h));return Math.abs(E)<.001&&(E=1),this.x=(d-v)/E,this.y=(f-_)/E,this.z=(p-h)/E,this.w=Math.acos((c+m+u-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Fe(this.x,e.x,t.x),this.y=Fe(this.y,e.y,t.y),this.z=Fe(this.z,e.z,t.z),this.w=Fe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Fe(this.x,e,t),this.y=Fe(this.y,e,t),this.z=Fe(this.z,e,t),this.w=Fe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Fe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Yr=class extends Oi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ht(0,0,e,t),this.scissorTest=!1,this.viewport=new ht(0,0,e,t);let s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Dt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new xt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new As(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Qt=class extends Yr{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Cs=class extends xt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=jt,this.minFilter=jt,this.wrapR=Ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var qr=class extends xt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=jt,this.minFilter=jt,this.wrapR=Ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Xt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3],p=r[o+0],m=r[o+1],v=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f;return}if(a===1){e[t+0]=p,e[t+1]=m,e[t+2]=v,e[t+3]=_;return}if(f!==_||l!==p||c!==m||h!==v){let d=1-a,u=l*p+c*m+h*v+f*_,E=u>=0?1:-1,S=1-u*u;if(S>Number.EPSILON){let I=Math.sqrt(S),A=Math.atan2(I,u*E);d=Math.sin(d*A)/I,a=Math.sin(a*A)/I}let M=a*E;if(l=l*d+p*M,c=c*d+m*M,h=h*d+v*M,f=f*d+_*M,d===1-a){let I=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=I,c*=I,h*=I,f*=I}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[o],p=r[o+1],m=r[o+2],v=r[o+3];return e[t]=a*v+h*f+l*m-c*p,e[t+1]=l*v+h*p+c*f-a*m,e[t+2]=c*v+h*m+a*p-l*f,e[t+3]=h*v-a*f-l*p-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),f=a(r/2),p=l(n/2),m=l(s/2),v=l(r/2);switch(o){case"XYZ":this._x=p*h*f+c*m*v,this._y=c*m*f-p*h*v,this._z=c*h*v+p*m*f,this._w=c*h*f-p*m*v;break;case"YXZ":this._x=p*h*f+c*m*v,this._y=c*m*f-p*h*v,this._z=c*h*v-p*m*f,this._w=c*h*f+p*m*v;break;case"ZXY":this._x=p*h*f-c*m*v,this._y=c*m*f+p*h*v,this._z=c*h*v+p*m*f,this._w=c*h*f-p*m*v;break;case"ZYX":this._x=p*h*f-c*m*v,this._y=c*m*f+p*h*v,this._z=c*h*v-p*m*f,this._w=c*h*f+p*m*v;break;case"YZX":this._x=p*h*f+c*m*v,this._y=c*m*f+p*h*v,this._z=c*h*v-p*m*f,this._w=c*h*f-p*m*v;break;case"XZY":this._x=p*h*f-c*m*v,this._y=c*m*f-p*h*v,this._z=c*h*v+p*m*f,this._w=c*h*f+p*m*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],f=t[10],p=n+a+f;if(p>0){let m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(o-s)*m}else if(n>a&&n>f){let m=2*Math.sqrt(1+n-a-f);this._w=(h-l)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+c)/m}else if(a>f){let m=2*Math.sqrt(1+a-n-f);this._w=(r-c)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(l+h)/m}else{let m=2*Math.sqrt(1+f-n-a);this._w=(o-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Fe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let m=1-t;return this._w=m*o+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),f=Math.sin((1-t)*h)/c,p=Math.sin(t*h)/c;return this._w=o*f+this._w*p,this._x=n*f+this._x*p,this._y=s*f+this._y*p,this._z=r*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},U=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Cc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Cc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),f=2*(r*n-o*t);return this.x=t+l*c+o*f-a*h,this.y=n+l*h+a*c-r*f,this.z=s+l*f+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Fe(this.x,e.x,t.x),this.y=Fe(this.y,e.y,t.y),this.z=Fe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Fe(this.x,e,t),this.y=Fe(this.y,e,t),this.z=Fe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Fe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ia.copy(this).projectOnVector(e),this.sub(Ia)}reflect(e){return this.sub(Ia.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Fe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ia=new U,Cc=new Xt,vi=class{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ci.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ci.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ci.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ci):ci.fromBufferAttribute(r,o),ci.applyMatrix4(e.matrixWorld),this.expandByPoint(ci);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Mr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Mr.copy(n.boundingBox)),Mr.applyMatrix4(e.matrixWorld),this.union(Mr)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ci),ci.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(vs),wr.subVectors(this.max,vs),Bn.subVectors(e.a,vs),kn.subVectors(e.b,vs),zn.subVectors(e.c,vs),Wi.subVectors(kn,Bn),Xi.subVectors(zn,kn),dn.subVectors(Bn,zn);let t=[0,-Wi.z,Wi.y,0,-Xi.z,Xi.y,0,-dn.z,dn.y,Wi.z,0,-Wi.x,Xi.z,0,-Xi.x,dn.z,0,-dn.x,-Wi.y,Wi.x,0,-Xi.y,Xi.x,0,-dn.y,dn.x,0];return!La(t,Bn,kn,zn,wr)||(t=[1,0,0,0,1,0,0,0,1],!La(t,Bn,kn,zn,wr))?!1:(br.crossVectors(Wi,Xi),t=[br.x,br.y,br.z],La(t,Bn,kn,zn,wr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ci).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ci).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ci[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ci[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ci[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ci[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ci[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ci[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ci[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ci[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ci),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Ci=[new U,new U,new U,new U,new U,new U,new U,new U],ci=new U,Mr=new vi,Bn=new U,kn=new U,zn=new U,Wi=new U,Xi=new U,dn=new U,vs=new U,wr=new U,br=new U,fn=new U;function La(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){fn.fromArray(i,r);let a=s.x*Math.abs(fn.x)+s.y*Math.abs(fn.y)+s.z*Math.abs(fn.z),l=e.dot(fn),c=t.dot(fn),h=n.dot(fn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var qp=new vi,_s=new U,Da=new U,jn=class{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):qp.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;_s.subVectors(e,this.center);let t=_s.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(_s,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Da.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(_s.copy(e.center).add(Da)),this.expandByPoint(_s.copy(e.center).sub(Da))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Ri=new U,Ua=new U,Sr=new U,Yi=new U,Na=new U,Er=new U,Oa=new U,Rs=class{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ri)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ri.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ri.copy(this.origin).addScaledVector(this.direction,t),Ri.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Ua.copy(e).add(t).multiplyScalar(.5),Sr.copy(t).sub(e).normalize(),Yi.copy(this.origin).sub(Ua);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Sr),a=Yi.dot(this.direction),l=-Yi.dot(Sr),c=Yi.lengthSq(),h=Math.abs(1-o*o),f,p,m,v;if(h>0)if(f=o*l-a,p=o*a-l,v=r*h,f>=0)if(p>=-v)if(p<=v){let _=1/h;f*=_,p*=_,m=f*(f+o*p+2*a)+p*(o*f+p+2*l)+c}else p=r,f=Math.max(0,-(o*p+a)),m=-f*f+p*(p+2*l)+c;else p=-r,f=Math.max(0,-(o*p+a)),m=-f*f+p*(p+2*l)+c;else p<=-v?(f=Math.max(0,-(-o*r+a)),p=f>0?-r:Math.min(Math.max(-r,-l),r),m=-f*f+p*(p+2*l)+c):p<=v?(f=0,p=Math.min(Math.max(-r,-l),r),m=p*(p+2*l)+c):(f=Math.max(0,-(o*r+a)),p=f>0?r:Math.min(Math.max(-r,-l),r),m=-f*f+p*(p+2*l)+c);else p=o>0?-r:r,f=Math.max(0,-(o*p+a)),m=-f*f+p*(p+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Ua).addScaledVector(Sr,p),m}intersectSphere(e,t){Ri.subVectors(e.center,this.origin);let n=Ri.dot(this.direction),s=Ri.dot(Ri)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,p=this.origin;return c>=0?(n=(e.min.x-p.x)*c,s=(e.max.x-p.x)*c):(n=(e.max.x-p.x)*c,s=(e.min.x-p.x)*c),h>=0?(r=(e.min.y-p.y)*h,o=(e.max.y-p.y)*h):(r=(e.max.y-p.y)*h,o=(e.min.y-p.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(e.min.z-p.z)*f,l=(e.max.z-p.z)*f):(a=(e.max.z-p.z)*f,l=(e.min.z-p.z)*f),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Ri)!==null}intersectTriangle(e,t,n,s,r){Na.subVectors(t,e),Er.subVectors(n,e),Oa.crossVectors(Na,Er);let o=this.direction.dot(Oa),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Yi.subVectors(this.origin,e);let l=a*this.direction.dot(Er.crossVectors(Yi,Er));if(l<0)return null;let c=a*this.direction.dot(Na.cross(Yi));if(c<0||l+c>o)return null;let h=-a*Yi.dot(Oa);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},tt=class i{constructor(e,t,n,s,r,o,a,l,c,h,f,p,m,v,_,d){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,f,p,m,v,_,d)}set(e,t,n,s,r,o,a,l,c,h,f,p,m,v,_,d){let u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=s,u[1]=r,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=h,u[10]=f,u[14]=p,u[3]=m,u[7]=v,u[11]=_,u[15]=d,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Vn.setFromMatrixColumn(e,0).length(),r=1/Vn.setFromMatrixColumn(e,1).length(),o=1/Vn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){let p=o*h,m=o*f,v=a*h,_=a*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=m+v*c,t[5]=p-_*c,t[9]=-a*l,t[2]=_-p*c,t[6]=v+m*c,t[10]=o*l}else if(e.order==="YXZ"){let p=l*h,m=l*f,v=c*h,_=c*f;t[0]=p+_*a,t[4]=v*a-m,t[8]=o*c,t[1]=o*f,t[5]=o*h,t[9]=-a,t[2]=m*a-v,t[6]=_+p*a,t[10]=o*l}else if(e.order==="ZXY"){let p=l*h,m=l*f,v=c*h,_=c*f;t[0]=p-_*a,t[4]=-o*f,t[8]=v+m*a,t[1]=m+v*a,t[5]=o*h,t[9]=_-p*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let p=o*h,m=o*f,v=a*h,_=a*f;t[0]=l*h,t[4]=v*c-m,t[8]=p*c+_,t[1]=l*f,t[5]=_*c+p,t[9]=m*c-v,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let p=o*l,m=o*c,v=a*l,_=a*c;t[0]=l*h,t[4]=_-p*f,t[8]=v*f+m,t[1]=f,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=m*f+v,t[10]=p-_*f}else if(e.order==="XZY"){let p=o*l,m=o*c,v=a*l,_=a*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=p*f+_,t[5]=o*h,t[9]=m*f-v,t[2]=v*f-m,t[6]=a*h,t[10]=_*f+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Zp,e,$p)}lookAt(e,t,n){let s=this.elements;return zt.subVectors(e,t),zt.lengthSq()===0&&(zt.z=1),zt.normalize(),qi.crossVectors(n,zt),qi.lengthSq()===0&&(Math.abs(n.z)===1?zt.x+=1e-4:zt.z+=1e-4,zt.normalize(),qi.crossVectors(n,zt)),qi.normalize(),Tr.crossVectors(zt,qi),s[0]=qi.x,s[4]=Tr.x,s[8]=zt.x,s[1]=qi.y,s[5]=Tr.y,s[9]=zt.y,s[2]=qi.z,s[6]=Tr.z,s[10]=zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],f=n[5],p=n[9],m=n[13],v=n[2],_=n[6],d=n[10],u=n[14],E=n[3],S=n[7],M=n[11],I=n[15],A=s[0],C=s[4],N=s[8],w=s[12],x=s[1],R=s[5],Y=s[9],k=s[13],W=s[2],K=s[6],H=s[10],Q=s[14],V=s[3],se=s[7],ue=s[11],xe=s[15];return r[0]=o*A+a*x+l*W+c*V,r[4]=o*C+a*R+l*K+c*se,r[8]=o*N+a*Y+l*H+c*ue,r[12]=o*w+a*k+l*Q+c*xe,r[1]=h*A+f*x+p*W+m*V,r[5]=h*C+f*R+p*K+m*se,r[9]=h*N+f*Y+p*H+m*ue,r[13]=h*w+f*k+p*Q+m*xe,r[2]=v*A+_*x+d*W+u*V,r[6]=v*C+_*R+d*K+u*se,r[10]=v*N+_*Y+d*H+u*ue,r[14]=v*w+_*k+d*Q+u*xe,r[3]=E*A+S*x+M*W+I*V,r[7]=E*C+S*R+M*K+I*se,r[11]=E*N+S*Y+M*H+I*ue,r[15]=E*w+S*k+M*Q+I*xe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],f=e[6],p=e[10],m=e[14],v=e[3],_=e[7],d=e[11],u=e[15];return v*(+r*l*f-s*c*f-r*a*p+n*c*p+s*a*m-n*l*m)+_*(+t*l*m-t*c*p+r*o*p-s*o*m+s*c*h-r*l*h)+d*(+t*c*f-t*a*m-r*o*f+n*o*m+r*a*h-n*c*h)+u*(-s*a*h-t*l*f+t*a*p+s*o*f-n*o*p+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],f=e[9],p=e[10],m=e[11],v=e[12],_=e[13],d=e[14],u=e[15],E=f*d*c-_*p*c+_*l*m-a*d*m-f*l*u+a*p*u,S=v*p*c-h*d*c-v*l*m+o*d*m+h*l*u-o*p*u,M=h*_*c-v*f*c+v*a*m-o*_*m-h*a*u+o*f*u,I=v*f*l-h*_*l-v*a*p+o*_*p+h*a*d-o*f*d,A=t*E+n*S+s*M+r*I;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/A;return e[0]=E*C,e[1]=(_*p*r-f*d*r-_*s*m+n*d*m+f*s*u-n*p*u)*C,e[2]=(a*d*r-_*l*r+_*s*c-n*d*c-a*s*u+n*l*u)*C,e[3]=(f*l*r-a*p*r-f*s*c+n*p*c+a*s*m-n*l*m)*C,e[4]=S*C,e[5]=(h*d*r-v*p*r+v*s*m-t*d*m-h*s*u+t*p*u)*C,e[6]=(v*l*r-o*d*r-v*s*c+t*d*c+o*s*u-t*l*u)*C,e[7]=(o*p*r-h*l*r+h*s*c-t*p*c-o*s*m+t*l*m)*C,e[8]=M*C,e[9]=(v*f*r-h*_*r-v*n*m+t*_*m+h*n*u-t*f*u)*C,e[10]=(o*_*r-v*a*r+v*n*c-t*_*c-o*n*u+t*a*u)*C,e[11]=(h*a*r-o*f*r-h*n*c+t*f*c+o*n*m-t*a*m)*C,e[12]=I*C,e[13]=(h*_*s-v*f*s+v*n*p-t*_*p-h*n*d+t*f*d)*C,e[14]=(v*a*s-o*_*s-v*n*l+t*_*l+o*n*d-t*a*d)*C,e[15]=(o*f*s-h*a*s+h*n*l-t*f*l-o*n*p+t*a*p)*C,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,f=a+a,p=r*c,m=r*h,v=r*f,_=o*h,d=o*f,u=a*f,E=l*c,S=l*h,M=l*f,I=n.x,A=n.y,C=n.z;return s[0]=(1-(_+u))*I,s[1]=(m+M)*I,s[2]=(v-S)*I,s[3]=0,s[4]=(m-M)*A,s[5]=(1-(p+u))*A,s[6]=(d+E)*A,s[7]=0,s[8]=(v+S)*C,s[9]=(d-E)*C,s[10]=(1-(p+_))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Vn.set(s[0],s[1],s[2]).length(),o=Vn.set(s[4],s[5],s[6]).length(),a=Vn.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],hi.copy(this);let c=1/r,h=1/o,f=1/a;return hi.elements[0]*=c,hi.elements[1]*=c,hi.elements[2]*=c,hi.elements[4]*=h,hi.elements[5]*=h,hi.elements[6]*=h,hi.elements[8]*=f,hi.elements[9]*=f,hi.elements[10]*=f,t.setFromRotationMatrix(hi),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=gi){let l=this.elements,c=2*r/(t-e),h=2*r/(n-s),f=(t+e)/(t-e),p=(n+s)/(n-s),m,v;if(a===gi)m=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Es)m=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=gi){let l=this.elements,c=1/(t-e),h=1/(n-s),f=1/(o-r),p=(t+e)*c,m=(n+s)*h,v,_;if(a===gi)v=(o+r)*f,_=-2*f;else if(a===Es)v=r*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-p,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Vn=new U,hi=new tt,Zp=new U(0,0,0),$p=new U(1,1,1),qi=new U,Tr=new U,zt=new U,Rc=new tt,Pc=new Xt,ei=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],f=s[2],p=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Fe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Fe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Fe(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Fe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Fe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Fe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Rc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Rc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Pc.setFromEuler(this),this.setFromQuaternion(Pc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ei.DEFAULT_ORDER="XYZ";var Qn=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Kp=0,Ic=new U,Hn=new Xt,Pi=new tt,Ar=new U,ys=new U,Jp=new U,jp=new Xt,Lc=new U(1,0,0),Dc=new U(0,1,0),Uc=new U(0,0,1),Nc={type:"added"},Qp={type:"removed"},Gn={type:"childadded",child:null},Fa={type:"childremoved",child:null},Ft=class i extends Oi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Kp++}),this.uuid=ns(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new U,t=new ei,n=new Xt,s=new U(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new tt},normalMatrix:{value:new Le}}),this.matrix=new tt,this.matrixWorld=new tt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Qn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Hn.setFromAxisAngle(e,t),this.quaternion.multiply(Hn),this}rotateOnWorldAxis(e,t){return Hn.setFromAxisAngle(e,t),this.quaternion.premultiply(Hn),this}rotateX(e){return this.rotateOnAxis(Lc,e)}rotateY(e){return this.rotateOnAxis(Dc,e)}rotateZ(e){return this.rotateOnAxis(Uc,e)}translateOnAxis(e,t){return Ic.copy(e).applyQuaternion(this.quaternion),this.position.add(Ic.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Lc,e)}translateY(e){return this.translateOnAxis(Dc,e)}translateZ(e){return this.translateOnAxis(Uc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Pi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ar.copy(e):Ar.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ys.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Pi.lookAt(ys,Ar,this.up):Pi.lookAt(Ar,ys,this.up),this.quaternion.setFromRotationMatrix(Pi),s&&(Pi.extractRotation(s.matrixWorld),Hn.setFromRotationMatrix(Pi),this.quaternion.premultiply(Hn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Nc),Gn.child=e,this.dispatchEvent(Gn),Gn.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Qp),Fa.child=e,this.dispatchEvent(Fa),Fa.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Pi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Pi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Pi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Nc),Gn.child=e,this.dispatchEvent(Gn),Gn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ys,e,Jp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ys,jp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),f=o(e.shapes),p=o(e.skeletons),m=o(e.animations),v=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),p.length>0&&(n.skeletons=p),m.length>0&&(n.animations=m),v.length>0&&(n.nodes=v)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Ft.DEFAULT_UP=new U(0,1,0);Ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ui=new U,Ii=new U,Ba=new U,Li=new U,Wn=new U,Xn=new U,Oc=new U,ka=new U,za=new U,Va=new U,Ha=new ht,Ga=new ht,Wa=new ht,Ki=class i{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),ui.subVectors(e,t),s.cross(ui);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){ui.subVectors(s,t),Ii.subVectors(n,t),Ba.subVectors(e,t);let o=ui.dot(ui),a=ui.dot(Ii),l=ui.dot(Ba),c=Ii.dot(Ii),h=Ii.dot(Ba),f=o*c-a*a;if(f===0)return r.set(0,0,0),null;let p=1/f,m=(c*l-a*h)*p,v=(o*h-a*l)*p;return r.set(1-m-v,v,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Li)===null?!1:Li.x>=0&&Li.y>=0&&Li.x+Li.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Li)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Li.x),l.addScaledVector(o,Li.y),l.addScaledVector(a,Li.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return Ha.setScalar(0),Ga.setScalar(0),Wa.setScalar(0),Ha.fromBufferAttribute(e,t),Ga.fromBufferAttribute(e,n),Wa.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Ha,r.x),o.addScaledVector(Ga,r.y),o.addScaledVector(Wa,r.z),o}static isFrontFacing(e,t,n,s){return ui.subVectors(n,t),Ii.subVectors(e,t),ui.cross(Ii).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ui.subVectors(this.c,this.b),Ii.subVectors(this.a,this.b),ui.cross(Ii).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Wn.subVectors(s,n),Xn.subVectors(r,n),ka.subVectors(e,n);let l=Wn.dot(ka),c=Xn.dot(ka);if(l<=0&&c<=0)return t.copy(n);za.subVectors(e,s);let h=Wn.dot(za),f=Xn.dot(za);if(h>=0&&f<=h)return t.copy(s);let p=l*f-h*c;if(p<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(Wn,o);Va.subVectors(e,r);let m=Wn.dot(Va),v=Xn.dot(Va);if(v>=0&&m<=v)return t.copy(r);let _=m*c-l*v;if(_<=0&&c>=0&&v<=0)return a=c/(c-v),t.copy(n).addScaledVector(Xn,a);let d=h*v-m*f;if(d<=0&&f-h>=0&&m-v>=0)return Oc.subVectors(r,s),a=(f-h)/(f-h+(m-v)),t.copy(s).addScaledVector(Oc,a);let u=1/(d+_+p);return o=_*u,a=p*u,t.copy(n).addScaledVector(Wn,o).addScaledVector(Xn,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Oh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zi={h:0,s:0,l:0},Cr={h:0,s:0,l:0};function Xa(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var qe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ht){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ze.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=ze.workingColorSpace){return this.r=e,this.g=t,this.b=n,ze.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=ze.workingColorSpace){if(e=Ml(e,1),t=Fe(t,0,1),n=Fe(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Xa(o,r,e+1/3),this.g=Xa(o,r,e),this.b=Xa(o,r,e-1/3)}return ze.toWorkingColorSpace(this,s),this}setStyle(e,t=Ht){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ht){let n=Oh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Di(e.r),this.g=Di(e.g),this.b=Di(e.b),this}copyLinearToSRGB(e){return this.r=Kn(e.r),this.g=Kn(e.g),this.b=Kn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ht){return ze.fromWorkingColorSpace(Ct.copy(this),e),Math.round(Fe(Ct.r*255,0,255))*65536+Math.round(Fe(Ct.g*255,0,255))*256+Math.round(Fe(Ct.b*255,0,255))}getHexString(e=Ht){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ze.workingColorSpace){ze.fromWorkingColorSpace(Ct.copy(this),t);let n=Ct.r,s=Ct.g,r=Ct.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let f=o-a;switch(c=h<=.5?f/(o+a):f/(2-o-a),o){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=ze.workingColorSpace){return ze.fromWorkingColorSpace(Ct.copy(this),t),e.r=Ct.r,e.g=Ct.g,e.b=Ct.b,e}getStyle(e=Ht){ze.fromWorkingColorSpace(Ct.copy(this),e);let t=Ct.r,n=Ct.g,s=Ct.b;return e!==Ht?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Zi),this.setHSL(Zi.h+e,Zi.s+t,Zi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Zi),e.getHSL(Cr);let n=ws(Zi.h,Cr.h,t),s=ws(Zi.s,Cr.s,t),r=ws(Zi.l,Cr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ct=new qe;qe.NAMES=Oh;var em=0,Mn=class extends Oi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:em++}),this.uuid=ns(),this.name="",this.type="Material",this.blending=_n,this.side=Ui,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=zr,this.blendDst=Vr,this.blendEquation=ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=yn,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ja,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gn,this.stencilZFail=gn,this.stencilZPass=gn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==_n&&(n.blending=this.blending),this.side!==Ui&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==zr&&(n.blendSrc=this.blendSrc),this.blendDst!==Vr&&(n.blendDst=this.blendDst),this.blendEquation!==ji&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==yn&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ja&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==gn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==gn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},di=class extends Mn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=al,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var ft=new U,Rr=new Oe,Gt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Qa,this.updateRanges=[],this.gpuType=wi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Rr.fromBufferAttribute(this,t),Rr.applyMatrix3(e),this.setXY(t,Rr.x,Rr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ft.fromBufferAttribute(this,t),ft.applyMatrix3(e),this.setXYZ(t,ft.x,ft.y,ft.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ft.fromBufferAttribute(this,t),ft.applyMatrix4(e),this.setXYZ(t,ft.x,ft.y,ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ft.fromBufferAttribute(this,t),ft.applyNormalMatrix(e),this.setXYZ(t,ft.x,ft.y,ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ft.fromBufferAttribute(this,t),ft.transformDirection(e),this.setXYZ(t,ft.x,ft.y,ft.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=$n(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Lt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=$n(t,this.array)),t}setX(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=$n(t,this.array)),t}setY(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=$n(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=$n(t,this.array)),t}setW(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),s=Lt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),s=Lt(s,this.array),r=Lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Qa&&(e.usage=this.usage),e}};var Ps=class extends Gt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Is=class extends Gt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Wt=class extends Gt{constructor(e,t,n){super(new Float32Array(e),t,n)}},tm=0,Jt=new tt,Ya=new Ft,Yn=new U,Vt=new vi,xs=new vi,yt=new U,Fi=class i extends Oi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tm++}),this.uuid=ns(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(wl(e)?Is:Ps)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Le().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Jt.makeRotationFromQuaternion(e),this.applyMatrix4(Jt),this}rotateX(e){return Jt.makeRotationX(e),this.applyMatrix4(Jt),this}rotateY(e){return Jt.makeRotationY(e),this.applyMatrix4(Jt),this}rotateZ(e){return Jt.makeRotationZ(e),this.applyMatrix4(Jt),this}translate(e,t,n){return Jt.makeTranslation(e,t,n),this.applyMatrix4(Jt),this}scale(e,t,n){return Jt.makeScale(e,t,n),this.applyMatrix4(Jt),this}lookAt(e){return Ya.lookAt(e),Ya.updateMatrix(),this.applyMatrix4(Ya.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Yn).negate(),this.translate(Yn.x,Yn.y,Yn.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Wt(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new vi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Vt.setFromBufferAttribute(r),this.morphTargetsRelative?(yt.addVectors(this.boundingBox.min,Vt.min),this.boundingBox.expandByPoint(yt),yt.addVectors(this.boundingBox.max,Vt.max),this.boundingBox.expandByPoint(yt)):(this.boundingBox.expandByPoint(Vt.min),this.boundingBox.expandByPoint(Vt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new jn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){let n=this.boundingSphere.center;if(Vt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];xs.setFromBufferAttribute(a),this.morphTargetsRelative?(yt.addVectors(Vt.min,xs.min),Vt.expandByPoint(yt),yt.addVectors(Vt.max,xs.max),Vt.expandByPoint(yt)):(Vt.expandByPoint(xs.min),Vt.expandByPoint(xs.max))}Vt.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)yt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(yt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)yt.fromBufferAttribute(a,c),l&&(Yn.fromBufferAttribute(e,c),yt.add(Yn)),s=Math.max(s,n.distanceToSquared(yt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Gt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let N=0;N<n.count;N++)a[N]=new U,l[N]=new U;let c=new U,h=new U,f=new U,p=new Oe,m=new Oe,v=new Oe,_=new U,d=new U;function u(N,w,x){c.fromBufferAttribute(n,N),h.fromBufferAttribute(n,w),f.fromBufferAttribute(n,x),p.fromBufferAttribute(r,N),m.fromBufferAttribute(r,w),v.fromBufferAttribute(r,x),h.sub(c),f.sub(c),m.sub(p),v.sub(p);let R=1/(m.x*v.y-v.x*m.y);isFinite(R)&&(_.copy(h).multiplyScalar(v.y).addScaledVector(f,-m.y).multiplyScalar(R),d.copy(f).multiplyScalar(m.x).addScaledVector(h,-v.x).multiplyScalar(R),a[N].add(_),a[w].add(_),a[x].add(_),l[N].add(d),l[w].add(d),l[x].add(d))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let N=0,w=E.length;N<w;++N){let x=E[N],R=x.start,Y=x.count;for(let k=R,W=R+Y;k<W;k+=3)u(e.getX(k+0),e.getX(k+1),e.getX(k+2))}let S=new U,M=new U,I=new U,A=new U;function C(N){I.fromBufferAttribute(s,N),A.copy(I);let w=a[N];S.copy(w),S.sub(I.multiplyScalar(I.dot(w))).normalize(),M.crossVectors(A,w);let R=M.dot(l[N])<0?-1:1;o.setXYZW(N,S.x,S.y,S.z,R)}for(let N=0,w=E.length;N<w;++N){let x=E[N],R=x.start,Y=x.count;for(let k=R,W=R+Y;k<W;k+=3)C(e.getX(k+0)),C(e.getX(k+1)),C(e.getX(k+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Gt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let p=0,m=n.count;p<m;p++)n.setXYZ(p,0,0,0);let s=new U,r=new U,o=new U,a=new U,l=new U,c=new U,h=new U,f=new U;if(e)for(let p=0,m=e.count;p<m;p+=3){let v=e.getX(p+0),_=e.getX(p+1),d=e.getX(p+2);s.fromBufferAttribute(t,v),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,d),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),a.fromBufferAttribute(n,v),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,d),a.add(h),l.add(h),c.add(h),n.setXYZ(v,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(d,c.x,c.y,c.z)}else for(let p=0,m=t.count;p<m;p+=3)s.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),o.fromBufferAttribute(t,p+2),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)yt.fromBufferAttribute(e,t),yt.normalize(),e.setXYZ(t,yt.x,yt.y,yt.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,f=a.normalized,p=new c.constructor(l.length*h),m=0,v=0;for(let _=0,d=l.length;_<d;_++){a.isInterleavedBufferAttribute?m=l[_]*a.data.stride+a.offset:m=l[_]*h;for(let u=0;u<h;u++)p[v++]=c[m++]}return new Gt(p,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,f=c.length;h<f;h++){let p=c[h],m=e(p,n);l.push(m)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let f=0,p=c.length;f<p;f++){let m=c[f];h.push(m.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],f=r[c];for(let p=0,m=f.length;p<m;p++)h.push(f[p].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fc=new tt,pn=new Rs,Pr=new jn,Bc=new U,Ir=new U,Lr=new U,Dr=new U,qa=new U,Ur=new U,kc=new U,Nr=new U,pt=class extends Ft{constructor(e=new Fi,t=new di){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Ur.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],f=r[l];h!==0&&(qa.fromBufferAttribute(f,e),o?Ur.addScaledVector(qa,h):Ur.addScaledVector(qa.sub(t),h))}t.add(Ur)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Pr.copy(n.boundingSphere),Pr.applyMatrix4(r),pn.copy(e.ray).recast(e.near),!(Pr.containsPoint(pn.origin)===!1&&(pn.intersectSphere(Pr,Bc)===null||pn.origin.distanceToSquared(Bc)>(e.far-e.near)**2))&&(Fc.copy(r).invert(),pn.copy(e.ray).applyMatrix4(Fc),!(n.boundingBox!==null&&pn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,pn)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,p=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,_=p.length;v<_;v++){let d=p[v],u=o[d.materialIndex],E=Math.max(d.start,m.start),S=Math.min(a.count,Math.min(d.start+d.count,m.start+m.count));for(let M=E,I=S;M<I;M+=3){let A=a.getX(M),C=a.getX(M+1),N=a.getX(M+2);s=Or(this,u,e,n,c,h,f,A,C,N),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=d.materialIndex,t.push(s))}}else{let v=Math.max(0,m.start),_=Math.min(a.count,m.start+m.count);for(let d=v,u=_;d<u;d+=3){let E=a.getX(d),S=a.getX(d+1),M=a.getX(d+2);s=Or(this,o,e,n,c,h,f,E,S,M),s&&(s.faceIndex=Math.floor(d/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,_=p.length;v<_;v++){let d=p[v],u=o[d.materialIndex],E=Math.max(d.start,m.start),S=Math.min(l.count,Math.min(d.start+d.count,m.start+m.count));for(let M=E,I=S;M<I;M+=3){let A=M,C=M+1,N=M+2;s=Or(this,u,e,n,c,h,f,A,C,N),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=d.materialIndex,t.push(s))}}else{let v=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let d=v,u=_;d<u;d+=3){let E=d,S=d+1,M=d+2;s=Or(this,o,e,n,c,h,f,E,S,M),s&&(s.faceIndex=Math.floor(d/3),t.push(s))}}}};function im(i,e,t,n,s,r,o,a){let l;if(e.side===Ut?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Ui,a),l===null)return null;Nr.copy(a),Nr.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Nr);return c<t.near||c>t.far?null:{distance:c,point:Nr.clone(),object:i}}function Or(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,Ir),i.getVertexPosition(l,Lr),i.getVertexPosition(c,Dr);let h=im(i,e,t,n,Ir,Lr,Dr,kc);if(h){let f=new U;Ki.getBarycoord(kc,Ir,Lr,Dr,f),s&&(h.uv=Ki.getInterpolatedAttribute(s,a,l,c,f,new Oe)),r&&(h.uv1=Ki.getInterpolatedAttribute(r,a,l,c,f,new Oe)),o&&(h.normal=Ki.getInterpolatedAttribute(o,a,l,c,f,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let p={a,b:l,c,normal:new U,materialIndex:0};Ki.getNormal(Ir,Lr,Dr,p.normal),h.face=p,h.barycoord=f}return h}var es=class i extends Fi{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],f=[],p=0,m=0;v("z","y","x",-1,-1,n,t,e,o,r,0),v("z","y","x",1,-1,n,t,-e,o,r,1),v("x","z","y",1,1,e,n,t,s,o,2),v("x","z","y",1,-1,e,n,-t,s,o,3),v("x","y","z",1,-1,e,t,n,s,r,4),v("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Wt(c,3)),this.setAttribute("normal",new Wt(h,3)),this.setAttribute("uv",new Wt(f,2));function v(_,d,u,E,S,M,I,A,C,N,w){let x=M/C,R=I/N,Y=M/2,k=I/2,W=A/2,K=C+1,H=N+1,Q=0,V=0,se=new U;for(let ue=0;ue<H;ue++){let xe=ue*R-k;for(let Be=0;Be<K;Be++){let et=Be*x-Y;se[_]=et*E,se[d]=xe*S,se[u]=W,c.push(se.x,se.y,se.z),se[_]=0,se[d]=0,se[u]=A>0?1:-1,h.push(se.x,se.y,se.z),f.push(Be/C),f.push(1-ue/N),Q+=1}}for(let ue=0;ue<N;ue++)for(let xe=0;xe<C;xe++){let Be=p+xe+K*ue,et=p+xe+K*(ue+1),X=p+(xe+1)+K*(ue+1),ee=p+(xe+1)+K*ue;l.push(Be,et,ee),l.push(et,X,ee),V+=6}a.addGroup(m,V,w),m+=V,p+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Rn(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Pt(i){let e={};for(let t=0;t<i.length;t++){let n=Rn(i[t]);for(let s in n)e[s]=n[s]}return e}function nm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function bl(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ze.workingColorSpace}var Fh={clone:Rn,merge:Pt},sm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,rm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Yt=class extends Mn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sm,this.fragmentShader=rm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Rn(e.uniforms),this.uniformsGroups=nm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Ls=class extends Ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new tt,this.projectionMatrix=new tt,this.projectionMatrixInverse=new tt,this.coordinateSystem=gi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},$i=new U,zc=new Oe,Vc=new Oe,Rt=class extends Ls{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Jn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ms*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Jn*2*Math.atan(Math.tan(Ms*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){$i.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set($i.x,$i.y).multiplyScalar(-e/$i.z),$i.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set($i.x,$i.y).multiplyScalar(-e/$i.z)}getViewSize(e,t){return this.getViewBounds(e,zc,Vc),t.subVectors(Vc,zc)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ms*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},qn=-90,Zn=1,Zr=class extends Ft{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Rt(qn,Zn,e,t);s.layers=this.layers,this.add(s);let r=new Rt(qn,Zn,e,t);r.layers=this.layers,this.add(r);let o=new Rt(qn,Zn,e,t);o.layers=this.layers,this.add(o);let a=new Rt(qn,Zn,e,t);a.layers=this.layers,this.add(a);let l=new Rt(qn,Zn,e,t);l.layers=this.layers,this.add(l);let c=new Rt(qn,Zn,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===gi)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Es)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,f=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(f,p,m),e.xr.enabled=v,n.texture.needsPMREMUpdate=!0}},Ds=class extends xt{constructor(e,t,n,s,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:En,super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},$r=class extends Qt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Ds(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Dt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new es(5,5,5),r=new Yt({name:"CubemapFromEquirect",uniforms:Rn(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ut,blending:ki});r.uniforms.tEquirect.value=t;let o=new pt(s,r),a=t.minFilter;return t.minFilter===xi&&(t.minFilter=Dt),new Zr(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}};var Qi=class extends Ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ei,this.environmentIntensity=1,this.environmentRotation=new ei,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Za=new U,om=new U,am=new Le,mi=class{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Za.subVectors(n,t).cross(om.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Za),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||am.getNormalMatrix(e),s=this.coplanarPoint(Za).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},mn=new jn,Fr=new U,wn=class{constructor(e=new mi,t=new mi,n=new mi,s=new mi,r=new mi,o=new mi){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=gi){let n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],f=s[6],p=s[7],m=s[8],v=s[9],_=s[10],d=s[11],u=s[12],E=s[13],S=s[14],M=s[15];if(n[0].setComponents(l-r,p-c,d-m,M-u).normalize(),n[1].setComponents(l+r,p+c,d+m,M+u).normalize(),n[2].setComponents(l+o,p+h,d+v,M+E).normalize(),n[3].setComponents(l-o,p-h,d-v,M-E).normalize(),n[4].setComponents(l-a,p-f,d-_,M-S).normalize(),t===gi)n[5].setComponents(l+a,p+f,d+_,M+S).normalize();else if(t===Es)n[5].setComponents(a,f,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),mn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),mn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(mn)}intersectsSprite(e){return mn.center.set(0,0,0),mn.radius=.7071067811865476,mn.applyMatrix4(e.matrixWorld),this.intersectsSphere(mn)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Fr.x=s.normal.x>0?e.max.x:e.min.x,Fr.y=s.normal.y>0?e.max.y:e.min.y,Fr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Fr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ti=class extends Ft{constructor(){super(),this.isGroup=!0,this.type="Group"}},Us=class extends xt{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isVideoTexture=!0,this.minFilter=o!==void 0?o:Dt,this.magFilter=r!==void 0?r:Dt,this.generateMipmaps=!1;let h=this;function f(){h.needsUpdate=!0,e.requestVideoFrameCallback(f)}"requestVideoFrameCallback"in e&&e.requestVideoFrameCallback(f)}clone(){return new this.constructor(this.image).copy(this)}update(){let e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}};var Ns=class extends xt{constructor(e,t,n,s,r,o,a,l,c,h=vn){if(h!==vn&&h!==xn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===vn&&(n=sn),n===void 0&&h===xn&&(n=An),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:jt,this.minFilter=l!==void 0?l:jt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Kr=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],p=n[s+1]-h,m=(o-h)/p;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new Oe:new U);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new U,s=[],r=[],o=[],a=new U,l=new tt;for(let m=0;m<=e;m++){let v=m/e;s[m]=this.getTangentAt(v,new U)}r[0]=new U,o[0]=new U;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),f=Math.abs(s[0].y),p=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),p<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),o[m]=o[m-1].clone(),a.crossVectors(s[m-1],s[m]),a.length()>Number.EPSILON){a.normalize();let v=Math.acos(Fe(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(l.makeRotationAxis(a,v))}o[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(Fe(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(m=-m);for(let v=1;v<=e;v++)r[v].applyMatrix4(l.makeRotationAxis(s[v],m*v)),o[v].crossVectors(s[v],r[v])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}};function Hc(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}var Os=class extends Kr{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Oe){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],f=s[o>s.length-3?s.length-1:o+2];return n.set(Hc(a,l.x,c.x,h.x,f.x),Hc(a,l.y,c.y,h.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new Oe().fromArray(s))}return this}};var bn=class i extends Fi{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,f=e/a,p=t/l,m=[],v=[],_=[],d=[];for(let u=0;u<h;u++){let E=u*p-o;for(let S=0;S<c;S++){let M=S*f-r;v.push(M,-E,0),_.push(0,0,1),d.push(S/a),d.push(1-u/l)}}for(let u=0;u<l;u++)for(let E=0;E<a;E++){let S=E+c*u,M=E+c*(u+1),I=E+1+c*(u+1),A=E+1+c*u;m.push(S,M,A),m.push(M,I,A)}this.setIndex(m),this.setAttribute("position",new Wt(v,3)),this.setAttribute("normal",new Wt(_,3)),this.setAttribute("uv",new Wt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Bi=class i extends Fi{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],f=new U,p=new U,m=[],v=[],_=[],d=[];for(let u=0;u<=n;u++){let E=[],S=u/n,M=0;u===0&&o===0?M=.5/t:u===n&&l===Math.PI&&(M=-.5/t);for(let I=0;I<=t;I++){let A=I/t;f.x=-e*Math.cos(s+A*r)*Math.sin(o+S*a),f.y=e*Math.cos(o+S*a),f.z=e*Math.sin(s+A*r)*Math.sin(o+S*a),v.push(f.x,f.y,f.z),p.copy(f).normalize(),_.push(p.x,p.y,p.z),d.push(A+M,1-S),E.push(c++)}h.push(E)}for(let u=0;u<n;u++)for(let E=0;E<t;E++){let S=h[u][E+1],M=h[u][E],I=h[u+1][E],A=h[u+1][E+1];(u!==0||o>0)&&m.push(S,M,A),(u!==n-1||l<Math.PI)&&m.push(M,I,A)}this.setIndex(m),this.setAttribute("position",new Wt(v,3)),this.setAttribute("normal",new Wt(_,3)),this.setAttribute("uv",new Wt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Jr=class extends Mn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Mh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},jr=class extends Mn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Br(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function lm(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Sn=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];i:{e:{let o;t:{n:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break n;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break i}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Qr=class extends Sn{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:$a,endingEnd:$a}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Ka:r=e,a=2*t-n;break;case Ja:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ka:o=e,l=2*n-t;break;case Ja:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,f=this._offsetNext,p=this._weightPrev,m=this._weightNext,v=(n-t)/(s-t),_=v*v,d=_*v,u=-p*d+2*p*_-p*v,E=(1+p)*d+(-1.5-2*p)*_+(-.5+p)*v+1,S=(-1-m)*d+(1.5+m)*_+.5*v,M=m*d-m*_;for(let I=0;I!==a;++I)r[I]=u*o[h+I]+E*o[c+I]+S*o[l+I]+M*o[f+I];return r}},eo=class extends Sn{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),f=1-h;for(let p=0;p!==a;++p)r[p]=o[c+p]*f+o[l+p]*h;return r}},to=class extends Sn{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ii=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Br(t,this.TimeBufferType),this.values=Br(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Br(e.times,Array),values:Br(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new to(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new eo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Qr(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case bs:t=this.InterpolantFactoryMethodDiscrete;break;case Wr:t=this.InterpolantFactoryMethodLinear;break;case kr:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return bs;case this.InterpolantFactoryMethodLinear:return Wr;case this.InterpolantFactoryMethodSmooth:return kr}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&lm(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===kr,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let f=a*n,p=f-n,m=f+n;for(let v=0;v!==n;++v){let _=t[f+v];if(_!==t[p+v]||_!==t[m+v]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let f=a*n,p=o*n;for(let m=0;m!==n;++m)t[p+m]=t[f+m]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};ii.prototype.TimeBufferType=Float32Array;ii.prototype.ValueBufferType=Float32Array;ii.prototype.DefaultInterpolation=Wr;var en=class extends ii{constructor(e,t,n){super(e,t,n)}};en.prototype.ValueTypeName="bool";en.prototype.ValueBufferType=Array;en.prototype.DefaultInterpolation=bs;en.prototype.InterpolantFactoryMethodLinear=void 0;en.prototype.InterpolantFactoryMethodSmooth=void 0;var io=class extends ii{};io.prototype.ValueTypeName="color";var no=class extends ii{};no.prototype.ValueTypeName="number";var so=class extends Sn{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)Xt.slerpFlat(r,0,o,c-a,o,c,l);return r}},Fs=class extends ii{InterpolantFactoryMethodLinear(e){return new so(this.times,this.values,this.getValueSize(),e)}};Fs.prototype.ValueTypeName="quaternion";Fs.prototype.InterpolantFactoryMethodSmooth=void 0;var tn=class extends ii{constructor(e,t,n){super(e,t,n)}};tn.prototype.ValueTypeName="string";tn.prototype.ValueBufferType=Array;tn.prototype.DefaultInterpolation=bs;tn.prototype.InterpolantFactoryMethodLinear=void 0;tn.prototype.InterpolantFactoryMethodSmooth=void 0;var ro=class extends ii{};ro.prototype.ValueTypeName="vector";var Ys={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},oo=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){let f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,p=c.length;f<p;f+=2){let m=c[f],v=c[f+1];if(m.global&&(m.lastIndex=0),m.test(h))return v}return null}}},Bh=new oo,nn=class{constructor(e){this.manager=e!==void 0?e:Bh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};nn.DEFAULT_MATERIAL_NAME="__DEFAULT";var ao=class extends Ls{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};var lo=class extends Rt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}};var Sl="\\[\\]\\.:\\/",cm=new RegExp("["+Sl+"]","g"),El="[^"+Sl+"]",hm="[^"+Sl.replace("\\.","")+"]",um=/((?:WC+[\/:])*)/.source.replace("WC",El),dm=/(WCOD+)?/.source.replace("WCOD",hm),fm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",El),pm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",El),mm=new RegExp("^"+um+dm+fm+pm+"$"),gm=["material","materials","bones","map"],el=class{constructor(e,t,n){let s=n||st.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},st=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(cm,"")}static parseTrackName(e){let t=mm.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);gm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};st.Composite=el;st.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};st.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};st.prototype.GetterByBindingType=[st.prototype._getValue_direct,st.prototype._getValue_array,st.prototype._getValue_arrayElement,st.prototype._getValue_toArray];st.prototype.SetterByBindingTypeAndVersioning=[[st.prototype._setValue_direct,st.prototype._setValue_direct_setNeedsUpdate,st.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[st.prototype._setValue_array,st.prototype._setValue_array_setNeedsUpdate,st.prototype._setValue_array_setMatrixWorldNeedsUpdate],[st.prototype._setValue_arrayElement,st.prototype._setValue_arrayElement_setNeedsUpdate,st.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[st.prototype._setValue_fromArray,st.prototype._setValue_fromArray_setNeedsUpdate,st.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var px=new Float32Array(1);var Gc=new tt,Bs=class{constructor(e,t,n=0,s=1/0){this.ray=new Rs(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Qn,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Gc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Gc),this}intersectObject(e,t=!0,n=[]){return tl(e,this,n,t),n.sort(Wc),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)tl(e[s],this,n,t);return n.sort(Wc),n}};function Wc(i,e){return i.distance-e.distance}function tl(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)tl(r[o],e,t,!0)}}function Tl(i,e,t,n){let s=vm(n);switch(t){case dl:return i*e;case pl:return i*e;case ml:return i*e*2;case gl:return i*e/s.components*s.byteLength;case So:return i*e/s.components*s.byteLength;case vl:return i*e*2/s.components*s.byteLength;case Eo:return i*e*2/s.components*s.byteLength;case fl:return i*e*3/s.components*s.byteLength;case ni:return i*e*4/s.components*s.byteLength;case To:return i*e*4/s.components*s.byteLength;case Vs:case Hs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Gs:case Ws:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Co:case Po:return Math.max(i,16)*Math.max(e,8)/4;case Ao:case Ro:return Math.max(i,8)*Math.max(e,8)/2;case Io:case Lo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Do:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Uo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case No:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Oo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Fo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Bo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ko:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case zo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Vo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ho:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Go:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Wo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Xo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Yo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case qo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Xs:case Zo:case $o:return Math.ceil(i/4)*Math.ceil(e/4)*16;case _l:case Ko:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Jo:case jo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function vm(i){switch(i){case Mi:case cl:return{byteLength:1,components:1};case ts:case hl:case is:return{byteLength:2,components:1};case wo:case bo:return{byteLength:2,components:4};case sn:case Mo:case wi:return{byteLength:4,components:1};case ul:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"171"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="171");function lu(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function ym(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,f=c.byteLength,p=i.createBuffer();i.bindBuffer(l,p),i.bufferData(l,c,h),a.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,l,c){let h=l.array,f=l.updateRanges;if(i.bindBuffer(c,a),f.length===0)i.bufferSubData(c,0,h);else{f.sort((m,v)=>m.start-v.start);let p=0;for(let m=1;m<f.length;m++){let v=f[p],_=f[m];_.start<=v.start+v.count+1?v.count=Math.max(v.count,_.start+_.count-v.start):(++p,f[p]=_)}f.length=p+1;for(let m=0,v=f.length;m<v;m++){let _=f[m];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var xm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,wm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,bm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Em=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Tm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Am=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Rm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Pm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Im=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Lm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Dm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Um=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Nm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Om=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Bm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,km=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,zm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Vm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Hm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Gm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Wm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Xm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Ym=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,qm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,$m=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Km="gl_FragColor = linearToOutputTexel( gl_FragColor );",Jm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,jm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Qm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,eg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,tg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ig=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ng=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,og=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ag=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ug=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,dg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,fg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,vg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,_g=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,yg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,xg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Mg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,wg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sg=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Eg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Tg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ag=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Cg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Rg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ig=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Lg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Dg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ug=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ng=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Og=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Bg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,kg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Hg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Gg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Yg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Zg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,$g=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Kg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Jg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ev=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,iv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,nv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,sv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,rv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ov=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,av=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,cv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,uv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,dv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,fv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,pv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,mv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,vv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,_v=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,yv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,xv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ev=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Tv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Av=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Cv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Rv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Pv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Iv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Lv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Dv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Uv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ov=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Bv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,zv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Vv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Wv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Zv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$v=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Jv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ne={alphahash_fragment:xm,alphahash_pars_fragment:Mm,alphamap_fragment:wm,alphamap_pars_fragment:bm,alphatest_fragment:Sm,alphatest_pars_fragment:Em,aomap_fragment:Tm,aomap_pars_fragment:Am,batching_pars_vertex:Cm,batching_vertex:Rm,begin_vertex:Pm,beginnormal_vertex:Im,bsdfs:Lm,iridescence_fragment:Dm,bumpmap_pars_fragment:Um,clipping_planes_fragment:Nm,clipping_planes_pars_fragment:Om,clipping_planes_pars_vertex:Fm,clipping_planes_vertex:Bm,color_fragment:km,color_pars_fragment:zm,color_pars_vertex:Vm,color_vertex:Hm,common:Gm,cube_uv_reflection_fragment:Wm,defaultnormal_vertex:Xm,displacementmap_pars_vertex:Ym,displacementmap_vertex:qm,emissivemap_fragment:Zm,emissivemap_pars_fragment:$m,colorspace_fragment:Km,colorspace_pars_fragment:Jm,envmap_fragment:jm,envmap_common_pars_fragment:Qm,envmap_pars_fragment:eg,envmap_pars_vertex:tg,envmap_physical_pars_fragment:dg,envmap_vertex:ig,fog_vertex:ng,fog_pars_vertex:sg,fog_fragment:rg,fog_pars_fragment:og,gradientmap_pars_fragment:ag,lightmap_pars_fragment:lg,lights_lambert_fragment:cg,lights_lambert_pars_fragment:hg,lights_pars_begin:ug,lights_toon_fragment:fg,lights_toon_pars_fragment:pg,lights_phong_fragment:mg,lights_phong_pars_fragment:gg,lights_physical_fragment:vg,lights_physical_pars_fragment:_g,lights_fragment_begin:yg,lights_fragment_maps:xg,lights_fragment_end:Mg,logdepthbuf_fragment:wg,logdepthbuf_pars_fragment:bg,logdepthbuf_pars_vertex:Sg,logdepthbuf_vertex:Eg,map_fragment:Tg,map_pars_fragment:Ag,map_particle_fragment:Cg,map_particle_pars_fragment:Rg,metalnessmap_fragment:Pg,metalnessmap_pars_fragment:Ig,morphinstance_vertex:Lg,morphcolor_vertex:Dg,morphnormal_vertex:Ug,morphtarget_pars_vertex:Ng,morphtarget_vertex:Og,normal_fragment_begin:Fg,normal_fragment_maps:Bg,normal_pars_fragment:kg,normal_pars_vertex:zg,normal_vertex:Vg,normalmap_pars_fragment:Hg,clearcoat_normal_fragment_begin:Gg,clearcoat_normal_fragment_maps:Wg,clearcoat_pars_fragment:Xg,iridescence_pars_fragment:Yg,opaque_fragment:qg,packing:Zg,premultiplied_alpha_fragment:$g,project_vertex:Kg,dithering_fragment:Jg,dithering_pars_fragment:jg,roughnessmap_fragment:Qg,roughnessmap_pars_fragment:ev,shadowmap_pars_fragment:tv,shadowmap_pars_vertex:iv,shadowmap_vertex:nv,shadowmask_pars_fragment:sv,skinbase_vertex:rv,skinning_pars_vertex:ov,skinning_vertex:av,skinnormal_vertex:lv,specularmap_fragment:cv,specularmap_pars_fragment:hv,tonemapping_fragment:uv,tonemapping_pars_fragment:dv,transmission_fragment:fv,transmission_pars_fragment:pv,uv_pars_fragment:mv,uv_pars_vertex:gv,uv_vertex:vv,worldpos_vertex:_v,background_vert:yv,background_frag:xv,backgroundCube_vert:Mv,backgroundCube_frag:wv,cube_vert:bv,cube_frag:Sv,depth_vert:Ev,depth_frag:Tv,distanceRGBA_vert:Av,distanceRGBA_frag:Cv,equirect_vert:Rv,equirect_frag:Pv,linedashed_vert:Iv,linedashed_frag:Lv,meshbasic_vert:Dv,meshbasic_frag:Uv,meshlambert_vert:Nv,meshlambert_frag:Ov,meshmatcap_vert:Fv,meshmatcap_frag:Bv,meshnormal_vert:kv,meshnormal_frag:zv,meshphong_vert:Vv,meshphong_frag:Hv,meshphysical_vert:Gv,meshphysical_frag:Wv,meshtoon_vert:Xv,meshtoon_frag:Yv,points_vert:qv,points_frag:Zv,shadow_vert:$v,shadow_frag:Kv,sprite_vert:Jv,sprite_frag:jv},te={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Le}},envmap:{envMap:{value:null},envMapRotation:{value:new Le},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Le},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0},uvTransform:{value:new Le}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}}},bi={basic:{uniforms:Pt([te.common,te.specularmap,te.envmap,te.aomap,te.lightmap,te.fog]),vertexShader:Ne.meshbasic_vert,fragmentShader:Ne.meshbasic_frag},lambert:{uniforms:Pt([te.common,te.specularmap,te.envmap,te.aomap,te.lightmap,te.emissivemap,te.bumpmap,te.normalmap,te.displacementmap,te.fog,te.lights,{emissive:{value:new qe(0)}}]),vertexShader:Ne.meshlambert_vert,fragmentShader:Ne.meshlambert_frag},phong:{uniforms:Pt([te.common,te.specularmap,te.envmap,te.aomap,te.lightmap,te.emissivemap,te.bumpmap,te.normalmap,te.displacementmap,te.fog,te.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30}}]),vertexShader:Ne.meshphong_vert,fragmentShader:Ne.meshphong_frag},standard:{uniforms:Pt([te.common,te.envmap,te.aomap,te.lightmap,te.emissivemap,te.bumpmap,te.normalmap,te.displacementmap,te.roughnessmap,te.metalnessmap,te.fog,te.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag},toon:{uniforms:Pt([te.common,te.aomap,te.lightmap,te.emissivemap,te.bumpmap,te.normalmap,te.displacementmap,te.gradientmap,te.fog,te.lights,{emissive:{value:new qe(0)}}]),vertexShader:Ne.meshtoon_vert,fragmentShader:Ne.meshtoon_frag},matcap:{uniforms:Pt([te.common,te.bumpmap,te.normalmap,te.displacementmap,te.fog,{matcap:{value:null}}]),vertexShader:Ne.meshmatcap_vert,fragmentShader:Ne.meshmatcap_frag},points:{uniforms:Pt([te.points,te.fog]),vertexShader:Ne.points_vert,fragmentShader:Ne.points_frag},dashed:{uniforms:Pt([te.common,te.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ne.linedashed_vert,fragmentShader:Ne.linedashed_frag},depth:{uniforms:Pt([te.common,te.displacementmap]),vertexShader:Ne.depth_vert,fragmentShader:Ne.depth_frag},normal:{uniforms:Pt([te.common,te.bumpmap,te.normalmap,te.displacementmap,{opacity:{value:1}}]),vertexShader:Ne.meshnormal_vert,fragmentShader:Ne.meshnormal_frag},sprite:{uniforms:Pt([te.sprite,te.fog]),vertexShader:Ne.sprite_vert,fragmentShader:Ne.sprite_frag},background:{uniforms:{uvTransform:{value:new Le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ne.background_vert,fragmentShader:Ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Le}},vertexShader:Ne.backgroundCube_vert,fragmentShader:Ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ne.cube_vert,fragmentShader:Ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ne.equirect_vert,fragmentShader:Ne.equirect_frag},distanceRGBA:{uniforms:Pt([te.common,te.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ne.distanceRGBA_vert,fragmentShader:Ne.distanceRGBA_frag},shadow:{uniforms:Pt([te.lights,te.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:Ne.shadow_vert,fragmentShader:Ne.shadow_frag}};bi.physical={uniforms:Pt([bi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Le},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Le},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Le},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Le},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Le},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Le},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Le}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag};var Qo={r:0,b:0,g:0},Pn=new ei,Qv=new tt;function e0(i,e,t,n,s,r,o){let a=new qe(0),l=r===!0?0:1,c,h,f=null,p=0,m=null;function v(S){let M=S.isScene===!0?S.background:null;return M&&M.isTexture&&(M=(S.backgroundBlurriness>0?t:e).get(M)),M}function _(S){let M=!1,I=v(S);I===null?u(a,l):I&&I.isColor&&(u(I,1),M=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function d(S,M){let I=v(M);I&&(I.isCubeTexture||I.mapping===ks)?(h===void 0&&(h=new pt(new es(1,1,1),new Yt({name:"BackgroundCubeMaterial",uniforms:Rn(bi.backgroundCube.uniforms),vertexShader:bi.backgroundCube.vertexShader,fragmentShader:bi.backgroundCube.fragmentShader,side:Ut,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,C,N){this.matrixWorld.copyPosition(N.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Pn.copy(M.backgroundRotation),Pn.x*=-1,Pn.y*=-1,Pn.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&(Pn.y*=-1,Pn.z*=-1),h.material.uniforms.envMap.value=I,h.material.uniforms.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Qv.makeRotationFromEuler(Pn)),h.material.toneMapped=ze.getTransfer(I.colorSpace)!==Qe,(f!==I||p!==I.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,f=I,p=I.version,m=i.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):I&&I.isTexture&&(c===void 0&&(c=new pt(new bn(2,2),new Yt({name:"BackgroundMaterial",uniforms:Rn(bi.background.uniforms),vertexShader:bi.background.vertexShader,fragmentShader:bi.background.fragmentShader,side:Ui,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=I,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=ze.getTransfer(I.colorSpace)!==Qe,I.matrixAutoUpdate===!0&&I.updateMatrix(),c.material.uniforms.uvTransform.value.copy(I.matrix),(f!==I||p!==I.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,f=I,p=I.version,m=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function u(S,M){S.getRGB(Qo,bl(i)),n.buffers.color.setClear(Qo.r,Qo.g,Qo.b,M,o)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose()),c!==void 0&&(c.geometry.dispose(),c.material.dispose())}return{getClearColor:function(){return a},setClearColor:function(S,M=1){a.set(S),l=M,u(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,u(a,l)},render:_,addToRenderList:d,dispose:E}}function t0(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null),r=s,o=!1;function a(x,R,Y,k,W){let K=!1,H=f(k,Y,R);r!==H&&(r=H,c(r.object)),K=m(x,k,Y,W),K&&v(x,k,Y,W),W!==null&&e.update(W,i.ELEMENT_ARRAY_BUFFER),(K||o)&&(o=!1,M(x,R,Y,k),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return i.createVertexArray()}function c(x){return i.bindVertexArray(x)}function h(x){return i.deleteVertexArray(x)}function f(x,R,Y){let k=Y.wireframe===!0,W=n[x.id];W===void 0&&(W={},n[x.id]=W);let K=W[R.id];K===void 0&&(K={},W[R.id]=K);let H=K[k];return H===void 0&&(H=p(l()),K[k]=H),H}function p(x){let R=[],Y=[],k=[];for(let W=0;W<t;W++)R[W]=0,Y[W]=0,k[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:Y,attributeDivisors:k,object:x,attributes:{},index:null}}function m(x,R,Y,k){let W=r.attributes,K=R.attributes,H=0,Q=Y.getAttributes();for(let V in Q)if(Q[V].location>=0){let ue=W[V],xe=K[V];if(xe===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(xe=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(xe=x.instanceColor)),ue===void 0||ue.attribute!==xe||xe&&ue.data!==xe.data)return!0;H++}return r.attributesNum!==H||r.index!==k}function v(x,R,Y,k){let W={},K=R.attributes,H=0,Q=Y.getAttributes();for(let V in Q)if(Q[V].location>=0){let ue=K[V];ue===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(ue=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(ue=x.instanceColor));let xe={};xe.attribute=ue,ue&&ue.data&&(xe.data=ue.data),W[V]=xe,H++}r.attributes=W,r.attributesNum=H,r.index=k}function _(){let x=r.newAttributes;for(let R=0,Y=x.length;R<Y;R++)x[R]=0}function d(x){u(x,0)}function u(x,R){let Y=r.newAttributes,k=r.enabledAttributes,W=r.attributeDivisors;Y[x]=1,k[x]===0&&(i.enableVertexAttribArray(x),k[x]=1),W[x]!==R&&(i.vertexAttribDivisor(x,R),W[x]=R)}function E(){let x=r.newAttributes,R=r.enabledAttributes;for(let Y=0,k=R.length;Y<k;Y++)R[Y]!==x[Y]&&(i.disableVertexAttribArray(Y),R[Y]=0)}function S(x,R,Y,k,W,K,H){H===!0?i.vertexAttribIPointer(x,R,Y,W,K):i.vertexAttribPointer(x,R,Y,k,W,K)}function M(x,R,Y,k){_();let W=k.attributes,K=Y.getAttributes(),H=R.defaultAttributeValues;for(let Q in K){let V=K[Q];if(V.location>=0){let se=W[Q];if(se===void 0&&(Q==="instanceMatrix"&&x.instanceMatrix&&(se=x.instanceMatrix),Q==="instanceColor"&&x.instanceColor&&(se=x.instanceColor)),se!==void 0){let ue=se.normalized,xe=se.itemSize,Be=e.get(se);if(Be===void 0)continue;let et=Be.buffer,X=Be.type,ee=Be.bytesPerElement,ve=X===i.INT||X===i.UNSIGNED_INT||se.gpuType===Mo;if(se.isInterleavedBufferAttribute){let re=se.data,Te=re.stride,Ie=se.offset;if(re.isInstancedInterleavedBuffer){for(let ke=0;ke<V.locationSize;ke++)u(V.location+ke,re.meshPerAttribute);x.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let ke=0;ke<V.locationSize;ke++)d(V.location+ke);i.bindBuffer(i.ARRAY_BUFFER,et);for(let ke=0;ke<V.locationSize;ke++)S(V.location+ke,xe/V.locationSize,X,ue,Te*ee,(Ie+xe/V.locationSize*ke)*ee,ve)}else{if(se.isInstancedBufferAttribute){for(let re=0;re<V.locationSize;re++)u(V.location+re,se.meshPerAttribute);x.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let re=0;re<V.locationSize;re++)d(V.location+re);i.bindBuffer(i.ARRAY_BUFFER,et);for(let re=0;re<V.locationSize;re++)S(V.location+re,xe/V.locationSize,X,ue,xe*ee,xe/V.locationSize*re*ee,ve)}}else if(H!==void 0){let ue=H[Q];if(ue!==void 0)switch(ue.length){case 2:i.vertexAttrib2fv(V.location,ue);break;case 3:i.vertexAttrib3fv(V.location,ue);break;case 4:i.vertexAttrib4fv(V.location,ue);break;default:i.vertexAttrib1fv(V.location,ue)}}}}E()}function I(){N();for(let x in n){let R=n[x];for(let Y in R){let k=R[Y];for(let W in k)h(k[W].object),delete k[W];delete R[Y]}delete n[x]}}function A(x){if(n[x.id]===void 0)return;let R=n[x.id];for(let Y in R){let k=R[Y];for(let W in k)h(k[W].object),delete k[W];delete R[Y]}delete n[x.id]}function C(x){for(let R in n){let Y=n[R];if(Y[x.id]===void 0)continue;let k=Y[x.id];for(let W in k)h(k[W].object),delete k[W];delete Y[x.id]}}function N(){w(),o=!0,r!==s&&(r=s,c(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:N,resetDefaultState:w,dispose:I,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:d,disableUnusedAttributes:E}}function i0(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,f){f!==0&&(i.drawArraysInstanced(n,c,h,f),t.update(h,n,f))}function a(c,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,f);let m=0;for(let v=0;v<f;v++)m+=h[v];t.update(m,n,1)}function l(c,h,f,p){if(f===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let v=0;v<c.length;v++)o(c[v],h[v],p[v]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,h,0,p,0,f);let v=0;for(let _=0;_<f;_++)v+=h[_]*p[_];t.update(v,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function n0(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==ni&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let N=C===is&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Mi&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==wi&&!N)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let f=t.logarithmicDepthBuffer===!0,p=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),d=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=v>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:p,maxTextures:m,maxVertexTextures:v,maxTextureSize:_,maxCubemapSize:d,maxAttributes:u,maxVertexUniforms:E,maxVaryings:S,maxFragmentUniforms:M,vertexTextures:I,maxSamples:A}}function s0(i){let e=this,t=null,n=0,s=!1,r=!1,o=new mi,a=new Le,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){let m=f.length!==0||p||n!==0||s;return s=p,n=f.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,p){t=h(f,p,0)},this.setState=function(f,p,m){let v=f.clippingPlanes,_=f.clipIntersection,d=f.clipShadows,u=i.get(f);if(!s||v===null||v.length===0||r&&!d)r?h(null):c();else{let E=r?0:n,S=E*4,M=u.clippingState||null;l.value=M,M=h(v,p,S,m);for(let I=0;I!==S;++I)M[I]=t[I];u.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(f,p,m,v){let _=f!==null?f.length:0,d=null;if(_!==0){if(d=l.value,v!==!0||d===null){let u=m+_*4,E=p.matrixWorldInverse;a.getNormalMatrix(E),(d===null||d.length<u)&&(d=new Float32Array(u));for(let S=0,M=m;S!==_;++S,M+=4)o.copy(f[S]).applyMatrix4(E,a),o.normal.toArray(d,M),d[M+3]=o.constant}l.value=d,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,d}}function r0(i){let e=new WeakMap;function t(o,a){return a===_o?o.mapping=En:a===yo&&(o.mapping=Tn),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===_o||a===yo)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new $r(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var rs=4,kh=[.125,.215,.35,.446,.526,.582],Dn=20,Al=new ao,zh=new qe,Cl=null,Rl=0,Pl=0,Il=!1,Ln=(1+Math.sqrt(5))/2,ss=1/Ln,Vh=[new U(-Ln,ss,0),new U(Ln,ss,0),new U(-ss,0,Ln),new U(ss,0,Ln),new U(0,Ln,-ss),new U(0,Ln,ss),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)],ia=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Cl=this._renderer.getRenderTarget(),Rl=this._renderer.getActiveCubeFace(),Pl=this._renderer.getActiveMipmapLevel(),Il=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Wh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Gh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Cl,Rl,Pl),this._renderer.xr.enabled=Il,e.scissorTest=!1,ea(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===En||e.mapping===Tn?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Cl=this._renderer.getRenderTarget(),Rl=this._renderer.getActiveCubeFace(),Pl=this._renderer.getActiveMipmapLevel(),Il=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Dt,minFilter:Dt,generateMipmaps:!1,type:is,format:ni,colorSpace:Ni,depthBuffer:!1},s=Hh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hh(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=o0(r)),this._blurMaterial=a0(r,e,t)}return s}_compileMaterial(e){let t=new pt(this._lodPlanes[0],e);this._renderer.compile(t,Al)}_sceneToCubeUV(e,t,n,s){let a=new Rt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,p=h.toneMapping;h.getClearColor(zh),h.toneMapping=zi,h.autoClear=!1;let m=new di({name:"PMREM.Background",side:Ut,depthWrite:!1,depthTest:!1}),v=new pt(new es,m),_=!1,d=e.background;d?d.isColor&&(m.color.copy(d),e.background=null,_=!0):(m.color.copy(zh),_=!0);for(let u=0;u<6;u++){let E=u%3;E===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):E===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));let S=this._cubeSize;ea(s,E*S,u>2?S:0,S,S),h.setRenderTarget(s),_&&h.render(v,a),h.render(e,a)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=p,h.autoClear=f,e.background=d}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===En||e.mapping===Tn;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Wh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Gh());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new pt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;ea(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Al)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Vh[(s-r-1)%Vh.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,f=new pt(this._lodPlanes[s],c),p=c.uniforms,m=this._sizeLods[n]-1,v=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Dn-1),_=r/v,d=isFinite(r)?1+Math.floor(h*_):Dn;d>Dn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${d} samples when the maximum is set to ${Dn}`);let u=[],E=0;for(let C=0;C<Dn;++C){let N=C/_,w=Math.exp(-N*N/2);u.push(w),C===0?E+=w:C<d&&(E+=2*w)}for(let C=0;C<u.length;C++)u[C]=u[C]/E;p.envMap.value=e.texture,p.samples.value=d,p.weights.value=u,p.latitudinal.value=o==="latitudinal",a&&(p.poleAxis.value=a);let{_lodMax:S}=this;p.dTheta.value=v,p.mipInt.value=S-n;let M=this._sizeLods[s],I=3*M*(s>S-rs?s-S+rs:0),A=4*(this._cubeSize-M);ea(t,I,A,3*M,2*M),l.setRenderTarget(t),l.render(f,Al)}};function o0(i){let e=[],t=[],n=[],s=i,r=i-rs+1+kh.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-rs?l=kh[o-i+rs-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,f=1+c,p=[h,h,f,h,f,f,h,h,f,f,h,f],m=6,v=6,_=3,d=2,u=1,E=new Float32Array(_*v*m),S=new Float32Array(d*v*m),M=new Float32Array(u*v*m);for(let A=0;A<m;A++){let C=A%3*2/3-1,N=A>2?0:-1,w=[C,N,0,C+2/3,N,0,C+2/3,N+1,0,C,N,0,C+2/3,N+1,0,C,N+1,0];E.set(w,_*v*A),S.set(p,d*v*A);let x=[A,A,A,A,A,A];M.set(x,u*v*A)}let I=new Fi;I.setAttribute("position",new Gt(E,_)),I.setAttribute("uv",new Gt(S,d)),I.setAttribute("faceIndex",new Gt(M,u)),e.push(I),s>rs&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Hh(i,e,t){let n=new Qt(i,e,t);return n.texture.mapping=ks,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ea(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function a0(i,e,t){let n=new Float32Array(Dn),s=new U(0,1,0);return new Yt({name:"SphericalGaussianBlur",defines:{n:Dn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ki,depthTest:!1,depthWrite:!1})}function Gh(){return new Yt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ki,depthTest:!1,depthWrite:!1})}function Wh(){return new Yt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ki,depthTest:!1,depthWrite:!1})}function Vl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function l0(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===_o||l===yo,h=l===En||l===Tn;if(c||h){let f=e.get(a),p=f!==void 0?f.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==p)return t===null&&(t=new ia(i)),f=c?t.fromEquirectangular(a,f):t.fromCubemap(a,f),f.texture.pmremVersion=a.pmremVersion,e.set(a,f),f.texture;if(f!==void 0)return f.texture;{let m=a.image;return c&&m&&m.height>0||h&&m&&s(m)?(t===null&&(t=new ia(i)),f=c?t.fromEquirectangular(a):t.fromCubemap(a),f.texture.pmremVersion=a.pmremVersion,e.set(a,f),a.addEventListener("dispose",r),f.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function c0(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Cn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function h0(i,e,t,n){let s={},r=new WeakMap;function o(f){let p=f.target;p.index!==null&&e.remove(p.index);for(let v in p.attributes)e.remove(p.attributes[v]);p.removeEventListener("dispose",o),delete s[p.id];let m=r.get(p);m&&(e.remove(m),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function a(f,p){return s[p.id]===!0||(p.addEventListener("dispose",o),s[p.id]=!0,t.memory.geometries++),p}function l(f){let p=f.attributes;for(let m in p)e.update(p[m],i.ARRAY_BUFFER)}function c(f){let p=[],m=f.index,v=f.attributes.position,_=0;if(m!==null){let E=m.array;_=m.version;for(let S=0,M=E.length;S<M;S+=3){let I=E[S+0],A=E[S+1],C=E[S+2];p.push(I,A,A,C,C,I)}}else if(v!==void 0){let E=v.array;_=v.version;for(let S=0,M=E.length/3-1;S<M;S+=3){let I=S+0,A=S+1,C=S+2;p.push(I,A,A,C,C,I)}}else return;let d=new(wl(p)?Is:Ps)(p,1);d.version=_;let u=r.get(f);u&&e.remove(u),r.set(f,d)}function h(f){let p=r.get(f);if(p){let m=f.index;m!==null&&p.version<m.version&&c(f)}else c(f);return r.get(f)}return{get:a,update:l,getWireframeAttribute:h}}function u0(i,e,t){let n;function s(p){n=p}let r,o;function a(p){r=p.type,o=p.bytesPerElement}function l(p,m){i.drawElements(n,m,r,p*o),t.update(m,n,1)}function c(p,m,v){v!==0&&(i.drawElementsInstanced(n,m,r,p*o,v),t.update(m,n,v))}function h(p,m,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,p,0,v);let d=0;for(let u=0;u<v;u++)d+=m[u];t.update(d,n,1)}function f(p,m,v,_){if(v===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let u=0;u<p.length;u++)c(p[u]/o,m[u],_[u]);else{d.multiDrawElementsInstancedWEBGL(n,m,0,r,p,0,_,0,v);let u=0;for(let E=0;E<v;E++)u+=m[E]*_[E];t.update(u,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function d0(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function f0(i,e,t){let n=new WeakMap,s=new ht;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=h!==void 0?h.length:0,p=n.get(a);if(p===void 0||p.count!==f){let w=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",w)};p!==void 0&&p.texture.dispose();let m=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],u=a.morphAttributes.normal||[],E=a.morphAttributes.color||[],S=0;m===!0&&(S=1),v===!0&&(S=2),_===!0&&(S=3);let M=a.attributes.position.count*S,I=1;M>e.maxTextureSize&&(I=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);let A=new Float32Array(M*I*4*f),C=new Cs(A,M,I,f);C.type=wi,C.needsUpdate=!0;let N=S*4;for(let x=0;x<f;x++){let R=d[x],Y=u[x],k=E[x],W=M*I*4*x;for(let K=0;K<R.count;K++){let H=K*N;m===!0&&(s.fromBufferAttribute(R,K),A[W+H+0]=s.x,A[W+H+1]=s.y,A[W+H+2]=s.z,A[W+H+3]=0),v===!0&&(s.fromBufferAttribute(Y,K),A[W+H+4]=s.x,A[W+H+5]=s.y,A[W+H+6]=s.z,A[W+H+7]=0),_===!0&&(s.fromBufferAttribute(k,K),A[W+H+8]=s.x,A[W+H+9]=s.y,A[W+H+10]=s.z,A[W+H+11]=k.itemSize===4?s.w:1)}}p={count:f,texture:C,size:new Oe(M,I)},n.set(a,p),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let m=0;for(let _=0;_<c.length;_++)m+=c[_];let v=a.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",p.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:r}}function p0(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,f=e.get(l,h);if(s.get(f)!==c&&(e.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let p=l.skeleton;s.get(p)!==c&&(p.update(),s.set(p,c))}return f}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var cu=new xt,Xh=new Ns(1,1),hu=new Cs,uu=new qr,du=new Ds,Yh=[],qh=[],Zh=new Float32Array(16),$h=new Float32Array(9),Kh=new Float32Array(4);function as(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Yh[s];if(r===void 0&&(r=new Float32Array(s),Yh[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function gt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function vt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function sa(i,e){let t=qh[e];t===void 0&&(t=new Int32Array(e),qh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function m0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function g0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gt(t,e))return;i.uniform2fv(this.addr,e),vt(t,e)}}function v0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(gt(t,e))return;i.uniform3fv(this.addr,e),vt(t,e)}}function _0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gt(t,e))return;i.uniform4fv(this.addr,e),vt(t,e)}}function y0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(gt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),vt(t,e)}else{if(gt(t,n))return;Kh.set(n),i.uniformMatrix2fv(this.addr,!1,Kh),vt(t,n)}}function x0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(gt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),vt(t,e)}else{if(gt(t,n))return;$h.set(n),i.uniformMatrix3fv(this.addr,!1,$h),vt(t,n)}}function M0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(gt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),vt(t,e)}else{if(gt(t,n))return;Zh.set(n),i.uniformMatrix4fv(this.addr,!1,Zh),vt(t,n)}}function w0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function b0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gt(t,e))return;i.uniform2iv(this.addr,e),vt(t,e)}}function S0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(gt(t,e))return;i.uniform3iv(this.addr,e),vt(t,e)}}function E0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gt(t,e))return;i.uniform4iv(this.addr,e),vt(t,e)}}function T0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function A0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gt(t,e))return;i.uniform2uiv(this.addr,e),vt(t,e)}}function C0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(gt(t,e))return;i.uniform3uiv(this.addr,e),vt(t,e)}}function R0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gt(t,e))return;i.uniform4uiv(this.addr,e),vt(t,e)}}function P0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Xh.compareFunction=yl,r=Xh):r=cu,t.setTexture2D(e||r,s)}function I0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||uu,s)}function L0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||du,s)}function D0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||hu,s)}function U0(i){switch(i){case 5126:return m0;case 35664:return g0;case 35665:return v0;case 35666:return _0;case 35674:return y0;case 35675:return x0;case 35676:return M0;case 5124:case 35670:return w0;case 35667:case 35671:return b0;case 35668:case 35672:return S0;case 35669:case 35673:return E0;case 5125:return T0;case 36294:return A0;case 36295:return C0;case 36296:return R0;case 35678:case 36198:case 36298:case 36306:case 35682:return P0;case 35679:case 36299:case 36307:return I0;case 35680:case 36300:case 36308:case 36293:return L0;case 36289:case 36303:case 36311:case 36292:return D0}}function N0(i,e){i.uniform1fv(this.addr,e)}function O0(i,e){let t=as(e,this.size,2);i.uniform2fv(this.addr,t)}function F0(i,e){let t=as(e,this.size,3);i.uniform3fv(this.addr,t)}function B0(i,e){let t=as(e,this.size,4);i.uniform4fv(this.addr,t)}function k0(i,e){let t=as(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function z0(i,e){let t=as(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function V0(i,e){let t=as(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function H0(i,e){i.uniform1iv(this.addr,e)}function G0(i,e){i.uniform2iv(this.addr,e)}function W0(i,e){i.uniform3iv(this.addr,e)}function X0(i,e){i.uniform4iv(this.addr,e)}function Y0(i,e){i.uniform1uiv(this.addr,e)}function q0(i,e){i.uniform2uiv(this.addr,e)}function Z0(i,e){i.uniform3uiv(this.addr,e)}function $0(i,e){i.uniform4uiv(this.addr,e)}function K0(i,e,t){let n=this.cache,s=e.length,r=sa(t,s);gt(n,r)||(i.uniform1iv(this.addr,r),vt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||cu,r[o])}function J0(i,e,t){let n=this.cache,s=e.length,r=sa(t,s);gt(n,r)||(i.uniform1iv(this.addr,r),vt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||uu,r[o])}function j0(i,e,t){let n=this.cache,s=e.length,r=sa(t,s);gt(n,r)||(i.uniform1iv(this.addr,r),vt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||du,r[o])}function Q0(i,e,t){let n=this.cache,s=e.length,r=sa(t,s);gt(n,r)||(i.uniform1iv(this.addr,r),vt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||hu,r[o])}function e_(i){switch(i){case 5126:return N0;case 35664:return O0;case 35665:return F0;case 35666:return B0;case 35674:return k0;case 35675:return z0;case 35676:return V0;case 5124:case 35670:return H0;case 35667:case 35671:return G0;case 35668:case 35672:return W0;case 35669:case 35673:return X0;case 5125:return Y0;case 36294:return q0;case 36295:return Z0;case 36296:return $0;case 35678:case 36198:case 36298:case 36306:case 35682:return K0;case 35679:case 36299:case 36307:return J0;case 35680:case 36300:case 36308:case 36293:return j0;case 36289:case 36303:case 36311:case 36292:return Q0}}var Dl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=U0(t.type)}},Ul=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=e_(t.type)}},Nl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Ll=/(\w+)(\])?(\[|\.)?/g;function Jh(i,e){i.seq.push(e),i.map[e.id]=e}function t_(i,e,t){let n=i.name,s=n.length;for(Ll.lastIndex=0;;){let r=Ll.exec(n),o=Ll.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Jh(t,c===void 0?new Dl(a,i,e):new Ul(a,i,e));break}else{let f=t.map[a];f===void 0&&(f=new Nl(a),Jh(t,f)),t=f}}}var os=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);t_(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function jh(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var i_=37297,n_=0;function s_(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Qh=new Le;function r_(i){ze._getMatrix(Qh,ze.workingColorSpace,i);let e=`mat3( ${Qh.elements.map(t=>t.toFixed(4))} )`;switch(ze.getTransfer(i)){case Ss:return[e,"LinearTransferOETF"];case Qe:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function eu(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+s_(i.getShaderSource(e),o)}else return s}function o_(i,e){let t=r_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function a_(i,e){let t;switch(e){case vo:t="Linear";break;case ph:t="Reinhard";break;case mh:t="Cineon";break;case gh:t="ACESFilmic";break;case _h:t="AgX";break;case yh:t="Neutral";break;case vh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var ta=new U;function l_(){ze.getLuminanceCoefficients(ta);let i=ta.x.toFixed(4),e=ta.y.toFixed(4),t=ta.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function c_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qs).join(`
`)}function h_(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function u_(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function qs(i){return i!==""}function tu(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function iu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var d_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ol(i){return i.replace(d_,p_)}var f_=new Map;function p_(i,e){let t=Ne[e];if(t===void 0){let n=f_.get(e);if(n!==void 0)t=Ne[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ol(t)}var m_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nu(i){return i.replace(m_,g_)}function g_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function su(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function v_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===nl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===qc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===_i&&(e="SHADOWMAP_TYPE_VSM"),e}function __(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case En:case Tn:e="ENVMAP_TYPE_CUBE";break;case ks:e="ENVMAP_TYPE_CUBE_UV";break}return e}function y_(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Tn&&(e="ENVMAP_MODE_REFRACTION"),e}function x_(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case al:e="ENVMAP_BLENDING_MULTIPLY";break;case dh:e="ENVMAP_BLENDING_MIX";break;case fh:e="ENVMAP_BLENDING_ADD";break}return e}function M_(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function w_(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=v_(t),c=__(t),h=y_(t),f=x_(t),p=M_(t),m=c_(t),v=h_(r),_=s.createProgram(),d,u,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(qs).join(`
`),d.length>0&&(d+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(qs).join(`
`),u.length>0&&(u+=`
`)):(d=[su(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qs).join(`
`),u=[su(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==zi?"#define TONE_MAPPING":"",t.toneMapping!==zi?Ne.tonemapping_pars_fragment:"",t.toneMapping!==zi?a_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ne.colorspace_pars_fragment,o_("linearToOutputTexel",t.outputColorSpace),l_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(qs).join(`
`)),o=Ol(o),o=tu(o,t),o=iu(o,t),a=Ol(a),a=tu(a,t),a=iu(a,t),o=nu(o),a=nu(a),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,d=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,u=["#define varying in",t.glslVersion===xl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===xl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);let S=E+d+o,M=E+u+a,I=jh(s,s.VERTEX_SHADER,S),A=jh(s,s.FRAGMENT_SHADER,M);s.attachShader(_,I),s.attachShader(_,A),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(R){if(i.debug.checkShaderErrors){let Y=s.getProgramInfoLog(_).trim(),k=s.getShaderInfoLog(I).trim(),W=s.getShaderInfoLog(A).trim(),K=!0,H=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,I,A);else{let Q=eu(s,I,"vertex"),V=eu(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+Y+`
`+Q+`
`+V)}else Y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Y):(k===""||W==="")&&(H=!1);H&&(R.diagnostics={runnable:K,programLog:Y,vertexShader:{log:k,prefix:d},fragmentShader:{log:W,prefix:u}})}s.deleteShader(I),s.deleteShader(A),N=new os(s,_),w=u_(s,_)}let N;this.getUniforms=function(){return N===void 0&&C(this),N};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(_,i_)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=n_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=I,this.fragmentShader=A,this}var b_=0,Fl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Bl(e),t.set(e,n)),n}},Bl=class{constructor(e){this.id=b_++,this.code=e,this.usedTimes=0}};function S_(i,e,t,n,s,r,o){let a=new Qn,l=new Fl,c=new Set,h=[],f=s.logarithmicDepthBuffer,p=s.vertexTextures,m=s.precision,v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(w){return c.add(w),w===0?"uv":`uv${w}`}function d(w,x,R,Y,k){let W=Y.fog,K=k.geometry,H=w.isMeshStandardMaterial?Y.environment:null,Q=(w.isMeshStandardMaterial?t:e).get(w.envMap||H),V=Q&&Q.mapping===ks?Q.image.height:null,se=v[w.type];w.precision!==null&&(m=s.getMaxPrecision(w.precision),m!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",m,"instead."));let ue=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,xe=ue!==void 0?ue.length:0,Be=0;K.morphAttributes.position!==void 0&&(Be=1),K.morphAttributes.normal!==void 0&&(Be=2),K.morphAttributes.color!==void 0&&(Be=3);let et,X,ee,ve;if(se){let je=bi[se];et=je.vertexShader,X=je.fragmentShader}else et=w.vertexShader,X=w.fragmentShader,l.update(w),ee=l.getVertexShaderID(w),ve=l.getFragmentShaderID(w);let re=i.getRenderTarget(),Te=i.state.buffers.depth.getReversed(),Ie=k.isInstancedMesh===!0,ke=k.isBatchedMesh===!0,at=!!w.map,We=!!w.matcap,ut=!!Q,T=!!w.aoMap,Zt=!!w.lightMap,Ve=!!w.bumpMap,He=!!w.normalMap,Me=!!w.displacementMap,nt=!!w.emissiveMap,we=!!w.metalnessMap,b=!!w.roughnessMap,g=w.anisotropy>0,O=w.clearcoat>0,q=w.dispersion>0,$=w.iridescence>0,G=w.sheen>0,_e=w.transmission>0,oe=g&&!!w.anisotropyMap,de=O&&!!w.clearcoatMap,Xe=O&&!!w.clearcoatNormalMap,j=O&&!!w.clearcoatRoughnessMap,fe=$&&!!w.iridescenceMap,Ee=$&&!!w.iridescenceThicknessMap,Ae=G&&!!w.sheenColorMap,pe=G&&!!w.sheenRoughnessMap,Ge=!!w.specularMap,Ue=!!w.specularColorMap,it=!!w.specularIntensityMap,P=_e&&!!w.transmissionMap,ie=_e&&!!w.thicknessMap,z=!!w.gradientMap,Z=!!w.alphaMap,le=w.alphaTest>0,ae=!!w.alphaHash,De=!!w.extensions,lt=zi;w.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(lt=i.toneMapping);let Tt={shaderID:se,shaderType:w.type,shaderName:w.name,vertexShader:et,fragmentShader:X,defines:w.defines,customVertexShaderID:ee,customFragmentShaderID:ve,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:m,batching:ke,batchingColor:ke&&k._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&k.instanceColor!==null,instancingMorph:Ie&&k.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:re===null?i.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:Ni,alphaToCoverage:!!w.alphaToCoverage,map:at,matcap:We,envMap:ut,envMapMode:ut&&Q.mapping,envMapCubeUVHeight:V,aoMap:T,lightMap:Zt,bumpMap:Ve,normalMap:He,displacementMap:p&&Me,emissiveMap:nt,normalMapObjectSpace:He&&w.normalMapType===Sh,normalMapTangentSpace:He&&w.normalMapType===bh,metalnessMap:we,roughnessMap:b,anisotropy:g,anisotropyMap:oe,clearcoat:O,clearcoatMap:de,clearcoatNormalMap:Xe,clearcoatRoughnessMap:j,dispersion:q,iridescence:$,iridescenceMap:fe,iridescenceThicknessMap:Ee,sheen:G,sheenColorMap:Ae,sheenRoughnessMap:pe,specularMap:Ge,specularColorMap:Ue,specularIntensityMap:it,transmission:_e,transmissionMap:P,thicknessMap:ie,gradientMap:z,opaque:w.transparent===!1&&w.blending===_n&&w.alphaToCoverage===!1,alphaMap:Z,alphaTest:le,alphaHash:ae,combine:w.combine,mapUv:at&&_(w.map.channel),aoMapUv:T&&_(w.aoMap.channel),lightMapUv:Zt&&_(w.lightMap.channel),bumpMapUv:Ve&&_(w.bumpMap.channel),normalMapUv:He&&_(w.normalMap.channel),displacementMapUv:Me&&_(w.displacementMap.channel),emissiveMapUv:nt&&_(w.emissiveMap.channel),metalnessMapUv:we&&_(w.metalnessMap.channel),roughnessMapUv:b&&_(w.roughnessMap.channel),anisotropyMapUv:oe&&_(w.anisotropyMap.channel),clearcoatMapUv:de&&_(w.clearcoatMap.channel),clearcoatNormalMapUv:Xe&&_(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&_(w.clearcoatRoughnessMap.channel),iridescenceMapUv:fe&&_(w.iridescenceMap.channel),iridescenceThicknessMapUv:Ee&&_(w.iridescenceThicknessMap.channel),sheenColorMapUv:Ae&&_(w.sheenColorMap.channel),sheenRoughnessMapUv:pe&&_(w.sheenRoughnessMap.channel),specularMapUv:Ge&&_(w.specularMap.channel),specularColorMapUv:Ue&&_(w.specularColorMap.channel),specularIntensityMapUv:it&&_(w.specularIntensityMap.channel),transmissionMapUv:P&&_(w.transmissionMap.channel),thicknessMapUv:ie&&_(w.thicknessMap.channel),alphaMapUv:Z&&_(w.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(He||g),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!K.attributes.uv&&(at||Z),fog:!!W,useFog:w.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Te,skinning:k.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:Be,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:lt,decodeVideoTexture:at&&w.map.isVideoTexture===!0&&ze.getTransfer(w.map.colorSpace)===Qe,decodeVideoTextureEmissive:nt&&w.emissiveMap.isVideoTexture===!0&&ze.getTransfer(w.emissiveMap.colorSpace)===Qe,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===yi,flipSided:w.side===Ut,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:De&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(De&&w.extensions.multiDraw===!0||ke)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Tt.vertexUv1s=c.has(1),Tt.vertexUv2s=c.has(2),Tt.vertexUv3s=c.has(3),c.clear(),Tt}function u(w){let x=[];if(w.shaderID?x.push(w.shaderID):(x.push(w.customVertexShaderID),x.push(w.customFragmentShaderID)),w.defines!==void 0)for(let R in w.defines)x.push(R),x.push(w.defines[R]);return w.isRawShaderMaterial===!1&&(E(x,w),S(x,w),x.push(i.outputColorSpace)),x.push(w.customProgramCacheKey),x.join()}function E(w,x){w.push(x.precision),w.push(x.outputColorSpace),w.push(x.envMapMode),w.push(x.envMapCubeUVHeight),w.push(x.mapUv),w.push(x.alphaMapUv),w.push(x.lightMapUv),w.push(x.aoMapUv),w.push(x.bumpMapUv),w.push(x.normalMapUv),w.push(x.displacementMapUv),w.push(x.emissiveMapUv),w.push(x.metalnessMapUv),w.push(x.roughnessMapUv),w.push(x.anisotropyMapUv),w.push(x.clearcoatMapUv),w.push(x.clearcoatNormalMapUv),w.push(x.clearcoatRoughnessMapUv),w.push(x.iridescenceMapUv),w.push(x.iridescenceThicknessMapUv),w.push(x.sheenColorMapUv),w.push(x.sheenRoughnessMapUv),w.push(x.specularMapUv),w.push(x.specularColorMapUv),w.push(x.specularIntensityMapUv),w.push(x.transmissionMapUv),w.push(x.thicknessMapUv),w.push(x.combine),w.push(x.fogExp2),w.push(x.sizeAttenuation),w.push(x.morphTargetsCount),w.push(x.morphAttributeCount),w.push(x.numDirLights),w.push(x.numPointLights),w.push(x.numSpotLights),w.push(x.numSpotLightMaps),w.push(x.numHemiLights),w.push(x.numRectAreaLights),w.push(x.numDirLightShadows),w.push(x.numPointLightShadows),w.push(x.numSpotLightShadows),w.push(x.numSpotLightShadowsWithMaps),w.push(x.numLightProbes),w.push(x.shadowMapType),w.push(x.toneMapping),w.push(x.numClippingPlanes),w.push(x.numClipIntersection),w.push(x.depthPacking)}function S(w,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),w.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reverseDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),w.push(a.mask)}function M(w){let x=v[w.type],R;if(x){let Y=bi[x];R=Fh.clone(Y.uniforms)}else R=w.uniforms;return R}function I(w,x){let R;for(let Y=0,k=h.length;Y<k;Y++){let W=h[Y];if(W.cacheKey===x){R=W,++R.usedTimes;break}}return R===void 0&&(R=new w_(i,x,w,r),h.push(R)),R}function A(w){if(--w.usedTimes===0){let x=h.indexOf(w);h[x]=h[h.length-1],h.pop(),w.destroy()}}function C(w){l.remove(w)}function N(){l.dispose()}return{getParameters:d,getProgramCacheKey:u,getUniforms:M,acquireProgram:I,releaseProgram:A,releaseShaderCache:C,programs:h,dispose:N}}function E_(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function T_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function ru(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ou(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(f,p,m,v,_,d){let u=i[e];return u===void 0?(u={id:f.id,object:f,geometry:p,material:m,groupOrder:v,renderOrder:f.renderOrder,z:_,group:d},i[e]=u):(u.id=f.id,u.object=f,u.geometry=p,u.material=m,u.groupOrder=v,u.renderOrder=f.renderOrder,u.z=_,u.group=d),e++,u}function a(f,p,m,v,_,d){let u=o(f,p,m,v,_,d);m.transmission>0?n.push(u):m.transparent===!0?s.push(u):t.push(u)}function l(f,p,m,v,_,d){let u=o(f,p,m,v,_,d);m.transmission>0?n.unshift(u):m.transparent===!0?s.unshift(u):t.unshift(u)}function c(f,p){t.length>1&&t.sort(f||T_),n.length>1&&n.sort(p||ru),s.length>1&&s.sort(p||ru)}function h(){for(let f=e,p=i.length;f<p;f++){let m=i[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function A_(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new ou,i.set(n,[o])):s>=r.length?(o=new ou,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function C_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new U,color:new qe};break;case"SpotLight":t={position:new U,direction:new U,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new U,halfWidth:new U,halfHeight:new U};break}return i[e.id]=t,t}}}function R_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var P_=0;function I_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function L_(i){let e=new C_,t=R_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new U);let s=new U,r=new tt,o=new tt;function a(c){let h=0,f=0,p=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let m=0,v=0,_=0,d=0,u=0,E=0,S=0,M=0,I=0,A=0,C=0;c.sort(I_);for(let w=0,x=c.length;w<x;w++){let R=c[w],Y=R.color,k=R.intensity,W=R.distance,K=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=Y.r*k,f+=Y.g*k,p+=Y.b*k;else if(R.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(R.sh.coefficients[H],k);C++}else if(R.isDirectionalLight){let H=e.get(R);if(H.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let Q=R.shadow,V=t.get(R);V.shadowIntensity=Q.intensity,V.shadowBias=Q.bias,V.shadowNormalBias=Q.normalBias,V.shadowRadius=Q.radius,V.shadowMapSize=Q.mapSize,n.directionalShadow[m]=V,n.directionalShadowMap[m]=K,n.directionalShadowMatrix[m]=R.shadow.matrix,E++}n.directional[m]=H,m++}else if(R.isSpotLight){let H=e.get(R);H.position.setFromMatrixPosition(R.matrixWorld),H.color.copy(Y).multiplyScalar(k),H.distance=W,H.coneCos=Math.cos(R.angle),H.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),H.decay=R.decay,n.spot[_]=H;let Q=R.shadow;if(R.map&&(n.spotLightMap[I]=R.map,I++,Q.updateMatrices(R),R.castShadow&&A++),n.spotLightMatrix[_]=Q.matrix,R.castShadow){let V=t.get(R);V.shadowIntensity=Q.intensity,V.shadowBias=Q.bias,V.shadowNormalBias=Q.normalBias,V.shadowRadius=Q.radius,V.shadowMapSize=Q.mapSize,n.spotShadow[_]=V,n.spotShadowMap[_]=K,M++}_++}else if(R.isRectAreaLight){let H=e.get(R);H.color.copy(Y).multiplyScalar(k),H.halfWidth.set(R.width*.5,0,0),H.halfHeight.set(0,R.height*.5,0),n.rectArea[d]=H,d++}else if(R.isPointLight){let H=e.get(R);if(H.color.copy(R.color).multiplyScalar(R.intensity),H.distance=R.distance,H.decay=R.decay,R.castShadow){let Q=R.shadow,V=t.get(R);V.shadowIntensity=Q.intensity,V.shadowBias=Q.bias,V.shadowNormalBias=Q.normalBias,V.shadowRadius=Q.radius,V.shadowMapSize=Q.mapSize,V.shadowCameraNear=Q.camera.near,V.shadowCameraFar=Q.camera.far,n.pointShadow[v]=V,n.pointShadowMap[v]=K,n.pointShadowMatrix[v]=R.shadow.matrix,S++}n.point[v]=H,v++}else if(R.isHemisphereLight){let H=e.get(R);H.skyColor.copy(R.color).multiplyScalar(k),H.groundColor.copy(R.groundColor).multiplyScalar(k),n.hemi[u]=H,u++}}d>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=te.LTC_FLOAT_1,n.rectAreaLTC2=te.LTC_FLOAT_2):(n.rectAreaLTC1=te.LTC_HALF_1,n.rectAreaLTC2=te.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=p;let N=n.hash;(N.directionalLength!==m||N.pointLength!==v||N.spotLength!==_||N.rectAreaLength!==d||N.hemiLength!==u||N.numDirectionalShadows!==E||N.numPointShadows!==S||N.numSpotShadows!==M||N.numSpotMaps!==I||N.numLightProbes!==C)&&(n.directional.length=m,n.spot.length=_,n.rectArea.length=d,n.point.length=v,n.hemi.length=u,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=M+I-A,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=C,N.directionalLength=m,N.pointLength=v,N.spotLength=_,N.rectAreaLength=d,N.hemiLength=u,N.numDirectionalShadows=E,N.numPointShadows=S,N.numSpotShadows=M,N.numSpotMaps=I,N.numLightProbes=C,n.version=P_++)}function l(c,h){let f=0,p=0,m=0,v=0,_=0,d=h.matrixWorldInverse;for(let u=0,E=c.length;u<E;u++){let S=c[u];if(S.isDirectionalLight){let M=n.directional[f];M.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(d),f++}else if(S.isSpotLight){let M=n.spot[m];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(d),M.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(d),m++}else if(S.isRectAreaLight){let M=n.rectArea[v];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(d),o.identity(),r.copy(S.matrixWorld),r.premultiply(d),o.extractRotation(r),M.halfWidth.set(S.width*.5,0,0),M.halfHeight.set(0,S.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),v++}else if(S.isPointLight){let M=n.point[p];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(d),p++}else if(S.isHemisphereLight){let M=n.hemi[_];M.direction.setFromMatrixPosition(S.matrixWorld),M.direction.transformDirection(d),_++}}}return{setup:a,setupView:l,state:n}}function au(i){let e=new L_(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function D_(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new au(i),e.set(s,[a])):r>=o.length?(a=new au(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var U_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,N_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function O_(i,e,t){let n=new wn,s=new Oe,r=new Oe,o=new ht,a=new Jr({depthPacking:wh}),l=new jr,c={},h=t.maxTextureSize,f={[Ui]:Ut,[Ut]:Ui,[yi]:yi},p=new Yt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:U_,fragmentShader:N_}),m=p.clone();m.defines.HORIZONTAL_PASS=1;let v=new Fi;v.setAttribute("position",new Gt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new pt(v,p),d=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=nl;let u=this.type;this.render=function(A,C,N){if(d.enabled===!1||d.autoUpdate===!1&&d.needsUpdate===!1||A.length===0)return;let w=i.getRenderTarget(),x=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),Y=i.state;Y.setBlending(ki),Y.buffers.color.setClear(1,1,1,1),Y.buffers.depth.setTest(!0),Y.setScissorTest(!1);let k=u!==_i&&this.type===_i,W=u===_i&&this.type!==_i;for(let K=0,H=A.length;K<H;K++){let Q=A[K],V=Q.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);let se=V.getFrameExtents();if(s.multiply(se),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/se.x),s.x=r.x*se.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/se.y),s.y=r.y*se.y,V.mapSize.y=r.y)),V.map===null||k===!0||W===!0){let xe=this.type!==_i?{minFilter:jt,magFilter:jt}:{};V.map!==null&&V.map.dispose(),V.map=new Qt(s.x,s.y,xe),V.map.texture.name=Q.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();let ue=V.getViewportCount();for(let xe=0;xe<ue;xe++){let Be=V.getViewport(xe);o.set(r.x*Be.x,r.y*Be.y,r.x*Be.z,r.y*Be.w),Y.viewport(o),V.updateMatrices(Q,xe),n=V.getFrustum(),M(C,N,V.camera,Q,this.type)}V.isPointLightShadow!==!0&&this.type===_i&&E(V,N),V.needsUpdate=!1}u=this.type,d.needsUpdate=!1,i.setRenderTarget(w,x,R)};function E(A,C){let N=e.update(_);p.defines.VSM_SAMPLES!==A.blurSamples&&(p.defines.VSM_SAMPLES=A.blurSamples,m.defines.VSM_SAMPLES=A.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Qt(s.x,s.y)),p.uniforms.shadow_pass.value=A.map.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(C,null,N,p,_,null),m.uniforms.shadow_pass.value=A.mapPass.texture,m.uniforms.resolution.value=A.mapSize,m.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(C,null,N,m,_,null)}function S(A,C,N,w){let x=null,R=N.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(R!==void 0)x=R;else if(x=N.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){let Y=x.uuid,k=C.uuid,W=c[Y];W===void 0&&(W={},c[Y]=W);let K=W[k];K===void 0&&(K=x.clone(),W[k]=K,C.addEventListener("dispose",I)),x=K}if(x.visible=C.visible,x.wireframe=C.wireframe,w===_i?x.side=C.shadowSide!==null?C.shadowSide:C.side:x.side=C.shadowSide!==null?C.shadowSide:f[C.side],x.alphaMap=C.alphaMap,x.alphaTest=C.alphaTest,x.map=C.map,x.clipShadows=C.clipShadows,x.clippingPlanes=C.clippingPlanes,x.clipIntersection=C.clipIntersection,x.displacementMap=C.displacementMap,x.displacementScale=C.displacementScale,x.displacementBias=C.displacementBias,x.wireframeLinewidth=C.wireframeLinewidth,x.linewidth=C.linewidth,N.isPointLight===!0&&x.isMeshDistanceMaterial===!0){let Y=i.properties.get(x);Y.light=N}return x}function M(A,C,N,w,x){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&x===_i)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,A.matrixWorld);let k=e.update(A),W=A.material;if(Array.isArray(W)){let K=k.groups;for(let H=0,Q=K.length;H<Q;H++){let V=K[H],se=W[V.materialIndex];if(se&&se.visible){let ue=S(A,se,w,x);A.onBeforeShadow(i,A,C,N,k,ue,V),i.renderBufferDirect(N,null,k,ue,A,V),A.onAfterShadow(i,A,C,N,k,ue,V)}}}else if(W.visible){let K=S(A,W,w,x);A.onBeforeShadow(i,A,C,N,k,K,null),i.renderBufferDirect(N,null,k,K,A,null),A.onAfterShadow(i,A,C,N,k,K,null)}}let Y=A.children;for(let k=0,W=Y.length;k<W;k++)M(Y[k],C,N,w,x)}function I(A){A.target.removeEventListener("dispose",I);for(let N in c){let w=c[N],x=A.target.uuid;x in w&&(w[x].dispose(),delete w[x])}}}var F_={[co]:ho,[uo]:mo,[fo]:go,[yn]:po,[ho]:co,[mo]:uo,[go]:fo,[po]:yn};function B_(i,e){function t(){let P=!1,ie=new ht,z=null,Z=new ht(0,0,0,0);return{setMask:function(le){z!==le&&!P&&(i.colorMask(le,le,le,le),z=le)},setLocked:function(le){P=le},setClear:function(le,ae,De,lt,Tt){Tt===!0&&(le*=lt,ae*=lt,De*=lt),ie.set(le,ae,De,lt),Z.equals(ie)===!1&&(i.clearColor(le,ae,De,lt),Z.copy(ie))},reset:function(){P=!1,z=null,Z.set(-1,0,0,0)}}}function n(){let P=!1,ie=!1,z=null,Z=null,le=null;return{setReversed:function(ae){if(ie!==ae){let De=e.get("EXT_clip_control");ie?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT);let lt=le;le=null,this.setClear(lt)}ie=ae},getReversed:function(){return ie},setTest:function(ae){ae?re(i.DEPTH_TEST):Te(i.DEPTH_TEST)},setMask:function(ae){z!==ae&&!P&&(i.depthMask(ae),z=ae)},setFunc:function(ae){if(ie&&(ae=F_[ae]),Z!==ae){switch(ae){case co:i.depthFunc(i.NEVER);break;case ho:i.depthFunc(i.ALWAYS);break;case uo:i.depthFunc(i.LESS);break;case yn:i.depthFunc(i.LEQUAL);break;case fo:i.depthFunc(i.EQUAL);break;case po:i.depthFunc(i.GEQUAL);break;case mo:i.depthFunc(i.GREATER);break;case go:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Z=ae}},setLocked:function(ae){P=ae},setClear:function(ae){le!==ae&&(ie&&(ae=1-ae),i.clearDepth(ae),le=ae)},reset:function(){P=!1,z=null,Z=null,le=null,ie=!1}}}function s(){let P=!1,ie=null,z=null,Z=null,le=null,ae=null,De=null,lt=null,Tt=null;return{setTest:function(je){P||(je?re(i.STENCIL_TEST):Te(i.STENCIL_TEST))},setMask:function(je){ie!==je&&!P&&(i.stencilMask(je),ie=je)},setFunc:function(je,ai,Ai){(z!==je||Z!==ai||le!==Ai)&&(i.stencilFunc(je,ai,Ai),z=je,Z=ai,le=Ai)},setOp:function(je,ai,Ai){(ae!==je||De!==ai||lt!==Ai)&&(i.stencilOp(je,ai,Ai),ae=je,De=ai,lt=Ai)},setLocked:function(je){P=je},setClear:function(je){Tt!==je&&(i.clearStencil(je),Tt=je)},reset:function(){P=!1,ie=null,z=null,Z=null,le=null,ae=null,De=null,lt=null,Tt=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},f={},p=new WeakMap,m=[],v=null,_=!1,d=null,u=null,E=null,S=null,M=null,I=null,A=null,C=new qe(0,0,0),N=0,w=!1,x=null,R=null,Y=null,k=null,W=null,K=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,Q=0,V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(V)[1]),H=Q>=1):V.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),H=Q>=2);let se=null,ue={},xe=i.getParameter(i.SCISSOR_BOX),Be=i.getParameter(i.VIEWPORT),et=new ht().fromArray(xe),X=new ht().fromArray(Be);function ee(P,ie,z,Z){let le=new Uint8Array(4),ae=i.createTexture();i.bindTexture(P,ae),i.texParameteri(P,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(P,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let De=0;De<z;De++)P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY?i.texImage3D(ie,0,i.RGBA,1,1,Z,0,i.RGBA,i.UNSIGNED_BYTE,le):i.texImage2D(ie+De,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,le);return ae}let ve={};ve[i.TEXTURE_2D]=ee(i.TEXTURE_2D,i.TEXTURE_2D,1),ve[i.TEXTURE_CUBE_MAP]=ee(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ve[i.TEXTURE_2D_ARRAY]=ee(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ve[i.TEXTURE_3D]=ee(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),re(i.DEPTH_TEST),o.setFunc(yn),Ve(!1),He(il),re(i.CULL_FACE),T(ki);function re(P){h[P]!==!0&&(i.enable(P),h[P]=!0)}function Te(P){h[P]!==!1&&(i.disable(P),h[P]=!1)}function Ie(P,ie){return f[P]!==ie?(i.bindFramebuffer(P,ie),f[P]=ie,P===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=ie),P===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=ie),!0):!1}function ke(P,ie){let z=m,Z=!1;if(P){z=p.get(ie),z===void 0&&(z=[],p.set(ie,z));let le=P.textures;if(z.length!==le.length||z[0]!==i.COLOR_ATTACHMENT0){for(let ae=0,De=le.length;ae<De;ae++)z[ae]=i.COLOR_ATTACHMENT0+ae;z.length=le.length,Z=!0}}else z[0]!==i.BACK&&(z[0]=i.BACK,Z=!0);Z&&i.drawBuffers(z)}function at(P){return v!==P?(i.useProgram(P),v=P,!0):!1}let We={[ji]:i.FUNC_ADD,[$c]:i.FUNC_SUBTRACT,[Kc]:i.FUNC_REVERSE_SUBTRACT};We[Jc]=i.MIN,We[jc]=i.MAX;let ut={[Qc]:i.ZERO,[eh]:i.ONE,[th]:i.SRC_COLOR,[zr]:i.SRC_ALPHA,[ah]:i.SRC_ALPHA_SATURATE,[rh]:i.DST_COLOR,[nh]:i.DST_ALPHA,[ih]:i.ONE_MINUS_SRC_COLOR,[Vr]:i.ONE_MINUS_SRC_ALPHA,[oh]:i.ONE_MINUS_DST_COLOR,[sh]:i.ONE_MINUS_DST_ALPHA,[lh]:i.CONSTANT_COLOR,[ch]:i.ONE_MINUS_CONSTANT_COLOR,[hh]:i.CONSTANT_ALPHA,[uh]:i.ONE_MINUS_CONSTANT_ALPHA};function T(P,ie,z,Z,le,ae,De,lt,Tt,je){if(P===ki){_===!0&&(Te(i.BLEND),_=!1);return}if(_===!1&&(re(i.BLEND),_=!0),P!==Zc){if(P!==d||je!==w){if((u!==ji||M!==ji)&&(i.blendEquation(i.FUNC_ADD),u=ji,M=ji),je)switch(P){case _n:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case sl:i.blendFunc(i.ONE,i.ONE);break;case rl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ol:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}else switch(P){case _n:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case sl:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case rl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ol:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}E=null,S=null,I=null,A=null,C.set(0,0,0),N=0,d=P,w=je}return}le=le||ie,ae=ae||z,De=De||Z,(ie!==u||le!==M)&&(i.blendEquationSeparate(We[ie],We[le]),u=ie,M=le),(z!==E||Z!==S||ae!==I||De!==A)&&(i.blendFuncSeparate(ut[z],ut[Z],ut[ae],ut[De]),E=z,S=Z,I=ae,A=De),(lt.equals(C)===!1||Tt!==N)&&(i.blendColor(lt.r,lt.g,lt.b,Tt),C.copy(lt),N=Tt),d=P,w=!1}function Zt(P,ie){P.side===yi?Te(i.CULL_FACE):re(i.CULL_FACE);let z=P.side===Ut;ie&&(z=!z),Ve(z),P.blending===_n&&P.transparent===!1?T(ki):T(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),o.setFunc(P.depthFunc),o.setTest(P.depthTest),o.setMask(P.depthWrite),r.setMask(P.colorWrite);let Z=P.stencilWrite;a.setTest(Z),Z&&(a.setMask(P.stencilWriteMask),a.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),a.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),nt(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?re(i.SAMPLE_ALPHA_TO_COVERAGE):Te(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ve(P){x!==P&&(P?i.frontFace(i.CW):i.frontFace(i.CCW),x=P)}function He(P){P!==Xc?(re(i.CULL_FACE),P!==R&&(P===il?i.cullFace(i.BACK):P===Yc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Te(i.CULL_FACE),R=P}function Me(P){P!==Y&&(H&&i.lineWidth(P),Y=P)}function nt(P,ie,z){P?(re(i.POLYGON_OFFSET_FILL),(k!==ie||W!==z)&&(i.polygonOffset(ie,z),k=ie,W=z)):Te(i.POLYGON_OFFSET_FILL)}function we(P){P?re(i.SCISSOR_TEST):Te(i.SCISSOR_TEST)}function b(P){P===void 0&&(P=i.TEXTURE0+K-1),se!==P&&(i.activeTexture(P),se=P)}function g(P,ie,z){z===void 0&&(se===null?z=i.TEXTURE0+K-1:z=se);let Z=ue[z];Z===void 0&&(Z={type:void 0,texture:void 0},ue[z]=Z),(Z.type!==P||Z.texture!==ie)&&(se!==z&&(i.activeTexture(z),se=z),i.bindTexture(P,ie||ve[P]),Z.type=P,Z.texture=ie)}function O(){let P=ue[se];P!==void 0&&P.type!==void 0&&(i.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function q(){try{i.compressedTexImage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function $(){try{i.compressedTexImage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function G(){try{i.texSubImage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function _e(){try{i.texSubImage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function oe(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function de(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Xe(){try{i.texStorage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function j(){try{i.texStorage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function fe(){try{i.texImage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Ee(){try{i.texImage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Ae(P){et.equals(P)===!1&&(i.scissor(P.x,P.y,P.z,P.w),et.copy(P))}function pe(P){X.equals(P)===!1&&(i.viewport(P.x,P.y,P.z,P.w),X.copy(P))}function Ge(P,ie){let z=c.get(ie);z===void 0&&(z=new WeakMap,c.set(ie,z));let Z=z.get(P);Z===void 0&&(Z=i.getUniformBlockIndex(ie,P.name),z.set(P,Z))}function Ue(P,ie){let Z=c.get(ie).get(P);l.get(ie)!==Z&&(i.uniformBlockBinding(ie,Z,P.__bindingPointIndex),l.set(ie,Z))}function it(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},se=null,ue={},f={},p=new WeakMap,m=[],v=null,_=!1,d=null,u=null,E=null,S=null,M=null,I=null,A=null,C=new qe(0,0,0),N=0,w=!1,x=null,R=null,Y=null,k=null,W=null,et.set(0,0,i.canvas.width,i.canvas.height),X.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:re,disable:Te,bindFramebuffer:Ie,drawBuffers:ke,useProgram:at,setBlending:T,setMaterial:Zt,setFlipSided:Ve,setCullFace:He,setLineWidth:Me,setPolygonOffset:nt,setScissorTest:we,activeTexture:b,bindTexture:g,unbindTexture:O,compressedTexImage2D:q,compressedTexImage3D:$,texImage2D:fe,texImage3D:Ee,updateUBOMapping:Ge,uniformBlockBinding:Ue,texStorage2D:Xe,texStorage3D:j,texSubImage2D:G,texSubImage3D:_e,compressedTexSubImage2D:oe,compressedTexSubImage3D:de,scissor:Ae,viewport:pe,reset:it}}function k_(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Oe,h=new WeakMap,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(b,g){return m?new OffscreenCanvas(b,g):Ts("canvas")}function _(b,g,O){let q=1,$=we(b);if(($.width>O||$.height>O)&&(q=O/Math.max($.width,$.height)),q<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){let G=Math.floor(q*$.width),_e=Math.floor(q*$.height);f===void 0&&(f=v(G,_e));let oe=g?v(G,_e):f;return oe.width=G,oe.height=_e,oe.getContext("2d").drawImage(b,0,0,G,_e),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+G+"x"+_e+")."),oe}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),b;return b}function d(b){return b.generateMipmaps}function u(b){i.generateMipmap(b)}function E(b){return b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:b.isWebGL3DRenderTarget?i.TEXTURE_3D:b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(b,g,O,q,$=!1){if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let G=g;if(g===i.RED&&(O===i.FLOAT&&(G=i.R32F),O===i.HALF_FLOAT&&(G=i.R16F),O===i.UNSIGNED_BYTE&&(G=i.R8)),g===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.R8UI),O===i.UNSIGNED_SHORT&&(G=i.R16UI),O===i.UNSIGNED_INT&&(G=i.R32UI),O===i.BYTE&&(G=i.R8I),O===i.SHORT&&(G=i.R16I),O===i.INT&&(G=i.R32I)),g===i.RG&&(O===i.FLOAT&&(G=i.RG32F),O===i.HALF_FLOAT&&(G=i.RG16F),O===i.UNSIGNED_BYTE&&(G=i.RG8)),g===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RG8UI),O===i.UNSIGNED_SHORT&&(G=i.RG16UI),O===i.UNSIGNED_INT&&(G=i.RG32UI),O===i.BYTE&&(G=i.RG8I),O===i.SHORT&&(G=i.RG16I),O===i.INT&&(G=i.RG32I)),g===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RGB8UI),O===i.UNSIGNED_SHORT&&(G=i.RGB16UI),O===i.UNSIGNED_INT&&(G=i.RGB32UI),O===i.BYTE&&(G=i.RGB8I),O===i.SHORT&&(G=i.RGB16I),O===i.INT&&(G=i.RGB32I)),g===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(G=i.RGBA16UI),O===i.UNSIGNED_INT&&(G=i.RGBA32UI),O===i.BYTE&&(G=i.RGBA8I),O===i.SHORT&&(G=i.RGBA16I),O===i.INT&&(G=i.RGBA32I)),g===i.RGB&&O===i.UNSIGNED_INT_5_9_9_9_REV&&(G=i.RGB9_E5),g===i.RGBA){let _e=$?Ss:ze.getTransfer(q);O===i.FLOAT&&(G=i.RGBA32F),O===i.HALF_FLOAT&&(G=i.RGBA16F),O===i.UNSIGNED_BYTE&&(G=_e===Qe?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(G=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(G=i.RGB5_A1)}return(G===i.R16F||G===i.R32F||G===i.RG16F||G===i.RG32F||G===i.RGBA16F||G===i.RGBA32F)&&e.get("EXT_color_buffer_float"),G}function M(b,g){let O;return b?g===null||g===sn||g===An?O=i.DEPTH24_STENCIL8:g===wi?O=i.DEPTH32F_STENCIL8:g===ts&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===sn||g===An?O=i.DEPTH_COMPONENT24:g===wi?O=i.DEPTH_COMPONENT32F:g===ts&&(O=i.DEPTH_COMPONENT16),O}function I(b,g){return d(b)===!0||b.isFramebufferTexture&&b.minFilter!==jt&&b.minFilter!==Dt?Math.log2(Math.max(g.width,g.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?g.mipmaps.length:1}function A(b){let g=b.target;g.removeEventListener("dispose",A),N(g),g.isVideoTexture&&h.delete(g)}function C(b){let g=b.target;g.removeEventListener("dispose",C),x(g)}function N(b){let g=n.get(b);if(g.__webglInit===void 0)return;let O=b.source,q=p.get(O);if(q){let $=q[g.__cacheKey];$.usedTimes--,$.usedTimes===0&&w(b),Object.keys(q).length===0&&p.delete(O)}n.remove(b)}function w(b){let g=n.get(b);i.deleteTexture(g.__webglTexture);let O=b.source,q=p.get(O);delete q[g.__cacheKey],o.memory.textures--}function x(b){let g=n.get(b);if(b.depthTexture&&(b.depthTexture.dispose(),n.remove(b.depthTexture)),b.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(g.__webglFramebuffer[q]))for(let $=0;$<g.__webglFramebuffer[q].length;$++)i.deleteFramebuffer(g.__webglFramebuffer[q][$]);else i.deleteFramebuffer(g.__webglFramebuffer[q]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[q])}else{if(Array.isArray(g.__webglFramebuffer))for(let q=0;q<g.__webglFramebuffer.length;q++)i.deleteFramebuffer(g.__webglFramebuffer[q]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let q=0;q<g.__webglColorRenderbuffer.length;q++)g.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[q]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}let O=b.textures;for(let q=0,$=O.length;q<$;q++){let G=n.get(O[q]);G.__webglTexture&&(i.deleteTexture(G.__webglTexture),o.memory.textures--),n.remove(O[q])}n.remove(b)}let R=0;function Y(){R=0}function k(){let b=R;return b>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+s.maxTextures),R+=1,b}function W(b){let g=[];return g.push(b.wrapS),g.push(b.wrapT),g.push(b.wrapR||0),g.push(b.magFilter),g.push(b.minFilter),g.push(b.anisotropy),g.push(b.internalFormat),g.push(b.format),g.push(b.type),g.push(b.generateMipmaps),g.push(b.premultiplyAlpha),g.push(b.flipY),g.push(b.unpackAlignment),g.push(b.colorSpace),g.join()}function K(b,g){let O=n.get(b);if(b.isVideoTexture&&Me(b),b.isRenderTargetTexture===!1&&b.version>0&&O.__version!==b.version){let q=b.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{X(O,b,g);return}}t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+g)}function H(b,g){let O=n.get(b);if(b.version>0&&O.__version!==b.version){X(O,b,g);return}t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+g)}function Q(b,g){let O=n.get(b);if(b.version>0&&O.__version!==b.version){X(O,b,g);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+g)}function V(b,g){let O=n.get(b);if(b.version>0&&O.__version!==b.version){ee(O,b,g);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+g)}let se={[Hr]:i.REPEAT,[Ji]:i.CLAMP_TO_EDGE,[Gr]:i.MIRRORED_REPEAT},ue={[jt]:i.NEAREST,[xh]:i.NEAREST_MIPMAP_NEAREST,[zs]:i.NEAREST_MIPMAP_LINEAR,[Dt]:i.LINEAR,[xo]:i.LINEAR_MIPMAP_NEAREST,[xi]:i.LINEAR_MIPMAP_LINEAR},xe={[Eh]:i.NEVER,[Ih]:i.ALWAYS,[Th]:i.LESS,[yl]:i.LEQUAL,[Ah]:i.EQUAL,[Ph]:i.GEQUAL,[Ch]:i.GREATER,[Rh]:i.NOTEQUAL};function Be(b,g){if(g.type===wi&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===Dt||g.magFilter===xo||g.magFilter===zs||g.magFilter===xi||g.minFilter===Dt||g.minFilter===xo||g.minFilter===zs||g.minFilter===xi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(b,i.TEXTURE_WRAP_S,se[g.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,se[g.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,se[g.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,ue[g.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,ue[g.minFilter]),g.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,xe[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===jt||g.minFilter!==zs&&g.minFilter!==xi||g.type===wi&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(b,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function et(b,g){let O=!1;b.__webglInit===void 0&&(b.__webglInit=!0,g.addEventListener("dispose",A));let q=g.source,$=p.get(q);$===void 0&&($={},p.set(q,$));let G=W(g);if(G!==b.__cacheKey){$[G]===void 0&&($[G]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,O=!0),$[G].usedTimes++;let _e=$[b.__cacheKey];_e!==void 0&&($[b.__cacheKey].usedTimes--,_e.usedTimes===0&&w(g)),b.__cacheKey=G,b.__webglTexture=$[G].texture}return O}function X(b,g,O){let q=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(q=i.TEXTURE_3D);let $=et(b,g),G=g.source;t.bindTexture(q,b.__webglTexture,i.TEXTURE0+O);let _e=n.get(G);if(G.version!==_e.__version||$===!0){t.activeTexture(i.TEXTURE0+O);let oe=ze.getPrimaries(ze.workingColorSpace),de=g.colorSpace===Vi?null:ze.getPrimaries(g.colorSpace),Xe=g.colorSpace===Vi||oe===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xe);let j=_(g.image,!1,s.maxTextureSize);j=nt(g,j);let fe=r.convert(g.format,g.colorSpace),Ee=r.convert(g.type),Ae=S(g.internalFormat,fe,Ee,g.colorSpace,g.isVideoTexture);Be(q,g);let pe,Ge=g.mipmaps,Ue=g.isVideoTexture!==!0,it=_e.__version===void 0||$===!0,P=G.dataReady,ie=I(g,j);if(g.isDepthTexture)Ae=M(g.format===xn,g.type),it&&(Ue?t.texStorage2D(i.TEXTURE_2D,1,Ae,j.width,j.height):t.texImage2D(i.TEXTURE_2D,0,Ae,j.width,j.height,0,fe,Ee,null));else if(g.isDataTexture)if(Ge.length>0){Ue&&it&&t.texStorage2D(i.TEXTURE_2D,ie,Ae,Ge[0].width,Ge[0].height);for(let z=0,Z=Ge.length;z<Z;z++)pe=Ge[z],Ue?P&&t.texSubImage2D(i.TEXTURE_2D,z,0,0,pe.width,pe.height,fe,Ee,pe.data):t.texImage2D(i.TEXTURE_2D,z,Ae,pe.width,pe.height,0,fe,Ee,pe.data);g.generateMipmaps=!1}else Ue?(it&&t.texStorage2D(i.TEXTURE_2D,ie,Ae,j.width,j.height),P&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,j.width,j.height,fe,Ee,j.data)):t.texImage2D(i.TEXTURE_2D,0,Ae,j.width,j.height,0,fe,Ee,j.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){Ue&&it&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ie,Ae,Ge[0].width,Ge[0].height,j.depth);for(let z=0,Z=Ge.length;z<Z;z++)if(pe=Ge[z],g.format!==ni)if(fe!==null)if(Ue){if(P)if(g.layerUpdates.size>0){let le=Tl(pe.width,pe.height,g.format,g.type);for(let ae of g.layerUpdates){let De=pe.data.subarray(ae*le/pe.data.BYTES_PER_ELEMENT,(ae+1)*le/pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,z,0,0,ae,pe.width,pe.height,1,fe,De)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,z,0,0,0,pe.width,pe.height,j.depth,fe,pe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,z,Ae,pe.width,pe.height,j.depth,0,pe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ue?P&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,z,0,0,0,pe.width,pe.height,j.depth,fe,Ee,pe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,z,Ae,pe.width,pe.height,j.depth,0,fe,Ee,pe.data)}else{Ue&&it&&t.texStorage2D(i.TEXTURE_2D,ie,Ae,Ge[0].width,Ge[0].height);for(let z=0,Z=Ge.length;z<Z;z++)pe=Ge[z],g.format!==ni?fe!==null?Ue?P&&t.compressedTexSubImage2D(i.TEXTURE_2D,z,0,0,pe.width,pe.height,fe,pe.data):t.compressedTexImage2D(i.TEXTURE_2D,z,Ae,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ue?P&&t.texSubImage2D(i.TEXTURE_2D,z,0,0,pe.width,pe.height,fe,Ee,pe.data):t.texImage2D(i.TEXTURE_2D,z,Ae,pe.width,pe.height,0,fe,Ee,pe.data)}else if(g.isDataArrayTexture)if(Ue){if(it&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ie,Ae,j.width,j.height,j.depth),P)if(g.layerUpdates.size>0){let z=Tl(j.width,j.height,g.format,g.type);for(let Z of g.layerUpdates){let le=j.data.subarray(Z*z/j.data.BYTES_PER_ELEMENT,(Z+1)*z/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Z,j.width,j.height,1,fe,Ee,le)}g.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,fe,Ee,j.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ae,j.width,j.height,j.depth,0,fe,Ee,j.data);else if(g.isData3DTexture)Ue?(it&&t.texStorage3D(i.TEXTURE_3D,ie,Ae,j.width,j.height,j.depth),P&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,fe,Ee,j.data)):t.texImage3D(i.TEXTURE_3D,0,Ae,j.width,j.height,j.depth,0,fe,Ee,j.data);else if(g.isFramebufferTexture){if(it)if(Ue)t.texStorage2D(i.TEXTURE_2D,ie,Ae,j.width,j.height);else{let z=j.width,Z=j.height;for(let le=0;le<ie;le++)t.texImage2D(i.TEXTURE_2D,le,Ae,z,Z,0,fe,Ee,null),z>>=1,Z>>=1}}else if(Ge.length>0){if(Ue&&it){let z=we(Ge[0]);t.texStorage2D(i.TEXTURE_2D,ie,Ae,z.width,z.height)}for(let z=0,Z=Ge.length;z<Z;z++)pe=Ge[z],Ue?P&&t.texSubImage2D(i.TEXTURE_2D,z,0,0,fe,Ee,pe):t.texImage2D(i.TEXTURE_2D,z,Ae,fe,Ee,pe);g.generateMipmaps=!1}else if(Ue){if(it){let z=we(j);t.texStorage2D(i.TEXTURE_2D,ie,Ae,z.width,z.height)}P&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,fe,Ee,j)}else t.texImage2D(i.TEXTURE_2D,0,Ae,fe,Ee,j);d(g)&&u(q),_e.__version=G.version,g.onUpdate&&g.onUpdate(g)}b.__version=g.version}function ee(b,g,O){if(g.image.length!==6)return;let q=et(b,g),$=g.source;t.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+O);let G=n.get($);if($.version!==G.__version||q===!0){t.activeTexture(i.TEXTURE0+O);let _e=ze.getPrimaries(ze.workingColorSpace),oe=g.colorSpace===Vi?null:ze.getPrimaries(g.colorSpace),de=g.colorSpace===Vi||_e===oe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,de);let Xe=g.isCompressedTexture||g.image[0].isCompressedTexture,j=g.image[0]&&g.image[0].isDataTexture,fe=[];for(let Z=0;Z<6;Z++)!Xe&&!j?fe[Z]=_(g.image[Z],!0,s.maxCubemapSize):fe[Z]=j?g.image[Z].image:g.image[Z],fe[Z]=nt(g,fe[Z]);let Ee=fe[0],Ae=r.convert(g.format,g.colorSpace),pe=r.convert(g.type),Ge=S(g.internalFormat,Ae,pe,g.colorSpace),Ue=g.isVideoTexture!==!0,it=G.__version===void 0||q===!0,P=$.dataReady,ie=I(g,Ee);Be(i.TEXTURE_CUBE_MAP,g);let z;if(Xe){Ue&&it&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ie,Ge,Ee.width,Ee.height);for(let Z=0;Z<6;Z++){z=fe[Z].mipmaps;for(let le=0;le<z.length;le++){let ae=z[le];g.format!==ni?Ae!==null?Ue?P&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le,0,0,ae.width,ae.height,Ae,ae.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le,Ge,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?P&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le,0,0,ae.width,ae.height,Ae,pe,ae.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le,Ge,ae.width,ae.height,0,Ae,pe,ae.data)}}}else{if(z=g.mipmaps,Ue&&it){z.length>0&&ie++;let Z=we(fe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ie,Ge,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(j){Ue?P&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,fe[Z].width,fe[Z].height,Ae,pe,fe[Z].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Ge,fe[Z].width,fe[Z].height,0,Ae,pe,fe[Z].data);for(let le=0;le<z.length;le++){let De=z[le].image[Z].image;Ue?P&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le+1,0,0,De.width,De.height,Ae,pe,De.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le+1,Ge,De.width,De.height,0,Ae,pe,De.data)}}else{Ue?P&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Ae,pe,fe[Z]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Ge,Ae,pe,fe[Z]);for(let le=0;le<z.length;le++){let ae=z[le];Ue?P&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le+1,0,0,Ae,pe,ae.image[Z]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,le+1,Ge,Ae,pe,ae.image[Z])}}}d(g)&&u(i.TEXTURE_CUBE_MAP),G.__version=$.version,g.onUpdate&&g.onUpdate(g)}b.__version=g.version}function ve(b,g,O,q,$,G){let _e=r.convert(O.format,O.colorSpace),oe=r.convert(O.type),de=S(O.internalFormat,_e,oe,O.colorSpace),Xe=n.get(g),j=n.get(O);if(j.__renderTarget=g,!Xe.__hasExternalTextures){let fe=Math.max(1,g.width>>G),Ee=Math.max(1,g.height>>G);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?t.texImage3D($,G,de,fe,Ee,g.depth,0,_e,oe,null):t.texImage2D($,G,de,fe,Ee,0,_e,oe,null)}t.bindFramebuffer(i.FRAMEBUFFER,b),He(g)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,$,j.__webglTexture,0,Ve(g)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,$,j.__webglTexture,G),t.bindFramebuffer(i.FRAMEBUFFER,null)}function re(b,g,O){if(i.bindRenderbuffer(i.RENDERBUFFER,b),g.depthBuffer){let q=g.depthTexture,$=q&&q.isDepthTexture?q.type:null,G=M(g.stencilBuffer,$),_e=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=Ve(g);He(g)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,oe,G,g.width,g.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,oe,G,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,G,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,_e,i.RENDERBUFFER,b)}else{let q=g.textures;for(let $=0;$<q.length;$++){let G=q[$],_e=r.convert(G.format,G.colorSpace),oe=r.convert(G.type),de=S(G.internalFormat,_e,oe,G.colorSpace),Xe=Ve(g);O&&He(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Xe,de,g.width,g.height):He(g)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Xe,de,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,de,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Te(b,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,b),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let q=n.get(g.depthTexture);q.__renderTarget=g,(!q.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),K(g.depthTexture,0);let $=q.__webglTexture,G=Ve(g);if(g.depthTexture.format===vn)He(g)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0,G):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0);else if(g.depthTexture.format===xn)He(g)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0,G):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function Ie(b){let g=n.get(b),O=b.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==b.depthTexture){let q=b.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),q){let $=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,q.removeEventListener("dispose",$)};q.addEventListener("dispose",$),g.__depthDisposeCallback=$}g.__boundDepthTexture=q}if(b.depthTexture&&!g.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");Te(g.__webglFramebuffer,b)}else if(O){g.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[q]),g.__webglDepthbuffer[q]===void 0)g.__webglDepthbuffer[q]=i.createRenderbuffer(),re(g.__webglDepthbuffer[q],b,!1);else{let $=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,G=g.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,G),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,G)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),re(g.__webglDepthbuffer,b,!1);else{let q=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,$)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ke(b,g,O){let q=n.get(b);g!==void 0&&ve(q.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Ie(b)}function at(b){let g=b.texture,O=n.get(b),q=n.get(g);b.addEventListener("dispose",C);let $=b.textures,G=b.isWebGLCubeRenderTarget===!0,_e=$.length>1;if(_e||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=g.version,o.memory.textures++),G){O.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(g.mipmaps&&g.mipmaps.length>0){O.__webglFramebuffer[oe]=[];for(let de=0;de<g.mipmaps.length;de++)O.__webglFramebuffer[oe][de]=i.createFramebuffer()}else O.__webglFramebuffer[oe]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){O.__webglFramebuffer=[];for(let oe=0;oe<g.mipmaps.length;oe++)O.__webglFramebuffer[oe]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(_e)for(let oe=0,de=$.length;oe<de;oe++){let Xe=n.get($[oe]);Xe.__webglTexture===void 0&&(Xe.__webglTexture=i.createTexture(),o.memory.textures++)}if(b.samples>0&&He(b)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let oe=0;oe<$.length;oe++){let de=$[oe];O.__webglColorRenderbuffer[oe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[oe]);let Xe=r.convert(de.format,de.colorSpace),j=r.convert(de.type),fe=S(de.internalFormat,Xe,j,de.colorSpace,b.isXRRenderTarget===!0),Ee=Ve(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ee,fe,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+oe,i.RENDERBUFFER,O.__webglColorRenderbuffer[oe])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),re(O.__webglDepthRenderbuffer,b,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(G){t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),Be(i.TEXTURE_CUBE_MAP,g);for(let oe=0;oe<6;oe++)if(g.mipmaps&&g.mipmaps.length>0)for(let de=0;de<g.mipmaps.length;de++)ve(O.__webglFramebuffer[oe][de],b,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,de);else ve(O.__webglFramebuffer[oe],b,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);d(g)&&u(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(_e){for(let oe=0,de=$.length;oe<de;oe++){let Xe=$[oe],j=n.get(Xe);t.bindTexture(i.TEXTURE_2D,j.__webglTexture),Be(i.TEXTURE_2D,Xe),ve(O.__webglFramebuffer,b,Xe,i.COLOR_ATTACHMENT0+oe,i.TEXTURE_2D,0),d(Xe)&&u(i.TEXTURE_2D)}t.unbindTexture()}else{let oe=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(oe=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(oe,q.__webglTexture),Be(oe,g),g.mipmaps&&g.mipmaps.length>0)for(let de=0;de<g.mipmaps.length;de++)ve(O.__webglFramebuffer[de],b,g,i.COLOR_ATTACHMENT0,oe,de);else ve(O.__webglFramebuffer,b,g,i.COLOR_ATTACHMENT0,oe,0);d(g)&&u(oe),t.unbindTexture()}b.depthBuffer&&Ie(b)}function We(b){let g=b.textures;for(let O=0,q=g.length;O<q;O++){let $=g[O];if(d($)){let G=E(b),_e=n.get($).__webglTexture;t.bindTexture(G,_e),u(G),t.unbindTexture()}}}let ut=[],T=[];function Zt(b){if(b.samples>0){if(He(b)===!1){let g=b.textures,O=b.width,q=b.height,$=i.COLOR_BUFFER_BIT,G=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_e=n.get(b),oe=g.length>1;if(oe)for(let de=0;de<g.length;de++)t.bindFramebuffer(i.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,_e.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,_e.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,_e.__webglFramebuffer);for(let de=0;de<g.length;de++){if(b.resolveDepthBuffer&&(b.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),oe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,_e.__webglColorRenderbuffer[de]);let Xe=n.get(g[de]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Xe,0)}i.blitFramebuffer(0,0,O,q,0,0,O,q,$,i.NEAREST),l===!0&&(ut.length=0,T.length=0,ut.push(i.COLOR_ATTACHMENT0+de),b.depthBuffer&&b.resolveDepthBuffer===!1&&(ut.push(G),T.push(G),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,T)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ut))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),oe)for(let de=0;de<g.length;de++){t.bindFramebuffer(i.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.RENDERBUFFER,_e.__webglColorRenderbuffer[de]);let Xe=n.get(g[de]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,_e.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.TEXTURE_2D,Xe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,_e.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){let g=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function Ve(b){return Math.min(s.maxSamples,b.samples)}function He(b){let g=n.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Me(b){let g=o.render.frame;h.get(b)!==g&&(h.set(b,g),b.update())}function nt(b,g){let O=b.colorSpace,q=b.format,$=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||O!==Ni&&O!==Vi&&(ze.getTransfer(O)===Qe?(q!==ni||$!==Mi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),g}function we(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=Y,this.setTexture2D=K,this.setTexture2DArray=H,this.setTexture3D=Q,this.setTextureCube=V,this.rebindTextures=ke,this.setupRenderTarget=at,this.updateRenderTargetMipmap=We,this.updateMultisampleRenderTarget=Zt,this.setupDepthRenderbuffer=Ie,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=He}function z_(i,e){function t(n,s=Vi){let r,o=ze.getTransfer(s);if(n===Mi)return i.UNSIGNED_BYTE;if(n===wo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===bo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ul)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===cl)return i.BYTE;if(n===hl)return i.SHORT;if(n===ts)return i.UNSIGNED_SHORT;if(n===Mo)return i.INT;if(n===sn)return i.UNSIGNED_INT;if(n===wi)return i.FLOAT;if(n===is)return i.HALF_FLOAT;if(n===dl)return i.ALPHA;if(n===fl)return i.RGB;if(n===ni)return i.RGBA;if(n===pl)return i.LUMINANCE;if(n===ml)return i.LUMINANCE_ALPHA;if(n===vn)return i.DEPTH_COMPONENT;if(n===xn)return i.DEPTH_STENCIL;if(n===gl)return i.RED;if(n===So)return i.RED_INTEGER;if(n===vl)return i.RG;if(n===Eo)return i.RG_INTEGER;if(n===To)return i.RGBA_INTEGER;if(n===Vs||n===Hs||n===Gs||n===Ws)if(o===Qe)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Vs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Hs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Gs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ws)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Vs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Hs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Gs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ws)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ao||n===Co||n===Ro||n===Po)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ao)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Co)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ro)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Po)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Io||n===Lo||n===Do)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Io||n===Lo)return o===Qe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Do)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Uo||n===No||n===Oo||n===Fo||n===Bo||n===ko||n===zo||n===Vo||n===Ho||n===Go||n===Wo||n===Xo||n===Yo||n===qo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Uo)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===No)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Oo)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Fo)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Bo)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ko)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===zo)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Vo)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ho)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Go)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Wo)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Xo)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Yo)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===qo)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Xs||n===Zo||n===$o)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Xs)return o===Qe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Zo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===$o)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===_l||n===Ko||n===Jo||n===jo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Xs)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ko)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Jo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===jo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===An?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var V_={type:"move"},Zs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ti,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ti,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ti,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let d=t.getJointPose(_,n),u=this._getHandJoint(c,_);d!==null&&(u.matrix.fromArray(d.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=d.radius),u.visible=d!==null}let h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],p=h.position.distanceTo(f.position),m=.02,v=.005;c.inputState.pinching&&p>m+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=m-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(V_)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ti;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},H_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,G_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,kl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let s=new xt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Yt({vertexShader:H_,fragmentShader:G_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new pt(new bn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},zl=class extends Oi{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,f=null,p=null,m=null,v=null,_=new kl,d=t.getContextAttributes(),u=null,E=null,S=[],M=[],I=new Oe,A=null,C=new Rt;C.viewport=new ht;let N=new Rt;N.viewport=new ht;let w=[C,N],x=new lo,R=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let ee=S[X];return ee===void 0&&(ee=new Zs,S[X]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(X){let ee=S[X];return ee===void 0&&(ee=new Zs,S[X]=ee),ee.getGripSpace()},this.getHand=function(X){let ee=S[X];return ee===void 0&&(ee=new Zs,S[X]=ee),ee.getHandSpace()};function k(X){let ee=M.indexOf(X.inputSource);if(ee===-1)return;let ve=S[ee];ve!==void 0&&(ve.update(X.inputSource,X.frame,c||o),ve.dispatchEvent({type:X.type,data:X.inputSource}))}function W(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",K);for(let X=0;X<S.length;X++){let ee=M[X];ee!==null&&(M[X]=null,S[X].disconnect(ee))}R=null,Y=null,_.reset(),e.setRenderTarget(u),m=null,p=null,f=null,s=null,E=null,et.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return f},this.getFrame=function(){return v},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(u=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",W),s.addEventListener("inputsourceschange",K),d.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(I),s.renderState.layers===void 0){let ee={antialias:d.antialias,alpha:!0,depth:d.depth,stencil:d.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,ee),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),E=new Qt(m.framebufferWidth,m.framebufferHeight,{format:ni,type:Mi,colorSpace:e.outputColorSpace,stencilBuffer:d.stencil})}else{let ee=null,ve=null,re=null;d.depth&&(re=d.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ee=d.stencil?xn:vn,ve=d.stencil?An:sn);let Te={colorFormat:t.RGBA8,depthFormat:re,scaleFactor:r};f=new XRWebGLBinding(s,t),p=f.createProjectionLayer(Te),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),E=new Qt(p.textureWidth,p.textureHeight,{format:ni,type:Mi,depthTexture:new Ns(p.textureWidth,p.textureHeight,ve,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:d.stencil,colorSpace:e.outputColorSpace,samples:d.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),et.setContext(s),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function K(X){for(let ee=0;ee<X.removed.length;ee++){let ve=X.removed[ee],re=M.indexOf(ve);re>=0&&(M[re]=null,S[re].disconnect(ve))}for(let ee=0;ee<X.added.length;ee++){let ve=X.added[ee],re=M.indexOf(ve);if(re===-1){for(let Ie=0;Ie<S.length;Ie++)if(Ie>=M.length){M.push(ve),re=Ie;break}else if(M[Ie]===null){M[Ie]=ve,re=Ie;break}if(re===-1)break}let Te=S[re];Te&&Te.connect(ve)}}let H=new U,Q=new U;function V(X,ee,ve){H.setFromMatrixPosition(ee.matrixWorld),Q.setFromMatrixPosition(ve.matrixWorld);let re=H.distanceTo(Q),Te=ee.projectionMatrix.elements,Ie=ve.projectionMatrix.elements,ke=Te[14]/(Te[10]-1),at=Te[14]/(Te[10]+1),We=(Te[9]+1)/Te[5],ut=(Te[9]-1)/Te[5],T=(Te[8]-1)/Te[0],Zt=(Ie[8]+1)/Ie[0],Ve=ke*T,He=ke*Zt,Me=re/(-T+Zt),nt=Me*-T;if(ee.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(nt),X.translateZ(Me),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Te[10]===-1)X.projectionMatrix.copy(ee.projectionMatrix),X.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{let we=ke+Me,b=at+Me,g=Ve-nt,O=He+(re-nt),q=We*at/b*we,$=ut*at/b*we;X.projectionMatrix.makePerspective(g,O,q,$,we,b),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function se(X,ee){ee===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(ee.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let ee=X.near,ve=X.far;_.texture!==null&&(_.depthNear>0&&(ee=_.depthNear),_.depthFar>0&&(ve=_.depthFar)),x.near=N.near=C.near=ee,x.far=N.far=C.far=ve,(R!==x.near||Y!==x.far)&&(s.updateRenderState({depthNear:x.near,depthFar:x.far}),R=x.near,Y=x.far),C.layers.mask=X.layers.mask|2,N.layers.mask=X.layers.mask|4,x.layers.mask=C.layers.mask|N.layers.mask;let re=X.parent,Te=x.cameras;se(x,re);for(let Ie=0;Ie<Te.length;Ie++)se(Te[Ie],re);Te.length===2?V(x,C,N):x.projectionMatrix.copy(C.projectionMatrix),ue(X,x,re)};function ue(X,ee,ve){ve===null?X.matrix.copy(ee.matrixWorld):(X.matrix.copy(ve.matrixWorld),X.matrix.invert(),X.matrix.multiply(ee.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(ee.projectionMatrix),X.projectionMatrixInverse.copy(ee.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Jn*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(p===null&&m===null))return l},this.setFoveation=function(X){l=X,p!==null&&(p.fixedFoveation=X),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=X)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(x)};let xe=null;function Be(X,ee){if(h=ee.getViewerPose(c||o),v=ee,h!==null){let ve=h.views;m!==null&&(e.setRenderTargetFramebuffer(E,m.framebuffer),e.setRenderTarget(E));let re=!1;ve.length!==x.cameras.length&&(x.cameras.length=0,re=!0);for(let Ie=0;Ie<ve.length;Ie++){let ke=ve[Ie],at=null;if(m!==null)at=m.getViewport(ke);else{let ut=f.getViewSubImage(p,ke);at=ut.viewport,Ie===0&&(e.setRenderTargetTextures(E,ut.colorTexture,p.ignoreDepthValues?void 0:ut.depthStencilTexture),e.setRenderTarget(E))}let We=w[Ie];We===void 0&&(We=new Rt,We.layers.enable(Ie),We.viewport=new ht,w[Ie]=We),We.matrix.fromArray(ke.transform.matrix),We.matrix.decompose(We.position,We.quaternion,We.scale),We.projectionMatrix.fromArray(ke.projectionMatrix),We.projectionMatrixInverse.copy(We.projectionMatrix).invert(),We.viewport.set(at.x,at.y,at.width,at.height),Ie===0&&(x.matrix.copy(We.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),re===!0&&x.cameras.push(We)}let Te=s.enabledFeatures;if(Te&&Te.includes("depth-sensing")){let Ie=f.getDepthInformation(ve[0]);Ie&&Ie.isValid&&Ie.texture&&_.init(e,Ie,s.renderState)}}for(let ve=0;ve<S.length;ve++){let re=M[ve],Te=S[ve];re!==null&&Te!==void 0&&Te.update(re,ee,c||o)}xe&&xe(X,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),v=null}let et=new lu;et.setAnimationLoop(Be),this.setAnimationLoop=function(X){xe=X},this.dispose=function(){}}},In=new ei,W_=new tt;function X_(i,e){function t(d,u){d.matrixAutoUpdate===!0&&d.updateMatrix(),u.value.copy(d.matrix)}function n(d,u){u.color.getRGB(d.fogColor.value,bl(i)),u.isFog?(d.fogNear.value=u.near,d.fogFar.value=u.far):u.isFogExp2&&(d.fogDensity.value=u.density)}function s(d,u,E,S,M){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(d,u):u.isMeshToonMaterial?(r(d,u),f(d,u)):u.isMeshPhongMaterial?(r(d,u),h(d,u)):u.isMeshStandardMaterial?(r(d,u),p(d,u),u.isMeshPhysicalMaterial&&m(d,u,M)):u.isMeshMatcapMaterial?(r(d,u),v(d,u)):u.isMeshDepthMaterial?r(d,u):u.isMeshDistanceMaterial?(r(d,u),_(d,u)):u.isMeshNormalMaterial?r(d,u):u.isLineBasicMaterial?(o(d,u),u.isLineDashedMaterial&&a(d,u)):u.isPointsMaterial?l(d,u,E,S):u.isSpriteMaterial?c(d,u):u.isShadowMaterial?(d.color.value.copy(u.color),d.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(d,u){d.opacity.value=u.opacity,u.color&&d.diffuse.value.copy(u.color),u.emissive&&d.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(d.map.value=u.map,t(u.map,d.mapTransform)),u.alphaMap&&(d.alphaMap.value=u.alphaMap,t(u.alphaMap,d.alphaMapTransform)),u.bumpMap&&(d.bumpMap.value=u.bumpMap,t(u.bumpMap,d.bumpMapTransform),d.bumpScale.value=u.bumpScale,u.side===Ut&&(d.bumpScale.value*=-1)),u.normalMap&&(d.normalMap.value=u.normalMap,t(u.normalMap,d.normalMapTransform),d.normalScale.value.copy(u.normalScale),u.side===Ut&&d.normalScale.value.negate()),u.displacementMap&&(d.displacementMap.value=u.displacementMap,t(u.displacementMap,d.displacementMapTransform),d.displacementScale.value=u.displacementScale,d.displacementBias.value=u.displacementBias),u.emissiveMap&&(d.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,d.emissiveMapTransform)),u.specularMap&&(d.specularMap.value=u.specularMap,t(u.specularMap,d.specularMapTransform)),u.alphaTest>0&&(d.alphaTest.value=u.alphaTest);let E=e.get(u),S=E.envMap,M=E.envMapRotation;S&&(d.envMap.value=S,In.copy(M),In.x*=-1,In.y*=-1,In.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(In.y*=-1,In.z*=-1),d.envMapRotation.value.setFromMatrix4(W_.makeRotationFromEuler(In)),d.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,d.reflectivity.value=u.reflectivity,d.ior.value=u.ior,d.refractionRatio.value=u.refractionRatio),u.lightMap&&(d.lightMap.value=u.lightMap,d.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,d.lightMapTransform)),u.aoMap&&(d.aoMap.value=u.aoMap,d.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,d.aoMapTransform))}function o(d,u){d.diffuse.value.copy(u.color),d.opacity.value=u.opacity,u.map&&(d.map.value=u.map,t(u.map,d.mapTransform))}function a(d,u){d.dashSize.value=u.dashSize,d.totalSize.value=u.dashSize+u.gapSize,d.scale.value=u.scale}function l(d,u,E,S){d.diffuse.value.copy(u.color),d.opacity.value=u.opacity,d.size.value=u.size*E,d.scale.value=S*.5,u.map&&(d.map.value=u.map,t(u.map,d.uvTransform)),u.alphaMap&&(d.alphaMap.value=u.alphaMap,t(u.alphaMap,d.alphaMapTransform)),u.alphaTest>0&&(d.alphaTest.value=u.alphaTest)}function c(d,u){d.diffuse.value.copy(u.color),d.opacity.value=u.opacity,d.rotation.value=u.rotation,u.map&&(d.map.value=u.map,t(u.map,d.mapTransform)),u.alphaMap&&(d.alphaMap.value=u.alphaMap,t(u.alphaMap,d.alphaMapTransform)),u.alphaTest>0&&(d.alphaTest.value=u.alphaTest)}function h(d,u){d.specular.value.copy(u.specular),d.shininess.value=Math.max(u.shininess,1e-4)}function f(d,u){u.gradientMap&&(d.gradientMap.value=u.gradientMap)}function p(d,u){d.metalness.value=u.metalness,u.metalnessMap&&(d.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,d.metalnessMapTransform)),d.roughness.value=u.roughness,u.roughnessMap&&(d.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,d.roughnessMapTransform)),u.envMap&&(d.envMapIntensity.value=u.envMapIntensity)}function m(d,u,E){d.ior.value=u.ior,u.sheen>0&&(d.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),d.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(d.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,d.sheenColorMapTransform)),u.sheenRoughnessMap&&(d.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,d.sheenRoughnessMapTransform))),u.clearcoat>0&&(d.clearcoat.value=u.clearcoat,d.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(d.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,d.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(d.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,d.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(d.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,d.clearcoatNormalMapTransform),d.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Ut&&d.clearcoatNormalScale.value.negate())),u.dispersion>0&&(d.dispersion.value=u.dispersion),u.iridescence>0&&(d.iridescence.value=u.iridescence,d.iridescenceIOR.value=u.iridescenceIOR,d.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],d.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(d.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,d.iridescenceMapTransform)),u.iridescenceThicknessMap&&(d.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,d.iridescenceThicknessMapTransform))),u.transmission>0&&(d.transmission.value=u.transmission,d.transmissionSamplerMap.value=E.texture,d.transmissionSamplerSize.value.set(E.width,E.height),u.transmissionMap&&(d.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,d.transmissionMapTransform)),d.thickness.value=u.thickness,u.thicknessMap&&(d.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,d.thicknessMapTransform)),d.attenuationDistance.value=u.attenuationDistance,d.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(d.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(d.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,d.anisotropyMapTransform))),d.specularIntensity.value=u.specularIntensity,d.specularColor.value.copy(u.specularColor),u.specularColorMap&&(d.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,d.specularColorMapTransform)),u.specularIntensityMap&&(d.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,d.specularIntensityMapTransform))}function v(d,u){u.matcap&&(d.matcap.value=u.matcap)}function _(d,u){let E=e.get(u).light;d.referencePosition.value.setFromMatrixPosition(E.matrixWorld),d.nearDistance.value=E.shadow.camera.near,d.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Y_(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,S){let M=S.program;n.uniformBlockBinding(E,M)}function c(E,S){let M=s[E.id];M===void 0&&(v(E),M=h(E),s[E.id]=M,E.addEventListener("dispose",d));let I=S.program;n.updateUBOMapping(E,I);let A=e.render.frame;r[E.id]!==A&&(p(E),r[E.id]=A)}function h(E){let S=f();E.__bindingPointIndex=S;let M=i.createBuffer(),I=E.__size,A=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,I,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,M),M}function f(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(E){let S=s[E.id],M=E.uniforms,I=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let A=0,C=M.length;A<C;A++){let N=Array.isArray(M[A])?M[A]:[M[A]];for(let w=0,x=N.length;w<x;w++){let R=N[w];if(m(R,A,w,I)===!0){let Y=R.__offset,k=Array.isArray(R.value)?R.value:[R.value],W=0;for(let K=0;K<k.length;K++){let H=k[K],Q=_(H);typeof H=="number"||typeof H=="boolean"?(R.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,Y+W,R.__data)):H.isMatrix3?(R.__data[0]=H.elements[0],R.__data[1]=H.elements[1],R.__data[2]=H.elements[2],R.__data[3]=0,R.__data[4]=H.elements[3],R.__data[5]=H.elements[4],R.__data[6]=H.elements[5],R.__data[7]=0,R.__data[8]=H.elements[6],R.__data[9]=H.elements[7],R.__data[10]=H.elements[8],R.__data[11]=0):(H.toArray(R.__data,W),W+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,Y,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(E,S,M,I){let A=E.value,C=S+"_"+M;if(I[C]===void 0)return typeof A=="number"||typeof A=="boolean"?I[C]=A:I[C]=A.clone(),!0;{let N=I[C];if(typeof A=="number"||typeof A=="boolean"){if(N!==A)return I[C]=A,!0}else if(N.equals(A)===!1)return N.copy(A),!0}return!1}function v(E){let S=E.uniforms,M=0,I=16;for(let C=0,N=S.length;C<N;C++){let w=Array.isArray(S[C])?S[C]:[S[C]];for(let x=0,R=w.length;x<R;x++){let Y=w[x],k=Array.isArray(Y.value)?Y.value:[Y.value];for(let W=0,K=k.length;W<K;W++){let H=k[W],Q=_(H),V=M%I,se=V%Q.boundary,ue=V+se;M+=se,ue!==0&&I-ue<Q.storage&&(M+=I-ue),Y.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=M,M+=Q.storage}}}let A=M%I;return A>0&&(M+=I-A),E.__size=M,E.__cache={},this}function _(E){let S={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(S.boundary=4,S.storage=4):E.isVector2?(S.boundary=8,S.storage=8):E.isVector3||E.isColor?(S.boundary=16,S.storage=12):E.isVector4?(S.boundary=16,S.storage=16):E.isMatrix3?(S.boundary=48,S.storage=48):E.isMatrix4?(S.boundary=64,S.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),S}function d(E){let S=E.target;S.removeEventListener("dispose",d);let M=o.indexOf(S.__bindingPointIndex);o.splice(M,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function u(){for(let E in s)i.deleteBuffer(s[E]);o=[],s={},r={}}return{bind:l,update:c,dispose:u}}var na=class{constructor(e={}){let{canvas:t=Lh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;let v=new Uint32Array(4),_=new Int32Array(4),d=null,u=null,E=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ht,this.toneMapping=zi,this.toneMappingExposure=1;let M=this,I=!1,A=0,C=0,N=null,w=-1,x=null,R=new ht,Y=new ht,k=null,W=new qe(0),K=0,H=t.width,Q=t.height,V=1,se=null,ue=null,xe=new ht(0,0,H,Q),Be=new ht(0,0,H,Q),et=!1,X=new wn,ee=!1,ve=!1,re=new tt,Te=new tt,Ie=new U,ke=new ht,at={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},We=!1;function ut(){return N===null?V:1}let T=n;function Zt(y,L){return t.getContext(y,L)}try{let y={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"171"}`),t.addEventListener("webglcontextlost",Z,!1),t.addEventListener("webglcontextrestored",le,!1),t.addEventListener("webglcontextcreationerror",ae,!1),T===null){let L="webgl2";if(T=Zt(L,y),T===null)throw Zt(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Ve,He,Me,nt,we,b,g,O,q,$,G,_e,oe,de,Xe,j,fe,Ee,Ae,pe,Ge,Ue,it,P;function ie(){Ve=new c0(T),Ve.init(),Ue=new z_(T,Ve),He=new n0(T,Ve,e,Ue),Me=new B_(T,Ve),He.reverseDepthBuffer&&p&&Me.buffers.depth.setReversed(!0),nt=new d0(T),we=new E_,b=new k_(T,Ve,Me,we,He,Ue,nt),g=new r0(M),O=new l0(M),q=new ym(T),it=new t0(T,q),$=new h0(T,q,nt,it),G=new p0(T,$,q,nt),Ae=new f0(T,He,b),j=new s0(we),_e=new S_(M,g,O,Ve,He,it,j),oe=new X_(M,we),de=new A_,Xe=new D_(Ve),Ee=new e0(M,g,O,Me,G,m,l),fe=new O_(M,G,He),P=new Y_(T,nt,He,Me),pe=new i0(T,Ve,nt),Ge=new u0(T,Ve,nt),nt.programs=_e.programs,M.capabilities=He,M.extensions=Ve,M.properties=we,M.renderLists=de,M.shadowMap=fe,M.state=Me,M.info=nt}ie();let z=new zl(M,T);this.xr=z,this.getContext=function(){return T},this.getContextAttributes=function(){return T.getContextAttributes()},this.forceContextLoss=function(){let y=Ve.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=Ve.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(y){y!==void 0&&(V=y,this.setSize(H,Q,!1))},this.getSize=function(y){return y.set(H,Q)},this.setSize=function(y,L,F=!0){if(z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=y,Q=L,t.width=Math.floor(y*V),t.height=Math.floor(L*V),F===!0&&(t.style.width=y+"px",t.style.height=L+"px"),this.setViewport(0,0,y,L)},this.getDrawingBufferSize=function(y){return y.set(H*V,Q*V).floor()},this.setDrawingBufferSize=function(y,L,F){H=y,Q=L,V=F,t.width=Math.floor(y*F),t.height=Math.floor(L*F),this.setViewport(0,0,y,L)},this.getCurrentViewport=function(y){return y.copy(R)},this.getViewport=function(y){return y.copy(xe)},this.setViewport=function(y,L,F,B){y.isVector4?xe.set(y.x,y.y,y.z,y.w):xe.set(y,L,F,B),Me.viewport(R.copy(xe).multiplyScalar(V).round())},this.getScissor=function(y){return y.copy(Be)},this.setScissor=function(y,L,F,B){y.isVector4?Be.set(y.x,y.y,y.z,y.w):Be.set(y,L,F,B),Me.scissor(Y.copy(Be).multiplyScalar(V).round())},this.getScissorTest=function(){return et},this.setScissorTest=function(y){Me.setScissorTest(et=y)},this.setOpaqueSort=function(y){se=y},this.setTransparentSort=function(y){ue=y},this.getClearColor=function(y){return y.copy(Ee.getClearColor())},this.setClearColor=function(){Ee.setClearColor.apply(Ee,arguments)},this.getClearAlpha=function(){return Ee.getClearAlpha()},this.setClearAlpha=function(){Ee.setClearAlpha.apply(Ee,arguments)},this.clear=function(y=!0,L=!0,F=!0){let B=0;if(y){let D=!1;if(N!==null){let J=N.texture.format;D=J===To||J===Eo||J===So}if(D){let J=N.texture.type,ne=J===Mi||J===sn||J===ts||J===An||J===wo||J===bo,he=Ee.getClearColor(),me=Ee.getClearAlpha(),Ce=he.r,Pe=he.g,be=he.b;ne?(v[0]=Ce,v[1]=Pe,v[2]=be,v[3]=me,T.clearBufferuiv(T.COLOR,0,v)):(_[0]=Ce,_[1]=Pe,_[2]=be,_[3]=me,T.clearBufferiv(T.COLOR,0,_))}else B|=T.COLOR_BUFFER_BIT}L&&(B|=T.DEPTH_BUFFER_BIT),F&&(B|=T.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),T.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Z,!1),t.removeEventListener("webglcontextrestored",le,!1),t.removeEventListener("webglcontextcreationerror",ae,!1),Ee.dispose(),de.dispose(),Xe.dispose(),we.dispose(),g.dispose(),O.dispose(),G.dispose(),it.dispose(),P.dispose(),_e.dispose(),z.dispose(),z.removeEventListener("sessionstart",vc),z.removeEventListener("sessionend",_c),hn.stop()};function Z(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function le(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;let y=nt.autoReset,L=fe.enabled,F=fe.autoUpdate,B=fe.needsUpdate,D=fe.type;ie(),nt.autoReset=y,fe.enabled=L,fe.autoUpdate=F,fe.needsUpdate=B,fe.type=D}function ae(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function De(y){let L=y.target;L.removeEventListener("dispose",De),lt(L)}function lt(y){Tt(y),we.remove(y)}function Tt(y){let L=we.get(y).programs;L!==void 0&&(L.forEach(function(F){_e.releaseProgram(F)}),y.isShaderMaterial&&_e.releaseShaderCache(y))}this.renderBufferDirect=function(y,L,F,B,D,J){L===null&&(L=at);let ne=D.isMesh&&D.matrixWorld.determinant()<0,he=bp(y,L,F,B,D);Me.setMaterial(B,ne);let me=F.index,Ce=1;if(B.wireframe===!0){if(me=$.getWireframeAttribute(F),me===void 0)return;Ce=2}let Pe=F.drawRange,be=F.attributes.position,Ye=Pe.start*Ce,$e=(Pe.start+Pe.count)*Ce;J!==null&&(Ye=Math.max(Ye,J.start*Ce),$e=Math.min($e,(J.start+J.count)*Ce)),me!==null?(Ye=Math.max(Ye,0),$e=Math.min($e,me.count)):be!=null&&(Ye=Math.max(Ye,0),$e=Math.min($e,be.count));let dt=$e-Ye;if(dt<0||dt===1/0)return;it.setup(D,B,he,F,me);let ct,Ze=pe;if(me!==null&&(ct=q.get(me),Ze=Ge,Ze.setIndex(ct)),D.isMesh)B.wireframe===!0?(Me.setLineWidth(B.wireframeLinewidth*ut()),Ze.setMode(T.LINES)):Ze.setMode(T.TRIANGLES);else if(D.isLine){let Se=B.linewidth;Se===void 0&&(Se=1),Me.setLineWidth(Se*ut()),D.isLineSegments?Ze.setMode(T.LINES):D.isLineLoop?Ze.setMode(T.LINE_LOOP):Ze.setMode(T.LINE_STRIP)}else D.isPoints?Ze.setMode(T.POINTS):D.isSprite&&Ze.setMode(T.TRIANGLES);if(D.isBatchedMesh)if(D._multiDrawInstances!==null)Ze.renderMultiDrawInstances(D._multiDrawStarts,D._multiDrawCounts,D._multiDrawCount,D._multiDrawInstances);else if(Ve.get("WEBGL_multi_draw"))Ze.renderMultiDraw(D._multiDrawStarts,D._multiDrawCounts,D._multiDrawCount);else{let Se=D._multiDrawStarts,bt=D._multiDrawCounts,Ke=D._multiDrawCount,li=me?q.get(me).bytesPerElement:1,On=we.get(B).currentProgram.getUniforms();for(let kt=0;kt<Ke;kt++)On.setValue(T,"_gl_DrawID",kt),Ze.render(Se[kt]/li,bt[kt])}else if(D.isInstancedMesh)Ze.renderInstances(Ye,dt,D.count);else if(F.isInstancedBufferGeometry){let Se=F._maxInstanceCount!==void 0?F._maxInstanceCount:1/0,bt=Math.min(F.instanceCount,Se);Ze.renderInstances(Ye,dt,bt)}else Ze.render(Ye,dt)};function je(y,L,F){y.transparent===!0&&y.side===yi&&y.forceSinglePass===!1?(y.side=Ut,y.needsUpdate=!0,xr(y,L,F),y.side=Ui,y.needsUpdate=!0,xr(y,L,F),y.side=yi):xr(y,L,F)}this.compile=function(y,L,F=null){F===null&&(F=y),u=Xe.get(F),u.init(L),S.push(u),F.traverseVisible(function(D){D.isLight&&D.layers.test(L.layers)&&(u.pushLight(D),D.castShadow&&u.pushShadow(D))}),y!==F&&y.traverseVisible(function(D){D.isLight&&D.layers.test(L.layers)&&(u.pushLight(D),D.castShadow&&u.pushShadow(D))}),u.setupLights();let B=new Set;return y.traverse(function(D){if(!(D.isMesh||D.isPoints||D.isLine||D.isSprite))return;let J=D.material;if(J)if(Array.isArray(J))for(let ne=0;ne<J.length;ne++){let he=J[ne];je(he,F,D),B.add(he)}else je(J,F,D),B.add(J)}),S.pop(),u=null,B},this.compileAsync=function(y,L,F=null){let B=this.compile(y,L,F);return new Promise(D=>{function J(){if(B.forEach(function(ne){we.get(ne).currentProgram.isReady()&&B.delete(ne)}),B.size===0){D(y);return}setTimeout(J,10)}Ve.get("KHR_parallel_shader_compile")!==null?J():setTimeout(J,10)})};let ai=null;function Ai(y){ai&&ai(y)}function vc(){hn.stop()}function _c(){hn.start()}let hn=new lu;hn.setAnimationLoop(Ai),typeof self<"u"&&hn.setContext(self),this.setAnimationLoop=function(y){ai=y,z.setAnimationLoop(y),y===null?hn.stop():hn.start()},z.addEventListener("sessionstart",vc),z.addEventListener("sessionend",_c),this.render=function(y,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),z.enabled===!0&&z.isPresenting===!0&&(z.cameraAutoUpdate===!0&&z.updateCamera(L),L=z.getCamera()),y.isScene===!0&&y.onBeforeRender(M,y,L,N),u=Xe.get(y,S.length),u.init(L),S.push(u),Te.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),X.setFromProjectionMatrix(Te),ve=this.localClippingEnabled,ee=j.init(this.clippingPlanes,ve),d=de.get(y,E.length),d.init(),E.push(d),z.enabled===!0&&z.isPresenting===!0){let J=M.xr.getDepthSensingMesh();J!==null&&Aa(J,L,-1/0,M.sortObjects)}Aa(y,L,0,M.sortObjects),d.finish(),M.sortObjects===!0&&d.sort(se,ue),We=z.enabled===!1||z.isPresenting===!1||z.hasDepthSensing()===!1,We&&Ee.addToRenderList(d,y),this.info.render.frame++,ee===!0&&j.beginShadows();let F=u.state.shadowsArray;fe.render(F,y,L),ee===!0&&j.endShadows(),this.info.autoReset===!0&&this.info.reset();let B=d.opaque,D=d.transmissive;if(u.setupLights(),L.isArrayCamera){let J=L.cameras;if(D.length>0)for(let ne=0,he=J.length;ne<he;ne++){let me=J[ne];xc(B,D,y,me)}We&&Ee.render(y);for(let ne=0,he=J.length;ne<he;ne++){let me=J[ne];yc(d,y,me,me.viewport)}}else D.length>0&&xc(B,D,y,L),We&&Ee.render(y),yc(d,y,L);N!==null&&(b.updateMultisampleRenderTarget(N),b.updateRenderTargetMipmap(N)),y.isScene===!0&&y.onAfterRender(M,y,L),it.resetDefaultState(),w=-1,x=null,S.pop(),S.length>0?(u=S[S.length-1],ee===!0&&j.setGlobalState(M.clippingPlanes,u.state.camera)):u=null,E.pop(),E.length>0?d=E[E.length-1]:d=null};function Aa(y,L,F,B){if(y.visible===!1)return;if(y.layers.test(L.layers)){if(y.isGroup)F=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(L);else if(y.isLight)u.pushLight(y),y.castShadow&&u.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||X.intersectsSprite(y)){B&&ke.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Te);let ne=G.update(y),he=y.material;he.visible&&d.push(y,ne,he,F,ke.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||X.intersectsObject(y))){let ne=G.update(y),he=y.material;if(B&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),ke.copy(y.boundingSphere.center)):(ne.boundingSphere===null&&ne.computeBoundingSphere(),ke.copy(ne.boundingSphere.center)),ke.applyMatrix4(y.matrixWorld).applyMatrix4(Te)),Array.isArray(he)){let me=ne.groups;for(let Ce=0,Pe=me.length;Ce<Pe;Ce++){let be=me[Ce],Ye=he[be.materialIndex];Ye&&Ye.visible&&d.push(y,ne,Ye,F,ke.z,be)}}else he.visible&&d.push(y,ne,he,F,ke.z,null)}}let J=y.children;for(let ne=0,he=J.length;ne<he;ne++)Aa(J[ne],L,F,B)}function yc(y,L,F,B){let D=y.opaque,J=y.transmissive,ne=y.transparent;u.setupLightsView(F),ee===!0&&j.setGlobalState(M.clippingPlanes,F),B&&Me.viewport(R.copy(B)),D.length>0&&yr(D,L,F),J.length>0&&yr(J,L,F),ne.length>0&&yr(ne,L,F),Me.buffers.depth.setTest(!0),Me.buffers.depth.setMask(!0),Me.buffers.color.setMask(!0),Me.setPolygonOffset(!1)}function xc(y,L,F,B){if((F.isScene===!0?F.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[B.id]===void 0&&(u.state.transmissionRenderTarget[B.id]=new Qt(1,1,{generateMipmaps:!0,type:Ve.has("EXT_color_buffer_half_float")||Ve.has("EXT_color_buffer_float")?is:Mi,minFilter:xi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ze.workingColorSpace}));let J=u.state.transmissionRenderTarget[B.id],ne=B.viewport||R;J.setSize(ne.z,ne.w);let he=M.getRenderTarget();M.setRenderTarget(J),M.getClearColor(W),K=M.getClearAlpha(),K<1&&M.setClearColor(16777215,.5),M.clear(),We&&Ee.render(F);let me=M.toneMapping;M.toneMapping=zi;let Ce=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),u.setupLightsView(B),ee===!0&&j.setGlobalState(M.clippingPlanes,B),yr(y,F,B),b.updateMultisampleRenderTarget(J),b.updateRenderTargetMipmap(J),Ve.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let be=0,Ye=L.length;be<Ye;be++){let $e=L[be],dt=$e.object,ct=$e.geometry,Ze=$e.material,Se=$e.group;if(Ze.side===yi&&dt.layers.test(B.layers)){let bt=Ze.side;Ze.side=Ut,Ze.needsUpdate=!0,Mc(dt,F,B,ct,Ze,Se),Ze.side=bt,Ze.needsUpdate=!0,Pe=!0}}Pe===!0&&(b.updateMultisampleRenderTarget(J),b.updateRenderTargetMipmap(J))}M.setRenderTarget(he),M.setClearColor(W,K),Ce!==void 0&&(B.viewport=Ce),M.toneMapping=me}function yr(y,L,F){let B=L.isScene===!0?L.overrideMaterial:null;for(let D=0,J=y.length;D<J;D++){let ne=y[D],he=ne.object,me=ne.geometry,Ce=B===null?ne.material:B,Pe=ne.group;he.layers.test(F.layers)&&Mc(he,L,F,me,Ce,Pe)}}function Mc(y,L,F,B,D,J){y.onBeforeRender(M,L,F,B,D,J),y.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),D.onBeforeRender(M,L,F,B,y,J),D.transparent===!0&&D.side===yi&&D.forceSinglePass===!1?(D.side=Ut,D.needsUpdate=!0,M.renderBufferDirect(F,L,B,D,y,J),D.side=Ui,D.needsUpdate=!0,M.renderBufferDirect(F,L,B,D,y,J),D.side=yi):M.renderBufferDirect(F,L,B,D,y,J),y.onAfterRender(M,L,F,B,D,J)}function xr(y,L,F){L.isScene!==!0&&(L=at);let B=we.get(y),D=u.state.lights,J=u.state.shadowsArray,ne=D.state.version,he=_e.getParameters(y,D.state,J,L,F),me=_e.getProgramCacheKey(he),Ce=B.programs;B.environment=y.isMeshStandardMaterial?L.environment:null,B.fog=L.fog,B.envMap=(y.isMeshStandardMaterial?O:g).get(y.envMap||B.environment),B.envMapRotation=B.environment!==null&&y.envMap===null?L.environmentRotation:y.envMapRotation,Ce===void 0&&(y.addEventListener("dispose",De),Ce=new Map,B.programs=Ce);let Pe=Ce.get(me);if(Pe!==void 0){if(B.currentProgram===Pe&&B.lightsStateVersion===ne)return bc(y,he),Pe}else he.uniforms=_e.getUniforms(y),y.onBeforeCompile(he,M),Pe=_e.acquireProgram(he,me),Ce.set(me,Pe),B.uniforms=he.uniforms;let be=B.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(be.clippingPlanes=j.uniform),bc(y,he),B.needsLights=Ep(y),B.lightsStateVersion=ne,B.needsLights&&(be.ambientLightColor.value=D.state.ambient,be.lightProbe.value=D.state.probe,be.directionalLights.value=D.state.directional,be.directionalLightShadows.value=D.state.directionalShadow,be.spotLights.value=D.state.spot,be.spotLightShadows.value=D.state.spotShadow,be.rectAreaLights.value=D.state.rectArea,be.ltc_1.value=D.state.rectAreaLTC1,be.ltc_2.value=D.state.rectAreaLTC2,be.pointLights.value=D.state.point,be.pointLightShadows.value=D.state.pointShadow,be.hemisphereLights.value=D.state.hemi,be.directionalShadowMap.value=D.state.directionalShadowMap,be.directionalShadowMatrix.value=D.state.directionalShadowMatrix,be.spotShadowMap.value=D.state.spotShadowMap,be.spotLightMatrix.value=D.state.spotLightMatrix,be.spotLightMap.value=D.state.spotLightMap,be.pointShadowMap.value=D.state.pointShadowMap,be.pointShadowMatrix.value=D.state.pointShadowMatrix),B.currentProgram=Pe,B.uniformsList=null,Pe}function wc(y){if(y.uniformsList===null){let L=y.currentProgram.getUniforms();y.uniformsList=os.seqWithValue(L.seq,y.uniforms)}return y.uniformsList}function bc(y,L){let F=we.get(y);F.outputColorSpace=L.outputColorSpace,F.batching=L.batching,F.batchingColor=L.batchingColor,F.instancing=L.instancing,F.instancingColor=L.instancingColor,F.instancingMorph=L.instancingMorph,F.skinning=L.skinning,F.morphTargets=L.morphTargets,F.morphNormals=L.morphNormals,F.morphColors=L.morphColors,F.morphTargetsCount=L.morphTargetsCount,F.numClippingPlanes=L.numClippingPlanes,F.numIntersection=L.numClipIntersection,F.vertexAlphas=L.vertexAlphas,F.vertexTangents=L.vertexTangents,F.toneMapping=L.toneMapping}function bp(y,L,F,B,D){L.isScene!==!0&&(L=at),b.resetTextureUnits();let J=L.fog,ne=B.isMeshStandardMaterial?L.environment:null,he=N===null?M.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Ni,me=(B.isMeshStandardMaterial?O:g).get(B.envMap||ne),Ce=B.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,Pe=!!F.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),be=!!F.morphAttributes.position,Ye=!!F.morphAttributes.normal,$e=!!F.morphAttributes.color,dt=zi;B.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(dt=M.toneMapping);let ct=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Ze=ct!==void 0?ct.length:0,Se=we.get(B),bt=u.state.lights;if(ee===!0&&(ve===!0||y!==x)){let It=y===x&&B.id===w;j.setState(B,y,It)}let Ke=!1;B.version===Se.__version?(Se.needsLights&&Se.lightsStateVersion!==bt.state.version||Se.outputColorSpace!==he||D.isBatchedMesh&&Se.batching===!1||!D.isBatchedMesh&&Se.batching===!0||D.isBatchedMesh&&Se.batchingColor===!0&&D.colorTexture===null||D.isBatchedMesh&&Se.batchingColor===!1&&D.colorTexture!==null||D.isInstancedMesh&&Se.instancing===!1||!D.isInstancedMesh&&Se.instancing===!0||D.isSkinnedMesh&&Se.skinning===!1||!D.isSkinnedMesh&&Se.skinning===!0||D.isInstancedMesh&&Se.instancingColor===!0&&D.instanceColor===null||D.isInstancedMesh&&Se.instancingColor===!1&&D.instanceColor!==null||D.isInstancedMesh&&Se.instancingMorph===!0&&D.morphTexture===null||D.isInstancedMesh&&Se.instancingMorph===!1&&D.morphTexture!==null||Se.envMap!==me||B.fog===!0&&Se.fog!==J||Se.numClippingPlanes!==void 0&&(Se.numClippingPlanes!==j.numPlanes||Se.numIntersection!==j.numIntersection)||Se.vertexAlphas!==Ce||Se.vertexTangents!==Pe||Se.morphTargets!==be||Se.morphNormals!==Ye||Se.morphColors!==$e||Se.toneMapping!==dt||Se.morphTargetsCount!==Ze)&&(Ke=!0):(Ke=!0,Se.__version=B.version);let li=Se.currentProgram;Ke===!0&&(li=xr(B,L,D));let On=!1,kt=!1,gs=!1,rt=li.getUniforms(),$t=Se.uniforms;if(Me.useProgram(li.program)&&(On=!0,kt=!0,gs=!0),B.id!==w&&(w=B.id,kt=!0),On||x!==y){Me.buffers.depth.getReversed()?(re.copy(y.projectionMatrix),Uh(re),Nh(re),rt.setValue(T,"projectionMatrix",re)):rt.setValue(T,"projectionMatrix",y.projectionMatrix),rt.setValue(T,"viewMatrix",y.matrixWorldInverse);let Ot=rt.map.cameraPosition;Ot!==void 0&&Ot.setValue(T,Ie.setFromMatrixPosition(y.matrixWorld)),He.logarithmicDepthBuffer&&rt.setValue(T,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&rt.setValue(T,"isOrthographic",y.isOrthographicCamera===!0),x!==y&&(x=y,kt=!0,gs=!0)}if(D.isSkinnedMesh){rt.setOptional(T,D,"bindMatrix"),rt.setOptional(T,D,"bindMatrixInverse");let It=D.skeleton;It&&(It.boneTexture===null&&It.computeBoneTexture(),rt.setValue(T,"boneTexture",It.boneTexture,b))}D.isBatchedMesh&&(rt.setOptional(T,D,"batchingTexture"),rt.setValue(T,"batchingTexture",D._matricesTexture,b),rt.setOptional(T,D,"batchingIdTexture"),rt.setValue(T,"batchingIdTexture",D._indirectTexture,b),rt.setOptional(T,D,"batchingColorTexture"),D._colorsTexture!==null&&rt.setValue(T,"batchingColorTexture",D._colorsTexture,b));let Kt=F.morphAttributes;if((Kt.position!==void 0||Kt.normal!==void 0||Kt.color!==void 0)&&Ae.update(D,F,li),(kt||Se.receiveShadow!==D.receiveShadow)&&(Se.receiveShadow=D.receiveShadow,rt.setValue(T,"receiveShadow",D.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&($t.envMap.value=me,$t.flipEnvMap.value=me.isCubeTexture&&me.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&L.environment!==null&&($t.envMapIntensity.value=L.environmentIntensity),kt&&(rt.setValue(T,"toneMappingExposure",M.toneMappingExposure),Se.needsLights&&Sp($t,gs),J&&B.fog===!0&&oe.refreshFogUniforms($t,J),oe.refreshMaterialUniforms($t,B,V,Q,u.state.transmissionRenderTarget[y.id]),os.upload(T,wc(Se),$t,b)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(os.upload(T,wc(Se),$t,b),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&rt.setValue(T,"center",D.center),rt.setValue(T,"modelViewMatrix",D.modelViewMatrix),rt.setValue(T,"normalMatrix",D.normalMatrix),rt.setValue(T,"modelMatrix",D.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){let It=B.uniformsGroups;for(let Ot=0,Ca=It.length;Ot<Ca;Ot++){let un=It[Ot];P.update(un,li),P.bind(un,li)}}return li}function Sp(y,L){y.ambientLightColor.needsUpdate=L,y.lightProbe.needsUpdate=L,y.directionalLights.needsUpdate=L,y.directionalLightShadows.needsUpdate=L,y.pointLights.needsUpdate=L,y.pointLightShadows.needsUpdate=L,y.spotLights.needsUpdate=L,y.spotLightShadows.needsUpdate=L,y.rectAreaLights.needsUpdate=L,y.hemisphereLights.needsUpdate=L}function Ep(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(y,L,F){we.get(y.texture).__webglTexture=L,we.get(y.depthTexture).__webglTexture=F;let B=we.get(y);B.__hasExternalTextures=!0,B.__autoAllocateDepthBuffer=F===void 0,B.__autoAllocateDepthBuffer||Ve.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(y,L){let F=we.get(y);F.__webglFramebuffer=L,F.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(y,L=0,F=0){N=y,A=L,C=F;let B=!0,D=null,J=!1,ne=!1;if(y){let me=we.get(y);if(me.__useDefaultFramebuffer!==void 0)Me.bindFramebuffer(T.FRAMEBUFFER,null),B=!1;else if(me.__webglFramebuffer===void 0)b.setupRenderTarget(y);else if(me.__hasExternalTextures)b.rebindTextures(y,we.get(y.texture).__webglTexture,we.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let be=y.depthTexture;if(me.__boundDepthTexture!==be){if(be!==null&&we.has(be)&&(y.width!==be.image.width||y.height!==be.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");b.setupDepthRenderbuffer(y)}}let Ce=y.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(ne=!0);let Pe=we.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Pe[L])?D=Pe[L][F]:D=Pe[L],J=!0):y.samples>0&&b.useMultisampledRTT(y)===!1?D=we.get(y).__webglMultisampledFramebuffer:Array.isArray(Pe)?D=Pe[F]:D=Pe,R.copy(y.viewport),Y.copy(y.scissor),k=y.scissorTest}else R.copy(xe).multiplyScalar(V).floor(),Y.copy(Be).multiplyScalar(V).floor(),k=et;if(Me.bindFramebuffer(T.FRAMEBUFFER,D)&&B&&Me.drawBuffers(y,D),Me.viewport(R),Me.scissor(Y),Me.setScissorTest(k),J){let me=we.get(y.texture);T.framebufferTexture2D(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_CUBE_MAP_POSITIVE_X+L,me.__webglTexture,F)}else if(ne){let me=we.get(y.texture),Ce=L||0;T.framebufferTextureLayer(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,me.__webglTexture,F||0,Ce)}w=-1},this.readRenderTargetPixels=function(y,L,F,B,D,J,ne){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let he=we.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ne!==void 0&&(he=he[ne]),he){Me.bindFramebuffer(T.FRAMEBUFFER,he);try{let me=y.texture,Ce=me.format,Pe=me.type;if(!He.textureFormatReadable(Ce)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!He.textureTypeReadable(Pe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=y.width-B&&F>=0&&F<=y.height-D&&T.readPixels(L,F,B,D,Ue.convert(Ce),Ue.convert(Pe),J)}finally{let me=N!==null?we.get(N).__webglFramebuffer:null;Me.bindFramebuffer(T.FRAMEBUFFER,me)}}},this.readRenderTargetPixelsAsync=async function(y,L,F,B,D,J,ne){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let he=we.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ne!==void 0&&(he=he[ne]),he){let me=y.texture,Ce=me.format,Pe=me.type;if(!He.textureFormatReadable(Ce))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!He.textureTypeReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(L>=0&&L<=y.width-B&&F>=0&&F<=y.height-D){Me.bindFramebuffer(T.FRAMEBUFFER,he);let be=T.createBuffer();T.bindBuffer(T.PIXEL_PACK_BUFFER,be),T.bufferData(T.PIXEL_PACK_BUFFER,J.byteLength,T.STREAM_READ),T.readPixels(L,F,B,D,Ue.convert(Ce),Ue.convert(Pe),0);let Ye=N!==null?we.get(N).__webglFramebuffer:null;Me.bindFramebuffer(T.FRAMEBUFFER,Ye);let $e=T.fenceSync(T.SYNC_GPU_COMMANDS_COMPLETE,0);return T.flush(),await Dh(T,$e,4),T.bindBuffer(T.PIXEL_PACK_BUFFER,be),T.getBufferSubData(T.PIXEL_PACK_BUFFER,0,J),T.deleteBuffer(be),T.deleteSync($e),J}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(y,L=null,F=0){y.isTexture!==!0&&(Cn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),L=arguments[0]||null,y=arguments[1]);let B=Math.pow(2,-F),D=Math.floor(y.image.width*B),J=Math.floor(y.image.height*B),ne=L!==null?L.x:0,he=L!==null?L.y:0;b.setTexture2D(y,0),T.copyTexSubImage2D(T.TEXTURE_2D,F,0,0,ne,he,D,J),Me.unbindTexture()};let Tp=T.createFramebuffer(),Ap=T.createFramebuffer();this.copyTextureToTexture=function(y,L,F=null,B=null,D=0,J=null){y.isTexture!==!0&&(Cn("WebGLRenderer: copyTextureToTexture function signature has changed."),B=arguments[0]||null,y=arguments[1],L=arguments[2],J=arguments[3]||0,F=null),J===null&&(D!==0?(Cn("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),J=D,D=0):J=0);let ne,he,me,Ce,Pe,be,Ye,$e,dt,ct=y.isCompressedTexture?y.mipmaps[J]:y.image;if(F!==null)ne=F.max.x-F.min.x,he=F.max.y-F.min.y,me=F.isBox3?F.max.z-F.min.z:1,Ce=F.min.x,Pe=F.min.y,be=F.isBox3?F.min.z:0;else{let Kt=Math.pow(2,-D);ne=Math.floor(ct.width*Kt),he=Math.floor(ct.height*Kt),y.isDataArrayTexture?me=ct.depth:y.isData3DTexture?me=Math.floor(ct.depth*Kt):me=1,Ce=0,Pe=0,be=0}B!==null?(Ye=B.x,$e=B.y,dt=B.z):(Ye=0,$e=0,dt=0);let Ze=Ue.convert(L.format),Se=Ue.convert(L.type),bt;L.isData3DTexture?(b.setTexture3D(L,0),bt=T.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(b.setTexture2DArray(L,0),bt=T.TEXTURE_2D_ARRAY):(b.setTexture2D(L,0),bt=T.TEXTURE_2D),T.pixelStorei(T.UNPACK_FLIP_Y_WEBGL,L.flipY),T.pixelStorei(T.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),T.pixelStorei(T.UNPACK_ALIGNMENT,L.unpackAlignment);let Ke=T.getParameter(T.UNPACK_ROW_LENGTH),li=T.getParameter(T.UNPACK_IMAGE_HEIGHT),On=T.getParameter(T.UNPACK_SKIP_PIXELS),kt=T.getParameter(T.UNPACK_SKIP_ROWS),gs=T.getParameter(T.UNPACK_SKIP_IMAGES);T.pixelStorei(T.UNPACK_ROW_LENGTH,ct.width),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,ct.height),T.pixelStorei(T.UNPACK_SKIP_PIXELS,Ce),T.pixelStorei(T.UNPACK_SKIP_ROWS,Pe),T.pixelStorei(T.UNPACK_SKIP_IMAGES,be);let rt=y.isDataArrayTexture||y.isData3DTexture,$t=L.isDataArrayTexture||L.isData3DTexture;if(y.isDepthTexture){let Kt=we.get(y),It=we.get(L),Ot=we.get(Kt.__renderTarget),Ca=we.get(It.__renderTarget);Me.bindFramebuffer(T.READ_FRAMEBUFFER,Ot.__webglFramebuffer),Me.bindFramebuffer(T.DRAW_FRAMEBUFFER,Ca.__webglFramebuffer);for(let un=0;un<me;un++)rt&&(T.framebufferTextureLayer(T.READ_FRAMEBUFFER,T.COLOR_ATTACHMENT0,we.get(y).__webglTexture,D,be+un),T.framebufferTextureLayer(T.DRAW_FRAMEBUFFER,T.COLOR_ATTACHMENT0,we.get(L).__webglTexture,J,dt+un)),T.blitFramebuffer(Ce,Pe,ne,he,Ye,$e,ne,he,T.DEPTH_BUFFER_BIT,T.NEAREST);Me.bindFramebuffer(T.READ_FRAMEBUFFER,null),Me.bindFramebuffer(T.DRAW_FRAMEBUFFER,null)}else if(D!==0||y.isRenderTargetTexture||we.has(y)){let Kt=we.get(y),It=we.get(L);Me.bindFramebuffer(T.READ_FRAMEBUFFER,Tp),Me.bindFramebuffer(T.DRAW_FRAMEBUFFER,Ap);for(let Ot=0;Ot<me;Ot++)rt?T.framebufferTextureLayer(T.READ_FRAMEBUFFER,T.COLOR_ATTACHMENT0,Kt.__webglTexture,D,be+Ot):T.framebufferTexture2D(T.READ_FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_2D,Kt.__webglTexture,D),$t?T.framebufferTextureLayer(T.DRAW_FRAMEBUFFER,T.COLOR_ATTACHMENT0,It.__webglTexture,J,dt+Ot):T.framebufferTexture2D(T.DRAW_FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_2D,It.__webglTexture,J),D!==0?T.blitFramebuffer(Ce,Pe,ne,he,Ye,$e,ne,he,T.COLOR_BUFFER_BIT,T.NEAREST):$t?T.copyTexSubImage3D(bt,J,Ye,$e,dt+Ot,Ce,Pe,ne,he):T.copyTexSubImage2D(bt,J,Ye,$e,Ce,Pe,ne,he);Me.bindFramebuffer(T.READ_FRAMEBUFFER,null),Me.bindFramebuffer(T.DRAW_FRAMEBUFFER,null)}else $t?y.isDataTexture||y.isData3DTexture?T.texSubImage3D(bt,J,Ye,$e,dt,ne,he,me,Ze,Se,ct.data):L.isCompressedArrayTexture?T.compressedTexSubImage3D(bt,J,Ye,$e,dt,ne,he,me,Ze,ct.data):T.texSubImage3D(bt,J,Ye,$e,dt,ne,he,me,Ze,Se,ct):y.isDataTexture?T.texSubImage2D(T.TEXTURE_2D,J,Ye,$e,ne,he,Ze,Se,ct.data):y.isCompressedTexture?T.compressedTexSubImage2D(T.TEXTURE_2D,J,Ye,$e,ct.width,ct.height,Ze,ct.data):T.texSubImage2D(T.TEXTURE_2D,J,Ye,$e,ne,he,Ze,Se,ct);T.pixelStorei(T.UNPACK_ROW_LENGTH,Ke),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,li),T.pixelStorei(T.UNPACK_SKIP_PIXELS,On),T.pixelStorei(T.UNPACK_SKIP_ROWS,kt),T.pixelStorei(T.UNPACK_SKIP_IMAGES,gs),J===0&&L.generateMipmaps&&T.generateMipmap(bt),Me.unbindTexture()},this.copyTextureToTexture3D=function(y,L,F=null,B=null,D=0){return y.isTexture!==!0&&(Cn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),F=arguments[0]||null,B=arguments[1]||null,y=arguments[2],L=arguments[3],D=arguments[4]||0),Cn('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(y,L,F,B,D)},this.initRenderTarget=function(y){we.get(y).__webglFramebuffer===void 0&&b.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?b.setTextureCube(y,0):y.isData3DTexture?b.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?b.setTexture2DArray(y,0):b.setTexture2D(y,0),Me.unbindTexture()},this.resetState=function(){A=0,C=0,N=null,Me.reset(),it.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=ze._getDrawingBufferColorSpace(e),t.unpackColorSpace=ze._getUnpackColorSpace()}};var q_=Object.defineProperty,Ql=(i,e)=>{for(var t in e)q_(i,t,{get:e[t],enumerable:!0})},Gi={};Ql(Gi,{ACTIONS:()=>Tu,ANIMATION_MIN_DURATION:()=>Gl,CAPTURE_EVENTS_CLASS:()=>lr,CTRLZOOM_TIMEOUT:()=>Eu,DBLCLICK_DELAY:()=>wu,EASINGS:()=>aa,ICONS:()=>pi,IDS:()=>St,KEY_CODES:()=>Mt,LONGTOUCH_DELAY:()=>bu,MOVE_THRESHOLD:()=>Mu,SPHERE_RADIUS:()=>Un,TWOFINGERSOVERLAY_DELAY:()=>Su,VIEWER_DATA:()=>cn});var Z_=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 40 432 432"><g transform="rotate(0, 256, 256)"><path fill="currentColor" d="M425.23 210.55H227.39a5 5 0 01-3.53-8.53l56.56-56.57a45.5 45.5 0 000-64.28 45.15 45.15 0 00-32.13-13.3 45.15 45.15 0 00-32.14 13.3L41.32 256l174.83 174.83a45.15 45.15 0 0032.14 13.3 45.15 45.15 0 0032.13-13.3 45.5 45.5 0 000-64.28l-56.57-56.57a5 5 0 013.54-8.53h197.84c25.06 0 45.45-20.39 45.45-45.45s-20.4-45.45-45.45-45.45z"/></g><!-- Created by Flatart from the Noun Project --></svg>
`,$_='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="currentColor" transform=" translate(50, 50) rotate(45)"><rect x="-5" y="-65" width="10" height="130"/><rect x="-65" y="-5" width="130" height="10"/></g></svg>',K_=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="currentColor" d="M83.3 35.6h-17V3H32.2v32.6H16.6l33.6 32.7 33-32.7z"/><path fill="currentColor" d="M83.3 64.2v16.3H16.6V64.2H-.1v32.6H100V64.2H83.3z"/><!--Created by Michael Zenaty from the Noun Project--></svg>
`,J_=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="currentColor" d="M100 40H87.1V18.8h-21V6H100zM100 93.2H66V80.3h21.1v-21H100zM34 93.2H0v-34h12.9v21.1h21zM12.9 40H0V6h34v12.9H12.8z"/><!--Created by Garrett Knoll from the Noun Project--></svg>
`,j_=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="currentColor" d="M66 7h13v21h21v13H66zM66 60.3h34v12.9H79v21H66zM0 60.3h34v34H21V73.1H0zM21 7h13v34H0V28h21z"/><!--Created by Garrett Knoll from the Noun Project--></svg>
`,Q_=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="currentColor" d="M28.3 26.1c-1 2.6-1.9 4.8-2.6 7-2.5 7.4-5 14.7-7.2 22-1.3 4.4.5 7.2 4.3 7.8 1.3.2 2.8.2 4.2-.1 8.2-2 11.9-8.6 15.7-15.2l-2.2 2a18.8 18.8 0 0 1-7.4 5.2 2 2 0 0 1-1.6-.2c-.2-.1 0-1 0-1.4l.8-1.8L41.9 28c.5-1.4.9-3 .7-4.4-.2-2.6-3-4.4-6.3-4.4-8.8.2-15 4.5-19.5 11.8-.2.3-.2.6-.3 1.3 3.7-2.8 6.8-6.1 11.8-6.2z"/><circle fill="currentColor" cx="39.3" cy="9.2" r="8.2"/><!--Created by Arafat Uddin from the Noun Project--></svg>
`,ey=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 10 80 80"><g fill="currentColor"><circle r="10" cx="20" cy="20"/><circle r="10" cx="50" cy="20"/><circle r="10" cx="80" cy="20"/><circle r="10" cx="20" cy="50"/><circle r="10" cx="50" cy="50"/><circle r="10" cx="80" cy="50"/><circle r="10" cx="20" cy="80"/><circle r="10" cx="50" cy="80"/><circle r="10" cx="80" cy="80"/></g><!-- Created by Richard Kun\xE1k from the Noun Project--></svg>
`,ty=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M14.043 12.22a7.738 7.738 0 1 0-1.823 1.822l4.985 4.985c.503.504 1.32.504 1.822 0a1.285 1.285 0 0 0 0-1.822l-4.984-4.985zm-6.305 1.043a5.527 5.527 0 1 1 0-11.053 5.527 5.527 0 0 1 0 11.053z"/><path fill="currentColor" d="M8.728 4.009H6.744v2.737H4.006V8.73h2.738v2.736h1.984V8.73h2.737V6.746H8.728z"/><!--Created by Ryan Canning from the Noun Project--></svg>
`,iy=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M14.043 12.22a7.738 7.738 0 1 0-1.823 1.822l4.985 4.985c.503.504 1.32.504 1.822 0a1.285 1.285 0 0 0 0-1.822l-4.984-4.985zm-6.305 1.043a5.527 5.527 0 1 1 0-11.053 5.527 5.527 0 0 1 0 11.053z"/><path fill="currentColor" d="M4.006 6.746h7.459V8.73H4.006z"/><!--Created by Ryan Canning from the Noun Project--></svg>
`,Gl=500,Mu=4,wu=300,bu=500,Su=100,Eu=2e3,Un=10,cn="photoSphereViewer",lr="psv--capture-event",Tu=(i=>(i.ROTATE_UP="ROTATE_UP",i.ROTATE_DOWN="ROTATE_DOWN",i.ROTATE_RIGHT="ROTATE_RIGHT",i.ROTATE_LEFT="ROTATE_LEFT",i.ZOOM_IN="ZOOM_IN",i.ZOOM_OUT="ZOOM_OUT",i))(Tu||{}),St={MENU:"menu",TWO_FINGERS:"twoFingers",CTRL_ZOOM:"ctrlZoom",ERROR:"error",DESCRIPTION:"description"},Mt={Enter:"Enter",Control:"Control",Escape:"Escape",Space:" ",PageUp:"PageUp",PageDown:"PageDown",ArrowLeft:"ArrowLeft",ArrowUp:"ArrowUp",ArrowRight:"ArrowRight",ArrowDown:"ArrowDown",Delete:"Delete",Plus:"+",Minus:"-"},pi={arrow:Z_,close:$_,download:K_,fullscreenIn:J_,fullscreenOut:j_,info:Q_,menu:ey,zoomIn:ty,zoomOut:iy},aa={linear:i=>i,inQuad:i=>i*i,outQuad:i=>i*(2-i),inOutQuad:i=>i<.5?2*i*i:-1+(4-2*i)*i,inCubic:i=>i*i*i,outCubic:i=>--i*i*i+1,inOutCubic:i=>i<.5?4*i*i*i:(i-1)*(2*i-2)*(2*i-2)+1,inQuart:i=>i*i*i*i,outQuart:i=>1- --i*i*i*i,inOutQuart:i=>i<.5?8*i*i*i*i:1-8*--i*i*i*i,inQuint:i=>i*i*i*i*i,outQuint:i=>1+--i*i*i*i*i,inOutQuint:i=>i<.5?16*i*i*i*i*i:1+16*--i*i*i*i*i,inSine:i=>1-Math.cos(i*(Math.PI/2)),outSine:i=>Math.sin(i*(Math.PI/2)),inOutSine:i=>.5-.5*Math.cos(Math.PI*i),inExpo:i=>Math.pow(2,10*(i-1)),outExpo:i=>1-Math.pow(2,-10*i),inOutExpo:i=>(i=i*2-1)<0?.5*Math.pow(2,10*i):1-.5*Math.pow(2,-10*i),inCirc:i=>1-Math.sqrt(1-i*i),outCirc:i=>Math.sqrt(1-(i-1)*(i-1)),inOutCirc:i=>(i*=2)<1?.5-.5*Math.sqrt(1-i*i):.5+.5*Math.sqrt(1-(i-=2)*i)},ce={};Ql(ce,{Animation:()=>fa,Dynamic:()=>Ks,MultiDynamic:()=>$u,PressHandler:()=>ya,Slider:()=>Ju,SliderDirection:()=>Ku,addClasses:()=>ec,angle:()=>Cu,applyEulerInverse:()=>Zl,checkClosedShadowDom:()=>qu,checkStylesheet:()=>Yu,checkVersion:()=>rc,cleanCssPosition:()=>Wu,clone:()=>ga,createTexture:()=>ql,cssPositionIsOrdered:()=>sc,dasherize:()=>ay,deepEqual:()=>Vu,deepmerge:()=>ku,distance:()=>Au,exitFullscreen:()=>Fu,firstNonNull:()=>rn,getAbortError:()=>Xl,getAngle:()=>Pu,getClosest:()=>Lu,getConfigParser:()=>_a,getElement:()=>Iu,getEventTarget:()=>ca,getMatchingTarget:()=>Du,getPosition:()=>Uu,getShortestArc:()=>Ru,getStyleProperty:()=>Ei,getTouchData:()=>Wl,getXMPValue:()=>qt,greatArcDistance:()=>sy,hasParent:()=>oy,invertResolvableBoolean:()=>va,isAbortError:()=>Gu,isEmpty:()=>zu,isExtendedPosition:()=>nc,isFullscreenEnabled:()=>Nu,isNil:()=>wt,isPlainObject:()=>tc,logWarn:()=>Et,mergePanoData:()=>Zu,parseAngle:()=>Si,parsePoint:()=>ly,parseSpeed:()=>Xu,removeClasses:()=>ry,requestFullscreen:()=>Ou,resolveBoolean:()=>ic,speedToDuration:()=>Yl,sum:()=>ny,throttle:()=>Bu,toggleClass:()=>ma,wrap:()=>Js});function Js(i,e){let t=i%e;return t<0&&(t+=e),t}function ny(i){return i.reduce((e,t)=>e+t,0)}function Au(i,e){return Math.sqrt(Math.pow(i.x-e.x,2)+Math.pow(i.y-e.y,2))}function Cu(i,e){return Math.atan2(e.y-i.y,e.x-i.x)}function Ru(i,e){return[0,Math.PI*2,-Math.PI*2].reduce((n,s)=>{let r=e-i+s;return Math.abs(r)<Math.abs(n)?r:n},1/0)}function Pu(i,e){return Math.acos(Math.cos(i.pitch)*Math.cos(e.pitch)*Math.cos(i.yaw-e.yaw)+Math.sin(i.pitch)*Math.sin(e.pitch))}function sy([i,e],[t,n]){i-t>Math.PI?i-=2*Math.PI:i-t<-Math.PI&&(i+=2*Math.PI);let s=(t-i)*Math.cos((e+n)/2),r=n-e;return Math.sqrt(s*s+r*r)}function Iu(i){return typeof i=="string"?i.match(/^[a-z]/i)?document.getElementById(i):document.querySelector(i):i}function ma(i,e,t){t===void 0?i.classList.toggle(e):t?i.classList.add(e):t||i.classList.remove(e)}function ec(i,e){i.classList.add(...e.split(" ").filter(t=>!!t))}function ry(i,e){i.classList.remove(...e.split(" ").filter(t=>!!t))}function oy(i,e){let t=i;do{if(t===e)return!0;t=t.parentElement}while(t);return!1}function Lu(i,e){if(!i?.matches)return null;let t=i;do{if(t.matches(e))return t;t=t.parentElement}while(t);return null}function ca(i){return i?.composedPath()[0]||null}function Du(i,e){return i?i.composedPath().find(t=>!(t instanceof HTMLElement)&&!(t instanceof SVGElement)?!1:t.matches(e)):null}function Uu(i){let e=0,t=0,n=i;for(;n;)e+=n.offsetLeft-n.scrollLeft+n.clientLeft,t+=n.offsetTop-n.scrollTop+n.clientTop,n=n.offsetParent;return e-=window.scrollX,t-=window.scrollY,{x:e,y:t}}function Ei(i,e){return window.getComputedStyle(i).getPropertyValue(e)}function Wl(i){if(i.touches.length<2)return null;let e={x:i.touches[0].clientX,y:i.touches[0].clientY},t={x:i.touches[1].clientX,y:i.touches[1].clientY};return{distance:Au(e,t),angle:Cu(e,t),center:{x:(e.x+t.x)/2,y:(e.y+t.y)/2}}}var ha;function Nu(i,e=!1){return e?i===ha:document.fullscreenElement===i}function Ou(i,e=!1){e?(ha=i,i.classList.add("psv-fullscreen-emulation"),document.dispatchEvent(new Event("fullscreenchange"))):i.requestFullscreen()}function Fu(i=!1){i?(ha.classList.remove("psv-fullscreen-emulation"),ha=null,document.dispatchEvent(new Event("fullscreenchange"))):document.exitFullscreen()}function ay(i){return i.replace(/[A-Z](?:(?=[^A-Z])|[A-Z]*(?=[A-Z][^A-Z]|$))/g,(e,t)=>(t>0?"-":"")+e.toLowerCase())}function Bu(i,e){let t=!1;return function(...n){t||(t=!0,setTimeout(()=>{i.apply(this,n),t=!1},e))}}function tc(i){if(typeof i!="object"||i===null||Object.prototype.toString.call(i)!=="[object Object]")return!1;if(Object.getPrototypeOf(i)===null)return!0;let e=i;for(;Object.getPrototypeOf(e)!==null;)e=Object.getPrototypeOf(e);return Object.getPrototypeOf(i)===e}function ku(i,e){let t=e;return(function n(s,r){return Array.isArray(r)?(!s||!Array.isArray(s)?s=[]:s.length=0,r.forEach((o,a)=>{s[a]=n(null,o)})):typeof r=="object"?((!s||Array.isArray(s))&&(s={}),Object.keys(r).forEach(o=>{o!=="__proto__"&&(typeof r[o]!="object"||!r[o]||!tc(r[o])?s[o]=r[o]:r[o]!==t&&(s[o]?n(s[o],r[o]):s[o]=n(null,r[o])))})):s=r,s})(i,e)}function ga(i){return ku(null,i)}function zu(i){return!i||Object.keys(i).length===0&&i.constructor===Object}function wt(i){return i==null}function rn(...i){for(let e of i)if(!wt(e))return e;return null}function Vu(i,e){if(i===e)return!0;if(fu(i)&&fu(e)){if(Object.keys(i).length!==Object.keys(e).length)return!1;for(let t of Object.keys(i))if(!Vu(i[t],e[t]))return!1;return!0}else return!1}function fu(i){return typeof i=="object"&&i!==null}var ge=class Hu extends Error{constructor(e,t){super(t&&t instanceof Error?`${e}: ${t.message}`:e),this.name="PSVError",Error.captureStackTrace?.(this,Hu)}};function ic(i,e){tc(i)?(e(i.initial,!0),i.promise.then(t=>e(t,!1))):e(i,!0)}function va(i){return{initial:!i.initial,promise:i.promise.then(e=>!e)}}function Xl(){let i=new Error("Loading was aborted.");return i.name="AbortError",i}function Gu(i){return i?.name==="AbortError"}function Et(i){console.warn(`PhotoSphereViewer: ${i}`)}function nc(i){return!i||Array.isArray(i)?!1:[["textureX","textureY"],["yaw","pitch"]].some(([e,t])=>i[e]!==void 0&&i[t]!==void 0)}function qt(i,e,t=!0){let n=i.match("<GPano:"+e+">(.*)</GPano:"+e+">");if(n!==null){let s=t?parseInt(n[1],10):parseFloat(n[1]);return isNaN(s)?null:s}if(n=i.match("GPano:"+e+'="(.*?)"'),n!==null){let s=t?parseInt(n[1],10):parseFloat(n[1]);return isNaN(s)?null:s}return null}var pu={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},ua=["left","center","right"],da=["top","center","bottom"],mu=[...ua,...da],si="center";function ly(i){if(!i)return{x:.5,y:.5};if(typeof i=="object")return i;let e=i.toLocaleLowerCase().split(" ").slice(0,2);e.length===1&&(pu[e[0]]?e=[e[0],si]:e=[e[0],e[0]]);let t=e[1]!=="left"&&e[1]!=="right"&&e[0]!=="top"&&e[0]!=="bottom";e=e.map(s=>pu[s]||s),t||e.reverse();let n=e.join(" ").match(/^([0-9.]+)% ([0-9.]+)%$/);return n?{x:parseFloat(n[1])/100,y:parseFloat(n[2])/100}:{x:.5,y:.5}}function Wu(i,{allowCenter:e,cssOrder:t}={allowCenter:!0,cssOrder:!0}){return i?(typeof i=="string"&&(i=i.split(" ")),i.length===1&&(i[0]===si?i=[si,si]:ua.indexOf(i[0])!==-1?i=[si,i[0]]:da.indexOf(i[0])!==-1&&(i=[i[0],si])),i.length!==2||mu.indexOf(i[0])===-1||mu.indexOf(i[1])===-1?(Et(`Unparsable position ${i}`),null):!e&&i[0]===si&&i[1]===si?(Et("Invalid position center center"),null):(t&&!sc(i)&&(i=[i[1],i[0]]),i[1]===si&&ua.indexOf(i[0])!==-1&&(i=[si,i[0]]),i[0]===si&&da.indexOf(i[1])!==-1&&(i=[i[1],si]),i)):null}function sc(i){return da.indexOf(i[0])!==-1&&ua.indexOf(i[1])!==-1}function Xu(i){let e;if(typeof i=="string"){let t=i.toString().trim(),n=parseFloat(t.replace(/^(-?[0-9]+(?:\.[0-9]*)?).*$/,"$1")),s=t.replace(/^-?[0-9]+(?:\.[0-9]*)?(.*)$/,"$1").trim();switch(s.match(/(pm|per minute)$/)&&(n/=60),s){case"dpm":case"degrees per minute":case"dps":case"degrees per second":e=Re.degToRad(n);break;case"rdpm":case"radians per minute":case"rdps":case"radians per second":e=n;break;case"rpm":case"revolutions per minute":case"rps":case"revolutions per second":e=n*Math.PI*2;break;default:throw new ge(`Unknown speed unit "${s}"`)}}else e=i;return e}function Yl(i,e){if(typeof i!="number"){let t=Xu(i);return e/Math.abs(t)*1e3}else return Math.abs(i)}function Si(i,e=!1,t=e){let n;if(typeof i=="string"){let s=i.toLowerCase().trim().match(/^(-?[0-9]+(?:\.[0-9]*)?)(.*)$/);if(!s)throw new ge(`Unknown angle "${i}"`);let r=parseFloat(s[1]),o=s[2];if(o)switch(o){case"deg":case"degs":n=Re.degToRad(r);break;case"rad":case"rads":n=r;break;default:throw new ge(`Unknown angle unit "${o}"`)}else n=r}else if(typeof i=="number"&&!isNaN(i))n=i;else throw new ge(`Unknown angle "${i}"`);return n=Js(e?n+Math.PI:n,Math.PI*2),e?Re.clamp(n-Math.PI,-Math.PI/(t?2:1),Math.PI/(t?2:1)):n}function ql(i,e=!1){let t=new xt(i);return t.needsUpdate=!0,t.minFilter=e?xi:Dt,t.generateMipmaps=e,t.anisotropy=e?2:1,t}var gu=new Xt;function Zl(i,e){gu.setFromEuler(e).invert(),i.applyQuaternion(gu)}function _a(i,e){let t=function(n){let s=ga({...i,...n}),r={};for(let[o,a]of Object.entries(s)){if(e&&o in e)a=e[o](a,{rawConfig:s,defValue:i[o]});else if(!(o in i)){Et(`Unknown option ${o}`);continue}r[o]=a}return r};return t.defaults=i,t.parsers=e||{},t}function Yu(i,e){Ei(i,`--psv-${e}-loaded`)!=="true"&&console.error(`PhotoSphereViewer: stylesheet "@photo-sphere-viewer/${e}/index.css" is not loaded`)}function rc(i,e,t){e&&e!==t&&console.error(`PhotoSphereViewer: @photo-sphere-viewer/${i} is in version ${e} but @photo-sphere-viewer/core is in version ${t}`)}function qu(i){do{if(i instanceof ShadowRoot&&i.mode==="closed"){console.error("PhotoSphereViewer: closed shadow DOM detected, the viewer might not work as expected");return}i=i.parentNode}while(i)}function Zu(i,e,t,n){let s={isEquirectangular:!0,fullWidth:rn(t?.fullWidth,n?.fullWidth),fullHeight:rn(t?.fullHeight,n?.fullHeight),croppedWidth:i,croppedHeight:e,croppedX:rn(t?.croppedX,n?.croppedX),croppedY:rn(t?.croppedY,n?.croppedY),poseHeading:rn(t?.poseHeading,n?.poseHeading,0),posePitch:rn(t?.posePitch,n?.posePitch,0),poseRoll:rn(t?.poseRoll,n?.poseRoll,0),initialHeading:n?.initialHeading,initialPitch:n?.initialPitch,initialFov:n?.initialFov};return!s.fullWidth&&!s.fullHeight&&(s.fullWidth=Math.max(i,e*2),s.fullHeight=Math.round(s.fullWidth/2)),s.fullWidth||(s.fullWidth=s.fullHeight*2),s.fullHeight||(s.fullHeight=Math.round(s.fullWidth/2)),s.croppedX===null&&(s.croppedX=Math.round((s.fullWidth-i)/2)),s.croppedY===null&&(s.croppedY=Math.round((s.fullHeight-e)/2)),Math.abs(s.fullWidth-s.fullHeight*2)>1&&(Et("Invalid panoData, fullWidth should be twice fullHeight"),s.fullHeight=Math.round(s.fullWidth/2)),s.croppedX+s.croppedWidth>s.fullWidth&&(Et("Invalid panoData, croppedX + croppedWidth > fullWidth"),s.croppedX=s.fullWidth-s.croppedWidth),s.croppedY+s.croppedHeight>s.fullHeight&&(Et("Invalid panoData, croppedY + croppedHeight > fullHeight"),s.croppedY=s.fullHeight-s.croppedHeight),s.croppedX<0&&(Et("Invalid panoData, croppedX < 0"),s.croppedX=0),s.croppedY<0&&(Et("Invalid panoData, croppedY < 0"),s.croppedY=0),s}var fa=class{constructor(i){this.easing=aa.linear,this.callbacks=[],this.resolved=!1,this.cancelled=!1,this.options=i,i?(i.easing&&(this.easing=typeof i.easing=="function"?i.easing:aa[i.easing]||aa.linear),this.delayTimeout=setTimeout(()=>{this.delayTimeout=void 0,this.animationFrame=window.requestAnimationFrame(e=>this.__run(e))},i.delay||0)):this.resolved=!0}__run(i){if(this.cancelled)return;this.start||(this.start=i);let e=(i-this.start)/this.options.duration,t={};if(e<1){for(let[n,s]of Object.entries(this.options.properties))if(s){let r=s.start+(s.end-s.start)*this.easing(e);t[n]=r}this.options.onTick(t,e),this.animationFrame=window.requestAnimationFrame(n=>this.__run(n))}else{for(let[n,s]of Object.entries(this.options.properties))s&&(t[n]=s.end);this.options.onTick(t,1),this.__resolve(!0),this.animationFrame=void 0}}__resolve(i){i?this.resolved=!0:this.cancelled=!0,this.callbacks.forEach(e=>e(i)),this.callbacks.length=0}then(i){return this.resolved||this.cancelled?Promise.resolve(this.resolved).then(i):new Promise(e=>{this.callbacks.push(e)}).then(i)}cancel(){!this.cancelled&&!this.resolved&&(this.__resolve(!1),this.delayTimeout&&(window.clearTimeout(this.delayTimeout),this.delayTimeout=void 0),this.animationFrame&&(window.cancelAnimationFrame(this.animationFrame),this.animationFrame=void 0))}},Ks=class{constructor(i,e){if(this.fn=i,this.mode=0,this.speed=0,this.speedMult=0,this.currentSpeed=0,this.target=0,this.__current=0,this.min=e.min,this.max=e.max,this.wrap=e.wrap,this.current=e.defaultValue,this.wrap&&this.min!==0)throw new ge("invalid config");this.fn&&this.fn(this.current)}get current(){return this.__current}set current(i){this.__current=i}setSpeed(i){this.speed=i}goto(i,e=1){this.mode=2,this.target=this.wrap?Js(i,this.max):Re.clamp(i,this.min,this.max),this.speedMult=e}step(i,e=1){e===0?this.setValue(this.current+i):(this.mode!==2&&(this.target=this.current),this.goto(this.target+i,e))}roll(i=!1,e=1){this.mode=1,this.target=i?-1/0:1/0,this.speedMult=e}stop(){this.mode=0}setValue(i){return this.target=this.wrap?Js(i,this.max):Re.clamp(i,this.min,this.max),this.mode=0,this.currentSpeed=0,this.target!==this.current?(this.current=this.target,this.fn&&this.fn(this.current),!0):!1}update(i){if(this.mode===2){this.wrap&&Math.abs(this.target-this.current)>this.max/2&&(this.current=this.current<this.target?this.current+this.max:this.current-this.max);let n=this.currentSpeed*this.currentSpeed/(this.speed*this.speedMult*4);Math.abs(this.target-this.current)<=n&&(this.mode=0)}let e=this.mode===0?0:this.speed*this.speedMult;this.target<this.current&&(e=-e),this.currentSpeed<e?this.currentSpeed=Math.min(e,this.currentSpeed+i/1e3*this.speed*this.speedMult*2):this.currentSpeed>e&&(this.currentSpeed=Math.max(e,this.currentSpeed-i/1e3*this.speed*this.speedMult*2));let t=null;return this.current>this.target&&this.currentSpeed?t=Math.max(this.target,this.current+this.currentSpeed*i/1e3):this.current<this.target&&this.currentSpeed&&(t=Math.min(this.target,this.current+this.currentSpeed*i/1e3)),t!==null&&(t=this.wrap?Js(t,this.max):Re.clamp(t,this.min,this.max),t!==this.current)?(this.current=t,this.fn&&this.fn(this.current),!0):!1}},$u=class{constructor(i,e){this.fn=i,this.dynamics=e,this.fn&&this.fn(this.current)}get current(){return Object.entries(this.dynamics).reduce((i,[e,t])=>(i[e]=t.current,i),{})}setSpeed(i){for(let e of Object.values(this.dynamics))e.setSpeed(i)}goto(i,e=1){for(let[t,n]of Object.entries(i))this.dynamics[t].goto(n,e)}step(i,e=1){if(e===0)this.setValue(Object.keys(i).reduce((t,n)=>(t[n]=i[n]+this.dynamics[n].current,t),{}));else for(let[t,n]of Object.entries(i))this.dynamics[t].step(n,e)}roll(i,e=1){for(let[t,n]of Object.entries(i))this.dynamics[t].roll(n,e)}stop(){for(let i of Object.values(this.dynamics))i.stop()}setValue(i){let e=!1;for(let[t,n]of Object.entries(i))e=this.dynamics[t].setValue(n)||e;return e&&this.fn&&this.fn(this.current),e}update(i){let e=!1;for(let t of Object.values(this.dynamics))e=t.update(i)||e;return e&&this.fn&&this.fn(this.current),e}},ya=class{constructor(i=200){this.delay=i,this.time=0,this.delay=i}get pending(){return this.time!==0}down(i){this.timeout&&(clearTimeout(this.timeout),this.timeout=void 0),this.time=new Date().getTime(),this.data=i}up(i){if(!this.time)return;Date.now()-this.time<this.delay?this.timeout=setTimeout(()=>{i(this.data),this.timeout=void 0,this.time=0,this.data=void 0},this.delay):(i(this.data),this.time=0,this.data=void 0)}},Ku=(i=>(i.VERTICAL="VERTICAL",i.HORIZONTAL="HORIZONTAL",i))(Ku||{}),Ju=class{constructor(i,e,t){this.container=i,this.direction=e,this.listener=t,this.mousedown=!1,this.mouseover=!1,this.container.addEventListener("click",this),this.container.addEventListener("mousedown",this),this.container.addEventListener("mouseenter",this),this.container.addEventListener("mouseleave",this),this.container.addEventListener("touchstart",this),this.container.addEventListener("mousemove",this,!0),this.container.addEventListener("touchmove",this,!0),window.addEventListener("mouseup",this),window.addEventListener("touchend",this)}get isVertical(){return this.direction==="VERTICAL"}get isHorizontal(){return this.direction==="HORIZONTAL"}destroy(){window.removeEventListener("mouseup",this),window.removeEventListener("touchend",this)}handleEvent(i){switch(i.type){case"click":i.stopPropagation();break;case"mousedown":this.__onMouseDown(i);break;case"mouseenter":this.__onMouseEnter(i);break;case"mouseleave":this.__onMouseLeave(i);break;case"touchstart":this.__onTouchStart(i);break;case"mousemove":this.__onMouseMove(i);break;case"touchmove":this.__onTouchMove(i);break;case"mouseup":this.__onMouseUp(i);break;case"touchend":this.__onTouchEnd(i);break}}__onMouseDown(i){this.mousedown=!0,this.__update(i.clientX,i.clientY,!0)}__onMouseEnter(i){this.mouseover=!0,this.__update(i.clientX,i.clientY,!0)}__onTouchStart(i){this.mouseover=!0,this.mousedown=!0;let e=i.changedTouches[0];this.__update(e.clientX,e.clientY,!0)}__onMouseMove(i){(this.mousedown||this.mouseover)&&(i.stopPropagation(),this.__update(i.clientX,i.clientY,!0))}__onTouchMove(i){if(this.mousedown||this.mouseover){i.stopPropagation();let e=i.changedTouches[0];this.__update(e.clientX,e.clientY,!0)}}__onMouseUp(i){this.mousedown&&(this.mousedown=!1,this.__update(i.clientX,i.clientY,!1))}__onMouseLeave(i){this.mouseover&&(this.mouseover=!1,this.__update(i.clientX,i.clientY,!0))}__onTouchEnd(i){if(this.mousedown){this.mouseover=!1,this.mousedown=!1;let e=i.changedTouches[0];this.__update(e.clientX,e.clientY,!1)}}__update(i,e,t){let n=this.container.getBoundingClientRect(),s;this.isVertical?s=Re.clamp((n.bottom-e)/n.height,0,1):s=Re.clamp((i-n.left)/n.width,0,1),this.listener({value:s,click:!t,mousedown:this.mousedown,mouseover:this.mouseover,cursor:{clientX:i,clientY:e}})}},ye={};Ql(ye,{BeforeAnimateEvent:()=>oc,BeforeRenderEvent:()=>js,BeforeRotateEvent:()=>rd,ClickEvent:()=>ld,ConfigChangedEvent:()=>Bt,DoubleClickEvent:()=>fd,FullscreenEvent:()=>Qs,HideNotificationEvent:()=>er,HideOverlayEvent:()=>xd,HidePanelEvent:()=>on,HideTooltipEvent:()=>Ed,KeypressEvent:()=>an,LoadProgressEvent:()=>Pd,ObjectEnterEvent:()=>gf,ObjectEvent:()=>xa,ObjectHoverEvent:()=>Mf,ObjectLeaveEvent:()=>$l,PanoramaErrorEvent:()=>Bd,PanoramaLoadEvent:()=>Dd,PanoramaLoadedEvent:()=>hs,PositionUpdatedEvent:()=>tr,ReadyEvent:()=>nr,RenderEvent:()=>Kd,RollUpdatedEvent:()=>ir,ShowNotificationEvent:()=>sr,ShowOverlayEvent:()=>tf,ShowPanelEvent:()=>ln,ShowTooltipEvent:()=>af,SizeUpdatedEvent:()=>rr,StopAllEvent:()=>or,TransitionDoneEvent:()=>Vd,ViewerEvent:()=>Je,ZoomUpdatedEvent:()=>Hi});var cr=class extends Event{constructor(i,e=!1){super(i,{cancelable:e})}},ju=class extends EventTarget{dispatchEvent(i){return super.dispatchEvent(i)}addEventListener(i,e,t){super.addEventListener(i,e,t)}removeEventListener(i,e,t){super.removeEventListener(i,e,t)}},Je=class extends cr{},Qu=class ed extends Je{constructor(e,t){super(ed.type,!0),this.position=e,this.zoomLevel=t}};Qu.type="before-animate";var oc=Qu,td=class id extends Je{constructor(e,t){super(id.type),this.timestamp=e,this.elapsed=t}};td.type="before-render";var js=td,nd=class sd extends Je{constructor(e){super(sd.type,!0),this.position=e}};nd.type="before-rotate";var rd=nd,od=class ad extends Je{constructor(e){super(ad.type),this.data=e}};od.type="click";var ld=od,cd=class hd extends Je{constructor(e){super(hd.type),this.options=e}containsOptions(...e){return e.some(t=>this.options.includes(t))}};cd.type="config-changed";var Bt=cd,ud=class dd extends Je{constructor(e){super(dd.type),this.data=e}};ud.type="dblclick";var fd=ud,pd=class md extends Je{constructor(e){super(md.type),this.fullscreenEnabled=e}};pd.type="fullscreen";var Qs=pd,gd=class vd extends Je{constructor(e){super(vd.type),this.notificationId=e}};gd.type="hide-notification";var er=gd,_d=class yd extends Je{constructor(e){super(yd.type),this.overlayId=e}};_d.type="hide-overlay";var xd=_d,Md=class wd extends Je{constructor(e){super(wd.type),this.panelId=e}};Md.type="hide-panel";var on=Md,bd=class Sd extends Je{constructor(e){super(Sd.type),this.tooltipData=e}};bd.type="hide-tooltip";var Ed=bd,Td=class Ad extends Je{constructor(e,t){super(Ad.type,!0),this.key=e,this.originalEvent=t}};Td.type="key-press";var an=Td,Cd=class Rd extends Je{constructor(e){super(Rd.type),this.progress=e}};Cd.type="load-progress";var Pd=Cd,Id=class Ld extends Je{constructor(e){super(Ld.type),this.panorama=e}};Id.type="panorama-load";var Dd=Id,Ud=class Nd extends Je{constructor(e){super(Nd.type),this.data=e}};Ud.type="panorama-loaded";var hs=Ud,Od=class Fd extends Je{constructor(e,t){super(Fd.type),this.panorama=e,this.error=t}};Od.type="panorama-error";var Bd=Od,kd=class zd extends Je{constructor(e){super(zd.type),this.completed=e}};kd.type="transition-done";var Vd=kd,Hd=class Gd extends Je{constructor(e){super(Gd.type),this.position=e}};Hd.type="position-updated";var tr=Hd,Wd=class Xd extends Je{constructor(e){super(Xd.type),this.roll=e}};Wd.type="roll-updated";var ir=Wd,Yd=class qd extends Je{constructor(){super(qd.type)}};Yd.type="ready";var nr=Yd,Zd=class $d extends Je{constructor(){super($d.type)}};Zd.type="render";var Kd=Zd,Jd=class jd extends Je{constructor(e){super(jd.type),this.notificationId=e}};Jd.type="show-notification";var sr=Jd,Qd=class ef extends Je{constructor(e){super(ef.type),this.overlayId=e}};Qd.type="show-overlay";var tf=Qd,nf=class sf extends Je{constructor(e){super(sf.type),this.panelId=e}};nf.type="show-panel";var ln=nf,rf=class of extends Je{constructor(e,t){super(of.type),this.tooltip=e,this.tooltipData=t}};rf.type="show-tooltip";var af=rf,lf=class cf extends Je{constructor(e){super(cf.type),this.size=e}};lf.type="size-updated";var rr=lf,hf=class uf extends Je{constructor(){super(uf.type)}};hf.type="stop-all";var or=hf,df=class ff extends Je{constructor(e){super(ff.type),this.zoomLevel=e}};df.type="zoom-updated";var Hi=df,xa=class extends Je{constructor(i,e,t,n,s){super(i),this.originalEvent=e,this.object=t,this.viewerPoint=n,this.userDataKey=s}},pf=class mf extends xa{constructor(e,t,n,s){super(mf.type,e,t,n,s)}};pf.type="enter-object";var gf=pf,vf=class _f extends xa{constructor(e,t,n,s){super(_f.type,e,t,n,s)}};vf.type="leave-object";var $l=vf,yf=class xf extends xa{constructor(e,t,n,s){super(xf.type,e,t,n,s)}};yf.type="hover-object";var Mf=yf,ac=class{constructor(i){this.viewer=i}init(){}destroy(){}supportsTransition(i){return!1}supportsPreload(i){return!1}textureCoordsToSphericalCoords(i,e){throw new ge("Current adapter does not support texture coordinates.")}sphericalCoordsToTextureCoords(i,e){throw new ge("Current adapter does not support texture coordinates.")}};ac.supportsDownload=!1;function vu(i){if(i){for(let[,e]of[["_",i],...Object.entries(i)])if(e.prototype instanceof ac)return rc(e.id,e.VERSION,"5.13.3"),e}return null}var $s=`${cn}_touchSupport`,Nt={loaded:!1,pixelRatio:1,isWebGLSupported:!1,maxTextureWidth:0,isTouchEnabled:null,__maxCanvasWidth:null,isIphone:!1,get maxCanvasWidth(){return this.__maxCanvasWidth===null&&(this.__maxCanvasWidth=uy(this.maxTextureWidth)),this.__maxCanvasWidth},load(){if(!this.loaded){let i=cy();this.pixelRatio=window.devicePixelRatio||1,this.isWebGLSupported=!!i,this.maxTextureWidth=i?i.getParameter(i.MAX_TEXTURE_SIZE):0,this.isTouchEnabled=hy(),this.isIphone=/iPhone/i.test(navigator.userAgent),this.loaded=!0}if(!Nt.isWebGLSupported)throw new ge("WebGL 2 is not supported.");if(Nt.maxTextureWidth===0)throw new ge("Unable to detect system capabilities")}};function cy(){try{return document.createElement("canvas").getContext("webgl2")}catch{return null}}function hy(){let i="ontouchstart"in window||navigator.maxTouchPoints>0;$s in localStorage&&(i=localStorage[$s]==="true");let e=new Promise(t=>{let n=()=>{window.removeEventListener("mousedown",s),window.removeEventListener("touchstart",r),clearTimeout(a)},s=()=>{n(),localStorage[$s]=!1,t(!1)},r=()=>{n(),localStorage[$s]=!0,t(!0)},o=()=>{n(),localStorage[$s]=i,t(i)};window.addEventListener("mousedown",s,!1),window.addEventListener("touchstart",r,!1);let a=setTimeout(o,1e4)});return{initial:i,promise:e}}function uy(i){let e=i,t=!1,n=document.createElement("canvas"),s=n.getContext("2d");for(n.width=1,n.height=1;e>1024&&!t;){let r=document.createElement("canvas"),o=r.getContext("2d");r.width=e,r.height=e/2;try{o.fillStyle="white",o.fillRect(e-1,e/2-1,1,1),s.drawImage(r,e-1,e/2-1,1,1,0,0,1,1),s.getImageData(0,0,1,1).data[0]>0&&(t=!0)}catch{}r.width=0,r.height=0,t||(e/=2)}if(t)return e;throw new ge("Unable to detect system capabilities")}var dy=_a({resolution:64,useXmpData:!0,blur:!1},{resolution:i=>{if(!i||!Re.isPowerOfTwo(i))throw new ge("EquirectangularAdapter resolution must be power of two.");return i}}),hr=class extends ac{constructor(i,e){super(i),this.config=dy(e),this.SPHERE_SEGMENTS=this.config.resolution,this.SPHERE_HORIZONTAL_SEGMENTS=this.SPHERE_SEGMENTS/2}supportsTransition(){return!0}supportsPreload(){return!0}textureCoordsToSphericalCoords(i,e){if(wt(i.textureX)||wt(i.textureY))throw new ge("Texture position is missing 'textureX' or 'textureY'");let t=(i.textureX+e.croppedX)/e.fullWidth*Math.PI*2,n=(i.textureY+e.croppedY)/e.fullHeight*Math.PI;return{yaw:t>=Math.PI?t-Math.PI:t+Math.PI,pitch:Math.PI/2-n}}sphericalCoordsToTextureCoords(i,e){let t=i.yaw/Math.PI/2*e.fullWidth,n=i.pitch/Math.PI*e.fullHeight,s=Math.round(i.yaw<Math.PI?t+e.fullWidth/2:t-e.fullWidth/2)-e.croppedX,r=Math.round(e.fullHeight/2-n)-e.croppedY;return(s<0||s>e.croppedWidth||r<0||r>e.croppedHeight)&&(s=r=void 0),{textureX:s,textureY:r}}async loadTexture(i,e=!0,t,n=this.config.useXmpData){if(typeof i!="string"&&(typeof i!="object"||!i.path))return Promise.reject(new ge("Invalid panorama url, are you using the right adapter?"));let s;typeof i=="string"?s={path:i,data:t}:s={data:t,...i};let r=await this.viewer.textureLoader.loadFile(s.path,e?h=>this.viewer.textureLoader.dispatchProgress(h):null,s.path),o=n?await this.loadXMP(r):null,a=await this.viewer.textureLoader.blobToImage(r);typeof s.data=="function"&&(s.data=s.data(a,o));let l=Zu(a.width,a.height,s.data,o),c=this.createEquirectangularTexture(a);return{panorama:i,texture:c,panoData:l,cacheKey:s.path}}async loadXMP(i){let e=await this.loadBlobAsString(i),t=e.indexOf("<x:xmpmeta");if(t===-1)return null;let n=e.indexOf("</x:xmpmeta>",t);if(n===-1)return null;let s=e.substring(t,n);return s.includes("GPano:")?{fullWidth:qt(s,"FullPanoWidthPixels"),fullHeight:qt(s,"FullPanoHeightPixels"),croppedWidth:qt(s,"CroppedAreaImageWidthPixels"),croppedHeight:qt(s,"CroppedAreaImageHeightPixels"),croppedX:qt(s,"CroppedAreaLeftPixels"),croppedY:qt(s,"CroppedAreaTopPixels"),poseHeading:qt(s,"PoseHeadingDegrees",!1),posePitch:qt(s,"PosePitchDegrees",!1),poseRoll:qt(s,"PoseRollDegrees",!1),initialHeading:qt(s,"InitialViewHeadingDegrees",!1),initialPitch:qt(s,"InitialViewPitchDegrees",!1),initialFov:qt(s,"InitialHorizontalFOVDegrees",!1)}:null}loadBlobAsString(i){return new Promise((e,t)=>{let n=new FileReader;n.onload=()=>e(n.result),n.onerror=t,n.readAsText(i)})}createEquirectangularTexture(i){if(this.config.blur||i.width>Nt.maxTextureWidth){let e=Math.min(1,Nt.maxCanvasWidth/i.width),t=new OffscreenCanvas(Math.floor(i.width*e),Math.floor(i.height*e)),n=t.getContext("2d");return this.config.blur&&(n.filter=`blur(${t.width/2048}px)`),n.drawImage(i,0,0,t.width,t.height),ql(t)}return ql(i)}createMesh(i){let e=i.croppedX/i.fullWidth*2*Math.PI,t=i.croppedWidth/i.fullWidth*2*Math.PI,n=i.croppedY/i.fullHeight*Math.PI,s=i.croppedHeight/i.fullHeight*Math.PI,r=new Bi(Un,Math.round(this.SPHERE_SEGMENTS/(2*Math.PI)*t),Math.round(this.SPHERE_HORIZONTAL_SEGMENTS/Math.PI*s),-Math.PI/2+e,t,n,s).scale(-1,1,1),o=new di({depthTest:!1,depthWrite:!1});return new pt(r,o)}setTexture(i,e){i.material.map=e.texture}setTextureOpacity(i,e){i.material.opacity=e,i.material.transparent=e<1}disposeTexture({texture:i}){i.dispose()}disposeMesh(i){i.geometry.dispose(),i.material.dispose()}};hr.id="equirectangular";hr.VERSION="5.13.3";hr.supportsDownload=!0;var wf=class extends hr{constructor(i,e){super(i,{resolution:e?.resolution??64,useXmpData:!1})}async loadTexture(i,e){let t=await super.loadTexture(i,e,null,!1);return t.panoData=null,t}createMesh(){let i=new Bi(Un,this.SPHERE_SEGMENTS,this.SPHERE_HORIZONTAL_SEGMENTS).scale(-1,1,1).toNonIndexed(),e=i.getAttribute("uv"),t=i.getAttribute("normal");for(let s=0;s<e.count;s++)for(let r=0;r<3;r++){let o=s*3+r,a=t.getX(o),l=t.getY(o),c=t.getZ(o),h=.947;if(s<e.count/6){let f=a===0&&c===0?1:Math.acos(l)/Math.sqrt(a*a+c*c)*(2/Math.PI);e.setXY(o,a*(h/4)*f+1/4,c*(h/2)*f+1/2)}else{let f=a===0&&c===0?1:Math.acos(-l)/Math.sqrt(a*a+c*c)*(2/Math.PI);e.setXY(o,-a*(h/4)*f+3/4,c*(h/2)*f+1/2)}}i.rotateX(-Math.PI/2),i.rotateY(Math.PI);let n=new di({depthTest:!1,depthWrite:!1});return new pt(i,n)}};wf.id="dual-fisheye";wf.VERSION="5.13.3";var Nn=class bf{constructor(e,t){this.parent=e,this.children=[],this.state={visible:!0},this.viewer=e instanceof bf?e.viewer:e,this.container=document.createElement(t.tagName??"div"),this.container.className=t.className||"",this.parent.children.push(this),this.parent.container.appendChild(this.container)}destroy(){this.parent.container.removeChild(this.container);let e=this.parent.children.indexOf(this);e!==-1&&this.parent.children.splice(e,1),this.children.slice().forEach(t=>t.destroy()),this.children.length=0}toggle(e=!this.isVisible()){e?this.show():this.hide()}hide(e){this.container.style.display="none",this.state.visible=!1}show(e){this.container.style.display="",this.state.visible=!0}isVisible(){return this.state.visible}},fy=_a({id:null,tagName:null,className:null,title:null,hoverScale:!1,collapsable:!1,tabbable:!0,icon:null,iconActive:null}),_t=class extends Nn{constructor(i,e){super(i,{tagName:e.tagName,className:`psv-button ${e.hoverScale?"psv-button--hover-scale":""} ${e.className||""}`}),this.state={visible:!0,enabled:!0,supported:!0,collapsed:!1,active:!1,width:0},this.config=fy(e),e.id||(this.config.id=this.constructor.id),e.icon&&this.__setIcon(e.icon),this.state.width=this.container.offsetWidth,this.config.title?this.container.title=this.viewer.config.lang[this.config.title]??this.config.title:this.id&&this.id in this.viewer.config.lang&&(this.container.title=this.viewer.config.lang[this.id]),e.tabbable&&(this.container.tabIndex=0),this.container.addEventListener("click",t=>{this.state.enabled&&this.onClick(),t.stopPropagation()}),this.container.addEventListener("keydown",t=>{t.key===Mt.Enter&&this.state.enabled&&(this.onClick(),t.stopPropagation())})}get id(){return this.config.id}get title(){return this.container.title}get content(){return this.container.innerHTML}get width(){return this.state.width}get collapsable(){return this.config.collapsable}show(i=!0){this.isVisible()||(this.state.visible=!0,this.state.collapsed||(this.container.style.display=""),i&&this.viewer.navbar.autoSize())}hide(i=!0){this.isVisible()&&(this.state.visible=!1,this.container.style.display="none",i&&this.viewer.navbar.autoSize())}checkSupported(){ic(this.isSupported(),(i,e)=>{this.state&&(this.state.supported=i,e?i||this.hide():this.toggle(i))})}autoSize(){}isSupported(){return!0}toggleActive(i=!this.state.active){i!==this.state.active&&(this.state.active=i,ma(this.container,"psv-button--active",this.state.active),this.config.iconActive&&this.__setIcon(this.state.active?this.config.iconActive:this.config.icon))}disable(){this.container.classList.add("psv-button--disabled"),this.state.enabled=!1}enable(){this.container.classList.remove("psv-button--disabled"),this.state.enabled=!0}collapse(){this.state.collapsed=!0,this.container.style.display="none"}uncollapse(){this.state.collapsed=!1,this.state.visible&&(this.container.style.display="")}__setIcon(i){this.container.innerHTML=i,ec(this.container.querySelector("svg"),"psv-button-svg")}},py=class extends _t{constructor(i,e){super(i,{id:e.id??`psvButton-${Math.random().toString(36).substring(2)}`,className:`psv-custom-button ${e.className||""}`,hoverScale:!1,collapsable:e.collapsable!==!1,tabbable:e.tabbable!==!1,title:e.title}),this.customOnClick=e.onClick,e.content&&(typeof e.content=="string"?this.container.innerHTML=e.content:(this.container.classList.add("psv-custom-button--no-padding"),e.content.style.height="100%",e.content.attachViewer?.(this.viewer),this.container.appendChild(e.content))),this.state.width=this.container.offsetWidth,e.disabled&&this.disable(),e.visible===!1&&this.hide()}onClick(){this.customOnClick?.(this.viewer)}},ar=class extends _t{constructor(i){super(i,{className:"psv-description-button",hoverScale:!0,collapsable:!1,tabbable:!0,icon:pi.info}),this.mode=0,this.viewer.addEventListener(er.type,this),this.viewer.addEventListener(sr.type,this),this.viewer.addEventListener(on.type,this),this.viewer.addEventListener(ln.type,this),this.viewer.addEventListener(Bt.type,this)}destroy(){this.viewer.removeEventListener(er.type,this),this.viewer.removeEventListener(sr.type,this),this.viewer.removeEventListener(on.type,this),this.viewer.removeEventListener(ln.type,this),this.viewer.removeEventListener(Bt.type,this),super.destroy()}handleEvent(i){if(i instanceof Bt){i.containsOptions("description")&&this.autoSize(!0);return}if(!this.mode)return;let e=!1;i instanceof er?e=this.mode===1:i instanceof sr?e=this.mode===1&&i.notificationId!==St.DESCRIPTION:i instanceof on?e=this.mode===2:i instanceof ln&&(e=this.mode===2&&i.panelId!==St.DESCRIPTION),e&&(this.toggleActive(!1),this.mode=0)}onClick(){this.mode?this.__close():this.__open()}hide(i){super.hide(i),this.mode&&this.__close()}autoSize(i=!1){if(i){let e=this.viewer.navbar.getButton("caption",!1),t=e&&!e.isVisible(),n=!!this.viewer.config.description;t||n?this.show(!1):this.hide(!1)}}__close(){switch(this.mode){case 1:this.viewer.notification.hide(St.DESCRIPTION);break;case 2:this.viewer.panel.hide(St.DESCRIPTION);break;default:}}__open(){this.toggleActive(!0),this.viewer.config.description?(this.mode=2,this.viewer.panel.show({id:St.DESCRIPTION,content:`${this.viewer.config.caption?`<p>${this.viewer.config.caption}</p>`:""}${this.viewer.config.description}`})):(this.mode=1,this.viewer.notification.show({id:St.DESCRIPTION,content:this.viewer.config.caption}))}};ar.id="description";var Sf=class extends _t{constructor(i){super(i,{tagName:"a",className:"psv-download-button",hoverScale:!0,collapsable:!0,tabbable:!0,icon:pi.download}),this.viewer.addEventListener(Bt.type,this),this.viewer.addEventListener(hs.type,this)}destroy(){this.viewer.removeEventListener(Bt.type,this),this.viewer.removeEventListener(hs.type,this),super.destroy()}handleEvent(i){i instanceof Bt?(i.containsOptions("downloadUrl")&&this.checkSupported(),i.containsOptions("downloadUrl","downloadName")&&this.__update()):i instanceof hs&&this.__update()}onClick(){}checkSupported(){this.viewer.adapter.constructor.supportsDownload||this.viewer.config.downloadUrl?this.show():this.hide()}__update(){let i=this.container;i.href=this.viewer.config.downloadUrl||this.viewer.config.panorama,i.target="_blank",i.href.startsWith("data:")&&!this.viewer.config.downloadName?i.download="panorama."+i.href.substring(0,i.href.indexOf(";")).split("/").pop():i.download=this.viewer.config.downloadName||i.href.split("/").pop()}};Sf.id="download";var Ef=class extends _t{constructor(i){super(i,{className:"psv-fullscreen-button",hoverScale:!0,collapsable:!1,tabbable:!0,icon:pi.fullscreenIn,iconActive:pi.fullscreenOut}),this.viewer.addEventListener(Qs.type,this)}destroy(){this.viewer.removeEventListener(Qs.type,this),super.destroy()}handleEvent(i){i instanceof Qs&&this.toggleActive(i.fullscreenEnabled)}onClick(){this.viewer.toggleFullscreen()}};Ef.id="fullscreen";var my="psvButton",gy=(i,e)=>`
<div class="psv-panel-menu psv-panel-menu--stripped">
  <h1 class="psv-panel-menu-title">${pi.menu} ${e}</h1>
  <ul class="psv-panel-menu-list">
    ${i.map(t=>`
    <li data-psv-button="${t.id}" class="psv-panel-menu-item" tabindex="0">
      <span class="psv-panel-menu-item-icon">${t.content}</span>
      <span class="psv-panel-menu-item-label">${t.title}</span>
    </li>
    `).join("")}
  </ul>
</div>
`,la=class extends _t{constructor(i){super(i,{className:"psv-menu-button",hoverScale:!0,collapsable:!1,tabbable:!0,icon:pi.menu}),this.viewer.addEventListener(ln.type,this),this.viewer.addEventListener(on.type,this),super.hide()}destroy(){this.viewer.removeEventListener(ln.type,this),this.viewer.removeEventListener(on.type,this),super.destroy()}handleEvent(i){i instanceof ln?this.toggleActive(i.panelId===St.MENU):i instanceof on&&this.toggleActive(!1)}onClick(){this.state.active?this.__hideMenu():this.__showMenu()}hide(i){super.hide(i),this.__hideMenu()}show(i){super.show(i),this.state.active&&this.__showMenu()}__showMenu(){this.viewer.panel.show({id:St.MENU,content:gy(this.viewer.navbar.collapsed,this.viewer.config.lang.menu),noMargin:!0,clickHandler:i=>{let e=i?Lu(i,".psv-panel-menu-item"):void 0,t=e?e.dataset[my]:void 0;t&&(this.viewer.navbar.getButton(t).onClick(),this.__hideMenu())}})}__hideMenu(){this.viewer.panel.hide(St.MENU)}};la.id="menu";function vy(i){let e=0;switch(i){case 0:e=90;break;case 1:e=-90;break;case 3:e=180;break;default:e=0;break}return pi.arrow.replace("rotate(0",`rotate(${e}`)}var ur=class extends _t{constructor(i,e){super(i,{className:"psv-move-button",hoverScale:!0,collapsable:!1,tabbable:!0,icon:vy(e)}),this.direction=e,this.handler=new ya,this.container.addEventListener("mousedown",this),this.container.addEventListener("keydown",this),this.container.addEventListener("keyup",this),this.viewer.container.addEventListener("mouseup",this),this.viewer.container.addEventListener("touchend",this)}destroy(){this.__onMouseUp(),this.viewer.container.removeEventListener("mouseup",this),this.viewer.container.removeEventListener("touchend",this),super.destroy()}handleEvent(i){switch(i.type){case"mousedown":this.__onMouseDown();break;case"mouseup":this.__onMouseUp();break;case"touchend":this.__onMouseUp();break;case"keydown":i.key===Mt.Enter&&this.__onMouseDown();break;case"keyup":i.key===Mt.Enter&&this.__onMouseUp();break}}onClick(){}isSupported(){return va(Nt.isTouchEnabled)}__onMouseDown(){if(!this.state.enabled)return;let i={};switch(this.direction){case 0:i.pitch=!1;break;case 1:i.pitch=!0;break;case 3:i.yaw=!1;break;default:i.yaw=!0;break}this.viewer.stopAll(),this.viewer.dynamics.position.roll(i),this.handler.down()}__onMouseUp(){this.state.enabled&&this.handler.up(()=>{this.viewer.dynamics.position.stop(),this.viewer.resetIdleTimer()})}};ur.groupId="move";var Tf=class extends ur{constructor(i){super(i,1)}};Tf.id="moveDown";var Af=class extends ur{constructor(i){super(i,2)}};Af.id="moveLeft";var Cf=class extends ur{constructor(i){super(i,3)}};Cf.id="moveRight";var Rf=class extends ur{constructor(i){super(i,0)}};Rf.id="moveUp";var lc=class extends _t{constructor(i,e,t){super(i,{className:"psv-zoom-button",hoverScale:!0,collapsable:!1,tabbable:!0,icon:e}),this.direction=t,this.handler=new ya,this.container.addEventListener("mousedown",this),this.container.addEventListener("keydown",this),this.container.addEventListener("keyup",this),this.viewer.container.addEventListener("mouseup",this),this.viewer.container.addEventListener("touchend",this)}destroy(){this.__onMouseUp(),this.viewer.container.removeEventListener("mouseup",this),this.viewer.container.removeEventListener("touchend",this),super.destroy()}handleEvent(i){switch(i.type){case"mousedown":this.__onMouseDown();break;case"mouseup":this.__onMouseUp();break;case"touchend":this.__onMouseUp();break;case"keydown":i.key===Mt.Enter&&this.__onMouseDown();break;case"keyup":i.key===Mt.Enter&&this.__onMouseUp();break}}onClick(){}isSupported(){return va(Nt.isTouchEnabled)}__onMouseDown(){this.state.enabled&&(this.viewer.dynamics.zoom.roll(this.direction===1),this.handler.down())}__onMouseUp(){this.state.enabled&&this.handler.up(()=>this.viewer.dynamics.zoom.stop())}};lc.groupId="zoom";var Pf=class extends lc{constructor(i){super(i,pi.zoomIn,0)}};Pf.id="zoomIn";var If=class extends lc{constructor(i){super(i,pi.zoomOut,1)}};If.id="zoomOut";var cc=class extends _t{constructor(i){super(i,{className:"psv-zoom-range",hoverScale:!1,collapsable:!1,tabbable:!1}),this.zoomRange=document.createElement("div"),this.zoomRange.className="psv-zoom-range-line",this.container.appendChild(this.zoomRange),this.zoomValue=document.createElement("div"),this.zoomValue.className="psv-zoom-range-handle",this.zoomRange.appendChild(this.zoomValue),this.slider=new Ju(this.container,"HORIZONTAL",e=>this.__onSliderUpdate(e)),this.mediaMinWidth=parseInt(Ei(this.container,"max-width"),10),this.viewer.addEventListener(Hi.type,this),this.viewer.state.ready?this.__moveZoomValue(this.viewer.getZoomLevel()):this.viewer.addEventListener(nr.type,this)}destroy(){this.slider.destroy(),this.viewer.removeEventListener(Hi.type,this),this.viewer.removeEventListener(nr.type,this),super.destroy()}handleEvent(i){i instanceof Hi?this.__moveZoomValue(i.zoomLevel):i instanceof nr&&this.__moveZoomValue(this.viewer.getZoomLevel())}onClick(){}isSupported(){return va(Nt.isTouchEnabled)}autoSize(){this.state.supported&&(this.viewer.state.size.width<=this.mediaMinWidth&&this.state.visible?this.hide(!1):this.viewer.state.size.width>this.mediaMinWidth&&!this.state.visible&&this.show(!1))}__moveZoomValue(i){this.zoomValue.style.left=i/100*this.zoomRange.offsetWidth-this.zoomValue.offsetWidth/2+"px"}__onSliderUpdate(i){i.mousedown&&this.viewer.zoom(i.value*100)}};cc.id="zoomRange";cc.groupId="zoom";var Lf=class extends ju{constructor(i){super(),this.viewer=i}init(){}destroy(){}},dr=class extends Lf{constructor(i,e){super(i),this.config=this.constructor.configParser(e)}setOption(i,e){this.setOptions({[i]:e})}setOptions(i){let e={...this.config,...i},t=this.constructor,n=t.configParser,s=t.readonlyOptions,r=t.id;for(let[o,a]of Object.entries(i)){if(!(o in n.defaults)){Et(`${r}: Unknown option "${o}"`);continue}if(s.includes(o)){Et(`${r}: Option "${o}" cannot be updated`);continue}o in n.parsers&&(a=n.parsers[o](a,{rawConfig:e,defValue:n.defaults[o]})),this.config[o]=a}}};dr.readonlyOptions=[];function Kl(i){if(i){for(let[,e]of[["_",i],...Object.entries(i)])if(e.prototype instanceof Lf)return rc(e.id,e.VERSION,"5.13.3"),e}return null}var ri={panorama:null,container:null,adapter:[hr,null],plugins:[],caption:null,description:null,downloadUrl:null,downloadName:null,loadingImg:null,loadingTxt:"",size:null,fisheye:0,minFov:30,maxFov:90,defaultZoomLvl:50,defaultYaw:0,defaultPitch:0,sphereCorrection:null,moveSpeed:1,zoomSpeed:1,moveInertia:.8,mousewheel:!0,mousemove:!0,mousewheelCtrlKey:!1,touchmoveTwoFingers:!1,panoData:null,requestHeaders:null,canvasBackground:"#000",defaultTransition:{speed:1500,rotation:!0,effect:"fade"},rendererParameters:{alpha:!0,antialias:!0},withCredentials:()=>!1,navbar:["zoom","move","download","description","caption","fullscreen"],lang:{zoom:"Zoom",zoomOut:"Zoom out",zoomIn:"Zoom in",moveUp:"Move up",moveDown:"Move down",moveLeft:"Move left",moveRight:"Move right",description:"Description",download:"Download",fullscreen:"Fullscreen",loading:"Loading...",menu:"Menu",close:"Close",twoFingers:"Use two fingers to navigate",ctrlZoom:"Use ctrl + scroll to zoom the image",loadError:"The panorama cannot be loaded",webglError:"Your browser does not seem to support WebGL"},keyboard:"fullscreen",keyboardActions:{[Mt.ArrowUp]:"ROTATE_UP",[Mt.ArrowDown]:"ROTATE_DOWN",[Mt.ArrowRight]:"ROTATE_RIGHT",[Mt.ArrowLeft]:"ROTATE_LEFT",[Mt.PageUp]:"ZOOM_IN",[Mt.PageDown]:"ZOOM_OUT",[Mt.Plus]:"ZOOM_IN",[Mt.Minus]:"ZOOM_OUT"}},_u={panorama:"Use setPanorama method to change the panorama",panoData:"Use setPanorama method to change the panorama",container:"Cannot change viewer container",adapter:"Cannot change adapter",plugins:"Cannot change plugins"},Jl={container:i=>{if(!i)throw new ge("No value given for container.");return i},adapter:(i,{defValue:e})=>{if(i?Array.isArray(i)?i=[vu(i[0]),i[1]]:i=[vu(i),null]:i=e,!i[0])throw new ge("An undefined value was given for adapter.");if(!i[0].id)throw new ge("Adapter has no id.");return i},defaultYaw:i=>Si(i),defaultPitch:i=>Si(i,!0),defaultZoomLvl:i=>Re.clamp(i,0,100),minFov:(i,{rawConfig:e})=>(e.maxFov<i&&(Et("maxFov cannot be lower than minFov"),i=e.maxFov),Re.clamp(i,1,179)),maxFov:(i,{rawConfig:e})=>(i<e.minFov&&(i=e.minFov),Re.clamp(i,1,179)),moveInertia:(i,{defValue:e})=>i===!0?e:i===!1?0:i,lang:i=>({...ri.lang,...i}),keyboardActions:(i,{rawConfig:e})=>e.keyboard&&typeof e.keyboard=="object"?e.keyboard:i,fisheye:i=>i===!0?1:i===!1?0:i,requestHeaders:i=>i&&typeof i=="object"?()=>i:typeof i=="function"?i:null,withCredentials:i=>typeof i=="boolean"?()=>i:typeof i=="function"?i:()=>!1,defaultTransition:(i,{defValue:e})=>i===null||i.speed===0?null:{...e,...i},rendererParameters:(i,{defValue:e})=>({...i,...e}),plugins:i=>i.map((e,t)=>{if(Array.isArray(e)?e=[Kl(e[0]),e[1]]:e=[Kl(e),null],!e[0])throw new ge(`An undefined value was given for plugin ${t}.`);if(!e[0].id)throw new ge(`Plugin ${t} has no id.`);return e}),navbar:i=>i===!1?null:i===!0?ga(ri.navbar):typeof i=="string"?i.split(/[ ,]/):i},_y=_a(ri,Jl),cs=class extends _t{constructor(i){super(i,{className:"psv-caption",hoverScale:!1,collapsable:!1,tabbable:!0}),this.contentWidth=0,this.state.width=0,this.contentElt=document.createElement("div"),this.contentElt.className="psv-caption-content",this.container.appendChild(this.contentElt),this.setCaption(this.viewer.config.caption)}hide(){this.contentElt.style.display="none",this.state.visible=!1}show(){this.contentElt.style.display="",this.state.visible=!0}onClick(){}setCaption(i){this.show(),this.contentElt.innerHTML=i??"",this.contentElt.innerHTML?this.contentWidth=this.contentElt.offsetWidth:this.contentWidth=0,this.autoSize()}autoSize(){this.toggle(this.container.offsetWidth>=this.contentWidth),this.__refreshButton()}__refreshButton(){this.viewer.navbar.getButton(ar.id,!1)?.autoSize(!0)}};cs.id="caption";var jl={},pa={};function us(i,e){if(!i.id)throw new ge("Button id is required");if(jl[i.id]=i,i.groupId&&(pa[i.groupId]=pa[i.groupId]||[]).push(i),e){let t=ri.navbar;switch(e){case"start":t.unshift(i.id);break;case"end":t.push(i.id);break;default:{let[n,s]=e.split(":"),r=t.indexOf(n);if(!n||!s||r===-1)throw new ge(`Invalid defaultPosition ${e}`);t.splice(r+(s==="right"?1:0),0,i.id)}}}}[If,cc,Pf,ar,cs,Sf,Ef,Af,Cf,Rf,Tf].forEach(i=>us(i));var yy=class extends Nn{constructor(i){super(i,{className:`psv-navbar ${lr}`}),this.collapsed=[],this.state.visible=!1}show(){this.viewer.container.classList.add("psv--has-navbar"),this.container.classList.add("psv-navbar--open"),this.state.visible=!0}hide(){this.viewer.container.classList.remove("psv--has-navbar"),this.container.classList.remove("psv-navbar--open"),this.state.visible=!1}setButtons(i){this.children.slice().forEach(e=>e.destroy()),this.children.length=0,i.indexOf(cs.id)!==-1&&i.indexOf(ar.id)===-1&&i.splice(i.indexOf(cs.id),0,ar.id),i.forEach(e=>{typeof e=="object"?new py(this,e):jl[e]?new jl[e](this):pa[e]?pa[e].forEach(t=>{new t(this)}):Et(`Unknown button ${e}`)}),new la(this),this.children.forEach(e=>{e instanceof _t&&e.checkSupported()}),this.autoSize()}setCaption(i){this.children.some(e=>e instanceof cs?(e.setCaption(i),!0):!1)}getButton(i,e=!0){let t=this.children.find(n=>n instanceof _t&&n.id===i);return!t&&e&&Et(`button "${i}" not found in the navbar`),t}focusButton(i){this.isVisible()&&(this.getButton(i,!1)?.container||this.container.firstElementChild)?.focus()}autoSize(){this.children.forEach(n=>{n instanceof _t&&n.autoSize()});let i=this.container.offsetWidth,e=0,t=[];this.children.forEach(n=>{n.isVisible()&&n instanceof _t&&(e+=n.width,n.collapsable&&t.push(n))}),e!==0&&(i<e&&t.length>0?(t.forEach(n=>n.collapse()),this.collapsed=t,this.getButton(la.id).show(!1)):i>=e&&this.collapsed.length>0&&(this.collapsed.forEach(n=>n.uncollapse()),this.collapsed=[],this.getButton(la.id).hide(!1)),this.getButton(cs.id,!1)?.autoSize())}};Ys.enabled=!1;var ls={enabled:!0,maxItems:10,ttl:600,items:{},purgeInterval:null,init(){Ys.enabled&&(Et("ThreeJS cache should be disabled"),Ys.enabled=!1),!this.purgeInterval&&this.enabled&&(this.purgeInterval=setInterval(()=>this.purge(),60*1e3))},add(i,e,t){this.enabled&&e&&(this.items[e]=this.items[e]??{files:{},lastAccess:null},this.items[e].files[i]=t,this.items[e].lastAccess=Date.now())},get(i,e){if(this.enabled&&e&&this.items[e])return this.items[e].lastAccess=Date.now(),this.items[e].files[i]},remove(i,e){this.enabled&&e&&this.items[e]&&(delete this.items[e].files[i],Object.keys(this.items[e].files).length===0&&delete this.items[e])},purge(){Object.entries(this.items).sort(([,i],[,e])=>e.lastAccess-i.lastAccess).forEach(([i,{lastAccess:e}],t)=>{t>0&&(Date.now()-e>=this.ttl*1e3||t>=this.maxItems)&&delete this.items[i]})}},xy=class extends Nn{constructor(i){super(i,{className:"psv-loader-container"}),this.loader=document.createElement("div"),this.loader.className="psv-loader",this.container.appendChild(this.loader),this.size=this.loader.offsetWidth,this.canvas=document.createElementNS("http://www.w3.org/2000/svg","svg"),this.canvas.setAttribute("class","psv-loader-canvas"),this.canvas.setAttribute("viewBox",`0 0 ${this.size} ${this.size}`),this.loader.appendChild(this.canvas),this.textColor=Ei(this.loader,"color"),this.color=Ei(this.canvas,"color"),this.border=parseInt(Ei(this.loader,"--psv-loader-border"),10),this.thickness=parseInt(Ei(this.loader,"--psv-loader-tickness"),10);let e=this.size/2;this.canvas.innerHTML=`
            <circle cx="${e}" cy="${e}" r="${e}" fill="${this.color}"/>
            <path d="" fill="none" stroke="${this.textColor}" stroke-width="${this.thickness}" stroke-linecap="round"/>
        `,this.viewer.addEventListener(Bt.type,this),this.__updateContent(),this.hide()}destroy(){this.viewer.removeEventListener(Bt.type,this),super.destroy()}handleEvent(i){i instanceof Bt&&i.containsOptions("loadingImg","loadingTxt","lang")&&this.__updateContent()}setProgress(i){this.container.classList.remove("psv-loader--undefined");let e=Re.clamp(i,0,99.999)/100*Math.PI*2,t=this.size/2,n=t,s=this.thickness/2+this.border,r=(this.size-this.thickness)/2-this.border,o=Math.sin(e)*r+t,a=-Math.cos(e)*r+t,l=i>50?"1":"0";this.canvas.querySelector("path").setAttributeNS(null,"d",`M ${n} ${s} A ${r} ${r} 0 ${l} 1 ${o} ${a}`)}showUndefined(){this.show(),this.setProgress(25),this.container.classList.add("psv-loader--undefined")}__updateContent(){let i=this.loader.querySelector(".psv-loader-image, .psv-loader-text");i&&this.loader.removeChild(i);let e;if(this.viewer.config.loadingImg?(e=document.createElement("img"),e.className="psv-loader-image",e.src=this.viewer.config.loadingImg):this.viewer.config.loadingTxt!==null&&(e=document.createElement("div"),e.className="psv-loader-text",e.innerHTML=this.viewer.config.loadingTxt||this.viewer.config.lang.loading),e){let t=Math.round(Math.sqrt(2*Math.pow(this.size/2-this.thickness/2-this.border,2)));e.style.maxWidth=t+"px",e.style.maxHeight=t+"px",this.loader.appendChild(e)}}},My=class extends Nn{constructor(i){super(i,{className:"psv-notification"}),this.state={visible:!1,contentId:null,timeout:null},this.content=document.createElement("div"),this.content.className="psv-notification-content",this.container.appendChild(this.content),this.content.addEventListener("click",()=>this.hide())}isVisible(i){return this.state.visible&&(!i||!this.state.contentId||this.state.contentId===i)}toggle(){throw new ge("Notification cannot be toggled")}show(i){this.state.timeout&&(clearTimeout(this.state.timeout),this.state.timeout=null),typeof i=="string"&&(i={content:i}),this.state.contentId=i.id||null,this.content.innerHTML=i.content,this.container.classList.add("psv-notification--visible"),this.state.visible=!0,this.viewer.dispatchEvent(new sr(this.state.contentId)),i.timeout&&(this.state.timeout=setTimeout(()=>this.hide(this.state.contentId),i.timeout))}hide(i){if(this.isVisible(i)){let e=this.state.contentId;this.container.classList.remove("psv-notification--visible"),this.state.visible=!1,this.state.contentId=null,this.viewer.dispatchEvent(new er(e))}}},wy=class extends Nn{constructor(i){super(i,{className:`psv-overlay ${lr}`}),this.state={visible:!1,contentId:null,dismissible:!0},this.image=document.createElement("div"),this.image.className="psv-overlay-image",this.container.appendChild(this.image),this.title=document.createElement("div"),this.title.className="psv-overlay-title",this.container.appendChild(this.title),this.text=document.createElement("div"),this.text.className="psv-overlay-text",this.container.appendChild(this.text),this.container.addEventListener("click",this),this.viewer.addEventListener(an.type,this),super.hide()}destroy(){this.viewer.removeEventListener(an.type,this),super.destroy()}handleEvent(i){i.type==="click"?this.isVisible()&&this.state.dismissible&&(this.hide(),i.stopPropagation()):i instanceof an&&this.isVisible()&&this.state.dismissible&&i.key===Mt.Escape&&(this.hide(),i.preventDefault())}isVisible(i){return this.state.visible&&(!i||!this.state.contentId||this.state.contentId===i)}toggle(){throw new ge("Overlay cannot be toggled")}show(i){typeof i=="string"&&(i={title:i}),this.state.contentId=i.id||null,this.state.dismissible=i.dismissible!==!1,this.image.innerHTML=i.image||"",this.title.innerHTML=i.title||"",this.text.innerHTML=i.text||"",super.show(),this.viewer.dispatchEvent(new tf(this.state.contentId))}hide(i){if(this.isVisible(i)){let e=this.state.contentId;super.hide(),this.state.contentId=null,this.viewer.dispatchEvent(new xd(e))}}},by=200,Hl="psv-panel-content--no-interaction",Sy=class extends Nn{constructor(i){super(i,{className:`psv-panel ${lr}`}),this.state={visible:!1,contentId:null,mouseX:0,mouseY:0,mousedown:!1,clickHandler:null,keyHandler:null,width:{}};let e=document.createElement("div");e.className="psv-panel-resizer",this.container.appendChild(e);let t=document.createElement("div");t.className="psv-panel-close-button",t.innerHTML=pi.close,t.title=i.config.lang.close,this.container.appendChild(t),this.content=document.createElement("div"),this.content.className="psv-panel-content",this.container.appendChild(this.content),t.addEventListener("click",()=>this.hide()),e.addEventListener("mousedown",this),e.addEventListener("touchstart",this),this.viewer.container.addEventListener("mouseup",this),this.viewer.container.addEventListener("touchend",this),this.viewer.container.addEventListener("mousemove",this),this.viewer.container.addEventListener("touchmove",this),this.viewer.addEventListener(an.type,this)}destroy(){this.viewer.removeEventListener(an.type,this),this.viewer.container.removeEventListener("mousemove",this),this.viewer.container.removeEventListener("touchmove",this),this.viewer.container.removeEventListener("mouseup",this),this.viewer.container.removeEventListener("touchend",this),super.destroy()}handleEvent(i){switch(i.type){case"mousedown":this.__onMouseDown(i);break;case"touchstart":this.__onTouchStart(i);break;case"mousemove":this.__onMouseMove(i);break;case"touchmove":this.__onTouchMove(i);break;case"mouseup":this.__onMouseUp(i);break;case"touchend":this.__onTouchEnd(i);break;case an.type:this.__onKeyPress(i);break}}isVisible(i){return this.state.visible&&(!i||!this.state.contentId||this.state.contentId===i)}toggle(){throw new ge("Panel cannot be toggled")}show(i){typeof i=="string"&&(i={content:i});let e=this.isVisible(i.id);this.state.contentId=i.id||null,this.state.visible=!0,this.state.clickHandler&&(this.content.removeEventListener("click",this.state.clickHandler),this.content.removeEventListener("keydown",this.state.keyHandler),this.state.clickHandler=null,this.state.keyHandler=null),i.id&&this.state.width[i.id]?this.container.style.width=this.state.width[i.id]:i.width?this.container.style.width=i.width:this.container.style.width=null,this.content.innerHTML=i.content,this.content.scrollTop=0,this.container.classList.add("psv-panel--open"),ma(this.content,"psv-panel-content--no-margin",i.noMargin===!0),i.clickHandler&&(this.state.clickHandler=t=>{i.clickHandler(ca(t))},this.state.keyHandler=t=>{t.key===Mt.Enter&&i.clickHandler(ca(t))},this.content.addEventListener("click",this.state.clickHandler),this.content.addEventListener("keydown",this.state.keyHandler),e||setTimeout(()=>{this.content.querySelector("a,button,[tabindex]")?.focus()},300)),this.viewer.dispatchEvent(new ln(this.state.contentId))}hide(i){if(this.isVisible(i)){let e=this.state.contentId;this.state.visible=!1,this.state.contentId=null,this.content.innerHTML=null,this.container.classList.remove("psv-panel--open"),this.state.clickHandler&&(this.content.removeEventListener("click",this.state.clickHandler),this.content.removeEventListener("keydown",this.state.keyHandler),this.state.clickHandler=null,this.state.keyHandler=null),this.viewer.dispatchEvent(new on(e))}}__onMouseDown(i){i.stopPropagation(),this.__startResize(i.clientX,i.clientY)}__onTouchStart(i){if(i.stopPropagation(),i.touches.length===1){let e=i.touches[0];this.__startResize(e.clientX,e.clientY)}}__onMouseUp(i){this.state.mousedown&&(i.stopPropagation(),this.state.mousedown=!1,this.content.classList.remove(Hl))}__onTouchEnd(i){this.state.mousedown&&(i.stopPropagation(),i.touches.length===0&&(this.state.mousedown=!1,this.content.classList.remove(Hl)))}__onMouseMove(i){this.state.mousedown&&(i.stopPropagation(),this.__resize(i.clientX,i.clientY))}__onTouchMove(i){if(this.state.mousedown){let e=i.touches[0];this.__resize(e.clientX,e.clientY)}}__onKeyPress(i){this.isVisible()&&i.key===Mt.Escape&&(this.hide(),i.preventDefault())}__startResize(i,e){this.state.mouseX=i,this.state.mouseY=e,this.state.mousedown=!0,this.content.classList.add(Hl)}__resize(i,e){let t=i,n=e,s=Math.max(by,this.container.offsetWidth-(t-this.state.mouseX))+"px";this.state.contentId&&(this.state.width[this.state.contentId]=s),this.container.style.width=s,this.state.mouseX=t,this.state.mouseY=n}},Ey=class extends Nn{constructor(i,e){super(i,{className:"psv-tooltip"}),this.state={visible:!0,arrow:0,border:0,state:0,width:0,height:0,pos:"",config:null,data:null,hideTimeout:null},this.content=document.createElement("div"),this.content.className="psv-tooltip-content",this.container.appendChild(this.content),this.arrow=document.createElement("div"),this.arrow.className="psv-tooltip-arrow",this.container.appendChild(this.arrow),this.container.addEventListener("transitionend",this),this.container.addEventListener("touchdown",t=>t.stopPropagation()),this.container.addEventListener("mousedown",t=>t.stopPropagation()),this.container.style.top="-1000px",this.container.style.left="-1000px",this.show(e)}handleEvent(i){i.type==="transitionend"&&this.__onTransitionEnd(i)}destroy(){clearTimeout(this.state.hideTimeout),delete this.state.data,super.destroy()}toggle(){throw new ge("Tooltip cannot be toggled")}show(i){if(this.state.state!==0)throw new ge("Initialized tooltip cannot be re-initialized");i.className&&ec(this.container,i.className),i.style&&Object.assign(this.container.style,i.style),this.state.state=3,this.update(i.content,i),this.state.data=i.data,this.state.state=1,this.viewer.dispatchEvent(new af(this,this.state.data)),this.__waitImages()}update(i,e){this.content.innerHTML=i;let t=this.container.getBoundingClientRect();this.state.width=t.right-t.left,this.state.height=t.bottom-t.top,this.state.arrow=parseInt(Ei(this.arrow,"border-top-width"),10),this.state.border=parseInt(Ei(this.container,"border-top-left-radius"),10),this.move(e??this.state.config),this.__waitImages()}move(i){if(this.state.state!==1&&this.state.state!==3)throw new ge("Uninitialized tooltip cannot be moved");i.box=i.box??this.state.config?.box??{width:0,height:0},this.state.config=i;let e=this.container,t=this.arrow,n={posClass:Wu(i.position,{allowCenter:!1,cssOrder:!1})||["top","center"],width:this.state.width,height:this.state.height,top:0,left:0,arrowTop:0,arrowLeft:0};this.__computeTooltipPosition(n,i);let s=null,r=null;if(n.top<0?s="bottom":n.top+n.height>this.viewer.state.size.height&&(s="top"),n.left<0?r="right":n.left+n.width>this.viewer.state.size.width&&(r="left"),r||s){let a=sc(n.posClass);s&&(n.posClass[a?0:1]=s),r&&(n.posClass[a?1:0]=r),this.__computeTooltipPosition(n,i)}e.style.top=n.top+"px",e.style.left=n.left+"px",t.style.top=n.arrowTop+"px",t.style.left=n.arrowLeft+"px";let o=n.posClass.join("-");o!==this.state.pos&&(e.classList.remove(`psv-tooltip--${this.state.pos}`),this.state.pos=o,e.classList.add(`psv-tooltip--${this.state.pos}`))}hide(){this.container.classList.remove("psv-tooltip--visible"),this.state.state=2,this.viewer.dispatchEvent(new Ed(this.state.data));let i=parseFloat(Ei(this.container,"transition-duration"));this.state.hideTimeout=setTimeout(()=>{this.destroy()},i*2)}__onTransitionEnd(i){if(i.propertyName==="transform")switch(this.state.state){case 1:this.container.classList.add("psv-tooltip--visible"),this.state.state=3;break;case 2:this.state.state=0,this.destroy();break;default:}}__computeTooltipPosition(i,e){let t=this.state.arrow,n=e.top,s=i.height,r=e.left,o=i.width,a=t+this.state.border,l=e.box.width/2+t*2,c=e.box.height/2+t*2;switch(i.posClass.join("-")){case"top-left":i.top=n-c-s,i.left=r+a-o,i.arrowTop=s,i.arrowLeft=o-a-t;break;case"top-center":i.top=n-c-s,i.left=r-o/2,i.arrowTop=s,i.arrowLeft=o/2-t;break;case"top-right":i.top=n-c-s,i.left=r-a,i.arrowTop=s,i.arrowLeft=t;break;case"bottom-left":i.top=n+c,i.left=r+a-o,i.arrowTop=-t*2,i.arrowLeft=o-a-t;break;case"bottom-center":i.top=n+c,i.left=r-o/2,i.arrowTop=-t*2,i.arrowLeft=o/2-t;break;case"bottom-right":i.top=n+c,i.left=r-a,i.arrowTop=-t*2,i.arrowLeft=t;break;case"left-top":i.top=n+a-s,i.left=r-l-o,i.arrowTop=s-a-t,i.arrowLeft=o;break;case"center-left":i.top=n-s/2,i.left=r-l-o,i.arrowTop=s/2-t,i.arrowLeft=o;break;case"left-bottom":i.top=n-a,i.left=r-l-o,i.arrowTop=t,i.arrowLeft=o;break;case"right-top":i.top=n+a-s,i.left=r+l,i.arrowTop=s-a-t,i.arrowLeft=-t*2;break;case"center-right":i.top=n-s/2,i.left=r+l,i.arrowTop=s/2-t,i.arrowLeft=-t*2;break;case"right-bottom":i.top=n-a,i.left=r+l,i.arrowTop=t,i.arrowLeft=-t*2;break}}__waitImages(){let i=this.content.querySelectorAll("img");if(i.length>0){let e=[];i.forEach(t=>{t.complete||e.push(new Promise(n=>{t.onload=n,t.onerror=n}))}),e.length&&Promise.all(e).then(()=>{if(this.state.state===1||this.state.state===3){let t=this.container.getBoundingClientRect();this.state.width=t.right-t.left,this.state.height=t.bottom-t.top,this.move(this.state.config)}})}}},Ty=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="15 15 70 70"><path fill="currentColor" d="M50,16.2c-18.6,0-33.8,15.1-33.8,33.8S31.4,83.7,50,83.7S83.8,68.6,83.8,50S68.6,16.2,50,16.2z M50,80.2c-16.7,0-30.2-13.6-30.2-30.2S33.3,19.7,50,19.7S80.3,33.3,80.3,50S66.7,80.2,50,80.2z"/><rect fill="currentColor" x="48" y="31.7" width="4" height="28"/><rect fill="currentColor" x="48" y="63.2" width="4" height="5"/><!--Created by Shastry from the Noun Project--></svg>
`,fr=class{constructor(i){this.viewer=i,this.config=i.config,this.state=i.state}destroy(){}},fi=new U,ra=new ei(0,0,0,"ZXY"),Ay=class extends fr{constructor(i){super(i)}fovToZoomLevel(i){let e=Math.round((i-this.config.minFov)/(this.config.maxFov-this.config.minFov)*100);return Re.clamp(e-2*(e-50),0,100)}zoomLevelToFov(i){return this.config.maxFov+i/100*(this.config.minFov-this.config.maxFov)}vFovToHFov(i){return Re.radToDeg(2*Math.atan(Math.tan(Re.degToRad(i)/2)*this.state.aspect))}hFovToVFov(i){return Re.radToDeg(2*Math.atan(Math.tan(Re.degToRad(i)/2)/this.state.aspect))}getAnimationProperties(i,e,t){let n=!wt(e),s=!wt(t),r={},o=null;if(n){let a=this.viewer.getPosition(),l=Ru(a.yaw,e.yaw);r.yaw={start:a.yaw,end:a.yaw+l},r.pitch={start:a.pitch,end:e.pitch},o=Yl(i,Pu(a,e))}if(s){let a=this.viewer.getZoomLevel(),l=Math.abs(t-a);r.zoom={start:a,end:t},o===null&&(o=Yl(i,Math.PI/4*l/100))}return o===null?typeof i=="number"?o=i:o=Gl:o=Math.max(Gl,o),{duration:o,properties:r}}getTransitionOptions(i){let e,t=this.config.defaultTransition??ri.defaultTransition;return i.transition===!1||i.transition===null?e=null:i.transition===!0?e={...t}:typeof i.transition=="object"?e={...t,...i.transition}:e=this.config.defaultTransition,e}textureCoordsToSphericalCoords(i){if(!this.state.textureData?.panoData)throw new ge("Current adapter does not support texture coordinates or no texture has been loaded");let e=this.viewer.adapter.textureCoordsToSphericalCoords(i,this.state.textureData.panoData);return!ra.equals(this.viewer.renderer.panoramaPose)||!ra.equals(this.viewer.renderer.sphereCorrection)?(this.sphericalCoordsToVector3(e,fi),fi.applyEuler(this.viewer.renderer.panoramaPose),fi.applyEuler(this.viewer.renderer.sphereCorrection),this.vector3ToSphericalCoords(fi)):e}sphericalCoordsToTextureCoords(i){if(!this.state.textureData?.panoData)throw new ge("Current adapter does not support texture coordinates or no texture has been loaded");return(!ra.equals(this.viewer.renderer.panoramaPose)||!ra.equals(this.viewer.renderer.sphereCorrection))&&(this.sphericalCoordsToVector3(i,fi),Zl(fi,this.viewer.renderer.sphereCorrection),Zl(fi,this.viewer.renderer.panoramaPose),i=this.vector3ToSphericalCoords(fi)),this.viewer.adapter.sphericalCoordsToTextureCoords(i,this.state.textureData.panoData)}sphericalCoordsToVector3(i,e,t=Un){return e||(e=new U),e.x=t*-Math.cos(i.pitch)*Math.sin(i.yaw),e.y=t*Math.sin(i.pitch),e.z=t*Math.cos(i.pitch)*Math.cos(i.yaw),e}vector3ToSphericalCoords(i){let e=Math.acos(i.y/Math.sqrt(i.x*i.x+i.y*i.y+i.z*i.z)),t=Math.atan2(i.x,i.z);return{yaw:t<0?-t:Math.PI*2-t,pitch:Math.PI/2-e}}viewerCoordsToVector3(i){let e=this.viewer.renderer.getIntersections(i).filter(t=>t.object.userData[cn]);return e.length?e[0].point:null}viewerCoordsToSphericalCoords(i){let e=this.viewerCoordsToVector3(i);return e?this.vector3ToSphericalCoords(e):null}vector3ToViewerCoords(i){let e=i.clone();return e.project(this.viewer.renderer.camera),{x:Math.round((e.x+1)/2*this.state.size.width),y:Math.round((1-e.y)/2*this.state.size.height)}}sphericalCoordsToViewerCoords(i){return this.sphericalCoordsToVector3(i,fi),this.vector3ToViewerCoords(fi)}isPointVisible(i){let e,t;if(i instanceof U)e=i,t=this.vector3ToViewerCoords(i);else if(nc(i))e=this.sphericalCoordsToVector3(i,fi),t=this.vector3ToViewerCoords(e);else return!1;return e.dot(this.viewer.state.direction)>0&&t.x>=0&&t.x<=this.viewer.state.size.width&&t.y>=0&&t.y<=this.viewer.state.size.height}cleanPosition(i){if("yaw"in i||"pitch"in i){if(!("yaw"in i)||!("pitch"in i))throw new ge("Position is missing 'yaw' or 'pitch'");return{yaw:Si(i.yaw),pitch:Si(i.pitch,!0)}}else return this.textureCoordsToSphericalCoords(i)}cleanSphereCorrection(i){return{pan:Si(i?.pan||0),tilt:Si(i?.tilt||0,!0),roll:Si(i?.roll||0,!0,!1)}}cleanPanoramaPose(i){return{pan:Re.degToRad(i?.poseHeading||0),tilt:Re.degToRad(i?.posePitch||0),roll:Re.degToRad(i?.poseRoll||0)}}cleanPanoramaOptions(i,e){return e?.isEquirectangular&&(wt(i.zoom)&&!wt(e.initialFov)&&(i={...i,zoom:this.fovToZoomLevel(this.hFovToVFov(e.initialFov))}),wt(i.position)&&!wt(e.initialHeading)&&!wt(e.initialPitch)&&(i={...i,position:{yaw:Si(e.initialHeading),pitch:Si(e.initialPitch,!0)}})),i}},Cy=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="currentColor" d="M33.38 33.2a1.96 1.96 0 0 0 1.5-3.23 10.61 10.61 0 0 1 7.18-17.51c.7-.06 1.31-.49 1.61-1.12a13.02 13.02 0 0 1 11.74-7.43c7.14 0 12.96 5.8 12.96 12.9 0 3.07-1.1 6.05-3.1 8.38-.7.82-.61 2.05.21 2.76.83.7 2.07.6 2.78-.22a16.77 16.77 0 0 0 4.04-10.91C72.3 7.54 64.72 0 55.4 0a16.98 16.98 0 0 0-14.79 8.7 14.6 14.6 0 0 0-12.23 14.36c0 3.46 1.25 6.82 3.5 9.45.4.45.94.69 1.5.69m45.74 43.55a22.13 22.13 0 0 1-5.23 12.4c-4 4.55-9.53 6.86-16.42 6.86-12.6 0-20.1-10.8-20.17-10.91a1.82 1.82 0 0 0-.08-.1c-5.3-6.83-14.55-23.82-17.27-28.87-.05-.1 0-.21.02-.23a6.3 6.3 0 0 1 8.24 1.85l9.38 12.59a1.97 1.97 0 0 0 3.54-1.17V25.34a4 4 0 0 1 1.19-2.87 3.32 3.32 0 0 1 2.4-.95c1.88.05 3.4 1.82 3.4 3.94v24.32a1.96 1.96 0 0 0 3.93 0v-33.1a3.5 3.5 0 0 1 7 0v35.39a1.96 1.96 0 0 0 3.93 0v-.44c.05-2.05 1.6-3.7 3.49-3.7 1.93 0 3.5 1.7 3.5 3.82v5.63c0 .24.04.48.13.71l.1.26a1.97 1.97 0 0 0 3.76-.37c.33-1.78 1.77-3.07 3.43-3.07 1.9 0 3.45 1.67 3.5 3.74l-1.77 18.1zM77.39 51c-1.25 0-2.45.32-3.5.9v-.15c0-4.27-3.33-7.74-7.42-7.74-1.26 0-2.45.33-3.5.9V16.69a7.42 7.42 0 0 0-14.85 0v1.86a7 7 0 0 0-3.28-.94 7.21 7.21 0 0 0-5.26 2.07 7.92 7.92 0 0 0-2.38 5.67v37.9l-5.83-7.82a10.2 10.2 0 0 0-13.35-2.92 4.1 4.1 0 0 0-1.53 5.48C20 64.52 28.74 80.45 34.07 87.34c.72 1.04 9.02 12.59 23.4 12.59 7.96 0 14.66-2.84 19.38-8.2a26.06 26.06 0 0 0 6.18-14.6l1.78-18.2v-.2c0-4.26-3.32-7.73-7.42-7.73z"/><!--Created by AomAm from the Noun Project--></svg>
`,Ry=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 17 79 79"><path fill="currentColor" d="M38.1 29.27c-.24 0-.44.2-.44.45v10.7a.45.45 0 00.9 0v-10.7c0-.25-.2-.45-.45-.45zm10.2 26.66a11.54 11.54 0 01-8.48-6.14.45.45 0 10-.8.41 12.45 12.45 0 009.22 6.62.45.45 0 00.07-.9zm24.55-13.08a23.04 23.04 0 00-22.56-23v7.07l-.01.05a2.83 2.83 0 012.39 2.78v14.03l.09-.02h8.84v-9.22a.45.45 0 11.9 0v9.22h10.35v-.9zm0 27.33V44.66H62.5c-.02 2.01-.52 4-1.47 5.76a.45.45 0 01-.61.18.45.45 0 01-.19-.61 11.54 11.54 0 001.36-5.33h-8.83l-.1-.01a2.83 2.83 0 01-2.83 2.84h-.04-.04a2.83 2.83 0 01-2.83-2.83v-14.9a2.82 2.82 0 012.47-2.8v-7.11a23.04 23.04 0 00-22.57 23v.91h14.72V29.88a8.2 8.2 0 015.02-7.57c.22-.1.5.01.59.24.1.23-.01.5-.24.6a7.3 7.3 0 00-4.47 6.73v13.88h3.9a.45.45 0 110 .9h-3.9v.15a7.32 7.32 0 0011.23 6.17.45.45 0 01.49.76 8.22 8.22 0 01-12.62-6.93v-.15H26.82v25.52a23.04 23.04 0 0023.01 23.01 23.04 23.04 0 0023.02-23.01zm1.8-27.33v27.33A24.85 24.85 0 0149.84 95a24.85 24.85 0 01-24.82-24.82V42.85a24.85 24.85 0 0124.82-24.82 24.85 24.85 0 0124.83 24.82zM57.98 29.88v9.36a.45.45 0 11-.9 0v-9.36a7.28 7.28 0 00-3.4-6.17.45.45 0 01.49-.76 8.18 8.18 0 013.8 6.93z"/><!-- Created by Icon Island from the Noun Project --></svg>
`,Ma=class Df{constructor(){this.$=Df.IDLE}is(...e){return e.some(t=>this.$&t)}set(e){this.$=e}add(e){this.$|=e}remove(e){this.$&=~e}};Ma.IDLE=0;Ma.CLICK=1;Ma.MOVING=2;var mt=Ma,Py=class extends fr{constructor(i){super(i),this.data={startMouseX:0,startMouseY:0,mouseX:0,mouseY:0,pinchDist:0,moveDelta:{yaw:0,pitch:0,zoom:0},accumulatorFactor:0,ctrlKeyDown:!1,dblclickData:null,dblclickTimeout:null,longtouchTimeout:null,twofingersTimeout:null,ctrlZoomTimeout:null},this.step=new mt,this.keyHandler=new ya,this.resizeObserver=new ResizeObserver(Bu(()=>this.viewer.autoSize(),50)),this.moveThreshold=Mu*Nt.pixelRatio}init(){window.addEventListener("keydown",this,{passive:!1}),window.addEventListener("keyup",this),this.viewer.container.addEventListener("mousedown",this),window.addEventListener("mousemove",this,{passive:!1}),window.addEventListener("mouseup",this),this.viewer.container.addEventListener("touchstart",this,{passive:!1}),window.addEventListener("touchmove",this,{passive:!1}),window.addEventListener("touchend",this,{passive:!1}),this.viewer.container.addEventListener("wheel",this,{passive:!1}),document.addEventListener("fullscreenchange",this),this.resizeObserver.observe(this.viewer.container),this.viewer.addEventListener(js.type,this),this.viewer.addEventListener(or.type,this)}destroy(){window.removeEventListener("keydown",this),window.removeEventListener("keyup",this),this.viewer.container.removeEventListener("mousedown",this),window.removeEventListener("mousemove",this),window.removeEventListener("mouseup",this),this.viewer.container.removeEventListener("touchstart",this),window.removeEventListener("touchmove",this),window.removeEventListener("touchend",this),this.viewer.container.removeEventListener("wheel",this),document.removeEventListener("fullscreenchange",this),this.resizeObserver.disconnect(),this.viewer.removeEventListener(js.type,this),this.viewer.removeEventListener(or.type,this),clearTimeout(this.data.dblclickTimeout),clearTimeout(this.data.longtouchTimeout),clearTimeout(this.data.twofingersTimeout),clearTimeout(this.data.ctrlZoomTimeout),super.destroy()}handleEvent(i){switch(i.type){case"keydown":this.__onKeyDown(i);break;case"keyup":this.__onKeyUp();break;case"mousemove":this.__onMouseMove(i);break;case"mouseup":this.__onMouseUp(i);break;case"touchmove":this.__onTouchMove(i);break;case"touchend":this.__onTouchEnd(i);break;case"fullscreenchange":this.__onFullscreenChange();break;case js.type:this.__applyMoveDelta();break;case or.type:this.__clearMoveDelta();break}if(!Du(i,"."+lr))switch(i.type){case"mousedown":this.__onMouseDown(i);break;case"touchstart":this.__onTouchStart(i);break;case"wheel":this.__onMouseWheel(i);break}}__onKeyDown(i){if(this.config.mousewheelCtrlKey&&(this.data.ctrlKeyDown=i.key===Mt.Control,this.data.ctrlKeyDown&&(clearTimeout(this.data.ctrlZoomTimeout),this.viewer.overlay.hide(St.CTRL_ZOOM))),!this.viewer.dispatchEvent(new an(i.key,i))||!this.state.keyboardEnabled)return;let e=this.config.keyboardActions?.[i.key];if(typeof e=="function"){e(this.viewer,i),i.preventDefault();return}if(!(i.ctrlKey||i.altKey||i.shiftKey||i.metaKey)&&e&&!this.keyHandler.pending){switch(e!=="ZOOM_IN"&&e!=="ZOOM_OUT"&&this.viewer.stopAll(),e){case"ROTATE_UP":this.viewer.dynamics.position.roll({pitch:!1});break;case"ROTATE_DOWN":this.viewer.dynamics.position.roll({pitch:!0});break;case"ROTATE_RIGHT":this.viewer.dynamics.position.roll({yaw:!1});break;case"ROTATE_LEFT":this.viewer.dynamics.position.roll({yaw:!0});break;case"ZOOM_IN":this.viewer.dynamics.zoom.roll(!1);break;case"ZOOM_OUT":this.viewer.dynamics.zoom.roll(!0);break}this.keyHandler.down(e),i.preventDefault()}}__onKeyUp(){this.data.ctrlKeyDown=!1,this.state.keyboardEnabled&&this.keyHandler.up(i=>{i==="ZOOM_IN"||i==="ZOOM_OUT"?this.viewer.dynamics.zoom.stop():(this.viewer.dynamics.position.stop(),this.viewer.resetIdleTimer())})}__onMouseDown(i){this.step.add(mt.CLICK),this.data.startMouseX=i.clientX,this.data.startMouseY=i.clientY,this.config.mousemove&&i.preventDefault()}__onMouseUp(i){this.step.is(mt.CLICK,mt.MOVING)&&this.__stopMove(i.clientX,i.clientY,i,i.button===2)}__onMouseMove(i){this.config.mousemove&&this.step.is(mt.CLICK,mt.MOVING)&&(i.preventDefault(),this.__doMove(i.clientX,i.clientY)),this.__handleObjectsEvents(i)}__onTouchStart(i){i.touches.length===1?(this.step.add(mt.CLICK),this.data.startMouseX=i.touches[0].clientX,this.data.startMouseY=i.touches[0].clientY,this.data.longtouchTimeout||(this.data.longtouchTimeout=setTimeout(()=>{let e=i.touches[0];this.__stopMove(e.clientX,e.clientY,i,!0),this.data.longtouchTimeout=null},bu))):i.touches.length===2&&(this.step.set(mt.IDLE),this.__cancelLongTouch(),this.config.mousemove&&(this.__cancelTwoFingersOverlay(),this.__startMoveZoom(i),i.preventDefault()))}__onTouchEnd(i){if(this.__cancelLongTouch(),this.step.is(mt.CLICK,mt.MOVING)){if(i.preventDefault(),this.__cancelTwoFingersOverlay(),i.touches.length===1)this.__stopMove(this.data.mouseX,this.data.mouseY);else if(i.touches.length===0){let e=i.changedTouches[0];this.__stopMove(e.clientX,e.clientY,i)}}}__onTouchMove(i){if(this.__cancelLongTouch(),!!this.config.mousemove)if(i.touches.length===1){if(this.config.touchmoveTwoFingers)this.step.is(mt.CLICK)&&!this.data.twofingersTimeout&&(this.data.twofingersTimeout=setTimeout(()=>{this.viewer.overlay.show({id:St.TWO_FINGERS,image:Cy,title:this.config.lang.twoFingers})},Su));else if(this.step.is(mt.CLICK,mt.MOVING)){i.preventDefault();let e=i.touches[0];this.__doMove(e.clientX,e.clientY)}}else this.__doMoveZoom(i),this.__cancelTwoFingersOverlay()}__cancelLongTouch(){this.data.longtouchTimeout&&(clearTimeout(this.data.longtouchTimeout),this.data.longtouchTimeout=null)}__cancelTwoFingersOverlay(){this.config.touchmoveTwoFingers&&(this.data.twofingersTimeout&&(clearTimeout(this.data.twofingersTimeout),this.data.twofingersTimeout=null),this.viewer.overlay.hide(St.TWO_FINGERS))}__onMouseWheel(i){if(!this.config.mousewheel||!i.deltaY)return;if(this.config.mousewheelCtrlKey&&!this.data.ctrlKeyDown){this.viewer.overlay.show({id:St.CTRL_ZOOM,image:Ry,title:this.config.lang.ctrlZoom}),clearTimeout(this.data.ctrlZoomTimeout),this.data.ctrlZoomTimeout=setTimeout(()=>this.viewer.overlay.hide(St.CTRL_ZOOM),Eu);return}i.preventDefault(),i.stopPropagation();let e=i.deltaY/Math.abs(i.deltaY)*5*this.config.zoomSpeed;e!==0&&this.viewer.dynamics.zoom.step(-e,5)}__onFullscreenChange(){let i=this.viewer.isFullscreenEnabled();this.config.keyboard==="fullscreen"&&(i?this.viewer.startKeyboardControl():this.viewer.stopKeyboardControl()),this.viewer.dispatchEvent(new Qs(i))}__resetMove(){this.step.set(mt.IDLE),this.data.mouseX=0,this.data.mouseY=0,this.data.startMouseX=0,this.data.startMouseY=0}__startMoveZoom(i){this.viewer.stopAll(),this.__resetMove();let e=Wl(i);this.step.set(mt.MOVING),this.data.accumulatorFactor=this.config.moveInertia,{distance:this.data.pinchDist,center:{x:this.data.mouseX,y:this.data.mouseY}}=e}__stopMove(i,e,t,n=!1){this.step.is(mt.CLICK)&&!this.__moveThresholdReached(i,e)&&this.__doClick(i,e,t,n),this.config.moveInertia&&(this.data.accumulatorFactor=Math.pow(this.config.moveInertia,.5)),this.__resetMove(),this.viewer.resetIdleTimer()}__doClick(i,e,t,n=!1){let s=this.viewer.container.getBoundingClientRect(),r=i-s.left,o=e-s.top,a=this.viewer.renderer.getIntersections({x:r,y:o}),l=a.find(c=>c.object.userData[cn]);if(l){let c=this.viewer.dataHelper.vector3ToSphericalCoords(l.point),h={rightclick:n,originalEvent:t,target:ca(t),clientX:i,clientY:e,viewerX:r,viewerY:o,yaw:c.yaw,pitch:c.pitch,objects:a.map(f=>f.object).filter(f=>!f.userData[cn])};try{let f=this.viewer.dataHelper.sphericalCoordsToTextureCoords(h);Object.assign(h,f)}catch{}this.data.dblclickTimeout?(Math.abs(this.data.dblclickData.clientX-h.clientX)<this.moveThreshold&&Math.abs(this.data.dblclickData.clientY-h.clientY)<this.moveThreshold&&this.viewer.dispatchEvent(new fd(this.data.dblclickData)),clearTimeout(this.data.dblclickTimeout),this.data.dblclickTimeout=null,this.data.dblclickData=null):(this.viewer.dispatchEvent(new ld(h)),this.data.dblclickData=ga(h),this.data.dblclickTimeout=setTimeout(()=>{this.data.dblclickTimeout=null,this.data.dblclickData=null},wu))}}__handleObjectsEvents(i){if(!zu(this.state.objectsObservers)&&i.composedPath().includes(this.viewer.container)){let e=Uu(this.viewer.container),t={x:i.clientX-e.x,y:i.clientY-e.y},n=this.viewer.renderer.getIntersections(t),s=(r,o,a)=>{this.viewer.dispatchEvent(new a(i,r,t,o))};for(let[r,o]of Object.entries(this.state.objectsObservers)){let a=n.find(l=>l.object.userData[r]);a?(o&&a.object!==o&&(s(o,r,$l),this.state.objectsObservers[r]=null),o?s(a.object,r,Mf):(this.state.objectsObservers[r]=a.object,s(a.object,r,gf))):o&&(s(o,r,$l),this.state.objectsObservers[r]=null)}}}__doMove(i,e){if(this.step.is(mt.CLICK)&&this.__moveThresholdReached(i,e))this.viewer.stopAll(),this.__resetMove(),this.step.set(mt.MOVING),this.data.mouseX=i,this.data.mouseY=e,this.data.accumulatorFactor=this.config.moveInertia;else if(this.step.is(mt.MOVING)){let t=(i-this.data.mouseX)*Math.cos(this.state.roll)-(e-this.data.mouseY)*Math.sin(this.state.roll),n=(e-this.data.mouseY)*Math.cos(this.state.roll)+(i-this.data.mouseX)*Math.sin(this.state.roll),s={yaw:this.config.moveSpeed*(t/this.state.size.width)*Re.degToRad(this.state.hFov),pitch:this.config.moveSpeed*(n/this.state.size.height)*Re.degToRad(this.state.vFov)};this.data.moveDelta.yaw+=s.yaw,this.data.moveDelta.pitch+=s.pitch,this.data.mouseX=i,this.data.mouseY=e}}__moveThresholdReached(i,e){return Math.abs(i-this.data.startMouseX)>=this.moveThreshold||Math.abs(e-this.data.startMouseY)>=this.moveThreshold}__doMoveZoom(i){if(this.step.is(mt.MOVING)){i.preventDefault();let e=Wl(i);this.__doMove(e.center.x,e.center.y),this.data.moveDelta.zoom+=this.config.zoomSpeed*((e.distance-this.data.pinchDist)/Nt.pixelRatio),this.data.pinchDist=e.distance}}__applyMoveDelta(){if(Math.abs(this.data.moveDelta.yaw)>0||Math.abs(this.data.moveDelta.pitch)>0){let e=this.viewer.getPosition();this.viewer.rotate({yaw:e.yaw-this.data.moveDelta.yaw*(1-this.config.moveInertia),pitch:e.pitch+this.data.moveDelta.pitch*(1-this.config.moveInertia)}),this.data.moveDelta.yaw*=this.data.accumulatorFactor,this.data.moveDelta.pitch*=this.data.accumulatorFactor,Math.abs(this.data.moveDelta.yaw)<=.001&&(this.data.moveDelta.yaw=0),Math.abs(this.data.moveDelta.pitch)<=.001&&(this.data.moveDelta.pitch=0)}if(Math.abs(this.data.moveDelta.zoom)>0){let e=this.viewer.getZoomLevel();this.viewer.zoom(e+this.data.moveDelta.zoom*(1-this.config.moveInertia)),this.data.moveDelta.zoom*=this.config.moveInertia,Math.abs(this.data.moveDelta.zoom)<=.001&&(this.data.moveDelta.zoom=0)}}__clearMoveDelta(){this.data.moveDelta.yaw=0,this.data.moveDelta.pitch=0,this.data.moveDelta.zoom=0}};ze.enabled=!1;var oa=new Oe,yu=new tt,xu=new vi,Iy=class extends fr{constructor(i){super(i),this.frustumNeedsUpdate=!0,this.renderer=new na(this.config.rendererParameters),this.renderer.setPixelRatio(Nt.pixelRatio),this.renderer.outputColorSpace=Ni,this.renderer.toneMapping=vo,this.renderer.domElement.className="psv-canvas",this.renderer.domElement.style.background=this.config.canvasBackground,this.scene=new Qi,this.camera=new Rt(50,16/9,.1,2*Un),this.camera.matrixAutoUpdate=!1;let e=new pt(new Bi(Un).scale(-1,1,1),new di({opacity:0,transparent:!0,depthTest:!1,depthWrite:!1}));e.userData={[cn]:!0},this.scene.add(e),this.raycaster=new Bs,this.frustum=new wn,this.container=document.createElement("div"),this.container.className="psv-canvas-container",this.container.appendChild(this.renderer.domElement),this.viewer.container.appendChild(this.container),this.container.addEventListener("contextmenu",t=>t.preventDefault()),this.viewer.addEventListener(rr.type,this),this.viewer.addEventListener(Hi.type,this),this.viewer.addEventListener(tr.type,this),this.viewer.addEventListener(ir.type,this),this.viewer.addEventListener(Bt.type,this),this.hide()}get panoramaPose(){return this.mesh.rotation}get sphereCorrection(){return this.meshContainer.rotation}init(){this.show(),this.renderer.setAnimationLoop(i=>this.__renderLoop(i))}destroy(){this.renderer.setAnimationLoop(null),this.cleanScene(this.scene),this.renderer.dispose(),this.viewer.container.removeChild(this.container),this.viewer.removeEventListener(rr.type,this),this.viewer.removeEventListener(Hi.type,this),this.viewer.removeEventListener(tr.type,this),this.viewer.removeEventListener(ir.type,this),this.viewer.removeEventListener(Bt.type,this),super.destroy()}handleEvent(i){switch(i.type){case rr.type:this.__onSizeUpdated();break;case Hi.type:this.__onZoomUpdated();break;case tr.type:this.__onPositionUpdated();break;case ir.type:this.__onPositionUpdated();break;case Bt.type:i.containsOptions("fisheye")&&this.__onPositionUpdated(),i.containsOptions("canvasBackground")&&(this.renderer.domElement.style.background=this.config.canvasBackground);break}}hide(){this.container.style.opacity="0"}show(){this.container.style.opacity="1"}setCustomRenderer(i){i?this.customRenderer=i(this.renderer):this.customRenderer=null,this.viewer.needsUpdate()}__onSizeUpdated(){this.renderer.setSize(this.state.size.width,this.state.size.height),this.camera.aspect=this.state.aspect,this.camera.updateProjectionMatrix(),this.viewer.needsUpdate(),this.frustumNeedsUpdate=!0}__onZoomUpdated(){this.camera.fov=this.state.vFov,this.camera.updateProjectionMatrix(),this.viewer.needsUpdate(),this.frustumNeedsUpdate=!0}__onPositionUpdated(){this.camera.position.set(0,0,0),this.camera.lookAt(this.state.direction),this.config.fisheye&&this.camera.position.copy(this.state.direction).multiplyScalar(this.config.fisheye/2).negate(),this.camera.rotateZ(-this.state.roll),this.camera.updateMatrix(),this.camera.updateMatrixWorld(),this.viewer.needsUpdate(),this.frustumNeedsUpdate=!0}__renderLoop(i){let e=this.timestamp?i-this.timestamp:0;this.timestamp=i,this.viewer.dispatchEvent(new js(i,e)),this.viewer.dynamics.update(e),(this.state.needsUpdate||this.state.continuousUpdateCount>0)&&(this.state.needsUpdate=!1,(this.customRenderer||this.renderer).render(this.scene,this.camera),this.viewer.dispatchEvent(new Kd))}setTexture(i){this.meshContainer||(this.meshContainer=new ti,this.scene.add(this.meshContainer)),this.state.textureData&&this.viewer.adapter.disposeTexture(this.state.textureData),this.mesh&&(this.meshContainer.remove(this.mesh),this.viewer.adapter.disposeMesh(this.mesh)),this.mesh=this.viewer.adapter.createMesh(i.panoData),this.viewer.adapter.setTexture(this.mesh,i,!1),this.meshContainer.add(this.mesh),this.state.textureData=i,this.viewer.needsUpdate()}setPanoramaPose(i,e=this.mesh){let t=this.viewer.dataHelper.cleanPanoramaPose(i);e.rotation.set(t.tilt,t.pan,t.roll,"YXZ")}setSphereCorrection(i,e=this.meshContainer){let t=this.viewer.dataHelper.cleanSphereCorrection(i);e.rotation.set(t.tilt,t.pan,t.roll,"YXZ")}transition(i,e,t){let n=t.effect==="fade"||t.rotation,s=!wt(e.position),r=!wt(e.zoom),o=new oc(s?this.viewer.dataHelper.cleanPosition(e.position):void 0,e.zoom);this.viewer.dispatchEvent(o);let a=new ti,l=this.viewer.adapter.createMesh(i.panoData);if(this.viewer.adapter.setTexture(l,i,!0),this.viewer.adapter.setTextureOpacity(l,0),this.setPanoramaPose(i.panoData,l),this.setSphereCorrection(e.sphereCorrection,a),s&&!t.rotation){let p=this.viewer.getPosition(),m=new U(0,1,0);a.rotateOnWorldAxis(m,o.position.yaw-p.yaw);let v=new U(0,1,0).cross(this.camera.getWorldDirection(new U)).normalize();a.rotateOnWorldAxis(v,o.position.pitch-p.pitch)}a.add(l),this.scene.add(a),this.renderer.setRenderTarget(new Qt),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null);let{duration:c,properties:h}=this.viewer.dataHelper.getAnimationProperties(t.speed,t.rotation?o.position:null,n?o.zoomLevel:null),f=new fa({properties:{...h,opacity:{start:0,end:1}},duration:c,easing:"inOutCubic",onTick:p=>{switch(t.effect){case"fade":this.viewer.adapter.setTextureOpacity(l,p.opacity);break;case"black":case"white":p.opacity<.5?this.renderer.toneMappingExposure=t.effect==="black"?Re.mapLinear(p.opacity,0,.5,1,0):Re.mapLinear(p.opacity,0,.5,1,4):(this.renderer.toneMappingExposure=t.effect==="black"?Re.mapLinear(p.opacity,.5,1,0,1):Re.mapLinear(p.opacity,.5,1,4,1),this.mesh.visible=!1,this.viewer.adapter.setTextureOpacity(l,1),r&&!n&&this.viewer.dynamics.zoom.setValue(o.zoomLevel));break}s&&t.rotation&&this.viewer.dynamics.position.setValue({yaw:p.yaw,pitch:p.pitch}),r&&n&&this.viewer.dynamics.zoom.setValue(p.zoom),this.viewer.needsUpdate()}});return f.then(p=>{a.remove(l),this.scene.remove(a),p?(this.viewer.adapter.disposeTexture(this.state.textureData),this.meshContainer.remove(this.mesh),this.viewer.adapter.disposeMesh(this.mesh),this.mesh=l,this.meshContainer.add(l),this.state.textureData=i,this.setPanoramaPose(i.panoData),this.setSphereCorrection(e.sphereCorrection),s&&!t.rotation&&this.viewer.rotate(e.position)):(this.viewer.adapter.disposeTexture(i),this.viewer.adapter.disposeMesh(l))}),f}getIntersections(i){oa.x=2*i.x/this.state.size.width-1,oa.y=-2*i.y/this.state.size.height+1,this.raycaster.setFromCamera(oa,this.camera);let e=this.raycaster.intersectObjects(this.scene.children,!0).filter(t=>t.object.visible).filter(t=>t.object.isMesh&&!!t.object.userData);return this.customRenderer?.getIntersections&&e.push(...this.customRenderer.getIntersections(this.raycaster,oa)),e}isObjectVisible(i){if(!i)return!1;if(this.frustumNeedsUpdate&&(yu.multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse),this.frustum.setFromProjectionMatrix(yu),this.frustumNeedsUpdate=!1),i.isVector3)return this.frustum.containsPoint(i);if(i.isMesh&&i.geometry){let e=i;return e.geometry.boundingBox||e.geometry.computeBoundingBox(),xu.copy(e.geometry.boundingBox).applyMatrix4(e.matrixWorld),this.frustum.intersectsBox(xu)}else return i.isObject3D?this.frustum.intersectsObject(i):!1}addObject(i){this.scene.add(i)}removeObject(i){this.scene.remove(i)}cleanScene(i){let e=t=>{t.map?.dispose(),t.uniforms&&Object.values(t.uniforms).forEach(n=>{n.value?.dispose?.()}),t.dispose()};i.traverse(t=>{t.geometry?.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(n=>{e(n)}):e(t.material)),t instanceof Qi||t.dispose?.(),t!==i&&this.cleanScene(t)})}},Ly=class extends nn{load(i,e,t,n,s){let r=new Request(i,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"});fetch(r,{signal:s}).then(o=>{if(o.status===200||o.status===0){let a=o.body.getReader(),l=o.headers.get("Content-Length")||o.headers.get("X-File-Size"),c=l?parseInt(l):0,h=c!==0,f=0,p=new ReadableStream({start(m){v();function v(){a.read().then(({done:_,value:d})=>{if(_)m.close();else{f+=d.byteLength;let u=new ProgressEvent("progress",{lengthComputable:h,loaded:f,total:c});t(u),m.enqueue(d),v()}}).catch(_=>{n(_)})}}});return new Response(p)}else throw new Error(`fetch for "${o.url}" responded with ${o.status}: ${o.statusText}`)}).then(o=>o.blob()).then(o=>{e(o)}).catch(o=>{n(o)})}},Dy=class extends nn{load(i,e,t,n){let s=document.createElement("img");function r(){l(),e(this)}function o(c){if(l(),n?.aborted){let h=new Error;h.name="AbortError",h.message="The operation was aborted.",t(h)}else t(c)}function a(){s.src=""}function l(){s.removeEventListener("load",r,!1),s.removeEventListener("error",o,!1),n?.removeEventListener("abort",a,!1)}return s.addEventListener("load",r,!1),s.addEventListener("error",o,!1),n?.addEventListener("abort",a,!1),i.startsWith("data:")||(s.crossOrigin=this.withCredentials?"use-credentials":"anonymous"),s.src=i,s}},Uy=class extends fr{constructor(i){super(i),this.abortCtrl={},this.fileLoader=new Ly,this.imageLoader=new Dy}destroy(){this.abortLoading(),super.destroy()}abortLoading(){Object.values(this.abortCtrl).forEach(i=>i.abort()),this.abortCtrl={}}loadFile(i,e,t){let n=ls.get(i,t);if(n){if(n instanceof Blob)return e?.(100),Promise.resolve(n);ls.remove(i,t)}return this.config.requestHeaders&&this.fileLoader.setRequestHeader(this.config.requestHeaders(i)),this.fileLoader.setWithCredentials(this.config.withCredentials(i)),new Promise((s,r)=>{let o=0;e?.(o),this.fileLoader.load(i,a=>{o=100,e?.(o),ls.add(i,t,a),s(a)},a=>{if(a.lengthComputable){let l=a.loaded/a.total*100;l>o&&(o=l,e?.(o))}},a=>{r(a)},this.__getAbortSignal(t))})}loadImage(i,e,t){let n=ls.get(i,t);return n?(e?.(100),n instanceof Blob?this.blobToImage(n):Promise.resolve(n)):!e&&!this.config.requestHeaders?(this.imageLoader.setWithCredentials(this.config.withCredentials(i)),new Promise((s,r)=>{this.imageLoader.load(i,o=>{ls.add(i,t,o),s(o)},o=>{r(o)},this.__getAbortSignal(t))})):this.loadFile(i,e,t).then(s=>this.blobToImage(s))}blobToImage(i){return new Promise((e,t)=>{let n=document.createElement("img");n.onload=()=>{URL.revokeObjectURL(n.src),e(n)},n.onerror=t,n.src=URL.createObjectURL(i)})}preloadPanorama(i){return this.viewer.adapter.supportsPreload(i)?this.viewer.adapter.loadTexture(i,!1):Promise.reject(new ge("Current adapter does not support preload"))}dispatchProgress(i){this.viewer.loader.setProgress(i),this.viewer.dispatchEvent(new Pd(Math.round(i)))}__getAbortSignal(i){return i?(this.abortCtrl[i]?.signal.aborted&&delete this.abortCtrl[i],this.abortCtrl[i]||(this.abortCtrl[i]=new AbortController),this.abortCtrl[i].signal):null}},Ny=class extends fr{constructor(i){super(i),this.zoom=new Ks(e=>{this.viewer.state.vFov=this.viewer.dataHelper.zoomLevelToFov(e),this.viewer.state.hFov=this.viewer.dataHelper.vFovToHFov(this.viewer.state.vFov),this.viewer.dispatchEvent(new Hi(e))},{defaultValue:this.viewer.config.defaultZoomLvl,min:0,max:100,wrap:!1}),this.position=new $u(e=>{this.viewer.dataHelper.sphericalCoordsToVector3(e,this.viewer.state.direction),this.viewer.dispatchEvent(new tr(e))},{yaw:new Ks(null,{defaultValue:this.config.defaultYaw,min:0,max:2*Math.PI,wrap:!0}),pitch:new Ks(null,{defaultValue:this.config.defaultPitch,min:-Math.PI/2,max:Math.PI/2,wrap:!1})}),this.roll=new Ks(e=>{this.viewer.state.roll=e,this.viewer.dispatchEvent(new ir(e))},{defaultValue:0,min:-Math.PI,max:Math.PI,wrap:!1}),this.updateSpeeds()}updateSpeeds(){this.zoom.setSpeed(this.config.zoomSpeed*50),this.position.setSpeed(Re.degToRad(this.config.moveSpeed*50)),this.roll.setSpeed(Re.degToRad(this.config.moveSpeed*50))}update(i){this.zoom.update(i),this.position.update(i),this.roll.update(i)}},Oy=class{constructor(){this.ready=!1,this.needsUpdate=!1,this.continuousUpdateCount=0,this.keyboardEnabled=!1,this.direction=new U(0,0,Un),this.roll=0,this.vFov=60,this.hFov=60,this.aspect=1,this.animation=null,this.transitionAnimation=null,this.loadingPromise=null,this.idleTime=-1,this.objectsObservers={},this.size={width:0,height:0}}},Uf=class extends ju{constructor(i){if(super(),this.plugins={},this.children=[],this.parent=Iu(i.container),!this.parent)throw new ge('"container" element not found.');this.parent[cn]=this,this.container=document.createElement("div"),this.container.classList.add("psv-container"),this.parent.appendChild(this.container),qu(this.parent),Yu(this.container,"core"),this.state=new Oy,this.config=_y(i),this.__setSize(this.config.size),this.overlay=new wy(this);try{Nt.load()}catch(e){console.error(e),this.showError(this.config.lang.webglError);return}ls.init(),this.adapter=new this.config.adapter[0](this,this.config.adapter[1]),this.renderer=new Iy(this),this.textureLoader=new Uy(this),this.eventsHandler=new Py(this),this.dataHelper=new Ay(this),this.dynamics=new Ny(this),this.adapter.init?.(),this.loader=new xy(this),this.navbar=new yy(this),this.panel=new Sy(this),this.notification=new My(this),this.autoSize(),this.setCursor(null),ic(Nt.isTouchEnabled,e=>{ma(this.container,"psv--is-touch",e)}),this.config.plugins.forEach(([e,t])=>{this.plugins[e.id]=new e(this,t)});for(let e of Object.values(this.plugins))e.init?.();this.config.navbar&&this.navbar.setButtons(this.config.navbar),this.state.loadingPromise||(this.config.panorama?this.setPanorama(this.config.panorama,{sphereCorrection:this.config.sphereCorrection,panoData:this.config.panoData}):this.loader.show())}destroy(){this.stopAll(),this.stopKeyboardControl(),this.exitFullscreen();for(let[i,e]of Object.entries(this.plugins))e.destroy(),delete this.plugins[i];this.children.slice().forEach(i=>i.destroy()),this.children.length=0,this.eventsHandler?.destroy(),this.renderer?.destroy(),this.textureLoader?.destroy(),this.dataHelper?.destroy(),this.adapter?.destroy(),this.dynamics?.destroy(),this.parent.removeChild(this.container),delete this.parent[cn]}init(){this.eventsHandler.init(),this.renderer.init(),this.config.navbar&&this.navbar.show(),this.config.keyboard==="always"&&this.startKeyboardControl(),this.resetIdleTimer(),this.state.ready=!0,this.dispatchEvent(new nr)}resetIdleTimer(){this.state.idleTime=performance.now()}disableIdleTimer(){this.state.idleTime=-1}getPlugin(i){if(typeof i=="string")return this.plugins[i];{let e=Kl(i);return e?this.plugins[e.id]:null}}getPosition(){return this.dataHelper.cleanPosition(this.dynamics.position.current)}getZoomLevel(){return this.dynamics.zoom.current}getSize(){return{...this.state.size}}isFullscreenEnabled(){return Nu(this.parent,Nt.isIphone)}needsUpdate(){this.state.needsUpdate=!0}needsContinuousUpdate(i){i?this.state.continuousUpdateCount++:this.state.continuousUpdateCount>0&&this.state.continuousUpdateCount--}autoSize(){(this.container.clientWidth!==this.state.size.width||this.container.clientHeight!==this.state.size.height)&&(this.state.size.width=Math.round(this.container.clientWidth),this.state.size.height=Math.round(this.container.clientHeight),this.state.aspect=this.state.size.width/this.state.size.height,this.state.hFov=this.dataHelper.vFovToHFov(this.state.vFov),this.dispatchEvent(new rr(this.getSize())),this.navbar.autoSize())}setPanorama(i,e={}){this.textureLoader.abortLoading(),this.state.transitionAnimation?.cancel();let t=this.dataHelper.getTransitionOptions(e);e.showLoader===void 0&&(e.showLoader=!0),e.caption===void 0&&(e.caption=this.config.caption),e.description===void 0&&(e.description=this.config.description),!e.panoData&&typeof this.config.panoData=="function"&&(e.panoData=this.config.panoData),this.hideError(),this.resetIdleTimer(),this.config.panorama=i,this.config.caption=e.caption,this.config.description=e.description,this.config.sphereCorrection=e.sphereCorrection;let n=r=>{if(Gu(r))return!1;if(this.loader.hide(),this.state.loadingPromise=null,r)throw this.navbar.setCaption(null),this.showError(this.config.lang.loadError),console.error(r),this.dispatchEvent(new Bd(i,r)),r;return this.navbar.setCaption(this.config.caption),!0};this.navbar.setCaption(`<em>${this.config.lang.loading}</em>`),(e.showLoader||!this.state.ready)&&this.loader.show(),this.dispatchEvent(new Dd(i));let s=this.adapter.loadTexture(this.config.panorama,!0,e.panoData).then(r=>{if(r.panorama!==this.config.panorama)throw this.adapter.disposeTexture(r),Xl();let o=this.dataHelper.cleanPanoramaOptions(e,r.panoData);return(!wt(o.zoom)||!wt(o.position))&&this.stopAll(),{textureData:r,cleanOptions:o}});return!t||!this.state.ready||!this.adapter.supportsTransition(this.config.panorama)?this.state.loadingPromise=s.then(({textureData:r,cleanOptions:o})=>{this.renderer.show(),this.renderer.setTexture(r),this.renderer.setPanoramaPose(r.panoData),this.renderer.setSphereCorrection(e.sphereCorrection),this.state.ready||this.init(),this.dispatchEvent(new hs(r)),wt(o.zoom)||this.zoom(o.zoom),wt(o.position)||this.rotate(o.position)}).then(()=>n(),r=>n(r)):this.state.loadingPromise=s.then(({textureData:r,cleanOptions:o})=>(this.loader.hide(),this.dispatchEvent(new hs(r)),this.state.transitionAnimation=this.renderer.transition(r,o,t),this.state.transitionAnimation)).then(r=>{if(this.state.transitionAnimation=null,this.dispatchEvent(new Vd(r)),!r)throw Xl()}).then(()=>n(),r=>n(r)),this.state.loadingPromise}setOptions(i){let e={...this.config,...i};for(let[t,n]of Object.entries(i)){if(!(t in ri)){Et(`Unknown option ${t}`);continue}if(t in _u){Et(_u[t]);continue}switch(t in Jl&&(n=Jl[t](n,{rawConfig:e,defValue:ri[t]})),this.config[t]=n,t){case"mousemove":this.state.cursorOverride||this.setCursor(null);break;case"caption":this.navbar.setCaption(this.config.caption);break;case"size":this.resize(this.config.size);break;case"sphereCorrection":this.renderer.setSphereCorrection(this.config.sphereCorrection);break;case"navbar":case"lang":this.navbar.setButtons(this.config.navbar);break;case"moveSpeed":case"zoomSpeed":this.dynamics.updateSpeeds();break;case"minFov":case"maxFov":this.dynamics.zoom.setValue(this.dataHelper.fovToZoomLevel(this.state.vFov)),this.dispatchEvent(new Hi(this.getZoomLevel()));break;case"keyboard":this.config.keyboard==="always"?this.startKeyboardControl():this.stopKeyboardControl();break;default:break}}this.needsUpdate(),this.dispatchEvent(new Bt(Object.keys(i)))}setOption(i,e){this.setOptions({[i]:e})}showError(i){this.overlay.show({id:St.ERROR,image:Ty,title:i,dismissible:!1})}hideError(){this.overlay.hide(St.ERROR)}rotate(i){let e=new rd(this.dataHelper.cleanPosition(i));this.dispatchEvent(e),!e.defaultPrevented&&this.dynamics.position.setValue(e.position)}zoom(i){this.dynamics.zoom.setValue(i)}zoomIn(i=1){this.dynamics.zoom.step(i)}zoomOut(i=1){this.dynamics.zoom.step(-i)}animate(i){let e=nc(i),t=!wt(i.zoom),n=new oc(e?this.dataHelper.cleanPosition(i):void 0,i.zoom);if(this.dispatchEvent(n),n.defaultPrevented)return;this.stopAll();let{duration:s,properties:r}=this.dataHelper.getAnimationProperties(i.speed,n.position,n.zoomLevel);return s?(this.state.animation=new fa({properties:r,duration:s,easing:i.easing||"inOutSine",onTick:o=>{e&&this.dynamics.position.setValue({yaw:o.yaw,pitch:o.pitch}),t&&this.dynamics.zoom.setValue(o.zoom)}}),this.state.animation.then(()=>{this.state.animation=null,this.resetIdleTimer()}),this.state.animation):(e&&this.rotate(n.position),t&&this.zoom(n.zoomLevel),new fa(null))}stopAnimation(){return this.state.animation?(this.state.animation.cancel(),this.state.animation):Promise.resolve()}resize(i){this.__setSize(i),this.autoSize()}__setSize(i){["width","height"].forEach(e=>{i?.[e]&&(/^[0-9.]+$/.test(i[e])&&(i[e]+="px"),this.parent.style[e]=i[e])})}enterFullscreen(){this.isFullscreenEnabled()||Ou(this.parent,Nt.isIphone)}exitFullscreen(){this.isFullscreenEnabled()&&Fu(Nt.isIphone)}toggleFullscreen(){this.isFullscreenEnabled()?this.exitFullscreen():this.enterFullscreen()}startKeyboardControl(){this.state.keyboardEnabled=!0}stopKeyboardControl(){this.state.keyboardEnabled=!1}createTooltip(i){return new Ey(this,i)}setCursor(i){this.state.cursorOverride=i,i?this.container.style.cursor=i:this.container.style.cursor=this.config.mousemove?"move":"default"}observeObjects(i){this.state.objectsObservers[i]||(this.state.objectsObservers[i]=null)}unobserveObjects(i){delete this.state.objectsObservers[i]}stopAll(){return this.dispatchEvent(new or),this.disableIdleTimer(),this.stopAnimation()}};var Fy=Object.defineProperty,By=(i,e)=>{for(var t in e)Fy(i,t,{get:e[t],enumerable:!0})},ky={};By(ky,{EnterMarkerEvent:()=>Jf,GotoMarkerDoneEvent:()=>uc,HideMarkersEvent:()=>mr,LeaveMarkerEvent:()=>Zf,MarkerVisibilityEvent:()=>Gf,MarkersPluginEvent:()=>oi,RenderMarkersListEvent:()=>gp,SelectMarkerEvent:()=>ep,SelectMarkerListEvent:()=>np,SetMarkersEvent:()=>up,ShowMarkersEvent:()=>gr,UnselectMarkerEvent:()=>op});var oi=class extends cr{},Vf=class Hf extends oi{constructor(e,t){super(Hf.type),this.marker=e,this.visible=t}};Vf.type="marker-visibility";var Gf=Vf,Wf=class Xf extends oi{constructor(e){super(Xf.type),this.marker=e}};Wf.type="goto-marker-done";var uc=Wf,Yf=class qf extends oi{constructor(e){super(qf.type),this.marker=e}};Yf.type="leave-marker";var Zf=Yf,$f=class Kf extends oi{constructor(e){super(Kf.type),this.marker=e}};$f.type="enter-marker";var Jf=$f,jf=class Qf extends oi{constructor(e,t,n){super(Qf.type),this.marker=e,this.doubleClick=t,this.rightClick=n}};jf.type="select-marker";var ep=jf,tp=class ip extends oi{constructor(e){super(ip.type),this.marker=e}};tp.type="select-marker-list";var np=tp,sp=class rp extends oi{constructor(e){super(rp.type),this.marker=e}};sp.type="unselect-marker";var op=sp,ap=class lp extends oi{constructor(){super(lp.type)}};ap.type="hide-markers";var mr=ap,cp=class hp extends oi{constructor(e){super(hp.type),this.markers=e}};cp.type="set-markers";var up=cp,dp=class fp extends oi{constructor(){super(fp.type)}};dp.type="show-markers";var gr=dp,pp=class mp extends oi{constructor(e){super(mp.type),this.markers=e}};pp.type="render-markers-list";var gp=pp,zy=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 9 81 81"><path fill="currentColor" d="M50.5 90S22.9 51.9 22.9 36.6 35.2 9 50.5 9s27.6 12.4 27.6 27.6S50.5 90 50.5 90zm0-66.3c-6.1 0-11 4.9-11 11s4.9 11 11 11 11-4.9 11-11-4.9-11-11-11z"/><!--Created by Rohith M S from the Noun Project--></svg>
`,vr=class extends _t{constructor(i){super(i,{className:"psv-markers-button",icon:zy,hoverScale:!0,collapsable:!0,tabbable:!0}),this.plugin=this.viewer.getPlugin("markers"),this.plugin&&(this.plugin.addEventListener(gr.type,this),this.plugin.addEventListener(mr.type,this),this.toggleActive(!0))}destroy(){this.plugin&&(this.plugin.removeEventListener(gr.type,this),this.plugin.removeEventListener(mr.type,this)),super.destroy()}isSupported(){return!!this.plugin}handleEvent(i){i instanceof gr?this.toggleActive(!0):i instanceof mr&&this.toggleActive(!1)}onClick(){this.plugin.toggleAllMarkers()}};vr.id="markers";var vp=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="9 9 81 81"><path fill="currentColor" d="M37.5 90S9.9 51.9 9.9 36.6 22.2 9 37.5 9s27.6 12.4 27.6 27.6S37.5 90 37.5 90zm0-66.3c-6.1 0-11 4.9-11 11s4.9 11 11 11 11-4.9 11-11-4.9-11-11-11zM86.7 55H70c-1.8 0-3.3-1.5-3.3-3.3s1.5-3.3 3.3-3.3h16.7c1.8 0 3.3 1.5 3.3 3.3S88.5 55 86.7 55zm0-25h-15a3.3 3.3 0 0 1-3.3-3.3c0-1.8 1.5-3.3 3.3-3.3h15c1.8 0 3.3 1.5 3.3 3.3 0 1.8-1.5 3.3-3.3 3.3zM56.5 73h30c1.8 0 3.3 1.5 3.3 3.3 0 1.8-1.5 3.3-3.3 3.3h-30a3.3 3.3 0 0 1-3.3-3.3 3.2 3.2 0 0 1 3.3-3.3z"/><!--Created by Rohith M S from the Noun Project--></svg>
`,Sa="http://www.w3.org/2000/svg",ot="psvMarker",Vy=ce.dasherize(ot),pr="marker",ds="markersList",dc={amount:2,duration:100,easing:"linear"},Hy=(i,e)=>`
<div class="psv-panel-menu psv-panel-menu--stripped">
    <h1 class="psv-panel-menu-title">${vp} ${e}</h1>
    <ul class="psv-panel-menu-list">
    ${i.map(t=>`
        <li data-${Vy}="${t.id}" class="psv-panel-menu-item" tabindex="0">
          ${t.type==="image"?`<span class="psv-panel-menu-item-icon"><img src="${t.definition}"/></span>`:""}
          <span class="psv-panel-menu-item-label">${t.getListContent()}</span>
        </li>
    `).join("")}
    </ul>
</div>
`,Ta=class extends _t{constructor(i){super(i,{className:" psv-markers-list-button",icon:vp,hoverScale:!0,collapsable:!0,tabbable:!0}),this.plugin=this.viewer.getPlugin("markers"),this.plugin&&(this.viewer.addEventListener(ye.ShowPanelEvent.type,this),this.viewer.addEventListener(ye.HidePanelEvent.type,this))}destroy(){this.viewer.removeEventListener(ye.ShowPanelEvent.type,this),this.viewer.removeEventListener(ye.HidePanelEvent.type,this),super.destroy()}isSupported(){return!!this.plugin}handleEvent(i){i instanceof ye.ShowPanelEvent?this.toggleActive(i.panelId===ds):i instanceof ye.HidePanelEvent&&this.toggleActive(!1)}onClick(){this.plugin.toggleMarkersList()}};Ta.id="markersList";var Nf=new U,Gy=new Xt,Of=new U,Wy=class extends Ft{constructor(i=document.createElement("div")){super(),this.isCSS3DObject=!0,this.element=i,this.element.style.position="absolute",this.element.style.pointerEvents="auto",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof e.element.ownerDocument.defaultView.Element&&e.element.parentNode!==null&&e.element.remove()})})}copy(i,e){return super.copy(i,e),this.element=i.element.cloneNode(!0),this}},Ti=new tt,Xy=new tt,Yy=class{constructor(i={}){let e=this,t,n,s,r,o={camera:{style:""},objects:new WeakMap},a=i.element!==void 0?i.element:document.createElement("div");a.style.overflow="hidden",this.domElement=a;let l=document.createElement("div");l.style.transformOrigin="0 0",l.style.pointerEvents="none",a.appendChild(l);let c=document.createElement("div");c.style.transformStyle="preserve-3d",l.appendChild(c),this.getSize=function(){return{width:t,height:n}},this.render=function(_,d){let u=d.projectionMatrix.elements[5]*r;d.view&&d.view.enabled?(l.style.transform=`translate( ${-d.view.offsetX*(t/d.view.width)}px, ${-d.view.offsetY*(n/d.view.height)}px )`,l.style.transform+=`scale( ${d.view.fullWidth/d.view.width}, ${d.view.fullHeight/d.view.height} )`):l.style.transform="",_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),d.parent===null&&d.matrixWorldAutoUpdate===!0&&d.updateMatrixWorld();let E,S;d.isOrthographicCamera&&(E=-(d.right+d.left)/2,S=(d.top+d.bottom)/2);let M=d.view&&d.view.enabled?d.view.height/d.view.fullHeight:1,I=d.isOrthographicCamera?`scale( ${M} )scale(`+u+")translate("+h(E)+"px,"+h(S)+"px)"+f(d.matrixWorldInverse):`scale( ${M} )translateZ(`+u+"px)"+f(d.matrixWorldInverse),C=(d.isPerspectiveCamera?"perspective("+u+"px) ":"")+I+"translate("+s+"px,"+r+"px)";o.camera.style!==C&&(c.style.transform=C,o.camera.style=C),v(_,_,d,I)},this.setSize=function(_,d){t=_,n=d,s=t/2,r=n/2,a.style.width=_+"px",a.style.height=d+"px",l.style.width=_+"px",l.style.height=d+"px",c.style.width=_+"px",c.style.height=d+"px"};function h(_){return Math.abs(_)<1e-10?0:_}function f(_){let d=_.elements;return"matrix3d("+h(d[0])+","+h(-d[1])+","+h(d[2])+","+h(d[3])+","+h(d[4])+","+h(-d[5])+","+h(d[6])+","+h(d[7])+","+h(d[8])+","+h(-d[9])+","+h(d[10])+","+h(d[11])+","+h(d[12])+","+h(-d[13])+","+h(d[14])+","+h(d[15])+")"}function p(_){let d=_.elements;return"translate(-50%,-50%)"+("matrix3d("+h(d[0])+","+h(d[1])+","+h(d[2])+","+h(d[3])+","+h(-d[4])+","+h(-d[5])+","+h(-d[6])+","+h(-d[7])+","+h(d[8])+","+h(d[9])+","+h(d[10])+","+h(d[11])+","+h(d[12])+","+h(d[13])+","+h(d[14])+","+h(d[15])+")")}function m(_){_.isCSS3DObject&&(_.element.style.display="none");for(let d=0,u=_.children.length;d<u;d++)m(_.children[d])}function v(_,d,u,E){if(_.visible===!1){m(_);return}if(_.isCSS3DObject){let S=_.layers.test(u.layers)===!0,M=_.element;if(M.style.display=S===!0?"":"none",S===!0){_.onBeforeRender(e,d,u);let I;_.isCSS3DSprite?(Ti.copy(u.matrixWorldInverse),Ti.transpose(),_.rotation2D!==0&&Ti.multiply(Xy.makeRotationZ(_.rotation2D)),_.matrixWorld.decompose(Nf,Gy,Of),Ti.setPosition(Nf),Ti.scale(Of),Ti.elements[3]=0,Ti.elements[7]=0,Ti.elements[11]=0,Ti.elements[15]=1,I=p(Ti)):I=p(_.matrixWorld);let A=o.objects.get(_);if(A===void 0||A.style!==I){M.style.transform=I;let C={style:I};o.objects.set(_,C)}M.parentNode!==c&&c.appendChild(M),_.onAfterRender(e,d,u)}}for(let S=0,M=_.children.length;S<M;S++)v(_.children[S],d,u,E)}}},qy=class{constructor(i){this.viewer=i,this.element=document.createElement("div"),this.element.className="psv-markers-css3d-container",this.renderer=new Yy({element:this.element}),this.scene=new Qi,this.intersectionObserver=new IntersectionObserver(e=>{e.forEach(t=>{let n=t.target[ot];n.config.visible&&(n.viewportIntersection=t.isIntersecting)})},{root:this.element}),i.addEventListener(ye.ReadyEvent.type,this,{once:!0}),i.addEventListener(ye.SizeUpdatedEvent.type,this),i.addEventListener(ye.RenderEvent.type,this)}handleEvent(i){switch(i.type){case ye.ReadyEvent.type:case ye.SizeUpdatedEvent.type:this.updateSize();break;case ye.RenderEvent.type:this.render();break}}destroy(){this.viewer.removeEventListener(ye.ReadyEvent.type,this),this.viewer.removeEventListener(ye.SizeUpdatedEvent.type,this),this.viewer.removeEventListener(ye.RenderEvent.type,this),this.intersectionObserver.disconnect()}updateSize(){let i=this.viewer.getSize();this.renderer.setSize(i.width,i.height)}render(){this.renderer.render(this.scene,this.viewer.renderer.camera)}addObject(i){this.scene.add(i.threeElement),this.intersectionObserver.observe(i.domElement)}removeObject(i){this.scene.remove(i.threeElement),this.intersectionObserver.unobserve(i.domElement)}},ba=(i=>(i.image="image",i.html="html",i.element="element",i.imageLayer="imageLayer",i.videoLayer="videoLayer",i.elementLayer="elementLayer",i.polygon="polygon",i.polygonPixels="polygonPixels",i.polyline="polyline",i.polylinePixels="polylinePixels",i.square="square",i.rect="rect",i.circle="circle",i.ellipse="ellipse",i.path="path",i))(ba||{});function fc(i,e=!1){let t=[];if(Object.keys(ba).forEach(n=>{i[n]&&t.push(n)}),t.length===0&&!e)throw new ge(`missing marker content, either ${Object.keys(ba).join(", ")}`);if(t.length>1)throw new ge(`multiple marker content, either ${Object.keys(ba).join(", ")}`);return t[0]}var _p=class{constructor(i,e,t){if(this.viewer=i,this.plugin=e,this.state={anchor:null,visible:!1,staticTooltip:!1,position:null,position2D:null,positions3D:null,size:null},!t.id)throw new ge("missing marker id");this.type=fc(t),this.createElement(),this.update(t)}get id(){return this.config.id}get data(){return this.config.data}get domElement(){return null}get threeElement(){return null}get video(){return null}destroy(){delete this.viewer,delete this.plugin,delete this.element,this.hideTooltip()}is3d(){return!1}isNormal(){return!1}isPoly(){return!1}isSvg(){return!1}isCss3d(){return!1}update(i){let e=fc(i,!0);if(e!==void 0&&e!==this.type)throw new ge(`cannot change marker ${i.id} type`);if(this.config=ce.deepmerge(this.config,i),typeof this.config.tooltip=="string"&&(this.config.tooltip={content:this.config.tooltip}),this.config.tooltip&&!this.config.tooltip.trigger&&(this.config.tooltip.trigger="hover"),ce.isNil(this.config.visible)&&(this.config.visible=!0),ce.isNil(this.config.zIndex)&&(this.config.zIndex=1),ce.isNil(this.config.opacity)&&(this.config.opacity=1),this.config.rotation){let t=this.config.rotation;typeof t=="object"?this.config.rotation={yaw:t.yaw?ce.parseAngle(t.yaw,!0,!1):0,pitch:t.pitch?ce.parseAngle(t.pitch,!0,!1):0,roll:t.roll?ce.parseAngle(t.roll,!0,!1):0}:this.config.rotation={yaw:0,pitch:0,roll:ce.parseAngle(t,!0,!1)}}else this.config.rotation={yaw:0,pitch:0,roll:0};this.state.anchor=ce.parsePoint(this.config.anchor)}getListContent(){return this.config.listContent?this.config.listContent:this.config.tooltip?.content?this.config.tooltip.content:this.config.html?this.config.html:this.id}showTooltip(i,e,t=!1){if(this.state.visible&&this.config.tooltip?.content&&this.state.position2D){let n={...this.config.tooltip,style:{pointerEvents:this.state.staticTooltip?"auto":"none"},data:this,top:0,left:0};if(this.isPoly()||this.is3d()||this.isCss3d())if(i||e){let s=ce.getPosition(this.viewer.container);n.top=e-s.y+10,n.left=i-s.x,n.box={width:20,height:20}}else n.top=this.state.position2D.y,n.left=this.state.position2D.x;else{let s=this.viewer.dataHelper.vector3ToViewerCoords(this.state.positions3D[0]),r=this.state.size.width,o=this.state.size.height;this.config.hoverScale&&!this.state.staticTooltip&&(r*=this.config.hoverScale.amount,o*=this.config.hoverScale.amount),n.top=s.y-o*this.state.anchor.y+o/2,n.left=s.x-r*this.state.anchor.x+r/2,n.box={width:r,height:o}}this.tooltip?t?this.tooltip.update(this.config.tooltip.content,n):this.tooltip.move(n):this.tooltip=this.viewer.createTooltip(n)}}hideTooltip(){this.tooltip&&(this.tooltip.hide(),this.tooltip=null)}},pc=class extends _p{get domElement(){return this.element}constructor(i,e,t){super(i,e,t)}afterCreateElement(){this.element[ot]=this}destroy(){delete this.element[ot],super.destroy()}update(i){super.update(i);let e=this.domElement;e.id=`psv-marker-${this.config.id}`,e.setAttribute("class","psv-marker"),this.state.visible&&e.classList.add("psv-marker--visible"),this.config.tooltip&&e.classList.add("psv-marker--has-tooltip"),this.config.content&&e.classList.add("psv-marker--has-content"),this.config.className&&ce.addClasses(e,this.config.className),e.style.opacity=`${this.config.opacity}`,e.style.zIndex=`${30+this.config.zIndex}`,this.config.style&&Object.assign(e.style,this.config.style)}},Ea=class extends pc{constructor(i,e,t){super(i,e,t)}afterCreateElement(){super.afterCreateElement(),this.domElement.addEventListener("transitionend",()=>{this.domElement.style.transition=""})}render({viewerPosition:i,zoomLevel:e,hoveringMarker:t}){this.__updateSize();let n=this.viewer.dataHelper.vector3ToViewerCoords(this.state.positions3D[0]);return n.x-=this.state.size.width*this.state.anchor.x,n.y-=this.state.size.height*this.state.anchor.y,this.state.positions3D[0].dot(this.viewer.state.direction)>0&&n.x+this.state.size.width>=0&&n.x-this.state.size.width<=this.viewer.state.size.width&&n.y+this.state.size.height>=0&&n.y-this.state.size.height<=this.viewer.state.size.height?(this.domElement.style.translate=`${n.x}px ${n.y}px 0px`,this.applyScale({zoomLevel:e,viewerPosition:i,mouseover:this===t}),n):null}update(i){if(super.update(i),!ce.isExtendedPosition(this.config.position))throw new ge(`missing marker ${this.id} position`);try{this.state.position=this.viewer.dataHelper.cleanPosition(this.config.position)}catch(t){throw new ge(`invalid marker ${this.id} position`,t)}this.state.positions3D=[this.viewer.dataHelper.sphericalCoordsToVector3(this.state.position)];let e=this.domElement;e.classList.add("psv-marker--normal"),this.config.scale&&Array.isArray(this.config.scale)&&(this.config.scale={zoom:this.config.scale}),typeof this.config.hoverScale=="boolean"?this.config.hoverScale=this.config.hoverScale?this.plugin.config.defaultHoverScale||dc:null:typeof this.config.hoverScale=="number"?this.config.hoverScale={amount:this.config.hoverScale}:this.config.hoverScale||(this.config.hoverScale=this.plugin.config.defaultHoverScale),this.config.hoverScale&&(this.config.hoverScale={...this.plugin.config.defaultHoverScale,...this.config.hoverScale}),e.style.rotate=this.config.rotation.roll!==0?Re.radToDeg(this.config.rotation.roll)+"deg":null,e.style.transformOrigin=`${this.state.anchor.x*100}% ${this.state.anchor.y*100}%`}__updateSize(){if(!this.needsUpdateSize)return;let i=this.domElement,e=!this.state.visible||!this.state.size;if(e&&i.classList.add("psv-marker--transparent"),this.isSvg()){let t=i.firstElementChild.getBoundingClientRect();this.state.size={width:t.width,height:t.height}}else this.state.size={width:i.offsetWidth,height:i.offsetHeight};e&&i.classList.remove("psv-marker--transparent"),this.isSvg()&&(i.style.width=this.state.size.width+"px",i.style.height=this.state.size.height+"px"),this.type!=="element"&&(this.needsUpdateSize=!1)}applyScale({zoomLevel:i,viewerPosition:e,mouseover:t}){t!==null&&this.config.hoverScale&&(this.domElement.style.transition=`scale ${this.config.hoverScale.duration}ms ${this.config.hoverScale.easing}`);let n=1;if(typeof this.config.scale=="function")n=this.config.scale(i,e);else if(this.config.scale){if(Array.isArray(this.config.scale.zoom)){let[s,r]=this.config.scale.zoom;n*=s+(r-s)*Gi.EASINGS.inQuad(i/100)}if(Array.isArray(this.config.scale.yaw)){let[s,r]=this.config.scale.yaw,o=Re.degToRad(this.viewer.state.hFov)/2,a=Math.abs(ce.getShortestArc(this.state.position.yaw,e.yaw));n*=r+(s-r)*Gi.EASINGS.outQuad(Math.max(0,(o-a)/o))}}t&&this.config.hoverScale&&(n*=this.config.hoverScale.amount),this.domElement.style.scale=`${n}`}},Zy=`// https://www.8thwall.com/playground/chromakey-threejs

uniform sampler2D map;
uniform float alpha;
uniform bool keying;
uniform vec3 color;
uniform float similarity;
uniform float smoothness;
uniform float spill;

varying vec2 vUv;

vec2 RGBtoUV(vec3 rgb) {
    return vec2(
        rgb.r * -0.169 + rgb.g * -0.331 + rgb.b *  0.5    + 0.5,
        rgb.r *  0.5   + rgb.g * -0.419 + rgb.b * -0.081  + 0.5
    );
}

void main(void) {
    gl_FragColor = texture2D(map, vUv);

    if (keying) {
        float chromaDist = distance(RGBtoUV(gl_FragColor.rgb), RGBtoUV(color));

        float baseMask = chromaDist - similarity;
        float fullMask = pow(clamp(baseMask / smoothness, 0., 1.), 1.5);
        gl_FragColor.a *= fullMask * alpha;

        float spillVal = pow(clamp(baseMask / spill, 0., 1.), 1.5);
        float desat = clamp(gl_FragColor.r * 0.2126 + gl_FragColor.g * 0.7152 + gl_FragColor.b * 0.0722, 0., 1.);
        gl_FragColor.rgb = mix(vec3(desat, desat, desat), gl_FragColor.rgb, spillVal);
    } else {
        gl_FragColor.a *= alpha;
    }
}
`,$y=`varying vec2 vUv;
uniform vec2 repeat;
uniform vec2 offset;

void main() {
    vUv = uv * repeat + offset;
    gl_Position = projectionMatrix *  modelViewMatrix * vec4( position, 1.0 );
}
`,Ky=class extends Yt{get map(){return this.uniforms.map.value}set map(i){this.uniforms.map.value=i}set alpha(i){this.uniforms.alpha.value=i}get offset(){return this.uniforms.offset.value}get repeat(){return this.uniforms.repeat.value}set chromaKey(i){this.uniforms.keying.value=i?.enabled===!0,i?.enabled&&(typeof i.color=="object"&&"r"in i.color?this.uniforms.color.value.set(i.color.r/255,i.color.g/255,i.color.b/255):this.uniforms.color.value.set(i.color??65280),this.uniforms.similarity.value=i.similarity??.2,this.uniforms.smoothness.value=i.smoothness??.2)}constructor(i){super({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{map:{value:i?.map},repeat:{value:new Oe(1,1)},offset:{value:new Oe(0,0)},alpha:{value:i?.alpha??1},keying:{value:!1},color:{value:new qe(65280)},similarity:{value:.2},smoothness:{value:.2},spill:{value:.1}},vertexShader:$y,fragmentShader:Zy}),this.chromaKey=i?.chromaKey}};function Jy({src:i,withCredentials:e,muted:t,autoplay:n}){let s=document.createElement("video");return s.crossOrigin=e?"use-credentials":"anonymous",s.loop=!0,s.playsInline=!0,s.autoplay=n,s.muted=t,s.preload="metadata",i instanceof MediaStream?s.srcObject=i:s.src=i,s}function jy(i,e,t){let[n,s]=i,[r,o]=e,a=ce.greatArcDistance(i,e),l=Math.sin((1-t)*a)/Math.sin(a),c=Math.sin(t*a)/Math.sin(a),h=l*Math.cos(s)*Math.cos(n)+c*Math.cos(o)*Math.cos(r),f=l*Math.cos(s)*Math.sin(n)+c*Math.cos(o)*Math.sin(r),p=l*Math.sin(s)+c*Math.sin(o);return[Math.atan2(f,h),Math.atan2(p,Math.sqrt(h*h+f*f))]}function yp(i){let e=[i[0]],t=0;for(let n=1;n<i.length;n++){let s=i[n-1][0]-i[n][0];s>Math.PI?t+=1:s<-Math.PI&&(t-=1),e.push([i[n][0]+t*2*Math.PI,i[n][1]])}return e}function xp(i){let t=yp(i).reduce((n,s)=>[n[0]+s[0],n[1]+s[1]]);return[ce.parseAngle(t[0]/i.length),t[1]/i.length]}function Qy(i){let e=yp(i),t=0,n=[];for(let r=0;r<e.length-1;r++){let o=ce.greatArcDistance(e[r],e[r+1])*Gi.SPHERE_RADIUS;n.push(o),t+=o}let s=0;for(let r=0;r<e.length-1;r++){if(s+n[r]>t/2){let o=(t/2-s)/n[r];return jy(e[r],e[r+1],o)}s+=n[r]}return e[Math.round(e.length/2)]}var wa=new U,Ff=new U,hc=new U,Bf=new U,kf=new U,zf=new U;function ex(i,e,t){wa.copy(t).normalize(),Ff.crossVectors(i,e).normalize(),hc.crossVectors(Ff,i).normalize(),Bf.copy(i).multiplyScalar(-wa.dot(hc)),kf.copy(hc).multiplyScalar(wa.dot(i));let n=new U().addVectors(Bf,kf).normalize();return zf.crossVectors(n,wa),n.applyAxisAngle(zf,.01).multiplyScalar(Gi.SPHERE_RADIUS)}var tx=class extends _p{get threeElement(){return this.element}get threeMesh(){return this.threeElement.children[0]}get video(){return this.type==="videoLayer"?this.threeMesh.material.map.image:null}constructor(i,e,t){super(i,e,t)}is3d(){return!0}createElement(){let i=new Ky({alpha:0}),e=new bn(1,1),t=new pt(e,i);t.userData={[ot]:this},Object.defineProperty(t,"visible",{enumerable:!0,get:function(){return this.userData[ot].config.visible},set:function(n){this.userData[ot].config.visible=n}}),this.element=new ti().add(t),this.type==="videoLayer"&&this.viewer.needsContinuousUpdate(!0)}destroy(){delete this.threeMesh.userData[ot],this.type==="videoLayer"&&(this.video.pause(),this.viewer.needsContinuousUpdate(!1)),super.destroy()}render(){return this.viewer.renderer.isObjectVisible(this.threeMesh)?this.viewer.dataHelper.sphericalCoordsToViewerCoords(this.state.position):null}update(i){super.update(i);let e=this.threeMesh,t=e.parent,n=e.material;if(ce.isExtendedPosition(this.config.position)){try{this.state.position=this.viewer.dataHelper.cleanPosition(this.config.position)}catch(r){throw new ge(`invalid marker ${this.id} position`,r)}if(!this.config.size)throw new ge(`missing marker ${this.id} size`);this.state.size=this.config.size,e.scale.set(this.config.size.width/100,this.config.size.height/100,1),e.position.set(e.scale.x*(.5-this.state.anchor.x),e.scale.y*(this.state.anchor.y-.5),0),e.rotation.set(0,0,0),this.viewer.dataHelper.sphericalCoordsToVector3(this.state.position,t.position),t.lookAt(0,t.position.y,0),e.rotateY(-this.config.rotation.yaw),e.rotateX(-this.config.rotation.pitch),e.rotateZ(-this.config.rotation.roll);let s=e.geometry.getAttribute("position");this.state.positions3D=[0,1,3,2].map(r=>{let o=new U;return o.fromBufferAttribute(s,r),e.localToWorld(o)})}else{if(this.config.position?.length!==4)throw new ge(`missing marker ${this.id} position`);let s;try{s=this.config.position.map(l=>this.viewer.dataHelper.cleanPosition(l))}catch(l){throw new ge(`invalid marker ${this.id} position`,l)}let r=s.map(l=>this.viewer.dataHelper.sphericalCoordsToVector3(l)),o=xp(s.map(({yaw:l,pitch:c})=>[l,c]));this.state.position={yaw:o[0],pitch:o[1]},this.state.positions3D=r;let a=e.geometry.getAttribute("position");[r[0],r[1],r[3],r[2]].forEach((l,c)=>{a.setX(c,l.x),a.setY(c,l.y),a.setZ(c,l.z)}),a.needsUpdate=!0,this.__setTextureWrap(n)}switch(this.type){case"videoLayer":if(this.definition!==this.config.videoLayer){n.map?.dispose();let s=Jy({src:this.config.videoLayer,withCredentials:this.viewer.config.withCredentials(this.config.videoLayer),muted:!0,autoplay:this.config.autoplay??!0}),r=new Us(s);n.map=r,n.alpha=0,s.addEventListener("loadedmetadata",()=>{this.viewer&&(n.alpha=this.config.opacity,ce.isExtendedPosition(this.config.position)||(e.material.userData[ot]={width:s.videoWidth,height:s.videoHeight},this.__setTextureWrap(n)))},{once:!0}),s.autoplay&&s.play(),this.definition=this.config.videoLayer}else n.alpha=this.config.opacity;break;case"imageLayer":if(this.definition!==this.config.imageLayer){n.map?.dispose();let s=new xt;n.map=s,n.alpha=0,this.viewer.textureLoader.loadImage(this.config.imageLayer).then(r=>{this.viewer&&(ce.isExtendedPosition(this.config.position)||(e.material.userData[ot]={width:r.width,height:r.height},this.__setTextureWrap(n)),s.image=r,s.anisotropy=4,s.needsUpdate=!0,n.alpha=this.config.opacity,this.viewer.needsUpdate())}),this.definition=this.config.imageLayer}else n.alpha=this.config.opacity;break}n.chromaKey=this.config.chromaKey,e.renderOrder=1e3+this.config.zIndex,e.geometry.boundingBox=null}__setTextureWrap(i){let e=i.userData[ot];if(!e||!e.height||!e.width){i.repeat.set(1,1),i.offset.set(0,0);return}let t=this.config.position.map(f=>this.viewer.dataHelper.cleanPosition(f)),n=ce.greatArcDistance([t[0].yaw,t[0].pitch],[t[1].yaw,t[1].pitch]),s=ce.greatArcDistance([t[3].yaw,t[3].pitch],[t[2].yaw,t[2].pitch]),r=ce.greatArcDistance([t[1].yaw,t[1].pitch],[t[2].yaw,t[2].pitch]),o=ce.greatArcDistance([t[0].yaw,t[0].pitch],[t[3].yaw,t[3].pitch]),a=(n+s)/(r+o),l=e.width/e.height,c=0,h=0;a<l?c=l-a:h=1/l-1/a,i.repeat.set(1-c,1-h),i.offset.set(c/2,h/2)}},ix=class extends pc{constructor(i,e,t){super(i,e,t),this.viewportIntersection=!1}get threeElement(){return this.object}isCss3d(){return!0}createElement(){this.element=document.createElement("div"),this.object=new Wy(this.element),this.object.userData={[ot]:this},Object.defineProperty(this.object,"visible",{enumerable:!0,get:function(){return this.userData[ot].config.visible},set:function(i){this.userData[ot].config.visible=i}}),this.afterCreateElement()}destroy(){delete this.object.userData[ot],delete this.object,super.destroy()}render({viewerPosition:i,zoomLevel:e}){let t=this.domElement;if(this.state.size={width:t.offsetWidth,height:t.offsetHeight},this.state.positions3D[0].dot(this.viewer.state.direction)>0&&this.viewportIntersection){let s=this.viewer.dataHelper.sphericalCoordsToViewerCoords(this.state.position);return this.config.elementLayer.updateMarker?.({marker:this,position:s,viewerPosition:i,zoomLevel:e,viewerSize:this.viewer.state.size}),s}else return null}update(i){if(super.update(i),!ce.isExtendedPosition(this.config.position))throw new ge(`missing marker ${this.id} position`);try{this.state.position=this.viewer.dataHelper.cleanPosition(this.config.position)}catch(n){throw new ge(`invalid marker ${this.id} position`,n)}this.state.positions3D=[this.viewer.dataHelper.sphericalCoordsToVector3(this.state.position)];let e=this.threeElement,t=this.domElement;t.classList.add("psv-marker--css3d"),t.childNodes.forEach(n=>n.remove()),t.appendChild(this.config.elementLayer),this.config.elementLayer.style.display="block",e.position.copy(this.state.positions3D[0]).multiplyScalar(100),e.lookAt(0,this.state.positions3D[0].y*100,0),e.rotateY(-this.config.rotation.yaw),e.rotateX(-this.config.rotation.pitch),e.rotateZ(-this.config.rotation.roll)}},nx=class extends Ea{constructor(i,e,t){super(i,e,t)}isNormal(){return!0}createElement(){this.element=document.createElement("div"),this.afterCreateElement()}render(i){let e=super.render(i);return e&&this.type==="element"&&this.config.element.updateMarker?.({marker:this,position:e,viewerPosition:i.viewerPosition,zoomLevel:i.zoomLevel,viewerSize:this.viewer.state.size}),e}update(i){super.update(i);let e=this.domElement;if(this.config.image&&!this.config.size)throw new ge(`missing marker ${this.id} size`);switch(this.config.size?(this.needsUpdateSize=!1,this.state.size=this.config.size,e.style.width=this.config.size.width+"px",e.style.height=this.config.size.height+"px"):this.needsUpdateSize=!0,this.type){case"image":this.definition=this.config.image,e.style.backgroundImage=`url("${this.config.image}")`;break;case"html":this.definition=this.config.html,e.innerHTML=this.config.html;break;case"element":this.definition!==this.config.element&&(this.definition=this.config.element,e.childNodes.forEach(t=>t.remove()),e.appendChild(this.config.element),this.config.element.style.display="block");break}}},sx=class extends pc{constructor(i,e,t){super(i,e,t)}createElement(){this.element=document.createElementNS(Sa,"path"),this.element[ot]=this}isPoly(){return!0}get isPixels(){return this.type==="polygonPixels"||this.type==="polylinePixels"}get isPolygon(){return this.type==="polygon"||this.type==="polygonPixels"}get isPolyline(){return this.type==="polyline"||this.type==="polylinePixels"}get coords(){return this.definition}render(){let i=this.__getAllPolyPositions();if(i[0].length>(this.isPolygon?2:1)){let t=this.viewer.dataHelper.sphericalCoordsToViewerCoords(this.state.position),n=i.filter(s=>s.length>0).map(s=>{let r="M";return r+=s.map(o=>`${o.x-t.x},${o.y-t.y}`).join("L"),this.isPolygon&&(r+="Z"),r}).join(" ");return this.domElement.setAttributeNS(null,"d",n),this.domElement.setAttributeNS(null,"transform",`translate(${t.x} ${t.y})`),t}else return null}update(i){super.update(i);let e=this.domElement;e.classList.add("psv-marker--poly"),this.config.svgStyle?(Object.entries(this.config.svgStyle).forEach(([n,s])=>{e.setAttributeNS(null,ce.dasherize(n),s)}),this.isPolyline&&!this.config.svgStyle.fill&&e.setAttributeNS(null,"fill","none")):this.isPolygon?e.setAttributeNS(null,"fill","rgba(0,0,0,0.5)"):this.isPolyline&&(e.setAttributeNS(null,"fill","none"),e.setAttributeNS(null,"stroke","rgb(0,0,0)"));try{let n=this.config[this.type];if(!Array.isArray(n[0])&&typeof n[0]!="object")for(let s=0;s<n.length;s++)n.splice(s,2,[n[s],n[s+1]]);if(!Array.isArray(n[0][0])&&typeof n[0][0]!="object"&&(n=[n]),this.isPolyline&&n.length>1)throw new ge("polylines cannot have holes");this.isPixels?this.definition=n.map(s=>s.map(r=>{let o;return ce.isExtendedPosition(r)?o=this.viewer.dataHelper.cleanPosition(r):o=this.viewer.dataHelper.textureCoordsToSphericalCoords({textureX:r[0],textureY:r[1]}),[o.yaw,o.pitch]})):this.definition=n.map(s=>s.map(r=>{let o;return ce.isExtendedPosition(r)?o=this.viewer.dataHelper.cleanPosition(r):o=this.viewer.dataHelper.cleanPosition({yaw:r[0],pitch:r[1]}),[o.yaw,o.pitch]}))}catch(n){throw new ge(`invalid marker ${this.id} position`,n)}let t=this.isPolygon?xp(this.coords[0]):Qy(this.coords[0]);this.state.position={yaw:t[0],pitch:t[1]},this.positions3D=this.coords.map(n=>n.map(s=>this.viewer.dataHelper.sphericalCoordsToVector3({yaw:s[0],pitch:s[1]}))),this.state.positions3D=this.positions3D[0]}__getAllPolyPositions(){return this.positions3D.map(i=>this.__getPolyPositions(i))}__getPolyPositions(i){let e=i.length,t=i.map(s=>({vector:s,visible:s.dot(this.viewer.state.direction)>0})),n=[];return t.forEach((s,r)=>{s.visible||[r===0?t[e-1]:t[r-1],r===e-1?t[0]:t[r+1]].forEach(a=>{a.visible&&n.push({visible:a.vector,invisible:s.vector,index:r})})}),n.reverse().forEach(s=>{t.splice(s.index,0,{vector:ex(s.visible,s.invisible,this.viewer.state.direction),visible:!0})}),t.filter(s=>s.visible).map(s=>this.viewer.dataHelper.vector3ToViewerCoords(s.vector))}},rx=class extends Ea{get svgElement(){return this.domElement.firstElementChild}constructor(i,e,t){super(i,e,t)}isSvg(){return!0}createElement(){let i=this.type==="square"?"rect":this.type,e=document.createElementNS(Sa,i);this.element=document.createElementNS(Sa,"svg"),this.element.appendChild(e),this.afterCreateElement()}update(i){super.update(i);let e=this.svgElement;switch(this.needsUpdateSize=!0,this.type){case"square":this.definition={x:0,y:0,width:this.config.square,height:this.config.square};break;case"rect":Array.isArray(this.config.rect)?this.definition={x:0,y:0,width:this.config.rect[0],height:this.config.rect[1]}:this.definition={x:0,y:0,width:this.config.rect.width,height:this.config.rect.height};break;case"circle":this.definition={cx:this.config.circle,cy:this.config.circle,r:this.config.circle};break;case"ellipse":Array.isArray(this.config.ellipse)?this.definition={cx:this.config.ellipse[0],cy:this.config.ellipse[1],rx:this.config.ellipse[0],ry:this.config.ellipse[1]}:this.definition={cx:this.config.ellipse.rx,cy:this.config.ellipse.ry,rx:this.config.ellipse.rx,ry:this.config.ellipse.ry};break;case"path":this.definition={d:this.config.path};break}Object.entries(this.definition).forEach(([t,n])=>{e.setAttributeNS(null,t,n)}),this.config.svgStyle?Object.entries(this.config.svgStyle).forEach(([t,n])=>{e.setAttributeNS(null,ce.dasherize(t),n)}):e.setAttributeNS(null,"fill","rgba(0,0,0,0.5)")}},ox=ce.getConfigParser({clickEventOnMarker:!1,gotoMarkerSpeed:"8rpm",markers:null,defaultHoverScale:null},{defaultHoverScale(i){return i?(i===!0&&(i=dc),typeof i=="number"&&(i={amount:i}),{...dc,...i}):null}});function ax(i){switch(fc(i,!1)){case"image":case"html":case"element":return nx;case"imageLayer":case"videoLayer":return tx;case"elementLayer":return ix;case"polygon":case"polyline":case"polygonPixels":case"polylinePixels":return sx;case"square":case"rect":case"circle":case"ellipse":case"path":return rx;default:throw new ge("invalid marker type")}}var fs=class extends dr{constructor(i,e){super(i,e),this.markers={},this.state={allVisible:!0,showAllTooltips:!1,currentMarker:null,hoveringMarker:null,needsReRender:!1,lastClientX:null,lastClientY:null},this.container=document.createElement("div"),this.container.className="psv-markers",this.viewer.container.appendChild(this.container),this.container.addEventListener("contextmenu",t=>t.preventDefault()),this.svgContainer=document.createElementNS(Sa,"svg"),this.svgContainer.setAttribute("class","psv-markers-svg-container"),this.container.appendChild(this.svgContainer),this.css3DContainer=new qy(i),this.container.appendChild(this.css3DContainer.element),this.container.addEventListener("mouseenter",this,!0),this.container.addEventListener("mouseleave",this,!0),this.container.addEventListener("mousemove",this,!0)}init(){super.init(),ce.checkStylesheet(this.viewer.container,"markers-plugin"),this.viewer.addEventListener(ye.ClickEvent.type,this),this.viewer.addEventListener(ye.DoubleClickEvent.type,this),this.viewer.addEventListener(ye.RenderEvent.type,this),this.viewer.addEventListener(ye.ConfigChangedEvent.type,this),this.viewer.addEventListener(ye.ObjectEnterEvent.type,this),this.viewer.addEventListener(ye.ObjectHoverEvent.type,this),this.viewer.addEventListener(ye.ObjectLeaveEvent.type,this),this.viewer.addEventListener(ye.ReadyEvent.type,this,{once:!0})}destroy(){this.clearMarkers(!1),this.viewer.unobserveObjects(ot),this.viewer.removeEventListener(ye.ClickEvent.type,this),this.viewer.removeEventListener(ye.DoubleClickEvent.type,this),this.viewer.removeEventListener(ye.RenderEvent.type,this),this.viewer.removeEventListener(ye.ObjectEnterEvent.type,this),this.viewer.removeEventListener(ye.ObjectHoverEvent.type,this),this.viewer.removeEventListener(ye.ObjectLeaveEvent.type,this),this.viewer.removeEventListener(ye.ReadyEvent.type,this),this.css3DContainer.destroy(),this.viewer.container.removeChild(this.container),super.destroy()}handleEvent(i){switch(i.type){case ye.ReadyEvent.type:this.config.markers&&(this.setMarkers(this.config.markers),delete this.config.markers);break;case ye.RenderEvent.type:this.renderMarkers();break;case ye.ClickEvent.type:this.__onClick(i,!1);break;case ye.DoubleClickEvent.type:this.__onClick(i,!0);break;case ye.ObjectEnterEvent.type:case ye.ObjectLeaveEvent.type:case ye.ObjectHoverEvent.type:if(i.userDataKey===ot){let e=i.originalEvent,t=i.object.userData[ot];switch(i.type){case ye.ObjectEnterEvent.type:t.config.style?.cursor?this.viewer.setCursor(t.config.style.cursor):(t.config.tooltip||t.config.content)&&this.viewer.setCursor("pointer"),this.__onEnterMarker(e,t);break;case ye.ObjectLeaveEvent.type:this.viewer.setCursor(null),this.__onLeaveMarker(t);break;case ye.ObjectHoverEvent.type:this.__onHoverMarker(e,t);break}}break;case"mouseenter":{let e=this.__getTargetMarker(ce.getEventTarget(i));this.__onEnterMarker(i,e);break}case"mouseleave":{let e=this.__getTargetMarker(ce.getEventTarget(i));this.__onLeaveMarker(e);break}case"mousemove":{let e=this.__getTargetMarker(ce.getEventTarget(i),!0);this.__onHoverMarker(i,e);break}}}toggleAllMarkers(){this.state.allVisible?this.hideAllMarkers():this.showAllMarkers()}showAllMarkers(){this.state.allVisible=!0,Object.values(this.markers).forEach(i=>{i.config.visible=!0}),this.renderMarkers(),this.dispatchEvent(new gr)}hideAllMarkers(){this.state.allVisible=!1,Object.values(this.markers).forEach(i=>{i.config.visible=!1}),this.renderMarkers(),this.dispatchEvent(new mr)}toggleAllTooltips(){this.state.showAllTooltips?this.hideAllTooltips():this.showAllTooltips()}showAllTooltips(){this.state.showAllTooltips=!0,Object.values(this.markers).forEach(i=>{i.state.staticTooltip=!0,i.showTooltip()})}hideAllTooltips(){this.state.showAllTooltips=!1,Object.values(this.markers).forEach(i=>{i.state.staticTooltip=!1,i.hideTooltip()})}getNbMarkers(){return Object.keys(this.markers).length}getMarkers(){return Object.values(this.markers)}addMarker(i,e=!0){if(this.markers[i.id])throw new ge(`marker "${i.id}" already exists`);let t=new(ax(i))(this.viewer,this,i);t.isPoly()?this.svgContainer.appendChild(t.domElement):t.isCss3d()?this.css3DContainer.addObject(t):t.is3d()?this.viewer.renderer.addObject(t.threeElement):this.container.appendChild(t.domElement),this.markers[t.id]=t,this.state.showAllTooltips&&(t.state.staticTooltip=!0),e&&this.__afterChangeMarkers()}getMarker(i){let e=typeof i=="object"?i.id:i;if(!this.markers[e])throw new ge(`cannot find marker "${e}"`);return this.markers[e]}getCurrentMarker(){return this.state.currentMarker}updateMarker(i,e=!0){let t=this.getMarker(i.id);t.update(i),e&&(this.__afterChangeMarkers(),(t===this.state.hoveringMarker&&t.config.tooltip?.trigger==="hover"||t.state.staticTooltip)&&t.showTooltip(this.state.lastClientX,this.state.lastClientY,!0))}removeMarker(i,e=!0){let t=this.getMarker(i);t.isPoly()?this.svgContainer.removeChild(t.domElement):t.isCss3d()?this.css3DContainer.removeObject(t):t.is3d()?this.viewer.renderer.removeObject(t.threeElement):this.container.removeChild(t.domElement),this.state.hoveringMarker===t&&(this.state.hoveringMarker=null),this.state.currentMarker===t&&(this.state.currentMarker=null),t.destroy(),delete this.markers[t.id],e&&this.__afterChangeMarkers()}removeMarkers(i,e=!0){i.forEach(t=>this.removeMarker(t,!1)),e&&this.__afterChangeMarkers()}setMarkers(i,e=!0){this.clearMarkers(!1),i?.forEach(t=>{this.addMarker(t,!1)}),e&&this.__afterChangeMarkers()}clearMarkers(i=!0){Object.keys(this.markers).forEach(e=>{this.removeMarker(e,!1)}),i&&this.__afterChangeMarkers()}gotoMarker(i,e=this.config.gotoMarkerSpeed){let t=this.getMarker(i);return e?this.viewer.animate({...t.state.position,zoom:t.config.zoomLvl,speed:e}).then(()=>{this.dispatchEvent(new uc(t))}):(this.viewer.rotate(t.state.position),ce.isNil(t.config.zoomLvl)||this.viewer.zoom(t.config.zoomLvl),this.dispatchEvent(new uc(t)),Promise.resolve())}hideMarker(i){this.toggleMarker(i,!1)}showMarker(i){this.toggleMarker(i,!0)}showMarkerTooltip(i){let e=this.getMarker(i);e.state.staticTooltip=!0,e.showTooltip()}hideMarkerTooltip(i){let e=this.getMarker(i);e.state.staticTooltip=!1,e.hideTooltip()}toggleMarker(i,e){let t=this.getMarker(i);t.config.visible=ce.isNil(e)?!t.config.visible:e,this.renderMarkers()}showMarkerPanel(i){let e=this.getMarker(i);e.config.content?this.viewer.panel.show({id:pr,content:e.config.content}):this.hideMarkerPanel()}hideMarkerPanel(){this.viewer.panel.hide(pr)}toggleMarkersList(){this.viewer.panel.isVisible(ds)?this.hideMarkersList():this.showMarkersList()}showMarkersList(){let i=[];Object.values(this.markers).forEach(t=>{t.config.visible&&!t.config.hideList&&i.push(t)});let e=new gp(i);this.dispatchEvent(e),i=e.markers,this.viewer.panel.show({id:ds,content:Hy(i,this.viewer.config.lang[vr.id]),noMargin:!0,clickHandler:t=>{let n=ce.getClosest(t,".psv-panel-menu-item"),s=n?n.dataset[ot]:void 0;if(s){let r=this.getMarker(s);this.dispatchEvent(new np(r)),this.gotoMarker(r.id),this.hideMarkersList()}}})}hideMarkersList(){this.viewer.panel.hide(ds)}renderMarkers(){if(this.state.needsReRender){this.state.needsReRender=!1;return}let i=this.viewer.getZoomLevel(),e=this.viewer.getPosition(),t=this.state.hoveringMarker;Object.values(this.markers).forEach(n=>{let s=n.config.visible,r=!1,o=null;s&&(o=n.render({viewerPosition:e,zoomLevel:i,hoveringMarker:t}),s=!!o),r=n.state.visible!==s,n.state.visible=s,n.state.position2D=o,n.domElement&&ce.toggleClass(n.domElement,"psv-marker--visible",s),s?n.state.staticTooltip?n.showTooltip():n!==this.state.hoveringMarker&&n.hideTooltip():n.hideTooltip(),r&&(this.dispatchEvent(new Gf(n,s)),(n.is3d()||n.isCss3d())&&(this.state.needsReRender=!0))}),this.state.needsReRender&&this.viewer.needsUpdate()}__getTargetMarker(i,e=!1){if(i instanceof Node){let t=e?ce.getClosest(i,".psv-marker"):i;return t?t[ot]:void 0}else return Array.isArray(i)?i.map(t=>t.userData[ot]).filter(t=>!!t).sort((t,n)=>n.config.zIndex-t.config.zIndex)[0]:null}__onEnterMarker(i,e){e&&(this.state.hoveringMarker=e,this.state.lastClientX=i.clientX,this.state.lastClientY=i.clientY,this.dispatchEvent(new Jf(e)),e instanceof Ea&&e.applyScale({zoomLevel:this.viewer.getZoomLevel(),viewerPosition:this.viewer.getPosition(),mouseover:!0}),!e.state.staticTooltip&&e.config.tooltip?.trigger==="hover"&&e.showTooltip(i.clientX,i.clientY))}__onLeaveMarker(i){i&&(this.dispatchEvent(new Zf(i)),i instanceof Ea&&i.applyScale({zoomLevel:this.viewer.getZoomLevel(),viewerPosition:this.viewer.getPosition(),mouseover:!1}),this.state.hoveringMarker=null,!i.state.staticTooltip&&i.config.tooltip?.trigger==="hover"?i.hideTooltip():i.state.staticTooltip&&i.showTooltip())}__onHoverMarker(i,e){e&&(this.state.lastClientX=i.clientX,this.state.lastClientY=i.clientY,(e.isPoly()||e.is3d()||e.isCss3d())&&e.config.tooltip?.trigger==="hover"&&e.showTooltip(i.clientX,i.clientY))}__onClick(i,e){let t=this.__getTargetMarker(i.data.objects),s=this.__getTargetMarker(i.data.target,!0)||t;this.state.currentMarker&&this.state.currentMarker!==s&&(this.dispatchEvent(new op(this.state.currentMarker)),this.viewer.panel.hide(pr),!this.state.showAllTooltips&&this.state.currentMarker.config.tooltip?.trigger==="click"&&this.hideMarkerTooltip(this.state.currentMarker.id),this.state.currentMarker=null),s&&(this.state.currentMarker=s,this.dispatchEvent(new ep(s,e,i.data.rightclick)),this.config.clickEventOnMarker?i.data.marker=s:i.stopImmediatePropagation(),this.markers[s.id]&&!i.data.rightclick&&(s.config.tooltip?.trigger==="click"?s.tooltip?this.hideMarkerTooltip(s.id):this.showMarkerTooltip(s.id):this.showMarkerPanel(s.id)))}__afterChangeMarkers(){this.__refreshUi(),this.__checkObjectsObserver(),this.viewer.needsUpdate(),this.dispatchEvent(new up(this.getMarkers()))}__refreshUi(){let i=Object.values(this.markers).filter(e=>!e.config.hideList).length;i===0?(this.viewer.panel.hide(pr),this.viewer.panel.hide(ds)):this.viewer.panel.isVisible(ds)?this.showMarkersList():this.viewer.panel.isVisible(pr)&&(this.state.currentMarker?this.showMarkerPanel(this.state.currentMarker.id):this.viewer.panel.hide()),this.viewer.navbar.getButton(vr.id,!1)?.toggle(i>0),this.viewer.navbar.getButton(Ta.id,!1)?.toggle(i>0)}__checkObjectsObserver(){Object.values(this.markers).some(e=>e.is3d())?this.viewer.observeObjects(ot):this.viewer.unobserveObjects(ot)}};fs.id="markers";fs.VERSION="5.13.3";fs.configParser=ox;fs.readonlyOptions=["markers"];ri.lang[vr.id]="Markers";ri.lang[Ta.id]="Markers list";us(vr,"caption:left");us(Ta,"caption:left");var lx=Object.defineProperty,cx=(i,e)=>{for(var t in e)lx(i,t,{get:e[t],enumerable:!0})},hx={};cx(hx,{AutorotateEvent:()=>ps});var Mp=class wp extends cr{constructor(e){super(wp.type),this.autorotateEnabled=e}};Mp.type="autorotate";var ps=Mp,ux=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 41" overflow="visible"><g fill="currentColor" transform-origin="center" transform="scale(1.3)"><path d="M40.5 14.1c-.1-.1-1.2-.5-2.898-1-.102 0-.202-.1-.202-.2C34.5 6.5 28 2 20.5 2S6.6 6.5 3.7 12.9c0 .1-.1.1-.2.2-1.7.6-2.8 1-2.9 1l-.6.3v12.1l.6.2c.1 0 1.1.399 2.7.899.1 0 .2.101.2.199C6.3 34.4 12.9 39 20.5 39c7.602 0 14.102-4.6 16.9-11.1 0-.102.1-.102.199-.2 1.699-.601 2.699-1 2.801-1l.6-.3V14.3l-.5-.2zM6.701 11.5C9.7 7 14.8 4 20.5 4c5.8 0 10.9 3 13.8 7.5.2.3-.1.6-.399.5-3.799-1-8.799-2-13.6-2-4.7 0-9.5 1-13.2 2-.3.1-.5-.2-.4-.5zM25.1 20.3L18.7 24c-.3.2-.7 0-.7-.5v-7.4c0-.4.4-.6.7-.4l6.399 3.8c.301.1.301.6.001.8zm9.4 8.901A16.421 16.421 0 0 1 20.5 37c-5.9 0-11.1-3.1-14-7.898-.2-.302.1-.602.4-.5 3.9 1 8.9 2.1 13.6 2.1 5 0 9.9-1 13.602-2 .298-.1.5.198.398.499z"/></g><!--Created by Nick Bluth from the Noun Project--></svg>
`,dx=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 41" overflow="visible"><g fill="currentColor" transform-origin="center" transform="scale(1.3)"><path d="M40.5 14.1c-.1-.1-1.2-.5-2.899-1-.101 0-.2-.1-.2-.2C34.5 6.5 28 2 20.5 2S6.6 6.5 3.7 12.9c0 .1-.1.1-.2.2-1.7.6-2.8 1-2.9 1l-.6.3v12.1l.6.2c.1 0 1.1.4 2.7.9.1 0 .2.1.2.199C6.3 34.4 12.9 39 20.5 39c7.601 0 14.101-4.6 16.9-11.1 0-.101.1-.101.2-.2 1.699-.6 2.699-1 2.8-1l.6-.3V14.3l-.5-.2zM20.5 4c5.8 0 10.9 3 13.8 7.5.2.3-.1.6-.399.5-3.8-1-8.8-2-13.6-2-4.7 0-9.5 1-13.2 2-.3.1-.5-.2-.4-.5C9.7 7 14.8 4 20.5 4zm0 33c-5.9 0-11.1-3.1-14-7.899-.2-.301.1-.601.4-.5 3.9 1 8.9 2.1 13.6 2.1 5 0 9.9-1 13.601-2 .3-.1.5.2.399.5A16.422 16.422 0 0 1 20.5 37zm18.601-12.1c0 .1-.101.3-.2.3-2.5.9-10.4 3.6-18.4 3.6-7.1 0-15.6-2.699-18.3-3.6C2.1 25.2 2 25 2 24.9V16c0-.1.1-.3.2-.3 2.6-.9 10.6-3.6 18.2-3.6 7.5 0 15.899 2.7 18.5 3.6.1 0 .2.2.2.3v8.9z"/><path d="M18.7 24l6.4-3.7c.3-.2.3-.7 0-.8l-6.4-3.8c-.3-.2-.7 0-.7.4v7.4c0 .5.4.7.7.5z"/></g><!--Created by Nick Bluth from the Noun Project--></svg>
`,gc=class extends _t{constructor(i){super(i,{className:"psv-autorotate-button",hoverScale:!0,collapsable:!0,tabbable:!0,icon:dx,iconActive:ux}),this.plugin=this.viewer.getPlugin("autorotate"),this.plugin?.addEventListener(ps.type,this)}destroy(){this.plugin?.removeEventListener(ps.type,this),super.destroy()}isSupported(){return!!this.plugin}handleEvent(i){i instanceof ps&&this.toggleActive(i.autorotateEnabled)}onClick(){this.plugin.isEnabled()&&this.plugin.disableOnIdle(),this.plugin.toggle()}};gc.id="autorotate";var fx=ce.getConfigParser({autostartDelay:2e3,autostartOnIdle:!0,autorotateSpeed:ce.parseSpeed("2rpm"),autorotatePitch:null,autorotateZoomLvl:null,keypoints:null,startFromClosest:!0},{autostartOnIdle:(i,{rawConfig:e})=>i&&ce.isNil(e.autostartDelay)?(ce.logWarn("autostartOnIdle requires a non null autostartDelay"),!1):i,autorotateSpeed:i=>ce.parseSpeed(i),autorotatePitch:i=>ce.isNil(i)?null:ce.parseAngle(i,!0),autorotateZoomLvl:i=>ce.isNil(i)?null:Re.clamp(i,0,100)}),mc=16;function _r(i){return[i.yaw,i.pitch]}var ms=class extends dr{constructor(i,e){super(i,e),this.state={initialStart:!0,disableOnIdle:!1,enabled:!1,idx:-1,curve:[],startStep:null,endStep:null,startTime:null,stepDuration:null,remainingPause:null,lastTime:null,tooltip:null},this.state.initialStart=!ce.isNil(this.config.autostartDelay)}init(){super.init(),this.video=this.viewer.getPlugin("video"),this.markers=this.viewer.getPlugin("markers"),this.config.keypoints&&(this.setKeypoints(this.config.keypoints),delete this.config.keypoints),this.viewer.addEventListener(ye.StopAllEvent.type,this),this.viewer.addEventListener(ye.BeforeRenderEvent.type,this),this.video||this.viewer.addEventListener(ye.KeypressEvent.type,this)}destroy(){this.viewer.removeEventListener(ye.StopAllEvent.type,this),this.viewer.removeEventListener(ye.BeforeRenderEvent.type,this),this.viewer.removeEventListener(ye.KeypressEvent.type,this),delete this.video,delete this.markers,delete this.keypoints,super.destroy()}handleEvent(i){switch(i.type){case ye.StopAllEvent.type:this.stop();break;case ye.BeforeRenderEvent.type:{this.__beforeRender(i.timestamp);break}case ye.KeypressEvent.type:this.__onKeyPress(i.originalEvent);break}}setKeypoints(i){if(!i)this.keypoints=null;else{if(i.length<2)throw new ge("At least two points are required");this.keypoints=i.map((e,t)=>{let n={position:null,markerId:null,pause:0,tooltip:null},s;if(typeof e=="string"?n.markerId=e:ce.isExtendedPosition(e)?s=e:(n.markerId=e.markerId,n.pause=e.pause,s=e.position,e.tooltip&&typeof e.tooltip=="object"?n.tooltip=e.tooltip:typeof e.tooltip=="string"&&(n.tooltip={content:e.tooltip})),n.markerId){if(!this.markers)throw new ge(`Keypoint #${t} references a marker but the markers plugin is not loaded`);let r=this.markers.getMarker(n.markerId);n.position=_r(r.state.position)}else if(s)n.position=_r(this.viewer.dataHelper.cleanPosition(s));else throw new ge(`Keypoint #${t} is missing marker or position`);return n})}this.isEnabled()&&(this.stop(),this.start())}isEnabled(){return this.state.enabled}start(){this.isEnabled()||(this.viewer.stopAll(),this.keypoints?this.config.startFromClosest&&this.__shiftKeypoints():this.__animate(),this.state.initialStart=!1,this.state.disableOnIdle=!1,this.state.enabled=!0,this.dispatchEvent(new ps(!0)))}stop(){this.isEnabled()&&(this.__hideTooltip(),this.__reset(),this.viewer.stopAnimation(),this.viewer.dynamics.position.stop(),this.viewer.dynamics.zoom.stop(),this.state.enabled=!1,this.dispatchEvent(new ps(!1)))}toggle(){this.isEnabled()?this.stop():this.start()}reverse(){this.isEnabled()&&!this.keypoints&&(this.config.autorotateSpeed=-this.config.autorotateSpeed,this.__animate())}disableOnIdle(){this.state.disableOnIdle=!0}__animate(){let i;ce.isNil(this.config.autorotateZoomLvl)?i=Promise.resolve(!0):i=this.viewer.animate({zoom:this.config.autorotateZoomLvl,speed:`${this.viewer.config.zoomSpeed*2}rpm`}),i.then(e=>{e&&(this.viewer.dynamics.position.roll({yaw:this.config.autorotateSpeed<0},Math.abs(this.config.autorotateSpeed/this.viewer.config.moveSpeed)),ce.isNil(this.config.autorotatePitch)||this.viewer.dynamics.position.goto({pitch:this.config.autorotatePitch},Math.abs(this.config.autorotateSpeed/this.viewer.config.moveSpeed)))})}__reset(){this.state.idx=-1,this.state.curve=[],this.state.startStep=null,this.state.endStep=null,this.state.startTime=null,this.state.stepDuration=null,this.state.remainingPause=null,this.state.lastTime=null,this.state.tooltip=null}__beforeRender(i){(this.state.initialStart||this.config.autostartOnIdle&&!this.state.disableOnIdle)&&this.viewer.state.idleTime>0&&i-this.viewer.state.idleTime>this.config.autostartDelay&&this.start(),this.isEnabled()&&this.keypoints&&(this.state.startTime||(this.state.endStep=_r(this.viewer.getPosition()),this.__nextStep(),this.state.startTime=i,this.state.lastTime=i),this.__nextFrame(i))}__shiftKeypoints(){let i=_r(this.viewer.getPosition()),e=this.__findMinIndex(this.keypoints,t=>ce.greatArcDistance(t.position,i));this.keypoints.push(...this.keypoints.splice(0,e))}__incrementIdx(){this.state.idx++,this.state.idx===this.keypoints.length&&(this.state.idx=0)}__showTooltip(){let i=this.keypoints[this.state.idx];if(i.tooltip){let e=this.viewer.dataHelper.vector3ToViewerCoords(this.viewer.state.direction);this.state.tooltip=this.viewer.createTooltip({content:i.tooltip.content,position:i.tooltip.position,top:e.y,left:e.x})}else if(i.markerId){let e=this.markers.getMarker(i.markerId);e.showTooltip(),this.state.tooltip=e.tooltip}}__hideTooltip(){if(this.state.tooltip){let i=this.keypoints[this.state.idx];i.tooltip?this.state.tooltip.hide():i.markerId&&this.markers.getMarker(i.markerId).hideTooltip(),this.state.tooltip=null}}__nextPoint(){let i=[];if(this.state.idx===-1){let s=_r(this.viewer.getPosition());i.push(s,s,this.keypoints[0].position,this.keypoints[1].position)}else for(let s=-1;s<3;s++){let r=this.state.idx+s<0?this.keypoints[this.keypoints.length-1]:this.keypoints[(this.state.idx+s)%this.keypoints.length];i.push(r.position)}let e=[new Oe(i[0][0],i[0][1])],t=0;for(let s=1;s<=3;s++){let r=i[s-1][0]-i[s][0];r>Math.PI?t+=1:r<-Math.PI&&(t-=1),t!==0&&s===1&&(e[0].x-=t*2*Math.PI,t=0),e.push(new Oe(i[s][0]+t*2*Math.PI,i[s][1]))}let n=new Os(e).getPoints(mc*3).map(s=>[s.x,s.y]);this.state.curve=n.slice(mc+1,mc*2+1),this.state.idx!==-1?(this.state.remainingPause=this.keypoints[this.state.idx].pause,this.state.remainingPause?this.__showTooltip():this.__incrementIdx()):this.__incrementIdx()}__nextStep(){this.state.curve.length===0&&(this.__nextPoint(),this.state.endStep[0]=ce.parseAngle(this.state.endStep[0])),this.state.startStep=this.state.endStep,this.state.endStep=this.state.curve.shift();let i=ce.greatArcDistance(this.state.startStep,this.state.endStep);this.state.stepDuration=i*1e3/Math.abs(this.config.autorotateSpeed),i===0&&this.__nextStep()}__nextFrame(i){let e=i-this.state.lastTime;if(this.state.lastTime=i,this.state.remainingPause){if(this.state.remainingPause=Math.max(0,this.state.remainingPause-e),this.state.remainingPause>0)return;this.__hideTooltip(),this.__incrementIdx(),this.state.startTime=i}let t=(i-this.state.startTime)/this.state.stepDuration;t>=1&&(this.__nextStep(),t=0,this.state.startTime=i),this.viewer.rotate({yaw:this.state.startStep[0]+(this.state.endStep[0]-this.state.startStep[0])*t,pitch:this.state.startStep[1]+(this.state.endStep[1]-this.state.startStep[1])*t})}__findMinIndex(i,e){let t=0,n=Number.MAX_VALUE;return i.forEach((s,r)=>{let o=e(s);o<n&&(n=o,t=r)}),t}__onKeyPress(i){this.viewer.state.keyboardEnabled&&i.key===Gi.KEY_CODES.Space&&!i.ctrlKey&&!i.altKey&&!i.shiftKey&&!i.metaKey&&(this.toggle(),i.preventDefault())}};ms.id="autorotate";ms.VERSION="5.13.3";ms.configParser=fx;ms.readonlyOptions=["keypoints"];us(gc,"start");ri.lang[gc.id]="Automatic rotation";window.PSV={Viewer:Uf,MarkersPlugin:fs,AutorotatePlugin:ms};})();
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
/*!
 * Photo Sphere Viewer 5.13.3
 * @copyright 2014-2015 Jérémy Heleine
 * @copyright 2015-2025 Damien "Mistic" Sorel
 * @licence MIT (https://opensource.org/licenses/MIT)
 */
/*!
 * Photo Sphere Viewer / Markers Plugin 5.13.3
 * @copyright 2015-2025 Damien "Mistic" Sorel
 * @licence MIT (https://opensource.org/licenses/MIT)
 */
/*!
 * Photo Sphere Viewer / Autorotate Plugin 5.13.3
 * @copyright 2015-2025 Damien "Mistic" Sorel
 * @licence MIT (https://opensource.org/licenses/MIT)
 */
