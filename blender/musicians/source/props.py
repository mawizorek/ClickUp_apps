# URITP musician SET v5.0 props (Vertex Vera, 2026-11-20). The performer is built separately (source/performer.py). Props in the performer's form language:
# E 'Brancusi' + 'scarecrow / tin man': every part a turned or pillowed made object, blunt caps, no points.
# Blender space: meters, Z up, front -Y, performer-left +X. Each prop authored in its own local space with origin at its natural pivot.
import os, sys, json, pickle, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _lib import hull, nrm
VERSION='5.0'
# ---- value plan (Greer): few steps, by role. sRGB grey.
MATS={'PERF':0.52,'INST':0.40,'ACCENT':0.20,'FURN':0.46,'PIANO':0.30,'KEYS':0.72}
class Fr:
    def __init__(s,O,u,n0):
        s.O=np.asarray(O,float); s.u=nrm(u); n=np.asarray(n0,float); s.n=nrm(n-np.dot(n,s.u)*s.u); s.w=np.cross(s.n,s.u)
    def p(s,l,w,t): return s.O+l*s.u+w*s.w+t*s.n
def pillow(F,lc,hl,hw,T,k=16,edge='round',pw=2.0):
    lay={'round':[(-1,0.78),(-0.62,0.96),(0,1.0),(0.62,0.96),(1,0.78)],'box':[(-1,0.95),(-0.75,1.0),(0.75,1.0),(1,0.95)]}[edge]
    pts=[]
    for tt,sc in lay:
        for a in np.linspace(0,2*np.pi,k,endpoint=False)+np.pi/k:
            c,s_=np.cos(a),np.sin(a); c=np.sign(c)*abs(c)**(2/pw); s_=np.sign(s_)*abs(s_)**(2/pw)
            pts.append(F.p(lc+hl*sc*c,hw*sc*s_,tt*T))
    return hull(pts)
def turned(F,rows,t0=0.0,n=12,flat=1.0):
    # rows: (l, radius). Ring in (w,t). flat<1 flattens along t. t0 offsets the axis along t.
    pts=[]
    for l,r in rows:
        for a in np.linspace(0,2*np.pi,n,endpoint=False)+np.pi/n: pts.append(F.p(l,r*np.cos(a),t0+flat*r*np.sin(a)))
    return hull(pts)
def rod(a,b,rows,n=10):
    a=np.asarray(a,float);b=np.asarray(b,float);u=b-a;L=np.linalg.norm(u);u/=L
    ref=np.array([0,0,1.]) if abs(u[2])<0.9 else np.array([1.,0,0]); F=Fr(a,u,ref)
    return turned(F,[(t*L,r) for t,r in rows],n=n)
def slab(c,U,V,hu,hv,T,pw=3.5,k=20,edge='round'):
    F=Fr(c,U,np.cross(nrm(U),nrm(V)))   # l along U, w along V... rebuild so w==V
    F.w=nrm(V); F.n=nrm(np.cross(F.u,F.w))
    return pillow(F,0,hu,hv,T,k=k,edge=edge,pw=pw)
def extrude(poly,z0,z1,inset=0.012):
    from shapely.geometry import Polygon
    P=Polygon(poly); Pi=P.buffer(-inset,join_style=2)
    pts=[(x,y,z0) for x,y in Pi.exterior.coords]+[(x,y,z0+inset*1.5) for x,y in P.exterior.coords]+\
        [(x,y,z1-inset*1.5) for x,y in P.exterior.coords]+[(x,y,z1) for x,y in Pi.exterior.coords]
    return hull(np.array(pts,float))

from scipy.interpolate import PchipInterpolator
PROF={ # normalized body outline: (l/L, halfwidth/Wmax). Pchip keeps it smooth without overshoot.
 'violin':[(0,0.30),(0.04,0.74),(0.12,0.95),(0.21,1.0),(0.31,0.92),(0.40,0.70),(0.48,0.57),(0.56,0.62),(0.65,0.77),(0.75,0.82),(0.85,0.75),(0.94,0.52),(1.0,0.18)],
 'cello': [(0,0.30),(0.04,0.74),(0.12,0.95),(0.21,1.0),(0.31,0.92),(0.40,0.70),(0.48,0.56),(0.56,0.61),(0.65,0.76),(0.75,0.80),(0.85,0.73),(0.94,0.50),(1.0,0.18)],
 'guitar':[(0,0.55),(0.05,0.86),(0.15,1.0),(0.26,0.97),(0.38,0.80),(0.50,0.64),(0.60,0.68),(0.72,0.76),(0.82,0.74),(0.92,0.60),(1.0,0.36)]}
def body(F,l0,L,W,T,prof,edge='round',n=22):
    x,y=zip(*PROF[prof]); f=PchipInterpolator(x,y)
    lay={'round':[(-1,0.84),(-0.6,0.97),(0,1.0),(0.6,0.97),(1,0.84)],'box':[(-1,0.96),(-0.8,1.0),(0.8,1.0),(1,0.96)]}[edge]
    ls=np.linspace(0,1,n+1); out=[]
    for a,b in zip(ls[:-1],ls[1:]):
        pts=[]
        for q in (a,b):
            hw=float(f(q))*W
            for tt,sc in lay:
                for sg in (-1,1): pts.append(F.p(l0+q*L,sg*hw*sc,tt*T))
        out.append(hull(pts))
    return out
TAPER=[(-0.02,0.7),(0.0,1.0),(0.5,0.92),(0.97,0.72),(1.0,0.5)]   # turned leg / peg profile (relative)
def leg(a,b,r): return rod(a,b,[(t,r*s) for t,s in TAPER])
# ---------------- instruments (authored in a frame F so the same recipe dresses rest or played placement)
def violin(F):
    return {'INST':body(F,0.0,0.356,0.103,0.030,'violin')+[
                    turned(F,[(0.32,0.010),(0.35,0.014),(0.52,0.012),(0.53,0.008)],t0=0.022,flat=0.8),
                    turned(F,[(0.525,0.010),(0.55,0.021),(0.585,0.019),(0.60,0.008)],t0=0.022)],
            'ACCENT':[turned(F,[(0.125,0.002),(0.13,0.016),(0.165,0.016),(0.17,0.002)],t0=0.034,flat=0.4)]}  # bridge pad: the one dark note
def cello(F):
    return {'INST':body(F,0.25,0.755,0.22,0.10,'cello')+[
                    turned(F,[(0.96,0.016),(1.00,0.026),(1.30,0.022),(1.31,0.014)],t0=0.07,flat=0.8),
                    turned(F,[(1.30,0.02),(1.34,0.044),(1.40,0.04),(1.42,0.016)],t0=0.07)],
            'ACCENT':[turned(F,[(0.0,0.003),(0.02,0.007),(0.27,0.007),(0.28,0.004)]),
                      turned(F,[(0.555,0.002),(0.56,0.03),(0.62,0.03),(0.625,0.002)],t0=0.10,flat=0.4)]}
def guitar(F):
    hs=Fr(F.p(0.86,0,0.03),F.u-0.18*F.n,F.n)   # headstock tilted back
    return {'INST':body(F,0.0,0.49,0.185,0.05,'guitar',edge='box')+[
                    turned(F,[(0.46,0.016),(0.49,0.026),(0.86,0.024),(0.87,0.016)],t0=0.035,flat=0.7),
                    pillow(hs,0.085,0.09,0.038,0.012,pw=3.0,k=16)],
            'ACCENT':[turned(F,[(0.287,0.002),(0.29,0.043),(0.37,0.043),(0.373,0.002)],t0=0.0505,flat=0.03)]}  # soundhole disc
def bow(a,d,L=0.74):
    a=np.asarray(a,float); d=nrm(d)
    return {'ACCENT':[rod(a,a+L*d,[(0,0.006),(0.02,0.0065),(0.98,0.0045),(1.0,0.003)],n=8),
                      rod(a-0.012*d,a+0.055*d,[(0,0.006),(0.1,0.014),(0.9,0.013),(1.0,0.006)],n=10),
                      rod(a+(L-0.01)*d,a+(L+0.012)*d,[(0,0.004),(0.5,0.008),(1,0.004)],n=8)]}
# ---------------- furniture / piano (local, origin on floor)
def footstool():
    return {'FURN':[slab((0,0,0.14),(1,0,0),(0,0.95,0.31),0.13,0.06,0.012),
                    leg((-0.10,0.05,0.135),(-0.11,0.07,0.0),0.012),leg((0.10,0.05,0.135),(0.11,0.07,0.0),0.012),
                    leg((-0.10,-0.04,0.10),(-0.11,-0.06,0.0),0.011),leg((0.10,-0.04,0.10),(0.11,-0.06,0.0),0.011)]}
def melody_chair():  # NPS 8200 Melody (SPAC tech spec v4 lists 12): seat 0.46, back to ~0.81
    P=[slab((0,0,0.445),(1,0,0),(0,1,0),0.215,0.205,0.022)]
    for sx in (-1,1):
        P+= [leg((sx*0.18,-0.17,0.435),(sx*0.21,-0.21,0.0),0.016), leg((sx*0.18,0.16,0.435),(sx*0.21,0.22,0.0),0.016),
             rod((sx*0.18,0.18,0.44),(sx*0.17,0.25,0.80),[(0,0.012),(0.5,0.013),(1,0.011)])]
    P.append(slab((0,0.235,0.70),(1,0,0),(0,0.25,0.97),0.205,0.09,0.014,pw=2.6))
    return {'FURN':P}
def music_stand():   # Manhasset Symphony (18 in inventory)
    P=[rod((0,0,0.10),(0,0,1.02),[(0,0.014),(0.5,0.012),(1.0,0.011)])]
    for k in range(3):
        a=np.pi/2+k*2*np.pi/3; P.append(leg((0,0,0.16),(0.30*np.cos(a),0.30*np.sin(a),0.0),0.011))
    up=nrm((0,0.36,0.93)); c=np.array([0,0.02,1.16])
    P.append(slab(c,(1,0,0),up,0.255,0.165,0.006,pw=5,k=24,edge='box'))
    P.append(rod(c-0.165*up+(-0.255,-0.02,0),c-0.165*up+(0.255,-0.02,0),[(0,0.008),(0.5,0.011),(1,0.008)]))
    return {'FURN':P}
CASE_A=[(-0.74,0.06),(0.74,0.06),(0.74,0.85),(-0.74,0.85)]
CASE_B=[(-0.74,0.85),(0.66,0.85),(0.51,1.15),(0.31,1.45),(0.11,1.75),(-0.14,2.0),(-0.44,2.11),(-0.69,2.08),(-0.74,1.95)]
LID_DEG=38.0; HINGE_X=-0.74; TOP=0.995
def lid_pt(p):
    x,y,z=p; dx=x-HINGE_X; t=np.radians(LID_DEG); return np.array([HINGE_X+dx*np.cos(t)-(z-TOP)*np.sin(t),y,TOP+dx*np.sin(t)+(z-TOP)*np.cos(t)])
def grand_piano():   # ~7 ft semi-concert grand. Size class: Steinway B, 211 x 148 cm. ASSUMED until measured.
    case=[extrude(CASE_A,0.64,0.99),extrude(CASE_B,0.64,0.99)]
    legs=[leg((-0.62,0.18,0.645),(-0.62,0.18,0.0),0.05),leg((0.58,0.18,0.645),(0.58,0.18,0.0),0.05),leg((-0.32,1.85,0.645),(-0.32,1.85,0.0),0.05)]
    keybed=[extrude([(-0.72,-0.17),(0.72,-0.17),(0.72,0.07),(-0.72,0.07)],0.60,0.70,0.008)]
    cheeks=[extrude([(sx-0.04,-0.17),(sx+0.04,-0.17),(sx+0.04,0.07),(sx-0.04,0.07)],0.60,0.78,0.008) for sx in (-0.68,0.68)]
    lyre=[rod((0,0.34,0.64),(0,0.30,0.09),[(0,0.03),(0.5,0.022),(1,0.03)])]
    pedals=[slab((px,0.20,0.065),(1,0,0),(0,1,0),0.018,0.07,0.008) for px in (-0.07,0.0,0.07)]
    desk=[slab((0,0.18,1.10),(1,0,0),nrm((0,0.40,0.92)),0.36,0.13,0.012,pw=4)]
    flap=[extrude([(-0.74,0.06),(0.74,0.06),(0.74,0.30),(-0.74,0.30)],0.99,1.005,0.006)]
    lidA=[(-0.74,0.30),(0.74,0.30),(0.74,0.85),(-0.74,0.85)]
    lid=[]
    for poly in (lidA,CASE_B):
        V,Fc=extrude(poly,0.99,1.012,0.006); lid.append((np.array([lid_pt(v) for v in V]),Fc))
    stick=[rod((0.20,1.02,0.99),(0.20,1.02,lid_pt((0.20,1.02,0.99))[2]-0.01),[(0,0.010),(0.5,0.012),(1,0.010)])]
    keys=[extrude([(-0.62,-0.15),(0.62,-0.15),(0.62,0.05),(-0.62,0.05)],0.70,0.725,0.004)]
    return {'Case':{'PIANO':case+legs+keybed+cheeks+lyre+pedals+desk+flap+stick},'Keys':{'KEYS':keys},'Lid':{'PIANO':lid}}
def piano_bench():
    P=[slab((0,0,0.47),(1,0,0),(0,1,0),0.38,0.18,0.035,pw=4)]
    for sx in (-1,1):
        for sy in (-1,1): P.append(leg((sx*0.33,sy*0.14,0.44),(sx*0.34,sy*0.15,0.0),0.022))
    return {'FURN':P}
# ---------------- rest-orientation frames (upright, front -Y) and sockets (prop-local)
UP=Fr((0,0,0),(0,0,1),(0,-1,0))
def sock(F,l,w,t): return [round(float(x),4) for x in F.p(l,w,t)]
PROPS={
 'Violin':  dict(code='VLN',parts={'Body':violin(UP)},pivot='tail end (chin end), body axis +Z, top faces -Y',
                 sockets={'CHIN':sock(UP,0.04,0.03,0.03),'GRIP.L':sock(UP,0.45,0,0.0),'BOW_CONTACT':sock(UP,0.17,0,0.045),'REST':sock(UP,0.2,0,-0.03)}),
 'ViolinBow':dict(code='VBW',parts={'Bow':bow((0,0,0),(0,0,1),0.74)},pivot='frog, stick axis +Z',sockets={'GRIP.R':[0,0,0.03],'MID':[0,0,0.37]}),
 'Cello':   dict(code='VC',parts={'Body':cello(UP)},pivot='endpin tip, body axis +Z, top faces -Y',
                 sockets={'ENDPIN':[0,0,0],'GRIP.L':sock(UP,1.15,0,0.07),'BOW_CONTACT':sock(UP,0.62,0,0.10),'KNEE.L':sock(UP,0.50,0.22,0),'KNEE.R':sock(UP,0.50,-0.22,0)}),
 'CelloBow':dict(code='CBW',parts={'Bow':bow((0,0,0),(0,0,1),0.71)},pivot='frog, stick axis +Z',sockets={'GRIP.R':[0,0,0.03],'MID':[0,0,0.355]}),
 'Guitar':  dict(code='GTR',parts={'Body':guitar(UP)},pivot='butt end, body axis +Z, top faces -Y',
                 sockets={'GRIP.L':sock(UP,0.80,0,0.035),'STRUM':sock(UP,0.33,0,0.05),'THIGH.L':sock(UP,0.27,0.0,-0.05),'REST':sock(UP,0.13,0,-0.05)}),
 'Footstool':dict(code='FST',parts={'Stool':footstool()},pivot='floor center',sockets={'FOOT.L':[0,0,0.15]}),
 'MelodyChair':dict(code='CHR',parts={'Chair':melody_chair()},pivot='floor center under seat',sockets={'SEAT':[0,0,0.468],'PROP_REST':[0,-0.12,0.468]}),
 'MusicStand':dict(code='STD',parts={'Stand':music_stand()},pivot='floor center',sockets={'DESK':[0,0.02,1.16]}),
 'GrandPiano':dict(code='PNO',parts=grand_piano(),pivot='floor, center of keyboard front',
                 sockets={'KEYS_L':[-0.55,-0.10,0.725],'KEYS_R':[0.55,-0.10,0.725],'MIDDLE_C':[-0.04,-0.10,0.725],'PEDAL_R':[0.07,0.20,0.075],
                          'LID_HINGE_AXIS':[[-0.74,0.06,0.995],[-0.74,2.11,0.995]],'LID_DEG':LID_DEG}),
 'PianoBench':dict(code='BNC',parts={'Bench':piano_bench()},pivot='floor center',sockets={'SEAT':[0,0,0.505]}),
}
def tri_count(parts): return sum(len(F) for byname in parts.values() for ms in byname.values() for V,F in ms)
def closed(F):
    from collections import Counter
    e=Counter(tuple(sorted((int(f[i]),int(f[(i+1)%3])))) for f in F for i in range(3)); return all(c==2 for c in e.values())
if __name__=='__main__':
    OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','build','props')

    os.makedirs(OUT,exist_ok=True)
    rep={'version':VERSION,'props':{},'issues':[]}
    for name,P in PROPS.items():
        pts=np.concatenate([V for byname in P['parts'].values() for ms in byname.values() for V,F in ms])
        bad=[f'{name}.{pn}' for pn,byname in P['parts'].items() for ms in byname.values() for V,F in ms if not closed(F)]
        rep['issues']+=bad
        rep['props'][name]=dict(triangles=tri_count(P['parts']),bbox_m=[round(float(x),3) for x in (pts.max(0)-pts.min(0))],zmin=round(float(pts[:,2].min()),4))
    man={'version':VERSION,'space':'Blender: meters, Z up, front -Y, left +X. Prop-local; origin = pivot.','materials_sRGB':MATS,
         'props':{n:dict(code=P['code'],pivot=P['pivot'],objects=list(P['parts'].keys()),sockets=P['sockets']) for n,P in PROPS.items()}}
    json.dump(man,open(os.path.join(OUT,'set_manifest.json'),'w'),indent=1)
    json.dump(rep,open(os.path.join(OUT,'validation_report.json'),'w'),indent=1)
    pickle.dump({n:P['parts'] for n,P in PROPS.items()},open(os.path.join(OUT,'props.pkl'),'wb'))
    print(json.dumps(rep,indent=1))
