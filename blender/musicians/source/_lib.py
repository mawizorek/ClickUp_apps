import numpy as np, json, struct
from scipy.spatial import ConvexHull

def nrm(v): v=np.asarray(v,float); return v/np.linalg.norm(v)

def hull(pts):
    pts=np.asarray(pts,float)
    h=ConvexHull(pts)
    used=np.unique(h.simplices)
    remap={o:i for i,o in enumerate(used)}
    V=pts[used]; F=[]
    c=V.mean(0)
    for s,eq in zip(h.simplices,h.equations):
        a,b,cc=[remap[i] for i in s]
        n=np.cross(V[b]-V[a],V[cc]-V[a])
        if np.dot(n,eq[:3])<0: b,cc=cc,b
        F.append((a,b,cc))
    return V,np.array(F)

def frame(axis, ref=(0,0,1)):
    u=nrm(axis); r=np.asarray(ref,float)
    if abs(np.dot(u,nrm(r)))>0.95: r=np.array([1.,0,0])
    a=nrm(np.cross(u,r)); b=np.cross(u,a)  # wait: a perpendicular, b perpendicular
    return u,a,b

def ring(c,axis,r1,r2,n,ref=(0,0,1),phase=0.0):
    u,a,b=frame(axis,ref)
    return [np.asarray(c)+r1*np.cos(t)*a+r2*np.sin(t)*b for t in np.linspace(0,2*np.pi,n,endpoint=False)+phase]

def seg(a,b,ra,rb,n=6,ext=0.015,ref=(0,0,1)):
    a=np.asarray(a,float); b=np.asarray(b,float); u=nrm(b-a)
    return hull(ring(a-ext*u,u,ra,ra,n,ref,np.pi/n)+ring(b+ext*u,u,rb,rb,n,ref,np.pi/n))

def icosa(sub=1):
    t=(1+5**.5)/2
    V=[(-1,t,0),(1,t,0),(-1,-t,0),(1,-t,0),(0,-1,t),(0,1,t),(0,-1,-t),(0,1,-t),(t,0,-1),(t,0,1),(-t,0,-1),(-t,0,1)]
    V=[nrm(v) for v in V]
    F=[(0,11,5),(0,5,1),(0,1,7),(0,7,10),(0,10,11),(1,5,9),(5,11,4),(11,10,2),(10,7,6),(7,1,8),(3,9,4),(3,4,2),(3,2,6),(3,6,8),(3,8,9),(4,9,5),(2,4,11),(6,2,10),(8,6,7),(9,8,1)]
    for _ in range(sub):
        cache={}; NF=[]
        def mid(i,j):
            k=tuple(sorted((i,j)))
            if k not in cache: V.append(nrm((V[i]+V[j])/2)); cache[k]=len(V)-1
            return cache[k]
        for a,b,c in F:
            ab,bc,ca=mid(a,b),mid(b,c),mid(c,a); NF+= [(a,ab,ca),(b,bc,ab),(c,ca,bc),(ab,bc,ca)]
        F=NF
    return np.array(V)

def blob(c,radii,fwd=(0,-1,0),up=(0,0,1),sub=1):
    f=nrm(fwd); up=np.asarray(up,float); s=nrm(np.cross(f,up)); up2=np.cross(s,f)
    P=icosa(sub)
    pts=[np.asarray(c)+p[0]*radii[0]*s+p[1]*radii[1]*f+p[2]*radii[2]*up2 for p in P]
    return hull(pts)

def box(c,size,u=(1,0,0),v=(0,1,0)):
    u=nrm(u); v=nrm(np.asarray(v)-np.dot(v,u)*u); w=np.cross(u,v)
    c=np.asarray(c,float); pts=[]
    for i in (-1,1):
        for j in (-1,1):
            for k in (-1,1): pts.append(c+i*size[0]/2*u+j*size[1]/2*v+k*size[2]/2*w)
    return hull(pts)

def rod(a,b,wid,dep,ref=(0,0,1)):
    a=np.asarray(a,float);b=np.asarray(b,float); u=nrm(b-a); _,p,q=frame(u,ref)
    pts=[]
    for e in (a,b):
        for i in (-1,1):
            for j in (-1,1): pts.append(e+i*wid/2*p+j*dep/2*q)
    return hull(pts)


CANON=dict(UA=0.29,FA=0.26,HAND=0.10,TH=0.41,SH=0.42,FOOT=0.17)
def ik2(A,T,a,b,P):
    A,T,P=[np.asarray(x,float) for x in (A,T,P)]
    v=T-A; d=np.linalg.norm(v); u=v/d
    d=min(max(d,abs(a-b)+1e-3),a+b-1e-3); T2=A+d*u
    ca=(a*a+d*d-b*b)/(2*a*d); sa=np.sqrt(max(0,1-ca*ca))
    w=(P-A)-np.dot(P-A,u)*u; w=nrm(w)
    return A+a*(ca*u+sa*w), T2
def canon(J):
    for s_ in ('L','R'):
        sh,el,wr,ha=J['arm'+s_]; e2,w2=ik2(sh,wr,CANON['UA'],CANON['FA'],el)
        J['arm'+s_]=[np.asarray(sh,float),e2,w2,w2+CANON['HAND']*nrm(np.asarray(ha)-np.asarray(wr))]
        hp,kn,an,to=J['leg'+s_]; k2,a2=ik2(hp,an,CANON['TH'],CANON['SH'],kn)
        J['leg'+s_]=[np.asarray(hp,float),k2,a2,a2+CANON['FOOT']*nrm(np.asarray(to)-np.asarray(an))]
    sp=[np.asarray(x,float) for x in J['spine']]
    J['neck']=sp[3]+0.08*nrm(np.asarray(J['neck'])-sp[3])
    J['head']=J['neck']+0.095*nrm(np.asarray(J['head'])-J['neck'])
    return J

# ---------- figure (named rigid parts, pivot = proximal joint, tail = distal joint) ----------
def figure(J):
    P={}  # name -> (meshes, pivot, tail, parent)
    sp=[np.asarray(x,float) for x in J['spine']]
    dims=[(0.18,0.12),(0.155,0.105),(0.18,0.12),(0.21,0.095)]
    def rings(idx):
        pts=[]
        for i in idx:
            c=sp[i]; rx,ry=dims[i]
            u=nrm(sp[min(i+1,3)]-sp[max(i-1,0)]); s_=np.array([1.,0,0]); s_=nrm(s_-np.dot(s_,u)*u); f=np.cross(u,s_)
            for t in np.linspace(0,2*np.pi,8,endpoint=False)+np.pi/8: pts.append(c+rx*np.cos(t)*s_+ry*np.sin(t)*f)
        return pts
    P['Pelvis']=([hull(rings([0,1]))],sp[0],sp[1],None)
    P['Chest']=([hull(rings([1,2,3]))],sp[1],sp[3],'Pelvis')
    nk=np.asarray(J['neck'],float); hd=np.asarray(J['head'],float); hup=nrm(J.get('headup',(0,0,1)))
    P['Neck']=([seg(sp[3],nk,0.056,0.05,6)],sp[3],nk,'Chest')
    P['Head']=([blob(hd,(0.085,0.105,0.115),fwd=J['gaze'],up=hup,sub=1)],nk,nk+0.21*nrm(hd-nk),'Neck')
    for side in ('L','R'):
        sh,el,wr,ha=[np.asarray(x,float) for x in J['arm'+side]]
        P['UpperArm.'+side]=([blob(sh,(0.068,)*3,sub=0),seg(sh,el,0.060,0.048)],sh,el,'Chest')
        P['Forearm.'+side]=([blob(el,(0.049,)*3,sub=0),seg(el,wr,0.047,0.034)],el,wr,'UpperArm.'+side)
        hdv=nrm(ha-wr)
        P['Hand.'+side]=([hull([wr+p for p in np.array(ring((0,0,0),hdv,0.028,0.018,6))]+
                          [ha+p for p in np.array(ring((0,0,0),hdv,0.034,0.014,6))]+[ha+0.03*hdv])],wr,ha+0.03*hdv,'Forearm.'+side)
    for side in ('L','R'):
        hp,kn,an,to=[np.asarray(x,float) for x in J['leg'+side]]
        P['Thigh.'+side]=([seg(hp,kn,0.092,0.064)],hp,kn,'Pelvis')
        P['Shin.'+side]=([blob(kn,(0.064,)*3,sub=0),seg(kn,an,0.058,0.040)],kn,an,'Thigh.'+side)
        d=nrm(to-an); s_=nrm(np.cross(d,(0,0,1)))
        heel=an-0.05*d; heel[2]=0.0; toe=to.copy(); toe[2]=to[2]-0.03
        pts=[an+0.035*s_,an-0.035*s_,an-0.03*d+0.03*s_,an-0.03*d-0.03*s_,heel+0.035*s_,heel-0.035*s_,
             toe+0.04*s_,toe-0.04*s_,to+0.035*s_+np.array([0,0,0.015]),to-0.035*s_+np.array([0,0,0.015])]
        P['Foot.'+side]=([hull(pts)],an,to,'Shin.'+side)
    return P

# ---------- chair (shared) ----------
def chair():
    P=[box((0,0,0.44),(0.44,0.42,0.04))]
    for x in (-0.19,0.19):
        P.append(rod((x,-0.18,0.0),(x,-0.17,0.43),0.03,0.03))
        P.append(rod((x,0.18,0.0),(x,0.20,0.86),0.03,0.03,ref=(1,0,0)))
    P.append(box((0,0.215,0.73),(0.40,0.025,0.20),u=(1,0,0),v=nrm((0,1,0.08))))
    P.append(rod((-0.19,-0.17,0.12),(0.19,-0.17,0.12),0.02,0.02,ref=(0,1,0)))
    return P

# ---------- instruments ----------
class Inst:
    def __init__(s,O,u,n0):
        s.O=np.asarray(O,float); s.u=nrm(u); n=np.asarray(n0,float); n=nrm(n-np.dot(n,s.u)*s.u); s.n=n; s.w=np.cross(s.n,s.u)
    def p(s,l,w,t): return s.O+l*s.u+w*s.w+t*s.n
    def bout(s,lc,hl,hw,layers,k=10):
        pts=[]
        for t,sc in layers:
            for a in np.linspace(0,2*np.pi,k,endpoint=False):
                pts.append(s.p(lc+hl*sc*np.cos(a),hw*sc*np.sin(a),t))
        return hull(pts)
    def bar(s,l0,l1,w0,w1,t0,t1):
        pts=[]
        for l,w in ((l0,w0),(l1,w1)):
            for i in (-1,1):
                for t in (t0,t1): pts.append(s.p(l,i*w/2,t))
        return hull(pts)
    def knob(s,l,t,r): return blob(s.p(l,0,t),(r,r*1.3,r),fwd=s.u,up=s.n,sub=0)

def violin(I):
    L=[(-0.03,0.82),(-0.012,1.0),(0.012,1.0),(0.03,0.82)]
    return [I.bout(0.10,0.105,0.103,L),I.bout(0.27,0.09,0.084,L),
            I.bar(0.30,0.53,0.024,0.03,0.012,0.035),I.knob(0.565,0.02,0.022)]

def cello(I):
    L=[(-0.10,0.82),(-0.06,1.0),(0.06,1.0),(0.10,0.82)]
    return [I.bar(0.0,0.28,0.012,0.02,-0.006,0.006),
            I.bout(0.46,0.21,0.22,L),I.bout(0.82,0.18,0.17,L),
            I.bar(0.92,1.31,0.05,0.06,0.03,0.08),I.knob(1.35,0.05,0.045)]

def guitar(I):
    L=[(-0.05,0.97),(-0.04,1.0),(0.04,1.0),(0.05,0.97)]
    P=[I.bout(0.135,0.135,0.185,L,12),I.bout(0.385,0.11,0.14,L,12),
       I.bar(0.46,0.86,0.052,0.05,0.02,0.06),I.bar(0.85,1.02,0.075,0.07,0.01,0.03)]
    hole=[]
    for t in (0.050,0.054):
        for a in np.linspace(0,2*np.pi,8,endpoint=False): hole.append(I.p(0.32+0.043*np.cos(a),0.043*np.sin(a),t))
    return P,[hull(hole)]

def bow(a,d,length):
    a=np.asarray(a,float); d=nrm(d); b=a+length*d
    return [rod(a,b,0.012,0.008), rod(a,a+0.05*d,0.018,0.025)]

