"""Vertex Vera · performer v4.3: smooth lofted parts (Michael 11-21: fewer visible vertex lines). v4.2 (feet re-carved after Michael 11-20 21:26 'i dont like their feet'). Lineage: v4.0, form language E 'Brancusi' (picked 23:18), v4.1 pass: 'scarecrow / tin man' read (23:21):
generic, convincing shapes assembled into a persona. One ovoid per bone, no hands/feet/face detail.
Rest skeleton = v3.2 rest (same names, pivots, canonical lengths). Blender space: m, Z up, faces -Y, left +X.
Writes ../build/performer (generated, not committed)."""
import os, sys, json, pickle, numpy as np
HERE=os.path.dirname(os.path.abspath(__file__)); exec(open(os.path.join(HERE,'_lib.py')).read())
OUT=os.path.join(HERE,'..','build','performer')
FRONT=np.array([0.,-1.,0.]); N=16   # v4.3: 16 sides + densified rows, lofted (quads + shared verts) so Blender shades it smooth
def frm(a,b,ref=None):
    R=FRONT if ref is None else np.asarray(ref,float)
    u=nrm(b-a); f=R-np.dot(R,u)*u; f=nrm(f) if np.linalg.norm(f)>1e-3 else np.array([0,0,1.]); return u,np.cross(u,f),f
def _densify(rows):
    # v4.3: insert a PCHIP-interpolated row between every pair, so the profile curves instead of stepping
    from scipy.interpolate import PchipInterpolator
    rows=[tuple(r)+((0.0,) if len(r)==3 else ()) for r in rows]
    T=np.array([r[0] for r in rows]); cols=[PchipInterpolator(T,np.array([r[k] for r in rows])) for k in (1,2,3)]
    ts=sorted(set(list(T)+[(a+b)/2 for a,b in zip(T[:-1],T[1:])]))
    return [(t,float(cols[0](t)),float(cols[1](t)),float(cols[2](t))) for t in ts]
def loft(rings):
    """rings: list of (n,3) arrays along the part. Returns (V,F): one shared-vertex loft, closed by a fan cap at each end."""
    R=len(rings); n=len(rings[0]); V=np.concatenate(rings+[rings[0].mean(0)[None],rings[-1].mean(0)[None]]); c0=R*n; c1=c0+1; F=[]
    for r in range(R-1):
        for i in range(n):
            a=r*n+i; b=r*n+(i+1)%n; c=(r+1)*n+(i+1)%n; d=(r+1)*n+i; F+=[(a,b,c),(a,c,d)]
    for i in range(n): F+=[(c0,(i+1)%n,i),(c1,(R-1)*n+i,(R-1)*n+(i+1)%n)]
    F=np.array(F); cen=V.mean(0)
    for k,(a,b,c) in enumerate(F):   # orient every triangle outward
        nn=np.cross(V[b]-V[a],V[c]-V[a])
        if np.dot(nn,(V[a]+V[b]+V[c])/3-cen)<0: F[k]=(a,c,b)
    return V,F
def ovoid(a,b,rows,n=N,sole=None,sole_line=None,ref=None):
    a=np.asarray(a,float);b=np.asarray(b,float);u,s_,f=frm(a,b,ref);L=np.linalg.norm(b-a);rings=[]
    for t,w,d,off in _densify(rows):
        c=a+t*L*u; ring=[]
        for th in np.linspace(0,2*np.pi,n,endpoint=False)+np.pi/n:
            sv=np.sin(th)
            if sole is not None: sv=max(sv,sole)
            fc=off+d*sv
            if sole_line is not None: fc=max(fc,sole_line[0]+sole_line[1]*t)
            ring.append(c+w*np.cos(th)*s_+fc*f)
        rings.append(np.array(ring))
    return loft(rings)
# Form recipe per bone: rows of (t along bone, half-width, half-depth). Shared by every pose.
RECIPE={
 # v4.1 rule: every part is a turned, made object. Ends are blunt caps, never points, so parts butt together like an assembled figure.
 'Pelvis':  [(-0.42,0.08,0.065),(-0.2,0.135,0.10),(0.35,0.145,0.105),(0.85,0.12,0.088),(1.02,0.085,0.065)],
 'Chest':   [(-0.06,0.095,0.072),(0.2,0.13,0.095),(0.62,0.16,0.108),(0.92,0.165,0.092),(1.05,0.11,0.06)],
 'Neck':    [(-0.15,0.042,0.042),(0.5,0.04,0.04),(1.1,0.042,0.042)],
 'Head':    [(-0.02,0.04,0.045),(0.15,0.075,0.085),(0.5,0.092,0.102),(0.85,0.08,0.088),(1.08,0.045,0.05)],
 'UpperArm':[(-0.12,0.042,0.042),(0.0,0.052,0.052),(0.4,0.052,0.052),(1.0,0.037,0.037),(1.07,0.028,0.028)],
 'Forearm': [(-0.06,0.028,0.028),(0.04,0.038,0.038),(0.4,0.04,0.04),(1.0,0.025,0.025),(1.07,0.019,0.019)],
 'Hand':    [(-0.05,0.02,0.017),(0.3,0.03,0.022),(0.75,0.027,0.02),(1.0,0.012,0.011)],
 'Thigh':   [(-0.08,0.055,0.055),(0.04,0.078,0.078),(0.4,0.082,0.082),(1.0,0.054,0.054),(1.07,0.04,0.04)],
 'Shin':    [(-0.06,0.04,0.04),(0.04,0.053,0.053),(0.4,0.055,0.055),(1.0,0.031,0.031),(1.035,0.026,0.026)],  # v4.2: ankle cap tucks inside the heel, no peg
 'Foot':    [(-0.35,0.03,0.035),(0.0,0.042,0.042),(0.55,0.045,0.04),(1.0,0.025,0.022)],
}
SOLE={}  # v4.2: feet use FOOT_SOLE_LINE instead   # flat sole: clamp the downward half of each foot ring (pose-independent, in the foot's own frame)

# v4.2 FOOT: a turned wooden shoe. Heel sits under the shin, instep covers the ankle, low rounded toe, flat sole.
# The sole line is measured once on the rest skeleton (floor in the foot's own frame) and then rides with the bone,
# so the sole stays flat to the foot in every pose and sits exactly on z=0 at rest.
def _sole_line(skel):
    A,T,_=skel['Foot.L']; A=np.asarray(A,float); T=np.asarray(T,float); u,s_,f=frm(A,T,UP); L=np.linalg.norm(T-A)
    g=lambda t: -(A+t*L*u)[2]/f[2]
    return (g(0.0), g(1.0)-g(0.0))
_TOP={-0.40:0.000,-0.30:0.014,0.0:0.034,0.35:0.022,0.7:0.013,1.0:0.007,1.06:0.001}
_W  ={-0.40:0.020,-0.30:0.034,0.0:0.044,0.35:0.048,0.7:0.045,1.0:0.033,1.06:0.019}
def _foot_rows(sl):
    rows=[]
    for t in sorted(_TOP):
        bot=sl[0]+sl[1]*t-0.012; top=_TOP[t]
        if t<=-0.40: bot=sl[0]+sl[1]*t+0.012   # rounded heel cap stays just off the floor
        rows.append((t,_W[t],(top-bot)/2,(top+bot)/2))
    return rows
FOOT_SOLE_LINE=None; FOOT_ROWS=None
UP=np.array([0.,0.,1.])  # v4.2: feet take their 'up' from the floor at rest, not from FRONT (FRONT rolled the toed-out feet onto their edges)
def recipe(name): return RECIPE[name.split('.')[0]]
def dress(skel):
    """skel: {part: (pivot, tail, parent)} -> {part: ([mesh], pivot, tail, parent)}"""
    out={}
    for n,(pv,tl,par) in skel.items():
        pv=np.asarray(pv,float); tl=np.asarray(tl,float)
        if n=='Head':  # head ovoid tilts with the bone; extra length past the tail closes the crown
            m=ovoid(pv,tl,recipe(n))
        elif n.startswith('Foot'): m=ovoid(pv,tl,FOOT_ROWS,sole_line=FOOT_SOLE_LINE,ref=UP)
        else: m=ovoid(pv,tl,recipe(n))
        out[n]=([m],pv,tl,par)
    return out
if __name__=='__main__':
    SK=json.load(open(os.path.join(HERE,'..','data','performer_rest_skeleton.json')))['parts']
    skel={n:(np.array(v['head']),np.array(v['tail']),v['parent']) for n,v in SK.items()}
    FOOT_SOLE_LINE=_sole_line(skel); FOOT_ROWS=_foot_rows(FOOT_SOLE_LINE)
    P=dress(skel)
    zmin=min(V[:,2].min() for ms,*_ in P.values() for V,F in ms)
    if abs(zmin)>0.002:  # lift onto the floor; recorded, never silent
        lift=np.array([0,0,-zmin]); P={n:([(V+lift,F) for V,F in ms],pv+lift,tl+lift,p) for n,(ms,pv,tl,p) in P.items()}
    from collections import Counter
    def closed(F):
        e=Counter()
        for a,b,c in F:
            for x,y in ((a,b),(b,c),(c,a)): e[tuple(sorted((x,y)))]+=1
        return all(v==2 for v in e.values())
    rep={'issues':[],'floor_lift_m':round(float(-zmin),4)}
    for n,(ms,pv,tl,p) in P.items():
        if not all(closed(F) for V,F in ms): rep['issues'].append(n+': open mesh')
    rep['height_m']=round(float(max(V[:,2].max() for ms,*_ in P.values() for V,F in ms)),3)
    rep['triangles']=int(sum(len(F) for ms,*_ in P.values() for V,F in ms))
    rep['lengths']={n:round(float(np.linalg.norm(tl-pv)),4) for n,(ms,pv,tl,p) in P.items()}
    os.makedirs(OUT,exist_ok=True)
    man=dict(schema='maw-performer-manifest',version='4.3',asset='MUS_Performer',style='E Brancusi: one ovoid per bone',
        units='meters',up='+Z',facing='-Y',performer_left='+X',origin='floor, between the feet',
        rest='relaxed standing (v3.2 skeleton)',canonical_lengths=dict(UA=0.29,FA=0.26,HAND=0.13,TH=0.41,SH=0.42,FOOT=0.17),
        height_m=rep['height_m'],form_recipe=RECIPE,foot_rows=FOOT_ROWS,foot_sole_line=FOOT_SOLE_LINE,
        parts={n:dict(object=f'PERF_{n}',bone=f'DEF_{n}',parent=(f'DEF_{p}' if p else None),
              head=[round(float(x),5) for x in pv],tail=[round(float(x),5) for x in tl]) for n,(ms,pv,tl,p) in P.items()},
        note='Object origin = bone head. The form recipe is pose-independent: same shapes on any skeleton. v4.3: lofted, shared vertices, smooth normals.')
    json.dump(man,open(os.path.join(OUT,'performer_manifest.json'),'w'),indent=1)
    json.dump(rep,open(os.path.join(OUT,'validation_report.json'),'w'),indent=1)
    pickle.dump(P,open(os.path.join(OUT,'parts.pkl'),'wb'))
    print(json.dumps({k:v for k,v in rep.items() if k!='lengths'},indent=1))
